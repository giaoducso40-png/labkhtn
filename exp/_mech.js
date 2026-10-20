/* LabKHTN · bộ máy CƠ HỌC – ĐO ĐẠC (dùng chung cho lực kế, lò xo, khối lượng riêng, áp suất, Archimedes…)
   - Lực kế lò xo có động lực học thật: m·a = P − F_A − k·x − c·v (kim dao động rồi dừng)
   - Bình tràn: mực nước, lượng tràn qua vòi, cốc hứng có vạch chia
   - Đơn vị cảnh: 12 đơn vị = 1 cm. Vẽ 2,5D bằng Canvas 2D. */
(function(){
"use strict";
if(window.LabMech) return;
const C=window.LabCore;
const U=12;            /* đơn vị cảnh trên 1 cm */

/* ---------- lực kế lò xo ---------- */
/* GHĐ 2 N; kim đi 100 đơn vị (≈ 8,3 cm) khi chịu 2 N → k = 24 N/m */
const SCALE={max:2,step:0.02,major:0.1,label:0.5,travel:100,bodyH:150,bodyW:36};
function drawStand(ctx,x,baseY,topY,P){
  ctx.fillStyle=P.metalDark;C.rr(ctx,x-56,baseY-12,112,14,6);ctx.fill();
  const g=ctx.createLinearGradient(x-5,0,x+5,0);g.addColorStop(0,P.metalDark);g.addColorStop(.5,P.metalLight);g.addColorStop(1,P.metalDark);
  ctx.fillStyle=g;ctx.fillRect(x-5,topY,10,baseY-topY-10);
}
function drawArm(ctx,x0,x1,y,P){
  ctx.fillStyle=P.metalDark;C.rr(ctx,x0-14,y-12,28,24,5);ctx.fill();
  const g=ctx.createLinearGradient(0,y-4,0,y+4);g.addColorStop(0,P.metalLight);g.addColorStop(1,P.metalDark);
  ctx.fillStyle=g;ctx.fillRect(x0,y-4,x1-x0,8);
  ctx.strokeStyle=P.metalLight;ctx.lineWidth=3;ctx.beginPath();ctx.arc(x1,y+10,7,Math.PI*1.1,Math.PI*1.9+.6,false);ctx.stroke();
}
/* trả về toạ độ móc dưới cùng */
function drawSpringScale(ctx,x,topY,ext,P,opt){
  opt=opt||{};
  const W=SCALE.bodyW,H=SCALE.bodyH;
  ctx.strokeStyle=P.metalLight;ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(x,topY-10);ctx.lineTo(x,topY);ctx.stroke();
  /* vỏ ống trong suốt */
  ctx.fillStyle=P.scaleBody;C.rr(ctx,x-W/2,topY,W,H,10);ctx.fill();
  ctx.strokeStyle=P.scaleEdge;ctx.lineWidth=1.5;C.rr(ctx,x-W/2,topY,W,H,10);ctx.stroke();
  /* lò xo bên trong */
  const y0=topY+12,y1=topY+20+ext*.85;
  ctx.strokeStyle=P.spring;ctx.lineWidth=1.6;ctx.beginPath();const turns=14;
  for(let i=0;i<=turns*8;i++){const t=i/(turns*8);const yy=y0+(y1-y0)*t;const xx=x+Math.sin(t*turns*Math.PI*2)*7;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.stroke();
  /* thang chia: vạch 0 ở topY+24 */
  const s0=topY+24;
  ctx.fillStyle=P.scaleFace;ctx.fillRect(x+3,s0-6,W/2-6,SCALE.travel+12);
  for(let i=0;i<=SCALE.max/SCALE.step;i++){const v=i*SCALE.step,yy=s0+v/SCALE.max*SCALE.travel;const maj=Math.abs(v/SCALE.major-Math.round(v/SCALE.major))<1e-6;if(!maj&&!opt.fine)continue;ctx.strokeStyle=P.scaleInk;ctx.lineWidth=maj?1:.5;ctx.beginPath();ctx.moveTo(x+3,yy);ctx.lineTo(x+(maj?11:7),yy);ctx.stroke();
    if(Math.abs(v/SCALE.label-Math.round(v/SCALE.label))<1e-6){ctx.fillStyle=P.scaleInk;ctx.font="700 7.5px system-ui,sans-serif";ctx.textBaseline="middle";ctx.fillText(C.fmt(v,1).replace(",0",""),x+12,yy)}}
  ctx.textBaseline="alphabetic";
  /* kim chỉ */
  const py=s0+ext;
  ctx.fillStyle="#E5484D";ctx.beginPath();ctx.moveTo(x-2,py);ctx.lineTo(x+8,py-3.5);ctx.lineTo(x+8,py+3.5);ctx.closePath();ctx.fill();
  ctx.fillStyle=P.ink;ctx.font="800 9px 'Lexend',system-ui,sans-serif";ctx.textAlign="center";ctx.fillText("N",x-9,topY+H-8);ctx.textAlign="left";
  /* thanh kéo và móc */
  const rodTop=topY+H-4,hook=topY+H+12+ext;
  ctx.fillStyle=P.metalLight;ctx.fillRect(x-2,rodTop,4,hook-rodTop);
  ctx.strokeStyle=P.metalLight;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,hook+5,5,-Math.PI/2,Math.PI*1.2,false);ctx.stroke();
  return {x,y:hook+10,s0};
}
/* thang lực kế phóng to (trong thẻ đọc số) */
function drawScaleZoom(g,w,h,val,P){
  g.fillStyle=P.scaleFace;C.rr(g,0,0,w,h,14);g.fill();
  const lo=Math.max(0,val-0.35),hi=Math.min(SCALE.max,lo+0.7),lo2=Math.max(0,hi-0.7);
  const y=v=>18+(v-lo2)/(0.7)*(h-36);
  for(let v=Math.ceil(lo2/SCALE.step)*SCALE.step;v<=hi+1e-9;v+=SCALE.step){const vv=Math.round(v*100)/100;const maj=Math.abs(vv*10-Math.round(vv*10))<1e-6;const half=!maj&&Math.abs(vv*20-Math.round(vv*20))<1e-6;
    g.strokeStyle=P.scaleInk;g.lineWidth=maj?2:1;g.beginPath();g.moveTo(w*.30,y(vv));g.lineTo(w*.30+(maj?w*.22:half?w*.15:w*.1),y(vv));g.stroke();
    if(maj){g.fillStyle=P.scaleInk;g.font=`700 ${Math.round(h*.065)}px 'Be Vietnam Pro',system-ui,sans-serif`;g.textBaseline="middle";g.fillText(C.fmt(vv,1),w*.56,y(vv))}}
  g.fillStyle="#E5484D";const py=y(val);g.beginPath();g.moveTo(w*.06,py-9);g.lineTo(w*.28,py);g.lineTo(w*.06,py+9);g.closePath();g.fill();
  g.strokeStyle="rgba(229,72,77,.5)";g.lineWidth=1;g.setLineDash([4,4]);g.beginPath();g.moveTo(w*.28,py);g.lineTo(w*.95,py);g.stroke();g.setLineDash([]);
  g.fillStyle=P.scaleInk;g.font=`800 ${Math.round(h*.08)}px 'Lexend',system-ui,sans-serif`;g.textBaseline="alphabetic";g.fillText("N",w*.86,h*.16);
}

/* ---------- khối trụ có vạch thể tích ---------- */
function drawCylinderBody(ctx,x,topY,wid,hgt,marks,P,opt){
  opt=opt||{};
  ctx.strokeStyle=P.metalLight;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(x,topY-12);ctx.lineTo(x,topY);ctx.stroke();
  const g=ctx.createLinearGradient(x-wid/2,0,x+wid/2,0);g.addColorStop(0,P.obj2);g.addColorStop(.35,P.obj1);g.addColorStop(1,P.obj2);
  ctx.fillStyle=g;C.rr(ctx,x-wid/2,topY,wid,hgt,5);ctx.fill();
  ctx.fillStyle="rgba(255,255,255,.25)";ctx.beginPath();ctx.ellipse(x,topY+2,wid/2-1,4,0,0,6.283);ctx.fill();
  ctx.strokeStyle=P.objInk;ctx.lineWidth=1;ctx.fillStyle=P.objInk;ctx.font="700 7.5px system-ui,sans-serif";ctx.textBaseline="middle";
  for(const m of marks){const yy=topY+hgt-m.h;ctx.beginPath();ctx.moveTo(x-wid/2,yy);ctx.lineTo(x-wid/2+8,yy);ctx.stroke();if(m.t)ctx.fillText(m.t,x-wid/2+10,yy)}
  ctx.textBaseline="alphabetic";
}

/* ---------- bình tràn và cốc hứng ---------- */
function drawCanBack(ctx,cx,botY,iw,ih,P){
  ctx.fillStyle=P.glassFill;ctx.fillRect(cx-iw/2-4,botY-ih,iw+8,ih);
}
function drawLiquidRect(ctx,cx,botY,iw,level,col,top){
  if(level<=0)return;
  ctx.fillStyle=col;ctx.fillRect(cx-iw/2,botY-level,iw,level);
  ctx.fillStyle=top;ctx.fillRect(cx-iw/2,botY-level-1.5,iw,3);
}
function drawCanFront(ctx,cx,botY,iw,ih,spoutY,spoutEnd,P){
  ctx.strokeStyle=P.glassEdge;ctx.lineWidth=2.4;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(cx-iw/2-3,botY-ih);ctx.lineTo(cx-iw/2-3,botY+3);ctx.lineTo(cx+iw/2+3,botY+3);ctx.lineTo(cx+iw/2+3,spoutY+6);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx+iw/2+3,spoutY-6);ctx.lineTo(cx+iw/2+3,botY-ih);ctx.stroke();
  /* vòi tràn */
  ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx+iw/2+3,spoutY-6);ctx.lineTo(spoutEnd.x,spoutEnd.y-6);ctx.moveTo(cx+iw/2+3,spoutY+6);ctx.lineTo(spoutEnd.x,spoutEnd.y+5);ctx.stroke();
  ctx.fillStyle="rgba(255,255,255,.18)";ctx.fillRect(cx-iw/2+4,botY-ih+8,4,ih-16);
  ctx.fillStyle=P.ink;ctx.font="700 11px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textAlign="center";ctx.fillText("Bình tràn",cx,botY+20);ctx.textAlign="left";
}
function drawCup(ctx,cx,botY,iw,ih,volume,mlPerUnit,col,top,P,label){
  /* cốc có vạch: vạch nhỏ mỗi 5 mL, số mỗi 20 mL */
  ctx.fillStyle=P.glassFill;ctx.fillRect(cx-iw/2,botY-ih,iw,ih);
  const lv=volume/mlPerUnit;drawLiquidRect(ctx,cx,botY,iw,lv,col,top);
  ctx.strokeStyle=P.glassEdge;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(cx-iw/2-2,botY-ih);ctx.lineTo(cx-iw/2-2,botY+2);ctx.lineTo(cx+iw/2+2,botY+2);ctx.lineTo(cx+iw/2+2,botY-ih);ctx.stroke();
  ctx.strokeStyle=P.grad;ctx.fillStyle=P.grad;ctx.font="600 7.5px system-ui,sans-serif";ctx.textBaseline="middle";
  for(let v=10;v<=Math.min(200,ih*mlPerUnit);v+=10){const y=botY-v/mlPerUnit;const maj=v%50===0;ctx.lineWidth=maj?1.3:.7;ctx.beginPath();ctx.moveTo(cx+iw/2-(maj?14:7),y);ctx.lineTo(cx+iw/2,y);ctx.stroke();if(maj)ctx.fillText(String(v),cx+iw/2-32,y)}
  ctx.textBaseline="alphabetic";
  if(label){ctx.fillStyle=P.ink;ctx.font="700 11px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textAlign="center";ctx.fillText(label,cx,botY+20);ctx.textAlign="left"}
}
function drawCupZoom(g,w,h,vol,P,liq){
  g.fillStyle=P.scaleFace;C.rr(g,0,0,w,h,14);g.fill();
  const lo=Math.max(0,Math.floor((vol-25)/5)*5),span=50;const y=v=>h-18-(v-lo)/span*(h-36);
  g.fillStyle=liq;g.fillRect(w*.12,y(Math.min(vol,lo+span)),w*.5,h-18-y(Math.min(vol,lo+span)));
  g.fillStyle="rgba(255,255,255,.6)";g.fillRect(w*.12,y(vol)-2,w*.5,4);
  for(let v=lo;v<=lo+span;v+=1){const maj=v%5===0,big=v%10===0;if(!maj)continue;g.strokeStyle=P.scaleInk;g.lineWidth=big?2:1;g.beginPath();g.moveTo(w*.62,y(v));g.lineTo(w*.62-(big?w*.14:w*.08),y(v));g.stroke();if(big){g.fillStyle=P.scaleInk;g.font=`700 ${Math.round(h*.065)}px 'Be Vietnam Pro',system-ui,sans-serif`;g.textBaseline="middle";g.fillText(String(v),w*.66,y(v))}}
  g.strokeStyle=P.scaleInk;g.lineWidth=2;g.beginPath();g.moveTo(w*.12,8);g.lineTo(w*.12,h-18);g.lineTo(w*.62,h-18);g.lineTo(w*.62,8);g.stroke();
  g.fillStyle=P.scaleInk;g.font=`800 ${Math.round(h*.07)}px 'Lexend',system-ui,sans-serif`;g.textBaseline="alphabetic";g.fillText("mL",w*.82,h*.16);
}

function palette(day){
  return day?{metalLight:"#C8D0E2",metalDark:"#7E89A6",scaleBody:"rgba(255,255,255,.75)",scaleEdge:"rgba(30,40,90,.45)",scaleFace:"#FFFDF5",scaleInk:"#1A1F33",spring:"#8C94AA",
    obj1:"#FFB86B",obj2:"#E07A2B",objInk:"#3A1A05",glassFill:"rgba(120,160,230,.10)",glassEdge:"rgba(34,58,120,.72)",grad:"rgba(20,40,100,.85)",ink:"#0D1433",muted:"#55608E"}
            :{metalLight:"#D9DFEE",metalDark:"#6C779A",scaleBody:"rgba(220,230,255,.20)",scaleEdge:"rgba(215,232,255,.55)",scaleFace:"#FFFDF5",scaleInk:"#1A1F33",spring:"#C9D1E6",
    obj1:"#FFB86B",obj2:"#E07A2B",objInk:"#3A1A05",glassFill:"rgba(160,200,255,.07)",glassEdge:"rgba(215,232,255,.78)",grad:"rgba(255,255,255,.85)",ink:"#F1F4FF",muted:"#98A3D3"};
}

window.LabMech={U,SCALE,drawStand,drawArm,drawSpringScale,drawScaleZoom,drawCylinderBody,drawCanBack,drawLiquidRect,drawCanFront,drawCup,drawCupZoom,palette};
})();
