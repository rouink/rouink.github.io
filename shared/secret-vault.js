/*! © 2026 페르르. All rights reserved. 무단 복제·배포·재사용 금지 */
(()=>{let m=window.ARCHIVE||{},x=(m.page||{}).secretVault;if(x&&x.code){let l=String(x.code).replace(/\D/g,""),v=l.length||4,e=m.page&&m.page.playerColor||"#A8102A",p=matchMedia("(prefers-reduced-motion: reduce)").matches,d=t=>String(null==t?"":t).replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),s="pa_vault_"+location.pathname,c={get(){try{return localStorage.getItem(s)}catch{return null}},set(t){try{localStorage.setItem(s,t)}catch{}}},g=(x.photos||[]).filter(t=>t&&t.img),t=document.getElementById("gallery");if(t){var f=t.closest("section");if(f){var u=document.createElement("style"),u=(u.textContent=`
.sv{--sv:${e};padding:72px 24px 8px;max-width:520px;margin:0 auto}
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
`,document.head.appendChild(u),`<svg class="sv-seal" id="sv-seal" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="sv-arc" d="M50 50 m-35 0 a35 35 0 1 1 70 0 a35 35 0 1 1 -70 0"/></defs>
  <circle cx="50" cy="50" r="46" fill="${e}" opacity=".9"/><circle cx="50" cy="50" r="41" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>
  <text font-size="8.5" letter-spacing="3.2" fill="#fff" fill-opacity=".8" font-family="serif"><textPath href="#sv-arc">AURORA · CONTRACT · SEALED ·</textPath></text>
  <text x="50" y="57" text-anchor="middle" font-size="22" font-style="italic" fill="#fff" font-family="serif">S.Y.</text></svg>`),h=document.createElement("section");h.dataset.page=f.dataset.page||"2",h.className="sv",h.id="secret-vault",h.innerHTML=`
  <div class="sv-head"><p class="label">Secret · The Vault</p><h2 class="sv-title">${d(x.title||"비밀 금고")}</h2>${x.sub?`<p class="sv-sub">${d(x.sub)}</p>`:""}<div class="sv-orn"></div></div>
  <div id="sv-lock">
    <div class="sv-doc" id="sv-doc">
      ${x.article?`<p class="sv-art">${d(x.article)}</p>`:""}
      ${x.clause?`<p class="sv-clause">${d(x.clause)}</p>`:""}
      <label class="sv-digits" id="sv-digits">${"<span></span>".repeat(v)}<input id="sv-in" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="${v}" autocomplete="off" aria-label="계약 번호 ${v}자리"></label>
      ${x.sign?`<p class="sv-sign">${d(x.sign)}</p>`:""}
      ${u}
    </div>
    <p class="sv-again" id="sv-again" aria-live="polite"></p>
    <div class="sv-hint" id="sv-hint" hidden role="status"></div>
  </div>
  <div class="sv-open" id="sv-open" hidden></div>`,f.after(h);let s=t=>document.getElementById(t),a=s("sv-in"),t=[...s("sv-digits").children].filter(t=>"SPAN"===t.tagName),i=0,n=!1,o=0,r=()=>{let s=a.value;t.forEach((t,e)=>{t.textContent=s[e]||"",t.classList.toggle("cur",document.activeElement===a&&e===Math.min(s.length,v-1))})};function b(t){var e=g[t];s("sv-open").innerHTML=e?`
    <div class="sv-frame"><img src="${d(e.img)}" alt="시크릿 사진 ${t+1}" loading="lazy"><span class="sv-tag">SECRET ${String(t+1).padStart(2,"0")}</span></div>
    ${e.line?`<p class="sv-line">${d(e.line)}</p>`:""}<p class="sv-by">— ${d((Object.values(m.characters||{})[0]||{}).nameEn||"")}</p>
    ${1<g.length?`<div class="sv-nav"><button type="button" data-d="-1">← 이전</button><span class="label" style="align-self:center">${t+1} / ${g.length}</span><button type="button" data-d="1">다음 →</button></div>`:""}
    <button type="button" class="sv-relock" id="sv-relock">금고 다시 잠그기</button>`:`<p class="sv-line">${d(x.empty||"아직 비어 있어.")}</p><button type="button" class="sv-relock" id="sv-relock">금고 다시 잠그기</button>`}function y(t){b(o=0),s("sv-lock").hidden=!0;let e=s("sv-open");e.hidden=!1,t&&!p?requestAnimationFrame(()=>requestAnimationFrame(()=>e.classList.add("on"))):e.classList.add("on")}a.addEventListener("input",()=>{n||(a.value=a.value.replace(/\D/g,"").slice(0,v),s("sv-digits").classList.remove("bad"),r(),a.value.length===v&&(n=!0,a.value===l?(a.blur(),s("sv-again").textContent="",s("sv-hint").hidden=!0,s("sv-seal").classList.add("on"),setTimeout(()=>{c.set("1"),y(!0)},p?200:1300)):(i++,s("sv-digits").classList.add("bad"),setTimeout(()=>{if(a.value="",r(),n=!1,1===i&&x.hint){let t=s("sv-hint"),e=d(x.hint).replace(new RegExp(l),`<em>${l}</em>`);t.innerHTML=`<p>${e}</p>`+(x.hintBy?`<small>— ${d(x.hintBy)}</small>`:""),t.hidden=!1,requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.add("on"))),s("sv-again").textContent=""}else s("sv-again").textContent=x.again||"틀렸어. 다시."},p?150:650))))}),a.addEventListener("focus",r),a.addEventListener("blur",r),s("sv-open").addEventListener("click",t=>{var e=t.target.closest("[data-d]");e?b(o=(o+ +e.dataset.d+g.length)%g.length):t.target.closest("#sv-relock")&&(c.set(""),s("sv-open").hidden=!0,s("sv-open").classList.remove("on"),s("sv-lock").hidden=!1,s("sv-seal").classList.remove("on"),a.value="",i=0,n=!1,s("sv-hint").hidden=!0,s("sv-hint").classList.remove("on"),r())}),"1"===c.get()&&y(!1),r()}}}})();
