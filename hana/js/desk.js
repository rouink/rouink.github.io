/* 엄하나 — 교무실 (1페이지) (hana 전용 · shared 파일을 고치지 않음)
   출근/퇴근 스위치 · 모드별 표지 · 들킬 위험 % / 거리 · 규칙 셋(뒤집힘) · 포스트잇 암호 · 오늘의 포스트잇 · 교무수첩 맨 뒷장(D-day)
   data.js page.desk 에 값을 적으면 켜져요. 상태는 js/state.js (window.HANA). */
(() => {
const D = window.ARCHIVE || {}, P = D.page || {}, K = P.desk, API = window.ARCHIVE_API, H = window.HANA;
if (!K || !API || !H) return;
const C = (D.characters || {}).char1 || {};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const $ = id => document.getElementById(id);
const say = (t, hold) => t && API.say && API.say(t, { by: C.name || '', hold: hold || 4200 });
const R = K.risk || {}, L = K.lines || {}, CODE = K.code || {}, PL = K.planner || {};
const NOTES = K.notes || [];
const note = NOTES.length ? NOTES[H.noteIndex(NOTES.length)] : ['', ''];
const dday = H.dday(PL.date);

/* shared 표지 칸은 이 작품에서 숨김 (교무실이 대신함) */
if ($('hero')) $('hero').classList.add('hd-gone');
if (!C.themeTitle && $('page-song')) $('page-song').classList.add('hd-gone');
const msong = document.querySelector('.m-song'); if (msong && !C.music) msong.classList.add('hd-gone');

const heroOf = () => H.weekend && K.hero.weekend ? K.hero.weekend : (H.isSchool() ? K.hero.school : K.hero.off);
const modeName = () => (K.modeName || {})[H.mode] || '';
const stamp = () => `${H.dayName} ${H.clock} · ${(K.place || {})[H.mode] || ''} · <b>${esc(modeName())}</b>`;

const sec = document.createElement('section');
sec.dataset.page = '1'; sec.className = 'hd'; sec.id = 'hd';
const hs = K.hero.school || {}, ho = K.hero.off || {};
sec.innerHTML = `
<div class="hd-bar" id="hd-bar">
  <div class="st"><i></i><span id="hd-stamp">${stamp()}</span></div>
  <div class="sw" role="group" aria-label="출근 / 퇴근">
    <button type="button" data-mode="school" aria-pressed="${H.isSchool()}">${esc((K.switchLabel || [])[0] || '출근')}</button>
    <button type="button" data-mode="off" aria-pressed="${!H.isSchool()}">${esc((K.switchLabel || [])[1] || '퇴근')}</button>
  </div>
</div>
<div class="hd-hero" id="hd-hero">
  <img class="im school" alt="">
  <img class="im off" alt="" loading="lazy">
  <span class="big" aria-hidden="true" id="hd-big">1m</span>
  <div class="t" id="hd-t"></div>
</div>
<div class="hd-wrap">
  <div class="hd-card hd-risk" id="hd-risk"></div>
  <div class="hd-sec" id="hd-rules"></div>
  <div class="hd-sec" id="hd-code"></div>
  <div class="hd-sec" id="hd-plan"></div>
</div>`;
const first = document.querySelector('main > section');
first.parentNode.insertBefore(sec, first);

/* ── 그리기 ── */
const PC = matchMedia('(min-width:1100px)');
function setImg(el, h) { if (!el || !h) return; const src = PC.matches && h.pcImg ? h.pcImg : h.img; if (el.getAttribute('src') !== src) el.src = src; el.style.setProperty('--pos', h.pos || '50% 20%'); el.style.setProperty('--pcpos', (PC.matches && h.pcImg ? h.pcPos : (h.pcPos || h.pos)) || '50% 20%'); }
function paintHero() {
  const h = heroOf();
  setImg(sec.querySelector('.hd-hero .im.school'), K.hero.school);
  setImg(sec.querySelector('.hd-hero .im.off'), H.weekend && K.hero.weekend ? K.hero.weekend : K.hero.off);
  $('hd-t').innerHTML = `<p class="label">${esc(h.label || '')}</p><h1 class="hd-title"><span>${esc((h.title || [])[0] || '')}</span><span>${esc((h.title || [])[1] || '')}</span></h1><p class="sub">${esc(h.sub || '')}</p>`;
  $('hd-big').textContent = H.isSchool() ? '1m' : '∞';
  sec.querySelectorAll('.hd-hero .im').forEach(im => im.classList.toggle('on', im.classList.contains(H.isSchool() ? 'school' : 'off')));
}
function paintRisk(anim) {
  const box = $('hd-risk');
  if (H.isSchool()) {
    const r = H.risk, ev = R.event || 80;
    box.className = 'hd-card hd-risk' + (r >= ev ? ' hot' : '');
    box.innerHTML = `<div class="top"><span class="label">${esc(R.label || '')}</span><b class="n"><span id="hd-rn">${r}</span><small>%</small></b></div>
      <div class="bar" role="img" aria-label="들킬 위험 ${r}%"><i id="hd-rb" style="width:${anim && !RM ? 0 : r}%"></i><u style="left:${ev}%"></u></div>
      <p>${esc(R.text || '')}</p>`;
    if (anim && !RM) requestAnimationFrame(() => requestAnimationFrame(() => { const b = $('hd-rb'); if (b) b.style.width = r + '%'; }));
  } else {
    box.className = 'hd-card hd-risk off';
    box.innerHTML = `<div class="top"><span class="label">${esc(R.distLabel || '')}</span><b class="n"><span>${esc(R.dist || '0.00')}</span><small>${esc(R.distUnit || 'm')}</small></b></div>
      <div class="bar zero"><i style="width:100%"></i></div><p>${esc(R.distText || '')}</p>`;
  }
}
function paintRules() {
  const r = (K.rules || {})[H.mode] || { title: '', list: [] };
  $('hd-rules').innerHTML = `<p class="label">${H.isSchool() ? 'Ⅰ · School rules' : 'Ⅰ · After six'}</p><h2 class="hd-h2">${esc(r.title)}</h2>
    <div class="hd-rules">${(r.list || []).map(([a, b], i) => `<div class="hd-rule"><b>0${i + 1}</b><div><span>${esc(a)}</span><small>${esc(b)}</small></div></div>`).join('')}</div>`;
}
function paintCode() {
  const sch = H.isSchool();
  $('hd-code').innerHTML = `<p class="label">Ⅱ · Post-it code</p><h2 class="hd-h2">${esc(CODE.title || '')}</h2><p class="hd-p">${esc((CODE.sub || {})[H.mode] || '')}</p>
    <div class="hd-notes">${(CODE.list || []).map(([s, m, en], i) => `<button type="button" class="pn" data-sym="${i}" style="--r:${[-2, 1.5, -1, 2][i % 4]}deg" aria-label="${esc(s)} ${sch ? '' : esc(m)}"><b>${esc(s)}</b><span class="mean">${sch ? `<i>${esc(CODE.hidden || '')}</i>` : esc(m)}</span><span class="en">${esc(en || '')}</span></button>`).join('')}</div>
    <div class="hd-today"><div class="np" aria-hidden="true"><b>${esc(note[1])}</b></div><div class="tx"><p class="label">${esc(K.todayLabel || '')} · ${esc(H.today.slice(5).replace('-', '.'))}</p><h3>"${esc(note[0])}"</h3><p>${sch ? `구석에 <b>${esc(note[1])}</b>. 뜻은 퇴근 뒤에.` : `구석의 <b>${esc(note[1])}</b>는, <b>${esc(((CODE.list || []).find(x => x[0] === note[1]) || [])[1] || '')}</b>`}</p></div></div>`;
}
function paintPlan() {
  const sch = H.isSchool();
  if (sch) { $('hd-plan').innerHTML = `<p class="label">Ⅲ · ${esc(PL.label || '')}</p><div class="hd-plan lock"><div><h3>${esc(PL.lockedTitle || '')}</h3><p>${esc(PL.lockedText || '')}</p></div><span class="pg" aria-hidden="true"></span></div>`; return; }
  const dd = dday == null ? '' : (dday > 0 ? `D<small>-${dday}</small>` : dday === 0 ? 'D<small>-day</small>' : `D<small>+${-dday}</small>`);
  $('hd-plan').innerHTML = `<p class="label">Ⅲ · ${esc(PL.label || '')}</p><div class="hd-plan"><p class="label">${esc(PL.title || '')}</p><b class="dd">${dd}</b><p class="rg">${esc(PL.range || '')}</p><p class="tx">${esc(PL.text || '')}</p><div class="pen" aria-hidden="true">${(PL.lines || []).map(l => `<span>${esc(l)}</span>`).join('')}</div></div>`;
}
function paintAll(anim) { paintHero(); paintRisk(anim); paintRules(); paintCode(); paintPlan(); $('hd-stamp').innerHTML = stamp(); sec.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.mode === H.mode))); }
paintAll(false);
if (PC.addEventListener) PC.addEventListener('change', paintHero);

/* ── 스위치 ── */
sec.querySelector('.sw').addEventListener('click', e => {
  const b = e.target.closest('[data-mode]'); if (!b || b.dataset.mode === H.mode) return;
  const toOff = b.dataset.mode === 'off';
  if (toOff && H.schoolHours) { H.addRisk(10, 'switch'); }
  H.setMode(b.dataset.mode, 'user');
  sec.classList.add('fx'); setTimeout(() => sec.classList.remove('fx'), RM ? 0 : 700);
  paintAll(true);
  say(toOff ? (H.schoolHours ? L.toOff : (L[H.slot()] || L.offEvening)) : L.toSchool);
});

/* ── 들킬 위험: 머물수록 오름 (출근 모드만) ── */
let fired = false;
H.on((k, v, why) => {
  if (k !== 'risk') return;
  const n = $('hd-rn'), b = $('hd-rb'); if (n) n.textContent = v; if (b) b.style.width = v + '%';
  const box = $('hd-risk'); if (box) box.classList.toggle('hot', v >= (R.event || 80));
  if (v >= (R.event || 80) && !fired && why !== 'set') {
    fired = true; say(R.eventLine, 5200);
    setTimeout(() => { H.setRisk(Math.max(R.start || 20, Math.round((R.event || 80) * .55))); say(R.after, 3600); fired = false; }, RM ? 1200 : 5600);
  }
});
const seen = new Set();
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting && !seen.has(x.target)) { seen.add(x.target); H.addRisk(2, 'scroll'); } }), { threshold: .35 }) : null;
if (io) document.querySelectorAll('main section, .hd-sec').forEach(el => io.observe(el));
document.addEventListener('click', e => {
  if (e.target.closest('.gitem')) H.addRisk(4, 'gallery');
  if (e.target.closest('#character-grid [data-id]')) H.addRisk(3, 'file');
});
sec.addEventListener('click', e => {
  const b = e.target.closest('.pn'); if (!b) return;
  if (H.isSchool()) {
    const m = ((CODE.list || [])[+b.dataset.sym] || [])[1] || '';
    b.classList.add('peek'); b.querySelector('.mean').innerHTML = esc(m);
    setTimeout(() => { if (H.isSchool()) { b.classList.remove('peek'); b.querySelector('.mean').innerHTML = `<i>${esc(CODE.hidden || '')}</i>`; } }, RM ? 1500 : 2600);
    H.addRisk(5, 'peek');
    if (!H.flag('peeked')) { H.mark('peeked'); say(L.noteFound); }
  } else { b.classList.toggle('peek'); }
});

/* ── 들어온 뒤 ── */
document.addEventListener('archive:enter', () => {
  setTimeout(() => say(L[H.slot()] || ''), RM ? 300 : 1700);
}, { once: true });
})();
