/* 권세율 — 시작 화면 '닫힌 회의실 문' (audit 전용 · shared 파일을 고치지 않음)
   data.js page.intro: 'door' 일 때만 켜져요. (?intro=door 로 미리보기)
   page.door: { image, room, inUse, top, line, cells, namePh, knock, quiet, hint, answer, answerQuiet, sign }
   노크하면 '똑똑' 소리(코드로 합성 · 파일 없음)와 함께 안에서 대답이 들려요. */
(() => {
const API = window.ARCHIVE_API;
if (!API) return;
const D = window.ARCHIVE || {}, P = D.page || {}, q = new URLSearchParams(location.search);
if ((q.get('intro') || P.intro) !== 'door') return;
const B = P.door || {}, A = P.audit || {};
const HAS_BGM = !!((D.config || {}).bgm);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const br = t => esc(t).replace(/\n/g, '<br>');

/* 상태(조사 n일차 · 커피 · 불신)는 audit.js 와 같은 저장소에서 읽기만 해요 */
const st = window.AUDIT_STATE ? window.AUDIT_STATE() : { day: 1, coffeeLabel: '거절 0', doubt: A.doubtStart || 90, closed: false };
const cells = B.cells || ['조사', '커피', '불신'];

const css = document.createElement('style');
css.textContent = `
#gateway.rm{position:fixed;inset:0;z-index:65;overflow:hidden;padding:0;display:block;background:#F5F3EE;color:#1B2130;-webkit-tap-highlight-color:transparent}
.rm .rm-bg{position:absolute;inset:-2%;background:#E8E4DB center/cover no-repeat;background-position:62% 28%;transform:scale(1.04);filter:saturate(.96);transition:transform 1.4s cubic-bezier(.2,.8,.2,1),filter 1.2s ease,opacity 1.2s ease;opacity:0}
.rm.ready .rm-bg{opacity:1;transform:scale(1)}
.rm .rm-bg::after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(245,243,238,.62),rgba(245,243,238,0) 46%)}
.rm .rm-door{position:absolute;left:clamp(16px,6vw,96px);top:50%;transform:translateY(calc(-50% + 18px));width:min(440px,calc(100vw - 32px));box-sizing:border-box;padding:36px 38px 28px;background:rgba(245,243,238,.66);backdrop-filter:blur(18px) saturate(1.1);-webkit-backdrop-filter:blur(18px) saturate(1.1);border:1px solid rgba(255,255,255,.85);box-shadow:0 30px 60px rgba(27,33,48,.16);opacity:0;transition:opacity 1s cubic-bezier(.2,.8,.2,1) .25s,transform 1s cubic-bezier(.2,.8,.2,1) .25s}
.rm.ready .rm-door{opacity:1;transform:translateY(-50%)}
.rm .rm-top{margin:0 0 14px;font:500 10.5px "DM Mono",monospace;letter-spacing:.26em;color:#4A5262}
.rm .rm-plate{display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid #1B2130;padding-bottom:13px}
.rm .rm-plate b{font:800 19px "Gothic A1",sans-serif;letter-spacing:-.02em}
.rm .rm-use{font:700 12.5px "Gothic A1",sans-serif;color:#FBFAF7;background:#2C4FA3;padding:6px 11px;letter-spacing:.08em;transition:background .5s ease}
.rm.open .rm-use{background:#1B2130}
.rm h1{margin:26px 0 0;font:800 clamp(62px,15vw,96px)/.95 "Nanum Myeongjo",serif;letter-spacing:-.07em;color:#1B2130}
.rm .rm-line{margin:14px 0 0;font:500 16.5px/1.75 "Gothic A1",sans-serif;color:#2A3040;word-break:keep-all}
.rm .rm-cells{display:grid;grid-template-columns:repeat(3,1fr);margin-top:22px;border:1.5px solid #1B2130}
.rm .rm-cells div{padding:10px 12px 11px;border-left:1.5px solid #1B2130;min-width:0}
.rm .rm-cells div:first-child{border-left:0}
.rm .rm-cells small{display:block;font:500 10.5px "DM Mono",monospace;letter-spacing:.16em;color:#4A5262}
.rm .rm-cells b{display:block;margin-top:3px;font:800 19px "Gothic A1",sans-serif;letter-spacing:-.03em;white-space:nowrap}
.rm .rm-cells b.bl{color:#2C4FA3}
.rm .rm-name{display:block;width:100%;box-sizing:border-box;margin-top:20px;border:0;border-bottom:1.5px solid #1B2130;background:transparent;padding:8px 0;font:600 16px "Gothic A1",sans-serif;color:#1B2130;border-radius:0}
.rm .rm-name:focus{outline:none;border-bottom-color:#2C4FA3}
.rm .rm-name::placeholder{color:#7A8090}
.rm .rm-btns{display:flex;gap:10px;margin-top:18px}
.rm .rm-btns button{flex:1;padding:16px 0;font:700 16px "Gothic A1",sans-serif;border:1.5px solid #1B2130;background:transparent;color:#1B2130;cursor:pointer;transition:background .3s ease,color .3s ease}
.rm .rm-btns button.k{background:#1B2130;color:#F5F3EE}
.rm .rm-btns button:focus-visible{outline:2px solid #2C4FA3;outline-offset:3px}
.rm .rm-hint{margin:12px 0 0;text-align:center;font:500 13px "Gothic A1",sans-serif;color:#4A5262}
.rm .rm-said{margin:16px 0 0;padding:14px 16px;background:#1B2130;color:#F5F3EE;font:700 16.5px/1.6 "Gothic A1",sans-serif;opacity:0;transform:translateY(8px);transition:opacity .6s cubic-bezier(.2,.8,.2,1),transform .6s cubic-bezier(.2,.8,.2,1);display:none}
.rm .rm-said.on{display:block}
.rm .rm-said.show{opacity:1;transform:none}
.rm .rm-said::before{content:'권세율';display:block;font:500 10.5px "DM Mono",monospace;letter-spacing:.22em;color:#9DB2E6;margin-bottom:5px}
.rm .rm-sign{position:absolute;right:clamp(16px,4vw,48px);bottom:calc(18px + env(safe-area-inset-bottom));margin:0;font:500 10.5px "DM Mono",monospace;letter-spacing:.3em;color:rgba(27,33,48,.55);writing-mode:vertical-rl}
.rm .rm-veil{position:absolute;inset:0;z-index:5;pointer-events:none;background:#F5F3EE;opacity:0;transition:opacity .9s cubic-bezier(.2,.8,.2,1)}
.rm.go .rm-veil{opacity:1}
.rm.go .rm-door{opacity:0;transform:translateY(calc(-50% - 14px));transition:opacity .6s ease,transform .7s cubic-bezier(.2,.8,.2,1)}
.rm.go .rm-bg{transform:scale(1.06)}
.rm .knockfx{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 0 0 rgba(27,33,48,0)}
.rm.knocking .rm-door{animation:rmk .38s cubic-bezier(.2,.8,.2,1) 2}
@keyframes rmk{0%{transform:translateY(-50%)}30%{transform:translateY(-50%) translateX(-3px)}60%{transform:translateY(-50%) translateX(2px)}100%{transform:translateY(-50%)}}
@media (max-width:700px){
  .rm .rm-bg{background-position:58% 18%}
  .rm .rm-door{left:16px;right:16px;width:auto;top:auto;bottom:calc(16px + env(safe-area-inset-bottom));transform:translateY(18px);padding:24px 22px 18px}
  .rm.ready .rm-door{transform:none}
  .rm.go .rm-door{transform:translateY(-12px)}
  .rm h1{margin-top:16px;font-size:60px}
  .rm .rm-line{font-size:15.5px;margin-top:10px}
  .rm .rm-cells{margin-top:16px}.rm .rm-cells b{font-size:17px}
  .rm .rm-name{margin-top:14px}
  .rm .rm-btns{margin-top:14px}.rm .rm-btns button{padding:14px 0;font-size:15.5px}
  .rm .rm-sign{display:none}
  .rm.knocking .rm-door{animation:rmkm .38s cubic-bezier(.2,.8,.2,1) 2}
}
@keyframes rmkm{0%,100%{transform:none}30%{transform:translateX(-3px)}60%{transform:translateX(2px)}}
@media (max-height:700px) and (max-width:700px){.rm h1{font-size:48px}.rm .rm-line{display:none}}
@media (prefers-reduced-motion:reduce){.rm *{transition-duration:.01s !important;animation:none !important}}`;
document.head.appendChild(css);

const gate = API.gateway;
gate.className = 'rm'; gate.removeAttribute('style');
const doubtTxt = st.closed ? '종결' : st.doubt + '%';
gate.innerHTML = `
<div class="rm-bg" id="rm-bg" aria-hidden="true"></div>
<div class="rm-door" role="group" aria-label="${esc(B.room || '회의실')} 문">
  <p class="rm-top">${esc(B.top || 'TAX AUDIT')}</p>
  <div class="rm-plate"><b>${esc(B.room || '제3회의실')}</b><span class="rm-use" id="rm-use">${esc(st.closed ? '비어 있음' : (B.inUse || '사용 중'))}</span></div>
  <h1>${esc(P.introTitle || '')}</h1>
  <p class="rm-line">${br(B.line || '')}</p>
  <div class="rm-cells">
    <div><small>${esc(cells[0])}</small><b>${st.closed ? '종결' : esc(st.day + '일차')}</b></div>
    <div><small>${esc(cells[1])}</small><b class="bl">${esc(st.coffeeLabel)}</b></div>
    <div><small>${esc(cells[2])}</small><b>${esc(doubtTxt)}</b></div>
  </div>
  <input type="text" id="username" class="rm-name" placeholder="${esc(B.namePh || '이름')}" maxlength="10" autocomplete="off" aria-label="이름 (선택)">
  <div class="rm-btns">
    <button type="button" class="k" id="rm-knock">${esc(B.knock || '노크하기')}</button>
    <button type="button" id="rm-quiet">${esc(B.quiet || '조용히 들어가기')}</button>
  </div>
  <p class="rm-hint" id="rm-hint">${esc(HAS_BGM ? (B.hint || '') : '')}</p>
  <p class="rm-said" id="rm-said" aria-live="polite"></p>
</div>
${B.sign ? `<p class="rm-sign" aria-hidden="true">${esc(B.sign)}</p>` : ''}
<div class="rm-veil"></div>`;
const $ = id => document.getElementById(id);
if (!HAS_BGM) $('rm-hint').remove();

const bg = $('rm-bg'), img = new Image();
const ready = () => requestAnimationFrame(() => gate.classList.add('ready'));
img.onload = () => { bg.style.backgroundImage = `url("${B.image || P.heroImage || ''}")`; ready(); };
img.onerror = ready; img.src = B.image || P.heroImage || '';
setTimeout(ready, 1800);

/* 노크 소리: 나무 문을 두 번 두드리는 짧은 저음 (코드로 합성) */
function knockSound() {
  try {
    const C = window.AudioContext || window.webkitAudioContext; if (!C) return;
    const ac = new C();
    [0, .19].forEach(t0 => {
      const t = ac.currentTime + t0 + .02;
      const o = ac.createOscillator(), g = ac.createGain(), f = ac.createBiquadFilter();
      o.type = 'triangle'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(72, t + .09);
      f.type = 'lowpass'; f.frequency.value = 900;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(.55, t + .006); g.gain.exponentialRampToValueAtTime(0.0001, t + .16);
      o.connect(f); f.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + .2);
      const n = ac.createBufferSource(), nb = ac.createBuffer(1, ac.sampleRate * .05, ac.sampleRate), d = nb.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 3);
      const ng = ac.createGain(), nf = ac.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 1400; ng.gain.value = .22;
      n.buffer = nb; n.connect(nf); nf.connect(ng); ng.connect(ac.destination); n.start(t);
    });
    setTimeout(() => ac.close && ac.close(), 900);
  } catch {}
}

let done = false;
function go(kind) {
  if (done) return; done = true;
  const said = $('rm-said');
  said.textContent = kind === 'knock' ? (B.answer || '') : (B.answerQuiet || '');
  if (kind === 'knock') { knockSound(); gate.classList.add('knocking'); }
  said.classList.add('on'); requestAnimationFrame(() => requestAnimationFrame(() => said.classList.add('show')));
  $('rm-use').textContent = '입실';
  gate.classList.add('open');
  const wait = RM ? 200 : 1500;
  setTimeout(() => {
    API.enter(kind === 'knock' && HAS_BGM, () => new Promise(res => {
      gate.classList.add('go');
      setTimeout(res, RM ? 0 : 950);
    }));
  }, wait);
}
$('rm-knock').addEventListener('click', () => go('knock'));
$('rm-quiet').addEventListener('click', () => go('quiet'));
$('username').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go('knock'); } });
})();
