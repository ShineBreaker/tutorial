/* ============================================================
 * 术语表 —— Emacs/Elisp 中常见名词解释
 * 用法：在正文中写 <span data-term="key">原词</span> 自动渲染为可悬浮的 tooltip
 *       也可通过 glossary('key') 程序触发
 * ============================================================ */
window.Glossary = {
  /* ---------- 编辑器基础 ---------- */
  "emacs": {
    name: "Emacs",
    body: "一个可扩展、可定制的文本编辑器。所谓「编辑器」，就是专门用来写文字、改代码的软件。Emacs 的核心哲学是：编辑器本身也是一段程序，你可以用 Emacs Lisp（一种 Lisp 方言）修改它的任何行为。名字是 Editor MACroS（编辑宏）的缩写。"
  },
  "buffer": {
    name: "Buffer（缓冲区）",
    body: "你正在编辑的内容的内存表示。每打开一个文件，Emacs 就把它读进一个 buffer；scratch 缓冲区则是临时草稿。buffer 不等于文件 —— 编辑中它只存在内存里，<code>C-x C-s</code> 才会写回磁盘。"
  },
  "window": {
    name: "Window（窗口）",
    body: "Emacs 中「窗口」指的是屏幕上的一个编辑视窗（frame 里被切出来的格子），不是操作系统窗口。一个 frame（顶层窗口）可以切成多个 window。容易和 OS 窗口混淆，所以记住 Emacs 自己的术语就行。"
  },
  "frame": {
    name: "Frame",
    body: "Emacs 里的「顶层窗口」。你启动 Emacs 看到的那个 OS 窗口就是一个 frame。一个 frame 可以包含多个 window。"
  },
  "point": {
    name: "Point（光标位置）",
    body: "Emacs 中光标的位置称为 point。听起来和「光标」一样，但在 Lisp 里 point 是一个整数（从 1 开始计数），表示 buffer 中字符的索引。移动光标的命令实际上是在改变 point 的值。"
  },
  "mode-line": {
    name: "Mode Line（模式行）",
    body: "Emacs 窗口底部的状态栏，显示当前 buffer 名、当前 mode、光标位置、文件编码等信息。Spacemacs/Doom 把它美化得五彩斑斓。"
  },
  "minibuffer": {
    name: "Minibuffer（迷你缓冲区）",
    body: "Emacs 底部的一行小输入框。执行 <code>M-x</code> 命令、查找文件、回答 y/n 时都会用到它。可以理解为 Emacs 的「命令面板」。"
  },
  "echo-area": {
    name: "Echo Area（回显区）",
    body: "和 minibuffer 共用屏幕底部那一行。当 Emacs 提示「Mark set」「Saved」之类的简短消息时，就是显示在 echo area。"
  },

  /* ---------- 模式（mode） ---------- */
  "major-mode": {
    name: "Major Mode（主模式）",
    body: "决定 buffer 的「核心编辑规则」—— 语法高亮、缩进、专属快捷键等。每个 buffer 同时只能有一个 major mode，例如 emacs-lisp-mode、python-mode、org-mode。"
  },
  "minor-mode": {
    name: "Minor Mode（辅助模式）",
    body: "在 major mode 之上叠加的额外功能。一个 buffer 可以同时激活多个 minor mode，例如显示行号的 linum-mode、自动补全的 company-mode。它们通常可以独立开关。"
  },
  "global-mode": {
    name: "Global Mode（全局模式）",
    body: "某些 minor mode 是「全局」的，开/关之后对所有 buffer 都生效（例如 global-linum-mode、global-company-mode），区别于只在当前 buffer 生效的 local minor mode。"
  },

  /* ---------- 键位 ---------- */
  "meta-key": {
    name: "Meta 键 (M)",
    body: "Emacs 文档里 <code>M-x</code> 中的 <code>M</code> 代表 Meta 键。传统键盘上是 Alt 或 Esc。在 Mac 上推荐改成 Option，Windows 上推荐用 SharpKeys 把 Win 键改成 Alt。"
  },
  "control-key": {
    name: "Control 键 (C)",
    body: "<code>C-x</code> 中的 <code>C</code> 代表 Ctrl 键。Emacs 命令中两个 C- 组合（如 <code>C-x C-s</code>）表示「按住 Ctrl 不放、依次按 x 和 s」。"
  },
  "super-key": {
    name: "Super 键 (s)",
    body: "<code>s-a</code> 中的 <code>s</code> 代表 Super 键。在 Mac 上对应 ⌘ Command，在 Windows 上对应被改成 Super 的 App 键或 Left Alt。"
  },

  /* ---------- Emacs Lisp ---------- */
  "elisp": {
    name: "Emacs Lisp (Elisp)",
    body: "Emacs 自身的扩展语言，是 Lisp 的一种方言。Emacs 几乎所有功能（包括窗口、buffer、光标、快捷键）都是 Elisp 函数 —— 学会它，你就掌握了改造 Emacs 的钥匙。"
  },
  "lisp": {
    name: "Lisp",
    body: "一种历史悠久的编程语言家族，特点是「括号多」「一切皆列表」「代码即数据」。Elisp、Common Lisp、Scheme、Clojure 都是它的方言。括号多不是缺点，是 Lisp 的力量来源。"
  },
  "s-expression": {
    name: "S-expression（S 表达式）",
    body: "Lisp 中最基本的语法单元：括号包起来的一组元素，元素之间用空格分隔。例如 <code>(+ 1 2)</code>、<code>(defun foo () 1)</code>。Lisp 程序就是一棵 S 表达式嵌套的树。"
  },
  "function": {
    name: "Function（函数）",
    body: "Elisp 中所有「动作」都是函数。用 <code>(defun name (args) body)</code> 定义；用 <code>(funcall #'name args)</code> 或 <code>(name args)</code> 调用。"
  },
  "lambda": {
    name: "Lambda",
    body: "匿名函数 —— 没有名字的函数。写法 <code>(lambda (args) body)</code>。常用于需要临时传一个函数作为参数的场合。"
  },
  "interactive": {
    name: "interactive",
    body: "一个特殊的声明 <code>(interactive)</code>。当一个函数声明自己是 interactive 时，就可以用 <code>M-x</code> 调用或者绑定到快捷键。没有这行代码的函数只能从其它 Elisp 代码中调用。"
  },
  "variable": {
    name: "Variable（变量）",
    body: "存放值的容器。用 <code>(setq name value)</code> 设置；用 <code>name</code> 读取。Elisp 变量有两种绑定方式（lexical 和 dynamic），参见 lexical-binding 条目。"
  },
  "setq": {
    name: "setq",
    body: "「set quoted」—— 给变量赋值。<code>(setq x 5)</code> 把变量 x 的值设为 5。它的「q」表示参数不被求值（除非再加一层引号 / 用 setq-default）。"
  },
  "setq-default": {
    name: "setq-default",
    body: "设置变量的「默认值」。与 setq 的区别：setq 只影响当前 buffer，setq-default 影响所有未在 buffer 局部覆盖的 buffer。"
  },
  "quote": {
    name: "quote / '",
    body: "「引用」—— 阻止表达式被求值。Elisp 中 <code>'foo</code> 是 <code>(quote foo)</code> 的简写。例如 <code>'(1 2 3)</code> 是「字面意义上的列表 1 2 3」，而 <code>(list 1 2 3)</code> 是「运行时构造的列表」（结果巧合相同，但语义不同）。"
  },
  "macro": {
    name: "Macro（宏）",
    body: "一种「生成代码的代码」。用 <code>(defmacro name (args) body)</code> 定义。调用宏时，body 不是直接运行，而是产生一段新的 Elisp 代码，再被求值。宏是 Lisp 最强大的特性之一。"
  },
  "backquote": {
    name: "Backquote / `",
    body: "「反引号」—— 一种特殊的引用，可以「选择性求值」。<code>`(a ,b ,@c)</code> 表示：a 不求值、b 求值后插入、c 求值后「拼接」到外层列表。是写宏时最常用的工具。"
  },
  "lexical-binding": {
    name: "lexical-binding",
    body: "一种变量绑定规则 —— 变量的作用域由「书写位置」决定（像 JavaScript / Python），而不是由「运行时栈」决定（动态绑定）。现代 Elisp 推荐在文件开头加 <code>;; -*- lexical-binding: t -*-</code>。"
  },
  "cons": {
    name: "cons / cons cell",
    body: "Lisp 构造列表的基本单元。cons 把两个值拼成一个「对」，多个 cons 串起来就是列表。从另一个角度看：列表就是 cons cell 构成的链表。"
  },
  "car-cdr": {
    name: "car / cdr",
    body: "取 cons cell 的左/右部分。<code>(car '(a b c))</code> → a，<code>(cdr '(a b c))</code> → (b c)。名字源于历史（IBM 704 寄存器），但含义就是「取头/取尾」。"
  },

  /* ---------- 包管理 / 配置 ---------- */
  "package": {
    name: "Package（包）",
    body: "别人写好、可复用的 Emacs 扩展。通过 <code>M-x package-list-packages</code> 浏览安装。包从「源」（ELPA、MELPA 等）下载到本地磁盘，require 后即可使用。"
  },
  "melpa": {
    name: "MELPA",
    body: "最大的 Emacs 第三方包仓库 —— Milkypostman's Emacs Lisp Package Archive。3000+ 包，绝大多数社区插件都能在这里找到。需要把它加入 <code>package-archives</code> 才能使用。"
  },
  "elpa": {
    name: "ELPA",
    body: "Emacs Lisp Package Archive，Emacs 自带的官方包源。包含 GNU 官方维护的核心包。配合 MELPA 使用效果最佳。"
  },
  "use-package": {
    name: "use-package",
    body: "一个宏（也是包），用来把「加载包 + 配置包 + 绑定快捷键」集中写在一起。是当代 Emacs 配置的事实标准 —— Doom、Spacemacs 都重度依赖它。"
  },
  "init-file": {
    name: "Init 文件 (init.el)",
    body: "Emacs 启动时自动加载的配置文件，默认路径 <code>~/.emacs.d/init.el</code>。你所有的自定义、键绑定、插件配置都写在这里。"
  },
  "load-path": {
    name: "load-path",
    body: "Emacs 搜索 .el 文件的目录列表。<code>(add-to-list 'load-path \"...\")</code> 可往里加目录。手动安装插件时经常需要这一行。"
  },
  "require": {
    name: "require",
    body: "加载一个 Emacs Lisp 特性（feature）。如果某个文件顶上有 <code>(provide 'my-module)</code>，那么 <code>(require 'my-module)</code> 就会去 load-path 中找到并加载它。"
  },
  "provide": {
    name: "provide",
    body: "声明当前文件加载完成，并把它标记为一个 feature。一般写在文件末尾，例如 <code>(provide 'init-packages)</code>，让别的文件可以 <code>require</code> 它。"
  },

  /* ---------- 补全 / 搜索 ---------- */
  "company": {
    name: "Company",
    body: "Complete Anything 的递归缩写。一个流行的代码补全框架 —— 你敲几个字母，它会弹出一个候选列表。可与 LSP 后端配合实现语义级补全。"
  },
  "vertico": {
    name: "Vertico",
    body: "minibuffer 补全的现代化前端。把默认的垂直候选列表做得更漂亮、更易用，常和 Orderless、Marginalia 一起组成现代 minibuffer 三件套。"
  },
  "consult": {
    name: "Consult",
    body: "一搜即用的命令合集 —— consult-line（搜索）、consult-buffer（切 buffer）、consult-ripgrep（全文搜索）、consult-imenu（跳转函数）等。是现代 Emacs 的瑞士军刀。"
  },
  "orderless": {
    name: "Orderless",
    body: "一种补全风格：不要求按顺序匹配，候选只要「包含」你输入的所有片段即可。例如输入 <code>foo bar</code> 会匹配同时含 foo 和 bar 的项。Vertico 配合它能做到「打几个字母就搜到」。"
  },
  "marginalia": {
    name: "Marginalia",
    body: "为 minibuffer 候选加注释（annotation）的插件。比如查文件时显示文件大小、查命令时显示绑定快捷键。看起来不起眼，用了回不去。"
  },
  "embark": {
    name: "Embark",
    body: "「minibuffer 上的右键菜单」—— 在候选上按 <code>C-;</code> 弹出针对当前候选项的操作（复制、打开、导出等）。和 Consult 是黄金搭档。"
  },
  "ripgrep": {
    name: "ripgrep (rg)",
    body: "一个极快的命令行文本搜索工具。Emacs 的 consult-ripgrep / projectile-ripgrep 调用它来做项目级搜索，比内置 isearch 快几个数量级。"
  },

  /* ---------- Org ---------- */
  "org-mode": {
    name: "Org Mode",
    body: "Emacs 里的「瑞士军刀」major mode：待办清单、大纲笔记、日程管理、文学编程、写博客、画表格、导出 HTML/PDF……几乎所有需要结构化文字的场景都能用。"
  },
  "agenda": {
    name: "Agenda（议程视图）",
    body: "Org mode 的全局待办视图。通过 <code>C-c a</code> 打开，把分散在多个 .org 文件里的 TODO 汇总起来，按日期、标签、优先级过滤。GTD 实践者的最爱。"
  },
  "capture": {
    name: "Capture",
    body: "Org mode 的「快速收集」功能 —— 在任何场景按 <code>C-c c</code>，选择模板，把灵感 / 待办 / 网页片段直接插入到指定 .org 文件的指定位置。"
  },
  "babel": {
    name: "Babel",
    body: "Org mode 里的代码块功能。可以在 .org 文件里嵌入可执行的代码块（Python、Lisp、Shell……），并把结果输出到文档中。是「文学编程」的载体。"
  },
  "literate-programming": {
    name: "Literate Programming（文学编程）",
    body: "Donald Knuth 提出的编程范式：把代码和说明文字写在同一个文档里，由工具把代码「抽出」执行。Org mode 的 Babel 是它的现代实践。"
  },
  "roam": {
    name: "Org Roam",
    body: "基于 Org mode 的双链笔记（Roam Research 风格）。每个笔记是一个节点，可以互相链接，构建你的「第二大脑」。Roam UI 还能生成可视化知识图谱。"
  },

  /* ---------- Evil ---------- */
  "evil": {
    name: "Evil",
    body: "「Emacs 重度 Vim 化」插件 —— 在 Emacs 里完整模拟 Vim 的按键（h/j/k/l、模式切换、文本对象、操作符）。让既离不开 Vim 又想要 Emacs 扩展性的人两全。"
  },
  "evil-state": {
    name: "Evil State",
    body: "Evil 的核心概念：编辑器处于不同「状态」时按键含义不同。Normal（移动/操作）、Insert（输入文字）、Visual（选区）、Emacs（回退为原生 Emacs）等。"
  },

  /* ---------- LSP / 编辑器增强 ---------- */
  "lsp": {
    name: "LSP (Language Server Protocol)",
    body: "微软提出的协议，让编辑器能用同一套接口与各种语言的「智能后端」对话（跳转定义、补全、错误检查等）。Emacs 中常用 Eglot 或 LSP-mode 来实现。"
  },
  "eglot": {
    name: "Eglot",
    body: "Emacs 29 内置的 LSP 客户端。配置简单，官方支持，足够日常使用。和 LSP-mode 是两个最流行的选择。"
  },
  "magit": {
    name: "Magit",
    body: "Emacs 里的 Git 界面 —— 文字描述它是「最快的 Git 客户端」。所有 Git 操作（提交、分支、rebase、diff）都能在 Emacs 里可视化完成，被誉为「杀手级应用」。"
  },
  "treesit": {
    name: "Tree-sitter",
    body: "一种增量解析器，能把代码解析成语法树并实时高亮。Emacs 29+ 内置支持，可以让代码折叠、缩进、结构跳转更准确、更快。"
  },
  "yasnippet": {
    name: "YASnippet",
    body: "Yet Another Snippet 扩展。让你用关键字触发代码模板，例如敲 <code>for</code> + Tab 自动展开为完整 for 循环。配置和分享都很方便。"
  },
  "snippet": {
    name: "Snippet（代码片段）",
    body: "可重复使用的代码模板。用触发词（trigger）+ Tab 展开为完整代码块，可以带占位符和跳转点。"
  },
  "dired": {
    name: "Dired",
    body: "Emacs 内置的文件管理器（Directory Editor）。在 buffer 里浏览目录、复制、移动、删除文件 —— 像一个文本版「访达/资源管理器」。"
  },

  /* ---------- 操作系统 / 周边 ---------- */
  "sharpkeys": {
    name: "SharpKeys",
    body: "Windows 上一个把键盘按键重新映射的小工具。在 Emacs 配置中常被用来：把 Left Win 改成 Left Alt（做 Meta）、把 Caps Lock 改成 Ctrl。"
  },
  "msys2": {
    name: "MSYS2",
    body: "Windows 上模拟 Unix 环境的工具集合 —— 自带 Bash、pacman 包管理器、GNU 工具链。Emacs 在 Windows 上需要它来获得 shell / make / gcc 等工具。"
  },
  "wsl": {
    name: "WSL",
    body: "Windows Subsystem for Linux，让你在 Windows 里直接运行 Linux。Emacs + WSL 可以获得接近 Linux 的体验，绕过 Windows 上的一些性能问题。"
  },
  "hugo": {
    name: "Hugo",
    body: "最快的静态网站生成器之一，用 Go 写。配合 ox-hugo 可以让你在 Org mode 里写博客并自动发布。"
  },
  "chocolatey": {
    name: "Chocolatey (choco)",
    body: "Windows 上的包管理器，类似 macOS 的 Homebrew 或 Linux 的 apt。用 <code>choco install hugo</code> 一行命令就能装软件。"
  },

  /* ---------- 编辑概念 ---------- */
  "kill-ring": {
    name: "Kill Ring（剪切环）",
    body: "Emacs 的「剪贴板」实际上是一个环（循环列表）。每次剪切（kill）文本时，被剪切的内容就 push 到环里。<code>C-y</code>（yank）弹出最近一条，<code>M-y</code> 循环浏览更早的。"
  },
  "yank": {
    name: "Yank",
    body: "Emacs 的「粘贴」。从 kill ring 中取出一条文本插入到当前位置。区别于大多数编辑器的「粘贴」概念 —— Emacs 的 kill ring 历史更长、更可循环。"
  },
  "region": {
    name: "Region（区域）",
    body: "Emacs 中「被选中的文本范围」。设起点用 <code>C-SPC</code>（set mark），移动 point 即扩展区域。后续命令（kill、indent、查询替换）作用于 region。"
  },
  "mark": {
    name: "Mark（标记）",
    body: "Region 的「起点」。用 <code>C-SPC C-SPC</code> 设一个 mark，移动 point 就形成 region；返回 mark 用 <code>C-u C-SPC</code>。"
  },
  "narrow": {
    name: "Narrow / Widen",
    body: "把 buffer「假装」成只剩当前 region 的内容（narrow-to-region），编辑完毕用 widen 还原。聚焦在大文件的一段上时很有用。"
  },
  "abbrev": {
    name: "Abbrev（缩写）",
    body: "自动展开的缩写。定义 <code>(define-abbrev-table ...)</code> 后，输入「asap」按空格自动变成「as soon as possible」。比 snippet 轻量。"
  },

  /* ---------- 高级 / 配置技巧 ---------- */
  "key-binding": {
    name: "Key Binding（键绑定）",
    body: "把一段按键映射到一个命令。<code>(global-set-key (kbd \"C-x y\") 'save-buffer)</code> 把 <code>C-x y</code> 绑定到保存命令。"
  },
  "kbd": {
    name: "kbd（Elisp 函数）",
    body: "把人类可读的按键字符串（如 <code>\"C-x C-s\"</code>、<code>\"&lt;f5&gt;\"</code>）转成 Emacs 内部表示。是 key binding 时最常用的辅助函数。"
  },
  "hook": {
    name: "Hook（钩子）",
    body: "在某事件发生时触发的函数列表。<code>(add-hook 'after-init-hook #'my-setup)</code> 表示「启动后调用 my-setup」。每个 major/minor mode 通常都有对应的 hook。"
  },
  "advice": {
    name: "Advice（建议）",
    body: "在不修改原函数的情况下，「包装」它的行为。<code>(advice-add 'foo :before #'my-fn)</code> 表示每次调用 foo 之前先运行 my-fn。强大但慎用，容易把代码搞糊涂。"
  },
  "defcustom": {
    name: "defcustom",
    body: "「可定制的变量」。用 <code>M-x customize</code> 可以可视化编辑它，与 setq 的区别在于：defcustom 自带类型校验、文档、安全写入配置文件。"
  },
  "minor-mode-helper": {
    name: "define-minor-mode",
    body: "定义一个 minor mode 的宏。一行代码就生成一个可开关的 minor mode，包括命令、hook、init。"
  },

  /* ---------- 调试 ---------- */
  "gud": {
    name: "GUD (Grand Unified Debugger)",
    body: "Emacs 内置的调试器前端。可以驱动 gdb、pdb 等多种调试器，在 Emacs 里设断点、查看变量、单步执行。"
  },
  "flycheck": {
    name: "Flycheck",
    body: "实时语法检查框架。在你敲代码时就标红错处，比 IDE 的体验还要顺滑。"
  },
  "ispell": {
    name: "ispell / flyspell",
    body: "Emacs 的拼写检查工具。flyspell 是它的 minor mode 化版本，可在打字时实时标出拼错的词。"
  },

  /* ---------- 其他 ---------- */
  "auto-save": {
    name: "auto-save",
    body: "Emacs 的临时自动保存 —— 每隔 N 秒在 <code>#file#</code> 中留一份备份。意外退出后可用来恢复。与「备份文件 <code>file~</code>」是两套独立机制。"
  },
  "backup-file": {
    name: "Backup File（备份文件）",
    body: "Emacs 在保存文件时保留的旧版本，默认以 <code>~</code> 结尾（如 <code>init.el~</code>）。可以关掉（<code>(setq make-backup-files nil)</code>）或重定向到指定目录。"
  },
  "tab-bar": {
    name: "Tab Bar",
    body: "Emacs 27+ 内置的多标签页界面。每个 tab 是一个「窗口配置」（window configuration + buffer list），可独立命名、切换。"
  },
  "winner-mode": {
    name: "Winner Mode",
    body: "Emacs 内置 minor mode。记录窗口布局变更历史，<code>C-c left/right</code> 可以撤销/重做窗口布局调整。"
  },
  "doom-modeline": {
    name: "doom-modeline",
    body: "一个非常漂亮的 mode-line 美化包，比 Emacs 默认状态栏更紧凑、更有信息密度、更好看。"
  },
  "popper": {
    name: "Popper",
    body: "一种「弹窗式 buffer 管理」。把 Messages、Help 等临时 buffer 当作弹窗，按 <code>s-\\`</code> 切换最近一次弹窗，避免它们把屏幕搞乱。"
  },
  "quelpa": {
    name: "Quelpa",
    body: "可以安装 MELPA 上没有的包 —— 直接从 GitHub 仓库构建。比 straight.el 轻量，适合偶尔装一两个不在 MELPA 的插件。"
  },
  "winum": {
    name: "Window Numbering",
    body: "给每个窗口编个号，配合快捷键 <code>M-1</code> <code>M-2</code> 快速跳到指定窗口。多窗口编辑必备。"
  },
  "undo-tree": {
    name: "undo-tree",
    body: "把撤销历史可视化成一棵树（<code>C-x u</code>），可以跳到任意分支。再也不怕「撤销过头不知道回到哪」。"
  },
  "which-key": {
    name: "which-key",
    body: "当你按下前缀键（如 <code>SPC</code>）后短暂停顿，它会弹出后续按键的提示。是学习 Spacemacs / Doom 风格键位的灵魂插件。"
  }
};