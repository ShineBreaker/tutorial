/* ============================================================
 * 可复用交互组件 —— 每个组件都是一个函数，返回 HTML 字符串
 * ============================================================ */
window.Components = (() => {

  /* ---------- 极简 Elisp 求值器 ---------- */
  const elisp = {
    /* 内置常量与函数 —— 故意只暴露教学所需子集 */
    env: {
      t: true, nil: false,
      '+': (...a) => a.reduce((x, y) => x + y, 0),
      '-': (...a) => a.length === 1 ? -a[0] : a.reduce((x, y) => x - y),
      '*': (...a) => a.reduce((x, y) => x * y, 1),
      '/': (...a) => a.length === 1 ? 1 / a[0] : a.reduce((x, y) => x / y),
      '=': (a, b) => a === b,
      'eq': (a, b) => a === b,
      'equal': (a, b) => JSON.stringify(a) === JSON.stringify(b),
      'car': (l) => Array.isArray(l) ? l[0] : null,
      'cdr': (l) => Array.isArray(l) ? l.slice(1) : null,
      'cons': (a, b) => Array.isArray(b) ? [a, ...b] : [a, b],
      'list': (...args) => args,
      'length': (l) => Array.isArray(l) || typeof l === 'string' ? l.length : 0,
      'concat': (...args) => args.map(x => String(x ?? '')).join(''),
      'message': (...args) => args.join(' '),
      'number-to-string': (n) => String(n),
      '1+': (n) => n + 1,
      '1-': (n) => n - 1,
      'sqrt': (n) => Math.sqrt(n),
      'expt': (a, b) => Math.pow(a, b),
      'mod': (a, b) => a % b,
      'not': (a) => !a,
      'and': (...args) => args.every(Boolean),
      'or':  (...args) => args.find(Boolean) ?? false,
      'if': (cond, then, els) => cond ? then : els,
      'print': (x) => JSON.stringify(x)
    },
    /* 求值一个 S 表达式（递归） */
    eval(expr, env) {
      if (typeof expr === 'number') return expr;
      if (typeof expr === 'string') return expr.startsWith('"') && expr.endsWith('"') ? expr.slice(1, -1) : (env[expr] ?? expr);
      if (typeof expr === 'boolean') return expr;
      if (!Array.isArray(expr) || expr.length === 0) return null;

      /* 自带特殊形式 */
      const head = expr[0];
      switch (head) {
        case 'quote': return expr[1];
        case 'setq': {
          if (typeof expr[1] !== 'string') throw new Error('setq 需要符号名');
          env[expr[1]] = this.eval(expr[2], env);
          return env[expr[1]];
        }
        case 'defun': {
          const name = expr[1];
          const args = expr[2];
          const body = expr[3];
          env[name] = (...callArgs) => {
            const local = { ...env };
            args.forEach((a, i) => local[a] = callArgs[i]);
            return this.eval(body, local);
          };
          return `<function ${name}>`;
        }
        case 'defmacro': {
          const name = expr[1];
          const args = expr[2];
          const body = expr[3];
          env[name] = (...callArgs) => `<macro ${name}>`;
          env[name + '::expand'] = (callArgs) => {
            const local = { ...env };
            args.forEach((a, i) => local[a] = callArgs[i]);
            return this.eval(body, local);
          };
          return `<macro ${name}>`;
        }
        case 'macroexpand': {
          const target = expr[1];
          if (!Array.isArray(target)) throw new Error('macroexpand 需要 (macroexpand form)');
          const fn = env[target[0] + '::expand'];
          if (!fn) return target;
          return fn(target.slice(1));
        }
        case 'let': {
          const local = { ...env };
          for (const pair of expr[1]) local[pair[0]] = this.eval(pair[1], local);
          return this.eval(expr[2], local);
        }
        case 'lambda': {
          const args = expr[1];
          const body = expr[2];
          return (...callArgs) => {
            const local = { ...env };
            args.forEach((a, i) => local[a] = callArgs[i]);
            return this.eval(body, local);
          };
        }
      }

      /* 普通函数调用 */
      if (typeof head !== 'string') throw new Error(`无法调用 ${JSON.stringify(head)}`);
      const fn = env[head];
      if (typeof fn !== 'function') throw new Error(`未知函数 ${head}`);
      const args = expr.slice(1).map(a => this.eval(a, env));
      try { return fn(...args); }
      catch (e) { throw new Error(`${head}: ${e.message}`); }
    },

    /* 词法分析 */
    tokenize(src) {
      const out = []; let i = 0;
      while (i < src.length) {
        const c = src[i];
        if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue; }
        if (c === ';') { while (i < src.length && src[i] !== '\n') i++; continue; }
        if (c === '(' || c === ')') { out.push(c); i++; continue; }
        if (c === '"') {
          let s = '"'; i++;
          while (i < src.length && src[i] !== '"') {
            if (src[i] === '\\' && i+1 < src.length) { s += src[i] + src[i+1]; i += 2; }
            else { s += src[i]; i++; }
          }
          s += '"'; i++;
          out.push(s); continue;
        }
        let s = '';
        while (i < src.length && !' \t\n\r()"'.includes(src[i])) { s += src[i++]; }
        out.push(s);
      }
      return out;
    },

    /* S 表达式解析 */
    parse(tokens) {
      let pos = 0;
      const read = () => {
        const t = tokens[pos++];
        if (t === '(') {
          const list = [];
          while (tokens[pos] !== ')') list.push(read());
          pos++;
          return list;
        }
        if (t === ')') throw new Error('多余的 )');
        if (t === undefined) throw new Error('未关闭的 (');
        if (/^-?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
        if (t.startsWith('"')) return t;
        if (t === 't') return true;
        if (t === 'nil') return false;
        return t;
      };
      return read();
    },

    run(src) {
      const env = { ...this.env };
      const results = [];
      const tokens = this.tokenize(src);
      while (pos < tokens.length) {
        if (tokens[pos] === ')') throw new Error('多余的 )');
        const expr = this.parse(tokens);
        try {
          const v = this.eval(expr, env);
          results.push({ ok: true, value: v, expr });
        } catch (e) {
          results.push({ ok: false, error: e.message, expr });
        }
      }
      return results;
    }
  };
  /* 把递归用的 pos 修复：放在 run 内部每次重置 */
  elisp.run = function(src) {
    const env = { ...this.env };
    const results = [];
    const tokens = this.tokenize(src);
    let pos = 0;
    const parse = () => {
      const t = tokens[pos++];
      if (t === '(') {
        const list = [];
        while (tokens[pos] !== ')') {
          if (pos >= tokens.length) throw new Error('未关闭的 (');
          list.push(parse());
        }
        pos++;
        return list;
      }
      if (t === ')') throw new Error('多余的 )');
      if (t === undefined) throw new Error('未关闭的 (');
      if (/^-?\d+(\.\d+)?$/.test(t)) return parseFloat(t);
      if (t.startsWith('"')) return t;
      if (t === 't') return true;
      if (t === 'nil') return false;
      return t;
    };
    while (pos < tokens.length) {
      try {
        const expr = parse();
        const v = this.eval(expr, env);
        results.push({ ok: true, value: v, expr });
      } catch (e) {
        // 跳过错误位置继续
        results.push({ ok: false, error: e.message });
      }
    }
    return results;
  };

  /* 把 S 表达式漂亮地格式化输出 */
  const pretty = (v) => {
    if (v === true) return 't';
    if (v === false) return 'nil';
    if (Array.isArray(v)) {
      if (v.length === 0) return 'nil';
      return '(' + v.map(pretty).join(' ') + ')';
    }
    if (typeof v === 'string') return JSON.stringify(v);
    return String(v);
  };

  /* ============================================================
   * 1. 键盘可视化器 (Day 1)
   * ============================================================ */
  const keyboardHTML = () => `
    <div class="card card--info" style="margin-bottom:8px">
      <div class="card__title">⌨️ 点击任意键 —— 看看它的"新身份"</div>
      <small style="color:var(--fg-mute)">提示：键盘的键同时有"原始身份"和"Emacs 身份"。Mac 与 Windows 改键后如下：</small>
    </div>
    <div class="keyboard" id="keyboard-vis">
      <!-- 主键区第一行 -->
      <div class="keyboard__row">
        <div class="key" data-orig="backtick" data-new="~"><span>~</span></div>
        <div class="key" data-orig="1" data-new="!"><span>1</span></div>
        <div class="key" data-orig="2" data-new="@"><span>2</span></div>
        <div class="key" data-orig="3" data-new="#"><span>3</span></div>
        <div class="key" data-orig="4" data-new="$"><span>4</span></div>
        <div class="key" data-orig="5" data-new="%"><span>5</span></div>
        <div class="key" data-orig="6" data-new="^"><span>6</span></div>
        <div class="key" data-orig="7" data-new="&amp;"><span>7</span></div>
        <div class="key" data-orig="8" data-new="*"><span>8</span></div>
        <div class="key" data-orig="9" data-new="("><span>9</span></div>
        <div class="key" data-orig="0" data-new=")"><span>0</span></div>
        <div class="key" data-orig="-" data-new="_"><span>-</span></div>
        <div class="key" data-orig="=" data-new="+"><span>=</span></div>
        <div class="key wide" data-orig="Backspace"><span>⌫</span></div>
      </div>
      <div class="keyboard__row">
        <div class="key wide" data-orig="Tab"><span>Tab</span></div>
        <div class="key" data-new=""><span>Q</span></div>
        <div class="key" data-new=""><span>W</span></div>
        <div class="key" data-new=""><span>E</span></div>
        <div class="key" data-new=""><span>R</span></div>
        <div class="key" data-new=""><span>T</span></div>
        <div class="key" data-new=""><span>Y</span></div>
        <div class="key" data-new=""><span>U</span></div>
        <div class="key" data-new=""><span>I</span></div>
        <div class="key" data-new=""><span>O</span></div>
        <div class="key" data-new=""><span>P</span></div>
        <div class="key" data-new=""><span>[</span></div>
        <div class="key" data-new=""><span>]</span></div>
        <div class="key wide" data-new="\\"><span>\\</span></div>
      </div>
      <div class="keyboard__row">
        <div class="key xwide" data-orig="Caps" data-new="Ctrl"><span>Caps Lock</span><span class="key__tag">C</span></div>
        <div class="key" data-new=""><span>A</span></div>
        <div class="key" data-new=""><span>S</span></div>
        <div class="key" data-new=""><span>D</span></div>
        <div class="key" data-new=""><span>F</span></div>
        <div class="key" data-new=""><span>G</span></div>
        <div class="key" data-new=""><span>H</span></div>
        <div class="key" data-new=""><span>J</span></div>
        <div class="key" data-new=""><span>K</span></div>
        <div class="key" data-new=""><span>L</span></div>
        <div class="key" data-new=""><span>;</span></div>
        <div class="key" data-new=""><span>'</span></div>
        <div class="key xwide" data-new="Enter"><span>⏎ Enter</span></div>
      </div>
      <div class="keyboard__row">
        <div class="key xwide" data-new="Shift"><span>⇧ Shift</span></div>
        <div class="key" data-new=""><span>Z</span></div>
        <div class="key" data-new=""><span>X</span></div>
        <div class="key" data-new=""><span>C</span></div>
        <div class="key" data-new=""><span>V</span></div>
        <div class="key" data-new=""><span>B</span></div>
        <div class="key" data-new=""><span>N</span></div>
        <div class="key" data-new=""><span>M</span></div>
        <div class="key" data-new=""><span>,</span></div>
        <div class="key" data-new=""><span>.</span></div>
        <div class="key" data-new=""><span>/</span></div>
        <div class="key xwide" data-new="Shift"><span>⇧ Shift</span></div>
      </div>
      <div class="keyboard__row">
        <div class="key wide" data-new="Ctrl"><span>Ctrl</span><span class="key__tag">C</span></div>
        <div class="key wide" data-orig="Win" data-new="Meta"><span>⌘/Win</span><span class="key__tag">M</span></div>
        <div class="key wide" data-orig="Alt" data-new="Super"><span>Alt</span><span class="key__tag">s</span></div>
        <div class="key xwide" data-new="Space"><span>Space</span></div>
        <div class="key wide" data-new="Super"><span>Alt</span><span class="key__tag">s</span></div>
        <div class="key wide" data-new="Meta"><span>Win</span><span class="key__tag">M</span></div>
        <div class="key wide" data-new="Ctrl"><span>Ctrl</span><span class="key__tag">C</span></div>
      </div>
    </div>
    <div class="card card--tip" style="margin-top:8px">
      <small><strong>图例：</strong> <span style="color:var(--accent)">C</span> = Ctrl（建议你用 Caps Lock 改）· <span style="color:var(--accent)">M</span> = Meta（Mac=⌥/Windows=Win 键）· <span style="color:var(--accent)">s</span> = Super（Mac=⌘/Windows=App）</small>
    </div>`;

  /* ============================================================
   * 2. 光标移动演示 (Day 1)
   * ============================================================ */
  const cursorDemoHTML = () => `
    <div class="cursor-demo">
      <div class="cursor-demo__pad" id="cursorPad">The quick brown fox<span class="caret"></span> jumps over the lazy dog.</div>
      <div>
        <div class="cursor-demo__btns">
          <button data-cmd="forward-char" data-name="C-f">C-f 前移</button>
          <button data-cmd="backward-char" data-name="C-b">C-b 后移</button>
          <button data-cmd="previous-line" data-name="C-p">C-p 上一行</button>
          <button data-cmd="next-line" data-name="C-n">C-n 下一行</button>
          <button data-cmd="beginning-of-line" data-name="C-a">C-a 行首</button>
          <button data-cmd="end-of-line" data-name="C-e">C-e 行尾</button>
        </div>
        <p class="cursor-demo__hint">试着连续按 <kbd>C-f</kbd> 看光标一格一格地走。这些命令在 Emacs、Shell、浏览器里都能用。</p>
      </div>
    </div>`;

  /* ============================================================
   * 3. Elisp REPL (Day 3)
   * ============================================================ */
  const replHTML = (id) => `
    <div class="repl" id="${id}">
      <div class="repl__bar">
        <span><span class="dot"></span>Elisp REPL · 教学版</span>
        <button class="repl__run">▶ 运行 (Ctrl + Enter)</button>
      </div>
      <div class="repl__body"></div>
      <textarea class="repl__editor" placeholder="在这里输入 Elisp 代码，按 Ctrl + Enter 求值…
例：(message \"Hello, %s\" \"Emacs\")">(message "Hello, Emacs")
(+ 2 (* 3 4))</textarea>
    </div>`;

  /* ============================================================
   * 4. Macro 展开演示 (Day 8)
   * ============================================================ */
  const macroHTML = () => `
    <div class="macro-demo">
      <div class="card card--info" style="margin-bottom:12px">
        <div class="card__title">宏 = 「生成代码的代码」</div>
        <small>宏不是运行时执行的函数 —— 它在编译期把「输入形式」翻译成「另一种代码」。</small>
      </div>
      <div class="macro-stage">
        <div>
          <small style="color:var(--fg-mute)">原始形式</small>
          <pre class="code" data-lang="elisp"><span class="c-comment">;; inc 是一个宏</span>
<span class="c-keyword">(inc</span> my-var<span class="c-keyword">)</span></pre>
        </div>
        <div class="macro-arrow">⟶<br><small style="font-size:.5em">macroexpand</small></div>
        <div>
          <small style="color:var(--fg-mute)">展开后</small>
          <pre class="code" data-lang="elisp"><span class="c-comment">;; 真正执行的代码</span>
<span class="c-keyword">(setq</span> my-var
      <span class="c-keyword">(</span><span class="c-fn">1+</span> my-var<span class="c-keyword">)</span><span class="c-keyword">)</span></pre>
        </div>
      </div>
      <details class="fold" style="margin-top:14px">
        <summary>展开 inc 宏的定义</summary>
        <pre class="code" data-lang="elisp"><span class="c-keyword">(defmacro</span> <span class="c-fn">inc</span> (var)
  <span class="c-keyword">(</span><span class="c-fn">list</span> 'setq var
        <span class="c-keyword">(</span><span class="c-fn">list</span> '1+ var<span class="c-keyword">)</span><span class="c-keyword">)</span><span class="c-keyword">)</span></pre>
        <p>展开过程：</p>
        <ol class="macro-step-list">
          <li><span class="step-kw">宏定义</span>接受 <span class="step-lit">var</span>（这里是 <span class="step-lit">my-var</span>）</li>
          <li><span class="step-fn">list</span> 把符号拼接成 <span class="step-lit">'setq</span>、<span class="step-lit">my-var</span>、<span class="step-lit">'(1+ my-var)</span></li>
          <li>结果：<span class="step-lit">(setq my-var (1+ my-var))</span></li>
          <li>Elisp 再求值这段新代码 —— my-var 自增 1</li>
        </ol>
      </details>
    </div>`;

  /* ============================================================
   * 5. Org TODO 状态机 (Day 10)
   * ============================================================ */
  const todoHTML = () => {
    const cols = [
      { key: 'TODO',      title: 'TODO',      desc: '待办' },
      { key: 'STARTED',   title: 'STARTED',   desc: '已开始' },
      { key: 'WAITING',   title: 'WAITING',   desc: '等待' },
      { key: 'DONE',      title: 'DONE',      desc: '完成' },
      { key: 'CANCELLED', title: 'CANCELLED', desc: '取消' }
    ];
    const seed = [
      { text: '学习 Day 10', state: 'DONE' },
      { text: '配置 org-todo-keywords', state: 'DONE' },
      { text: '写一篇博客', state: 'STARTED' },
      { text: '阅读 Elisp 文档', state: 'WAITING' },
      { text: '试用 agenda 视图', state: 'TODO' },
      { text: '设置 capture 模板', state: 'TODO' }
    ];
    return `
      <div class="card card--info" style="margin-bottom:10px">
        <div class="card__title">📌 Org TODO 状态机</div>
        <small>点下方按钮看条目如何在状态之间流转。在真实 Emacs 里用 <kbd>C-c C-t</kbd> 触发。</small>
      </div>
      <div class="todo-board" id="todoBoard">
        ${cols.map(c => `
          <div class="todo-col" data-state="${c.key}">
            <div class="todo-col__title">${c.title}</div>
            <div class="todo-list" data-state="${c.key}">
              ${seed.filter(s => s.state === c.key).map(s => `<div class="todo-item t-${s.state}" draggable="true">${s.text}</div>`).join('')}
            </div>
          </div>`).join('')}
      </div>
      <div class="todo-actions">
        <button data-action="next">下一状态 (C-c C-t →)</button>
        <button data-action="prev">← 上一状态</button>
        <button data-action="reset">重置</button>
      </div>`;
  };

  /* ============================================================
   * 6. Evil 状态机 (Day 13)
   * ============================================================ */
  const evilHTML = () => `
    <div class="evil-stage" id="evilStage">
      <div class="evil-bar is-N">
        <span class="dot"></span>
        <span>当前状态：</span>
        <span class="evil-state-name">Normal</span>
        <span class="evil-state-desc">默认状态 —— 移动光标、执行操作</span>
      </div>
      <div class="evil-pad" contenteditable="true" id="evilPad">试着编辑这段文字
按 i 进入插入模式，按 Esc 退回 Normal
在 Normal 下按 v 进入 Visual，选中文本
按 : 进入命令行，可以输入 wq 退出</div>
      <div class="evil-keys">
        <span><b>i</b> → Insert</span>
        <span><b>Esc</b> → Normal</span>
        <span><b>v</b> → Visual</span>
        <span><b>C-z</b> → Emacs</span>
        <span><b>R</b> → Replace</span>
        <span style="margin-left:auto;color:var(--fg-mute)">提示：点上面的文字让 pad 获得焦点</span>
      </div>
    </div>`;

  /* ============================================================
   * 7. Roam 节点图 (Day 19)
   * ============================================================ */
  const roamHTML = () => {
    const nodes = [
      { id: 'emacs',     title: 'Emacs',         tags: ['编辑器'], link: ['org-mode','evil','magit','lsp'] },
      { id: 'org-mode',  title: 'Org Mode',      tags: ['笔记','GTD'], link: ['agenda','capture','roam','babel'] },
      { id: 'evil',      title: 'Evil',          tags: ['vim'], link: ['emacs'] },
      { id: 'magit',     title: 'Magit',         tags: ['git'], link: ['emacs'] },
      { id: 'lsp',       title: 'LSP',           tags: ['编程'], link: ['eglot','emacs'] },
      { id: 'eglot',     title: 'Eglot',         tags: ['lsp','编程'], link: ['lsp'] },
      { id: 'elisp',     title: 'Elisp',         tags: ['语言'], link: ['macro','emacs','use-package'] },
      { id: 'macro',     title: '宏 (Macro)',    tags: ['elisp'], link: ['elisp'] },
      { id: 'use-package', title: 'use-package', tags: ['elisp','配置'], link: ['elisp'] },
      { id: 'agenda',    title: 'Agenda',        tags: ['org-mode','GTD'], link: ['org-mode','capture'] },
      { id: 'capture',   title: 'Capture',       tags: ['org-mode','GTD'], link: ['org-mode','agenda'] },
      { id: 'roam',      title: 'Org Roam',      tags: ['笔记','双链'], link: ['org-mode'] },
      { id: 'babel',     title: 'Babel',         tags: ['文学编程'], link: ['org-mode'] }
    ];
    return `
      <div class="card card--info" style="margin-bottom:10px">
        <div class="card__title">🕸 Org Roam 知识图谱</div>
        <small>点列表里的节点，右边的图会高亮它的连接。</small>
      </div>
      <div class="roam">
        <div class="roam-list">
          ${nodes.map((n, i) => `<a class="roam-node ${i===0?'active':''}" data-id="${n.id}">
            <div class="roam-node__title">${n.title}</div>
            <div class="roam-node__tags">${n.tags.map(t=>'#'+t).join(' ')}</div>
          </a>`).join('')}
        </div>
        <div class="roam-graph"><canvas id="roamCanvas"></canvas></div>
      </div>`;
  };

  /* ============================================================
   * 行为绑定（每个组件注入 HTML 后要被绑定事件）
   * ============================================================ */

  function bindKeyboard(root) {
    const keys = root.querySelectorAll('.key');
    keys.forEach(k => {
      k.addEventListener('click', () => {
        keys.forEach(x => x.classList.remove('highlight'));
        k.classList.add('highlight');
        const orig = k.dataset.orig;
        const next = k.dataset.new;
        const label = orig ? `原: ${orig} → 新身份: ${next || '—'}` : `这是普通字母键`;
        Components.toast(label);
      });
    });
  }

  function bindCursor(root) {
    const pad = root.querySelector('#cursorPad');
    const caret = pad.querySelector('.caret');
    let text = pad.textContent.replace(/\u200B/g, '');  // 移除 caret
    let pos = text.indexOf('fox') + 3; // 初始光标在 fox 之后
    const render = () => {
      pad.innerHTML = '';
      pad.appendChild(document.createTextNode(text.slice(0, pos)));
      const c = document.createElement('span'); c.className = 'caret';
      pad.appendChild(c);
      pad.appendChild(document.createTextNode(text.slice(pos)));
    };
    root.querySelectorAll('.cursor-demo__btns button').forEach(b => {
      b.addEventListener('click', () => {
        const cmd = b.dataset.cmd;
        if (cmd === 'forward-char')      pos = Math.min(text.length, pos + 1);
        else if (cmd === 'backward-char') pos = Math.max(0, pos - 1);
        else if (cmd === 'beginning-of-line') {
          // 找到当前行起点
          const before = text.slice(0, pos);
          const lastNl = before.lastIndexOf('\n');
          pos = lastNl === -1 ? 0 : lastNl + 1;
        }
        else if (cmd === 'end-of-line') {
          const nl = text.indexOf('\n', pos);
          pos = nl === -1 ? text.length : nl;
        }
        else if (cmd === 'previous-line') {
          const before = text.slice(0, pos);
          const lastNl = before.lastIndexOf('\n');
          if (lastNl <= 0) return;
          const prevLast = before.lastIndexOf('\n', lastNl - 1);
          pos = prevLast + (pos - lastNl);
        }
        else if (cmd === 'next-line') {
          const nl = text.indexOf('\n', pos);
          if (nl === -1) return;
          const nextNl = text.indexOf('\n', nl + 1);
          const end = nextNl === -1 ? text.length : nextNl;
          const colLen = pos - (text.lastIndexOf('\n', pos - 1) + 1);
          pos = Math.min(nl + 1 + colLen, end);
        }
        render();
      });
    });
    render();
  }

  function bindRepl(root) {
    const editor = root.querySelector('.repl__editor');
    const body = root.querySelector('.repl__body');
    const run = () => {
      const src = editor.value;
      if (!src.trim()) return;
      const srcLine = src.replace(/\n/g, '↵ ');
      const inLine = document.createElement('span');
      inLine.className = 'repl__line repl__in';
      inLine.textContent = srcLine;
      body.appendChild(inLine);
      const results = elisp.run(src);
      results.forEach(r => {
        const line = document.createElement('span');
        line.className = 'repl__line ' + (r.ok ? 'repl__out' : 'repl__err');
        line.textContent = r.ok ? pretty(r.value) : r.error;
        body.appendChild(line);
      });
      body.scrollTop = body.scrollHeight;
      editor.value = '';
    };
    root.querySelector('.repl__run').addEventListener('click', run);
    editor.addEventListener('keydown', e => {
      if (e.ctrlKey && e.key === 'Enter') { e.preventDefault(); run(); }
    });
  }

  function bindMacro(root) {
    // 仅展示用 —— 不需要额外行为
  }

  function bindTodo(root) {
    let order = ['TODO', 'STARTED', 'WAITING', 'DONE', 'CANCELLED'];
    let selected = null;
    const items = () => Array.from(root.querySelectorAll('.todo-item'));
    const select = (el) => {
      items().forEach(x => x.style.outline = '');
      selected = el; if (el) el.style.outline = '2px solid var(--accent)';
    };
    root.querySelectorAll('.todo-item').forEach(el => {
      el.addEventListener('click', () => select(el));
    });
    root.querySelectorAll('.todo-actions button').forEach(b => {
      b.addEventListener('click', () => {
        if (!selected) { Components.toast('先点一个条目'); return; }
        const cur = order.indexOf(selected.classList[1].slice(2));
        let next = cur;
        if (b.dataset.action === 'next') next = (cur + 1) % order.length;
        else if (b.dataset.action === 'prev') next = (cur - 1 + order.length) % order.length;
        else if (b.dataset.action === 'reset') {
          items().forEach((it, i) => {
            it.className = 'todo-item t-' + ['TODO','STARTED','WAITING','DONE','TODO'][i % 5];
            const col = root.querySelector(`.todo-list[data-state="${it.classList[1].slice(2)}"]`);
            if (col) col.appendChild(it);
          });
          select(null);
          return;
        }
        const newState = order[next];
        selected.className = 'todo-item t-' + newState;
        const col = root.querySelector(`.todo-list[data-state="${newState}"]`);
        if (col) col.appendChild(selected);
        select(selected);
      });
    });
  }

  function bindEvil(root) {
    const pad = root.querySelector('#evilPad');
    const bar = root.querySelector('.evil-bar');
    const nameEl = bar.querySelector('.evil-state-name');
    const descEl = bar.querySelector('.evil-state-desc');
    const STATES = {
      N: { name: 'Normal',  desc: '默认状态 —— 移动光标、执行操作', color: 'var(--accent-3)' },
      I: { name: 'Insert',  desc: '输入文字 —— 像普通编辑器',     color: 'var(--accent-5)' },
      V: { name: 'Visual',  desc: '选中文本区域 —— y 复制 / d 剪切', color: 'var(--accent-4)' },
      E: { name: 'Emacs',   desc: '退回 Emacs 原生按键',           color: 'var(--accent-2)' },
      R: { name: 'Replace', desc: '覆盖式输入（覆盖而非插入）',     color: 'var(--accent)' }
    };
    const set = (k) => {
      bar.className = 'evil-bar is-' + k;
      nameEl.textContent = STATES[k].name;
      descEl.textContent = STATES[k].desc;
    };
    pad.addEventListener('keydown', e => {
      const isIns = bar.classList.contains('is-I');
      if (isIns && e.key === 'Escape') { e.preventDefault(); set('N'); return; }
      if (isIns) return; // 在 Insert 中所有按键都插入
      if (e.key === 'i') { e.preventDefault(); set('I'); return; }
      if (e.key === 'v') { e.preventDefault(); set('V'); return; }
      if (e.key === 'R') { e.preventDefault(); set('R'); return; }
      if (e.key === 'C-z') { e.preventDefault(); set('E'); return; }
      // 普通模式下其它键被吞掉（不让它插入字符）
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) e.preventDefault();
    });
    pad.addEventListener('focus', () => set('N'));
    pad.addEventListener('click', () => set('N'));
  }

  function bindRoam(root) {
    const nodes = [
      { id: 'emacs',     title: 'Emacs',         x: 400, y: 250, r: 26, link: ['org-mode','evil','magit','lsp','elisp'] },
      { id: 'org-mode',  title: 'Org Mode',      x: 250, y: 120, r: 24, link: ['agenda','capture','roam','babel'] },
      { id: 'evil',      title: 'Evil',          x: 580, y: 130, r: 18, link: ['emacs'] },
      { id: 'magit',     title: 'Magit',         x: 640, y: 350, r: 18, link: ['emacs'] },
      { id: 'lsp',       title: 'LSP',           x: 560, y: 250, r: 18, link: ['eglot','emacs'] },
      { id: 'eglot',     title: 'Eglot',         x: 700, y: 250, r: 16, link: ['lsp'] },
      { id: 'elisp',     title: 'Elisp',         x: 220, y: 380, r: 22, link: ['macro','emacs','use-package'] },
      { id: 'macro',     title: '宏 (Macro)',    x: 100, y: 460, r: 16, link: ['elisp'] },
      { id: 'use-package', title: 'use-package', x: 320, y: 470, r: 18, link: ['elisp'] },
      { id: 'agenda',    title: 'Agenda',        x: 120, y: 90,  r: 16, link: ['org-mode','capture'] },
      { id: 'capture',   title: 'Capture',       x: 220, y: 30,  r: 16, link: ['org-mode','agenda'] },
      { id: 'roam',      title: 'Org Roam',      x: 400, y: 30,  r: 18, link: ['org-mode'] },
      { id: 'babel',     title: 'Babel',         x: 450, y: 110, r: 16, link: ['org-mode'] }
    ];
    const map = Object.fromEntries(nodes.map(n => [n.id, n]));
    const canvas = root.querySelector('#roamCanvas');
    const ctx = canvas.getContext('2d');
    const fit = () => {
      const rect = canvas.parentNode.getBoundingClientRect();
      canvas.width = rect.width * devicePixelRatio;
      canvas.height = rect.height * devicePixelRatio;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    fit();
    window.addEventListener('resize', () => { fit(); draw(); });

    let activeId = 'emacs';
    let t0 = Date.now();

    const draw = () => {
      const w = canvas.width / devicePixelRatio;
      const h = canvas.height / devicePixelRatio;
      ctx.clearRect(0, 0, w, h);
      // 网格底纹
      ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg-code');
      ctx.fillRect(0, 0, w, h);

      // 连线
      nodes.forEach(n => n.link.forEach(t => {
        const target = map[t]; if (!target) return;
        const isActive = (n.id === activeId || target.id === activeId);
        ctx.strokeStyle = isActive ? 'rgba(124,92,255,0.7)' : 'rgba(124,124,140,0.18)';
        ctx.lineWidth = isActive ? 1.6 : 1;
        ctx.beginPath();
        ctx.moveTo(n.x, n.y);
        ctx.lineTo(target.x, target.y);
        ctx.stroke();
      }));

      // 节点
      const pulse = 1 + Math.sin((Date.now() - t0) / 300) * 0.06;
      nodes.forEach(n => {
        const isActive = (n.id === activeId);
        const isNeighbour = (() => {
          if (!isActive) return false;
          const me = map[activeId];
          return me && me.link.includes(n.id);
        })();
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r * (isActive ? pulse : 1), 0, Math.PI * 2);
        ctx.fillStyle = isActive ? '#7c5cff'
          : isNeighbour ? 'rgba(124,92,255,0.55)'
          : '#3b3949';
        ctx.fill();
        ctx.lineWidth = isActive ? 2.5 : 1;
        ctx.strokeStyle = isActive ? '#fff' : 'rgba(255,255,255,0.15)';
        ctx.stroke();

        // 文字
        ctx.fillStyle = isActive ? '#fff' : '#b9b6c8';
        ctx.font = `${isActive ? 'bold ' : ''}12px -apple-system, sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(n.title, n.x, n.y - n.r - 6);
      });
    };

    let raf;
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    loop();

    root.querySelectorAll('.roam-node').forEach(el => {
      el.addEventListener('click', e => {
        e.preventDefault();
        root.querySelectorAll('.roam-node').forEach(x => x.classList.remove('active'));
        el.classList.add('active');
        activeId = el.dataset.id;
      });
    });
  }

  /* ============================================================
   * 简单 toast
   * ============================================================ */
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  /* ============================================================
   * 代码块语法高亮（极简版）
   * ============================================================ */
  function highlightElisp(code) {
    // 1) 字符串
    let s = code.replace(/(\"[^\"\\]*(?:\\.[^\"\\]*)*\")/g, '<span class="c-string">$1</span>');
    // 2) 注释
    s = s.replace(/(;.*$)/gm, '<span class="c-comment">$1</span>');
    // 3) 关键字 / 函数名
    const kw = ['defun','defmacro','setq','setq-default','let','if','cond','lambda','quote','progn','when','unless','interactive','global-set-key','add-hook','use-package','require','provide','load-path','defvar','defcustom','after-init-hook','after-init','package-install','add-to-list','message','format','mapconcat','read-from-minibuffer'];
    kw.forEach(k => {
      const re = new RegExp('\\b(' + k + ')\\b', 'g');
      s = s.replace(re, '<span class="c-keyword">$1</span>');
    });
    // 4) 数字
    s = s.replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="c-num">$1</span>');
    // 5) ( ' + 名字) 视为函数调用
    s = s.replace(/\((\s*)([a-zA-Z][\w-]*(?:-\w+)*)/g, '($1<span class="c-fn">$2</span>');
    return s;
  }

  function highlightOrg(code) {
    let s = code.replace(/(^\*+\s.*$)/gm, '<span class="c-keyword">$1</span>');
    s = s.replace(/(^#\+.*$)/gm, '<span class="c-comment">$1</span>');
    s = s.replace(/\b(TODO|DONE|SCHEDULED|DEADLINE)\b/g, '<span class="c-fn">$1</span>');
    s = s.replace(/(:PROPERTIES:|:END:|:LOGBOOK:)/g, '<span class="c-var">$1</span>');
    return s;
  }

  function highlightGeneric(code, lang) {
    if (lang === 'elisp' || lang === 'lisp') return highlightElisp(code);
    if (lang === 'org') return highlightOrg(code);
    if (lang === 'bash' || lang === 'shell') {
      let s = code.replace(/(^#.*$)/gm, '<span class="c-comment">$1</span>');
      s = s.replace(/\b(pacman|git|brew|choco|mv|cp|cd|ls|make|gcc|g\+\+|clang|gdb)\b/g, '<span class="c-fn">$1</span>');
      return s;
    }
    return code
      .replace(/(#.*$)/gm, '<span class="c-comment">$1</span>')
      .replace(/(\"[^\"]*\")/g, '<span class="c-string">$1</span>');
  }

  /* ============================================================
   * 注册所有组件
   * ============================================================ */
  return {
    map: {
      'key-vis':      { html: keyboardHTML, bind: bindKeyboard },
      'cursor-demo':  { html: cursorDemoHTML, bind: bindCursor },
      'elisp-repl':   { html: () => replHTML('repl-' + Date.now()), bind: bindRepl },
      'macro-demo':   { html: macroHTML, bind: bindMacro },
      'todo-board':   { html: todoHTML, bind: bindTodo },
      'evil-stage':   { html: evilHTML, bind: bindEvil },
      'roam-graph':   { html: roamHTML, bind: bindRoam }
    },
    highlight: highlightGeneric,
    toast
  };
})();