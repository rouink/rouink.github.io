/* 연재은 — 시작 화면 '엑셀 뒤에 숨긴 창' (novel 전용 · shared 파일을 고치지 않음)
   data.js page.intro: 'hidden' 일 때만 켜져요. (?intro=hidden 으로 미리보기)
   퇴근 무렵의 엑셀 창. 아래 '열린 창'에 숨겨 둔 창 하나를 누르면, 엑셀이 내려가고 소설 앱이 올라와요. */
(() => {
const API = window.ARCHIVE_API;
if (!API) return;
const D = window.ARCHIVE || {}, P = D.page || {}, q = new URLSearchParams(location.search);
if ((q.get('intro') || P.intro) !== 'hidden') return;
const H = P.hidden || {}, N = P.novel || {}, S = window.NOVEL_STORE;
const HAS_BGM = !!((D.config || {}).bgm);
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const ep = S ? S.ep() : (N.startEp || 12);
const hour = S ? S.hour : new Date().getHours();
const pad = n => String(n).padStart(2, '0');
const clock = `${pad(hour)}:${pad(S ? S.minute : new Date().getMinutes())}`;
const eve = hour >= 18 && hour < 23, day = hour >= 9 && hour < 18;
const hint = `${clock} · ${esc(day ? H.hintDay : eve ? H.hintEve : H.hintNight)}${eve && H.hintNear ? '<br>' + esc(H.hintNear) : ''}`;

const css = document.createElement('style');
css.textContent = `
#gateway.hw{position:fixed;inset:0;z-index:65;overflow:hidden;padding:0;display:block;background:#E3E7EB;color:#2B3036;font-family:"IBM Plex Sans KR",sans-serif;-webkit-tap-highlight-color:transparent}
.hw .hw-name{position:absolute;width:1px;height:1px;opacity:0;pointer-events:none}
.hw .hw-win{position:absolute;left:0;right:0;top:0;bottom:96px;background:#fff;display:flex;flex-direction:column;overflow:hidden;transition:transform .8s cubic-bezier(.2,.8,.2,1),opacity .6s ease,filter .6s ease}
.hw .hw-bar{flex:none;height:44px;background:#F6F7F8;border-bottom:1px solid #D5D9DE;display:flex;align-items:center;gap:8px;padding:0 14px;font-size:12.5px}
.hw .hw-dot{width:10px;height:10px;border-radius:50%;background:#D7DBE0}
.hw .hw-file{margin-left:6px;font-weight:600;color:#3A4048;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hw .hw-file small{font-weight:400;color:#8A9098;margin-left:6px}
.hw .hw-menu{flex:none;height:34px;border-bottom:1px solid #DDE1E5;display:flex;align-items:center;gap:16px;padding:0 14px;font-size:12px;color:#6B7178}
.hw .hw-menu b{color:#2B3036;font-weight:600}
.hw .hw-fx{flex:none;height:30px;border-bottom:1px solid #DDE1E5;display:flex;align-items:center;font-size:12px;color:#3A4048}
.hw .hw-fx i{font-style:normal;width:48px;text-align:center;border-right:1px solid #DDE1E5;color:#8A9098;line-height:30px}
.hw .hw-fx span{padding-left:10px}
.hw .hw-grid{flex:1;overflow:hidden}
.hw table{border-collapse:collapse;width:100%;table-layout:fixed;font-size:12px}
.hw td,.hw th{border:1px solid #E1E4E8;height:27px;padding:0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.hw th{background:#F3F4F6;font-weight:500;color:#7D838B;font-size:11px}
.hw th.r{width:32px}
.hw td.n{text-align:right;font-variant-numeric:tabular-nums}
.hw td.sel{outline:2px solid #4B6A8A;outline-offset:-2px}
.hw tr.h td{font-weight:600;background:#F8F9FA}
.hw .x{display:none}
.hw .hw-task{position:absolute;left:0;right:0;bottom:0;height:96px;background:rgba(246,247,248,.96);border-top:1px solid #D5D9DE;padding:12px 14px calc(10px + env(safe-area-inset-bottom))}
.hw .hw-task .t{display:flex;justify-content:space-between;gap:10px;font-size:11px;color:#8A9098;letter-spacing:.04em;margin-bottom:8px;white-space:nowrap}
.hw .hw-task .t .hh{overflow:hidden;text-overflow:ellipsis;color:#5E6470}
.hw .hw-hint{display:none}
.hw .hw-wins{display:flex;gap:8px}
.hw .hw-w{flex:1;min-width:0;height:46px;border-radius:10px;background:#fff;border:1px solid #D9DDE2;display:flex;align-items:center;gap:8px;padding:0 10px;font-size:12.5px;font-weight:500;color:#3A4048;white-space:nowrap;overflow:hidden}
.hw .hw-w .ic{flex:none;width:22px;height:22px;border-radius:6px;background:#D9DEE4}
.hw .hw-w span.nm{overflow:hidden;text-overflow:ellipsis}
.hw button.hw-w{font:inherit;font-size:12.5px;font-weight:600;cursor:pointer;background:#F7F4EC;border-color:#E3D9C7;color:#1C2430;box-shadow:0 0 0 3px rgba(194,65,45,.12);text-align:left}
.hw button.hw-w .ic{background:#1C2430;color:#F7F4EC;display:grid;place-items:center;font:14px/1 "Black And White Picture",serif}
.hw button.hw-w em{margin-left:auto;flex:none;font-style:normal;font-size:10.5px;color:#C2412D;font-weight:600}
.hw button.hw-w:focus-visible{outline:2px solid #C2412D;outline-offset:3px}
.hw .hw-peek{position:absolute;right:14px;bottom:110px;width:min(232px,64vw);background:#F7F4EC;border-radius:14px;padding:15px 15px 13px;box-shadow:0 18px 40px rgba(20,30,45,.22);opacity:0;transform:translateY(12px);transition:opacity .9s cubic-bezier(.2,.8,.2,1) .5s,transform .9s cubic-bezier(.2,.8,.2,1) .5s}
.hw.ready .hw-peek{opacity:1;transform:none}
.hw .hw-peek::after{content:"";position:absolute;right:56px;bottom:-8px;width:16px;height:16px;background:#F7F4EC;transform:rotate(45deg)}
.hw .hw-peek .k{font-size:10.5px;letter-spacing:.2em;color:#C2412D;font-weight:600}
.hw .hw-peek .qq{margin:8px 0 0;font:500 16px/1.55 "Noto Serif KR",serif;color:#1C2430;word-break:keep-all}
.hw .hw-peek .qq s{color:#8C9098;text-decoration-color:#C2412D;text-decoration-thickness:2px}
.hw .hw-btns{margin-top:12px;display:flex;gap:6px}
.hw .hw-btns button{flex:1;height:40px;border-radius:9px;border:0;font:600 13px "IBM Plex Sans KR",sans-serif;cursor:pointer}
.hw .hw-btns .on{background:#1C2430;color:#F7F4EC}
.hw .hw-btns .off{background:#E7E1D4;color:#2E3744}
.hw .hw-btns button:focus-visible{outline:2px solid #C2412D;outline-offset:2px}
.hw .hw-hint{position:absolute;left:14px;bottom:110px;max-width:40vw;padding:7px 10px;border-radius:9px;background:rgba(246,247,248,.94);border:1px solid #DDE1E5;font-size:12px;line-height:1.55;color:#5E6470}
.hw .hw-app{position:absolute;inset:0;display:grid;place-items:center;background:#F7F4EC;opacity:0;pointer-events:none;transition:opacity .7s cubic-bezier(.2,.8,.2,1)}
.hw .hw-app div{text-align:center;transform:translateY(16px);transition:transform .9s cubic-bezier(.2,.8,.2,1)}
.hw .hw-app b{display:block;font:400 54px/1 "Black And White Picture",serif;color:#1C2430;letter-spacing:-.03em}
.hw .hw-app p{margin:16px 0 0;font:500 13px "IBM Plex Sans KR",sans-serif;color:#5E6470;letter-spacing:.02em}
.hw .hw-app p i{display:block;width:120px;height:2px;margin:14px auto 0;background:#E3DBCB;position:relative;overflow:hidden}
.hw .hw-app p i::after{content:"";position:absolute;left:0;top:0;bottom:0;width:40%;background:#C2412D;animation:hwld 1.1s cubic-bezier(.2,.8,.2,1) infinite}
@keyframes hwld{0%{transform:translateX(-100%)}100%{transform:translateX(260%)}}
.hw.switch .hw-win{transform:translateY(60px) scale(.97);opacity:0;filter:blur(2px)}
.hw.switch .hw-peek{opacity:0;transform:translateY(12px);transition-delay:0s;transition-duration:.4s}
.hw.switch .hw-app{opacity:1}
.hw.switch .hw-app div{transform:none}
@media (min-width:760px){
  .hw .hw-win{left:50%;right:auto;top:36px;bottom:120px;width:min(1080px,92vw);transform:translateX(-50%);border-radius:12px;box-shadow:0 30px 70px rgba(30,40,55,.18);border:1px solid #D5D9DE}
  .hw.switch .hw-win{transform:translateX(-50%) translateY(60px) scale(.97)}
  .hw .x{display:table-cell}
  .hw table{font-size:13px}
  .hw td,.hw th{height:29px}
  .hw .hw-task{height:88px;padding:12px 0 0;display:flex;flex-direction:column;align-items:center}
  .hw .hw-task .t{width:min(640px,80vw)}
  .hw .hw-wins{width:min(640px,80vw)}
  .hw .hw-peek{right:auto;left:calc(50% + 16px);bottom:104px;width:280px}
  .hw .hw-peek::after{right:auto;left:150px}
  .hw .hw-hint{display:block;left:calc(50% - min(540px,46vw) + 20px);bottom:136px;max-width:none}
  .hw .hw-task .t .hh{display:none}
}
@media (max-height:640px) and (max-width:759px){.hw .hw-hint{display:none}}
@media (prefers-reduced-motion:reduce){.hw *{transition-duration:.01s !important;transition-delay:0s !important;animation:none !important}}`;
document.head.appendChild(css);

const head = H.head || ['계정', '10월', '11월', '12월', '비고'];
const rows = H.rows || [];
const letters = 'ABCDEFGHI'.split('');
let tb = `<tr><th class="r"></th>${letters.map((l, i) => `<th${i > 4 ? ' class="x"' : ''}>${l}</th>`).join('')}</tr>`;
tb += `<tr class="h"><th>1</th>${letters.map((l, i) => `<td${i > 4 ? ' class="x"' : ''}>${esc(head[i] || '')}</td>`).join('')}</tr>`;
for (let r = 0; r < 34; r++) {
  const row = rows[r] || [], last = r === rows.length - 1;
  tb += `<tr${last ? ' class="h"' : ''}><th>${r + 2}</th>${letters.map((l, i) => {
    const v = row[i] || '', num = /^[\d,]+$/.test(v);
    const cls = [i > 4 ? 'x' : '', num ? 'n' : '', last && i === 2 ? 'sel' : ''].filter(Boolean).join(' ');
    return `<td${cls ? ` class="${cls}"` : ''}>${esc(v)}</td>`;
  }).join('')}</tr>`;
}

const gate = API.gateway;
gate.className = 'hw'; gate.removeAttribute('style');
gate.innerHTML = `
<input type="text" id="username" class="hw-name" tabindex="-1" aria-hidden="true" autocomplete="off">
<div class="hw-win" aria-hidden="true">
  <div class="hw-bar"><span class="hw-dot"></span><span class="hw-dot"></span><span class="hw-dot"></span><span class="hw-file">${esc(H.file || '')}<small>· ${esc(H.saved || '')}</small></span></div>
  <div class="hw-menu">${(H.menu || []).map((m, i) => i ? `<span>${esc(m)}</span>` : `<b>${esc(m)}</b>`).join('')}</div>
  <div class="hw-fx"><i>C${rows.length + 1}</i><span>${esc(H.formula || '')}</span></div>
  <div class="hw-grid"><table>${tb}</table></div>
</div>
<p class="hw-hint" aria-hidden="true">${hint}</p>
<div class="hw-peek" role="group" aria-label="${esc(H.winTag || '숨긴 창')}">
  <div class="k">${esc(H.winTag || '숨긴 창')} · ${esc(N.app || '')}</div>
  <p class="qq"><s>${esc(H.struck || '')}</s><br>${esc(H.fixed || '')}</p>
  <div class="hw-btns">${HAS_BGM
    ? `<button type="button" class="on" id="hw-on">${esc(H.on || '')}</button><button type="button" class="off" id="hw-off">${esc(H.off || '')}</button>`
    : `<button type="button" class="on" id="hw-off">${esc(H.only || '열기')}</button>`}</div>
</div>
<div class="hw-task">
  <div class="t"><span>${esc(H.openWins || '')}</span><span class="hh">${hint.replace('<br>', ' · ')}</span></div>
  <div class="hw-wins">
    <div class="hw-w" aria-hidden="true"><span class="ic"></span><span class="nm">${esc((H.file || '').replace(/^\d+분기_/, ''))}</span></div>
    <button type="button" class="hw-w" id="hw-tab" aria-label="${esc(N.app || '')} ${ep}화 열기"><span class="ic">${esc((N.app || '쪽').charAt(0))}</span><span class="nm">${esc(N.app || '')} · ${ep}화</span><em>새 댓글 40</em></button>
  </div>
</div>
<div class="hw-app" aria-hidden="true"><div><b>${esc(N.app || '')}</b><p>${esc((N.title || []).join(' '))} · ${ep}화<i></i></p></div></div>`;
const $ = id => document.getElementById(id);
requestAnimationFrame(() => requestAnimationFrame(() => gate.classList.add('ready')));

let done = false;
function go(withBgm) {
  if (done) return; done = true;
  gate.classList.add('switch');
  setTimeout(() => {
    API.enter(withBgm && HAS_BGM, () => new Promise(res => setTimeout(res, RM ? 0 : 500)));
  }, RM ? 100 : 1300);
}
if ($('hw-on')) $('hw-on').addEventListener('click', () => go(true));
$('hw-off').addEventListener('click', () => go(false));
$('hw-tab').addEventListener('click', () => go(HAS_BGM));
})();
