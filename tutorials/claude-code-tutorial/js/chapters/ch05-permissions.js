/**
 * 第 5 章 · 缰绳：权限与安全
 */
export default {
  id: 'ch05',
  num: 5,
  title: '缰绳：权限与安全',
  subtitle: '为什么读文件不弹窗，写文件必须点头',
  minutes: 10,
  sections: [
    {
      type: 'prose',
      html: `
<p>一个能执行任意 shell 命令的程序，安全性怎么设计？claude-code 的答案是一个<b>三级决策器</b>。每次工具调用（第 4 章的第④道关卡）都会得到三种裁决之一：</p>
<ul>
  <li><b>allow</b>：放行，用户无感</li>
  <li><b>deny</b>：拒绝，错误信息回给模型</li>
  <li><b>ask</b>：弹窗问用户，用户点头才继续</li>
</ul>
<p>你平时用 claude-code 时偶尔弹的确认框，就是 ask 在工作。它的聪明之处在于<b>大多数请求根本不用弹窗</b>，两条规则把 ask 的次数压到最少：</p>
<ol>
  <li>规则先行：用户配置的 allow/deny 规则（如「永远允许 <code>npm test</code>」）直接裁决</li>
  <li>声明只读 + 路径在工作目录内 → 自动 allow</li>
</ol>`,
    },
    { type: 'h2', text: '只读为什么免确认' },
    {
      type: 'prose',
      html: `
<p>Read / Grep 这类工具在定义时声明了 <code>isReadOnly: true</code>（第 3 章你见过 GrepTool）。它们的权限检查走同一条链。核心裁决在下面这段：只要目标路径在允许的工作目录内，直接放行。</p>`,
    },
    {
      type: 'code',
      title: '工作目录内的读 = 自动放行',
      lang: 'ts',
      path: 'utils/permissions/filesystem.ts:1136-1151',
      note: '免确认的根源：读自己工作目录里的东西，风险低到不值得打扰用户',
      lessons: ['早返回 early return'],
      code: `  // 6. Allow reads in working directories
  const isInWorkingDir = pathInAllowedWorkingPath(
    path,
    toolPermissionContext,
    pathsToCheck,
  )
  if (isInWorkingDir) {
    return {
      behavior: 'allow',
      updatedInput: input,
      decisionReason: {
        type: 'mode',
        mode: 'default',
      },
    }
  }`,
    },
    {
      type: 'prose',
      html: `
<p>注意这个函数<b>不是从这开始的</b>：走到这里之前，已经依次检查过 read 类 deny 规则、ask 规则、UNC 网络路径（一种可能摸到网络资源的 Windows 路径写法）等。这段是链条<b>靠后的一环</b>：前面的规则都没命中，才轮到「工作目录内直接 allow」。越界路径或命中 deny 规则的，才会落到 ask/deny。</p>
<p>那 Bash 呢？<code>ls</code> 也免确认、<code>rm</code> 就要问。它没法声明一个恒定的 isReadOnly，所以改成<b>逐条解析命令</b>：</p>`,
    },
    {
      type: 'code',
      title: 'Bash 的只读判定：看命令内容',
      lang: 'ts',
      path: 'tools/BashTool/BashTool.tsx:434-441',
      note: 'ls/grep 等白名单命令视为只读；含 cd 的复合命令保守处理',
      lessons: ['按输入动态判定'],
      code: `  isConcurrencySafe(input) {
    return this.isReadOnly?.(input) ?? false;
  },
  isReadOnly(input) {
    const compoundCommandHasCd = commandHasAnyCd(input.command);
    const result = checkReadOnlyConstraints(input, compoundCommandHasCd);
    return result.behavior === 'allow';
  },`,
    },
    { type: 'h2', text: 'Fail-closed：把默认值当安全边界' },
    {
      type: 'prose',
      html: `
<p>回到第 3 章那个 <code>TOOL_DEFAULTS</code>。当时你可能觉得「isReadOnly 默认 false」只是随便选的默认值，现在可以看清它的分量：</p>
<table>
  <tr><th>默认值</th><th>如果反过来（fail-open）会发生什么</th></tr>
  <tr><td><code>isReadOnly: false</code></td><td>新工具忘了声明只读 → 被当成可写 → 至多多弹一次确认框，<b>绝不会静默放行写操作</b></td></tr>
  <tr><td><code>isConcurrencySafe: false</code></td><td>不确定能不能并发时，宁可串行，<b>绝不竞态</b></td></tr>
  <tr><td><code>checkPermissions</code> 放行</td><td>看似宽松，实则把裁决<b>交给通用权限系统</b>。不是放权，是换裁判</td></tr>
</table>
<p>这套思路有个名字：<b>fail-closed</b>（失败时关闭）。安全设计里，默认值应该选择「出错后更安全」的那一侧，哪怕代价是偶尔多打扰用户一次。对比日常开发常见的 fail-open（默认放行、出错再说），这是一个值得带走的通用原则。</p>`,
    },
    {
      type: 'callout',
      tone: 'warn',
      title: '权限不是 agent 的减速带，而是它的方向盘',
      html: '<p>很多人以为权限系统只是「防呆」。实际上它同时影响三件事：用户体验（ask 多少次）、并发性能（能不能并行跑）、以及 agent 的自主程度（哪些事它敢自己做）。设计工具时，<code>isReadOnly</code> / <code>isConcurrencySafe</code> 这两个声明值得像写 schema 一样认真。</p>',
    },
    {
      type: 'quiz',
      q: '为什么 Read、Grep 工具平时不弹确认框？',
      options: [
        '因为它们是内置工具，享有特权',
        '因为模型很少用它们',
        '它们声明 isReadOnly: true，且目标路径在允许的工作目录内 → 自动 allow',
        '因为确认框被用户关掉了',
      ],
      answer: 2,
      explain:
        '两个条件缺一不可：工具声明自己只读，并且访问的路径在允许的工作目录内。越界路径或命中 deny 规则仍会 ask/deny。Bash 则按命令内容逐条判定只读与否。',
    },
    {
      type: 'quiz',
      q: 'TOOL_DEFAULTS 里 isConcurrencySafe 默认为 false，体现了什么设计原则？',
      options: [
        '性能优先：串行更快',
        'fail-closed：不确定时选择更安全的默认行为',
        '历史遗留，没有特别含义',
        '为了让代码更简单',
      ],
      answer: 1,
      explain:
        'fail-closed：在信息不足时（新工具没声明能否并发），默认值选择「出错后更安全」的那一侧，宁可串行慢一点，也不冒并发竞态的风险。isReadOnly 默认 false 同理。',
    },
  ],
}
