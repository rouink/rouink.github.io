/* 연재은 — 웹소설 앱 '쪽잠' 작품 홈 (novel 전용 · shared 파일을 고치지 않음)
   오늘의 연재 · 오늘 고친 한 줄 · 재상의 자리 · 회차별 조회수 · 등장인물 재상(남/여) · 회차 미리보기
   · 재상 결말 투표 · 댓글(다음 날 작가 답글) · 새 댓글 알림 · 휴재 공지 · 집필 중 표시 · 작가의 말 속 숨은 메모장
   data.js page.novel 에 값을 적으면 켜져요. 상태는 js/state.js.
   미리보기: ?ep=20 · ?hour=23 · ?wed=1 · ?days=2 */
(() => {
const D = window.ARCHIVE || {}, P = D.page || {}, N = P.novel, API = window.ARCHIVE_API, S = window.NOVEL_STORE;
if (!N || !API || !S) return;
const C = (D.characters || {}).char1 || {};
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const $ = id => document.getElementById(id);
const say = t => t && API.say && API.say(t, { by: C.name || '' });
const s = S.s, F = t => esc(S.fill(t));
const ep = S.ep(), seat = S.seat(ep), off = S.isOff;
const num = n => Number(n).toLocaleString('ko-KR');
const titleOf = n => (N.episodes || [])[n - 1] || `${n}화`;
const rev = (N.revisions || [])[(((ep - (N.startEp || 12)) % (N.revisions || [1]).length) + (N.revisions || [1]).length) % (N.revisions || [1]).length] || ['', ''];

/* shared 표지·세계관 칸은 이 작품에서 숨김 (앱 화면이 대신함) */
['hero'].forEach(id => $(id) && $(id).classList.add('nv-gone'));
if ($('hero-text')) $('hero-text').closest('section').classList.add('nv-gone');
if (!C.themeTitle && $('page-song')) $('page-song').classList.add('nv-gone');
const msong = document.querySelector('.m-song'); if (msong && !C.music) msong.classList.add('nv-gone');
if (!(C.items || []).length && $('modal-inv')) $('modal-inv').closest('.m-sec').classList.add('nv-gone');

/* ── 화면 그리기 ── */
const T = N.title || ['', ''];
const status = S.writing() ? `<span class="st on"><i></i>집필 중</span>` : `<span class="st"><i></i>마지막 접속 ${S.lastSeen()}시간 전</span>`;
const seats = N.seats || [];
const ex = (N.excerpts || []);
const exOf = n => ex.find(e => e.ep === n);
const CHAP = window.NOVEL_CHAPTERS || {};
const textOf = n => CHAP[n] || (exOf(n) || {}).text || '';
/* 오늘 회차를 지금 읽을 수 있나 (휴재·23시 전이면 아직) */
const openNow = n => n < ep || (n === ep && (S.done || (!off && S.posted)));
const canRead = n => n >= 1 && openNow(n) && !!textOf(n);
s.read = Array.isArray(s.read) ? s.read : [];
const SHOW = 7;
const epRows = Array.from({ length: ep }, (_, i) => ep - i);
const dLabel = n => n === ep ? (S.done ? '완결' : off ? '휴재' : S.posted ? '오늘' : '23시 공개') : (ep - n === 1 ? '어제' : `${ep - n}일 전`);

/* 조회수 그래프 */
const G = N.graph || {}, first = G.first || 3;
const views = []; for (let i = 1; i <= Math.max(ep, first + 2); i++) views.push(i < first ? 30 + i * 4 : Math.round(9000 + 2600 * Math.pow(i - first, 1.6)));
const vmax = Math.max(...views);
const pts = views.map((v, i) => [i / (views.length - 1) * 100, 96 - (v / vmax) * 88]);
const polyAll = pts.map(p => p.join(',')).join(' ');
const polyLow = pts.slice(0, first).map(p => p.join(',')).join(' ');
const pinX = pts[first - 1][0];

const CH = N.chancellor || {}, V = N.vote || {};
const sec = document.createElement('section');
sec.dataset.page = '1'; sec.className = 'nv'; sec.id = 'nv';
sec.innerHTML = `
<div class="nv-top"><span class="lg">${esc(N.app)}</span>${status}</div>
${off ? `<div class="nv-off"><b>${esc((N.off || {}).tag)}</b><span>${esc((N.off || {}).text)}</span></div>` : ''}
<div class="nv-hero">
  <div class="nv-cover" aria-hidden="true"><div class="ct">${esc(T.join(' ')).replace(/ /g, '<br>')}</div><span class="au">${esc((C.num || '').split('·').pop().trim() || '')}</span><span class="seal">${esc(T[0].charAt(0))}</span></div>
  <div class="nv-meta">
    <div class="nv-lb">${esc(N.genre)} · ${esc(N.schedule)}</div>
    <h1>${T.map(t => `<span>${esc(t)}</span>`).join('')}</h1>
    <p class="by">작가 <b>${esc(N.author)}</b> · ${esc(N.since)}</p>
    <div class="sts"><div>${num(N.likes + Math.max(0, ep - (N.startEp || 12)) * 37)}<small>관심</small></div><div>${esc(N.rating)}<small>별점</small></div><div>${esc(G.total || '')}<small>조회</small></div></div>
  </div>
</div>
<div class="nv-today">
  <div class="no">${ep}</div>
  <div class="tx">오늘의 연재 「${esc(titleOf(ep))}」<small>재상의 자리 · <b>${esc(seat.name)}</b></small></div>
  <button type="button" data-ep="${ep}">${off ? '휴재' : '읽기'}</button>
</div>
<nav class="nv-tabs" aria-label="작품 메뉴"><button type="button" class="on" data-go="nv-home">작품 홈</button><button type="button" data-go="nv-eps">회차</button><button type="button" data-go="nv-cm">댓글</button><button type="button" data-go="nv-note">작가의 말</button></nav>

<div class="nv-sec" id="nv-home">
  <div class="nv-h"><span class="nv-lb">Revision</span><strong>오늘 고친 한 줄</strong><em>${ep}화</em></div>
  ${off ? `<div class="nv-rev off"><div class="ln"><span class="tg">메모</span><span>${esc((N.off || {}).revision)}</span></div></div>`
        : `<div class="nv-rev"><div class="ln"><span class="tg">지운 줄</span><span><s data-fill="${esc(rev[0])}">${F(rev[0])}</s></span></div><div class="ln"><span class="tg">고친 줄</span><span><b data-fill="${esc(rev[1])}">${F(rev[1])}</b></span></div></div>`}
</div>

<div class="nv-sec">
  <div class="nv-h"><span class="nv-lb">Position</span><strong>재상의 자리</strong><em>회차가 오를수록 바뀌어요</em></div>
  <div class="nv-seat-now">${esc(seat.name)}<small>${ep}화 기준</small></div>
  <div class="nv-seat">${seats.map((x, i) => `<i class="${i <= seat.idx ? 'on' : ''}"></i>`).join('')}</div>
  <div class="nv-seat-l">${seats.map((x, i) => `<span class="${i === seat.idx ? 'on' : ''}">${esc(x[1])}</span>`).join('')}</div>
  <div class="nv-graph" role="img" aria-label="회차별 조회수: ${esc(G.pin || '')}부터 크게 오름">
    <span class="pin" style="left:${pinX}%">▼ ${esc(G.pin || '')}</span>
    <svg viewBox="0 0 100 96" preserveAspectRatio="none" aria-hidden="true"><polyline points="${polyAll}" fill="none" stroke="#1C2430" stroke-width="2" vector-effect="non-scaling-stroke"/><polyline points="${polyLow}" fill="none" stroke="#C2412D" stroke-width="2.4" vector-effect="non-scaling-stroke"/></svg>
  </div>
  <div class="nv-graph-l"><span>1화</span><span>회차별 조회수</span><span>${ep}화</span></div>
</div>

<div class="nv-sec">
  <div class="nv-h"><span class="nv-lb">Character</span><strong>등장인물</strong></div>
  <div class="nv-char">
    <div class="ph" aria-hidden="true"><span>?</span></div>
    <div style="min-width:0">
      <h4>${esc(CH.name)}<small>${esc(CH.role)}</small></h4>
      <p data-fill="${esc(CH.desc)}">${F(CH.desc)}</p>
      <p class="pen">${esc(CH.note)}</p>
      <div class="nv-gd" role="group" aria-label="재상의 성별">${(CH.genders || []).map(([g]) => `<button type="button" data-g="${esc(g)}" class="${(s.gender || '남') === g ? 'on' : ''}">${esc(g)}</button>`).join('')}<span>재상은 당신을 따라가요</span></div>
    </div>
  </div>
  <ul class="nv-specs">${(CH.lines || []).map(([k, v]) => `<li><b>${esc(k)}</b><span>${esc(v)}</span></li>`).join('')}</ul>
</div>

<div class="nv-sec" id="nv-eps">
  <div class="nv-h"><span class="nv-lb">Episodes</span><strong>회차</strong><em>최신순</em></div>
  <ul class="nv-eps" id="nv-epl">${epRows.map((n, i) => `<li class="${canRead(n) ? '' : 'lock'}${s.read.includes(n) ? ' rd' : ''}"${i >= SHOW ? ' hidden' : ''}><button type="button" data-ep="${n}"><span class="n">${n}화</span><span class="t">${esc(titleOf(n))}</span><span class="d">${esc(dLabel(n))}</span></button></li>`).join('')}</ul>
  ${epRows.length > SHOW ? `<button type="button" class="nv-more" id="nv-epmore">이전 회차 ${epRows.length - SHOW}개 더 보기</button>` : ''}
  <p class="nv-first"><button type="button" data-ep="1">1화부터 읽기 →</button></p>
  <div class="nv-vote">
    <div class="q">${esc(V.q)}</div><div class="sub">${esc(V.sub)}</div>
    <div class="ops">${(V.options || []).map((o, i) => `<button type="button" class="op" data-v="${i}"><i class="bar"></i><span>${esc(o)}</span><span class="pc"></span></button>`).join('')}</div>
    <p class="ans" id="nv-vans"></p>
  </div>
</div>

<div class="nv-sec" id="nv-cm">
  <div class="nv-h"><span class="nv-lb">Comments</span><strong>댓글</strong><em>${ep}화</em></div>
  <ul class="nv-cm" id="nv-cml"></ul>
  <form class="nv-cmf" id="nv-cmf" autocomplete="off"><input type="text" id="nv-cmi" maxlength="80" placeholder="${esc(N.commentPh)}" aria-label="댓글"><button type="submit">${esc(N.commentBtn || '등록')}</button></form>
</div>

<div class="nv-sec nv-note" id="nv-note">
  <div class="nv-h"><span class="nv-lb">Author's Note</span><strong>작가의 말</strong><em>${ep}화</em></div>
  ${(N.note || []).map(p => `<p>${esc(p)}</p>`).join('')}
  <p class="sig">— ${esc(N.author)}</p>
  <div class="nv-blank" id="nv-blank" role="button" tabindex="0" aria-label="빈칸 (길게 누르기)"><span>${esc(N.memoHint || '')}</span><i class="fill"></i></div>
</div>`;
const castSec = $('cast-head') && $('cast-head').closest('section');
castSec.parentNode.insertBefore(sec, castSec);

/* ── 시트 (회차 미리보기 · 메모장) ── */
const sheet = document.createElement('div');
sheet.className = 'nv-sheet'; sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true');
sheet.innerHTML = `<div class="pn"><button type="button" class="x" aria-label="닫기">×</button><div class="ct"></div></div>`;
document.body.appendChild(sheet);
let lastFocus = null;
function openSheet(html, memo) {
  lastFocus = document.activeElement;
  sheet.querySelector('.ct').innerHTML = html;
  sheet.classList.toggle('nv-memo', !!memo);
  sheet.classList.add('on');
  setTimeout(() => sheet.querySelector('.x').focus(), 50);
}
function closeSheet() { sheet.classList.remove('on'); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
sheet.addEventListener('click', e => { if (e.target === sheet || e.target.closest('.x')) closeSheet(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && sheet.classList.contains('on')) closeSheet(); });

function openEp(n) {
  const txt = textOf(n);
  let body, ok = false;
  if (n === ep && !S.done && off) body = `<p class="nt">${esc((N.off || {}).text)}</p>`;
  else if (n === ep && !S.done && !S.posted) body = `<p class="nt">${esc(N.excerptLater)}</p>`;
  else if (txt) { ok = true; body = txt.split('\n').filter(Boolean).map(p => `<p data-fill="${esc(p)}">${F(p)}</p>`).join(''); }
  else body = `<p class="nt">${esc(N.excerptNone)}</p>`;
  const prev = n > 1 && canRead(n - 1), next = canRead(n + 1);
  const nextNote = !next && n + 1 <= (N.episodes || []).length ? (n + 1 === ep && !S.posted && !off ? '다음 화는 23시에 올라와요' : n + 1 > ep ? '다음 화는 내일 23시' : '') : '';
  const nav = ok ? `<div class="nv-pg">${prev ? `<button type="button" data-goep="${n - 1}">← ${n - 1}화</button>` : '<span></span>'}${next ? `<button type="button" class="nx" data-goep="${n + 1}">${n + 1}화 →</button>` : `<span class="wt">${esc(nextNote)}</span>`}</div>` : '';
  openSheet(`<div class="ep">${n}화 · ${esc(N.app)}</div><h3>${esc(titleOf(n))}</h3><div class="bd">${body}</div>${nav}<p class="ft">작가 ${esc(N.author)} · ${esc(T.join(' '))}</p>`);
  sheet.querySelector('.pn').scrollTop = 0;
  if (ok && !s.read.includes(n)) {
    s.read.push(n); S.save();
    const li = sec.querySelector(`#nv-epl [data-ep="${n}"]`); if (li) li.parentNode.classList.add('rd');
  }
}
sheet.addEventListener('click', e => { const b = e.target.closest('[data-goep]'); if (b) openEp(+b.dataset.goep); });
sec.addEventListener('click', e => {
  const b = e.target.closest('[data-ep]'); if (b) { openEp(+b.dataset.ep); return; }
  const more = e.target.closest('#nv-epmore');
  if (more) { sec.querySelectorAll('#nv-epl li[hidden]').forEach(li => li.hidden = false); more.remove(); return; }
  const g = e.target.closest('[data-go]');
  if (g) {
    sec.querySelectorAll('.nv-tabs button').forEach(x => x.classList.toggle('on', x === g));
    const t = $(g.dataset.go); if (t) t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    return;
  }
  const gd = e.target.closest('[data-g]');
  if (gd) {
    s.gender = gd.dataset.g; S.save();
    sec.querySelectorAll('[data-g]').forEach(x => x.classList.toggle('on', x === gd));
    document.querySelectorAll('[data-fill]').forEach(el => { el.textContent = S.fill(el.dataset.fill); });
  }
});

/* ── 투표 ── */
function paintVote(anim) {
  const base = (V.base || []).slice(), mine = s.vote;
  if (mine == null) return;
  base[mine] = (base[mine] || 0) + 1;
  const tot = base.reduce((a, b) => a + b, 0) || 1;
  sec.querySelectorAll('.nv-vote .op').forEach((b, i) => {
    const pc = Math.round(base[i] / tot * 100);
    b.classList.toggle('me', i === mine);
    b.querySelector('.pc').textContent = pc + '%';
    const bar = b.querySelector('.bar');
    if (anim && !RM) { bar.style.width = '0'; requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.width = pc + '%'; })); } else bar.style.width = pc + '%';
  });
  $('nv-vans').innerHTML = `<b>작가 ${esc(N.author)}</b>${esc((V.author || [])[mine] || '')}`;
}
sec.querySelectorAll('.nv-vote .op').forEach(b => b.addEventListener('click', () => {
  const first = s.vote == null;
  s.vote = +b.dataset.v; S.save(); paintVote(true);
  if (first) say(V.thanks);
}));
paintVote(false);

/* ── 댓글: 남기면 이 기기에 저장, 다음 날 작가 답글 ── */
function paintCm() {
  const best = (N.best || []).map(([t, h]) => `<li><div class="who"><span class="bst">BEST</span>독자${String(S.hash(t) % 9000 + 1000)}<span class="hrt">♥ ${num(h)}</span></div>${esc(t)}</li>`).join('');
  const mine = s.comments.slice(-5).reverse().map(c => {
    const later = S.daysSince(c.d) >= 1;
    const rp = (N.replies || [])[S.hash(c.t) % Math.max(1, (N.replies || []).length)];
    return `<li class="mine"><div class="who">나 · ${esc(c.d.slice(5).replace('-', '.'))}</div>${esc(c.t)}${later ? `<div class="rp"><b>작가 ${esc(N.author)}</b>${esc(rp)}</div>` : `<div class="wait">${esc(N.commentWait)}</div>`}</li>`;
  }).join('');
  $('nv-cml').innerHTML = mine + best;
}
$('nv-cmf').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('nv-cmi').value.trim(); if (!v) return;
  s.comments.push({ t: v.slice(0, 80), d: S.today }); if (s.comments.length > 30) s.comments = s.comments.slice(-30); S.save();
  $('nv-cmi').value = ''; paintCm();
});
paintCm();

/* ── 작가의 말 끝 빈칸: 1초 길게 누르면 메모장 ── */
const blank = $('nv-blank'); let hold = null;
const M = N.memo || {};
function openMemo() {
  openSheet(`<h3>${esc(M.title)}<small>${esc(M.sub)}</small></h3>${(M.rows || []).map(([d, h, w]) => `<div class="row"><b>${esc(d)}</b>${esc(h)}<i>→ ${esc(w)}</i></div>`).join('')}`, true);
  if (!s.memoFound) { s.memoFound = true; S.save(); setTimeout(() => say(M.found), RM ? 0 : 1400); }
}
const startHold = e => { if (e.type === 'mousedown' && e.button) return; blank.classList.add('hold'); hold = setTimeout(() => { blank.classList.remove('hold'); openMemo(); }, 1000); };
const endHold = () => { clearTimeout(hold); blank.classList.remove('hold'); };
blank.addEventListener('pointerdown', startHold);
['pointerup', 'pointerleave', 'pointercancel'].forEach(t => blank.addEventListener(t, endHold));
blank.addEventListener('contextmenu', e => e.preventDefault());
blank.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openMemo(); } });

/* ── 새 댓글 알림 (들어온 뒤 5초마다, 겹치지 않게 섞어서) ── */
const toast = document.createElement('div');
toast.className = 'nv-toast'; toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);
let cmN = 40, tq = [], nq = [];
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const modalOpen = () => { const m = $('modal-panel'); return !!(m && m.offsetParent && m.getBoundingClientRect().width > 0); };
function showToast() {
  const L = N.toasts || [], NM = N.toastNames || ['독자']; if (!L.length) return;
  if (document.hidden || sheet.classList.contains('on') || modalOpen()) return;
  if (!tq.length) tq = shuffle(L);
  if (!nq.length) nq = shuffle(NM);
  cmN++;
  toast.innerHTML = `<b>새 댓글</b><span>${esc(tq.pop())}</span><i>${esc(nq.pop())} · 방금</i>`;
  toast.classList.add('on');
  clearTimeout(showToast.h); showToast.h = setTimeout(() => toast.classList.remove('on'), Math.max(1500, (N.toastEvery || 5) * 1000 - 900));
}

/* ── 들어온 뒤 ── */
document.addEventListener('archive:enter', () => {
  const lines = S.writing() ? '…지금 쓰는 중이에요. 보지 마요.' : off ? '오늘은 휴재예요. 그러니까 볼 거 없어요.' : S.posted ? `${ep}화 올라왔어요. …읽든가 말든가.` : `…또 왔어요? ${ep}화는 23시예요.`;
  setTimeout(() => say(lines), RM ? 300 : 1600);
  setInterval(showToast, (N.toastEvery || 5) * 1000);
}, { once: true });
})();
