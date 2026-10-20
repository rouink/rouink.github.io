
// ================= 묶음 4 · 미스터리·스릴러 =================

// 29. 수사 보드 — 코르크 보드의 핀을 번호 순서대로 빨간 실로 이으면 사건 파일이 열림 (번호·점선 안내로 쉽게)
reg('board', { look: 'clear', cardPos: 'top', input: false, hint: '① 핀에서 ② 핀으로 손가락을 끌어 빨간 실을 이어 주세요', mount(K) {
  K.css('ix-board', `.intro-board { background:#A9784A; color:#2B1D12; }
    .intro-board .ix-card { background:rgba(250,244,230,.92); padding:12px 16px 10px; box-shadow:0 6px 16px rgba(60,35,15,.25); width:auto; max-width:min(92vw,380px); transform:translateX(-50%) rotate(-1deg); }
    .intro-board .ix-title { font-size:26px; } .intro-board .ix-hint { font-size:14px; }
    .ix-bd-item { position:absolute; z-index:2; box-shadow:0 6px 12px rgba(50,30,10,.3); pointer-events:none; }
    .ix-bd-pin { position:absolute; z-index:5; width:46px; height:46px; margin:-23px 0 0 -23px; border-radius:50%; display:grid; place-items:center; touch-action:none; cursor:pointer; }
    .ix-bd-pin i { width:16px; height:16px; border-radius:50%; background:radial-gradient(circle at 35% 30%,#ff8a8a,#c0181f 60%,#7a0b10); box-shadow:0 3px 5px rgba(0,0,0,.4); }
    .ix-bd-pin b { position:absolute; top:-6px; right:-2px; width:20px; height:20px; border-radius:50%; background:#fff8e6; color:#9a1b22; font:700 12px Pretendard,sans-serif; display:grid; place-items:center; box-shadow:0 1px 3px rgba(0,0,0,.3); }
    .ix-bd-pin.next::after { content:''; position:absolute; inset:2px; border-radius:50%; border:3px solid #fff3c4; animation:ixpulse 1.1s ease-out infinite; }
    @keyframes ixpulse { from { transform:scale(.6); opacity:1; } to { transform:scale(1.5); opacity:0; } }
    .ix-bd-stamp { position:absolute; left:50%; top:52%; z-index:9; padding:8px 18px; border:4px solid #b3151d; color:#b3151d; font:700 30px "Courier Prime","Courier New",monospace; letter-spacing:.12em; transform:translate(-50%,-50%) rotate(-12deg) scale(2.5); opacity:0; background:rgba(255,250,240,.5); }`);
  const cork = K.layer(0), cg = cork.g;
  const drawCork = () => { cg.fillStyle = '#B07D4E'; cg.fillRect(0, 0, K.W, K.H); for (let i = 0; i < K.W * K.H / 25; i++) { const v = Math.random(); cg.fillStyle = v < .5 ? `rgba(90,55,25,${K.rand(.15, .4)})` : `rgba(230,190,140,${K.rand(.15, .35)})`; cg.fillRect(K.rand(0, K.W), K.rand(0, K.H), K.rand(1, 2.5), K.rand(1, 2.5)); }
    const vg = cg.createRadialGradient(K.W / 2, K.H / 2, K.H * .2, K.W / 2, K.H / 2, K.H * .8); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(60,30,10,.35)'); cg.fillStyle = vg; cg.fillRect(0, 0, K.W, K.H); };
  drawCork(); K.onResize(drawCork);
  const P4 = [[.26, .36], [.74, .44], [.28, .66], [.72, .8]];
  const items = [
    `<div style="width:118px;padding:8px 8px 26px;background:#fbfaf5;transform:rotate(-5deg)"><div style="height:92px;background:linear-gradient(160deg,#7a8aa0,#3e4a5c);position:relative;overflow:hidden"><div style="position:absolute;left:50%;bottom:0;width:46px;height:62px;margin-left:-23px;background:#1f2633;border-radius:23px 23px 6px 6px"></div><div style="position:absolute;left:50%;bottom:52px;width:26px;height:26px;margin-left:-13px;border-radius:50%;background:#1f2633"></div></div><div style="font:12px 'Song Myung',serif;color:#333;text-align:center;margin-top:6px">${K.escI(K.caller)}?</div></div>`,
    `<div style="width:120px;min-height:100px;padding:10px;background:#F7E58A;transform:rotate(4deg);font:14px/1.5 'Song Myung',serif;color:#3a3220">그날 밤,<br>누가 마지막으로<br>기록실에 있었지?</div>`,
    `<div style="width:130px;padding:8px;background:#EDE6D3;transform:rotate(3deg);font:10px/1.4 'Gowun Batang',serif;color:#2b2b2b"><b style="font:700 12px Cinzel,serif;display:block;border-bottom:1px solid #555;margin-bottom:4px">DAILY ARCHIVE</b>미확인 기록 발견… 관계자는 "아직 끝나지 않았다"고 밝혔다.</div>`,
    `<div style="width:118px;height:96px;background:linear-gradient(135deg,#d9cba8,#cbb98f);transform:rotate(-4deg);position:relative"><svg viewBox="0 0 118 96" width="118" height="96"><path d="M8 70 Q30 40 52 52 T110 30" stroke="#7a5a35" fill="none" stroke-dasharray="3 3"/><circle cx="84" cy="40" r="7" fill="none" stroke="#b3151d" stroke-width="2"/><text x="72" y="64" font-size="9" fill="#5a4026" font-family="Courier Prime","Courier New">X — 19:46</text></svg></div>`];
  const pins = P4.map(([px, py], i) => { const it = K.el(`<div class="ix-bd-item">${items[i]}</div>`); const pin = K.el(`<div class="ix-bd-pin ${i === 0 ? 'next' : ''}" data-i="${i}"><i></i><b>${i + 1}</b></div>`);
    const place = () => { const x = px * K.W, y = py * K.H; pin.style.left = x + 'px'; pin.style.top = y + 'px'; it.style.left = (x - 62) + 'px'; it.style.top = (y - 8) + 'px'; }; place(); K.onResize(place); return pin; });
  const at = i => { const r = pins[i].getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  let linked = 0, dragging = null, done = false;
  const L = K.layer(6);
  const draw = () => { const g = L.g; g.clearRect(0, 0, K.W, K.H); g.lineCap = 'round';
    const rope = (a, b, slack = 18) => { g.strokeStyle = '#B3151D'; g.lineWidth = 2.6; g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = 3; g.shadowOffsetY = 2; g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + slack, b[0], b[1]); g.stroke(); g.shadowBlur = 0; g.shadowOffsetY = 0; };
    for (let i = 0; i < linked; i++) rope(at(i), at(i + 1));
    if (!done && linked < 3) { const a = at(linked), b = at(linked + 1); g.setLineDash([6, 7]); g.strokeStyle = 'rgba(255,245,210,.85)'; g.lineWidth = 2; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); g.setLineDash([]); }
    if (dragging) rope(at(linked), dragging, 4); };
  K.loop(() => { draw(); });
  const hints = ['① 핀에서 ② 핀으로 손가락을 끌어 빨간 실을 이어 주세요', '좋아요! 이번엔 ② → ③', '마지막! ③ → ④'];
  const connect = () => { linked++; K.SFX.click(); pins.forEach((p, i) => p.classList.toggle('next', i === linked && linked < 3)); pins[linked].classList.add('next');
    if (linked >= 3) { done = true; pins.forEach(p => p.classList.remove('next')); K.hint('사건 파일이 열립니다');
      K.go(async () => { const st = K.el(`<div class="ix-bd-stamp">CASE OPEN</div>`, K.gw); st.animate([{ transform: 'translate(-50%,-50%) rotate(-12deg) scale(2.5)', opacity: 0 }, { transform: 'translate(-50%,-50%) rotate(-12deg) scale(1)', opacity: 1 }], { duration: 260, fill: 'forwards', easing: 'cubic-bezier(.5,0,.8,.3)' }); await K.wait(240); K.SFX.thump(); K.shake(4); await K.wait(1000); await K.split(); }); }
    else K.hint(hints[linked]); };
  pins.forEach((p, i) => K.drag(p, { start: () => { if (i !== linked || done) return; dragging = at(i); }, move: (x, y) => { if (dragging) dragging = [x, y]; },
    end: (x, y) => { if (!dragging) return; dragging = null; const [tx, ty] = at(linked + 1); if (Math.hypot(x - tx, y - ty) < 60) connect(); else K.hint('번호가 깜빡이는 다음 핀까지 끌어 주세요'); } }));
  pins.forEach((p, i) => p.addEventListener('click', () => { if (!done && i === linked + 1) connect(); }));   // 다음 핀을 눌러도 이어짐
} });

// 31. 지워진 기록 — 검게 덧칠된 문서를 문지르면 가려진 글자가 드러남
reg('redacted', { look: 'paper', card: false, mount(K) {
  K.css('ix-red', `.ix-doc { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%) rotate(-.6deg); width:min(88vw,400px); padding:22px 22px 26px; background:#FBF7EE; box-shadow:0 12px 30px rgba(60,45,25,.22); font:15px/2 "Courier Prime","Courier New","Nanum Gothic Coding",monospace; color:#24211c; z-index:2; user-select:none; -webkit-user-select:none; }
    .ix-doc h3 { margin:0 0 4px; font:700 13px "Courier Prime","Courier New",monospace; letter-spacing:.3em; color:#a01d24; text-align:center; } .ix-doc .meta { font-size:12px; line-height:1.7; color:#55504a; border-bottom:1px solid #b9b2a4; padding-bottom:8px; margin-bottom:10px; }
    .ix-doc .rd { position:relative; } .ix-doc .hl { transition:background .6s; } .ix-doc .hl.on { background:rgba(255,226,120,.75); }
    .ix-doc .tip { margin-top:14px; font:14px "Gowun Batang",serif; color:#7a5a30; text-align:center; }
    .ix-doc .st { position:absolute; right:14px; bottom:18px; border:3px solid #2a7a3a; color:#2a7a3a; font:700 16px "Courier Prime","Courier New",monospace; padding:3px 8px; transform:rotate(-10deg) scale(2); opacity:0; }`);
  const nm = K.name() || '열람자', words = [...K.line];
  const cut = [Math.floor(words.length * .15), Math.floor(words.length * .55), words.length];
  const seg = (a, b) => words.slice(a, b).join('');
  const doc = K.el(`<div class="ix-doc"><h3>CLASSIFIED</h3><div class="meta">수신 : 기록보관소 열람자<br>발신 : ${K.escI(K.title)}<br>분류 : 1급 비밀 · 열람 제한</div>
    <div>해당 기록의 핵심 내용은 다음과 같다.</div><div class="hl">“${K.escI(seg(0, cut[0]))}<span class="rd">${K.escI(seg(cut[0], cut[1]))}</span>${K.escI(seg(cut[1], cut[1]))}<span class="rd">${K.escI(seg(cut[1], cut[2]))}</span>”</div>
    <div>담당자 : <span class="rd">${K.escI(K.caller)}</span></div><div class="tip">검은 줄을 손가락으로 문질러 지워 보세요</div><div class="st">DECLASSIFIED</div></div>`);
  const L = K.layer(4); let bars = [];
  const build = () => { bars = [...doc.querySelectorAll('.rd')].flatMap(s => [...s.getClientRects()].map(r => ({ x: r.left - 2, y: r.top + 3, w: r.width + 4, h: r.height - 6 })));
    const g = L.g; g.clearRect(0, 0, K.W, K.H); bars.forEach(b => { g.fillStyle = '#121212'; g.fillRect(b.x, b.y, b.w, b.h); g.fillStyle = 'rgba(255,255,255,.05)'; for (let i = 0; i < b.w; i += 3) g.fillRect(b.x + i, b.y + K.rand(0, b.h), 1.5, K.rand(1, 3)); }); };
  requestAnimationFrame(build); K.onResize(build);
  let done = false, last = 0;
  const rub = (x, y) => { const g = L.g; g.globalCompositeOperation = 'destination-out'; for (let i = 0; i < 9; i++) { g.fillStyle = `rgba(0,0,0,${K.rand(.5, 1)})`; g.beginPath(); g.arc(x + K.rand(-12, 12), y + K.rand(-8, 8), K.rand(3, 9), 0, K.TAU); g.fill(); } g.globalCompositeOperation = 'source-over'; };
  const measure = () => { let tot = 0, clr = 0; bars.forEach(b => { const d = L.g.getImageData(b.x * K.DPR, b.y * K.DPR, Math.max(1, b.w * K.DPR), Math.max(1, b.h * K.DPR)).data; for (let i = 3; i < d.length; i += 16) { tot++; if (d[i] < 100) clr++; } }); return tot ? clr / tot : 0; };
  K.drag(K.gw, { start: rub, move: (x, y) => { rub(x, y); if (done) return; const now = performance.now(); if (now - last > 200) { last = now; if (Math.random() < .5) K.SFX.click(); if (measure() > .5) finish(); } } });
  const finish = () => { done = true; L.c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }); doc.querySelector('.hl').classList.add('on'); doc.querySelector('.tip').textContent = '기록이 복원되었습니다';
    K.go(async () => { await K.wait(700); const st = doc.querySelector('.st'); st.animate([{ transform: 'rotate(-10deg) scale(2)', opacity: 0 }, { transform: 'rotate(-10deg) scale(1)', opacity: 1 }], { duration: 240, fill: 'forwards' }); await K.wait(220); K.SFX.thump(); await K.wait(1200); await K.fade(700); }); };
} });

// 32. CCTV 화면 — 여러 화면 중 사람이 보이는 화면을 누르면 확대되며 입장 (움직임 표시로 쉽게)
reg('cctv', { look: 'dark', cardPos: 'top', input: false, hint: '사람이 보이는 화면(● MOTION)을 눌러 주세요', mount(K) {
  K.css('ix-cctv', `.ix-cg { position:absolute; left:50%; top:58%; transform:translate(-50%,-50%); display:grid; grid-template-columns:1fr 1fr; gap:8px; width:min(94vw,560px); z-index:2; }
    .ix-cg canvas { width:100%; aspect-ratio:4/3; display:block; background:#0b1420; border:2px solid #24344e; cursor:pointer; border-radius:4px; }
    .ix-cg .tgt { box-shadow:0 0 0 2px rgba(255,90,90,.0); animation:ixtgt 1.6s ease-in-out infinite; } @keyframes ixtgt { 50% { box-shadow:0 0 0 3px rgba(255,110,110,.55); } }
    .ix-cg .zoom { position:fixed; z-index:20; transition:all .7s cubic-bezier(.6,0,.2,1); }`);
  const grid = K.el(`<div class="ix-cg"></div>`), target = Math.random() * 4 | 0, tiles = [];
  for (let i = 0; i < 4; i++) { const c = document.createElement('canvas'); c.width = 240; c.height = 180; if (i === target) c.classList.add('tgt'); c.dataset.i = i; grid.appendChild(c); tiles.push({ c, g: c.getContext('2d'), bad: 0 }); }
  const t0 = performance.now(), ts = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${d.toTimeString().slice(0, 8)}`; };
  K.loop((dt, now) => { const tt = (now - t0) / 1000;
    tiles.forEach((T, i) => { const g = T.g, W = 240, H = 180; g.fillStyle = '#1c2a3a'; g.fillRect(0, 0, W, H);
      g.strokeStyle = 'rgba(160,190,220,.35)'; g.lineWidth = 1.2; g.beginPath(); [[0, 0, 70, 50], [W, 0, 170, 50], [0, H, 70, 140], [W, H, 170, 140]].forEach(([a, b, c, d]) => { g.moveTo(a, b); g.lineTo(c, d); }); g.rect(70, 50, 100, 90); g.stroke();
      g.fillStyle = 'rgba(200,220,240,.08)'; g.fillRect(70 + (i * 23) % 60, 60, 30, 70);
      if (i === target) { const px = 90 + Math.sin(tt * .8) * 30; g.fillStyle = 'rgba(225,235,245,.9)'; g.beginPath(); g.arc(px, 82, 9, 0, K.TAU); g.fill(); g.beginPath(); g.roundRect ? g.roundRect(px - 11, 92, 22, 38, 7) : g.rect(px - 11, 92, 22, 38); g.fill(); g.fillRect(px - 9, 128, 7, 14); g.fillRect(px + 2, 128, 7, 14);
        g.fillStyle = Math.sin(tt * 6) > 0 ? '#ff5a5a' : 'rgba(255,90,90,.3)'; g.font = 'bold 12px monospace'; g.fillText('● MOTION', W - 84, H - 10); }
      const n = g.getImageData(0, 0, W, H), d = n.data, amt = T.bad > 0 ? 160 : 26; for (let k = 0; k < d.length; k += 4) { const v = (Math.random() - .5) * amt; d[k] += v; d[k + 1] += v; d[k + 2] += v; } g.putImageData(n, 0, 0);
      g.fillStyle = 'rgba(0,0,0,.18)'; for (let y = (tt * 40 | 0) % 3; y < H; y += 3) g.fillRect(0, y, W, 1);
      g.fillStyle = '#fff'; g.font = 'bold 11px monospace'; g.fillText(`CAM 0${i + 1}`, 8, 16); g.fillText(ts(), 8, H - 10); g.fillStyle = '#ff3b3b'; if (Math.sin(tt * 4) > 0) { g.beginPath(); g.arc(W - 14, 12, 4, 0, K.TAU); g.fill(); }
      if (T.bad > 0) { T.bad -= dt; g.fillStyle = 'rgba(0,0,0,.5)'; g.fillRect(0, H / 2 - 16, W, 32); g.fillStyle = '#fff'; g.font = 'bold 16px monospace'; g.textAlign = 'center'; g.fillText('NO SIGNAL', W / 2, H / 2 + 6); g.textAlign = 'left'; } }); });
  let done = false;
  grid.addEventListener('click', e => { const c = e.target.closest('canvas'); if (!c || done) return; K.prime(); const i = +c.dataset.i;
    if (i !== target) { tiles[i].bad = .8; K.SFX.hiss(.4); K.hint('그 화면엔 아무도 없어요. 빨갛게 깜빡이는 화면을 찾아보세요'); return; }
    done = true; K.SFX.beep(); K.hint('');
    K.go(async () => { const r = c.getBoundingClientRect(); const ph = document.createElement('div'); ph.style.aspectRatio = '4/3'; c.replaceWith(ph); K.gw.appendChild(c); c.classList.add('zoom'); Object.assign(c.style, { left: r.left + 'px', top: r.top + 'px', width: r.width + 'px' }); c.getBoundingClientRect();
      Object.assign(c.style, { left: '0px', top: ((K.H - K.W * .75) / 2) + 'px', width: K.W + 'px' }); tiles[i].bad = .25; await K.wait(800); K.flash('#fff', 260, .8); await K.fade(500); }); });
} });

// 33. 녹음테이프 — 원을 그리듯 돌려 테이프를 감으면 재생되며 짧은 녹음 문장이 나옴
reg('cassette', { look: 'paper', cardPos: 'top', input: false, hint: '카세트 둘레를 원을 그리듯 돌려 테이프를 감아 주세요 · 0%', mount(K) {
  K.css('ix-cas', `.ix-cas { position:absolute; left:50%; top:56%; transform:translate(-50%,-50%); width:min(86vw,360px); z-index:2; filter:drop-shadow(0 12px 18px rgba(40,30,20,.3)); }
    .ix-cas .reel { transform-box:fill-box; transform-origin:center; } .ix-cap2 { position:absolute; left:50%; top:calc(56% + min(30vw,130px)); transform:translateX(-50%); width:min(86vw,360px); text-align:center; font:17px/1.7 "Gowun Batang",serif; color:var(--ink); z-index:3; min-height:3.4em; }
    .ix-cas-arrow { position:absolute; left:50%; top:56%; width:min(96vw,420px); aspect-ratio:1; transform:translate(-50%,-50%); border:2px dashed rgb(var(--accent-400) / .6); border-radius:50%; z-index:1; animation:ixspin 8s linear infinite; pointer-events:none; } @keyframes ixspin { to { transform:translate(-50%,-50%) rotate(360deg); } }`);
  K.el(`<div class="ix-cas-arrow"></div>`);
  const cas = K.el(`<svg class="ix-cas" viewBox="0 0 360 230"><defs><linearGradient id="cb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3d44"/><stop offset="1" stop-color="#25272c"/></linearGradient></defs>
    <rect x="4" y="4" width="352" height="222" rx="14" fill="url(#cb)"/><rect x="22" y="18" width="316" height="120" rx="6" fill="#F3EAD3"/>
    <rect x="22" y="18" width="316" height="22" rx="6" fill="rgb(var(--accent-600))"/><text x="34" y="34" font-family="Cinzel,serif" font-size="12" font-weight="700" fill="#fff" letter-spacing="2">SIDE A</text>
    ${[58, 76, 94].map(y => `<line x1="34" y1="${y}" x2="326" y2="${y}" stroke="#c8bd9f"/>`).join('')}<text x="180" y="70" text-anchor="middle" font-family="Song Myung,serif" font-size="20" fill="#3a3226">${K.escI(K.title)}</text>
    <rect x="96" y="96" width="168" height="54" rx="27" fill="#1b1c20" stroke="#55585f"/><rect x="128" y="104" width="104" height="38" fill="#4a3a2c" opacity=".7"/>
    ${[124, 236].map(x => `<g class="reel" data-x="${x}"><circle cx="${x}" cy="123" r="22" fill="#e9e5dc"/><circle cx="${x}" cy="123" r="8" fill="#1b1c20"/>${[0, 60, 120, 180, 240, 300].map(a => `<rect x="${x - 2}" y="${123 - 8}" width="4" height="6" fill="#e9e5dc" transform="rotate(${a} ${x} 123)"/>`).join('')}</g>`).join('')}
    <path d="M40 226 L70 176 L290 176 L320 226 Z" fill="#2e3036"/>${[110, 150, 210, 250].map(x => `<circle cx="${x}" cy="200" r="6" fill="#16171a"/>`).join('')}</svg>`);
  const cap = K.el(`<div class="ix-cap2"></div>`, K.gw), reels = [...cas.querySelectorAll('.reel')];
  let wound = 0, rot = 0, done = false; const NEED = Math.PI * 4;
  const setRot = a => reels.forEach((r, i) => r.style.transform = `rotate(${a * (i ? 1.15 : 1)}rad)`);
  const center = () => { const r = cas.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
  K.circular(K.gw, () => center()[0], () => center()[1], d => { if (done) return; wound += Math.abs(d); rot += d; setRot(rot); if (Math.random() < .2) K.SFX.click(); const pct = Math.min(100, wound / NEED * 100 | 0); K.hint(`카세트 둘레를 원을 그리듯 돌려 테이프를 감아 주세요 · ${pct}%`); if (wound >= NEED) play(); });
  const play = () => { done = true; K.gw.querySelector('.ix-cas-arrow').remove(); K.hint('▶ PLAY'); K.SFX.clack();
    K.go(async () => { K.SFX.tape(); const t0 = performance.now(); const stop = K.loop(() => { setRot(rot + (performance.now() - t0) / 300); });
      cap.textContent = '▶ '; for (const ch of K.line) { cap.textContent += ch; await K.wait(70); } await K.wait(1300); stop(); K.SFX.clack(); K.hideCard(100); await K.fade(700); }); };
} });

// 34. 암호 해독 — 뒤섞인 글자들이 누를 때마다 하나씩 제자리를 찾아 제목이 완성
reg('cipher', { look: 'dark', cardPos: 'top', title: false, input: false, hint: '화면을 누를 때마다 글자가 하나씩 해독돼요', mount(K) {
  K.css('ix-ci', `.ix-ci { position:absolute; left:50%; top:52%; transform:translate(-50%,-50%); display:flex; flex-wrap:wrap; justify-content:center; gap:6px; width:min(94vw,560px); z-index:2; }
    .ix-ci span { min-width:clamp(30px,10vw,48px); height:clamp(46px,14vw,66px); display:grid; place-items:center; border-radius:6px; background:#162238; border:1px solid #2E4468; font:700 clamp(22px,7vw,34px) "Courier Prime","Courier New","Song Myung",monospace; color:#7FB8FF; text-shadow:0 0 8px rgba(127,184,255,.6); transition:background .3s, color .3s; }
    .ix-ci span.ok { background:#1E3B2E; border-color:#3A8A5A; color:#9CF3C0; text-shadow:0 0 10px rgba(124,240,180,.7); } .ix-ci span.sp { background:none; border:0; min-width:14px; }
    .ix-ci-bar { position:absolute; left:50%; top:calc(52% + 70px); transform:translateX(-50%); width:min(70vw,300px); height:4px; background:#1b2a44; border-radius:2px; overflow:hidden; z-index:2; } .ix-ci-bar i { display:block; height:100%; width:0; background:#7CF0B4; transition:width .3s; }`);
  const target = [...(P.introCipher || (K.title + ' ARCHIVE'))], POOL = 'ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$?';
  const box = K.el(`<div class="ix-ci">${target.map(c => `<span class="${c === ' ' ? 'sp' : ''}">${c === ' ' ? '' : '?'}</span>`).join('')}</div>`), bar = K.el(`<div class="ix-ci-bar"><i></i></div>`).firstChild;
  const cells = [...box.children], todo = cells.map((c, i) => i).filter(i => target[i] !== ' ').sort(() => Math.random() - .5); let solved = 0, done = false;
  K.loop(() => { cells.forEach((c, i) => { if (target[i] !== ' ' && !c.classList.contains('ok') && Math.random() < .35) c.textContent = POOL[Math.random() * POOL.length | 0]; }); });
  K.onTap(() => { if (done) return; const per = Math.max(1, Math.ceil(todo.length / 7));
    for (let k = 0; k < per && solved < todo.length; k++) { const i = todo[solved++], c = cells[i]; c.classList.add('ok'); c.textContent = target[i]; c.animate([{ transform: 'rotateX(90deg)' }, { transform: 'none' }], { duration: 300 }); }
    K.SFX.key(); bar.style.width = (solved / todo.length * 100) + '%';
    if (solved >= todo.length) { done = true; K.SFX.chime([659, 880, 1175, 1568], .09); K.hint('해독 완료'); K.go(async () => { await K.wait(1200); K.flash('#9CF3C0', 400, .5); await K.fade(700); }); } });
} });

// 35. 증거물 봉투 — 봉인 테이프를 옆으로 쭉 뜯으면 봉투가 열리고 서류가 나옴
reg('evidence', { look: 'paper', card: false, mount(K) {
  K.css('ix-ev', `.ix-ev { position:absolute; left:50%; top:52%; transform:translate(-50%,-50%); width:min(86vw,360px); aspect-ratio:3/4; z-index:2; }
    .ix-ev .bag { position:absolute; inset:0; border-radius:6px; background:linear-gradient(120deg,rgba(255,255,255,.75),rgba(235,240,245,.55) 40%,rgba(255,255,255,.8) 60%,rgba(225,232,240,.6)); border:1px solid rgba(150,160,175,.6); box-shadow:0 14px 30px rgba(40,50,70,.18); backdrop-filter:blur(1.5px); }
    .ix-ev .paper { position:absolute; left:12%; right:12%; top:30%; bottom:6%; background:#F7F1E2; box-shadow:0 2px 6px rgba(0,0,0,.12); padding:12px; font:12px/1.7 "Courier Prime","Courier New",monospace; color:#333; transition:transform 1s cubic-bezier(.5,0,.3,1); }
    .ix-ev .form { position:absolute; left:6%; right:6%; top:9%; height:19%; border:2px solid #b3151d; background:rgba(255,255,255,.8); font:10px/1.5 "Courier Prime","Courier New",monospace; color:#b3151d; padding:4px 6px; }
    .ix-ev .form b { display:block; font:700 15px "Courier Prime","Courier New",monospace; letter-spacing:.3em; text-align:center; border-bottom:1px solid #b3151d; margin-bottom:2px; }
    .ix-ev .tape { position:absolute; left:-4%; right:-4%; top:2.5%; height:22px; background:repeating-linear-gradient(90deg,#c8161f 0 120px,#a81118 120px 122px); color:#fff; font:700 11px "Courier Prime","Courier New",monospace; letter-spacing:.2em; white-space:nowrap; overflow:hidden; line-height:22px; touch-action:none; cursor:grab; box-shadow:0 2px 4px rgba(0,0,0,.2); z-index:3; }
    .ix-ev .torn { position:absolute; top:2.5%; height:22px; left:-4%; background:#c8161f; transform-origin:right center; z-index:4; opacity:.95; }
    .ix-ev-tip { position:absolute; left:50%; top:calc(52% - min(58vw,240px) - 34px); transform:translateX(-50%); font:15px "Gowun Batang",serif; color:var(--ink); width:90vw; text-align:center; z-index:3; }`);
  const d = new Date(), nm = K.name() || '열람자';
  const ev = K.el(`<div class="ix-ev"><div class="paper"><b style="font-size:13px">기록 원본</b><br>${K.escI(K.title)}<br>${K.escI(K.line)}<br><br>— 열람 승인 —</div><div class="bag"></div>
    <div class="form"><b>EVIDENCE</b>CASE No. ${String(Math.random() * 9000 + 1000 | 0)} · DATE ${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}<br>ITEM : ${K.escI(K.title)} 기록 원본<br>SEALED BY : ARCHIVE</div>
    <div class="tape">${'EVIDENCE · DO NOT TAMPER · '.repeat(6)}</div></div>`);
  const tip = K.el(`<div class="ix-ev-tip">빨간 봉인 테이프를 왼쪽에서 오른쪽으로 쭉 뜯어 주세요 →</div>`), tape = ev.querySelector('.tape');
  let done = false, k = 0;
  K.drag(tape, { start: () => { if (!done) K.SFX.rip(.4); }, move: (x, y, dx) => { if (done) return; k = K.clamp(dx / (tape.clientWidth * .85), 0, 1); tape.style.clipPath = `polygon(${k * 100}% 0, 100% 0, 100% 100%, ${k * 100}% 100%, ${k * 100 - 1.5}% 70%, ${k * 100 + 1}% 40%, ${k * 100 - 1}% 15%)`;
      if (Math.random() < .25) K.SFX.rip(.15); if (k > .85) open(); }, end: () => { if (!done && k < .85) { tape.style.transition = 'clip-path .3s'; tape.style.clipPath = ''; setTimeout(() => tape.style.transition = '', 300); } } });
  const open = () => { done = true; tape.style.clipPath = 'inset(0 0 0 100%)'; tip.textContent = '봉투가 열렸어요'; K.SFX.rip(.4);
    K.go(async () => { await K.wait(300); const p = ev.querySelector('.paper'); p.style.zIndex = 5; p.style.transform = 'translateY(-75%) rotate(-2deg)'; K.SFX.page(); await K.wait(1300); tip.remove(); await K.slideUp(800); }); };
} });

// 36. 유리 깨기 — 터치할 때마다 금이 가고, 세 번째에 산산조각 나며 떨어짐
reg('glass', { look: 'clear', hint: '화면을 세 번 터치해 보세요 · 0/3', mount(K) {
  K.peek();
  const L = K.layer(1); let tex, cracks = [], hits = 0, shards = null, center = null;
  const make = () => { tex = document.createElement('canvas'); tex.width = K.W * K.DPR; tex.height = K.H * K.DPR; const t = tex.getContext('2d'); t.scale(K.DPR, K.DPR);
    const gr = t.createLinearGradient(0, 0, K.W, K.H); gr.addColorStop(0, K.rgbVar('--stone-100', .98)); gr.addColorStop(1, K.rgbVar('--stone-200', .98)); t.fillStyle = gr; t.fillRect(0, 0, K.W, K.H);
    t.fillStyle = 'rgba(255,255,255,.28)'; t.beginPath(); t.moveTo(K.W * .08, 0); t.lineTo(K.W * .32, 0); t.lineTo(K.W * .02, K.H); t.lineTo(-K.W * .15, K.H); t.fill(); t.fillStyle = 'rgba(255,255,255,.12)'; t.beginPath(); t.moveTo(K.W * .48, 0); t.lineTo(K.W * .55, 0); t.lineTo(K.W * .28, K.H); t.lineTo(K.W * .2, K.H); t.fill(); };
  make(); K.onResize(make);
  const drawCracks = g => { g.strokeStyle = 'rgba(120,140,165,.5)'; g.lineWidth = 1.1; cracks.forEach(c => { g.beginPath(); c.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); }); g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = .6; cracks.forEach(c => { g.beginPath(); c.forEach(([x, y], i) => i ? g.lineTo(x - .6, y - .6) : g.moveTo(x - .6, y - .6)); g.stroke(); }); };
  const crack = (x, y, n, len) => { for (let i = 0; i < n; i++) { let a = K.rand(0, K.TAU), px = x, py = y; const pts = [[x, y]]; let l = 0; const L2 = len * K.rand(.6, 1.1); while (l < L2) { const st = K.rand(9, 20); a += K.rand(-.28, .28); px += Math.cos(a) * st; py += Math.sin(a) * st; l += st; pts.push([px, py]); } cracks.push(pts); }
    for (let r = 16; r < len * .65; r += K.rand(20, 36)) { const pts = []; for (let a = 0; a <= K.TAU + .01; a += K.rand(.3, .65)) pts.push([x + Math.cos(a) * r * K.rand(.82, 1.18), y + Math.sin(a) * r * K.rand(.82, 1.18)]); cracks.push(pts); } };
  const paint = () => { const g = L.g; g.clearRect(0, 0, K.W, K.H); if (!shards) { g.drawImage(tex, 0, 0, K.W, K.H); drawCracks(g); return; }
    shards.forEach(s => { g.save(); g.translate(s.cx + s.x, s.cy + s.y); g.rotate(s.r); g.translate(-s.cx, -s.cy); g.beginPath(); s.p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip(); g.drawImage(tex, 0, 0, K.W, K.H); drawCracks(g); g.restore();
      g.save(); g.translate(s.cx + s.x, s.cy + s.y); g.rotate(s.r); g.translate(-s.cx, -s.cy); g.strokeStyle = 'rgba(255,255,255,.7)'; g.lineWidth = .7; g.beginPath(); s.p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke(); g.restore(); }); };
  paint();
  K.onTap((x, y) => { if (hits >= 3) return; hits++; center = center || [x, y]; K.hint(`화면을 세 번 터치해 보세요 · ${hits}/3`);
    if (hits < 3) { crack(x, y, hits === 1 ? 5 : 10, hits === 1 ? 80 : 200); K.SFX.glass(hits === 1 ? 0 : 1); K.shake(hits * 1.5, 140); paint(); return; }
    K.SFX.glass(2); K.shake(8, 280); K.hideCard(150);
    const N = 14, rings = [0, 45, 110, 200, 340, 540, 860, 1320], pt = {}; const ang = Array.from({ length: N }, (_, i) => i / N * K.TAU + K.rand(-.1, .1));
    const P = (i, j) => { const k = i % N + ',' + j; if (!pt[k]) { const r = rings[j] * (j ? K.rand(.88, 1.12) : 0); pt[k] = [x + Math.cos(ang[i % N]) * r, y + Math.sin(ang[i % N]) * r]; } return pt[k]; };
    shards = []; for (let i = 0; i < N; i++) for (let j = 0; j < rings.length - 1; j++) { const p = [P(i, j), P(i + 1, j), P(i + 1, j + 1), P(i, j + 1)], cx = (p[0][0] + p[1][0] + p[2][0] + p[3][0]) / 4, cy = (p[0][1] + p[1][1] + p[2][1] + p[3][1]) / 4;
      if (cx < -300 || cy < -300 || cx > K.W + 300 || cy > K.H + 300) continue; const dx = cx - x, dy = cy - y, d = Math.hypot(dx, dy) + 1; shards.push({ p, cx, cy, x: 0, y: 0, r: 0, vx: dx / d * K.rand(35, 145), vy: dy / d * K.rand(15, 110) - 55, vr: K.rand(-2.5, 2.5), delay: d / 1300 }); }
    K.go(() => new Promise(res => { let t = 0; K.loop(dt => { t += dt; let alive = 0; shards.forEach(s => { if (t < s.delay) { alive++; return; } s.vy += 1400 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.r += s.vr * dt; if (s.cy + s.y < K.H + 400) alive++; }); paint(); if (!alive) { res(); return false; } }); }));
  });
} });
