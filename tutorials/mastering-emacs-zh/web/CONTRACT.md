# HTML 片段契约

所有章节文件写入 `Emacs/mastering-emacs-zh/web/sections/`，每个文件是一个**独立的 HTML 片段**（不含 `<html>/<head>/<body>`），由 `tools/build.py` 拼接成最终单文件网页。

**严格只使用下面列出的类名与结构。** 拼接器与前端脚本依赖这些类名做目录、搜索、进度、练习判分等交互；自造类名不会被索引到。

## 整体骨架

```html
<section class="ch" id="ch-03-movement-b" data-stage="进阶" data-min="25">
  <h2 class="ch-title">三、编辑理论（二）：杀死与粘贴</h2>
  <p class="ch-lead">一句话说清这一节解决什么问题、读完能做什么。</p>
  ...
</section>
```

- `id`：必须唯一，形如 `ch-NN-slug`。
- `data-stage`：所属学习阶段，取值只用 `入门` / `基础` / `进阶` / `精通`，用于顶部阶段筛选与进度统计。
- `data-min`：预计精读分钟数，整数。

## 正文元素

- `<h3>` 二级小节标题、`<h4>` 三级标题。不要再深。
- `<p>` 段落、`<ul>/<ol>/<li>` 列表、`<strong>/<em>/<code>` 行内标记。
- 快捷键一律写成 `<kbd>`，按键序列写成 `<kbd>C</kbd><kbd>x</kbd> <kbd>C</kbd><kbd>f</kbd>`（中间空格表示先后），修饰键用 `C-` `M-` `S-` `C-M-`。
- Elisp 代码用：`<pre class="el"><code>...</code></pre>`，其中 `<`、`>`、`&` 必须转义为 `&lt;` `&gt;` `&amp;`。
- 终端/按键回显用：`<pre class="term"><code>...</code></pre>`。

## 提示框

```html
<div class="callout note"><b>要点</b><p>…</p></div>
<div class="callout warn"><b>易错</b><p>…</p></div>
<div class="callout tip"><b>技巧</b><p>…</p></div>
```

只用这三种，`<b>` 里写类别名（要点 / 易错 / 技巧）。

## 按键速查表

```html
<div class="keys">
  <h4>本节按键</h4>
  <table>
    <thead><tr><th>按键</th><th>命令</th><th>作用</th></tr></thead>
    <tbody>
      <tr><td><kbd>C</kbd><kbd>x</kbd> <kbd>C</kbd><kbd>f</kbd></td><td><code>find-file</code></td><td>打开文件</td></tr>
    </tbody>
  </table>
</div>
```

每节至少一张。表头固定三列。

## 折叠的进阶内容

```html
<details class="deep"><summary>进阶：为什么窗口在 Emacs 里是瞬态的</summary><p>…</p></details>
```

## 练习（可点开看答案）

```html
<div class="drill" data-answer="M-x query-replace">
  <p class="drill-q"><b>练习 1</b>　把光标所在单词全部替换为 <code>foo</code>，用哪个命令？</p>
  <button class="drill-btn" type="button">显示答案</button>
  <div class="drill-a"><p><code>M-x query-replace</code>，再 <kbd>M</kbd><kbd>%</kbd> 替换全部匹配。</p></div>
</div>
```

- `data-answer` 放标准答案的纯文本，用于自测判分。
- `drill-btn` 文本统一用「显示答案」。
- 每节至少 2 个 `<div class="drill">`，全篇不少于 40 个。

## 硬性要求

- 片段里**不要**出现 `<script>`、`<style>`、`style=` 属性、`<html>`、`<head>`、`<body>`、外部链接脚本。
- 不要写 `TODO`、`待补充`、`待定`、`???` 之类的占位符；写不出来就略过该条，不要留空壳。
- 中文正文与英文命令名之间留一个空格。
- 不要用 ASCII 字符画图。流程/结构关系用 `<ol>`/`<ul>` 或表格表达。
- 每节开头用 `ch-lead` 明确「读这节你会得到什么」。
- 面向**零基础到熟练使用者**：每个术语首次出现时用 `<strong>术语</strong>（一句话解释）` 的形式就地解释。
