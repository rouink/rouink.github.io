/*! © 2026 페르르. All rights reserved. 무단 복제·배포·재사용 금지 */
(()=>{let o=window.ARCHIVE_API;if(o){var e=window.ARCHIVE||{},s=e.page||{},g=new URLSearchParams(location.search);if("badge"===(g.get("intro")||s.intro)){let r=s.badge||{},t=!!(e.config||{}).bgm,d=matchMedia("(prefers-reduced-motion: reduce)").matches;g=e=>String(null==e?"":e).replace(/[&<>"']/g,e=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[e]),e=document.createElement("style");e.textContent=`
#gateway.bd{position:fixed;inset:0;z-index:65;overflow:hidden;padding:0;display:block;color:#17181C;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;
  background:radial-gradient(110% 60% at 50% 0%,#FBFAF6 0%,rgba(251,250,246,0) 62%),linear-gradient(180deg,#F4F2EC 0%,#ECE9E1 100%)}
#gateway.bd::before{content:'';position:absolute;inset:0;opacity:.3;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .4 0 0 0 0 .4 0 0 0 0 .42 0 0 0 .08 0'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E")}
.bd .bd-wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;padding:calc(18px + env(safe-area-inset-top)) 22px calc(22px + env(safe-area-inset-bottom))}
.bd .bd-top{flex:none;font-family:"Sometype Mono",monospace;font-size:10.5px;letter-spacing:.32em;color:#1E2942;padding-left:.32em;margin:6px 0 0;display:flex;align-items:center;gap:10px}
.bd .bd-top i{width:22px;height:5px;background:#C9F03A;box-shadow:inset 0 0 0 1.2px #1E2942}
.bd .bd-stage{position:relative;flex:1;width:100%;min-height:0;perspective:1100px;margin-top:12px;clip-path:inset(0 -40px -60px -40px)}
.bd .bd-swing{position:absolute;left:50%;top:0;width:var(--cw);margin-left:calc(var(--cw) / -2);height:100%;transform-origin:50% 0;animation:bdSwing 3.8s ease-in-out infinite alternate}
@keyframes bdSwing{from{transform:rotate(-3.2deg)}to{transform:rotate(2.6deg)}}
.bd .bd-swing.still{animation:none;transform:rotate(-1.2deg);transition:transform .9s cubic-bezier(.2,.7,.2,1)}
.bd .bd-strap{position:absolute;left:50%;top:-6px;height:var(--sh);width:0}
.bd .bd-strap::before,.bd .bd-strap::after{content:'';position:absolute;bottom:0;width:11px;height:calc(var(--sh) + 30px);background:linear-gradient(90deg,#17203A,#26355A 55%,#1E2942);transform-origin:50% 100%;border-radius:1px}
.bd .bd-strap::before{left:-20px;transform:rotate(-6.5deg)}.bd .bd-strap::after{left:9px;transform:rotate(6.5deg)}
.bd .bd-clip{position:absolute;left:50%;top:calc(var(--sh) - 10px);width:38px;height:28px;margin-left:-19px;border-radius:6px;background:linear-gradient(#DADDE3,#9298A3);box-shadow:inset 0 1px 0 rgba(255,255,255,.7),0 2px 4px rgba(0,0,0,.18);z-index:2}
.bd .bd-card{position:absolute;left:0;top:calc(var(--sh) + 8px);width:var(--cw);aspect-ratio:236/340;padding:0;border:0;background:none;cursor:pointer;transform-style:preserve-3d;transition:transform 1s cubic-bezier(.3,.7,.15,1);outline:none;-webkit-tap-highlight-color:transparent}
.bd .bd-card:focus-visible .bd-back{box-shadow:0 0 0 3px #C9F03A,0 18px 34px rgba(30,30,50,.22)}
.bd .bd-card.flip{transform:rotateY(180deg)}
.bd .bd-face{position:absolute;inset:0;border-radius:14px;background:#FBFAF7;box-shadow:0 18px 34px rgba(30,30,50,.2),inset 0 0 0 1px rgba(30,41,66,.06);backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;text-align:left}
.bd .bd-face::before{content:'';position:absolute;left:50%;top:5.5%;width:22%;height:2.8%;margin-left:-11%;border-radius:6px;background:#E3E0D8;box-shadow:inset 0 1px 2px rgba(0,0,0,.12)}
.bd .bd-back .t{position:absolute;left:12%;top:17%;font-family:"Sometype Mono",monospace;font-size:calc(var(--cw) * .043);line-height:1.7;letter-spacing:.14em;color:#8A8B90}
.bd .bd-back .mk{position:absolute;left:12%;right:12%;top:35%;height:24%;border:1.5px solid #DDD9CF;border-radius:8px}
.bd .bd-back .bars{position:absolute;left:12%;right:12%;bottom:20%;height:13%;background:repeating-linear-gradient(90deg,#1B1C21 0 2px,transparent 2px 5px,#1B1C21 5px 6px,transparent 6px 9px,#1B1C21 9px 12px,transparent 12px 14px)}
.bd .bd-back .no{position:absolute;right:9%;bottom:6%;font-family:"Sometype Mono",monospace;font-size:calc(var(--cw) * .042);color:#A9AAAE;letter-spacing:.08em}
.bd .bd-front{transform:rotateY(180deg)}
.bd .bd-front .pic{position:absolute;left:10%;right:10%;top:12%;height:52%;border-radius:4px;background:#ddd center/cover no-repeat}
.bd .bd-front .rl{position:absolute;left:10%;top:68.5%;font-family:"Sometype Mono",monospace;font-size:calc(var(--cw) * .042);letter-spacing:.16em;color:#7A7874}
.bd .bd-front .nm{position:absolute;left:10%;top:73%;font-family:"Hahmlet",serif;font-weight:800;font-size:calc(var(--cw) * .185);line-height:1.1;color:#17181C;letter-spacing:-.01em}
.bd .bd-front .hj{position:absolute;right:9%;top:77.5%;font-family:"Gowun Batang",serif;font-size:calc(var(--cw) * .058);color:#77757A}
.bd .bd-front .zn{position:absolute;left:10%;bottom:5.5%;font-family:"Sometype Mono",monospace;font-size:calc(var(--cw) * .04);letter-spacing:.12em;color:#1E2942}
.bd .bd-front .vs{position:absolute;right:10%;bottom:6.5%;width:19%;height:2.4%;background:#C9F03A;box-shadow:inset 0 0 0 1.5px #1E2942}
.bd .bd-foot{flex:none;width:100%;text-align:center;min-height:178px;display:flex;flex-direction:column;align-items:center;justify-content:flex-start}
.bd .bd-line{margin:0;font-family:"Gowun Batang",serif;font-weight:700;font-size:clamp(30px,8.6vw,38px);letter-spacing:-.01em;color:#1E2942;opacity:0;transform:translateY(8px);transition:opacity .7s ease,transform .7s cubic-bezier(.2,.7,.2,1);height:0;overflow:visible}
.bd .bd-line.on{opacity:1;transform:none;height:auto}
.bd .bd-hint{margin:6px 0 0;font-family:"Gowun Batang",serif;font-size:15px;color:#17181C;transition:opacity .5s ease}
.bd .bd-hint span{display:block;margin-top:8px;font-family:"Sometype Mono",monospace;font-size:10.5px;letter-spacing:.32em;color:#1E2942;padding-left:.32em}
.bd .bd-hint.off{opacity:0;pointer-events:none;height:0;margin:0;overflow:hidden}
.bd .bd-in{display:flex;flex-direction:column;align-items:center;gap:12px;margin-top:16px;opacity:0;transform:translateY(6px);transition:opacity .6s ease,transform .6s ease;pointer-events:none}
.bd .bd-in.on{opacity:1;transform:none;pointer-events:auto}
.bd .bd-name{display:flex;align-items:baseline;gap:10px;font-family:"Sometype Mono",monospace;font-size:10.5px;letter-spacing:.2em;color:#5C5F68}
.bd .bd-name input{width:170px;padding:5px 2px;border:0;border-bottom:1px solid #A9A69D;border-radius:0;background:transparent;text-align:center;font-family:"Gowun Batang",serif;font-size:16px;letter-spacing:0;color:#17181C;outline:none;user-select:text;-webkit-user-select:text}
.bd .bd-name input:focus{border-bottom-color:#1E2942}
.bd .bd-name input::placeholder{color:#A9A69D}
.bd .bd-go{min-width:200px;padding:13px 26px;border:0;border-radius:0;background:#1E2942;color:#F3F0E8;font-family:"Gowun Batang",serif;font-weight:700;font-size:15.5px;letter-spacing:.06em;cursor:pointer;box-shadow:0 8px 18px rgba(30,41,66,.22)}
.bd .bd-quiet{padding:6px 10px;border:0;background:none;font-family:"IBM Plex Sans KR",sans-serif;font-weight:500;font-size:13.5px;color:#4A4D57;text-decoration:underline;text-underline-offset:4px;cursor:pointer}
.bd .bd-go:focus-visible{outline:3px solid #C9F03A;outline-offset:3px}
.bd .bd-sign{margin:auto 0 0;padding-top:14px;font-family:"Sometype Mono",monospace;font-size:9.5px;letter-spacing:.3em;color:#A09D95;padding-left:.3em}
.bd .bd-veil{position:absolute;inset:0;z-index:4;background:#F3F0E8;opacity:0;pointer-events:none;transition:opacity .8s ease}
.bd .bd-veil.on{opacity:1}
@media (min-width:760px){.bd .bd-wrap{padding-top:28px}}
@media (prefers-reduced-motion:reduce){.bd .bd-swing{animation:none}.bd .bd-card,.bd .bd-line,.bd .bd-in,.bd .bd-veil,.bd .bd-hint{transition-duration:.01s}}`,document.head.appendChild(e);let a=o.gateway,p=(a.className="bd",a.removeAttribute("style"),a.innerHTML=`
<div class="bd-wrap">
  <p class="bd-top"><i aria-hidden="true"></i>${g(r.zone||"ZONE 07 · 07:50")}</p>
  <div class="bd-stage" id="bd-stage">
    <div class="bd-swing" id="bd-swing">
      <span class="bd-strap" aria-hidden="true"></span><span class="bd-clip" aria-hidden="true"></span>
      <button type="button" class="bd-card" id="bd-card" aria-label="뒤집힌 명찰 — 눌러서 뒤집기">
        <span class="bd-face bd-back" aria-hidden="true"><span class="t">${(r.back||["MORNING DUTY","PARKING · ZONE 07"]).map(g).join("<br>")}</span><span class="mk"></span><span class="bars"></span><span class="no">${g(r.no||"NO. 0741")}</span></span>
        <span class="bd-face bd-front" aria-hidden="true"><span class="pic" style="background-image:url('${g(r.photo||"")}')"></span><span class="rl">${g(r.role||"단속 담당 · 3년 차")}</span><span class="nm">${g(r.name||s.introTitle||"")}</span><span class="hj">${g(r.hanja||"")}</span><span class="zn">${g(r.zoneShort||"ZONE 07")}</span><span class="vs"></span></span>
      </button>
    </div>
  </div>
  <div class="bd-foot">
    <p class="bd-line" id="bd-line" aria-live="polite"></p>
    <p class="bd-hint" id="bd-hint">${g(r.hint||"명찰이 뒤집혀 있다.")}<span>${g(r.hintEn||"TAP TO FLIP")}</span></p>
    <div class="bd-in" id="bd-in">
      <label class="bd-name"><span>NAME</span><input type="text" id="username" placeholder="${g(r.namePh||"적지 않아도 돼요")}" maxlength="10" autocomplete="off"></label>
      <button type="button" class="bd-go" id="bd-go">${g(t?r.enterBgm||"음악과 함께 기록 보기":r.enter||"기록 보기")}</button>${t?`<button type="button" class="bd-quiet" id="bd-quiet">${g(r.enterQuiet||"조용히 보기")}</button>`:""}
    </div>
    ${r.sign?`<p class="bd-sign">${g(r.sign)}</p>`:""}
  </div>
</div>
<div class="bd-veil" id="bd-veil"></div>`,e=>document.getElementById(e)),i=p("bd-stage"),l=p("bd-swing"),b=p("bd-card"),c=(r.photo&&((new Image).src=r.photo),m(),addEventListener("resize",m),null),f=!1,n=!1;function m(){var e=i.clientHeight,t=i.clientWidth,n=Math.max(70,Math.min(170,.26*e)),t=Math.min(260,.62*t,236*(e-n-24)/340),t=Math.max(150,t);a.style.setProperty("--cw",t.toFixed(1)+"px"),a.style.setProperty("--sh",n.toFixed(1)+"px")}function u(){if(!f){f=!0,l.classList.add("still"),b.classList.add("flip");try{"suspended"===(c=c||new(window.AudioContext||window.webkitAudioContext)).state&&c.resume();var e=c.currentTime,t=.06*c.sampleRate,n=c.createBuffer(1,t,c.sampleRate),a=n.getChannelData(0);for(let e=0;e<t;e++)a[e]=(2*Math.random()-1)*Math.exp(-e/t*9);var i=c.createBufferSource(),o=c.createBiquadFilter(),s=c.createGain();o.type="bandpass",o.frequency.value=2400,o.Q.value=1.4,s.gain.value=.12,i.buffer=n,i.connect(o),o.connect(s),s.connect(c.destination),i.start(e)}catch{}b.setAttribute("aria-label","명찰 앞면 — "+(r.name||"")),b.setAttribute("aria-disabled","true"),p("bd-hint").classList.add("off"),setTimeout(()=>{let e=p("bd-line");e.textContent=r.line||"…봤어요?",requestAnimationFrame(()=>e.classList.add("on"))},d?50:900),setTimeout(()=>{p("bd-in").classList.add("on")},d?80:1500)}}function x(e){n||(n=!0,o.enter(!!e,()=>new Promise(e=>{p("bd-veil").classList.add("on"),setTimeout(()=>{a.style.transition="opacity .7s ease",a.style.opacity="0",setTimeout(e,d?0:720)},d?0:700)})))}b.addEventListener("click",u),b.addEventListener("keydown",e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),u())}),p("bd-go").addEventListener("click",()=>x(t)),p("bd-quiet")&&p("bd-quiet").addEventListener("click",()=>x(!1)),p("username").addEventListener("keydown",e=>{"Enter"===e.key&&(e.preventDefault(),x(t))})}}})();
