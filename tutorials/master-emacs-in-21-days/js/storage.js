/* ============================================================
 * 本地存储：进度 / 主题
 * ============================================================ */
(function() {
'use strict';
const KEY_DONE = 'me21-completed';
const KEY_THEME = 'me21-theme';

function loadDone() {
  try { return new Set(JSON.parse(localStorage.getItem(KEY_DONE) || '[]')); }
  catch { return new Set(); }
}
function saveDone(set) {
  try { localStorage.setItem(KEY_DONE, JSON.stringify([...set])); }
  catch {}
}

let completed = loadDone();

window.Storage = {
  get completed() { return completed; },
  toggle(id) {
    if (completed.has(id)) completed.delete(id);
    else completed.add(id);
    saveDone(completed);
  },
  get theme() {
    return localStorage.getItem(KEY_THEME) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark');
  },
  set theme(v) {
    try { localStorage.setItem(KEY_THEME, v); } catch {}
  }
};
})();