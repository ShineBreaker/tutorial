/**
 * real-sources.js · 教程引用的真实源码片段（由 tools/gen-real-sources.py 生成，请勿手改）
 *
 * 作用：代码卡片上的「查看真实源码」按钮按 path 字符串从这里取片段，
 * 在悬浮窗里展示带行号的真实实现。mode:
 *   excerpt · 行号区间片段，focus 是要点亮的那一行
 *   outline · 引用没给行号，退化为文件声明骨架
 */
export const REAL_SOURCES = {
  "伪代码 · 真实实现见 query.ts:307": {
    "file": "query.ts",
    "abs": "query.ts",
    "ref": "伪代码 · 真实实现见 query.ts:307",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 293,
        "end": 321,
        "focus": 307,
        "code": "  // Snapshot immutable env/statsig/session state once at entry. See QueryConfig\n  // for what's included and why feature() gates are intentionally excluded.\n  const config = buildQueryConfig()\n\n  // Fired once per user turn — the prompt is invariant across loop iterations,\n  // so per-iteration firing would ask sideQuery the same question N times.\n  // Consume point polls settledAt (never blocks). `using` disposes on all\n  // generator exit paths — see MemoryPrefetch for dispose/telemetry semantics.\n  using pendingMemoryPrefetch = startRelevantMemoryPrefetch(\n    state.messages,\n    state.toolUseContext,\n  )\n\n  // eslint-disable-next-line no-constant-condition\n  while (true) {\n    // Destructure state at the top of each iteration. toolUseContext alone\n    // is reassigned within an iteration (queryTracking, messages updates);\n    // the rest are read-only between continue sites.\n    let { toolUseContext } = state\n    const {\n      messages,\n      autoCompactTracking,\n      maxOutputTokensRecoveryCount,\n      hasAttemptedReactiveCompact,\n      maxOutputTokensOverride,\n      pendingToolUseSummary,\n      stopHookActive,\n      turnCount,\n    } = state"
      }
    ]
  },
  "query.ts:307-311": {
    "file": "query.ts",
    "abs": "query.ts",
    "ref": "query.ts:307-311",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 307,
        "end": 311,
        "focus": 307,
        "code": "  while (true) {\n    // Destructure state at the top of each iteration. toolUseContext alone\n    // is reassigned within an iteration (queryTracking, messages updates);\n    // the rest are read-only between continue sites.\n    let { toolUseContext } = state"
      }
    ]
  },
  "query.ts:1380-1400": {
    "file": "query.ts",
    "abs": "query.ts",
    "ref": "query.ts:1380-1400",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 1380,
        "end": 1400,
        "focus": 1380,
        "code": "    const toolUpdates = streamingToolExecutor\n      ? streamingToolExecutor.getRemainingResults()\n      : runTools(toolUseBlocks, assistantMessages, canUseTool, toolUseContext)\n\n    for await (const update of toolUpdates) {\n      if (update.message) {\n        yield update.message\n\n        if (\n          update.message.type === 'attachment' &&\n          update.message.attachment.type === 'hook_stopped_continuation'\n        ) {\n          shouldPreventContinuation = true\n        }\n\n        toolResults.push(\n          ...normalizeMessagesForAPI(\n            [update.message],\n            toolUseContext.options.tools,\n          ).filter(_ => _.type === 'user'),\n        )"
      }
    ]
  },
  "query.ts:834 与 1062": {
    "file": "query.ts",
    "abs": "query.ts",
    "ref": "query.ts:834 与 1062",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 820,
        "end": 848,
        "focus": 834,
        "code": "            if (isWithheldMaxOutputTokens(message)) {\n              withheld = true\n            }\n            if (!withheld) {\n              yield yieldMessage\n            }\n            if (message.type === 'assistant') {\n              assistantMessages.push(message)\n\n              const msgToolUseBlocks = message.message.content.filter(\n                content => content.type === 'tool_use',\n              ) as ToolUseBlock[]\n              if (msgToolUseBlocks.length > 0) {\n                toolUseBlocks.push(...msgToolUseBlocks)\n                needsFollowUp = true\n              }\n\n              if (\n                streamingToolExecutor &&\n                !toolUseContext.abortController.signal.aborted\n              ) {\n                for (const toolBlock of msgToolUseBlocks) {\n                  streamingToolExecutor.addTool(toolBlock, message)\n                }\n              }\n            }\n\n            if (\n              streamingToolExecutor &&"
      },
      {
        "start": 1048,
        "end": 1076,
        "focus": 1062,
        "code": "          toolUse: false,\n        })\n      }\n      return { reason: 'aborted_streaming' }\n    }\n\n    // Yield tool use summary from previous turn — haiku (~1s) resolved during model streaming (5-30s)\n    if (pendingToolUseSummary) {\n      const summary = await pendingToolUseSummary\n      if (summary) {\n        yield summary\n      }\n    }\n\n    if (!needsFollowUp) {\n      const lastMessage = assistantMessages.at(-1)\n\n      // Prompt-too-long recovery: the streaming loop withheld the error\n      // (see withheldByCollapse / withheldByReactive above). Try collapse\n      // drain first (cheap, keeps granular context), then reactive compact\n      // (full summary). Single-shot on each — if a retry still 413's,\n      // the next stage handles it or the error surfaces.\n      const isWithheld413 =\n        lastMessage?.type === 'assistant' &&\n        lastMessage.isApiErrorMessage &&\n        isPromptTooLongMessage(lastMessage)\n      // Media-size rejections (image/PDF/many-image) are recoverable via\n      // reactive compact's strip-retry. Unlike PTL, media errors skip the\n      // collapse drain — collapse doesn't strip images. mediaRecoveryEnabled"
      }
    ]
  },
  "utils/processUserInput/processTextPrompt.ts:66-87": {
    "file": "utils/processUserInput/processTextPrompt.ts",
    "abs": "utils/processUserInput/processTextPrompt.ts",
    "ref": "utils/processUserInput/processTextPrompt.ts:66-87",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 66,
        "end": 87,
        "focus": 66,
        "code": "  // If we have pasted images, create a message with image content\n  if (imageContentBlocks.length > 0) {\n    // Build content: text first, then images below\n    const textContent =\n      typeof input === 'string'\n        ? input.trim()\n          ? [{ type: 'text' as const, text: input }]\n          : []\n        : input\n    const userMessage = createUserMessage({\n      content: [...textContent, ...imageContentBlocks],\n      uuid: uuid,\n      imagePasteIds: imagePasteIds.length > 0 ? imagePasteIds : undefined,\n      permissionMode,\n      isMeta: isMeta || undefined,\n    })\n\n    return {\n      messages: [userMessage, ...attachmentMessages],\n      shouldQuery: true,\n    }\n  }"
      }
    ]
  },
  "query.ts:1422-1434（收窄实例）": {
    "file": "query.ts",
    "abs": "query.ts",
    "ref": "query.ts:1422-1434（收窄实例）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 1422,
        "end": 1434,
        "focus": 1422,
        "code": "      const lastAssistantMessage = assistantMessages.at(-1)\n      let lastAssistantText: string | undefined\n      if (lastAssistantMessage) {\n        const textBlocks = lastAssistantMessage.message.content.filter(\n          block => block.type === 'text',\n        )\n        if (textBlocks.length > 0) {\n          const lastTextBlock = textBlocks.at(-1)\n          if (lastTextBlock && 'text' in lastTextBlock) {\n            lastAssistantText = lastTextBlock.text\n          }\n        }\n      }"
      }
    ]
  },
  "Tool.ts:362-397（有删节）": {
    "file": "Tool.ts",
    "abs": "Tool.ts",
    "ref": "Tool.ts:362-397（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 362,
        "end": 397,
        "focus": 362,
        "code": "export type Tool<\n  Input extends AnyObject = AnyObject,\n  Output = unknown,\n  P extends ToolProgressData = ToolProgressData,\n> = {\n  /**\n   * Optional aliases for backwards compatibility when a tool is renamed.\n   * The tool can be looked up by any of these names in addition to its primary name.\n   */\n  aliases?: string[]\n  /**\n   * One-line capability phrase used by ToolSearch for keyword matching.\n   * Helps the model find this tool via keyword search when it's deferred.\n   * 3–10 words, no trailing period.\n   * Prefer terms not already in the tool name (e.g. 'jupyter' for NotebookEdit).\n   */\n  searchHint?: string\n  call(\n    args: z.infer<Input>,\n    context: ToolUseContext,\n    canUseTool: CanUseToolFn,\n    parentMessage: AssistantMessage,\n    onProgress?: ToolCallProgress<P>,\n  ): Promise<ToolResult<Output>>\n  description(\n    input: z.infer<Input>,\n    options: {\n      isNonInteractiveSession: boolean\n      toolPermissionContext: ToolPermissionContext\n      tools: Tools\n    },\n  ): Promise<string>\n  readonly inputSchema: Input\n  // Type for MCP tools that can specify their input schema directly in JSON Schema format\n  // rather than converting from Zod schema\n  readonly inputJSONSchema?: ToolInputJSONSchema"
      }
    ]
  },
  "tools/FileReadTool/FileReadTool.ts:227-243": {
    "file": "tools/FileReadTool/FileReadTool.ts",
    "abs": "tools/FileReadTool/FileReadTool.ts",
    "ref": "tools/FileReadTool/FileReadTool.ts:227-243",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 227,
        "end": 243,
        "focus": 227,
        "code": "const inputSchema = lazySchema(() =>\n  z.strictObject({\n    file_path: z.string().describe('The absolute path to the file to read'),\n    offset: semanticNumber(z.number().int().nonnegative().optional()).describe(\n      'The line number to start reading from. Only provide if the file is too large to read at once',\n    ),\n    limit: semanticNumber(z.number().int().positive().optional()).describe(\n      'The number of lines to read. Only provide if the file is too large to read at once.',\n    ),\n    pages: z\n      .string()\n      .optional()\n      .describe(\n        `Page range for PDF files (e.g., \"1-5\", \"3\", \"10-20\"). Only applicable to PDF files. Maximum ${PDF_MAX_PAGES_PER_READ} pages per request.`,\n      ),\n  }),\n)"
      }
    ]
  },
  "tools.ts:193-213（有删节）": {
    "file": "tools.ts",
    "abs": "tools.ts",
    "ref": "tools.ts:193-213（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 193,
        "end": 213,
        "focus": 193,
        "code": "export function getAllBaseTools(): Tools {\n  return [\n    AgentTool,\n    TaskOutputTool,\n    BashTool,\n    // Ant-native builds have bfs/ugrep embedded in the bun binary (same ARGV0\n    // trick as ripgrep). When available, find/grep in Claude's shell are aliased\n    // to these fast tools, so the dedicated Glob/Grep tools are unnecessary.\n    ...(hasEmbeddedSearchTools() ? [] : [GlobTool, GrepTool]),\n    ExitPlanModeV2Tool,\n    FileReadTool,\n    FileEditTool,\n    FileWriteTool,\n    NotebookEditTool,\n    WebFetchTool,\n    TodoWriteTool,\n    WebSearchTool,\n    TaskStopTool,\n    AskUserQuestionTool,\n    SkillTool,\n    EnterPlanModeTool,"
      }
    ]
  },
  "Tool.ts:757-769 与 783-792": {
    "file": "Tool.ts",
    "abs": "Tool.ts",
    "ref": "Tool.ts:757-769 与 783-792",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 757,
        "end": 769,
        "focus": 757,
        "code": "const TOOL_DEFAULTS = {\n  isEnabled: () => true,\n  isConcurrencySafe: (_input?: unknown) => false,\n  isReadOnly: (_input?: unknown) => false,\n  isDestructive: (_input?: unknown) => false,\n  checkPermissions: (\n    input: { [key: string]: unknown },\n    _ctx?: ToolUseContext,\n  ): Promise<PermissionResult> =>\n    Promise.resolve({ behavior: 'allow', updatedInput: input }),\n  toAutoClassifierInput: (_input?: unknown) => '',\n  userFacingName: (_input?: unknown) => '',\n}"
      },
      {
        "start": 783,
        "end": 792,
        "focus": 783,
        "code": "export function buildTool<D extends AnyToolDef>(def: D): BuiltTool<D> {\n  // The runtime spread is straightforward; the `as` bridges the gap between\n  // the structural-any constraint and the precise BuiltTool<D> return. The\n  // type semantics are proven by the 0-error typecheck across all 60+ tools.\n  return {\n    ...TOOL_DEFAULTS,\n    userFacingName: () => def.name,\n    ...def,\n  } as BuiltTool<D>\n}"
      }
    ]
  },
  "tools/GrepTool/GrepTool.ts:160-194（有删节）": {
    "file": "tools/GrepTool/GrepTool.ts",
    "abs": "tools/GrepTool/GrepTool.ts",
    "ref": "tools/GrepTool/GrepTool.ts:160-194（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 160,
        "end": 194,
        "focus": 160,
        "code": "export const GrepTool = buildTool({\n  name: GREP_TOOL_NAME,\n  searchHint: 'search file contents with regex (ripgrep)',\n  // 20K chars - tool result persistence threshold\n  maxResultSizeChars: 20_000,\n  strict: true,\n  async description() {\n    return getDescription()\n  },\n  userFacingName() {\n    return 'Search'\n  },\n  getToolUseSummary,\n  getActivityDescription(input) {\n    const summary = getToolUseSummary(input)\n    return summary ? `Searching for ${summary}` : 'Searching'\n  },\n  get inputSchema(): InputSchema {\n    return inputSchema()\n  },\n  get outputSchema(): OutputSchema {\n    return outputSchema()\n  },\n  isConcurrencySafe() {\n    return true\n  },\n  isReadOnly() {\n    return true\n  },\n  toAutoClassifierInput(input) {\n    return input.path ? `${input.pattern} in ${input.path}` : input.pattern\n  },\n  isSearchOrReadCommand() {\n    return { isSearch: true, isRead: false }\n  },"
      }
    ]
  },
  "services/tools/toolExecution.ts:614-616": {
    "file": "services/tools/toolExecution.ts",
    "abs": "services/tools/toolExecution.ts",
    "ref": "services/tools/toolExecution.ts:614-616",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 614,
        "end": 616,
        "focus": 614,
        "code": "  // Validate input types with zod (surprisingly, the model is not great at generating valid input)\n  const parsedInput = tool.inputSchema.safeParse(input)\n  if (!parsedInput.success) {"
      }
    ]
  },
  "services/tools/toolExecution.ts:664-679（有删节）": {
    "file": "services/tools/toolExecution.ts",
    "abs": "services/tools/toolExecution.ts",
    "ref": "services/tools/toolExecution.ts:664-679（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 664,
        "end": 679,
        "focus": 664,
        "code": "    return [\n      {\n        message: createUserMessage({\n          content: [\n            {\n              type: 'tool_result',\n              content: `<tool_use_error>InputValidationError: ${errorContent}</tool_use_error>`,\n              is_error: true,\n              tool_use_id: toolUseID,\n            },\n          ],\n          toolUseResult: `InputValidationError: ${parsedInput.error.message}`,\n          sourceToolAssistantUUID: assistantMessage.uuid,\n        }),\n      },\n    ]"
      }
    ]
  },
  "services/tools/toolExecution.ts:1206-1222（有删节）": {
    "file": "services/tools/toolExecution.ts",
    "abs": "services/tools/toolExecution.ts",
    "ref": "services/tools/toolExecution.ts:1206-1222（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 1206,
        "end": 1222,
        "focus": 1206,
        "code": "  try {\n    const result = await tool.call(\n      callInput,\n      {\n        ...toolUseContext,\n        toolUseId: toolUseID,\n        userModified: permissionDecision.userModified ?? false,\n      },\n      canUseTool,\n      assistantMessage,\n      progress => {\n        onToolProgress({\n          toolUseID: progress.toolUseID,\n          data: progress.data,\n        })\n      },\n    )"
      }
    ]
  },
  "services/tools/toolExecution.ts:1292-1295": {
    "file": "services/tools/toolExecution.ts",
    "abs": "services/tools/toolExecution.ts",
    "ref": "services/tools/toolExecution.ts:1292-1295",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 1292,
        "end": 1295,
        "focus": 1292,
        "code": "    const mappedToolResultBlock = tool.mapToolResultToToolResultBlockParam(\n      result.data,\n      toolUseID,\n    )"
      }
    ]
  },
  "services/tools/toolOrchestration.ts:91-116": {
    "file": "services/tools/toolOrchestration.ts",
    "abs": "services/tools/toolOrchestration.ts",
    "ref": "services/tools/toolOrchestration.ts:91-116",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 91,
        "end": 116,
        "focus": 91,
        "code": "function partitionToolCalls(\n  toolUseMessages: ToolUseBlock[],\n  toolUseContext: ToolUseContext,\n): Batch[] {\n  return toolUseMessages.reduce((acc: Batch[], toolUse) => {\n    const tool = findToolByName(toolUseContext.options.tools, toolUse.name)\n    const parsedInput = tool?.inputSchema.safeParse(toolUse.input)\n    const isConcurrencySafe = parsedInput?.success\n      ? (() => {\n          try {\n            return Boolean(tool?.isConcurrencySafe(parsedInput.data))\n          } catch {\n            // If isConcurrencySafe throws (e.g., due to shell-quote parse failure),\n            // treat as not concurrency-safe to be conservative\n            return false\n          }\n        })()\n      : false\n    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe) {\n      acc[acc.length - 1]!.blocks.push(toolUse)\n    } else {\n      acc.push({ isConcurrencySafe, blocks: [toolUse] })\n    }\n    return acc\n  }, [])\n}"
      }
    ]
  },
  "utils/permissions/filesystem.ts:1136-1151": {
    "file": "utils/permissions/filesystem.ts",
    "abs": "utils/permissions/filesystem.ts",
    "ref": "utils/permissions/filesystem.ts:1136-1151",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 1136,
        "end": 1151,
        "focus": 1136,
        "code": "  // 6. Allow reads in working directories\n  const isInWorkingDir = pathInAllowedWorkingPath(\n    path,\n    toolPermissionContext,\n    pathsToCheck,\n  )\n  if (isInWorkingDir) {\n    return {\n      behavior: 'allow',\n      updatedInput: input,\n      decisionReason: {\n        type: 'mode',\n        mode: 'default',\n      },\n    }\n  }"
      }
    ]
  },
  "tools/BashTool/BashTool.tsx:434-441": {
    "file": "tools/BashTool/BashTool.tsx",
    "abs": "tools/BashTool/BashTool.tsx",
    "ref": "tools/BashTool/BashTool.tsx:434-441",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 434,
        "end": 441,
        "focus": 434,
        "code": "  isConcurrencySafe(input) {\n    return this.isReadOnly?.(input) ?? false;\n  },\n  isReadOnly(input) {\n    const compoundCommandHasCd = commandHasAnyCd(input.command);\n    const result = checkReadOnlyConstraints(input, compoundCommandHasCd);\n    return result.behavior === 'allow';\n  },"
      }
    ]
  },
  "constants/prompts.ts:560-577": {
    "file": "constants/prompts.ts",
    "abs": "constants/prompts.ts",
    "ref": "constants/prompts.ts:560-577",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 560,
        "end": 577,
        "focus": 560,
        "code": "  return [\n    // --- Static content (cacheable) ---\n    getSimpleIntroSection(outputStyleConfig),\n    getSimpleSystemSection(),\n    outputStyleConfig === null ||\n    outputStyleConfig.keepCodingInstructions === true\n      ? getSimpleDoingTasksSection()\n      : null,\n    getActionsSection(),\n    getUsingYourToolsSection(enabledTools),\n    getSimpleToneAndStyleSection(),\n    getOutputEfficiencySection(),\n    // === BOUNDARY MARKER - DO NOT MOVE OR REMOVE ===\n    ...(shouldUseGlobalCacheScope() ? [SYSTEM_PROMPT_DYNAMIC_BOUNDARY] : []),\n    // --- Dynamic content (registry-managed) ---\n    ...resolvedDynamicSections,\n  ].filter(s => s !== null)\n}"
      }
    ]
  },
  "context.ts:155-189（有删节）": {
    "file": "context.ts",
    "abs": "context.ts",
    "ref": "context.ts:155-189（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 155,
        "end": 189,
        "focus": 155,
        "code": "export const getUserContext = memoize(\n  async (): Promise<{\n    [k: string]: string\n  }> => {\n    const startTime = Date.now()\n    logForDiagnosticsNoPII('info', 'user_context_started')\n\n    // CLAUDE_CODE_DISABLE_CLAUDE_MDS: hard off, always.\n    // --bare: skip auto-discovery (cwd walk), BUT honor explicit --add-dir.\n    // --bare means \"skip what I didn't ask for\", not \"ignore what I asked for\".\n    const shouldDisableClaudeMd =\n      isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS) ||\n      (isBareMode() && getAdditionalDirectoriesForClaudeMd().length === 0)\n    // Await the async I/O (readFile/readdir directory walk) so the event\n    // loop yields naturally at the first fs.readFile.\n    const claudeMd = shouldDisableClaudeMd\n      ? null\n      : getClaudeMds(filterInjectedMemoryFiles(await getMemoryFiles()))\n    // Cache for the auto-mode classifier (yoloClassifier.ts reads this\n    // instead of importing claudemd.ts directly, which would create a\n    // cycle through permissions/filesystem → permissions → yoloClassifier).\n    setCachedClaudeMdContent(claudeMd || null)\n\n    logForDiagnosticsNoPII('info', 'user_context_completed', {\n      duration_ms: Date.now() - startTime,\n      claudemd_length: claudeMd?.length ?? 0,\n      claudemd_disabled: Boolean(shouldDisableClaudeMd),\n    })\n\n    return {\n      ...(claudeMd && { claudeMd }),\n      currentDate: `Today's date is ${getLocalISODate()}.`,\n    }\n  },\n)"
      }
    ]
  },
  "query.ts:396-426（有删节）": {
    "file": "query.ts",
    "abs": "query.ts",
    "ref": "query.ts:396-426（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 396,
        "end": 426,
        "focus": 396,
        "code": "    // Apply snip before microcompact (both may run — they are not mutually exclusive).\n    // snipTokensFreed is plumbed to autocompact so its threshold check reflects\n    // what snip removed; tokenCountWithEstimation alone can't see it (reads usage\n    // from the protected-tail assistant, which survives snip unchanged).\n    let snipTokensFreed = 0\n    if (feature('HISTORY_SNIP')) {\n      queryCheckpoint('query_snip_start')\n      const snipResult = snipModule!.snipCompactIfNeeded(messagesForQuery)\n      messagesForQuery = snipResult.messages\n      snipTokensFreed = snipResult.tokensFreed\n      if (snipResult.boundaryMessage) {\n        yield snipResult.boundaryMessage\n      }\n      queryCheckpoint('query_snip_end')\n    }\n\n    // Apply microcompact before autocompact\n    queryCheckpoint('query_microcompact_start')\n    const microcompactResult = await deps.microcompact(\n      messagesForQuery,\n      toolUseContext,\n      querySource,\n    )\n    messagesForQuery = microcompactResult.messages\n    // For cached microcompact (cache editing), defer boundary message until after\n    // the API response so we can use actual cache_deleted_input_tokens.\n    // Gated behind feature() so the string is eliminated from external builds.\n    const pendingCacheEdits = feature('CACHED_MICROCOMPACT')\n      ? microcompactResult.compactionInfo?.pendingCacheEdits\n      : undefined\n    queryCheckpoint('query_microcompact_end')"
      }
    ]
  },
  "entrypoints/cli.tsx:28-53": {
    "file": "entrypoints/cli.tsx",
    "abs": "entrypoints/cli.tsx",
    "ref": "entrypoints/cli.tsx:28-53",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 28,
        "end": 53,
        "focus": 28,
        "code": "/**\n * Bootstrap entrypoint - checks for special flags before loading the full CLI.\n * All imports are dynamic to minimize module evaluation for fast paths.\n * Fast-path for --version has zero imports beyond this file.\n */\nasync function main(): Promise<void> {\n  const args = process.argv.slice(2);\n\n  // Fast-path for --version/-v: zero module loading needed\n  if (args.length === 1 && (args[0] === '--version' || args[0] === '-v' || args[0] === '-V')) {\n    // MACRO.VERSION is inlined at build time\n    // biome-ignore lint/suspicious/noConsole:: intentional console output\n    console.log(`${MACRO.VERSION} (Claude Code)`);\n    return;\n  }\n\n  // For all other paths, load the startup profiler\n  const {\n    profileCheckpoint\n  } = await import('../utils/startupProfiler.js');\n  profileCheckpoint('cli_entry');\n\n  // Fast-path for --dump-system-prompt: output the rendered system prompt and exit.\n  // Used by prompt sensitivity evals to extract the system prompt at a specific commit.\n  // Ant-only: eliminated from external builds via feature flag.\n  if (feature('DUMP_SYSTEM_PROMPT') && args[0] === '--dump-system-prompt') {"
      }
    ]
  },
  "utils/queryContext.ts:61-75（有删节）": {
    "file": "utils/queryContext.ts",
    "abs": "utils/queryContext.ts",
    "ref": "utils/queryContext.ts:61-75（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 61,
        "end": 74,
        "focus": 61,
        "code": "  const [defaultSystemPrompt, userContext, systemContext] = await Promise.all([\n    customSystemPrompt !== undefined\n      ? Promise.resolve([])\n      : getSystemPrompt(\n          tools,\n          mainLoopModel,\n          additionalWorkingDirectories,\n          mcpClients,\n        ),\n    getUserContext(),\n    customSystemPrompt !== undefined ? Promise.resolve({}) : getSystemContext(),\n  ])\n  return { defaultSystemPrompt, userContext, systemContext }\n}"
      }
    ]
  },
  "screens/REPL.tsx:2793-2803（有删节）": {
    "file": "screens/REPL.tsx",
    "abs": "screens/REPL.tsx",
    "ref": "screens/REPL.tsx:2793-2803（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 2793,
        "end": 2803,
        "focus": 2793,
        "code": "    for await (const event of query({\n      messages: messagesIncludingNewMessages,\n      systemPrompt,\n      userContext,\n      systemContext,\n      canUseTool,\n      toolUseContext,\n      querySource: getQuerySourceForREPL()\n    })) {\n      onQueryEvent(event);\n    }"
      }
    ]
  },
  "services/api/claude.ts:2229-2256（有删节）": {
    "file": "services/api/claude.ts",
    "abs": "services/api/claude.ts",
    "ref": "services/api/claude.ts:2229-2256（有删节）",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 2229,
        "end": 2256,
        "focus": 2229,
        "code": "            // Write final usage and stop_reason back to the last yielded\n            // message. Messages are created at content_block_stop from\n            // partialMessage, which was set at message_start before any tokens\n            // were generated (output_tokens: 0, stop_reason: null).\n            // message_delta arrives after content_block_stop with the real\n            // values.\n            //\n            // IMPORTANT: Use direct property mutation, not object replacement.\n            // The transcript write queue holds a reference to message.message\n            // and serializes it lazily (100ms flush interval). Object\n            // replacement ({ ...lastMsg.message, usage }) would disconnect\n            // the queued reference; direct mutation ensures the transcript\n            // captures the final values.\n            stopReason = part.delta.stop_reason\n\n            const lastMsg = newMessages.at(-1)\n            if (lastMsg) {\n              lastMsg.message.usage = usage\n              lastMsg.message.stop_reason = stopReason\n            }\n\n            // Update cost\n            const costUSDForPart = calculateUSDCost(resolvedModel, usage)\n            costUSD += addToTotalSessionCost(\n              costUSDForPart,\n              usage,\n              options.model,\n            )"
      }
    ]
  },
  "Tool.ts:362": {
    "file": "Tool.ts",
    "abs": "Tool.ts",
    "ref": "Tool.ts:362",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 348,
        "end": 376,
        "focus": 362,
        "code": "export function toolMatchesName(\n  tool: { name: string; aliases?: string[] },\n  name: string,\n): boolean {\n  return tool.name === name || (tool.aliases?.includes(name) ?? false)\n}\n\n/**\n * Finds a tool by name or alias from a list of tools.\n */\nexport function findToolByName(tools: Tools, name: string): Tool | undefined {\n  return tools.find(t => toolMatchesName(t, name))\n}\n\nexport type Tool<\n  Input extends AnyObject = AnyObject,\n  Output = unknown,\n  P extends ToolProgressData = ToolProgressData,\n> = {\n  /**\n   * Optional aliases for backwards compatibility when a tool is renamed.\n   * The tool can be looked up by any of these names in addition to its primary name.\n   */\n  aliases?: string[]\n  /**\n   * One-line capability phrase used by ToolSearch for keyword matching.\n   * Helps the model find this tool via keyword search when it's deferred.\n   * 3–10 words, no trailing period.\n   * Prefer terms not already in the tool name (e.g. 'jupyter' for NotebookEdit)."
      }
    ]
  },
  "Tool.ts:783-792": {
    "file": "Tool.ts",
    "abs": "Tool.ts",
    "ref": "Tool.ts:783-792",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 783,
        "end": 792,
        "focus": 783,
        "code": "export function buildTool<D extends AnyToolDef>(def: D): BuiltTool<D> {\n  // The runtime spread is straightforward; the `as` bridges the gap between\n  // the structural-any constraint and the precise BuiltTool<D> return. The\n  // type semantics are proven by the 0-error typecheck across all 60+ tools.\n  return {\n    ...TOOL_DEFAULTS,\n    userFacingName: () => def.name,\n    ...def,\n  } as BuiltTool<D>\n}"
      }
    ]
  },
  "toolOrchestration.ts / BashTool.tsx": {
    "file": "services/tools/toolOrchestration.ts",
    "abs": "services/tools/toolOrchestration.ts",
    "ref": "toolOrchestration.ts / BashTool.tsx",
    "mode": "outline",
    "outline": [
      {
        "n": 8,
        "code": "function getMaxToolUseConcurrency(): number {"
      },
      {
        "n": 14,
        "code": "export type MessageUpdate = {"
      },
      {
        "n": 84,
        "code": "type Batch = { isConcurrencySafe: boolean; blocks: ToolUseBlock[] }"
      },
      {
        "n": 91,
        "code": "function partitionToolCalls("
      },
      {
        "n": 179,
        "code": "function markToolUseAsComplete("
      }
    ]
  },
  "processTextPrompt.ts": {
    "file": "utils/processUserInput/processTextPrompt.ts",
    "abs": "utils/processUserInput/processTextPrompt.ts",
    "ref": "processTextPrompt.ts",
    "mode": "outline",
    "outline": [
      {
        "n": 19,
        "code": "export function processTextPrompt("
      }
    ]
  },
  "query.ts / REPL.tsx": {
    "file": "query.ts",
    "abs": "query.ts",
    "ref": "query.ts / REPL.tsx",
    "mode": "outline",
    "outline": [
      {
        "n": 15,
        "code": "const reactiveCompact = feature('REACTIVE_COMPACT')"
      },
      {
        "n": 18,
        "code": "const contextCollapse = feature('CONTEXT_COLLAPSE')"
      },
      {
        "n": 66,
        "code": "const skillPrefetch = feature('EXPERIMENTAL_SKILL_SEARCH')"
      },
      {
        "n": 69,
        "code": "const jobClassifier = feature('TEMPLATES')"
      },
      {
        "n": 115,
        "code": "const snipModule = feature('HISTORY_SNIP')"
      },
      {
        "n": 118,
        "code": "const taskSummaryModule = feature('BG_SESSIONS')"
      },
      {
        "n": 164,
        "code": "const MAX_OUTPUT_TOKENS_RECOVERY_LIMIT = 3"
      },
      {
        "n": 175,
        "code": "function isWithheldMaxOutputTokens("
      },
      {
        "n": 181,
        "code": "export type QueryParams = {"
      },
      {
        "n": 204,
        "code": "type State = {"
      }
    ]
  },
  "queryContext.ts:44": {
    "file": "utils/queryContext.ts",
    "abs": "utils/queryContext.ts",
    "ref": "queryContext.ts:44",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 30,
        "end": 58,
        "focus": 44,
        "code": "/**\n * Fetch the three context pieces that form the API cache-key prefix:\n * systemPrompt parts, userContext, systemContext.\n *\n * When customSystemPrompt is set, the default getSystemPrompt build and\n * getSystemContext are skipped — the custom prompt replaces the default\n * entirely, and systemContext would be appended to a default that isn't\n * being used.\n *\n * Callers assemble the final systemPrompt from defaultSystemPrompt (or\n * customSystemPrompt) + optional extras + appendSystemPrompt. QueryEngine\n * injects coordinator userContext and memory-mechanics prompt on top;\n * sideQuestion's fallback uses the base result directly.\n */\nexport async function fetchSystemPromptParts({\n  tools,\n  mainLoopModel,\n  additionalWorkingDirectories,\n  mcpClients,\n  customSystemPrompt,\n}: {\n  tools: Tools\n  mainLoopModel: string\n  additionalWorkingDirectories: string[]\n  mcpClients: MCPServerConnection[]\n  customSystemPrompt: string | undefined\n}): Promise<{\n  defaultSystemPrompt: string[]\n  userContext: { [k: string]: string }"
      }
    ]
  },
  "entrypoints/cli.tsx:33": {
    "file": "entrypoints/cli.tsx",
    "abs": "entrypoints/cli.tsx",
    "ref": "entrypoints/cli.tsx:33",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 19,
        "end": 47,
        "focus": 33,
        "code": "// DCEs this entire block from external builds.\n// eslint-disable-next-line custom-rules/no-top-level-side-effects, custom-rules/no-process-env-top-level\nif (feature('ABLATION_BASELINE') && process.env.CLAUDE_CODE_ABLATION_BASELINE) {\n  for (const k of ['CLAUDE_CODE_SIMPLE', 'CLAUDE_CODE_DISABLE_THINKING', 'DISABLE_INTERLEAVED_THINKING', 'DISABLE_COMPACT', 'DISABLE_AUTO_COMPACT', 'CLAUDE_CODE_DISABLE_AUTO_MEMORY', 'CLAUDE_CODE_DISABLE_BACKGROUND_TASKS']) {\n    // eslint-disable-next-line custom-rules/no-top-level-side-effects, custom-rules/no-process-env-top-level\n    process.env[k] ??= '1';\n  }\n}\n\n/**\n * Bootstrap entrypoint - checks for special flags before loading the full CLI.\n * All imports are dynamic to minimize module evaluation for fast paths.\n * Fast-path for --version has zero imports beyond this file.\n */\nasync function main(): Promise<void> {\n  const args = process.argv.slice(2);\n\n  // Fast-path for --version/-v: zero module loading needed\n  if (args.length === 1 && (args[0] === '--version' || args[0] === '-v' || args[0] === '-V')) {\n    // MACRO.VERSION is inlined at build time\n    // biome-ignore lint/suspicious/noConsole:: intentional console output\n    console.log(`${MACRO.VERSION} (Claude Code)`);\n    return;\n  }\n\n  // For all other paths, load the startup profiler\n  const {\n    profileCheckpoint\n  } = await import('../utils/startupProfiler.js');"
      }
    ]
  },
  "toolOrchestration.ts:91-116": {
    "file": "services/tools/toolOrchestration.ts",
    "abs": "services/tools/toolOrchestration.ts",
    "ref": "toolOrchestration.ts:91-116",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 91,
        "end": 116,
        "focus": 91,
        "code": "function partitionToolCalls(\n  toolUseMessages: ToolUseBlock[],\n  toolUseContext: ToolUseContext,\n): Batch[] {\n  return toolUseMessages.reduce((acc: Batch[], toolUse) => {\n    const tool = findToolByName(toolUseContext.options.tools, toolUse.name)\n    const parsedInput = tool?.inputSchema.safeParse(toolUse.input)\n    const isConcurrencySafe = parsedInput?.success\n      ? (() => {\n          try {\n            return Boolean(tool?.isConcurrencySafe(parsedInput.data))\n          } catch {\n            // If isConcurrencySafe throws (e.g., due to shell-quote parse failure),\n            // treat as not concurrency-safe to be conservative\n            return false\n          }\n        })()\n      : false\n    if (isConcurrencySafe && acc[acc.length - 1]?.isConcurrencySafe) {\n      acc[acc.length - 1]!.blocks.push(toolUse)\n    } else {\n      acc.push({ isConcurrencySafe, blocks: [toolUse] })\n    }\n    return acc\n  }, [])\n}"
      }
    ]
  },
  "context.ts:155": {
    "file": "context.ts",
    "abs": "context.ts",
    "ref": "context.ts:155",
    "mode": "excerpt",
    "excerpts": [
      {
        "start": 141,
        "end": 169,
        "focus": 155,
        "code": "    return {\n      ...(gitStatus && { gitStatus }),\n      ...(feature('BREAK_CACHE_COMMAND') && injection\n        ? {\n            cacheBreaker: `[CACHE_BREAKER: ${injection}]`,\n          }\n        : {}),\n    }\n  },\n)\n\n/**\n * This context is prepended to each conversation, and cached for the duration of the conversation.\n */\nexport const getUserContext = memoize(\n  async (): Promise<{\n    [k: string]: string\n  }> => {\n    const startTime = Date.now()\n    logForDiagnosticsNoPII('info', 'user_context_started')\n\n    // CLAUDE_CODE_DISABLE_CLAUDE_MDS: hard off, always.\n    // --bare: skip auto-discovery (cwd walk), BUT honor explicit --add-dir.\n    // --bare means \"skip what I didn't ask for\", not \"ignore what I asked for\".\n    const shouldDisableClaudeMd =\n      isEnvTruthy(process.env.CLAUDE_CODE_DISABLE_CLAUDE_MDS) ||\n      (isBareMode() && getAdditionalDirectoriesForClaudeMd().length === 0)\n    // Await the async I/O (readFile/readdir directory walk) so the event\n    // loop yields naturally at the first fs.readFile."
      }
    ]
  }
}
