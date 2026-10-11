/**
 * highlight.js · 一个约 80 行的极简代码高亮器
 *
 * 这也是教学素材之一！它演示了：
 *   1. 用「单个大正则 + 命名捕获组」做一次扫描的 token 化思路
 *   2. matchAll 的用法（返回迭代器，需要 /g 标志）
 *   3. 为什么必须「先转义、再包标签」：转义发生在每个 token 内部，
 *      标签永远不会被二次转义，天然防 XSS
 *
 * 支持 TS/JS 的常见成分：注释、字符串、关键字、数字、函数调用、类型名。
 * 不追求覆盖所有语法（比如模板串里的 ${} 不单独高亮），教学足够用。
 */

const KEYWORDS = new Set([
  // JS
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while',
  'do', 'switch', 'case', 'break', 'continue', 'new', 'class', 'extends',
  'super', 'this', 'typeof', 'instanceof', 'in', 'of', 'await', 'async',
  'yield', 'try', 'catch', 'finally', 'throw', 'import', 'export', 'from',
  'default', 'true', 'false', 'null', 'undefined', 'void', 'delete',
  'static', 'get', 'set',
  // TS
  'type', 'interface', 'enum', 'implements', 'readonly', 'public', 'private',
  'protected', 'declare', 'as', 'satisfies', 'keyof', 'infer', 'abstract',
  'never', 'unknown', 'any', 'string', 'number', 'boolean', 'object',
  'symbol', 'bigint',
])

// 内建类型/构造器，按「类型」上色而不是关键字
const BUILTINS = new Set([
  'Promise', 'Array', 'Map', 'Set', 'Error', 'JSON', 'Math', 'Object',
  'String', 'Number', 'Boolean', 'Date', 'RegExp', 'Set',
])

/** HTML 转义：所有输出文本都要先经过这里 */
export function escapeHtml(s) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

/**
 * 把一段源码变成带 <span class="tok-*"> 的 HTML。
 * 思路：一个大正则只负责「找到可能有颜色的 token」，剩下的都是普通文本。
 */
export function highlight(code) {
  const tokenRe =
    /(\/\*[\s\S]*?\*\/|\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b\d[\w.]*)|\b([A-Za-z_$][\w$]*)\b/g

  let out = ''
  let last = 0 // 上一段「普通文本」的结束位置

  for (const m of code.matchAll(tokenRe)) {
    // match 之前的普通文本：原样转义，不上色
    out += escapeHtml(code.slice(last, m.index))
    last = m.index + m[0].length

    const [raw, comment, str, num, ident] = m
    if (comment) {
      out += `<span class="tok-com">${escapeHtml(raw)}</span>`
    } else if (str) {
      out += `<span class="tok-str">${escapeHtml(raw)}</span>`
    } else if (num) {
      out += `<span class="tok-num">${escapeHtml(raw)}</span>`
    } else if (ident) {
      out += classifyIdentifier(code, last, ident)
    }
  }
  // 收尾：最后一个 token 之后可能还有文本
  out += escapeHtml(code.slice(last))
  return out
}

/**
 * 逐行高亮：返回和 code.split('\n') 等长的 HTML 数组。
 * 为什么需要它：「查看真实源码」悬浮窗每行都要包一个行号，必须按行切开；
 * 而块注释可能跨行，直接按行调用 highlight() 会让第二行之后的注释褪色。
 * 所以先把所有块注释的字符区间找出来，逐行判断交集，落在区间里的部分
 * 按注释上色，剩下的交给 highlight()。
 */
export function highlightLines(code) {
  const commentSpans = [...code.matchAll(/\/\*[\s\S]*?\*\//g)].map(
    (m) => [m.index, m.index + m[0].length],
  )
  const out = []
  let offset = 0
  for (const line of code.split('\n')) {
    const start = offset
    const end = start + line.length
    offset = end + 1 // +1 是换行符

    let html = ''
    let cursor = start
    for (const [cs, ce] of commentSpans) {
      if (ce <= start || cs >= end) continue // 这个注释和本行无交集
      if (cs > cursor) html += highlight(code.slice(cursor, cs)) // 注释前的普通代码
      html += `<span class="tok-com">${escapeHtml(code.slice(Math.max(cs, cursor), Math.min(ce, end)))}</span>`
      cursor = Math.min(ce, end)
    }
    if (cursor < end) html += highlight(code.slice(cursor, end))
    out.push(html)
  }
  return out
}

/** 给一个标识符定色：关键字 / 内建类型 / 函数调用 / 大写开头的类型 / 普通 */
function classifyIdentifier(code, afterPos, ident) {
  const escaped = escapeHtml(ident)
  if (KEYWORDS.has(ident)) return `<span class="tok-kw">${escaped}</span>`
  if (BUILTINS.has(ident)) return `<span class="tok-ty">${escaped}</span>`
  // 标识符后面紧跟 "("，它是函数名（定义或调用）
  if (code.slice(afterPos).match(/^\s*\(/)) {
    return `<span class="tok-fn">${escaped}</span>`
  }
  // 大写开头，通常是类型名或类名
  if (/^[A-Z]/.test(ident)) return `<span class="tok-ty">${escaped}</span>`
  return escaped
}
