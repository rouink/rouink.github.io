/* 권세율 — 조사 장치 (audit 전용 · shared 파일을 고치지 않음)
   표지 한 줄 · 상태 줄(조사 n일차·오늘 요청 자료·커피·불신) · ① 커피 내밀기 · ③ 소명서 · ④ 관계 손익계산서
   · ⑤ 거꾸로 넘기는 메모 · ⑥ 3월 31일 · ⑦ 조사 종결 통지 (20일차부터)
   data.js page.audit 에 값을 적으면 켜져요. 상태는 js/state.js.
   미리보기: ?day=7 · ?coffee=6 · ?date=0331 · ?hour=23 */
(() => {
const D = window.ARCHIVE || {}, P = D.page || {}, A = P.audit, API = window.ARCHIVE_API, S = window.AUDIT_STORE;
if (!A || !API || !S) return;
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const br = t => esc(t).replace(/\n/g, '<br>');
const two = a => (a || []).filter(Boolean).map(t => `<span>${esc(t)}</span>`).join('');
const $ = id => document.getElementById(id);
const say = (t, o) => t && API.say && API.say(t, Object.assign({ by: A.by }, o || {}));
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const won = n => (n < 0 ? '(' : '') + Math.abs(Math.round(n)).toLocaleString('ko-KR') + (n < 0 ? ')' : '');
const s = S.s;
const guest = () => { const u = ($('username') && $('username').value.trim()) || ''; return u && u.toUpperCase() !== 'GUEST' ? u : ''; };
const hash = t => { let h = 2166136261; for (const c of String(t)) { h ^= c.codePointAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const copy = (t, done) => {
  const ok = () => done && done();
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, fb); else fb();
  function fb() { const a = document.createElement('textarea'); a.value = t; a.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); } catch {} a.remove(); ok(); }
};
const sec = (label, title, sub, img, cap) => el('section', 'au-sec fade-up', `<p class="label">${esc(label)}</p><h2 class="au-h">${two(title)}</h2>${sub ? `<p class="au-sub">${esc(sub)}</p>` : ''}${img ? `<figure class="au-fig"><img src="${esc(img)}" alt="" loading="lazy" onerror="this.parentNode.remove()">${cap ? `<figcaption>${esc(cap)}</figcaption>` : ''}</figure>` : ''}`);
const page1 = el => { el.setAttribute('data-page', '1'); return el; };
const IO = 'IntersectionObserver' in window && !RM ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); IO.unobserve(e.target); } }), { threshold: .08 }) : null;
const reveal = n => { if (IO) IO.observe(n); else n.classList.add('in'); return n; };

/* ── 1. 표지 한 줄 · 세계관 제목 ── */
const ht = $('hero-title');
if (ht && P.heroLine) { const l = el('p', 'au-line', two(P.heroLine)); (($('hero-sub') && !$('hero-sub').classList.contains('hidden')) ? $('hero-sub') : ht).after(l); }
const wl = $('world-label');
if (wl && P.worldTitle) wl.after(el('h2', 'au-world-title', two(P.worldTitle)));

/* ── 2. 상태 줄 ── */
const TOTAL = S.TOTAL, ST = A.status || {};
const dayN = S.day(), closed = dayN > TOTAL;
const req = (A.requests || [])[Math.min(dayN, TOTAL) - 1] || ['', ''];
const status = el('div', 'au-status');
function paintStatus() {
  const d = Math.min(S.day(), TOTAL);
  status.innerHTML = `
    <div><span class="k">${esc(ST.day || '조사')}</span><b>${closed ? esc(ST.closed || '조사 종결') : `${d}<small style="font-size:.6em;font-weight:700;color:var(--muted)"> / ${TOTAL}일차</small>`}</b></div>
    <div><span class="k">${esc(ST.coffee || '커피')}</span><b class="bl">${esc(S.coffeeLabel())}</b></div>
    <div><span class="k">${esc(ST.doubt || '불신')}</span><b>${S.doubt()}%</b></div>
    <div class="req"><span class="k">${esc(ST.request || '오늘 요청 자료')}</span><b>${esc(closed ? '없음' : req[0])}</b><p>${esc(closed ? '조사는 끝났어요. 그래도 오셨네요.' : '“' + req[1] + '”')}</p></div>
    <div class="bar" aria-hidden="true"><i style="width:${Math.min(100, Math.round(d / TOTAL * 100))}%"></i></div>`;
}
paintStatus();
const hero = $('hero');
if (hero) hero.after(page1(status));

/* ── 6. 3월 31일 ── */
const M = A.march31;
if (M && S.isM31()) {
  const m = page1(el('div', 'au-m31', `<span class="tag">${esc(M.tag)}</span><p>${esc(M.line)}</p>`));
  status.after(m);
}

/* 섹션들은 인용구 앞에 차례로 */
const anchor = $('page-quote');
const put = node => { page1(node); anchor ? anchor.before(node) : document.querySelector('main').appendChild(node); return reveal(node); };

/* ── ① 커피 내밀기 ── */
const C = A.coffee;
if (C) {
  const box = put(sec(C.label, C.title, C.sub, C.img, C.cap));
  const wrap = el('div', 'au-coffee');
  const cups = el('div', 'au-cup'); cups.setAttribute('aria-hidden', 'true');
  const sayP = el('p', 'say'); sayP.setAttribute('aria-live', 'polite');
  const btn = el('button', 'btn solid', ''); btn.type = 'button';
  const secret = el('div', 'au-secret');
  wrap.append(cups, btn, sayP, secret); box.appendChild(wrap);
  const need = C.acceptAfter || 7;
  const gave = () => s.refused.includes(S.today) || s.accepted === S.today || (s.gaveAfter || []).includes(S.today);
  function paint() {
    const n = S.refusedN(), acc = S.accepted();
    cups.innerHTML = Array.from({ length: need }, (_, i) => `<i class="${acc && i === need - 1 ? 'ok' : i < n ? 'r' : 'e'}"></i>`).join('');
    btn.textContent = gave() ? (C.btnDone || '오늘은 이미 내밀었어요') : (C.btn || '커피 내밀기');
    btn.disabled = gave();
    if (acc) {
      const sec2 = (D.characters.char1.gallery || []).find(g => g.secret) || {};
      secret.innerHTML = `<p class="tag">${esc(C.secretTag || 'UNLOCKED')}</p><img src="${esc(sec2.img || '')}" alt="커피를 받아 든 권세율" loading="lazy"><p>“${esc(C.accept)}”</p><small>${esc(C.secretBy || '')}</small>`;
      secret.style.display = '';
    } else secret.style.display = 'none';
  }
  paint();
  btn.addEventListener('click', () => {
    if (gave()) return;
    let line;
    if (S.accepted()) { s.gaveAfter = (s.gaveAfter || []).concat(S.today).slice(-30); const a = C.after || []; line = a[hash(S.today) % a.length]; }
    else if (S.isM31() || s.refused.length + 1 >= need) { s.accepted = S.today; line = S.isM31() && A.march31 ? A.march31.say : C.accept; }
    else { s.refused.push(S.today); line = (C.refuse || [])[s.refused.length - 1] || (C.refuse || [])[0]; }
    S.save(); sayP.textContent = line; paint(); paintStatus(); paintPL && paintPL();
  });
}

/* ── ③ 소명서 ── */
const PL = A.plea;
if (PL) {
  const box = put(sec(PL.label, PL.title, PL.sub, PL.img, PL.cap));
  const f = el('div', 'au-form');
  f.innerHTML = `
    <div class="fh"><b>소 명 서</b><span>DAY ${String(Math.min(dayN, TOTAL)).padStart(2, '0')} · ROOM 3</span></div>
    <div class="fb">
      <div class="au-in">
        <label class="au-field"><span class="k">소명인</span><input type="text" id="au-pn" maxlength="10" placeholder="${esc(PL.namePh || '')}" autocomplete="off"></label>
        <label class="au-field"><span class="k">소명 내용</span><textarea id="au-pt" maxlength="60" placeholder="${esc(PL.textPh || '')}"></textarea></label>
        <div class="au-row"><button type="button" class="btn solid" id="au-pb">${esc(PL.btn || '소명서 제출')}</button></div>
      </div>
      <div class="au-result" id="au-pr">
        <p class="what" id="au-pw"></p>
        <p class="line" id="au-pl"></p>
        <div class="au-row"><button type="button" class="btn" id="au-pa">${esc(PL.again || '다시 쓰기')}</button><button type="button" class="btn solid" id="au-pc">${esc(PL.copy || '기록 복사')}</button></div>
      </div>
      <p class="au-fine">${esc(PL.disclaimer || '')}</p>
    </div>
    <div class="au-seal" id="au-ps" aria-hidden="true"></div>`;
  box.appendChild(f);
  const nm = $('au-pn'), tx = $('au-pt');
  let last = null;
  $('au-pb').addEventListener('click', () => {
    const text = tx.value.trim();
    if (!text) { tx.focus(); tx.placeholder = '한 줄이라도 적어 주세요. 소명은 말로 하는 거예요.'; return; }
    const who = nm.value.trim() || guest() || '대표';
    let v, line;
    const hit = (PL.keys || []).find(k => k.k.some(w => text.includes(w)));
    const h = hash(who + '|' + text);
    if (hit) { v = hit.v; line = hit.line; }
    else { const r = h % 100; v = r < 25 ? '인정' : r < 60 ? '보류' : '부인'; const L = (PL.verdicts || {})[v] || ['']; line = L[(h >>> 8) % L.length]; }
    const k = 'p_' + h; s.seen = s.seen || {};
    if (!s.seen[k]) { s.seen[k] = v; s.pleas[v] = (s.pleas[v] || 0) + 1; S.save(); }
    last = { who, text, v, line };
    $('au-pw').innerHTML = `<small>소명인 · ${esc(who)}</small>“${esc(text)}”`;
    $('au-pl').textContent = line;
    const seal = $('au-ps'); seal.textContent = v; seal.classList.toggle('ink', v === '부인'); seal.classList.remove('on');
    f.querySelector('.au-in').style.display = 'none'; $('au-pr').classList.add('on');
    setTimeout(() => seal.classList.add('on'), RM ? 0 : 120);
    paintStatus(); paintPL && paintPL();
  });
  $('au-pa').addEventListener('click', () => { $('au-pr').classList.remove('on'); $('au-ps').classList.remove('on'); f.querySelector('.au-in').style.display = ''; tx.value = ''; tx.focus(); });
  $('au-pc').addEventListener('click', () => {
    if (!last) return;
    copy(`[소명서 · 조사 ${Math.min(dayN, TOTAL)}일차]\n소명인: ${last.who}\n내용: ${last.text}\n판정: ${last.v}\n권세율: “${last.line}”`, () => { $('au-pc').textContent = PL.copied ? '복사했어요' : '복사됨'; say(PL.copied); setTimeout(() => { $('au-pc').textContent = PL.copy || '기록 복사'; }, 2400); });
  });
}

/* ── ④ 관계 손익계산서 ── */
const L = A.pl;
let paintPL = null;
if (L) {
  const box = put(sec(L.label, L.title, L.sub));
  const f = el('div', 'au-form au-pl');
  box.appendChild(f);
  paintPL = () => {
    const R = L.rows, days = Math.min(S.day(), TOTAL), ref = S.refusedN(), acc = S.accepted() ? 1 : 0;
    const p = s.pleas, nights = s.nights.length;
    const sales = days * R.sales[2];
    const cogs = ref * R.cogs[2];
    const gross = sales - cogs;
    const sga1 = (p['부인'] || 0) * R.sga[2], sga2 = (p['보류'] || 0) * R.sga[4];
    const op = gross - sga1 - sga2;
    const in1 = (p['인정'] || 0) * R.nonopIn[2], in2 = acc * R.nonopIn[4];
    const out1 = nights * R.nonopOut[2];
    const pre = op + in1 + in2 - out1;
    const rate = S.doubt();
    const tax = pre > 0 ? Math.round(pre * rate / 100) : 0;
    const net = pre - tax;
    const tr = (cls, a, b, n) => `<tr class="${cls}"><td>${esc(a)}${b ? `` : ''}</td><td class="n${n < 0 ? ' neg' : ''}">${n == null ? '' : won(n)}</td></tr>`;
    const sub = (a, n) => `<tr class="s"><td>${esc(a)}</td><td class="n">${won(n)}</td></tr>`;
    const O = L.opinion || {};
    const op_ = net <= 0 ? O.loss : net < 5e6 ? O.low : net < 15e6 ? O.mid : O.high;
    f.innerHTML = `
      <div class="fh"><b>${esc(L.head || '손익계산서')}</b><span>${esc(L.unit || '')}</span></div>
      <div class="fb">
        <p class="au-fine" style="margin:0 0 10px">${esc(L.period || '')} · ${esc((guest() || '대표') + ' 님')}</p>
        <table>
          ${tr('h', R.sales[0], '', sales)}${sub(`${R.sales[1]} ${days}일`, sales)}
          ${tr('h', R.cogs[0], '', cogs)}${sub(`${R.cogs[1]} ${ref}잔`, cogs)}
          ${tr('h', R.gross[0], '', gross)}
          ${tr('h', R.sga[0], '', sga1 + sga2)}${sub(`${R.sga[1]} ${p['부인'] || 0}건`, sga1)}${sub(`${R.sga[3]} ${p['보류'] || 0}건`, sga2)}
          ${tr('h', R.op[0], '', op)}
          ${tr('h', R.nonopIn[0], '', in1 + in2)}${sub(`${R.nonopIn[1]} ${p['인정'] || 0}건`, in1)}${sub(`${R.nonopIn[3]} ${acc}잔`, in2)}
          ${tr('h', R.nonopOut[0], '', out1)}${sub(`${R.nonopOut[1]} ${nights}일`, out1)}
          ${tr('h', R.pretax[0], '', pre)}
          ${tr('h', R.tax[0], '', tax)}${sub(`${R.tax[1]} ${rate}%`, tax)}
          ${tr('t', R.net[0], '', net)}
        </table>
        <div class="au-op"><span>${esc(O.label || '의견')}</span><p>${esc(op_ || '')}</p></div>
        <div class="au-row"><button type="button" class="btn" id="au-lc">${esc(L.copy || '기록 복사')}</button></div>
        <p class="au-fine">${esc(L.disclaimer || '')}</p>
      </div>`;
    $('au-lc').onclick = () => copy(`[관계 손익계산서 · 조사 ${days}일차]\n매출액 ${won(sales)}원 (함께한 조사일 ${days}일)\n거절당한 커피 ${ref}잔 · 소명 인정 ${p['인정'] || 0} / 보류 ${p['보류'] || 0} / 부인 ${p['부인'] || 0}\n불신율 ${rate}%\n당기순이익 ${won(net)}원\n조사관 의견: ${op_}`, () => { $('au-lc').textContent = L.copied || '복사했어요'; setTimeout(() => { if ($('au-lc')) $('au-lc').textContent = L.copy || '기록 복사'; }, 2400); });
  };
  paintPL();
  document.addEventListener('archive:enter', () => paintPL());
}

/* ── ⑤ 거꾸로 넘기는 메모 ── */
const MM = A.memo;
if (MM && (MM.pages || []).length) {
  const box = put(sec(MM.label, MM.title, MM.sub, MM.img, MM.cap));
  const w = el('div', 'au-memo');
  w.innerHTML = `<div class="sheet" id="au-ms"><span class="no" id="au-mn"></span><p class="tx" id="au-mt"></p></div>
    <div class="nav"><button type="button" id="au-mp">${esc(MM.prev)}</button><button type="button" id="au-mx">${esc(MM.next)}</button><button type="button" class="b" id="au-mb">${esc(MM.back)}</button></div>`;
  box.appendChild(w);
  const N = MM.pages.length;
  let i = 0, backward = false, found = !!s.memoFound;
  const sheet = $('au-ms');
  function show(k, hid) {
    const paint = () => {
      sheet.classList.toggle('hid', !!hid);
      $('au-mn').textContent = hid ? (MM.hiddenTag || '') : `p. ${k + 1} / ${N}`;
      $('au-mt').textContent = hid ? MM.hidden : MM.pages[k];
      $('au-mp').disabled = hid ? false : k === 0;
      $('au-mx').disabled = hid ? true : k === N - 1;
      sheet.classList.remove('flip');
    };
    if (RM) return paint();
    sheet.classList.add('flip'); setTimeout(paint, 220);
  }
  show(0);
  $('au-mx').addEventListener('click', () => { backward = false; if (i < N - 1) show(++i); });
  $('au-mp').addEventListener('click', () => {
    if (sheet.classList.contains('hid')) { show(i = N - 1); return; }
    if (i > 0) show(--i);
    if (backward && i === 0) { /* 끝까지 거꾸로 넘겼다 */ }
  });
  $('au-mb').addEventListener('click', () => {
    backward = true;
    show(-1, true);
    if (!found) { found = s.memoFound = true; S.save(); setTimeout(() => say('…그건 보라고 쓴 게 아니에요.'), RM ? 0 : 900); }
  });
}

/* ── ⑦ 조사 종결 통지 ── */
const CL = A.closing;
if (CL) {
  const box = put(sec(CL.label, CL.title, ''));
  box.classList.add('au-close');
  const days = S.day();
  if (days < TOTAL) {
    box.appendChild(el('div', 'au-locked', `조사 ${TOTAL}일차부터 열려요. 지금은 ${Math.min(days, TOTAL)}일차.<br>남은 날: ${TOTAL - days}일`));
  } else {
    const b = el('button', 'btn solid', esc(CL.btn || '통지서 열기')); b.type = 'button';
    const f = el('div', 'au-form au-notice'); f.style.display = 'none';
    box.append(b, f);
    b.addEventListener('click', () => {
      const p = s.pleas, n = (p['인정'] || 0) + (p['보류'] || 0) + (p['부인'] || 0);
      const fill = t => String(t).replace('{name}', guest() ? guest() + ' 대표' : '대표님') .replace('{plea}', n).replace('{coffee}', S.accepted() ? '받은 날 있음' : `거절 ${S.refusedN()}일`);
      f.innerHTML = `<div class="fh"><b style="letter-spacing:.06em;font-size:17px">${esc(CL.form)}</b><span>FILE 1103</span></div>
        <div class="fb"><table>${(CL.rows || []).map(r => `<tr><th>${esc(r[0])}</th><td>${esc(fill(r[1]).trim())}</td></tr>`).join('')}</table>
        <div class="nt"><span>${esc(CL.note)}</span><p>${esc(CL.noteText)}</p></div>
        <p class="sg">${esc(CL.sign)}</p>
        ${CL.img ? `<img src="${esc(CL.img)}" alt="조사를 마친 권세율" loading="lazy">` : ''}
        <p class="au-fine">${esc(CL.disclaimer || '')}</p></div>`;
      f.style.display = ''; b.style.display = 'none';
      if (!s.closedSeen) { s.closedSeen = true; S.save(); }
    });
  }
}

/* 들어올 때 날짜별 한마디 */
document.addEventListener('archive:enter', () => {
  setTimeout(() => {
    if (S.isM31() && M) say(M.say);
    else if (closed) say('조사는 끝났어요. …그래도 오셨네요.');
  }, 5200);
});
})();
