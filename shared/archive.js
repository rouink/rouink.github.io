/* PROJECT ARCHIVE 공통 기능 — 모든 작품 페이지가 같이 씁니다.
   작품별 내용(글·캐릭터·음악·문구)은 각 작품 폴더의 data.js(window.ARCHIVE)에서 읽어 옵니다. 이 파일은 고칠 필요가 없어요. */
const ARCHIVE = window.ARCHIVE || {};
const CONFIG = Object.assign({ bgm: 'assets/music/main.mp3' }, ARCHIVE.config);
const characters = ARCHIVE.characters || {};
const charIds = Object.keys(characters);
// 작품명: data.js의 page.brand (없으면 PROJECT ARCHIVE). 로고·주화·포토카드·인생 두컷 프레임에 들어감
const BRAND = ((ARCHIVE.page && ARCHIVE.page.brand) || 'PROJECT ARCHIVE').toUpperCase();

const $ = id => document.getElementById(id);

/* ===== 페이지 글 채우기 (data.js의 page) ===== */
(() => {
  const p = ARCHIVE.page || {};
  if (p.title) document.title = p.title;
  if (p.heroLabel) $('hero-label').textContent = p.heroLabel;
  if (p.heroTitle) $('hero-title').textContent = p.heroTitle;
  if (p.heroText) { const el = $('hero-text'); el.textContent = ''; [].concat(p.heroText).forEach((line, i) => { if (i) el.appendChild(document.createElement('br')); el.appendChild(document.createTextNode(line)); }); }
  if (p.heroSub) { $('hero-sub').textContent = p.heroSub; $('hero-sub').classList.remove('hidden'); }
  if (p.worldLabel) $('world-label').textContent = p.worldLabel;
  if ($('gate-title')) $('gate-title').textContent = p.introTitle || p.brand || '기록실 입장';
  if (p.heroImage) {   // 표지 사진: 화면 위쪽을 가득 채우고 아래로 갈수록 바탕색으로 녹아듦
    const img = $('hero-img'); img.src = p.heroImage; img.alt = p.heroCaption || p.heroTitle || '';
    if (p.heroPosition) $('hero-media').style.setProperty('--hero-pos', p.heroPosition);
    $('hero-media').classList.remove('hidden'); document.body.classList.add('has-hero');
    if (p.heroCaption) { $('hero-caption').textContent = '— ' + p.heroCaption; $('hero-caption').classList.remove('hidden'); }
  }
  if (p.heroVideo) {   // 휴대폰의 '애니메이션 효과 제거' 설정과 상관없이 항상 재생   // 움직이는 표지(mp4): 소리 없이 반복 재생. 재생이 안 되면 heroImage 사진이 그대로 보임
    const m = $('hero-media'), v = document.createElement('video');
    Object.assign(v, { src: p.heroVideo, muted: true, loop: true, autoplay: true, playsInline: true, preload: 'auto' });
    v.setAttribute('muted', ''); v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true'); if (p.heroImage) v.poster = p.heroImage;
    v.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:var(--hero-pos,50% 30%)';
    v.addEventListener('error', () => v.remove());
    if (p.heroPosition) m.style.setProperty('--hero-pos', p.heroPosition);
    m.insertBefore(v, $('hero-img').nextSibling); m.classList.remove('hidden'); document.body.classList.add('has-hero');
    const go = () => v.play().catch(() => {}); go(); document.addEventListener('visibilitychange', () => { if (!document.hidden) go(); });
  }
  if (p.quote) { $('page-quote-text').textContent = p.quote; $('page-quote-by').textContent = p.quoteBy ? '— ' + p.quoteBy : ''; $('page-quote').classList.remove('hidden'); }
  if (p.footer) $('site-footer').textContent = p.footer;
  if (p.brand && $('nav-brand')) $('nav-brand').textContent = p.brand;
  if (p.pages) document.querySelectorAll('#page-nav .page-label').forEach((el, i) => { if (p.pages[i]) el.textContent = p.pages[i]; });
  // 휴대폰 상단 색(주소창)도 테마 바탕색으로
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg-rgb').trim().split(/\s+/).map(Number);
  if (bg.length === 3) { const m = document.createElement('meta'); m.name = 'theme-color'; m.content = '#' + bg.map(v => v.toString(16).padStart(2, '0')).join(''); document.head.appendChild(m); }
})();

/* ===== 입장 · 음악 =====
   · Web Audio 게인으로 볼륨/페이드를 처리 → iOS Safari에서도 볼륨이 먹습니다. (file:// 로 직접 열면 브라우저가 막아서 일반 volume으로 대체)
   · 볼륨은 localStorage에 기억하되, 저장소가 막혀 있어도(시크릿 모드 등) 오류 없이 동작합니다.
   · 자동재생이 막히면 하단 바에 "TAP FOR SOUND" 안내가 뜹니다. */
const tk = $('ticker-text');
const gateway = $('gateway'), mainView = $('main-view'), bgm = $('main-bgm');
const audioBtn = $('audio-btn'), audioState = $('audio-state'), notice = $('audio-notice'), volEl = $('vol');
const VOL_KEY = 'pa_volume';
const store = { get(k) { try { return localStorage.getItem(k); } catch { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch {} } };
let vol = .7; { const v = parseFloat(store.get(VOL_KEY)); if (v >= 0 && v <= 1) vol = v; }
volEl.value = Math.round(vol * 100);

let actx = null, gainNode = null, useGain = false, env = 0, playing = false, entered = false, seq = 0;
let curSrc = CONFIG.bgm, curLabel = 'Main Theme'; const resumeAt = {};
bgm.src = curSrc;
function initGraph() {
  if (gainNode || location.protocol === 'file:') return;
  try {
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
    actx = new AC(); const src = actx.createMediaElementSource(bgm);
    gainNode = actx.createGain(); gainNode.gain.value = 0; src.connect(gainNode); gainNode.connect(actx.destination);
    bgm.volume = 1; useGain = true;
  } catch { useGain = false; }
}
const clamp01 = x => Math.max(0, Math.min(1, x));
function applyOut() { const v = clamp01(env * vol); if (useGain) gainNode.gain.value = v; else bgm.volume = v; }
const fade = (to, ms) => new Promise(res => {
  const from = env, t0 = performance.now();
  (function step(t) { const k = clamp01((t - t0) / ms); env = from + (to - from) * k; applyOut(); k < 1 ? requestAnimationFrame(step) : res(); })(t0);
});
function showNotice(msg) { notice.textContent = msg || ''; notice.classList.toggle('hidden', !msg); }
function renderAudioUI() {
  audioState.textContent = playing ? 'ON' : 'OFF'; audioBtn.setAttribute('aria-pressed', playing);
  $('audio-track').textContent = playing ? curLabel : '';
  tk.textContent = `♪ ${curLabel}${playing ? '' : ' · OFF'}`;
  audioBtn.title = playing ? `${curLabel} 재생 중` : '음악 켜기';
}
// 재생 시도: 성공/차단/파일없음을 구분해서 안내
async function tryPlay() {
  try { if (actx && actx.state === 'suspended') await actx.resume(); await bgm.play(); playing = true; showNotice(''); return true; }
  catch (e) {
    playing = false;
    showNotice(e && e.name === 'NotAllowedError' ? '♪ 소리를 켜려면 왼쪽 ♪ 를 눌러 주세요 · TAP FOR SOUND' : '음원 파일을 찾을 수 없어요 (assets/music 확인)');
    return false;
  }
}
async function setBgm(on) {
  if (on) {
    initGraph(); env = 0; applyOut();
    if (await tryPlay()) fade(1, 1200);
  } else { playing = false; showNotice(''); await fade(0, 400); bgm.pause(); }
  renderAudioUI();
}
async function switchTrack(src, label) {
  const url = new URL(src, location.href).href;
  if (bgm.src === url) return;
  const id = ++seq;
  resumeAt[bgm.src] = bgm.currentTime;                       // 떠나는 곡의 위치 기억
  if (playing) { await fade(0, 450); if (id !== seq) return; }
  curSrc = src; curLabel = label || curLabel; bgm.src = src;
  const start = resumeAt[url] || 0;
  if (start) bgm.addEventListener('loadedmetadata', () => { try { bgm.currentTime = start; } catch {} }, { once: true });
  if (!playing) { renderAudioUI(); return; }                  // 꺼 둔 상태면 곡만 바꿔 둠
  if (await tryPlay()) { fade(1, 800); } renderAudioUI();
}
// exitAnim: 시작 화면 효과가 직접 퇴장 연출을 할 때 (Promise 를 돌려줌). 음악은 터치 순간에 바로 시작해야 iOS 에서도 재생됨
function enter(withAudio, exitAnim) {
  if (entered) return; entered = true;
  const user = $('username').value.trim() || 'GUEST';
  $('nav-user-label').textContent = user;
  $('coin-name-input').value = user;
  if (!(withAudio && playing)) setBgm(withAudio);   // 시작 화면에서 이미 음악을 켰다면 그대로 이어서
  const reveal = () => { showPage('1'); mainView.classList.remove('opacity-0', 'translate-y-4'); startTicker(); drawCoin(); };   // 시작 화면 다음엔 언제나 Ⅰ 기록부터
  if (exitAnim) { reveal(); Promise.resolve(exitAnim()).then(() => { gateway.style.display = 'none'; }); return; }
  gateway.classList.add('opacity-0', 'pointer-events-none');
  setTimeout(() => { gateway.style.display = 'none'; reveal(); }, 500);
}
$('btn-bgm-on').addEventListener('click', () => enter(true));
$('btn-bgm-off').addEventListener('click', () => enter(false));
$('username').addEventListener('keydown', e => { if (e.key === 'Enter') enter(false); });
// 시작 화면 효과는 shared/intro.js 에 있어요.
window.ARCHIVE_API = { enter, setBgm: on => setBgm(on), isPlaying: () => playing, peek: () => mainView.classList.remove('opacity-0', 'translate-y-4'), gateway, mainView };

audioBtn.addEventListener('click', () => setBgm(!playing));
volEl.addEventListener('input', () => { vol = volEl.value / 100; store.set(VOL_KEY, vol); applyOut(); });
bgm.addEventListener('error', () => { if (bgm.getAttribute('src')) { playing = false; showNotice('음원 파일을 찾을 수 없어요 (assets/music 확인)'); renderAudioUI(); } });

/* ===== 캐릭터 카드 · 상세 팝업 ===== */
const josa = w => { const c = String(w).trim().slice(-1).charCodeAt(0); return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 ? '과' : '와'; };   // 이이레와 · 하늘과
const esc = t => String(t).replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
const SINGLE = charIds.length === 1;
const PAGE = ARCHIVE.page || {};
const portraitOf = c => c.portrait || c.poster || (SINGLE && PAGE.heroImage) || ((c.gallery || []).find(g => g.img && !g.secret) || {}).img || '';   // 초상: portrait → poster → (한 명이면) 표지 사진 → 갤러리 첫 장
const crackOfC = c => c.crack || PAGE.crackUrl || '';
const phImg = (src, alt) => `<span class="ini" aria-hidden="true">${esc(String(alt || '').trim().charAt(0))}</span>` + (src ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" onerror="this.remove()">` : '');   // 사진이 없으면 이름 첫 글자
const playIcon = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4l13 8-13 8z"/></svg>';
if (SINGLE) {   // 캐릭터챗(한 명): 큰 기록 카드 + 테마곡 줄
  const id = charIds[0], c = characters[id], url = crackOfC(c), meta = [c.age ? c.age + '세' : '', (c.extras || []).filter(([k]) => k === '직업').map(([, v]) => v).filter(v => v && v !== '-')[0] || ''].filter(Boolean).join(' · ');
  $('character-grid').innerHTML = `
  <article class="file">
    <div class="file-top"><span class="label">${esc(c.num)}</span><span class="italic" style="font-size:14px">${esc(c.nameEn || '')}</span></div>
    <div class="file-id">
      <div class="ph">${phImg(portraitOf(c), c.name)}</div>
      <div style="min-width:0"><h3 class="file-name">${esc(c.name)}</h3><p class="file-en">${esc(c.nameEn || '')}</p>${meta ? `<p class="file-meta">${esc(meta)}</p>` : ''}</div>
    </div>
    <div class="tags">${(c.tags || []).map(t => `<span class="chip">${esc(t)}</span>`).join('')}</div>
    <p class="file-bio">${esc(c.bio || '')}</p>
    <div class="file-actions">
      <button type="button" class="btn" data-id="${id}">기록 열기</button>
      ${url ? `<a class="btn solid" href="${esc(url)}" target="_blank" rel="noopener">크랙에서 대화하기</a>` : ''}
    </div>
  </article>`;
  if (c.music) {
    $('page-song').innerHTML = `<div class="song"><button type="button" class="play" id="page-song-play" aria-label="${esc(c.name)} Theme Song 재생">${playIcon}</button><div style="min-width:0"><p class="label" style="font-size:11px">${esc(c.nameEn || c.name)} Theme Song</p><p class="ttl">${esc(c.themeTitle || '')}</p></div></div>`;
    $('page-song-play').addEventListener('click', async () => { if (!playing) await setBgm(true); switchTrack(c.music, c.name + ' Theme Song'); });
  }
} else {
  $('character-grid').innerHTML = `<div class="cast">${charIds.map(id => { const c = characters[id]; return `
  <button type="button" data-id="${id}" class="ccard">
    <span class="ph">${phImg(portraitOf(c), c.name)}</span>
    <span class="tx"><span class="label" style="font-size:10px">${esc(c.num)}</span><span class="nm" style="display:block">${esc(c.name)}</span><span class="en">${esc(c.nameEn || '')}</span></span>
  </button>`; }).join('')}</div>`;
}
$('character-grid').addEventListener('click', e => {
  const b = e.target.closest('[data-id]'); if (b) openModal(b.dataset.id);
});

const modal = $('char-modal'), panel = $('modal-panel'), video = $('modal-video'), fallback = $('modal-video-fallback'), lightbox = $('lightbox');
let lastFocus = null, curId = null;
const specRow = (k, v) => `<li><span class="k">${k}</span><span class="v">${esc(v)}</span></li>`;

function fillModal(id) {
  const c = characters[id]; curId = id;
  $('modal-subtitle').textContent = c.num; $('modal-name').textContent = c.name; $('modal-name-en').textContent = c.nameEn;
  $('modal-tags').innerHTML = c.tags.map(t => `<span class="chip">${esc(t)}</span>`).join('');
  $('modal-desc').textContent = c.bio;
  $('modal-specs').innerHTML = specRow('Born', `${c.birth}생 · ${c.age}세`) + specRow('MBTI', c.mbti) + specRow('Nationality', c.nationality) + specRow('Height', c.height);
  $('modal-extra').innerHTML = (c.extras || []).length ? `<span class="label">Notes</span><div class="acc-wrap"><details class="acc"><summary>더 알아보기</summary><ul class="spec ans">${c.extras.map(([k, v]) => specRow(esc(k), v)).join('')}</ul></details></div>` : '';
  $('modal-tmi').innerHTML = c.tmi.map(t => `<details class="acc"><summary>${esc(t.q)}</summary><p class="ans">${esc(t.a)}</p></details>`).join('');
  $('modal-story').innerHTML = c.story.map(p => `<p>${esc(p)}</p>`).join('');
  $('modal-inv-count').textContent = c.items.length + ' items';
  $('modal-inv').innerHTML = c.items.map((it, i) => `<button type="button" data-item="${i}">${it.img ? `<span class="ic im" aria-hidden="true"><img src="${esc(it.img)}" alt="" loading="lazy"></span>` : `<span class="ic" aria-hidden="true">${it.icon || ''}</span>`}<span class="nm">${esc(it.title)}</span></button>`).join('');
  $('modal-theme-label').textContent = (c.nameEn || c.name) + ' Theme Song'; $('modal-theme').textContent = c.themeTitle;
  const ck = $('modal-crack'); if (ck) { const url = c.crack || (ARCHIVE.page && ARCHIVE.page.crackUrl); ck.classList.toggle('hidden', !url); if (url) ck.href = url; }
  if ($('modal-nav')) $('modal-nav').style.display = SINGLE ? 'none' : '';
  const i = charIds.indexOf(id), prev = characters[charIds[(i + charIds.length - 1) % charIds.length]], next = characters[charIds[(i + 1) % charIds.length]];
  $('modal-prev-name').textContent = prev.name; $('modal-next-name').textContent = next.name;
  $('modal-scroll').scrollTop = 0;
  fallback.classList.replace('flex', 'hidden');
  if (c.video) { video.poster = c.poster || ''; video.src = c.video; video.play().catch(() => {}); }
  else { video.pause(); video.removeAttribute('src'); video.removeAttribute('poster'); video.load(); if (!portraitOf(c)) fallback.classList.replace('hidden', 'flex'); }
  const pimg = $('modal-portrait'), psrc = portraitOf(c); pimg.classList.toggle('hidden', !psrc || !!c.video); if (psrc) { pimg.src = psrc; pimg.alt = c.name; }
  switchTrack(c.music || CONFIG.bgm, c.name + ' Theme Song');
}
function openModal(id) {
  if (!characters[id]) return;
  lastFocus = document.activeElement; fillModal(id);
  modal.classList.replace('hidden', 'flex');
  document.documentElement.style.overflow = 'hidden';
  requestAnimationFrame(() => { modal.classList.remove('opacity-0'); panel.classList.remove('scale-95'); $('modal-close').focus(); });
}
function step(d) { fillModal(charIds[(charIds.indexOf(curId) + d + charIds.length) % charIds.length]); }
function closeLightbox() { lightbox.classList.replace('flex', 'hidden'); }
function closeModal() {
  if (modal.classList.contains('hidden')) return;
  closeLightbox();
  modal.classList.add('opacity-0'); panel.classList.add('scale-95');
  video.pause(); video.removeAttribute('src'); video.removeAttribute('poster'); video.load();
  document.documentElement.style.overflow = ''; switchTrack(CONFIG.bgm, 'Main Theme');
  setTimeout(() => { modal.classList.replace('flex', 'hidden'); if (lastFocus) lastFocus.focus(); }, 300);
}
video.addEventListener('error', () => { if (video.getAttribute('src')) fallback.classList.replace('hidden', 'flex'); });
$('modal-inv').addEventListener('click', e => {
  const b = e.target.closest('[data-item]'); if (!b) return;
  const it = characters[curId].items[+b.dataset.item];
  const li = $('lightbox-icon'); li.classList.toggle('im', !!it.img); li.textContent = ''; if (it.img) { const im = document.createElement('img'); im.src = it.img; im.alt = it.title || ''; li.appendChild(im); } else li.textContent = it.icon || ''; $('lightbox-title').textContent = it.title; $('lightbox-desc').textContent = it.desc;
  lightbox.classList.replace('hidden', 'flex'); $('lightbox-close').focus();
});
$('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
$('modal-prev').addEventListener('click', () => step(-1));
$('modal-next').addEventListener('click', () => step(1));
$('modal-close').addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
document.addEventListener('keydown', e => {
  if (modal.classList.contains('hidden')) return;
  if (e.key === 'Escape') { lightbox.classList.contains('hidden') ? closeModal() : closeLightbox(); }
  else if (lightbox.classList.contains('hidden') && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
    if (e.key === 'ArrowLeft') step(-1); else if (e.key === 'ArrowRight') step(1);
  }
});

/* ===== 기념주화 제작소: 코난 기념뱃지 같은 앤티크 메탈 음각 (900px로 그려 선명하게 저장) ===== */
const cv = $('coin-canvas'), TAU = Math.PI * 2, R = 88; let ctx = cv.getContext('2d'), SCALE = cv.width / 300;
const METALS = {
  gold:   { base:'#C9A55C', light:'#EFD9A0', dark:'#4E3A18', hi:'#FFF8E1', enamel:['#2B407A','#0F1A38'] },
  rose:   { base:'#C98F7F', light:'#F2CBBD', dark:'#5C2E27', hi:'#FFF1EB', enamel:['#8A3347','#3A111D'] },
  silver: { base:'#A9B3C2', light:'#E6EBF3', dark:'#2B3342', hi:'#FFFFFF', enamel:['#2F6479','#12303E'] },
  aurora: { base:'#B9A4E6', light:'#EFE6FF', dark:'#3A2F66', hi:'#FFFFFF', enamel:['#5642AE','#1C1450'] }
};
let metal = 'gold', avatar = null, avatarId = 0, queued = false, relief = null, reliefKey = '';
const rgb = h => [1, 3, 5].map(i => parseInt(h.substr(i, 2), 16));
const mix = (a, b, t) => 'rgb(' + rgb(a).map((v, i) => Math.round(v + (rgb(b)[i] - v) * t)).join() + ')';

// 무광 금속 질감용 잔 알갱이
const grain = document.createElement('canvas'); grain.width = grain.height = 128;
(() => {
  const g = grain.getContext('2d'), d = g.createImageData(128, 128);
  for (let i = 0; i < d.data.length; i += 4) { d.data[i] = d.data[i + 1] = d.data[i + 2] = Math.random() * 255; d.data[i + 3] = 46; }
  g.putImageData(d, 0, 0);
})();

function selectMetal(m) {
  metal = m;
  document.querySelectorAll('[data-metal]').forEach(b => b.classList.toggle('active', b.dataset.metal === m));
  drawCoin();
}
function drawCoin() {
  if (queued) return; queued = true;
  requestAnimationFrame(() => { queued = false; render(); });
}
function disc(r, fill) { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(150, 150, r, 0, TAU); ctx.fill(); }
// 경사 링: 왼쪽 위에서 빛이 올 때 c1(밝음)→c2(어두움). 솟은 면은 (밝음,어두움), 파인 면은 반대로
function bevel(r, w, c1, c2) {
  const g = ctx.createLinearGradient(150 - r, 150 - r, 150 + r, 150 + r);
  g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.strokeStyle = g; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(150, 150, r, 0, TAU); ctx.stroke();
}
// 음각 글자: 어두운 파인 면 + 오른쪽 아래 모서리에 빛 반사 (회전된 좌표계에 맞춰 빛 방향 보정)
function carve(ch, x, y, a, P) {
  const c = Math.cos(a), s = Math.sin(a);
  ctx.globalAlpha = .75; ctx.fillStyle = P.hi; ctx.fillText(ch, x + .7 * (c + s), y + .7 * (c - s));
  ctx.globalAlpha = 1; ctx.fillStyle = P.dark; ctx.fillText(ch, x, y);
}
// 글자 폭을 재서 호 위에 중앙 정렬 (한글·영문 모두 겹치지 않음)
function arcText(text, r, bottom, P, font, gap = 1.5) {
  ctx.font = font; ctx.textAlign = 'center';
  const chars = [...text], w = chars.map(c => ctx.measureText(c).width + gap);
  const d = bottom ? -1 : 1, y = bottom ? r : -r;
  let a = -d * (w.reduce((s, x) => s + x, 0) / r) / 2;
  chars.forEach((ch, i) => {
    const st = w[i] / r; a += d * st / 2;
    ctx.save(); ctx.rotate(a); carve(ch, 0, y, a, P); ctx.restore();
    a += d * st / 2;
  });
}
// 사진 → 금속 부조: 밝기를 높이로 보고 왼쪽 위 조명을 계산해 금속 색으로 입힘
function buildRelief(P) {
  const N = Math.round(2 * R * SCALE), o = document.createElement('canvas'); o.width = o.height = N;
  const c = o.getContext('2d', { willReadFrequently: true });
  const k = Math.max(N / avatar.width, N / avatar.height), w = avatar.width * k, h = avatar.height * k;
  c.drawImage(avatar, (N - w) / 2, (N - h) / 2, w, h);
  const img = c.getImageData(0, 0, N, N), px = img.data, H = new Float32Array(N * N);
  for (let i = 0; i < N * N; i++) {
    const l = (px[4 * i] * .3 + px[4 * i + 1] * .59 + px[4 * i + 2] * .11) / 255;
    H[i] = Math.min(1, Math.max(0, (l - .5) * 1.35 + .5));
  }
  const lg = document.createElement('canvas'); lg.width = 256; lg.height = 1;
  const lc = lg.getContext('2d'), gr = lc.createLinearGradient(0, 0, 256, 0);
  [[0, P.dark], [.45, P.base], [.8, P.light], [1, P.hi]].forEach(([t, col]) => gr.addColorStop(t, col));
  lc.fillStyle = gr; lc.fillRect(0, 0, 256, 1);
  const lut = lc.getImageData(0, 0, 256, 1).data, g = 3;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const i = y * N + x;
    const e = H[Math.max(0, y - g) * N + Math.max(0, x - g)] - H[Math.min(N - 1, y + g) * N + Math.min(N - 1, x + g)];
    const idx = Math.min(255, Math.max(0, Math.round((H[i] * .55 + (.5 + e * 2.4) * .45) * 255))) * 4;
    px[4 * i] = lut[idx]; px[4 * i + 1] = lut[idx + 1]; px[4 * i + 2] = lut[idx + 2]; px[4 * i + 3] = 255;
  }
  c.putImageData(img, 0, 0);
  return o;
}
// 솟아오른 부조: 어두운 그림자 → 금속 그라데이션 → 모서리 하이라이트
function raised(p, P) {
  ctx.save(); ctx.translate(1.5, 1.9); ctx.globalAlpha = .85; ctx.fillStyle = P.dark; ctx.fill(p); ctx.restore();
  const g = ctx.createLinearGradient(95, 80, 205, 220); g.addColorStop(0, P.hi); g.addColorStop(.35, P.light); g.addColorStop(1, P.base);
  ctx.fillStyle = g; ctx.fill(p);
  ctx.save(); ctx.globalAlpha = .6; ctx.lineWidth = .7; ctx.strokeStyle = P.hi; ctx.stroke(p); ctx.restore();
}
// 에나멜 면: 깊은 색 + 은은한 금빛 햇살 (디자인 좌표계 150,150 중심)
function enamelField(P) {
  const g = ctx.createRadialGradient(125, 105, 8, 150, 150, 118); g.addColorStop(0, P.enamel[0]); g.addColorStop(1, P.enamel[1]);
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(150, 150, 100, 0, TAU); ctx.fill();
  ctx.save(); ctx.translate(150, 150);
  for (let i = 0; i < 60; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 100, i / 60 * TAU, (i + .5) / 60 * TAU); ctx.closePath(); ctx.fillStyle = i % 2 ? 'rgba(255,235,170,.07)' : 'rgba(0,0,0,.10)'; ctx.fill(); }
  ctx.strokeStyle = 'rgba(240,215,150,.55)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.arc(0, 0, 84, 0, TAU); ctx.stroke();
  ctx.restore();
}
function star(cx, cy, r) {
  const p = new Path2D();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .42 : r; const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a); i ? p.lineTo(x, y) : p.moveTo(x, y); }
  p.closePath(); return p;
}
function emblem(P, initial) {
  const rw = 63;
  // 월계수 가지와 잎
  [-1, 1].forEach(sd => {
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = P.dark; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let k = 0; k <= 30; k++) { const f = .22 + k / 30 * 2.55, x = 150 + sd * rw * Math.sin(f), y = 150 + rw * Math.cos(f); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.stroke(); ctx.restore();
    for (let k = 0; k < 12; k++) {
      const f = .3 + k * .215, tx = sd * Math.cos(f), ty = -Math.sin(f), base = Math.atan2(ty, tx);
      [[1, 5], [-1, -5]].forEach(([sgn, off]) => {
        const len = 10.5 - k * .22, x = 150 + sd * (rw + off) * Math.sin(f), y = 150 + (rw + off) * Math.cos(f);
        const leaf = new Path2D(); leaf.ellipse(x, y, len, 3.5, base + sgn * sd * .62, 0, TAU);
        raised(leaf, P);
      });
    }
  });
  raised(star(150, 68, 8.5), P); raised(star(127, 76, 4.6), P); raised(star(173, 76, 4.6), P);
  const d = new Path2D(); d.moveTo(150, 226); d.lineTo(155, 231); d.lineTo(150, 236); d.lineTo(145, 231); d.closePath(); raised(d, P);
  // 중앙 이니셜 (이름의 첫 글자)
  ctx.save(); ctx.font = 'bold 78px "Cinzel Decorative","Song Myung",serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.globalAlpha = .9; ctx.fillStyle = P.dark; ctx.fillText(initial, 152.2, 155.4);
  ctx.globalAlpha = 1;
  const g = ctx.createLinearGradient(0, 112, 0, 196); g.addColorStop(0, P.hi); g.addColorStop(.4, P.light); g.addColorStop(1, P.base);
  ctx.fillStyle = g; ctx.fillText(initial, 150, 153);
  ctx.lineWidth = .8; ctx.strokeStyle = P.hi; ctx.globalAlpha = .55; ctx.strokeText(initial, 150, 153);
  ctx.restore();
}

/* ===== 뱃지 외형: 둥근 동전이 아니라 소장용 핀뱃지처럼 윤곽이 있는 모양 ===== */
const MS = .74;   // 중앙 메달 크기 비율
const SHAPES = {
  // 풀컬러 굿즈: 홀로그램 포토카드 / 캔뱃지 (올린 그림을 색 그대로)
  card: { custom:'card', sc:[150,150], path(p) { p.addPath(rrect(52, 6, 196, 288, 14)); } },
  can:  { custom:'can',  sc:[150,150], path(p) { p.arc(150, 150, 140, 0, TAU); } },
  shield: { cx:150, cy:132, sc:[150,150], plaque:{ y:238, w:100 }, studs:[[62,52],[238,52]], glint:[62,50],
    path(p) { p.moveTo(50, 22); p.lineTo(250, 22); p.lineTo(264, 42); p.lineTo(264, 150); p.bezierCurveTo(264, 232, 212, 264, 150, 290); p.bezierCurveTo(88, 264, 36, 232, 36, 150); p.lineTo(36, 42); p.closePath(); } },
  deco: { cx:150, cy:134, sc:[150,150], plaque:{ y:242, w:150 }, studs:[[56,56],[244,56],[56,244],[244,244]], glint:[58,60],
    path(p) { p.moveTo(66, 30); p.lineTo(234, 30); p.arc(268, 30, 34, Math.PI, Math.PI / 2, true); p.lineTo(270, 234); p.arc(268, 268, 34, -Math.PI / 2, Math.PI, true); p.lineTo(66, 270); p.arc(32, 268, 34, 0, -Math.PI / 2, true); p.lineTo(30, 66); p.arc(32, 32, 34, Math.PI / 2, 0, true); p.closePath(); } },

};
let shape = 'card', photoMode = 'color';
function outline(t, k) {
  const S = SHAPES[t], base = new Path2D(); S.path(base);
  const q = new Path2D(); q.addPath(base, new DOMMatrix().translate(S.sc[0], S.sc[1]).scale(k).translate(-S.sc[0], -S.sc[1])); return q;
}
function selectPhoto(m) {
  photoMode = m;
  document.querySelectorAll('[data-photo]').forEach(b => b.classList.toggle('active', b.dataset.photo === m));
  drawCoin();
}
function selectShape(t) {
  shape = t;
  const row = document.getElementById('photo-style-row'); if (row) row.style.display = SHAPES[t].custom ? 'none' : '';
  document.querySelectorAll('[data-shape]').forEach(b => b.classList.toggle('active', b.dataset.shape === t));
  drawCoin();
}
function sparkle(x, y, r, a) {
  ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.moveTo(x, y - r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.quadraticCurveTo(x, y, x, y + r); ctx.quadraticCurveTo(x, y, x - r, y); ctx.quadraticCurveTo(x, y, x, y - r); ctx.fill();
  const g = ctx.createRadialGradient(x, y, 0, x, y, r * .9); g.addColorStop(0, 'rgba(255,255,255,.6)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r * .9, 0, TAU); ctx.fill(); ctx.restore();
}
function diamond(x, y, r) { const p = new Path2D(); p.moveTo(x, y - r * 1.3); p.lineTo(x + r, y); p.lineTo(x, y + r * 1.3); p.lineTo(x - r, y); p.closePath(); return p; }
function mring(r, w, c1, c2) {
  const g = ctx.createLinearGradient(-r, -r, r, r); g.addColorStop(0, c1); g.addColorStop(1, c2);
  ctx.strokeStyle = g; ctx.lineWidth = w; ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
}
const serialOf = n => { let h = 0; for (const c of n) h = (h * 31 + c.codePointAt(0)) % 9000; return 'NO. ' + String(1000 + h); };
// 이름 명판: 가는 이중선 프레임 + 자간을 넓힌 음각 이름
function plaque(P, text, y, w) {
  const x0 = 150 - w / 2, x1 = 150 + w / 2, h = 13, p = new Path2D();
  p.moveTo(x0, y - h); p.lineTo(x1, y - h); p.lineTo(x1 + 8, y); p.lineTo(x1, y + h); p.lineTo(x0, y + h); p.lineTo(x0 - 8, y); p.closePath();
  ctx.save(); ctx.translate(1.2, 1.8); ctx.globalAlpha = .5; ctx.fillStyle = P.dark; ctx.fill(p); ctx.restore();
  const g = ctx.createLinearGradient(x0, y - h, x1, y + h); g.addColorStop(0, P.hi); g.addColorStop(.35, P.light); g.addColorStop(1, mix(P.base, P.dark, .25));
  ctx.fillStyle = g; ctx.fill(p);
  ctx.lineJoin = 'round'; ctx.lineWidth = 1.1; ctx.strokeStyle = P.dark; ctx.stroke(p);
  const inner = new Path2D(); inner.addPath(p, new DOMMatrix().translate(150, y).scale(.9, .72).translate(-150, -y));
  ctx.lineWidth = .6; ctx.strokeStyle = 'rgba(70,45,10,.55)'; ctx.stroke(inner);
  const chars = [...text], sp = chars.length > 7 ? 1 : 2.2;
  ctx.font = 'bold 10px "Cinzel","Gowun Batang",serif';
  const base = chars.reduce((a, c) => a + ctx.measureText(c).width + sp, -sp);
  const size = Math.max(8.5, Math.min(14, 10 * (w - 10) / base));
  ctx.font = `bold ${size}px "Cinzel","Gowun Batang",serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
  const ws = chars.map(c => ctx.measureText(c).width), total = ws.reduce((a, b) => a + b, 0) + sp * (chars.length - 1);
  let x = 150 - total / 2; chars.forEach((c, i) => { carve(c, x + ws[i] / 2, y + size * .35, 0, P); x += ws[i] + sp; });
}
// ===== 풀컬러 굿즈: 홀로그램 포토카드 · 캔뱃지 =====
const HOLO = [[0, '#FFB8E0'], [.18, '#FFD9B0'], [.34, '#FFF6B8'], [.5, '#B8FFE4'], [.66, '#B0E6FF'], [.82, '#D8C2FF'], [1, '#FFB8E0']];
function rrect(x, y, w, h, r) { const p = new Path2D(); p.moveTo(x + r, y); p.arcTo(x + w, y, x + w, y + h, r); p.arcTo(x + w, y + h, x, y + h, r); p.arcTo(x, y + h, x, y, r); p.arcTo(x, y, x + w, y, r); p.closePath(); return p; }
// 이미지를 영역에 꽉 채우기(얼굴이 잘리지 않게 위쪽 기준)
function cover(img, x, y, w, h, fy = .3) { const k = Math.max(w / img.width, h / img.height), iw = img.width * k, ih = img.height * k; ctx.drawImage(img, x + (w - iw) / 2, y + (h - ih) * fy, iw, ih); }
function drawPhoto(P) {
  if (photoMode === 'color') { cover(avatar, 150 - R, 150 - R, 2 * R, 2 * R); return; }
  const key = metal + avatarId + '@' + SCALE;
  if (key !== reliefKey) { relief = buildRelief(P); reliefKey = key; }
  ctx.drawImage(relief, 150 - R, 150 - R, 2 * R, 2 * R);
}
// 마감별 포일: 오로라는 홀로그램 무지개, 나머지는 금속 포일
function foil(x0, y0, x1, y1, P) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  (metal === 'aurora' ? HOLO : [[0, P.hi], [.2, P.light], [.42, P.base], [.58, P.hi], [.78, P.base], [1, P.dark]]).forEach(([t, c]) => g.addColorStop(t, c));
  return g;
}
const GLIT = (() => { let q = 11; const r = () => (q = (q * 16807) % 2147483647) / 2147483647; return Array.from({ length: 520 }, () => [r() * 300, r() * 300, r() * .8 + .2, r()]); })();
function glitter(alpha) { GLIT.forEach(([x, y, r, a]) => { ctx.globalAlpha = alpha * (.25 + .75 * a); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x, y, r * .55, 0, TAU); ctx.fill(); }); ctx.globalAlpha = 1; }
function spaced(text, x, y, gap, align) {
  const ch = [...text], ws = ch.map(c => ctx.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0) + gap * (ch.length - 1);
  let cx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x; const ta = ctx.textAlign; ctx.textAlign = 'left';
  ch.forEach((c, i) => { ctx.fillText(c, cx, y); cx += ws[i] + gap; }); ctx.textAlign = ta; return tw;
}
// 그림이 없을 때: 에나멜 색 그라데이션 + 동심원 무늬 + 포일 이니셜
function placeholderArt(P, x, y, w, h, name, cy) {
  const E = P.enamel, g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, mix(E[0], '#FFFFFF', .28)); g.addColorStop(.55, E[0]); g.addColorStop(1, E[1]);
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const ccx = x + w / 2; ctx.lineWidth = .6;
  for (let r = 14; r < 260; r += 8) { ctx.strokeStyle = `rgba(255,255,255,${.12 - r / 3200})`; ctx.beginPath(); ctx.arc(ccx, cy, r, 0, TAU); ctx.stroke(); }
  const lg = ctx.createRadialGradient(ccx, cy - 20, 4, ccx, cy, 120); lg.addColorStop(0, 'rgba(255,255,255,.35)'); lg.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = lg; ctx.fillRect(x, y, w, h);
  ctx.font = 'bold 118px "Cinzel Decorative","Song Myung",serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const ch = [...name][0] || 'G';
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.35)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 4; ctx.fillStyle = foil(ccx - 50, cy - 60, ccx + 50, cy + 60, P); ctx.fillText(ch, ccx, cy); ctx.restore();
  ctx.textBaseline = 'alphabetic';
}
function holoSheen(x, y, w, h, strong) {
  ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = strong ? .6 : .22;
  const hs = ctx.createLinearGradient(x, y, x + w, y + h); HOLO.forEach(([t, c]) => hs.addColorStop(t, c)); ctx.fillStyle = hs; ctx.fillRect(x, y, w, h);
  ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  const st = ctx.createLinearGradient(x, y + h * .05, x + w, y + h * .65);
  st.addColorStop(.36, 'rgba(255,255,255,0)'); st.addColorStop(.46, 'rgba(255,255,255,.2)'); st.addColorStop(.5, 'rgba(255,255,255,.05)'); st.addColorStop(.56, 'rgba(255,255,255,.14)'); st.addColorStop(.64, 'rgba(255,255,255,0)');
  ctx.fillStyle = st; ctx.fillRect(x, y, w, h);
}
function renderCard(P, name) {
  const X = 52, Y = 6, W = 196, H = 288, card = rrect(X, Y, W, H, 14);
  ctx.fillStyle = foil(X, Y, X + W, Y + H, P); ctx.fill(card);
  ctx.save(); ctx.clip(card); glitter(metal === 'aurora' ? .7 : .5);
  const ed = ctx.createLinearGradient(X, Y, X + W, Y + H); ed.addColorStop(0, 'rgba(255,255,255,.35)'); ed.addColorStop(.5, 'rgba(255,255,255,0)'); ed.addColorStop(1, 'rgba(0,0,0,.18)');
  ctx.fillStyle = ed; ctx.fillRect(X, Y, W, H); ctx.restore();
  const ax = X + 8, ay = Y + 8, aw = W - 16, ah = H - 16, art = rrect(ax, ay, aw, ah, 9);
  ctx.save(); ctx.clip(art);
  if (avatar) cover(avatar, ax, ay, aw, ah, .25); else placeholderArt(P, ax, ay, aw, ah, name, ay + ah * .42);
  holoSheen(ax, ay, aw, ah, metal === 'aurora');
  const tf = ctx.createLinearGradient(0, ay, 0, ay + 46); tf.addColorStop(0, 'rgba(12,10,24,.45)'); tf.addColorStop(1, 'rgba(12,10,24,0)'); ctx.fillStyle = tf; ctx.fillRect(ax, ay, aw, 46);
  const bf = ctx.createLinearGradient(0, ay + ah * .56, 0, ay + ah); bf.addColorStop(0, 'rgba(12,10,24,0)'); bf.addColorStop(1, 'rgba(12,10,24,.78)'); ctx.fillStyle = bf; ctx.fillRect(ax, ay + ah * .5, aw, ah * .5);
  ctx.restore();
  ctx.lineWidth = .9; ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.stroke(art);
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.stroke(card);
  // 글자: 상단 로고·번호, 하단 이름(포일)·컬렉션 문구
  ctx.textBaseline = 'alphabetic'; ctx.fillStyle = 'rgba(255,255,255,.92)';
  ctx.font = 'bold 6.6px "Cinzel","Gowun Batang",serif'; spaced(BRAND, ax + 11, ay + 17, 1.6, 'left');
  ctx.font = 'bold 6.6px "Cinzel","Gowun Batang",serif'; spaced(serialOf(name), ax + aw - 11, ay + 17, 1.2, 'right');
  let fs = 26; ctx.font = `bold ${fs}px "Cinzel","Gowun Batang",serif`;
  const nw = [...name].reduce((a, c) => a + ctx.measureText(c).width + 1.5, 0); if (nw > aw - 24) fs = Math.max(12, fs * (aw - 24) / nw);
  ctx.font = `bold ${fs}px "Cinzel","Gowun Batang",serif`;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 1.5; ctx.fillStyle = foil(ax, ay + ah - 70, ax + aw, ay + ah, P);
  spaced(name, ax + 12, ay + ah - 30, 1.5, 'left'); ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(ax + 12, ay + ah - 22); ctx.lineTo(ax + aw - 12, ay + ah - 22); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = 'bold 6.2px "Cinzel","Gowun Batang",serif';
  spaced('OFFICIAL COLLECTION', ax + 12, ay + ah - 11, 1.6, 'left'); spaced('MMXXVI', ax + aw - 12, ay + ah - 11, 1.6, 'right');
  sparkle(X + W - 16, Y + 40, 8, .95); sparkle(X + 20, Y + H - 82, 5, .85); sparkle(X + W - 30, Y + H - 98, 4, .8);
}
function arcFill(text, r, bottom, font, gap) {
  ctx.font = font; ctx.textAlign = 'center';
  const chars = [...text], w = chars.map(c => ctx.measureText(c).width + gap), d = bottom ? -1 : 1, y = bottom ? r : -r;
  let a = -d * (w.reduce((s, x) => s + x, 0) / r) / 2;
  chars.forEach((ch, i) => { const st = w[i] / r; a += d * st / 2; ctx.save(); ctx.rotate(a); ctx.fillText(ch, 0, y); ctx.restore(); a += d * st / 2; });
}
function renderCan(P, name) {
  const C = 150, r = 140;
  ctx.fillStyle = foil(20, 20, 280, 280, P); ctx.beginPath(); ctx.arc(C, C, r, 0, TAU); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(C, C, r - 5, 0, TAU); ctx.clip();
  if (avatar) cover(avatar, C - r, C - r, 2 * r, 2 * r, .3); else placeholderArt(P, C - r, C - r, 2 * r, 2 * r, name, C - 8);
  holoSheen(C - r, C - r, 2 * r, 2 * r, metal === 'aurora');
  const bf = ctx.createLinearGradient(0, C + 40, 0, C + r); bf.addColorStop(0, 'rgba(12,10,24,0)'); bf.addColorStop(1, 'rgba(12,10,24,.7)'); ctx.fillStyle = bf; ctx.fillRect(0, C + 40, 300, r);
  // 캔뱃지 특유의 둥근 가장자리 그림자 + 유광 돔 반사
  const vg = ctx.createRadialGradient(C, C, r * .72, C, C, r); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.28)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, 300, 300);
  const gl = ctx.createLinearGradient(C - 100, C - 120, C - 10, C - 20); gl.addColorStop(0, 'rgba(255,255,255,.55)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = gl; ctx.beginPath(); ctx.ellipse(C - 48, C - 70, 82, 40, -.62, 0, TAU); ctx.fill();
  ctx.restore();
  ctx.save(); ctx.translate(C, C); ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = 'rgba(255,255,255,.95)'; ctx.shadowColor = 'rgba(0,0,0,.5)'; ctx.shadowBlur = 4;
  arcFill(BRAND, r - 22, false, 'bold 9px "Cinzel","Gowun Batang",serif', 2.2);
  ctx.fillStyle = foil(-80, 60, 80, 140, P); ctx.shadowBlur = 6;
  let fs = 19; ctx.font = `bold ${fs}px "Cinzel","Gowun Batang",serif`; const nw = [...name].reduce((a, c) => a + ctx.measureText(c).width + 1.8, 0); if (nw > 170) fs = Math.max(11, fs * 170 / nw);
  arcFill(name, r - 14, true, `bold ${fs}px "Cinzel","Gowun Batang",serif`, 1.8);
  ctx.restore();
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.arc(C, C, r - 5, 0, TAU); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.arc(C, C, r, 0, TAU); ctx.stroke();
  sparkle(C + 92, C - 92, 9, .95); sparkle(C + 108, C - 64, 4.5, .85);
}
function render() {
  const P = METALS[metal], name = ($('coin-name-input').value.trim() || 'GUEST').toUpperCase(), S = SHAPES[shape];
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.clearRect(0, 0, 300, 300);
  if (S.custom === 'card') { renderCard(P, name); return; }
  if (S.custom === 'can') { renderCan(P, name); return; }
  const out = k => outline(shape, k);
  const conic = (a, alpha) => { if (!ctx.createConicGradient) return; const cg = ctx.createConicGradient(a, 150, 150);
    [[0, P.light], [.12, P.hi], [.26, P.base], [.4, mix(P.base, P.dark, .32)], [.52, P.light], [.64, P.hi], [.78, P.base], [.9, mix(P.base, P.dark, .32)], [1, P.light]].forEach(([t, c]) => cg.addColorStop(t, c));
    ctx.globalAlpha = alpha; ctx.fillStyle = cg; ctx.fillRect(0, 0, 300, 300); ctx.globalAlpha = 1; };

  // 1. 판 → 솟은 테두리 → 한 단 파인 안쪽 면
  const g0 = ctx.createLinearGradient(30, 20, 270, 290); g0.addColorStop(0, P.light); g0.addColorStop(.5, P.base); g0.addColorStop(1, mix(P.base, P.dark, .4));
  ctx.fillStyle = g0; ctx.fill(out(1));
  ctx.save(); ctx.clip(out(1)); ctx.lineJoin = 'round';
  const gr = ctx.createLinearGradient(20, 20, 280, 280); gr.addColorStop(0, P.hi); gr.addColorStop(.45, P.light); gr.addColorStop(1, P.dark);
  ctx.strokeStyle = gr; ctx.lineWidth = 19; ctx.stroke(out(1)); ctx.restore();
  ctx.fillStyle = mix(P.base, P.dark, .1); ctx.fill(out(.925));

  // 2. 안쪽 면: 금속 광택 + 방사형 가는 선(아르데코) + 알갱이
  ctx.save(); ctx.clip(out(.925));
  conic(-.35, .42);
  ctx.translate(S.cx, S.cy); ctx.lineWidth = .55;
  for (let i = 0; i < 90; i++) {
    const a = i / 90 * TAU, c = Math.cos(a), sn = Math.sin(a);
    ctx.strokeStyle = 'rgba(255,248,220,.30)'; ctx.beginPath(); ctx.moveTo(c * 92, sn * 92); ctx.lineTo(c * 260, sn * 260); ctx.stroke();
    ctx.strokeStyle = 'rgba(60,40,10,.20)'; ctx.beginPath(); ctx.moveTo(c * 92 + .6, sn * 92 + .6); ctx.lineTo(c * 260 + .6, sn * 260 + .6); ctx.stroke();
  }
  ctx.restore();
  ctx.save(); ctx.clip(out(1));
  const pat = ctx.createPattern(grain, 'repeat');
  if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(1 / SCALE));
  ctx.globalCompositeOperation = 'overlay'; ctx.fillStyle = pat; ctx.fillRect(0, 0, 300, 300);
  if (metal === 'aurora') {   // 오로라: 진주빛 무지개 홀로그램 광택
    ctx.globalCompositeOperation = 'soft-light'; ctx.globalAlpha = .85;
    const ir = ctx.createLinearGradient(20, 30, 280, 270);
    [[0, '#FF9FD6'], [.25, '#9FE8FF'], [.5, '#FFF0A6'], [.75, '#C9A8FF'], [1, '#FF9FD6']].forEach(([t, c]) => ir.addColorStop(t, c));
    ctx.fillStyle = ir; ctx.fillRect(0, 0, 300, 300);
  }
  ctx.restore();
  // 테두리 선: 홈 + 가는 이중선 + 바깥 윤곽
  const gi = ctx.createLinearGradient(20, 20, 280, 280); gi.addColorStop(0, P.dark); gi.addColorStop(1, P.hi);
  ctx.lineJoin = 'round'; ctx.strokeStyle = gi; ctx.lineWidth = 1.6; ctx.stroke(out(.925));
  ctx.strokeStyle = 'rgba(255,246,215,.75)'; ctx.lineWidth = .7; ctx.stroke(out(.895));
  ctx.strokeStyle = P.dark; ctx.lineWidth = 1.5; ctx.stroke(out(1));

  // 3. 중앙 메달: 눈금 베젤 → 글귀 띠 → 에나멜 (카메오는 별도 구성)
  ctx.save(); ctx.translate(S.cx, S.cy); ctx.scale(S.ms || 1, S.ms || 1);
  for (let i = 0; i < 120; i++) {
    const len = i % 5 ? 2.4 : 4.6; ctx.save(); ctx.rotate(i * Math.PI / 60);
    ctx.strokeStyle = 'rgba(255,246,215,.85)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(.5, -85.2); ctx.lineTo(.5, -85.2 - len); ctx.stroke();
    ctx.strokeStyle = P.dark; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(0, -85); ctx.lineTo(0, -85 - len); ctx.stroke(); ctx.restore();
  }
  ctx.fillStyle = mix(P.base, P.light, .15); ctx.beginPath(); ctx.arc(0, 0, 82, 0, TAU); ctx.fill();
  if (!avatar && ctx.createConicGradient) {
    const cg = ctx.createConicGradient(-.6, 0, 0);
    [[0, P.light], [.12, P.hi], [.26, P.base], [.4, mix(P.base, P.dark, .3)], [.52, P.light], [.64, P.hi], [.78, P.base], [.9, mix(P.base, P.dark, .3)], [1, P.light]].forEach(([t, c]) => cg.addColorStop(t, c));
    ctx.save(); ctx.globalAlpha = .6; ctx.beginPath(); ctx.arc(0, 0, 81, 0, TAU); ctx.arc(0, 0, 63, 0, TAU, true); ctx.fillStyle = cg; ctx.fill(); ctx.restore();
  }
  mring(82, 2.4, P.dark, P.light);
  if (!avatar) mring(63.5, 3.6, P.hi, P.dark);
  if (!avatar) arcText(BRAND, 67.6, false, P, 'bold 8.4px "Cinzel","Gowun Batang",serif', 3);
  if (!avatar) arcText(serialOf(name) + ' · 2026', 73.6, true, P, 'bold 7.4px "Cinzel","Gowun Batang",serif', 2);
  if (!avatar) [[-1, 62], [1, 62]].forEach(([sd]) => raised2(diamond(sd * 72.5, 0, 2.2), P));
  if (avatar) {
    // 사진: 띠를 없애고 메달 안쪽 전체(반지름 약 78)를 사용 → 기존보다 훨씬 크게
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 77.6, 0, TAU); ctx.clip();
    ctx.scale(.88, .88); ctx.translate(-150, -150);
    ctx.fillStyle = mix(P.base, P.dark, .55); ctx.fillRect(0, 0, 300, 300);
    drawPhoto(P);
    ctx.restore();
    mring(78.4, 2.6, P.dark, P.hi); mring(80.6, 1.2, P.hi, P.dark);
  } else {
    ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 58.6, 0, TAU); ctx.clip();
    ctx.save(); ctx.scale(.62, .62); ctx.translate(-150, -150);
    enamelField(P); emblem(P, [...name][0] || 'G');
    ctx.restore();
    // 에나멜 유리 광택
    const gl = ctx.createLinearGradient(-40, -52, 12, 6); gl.addColorStop(0, 'rgba(255,255,255,.38)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gl; ctx.beginPath(); ctx.ellipse(-14, -30, 46, 22, -.6, 0, TAU); ctx.fill();
    ctx.restore();
    mring(59.4, 2, P.dark, P.hi);
  }
  ctx.restore();

  // 4. 모서리 장식(마름모) + 이름 명판
  S.studs.forEach(([x, y]) => raised2(diamond(x, y, 3.6), P));
  plaque(P, name, S.plaque.y, S.plaque.w);
  if (S.dd !== null) [-1, 1].forEach(sd => raised2(diamond(150 + sd * (S.dd || S.plaque.w / 2 + 24), S.plaque.y, 3.2), P));

  // 5. 광택
  ctx.save(); ctx.clip(out(.99));
  const sh = ctx.createLinearGradient(30, 30, 270, 270);
  sh.addColorStop(0, 'rgba(255,255,255,.18)'); sh.addColorStop(.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,0,0,.2)');
  ctx.fillStyle = sh; ctx.fillRect(0, 0, 300, 300);
  const bd = ctx.createLinearGradient(40, 30, 200, 190); bd.addColorStop(.3, 'rgba(255,255,255,0)'); bd.addColorStop(.4, 'rgba(255,255,255,.17)'); bd.addColorStop(.5, 'rgba(255,255,255,0)');
  ctx.fillStyle = bd; ctx.fillRect(0, 0, 300, 300); ctx.restore();
  sparkle(S.glint[0], S.glint[1], 11, .9); sparkle(S.glint[0] - 9, S.glint[1] + 11, 5, .75);
}
// 현재 좌표계 기준의 작은 부조 (그라데이션을 도형 위치에 맞춰 생성)
function raised2(p, P) {
  ctx.save(); ctx.translate(.9, 1.2); ctx.globalAlpha = .6; ctx.fillStyle = P.dark; ctx.fill(p); ctx.restore();
  ctx.fillStyle = mix(P.light, P.hi, .5); ctx.fill(p); ctx.lineWidth = .6; ctx.strokeStyle = P.dark; ctx.stroke(p);
}

$('photo-group').addEventListener('click', e => { const b = e.target.closest('[data-photo]'); if (b) selectPhoto(b.dataset.photo); });
$('metal-group').addEventListener('click', e => { const b = e.target.closest('[data-metal]'); if (b) selectMetal(b.dataset.metal); });
$('coin-name-input').addEventListener('input', drawCoin);
$('shape-group').addEventListener('click', e => { const b = e.target.closest('[data-shape]'); if (b) selectShape(b.dataset.shape); });
$('btn-upload').addEventListener('click', () => $('coin-avatar-upload').click());
$('coin-avatar-upload').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f || !f.type.startsWith('image/')) return;
  const url = URL.createObjectURL(f), img = new Image();
  img.onload = () => { avatar = img; avatarId++; URL.revokeObjectURL(url); drawCoin(); };
  img.src = url;
});

/* ===== 저장: 고해상도(1800px) 투명 PNG ===== */
function badgeCanvas(size) {           // 화면 캔버스를 건드리지 않고 원하는 크기로 다시 그림
  const off = document.createElement('canvas'); off.width = off.height = size;
  const saved = [ctx, SCALE]; ctx = off.getContext('2d'); SCALE = size / 300;
  try { render(); } finally { [ctx, SCALE] = saved; }
  return off;
}
$('btn-download').addEventListener('click', () => {
  badgeCanvas(1800).toBlob(b => {
    const a = document.createElement('a'); a.download = `project-badge-${Date.now()}.png`; a.href = URL.createObjectURL(b); a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
});

selectMetal('gold'); selectShape('card'); selectPhoto('color');
Promise.all([
  document.fonts.load('bold 10px "Cinzel"'),
  document.fonts.load('bold 78px "Cinzel Decorative"'),
  document.fonts.load('bold 13px "Gowun Batang"'),
  document.fonts.load('16px "Song Myung"')
]).then(drawCoin).catch(() => {});

/* ===== 인생 두컷: 사진 2장을 순서대로 올리면 프레임에 합성 + 캐릭터 PNG 겹치기 =====
   캐릭터 PNG는 characters[id].booth 경로에 넣으면 자동으로 쓰입니다(없으면 자리표시 실루엣). */
const bcv = $('booth-canvas');
const BW = 600, BH = 1156, CUTS = [{ x:36, y:104, w:528, h:440 }, { x:36, y:572, w:528, h:440 }];   // 컷 비율 6:5 (캐릭터가 컷을 넉넉히 채우도록)
bcv.height = Math.round(bcv.width * BH / BW); bcv.style.aspectRatio = `${BW} / ${BH}`;
const booth = { char: charIds[0], frame: 'gold', side: 'right', bg: 'studio', photos: [null, null], cutouts: [null, null], tf: [{ zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }], sel: 0 };

/* --- 배경 교체: 사람만 오려내기 (Google MediaPipe 인물 분리 모델, Apache-2.0 · 무료 · 상업용 가능)
       모델과 실행 파일은 처음 배경을 바꿀 때 한 번만 불러옵니다. 사진은 기기 밖으로 나가지 않습니다. --- */
const MP_VER = '0.10.14';
const MP_BASE = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${MP_VER}`;
const MP_MODEL = 'https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite';
let segPromise = null, segFailed = false;
async function loadSegmenter() {
  let mod;
  try { mod = await import(`${MP_BASE}/vision_bundle.mjs`); } catch { mod = await import(MP_BASE); }
  const files = await mod.FilesetResolver.forVisionTasks(`${MP_BASE}/wasm`);
  return mod.ImageSegmenter.createFromOptions(files, { baseOptions: { modelAssetPath: MP_MODEL, delegate: 'CPU' }, runningMode: 'IMAGE', outputCategoryMask: false, outputConfidenceMasks: true });
}
function bgStatus(t) { $('booth-bg-status').textContent = t || ''; }
async function makeCutout(i) {
  const img = booth.photos[i]; if (!img || booth.cutouts[i]) return;
  booth.cutouts[i] = 'pending'; drawBooth();
  try {
    if (!segPromise) { bgStatus('배경 분리 기능을 불러오는 중이에요… (처음 한 번만)'); segPromise = loadSegmenter(); }
    const seg = await segPromise;
    bgStatus('사진에서 사람을 오려내는 중이에요…');
    const k = Math.min(1, 1024 / Math.max(img.width, img.height)), w = Math.round(img.width * k), h = Math.round(img.height * k);
    const src = document.createElement('canvas'); src.width = w; src.height = h; src.getContext('2d').drawImage(img, 0, 0, w, h);
    const res = seg.segment(src), m = res.confidenceMasks[0], conf = m.getAsFloat32Array(), mw = m.width, mh = m.height;
    // 모델에 따라 사람/배경 값이 반대일 수 있어, 가장자리와 가운데를 비교해 자동으로 맞춤
    let edge = 0, mid = 0, ne = 0, nm = 0;
    for (let y = 0; y < mh; y += 4) for (let x = 0; x < mw; x += 4) { const v = conf[y * mw + x]; if (x < mw * .08 || x > mw * .92 || y < mh * .05) { edge += v; ne++; } else if (Math.abs(x - mw / 2) < mw * .15 && Math.abs(y - mh * .5) < mh * .2) { mid += v; nm++; } }
    const invert = ne && nm && edge / ne > mid / nm;
    const mc = document.createElement('canvas'); mc.width = mw; mc.height = mh;
    const mctx = mc.getContext('2d'), md = mctx.createImageData(mw, mh);
    for (let j = 0; j < conf.length; j++) { const v = invert ? 1 - conf[j] : conf[j]; md.data[j * 4 + 3] = Math.max(0, Math.min(255, (v - .25) / .5 * 255)); }
    mctx.putImageData(md, 0, 0);
    if (res.close) res.close();
    const out = document.createElement('canvas'); out.width = w; out.height = h; const o = out.getContext('2d');
    o.drawImage(src, 0, 0); o.globalCompositeOperation = 'destination-in'; o.filter = 'blur(1.5px)'; o.drawImage(mc, 0, 0, w, h);
    // 사람이 있는 영역(bbox)만 잘라 둠
    let x0 = mw, y0 = mh, x1 = -1, y1 = -1;
    for (let y = 0; y < mh; y += 2) for (let x = 0; x < mw; x += 2) if (md.data[(y * mw + x) * 4 + 3] > 140) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) throw new Error('no person');
    const fx = w / mw, fy = h / mh, bx = Math.max(0, Math.floor(x0 * fx) - 4), by = Math.max(0, Math.floor(y0 * fy) - 4), bw = Math.min(w, Math.ceil(x1 * fx) + 6) - bx, bh = Math.min(h, Math.ceil(y1 * fy) + 6) - by;
    const crop = document.createElement('canvas'); crop.width = bw; crop.height = bh; crop.getContext('2d').drawImage(out, bx, by, bw, bh, 0, 0, bw, bh);
    booth.cutouts[i] = crop; bgStatus('');
  } catch (err) {
    booth.cutouts[i] = 'failed'; segFailed = true; segPromise = null;
    bgStatus(err && err.message === 'no person' ? '사진에서 사람을 찾지 못했어요. 사람이 잘 보이는 사진으로 바꿔 주세요.' : '사람 오려내기를 불러오지 못했어요. 인터넷 연결을 확인해 주세요. (그동안은 사진 가장자리를 부드럽게 처리해 넣어요)');
  }
  drawBooth();
}
function ensureCutouts() { booth.photos.forEach((p, i) => { if (p && !booth.cutouts[i]) makeCutout(i); }); }

/* --- 테마 배경: 외부 이미지 없이 코드로 직접 그림 (저작권·출처 표기 걱정 없음) --- */
function rng(seed) { let q = seed; return () => (q = (q * 16807) % 2147483647) / 2147483647; }
function drawBg(g, kind, x, y, w, h, seed) {
  const r = rng(seed * 97 + 13);
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const lin = (stops, x0 = x, y0 = y, x1 = x, y1 = y + h) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([t, c]) => gr.addColorStop(t, c)); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  const glow = (cx, cy, rad, col) => { const gr = g.createRadialGradient(cx, cy, 0, cx, cy, rad); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(x, y, w, h); };
  const bokeh = (n, cols, rmin, rmax, a) => { for (let i = 0; i < n; i++) { const cx = x + r() * w, cy = y + r() * h, rr = rmin + r() * (rmax - rmin); g.globalAlpha = a * (.4 + .6 * r()); g.fillStyle = cols[i % cols.length]; g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.fill(); } g.globalAlpha = 1; };
  if (kind === 'sunset') {
    lin([[0, '#3E3A8C'], [.45, '#C76B98'], [.75, '#F2A37C'], [1, '#FCD9A4']]);
    glow(x + w * .5, y + h * .62, w * .55, 'rgba(255,225,170,.75)');
    g.fillStyle = '#FFE9B8'; g.beginPath(); g.arc(x + w * .5, y + h * .62, w * .13, 0, TAU); g.fill();
    g.fillStyle = 'rgba(110,60,110,.85)'; g.beginPath(); g.moveTo(x, y + h * .78); g.quadraticCurveTo(x + w * .3, y + h * .64, x + w * .55, y + h * .76); g.quadraticCurveTo(x + w * .8, y + h * .68, x + w, y + h * .74); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.fill();
    g.fillStyle = 'rgba(70,40,90,.95)'; g.beginPath(); g.moveTo(x, y + h * .88); g.quadraticCurveTo(x + w * .4, y + h * .8, x + w, y + h * .9); g.lineTo(x + w, y + h); g.lineTo(x, y + h); g.fill();
  } else if (kind === 'night') {
    lin([[0, '#0E1638'], [.6, '#24306A'], [1, '#4B4F8F']]);
    for (let i = 0; i < 160; i++) { const cx = x + r() * w, cy = y + r() * h * .85, rr = r() < .9 ? .8 + r() * 1.2 : 2 + r() * 1.5; g.globalAlpha = .5 + .5 * r(); g.fillStyle = '#FFF8E6'; g.beginPath(); g.arc(cx, cy, rr, 0, TAU); g.fill(); }
    g.globalAlpha = 1; glow(x + w * .78, y + h * .2, w * .3, 'rgba(255,240,200,.35)');
    g.fillStyle = '#FFF3D0'; g.beginPath(); g.arc(x + w * .78, y + h * .2, w * .09, 0, TAU); g.fill();
    g.fillStyle = '#24306A'; g.beginPath(); g.arc(x + w * .81, y + h * .185, w * .08, 0, TAU); g.fill();
  } else if (kind === 'sakura') {
    lin([[0, '#FFE4EC'], [.6, '#FFD3DF'], [1, '#F9C2D0']]);
    glow(x + w * .3, y + h * .25, w * .6, 'rgba(255,255,255,.7)');
    g.save(); g.filter = 'blur(6px)'; bokeh(26, ['#FFFFFF', '#FFC1D4', '#FFB0C8'], 14, 40, .55); g.restore();
    for (let i = 0; i < 60; i++) { const cx = x + r() * w, cy = y + r() * h, s = 5 + r() * 7; g.save(); g.translate(cx, cy); g.rotate(r() * TAU); g.globalAlpha = .65 + .35 * r(); g.fillStyle = r() < .5 ? '#FF9EBB' : '#FFC3D5'; g.beginPath(); g.ellipse(0, 0, s, s * .6, 0, 0, TAU); g.fill(); g.restore(); }
  } else if (kind === 'sky') {
    lin([[0, '#6FB6F2'], [.65, '#A9D6F7'], [1, '#E4F2FC']]);
    glow(x + w * .2, y + h * .15, w * .5, 'rgba(255,255,240,.6)');
    g.save(); g.filter = 'blur(3px)'; g.fillStyle = 'rgba(255,255,255,.92)';
    for (let c = 0; c < 5; c++) { const cx = x + r() * w, cy = y + h * (.15 + r() * .6), sz = w * (.07 + r() * .06); for (let k = 0; k < 7; k++) { g.beginPath(); g.arc(cx + (k - 3) * sz * .7, cy + Math.sin(k) * sz * .25 - (k % 2) * sz * .35, sz * (.75 + r() * .4), 0, TAU); g.fill(); } }
    g.restore();
  } else if (kind === 'studio') {
    lin([[0, '#F6EFE3'], [1, '#E2D3BC']]);
    glow(x + w * .5, y + h * .38, w * .75, 'rgba(255,255,255,.85)');
    const fl = g.createLinearGradient(x, y + h * .78, x, y + h); fl.addColorStop(0, 'rgba(150,120,90,0)'); fl.addColorStop(1, 'rgba(150,120,90,.25)'); g.fillStyle = fl; g.fillRect(x, y, w, h);
  } else if (kind === 'holo') {
    lin(HOLO, x, y, x + w, y + h);
    glow(x + w * .5, y + h * .4, w * .7, 'rgba(255,255,255,.55)');
    g.save(); g.filter = 'blur(5px)'; bokeh(22, ['#FFFFFF', '#FFE3F4', '#DFF6FF'], 10, 34, .6); g.restore();
    for (let i = 0; i < 24; i++) bSparkle(g, x + r() * w, y + r() * h, 4 + r() * 9, .85);
  }
  g.restore();
}
const boothImgs = {};   // 경로 → { img, ok }
// 캐릭터 PNG 의 투명한 여백을 자동으로 잘라 냄 (가로로 넓게 그린 그림도 컷 안에 알맞게 들어가도록)
function trimAlpha(img) {
  try {
    const c = document.createElement('canvas'), w = c.width = img.naturalWidth, h = c.height = img.naturalHeight, g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const d = g.getImageData(0, 0, w, h).data; let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let y = 0; y < h; y += 2) for (let x = 0; x < w; x += 2) if (d[(y * w + x) * 4 + 3] > 16) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return img; x1 = Math.min(w - 1, x1 + 2); y1 = Math.min(h - 1, y1 + 2);
    const o = document.createElement('canvas'); o.width = x1 - x0 + 1; o.height = y1 - y0 + 1; o.getContext('2d').drawImage(c, x0, y0, o.width, o.height, 0, 0, o.width, o.height); return o;
  } catch { return img; }
}
function boothImg(src) {
  if (!src) return null;
  if (!boothImgs[src]) { const img = new Image(); boothImgs[src] = { img, ok: false }; img.onload = () => { boothImgs[src].img = trimAlpha(img); boothImgs[src].ok = true; drawBooth(); }; img.onerror = () => {}; img.src = src; }
  return boothImgs[src].ok ? boothImgs[src].img : null;
}
function bRR(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
function bFoil(g, x0, y0, x1, y1, key) {
  const P = METALS[key], gr = g.createLinearGradient(x0, y0, x1, y1);
  (key === 'aurora' ? HOLO : [[0, P.hi], [.2, P.light], [.42, P.base], [.58, P.hi], [.78, P.base], [1, P.dark]]).forEach(([t, c]) => gr.addColorStop(t, c));
  return gr;
}
function bSpaced(g, text, x, y, gap) {
  const ch = [...text], ws = ch.map(c => g.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0) + gap * (ch.length - 1);
  let cx = x - tw / 2; g.textAlign = 'left'; ch.forEach((c, i) => { g.fillText(c, cx, y); cx += ws[i] + gap; });
}
function bSparkle(g, x, y, r, a) {
  g.save(); g.globalAlpha = a; g.fillStyle = '#fff'; g.beginPath(); g.moveTo(x, y - r); g.quadraticCurveTo(x, y, x + r, y); g.quadraticCurveTo(x, y, x, y + r); g.quadraticCurveTo(x, y, x - r, y); g.quadraticCurveTo(x, y, x, y - r); g.fill(); g.restore();
}
// 캐릭터 PNG가 아직 없을 때: 반투명 실루엣 + 안내
function charPlaceholder(g, x, y, w, h, path) {
  g.save(); g.setLineDash([7, 6]); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.75)'; g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 3;
  const cx = x + w / 2; g.beginPath(); g.arc(cx, y + h * .2, w * .17, 0, TAU); g.stroke();
  g.beginPath(); g.moveTo(x + w * .12, y + h); g.bezierCurveTo(x + w * .12, y + h * .5, x + w * .88, y + h * .5, x + w * .88, y + h); g.stroke(); g.setLineDash([]);
  g.fillStyle = 'rgba(255,255,255,.9)'; g.font = 'bold 13px "Cinzel","Gowun Batang",serif'; g.textAlign = 'center'; g.fillText('CHARACTER', cx, y + h - 34);
  g.font = '11px Pretendard, sans-serif'; g.fillText(path.split('/').pop(), cx, y + h - 16);
  g.restore();
}
function renderBooth(g, scale) {
  const c = characters[booth.char], P = METALS[booth.frame];
  g.setTransform(scale, 0, 0, scale, 0, 0); g.clearRect(0, 0, BW, BH);
  // 종이 바탕 + 포일 테두리
  const bg = g.createLinearGradient(0, 0, BW, BH); bg.addColorStop(0, '#FCF9F2'); bg.addColorStop(1, '#EFE6D4');
  g.fillStyle = bg; g.fillRect(0, 0, BW, BH);
  g.strokeStyle = bFoil(g, 0, 0, BW, BH, booth.frame); g.lineWidth = 14; g.strokeRect(7, 7, BW - 14, BH - 14);
  g.strokeStyle = 'rgba(120,90,50,.35)'; g.lineWidth = 1; g.strokeRect(20, 20, BW - 40, BH - 40);
  // 머리글
  g.textBaseline = 'alphabetic'; g.fillStyle = '#3B2F22'; g.font = 'bold 24px "Cinzel","Gowun Batang",serif'; bSpaced(g, BRAND, BW / 2, 62, 5);
  g.fillStyle = mix(P.base, P.dark, .45); g.font = 'bold 12px "Cinzel","Gowun Batang",serif'; bSpaced(g, 'LIFE  ·  TWO  CUTS', BW / 2, 86, 3);
  // 두 컷
  CUTS.forEach((k, i) => {
    g.save(); bRR(g, k.x, k.y, k.w, k.h, 10); g.clip();
    const ph = booth.photos[i], cut = booth.cutouts[i], t = booth.tf[i];
    // 내 자리(58%)와 캐릭터 자리. 둘이 같은 배경 위에 나란히 서도록 구성
    const zw = k.w * .58, zx = booth.side === 'right' ? k.x : k.x + k.w - zw;
    // 1) 같은 배경 (테마)
    drawBg(g, booth.bg, k.x, k.y, k.w, k.h, i + 1);
    // 바닥 그림자: 두 사람이 같은 바닥에 서 있는 느낌
    const ground = (cx, w) => { const gg = g.createRadialGradient(cx, k.y + k.h, 2, cx, k.y + k.h, w); gg.addColorStop(0, 'rgba(40,25,10,.22)'); gg.addColorStop(1, 'rgba(40,25,10,0)'); g.save(); g.translate(0, k.y + k.h); g.scale(1, .18); g.translate(0, -(k.y + k.h)); g.fillStyle = gg; g.fillRect(cx - w, k.y + k.h - w, w * 2, w * 2); g.restore(); };
    // 2) 나
    if (ph) {
      if (cut instanceof HTMLCanvasElement) {
        // 오려낸 사람: 캐릭터와 비슷한 키로 맞춰 내 자리 가운데 세움
        let sc = k.h * .84 / cut.height * t.zoom; if (cut.width * sc > zw * 1.15 * t.zoom) sc = zw * 1.15 * t.zoom / cut.width;
        const iw = cut.width * sc, ih = cut.height * sc, x = zx + (zw - iw) / 2 + t.dx * k.w, y = k.y + k.h - ih + t.dy * k.h;
        ground(x + iw / 2, iw * .55);
        g.save(); g.shadowColor = 'rgba(40,25,10,.25)'; g.shadowBlur = 14; g.shadowOffsetY = 4; g.drawImage(cut, x, y, iw, ih); g.restore();
      } else {
        // 오려내기 전/실패: 사진을 꽉 채우지 않고 타원으로 부드럽게 녹여 넣음
        const ow = zw * .92, oh = k.h * .86, off = document.createElement('canvas'); off.width = Math.ceil(ow * scale); off.height = Math.ceil(oh * scale);
        const o = off.getContext('2d'); o.scale(scale, scale);
        const sc = Math.max(ow / ph.width, oh / ph.height) * t.zoom, iw = ph.width * sc, ih = ph.height * sc;
        o.drawImage(ph, (ow - iw) / 2 + t.dx * k.w, (oh - ih) * .35 + t.dy * k.h, iw, ih);
        o.globalCompositeOperation = 'destination-in'; o.filter = 'blur(16px)'; o.fillStyle = '#000';
        o.beginPath(); o.ellipse(ow / 2, oh / 2 + 10, ow / 2 - 26, oh / 2 - 22, 0, 0, TAU); o.fill(); o.filter = 'none';
        g.drawImage(off, zx + (zw - ow) / 2, k.y + k.h - oh, ow, oh);
        if (cut === 'pending') { g.fillStyle = 'rgba(30,25,40,.42)'; g.fillRect(k.x, k.y, k.w, k.h); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '20px "Gowun Batang", serif'; g.fillText('사진에서 사람을 오려내는 중…', k.x + k.w / 2, k.y + k.h / 2); }
      }
    } else {
      const cx = zx + zw / 2; g.fillStyle = 'rgba(60,45,35,.8)'; g.shadowColor = 'rgba(255,255,255,.9)'; g.shadowBlur = 6; g.textAlign = 'center';
      g.font = 'bold 54px "Cinzel","Gowun Batang",serif'; g.fillText(String(i + 1).padStart(2, '0'), cx, k.y + k.h * .45);
      g.font = '18px "Gowun Batang", serif'; g.fillText(`${i + 1}번째 사진의`, cx, k.y + k.h * .45 + 34); g.fillText('사람이 여기 서요', cx, k.y + k.h * .45 + 58); g.shadowBlur = 0;
    }
    // 캐릭터 (아래쪽 기준, 좌/우)
    const src = c.booth && c.booth[i], ci = boothImg(src);
    if (ci) { let chH = k.h * .9, chW = ci.width * chH / ci.height; if (chW > k.w * .68) { chW = k.w * .68; chH = ci.height * chW / ci.width; }   /* 넓은 그림은 컷 폭의 68% 까지만 */ const x = booth.side === 'right' ? k.x + k.w - chW * .96 : k.x - chW * .04; ground(x + chW / 2, chW * .5); g.drawImage(ci, x, k.y + k.h - chH, chW, chH); }
    else if (src) { const chH = k.h * .88, chW = k.w * .44, x = booth.side === 'right' ? k.x + k.w - chW - 10 : k.x + 10; charPlaceholder(g, x, k.y + k.h - chH, chW, chH, src); }
    // 사진 톤: 은은한 따뜻함 + 가장자리
    g.fillStyle = 'rgba(255,236,210,.06)'; g.fillRect(k.x, k.y, k.w, k.h);
    const vg = g.createRadialGradient(k.x + k.w / 2, k.y + k.h / 2, k.h * .35, k.x + k.w / 2, k.y + k.h / 2, k.h * .8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.16)'); g.fillStyle = vg; g.fillRect(k.x, k.y, k.w, k.h);
    g.restore();
    bRR(g, k.x, k.y, k.w, k.h, 10); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.9)'; g.stroke();
    g.fillStyle = 'rgba(255,255,255,.95)'; g.font = 'bold 14px "Cinzel","Gowun Batang",serif'; g.textAlign = 'left'; g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 4;
    g.fillText(`CUT ${String(i + 1).padStart(2, '0')}`, k.x + 16, k.y + 30); g.shadowBlur = 0;
  });
  // 바닥글: with 캐릭터 · 날짜 · 이름 · 번호
  const user = ($('username').value.trim() || $('coin-name-input').value.trim() || 'GUEST');
  const d = new Date(), date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  g.textAlign = 'center'; g.fillStyle = '#3B2F22'; g.font = '30px "Song Myung","Gowun Batang",serif'; g.fillText(`with ${c.name}`, BW / 2, BH - 88);
  g.fillStyle = bFoil(g, 150, BH - 80, 450, BH - 50, booth.frame); g.fillRect(BW / 2 - 90, BH - 74, 180, 1.5);
  g.fillStyle = '#5A4A38'; g.font = 'bold 13px "Cinzel","Gowun Batang",serif'; bSpaced(g, `${date}  ·  ${user.toUpperCase()}  ·  ${serialOf(user.toUpperCase())}`, BW / 2, BH - 44, 2);
  bSparkle(g, 66, BH - 100, 12, .9); bSparkle(g, 534, BH - 70, 9, .9);
}
function drawBooth() { renderBooth(bcv.getContext('2d'), bcv.width / BW); updateBoothUI(); }
function updateBoothUI() {
  const n = booth.photos.filter(Boolean).length;
  $('booth-upload-btn').textContent = n === 0 ? '1번 사진 올리기' : n === 1 ? '2번 사진 올리기' : `${booth.sel + 1}번 사진 바꾸기`;
  $('booth-step').textContent = n === 0 ? `① 첫 번째 사진을 올려 주세요. 사진 속 사람만 오려내서 캐릭터 옆에 나란히 세워요. 사람이 또렷하게 나온 사진이 잘 어울려요.` : n === 1 ? '② 두 번째 사진을 올려 주세요.' : '완성! 마음에 들면 저장하세요. (Reset으로 처음부터)';
  $('booth-download').disabled = n < 2;
}
$('booth-char-group').innerHTML = charIds.map(id => `<button type="button" data-bchar="${id}" class="opt-btn kr">${esc(characters[id].name)}</button>`).join('');
const markActive = (attr, val) => document.querySelectorAll(`[data-${attr}]`).forEach(b => b.classList.toggle('active', b.dataset[attr] === val));
$('booth-char-group').addEventListener('click', e => { const b = e.target.closest('[data-bchar]'); if (b) { booth.char = b.dataset.bchar; markActive('bchar', booth.char); drawBooth(); } });
$('booth-frame-group').addEventListener('click', e => { const b = e.target.closest('[data-bframe]'); if (b) { booth.frame = b.dataset.bframe; markActive('bframe', booth.frame); drawBooth(); } });
$('booth-bg-group').addEventListener('click', e => { const b = e.target.closest('[data-bbg]'); if (!b) return; booth.bg = b.dataset.bbg; markActive('bbg', booth.bg); booth.cutouts = booth.cutouts.map(c => c === 'failed' ? null : c); ensureCutouts(); drawBooth(); });
$('booth-side-group').addEventListener('click', e => { const b = e.target.closest('[data-bside]'); if (b) { booth.side = b.dataset.bside; markActive('bside', booth.side); drawBooth(); } });
let moveMode = false;
function setMove(on) {
  moveMode = on; bcv.style.touchAction = on ? 'none' : 'pan-y'; bcv.style.cursor = on ? 'grab' : '';
  bcv.style.boxShadow = on ? '0 0 0 3px #B8914A, 0 12px 40px rgba(40,30,10,.22)' : '';
  const b = $('booth-move'); b.textContent = on ? '사진 옮기기 · 켜짐' : '사진 옮기기 · 꺼짐'; b.setAttribute('aria-pressed', on); b.classList.toggle('active', on);
}
$('booth-move').addEventListener('click', () => setMove(!moveMode));
function selectCut(i) { booth.sel = i; $('booth-sel').textContent = `CUT 0${i + 1}`; $('booth-zoom').value = Math.round(booth.tf[i].zoom * 100); }
$('booth-zoom').addEventListener('input', e => { booth.tf[booth.sel].zoom = e.target.value / 100; drawBooth(); });
{ let drag = null;
  const pt = e => { const r = bcv.getBoundingClientRect(); return [(e.clientX - r.left) * BW / r.width, (e.clientY - r.top) * BH / r.height]; };
  bcv.addEventListener('pointerdown', e => {
    const [x, y] = pt(e), i = CUTS.findIndex(k => x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h); if (i < 0) return;
    selectCut(i); if (!booth.photos[i] || !moveMode) return;
    drag = { i, x, y, dx: booth.tf[i].dx, dy: booth.tf[i].dy }; bcv.setPointerCapture(e.pointerId); bcv.style.cursor = 'grabbing';
  });
  bcv.addEventListener('pointermove', e => { if (!drag) return; const [x, y] = pt(e), k = CUTS[drag.i]; booth.tf[drag.i].dx = drag.dx + (x - drag.x) / k.w; booth.tf[drag.i].dy = drag.dy + (y - drag.y) / k.h; drawBooth(); });
  const end = () => { drag = null; bcv.style.cursor = moveMode ? 'grab' : ''; }; bcv.addEventListener('pointerup', end); bcv.addEventListener('pointercancel', end);
}
$('booth-upload-btn').addEventListener('click', () => $('booth-upload').click());
$('booth-upload').addEventListener('change', e => {
  const f = e.target.files[0]; e.target.value = ''; if (!f || !f.type.startsWith('image/')) return;
  const url = URL.createObjectURL(f), raw = new Image();
  raw.onload = () => {
    const k = Math.min(1, 1600 / Math.max(raw.width, raw.height)), img = document.createElement('canvas');
    img.width = Math.round(raw.width * k); img.height = Math.round(raw.height * k); img.getContext('2d').drawImage(raw, 0, 0, img.width, img.height);
    const sm = document.createElement('canvas'), q = 140 / Math.max(img.width, img.height); sm.width = Math.max(1, Math.round(img.width * q)); sm.height = Math.max(1, Math.round(img.height * q));
    const sg = sm.getContext('2d'); sg.filter = 'blur(4px)'; sg.drawImage(img, 0, 0, sm.width, sm.height); img.blurred = sm;
    const i = !booth.photos[0] ? 0 : !booth.photos[1] ? 1 : booth.sel; booth.photos[i] = img; booth.cutouts[i] = null; booth.tf[i] = { zoom: 1, dx: 0, dy: 0 }; selectCut(i); URL.revokeObjectURL(url); ensureCutouts(); drawBooth(); };
  raw.onerror = () => { URL.revokeObjectURL(url); $('booth-step').textContent = '이 사진은 열 수 없어요. 다른 사진(JPG/PNG)을 올려 주세요.'; };
  raw.src = url;
});
$('booth-reset').addEventListener('click', () => { booth.photos = [null, null]; booth.cutouts = [null, null]; booth.tf = [{ zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }]; selectCut(0); setMove(false); bgStatus(''); drawBooth(); });
$('booth-download').addEventListener('click', () => {
  const off = document.createElement('canvas'); off.width = BW * 2; off.height = BH * 2; renderBooth(off.getContext('2d'), 2);
  off.toBlob(b => { const a = document.createElement('a'); a.download = `life-2cut-${Date.now()}.png`; a.href = URL.createObjectURL(b); a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }, 'image/png');
});
if (SINGLE && $('booth-char-row')) $('booth-char-row').style.display = 'none';
markActive('bchar', booth.char); markActive('bframe', booth.frame); markActive('bside', booth.side); markActive('bbg', booth.bg);
drawBooth();
document.fonts && document.fonts.ready.then(drawBooth);

/* ===== 떠다니는 문장: 5초마다 화면 곳곳에 랜덤 문장 (터치·클릭에 영향 없음) =====
   문장은 각 작품 data.js의 ticker 배열에서 가져옵니다(비어 있으면 A~J 임시 문구). */
const TICKER = (ARCHIVE.ticker && ARCHIVE.ticker.length) ? ARCHIVE.ticker : Array.from({ length: 10 }, (_, i) => `${String.fromCharCode(65 + i)}문구가 출력 중입니다.`);
let tickTimer = null, bag = [], lastLine = '';
const whisper = document.createElement('div'); whisper.id = 'whisper'; whisper.setAttribute('aria-hidden', 'true'); document.body.appendChild(whisper);
function nextLine() {   // 섞은 뒤 하나씩 꺼냄 → 무작위지만 같은 문장이 연달아 나오지 않음
  if (!bag.length) { bag = TICKER.slice(); for (let i = bag.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [bag[i], bag[j]] = [bag[j], bag[i]]; } if (bag.length > 1 && bag[bag.length - 1] === lastLine) bag.unshift(bag.pop()); }
  return (lastLine = bag.pop());
}
function showWhisper() {
  whisper.classList.remove('show');
  setTimeout(() => {
    whisper.textContent = nextLine();
    const vw = innerWidth, vh = innerHeight, w = Math.min(whisper.offsetWidth || 260, vw * .8);
    whisper.style.left = Math.round(vw * .06 + Math.random() * Math.max(0, vw * .88 - w)) + 'px';
    whisper.style.top = Math.round(vh * (.14 + Math.random() * .6)) + 'px';
    requestAnimationFrame(() => whisper.classList.add('show'));
  }, 1100);
}
function startTicker() {
  if (tickTimer) return;
  $('player').classList.remove('hidden'); renderAudioUI();
  showWhisper(); tickTimer = setInterval(showWhisper, 5000);
}

/* ===== 페이지 II: 표정·상황 갤러리 =====
   각 캐릭터의 gallery: [{ img, label, desc, secret }] 를 data.js 에 적으면 자동으로 그려져요.
   (선택) secret:true 를 붙이면 흐리게 가려지고, 누르면 크랙 대화로 이어져요. 기본은 전부 공개. 이미지가 아직 없으면 '이미지 준비 중'으로 보여요. */
(() => {
  const p = ARCHIVE.page || {}, box = $('gallery'); if (!box) return;
  if (p.galleryTitle) $('gallery-title').textContent = p.galleryTitle;
  if (p.gallerySub) $('gallery-sub').textContent = p.gallerySub;
  const list = charIds.filter(id => (characters[id].gallery || []).length);
  if (!list.length) { box.innerHTML = '<p class="note" style="text-align:center">곧 새로운 이미지가 열립니다.</p>'; return; }
  const crackOf = c => c.crack || p.crackUrl || '', GPAGE = 6;   // 처음에 보여 줄 장수 (나머지는 '더 보기')
  box.innerHTML = list.map(id => { const c = characters[id], url = crackOf(c); return `
    <div class="gal-block" data-gchar="${id}">
      ${list.length > 1 ? `<div class="sec-head center" style="margin-bottom:22px"><p class="label">${esc(c.nameEn || '')}</p><h3 class="sec-title" style="font-size:26px">${esc(c.name)}</h3></div>` : ''}
      <div class="gal-grid">
        ${c.gallery.map((g, i) => `
        <button type="button" data-gi="${i}" class="gitem${i >= GPAGE ? ' g-more hidden' : ''}">
          <span class="fr">
            <span class="ph">이미지 준비 중</span>
            ${g.img ? `<img src="${esc(g.img)}" alt="${esc(c.name + ' - ' + (g.label || ''))}" loading="lazy" style="${g.secret ? 'filter:blur(14px) saturate(.8);transform:scale(1.15)' : ''}" onload="this.previousElementSibling.style.display='none'" onerror="this.remove()">` : ''}
            ${g.secret ? `<span class="lk">대화에서 만나요</span>` : ''}
          </span>
          <span class="no">No. ${String(i + 1).padStart(2, '0')}</span>
          <span class="lb">${esc(g.secret ? (g.label || '???') : (g.label || ''))}</span>${g.desc ? `<span class="ds">${esc(g.desc)}</span>` : ''}
        </button>`).join('')}
      </div>
      <div class="gal-foot">
        ${c.gallery.length > GPAGE ? `<button type="button" data-gmore class="btn ghost">더 보기 (+${c.gallery.length - GPAGE}장)</button>` : ''}
        ${url ? `<a href="${esc(url)}" target="_blank" rel="noopener" class="btn solid">${esc(c.name)}${josa(c.name)} 대화하러 가기</a>` : ''}
      </div>
    </div>`; }).join('');

  // 크게 보기 (같은 캐릭터 안에서 ‹ › 이동, 가린 이미지는 건너뜀)
  const gv = $('gviewer'); let cur = null, idx = 0, lastF = null;
  const open = (id, i) => { cur = id; idx = i; lastF = document.activeElement; paint(); gv.classList.replace('hidden', 'flex'); $('gv-close').focus(); };
  const shown = () => characters[cur].gallery.map((g, i) => i).filter(i => !characters[cur].gallery[i].secret);
  const paint = () => { const g = characters[cur].gallery[idx], img = $('gv-img'); img.style.display = ''; img.src = g.img || ''; img.alt = g.label || ''; img.onerror = () => { img.style.display = 'none'; };
    $('gv-label').textContent = g.label || ''; $('gv-desc').textContent = g.desc || ''; const n = shown().length; $('gv-count').textContent = n > 1 ? `${shown().indexOf(idx) + 1} / ${n}` : ''; $('gv-prev').style.display = $('gv-next').style.display = n > 1 ? '' : 'none'; };
  const move = d => { const s = shown(), k = s.indexOf(idx); idx = s[(k + d + s.length) % s.length]; paint(); };
  const close = () => { gv.classList.replace('flex', 'hidden'); $('gv-img').removeAttribute('src'); if (lastF) lastF.focus(); };
  box.addEventListener('click', e => {
    const more = e.target.closest('[data-gmore]');
    if (more) { const blk = more.closest('[data-gchar]'), rest = [...blk.querySelectorAll('.g-more.hidden')]; rest.slice(0, 12).forEach(x => x.classList.remove('hidden'));
      const left = rest.length - 12; if (left > 0) more.textContent = `더 보기 (+${left}장)`; else more.remove(); return; }
    const b = e.target.closest('[data-gi]'); if (!b) return;
    const id = b.closest('[data-gchar]').dataset.gchar, i = +b.dataset.gi, g = characters[id].gallery[i];
    if (g.secret) { const url = crackOf(characters[id]); if (url) window.open(url, '_blank', 'noopener'); return; }
    open(id, i);
  });
  $('gv-close').addEventListener('click', close); $('gv-prev').addEventListener('click', () => move(-1)); $('gv-next').addEventListener('click', () => move(1));
  gv.addEventListener('click', e => { if (e.target === gv) close(); });
  document.addEventListener('keydown', e => { if (gv.classList.contains('hidden')) return; if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') move(-1); else if (e.key === 'ArrowRight') move(1); });
  // 휴대폰: 좌우로 밀어서 넘기기
  let sx = null; gv.addEventListener('touchstart', e => { sx = e.touches[0].clientX; }, { passive: true });
  gv.addEventListener('touchend', e => { if (sx === null) return; const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) move(dx < 0 ? 1 : -1); sx = null; }, { passive: true });
})();

/* ===== 페이지 이동 (하단 메뉴 바: I 기록 · II · III 제작소) — 한 파일 안에서 바뀌어 음악이 끊기지 않음 ===== */
function showPage(n, push) {
  n = String(n); if (!document.querySelector(`[data-page="${n}"]`)) n = '1';
  document.querySelectorAll('[data-page]').forEach(el => el.classList.toggle('page-hidden', el.dataset.page !== n));
  document.querySelectorAll('[data-goto]').forEach(b => { const on = b.dataset.goto === n; b.classList.toggle('active', on); if (on) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  if (push !== false) { try { history.replaceState(null, '', '#p' + n); } catch {} }
  window.scrollTo({ top: 0, behavior: 'instant' in document.documentElement.style ? 'instant' : 'auto' });
  if (n === '3') { drawCoin(); drawBooth(); }
}
$('page-nav').addEventListener('click', e => { const b = e.target.closest('[data-goto]'); if (b) showPage(b.dataset.goto); });
showPage((location.hash.match(/^#p([123])$/) || [])[1] || '1', false);
window.addEventListener('hashchange', () => { const m = location.hash.match(/^#p([123])$/); if (m) showPage(m[1], false); });

/* ===== 상단 바: 표지 사진 위에서는 투명하게 ===== */
(() => {
  const upd = () => { const onHero = document.body.classList.contains('has-hero') && !$('hero').classList.contains('page-hidden') && scrollY < Math.max(120, $('hero-media').offsetHeight - 140); document.body.classList.toggle('on-hero', onHero); };
  addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); $('page-nav').addEventListener('click', () => setTimeout(upd, 0)); upd();
})();

/* ===== 스크롤 등장 ===== */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.fade-up').forEach(el => io.observe(el));
