/**
 * 第 3 章 · 工具：带说明书的手
 */
export default {
  id: 'ch03',
  num: 3,
  title: '工具：带说明书的手',
  subtitle: '每个能力 = 一个 zod schema + 一个异步函数',
  minutes: 12,
  sections: [
    {
      type: 'prose',
      html: `
<p>模型没有文件系统、不能跑命令，它凭什么「读文件」？答案是：<b>程序把每种能力包装成一个工具对象，连同说明书一起递给模型</b>。模型并不执行任何东西，它只是「申请」调用。真正的执行永远发生在你本机的代码里。</p>
<p>于是工具的定义包含两个截然不同的部分：</p>
<ul>
  <li><b>说明书</b>：名字 + 参数 schema + 文字描述，给<b>模型</b>看，教它何时用、怎么传参</li>
  <li><b>本体</b>：<code>call()</code> 函数，给<b>程序</b>执行，真正干活</li>
</ul>
<p>看真实的 Tool 接口（有删节）：</p>`,
    },
    {
      type: 'code',
      title: 'Tool 接口：一份「工具的合同」',
      lang: 'ts',
      path: 'Tool.ts:362-397（有删节）',
      note: '泛型接口：Input 约束 schema，call() 的参数类型自动从 schema 推导',
      lessons: ['泛型接口', '泛型默认参数', 'z.infer 类型推导'],
      code: `export type Tool<
  Input extends AnyObject = AnyObject,
  Output = unknown,
  P extends ToolProgressData = ToolProgressData,
> = {
  // 可选别名：工具改名后，旧名字依然能被找到
  aliases?: string[]
  // 给 ToolSearch 关键词搜索用的一句话能力描述
  searchHint?: string
  // ★ 本体：真正执行的异步函数。args 的类型来自 Input schema
  call(
    args: z.infer<Input>,
    context: ToolUseContext,
    canUseTool: CanUseToolFn,
    parentMessage: AssistantMessage,
    onProgress?: ToolCallProgress<P>,
  ): Promise<ToolResult<Output>>
  // ★ 说明书：给模型看的文字（每次调用前可按上下文动态生成）
  description(
    input: z.infer<Input>,
    options: {
      isNonInteractiveSession: boolean
      toolPermissionContext: ToolPermissionContext
      tools: Tools
    },
  ): Promise<string>
  // ★ 参数说明书：zod schema
  readonly inputSchema: Input
  // MCP 外部工具可以直接给 JSON Schema，而不经过 zod
  readonly inputJSONSchema?: ToolInputJSONSchema`,
    },
    { type: 'h2', text: 'schema：模型的参数说明书' },
    {
      type: 'prose',
      html: `
<p><code>inputSchema</code> 用 <a href="https://zod.dev" target="_blank" rel="noopener">zod</a> 库定义。它的巧妙之处：<b>同一份定义，运行时校验参数、编译时推导类型、发布时转成 JSON Schema 给模型</b>，三份用途一次写完。</p>
<p>更妙的是 <code>.describe()</code> 里的文字会被带进 JSON Schema 的 description 字段发给模型。换句话说，<b>注释即提示词</b>：</p>`,
    },
    {
      type: 'code',
      title: 'Read 工具的参数 schema',
      lang: 'ts',
      path: 'tools/FileReadTool/FileReadTool.ts:227-243',
      note: '每个字段的 describe 都在教模型「什么时候该填这个参数、怎么填」',
      lessons: ['zod schema', '.describe() 即提示词'],
      code: `const inputSchema = lazySchema(() =>
  z.strictObject({
    file_path: z.string().describe('The absolute path to the file to read'),
    offset: semanticNumber(z.number().int().nonnegative().optional()).describe(
      'The line number to start reading from. Only provide if the file is too large to read at once',
    ),
    limit: semanticNumber(z.number().int().positive().optional()).describe(
      'The number of lines to read. Only provide if the file is too large to read at once.',
    ),
    pages: z
      .string()
      .optional()
      .describe(
        \`Page range for PDF files (e.g., "1-5", "3", "10-20"). Only applicable to PDF files. Maximum \${PDF_MAX_PAGES_PER_READ} pages per request.\`,
      ),
  }),
)`,
    },
    {
      type: 'callout',
      tone: 'tip',
      title: '一个值得偷师的写法',
      html: '<p>Bash 工具的 <code>command</code> 字段 description 里甚至举例教模型怎么写好命令描述（<code>ls → "List files in current directory"</code>）。写工具 = 写提示词工程，<b>schema 文案的质量直接决定模型调用的准确率</b>。</p>',
    },
    { type: 'h2', text: '注册表：一个数组决定模型能看到什么' },
    {
      type: 'code',
      title: '工具注册表',
      lang: 'ts',
      path: 'tools.ts:193-213（有删节）',
      note: '注册 = 放进数组。条件展开 (...(...)) 实现按环境装载',
      lessons: ['数组字面量', '条件展开'],
      code: `export function getAllBaseTools(): Tools {
  return [
    AgentTool,
    TaskOutputTool,
    BashTool,
    // Ant-native builds have bfs/ugrep embedded in the bun binary (same ARGV0
    // trick as ripgrep). When available, find/grep in Claude's shell are aliased
    // to these fast tools, so the dedicated Glob/Grep tools are unnecessary.
    ...(hasEmbeddedSearchTools() ? [] : [GlobTool, GrepTool]),
    ExitPlanModeV2Tool,
    FileReadTool,
    FileEditTool,
    FileWriteTool,
    NotebookEditTool,
    WebFetchTool,
    TodoWriteTool,
    // ...还有十几项
  ]`,
    },
    {
      type: 'prose',
      html: `
<p>这份数组之后还会被 <code>getTools()</code> 按权限 deny 规则和 <code>isEnabled()</code> 过滤，再和 MCP（Model Context Protocol，让外部程序向 agent 提供工具的协议）接入的外部工具合并去重。最终它就是发给 API 的 <code>tools</code> 参数。<b>模型看得见哪些工具，完全由这份列表决定</b>。你可以试试在会话里禁用某工具，观察它从此「消失」。</p>`,
    },
    { type: 'h2', text: 'buildTool：给所有工具兜底的工厂' },
    {
      type: 'prose',
      html: `
<p>60 多个工具，谁也不用实现接口的全部方法，因为有个工厂统一填默认值。注意默认值的选择偏向<b>保守</b>，第 5 章会回到这一点：</p>`,
    },
    {
      type: 'code',
      title: '默认值 + 工厂函数',
      lang: 'ts',
      path: 'Tool.ts:757-769 与 783-792',
      note: '默认不并发、默认按可写处理：不确定时偏向更安全的一侧，这叫 fail-closed，第 5 章细讲',
      lessons: ['对象展开合并默认值', '工厂函数'],
      code: `const TOOL_DEFAULTS = {
  isEnabled: () => true,
  isConcurrencySafe: (_input?: unknown) => false,  // 默认：不能并发
  isReadOnly: (_input?: unknown) => false,          // 默认：按可写处理
  isDestructive: (_input?: unknown) => false,
  checkPermissions: (
    input: { [key: string]: unknown },
    _ctx?: ToolUseContext,
  ): Promise<PermissionResult> =>
    // 默认放行，交给通用权限系统做判断
    Promise.resolve({ behavior: 'allow', updatedInput: input }),
  // ...
}

export function buildTool<D extends AnyToolDef>(def: D): BuiltTool<D> {
  return {
    ...TOOL_DEFAULTS,          // 先铺默认值
    userFacingName: () => def.name,
    ...def,                    // 工具自己的实现覆盖默认值
  } as BuiltTool<D>
}`,
    },
    {
      type: 'prose',
      html: `
<p>最后一个实例长这样（Grep，搜索工具）。<code>isReadOnly: true</code> 为什么让它免确认，第 5 章解释：</p>`,
    },
    {
      type: 'code',
      title: '一个完整工具实例的开头',
      lang: 'ts',
      path: 'tools/GrepTool/GrepTool.ts:160-194（有删节）',
      note: '声明式：一个对象把名字、说明、schema、并发/只读标记全部交代清楚',
      lessons: ['getter 惰性求值', '声明式配置'],
      code: `export const GrepTool = buildTool({
  name: GREP_TOOL_NAME,
  searchHint: 'search file contents with regex (ripgrep)',
  // 20K chars - tool result persistence threshold
  maxResultSizeChars: 20_000,
  strict: true,
  async description() {
    return getDescription()
  },
  userFacingName() {
    return 'Search'
  },
  // getter 而非普通属性：schema 到第一次使用时才构造，省模块加载开销
  get inputSchema(): InputSchema {
    return inputSchema()
  },
  isConcurrencySafe() {
    return true
  },
  isReadOnly() {
    return true
  },
  // ...后面是 call() 等实现`,
    },
    {
      type: 'quiz',
      q: '模型「调用工具」的时候，实际上发生了什么？',
      options: [
        '模型在你电脑上执行了那个函数',
        '模型只输出一段「我想调用 X 工具、参数如此」的结构化数据；执行由本地程序完成',
        '模型把代码发给 Anthropic 服务器执行',
        '工具在模型训练时就学会了，直接给出结果',
      ],
      answer: 1,
      explain:
        '模型永远只产出 tool_use block（一段 JSON）。收到它的程序负责校验参数、检查权限、执行 call()、把结果包成 tool_result 回填。模型自始至终没碰过你的文件系统。',
    },
    {
      type: 'quiz',
      q: '为什么用 zod 定义 inputSchema，而不是手写一份 JSON Schema？',
      options: [
        'zod 更快',
        '一份定义三份收益：运行时校验、TS 类型自动推导（z.infer）、转 JSON Schema 给模型',
        '因为 Anthropic API 只接受 zod',
        'JSON Schema 语法太简单',
      ],
      answer: 1,
      explain:
        'zod 是「单一事实源」：call() 的参数类型用 z.infer<Input> 从 schema 推导，模型看到的 JSON Schema 由 schema 转换而来，参数校验用同一个 schema 的 safeParse。改动一处，三处同步。',
    },
  ],
}
