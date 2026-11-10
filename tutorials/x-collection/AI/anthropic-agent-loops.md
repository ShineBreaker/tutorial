# 我们内部已经不怎么写 prompt 了，写的是循环

- 作者：Hux（[@huxlab](https://x.com/huxlab)）
- 整理来源：X 收藏
- 原帖：[https://x.com/huxlab/status/2106027067527901393](https://x.com/huxlab/status/2106027067527901393)
- 发布：2026-10-02 11:22（America/Fortaleza）
- 类型：讲座笔记（长帖）

---
Anthropic 的工程师说：我们内部已经不怎么写 prompt 了，写的是循环。

她在台上花了半小时，展示了 Claude 团队如何创建能够自我提示的循环。

如果这堂课卖 400 刀，今年 Agent 课的榜单大概就是它。但它是免费的。

真正拉开代际差距的，不是谁的 Prompt 写得好，而是Agent系统架构彻底换了：

1. 记忆从一份 CLAUDE.md，进化成 Agent 自己读写的 memory/ 目录

2. 记忆待在对话里会烂掉：注意力被劈开，规律被埋住，旧笔记还在自信地用错

3. 白天各 Agent 把进展写进团队记忆

4. 夜里再跑一轮 dreaming：核对、整理、补全。第二天开工的那个，自动比昨天聪明一点

数据结果也很直观：一次通过的错误少了 97%，验收快了 30%。人回去看产品，不再一直盯着提示词。

提示词是一次性的，而循环能够持续执行。

差的不是你会不会问。

是你的 Agent 睡一觉之后，还记不记得昨天学到的东西。 https://t.co/9oMymowy0F

## 原视频帖

作者 Dhruv（[@Dhruvkumar16797](https://x.com/Dhruvkumar16797)）原帖：
https://x.com/Dhruvkumar16797/status/2105343744342216900

原帖英文介绍大意：Anthropic 工程师表示他们内部已经不再只写 prompt，而是构建会自我提示的循环；这条帖附有约 42 分钟的讲解视频。
