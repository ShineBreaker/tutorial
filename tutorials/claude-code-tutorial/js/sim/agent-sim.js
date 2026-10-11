/**
 * agent-sim.js · 可单步执行的「迷你 Agent」循环模拟器
 *
 * 它真实地实现了一个最小 agent 循环（不是动画假象）：
 *   while (还有工具要调用) { 请求模型 → 执行工具 → 把结果回填进 messages }
 * 只是「模型」被换成了一个按剧本回答的 mockLLM，剧本其实也是
 * 真实 agent 的行为模式：先读文件、再计算、再写结果、最后总结。
 *
 * 教学要点（第 9 章会逐段讲解这里的源码）：
 *   - messages 是一个不断增长的数组，这是 agent 唯一的记忆
 *   - tool_use / tool_result 通过 id 配对，tool_result 永远放在 user 消息里
 *   - 模型响应带 stop_reason：'tool_use' 继续，'end_turn' 退出循环
 */

/* ---------- 1. 工具集：agent 的「手」 ---------- */

const VFS = {
  'notes.txt': '重要数字：45',
  'README.md': '这是一个虚拟文件系统，供模拟器读写。',
}

const TOOLS = {
  read_file: {
    description: '读取一个文件的内容',
    // 真实 agent 会用 zod 校验，这里用最小可用版：只检查必填字段
    validate(input) {
      if (!VFS[input.path]) return `错误：文件 ${input.path} 不存在`
      return null
    },
    run(input) {
      return VFS[input.path]
    },
  },
  calc: {
    description: '计算一个只含数字与 + - * / 的算式',
    validate(input) {
      if (!/^[0-9+\-*/.() ]+$/.test(input.expression)) return '错误：算式不合法'
      return null
    },
    run(input) {
      return String(new Function(`"use strict"; return (${input.expression})`)())
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
      return `已写入 ${input.path}`
    },
  },
}

/* ---------- 2. mockLLM：一个「按剧本走」的模型 ---------- */

/**
 * 真实模型每次看完整对话历史后自由发挥；mockLLM 用同样的接口，
 * 但答案预先写好：第 N 次被调用就给第 N 个剧本条目。
 * 接口与真实 API 一致：输入 messages，输出 { blocks, stop_reason }。
 */
const SCRIPT = [
  {
    narration: '模型决定：先读文件看看数字是什么',
    blocks: [
      { type: 'text', text: '我先读取 notes.txt 看看里面记录的数字。' },
      { type: 'tool_use', id: 'toolu_1', name: 'read_file', input: { path: 'notes.txt' } },
    ],
    stop_reason: 'tool_use',
  },
  {
    narration: '模型决定：把数字乘以 12',
    blocks: [
      { type: 'tool_use', id: 'toolu_2', name: 'calc', input: { expression: '45*12' } },
    ],
    stop_reason: 'tool_use',
  },
  {
    narration: '模型决定：把结果写回文件',
    blocks: [
      { type: 'text', text: '45 × 12 = 540。我把结果写进 notes.txt。' },
      {
        type: 'tool_use',
        id: 'toolu_3',
        name: 'write_note',
        input: { path: 'notes.txt', content: '重要数字：45（×12 = 540）' },
      },
    ],
    stop_reason: 'tool_use',
  },
  {
    narration: '任务完成：模型只回了文字，不再调用工具',
    blocks: [{ type: 'text', text: '算好了！45 × 12 = 540，已写入 notes.txt ✅' }],
    stop_reason: 'end_turn',
  },
]

function mockLLM(callIndex) {
  return SCRIPT[callIndex] ?? SCRIPT.at(-1)
}

/* ---------- 3. 核心循环：把整场演出预演成步骤列表 ---------- */

/**
 * 为了支持「单步执行」，我们不真的边跑边渲染，而是先把所有中间状态
 * 快照进 steps 数组（每步 = 一个阶段 + 当时的完整消息历史）。
 * 单步/自动播放只是移动读取指针，这也让「重放」变得免费。
 */
function buildSteps() {
  const steps = []
  const messages = [
    { role: 'user', content: '我的笔记文件里记录了一个数字，把它乘以 12，再把答案写回 notes.txt。' },
  ]

  const snapshot = (stage, narration, chat) =>
    steps.push({
      stage,
      narration,
      chat, // 气泡流里展示什么
      messages: structuredClone(messages), // 深拷贝快照，JSON 视图用
    })

  // user 消息先落地
  snapshot('发送输入', '用户输入被包装成一条 user 消息，追加进 messages 数组。', [
    { role: 'user', html: '我的笔记文件里记录了一个数字，把它乘以 12，再把答案写回 notes.txt。' },
  ])

  let call = 0
  let turn = 0

  // ★ 这就是 agent 的心跳，对应真实源码 query.ts:307 的 while (true)
  while (true) {
    turn += 1
    snapshot(
      `第 ${turn} 轮 · 请求模型`,
      '把整个 messages 数组（加上 system prompt 和工具列表）发给模型。这一步在真实源码里是流式请求。',
      [],
    )

    const response = mockLLM(call)
    call += 1

    const chatAssistant = response.blocks.map((b) =>
      b.type === 'text'
        ? { role: 'assistant', html: b.text }
        : { role: 'assistant', html: `要调用工具 <span class="tool-chip">${b.name}</span>，参数 <code>${JSON.stringify(b.input)}</code>` },
    )
    snapshot(
      `第 ${turn} 轮 · 模型响应（stop_reason: ${response.stop_reason}）`,
      response.narration + '。注意右侧 JSON：assistant 响应还没进 messages，它要等下一步和工具结果一起追加（真实源码里则是流式产出时立即追加，这里为了教学对齐时序）。',
      chatAssistant,
    )

    const toolUses = response.blocks.filter((b) => b.type === 'tool_use')
    // assistant 响应总是先入历史（真实源码在流式产出时就已追加）
    messages.push({ role: 'assistant', content: response.blocks })

    if (toolUses.length === 0) {
      snapshot(
        '循环退出',
        '响应里没有 tool_use（stop_reason 是 end_turn），模型认为任务完成，while 循环退出。对应真实源码 query.ts:1062 的 if (!needsFollowUp) return。',
        [],
      )
      break
    }

    // 执行每个工具调用，把结果包成 tool_result 塞进一条 user 消息
    const toolResults = toolUses.map((tu) => {
      const tool = TOOLS[tu.name]
      const err = tool ? tool.validate(tu.input) : `未知工具 ${tu.name}`
      const content = err ?? tool.run(tu.input)
      return { type: 'tool_result', tool_use_id: tu.id, content }
    })
    messages.push({ role: 'user', content: toolResults })

    snapshot(
      `第 ${turn} 轮 · 执行工具并回填`,
      `本地代码执行了 ${toolUses.length} 个工具，结果包成 tool_result（注意：role 是 user！），通过 tool_use_id 与请求配对，追加进 messages。然后 while 循环回到顶部再来一轮。`,
      toolResults.map((r) => ({ role: 'tool', html: `tool_result → ${r.content}` })),
    )
  }

  return steps
}

/* ---------- 4. 渲染层：纯 DOM 操作，与循环逻辑完全分离 ---------- */

const ROLE_LABEL = { user: 'user', assistant: 'assistant', tool: 'user · tool_result' }

function renderChat(chatEl, entries) {
  chatEl.textContent = ''
  for (const e of entries) {
    const div = document.createElement('div')
    div.className = `msg ${e.role}`
    const role = document.createElement('span')
    role.className = 'msg-role'
    role.textContent = ROLE_LABEL[e.role]
    div.append(role)
    // 气泡内容是我们自己写的模板，允许内联 code/em 标签
    div.insertAdjacentHTML('beforeend', e.html)
    chatEl.append(div)
  }
  chatEl.scrollTop = chatEl.scrollHeight
}

function renderJson(jsonEl, messages) {
  const lines = messages.map((m, i) => {
    const content =
      typeof m.content === 'string'
        ? JSON.stringify(m.content).slice(0, 60)
        : `[${m.content.map((b) => b.type).join(', ')}]`
    return `  ${i} · ${m.role.padEnd(9)} ${content}`
  })
  jsonEl.textContent = `messages (${messages.length} 条)\n` + lines.join('\n')
}

export function createSim(mountEl) {
  mountEl.classList.add('sim')

  const toolbar = document.createElement('div')
  toolbar.className = 'sim-toolbar'
  toolbar.innerHTML = `
    <span class="sim-stage"></span>
    <span class="sim-dots"></span>
    <button class="sim-btn js-reset" type="button">↺ 重置</button>
    <button class="sim-btn js-step" type="button">单步 ▸</button>
    <button class="sim-btn primary js-play" type="button">自动播放 ▸▸</button>
  `

  const body = document.createElement('div')
  body.className = 'sim-body'
  body.innerHTML = `
    <div class="sim-chat"></div>
    <div class="sim-json">
      <div class="json-label">messages 数组实时视图</div>
      <pre></pre>
    </div>
  `

  mountEl.append(toolbar, body)

  const stageEl = toolbar.querySelector('.sim-stage')
  const dotsEl = toolbar.querySelector('.sim-dots')
  const chatEl = body.querySelector('.sim-chat')
  const jsonPre = body.querySelector('.sim-json pre')
  const stepBtn = toolbar.querySelector('.js-step')
  const playBtn = toolbar.querySelector('.js-play')
  const resetBtn = toolbar.querySelector('.js-reset')

  const steps = buildSteps()
  dotsEl.innerHTML = steps.map(() => '<span class="sim-dot"></span>').join('')
  const dots = [...dotsEl.children]

  let pointer = -1
  let timer = null

  function show(i) {
    pointer = i
    const s = steps[i]
    stageEl.textContent = s.stage
    // 旁白：写进 stage 同一行的 title，鼠标悬停可见完整解释
    toolbar.title = s.narration
    // 气泡流是累积的：每帧追加「这一步新增的气泡」
    if (s.chat.length) chatEl._last = [...(chatEl._last ?? []), ...s.chat]
    renderChat(chatEl, chatEl._last ?? [])
    renderJson(jsonPre, s.messages)
    dots.forEach((d, k) => d.classList.toggle('on', k <= i))
    stepBtn.disabled = i >= steps.length - 1
  }

  function reset() {
    clearInterval(timer)
    timer = null
    playBtn.textContent = '自动播放 ▸▸'
    playBtn.disabled = false
    chatEl._last = []
    show(0)
  }

  resetBtn.addEventListener('click', reset)
  stepBtn.addEventListener('click', () => {
    clearInterval(timer)
    if (pointer < steps.length - 1) show(pointer + 1)
  })

  playBtn.addEventListener('click', () => {
    if (timer) return reset()
    playBtn.textContent = '⏸ 暂停'
    if (pointer >= steps.length - 1) show(0)
    timer = setInterval(() => {
      if (pointer >= steps.length - 1) {
        clearInterval(timer)
        timer = null
        playBtn.textContent = '自动播放 ▸▸'
        return
      }
      show(pointer + 1)
    }, 1100)
  })

  reset()
}
