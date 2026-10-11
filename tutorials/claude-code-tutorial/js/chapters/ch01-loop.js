/**
 * 第 1 章 · 心跳：Agent 循环
 */
export default {
  id: 'ch01',
  num: 1,
  title: '心跳：Agent 循环',
  subtitle: '整个 agent，核心就是一小段 while (true)',
  minutes: 12,
  sections: [
    {
      type: 'prose',
      html: `
<p>先说结论：<b>agent 的工作方式可以被写成 15 行伪代码</b>。计划模式、子智能体、自动压缩这些花哨功能，全都长在这个骨架上。</p>
`,
    },
    {
      type: 'code',
      title: '最小 agent 循环（教学版伪代码）',
      lang: 'ts',
      path: '伪代码 · 真实实现见 query.ts:307',
      note: '看不懂语法没关系，先看流程：请求 → 判断 → 执行 → 回填 → 再来',
      lessons: ['while 循环', '消息数组'],
      code: `const messages = [{ role: 'user', content: '帮我看看这个项目' }]

while (true) {
  // 1. 把全部历史发给模型，要一个回复
  const response = await callLLM(messages)

  // 2. 把回复追加进历史
  messages.push(response)

  // 3. 模型想调用工具吗？
  if (response.toolCalls.length === 0) {
    return response.text          // 不想 → 任务完成，退出
  }

  // 4. 想 → 真的去执行，把每个结果包成 tool_result 塞回历史
  const results = response.toolCalls.map(tc => runTool(tc))
  messages.push({ role: 'user', toolResults: results })
  // 循环回到顶部：模型会看到工具结果，继续思考
}`,
    },
    { type: 'h2', text: '真实源码长什么样' },
    {
      type: 'prose',
      html: `
<p>打开 <code>query.ts</code>（agent 主循环所在文件），你会看到几乎一模一样的结构。它有两点特别。第一，这是一个 <b>async generator 函数</b>（<code>async function*</code>），用 <code>yield</code> 逐个吐出事件，而不是攒到最后一次性 return。第二，循环每轮开头先做「上下文瘦身」，第 6 章细讲。</p>`,
    },
    {
      type: 'code',
      title: '真实主循环的入口',
      lang: 'ts',
      path: 'query.ts:307-311',
      note: 'while (true)，就是伪代码里那个循环，一行没差',
      lessons: ['async generator'],
      code: `  // eslint-disable-next-line no-constant-condition
  while (true) {
    // Destructure state at the top of each iteration. toolUseContext alone
    // is reassigned within an iteration (queryTracking, messages updates);
    // the rest are read-only between continue sites.
    let { toolUseContext } = state
    const {
      messages,
      autoCompactTracking,
      maxOutputTokensRecoveryCount,
      hasAttemptedReactiveCompact,
      maxOutputTokensOverride,
      pendingToolUseSummary,
      stopHookActive,
      turnCount,
    } = state`,
    },
    {
      type: 'code',
      title: '工具结果回填：循环的下半拍',
      lang: 'ts',
      path: 'query.ts:1380-1400',
      note: 'runTools 执行工具，for await 逐个把结果回填成 user 消息，这正是伪代码第 4 步',
      lessons: ['for await…of', '迭代异步流'],
      code: `    const toolUpdates = streamingToolExecutor
      ? streamingToolExecutor.getRemainingResults()
      : runTools(toolUseBlocks, assistantMessages, canUseTool, toolUseContext)

    for await (const update of toolUpdates) {
      if (update.message) {
        yield update.message

        // ...（省略钩子处理）...

        toolResults.push(
          ...normalizeMessagesForAPI(
            [update.message],
            toolUseContext.options.tools,
          ).filter(_ => _.type === 'user'),
        )
      }
      // ...（省略上下文更新）...
    }`,
    },
    {
      type: 'code',
      title: '退出条件：模型不再要工具了',
      lang: 'ts',
      path: 'query.ts:834 与 1062',
      note: 'needsFollowUp = 有工具要接着跑。没有 → return，循环结束',
      lessons: ['循环退出'],
      code: `    // query.ts:834，响应里有工具调用时：
                needsFollowUp = true

    // query.ts:1062，走到这里还没有后续工具：
    if (!needsFollowUp) {
      const lastMessage = assistantMessages.at(-1)
      // ...（省略错误恢复逻辑，如「提示词过长」的自动压缩重试）
      // 最终 return，while 循环结束，本轮任务完成
    }`,
    },
    { type: 'h2', text: '亲手转一圈' },
    {
      type: 'prose',
      html: `
<p>光看代码不如亲手转一圈。下面的模拟器<b>真的实现</b>了上面这个循环（不是假动画）：模型被换成了按剧本回答的 <code>mockLLM</code>，但消息数组的增长、工具的执行、结果的回填，全是真的。</p>
<p>先点「单步」慢慢走，注意右侧 <code>messages</code> 数组怎么变长；再按「自动播放」看完整一轮。每个阶段的完整解释，把鼠标悬停在顶部状态栏上就能看到。</p>`,
    },
    { type: 'sim' },
    {
      type: 'callout',
      tone: 'key',
      title: '观察重点',
      html: `
<p><b>1.</b> <code>tool_result</code> 的 role 是 <code>user</code>。这是 Anthropic API 的约定：工具结果以用户消息的身份回填。</p>
<p><b>2.</b> <code>tool_use</code> 和 <code>tool_result</code> 靠 <code>tool_use_id</code>（如 <code>toolu_1</code>）配对。</p>
<p><b>3.</b> 退出不靠别的，就靠「模型这轮没有调用工具」。</p>`,
    },
    { type: 'h2', text: '为什么用 async generator' },
    {
      type: 'prose',
      html: `
<p>主循环 <code>query()</code> 是 <code>async function*</code>：它一边跑循环，一边把每个事件（流式文本、工具进度、每条消息）<code>yield</code> 出去。调用方是第 7 章的 REPL，也就是你在终端里看到的交互界面，它用 <code>for await</code> 消费：</p>
<pre class="code-body">for await (const event of query({ messages, systemPrompt, tools, ... })) {
  onQueryEvent(event)   // 渲染到终端：流式文字、工具转圈、消息追加……
}</pre>
<p>这个设计把「<b>做事情</b>」和「<b>展示进度</b>」解耦了：循环只管干活，界面爱怎么渲染怎么渲染。你今天在浏览器里看到的模拟器，本质上也是一个消费步骤流的渲染器。</p>`,
    },
    {
      type: 'quiz',
      q: 'agent 循环在什么情况下退出？',
      options: [
        '执行完固定次数（比如 10 轮）后强制退出',
        '模型响应里没有工具调用请求时',
        '用户按 Ctrl+C 时',
        '工具全部执行完毕时',
      ],
      answer: 1,
      explain:
        '退出条件只有一个：模型不再请求工具（stop_reason 为 end_turn，源码中即 needsFollowUp 为 false 时 return）。真实实现里还有错误恢复路径（如提示词过长会压缩后重试），但正常路径就是这个条件。',
    },
    {
      type: 'quiz',
      q: '为什么 claude-code 的主循环要做成 async generator（async function* + yield）？',
      options: [
        '因为生成器比普通函数运行更快',
        '为了把「执行过程」逐事件交给调用方渲染，做与展示解耦',
        '因为 TypeScript 要求所有主循环都用生成器',
        '为了节省内存',
      ],
      answer: 1,
      explain:
        'async generator 让循环「边跑边吐事件」：REPL 用 for await 消费并渲染进度。逻辑与展示解耦，同一个 query() 可以喂终端 UI，也可以喂 headless 模式（没有界面、直接输出结果的运行方式，见 QueryEngine.ts）。',
    },
  ],
}
