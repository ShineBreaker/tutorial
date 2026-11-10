# 斯坦福讲座：ChatGPT 和 Claude 到底怎么被做出来

- 作者：Hux（[@huxlab](https://x.com/huxlab)）
- 整理来源：X 收藏，同时出现在点赞中
- 原帖：[https://x.com/huxlab/status/2118519047457546367](https://x.com/huxlab/status/2118519047457546367)
- 发布：2026-11-05 22:41（America/Fortaleza）
- 类型：讲座推荐（长帖）

> 原帖未给出可唯一确定的课程链接。文末只补充了一条主题接近、但时长不符的官方讲座，避免误指。

---
今晚别刷Netflix了。

去看这个斯坦福2小时34分钟的讲座。

这是我见过最清晰、端到端讲透ChatGPT和Claude到底怎么建出来的课。

从Tokenization和BPE开始，一路到Transformer架构、训练管线、Next-token解码。

不管你是从没写过一行AI代码，还是天天在ship Agent，看完都会把很多“原来如此”的点一次打通。

真正核心就这几层：

1. 文本怎么变成模型能吃的数字（BPE tokenization）
2. 语言模型本质就是在预测下一个token
3. Transformer怎么用Attention做消息传递
4. 训练时用NLL loss把整条序列概率拉高
5.  生成时怎么一步步解码出来

大多数人花好几年才拼出的全景图，这节课直接给你画完。

把时间空出来，这可能是你这个月最值的一堂课。

## 关于讲座链接

原帖只附了视频，没有写出可核对的课程编号或 YouTube 链接，因此不能把某一条视频指定为「就是这一讲」。

网上常被一起转发、主题接近的斯坦福官方讲座是 CS229《Building Large Language Models》（Yann Dubois，Stanford Online）：
https://www.youtube.com/watch?v=9vM4p9NN0Ts

这条官方录像时长约 1 小时 44 分，与帖中所说的「2 小时 34 分钟」并不一致，所以不能断定是同一条视频。观看时请以原帖附件为准：
https://x.com/huxlab/status/2118519047457546367
