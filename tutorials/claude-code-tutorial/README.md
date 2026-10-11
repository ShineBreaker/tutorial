# Agent 解剖学 · 跟着 claude-code 源码学 Agent / TypeScript / JavaScript

一个零依赖、可离线运行的交互式教学网站。以 `~/Projects/Agent/claude-code` 的真实源码为解剖对象，从最小的 agent 循环讲到完整的工程实现，顺带覆盖 10 个 TS/JS 核心特性。

## 打开方式

```bash
cd ~/Projects/Agent/claude-code-tutorial
python3 -m http.server 8080
# 浏览器访问 http://127.0.0.1:8080
```

> 必须走 http。直接双击 index.html（file:// 协议）会被浏览器的 ES Modules 安全策略拦截，页面顶部会给出提示。

## 课程结构（由浅入深）

| 章 | 主题 | 关键源码 |
|---|---|---|
| 0 | 什么是 Agent：四要素心智模型 | 仓库导览 |
| 1 | 心跳：Agent 循环（含可单步模拟器） | `query.ts:307/834/1062/1380` |
| 2 | 消息与内容块：tool_use / tool_result 协议 | `processTextPrompt.ts` |
| 3 | 工具：带说明书的手（Tool 接口、zod、注册表） | `Tool.ts`、`tools.ts` |
| 4 | 一次工具调用的旅程：六道关卡与并发调度 | `toolExecution.ts`、`toolOrchestration.ts` |
| 5 | 缰绳：权限与安全（allow/deny/ask、fail-closed） | `filesystem.ts`、`BashTool.tsx` |
| 6 | 记忆：上下文管理（prompt cache、CLAUDE.md、瘦身） | `prompts.ts`、`context.ts`、`query.ts:396` |
| 7 | 一条消息的一生：启动→输入→循环→计费→落盘 | `cli.tsx`、`REPL.tsx`、`claude.ts` |
| 8 | 语言专题：TS/JS 十大特性复习 + 练习 | 前七章片段 |
| 9 | 动手：读懂并改造本站模拟器的迷你 agent | `js/sim/agent-sim.js` |

## 技术说明

- **零依赖、无构建**：原生 ES Modules + 手写 CSS + 手写代码高亮器（`js/highlight.js`，本身就是教学素材）。
- **模拟器是真的**：`js/sim/agent-sim.js` 实现了一个完整的最小 agent 循环（mockLLM + 3 个工具），支持单步/自动播放/重置，第 9 章逐段讲解它的源码。
- **代码片段皆真实**：所有标注 `路径:行号` 的片段摘自 claude-code 源码并核对过行号（部分标注「有删节」「教学版」的做了裁剪或简化，均有注明）。
- **「查看真实源码 ↗」悬浮窗**：代码卡片上的这个按钮会弹出悬浮窗，展示对应位置的真实源码：带行号槽（横向滚动时钉在左侧），被引用的行以琥珀色高亮；顶部可一键复制绝对路径，或复制 `emacsclient -n +行号 路径` 命令（Emacs server 在运行时粘到终端即可跳转）。没有行号的引用（如「这个模式散落在这些文件里」）退化为文件声明骨架。数据在 `js/real-sources.js`，由 `tools/gen-real-sources.py` 生成。
- **学习进度**存在浏览器 localStorage，侧栏可一键重置。
- **布局自适应**：主内容列占满侧栏以外的宽度，代码块/表格/模拟器随窗口舒展；只有正文文字限制在 92ch 行宽以内保证阅读舒适。

## 自定义

- 调主题：改 `css/style.css` 顶部 `:root` 变量。
- 加章节：新建 `js/chapters/chXX-*.js` 导出章节数据，在 `js/chapters/index.js` 里 import 并加入数组即可，导航自动生成。
- 改完引用行号后重新生成真实源码数据：`python3 tools/gen-real-sources.py [源码根目录] [教程目录]`（默认参数即当前路径）。
