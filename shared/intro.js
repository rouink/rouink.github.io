/* PROJECT ARCHIVE — 시작 화면 효과 (모든 작품 공통)
   작품 data.js 의 page.intro 에 효과 이름을 적으면 적용돼요. 비우거나 'classic' 이면 기본 입장 화면.
   주소 뒤에 ?intro=이름 을 붙이면 data.js 를 고치지 않고 미리 볼 수 있어요. (예: ?intro=burn)
   효과음은 전부 코드로 만든 소리라 저작권 걱정이 없어요. 이미지 파일도 쓰지 않아요.
   선택적으로 쓰는 글귀(data.js page): introTitle, introKicker, introLine(효과 속 한 줄), introCaller(전화·알림 보낸 사람) */
(() => {
const A = window.ARCHIVE_API; if (!A) return;
const D = window.ARCHIVE || {}, P = D.page || {}, CH = D.characters || {}, C1 = CH[Object.keys(CH)[0]] || {};
const EFFECTS = {}, reg = (n, def) => { EFFECTS[n] = def; };
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = id => document.getElementById(id);
const escI = t => String(t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const rand = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v)), lerp = (a, b, t) => a + (b - a) * t, TAU = Math.PI * 2;
const cssVar = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const rgbVar = (n, a = 1) => `rgb(${cssVar(n)} / ${a})`;
let styleDone = {};
const css = (id, text) => { if (styleDone[id]) return; styleDone[id] = 1; const s = document.createElement('style'); s.textContent = text; document.head.appendChild(s); };

css('ix-base', `
.ix { position:fixed; inset:0; z-index:50; overflow:hidden; display:flex; align-items:center; justify-content:center; padding:24px; -webkit-tap-highlight-color:transparent; touch-action:manipulation; }
.ix-paper { background:var(--bg, rgb(var(--bg-rgb))); color:var(--ink); }
.ix-dark { background:radial-gradient(90% 70% at 50% 35%, #1D2B48 0%, #0F1828 78%); color:#E6EEF8; }
.ix-clear { background:transparent; color:var(--ink); }
.ix-fx { position:absolute; inset:0; width:100%; height:100%; pointer-events:none; }
.ix-stage { position:absolute; inset:0; }
.ix-card { position:relative; z-index:10; width:100%; max-width:24rem; text-align:center; display:flex; flex-direction:column; align-items:center; gap:18px; pointer-events:none; }
.ix-card > * { pointer-events:auto; }
.ix-card.top { position:absolute; top:max(7vh,28px); left:50%; transform:translateX(-50%); width:calc(100% - 48px); }
.ix-card.bottom { position:absolute; bottom:max(6vh,24px); left:50%; transform:translateX(-50%); width:calc(100% - 48px); }
.ix-kicker { font:500 12px var(--f-title, "Cormorant Garamond", serif); letter-spacing:.38em; text-transform:uppercase; color:var(--gold-ink, currentColor); margin:0; }
.ix-dark .ix-kicker { color:inherit; opacity:.8; }
.ix-title { font-family:var(--f-intro, var(--f-display, "Cinzel Decorative","Song Myung",serif)); font-weight:200; font-synthesis:none; font-size:clamp(40px,12vw,54px); letter-spacing:.12em; margin:0; line-height:1.1; }
.ix-card .ix-title::after { content:""; display:block; width:160px; height:9px; margin:20px auto 0; background:linear-gradient(var(--gold,#B89A6A),var(--gold,#B89A6A)) left center/calc(50% - 10px) 1px no-repeat, linear-gradient(var(--gold,#B89A6A),var(--gold,#B89A6A)) right center/calc(50% - 10px) 1px no-repeat; }
.ix-paper .ix-title, .ix-clear .ix-title { color:var(--ink); }
.ix-input { width:72%; background:transparent; border:0; border-bottom:1px solid var(--line, currentColor); outline:none; padding:8px 0; text-align:center; font:17px var(--f-text, "Gowun Batang"),serif; color:inherit; border-radius:0; }
.ix-input::placeholder { color:inherit; opacity:.45; }
.ix-hint { font:14px/1.7 var(--f-text, "Gowun Batang"),serif; margin:0; opacity:.8; min-height:1.7em; word-break:keep-all; }
.ix-sound { font:13px "Gowun Batang",serif; display:inline-flex; gap:8px; align-items:center; cursor:pointer; opacity:.8; user-select:none; }
.ix-sound input { width:16px; height:16px; accent-color:currentColor; }
.ix-sound.corner { position:absolute; z-index:30; right:14px; bottom:max(14px,env(safe-area-inset-bottom)); }
.ix-btn { font:14px var(--f-text, "Gowun Batang"),serif; letter-spacing:.06em; min-height:48px; padding:0 28px; border:1px solid currentColor; background:transparent; color:inherit; cursor:pointer; }
.ix-help { position:absolute; z-index:20; left:14px; top:14px; max-width:200px; padding:12px 14px; font:13px/1.7 "Gowun Batang",serif; border:1px solid rgb(var(--stone-300)); background:rgb(var(--paper-rgb) / .92); color:var(--ink); box-shadow:0 6px 18px rgba(0,0,0,.08); }
.ix-help b { font-family:"Cinzel",serif; letter-spacing:.15em; font-size:11px; display:block; margin-bottom:4px; opacity:.7; }
.ix-dark .ix-help { background:rgba(20,30,52,.85); color:#E6EEF8; border-color:#3A4C6E; }
@media (min-width:768px) { .ix-help { left:auto; right:28px; top:50%; transform:translateY(-50%); max-width:230px; } }
`);

// ===== 효과음 (코드로 합성) =====
let sfxCtx = null;
const ac = () => { try { sfxCtx = sfxCtx || new (window.AudioContext || window.webkitAudioContext)(); if (sfxCtx.state === 'suspended') sfxCtx.resume(); return sfxCtx; } catch { return null; } };
const noiseBuf = (a, dur) => { const b = a.createBuffer(1, Math.max(1, a.sampleRate * dur | 0), a.sampleRate), d = b.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; return b; };
function nz(dur, { type = 'lowpass', f = 2000, f2, q = 1, gain = .5, at = 0, attack = .002 } = {}) {
  const a = ac(); if (!a) return; const t = a.currentTime + at, s = a.createBufferSource(), fl = a.createBiquadFilter(), v = a.createGain();
  s.buffer = noiseBuf(a, dur); fl.type = type; fl.frequency.setValueAtTime(f, t); if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur); fl.Q.value = q;
  v.gain.setValueAtTime(.0001, t); v.gain.exponentialRampToValueAtTime(gain, t + attack); v.gain.exponentialRampToValueAtTime(.0001, t + dur);
  s.connect(fl).connect(v).connect(a.destination); s.start(t); s.stop(t + dur + .02);
}
function tone(freq, dur, { type = 'sine', gain = .25, at = 0, f2, attack = .005 } = {}) {
  const a = ac(); if (!a) return; const t = a.currentTime + at, o = a.createOscillator(), v = a.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + dur);
  v.gain.setValueAtTime(.0001, t); v.gain.exponentialRampToValueAtTime(gain, t + attack); v.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(v).connect(a.destination); o.start(t); o.stop(t + dur + .02);
}
const SFX = {
  shot() { nz(.45, { f: 3800, f2: 400, gain: .9 }); tone(140, .3, { f2: 40, gain: .8 }); },
  beep() { tone(880, .11, { gain: .22 }); tone(1320, .11, { gain: .22, at: .12 }); },
  crack() { for (let i = 0; i < 3; i++) nz(.07, { type: 'bandpass', f: 1800 + i * 600, q: 2, gain: .6, at: i * .06 }); },
  drop() { tone(520, .4, { f2: 140, gain: .3 }); },
  key() { nz(.05, { type: 'highpass', f: 2500, gain: .5 }); tone(180, .05, { gain: .25, type: 'square' }); },
  ding() { tone(2093, 1.2, { gain: .18 }); tone(4186, .8, { gain: .06 }); },
  thump() { tone(90, .25, { f2: 45, gain: .7 }); nz(.12, { f: 600, gain: .35 }); },
  click() { nz(.03, { type: 'highpass', f: 3000, gain: .45 }); },
  clack() { nz(.05, { type: 'bandpass', f: 1400, q: 3, gain: .6 }); nz(.06, { type: 'bandpass', f: 900, q: 3, gain: .5, at: .09 }); },
  rip(d = .6) { nz(d, { type: 'bandpass', f: 1600, f2: 3200, q: .8, gain: .45, attack: .03 }); },
  fire(d = 1.8) { nz(d, { f: 900, gain: .25, attack: .2 }); for (let i = 0; i < 9; i++) nz(.03, { type: 'highpass', f: 2500, gain: .25, at: rand(.1, d) }); },
  whoosh(d = .6) { nz(d, { type: 'bandpass', f: 400, f2: 2400, q: .7, gain: .35, attack: .15 }); },
  hiss(d = .5) { nz(d, { type: 'highpass', f: 5000, gain: .25, attack: .05 }); },
  pop() { nz(.12, { f: 2500, gain: .9 }); tone(120, .15, { f2: 50, gain: .6 }); },
  glass(i = 1) { for (let k = 0; k < 4 + i * 4; k++) tone(rand(2500, 6000), rand(.08, .3), { gain: .07 + i * .02, at: k * rand(.01, .04) }); nz(.1 + i * .15, { type: 'highpass', f: 3000, gain: .3 + i * .1 }); },
  chime(notes = [784, 988, 1175, 1568], gap = .14) { notes.forEach((n, i) => { tone(n, 1.2, { gain: .14, at: i * gap }); tone(n * 2, .6, { gain: .04, at: i * gap }); }); },
  sw() { nz(.02, { type: 'highpass', f: 4000, gain: .6 }); tone(1800, .03, { gain: .2, type: 'square' }); },
  page() { nz(.35, { type: 'bandpass', f: 2600, q: .6, gain: .25, attack: .05 }); },
  ring(at = 0) { [0, .45].forEach(o => { tone(440, .38, { gain: .12, at: at + o }); tone(480, .38, { gain: .12, at: at + o }); }); },
  splash() { nz(.5, { f: 1200, f2: 300, gain: .4, attack: .01 }); tone(300, .2, { f2: 120, gain: .2 }); },
  heart() { tone(70, .12, { gain: .7 }); tone(60, .12, { gain: .5, at: .16 }); },
  spray() { nz(.6, { type: 'highpass', f: 6000, gain: .3, attack: .03 }); },
  coin() { tone(1300, .08, { gain: .2 }); tone(1950, .3, { gain: .15, at: .07 }); },
  ratchet() { for (let i = 0; i < 8; i++) nz(.02, { type: 'bandpass', f: 2200, q: 4, gain: .4, at: i * .06 }); },
  tape() { nz(1.6, { f: 1800, gain: .06, attack: .2 }); }
};

// ===== 부팅 =====
function boot(name) {
  const E = EFFECTS[name]; if (!E) return;
  const gw = A.gateway;
  gw.className = `ix ix-${E.look || 'paper'} intro-${name}`; gw.removeAttribute('style');
  const card = E.card === false ? '' : `
    <div class="ix-card ${E.cardPos || ''}" id="ix-card">
      ${E.kicker === false ? '' : `<p class="ix-kicker">${escI(P.introKicker || 'CONFIDENTIAL ARCHIVE')}</p>`}
      ${E.title === false ? '' : `<h1 class="ix-title">${escI(P.introTitle || P.brand || '기록실 입장')}</h1>`}
      ${E.input === false ? '' : `<input type="text" id="username" class="ix-input" placeholder="이름을 입력하세요" maxlength="10" aria-label="이름" autocomplete="off">`}
      ${E.confirm ? `<button type="button" class="ix-btn" id="ix-confirm">${escI(E.confirm)}</button>` : ''}
      <p class="ix-hint" id="ix-hint" aria-live="polite">${escI(E.hint || '')}</p>
    </div>`;
  gw.innerHTML = `<canvas class="ix-fx" id="ix-fx"></canvas><div class="ix-stage" id="ix-stage"></div>${card}
    <label class="ix-sound corner"><input type="checkbox" id="ix-sound" checked> 소리</label>
    ${E.help ? `<div class="ix-help" id="ix-help"><b>HOW TO</b>${E.help}</div>` : ''}`;
  if (!$('username')) gw.insertAdjacentHTML('beforeend', '<input type="hidden" id="username" value="">');
  const fx = $('ix-fx'), g = fx.getContext('2d'), stage = $('ix-stage');
  let W = innerWidth, H = innerHeight, DPR = Math.min(2, devicePixelRatio || 1);
  const layers = [];
  const size = (c, gg) => { c.width = W * DPR; c.height = H * DPR; gg.setTransform(DPR, 0, 0, DPR, 0, 0); };
  size(fx, g);
  const resizers = [];
  addEventListener('resize', () => { W = innerWidth; H = innerHeight; size(fx, g); layers.forEach(([c, gg]) => size(c, gg)); resizers.forEach(f => f()); });
  let primed = false, busy = false;
  const K = {
    E, gw, fx, g, stage, RM, rand, clamp, lerp, TAU, escI, rgbVar, cssVar, SFX: {},
    get W() { return W; }, get H() { return H; }, get DPR() { return DPR; },
    card: $('ix-card'),
    hint(t) { const h = $('ix-hint'); if (h) h.textContent = t; },
    name() { return ($('username') && $('username').value.trim()) || ''; },
    sound() { const s = $('ix-sound'); return !s || s.checked; },
    line: P.introLine || (D.ticker && D.ticker[0]) || '오래 기다렸어요. 들어와요.',
    caller: P.introCaller || C1.name || P.brand || '이이레',
    charImg: (C1.gallery && C1.gallery[0] && C1.gallery[0].img) || C1.poster || '',
    title: P.introTitle || P.brand || 'PROJECT ARCHIVE',
    layer(z = 1) { const c = document.createElement('canvas'); c.className = 'ix-fx'; c.style.zIndex = z; stage.appendChild(c); const gg = c.getContext('2d'); size(c, gg); layers.push([c, gg]); return { c, g: gg }; },
    el(html, parent = stage) { const t = document.createElement('div'); t.innerHTML = html.trim(); const e = t.firstElementChild; parent.appendChild(e); return e; },
    css, onResize(f) { resizers.push(f); },
    wait: ms => new Promise(r => setTimeout(r, RM ? Math.min(ms, 150) : ms)),
    loop(fn) { let on = true, last = performance.now(); const f = now => { if (!on) return; const dt = Math.min(.05, (now - last) / 1000); last = now; if (fn(dt, now) === false) on = false; else requestAnimationFrame(f); }; requestAnimationFrame(f); return () => { on = false; }; },
    // 첫 터치에서 오디오 준비 (+ 소리 켜짐이면 배경음 시작) — iOS 재생 규칙 때문에 터치 순간에 해야 함
    prime() { if (primed) return; primed = true; ac(); if (K.sound() && !E.noMusicPrime) A.setBgm(true); },
    hideCard(ms = 300) { if (K.card) { K.card.style.transition = `opacity ${ms}ms`; K.card.style.opacity = '0'; K.card.style.pointerEvents = 'none'; } },
    peek() { A.peek(); },   // 사이트를 미리 아래에 깔아 둠 (닦기·태우기처럼 너머가 보여야 할 때)
    go(exit) { if (busy) return; busy = true; K.prime(); A.enter(K.sound(), exit || (() => K.fade(600))); },
    fade(ms = 600) { return new Promise(r => { gw.style.transition = `opacity ${ms}ms ease`; gw.style.opacity = '0'; gw.style.pointerEvents = 'none'; setTimeout(r, ms); }); },
    split(ms = 850) { return gw.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 50% 0 50%)' }], { duration: RM ? 200 : ms, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' }).finished; },
    splitV(ms = 850) { return gw.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(50% 0 50% 0)' }], { duration: RM ? 200 : ms, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' }).finished; },
    slideUp(ms = 800) { return gw.animate([{ transform: 'none' }, { transform: 'translateY(-100%)' }], { duration: RM ? 200 : ms, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' }).finished; },
    holeOut(x, y, ms = 900) { return new Promise(r => { const R = Math.hypot(Math.max(x, W - x), Math.max(y, H - y)) + 20, t0 = performance.now();
      const f = now => { const k = clamp((now - t0) / (RM ? 200 : ms), 0, 1), e = 1 - Math.pow(1 - k, 3), rr = e * R; const m = `radial-gradient(circle at ${x}px ${y}px, transparent ${rr}px, #000 ${rr + 1}px)`; gw.style.webkitMaskImage = m; gw.style.maskImage = m; k < 1 ? requestAnimationFrame(f) : r(); }; requestAnimationFrame(f); }); },
    flash(color = '#fff', ms = 180, a = .8) { const f = K.el(`<div style="position:absolute;inset:0;background:${color};z-index:40;pointer-events:none;opacity:${a}"></div>`, gw); f.animate([{ opacity: a }, { opacity: 0 }], { duration: ms, fill: 'forwards' }); setTimeout(() => f.remove(), ms + 50); },
    shake(px = 7, ms = 320) { if (RM) return; gw.animate([{ transform: 'none' }, { transform: `translate(${-px}px,${px * .6}px)` }, { transform: `translate(${px}px,${-px * .5}px)` }, { transform: `translate(${-px * .5}px,${px * .4}px)` }, { transform: 'none' }], { duration: ms }); },
    isUI: t => !!(t.closest && t.closest('input, label, button:not([data-ix]), a, .ix-help')),
    onTap(fn, el = gw) { el.addEventListener('pointerdown', e => { if (K.isUI(e.target)) return; K.prime(); fn(e.clientX, e.clientY, e); }); },
    drag(el, { start, move, end }) {
      let on = false, sx = 0, sy = 0; if (el !== gw) el.dataset.ixdrag = '1';
      let cap = false;
      el.addEventListener('pointerdown', e => { if (el === gw && (K.isUI(e.target) || e.target.closest('[data-ixdrag]'))) return; on = true; cap = false; sx = e.clientX; sy = e.clientY;
        if (el !== gw) { try { el.setPointerCapture(e.pointerId); cap = true; } catch {} }   // 화면 전체(gw)는 실제로 끌 때만 잡아야 안쪽 버튼 클릭이 살아 있음
        K.prime(); start && start(e.clientX, e.clientY, e); });
      el.addEventListener('pointermove', e => { if (!on) return; if (!cap && Math.hypot(e.clientX - sx, e.clientY - sy) > 6) { try { el.setPointerCapture(e.pointerId); } catch {} cap = true; } if (move) move(e.clientX, e.clientY, e.clientX - sx, e.clientY - sy, e); });
      const up = e => { if (!on) return; on = false; end && end(e.clientX, e.clientY, e.clientX - sx, e.clientY - sy, e); };
      el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    },
    // 원을 그리듯 돌린 각도(라디안)를 누적해 알려 줌
    circular(el, cx, cy, onTurn) {
      let last = null;
      K.drag(el, { start: (x, y) => { last = Math.atan2(y - cy(), x - cx()); }, move: (x, y) => { const a = Math.atan2(y - cy(), x - cx()); let d = a - last; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; last = a; onTurn(d); }, end: () => { last = null; } });
    },
    // 종이 질감 (섬유·얼룩·결) 캔버스
    paper(w, h, { base = '#F3EBDD', lines = 0, margin = false, aged = .5, seed = 1 } = {}) {
      const c = document.createElement('canvas'); c.width = w; c.height = h; const p = c.getContext('2d');
      p.fillStyle = base; p.fillRect(0, 0, w, h);
      const im = p.getImageData(0, 0, w, h), d = im.data;
      for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - .5) * 14; d[i] += n; d[i + 1] += n; d[i + 2] += n * .9; }
      p.putImageData(im, 0, 0);
      p.globalAlpha = .06; p.strokeStyle = '#6b5a40';
      for (let i = 0; i < w * h / 900; i++) { const x = Math.random() * w, y = Math.random() * h, a = Math.random() * TAU, l = rand(3, 14); p.lineWidth = rand(.3, .8); p.beginPath(); p.moveTo(x, y); p.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); p.stroke(); }
      p.globalAlpha = 1;
      if (aged) { for (let i = 0; i < 6; i++) { const x = Math.random() * w, y = Math.random() * h, r = rand(40, 160), gr = p.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(150,110,60,${.05 * aged})`); gr.addColorStop(1, 'rgba(150,110,60,0)'); p.fillStyle = gr; p.fillRect(0, 0, w, h); }
        const vg = p.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .35, w / 2, h / 2, Math.max(w, h) * .75); vg.addColorStop(0, 'rgba(120,90,50,0)'); vg.addColorStop(1, `rgba(120,90,50,${.22 * aged})`); p.fillStyle = vg; p.fillRect(0, 0, w, h); }
      if (lines) { p.strokeStyle = 'rgba(90,120,170,.28)'; p.lineWidth = 1; for (let y = lines * 2.2; y < h; y += lines) { p.beginPath(); p.moveTo(0, y); p.lineTo(w, y); p.stroke(); } }
      if (margin) { p.strokeStyle = 'rgba(200,80,80,.35)'; p.beginPath(); p.moveTo(56, 0); p.lineTo(56, h); p.stroke(); }
      return c;
    },
    // 색종이·빛가루 터뜨리기 (fx 캔버스 위)
    burst(x, y, { n = 90, colors = ['#F6C453', '#F28CA6', '#8FD3F4', '#B9A4E6', '#9BE0B5'], speed = 520, life = 1.6, shape = 'rect', gravity = 600 } = {}) {
      const ps = Array.from({ length: n }, () => { const a = rand(0, TAU), s = rand(.3, 1) * speed; return { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - speed * .4, r: rand(3, 7), rot: rand(0, TAU), vr: rand(-8, 8), c: colors[Math.random() * colors.length | 0], t: 0 }; });
      K.loop(dt => { g.clearRect(0, 0, W, H); let alive = 0;
        ps.forEach(p => { p.t += dt; if (p.t > life) return; alive++; p.vy += gravity * dt; p.vx *= .99; p.x += p.vx * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
          g.save(); g.globalAlpha = 1 - p.t / life; g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c;
          if (shape === 'rect') g.fillRect(-p.r, -p.r * .45, p.r * 2, p.r * .9); else { g.beginPath(); g.arc(0, 0, p.r * .6, 0, TAU); g.fill(); } g.restore(); });
        return alive > 0; });
    }
  };
  Object.keys(SFX).forEach(k => { K.SFX[k] = (...a) => { if (K.sound()) SFX[k](...a); }; });
  gw.addEventListener('pointerdown', e => { if (!e.target.closest('.ix-sound')) K.prime(); }, { capture: true });
  gw.addEventListener('keydown', e => { if (!e.target.closest('.ix-sound')) K.prime(); }, { capture: true });
  $('ix-sound').addEventListener('change', e => { if (!primed) return; if (e.target.checked) { if (!E.noMusicPrime) A.setBgm(true); } else if (A.isPlaying()) A.setBgm(false); });
  E.mount(K);
}

// ===== 시안: 총알 · 지문 · 봉랍 · 잉크 =====
reg('bullet', { hint: '화면을 터치하면 입장합니다', mount(K) {
  K.css('ix-bullet', `.intro-bullet { cursor:crosshair; }`);
  K.onTap((x, y) => K.go(async () => {
    K.SFX.shot(); K.flash('#fff', 160, .75); K.shake();
    const g = K.g, R = 8 + Math.random() * 3, n = 11 + (Math.random() * 5 | 0); g.save(); g.translate(x, y); g.strokeStyle = 'rgba(40,28,18,.55)'; g.lineCap = 'round';
    for (let i = 0; i < n; i++) { let a = i / n * K.TAU + Math.random() * .3, r = R; const len = 30 + Math.random() * 70; g.lineWidth = 1.6; g.beginPath(); g.moveTo(Math.cos(a) * r, Math.sin(a) * r); while (r < len) { r += 6 + Math.random() * 10; a += (Math.random() - .5) * .35; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); g.lineWidth *= .85; } g.stroke(); }
    const b = g.createRadialGradient(0, 0, R * .6, 0, 0, R * 3); b.addColorStop(0, 'rgba(60,35,15,.7)'); b.addColorStop(1, 'rgba(60,35,15,0)'); g.fillStyle = b; g.beginPath(); g.arc(0, 0, R * 3, 0, K.TAU); g.fill();
    g.fillStyle = '#F4ECDC'; g.beginPath(); for (let i = 0; i <= 14; i++) { const a = i / 14 * K.TAU, r = R * (1.15 + Math.random() * .45); i ? g.lineTo(Math.cos(a) * r, Math.sin(a) * r) : g.moveTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill();
    const h = g.createRadialGradient(-1, -1, 1, 0, 0, R); h.addColorStop(0, '#000'); h.addColorStop(.75, '#1a120c'); h.addColorStop(1, '#3a2a1c'); g.fillStyle = h; g.beginPath(); g.arc(0, 0, R, 0, K.TAU); g.fill(); g.restore();
    K.hint('— 입장 —'); await K.wait(900); await K.fade(600);
  }));
} });

reg('ink', { hint: '화면을 터치하면 입장합니다', mount(K) {
  K.css('ix-ink', `.ix-ink-blot { position:absolute; width:40px; height:40px; border-radius:50%; background:var(--ink); z-index:20; pointer-events:none; filter:url(#ink-edge); }`);
  K.onTap((x, y) => K.go(async () => {
    K.SFX.drop(); const ink = K.el(`<div class="ix-ink-blot" style="left:${x}px;top:${y}px"></div>`, K.gw);
    await ink.animate([{ transform: 'translate(-50%,-50%) scale(.2)' }, { transform: `translate(-50%,-50%) scale(${Math.hypot(K.W, K.H) * 2.4 / 40})` }], { duration: K.RM ? 150 : 1100, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'forwards' }).finished;
    K.hideCard(0); await K.fade(700);
  }));
} });

reg('fingerprint', { look: 'dark', hint: '이름을 적고, 지문을 길게 눌러 주세요', mount(K) {
  K.css('ix-fp', `.ix-fp { display:block; margin:0 auto; padding:8px; border-radius:999px; background:transparent; border:0; touch-action:none; user-select:none; -webkit-user-select:none; -webkit-touch-callout:none; cursor:pointer; }
    .ix-fp svg { display:block; overflow:visible; } .ix-fp path { fill:none; stroke:#9FD1FF; stroke-width:2.2; stroke-linecap:round; filter:drop-shadow(0 0 3px rgba(159,209,255,.8)); }
    .ix-fp .ring { fill:rgba(159,209,255,.06); stroke:#2E4468; stroke-width:2; } .ix-fp .prog { fill:none; stroke:#9FD1FF; stroke-width:3; transform:rotate(-90deg); transform-origin:60px 75px; }
    .ix-fp:not(.scan):not(.ok) g { opacity:.35; } .ix-fp:not(.scan):not(.ok) path { stroke-dashoffset:0 !important; } .ix-fp.ok .prog, .ix-fp.ok path { stroke:#7CF0B4; }`);
  const fp = K.el(`<button type="button" data-ix class="ix-fp" aria-label="지문 인식 — 길게 누르기"><svg viewBox="0 0 120 150" width="120" height="150"><circle class="ring" cx="60" cy="75" r="68"/><circle class="prog" cx="60" cy="75" r="68"/><g></g></svg></button>`, K.card);
  K.card.insertBefore(fp, document.getElementById('ix-hint'));
  const rg = fp.querySelector('g'), paths = [];
  for (let i = 0; i < 9; i++) { const rx = 8 + i * 5.6, ry = 11 + i * 7.2;
    [[-200, -20], [10, 160]].forEach(([a0, a1], k) => { const s0 = (a0 + i * 9 * (k ? 1 : -1)) * Math.PI / 180, s1 = (a1 - i * 6) * Math.PI / 180; let d = '';
      for (let t = 0; t <= 24; t++) { const a = s0 + (s1 - s0) * t / 24; d += (t ? 'L' : 'M') + (60 + Math.cos(a) * rx).toFixed(1) + ' ' + (78 + Math.sin(a) * ry).toFixed(1); }
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('d', d); rg.appendChild(p); paths.push(p); }); }
  paths.forEach(p => { const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; p.dataset.l = L; });
  const prog = fp.querySelector('.prog'), C = K.TAU * 68; prog.style.strokeDasharray = C; prog.style.strokeDashoffset = C;
  let t0 = 0, raf = 0, done = false;
  const paint = k => { paths.forEach((p, i) => { const kk = K.clamp(k * 1.25 - i / paths.length * .25, 0, 1); p.style.strokeDashoffset = p.dataset.l * (1 - kk); }); prog.style.strokeDashoffset = C * (1 - k); };
  const tick = now => { const k = Math.min(1, (now - t0) / 1400); paint(k); if (k < 1) raf = requestAnimationFrame(tick); else finish(); };
  const start = e => { e.preventDefault(); if (done) return; const u = document.getElementById('username');
    if (!K.name()) { K.hint('이름을 먼저 입력해 주세요'); u.focus(); u.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 260 }); return; }
    fp.classList.add('scan'); K.hint('인식 중…'); t0 = performance.now(); raf = requestAnimationFrame(tick); };
  const stop = () => { if (done || !raf) return; cancelAnimationFrame(raf); raf = 0; fp.classList.remove('scan'); paint(0); K.hint('조금 더 길게 눌러 주세요'); };
  const finish = () => { done = true; raf = 0; fp.classList.add('ok'); if (navigator.vibrate) navigator.vibrate(40); K.SFX.beep(); K.hint(`인증 완료 · WELCOME, ${K.name()}`); K.go(async () => { await K.wait(800); await K.fade(600); }); };
  fp.addEventListener('pointerdown', start); ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => fp.addEventListener(ev, stop));
  fp.addEventListener('contextmenu', e => e.preventDefault());
} });

reg('seal', { hint: '봉인을 눌러 편지를 여세요', mount(K) {
  K.css('ix-seal', `.ix-seal { width:108px; height:108px; margin:4px auto; border:0; position:relative; cursor:pointer; display:grid; place-items:center;
    background:radial-gradient(circle at 35% 30%, #D24A4A 0%, #9E1F27 45%, #6A1118 100%); box-shadow:0 6px 14px rgba(90,10,15,.35), inset 0 -6px 12px rgba(0,0,0,.35), inset 0 6px 10px rgba(255,255,255,.18);
    clip-path:polygon(50% 0,62% 4%,74% 2%,82% 12%,94% 18%,96% 32%,100% 44%,96% 58%,98% 72%,88% 82%,80% 94%,66% 96%,52% 100%,38% 96%,24% 98%,16% 86%,4% 78%,4% 64%,0 50%,4% 36%,2% 24%,12% 14%,22% 4%,36% 4%); transition:transform .5s; }
    .ix-seal span { font:700 42px "Cinzel Decorative","Song Myung",serif; color:#F3C9B8; text-shadow:0 -1px 0 rgba(0,0,0,.35); }
    .ix-seal svg { position:absolute; inset:0; opacity:0; } .ix-seal path { fill:none; stroke:#2A0508; stroke-width:2.5; stroke-dasharray:60; stroke-dashoffset:60; }
    .ix-seal.broken svg { opacity:1; } .ix-seal.broken path { animation:ixcrack .35s forwards; } .ix-seal.broken { transform:scale(.92) rotate(-4deg); } @keyframes ixcrack { to { stroke-dashoffset:0; } }`);
  const s = K.el(`<button type="button" data-ix class="ix-seal" aria-label="봉인 열기"><span>${K.escI([...K.title][0] || '✦')}</span><svg viewBox="0 0 100 100"><path d="M50 50 L22 18 M50 50 L84 30 M50 50 L70 88 M50 50 L18 70 M50 50 L52 8"/></svg></button>`, K.card);
  K.card.insertBefore(s, document.getElementById('ix-hint'));
  s.addEventListener('click', () => K.go(async () => { K.SFX.crack(); s.classList.add('broken'); K.hint('— 봉인 해제 —'); await K.wait(650); K.hideCard(0); await K.split(); }));
} });

// ================= 묶음 1 · 종이·기록 =================

// 1. 불에 그을린 편지 — 터치한 곳부터 실제처럼 불길이 번지며 종이가 타 들어가고, 그 너머로 사이트가 드러남
reg('burn', { look: 'clear', hint: '편지 아무 곳이나 터치해 불을 붙이세요', mount(K) {
  K.peek();
  const L = K.layer(1), S = 5;                       // S: 불길 계산 격자 크기(px)
  let paper, gw, gh, tgrid, noise, seeds = [], t0 = null;
  const mk = () => {
    paper = K.paper(K.W * K.DPR, K.H * K.DPR, { base: '#EEDFC0', aged: .9 });
    const p = paper.getContext('2d'); p.scale(K.DPR, K.DPR);
    p.fillStyle = 'rgba(70,45,20,.55)'; p.font = '17px "Song Myung","Gowun Batang",serif'; p.textAlign = 'center';
    const lines = [K.line, '', '— ' + K.title + ' —']; lines.forEach((l, i) => p.fillText(l, K.W / 2, K.H * .78 + i * 30));
    gw = Math.ceil(K.W / S) + 1; gh = Math.ceil(K.H / S) + 1; tgrid = new Float32Array(gw * gh).fill(1e9);
    const cw = Math.ceil(gw / 7) + 2, chh = Math.ceil(gh / 7) + 2, coarse = Array.from({ length: cw * chh }, () => Math.random()), fine = Array.from({ length: gw * gh }, () => Math.random());
    noise = new Float32Array(gw * gh);
    for (let y = 0; y < gh; y++) for (let x = 0; x < gw; x++) { const fx = x / 7, fy = y / 7, ix = fx | 0, iy = fy | 0, tx = fx - ix, ty = fy - iy, v = (a, b) => coarse[(iy + b) * cw + ix + a];
      const c = (v(0, 0) * (1 - tx) + v(1, 0) * tx) * (1 - ty) + (v(0, 1) * (1 - tx) + v(1, 1) * tx) * ty; noise[y * gw + x] = c * .85 + fine[y * gw + x] * .15; }
  };
  mk();
  const draw = now => {
    const g = L.g, T = t0 === null ? -1 : (now - t0) / 1000;
    g.clearRect(0, 0, K.W, K.H); g.drawImage(paper, 0, 0, K.W, K.H);
    if (T < 0) return 1;   // 아직 불 붙기 전(또는 타이머 오차) — 끝나지 않음
    const mask = document.createElement('canvas'); mask.width = gw; mask.height = gh; const mg = mask.getContext('2d'), mi = mg.createImageData(gw, gh), md = mi.data;
    const col = document.createElement('canvas'); col.width = gw; col.height = gh; const cg = col.getContext('2d'), ci = cg.createImageData(gw, gh), cd = ci.data;
    const glow = document.createElement('canvas'); glow.width = gw; glow.height = gh; const gg = glow.getContext('2d'), gi = gg.createImageData(gw, gh), gd = gi.data;
    let left = 0, front = [];
    for (let i = 0; i < gw * gh; i++) {
      const dt = T - tgrid[i];
      if (dt >= 0) { md[i * 4 + 3] = 255; if (dt < .22) { const k = 1 - dt / .22, fl = .55 + .45 * Math.random(); gd[i * 4] = 255; gd[i * 4 + 1] = 70 + 110 * k * k; gd[i * 4 + 2] = 10 + 30 * k; gd[i * 4 + 3] = 200 * k * fl; if (Math.random() < .004) front.push(i); } }
      else { left++; const ahead = -dt; if (ahead < .7) { const k = 1 - ahead / .7; cd[i * 4] = 62 - 50 * k; cd[i * 4 + 1] = 36 - 30 * k; cd[i * 4 + 2] = 14 - 10 * k; cd[i * 4 + 3] = 255 * Math.pow(k, 2.2);
        if (ahead < .08) { const kk = 1 - ahead / .08; gd[i * 4] = 255; gd[i * 4 + 1] = 90 + 120 * kk * Math.random(); gd[i * 4 + 2] = 20; gd[i * 4 + 3] = 230 * kk * (.6 + .4 * Math.random()); } } }
    }
    mg.putImageData(mi, 0, 0); cg.putImageData(ci, 0, 0); gg.putImageData(gi, 0, 0);
    g.imageSmoothingEnabled = true;
    g.drawImage(col, 0, 0, gw * S, gh * S);                          // 그을음
    g.globalCompositeOperation = 'destination-out'; g.drawImage(mask, 0, 0, gw * S, gh * S);   // 타서 사라진 곳
    g.globalCompositeOperation = 'lighter'; g.filter = 'blur(6px)'; g.globalAlpha = .7; g.drawImage(glow, 0, 0, gw * S, gh * S); g.filter = 'blur(1.5px)'; g.globalAlpha = 1; g.drawImage(glow, 0, 0, gw * S, gh * S); g.filter = 'none';   // 불씨(바깥 번짐 + 선명한 불테)
    g.globalCompositeOperation = 'source-over';
    front.forEach(i => sparks.push({ x: (i % gw) * S, y: (i / gw | 0) * S, vx: K.rand(-20, 20), vy: K.rand(-160, -60), t: 0, life: K.rand(.5, 1.1) }));
    return left;
  };
  const sparks = [], smoke = [];
  const fxLoop = dt => { const g = K.g; g.clearRect(0, 0, K.W, K.H);
    for (let i = sparks.length - 1; i >= 0; i--) { const s = sparks[i]; s.t += dt; if (s.t > s.life) { sparks.splice(i, 1); if (Math.random() < .3) smoke.push({ x: s.x, y: s.y, r: K.rand(10, 24), t: 0 }); continue; }
      s.vx += K.rand(-60, 60) * dt; s.x += s.vx * dt; s.y += s.vy * dt; const a = 1 - s.t / s.life; g.fillStyle = `rgba(255,${180 + 60 * a | 0},80,${a})`; g.beginPath(); g.arc(s.x, s.y, 1.2 + a, 0, K.TAU); g.fill(); }
    for (let i = smoke.length - 1; i >= 0; i--) { const m = smoke[i]; m.t += dt; if (m.t > 2) { smoke.splice(i, 1); continue; } m.y -= 30 * dt; m.r += 14 * dt; const gr = g.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r); gr.addColorStop(0, `rgba(90,85,80,${.12 * (1 - m.t / 2)})`); gr.addColorStop(1, 'rgba(90,85,80,0)'); g.fillStyle = gr; g.fillRect(m.x - m.r, m.y - m.r, m.r * 2, m.r * 2); }
  };
  const ignite = (x, y) => { const T = t0 === null ? 0 : (performance.now() - t0) / 1000; seeds.push([x, y, T]);
    const speed = 210;
    for (let gy = 0; gy < gh; gy++) for (let gx = 0; gx < gw; gx++) { const i = gy * gw + gx, d = Math.hypot(gx * S - x, gy * S - y), t = T + Math.pow(d / speed, .85) * .9 + noise[i] * .7 - .2; if (t < tgrid[i]) tgrid[i] = Math.max(T, t); } };
  draw(performance.now());
  K.onResize(() => { mk(); draw(performance.now()); });
  K.onTap((x, y) => {
    if (t0 === null) {
      t0 = performance.now(); ignite(x, y); K.hideCard(250); K.SFX.fire(2.6); K.SFX.whoosh(.8);
      K.go(() => new Promise(res => { K.loop((dt, now) => { fxLoop(dt); const left = draw(now); if (!left && !sparks.length) { res(); return false; } }); }));
    } else ignite(x, y);
  });
} });

// 2. 찢어진 일기장 — 아래로 쓸어내린 자리를 따라 종이가 결대로 찢어지고, 양쪽으로 떨어져 나감
reg('tear', { look: 'clear', card: true, cardPos: 'bottom', kicker: false, title: false, input: false, hint: '일기장을 위에서 아래로 쓸어내려 찢어 주세요', mount(K) {
  K.peek();
  K.css('ix-tear', `.ix-tear-half { position:absolute; inset:0; width:100%; height:100%; filter:drop-shadow(0 6px 10px rgba(60,40,20,.25)); will-change:transform; }
    .ix-tear-arrow { position:absolute; left:50%; top:22%; transform:translateX(-50%); font:28px serif; color:rgb(var(--accent-700)); animation:ixdown 1.4s ease-in-out infinite; z-index:5; pointer-events:none; }
    @keyframes ixdown { 0% { opacity:0; transform:translate(-50%,-16px); } 40% { opacity:1; } 100% { opacity:0; transform:translate(-50%,40px); } }`);
  const page = () => { const c = K.paper(K.W * K.DPR, K.H * K.DPR, { base: '#F7F1E3', lines: 30 * K.DPR, margin: false, aged: .35 }), p = c.getContext('2d'); p.scale(K.DPR, K.DPR);
    p.strokeStyle = 'rgba(200,80,80,.35)'; p.beginPath(); p.moveTo(46, 0); p.lineTo(46, K.H); p.stroke();
    p.fillStyle = 'rgba(40,40,70,.75)'; p.font = '18px "Song Myung","Gowun Batang",serif'; p.textAlign = 'left';
    const d = new Date(), dl = `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
    p.fillText(dl, 60, 30 * 2.2 + 30 * 1 - 8); p.font = '22px "Song Myung","Gowun Batang",serif'; p.fillText(K.title, 60, 30 * 2.2 + 30 * 2 - 8);
    p.font = '17px "Song Myung","Gowun Batang",serif'; const words = [...K.line]; let line = '', y = 30 * 2.2 + 30 * 4 - 8;
    words.forEach(ch => { if (p.measureText(line + ch).width > K.W - 90) { p.fillText(line, 60, y); line = ''; y += 30; } line += ch; }); p.fillText(line, 60, y);
    return c; };
  let pg = page();
  const base = K.layer(1); base.g.drawImage(pg, 0, 0, K.W, K.H);
  const arrow = K.el(`<div class="ix-tear-arrow">↓</div>`);
  let path = null, done = false, ripOn = false;
  const build = x0 => { const pts = [[x0, -4]]; let x = x0, y = -4; while (y < K.H + 8) { y += K.rand(7, 13); x += K.rand(-7, 7) + (x0 - x) * .08; pts.push([x, y]); } return pts; };
  const fibers = (g, pts, upto, side) => { g.save(); g.lineCap = 'round';
    for (let i = 1; i < pts.length && pts[i][1] <= upto; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = K.rand(2.2, 4.2); g.beginPath(); g.moveTo(x0 + side, y0); g.lineTo(x1 + side, y1); g.stroke();
      g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = .6; for (let k = 0; k < 3; k++) { const t = Math.random(), fx = x0 + (x1 - x0) * t, fy = y0 + (y1 - y0) * t; g.beginPath(); g.moveTo(fx, fy); g.lineTo(fx + side * K.rand(1, 4) + K.rand(-1, 1), fy + K.rand(-2, 2)); g.stroke(); }
      g.strokeStyle = 'rgba(120,95,60,.18)'; g.lineWidth = 1; g.beginPath(); g.moveTo(x0 + side * 3, y0); g.lineTo(x1 + side * 3, y1); g.stroke(); }
    g.restore(); };
  const drawProgress = upto => { const g = K.g; g.clearRect(0, 0, K.W, K.H); if (!path) return; fibers(g, path, upto, -1.2); fibers(g, path, upto, 1.2);
    g.strokeStyle = 'rgba(60,40,20,.35)'; g.lineWidth = .8; g.beginPath(); path.forEach(([x, y], i) => { if (y <= upto) i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.stroke(); };
  const finish = () => { if (done) return; done = true; arrow.remove(); K.hideCard(200); K.SFX.rip(.5);
    K.go(async () => {
      const halves = [-1, 1].map(side => { const c = document.createElement('canvas'); c.className = 'ix-tear-half'; c.width = K.W * K.DPR; c.height = K.H * K.DPR; const g = c.getContext('2d'); g.scale(K.DPR, K.DPR);
        g.beginPath(); if (side < 0) { g.moveTo(-10, -10); path.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(-10, K.H + 10); } else { g.moveTo(K.W + 10, -10); path.forEach(([x, y]) => g.lineTo(x, y)); g.lineTo(K.W + 10, K.H + 10); } g.closePath(); g.save(); g.clip(); g.drawImage(pg, 0, 0, K.W, K.H); g.restore();
        fibers(g, path, K.H + 20, side * 1.2); K.stage.appendChild(c); return [c, side]; });
      base.c.remove(); K.g.clearRect(0, 0, K.W, K.H);
      await Promise.all(halves.map(([c, side]) => c.animate([{ transform: 'none' }, { transform: `translate(${side * 14}px, 6px) rotate(${side * 2}deg)`, offset: .25 }, { transform: `translate(${side * 120}vw, 30vh) rotate(${side * 14}deg)` }], { duration: K.RM ? 200 : 1300, easing: 'cubic-bezier(.55,0,.75,.35)', fill: 'forwards' }).finished));
      await K.fade(200);
    }); };
  K.drag(K.gw, {
    start: (x, y) => { if (done) return; path = build(x); if (!ripOn) { ripOn = true; K.SFX.rip(1.2); } },
    move: (x, y, dx, dy) => { if (done || !path) return; const upto = Math.max(0, y); drawProgress(upto); if (upto > K.H * .7) finish(); },
    end: (x, y, dx, dy) => { if (done || !path) return; if (Math.abs(dy) < 12 || y > K.H * .35) { drawProgress(K.H); finish(); } else { ripOn = false; } }
  });
  K.onResize(() => { pg = page(); base.g.clearRect(0, 0, K.W, K.H); base.g.drawImage(pg, 0, 0, K.W, K.H); });
} });

// 4. 타자기 서명 — 이름을 입력하면 한 글자씩 타자기로 찍히고, 종이가 위로 밀려 올라감
reg('typewriter', { cardPos: 'top', confirm: '서명하기', hint: '이름을 적고 서명하기를 누르세요', mount(K) {
  K.css('ix-tw', `.ix-tw-sheet { position:absolute; left:50%; top:62%; transform:translate(-50%,-50%); width:min(340px,84vw); min-height:230px; padding:26px 26px 30px; text-align:left;
      background:#FBF8F0; box-shadow:0 10px 28px rgba(60,45,25,.22), inset 0 0 40px rgba(170,140,90,.12); font:16px/1.9 "Courier Prime","Courier New","Nanum Gothic Coding",monospace; color:#25211c; z-index:2; }
    .ix-tw-sheet h3 { margin:0 0 14px; font:700 11px "Courier Prime","Courier New",monospace; letter-spacing:.3em; color:#7a6a55; border-bottom:1px dashed #b8a98f; padding-bottom:8px; }
    .ix-tw-ch { display:inline-block; white-space:pre; }
    .ix-tw-roller { position:absolute; left:50%; top:calc(62% + 132px); transform:translateX(-50%); width:min(400px,94vw); height:30px; border-radius:15px; z-index:3;
      background:linear-gradient(#3b3631,#1e1b18 55%,#4a443d); box-shadow:0 6px 16px rgba(0,0,0,.35); }
    .ix-tw-roller::before, .ix-tw-roller::after { content:''; position:absolute; top:-6px; width:26px; height:42px; border-radius:8px; background:linear-gradient(#5b544c,#2a2622); }
    .ix-tw-roller::before { left:-10px; } .ix-tw-roller::after { right:-10px; }
    .ix-tw-caret { display:inline-block; width:9px; height:1.1em; background:#25211c; vertical-align:-3px; animation:ixblink 1s steps(1) infinite; } @keyframes ixblink { 50% { opacity:0; } }`);
  const sheet = K.el(`<div class="ix-tw-sheet"><h3>ARCHIVE · ACCESS FORM</h3><div id="tw-out"><span class="ix-tw-caret"></span></div></div>`);
  K.el(`<div class="ix-tw-roller" aria-hidden="true"></div>`);
  const out = sheet.querySelector('#tw-out');
  let started = false;
  const type = async (text) => { for (const ch of text) { const s = document.createElement('span'); s.className = 'ix-tw-ch'; s.textContent = ch;
      s.style.transform = `translateY(${K.rand(-.8, .8)}px) rotate(${K.rand(-1.2, 1.2)}deg)`; s.style.opacity = K.rand(.78, 1); s.style.textShadow = '0 0 .6px rgba(0,0,0,.6)';
      out.insertBefore(s, out.lastChild); if (ch !== ' ') K.SFX.key(); await K.wait(K.rand(55, 95)); } };
  const nl = async () => { out.insertBefore(document.createElement('br'), out.lastChild); K.SFX.ratchet(); await K.wait(380); };
  const run = () => { if (started) return; started = true; const nm = K.name() || 'GUEST';
    document.getElementById('ix-confirm').style.visibility = 'hidden'; document.getElementById('username').disabled = true; K.hint('');
    const d = new Date();
    K.go(async () => {
      await type(`NAME  : ${nm}`); await nl(); await type(`DATE  : ${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}.`); await nl();
      await type('열람을 승인합니다.'); K.SFX.ding(); await K.wait(700);
      K.SFX.ratchet(); K.hideCard(200);
      await sheet.animate([{ transform: 'translate(-50%,-50%)' }, { transform: 'translate(-50%,-160vh)' }], { duration: K.RM ? 200 : 1200, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' }).finished;
      await K.fade(500);
    }); };
  document.getElementById('ix-confirm').addEventListener('click', run);
  document.getElementById('username').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
} });

// 6. 서고 카드 — 실제 도서 대출 카드처럼: 이름이 타자로 찍히고, 보라색 날짜 도장이 쿵
reg('library', { cardPos: 'bottom', kicker: false, title: false, confirm: '대출하기', hint: '이름을 적고 대출하기를 누르세요', mount(K) {
  const bg = K.paper(560, 900, { base: '#E8D6AA', aged: .8 }).toDataURL('image/jpeg', .85);
  K.css('ix-lib', `.ix-lib { position:absolute; left:50%; top:42%; transform:translate(-50%,-50%) rotate(-1.2deg); width:min(300px,74vw); aspect-ratio:3/4.6; z-index:2;
      background:url(${bg}) center/cover; box-shadow:0 12px 30px rgba(70,50,20,.28), 0 1px 0 rgba(255,255,255,.5) inset; padding:14px 14px 10px; color:#2f2a4a; font-family:"Courier Prime","Courier New",monospace; overflow:hidden; }
    .ix-lib .hd { display:flex; justify-content:space-between; font:11px "Courier Prime","Courier New",monospace; color:#3d3768; }
    .ix-lib .ttl { margin:8px 0 2px; font:700 13px "Cinzel","Gowun Batang",serif; letter-spacing:.06em; color:#2b2552; border-bottom:1px solid #3d3768; padding-bottom:4px; }
    .ix-lib .au { font:11px "Courier Prime","Courier New",monospace; color:#3d3768; margin-bottom:6px; }
    .ix-lib table { width:100%; border-collapse:collapse; font-size:11px; table-layout:fixed; }
    .ix-lib th { font:700 9px "Cinzel","Courier Prime","Courier New",serif; letter-spacing:.08em; color:#3d3768; border-bottom:2px solid #b8323a; padding:3px 2px; text-align:left; }
    .ix-lib td { height:26px; border-bottom:1px solid rgba(60,80,150,.45); border-right:1px solid rgba(60,80,150,.3); padding:0 4px; white-space:nowrap; overflow:hidden; position:relative; }
    .ix-lib td:last-child { border-right:0; }
    .ix-lib .old { color:rgba(110,70,140,.55); font:700 10px "Courier Prime","Courier New",monospace; transform:rotate(-2deg); display:inline-block; }
    .ix-lib .pen { color:rgba(70,70,80,.55); font:14px "Song Myung",serif; }
    .ix-lib .ty { display:inline-block; }
    .ix-lib .stamp { position:absolute; left:2px; top:2px; padding:1px 5px; border:2px solid rgba(110,40,140,.85); color:rgba(110,40,140,.9); font:700 10px "Courier Prime","Courier New",monospace; letter-spacing:.05em; transform:rotate(-4deg) scale(2.2); opacity:0;
      -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='30'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.3'/%3E%3C/filter%3E%3Crect width='80' height='30' filter='url(%23n)'/%3E%3C/svg%3E"); mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='30'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -1.6 1.3'/%3E%3C/filter%3E%3Crect width='80' height='30' filter='url(%23n)'/%3E%3C/svg%3E"); }
    .ix-lib .foot { position:absolute; left:14px; right:14px; bottom:8px; font:9px "Courier Prime","Courier New",monospace; color:#5a5480; display:flex; justify-content:space-between; }
    .ix-lib .hole { position:absolute; left:50%; bottom:22px; width:12px; height:12px; margin-left:-6px; border-radius:50%; background:rgba(40,30,20,.55); box-shadow:inset 0 1px 2px rgba(0,0,0,.6); }`);
  const d = new Date(), M = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'], today = `${M[d.getMonth()]} ${String(d.getDate()).padStart(2, '0')} ${d.getFullYear()}`;
  const rows = [['MAR 12 1998', '김 ㅇ ㅇ'], ['JUL 03 2004', 'S. Park'], ['NOV 21 2013', '이 ㅇ ㅇ'], ['', ''], ['', ''], ['', ''], ['', '']];
  const card = K.el(`<div class="ix-lib" aria-label="도서 대출 카드">
    <div class="hd"><span>813.6<br>ARC</span><span>No. ${String(Math.random() * 90000 + 10000 | 0)}</span></div>
    <div class="ttl">${K.escI(K.title)}</div><div class="au">PROJECT ARCHIVE LIBRARY</div>
    <table><thead><tr><th style="width:38%">DATE DUE</th><th>BORROWER'S NAME</th></tr></thead><tbody>
    ${rows.map(([dt, nm]) => `<tr><td>${dt ? `<span class="old">${dt}</span>` : ''}</td><td>${nm ? `<span class="pen">${K.escI(nm)}</span>` : ''}</td></tr>`).join('')}
    </tbody></table><div class="hole"></div><div class="foot"><span>KEEP THIS CARD IN POCKET</span><span>${d.getFullYear()}</span></div></div>`);
  const row = card.querySelectorAll('tbody tr')[3];
  let started = false;
  const run = () => { if (started) return; started = true; const nm = K.name() || 'GUEST';
    document.getElementById('ix-confirm').style.visibility = 'hidden'; document.getElementById('username').disabled = true; K.hint('');
    K.go(async () => {
      const cell = row.children[1]; for (const ch of nm) { const s = document.createElement('span'); s.className = 'ty'; s.textContent = ch; s.style.transform = `translateY(${K.rand(-.6, .6)}px)`; s.style.opacity = K.rand(.75, 1); cell.appendChild(s); K.SFX.key(); await K.wait(K.rand(80, 130)); }
      await K.wait(350);
      const st = document.createElement('span'); st.className = 'stamp'; st.textContent = today; row.children[0].appendChild(st);
      st.animate([{ transform: 'rotate(-4deg) scale(2.2)', opacity: 0 }, { transform: 'rotate(-4deg) scale(.96)', opacity: 1, offset: .7 }, { transform: 'rotate(-4deg) scale(1)', opacity: 1 }], { duration: K.RM ? 50 : 260, easing: 'cubic-bezier(.5,0,.8,.3)', fill: 'forwards' });
      await K.wait(200); K.SFX.thump(); K.shake(3, 200);
      await K.wait(900); K.hideCard(200);
      await card.animate([{ transform: 'translate(-50%,-50%) rotate(-1.2deg)' }, { transform: 'translate(-50%,-48%) rotate(0deg)', offset: .2 }, { transform: 'translate(-50%,140vh) rotate(4deg)' }], { duration: K.RM ? 200 : 1100, easing: 'cubic-bezier(.5,0,.8,.4)', fill: 'forwards' }).finished;
      await K.fade(450);
    }); };
  document.getElementById('ix-confirm').addEventListener('click', run);
  document.getElementById('username').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
} });

// 7. 녹슨 열쇠 — 열쇠를 끌어 구멍에 넣고, 원을 그리듯 돌리면 철컥 (방법 안내 상자 포함)
reg('key', { look: 'clear', card: false,
  help: '<span data-step="1">① 아래 <u>열쇠</u>를 손가락으로 끌어 <u>열쇠 구멍</u>에 가져다 놓아요.</span><br><span data-step="2" style="opacity:.55">② 꽂히면 구멍 둘레를 <u>원을 그리듯</u> 돌려요.</span><br><span data-step="3" style="opacity:.55">③ 철컥 소리가 나면 문이 열려요.</span>', mount(K) {
  const step = n => document.querySelectorAll('#ix-help [data-step]').forEach(s => { s.style.opacity = +s.dataset.step === n ? 1 : .55; s.style.fontWeight = +s.dataset.step === n ? 700 : 400; }); step(1);
  K.css('ix-key', `.intro-key { background:#6b4a33; color:#F6EBDD; }
    .intro-key .ix-title { -webkit-text-fill-color:#F3E2C6 !important; background:none !important; text-shadow:0 2px 6px rgba(0,0,0,.35); }
    .ix-key-wood { position:absolute; inset:0; }
    .ix-key-plate { position:absolute; left:50%; top:52%; width:120px; height:220px; transform:translate(-50%,-50%); z-index:2; }
    .ix-key-key { position:absolute; left:50%; bottom:9vh; width:64px; height:170px; margin-left:-32px; z-index:4; touch-action:none; cursor:grab; filter:drop-shadow(0 6px 6px rgba(0,0,0,.35)); transform-origin:50% 14%; }
    .ix-key-ring { position:absolute; left:50%; top:52%; width:150px; height:150px; margin:-75px 0 0 -75px; border-radius:50%; border:2px dashed rgba(255,230,190,.55); z-index:3; pointer-events:none; opacity:0; transition:opacity .4s; }
    .ix-key-ring.on { opacity:1; animation:ixspin 6s linear infinite; } @keyframes ixspin { to { transform:rotate(360deg); } }
    .intro-key .ix-help { background:rgba(60,40,25,.88); color:#F6EBDD; border-color:rgba(255,230,190,.35); }`);
  const wood = K.layer(0), wg = wood.g;
  const drawWood = () => { const W = K.W, H = K.H, n = Math.ceil(W / 90); for (let i = 0; i < n; i++) { const x = i * 90, gr = wg.createLinearGradient(x, 0, x + 90, 0); const b = 92 + (i % 3) * 8; gr.addColorStop(0, `rgb(${b},${b * .68 | 0},${b * .45 | 0})`); gr.addColorStop(1, `rgb(${b - 14},${(b - 14) * .66 | 0},${(b - 14) * .43 | 0})`); wg.fillStyle = gr; wg.fillRect(x, 0, 90, H);
      wg.strokeStyle = 'rgba(40,22,10,.25)'; for (let k = 0; k < 9; k++) { wg.lineWidth = K.rand(.5, 1.6); wg.beginPath(); let xx = x + K.rand(6, 84); wg.moveTo(xx, 0); for (let y = 0; y < H; y += 20) { xx += K.rand(-1.5, 1.5); wg.lineTo(xx, y); } wg.stroke(); }
      wg.fillStyle = 'rgba(25,14,6,.55)'; wg.fillRect(x, 0, 2, H); }
    const vg = wg.createRadialGradient(W / 2, H * .52, 60, W / 2, H * .52, Math.max(W, H) * .8); vg.addColorStop(0, 'rgba(255,220,170,.12)'); vg.addColorStop(1, 'rgba(20,10,4,.45)'); wg.fillStyle = vg; wg.fillRect(0, 0, W, H); };
  drawWood(); K.onResize(drawWood);
  K.el(`<svg class="ix-key-plate" viewBox="0 0 120 220" aria-hidden="true"><defs>
      <radialGradient id="rust" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#8a5a3a"/><stop offset=".5" stop-color="#5b3a24"/><stop offset="1" stop-color="#3a2416"/></radialGradient>
      <filter id="rn"><feTurbulence baseFrequency="1.2" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .3  0 0 0 0 .12  0 0 0 .55 0"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
    <rect x="6" y="6" width="108" height="208" rx="54" fill="url(#rust)" stroke="#2a180c" stroke-width="3"/><rect x="6" y="6" width="108" height="208" rx="54" filter="url(#rn)" fill="#000"/>
    <rect x="16" y="16" width="88" height="188" rx="44" fill="none" stroke="rgba(255,210,160,.25)" stroke-width="2"/>
    ${[[60, 26], [60, 194], [24, 110], [96, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#7a5034" stroke="#2a180c"/><circle cx="${x - 1.5}" cy="${y - 1.5}" r="1.6" fill="rgba(255,220,180,.5)"/>`).join('')}
    <circle cx="60" cy="96" r="15" fill="#0d0805"/><path d="M52 104 L46 140 L74 140 L68 104 Z" fill="#0d0805"/><circle cx="60" cy="96" r="15" fill="none" stroke="rgba(255,200,150,.2)" stroke-width="2"/></svg>`);
  const ring = K.el(`<div class="ix-key-ring"></div>`);
  const key = K.el(`<svg class="ix-key-key" viewBox="0 0 64 170" aria-label="열쇠"><defs><linearGradient id="kg" x1="0" x2="1"><stop offset="0" stop-color="#9a6a45"/><stop offset=".5" stop-color="#c8935f"/><stop offset="1" stop-color="#6a4428"/></linearGradient></defs>
    <circle cx="32" cy="24" r="20" fill="none" stroke="url(#kg)" stroke-width="8"/><circle cx="32" cy="24" r="8" fill="none" stroke="url(#kg)" stroke-width="4"/>
    <rect x="28" y="42" width="8" height="104" rx="3" fill="url(#kg)"/><rect x="36" y="128" width="14" height="7" fill="url(#kg)"/><rect x="36" y="140" width="10" height="6" fill="url(#kg)"/>
    <circle cx="32" cy="24" r="20" fill="none" stroke="rgba(60,30,10,.4)" stroke-width="1"/></svg>`);
  const plateC = () => { const r = K.stage.querySelector('.ix-key-plate').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height * (96 / 220)]; };
  let phase = 0, ox = 0, oy = 0, turned = 0;
  K.drag(key, {
    start: (x, y) => { if (phase !== 0) return; const r = key.getBoundingClientRect(); ox = x - r.left; oy = y - r.top; key.style.cursor = 'grabbing'; },
    move: (x, y) => { if (phase !== 0) return; key.style.left = (x - ox + 32) + 'px'; key.style.top = (y - oy) + 'px'; key.style.bottom = 'auto'; },
    end: (x, y) => { if (phase !== 0) return; key.style.cursor = 'grab'; const [cx, cy] = plateC(), r = key.getBoundingClientRect(), pr = K.stage.querySelector('.ix-key-plate').getBoundingClientRect();
      const hit = r.right > pr.left - 20 && r.left < pr.right + 20 && r.bottom > pr.top - 20 && r.top < pr.bottom + 20;   // 열쇠가 자물쇠판에 닿기만 하면 꽂힘
      if (hit) { phase = 1; K.SFX.click(); key.style.left = cx + 'px'; key.style.top = (cy - 170 * .86) + 'px'; key.style.transition = 'transform .2s'; key.style.transformOrigin = '50% 86%'; key.style.pointerEvents = 'none';
        ring.classList.add('on'); step(2); }
      else { key.style.transition = 'left .35s, top .35s'; key.style.left = ''; key.style.top = ''; key.style.bottom = '9vh'; setTimeout(() => key.style.transition = '', 400); } }
  });
  K.circular(K.gw, () => plateC()[0], () => plateC()[1], d => { if (phase !== 1) return; turned += d; const deg = K.clamp(Math.abs(turned) * 180 / Math.PI, 0, 100) * Math.sign(turned || 1); key.style.transform = `rotate(${deg}deg)`;
    if (Math.abs(deg) >= 90) { phase = 2; ring.classList.remove('on'); K.SFX.clack(); step(3); K.go(async () => { await K.wait(500); await K.split(900); }); } });
} });

// ================= 묶음 2 · 신비·판타지 =================

// 9. 물에 비친 글씨 — 수면에 거꾸로 비친 제목이 일렁이고, 터치하면 파문이 퍼진 뒤 글씨가 바로 섬
reg('water', { look: 'clear', cardPos: 'top', hint: '물결을 터치해 보세요', mount(K) {
  K.css('ix-water', `.intro-water { background:#6E93B8; } .intro-water .ix-card { color:#F4F8FC; } .intro-water .ix-title { opacity:0; transform:translateY(24px); transition:opacity 1.2s ease, transform 1.4s cubic-bezier(.2,.8,.2,1); -webkit-text-fill-color:#fff !important; background:none !important; text-shadow:0 2px 14px rgba(20,50,90,.45); }
    .intro-water .ix-title.up { opacity:1; transform:none; } .intro-water .ix-input { border-color:rgba(255,255,255,.7); color:#fff; } .intro-water .ix-sound { color:#fff; }`);
  const L = K.layer(0), R = 2; let gw, gh, cur, prev, src, img, out, oc, og;
  const make = () => { gw = Math.ceil(K.W / R); gh = Math.ceil(K.H / R); cur = new Float32Array(gw * gh); prev = new Float32Array(gw * gh);
    const s = document.createElement('canvas'); s.width = gw; s.height = gh; const p = s.getContext('2d');
    const gr = p.createLinearGradient(0, 0, 0, gh); gr.addColorStop(0, '#9FC2E2'); gr.addColorStop(.45, '#5E89B5'); gr.addColorStop(1, '#2C4F7A'); p.fillStyle = gr; p.fillRect(0, 0, gw, gh);
    for (let i = 0; i < 40; i++) { p.strokeStyle = `rgba(255,255,255,${K.rand(.04, .12)})`; p.lineWidth = K.rand(.5, 1.5); const y = K.rand(0, gh); p.beginPath(); p.moveTo(K.rand(-20, gw * .3), y); p.lineTo(K.rand(gw * .6, gw + 20), y + K.rand(-2, 2)); p.stroke(); }
    p.save(); p.translate(gw / 2, gh * .38); p.scale(1, -1); p.globalAlpha = .5; p.fillStyle = '#EAF3FB'; p.font = `700 ${Math.min(22, gw / 8)}px "Cinzel Decorative","Song Myung",serif`; p.textAlign = 'center'; p.textBaseline = 'middle'; p.fillText(K.title, 0, 0); p.restore();
    src = p.getImageData(0, 0, gw, gh).data; oc = document.createElement('canvas'); oc.width = gw; oc.height = gh; og = oc.getContext('2d'); img = og.createImageData(gw, gh); out = img.data; };
  make(); K.onResize(make);
  const drop = (x, y, r, s) => { const cx = x / R | 0, cy = y / R | 0; for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { const xx = cx + i, yy = cy + j; if (xx > 0 && yy > 0 && xx < gw - 1 && yy < gh - 1 && i * i + j * j <= r * r) prev[yy * gw + xx] += s * (1 - Math.hypot(i, j) / (r + 1)); } };
  let idle = 0, tapped = false;
  K.loop(dt => {
    idle -= dt; if (idle < 0 && !tapped) { idle = K.rand(.6, 1.4); drop(K.rand(0, K.W), K.rand(0, K.H), 2, 90); }
    for (let y = 1; y < gh - 1; y++) for (let x = 1; x < gw - 1; x++) { const i = y * gw + x; const v = (cur[i - 1] + cur[i + 1] + cur[i - gw] + cur[i + gw]) / 2 - prev[i]; prev[i] = v * .972; }
    const t = cur; cur = prev; prev = t;
    for (let y = 1; y < gh - 1; y++) for (let x = 1; x < gw - 1; x++) { const i = y * gw + x, dx = cur[i - 1] - cur[i + 1], dy = cur[i - gw] - cur[i + gw];
      const sx = K.clamp(x + (dx >> 3), 0, gw - 1), sy = K.clamp(y + (dy >> 3), 0, gh - 1), si = (sy * gw + sx) * 4, o = i * 4, sh = K.clamp(dx * .35, -40, 60);
      out[o] = src[si] + sh; out[o + 1] = src[si + 1] + sh; out[o + 2] = src[si + 2] + sh; out[o + 3] = 255; }
    og.putImageData(img, 0, 0); L.g.imageSmoothingEnabled = true; L.g.drawImage(oc, 0, 0, gw * R, gh * R);
  });
  K.onTap((x, y) => { if (tapped) return; tapped = true; K.SFX.drop(); setTimeout(() => K.SFX.splash(), 80); drop(x, y, 6, 600); setTimeout(() => drop(x + 10, y + 6, 4, 400), 160);
    const tt = K.gw.querySelector('.ix-title'); K.hint('');
    K.go(async () => { await K.wait(500); tt.classList.add('up'); await K.wait(1600); await K.fade(800); }); });
} });

// 10. 별자리 잇기 — 밤하늘에 어떤 모양이든 그리면 근처 별들이 이어지며 별자리가 완성
reg('constellation', { look: 'dark', cardPos: 'top', hint: '손가락으로 밤하늘에 아무 모양이나 그려 보세요', mount(K) {
  const L = K.layer(0); let stars = [];
  const make = () => { stars = Array.from({ length: Math.round(K.W * K.H / 4200) }, () => ({ x: K.rand(0, K.W), y: K.rand(0, K.H), r: K.rand(.6, 2.2), p: K.rand(0, K.TAU), lit: 0 })); };
  make(); K.onResize(make);
  let path = [], len = 0, linked = [], done = false, glow = 0;
  K.loop((dt, now) => { const g = L.g; g.clearRect(0, 0, K.W, K.H);
    const sky = g.createRadialGradient(K.W / 2, K.H * .3, 0, K.W / 2, K.H * .3, Math.max(K.W, K.H)); sky.addColorStop(0, 'rgba(70,90,150,.35)'); sky.addColorStop(1, 'rgba(10,15,35,0)'); g.fillStyle = sky; g.fillRect(0, 0, K.W, K.H);
    stars.forEach(s => { const tw = .55 + .45 * Math.sin(now / 600 + s.p); s.lit = Math.max(0, s.lit - dt * .2); const r = s.r * (1 + s.lit * 1.6);
      g.fillStyle = `rgba(255,250,235,${tw * (.6 + s.lit * .4)})`; g.beginPath(); g.arc(s.x, s.y, r, 0, K.TAU); g.fill();
      if (s.lit > .05) { const gr = g.createRadialGradient(s.x, s.y, 0, s.x, s.y, r * 7); gr.addColorStop(0, `rgba(200,220,255,${s.lit * .55})`); gr.addColorStop(1, 'rgba(200,220,255,0)'); g.fillStyle = gr; g.fillRect(s.x - r * 7, s.y - r * 7, r * 14, r * 14); } });
    if (path.length > 1) { g.strokeStyle = `rgba(180,210,255,${done ? .15 : .35})`; g.lineWidth = 2; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); path.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }
    if (linked.length > 1) { g.save(); g.shadowColor = 'rgba(190,215,255,.9)'; g.shadowBlur = 10 + glow * 20; g.strokeStyle = `rgba(235,242,255,${.7 + glow * .3})`; g.lineWidth = 1.4 + glow * 1.5; g.beginPath(); linked.forEach((s, i) => i ? g.lineTo(s.x, s.y) : g.moveTo(s.x, s.y)); g.stroke(); g.restore(); }
    if (done) glow = Math.min(1, glow + dt * 1.2);
  });
  const near = (x, y) => { let best = null, bd = 46; stars.forEach(s => { const d = Math.hypot(s.x - x, s.y - y); if (d < bd) { bd = d; best = s; } }); return best; };
  const finish = () => { if (done) return; done = true; K.SFX.chime([659, 784, 988, 1319, 1568], .12); K.hint('별자리가 완성되었어요'); linked.forEach(s => s.lit = 1);
    K.go(async () => { await K.wait(1300); K.flash('#E8F0FF', 500, .6); await K.fade(700); }); };
  K.drag(K.gw, {
    start: (x, y) => { if (done) return; path = [[x, y]]; len = 0; },
    move: (x, y) => { if (done) return; const [px, py] = path[path.length - 1]; len += Math.hypot(x - px, y - py); path.push([x, y]); const s = near(x, y); if (s && linked[linked.length - 1] !== s && !linked.includes(s)) { linked.push(s); s.lit = 1; K.SFX.click(); } if (len > 380 && linked.length >= 4) finish(); },
    end: () => { if (done) return; if (linked.length >= 4 && len > 220) finish(); else if (len < 30) K.hint('손가락을 떼지 말고 길게 그려 보세요'); }
  });
} });

// 14. 타로 한 장 — 실제 타로처럼: 뒷면 무늬의 카드 3장, 하나를 고르면 뒤집혀 메이저 아르카나와 오늘의 문장
reg('tarot', { look: 'clear', cardPos: 'top', input: false, hint: '마음이 가는 카드 한 장을 고르세요', mount(K) {
  K.css('ix-tarot', `.intro-tarot { background:radial-gradient(80% 60% at 50% 45%, #5B2A5E 0%, #3A1C46 60%, #2A1636 100%); color:#F3E6D2; }
    .intro-tarot .ix-title { -webkit-text-fill-color:#F1D9A8 !important; background:none !important; text-shadow:0 2px 10px rgba(0,0,0,.35); }
    .ix-tarot-row { position:absolute; left:50%; top:56%; transform:translate(-50%,-50%); display:flex; gap:12px; perspective:1200px; z-index:2; }
    .ix-tc { width:min(28vw,124px); aspect-ratio:7/12; position:relative; transform-style:preserve-3d; transition:transform .9s cubic-bezier(.3,.7,.2,1), opacity .6s, left .7s, top .7s; cursor:pointer; border:0; padding:0; background:none; }
    .ix-tc:hover { transform:translateY(-6px); }
    .ix-tc .fc { position:absolute; inset:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; border-radius:7px; overflow:hidden; box-shadow:0 10px 24px rgba(0,0,0,.35); }
    .ix-tc .front { transform:rotateY(180deg); background:#F5ECD8; }
    .ix-tc.flip { transform:rotateY(180deg) scale(1.55) !important; }
    .ix-tarot-cap { position:absolute; left:50%; bottom:max(9vh,40px); transform:translateX(-50%); width:min(86vw,360px); text-align:center; z-index:3; opacity:0; transition:opacity .8s; font:16px/1.7 "Gowun Batang",serif; color:#F7EBD6; }
    .ix-tarot-cap b { display:block; font:700 13px "Cinzel",serif; letter-spacing:.25em; color:#E9C98A; margin-bottom:4px; }
    .ix-tarot-cap .ix-btn { margin-top:14px; color:#F1D9A8; }`);
  const GOLD = '#D9B36A';
  const back = `<svg viewBox="0 0 70 120" width="100%" height="100%"><rect width="70" height="120" fill="#2B2A5C"/><rect x="3" y="3" width="64" height="114" rx="4" fill="none" stroke="${GOLD}" stroke-width="1.2"/><rect x="6" y="6" width="58" height="108" rx="3" fill="none" stroke="${GOLD}" stroke-width=".5"/>
    <g fill="none" stroke="${GOLD}" stroke-width=".6" opacity=".55">${Array.from({ length: 8 }, (_, i) => `<path d="M6 ${18 + i * 12} L64 ${18 + i * 12}" stroke-dasharray="1 3"/>`).join('')}</g>
    <circle cx="35" cy="60" r="15" fill="#2B2A5C" stroke="${GOLD}" stroke-width="1"/>${Array.from({ length: 16 }, (_, i) => { const a = i / 16 * Math.PI * 2; return `<line x1="${35 + Math.cos(a) * 17}" y1="${60 + Math.sin(a) * 17}" x2="${35 + Math.cos(a) * (i % 2 ? 21 : 25)}" y2="${60 + Math.sin(a) * (i % 2 ? 21 : 25)}" stroke="${GOLD}" stroke-width=".8"/>`; }).join('')}
    <path d="M40 52 A9 9 0 1 0 40 68 A7 7 0 1 1 40 52 Z" fill="${GOLD}"/>
    ${[[35, 20], [35, 100], [14, 60], [56, 60]].map(([x, y]) => `<path d="M${x} ${y - 4} L${x + 1.2} ${y - 1.2} L${x + 4} ${y} L${x + 1.2} ${y + 1.2} L${x} ${y + 4} L${x - 1.2} ${y + 1.2} L${x - 4} ${y} L${x - 1.2} ${y - 1.2} Z" fill="${GOLD}"/>`).join('')}
    ${[[10, 10], [60, 10], [10, 110], [60, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="${GOLD}"/>`).join('')}</svg>`;
  const ARC = [
    ['XVII', 'THE STAR', '별', '희망이 다시 반짝이는 날이에요.', `<path d="M35 34 L38 48 L52 51 L38 54 L35 68 L32 54 L18 51 L32 48 Z" fill="#C9A24E"/>${[[16, 30], [54, 32], [20, 70], [52, 68], [35, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="#C9A24E"/>`).join('')}<path d="M12 84 Q23 80 35 84 T58 84" stroke="#6E8DB5" fill="none" stroke-width="1.2"/><path d="M12 89 Q23 85 35 89 T58 89" stroke="#6E8DB5" fill="none" stroke-width="1"/>`],
    ['XVIII', 'THE MOON', '달', '보이지 않던 마음이 드러나는 밤이에요.', `<circle cx="35" cy="46" r="14" fill="#E2BE62"/><circle cx="41" cy="42" r="12" fill="#CBD9EA"/><rect x="10" y="64" width="9" height="24" fill="none" stroke="#7a6a50"/><rect x="51" y="64" width="9" height="24" fill="none" stroke="#7a6a50"/><path d="M14 92 Q35 80 56 92" stroke="#6E8DB5" fill="none"/>`],
    ['XIX', 'THE SUN', '태양', '숨김없이 웃어도 좋은 하루예요.', `<circle cx="35" cy="52" r="11" fill="#E0B24E"/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${35 + Math.cos(a) * 14}" y1="${52 + Math.sin(a) * 14}" x2="${35 + Math.cos(a) * 22}" y2="${52 + Math.sin(a) * 22}" stroke="#E0B24E" stroke-width="1.6"/>`; }).join('')}<path d="M14 90 L56 90" stroke="#7a6a50"/>`],
    ['X', 'WHEEL OF FORTUNE', '운명의 수레바퀴', '우연처럼 찾아온 만남이 시작돼요.', `<circle cx="35" cy="56" r="20" fill="none" stroke="#C9A24E" stroke-width="2"/><circle cx="35" cy="56" r="6" fill="#C9A24E"/>${Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2; return `<line x1="35" y1="56" x2="${35 + Math.cos(a) * 20}" y2="${56 + Math.sin(a) * 20}" stroke="#C9A24E"/>`; }).join('')}`],
    ['VI', 'THE LOVERS', '연인', '서로를 알아보는 순간이 다가와요.', `<path d="M27 46 C20 38 10 46 18 56 L27 64 L36 56 C44 46 34 38 27 46 Z" fill="#C46A6A"/><path d="M45 50 C38 42 28 50 36 60 L45 68 L54 60 C62 50 52 42 45 50 Z" fill="none" stroke="#C46A6A" stroke-width="1.6"/><path d="M14 30 L56 30" stroke="#C9A24E" stroke-dasharray="2 2"/>`],
    ['IX', 'THE HERMIT', '은둔자', '조용한 곳에서 진짜 이야기를 듣게 돼요.', `<path d="M30 40 L40 40 L42 58 L28 58 Z" fill="#E7C46A" stroke="#7a6a50"/><circle cx="35" cy="50" r="3" fill="#fff8d0"/><line x1="35" y1="34" x2="35" y2="40" stroke="#7a6a50"/><line x1="22" y1="30" x2="22" y2="90" stroke="#7a6a50" stroke-width="1.6"/>`],
    ['XXI', 'THE WORLD', '세계', '하나의 이야기가 완성을 향해 가요.', `<ellipse cx="35" cy="56" rx="16" ry="24" fill="none" stroke="#6E9A6E" stroke-width="2.4" stroke-dasharray="3 2"/>${[[14, 30], [56, 30], [14, 84], [56, 84]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#C9A24E"/>`).join('')}`],
    ['II', 'THE HIGH PRIESTESS', '여사제', '직감을 믿어도 좋은 때예요.', `<circle cx="35" cy="38" r="7" fill="#E2BE62"/><circle cx="25" cy="38" r="5" fill="#E2BE62"/><circle cx="22.5" cy="36.5" r="4.4" fill="#CBD9EA"/><circle cx="45" cy="38" r="5" fill="#E2BE62"/><circle cx="47.5" cy="36.5" r="4.4" fill="#CBD9EA"/><rect x="12" y="50" width="7" height="40" fill="#3B3B4A"/><rect x="51" y="50" width="7" height="40" fill="#EDE6D6" stroke="#7a6a50"/><text x="15.5" y="58" font-size="5" fill="#fff" text-anchor="middle">B</text><text x="54.5" y="58" font-size="5" fill="#333" text-anchor="middle">J</text>`]
  ];
  const lines = P.tarotLines || null;
  const pick = [...ARC].sort(() => Math.random() - .5).slice(0, 3);
  const front = ([num, en, ko, , art]) => `<svg viewBox="0 0 70 120" width="100%" height="100%"><rect width="70" height="120" fill="#F5ECD8"/><rect x="3" y="3" width="64" height="114" rx="3" fill="none" stroke="#B8914A" stroke-width="1"/><rect x="6" y="6" width="58" height="108" rx="2" fill="none" stroke="#B8914A" stroke-width=".4"/>
    <defs><linearGradient id="sky${num}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D8EA"/><stop offset=".65" stop-color="#EEE5D2"/><stop offset="1" stop-color="#E4D3B0"/></linearGradient></defs>
    <rect x="9" y="22" width="52" height="74" fill="url(#sky${num})" stroke="#B8914A" stroke-width=".5"/>
    <text x="35" y="17" text-anchor="middle" font-family="Cinzel,serif" font-size="7" font-weight="700" fill="#5a4630">${num}</text><g transform="translate(0,2)">${art}</g>
    ${[[12, 25], [58, 25], [12, 93], [58, 93]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r=".9" fill="#B8914A"/>`).join('')}
    <rect x="9" y="99" width="52" height="12" fill="#EADDBF" stroke="#B8914A" stroke-width=".5"/><text x="35" y="107.3" text-anchor="middle" font-family="Cinzel,serif" font-size="${en.length > 12 ? 3.7 : 4.6}" font-weight="700" fill="#4a3a28" letter-spacing=".4">${en}</text></svg>`;
  const row = K.el(`<div class="ix-tarot-row">${pick.map((c, i) => `<button type="button" data-ix class="ix-tc" data-i="${i}" aria-label="카드 ${i + 1}"><div class="fc back">${back}</div><div class="fc front">${front(c)}</div></button>`).join('')}</div>`);
  const cap = K.el(`<div class="ix-tarot-cap"></div>`, K.gw);
  row.querySelectorAll('.ix-tc').forEach((b, i) => { b.style.transform = `rotate(${(i - 1) * 6}deg) translateY(${Math.abs(i - 1) * 8}px)`; });
  let chosen = false;
  row.addEventListener('click', e => { const b = e.target.closest('.ix-tc'); if (!b || chosen) return; chosen = true; K.prime(); const i = +b.dataset.i, c = pick[i];
    row.querySelectorAll('.ix-tc').forEach((o, j) => { if (j !== i) { o.style.opacity = '0'; o.style.transform += ' translateY(40px)'; } });
    K.SFX.page(); K.hint('');
    const r = b.getBoundingClientRect(), rr = row.getBoundingClientRect(); b.style.zIndex = 5;
    b.style.transform = `translate(${rr.left + rr.width / 2 - (r.left + r.width / 2)}px, -40px)`;
    setTimeout(() => { b.classList.add('flip'); K.SFX.chime([523, 659, 784], .1); }, 650);
    setTimeout(() => { cap.innerHTML = `<b>${c[0]} · ${c[1]}</b>${K.escI(c[2])} — ${K.escI(lines ? lines[Math.random() * lines.length | 0] : c[3])}<br><button type="button" class="ix-btn" id="tarot-go">입장하기</button>`; cap.style.opacity = 1;
      document.getElementById('tarot-go').addEventListener('click', () => K.go(async () => { K.hideCard(200); await K.fade(700); })); }, 1500);
  });
} });

// 16. 빛의 나비 — 징그럽지 않게, 빛으로만 그린 나비 떼. 터치하면 흩어져 날아감
reg('butterfly', { look: 'clear', hint: '화면을 터치하면 나비들이 길을 열어 줘요', mount(K) {
  K.css('ix-bf', `.intro-butterfly { background:linear-gradient(170deg,#3A3F78 0%,#5B4E8C 45%,#8A6FA6 100%); color:#F6F1FF; }
    .intro-butterfly .ix-title { -webkit-text-fill-color:#FFF6E8 !important; background:none !important; text-shadow:0 0 18px rgba(255,220,250,.6); } .intro-butterfly .ix-input { color:#fff; }`);
  const L = K.layer(0), COLS = [[255, 214, 120], [180, 220, 255], [255, 170, 210], [200, 180, 255], [170, 255, 220]];
  const bs = Array.from({ length: 46 }, () => ({ x: K.rand(0, K.W), y: K.rand(0, K.H), s: K.rand(9, 20), a: K.rand(0, K.TAU), v: K.rand(10, 26), ph: K.rand(0, K.TAU), f: K.rand(7, 11), c: COLS[Math.random() * COLS.length | 0], vx: 0, vy: 0, flee: false }));
  const dust = [];
  const wing = (g, s, c, flap) => { [[1, -1], [-1, -1], [1, 1], [-1, 1]].forEach(([sx, sy], k) => { const big = sy < 0, w = s * (big ? 1 : .72), h = s * (big ? .82 : .6);
      g.save(); g.scale(sx * flap, 1); g.translate(w * .55, sy * h * .45); g.rotate(sy * (big ? .5 : -.4));
      const gr = g.createRadialGradient(-w * .2, 0, 0, 0, 0, w * .75); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.35, `rgba(${c[0]},${c[1]},${c[2]},.75)`); gr.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
      g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, w * .62, h * .5, 0, 0, K.TAU); g.fill(); g.restore(); }); };
  K.loop((dt, now) => { const g = L.g; g.clearRect(0, 0, K.W, K.H); g.globalCompositeOperation = 'lighter';
    bs.forEach(b => { if (b.flee) { b.vy -= 380 * dt; b.x += b.vx * dt; b.y += b.vy * dt; } else { b.a += K.rand(-1.2, 1.2) * dt; b.x += Math.cos(b.a) * b.v * dt; b.y += Math.sin(b.a) * b.v * dt - 4 * dt; if (b.x < -30) b.x = K.W + 20; if (b.x > K.W + 30) b.x = -20; if (b.y < -30) b.y = K.H + 20; if (b.y > K.H + 30) b.y = -20; }
      const flap = .25 + .75 * Math.abs(Math.sin(now / 1000 * b.f + b.ph)); g.save(); g.translate(b.x, b.y); g.rotate(b.flee ? Math.atan2(b.vy, b.vx) + Math.PI / 2 : Math.sin(b.ph + now / 2000) * .3); wing(g, b.s, b.c, flap);
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -b.s * .35); g.lineTo(0, b.s * .35); g.stroke(); g.restore();
      if (Math.random() < (b.flee ? .6 : .05)) dust.push({ x: b.x, y: b.y, t: 0, c: b.c }); });
    for (let i = dust.length - 1; i >= 0; i--) { const d = dust[i]; d.t += dt; if (d.t > 1.2) { dust.splice(i, 1); continue; } d.y += 12 * dt; g.fillStyle = `rgba(${d.c[0]},${d.c[1]},${d.c[2]},${.8 * (1 - d.t / 1.2)})`; g.beginPath(); g.arc(d.x, d.y, 1.3, 0, K.TAU); g.fill(); }
    g.globalCompositeOperation = 'source-over'; });
  K.onTap((x, y) => K.go(async () => { K.SFX.whoosh(1); K.SFX.chime([1047, 1319, 1568, 2093], .08); K.hideCard(400);
    bs.forEach(b => { const a = Math.atan2(b.y - y, b.x - x), d = Math.hypot(b.x - x, b.y - y); b.flee = true; b.vx = Math.cos(a) * K.rand(160, 320) * (1 + 200 / (d + 60)); b.vy = Math.sin(a) * K.rand(160, 320) - 120; });
    await K.wait(1300); await K.fade(700); }));
} });

// 17. 책 속으로 — 책장을 넘기다 마지막 장에서 글자들이 빨려 들어가며 입장
reg('book', { look: 'paper', cardPos: 'top', input: false, hint: '오른쪽 페이지를 눌러(또는 왼쪽으로 밀어) 책장을 넘기세요', mount(K) {
  K.css('ix-book', `.ix-book { position:absolute; left:50%; top:58%; transform:translate(-50%,-50%); width:min(92vw,560px); aspect-ratio:1.45/1; perspective:1600px; z-index:2; }
    .ix-book .pg { position:absolute; top:0; width:50%; height:100%; background:#FBF6EA; box-shadow:inset 0 0 30px rgba(150,120,70,.12); padding:6% 6% 4%; font:clamp(9px,2.6vw,13px)/1.75 "Gowun Batang",serif; color:#3a3226; overflow:hidden; }
    .ix-book .l { left:0; background:linear-gradient(90deg,#FBF6EA 80%,#E9DFC9); border-radius:6px 0 0 6px; } .ix-book .r { right:0; background:linear-gradient(270deg,#FBF6EA 80%,#E9DFC9); border-radius:0 6px 6px 0; }
    .ix-book .leaf { position:absolute; right:0; top:0; width:50%; height:100%; transform-origin:0 50%; transform-style:preserve-3d; transition:transform .9s cubic-bezier(.4,.1,.2,1); z-index:3; cursor:pointer; }
    .ix-book .leaf .pg { width:100%; left:0; backface-visibility:hidden; -webkit-backface-visibility:hidden; } .ix-book .leaf .bk { transform:rotateY(180deg); background:linear-gradient(90deg,#FBF6EA 80%,#E9DFC9); border-radius:6px 0 0 6px; }
    .ix-book .leaf.turned { transform:rotateY(-180deg); }
    .ix-book .spine { position:absolute; left:50%; top:0; bottom:0; width:24px; margin-left:-12px; background:linear-gradient(90deg,rgba(0,0,0,0),rgba(90,60,30,.22),rgba(0,0,0,0)); z-index:4; pointer-events:none; }
    .ix-book .cover { position:absolute; inset:-10px -12px; background:#7A3B2E; border-radius:8px; box-shadow:0 18px 40px rgba(60,30,10,.35); z-index:-1; }
    .ix-book h4 { margin:0 0 8px; font:700 clamp(10px,2.8vw,14px) "Cinzel","Gowun Batang",serif; letter-spacing:.18em; color:#7a5a30; text-align:center; }
    .ix-book .big { text-align:center; margin-top:18%; font:700 clamp(18px,5.4vw,30px) "Cinzel Decorative","Song Myung",serif; color:#5a3d1c; }
    .ix-book .ch { display:inline-block; }`);
  const H = P.heroText ? [].concat(P.heroText) : [K.line];
  const txt = (h, arr) => `<h4>${h}</h4>${arr.map(t => `<p style="margin:0 0 .4em">${K.escI(t)}</p>`).join('')}`;
  const pages = [[txt('PROLOGUE', [K.line, ...H.slice(0, 2)]), txt('I', H)], [txt('II', [...H].reverse()), txt('III', [K.line])], [txt('IV', H.slice(0, 3)), `<div class="big">${K.escI(K.title)}</div>`]];
  const book = K.el(`<div class="ix-book"><div class="cover"></div><div class="pg l">${txt('ARCHIVE', ['이 책을 펼친 당신에게,', K.line])}</div><div class="pg r" id="bk-last">${pages[2][1]}</div>
    ${pages.slice(0, 2).map((p, i) => `<div class="leaf" data-n="${i}" style="z-index:${10 - i}"><div class="pg fr">${i === 0 ? pages[0][0] : pages[1][0]}</div><div class="pg bk">${i === 0 ? pages[0][1] : pages[1][1]}</div></div>`).join('')}
    <div class="spine"></div></div>`);
  let n = 0, busy2 = false;
  const turn = () => { if (busy2) return; const leaf = book.querySelector(`.leaf[data-n="${n}"]`);
    if (leaf) { busy2 = true; K.prime(); K.SFX.page(); leaf.classList.add('turned'); leaf.style.zIndex = 20 + n; n++; setTimeout(() => busy2 = false, 700); if (n >= 2) setTimeout(suck, 1000); return; } };
  const suck = () => K.go(async () => { K.hint(''); const box = book.getBoundingClientRect(), cx = box.left + box.width / 2, cy = box.top + box.height / 2;
    const chars = []; book.querySelectorAll('p, .big, h4').forEach(el => { if (el.closest('.leaf:not(.turned)')) return; const t = el.textContent; el.innerHTML = [...t].map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : K.escI(c)}</span>`).join(''); chars.push(...el.querySelectorAll('.ch')); });
    K.SFX.whoosh(1.4);
    await Promise.all(chars.map((c, i) => { const r = c.getBoundingClientRect(), dx = cx - (r.left + r.width / 2), dy = cy - (r.top + r.height / 2);
      return c.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${dx * .6}px,${dy * .6}px) rotate(${K.rand(-200, 200)}deg) scale(.6)`, opacity: .9, offset: .7 }, { transform: `translate(${dx}px,${dy}px) scale(0)`, opacity: 0 }], { duration: K.RM ? 100 : 900 + Math.random() * 500, delay: K.RM ? 0 : (i % 40) * 12, easing: 'cubic-bezier(.6,0,.9,.4)', fill: 'forwards' }).finished; }));
    K.flash('#FFF8E6', 600, .9); await book.animate([{ transform: 'translate(-50%,-50%) scale(1)' }, { transform: 'translate(-50%,-50%) scale(.2)', opacity: 0 }], { duration: K.RM ? 100 : 500, fill: 'forwards' }).finished; K.hideCard(100); await K.fade(500); });
  book.addEventListener('click', turn);
  K.drag(K.gw, { end: (x, y, dx) => { if (dx < -40) turn(); } });
} });

// 18. 달의 위상 — 옆으로 밀 때마다 달이 차오르고, 보름달이 되면 열림
reg('moon', { look: 'dark', cardPos: 'top', hint: '옆으로 밀어(또는 눌러) 달을 채워 주세요 · 0/7', mount(K) {
  const L = K.layer(0); let k = 0, target = 0, done = false, bloom = 0; const STEPS = 7;
  const tex = (() => { const c = document.createElement('canvas'), N = 256; c.width = c.height = N; const p = c.getContext('2d'); const gr = p.createRadialGradient(N * .4, N * .38, N * .05, N / 2, N / 2, N / 2); gr.addColorStop(0, '#FFFBEA'); gr.addColorStop(.7, '#F1E6C6'); gr.addColorStop(1, '#D9CBA4'); p.fillStyle = gr; p.beginPath(); p.arc(N / 2, N / 2, N / 2, 0, K.TAU); p.fill();
    for (let i = 0; i < 26; i++) { const x = K.rand(N * .15, N * .85), y = K.rand(N * .15, N * .85), r = K.rand(4, 22), cg = p.createRadialGradient(x, y, 0, x, y, r); cg.addColorStop(0, 'rgba(170,150,110,.28)'); cg.addColorStop(1, 'rgba(170,150,110,0)'); p.fillStyle = cg; p.beginPath(); p.arc(x, y, r, 0, K.TAU); p.fill(); } return c; })();
  const stars = Array.from({ length: 90 }, () => [Math.random(), Math.random(), K.rand(.4, 1.6), K.rand(0, 6)]);
  K.loop((dt, now) => { const g = L.g, W = K.W, H = K.H; g.clearRect(0, 0, W, H); k += (target - k) * Math.min(1, dt * 5);
    stars.forEach(([x, y, r, p]) => { g.fillStyle = `rgba(255,250,235,${.4 + .4 * Math.sin(now / 700 + p)})`; g.beginPath(); g.arc(x * W, y * H, r, 0, K.TAU); g.fill(); });
    const R = Math.min(W, H) * .22, cx = W / 2, cy = H * .56;
    const halo = g.createRadialGradient(cx, cy, R * .8, cx, cy, R * (2.2 + bloom * 6)); halo.addColorStop(0, `rgba(255,245,210,${.12 + k * .25 + bloom * .5})`); halo.addColorStop(1, 'rgba(255,245,210,0)'); g.fillStyle = halo; g.fillRect(0, 0, W, H);
    g.fillStyle = 'rgba(40,52,82,.9)'; g.beginPath(); g.arc(cx, cy, R, 0, K.TAU); g.fill();
    g.save(); g.beginPath(); const tx = R * Math.abs(1 - 2 * Math.min(1, k));
    g.arc(cx, cy, R, -Math.PI / 2, Math.PI / 2, false); g.ellipse(cx, cy, Math.max(.01, tx), R, 0, Math.PI / 2, -Math.PI / 2, k < .5); g.closePath(); g.clip();
    g.drawImage(tex, cx - R, cy - R, R * 2, R * 2); g.restore();
    if (k >= .999) { g.drawImage(tex, cx - R, cy - R, R * 2, R * 2); }
    if (done) bloom = Math.min(1, bloom + dt * .9); });
  const step = () => { if (done) return; K.prime(); target = Math.min(1, target + 1 / STEPS); const n = Math.round(target * STEPS); K.SFX.chime([523 + n * 60], .1); K.hint(`옆으로 밀어(또는 눌러) 달을 채워 주세요 · ${n}/${STEPS}`);
    if (n >= STEPS) { done = true; K.hint('보름달이 떴어요'); K.SFX.chime([784, 988, 1175, 1568, 1976], .12); K.go(async () => { await K.wait(1600); K.flash('#FFF6DA', 700, .7); await K.fade(700); }); } };
  K.drag(K.gw, { end: (x, y, dx, dy) => { if (Math.abs(dx) > 30 || (Math.abs(dx) < 8 && Math.abs(dy) < 8)) step(); } });
} });

// ================= 묶음 3 · 감성·로맨스 =================

// 19. 비 오는 창문 — 김 서린 창에 빗방울. 손가락으로 쓸면 길이 나고 창 너머(사이트)가 보임
reg('rainwindow', { look: 'clear', cardPos: 'top', input: false, hint: '김 서린 창문을 손가락으로 닦아 보세요', mount(K) {
  K.peek();
  K.css('ix-rw', `.intro-rainwindow .ix-card { color:#2c3a4e; } .intro-rainwindow .ix-title { -webkit-text-fill-color:#2c3a4e !important; background:none !important; }`);
  const L = K.layer(1); let fog, mask, mg, drops = [], runs = [];
  const make = () => { fog = document.createElement('canvas'); fog.width = K.W; fog.height = K.H; const f = fog.getContext('2d');
    const gr = f.createLinearGradient(0, 0, 0, K.H); gr.addColorStop(0, '#C3CEDC'); gr.addColorStop(1, '#A9B7C8'); f.fillStyle = gr; f.fillRect(0, 0, K.W, K.H);
    f.filter = 'blur(18px)'; for (let i = 0; i < 26; i++) { f.fillStyle = `rgba(${K.rand(200, 255)},${K.rand(190, 240)},${K.rand(150, 230)},${K.rand(.25, .5)})`; f.beginPath(); f.arc(K.rand(0, K.W), K.rand(K.H * .3, K.H), K.rand(14, 40), 0, K.TAU); f.fill(); } f.filter = 'none';
    f.fillStyle = 'rgba(255,255,255,.18)'; f.fillRect(0, 0, K.W, K.H);
    mask = document.createElement('canvas'); mask.width = K.W; mask.height = K.H; mg = mask.getContext('2d');
    drops = Array.from({ length: Math.round(K.W * K.H / 1400) }, () => ({ x: K.rand(0, K.W), y: K.rand(0, K.H), r: Math.pow(Math.random(), 3) * 5 + .8 })); };
  make(); K.onResize(make);
  const drawDrop = (g, x, y, r) => { g.fillStyle = 'rgba(40,55,75,.28)'; g.beginPath(); g.ellipse(x, y + r * .15, r, r * 1.1, 0, 0, K.TAU); g.fill();
    const gr = g.createRadialGradient(x - r * .3, y - r * .4, 0, x, y, r); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.35, 'rgba(230,240,250,.35)'); gr.addColorStop(1, 'rgba(160,180,200,.15)'); g.fillStyle = gr; g.beginPath(); g.ellipse(x, y, r * .9, r, 0, 0, K.TAU); g.fill(); };
  let done = false, cleared = 0;
  K.loop(dt => { const g = L.g; g.clearRect(0, 0, K.W, K.H); g.drawImage(fog, 0, 0); g.globalCompositeOperation = 'destination-out'; g.drawImage(mask, 0, 0); g.globalCompositeOperation = 'source-over';
    if (Math.random() < .06 && runs.length < 8) { const d = drops[Math.random() * drops.length | 0]; if (d && d.r > 3) runs.push({ x: d.x, y: d.y, r: d.r, v: K.rand(60, 160) }); }
    for (let i = runs.length - 1; i >= 0; i--) { const r = runs[i]; r.y += r.v * dt; r.x += K.rand(-.4, .4); mg.globalCompositeOperation = 'source-over'; mg.fillStyle = 'rgba(0,0,0,.35)'; mg.beginPath(); mg.arc(r.x, r.y, r.r * .55, 0, K.TAU); mg.fill(); if (r.y > K.H + 10) runs.splice(i, 1); else drawDrop(g, r.x, r.y, r.r); }
    drops.forEach(d => drawDrop(g, d.x, d.y, d.r)); });
  const wipe = (x, y) => { const gr = mg.createRadialGradient(x, y, 0, x, y, 34); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.7, 'rgba(0,0,0,.9)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); mg.fillStyle = gr; mg.fillRect(x - 34, y - 34, 68, 68);
    drops = drops.filter(d => Math.hypot(d.x - x, d.y - y) > 30); };
  const measure = () => { const s = document.createElement('canvas'); s.width = 40; s.height = 80; const sg = s.getContext('2d'); sg.drawImage(mask, 0, 0, 40, 80); const d = sg.getImageData(0, 0, 40, 80).data; let n = 0; for (let i = 3; i < d.length; i += 4) if (d[i] > 120) n++; return n / (40 * 80); };
  let last = 0;
  K.drag(K.gw, { start: (x, y) => { wipe(x, y); K.hideCard(400); }, move: (x, y) => { wipe(x, y); const now = performance.now(); if (!done && now - last > 250) { last = now; cleared = measure(); if (cleared > .32) { done = true; K.SFX.chime([659, 880, 1175], .12); K.go(() => K.fade(900)); } } } });
} });

// 21. 우산 씌우기 — 쏟아지는 비, 길게 누르면 우산이 펼쳐지고 비가 멎음
reg('umbrella', { look: 'clear', cardPos: 'top', input: false, hint: '화면을 길게 눌러 우산을 펼치세요', mount(K) {
  K.css('ix-um', `.intro-umbrella { background:linear-gradient(180deg,#6F7F96 0%,#55657D 60%,#7A8AA0 100%); color:#F2F5FA; transition:background 1.4s; }
    .intro-umbrella.sun { background:linear-gradient(180deg,#F7E7C9 0%,#F3D9B5 50%,#EFE3D0 100%); }
    .intro-umbrella .ix-title { -webkit-text-fill-color:#FFFFFF !important; background:none !important; text-shadow:0 2px 10px rgba(0,0,0,.25); }
    .ix-um { position:absolute; width:190px; height:190px; margin:-150px 0 0 -95px; z-index:3; pointer-events:none; transform-origin:50% 40%; }`);
  const L = K.layer(0); let rate = 1, drops = [], splash = [];
  K.loop(dt => { const g = L.g; g.clearRect(0, 0, K.W, K.H);
    for (let i = 0; i < 9 * rate; i++) drops.push({ x: K.rand(-60, K.W), y: K.rand(-40, -5), v: K.rand(900, 1300), l: K.rand(12, 26) });
    g.strokeStyle = 'rgba(225,235,248,.55)'; g.lineWidth = 1.1; g.beginPath();
    for (let i = drops.length - 1; i >= 0; i--) { const d = drops[i]; d.y += d.v * dt; d.x += d.v * .12 * dt; if (d.y > K.H - 4) { if (Math.random() < .4) splash.push({ x: d.x, y: K.H - 4, t: 0 }); drops.splice(i, 1); continue; }
      if (um && Math.hypot(d.x - um.x, d.y - (um.y - 40)) < 95 * um.k && d.y < um.y) { splash.push({ x: d.x, y: d.y, t: 0 }); drops.splice(i, 1); continue; }
      g.moveTo(d.x, d.y); g.lineTo(d.x - d.l * .12, d.y - d.l); }
    g.stroke();
    for (let i = splash.length - 1; i >= 0; i--) { const s = splash[i]; s.t += dt; if (s.t > .25) { splash.splice(i, 1); continue; } g.strokeStyle = `rgba(230,240,250,${.6 * (1 - s.t / .25)})`; g.beginPath(); g.ellipse(s.x, s.y, 2 + s.t * 30, 1 + s.t * 6, 0, Math.PI, K.TAU); g.stroke(); }
  });
  let um = null, holdT = null, done = false;
  const svg = `<svg class="ix-um" viewBox="0 0 200 200"><defs><linearGradient id="umg" x1="0" x2="1"><stop offset="0" stop-color="#2F3E66"/><stop offset=".5" stop-color="#46598C"/><stop offset="1" stop-color="#26335A"/></linearGradient></defs>
    <path d="M10 92 Q100 -10 190 92 Q172 80 154 92 Q136 80 118 92 Q100 80 82 92 Q64 80 46 92 Q28 80 10 92 Z" fill="url(#umg)" stroke="#1d2744" stroke-width="2"/>
    <path d="M100 18 L46 92 M100 18 L82 92 M100 18 L118 92 M100 18 L154 92" stroke="rgba(255,255,255,.18)" stroke-width="1.5" fill="none"/>
    <line x1="100" y1="8" x2="100" y2="170" stroke="#5a4636" stroke-width="4"/><path d="M100 170 Q100 186 88 186 Q78 186 78 176" stroke="#5a4636" stroke-width="5" fill="none" stroke-linecap="round"/></svg>`;
  const open = (x, y) => { done = true; K.go(async () => { const el = K.el(svg); el.style.left = x + 'px'; el.style.top = y + 'px'; um = { x, y, k: 0 };
    await el.animate([{ transform: 'scale(.2,.5) rotate(-20deg)', opacity: 0 }, { transform: 'scale(1.05,.95) rotate(4deg)', opacity: 1, offset: .7 }, { transform: 'scale(1) rotate(0)', opacity: 1 }], { duration: K.RM ? 100 : 700, easing: 'cubic-bezier(.3,1.4,.5,1)', fill: 'forwards' }).finished;
    um.k = 1; K.SFX.whoosh(.4); K.hint('비가 그쳤어요'); const t0 = performance.now(); K.loop(() => { rate = Math.max(0, 1 - (performance.now() - t0) / 1400); return rate > 0; });
    await K.wait(900); K.gw.classList.add('sun'); await K.wait(1300); K.hideCard(200); await K.fade(800); }); };
  K.gw.addEventListener('pointerdown', e => { if (done || K.isUI(e.target)) return; const x = e.clientX, y = e.clientY; holdT = setTimeout(() => open(x, y), 550); K.hint('그대로 꾹…'); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => K.gw.addEventListener(t, () => { if (holdT && !done) { clearTimeout(holdT); holdT = null; K.hint('조금 더 길게 눌러 주세요'); } }));
} });

// 22. 쪽지 펼치기 — 꼬깃꼬깃 접힌 쪽지를 누를 때마다 한 겹씩 펴지고, 마지막에 한 줄이 적혀 있음
reg('note', { look: 'paper', cardPos: 'top', hint: '구겨진 쪽지를 눌러 펴 보세요 · 0/3', mount(K) {
  const L = K.layer(2), NX = 14, NY = 10, noise = [], fold = [];
  for (let j = 0; j <= NY; j++) for (let i = 0; i <= NX; i++) { noise.push([K.rand(-1, 1), K.rand(-1, 1), K.rand(-1, 1)]); }
  let c = 1, target = 1, stage = 0, done = false;
  const sw = () => Math.min(K.W * .82, 330), sh = () => sw() * .66;
  const draw = () => { const g = L.g; g.clearRect(0, 0, K.W, K.H); const cx = K.W / 2, cy = K.H * .58, W = sw(), H = sh(), pts = [];
    for (let j = 0; j <= NY; j++) for (let i = 0; i <= NX; i++) { const n = noise[j * (NX + 1) + i], u = (i / NX - .5) * W, v = (j / NY - .5) * H, s = 1 - .74 * c;
      pts.push([cx + u * s + n[0] * 16 * c, cy + v * s + n[1] * 16 * c, n[2] * 38 * c]); }
    g.save(); g.shadowColor = 'rgba(60,40,20,.25)'; g.shadowBlur = 18; g.shadowOffsetY = 8; g.fillStyle = '#F6EEDD';
    g.beginPath(); for (let i = 0; i <= NX; i++) { const p = pts[i]; i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); } for (let j = 0; j <= NY; j++) { const p = pts[j * (NX + 1) + NX]; g.lineTo(p[0], p[1]); } for (let i = NX; i >= 0; i--) { const p = pts[NY * (NX + 1) + i]; g.lineTo(p[0], p[1]); } for (let j = NY; j >= 0; j--) { const p = pts[j * (NX + 1)]; g.lineTo(p[0], p[1]); } g.fill(); g.restore();
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) { const a = pts[j * (NX + 1) + i], b = pts[j * (NX + 1) + i + 1], d = pts[(j + 1) * (NX + 1) + i], e = pts[(j + 1) * (NX + 1) + i + 1];
      [[a, b, e], [a, e, d]].forEach(([p, q, r], k) => { const sh2 = ((q[2] - p[2]) * .9 + (r[2] - p[2]) * .5) / 40, l = 236 - 34 * c * (k ? .5 : 1) + sh2 * 60 * c;
        g.fillStyle = `rgb(${l + 10 | 0},${l + 2 | 0},${l - 16 | 0})`; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.lineTo(r[0], r[1]); g.closePath(); g.fill(); if (c > .05) { g.strokeStyle = `rgba(140,115,80,${.25 * c})`; g.lineWidth = .5; g.stroke(); } }); }
    if (c < .3) { const a = 1 - c / .3; g.strokeStyle = `rgba(150,125,90,${.22 * a})`; g.lineWidth = 1; [[.5, 0, .5, 1], [0, .5, 1, .5]].forEach(([x0, y0, x1, y1]) => { g.beginPath(); g.moveTo(cx + (x0 - .5) * W, cy + (y0 - .5) * H); g.lineTo(cx + (x1 - .5) * W, cy + (y1 - .5) * H); g.stroke(); });
      g.fillStyle = `rgba(55,40,30,${a})`; g.font = `${Math.min(19, W / 15)}px "Song Myung","Gowun Batang",serif`; g.textAlign = 'center'; g.fillText(K.line, cx, cy - 4); g.font = `${Math.min(14, W / 22)}px "Song Myung","Gowun Batang",serif`; g.fillText('— ' + K.caller, cx + W * .22, cy + H * .3); } };
  K.loop(dt => { c += (target - c) * Math.min(1, dt * 6); draw(); });
  K.onTap(() => { if (done) return; stage++; target = [1, .62, .3, 0][stage]; K.SFX.page(); K.hint(`구겨진 쪽지를 눌러 펴 보세요 · ${stage}/3`);
    if (stage >= 3) { done = true; K.hint(''); K.go(async () => { await K.wait(2600); K.hideCard(200); await K.fade(700); }); } });
} });

// 23. 메신저 알림 — 잠금화면에 캐릭터의 메시지 알림, 위로 밀거나 알림을 누르면 열림
reg('lockscreen', { look: 'clear', card: false, mount(K) {
  const d = new Date(), hh = String(d.getHours()).padStart(2, '0'), mm = String(d.getMinutes()).padStart(2, '0'), days = ['일', '월', '화', '수', '목', '금', '토'];
  K.css('ix-lock', `.intro-lockscreen { background:radial-gradient(70% 50% at 30% 20%, rgb(var(--accent-300)) 0%, transparent 70%), radial-gradient(60% 50% at 80% 80%, rgb(var(--accent-500)) 0%, transparent 70%), linear-gradient(160deg, rgb(var(--accent-600)), rgb(var(--accent-800))); color:#fff; font-family:Pretendard,sans-serif; }
    .ix-ls { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; padding-top:11vh; text-align:center; }
    .ix-ls .dt { font-size:17px; font-weight:500; opacity:.92; } .ix-ls .tm { font-size:clamp(68px,22vw,96px); font-weight:300; letter-spacing:-.02em; line-height:1.05; margin-top:2px; }
    .ix-ls .nt { margin-top:7vh; width:min(92vw,380px); display:flex; gap:12px; align-items:flex-start; text-align:left; padding:13px 14px; border-radius:20px; background:rgba(255,255,255,.28); backdrop-filter:blur(18px); -webkit-backdrop-filter:blur(18px); color:#fff; box-shadow:0 8px 24px rgba(0,0,0,.12); cursor:pointer; opacity:0; transform:translateY(-14px) scale(.96); transition:opacity .5s, transform .5s cubic-bezier(.2,1.3,.4,1); border:0; }
    .ix-ls .nt.on { opacity:1; transform:none; } .ix-ls .ic { flex:0 0 38px; height:38px; border-radius:10px; background:linear-gradient(140deg,#fff,rgb(var(--accent-200))); color:rgb(var(--accent-800)); display:grid; place-items:center; font:700 18px "Song Myung",serif; }
    .ix-ls .nm { font-size:14px; font-weight:700; display:flex; justify-content:space-between; } .ix-ls .nm span { font-weight:400; opacity:.75; font-size:12px; } .ix-ls .tx { font-size:15px; margin-top:2px; }
    .ix-ls .up { position:absolute; bottom:max(4vh,26px); left:0; right:0; font-size:13px; opacity:.85; animation:ixup 1.8s ease-in-out infinite; } .ix-ls .bar { position:absolute; bottom:max(1.6vh,10px); left:50%; width:134px; height:5px; margin-left:-67px; border-radius:3px; background:rgba(255,255,255,.85); }
    @keyframes ixup { 0%,100% { transform:translateY(0); opacity:.5; } 50% { transform:translateY(-8px); opacity:1; } }`);
  const box = K.el(`<div class="ix-ls"><div class="dt">${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일</div><div class="tm">${hh}:${mm}</div>
    <button type="button" data-ix class="nt"><div class="ic">${K.escI([...K.caller][0] || '✦')}</div><div style="flex:1"><div class="nm">${K.escI(K.caller)} <span>지금</span></div><div class="tx">${K.escI(P.introMessage || '지금 뭐 해?')}</div></div></button>
    <div class="up">위로 밀어서 열기</div><div class="bar"></div></div>`);
  const nt = box.querySelector('.nt'); setTimeout(() => { nt.classList.add('on'); if (navigator.vibrate) try { navigator.vibrate([30, 60, 30]); } catch {} }, 900);
  const open = () => K.go(async () => { K.SFX.chime([988, 1319], .09); await K.slideUp(700); });
  nt.addEventListener('click', open);
  K.drag(K.gw, { move: (x, y, dx, dy) => { if (dy < 0) box.style.transform = `translateY(${dy * .6}px)`; }, end: (x, y, dx, dy) => { if (dy < -70) open(); else box.style.transform = ''; } });
} });

// 24. 전화 받기 — 캐릭터에게 걸려 온 전화, 밀어서 받으면 짧은 인사와 함께 입장
reg('call', { look: 'clear', card: false, mount(K) {
  K.css('ix-call', `.intro-call { background:linear-gradient(170deg,#3B4766 0%,#5A4B72 55%,#7B6283 100%); color:#fff; font-family:Pretendard,sans-serif; }
    .ix-cl { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; padding-top:10vh; text-align:center; }
    .ix-cl .av { width:116px; height:116px; border-radius:50%; position:relative; display:grid; place-items:center; font:700 44px "Song Myung",serif; color:#fff; background:linear-gradient(140deg,rgb(var(--accent-300)),rgb(var(--accent-700))); background-size:cover; background-position:center; }
    .ix-cl .av::before, .ix-cl .av::after { content:''; position:absolute; inset:-10px; border-radius:50%; border:2px solid rgba(255,255,255,.35); animation:ixring 1.8s ease-out infinite; } .ix-cl .av::after { animation-delay:.9s; }
    @keyframes ixring { from { transform:scale(.9); opacity:1; } to { transform:scale(1.5); opacity:0; } }
    .ix-cl .nm { margin-top:26px; font-size:30px; font-weight:600; } .ix-cl .sb { margin-top:6px; font-size:15px; opacity:.8; }
    .ix-cl .cap { margin-top:7vh; min-height:3.4em; width:min(86vw,360px); font:17px/1.7 "Gowun Batang",serif; }
    .ix-cl .sl { position:absolute; bottom:max(10vh,60px); left:50%; width:min(84vw,330px); height:68px; margin-left:calc(min(84vw,330px) / -2); border-radius:34px; background:rgba(255,255,255,.18); backdrop-filter:blur(10px); overflow:hidden; }
    .ix-cl .sl span { position:absolute; inset:0; display:grid; place-items:center; font-size:16px; padding-left:40px; background:linear-gradient(90deg,rgba(255,255,255,.35),#fff,rgba(255,255,255,.35)); background-size:200% 100%; -webkit-background-clip:text; background-clip:text; color:transparent; animation:ixshine 2.2s linear infinite; }
    @keyframes ixshine { from { background-position:200% 0; } to { background-position:-200% 0; } }
    .ix-cl .kn { position:absolute; left:5px; top:5px; width:58px; height:58px; border-radius:50%; background:#34C759; display:grid; place-items:center; touch-action:none; cursor:grab; box-shadow:0 4px 12px rgba(0,0,0,.2); }
    .ix-cl .dc { position:absolute; bottom:max(3vh,18px); left:50%; transform:translateX(-50%); font-size:14px; opacity:.85; background:none; border:0; color:#fff; cursor:pointer; }`);
  const box = K.el(`<div class="ix-cl"><div class="av" ${K.charImg ? `style="background-image:url('${K.escI(K.charImg)}')"` : ''}>${K.charImg ? '' : K.escI([...K.caller][0] || '✦')}</div><div class="nm">${K.escI(K.caller)}</div><div class="sb">휴대전화</div><div class="cap"></div>
    <div class="sl"><span>밀어서 통화하기</span><div class="kn"><svg width="26" height="26" viewBox="0 0 24 24" fill="#fff"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z"/></svg></div></div>
    <button type="button" class="dc">거절</button></div>`);
  const kn = box.querySelector('.kn'), sl = box.querySelector('.sl'), cap = box.querySelector('.cap');
  if (K.charImg) { const im = new Image(); im.onerror = () => { const a = box.querySelector('.av'); a.style.backgroundImage = ''; a.textContent = [...K.caller][0] || '✦'; }; im.src = K.charImg; }
  let answered = false;
  const talk = async (text) => { box.querySelector('.sb').textContent = '00:00'; let s = 0; const tm = setInterval(() => { s++; box.querySelector('.sb').textContent = `00:${String(s).padStart(2, '0')}`; }, 1000);
    for (const ch of text) { cap.textContent += ch; await K.wait(55); } await K.wait(1400); clearInterval(tm); };
  const answer = () => { if (answered) return; answered = true; sl.style.transition = 'opacity .3s'; sl.style.opacity = 0; box.querySelector('.dc').style.display = 'none'; box.querySelector('.av').style.setProperty('--x', 0); K.SFX.beep();
    K.go(async () => { await talk(P.introGreeting || K.line); await K.fade(700); }); };
  const max = () => sl.clientWidth - 63;
  K.drag(kn, { move: (x, y, dx) => { if (answered) return; kn.style.transform = `translateX(${K.clamp(dx, 0, max())}px)`; }, end: (x, y, dx) => { if (answered) return; if (dx > max() * .7) { kn.style.transform = `translateX(${max()}px)`; answer(); } else { kn.style.transition = 'transform .3s'; kn.style.transform = ''; setTimeout(() => kn.style.transition = '', 300); } } });
  box.querySelector('.dc').addEventListener('click', () => { if (answered) return; answered = true; sl.style.opacity = 0; box.querySelector('.dc').style.display = 'none'; box.querySelector('.sb').textContent = '통화 종료';
    K.go(async () => { cap.textContent = '…다음에 다시 걸게요. 그래도 들어와요.'; await K.wait(1800); await K.fade(700); }); });
} });

// 25. 손 맞대기 — 화면 너머의 손바닥에 손가락을 대고 길게 누르면 따뜻한 빛이 번짐
reg('palm', { look: 'clear', cardPos: 'top', input: false, hint: '빛나는 손바닥에 손가락을 대고 길게 눌러 주세요', mount(K) {
  K.css('ix-palm', `.intro-palm { background:radial-gradient(70% 55% at 50% 58%, #5C4372 0%, #3B3159 60%, #2E2A4A 100%); color:#FFF3E6; }
    .intro-palm .ix-title { -webkit-text-fill-color:#FFE9CF !important; background:none !important; text-shadow:0 0 18px rgba(255,200,150,.5); }`);
  const L = K.layer(0); let hand;
  const make = () => { const s = Math.min(K.W, K.H) * .5, c = document.createElement('canvas'); c.width = c.height = s * 1.6; const h = c.getContext('2d'), o = s * .3; h.translate(o, o);
    h.fillStyle = '#fff'; h.lineCap = 'round'; h.beginPath(); h.roundRect ? h.roundRect(s * .22, s * .42, s * .56, s * .52, s * .2) : h.rect(s * .22, s * .42, s * .56, s * .52); h.fill();
    [[.29, .46, .28, .1, .085], [.42, .44, .42, .03, .09], [.55, .44, .57, .05, .088], [.68, .47, .71, .16, .078]].forEach(([x0, y0, x1, y1, w]) => { h.lineWidth = s * w * 1.7; h.strokeStyle = '#fff'; h.beginPath(); h.moveTo(x0 * s, y0 * s); h.lineTo(x1 * s, y1 * s); h.stroke(); });
    h.lineWidth = s * .16; h.beginPath(); h.moveTo(s * .26, s * .74); h.lineTo(s * .05, s * .5); h.stroke(); hand = { c, s, o }; };
  make(); K.onResize(make);
  let p = 0, holding = false, at = null, done = false;
  K.loop((dt, now) => { const g = L.g, cx = K.W / 2, cy = K.H * .6, { c, s, o } = hand; g.clearRect(0, 0, K.W, K.H);
    p = holding ? Math.min(1, p + dt / 1.3) : Math.max(0, p - dt * 1.5); const pulse = .5 + .5 * Math.sin(now / 420);
    g.save(); g.globalAlpha = .55 + .2 * pulse + p * .3; g.filter = 'blur(16px)'; g.drawImage(c, cx - s / 2 - o, cy - s / 2 - o); g.filter = 'none'; g.restore();
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = .35 + p * .4; g.drawImage(c, cx - s / 2 - o, cy - s / 2 - o); g.restore();
    const gc = g.createLinearGradient(0, cy - s, 0, cy + s); g.save(); g.globalCompositeOperation = 'source-atop'; gc.addColorStop(0, '#FFE8C4'); gc.addColorStop(1, '#FFB98A'); g.fillStyle = gc; g.globalAlpha = .9; g.fillRect(0, 0, K.W, K.H); g.restore();
    if (at && p > 0) { const R = 30 + p * Math.hypot(K.W, K.H); const gr = g.createRadialGradient(at[0], at[1], 0, at[0], at[1], R); gr.addColorStop(0, `rgba(255,236,200,${.85 * p})`); gr.addColorStop(.5, `rgba(255,190,140,${.45 * p})`); gr.addColorStop(1, 'rgba(255,190,140,0)'); g.fillStyle = gr; g.fillRect(0, 0, K.W, K.H); }
    if (p >= 1 && !done) { done = true; K.SFX.chime([523, 659, 784, 1047], .18); K.hint('따뜻해요'); K.go(async () => { await K.wait(500); K.flash('#FFF1DC', 900, .95); K.hideCard(100); await K.fade(900); }); } });
  K.gw.addEventListener('pointerdown', e => { if (K.isUI(e.target) || done) return; holding = true; at = [e.clientX, e.clientY]; K.SFX.heart(); });
  ['pointerup', 'pointercancel', 'pointerleave'].forEach(t => K.gw.addEventListener(t, () => { if (!done && holding) { holding = false; if (p < 1) K.hint('조금 더 오래 맞대 주세요'); } }));
} });

// 26. 눈 맞추기 — 감긴 눈을 터치하면 천천히 눈을 뜨고, 눈꺼풀처럼 화면이 위아래로 열림
reg('eye', { look: 'paper', cardPos: 'top', input: false, hint: '감긴 눈을 살짝 터치해 보세요', mount(K) {
  const L = K.layer(2); let open = 0, target = 0, blink = 0;
  K.loop((dt, now) => { const g = L.g, cx = K.W / 2, cy = K.H * .58, w = Math.min(K.W * .78, 340), h = w * .42; g.clearRect(0, 0, K.W, K.H);
    open += (target - open) * Math.min(1, dt * 2.2); const o = Math.max(0, open - blink);
    const top = cy - h * .5 * o, bot = cy + h * .32 * o;
    g.save(); g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, top - h * .35 * o, cx + w / 2, cy); g.quadraticCurveTo(cx, bot + h * .12 * o, cx - w / 2, cy); g.closePath();
    const sc = g.createRadialGradient(cx, cy, 0, cx, cy, w * .5); sc.addColorStop(0, '#FFFFFF'); sc.addColorStop(1, '#E8E2DA'); g.fillStyle = sc; g.fill(); g.clip();
    const ir = h * .46, ic = g.createRadialGradient(cx, cy, ir * .2, cx, cy, ir); ic.addColorStop(0, rgbVar('--accent-300')); ic.addColorStop(.6, rgbVar('--accent-600')); ic.addColorStop(1, rgbVar('--accent-900')); g.fillStyle = ic; g.beginPath(); g.arc(cx, cy, ir, 0, K.TAU); g.fill();
    g.strokeStyle = 'rgba(255,255,255,.18)'; for (let i = 0; i < 36; i++) { const a = i / 36 * K.TAU; g.beginPath(); g.moveTo(cx + Math.cos(a) * ir * .32, cy + Math.sin(a) * ir * .32); g.lineTo(cx + Math.cos(a) * ir * .92, cy + Math.sin(a) * ir * .92); g.stroke(); }
    g.fillStyle = '#15131a'; g.beginPath(); g.arc(cx, cy, ir * (.42 + .06 * Math.sin(now / 900)), 0, K.TAU); g.fill();
    g.fillStyle = 'rgba(255,255,255,.92)'; g.beginPath(); g.arc(cx - ir * .3, cy - ir * .32, ir * .14, 0, K.TAU); g.fill(); g.beginPath(); g.arc(cx + ir * .22, cy + ir * .2, ir * .06, 0, K.TAU); g.fill();
    const sh = g.createLinearGradient(0, top - 10, 0, top + h * .4); sh.addColorStop(0, 'rgba(60,40,30,.35)'); sh.addColorStop(1, 'rgba(60,40,30,0)'); g.fillStyle = sh; g.fillRect(cx - w, top - 20, w * 2, h * .6); g.restore();
    const ly = top - h * .35 * o + h * .22 * (1 - o);                 // 윗눈꺼풀 곡선 (감았을 때는 아래로 살짝 휜 선)
    g.strokeStyle = '#3a2a24'; g.lineWidth = 3.2; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, ly, cx + w / 2, cy); g.stroke();
    if (o > .05) { g.lineWidth = 1.4; g.strokeStyle = 'rgba(58,42,36,.6)'; g.beginPath(); g.moveTo(cx - w / 2, cy); g.quadraticCurveTo(cx, bot + h * .12 * o, cx + w / 2, cy); g.stroke(); }
    else { g.strokeStyle = 'rgba(58,42,36,.25)'; g.lineWidth = 1; g.beginPath(); g.moveTo(cx - w * .36, cy + h * .2); g.quadraticCurveTo(cx, cy + h * .36, cx + w * .36, cy + h * .2); g.stroke(); }
    g.lineWidth = 1.8; g.strokeStyle = '#3a2a24';
    for (let i = 2; i < 15; i++) { const t = i / 16, x = (1 - t) * (1 - t) * (cx - w / 2) + 2 * (1 - t) * t * cx + t * t * (cx + w / 2), y = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * ly + t * t * cy;
      const tx = 2 * (1 - t) * (cx - (cx - w / 2)) + 2 * t * ((cx + w / 2) - cx), ty = 2 * (1 - t) * (ly - cy) + 2 * t * (cy - ly), nl = Math.hypot(tx, ty); let nx = ty / nl, ny = -tx / nl;   // 곡선의 바깥쪽 방향
      const dir = -1; nx *= dir; ny *= dir; if (o <= .1 && t < .4) continue;   // 감은 눈: 바깥쪽에만 길게 휘어진 속눈썹
      const side = o > .1 ? (t - .5) * 2 : (t - .25) * 2.4, len = o > .1 ? 7 + 9 * Math.sin(t * Math.PI) : 6 + 16 * Math.pow(t, 1.4);
      g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + nx * len * .6 + side * 3, y + ny * len * .6, x + nx * len + side * len * .55, y + ny * len + (o > .1 ? -2 : 3)); g.stroke(); } });
  K.onTap(() => { if (target) return; target = 1; K.SFX.chime([440, 554, 659], .2); K.hint('');
    K.go(async () => { await K.wait(1500); const b0 = performance.now(); await new Promise(r => K.loop(() => { const k = (performance.now() - b0) / 260; blink = k < .5 ? k * 2 : Math.max(0, 2 - k * 2); if (k >= 1) { blink = 0; r(); return false; } }));
      await K.wait(500); K.hideCard(200); await K.splitV(900); }); });
} });

// 27. 향수 뿌리기 — 병을 누르면 안개가 퍼지고, 화면이 서서히 맑아짐
reg('perfume', { look: 'paper', cardPos: 'top', input: false, hint: '향수병을 눌러 뿌려 보세요', mount(K) {
  K.css('ix-pf', `.ix-pf { position:absolute; left:50%; top:60%; width:150px; height:230px; margin:-115px 0 0 -75px; z-index:3; cursor:pointer; border:0; background:none; padding:0; filter:drop-shadow(0 14px 18px rgba(80,50,40,.25)); transition:transform .15s; }
    .ix-pf:active { transform:translateY(3px); } .ix-pf .cap { transition:transform .12s; } .ix-pf.press .cap { transform:translateY(6px); }`);
  const btn = K.el(`<button type="button" data-ix class="ix-pf" aria-label="향수 뿌리기"><svg viewBox="0 0 150 230" width="150" height="230"><defs>
      <linearGradient id="gl" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,.75)"/><stop offset=".3" stop-color="rgba(255,255,255,.15)"/><stop offset=".8" stop-color="rgba(255,255,255,.05)"/><stop offset="1" stop-color="rgba(255,255,255,.55)"/></linearGradient>
      <linearGradient id="lq" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgb(var(--accent-200))"/><stop offset="1" stop-color="rgb(var(--accent-500))"/></linearGradient>
      <linearGradient id="gd" x1="0" x2="1"><stop offset="0" stop-color="#8a6a2f"/><stop offset=".45" stop-color="#F1D9A0"/><stop offset="1" stop-color="#7a5a22"/></linearGradient></defs>
    <g class="cap"><rect x="62" y="20" width="26" height="30" rx="3" fill="url(#gd)"/><rect x="70" y="12" width="10" height="10" rx="2" fill="url(#gd)"/><rect x="58" y="48" width="34" height="10" rx="2" fill="url(#gd)"/></g>
    <path d="M30 70 Q30 58 44 58 L106 58 Q120 58 120 70 L126 196 Q127 214 108 214 L42 214 Q23 214 24 196 Z" fill="rgba(255,255,255,.35)" stroke="rgba(120,100,90,.35)" stroke-width="1.5"/>
    <path d="M34 110 L116 110 L121 196 Q122 208 108 208 L42 208 Q28 208 29 196 Z" fill="url(#lq)" opacity=".85"/>
    <path d="M30 70 Q30 58 44 58 L106 58 Q120 58 120 70 L126 196 Q127 214 108 214 L42 214 Q23 214 24 196 Z" fill="url(#gl)"/>
    <rect x="52" y="132" width="46" height="40" fill="rgba(255,252,245,.88)" stroke="#B8914A" stroke-width=".8"/><text x="75" y="150" text-anchor="middle" font-family="Cinzel,serif" font-size="8" fill="#5a4630" letter-spacing="1">${K.escI(K.title.slice(0, 10))}</text><text x="75" y="162" text-anchor="middle" font-family="Cinzel,serif" font-size="5" fill="#8a7050" letter-spacing="1.5">EAU DE PARFUM</text></svg></button>`);
  const mist = [];
  let haze = 0, done = false;
  K.loop(dt => { const g = K.g; g.clearRect(0, 0, K.W, K.H);
    for (let i = mist.length - 1; i >= 0; i--) { const m = mist[i]; m.t += dt; if (m.t > m.life) { mist.splice(i, 1); continue; } m.x += m.vx * dt; m.y += m.vy * dt; m.vx *= .985; m.vy *= .985; m.r += 40 * dt;
      const a = .5 * (1 - m.t / m.life), gr = g.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r); gr.addColorStop(0, `rgba(255,245,250,${a})`); gr.addColorStop(1, 'rgba(255,240,248,0)'); g.fillStyle = gr; g.fillRect(m.x - m.r, m.y - m.r, m.r * 2, m.r * 2); }
    if (haze > 0) { g.fillStyle = `rgba(255,246,248,${haze})`; g.fillRect(0, 0, K.W, K.H); } });
  btn.addEventListener('click', () => { if (done) return; done = true; K.prime(); btn.classList.add('press'); setTimeout(() => btn.classList.remove('press'), 160); K.SFX.spray();
    const r = btn.getBoundingClientRect(), nx = r.left + r.width / 2, ny = r.top + 30;
    for (let i = 0; i < 160; i++) mist.push({ x: nx, y: ny, vx: K.rand(-260, 260), vy: K.rand(-420, -80), r: K.rand(6, 22), t: 0, life: K.rand(1.2, 2.6) });
    K.go(async () => { const t0 = performance.now(); await new Promise(res => K.loop(() => { const k = (performance.now() - t0) / 1600; haze = Math.min(.95, k * .95); if (k >= 1) { res(); return false; } })); K.hideCard(0); btn.style.display = 'none'; await K.fade(1400); }); });
} });

// 28. 두근거림 — 하트가 뛰는 박자에 맞춰 3번 톡. 줄어드는 고리가 하트에 닿을 때 누르면 돼요 (쉬운 힌트)
reg('heartbeat', { look: 'clear', cardPos: 'top', input: false, hint: '고리가 하트에 닿을 때 톡! (3번)', mount(K) {
  K.css('ix-hb', `.intro-heartbeat { background:radial-gradient(70% 55% at 50% 58%, #6A3550 0%, #45263F 60%, #32223A 100%); color:#FFE9EF; }
    .intro-heartbeat .ix-title { -webkit-text-fill-color:#FFE3EA !important; background:none !important; text-shadow:0 0 16px rgba(255,140,170,.45); }
    .ix-hb-dots { position:absolute; left:50%; top:calc(58% + 120px); transform:translateX(-50%); display:flex; gap:14px; z-index:3; } .ix-hb-dots i { width:14px; height:14px; border-radius:50%; border:2px solid #FF9FB6; } .ix-hb-dots i.on { background:#FF9FB6; box-shadow:0 0 12px #FF9FB6; }`);
  const L = K.layer(0), PERIOD = .95, dots = K.el(`<div class="ix-hb-dots"><i></i><i></i><i></i></div>`);
  let t0 = performance.now(), hits = 0, tries = 0, done = false, pops = [], ecg = [];
  const heart = (g, x, y, s) => { g.beginPath(); g.moveTo(x, y + s * .35); g.bezierCurveTo(x - s * 1.1, y - s * .35, x - s * .45, y - s * 1.05, x, y - s * .45); g.bezierCurveTo(x + s * .45, y - s * 1.05, x + s * 1.1, y - s * .35, x, y + s * .35); g.closePath(); };
  K.loop((dt, now) => { const g = L.g, cx = K.W / 2, cy = K.H * .58, t = (now - t0) / 1000, ph = (t % PERIOD) / PERIOD, beat = Math.exp(-ph * 9); g.clearRect(0, 0, K.W, K.H);
    ecg.push(cy + 150 - (ph < .08 ? -40 * Math.sin(ph / .08 * Math.PI) : ph < .14 ? 18 * Math.sin((ph - .08) / .06 * Math.PI) : 0)); if (ecg.length > K.W / 3) ecg.shift();
    g.strokeStyle = 'rgba(255,160,185,.55)'; g.lineWidth = 2; g.beginPath(); ecg.forEach((y, i) => i ? g.lineTo(i * 3, y) : g.moveTo(0, y)); g.stroke();
    const s = 46 * (1 + beat * .22 + (done ? 2 : 0) * 0);
    g.save(); g.shadowColor = '#FF8FAE'; g.shadowBlur = 20 + beat * 30; g.fillStyle = '#FF7C9E'; heart(g, cx, cy, s); g.fill(); g.restore();
    if (!done) { const rr = s * 1.15 + (1 - ph) * 120; g.strokeStyle = `rgba(255,220,230,${.25 + ph * .6})`; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy - s * .2, rr, 0, K.TAU); g.stroke(); }
    for (let i = pops.length - 1; i >= 0; i--) { const p = pops[i]; p.t += dt; if (p.t > .6) { pops.splice(i, 1); continue; } g.strokeStyle = `rgba(255,190,210,${1 - p.t / .6})`; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy - 10, s + p.t * 160, 0, K.TAU); g.stroke(); } });
  K.onTap(() => { if (done) return; const t = (performance.now() - t0) / 1000, ph = (t % PERIOD) / PERIOD, off = Math.min(ph, 1 - ph) * PERIOD; tries++;
    if (off < .24 || tries > 7) { hits++; pops.push({ t: 0 }); K.SFX.heart(); dots.children[hits - 1].classList.add('on'); K.hint(hits < 3 ? '좋아요! ' + (3 - hits) + '번 더' : '');
      if (hits >= 3) { done = true; K.SFX.chime([523, 659, 784, 1047], .1); K.go(async () => { await K.wait(700); K.flash('#FFD9E3', 800, .9); K.hideCard(100); await K.fade(800); }); } }
    else K.hint('고리가 하트에 닿는 순간 톡!'); });
} });

// ================= 묶음 4 · 미스터리·스릴러 =================

// 29. 수사 보드 — 코르크 보드의 핀을 번호 순서대로 빨간 실로 이으면 사건 파일이 열림 (번호·점선 안내로 쉽게)
reg('board', { look: 'clear', cardPos: 'top', input: false, hint: '① 핀에서 ② 핀으로 손가락을 끌어 빨간 실을 이어 주세요', mount(K) {
  K.css('ix-board', `.intro-board { background:#A9784A; color:#2B1D12; }
    .intro-board .ix-card { background:rgba(250,244,230,.92); padding:12px 16px 10px; box-shadow:0 6px 16px rgba(60,35,15,.25); width:auto; max-width:min(92vw,380px); transform:translateX(-50%) rotate(-1deg); }
    .intro-board .ix-title { font-size:26px; } .intro-board .ix-hint { font-size:14px; }
    .ix-bd-item { position:absolute; z-index:2; box-shadow:0 6px 12px rgba(50,30,10,.3); pointer-events:none; }
    .ix-bd-pin { position:absolute; z-index:5; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%; display:grid; place-items:center; touch-action:none; cursor:pointer; }
    .ix-bd-pin i { width:16px; height:16px; border-radius:50%; background:radial-gradient(circle at 35% 30%,#ff8a8a,#c0181f 60%,#7a0b10); box-shadow:0 3px 5px rgba(0,0,0,.4); }
    .ix-bd-pin b { position:absolute; top:-6px; right:-2px; width:20px; height:20px; border-radius:50%; background:#fff8e6; color:#9a1b22; font:700 12px Pretendard,sans-serif; display:grid; place-items:center; box-shadow:0 1px 3px rgba(0,0,0,.3); }
    .ix-bd-pin.next::after { content:''; position:absolute; inset:2px; border-radius:50%; border:3px solid #fff3c4; animation:ixpulse 1.1s ease-out infinite; }
    @keyframes ixpulse { from { transform:scale(.6); opacity:1; } to { transform:scale(1.5); opacity:0; } }
    .ix-bd-stamp { position:absolute; left:50%; top:52%; z-index:9; padding:8px 18px; border:4px solid #b3151d; color:#b3151d; font:700 30px "Courier Prime","Courier New",monospace; letter-spacing:.12em; transform:translate(-50%,-50%) rotate(-12deg) scale(2.5); opacity:0; background:rgba(255,250,240,.5); }`);
  const cork = K.layer(0), cg = cork.g;
  const drawCork = () => { cg.fillStyle = '#B07D4E'; cg.fillRect(0, 0, K.W, K.H); for (let i = 0; i < K.W * K.H / 25; i++) { const v = Math.random(); cg.fillStyle = v < .5 ? `rgba(90,55,25,${K.rand(.15, .4)})` : `rgba(230,190,140,${K.rand(.15, .35)})`; cg.fillRect(K.rand(0, K.W), K.rand(0, K.H), K.rand(1, 2.5), K.rand(1, 2.5)); }
    const vg = cg.createRadialGradient(K.W / 2, K.H / 2, K.H * .2, K.W / 2, K.H / 2, K.H * .8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(60,30,10,.35)'); cg.fillStyle = vg; cg.fillRect(0, 0, K.W, K.H); };
  drawCork(); K.onResize(drawCork);
  const P4 = [[.26, .36], [.74, .44], [.28, .66], [.72, .8]];
  const items = [
    `<div style="width:118px;padding:8px 8px 26px;background:#fbfaf5;transform:rotate(-5deg)"><div style="height:92px;background:linear-gradient(160deg,#7a8aa0,#3e4a5c);position:relative;overflow:hidden"><div style="position:absolute;left:50%;bottom:0;width:46px;height:62px;margin-left:-23px;background:#1f2633;border-radius:23px 23px 6px 6px"></div><div style="position:absolute;left:50%;bottom:52px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:#1f2633"></div></div><div style="font:12px 'Song Myung',serif;color:#333;text-align:center;margin-top:6px">${K.escI(K.caller)}?</div></div>`,
    `<div style="width:120px;min-height:100px;padding:10px;background:#F7E58A;transform:rotate(4deg);font:14px/1.5 'Song Myung',serif;color:#3a3220">그날 밤,<br>누가 마지막으로<br>기록실에 있었지?</div>`,
    `<div style="width:130px;padding:8px;background:#EDE6D3;transform:rotate(3deg);font:10px/1.4 'Gowun Batang',serif;color:#2b2b2b"><b style="font:700 12px Cinzel,serif;display:block;border-bottom:1px solid #555;margin-bottom:4px">DAILY ARCHIVE</b>미확인 기록 발견… 관계자는 "아직 끝나지 않았다"고 밝혔다.</div>`,
    `<div style="width:118px;height:96px;background:linear-gradient(135deg,#d9cba8,#cbb98f);transform:rotate(-4deg);position:relative"><svg viewBox="0 0 118 96" width="118" height="96"><path d="M8 70 Q30 40 52 52 T110 30" stroke="#7a5a35" fill="none" stroke-dasharray="3 3"/><circle cx="84" cy="40" r="7" fill="none" stroke="#b3151d" stroke-width="2"/><text x="72" y="64" font-size="9" fill="#5a4026" font-family="Courier Prime","Courier New">X — 19:46</text></svg></div>`];
  const pins = P4.map(([px, py], i) => { const it = K.el(`<div class="ix-bd-item">${items[i]}</div>`); const pin = K.el(`<div class="ix-bd-pin ${i === 0 ? 'next' : ''}" data-i="${i}"><i></i><b>${i + 1}</b></div>`);
    const place = () => { const x = px * K.W, y = py * K.H; pin.style.left = x + 'px'; pin.style.top = y + 'px'; it.style.left = (x - 62) + 'px'; it.style.top = (y - 8) + 'px'; }; place(); K.onResize(place); return pin; });
  const at = i => { const r = pins[i].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  let linked = 0, dragging = null, done = false;
  const L = K.layer(6);
  const draw = () => { const g = L.g; g.clearRect(0, 0, K.W, K.H); g.lineCap = 'round';
    const rope = (a, b, slack = 18) => { g.strokeStyle = '#B3151D'; g.lineWidth = 2.6; g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 3; g.shadowOffsetY = 2; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + slack, b[0], b[1]); g.stroke(); g.shadowBlur = 0; g.shadowOffsetY = 0; };
    for (let i = 0; i < linked; i++) rope(at(i), at(i + 1));
    if (!done && linked < 3) { const a = at(linked), b = at(linked + 1); g.setLineDash([6, 7]); g.strokeStyle = 'rgba(255,245,210,.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]); }
    if (dragging) rope(at(linked), dragging, 4); };
  K.loop(() => { draw(); });
  const hints = ['① 핀에서 ② 핀으로 손가락을 끌어 빨간 실을 이어 주세요', '좋아요! 이번엔 ② → ③', '마지막! ③ → ④'];
  const connect = () => { linked++; K.SFX.click(); pins.forEach((p, i) => p.classList.toggle('next', i === linked && linked < 3)); pins[linked].classList.add('next');
    if (linked >= 3) { done = true; pins.forEach(p => p.classList.remove('next')); K.hint('사건 파일이 열립니다');
      K.go(async () => { const st = K.el(`<div class="ix-bd-stamp">CASE OPEN</div>`, K.gw); st.animate([{ transform: 'translate(-50%,-50%) rotate(-12deg) scale(2.5)', opacity: 0 }, { transform: 'translate(-50%,-50%) rotate(-12deg) scale(1)', opacity: 1 }], { duration: 260, fill: 'forwards', easing: 'cubic-bezier(.5,0,.8,.3)' }); await K.wait(240); K.SFX.thump(); K.shake(4); await K.wait(1000); await K.split(); }); }
    else K.hint(hints[linked]); };
  pins.forEach((p, i) => K.drag(p, { start: () => { if (i !== linked || done) return; dragging = at(i); }, move: (x, y) => { if (dragging) dragging = [x, y]; },
    end: (x, y) => { if (!dragging) return; dragging = null; const [tx, ty] = at(linked + 1); if (Math.hypot(x - tx, y - ty) < 60) connect(); else K.hint('번호가 깜빡이는 다음 핀까지 끌어 주세요'); } }));
  pins.forEach((p, i) => p.addEventListener('click', () => { if (!done && i === linked + 1) connect(); }));   // 다음 핀을 눌러도 이어짐
} });

// 31. 지워진 기록 — 검게 덧칠된 문서를 문지르면 가려진 글자가 드러남
reg('redacted', { look: 'paper', card: false, mount(K) {
  K.css('ix-red', `.ix-doc { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(-.6deg); width:min(88vw,400px); padding:22px 22px 26px; background:#FBF7EE; box-shadow:0 12px 30px rgba(60,45,25,.22); font:15px/2 "Courier Prime","Courier New","Nanum Gothic Coding",monospace; color:#24211c; z-index:2; user-select:none; -webkit-user-select:none; }
    .ix-doc h3 { margin:0 0 4px; font:700 13px "Courier Prime","Courier New",monospace; letter-spacing:.3em; color:#a01d24; text-align:center; } .ix-doc .meta { font-size:12px; line-height:1.7; color:#55504a; border-bottom:1px solid #b9b2a4; padding-bottom:8px; margin-bottom:10px; }
    .ix-doc .rd { position:relative; } .ix-doc .hl { transition:background .6s; } .ix-doc .hl.on { background:rgba(255,226,120,.75); }
    .ix-doc .tip { margin-top:14px; font:14px "Gowun Batang",serif; color:#7a5a30; text-align:center; }
    .ix-doc .st { position:absolute; right:14px; bottom:18px; border:3px solid #2a7a3a; color:#2a7a3a; font:700 16px "Courier Prime","Courier New",monospace; padding:3px 8px; transform:rotate(-10deg) scale(2); opacity:0; }`);
  const nm = K.name() || '열람자', words = [...K.line];
  const cut = [Math.floor(words.length * .15), Math.floor(words.length * .55), words.length];
  const seg = (a, b) => words.slice(a, b).join('');
  const doc = K.el(`<div class="ix-doc"><h3>CLASSIFIED</h3><div class="meta">수신 : 기록보관소 열람자<br>발신 : ${K.escI(K.title)}<br>분류 : 1급 비밀 · 열람 제한</div>
    <div>해당 기록의 핵심 내용은 다음과 같다.</div><div class="hl">“${K.escI(seg(0, cut[0]))}<span class="rd">${K.escI(seg(cut[0], cut[1]))}</span>${K.escI(seg(cut[1], cut[1]))}<span class="rd">${K.escI(seg(cut[1], cut[2]))}</span>”</div>
    <div>담당자 : <span class="rd">${K.escI(K.caller)}</span></div><div class="tip">검은 줄을 손가락으로 문질러 지워 보세요</div><div class="st">DECLASSIFIED</div></div>`);
  const L = K.layer(4); let bars = [];
  const build = () => { bars = [...doc.querySelectorAll('.rd')].flatMap(s => [...s.getClientRects()].map(r => ({ x: r.left - 2, y: r.top + 3, w: r.width + 4, h: r.height - 6 })));
    const g = L.g; g.clearRect(0, 0, K.W, K.H); bars.forEach(b => { g.fillStyle = '#121212'; g.fillRect(b.x, b.y, b.w, b.h); g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < b.w; i += 3) g.fillRect(b.x + i, b.y + K.rand(0, b.h), 1.5, K.rand(1, 3)); }); };
  requestAnimationFrame(build); K.onResize(build);
  let done = false, last = 0;
  const rub = (x, y) => { const g = L.g; g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(0,0,0,${K.rand(.5, 1)})`; g.beginPath(); g.arc(x + K.rand(-12, 12), y + K.rand(-8, 8), K.rand(3, 9), 0, K.TAU); g.fill(); } g.globalCompositeOperation = 'source-over'; };
  const measure = () => { let tot = 0, clr = 0; bars.forEach(b => { const d = L.g.getImageData(b.x * K.DPR, b.y * K.DPR, Math.max(1, b.w * K.DPR), Math.max(1, b.h * K.DPR)).data; for (let i = 3; i < d.length; i += 16) { tot++; if (d[i] < 100) clr++; } }); return tot ? clr / tot : 0; };
  K.drag(K.gw, { start: rub, move: (x, y) => { rub(x, y); if (done) return; const now = performance.now(); if (now - last > 200) { last = now; if (Math.random() < .5) K.SFX.click(); if (measure() > .5) finish(); } } });
  const finish = () => { done = true; L.c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }); doc.querySelector('.hl').classList.add('on'); doc.querySelector('.tip').textContent = '기록이 복원되었습니다';
    K.go(async () => { await K.wait(700); const st = doc.querySelector('.st'); st.animate([{ transform: 'rotate(-10deg) scale(2)', opacity: 0 }, { transform: 'rotate(-10deg) scale(1)', opacity: 1 }], { duration: 240, fill: 'forwards' }); await K.wait(220); K.SFX.thump(); await K.wait(1200); await K.fade(700); }); };
} });

// 32. CCTV 화면 — 여러 화면 중 사람이 보이는 화면을 누르면 확대되며 입장 (움직임 표시로 쉽게)
reg('cctv', { look: 'dark', cardPos: 'top', input: false, hint: '사람이 보이는 화면(● MOTION)을 눌러 주세요', mount(K) {
  K.css('ix-cctv', `.ix-cg { position:absolute; left:50%; top:58%; transform:translate(-50%,-50%); display:grid; grid-template-columns:1fr 1fr; gap:8px; width:min(94vw,560px); z-index:2; }
    .ix-cg canvas { width:100%; aspect-ratio:4/3; display:block; background:#0b1420; border:2px solid #24344e; cursor:pointer; border-radius:4px; }
    .ix-cg .tgt { box-shadow:0 0 0 2px rgba(255,90,90,.0); animation:ixtgt 1.6s ease-in-out infinite; } @keyframes ixtgt { 50% { box-shadow:0 0 0 3px rgba(255,110,110,.55); } }
    .ix-cg .zoom { position:fixed; z-index:20; transition:all .7s cubic-bezier(.6,0,.2,1); }`);
  const grid = K.el(`<div class="ix-cg"></div>`), target = Math.random() * 4 | 0, tiles = [];
  for (let i = 0; i < 4; i++) { const c = document.createElement('canvas'); c.width = 240; c.height = 180; if (i === target) c.classList.add('tgt'); c.dataset.i = i; grid.appendChild(c); tiles.push({ c, g: c.getContext('2d'), bad: 0 }); }
  const t0 = performance.now(), ts = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${d.toTimeString().slice(0, 8)}`; };
  K.loop((dt, now) => { const tt = (now - t0) / 1000;
    tiles.forEach((T, i) => { const g = T.g, W = 240, H = 180; g.fillStyle = '#1c2a3a'; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(160,190,220,.35)'; g.lineWidth = 1.2; g.beginPath(); [[0, 0, 70, 50], [W, 0, 170, 50], [0, H, 70, 140], [W, H, 170, 140]].forEach(([a, b, c, d]) => { g.moveTo(a, b); g.lineTo(c, d); }); g.rect(70, 50, 100, 90); g.stroke();
      g.fillStyle = 'rgba(200,220,240,.08)'; g.fillRect(70 + (i * 23) % 60, 60, 30, 70);
      if (i === target) { const px = 90 + Math.sin(tt * .8) * 30; g.fillStyle = 'rgba(225,235,245,.9)'; g.beginPath(); g.arc(px, 82, 9, 0, K.TAU); g.fill(); g.beginPath(); g.roundRect ? g.roundRect(px - 11, 92, 22, 38, 7) : g.rect(px - 11, 92, 22, 38); g.fill(); g.fillRect(px - 9, 128, 7, 14); g.fillRect(px + 2, 128, 7, 14);
        g.fillStyle = Math.sin(tt * 6) > 0 ? '#ff5a5a' : 'rgba(255,90,90,.3)'; g.font = 'bold 12px monospace'; g.fillText('● MOTION', W - 84, H - 10); }
      const n = g.getImageData(0, 0, W, H), d = n.data, amt = T.bad > 0 ? 160 : 26; for (let k = 0; k < d.length; k += 4) { const v = (Math.random() - .5) * amt; d[k] += v; d[k + 1] += v; d[k + 2] += v; } g.putImageData(n, 0, 0);
      g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = (tt * 40 | 0) % 3; y < H; y += 3) g.fillRect(0, y, W, 1);
      g.fillStyle = '#fff'; g.font = 'bold 11px monospace'; g.fillText(`CAM 0${i + 1}`, 8, 16); g.fillText(ts(), 8, H - 10); g.fillStyle = '#ff3b3b'; if (Math.sin(tt * 4) > 0) { g.beginPath(); g.arc(W - 14, 12, 4, 0, K.TAU); g.fill(); }
      if (T.bad > 0) { T.bad -= dt; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(0, H / 2 - 16, W, 32); g.fillStyle = '#fff'; g.font = 'bold 16px monospace'; g.textAlign = 'center'; g.fillText('NO SIGNAL', W / 2, H / 2 + 6); g.textAlign = 'left'; } }); });
  let done = false;
  grid.addEventListener('click', e => { const c = e.target.closest('canvas'); if (!c || done) return; K.prime(); const i = +c.dataset.i;
    if (i !== target) { tiles[i].bad = .8; K.SFX.hiss(.4); K.hint('그 화면엔 아무도 없어요. 빨갛게 깜빡이는 화면을 찾아보세요'); return; }
    done = true; K.SFX.beep(); K.hint('');
    K.go(async () => { const r = c.getBoundingClientRect(); const ph = document.createElement('div'); ph.style.aspectRatio = '4/3'; c.replaceWith(ph); K.gw.appendChild(c); c.classList.add('zoom'); Object.assign(c.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px' }); c.getBoundingClientRect();
      Object.assign(c.style, { left: '0px', top: ((K.H - K.W * .75) / 2) + 'px', width: K.W + 'px' }); tiles[i].bad = .25; await K.wait(800); K.flash('#fff', 260, .8); await K.fade(500); }); });
} });

// 33. 녹음테이프 — 원을 그리듯 돌려 테이프를 감으면 재생되며 짧은 녹음 문장이 나옴
reg('cassette', { look: 'paper', cardPos: 'top', input: false, hint: '카세트 둘레를 원을 그리듯 돌려 테이프를 감아 주세요 · 0%', mount(K) {
  K.css('ix-cas', `.ix-cas { position:absolute; left:50%; top:56%; transform:translate(-50%,-50%); width:min(86vw,360px); z-index:2; filter:drop-shadow(0 12px 18px rgba(40,30,20,.3)); }
    .ix-cas .reel { transform-box:fill-box; transform-origin:center; } .ix-cap2 { position:absolute; left:50%; top:calc(56% + min(30vw,130px)); transform:translateX(-50%); width:min(86vw,360px); text-align:center; font:17px/1.7 "Gowun Batang",serif; color:var(--ink); z-index:3; min-height:3.4em; }
    .ix-cas-arrow { position:absolute; left:50%; top:56%; width:min(96vw,420px); aspect-ratio:1; transform:translate(-50%,-50%); border:2px dashed rgb(var(--accent-400) / .6); border-radius:50%; z-index:1; animation:ixspin 8s linear infinite; pointer-events:none; } @keyframes ixspin { to { transform:translate(-50%,-50%) rotate(360deg); } }`);
  K.el(`<div class="ix-cas-arrow"></div>`);
  const cas = K.el(`<svg class="ix-cas" viewBox="0 0 360 230"><defs><linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d44"/><stop offset="1" stop-color="#25272c"/></linearGradient></defs>
    <rect x="4" y="4" width="352" height="222" rx="14" fill="url(#cb)"/><rect x="22" y="18" width="316" height="120" rx="6" fill="#F3EAD3"/>
    <rect x="22" y="18" width="316" height="22" rx="6" fill="rgb(var(--accent-600))"/><text x="34" y="34" font-family="Cinzel,serif" font-size="12" font-weight="700" fill="#fff" letter-spacing="2">SIDE A</text>
    ${[58, 76, 94].map(y => `<line x1="34" y1="${y}" x2="326" y2="${y}" stroke="#c8bd9f"/>`).join('')}<text x="180" y="70" text-anchor="middle" font-family="Song Myung,serif" font-size="20" fill="#3a3226">${K.escI(K.title)}</text>
    <rect x="96" y="96" width="168" height="54" rx="27" fill="#1b1c20" stroke="#55585f"/><rect x="128" y="104" width="104" height="38" fill="#4a3a2c" opacity=".7"/>
    ${[124, 236].map(x => `<g class="reel" data-x="${x}"><circle cx="${x}" cy="123" r="22" fill="#e9e5dc"/><circle cx="${x}" cy="123" r="8" fill="#1b1c20"/>${[0, 60, 120, 180, 240, 300].map(a => `<rect x="${x - 2}" y="${123 - 8}" width="4" height="6" fill="#e9e5dc" transform="rotate(${a} ${x} 123)"/>`).join('')}</g>`).join('')}
    <path d="M40 226 L70 176 L290 176 L320 226 Z" fill="#2e3036"/>${[110, 150, 210, 250].map(x => `<circle cx="${x}" cy="200" r="6" fill="#16171a"/>`).join('')}</svg>`);
  const cap = K.el(`<div class="ix-cap2"></div>`, K.gw), reels = [...cas.querySelectorAll('.reel')];
  let wound = 0, rot = 0, done = false; const NEED = Math.PI * 4;
  const setRot = a => reels.forEach((r, i) => r.style.transform = `rotate(${a * (i ? 1.15 : 1)}rad)`);
  const center = () => { const r = cas.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  K.circular(K.gw, () => center()[0], () => center()[1], d => { if (done) return; wound += Math.abs(d); rot += d; setRot(rot); if (Math.random() < .2) K.SFX.click(); const pct = Math.min(100, wound / NEED * 100 | 0); K.hint(`카세트 둘레를 원을 그리듯 돌려 테이프를 감아 주세요 · ${pct}%`); if (wound >= NEED) play(); });
  const play = () => { done = true; K.gw.querySelector('.ix-cas-arrow').remove(); K.hint('▶ PLAY'); K.SFX.clack();
    K.go(async () => { K.SFX.tape(); const t0 = performance.now(); const stop = K.loop(() => { setRot(rot + (performance.now() - t0) / 300); });
      cap.textContent = '▶ '; for (const ch of K.line) { cap.textContent += ch; await K.wait(70); } await K.wait(1300); stop(); K.SFX.clack(); K.hideCard(100); await K.fade(700); }); };
} });

// 34. 암호 해독 — 뒤섞인 글자들이 누를 때마다 하나씩 제자리를 찾아 제목이 완성
reg('cipher', { look: 'dark', cardPos: 'top', title: false, input: false, hint: '화면을 누를 때마다 글자가 하나씩 해독돼요', mount(K) {
  K.css('ix-ci', `.ix-ci { position:absolute; left:50%; top:52%; transform:translate(-50%,-50%); display:flex; flex-wrap:wrap; justify-content:center; gap:6px; width:min(94vw,560px); z-index:2; }
    .ix-ci span { min-width:clamp(30px,10vw,48px); height:clamp(46px,14vw,66px); display:grid; place-items:center; border-radius:6px; background:#162238; border:1px solid #2E4468; font:700 clamp(22px,7vw,34px) "Courier Prime","Courier New","Song Myung",monospace; color:#7FB8FF; text-shadow:0 0 8px rgba(127,184,255,.6); transition:background .3s, color .3s; }
    .ix-ci span.ok { background:#1E3B2E; border-color:#3A8A5A; color:#9CF3C0; text-shadow:0 0 10px rgba(124,240,180,.7); } .ix-ci span.sp { background:none; border:0; min-width:14px; }
    .ix-ci-bar { position:absolute; left:50%; top:calc(52% + 70px); transform:translateX(-50%); width:min(70vw,300px); height:4px; background:#1b2a44; border-radius:2px; overflow:hidden; z-index:2; } .ix-ci-bar i { display:block; height:100%; width:0; background:#7CF0B4; transition:width .3s; }`);
  const target = [...(P.introCipher || (K.title + ' ARCHIVE'))], POOL = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?';
  const box = K.el(`<div class="ix-ci">${target.map(c => `<span class="${c === ' ' ? 'sp' : ''}">${c === ' ' ? '' : '?'}</span>`).join('')}</div>`), bar = K.el(`<div class="ix-ci-bar"><i></i></div>`).firstChild;
  const cells = [...box.children], todo = cells.map((c, i) => i).filter(i => target[i] !== ' ').sort(() => Math.random() - .5); let solved = 0, done = false;
  K.loop(() => { cells.forEach((c, i) => { if (target[i] !== ' ' && !c.classList.contains('ok') && Math.random() < .35) c.textContent = POOL[Math.random() * POOL.length | 0]; }); });
  K.onTap(() => { if (done) return; const per = Math.max(1, Math.ceil(todo.length / 7));
    for (let k = 0; k < per && solved < todo.length; k++) { const i = todo[solved++], c = cells[i]; c.classList.add('ok'); c.textContent = target[i]; c.animate([{ transform: 'rotateX(90deg)' }, { transform: 'none' }], { duration: 300 }); }
    K.SFX.key(); bar.style.width = (solved / todo.length * 100) + '%';
    if (solved >= todo.length) { done = true; K.SFX.chime([659, 880, 1175, 1568], .09); K.hint('해독 완료'); K.go(async () => { await K.wait(1200); K.flash('#9CF3C0', 400, .5); await K.fade(700); }); } });
} });

// 35. 증거물 봉투 — 봉인 테이프를 옆으로 쭉 뜯으면 봉투가 열리고 서류가 나옴
reg('evidence', { look: 'paper', card: false, mount(K) {
  K.css('ix-ev', `.ix-ev { position:absolute; left:50%; top:52%; transform:translate(-50%,-50%); width:min(86vw,360px); aspect-ratio:3/4; z-index:2; }
    .ix-ev .bag { position:absolute; inset:0; border-radius:6px; background:linear-gradient(120deg,rgba(255,255,255,.75),rgba(235,240,245,.55) 40%,rgba(255,255,255,.8) 60%,rgba(225,232,240,.6)); border:1px solid rgba(150,160,175,.6); box-shadow:0 14px 30px rgba(40,50,70,.18); backdrop-filter:blur(1.5px); }
    .ix-ev .paper { position:absolute; left:12%; right:12%; top:30%; bottom:6%; background:#F7F1E2; box-shadow:0 2px 6px rgba(0,0,0,.12); padding:12px; font:12px/1.7 "Courier Prime","Courier New",monospace; color:#333; transition:transform 1s cubic-bezier(.5,0,.3,1); }
    .ix-ev .form { position:absolute; left:6%; right:6%; top:9%; height:19%; border:2px solid #b3151d; background:rgba(255,255,255,.8); font:10px/1.5 "Courier Prime","Courier New",monospace; color:#b3151d; padding:4px 6px; }
    .ix-ev .form b { display:block; font:700 15px "Courier Prime","Courier New",monospace; letter-spacing:.3em; text-align:center; border-bottom:1px solid #b3151d; margin-bottom:2px; }
    .ix-ev .tape { position:absolute; left:-4%; right:-4%; top:2.5%; height:22px; background:repeating-linear-gradient(90deg,#c8161f 0 120px,#a81118 120px 122px); color:#fff; font:700 11px "Courier Prime","Courier New",monospace; letter-spacing:.2em; white-space:nowrap; overflow:hidden; line-height:22px; touch-action:none; cursor:grab; box-shadow:0 2px 4px rgba(0,0,0,.2); z-index:3; }
    .ix-ev .torn { position:absolute; top:2.5%; height:22px; left:-4%; background:#c8161f; transform-origin:right center; z-index:4; opacity:.95; }
    .ix-ev-tip { position:absolute; left:50%; top:calc(52% - min(58vw,240px) - 34px); transform:translateX(-50%); font:15px "Gowun Batang",serif; color:var(--ink); width:90vw; text-align:center; z-index:3; }`);
  const d = new Date(), nm = K.name() || '열람자';
  const ev = K.el(`<div class="ix-ev"><div class="paper"><b style="font-size:13px">기록 원본</b><br>${K.escI(K.title)}<br>${K.escI(K.line)}<br><br>— 열람 승인 —</div><div class="bag"></div>
    <div class="form"><b>EVIDENCE</b>CASE No. ${String(Math.random() * 9000 + 1000 | 0)} · DATE ${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}<br>ITEM : ${K.escI(K.title)} 기록 원본<br>SEALED BY : ARCHIVE</div>
    <div class="tape">${'EVIDENCE · DO NOT TAMPER · '.repeat(6)}</div></div>`);
  const tip = K.el(`<div class="ix-ev-tip">빨간 봉인 테이프를 왼쪽에서 오른쪽으로 쭉 뜯어 주세요 →</div>`), tape = ev.querySelector('.tape');
  let done = false, k = 0;
  K.drag(tape, { start: () => { if (!done) K.SFX.rip(.4); }, move: (x, y, dx) => { if (done) return; k = K.clamp(dx / (tape.clientWidth * .85), 0, 1); tape.style.clipPath = `polygon(${k * 100}% 0, 100% 0, 100% 100%, ${k * 100}% 100%, ${k * 100 - 1.5}% 70%, ${k * 100 + 1}% 40%, ${k * 100 - 1}% 15%)`;
      if (Math.random() < .25) K.SFX.rip(.15); if (k > .85) open(); }, end: () => { if (!done && k < .85) { tape.style.transition = 'clip-path .3s'; tape.style.clipPath = ''; setTimeout(() => tape.style.transition = '', 300); } } });
  const open = () => { done = true; tape.style.clipPath = 'inset(0 0 0 100%)'; tip.textContent = '봉투가 열렸어요'; K.SFX.rip(.4);
    K.go(async () => { await K.wait(300); const p = ev.querySelector('.paper'); p.style.zIndex = 5; p.style.transform = 'translateY(-75%) rotate(-2deg)'; K.SFX.page(); await K.wait(1300); tip.remove(); await K.slideUp(800); }); };
} });

// 36. 유리 깨기 — 터치할 때마다 금이 가고, 세 번째에 산산조각 나며 떨어짐
reg('glass', { look: 'clear', hint: '유리를 세 번 두드려 보세요 · 0/3', mount(K) {
  K.peek();
  const L = K.layer(1); let tex, cracks = [], hits = 0, shards = null, center = null;
  const make = () => { tex = document.createElement('canvas'); tex.width = K.W * K.DPR; tex.height = K.H * K.DPR; const t = tex.getContext('2d'); t.scale(K.DPR, K.DPR);
    const gr = t.createLinearGradient(0, 0, K.W, K.H); gr.addColorStop(0, K.rgbVar('--stone-100', .985)); gr.addColorStop(1, K.rgbVar('--stone-200', .985)); t.fillStyle = gr; t.fillRect(0, 0, K.W, K.H);
    t.fillStyle = 'rgba(255,255,255,.35)'; t.beginPath(); t.moveTo(K.W * .1, 0); t.lineTo(K.W * .35, 0); t.lineTo(K.W * .05, K.H); t.lineTo(-K.W * .2, K.H); t.fill(); t.fillStyle = 'rgba(255,255,255,.18)'; t.beginPath(); t.moveTo(K.W * .5, 0); t.lineTo(K.W * .58, 0); t.lineTo(K.W * .3, K.H); t.lineTo(K.W * .22, K.H); t.fill(); };
  make(); K.onResize(make);
  const drawCracks = g => { g.strokeStyle = 'rgba(60,85,110,.75)'; g.lineWidth = 1.4; cracks.forEach(c => { g.beginPath(); c.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }); g.strokeStyle = 'rgba(255,255,255,.95)'; g.lineWidth = .8; cracks.forEach(c => { g.beginPath(); c.forEach(([x, y], i) => i ? g.lineTo(x - .9, y - .9) : g.moveTo(x - .9, y - .9)); g.stroke(); }); };
  const crack = (x, y, n, len) => { for (let i = 0; i < n; i++) { let a = K.rand(0, K.TAU), px = x, py = y; const pts = [[x, y]]; let l = 0; const L2 = len * K.rand(.5, 1.2); while (l < L2) { const st = K.rand(8, 22); a += K.rand(-.35, .35); px += Math.cos(a) * st; py += Math.sin(a) * st; l += st; pts.push([px, py]); } cracks.push(pts); }
    for (let r = 14; r < len * .7; r += K.rand(18, 34)) { const pts = []; for (let a = 0; a <= K.TAU + .01; a += K.rand(.25, .6)) pts.push([x + Math.cos(a) * r * K.rand(.85, 1.15), y + Math.sin(a) * r * K.rand(.85, 1.15)]); cracks.push(pts); } };
  const paint = () => { const g = L.g; g.clearRect(0, 0, K.W, K.H); if (!shards) { g.drawImage(tex, 0, 0, K.W, K.H); drawCracks(g); return; }
    shards.forEach(s => { g.save(); g.translate(s.cx + s.x, s.cy + s.y); g.rotate(s.r); g.translate(-s.cx, -s.cy); g.beginPath(); s.p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip(); g.drawImage(tex, 0, 0, K.W, K.H); drawCracks(g); g.restore();
      g.save(); g.translate(s.cx + s.x, s.cy + s.y); g.rotate(s.r); g.translate(-s.cx, -s.cy); g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 1; g.beginPath(); s.p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke(); g.restore(); }); };
  paint();
  K.onTap((x, y) => { if (hits >= 3) return; hits++; center = center || [x, y]; K.hint(`유리를 세 번 두드려 보세요 · ${hits}/3`);
    if (hits < 3) { crack(x, y, hits === 1 ? 7 : 14, hits === 1 ? 90 : 220); K.SFX.glass(hits === 1 ? 0 : 1); K.shake(hits * 2, 160); paint(); return; }
    K.SFX.glass(2); K.shake(9, 300); K.hideCard(150);
    const N = 16, rings = [0, 50, 120, 220, 360, 560, 900, 1400], pt = {}; const ang = Array.from({ length: N }, (_, i) => i / N * K.TAU + K.rand(-.12, .12));
    const P = (i, j) => { const k = i % N + ',' + j; if (!pt[k]) { const r = rings[j] * (j ? K.rand(.85, 1.15) : 0); pt[k] = [x + Math.cos(ang[i % N]) * r, y + Math.sin(ang[i % N]) * r]; } return pt[k]; };
    shards = []; for (let i = 0; i < N; i++) for (let j = 0; j < rings.length - 1; j++) { const p = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], cx = (p[0][0] + p[1][0] + p[2][0] + p[3][0]) / 4, cy = (p[0][1] + p[1][1] + p[2][1] + p[3][1]) / 4;
      if (cx < -300 || cy < -300 || cx > K.W + 300 || cy > K.H + 300) continue; const dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy) + 1; shards.push({ p, cx, cy, x: 0, y: 0, r: 0, vx: dx / d * K.rand(40, 160), vy: dy / d * K.rand(20, 120) - 60, vr: K.rand(-3, 3), delay: d / 1400 }); }
    K.go(() => new Promise(res => { let t = 0; K.loop(dt => { t += dt; let alive = 0; shards.forEach(s => { if (t < s.delay) { alive++; return; } s.vy += 1500 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.r += s.vr * dt; if (s.cy + s.y < K.H + 400) alive++; }); paint(); if (!alive) { res(); return false; } }); }));
  });
} });

// ================= 묶음 5 · 놀이·장치 =================

// 37. 도미노 — 첫 도미노를 톡 밀면 줄줄이 쓰러지며 마지막에 종이 울림
reg('domino', { look: 'paper', cardPos: 'top', input: false, hint: '맨 앞의 빨간 도미노를 톡 밀어 주세요', mount(K) {
  const L = K.layer(2); let doms = [], bell = null, started = 0, done = false;
  const build = () => { doms = []; const rows = 3, top = K.H * .44, gap = Math.min(110, K.H * .14), dw = 9, dh = 44, sp = 22, x0 = K.W * .12, x1 = K.W * .88;
    for (let r = 0; r < rows; r++) { const y = top + r * gap, n = Math.floor((x1 - x0) / sp), dir = r % 2 ? -1 : 1;
      for (let i = 0; i <= n; i++) doms.push({ x: dir > 0 ? x0 + i * sp : x1 - i * sp, y, dir, a: 0, dw, dh, row: r }); }
    bell = { x: doms[doms.length - 1].x - 30, y: doms[doms.length - 1].y }; };
  build(); K.onResize(build);
  const ac = K.rgbVar('--accent-500'), ink = K.rgbVar('--stone-600');
  const draw = (now) => { const g = L.g; g.clearRect(0, 0, K.W, K.H);
    for (let r = 0; r < 2; r++) { const a = doms.filter(d => d.row === r).pop(), b = doms.find(d => d.row === r + 1); g.strokeStyle = 'rgba(120,100,70,.25)'; g.setLineDash([4, 5]); g.beginPath(); g.moveTo(a.x, a.y + 2); g.quadraticCurveTo(a.x + a.dir * 40, (a.y + b.y) / 2, b.x, b.y + 2); g.stroke(); g.setLineDash([]); }
    doms.forEach((d, i) => { g.fillStyle = 'rgba(80,60,40,.12)'; g.fillRect(d.x - 8, d.y, 24, 3); g.save(); g.translate(d.x + (d.dir > 0 ? d.dw : 0), d.y); g.rotate(d.a * d.dir); g.fillStyle = i === 0 ? '#D9474F' : '#FFFDF7'; g.strokeStyle = ink; g.lineWidth = 1.2;
      const x = d.dir > 0 ? -d.dw : 0; g.fillRect(x, -d.dh, d.dw, d.dh); g.strokeRect(x, -d.dh, d.dw, d.dh); g.fillStyle = i === 0 ? '#fff' : ink; g.beginPath(); g.arc(x + d.dw / 2, -d.dh * .72, 1.6, 0, K.TAU); g.arc(x + d.dw / 2, -d.dh * .3, 1.6, 0, K.TAU); g.fill(); g.restore(); });
    const sw = bell.ring ? Math.sin((now - bell.ring) / 60) * Math.max(0, 1 - (now - bell.ring) / 1200) * .5 : 0;
    g.save(); g.translate(bell.x, bell.y - 60); g.rotate(sw); g.fillStyle = ac; g.beginPath(); g.moveTo(-16, 22); g.quadraticCurveTo(-16, -6, 0, -8); g.quadraticCurveTo(16, -6, 16, 22); g.closePath(); g.fill(); g.fillStyle = 'rgba(255,255,255,.4)'; g.fillRect(-10, 0, 4, 16); g.beginPath(); g.arc(0, 25, 4, 0, K.TAU); g.fillStyle = ink; g.fill(); g.restore();
    g.strokeStyle = ink; g.beginPath(); g.moveTo(bell.x, bell.y - 68); g.lineTo(bell.x, bell.y - 80); g.moveTo(bell.x - 18, bell.y - 80); g.lineTo(bell.x + 18, bell.y - 80); g.moveTo(bell.x + 18, bell.y - 80); g.lineTo(bell.x + 18, bell.y); g.stroke(); };
  K.loop((dt, now) => { if (started) { const t = now - started; doms.forEach((d, i) => { const k = K.clamp((t - i * 55) / 180, 0, 1); const na = k * 1.15; if (na > 0 && d.a === 0) K.SFX.click(); d.a = na; });
      if (!done && t > doms.length * 55 + 200) { done = true; bell.ring = now; K.SFX.ding(); K.hint(''); K.go(async () => { await K.wait(1300); await K.fade(700); }); } } draw(now); });
  K.onTap((x, y) => { if (started) return; const d = doms[0]; if (Math.hypot(x - d.x, y - (d.y - 22)) < 70 || true) { started = performance.now(); K.hint('톡, 톡, 톡…'); } });
} });

// 38. 종이비행기 — 종이비행기를 위로 휙 밀어 날리면 하늘로 날아가며 입장
reg('plane', { look: 'clear', cardPos: 'top', input: false, hint: '종이비행기를 위쪽으로 휙 밀어 날려 보세요', mount(K) {
  K.css('ix-pl', `.intro-plane { background:linear-gradient(180deg,#CFE6FA 0%,#EAF4FC 60%,#F8FBFE 100%); } .ix-pl { position:absolute; width:120px; z-index:5; touch-action:none; cursor:grab; filter:drop-shadow(0 10px 8px rgba(40,70,110,.18)); }`);
  K.gw.classList.add('intro-plane');
  const sky = K.layer(0); const clouds = Array.from({ length: 6 }, () => ({ x: K.rand(0, 1), y: K.rand(.05, .9), s: K.rand(.6, 1.4), v: K.rand(4, 10) }));
  const pl = K.el(`<svg class="ix-pl" viewBox="0 0 120 80"><path d="M4 44 L116 8 L50 58 Z" fill="#FFFFFF" stroke="#7d93ad" stroke-width="1.2"/><path d="M50 58 L116 8 L60 76 Z" fill="#E6EEF7" stroke="#7d93ad" stroke-width="1.2"/><path d="M50 58 L56 66 L60 76" fill="none" stroke="#7d93ad"/></svg>`);
  let px = K.W / 2 - 60, py = K.H * .68, rot = -12, fly = null, trail = [];
  const place = () => { pl.style.left = px + 'px'; pl.style.top = py + 'px'; pl.style.transform = `rotate(${rot}deg)`; }; place();
  K.loop((dt) => { const g = sky.g; g.clearRect(0, 0, K.W, K.H); clouds.forEach(c => { c.x += c.v * dt / K.W; if (c.x > 1.2) c.x = -.2; const x = c.x * K.W, y = c.y * K.H, s = c.s * 30; g.fillStyle = 'rgba(255,255,255,.85)'; [[0, 0, 1], [-1, .3, .7], [1, .3, .75], [.4, -.4, .7]].forEach(([a, b, r]) => { g.beginPath(); g.arc(x + a * s, y + b * s, r * s, 0, K.TAU); g.fill(); }); });
    if (trail.length > 1) { g.strokeStyle = 'rgba(120,150,190,.5)'; g.setLineDash([3, 7]); g.lineWidth = 2; g.beginPath(); trail.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.setLineDash([]); }
    if (fly) { fly.t += dt; fly.vy -= 260 * dt; fly.vx += fly.ax * dt; px += fly.vx * dt; py += fly.vy * dt; rot = Math.atan2(fly.vy, fly.vx) * 180 / Math.PI + 18; trail.push([px + 60, py + 40]); place(); } });
  let sx = 0, sy = 0;
  K.drag(pl, { start: () => { if (fly) return; sx = px; sy = py; }, move: (x, y, dx, dy) => { if (fly) return; px = sx + dx * .5; py = sy + Math.max(-60, dy * .5); place(); },
    end: (x, y, dx, dy) => { if (fly) return; if (dy < -40) launch(dx, dy); else { px = sx; py = sy; place(); K.hint('조금 더 힘차게 위로 밀어 보세요'); } } });
  pl.addEventListener('click', () => { if (!fly) launch(30, -80); });
  const launch = (dx, dy) => { fly = { t: 0, vx: K.clamp(dx * 4, -200, 200) + 120, vy: K.clamp(dy * 5, -700, -350), ax: 60 }; K.SFX.whoosh(.9); K.hint(''); K.hideCard(500);
    K.go(async () => { await K.wait(1500); await K.fade(700); }); };
} });

// 39. 풍선 — 꾹 누르고 있으면 풍선이 부풀고, 한계에서 펑! 색종이가 터짐
reg('balloon', { look: 'paper', cardPos: 'top', input: false, hint: '풍선을 꾹 누르고 있으면 부풀어요', mount(K) {
  K.css('ix-bl', `.ix-bl { position:absolute; left:50%; top:62%; width:120px; z-index:3; transform-origin:50% 90%; touch-action:none; cursor:pointer; filter:drop-shadow(0 12px 14px rgba(0,0,0,.12)); }
    .ix-bl-meter { position:absolute; left:50%; bottom:9%; transform:translateX(-50%); width:min(60vw,240px); height:8px; border-radius:4px; background:rgb(var(--stone-200)); overflow:hidden; z-index:3; } .ix-bl-meter i { display:block; height:100%; width:0; background:rgb(var(--accent-500)); border-radius:4px; }`);
  const bl = K.el(`<svg class="ix-bl" viewBox="0 0 120 220"><defs><radialGradient id="blg" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".25" stop-color="rgb(var(--accent-300))"/><stop offset="1" stop-color="rgb(var(--accent-600))"/></radialGradient></defs>
    <path d="M60 140 C 64 160, 54 175, 62 195 S 56 215, 60 220" stroke="rgb(var(--stone-400))" fill="none" stroke-width="1.5"/><ellipse cx="60" cy="70" rx="52" ry="64" fill="url(#blg)"/><path d="M54 133 L66 133 L60 142 Z" fill="rgb(var(--accent-600))"/><ellipse cx="40" cy="42" rx="9" ry="16" fill="#fff" opacity=".45" transform="rotate(-25 40 42)"/></svg>`);
  const meter = K.el(`<div class="ix-bl-meter"><i></i></div>`).firstChild;
  let s = .55, hold = false, done = false, hiss = 0;
  const place = () => { bl.style.transform = `translate(-50%,-90%) scale(${s}) rotate(${Math.sin(performance.now() / 700) * 3}deg)`; }; place();
  K.drag(bl, { start: () => { hold = true; }, end: () => { hold = false; } });
  K.loop((dt) => { if (done) return; if (hold) { s += dt * .55; hiss -= dt; if (hiss <= 0) { K.SFX.hiss(.25); hiss = .3; } } else s = Math.max(.55, s - dt * .25);
    const k = K.clamp((s - .55) / (1.75 - .55), 0, 1); meter.style.width = k * 100 + '%'; if (k > .8) bl.style.filter = `drop-shadow(0 12px 14px rgba(0,0,0,.12)) brightness(${1 + Math.random() * .05})`;
    K.hint(k > .8 ? '조금만 더…!' : k > 0 ? '계속 누르고 있어요' : '풍선을 꾹 누르고 있으면 부풀어요'); place(); if (k >= 1) pop(); });
  const pop = () => { done = true; const r = bl.getBoundingClientRect(); bl.remove(); K.SFX.pop(); K.shake(6, 200); K.burst(r.left + r.width / 2, r.top + r.height * .35, { n: 140, speed: 700 }); K.hint('펑!');
    K.go(async () => { await K.wait(1400); await K.fade(700); }); };
} });

// 40. 스크래치 복권 — 은박을 긁으면 "당첨! ○○와의 대화권"
reg('scratch', { look: 'paper', cardPos: 'top', input: false, hint: '은색 부분을 손가락으로 긁어 보세요', mount(K) {
  K.css('ix-sc', `.ix-sc { position:absolute; left:50%; top:58%; transform:translate(-50%,-50%) rotate(-2deg); width:min(86vw,360px); aspect-ratio:16/10; z-index:2; border-radius:12px; padding:12px; box-sizing:border-box;
      background:linear-gradient(135deg,rgb(var(--accent-400)),rgb(var(--accent-600))); box-shadow:0 14px 28px rgba(0,0,0,.18); color:#fff; font-family:"Cinzel",serif; }
    .ix-sc .hd { display:flex; justify-content:space-between; font-size:12px; letter-spacing:.2em; font-weight:700; } .ix-sc .area { position:absolute; left:12px; right:12px; top:36px; bottom:30px; border-radius:8px; background:#FFFDF6; color:rgb(var(--accent-700)); display:grid; place-items:center; text-align:center; }
    .ix-sc .area b { display:block; font:700 clamp(26px,8vw,34px) "Song Myung",serif; color:#D9474F; } .ix-sc .area span { font:16px "Gowun Batang",serif; color:#3a3226; } .ix-sc .ft { position:absolute; left:14px; right:14px; bottom:8px; font:10px "Courier Prime","Courier New",monospace; display:flex; justify-content:space-between; opacity:.85; }`);
  const card = K.el(`<div class="ix-sc"><div class="hd"><span>LUCKY TICKET</span><span>No.${String(Math.random() * 1e6 | 0).padStart(6, '0')}</span></div><div class="area"><div><b>당첨!</b><span>${K.escI(K.title)}와의 대화권</span></div></div><div class="ft"><span>${K.escI(K.title)} ARCHIVE</span><span>1인 1매</span></div></div>`);
  const L = K.layer(4); let box = null, done = false, last = 0;
  const paint = () => { const r = card.querySelector('.area').getBoundingClientRect(); box = r; const g = L.g; g.clearRect(0, 0, K.W, K.H); g.save(); g.translate(r.left + r.width / 2, r.top + r.height / 2); g.rotate(-2 * Math.PI / 180); g.translate(-r.width / 2 - 2, -r.height / 2 - 2);
    const gr = g.createLinearGradient(0, 0, r.width, r.height); gr.addColorStop(0, '#C9CDD3'); gr.addColorStop(.5, '#EEF0F3'); gr.addColorStop(1, '#B6BBC3'); g.fillStyle = gr; g.fillRect(0, 0, r.width + 4, r.height + 4);
    for (let i = 0; i < 900; i++) { g.fillStyle = `rgba(${Math.random() < .5 ? '255,255,255' : '120,125,135'},.25)`; g.fillRect(Math.random() * r.width, Math.random() * r.height, 1.5, 1.5); }
    g.fillStyle = 'rgba(90,95,105,.55)'; g.font = '700 15px Cinzel,serif'; g.textAlign = 'center'; for (let y = 22; y < r.height; y += 28) for (let x = (y / 28 % 2) * 40 + 30; x < r.width; x += 80) g.fillText('★', x, y); g.font = '15px "Gowun Batang",serif'; g.fillStyle = 'rgba(70,75,85,.8)'; g.fillText('긁어 보세요', r.width / 2, r.height / 2 + 5); g.restore(); };
  requestAnimationFrame(paint);
  const rub = (x, y) => { const g = L.g; g.globalCompositeOperation = 'destination-out'; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, 15, 0, K.TAU); g.fill(); g.globalCompositeOperation = 'source-over'; };
  let px = null;
  K.drag(K.gw, { start: (x, y) => { px = [x, y]; rub(x, y); }, move: (x, y) => { const g = L.g; g.globalCompositeOperation = 'destination-out'; g.lineWidth = 30; g.lineCap = 'round'; g.beginPath(); g.moveTo(px[0], px[1]); g.lineTo(x, y); g.stroke(); g.globalCompositeOperation = 'source-over'; px = [x, y];
      if (done) return; const now = performance.now(); if (now - last > 180) { last = now; K.SFX.hiss(.12); const d = g.getImageData(box.left * K.DPR, box.top * K.DPR, box.width * K.DPR, box.height * K.DPR).data; let c = 0, t = 0; for (let i = 3; i < d.length; i += 64) { t++; if (d[i] < 60) c++; } if (c / t > .55) win(); } } });
  const win = () => { done = true; L.c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, fill: 'forwards' }); K.SFX.coin(); K.SFX.chime(); const r = card.getBoundingClientRect(); K.burst(r.left + r.width / 2, r.top + r.height / 2, { n: 90 }); K.hint('축하합니다! 지금 바로 사용할 수 있어요');
    K.go(async () => { await K.wait(1600); await K.fade(700); }); };
} });

// 41. 자물쇠 퍼즐 — 대표 이미지 4조각을 제자리에 맞추면 자물쇠가 풀림 (조각을 누르기만 해도 자리로 감)
reg('puzzle', { look: 'paper', cardPos: 'top', input: false, hint: '조각을 끌어 제자리에 맞춰 주세요 (눌러도 돼요)', mount(K) {
  let img = '';
  K.css('ix-pz', `.ix-pz { position:absolute; left:50%; top:47%; transform:translate(-50%,-50%); width:min(78vw,320px); aspect-ratio:4/3; z-index:2; border:3px solid rgb(var(--stone-400)); border-radius:6px; background:rgb(var(--stone-100)); box-shadow:inset 0 2px 8px rgba(0,0,0,.08); }
    .ix-pz .slot { position:absolute; width:50%; height:50%; border:1px dashed rgb(var(--stone-300)); box-sizing:border-box; }
    .ix-pz-p { position:absolute; z-index:4; transform-origin:0 0; touch-action:none; cursor:grab; background-repeat:no-repeat; box-shadow:0 6px 12px rgba(0,0,0,.2); border:2px solid #fff; box-sizing:border-box; transition:box-shadow .2s; }
    .ix-pz-p.ok { box-shadow:none; border-color:transparent; cursor:default; }
    .ix-pz-lock { position:absolute; left:50%; top:calc(47% - min(29vw,120px) - 26px); transform:translateX(-50%); z-index:5; width:44px; }`);
  const fb = `linear-gradient(135deg,rgb(var(--accent-300)),rgb(var(--accent-600)))`;
  const frame = K.el(`<div class="ix-pz">${[0, 1, 2, 3].map(i => `<div class="slot" style="left:${i % 2 * 50}%;top:${(i >> 1) * 50}%"></div>`).join('')}${img ? '' : `<div style="position:absolute;inset:0;display:grid;place-items:center;font:700 34px 'Song Myung',serif;color:rgb(var(--stone-300))">${K.escI(K.title)}</div>`}</div>`);
  const lock = K.el(`<svg class="ix-pz-lock" viewBox="0 0 44 54"><path id="shk" d="M12 24 V15 a10 10 0 0 1 20 0 V24" fill="none" stroke="rgb(var(--stone-600))" stroke-width="5"/><rect x="4" y="22" width="36" height="30" rx="5" fill="rgb(var(--accent-500))"/><circle cx="22" cy="35" r="4" fill="#fff"/><rect x="20.5" y="36" width="3" height="8" fill="#fff"/></svg>`);
  const pieces = [0, 1, 2, 3].map(i => K.el(`<div class="ix-pz-p" data-i="${i}"></div>`));
  let placed = 0, done = false; const home = [];
  const layout = () => { const r = frame.getBoundingClientRect(), w = r.width / 2, h = r.height / 2;
    pieces.forEach((p, i) => { Object.assign(p.style, { width: w + 'px', height: h + 'px', backgroundImage: img ? `url("${img}")` : fb, backgroundSize: `${w * 2}px ${h * 2}px`, backgroundPosition: `-${i % 2 * w}px -${(i >> 1) * h}px` });
      const tx = r.left + i % 2 * w, ty = r.top + (i >> 1) * h; p.dataset.tx = tx; p.dataset.ty = ty;
      if (p.classList.contains('ok')) { p.style.left = tx + 'px'; p.style.top = ty + 'px'; } else { const order = [2, 0, 3, 1][i], sw = w * .62, sh = h * .62; const hx = K.W / 2 + (order % 2 ? 8 : -sw - 8), hy = r.bottom + 20 + (order >> 1) * (sh + 12); home[i] = [K.clamp(hx, 4, K.W - sw - 4), Math.min(hy, K.H - sh - 10)]; p.dataset.rot = K.rand(-7, 7); p.style.left = home[i][0] + 'px'; p.style.top = home[i][1] + 'px'; p.style.transform = `scale(.62) rotate(${p.dataset.rot}deg)`; } }); };
  requestAnimationFrame(layout); K.onResize(layout);
  if (K.charImg) { const im = new Image(); im.onload = () => { img = K.charImg; frame.querySelectorAll('div:not(.slot)').forEach(d => d.style.opacity = '0'); layout(); }; im.src = K.charImg; }
  const snapTo = p => { p.classList.add('ok'); p.style.transition = 'left .25s, top .25s, transform .25s'; p.style.left = p.dataset.tx + 'px'; p.style.top = p.dataset.ty + 'px'; p.style.transform = 'none'; p.style.zIndex = 3; K.SFX.click(); placed++;
    if (placed === 4 && !done) { done = true; K.hint('찰칵! 자물쇠가 풀렸어요'); lock.querySelector('#shk').animate([{ transform: 'none' }, { transform: 'translateY(-8px)' }], { duration: 300, fill: 'forwards' }); K.SFX.ratchet(); K.SFX.chime();
      K.go(async () => { await K.wait(1300); await K.fade(700); }); } };
  pieces.forEach((p, i) => { let ox = 0, oy = 0, moved = false;
    K.drag(p, { start: (x, y) => { if (p.classList.contains('ok')) return; moved = false; p.style.transition = ''; p.style.zIndex = 6; ox = x - parseFloat(p.style.left); oy = y - parseFloat(p.style.top); },
      move: (x, y, dx, dy) => { if (p.classList.contains('ok')) return; if (Math.hypot(dx, dy) > 6) moved = true; p.style.left = (x - ox) + 'px'; p.style.top = (y - oy) + 'px'; p.style.transform = 'scale(1.04)'; },
      end: () => { if (p.classList.contains('ok')) return; const dx = parseFloat(p.style.left) - p.dataset.tx, dy = parseFloat(p.style.top) - p.dataset.ty;
        if (!moved || Math.hypot(dx, dy) < 50) snapTo(p); else { p.style.transition = 'left .3s, top .3s'; p.style.left = home[i][0] + 'px'; p.style.top = home[i][1] + 'px'; p.style.transform = `scale(.62) rotate(${p.dataset.rot}deg)`; p.style.zIndex = 4; K.hint('조금 더 가까이! 모양이 맞는 칸으로'); } } }); });
} });

// 42. 뽑기 기계 — 손잡이를 돌리면 캡슐이 굴러 나오고, 캡슐을 열면 입장권
reg('gacha', { look: 'paper', cardPos: 'top', input: false, hint: '손잡이를 빙글 돌려 주세요', mount(K) {
  K.css('ix-ga', `.ix-ga { position:absolute; left:50%; top:60%; transform:translate(-50%,-50%); width:min(66vw,260px); z-index:2; filter:drop-shadow(0 14px 18px rgba(0,0,0,.15)); }
    .ix-ga-knob { transform-box:fill-box; transform-origin:center; cursor:grab; }
    .ix-cap { position:absolute; z-index:6; width:64px; height:64px; cursor:pointer; } .ix-cap i { position:absolute; left:0; right:0; height:50%; border:2px solid rgba(0,0,0,.15); box-sizing:border-box; }
    .ix-cap .t { top:0; border-radius:32px 32px 0 0; background:linear-gradient(160deg,#fff 0%,#fff 30%,rgb(var(--accent-300)) 31%,rgb(var(--accent-500))); opacity:.95; } .ix-cap .b { bottom:0; border-radius:0 0 32px 32px; background:#FFFDF6; }
    .ix-ticket { position:absolute; left:50%; top:50%; z-index:7; width:min(80vw,320px); padding:16px 18px; transform:translate(-50%,-50%) scale(.2); opacity:0; background:#FFFDF6; border:2px dashed rgb(var(--accent-500)); border-radius:10px; text-align:center; color:var(--ink); box-shadow:0 18px 40px rgba(0,0,0,.2); }
    .ix-ticket small { font:700 11px Cinzel,serif; letter-spacing:.3em; color:rgb(var(--accent-600)); } .ix-ticket b { display:block; font:700 26px "Song Myung",serif; margin:6px 0; } .ix-ticket span { font:14px "Gowun Batang",serif; }`);
  const cols = ['#F6C453', '#F28CA6', '#8FD3F4', '#B9A4E6', '#9BE0B5', '#FFB38A'];
  const caps = Array.from({ length: 16 }, (_, i) => { const a = i * 2.3, r = 18 + (i * 37 % 46); return `<g transform="translate(${130 + Math.cos(a) * r} ${100 + Math.sin(a) * r * .8 + 12})"><circle r="15" fill="${cols[i % 6]}"/><path d="M-15 0 A15 15 0 0 0 15 0 Z" fill="#fff" opacity=".85"/><circle r="15" fill="none" stroke="rgba(0,0,0,.12)"/></g>`; }).join('');
  const m = K.el(`<svg class="ix-ga" viewBox="0 0 260 360"><rect x="50" y="170" width="160" height="170" rx="14" fill="rgb(var(--accent-500))"/><rect x="40" y="330" width="180" height="22" rx="8" fill="rgb(var(--accent-700))"/>
    <circle cx="130" cy="100" r="92" fill="rgba(235,245,255,.55)" stroke="rgba(160,180,200,.8)" stroke-width="3"/><g>${caps}</g><ellipse cx="96" cy="58" rx="22" ry="34" fill="#fff" opacity=".45" transform="rotate(30 96 58)"/>
    <rect x="60" y="182" width="140" height="26" rx="6" fill="#FFFDF6"/><text x="130" y="200" text-anchor="middle" font-family="Cinzel,serif" font-weight="700" font-size="13" fill="rgb(var(--accent-700))" letter-spacing="2">${K.escI(K.title)}</text>
    <circle cx="130" cy="252" r="34" fill="#FFFDF6"/><g class="ix-ga-knob"><circle cx="130" cy="252" r="28" fill="#fff" stroke="rgb(var(--stone-300))" stroke-width="2"/><rect x="122" y="226" width="16" height="52" rx="8" fill="rgb(var(--stone-500))"/></g>
    <rect x="98" y="296" width="64" height="30" rx="6" fill="rgb(var(--accent-800))"/><path d="M104 300 h52 v8 h-52z" fill="rgba(255,255,255,.15)"/></svg>`);
  const knob = m.querySelector('.ix-ga-knob'); let rot = 0, done = false; const NEED = Math.PI * 1.6;
  const kc = () => { const r = knob.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  K.circular(K.gw, () => kc()[0], () => kc()[1], d => { if (done) return; rot += Math.abs(d); knob.style.transform = `rotate(${rot}rad)`; if (Math.random() < .3) K.SFX.ratchet(); K.hint(`손잡이를 빙글 돌려 주세요 · ${Math.min(100, rot / NEED * 100 | 0)}%`); if (rot >= NEED) drop(); });
  knob.addEventListener('click', () => { if (done) return; rot += NEED / 3; knob.style.transform = `rotate(${rot}rad)`; K.SFX.ratchet(); if (rot >= NEED) drop(); });
  const drop = () => { done = true; K.hint(''); K.SFX.thump(); const r = m.getBoundingClientRect(), sc = r.width / 260;
    const cap = K.el(`<div class="ix-cap"><i class="t"></i><i class="b"></i></div>`), x0 = r.left + 130 * sc - 32, y0 = r.top + 296 * sc;
    cap.style.left = x0 + 'px'; cap.style.top = y0 + 'px'; cap.animate([{ transform: 'translateY(0) rotate(0)' }, { transform: `translateY(${Math.min(90, K.H - y0 - 80)}px) rotate(200deg)`, offset: .7 }, { transform: `translateY(${Math.min(90, K.H - y0 - 80) - 14}px) rotate(260deg)`, offset: .85 }, { transform: `translateY(${Math.min(90, K.H - y0 - 80)}px) rotate(300deg)` }], { duration: 900, fill: 'forwards', easing: 'ease-in' });
    setTimeout(() => { K.SFX.click(); K.hint('캡슐을 눌러 열어 보세요'); }, 900);
    const open = () => { cap.removeEventListener('pointerdown', open); const [t, b] = cap.children; K.SFX.pop(); t.animate([{ transform: 'none' }, { transform: 'translate(-30px,-40px) rotate(-40deg)', opacity: 0 }], { duration: 500, fill: 'forwards' }); b.animate([{ transform: 'none' }, { transform: 'translate(20px,30px) rotate(30deg)', opacity: 0 }], { duration: 500, fill: 'forwards' });
      const tk = K.el(`<div class="ix-ticket"><small>ADMIT ONE</small><b>${K.escI(K.title)}</b><span>기록보관소 입장권 · ${K.escI(K.name() || '오늘의 방문자')}</span></div>`, K.gw);
      tk.animate([{ transform: 'translate(-50%,-50%) scale(.2) rotate(-20deg)', opacity: 0 }, { transform: 'translate(-50%,-50%) scale(1) rotate(-3deg)', opacity: 1 }], { duration: 600, fill: 'forwards', easing: 'cubic-bezier(.3,1.4,.5,1)' }); K.SFX.chime(); K.hint('');
      K.go(async () => { await K.wait(1600); await K.fade(700); }); };
    cap.addEventListener('pointerdown', open); };
} });

// 43. 오르골 — 태엽을 감으면 뚜껑이 열리고 멜로디가 흐름 (작가 음원이 있으면 그걸 재생)
reg('musicbox', { look: 'paper', cardPos: 'top', input: false, noMusicPrime: true, hint: '태엽(오른쪽 열쇠) 주위를 빙글빙글 돌려 감아 주세요 · 0%', mount(K) {
  K.css('ix-mb', `.ix-mb { position:absolute; left:50%; top:60%; transform:translate(-50%,-50%); width:min(84vw,340px); z-index:2; filter:drop-shadow(0 16px 18px rgba(60,40,20,.2)); }
    .ix-mb .lid { transform-box:fill-box; transform-origin:0% 100%; transition:transform 1.2s cubic-bezier(.4,0,.2,1); } .ix-mb .wkey { transform-box:fill-box; transform-origin:0% 50%; }
    .ix-mb .cyl { animation:none; } .ix-note { position:absolute; z-index:4; font:22px serif; color:rgb(var(--accent-600)); pointer-events:none; }`);
  const box = K.el(`<svg class="ix-mb" viewBox="0 0 340 230"><defs><linearGradient id="wd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B57E4E"/><stop offset="1" stop-color="#8A5A33"/></linearGradient></defs>
    <rect x="30" y="110" width="260" height="110" rx="8" fill="url(#wd)"/><rect x="42" y="122" width="236" height="86" rx="4" fill="none" stroke="#E2B97A" stroke-width="1.5"/>
    <g opacity=".9"><rect x="60" y="100" width="200" height="14" rx="3" fill="#E8D9B8"/><rect x="80" y="86" width="120" height="16" rx="8" fill="#D4AF37" class="cyl"/>${Array.from({ length: 14 }, (_, i) => `<circle cx="${86 + i * 8}" cy="${90 + (i * 5 % 9)}" r="1.4" fill="#8a6d1f"/>`).join('')}${Array.from({ length: 12 }, (_, i) => `<rect x="${205 + i * 4}" y="88" width="2.5" height="14" fill="#B8BFC6"/>`).join('')}</g>
    <g class="wkey"><rect x="290" y="158" width="18" height="6" fill="#C9A227"/><path d="M306 146 a10 10 0 1 1 0 30 a10 10 0 1 1 0-30Z M318 146 a10 10 0 1 1 0 30" fill="#D4AF37" stroke="#9b7a14" stroke-width="1.5"/></g>
    <g class="lid"><rect x="30" y="58" width="260" height="54" rx="8" fill="url(#wd)"/><rect x="44" y="68" width="232" height="34" rx="4" fill="none" stroke="#E2B97A" stroke-width="1.5"/><text x="160" y="91" text-anchor="middle" font-family="Cinzel,serif" font-weight="700" font-size="15" fill="#F6E7C8" letter-spacing="3">${K.escI(K.title)}</text></g></svg>`);
  const wk = box.querySelector('.wkey'), lid = box.querySelector('.lid'); let wound = 0, done = false; const NEED = Math.PI * 5;
  const kc = () => { const r = wk.getBoundingClientRect(); return [r.left + r.width * .3, r.top + r.height / 2]; };
  K.circular(K.gw, () => kc()[0], () => kc()[1], d => { if (done) return; wound += Math.abs(d); wk.style.transform = `scaleY(${Math.cos(wound * 1.5)})`; if (Math.random() < .25) K.SFX.ratchet(); K.hint(`태엽(오른쪽 열쇠) 주위를 빙글빙글 돌려 감아 주세요 · ${Math.min(100, wound / NEED * 100 | 0)}%`); if (wound >= NEED) play(); });
  wk.addEventListener('click', () => { if (done) return; wound += NEED / 5; K.SFX.ratchet(); if (wound >= NEED) play(); });
  const notes = P.introMelody || [[76, 1], [79, 1], [84, 2], [83, 1], [79, 1], [76, 2], [74, 1], [76, 1], [77, 1], [79, 1], [76, 3]];
  const mf = n => 440 * Math.pow(2, (n - 69) / 12);
  const play = () => { done = true; lid.style.transform = 'rotate(-62deg)'; K.hint('♪'); let dur = 0;
    if (K.sound()) { if (P.introAudio) { try { const au = new Audio(P.introAudio); au.volume = .8; au.play().catch(() => {}); dur = Math.min(8, (P.introAudioSec || 5)); } catch {} }
      else { const beat = .32; let t = 0; notes.forEach(([n, l]) => { tone(mf(n), 1.6, { type: 'triangle', gain: .14, at: t + .3 }); tone(mf(n) * 2, .9, { gain: .05, at: t + .3 }); tone(mf(n) * 3.01, .4, { gain: .02, at: t + .3 }); t += l * beat; }); dur = t + 1; } } else dur = 2.5;
    let spin = 0; const r = box.getBoundingClientRect(); const st = K.loop(dt => { spin += dt; wk.style.transform = `scaleY(${Math.cos(wound - spin * 2)})`; if (Math.random() < dt * 3) { const n = K.el(`<div class="ix-note">${['♪', '♫', '♩'][Math.random() * 3 | 0]}</div>`, K.gw); n.style.left = (r.left + r.width * K.rand(.3, .7)) + 'px'; n.style.top = (r.top + r.height * .3) + 'px'; n.animate([{ transform: 'translate(0,0)', opacity: 0 }, { opacity: 1, offset: .2 }, { transform: `translate(${K.rand(-50, 50)}px,-160px)`, opacity: 0 }], { duration: 2400, fill: 'forwards' }); } });
    K.go(async () => { await K.wait(Math.max(2500, dur * 1000)); st(); await K.fade(900); }); };
} });

// 44. 불 켜기 — 어스름한 방, 천장의 줄을 아래로 당기면 딸깍 불이 켜짐 (완전 검정 아님)
reg('light', { look: 'clear', cardPos: 'bottom', input: false, hint: '전등 줄을 아래로 쭉 당겨 주세요', mount(K) {
  K.css('ix-lt', `.intro-light { background:#56607A; color:#EEF1F7; transition:background 1s; } .intro-light.on { background:#FFF7E4; color:var(--ink); }
    .intro-light .ix-card { background:transparent; } .ix.intro-light .ix-kicker, .ix.intro-light .ix-title, .ix.intro-light .ix-hint { color:#F3F5FA !important; -webkit-text-fill-color:currentColor; background-image:none; transition:color 1s; } .ix.intro-light.on .ix-kicker, .ix.intro-light.on .ix-title, .ix.intro-light.on .ix-hint { color:var(--ink) !important; }
    .ix-lt-lamp { position:absolute; left:50%; top:0; transform:translateX(-50%); z-index:3; width:160px; pointer-events:none; } .ix-lt-cord { position:absolute; z-index:4; width:44px; margin-left:-22px; touch-action:none; cursor:grab; }`);
  K.gw.classList.add('intro-light');
  const glow = K.layer(1);
  const lamp = K.el(`<svg class="ix-lt-lamp" viewBox="0 0 160 220"><line x1="80" y1="0" x2="80" y2="130" stroke="#3a3f4c" stroke-width="2"/><path d="M30 190 Q30 140 80 132 Q130 140 130 190 Z" fill="#E8DCC4"/><path d="M30 190 h100" stroke="#B9A985" stroke-width="3"/><ellipse class="bulb" cx="80" cy="196" rx="16" ry="12" fill="#9aa0ad"/></svg>`);
  const cord = K.el(`<svg class="ix-lt-cord" viewBox="0 0 44 300" preserveAspectRatio="xMidYMin meet"><line class="ln" x1="22" y1="0" x2="22" y2="200" stroke="#E6DCC8" stroke-width="2"/><g class="bob"><rect x="15" y="198" width="14" height="26" rx="7" fill="#F2C14E"/><circle cx="22" cy="232" r="14" fill="none" stroke="rgba(242,193,78,.6)" stroke-width="2"><animate attributeName="r" values="10;20" dur="1.2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0" dur="1.2s" repeatCount="indefinite"/></circle></g></svg>`);
  const place = () => { cord.style.left = (K.W / 2 + 70) + 'px'; cord.style.top = '150px'; }; place(); K.onResize(place);
  let pull = 0, done = false; const ln = cord.querySelector('.ln'), bob = cord.querySelector('.bob');
  const setPull = p => { pull = p; ln.setAttribute('y2', 200 + p); bob.setAttribute('transform', `translate(0 ${p})`); };
  K.drag(cord, { move: (x, y, dx, dy) => { if (done) return; setPull(K.clamp(dy, 0, 90)); if (pull > 70) on(); }, end: () => { if (!done) { cord.animate([{ transform: `translateY(0)` }], { duration: 1 }); setPull(0); K.hint('조금 더 아래로 당겨 주세요'); } } });
  cord.addEventListener('click', () => { if (!done) on(); });
  const on = () => { done = true; setPull(0); K.SFX.click(); setTimeout(() => K.SFX.clack(), 60); K.gw.classList.add('on'); lamp.querySelector('.bulb').setAttribute('fill', '#FFE89A'); K.hint('');
    const g = glow.g, gr = g.createRadialGradient(K.W / 2, 196, 10, K.W / 2, 196, K.H * .9); gr.addColorStop(0, 'rgba(255,226,140,.85)'); gr.addColorStop(.3, 'rgba(255,236,190,.35)'); gr.addColorStop(1, 'rgba(255,246,225,0)'); g.fillStyle = gr; g.fillRect(0, 0, K.W, K.H);
    glow.c.animate([{ opacity: 0 }, { opacity: 1, offset: .1 }, { opacity: .4, offset: .15 }, { opacity: 1 }], { duration: 600, fill: 'forwards' });
    K.go(async () => { await K.wait(1400); await K.fade(800); }); };
} });

// ================= 묶음 6 · 시각 연출 =================

// 45. 이름이 빛으로 — 적은 이름이 빛 알갱이로 흩어졌다가 작품 제목으로 다시 모임
reg('lightname', { look: 'dark', confirm: '빛으로 보내기', hint: '이름을 적고 버튼을 누르세요', mount(K) {
  const L = K.layer(3); let parts = [], phase = 0, t0 = 0;
  const sample = (text, size, cy) => { const c = document.createElement('canvas'), w = K.W, h = size * 1.6; c.width = w; c.height = h; const g = c.getContext('2d'); g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    let fs = size; g.font = `700 ${fs}px "Song Myung","Cinzel Decorative",serif`; while (g.measureText(text).width > w * .86 && fs > 16) { fs -= 2; g.font = `700 ${fs}px "Song Myung","Cinzel Decorative",serif`; } g.fillText(text, w / 2, h / 2);
    const d = g.getImageData(0, 0, w, h).data, pts = [], step = Math.max(2, Math.round(fs / 14)); for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (d[(y * w + x) * 4 + 3] > 128) pts.push([x, cy - h / 2 + y]); return pts; };
  const cols = ['#FFF6D6', '#FFE08A', '#BFE3FF', '#FFFFFF', '#FFD1E6'];
  K.loop((dt, now) => { const g = L.g; g.clearRect(0, 0, K.W, K.H); if (!phase) return; const t = (now - t0) / 1000; g.globalCompositeOperation = 'lighter';
    parts.forEach(p => { let x, y; if (t < 1.1) { const k = Math.min(1, t / 1.1), e = 1 - Math.pow(1 - k, 2); x = K.lerp(p.sx, p.mx, e); y = K.lerp(p.sy, p.my, e); }
      else { const k = K.clamp((t - 1.1 - p.dl) / 1.3, 0, 1), e = k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; x = K.lerp(p.mx, p.tx, e) + Math.sin(now / 300 + p.ph) * (1 - e) * 6; y = K.lerp(p.my, p.ty, e); }
      const tw = .6 + .4 * Math.sin(now / 160 + p.ph); g.fillStyle = p.c; g.globalAlpha = .25 * tw; g.beginPath(); g.arc(x, y, p.r * 3, 0, K.TAU); g.fill(); g.globalAlpha = tw; g.beginPath(); g.arc(x, y, p.r, 0, K.TAU); g.fill(); });
    g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; });
  const run = () => { if (phase) return; const nm = K.name(); if (!nm) { K.hint('먼저 이름을 적어 주세요'); document.getElementById('username').focus(); return; } K.prime();
    const inp = document.getElementById('username'), r = inp.getBoundingClientRect(); const src = sample(nm, 26, r.top + r.height / 2), dst = sample(K.title, Math.min(78, K.W * .2), K.H * .5);
    K.hideCard(250); const N = Math.max(src.length, dst.length, 260);
    parts = Array.from({ length: Math.min(N, 1400) }, (_, i) => { const s = src[i % src.length], d = dst[i % dst.length], a = K.rand(0, K.TAU), rr = K.rand(40, Math.min(K.W, K.H) * .45);
      return { sx: s[0], sy: s[1], mx: K.W / 2 + Math.cos(a) * rr, my: K.H * .5 + Math.sin(a) * rr, tx: d[0], ty: d[1], dl: K.rand(0, .35), ph: K.rand(0, 9), r: K.rand(.8, 1.8), c: cols[i % cols.length] }; });
    phase = 1; t0 = performance.now(); K.SFX.whoosh(1); setTimeout(() => K.SFX.chime([523, 659, 784, 1047, 1319], .12), 1300);
    K.go(async () => { await K.wait(3300); K.flash('#FFF6D6', 500, .7); await K.fade(800); }); };
  document.getElementById('ix-confirm').addEventListener('click', run); document.getElementById('username').addEventListener('keydown', e => { if (e.key === 'Enter') run(); });
} });

// 46. 커튼 걷기 — 벨벳 커튼을 양옆으로 밀어 젖히면 무대 위에 제목이 드러남
reg('curtain', { look: 'clear', card: false, mount(K) {
  K.css('ix-ct', `.intro-curtain { background:radial-gradient(ellipse at 50% 38%,#FFF8E6 0%,#F4E6C8 45%,#E2CFA8 100%); }
    .ix-ct-stage { position:absolute; left:50%; top:42%; transform:translate(-50%,-50%); text-align:center; z-index:1; color:var(--ink); }
    .ix-ct-stage p { font:700 11px Cinzel,serif; letter-spacing:.4em; color:rgb(var(--accent-600)); margin:0 0 8px; } .ix-ct-stage h1 { font:700 clamp(36px,11vw,56px) "Song Myung","Cinzel Decorative",serif; margin:0; }
    .ix-ct-floor { position:absolute; left:0; right:0; bottom:0; height:22%; background:linear-gradient(#B98A5A,#9A6E44); z-index:0; } .ix-ct-floor::before { content:''; position:absolute; inset:0; background:repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 2px,transparent 2px 60px); }
    .ix-ct-tip { position:absolute; left:50%; bottom:12%; transform:translateX(-50%); z-index:6; font:15px "Gowun Batang",serif; color:#FFF3DA; text-shadow:0 1px 3px rgba(0,0,0,.4); white-space:nowrap; pointer-events:none; }`);
  K.el(`<div class="ix-ct-floor"></div>`); K.el(`<div class="ix-ct-stage"><p>NOW SHOWING</p><h1>${K.escI(K.title)}</h1></div>`);
  const L = K.layer(4), tip = K.el(`<div class="ix-ct-tip">← 커튼 가운데를 잡고 양옆으로 밀어 주세요 →</div>`);
  let open = 0, target = 0, done = false; const base = K.rgbVar('--accent-700'), hi = K.rgbVar('--accent-500');
  const drawHalf = (g, x0, w, side, k) => { const folds = 9, bunch = 1 - k * .82, ww = w * bunch, xs = side < 0 ? x0 : x0 + w - ww;
    for (let i = 0; i < folds; i++) { const fx = xs + ww * i / folds, fw = ww / folds + 1, gr = g.createLinearGradient(fx, 0, fx + fw, 0); gr.addColorStop(0, base); gr.addColorStop(.45, hi); gr.addColorStop(1, base); g.fillStyle = gr;
      g.beginPath(); g.moveTo(fx, 0); g.lineTo(fx + fw, 0); const sway = side * k * 40 * (side < 0 ? (1 - i / folds) : i / folds); g.quadraticCurveTo(fx + fw + sway * .3, K.H * .6, fx + fw + sway, K.H); g.lineTo(fx + sway, K.H); g.quadraticCurveTo(fx + sway * .3, K.H * .6, fx, 0); g.fill(); }
    g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(xs, 0, ww, 6); };
  K.loop(dt => { open += (target - open) * Math.min(1, dt * 8); const g = L.g; g.clearRect(0, 0, K.W, K.H); drawHalf(g, 0, K.W / 2, -1, open); drawHalf(g, K.W / 2, K.W / 2, 1, open);
    const vg = g.createLinearGradient(0, 0, 0, 40); vg.addColorStop(0, 'rgba(120,20,30,.9)'); vg.addColorStop(1, 'rgba(120,20,30,0)'); g.fillStyle = base; g.fillRect(0, 0, K.W, 26); g.fillStyle = 'rgba(255,215,130,.8)'; for (let x = 6; x < K.W; x += 14) { g.beginPath(); g.arc(x, 28, 3, 0, K.TAU); g.fill(); } });
  K.drag(K.gw, { start: () => { if (!done) K.SFX.whoosh(.4); }, move: (x, y, dx) => { if (done) return; target = K.clamp(Math.abs(dx) / (K.W * .35), 0, 1); if (target > .7) finish(); }, end: (x, y, dx) => { if (done) return; if (Math.abs(dx) < 8) finish(); else if (target < .7) target = 0; } });
  const finish = () => { done = true; target = 1; tip.remove(); K.SFX.whoosh(1.2); setTimeout(() => K.SFX.chime([523, 659, 784]), 500); K.go(async () => { await K.wait(1600); await K.fade(800); }); };
} });

// 47. 물감 떨어뜨리기 — 톡 누르면 물감 방울이 떨어져 테마색으로 번지며 화면을 채움
reg('paint', { look: 'paper', hint: '화면 아무 곳이나 톡 눌러 물감을 떨어뜨려 보세요', mount(K) {
  const L = K.layer(4); let blobs = [], done = false, drops = 0;
  const cols = [K.rgbVar('--accent-300', .5), K.rgbVar('--accent-400', .45), K.rgbVar('--accent-500', .4), K.rgbVar('--accent-200', .55)];
  K.loop(dt => { const g = L.g; blobs.forEach(b => { if (b.r >= b.R) return; const grow = (b.R - b.r) * dt * b.sp; b.r += Math.max(.4, grow);
      for (let k = 0; k < 3; k++) { const a = K.rand(0, K.TAU), rr = b.r * K.rand(.7, 1.02), x = b.x + Math.cos(a) * rr * .9, y = b.y + Math.sin(a) * rr * .9; g.fillStyle = b.c; g.globalAlpha = .18; g.beginPath(); g.arc(x, y, K.rand(4, 10) + b.r * .08, 0, K.TAU); g.fill(); }
      g.globalAlpha = b.R > 300 ? .14 : .06; g.fillStyle = b.c; g.beginPath(); g.arc(b.x, b.y, b.r, 0, K.TAU); g.fill(); g.globalAlpha = 1; }); });
  const drop = (x, y, big) => { const fall = K.el(`<div style="position:absolute;z-index:6;left:${x - 7}px;top:-30px;width:14px;height:20px;border-radius:50% 50% 50% 50%/60% 60% 40% 40%;background:${K.rgbVar('--accent-500')};pointer-events:none"></div>`);
    fall.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${y + 20}px)` }], { duration: 380, easing: 'cubic-bezier(.55,0,1,.45)', fill: 'forwards' }).finished.then(() => { fall.remove(); K.SFX.splash();
      const R = big ? Math.hypot(K.W, K.H) : K.rand(70, 120); blobs.push({ x, y, r: 6, R, sp: big ? 1.4 : 2.2, c: cols[blobs.length % cols.length] });
      for (let i = 0; i < 10; i++) { const a = K.rand(0, K.TAU), d = K.rand(20, 60); blobs.push({ x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, r: 1, R: K.rand(4, 12), sp: 4, c: cols[0] }); } }); };
  K.onTap((x, y) => { if (done) return; drops++; if (drops >= 2) { done = true; drop(x, y, true); K.hint('번져 나가요…'); K.go(async () => { await K.wait(2400); await K.fade(800); }); } else { drop(x, y, false); K.hint('한 번 더!'); } });
} });

// 48. 창문 성에 — 김 서린 창을 손가락으로 문지르면 녹아 물방울이 흐르고, 너머가 보임
reg('frost', { look: 'clear', hint: '김 서린 창문을 손가락으로 문질러 보세요', cardPos: 'top', mount(K) {
  K.peek(); const L = K.layer(2), D = K.layer(3); let drips = [], done = false, last = 0;
  const frost = () => { const g = L.g; g.clearRect(0, 0, K.W, K.H); g.fillStyle = 'rgba(236,243,250,.985)'; g.fillRect(0, 0, K.W, K.H);
    for (let i = 0; i < K.W * K.H / 40; i++) { g.fillStyle = `rgba(255,255,255,${K.rand(.2, .6)})`; g.fillRect(K.rand(0, K.W), K.rand(0, K.H), K.rand(.5, 2), K.rand(.5, 2)); }
    g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = .7; for (let i = 0; i < 26; i++) { let x = K.rand(0, K.W), y = K.rand(0, 1) < .5 ? 0 : K.H, a = y ? -Math.PI / 2 : Math.PI / 2; g.beginPath(); g.moveTo(x, y); for (let k = 0; k < 10; k++) { a += K.rand(-.6, .6); x += Math.cos(a) * 12; y += Math.sin(a) * 12; g.lineTo(x, y); if (Math.random() < .3) { g.moveTo(x, y); g.lineTo(x + Math.cos(a + 1) * 8, y + Math.sin(a + 1) * 8); g.moveTo(x, y); } } g.stroke(); } };
  frost(); K.onResize(frost);
  const wipe = (x, y) => { const g = L.g; g.globalCompositeOperation = 'destination-out'; const gr = g.createRadialGradient(x, y, 0, x, y, 30); gr.addColorStop(0, 'rgba(0,0,0,1)'); gr.addColorStop(.7, 'rgba(0,0,0,.8)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.beginPath(); g.arc(x, y, 30, 0, K.TAU); g.fill(); g.globalCompositeOperation = 'source-over';
    if (Math.random() < .08) drips.push({ x: x + K.rand(-20, 20), y: y + 20, v: K.rand(20, 50), r: K.rand(2, 3.5), life: K.rand(1.5, 3) }); };
  K.loop(dt => { const g = D.g; g.clearRect(0, 0, K.W, K.H); drips = drips.filter(d => { d.life -= dt; d.y += d.v * dt; d.v += K.rand(-4, 6); const lg = L.g; lg.globalCompositeOperation = 'destination-out'; lg.fillStyle = 'rgba(0,0,0,.6)'; lg.beginPath(); lg.arc(d.x, d.y, d.r * .8, 0, K.TAU); lg.fill(); lg.globalCompositeOperation = 'source-over';
      g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.arc(d.x, d.y, d.r, 0, K.TAU); g.fill(); g.fillStyle = 'rgba(120,150,180,.35)'; g.beginPath(); g.arc(d.x + .8, d.y + .8, d.r * .6, 0, K.TAU); g.fill(); return d.life > 0 && d.y < K.H; }); });
  const measure = () => { const d = L.g.getImageData(0, 0, L.c.width, L.c.height).data; let c = 0, t = 0; for (let i = 3; i < d.length; i += 4 * 97) { t++; if (d[i] < 80) c++; } return c / t; };
  let px = null;
  K.drag(K.gw, { start: (x, y) => { px = [x, y]; wipe(x, y); }, move: (x, y) => { const n = Math.ceil(Math.hypot(x - px[0], y - px[1]) / 8); for (let i = 1; i <= n; i++) wipe(K.lerp(px[0], x, i / n), K.lerp(px[1], y, i / n)); px = [x, y];
      if (done) return; const now = performance.now(); if (now - last > 250) { last = now; if (Math.random() < .4) K.SFX.hiss(.15); if (measure() > .3) melt(); } } });
  const melt = () => { done = true; K.hideCard(300); for (let i = 0; i < 40; i++) drips.push({ x: K.rand(0, K.W), y: K.rand(0, K.H * .5), v: K.rand(40, 120), r: K.rand(2, 4), life: 3 });
    K.go(async () => { L.c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 1400, fill: 'forwards' }); await K.wait(1500); await K.fade(500); }); };
} });

// 49. 필름 영사기 — 누르면 영사기가 돌고 3·2·1 리더 카운트다운 후 입장 (따뜻한 세피아, 완전 검정 아님)
reg('film', { look: 'clear', hint: '화면을 눌러 영사기를 돌려 주세요', mount(K) {
  K.css('ix-fm', `.intro-film { background:#4A4038; } .ix.intro-film .ix-kicker, .ix.intro-film .ix-title, .ix.intro-film .ix-hint { color:#F5E9D2 !important; -webkit-text-fill-color:currentColor; background-image:none; } .intro-film .ix-card { background:rgba(74,64,56,.6); }`);
  const L = K.layer(2); let start = 0, done = false; const grain = [];
  K.loop((dt, now) => { const g = L.g, W = K.W, H = K.H; g.clearRect(0, 0, W, H); if (!start) return; const t = (now - start) / 1000, n = 3 - Math.floor(t), f = t % 1;
    const flick = .92 + Math.random() * .08; g.fillStyle = `rgba(${226 * flick | 0},${210 * flick | 0},${182 * flick | 0},1)`; g.fillRect(0, 0, W, H);
    const cx = W / 2, cy = H / 2, R = Math.min(W, H) * .36;
    if (n >= 1) { g.fillStyle = 'rgba(90,72,55,.35)'; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R * 1.6, -Math.PI / 2, -Math.PI / 2 + f * K.TAU); g.closePath(); g.fill();
      g.strokeStyle = '#5A4A3A'; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R, 0, K.TAU); g.stroke(); g.beginPath(); g.arc(cx, cy, R * .82, 0, K.TAU); g.stroke(); g.lineWidth = 2; g.beginPath(); g.moveTo(0, cy); g.lineTo(W, cy); g.moveTo(cx, 0); g.lineTo(cx, H); g.stroke();
      g.fillStyle = '#3E3228'; g.font = `700 ${R * 1.25 | 0}px "Courier Prime","Courier New",monospace`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(n, cx, cy + R * .06); }
    else { g.fillStyle = '#FFF7E6'; g.fillRect(0, 0, W, H); }
    for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(60,45,30,${K.rand(.1, .35)})`; g.fillRect(K.rand(0, W), K.rand(0, H), K.rand(1, 3), K.rand(1, 3)); }
    if (Math.random() < .5) { g.strokeStyle = 'rgba(60,45,30,.25)'; g.lineWidth = 1; const x = K.rand(0, W); g.beginPath(); g.moveTo(x, 0); g.lineTo(x + K.rand(-6, 6), H); g.stroke(); }
    const vg = g.createRadialGradient(cx, cy, Math.min(W, H) * .3, cx, cy, Math.max(W, H) * .75); vg.addColorStop(0, 'rgba(70,50,30,0)'); vg.addColorStop(1, 'rgba(70,50,30,.55)'); g.fillStyle = vg; g.fillRect(0, 0, W, H);
    if (Math.floor(t) !== Math.floor(t - dt) && n >= 1) K.SFX.beep && K.SFX.click(); });
  K.onTap(() => { if (start) return; start = performance.now(); K.hideCard(200); K.SFX.ratchet(); const tick = setInterval(() => { if (done) return clearInterval(tick); K.SFX.clack(); }, 1000 / 6);
    K.go(async () => { await K.wait(3000); done = true; K.SFX.ding(); await K.wait(250); await K.fade(700); }); });
} });

// 50. 페이지 접기 — 오른쪽 아래 모서리를 잡고 대각선으로 끌어 페이지를 넘기면 입장
reg('pagecurl', { look: 'clear', card: false, mount(K) {
  K.peek(); K.css('ix-pc', `.ix-pc-tip { position:absolute; right:18px; bottom:84px; z-index:6; font:15px "Gowun Batang",serif; color:#5a4a36; text-align:right; pointer-events:none; } .ix-pc-tip b { display:block; font-size:22px; animation:ixnud 1.2s ease-in-out infinite; } @keyframes ixnud { 50% { transform:translate(-6px,-6px); } }`);
  const L = K.layer(3); let tex, P = null, done = false, anim = null;
  const make = () => { const pp = K.paper(Math.round(K.W), Math.round(K.H), { lines: 30, margin: true, aged: .4 }); tex = pp; const t = tex.getContext('2d'); t.fillStyle = '#3a3226'; t.textAlign = 'center'; t.font = '700 11px Cinzel,serif'; t.fillText('CONFIDENTIAL ARCHIVE', K.W / 2, K.H * .36); t.font = `700 ${Math.min(52, K.W * .13)}px "Song Myung",serif`; t.fillText(K.title, K.W / 2, K.H * .36 + 56); t.font = '16px "Gowun Batang",serif'; t.fillStyle = '#5a4a36'; t.fillText(K.line.slice(0, 26), K.W / 2, K.H * .36 + 100); };
  make(); K.onResize(make);
  const tip = K.el(`<div class="ix-pc-tip"><b>↖</b>모서리를 잡고<br>왼쪽 위로 끌어 넘겨 주세요</div>`);
  const draw = () => { const g = L.g, W = K.W, H = K.H; g.clearRect(0, 0, W, H); const C = [W, H];
    if (!P || Math.hypot(P[0] - W, P[1] - H) < 2) { g.drawImage(tex, 0, 0, W, H); g.fillStyle = 'rgba(0,0,0,.06)'; g.beginPath(); g.moveTo(W, H - 40); g.lineTo(W - 40, H); g.lineTo(W, H); g.fill(); return; }
    const mx = (P[0] + C[0]) / 2, my = (P[1] + C[1]) / 2, nx = C[0] - P[0], ny = C[1] - P[1], nl = Math.hypot(nx, ny), ux = nx / nl, uy = ny / nl;   // 접는 선: 중점 지나고 (C-P)에 수직
    const side = (x, y) => (x - mx) * ux + (y - my) * uy;   // >0 이면 접히는 쪽
    const poly = [[0, 0], [W, 0], [W, H], [0, H]], keep = [], flap = [];
    for (let i = 0; i < 4; i++) { const a = poly[i], b = poly[(i + 1) % 4], sa = side(...a), sb = side(...b); if (sa <= 0) keep.push(a); else flap.push(a); if ((sa > 0) !== (sb > 0)) { const k = sa / (sa - sb), q = [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; keep.push(q); flap.push(q); } }
    const path = pts => { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); };
    g.save(); path(keep); g.clip(); g.drawImage(tex, 0, 0, W, H); g.restore();
    const refl = ([x, y]) => { const s = side(x, y); return [x - 2 * s * ux, y - 2 * s * uy]; }, back = flap.map(refl);
    g.save(); path(back); g.shadowColor = 'rgba(40,30,20,.35)'; g.shadowBlur = 18; g.shadowOffsetX = -4; g.shadowOffsetY = -2; g.fillStyle = '#EFE5D0'; g.fill(); g.restore();
    g.save(); path(back); g.clip(); const gr = g.createLinearGradient(mx, my, mx - ux * 120, my - uy * 120); gr.addColorStop(0, 'rgba(255,255,255,.5)'); gr.addColorStop(.3, 'rgba(0,0,0,.05)'); gr.addColorStop(1, 'rgba(0,0,0,.12)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); };
  K.loop(() => { if (anim) { const k = Math.min(1, (performance.now() - anim.t) / 700), e = 1 - Math.pow(1 - k, 3); P = [K.lerp(anim.a[0], anim.b[0], e), K.lerp(anim.a[1], anim.b[1], e)]; if (k >= 1) { anim.done && anim.done(); anim = null; } } draw(); });
  let grabbing = false;
  K.drag(K.gw, { start: (x, y) => { if (done || anim) return; grabbing = Math.hypot(x - K.W, y - K.H) < Math.min(K.W, K.H) * .45; if (grabbing) { tip.style.opacity = '0'; K.SFX.page(); } },
    move: (x, y) => { if (!grabbing || done) return; P = [Math.min(x, K.W - 1), Math.min(y, K.H - 1)]; if (Math.hypot(P[0] - K.W, P[1] - K.H) > Math.hypot(K.W, K.H) * .55) turn(); },
    end: (x, y, dx, dy) => { if (done) return; if (!grabbing) { if (Math.hypot(dx, dy) < 8) { K.hint && 0; tip.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.1)' }, { transform: 'scale(1)' }], { duration: 400 }); } return; } grabbing = false; anim = { t: performance.now(), a: P, b: [K.W, K.H] }; tip.style.opacity = '1'; } });
  const turn = () => { done = true; grabbing = false; K.SFX.page(); anim = { t: performance.now(), a: P, b: [-K.W, -K.H * .4], done: () => {} }; tip.remove(); K.go(async () => { await K.wait(750); await K.fade(300); }); };
} });

// ===== 시작 =====
const q = new URLSearchParams(location.search).get('intro');
const name = (q && EFFECTS[q]) ? q : (P.intro || 'classic');
if (name !== 'classic' && EFFECTS[name]) boot(name);
window.ARCHIVE_INTROS = Object.keys(EFFECTS);
})();
