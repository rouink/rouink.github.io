/* 주인하 — 이 집 (auction 전용 · shared 파일을 고치지 않음)
   표지 로고 · 지금 상태 줄 · 세계관 · 평면도(방을 누르면 장면) · 영수증 수첩(소지품+TMI) · 이사비 협상 다이얼 · 철벽 게이지 · 보일러(밤)
   data.js page.house 에 값을 적으면 켜져요.  미리보기: ?hour=23 (밤) · ?visit=5 · ?wall=40 */
(() => {
const D = window.ARCHIVE || {}, P = D.page || {}, H = P.house, API = window.ARCHIVE_API;
if (!H || !API) return;
const C = (D.characters || {}).char1 || {};
const q = new URLSearchParams(location.search);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const fill = (t, o) => String(t || '').replace(/\{(\w+)\}/g, (m, k) => o[k] != null ? o[k] : m);
const ls = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
const say = (t, o) => t && API.say && API.say(t, Object.assign({ by: H.by }, o || {}));
const $ = id => document.getElementById(id);
const two = a => `<span>${esc(a[0] || '')}</span>${a[1] ? `<span>${esc(a[1])}</span>` : ''}`;
const KEY = 'ju_house_' + location.pathname;
let st = {}; try { st = JSON.parse(ls.get(KEY) || '{}') || {}; } catch { st = {}; }
const save = () => ls.set(KEY, JSON.stringify(st));
st.deals = st.deals || 0; st.stay = st.stay || 0;

/* ── 시간대: 밤 = 보일러 OFF ── */
const hNow = q.get('hour') != null && q.get('hour') !== '' ? +q.get('hour') : new Date().getHours();
const night = hNow >= 22 || hNow < 5;

/* ── 철벽 ── */
const W = H.wall || {};
const visit = +q.get('visit') || +ls.get('pa_visit_' + location.pathname) || 1;
function wallNow() {
  if (q.get('wall') != null && q.get('wall') !== '') return Math.max(0, Math.min(100, +q.get('wall')));
  const v = (W.start || 100) - (W.perVisit || 6) * (visit - 1) - Math.min(30, (W.perDeal || 2) * st.deals) - Math.min(40, (W.perStay || 2) * Math.floor(st.stay / (W.staySec || 180)));
  return Math.max(0, Math.min(100, Math.round(v)));
}
let wall = wallNow();
const herOpen = () => (H.openHer && H.openHer.night && night) || wall < ((H.openHer && H.openHer.wallBelow) || 50);
const guest = () => { const u = ($('username') && $('username').value.trim()) || ''; return u && u.toUpperCase() !== 'GUEST' ? u : (P.guestName || '점유자님'); };

/* ── 1. 표지: 로고 + 한줄 ── */
const heroText = document.querySelector('.hero-text');
if (heroText) {
  const lab = $('hero-label');
  const logo = document.createElement('img'); logo.className = 'hz-logo'; logo.src = P.logo || ''; logo.alt = P.heroTitle || C.name || ''; logo.decoding = 'async';
  const line = document.createElement('p'); line.className = 'hz-line'; line.innerHTML = two(P.heroLine || []);
  if (lab) lab.after(logo); else heroText.prepend(logo);
  logo.after(line);
  const sc = document.createElement('span'); sc.className = 'hz-scroll'; sc.textContent = 'SCROLL'; sc.setAttribute('aria-hidden', 'true');
  const hero = $('hero'); if (hero) hero.appendChild(sc);
}

/* ── 2. 지금 상태 줄 ── */
const L = H.statusLabels || {};
const pad = n => String(n).padStart(2, '0');
const status = document.createElement('section'); status.setAttribute('data-page', '1'); status.className = 'hz-status';
status.innerHTML = `<div class="in">
  <div class="cell"><span class="k">${esc(L.wall || '철벽')}</span><b class="v" id="hz-wall">${wall}%</b><div class="bar"><i id="hz-wall-bar" style="transform:scaleX(${wall / 100})"></i></div></div>
  <div class="cell"><span class="k">${esc(L.fee || '이사비')}</span><b class="v" id="hz-fee">₩${(st.last != null ? st.last : (H.dealStart || 200))}만</b></div>
  <div class="cell"><span class="k" id="hz-clock">${pad(hNow)}:${pad(new Date().getMinutes())}</span><b class="v${night ? ' off' : ''}">${esc(night ? (H.boilerOff || '보일러 OFF') : (H.boilerOn || '보일러 ON'))}</b></div>
</div>`;
const heroSec = $('hero'); if (heroSec) heroSec.after(status);

/* ── 3. 세계관: 큰 제목 + 문단 ── */
const ht = $('hero-text'), worldSec = ht && ht.closest('section');
if (worldSec && Array.isArray(P.heroText)) {
  worldSec.innerHTML = `<div class="hz-world">
    <div><div class="hz-rule"><p class="label" id="world-label">${esc(P.worldLabel || '')}</p></div><h2 class="sec-title">${two(P.worldTitle || [])}</h2></div>
    <div class="prose" id="hero-text">${P.heroText.map(t => `<p>${esc(t)}</p>`).join('')}</div>
  </div>`;
}

/* ── 4. 평면도 ── */
const R = H.rooms || [], byId = {}; R.forEach(r => { byId[r.id] = r; });
const G = { boxes: [0, 0, 220, 200], her: [220, 0, 200, 200], util: [420, 0, 180, 130], bath: [0, 200, 120, 120], living: [120, 200, 300, 240], kitchen: [420, 130, 180, 310], entry: [0, 320, 120, 120] };
function planSVG() {
  const room = (id, label, en, dims, lock) => {
    const [x, y, w, h] = G[id];
    return `<g class="hz-room${lock ? ' lock' : ''}" data-room="${id}" tabindex="0" role="button" aria-label="${esc(label)}${lock ? ' (잠김)' : ''}">
      <rect class="f" x="${x}" y="${y}" width="${w}" height="${h}"/><rect class="w" x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="#2B2420" stroke-width="1.6"/>
      <text x="${x + 12}" y="${y + 32}" font-family="Hahmlet" font-weight="700" font-size="23" letter-spacing="-.8" fill="#2B2420">${esc(label)}</text>
      <text x="${x + 12}" y="${y + 50}" font-family="Space Mono" font-size="11" letter-spacing="2" fill="rgba(43,36,32,.55)">${esc(en)}</text>
      ${dims ? `<text x="${x + 12}" y="${y + h - 13}" font-family="Nanum Pen Script" font-size="${w < 150 ? 17 : 25}" fill="#8A6A3A">${esc(dims)}</text>` : ''}
      ${lock ? `<text x="${x + 12}" y="${y + 70}" text-anchor="start" font-family="Space Mono" font-size="11" letter-spacing="1.5" fill="#A0701A">LOCKED</text>` : ''}</g>`;
  };
  const her = byId.her;
  let s = `<svg viewBox="-16 -16 632 476" role="group" aria-label="집 평면도">
  <defs><filter id="hz-pc"><feTurbulence baseFrequency=".9" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="${RM ? 0 : 1.6}"/></filter>
  <pattern id="hz-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="rgba(43,36,32,.03)"/><line x1="0" y1="0" x2="0" y2="9" stroke="rgba(43,36,32,.16)" stroke-width="1.4"/></pattern></defs>
  <g filter="url(#hz-pc)">`;
  ['boxes', 'util', 'living', 'kitchen', 'entry'].forEach(id => { const r = byId[id]; if (r) s += room(id, r.name, r.en, r.dims, false); });
  if (her) s += room('her', her.name, her.en, night ? '보일러 OFF?' : her.dims, !herOpen());
  const b = H.bath || {}; const [bx, by, bw, bh] = G.bath;
  s += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="url(#hz-hatch)" stroke="#2B2420" stroke-width="1.6"/><text x="${bx + 12}" y="${by + 32}" font-family="Hahmlet" font-weight="700" font-size="21" fill="rgba(43,36,32,.6)">${esc(b.name || '욕실')}</text><text x="${bx + 12}" y="${by + 50}" font-family="Space Mono" font-size="10.5" letter-spacing="2" fill="rgba(43,36,32,.45)">${esc(b.en || 'BATH')}</text><text x="${bx + 12}" y="${by + bh - 13}" font-family="Nanum Pen Script" font-size="23" fill="#8A6A3A">${esc(b.note || '')}</text>`;
  s += `<rect x="-6" y="-6" width="612" height="452" fill="none" stroke="#2B2420" stroke-width="6"/>
    <line x1="120" y1="360" x2="120" y2="410" stroke="#F4EFE6" stroke-width="5"/><path d="M120 410 A50 50 0 0 0 70 360" fill="none" stroke="#2B2420" stroke-width="1" stroke-dasharray="3 3"/><line x1="120" y1="410" x2="70" y2="410" stroke="#2B2420" stroke-width="1.6"/>
    <g stroke="#2B2420" stroke-width="1.2"><line x1="230" y1="-9" x2="330" y2="-9"/><line x1="230" y1="-3" x2="330" y2="-3"/><line x1="603" y1="200" x2="603" y2="320"/><line x1="609" y1="200" x2="609" y2="320"/></g>
    <circle cx="${G.her[0] + 165}" cy="${G.her[1] + 140}" r="5" fill="${night ? '#C77A1E' : 'rgba(43,36,32,.35)'}"/>
  </g>
  <text x="190" y="345" font-family="Nanum Pen Script" font-size="27" fill="#8A6A3A" transform="rotate(-4 190 345)">← 여기 서 있었음</text>
  <g font-family="Space Mono" font-size="9" fill="#A0701A" letter-spacing="1.5"><text x="300" y="-22" text-anchor="middle">9,000</text></g>
  <path d="M0 -26 L270 -26 M330 -26 L600 -26 M0 -31 L0 -21 M600 -31 L600 -21" stroke="#D9A62E" stroke-width="1"/>
  </svg>`;
  return s;
}
const planSec = document.createElement('section'); planSec.setAttribute('data-page', '1'); planSec.className = 'sec fade-up';
planSec.innerHTML = `<div class="sec-head"><div class="hz-rule"><p class="label">${esc(H.planLabel || 'Floor Plan')}</p></div><h2 class="sec-title">${two(H.planTitle || [])}</h2><p class="sec-sub">${esc(H.planSub || '')}</p></div>
<div class="hz-plan">
  <div class="hz-sheet"><div class="hd"><span><b>LOT No.0412</b> · 평면도</span><span>SCALE 1:100</span></div>${planSVG()}
    <div class="legend"><span><i style="background:rgba(217,166,46,.5)"></i>보고 있는 방</span><span><i style="background:repeating-linear-gradient(45deg,rgba(43,36,32,.35) 0 2px,transparent 2px 5px)"></i>잠긴 방</span></div></div>
  <div class="hz-card" id="hz-card" aria-live="polite">
    <div class="ph" id="hz-ph"><img id="hz-img" alt=""></div>
    <div class="meta"><span id="hz-room-name"></span><b id="hz-room-dims"></b></div>
    <p class="ln" id="hz-room-line"></p>
    <p class="ds" id="hz-room-desc"></p>
    <span class="pen" id="hz-room-pen"></span>
  </div>
</div>
<div id="hz-secret-slot"></div>`;
const castSec = $('character-grid') && $('character-grid').closest('section');
if (castSec) castSec.before(planSec); else document.querySelector('main').appendChild(planSec);
Object.values(byId).forEach(r => { if (r.img) { const im = new Image(); im.decoding = 'async'; im.src = r.img; } });

function showRoom(id, user) {
  const r = byId[id]; if (!r) return;
  document.querySelectorAll('.hz-room').forEach(g => g.classList.toggle('on', g.dataset.room === id));
  const ph = $('hz-ph'), img = $('hz-img'), locked = id === 'her' && !herOpen();
  ph.querySelectorAll('.lk').forEach(x => x.remove());
  $('hz-room-name').textContent = `${r.name} · ${r.en}`;
  $('hz-room-dims').textContent = locked ? 'LOCKED' : (id === 'her' && night ? (H.boilerOff || '보일러 OFF') : (r.dims || ''));
  if (locked) {
    img.classList.add('out');
    const lk = document.createElement('div'); lk.className = 'lk'; lk.innerHTML = `<small>LOCKED · HER ROOM</small><b>${esc(r.lockedLine || '')}</b><span class="note">${esc(H.lockedHint || '')}</span>`; ph.appendChild(lk);
    $('hz-room-line').textContent = r.lockedLine || ''; $('hz-room-desc').textContent = ''; $('hz-room-pen').textContent = '';
    if (user) say(r.lockedLine);
    return;
  }
  const swap = () => { img.src = r.img; img.alt = `${C.name || ''} — ${r.name}`; requestAnimationFrame(() => img.classList.remove('out')); };
  if (img.getAttribute('src') && !RM) { img.classList.add('out'); setTimeout(swap, 280); } else swap();
  $('hz-room-line').textContent = r.line || ''; $('hz-room-desc').textContent = r.desc || '';
  $('hz-room-pen').textContent = id === 'living' ? '거실 3,420. 생각보다 넓네.' : id === 'her' ? '…아끼는 거예요.' : '';
}
planSec.querySelector('svg').addEventListener('click', e => { const g = e.target.closest('[data-room]'); if (g) showRoom(g.dataset.room, true); });
planSec.querySelector('svg').addEventListener('keydown', e => { const g = e.target.closest('[data-room]'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); showRoom(g.dataset.room, true); } });
showRoom('living');

/* ── 5. 영수증 수첩 (소지품 + TMI) ── */
const items = C.items || [], tmi = C.tmi || [];
const rcSec = document.createElement('section'); rcSec.setAttribute('data-page', '1'); rcSec.className = 'sec fade-up';
let n = 0; const no = () => `No.${String(++n).padStart(4, '0')}`;
rcSec.innerHTML = `<div class="sec-head"><div class="hz-rule"><p class="label">${esc(H.rcLabel || 'Receipts')}</p></div><h2 class="sec-title">${two(H.rcTitle || [])}</h2><p class="sec-sub">${esc(H.rcSub || '')}</p></div>
<div class="hz-rc" tabindex="0" aria-label="영수증 수첩">
${items.map(it => `<article class="rcpt"><span class="tape" aria-hidden="true"></span><div class="h">${esc(it.shop || '')}</div><p class="it">${esc(it.title || '')}</p><div>${esc(it.date || '')}</div>
  ${(it.rows || []).map(([a, b]) => `<div class="r"><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join('')}
  ${it.total ? `<div class="t r"><span>합계</span><span>${esc(it.total)}</span></div>` : ''}
  ${it.desc ? `<p class="a" style="font-size:13.5px;margin-top:10px">${esc(it.desc)}</p>` : ''}
  ${it.memo ? `<p class="memo">${esc(it.memo)}</p>` : ''}<p class="no">${no()}</p></article>`).join('')}
${tmi.map((t, i) => `<article class="rcpt"><span class="tape" aria-hidden="true"></span><div class="h">Q&amp;A · ${String(i + 1).padStart(3, '0')}</div><p class="q">Q. ${esc(t.q)}</p><p class="a">${esc(t.a)}</p><p class="no">${no()}</p></article>`).join('')}
</div>`;

/* ── 6. 이사비 협상 ── */
const MIN = H.dealMin || 0, MAX = H.dealMax || 1000;
let val = st.last != null ? st.last : (H.dealStart || 200);
const dealSec = document.createElement('section'); dealSec.setAttribute('data-page', '1'); dealSec.className = 'sec fade-up';
const ticks = Array.from({ length: 100 }, (_, i) => { const a = i / 100 * 360, long = i % 10 === 0; return `<line x1="160" y1="${long ? 14 : 20}" x2="160" y2="30" stroke="${long ? '#D9A62E' : 'rgba(243,236,225,.35)'}" stroke-width="${long ? 2 : 1}" transform="rotate(${a} 160 160)"/>`; }).join('');
const nums = Array.from({ length: 10 }, (_, i) => `<text x="160" y="50" text-anchor="middle" font-family="Space Mono" font-size="10" fill="rgba(243,236,225,.55)" transform="rotate(${i * 36} 160 160)">${i * 100}</text>`).join('');
dealSec.innerHTML = `<div class="sec-head"><div class="hz-rule"><p class="label">${esc(H.dealLabel || 'Moving Fee')}</p></div><h2 class="sec-title">${two(H.dealTitle || [])}</h2><p class="sec-sub">${esc(H.dealSub || '')}</p></div>
<div class="hz-deal">
  <div>
    <div class="hz-dial" id="hz-dial" role="slider" tabindex="0" aria-label="이사비 (만 원)" aria-valuemin="${MIN}" aria-valuemax="${MAX}">
      <svg viewBox="0 0 320 320" aria-hidden="true"><circle cx="160" cy="160" r="152" fill="none" stroke="rgba(217,166,46,.35)" stroke-width="1"/><g class="rot" id="hz-rot">${ticks}${nums}</g>
        <path d="M160 2 L152 -12 L168 -12 Z" fill="#D9A62E" transform="translate(0,14)"/></svg>
      <div class="face"><span class="num" id="hz-num">${val}</span><span class="unit">만 원 · MOVING FEE</span></div>
    </div>
    <div class="hz-steps"><button type="button" data-d="-10" aria-label="10만 원 내리기">−10</button><button type="button" data-d="-1" aria-label="1만 원 내리기">−1</button><button type="button" data-d="1" aria-label="1만 원 올리기">+1</button><button type="button" data-d="10" aria-label="10만 원 올리기">+10</button></div>
  </div>
  <div>
    <div class="hz-reply" data-by="${esc(H.by || '')}"><p id="hz-reply">${esc('이사비 ' + (H.dealStart || 200) + '만 원. 나가실 때까지 저도 여기 살게요.')}</p><small id="hz-reply-sub">${esc(H.dealNote || '')}</small></div>
    <div class="acts"><button type="button" class="btn solid" id="hz-offer">${esc(H.dealBtn || '부르기')}</button><button type="button" class="btn" id="hz-save" style="flex:0 0 38%">${esc(H.dealSave || '영수증 저장')}</button></div>
  </div>
</div>`;
if (castSec) { castSec.after(rcSec); rcSec.after(dealSec); } else { document.querySelector('main').append(rcSec, dealSec); }

function setVal(v) {
  val = Math.max(MIN, Math.min(MAX, Math.round(v)));
  $('hz-num').textContent = val; $('hz-dial').setAttribute('aria-valuenow', val);
  $('hz-rot').style.transform = `rotate(${-val / 1000 * 360}deg)`;
}
setVal(val);
dealSec.querySelector('.hz-steps').addEventListener('click', e => { const b = e.target.closest('[data-d]'); if (b) setVal(val + +b.dataset.d); });
$('hz-dial').addEventListener('keydown', e => { const d = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 }[e.key]; if (d) { e.preventDefault(); setVal(val + d); } });
{ // 다이얼 돌리기: 끈 만큼 각도 → 금액 (한 바퀴 = 1,000만 원)
  const dial = $('hz-dial'); let drag = null;
  const ang = e => { const r = dial.getBoundingClientRect(); return Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI; };
  dial.addEventListener('pointerdown', e => { drag = { a: ang(e), v: val }; dial.setPointerCapture(e.pointerId); $('hz-rot').style.transition = 'none'; });
  dial.addEventListener('pointermove', e => { if (!drag) return; let d = ang(e) - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360; drag.v -= d / 360 * 1000; drag.a = ang(e); setVal(drag.v); });
  const end = () => { drag = null; $('hz-rot').style.transition = ''; }; dial.addEventListener('pointerup', end); dial.addEventListener('pointercancel', end);
}
function reply(v) {
  if (v === 412 && H.dealLot) return H.dealLot;
  if (st.last === v && st.deals > 0 && H.dealAgain) return H.dealAgain;
  const row = (H.deal || []).find(r => v <= r.max) || (H.deal || [])[H.deal.length - 1] || {};
  return fill(row.line, { n: v });
}
$('hz-offer').addEventListener('click', () => {
  const t = reply(val), p = $('hz-reply');
  p.style.opacity = 0; setTimeout(() => { p.textContent = t; p.style.opacity = 1; }, RM ? 0 : 260);
  st.deals++; st.last = val; save(); $('hz-fee').textContent = `₩${val}만`; updateWall();
});
$('hz-save').addEventListener('click', () => { drawReceipt().toBlob(b => { const a = document.createElement('a'); a.download = `moving-fee-${Date.now()}.png`; a.href = URL.createObjectURL(b); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png'); });
function drawReceipt() {
  const w = 720, h = 1120, cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
  g.fillStyle = '#FBF8F1'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#110E0C'; for (let x = 0; x < w; x += 24) { g.beginPath(); g.moveTo(x, h); g.lineTo(x + 12, h - 14); g.lineTo(x + 24, h); g.fill(); }
  const mono = '"Nanum Gothic Coding","Space Mono",monospace';
  g.fillStyle = '#2B2420'; g.textAlign = 'center';
  g.font = `700 30px ${mono}`; g.fillText('*** LOT No.0412 ***', w / 2, 96);
  g.font = `22px ${mono}`; g.fillText('이사비 협상 영수증', w / 2, 140);
  const dash = y => { g.save(); g.setLineDash([8, 8]); g.strokeStyle = '#B9AD9D'; g.lineWidth = 2; g.beginPath(); g.moveTo(60, y); g.lineTo(w - 60, y); g.stroke(); g.restore(); };
  dash(176);
  const d = new Date(), date = `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  g.textAlign = 'left'; g.font = `22px ${mono}`;
  [['일시', date], ['점유자', guest()], ['낙찰자', C.name || ''], ['협상 횟수', st.deals + '회']].forEach(([k, v], i) => { g.fillText(k, 70, 230 + i * 46); g.textAlign = 'right'; g.fillText(v, w - 70, 230 + i * 46); g.textAlign = 'left'; });
  dash(420);
  g.font = `700 30px ${mono}`; g.fillText('제시 금액', 70, 482); g.textAlign = 'right'; g.font = '900 64px "Hahmlet",serif'; g.fillStyle = '#B8861C'; g.fillText(`₩${val.toLocaleString()}만`, w - 70, 492);
  g.fillStyle = '#2B2420'; g.textAlign = 'left'; dash(540);
  g.font = '700 30px "Hahmlet",serif'; const t = $('hz-reply').textContent;
  let line = '', y = 610; for (const ch of t) { if (g.measureText(line + ch).width > w - 140) { g.fillText(line, 70, y); line = ch; y += 46; } else line += ch; } g.fillText(line, 70, y);
  g.font = '44px "Nanum Pen Script",cursive'; g.fillStyle = '#A26F12'; g.save(); g.translate(70, y + 110); g.rotate(-.04); g.fillText('도장은 아직. — 주인하', 0, 0); g.restore();
  g.fillStyle = '#8C7F6E'; g.font = `16px ${mono}`; g.textAlign = 'center'; g.fillText('※ 창작물 · 실제 계약·효력 없음', w / 2, h - 60);
  return cv;
}

/* ── 7. 철벽이 무너진 날 (시크릿) · 철벽 줄 갱신 ── */
function secretBlock() {
  const S = W.secret; if (!S || wall >= (W.nameAt || 50) || $('hz-secret')) return;
  const box = document.createElement('div'); box.className = 'hz-secret fade-up in'; box.id = 'hz-secret';
  box.innerHTML = `<img src="${esc(S.img)}" alt="${esc(C.name || '')}" loading="lazy"><div><p class="tag">${esc(S.tag || '')}</p><p style="margin-top:10px">${esc(S.line || '')}</p><small>${esc(S.by || '')}</small></div>`;
  $('hz-secret-slot').appendChild(box);
}
function updateWall() {
  const was = wall; wall = wallNow();
  $('hz-wall').textContent = wall + '%'; $('hz-wall-bar').style.transform = `scaleX(${wall / 100})`;
  if (was >= (W.nameAt || 50) && wall < (W.nameAt || 50)) {
    // 50% 아래로: 그녀의 방이 열리고, 이름을 부름 (한 번만)
    const g = planSec.querySelector('[data-room="her"]'); if (g) { g.classList.remove('lock'); const lk = [...g.querySelectorAll('text')].find(t => t.textContent === 'LOCKED'); if (lk) lk.remove(); g.setAttribute('aria-label', (byId.her || {}).name || ''); }
    secretBlock();
    if (!st.named) { st.named = 1; save(); say(fill(W.low, { name: guest() })); }
  }
}
secretBlock();

/* 머문 시간: 보고 있을 때만 셈 */
let lastT = Date.now();
setInterval(() => { const now = Date.now(); if (!document.hidden && document.documentElement.dataset.in === '1') { st.stay += Math.min(5, (now - lastT) / 1000); if (Math.floor(st.stay) % 10 === 0) { save(); updateWall(); } } lastT = now; }, 1000);
addEventListener('pagehide', save);

/* ── 8. 기록 팝업: 소지품·TMI 는 영수증 수첩으로 옮겼으니 팝업에서는 숨김 ── */
['modal-tmi', 'modal-inv'].forEach(id => { const el = $(id), sec = el && el.closest('.m-sec'); if (sec) sec.style.display = 'none'; });
const fv = $('modal-video-fallback'); if (fv) fv.textContent = '';

/* ── 시계 · 들어온 순간 ── */
setInterval(() => { const d = new Date(), c = $('hz-clock'); if (c && q.get('hour') == null) c.textContent = `${pad(d.getHours())}:${pad(d.getMinutes())}`; }, 30000);
function onEnter() {
  document.documentElement.dataset.in = '1';
  if (wall < (W.nameAt || 50) && !st.named) { st.named = 1; save(); setTimeout(() => say(fill(W.low, { name: guest() })), 14000); }
}
document.addEventListener('archive:enter', onEnter);
if (API.mainView && !API.mainView.classList.contains('opacity-0') && getComputedStyle(API.gateway).display === 'none') onEnter();
/* 새로 넣은 구역도 스크롤 등장 */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 });
[planSec, rcSec, dealSec].forEach(el => io.observe(el));
})();
