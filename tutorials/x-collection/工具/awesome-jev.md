# Awesome Jev：一套可落地的项目清单

- 作者：思维怪怪（[@0xLogicrw](https://x.com/0xLogicrw)）
- 整理来源：X 收藏，同时出现在点赞中
- 原帖：[https://x.com/0xLogicrw/status/2100478725393686556](https://x.com/0xLogicrw/status/2100478725393686556)
- 发布：2026-09-17 03:55（America/Fortaleza）
- 类型：资源清单（长帖）

---
Jev 这个 waitlist 还是很给力的，昨天申请，今天就能用上。

给已经拿到 API、但还不知道怎么玩的人整理了一份 Awesome Jev，目前我能确认到的 Jev 项目基本都在这里：

1. jev-ultrafast
Browser Use 做的高速浏览器 Agent。Jev 负责每一步判断「做什么、点哪个元素」，需要输入文字时才调用小模型。Google Flights 搜航班完整跑完约 7.1 秒。
https://t.co/nqCVyAufKj

2. typesafe-mcp
把 Jev 直接接进 Claude Code、Claude Desktop 和 Codex。Agent 可以随时调用 Jev 做 Choice / Score / Noul 这类结构化判断。
https://t.co/yoZMJOVVvO

3. jev-mcp
另一个更偏实用工具的 MCP，已经封装好事实核验、Prompt Injection 检测和语义排序。
https://t.co/f9Udew7tmI

4. SemDecide
把 Jev 做成 Unix 命令行工具，可以直接拿来做语义判断、分类、打分、过滤和 Guard。很适合塞进脚本、CI 和数据流水线。
https://t.co/yE4cx3qumZ

5. Jev Codex Router
先让 Jev 判断每一轮编程任务有多难，再自动决定交给便宜模型还是更强模型。作者用 237 个真实 turn 回放，自测成本降低约 60%。
https://t.co/gO4MxjJE1Y

6. Winnow
给 Claude Code 做「上下文垃圾回收」。Read、Bash、Grep 输出太长时，先让 Jev 判断哪些内容真的跟当前任务有关，再决定哪些需要进上下文。
https://t.co/hRKYTNaEYG

7. Jev Review
用 Jev 做代码审查前置筛选，先判断 correctness、security、reliability、兼容性和测试风险，再把重点问题交给更重的模型处理。
https://t.co/nD0aVcx4cS

8. Blink
用 Jev 在代码库里做语义寻路。每到一层目录，就判断哪些文件或文件夹最可能和问题有关，再把更多 walker 分配过去。
https://t.co/FqF5XO23d7

9. neo4jev
把同样的思路用到知识图谱。Jev 给每条候选边打概率，再用 beam search 一步步找到最可能的路径。
https://t.co/2iVJd983QA

10. jev-desktop
把 Jev 接到桌面自动化里。它读取 Accessibility Tree，判断该操作哪个控件、执行什么动作，再交给本地执行器。
https://t.co/mLGTp4BwXz

11. TypeSafe AI Playground
一个专门拿 Jev 做实验的 Rust CLI，已经做了 PHI 检测、代码注释审查、实时语气分析、职业和行业分类等玩法。
https://t.co/ELLsEZAGMR

12. Prism
目前我看到最接近量化/交易场景的项目。它让 Jev 判断流动性池的 toxic flow、市场压力、均值回归可能性和流动性分布方式，目前默认还是 shadow/advisory，不直接驱动交易。
https://t.co/WqFdwpZilz

13. 1v1 Jev
直接做了一个 FPS，让 Jev 大约 9Hz 判断移动、瞄准、ADS、开枪和跳跃。属于最直观展示 Jev 低延迟决策能力的项目之一。
https://t.co/RpBCFScEey

14. TypeSafe on Neon
拿 Jev 做模型 Router。请求先由 Jev 判断属于哪种任务，再转给 Grok 4.6 或 GPT-6 Astra 等模型执行。
https://t.co/ArCsOwexTM

看完这些项目，你大概也知道 Jev 可以怎么玩了，就是拿它反复做「要不要、选哪个、打几分、下一步干什么」。

真正需要生成代码、写文章和复杂推理时，再把任务交给传统大模型。
