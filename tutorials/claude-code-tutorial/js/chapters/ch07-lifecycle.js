/**
 * 第 7 章 · 一条消息的一生
 */
export default {
  id: 'ch07',
  num: 7,
  title: '一条消息的一生',
  subtitle: '从敲下 claude 命令，到看到回答、成本入账、会话落盘',
  minutes: 14,
  sections: [
    {
      type: 'prose',
      html: `
<p>前面六章把零件一个个拆开看过，这一章把它们装回去：跟着一次真实的使用，从进程启动走到会话落盘，看每个零件在<b>哪个时刻</b>上岗。</p>`,
    },
    { type: 'h2', text: '第 1 站：启动' },
    {
      type: 'prose',
      html: `
<p>敲下 <code>claude</code>，入口是 <code>entrypoints/cli.tsx</code>。它的第一要务是<b>快</b>。所有 import 都是动态的，按需加载，只为最终要跑的那条路径付启动成本：</p>`,
    },
    {
      type: 'code',
      title: '入口的快速路径',
      lang: 'ts',
      path: 'entrypoints/cli.tsx:28-53',
      note: '动态 import：模块在用到那一刻才被求值',
      lessons: ['动态 import', '启动性能'],
      code: `/**
 * Bootstrap entrypoint - checks for special flags before loading the full CLI.
 * All imports are dynamic to minimize module evaluation for fast paths.
 * Fast-path for --version has zero imports beyond this file.
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  // Fast-path for --version/-v: zero module loading needed
  if (args.length === 1 && (args[0] === '--version' || args[0] === '-v' || args[0] === '-V')) {
    // MACRO.VERSION is inlined at build time
    console.log(\`\${MACRO.VERSION} (Claude Code)\`);
    return;
  }

  // For all other paths, load the startup profiler
  const {
    profileCheckpoint
  } = await import('../utils/startupProfiler.js');
  profileCheckpoint('cli_entry');`,
    },
    {
      type: 'prose',
      html: `
<p>之后 Commander（一个命令行参数解析库）注册所有子命令，并用 <code>preAction</code> 钩子保证<b>任何命令</b>执行前先跑 <code>init()</code>（配置网络、预连接 API）。交互模式进入 <code>launchRepl()</code>：动态 import 界面组件，用 <b>Ink</b>（终端版 React）渲染出你看到的输入框，也就是 TUI（终端用户界面）。</p>`,
    },
    { type: 'h2', text: '第 2 站：输入变成消息' },
    {
      type: 'prose',
      html: `
<p>你回车后，REPL 调 <code>processUserInput()</code> 分流（第 2 章的转换点就在这里）。随后 REPL 并行取齐「上下文三件套」：system prompt、用户上下文（CLAUDE.md）、系统上下文（git 状态快照）。</p>`,
    },
    {
      type: 'code',
      title: '三件套并行装配',
      lang: 'ts',
      path: 'utils/queryContext.ts:61-75（有删节）',
      note: 'Promise.all：三个独立的数据源同时取，谁也不等谁',
      lessons: ['Promise.all 并行', '解构赋值'],
      code: `  const [defaultSystemPrompt, userContext, systemContext] = await Promise.all([
    customSystemPrompt !== undefined
      ? Promise.resolve([])
      : getSystemPrompt(
          tools,
          mainLoopModel,
          additionalWorkingDirectories,
          mcpClients,
        ),
    getUserContext(),
    customSystemPrompt !== undefined ? Promise.resolve({}) : getSystemContext(),
  ])
  return { defaultSystemPrompt, userContext, systemContext }`,
    },
    { type: 'h2', text: '第 3 站：进入心跳' },
    {
      type: 'code',
      title: 'REPL 消费 agent 循环',
      lang: 'ts',
      path: 'screens/REPL.tsx:2793-2803（有删节）',
      note: 'for await 消费 query() 产出的每一个事件，边收边渲染',
      lessons: ['for await…of', '生产者-消费者'],
      code: `    for await (const event of query({
      messages: messagesIncludingNewMessages,
      systemPrompt,
      userContext,
      systemContext,
      canUseTool,
      toolUseContext,
      querySource: getQuerySourceForREPL()
    })) {
      onQueryEvent(event);
    }`,
    },
    {
      type: 'prose',
      html: `
<p>从这一刻起就是第 1 章讲过的循环：请求 → 响应 → 有 <code>tool_use</code>？执行并回填 → 再请求……直到 end_turn。你在终端看到的流式文字、工具旁边的转圈、每条消息的滑入，都是 <code>onQueryEvent</code> 在消费这些 <code>yield</code> 出来的事件。</p>`,
    },
    { type: 'h2', text: '第 4 站：账单与存档' },
    {
      type: 'code',
      title: '成本统计的单一入口',
      lang: 'ts',
      path: 'services/api/claude.ts:2229-2256（有删节）',
      note: '流式响应的 message_delta 带回真实 token 用量，立刻换算美元入账',
      lessons: ['直接修改属性 vs 整体替换对象'],
      code: `            // message_delta arrives after content_block_stop with the real
            // values.
            //
            // IMPORTANT: Use direct property mutation, not object replacement.
            // The transcript write queue holds a reference to message.message
            // and serializes it lazily (100ms flush interval). Object
            // replacement ({ ...lastMsg.message, usage }) would disconnect
            // the queued reference; direct mutation ensures the transcript
            // captures the final values.
            stopReason = part.delta.stop_reason

            const lastMsg = newMessages.at(-1)
            if (lastMsg) {
              lastMsg.message.usage = usage
              lastMsg.message.stop_reason = stopReason
            }

            // Update cost
            const costUSDForPart = calculateUSDCost(resolvedModel, usage)
            costUSD += addToTotalSessionCost(
              costUSDForPart,
              usage,
              options.model,
            )`,
    },
    {
      type: 'callout',
      tone: 'tip',
      title: '注释里藏着一个真实的 JS 坑',
      html: '<p>为什么强调「直接改属性，不要整体替换对象」？因为落盘队列持有的是<b>对同一个对象的引用</b>，而且 100ms 才批量序列化一次。如果换成 <code>{ ...lastMsg.message, usage }</code> 创建新对象，队列里那个旧引用就拿不到最终 usage 了。JS 的引用语义在这里从坑变成了特性。</p>',
    },
    {
      type: 'prose',
      html: `
<p>最后是持久化。每条消息经 <code>recordTranscript()</code> 追加写入一个 JSONL 文件（每行一条 JSON 记录，路径是 <code>~/.claude/projects/&lt;项目&gt;/&lt;sessionId&gt;.jsonl</code>）。每条消息都记下前一条消息的 id（parentUuid），串成一条链。所以 <code>claude --resume</code> 能恢复会话，靠的就是把这条消息链读回来重建。会话 = 可回放的消息链。</p>`,
    },
    { type: 'h2', text: '全景依赖图' },
    {
      type: 'code',
      title: '一次会话的完整调用链',
      lang: 'text',
      path: '模块依赖速查（源自码实测整理）',
      note: '打印出来贴墙上，读源码时按图索骥',
      lessons: [],
      code: `claude (shell)
└─ entrypoints/cli.tsx main()          # 动态导入快速路径
   └─ main.tsx run()                   # Commander + preAction 钩子
      ├─ entrypoints/init.ts init()    # mTLS/代理/预连接
      └─ replLauncher.tsx launchRepl() # Ink 挂载 screens/REPL.tsx
         ├─ utils/processUserInput/*   # 输入 → 消息（斜杠/文本分流）
         ├─ utils/queryContext.ts      # 三件套 Promise.all
         │  ├─ constants/prompts.ts getSystemPrompt()   # 静态+动态段
         │  └─ context.ts getUserContext()/getSystemContext()
         │     └─ utils/claudemd.ts getMemoryFiles()    # CLAUDE.md 四层
         ├─ query.ts queryLoop (while true)             # ★ 心跳
         │  ├─ snip / microcompact / autocompact        # 四级瘦身
         │  └─ services/api/claude.ts                   # LLM 流式调用
         │     └─ cost-tracker.ts addToTotalSessionCost # 成本入账
         ├─ services/tools/toolOrchestration.ts         # 只读并发/写串行
         │  └─ toolExecution.ts runToolUse()            # 六道关卡
         ├─ utils/sessionStorage.ts recordTranscript    # JSONL 落盘
         └─ costHook.ts useCostSummary                  # 退出时结账`,
    },
    {
      type: 'quiz',
      q: '为什么入口文件 cli.tsx 里全部使用动态 import（await import(...)）而不是顶部静态 import？',
      options: [
        '静态 import 在 TypeScript 里不合法',
        '为了让 --version 这类快速路径零模块加载，把启动时间压到最低',
        '因为动态 import 更安全',
        '为了绕过浏览器兼容性',
      ],
      answer: 1,
      explain:
        '静态 import 会在模块图加载阶段把整个依赖树求值完；动态 import 把求值推迟到实际需要的那一刻。CLI 对启动延迟极其敏感（用户敲命令等着呢），这是 Node/Bun 命令行工具的经典优化手法。',
    },
    {
      type: 'quiz',
      q: 'claude --resume 能恢复上次的会话，靠的是什么？',
      options: [
        '把对话存在浏览器的 localStorage 里',
        '每条消息以 parentUuid 链式结构实时追加进 JSONL 文件，恢复时读回重建',
        '模型记住了之前的对话',
        '对话存在 Anthropic 服务器上',
      ],
      answer: 1,
      explain:
        'recordTranscript() 把每条消息追加写入本地 JSONL（含 parentUuid 链）。模型本身无状态，「记住」全靠每次请求重发历史；「恢复」靠把历史从磁盘读回来。',
    },
  ],
}
