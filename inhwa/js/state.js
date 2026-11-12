/*! © 2026 페르르. All rights reserved. 무단 복제·배포·재사용 금지 */
/* 도인화 — 방문 기록 (inhwa 전용) · 시작 화면(viewfinder.js)과 필름 화면(film.js)이 같이 씀
   저장: 이 기기 브라우저에만 (localStorage). 저장이 막혀 있어도(시크릿 모드) 오류 없이 첫 방문처럼 보여요.
   미리보기: ?visit=3 (방문한 날 수) · ?last=1 (36번 열림) · ?hour=21 (시각) */
(() => {
const q = new URLSearchParams(location.search);
const KEY = 'ih_state_' + location.pathname;
const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
let s = {}; try { s = JSON.parse(ls.get(KEY) || '{}') || {}; } catch { s = {}; }
const save = () => ls.set(KEY, JSON.stringify(s));
const pad = n => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
s.days = Array.isArray(s.days) ? s.days : [];
if (!s.days.includes(today)) { s.days.push(today); if (s.days.length > 60) s.days = s.days.slice(-60); save(); }
const visits = q.get('visit') ? Math.max(1, +q.get('visit') || 1) : s.days.length;
const hour = q.get('hour') != null && q.get('hour') !== '' ? +q.get('hour') : now.getHours();
const need = (((window.ARCHIVE || {}).page || {}).film || {}).end ? (window.ARCHIVE.page.film.end.days || 3) : 3;
const lastOpen = () => q.get('last') === '1' || !!s.lastOpen || visits >= need;
const openLast = () => { if (!s.lastOpen) { s.lastOpen = today; save(); } };
window.INHWA_STORE = { s, save, today, visits, hour, need, lastOpen, openLast, q };
})();
