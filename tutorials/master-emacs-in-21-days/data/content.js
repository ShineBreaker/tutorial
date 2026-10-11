/* ============================================================
 * 21 天内容数据
 * 形式：每个 day 一个对象，包含 title / theme / sections
 * section 类型：
 *   p           —— 段落（支持术语高亮 & 内联 HTML）
 *   h2/h3       —— 标题
 *   tip/warn/good/info —— 4 类提示卡片
 *   code        —— 代码块（语法高亮）
 *   keyboard    —— 键盘可视化（Day 1 用）
 *   cursor-demo —— 光标移动演示
 *   repl        —— Elisp REPL
 *   steps       —— 多步骤引导
 *   fold        —— 可折叠块
 *   link-grid   —— 链接卡片
 *   todo-board  —— Org TODO 状态机（Day 10）
 *   evil        —— Evil 模式状态机（Day 13）
 *   macro       —— Macro 展开（Day 8）
 *   roam        —— Roam 节点图（Day 19）
 *   component   —— 命名组件（自定义 HTML）
 * ============================================================ */
window.DAYS = [
  /* ===========================================================
   * Day 1: 安装与改键
   * =========================================================== */
  {
    id: 1, title: "准备开始（安装与改键）", theme: "入门 · 环境准备",
    sections: [
      { type: "intro" },
      { type: "p", html: "<p>欢迎来到 <span class=\"g-term\" data-term=\"emacs\">Emacs</span> 的世界！如果你是第一次听说它，可以先去 <a href=\"http://emacs.sexy/\" target=\"_blank\">Emacs is Sexy</a> 看看 —— 相信我，你会被它的强大所吸引。</p>\n<p>本教程假设你已经安装好了 Emacs。如果没有：</p>" },
      { type: "steps", items: [
        { title: "下载 Emacs", desc: "推荐 Doom Emacs 的安装文档，按你的操作系统下载对应版本。新手不要从源码编译。" },
        { title: "首次启动", desc: "打开 Emacs，看到一个「Welcome」界面就算成功。可以先按 q 关掉它。" },
        { title: "完成官方教程", desc: "在 Emacs 里按 <kbd>C-h t</kbd>（Ctrl + h 然后 t）打开官方教程，约 30 分钟。这是最值得投入的半小时。" }
      ] },
      { type: "fold", summary: "为什么要做改键？",
        body: `<p>Emacs 默认的 <span class="g-term" data-term="meta-key">Meta</span> 键是 Alt —— 你的小拇指能会很难受（想象每天按 Alt 几千次）。改键后：</p>
        <ul>
          <li><strong>Caps Lock → Ctrl</strong> —— 拯救你的小拇指；</li>
          <li><strong>Win / Option → Meta</strong> —— 让你的大拇指代替小拇指；</li>
          <li><strong>Alt / ⌘ → Super</strong> —— 留给自定义命令。</li>
        </ul>
        <p>记住「学可迁移的技能」：这套按键在 Shell、浏览器、IDE 里也能用，终身受用。</p>` },

      { type: "h2", text: "改键方案" },
      { type: "p", html: "不同平台用不同方式。目标是：<kbd>C</kbd> = Ctrl，<kbd>M</kbd> = Meta，<kbd>s</kbd> = Super。" },

      { type: "h3", text: "Windows：使用 SharpKeys" },
      { type: "p", html: "下载 <span class=\"g-term\" data-term=\"sharpkeys\">SharpKeys</span>，把：<br>\n        • <strong>Left Windows</strong> → <strong>Left Alt</strong>（让它做 Meta）<br>\n        • <strong>Left Alt</strong> → <strong>Application</strong>（让它做 Super）<br>\n        • <strong>Caps Lock</strong> → <strong>Ctrl</strong>" },
      { type: "code", lang: "elisp", code:
"(setq w32-apps-modifier 'super)       ; SharpKeys 把 Application 键映射到这里" },

      { type: "h3", text: "Mac：使用 Elisp" },
      { type: "code", lang: "elisp", code:
"(setq mac-option-modifier 'meta      ; ⌥ Option → Meta\n      mac-command-modifier 'super)   ; ⌘ Command → Super\n;; 还可以把 Caps Lock 改成 Ctrl（在系统偏好设置 → 键盘 → Modifier Keys）" },

      { type: "component", id: "key-vis" },

      { type: "h2", text: "光标移动 —— 你的第一组命令" },
      { type: "p", html: "这 6 个命令是最常用的，也是「Emacs 之心」。把它们练到不用思考。" },
      { type: "component", id: "cursor-demo" },

      { type: "h2", text: "把 Mac 习惯搬进 Emacs" },
      { type: "p", html: "下面这一段让你的 <kbd>⌘</kbd>（或 <kbd>s</kbd> Super 键）像 Mac 一样工作 —— 全选、复制、粘贴、撤销、剪切、保存。" },
      { type: "code", lang: "elisp", code:
"(global-set-key (kbd \"s-a\") 'mark-whole-buffer) ;; 全选\n(global-set-key (kbd \"s-c\") 'kill-ring-save)    ;; 复制\n(global-set-key (kbd \"s-s\") 'save-buffer)       ;; 保存\n(global-set-key (kbd \"s-v\") 'yank)              ;; 粘贴\n(global-set-key (kbd \"s-z\") 'undo)              ;; 撤销\n(global-set-key (kbd \"s-x\") 'kill-region)       ;; 剪切" },

      { type: "tip", title: "动手时间",
        body: "把上面这段保存到你的 init 文件里（位置见 Day 3），重启 Emacs。打开任意一个文件，试试 ⌘S、⌘C、⌘V —— 你会发现它们真的工作了！" },

      { type: "h2", text: "视频与外部资料" },
      { type: "link-grid", items: [
        { title: "Youtube 视频", url: "https://www.youtube.com/watch?v=0HZa7ttGLiU", desc: "本集配套视频" },
        { title: "Bilibili 视频", url: "https://www.bilibili.com/video/BV12P4y1j7EL/", desc: "国内镜像" },
        { title: "Learn X in Y Minutes · Elisp", url: "https://learnxinyminutes.com/docs/elisp/", desc: "15 分钟过一遍 Elisp" },
        { title: "Doom Emacs 安装文档", url: "https://github.com/hlissner/doom-emacs/blob/master/docs/getting_started.org#install", desc: "如果你想用 Doom" }
      ] }
    ]
  },

  /* ===========================================================
   * Day 2: 打造属于你的记事本
   * =========================================================== */
  {
    id: 2, title: "打造属于你的记事本", theme: "基础 · 界面与帮助",
    sections: [
      { type: "p", html: "<p>Emacs 的默认界面有点朴素 —— <span class=\"g-term\" data-term=\"tool-bar\">工具栏</span>、<span class=\"g-term\" data-term=\"scroll-bar\">滚动条</span>、<span class=\"g-term\" data-term=\"menu-bar\">菜单栏</span> 都开着，会抢占屏幕空间。我们来一一关掉它们。</p>" },

      { type: "h2", text: "内置功能：行号" },
      { type: "p", html: "显示行号用 <code>M-x linum-mode</code>。但每次手动开太麻烦，所以我们会在 <span class=\"g-term\" data-term=\"init-file\">init 文件</span> 里加上 <code>(global-linum-mode 1)</code>，这样每个 buffer 都自动显示行号。" },

      { type: "h2", text: "富文档：Emacs 是 Self-document 的" },
      { type: "p", html: "Emacs 的自我描述能力极强，三个快捷键会让你爱不释手：" },
      { type: "card", variant: "good", title: "🔍 三件套",
        body: `
          <ul>
            <li><kbd>C-h k</kbd> —— 想知道某个快捷键是干什么的？按它；</li>
            <li><kbd>C-h f</kbd> —— 想知道某个函数怎么用？输入函数名；</li>
            <li><kbd>C-h v</kbd> —— 想知道某个变量的含义和当前值？输入变量名。</li>
          </ul>
          <p>这三个命令就是 Emacs 的「查文档」方式，无需离开编辑器。</p>` },

      { type: "h2", text: "把 Emacs 加入右键菜单（Windows）" },
      { type: "p", html: "把下面这段保存为 <code>add-emacs.reg</code>，双击导入注册表，就能右键「用 Emacs 编辑」：" },
      { type: "code", lang: "reg", code:
"Windows Registry Editor Version 5.00\n\n[HKEY_CLASSES_ROOT\\*\\shell]\n[HKEY_CLASSES_ROOT\\*\\shell\\openwemacs]\n@=\"&Edit with Emacs\"\n[HKEY_CLASSES_ROOT\\*\\shell\\openwemacs\\command]\n@=\"C:\\\\emax64\\\\bin\\\\emacsclientw.exe -n \\\"%1\\\"\"" },
      { type: "tip", title: "前置条件",
        body: "使用此功能需要先让 Emacs 开启 server mode：<code>M-x server-mode</code> 或在 init.el 中加 <code>(server-mode 1)</code>。" }
    ]
  },

  /* ===========================================================
   * Day 3: Elisp 基础、Org 基础和包管理器
   * =========================================================== */
  {
    id: 3, title: "Elisp 基础、Org 基础和包管理器", theme: "基础 · 配置入门",
    sections: [
      { type: "p", html: "今天开始真正「<span class=\"g-term\" data-term=\"hacking\">Hacking</span>」！我们写第一段 Elisp，配置第一个插件，写第一个 Org 文件。" },

      { type: "h2", text: "5 分钟过 Elisp" },
      { type: "p", html: "请先打开 <a href=\"https://learnxinyminutes.com/docs/zh-cn/elisp-cn/\" target=\"_blank\">Learn X in Y Minutes · Elisp 中文版</a> 通读一遍（约 15 分钟）。读完你只需要掌握：<span class=\"g-term\" data-term=\"s-expression\">S 表达式</span>、<span class=\"g-term\" data-term=\"function\">函数</span>调用、变量、<span class=\"g-term\" data-term=\"quote\">引用</span>。" },

      { type: "h3", text: "几个最小的例子" },
      { type: "code", lang: "elisp", code:
";; 2 + 2\n(+ 2 2)                               ; => 4\n\n;; 2 + 3 * 4 —— 注意括号嵌套就是优先级\n(+ 2 (* 3 4))                         ; => 14\n\n;; 定义变量\n(setq name \"username\")                 ; name 变量赋值为 \"username\"\n(message name)                         ; 弹出 \"username\"\n\n;; 定义函数\n(defun hello ()\n  (message \"Hello, %s\" name))\n\n(hello)                                ; => Hello, username\n\n;; 给函数加 (interactive) 让它可被 M-x 调用\n(defun hello ()\n  (interactive)\n  (message \"Hello, %s\" name))\n\n;; 绑定快捷键\n(global-set-key (kbd \"<f1>\") 'hello)   ; F1 → 调用 hello" },

      { type: "h2", text: "动手试试：实时 Elisp 求值器" },
      { type: "p", html: "下面是一个迷你 <span class=\"g-term\" data-term=\"repl\">REPL</span>。在编辑框里输入 Elisp 代码，按 <kbd>Ctrl + Enter</kbd> 即可看到结果。" },
      { type: "component", id: "elisp-repl" },

      { type: "h2", text: "第一个配置文件" },
      { type: "p", html: "Emacs 的默认配置文件在 <code>~/.emacs.d/init.el</code>。它不存在就手动创建。<strong>注意</strong>：如果你同时有 <code>~/.emacs</code>，需要先删掉，否则 init.el 不会被加载。" },

      { type: "h3", text: "认识 Major Mode 与 Minor Mode" },
      { type: "card", variant: "info", title: "模式（Mode）",
        body: `<p><span class="g-term" data-term="major-mode">Major Mode（主模式）</span>定义一个 buffer 的核心编辑规则（语法高亮、缩进、专属快捷键），一个 buffer 同一时刻只能有一个。</p>
          <p><span class="g-term" data-term="minor-mode">Minor Mode（辅助模式）</span>是叠加在主模式上的额外功能（显示行号、自动补全等），可以同时开启多个。</p>
          <p>想知道当前激活了哪些 minor mode，按 <kbd>C-h m</kbd>。</p>` },

      { type: "h3", text: "开始改造你的 Emacs" },
      { type: "code", lang: "elisp", code:
";; 关闭工具栏 / 滚动条 —— 屏幕空间寸土寸金\n(tool-bar-mode -1)\n(scroll-bar-mode -1)\n\n;; 全局显示行号\n(global-linum-mode 1)\n\n;; 改光标样式（更醒目）\n(setq cursor-type 'bar)\n\n;; 启用 minibuffer 增强补全\n(icomplete-mode 1)\n\n;; F2 一键打开配置文件\n(defun open-init-file ()\n  (interactive)\n  (find-file \"~/.emacs.d/init.el\"))\n(global-set-key (kbd \"<f2>\") 'open-init-file)" },

      { type: "h3", text: "修改后如何生效？" },
      { type: "card", variant: "tip", title: "三种方法",
        body: `<ul>
          <li><strong>重启 Emacs</strong>（最稳）；</li>
          <li><strong>M-x load-file</strong> 然后两次回车（重新加载整个 init）；</li>
          <li><strong>M-x eval-buffer</strong>（执行当前 buffer 的所有 Elisp）；</li>
          <li><strong>C-x C-e</strong> 执行光标前的那一行。</li>
        </ul>` },

      { type: "h2", text: "插件管理：第一个包" },
      { type: "p", html: "通过 <code>Options &gt; Manage Emacs Packages</code> 安装 <span class=\"g-term\" data-term=\"company\">Company</span>（Complete Anything），然后在 init 文件里启用：" },
      { type: "code", lang: "elisp", code:
"(global-company-mode 1)\n\n;; Company 候选列表中用 C-n / C-p 切换\n(define-key company-active-map (kbd \"C-n\") 'company-select-next)\n(define-key company-active-map (kbd \"C-p\") 'company-select-previous)" },

      { type: "h2", text: "Org Mode 三分钟上手" },
      { type: "p", html: "<span class=\"g-term\" data-term=\"org-mode\">Org Mode</span> 的核心是「大纲」：用 <code>*</code> 的数量表示层级。<code>TAB</code> 折叠/展开，<code>C-c C-t</code> 把一个条目变成 TODO。" },
      { type: "code", lang: "org", code:
"* 第一天要做的事                          <-- 一级标题\n** TODO 写一篇文章                         <-- 二级标题 + TODO\n** DONE 看视频                              <-- 已完成\n*** 笔记整理                                <-- 三级标题" },
      { type: "card", variant: "good", title: "小贴士",
        body: `新建 .org 文件、打开它，Emacs 会自动加载 org-mode。试着按 TAB 体验大纲折叠。` }
    ]
  },

  /* ===========================================================
   * Day 4: 增强补全
   * =========================================================== */
  {
    id: 4, title: "增强补全，让 Hacking 更有趣", theme: "进阶 · 现代补全栈",
    sections: [
      { type: "p", html: "<p>今天的任务是搭建一套「现代 Emacs 补全栈」—— 装完之后你会觉得 Emacs 突然变得和 IDE 一样好用。</p>" },

      { type: "h2", text: "0. 关于 lexical-binding" },
      { type: "p", html: "在你的 init.el <strong>最顶端</strong>加上：<code>;; -*- lexical-binding: t -*-</code>。这会让变量作用域像现代语言一样清晰。" },
      { type: "code", lang: "elisp", code:
";; -*- lexical-binding: t -*-\n(let ((x 1))\n  (+ x 3))                       ; => 4" },

      { type: "h2", text: "1. 配置 MELPA 源" },
      { type: "p", html: "默认的源插件很少，加 <span class=\"g-term\" data-term=\"melpa\">MELPA</span> 之后才有 3000+ 包可选。" },
      { type: "code", lang: "elisp", code:
"(require 'package)\n(setq package-archives\n      '((\"gnu\"   . \"http://elpa.zilongshanren.com/gnu/\")\n        (\"melpa\" . \"http://elpa.zilongshanren.com/melpa/\")))\n(package-initialize)\n\n;; 第一次启动时刷新源（之后不再刷新以加快速度）\n(when (not package-archive-contents)\n  (package-refresh-contents))" },

      { type: "h2", text: "2. minibuffer 增强三件套" },
      { type: "p", html: "<span class=\"g-term\" data-term=\"vertico\">Vertico</span> 把候选列表变得好看，<span class=\"g-term\" data-term=\"orderless\">Orderless</span> 让模糊匹配更聪明，<span class=\"g-term\" data-term=\"marginalia\">Marginalia</span> 给候选加注释。三者搭配堪称完美。" },
      { type: "code", lang: "elisp", code:
"(package-install 'vertico)\n(vertico-mode 1)\n\n(package-install 'orderless)\n(setq completion-styles '(orderless))\n\n(package-install 'marginalia)\n(marginalia-mode 1)" },

      { type: "h2", text: "3. Embark：minibuffer 的右键菜单" },
      { type: "code", lang: "elisp", code:
"(package-install 'embark)\n(global-set-key (kbd \"C-;\") 'embark-act)\n(setq prefix-help-command 'embark-prefix-help-command)" },

      { type: "h2", text: "4. Consult：瑞士军刀式命令集" },
      { type: "code", lang: "elisp", code:
"(package-install 'consult)\n;; 用 consult-line 替代内置 isearch\n(global-set-key (kbd \"C-s\") 'consult-line)" },

      { type: "card", variant: "tip", title: "推荐的安装顺序",
        body: `把上面四段代码块合并到 init.el 里，然后 <code>M-x eval-buffer</code>。之后 <kbd>M-x</kbd> 试试：<code>find-file</code>、<code>switch-to-buffer</code>、<code>consult-line</code> —— 你会立刻感受到区别。` }
    ]
  },

  /* ===========================================================
   * Day 5: 手动安装插件 & 外网工具
   * =========================================================== */
  {
    id: 5, title: "手动安装插件和使用外部程序", theme: "进阶 · 插件与外部工具",
    sections: [
      { type: "p", html: "<p>今天学会两件事：(1) 手动安装插件；(2) 让 Emacs 调用外部命令行工具。这两个能力会让你的 Emacs 摆脱「只能在 Emacs 里干活」的局限。</p>" },

      { type: "h2", text: "setq 与 setq-default" },
      { type: "p", html: "当一个变量是 <span class=\"g-term\" data-term=\"buffer-local\">buffer-local</span>（每个 buffer 可以有自己的值）时，<code>setq</code> 只改当前 buffer，<code>setq-default</code> 改默认值。光标样式 <code>cursor-type</code> 就是 buffer-local 的：" },
      { type: "code", lang: "elisp", code:
"(setq-default cursor-type 'bar)        ; 所有 buffer 都用 bar 样式\n(show-paren-mode 1)                    ; 高亮匹配的括号" },

      { type: "h2", text: "手动安装插件" },
      { type: "p", html: "把插件目录加到 <span class=\"g-term\" data-term=\"load-path\">load-path</span>，再用 <code>require</code> 加载：" },
      { type: "code", lang: "elisp", code:
"(add-to-list 'load-path (expand-file-name \"~/.emacs.d/awesome-tab/\"))\n(require 'awesome-tab)\n(awesome-tab-mode 1)" },

      { type: "h2", text: "quote 与反引号" },
      { type: "code", lang: "elisp", code:
"(quote foo)        ; 'foo 的完整写法，返回 foo 这个符号本身\n'foo               ; 同上，更常见\n'(+ 1 1)           ; 返回 (+ 1 1) 这个列表（不会被求值）\n(+ 1 1)            ; 返回 2" },

      { type: "h2", text: "让 Emacs 调用外部程序" },
      { type: "p", html: "下载 <a href=\"https://github.com/m-parashar/emax64/releases\" target=\"_blank\">emax64</a>，它是 Windows 下常用 GNU 工具（ls、grep、diff…）的合集。然后在 init 里把它的路径加入 <code>exec-path</code>：" },
      { type: "code", lang: "elisp", code:
"(progn\n  (defvar emax-root (concat (expand-file-name \"~\") \"/emax\"))\n  (setq exec-path (cons (concat emax-root \"/bin\")   exec-path))\n  (setq exec-path (cons (concat emax-root \"/bin64\") exec-path))\n  (setenv \"PATH\" (concat emax-root \"/bin;\" emax-root \"/bin64;\" (getenv \"PATH\")))\n\n  ;; 如果你用 msys2\n  (setenv \"PATH\" (concat \"C:\\\\msys64\\\\usr\\\\bin;\"\n                         \"C:\\\\msys64\\\\mingw64\\\\bin;\"\n                         (getenv \"PATH\"))))" },
      { type: "card", variant: "tip", title: "测试一下",
        body: `<code>M-x shell</code> 打开内置 shell，敲 <code>ls</code> —— 如果不是「command not found」就说明配置成功。` }
    ]
  },

  /* ===========================================================
   * Day 6: Emacs 作为超级前端
   * =========================================================== */
  {
    id: 6, title: "Emacs 作为超级前端", theme: "进阶 · 系统集成",
    sections: [
      { type: "h2", text: "从 Emacs 打开系统文件管理器" },
      { type: "code", lang: "elisp", code:
"(shell-command-to-string \"explorer.exe C:\\\\\")" },
      { type: "p", html: "把这个能力封装成一个命令，可以更优雅地「打开当前文件的目录」：" },
      { type: "code", lang: "elisp", code:
"(defun my-open-current-directory ()\n  (interactive)\n  (shell-command-to-string\n   (encode-coding-string\n    (replace-regexp-in-string \"/\" \"\\\\\"\n      (format \"explorer.exe %s\" default-directory))\n    'gbk)))\n(global-set-key (kbd \"<f6>\") 'my-open-current-directory)" },

      { type: "h2", text: "批量搜索替换大杀器：wgrep" },
      { type: "code", lang: "elisp", code:
"(package-install 'embark-consult)\n(package-install 'wgrep)\n(setq wgrep-auto-save-buffer t)" },

      { type: "h2", text: "用拼音搜索（中文友好）" },
      { type: "code", lang: "elisp", code:
"(package-install 'pyim)\n(defun toggle-chinese-search ()\n  (interactive)\n  (if (not (advice-member-p #'eh-orderless-regexp 'orderless-regexp))\n      (advice-add 'orderless-regexp :around #'eh-orderless-regexp)\n    (advice-remove 'orderless-regexp #'eh-orderless-regexp)))\n(global-set-key (kbd \"s-p\") 'toggle-chinese-search)" },

      { type: "card", variant: "good", title: "成果",
        body: `现在你可以：按 <kbd>F6</kbd> 打开当前目录、用 <kbd>C-s</kbd> 做项目级搜索、用 <kbd>s-p</kbd> 切换拼音搜索、用 <code>wgrep</code> 直接在搜索结果里改文件。这套工作流可以替代很多 IDE 功能。` }
    ]
  },

  /* ===========================================================
   * Day 7: 模块化配置
   * =========================================================== */
  {
    id: 7, title: "模块化配置文件管理", theme: "进阶 · 配置架构",
    sections: [
      { type: "p", html: "<p>当配置越来越多，<code>init.el</code> 会变得臃肿。把不同职责的配置拆到不同文件里 —— 这就是「模块化」。</p>" },

      { type: "h2", text: "目标目录结构" },
      { type: "code", lang: "text", code:
"~/.emacs.d/\n├── init.el                # 入口文件\n├── custom.el              # 工具产生的配置（用 customize 改的）\n└── lisp/\n    ├── init-packages.el     # 插件源\n    ├── init-ui.el           # 界面美化\n    ├── init-better-defaults.el\n    ├── init-keybindings.el\n    └── init-org.el" },

      { type: "h3", text: "入口文件 init.el" },
      { type: "code", lang: "elisp", code:
"(add-to-list 'load-path \"~/.emacs.d/lisp/\")\n(require 'init-packages)\n(require 'init-ui)\n(require 'init-better-defaults)\n(require 'init-keybindings)\n(require 'init-org)" },

      { type: "h3", text: "模块文件 init-packages.el 范例" },
      { type: "code", lang: "elisp", code:
"(require 'package)\n(setq package-archives\n      '((\"gnu\"   . \"http://elpa.zilongshanren.com/gnu/\")\n        (\"melpa\" . \"http://elpa.zilongshanren.com/melpa/\")))\n(package-initialize)\n\n(when (not package-archive-contents)\n  (package-refresh-contents))\n\n(provide 'init-packages)        ; 文件末尾必须有 provide" },
      { type: "card", variant: "info", title: "provide 的意义",
        body: `<code>(provide 'xxx)</code> 声明「此文件已加载」并注册到 features 列表中。其他文件 <code>(require 'xxx)</code> 时会查找这个 feature。如果 require 的 feature 没注册过，Emacs 就去 load-path 里找对应的 .el 文件并加载。` },

      { type: "h2", text: "用 Org 管理配置（高阶）" },
      { type: "p", html: "进阶玩法：把所有配置写在一个 .org 文件里，再用 <span class=\"g-term\" data-term=\"babel\">Babel</span> 把代码块抽出来。这种「文学式配置」可读性极强。" },
      { type: "code", lang: "elisp", code:
"(require 'org-install)\n(require 'ob-tangle)\n(org-babel-load-file (expand-file-name \"config.org\" user-emacs-directory))" },
      { type: "link-grid", items: [
        { title: "condy0919 的配置", url: "https://github.com/condy0919/.emacs.d", desc: "模块化的范例" },
        { title: "seagle0128 的配置", url: "https://github.com/seagle0128/.emacs.d", desc: "Centaur Emacs" },
        { title: "trev-dev 的 org 配置", url: "https://github.com/trev-dev/emacs", desc: "Org 配置范例" }
      ] }
    ]
  },

  /* ===========================================================
   * Day 8: macro & use-package
   * =========================================================== */
  {
    id: 8, title: "macro 和 use-package", theme: "进阶 · Lisp 元编程",
    sections: [
      { type: "p", html: "<p>今天的内容是 Elisp 的两个「魔法」：<span class=\"g-term\" data-term=\"macro\">宏（macro）</span>和 <span class=\"g-term\" data-term=\"use-package\">use-package</span>。理解前者会让你看懂别人的代码，使用后者会让你的配置清爽 10 倍。</p>" },

      { type: "h2", text: "宏是什么？" },
      { type: "p", html: "宏和函数很像，但有一个关键区别：<strong>函数在运行时执行参数；宏在编译时把代码「重写」成新代码</strong>。" },
      { type: "code", lang: "elisp", code:
"(defmacro inc (var)\n  (list 'setq var (list '1+ var)))\n\n(macroexpand '(inc my-var))     ; 宏展开：会显示 (setq my-var (1+ my-var))\n(inc my-var)                    ; 实际运行：my-var 自增 1" },

      { type: "h3", text: "Backquote —— 写宏的利器" },
      { type: "code", lang: "elisp", code:
";; ` 是 backquote：引用列表，但允许 , 和 ,@ 选择性求值\n(setq some-list '(2 3))\n`(1 ,@some-list 4 ,@some-list)   ; => (1 2 3 4 2 3)" },
      { type: "component", id: "macro-demo" },

      { type: "h2", text: "use-package：现代 Emacs 的标准" },
      { type: "p", html: "<span class=\"g-term\" data-term=\"use-package\">use-package</span> 是个宏，它把「加载包 + 配置包 + 绑定键」集中在一处。Spacemacs、DoomEmacs 都重度依赖它。" },
      { type: "steps", items: [
        { title: "更安全的 require", desc: "(use-package xxx) 会优雅地处理 xxx 不存在的情况" },
        { title: "配置集中", desc: "用 :init 和 :config 把相关代码都包进来" },
        { title: "延迟加载", desc: ":commands 或 :defer t 让包在你用到时才加载" },
        { title: "键绑定", desc: ":bind 直接写键位，比 global-set-key 更优雅" }
      ] },
      { type: "code", lang: "elisp", code:
"(use-package company\n  :ensure t                         ; 自动安装\n  :bind (:map company-active-map\n              (\"C-n\" . company-select-next)\n              (\"C-p\" . company-select-previous))\n  :init (global-company-mode t)\n  :config\n  (setq company-minimum-prefix-length 1\n        company-idle-delay 0))" },

      { type: "h2", text: "为什么大家都用 use-package" },
      { type: "card", variant: "good", title: "三个理由",
        body: `<ol>
          <li><strong>配置集中</strong> —— 一个包的所有相关代码都在一个 use-package 块里；</li>
          <li><strong>错误处理</strong> —— 包不存在也不会让 Emacs 启动失败；</li>
          <li><strong>延迟加载</strong> —— 启动更快。</li>
        </ol>` }
    ]
  },

  /* ===========================================================
   * Day 9: use-package 更多设置
   * =========================================================== */
  {
    id: 9, title: "use-package 更多设置", theme: "进阶 · 性能优化",
    sections: [
      { type: "h2", text: "自动安装缺失的包" },
      { type: "code", lang: "elisp", code:
"(require 'use-package-ensure)\n(setq use-package-always-ensure t)        ; 找不到的包自动从 MELPA 装" },

      { type: "h3", text: "记忆光标位置与命令历史" },
      { type: "code", lang: "elisp", code:
"(use-package savehist\n  :ensure nil\n  :hook (after-init . savehist-mode)\n  :init (setq enable-recursive-minibuffers t\n              history-length 1000\n              savehist-additional-variables\n              '(mark-ring global-mark-ring search-ring\n                regexp-search-ring extended-command-history)))\n\n(use-package saveplace\n  :ensure nil\n  :hook (after-init . save-place-mode))" },

      { type: "h3", text: "美化状态栏：doom-modeline" },
      { type: "code", lang: "elisp", code:
"(use-package doom-modeline\n  :ensure t\n  :init (doom-modeline-mode t))" },

      { type: "h3", text: "关闭恼人的小细节" },
      { type: "code", lang: "elisp", code:
"(global-auto-revert-mode 1)              ; 外部修改自动重载\n(setq auto-save-default nil)              ; 关闭自动保存\n(setq ring-bell-function 'ignore)         ; 关掉「哔哔」声\n(fset 'yes-or-no-p 'y-or-n-p)            ; yes/no 简化为 y/n" },
      { type: "card", variant: "tip", title: "性能提示",
        body: `重启 Emacs 会用 <code>emacs --debug-init</code> 启动，能看到详细的加载错误。` }
    ]
  },

  /* ===========================================================
   * Day 10: org-mode 基础
   * =========================================================== */
  {
    id: 10, title: "Org Mode 基础", theme: "生产力 · 大纲与 TODO",
    sections: [
      { type: "p", html: "<p><span class=\"g-term\" data-term=\"org-mode\">Org Mode</span> 是 Emacs 最强大的功能之一。它既是 TODO 系统，也是笔记系统，也能写文档、写博客、写书。今天我们来打通它的「日常使用」脉络。</p>" },

      { type: "h2", text: "先确保用最新版 Org" },
      { type: "code", lang: "elisp", code:
"(use-package org\n  :pin melpa\n  :ensure t)\n\n(use-package org-contrib\n  :pin nongnu)" },

      { type: "h2", text: "配置 TODO 状态机" },
      { type: "p", html: "Org 的 TODO 默认只有 TODO/DONE 两种状态。可以自定义多个中间状态：STARTED、WAITING、CANCELLED ……" },
      { type: "code", lang: "elisp", code:
"(setq org-todo-keywords\n      '((sequence \"TODO(t)\" \"STARTED(s)\" \"|\" \"DONE(d!/!)\")\n        (sequence \"WAITING(w@/!)\" \"SOMEDAY(S)\" \"|\"\n                  \"CANCELLED(c@/!)\" \"MEETING(m)\" \"PHONE(p)\")))" },

      { type: "h3", text: "来玩一下" },
      { type: "component", id: "todo-board" },

      { type: "h2", text: "Agenda：全局视图" },
      { type: "code", lang: "elisp", code:
"(global-set-key (kbd \"C-c a\") 'org-agenda)\n(setq org-agenda-files '(\"~/gtd.org\"))\n(setq org-agenda-span 'day)" },
      { type: "p", html: "<kbd>C-c C-s</kbd> 安排时间（schedule），<kbd>C-c C-d</kbd> 设置截止（deadline）。然后 <kbd>C-c a</kbd> 打开 agenda 视图。" },

      { type: "h2", text: "Capture：快速收集" },
      { type: "code", lang: "elisp", code:
"(setq org-capture-templates\n      '((\"t\" \"Todo\" entry (file+headline \"~/gtd.org\" \"Workspace\")\n         \"* TODO [#B] %?\\n  %i\\n %U\"\n         :empty-lines 1)))\n(global-set-key (kbd \"C-c r\") 'org-capture)" },

      { type: "card", variant: "info", title: "agenda 视图快捷键",
        body: `<ul>
          <li><kbd>e</kbd> —— 设置 effort（预估耗时）；</li>
          <li><kbd>_</kbd> —— 按 effort 过滤；</li>
          <li><kbd>:</kbd> —— 按 tag 过滤；</li>
          <li><kbd>t</kbd> —— 切换 TODO 状态。</li>
        </ul>` }
    ]
  },

  /* ===========================================================
   * Day 11: ox-hugo 写博客
   * =========================================================== */
  {
    id: 11, title: "用 ox-hugo 写博客", theme: "实战 · 写作工作流",
    sections: [
      { type: "p", html: "<p>用 <span class=\"g-term\" data-term=\"org-mode\">Org Mode</span> 写博客 → 自动生成 Markdown → <span class=\"g-term\" data-term=\"hugo\">Hugo</span> 渲染 → GitHub Actions 自动发布。这是一个完全免费、个人拥有所有数据的写作系统。</p>" },

      { type: "steps", items: [
        { title: "安装 Hugo", desc: "Windows 用 choco：choco install hugo --confirm" },
        { title: "新建博客站点", desc: "hugo new site blog && cd blog && git init" },
        { title: "安装主题", desc: "用 git submodule 安装 even 主题" },
        { title: "装 ox-hugo", desc: "MELPA 安装，启用 after ox" },
        { title: "写博客", desc: "用 org capture 模板快速新建草稿" }
      ] },

      { type: "code", lang: "elisp", code:
"(use-package ox-hugo\n  :ensure t\n  :pin melpa\n  :after ox)" },

      { type: "code", lang: "elisp", code:
      "(with-eval-after-load 'org-capture\n  (defun org-hugo-new-subtree-post-capture-template ()\n    (let* ((title (read-from-minibuffer \"Post Title: \"))\n           (fname (org-hugo-slug title)))\n      (mapconcat #'identity\n                 (list\n                  (concat \"* TODO \" title)\n                  \":PROPERTIES:\"\n                  (concat \":EXPORT_FILE_NAME: \" fname)\n                  \":END:\"\n                  \"\\n\\n\")\n                 \"\\n\")))\n\n  (add-to-list 'org-capture-templates\n               '(\"h\" \"Hugo post\" entry\n                 (file+headline \"~/blog/all-blog.org\" \"Blog Ideas\")\n                 (function org-hugo-new-subtree-post-capture-template))))" },
            { type: "tip", title: "本地预览",
              body: `<code>hugo server -D</code> 启动本地预览（含草稿），浏览器访问 <code>localhost:1313</code> 即可看到效果。` }
    ]
  },

  /* ===========================================================
   * Day 12: eglot C/C++
   * =========================================================== */
  {
    id: 12, title: "用 eglot 编写和调试 C/C++", theme: "实战 · IDE 化",
    sections: [
      { type: "h2", text: "安装 MSYS2 工具链（Windows）" },
      { type: "code", lang: "bash", code:
"pacman -Syu\npacman -S mingw-w64-x86_64-gcc mingw-w64-x86_64-gdb make \\\n          mingw-w64-x86_64-clang mingw-w64-x86_64-clang-tools-extra" },

      { type: "h2", text: "启用 Eglot" },
      { type: "code", lang: "elisp", code:
"(require 'eglot)\n(add-to-list 'eglot-server-programs '((c++-mode c-mode) \"clangd\"))\n(add-hook 'c-mode-hook #'eglot-ensure)\n(add-hook 'c++-mode-hook #'eglot-ensure)" },

      { type: "h2", text: "一键运行：quickrun" },
      { type: "code", lang: "elisp", code:
"(use-package quickrun\n  :ensure t\n  :init\n  (quickrun-add-command \"c++/c1z\"\n    '((:command . \"g++\")\n      (:exec . (\"%c -std=c++1z %o -o %e %s\" \"%e %a\"))\n      (:remove . (\"%e\")))\n    :default \"c++\")\n  :bind (\"<f5>\" . quickrun))" },

      { type: "h2", text: "调试：GDB 大杀器" },
      { type: "p", html: "<kbd>M-x compile</kbd> 输入 <code>g++ -g -o test.o test.cpp</code> 编译，再 <kbd>M-x gud-gdb</kbd> 输入 <code>gdb ./test.o</code>。常用命令：" },
      { type: "code", lang: "text", code:
"break main          ; 在 main 设断点\nbreak 12            ; 在第 12 行设断点\nbreak 11 if x>0     ; 条件断点\ninfo breakpoints    ; 查看所有断点\nrun                 ; 开始\nnext                ; step over\nstep                ; step into\ncontinue            ; 跑到下一个断点\nwatch x             ; 监视变量\ndisplay x           ; 自动显示 x\nlist                ; 显示当前源代码\nquit                ; 退出" }
    ]
  },

  /* ===========================================================
   * Day 13: Evil
   * =========================================================== */
  {
    id: 13, title: "Evil —— Vim 按键模拟", theme: "进阶 · 编辑哲学",
    sections: [
      { type: "p", html: "<p><span class=\"g-term\" data-term=\"evil\">Evil</span> 让 Emacs 拥有了 Vim 的按键。Vim 的「模式」思想让纯键盘编辑效率大幅提升 —— 但你需要适应它。</p>" },
      { type: "component", id: "evil-stage" },

      { type: "h2", text: "Evil 的 6 个状态" },
      { type: "code", lang: "text", code:
"Normal (N)    默认状态，移动光标、执行操作\nInsert (I)    输入文字，类似普通编辑器\nVisual (V)    选中区域\nEmacs (E)     退回原生 Emacs 按键\nMotion (M)    只读 buffer 的移动模式\nReplace (R)   类似 Insert，但覆盖而非插入" },

      { type: "h2", text: "安装配置" },
      { type: "code", lang: "elisp", code:
"(use-package evil\n  :ensure t\n  :init\n  (setq evil-want-keybinding nil)\n  (evil-mode))\n\n(use-package evil-collection\n  :ensure t\n  :config (evil-collection-init))" },

      { type: "h2", text: "推荐插件" },
      { type: "link-grid", items: [
        { title: "evil-anzu", url: "#", desc: "在搜索时显示匹配数量" },
        { title: "evil-surround", url: "#", desc: "快速改包围符号（cs ' 等）" },
        { title: "evil-nerd-commenter", url: "#", desc: "快速注释 / 反注释代码" },
        { title: "evil-snipe", url: "#", desc: "Vim 风格的快速跳转 f/F" },
        { title: "evil-matchit", url: "#", desc: "% 跳转匹配的标签" },
        { title: "undo-tree", url: "#", desc: "把撤销历史可视化为树" }
      ] }
    ]
  },

  /* ===========================================================
   * Day 14: 精选 packages
   * =========================================================== */
  {
    id: 14, title: "精选 packages，大幅提升编辑效率", theme: "进阶 · 编辑增强",
    sections: [
      { type: "h2", text: "多光标：iedit & evil-multiedit" },
      { type: "p", html: "想在多处同时编辑？看 iedit —— 按一次快捷键，buffer 中所有同名符号都被选中，直接改一处 = 改所有处。" },
      { type: "code", lang: "elisp", code:
"(use-package iedit\n  :ensure t\n  :config\n  (define-key iedit-mode-keymap (kbd \"M-h\") 'iedit-restrict-function)\n  (define-key iedit-mode-keymap (kbd \"M-i\") 'iedit-restrict-current-line))\n\n(use-package evil-multiedit\n  :ensure t\n  :commands (evil-multiedit-default-keybinds)\n  :init (evil-multiedit-default-keybinds))" },

      { type: "h2", text: "expand-region：智能扩展选区" },
      { type: "code", lang: "elisp", code:
"(use-package expand-region\n  :config\n  ;; 绑定到 SPC v\n  (global-set-key (kbd \"s-v\") 'er/expand-region))" },

      { type: "h2", text: "symbol-overlay：符号高亮" },
      { type: "p", html: "把当前光标处的符号高亮，类似 IDE 的「高亮所有引用」。" },
      { type: "code", lang: "elisp", code:
"(use-package symbol-overlay\n  :ensure t\n  :config\n  (global-set-key (kbd \"s-h\") 'symbol-overlay-put)\n  (global-set-key (kbd \"s-H\") 'symbol-overlay-remove-all))" },

      { type: "card", variant: "tip", title: "试试这些组合",
        body: `<ul>
          <li><kbd>s-h</kbd> 高亮当前符号 → <kbd>n</kbd>/<kbd>p</kbd> 跳到下一个/上一个 → <kbd>s-H</kbd> 清除；</li>
          <li><kbd>s-v</kbd> 扩展选区（智能从小到大：单词 → 句子 → 函数 → 段落）；</li>
          <li>在 iedit 模式下输入 = 所有同名变量同步改。</li>
        </ul>` }
    ]
  },

  /* ===========================================================
   * Day 15: Treesit + Eglot
   * =========================================================== */
  {
    id: 15, title: "Treesit + Eglot 打造现代 IDE", theme: "实战 · 现代编程",
    sections: [
      { type: "p", html: "<p>Emacs 29+ 内置 <span class=\"g-term\" data-term=\"treesit\">Tree-sitter</span> 支持。它让语法高亮、缩进、结构跳转变得像现代 IDE 一样准确。</p>" },

      { type: "h2", text: "配置 Tree-sitter" },
      { type: "code", lang: "elisp", code:
"(setq treesit-font-lock-level 4)        ; 4 = 最丰富的高亮" },

      { type: "h2", text: "跳转：consult-imenu" },
      { type: "code", lang: "elisp", code:
"(global-set-key (kbd \"s-j\") 'consult-imenu)" },

      { type: "h2", text: "查找定义与引用" },
      { type: "p", html: "<code>M-x xref-find-definitions</code> 跳到定义，<code>M-x xref-find-references</code> 查看引用，<kbd>C-o</kbd> 返回。" },

      { type: "h2", text: "代码片段：yasnippet" },
      { type: "code", lang: "elisp", code:
"(use-package yasnippet\n  :ensure t\n  :hook ((prog-mode . yas-minor-mode)\n         (org-mode . yas-minor-mode)))\n\n(use-package yasnippet-snippets\n  :ensure t\n  :after yasnippet)" },
      { type: "card", variant: "good", title: "试试看",
        body: `打开一个 .js 文件，按 <kbd>s-j</kbd> 选择函数，按 <kbd>TAB</kbd> 触发 snippet（如 <code>for</code> → 完整 for 循环），体验现代化编辑。` }
    ]
  },

  /* ===========================================================
   * Day 16: 窗口管理
   * =========================================================== */
  {
    id: 16, title: "窗口管理", theme: "进阶 · 工作流",
    sections: [
      { type: "h2", text: "窗口编号：window-numbering" },
      { type: "code", lang: "elisp", code:
"(use-package window-numbering\n  :hook (after-init . window-numbering-mode))" },
      { type: "p", html: "现在按 <kbd>M-1</kbd> <kbd>M-2</kbd> …… 可以直接跳到编号对应的窗口。" },

      { type: "h2", text: "窗口调整：resize-window" },
      { type: "code", lang: "elisp", code:
"(use-package resize-window\n  :ensure t)" },
      { type: "p", html: "按 <kbd>C-x w</kbd> 弹出菜单，按 <code>n</code> <code>p</code> <code>f</code> <code>b</code> 调整窗口大小。" },

      { type: "h2", text: "弹窗管理：popper" },
      { type: "p", html: "<span class=\"g-term\" data-term=\"popper\">Popper</span> 把 Help、Messages 这些临时 buffer 当作「弹窗」，按 <kbd>s-\`</kbd> 切换。" },
      { type: "code", lang: "elisp", code:
"(use-package popper\n  :bind (:map popper-mode-map\n              (\"s-\`\" . popper-toggle-latest)\n              (\"s-o\" . popper-cycle))\n  :hook (emacs-startup . popper-mode))" },

      { type: "h2", text: "撤销窗口调整：winner-mode" },
      { type: "code", lang: "elisp", code:
"(use-package winner\n  :ensure nil\n  :hook (after-init . winner-mode))\n;; C-c <left> 撤销窗口布局变动\n;; C-c <right> 重做" }
    ]
  },

  /* ===========================================================
   * Day 17: 工作区间
   * =========================================================== */
  {
    id: 17, title: "工作区间管理", theme: "进阶 · 多项目",
    sections: [
      { type: "h2", text: "内置 tab-bar-mode" },
      { type: "code", lang: "elisp", code:
"(use-package tab-bar\n  :ensure nil\n  :init\n  (tab-bar-mode 1)\n  (setq tab-bar-new-tab-choice \"*scratch*\"\n        tab-bar-show 1))" },

      { type: "h2", text: "tabspaces：项目级工作区" },
      { type: "p", html: "<span class=\"g-term\" data-term=\"tabspaces\">tabspaces</span> 把 tab 扩展为「工作区」概念 —— 每个工作区有自己的 buffer 列表、自己的主题色，适合在不同项目间切换。" },
      { type: "code", lang: "elisp", code:
"(use-package tabspaces\n  :hook (after-init . tabspaces-mode)\n  :custom\n  (tabspaces-use-filtered-buffers-as-default t)\n  (tabspaces-session t)\n  (tabspaces-session-auto-restore t))" },

      { type: "card", variant: "good", title: "工作流",
        body: `<ul>
          <li><kbd>SPC l p</kbd> —— 创建项目工作区；</li>
          <li><kbd>SPC l l</kbd> —— 切换工作区；</li>
          <li><kbd>SPC l s</kbd> —— 保存当前工作区；</li>
          <li><kbd>SPC l L</kbd> —— 恢复上次保存的工作区。</li>
        </ul>` }
    ]
  },

  /* ===========================================================
   * Day 18: Org-mode 进阶
   * =========================================================== */
  {
    id: 18, title: "Org Mode 进阶", theme: "生产力 · 高阶",
    sections: [
      { type: "h2", text: "剪贴板截图：org-download" },
      { type: "p", html: "在 Org buffer 里 <kbd>C-c C-s</kbd> 直接把剪贴板截图贴进文档。" },
      { type: "code", lang: "elisp", code:
"(use-package org-download\n  :ensure t\n  :after org\n  :config\n  (add-hook 'dired-mode-hook 'org-download-enable)\n  (setq org-download-screenshot-method\n        \"powershell -c Add-Type -AssemblyName System.Windows.Forms; \\\n         $image = [Windows.Forms.Clipboard]::GetImage(); \\\n         $image.Save('%s', [System.Drawing.Imaging.ImageFormat]::Png)\"))" },

      { type: "h2", text: "剪藏网页：org-protocol" },
      { type: "p", html: "设置 org-protocol 后，浏览器书签栏里加一个「Capture to Org」按钮，可以一键把当前网页作为 Org 条目保存下来。" },

      { type: "h2", text: "拼写检查：flyspell" },
      { type: "code", lang: "elisp", code:
"(use-package ispell\n  :ensure nil\n  :config\n  (setq ispell-program-name \"aspell\")\n  (add-hook 'text-mode-hook #'flyspell-mode))" },

      { type: "h2", text: "字典：fanyi" },
      { type: "code", lang: "elisp", code:
"(use-package fanyi\n  :ensure t\n  :custom\n  (fanyi-providers '(fanyi-youdao-thesaurus-provider\n                     fanyi-etymon-provider)))" }
    ]
  },

  /* ===========================================================
   * Day 19: Org Roam
   * =========================================================== */
  {
    id: 19, title: "Org Roam —— 你的第二大脑", theme: "生产力 · 知识管理",
    sections: [
      { type: "p", html: "<p><span class=\"g-term\" data-term=\"roam\">Org Roam</span> 是 Org Mode 的「双链笔记」扩展。每个笔记是一个节点，可以互相引用，组成一张网。可视化效果类似 Roam Research。</p>" },

      { type: "h2", text: "安装与配置" },
      { type: "code", lang: "elisp", code:
"(use-package org-roam\n  :ensure t\n  :custom\n  (org-roam-directory (file-truename \"~/org\"))\n  :bind ((\"C-c n l\" . org-roam-buffer-toggle)\n         (\"C-c n f\" . org-roam-node-find)\n         (\"C-c n g\" . org-roam-graph)\n         (\"C-c n i\" . org-roam-node-insert)\n         (\"C-c n c\" . org-roam-capture)))" },

      { type: "h3", text: "来玩一下知识图谱" },
      { type: "component", id: "roam-graph" },

      { type: "h2", text: "常用快捷键" },
      { type: "code", lang: "text", code:
"C-c n f    查找节点（按标题/标签模糊匹配）\nC-c n i    把已有节点链接插入当前位置\nC-c n c    新建节点（弹出 capture 模板）\nC-c n l    在 backlinks buffer 中查看谁链接了我\nC-c n g    打开 Roam UI（浏览器中的可视化图谱）" }
    ]
  },

  /* ===========================================================
   * Day 20: 排查问题
   * =========================================================== */
  {
    id: 20, title: "配置问题排查", theme: "进阶 · 故障排查",
    sections: [
      { type: "h2", text: "配置有问题，启动不了" },
      { type: "p", html: "用 <code>emacs --debug-init</code> 启动，能看到详细的加载错误。" },
      { type: "code", lang: "bash", code:
"emacs --debug-init" },

      { type: "h2", text: "pax 包解压失败" },
      { type: "p", html: "Windows 上 MSYS2 的 tar 和系统 tar 冲突，会让 Emacs 无法解压某些包。解决方法：把 MSYS2 的 tar 改名：" },
      { type: "code", lang: "bash", code:
"mv /usr/bin/tar /usr/bin/tarbak" },

      { type: "h2", text: "Git 冲突、编码问题等" },
      { type: "card", variant: "info", title: "通用排查清单",
        body: `<ol>
          <li><strong>看 *Messages* buffer</strong> —— 启动时的报错都在里面；</li>
          <li><strong>二分定位</strong> —— 注释掉一半配置，看错误是否消失；</li>
          <li><strong>google "Emacs xxx error"</strong> —— 大多数坑都有人踩过；</li>
          <li><strong>上 Emacs China 论坛</strong> —— 中文社区响应很快。</li>
        </ol>` }
    ]
  },

  /* ===========================================================
   * Day 21: 优化性能
   * =========================================================== */
  {
    id: 21, title: "优化性能，借鉴他人配置", theme: "进阶 · 收官",
    sections: [
      { type: "h2", text: "度量启动性能" },
      { type: "code", lang: "elisp", code:
"(use-package benchmark-init\n  :ensure t\n  :demand t\n  :config\n  (add-hook 'after-init-hook #'benchmark-init/deactivate))" },
      { type: "p", html: "重启后看 <code>*benchmark-init/tree*</code> buffer —— 它会展示每个包加载耗时。" },

      { type: "h2", text: "性能优化技巧" },
      { type: "steps", items: [
        { title: "延迟加载", desc: "尽量用 :defer t 或 :commands，让包按需加载" },
        { title: "gc-cons-threshold 调高", desc: "(setq gc-cons-threshold (* 50 1000 1000)) 减少 GC 频率" },
        { title: "善用 autoload", desc: "不要 require 全部包，只在需要时 load" },
        { title: "借用大佬的配置", desc: "Spacemacs、Doom Emacs、Centaur Emacs 都是学习对象" }
      ] },

      { type: "h2", text: "结语" },
      { type: "card", variant: "good", title: "🎉 恭喜你！",
        body: `21 天过去了，你已经掌握了 Emacs 的主要功能。<br>
          但 Emacs 的学习曲线没有终点 —— <strong>每天解决一个小问题，每周学一个新快捷键</strong>，一年之后你会发现自己和别人不一样。<br><br>
          推荐继续阅读：<a href="https://www.gnu.org/software/emacs/manual/elisp" target="_blank">Elisp Manual</a>、<a href="https://protesilaos.com/" target="_blank">Protesilaos Stavrou 的博客</a>、<a href="https://emacs-china.org" target="_blank">Emacs China 论坛</a>。<br><br>
          <em>Happy hacking!</em>` }
    ]
  }
];