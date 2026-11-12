/*! © 2026 페르르. All rights reserved. 무단 복제·배포·재사용 금지 */
/* 도인화 — 들어간 뒤 화면 (inhwa 전용 · shared 파일을 고치지 않음)
   Ⅰ 필름: 필름 카운터 · 부분 컷 + 문장 · 누르면 뒤집혀 속마음 · 비교 막대 · 35 다음 비어 있는 36
   Ⅱ 사진관: 가게 머리 · 진열장(방문한 날마다 한가운데가 바뀜) · 맞은편 꽃집
   Ⅲ 촬영실: 예약 확인증 (그 아래 포토카드·인생 두컷은 shared)
   값은 data.js page.film · showcase · across · booking. 미리보기: ?visit=3 · ?last=1 · ?hour=21 */
(() => {
const D = window.ARCHIVE || {}, P = D.page || {}, F = P.film, API = window.ARCHIVE_API, S = window.INHWA_STORE;
if (!F || !API || !S) return;
const C = (D.characters || {}).char1 || {};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const $ = id => document.getElementById(id);
const say = t => t && API.say && API.say(t, { by: C.name || '' });
const pad = n => String(n).padStart(2, '0');
const TOTAL = F.total || 36;

/* shared 표지·갤러리는 이 작품에서 쓰지 않음 */
['hero'].forEach(id => $(id) && $(id).classList.add('ih-gone'));
document.querySelectorAll('[data-ih-gallery]').forEach(el => el.classList.add('ih-gone'));

/* ── 컷 하나 ── */
const imgTag = (src, pos, zoom, alt, eager) => `<img src="${esc(src)}" alt="${esc(alt || '')}" ${eager ? '' : 'loading="lazy" '}decoding="async" style="object-position:${esc(pos || '50% 35%')};${zoom && zoom !== 1 ? `transform:scale(${zoom});transform-origin:${esc(pos || '50% 35%')}` : ''}" onerror="this.style.visibility='hidden'">`;
const lineHtml = l => `<p class="cut-line">${esc((l || [])[0] || '')}${(l || [])[1] ? `<em>${esc(l[1])}</em>` : ''}</p>`;
function cutHtml(c, cls) {
  const shape = c.shape || 'full';
  const media = `
    <div class="cut-media">
      <button type="button" class="card" aria-pressed="false" aria-label="${pad(c.n)}번 컷 뒤집기 — 속마음 보기">
        <span class="face front">${imgTag(c.img, c.pos, c.zoom, '', c.n === 1)}</span>
        <span class="face back"><span class="bl">${esc(F.backLabel || '속마음')} · ${esc(c.time || '')}</span><span class="bt">${esc(c.back || '')}</span><span class="bx">${esc(c.exp || '')}</span></span>
      </button>
    </div>`;
  const num = `<div class="cut-num"><b>${pad(c.n)}</b><small>${esc(c.title || '')}</small></div>`;
  return `<article class="cut cut-${shape}${cls ? ' ' + cls : ''}" data-n="${c.n}">
    ${shape === 'detail' ? `<div class="cut-row">${media}${num}</div>` : `${num}${media}`}
    ${lineHtml(c.line)}
    <div class="cut-foot"><span class="cut-exp">${esc(c.exp || '')}${c.time ? ' · ' + esc(c.time) : ''}</span>
      <span class="cut-acts"><button type="button" class="flip" aria-hidden="true" tabindex="-1">↻ ${esc(F.flip || '뒤집기')}</button><button type="button" class="full" data-full="${esc(c.img)}" data-cap="${esc((c.line || []).join(' '))}" data-no="${pad(c.n)}">⤢ ${esc(F.full || '전체 보기')}</button></span></div>
  </article>`;
}
const CP = F.compare || null;
function cmpHtml() {
  if (!CP) return '';
  const T = CP.title || ['', ''];
  return `<article class="cut cut-cmp" data-n="${CP.n}">
    <p class="ih-lb">${esc(CP.label || '')}</p>
    <h3 class="cmp-h">${esc(T[0])}<em>${esc(T[1] || '')}</em></h3>
    <div class="cmp" id="ih-cmp" style="--x:50%">
      ${imgTag(CP.img, CP.pos, 1, '지금')}
      <div class="then" aria-hidden="true">${imgTag(CP.img, CP.pos, 1, '')}<p class="memo">${esc(CP.memo || '')}</p></div>
      <span class="tg l">${esc(CP.then || '')}</span><span class="tg r">${esc(CP.now || '')}</span>
      <span class="hd" aria-hidden="true"><i>‹ ›</i></span>
      <input type="range" min="4" max="96" value="50" aria-label="${esc(CP.then || '')}과 ${esc(CP.now || '')} 비교 막대">
    </div>
    <p class="cmp-hint">${esc(CP.hint || '')}</p>
    <p class="cmp-after">${esc(CP.after_text || '')}</p>
  </article>`;
}
const E = F.end || {}, L = F.last || {};
function endHtml() {
  const open = S.lastOpen();
  const dots = Array.from({ length: S.need }, (_, i) => `<i class="${i < Math.min(S.visits, S.need) ? 'on' : ''}"></i>`).join('');
  const lastCut = L.img ? cutHtml(Object.assign({ shape: 'full', title: 'Last', exp: 'f/2.8 · 1/60', time: '21:40' }, L), 'cut-last') : '';
  const thirty6 = open
    ? `<article class="cut cut-36 open" data-n="${E.n || 36}"><div class="cut-num"><b>${E.n || 36}</b><small>The Last Frame</small></div>
        <div class="cut-media"><div class="card still">${imgTag(E.img, E.pos, 1, '36번째 컷')}</div></div>
        <p class="cut-line">${esc(E.open || '')}</p><p class="e36-sub">${esc(E.openSub || '')}</p></article>`
    : `<article class="cut cut-36" data-n="${E.n || 36}"><div class="cut-num"><b>${E.n || 36}</b><small>The Last Frame</small></div>
        <div class="e36-blank"><p>${esc(E.lock || '')}<small>${esc(E.lockSub || '')}</small></p></div>
        <p class="e36-hint">${esc(E.lockHint || '')}</p><p class="e36-dots" aria-label="다녀간 날 ${Math.min(S.visits, S.need)} / ${S.need}">${dots}</p></article>`;
  return `<div class="ih-end" id="ih-end"><p class="ih-lb">End of Roll</p>${lastCut}${thirty6}</div>`;
}

/* ── Ⅰ 필름 ── */
const cuts = F.cuts || [];
const T = F.title || ['', ''];
let rollHtml = '';
cuts.forEach(c => { rollHtml += cutHtml(c); if (CP && c.n === CP.after) rollHtml += cmpHtml(); });
const film = document.createElement('section');
film.dataset.page = '1'; film.className = 'ih ih-film'; film.id = 'ih-film';
film.innerHTML = `
  <header class="ih-head">
    <img class="ih-logo" src="assets/logo.svg" alt="${esc(C.name || '')}">
    <p class="ih-lb">${esc(F.label || '')}</p>
    <h1 class="ih-h"><span>${esc(T[0])}</span><span>${esc(T[1] || '')}</span></h1>
    <p class="ih-sub">${esc(F.sub || '')}</p>
  </header>
  <div class="ih-ctr" id="ih-ctr" aria-hidden="true"><span class="rl">ROLL 07</span><span class="bar"><i id="ih-bar"></i></span><span class="n">▸ <em id="ih-n">${pad(cuts[0] ? cuts[0].n : 1)}</em>/${TOTAL}</span></div>
  <div class="ih-roll" id="ih-roll">${rollHtml}${endHtml()}</div>
  <div class="ih-big" aria-hidden="true"><span id="ih-big">${pad(cuts[0] ? cuts[0].n : 1)}</span></div>
  <p class="ih-side" aria-hidden="true">TODAY'S ROLL · BANSHUTTER PHOTO · FOCUSED, NEVER PRESSED</p>`;
const castSec = $('cast-head') && $('cast-head').closest('section');
const main = document.querySelector('main');
main.insertBefore(film, main.firstElementChild);

/* 카운터: 화면 가운데에 온 컷 번호 */
const nEl = $('ih-n'), bar = $('ih-bar'), big = $('ih-big');
let curN = 0;
const setN = n => { if (n === curN) return; curN = n; nEl.textContent = pad(n); big.textContent = pad(n); bar.style.width = (n / TOTAL * 100).toFixed(1) + '%'; if (!RM) { nEl.classList.remove('tk'); void nEl.offsetWidth; nEl.classList.add('tk'); } };
setN(cuts[0] ? cuts[0].n : 1);
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) setN(+e.target.dataset.n); }), { rootMargin: '-45% 0px -50% 0px' });
film.querySelectorAll('.cut[data-n]').forEach(el => io.observe(el));
/* 등장 */
const io2 = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io2.unobserve(e.target); } }), { threshold: .12 });
film.querySelectorAll('.cut').forEach(el => io2.observe(el));

/* 뒤집기 */
film.addEventListener('click', e => {
  const card = e.target.closest('.card:not(.still)'), fb = e.target.closest('.flip');
  const host = card ? card : fb ? fb.closest('.cut').querySelector('.card:not(.still)') : null;
  if (host) {
    const on = host.getAttribute('aria-pressed') !== 'true';
    host.setAttribute('aria-pressed', on);
    const f = host.closest('.cut').querySelector('.flip'); if (f) f.textContent = `↻ ${on ? (F.unflip || '앞면') : (F.flip || '뒤집기')}`;
    return;
  }
  const full = e.target.closest('[data-full]'); if (full) openView(full.dataset.full, full.dataset.no, full.dataset.cap);
});

/* 비교 막대 */
const cmp = $('ih-cmp');
if (cmp) {
  const rng = cmp.querySelector('input');
  const set = v => { v = Math.max(4, Math.min(96, v)); cmp.style.setProperty('--x', v + '%'); rng.value = Math.round(v); };
  rng.addEventListener('input', () => set(+rng.value));
  let drag = false;
  const at = e => { const r = cmp.getBoundingClientRect(); set((e.clientX - r.left) / r.width * 100); };
  cmp.addEventListener('pointerdown', e => { if (e.target === rng) return; drag = true; cmp.setPointerCapture(e.pointerId); at(e); });
  cmp.addEventListener('pointermove', e => { if (drag) at(e); });
  ['pointerup', 'pointercancel'].forEach(t => cmp.addEventListener(t, () => { drag = false; }));
}

/* 36 — 처음 열린 날 한마디 */
if (S.lastOpen()) {
  const c36 = film.querySelector('.cut-36.open');
  if (c36) new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { o.disconnect(); if (!S.s.lastSeen) { S.s.lastSeen = S.today; S.save(); S.openLast(); say(E.openSay); } } }), { threshold: .5 }).observe(c36);
}

/* ── 크게 보기 ── */
const view = document.createElement('div');
view.className = 'ih-view'; view.setAttribute('role', 'dialog'); view.setAttribute('aria-modal', 'true'); view.setAttribute('aria-label', '사진 크게 보기');
view.innerHTML = `<button type="button" class="x" aria-label="닫기">×</button><figure><img alt=""><figcaption><b></b><span></span></figcaption></figure>`;
document.body.appendChild(view);
let lastFocus = null;
function openView(src, no, cap) {
  lastFocus = document.activeElement;
  view.querySelector('img').src = src; view.querySelector('figcaption b').textContent = '▸ ' + no; view.querySelector('figcaption span').textContent = cap || '';
  view.classList.add('on'); document.documentElement.style.overflow = 'hidden';
  setTimeout(() => view.querySelector('.x').focus(), 40);
}
function closeView() { view.classList.remove('on'); document.documentElement.style.overflow = ''; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
view.addEventListener('click', e => { if (e.target === view || e.target.closest('.x')) closeView(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && view.classList.contains('on')) closeView(); });

/* ── Ⅱ 사진관 ── */
const SC = P.showcase || {}, AC = P.across || {};
const shop = document.createElement('section');
shop.dataset.page = '2'; shop.className = 'ih ih-shop';
shop.innerHTML = `
  <p class="ih-lb">Banshutter Photo Studio</p>
  <h2 class="ih-h2">반셔터<em>사진관</em></h2>
  <div class="shop-img">${imgTag('assets/film/05.webp', '40% 36%', 1, '반셔터 사진관 촬영실')}</div>
  <ul class="shop-info"><li><b>영업</b>11:00 – 19:00</li><li><b>휴무</b>화요일</li><li><b>자리</b>물망 골목, 꽃집 맞은편</li></ul>`;
const worldSec = $('hero-text') && $('hero-text').closest('section');
worldSec.parentNode.insertBefore(shop, worldSec);

const states = SC.states || [];
const st = S.lastOpen() && SC.fresh ? SC.fresh : states[(Math.max(1, S.visits) - 1) % Math.max(1, states.length)] || {};
const prints = SC.prints || [], ppos = SC.printPos || [];
const caseSec = document.createElement('section');
caseSec.dataset.page = '2'; caseSec.className = 'ih ih-case fade-up';
const STT = SC.title || ['', ''];
const midHtml = {
  '걸려 있음': `<span class="mid hang"><span class="glr"></span><b>SAMPLE</b></span>`,
  '뒤집힘': `<span class="mid back"><span class="scr"></span><b>SAMPLE</b></span>`,
  '떼어 냄': `<span class="mid gone"><span class="nail"></span></span>`,
  '새 사진': `<span class="mid fresh"><span class="glr"></span><b>SAMPLE</b><i>36</i></span>`
}[st.key] || '';
caseSec.innerHTML = `
  <p class="ih-lb">${esc(SC.label || '')}</p>
  <h2 class="ih-h2 sm">${esc(STT[0])}<em>${esc(STT[1] || '')}</em></h2>
  <div class="win" role="img" aria-label="진열장 — 한가운데 견본 사진: ${esc(st.key || '')}">
    ${prints.map((src, i) => `<span class="pr p${i}">${imgTag(src, ppos[i], 1.6, '')}</span>`).join('')}
    ${midHtml}
  </div>
  <p class="case-chip"><i></i>진열장 · ${esc(st.key || '')}</p>
  <p class="case-cap">${esc(st.cap || '')}</p>
  <p class="case-note">${esc(SC.note || '')}</p>`;
castSec.parentNode.insertBefore(caseSec, castSec);

if (AC.link) {
  const ac = document.createElement('section');
  ac.dataset.page = '2'; ac.className = 'ih ih-across fade-up';
  ac.innerHTML = `<a class="acr" href="${esc(AC.link)}">
    <span class="acr-img">${imgTag(AC.img, AC.pos || '80% 35%', 1, '')}</span>
    <span class="acr-tx"><span class="ih-lb">${esc(AC.label || '')}</span><b>${esc(AC.title || '')}</b><span class="d">${esc(AC.text || '')}</span><span class="go">${esc(AC.btn || '')}</span></span></a>`;
  const quote = $('page-quote');
  quote.parentNode.insertBefore(ac, quote);
}

/* ── Ⅲ 촬영실 — 예약 확인증 ── */
const B = P.booking || {};
const atel = document.querySelector('[data-page="3"]');
if (atel && B.title) {
  const bk = document.createElement('section');
  bk.dataset.page = '3'; bk.className = 'ih ih-book';
  const M = B.memo || [];
  bk.innerHTML = `
    <p class="ih-lb">${esc(B.label || '')}</p>
    <h2 class="ih-h2 sm">${esc(B.title)}</h2>
    <div class="slip"><span class="stamp">${esc(B.stamp || '')}</span>
      ${(B.rows || []).map(([k, v]) => `<div class="row"><span>${esc(k)}</span><b data-nm="${v === '{name}' ? 1 : ''}">${esc(v === '{name}' ? (P.guestName || '손님') : v)}</b></div>`).join('')}
      <p class="memo">${esc(M[0] || '')}<s>${esc(M[1] || '')}</s>${esc(M[2] || '')}<br>${esc(M[3] || '')}</p>
    </div>
    <p class="book-next">${esc(B.next || '')}</p>`;
  atel.parentNode.insertBefore(bk, atel);
}

/* ── 들어온 뒤 한마디 ── */
document.addEventListener('archive:enter', e => {
  const nm = (e.detail && e.detail.user && e.detail.user !== 'GUEST') ? e.detail.user : (P.guestName || '손님');
  document.querySelectorAll('[data-nm="1"]').forEach(el => { el.textContent = nm; });
  const h = S.hour;
  const again = S.visits >= 2 && S.s.saidAgain !== S.today;
  const line = again ? '또 왔네. 예약도 없으면서.'
    : h >= 11 && h < 19 ? '…들어왔으면 앉아. 조명 맞출게.'
    : h >= 19 && h < 23 ? '마감했는데. 찍고 갈 거면 빨리.'
    : '이 시간에 뭐 하러 와. …불은 켜 둘게.';
  if (again) { S.s.saidAgain = S.today; S.save(); }
  setTimeout(() => say(line), RM ? 300 : 1500);
}, { once: true });
/* 나중에 끼워 넣은 칸의 스크롤 등장 (shared 는 처음 있던 칸만 지켜봄) */
(() => { const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: .12 });
  document.querySelectorAll('section.ih.fade-up').forEach(el => o.observe(el)); })();
/* 나중에 끼워 넣은 칸도 지금 페이지에 맞춰 숨김 (shared 는 처음 한 번만 숨김) */
(() => { const on = document.querySelector('#page-nav .active'); const n = on ? on.dataset.goto : '1';
  document.querySelectorAll('section.ih[data-page]').forEach(el => el.classList.toggle('page-hidden', el.dataset.page !== n)); })();
})();
