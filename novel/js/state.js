/* 연재은 — 연재 상태 (novel 전용) · 시작 화면(hidden.js)과 앱 화면(novel.js)이 같이 씀
   저장: 이 기기 브라우저에만 (localStorage). 미리보기: ?ep=20 · ?hour=23 · ?wed=1 · ?days=2 */
(() => {
const N = ((window.ARCHIVE || {}).page || {}).novel || {};
const q = new URLSearchParams(location.search);
const KEY = 'nv_state_' + location.pathname;
const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
let s = {}; try { s = JSON.parse(ls.get(KEY) || '{}') || {}; } catch { s = {}; }
const save = () => ls.set(KEY, JSON.stringify(s));
const pad = n => String(n).padStart(2, '0');
const now = new Date();
if (q.get('days')) now.setDate(now.getDate() + (+q.get('days') || 0));
const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = key(now);
if (!s.first) { s.first = today; save(); }
s.comments = Array.isArray(s.comments) ? s.comments : [];
const hour = q.get('hour') != null && q.get('hour') !== '' ? +q.get('hour') : now.getHours();
const minute = now.getMinutes();

/* 휴재일: 매주 offDay 요일 */
const offDay = N.offDay == null ? 3 : N.offDay;
const isOff = q.get('wed') != null ? q.get('wed') === '1' : now.getDay() === offDay;

/* 오늘 회차: start 날짜가 startEp화, 하루 지나면 1화씩 (휴재일은 건너뜀) */
function ep() {
  if (q.get('ep')) return Math.max(1, +q.get('ep'));
  const [y, m, d] = (N.start || '2026-11-13').split('-').map(Number);
  const st = new Date(y, m - 1, d), t = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let n = N.startEp || 12;
  for (let c = new Date(st); c < t; c.setDate(c.getDate() + 1)) {
    const nx = new Date(c); nx.setDate(nx.getDate() + 1);
    if (nx.getDay() !== offDay) n++;
  }
  return n;
}
/* 23시 전에는 오늘 회차가 아직 안 올라왔다 */
const posted = hour >= 23 || hour < 5;
function seat(n) {
  const S = N.seats || [[1, '악역']]; let name = S[0][1], idx = 0;
  S.forEach(([from, nm], i) => { if (n >= from) { name = nm; idx = i; } });
  return { name, idx, total: S.length };
}
function writing() {
  const f = N.writingFrom == null ? 23 : N.writingFrom, t = N.writingTo == null ? 2 : N.writingTo;
  return f > t ? (hour >= f || hour < t) : (hour >= f && hour < t);
}
function lastSeen() {
  const t = N.writingTo == null ? 2 : N.writingTo;
  let h = hour - t; if (h < 0) h += 24;
  return Math.max(1, h);
}
const daysSince = d => { const [y, m, dd] = d.split('-').map(Number); return Math.round((new Date(now.getFullYear(), now.getMonth(), now.getDate()) - new Date(y, m - 1, dd)) / 864e5); };
/* 문자열을 정수로 (같은 글 → 같은 답) */
const hash = t => { let h = 7; for (const ch of String(t)) h = (h * 31 + ch.codePointAt(0)) >>> 0; return h; };
const pron = () => s.gender === '여' ? '그녀' : '그';
const fill = t => String(t == null ? '' : t).replace(/\{그\}/g, pron());

window.NOVEL_STORE = { s, save, today, hour, minute, isOff, ep, posted, seat, writing, lastSeen, daysSince, hash, pron, fill, q, now };
})();
