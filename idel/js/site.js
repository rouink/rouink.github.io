/* 이델 — 사이트 본문: 회차 · 규칙 · 스케치북 · 덮어 둔 캔버스 · 빛 두 점 · 그녀의 기록 · 소리 */
(function(){
  if(window.IDEL_LOCKED) return;
  var D=window.IDEL||{};
  var doc=document, html=doc.documentElement, body=doc.body;
  function $(s,r){return (r||doc).querySelector(s);}
  function $$(s,r){return Array.prototype.slice.call((r||doc).querySelectorAll(s));}
  var qs; try{qs=new URLSearchParams(location.search);}catch(e){qs={has:function(){return false},get:function(){return null}};}
  var preview=qs.has('visit');
  var store={
    get:function(k,d){try{var v=localStorage.getItem('idel.'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
    set:function(k,v){if(preview&&(k==='n'||k==='last'))return;try{localStorage.setItem('idel.'+k,JSON.stringify(v));}catch(e){}}
  };
  if(qs.has('reset')){try{['n','last','dots','cloth','name','hintCloth','snd'].forEach(function(k){localStorage.removeItem('idel.'+k);});sessionStorage.removeItem('idel.in');}catch(e){}}
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 시간 — 해 질 녘(17~19시)만 앉는 시간 */
  var hour=qs.has('hour')?(+qs.get('hour')||0):new Date().getHours();
  var tod=(hour>=17&&hour<19)?'dusk':((hour>=19||hour<5)?'night':'day');
  html.classList.add('t-'+tod);

  var now=new Date();
  var today=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
  var S={n:+store.get('n',0)||0,last:store.get('last',''),today:today,tod:tod,reduce:reduce};
  if(preview){S.n=Math.max(0,Math.min(12,+qs.get('visit')||0));S.last=qs.has('sat')?today:'';}
  S.n=Math.max(0,Math.min(12,S.n));
  Object.defineProperty(S,'satToday',{get:function(){return S.last===S.today;}});
  window.IDEL_STATE=S;

  body.classList.add('pre');
  var esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  var pad=function(x){return (x<10?'0':'')+x;};
  var ORD=['','첫','두','세','네','다섯','여섯','일곱','여덟','아홉','열','열한','열두'];

  /* 말풍선 */
  var toastEl=$('#toast'),toastT;
  function toast(msg,ms){
    if(!toastEl)return; toastEl.textContent=msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT=setTimeout(function(){toastEl.classList.remove('show');},ms||2600);
  }

  /* 이름 */
  var nm=$('#nm');
  function name(){var v=(store.get('name','')||'').trim();return v;}
  if(nm){
    nm.value=name();
    var nmT;
    nm.addEventListener('input',function(){clearTimeout(nmT);nmT=setTimeout(function(){store.set('name',nm.value.trim().slice(0,12));renderSittings();},300);});
    nm.addEventListener('keydown',function(e){if(e.key==='Enter'){nm.blur();}});
  }

  /* ── 그리기 ── */
  function render(){
    var n=S.n,left=12-n;
    $('#sitNo').textContent=pad(Math.max(1,n));
    $('#heroNum').textContent=left;
    $('#stLeft').textContent=left;
    $('#stScorn').textContent=(85-n*5)+'%';
    if(tod==='dusk'){$('#stTime').textContent='지금';$('#stTimeL').textContent='앉는 시간';}
    else{$('#stTime').textContent='17:00';$('#stTimeL').textContent='해 질 녘 두 시간';}
    $('#clock').textContent=tod==='dusk'?'해 질 녘 · 앉는 시간':(tod==='day'?'한낮 · 해 질 녘에 앉는다':'밤 · 화실 닫힘');
    // 자세
    var p=n<=4?0:(n<=8?1:2), names=['붓 꼬리','장갑 낀 손','맨손'];
    $$('#pose li').forEach(function(li,i){li.classList.toggle('on',i===p);li.classList.toggle('done',i<p);});
    $('#poseNote').textContent='회차가 쌓일 때만 한 칸씩 옮겨 간다. 지금은 '+names[p]+'.';
    renderSittings(); renderCloth(); renderDots(); renderGallery();
    var cb=$('#crackBtn'); if(cb&&D.crack){cb.href=D.crack;cb.hidden=false;}
  }

  function renderSittings(){
    var n=S.n, L=D.sittings||[];
    $('#sitHead').innerHTML= n===0?'열두 번 중<br><em>아직 한 번도.</em>':(n>=12?'열두 번,<br><em>끝.</em>':'열두 번 중<br><em>'+ORD[n]+' 번째.</em>');
    var bar=''; for(var i=0;i<12;i++) bar+='<i'+(i<n?' class="on"':'')+'></i>';
    $('#sitBar').innerHTML=bar;
    var msg;
    if(n>=12) msg='열두 번이 모두 끝났다. 마른 그림은 혼담 상대의 집으로 간다.';
    else if(n===0) msg='다시 들어올 때 입장 화면에서 길게 눌러 앉으면, 첫 회차가 기록된다.';
    else if(S.satToday) msg='오늘 회차는 끝났다. 다시 오는 날, 다음 회차가 열린다.';
    else msg='오늘은 아직 앉지 않았다. 다시 들어올 때 앉으면 다음 회차가 열린다.';
    $('#sitMsg').textContent=msg;
    var nmv=name()||'당신', out='', cut=Math.max(0,n-3);
    if(cut>0) out+='<button type="button" class="sit-more" id="sitMore">지난 회차 '+cut+'개 펼치기</button>';
    for(var k=0;k<n&&k<L.length;k++){
      var s=L[k], today=(k===n-1&&S.satToday);
      out+='<article class="sit rv in'+(today?' today':'')+(k<cut?' old':'')+'">'+
        '<div class="sit-ph"><img src="assets/t/'+s.img+'.jpg" alt="'+esc(s.stage)+' 회차의 이델" loading="lazy"></div>'+
        '<div class="sit-meta"><span class="sit-no">No.'+pad(k+1)+' · 1127. '+esc(s.d)+' ('+esc(s.w)+')</span><span class="sit-stage">'+esc(s.stage)+'</span></div>'+
        '<p class="body">'+esc(s.text)+'</p>'+
        '<p class="hand">'+esc(s.note.replace('{name}',nmv))+'</p></article>';
    }
    if(n<12&&L[n]){
      var nx=L[n];
      out+='<article class="sit lock rv in"><div class="sit-ph"><img src="assets/t/'+nx.img+'.jpg" alt="" loading="lazy"></div>'+
        '<div class="sit-meta"><span class="sit-no">No.'+pad(n+1)+' · 1127. '+esc(nx.d)+' ('+esc(nx.w)+')</span><span class="sit-stage">아직 마르지 않음</span></div>'+
        '<p class="body sm">'+(S.satToday||n===0?'다시 오는 날 앉으면 이 회차가 열리고, 캔버스가 한 단계 마른다.':'다시 들어와 앉으면 이 회차가 열린다.')+'</p></article>';
    }
    var sl=$('#sitList'); sl.innerHTML=out;
    var mb=$('#sitMore'); if(mb)mb.addEventListener('click',function(){sl.classList.add('all');});
  }

  /* 덮어 둔 캔버스 — 다섯 번째 회차부터 */
  var clothAsk=false;
  function renderCloth(){
    var open=!!store.get('cloth',false), can=S.n>=5;
    var fig=$('#cloth'), btn=$('#clothBtn'), txt=$('#clothText');
    fig.classList.toggle('open',open);
    $('#clothTag').textContent=open?'':(can?'COVERED':'COVERED · 다섯 번째 회차 뒤');
    if(open){btn.hidden=true;txt.textContent='밤마다 그리고, 아침마다 지운다. 회차가 줄수록 붓이 느려지는 이유를 그녀는 말하지 않는다.';fig.querySelector('img').alt='밤에 그린 얼굴을 혼자 지우는 이델';}
    else if(can){btn.disabled=false;btn.textContent=clothAsk?'그래도 들추기':'천 들추기';}
    else{btn.disabled=true;btn.textContent='천 들추기 — 다섯 번째 회차 뒤에';}
  }
  $('#clothBtn').addEventListener('click',function(){
    if(S.n<5)return;
    if(!clothAsk){clothAsk=true;toast('보지 마.');renderCloth();return;}
    store.set('cloth',true); renderCloth(); renderGallery(); toast('…봤으면 됐어. 덮어.');
  });

  /* 빛 두 점 */
  function renderDots(){
    var f=store.get('dots',[])||[];
    $$('.spark').forEach(function(b){b.classList.toggle('found',f.indexOf(b.getAttribute('data-dot'))>-1);});
    var sec=$('#s7'), both=f.length>=2;
    if(both&&sec.hidden){sec.hidden=false;}
  }
  $$('.spark').forEach(function(b){
    b.addEventListener('click',function(){
      var id=b.getAttribute('data-dot'), f=store.get('dots',[])||[];
      if(f.indexOf(id)>-1){toast('빛 한 점.');return;}
      f.push(id); store.set('dots',f); b.classList.add('found');
      if(f.length>=2){
        toast('두 점. 그녀의 버릇이다.',3200);
        var sec=$('#s7'); sec.hidden=false; if(!reduce)sec.classList.add('appear');
        renderGallery();
        setTimeout(function(){sec.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});},900);
      } else toast('빛 한 점. …하나 더 있다.');
    });
  });

  /* 스케치북 */
  var shown=[];
  function unlocked(it){
    if(it.lock==='cloth') return !!store.get('cloth',false);
    if(it.lock==='dots') return (store.get('dots',[])||[]).length>=2;
    return true;
  }
  function renderGallery(){
    var G=D.gallery||[], out='', c=0; shown=[];
    G.forEach(function(it){
      var ok=unlocked(it); if(ok){c++;shown.push(it);}
      out+='<button type="button" class="g'+(ok?'':' locked')+'" data-k="'+it.k+'"'+(ok?' aria-label="'+esc(it.cap)+' — 크게 보기"':' aria-label="아직 열리지 않은 장면"')+'>'+
        '<img src="assets/t/'+it.k+'.jpg" alt="" loading="lazy"><span class="gn">'+(ok?'No.'+it.k:'No.'+it.k+' · ?')+'</span></button>';
    });
    $('#gal').innerHTML=out; $('#galCount').textContent=c+' / '+G.length;
  }
  $('#gal').addEventListener('click',function(e){
    var b=e.target.closest('.g'); if(!b)return;
    var k=b.getAttribute('data-k'), it=(D.gallery||[]).filter(function(x){return x.k===k;})[0];
    if(!unlocked(it)){toast(it.lock==='cloth'?'천 아래에 있다.':'빛 두 점을 찾으면.');return;}
    openLb(shown.indexOf(it));
  });

  /* 덮개 창 — 뒤로 가기로도 닫힘 */
  var openOv=null;
  function showOv(el){
    el.hidden=false; openOv=el; body.style.overflow='hidden';
    requestAnimationFrame(function(){requestAnimationFrame(function(){el.classList.add('show');});});
    try{history.pushState({ov:el.id},'');}catch(e){}
    var x=el.querySelector('.ov-x'); if(x)setTimeout(function(){x.focus({preventScroll:true});},60);
  }
  function hideOv(fromPop){
    var el=openOv; if(!el)return; openOv=null;
    el.classList.remove('show'); body.style.overflow='';
    setTimeout(function(){el.hidden=true;},reduce?0:460);
    stopTheme();
    if(!fromPop){try{if(history.state&&history.state.ov)history.back();}catch(e){}}
  }
  window.addEventListener('popstate',function(){if(openOv)hideOv(true);});
  doc.addEventListener('keydown',function(e){
    if(!openOv)return;
    if(e.key==='Escape'){hideOv();return;}
    if(openOv.id==='lb'){if(e.key==='ArrowLeft')stepLb(-1);if(e.key==='ArrowRight')stepLb(1);}
  });
  $$('.ov').forEach(function(o){
    o.addEventListener('click',function(e){if(e.target===o||e.target.closest('.ov-x'))hideOv();});
  });

  var lbI=0, lbImg=$('#lbImg'), lbCap=$('#lbCap');
  function setLb(){
    var it=shown[lbI]; if(!it)return;
    lbImg.style.opacity=0;
    var im=new Image(); im.onload=function(){lbImg.src=im.src;lbImg.alt=it.cap;lbImg.style.opacity=1;}; im.src='assets/g/'+it.k+'.jpg';
    lbCap.innerHTML='<span class="lb">No.'+it.k+'</span>'+esc(it.cap);
  }
  function openLb(i){lbI=Math.max(0,i);setLb();if(!openOv)showOv($('#lb'));}
  function stepLb(d){if(!shown.length)return;lbI=(lbI+d+shown.length)%shown.length;setLb();}
  $('#lb .prev').addEventListener('click',function(e){e.stopPropagation();stepLb(-1);});
  $('#lb .next').addEventListener('click',function(e){e.stopPropagation();stepLb(1);});
  (function(){var x0=null,y0=0;var f=$('#lb .lb-fig');
    f.addEventListener('pointerdown',function(e){x0=e.clientX;y0=e.clientY;});
    f.addEventListener('pointerup',function(e){if(x0==null)return;var dx=e.clientX-x0,dy=e.clientY-y0;x0=null;if(Math.abs(dx)>48&&Math.abs(dx)>Math.abs(dy))stepLb(dx<0?1:-1);});
  })();

  /* 그녀의 기록 */
  var recTab='bag';
  function renderRec(){
    var b=$('#recBody'), h='';
    if(recTab==='bag'){
      h='<div class="bag">'+(D.items||[]).map(function(it,i){
        return '<div class="it"><div class="it-img" hidden><img alt="'+esc(it.title)+'" data-src="'+esc(it.img)+'"></div>'+
          '<div class="it-t"><span class="lb">No.0'+(i+1)+'</span><b>'+esc(it.title)+'</b><p>'+esc(it.desc)+'</p></div></div>';
      }).join('')+'</div>';
    } else if(recTab==='tmi'){
      h='<dl class="tmi">'+(D.tmi||[]).map(function(t){return '<div><dt>'+esc(t.q)+'</dt><dd>'+esc(t.a)+'</dd></div>';}).join('')+'</dl>';
    } else {
      h='<ol class="story">'+(D.story||[]).map(function(p){return '<li><p style="margin:0">'+esc(p)+'</p></li>';}).join('')+'</ol>';
    }
    b.innerHTML=h; b.scrollTop=0;
    $$('.it-img img',b).forEach(function(im){
      var t=new Image(); t.onload=function(){im.src=t.src;im.parentNode.hidden=false;}; t.src=im.getAttribute('data-src');
    });
    $$('.rec-tabs button').forEach(function(x){x.setAttribute('aria-selected',x.getAttribute('data-t')===recTab?'true':'false');});
  }
  $$('.rec-tabs button').forEach(function(x){x.addEventListener('click',function(){recTab=x.getAttribute('data-t');renderRec();});});
  $('#openRecord').addEventListener('click',function(){recTab='bag';renderRec();showOv($('#rec'));});
  (function(){ // 휴대폰: 머리를 끌어내리면 닫힘
    var h=$('#rec .rec-head'), sh=$('#rec .rec-sheet'), y0=null, dy=0;
    function start(e){if(innerWidth>=960)return;y0=e.clientY;dy=0;sh.style.transition='none';}
    function move(e){if(y0==null)return;dy=Math.max(0,e.clientY-y0);sh.style.transform='translateY('+dy+'px)';}
    function end(){if(y0==null)return;y0=null;sh.style.transition='';sh.style.transform='';if(dy>90)hideOv();}
    [h,$('#rec .rec-grab')].forEach(function(el){el.addEventListener('pointerdown',start);});
    window.addEventListener('pointermove',move); window.addEventListener('pointerup',end); window.addEventListener('pointercancel',end);
  })();

  /* 소리 — 곡 파일이 있을 때만 단추가 보인다 */
  var M=D.music||{}, bgm=$('#bgm'), th=$('#themeA'), snd=$('#snd'), hasMain=false, hasTheme=false, playing=false, themeOn=false;
  function exists(u){return fetch(u,{method:'HEAD',cache:'no-store'}).then(function(r){return r.ok;}).catch(function(){return false;});}
  function meta(title){try{if('mediaSession' in navigator&&window.MediaMetadata){navigator.mediaSession.metadata=new MediaMetadata({title:title||'IDEL',artist:'이델',album:'북탑 화실',artwork:[{src:'assets/og.jpg',sizes:'1200x630',type:'image/jpeg'}]});}}catch(e){}}
  function setSnd(on){playing=on;snd.setAttribute('aria-pressed',on?'true':'false');snd.textContent=on?'SOUND · ON':'SOUND · OFF';}
  function startMusic(){
    if(!hasMain)return;
    if(!bgm.src)bgm.src=M.main; bgm.volume=.55;
    var p=bgm.play(); if(p&&p.then)p.then(function(){setSnd(true);meta(M.mainTitle);}).catch(function(){setSnd(false);}); else setSnd(true);
    store.set('snd',true);
  }
  function stopMusic(){bgm.pause();setSnd(false);store.set('snd',false);}
  snd.addEventListener('click',function(){playing?stopMusic():startMusic();});
  function stopTheme(){if(themeOn){th.pause();themeOn=false;$('#recThemeS').textContent='듣기';if(playing){bgm.play().catch(function(){});meta(M.mainTitle);}}}
  $('#recTheme').addEventListener('click',function(){
    if(themeOn){stopTheme();return;}
    if(!th.src)th.src=M.theme; th.volume=.6; bgm.pause();
    th.play().then(function(){themeOn=true;$('#recThemeS').textContent='멈추기';meta(M.themeTitle);}).catch(function(){});
  });
  th.addEventListener('ended',stopTheme);
  var musicReady=Promise.all([M.main?exists(M.main):false,M.theme?exists(M.theme):false]).then(function(r){
    hasMain=!!r[0]; hasTheme=!!r[1];
    if(hasMain){snd.hidden=false;}
    if(hasTheme){var b=$('#recTheme');b.hidden=false;$('#recThemeT').textContent=M.themeTitle||'그녀의 테마';}
    return hasMain;
  });

  /* 머리띠 · 나타나기 · 자리 비움 */
  var top=$('#top');
  function onScroll(){top.classList.toggle('solid',(window.scrollY||0)>40);}
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();
  var io=null;
  function observe(){
    if(reduce||!('IntersectionObserver' in window)){$$('.rv').forEach(function(x){x.classList.add('in');});return;}
    io=io||new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -8% 0px',threshold:.08});
    $$('.rv:not(.in)').forEach(function(x){io.observe(x);});
  }
  var title0=doc.title, entered=false;
  doc.addEventListener('visibilitychange',function(){
    if(!entered)return;
    if(doc.hidden)doc.title='움직이지 마.'; else setTimeout(function(){doc.title=title0;},900);
  });

  function onEntered(){
    if(entered)return; entered=true;
    body.classList.remove('pre'); requestAnimationFrame(function(){body.classList.add('in');});
    observe();
    if(S.n>=5&&!store.get('cloth',false)&&!store.get('hintCloth',false)){store.set('hintCloth',true);setTimeout(function(){toast('이젤 옆 천이 조금 들려 있다.',3000);},2200);}
  }

  render();
  window.IDEL_SITE={
    sit:function(){ if(!S.satToday&&S.n<12){S.n++;} S.last=S.today; store.set('n',S.n); store.set('last',S.today); render(); },
    entered:onEntered, toast:toast, startMusic:startMusic, musicReady:musicReady, render:render
  };
})();
