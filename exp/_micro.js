/* LabKHTN · bộ máy KÍNH HIỂN VI QUANG HỌC
   - Mô hình 3D kính hiển vi (thị kính, ống kính, đĩa quay gắn vật kính, vật kính, bàn kính, kẹp giữ mẫu, đèn chiếu sáng, ốc to, ốc nhỏ, thân kính, chân kính)
   - Thị trường (vùng nhìn thấy qua thị kính) vẽ bằng Canvas 2D theo đơn vị micromet:
       đường kính thị trường = 18 mm : độ phóng đại vật kính (thị kính ×10, số trường 18 mm) → ×4: 4,5 mm; ×10: 1,8 mm; ×40: 0,45 mm; ×100: 0,18 mm
       ảnh mờ khi lệch tiêu cự, độ sâu trường ảnh giảm khi tăng độ phóng đại
   - Mẫu vật: biểu bì vảy hành, tế bào niêm mạc miệng, trứng cá, vi khuẩn sữa chua, nguyên sinh vật trong nước ao */
(function(){
"use strict";
if(window.LabMicro)return;
const C=window.LabCore;
const OBJ=[{m:4,fov:4500,dof:.25,col:"#DC2626"},{m:10,fov:1800,dof:.08,col:"#F59E0B"},{m:40,fov:450,dof:.012,col:"#2563EB"},{m:100,fov:180,dof:.004,col:"#F8FAFC",oil:true}];
/* ---------- mô hình 3D ---------- */
function build3D(R,G,o){o=o||{};const Q=G.Q;const n=new G.Node();const P={};
  const black={color:"#1F2937",rough:.45,coat:.3},cream={color:"#E7E5E4",rough:.4,coat:.3},chrome={color:"#D1D5DB",metal:.9,rough:.22};
  const add=(par,g,m,p,q)=>{const x=par.add(R.mesh(g,m));if(p)x.pos=p;if(q)x.quat=q;return x};
  /* chân kính */
  P.chan=add(n,G.box(.34,.05,.42,.02,3),cream,[0,.025,.02]);add(n,G.box(.22,.03,.26,.015,3),cream,[0,.065,.02]);
  /* đèn chiếu sáng */
  P.den=add(n,G.cylinder(.04,.02,24),black,[0,.08,.06]);const lamp=add(n,G.cylinder(.028,.004,20),{type:"unlit",color:"#57534E"},[0,.1,.06]);
  /* thân kính (cánh tay cong) */
  const arm=[];for(let i=0;i<=12;i++){const t=i/12;arm.push([0,.08+t*.42,-.12-.06*Math.sin(t*Math.PI)+(t>.75?(t-.75)*.3:0)])}
  P.than=add(n,G.tube(G.spline(arm,3),.035,14),cream);
  /* bàn kính */
  const stage=n.add(new G.Node());P.ban=add(stage,G.box(.24,.016,.22,.006,2),black,[0,0,0]);add(stage,G.cylinder(.012,.018,16),{type:"unlit",color:"#FEF3C7"},[0,-.008,.06]);
  P.kep=[];for(const s of [-1,1]){const k=add(stage,G.box(.012,.004,.09,.002,1),chrome,[s*.06,.012,.07],Q.euler(0,s*.25,0));P.kep.push(k)}
  stage.pos=[0,.25,.06];P.stageN=stage;
  /* tiêu bản */
  P.slide=add(stage,G.box(.1,.002,.03,.0008,1),{type:"glass",color:"#E0F2FE",alpha:.5},[0,.01,.06]);P.slide.visible=false;
  /* đầu kính: ống kính nghiêng, thị kính */
  const head=n.add(new G.Node());head.pos=[0,.5,0];P.headN=head;
  add(head,G.box(.09,.08,.12,.02,3),cream,[0,0,-.01]);
  const tube=head.add(new G.Node());tube.pos=[0,.03,.01];tube.quat=Q.euler(-.55,0,0);P.ong=add(tube,G.cylinder(.03,.16,24),black,[0,0,0]);
  P.thi=add(tube,G.cylinder(.026,.06,24),{color:"#111827",rough:.4},[0,.16,0]);add(tube,G.cylinder(.03,.006,24),chrome,[0,.215,0]);
  /* đĩa quay và vật kính */
  const turret=head.add(new G.Node());turret.pos=[0,-.055,.06];P.dia=add(turret,G.cylinder(.06,.025,32),chrome,[0,-.012,0]);P.turretN=turret;P.vat=[];
  OBJ.slice(0,o.nObj||4).forEach((ob,i)=>{const a=i/(o.nObj||4)*6.283;const v=turret.add(new G.Node());v.pos=[Math.cos(a)*.035,-.012,Math.sin(a)*.035];v.quat=Q.euler(Math.sin(a)*.25,0,-Math.cos(a)*.25);
    const L=.05+i*.012;add(v,G.cylinder(.015,L,18),chrome,[0,-L,0]);add(v,G.cylinder(.0155,.006,18),{color:ob.col,rough:.4},[0,-L*.45,0]);add(v,G.cylinder(.008,.006,14),{color:"#111827"},[0,-L-.004,0]);P.vat.push(v)});
  /* ốc to, ốc nhỏ ở hai bên thân */
  P.ocTo=[];P.ocNho=[];for(const s of [-1,1]){const big=add(n,G.cylinder(.045,.02,28),black,[s*.06,.25,-.12],Q.euler(0,0,Math.PI/2));const sm=add(n,G.cylinder(.025,.02,22),black,[s*.08,.25,-.12],Q.euler(0,0,Math.PI/2));P.ocTo.push(big);P.ocNho.push(sm)}
  n.P=P;n.lamp=lamp;
  n.setLight=on=>{lamp.mat.color=G.hex(on?"#FFF7D6":"#57534E")};
  n.setObj=i=>{const a=-i/(o.nObj||4)*6.283-Math.PI/2;turret.quat=Q.euler(0,a,0)};
  n.setStage=h=>{stage.pos=[0,.25+h,.06]};
  n.knobs=(c,f)=>{P.ocTo.forEach(k=>k.quat=Q.mul(Q.euler(0,0,Math.PI/2),Q.euler(0,c,0)));P.ocNho.forEach(k=>k.quat=Q.mul(Q.euler(0,0,Math.PI/2),Q.euler(0,f,0)))};
  return n}
/* ---------- mẫu vật ---------- */
function rng(s){return()=>{s=(s*16807)%2147483647;return s/2147483647}}
const SPECS={};
SPECS.hanh=(()=>{const r=rng(19);const cells=[];let y=-2400;while(y<2400){const h=55+r()*30;let x=-2400-r()*300;while(x<2400){const w=180+r()*170;cells.push({x,y,w,h,sk:(r()-.5)*14,nx:.3+r()*.4,ny:.35+r()*.3,nr:7+r()*4});x+=w}y+=h}
  return{ten:"Biểu bì vảy hành",draw(ctx,um,t,o){const st=o.stain;ctx.fillStyle=st?"#F4E3B8":"#F3F1EA";ctx.fillRect(-3000,-3000,6000,6000);
      ctx.lineWidth=Math.max(3,1.3/um);for(const c of cells){if(c.x+c.w<o.v[0]||c.x>o.v[2]||c.y+c.h<o.v[1]||c.y>o.v[3])continue;
        ctx.fillStyle=st?"rgba(214,170,90,.18)":"rgba(220,210,190,.12)";ctx.strokeStyle=st?"#9A6A1E":"#B7AE96";ctx.beginPath();ctx.moveTo(c.x,c.y+c.sk);ctx.lineTo(c.x+c.w,c.y);ctx.lineTo(c.x+c.w,c.y+c.h);ctx.lineTo(c.x,c.y+c.h+c.sk);ctx.closePath();ctx.fill();ctx.stroke();
        ctx.fillStyle=st?"#7C4A0C":"rgba(150,140,120,.45)";ctx.beginPath();ctx.ellipse(c.x+c.w*c.nx,c.y+c.h*c.ny,c.nr*1.25,c.nr,0,0,6.283);ctx.fill();if(st){ctx.fillStyle="#4A2A04";ctx.beginPath();ctx.arc(c.x+c.w*c.nx+2,c.y+c.h*c.ny-1,2.4,0,6.283);ctx.fill()}}},
    parts:[{t:"Vách tế bào",p:[cells[0].x,cells[0].y]},{t:"Nhân",p:null}],cells}})();
SPECS.mieng=(()=>{const r=rng(5);const cells=[];for(let i=0;i<70;i++){const cx=(r()-.5)*3200,cy=(r()-.5)*3200;const n=9,R0=30+r()*18;const pts=[];for(let k=0;k<n;k++){const a=k/n*6.283+r()*.3;pts.push([cx+Math.cos(a)*R0*(.75+r()*.45),cy+Math.sin(a)*R0*(.75+r()*.45)])}cells.push({cx,cy,pts,nr:5+r()*2})}
  return{ten:"Tế bào niêm mạc miệng",draw(ctx,um,t,o){const st=o.stain;ctx.fillStyle="#EEF2F7";ctx.fillRect(-3000,-3000,6000,6000);
    for(const c of cells){ctx.fillStyle=st?"rgba(96,165,250,.25)":"rgba(200,200,210,.25)";ctx.strokeStyle=st?"rgba(37,99,235,.6)":"rgba(140,140,160,.6)";ctx.lineWidth=1.4;ctx.beginPath();c.pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fill();ctx.stroke();
      ctx.fillStyle=st?"#1E3A8A":"rgba(120,120,140,.5)";ctx.beginPath();ctx.ellipse(c.cx,c.cy,c.nr*1.2,c.nr,0,0,6.283);ctx.fill()}}}})();
SPECS.trungca=(()=>{const r=rng(31);const eggs=[];for(let i=0;i<34;i++){eggs.push({x:(r()-.5)*7000,y:(r()-.5)*7000,r:520+r()*120,oil:r()})}
  return{ten:"Trứng cá",draw(ctx,um,t,o){ctx.fillStyle="#E9E4D8";ctx.fillRect(-6000,-6000,12000,12000);
    for(const e of eggs){const g=ctx.createRadialGradient(e.x-e.r*.3,e.y-e.r*.35,e.r*.1,e.x,e.y,e.r);g.addColorStop(0,"rgba(255,248,220,.95)");g.addColorStop(.6,"rgba(250,204,120,.85)");g.addColorStop(1,"rgba(217,140,40,.9)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,6.283);ctx.fill();
      ctx.strokeStyle="rgba(160,100,30,.6)";ctx.lineWidth=12;ctx.stroke();ctx.fillStyle="rgba(255,210,90,.9)";ctx.beginPath();ctx.arc(e.x+e.r*(.2+e.oil*.3),e.y+e.r*.1,e.r*.16,0,6.283);ctx.fill();
      ctx.fillStyle="rgba(120,70,20,.35)";ctx.beginPath();ctx.arc(e.x-e.r*.35,e.y-e.r*.3,e.r*.12,0,6.283);ctx.fill()}}}})();
SPECS.suachua=(()=>{const r=rng(7);const rods=[];for(let i=0;i<900;i++){const x=(r()-.5)*600,y=(r()-.5)*600;const a=r()*6.283;const n=r()<.4?2+Math.floor(r()*3):1;for(let k=0;k<n;k++)rods.push({x:x+Math.cos(a)*k*3.4,y:y+Math.sin(a)*k*3.4,a,l:2.4+r()*1.4})}
  return{ten:"Vi khuẩn trong sữa chua (Lactobacillus)",draw(ctx,um,t,o){ctx.fillStyle=o.stain?"#F5EEF8":"#F1F1EE";ctx.fillRect(-1000,-1000,2000,2000);ctx.lineCap="round";
    ctx.strokeStyle=o.stain?"rgba(109,40,217,.9)":"rgba(90,90,90,.55)";ctx.lineWidth=.9;for(const b of rods){ctx.beginPath();ctx.moveTo(b.x-Math.cos(b.a)*b.l/2,b.y-Math.sin(b.a)*b.l/2);ctx.lineTo(b.x+Math.cos(b.a)*b.l/2,b.y+Math.sin(b.a)*b.l/2);ctx.stroke()}
    ctx.fillStyle="rgba(200,190,170,.25)";for(let i=0;i<60;i++){const x=Math.sin(i*12.9)*280,y=Math.cos(i*7.3)*280;ctx.beginPath();ctx.arc(x,y,6+i%5*2,0,6.283);ctx.fill()}}}})();
SPECS.aoho=(()=>{const r=rng(13);const org=[];for(let i=0;i<9;i++)org.push({k:"giay",x:(r()-.5)*1400,y:(r()-.5)*1400,a:r()*6.283,v:120+r()*80,w:(r()-.5)*.8,ph:r()*6});
  for(let i=0;i<14;i++)org.push({k:"roi",x:(r()-.5)*1400,y:(r()-.5)*1400,a:r()*6.283,v:40+r()*30,w:(r()-.5)*1.2,ph:r()*6});for(let i=0;i<3;i++)org.push({k:"bh",x:(r()-.5)*1000,y:(r()-.5)*1000,a:r()*6.283,v:6,w:.1,ph:r()*6});
  const debris=[];for(let i=0;i<120;i++)debris.push({x:(r()-.5)*2400,y:(r()-.5)*2400,s:4+r()*16,c:r()});
  function giay(ctx,o,t){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.a+Math.sin(t*3+o.ph)*.08);const L=210,W=62;ctx.fillStyle="rgba(205,215,170,.55)";ctx.strokeStyle="rgba(110,120,80,.8)";ctx.lineWidth=2;ctx.beginPath();
    ctx.moveTo(L/2,0);ctx.bezierCurveTo(L/2,W/2,L*.1,W/2,0,W*.38);ctx.bezierCurveTo(-L*.15,W*.3,-L/2,W/2,-L/2,0);ctx.bezierCurveTo(-L/2,-W/2,-L*.15,-W/2,0,-W*.42);ctx.bezierCurveTo(L*.15,-W*.42,L/2,-W/2,L/2,0);ctx.fill();ctx.stroke();
    ctx.strokeStyle="rgba(110,120,80,.5)";ctx.lineWidth=1;for(let i=0;i<40;i++){const u=i/40*6.283;const x=Math.cos(u)*L/2,y=Math.sin(u)*W*.46;const nx=Math.cos(u),ny=Math.sin(u);const w=Math.sin(t*20+i)*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+nx*7+w,y+ny*7);ctx.stroke()}
    ctx.fillStyle="rgba(150,140,110,.6)";ctx.beginPath();ctx.ellipse(0,0,22,13,0,0,6.283);ctx.fill();ctx.fillStyle="rgba(180,210,230,.7)";ctx.beginPath();ctx.arc(55,0,10+Math.sin(t*2)*3,0,6.283);ctx.fill();ctx.beginPath();ctx.arc(-60,0,10+Math.cos(t*2)*3,0,6.283);ctx.fill();
    ctx.fillStyle="rgba(120,110,80,.5)";ctx.beginPath();ctx.ellipse(10,W*.25,16,6,.3,0,6.283);ctx.fill();ctx.restore()}
  function roi(ctx,o,t){ctx.save();ctx.translate(o.x,o.y);ctx.rotate(o.a);const L=55+Math.sin(t*4+o.ph)*6,W=14-Math.sin(t*4+o.ph)*2;ctx.fillStyle="rgba(74,160,60,.75)";ctx.beginPath();ctx.ellipse(0,0,L/2,W/2,0,0,6.283);ctx.fill();
    ctx.fillStyle="rgba(30,110,30,.8)";for(let i=0;i<6;i++){ctx.beginPath();ctx.arc(-L*.3+i*L*.11,Math.sin(i*2)*W*.2,2.4,0,6.283);ctx.fill()}ctx.fillStyle="#DC2626";ctx.beginPath();ctx.arc(L*.36,-2,2.4,0,6.283);ctx.fill();
    ctx.strokeStyle="rgba(60,90,50,.8)";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(L/2,0);for(let i=1;i<=12;i++)ctx.lineTo(L/2+i*4.5,Math.sin(i*.9-t*14)*5);ctx.stroke();ctx.restore()}
  function bh(ctx,o,t){ctx.save();ctx.translate(o.x,o.y);ctx.fillStyle="rgba(190,190,200,.45)";ctx.strokeStyle="rgba(120,120,135,.7)";ctx.lineWidth=2;ctx.beginPath();for(let i=0;i<=40;i++){const a=i/40*6.283;const rr=120+28*Math.sin(a*3+t*.5+o.ph)+18*Math.sin(a*5-t*.35)+30*Math.max(0,Math.sin(a-t*.2+o.ph))**4;i?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle="rgba(130,130,150,.6)";ctx.beginPath();ctx.ellipse(10,-8,22,17,0,0,6.283);ctx.fill();ctx.fillStyle="rgba(160,200,230,.6)";ctx.beginPath();ctx.arc(-40,30,12,0,6.283);ctx.fill();for(let i=0;i<14;i++){ctx.fillStyle="rgba(140,130,110,.5)";ctx.beginPath();ctx.arc(Math.sin(i*3.1)*70,Math.cos(i*2.3)*60,4,0,6.283);ctx.fill()}ctx.restore()}
  return{ten:"Nước ao (nguyên sinh vật)",org,step(dt){for(const o of org){o.a+=o.w*dt*(o.k==="bh"?.2:1);o.x+=Math.cos(o.a)*o.v*dt;o.y+=Math.sin(o.a)*o.v*dt;if(Math.hypot(o.x,o.y)>900){o.a+=Math.PI*.9;o.x*=.98;o.y*=.98}}},
    draw(ctx,um,t,o){ctx.fillStyle="#EEF3EA";ctx.fillRect(-3000,-3000,6000,6000);for(const d of debris){ctx.fillStyle=`rgba(${120+d.c*60},${130+d.c*50},${90},.35)`;ctx.beginPath();ctx.arc(d.x,d.y,d.s,0,6.283);ctx.fill()}
      for(const g of org){if(g.k==="giay")giay(ctx,g,t);else if(g.k==="roi")roi(ctx,g,t);else bh(ctx,g,t)}}}})();
/* ---------- vẽ thị trường ---------- */
function eyepiece(ctx,cx,cy,R,spec,st){const S=SPECS[spec];const ob=st.lens?{fov:st.lens.fov,dof:st.lens.dof}:OBJ[st.obj];const um=(2*R)/ob.fov;   /* px trên mỗi micromet */
  ctx.save();ctx.beginPath();ctx.arc(cx,cy,R,0,6.283);ctx.clip();
  ctx.fillStyle="#000";ctx.fillRect(cx-R,cy-R,2*R,2*R);
  const light=st.light==null?1:st.light;if(light>0&&S){const blur=st.focus==null?0:C.clamp(Math.abs(st.focus)/ob.dof*1.6,0,16);
    ctx.save();if(blur>.3)ctx.filter=`blur(${blur.toFixed(1)}px)`;ctx.translate(cx,cy);ctx.scale(um,um);ctx.translate(-(st.pan?st.pan[0]:0),-(st.pan?st.pan[1]:0));
    const half=ob.fov/2*1.1;const px=st.pan?st.pan[0]:0,py=st.pan?st.pan[1]:0;S.draw(ctx,um,st.t||0,{stain:st.stain,v:[px-half,py-half,px+half,py+half]});ctx.restore();
    ctx.fillStyle=`rgba(0,0,0,${(1-light)*.85})`;ctx.fillRect(cx-R,cy-R,2*R,2*R)}
  const vg=ctx.createRadialGradient(cx,cy,R*.55,cx,cy,R);vg.addColorStop(0,"rgba(0,0,0,0)");vg.addColorStop(1,"rgba(0,0,0,.55)");ctx.fillStyle=vg;ctx.fillRect(cx-R,cy-R,2*R,2*R);
  /* thước vạch thị kính */
  if(st.scale){const bar=ob.fov>=1800?500:ob.fov>=450?100:50;const w=bar*um;ctx.fillStyle="rgba(255,255,255,.85)";ctx.fillRect(cx+R*.2,cy+R*.75,w,3);ctx.font="700 12px system-ui";ctx.fillText(bar>=1000?`${bar/1000} mm`:`${bar} µm`,cx+R*.2,cy+R*.75-6)}
  ctx.restore();ctx.strokeStyle="#111827";ctx.lineWidth=10;ctx.beginPath();ctx.arc(cx,cy,R+5,0,6.283);ctx.stroke()}
window.LabMicro={OBJ,build3D,SPECS,eyepiece};
})();
