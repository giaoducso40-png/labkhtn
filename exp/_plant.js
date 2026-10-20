/* LabKHTN · bộ máy SINH LÍ THỰC VẬT (quang hợp, hô hấp, thoát hơi nước)
   - Cành rong đuôi chó (lá mọc vòng, chẻ đôi), đèn bàn và chùm sáng, nhiệt kế, cốc thủy tinh hình trụ, bọt khí
   - Nội suy tuyến tính theo bảng số liệu nguồn; không ngoại suy ra ngoài bảng
   - Vẽ bằng Canvas 2D, toạ độ theo đơn vị cảnh */
(function(){
"use strict";
if(window.LabPlant) return;
const C=window.LabCore;

function palette(day){
  return day?{day:true,wall1:"#EEF2FC",wall2:"#DCE4F6",benchTop:"#D9C7A7",benchFront:"#B89B70",benchEdge:"#8E7350",
    ink:"#0D1433",muted:"#55608E",glass:"rgba(40,70,130,.45)",glassHi:"rgba(255,255,255,.75)",water:"rgba(80,150,230,.20)",waterTop:"rgba(80,150,230,.35)",air:"rgba(255,255,255,.55)",
    leaf:"#2E9E48",leafBack:"#1C6E30",stem:"#257F3B",cut:"#B7E4A0",lamp:"#D9480F",lampDark:"#7A2406",metal:"#64748B",bulbOn:"#FFF6C2",bulbOff:"#CBD5E1",light:"255,214,90",
    ruler:"#F4D35E",rulerInk:"#3A2E05",therm:"#EF4444",panel:"rgba(255,255,255,.9)",accent:"#7C3AED",bubble:"rgba(255,255,255,.9)"}
  :{day:false,wall1:"#121A40",wall2:"#070B20",benchTop:"#2C355C",benchFront:"#1C2342",benchEdge:"#3B4677",
    ink:"#F1F4FF",muted:"#98A3D3",glass:"rgba(200,220,255,.50)",glassHi:"rgba(255,255,255,.55)",water:"rgba(90,170,255,.20)",waterTop:"rgba(150,210,255,.38)",air:"rgba(20,30,70,.85)",
    leaf:"#3FBF5A",leafBack:"#1E7A34",stem:"#2E9E48",cut:"#C6F0B0",lamp:"#F26B3A",lampDark:"#8E2A12",metal:"#94A3B8",bulbOn:"#FFF3B0",bulbOff:"#64748B",light:"255,236,150",
    ruler:"#F4D35E",rulerInk:"#3A2E05",therm:"#F87171",panel:"rgba(14,22,56,.88)",accent:"#FF6BD6",bubble:"rgba(235,248,255,.95)"};
}

/* nội suy tuyến tính trên bảng [[x,y],…] với x tăng dần; ngoài bảng thì chặn ở giá trị đầu/cuối */
function interp(tab,x){
  if(x<=tab[0][0]) return tab[0][1];
  for(let i=1;i<tab.length;i++){const[a,ya]=tab[i-1],[b,yb]=tab[i];if(x<=b) return ya+(yb-ya)*(x-a)/(b-a)}
  return tab[tab.length-1][1];
}

/* đèn bàn: (bx,by) là tâm bóng đèn, chụp đèn mở sang phải; chân đèn đứng trên mặt bàn benchY */
function drawLamp(ctx,bx,by,benchY,on,P){
  const px=bx-74;
  /* đế */
  const bg=ctx.createLinearGradient(0,benchY-16,0,benchY);bg.addColorStop(0,C.mix(P.lamp,"#FFFFFF",.15));bg.addColorStop(1,P.lampDark);
  ctx.fillStyle=bg;ctx.beginPath();ctx.ellipse(px,benchY-6,44,9,0,0,6.283);ctx.fill();
  ctx.fillStyle=C.mix(P.lamp,"#000000",.15);C.rr(ctx,px-40,benchY-14,80,8,4);ctx.fill();
  ctx.fillStyle=on?"#34D399":"#94A3B8";ctx.beginPath();ctx.arc(px+24,benchY-11,3,0,6.283);ctx.fill();
  /* cần đèn */
  ctx.strokeStyle=P.metal;ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(px,benchY-14);ctx.lineTo(px,by-4);ctx.lineTo(bx-44,by);ctx.stroke();
  ctx.fillStyle=C.mix(P.metal,"#000000",.25);ctx.beginPath();ctx.arc(px,by-4,6,0,6.283);ctx.fill();
  /* chụp đèn */
  const sg=ctx.createLinearGradient(0,by-40,0,by+40);sg.addColorStop(0,C.mix(P.lamp,"#FFFFFF",.25));sg.addColorStop(.55,P.lamp);sg.addColorStop(1,P.lampDark);
  ctx.fillStyle=sg;ctx.beginPath();ctx.moveTo(bx-48,by-14);ctx.lineTo(bx+10,by-40);ctx.lineTo(bx+10,by+40);ctx.lineTo(bx-48,by+14);ctx.closePath();ctx.fill();
  ctx.fillStyle=C.mix(P.lamp,"#000000",.3);C.rr(ctx,bx-54,by-15,10,30,4);ctx.fill();
  /* miệng chụp và bóng đèn */
  ctx.fillStyle=on?C.mix(P.bulbOn,"#FFB703",.25):C.mix(P.lampDark,"#000000",.2);ctx.beginPath();ctx.ellipse(bx+10,by,9,40,0,0,6.283);ctx.fill();
  if(on){const gl=ctx.createRadialGradient(bx+4,by,2,bx+4,by,34);gl.addColorStop(0,"rgba(255,255,240,1)");gl.addColorStop(.4,`rgba(${P.light},.85)`);gl.addColorStop(1,`rgba(${P.light},0)`);ctx.fillStyle=gl;ctx.beginPath();ctx.arc(bx+4,by,34,0,6.283);ctx.fill()}
  ctx.fillStyle=on?P.bulbOn:P.bulbOff;ctx.beginPath();ctx.arc(bx+2,by,13,-1.25,1.25);ctx.fill();
}

/* chùm sáng từ miệng đèn tới x2; độ sáng giảm theo khoảng cách */
function drawBeam(ctx,bx,by,x2,P,k){
  if(k<=0) return;
  const x1=bx+10,h1=38,h2=h1+(x2-x1)*.24;
  const g=ctx.createLinearGradient(x1,0,x2,0);
  g.addColorStop(0,`rgba(${P.light},${(.42*k).toFixed(3)})`);g.addColorStop(1,`rgba(${P.light},${(.42*k*Math.min(1,150*150/((x2-x1)*(x2-x1)+1))).toFixed(3)})`);
  ctx.save();if(!P.day)ctx.globalCompositeOperation="lighter";
  ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x1,by-h1);ctx.lineTo(x2,by-h2);ctx.lineTo(x2,by+h2);ctx.lineTo(x1,by+h1);ctx.closePath();ctx.fill();ctx.restore();
}

/* cành rong đuôi chó cắm ngược: đầu cắt ở trên (x,yTop), ngọn ở dưới (yBot); t: thời gian để lá đung đưa */
function drawSprig(ctx,x,yTop,yBot,t,P){
  const len=yBot-yTop;
  const at=u=>({x:x+Math.sin(u*2.4+.6)*5*u+Math.sin(t*.7)*2.2*u*u,y:yTop+u*len});
  const whorls=[];let u=.05;
  while(u<.985){whorls.push(u);u+=.085-.05*u}
  const leaves=[];
  whorls.forEach((wu,k)=>{
    const p=at(wu),L=27-11*wu,n=8;
    for(let j=0;j<n;j++){
      const th=j/n*6.283+k*.55+Math.sin(t*.9+k*.4)*.06;
      const dx=Math.cos(th)*L,dy=Math.sin(th)*L*.3+L*.5;
      leaves.push({x:p.x,y:p.y,dx,dy,back:Math.sin(th)<0,L});
    }
  });
  const leaf=(o,col)=>{
    ctx.strokeStyle=col;ctx.lineWidth=1.6;ctx.lineCap="round";
    const mx=o.x+o.dx*.6,my=o.y+o.dy*.6;
    ctx.beginPath();ctx.moveTo(o.x,o.y);ctx.quadraticCurveTo(o.x+o.dx*.35,o.y+o.dy*.2,mx,my);
    const a=Math.atan2(o.dy,o.dx),r=o.L*.42;
    ctx.moveTo(mx,my);ctx.lineTo(mx+Math.cos(a-.38)*r,my+Math.sin(a-.38)*r);
    ctx.moveTo(mx,my);ctx.lineTo(mx+Math.cos(a+.38)*r,my+Math.sin(a+.38)*r);ctx.stroke();
  };
  leaves.filter(o=>o.back).forEach(o=>leaf(o,P.leafBack));
  ctx.strokeStyle=P.stem;ctx.lineWidth=3.6;ctx.lineCap="round";ctx.beginPath();
  for(let i=0;i<=24;i++){const p=at(i/24);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)}ctx.stroke();
  leaves.filter(o=>!o.back).forEach(o=>leaf(o,P.leaf));
  /* đầu cắt */
  ctx.fillStyle=P.cut;ctx.beginPath();ctx.ellipse(x,yTop,3.4,1.5,0,0,6.283);ctx.fill();
  ctx.strokeStyle=P.stem;ctx.lineWidth=.8;ctx.stroke();
  /* kẹp giữ cành chìm */
  const b=at(1);ctx.strokeStyle=P.metal;ctx.lineWidth=2;C.rr(ctx,b.x-5,b.y-14,10,22,5);ctx.stroke();
  return{cut:{x,y:yTop}};
}

/* nhiệt kế 0–50 °C: ống từ yTop tới yBot, bầu ở dưới */
function drawThermo(ctx,x,yTop,yBot,T,P,font){
  const yAt=v=>yBot-8-(yBot-8-yTop-10)*C.clamp(v,0,50)/50;
  ctx.fillStyle=P.day?"rgba(255,255,255,.85)":"rgba(230,240,255,.18)";C.rr(ctx,x-5,yTop,10,yBot-yTop,5);ctx.fill();
  ctx.strokeStyle=P.glass;ctx.lineWidth=1;C.rr(ctx,x-5,yTop,10,yBot-yTop,5);ctx.stroke();
  ctx.fillStyle=P.therm;ctx.fillRect(x-1.8,yAt(T),3.6,yBot-yAt(T));
  ctx.beginPath();ctx.arc(x,yBot+4,8,0,6.283);ctx.fill();
  ctx.fillStyle="rgba(255,255,255,.5)";ctx.beginPath();ctx.arc(x-2.5,yBot+1.5,2.4,0,6.283);ctx.fill();
  ctx.strokeStyle=P.day?"rgba(13,20,51,.55)":"rgba(241,244,255,.55)";ctx.lineWidth=1;
  for(let v=0;v<=50;v+=5){const y=yAt(v);ctx.beginPath();ctx.moveTo(x+5,y);ctx.lineTo(x+(v%10?9:13),y);ctx.stroke()}
  if(font){ctx.fillStyle=P.muted;ctx.font=font;for(let v=0;v<=50;v+=10)ctx.fillText(String(v),x+16,yAt(v)+4)}
  return yAt;
}

/* cốc thủy tinh hình trụ nhìn hơi từ trên: phần sau (thành sau + nước) và phần trước (thành trước, mép) */
function glassBack(ctx,cx,top,bot,hw,waterY,P,water){
  const ry=hw*.14;
  ctx.fillStyle=P.day?"rgba(255,255,255,.25)":"rgba(255,255,255,.04)";
  ctx.beginPath();ctx.moveTo(cx-hw,top);ctx.lineTo(cx-hw,bot);ctx.ellipse(cx,bot,hw,ry,0,Math.PI,0,true);ctx.lineTo(cx+hw,top);ctx.ellipse(cx,top,hw,ry,0,0,Math.PI,true);ctx.fill();
  if(waterY!=null){
    const g=ctx.createLinearGradient(0,waterY,0,bot);g.addColorStop(0,water||P.water);g.addColorStop(1,C.rgba(P.day?"#3B82F6":"#60A5FA",P.day?.28:.26));
    ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(cx-hw,waterY);ctx.lineTo(cx-hw,bot);ctx.ellipse(cx,bot,hw,ry,0,Math.PI,0,true);ctx.lineTo(cx+hw,waterY);ctx.ellipse(cx,waterY,hw,ry,0,0,Math.PI,false);ctx.fill();
  }
  ctx.strokeStyle=P.glass;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(cx,top,hw,ry,0,Math.PI,6.283);ctx.stroke();
}
function glassFront(ctx,cx,top,bot,hw,waterY,P,waterTop){
  const ry=hw*.14;
  if(waterY!=null){ctx.fillStyle=waterTop||P.waterTop;ctx.beginPath();ctx.ellipse(cx,waterY,hw-1,ry,0,0,6.283);ctx.fill();
    ctx.strokeStyle=P.day?"rgba(30,80,160,.45)":"rgba(190,225,255,.6)";ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(cx,waterY,hw-1,ry,0,0,Math.PI);ctx.stroke()}
  ctx.strokeStyle=P.glass;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-hw,top);ctx.lineTo(cx-hw,bot);ctx.ellipse(cx,bot,hw,ry,0,Math.PI,0,true);ctx.lineTo(cx+hw,top);ctx.stroke();
  ctx.beginPath();ctx.ellipse(cx,top,hw,ry,0,0,Math.PI);ctx.stroke();
  ctx.strokeStyle=P.glassHi;ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx-hw+9,top+18);ctx.lineTo(cx-hw+9,bot-14);ctx.stroke();
  ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(cx+hw-10,top+30);ctx.lineTo(cx+hw-10,top+90);ctx.stroke();
}

function bubble(ctx,x,y,r,P){
  ctx.fillStyle=P.day?"rgba(255,255,255,.55)":"rgba(220,240,255,.25)";ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill();
  ctx.strokeStyle=P.bubble;ctx.lineWidth=Math.max(.5,r*.28);ctx.stroke();
  ctx.fillStyle="#FFFFFF";ctx.beginPath();ctx.arc(x-r*.35,y-r*.35,r*.28,0,6.283);ctx.fill();
}

window.LabPlant={palette,interp,drawLamp,drawBeam,drawSprig,drawThermo,glassBack,glassFront,bubble};
})();
