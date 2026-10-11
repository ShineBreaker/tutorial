/**
 * 第 6 章 · 记忆：上下文管理
 */
export default {
  id: 'ch06',
  num: 6,
  title: '记忆：上下文管理',
  subtitle: '窗口有上限，预算要精打细算',
  minutes: 12,
  sections: [
    {
      type: 'prose',
      html: `
<p>模型的「记忆」只有一样东西：<b>每次请求都完整重发的上下文</b>。它分两部分：</p>
<ul>
  <li><b>system prompt</b>：程序拼好的「角色设定 + 工作规范」，模型开口前就知道</li>
  <li><b>messages</b>：不断增长的对话历史（第 2 章的主角）</li>
</ul>
<p>上下文窗口有上限（比如 200k token，token 是模型计量文本的最小单位），而 agent 干活最费的就是历史。这一章讲 claude-code 怎么「开源」（拼一份信息丰富的上下文）和「节流」（历史塞满了怎么办）。</p>`,
    },
    { type: 'h2', text: 'system prompt 是数组拼出来的' },
    {
      type: 'code',
      title: 'system prompt 拼装',
      lang: 'ts',
      path: 'constants/prompts.ts:560-577',
      note: '静态段在前（可缓存），分界线，动态段在后，顺序即成本',
      lessons: ['数组 + filter 收拢 null', 'prompt cache 概念'],
      code: `  return [
    // --- Static content (cacheable) ---
    getSimpleIntroSection(outputStyleConfig),
    getSimpleSystemSection(),
    outputStyleConfig === null ||
    outputStyleConfig.keepCodingInstructions === true
      ? getSimpleDoingTasksSection()
      : null,
    getActionsSection(),
    getUsingYourToolsSection(enabledTools),
    getSimpleToneAndStyleSection(),
    getOutputEfficiencySection(),
    // === BOUNDARY MARKER - DO NOT MOVE OR REMOVE ===
    ...(shouldUseGlobalCacheScope() ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY] : []),
    // --- Dynamic content (registry-managed) ---
    ...resolvedDynamicSections,
  ].filter(s => s !== null)`,
    },
    {
      type: 'prose',
      html: `
<p>为什么要分「静态段」和「动态段」，中间还立一块不许挪动的界碑？为了<b>省钱</b>。API 的 prompt caching 按前缀匹配：只要请求的开头部分和上次一字不差，那部分就按缓存价计费，约为原价一折。静态段是所有会话共享的固定内容，永远放前面吃缓存；每个会话才不同的动态内容（环境信息、语言、MCP 说明）放在边界之后。</p>
<p>那句 <code>DO NOT MOVE OR REMOVE</code> 的注释，守护的就是真实的账单。数组里的 <code>getSimpleDoingTasksSection()</code> 可能返回 null，结尾统一 <code>filter(s => s !== null)</code> 收掉，这是 JS 里「条件性加入数组元素」的惯用法。</p>`,
    },
    { type: 'h2', text: 'CLAUDE.md：四层记忆的注入点' },
    {
      type: 'prose',
      html: `
<p>你项目里的 <code>CLAUDE.md</code> / <code>AGENTS.md</code>（项目规约、个人偏好）是怎么进模型脑子的？入口是 <code>getUserContext()</code>。它按固定顺序收集四层记忆文件，拼成一个字符串放进上下文，顺带附上今天的日期：</p>`,
    },
    {
      type: 'code',
      title: 'getUserContext：记忆文件的读入与缓存',
      lang: 'ts',
      path: 'context.ts:155-189（有删节）',
      note: 'memoize：整个会话只算一次，之后直接返回缓存值',
      lessons: ['memoize 惰性缓存', '环境变量开关'],
      code: `export const getUserContext = memoize(
  async (): Promise<{
    [k: string]: string
  }> => {
    // CLAUDE_CODE_DISABLE_CLAUDE_MDS: hard off, always.
    // --bare: skip auto-discovery (cwd walk), BUT honor explicit --add-dir.
    // --bare means "skip what I didn't ask for", not "ignore what I asked for".
    const shouldDisableClaudeMd =
      isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS) ||
      (isBareMode() && getAdditionalDirectoriesForClaudeMd().length === 0)
    // Await the async I/O (readFile/readdir directory walk) so the event
    // loop yields naturally at the first fs.readFile.
    const claudeMd = shouldDisableClaudeMd
      ? null
      : getClaudeMds(filterInjectedMemoryFiles(await getMemoryFiles()))
    // ...（诊断日志，略）

    return {
      ...(claudeMd && { claudeMd }),
      currentDate: \`Today's date is \${getLocalISODate()}.\`,
    }
  },
)`,
    },
    {
      type: 'prose',
      html: `
<p>收集顺序（<code>utils/claudemd.ts</code> 的 <code>getMemoryFiles()</code>）值得记住：</p>
<table>
  <tr><th>层</th><th>位置</th><th>语义</th></tr>
  <tr><td>① Managed</td><td>组织统一下发的策略文件（如 <code>/etc/claude-code/CLAUDE.md</code>）</td><td>最先加载</td></tr>
  <tr><td>② User</td><td><code>~/.claude/CLAUDE.md</code></td><td>你的个人偏好，跨项目生效</td></tr>
  <tr><td>③ Project</td><td>从当前目录<b>逐层向上</b>找 <code>CLAUDE.md</code></td><td>项目规约，离代码越近越具体</td></tr>
  <tr><td>④ Local</td><td>项目里的 <code>CLAUDE.local.md</code></td><td>私人补充，不进 git，最后加载</td></tr>
</table>
<p>注意一个反直觉点：<b>加载顺序和优先级是反的</b>。源码注释写明文件按「越晚加载、权重越高」排序，模型对后面的内容更上心。所以项目规约会盖过你的全局偏好；Project 层内部也一样，离当前目录越近的文件越靠后、越算数。</p>`,
    },
    { type: 'h2', text: '历史塞满了：四级瘦身' },
    {
      type: 'prose',
      html: `
<p>agent 干一个大活，几十轮下来消息数组轻松膨胀到几十万 token。claude-code 在<b>每轮请求前</b>做梯度瘦身，能「精细剪」就绝不「整体砍」：</p>`,
    },
    {
      type: 'flow',
      steps: [
        { title: '① 预算裁剪', desc: '单条超大的工具结果按预算截断（applyToolResultBudget）' },
        { title: '② snip', desc: '把很老的历史片段成段剪掉，留下边界标记', hi: true },
        { title: '③ microcompact', desc: '把旧工具结果的内容换成占位符，消息结构保持不变', hi: true },
        { title: '④ autocompact', desc: '最后手段：把老对话整体折叠成一份摘要', hi: true },
      ],
    },
    {
      type: 'code',
      title: '主循环里的瘦身段',
      lang: 'ts',
      path: 'query.ts:396-426（有删节）',
      note: 'snip 在前、microcompact 在后，autocompact 兜底，能用细粒度就不整体摘要',
      lessons: ['多级降级策略'],
      code: `    // Apply snip before microcompact (both may run — they are not mutually exclusive).
    // snipTokensFreed is plumbed to autocompact so its threshold check reflects
    // what snip removed; tokenCountWithEstimation alone can't see it (reads usage
    // from the protected-tail assistant, which survives snip unchanged).
    let snipTokensFreed = 0
    if (feature('HISTORY_SNIP')) {
      const snipResult = snipModule!.snipCompactIfNeeded(messagesForQuery)
      messagesForQuery = snipResult.messages
      snipTokensFreed = snipResult.tokensFreed
      if (snipResult.boundaryMessage) {
        yield snipResult.boundaryMessage
      }
    }

    // Apply microcompact before autocompact
    const microcompactResult = await deps.microcompact(
      messagesForQuery,
      toolUseContext,
      querySource,
    )
    messagesForQuery = microcompactResult.messages`,
    },
    {
      type: 'callout',
      tone: 'key',
      title: '把这一章连起来',
      html: '<p>「开源」：静态段吃缓存、动态段保时效，CLAUDE.md 四层注入让模型带着规约干活。「节流」：历史按精细→粗暴四级瘦身，且全部发生在循环<b>之内</b>、请求<b>之前</b>。上下文管理不是初始化时的一次性配置，而是心跳的一部分。</p>',
    },
    {
      type: 'quiz',
      q: 'system prompt 为什么要刻意分成「静态段 + 动态段」两截，还立一块不许挪动的边界？',
      options: [
        '纯代码组织习惯，没有实际影响',
        '为了让 prompt cache 按前缀命中：固定内容在前可按缓存价计费',
        '因为模型只读前半段',
        '为了让文件更好维护',
      ],
      answer: 1,
      explain:
        'prompt caching 按「请求前缀是否与上次完全一致」命中。静态段对所有会话一字不差，永远放前面吃缓存；动态段放在边界后。挪动内容会破坏前缀匹配，直接推高账单。',
    },
    {
      type: 'quiz',
      q: '历史瘦身为什么把 autocompact（整体摘要）放在最后一级，而不是最前面？',
      options: [
        'autocompact 实现最复杂，所以要最后写',
        '细粒度手段（截断/剪片段/换占位符）能保住更多原始信息，整体摘要是不可逆的信息损失',
        '因为 autocompact 最费 CPU',
        '没有特别原因',
      ],
      answer: 1,
      explain:
        '摘要是有损压缩：细节数量、精确的报错文本都可能丢。snip 和 microcompact 是可逆的占位、可精确定位的信息移除，先试它们，实在超限才动 autocompact。「能保住细粒度就不整体摘要」是上下文管理的通用取舍原则。',
    },
  ],
}
