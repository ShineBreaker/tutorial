# Master Emacs in 21 Days · 互动教学网站

把原 Emacs-China 的「Master Emacs in 21 Days」Markdown 教程重新制作成一份**面向初学者**的可互动教学网站。

> 基于 zilongshanren 的教程改编 —— 教程原文版权归原作者所有。

## ✨ 特性

- **21 天结构化内容**：每章有「本日目标」「动手时间」「外部资料」「小贴士」卡片
- **7 个互动组件**：
  - **键盘可视化器**（Day 1）—— 点击键查看改键后的新身份
  - **光标移动演示器**（Day 1）—— 模拟 Emacs 6 个核心移动命令
  - **Elisp 在线 REPL**（Day 3）—— 自实现的极简求值器，支持 `defun` / `defmacro` / `let` / `quote` / `lambda` 等
  - **Macro 展开动画**（Day 8）—— 直观展示宏展开前后的对照
  - **Org TODO 状态机**（Day 10）—— 模拟 `C-c C-t` 切换 TODO 状态
  - **Evil 模式切换器**（Day 13）—— Normal / Insert / Visual / Emacs / Replace 状态机
  - **Org Roam 知识图谱**（Day 19）—— Canvas 绘制的节点图，点击列表节点高亮图中的连接
- **70+ 条术语名词解释**：首次出现的专有名词自动加下划线，hover 弹出解释
- **进度跟踪**：每章可标记「已完成」，进度写入 `localStorage`
- **暗 / 亮主题**：跟随系统或手动切换
- **章节搜索**：`Ctrl+K` 全局搜索
- **响应式**：桌面 / 平板 / 手机三档布局

## 🚀 本地预览

```bash
cd master-emacs-in-21-days
python3 -m http.server 8765
# 浏览器打开 http://127.0.0.1:8765/
```

> 注意：必须通过 HTTP 服务访问，不能直接 `file://` 打开 —— 否则 ES module / 部分 API 会受限。

## ⌨️ 快捷键

| 快捷键 | 作用 |
| --- | --- |
| `Ctrl + K` | 聚焦搜索框 |
| `G` | 打开 / 关闭术语表面板 |
| `T` | 切换暗 / 亮主题 |
| `Esc` | 关闭弹层 |
| 顶栏按钮 | 主题、术语表、搜索 |

## 📁 项目结构

```
master-emacs-in-21-days/
├── index.html              # 页面骨架
├── styles.css              # 主题变量 + 所有组件样式
├── js/
│   ├── storage.js          # 进度 / 主题持久化
│   ├── components.js       # 7 个互动组件 + 极简 Elisp 求值器
│   └── app.js              # 主入口（渲染 / 搜索 / 快捷键）
├── data/
│   ├── glossary.js         # 70+ 条 Emacs/Elisp 术语
│   └── content.js          # 21 天全部内容（结构化数据）
└── README.md
```

## 🧩 给二次开发者

新增章节：在 `data/content.js` 末尾的 `window.DAYS` 数组里追加一个对象；可用 section 类型有：
`intro / p / h2 / h3 / tip / warn / good / info / card / code / steps / fold / link-grid / component`。

新增互动组件：在 `js/components.js` 的 `Components.map` 注册 `html + bind` 一对函数。

新增术语：在 `data/glossary.js` 的 `window.Glossary` 里加一条；在正文里用
`<span class="g-term" data-term="key">原文</span>` 即可自动获得 tooltip。

## 📜 致谢

- 教程原作者：<https://github.com/zilongshanren>
- Emacs China 社区：<https://emacs-china.org>

---

Happy hacking! λ