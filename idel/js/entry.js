/* 이델 — 입장: 길게 누르고 있는 동안만 붓이 움직인다. 밑그림 → 밑칠 → 채색 */
(function(){
  var E=document.getElementById('entry');
  if(window.IDEL_LOCKED||!E) return;
  var S=window.IDEL_STATE||{n:0,tod:'dusk',reduce:false}, D=window.IDEL||{}, SITE=window.IDEL_SITE||{};
  var L=D.lines||{}, body=document.body;
  var qs; try{qs=new URLSearchParams(location.search);}catch(e){qs={get:function(){return null},has:function(){return false}};}
  function $(id){return document.getElementById(id);}
  var pad=function(x){return (x<10?'0':'')+x;};

  var skipNow=qs.get('entry')==='0';
  try{ if(!qs.has('visit')&&sessionStorage.getItem('idel.in')==='1') skipNow=true; }catch(e){}
  if(skipNow){ E.parentNode.removeChild(E); SITE.entered&&SITE.entered(); return; }
  body.classList.add('e-on');

  var lineEl=$('e-line'), prog=$('e-prog'), hold=$('e-hold'), holdS=$('e-hold-snd'), go=$('e-go'), skip=$('e-skip');
  var fbU=E.querySelector('.e-fb-u'), fbC=E.querySelector('.e-fb-c'), cv=$('e-gl');
  var done=S.n>=12, sat=S.satToday;
  var mode=(done||sat)?'go':'hold';

  $('e-top').textContent='NORTH TOWER · 1127 · '+(S.tod==='dusk'?'DUSK':(S.tod==='day'?'DAYLIGHT':'NIGHT'));
  $('e-sit').textContent='SITTING '+pad(mode==='go'?Math.max(1,S.n):S.n+1)+' / 12';

  function nl(t){return String(t||'').split('\n').map(function(x){return x.replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];});}).join('<br>');}
  var lineT;
  function say(t,instant){
    clearTimeout(lineT);
    if(instant||S.reduce){lineEl.innerHTML=nl(t);lineEl.classList.remove('swap');return;}
    lineEl.classList.add('swap');
    lineT=setTimeout(function(){lineEl.innerHTML=nl(t);lineEl.classList.remove('swap');},260);
  }
  var first=done?L.after:(sat?L.sat:(S.n===11?L.last:(L[S.tod]||L.dusk)));
  say(first,true);

  /* 버튼 구성 */
  if(S.reduce){ $$small('누르기'); }
  function $$small(t){[hold,holdS].forEach(function(b){var s=b.querySelector('small');if(s)s.textContent=t;});}
  if(mode==='go'){ hold.hidden=true; holdS.hidden=true; go.hidden=false; skip.hidden=true; }
  (SITE.musicReady||Promise.resolve(false)).then(function(has){
    if(!has||mode==='go')return;
    holdS.hidden=false; hold.classList.add('q2');
    hold.firstChild.nodeValue='조용히 앉기';
  });

  /* ── 붓질 그리기 ── */
  var t=mode==='go'?2:0, gl=null, U={}, ready=false, img={};
  function fallbackPaint(){
    var a=Math.min(1,Math.max(0,t)), b=Math.min(1,Math.max(0,t-1));
    fbU.style.opacity=a; fbC.style.opacity=b;
  }
  function paint(){
    prog.style.width=(Math.min(2,t)/2*100)+'%';
    if(ready&&gl){
      gl.uniform1f(U.p1,Math.min(1,t)*1.08-0.04);
      gl.uniform1f(U.p2,Math.max(0,Math.min(1,t-1))*1.08-0.04);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    } else fallbackPaint();
  }

  var VS='attribute vec2 a;varying vec2 v;void main(){v=a*0.5+0.5;v.y=1.0-v.y;gl_Position=vec4(a,0.,1.);}';
  var FS='precision mediump float;varying vec2 v;uniform sampler2D s0,s1,s2,so;uniform float p1,p2;uniform vec2 sc,of;'+
    'void main(){vec2 uv=v*sc+of;vec4 o=texture2D(so,uv);'+
    'float a1=smoothstep(o.r-0.04,o.r,p1);float a2=smoothstep(o.g-0.04,o.g,p2);'+
    'vec3 c=mix(texture2D(s0,uv).rgb,texture2D(s1,uv).rgb,a1);c=mix(c,texture2D(s2,uv).rgb,a2);gl_FragColor=vec4(c,1.);}';

  function fit(){
    var r=cv.getBoundingClientRect(), w=Math.max(1,r.width), h=Math.max(1,r.height);
    var dpr=Math.min(window.devicePixelRatio||1, w>1200?1.25:1.6);
    cv.width=Math.round(w*dpr); cv.height=Math.round(h*dpr);
    if(!gl)return;
    gl.viewport(0,0,cv.width,cv.height);
    var ia=4/3, ca=w/h, sx=1, sy=1, ox=0, oy=0, ay=0.28;
    if(ca>ia){ sy=ia/ca; oy=(1-sy)*(innerWidth>=960?0.24:ay); } else { sx=ca/ia; ox=(1-sx)*0.5; }
    gl.uniform2f(U.sc,sx,sy); gl.uniform2f(U.of,ox,oy);
    paint();
  }
  function tex(unit,im){
    var tx=gl.createTexture(); gl.activeTexture(gl.TEXTURE0+unit); gl.bindTexture(gl.TEXTURE_2D,tx);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,false);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,im);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  }
  function load(src){return new Promise(function(res,rej){var i=new Image();i.decoding='async';i.onload=function(){res(i);};i.onerror=rej;i.src=src;});}
  function initGL(){
    if(qs.get('gl')==='0')return;
    try{ gl=cv.getContext('webgl',{alpha:false,antialias:false,premultipliedAlpha:false,preserveDrawingBuffer:false})||cv.getContext('experimental-webgl'); }catch(e){gl=null;}
    if(!gl)return;
    function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
    try{
      var pr=gl.createProgram(); gl.attachShader(pr,sh(gl.VERTEX_SHADER,VS)); gl.attachShader(pr,sh(gl.FRAGMENT_SHADER,FS)); gl.linkProgram(pr);
      if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error('link');
      gl.useProgram(pr);
      var b=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,b);
      gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      var loc=gl.getAttribLocation(pr,'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      ['s0','s1','s2','so'].forEach(function(n,i){gl.uniform1i(gl.getUniformLocation(pr,n),i);});
      U={p1:gl.getUniformLocation(pr,'p1'),p2:gl.getUniformLocation(pr,'p2'),sc:gl.getUniformLocation(pr,'sc'),of:gl.getUniformLocation(pr,'of')};
    }catch(e){gl=null;return;}
    Promise.all(['assets/h_sketch.jpg?v=2','assets/h_under.jpg?v=2','assets/h_color.jpg?v=2','assets/h_order.png'].map(load)).then(function(ims){
      if(!gl)return;
      ims.forEach(function(im,i){tex(i,im);});
      ready=true; fit(); cv.classList.add('ready');
    }).catch(function(){gl=null;});
    cv.addEventListener('webglcontextlost',function(e){e.preventDefault();ready=false;gl=null;cv.classList.remove('ready');fallbackPaint();});
  }
  if(mode==='go'){ fbU.style.opacity=1; fbC.style.opacity=1; prog.style.width='100%'; }
  else initGL();
  fit(); window.addEventListener('resize',fit);
  paint();

  /* ── 앉기 ── */
  var holding=false, raf=0, lastT=0, rel=0, finished=false, curBtn=null;
  function loop(ts){
    if(!lastT)lastT=ts; var dt=Math.min(.05,(ts-lastT)/1000); lastT=ts;
    if(holding){ t+= dt/(t<1?1.1:1.5); if(t>=2){t=2;paint();complete();return;} paint(); raf=requestAnimationFrame(loop); }
    else { raf=0; lastT=0; }
  }
  function start(btn,withSound){
    if(finished||mode!=='hold')return;
    if(withSound&&SITE.startMusic)SITE.startMusic();
    if(S.reduce){ t=2; paint(); complete(); return; }
    holding=true; curBtn=btn; btn.classList.add('on');
    say(L.hold||'그대로.');
    if(!raf){lastT=0;raf=requestAnimationFrame(loop);}
  }
  function stop(){
    if(!holding)return; holding=false;
    if(curBtn)curBtn.classList.remove('on'); curBtn=null;
    if(finished||t>=2)return;
    var r=L.release||['움직이지 마.']; say(r[rel%r.length]); rel++;
  }
  function complete(){
    if(finished)return; finished=true; holding=false;
    [hold,holdS].forEach(function(b){b.classList.remove('on');b.disabled=true;});
    skip.hidden=true;
    var last=S.n===11;
    say(last?'…끝났어.':(L.done||'…됐어.'));
    if(SITE.sit)SITE.sit();
    setTimeout(exit,S.reduce?500:1500);
  }
  function exit(){
    try{sessionStorage.setItem('idel.in','1');}catch(e){}
    window.scrollTo(0,0);
    E.classList.add('out'); body.classList.remove('e-on');
    if(SITE.entered)SITE.entered();
    setTimeout(function(){ if(E.parentNode)E.parentNode.removeChild(E); window.removeEventListener('resize',fit); },S.reduce?0:1050);
  }
  [hold,holdS].forEach(function(b){
    var ws=(b===holdS);
    b.addEventListener('pointerdown',function(e){ if(e.button!==undefined&&e.button!==0)return; e.preventDefault(); try{b.setPointerCapture(e.pointerId);}catch(_){} start(b,ws); });
    b.addEventListener('pointerup',stop); b.addEventListener('pointercancel',stop); b.addEventListener('lostpointercapture',stop);
    b.addEventListener('keydown',function(e){ if((e.key===' '||e.key==='Enter')&&!e.repeat){e.preventDefault();start(b,ws);} });
    b.addEventListener('keyup',function(e){ if(e.key===' '||e.key==='Enter'){e.preventDefault();stop();} });
    b.addEventListener('click',function(e){ e.preventDefault(); });
  });
  E.addEventListener('contextmenu',function(e){e.preventDefault();});
  go.addEventListener('click',function(){ finished=true; exit(); });
  skip.addEventListener('click',function(){ finished=true; exit(); });
})();
