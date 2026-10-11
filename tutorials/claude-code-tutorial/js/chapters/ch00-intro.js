/**
 * 第 0 章 · 什么是 Agent？
 */
export default {
  id: 'ch00',
  num: 0,
  title: '什么是 Agent？',
  subtitle: '在写第一行代码之前，先建立正确的心智模型',
  minutes: 8,
  sections: [
    {
      type: 'prose',
      html: `
<p>你大概已经用过 Claude Code 这类编程 agent：它不只是聊天，还会<b>读你的文件、跑命令、改代码</b>，然后回来汇报。看起来很神奇，但它没有任何魔法。</p>
<p>本站的目标是：把这份「神奇」拆成<b>四个可以理解的零件</b>，再用真实源码把它们逐个讲透。你还会顺带学到很多 TypeScript 和 JavaScript 的实战用法，因为我们会一直读、写这两种语言的代码。</p>
`,
    },
    {
      type: 'callout',
      tone: 'tip',
      title: '怎样使用本站',
      html: `
<p>建议开两个窗口：一个看本站，一个打开源码目录 <code>~/Projects/Agent/claude-code</code> 对照着读。每段代码卡片都标了<b>真实文件路径和行号</b>。看到没展开的细节时，点卡片上的<b>「查看真实源码 ↗」</b>按钮会弹出悬浮窗，直接展示那段真实代码：带行号，被引用的行会高亮。不用离开本站。</p>
<p>遇到代码卡片底部的小标签（比如 <em>泛型接口</em>、<em>async generator</em>），这是随代码附送的语言知识点，第 8 章会集中复习它们。</p>`,
    },
    { type: 'h2', text: '聊天机器人 ≠ Agent' },
    {
      type: 'prose',
      html: `
<p>普通聊天机器人和 agent 用的是<b>同一个模型</b>，差别在程序怎么用它：</p>
<table>
  <tr><th></th><th>聊天机器人</th><th>Agent</th></tr>
  <tr><td>模型能输出什么</td><td>文字</td><td>文字，或<b>工具调用请求</b></td></tr>
  <tr><td>程序拿到输出后</td><td>直接显示</td><td>检查：要调工具？就<b>真的去执行</b></td></tr>
  <tr><td>执行结果去哪</td><td>不存在</td><td>塞回对话历史，<b>让模型再看一眼</b></td></tr>
  <tr><td>何时结束</td><td>答完即止</td><td>模型不再请求工具时</td></tr>
</table>
<p>看出关键了吗？agent 程序和模型之间不是「一问一答」，而是一个<b>不断往复的循环</b>。这个循环就是整个 agent 的心跳。</p>`,
    },
    { type: 'h2', text: '四要素心智模型' },
    {
      type: 'flow',
      steps: [
        { title: '🧠 大脑', desc: 'LLM 模型本身。读对话、做决定：下一步说什么、调什么工具' },
        { title: '🔧 工具', desc: '模型的手。读文件、执行命令、搜索，本质上是带说明书的函数' },
        { title: '📚 上下文', desc: '模型的记忆。一个不断增长的消息数组 + 系统提示词' },
        { title: '🔁 循环', desc: '心跳。把上面三样串起来：请求→执行→回填→再请求', hi: true },
      ],
    },
    {
      type: 'callout',
      tone: 'key',
      title: '一句话记住它',
      html: '<p><b>Agent = 循环 + 工具 + 上下文，大脑是 LLM。</b>后续每一章，都是在把这四个零件中的一个放大来看。</p>',
    },
    { type: 'h2', text: '我们要解剖的仓库' },
    {
      type: 'prose',
      html: `
<p>本站的解剖对象是 <code>~/Projects/Agent/claude-code</code>，也就是 Claude Code CLI 的 TypeScript 源码。它有几十万行，但不用怕：核心机制集中在十来个文件里。</p>
<table>
  <tr><th>文件</th><th>角色</th><th>对应章节</th></tr>
  <tr><td><code>query.ts</code></td><td><b>agent 主循环</b>（心跳所在）</td><td>第 1、6 章</td></tr>
  <tr><td><code>Tool.ts</code> / <code>tools.ts</code></td><td>工具的「合同」与注册表</td><td>第 3 章</td></tr>
  <tr><td><code>services/tools/</code></td><td>工具执行流水线、并发调度</td><td>第 4 章</td></tr>
  <tr><td><code>utils/permissions/</code></td><td>权限门控（agent 的缰绳）</td><td>第 5 章</td></tr>
  <tr><td><code>constants/prompts.ts</code> / <code>context.ts</code></td><td>system prompt 与记忆注入</td><td>第 6 章</td></tr>
  <tr><td><code>entrypoints/</code> / <code>screens/REPL.tsx</code></td><td>启动与交互宿主</td><td>第 7 章</td></tr>
</table>
<p>最大的文件 <code>main.tsx</code>（约 80 万字节）你几乎<b>不用打开</b>。90% 的理解来自 <code>query.ts</code> 一个文件。</p>`,
    },
    { type: 'h2', text: '学习路线' },
    {
      type: 'prose',
      html: `
<ol>
  <li><b>第 1 章 心跳</b>：最小 agent 循环 + 可单步执行的模拟器（本站核心体验）</li>
  <li><b>第 2 章 消息</b>：循环里流动的数据长什么样</li>
  <li><b>第 3–4 章 工具</b>：模型的「手」如何定义、如何被调用</li>
  <li><b>第 5 章 权限</b>：怎么保证 agent 不闯祸</li>
  <li><b>第 6 章 上下文</b>：记忆塞满了怎么办</li>
  <li><b>第 7 章 全链路</b>：从敲下 <code>claude</code> 命令到看到回答</li>
  <li><b>第 8 章 语言课</b>：把一路上遇到的 TS/JS 特性汇总复习</li>
  <li><b>第 9 章 动手</b>：读懂并改造本站模拟器的迷你 agent</li>
</ol>`,
    },
    {
      type: 'quiz',
      q: 'agent 和普通聊天机器人的本质区别是什么？',
      options: [
        'agent 用了更聪明的模型',
        'agent 在模型外面包了一个循环：工具调用的结果会被回填，让模型继续',
        'agent 的回答没有经过训练',
        'agent 可以联网，机器人不能',
      ],
      answer: 1,
      explain:
        '同一个模型既可以当机器人也可以当 agent，区别全在程序如何消费模型的输出：机器人直接显示，agent 检查是否有工具调用、执行后回填历史、再次请求模型。',
    },
  ],
}
