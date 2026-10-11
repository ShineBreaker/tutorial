/**
 * main.js · 应用骨架：hash 路由 + 章节渲染 + 学习进度
 *
 * 本文件自身也是一个学习样本，它演示：
 *   - ES Modules 组织一个无框架单页应用
 *   - hash 路由（#/ch01）+ hashchange 监听
 *   - 动态 import 按需加载重组件（模拟器）
 *   - localStorage 存学习进度
 */
import { chapters } from './chapters/index.js'
import { highlight, highlightLines, escapeHtml } from './highlight.js'
import { REAL_SOURCES } from './real-sources.js'

/* ---------- 学习进度（localStorage） ---------- */

const PROGRESS_KEY = 'agent-tutorial-progress'

function loadProgress() {
  try {
    return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function saveProgress(done) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...done]))
}

const done = loadProgress()

/* ---------- 侧栏导航 ---------- */

const navEl = document.getElementById('chapter-nav')
const contentEl = document.getElementById('content')

function renderNav(currentId) {
  navEl.textContent = ''
  for (const ch of chapters) {
    const a = document.createElement('a')
    a.className = 'nav-item'
      + (ch.id === currentId ? ' active' : '')
      + (done.has(ch.id) ? ' done' : '')
    a.href = `#/${ch.id}`
    a.innerHTML = `<span class="num">${ch.num}</span><span>${ch.title}</span>`
    navEl.append(a)
  }
}

/* ---------- 各类内容块的渲染 ---------- */

function el(tag, className, html) {
  const node = document.createElement(tag)
  if (className) node.className = className
  if (html !== undefined) node.innerHTML = html
  return node
}

/** 代码卡片：路径行号 + 标题 + 复制按钮 + 高亮正文 + 知识点标签 */
function renderCode(section) {
  const card = el('div', 'code-card')
  const head = el('div', 'code-head')

  const file = el('span', 'code-file', `📄 <span class="path">${escapeHtml(section.path)}</span>`)
  const title = el('span', 'code-title', escapeHtml(section.title))
  const btn = el('button', 'copy-btn', '复制')
  btn.type = 'button'
  btn.addEventListener('click', () => copyText(btn, section.code))

  // 引用了真实源码（REAL_SOURCES 按 path 原文索引）才给「查看真实源码」入口
  const src = REAL_SOURCES[section.path]
  if (src) {
    const srcBtn = el('button', 'src-btn', '查看真实源码 ↗')
    srcBtn.type = 'button'
    srcBtn.addEventListener('click', () => openSourceModal(src, srcBtn))
    head.append(file, title, srcBtn, btn)
  } else {
    head.append(file, title, btn)
  }
  if (section.note) {
    head.append(el('div', 'code-note', `💡 ${escapeHtml(section.note)}`))
  }

  const pre = el('pre', 'code-body')
  pre.innerHTML = highlight(section.code)

  card.append(head, pre)

  if (section.lessons?.length) {
    card.append(el('div', 'lessons', section.lessons.map((l) => `<span class="lesson-tag">${escapeHtml(l)}</span>`).join('')))
  }
  return card
}

/** 自测题：点击选项即判分，展示解释 */
function renderQuiz(section) {
  const box = el('div', 'quiz')
  box.append(el('p', 'quiz-q', `❓ ${section.q}`))
  const opts = el('div', 'quiz-opts')
  const explain = el('div', 'quiz-explain', `解析：${section.explain}`)

  section.options.forEach((opt, i) => {
    const b = el('button', 'quiz-opt', opt)
    b.type = 'button'
    b.addEventListener('click', () => {
      // 已答过的题锁定
      if (opts.dataset.answered) return
      opts.dataset.answered = '1'
      if (i === section.answer) b.classList.add('correct')
      else b.classList.add('wrong')
      // 把正确项也标出来
      opts.children[section.answer].classList.add('correct')
      explain.classList.add('show')
    })
    opts.append(b)
  })

  box.append(opts, explain)
  return box
}

/** 流程步骤图 */
function renderFlow(section) {
  const flow = el('div', 'flow')
  for (const s of section.steps) {
    flow.append(el('div', `flow-step${s.hi ? ' loop-hi' : ''}`, `<b>${s.title}</b>${escapeHtml(s.desc)}`))
  }
  return flow
}

/** 模拟器：动态 import，演示「重组件按需加载」 */
async function renderSim(container) {
  const { createSim } = await import('./sim/agent-sim.js')
  container.textContent = '' // 模块到位，撤掉加载占位
  const mount = el('div')
  container.append(mount)
  createSim(mount)
}

/* ---------- 「查看真实源码」悬浮窗 ----------
 * 数据来自 real-sources.js（按 path 原文索引）。两种展示模式：
 *   excerpt · 带行号区间的片段，focus 行高亮
 *   outline · 引用没给行号，退化为文件声明骨架
 */

let srcOverlay = null

function closeSourceModal() {
  if (!srcOverlay) return
  const returnTo = srcOverlay._returnTo
  srcOverlay.remove()
  srcOverlay = null
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onSrcOverlayKeydown)
  returnTo?.focus() // 焦点还给触发按钮
}

function onSrcOverlayKeydown(e) {
  if (e.key === 'Escape') closeSourceModal()
}

function openSourceModal(entry, invoker) {
  closeSourceModal() // 已经开着就先关掉，保证全局只有一个

  const focusLine = entry.mode === 'excerpt'
    ? entry.excerpts[0].focus
    : entry.outline[0].n
  const emacsCmd = `emacsclient -n +${focusLine} ${entry.abs}`

  const overlay = el('div', 'src-overlay')
  overlay._returnTo = invoker
  const dialog = el('div', 'src-dialog')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.setAttribute('aria-label', `${entry.file} 真实源码`)

  // 标题栏：文件名 + 行号区间 + 关闭
  const range = entry.mode === 'excerpt'
    ? entry.excerpts.map((x) => `第 ${x.start}-${x.end} 行`).join('、')
    : '文件骨架'
  const head = el('div', 'src-dialog-head', `<span class="src-name">${escapeHtml(entry.file)} · ${range}</span>`)
  const closeBtn = el('button', 'src-close', '×')
  closeBtn.type = 'button'
  closeBtn.setAttribute('aria-label', '关闭')
  closeBtn.addEventListener('click', closeSourceModal)
  head.append(closeBtn)
  dialog.append(head)

  // 路径行：绝对路径 + 复制路径 + 复制 Emacs 跳转命令
  const pathRow = el('div', 'src-path-row')
  pathRow.append(el('code', 'src-abs', entry.abs))
  const copyPath = el('button', 'src-mini-btn', '复制路径')
  copyPath.type = 'button'
  copyPath.addEventListener('click', () => copyText(copyPath, entry.abs))
  const copyCmd = el('button', 'src-mini-btn', '复制 Emacs 命令')
  copyCmd.type = 'button'
  copyCmd.addEventListener('click', () => copyText(copyCmd, emacsCmd))
  pathRow.append(copyPath, copyCmd)
  dialog.append(pathRow)

  // 正文：行号槽（sticky）+ 逐行高亮的代码
  const body = el('div', 'src-body')
  if (entry.mode === 'outline') {
    body.append(el('p', 'src-hint', '这个引用没有指定行号。下面是该文件的顶层声明，行号可直接用于跳转：'))
    const view = el('div', 'src-view')
    for (const sig of entry.outline) {
      view.append(el('div', 'src-line',
        `<span class="src-ln">${sig.n}</span><span class="src-code">${highlight(sig.code)}</span>`))
    }
    body.append(view)
  } else {
    for (const x of entry.excerpts) {
      body.append(el('div', 'src-cap', `第 ${x.start}-${x.end} 行`))
      const view = el('div', 'src-view')
      const lines = highlightLines(x.code)
      for (let i = 0; i < lines.length; i++) {
        const n = x.start + i
        view.append(el('div', `src-line${n === x.focus ? ' hl' : ''}`,
          `<span class="src-ln">${n}</span><span class="src-code">${lines[i]}</span>`))
      }
      body.append(view)
    }
  }
  dialog.append(body)

  dialog.append(el('div', 'src-foot',
    `在 Emacs 中打开（server 在运行时立即跳转）：<code>${escapeHtml(emacsCmd)}</code>`))

  overlay.append(dialog)
  // 只有点背景本身才关；对话框内部的点击不冒泡出去
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeSourceModal()
  })
  document.body.append(overlay)
  document.body.style.overflow = 'hidden' // 锁住底层页面滚动
  document.addEventListener('keydown', onSrcOverlayKeydown)
  srcOverlay = overlay
  closeBtn.focus()
}

/** 复制文本，按钮短暂反馈「已复制 ✓」，代码卡片和悬浮窗共用 */
async function copyText(btn, text) {
  await navigator.clipboard.writeText(text)
  const old = btn.textContent
  btn.textContent = '已复制 ✓'
  setTimeout(() => (btn.textContent = old), 1400)
}

/* ---------- 章节渲染 ---------- */

function renderChapter(ch) {
  contentEl.textContent = ''

  const head = el('header', 'chapter-head')
  head.append(el('div', 'chapter-eyebrow', `第 ${ch.num} 章`))
  head.append(el('h1', null, ch.title))
  head.append(el('p', 'chapter-sub', ch.subtitle))
  head.append(el('div', 'chapter-meta', `<span>⏱ 约 ${ch.minutes} 分钟</span><span>✓ 读完自动标记</span>`))
  contentEl.append(head)

  const prose = el('article', 'prose')
  contentEl.append(prose)

  for (const section of ch.sections) {
    switch (section.type) {
      case 'prose':
        prose.append(el('div', null, section.html))
        break
      case 'h2':
        prose.append(el('h2', null, section.text))
        break
      case 'callout':
        prose.append(el('div', `callout ${section.tone}`, `<div class="callout-title">${section.title}</div>${section.html}`))
        break
      case 'code':
        prose.append(renderCode(section))
        break
      case 'flow':
        prose.append(renderFlow(section))
        break
      case 'quiz':
        prose.append(renderQuiz(section))
        break
      case 'sim': {
        const placeholder = el('div', null, '<p style="color:var(--text-dim);font-size:13px">⏳ 模拟器加载中…</p>')
        prose.append(placeholder)
        renderSim(placeholder)
        break
      }
    }
  }

  // 翻页
  const idx = chapters.indexOf(ch)
  const prev = chapters[idx - 1]
  const next = chapters[idx + 1]
  const pager = el('nav', 'pager')
  if (prev) {
    pager.append(el('a', null, `<span class="dir">← 上一章</span><span class="dest">${prev.num}. ${prev.title}</span>`))
    pager.lastChild.href = `#/${prev.id}`
  }
  if (next) {
    pager.append(el('a', 'next', `<span class="dir">下一章 →</span><span class="dest">${next.num}. ${next.title}</span>`))
    pager.lastChild.href = `#/${next.id}`
  }
  prose.append(pager)

  done.add(ch.id)
  saveProgress(done)
  renderNav(ch.id)
  window.scrollTo({ top: 0 })
  contentEl.focus({ preventScroll: true })
}

/* ---------- hash 路由 ---------- */

function currentChapterFromHash() {
  const id = location.hash.replace(/^#\//, '')
  return chapters.find((c) => c.id === id) ?? chapters[0]
}

function route() {
  renderChapter(currentChapterFromHash())
}

document.getElementById('reset-progress').addEventListener('click', () => {
  done.clear()
  saveProgress(done)
  route()
})

window.addEventListener('hashchange', route)
route()
