/* 한여로 — 운행 상태 (driver 전용) · 시작 화면(ignition.js)과 장치(cabin.js)가 같이 씀
   저장: 이 기기 브라우저에만 (localStorage). 30분 넘게 비웠다가 다시 오면 배차 +1 (처음은 7번째).
   미리보기: ?hour=23 (시간대) · ?visit=12 (배차 번호) · ?rain=1 (비 오는 밤) · ?date=1221 (날짜) */
(() => {
const q = new URLSearchParams(location.search);
const KEY = 'yr_state_' + location.pathname;
const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
let s = {}; try { s = JSON.parse(ls.get(KEY) || '{}') || {}; } catch { s = {}; }
const save = () => ls.set(KEY, JSON.stringify(s));
const pad = n => String(n).padStart(2, '0');
const now = new Date();
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const hour = q.get('hour') != null && q.get('hour') !== '' ? (+q.get('hour') % 24) : now.getHours();
const mode = (hour >= 19 || hour < 4) ? 'night' : hour < 8 ? 'dawn' : 'day';
document.documentElement.setAttribute('data-hour', mode);

/* 배차 번호: 30분 넘게 비웠다 오면 +1 */
const t = Date.now();
if (!s.n) { s.n = 7; s.firstN = true; }
else if (!s.last || t - s.last > 30 * 60 * 1000) { s.n += 1; s.firstN = false; }
s.prevRate = s.rate || 0;
s.last = t;
s.horn = Array.isArray(s.horn) ? s.horn : [];
s.coffee = Array.isArray(s.coffee) ? s.coffee : [];
if (s.day !== today) { s.day = today; s.hornToday = 0; s.jealous = false; s.reroute = 0; s.stayed = false; }
save();

const n = q.get('visit') ? Math.max(1, +q.get('visit')) : s.n;
const mmdd = q.get('date') || `${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
const hash = str => { let h = 2166136261; for (const c of String(str)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rain = q.get('rain') != null ? q.get('rain') !== '0' : (mode === 'night' && hash(today) % 3 === 0);
const timeStr = () => { const h = hour, m = q.get('hour') != null ? 10 : now.getMinutes(); const ap = h < 12 ? 'AM' : 'PM'; return `${pad(((h + 11) % 12) + 1)}:${pad(m)} ${ap}`; };

/* 동지(12월 21일)까지 남은 날 */
function winter() {
  const y = now.getFullYear(), mo = +mmdd.slice(0, 2), d = +mmdd.slice(2);
  const base = new Date(y, mo - 1, d), w = new Date(y, 11, 21);
  if (base > w) w.setFullYear(y + 1);
  return Math.round((w - base) / 864e5);
}

window.YR = { s, save, q, today, hour, mode, n, rain, mmdd, hash, timeStr, winter, isBirthday: () => mmdd === '1221' };
})();
