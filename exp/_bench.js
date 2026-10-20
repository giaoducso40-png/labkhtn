/* LabKHTN · BÀN HÓA HỌC LẮP GHÉP (dùng với LabKit.scene3D + LabChem3D)
   Dựng nhanh giá ống nghiệm, cốc, đèn cồn; các hiệu ứng có thật của phản ứng: đổi màu dung dịch, sủi bọt khí, kết tủa lắng,
   chất rắn tan dần, khói/hơi, nhỏ giọt bằng ống hút, rắc chất rắn, nhúng giấy chỉ thị, thử khí bằng que đóm (cháy / còn tàn đỏ).
   Mọi hiệu ứng chạy theo thời gian mô phỏng (dừng khi tạm dừng, nhanh khi tua). */
(function(){
"use strict";
if(window.LabBench) return;
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,H=G.hex;
const mixc=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*C.clamp(t,0,1));
const col=c=>typeof c==="string"?H(c):c;
const WOOD={color:"#9C6B3F",rough:.55,key:"wood"};

function create(K,o){o=o||{};const R=K.R,root=K.root,rnd=K.rnd;
  const fizz=root.add(K3.bubbles(R,1600)),smoke=root.add(K3.puffs(R,160,"#F2F4F8")),steam=root.add(K3.puffs(R,80,"#FFFFFF")),
    sparks=root.add(K3.puffs(R,60,"#FFD27A",true));
  const vessels=[],acts=[];
  const BN={vessels,fizz,smoke,steam,sparks};

  /* ---------- giá ống nghiệm ---------- */
  BN.rack=function(x,z,n,gap){gap=gap||.32;const w=n*gap+.12;const r=root.add(new G.Node());r.pos=[x,0,z];
    r.add(R.mesh(G.box(w,.05,.4,.02,2),WOOD)).pos=[0,.025,0];r.add(R.mesh(G.box(w,.05,.4,.02,2),WOOD)).pos=[0,.32,0];
    for(const sx of [-w/2+.025,w/2-.025])r.add(R.mesh(G.box(.05,.32,.4,.012,2),WOOD)).pos=[sx,.17,0];return r};
  /* ---------- bình chứa: ống nghiệm (tube) hoặc cốc (beaker) ----------
     o: {kind:"tube"|"beaker", x,z, r,h, sol:{col,a,level}, label} */
  BN.vessel=function(v){v=Object.assign({kind:"tube",x:0,z:0},v);const isT=v.kind==="tube";
    const r=v.r||(isT?.12:.3),h=v.h||(isT?1.05:.6);const y0=v.y!=null?v.y:(isT?.05:0);
    const n=root.add(new G.Node());n.pos=[v.x,y0,v.z];n.add(isT?K3.testTube(R,r,h):K3.glass(R,r,h,{lip:.02}));if(!isT&&h/r>3.5){/* ống đong: chân đế rộng bằng thủy tinh */n.add(R.mesh(G.cylinder(r*1.75,.022,6),{type:"glass",color:"#E0F2FE",alpha:.5}))}
    const inner=isT?r-.013:r-.028,yb=isT?.013:.03;
    const sol=Object.assign({col:"#E3EEF9",a:.44,level:isT?.42:.38},v.sol||{});
    const T={id:v.id,kind:v.kind,n,r,h,x:v.x,z:v.z,y0,inner,yb,isT,
      level:sol.level==null?(isT?.42:.38):sol.level,col:col(sol.col||"#E8F2FB"),a:sol.a==null?.38:sol.a,
      tgt:null,lvlTgt:null,fizzRate:0,fizzSize:1,fizzSpread:null,pptCol:null,ppt:0,pptTgt:0,turb:0,turbTgt:0,turbCol:H("#F5F5F0"),solids:[],heat:false,temp:25,smoke:0,steamOn:false,stopper:false,data:{}};
    const lgeom=lv=>K3.liquidGeom(inner,yb,Math.max(yb+.005,lv),isT);
    T.liq=n.add(R.mesh(lgeom(1),{color:T.col,alpha:T.a,rough:.04,coat:.6,order:1}));T.liq.scl=[1,(T.level-yb)/(1-yb),1];T.liq.pos=[0,yb*(1-T.liq.scl[1]),0];
    T.liq.visible=T.level>yb+.004;
    /* lớp kết tủa lắng ở đáy */
    T.pptM=n.add(R.mesh(K3.liquidGeom(inner*.97,yb,yb+.12,isT),{color:"#F5F5F0",rough:.9,alpha:.96,order:1}));T.pptM.visible=false;
    T.top=()=>y0+T.level;T.mouth=()=>[v.x,y0+h+.02,v.z];
    T.setColor=(c,a,dur)=>{T.tgt={from:T.col.slice(),fa:T.a,to:col(c),ta:a==null?T.a:a,t:0,dur:dur||1.2}};
    T.setLevel=(l,dur)=>{T.lvlTgt={from:T.level,to:l,t:0,dur:dur||1}};
    T.fizz=(rate,size,spread)=>{T.fizzRate=rate||0;T.fizzSize=size||1;T.fizzSpread=spread==null?null:spread};
    T.precip=(c,amt,dur)=>{T.pptCol=col(c);T.pptM.mat.color=T.pptCol;T.pptTgt=C.clamp(amt==null?1:amt,0,1);T.pptDur=dur||3;T.turbCol=col(c);T.turbTgt=Math.max(T.turbTgt,.7*T.pptTgt)};
    T.cloud=(c,amt)=>{T.turbCol=col(c);T.turbTgt=C.clamp(amt,0,1)};
    T.reset=()=>{T.level=sol.level==null?(isT?.42:.38):sol.level;T.col=col(sol.col||"#E8F2FB");T.a=sol.a==null?.38:sol.a;T.tgt=T.lvlTgt=null;T.fizzRate=0;T.ppt=T.pptTgt=0;T.turb=T.turbTgt=0;
      T.solids.forEach(s=>s.m.visible=false);T.solids=[];T.heat=false;T.temp=25;T.tempTgt=null;T.smoke=0;T.steamOn=false;T.data={}};
    vessels.push(T);return T};
  /* ---------- chất rắn trong bình ---------- */
  const GEO={};
  function geo(kind){if(GEO[kind])return GEO[kind];
    if(kind==="powder")GEO[kind]=G.sphere(1,7,5);else if(kind==="crystal")GEO[kind]=G.box(1,1,1,.15,1);
    else if(kind==="tablet")GEO[kind]=G.cylinder(.1,.04,28);else if(kind==="lump")GEO[kind]=K3.pieceGeom("granule");
    else GEO[kind]=K3.pieceGeom(kind);return GEO[kind]}
  /* kind: nail|granule|ribbon|wire|cube|ball|strip|lump|tablet|powder|crystal ; o:{col,metal,rough,n,size,scale} */
  BN.addSolid=function(T,kind,o){o=o||{};const S={kind,mass:1,t:0,T};
    if(kind==="powder"||kind==="crystal"){const N=o.n||90;const m=root.add(R.instanced(geo(kind),{color:o.col||"#F3F1EA",rough:o.rough||.85},N));
      S.m=m;S.P=Array.from({length:N},()=>({a:rnd()*6.283,r:Math.sqrt(rnd())*T.inner*.85,y:rnd()*.04,s:(o.size||.008)*(.6+rnd()*.8),d:rnd()*.4,rot:rnd()}));S.inst=true}
    else{S.m=root.add(R.mesh(geo(kind),{color:o.col||"#B9C0C8",rough:o.rough==null?.4:o.rough,metal:o.metal==null?.85:o.metal}));const s=o.scale||1;S.m.scl=[s,s,s];S.s0=s}
    S.col0=col(o.col||"#B9C0C8");S.colTo=null;S.dissolve=0;S.rate=0;S.dropT=o.instant?1:0;T.solids.push(S);return S};
  BN.solidTint=(S,c,k)=>{S.colTo=col(c);S.tint=k==null?1:k};
  /* ---------- công cụ: ống hút nhỏ giọt, que đóm, giấy chỉ thị, đèn cồn ---------- */
  const drop=root.add(new G.Node());drop.add(R.mesh(G.lathe([[0,0],[.012,.02],[.016,.3],[.02,.31],[.02,.33]],16),{type:"glass",color:"#F2FAFF",alpha:.6}));
  drop.add(R.mesh(G.lathe([[0,0],[.045,.02],[.05,.1],[.03,.16],[0,.17]],16),{color:"#2B2F38",rough:.5})).pos=[0,.33,0];drop.visible=false;
  const dropLiq=drop.add(R.mesh(G.cylinder(.011,.22,10),{color:"#FFFFFF",alpha:.6,order:1}));dropLiq.pos=[0,.03,0];
  const drips=root.add(R.instanced(G.sphere(1,10,8),{color:"#FFFFFF",alpha:.7,rough:.05,coat:.6,transparent:true,order:2},40));const DR=[];
  const splint=root.add(new G.Node());splint.add(R.mesh(G.cylinder(.016,.85,10),{color:"#D9B37A",rough:.7})).quat=G.Q.euler(0,0,-.55);splint.visible=false;
  const ember=splint.add(R.mesh(G.sphere(.024,10,8),{type:"unlit",color:"#FF7A2A"}));
  const sFlame=root.add(K3.flame(R,[1,.58,.15],[1,.95,.75]));sFlame.visible=false;
  const strip=root.add(new G.Node());const stripM=strip.add(R.mesh(G.box(.05,.5,.008,.003,2),{color:"#EDC35A",rough:.85}));stripM.pos=[0,.25,0];strip.visible=false;
  const stripLo=strip.add(R.mesh(G.box(.052,.16,.01,.003,2),{color:"#EDC35A",rough:.85}));stripLo.pos=[0,.08,0];
  const burners=[];
  BN.burner=function(x,z,s){s=s||1;const n=root.add(new G.Node());n.pos=[x,0,z];n.scl=[s,s,s];
    n.add(R.mesh(G.lathe([[0,0],[.16,.005],[.19,.06],[.18,.17],[.12,.22],[.05,.24],[0,.24]],32),{type:"glass",color:"#EAF4FF",alpha:.55}));
    n.add(R.mesh(K3.liquidGeom(.17,.01,.12,false),{color:H("#C7E4FF"),alpha:.35,order:1}));
    n.add(R.mesh(G.cylinder(.035,.06,16),{color:"#9CA3AF",rough:.4,metal:.8})).pos=[0,.24,0];n.add(R.mesh(G.cylinder(.008,.05,8),{color:"#F5F0E6",rough:.9})).pos=[0,.3,0];
    const f=root.add(K3.flame(R,[1,.55,.12],[.75,.85,1]));f.pos=[x,.34*s,z];f.scl=[.7*s,.9*s,.7*s];f.visible=false;const B={n,f,on:false,x,z,s};burners.push(B);return B};
  /* giá kẹp ống nghiệm: đế, cọc đứng, kẹp ngang ở độ cao y */
  BN.clamp=function(x,z,y){const n=root.add(new G.Node());n.pos=[x,0,z];const M={color:"#4B5058",rough:.45,metal:.8};
    /* giá sắt đặt chếch sau – phải của ống, tay kẹp vươn tới vòng kẹp: nhìn từ phía trước, cột giá không xuyên qua đèn cồn */
    const PX=.27,PZ=-.36;n.add(R.mesh(G.box(.3,.04,.36,.02,2),M)).pos=[PX+.04,.02,PZ-.06];n.add(R.mesh(G.cylinder(.018,1.6,12),M)).pos=[PX,0,PZ];
    {const L=Math.hypot(PX,PZ)-.12;const arm=n.add(R.mesh(G.box(.035,.035,L,.01,1),M));const u=[PX/Math.hypot(PX,PZ),PZ/Math.hypot(PX,PZ)];arm.pos=[u[0]*(.12+L/2),y,u[1]*(.12+L/2)];arm.quat=G.Q.euler(0,Math.atan2(u[0],u[1]),0)}n.add(R.mesh(G.lathe([[.135,-.03],[.15,-.02],[.15,.02],[.135,.03]],24),{color:"#6B4F2A",rough:.6})).pos=[0,y,0];return n};
  BN.stand=function(x,z,y,r){/* kiềng ba chân + lưới */const n=root.add(new G.Node());n.pos=[x,0,z];
    for(let i=0;i<3;i++){const a=i/3*6.283;n.add(R.mesh(G.tube([[Math.cos(a)*r,0,Math.sin(a)*r],[Math.cos(a)*r*.85,y,Math.sin(a)*r*.85]],.012,6),{color:"#3F444C",rough:.5,metal:.7}))}
    n.add(R.mesh(G.lathe([[r*.92,y],[r*.95,y+.012]],32),{color:"#3F444C",metal:.7,rough:.5}));n.add(R.mesh(G.box(r*1.9,.006,r*1.9,.002,1),{color:"#8B8F96",rough:.8,alpha:.92})).pos=[0,y+.012,0];return n};

  /* hàng đợi hành động: mỗi hành động chạy tuần tự trên một bình, gọi cb khi xong */
  function run(act){acts.push(Object.assign({t:0},act))}
  /* nhỏ dung dịch: n giọt màu c vào bình T, sau đó onDone() */
  BN.dropInto=function(T,c,n,onDone,opt){opt=opt||{};run({kind:"drop",T,c:col(c),n:n||5,onDone,dur:.6+(n||5)*.16,ret:.45,opt})};
  BN.pour=function(T,addLevel,c,onDone){run({kind:"pour",T,add:addLevel,c:col(c),onDone,dur:1.2})};
  BN.dropSolid=function(S,onDone){run({kind:"solid",S,onDone,dur:.7})};
  BN.splint=function(T,mode,result,onDone){/* mode: "burn" (que đóm đang cháy) | "ember" (còn tàn đỏ); result: "pop" | "relight" | "out" | "none" */run({kind:"splint",T,mode,result,onDone,dur:2.4})};
  BN.dip=function(T,c0,c1,onDone){run({kind:"dip",T,c0:col(c0),c1:col(c1),onDone,dur:2.2})};
  BN.heat=function(T,on,burner){T.heat=on;if(burner){burner.on=on}};
  BN.busy=()=>acts.length>0;

  /* ---------- cập nhật mỗi khung hình ---------- */
  BN.step=function(dt){
    for(const T of vessels){
      if(T.tgt){const g=T.tgt;g.t+=dt;const k=C.clamp(g.t/g.dur,0,1);const e=k*k*(3-2*k);T.col=mixc(g.from,g.to,e);T.a=g.fa+(g.ta-g.fa)*e;if(k>=1)T.tgt=null}
      if(T.lvlTgt){const g=T.lvlTgt;g.t+=dt;const k=C.clamp(g.t/g.dur,0,1);T.level=g.from+(g.to-g.from)*(1-(1-k)*(1-k));if(k>=1)T.lvlTgt=null}
      if(T.pptTgt>T.ppt)T.ppt=Math.min(T.pptTgt,T.ppt+dt/(T.pptDur||3));else if(T.pptTgt<T.ppt)T.ppt=Math.max(T.pptTgt,T.ppt-dt/2);
      T.turb+=(T.turbTgt-T.turb)*Math.min(1,dt*.9);if(T.ppt>=T.pptTgt&&T.pptTgt>0)T.turbTgt=Math.max(.12*T.pptTgt,T.turbTgt-dt*.08);
      const lv=Math.max(T.yb+.004,T.level);T.liq.visible=T.level>T.yb+.004;T.liq.scl=[1,(lv-T.yb)/(1-T.yb),1];T.liq.pos=[0,T.yb*(1-T.liq.scl[1]),0];
      const tc=mixc(T.col,T.turbCol,T.turb*.85);T.liq.mat.color=tc;T.liq.mat.alpha=C.clamp(T.a+T.turb*.55,0,.97);
      T.pptM.visible=T.ppt>.01;if(T.pptM.visible){const hh=.012+.11*T.ppt*(T.isT?1:.6);T.pptM.scl=[1,hh/.12,1];T.pptM.pos=[0,T.yb*(1-hh/.12),0]}
      if(T.tempTgt!=null){T.temp+=(T.tempTgt-T.temp)*Math.min(1,dt*(T.tempK||.4));if(Math.abs(T.temp-T.tempTgt)<.3&&!T.heat)T.tempTgt=null}
      else if(T.heat){T.temp=Math.min(T.tmax||100,T.temp+dt*6)}else T.temp+=(25-T.temp)*Math.min(1,dt*.02);
      /* bọt khí */
      const rate=T.fizzRate+(T.heat&&T.temp>95&&T.level>T.yb+.02?40:0);const nb=rate*dt;const sp=T.fizzSpread==null?T.inner*.7:T.fizzSpread;
      for(let q=0;q<nb+(rnd()<nb%1?1:0);q++){const a=rnd()*6.283,rr=Math.sqrt(rnd())*sp;fizz.spawn([T.x+Math.cos(a)*rr,T.y0+T.yb+.02+rnd()*.03,T.z+Math.sin(a)*rr],(.008+rnd()*.012)*T.fizzSize,[(rnd()-.5)*.03,.28+rnd()*.15,(rnd()-.5)*.03],2.4,.9)}
      if((T.smoke>0)&&rnd()<dt*T.smoke*20)smoke.spawn([T.x+(rnd()-.5)*.06,T.y0+T.h+.04,T.z+(rnd()-.5)*.06],.04,[(rnd()-.5)*.04,.22,0],2.2,.22,2);
      if((T.steamOn||T.temp>70)&&rnd()<dt*(T.temp>95?10:3))steam.spawn([T.x+(rnd()-.5)*T.inner,T.y0+T.level+.03,T.z+(rnd()-.5)*T.inner*.6],.03,[(rnd()-.5)*.03,.16,0],2,.12,2.4);
      /* chất rắn */
      T.solids.forEach((S,si)=>{if(S.dropT<1)return;S.t+=dt;if(S.rate>0)S.dissolve=Math.min(1,S.dissolve+S.rate*dt);const left=1-S.dissolve;
        if(S.inst){const D=S.m.data;let c=0;const cc=S.colTo?mixc(S.col0,S.colTo,S.tint):S.col0;
          for(const p of S.P){if(p.d<S.dissolve)continue;const y=T.y0+T.yb+.008+p.y*(T.isT?.6:1);D.set([T.x+Math.cos(p.a)*p.r,y,T.z+Math.sin(p.a)*p.r,p.s,1,1,1,1],c*8);c++}
          S.m.mat.color=cc;S.m.setInstances(c)}
        else{const s=S.s0*Math.cbrt(Math.max(.001,left));S.m.visible=left>.01;S.m.scl=[s,s,s];
          const k=S.kind;const y=T.y0+T.yb+(k==="nail"?.0:k==="tablet"?.005:.03)*s;S.m.pos=[T.x+(si%2?.03:-.03)*(T.isT?.5:2),y,T.z];if(k==="nail"||k==="wire"||k==="ribbon")S.m.quat=G.Q.euler(0,si,.1);
          if(S.colTo)S.m.mat.color=mixc(S.col0,S.colTo,S.tint)}})}
    /* hành động */
    if(acts.length){const A=acts[0];A.t+=dt;const T=A.T||(A.S&&A.S.T);const m=T?T.mouth():[0,0,0];
      if(A.kind==="drop"){const k=Math.min(1,A.t/.45);drop.visible=true;dropLiq.mat.color=A.c;const y=m[1]+.35-.2*k;drop.pos=[m[0],y,m[2]];
        if(A.t>.45&&A.t<A.dur-.1){A.acc=(A.acc||0)+dt;const iv=(A.dur-.55)/A.n;while(A.acc>iv){A.acc-=iv;DR.push({p:[m[0],y,m[2]],v:0,c:A.c,T})}}
        if(A.t>=A.dur){if(!A.done){A.done=true;A.onDone&&A.onDone()}drop.pos=[m[0],m[1]+.15+(A.t-A.dur)*1.5,m[2]];if(A.t>A.dur+A.ret){drop.visible=false;acts.shift()}}}
      else if(A.kind==="pour"){/* bình rót: đổ thêm vào, mực dâng dần */if(!A.st){A.st=true;A.T.setLevel(A.T.level+A.add,A.dur);if(A.c)A.T.setColor(A.c,null,A.dur)}
        if(A.t<A.dur){const n=Math.ceil(dt*60);for(let q=0;q<n;q++)DR.push({p:[m[0]+(rnd()-.5)*.02,m[1]+.1,m[2]],v:-.6,c:A.c||A.T.col,T:A.T,small:true})}
        if(A.t>=A.dur){acts.shift();A.onDone&&A.onDone()}}
      else if(A.kind==="solid"){const S=A.S;const k=Math.min(1,A.t/A.dur);S.dropT=k;
        if(S.inst){const D=S.m.data;let c=0;for(const p of S.P){const fy=C.clamp(k*1.4-p.d*.6,0,1);const y=T.y0+T.yb+.008+p.y*(T.isT?.6:1);const yy=m[1]+.05+(y-m[1]-.05)*fy*fy;
            D.set([T.x+Math.cos(p.a)*p.r*(.3+.7*fy),yy,T.z+Math.sin(p.a)*p.r*(.3+.7*fy),p.s,1,1,1,1],c*8);c++}S.m.setInstances(c)}
        else{const y1=T.y0+T.yb+.03,y0=m[1]+.1;S.m.visible=true;S.m.pos=[T.x,y0+(y1-y0)*k*k,T.z];S.m.scl=[S.s0,S.s0,S.s0]}
        if(k>=1){S.dropT=1;acts.shift();A.onDone&&A.onDone()}}
      else if(A.kind==="splint"){const k=Math.min(1,A.t/.8);splint.visible=true;const tip=[m[0]+.02,m[1]+.45-.47*k,m[2]];splint.pos=tip;
        const lit=A.mode==="burn"?A.result!=="out"||A.t<.9:(A.result==="relight"&&A.t>.9);sFlame.visible=lit;if(lit){sFlame.pos=[tip[0],tip[1]-.02,tip[2]];const f=(A.result==="relight"&&A.t>.9?.5:.32)+.04*Math.sin(K.simT*30);sFlame.scl=[f,f*1.2,f]}
        ember.mat.color=lit?H("#FFE7A0"):A.mode==="ember"?H("#FF6A1E"):H("#2A2420");
        if(A.t>.9&&!A.fired){A.fired=true;if(A.result==="pop"){G.audio&&G.audio.pop&&G.audio.pop(1);for(let q=0;q<16;q++)sparks.spawn([m[0],m[1],m[2]],.02,[(rnd()-.5)*.8,.4+rnd()*.6,(rnd()-.5)*.8],.3,.9,.4)}
          if(A.result==="out")for(let q=0;q<6;q++)smoke.spawn([tip[0],tip[1],tip[2]],.02,[0,.15,0],1.2,.25,1.4);A.onDone&&A.onDone()}
        if(A.t>=A.dur){splint.visible=false;sFlame.visible=false;acts.shift()}}
      else if(A.kind==="dip"){const k=A.t<.7?A.t/.7:A.t<1.5?1:Math.max(0,1-(A.t-1.5)/.7);strip.visible=true;strip.pos=[m[0],m[1]-.06-(m[1]-T.top()+.04)*k*.9,m[2]];
        stripLo.mat.color=A.t>.8?mixc(A.c0,A.c1,Math.min(1,(A.t-.8)/.5)):A.c0;stripM.mat.color=A.c0;
        if(A.t>1.3&&!A.fired){A.fired=true;A.onDone&&A.onDone()}if(A.t>=A.dur){strip.visible=false;acts.shift()}}
      else acts.shift()}
    /* giọt rơi */
    const D=drips.data;let c=0;for(let i=DR.length-1;i>=0;i--){const d=DR[i];d.v-=dt*4.5;d.p[1]+=d.v*dt;if(d.p[1]<d.T.top()){DR.splice(i,1);continue}}
    for(const d of DR){if(c>=40)break;D.set([d.p[0],d.p[1],d.p[2],d.small?.008:.013,d.c[0],d.c[1],d.c[2],1],c*8);c++}drips.setInstances(c);
    for(const B of burners){B.f.visible=B.on;if(B.on){const s=B.s*(.7+.05*Math.sin(K.simT*24));B.f.scl=[s,s*1.3,s];B.f.mat.uniforms.uAmp=.9+.2*Math.sin(K.simT*31)}}
    fizz.step(dt,b=>{for(const T of vessels){if(Math.abs(b.p[0]-T.x)<T.r+.01&&Math.abs(b.p[2]-T.z)<T.r+.01){if(b.p[1]>T.y0+T.level)b.dead=true;return}}});
    smoke.step(dt);steam.step(dt);sparks.step(dt)};
  BN.resetAll=function(){vessels.forEach(T=>T.reset());acts.length=0;DR.length=0;fizz.list.length=0;smoke.list.length=0;steam.list.length=0;burners.forEach(b=>b.on=false);drop.visible=splint.visible=strip.visible=false;sFlame.visible=false};
  /* chọn bình bằng tia */
  BN.pick=function(px,py){const r=R.ray(px,py);let best=null,bt=1e9;for(const T of vessels){if(!T.n.visible)continue;const t=G.hit.box(r,[T.x-T.r-.03,0,T.z-T.r-.03],[T.x+T.r+.03,T.y0+T.h+.05,T.z+T.r+.03]);if(t!=null&&t<bt){bt=t;best=T}}return best};
  K.onFrame(dt=>BN.step(dt));
  return BN}

/* ============== BÀI HÓA KHAI BÁO BẰNG DỮ LIỆU ==============
   def = {aria, seed, bench:[w,d], legendW,
     stations:{key:{label,icon,view:{t,yaw,pitch,rad}, vessels:[{id,kind,x,z,r,h,sol:{col,a,level},name,short}], racks:[[x,z,n]], burners:[[x,z,id]], hint}},
     reagents:[{k,label,icon,chip,type:"drop"|"solid"|"splint"|"ember"|"strip"|"heat"|"pour", n, solid:{kind,col,metal,rough,scale,n,size}, at:[stations], c}],
     react(k,T,ctx) → {fx(BN,T), ht, kl, ok, toast, tag} | null,   ctx = {BN, S, rec, refresh}
     info(stationKey,S) → html, tasks/spec dùng S.done (Set "k@id")}
   Học sinh: chọn hóa chất / dụng cụ ở khay rồi chạm vào ống nghiệm (hoặc bấm tên ống). */
function chemLab(api,def,spec){const KIT=window.LabKit,IC=KIT.ICON;
  const views={};for(const k in def.stations){const s=def.stations[k];views[k]=Object.assign({label:s.label,icon:s.icon||IC.tube},s.view)}
  const K=KIT.scene3D(api,{aria:def.aria,views,legend:{w:def.legendW||250},bench:def.bench||[6,3],seed:def.seed||77});
  if(!K.ok)return{K,mount:K.mount(null)};
  const BN=create(K);const S={tool:null,done:new Set(),recs:0,log:[],tag:{}};
  const rec=(tn,ht,kl)=>{S.recs++;api.record({lan:String(S.recs),tn,ht,kl})};
  const st=KIT.steps(api,spec);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
  const V={},ST={};const R0=K.R;
  /* ống nghiệm đang ở giá mà đèn cồn đặt bên cạnh: kẹp gỗ đưa ống tới ngay trên ngọn lửa (hơi nghiêng); tắt đèn thì đưa về chỗ cũ */
  BN.toBurner=(T,b,on)=>{if(!b||!T||!T.isT||T.fixedHeat)return;if(!T.home)T.home={p:T.n.pos.slice(),q:(T.n.quat||[0,0,0,1]).slice(),lp:T.lab&&T.lab.p?T.lab.p.slice():null};
    if(Math.hypot(T.home.p[0]-b.x,T.home.p[2]-b.z)<=.06)return;
    BN.moveTube(T,on?[b.x,.46*(b.s||1),b.z]:null,on?G.Q.euler(0,0,-.32):null,on)};
  /* đưa ống nghiệm tới vị trí to (null = về chỗ cũ), có kẹp gỗ khi đang cầm */
  BN.moveTube=(T,to,q,hold)=>{if(!T.home)T.home={p:T.n.pos.slice(),q:(T.n.quat||[0,0,0,1]).slice(),lp:T.lab&&T.lab.p?T.lab.p.slice():null};
    T.mv={t:0,to:to||T.home.p,tq:q||T.home.q,from:T.n.pos.slice(),fq:(T.n.quat||[0,0,0,1]).slice(),hold};
    if(!hold){if(T.holder&&!to)T.holder.keep=false;return}
    if(!T.holder){T.holder=T.n.add(new G.Node());T.holder.add(R0.mesh(G.box(.36,.035,.05,.012,2),{color:"#B07A43",rough:.7})).pos=[.27,0,0];T.holder.add(R0.mesh(G.box(.05,.05,.07,.01,1),{color:"#8A5A2E",rough:.7})).pos=[.11,0,0]}
    T.holder.pos=[0,T.h*.72,0];T.holder.visible=true};
  K.onFrame((dt,rdt)=>{for(const k in V){const T=V[k];if(!T||!T.mv)continue;const M=T.mv;M.t=Math.min(1,M.t+(rdt||dt||.016)/.8);const e=M.t<.5?2*M.t*M.t:1-Math.pow(-2*M.t+2,2)/2;
    const lift=Math.sin(Math.PI*e)*.35;T.n.pos=[M.from[0]+(M.to[0]-M.from[0])*e,M.from[1]+(M.to[1]-M.from[1])*e+lift,M.from[2]+(M.to[2]-M.from[2])*e];
    const q=M.fq.map((v,i)=>v+(M.tq[i]-v)*e),l=Math.hypot(...q)||1;T.n.quat=q.map(v=>v/l);
    if(T.lab&&T.home&&T.home.lp)T.lab.p=[T.home.lp[0]+T.n.pos[0]-T.home.p[0],T.home.lp[1]+T.n.pos[1]-T.home.p[1],T.home.lp[2]+T.n.pos[2]-T.home.p[2]];
    if(M.t>=1){const h=M.hold;T.mv=null;if(!h&&T.holder)T.holder.visible=false}}});
  const stn=(n,k)=>{if(n&&K.station&&!def.noStations)K.station(n,k);return n};
  for(const k in def.stations){const s=def.stations[k];ST[k]=[];(s.racks||[]).forEach(r=>stn(BN.rack(r[0],r[1],r[2],r[3]),k));
    (s.burners||[]).forEach(b=>{V["@"+b[2]]=BN.burner(b[0],b[1],b[3]);stn(V["@"+b[2]].n,k)});
    (s.stands||[]).forEach(b=>stn(BN.stand(b[0],b[1],b[2],b[3]),k));
    for(const v of s.vessels){const T=BN.vessel(v);stn(T.n,k);T.name=v.name;T.short=v.short||v.name;T.station=k;V[v.id]=T;ST[k].push(T);
      T.lab=K.label(v.short||v.name,[v.x+(v.lx||0),v.ly!=null?v.ly:(v.kind==="beaker"?(v.h||.6)+.08:1.18),v.z],{view:k,dir:v.dir||"n",len:v.len==null?14:v.len})}}
  const R=def.reagents;const RG={};R.forEach(r=>RG[r.k]=r);
  function apply(k,T){const r=RG[k];if(!r)return;if(BN.busy())return api.toast("Đợi thao tác trước xong đã.","info",1400);
    const res=def.react(k,T,{BN,S,rec,refresh,V});if(res&&res.cancel){if(res.toast)api.toast(res.toast,"info",2000);return}
    const after=()=>{if(!res){rec(`${r.label} → ${T.name}`,"không có hiện tượng","Không xảy ra phản ứng");}
      else{if(res.fx)res.fx(BN,T);if(res.ht)rec(res.tn||`${r.label} → ${T.name}`,res.ht,res.kl||"");if(res.toast)api.toast(res.toast,res.ok===false?"info":"ok",2600)}
      S.done.add(k+"@"+T.id);if(res&&res.tag)S.tag[res.tag]=true;refresh()};
    if(r.type==="drop")BN.dropInto(T,r.c||"#E8F2FB",r.n||5,after);
    else if(r.type==="pour")BN.pour(T,r.add||.12,r.c,after);
    else if(r.type==="solid"){const sd=BN.addSolid(T,r.solid.kind,r.solid);T.data.solid=sd;BN.dropSolid(sd,after)}
    else if(r.type==="splint"||r.type==="ember"){const out=res&&res.splint?res.splint:(r.type==="splint"?"none":"none");BN.splint(T,r.type==="splint"?"burn":"ember",out,after)}
    else if(r.type==="strip"){const c1=res&&res.strip?res.strip:(r.c||"#EDC35A");BN.dip(T,r.c||"#EDC35A",c1,after)}
    else if(r.type==="heat"){const b=V["@"+(T.burner||"b")];T.heat=!T.heat;if(b)b.on=T.heat;
      BN.toBurner(T,b,T.heat);after()}
    else after()}
  K.dockFn(()=>{const items=R.filter(r=>!r.at||r.at.includes(K.view)).map(r=>({k:"tool",v:r.k,label:r.label,icon:r.chip?`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="14" fill="${r.chip}" stroke="currentColor" stroke-width="1.5"/>${r.sym?`<text x="20" y="24.5" text-anchor="middle" font-size="${r.sym.length>2?9:12}" font-weight="800" fill="#1B1F2E">${r.sym}</text>`:""}</svg>`:(r.icon||IC.drop),on:S.tool===r.k}));
    const vs=(ST[K.view]||[]);
    return [{grid:items},vs.length?"hr":null,vs.length&&S.tool?{grid:vs.map(T=>({k:"apply",v:T.id,label:T.short,icon:IC.tube}))}:null,{k:"reset",label:"Làm lại trạm",icon:IC.reset}].filter(Boolean)});
  K.onDock((k,v)=>{if(k==="tool"){S.tool=S.tool===v?null:v;if(S.tool)api.toast(`${RG[v].label}: chạm vào ống nghiệm (hoặc bấm tên ống ở khay).`,"info",2000)}
    else if(k==="apply"&&S.tool)apply(S.tool,V[v]);else if(k==="reset"){(ST[K.view]||[]).forEach(T=>T.reset());(def.onReset||(()=>{}))(K.view,S,V)}refresh()});
  K.pickFn((x,y)=>{const T=BN.pick(x,y);return T&&T.station===K.view?{T}:null});
  K.tapFn(k=>{if(!k)return;if(!S.tool){api.toast("Chọn hóa chất hoặc dụng cụ ở khay trước.","info",1800);return}apply(S.tool,k.T)});
  K.infoFn(()=>def.info?def.info(K.view,S,V):"");
  K.timeLabel(()=>`t = ${C.fmt(K.simT,1)} s · ${views[K.view].label.toLowerCase()}${S.tool?` · đang cầm: ${RG[S.tool].label.toLowerCase()}`:""}`);
  K.onReset(()=>{BN.resetAll();S.done.clear();S.tag={};S.tool=null;def.onReset&&def.onReset(null,S,V);refresh()});
  return{K,BN,S,V,ST,st,rec,refresh,apply}}

window.LabBench={create,mixc,chemLab};
})();
