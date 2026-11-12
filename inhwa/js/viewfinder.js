/*! © 2026 페르르. All rights reserved. 무단 복제·배포·재사용 금지 */
/* 도인화 — 시작 화면 '뷰파인더' (inhwa 전용 · shared 파일을 고치지 않음)
   data.js page.intro: 'viewfinder' 일 때만 켜져요. (?intro=viewfinder 로 미리보기)
   그녀의 카메라로 본다. 길게 누르면 흐린 화면에 초점이 맞고(반셔터), 끝까지 누르고 있으면 셔터가 내려가며 들어간다.
   · 손을 떼면 초점이 다시 풀린다. · '그냥 들어가기'로 바로 들어갈 수도 있다.
   · 움직임 줄이기 설정: 흐림만 바뀌고 셔터 막은 생략. */
(() => {
const API = window.ARCHIVE_API;
if (!API) return;
const D = window.ARCHIVE || {}, P = D.page || {}, q = new URLSearchParams(location.search);
if ((q.get('intro') || P.intro) !== 'viewfinder') return;
const V = P.viewfinder || {}, F = P.film || {};
const HAS_BGM = !!((D.config || {}).bgm);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const HOLD = 1150, BLUR = 16;

const gate = API.gateway;
gate.className = 'vf'; gate.removeAttribute('style');
const R = V.read || [];
gate.innerHTML = `
<input type="text" id="username" class="vf-name" tabindex="-1" aria-hidden="true" autocomplete="off">
<div class="vf-img" aria-hidden="true"><img id="vf-img" src="${esc(V.img || '')}" alt="" style="object-position:${esc(V.pos || '50% 30%')}"></div>
<div class="vf-shade" aria-hidden="true"></div>
<div class="vf-top">
  <span class="vf-roll">${esc(V.roll || '').replace(/^(.*?·\s*)/, '<span class="pre">$1</span>')}</span>
  ${HAS_BGM ? `<div class="vf-snd" role="group" aria-label="소리"><button type="button" data-snd="1" aria-pressed="true">${esc(V.on || '소리 켜고')}</button><button type="button" data-snd="0" aria-pressed="false">${esc(V.off || '조용히')}</button></div>` : ''}
</div>
<div class="vf-frame" id="vf-frame" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<b class="vf-af" id="vf-af" aria-hidden="true"></b>
<div class="vf-read" aria-hidden="true">${R.map(r => `<span>${esc(r)}</span>`).join('')}<span class="vf-cnt">▸ 01/${esc(F.total || 36)}</span><span class="vf-meter"><i id="vf-meter"></i></span></div>
<div class="vf-panel">
  <img class="vf-logo" src="assets/logo.svg" alt="${esc(P.introTitle || '도인화')}">
  <p class="vf-line">${esc(V.line || '')}</p>
  <div class="vf-act">
    <button type="button" class="vf-btn" id="vf-btn" aria-describedby="vf-msg"><svg viewBox="0 0 80 80" aria-hidden="true"><circle class="tr" cx="40" cy="40" r="36"/><circle class="pg" id="vf-ring" cx="40" cy="40" r="36"/></svg><span class="cap"></span><span class="sr-only">${esc(V.hold || '')}</span></button>
    <div class="vf-tx"><b id="vf-msg" aria-live="polite">${esc(V.hold || '')}</b><small>끝까지 누르고 있으면 찍혀요</small></div>
  </div>
  <button type="button" class="vf-skip" id="vf-skip">${esc(V.skip || '그냥 들어가기')} →</button>
</div>
<div class="vf-curtain" aria-hidden="true"><i></i><i></i></div>`;
const $ = id => document.getElementById(id);
const img = $('vf-img'), af = $('vf-af'), ring = $('vf-ring'), msg = $('vf-msg'), meter = $('vf-meter'), btn = $('vf-btn');
const CIRC = 2 * Math.PI * 36; ring.style.strokeDasharray = CIRC; ring.style.strokeDashoffset = CIRC;

/* 초점 상자를 사진 속 얼굴 자리에 맞춤 (object-fit: cover 계산) */
function placeAF() {
  const pn = gate.querySelector('.vf-panel'); if (pn) gate.style.setProperty('--ph', (innerWidth < 760 ? pn.offsetHeight : 0) + 'px');
  const box = img.parentNode.getBoundingClientRect(), iw = img.naturalWidth || 1800, ih = img.naturalHeight || 1350;
  const sc = Math.max(box.width / iw, box.height / ih), dw = iw * sc, dh = ih * sc;
  const [px, py] = String(V.pos || '50% 30%').split(/\s+/).map(v => parseFloat(v) / 100);
  const [u, v] = V.af || [.5, .3];
  const x = (box.width - dw) * px + u * dw, y = (box.height - dh) * py + v * dh;
  af.style.left = Math.max(40, Math.min(box.width - 40, x)) + 'px';
  af.style.top = Math.max(110, Math.min(box.height * .62, y)) + 'px';
}
img.complete ? placeAF() : img.addEventListener('load', placeAF);
addEventListener('resize', placeAF);
requestAnimationFrame(() => requestAnimationFrame(() => gate.classList.add('ready')));

/* 소리 고르기 — 소리 켜고를 고른 채 처음 누르는 순간 음악 시작 (휴대폰은 터치 순간에 틀어야 소리가 나요) */
let sound = HAS_BGM, started = false;
gate.querySelectorAll('[data-snd]').forEach(b => b.addEventListener('click', () => {
  sound = b.dataset.snd === '1';
  gate.querySelectorAll('[data-snd]').forEach(x => x.setAttribute('aria-pressed', x === b));
  if (!sound && API.isPlaying()) API.setBgm(false);
}));
let actx = null;
function click(tone) {   // 셔터 소리: 짧은 잡음 두 번 (소리 켜고일 때만)
  if (!sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const t0 = actx.currentTime;
    [0, tone ? 0 : .07].forEach((dt, k) => {
      const len = .035, buf = actx.createBuffer(1, actx.sampleRate * len, actx.sampleRate), d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      const src = actx.createBufferSource(), bp = actx.createBiquadFilter(), g = actx.createGain();
      src.buffer = buf; bp.type = 'bandpass'; bp.frequency.value = tone ? 3200 : (k ? 1800 : 2600); bp.Q.value = 1.4;
      g.gain.value = tone ? .12 : .32;
      src.connect(bp); bp.connect(g); g.connect(actx.destination); src.start(t0 + dt);
    });
  } catch {}
}

/* 반셔터: 누르는 동안 p 가 0 → 1, 손을 떼면 다시 0 으로 */
let p = 0, holding = false, last = 0, raf = 0, done = false, beeped = false;
const ease = t => t * t * (3 - 2 * t);
function paint() {
  const e = ease(p);
  img.style.filter = `blur(${(BLUR * (1 - e)).toFixed(2)}px) brightness(${(1.08 - .08 * e).toFixed(3)})`;
  ring.style.strokeDashoffset = CIRC * (1 - p);
  meter.style.width = (p * 100).toFixed(1) + '%';
  af.classList.toggle('near', p > .55); af.classList.toggle('lock', p >= 1);
}
function tick(t) {
  const dt = Math.min(64, t - (last || t)); last = t;
  p = holding ? Math.min(1, p + dt / HOLD) : Math.max(0, p - dt / 650);
  paint();
  if (p >= 1 && !beeped) { beeped = true; click(true); msg.textContent = V.focused || ''; setTimeout(shoot, RM ? 120 : 380); }
  if (!done && (holding || p > 0)) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
}
function start(e) {
  if (done) return;
  if (e && e.type === 'pointerdown' && e.button) return;
  if (e && e.cancelable && e.type === 'pointerdown') e.preventDefault();
  holding = true; gate.classList.add('holding'); msg.textContent = V.holding || '';
  if (sound && !started && HAS_BGM) { started = true; API.setBgm(true); }
  if (!raf) raf = requestAnimationFrame(tick);
}
function stop() {
  if (!holding || done) return;
  holding = false; gate.classList.remove('holding');
  if (p < 1) msg.textContent = p > .08 ? (V.let || '') : (V.hold || '');
  if (!raf) raf = requestAnimationFrame(tick);
}
[btn, $('vf-frame')].forEach(el => {
  el.addEventListener('pointerdown', start);
  el.addEventListener('contextmenu', e => e.preventDefault());
});
['pointerup', 'pointercancel'].forEach(t => addEventListener(t, stop));
btn.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse') stop(); });
btn.addEventListener('keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } });
btn.addEventListener('keyup', e => { if (e.key === ' ' || e.key === 'Enter') stop(); });

function shoot() {
  if (done) return; done = true;
  click(false);
  gate.classList.add('shot');
  const withBgm = sound && HAS_BGM;
  API.enter(withBgm, () => new Promise(res => {
    gate.classList.add('out');
    setTimeout(res, RM ? 0 : 900);
  }));
}
$('vf-skip').addEventListener('click', () => {
  if (done) return;
  if (sound && HAS_BGM && !started) { started = true; API.setBgm(true); }
  p = 1; paint(); done = true; gate.classList.add('out');
  API.enter(sound && HAS_BGM, () => new Promise(res => setTimeout(res, RM ? 0 : 700)));
});
paint();
})();
