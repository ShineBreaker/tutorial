/**
 * 第 4 章 · 一次工具调用的旅程
 */
export default {
  id: 'ch04',
  num: 4,
  title: '一次工具调用的旅程',
  subtitle: '从模型举手「我要调工具」到结果回填，中间有六道关卡',
  minutes: 12,
  sections: [
    {
      type: 'prose',
      html: `
<p>第 3 章讲了工具「是什么」，这一章讲它「怎么被用」。以模型想搜索 <code>TODO</code> 为例，一次完整调用要过这道流水线：</p>`,
    },
    {
      type: 'flow',
      steps: [
        { title: '① 查找', desc: '按名字在注册表里找到 GrepTool；找不到就回错误结果' },
        { title: '② zod 校验', desc: 'safeParse 检查参数形状；失败不抛异常，回错误结果让模型自纠', hi: true },
        { title: '③ 语义校验', desc: 'validateInput：路径存在吗？文件是不是太大？' },
        { title: '④ 权限门控', desc: 'canUseTool：合并规则决定 allow / deny / ask（第 5 章）' },
        { title: '⑤ 执行', desc: 'await tool.call()，真正干活' },
        { title: '⑥ 回填', desc: '结果映射成 tool_result block，追加进 messages', hi: true },
      ],
    },
    {
      type: 'prose',
      html: `
<p>最容易低估的是<b>第②道关卡</b>。模型生成的参数并不总是合法的，源码注释原话承认了这点：<em>surprisingly, the model is not great at generating valid input</em>（没想到吧，模型并不太会生成合法输入）。设计上有个漂亮的闭环：<b>校验失败不抛异常中断，而是把错误包装成 <code>is_error: true</code> 的 tool_result 回给模型</b>，模型下一轮会自己修正参数重试。</p>`,
    },
    {
      type: 'code',
      title: '第一关：zod 校验',
      lang: 'ts',
      path: 'services/tools/toolExecution.ts:614-616',
      note: '连作者自己都在注释里吐槽模型会写错参数',
      lessons: ['safeParse 不抛异常的校验风格'],
      code: `  // Validate input types with zod (surprisingly, the model is not great
  // at generating valid input)
  const parsedInput = tool.inputSchema.safeParse(input)
  if (!parsedInput.success) {`,
    },
    {
      type: 'code',
      title: '失败 ≠ 崩溃：错误也是一条消息',
      lang: 'ts',
      path: 'services/tools/toolExecution.ts:664-679（有删节）',
      note: 'is_error: true 的 tool_result，agent 的「容错闭环」',
      lessons: ['错误处理设计'],
      code: `    return [
      {
        message: createUserMessage({
          content: [
            {
              type: 'tool_result',
              content: \`<tool_use_error>InputValidationError: \${errorContent}</tool_use_error>\`,
              is_error: true,
              tool_use_id: toolUseID,
            },
          ],
          toolUseResult: \`InputValidationError: \${parsedInput.error.message}\`,
          sourceToolAssistantUUID: assistantMessage.uuid,
        }),
      },
    ]`,
    },
    {
      type: 'callout',
      tone: 'key',
      title: '这就是「agent 会自我纠正」的实现原理',
      html: '<p>没有任何魔法纠错模块：错误以普通消息的身份回到模型面前，模型读到 <code>InputValidationError</code> 就知道要换姿势重试。给循环里的失败「可读的反馈」，就是全部秘诀。</p>',
    },
    { type: 'h2', text: '执行与回填' },
    {
      type: 'code',
      title: '第五关：await tool.call()',
      lang: 'ts',
      path: 'services/tools/toolExecution.ts:1206-1222（有删节）',
      note: '过了所有关卡才轮到真正的执行',
      lessons: ['async/await', '回调传递进度'],
      code: `  try {
    const result = await tool.call(
      callInput,
      {
        ...toolUseContext,
        toolUseId: toolUseID,
        userModified: permissionDecision.userModified ?? false,
      },
      canUseTool,
      assistantMessage,
      progress => {           // onProgress：长任务边跑边汇报
        onToolProgress({
          toolUseID: progress.toolUseID,
          data: progress.data,
        })
      },
    )`,
    },
    {
      type: 'code',
      title: '第六关：结果映射回 API 格式',
      lang: 'ts',
      path: 'services/tools/toolExecution.ts:1292-1295',
      note: 'tool_use_id 带上，模型就知道这条结果对应哪个请求',
      lessons: ['数据映射'],
      code: `    const mappedToolResultBlock = tool.mapToolResultToToolResultBlockParam(
      result.data,
      toolUseID,
    )`,
    },
    { type: 'h2', text: '并发调度：只读可以一起跑，写入必须排队' },
    {
      type: 'prose',
      html: `
<p>模型经常在一轮里同时发起好几个工具调用（比如并行搜三个关键词）。如果它们互相都不改状态，串行跑纯属浪费时间。调度器把工具调用<b>按连续段分批</b>：相邻的只读调用合成一批并发执行（默认上限 10 个，可用环境变量调整），碰到可能写状态的就单独成批、严格串行。</p>
<p>下面这段 <code>reduce</code> 是累积器模式的经典示范，值得逐行读：</p>`,
    },
    {
      type: 'code',
      title: '分区调度器',
      lang: 'ts',
      path: 'services/tools/toolOrchestration.ts:91-116',
      note: 'reduce 累积器：把扁平列表按「能否并发」切成批次',
      lessons: ['reduce 累积器', '防御式编程'],
      code: `function partitionToolCalls(
  toolUseMessages: ToolUseBlock[],
  toolUseContext: ToolUseContext,
): Batch[] {
  return toolUseMessages.reduce((acc: Batch[], toolUse) => {
    const tool = findToolByName(toolUseContext.options.tools, toolUse.name)
    const parsedInput = tool?.inputSchema.safeParse(toolUse.input)
    const isConcurrencySafe = parsedInput?.success
      ? (() => {
          try {
            return Boolean(tool?.isConcurrencySafe(parsedInput.data))
          } catch {
            // If isConcurrencySafe throws (e.g., due to shell-quote parse
            // failure), treat as not concurrency-safe to be conservative
            return false
          }
        })()
      : false
    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe) {
      // 与上一批同为只读 → 并入同一批
      acc[acc.length - 1]!.blocks.push(toolUse)
    } else {
      // 否则新开一批
      acc.push({ isConcurrencySafe, blocks: [toolUse] })
    }
    return acc
  }, [])
}`,
    },
    {
      type: 'callout',
      tone: 'tip',
      title: '两处值得学的细节',
      html: '<p><b>1.</b> <code>acc[acc.length - 1]?.isConcurrencySafe</code> 用可选链处理「数组为空」的情况，避免在 reduce 第一轮就崩。</p><p><b>2.</b> 内层那个立即执行的小箭头函数包住了 try/catch。<code>isConcurrencySafe</code> 是各个工具自己实现的函数，可能抛异常；抛了就按「不可并发」处理。不确定时偏向保守，这就是第 5 章要讲的 fail-closed。</p>',
    },
    {
      type: 'quiz',
      q: '模型生成的工具参数没有通过 zod 校验，claude-code 会怎么做？',
      options: [
        '抛出异常终止整个会话',
        '静默忽略这次调用',
        '把校验错误包装成 is_error 的 tool_result 回给模型，让它下轮自纠',
        '自动替模型修正参数',
      ],
      answer: 2,
      explain:
        '错误被包装成一条 tool_result 消息回到对话历史里。模型读到错误文本后会在下一轮修正参数重试。「反馈进循环」是 agent 自我纠正能力的实现基础。',
    },
    {
      type: 'quiz',
      q: 'partitionToolCalls 为什么只让「连续的」只读工具并发，而不是把所有只读工具一起并发？',
      options: [
        '纯实现上的偷懒',
        '必须保持工具间的相对顺序语义：并发不能跨越一个可能改状态的调用',
        '模型只允许每轮调一个工具',
        '因为 reduce 只能这样写',
      ],
      answer: 1,
      explain:
        '工具调用列表是有顺序语义的：如果第 2 个调用是写入，第 3 个只读调用就依赖写入后的状态，不能提前跑。所以只把「连续的并发安全段」合成一批，批次之间仍按顺序执行。',
    },
  ],
}
