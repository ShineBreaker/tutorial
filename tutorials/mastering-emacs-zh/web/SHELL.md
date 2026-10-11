# 网页外壳规格

你要写出一个 HTML 模板 `Emacs/mastering-emacs-zh/web/template.html`。构建脚本 `tools/build.py` 会把各章片段注入其中，产出最终单文件网页 `dist/mastering-emacs-zh.html`。

## 模板必须包含的占位符（逐字保留，不要改成别的）

```
{{NAV}}          目录导航项的 <li> 列表，由构建脚本生成
{{SECTIONS}}     全部章节的 HTML 片段
{{SECTION_COUNT}} 章节总数（整数）
{{TOTAL_MIN}}    全书预计精读分钟数（整数）
```

这四个字符串必须原样出现在模板里（`{{NAV}}` 与 `{{SECTIONS}}` 各自出现一次即可）。**不要在模板里手写任何章节内容**，一切内容由片段注入。

## 注入的 DOM 结构（构建脚本保证，你按此写选择器）

- 目录：`<nav>` 内会得到一组 `<li class="nav-item" data-stage="入门|基础|进阶|精通">`，内含
  `<a href="#ch-xx" data-target="ch-xx">`、`<span class="nav-stage">`、`<span class="nav-title">`、`<span class="nav-lead">`、`<span class="nav-meta">`（形如 `25 分钟`）。
- 正文：`<main>` 内会得到若干 `<section class="ch" id="ch-xx" data-stage="…" data-min="…">`，每节以
  `<h2 class="ch-title">` 和 `<p class="ch-lead">` 开头。
- 节内：`div.keys > table`（按键速查表）、`div.drill`（练习，内含 `p.drill-q`、`button.drill-btn`、`div.drill-a`、`data-answer`）、`details.deep`、`div.callout.note|warn|tip`、`pre.el code`、`pre.term code`、`kbd`、`code`。

**你现在还不知道最终会有多少节、每节 id 是什么。** 所以所有遍历必须对空集合安全：脚本要在章节为零时也不报错，并且要在构建完成后重新扫描（`DOMContentLoaded` 时构建索引即可，构建发生在脚本运行之前）。

## 硬性要求

1. **单文件、全内联、离线可用。** 一个文件里放全部 CSS 与 JS，**零外部请求**（无 CDN、无字体文件、无图片外链）。代码高亮自己用正则做，不要引 highlight.js。字体用系统字体栈。
2. **移动端优先。** 320px 宽度下所有内容可读、按钮可点（最小点击目标 44×44 px），正文行高 ≥ 1.75，字号 ≥ 16px。长按键序列、长命令、长代码行在手机上**不能撑破布局**（用 `overflow-x:auto` + `word-break` 处理）。任何横向滚动都必须发生在局部容器内，页面本身不得出现横向滚动条。
3. **暗色 / 亮色 / 跟随系统** 三档，`prefers-color-scheme` 跟随，手动选择存 `localStorage`。两套配色都要保证正文对比度 ≥ 4.5:1。
4. **打印样式**：`@media print` 下隐藏全部交互控件，展开所有 `details`，章节不跨页断裂。

## 必须实现的交互

| 功能 | 行为 |
| --- | --- |
| 抽屉目录 | 移动端从左侧滑出（遮罩 + 焦点陷阱 + `Esc` 关闭 + 关闭后焦点归还按钮）；桌面端常驻左侧栏。目录支持按 `data-stage` 分组过滤（四档：全部/入门/基础/进阶/精通），并显示每节预计时长。 |
| 目录定位 | 滚动时高亮当前所在章节（`IntersectionObserver` 或滚动位置比较），点击目录项平滑滚动并更新 `location.hash`。 |
| 章节折叠 | 每章右上角一个折叠按钮，长文手机上可以收起整节。折叠状态存 `localStorage`。 |
| 全文搜索 | 顶栏搜索框，**即时过滤**（输入即搜，无需回车）。同时高亮正文中的命中词、并在目录中显示命中章节与次数。搜索框下方给出结果列表，点击跳转到第一个命中处并逐个循环（`Enter` 下一个 / `Shift+Enter` 上一个）。索引用 `section.textContent` 预先建立。 |
| 阅读进度 | 顶栏一条细进度条表示当前章节在全书中的位置；`localStorage` 记住「已读完的章节集合」与「上次阅读位置」，再次打开时提示「上次读到 第 N 章 · 标题，点击继续」。已读完的章节在目录里打勾。 |
| 练习自测 | `div.drill` 的「显示答案」按钮展开 `div.drill-a`；按钮文案变成「隐藏答案」；已展开状态写入 `localStorage`。另提供一个「自测模式」开关：开启后所有答案默认折叠且练习之间用「上一题/下一题」按钮串联。 |
| 按键表 | `div.keys` 整体可折叠（`<details>` 语义或自绘），移动端默认折叠。点击任意 `kbd` 复制对应按键到剪贴板并给 1 秒反馈。 |
| 代码块 | 每个 `pre` 加一个复制按钮；`pre.el` 做轻量 Elisp 着色（注释、行内字符串、函数名、关键字、数字），`pre.term` 做终端着色（首行提示符）。代码块在手机上横向可滚动并带滚动阴影提示。 |
| 字号 | `A-` / `A+` 两档调节正文基准字号（存 `localStorage`），适应长时间阅读。 |
| 键盘快捷键 | `/` 聚焦搜索、`Esc` 退出搜索/关闭抽屉、`[` `]` 上一章/下一章、`t` 切换主题、`m` 打开菜单。仅在焦点不在输入框时生效。 |
| 回到顶部 | 右下角悬浮按钮，长文阅读必备。 |
| 交叉引用 | 正文里指向 `#ch-xx` 的链接点击后平滑滚动并给目标章节一次高亮闪烁，让读者知道跳到了哪里。 |
| 无障碍 | 所有交互控件有 `aria-label`；抽屉有 `role="dialog"` 与焦点管理；键盘可完整操作；`prefers-reduced-motion` 下关闭动画。 |

## 视觉基调

- 正文体：`-apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif`；代码体用等宽栈。
- 颜色克制：一套中性色 + 一个强调色。暗色模式用真正的深色（不是反色），正文不用纯白 `#fff`（用略灰的暖白降低对比疲劳）。
- `kbd` 做成有立体感的小键帽；`.callout` 三种（note/warn/tip）用左边框色条 + 淡背景区分，不要用刺眼的高饱和色。
- 章节标题层级清晰，`h2.ch-title` 是全书最小可读单元，移动端上要一眼可辨。
- 尊重 `prefers-color-scheme` 与 `prefers-reduced-motion`。

## 交付

只写 `Emacs/mastering-emacs-zh/web/template.html` 这一个文件（CSS 与 JS 全部内联其中）。写完后自检：

- 四个占位符都在；
- 没有 `TODO`、没有外链 `http`；
- 用浏览器控制台逻辑自查：脚本在「零章节」情况下不报错。

不要创建其他文件，不要修改 `web/sections/` 下的任何内容。
