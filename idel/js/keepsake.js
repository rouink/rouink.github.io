/* 이델 표구실 — 포토카드 · 인생 두컷 (류설향 포장대와 같은 원래 기능, 글꼴·모양만 북탑 화실 것으로)
   이델 전용 모양: 포토카드 금박 액자·스케치북 낱장·도록 캡션 / 인생 두컷 두 폭 그림·크로키 띠, 배경 북탑 화실.
   표구실을 처음 열 때 IDEL_KEEPSAKE.init() 한 번. 올린 사진과 이름은 기기 밖으로 나가지 않음. */
window.IDEL_KEEPSAKE = (() => { let done = false; return { init() { if (done) return; done = true;
const $ = id => document.getElementById(id);
const PAGE = { brand: 'IDEL', metal: 'gold', enamel: ['#9E3A5C', '#4A1A2B'], boothPaper: ['#FBF9F4', '#ECE7DE', '#24201D', '#5E554D'], guestName: '당신' };
const characters = { idel: { name: '이델', booth: ['assets/booth/idel_1.webp', 'assets/booth/idel_2.webp'] } };
const charIds = Object.keys(characters);
const BRAND = PAGE.brand;
const esc = t => String(t).replace(/[&<>"']/g, m => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[m]));
const HER_LIST = ['03','01','02','04','07','08','10','12','13','14'];
$('pc-thumbs').innerHTML = '<button type="button" class="kth up" id="btn-upload" aria-label="내 사진 올리기"><span>내 사진<br>올리기</span></button>' + HER_LIST.map(n => `<button type="button" class="kth" data-her="${n}" aria-label="${n}번 사진"><img src="assets/p/s${n}.jpg?v=2" alt="" loading="lazy"></button>`).join('');
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
  ctx.save(); ctx.font = 'bold 78px "Mrs Saint Delafield","Noto Serif KR",serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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
  // 이델 전용: 금박 액자 / 스케치북 낱장 / 도록 캡션
  gilt:    { custom:'gilt',    sc:[150,150], path(p) { p.rect(48, 10, 204, 280); } },
  sketch:  { custom:'sketch',  sc:[150,150], path(p) { p.rect(42, 16, 216, 270); } },
  caption: { custom:'caption', sc:[150,150], path(p) { p.rect(50, 8, 200, 284); } },
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
  const mr = document.getElementById('metal-row'); if (mr) mr.style.display = (t === 'sketch' || t === 'caption') ? 'none' : '';
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
  ctx.font = '400 10px "Marcellus","Noto Serif KR",serif';
  const base = chars.reduce((a, c) => a + ctx.measureText(c).width + sp, -sp);
  const size = Math.max(8.5, Math.min(14, 10 * (w - 10) / base));
  ctx.font = `bold ${size}px "Marcellus","Noto Serif KR",serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
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
  ctx.font = 'bold 118px "Mrs Saint Delafield","Noto Serif KR",serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
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
  ctx.font = '400 6.6px "Marcellus","Noto Serif KR",serif'; spaced(BRAND, ax + 11, ay + 17, 1.6, 'left');
  ctx.font = '400 6.6px "Marcellus","Noto Serif KR",serif'; spaced(serialOf(name), ax + aw - 11, ay + 17, 1.2, 'right');
  let fs = 26; ctx.font = `700 ${fs}px "Marcellus","Noto Serif KR",serif`;
  const nw = [...name].reduce((a, c) => a + ctx.measureText(c).width + 1.5, 0); if (nw > aw - 24) fs = Math.max(12, fs * (aw - 24) / nw);
  ctx.font = `700 ${fs}px "Marcellus","Noto Serif KR",serif`;
  ctx.save(); ctx.shadowColor = 'rgba(0,0,0,.55)'; ctx.shadowBlur = 6; ctx.shadowOffsetY = 1.5; ctx.fillStyle = foil(ax, ay + ah - 70, ax + aw, ay + ah, P);
  spaced(name, ax + 12, ay + ah - 30, 1.5, 'left'); ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = .6; ctx.beginPath(); ctx.moveTo(ax + 12, ay + ah - 22); ctx.lineTo(ax + aw - 12, ay + ah - 22); ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.font = '400 6.2px "Marcellus","Noto Serif KR",serif';
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
  arcFill(BRAND, r - 22, false, '400 9px "Marcellus","Noto Serif KR",serif', 2.2);
  ctx.fillStyle = foil(-80, 60, 80, 140, P); ctx.shadowBlur = 6;
  let fs = 19; ctx.font = `700 ${fs}px "Marcellus","Noto Serif KR",serif`; const nw = [...name].reduce((a, c) => a + ctx.measureText(c).width + 1.8, 0); if (nw > 170) fs = Math.max(11, fs * 170 / nw);
  arcFill(name, r - 14, true, `700 ${fs}px "Marcellus","Noto Serif KR",serif`, 1.8);
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
  if (S.custom === 'gilt') { renderGilt(P, name); return; }
  if (S.custom === 'sketch') { renderSketch(P, name); return; }
  if (S.custom === 'caption') { renderCaption(P, name); return; }
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
  if (!avatar) arcText(BRAND, 67.6, false, P, '400 8.4px "Marcellus","Noto Serif KR",serif', 3);
  if (!avatar) arcText(serialOf(name) + ' · 2026', 73.6, true, P, '400 7.4px "Marcellus","Noto Serif KR",serif', 2);
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
  setTimeout(() => { try { saveCanvas(badgeCanvas(1800), `idel-card-${Date.now()}.png`); } finally { bt.textContent = label; bt.disabled = false; } }, 40);
});

// data.js page.metal: 기념주화·인생 두컷의 처음 마감 (gold · rose · silver · aurora), page.enamel: ['#밝은색','#어두운색'] 에나멜 색을 작품 색으로
const DEF_METAL = METALS[PAGE.metal] ? PAGE.metal : 'gold';
if (Array.isArray(PAGE.enamel) && PAGE.enamel.length === 2) Object.values(METALS).forEach(m => { m.enamel = PAGE.enamel.slice(); });
selectMetal(DEF_METAL); selectShape('gilt'); selectPhoto('color');
Promise.all([
  document.fonts.load('400 10px "Marcellus"'), document.fonts.load('400 13px "Noto Serif KR"'), document.fonts.load('700 13px "Noto Serif KR"'),
  document.fonts.load('900 13px "Noto Serif KR"'), document.fonts.load('20px "Mrs Saint Delafield"'), document.fonts.load('20px "Yeon Sung"')
]).then(() => { skKey = ''; drawCoin(); drawBooth(); }).catch(() => {});

/* ===== 인생 두컷: 사진 2장을 순서대로 올리면 프레임에 합성 + 캐릭터 PNG 겹치기 =====
   캐릭터 PNG는 characters[id].booth 경로에 넣으면 자동으로 쓰입니다(없으면 자리표시 실루엣). */
const bcv = $('booth-canvas');
const BW = 600, BH = 1156, CUTS = [{ x:36, y:104, w:528, h:440 }, { x:36, y:572, w:528, h:440 }];   // 컷 비율 6:5 (캐릭터가 컷을 넉넉히 채우도록)
bcv.height = Math.round(bcv.width * BH / BW); bcv.style.aspectRatio = `${BW} / ${BH}`;
const booth = { char: charIds[0], frame: DEF_METAL, side: 'right', bg: 'tower', style: 'diptych', photos: [null, null], cutouts: [null, null], tf: [{ zoom: 1, dx: 0, dy: 0 }, { zoom: 1, dx: 0, dy: 0 }], sel: 0 };
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
  } else if (kind === 'tower') {   // 북탑 화실: 리넨 벽 + 왼쪽 위 창빛 + 나무 바닥
    lin([[0, '#F4EFE6'], [.72, '#E9E1D3'], [1, '#DCCFBA']]);
    glow(x + w * .1, y + h * .06, w * .9, 'rgba(255,240,212,.95)');
    g.save(); g.globalAlpha = .17; g.fillStyle = '#FFF6E0';
    g.beginPath(); g.moveTo(x + w * .02, y); g.lineTo(x + w * .26, y); g.lineTo(x + w * .72, y + h); g.lineTo(x + w * .44, y + h); g.closePath(); g.fill();
    g.beginPath(); g.moveTo(x + w * .31, y); g.lineTo(x + w * .4, y); g.lineTo(x + w * .88, y + h); g.lineTo(x + w * .78, y + h); g.closePath(); g.fill(); g.restore();
    const fl = g.createLinearGradient(x, y + h * .8, x, y + h); fl.addColorStop(0, 'rgba(150,112,72,0)'); fl.addColorStop(1, 'rgba(150,112,72,.24)'); g.fillStyle = fl; g.fillRect(x, y, w, h);
    g.fillStyle = 'rgba(120,88,56,.14)'; g.fillRect(x, y + h * .86, w, 1.5);
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
  g.fillStyle = 'rgba(255,255,255,.9)'; g.font = '400 13px "Marcellus","Noto Serif KR",serif'; g.textAlign = 'center'; g.fillText('CHARACTER', cx, y + h - 34);
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
      if (cut === 'pending') { g.fillStyle = 'rgba(30,25,40,.42)'; g.fillRect(k.x, k.y, k.w, k.h); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '20px "Noto Serif KR", serif'; g.fillText('사진에서 사람을 오려내는 중…', k.x + k.w / 2, k.y + k.h / 2); }
    }
  } else {
    const cx = zx + zw / 2; g.fillStyle = 'rgba(60,45,35,.8)'; g.shadowColor = 'rgba(255,255,255,.9)'; g.shadowBlur = 6; g.textAlign = 'center';
    g.font = '700 54px "Marcellus","Noto Serif KR",serif'; g.fillText(String(i + 1).padStart(2, '0'), cx, k.y + k.h * .45);
    g.font = '18px "Noto Serif KR", serif'; g.fillText(`${i + 1}번째 사진의`, cx, k.y + k.h * .45 + 34); g.fillText('사람이 여기 서요', cx, k.y + k.h * .45 + 58); g.shadowBlur = 0;
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
  g.textBaseline = 'alphabetic'; g.fillStyle = BP[2]; g.font = '700 24px "Marcellus","Noto Serif KR",serif'; bSpaced(g, BRAND, BW / 2, 62, 5);
  g.fillStyle = mix(P.base, P.dark, .45); g.font = '400 12px "Marcellus","Noto Serif KR",serif'; bSpaced(g, 'LIFE  ·  TWO  CUTS', BW / 2, 86, 3);
  // 두 컷
  CUTS.forEach((k, i) => {
    g.save(); bRR(g, k.x, k.y, k.w, k.h, 10); g.clip();
    drawCut(g, k, i, scale);
    g.restore();
    bRR(g, k.x, k.y, k.w, k.h, 10); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,.9)'; g.stroke();
    g.fillStyle = 'rgba(255,255,255,.95)'; g.font = '400 14px "Marcellus","Noto Serif KR",serif'; g.textAlign = 'left'; g.shadowColor = 'rgba(0,0,0,.45)'; g.shadowBlur = 4;
    g.fillText(`CUT ${String(i + 1).padStart(2, '0')}`, k.x + 16, k.y + 30); g.shadowBlur = 0;
  });
  // 바닥글: with 캐릭터 · 날짜 · 이름 · 번호
  const user = guestName();
  const d = new Date(), date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  g.textAlign = 'center'; g.fillStyle = BP[2]; g.font = '30px "Noto Serif KR",serif'; g.fillText(`with ${c.name}`, BW / 2, BH - 88);
  g.fillStyle = bFoil(g, 150, BH - 80, 450, BH - 50, booth.frame); g.fillRect(BW / 2 - 90, BH - 74, 180, 1.5);
  g.fillStyle = BP[3]; g.font = '400 13px "Marcellus","Noto Serif KR",serif'; bSpaced(g, `${date}  ·  ${user.toUpperCase()}  ·  ${serialOf(user.toUpperCase())}`, BW / 2, BH - 44, 2);
  bSparkle(g, 66, BH - 100, 12, .9); bSparkle(g, 534, BH - 70, 9, .9);
}
function drawBooth() { renderBooth(bcv.getContext('2d'), bcv.width / BW); updateBoothUI(); }
function updateBoothUI() {
  const need = needNow(), n = booth.photos.slice(0, need).filter(Boolean).length, S = boothStyle();
  if (need === 1) { $('booth-upload-btn').textContent = n ? '사진 바꾸기' : '사진 올리기'; $('booth-step').textContent = (S.steps || [])[n ? 2 : 0] || (n ? '완성! 마음에 들면 저장하세요.' : '사진 한 장을 올려 주세요.'); $('booth-download').disabled = !n; return; }
  $('booth-upload-btn').textContent = n === 0 ? '1번 사진 올리기' : n === 1 ? '2번 사진 올리기' : `${booth.sel + 1}번 사진 바꾸기`;
  $('booth-step').textContent = n === 0 ? `① 첫 번째 사진을 올린다. 사진 속 사람만 오려 내 그녀 옆에 나란히 세운다. 사람이 또렷하게 나온 사진이 잘 어울린다.` : n === 1 ? '② 두 번째 사진을 올린다.' : '다 됐다. 마음에 들면 저장한다. 처음부터 하려면 ‘다시’.';
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
  saveCanvas(off, `${(boothStyle() && boothStyle().file) || 'idel-2cut'}-${Date.now()}.png`);
});
/* ===== 이델 전용 모양: 포토카드 금박 액자 · 스케치북 낱장 · 도록 캡션 / 인생 두컷 두 폭 그림 · 크로키 띠 ===== */
const pad2 = n => String(n).padStart(2, '0');
const today = (sep = '.') => { const d = new Date(); return `${d.getFullYear()}${sep}${pad2(d.getMonth() + 1)}${sep}${pad2(d.getDate())}`; };
const IMP = () => { const d = new Date(); return `1127. ${d.getMonth() + 1}. ${d.getDate()}.`; };   // 제국력: 해는 1127, 달·날은 오늘
const ORDK = ['', '첫', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열', '열한', '열두'];
const SITS = () => { const S = window.IDEL_STATE; return S ? Math.max(0, Math.min(12, S.n || 0)) : 0; };
const INK = '#24201D', INK2 = '#2E2925', MUTE = '#5E554D', ROSE = '#9E3A5C', GOLD = '#C8AE6E', CHAR = 'rgba(42,38,34,.86)';
const F_LB = '"Marcellus",serif', F_KO = '"Noto Serif KR",serif', F_HAND = '"Yeon Sung","Noto Serif KR",cursive', F_SIG = '"Mrs Saint Delafield",cursive';

function patternGrain(c, sc) { const p = c.createPattern(grain, 'repeat'); try { p.setTransform(new DOMMatrix().scale(1 / sc)); } catch (e) {} return p; }
function grainOver(path, a) { ctx.save(); ctx.clip(path); ctx.globalCompositeOperation = 'multiply'; ctx.globalAlpha = a; ctx.fillStyle = patternGrain(ctx, SCALE); ctx.fillRect(0, 0, 300, 300); ctx.restore(); }
function fitFont(text, weight, size, family, maxW, gap = 0) { let s = size; ctx.font = `${weight} ${s}px ${family}`; const w = [...text].reduce((a, c) => a + ctx.measureText(c).width + gap, -gap); if (w > maxW) s = Math.max(size * .5, s * maxW / w); ctx.font = `${weight} ${s}px ${family}`; return s; }
// 액자 몰딩: 위·왼쪽은 밝게, 아래·오른쪽은 어둡게 (볼록) — hi/lo를 바꾸면 오목
function bevelOn(c, x, y, w, h, t, hi, lo) {
  const T = (p, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(p[0], p[1]); for (let i = 2; i < p.length; i += 2) c.lineTo(p[i], p[i + 1]); c.closePath(); c.fill(); };
  T([x, y, x + w, y, x + w - t, y + t, x + t, y + t], hi);
  T([x, y, x + t, y + t, x + t, y + h - t, x, y + h], hi);
  T([x + w, y, x + w, y + h, x + w - t, y + h - t, x + w - t, y + t], lo);
  T([x, y + h, x + t, y + h - t, x + w - t, y + h - t, x + w, y + h], lo);
}
// 구슬 몰딩: 테를 따라 작은 구슬
function beadsOn(c, x, y, w, h, r, step, fill, dark) {
  const dot = (cx, cy) => { c.fillStyle = dark; c.beginPath(); c.arc(cx + r * .28, cy + r * .34, r, 0, TAU); c.fill(); c.fillStyle = fill; c.beginPath(); c.arc(cx, cy, r, 0, TAU); c.fill(); };
  for (let px = x; px <= x + w + .01; px += step) { dot(px, y); dot(px, y + h); }
  for (let py = y + step; py < y + h - .01; py += step) { dot(x, py); dot(x + w, py); }
}
const HI = 'rgba(255,250,232,.55)', LO = 'rgba(64,42,12,.36)';

/* 포토카드 · 금박 액자 — 그녀가 거는 초상 액자 */
function renderGilt(P, name) {
  const X = 48, Y = 10, W = 204, H = 280, F = 25;
  ctx.save(); ctx.shadowColor = 'rgba(36,26,14,.34)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 6; ctx.fillStyle = foil(X, Y, X + W, Y + H, P); ctx.fillRect(X, Y, W, H); ctx.restore();
  ctx.save(); ctx.globalAlpha = .5; ctx.fillStyle = foil(X + W, Y, X, Y + H, P); ctx.fillRect(X + 6, Y + 6, W - 12, H - 12); ctx.restore();
  bevelOn(ctx, X, Y, W, H, 5, HI, LO);
  bevelOn(ctx, X + 7, Y + 7, W - 14, H - 14, 4, LO, HI);
  beadsOn(ctx, X + 13.5, Y + 13.5, W - 27, H - 27, 1.15, 3.6, mix(P.light, P.hi, .4), mix(P.base, P.dark, .55));
  bevelOn(ctx, X + 17, Y + 17, W - 34, H - 34, 6, HI, LO);
  const ax = X + F, ay = Y + F, aw = W - 2 * F, ah = H - 2 * F;
  ctx.fillStyle = '#EDE6D8'; ctx.fillRect(ax - 2, ay - 2, aw + 4, ah + 4);
  ctx.save(); ctx.beginPath(); ctx.rect(ax, ay, aw, ah); ctx.clip();
  if (avatar) cover(avatar, ax, ay, aw, ah, .18); else placeholderArt(P, ax, ay, aw, ah, name, ay + ah * .42);
  ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgba(232,206,160,.16)'; ctx.fillRect(ax, ay, aw, ah);   // 바니시
  ctx.globalAlpha = .26; ctx.fillStyle = patternGrain(ctx, SCALE); ctx.fillRect(ax, ay, aw, ah); ctx.globalAlpha = 1;   // 캔버스 결
  ctx.globalCompositeOperation = 'source-over';
  const sT = ctx.createLinearGradient(0, ay, 0, ay + 14); sT.addColorStop(0, 'rgba(30,20,8,.34)'); sT.addColorStop(1, 'rgba(30,20,8,0)'); ctx.fillStyle = sT; ctx.fillRect(ax, ay, aw, 14);
  const sL = ctx.createLinearGradient(ax, 0, ax + 10, 0); sL.addColorStop(0, 'rgba(30,20,8,.22)'); sL.addColorStop(1, 'rgba(30,20,8,0)'); ctx.fillStyle = sL; ctx.fillRect(ax, ay, 10, ah);
  ctx.restore();
  [[X + 8.5, Y + 8.5], [X + W - 8.5, Y + 8.5], [X + 8.5, Y + H - 8.5], [X + W - 8.5, Y + H - 8.5]].forEach(([x, y]) => raised2(diamond(x, y, 2.6), P));
  // 이름 명판
  const pw = 74, ph = 11, px = 150 - pw / 2, py = Y + H - 18.5;
  ctx.save(); ctx.shadowColor = 'rgba(30,20,8,.4)'; ctx.shadowBlur = 2; ctx.shadowOffsetY = .8; ctx.fillStyle = foil(px, py, px + pw, py + ph, P); ctx.fillRect(px, py, pw, ph); ctx.restore();
  bevelOn(ctx, px, py, pw, ph, 1.2, HI, LO);
  ctx.fillStyle = mix(P.dark, '#000000', .25); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  fitFont(name, 700, 6.4, F_KO, pw - 10); ctx.fillText(name, 150, py + ph / 2 + .3);
  ctx.textBaseline = 'alphabetic';
}

/* 포토카드 · 스케치북 낱장 — 사진을 목탄 크로키로 */
let skKey = '', skCv = null;
function sketchOf(w, h) {
  const key = avatarId + '@' + SCALE + (avatar ? '' : 'n'); if (key === skKey && skCv) return skCv;
  const cw = Math.round(w * SCALE), ch = Math.round(h * SCALE), c = document.createElement('canvas'); c.width = cw; c.height = ch;
  const o = c.getContext('2d', { willReadFrequently: true });
  if (avatar) { const k = Math.max(cw / avatar.width, ch / avatar.height), iw = avatar.width * k, ih = avatar.height * k; o.drawImage(avatar, (cw - iw) / 2, (ch - ih) * .2, iw, ih); }
  else { o.fillStyle = '#d8d2c8'; o.fillRect(0, 0, cw, ch); }
  const d = o.getImageData(0, 0, cw, ch), a = d.data, n = cw * ch, G = new Float32Array(n);
  for (let i = 0; i < n; i++) G[i] = (a[i * 4] * .299 + a[i * 4 + 1] * .587 + a[i * 4 + 2] * .114) / 255;
  const B = blurF(G, cw, ch, 2.4 * SCALE / 3), rnd = seeded(9);
  for (let i = 0; i < n; i++) {
    const s = Math.min(1, G[i] / Math.max(.05, B[i])), v = Math.pow(s, 7), tone = Math.max(0, .6 - G[i]);
    const dk = Math.min(1, (1 - v) * 1.25 + tone * .5) * (.78 + rnd() * .34);
    a[i * 4] = 42; a[i * 4 + 1] = 38; a[i * 4 + 2] = 34; a[i * 4 + 3] = Math.round(Math.min(1, dk) * 255);
  }
  o.putImageData(d, 0, 0);
  o.globalCompositeOperation = 'destination-in';
  const gr = o.createRadialGradient(cw / 2, ch * .42, Math.min(cw, ch) * .34, cw / 2, ch * .46, Math.max(cw, ch) * .66); gr.addColorStop(0, '#000'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  o.fillStyle = gr; o.fillRect(0, 0, cw, ch);
  skKey = key; skCv = c; return c;
}
function tape(c, x, y, w, h, rot, col) {
  c.save(); c.translate(x, y); c.rotate(rot); c.fillStyle = col; c.beginPath(); c.moveTo(-w / 2, -h / 2);
  for (let i = 0; i <= 6; i++) c.lineTo(-w / 2 + (i % 2 ? 1.2 : 0), -h / 2 + h * i / 6);
  for (let i = 6; i >= 0; i--) c.lineTo(w / 2 - (i % 2 ? 1.2 : 0), -h / 2 + h * i / 6);
  c.closePath(); c.fill(); c.restore();
}
function renderSketch(P, name) {
  ctx.save(); ctx.translate(150, 150); ctx.rotate(-.02); ctx.translate(-150, -150);
  const X = 42, Y = 16, W = 216, H = 270, pg = new Path2D();
  pg.moveTo(X, Y + 5); for (let x = X; x <= X + W; x += 3) pg.lineTo(x, Y + 3.4 + ((x * 13) % 7) * .34); pg.lineTo(X + W, Y + H); pg.lineTo(X, Y + H); pg.closePath();
  ctx.save(); ctx.shadowColor = 'rgba(36,26,14,.22)'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 5; ctx.fillStyle = '#F8F4EB'; ctx.fill(pg); ctx.restore();
  grainOver(pg, .3);
  ctx.save(); ctx.globalCompositeOperation = 'destination-out'; for (let x = X + 11; x < X + W - 6; x += 10.5) { ctx.beginPath(); ctx.arc(x, Y + 12, 1.7, 0, TAU); ctx.fill(); } ctx.restore();
  ctx.textBaseline = 'alphabetic'; ctx.fillStyle = MUTE; ctx.font = `400 5.2px ${F_LB}`;
  spaced('CROQUIS · No.313', X + 14, Y + 27, 1.5, 'left'); spaced(IMP(), X + W - 14, Y + 27, 1, 'right');
  const sx = X + 12, sy = Y + 33, sw = W - 24, sh = 172;
  ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.drawImage(sketchOf(sw, sh), sx, sy, sw, sh); ctx.restore();
  const n = SITS();
  ctx.fillStyle = INK; fitFont(name, 400, 17, F_HAND, sw * .7); ctx.textAlign = 'left'; ctx.fillText(name, X + 16, Y + 228);
  ctx.fillStyle = MUTE; ctx.font = `400 10px ${F_HAND}`;
  ctx.fillText(n ? `${ORDK[n]} 번째 회차. 그대로 있어.` : '아직 한 번도 안 앉았지.', X + 16, Y + 245);
  ctx.fillStyle = INK; ctx.font = `30px ${F_SIG}`; ctx.textAlign = 'right'; ctx.fillText('Idel', X + W - 22, Y + H - 14);
  ctx.fillStyle = GOLD; [0, 4.2].forEach(dx => { ctx.beginPath(); ctx.arc(X + W - 18 + dx, Y + H - 33, 1.15, 0, TAU); ctx.fill(); });
  tape(ctx, X + W - 20, Y + 9, 46, 13, .55, 'rgba(222,208,180,.78)');
  ctx.restore();
}

/* 포토카드 · 도록 캡션 — 회고 도록의 한 쪽 */
function renderCaption(P, name) {
  const X = 50, Y = 8, W = 200, H = 284, L = new Path2D(); L.rect(X, Y, W, H);
  ctx.save(); ctx.shadowColor = 'rgba(36,26,14,.2)'; ctx.shadowBlur = 12; ctx.shadowOffsetY = 5; ctx.fillStyle = '#FCFBF8'; ctx.fill(L); ctx.restore();
  grainOver(L, .12);
  const px = X + 14, py = Y + 14, pw = W - 28, ph = 150;
  ctx.fillStyle = '#EEE8DD'; ctx.fillRect(px, py, pw, ph);
  ctx.save(); ctx.beginPath(); ctx.rect(px + 7, py + 7, pw - 14, ph - 14); ctx.clip();
  if (avatar) cover(avatar, px + 7, py + 7, pw - 14, ph - 14, .2); else placeholderArt(P, px + 7, py + 7, pw - 14, ph - 14, name, py + ph * .45);
  ctx.restore();
  ctx.lineWidth = .4; ctx.strokeStyle = 'rgba(36,32,29,.28)'; ctx.strokeRect(px + 7.2, py + 7.2, pw - 14.4, ph - 14.4);
  let y = py + ph + 16; ctx.textBaseline = 'alphabetic';
  ctx.font = `400 5.2px ${F_LB}`; ctx.fillStyle = ROSE; spaced('PLATE 313', px, y, 1.7, 'left'); ctx.fillStyle = MUTE; spaced('CATALOGUE · IDEL', px + pw, y, 1.5, 'right');
  y += 19; ctx.fillStyle = INK; ctx.textAlign = 'left'; fitFont(name + '의 초상', 900, 15.5, F_KO, pw); ctx.fillText(name + '의 초상', px - .4, y);
  y += 9; ctx.fillStyle = 'rgba(36,32,29,.3)'; ctx.fillRect(px, y, pw, .4);
  const n = SITS(), rows = [['화가', '궁정화가 이델 · 제국력 1127'], ['재료', '캔버스에 유채 · 61 × 46 cm'], ['회차', n >= 12 ? '열두 번 앉음 · 완성' : `${n} / 12 · 아직 마르지 않음`]];
  rows.forEach(([k, v], i) => { const yy = y + 13 + i * 11.4; ctx.fillStyle = MUTE; ctx.font = `400 5.9px ${F_KO}`; ctx.fillText(k, px, yy); ctx.fillStyle = INK2; ctx.font = `400 6.4px ${F_KO}`; ctx.fillText(v, px + 22, yy); });
  ctx.fillStyle = GOLD; [0, 4.6].forEach(dx => { ctx.beginPath(); ctx.arc(px + 1.5 + dx, Y + H - 15, 1.3, 0, TAU); ctx.fill(); });
  ctx.fillStyle = MUTE; ctx.font = `400 4.8px ${F_LB}`; spaced('NORTH TOWER STUDIO', px + pw, Y + H - 13.4, 1.4, 'right');
}

/* ===== 인생 두컷 · 이델 모양 ===== */
function bGrain(g, scale, a, path) { g.save(); if (path) g.clip(path); g.globalCompositeOperation = 'multiply'; g.globalAlpha = a; g.fillStyle = patternGrain(g, scale); g.fillRect(0, 0, BW, BH); g.restore(); }
function bFit(g, text, weight, size, family, maxW) { let s = size; g.font = `${weight} ${s}px ${family}`; const w = g.measureText(text).width; if (w > maxW) s = Math.max(size * .5, s * maxW / w); g.font = `${weight} ${s}px ${family}`; }
function handRect(g, x, y, w, h, seed) {   // 목탄으로 두 번 그은 테
  const r = rng(seed * 31 + 7), j = () => (r() - .5) * 5; g.save(); g.strokeStyle = 'rgba(42,38,34,.8)'; g.lineCap = 'round';
  for (let pass = 0; pass < 2; pass++) {
    g.lineWidth = pass ? 1.3 : 2.4; g.globalAlpha = pass ? .7 : 1;
    const pts = [[x + j(), y + j()], [x + w + j(), y + j()], [x + w + j(), y + h + j()], [x + j(), y + h + j()]];
    g.beginPath();
    for (let s = 0; s < 4; s++) { const [ax, ay] = pts[s], [bx, by] = pts[(s + 1) % 4], ox = (bx - ax) * .025, oy = (by - ay) * .025;
      g.moveTo(ax - ox * (1 + r()), ay - oy * (1 + r())); g.quadraticCurveTo((ax + bx) / 2 + j(), (ay + by) / 2 + j(), bx + ox * (1 + r()), by + oy * (1 + r())); }
    g.stroke();
  }
  g.restore();
}
BOOTH_STYLES.diptych = {
  file: 'idel-diptych', cuts: [{ x: 86, y: 114, w: 428, h: 388 }, { x: 86, y: 594, w: 428, h: 388 }],
  render(g, scale) {
    const bg = g.createLinearGradient(0, 0, 0, BH); bg.addColorStop(0, '#F5F1E9'); bg.addColorStop(1, '#E6DED1'); g.fillStyle = bg; g.fillRect(0, 0, BW, BH);
    const gl = g.createRadialGradient(90, 40, 0, 90, 40, 620); gl.addColorStop(0, 'rgba(255,244,222,.75)'); gl.addColorStop(1, 'rgba(255,244,222,0)'); g.fillStyle = gl; g.fillRect(0, 0, BW, BH);
    bGrain(g, scale, .2);
    const fr = booth.frame, P = METALS[fr];
    this.cuts.forEach((k, i) => {
      const F = 28, x = k.x - F, y = k.y - F, w = k.w + 2 * F, h = k.h + 2 * F;
      g.save(); g.shadowColor = 'rgba(40,28,12,.3)'; g.shadowBlur = 24; g.shadowOffsetY = 12; g.fillStyle = bFoil(g, x, y, x + w, y + h, fr); g.fillRect(x, y, w, h); g.restore();
      g.save(); g.globalAlpha = .45; g.fillStyle = bFoil(g, x + w, y, x, y + h, fr); g.fillRect(x + 8, y + 8, w - 16, h - 16); g.restore();
      bevelOn(g, x, y, w, h, 7, HI, LO);
      bevelOn(g, x + 10, y + 10, w - 20, h - 20, 5, LO, HI);
      beadsOn(g, x + 18, y + 18, w - 36, h - 36, 2.3, 7.2, mix(P.light, P.hi, .4), mix(P.base, P.dark, .55));
      bevelOn(g, x + 21, y + 21, w - 42, h - 42, 7, HI, LO);
      g.save(); g.beginPath(); g.rect(k.x, k.y, k.w, k.h); g.clip(); drawCut(g, k, i, scale);
      const s1 = g.createLinearGradient(0, k.y, 0, k.y + 22); s1.addColorStop(0, 'rgba(30,20,8,.3)'); s1.addColorStop(1, 'rgba(30,20,8,0)'); g.fillStyle = s1; g.fillRect(k.x, k.y, k.w, 22);
      const s2 = g.createLinearGradient(k.x, 0, k.x + 16, 0); s2.addColorStop(0, 'rgba(30,20,8,.2)'); s2.addColorStop(1, 'rgba(30,20,8,0)'); g.fillStyle = s2; g.fillRect(k.x, k.y, 16, k.h);
      g.restore();
      [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h - 12], [x + w - 12, y + h - 12]].forEach(([cx, cy]) => { g.fillStyle = mix(P.base, P.dark, .5); g.beginPath(); g.moveTo(cx + .8, cy - 5); g.lineTo(cx + 4.8, cy + 1); g.lineTo(cx + .8, cy + 7); g.lineTo(cx - 3.2, cy + 1); g.fill(); g.fillStyle = mix(P.light, P.hi, .5); g.beginPath(); g.moveTo(cx, cy - 6); g.lineTo(cx + 4, cy); g.lineTo(cx, cy + 6); g.lineTo(cx - 4, cy); g.fill(); });
    });
    // 경첩
    [196, 404].forEach(hx => { g.fillStyle = bFoil(g, hx - 14, 532, hx + 14, 564, fr); g.fillRect(hx - 12, 532, 24, 32); bevelOn(g, hx - 12, 532, 24, 32, 2.5, HI, LO); g.fillStyle = mix(P.base, P.dark, .6); g.fillRect(hx - 12, 547.4, 24, 1.2); });
    const user = guestName(); g.textBaseline = 'alphabetic';
    g.fillStyle = INK; g.font = `400 17px ${F_LB}`; bSpaced(g, 'IDEL  ·  TWO SITTINGS', 300, 54, 6.2);
    g.fillStyle = MUTE; g.font = `400 12.5px ${F_LB}`; bSpaced(g, `NORTH TOWER  ·  ${today()}`, 300, 1056, 3.4);
    const pw = 296, ph = 46, px = 152, py = 1076;
    g.save(); g.shadowColor = 'rgba(40,28,12,.3)'; g.shadowBlur = 8; g.shadowOffsetY = 3; g.fillStyle = bFoil(g, px, py, px + pw, py + ph, fr); g.fillRect(px, py, pw, ph); g.restore();
    bevelOn(g, px, py, pw, ph, 3.5, HI, LO);
    g.fillStyle = mix(P.dark, '#000000', .3); g.textAlign = 'center'; bFit(g, `${user}  ·  이델`, 700, 20, F_KO, pw - 40); g.fillText(`${user}  ·  이델`, 300, py + 30);
  }
};
BOOTH_STYLES.croquis = {
  file: 'idel-croquis', cuts: [{ x: 50, y: 104, w: 500, h: 404 }, { x: 50, y: 590, w: 500, h: 404 }],
  render(g, scale) {
    g.fillStyle = '#F8F4EB'; g.fillRect(0, 0, BW, BH); bGrain(g, scale, .34);
    g.save(); g.globalCompositeOperation = 'destination-out'; for (let x = 30; x < BW - 20; x += 27) { g.beginPath(); g.arc(x, 26, 5, 0, TAU); g.fill(); } g.restore();
    this.cuts.forEach((k, i) => {
      g.save(); g.beginPath(); g.rect(k.x, k.y, k.w, k.h); g.clip(); drawCut(g, k, i, scale);
      g.globalCompositeOperation = 'multiply'; g.fillStyle = 'rgba(238,224,198,.24)'; g.fillRect(k.x, k.y, k.w, k.h); g.restore();
      handRect(g, k.x - 7, k.y - 7, k.w + 14, k.h + 14, i + 3);
    });
    const user = guestName(); g.textBaseline = 'alphabetic';
    g.fillStyle = MUTE; g.font = `400 14px ${F_LB}`; g.textAlign = 'left'; bSpacedL(g, 'CROQUIS  ·  No.313', 52, 72, 4.2);
    g.textAlign = 'right'; g.font = `400 14px ${F_LB}`; g.fillText(IMP(), 548, 72);
    g.fillStyle = INK; g.font = `400 31px ${F_HAND}`; g.textAlign = 'left';
    g.fillText('01 — 움직이지 마.', 54, 552); g.fillText('02 — …됐어. 오늘은 여기까지.', 54, 1040);
    g.fillStyle = INK2; bFit(g, user, 400, 30, F_HAND, 300); g.fillText(user, 54, 1112);
    g.fillStyle = INK; g.font = `66px ${F_SIG}`; g.textAlign = 'right'; g.fillText('Idel', 538, 1122);
    g.fillStyle = GOLD; [0, 9].forEach(dx => { g.beginPath(); g.arc(544 + dx, 1080, 2.6, 0, TAU); g.fill(); });
  }
};
function bSpacedL(g, text, x, y, gap) { let cx = x; g.textAlign = 'left'; for (const c of text) { g.fillText(c, cx, y); cx += g.measureText(c).width + gap; } }

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
  const fr = $('booth-frame-row'); if (fr) fr.style.display = (s === 'classic' || s === 'diptych') ? '' : 'none';
  drawBooth();
}
$('booth-style-group').addEventListener('click', e => { const b = e.target.closest('[data-bstyle]'); if (b) setStyle(b.dataset.bstyle); });

const HER = ['03','01','02','04','07','08','10','12','13','14'];
function pickHer(n) {
  herSel = n; avatarUpload = false;
  const img = new Image(); img.onload = () => { avatar = img; avatarId++; drawCoin(); }; img.src = `assets/p/${n}.jpg?v=2`;
  document.querySelectorAll('[data-her]').forEach(b => b.classList.toggle('active', b.dataset.her === n)); $('btn-upload').classList.remove('active');
}
$('pc-thumbs').addEventListener('click', e => { const b = e.target.closest('[data-her]'); if (b) pickHer(b.dataset.her); });

/* ===== 기념주화 3종: A 프루프(거울 바탕 + 무광 양각) · B 판화(선으로 새긴 초상 + 기요셰 테) · C 깊은 음각(인장) =====
   그녀 사진을 고르면 그 장면의 흉상 누끼(assets/coin/bNN.webp)로 새기고, 내 사진을 올리면 사진 전체를 새긴다.
   무거운 계산(바탕·초상)은 모양·마감·사진·크기가 같으면 다시 하지 않는다. */
let herSel = '03', avatarUpload = false;
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
    coinArc('IDEL · COURT PAINTER', 117.3, false, '400 11.3px "Marcellus",serif', frost, sh, 1.7, .45);
    ctx.fillStyle = lutCss(L, 235); ctx.fillRect(150 - 78.7, y0 - .5, 157.4, 1); ctx.fillStyle = lutCss(L, 40); ctx.fillRect(150 - 78.7, y0 + .5, 157.4, .35);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = frost;
    ctx.font = '400 10px "Marcellus",serif'; ctx.fillText('No.313  ·  MCXXVII', 150, y0 + 14.7);
    fitFont('FOR ' + name, 800, 10, '"Noto Serif KR",serif', 120); ctx.fillText('FOR ' + name, 150, y0 + 30.4);
  } else if (style === 'b') {
    const ink = lutCss(L, 35);
    coinArc('NORTH TOWER  ·  No.313  ·  HOLD STILL', 130.7, false, '400 9.3px "Marcellus",serif', ink, null, 1.35, 0);
    coinArc(name + ' · MCXXVII', 130.7, true, '400 9.3px "Noto Serif KR",serif', ink, null, 2, 0);
  } else {
    const ink = lutCss(L, 40), hi = lutCss(L, 250);
    coinArc('IDEL · NORTH TOWER', 120, false, '400 11.3px "Marcellus",serif', ink, hi, 1.7, .45);
    coinArc('No.313 · ' + name + ' · 1127', 120, true, '400 9.3px "Noto Serif KR",serif', ink, hi, 1.7, .45);
  }
}

markActive('bframe', booth.frame); markActive('bside', booth.side); markActive('bbg', booth.bg); setStyle(booth.style); pickHer('03');
drawBooth();
document.fonts && document.fonts.ready.then(drawBooth);
window.IDEL_KEEPSAKE.redraw = () => { drawCoin(); drawBooth(); };

} }; })();
