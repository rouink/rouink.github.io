/* 한여로 — 시작 화면 '키 건네기' (driver 전용 · shared 파일을 고치지 않음)
   data.js page.intro: 'ignition' 일 때만 켜져요. 모양은 driver/theme.css 의 .ig-*
   밤(19~4시) = 남색 계기판 · 새벽(4~8시)·낮 = 밝은 앞유리. 시동 소리는 코드로 합성(파일 없음). */
(() => {
const API = window.ARCHIVE_API, Y = window.YR;
if (!API || !Y) return;
const D = window.ARCHIVE || {}, P = D.page || {};
if ((Y.q.get('intro') || P.intro) !== 'ignition') return;
const C = (P.cabin || {}).ignition || {}, M = C[Y.mode] || C.night || {};
const HAS_BGM = !!((D.config || {}).bgm);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const br = t => esc(t).replace(/\n/g, '<br>');
const fill = t => String(t || '').replace('{n}', String(Y.n).padStart(2, '0')).replace('{time}', Y.timeStr());
const night = Y.mode === 'night';
const gauge = (k, label, rest) => `
  <div class="ig-g" style="--rest:${rest}deg">
    <svg viewBox="0 0 64 40" aria-hidden="true"><path d="M8 34a24 24 0 0 1 48 0" class="tr"/><path d="M8 34a24 24 0 0 1 48 0" class="lit"/><g class="nd"><line x1="32" y1="34" x2="32" y2="13"/><circle cx="32" cy="34" r="2.6"/></g></svg>
    <span>${esc(label)}</span>
  </div>`;

const gate = API.gateway;
gate.className = 'ig'; gate.removeAttribute('style');
gate.innerHTML = `
<div class="ig-bg" aria-hidden="true"></div>
<div class="ig-wind" aria-hidden="true"></div>
<div class="ig-wrap">
  <div class="ig-mirror" aria-hidden="true"><i class="ig-stem"></i><div class="ig-mir"><span></span></div>${night ? '<p class="ig-rec"><b></b>BLACKBOX · REC</p>' : ''}</div>
  <div class="ig-text">
    <p class="ig-top">${esc(fill(M.top))}</p>
    <h1 class="ig-logo"><img src="assets/logo_${night ? 'night' : 'day'}.webp" alt="${esc(P.introTitle || '한여로')}" onerror="this.onerror=null;this.src='assets/logo_${night ? 'night' : 'day'}.png'"></h1>
    <p class="ig-line">${br(M.line)}</p>
  </div>
  <div class="ig-panel">
    <div class="ig-gauges">${gauge('f', 'FUEL', -40)}${gauge('s', 'SPEED', 10)}${gauge('t', 'TEMP', -10)}</div>
    <input type="text" id="username" class="ig-name" placeholder="${esc(C.namePh || '이름')}" maxlength="10" autocomplete="off" aria-label="이름 (선택)">
    <div class="ig-btns">
      <button type="button" class="k" id="ig-sound"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M21 12v2"/></svg>${esc(C.sound || '키 건네기')}</button>
      <button type="button" id="ig-quiet">${esc(C.quiet || '조용히 들어가기')}</button>
    </div>
    <p class="ig-hint">${esc(C.hint || '')}</p>
    <p class="ig-said" id="ig-said" aria-live="polite"></p>
  </div>
</div>
${C.sign ? `<p class="ig-sign" aria-hidden="true">${esc(C.sign)}</p>` : ''}
<div class="ig-veil"></div>`;
const $ = id => document.getElementById(id);
requestAnimationFrame(() => requestAnimationFrame(() => gate.classList.add('ready')));

/* 시동 소리: 스타터 모터 '끼릭' + 낮은 엔진음 (코드로 합성) */
function engine() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    const ac = new AC(), t = ac.currentTime + .03, out = ac.createGain(); out.gain.value = .5; out.connect(ac.destination);
    const st = ac.createOscillator(), sg = ac.createGain(), lfo = ac.createOscillator(), lg = ac.createGain(), sf = ac.createBiquadFilter();
    st.type = 'sawtooth'; st.frequency.setValueAtTime(70, t); st.frequency.linearRampToValueAtTime(110, t + .55);
    lfo.frequency.value = 13; lg.gain.value = .5; lfo.connect(lg); lg.connect(sg.gain);
    sf.type = 'lowpass'; sf.frequency.value = 700;
    sg.gain.setValueAtTime(.0001, t); sg.gain.linearRampToValueAtTime(.32, t + .05); sg.gain.setValueAtTime(.32, t + .5); sg.gain.exponentialRampToValueAtTime(.0001, t + .7);
    st.connect(sf); sf.connect(sg); sg.connect(out); st.start(t); lfo.start(t); st.stop(t + .75); lfo.stop(t + .75);
    const r0 = t + .55;
    [[38, .5], [76, .22], [114, .08]].forEach(([f, a]) => {
      const o = ac.createOscillator(), g = ac.createGain(); o.type = 'sine';
      o.frequency.setValueAtTime(f * 1.6, r0); o.frequency.exponentialRampToValueAtTime(f, r0 + .5);
      g.gain.setValueAtTime(.0001, r0); g.gain.exponentialRampToValueAtTime(a, r0 + .08); g.gain.setValueAtTime(a, r0 + .9); g.gain.exponentialRampToValueAtTime(.0001, r0 + 1.9);
      o.connect(g); g.connect(out); o.start(r0); o.stop(r0 + 2);
    });
    const nb = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = nb.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const ns = ac.createBufferSource(), nf = ac.createBiquadFilter(), ng = ac.createGain();
    ns.buffer = nb; nf.type = 'lowpass'; nf.frequency.value = 180;
    ng.gain.setValueAtTime(.0001, r0); ng.gain.exponentialRampToValueAtTime(.35, r0 + .1); ng.gain.exponentialRampToValueAtTime(.0001, r0 + 1.9);
    ns.connect(nf); nf.connect(ng); ng.connect(out); ns.start(r0); ns.stop(r0 + 2);
    setTimeout(() => ac.close && ac.close(), 3200);
  } catch {}
}

let done = false;
function go(sound) {
  if (done) return; done = true;
  if (sound) engine();
  gate.classList.add('start');
  const said = $('ig-said'); said.textContent = M.answer || '';
  said.classList.add('on'); requestAnimationFrame(() => requestAnimationFrame(() => said.classList.add('show')));
  setTimeout(() => {
    API.enter(sound && HAS_BGM, () => new Promise(res => { gate.classList.add('go'); setTimeout(res, RM ? 0 : 900); }));
  }, RM ? 250 : 1700);
}
$('ig-sound').addEventListener('click', () => go(true));
$('ig-quiet').addEventListener('click', () => go(false));
$('username').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(false); } });
})();
