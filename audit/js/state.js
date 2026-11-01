/* 권세율 — 조사 상태 (audit 전용) · 시작 화면(door.js)과 장치(audit.js)가 같이 씀
   저장: 이 기기 브라우저에만 (localStorage). 미리보기: ?day=7 · ?coffee=6 · ?date=0331 · ?hour=23 */
(() => {
const P = (window.ARCHIVE || {}).page || {}, A = P.audit || {};
const q = new URLSearchParams(location.search);
const KEY = 'au_state_' + location.pathname;
const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
let s = {}; try { s = JSON.parse(ls.get(KEY) || '{}') || {}; } catch { s = {}; }
const save = () => ls.set(KEY, JSON.stringify(s));
const pad = n => String(n).padStart(2, '0');
const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const now = new Date();
const today = key(now);
if (!s.first) { s.first = today; save(); }
s.refused = Array.isArray(s.refused) ? s.refused : [];
s.pleas = s.pleas || { '인정': 0, '보류': 0, '부인': 0 };
s.nights = Array.isArray(s.nights) ? s.nights : [];
s.days = Array.isArray(s.days) ? s.days : [];
if (!s.days.includes(today)) { s.days.push(today); if (s.days.length > 400) s.days = s.days.slice(-400); save(); }
const hour = q.get('hour') != null && q.get('hour') !== '' ? +q.get('hour') : now.getHours();
if ((hour >= 22 || hour < 5) && !s.nights.includes(today)) { s.nights.push(today); save(); }

const TOTAL = A.days || 20;
function day() {
  if (q.get('day')) return Math.max(1, +q.get('day'));
  const [y, m, d] = s.first.split('-').map(Number);
  const f = new Date(y, m - 1, d), t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((t - f) / 864e5) + 1;
}
function refusedN() { return q.get('coffee') != null ? +q.get('coffee') : s.refused.length; }
function accepted() { return !!s.accepted || (q.get('coffee') != null && +q.get('coffee') >= ((A.coffee || {}).acceptAfter || 7)); }
const isM31 = () => (q.get('date') || `${pad(now.getMonth() + 1)}${pad(now.getDate())}`) === '0331';
function doubt() {
  const c = A.doubtStart || 90;
  let v = c - 3 * (Math.min(day(), TOTAL) - 1) - 4 * (s.pleas['인정'] || 0) - (accepted() ? 15 : 0);
  return Math.max(0, Math.min(100, Math.round(v)));
}
function coffeeLabel() {
  const C = A.coffee || {};
  if (accepted()) { const d = s.accepted ? s.accepted.slice(5).replace('-', '.') : today.slice(5).replace('-', '.'); return (C.acceptedLabel || '받음 {d}').replace('{d}', d); }
  return refusedN() ? (C.countLabel || '거절 {n}일째').replace('{n}', refusedN()) : (C.none || '아직');
}

window.AUDIT_STORE = { s, save, today, hour, TOTAL, day, refusedN, accepted, doubt, coffeeLabel, isM31, q };
window.AUDIT_STATE = () => ({ day: Math.min(day(), TOTAL), closed: day() > TOTAL, coffeeLabel: coffeeLabel(), doubt: doubt() });
})();
