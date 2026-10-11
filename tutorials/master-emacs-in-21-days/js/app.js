/* ============================================================
 * 主入口：渲染内容 + 进度跟踪 + 主题切换 + 搜索 + glossary
 * ============================================================ */
(() => {
'use strict';

const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

/* ---------- 渲染 21 天 ---------- */
function renderDays() {
  const main = $('#main');
  main.innerHTML = window.DAYS.map((day, idx) => `
    <section class="day" id="day-${day.id}" data-day="${day.id}">
      <header class="day__header">
        <span class="day__chip">DAY ${day.id}</span>
        <h2 class="day__title">${day.title}</h2>
        <div class="day__actions">
          <button class="day__btn" data-complete="${day.id}">已完成</button>
        </div>
      </header>
      ${day.sections.map(renderSection).join('')}
    </section>
  `).join('');
  // 绑定组件
  $$('.component').forEach(el => {
    const id = el.dataset.id;
    const c = window.Components.map[id];
    if (c) {
      el.innerHTML = c.html();
      // 找到挂载点（component 自身的 children 容器）
      c.bind(el);
    }
  });
  // 绑定 day 完成按钮
  $$('.day__btn').forEach(b => {
    const id = +b.dataset.complete;
    if (window.Storage.completed.has(id)) b.classList.add('completed');
    b.addEventListener('click', () => {
      window.Storage.toggle(id);
      b.classList.toggle('completed');
      window.App.refreshProgress();
      window.App.refreshNav();
      window.Components.toast(window.Storage.completed.has(id) ? '🎉 已完成 Day ' + id : '已取消完成 Day ' + id);
    });
  });
}

/* ---------- 渲染单 section ---------- */
function renderSection(s) {
  switch (s.type) {
    case 'intro': return `
      <div class="card card--info">
        <div class="card__title">📚 本日目标</div>
        <p style="margin:0">今天我们会涉及：<br>
          <span class="kbd">${(s.theme||'').replace(/[<>&]/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;'}[c]))}</span> · 预计耗时 30-45 分钟</p>
      </div>`;
    case 'p': return `<div class="prose">${s.html}</div>`;
    case 'h2': return `<h2>${s.text}</h2>`;
    case 'h3': return `<h3>${s.text}</h3>`;
    case 'tip': return `<div class="card card--tip"><div class="card__title">💡 ${s.title}</div><div>${s.body}</div></div>`;
    case 'warn': return `<div class="card card--warn"><div class="card__title">⚠ ${s.title}</div><div>${s.body}</div></div>`;
    case 'good': return `<div class="card card--good"><div class="card__title">✅ ${s.title}</div><div>${s.body}</div></div>`;
    case 'info': return `<div class="card card--info"><div class="card__title">ℹ ${s.title}</div><div>${s.body}</div></div>`;
    case 'card': return `<div class="card card--${s.variant||'info'}"><div class="card__title">${s.title}</div><div>${s.body}</div></div>`;
    case 'code': {
      // data/content.js 里的字符串用 "\n" 字面量表达换行（单字符反斜杠+n）
      // 这里在渲染时把它转成真换行符
      const real = s.code.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\t/g, '\t');
      return `<pre class="code" data-lang="${s.lang||'elisp'}">${window.Components.highlight(real, s.lang)}</pre>`;
    }
    case 'steps': return `<div class="steps">${s.items.map((it, i) => `
      <div class="step">
        <div class="step__num">${i+1}</div>
        <div class="step__body"><div class="step__title">${it.title}</div><p class="step__desc">${it.desc}</p></div>
      </div>`).join('')}</div>`;
    case 'fold': return `<details class="fold"><summary>${s.summary}</summary><div>${s.body}</div></details>`;
    case 'link-grid': return `<div class="link-grid">${s.items.map(i => `
      <a class="link-card" href="${i.url}" target="_blank">
        <div class="link-card__title">${i.title}</div>
        <small>${i.desc}</small>
      </a>`).join('')}</div>`;
    case 'component': return `<div class="component" data-id="${s.id}"></div>`;
    default: return '';
  }
}

/* ---------- 侧栏 ---------- */
function renderNav() {
  const nav = $('#dayNav');
  nav.innerHTML = `
    <div class="nav__group">进度</div>
    <a class="nav__item" data-jump="top"><span class="nav__check">✓</span><span>开始</span><span class="nav__num">↥</span></a>
    ${window.DAYS.map(d => `
      <a class="nav__item" data-jump="day-${d.id}" data-day="${d.id}">
        <span class="nav__check">✓</span>
        <span>${d.title}</span>
        <span class="nav__num">${d.id}</span>
      </a>
    `).join('')}
  `;
  nav.addEventListener('click', e => {
    const a = e.target.closest('.nav__item');
    if (!a) return;
    e.preventDefault();
    const target = a.dataset.jump === 'top' ? 'top' : a.dataset.jump;
    if (target === 'top') { window.scrollTo({top:0, behavior:'smooth'}); }
    else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({behavior:'smooth', block:'start'});
    }
    if (window.innerWidth < 900) {
      $('#sidebar').classList.remove('open');
      $('#sidebarBackdrop').classList.remove('show');
    }
  });
}

function refreshNav() {
  $$('.nav__item[data-day]').forEach(a => {
    const id = +a.dataset.day;
    a.classList.toggle('completed', window.Storage.completed.has(id));
  });
  // 当前可见章节高亮
  const seen = new Set();
  const days = $$('.day');
  let activeId = null;
  days.forEach(d => {
    const r = d.getBoundingClientRect();
    if (r.top < window.innerHeight / 2 && r.bottom > 80) {
      activeId = +d.dataset.day;
    }
  });
  $$('.nav__item[data-day]').forEach(a => {
    a.classList.toggle('active', +a.dataset.day === activeId);
  });
}

/* ---------- 进度 ---------- */
function refreshProgress() {
  const total = window.DAYS.length;
  const done = window.Storage.completed.size;
  $('#progressText').textContent = `${done} / ${total}`;
  $('#progressBar').style.width = (done / total * 100) + '%';
}

/* ---------- 主题 ---------- */
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  $('#iconSun').style.display  = t === 'dark' ? '' : 'none';
  $('#iconMoon').style.display = t === 'dark' ? 'none' : '';
  window.Storage.theme = t;
}

/* ---------- 搜索 ---------- */
function setupSearch() {
  const input = $('#searchInput');
  const res = $('#searchResults');
  const index = [];
  window.DAYS.forEach(d => {
    const text = d.title + ' ' + d.theme + ' ' + d.sections.map(s => {
      if (s.text) return s.text;
      if (s.title) return s.title;
      if (s.summary) return s.summary;
      if (s.body) return s.body.replace(/<[^>]+>/g, ' ');
      if (s.html) return s.html.replace(/<[^>]+>/g, ' ');
      return '';
    }).join(' ');
    index.push({ id: d.id, title: d.title, text: text.toLowerCase() });
  });

  const run = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { res.classList.remove('active'); res.innerHTML = ''; return; }
    const hits = index.filter(i => i.text.includes(q)).slice(0, 8);
    if (!hits.length) { res.innerHTML = '<a style="cursor:default;color:var(--fg-mute)">无匹配</a>'; res.classList.add('active'); return; }
    res.innerHTML = hits.map(h => `<a href="#day-${h.id}" data-jump="day-${h.id}">
      <span class="hit-day">Day ${h.id}</span>${h.title}
    </a>`).join('');
    res.classList.add('active');
  };
  input.addEventListener('input', run);
  input.addEventListener('focus', run);
  res.addEventListener('click', e => {
    const a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    const id = a.dataset.jump;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior:'smooth', block:'start'});
      el.classList.remove('hl-flash'); void el.offsetWidth; el.classList.add('hl-flash');
    }
    res.classList.remove('active');
    input.value = '';
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('.search')) res.classList.remove('active');
  });
}

/* ---------- 术语表 ---------- */
function setupGlossary() {
  const tip = $('#tooltip');
  // hover / click on .g-term
  document.addEventListener('mouseover', e => {
    const t = e.target.closest('.g-term');
    if (!t) return;
    showTooltip(t);
  });
  document.addEventListener('mouseout', e => {
    const t = e.target.closest('.g-term');
    if (t) hideTooltip();
  });
  document.addEventListener('click', e => {
    const t = e.target.closest('.g-term');
    if (!t) return;
    e.preventDefault();
    showTooltip(t, true);
  });

  function showTooltip(t, pin=false) {
    const key = t.dataset.term;
    const def = window.Glossary[key];
    if (!def) return;
    tip.innerHTML = `<span class="tooltip__name">${def.name}</span><div class="tooltip__body">${def.body}</div>`;
    tip.classList.add('visible');
    const r = t.getBoundingClientRect();
    const tipW = 340;
    let left = r.left + r.width/2 - tipW/2;
    left = Math.max(8, Math.min(window.innerWidth - tipW - 8, left));
    let top = r.bottom + 8;
    if (top + 160 > window.innerHeight) top = r.top - 8 - 160;
    tip.style.left = left + 'px';
    tip.style.top  = top + 'px';
    if (pin) {
      const close = (e) => { if (!tip.contains(e.target)) { hideTooltip(); document.removeEventListener('click', close); } };
      setTimeout(() => document.addEventListener('click', close), 50);
    }
  }
  function hideTooltip() { tip.classList.remove('visible'); }

  // 面板
  const panel = $('#glossaryPanel');
  const list  = $('#glossaryList');
  const search = $('#glossarySearch');
  const render = (filter='') => {
    const entries = Object.entries(window.Glossary)
      .filter(([k, v]) => !filter || v.name.toLowerCase().includes(filter.toLowerCase()) || k.includes(filter));
    entries.sort((a, b) => a[1].name.localeCompare(b[1].name));
    list.innerHTML = entries.map(([k, v]) => `
      <div class="glossary-item">
        <div class="glossary-item__name">${v.name}</div>
        <div class="glossary-item__body">${v.body}</div>
      </div>
    `).join('') || '<div style="color:var(--fg-mute);padding:20px;text-align:center">没有匹配的术语</div>';
  };
  $('#glossaryBtn').addEventListener('click', () => panel.classList.toggle('open'));
  $('#glossaryClose').addEventListener('click', () => panel.classList.remove('open'));
  search.addEventListener('input', () => render(search.value));
  render();
}

/* ---------- 全局快捷键 ---------- */
function setupHotkeys() {
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const i = $('#searchInput'); i.focus(); i.select();
    } else if (e.key === 'g' && !e.target.matches('input,textarea,[contenteditable]')) {
      $('#glossaryPanel').classList.toggle('open');
    } else if (e.key === 't' && !e.target.matches('input,textarea,[contenteditable]')) {
      const cur = document.documentElement.dataset.theme;
      applyTheme(cur === 'dark' ? 'light' : 'dark');
    } else if (e.key === 'Escape') {
      $('#glossaryPanel').classList.remove('open');
      $('#searchResults').classList.remove('active');
    }
  });
  $('#themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme;
    applyTheme(cur === 'dark' ? 'light' : 'dark');
  });
  $('#hamburger').addEventListener('click', () => {
    $('#sidebar').classList.toggle('open');
    $('#sidebarBackdrop').classList.toggle('show');
  });
  $('#sidebarBackdrop').addEventListener('click', () => {
    $('#sidebar').classList.remove('open');
    $('#sidebarBackdrop').classList.remove('show');
  });
}

/* ---------- 暴露 API ---------- */
window.App = { refreshProgress, refreshNav, applyTheme };

/* ---------- 启动 ---------- */
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(window.Storage.theme);
  renderDays();
  renderNav();
  refreshProgress();
  refreshNav();
  setupSearch();
  setupGlossary();
  setupHotkeys();
  window.addEventListener('scroll', () => refreshNav());
});

})();