/* 향방 포장대 — 포토카드 · 인생 두컷
   원래 기능은 shared/archive.js(기념주화·포토카드·인생 두컷)를 그대로 옮긴 것, 글꼴만 향방 글꼴로 바꿈.
   향방 전용 모양: 포토카드 태그·라벨·영수증 / 인생 두컷 시향지·상자 라벨·영수증 띠.
   2페이지를 처음 열 때 LIU_KEEPSAKE.init() 한 번. 올린 사진과 이름은 기기 밖으로 나가지 않음. */
window.LIU_KEEPSAKE = (() => { let done = false; return { init() { if (done) return; done = true;
const $ = id => document.getElementById(id);
const PAGE = { brand: 'HYANGBANG', metal: 'gold', enamel: ['#6A5390', '#2A1E3C'], boothPaper: ['#FBF8F5', '#ECE5EB', '#201820', '#5C505D'], guestName: '당신' };
const characters = { liu: { name: '류설향', booth: ['assets/booth/liu_1.webp', 'assets/booth/liu_2.webp'] } };
const charIds = Object.keys(characters);
const BRAND = PAGE.brand;
const esc = t => String(t).replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
const HER_LIST = ['15','02','09','08','11','05','10','13','01','07'];
$('pc-thumbs').innerHTML = '<button type="button" class="kth up" id="btn-upload" aria-label="내 사진 올리기"><span>내 사진<br>올리기</span></button>' + HER_LIST.map(n => `<button type="button" class="kth" data-her="${n}" aria-label="${n}번 사진"><img src="assets/s${n}.jpg" alt="" loading="lazy"></button>`).join('');
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
  ctx.save(); ctx.font = 'bold 78px "COR","NM",serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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
  // 향방 전용: 향수병 태그 / 상자 라벨 / 상환 영수증
  tag:     { custom:'tag',     sc:[150,150], path(p) { p.addPath(rrect(58, 30, 184, 266, 4)); } },
  label:   { custom:'label',   sc:[150,150], path(p) { p.addPath(rrect(54, 8, 192, 284, 12)); } },
  receipt: { custom:'receipt', sc:[150,150], path(p) { p.addPath(rrect(66, 6, 168, 288, 2)); } },
  // 기념주화 3종: 프루프(양각) · 판화(선 음각) · 깊은 음각
  coinA:   { custom:'coin', style:'a', sc:[150,150], path(p) { p.arc(150, 150, 143, 0, TAU); } },
  coinB:   { custom:'coin', style:'b', sc:[150,150], path(p) { p.arc(150, 150, 143, 0, TAU); } },
  coinC:   { custom:'coin', style:'c', sc:[150,150], path(p) { p.arc(150, 150, 143, 0, TAU); } },
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
  const mr = document.getElementById('metal-row'); if (mr) mr.style.display = t === 'receipt' ? 'none' : '';
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
  ctx.font = 'bold 10px "CG","NM",serif';
  const base = chars.reduce((a, c) => a + ctx.measureText(c).width + sp, -sp);
  const size = Math.max(8.5, Math.min(14, 10 * (w - 10) / base));
  ctx.font = `bold ${size}px "CG","NM",serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
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
  ctx.font = 'bold 118px "COR","NM",serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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
  ctx.font = 'bold 6.6px "CG","NM",serif'; spaced(BRAND, ax + 11, ay + 17, 1.6, 'left');
  ctx.font = 'bold 6.6px "CG","NM",serif'; spaced(serialOf(name), ax + aw - 11, ay + 17, 1.2, 'right');
  let fs = 26; ctx.font = `bold ${fs}px "CG","NM",serif`;
  const nw = [...name].reduce((a, c) => a + ctx.measureText(c).width + 1.5, 0); if (nw > aw - 24) fs = Math.max(12, fs * (aw - 24) / nw);
  ctx.font = `bold ${fs}px "CG","NM",serif`;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 1.5; ctx.fillStyle = foil(ax, ay + ah - 70, ax + aw, ay + ah, P);
  spaced(name, ax + 12, ay + ah - 30, 1.5, 'left'); ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(ax + 12, ay + ah - 22); ctx.lineTo(ax + aw - 12, ay + ah - 22); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = 'bold 6.2px "CG","NM",serif';
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
  arcFill(BRAND, r - 22, false, 'bold 9px "CG","NM",serif', 2.2);
  ctx.fillStyle = foil(-80, 60, 80, 140, P); ctx.shadowBlur = 6;
  let fs = 19; ctx.font = `bold ${fs}px "CG","NM",serif`; const nw = [...name].reduce((a, c) => a + ctx.measureText(c).width + 1.8, 0); if (nw > 170) fs = Math.max(11, fs * 170 / nw);
  arcFill(name, r - 14, true, `bold ${fs}px "CG","NM",serif`, 1.8);
  ctx.restore();
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.arc(C, C, r - 5, 0, TAU); ctx.stroke();
  ctx.strokeStyle = 'rgba(0,0,0,.4)'; ctx.beginPath(); ctx.arc(C, C, r, 0, TAU); ctx.stroke();
  sparkle(C + 92, C - 92, 9, .95); sparkle(C + 108, C - 64, 4.5, .85);
}
function render() {
  const P = METALS[metal], name = ($('coin-name-input').value.trim() || PAGE.guestName).toUpperCase(), S = SHAPES[shape];
  ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
  ctx.clearRect(0, 0, 300, 300);
  if (S.custom === 'card') { renderCard(P, name); return; }
  if (S.custom === 'can') { renderCan(P, name); return; }
  if (S.custom === 'tag') { renderTag(P, name); return; }
  if (S.custom === 'label') { renderLabel(P, name); return; }
  if (S.custom === 'receipt') { renderReceipt(P, name); return; }
  if (S.custom === 'coin') { renderCoin(P, name, S.style); return; }
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
  if (!avatar) arcText(BRAND, 67.6, false, P, 'bold 8.4px "CG","NM",serif', 3);
  if (!avatar) arcText(serialOf(name) + ' · 2026', 73.6, true, P, 'bold 7.4px "CG","NM",serif', 2);
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
  img.onload = () => { avatar = img; avatarId++; URL.revokeObjectURL(url); drawCoin(); document.querySelectorAll('[data-her]').forEach(b => b.classList.remove('active')); $('btn-upload').classList.add('active'); herSel = null; avatarUpload = true; };
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
  const bt = $('btn-download'); if (bt.disabled) return; const label = bt.textContent; bt.textContent = '만드는 중…'; bt.disabled = true;
  setTimeout(() => { try { saveCanvas(badgeCanvas(1800), `hyangbang-card-${Date.now()}.png`); } finally { bt.textContent = label; bt.disabled = false; } }, 40);
});

// data.js page.metal: 기념주화·인생 두컷의 처음 마감 (gold · rose · silver · aurora), page.enamel: ['#밝은색','#어두운색'] 에나멜 색을 작품 색으로
const DEF_METAL = METALS[PAGE.metal] ? PAGE.metal : 'gold';
if (Array.isArray(PAGE.enamel) && PAGE.enamel.length === 2) Object.values(METALS).forEach(m => { m.enamel = PAGE.enamel.slice(); });
selectMetal(DEF_METAL); selectShape('tag'); selectPhoto('color');
Promise.all([
  document.fonts.load('700 10px "CG"'), document.fonts.load('600 10px "CG"'),
  document.fonts.load('400 13px "NM"'), document.fonts.load('800 13px "NM"'), document.fonts.load('20px "COR"')
]).then(() => { drawCoin(); drawBooth(); }).catch(() => {});

/* ===== 인생 두컷: 사진 2장을 순서대로 올리면 프레임에 합성 + 캐릭터 PNG 겹치기 =====
   캐릭터 PNG는 characters[id].booth 경로에 넣으면 자동으로 쓰입니다(없으면 자리표시 실루엣). */
const bcv = $('booth-canvas');
const BW = 600, BH = 1156, CUTS = [{ x:36, y:104, w:528, h:440 }, { x:36, y:572, w:528, h:440 }];   // 컷 비율 6:5 (캐릭터가 컷을 넉넉히 채우도록)
bcv.height = Math.round(bcv.width * BH / BW); bcv.style.aspectRatio = `${BW} / ${BH}`;
const booth = { char: charIds[0], frame: DEF_METAL, side: 'right', bg: 'atelier', style: 'blotter', photos: [null, null], cutouts: [null, null], tf: [{ zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }], sel: 0 };
// 인생 두컷 모양 추가용 (shared/booth-styles.js 등): BOOTH_STYLES[이름] = { render(g, scale), cuts:[{x,y,w,h}], need: 사진 수, noCutout, file, steps:[0장, 1장, 완성] }
const BOOTH_STYLES = {};
const boothStyle = () => BOOTH_STYLES[booth.style] || null;
const cutsNow = () => (boothStyle() && boothStyle().cuts) || CUTS;
const needNow = () => (boothStyle() && boothStyle().need) || 2;
// 이름: 금고·시작 화면에서 적은 이름 → 주화 이름 → data.js page.guestName (예: '쥐') → GUEST
const guestName = () => { const v = $('coin-name-input').value.trim(); return v && v.toUpperCase() !== 'GUEST' ? v : (PAGE.guestName || 'GUEST'); };

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
function ensureCutouts() { if (boothStyle() && boothStyle().noCutout) return; booth.photos.forEach((p, i) => { if (p && !booth.cutouts[i]) makeCutout(i); }); }

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
  } else if (kind === 'atelier') {   // 향방: 연보라 벽 + 커튼 주름 + 창빛
    lin([[0, '#F1EDF3'], [.78, '#E5DEE9'], [1, '#DCD3E0']]);
    glow(x + w * .18, y + h * .16, w * .72, 'rgba(255,255,255,.9)');
    let cx = x; while (cx < x + w) { const fw = w * (.06 + r() * .05), gr = g.createLinearGradient(cx, 0, cx + fw, 0); gr.addColorStop(0, 'rgba(190,178,208,0)'); gr.addColorStop(.5, `rgba(190,178,208,${.18 + r() * .16})`); gr.addColorStop(1, 'rgba(190,178,208,0)'); g.fillStyle = gr; g.fillRect(cx, y, fw, h); cx += fw; }
    const fl = g.createLinearGradient(x, y + h * .8, x, y + h); fl.addColorStop(0, 'rgba(110,88,124,0)'); fl.addColorStop(1, 'rgba(110,88,124,.2)'); g.fillStyle = fl; g.fillRect(x, y, w, h);
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
  g.fillStyle = 'rgba(255,255,255,.9)'; g.font = 'bold 13px "CG","NM",serif'; g.textAlign = 'center'; g.fillText('CHARACTER', cx, y + h - 34);
  g.font = '11px sans-serif'; g.fillText(path.split('/').pop(), cx, y + h - 16);
  g.restore();
}
// 한 컷 안: 배경 + 나(오려 낸 사진) + 캐릭터 + 사진 톤 (클립은 부르는 쪽에서)
function drawCut(g, k, i, scale) {
  const c = characters[booth.char];
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
      if (cut === 'pending') { g.fillStyle = 'rgba(30,25,40,.42)'; g.fillRect(k.x, k.y, k.w, k.h); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '20px "NM", serif'; g.fillText('사진에서 사람을 오려내는 중…', k.x + k.w / 2, k.y + k.h / 2); }
    }
  } else {
    const cx = zx + zw / 2; g.fillStyle = 'rgba(60,45,35,.8)'; g.shadowColor = 'rgba(255,255,255,.9)'; g.shadowBlur = 6; g.textAlign = 'center';
    g.font = 'bold 54px "CG","NM",serif'; g.fillText(String(i + 1).padStart(2, '0'), cx, k.y + k.h * .45);
    g.font = '18px "NM", serif'; g.fillText(`${i + 1}번째 사진의`, cx, k.y + k.h * .45 + 34); g.fillText('사람이 여기 서요', cx, k.y + k.h * .45 + 58); g.shadowBlur = 0;
  }
  // 캐릭터 (아래쪽 기준, 좌/우)
  const src = c.booth && c.booth[i], ci = boothImg(src);
  if (ci) { let chH = k.h * .9, chW = ci.width * chH / ci.height; if (chW > k.w * .68) { chW = k.w * .68; chH = ci.height * chW / ci.width; }   /* 넓은 그림은 컷 폭의 68% 까지만 */ const x = booth.side === 'right' ? k.x + k.w - chW * .96 : k.x - chW * .04; ground(x + chW / 2, chW * .5); g.drawImage(ci, x, k.y + k.h - chH, chW, chH); }
  else if (src) { const chH = k.h * .88, chW = k.w * .44, x = booth.side === 'right' ? k.x + k.w - chW - 10 : k.x + 10; charPlaceholder(g, x, k.y + k.h - chH, chW, chH, src); }
  // 사진 톤: 은은한 따뜻함 + 가장자리
  g.fillStyle = 'rgba(255,236,210,.06)'; g.fillRect(k.x, k.y, k.w, k.h);
  const vg = g.createRadialGradient(k.x + k.w / 2, k.y + k.h / 2, k.h * .35, k.x + k.w / 2, k.y + k.h / 2, k.h * .8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.16)'); g.fillStyle = vg; g.fillRect(k.x, k.y, k.w, k.h);
}
function renderBooth(g, scale) {
  const c = characters[booth.char], P = METALS[booth.frame];
  g.setTransform(scale, 0, 0, scale, 0, 0); g.clearRect(0, 0, BW, BH);
  const S = boothStyle(); if (S && S.render) { S.render(g, scale); return; }
  // 종이 바탕 + 포일 테두리
  const BP = PAGE.boothPaper || ['#FCF9F2', '#EFE6D4', '#3B2F22', '#5A4A38'];   // data.js page.boothPaper: [종이 밝은색, 종이 어두운색, 글자색, 작은 글자색]
  const bg = g.createLinearGradient(0, 0, BW, BH); bg.addColorStop(0, BP[0]); bg.addColorStop(1, BP[1]);
  g.fillStyle = bg; g.fillRect(0, 0, BW, BH);
  g.strokeStyle = bFoil(g, 0, 0, BW, BH, booth.frame); g.lineWidth = 14; g.strokeRect(7, 7, BW - 14, BH - 14);
  g.strokeStyle = 'rgba(120,90,50,.35)'; g.lineWidth = 1; g.strokeRect(20, 20, BW - 40, BH - 40);
  // 머리글
  g.textBaseline = 'alphabetic'; g.fillStyle = BP[2]; g.font = 'bold 24px "CG","NM",serif'; bSpaced(g, BRAND, BW / 2, 62, 5);
  g.fillStyle = mix(P.base, P.dark, .45); g.font = 'bold 12px "CG","NM",serif'; bSpaced(g, 'LIFE  ·  TWO  CUTS', BW / 2, 86, 3);
  // 두 컷
  CUTS.forEach((k, i) => {
    g.save(); bRR(g, k.x, k.y, k.w, k.h, 10); g.clip();
    drawCut(g, k, i, scale);
    g.restore();
    bRR(g, k.x, k.y, k.w, k.h, 10); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.9)'; g.stroke();
    g.fillStyle = 'rgba(255,255,255,.95)'; g.font = 'bold 14px "CG","NM",serif'; g.textAlign = 'left'; g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 4;
    g.fillText(`CUT ${String(i + 1).padStart(2, '0')}`, k.x + 16, k.y + 30); g.shadowBlur = 0;
  });
  // 바닥글: with 캐릭터 · 날짜 · 이름 · 번호
  const user = guestName();
  const d = new Date(), date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  g.textAlign = 'center'; g.fillStyle = BP[2]; g.font = '30px "NM",serif'; g.fillText(`with ${c.name}`, BW / 2, BH - 88);
  g.fillStyle = bFoil(g, 150, BH - 80, 450, BH - 50, booth.frame); g.fillRect(BW / 2 - 90, BH - 74, 180, 1.5);
  g.fillStyle = BP[3]; g.font = 'bold 13px "CG","NM",serif'; bSpaced(g, `${date}  ·  ${user.toUpperCase()}  ·  ${serialOf(user.toUpperCase())}`, BW / 2, BH - 44, 2);
  bSparkle(g, 66, BH - 100, 12, .9); bSparkle(g, 534, BH - 70, 9, .9);
}
function drawBooth() { renderBooth(bcv.getContext('2d'), bcv.width / BW); updateBoothUI(); }
function updateBoothUI() {
  const need = needNow(), n = booth.photos.slice(0, need).filter(Boolean).length, S = boothStyle();
  if (need === 1) { $('booth-upload-btn').textContent = n ? '사진 바꾸기' : '사진 올리기'; $('booth-step').textContent = (S.steps || [])[n ? 2 : 0] || (n ? '완성! 마음에 들면 저장하세요.' : '사진 한 장을 올려 주세요.'); $('booth-download').disabled = !n; return; }
  $('booth-upload-btn').textContent = n === 0 ? '1번 사진 올리기' : n === 1 ? '2번 사진 올리기' : `${booth.sel + 1}번 사진 바꾸기`;
  $('booth-step').textContent = n === 0 ? `① 첫 번째 사진을 올려 주세요. 사진 속 사람만 오려내서 그녀 옆에 나란히 세워요. 사람이 또렷하게 나온 사진이 잘 어울려요.` : n === 1 ? '② 두 번째 사진을 올려 주세요.' : '완성! 마음에 들면 저장하세요. (Reset으로 처음부터)';
  $('booth-download').disabled = n < 2;
}
const markActive = (attr, val) => document.querySelectorAll(`[data-${attr}]`).forEach(b => b.classList.toggle('active', b.dataset[attr] === val));
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
    const [x, y] = pt(e), i = cutsNow().findIndex(k => x >= k.x && x <= k.x + k.w && y >= k.y && y <= k.y + k.h); if (i < 0) return;
    selectCut(i); if (!booth.photos[i] || !moveMode) return;
    drag = { i, x, y, dx: booth.tf[i].dx, dy: booth.tf[i].dy }; bcv.setPointerCapture(e.pointerId); bcv.style.cursor = 'grabbing';
  });
  bcv.addEventListener('pointermove', e => { if (!drag) return; const [x, y] = pt(e), k = cutsNow()[drag.i]; booth.tf[drag.i].dx = drag.dx + (x - drag.x) / k.w; booth.tf[drag.i].dy = drag.dy + (y - drag.y) / k.h; drawBooth(); });
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
    const i = needNow() === 1 ? 0 : !booth.photos[0] ? 0 : !booth.photos[1] ? 1 : booth.sel; booth.photos[i] = img; booth.cutouts[i] = null; booth.tf[i] = { zoom: 1, dx: 0, dy: 0 }; selectCut(i); URL.revokeObjectURL(url); ensureCutouts(); drawBooth(); };
  raw.onerror = () => { URL.revokeObjectURL(url); $('booth-step').textContent = '이 사진은 열 수 없어요. 다른 사진(JPG/PNG)을 올려 주세요.'; };
  raw.src = url;
});
$('booth-reset').addEventListener('click', () => { booth.photos = [null, null]; booth.cutouts = [null, null]; booth.tf = [{ zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }]; selectCut(0); setMove(false); bgStatus(''); drawBooth(); });
$('booth-download').addEventListener('click', () => {
  const off = document.createElement('canvas'); off.width = BW * 2; off.height = BH * 2; renderBooth(off.getContext('2d'), 2);
  saveCanvas(off, `${(boothStyle() && boothStyle().file) || 'hyangbang-2cut'}-${Date.now()}.png`);
});
/* ===== 향방 전용 모양: 포토카드 태그 · 라벨 · 영수증 / 인생 두컷 시향지 · 상자 라벨 · 영수증 띠 ===== */
const NOTE_COL = { '비 맞은 우산':'#8FA6C4', '막 뜯은 편지 봉투':'#E6D7BC', '식은 아메리카노':'#9A7258', '손목의 체온':'#E7AE93', '오래 입은 니트':'#CDB7A2', '빨래 비누':'#D7E2EC', '젖은 삼나무':'#7F9068', '오래된 책장':'#9C7553', '막 꺼진 초':'#C9A57E' };
const FORM = () => { try { const f = JSON.parse(localStorage.getItem('liu.formula')); return f && NOTE_COL[f.t] && NOTE_COL[f.m] && NOTE_COL[f.b] ? f : null; } catch (e) { return null; } };
const TRIAL = () => { const f = FORM(); if (f) return f.no; let n = 0; try { n = JSON.parse(localStorage.getItem('liu.issued')) || 0; } catch (e) {} return 38 + (n % 12); };
const pad2 = n => String(n).padStart(2, '0');
const today = (sep = '.') => { const d = new Date(); return `${d.getFullYear()}${sep}${pad2(d.getMonth() + 1)}${sep}${pad2(d.getDate())}`; };
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
function nextDue() {   // 매달 4일 19:00
  const n = new Date(); let d = new Date(n.getFullYear(), n.getMonth(), 4, 19, 0, 0);
  if (n > d) d = new Date(n.getFullYear(), n.getMonth() + 1, 4, 19, 0, 0);
  const dd = Math.ceil((d - n) / 864e5);
  return { text: `${pad2(d.getMonth() + 1)}.${pad2(d.getDate())} (${DOW[d.getDay()]}) 19:00`, dd };
}
const LOGO = new Image(); LOGO.onload = () => { drawCoin(); drawBooth(); }; LOGO.src = 'assets/logo.svg';
const INK = '#201820', MUTE = '#5C505D', PLUM = '#4A3760', PLUM_D = '#3A2A52';

function patternGrain(c, sc) { const p = c.createPattern(grain, 'repeat'); try { p.setTransform(new DOMMatrix().scale(1 / sc)); } catch (e) {} return p; }
function grainOver(path, a) { ctx.save(); ctx.clip(path); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.fillStyle = patternGrain(ctx, SCALE); ctx.fillRect(0, 0, 300, 300); ctx.restore(); }
function paperH(c, x0, x1) { const g = c.createLinearGradient(x0, 0, x1, 0); [[0, '#E9E2DA'], [.22, '#F6F2ED'], [.5, '#FAF7F3'], [.8, '#F3EEE8'], [1, '#E6DED6']].forEach(([t, k]) => g.addColorStop(t, k)); return g; }
function dash(x0, x1, y) { ctx.save(); ctx.setLineDash([2, 1.6]); ctx.lineWidth = .5; ctx.strokeStyle = 'rgba(32,24,32,.36)'; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke(); ctx.restore(); }
function fitFont(text, weight, size, family, maxW, gap = 0) { let s = size; ctx.font = `${weight} ${s}px ${family}`; const w = [...text].reduce((a, c) => a + ctx.measureText(c).width + gap, -gap); if (w > maxW) s = Math.max(size * .5, s * maxW / w); ctx.font = `${weight} ${s}px ${family}`; return s; }
function noteLines(f, x, y, step, size) {
  [f.t, f.m, f.b].forEach((n, i) => {
    const yy = y + i * step; ctx.fillStyle = NOTE_COL[n]; ctx.beginPath(); ctx.arc(x + 2.2, yy - size * .34, size * .3, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2E242E'; ctx.font = `400 ${size}px "NM",serif`; ctx.textAlign = 'left'; ctx.fillText(n, x + 8, yy);
  });
}

/* 포토카드 · 태그 (향수병에 거는 태그) */
function renderTag(P, name) {
  const x = 58, y = 30, w = 184, h = 266, T = new Path2D();
  T.moveTo(x + 24, y); T.lineTo(x + w - 24, y); T.lineTo(x + w, y + 20); T.lineTo(x + w, y + h); T.lineTo(x, y + h); T.lineTo(x, y + 20); T.closePath();
  ctx.save(); ctx.shadowColor = 'rgba(32,20,40,.24)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6; ctx.fillStyle = paperH(ctx, x, x + w); ctx.fill(T); ctx.restore();
  ctx.save(); ctx.clip(T); const dip = ctx.createRadialGradient(150, y, 0, 150, y, 150); dip.addColorStop(0, 'rgba(104,76,142,.22)'); dip.addColorStop(1, 'rgba(104,76,142,0)'); ctx.fillStyle = dip; ctx.fillRect(x, y, w, 130); ctx.restore();
  grainOver(T, .34);
  const px = 72, py = 64, pw = 156, ph = 150;
  ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); if (avatar) cover(avatar, px, py, pw, ph, .18); else placeholderArt(P, px, py, pw, ph, name, py + ph * .45); ctx.restore();
  ctx.lineWidth = .5; ctx.strokeStyle = 'rgba(32,24,32,.14)'; ctx.strokeRect(px + .25, py + .25, pw - .5, ph - .5);
  // 구멍 + 금속 고리
  ctx.save(); ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.arc(150, 47, 4.4, 0, TAU); ctx.fill(); ctx.restore();
  ctx.save(); ctx.lineWidth = 2.4; ctx.strokeStyle = foil(143, 40, 157, 54, P); ctx.beginPath(); ctx.arc(150, 47, 5.7, 0, TAU); ctx.stroke();
  ctx.lineWidth = .5; ctx.strokeStyle = 'rgba(60,40,20,.5)'; ctx.beginPath(); ctx.arc(150, 47, 7, 0, TAU); ctx.stroke(); ctx.restore();
  // 실: 구멍을 지나 위로 고리
  ctx.save(); ctx.strokeStyle = PLUM; ctx.lineWidth = 1.3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(150, 44); ctx.bezierCurveTo(134, 30, 132, 4, 151, 3); ctx.bezierCurveTo(170, 2, 168, 26, 152.5, 43); ctx.stroke(); ctx.restore();
  // 글자
  const f = FORM(); ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'left';
  ctx.fillStyle = PLUM_D; ctx.font = '23px "COR",serif'; ctx.fillText('Trial ' + TRIAL(), px, 238);
  ctx.fillStyle = INK; fitFont(('RYU SEOLHYANG · FOR ' + name).toUpperCase(), 600, 5.6, '"CG","NM",serif', 148, 1.4); spaced(('RYU SEOLHYANG · FOR ' + name).toUpperCase(), px, 250, 1.4, 'left');
  if (f) noteLines(f, px, 263, 10, 7); else { ctx.fillStyle = MUTE; ctx.font = '400 6.8px "NM",serif'; ctx.fillText('향은 아직이에요. 한 번 맡아 보고요.', px, 265); }
  ctx.save(); ctx.translate(232, 222); ctx.rotate(Math.PI / 2); ctx.fillStyle = 'rgba(32,24,32,.58)'; ctx.font = '600 4.6px "CG",serif'; spaced('HYANGBANG · N°15', 0, 0, 1.6, 'left'); ctx.restore();
}

/* 포토카드 · 라벨 (향수 상자 라벨, 아치 창 + 금박 테) */
function archPath(x, y, w, h) { const p = new Path2D(), r = w / 2; p.moveTo(x, y + r); p.arc(x + r, y + r, r, Math.PI, 0); p.lineTo(x + w, y + h); p.lineTo(x, y + h); p.closePath(); return p; }
function renderLabel(P, name) {
  const X = 54, Y = 8, W = 192, H = 284, L = rrect(X, Y, W, H, 12);
  ctx.save(); ctx.shadowColor = 'rgba(32,20,40,.22)'; ctx.shadowBlur = 14; ctx.shadowOffsetY = 6;
  const bg = ctx.createLinearGradient(X, Y, X + W * .4, Y + H); bg.addColorStop(0, '#FDFBF7'); bg.addColorStop(1, '#F3EDE5'); ctx.fillStyle = bg; ctx.fill(L); ctx.restore();
  grainOver(L, .2);
  ctx.lineWidth = .9; ctx.strokeStyle = foil(X, Y, X + W, Y + H, P); ctx.stroke(rrect(X + 7, Y + 7, W - 14, H - 14, 8));
  ctx.lineWidth = .4; ctx.globalAlpha = .7; ctx.stroke(rrect(X + 10, Y + 10, W - 20, H - 20, 6)); ctx.globalAlpha = 1;
  if (LOGO.complete && LOGO.naturalWidth) { const lw = 92, lh = lw * LOGO.naturalHeight / LOGO.naturalWidth; ctx.drawImage(LOGO, 150 - lw / 2, 20, lw, lh); }
  const ax = 82, ay = 72, aw = 136, ah = 144;
  ctx.fillStyle = foil(ax - 3, ay - 3, ax + aw + 3, ay + ah + 3, P); ctx.fill(archPath(ax - 2.6, ay - 2.6, aw + 5.2, ah + 5.2));
  ctx.save(); ctx.clip(archPath(ax, ay, aw, ah)); if (avatar) cover(avatar, ax, ay, aw, ah, .16); else placeholderArt(P, ax, ay, aw, ah, name, ay + ah * .5); ctx.restore();
  const f = FORM(); ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = mix(P.base, P.dark, .4); ctx.font = '600 5.4px "CG",serif'; spaced('EAU DE PARFUM · TRIAL ' + TRIAL(), 150, 233, 1.6, 'center');
  ctx.fillStyle = INK; fitFont(name + '에게만', 800, 13, '"NM",serif', 150); ctx.textAlign = 'center'; ctx.fillText(name + '에게만', 150, 251);
  ctx.fillStyle = foil(130, 255, 170, 258, P); ctx.fillRect(130, 256.5, 40, .6);
  if (f) {   // 세 향을 색 점과 한 줄로
    ctx.font = '400 6.1px "NM",serif'; const parts = [f.t, f.m, f.b], ws = parts.map(t => ctx.measureText(t).width), gap = 7, tot = ws.reduce((a, b) => a + b + 6, 0) + gap * 2;
    let cx = 150 - tot / 2; ctx.textAlign = 'left';
    parts.forEach((t, i) => { ctx.fillStyle = NOTE_COL[t]; ctx.beginPath(); ctx.arc(cx + 2, 268, 1.9, 0, TAU); ctx.fill(); ctx.fillStyle = MUTE; ctx.fillText(t, cx + 6, 270); cx += ws[i] + 6 + gap; });
  } else { ctx.fillStyle = MUTE; ctx.font = '600 5px "CG",serif'; spaced('FOR ONE CLIENT ONLY', 150, 270, 1.6, 'center'); }
}

/* 포토카드 · 영수증 (상환 확인증) */
let duoKey = '', duoCv = null;
function duotone(w, h) {
  const key = avatarId + '@' + SCALE + (avatar ? '' : 'n'); if (key === duoKey && duoCv) return duoCv;
  const c = document.createElement('canvas'); c.width = Math.round(w * SCALE); c.height = Math.round(h * SCALE); const o = c.getContext('2d');
  if (avatar) { const k = Math.max(c.width / avatar.width, c.height / avatar.height), iw = avatar.width * k, ih = avatar.height * k; o.drawImage(avatar, (c.width - iw) / 2, (c.height - ih) * .2, iw, ih); }
  else { o.fillStyle = '#CFC6D6'; o.fillRect(0, 0, c.width, c.height); }
  try { const d = o.getImageData(0, 0, c.width, c.height), a = d.data; for (let i = 0; i < a.length; i += 4) { const v = Math.min(255, (a[i] * .3 + a[i + 1] * .59 + a[i + 2] * .11) * 1.04); a[i] = a[i + 1] = a[i + 2] = v; } o.putImageData(d, 0, 0); } catch (e) {}
  o.globalCompositeOperation = 'screen'; o.fillStyle = 'rgba(106,76,140,.42)'; o.fillRect(0, 0, c.width, c.height);
  duoKey = key; duoCv = c; return c;
}
function zigPath(x, y, w, h, teeth, depth, top) {
  const p = new Path2D(), st = w / teeth;
  if (top) { p.moveTo(x, y + depth); for (let i = 1; i <= teeth; i++) p.lineTo(x + i * st, y + (i % 2 ? 0 : depth)); } else { p.moveTo(x, y); p.lineTo(x + w, y); }
  for (let i = teeth; i >= 0; i--) p.lineTo(x + i * st, y + h - (i % 2 ? depth : 0));
  p.closePath(); return p;
}
function barcode(x0, x1, y, h, seed) { let q = seed || 7; const r = () => (q = (q * 16807) % 2147483647) / 2147483647; ctx.fillStyle = '#2E242E'; let x = x0; while (x < x1) { const bw = r() < .5 ? .7 : r() < .7 ? 1.4 : 2.1; ctx.fillRect(x, y, Math.min(bw, x1 - x), h); x += bw + (r() < .6 ? .9 : 1.8); } }
function renderReceipt(P, name) {
  const X = 66, Y = 6, W = 168, H = 288, R0 = zigPath(X, Y, W, H, 14, 5, false);
  ctx.save(); ctx.shadowColor = 'rgba(32,20,40,.2)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5;
  const bg = ctx.createLinearGradient(0, Y, 0, Y + H); bg.addColorStop(0, '#FEFDFB'); bg.addColorStop(1, '#F7F5F1'); ctx.fillStyle = bg; ctx.fill(R0); ctx.restore();
  grainOver(R0, .16);
  ctx.textBaseline = 'alphabetic'; ctx.textAlign = 'center';
  ctx.fillStyle = INK; ctx.font = '700 7.4px "CG",serif'; spaced('HYANGBANG', 150, 24, 2.6, 'center');
  ctx.font = '800 10.5px "NM",serif'; ctx.textAlign = 'center'; ctx.fillText('상환 확인증', 150, 39);
  dash(X + 12, X + W - 12, 48);
  const pw = 112, ph = 84; ctx.save(); ctx.translate(150, 104); ctx.rotate(.035); ctx.shadowColor = 'rgba(32,20,40,.35)'; ctx.shadowBlur = 5; ctx.shadowOffsetY = 2.5;
  ctx.drawImage(duotone(pw, ph), -pw / 2, -ph / 2, pw, ph); ctx.restore();
  // 클립
  ctx.save(); ctx.strokeStyle = '#A39CA6'; ctx.lineWidth = 1.1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(103, 74); ctx.lineTo(103, 56); ctx.arc(107, 56, 4, Math.PI, 0); ctx.lineTo(111, 76); ctx.arc(108.5, 76, 2.5, 0, Math.PI); ctx.lineTo(106, 60); ctx.stroke(); ctx.restore();
  dash(X + 12, X + W - 12, 158);
  const due = nextDue(), rows = [['회차', '1 / 12', 1], ['금액', '₩2,000,000', 1], ['일시', due.text, 0], ['받은 사람', '류설향', 0], ['보낸 사람', name, 0]];
  rows.forEach(([k, v, num], i) => {
    const yy = 172 + i * 12.6; ctx.textAlign = 'left'; ctx.fillStyle = MUTE; ctx.font = '400 6.8px "NM",serif'; ctx.fillText(k, X + 14, yy);
    ctx.textAlign = 'right'; ctx.fillStyle = INK; ctx.font = num ? '700 8.2px "CG",serif' : '400 6.8px "NM",serif'; ctx.fillText(v, X + W - 14, yy);
  });
  // 도장
  ctx.save(); ctx.translate(198, 128); ctx.rotate(-.25); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = .8; ctx.strokeStyle = PLUM; ctx.fillStyle = PLUM;
  ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(0, 0, 18, 0, TAU); ctx.stroke(); ctx.lineWidth = .5; ctx.beginPath(); ctx.arc(0, 0, 15.4, 0, TAU); ctx.stroke();
  ctx.textAlign = 'center'; ctx.font = '800 8.6px "NM",serif'; ctx.fillText('수령', 0, 1.5); ctx.font = '700 4.6px "CG",serif'; ctx.fillText('N°15', 0, 9); ctx.restore();
  dash(X + 12, X + W - 12, 238);
  let h = 7; for (const c of name + TRIAL()) h = (h * 31 + c.codePointAt(0)) % 2147483647; barcode(X + 20, X + W - 20, 245, 16, h || 7);
  ctx.textAlign = 'center'; ctx.fillStyle = MUTE; ctx.font = '400 6.4px "NM",serif'; ctx.fillText('※ 다 갚으면, 남이에요.', 150, 277);
}

/* ===== 인생 두컷 · 향방 모양 ===== */
function bGrain(g, scale, a, path) { g.save(); if (path) g.clip(path); g.globalCompositeOperation = 'multiply'; g.globalAlpha = a; g.fillStyle = patternGrain(g, scale); g.fillRect(0, 0, BW, BH); g.restore(); }
function bSpacedR(g, text, x, y, gap) { const ch = [...text], ws = ch.map(c => g.measureText(c).width), tw = ws.reduce((a, b) => a + b, 0) + gap * (ch.length - 1); let cx = x - tw; g.textAlign = 'left'; ch.forEach((c, i) => { g.fillText(c, cx, y); cx += ws[i] + gap; }); }
function bSpacedL(g, text, x, y, gap) { let cx = x; g.textAlign = 'left'; for (const c of text) { g.fillText(c, cx, y); cx += g.measureText(c).width + gap; } }
function cutsWith(g, scale, cuts, clipFn, after) { cuts.forEach((k, i) => { g.save(); g.clip(clipFn(k)); drawCut(g, k, i, scale); g.restore(); if (after) after(k, i); }); }
const rectP = k => { const p = new Path2D(); p.rect(k.x, k.y, k.w, k.h); return p; };

BOOTH_STYLES.blotter = {
  file: 'hyangbang-blotter', cuts: [{ x: 40, y: 112, w: 520, h: 448 }, { x: 40, y: 584, w: 520, h: 448 }],
  render(g, scale) {
    const S = new Path2D(); S.moveTo(300, 0); S.lineTo(600, 62); S.lineTo(600, BH); S.lineTo(0, BH); S.lineTo(0, 62); S.closePath();
    g.fillStyle = paperH(g, 0, 600); g.fill(S);
    g.save(); g.clip(S); const tip = g.createRadialGradient(300, 0, 0, 300, 0, 560); tip.addColorStop(0, 'rgba(104,76,142,.46)'); tip.addColorStop(.5, 'rgba(104,76,142,.15)'); tip.addColorStop(1, 'rgba(104,76,142,0)'); g.fillStyle = tip; g.fillRect(0, 0, 600, 360); g.restore();
    bGrain(g, scale, .3, S);
    cutsWith(g, scale, this.cuts, rectP, k => { g.lineWidth = 1; g.strokeStyle = 'rgba(32,24,32,.14)'; g.strokeRect(k.x + .5, k.y + .5, k.w - 1, k.h - 1); });
    g.save(); g.translate(582, 140); g.rotate(Math.PI / 2); g.fillStyle = 'rgba(32,24,32,.46)'; g.font = '600 11px "CG",serif'; bSpacedL(g, 'HYANGBANG · N°15 · FOR ONE CLIENT ONLY', 0, 0, 4.4); g.restore();
    const user = guestName(); g.textBaseline = 'alphabetic';
    g.fillStyle = PLUM_D; g.font = '64px "COR",serif'; g.textAlign = 'left'; g.fillText('Trial ' + TRIAL(), 44, 1112);
    g.fillStyle = 'rgba(32,24,32,.64)'; g.font = '600 15px "CG","NM",serif'; bSpacedR(g, 'TWO SHOTS', 556, 1082, 4.6); bSpacedR(g, `${today(' · ')} · ${user}`.toUpperCase(), 556, 1110, 3);
  }
};
BOOTH_STYLES.boxlabel = {
  file: 'hyangbang-label', cuts: [{ x: 64, y: 60, w: 472, h: 452 }, { x: 64, y: 540, w: 472, h: 452 }],
  render(g, scale) {
    const P = METALS[booth.frame], L = new Path2D(); { const r = 34; L.moveTo(r, 0); L.arcTo(BW, 0, BW, BH, r); L.arcTo(BW, BH, 0, BH, r); L.arcTo(0, BH, 0, 0, r); L.arcTo(0, 0, BW, 0, r); L.closePath(); }
    const bg = g.createLinearGradient(0, 0, 260, BH); bg.addColorStop(0, '#FDFBF7'); bg.addColorStop(1, '#F3EDE5'); g.fillStyle = bg; g.fill(L);
    bGrain(g, scale, .2, L);
    g.strokeStyle = bFoil(g, 0, 0, BW, BH, booth.frame); g.lineWidth = 3; bRR(g, 20, 20, BW - 40, BH - 40, 22); g.stroke(); g.lineWidth = 1.2; g.globalAlpha = .7; bRR(g, 30, 30, BW - 60, BH - 60, 16); g.stroke(); g.globalAlpha = 1;
    const arch = k => archPath(k.x, k.y, k.w, k.h);
    cutsWith(g, scale, this.cuts, arch, k => { g.lineWidth = 7; g.strokeStyle = bFoil(g, k.x, k.y, k.x + k.w, k.y + k.h, booth.frame); g.stroke(arch(k)); });
    if (LOGO.complete && LOGO.naturalWidth) { const lw = 184, lh = lw * LOGO.naturalHeight / LOGO.naturalWidth; g.drawImage(LOGO, 300 - lw / 2, 1006, lw, lh); }
    const user = guestName(); g.textBaseline = 'alphabetic'; g.fillStyle = mix(P.base, P.dark, .45); g.font = '600 13px "CG","NM",serif';
    bSpaced(g, `TWO SHOTS  ·  ${today()}  ·  ${user}`.toUpperCase(), 300, 1108, 3);
  }
};
BOOTH_STYLES.receipt = {
  file: 'hyangbang-receipt', cuts: [{ x: 40, y: 96, w: 520, h: 432 }, { x: 40, y: 574, w: 520, h: 432 }],
  render(g, scale) {
    const R0 = new Path2D(), teeth = 30, st = BW / teeth, dep = 12;
    R0.moveTo(0, dep); for (let i = 1; i <= teeth; i++) R0.lineTo(i * st, i % 2 ? 0 : dep); for (let i = teeth; i >= 0; i--) R0.lineTo(i * st, BH - (i % 2 ? dep : 0)); R0.closePath();
    const bg = g.createLinearGradient(0, 0, 0, BH); bg.addColorStop(0, '#FEFDFB'); bg.addColorStop(1, '#F7F5F1'); g.fillStyle = bg; g.fill(R0);
    bGrain(g, scale, .15, R0);
    const user = guestName(); g.textBaseline = 'alphabetic';
    g.fillStyle = INK; g.font = '700 17px "CG",serif'; bSpaced(g, 'HYANGBANG · TWO SHOTS', 300, 52, 5);
    g.fillStyle = MUTE; g.font = '400 15px "NM",serif'; g.textAlign = 'center'; g.fillText(`${today()} · 보낸 사람 ${user}`, 300, 78);
    cutsWith(g, scale, this.cuts, rectP);
    // 절취선 + 양쪽 반달 홈
    g.save(); g.setLineDash([7, 6]); g.lineWidth = 1.4; g.strokeStyle = 'rgba(32,24,32,.42)'; g.beginPath(); g.moveTo(14, 551); g.lineTo(586, 551); g.stroke(); g.restore();
    g.save(); g.globalCompositeOperation = 'destination-out'; [0, 600].forEach(x => { g.beginPath(); g.arc(x, 551, 10, 0, TAU); g.fill(); }); g.restore();
    const due = nextDue();
    g.textAlign = 'left'; g.fillStyle = MUTE; g.font = '400 19px "NM",serif'; g.fillText('회차 1 / 12', 44, 1052); g.fillText('다음 상환일', 44, 1086);
    g.textAlign = 'right'; g.fillStyle = INK; g.font = '700 28px "CG",serif'; g.fillText('₩2,000,000', 556, 1054); g.font = '400 19px "NM",serif'; g.fillText(`${due.text} · D-${due.dd}`, 556, 1086);
    g.textAlign = 'center'; g.fillStyle = MUTE; g.font = '400 16px "NM",serif'; g.fillText('※ 다 갚으면, 남이에요.', 300, 1122);
  }
};
BOOTH_STYLES.classic = null;   // 원래 인생 두컷 (renderBooth 기본 그림)

/* ===== 저장: 카톡 안 브라우저는 내려받기가 막혀서 그림을 띄워 길게 눌러 저장 ===== */
function saveCanvas(cv2, file) {
  const sheet = () => { const s = $('ksheet'); $('ksheet-img').src = cv2.toDataURL('image/png'); s.hidden = false; document.body.classList.add('locked'); };
  if (/KAKAOTALK/i.test(navigator.userAgent)) { sheet(); return; }
  cv2.toBlob(b => {
    if (!b) { sheet(); return; }
    const a = document.createElement('a'); a.download = file; a.href = URL.createObjectURL(b); document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }, 'image/png');
}
$('ksheet-x').addEventListener('click', () => { $('ksheet').hidden = true; $('ksheet-img').removeAttribute('src'); document.body.classList.remove('locked'); });


function setStyle(s) {
  booth.style = s; markActive('bstyle', s);
  const fr = $('booth-frame-row'); if (fr) fr.style.display = (s === 'classic' || s === 'boxlabel') ? '' : 'none';
  drawBooth();
}
$('booth-style-group').addEventListener('click', e => { const b = e.target.closest('[data-bstyle]'); if (b) setStyle(b.dataset.bstyle); });

const HER = ['15', '02', '09', '08', '11', '05', '10', '13', '01', '07'];
function pickHer(n) {
  herSel = n; avatarUpload = false;
  const img = new Image(); img.onload = () => { avatar = img; avatarId++; drawCoin(); }; img.src = `assets/s${n}.jpg`;
  document.querySelectorAll('[data-her]').forEach(b => b.classList.toggle('active', b.dataset.her === n)); $('btn-upload').classList.remove('active');
}
$('pc-thumbs').addEventListener('click', e => { const b = e.target.closest('[data-her]'); if (b) pickHer(b.dataset.her); });

/* ===== 기념주화 3종: A 프루프(거울 바탕 + 무광 양각) · B 판화(선으로 새긴 초상 + 기요셰 테) · C 깊은 음각(인장) =====
   그녀 사진을 고르면 그 장면의 흉상 누끼(assets/coin/bNN.webp)로 새기고, 내 사진을 올리면 사진 전체를 새긴다.
   무거운 계산(바탕·초상)은 모양·마감·사진·크기가 같으면 다시 하지 않는다. */
let herSel = '15', avatarUpload = false;
const BUST = {};
function bustImg(n) {
  if (!n) return null;
  if (!BUST[n]) { const img = new Image(); BUST[n] = { img, ok: false }; img.onload = () => { BUST[n].ok = true; coinKey = String(Date.now()); drawCoin(); }; img.onerror = () => { BUST[n].bad = true; }; img.src = `assets/coin/b${n}.webp`; }
  return BUST[n].ok ? BUST[n].img : null;
}
function coinSrc() {
  if (avatarUpload && avatar) return { img: avatar, cut: false, id: 'u' + avatarId };
  const n = herSel || '02', b = bustImg(n);
  return b ? { img: b, cut: true, id: 'h' + n } : null;
}
const hexRGB = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
function makeLUT(P) {
  const st = [[0, P.dark], [.45, P.base], [.8, P.light], [1, P.hi]].map(([t, c]) => [t, hexRGB(c)]), L = new Uint8ClampedArray(768);
  for (let i = 0; i < 256; i++) { const t = i / 255; let j = 0; while (j < st.length - 2 && t > st[j + 1][0]) j++; const [t0, c0] = st[j], [t1, c1] = st[j + 1], f = Math.min(1, Math.max(0, (t - t0) / (t1 - t0))); for (let k = 0; k < 3; k++) L[i * 3 + k] = c0[k] + (c1[k] - c0[k]) * f; }
  return L;
}
const lutCss = (L, v) => { const i = Math.max(0, Math.min(255, Math.round(v))) * 3; return `rgb(${L[i]},${L[i + 1]},${L[i + 2]})`; };
// 흐리기: 상자 흐림 세 번 = 가우시안 근사
function boxH(s, t, w, h, r) { const inv = 1 / (2 * r + 1); for (let y = 0; y < h; y++) { const o = y * w; let acc = 0; for (let x = -r; x <= r; x++) acc += s[o + Math.min(w - 1, Math.max(0, x))]; for (let x = 0; x < w; x++) { t[o + x] = acc * inv; acc += s[o + Math.min(w - 1, x + r + 1)] - s[o + Math.max(0, x - r)]; } } }
function boxV(s, t, w, h, r) { const inv = 1 / (2 * r + 1); for (let x = 0; x < w; x++) { let acc = 0; for (let y = -r; y <= r; y++) acc += s[Math.min(h - 1, Math.max(0, y)) * w + x]; for (let y = 0; y < h; y++) { t[y * w + x] = acc * inv; acc += s[Math.min(h - 1, y + r + 1) * w + x] - s[Math.max(0, y - r) * w + x]; } } }
function blurF(src, w, h, sigma) {
  const out = src.slice(); if (sigma < .4) return out;
  const r = Math.max(1, Math.round((Math.sqrt(4 * sigma * sigma + 1) - 1) / 2)), tmp = new Float32Array(src.length);
  for (let p = 0; p < 3; p++) { boxH(out, tmp, w, h, r); boxV(tmp, out, w, h, r); }
  return out;
}
function seeded(seed) { let q = seed; return () => (q = (q * 16807) % 2147483647) / 2147483647; }
// 원본(흉상 누끼 또는 내 사진)을 bw×bh 판에 그려 알파·밝기 배열로
function srcArrays(src, bw, bh, k, circle) {
  const c = document.createElement('canvas'); c.width = bw; c.height = bh; const g = c.getContext('2d', { willReadFrequently: true });
  if (src.cut) g.drawImage(src.img, 0, 0, bw, bh);
  else {
    const im = src.img, sc = Math.max(bw / im.width, bh / im.height); g.drawImage(im, (bw - im.width * sc) / 2, (bh - im.height * sc) * .3, im.width * sc, im.height * sc);
    if (circle) { g.globalCompositeOperation = 'destination-in'; const gr = g.createRadialGradient(circle.x, circle.y, circle.r * .9, circle.x, circle.y, circle.r); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, bw, bh); }
  }
  const d = g.getImageData(0, 0, bw, bh).data, n = bw * bh, A = new Float32Array(n), G = new Float32Array(n);
  for (let i = 0; i < n; i++) { A[i] = d[i * 4 + 3] / 255; G[i] = (d[i * 4] * .299 + d[i * 4 + 1] * .587 + d[i * 4 + 2] * .114) / 255; }
  return { A, G };
}
function reliefShade(src, bw, bh, k, o) {
  const { A, G } = srcArrays(src, bw, bh, k, src.cut ? null : { x: bw / 2, y: bh * .46, r: bw * .5 }), n = bw * bh;
  const dome = blurF(A, bw, bh, o.blur * k); for (let i = 0; i < n; i++) dome[i] = Math.pow(Math.min(1, dome[i] * 1.25), .7);
  const gb = blurF(G, bw, bh, 6 * k), hp = new Float32Array(n); for (let i = 0; i < n; i++) hp[i] = G[i] - gb[i];
  const det = blurF(hp, bw, bh, 1.1 * k), detail = src.cut ? o.detail : o.detail * 1.6, H = new Float32Array(n);
  for (let i = 0; i < n; i++) H[i] = dome[i] * (1 - detail) + (dome[i] > .05 ? det[i] * 2.2 * detail : 0) + A[i] * .06;
  const s = o.strength * k * (o.invert ? -1 : 1), Lx = -.55, Ly = -.62, Lz = .56, ln = Math.hypot(Lx, Ly, Lz), lx = Lx / ln, ly = Ly / ln, lz = Lz / ln;
  const sh = new Float32Array(n), rnd = seeded(3);
  for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
    const xm = Math.max(0, x - 1), xp = Math.min(bw - 1, x + 1), ym = Math.max(0, y - 1) * bw, yp = Math.min(bh - 1, y + 1) * bw, yo = y * bw;
    const gx = (H[ym + xp] + 2 * H[yo + xp] + H[yp + xp]) - (H[ym + xm] + 2 * H[yo + xm] + H[yp + xm]);
    const gy = (H[yp + xm] + 2 * H[yp + x] + H[yp + xp]) - (H[ym + xm] + 2 * H[ym + x] + H[ym + xp]);
    let nx = -gx * s, ny = -gy * s; const nl = Math.hypot(nx, ny, 1), lit = Math.max(0, (nx * lx + ny * ly + lz) / nl), i = yo + x;
    sh[i] = o.invert ? .12 + lit * .78 - H[i] * .12 : .38 + lit * .62 + (rnd() - .5) * .06;
  }
  return { A, sh };
}
// 테·톱니 테·바탕 (픽셀)
function coinBase(N, L, style) {
  const k = N / 900, C = N / 2, R = 430 * k, rimW = (style === 'c' ? 30 : 34) * k, img = new ImageData(N, N), d = img.data;
  let noise = null; if (style === 'c') { const r = seeded(5); noise = new Float32Array(N * N); for (let i = 0; i < noise.length; i++) noise[i] = r(); noise = blurF(noise, N, N, 1.2 * k); }
  const dent = style !== 'b', put = (i, v, a) => { const j = Math.max(0, Math.min(255, Math.round(v * 255))) * 3; d[i] = L[j]; d[i + 1] = L[j + 1]; d[i + 2] = L[j + 2]; d[i + 3] = a; };
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    const dx = x + .5 - C, dy = y + .5 - C, rr = Math.hypot(dx, dy), i = (y * N + x) * 4;
    if (rr > R + 1) { d[i + 3] = 0; continue; }
    const th = Math.atan2(dy, dx), a = Math.round(Math.max(0, Math.min(1, R + .5 - rr)) * 255), lit = -Math.cos(th + 2.3);
    let v;
    if (rr >= R - rimW) { const cs = Math.cos(th + 2.3); v = (rr > R - 7 * k ? .5 + .3 * cs : .55 + .45 * cs) * .85 + .1; }
    else if (style === 'a') { const X = x * 900 / N, Y = y * 900 / N; v = .18 + .22 * Math.exp(-(((X - Y) / 520) ** 2)) + .25 * Math.exp(-(((X + Y - 1250) / 140) ** 2)); }
    else if (style === 'b') { const X = x * 900 / N, Y = y * 900 / N; v = .62 + .14 * Math.cos(th * 2 + .8) * (rr / R) + .08 * Math.exp(-(((X - Y) / 600) ** 2)); }
    else v = .62 + .06 * Math.cos(th - 2.3) + (noise[y * N + x] - .5) * .08;
    if (rr >= R - rimW - 3 * k && rr < R - rimW + 2 * k) v = .25 + (.5 + .5 * lit) * .7;
    if (dent && rr > R - rimW - 22 * k && rr < R - rimW - 6 * k && Math.cos(th * 200) > .1) v = Math.min(1, .45 + .35 * lit + .2);
    put(i, Math.max(0, Math.min(1, v)), a);
  }
  return img;
}
function compositeShade(img, N, L, res, ox, oy, bw, bh, maskFn) {
  const d = img.data;
  for (let y = 0; y < bh; y++) { const Y = oy + y; if (Y < 0 || Y >= N) continue;
    for (let x = 0; x < bw; x++) { const X = ox + x; if (X < 0 || X >= N) continue;
      const j = y * bw + x, a = res.A[j] * maskFn(X, Y); if (a <= .002) continue;
      const i = (Y * N + X) * 4, li = Math.max(0, Math.min(255, Math.round(res.sh[j] * 255))) * 3;
      d[i] = d[i] * (1 - a) + L[li] * a; d[i + 1] = d[i + 1] * (1 - a) + L[li + 1] * a; d[i + 2] = d[i + 2] * (1 - a) + L[li + 2] * a; } }
}
let coinKey = '';   // 흉상 그림이 늦게 오면 비워서 다시 그림
const coinCache = {};   // 화면 크기·저장 크기를 따로 기억
function coinFace(style, P, src) {
  const N = Math.round(300 * SCALE), key = [style, metal, src ? src.id : '-', N, coinKey].join('|');
  if (coinCache[N] && coinCache[N].key === key) return coinCache[N].cv;
  const k = N / 900, C = N / 2, L = makeLUT(P), img = coinBase(N, L, style);
  if (src && style !== 'b') {
    const lim = (style === 'a' ? 318 : 330) * k, floor = C + (style === 'a' ? 236 : 250) * k;
    // 흉상 윗변이 원 밖에 오게 둬서 자른 자국이 안 보이게
    const bh = Math.round(floor - (C - lim - 4 * k)), bw = Math.round(bh * src.img.width / src.img.height) || bh, ox = Math.round(C - bw / 2), oy = Math.round(C - lim - 4 * k);
    const res = reliefShade(src, bw, bh, k, style === 'a' ? { blur: 12, detail: .28, strength: 10 } : { blur: 10, detail: .3, strength: 11, invert: true });
    compositeShade(img, N, L, res, ox, oy, bw, bh, (X, Y) => (Math.hypot(X - C, Y - C) < lim && Y < floor) ? 1 : 0);
  }
  const cv2 = document.createElement('canvas'); cv2.width = cv2.height = N; const g = cv2.getContext('2d'); g.putImageData(img, 0, 0);
  if (style === 'b') {   // 기요셰 테 + 선 판화 초상
    g.save(); g.translate(C, C); g.lineWidth = 1 * k; g.strokeStyle = lutCss(L, 60).replace('rgb', 'rgba').replace(')', ',.6)');
    for (let q = 0; q < 18; q++) { g.beginPath(); for (let i = 0; i <= 720; i++) { const t = i / 720 * TAU, r = (336 + 26 * Math.sin(9 * t + q * TAU / 18) * Math.cos(3 * t)) * k; i ? g.lineTo(r * Math.cos(t), r * Math.sin(t)) : g.moveTo(r * Math.cos(t), r * Math.sin(t)); } g.stroke(); }
    g.lineWidth = 2 * k; g.strokeStyle = lutCss(L, 50); [300, 372].forEach(r => { g.beginPath(); g.arc(0, 0, r * k, 0, TAU); g.stroke(); });
    g.restore();
    const SQ = Math.round(584 * k), pc = document.createElement('canvas'); pc.width = pc.height = SQ; const pg = pc.getContext('2d', { willReadFrequently: true });
    pg.fillStyle = '#fff'; pg.fillRect(0, 0, SQ, SQ);
    if (src) { if (src.cut) { const bh = Math.round(620 * k), bw = Math.round(bh * src.img.width / src.img.height); pg.drawImage(src.img, (SQ - bw) / 2, 0, bw, bh); }
      else { const im = src.img, sc = Math.max(SQ / im.width, SQ / im.height); pg.drawImage(im, (SQ - im.width * sc) / 2, (SQ - im.height * sc) * .3, im.width * sc, im.height * sc); } }
    const pd = pg.getImageData(0, 0, SQ, SQ).data; let G = new Float32Array(SQ * SQ);
    for (let i = 0; i < G.length; i++) G[i] = (pd[i * 4] * .299 + pd[i * 4 + 1] * .587 + pd[i * 4 + 2] * .114) / 255;
    G = blurF(G, SQ, SQ, 1 * k); for (let i = 0; i < G.length; i++) G[i] = Math.max(0, Math.min(1, (G[i] - .55) * 1.5 + .55));
    g.save(); g.translate(C - SQ / 2, C - SQ / 2); g.beginPath(); g.arc(SQ / 2, SQ / 2, SQ / 2, 0, TAU); g.clip(); g.fillStyle = lutCss(L, 28);
    const sp = 5.6 * k;
    for (let y = 2 * k; y < SQ; y += sp) {
      const top = [], bot = [];
      for (let x = 0; x <= SQ; x += 2) { const yy = y + 1.3 * k * Math.sin(x / (52 * k)), iy = Math.min(SQ - 1, Math.max(0, yy | 0)), ix = Math.min(SQ - 1, x | 0), dk = 1 - G[iy * SQ + ix], w = .5 * k + Math.pow(dk, 1.15) * sp * .7; top.push(x, yy - w / 2); bot.push(x, yy + w / 2); }
      g.beginPath(); g.moveTo(top[0], top[1]); for (let i = 2; i < top.length; i += 2) g.lineTo(top[i], top[i + 1]); for (let i = bot.length - 2; i >= 0; i -= 2) g.lineTo(bot[i], bot[i + 1]); g.closePath(); g.fill();
    }
    g.restore();
  }
  if (metal === 'aurora') {   // 오로라: 진주빛 무지개 광택 (원래 메달과 같은 색)
    g.save(); g.beginPath(); g.arc(C, C, 430 * k, 0, TAU); g.clip(); g.globalCompositeOperation = 'soft-light'; g.globalAlpha = .85;
    const ir = g.createLinearGradient(N * .07, N * .1, N * .93, N * .9); [[0, '#FF9FD6'], [.25, '#9FE8FF'], [.5, '#FFF0A6'], [.75, '#C9A8FF'], [1, '#FF9FD6']].forEach(([t, c]) => ir.addColorStop(t, c));
    g.fillStyle = ir; g.fillRect(0, 0, N, N); g.restore();
  }
  coinCache[N] = { key, cv: cv2 }; return cv2;
}
function coinArc(text, r, bottom, font, fill, under, gap, off) {
  ctx.save(); ctx.translate(150, 150); ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const ch = [...text], w = ch.map(c => ctx.measureText(c).width + gap), tot = w.reduce((a, b) => a + b, 0), dir = bottom ? -1 : 1;
  let a = -dir * tot / r / 2;
  ch.forEach((c, i) => { const st = w[i] / r; a += dir * st / 2; ctx.save(); ctx.rotate(a); const y = bottom ? r : -r;
    if (under) { ctx.fillStyle = under; ctx.fillText(c, off, y + off); } ctx.fillStyle = fill; ctx.fillText(c, 0, y); ctx.restore(); a += dir * st / 2; });
  ctx.restore();
}
function renderCoin(P, name, style) {
  const src = coinSrc(), face = coinFace(style, P, src), L = makeLUT(P);
  ctx.save(); ctx.shadowColor = 'rgba(32,20,40,.26)'; ctx.shadowBlur = 5 * SCALE; ctx.shadowOffsetY = 2.2 * SCALE; ctx.drawImage(face, 0, 0, 300, 300); ctx.restore();
  if (style === 'a') {
    const frost = lutCss(L, 225), sh = lutCss(L, 30), y0 = 150 + 238 / 3;
    coinArc('RYU SEOLHYANG · PARFUMEUR', 117.3, false, '600 11.3px "CG",serif', frost, sh, 1.7, .45);
    ctx.fillStyle = lutCss(L, 235); ctx.fillRect(150 - 78.7, y0 - .5, 157.4, 1); ctx.fillStyle = lutCss(L, 40); ctx.fillRect(150 - 78.7, y0 + .5, 157.4, .35);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = frost;
    ctx.font = '600 10px "CG",serif'; ctx.fillText('No.15  ·  MMXXVI', 150, y0 + 14.7);
    fitFont('FOR ' + name, 800, 10, '"NM",serif', 120); ctx.fillText('FOR ' + name, 150, y0 + 30.4);
  } else if (style === 'b') {
    const ink = lutCss(L, 35);
    coinArc('HYANGBANG  ·  No.15  ·  FOR ONE CLIENT ONLY', 130.7, false, '700 9.3px "CG",serif', ink, null, 1.35, 0);
    coinArc(name + ' · MMXXVI', 130.7, true, '400 9.3px "NM",serif', ink, null, 2, 0);
  } else {
    const ink = lutCss(L, 40), hi = lutCss(L, 250);
    coinArc('RYU SEOLHYANG · HYANGBANG', 120, false, '700 11.3px "CG",serif', ink, hi, 1.7, .45);
    coinArc('No.15 · ' + name + ' · 2026', 120, true, '400 9.3px "NM",serif', ink, hi, 1.7, .45);
  }
}

markActive('bframe', booth.frame); markActive('bside', booth.side); markActive('bbg', booth.bg); setStyle(booth.style); pickHer('15');
drawBooth();
document.fonts && document.fonts.ready.then(drawBooth);

} }; })();
