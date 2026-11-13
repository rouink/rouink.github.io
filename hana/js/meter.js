/* 엄하나 — 시작 화면 '1미터' (hana 전용 · shared 파일을 고치지 않음)
   data.js page.intro: 'meter' 일 때만 켜져요. (?intro=meter 로 미리보기)
   붙은 두 책상 사이 경계선. 손잡이를 당신 쪽(왼쪽)으로 끌면 1.00 m 가 줄어들고, 0.00 이 되면 들어가요. */
(() => {
const API = window.ARCHIVE_API; if (!API) return;
const D = window.ARCHIVE || {}, P = D.page || {}, q = new URLSearchParams(location.search);
if ((q.get('intro') || P.intro) !== 'meter') return;
const M = P.meter || {}, H = window.HANA;
const HAS_BGM = !!((D.config || {}).bgm);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const school = H ? H.isSchool() : false;
const hint = school ? (M.hintSchool || []) : (M.hintOff || []);
const stamp = H ? `${H.dayName} ${H.clock} · ${school ? '수업 중' : (H.weekend ? '주말' : '퇴근 뒤')}` : '';

const css = document.createElement('style');
css.textContent = `
#gateway.mt{position:fixed;inset:0;z-index:65;overflow:hidden;padding:0;display:block;background:var(--bg);color:var(--ink);font-family:var(--f-gothic);-webkit-tap-highlight-color:transparent;touch-action:pan-y}
.mt .mt-name{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.mt .desk{position:absolute;inset:0;display:grid;grid-template-columns:1fr 1fr}
.mt .desk i{display:block;position:relative;background:var(--desk-r)}
.mt .desk i:first-child{background:var(--desk-l)}
.mt .desk i::after{content:"";position:absolute;left:0;right:0;bottom:0;height:46%;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.72))}
.mt .line{position:absolute;left:50%;top:0;bottom:0;width:1.5px;background:var(--ink);transform:translateX(-50%);transition:opacity .6s var(--ease)}
.mt .line::before{content:"";position:absolute;left:50%;top:0;bottom:0;width:14px;transform:translateX(-50%);background:repeating-linear-gradient(180deg,transparent 0 22px,var(--ink) 22px 23px);opacity:.22}
.mt .seat{position:absolute;top:calc(22px + env(safe-area-inset-top))}
.mt .seat.l{left:22px}.mt .seat.r{right:22px;text-align:right}
.mt .seat b{display:block;margin-top:6px;font:700 15px/1.3 var(--f-display);letter-spacing:-.03em;color:var(--ink)}
.mt .stamp{position:absolute;left:0;right:0;top:calc(96px + env(safe-area-inset-top));text-align:center;letter-spacing:.14em}
.mt .num .lb{letter-spacing:.14em}
.mt .num{position:absolute;left:0;right:0;top:15vh;text-align:center;pointer-events:none}
.mt .num b{display:block;font:300 clamp(104px,34vw,150px)/1 var(--f-mono);letter-spacing:-.06em;color:var(--ink);font-variant-numeric:tabular-nums;transition:color .4s var(--ease)}
.mt .num small{display:block;margin-top:2px;font:500 20px/1 var(--f-mono);letter-spacing:.14em;color:var(--red)}
.mt .num .lb{margin-top:16px}
.mt.done .num b{color:var(--red)}
.mt .track{position:absolute;left:50%;top:calc(15vh + clamp(104px,34vw,150px) + 104px);width:var(--tl);height:72px;margin-left:calc(var(--tl) * -1);}
.mt .knob{position:absolute;right:-40px;top:-4px;width:80px;height:80px;cursor:grab;touch-action:none;transition:transform .5s var(--ease);filter:drop-shadow(0 10px 16px rgba(40,24,21,.16))}
.mt .knob svg{display:block;width:80px;height:80px;overflow:visible}
.mt .knob:active{cursor:grabbing}
.mt .knob:focus-visible{outline:2px solid var(--red);outline-offset:6px;border-radius:50%}
.mt .knob.drag{transition:none;filter:drop-shadow(0 16px 24px rgba(40,24,21,.22))}
.mt .knob .hand{transform-origin:40px 40px;transition:transform .5s var(--ease)}
.mt .knob.drag .hand{transition:none}
.mt .arrow{position:absolute;right:56px;top:35px;width:calc(var(--tl) - 76px);height:0;border-top:1.5px dashed var(--red);pointer-events:none;transition:opacity .4s var(--ease)}
.mt .arrow::before{content:"";position:absolute;left:-1px;top:-6px;width:10px;height:10px;border-left:1.5px solid var(--red);border-bottom:1.5px solid var(--red);transform:rotate(45deg)}
.mt.drag .arrow,.mt.done .arrow{opacity:0}
.mt .gh{position:absolute;left:22px;right:22px;bottom:calc(118px + env(safe-area-inset-bottom))}
.mt .gh h1{margin:0;font:800 40px/1.1 var(--f-display);letter-spacing:-.05em;color:var(--ink);word-break:keep-all}
.mt .gh h1 em{font-style:normal;color:var(--red)}
.mt .gh p{margin:12px 0 0;font:400 15px/1.7 var(--f-my);color:var(--muted);word-break:keep-all}
.mt .gh .say{display:none;margin:0;font:400 19px/1.6 var(--f-my);color:var(--ink)}
.mt .gh .say::before{content:"";display:block;width:34px;height:2px;background:var(--red);margin-bottom:14px}
.mt.done .gh h1,.mt.done .gh .hp{display:none}.mt.done .gh .say{display:block}
.mt .btns{position:absolute;left:22px;right:22px;bottom:calc(44px + env(safe-area-inset-bottom));display:flex;gap:8px;opacity:0;transform:translateY(10px);pointer-events:none;transition:opacity .6s var(--ease),transform .6s var(--ease)}
.mt.done .btns{opacity:1;transform:none;pointer-events:auto}
.mt .btns button{flex:1;height:52px;border:0;border-radius:8px;font:600 14.5px var(--f-gothic);cursor:pointer}
.mt .btns .on{background:var(--ink);color:var(--paper)}.mt .btns .off{background:var(--paper);color:var(--ink);border:1px solid var(--line)}
.mt .btns button:focus-visible{outline:2px solid var(--red);outline-offset:3px}
.mt .skip{position:absolute;right:22px;bottom:calc(16px + env(safe-area-inset-bottom));border:0;background:none;font:500 12px var(--f-gothic);color:var(--muted);text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:6px 0}
.mt.done .skip{display:none}
.mt .big{position:absolute;right:-10px;bottom:-30px;font:300 46vw/1 var(--f-mono);letter-spacing:-.08em;color:rgba(40,24,21,.045);pointer-events:none;user-select:none}
.mt.out{opacity:0;transition:opacity .7s var(--ease)}
@media (min-width:760px){
  .mt .num{top:18vh}
  .mt .track{top:calc(18vh + clamp(104px,34vw,150px) + 110px)}
  .mt .gh{left:50%;right:auto;width:560px;transform:translateX(-50%);bottom:150px;text-align:center}
  .mt .gh h1{font-size:52px}
  .mt .gh .say::before{margin-left:auto;margin-right:auto}
  .mt .btns{left:50%;right:auto;width:420px;transform:translate(-50%,10px);bottom:70px}
  .mt.done .btns{transform:translate(-50%,0)}
  .mt .seat.l{left:40px}.mt .seat.r{right:40px}
  .mt .big{font-size:420px;right:40px}
}
@media (max-height:680px){.mt .num{top:11vh}.mt .track{top:calc(11vh + clamp(104px,34vw,150px) + 96px)}.mt .gh{bottom:calc(110px + env(safe-area-inset-bottom))}.mt .gh h1{font-size:32px}}
@media (prefers-reduced-motion:reduce){.mt *{transition-duration:.01s !important;animation:none !important}}`;
document.head.appendChild(css);

const gate = API.gateway;
gate.className = 'mt'; gate.removeAttribute('style');
gate.style.setProperty('--tl', 'min(220px, calc(50vw - 54px))');
const [lk = '', ln = ''] = M.left || [], [rk = '', rn = ''] = M.right || [];
gate.innerHTML = `
<input type="text" id="username" class="mt-name" tabindex="-1" aria-hidden="true" autocomplete="off">
<div class="desk" aria-hidden="true"><i></i><i></i></div>
<div class="line" aria-hidden="true"></div>
<div class="seat l"><span class="label">${esc(lk)}</span><b>${esc(ln)}</b></div>
<div class="seat r"><span class="label">${esc(rk)}</span><b>${esc(rn)}</b></div>
<p class="stamp label" aria-hidden="true">${esc(stamp)}</p>
<div class="num" aria-hidden="true"><b id="mt-num">1.00</b><small>METER</small><div class="label lb">${esc(M.rule || '')}</div></div>
<div class="track"><div class="arrow" aria-hidden="true"></div><div class="knob" id="mt-knob" role="slider" tabindex="0" aria-label="${esc(M.aria || '')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="100" aria-valuetext="1.00 m">
  <svg viewBox="0 0 80 80" aria-hidden="true">
    <rect x="30" y="-2" width="20" height="16" rx="3" fill="#4A3330"/><rect x="30" y="66" width="20" height="16" rx="3" fill="#4A3330"/>
    <rect x="33" y="2" width="14" height="8" rx="1.5" fill="none" stroke="rgba(251,248,244,.35)" stroke-width="1"/><rect x="33" y="70" width="14" height="8" rx="1.5" fill="none" stroke="rgba(251,248,244,.35)" stroke-width="1"/>
    <rect x="70" y="36.5" width="5" height="7" rx="1.2" fill="#4A3330"/>
    <circle cx="40" cy="40" r="31" fill="#FFFDFB" stroke="#4A3330" stroke-width="2"/>
    <circle cx="40" cy="40" r="27.5" fill="none" stroke="rgba(74,51,48,.14)" stroke-width="1"/>
    <g stroke="#4A3330" stroke-linecap="round">${Array.from({length:12},(_,i)=>{const a=i*30*Math.PI/180,R1=i%3?24.5:22.5,R2=27;const x1=40+R1*Math.sin(a),y1=40-R1*Math.cos(a),x2=40+R2*Math.sin(a),y2=40-R2*Math.cos(a);return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke-width="${i%3?1:1.6}"${i===6?' stroke="#C94F43"':''}/>`;}).join('')}</g>
    <line class="hand" id="mt-hh" x1="40" y1="40" x2="40" y2="25" stroke="#2A1B18" stroke-width="2.4" stroke-linecap="round"/>
    <line class="hand" id="mt-mh" x1="40" y1="40" x2="40" y2="17" stroke="#2A1B18" stroke-width="1.6" stroke-linecap="round"/>
    <circle cx="40" cy="40" r="2.2" fill="#2A1B18"/><circle cx="40" cy="40" r=".9" fill="#FFFDFB"/>
  </svg>
</div></div>
<div class="big" aria-hidden="true">1m</div>
<div class="gh"><h1>${esc(hint[0] || '')}<br><em>${esc(hint[1] || '')}</em></h1><p class="hp">${esc(hint[2] || '')}</p><p class="say" id="mt-say"></p></div>
<div class="btns">${HAS_BGM
  ? `<button type="button" class="on" id="mt-on">${esc(M.on || '')}</button><button type="button" class="off" id="mt-off">${esc(M.off || '')}</button>`
  : `<button type="button" class="on" id="mt-off">${esc(M.only || '들어가기')}</button>`}</div>
<button type="button" class="skip" id="mt-skip">${esc(M.skip || '')}</button>`;
const $ = id => document.getElementById(id);
const knob = $('mt-knob'), num = $('mt-num');
let tl = 0, prog = 0, dragging = false, startX = 0, startP = 0, done = false, entered = false;
const trackLen = () => tl || (tl = knob.parentElement.getBoundingClientRect().width);
const T0 = { h: (H ? H.hour : new Date().getHours()) % 12, m: H ? H.minute : new Date().getMinutes() };
const A0 = { h: (T0.h + T0.m / 60) * 30, m: T0.m * 6 };           // 지금 시각의 바늘 각도
const A1 = { h: 180, m: 0 };                                       // 0.00 이 되면 6시 정각 (퇴근)
const lerpA = (a, b, t) => { let d = ((b - a) % 360 + 540) % 360 - 180; return a + d * t; };
const hh = document.getElementById('mt-hh'), mh = document.getElementById('mt-mh');
function paint() {
  const d = Math.max(0, 1 - prog);
  num.textContent = d.toFixed(2);
  knob.style.transform = `translateX(${-prog * trackLen()}px)`;
  if (hh) { hh.style.transform = `rotate(${lerpA(A0.h, A1.h, prog)}deg)`; mh.style.transform = `rotate(${lerpA(A0.m, A1.m, prog)}deg)`; }
  knob.setAttribute('aria-valuenow', String(Math.round(d * 100))); knob.setAttribute('aria-valuetext', d.toFixed(2) + ' m');
}
function finish() {
  if (done) return; done = true; prog = 1; paint(); gate.classList.remove('drag'); gate.classList.add('done');
  $('mt-say').textContent = school ? (M.doneSchool || '') : (M.doneOff || '');
  if (H && school) H.addRisk(6, 'gate');
  setTimeout(() => { const b = $('mt-on') || $('mt-off'); if (b) b.focus(); }, 400);
}
function release() {
  if (!dragging) return; dragging = false; knob.classList.remove('drag');
  if (prog >= .92) finish(); else { gate.classList.remove('drag'); prog = 0; paint(); }
}
knob.addEventListener('pointerdown', e => {
  if (done || (e.pointerType === 'mouse' && e.button)) return;
  dragging = true; startX = e.clientX; startP = prog; knob.classList.add('drag'); gate.classList.add('drag');
  try { knob.setPointerCapture(e.pointerId); } catch {}
  e.preventDefault();
});
knob.addEventListener('pointermove', e => { if (!dragging) return; prog = Math.max(0, Math.min(1, startP + (startX - e.clientX) / trackLen())); paint(); if (prog >= 1) release(); });
['pointerup', 'pointercancel', 'lostpointercapture'].forEach(t => knob.addEventListener(t, release));
knob.addEventListener('keydown', e => {
  if (done) return;
  if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); prog = Math.min(1, +(prog + .1).toFixed(2)); paint(); if (prog >= .999) finish(); }
  else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); prog = Math.max(0, +(prog - .1).toFixed(2)); paint(); }
  else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prog = 1; finish(); }
});
addEventListener('resize', () => { tl = 0; paint(); });
paint();

function go(withBgm) {
  if (entered) return; entered = true;
  gate.classList.add('out');
  setTimeout(() => { API.enter(withBgm && HAS_BGM, () => new Promise(res => setTimeout(res, RM ? 0 : 700))); }, RM ? 60 : 500);
}
if ($('mt-on')) $('mt-on').addEventListener('click', () => go(true));
$('mt-off').addEventListener('click', () => go(false));
$('mt-skip').addEventListener('click', () => { finish(); });
})();
