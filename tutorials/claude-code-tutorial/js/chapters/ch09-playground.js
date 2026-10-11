/**
 * 第 9 章 · 动手：读懂并改造迷你 Agent
 */
export default {
  id: 'ch09',
  num: 9,
  title: '动手：迷你 Agent 的源码',
  subtitle: '第 1 章那个模拟器不是动画。这一章把它的真实代码交给你',
  minutes: 15,
  sections: [
    {
      type: 'prose',
      html: `
<p>第 1 章你玩过的模拟器，源码就在本站里：<code>js/sim/agent-sim.js</code>。这一章把它的核心部分摊开，逐段讲透，然后留三道改造练习。<b>你读完这段代码 = 读懂了一个最小可用的 agent</b>，而且它是可以随便改、随便玩坏的教学玩具。</p>
<p>先用一段预告说明它的结构：真实 agent 的四要素一样不少，只是每一样都换成了最小实现。</p>
<table>
  <tr><th>四要素</th><th>真实 claude-code</th><th>迷你版</th></tr>
  <tr><td>🧠 大脑</td><td>API 流式调用（claude.ts）</td><td><code>mockLLM()</code>：按剧本回答</td></tr>
  <tr><td>🔧 工具</td><td>zod schema + 六道关卡</td><td><code>TOOLS</code>：3 个工具，带 validate</td></tr>
  <tr><td>📚 上下文</td><td>四级瘦身</td><td>不瘦身（历史直接增长）</td></tr>
  <tr><td>🔁 循环</td><td>query.ts 的 while (true)</td><td><code>buildSteps()</code> 的 while (true)</td></tr>
</table>`,
    },
    { type: 'h2', text: '第一段：工具集' },
    {
      type: 'code',
      title: '迷你版工具集（本站 js/sim/agent-sim.js）',
      lang: 'js',
      path: 'js/sim/agent-sim.js · 第 1 节',
      note: '对比第 3 章：name + 说明书 description + 校验 validate + 本体 run，成分一样，只是没有 zod',
      lessons: ['对象作为注册表', '方法简写'],
      code: `const TOOLS = {
  read_file: {
    description: '读取一个文件的内容',
    // 真实 agent 会用 zod 校验，这里用最小可用版：只检查必填字段
    validate(input) {
      if (!VFS[input.path]) return \`错误：文件 \${input.path} 不存在\`
      return null
    },
    run(input) {
      return VFS[input.path]
    },
  },
  calc: {
    description: '计算一个只含数字与 + - * / 的算式',
    validate(input) {
      if (!/^[0-9+\\-*/.() ]+$/.test(input.expression)) return '错误：算式不合法'
      return null
    },
    run(input) {
      return String(new Function(\`"use strict"; return (\${input.expression})\`)())
    },
  },
  write_note: {
    description: '把一段文字写进（或覆盖）一个文件',
    validate(input) {
      if (!input.path || !input.content) return '错误：path 和 content 都必填'
      return null
    },
    run(input) {
      VFS[input.path] = input.content
      return \`已写入 \${input.path}\`
    },
  },
}`,
    },
    { type: 'h2', text: '第二段：mockLLM' },
    {
      type: 'prose',
      html: `
<p>把「模型」换成剧本，是理解 agent 结构的关键一步：<b>只要接口不变（进 messages，出 blocks + stop_reason），大脑换成什么都行</b>。真换成 API，也只是把这个函数的函数体改成一次 fetch，练习三会做。</p>`,
    },
    {
      type: 'code',
      title: '按剧本回答的模型（有删节）',
      lang: 'js',
      path: 'js/sim/agent-sim.js · 第 2 节',
      note: '接口与真实 API 对齐：输入 messages，输出 blocks 和 stop_reason',
      lessons: ['接口思维', 'Array.at'],
      code: `const SCRIPT = [
  {
    narration: '模型决定：先读文件看看数字是什么',
    blocks: [
      { type: 'text', text: '我先读取 notes.txt 看看里面记录的数字。' },
      { type: 'tool_use', id: 'toolu_1', name: 'read_file', input: { path: 'notes.txt' } },
    ],
    stop_reason: 'tool_use',
  },
  // ...第 2、3 条剧本：calc、write_note（略，同构）
  {
    narration: '任务完成：模型只回了文字，不再调用工具',
    blocks: [{ type: 'text', text: '算好了！45 × 12 = 540，已写入 notes.txt ✅' }],
    stop_reason: 'end_turn',
  },
]

function mockLLM(callIndex) {
  return SCRIPT[callIndex] ?? SCRIPT.at(-1)
}`,
    },
    { type: 'h2', text: '第三段：循环本体' },
    {
      type: 'prose',
      html: `
<p>下面是全章的核心。为了支持单步执行，循环不直接渲染，而是把每个阶段快照进 <code>steps</code> 数组。把 <code>snapshot(...)</code> 调用遮住，剩下的就是第 1 章伪代码的直系血统：</p>`,
    },
    {
      type: 'code',
      title: '迷你 agent 主循环（有删节）',
      lang: 'js',
      path: 'js/sim/agent-sim.js · 第 3 节',
      note: '对照 query.ts:307，结构完全同源',
      lessons: ['while (true)', 'structuredClone', '消息回填'],
      code: `function buildSteps() {
  const steps = []
  const messages = [
    { role: 'user', content: '我的笔记文件里记录了一个数字，把它乘以 12，再把答案写回 notes.txt。' },
  ]

  // snapshot：把「此刻的消息数组」深拷贝存档，供单步回放
  const snapshot = (stage, narration, chat) =>
    steps.push({ stage, narration, chat, messages: structuredClone(messages) })

  let call = 0
  let turn = 0

  // ★ 这就是 agent 的心跳，对应真实源码 query.ts:307 的 while (true)
  while (true) {
    turn += 1
    snapshot(\`第 \${turn} 轮 · 请求模型\`, '把整个 messages 数组发给模型。', [])

    const response = mockLLM(call)
    call += 1

    // （快照模型响应，略）

    const toolUses = response.blocks.filter((b) => b.type === 'tool_use')
    // assistant 响应总是先入历史（真实源码在流式产出时就已追加）
    messages.push({ role: 'assistant', content: response.blocks })

    if (toolUses.length === 0) {
      snapshot('循环退出', '没有 tool_use（end_turn），while 循环退出。', [])
      break                       // 对应 query.ts:1062 的 return
    }

    // 执行每个工具调用，结果包成 tool_result 塞进一条 user 消息
    const toolResults = toolUses.map((tu) => {
      const tool = TOOLS[tu.name]
      const err = tool ? tool.validate(tu.input) : \`未知工具 \${tu.name}\`
      const content = err ?? tool.run(tu.input)
      return { type: 'tool_result', tool_use_id: tu.id, content }
    })
    messages.push({ role: 'user', content: toolResults })

    snapshot(\`第 \${turn} 轮 · 执行工具并回填\`, '结果通过 tool_use_id 配对回填，然后回到循环顶部。', [])
  }

  return steps
}`,
    },
    {
      type: 'callout',
      tone: 'key',
      title: '注意它简化掉了什么',
      html: '<p>对比真实源码，这个迷你版砍掉了：流式响应（一次性拿全量）、上下文瘦身（历史只增不减）、并发调度（工具逐个同步执行）、权限 ask 弹窗（validate 只是参数校验，不是安全门）。<b>四样都是「生产化」要补的课，而不是 agent 概念的必需品</b>，这正是它们能被分开学习的理由。</p>',
    },
    { type: 'h2', text: '改造练习' },
    {
      type: 'prose',
      html: `
<p>打开 <code>js/sim/agent-sim.js</code>，动手改。每道练习都标注了落点：</p>
<ol>
  <li><b>加一个工具</b>：在 <code>TOOLS</code> 里新增 <code>delete_note</code>（删文件）。给它一个比 <code>read_file</code> 更严格的 <code>validate</code>：拒绝删除 <code>README.md</code>。思考题：如果这是真实工具，它的 <code>isReadOnly</code> 该是什么？需要在什么情况下 ask？</li>
  <li><b>让模型犯错</b>：往 <code>SCRIPT</code> 里插一条剧本，故意调用不存在的工具（比如 <code>rm_rf</code>），观察循环怎么把错误回填、模型（剧本）下一轮怎么自纠，亲手复现第 4 章的容错闭环。</li>
  <li><b>接上真模型</b>：把 <code>mockLLM(call)</code> 换成一次真实 API 调用（示意）：</li>
</ol>`,
    },
    {
      type: 'code',
      title: '练习三的骨架：真模型版 mockLLM',
      lang: 'js',
      path: '练习骨架',
      note: '注意 messages 直接透传，因为协议就是第 2 章学的那套 block',
      lessons: ['fetch', 'API 协议'],
      code: `async function mockLLM() {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': YOUR_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      tools: Object.entries(TOOLS).map(([name, t]) => ({
        name,
        description: t.description,
        input_schema: { type: 'object', /* 你的 JSON Schema */ },
      })),
      messages,   // 就是 buildSteps 里那个数组，一字不差
    }),
  })
  const data = await res.json()
  return { blocks: data.content, stop_reason: data.stop_reason }
}`,
    },
    {
      type: 'prose',
      html: `
<p>改完真模型版你会发现一件反直觉的事：<b>buildSteps 一行都不用动</b>。循环、回填、退出判断，全部与「大脑是谁」无关。这就是分层设计的好处，也解释了为什么同一个 claude-code 能换 GPT、能跑 Bedrock、能接本地模型。</p>
<p>读完这章，agent 的核心机制你已经都见过了。想继续深入，去读 <code>query.ts</code> 的错误恢复分支（output token 超限的续写逻辑）、<code>AgentTool/</code>（子智能体怎么嵌套主循环）、<code>constants/prompts.ts</code> 的动态段注册表。现在你有能力读懂它们了。</p>`,
    },
    {
      type: 'quiz',
      q: '把迷你 agent 的 mockLLM 换成真实 API 后，主循环为什么一行都不用改？',
      options: [
        '因为 JavaScript 是动态语言，什么都能改',
        '因为 mockLLM 和真 API 遵守同一接口约定：输入 messages，输出 blocks + stop_reason；循环只依赖这个约定',
        '因为循环写得很少',
        '其实要改很多，题目在骗你',
      ],
      answer: 1,
      explain:
        '这就是「面向接口编程」的回报。循环的心跳逻辑（请求→判断→执行→回填）只消费 { blocks, stop_reason }，不关心大脑是谁。真实 claude-code 支持多模型后端（Bedrock/Vertex/本地）也是同一原理。',
    },
    {
      type: 'quiz',
      q: '迷你 agent 的 buildSteps() 先把所有阶段快照存进数组、再由 UI 逐步回放。这种「预演 + 回放」设计带来的最大好处是什么？',
      options: [
        '省内存',
        '让循环逻辑和渲染彻底解耦：单步、自动播放、重放都变成「移动指针」，不用重跑逻辑',
        '让代码更短',
        '方便多线程',
      ],
      answer: 1,
      explain:
        '逻辑与展示分离后，渲染器永远只消费「状态快照流」。这与真实源码用 async generator yield 事件、UI 用 for await 消费是同构的思想：生产者只管产生事实，消费者决定怎么呈现。',
    },
  ],
}
