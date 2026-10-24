/*! © 2026 페르르. All rights reserved. 무단 복제·배포·재사용 금지 */
(()=>{let e=document.currentScript,S=window.ARCHIVE_API;if(S&&e){var P=window.ARCHIVE||{},G=P.page||{},R=new URLSearchParams(location.search);if("shutter"===(R.get("intro")||G.intro)){let t=G.shutter||{},r=matchMedia("(prefers-reduced-motion: reduce)").matches,e=e=>String(null==e?"":e).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),a,n,s=e=>String(e).padStart(2,"0"),i=(n=R.get("t"))&&/^\d{3,4}$/.test(n)?((a=new Date).setHours(+n.slice(0,-2),+n.slice(-2),0,0),a):new Date,o=i.getHours(),l=i.getMinutes(),p=null!=t.open?t.open:9,h=null!=t.close?t.close:22,c=p<=o&&o<h,d=o===h-1&&50<=l,g=c?t.note||"":t.closedNote||t.note||"",u=!(!P.config||!P.config.bgm),x=document.createElement("style"),m=(x.textContent=`
#gateway.sh{position:fixed;inset:0;z-index:65;overflow:hidden;padding:0;display:block;color:#26312A;-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;
  background:radial-gradient(120% 70% at 50% 0%,#FBF7EF 0%,rgba(251,247,239,0) 60%),linear-gradient(180deg,#F5EFE3 0%,#EEE8DA 62%,#E3E7DA 100%)}
#gateway.sh::before{content:'';position:absolute;inset:0;opacity:.32;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .45 0 0 0 0 .42 0 0 0 0 .36 0 0 0 .09 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.sh .sh-wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding:calc(30px + env(safe-area-inset-top)) 22px calc(24px + env(safe-area-inset-bottom))}
.sh .sh-sign{text-align:center;flex:none}
.sh .sh-shop{font-family:var(--f-intro,var(--f-display));font-size:31px;letter-spacing:.2em;color:#2E4630;line-height:1.2;padding-left:.2em}
.sh .sh-shop-sub{margin-top:6px;font-family:"Italiana","Cormorant Garamond",serif;font-size:11px;letter-spacing:.42em;color:#8A7D68;padding-left:.42em}
.sh .sh-store{position:relative;flex:1;width:min(100%,440px);min-height:0;margin-top:18px;display:flex;flex-direction:column}
.sh .sh-awn{position:relative;flex:none;height:20px;margin:0 -8px;background:repeating-linear-gradient(90deg,#4A6A4B 0 14px,#F6F1E6 14px 28px);box-shadow:inset 0 -1px 0 rgba(46,70,48,.25)}
.sh .sh-awn::after{content:'';position:absolute;left:0;right:0;top:100%;height:8px;background:radial-gradient(circle at 7px 0,#4A6A4B 7px,transparent 7.5px) 0 0/28px 8px repeat-x,radial-gradient(circle at 21px 0,#F6F1E6 7px,transparent 7.5px) 0 0/28px 8px repeat-x;filter:drop-shadow(0 3px 2px rgba(46,70,48,.14))}
.sh .sh-door{position:relative;flex:1;min-height:0;margin-top:12px;overflow:hidden;background:#3A3024;box-shadow:inset 0 0 0 6px #E7E0D1,inset 0 0 0 7px #CFC6B3,0 18px 40px rgba(60,52,36,.16);touch-action:none;cursor:grab}
.sh .sh-door.drag{cursor:grabbing}
.sh .sh-in{position:absolute;inset:7px;overflow:hidden;background:#E9D9B8}
.sh .sh-in img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 26%;filter:blur(calc(var(--b,1) * 7px)) brightness(calc(1.08 + var(--b,1) * .06)) saturate(1.05);transform:scale(calc(1.06 + var(--b,1) * .04));transition:filter .9s ease,transform 1.2s ease}
.sh .sh-in::after{content:'';position:absolute;inset:0;background:radial-gradient(90% 60% at 50% 100%,rgba(255,214,140,calc(.18 + var(--b,1) * .3)),rgba(255,214,140,0) 70%);pointer-events:none}
.sh .sh-hello{position:absolute;left:50%;bottom:22px;transform:translate(-50%,8px);width:calc(100% - 44px);max-width:340px;padding:12px 18px;text-align:center;background:rgba(255,253,248,.9);color:#2E4630;font-family:var(--f-intro,var(--f-display));font-size:19px;line-height:1.5;word-break:keep-all;box-shadow:0 8px 20px rgba(40,36,24,.14);opacity:0;transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1)}
.sh .sh-hello.on{opacity:1;transform:translate(-50%,0)}
.sh .sh-shut{position:absolute;left:7px;right:7px;top:7px;height:calc(100% - 14px);transform:translateY(calc(var(--p,0) * -101%));will-change:transform;
  background:linear-gradient(90deg,rgba(0,0,0,.05),rgba(255,255,255,.12) 18%,rgba(0,0,0,0) 40%,rgba(0,0,0,.04) 75%,rgba(255,255,255,.08)),repeating-linear-gradient(180deg,#E6E6DD 0 12px,#D3D4CA 12px 13px,#F0F0E9 13px 14.5px,#DADBD1 14.5px 16px);
  box-shadow:0 10px 18px rgba(40,40,30,.28)}
.sh .sh-shut::after{content:'';position:absolute;left:0;right:0;bottom:0;height:18px;background:linear-gradient(#C9CABF,#B5B6AA);border-top:1px solid #EEEFE8}
.sh .sh-handle{position:absolute;left:50%;bottom:4px;width:74px;height:9px;margin-left:-37px;border-radius:6px;z-index:1;background:linear-gradient(#D5B676,#9B7E45);box-shadow:0 1px 2px rgba(0,0,0,.25)}
.sh .sh-note{position:absolute;left:50%;top:22%;width:min(70%,236px);padding:22px 16px 14px;transform:translateX(-50%) rotate(-2deg);background:#FFFDF6;text-align:center;box-shadow:0 3px 9px rgba(0,0,0,.13)}
.sh .sh-note::before{content:'';position:absolute;left:50%;top:-9px;width:62px;height:19px;margin-left:-31px;background:rgba(240,210,74,.78);transform:rotate(3deg)}
.sh .sh-note p{font-family:"Nanum Pen Script","Gowun Batang",cursive;font-size:27px;line-height:1.12;color:#4B4A40;word-break:keep-all}
.sh .sh-note small{display:block;margin-top:8px;font-family:"Nanum Pen Script",cursive;font-size:29px;color:#2E4630}
.sh .sh-clock{position:absolute;right:16px;top:16px;z-index:2;padding:2px 9px;background:rgba(255,253,248,.82);font-family:"Cormorant Garamond",serif;font-style:italic;font-size:15px;letter-spacing:.06em;color:#4B5146}
.sh .sh-clock.reg{color:#2E4630;box-shadow:inset 0 -2px 0 #F0D24A}
.sh .sh-foot{flex:none;width:100%;text-align:center;padding-top:18px}
.sh .sh-title{font-family:var(--f-intro,var(--f-display));font-size:clamp(48px,14vw,62px);line-height:1.05;letter-spacing:.06em;color:#2E4630}
.sh .sh-sub{margin-top:2px;font-family:"Cormorant Garamond",serif;font-style:italic;font-size:17px;color:#8A7D68}
.sh .sh-hint{height:22px;margin-top:8px;font-size:13px;letter-spacing:.04em;color:#6B7468;opacity:0;transition:opacity .6s ease}
.sh .sh-hint.on{opacity:1}
.sh .sh-name{display:flex;align-items:baseline;justify-content:center;gap:10px;margin-top:6px;font-size:13px;color:#6B7468}
.sh .sh-name input{width:150px;padding:4px 2px;border:0;border-bottom:1px solid #B7A58C;background:transparent;text-align:center;font-family:var(--f-text);font-size:15px;color:#26312A;outline:none;border-radius:0;user-select:text;-webkit-user-select:text}
.sh .sh-name input:focus{border-bottom-color:#2E4630}
.sh .sh-name input::placeholder{color:#A99D88}
.sh .sh-signoff{margin-top:12px;font-family:"Cinzel","Cormorant Garamond",serif;font-size:10px;letter-spacing:.32em;color:#A99D88}
.sh .sh-sound{position:absolute;right:14px;top:calc(14px + env(safe-area-inset-top));z-index:3;padding:6px 10px;font-family:"Cormorant Garamond",serif;font-style:italic;font-size:13px;color:#6B7468;background:rgba(255,253,248,.6)}
.sh .sh-veil{position:absolute;inset:0;z-index:4;background:#F7F2E8;opacity:0;pointer-events:none;transition:opacity .8s ease}
.sh .sh-veil.on{opacity:1}
#gateway.sh.has-music .sh-wrap{padding-top:calc(50px + env(safe-area-inset-top))}
@media (min-width:760px){.sh .sh-wrap{padding-top:38px}.sh .sh-store{width:min(440px,46vh)}.sh .sh-shop{font-size:34px}}
@media (max-height:640px){.sh .sh-signoff{display:none}.sh .sh-shop{font-size:26px}.sh .sh-title{font-size:44px}}
@media (prefers-reduced-motion:reduce){.sh .sh-in img,.sh .sh-hello,.sh .sh-hint,.sh .sh-veil{transition-duration:.01s}}`,document.head.appendChild(x),S.gateway);m.className="sh"+(u?" has-music":""),m.removeAttribute("style");R=t.image||G.heroImage||"";m.innerHTML=`
<div class="sh-wrap">
  <div class="sh-sign"><p class="sh-shop">${e(t.shop||"꽃집")}</p>${t.shopSub?`<p class="sh-shop-sub">${e(t.shopSub)}</p>`:""}</div>
  <div class="sh-store">
    <div class="sh-awn" aria-hidden="true"></div>
    <div class="sh-door" id="sh-door" role="button" tabindex="0" aria-label="셔터 올리기 (위로 밀거나 Enter)">
      <div class="sh-in">${R?`<img src="${e(R)}" alt="">`:""}<p class="sh-hello" id="sh-hello"></p></div>
      <div class="sh-shut" id="sh-shut"><div class="sh-note">${g?`<p>${P=g,e(P).replace(/\n/g,"<br>")}</p>`:""}${t.noteBy?`<small>${e(t.noteBy)}</small>`:""}</div><span class="sh-handle"></span></div>
      <span class="sh-clock${d?" reg":""}" aria-hidden="true">${s(o)}:${s(l)}</span>
    </div>
  </div>
  <div class="sh-foot">
    <h1 class="sh-title">${e(G.introTitle||G.brand||"")}</h1>
    ${G.introSub?`<p class="sh-sub">${e(G.introSub)}</p>`:""}
    <p class="sh-hint" id="sh-hint" aria-live="polite">${e(t.hint||"셔터를 위로 밀어 올려 봐")}</p>
    <label class="sh-name"><span>${e(t.name||"이름")}</span><input type="text" id="username" placeholder="${e(t.namePh||"")}" maxlength="10" autocomplete="off"></label>
    ${t.sign?`<p class="sh-signoff">${e(t.sign)}</p>`:""}
  </div>
</div>
${u?'<button type="button" class="sh-sound" id="sh-sound" aria-pressed="true">♪ 소리 켜짐</button>':""}
<div class="sh-veil" id="sh-veil"></div>`;let f=e=>document.getElementById(e),b=f("sh-door"),v=f("sh-shut"),w=f("sh-hint"),y=b.querySelector(".sh-in"),E=.2,k=E,A=!1,C=u,F=null,B=!1,z=()=>{u&&C&&!B&&(B=!0,S.setBgm(!0))},D=(u&&f("sh-sound").addEventListener("click",e=>{C=!C,e.currentTarget.textContent=C?"♪ 소리 켜짐":"♪ 소리 꺼짐",e.currentTarget.setAttribute("aria-pressed",C),B&&!C?(B=!1,S.setBgm(!1)):C&&z()}),e=>{k=Math.max(0,Math.min(1,e)),v.style.setProperty("--p",k.toFixed(4)),y.style.setProperty("--b",Math.min(1,(1-k)/.8).toFixed(3))}),$=(D(E),null),T=()=>{clearTimeout($),w.classList.remove("on"),A||($=setTimeout(()=>w.classList.add("on"),1e3))},L=(T(),null),M=!1;b.addEventListener("pointerdown",e=>{A||e.target.closest("input")||(z(),L={y:e.clientY,p:k,h:b.clientHeight},b.setPointerCapture(e.pointerId),b.classList.add("drag"),w.classList.remove("on"),clearTimeout($))}),b.addEventListener("pointermove",e=>{L&&(e=L.y-e.clientY,D(L.p+e/(.9*L.h)),!M)&&.25<k&&(M=!0,q())});R=()=>{var e;L&&(b.classList.remove("drag"),e=Math.abs(k-L.p),L=null,(.46<k?H:(e<.01?I(.34,260,()=>setTimeout(()=>!A&&I(E,380),260)):I(E,420),T))())};function q(){try{"suspended"===(F=F||new(window.AudioContext||window.webkitAudioContext)).state&&F.resume();var t=.5*F.sampleRate,e=F.createBuffer(1,t,F.sampleRate),a=e.getChannelData(0);for(let e=0;e<t;e++){var n=e/F.sampleRate;a[e]=(2*Math.random()-1)*(.3<Math.sin(2*n*Math.PI*38)?.5:.12)*Math.exp(4.2*-n)}var s=F.createBufferSource(),i=F.createBiquadFilter(),o=F.createGain();i.type="bandpass",i.frequency.value=900,i.Q.value=.8,o.gain.value=.16,s.buffer=e,s.connect(i),i.connect(o),o.connect(F.destination),s.start()}catch{}}function I(a,n,s){let i=k,o=performance.now();r?(D(a),s&&s()):function e(t){t=Math.min(1,(t-o)/n);D(i+(a-i)*(1-Math.pow(1-t,3))),t<1?requestAnimationFrame(e):s&&s()}(o)}function H(){A||(A=!0,clearTimeout($),w.classList.remove("on"),b.style.cursor="default",b.setAttribute("aria-label","셔터가 열렸어요"),I(1,700,()=>{try{"suspended"===(F=F||new(window.AudioContext||window.webkitAudioContext)).state&&F.resume();let o=F.currentTime,r=F.createGain();r.gain.value=.22,r.connect(F.destination),[[0,1],[.16,.72]].forEach(([s,i])=>[2093,2637,3520].forEach((e,t)=>{var a=F.createOscillator(),n=F.createGain();a.type="sine",a.frequency.value=e*(1+.01*s),n.gain.setValueAtTime(0,o+s),n.gain.linearRampToValueAtTime(i/(t+1),o+s+.008),n.gain.exponentialRampToValueAtTime(5e-4,o+s+1.4-.3*t),a.connect(n),n.connect(r),a.start(o+s),a.stop(o+s+1.5)}))}catch{}let e=f("sh-hello");e.textContent=d&&t.lineRegular||t.line||"",e.textContent&&requestAnimationFrame(()=>e.classList.add("on")),setTimeout(()=>{S.enter(C,()=>new Promise(e=>{f("sh-veil").classList.add("on"),setTimeout(()=>{m.style.transition="opacity .7s ease",m.style.opacity="0",setTimeout(e,r?0:720)},r?0:800)}))},r?400:1700)}))}b.addEventListener("pointerup",R),b.addEventListener("pointercancel",R),b.addEventListener("keydown",e=>{["Enter"," ","ArrowUp"].includes(e.key)&&(e.preventDefault(),z(),q(),H())}),f("username").addEventListener("keydown",e=>{"Enter"===e.key&&(e.preventDefault(),z(),H())}),r&&b.addEventListener("click",()=>{z(),H()})}}})();
