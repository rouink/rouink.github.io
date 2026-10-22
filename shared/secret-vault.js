/*! © 2026 페르르. All rights reserved. 무단 복제·배포·재사용 금지 */
(()=>{let u=window.ARCHIVE||{},x=(u.page||{}).secretVault;if(x&&x.code){let d=String(x.code).replace(/\D/g,""),c=d.length||4,t=u.page&&u.page.playerColor||"#A8102A",p=matchMedia("(prefers-reduced-motion: reduce)").matches,g=e=>String(null==e?"":e).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),s="pa_vault_"+location.pathname,m={get(){try{return localStorage.getItem(s)}catch{return null}},set(e){try{localStorage.setItem(s,e)}catch{}}},h=(x.photos||[]).filter(e=>e&&e.img),f=x.laugh||{};f.img&&((new Image).src=f.img);var b=document.getElementById("gallery");if(b){b=b.closest("section");if(b){var y=document.createElement("style"),y=(y.textContent=`
.sv{--sv:${t};padding:72px 24px 8px;max-width:520px;margin:0 auto}
.sv .sv-head{text-align:center}
.sv .sv-title{font-family:var(--f-display,serif);font-weight:400;font-size:34px;line-height:1.1;margin:10px 0 0;color:var(--ink)}
.sv .sv-sub{margin:8px 0 0;font-size:13.5px;line-height:1.7;color:var(--muted);word-break:keep-all}
.sv .sv-orn{width:120px;height:1px;background:var(--line);margin:20px auto 28px}
.sv .sv-doc{position:relative;max-width:340px;margin:0 auto;padding:28px 26px 22px;background:#FBFAF7;border:1px solid var(--line);box-shadow:0 14px 30px rgb(var(--shade,20 21 24) / .08);cursor:text;transition:opacity .6s ease,transform .6s ease}
.sv .sv-doc::before{content:'';position:absolute;inset:6px;border:1px solid color-mix(in srgb,var(--sv) 28%,transparent);pointer-events:none}
.sv .sv-art{margin:0;font:600 11px var(--f-title,serif);letter-spacing:.3em;color:var(--sv)}
.sv .sv-clause{margin:8px 0 0;font-size:13.5px;line-height:1.85;color:var(--ink);word-break:keep-all}
.sv .sv-digits{position:relative;display:flex;gap:12px;justify-content:center;margin:22px 0 4px}
.sv .sv-digits span{width:46px;height:58px;border-bottom:1.5px solid var(--ink);display:grid;place-items:center;font:italic 500 34px var(--f-title,"Cormorant Garamond"),serif;font-variant-numeric:lining-nums;color:var(--sv);transition:border-color .3s}
.sv .sv-digits span.cur{border-bottom-color:var(--sv)}
.sv .sv-digits.bad span{border-bottom-color:var(--sv)}
.sv .sv-digits input{position:absolute;inset:0;width:100%;height:100%;opacity:0;font-size:16px;border:0;background:none;color:transparent;caret-color:transparent;cursor:text}
.sv .sv-sign{margin:14px 0 0;text-align:right;font:italic 500 13px var(--f-title,serif);color:var(--muted)}
.sv .sv-again{margin:10px 0 0;min-height:1.6em;text-align:center;font-size:12.5px;color:var(--sv)}
.sv .sv-seal{position:absolute;right:-18px;bottom:-30px;width:80px;height:80px;opacity:0;transform:scale(1.25) rotate(-14deg);pointer-events:none;transition:opacity .45s ease,transform .5s cubic-bezier(.2,.8,.2,1)}
.sv .sv-seal.on{opacity:.92;transform:scale(1) rotate(-14deg)}
.sv .sv-hint{max-width:340px;margin:18px auto 0;padding:14px 16px;background:#FBFBFA;border:1px solid var(--line);border-left:2px solid var(--sv);box-shadow:0 10px 30px rgb(var(--shade,20 21 24) / .10);opacity:0;transform:translateY(6px);transition:opacity .6s ease,transform .6s ease}
.sv .sv-hint.on{opacity:1;transform:none}
.sv .sv-hint[hidden]{display:none}
.sv .sv-hint p{margin:0;font-size:13.5px;line-height:1.65;color:var(--ink);word-break:keep-all}
.sv .sv-hint em{font:600 18px var(--f-title,serif);font-style:normal;font-variant-numeric:lining-nums;letter-spacing:.12em;color:var(--sv)}
.sv .sv-hint small{display:block;margin-top:4px;font:italic 500 13px var(--f-title,serif);color:var(--muted)}
.sv .sv-laugh{display:flex;gap:14px;align-items:center;max-width:340px;margin:12px auto 0;padding:10px;background:#FBFBFA;border:1px solid var(--line);border-left:2px solid var(--sv);box-shadow:0 10px 30px rgb(var(--shade,20 21 24) / .10);opacity:0;transform:translateY(6px);transition:opacity .7s ease,transform .7s ease}
.sv .sv-laugh.on{opacity:1;transform:none}
.sv .sv-laugh[hidden]{display:none}
.sv .sv-laugh img{flex:none;width:96px;aspect-ratio:4/3;object-fit:cover;object-position:50% 25%;display:block}
.sv .sv-laugh p{margin:0;font-size:13.5px;line-height:1.65;color:var(--ink);word-break:keep-all}
.sv .sv-laugh small{display:block;margin-top:4px;font:italic 500 13px var(--f-title,serif);color:var(--muted)}
.sv .sv-frame img{transition:opacity .45s ease}
.sv .sv-frame img.fade{opacity:0}
.sv .sv-frame{touch-action:pan-y}
.sv .sv-line{transition:opacity .45s ease}
.sv .sv-line.fade{opacity:0}
.sv .sv-dots{display:flex;justify-content:center;gap:8px;margin-top:14px}
.sv .sv-dots i{width:6px;height:6px;border:1px solid var(--muted);transform:rotate(45deg);transition:background .3s,border-color .3s}
.sv .sv-dots i.seen{border-color:var(--sv)}
.sv .sv-dots i.cur{background:var(--sv);border-color:var(--sv)}
.sv .sv-fin{margin:18px 0 0;text-align:center;font:italic 500 14px var(--f-title,serif);color:var(--sv);opacity:0;transition:opacity 1s ease;word-break:keep-all}
.sv .sv-fin.on{opacity:1}
.sv .sv-fin[hidden]{display:none}
.sv .sv-open{max-width:420px;margin:0 auto;opacity:0;transform:translateY(8px);transition:opacity .9s ease,transform .9s ease}
.sv .sv-open.on{opacity:1;transform:none}
.sv .sv-open[hidden]{display:none}
.sv .sv-frame{position:relative;border:1px solid var(--line);padding:8px;background:#FBFAF7}
.sv .sv-frame img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}
.sv .sv-frame .sv-tag{position:absolute;left:18px;top:16px;font:600 10px var(--f-title,serif);letter-spacing:.3em;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.45)}
.sv .sv-line{margin:18px 4px 0;font-size:15px;line-height:1.8;color:var(--ink);text-align:center;word-break:keep-all}
.sv .sv-line::before{content:'“'}.sv .sv-line::after{content:'”'}
.sv .sv-by{margin:6px 0 0;text-align:center;font:italic 500 13px var(--f-title,serif);color:var(--muted)}
.sv .sv-nav{display:flex;justify-content:center;gap:18px;margin-top:14px}
.sv .sv-nav button,.sv .sv-relock{border:0;background:none;padding:8px 6px;font-size:12.5px;color:var(--muted);cursor:pointer}
.sv .sv-relock{display:block;margin:16px auto 0;text-decoration:underline;text-underline-offset:3px}
@media (prefers-reduced-motion:reduce){.sv *{transition-duration:.01s!important}}
`,document.head.appendChild(y),`<svg class="sv-seal" id="sv-seal" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="sv-arc" d="M50 50 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0"/></defs>
  <circle cx="50" cy="50" r="46" fill="${t}" opacity=".9"/><circle cx="50" cy="50" r="41" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>
  <text font-size="8.5" letter-spacing="3.2" fill="#fff" fill-opacity=".8" font-family="serif"><textPath href="#sv-arc">AURORA · CONTRACT · SEALED ·</textPath></text>
  <text x="50" y="57" text-anchor="middle" font-size="22" font-style="italic" fill="#fff" font-family="serif">S.Y.</text></svg>`),k=document.createElement("section");k.dataset.page=b.dataset.page||"2",k.className="sv",k.id="secret-vault",k.innerHTML=`
  <div class="sv-head"><p class="label">Secret · The Vault</p><h2 class="sv-title">${g(x.title||"비밀 금고")}</h2>${x.sub?`<p class="sv-sub">${g(x.sub)}</p>`:""}<div class="sv-orn"></div></div>
  <div id="sv-lock">
    <div class="sv-doc" id="sv-doc">
      ${x.article?`<p class="sv-art">${g(x.article)}</p>`:""}
      ${x.clause?`<p class="sv-clause">${g(x.clause)}</p>`:""}
      <label class="sv-digits" id="sv-digits">${"<span></span>".repeat(c)}<input id="sv-in" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="${c}" autocomplete="off" aria-label="계약 번호 ${c}자리"></label>
      ${x.sign?`<p class="sv-sign">${g(x.sign)}</p>`:""}
      ${y}
    </div>
    <p class="sv-again" id="sv-again" aria-live="polite"></p>
    <div class="sv-hint" id="sv-hint" hidden role="status"></div>
    <div class="sv-laugh" id="sv-laugh" hidden role="status"></div>
  </div>
  <div class="sv-open" id="sv-open" hidden></div>`,b.after(k);let o=e=>document.getElementById(e),a=o("sv-in"),e=[...o("sv-digits").children].filter(e=>"SPAN"===e.tagName),i=0,n=!1,s=0,r=0,l=()=>{let s=a.value;e.forEach((e,t)=>{e.textContent=s[t]||"",e.classList.toggle("cur",document.activeElement===a&&t===Math.min(s.length,c-1))})},v=(a.addEventListener("input",()=>{n||(a.value=a.value.replace(/\D/g,"").slice(0,c),o("sv-digits").classList.remove("bad"),l(),a.value.length===c&&(n=!0,a.value===d?(a.blur(),o("sv-again").textContent="",o("sv-hint").hidden=!0,o("sv-laugh").hidden=!0,o("sv-seal").classList.add("on"),setTimeout(()=>{m.set("1"),$(!0)},p?200:1300)):(i++,o("sv-digits").classList.add("bad"),setTimeout(()=>{if(a.value="",l(),n=!1,1===i&&x.hint){let e=o("sv-hint"),t=g(x.hint).replace(new RegExp(d),`<em>${d}</em>`);e.innerHTML=`<p>${t}</p>`+(x.hintBy?`<small>— ${g(x.hintBy)}</small>`:""),e.hidden=!1,requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("on"))),o("sv-again").textContent=""}else if(f.img&&i===(f.at||4)){let e=o("sv-laugh");e.innerHTML=`<img src="${g(f.img)}" alt=""><div><p>${g(f.line||"")}</p>${f.by?`<small>— ${g(f.by)}</small>`:""}</div>`,e.hidden=!1,requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("on"))),o("sv-again").textContent=""}else{var e=x.wrong||[],t=e.length,s=r++;o("sv-again").textContent=t?s<t?e[s]:e[t<2?0:t-2+(s-t)%2]:x.again||"틀렸어. 다시."}},p?150:650))))}),a.addEventListener("focus",l),a.addEventListener("blur",l),new Set);function w(i,t){let n=h[i];if(n){let s=o("sv-img"),a=o("sv-line"),e=()=>{s.src=n.img,s.alt="시크릿 사진 "+(i+1),o("sv-tag").textContent="SECRET "+String(i+1).padStart(2,"0")+(1<h.length?" / "+String(h.length).padStart(2,"0"):""),a.textContent=n.line||"",a.style.display=n.line?"":"none",o("sv-count")&&(o("sv-count").textContent=i+1+" / "+h.length),v.add(i),o("sv-dots")&&[...o("sv-dots").children].forEach((e,t)=>{e.classList.toggle("cur",t===i),e.classList.toggle("seen",v.has(t))});let e=o("sv-fin");e&&v.size===h.length&&e.hidden&&(e.hidden=!1,requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("on"))));var t=h[(i+1)%h.length];t&&((new Image).src=t.img),s.classList.remove("fade"),a.classList.remove("fade")};t&&!p&&s.getAttribute("src")?(s.classList.add("fade"),a.classList.add("fade"),setTimeout(e,420)):e()}}function L(e){h.length<2||w(s=(s+e+h.length)%h.length,!0)}function $(e){s=0;var i=o("sv-open");if(h.length){let e=(Object.values(u.characters||{})[0]||{}).nameEn||"",t=(i.innerHTML=`
    <div class="sv-frame" id="sv-frame"><img id="sv-img" alt=""><span class="sv-tag" id="sv-tag"></span></div>
    <p class="sv-line" id="sv-line"></p><p class="sv-by">— ${g(e)}</p>
    ${1<h.length?`<div class="sv-dots" id="sv-dots" aria-hidden="true">${"<i></i>".repeat(h.length)}</div>
    <div class="sv-nav"><button type="button" data-d="-1">← 이전</button><span class="label" style="align-self:center" id="sv-count"></span><button type="button" data-d="1">다음 →</button></div>`:""}
    ${x.finale&&1<h.length?`<p class="sv-fin" id="sv-fin" hidden>${g(x.finale)}</p>`:""}
    <button type="button" class="sv-relock" id="sv-relock">금고 다시 잠그기</button>`,o("sv-frame")),s=null,a=0;t.addEventListener("touchstart",e=>{s=e.touches[0].clientX,a=e.touches[0].clientY},{passive:!0}),t.addEventListener("touchend",e=>{var t;null!=s&&(t=e.changedTouches[0].clientX-s,e=e.changedTouches[0].clientY-a,s=null,40<Math.abs(t))&&Math.abs(t)>1.3*Math.abs(e)&&L(t<0?1:-1)},{passive:!0})}else i.innerHTML=`<p class="sv-line">${g(x.empty||"아직 비어 있어.")}</p><button type="button" class="sv-relock" id="sv-relock">금고 다시 잠그기</button>`;w(0,!1),o("sv-lock").hidden=!0;let t=o("sv-open");t.hidden=!1,e&&!p?requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add("on"))):t.classList.add("on")}document.addEventListener("keydown",e=>{var t,s=o("sv-open");s.hidden||/INPUT|TEXTAREA|SELECT/.test((document.activeElement||{}).tagName||"")||"ArrowLeft"!==e.key&&"ArrowRight"!==e.key||(t=s.getBoundingClientRect()).bottom<0||t.top>innerHeight||!s.offsetParent||L("ArrowRight"===e.key?1:-1)}),o("sv-open").addEventListener("click",e=>{var t=e.target.closest("[data-d]");t?L(+t.dataset.d):e.target.closest("#sv-relock")&&(m.set(""),o("sv-open").hidden=!0,o("sv-open").classList.remove("on"),o("sv-lock").hidden=!1,o("sv-seal").classList.remove("on"),a.value="",i=0,r=0,n=!1,o("sv-hint").hidden=!0,o("sv-hint").classList.remove("on"),o("sv-laugh").hidden=!0,o("sv-laugh").classList.remove("on"),o("sv-again").textContent="",o("sv-digits").classList.remove("bad"),l())}),"1"===m.get()&&$(!1),l()}}}})();
