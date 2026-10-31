/* 주인하 — 시작 화면 '밤 현관 도어락' (auction 전용 · shared 파일을 고치지 않음)
   data.js page.intro: 'doorlock' 일 때만 켜져요. (?intro=doorlock 로 미리보기)
   page.doorlock: { top, hint, hintEn, knock, opened, lot, knocked, namePh, enterBgm, enterQuiet, sign }
   네 자리를 누르면 열려요 (도어락 번호를 아직 안 바꿨으니까). 0412 는 물건 번호라 다른 대답. 숫자 키보드도 돼요. */
(() => {
const API = window.ARCHIVE_API;
if (!API) return;
const D = window.ARCHIVE || {}, P = D.page || {}, q = new URLSearchParams(location.search);
if ((q.get('intro') || P.intro) !== 'doorlock') return;
const B = P.doorlock || {};
const HAS_BGM = !!((D.config || {}).bgm);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const br = t => esc(t).replace(/\n/g, '<br>');

const css = document.createElement('style');
css.textContent = `
#gateway.dl{position:fixed;inset:0;z-index:65;overflow:hidden;padding:0;display:block;color:#F1EAE0;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
  background:radial-gradient(80% 55% at 50% 38%,#231C16 0%,#140F0C 55%,#0B0908 100%)}
#gateway.dl::before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.08;mix-blend-mode:screen;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E")}
.dl .dl-plan{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:.5}
.dl .dl-slit{position:absolute;left:50%;top:0;bottom:0;width:2px;margin-left:-1px;background:linear-gradient(180deg,rgba(255,214,140,0),rgba(255,214,140,.55) 30%,rgba(255,214,140,.55) 70%,rgba(255,214,140,0));opacity:0;filter:blur(.4px);transition:opacity 1s cubic-bezier(.2,.8,.2,1),width 1.4s cubic-bezier(.2,.8,.2,1),margin 1.4s cubic-bezier(.2,.8,.2,1),box-shadow 1.4s ease}
.dl.open .dl-slit{opacity:1;width:46px;margin-left:-23px;box-shadow:0 0 80px 30px rgba(255,200,120,.18)}
.dl .dl-wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding:calc(20px + env(safe-area-inset-top)) 22px calc(18px + env(safe-area-inset-bottom));overflow-y:auto}
.dl .dl-top{flex:none;font-family:"Space Mono",monospace;font-size:10.5px;letter-spacing:.26em;color:rgba(241,234,224,.62);text-align:center}
.dl .dl-logo{flex:none;width:min(84vw,460px);height:auto;margin:22px 0 0;opacity:0;transform:translateY(14px);filter:blur(4px);transition:opacity 1.05s cubic-bezier(.2,.8,.2,1),transform 1.05s cubic-bezier(.2,.8,.2,1),filter 1.05s cubic-bezier(.2,.8,.2,1)}
.dl .dl-mid{flex:1;min-height:12px}
.dl .dl-lock{position:relative;flex:none;width:min(272px,78vw);padding:18px 18px 16px;border-radius:26px;background:linear-gradient(180deg,rgba(40,33,27,.82),rgba(18,14,11,.9));box-shadow:inset 0 0 0 1px rgba(241,234,224,.1),0 30px 60px rgba(0,0,0,.55);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transform:translateY(16px);transition:opacity 1s cubic-bezier(.2,.8,.2,1) .28s,transform 1s cubic-bezier(.2,.8,.2,1) .28s}
.dl.ready .dl-logo,.dl.ready .dl-lock{opacity:1;transform:none;filter:none}
.dl .dl-lock{max-height:380px;overflow:hidden}
.dl.shut .dl-lock{max-height:0;padding-top:0;padding-bottom:0;opacity:0;transform:scale(.96);transition:max-height .9s cubic-bezier(.2,.8,.2,1),padding .9s cubic-bezier(.2,.8,.2,1),opacity .5s ease,transform .7s ease}
.dl.shut .dl-mid{flex:.6}
.dl .dl-scr{display:flex;align-items:center;justify-content:space-between;height:40px;padding:0 14px;border-radius:12px;background:#0A0806;box-shadow:inset 0 0 0 1px rgba(217,166,46,.22)}
.dl .dl-scr span{font-family:"Space Mono",monospace;font-size:9.5px;letter-spacing:.24em;color:rgba(217,166,46,.75)}
.dl .dl-dots{display:flex;gap:10px}
.dl .dl-dots i{width:9px;height:9px;border-radius:50%;background:rgba(241,234,224,.14);transition:background .3s ease,box-shadow .3s ease}
.dl .dl-dots i.on{background:#D9A62E;box-shadow:0 0 0 4px rgba(217,166,46,.14)}
.dl.open .dl-dots i{background:#E9C66A}
.dl .dl-keys{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:14px}
.dl .dl-keys button{height:54px;border-radius:50%;font-family:"Space Mono",monospace;font-size:20px;color:#F1EAE0;background:radial-gradient(circle at 40% 35%,rgba(241,234,224,.08),rgba(241,234,224,0) 70%);box-shadow:inset 0 0 0 1px rgba(241,234,224,.12);transition:background .25s ease,box-shadow .25s ease,transform .15s ease}
.dl .dl-keys button:active,.dl .dl-keys button.hit{transform:scale(.94);box-shadow:inset 0 0 0 1px rgba(217,166,46,.7);background:rgba(217,166,46,.16)}
.dl .dl-keys button:focus-visible{outline:2px solid #D9A62E;outline-offset:2px}
.dl .dl-keys button.fn{font-size:13px;letter-spacing:.1em;color:rgba(241,234,224,.55)}
.dl .dl-foot{flex:none;width:100%;max-width:420px;text-align:center;margin-top:16px;min-height:150px}
.dl .dl-hint{margin:0;font-family:"Nanum Pen Script",cursive;font-size:25px;line-height:1.2;color:#E3B95A;transition:opacity .5s ease}
.dl .dl-hint span{display:block;margin-top:10px;font-family:"Space Mono",monospace;font-size:10px;letter-spacing:.3em;color:rgba(241,234,224,.5)}
.dl .dl-knock{margin-top:12px;padding:6px 10px;font-family:"Noto Sans KR",sans-serif;font-size:13px;color:rgba(241,234,224,.62);text-decoration:underline;text-underline-offset:4px}
.dl .dl-said{margin:0;font-family:"Hahmlet",serif;font-weight:700;font-size:clamp(22px,6.4vw,28px);letter-spacing:-.04em;line-height:1.35;color:#F7F1E7;min-height:0;opacity:0;transform:translateY(8px);transition:opacity .8s cubic-bezier(.2,.8,.2,1),transform .8s cubic-bezier(.2,.8,.2,1)}
.dl .dl-said.on{opacity:1;transform:none}
.dl .dl-in{display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:18px;opacity:0;transform:translateY(8px);transition:opacity .8s ease,transform .8s ease;pointer-events:none}
.dl .dl-in.on{opacity:1;transform:none;pointer-events:auto}
.dl .dl-in input{width:240px;padding:8px 2px;border:0;border-bottom:1px solid rgba(241,234,224,.3);border-radius:0;background:transparent;text-align:center;font-family:"Noto Sans KR",sans-serif;font-size:16px;color:#F1EAE0;outline:none;user-select:text;-webkit-user-select:text}
.dl .dl-in input:focus{border-bottom-color:#D9A62E}
.dl .dl-in input::placeholder{color:rgba(241,234,224,.42)}
.dl .dl-go{min-width:250px;margin-top:6px;padding:15px 26px;background:#D9A62E;color:#16110C;font-family:"Noto Sans KR",sans-serif;font-weight:700;font-size:15.5px;letter-spacing:.01em;box-shadow:0 14px 30px rgba(217,166,46,.18)}
.dl .dl-quiet{min-width:250px;padding:13px 26px;border:1px solid rgba(241,234,224,.28);font-family:"Noto Sans KR",sans-serif;font-weight:500;font-size:14.5px;color:#F1EAE0}
.dl .dl-go:focus-visible,.dl .dl-quiet:focus-visible{outline:2px solid #F1EAE0;outline-offset:3px}
.dl .dl-hide{opacity:0;pointer-events:none;height:0;margin:0;overflow:hidden}
.dl .dl-sign{margin-top:18px;font-family:"Space Mono",monospace;font-size:9.5px;letter-spacing:.3em;color:rgba(241,234,224,.38)}
.dl .dl-veil{position:absolute;inset:0;z-index:5;pointer-events:none;opacity:0;background:radial-gradient(60% 70% at 50% 45%,#FFE3B0 0%,#E9C892 30%,#2A2018 100%);transition:opacity .9s cubic-bezier(.2,.8,.2,1)}
.dl .dl-veil.on{opacity:1}
@media (min-height:820px){.dl .dl-logo{margin-top:40px}}
@media (min-width:900px){.dl .dl-wrap{padding-top:36px}.dl .dl-logo{width:min(520px,40vw)}}
@media (prefers-reduced-motion:reduce){.dl *{transition-duration:.01s !important}}`;
document.head.appendChild(css);

const gate = API.gateway;
gate.className = 'dl'; gate.removeAttribute('style');
const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'];
gate.innerHTML = `
<svg class="dl-plan" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <g fill="none" stroke="rgba(241,234,224,.07)" stroke-width="1"><path d="M60 0V800M340 0V800M60 600H150M250 600H340"/><path d="M250 600A100 100 0 0 0 150 500" stroke-dasharray="4 5"/><path d="M150 600V500"/><path d="M40 90H360M40 80V100M360 80V100"/></g>
  <text x="200" y="84" fill="rgba(217,166,46,.22)" font-family="Space Mono" font-size="10" text-anchor="middle" letter-spacing="3">1,200</text>
</svg>
<div class="dl-slit" aria-hidden="true"></div>
<div class="dl-wrap">
  <p class="dl-top">${esc(B.top || 'LOT No.0412')}</p>
  <img class="dl-logo" src="${esc(P.logo || '')}" alt="${esc(P.introTitle || '')}" decoding="async">
  <div class="dl-mid"></div>
  <div class="dl-lock" id="dl-lock" role="group" aria-label="도어락 번호판">
    <div class="dl-scr"><span>DOOR LOCK</span><div class="dl-dots" aria-hidden="true"><i></i><i></i><i></i><i></i></div></div>
    <div class="dl-keys">${keys.map(k => `<button type="button" data-k="${k}" class="${typeof k === 'number' ? '' : 'fn'}" aria-label="${k === '*' ? '지우기' : k === '#' ? '확인' : k}">${k === '*' ? 'CLR' : k === '#' ? 'OK' : k}</button>`).join('')}</div>
  </div>
  <div class="dl-foot">
    <p class="dl-hint" id="dl-hint">${br(B.hint || '')}<span>${esc(B.hintEn || 'ENTER YOUR CODE')}</span></p>
    <button type="button" class="dl-knock" id="dl-knock">${esc(B.knock || '노크하기')}</button>
    <p class="dl-said" id="dl-said" aria-live="polite"></p>
    <div class="dl-in" id="dl-in">
      <input type="text" id="username" placeholder="${esc(B.namePh || '이름')}" maxlength="10" autocomplete="off" aria-label="이름 (선택)">
      <button type="button" class="dl-go" id="dl-go">${esc(HAS_BGM ? (B.enterBgm || '소리 켜고 들어가기') : (B.enterQuiet || '들어가기'))}</button>
      ${HAS_BGM ? `<button type="button" class="dl-quiet" id="dl-quiet">${esc(B.enterQuiet || '조용히 들어가기')}</button>` : ''}
    </div>
    ${B.sign ? `<p class="dl-sign">${esc(B.sign)}</p>` : ''}
  </div>
</div>
<div class="dl-veil" id="dl-veil"></div>`;
const $ = id => document.getElementById(id);
const dots = [...gate.querySelectorAll('.dl-dots i')];
const logo = gate.querySelector('.dl-logo');
const ready = () => requestAnimationFrame(() => gate.classList.add('ready'));
if (logo.complete) ready(); else { logo.addEventListener('load', ready); logo.addEventListener('error', ready); setTimeout(ready, 1600); }

/* 도어락 소리: 짧은 전자음 (코드로 합성 · 파일 없음) */
let actx = null;
function beep(freq, at, len, vol) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume();
    const t = actx.currentTime + (at || 0), o = actx.createOscillator(), g = actx.createGain();
    o.type = 'square'; o.frequency.value = freq; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || .045, t + .008); g.gain.exponentialRampToValueAtTime(.0001, t + (len || .07));
    o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + (len || .07) + .02);
  } catch {}
}
const unlockTune = () => { [1046, 1318, 1568, 2093].forEach((f, i) => beep(f, i * .09, .11, .04)); beep(392, .46, .09, .05); };

let code = '', opened = false, done = false;
function paint() { dots.forEach((d, i) => d.classList.toggle('on', i < code.length)); }
function say(t) { const s = $('dl-said'); s.textContent = t; requestAnimationFrame(() => s.classList.add('on')); }
function open(kind) {
  if (opened) return; opened = true;
  if (kind !== 'knock') unlockTune(); else { beep(180, 0, .05, .06); beep(170, .16, .05, .06); }
  gate.classList.add('open'); dots.forEach(d => d.classList.add('on'));
  $('dl-hint').classList.add('dl-hide'); $('dl-knock').classList.add('dl-hide');
  setTimeout(() => say(kind === 'lot' ? (B.lot || '') : kind === 'knock' ? (B.knocked || B.opened || '') : (B.opened || '')), RM ? 30 : 650);
  setTimeout(() => gate.classList.add('shut'), RM ? 0 : 700);
  setTimeout(() => { $('dl-in').classList.add('on'); }, RM ? 60 : 1300);
}
function press(k) {
  if (opened) return;
  const b = gate.querySelector(`[data-k="${k}"]`); if (b) { b.classList.add('hit'); setTimeout(() => b.classList.remove('hit'), 140); }
  if (k === '*') { code = ''; paint(); beep(660, 0, .05); return; }
  if (k === '#') { if (code.length === 4) open(code === '0412' ? 'lot' : 'code'); else beep(330, 0, .12); return; }
  if (code.length >= 4) return;
  code += String(k); paint(); beep(880, 0, .05);
  if (code.length === 4) setTimeout(() => open(code === '0412' ? 'lot' : 'code'), 260);
}
gate.querySelector('.dl-keys').addEventListener('click', e => { const b = e.target.closest('[data-k]'); if (b) press(b.dataset.k === '*' || b.dataset.k === '#' ? b.dataset.k : +b.dataset.k); });
$('dl-knock').addEventListener('click', () => open('knock'));
document.addEventListener('keydown', e => {
  if (done || opened || getComputedStyle(gate).display === 'none') return;
  if (/^[0-9]$/.test(e.key)) { press(+e.key); } else if (e.key === 'Backspace') { code = code.slice(0, -1); paint(); } else if (e.key === 'Enter') press('#');
});
function go(withAudio) {
  if (done) return; done = true;
  API.enter(!!withAudio, () => new Promise(res => {
    $('dl-veil').classList.add('on');
    setTimeout(() => { gate.style.transition = 'opacity .9s cubic-bezier(.2,.8,.2,1)'; gate.style.opacity = '0'; setTimeout(res, RM ? 0 : 900); }, RM ? 0 : 750);
  }));
}
$('dl-go').addEventListener('click', () => go(HAS_BGM));
if ($('dl-quiet')) $('dl-quiet').addEventListener('click', () => go(false));
$('username').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(HAS_BGM); } });
})();
