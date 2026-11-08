/* 한여로 — 운전석 장치 (driver 전용 · shared 파일을 고치지 않음)
   룸미러(n번째 배차) · 계기판 · 내비 · 카오디오 · 휴대폰 거치대(단골 기사·고객 메모·운행 요금·메시지)
   · 글로브박스 · 비 오는 밤 앞유리 · 34초 머물기
   글은 data.js page.cabin, 상태는 js/state.js. 모양은 theme.css 의 .yr-* */
(() => {
const D = window.ARCHIVE || {}, P = D.page || {}, K = P.cabin, API = window.ARCHIVE_API, Y = window.YR;
if (!K || !API || !Y) return;
const s = Y.s, RM = matchMedia('(prefers-reduced-motion: reduce)').matches, night = Y.mode === 'night';
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const two = a => (a || []).filter(Boolean).map(t => `<span>${esc(t)}</span>`).join('');
const $ = id => document.getElementById(id);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const say = (t, o) => t && API.say && API.say(t, Object.assign({ by: '한여로' }, o || {}));
const pick = (arr, seed) => arr[(Y.hash(seed) >>> 0) % arr.length];
const n2 = v => String(v).padStart(2, '0');
const IO = 'IntersectionObserver' in window && !RM ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); IO.unobserve(e.target); } }), { threshold: .08 }) : null;
const reveal = n => { if (IO) IO.observe(n); else n.classList.add('in'); return n; };
const sec = (cls, B) => { const e = el('section', 'yr-sec fade-up ' + cls, `<div class="yr-head"><p class="label">${esc(B.label)}</p><h2 class="yr-h">${two(B.title)}</h2>${B.sub ? `<p class="yr-sub">${esc(B.sub)}</p>` : ''}</div>`); e.setAttribute('data-page', '1'); return e; };
const anchor = $('page-quote');
const put = node => { anchor ? anchor.before(node) : document.querySelector('main').appendChild(node); return reveal(node); };
const ICON = {
  log: '<svg viewBox="0 0 48 48"><rect x="11" y="7" width="26" height="34" rx="3"/><path d="M17 7v34M22 16h10M22 22h10M22 28h7"/><path d="M37 13l4 2-4 2"/></svg>',
  card: '<svg viewBox="0 0 48 48"><path d="M15 8h14l6 6v26a2 2 0 0 1-2 2H15a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"/><path d="M19 8v6M23 8v6M27 8v6"/><circle cx="24" cy="30" r="4"/></svg>',
  candy: '<svg viewBox="0 0 48 48"><rect x="12" y="14" width="24" height="26" rx="4"/><path d="M14 14l2-6h16l2 6M18 24h12"/><circle cx="20" cy="32" r="2.4"/><circle cx="28" cy="32" r="2.4"/></svg>',
  ticket: '<svg viewBox="0 0 48 48"><path d="M8 14h32v6a4 4 0 0 0 0 8v6H8v-6a4 4 0 0 0 0-8z"/><path d="M30 14v20" stroke-dasharray="2 3"/><path d="M14 22h10M14 27h6"/></svg>'
};

/* ── 1. 표지: 사진 + 룸미러 + n번째 배차 첫마디 ── */
const MI = K.mirror || {};
function firstLine() {
  if (Y.isBirthday()) return (K.dash || {}).birthday;
  if (s.prevRate && MI.rated && MI.rated[s.prevRate] && s.ratedSaid !== s.n) { s.ratedSaid = s.n; Y.save(); return MI.rated[s.prevRate]; }
  if (Y.mode === 'dawn') return pick(MI.dawn || [], Y.today + Y.n);
  if (Y.mode === 'day') return pick(MI.day || [], Y.today + Y.n);
  const d = (MI.dispatch || {})[Y.n];
  return d || pick(MI.later || ['{n}'], Y.today + Y.n).replace('{n}', Y.n);
}
const hero = $('hero');
if (hero) {
  const lg = night ? 'night' : 'day';
  hero.className = 'yr-hero';
  hero.innerHTML = `
    <div class="yr-photo" aria-hidden="true" style="background-image:url('assets/hero_${Y.mode}.jpg')"></div>
    <div class="hidden" id="hero-media"><img id="hero-img" alt=""></div>
    <div class="yr-mwrap">
      <i class="yr-stem" aria-hidden="true"></i>
      <div class="yr-mirror" id="yr-mirror" role="slider" tabindex="0" aria-label="${esc(MI.hint || '룸미러')}" aria-valuemin="-12" aria-valuemax="12" aria-valuenow="0">
        <span class="img" style="background-image:url('assets/mirror_${lg}.jpg')"></span><span class="glare"></span>
      </div>
      <p class="yr-mhint" id="yr-mhint">${esc(MI.hint || '')}</p>
    </div>
    <div class="yr-htext">
      <p class="label" id="hero-label">${night || Y.mode === 'dawn' ? 'CALL Nº ' + n2(Y.n) : 'DAYTIME · 정비소'} · ${esc(Y.timeStr())}</p>
      <h1 class="yr-logo" id="hero-title"><img src="assets/logo_${lg}.webp" alt="${esc(P.heroTitle || '한여로')}" onerror="this.onerror=null;this.src='assets/logo_${lg}.png'"></h1>
      <p class="yr-first" id="yr-first">“${esc(firstLine())}”</p>
    </div>
    <p id="hero-sub" class="hidden"></p><p id="hero-caption" class="hidden"></p>`;
  /* 룸미러 맞추기: 좌우로 끌면 각도가 바뀌고, 가운데에 오면 눈이 맞는다 */
  const mir = $('yr-mirror'), img = mir.querySelector('.img');
  let a = RM ? 0 : (Y.hash(Y.today) % 2 ? 10 : -10), aligned = RM;
  const paint = () => {
    mir.style.transform = `rotate(${(a * .5).toFixed(2)}deg)`;
    img.style.transform = `translateX(${(a * 2.4).toFixed(1)}%) scale(1.25)`;
    img.style.filter = `blur(${Math.min(6, Math.abs(a) * .55).toFixed(2)}px) brightness(${(1 - Math.min(.45, Math.abs(a) * .035)).toFixed(3)})`;
    mir.setAttribute('aria-valuenow', Math.round(a));
  };
  const lock = () => {
    if (aligned) return; aligned = true; a = 0; paint();
    mir.classList.add('ok'); $('yr-mhint').textContent = MI.aligned || ''; $('yr-mhint').classList.add('ok');
    if (!RM) setTimeout(() => say('…뭘 봐. 앞 봐.'), 600);
  };
  $('yr-mhint').textContent = aligned ? (MI.aligned || '') : (a > 0 ? '← ' + (MI.hint || '') : (MI.hint || '') + ' →');
  paint(); if (aligned) { mir.classList.add('ok'); $('yr-mhint').textContent = MI.aligned || ''; $('yr-mhint').classList.add('ok'); }
  let drag = null;
  mir.addEventListener('pointerdown', e => { if (aligned) return; drag = { x: e.clientX, a }; mir.setPointerCapture(e.pointerId); mir.classList.add('grab'); });
  mir.addEventListener('pointermove', e => { if (!drag) return; a = Math.max(-12, Math.min(12, drag.a + (e.clientX - drag.x) * .09)); paint(); if (Math.abs(a) < 1.4) { drag = null; lock(); } });
  const up = () => { if (drag && Math.abs(a) < 4) lock(); drag = null; mir.classList.remove('grab'); };
  mir.addEventListener('pointerup', up); mir.addEventListener('pointercancel', up);
  mir.addEventListener('keydown', e => { if (aligned) return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { e.preventDefault(); a += e.key === 'ArrowLeft' ? -2 : 2; a = Math.max(-12, Math.min(12, a)); paint(); if (Math.abs(a) < 1.4) lock(); } });
  /* 손을 대지 않으면 3.6초 뒤 살짝 흔들어 알려 줌 */
  if (!aligned && !RM) document.addEventListener('archive:enter', () => setTimeout(() => { if (!aligned) mir.classList.add('nudge'); }, 3600), { once: true });
}

/* ── 2. 계기판 ── */
const DS = K.dash || {};
const dash = el('section', 'yr-sec yr-dash fade-up'); dash.setAttribute('data-page', '1');
const arc = (v, cls) => { const r = 26, c = Math.PI * r, f = Math.max(0, Math.min(1, v)); return `<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M6 34a26 26 0 0 1 52 0" class="tr"/><path d="M6 34a26 26 0 0 1 52 0" class="lit ${cls || ''}" style="stroke-dasharray:${(c * f).toFixed(1)} ${c.toFixed(1)}"/><g class="nd" style="transform:rotate(${(-90 + 180 * f).toFixed(1)}deg)"><line x1="32" y1="34" x2="32" y2="12"/><circle cx="32" cy="34" r="2.6"/></g></svg>`; };
function fuelV() { if (Y.mode !== 'night') return .86; const h = (Y.hour + 24 - 19) % 24; return Math.max(.08, .9 - h * .09); }
function waitSec() {
  const d = new Date(); if (Y.q.get('hour') != null) d.setHours(Y.hour, 10, 0);
  const st = new Date(d); st.setHours(19, 0, 0, 0); if (d.getHours() < 19) st.setDate(st.getDate() - 1);
  return Math.max(0, Math.floor((d - st) / 1000));
}
function paintDash() {
  const f = fuelV(), r = s.rate || 3, w = !!s.jealous, win = Y.winter();
  const fw = (DS.fuelWords || [])[f < .3 ? 0 : f < .6 ? 1 : 2];
  dash.innerHTML = `
    <div class="yr-head"><p class="label">${esc(DS.label)}</p><h2 class="yr-h">${two(DS.title)}</h2></div>
    <div class="yr-gauges">
      <div class="yr-g"><p class="k">${esc(DS.fuel)}</p>${arc(f)}<b>${esc(fw)}</b></div>
      <div class="yr-g"><p class="k">${esc(DS.speed)}</p>${arc(r / 5)}<b>${esc((DS.speedWords || {})[r] || '')}</b></div>
      <div class="yr-g${w ? ' warn' : ''}"><p class="k">${esc(DS.warn)}</p><svg viewBox="0 0 64 40" aria-hidden="true" class="lamp"><circle cx="32" cy="21" r="13"/><path d="M32 13v10M32 28v1.5"/></svg><b>${esc((DS.warnWords || [])[w ? 1 : 0])}</b></div>
    </div>
    <div class="yr-odo">
      <div><span class="k">${esc(DS.trip)}</span><b>${Y.n}<small>번째</small></b></div>
      <div><span class="k">${esc(DS.wait)}</span><b id="yr-wait">${Y.mode === 'day' ? `<small style="font-size:.62em">${esc(DS.dayShift)}</small>` : '--:--:--'}</b></div>
      <div><span class="k">${esc(DS.winter)}</span><b>${win === 0 ? `<small style="font-size:.62em">${esc(DS.winterDay)}</small>` : `D-${win}`}</b></div>
    </div>
    <p class="yr-tag">${esc(DS.noCall)}</p>`;
}
paintDash();
if (hero) hero.after(dash); reveal(dash);
if (Y.mode !== 'day') {
  const tick = () => { const w = $('yr-wait'); if (!w) return; const v = waitSec(); w.textContent = `${n2(Math.floor(v / 3600))}:${n2(Math.floor(v / 60) % 60)}:${n2(v % 60)}`; };
  tick(); setInterval(tick, 1000);
}

/* ── 3. 세계관 제목 ── */
const wl = $('world-label');
if (wl && P.worldTitle) wl.after(el('h2', 'yr-h yr-world', two(P.worldTitle)));

/* ── 4. 내비 ── */
const NV = K.navi;
if (NV) {
  const box = put(sec('yr-navi', NV));
  const pins = NV.pins || [];
  const home = pins.find(p => p.home) || pins[0];
  const routeVia = 'M12 92 C 22 80, 26 64, 33 48 S 36 26, 33 22 S 58 30, 66 28 S 82 24, 80 26';
  const routeAvoid = 'M12 92 C 30 86, 44 74, 52 62 S 64 46, 70 38 S 78 28, 80 26';
  box.insertAdjacentHTML('beforeend', `
    <div class="yr-map" id="yr-map">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="river" d="M-5 40 C 15 34, 30 50, 50 46 S 80 30, 105 36 L 105 50 C 80 44, 62 60, 50 60 S 18 48, -5 54 Z"/>
        <path class="rd big" d="M-5 30 C 30 26, 60 24, 105 20"/>
        <path class="rd" d="M8 0 L 14 100M30 0 C 32 40, 26 70, 30 100M58 0 L 54 100M78 0 C 74 40, 82 70, 76 100M-5 72 L 105 66M-5 86 C 40 80, 70 92, 105 84M-5 12 L 105 8"/>
        <path class="br" d="M26 36 L 28 58M60 34 L 58 56M84 30 L 86 50"/>
        <path class="route" id="yr-route" d="${routeVia}" pathLength="100"/>
        <circle class="me" cx="12" cy="92" r="1.6"/>
      </svg>
      ${pins.map((p, i) => `<button type="button" class="yr-pin${p.home ? ' home' : ''}" data-pin="${i}" style="left:${p.x}%;top:${p.y}%" aria-label="${esc(p.name)}"><i>${p.home ? '★' : ''}</i><span>${esc(p.name)}</span></button>`).join('')}
      <p class="yr-reroute" id="yr-reroute" aria-live="polite"></p>
    </div>
    <form class="yr-dest" id="yr-dest" autocomplete="off"><input type="text" id="yr-dest-in" maxlength="20" placeholder="${esc(NV.ph)}" aria-label="${esc(NV.ph)}"><button type="submit" class="btn solid">${esc(NV.btn)}</button></form>
    <div class="yr-pincard" id="yr-pincard" hidden></div>`);
  const card = $('yr-pincard');
  const showPin = i => {
    const p = pins[i]; if (!p) return;
    box.querySelectorAll('.yr-pin').forEach(b => b.classList.toggle('on', +b.dataset.pin === i));
    card.innerHTML = `<figure><img src="${esc(p.img)}" alt="" loading="lazy" onerror="this.parentNode.remove()"></figure><div><p class="label">PIN ${n2(i + 1)}</p><h3>${esc(p.name)}</h3><p>${esc(p.text)}</p></div>`;
    card.hidden = false; card.classList.remove('show'); requestAnimationFrame(() => requestAnimationFrame(() => card.classList.add('show')));
  };
  box.querySelector('#yr-map').addEventListener('click', e => { const b = e.target.closest('[data-pin]'); if (b) showPin(+b.dataset.pin); });
  const route = $('yr-route'), rr = $('yr-reroute');
  $('yr-dest').addEventListener('submit', e => {
    e.preventDefault();
    const v = $('yr-dest-in').value.trim(); if (!v) { $('yr-dest-in').focus(); return; }
    s.reroute = (s.reroute || 0) + 1; Y.save();
    const give = s.reroute >= 4;
    route.setAttribute('d', give ? routeAvoid : routeVia);
    route.classList.remove('draw'); void route.getBoundingClientRect(); route.classList.add('draw');
    rr.innerHTML = `<b>${esc(NV.reroute)}</b><span>“${esc(give ? NV.giveUp : NV.lines[(s.reroute - 1) % NV.lines.length])}”</span>`;
    rr.classList.add('show');
    if (!give && home) setTimeout(() => showPin(pins.indexOf(home)), RM ? 0 : 900);
  });
}

/* ── 5. 카오디오 ── */
const AU = K.audio;
if (AU) {
  const hasBgm = !!((D.config || {}).bgm), hasTheme = !!(((D.characters || {}).char1 || {}).music);
  const chs = (AU.channels || []).filter(c => c.act === 'bgm' ? hasBgm : c.act === 'theme' ? hasTheme : true);
  const box = put(sec('yr-audio', AU));
  box.insertAdjacentHTML('beforeend', `
    <div class="yr-radio">
      <div class="yr-lcd"><p class="fm" id="yr-fm"></p><p class="nm" id="yr-nm"></p><p class="ds" id="yr-ds"></p></div>
      <div class="yr-ctl">
        <button type="button" class="yr-step" id="yr-prev" aria-label="이전 채널">◀</button>
        <div class="yr-knob" id="yr-knob" role="slider" tabindex="0" aria-label="주파수 다이얼"><i></i></div>
        <button type="button" class="yr-step" id="yr-next" aria-label="다음 채널">▶</button>
      </div>
      <button type="button" class="btn solid block" id="yr-tune">이 채널 듣기</button>
      <label class="yr-vol"><span class="label">${esc(AU.vol)}</span><input type="range" id="yr-vol" min="0" max="10" value="4"><b id="yr-volv">4</b></label>
    </div>`);
  let ci = 0, knob = 0;
  const paintCh = () => { const c = chs[ci]; $('yr-fm').innerHTML = `<small>FM</small>${esc(c.fm)}`; $('yr-nm').textContent = c.name; $('yr-ds').textContent = c.desc; $('yr-knob').style.transform = `rotate(${knob}deg)`; };
  const stepCh = d => { ci = (ci + d + chs.length) % chs.length; knob += d * 36; paintCh(); };
  paintCh();
  $('yr-prev').onclick = () => stepCh(-1); $('yr-next').onclick = () => stepCh(1);
  $('yr-knob').addEventListener('keydown', e => { if (e.key === 'ArrowLeft') stepCh(-1); if (e.key === 'ArrowRight') stepCh(1); });
  { let dx = null; const k = $('yr-knob');
    k.addEventListener('pointerdown', e => { dx = e.clientX; k.setPointerCapture(e.pointerId); });
    k.addEventListener('pointermove', e => { if (dx == null) return; if (Math.abs(e.clientX - dx) > 28) { stepCh(e.clientX > dx ? 1 : -1); dx = e.clientX; } });
    k.addEventListener('pointerup', () => { dx = null; }); k.addEventListener('pointercancel', () => { dx = null; }); }
  $('yr-tune').onclick = () => {
    const c = chs[ci];
    if (c.act === 'profile') { const b = document.querySelector('#character-grid [data-id]'); if (b) b.click(); }
    else if (c.act === 'gallery') { const b = document.querySelector('[data-goto="2"]'); if (b) b.click(); }
    else if (c.act === 'bgm') API.setBgm(true);
    else if (c.act === 'theme') { const b = document.querySelector('#character-grid [data-id]'); if (b) b.click(); }
  };
  let jl = 0;
  $('yr-vol').addEventListener('input', e => {
    const v = +e.target.value; $('yr-volv').textContent = v;
    if (v >= 8 && !e.target.dataset.hot) {
      e.target.dataset.hot = '1';
      if (!s.jealous) { s.jealous = true; Y.save(); paintDash(); }
      say(AU.jealous[jl++ % AU.jealous.length]);
    }
    if (v < 7) delete e.target.dataset.hot;
  });
}

/* ── 6. 휴대폰 거치대 ── */
const PH = K.phone;
if (PH) {
  const box = put(sec('yr-phone', PH));
  const nowT = () => { const d = new Date(); return `${n2(d.getHours())}:${n2(d.getMinutes())}`; };
  box.insertAdjacentHTML('beforeend', `
    <div class="yr-dev">
      <div class="yr-scr">
        <div class="yr-sb"><span>${nowT()}</span><span class="r"><i></i><i></i><i></i></span></div>
        <div class="yr-tabs" role="tablist">${PH.tabs.map((t, i) => `<button type="button" role="tab" data-tab="${i}" class="${i ? '' : 'on'}" aria-selected="${!i}">${esc(t)}</button>`).join('')}</div>
        <div class="yr-pane" id="yr-pane"></div>
        <div class="yr-dlg" id="yr-dlg" hidden></div>
        <p class="yr-toast" id="yr-toast"></p>
      </div>
    </div>
    <p class="yr-say" id="yr-psay" aria-live="polite"></p>`);
  const pane = $('yr-pane'), psay = $('yr-psay');
  const line = t => { psay.textContent = t ? `“${t}”` : ''; psay.classList.remove('show'); if (t) requestAnimationFrame(() => requestAnimationFrame(() => psay.classList.add('show'))); };
  const toast = t => { const e = $('yr-toast'); e.textContent = t; e.classList.add('show'); setTimeout(() => e.classList.remove('show'), 2200); };
  let calls = 0;
  const tabs = {
    0() {
      pane.innerHTML = `<div class="yr-fav">
        <div class="av" style="background-image:url('assets/portrait.jpg')"></div>
        <p class="star">★</p><h3>${esc(PH.fav.name)}</h3><p class="meta">${esc(PH.fav.meta.replace('{n}', Y.n))}</p>
        <div class="acts"><button type="button" class="btn solid" id="yr-call">${esc(PH.fav.call)}</button><button type="button" class="btn ghost" id="yr-del">${esc(PH.fav.del)}</button></div></div>`;
      $('yr-call').onclick = () => line(PH.callLines[calls++ % PH.callLines.length]);
      $('yr-del').onclick = () => {
        const dl = $('yr-dlg');
        dl.innerHTML = `<div class="box"><b>${esc(PH.dlg.title)}</b><p>${esc(PH.dlg.sub)}</p><div class="r"><button type="button" id="yr-no">${esc(PH.dlg.no)}</button><button type="button" class="dg" id="yr-yes">${esc(PH.dlg.yes)}</button></div></div>`;
        dl.hidden = false;
        $('yr-no').onclick = () => { dl.hidden = true; line(PH.cancelLine); };
        $('yr-yes').onclick = () => {
          dl.innerHTML = `<div class="box"><p class="spin">${esc(PH.deleting)}</p></div>`;
          setTimeout(() => { dl.hidden = true; toast(PH.failed); s.del = (s.del || 0) + 1; Y.save(); line(PH.delLines[Math.min(s.del, PH.delLines.length) - 1]); }, RM ? 200 : 1300);
        };
      };
    },
    1() {
      const k = Math.max(3, Math.min(PH.memos.length, Y.n - 4)), d = new Date();
      const rows = PH.memos.slice(0, k).map((m, i) => { const t = new Date(d); t.setDate(d.getDate() - (k - 1 - i) * 3); return [`${n2(t.getMonth() + 1)}.${n2(t.getDate())}`, m]; }).reverse();
      pane.innerHTML = `<div class="yr-memo"><p class="hd"><b>📝 ${esc(PH.memoHead)}</b><small>${esc(PH.memoNote)}</small></p><ul>${rows.map(([dt, m]) => `<li><span>${dt}</span><p>${esc(m)}</p></li>`).join('')}</ul></div>`;
    },
    2() {
      const F = PH.fare;
      pane.innerHTML = `<div class="yr-fare"><p class="hd">${esc(F.head)} <small>CALL Nº ${n2(Y.n)}</small></p>
        <table>${F.rows.map(r => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('')}<tr class="dc"><td>${esc(F.discount[0])}</td><td>${esc(F.discount[1])}</td></tr><tr class="tt"><td>${esc(F.total[0])}</td><td>${esc(F.total[1])}</td></tr></table>
        <p class="nt">${esc(F.note)}</p>
        <div class="rate"><p>${esc(F.rate)}</p><div class="st" id="yr-stars">${[1, 2, 3, 4, 5].map(v => `<button type="button" data-r="${v}" aria-label="별 ${v}개" class="${v <= (s.rate || 0) ? 'on' : ''}">★</button>`).join('')}</div></div></div>`;
      if (!RM) pane.querySelectorAll('tr').forEach((t, i) => { t.style.opacity = 0; t.style.transform = 'translateY(6px)'; setTimeout(() => { t.style.opacity = ''; t.style.transform = ''; }, 140 * i + 120); });
      $('yr-stars').onclick = e => {
        const b = e.target.closest('[data-r]'); if (!b) return; const v = +b.dataset.r;
        s.rate = v; Y.save(); $('yr-stars').querySelectorAll('button').forEach(x => x.classList.toggle('on', +x.dataset.r <= v));
        line(F.rateLines[v]); paintDash();
      };
    },
    3() {
      const C = PH.chat;
      pane.innerHTML = `<div class="yr-chat"><div class="hd"><div class="av" style="background-image:url('assets/portrait.jpg')"></div><div><b>${esc(C.name)}</b><small>${esc(C.sub)}</small></div></div>
        <div class="log" id="yr-log">${C.log.map(m => m.length === 1 ? `<p class="dt">${esc(m[0])}</p>` : `<p class="b ${m[0]}">${esc(m[1])}</p>`).join('')}
        <p class="rd">${esc(C.read)}</p><p class="gap">${esc(C.gap)}</p><p class="b y typing" aria-label="입력 중"><i></i><i></i><i></i></p></div></div>`;
      const lg = $('yr-log'); lg.scrollTop = lg.scrollHeight;
    }
  };
  const open = i => { box.querySelectorAll('[data-tab]').forEach(b => { const on = +b.dataset.tab === i; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }); $('yr-dlg').hidden = true; line(''); tabs[i](); };
  box.querySelector('.yr-tabs').addEventListener('click', e => { const b = e.target.closest('[data-tab]'); if (b) open(+b.dataset.tab); });
  open(0);
}

/* ── 7. 글로브박스 ── */
const GB = K.glove;
if (GB) {
  const box = put(sec('yr-glove', GB));
  box.insertAdjacentHTML('beforeend', `
    <div class="yr-gbox" id="yr-gbox">
      <button type="button" class="lid" id="yr-lid"><span>${esc(GB.open)}</span></button>
      <div class="in">${GB.items.map((it, i) => `<button type="button" data-gi="${i}"><span class="ic">${it.img ? `<img src="${esc(it.img)}" alt="" loading="lazy">` : (ICON[it.key] || '')}</span><span class="nm">${esc(it.name)}</span></button>`).join('')}</div>
    </div>
    <div class="yr-gcard" id="yr-gcard" hidden></div>`);
  const gb = $('yr-gbox'), gc = $('yr-gcard');
  $('yr-lid').onclick = () => gb.classList.add('open');
  if (RM) gb.classList.add('open');
  gb.querySelector('.in').addEventListener('click', e => {
    const b = e.target.closest('[data-gi]'); if (!b) return; const it = GB.items[+b.dataset.gi];
    gb.querySelectorAll('[data-gi]').forEach(x => x.classList.toggle('on', x === b));
    let extra = '';
    if (it.key === 'card') extra = `<div class="yr-file"><p class="fn">${esc(it.file)}</p><div class="pl"><button type="button" id="yr-play" aria-label="재생">▶</button><span class="bar"><i></i></span><span class="tm">00:00 / 00:34</span></div><p class="lk" id="yr-lk">${esc(it.locked)}</p><ol class="yr-log" id="yr-log34"></ol><p class="yr-after" id="yr-after" hidden>${esc(it.after || '')}</p></div>`;
    if (it.key === 'candy') extra = `<ul class="yr-facts">${it.facts.map(f => `<li>${esc(f)}</li>`).join('')}</ul>`;
    if (it.key === 'ticket') extra = `<button type="button" class="btn" id="yr-story">${esc(it.more)}</button>`;
    gc.innerHTML = `<span class="ic${it.img ? ' ph' : ''}">${it.img ? `<img src="${esc(it.img)}" alt="${esc(it.name)}">` : (ICON[it.key] || '')}</span><div><h3>${esc(it.name)}</h3><p>${esc(it.desc)}</p>${extra}</div>`;
    gc.hidden = false; gc.classList.remove('show'); requestAnimationFrame(() => requestAnimationFrame(() => gc.classList.add('show')));
    if ($('yr-play')) $('yr-play').onclick = () => {
      const pb = $('yr-play'); if (pb.classList.contains('no')) return; pb.classList.add('no');
      const L = it.log || [], ol = $('yr-log34'), bar = gc.querySelector('.bar i'), tm = gc.querySelector('.tm'); $('yr-lk').hidden = true;
      const sec = t => +t.slice(0, 2) * 60 + +t.slice(3);
      L.forEach(([t, line], i) => setTimeout(() => {
        ol.insertAdjacentHTML('beforeend', `<li><span>${esc(t)}</span>${esc(line)}</li>`);
        bar.style.width = (sec(t) / 34 * 100) + '%'; tm.textContent = `${t} / 00:34`;
        if (i === L.length - 1) { $('yr-after').hidden = false; setTimeout(() => say(it.play), RM ? 0 : 600); }
      }, RM ? 0 : i * 1100));
    };
    if ($('yr-story')) $('yr-story').onclick = () => {
      const c = document.querySelector('#character-grid [data-id]'); if (!c) return; c.click();
      setTimeout(() => { const d = document.querySelector('#modal-story'); if (!d) return; const det = d.closest('details'); if (det) det.open = true; const sc = $('modal-scroll'); if (sc) sc.scrollTo({ top: d.parentNode.offsetTop - 80, behavior: RM ? 'auto' : 'smooth' }); }, 420);
    };
  });
}

/* ── 8. 경적 · 시트 · 컵홀더 ── */
const SE = K.seat;
if (SE) {
  const box = put(sec('yr-seat', SE));
  const heard = () => s.horn.length;
  box.insertAdjacentHTML('beforeend', `
    <div class="yr-trio">
      <div class="yr-card yr-horn">
        <button type="button" class="wheel" id="yr-horn" aria-label="${esc(SE.horn)}"><svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52"/><circle cx="60" cy="60" r="40" class="in"/><path d="M8 60h32M80 60h32M60 76v36"/></svg><span>${esc(SE.horn)}</span></button>
        <p class="ln" id="yr-hline" aria-live="polite"></p><p class="ct" id="yr-hct">${esc(SE.hornCount.replace('{n}', heard()))}</p>
      </div>
      <div class="yr-card yr-seatc">
        <p class="label">${esc(SE.seatLabel)}</p>
        <div class="rail"><input type="range" id="yr-seat" min="1" max="8" value="3" aria-label="${esc(SE.seatLabel)}"><div class="ticks">${[1, 2, 3, 4, 5, 6, 7, 8].map(v => `<i>${v}</i>`).join('')}</div></div>
        <p class="hint">${esc(SE.seatHint)}</p><p class="ln" id="yr-sline" aria-live="polite"></p>
        <figure class="yr-secret" id="yr-secret" hidden><img src="${esc(SE.seatImg)}" alt="가까이서 눈이 마주친 한여로" loading="lazy"><figcaption>SEAT · ${SE.seatOld}</figcaption></figure>
      </div>
      <div class="yr-card yr-cup">
        <div class="hold" id="yr-hold" aria-hidden="true"></div>
        <button type="button" class="btn solid" id="yr-coffee"></button>
        <p class="ln" id="yr-cline" aria-live="polite"></p><p class="ct" id="yr-cct"></p>
      </div>
    </div>`);
  $('yr-horn').onclick = () => {
    const L = SE.hornLines; let i = L.findIndex((_, k) => !s.horn.includes(k)); if (i < 0) i = Math.floor(Math.random() * L.length);
    if (!s.horn.includes(i)) s.horn.push(i);
    s.hornToday = (s.hornToday || 0) + 1; Y.save(); paintDash();
    $('yr-hline').textContent = `“${L[i]}”`; $('yr-hct').textContent = SE.hornCount.replace('{n}', heard());
    const w = $('yr-horn'); w.classList.remove('hit'); void w.offsetWidth; w.classList.add('hit');
  };
  const seat = $('yr-seat'), sl = $('yr-sline'), sct = $('yr-secret');
  if (s.seatFound) sct.hidden = false;
  seat.addEventListener('input', () => {
    const v = +seat.value, L = SE.seatLines;
    sl.textContent = v === SE.seatOld ? `“${L.old}”` : v <= 2 ? `“${L.near}”` : v >= 8 ? `“${L.far}”` : '';
    if (v === SE.seatOld) { sct.hidden = false; requestAnimationFrame(() => sct.classList.add('show')); if (!s.seatFound) { s.seatFound = true; Y.save(); } }
  });
  if (s.seatFound) sct.classList.add('show');
  const paintCup = () => {
    const c = s.coffee.length, gave = s.coffee.includes(Y.today);
    $('yr-hold').innerHTML = Array.from({ length: 7 }, (_, i) => `<i class="${i < Math.min(c, 7) ? 'on' : ''}"></i>`).join('');
    $('yr-coffee').textContent = gave ? SE.coffeeDone : SE.coffee; $('yr-coffee').disabled = gave;
    $('yr-cct').textContent = SE.coffeeCount.replace('{n}', c);
  };
  paintCup();
  $('yr-coffee').onclick = () => {
    if (s.coffee.includes(Y.today)) return;
    s.coffee.push(Y.today); s.coffee = s.coffee.slice(-60); Y.save();
    const c = s.coffee.length, L = SE.coffeeLines[c] || pick(SE.coffeeAfter, Y.today);
    $('yr-cline').textContent = `“${L}”`; paintCup();
  };
}

/* ── 9. 비 오는 밤 앞유리 ── */
const RA = K.rain;
if (RA) {
  const box = put(sec('yr-rain', Object.assign({}, RA, { sub: Y.rain ? RA.sub : '' })));
  if (!Y.rain) {
    box.insertAdjacentHTML('beforeend', `<div class="yr-wind dry"><img src="${esc(RA.img)}" alt="" loading="lazy"><p>${esc(RA.dry)}</p></div>`);
  } else {
    box.insertAdjacentHTML('beforeend', `<div class="yr-wind" id="yr-wind"><img src="${esc(RA.img)}" alt="" loading="lazy"><canvas id="yr-fog" aria-label="김 서린 앞유리"></canvas><button type="button" class="btn" id="yr-wiper">${esc(RA.wiper)}</button></div><p class="yr-say" id="yr-rsay" aria-live="polite"></p>`);
    const cv = $('yr-fog'), w = $('yr-wind'), g = cv.getContext('2d');
    let pts = 0, said = 0;
    const size = () => { const r = w.getBoundingClientRect(), k = Math.min(2, devicePixelRatio || 1); cv.width = r.width * k; cv.height = r.height * k; g.setTransform(k, 0, 0, k, 0, 0); fog(1); };
    const fog = a => {
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = a;
      const r = w.getBoundingClientRect(), gr = g.createLinearGradient(0, 0, 0, r.height);
      gr.addColorStop(0, night ? 'rgba(160,178,205,.86)' : 'rgba(236,240,246,.88)'); gr.addColorStop(1, night ? 'rgba(120,140,170,.9)' : 'rgba(220,228,238,.9)');
      g.fillStyle = gr; g.fillRect(0, 0, r.width, r.height);
      g.globalAlpha = a * .5; for (let i = 0; i < 140; i++) { g.fillStyle = 'rgba(255,255,255,.55)'; g.beginPath(); g.arc(Math.random() * r.width, Math.random() * r.height, Math.random() * 1.8 + .4, 0, 7); g.fill(); }
      g.globalAlpha = 1;
    };
    size(); addEventListener('resize', size);
    let down = false, last = null;
    const pt = e => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const draw = p => {
      g.globalCompositeOperation = 'destination-out'; g.lineCap = 'round'; g.lineWidth = 22; g.strokeStyle = '#000';
      g.beginPath(); g.moveTo(...(last || p)); g.lineTo(...p); g.stroke(); last = p; pts++;
      if (pts > 60 && said === 0) { said = 1; rs(RA.lines[0]); } else if (pts > 220 && said === 1) { said = 2; rs(RA.lines[1]); }
    };
    const rs = t => { const e = $('yr-rsay'); e.textContent = `“${t}”`; e.classList.remove('show'); requestAnimationFrame(() => requestAnimationFrame(() => e.classList.add('show'))); };
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', e => { down = true; last = null; cv.setPointerCapture(e.pointerId); draw(pt(e)); });
    cv.addEventListener('pointermove', e => { if (down) draw(pt(e)); });
    const up = () => { down = false; last = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
    setInterval(() => { if (!down && !document.hidden) fog(.035); }, 1400);
    $('yr-wiper').onclick = () => { g.clearRect(0, 0, cv.width, cv.height); w.classList.remove('wipe'); void w.offsetWidth; w.classList.add('wipe'); setTimeout(() => fog(.55), RM ? 0 : 1600); };
  }
}

/* ── 10. 34초 머물기 ── */
const ST = K.stay;
if (ST) {
  let sec34 = 0;
  document.addEventListener('archive:enter', () => {
    setInterval(() => {
      if (document.hidden || !hero || hero.classList.contains('page-hidden')) { sec34 = 0; return; }
      if (++sec34 === 34 && !s.stayed) { s.stayed = true; Y.save(); say(ST.line, { hold: 7200 }); }
    }, 1000);
  });
}

/* 사진 없는 기록 팝업 소지품 칸에 그림 아이콘 */
const ch = (D.characters || {}).char1;
if (ch && ch.items) { const keys = ['log', 'card', 'candy', 'ticket']; ch.items.forEach((it, i) => { if (!it.img && !it.icon) it.icon = ICON[keys[i]] || ''; }); }

/* 들어온 직후 첫마디를 말풍선으로도 */
/* 첫마디는 표지에 이미 크게 나오므로 말풍선으로 되풀이하지 않는다 (11-08) */
})();
