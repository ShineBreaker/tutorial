/**
 * 第 2 章 · 消息与内容块：循环里流动的数据
 */
export default {
  id: 'ch02',
  num: 2,
  title: '消息与内容块',
  subtitle: 'agent 的全部记忆，就是数组里一条条 JSON',
  minutes: 10,
  sections: [
    {
      type: 'prose',
      html: `
<p>第 1 章的循环里，一直在被 <code>push</code> 的那个 <code>messages</code> 数组到底是什么？这一章把它摊开看。</p>
<p>模型 API 的消息结构很简单，每条消息只有两个必要字段：</p>
<pre class="code-body">{
  "role": "user" | "assistant",     // 谁说的
  "content": "..."                  // 说了什么
}</pre>
<p>关键在于 <code>content</code> 不只是字符串，它还可以是<b>内容块（content block）的数组</b>。agent 全靠这一点把「说话」和「动手」编码进同一条消息流：</p>
<table>
  <tr><th>block 类型</th><th>谁产出</th><th>干什么</th></tr>
  <tr><td><code>text</code></td><td>双方都行</td><td>普通文字</td></tr>
  <tr><td><code>tool_use</code></td><td>assistant</td><td>模型说：我想调用某个工具，参数是这些</td></tr>
  <tr><td><code>tool_result</code></td><td>user</td><td>程序回答：工具执行的结果在这里</td></tr>
</table>`,
    },
    {
      type: 'callout',
      tone: 'key',
      title: '本站模拟器里你已经见过它们',
      html: '<p>回忆模拟器右侧的 JSON 视图：<code>toolu_1</code> 这类 <code>tool_use</code> 块由模型产出，对应的 <code>tool_result</code> 靠 <code>tool_use_id</code> 配对、以 <b>user 消息</b>的身份进数组。这就是 agent 与模型之间全部的对话协议。</p>',
    },
    { type: 'h2', text: '用户输入如何变成消息' },
    {
      type: 'prose',
      html: `
<p>你在终端敲下的一行字，经过 <code>processUserInput()</code> 分流：以 <code>/</code> 开头且匹配已注册命令的走「斜杠命令」路径（本地命令直接执行；技能类命令把 SKILL.md 展开成消息）；普通文本则走下面这条路：</p>`,
    },
    {
      type: 'code',
      title: '一行文字 → 一条 user 消息',
      lang: 'ts',
      path: 'utils/processUserInput/processTextPrompt.ts:66-87',
      note: '整个「包装」就这几行：文本 + 粘贴的图片块，打包成一条消息',
      lessons: ['三元表达式', '展开运算符'],
      code: `  // If we have pasted images, create a message with image content
  if (imageContentBlocks.length > 0) {
    // Build content: text first, then images below
    const textContent =
      typeof input === 'string'
        ? input.trim()
          ? [{ type: 'text' as const, text: input }]
          : []
        : input
    const userMessage = createUserMessage({
      content: [...textContent, ...imageContentBlocks],
      uuid: uuid,
      imagePasteIds: imagePasteIds.length > 0 ? imagePasteIds : undefined,
      permissionMode,
      isMeta: isMeta || undefined,
    })

    return {
      messages: [userMessage, ...attachmentMessages],
      shouldQuery: true,   // "需要调用模型"
    }
  }`,
    },
    {
      type: 'prose',
      html: `
<p>注意 <code>as const</code>：它把 <code>type</code> 字段锁定为字面量 <code>'text'</code> 而不是宽泛的 <code>string</code>。这是 TypeScript 表达「这个字段只能是这几个值之一」的标准写法。</p>`,
    },
    { type: 'h2', text: '用 TypeScript 描述这套协议' },
    {
      type: 'prose',
      html: `
<p>消息格式是一份「合同」，TypeScript 最擅长的就是把合同写进类型系统。教学版类型如下（真实源码里字段多得多，但骨架一致）：</p>`,
    },
    {
      type: 'code',
      title: '教学版：消息类型定义',
      lang: 'ts',
      path: '教学示例 · 源码中见 types/ 目录与各消息类型',
      note: '联合类型 + 字面量字段：这是 TS 的 discriminated union（可辨识联合）',
      lessons: ['联合类型', '字面量类型', '可辨识联合'],
      code: `// 三种内容块，用 type 字段区分
type TextBlock      = { type: 'text'; text: string }
type ToolUseBlock   = { type: 'tool_use'; id: string; name: string; input: unknown }
type ToolResultBlock = {
  type: 'tool_result'
  tool_use_id: string   // 与哪个 tool_use 配对
  content: string
  is_error?: boolean    // 工具失败了？第 4 章会用到
}

// content 既可以是纯文本，也可以是块数组（联合类型）
type Content = string | Array<TextBlock | ToolUseBlock | ToolResultBlock>

type Message =
  | { role: 'user'; content: Content }
  | { role: 'assistant'; content: Content }`,
    },
    {
      type: 'prose',
      html: `
<p>可辨识联合的妙处在<b>使用侧</b>：只要 <code>if (block.type === 'tool_use')</code>，TypeScript 立刻知道这个 <code>block</code> 是 <code>ToolUseBlock</code>，访问 <code>block.input</code> 不会报错。这叫<b>类型收窄（narrowing）</b>：</p>`,
    },
    {
      type: 'code',
      title: '类型收窄：按 type 字段分支处理',
      lang: 'ts',
      path: 'query.ts:1422-1434（收窄实例）',
      note: '先 filter 出 text 块，再 at(-1) 取最后一块，收窄后才能读 .text',
      lessons: ['类型收窄', 'Array.at()'],
      code: `      const lastAssistantMessage = assistantMessages.at(-1)
      // ...
        const textBlocks = lastAssistantMessage.message.content.filter(
          block => block.type === 'text',
        )
        if (textBlocks.length > 0) {
          const lastTextBlock = textBlocks.at(-1)
          if (lastTextBlock && 'text' in lastTextBlock) {
            lastAssistantText = lastTextBlock.text   // ← 这里 TS 已知道有 .text
          }
        }`,
    },
    {
      type: 'callout',
      tone: 'tip',
      title: '为什么值得学这个',
      html: '<p>可辨识联合 + 收窄是处理「多种可能形状的数据」最安全的模式：新增一种 block 类型时，TypeScript 会在所有忘了处理它的分支上报错。<code>query.ts</code> 里几百处 <code>block.type ===</code> 判断，用的都是这个模式。</p>',
    },
    {
      type: 'quiz',
      q: '模型输出的 tool_use 和程序回填的 tool_result 是怎么配对的？',
      options: [
        '按数组下标配对',
        '按时间顺序，先到的和先到的配',
        '靠 tool_use_id：tool_result 里写着它回答的是哪个 id',
        '靠消息内容里的工具名字',
      ],
      answer: 2,
      explain:
        'tool_use 块携带一个唯一 id（如 toolu_1）；回填的 tool_result 块用 tool_use_id 字段引用它。同一轮里模型可以发起多个工具调用，id 保证一一对应，不会串。',
    },
    {
      type: 'quiz',
      q: 'TypeScript 里 <code>{ type: "text" as const }</code> 中的 as const 是为了什么？',
      options: [
        '让对象变成常量，不可修改',
        '把类型从宽泛的 string 收紧为字面量 "text"，方便联合类型辨识',
        '加快运行速度',
        '为了兼容旧版 JavaScript',
      ],
      answer: 1,
      explain:
        'as const 作用于类型层面：没有它，type 字段会被推断为 string，联合类型就无法靠它辨识分支。它不改变运行时行为，只帮助类型检查器。',
    },
  ],
}
