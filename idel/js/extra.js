/* 이델 — 밤의 화실(문지르면 지운 얼굴) · 그녀가 본 당신(크로키 메모) · 도록 한 쪽(열두 색) */
(function(){
  if(window.IDEL_LOCKED) return;
  var D=window.IDEL||{}, S=window.IDEL_STATE||{n:0,pal:[],pig:function(){return null;}}, doc=document;
  var SITE=window.IDEL_SITE||{}, store=SITE.store||{get:function(k,d){return d;},set:function(){}};
  var toast=SITE.toast||function(){};
  function $(s){return doc.querySelector(s);}
  var reduce=!!S.reduce, TAU=Math.PI*2;
  var FL='"Marcellus",serif', FK='"Noto Serif KR",serif', FH='"Yeon Sung","Noto Serif KR",cursive', HS=.86, FS='"Mrs Saint Delafield",cursive';
  var INK='#24201D', INK2='#2E2925', MUTE='#5E554D', ROSE='#9E3A5C', GOLD='#C8AE6E';
  var esc=function(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});};
  function hash(t){var x=0x811c9dc5;for(var i=0;i<t.length;i++){x^=t.charCodeAt(i);x=Math.imul(x,16777619)>>>0;}return x;}
  function lcg(seed){var q=(seed%2147483646)+1;return function(){q=(q*16807)%2147483647;return q/2147483647;};}
  function nameOr(){var v=(store.get('name','')||'').trim();return v||'당신';}
  var now=new Date(), IMP='1127. '+(now.getMonth()+1)+'. '+now.getDate()+'.', dayKey=now.getFullYear()+'-'+(now.getMonth()+1)+'-'+now.getDate();
  function spaced(g,t,x,y,gap,align){var ch=Array.from(t),ws=ch.map(function(c){return g.measureText(c).width;}),tw=ws.reduce(function(a,b){return a+b;},0)+gap*(ch.length-1),cx=align==='center'?x-tw/2:align==='right'?x-tw:x;g.textAlign='left';ch.forEach(function(c,i){g.fillText(c,cx,y);cx+=ws[i]+gap;});}
  function fit(g,t,w,size,fam,max){var s=size;g.font=w+' '+s+'px '+fam;var m=g.measureText(t).width;if(m>max)s=Math.max(size*.5,s*max/m);g.font=w+' '+s+'px '+fam;}
  // 종이 결
  var grain=(function(){var c=doc.createElement('canvas');c.width=c.height=160;var g=c.getContext('2d'),d=g.createImageData(160,160),r=lcg(5);for(var i=0;i<d.data.length;i+=4){var v=r()*255;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=40;}g.putImageData(d,0,0);return c;})();
  function grainOn(g,w,h,a){g.save();g.globalCompositeOperation='multiply';g.globalAlpha=a;g.fillStyle=g.createPattern(grain,'repeat');g.fillRect(0,0,w,h);g.restore();}
  function saveCanvas(cv,file){
    var sheet=function(){var s=$('#ksheet');$('#ksheet-img').src=cv.toDataURL('image/png');s.hidden=false;doc.body.classList.add('locked');};
    if(/KAKAOTALK/i.test(navigator.userAgent)){sheet();return;}
    cv.toBlob(function(b){
      if(!b){sheet();return;}
      var a=doc.createElement('a');a.download=file;a.href=URL.createObjectURL(b);doc.body.appendChild(a);a.click();a.remove();
      setTimeout(function(){URL.revokeObjectURL(a.href);},4000);
    },'image/png');
  }
  var kx=$('#ksheet-x'); if(kx&&!kx.dataset.on){kx.dataset.on=1;kx.addEventListener('click',function(){$('#ksheet').hidden=true;$('#ksheet-img').removeAttribute('src');doc.body.classList.remove('locked');});}
  function busy(btn,fn){if(btn.disabled)return;var t=btn.textContent;btn.textContent='만드는 중…';btn.disabled=true;setTimeout(function(){try{fn();}finally{btn.textContent=t;btn.disabled=false;}},40);}
  function hand(g,t,x,y,size,col,rot){g.save();g.translate(x,y);g.rotate(rot||0);g.fillStyle=col||INK;g.font='400 '+Math.round(size*HS)+'px '+FH;g.textAlign='left';g.fillText(t,0,0);g.restore();}
  function line(g,x1,y1,x2,y2,r,w,a){g.lineWidth=w;g.globalAlpha=a;g.beginPath();g.moveTo(x1+(r()-.5)*3,y1+(r()-.5)*3);g.quadraticCurveTo((x1+x2)/2+(r()-.5)*5,(y1+y2)/2+(r()-.5)*5,x2+(r()-.5)*3,y2+(r()-.5)*3);g.stroke();g.globalAlpha=1;}
  function sheetPaper(g,W,H,seed){   // 스케치북에서 뜯은 장
    var r=lcg(seed);g.clearRect(0,0,W,H);g.fillStyle='#F8F4EB';g.beginPath();g.moveTo(0,22);
    for(var x=0;x<=W;x+=10)g.lineTo(x,14+r()*9);g.lineTo(W,H);g.lineTo(0,H);g.closePath();g.fill();
    g.save();g.clip();grainOn(g,W,H,.32);g.restore();
    g.save();g.globalCompositeOperation='destination-out';for(var hx=40;hx<W-20;hx+=38){g.beginPath();g.arc(hx,52,6.5,0,TAU);g.fill();}g.restore();
  }

  /* ───────── 밤의 화실: 손끝으로 문지르면 지운 자국이 올라온다 ───────── */
  function night(){
    var cv=$('#ntCanvas'); if(!cv)return;
    var g=cv.getContext('2d'), W=cv.width, H=cv.height, open=S.tod==='night', paper=$('#ntPaper');
    paper.classList.toggle('open',open);
    var lines=new Image(), rub=null, mask=doc.createElement('canvas'), tmp=doc.createElement('canvas'), done=false, raf=0;
    mask.width=tmp.width=W; mask.height=tmp.height=H; var mg=mask.getContext('2d'), tg=tmp.getContext('2d');
    function base(){
      g.clearRect(0,0,W,H);
      g.fillStyle=open?'#F3ECDF':'#F2EEE6'; g.fillRect(0,0,W,H);
      if(open){var gl=g.createRadialGradient(W*.12,H*.92,0,W*.12,H*.92,W*1.05);gl.addColorStop(0,'rgba(255,190,110,.26)');gl.addColorStop(1,'rgba(255,190,110,0)');g.fillStyle=gl;g.fillRect(0,0,W,H);}
      grainOn(g,W,H,.34);
      g.strokeStyle='rgba(36,32,29,.12)';g.lineWidth=2;g.strokeRect(1,1,W-2,H-2);
    }
    function buildRub(){
      var c=doc.createElement('canvas');c.width=W;c.height=H;var o=c.getContext('2d',{willReadFrequently:true});
      o.drawImage(lines,0,0,W,H);var d=o.getImageData(0,0,W,H),a=d.data,r=lcg(11);
      for(var i=0;i<a.length;i+=4){var L=a[i]/255,n=.8+r()*.4;a[i]=92;a[i+1]=82;a[i+2]=72;a[i+3]=Math.round(Math.max(0,Math.min(1,(1-L*1.05)*.68*n))*255);}
      o.putImageData(d,0,0);rub=c;
    }
    function draw(){
      raf=0; base(); if(!rub)return;
      tg.clearRect(0,0,W,H); tg.globalCompositeOperation='source-over'; tg.drawImage(rub,0,0); tg.globalCompositeOperation='destination-in'; tg.drawImage(mask,0,0);
      g.drawImage(tmp,0,0);
      if(done){g.save();g.globalAlpha=.92;hand(g,'또 웃게 그렸다. 지움.',W*.42,H*.93,58,INK,-.05);g.restore();}
    }
    function ask(){if(!raf)raf=requestAnimationFrame(draw);}
    function dab(x,y){var rr=58,gr=mg.createRadialGradient(x,y,0,x,y,rr);gr.addColorStop(0,'rgba(0,0,0,.2)');gr.addColorStop(1,'rgba(0,0,0,0)');mg.fillStyle=gr;mg.fillRect(x-rr,y-rr,rr*2,rr*2);}
    function cover(){var s=doc.createElement('canvas');s.width=45;s.height=56;var sg=s.getContext('2d');sg.drawImage(mask,0,0,45,56);var d=sg.getImageData(0,0,45,56).data,c=0,t=0;for(var y=6;y<56;y++)for(var x=12;x<45;x++){t++;if(d[(y*45+x)*4+3]>70)c++;}return c/t;}
    function reveal(){
      if(done)return; done=true; ask(); paper.classList.add('found');
      var seen=!!store.get('night',false); store.set('night',true);
      $('#ntHint').textContent='…보지 말라고 했어.'; $('#ntAuto').hidden=true;
      toast(seen?'또 왔어. 밤에는 오지 마.':'밤에는 오지 마.',3200);
    }
    function setText(){
      if(open){
        $('#ntHead').innerHTML='촛불 하나,<br><em>목탄 가루.</em>';
        $('#ntText').textContent='이젤 위 종이는 아침마다 깨끗하다. 그런데 손끝으로 문지르면, 지운 자국이 올라온다.';
        $('#ntHint').textContent=store.get('night',false)?'본 적 있다. 그래도 지운 자국은 밤마다 새로 생긴다.':'종이를 손가락으로 문질러 보기.';
        $('#ntTag').textContent=''; $('#ntAuto').hidden=false;
        cv.setAttribute('aria-label','지운 목탄 자국이 남은 종이. 문지르면 드러난다.');
      }
    }
    setText(); base();
    if(!open)return;
    lines.onload=function(){buildRub();ask();}; lines.src='assets/night.webp';
    var down=false,lx=0,ly=0,last=0;
    function pt(e){var b=cv.getBoundingClientRect();return [(e.clientX-b.left)*W/b.width,(e.clientY-b.top)*H/b.height];}
    cv.addEventListener('pointerdown',function(e){down=true;var p=pt(e);lx=p[0];ly=p[1];dab(lx,ly);ask();try{cv.setPointerCapture(e.pointerId);}catch(_){}});
    cv.addEventListener('pointermove',function(e){if(!down)return;var p=pt(e),dx=p[0]-lx,dy=p[1]-ly,d=Math.hypot(dx,dy),st=Math.max(1,Math.ceil(d/14));for(var i=1;i<=st;i++)dab(lx+dx*i/st,ly+dy*i/st);lx=p[0];ly=p[1];ask();var t=Date.now();if(t-last>350){last=t;if(cover()>.4)reveal();}});
    function up(){if(!down)return;down=false;if(cover()>.4)reveal();}
    cv.addEventListener('pointerup',up); cv.addEventListener('pointercancel',up);
    $('#ntAuto').addEventListener('click',function(){
      var steps=[],row=0; for(var y=70;y<H-40;y+=44,row++){var xs=[];for(var x=50;x<W-30;x+=22)xs.push([x,y+(x%44?6:-6)]);if(row%2)xs.reverse();steps=steps.concat(xs);}
      if(reduce){steps.forEach(function(p){dab(p[0],p[1]);dab(p[0],p[1]);});reveal();ask();return;}
      var i=0;(function go(){for(var k=0;k<14&&i<steps.length;k++,i++){dab(steps[i][0],steps[i][1]);dab(steps[i][0],steps[i][1]);}ask();if(i<steps.length)requestAnimationFrame(go);else reveal();})();
    });
  }

  /* ───────── 그녀가 본 당신: 질문 셋 → 크로키 메모 ───────── */
  var M=D.memo||{q:[],close:['']}, ans=store.get('memo',[null,null,null])||[null,null,null], shown=false, built=false;
  function memoUI(){
    if(built)return; built=true;
    $('#memoQ').innerHTML=M.q.map(function(q,i){
      return '<div class="kf"><span class="k">Q'+(i+1)+'<em>'+esc(q.k)+'</em></span><div class="seg" data-q="'+i+'">'+q.a.map(function(a,j){return '<button type="button" data-v="'+j+'"'+(ans[i]===j?' class="active"':'')+'>'+esc(a)+'</button>';}).join('')+'</div></div>';
    }).join('');
    $('#memoQ').addEventListener('click',function(e){
      var b=e.target.closest('[data-v]');if(!b)return;var q=+b.parentNode.getAttribute('data-q');ans[q]=+b.getAttribute('data-v');store.set('memo',ans);
      Array.prototype.forEach.call(b.parentNode.children,function(x){x.classList.toggle('active',x===b);});
      memoState(); if(shown)drawMemo();
    });
    $('#memo-go').addEventListener('click',function(){shown=true;drawMemo();memoState();if(!reduce)$('#memo-stage').classList.add('pop');toast('…보여 줄 생각은 없었어.',2400);});
    $('#memo-save').addEventListener('click',function(){var b=this;busy(b,function(){saveCanvas($('#memo-canvas'),'idel-croquis-'+Date.now()+'.png');});});
    if(ans.every(function(a){return a!==null;}))shown=true;
    memoState();
  }
  function memoState(){
    var ok=ans.every(function(a){return a!==null;});
    $('#memo-go').disabled=!ok; $('#memo-go').textContent=shown?'다시 그리기':'보여 주기';
    $('#memoNote').textContent=ok?(shown?'답을 바꾸면 메모도 바뀐다. 내일 다시 오면 마지막 줄이 달라진다.':'다 골랐다. 보여 달라고 해 볼 것.'):'셋 다 골라야 보여 준다.';
    $('#memo-save-row').hidden=!shown;
  }
  function seedOf(){return hash(nameOr()+'|'+ans.join(',')+'|'+dayKey);}
  function drawMemo(){
    var cv=$('#memo-canvas'); if(!cv)return; var g=cv.getContext('2d'), W=cv.width, H=cv.height;
    var full=shown&&ans.every(function(a){return a!==null;}), h=seedOf(), r=lcg(h||7);
    var deg=3+(h%11), right=((h>>>4)&1)===1, pg=(D.pigments||[])[(h>>>12)%12]||{name:'로 시에나',hex:'#B4773D'};
    var scorn=Math.max(62,Math.min(95,70+((h>>>16)%18)+(ans[2]===2?4:0)-(ans[2]===0?4:0)-(ans[0]===0?2:0)));
    sheetPaper(g,W,H,full?h:5);
    g.textBaseline='alphabetic'; g.fillStyle=MUTE; g.font='400 22px '+FL; spaced(g,'CROQUIS · No.313',92,128,6,'left'); spaced(g,IMP,988,128,3,'right');
    // 얼굴 짜임 선
    var cx=540, cy=452, rx=124, ry=164, a=(full?(right?1:-1)*deg:0)*Math.PI/180;
    g.save(); g.translate(cx,cy); g.rotate(a); g.strokeStyle='rgba(42,38,34,.9)'; g.lineCap='round';
    for(var p=0;p<2;p++){g.lineWidth=p?1.6:3;g.globalAlpha=p?.55:.8;g.beginPath();g.ellipse((r()-.5)*4,(r()-.5)*4,rx+(r()-.5)*5,ry+(r()-.5)*5,0,0,TAU);g.stroke();}
    g.globalAlpha=1;
    line(g,0,-ry-46,0,ry+30,r,2,.7);
    [[-36,.98],[2,1],[66,.86],[112,.66]].forEach(function(v){var y=v[0],w=rx*Math.sqrt(Math.max(0,1-(y*y)/(ry*ry)))*v[1]+18;line(g,-w,y,w,y,r,1.8,.62);});
    // 눈 자리 · 코 · 입 (점과 짧은 선만)
    [-1,1].forEach(function(sd){line(g,sd*62-26,2,sd*62+26,2,r,3,.75);});
    line(g,-10,66,10,70,r,2.2,.6); line(g,-30,112,30,112,r,2.4,.7);
    // 목 · 어깨
    line(g,-54,ry-8,-62,ry+118,r,2.4,.7); line(g,54,ry-8,62,ry+118,r,2.4,.7);
    g.lineWidth=2.6;g.globalAlpha=.7;g.beginPath();g.moveTo(-300,ry+176);g.quadraticCurveTo(-120,ry+108,-62,ry+118);g.moveTo(300,ry+176);g.quadraticCurveTo(120,ry+108,62,ry+118);g.stroke();g.globalAlpha=1;
    // 그늘 빗금
    if(full){
      g.save(); g.beginPath(); g.ellipse(0,0,rx,ry,0,0,TAU); g.clip(); g.lineWidth=1.4; g.globalAlpha=ans[0]===2?.5:.32;
      var sx=ans[0]===1?-rx:(right?-rx*1.05:rx*.25), ex=ans[0]===1?rx:(right?-rx*.25:rx*1.05), y0=ans[0]===1?-ry:-ry, y1=ans[0]===1?-ry*.2:ry;
      if(ans[0]===2){sx=-rx;ex=rx;y0=-ry;y1=ry;}
      for(var hy=y0;hy<y1;hy+=ans[0]===2?11:15){g.beginPath();g.moveTo(sx,hy);g.lineTo(ex,hy+(ex-sx)*.45);g.stroke();}
      g.restore();
    }
    g.restore();
    if(full){
      g.save(); g.strokeStyle='rgba(158,58,92,.75)'; g.lineWidth=2.2; g.setLineDash([7,8]); g.beginPath(); g.moveTo(cx,cy-ry-96); g.lineTo(cx,cy-ry+20); g.stroke(); g.setLineDash([]);
      g.lineWidth=2.6; g.beginPath(); g.arc(cx,cy,ry+70,-Math.PI/2,-Math.PI/2+a,a<0); g.stroke(); g.restore();
      hand(g,deg+'°',cx+(right?150:-230),cy-ry-40,58,ROSE,0);
    }
    // 메모
    var y=842, LH=64;
    if(full){
      var notes=['고개 '+deg+'°. '+(right?'오른쪽':'왼쪽')+'이 낫다.'];
      M.q.forEach(function(q,i){notes.push(q.n[ans[i]]);});
      notes.push(M.close[(h>>>8)%M.close.length]);
      notes.forEach(function(t,i){hand(g,t,96,y+i*LH,52,INK,(r()-.5)*.02);});
      var sy=y+notes.length*LH; hand(g,'경멸 '+scorn+'%.',96,sy,54,INK,-.01);
      g.save();g.strokeStyle='rgba(158,58,92,.8)';g.lineWidth=2.4;g.beginPath();g.moveTo(96,sy+12);g.quadraticCurveTo(220,sy+6,330,sy+13);g.moveTo(100,sy+22);g.quadraticCurveTo(220,sy+17,322,sy+24);g.stroke();g.restore();
      // 어울리는 안료
      g.fillStyle=pg.hex; g.beginPath(); g.ellipse(612,sy-14,28,20,-.2,0,TAU); g.fill(); g.strokeStyle='rgba(36,32,29,.22)'; g.lineWidth=1.5; g.stroke();
      g.fillStyle=MUTE; g.font='400 22px '+FL; g.textAlign='left'; g.fillText('PIGMENT',656,sy-24); g.fillStyle=INK2; g.font='700 26px '+FK; g.fillText(pg.name,656,sy+6);
    } else {
      g.fillStyle='rgba(94,85,77,.55)'; g.font='400 40px '+FH; g.textAlign='left';
      g.fillText('세 가지를 고르면,',96,y+LH); g.fillText('여기에 적힌다.',96,y+LH*2);
      for(var k=0;k<5;k++){g.fillStyle='rgba(36,32,29,.1)';g.fillRect(96,y+LH*(k+1)+16,880,1.5);}
    }
    g.fillStyle=INK; g.font='96px '+FS; g.textAlign='right'; g.fillText('Idel',968,1298);
    g.fillStyle=GOLD; [0,14].forEach(function(dx){g.beginPath();g.arc(978+dx,1236,4,0,TAU);g.fill();});
  }

  /* ───────── 도록 한 쪽: 회차마다 고른 열두 색 ───────── */
  function daub(g,cx,cy,w,h,col,seed,empty){
    var r=lcg(seed); g.save(); g.translate(cx,cy); g.rotate((r()-.5)*.14);
    var top=[],bot=[],n=16;
    for(var i=0;i<=n;i++){var t=i/n,x=-w/2+w*t,env=Math.pow(Math.sin(Math.min(1,t*1.15)*Math.PI*.5+.15),.6)*(t>.82?1-(t-.82)*2.2:1);top.push([x,-h/2*env+(r()-.5)*5]);bot.push([x,h/2*env+(r()-.5)*5]);}
    g.beginPath(); top.forEach(function(p,i){i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]);}); for(var j=bot.length-1;j>=0;j--)g.lineTo(bot[j][0],bot[j][1]); g.closePath();
    if(empty){g.setLineDash([6,7]);g.strokeStyle='rgba(36,32,29,.28)';g.lineWidth=2;g.stroke();g.restore();return;}
    g.fillStyle=col; g.fill(); g.save(); g.clip();
    for(var k=0;k<18;k++){var yy=(r()-.5)*h*.9;g.strokeStyle=k%2?'rgba(255,255,255,.2)':'rgba(0,0,0,.14)';g.lineWidth=1+r()*2.4;g.beginPath();g.moveTo(-w/2+r()*16,yy);g.lineTo(w/2-r()*24,yy+(r()-.5)*5);g.stroke();}
    g.restore();
    for(var s=0;s<6;s++){var yy2=(r()-.5)*h*.5;g.strokeStyle=col;g.globalAlpha=.55;g.lineWidth=1.2+r()*1.6;g.beginPath();g.moveTo(w*.34,yy2);g.lineTo(w*.5+r()*26,yy2+(r()-.5)*6);g.stroke();}
    g.restore();
  }
  function drawCat(){
    var cv=$('#cat-canvas'); if(!cv)return; var g=cv.getContext('2d'), W=cv.width, H=cv.height, n=S.n||0, nm=nameOr(), PG=D.pigments||[];
    g.fillStyle='#FBF9F4'; g.fillRect(0,0,W,H); grainOn(g,W,H,.16);
    g.textBaseline='alphabetic'; g.fillStyle=MUTE; g.font='400 22px '+FL; spaced(g,'CATALOGUE RAISONNÉ · IDEL',90,112,5,'left'); g.fillStyle=ROSE; spaced(g,'PLATE 313',990,112,5,'right');
    g.fillStyle='rgba(36,32,29,.28)'; g.fillRect(90,138,900,1.5);
    // 도판: 캔버스 위 열두 색
    var px=90,py=170,pw=900,ph=620; g.fillStyle='#EFE8DA'; g.fillRect(px,py,pw,ph); grainOn(g,W,H,0);
    g.save(); g.beginPath(); g.rect(px,py,pw,ph); g.clip(); g.globalAlpha=.07; g.strokeStyle='#5E554D'; g.lineWidth=1;
    for(var x=px;x<px+pw;x+=6){g.beginPath();g.moveTo(x,py);g.lineTo(x,py+ph);g.stroke();} for(var yy=py;yy<py+ph;yy+=6){g.beginPath();g.moveTo(px,yy);g.lineTo(px+pw,yy);g.stroke();}
    g.restore(); g.strokeStyle='rgba(36,32,29,.18)'; g.lineWidth=1.5; g.strokeRect(px+.75,py+.75,pw-1.5,ph-1.5);
    var cw=pw/4, chh=ph/3;
    for(var i=0;i<12;i++){
      var c=i%4, rw=Math.floor(i/4), cx=px+cw*c+cw/2, cy=py+chh*rw+chh*.42, it=S.pal[i], pg=it&&S.pig(it.id);
      daub(g,cx,cy,cw*.7,chh*.34,pg?pg.hex:'#000',hash('d'+i+(pg?pg.id:'')),!pg);
      g.textAlign='center'; g.fillStyle=pg?ROSE:'rgba(94,85,77,.6)'; g.font='400 16px '+FL; spaced(g,'No.'+(i<9?'0':'')+(i+1)+(it&&it.d?' · '+it.d:''),cx,cy+chh*.34,2,'center');
      g.fillStyle=pg?INK:'rgba(94,85,77,.5)'; g.font=(pg?'700 ':'400 ')+'21px '+FK; g.textAlign='center'; g.fillText(pg?pg.name:(i<n?'고르지 않음':'—'),cx,cy+chh*.34+30);
    }
    var done=n>=12;
    g.textAlign='left'; g.fillStyle=INK; fit(g,'「'+nm+'의 초상」','900',58,FK,900); g.fillText('「'+nm+'의 초상」',86,890);
    g.fillStyle=INK2; g.font='400 26px '+FK;
    g.fillText('궁정화가 이델 · 제국력 1127',90,946); g.fillText('캔버스에 유채 · 61 × 46 cm',90,988);
    g.fillText(done?'열두 번 앉음 · '+nm+' 가문 소장':n+' / 12 회차 · 아직 마르지 않음',90,1030);
    if(done) hand(g,'끝났어. 이제 움직여도 돼.',92,1180,66,INK,-.04);
    else hand(g,'아직이야. 움직이지 마.',92,1170,56,'rgba(46,41,37,.7)',-.03);
    g.fillStyle=INK; g.font='110px '+FS; g.textAlign='right'; g.fillText('Idel',972,1296);
    g.fillStyle=GOLD; [0,15].forEach(function(dx){g.beginPath();g.arc(982+dx,1226,4.5,0,TAU);g.fill();});
    // 화면 옆 칸
    var pal=$('#catPal'); if(pal){pal.innerHTML=''; for(var k=0;k<12;k++){var q=S.pal[k]&&S.pig(S.pal[k].id),el=doc.createElement('i');if(q){el.style.background=q.hex;el.title=q.name;}else el.className='empty';pal.appendChild(el);}}
    var note=$('#catNote'); if(note) note.textContent=done?'열두 번이 끝났다. 도록 한 쪽을 가져갈 수 있다.':(n+' / 12 회차 · 열두 번째 회차 뒤에 저장할 수 있다.');
    var sb=$('#cat-save'); if(sb){sb.disabled=!done; sb.textContent=done?'도록 한 쪽 저장하기':'열두 번째 회차 뒤에';}
  }
  var catBound=false;
  function page2(){
    memoUI(); drawMemo(); drawCat();
    if(!catBound){catBound=true;$('#cat-save').addEventListener('click',function(){if((S.n||0)<12)return;var b=this;busy(b,function(){saveCanvas($('#cat-canvas'),'idel-catalogue-'+Date.now()+'.png');});});}
    if(doc.fonts&&doc.fonts.ready)doc.fonts.ready.then(function(){drawMemo();drawCat();});
  }
  window.IDEL_EXTRA={page2:page2, redraw:function(){if(built){drawMemo();drawCat();}}, cat:function(){if(built)drawCat();}};
  night();
})();
