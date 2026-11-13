/* 엄하나 — 모드·시간·들킬 위험 (hana 전용) · 시작 화면(meter.js)과 교무실(desk.js)이 같이 씀
   mode: school(출근 · 남남) / off(퇴근 · 둘만). 평일 08:30~17:59 = school, 그 밖·주말 = off. 스위치로 바꾸면 이 탭에서만 기억.
   미리보기: ?mode=school|off · ?hour=21 · ?day=6 · ?risk=85 */
(() => {
const P = ((window.ARCHIVE || {}).page || {});
const D = P.desk || {};
const q = new URLSearchParams(location.search);
const KEY = 'hana_' + location.pathname;
const ss = { get(k) { try { return sessionStorage.getItem(k); } catch { return null; } }, set(k, v) { try { sessionStorage.setItem(k, v); } catch {} } };
const pad = n => String(n).padStart(2, '0');
const now = new Date();
const hour = q.get('hour') != null && q.get('hour') !== '' ? +q.get('hour') : now.getHours();
const minute = q.get('hour') != null && q.get('hour') !== '' ? 0 : now.getMinutes();
const day = q.get('day') != null && q.get('day') !== '' ? +q.get('day') : now.getDay();   // 0 일 … 6 토
const weekend = day === 0 || day === 6;
const schoolHours = !weekend && (hour > 8 || (hour === 8 && minute >= 30)) && hour < 18;
const autoMode = schoolHours ? 'school' : 'off';
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

let s = {}; try { s = JSON.parse(ss.get(KEY) || '{}') || {}; } catch { s = {}; }
const save = () => ss.set(KEY, JSON.stringify(s));
if (s.date !== today) { s = { date: today }; save(); }   // 날이 바뀌면 처음부터

let mode = q.get('mode') === 'school' || q.get('mode') === 'off' ? q.get('mode') : (s.mode || autoMode);
const R = D.risk || {};
let risk = q.get('risk') != null && q.get('risk') !== '' ? +q.get('risk') : (typeof s.risk === 'number' ? s.risk : (R.start == null ? 20 : R.start));
const clamp = v => Math.max(0, Math.min(R.max == null ? 100 : R.max, Math.round(v)));
risk = clamp(risk);

const listeners = [];
const api = {
  q, now, hour, minute, day, weekend, schoolHours, autoMode, today,
  dayName: DAYS[day],
  clock: `${pad(hour)}:${pad(minute)}`,
  get mode() { return mode; },
  get risk() { return risk; },
  isSchool: () => mode === 'school',
  setMode(m, by) { if (m === mode) return; mode = m; s.mode = m; save(); listeners.forEach(f => f('mode', m, by)); },
  addRisk(d, why) { if (mode !== 'school') return risk; const b = risk; risk = clamp(risk + d); if (risk !== b) { s.risk = risk; save(); listeners.forEach(f => f('risk', risk, why)); } return risk; },
  setRisk(v) { risk = clamp(v); s.risk = risk; save(); listeners.forEach(f => f('risk', risk, 'set')); },
  on(f) { listeners.push(f); },
  flag(k) { return !!s[k]; }, mark(k) { s[k] = true; save(); },
  /* 오늘의 포스트잇: 날짜로 한 장씩 돌아감 */
  noteIndex(n) { const d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()); const days = Math.round(d0 / 864e5); return ((days % n) + n) % n; },
  /* D-day: 여행 첫날까지 남은 날 */
  dday(dateStr) { const [y, m, d] = String(dateStr || '').split('-').map(Number); if (!y) return null; const t = new Date(y, m - 1, d), d0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()); return Math.round((t - d0) / 864e5); },
  /* 어느 시간대인지 (들어왔을 때 대사용) */
  slot() {
    if (weekend) return 'weekend';
    if (mode === 'school') return hour < 10 ? 'schoolMorning' : hour >= 17 ? 'schoolLate' : 'schoolDay';
    if (hour >= 18 && hour < 22) return 'offEvening';
    if (hour >= 22 || hour < 2) return 'offNight';
    if (hour < 8) return 'offDawn';
    return 'offEvening';
  }
};
document.documentElement.setAttribute('data-mode', mode);
api.on((k, v) => { if (k === 'mode') document.documentElement.setAttribute('data-mode', v); });
window.HANA = api;
})();
