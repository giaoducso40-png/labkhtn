/* LabKHTN · bộ máy BÀN LẮP MẠCH ĐIỆN (dùng chung cho các bài mạch điện lớp 7–9)
   - Giải mạch bằng phương pháp thế nút (MNA) cho nguồn có điện trở trong, dây nối, công tắc, bóng đèn, ampe kế, vôn kế
   - Bóng đèn dây tóc là điện trở phi tuyến: I = I_đm·(U/U_đm)^0,55 (gần đúng, theo "lamp rerating"), không nhỏ hơn điện trở nguội
   - Vẽ 2,5D bằng Canvas 2D: bảng gỗ, linh kiện có độ dày và bóng đổ, dây nối mềm, đồng hồ kim */
(function(){
"use strict";
if(window.LabCircuit) return;
const C=window.LabCore;

/* ---------- 1. Thông số mặc định (xem “Nguồn và giả định” của từng bài) ---------- */
const PAR={RW:0.01,RS:0.01,RA:0.1,RV:6000,cellNew:{E:1.5,r:0.2},cellOld:{E:1.3,r:1.0},lamp:{Ur:6,Ir:0.5,exp:0.55,coldFrac:0.1},fuseA:2.0,shortA:3.0};

/* ---------- 2. Linh kiện: kích thước và chốt nối (toạ độ cục bộ, gốc = tâm) ---------- */
const SPEC={
  battery:{w:268,h:78,t:[{k:"p",dx:-146,dy:0,pol:"+"},{k:"n",dx:146,dy:0,pol:"−"}]},
  lamp:{w:150,h:120,t:[{k:"a",dx:-82,dy:22},{k:"b",dx:82,dy:22}]},
  switch:{w:156,h:66,t:[{k:"a",dx:-88,dy:0},{k:"b",dx:88,dy:0}]},
  ammeter:{w:178,h:158,t:[{k:"n",dx:-50,dy:92,pol:"−"},{k:"p",dx:50,dy:92,pol:"+"}]},
  voltmeter:{w:178,h:158,t:[{k:"n",dx:-50,dy:92,pol:"−"},{k:"p",dx:50,dy:92,pol:"+"}]}
};
const METER={A:{max:0.6,step:0.01,major:0.1,unit:"A",dec:2,name:"Ampe kế"},V:{max:6,step:0.1,major:1,unit:"V",dec:1,name:"Vôn kế"}};
function terms(c){return SPEC[c.type].t.map(t=>({...t,id:c.id+"."+t.k,x:c.x+t.dx,y:c.y+t.dy,c}))}

/* ---------- 3. Giải mạch ---------- */
function lampR(U,L){
  const Rh=L.Ur/L.Ir,Rc=Rh*L.coldFrac,u=Math.abs(U)/L.Ur;
  return Math.max(Rc,Rh*Math.pow(u,1-L.exp));
}
function linsolve(A,b){
  const n=b.length;
  for(let i=0;i<n;i++){
    let p=i;for(let r=i+1;r<n;r++)if(Math.abs(A[r][i])>Math.abs(A[p][i]))p=r;
    if(p!==i){const t=A[i];A[i]=A[p];A[p]=t;const u=b[i];b[i]=b[p];b[p]=u}
    const d=A[i][i];if(Math.abs(d)<1e-18)continue;
    for(let r=i+1;r<n;r++){const f=A[r][i]/d;if(f===0)continue;for(let c=i;c<n;c++)A[r][c]-=f*A[i][c];b[r]-=f*b[i]}
  }
  const x=new Array(n).fill(0);
  for(let i=n-1;i>=0;i--){let s=b[i];for(let c=i+1;c<n;c++)s-=A[i][c]*x[c];x[i]=Math.abs(A[i][i])<1e-18?0:s/A[i][i]}
  return x;
}
/* comps: [{id,type,...}], wires: [{id,a:"id.k",b:"id.k"}] → {V:{term:volt}, I:{elementKey:amp}, lamp:{id:{U,I,P}}, meter:{id:value}} */
function solve(comps,wires,par){
  par=par||PAR;
  const T=[],idx={};
  for(const c of comps)for(const t of terms(c)){idx[t.id]=T.length;T.push(t)}
  const N=T.length;const res={V:{},I:{},lamp:{},meter:{},wireI:{},bat:{}};
  if(!N) return res;
  const els=[];
  for(const w of wires){if(idx[w.a]==null||idx[w.b]==null)continue;els.push({a:idx[w.a],b:idx[w.b],R:par.RW,kind:"wire",ref:w})}
  let ground=0,hasSrc=false;
  for(const c of comps){
    const t=k=>idx[c.id+"."+k];
    if(c.type==="battery"){const cell=c.old?par.cellOld:par.cellNew;const E=cell.E*c.cells,r=cell.r*c.cells;els.push({a:t("p"),b:t("n"),R:r,E,kind:"bat",ref:c});if(!hasSrc){ground=t("n");hasSrc=true}}
    else if(c.type==="lamp")els.push({a:t("a"),b:t("b"),R:lampR(0,par.lamp),kind:"lamp",ref:c});
    else if(c.type==="switch"){if(c.closed)els.push({a:t("a"),b:t("b"),R:par.RS,kind:"sw",ref:c})}
    else if(c.type==="ammeter"){if(!c.blown)els.push({a:t("p"),b:t("n"),R:par.RA,kind:"A",ref:c})}
    else if(c.type==="voltmeter")els.push({a:t("p"),b:t("n"),R:par.RV,kind:"V",ref:c});
  }
  let V=new Array(N).fill(0);
  for(let it=0;it<80;it++){
    const G=Array.from({length:N},()=>new Array(N).fill(0)),I=new Array(N).fill(0);
    for(const e of els){const g=1/e.R;G[e.a][e.a]+=g;G[e.b][e.b]+=g;G[e.a][e.b]-=g;G[e.b][e.a]-=g;if(e.E){I[e.a]+=e.E*g;I[e.b]-=e.E*g}}
    for(let i=0;i<N;i++)G[i][i]+=1e-9;
    /* bỏ hàng/cột nút đất */
    const keep=[];for(let i=0;i<N;i++)if(i!==ground)keep.push(i);
    const A=keep.map(i=>keep.map(j=>G[i][j])),bb=keep.map(i=>I[i]);
    const x=linsolve(A,bb);
    const nV=new Array(N).fill(0);keep.forEach((i,k)=>nV[i]=x[k]);
    V=nV;
    let ch=0;
    for(const e of els){if(e.kind!=="lamp")continue;const U=V[e.a]-V[e.b];const Rn=lampR(U,par.lamp);const R2=e.R*.5+Rn*.5;ch=Math.max(ch,Math.abs(R2-e.R)/e.R);e.R=R2}
    if(it>2&&ch<1e-7)break;
  }
  T.forEach((t,i)=>res.V[t.id]=V[i]);
  for(const e of els){
    const U=V[e.a]-V[e.b];
    const i=e.E?(e.E-U)/e.R:U/e.R; /* nguồn: dòng ra ở cực + ; phần tử khác: dòng từ a sang b */
    if(e.kind==="wire")res.wireI[e.ref.id]=i;
    else if(e.kind==="lamp")res.lamp[e.ref.id]={U,I:i,P:Math.abs(U*i),R:e.R};
    else if(e.kind==="A")res.meter[e.ref.id]=i;
    else if(e.kind==="V")res.meter[e.ref.id]=U;
    else if(e.kind==="bat")res.bat[e.ref.id]={I:i,U};
  }
  return res;
}
/* nhóm chốt được nối với nhau bằng dây (không qua linh kiện) */
function nets(comps,wires){
  const par={};const f=x=>{while(par[x]!==x){par[x]=par[par[x]];x=par[x]}return x};
  for(const c of comps)for(const t of terms(c))par[t.id]=t.id;
  for(const w of wires){if(par[w.a]==null||par[w.b]==null)continue;const a=f(w.a),b=f(w.b);if(a!==b)par[a]=b}
  return id=>par[id]==null?id:f(id);
}

/* ---------- 4. Hình học dây nối ---------- */
function wirePts(a,b){
  const dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);
  const sag=Math.min(70,18+d*.22);
  return [a,{x:a.x+dx*.25,y:a.y+dy*.25+sag},{x:a.x+dx*.75,y:a.y+dy*.75+sag},b];
}
function bez(P,t){const u=1-t;return{x:u*u*u*P[0].x+3*u*u*t*P[1].x+3*u*t*t*P[2].x+t*t*t*P[3].x,y:u*u*u*P[0].y+3*u*u*t*P[1].y+3*u*t*t*P[2].y+t*t*t*P[3].y}}
function sample(P,n){const a=[];for(let i=0;i<=n;i++)a.push(bez(P,i/n));return a}
function distToPoly(p,pts){let best=1e9;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const vx=b.x-a.x,vy=b.y-a.y,l=vx*vx+vy*vy;let t=l?((p.x-a.x)*vx+(p.y-a.y)*vy)/l:0;t=Math.max(0,Math.min(1,t));best=Math.min(best,Math.hypot(p.x-(a.x+vx*t),p.y-(a.y+vy*t)))}return best}

/* ---------- 5. Bảng màu ---------- */
function palette(day){
  return day?{bg1:"#EEF2FC",bg2:"#DCE3F4",wood1:"#E9D3AE",wood2:"#D7B98D",grain:"rgba(120,80,30,.10)",woodEdge:"#B58F5E",ink:"#0D1433",muted:"#55608E",
    body1:"#F7F9FE",body2:"#D3DBEC",bodyEdge:"#9BA6C4",side:"#AAB4CC",shadow:"rgba(30,40,80,.30)",dial:"#FFFDF5",dialInk:"#1A1F33",accent:"#2563EB",accent2:"#0891B2",sel:"#7C3AED",hot:"#FF3B30",flow:"#F59E0B"}
          :{bg1:"#0D1536",bg2:"#060A1E",wood1:"#4A3426",wood2:"#36251B",grain:"rgba(255,220,180,.06)",woodEdge:"#6E4F39",ink:"#F1F4FF",muted:"#98A3D3",
    body1:"#33407A",body2:"#1C244F",bodyEdge:"#5866A8",side:"#121838",shadow:"rgba(0,0,0,.5)",dial:"#FFFBF0",dialInk:"#1A1F33",accent:"#4C8DFF",accent2:"#3DE0FF",sel:"#FF6BD6",hot:"#FF453A",flow:"#FFD15C"};
}

/* ---------- 6. Vẽ ---------- */
function shadow(ctx,x,y,w,h,P){ctx.save();ctx.fillStyle=P.shadow;ctx.filter="blur(8px)";C.rr(ctx,x-w/2+6,y-h/2+10,w,h,16);ctx.fill();ctx.restore()}
function block(ctx,x,y,w,h,r,P,col1,col2){
  /* khối có độ dày: mặt bên tối phía dưới + mặt trên */
  ctx.fillStyle=P.side;C.rr(ctx,x-w/2,y-h/2+7,w,h,r);ctx.fill();
  const g=ctx.createLinearGradient(0,y-h/2,0,y+h/2);g.addColorStop(0,col1||P.body1);g.addColorStop(1,col2||P.body2);
  ctx.fillStyle=g;C.rr(ctx,x-w/2,y-h/2,w,h,r);ctx.fill();
  ctx.strokeStyle=P.bodyEdge;ctx.lineWidth=1.2;C.rr(ctx,x-w/2+.5,y-h/2+.5,w-1,h-1,r);ctx.stroke();
}
function drawBoard(ctx,x,y,w,h,P){
  ctx.save();ctx.fillStyle=P.shadow;ctx.filter="blur(14px)";C.rr(ctx,x+8,y+18,w,h,26);ctx.fill();ctx.restore();
  ctx.fillStyle=P.woodEdge;C.rr(ctx,x,y+9,w,h,24);ctx.fill();
  const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,P.wood1);g.addColorStop(1,P.wood2);
  ctx.fillStyle=g;C.rr(ctx,x,y,w,h,24);ctx.fill();
  ctx.save();C.rr(ctx,x,y,w,h,24);ctx.clip();
  ctx.strokeStyle=P.grain;ctx.lineWidth=2;
  for(let i=0;i<26;i++){const yy=y+12+i*(h/26);ctx.beginPath();ctx.moveTo(x,yy);for(let k=0;k<=12;k++){const xx=x+k*w/12;ctx.lineTo(xx,yy+Math.sin(k*1.3+i*.7)*5)}ctx.stroke()}
  ctx.restore();
}
function post(ctx,t,P,state){
  const col=t.pol==="+"?"#E5484D":t.pol==="−"?"#1F2433":"#8A93AE";
  ctx.save();
  if(state==="sel"||state==="hover"){ctx.shadowColor=P.sel;ctx.shadowBlur=16;ctx.strokeStyle=P.sel;ctx.lineWidth=3;ctx.beginPath();ctx.arc(t.x,t.y,16,0,6.283);ctx.stroke()}
  ctx.restore();
  ctx.fillStyle=col;ctx.beginPath();ctx.arc(t.x,t.y+3,11.5,0,6.283);ctx.fill();
  const g=ctx.createRadialGradient(t.x-3,t.y-4,1,t.x,t.y,11);g.addColorStop(0,"#FFFFFF");g.addColorStop(.35,"#C9CED9");g.addColorStop(1,"#6B7387");
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(t.x,t.y,8.5,0,6.283);ctx.fill();
  ctx.strokeStyle=col;ctx.lineWidth=3;ctx.beginPath();ctx.arc(t.x,t.y,10,0,6.283);ctx.stroke();
  ctx.strokeStyle="rgba(40,45,60,.55)";ctx.lineWidth=1.4;ctx.beginPath();ctx.moveTo(t.x-4,t.y);ctx.lineTo(t.x+4,t.y);ctx.stroke();
  if(t.pol){ctx.fillStyle=t.pol==="+"?"#E5484D":P.ink;ctx.font="900 15px system-ui,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(t.pol,t.x+(t.dx<0?-20:20),t.y-14);ctx.textAlign="left";ctx.textBaseline="alphabetic"}
}
function drawBattery(ctx,c,P,res){
  const s=SPEC.battery,x=c.x,y=c.y;
  shadow(ctx,x,y,s.w,s.h,P);block(ctx,x,y,s.w-30,s.h,14,P,"#2A2F45","#161A2B");
  const slots=4,sw=(s.w-58)/slots;
  for(let i=0;i<slots;i++){
    const cx=x-(s.w-58)/2+sw*i+sw/2,cy=y;
    ctx.fillStyle="rgba(0,0,0,.35)";C.rr(ctx,cx-sw/2+4,cy-24,sw-8,48,10);ctx.fill();
    if(i<c.cells){
      const g=ctx.createLinearGradient(0,cy-20,0,cy+20);g.addColorStop(0,c.old?"#8C7A55":"#F2C14E");g.addColorStop(.45,c.old?"#C2AE84":"#FFE59A");g.addColorStop(1,c.old?"#6E5E3E":"#C9901F");
      ctx.fillStyle=g;C.rr(ctx,cx-sw/2+8,cy-19,sw-22,38,8);ctx.fill();
      ctx.fillStyle="#1E2130";C.rr(ctx,cx-sw/2+8+(sw-22)*.62,cy-19,(sw-22)*.38,38,8);ctx.fill();
      ctx.fillStyle="#C9CED9";C.rr(ctx,cx+sw/2-15,cy-6,6,12,2);ctx.fill();
      ctx.fillStyle="#1E2130";ctx.font="800 10px system-ui,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText("1,5V",cx-8,cy);
    }
  }
  ctx.textAlign="center";ctx.textBaseline="alphabetic";
  ctx.fillStyle="#FFFFFF";ctx.font="800 15px 'Lexend',system-ui,sans-serif";
  const E=(c.old?PAR.cellOld.E:PAR.cellNew.E)*c.cells;
  ctx.fillText(`Nguồn ${C.fmt(c.cells*1.5,c.cells===1?1:0)} V${c.old?" · pin cũ":""}`,x,y-s.h/2-10);
  ctx.textAlign="left";
  /* dây dẫn từ thân tới chốt */
  ctx.strokeStyle="#9AA3B8";ctx.lineWidth=5;ctx.lineCap="round";
  for(const t of terms(c)){ctx.beginPath();ctx.moveTo(x+(t.dx<0?-(s.w-30)/2:(s.w-30)/2),y);ctx.lineTo(t.x,t.y);ctx.stroke()}
}
function drawLampBase(ctx,c,P){
  const s=SPEC.lamp,x=c.x,y=c.y;
  shadow(ctx,x,y+10,s.w,s.h-20,P);block(ctx,x,y+14,s.w-26,s.h-40,16,P);
  ctx.strokeStyle="#9AA3B8";ctx.lineWidth=5;ctx.lineCap="round";
  for(const t of terms(c)){ctx.beginPath();ctx.moveTo(x+(t.dx<0?-30:30),y+20);ctx.lineTo(t.x,t.y);ctx.stroke()}
  ctx.fillStyle=P.muted;ctx.font="700 11px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textAlign="center";ctx.fillText("6 V – 0,5 A",x,y+s.h/2-4);ctx.textAlign="left";
}
/* bóng đèn: b = độ sáng 0..1 (theo công suất) */
function drawBulb(ctx,c,P,b){
  const x=c.x,y=c.y-18;
  if(b>.01){const R=40+b*150;const g=ctx.createRadialGradient(x,y,4,x,y,R);g.addColorStop(0,`rgba(255,${Math.round(200+55*b)},${Math.round(120+110*b)},${Math.min(.95,.25+b*.8)})`);g.addColorStop(.35,`rgba(255,190,90,${.28*b+.05})`);g.addColorStop(1,"rgba(255,170,60,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,R,0,6.283);ctx.fill()}
  /* đui đèn */
  ctx.fillStyle="#B9C0D0";C.rr(ctx,x-18,y+18,36,22,5);ctx.fill();ctx.strokeStyle="rgba(0,0,0,.25)";for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-18,y+24+i*5);ctx.lineTo(x+18,y+24+i*5);ctx.stroke()}
  /* bóng thủy tinh */
  const gl=ctx.createRadialGradient(x-10,y-12,4,x,y,32);gl.addColorStop(0,b>.02?`rgba(255,250,230,${.6+b*.4})`:"rgba(255,255,255,.55)");gl.addColorStop(1,b>.02?`rgba(255,210,140,${.25+b*.5})`:"rgba(200,215,240,.18)");
  ctx.fillStyle=gl;ctx.beginPath();ctx.arc(x,y,30,0,6.283);ctx.fill();
  ctx.strokeStyle=b>.02?"rgba(255,230,180,.9)":"rgba(220,230,255,.75)";ctx.lineWidth=1.8;ctx.stroke();
  /* dây tóc */
  const fc=b>.02?`rgb(255,${Math.round(150+100*b)},${Math.round(60+160*b)})`:"#6B6F7E";
  ctx.strokeStyle=fc;ctx.lineWidth=b>.02?2.2:1.6;if(b>.02){ctx.shadowColor=fc;ctx.shadowBlur=10*b+4}
  ctx.beginPath();ctx.moveTo(x-12,y+16);ctx.lineTo(x-10,y-2);for(let k=0;k<=10;k++){const xx=x-10+k*2;ctx.lineTo(xx,y-2+(k%2?-5:0))}ctx.lineTo(x+12,y+16);ctx.stroke();ctx.shadowBlur=0;
  ctx.fillStyle="rgba(255,255,255,.7)";ctx.beginPath();ctx.ellipse(x-11,y-14,5,9,-.5,0,6.283);ctx.fill();
}
function drawSwitch(ctx,c,P,anim){
  const s=SPEC.switch,x=c.x,y=c.y;
  shadow(ctx,x,y,s.w,s.h,P);block(ctx,x,y,s.w-24,s.h,12,P);
  ctx.strokeStyle="#9AA3B8";ctx.lineWidth=5;ctx.lineCap="round";
  for(const t of terms(c)){ctx.beginPath();ctx.moveTo(x+(t.dx<0?-50:50),y);ctx.lineTo(t.x,t.y);ctx.stroke()}
  /* tiếp điểm */
  ctx.fillStyle="#D4A84B";C.rr(ctx,x-48,y-9,16,18,4);ctx.fill();C.rr(ctx,x+30,y-11,18,22,4);ctx.fill();
  /* cần gạt: anim 0 = mở, 1 = đóng */
  const ang=(1-anim)*-0.62;
  ctx.save();ctx.translate(x-40,y);ctx.rotate(ang);
  ctx.fillStyle="rgba(0,0,0,.25)";C.rr(ctx,2,4+ (1-anim)*10,80,10,5);ctx.fill();
  const g=ctx.createLinearGradient(0,-6,0,6);g.addColorStop(0,"#F5DB8B");g.addColorStop(1,"#B98A2E");ctx.fillStyle=g;C.rr(ctx,0,-5,82,10,5);ctx.fill();
  ctx.fillStyle="#E5484D";C.rr(ctx,70,-8,24,16,7);ctx.fill();
  ctx.restore();
  ctx.fillStyle="#C9CED9";ctx.beginPath();ctx.arc(x-40,y,6,0,6.283);ctx.fill();
  ctx.fillStyle=P.muted;ctx.font="800 12px 'Lexend',system-ui,sans-serif";ctx.textAlign="center";ctx.fillText(anim>.5?"K · đóng":"K · mở",x,y+s.h/2+18);ctx.textAlign="left";
}
/* mặt đồng hồ kim: (cx,cy) tâm trục kim, R bán kính thang đo */
function dial(ctx,cx,cy,R,m,val,P,opt){
  opt=opt||{};
  const a0=-Math.PI/2-1.12,a1=-Math.PI/2+1.12;
  const ang=v=>a0+(a1-a0)*Math.max(-0.06,Math.min(1.06,v/m.max));
  ctx.save();ctx.lineCap="round";
  /* cung màu */
  ctx.strokeStyle="rgba(37,99,235,.18)";ctx.lineWidth=R*.1;ctx.beginPath();ctx.arc(cx,cy,R*.93,a0,a1);ctx.stroke();
  const nTick=Math.round(m.max/m.step);
  for(let i=0;i<=nTick;i++){
    const v=i*m.step,a=ang(v);const maj=Math.abs(v/m.major-Math.round(v/m.major))<1e-6,half=!maj&&Math.abs((v/(m.major/2))-Math.round(v/(m.major/2)))<1e-6;
    const r1=R*(maj?.78:half?.84:.88),r2=R*.98;
    ctx.strokeStyle=P.dialInk;ctx.lineWidth=maj?Math.max(1.4,R*.018):Math.max(.6,R*.008);
    ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r1,cy+Math.sin(a)*r1);ctx.lineTo(cx+Math.cos(a)*r2,cy+Math.sin(a)*r2);ctx.stroke();
    if(maj){ctx.fillStyle=P.dialInk;ctx.font=`700 ${Math.max(8,R*.105)}px 'Be Vietnam Pro',system-ui,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";
      const lab=v===0?"0":(m.unit==="A"?C.fmt(v,1):String(Math.round(v)));ctx.fillText(lab,cx+Math.cos(a)*R*.68,cy+Math.sin(a)*R*.68)}
  }
  ctx.fillStyle=P.dialInk;ctx.font=`800 ${Math.max(12,R*.2)}px 'Lexend',system-ui,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(m.unit,cx-R*.62,cy-R*.14);
  /* kim */
  const a=ang(val);ctx.strokeStyle="#D7263D";ctx.lineWidth=Math.max(1.6,R*.022);
  ctx.beginPath();ctx.moveTo(cx-Math.cos(a)*R*.12,cy-Math.sin(a)*R*.12);ctx.lineTo(cx+Math.cos(a)*R*.97,cy+Math.sin(a)*R*.97);ctx.stroke();
  ctx.fillStyle="#2A2F45";ctx.beginPath();ctx.arc(cx,cy,Math.max(4,R*.06),0,6.283);ctx.fill();
  ctx.restore();ctx.textAlign="left";ctx.textBaseline="alphabetic";
}
function drawMeter(ctx,c,P,needle,state){
  const s=SPEC[c.type],x=c.x,y=c.y,m=METER[c.type==="ammeter"?"A":"V"];
  shadow(ctx,x,y,s.w,s.h,P);block(ctx,x,y,s.w,s.h,16,P);
  /* mặt kính đồng hồ */
  const dx=x-s.w/2+12,dy=y-s.h/2+12,dw=s.w-24,dh=s.h*.58;
  ctx.fillStyle=P.dial;C.rr(ctx,dx,dy,dw,dh,10);ctx.fill();
  ctx.save();C.rr(ctx,dx,dy,dw,dh,10);ctx.clip();
  dial(ctx,x,dy+dh*1.02,dh*.95,m,needle,P);
  ctx.fillStyle="rgba(255,255,255,.22)";ctx.beginPath();ctx.moveTo(dx,dy);ctx.lineTo(dx+dw*.55,dy);ctx.lineTo(dx+dw*.25,dy+dh);ctx.lineTo(dx,dy+dh);ctx.fill();
  ctx.restore();
  ctx.strokeStyle="rgba(0,0,0,.25)";ctx.lineWidth=1;C.rr(ctx,dx,dy,dw,dh,10);ctx.stroke();
  ctx.fillStyle=P.ink;ctx.font="700 11px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textAlign="center";
  ctx.fillText(c.type==="ammeter"?"AMPE KẾ 0 – 0,6 A":"VÔN KẾ 0 – 6 V",x,dy+dh+20);
  if(state&&state.msg){ctx.fillStyle=state.bad?P.hot:P.accent2;ctx.font="800 11px 'Be Vietnam Pro',system-ui,sans-serif";ctx.fillText(state.msg,x,y+s.h/2+30)}
  ctx.textAlign="left";
  ctx.strokeStyle="#9AA3B8";ctx.lineWidth=5;ctx.lineCap="round";
  for(const t of terms(c)){ctx.beginPath();ctx.moveTo(t.x,y+s.h/2-8);ctx.lineTo(t.x,t.y);ctx.stroke()}
}
const WCOL=["#E5484D","#2B2F42","#F2B33D","#3B82F6","#22C55E","#A855F7"];
function drawWire(ctx,pts,col,P,opt){
  opt=opt||{};
  ctx.save();ctx.lineCap="round";ctx.lineJoin="round";
  const path=()=>{ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);ctx.bezierCurveTo(pts[1].x,pts[1].y,pts[2].x,pts[2].y,pts[3].x,pts[3].y)};
  ctx.strokeStyle=P.shadow;ctx.lineWidth=8;ctx.translate(3,7);path();ctx.stroke();ctx.translate(-3,-7);
  if(opt.sel){ctx.shadowColor=P.sel;ctx.shadowBlur=14;ctx.strokeStyle=P.sel;ctx.lineWidth=11;path();ctx.stroke();ctx.shadowBlur=0}
  if(opt.hot){ctx.shadowColor=P.hot;ctx.shadowBlur=18;ctx.strokeStyle=P.hot;ctx.lineWidth=10;path();ctx.stroke();ctx.shadowBlur=0}
  ctx.strokeStyle=col;ctx.lineWidth=7;path();ctx.stroke();
  ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=2;ctx.translate(-1,-2);path();ctx.stroke();ctx.translate(1,2);
  /* đầu kẹp */
  for(const p of [pts[0],pts[3]]){ctx.fillStyle=col;ctx.beginPath();ctx.arc(p.x,p.y,6.5,0,6.283);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.5)";ctx.lineWidth=1.5;ctx.stroke()}
  ctx.restore();
}

window.LabCircuit={PAR,SPEC,METER,terms,solve,nets,lampR,wirePts,bez,sample,distToPoly,palette,drawBoard,post,drawBattery,drawLampBase,drawBulb,drawSwitch,dial,drawMeter,drawWire,WCOL,block,shadow};
})();
