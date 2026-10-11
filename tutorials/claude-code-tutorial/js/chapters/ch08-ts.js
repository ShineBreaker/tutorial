/**
 * 第 8 章 · 从源码学 TypeScript / JavaScript
 */
export default {
  id: 'ch08',
  num: 8,
  title: '语言专题：TS/JS 核心特性',
  subtitle: '把前七章遇到的写法集中复习一遍，每个都来自真实源码',
  minutes: 14,
  sections: [
    {
      type: 'prose',
      html: `
<p>读真实代码学语言，效率远高于刷语法书，因为你能看到<b>每个特性为什么在那里</b>。前七章的代码卡片里散落着一串语言知识点，这一章把它们串成一条线。每条都标了出处章节，忘了就回去看。</p>`,
    },
    { type: 'h2', text: '类型系统五连' },
    {
      type: 'code',
      title: '① 可辨识联合与类型收窄（第 2 章）',
      lang: 'ts',
      path: '模式提炼',
      note: '用 type 字段区分成员；if 判断后 TS 自动收窄，这是处理「多种形状数据」的第一模式',
      lessons: ['联合类型', '字面量类型', '类型收窄'],
      code: `type Block =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; name: string; input: unknown }

function render(block: Block) {
  if (block.type === 'text') {
    return block.text        // ← TS 知道这是 text 分支
  }
  return block.name          // ← TS 知道这是 tool_use 分支
}`,
    },
    {
      type: 'code',
      title: '② 泛型接口 + 默认类型参数（第 3 章）',
      lang: 'ts',
      path: 'Tool.ts:362',
      note: 'Tool<Input, Output> 让「参数 schema」和「执行函数的入参类型」永远同步',
      lessons: ['泛型', '默认类型参数', '类型约束 extends'],
      code: `type Tool<Input extends AnyObject = AnyObject, Output = unknown> = {
  inputSchema: Input
  call(args: z.infer<Input>): Promise<ToolResult<Output>>
}

// 不写泛型参数也能用（Input 默认 AnyObject），
// 写了 schema 后，call() 的 args 类型自动跟着变`,
    },
    {
      type: 'code',
      title: '③ 对象展开合并默认值：工厂函数（第 3 章）',
      lang: 'ts',
      path: 'Tool.ts:783-792',
      note: '先铺默认值再覆盖，一行实现「可覆盖的配置」',
      lessons: ['展开运算符', '工厂函数'],
      code: `export function buildTool(def) {
  return {
    ...TOOL_DEFAULTS,   // 默认值打底
    ...def,             // 同名字段被 def 覆盖，其余保留默认
  }
}`,
    },
    {
      type: 'code',
      title: '④ 可选链与空值合并（第 4、5 章）',
      lang: 'ts',
      path: 'toolOrchestration.ts / BashTool.tsx',
      note: '?. 只在「有值」时才继续取；?? 只在「null/undefined」时用默认，和 || 的区别是 0 和 "" 也算有值',
      lessons: ['可选链 ?.', '空值合并 ??'],
      code: `acc[acc.length - 1]?.isConcurrencySafe        // 数组可能为空
return this.isReadOnly?.(input) ?? false      // 方法可能没实现；结果为空则 false`,
    },
    {
      type: 'code',
      title: '⑤ as const：把类型钉成字面量（第 2 章）',
      lang: 'ts',
      path: 'processTextPrompt.ts',
      note: '为联合类型「辨识字段」服务：没有它 type 会退化成 string',
      lessons: ['as const'],
      code: `const b = { type: 'text' as const, text: 'hi' }
// 不写 as const：b.type 的类型是 string
// 写了之后：    b.type 的类型是 'text'，能参与联合类型辨识`,
    },
    { type: 'h2', text: '异步三件套' },
    {
      type: 'code',
      title: '⑥ async generator + for await（第 1、7 章）',
      lang: 'ts',
      path: 'query.ts / REPL.tsx',
      note: 'agent 主循环就是 async generator：边跑边 yield 事件；UI 用 for await 消费',
      lessons: ['async function*', 'for await…of'],
      code: `// 生产者：一边干活，一边吐事件
async function* query(opts) {
  while (true) {
    const resp = await callLLM(opts.messages)
    yield { type: 'assistant', resp }
    if (!resp.toolCalls.length) return
    for await (const r of runTools(resp.toolCalls)) {
      yield r
    }
  }
}

// 消费者：拿到一个就处理一个
for await (const event of query(opts)) {
  render(event)
}`,
    },
    {
      type: 'code',
      title: '⑦ Promise.all 并行取数（第 7 章）',
      lang: 'ts',
      path: 'queryContext.ts:44',
      note: '三个互不依赖的异步任务同时发起；总耗时 ≈ 最慢的那个',
      lessons: ['Promise.all'],
      code: `const [prompt, userCtx, sysCtx] = await Promise.all([
  getSystemPrompt(), getUserContext(), getSystemContext(),
])`,
    },
    {
      type: 'code',
      title: '⑧ 动态 import（第 7 章）',
      lang: 'ts',
      path: 'entrypoints/cli.tsx:33',
      note: 'import() 返回 Promise：用到那一刻才加载模块。CLI 启动提速的关键',
      lessons: ['动态 import'],
      code: `if (args[0] === '--version') {
  console.log('1.0.0')
  return                      // 快速路径：其余模块一个都不加载
}
const { profileCheckpoint } = await import('../utils/startupProfiler.js')`,
    },
    { type: 'h2', text: '数组与函数式' },
    {
      type: 'code',
      title: '⑨ reduce 累积器（第 4 章）',
      lang: 'ts',
      path: 'toolOrchestration.ts:91-116',
      note: 'reduce 不只是求和：把扁平列表按规则「折叠」成任意结构都靠它',
      lessons: ['reduce 累积器'],
      code: `const batches = tools.reduce((acc, t) => {
  const safe = isReadOnly(t)
  if (safe && acc.at(-1)?.isConcurrencySafe) acc.at(-1).blocks.push(t)
  else acc.push({ isConcurrencySafe: safe, blocks: [t] })
  return acc
}, [])   // 初始值 [] 就是累积器的起点`,
    },
    {
      type: 'code',
      title: '⑩ memoize 惰性缓存（第 6 章）',
      lang: 'ts',
      path: 'context.ts:155',
      note: 'async 函数的 memoize：把「计算一次的 Promise」存下来，后续 await 同一个结果',
      lessons: ['高阶函数', '闭包'],
      code: `function memoize(fn) {
  let cached = null
  return (...args) => {
    if (!cached) cached = fn(...args)   // 第一次真正执行
    return cached                       // 之后都返回同一个 Promise
  }
}
const getUserContext = memoize(async () => ({ claudeMd: '...', currentDate: '...' }))`,
    },
    { type: 'h2', text: '小练习（建议真打开编辑器做）' },
    {
      type: 'prose',
      html: `
<ol>
  <li><b>收窄练习</b>：给第 2 章的 <code>Block</code> 联合增加一个 <code>{ type: 'image'; url: string }</code> 成员，再用 <code>switch</code> 重写 <code>render()</code>。观察：漏写一个分支时，加一句 <code>default: block satisfies never</code> 会让 TS 报错，这是「穷尽性检查」技巧。</li>
  <li><b>泛型练习</b>：把 <code>Tool</code> 接口抄进一个空文件，写一个假的 <code>z.infer</code>（<code>type Infer&lt;S&gt; = S extends { shape: infer T } ? T : never</code>），体会「从 schema 推导类型」的机制。</li>
  <li><b>生成器练习</b>：把第 1 章教学版循环改写成 <code>async function*</code>，每步 <code>yield</code> 一个事件，再用 <code>for await</code> 打印。完成后你就独立实现了一个 30 行的 agent 骨架。</li>
</ol>
<p>想继续深入可以看：<a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for-await...of" target="_blank" rel="noopener">MDN 的 for await…of</a>、<a href="https://zod.dev" target="_blank" rel="noopener">zod 官方文档</a>、以及 TypeScript 手册的 <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html" target="_blank" rel="noopener">Narrowing</a> 一章。</p>`,
    },
    {
      type: 'quiz',
      q: '<code>a ?? b</code> 与 <code>a || b</code> 的关键区别是什么？',
      options: [
        '完全等价，?? 只是新写法',
        '?? 只在左侧是 null 或 undefined 时取右侧；|| 对 0、""、false 也会取右侧',
        '?? 更快',
        '|| 不能用于对象',
      ],
      answer: 1,
      explain:
        '空值合并只为「真正的空」兜底。源码里 permissionDecision.userModified ?? false 若写成 || false，当 userModified 是合法的假值时行为仍一致，但语义更精确。只要你想区分「没值」和「值就是假」，就该用 ??。',
    },
  ],
}
