# Agent 变笨时，先清理工作区里的持久配置

- 作者：Vox（[@Voxyz_ai](https://x.com/Voxyz_ai)）
- 整理来源：X 收藏
- 原帖：[https://x.com/Voxyz_ai/status/2086150296842219888](https://x.com/Voxyz_ai/status/2086150296842219888)
- 发布：2026-08-08 14:59（America/Fortaleza）
- 类型：实践方法（长帖）

---
𝗖𝗼𝗱𝗲𝘅 can feel worse over time. I check the workspace before blaming the model.

I don't wipe everything. I keep the skills, MCPs, and AGENTS.md rules this project uses, then 𝗿𝗲𝗺𝗼𝘃𝗲 𝗺𝗼𝘀𝘁 𝗼𝗳 𝘁𝗵𝗲 𝗿𝗲𝘀𝘁.

My prompts name the outcome, boundaries, and checks. Codex picks its own steps.

Give this to any coding agent:

𝗽𝗿𝗼𝗺𝗽𝘁:

Audit every persistent configuration in this workspace that shapes how you work: project instructions, skills, MCPs, and memory.

Find anything redundant, outdated, conflicting, or irrelevant to this project. First give me a KEEP / REMOVE list with one sentence per item. Do not edit any files.

Wait for my approval. Remove only approved REMOVE items. Keep every safety rule, secret-handling rule, and configuration this project explicitly requires.

After cleanup, reread my current task. Focus on three things: the final outcome, the boundaries you must not cross, and the checks that prove the work is done.

Choose the implementation yourself. When finished, show the diff and run the project's existing checks. If anything is unclear, ask. Don't guess.

𝘀𝗮𝘃𝗲 𝘁𝗵𝗶𝘀. Use it when Codex, Claude Code, or Cursor suddenly starts feeling dumber.
