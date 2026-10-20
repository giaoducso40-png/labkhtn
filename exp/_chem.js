/* LabKHTN · bộ máy BÀN THÍ NGHIỆM HÓA HỌC (dùng chung cho các bài Hóa có cốc, cân, rót, kết tủa)
   - Dữ liệu chất: nguyên tử khối theo SGK KHTN (Ba 137, Cl 35,5, Na 23, S 32, O 16 …)
   - Hỗn hợp trong cốc: theo dõi nước (g) và lượng chất (mmol) → khối lượng luôn tính từ lượng chất, nên bảo toàn khối lượng là hệ quả của mô hình, không phải số gán sẵn
   - Vẽ 2,5D bằng Canvas 2D: cốc thủy tinh, cân điện tử, bàn, kính lúp hạt */
(function(){
"use strict";
if(window.LabChem) return;
const C=window.LabCore;

/* ---------- 1. Dữ liệu chất và phản ứng ---------- */
const AT={H:1,C:12,N:14,O:16,Na:23,Mg:24,Al:27,S:32,Cl:35.5,K:39,Ca:40,Fe:56,Cu:64,Zn:65,Ag:108,Ba:137};
const SP={
  BaCl2:{f:"BaCl₂",ten:"barium chloride",at:{Ba:1,Cl:2},tan:true,ion:{Ba:1,Cl:2}},
  Na2SO4:{f:"Na₂SO₄",ten:"sodium sulfate",at:{Na:2,S:1,O:4},tan:true,ion:{Na:2,SO4:1}},
  BaSO4:{f:"BaSO₄",ten:"barium sulfate",at:{Ba:1,S:1,O:4},tan:false,mau:"#F3F5FF"},
  NaCl:{f:"NaCl",ten:"sodium chloride",at:{Na:1,Cl:1},tan:true,ion:{Na:1,Cl:1}}
};
for(const k in SP){SP[k].M=Object.entries(SP[k].at).reduce((s,[e,n])=>s+AT[e]*n,0)}
/* Phản ứng: hệ số nguyên; chất không tan đi vào phần rắn lơ lửng */
const RX=[{id:"BaCl2+Na2SO4",tg:{BaCl2:1,Na2SO4:1},sp:{BaSO4:1,NaCl:2}}];

/* ---------- 2. Hỗn hợp trong một cốc ---------- */
class Mix{
  constructor(){this.V=0;this.water=0;this.n={};this.susp={};this.sed={}}
  static solution(sp,CM,V,d){const m=new Mix();const n=CM*V;m.V=V;m.n[sp]=n;m.water=V*d-n*SP[sp].M/1000;m.d=d;return m}
  mass(){let s=this.water;for(const o of [this.n,this.susp,this.sed])for(const k in o)s+=o[k]*SP[k].M/1000;return s}
  solid(){let s=0;for(const o of [this.susp,this.sed])for(const k in o)s+=o[k];return s}
  /* lấy ra dV mL phần lỏng (kèm chất tan và chất rắn lơ lửng, theo tỉ lệ) */
  take(dV){
    const o=new Mix(); if(this.V<=1e-9||dV<=0) return o;
    const f=Math.min(1,dV/this.V);
    o.V=this.V*f;o.water=this.water*f;this.V-=o.V;this.water-=o.water;
    for(const k in this.n){const a=this.n[k]*f;o.n[k]=a;this.n[k]-=a}
    for(const k in this.susp){const a=this.susp[k]*f;o.susp[k]=a;this.susp[k]-=a}
    return o;
  }
  add(o){this.V+=o.V;this.water+=o.water;for(const k in o.n)this.n[k]=(this.n[k]||0)+o.n[k];for(const k in o.susp)this.susp[k]=(this.susp[k]||0)+o.susp[k];for(const k in o.sed)this.sed[k]=(this.sed[k]||0)+o.sed[k]}
  /* cho phản ứng xảy ra hết theo chất hết trước; trả về lượng phản ứng (mmol theo hệ số 1) */
  react(){
    let tot=0;
    for(const rx of RX){
      let xi=Infinity;for(const r in rx.tg)xi=Math.min(xi,(this.n[r]||0)/rx.tg[r]);
      if(!(xi>1e-12)) continue;
      for(const r in rx.tg){this.n[r]-=rx.tg[r]*xi;if(this.n[r]<1e-12)this.n[r]=0}
      for(const p in rx.sp){const a=rx.sp[p]*xi;if(SP[p].tan)this.n[p]=(this.n[p]||0)+a;else this.susp[p]=(this.susp[p]||0)+a}
      tot+=xi;
    }
    return tot;
  }
  /* chuyển một phần chất rắn lơ lửng thành lắng đáy (theo tỉ lệ hạt minh họa đã lắng) */
  settleTo(frac){for(const k in this.susp){const tot=this.susp[k]+(this.sed[k]||0);const want=tot*frac;this.sed[k]=want;this.susp[k]=tot-want}}
  atoms(){const a={};for(const o of [this.n,this.susp,this.sed])for(const k in o)for(const e in SP[k].at)a[e]=(a[e]||0)+o[k]*SP[k].at[e];return a}
  /* ion tự do (mmol) cho kính lúp hạt */
  ions(){const r={};for(const k in this.n){const io=SP[k].ion;if(!io)continue;for(const i in io)r[i]=(r[i]||0)+this.n[k]*io[i]}return r}
}

/* ---------- 3. Cốc thủy tinh 100 mL ---------- */
/* Đơn vị cảnh: cốc rộng 104, cao 150. Lòng cốc rộng 97 ≈ đường kính 50 mm → 1 mL ≈ 0,988 đơn vị chiều cao */
const BK={W:104,H:150,wall:3.5,bot:5,K:0.988,E:0.16};
BK.wi=BK.W/2-BK.wall;
BK.SPX=BK.W/2+3;BK.SPY=-BK.H+1;   /* mỏ rót ở mép phải miệng cốc (toạ độ cục bộ, gốc = tâm đáy) */
class Beaker{
  constructor(o){Object.assign(this,{id:"A",name:"Cốc A",x:0,y:0,glass:52,mix:new Mix(),tilt:0,pv:null,swirl:0,ppt:[],sticker:null,lift:0,highlight:0,wet:0,seed:1},o);this.rand=C.rng(this.seed)}
  get V(){return this.mix.V}
  mass(){return this.glass+this.mix.mass()}
  pivot(){return this.pv||{x:this.x+BK.SPX,y:this.y+BK.SPY}}
  /* toạ độ cục bộ (gốc tâm đáy) → thế giới */
  toWorld(lx,ly){const pv=this.pivot(),c=Math.cos(this.tilt),s=Math.sin(this.tilt);const dx=lx-BK.SPX,dy=ly-BK.SPY;return{x:pv.x+dx*c-dy*s,y:pv.y+dx*s+dy*c}}
  hit(p){if(this.tilt)return false;return p.x>this.x-BK.W/2-8&&p.x<this.x+BK.W/2+8&&p.y>this.y-BK.H-14&&p.y<this.y+8}
  topY(){return this.y-BK.H}
  /* mặt thoáng khi cốc nghiêng: tìm y sao cho diện tích phần lỏng (2D) bằng thể tích × hệ số */
  liquidPoly(){
    const V=this.V; if(V<=1e-6) return null;
    const corners=[[-BK.wi,-BK.H+3],[BK.wi,-BK.H+3],[BK.wi,-BK.bot],[-BK.wi,-BK.bot]].map(([x,y])=>this.toWorld(x,y));
    const target=V*BK.K*2*BK.wi;
    let lo=Math.min(...corners.map(p=>p.y)),hi=Math.max(...corners.map(p=>p.y));
    let poly=null,ys=hi;
    for(let i=0;i<40;i++){
      const mid=(lo+hi)/2;const pl=clipBelow(corners,mid);const a=area(pl);
      if(a>target){lo=mid}else{hi=mid}
      ys=mid;poly=pl;
    }
    return{poly,ys};
  }
  /* độ cao cột lỏng phía trên mép mỏ rót (đơn vị cảnh); >0 thì chất lỏng chảy ra */
  head(){
    if(!this.tilt) return 0;
    const lp=this.liquidPoly(); if(!lp) return 0;
    const lip=this.toWorld(BK.SPX-1,BK.SPY+1);
    return Math.max(0,lip.y-lp.ys);
  }
}
function clipBelow(poly,ys){ /* giữ phần y >= ys (phía dưới mặt thoáng, trục y hướng xuống) */
  const out=[];
  for(let i=0;i<poly.length;i++){
    const a=poly[i],b=poly[(i+1)%poly.length];
    const ina=a.y>=ys,inb=b.y>=ys;
    if(ina)out.push(a);
    if(ina!==inb){const t=(ys-a.y)/(b.y-a.y);out.push({x:a.x+(b.x-a.x)*t,y:ys})}
  }
  return out;
}
function area(p){let s=0;for(let i=0;i<p.length;i++){const a=p[i],b=p[(i+1)%p.length];s+=a.x*b.y-b.x*a.y}return Math.abs(s)/2}

/* Bảng màu theo nền tối / sáng */
function palette(day){
  return day?{
    wall1:"#E9EEFB",wall2:"#D5DDF2",bench1:"#B8C3DA",bench2:"#9AA7C3",benchEdge:"#F4F7FF",benchFace:"#7E8AA6",
    glassEdge:"rgba(34,58,120,.72)",glassThin:"rgba(34,58,120,.35)",glassFill:"rgba(120,160,230,.10)",shine:"rgba(255,255,255,.85)",
    liquid:"rgba(60,100,190,.30)",liquidTop:"rgba(70,120,215,.38)",liquidEdge:"rgba(40,90,190,.65)",grad:"rgba(20,40,100,.85)",
    fog:"248,250,255",fogBoost:1.6,fogEdge:"rgba(90,100,140,.55)",shadow:"rgba(20,30,70,.28)",ink:"#0D1433",muted:"#55608E",
    lensBg1:"#1D2C5E",lensBg2:"#0B1433",ring1:"#C9D2EA",ring2:"#7E8AA6",accent:"#7C3AED",accent2:"#DB2777"
  }:{
    wall1:"#0E1638",wall2:"#070B20",bench1:"#1A2350",bench2:"#10173A",benchEdge:"#3A4A8C",benchFace:"#0A0F2A",
    glassEdge:"rgba(215,232,255,.78)",glassThin:"rgba(215,232,255,.32)",glassFill:"rgba(160,200,255,.07)",shine:"rgba(255,255,255,.75)",
    liquid:"rgba(130,185,255,.20)",liquidTop:"rgba(190,225,255,.30)",liquidEdge:"rgba(190,225,255,.55)",grad:"rgba(255,255,255,.85)",
    fog:"240,244,255",fogEdge:"rgba(255,255,255,.35)",shadow:"rgba(0,0,0,.45)",ink:"#F1F4FF",muted:"#98A3D3",
    lensBg1:"#16245A",lensBg2:"#070C24",ring1:"#E3E8F7",ring2:"#7D88B5",accent:"#A66BFF",accent2:"#FF6BD6"
  };
}

/* ---------- 4. Vẽ ---------- */
function drawShadow(ctx,x,y,rx,ry,col){const g=ctx.createRadialGradient(x,y,0,x,y,rx);g.addColorStop(0,col);g.addColorStop(1,"rgba(0,0,0,0)");ctx.save();ctx.translate(x,y);ctx.scale(1,ry/rx);ctx.translate(-x,-y);ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,rx,0,6.283);ctx.fill();ctx.restore()}

function drawBeaker(ctx,b,P,opt){
  opt=opt||{};
  const {W,H,bot,K,E,wi}=BK,ro=W/2;
  /* bóng đổ trên mặt bàn/đĩa cân (chỉ khi đứng thẳng) */
  if(!b.tilt&&!opt.noShadow) drawShadow(ctx,b.x+6,b.y+2+b.lift*.3,ro+18+b.lift*.4,12,P.shadow);
  ctx.save();
  const pv=b.pivot();
  ctx.translate(pv.x,pv.y);ctx.rotate(b.tilt);ctx.translate(-BK.SPX,-BK.SPY);
  if(b.swirl){ctx.rotate(b.swirl)}
  /* thành sau */
  const gb=ctx.createLinearGradient(-ro,0,ro,0);gb.addColorStop(0,P.glassFill);gb.addColorStop(.5,"rgba(255,255,255,0.02)");gb.addColorStop(1,P.glassFill);
  ctx.fillStyle=gb;ctx.beginPath();ctx.moveTo(-ro,-H);ctx.lineTo(-ro,-2);ctx.ellipse(0,-2,ro,ro*E,0,Math.PI,0,true);ctx.lineTo(ro,-H);ctx.ellipse(0,-H,ro,ro*E,0,0,Math.PI,true);ctx.closePath();ctx.fill();
  ctx.strokeStyle=P.glassThin;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,-H,ro,ro*E,0,Math.PI,0,false);ctx.stroke();
  ctx.restore();

  /* chất lỏng */
  if(b.V>1e-4){
    if(!b.tilt){
      ctx.save();
      ctx.translate(b.x,b.y);if(b.swirl)ctx.rotate(b.swirl);
      const h=b.V*K,ys=-bot-h;
      const body=()=>{ctx.beginPath();ctx.moveTo(-wi,ys);ctx.lineTo(-wi,-bot);ctx.ellipse(0,-bot,wi,wi*E,0,Math.PI,0,true);ctx.lineTo(wi,ys);ctx.ellipse(0,ys,wi,wi*E,0,0,Math.PI,true);ctx.closePath()};
      body();
      const gl=ctx.createLinearGradient(-wi,0,wi,0);gl.addColorStop(0,P.liquid);gl.addColorStop(.45,P.liquid.replace(/[\d.]+\)$/,m=>(parseFloat(m)*.6)+")"));gl.addColorStop(1,P.liquid);
      ctx.fillStyle=gl;ctx.fill();
      /* kết tủa: lớp lắng + đám vẩn đục + hạt */
      if(b.ppt.length){
        ctx.save();body();ctx.clip();
        const bins=14,cnt=new Array(bins).fill(0);let settled=0;
        for(const q of b.ppt){if(q.st){settled++;continue}const k=Math.min(bins-1,Math.max(0,Math.floor(q.y/Math.max(1,h)*bins)));cnt[k]++}
        const gf=ctx.createLinearGradient(0,-bot,0,ys);
        const dens=(b.fogScale||0.02)*(P.fogBoost||1);
        for(let i=0;i<bins;i++){const a=Math.min(.82,cnt[i]*dens);gf.addColorStop((i+.5)/bins,`rgba(${P.fog},${a.toFixed(3)})`)}
        ctx.fillStyle=gf;ctx.fillRect(-wi,ys-wi*E,2*wi,h+2*wi*E+bot);
        for(const q of b.ppt){if(q.st)continue;ctx.fillStyle=`rgba(${P.fog},${q.a})`;ctx.beginPath();ctx.arc(q.x,-bot-q.y,q.r,0,6.283);ctx.fill()}
        if(settled){const th=Math.min(5,1.2+settled/b.ppt.length*3.4);ctx.fillStyle=`rgba(${P.fog},.95)`;ctx.beginPath();ctx.ellipse(0,-bot-th*.4,wi-1,wi*E+th*.5,0,0,6.283);ctx.fill();
          ctx.strokeStyle=P.fogEdge;ctx.lineWidth=.8;ctx.beginPath();ctx.ellipse(0,-bot-th*.4,wi-1,wi*E+th*.5,0,Math.PI,0,false);ctx.stroke()}
        ctx.restore();
      }
      /* mặt thoáng */
      ctx.fillStyle=P.liquidTop;ctx.beginPath();ctx.ellipse(0,ys,wi,wi*E,0,0,6.283);ctx.fill();
      ctx.strokeStyle=P.liquidEdge;ctx.lineWidth=1.3;ctx.beginPath();ctx.ellipse(0,ys,wi,wi*E,0,0,6.283);ctx.stroke();
      if(b.cloudTop){ctx.fillStyle=`rgba(${P.fog},${Math.min(.6,b.cloudTop)})`;ctx.beginPath();ctx.ellipse(0,ys,wi-2,wi*E-1,0,0,6.283);ctx.fill()}
      ctx.restore();
    }else{
      const lp=b.liquidPoly();
      if(lp&&lp.poly.length>2){
        ctx.save();ctx.beginPath();lp.poly.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();
        ctx.fillStyle=P.liquid;ctx.fill();
        if(b.ppt.length){ctx.fillStyle=`rgba(${P.fog},.35)`;ctx.fill()}
        /* đường mặt thoáng */
        const top=lp.poly.filter(p=>Math.abs(p.y-lp.ys)<.01);
        if(top.length>=2){ctx.strokeStyle=P.liquidEdge;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(top[0].x,top[0].y);ctx.lineTo(top[top.length-1].x,top[top.length-1].y);ctx.stroke()}
        ctx.restore();
      }
    }
  }

  /* thành trước, vạch chia, nhãn */
  ctx.save();
  ctx.translate(pv.x,pv.y);ctx.rotate(b.tilt);ctx.translate(-BK.SPX,-BK.SPY);
  if(b.swirl)ctx.rotate(b.swirl);
  if(b.highlight){ctx.save();ctx.shadowColor=P.accent;ctx.shadowBlur=22*b.highlight;ctx.strokeStyle=C.rgba(P.accent.startsWith("#")?P.accent:"#A66BFF",.55*b.highlight);ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-ro-4,-H-6);ctx.lineTo(-ro-4,0);ctx.lineTo(ro+4,0);ctx.lineTo(ro+4,-H-6);ctx.stroke();ctx.restore()}
  ctx.strokeStyle=P.glassEdge;ctx.lineCap="round";ctx.lineJoin="round";
  ctx.lineWidth=2.2;
  ctx.beginPath();ctx.moveTo(-ro,-H+1);ctx.lineTo(-ro,-3);ctx.stroke();
  ctx.beginPath();ctx.moveTo(ro,-H+1);ctx.lineTo(ro,-3);ctx.stroke();
  ctx.lineWidth=2.6;ctx.beginPath();ctx.ellipse(0,-2,ro,ro*E,0,Math.PI,0,true);ctx.stroke();
  ctx.lineWidth=1.2;ctx.strokeStyle=P.glassThin;ctx.beginPath();ctx.ellipse(0,-bot,wi,wi*E,0,Math.PI,0,true);ctx.stroke();
  /* miệng cốc có gờ + mỏ rót */
  ctx.strokeStyle=P.glassEdge;ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(0,-H,ro,ro*E,0,0,Math.PI,false);ctx.stroke();
  ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(ro-3,-H+3);ctx.quadraticCurveTo(ro+3,-H+2,ro+7,-H-3);ctx.stroke();
  /* vệt sáng */
  const s1=ctx.createLinearGradient(0,-H,0,0);s1.addColorStop(0,"rgba(255,255,255,0)");s1.addColorStop(.25,P.shine);s1.addColorStop(.8,"rgba(255,255,255,0.05)");s1.addColorStop(1,"rgba(255,255,255,0)");
  ctx.globalAlpha=.5;ctx.fillStyle=s1;ctx.fillRect(-ro+5,-H+10,3.2,H-22);ctx.globalAlpha=.32;ctx.fillRect(ro-15,-H+16,7,H-40);ctx.globalAlpha=1;
  /* vạch chia 10 mL, số ở các vạch 20 */
  ctx.strokeStyle=P.grad;ctx.fillStyle=P.grad;ctx.font="600 9px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textBaseline="middle";
  for(let v=10;v<=100;v+=10){const y=-bot-v*K;const major=v%20===0;ctx.lineWidth=major?1.4:1;ctx.beginPath();ctx.moveTo(-ro+11,y);ctx.lineTo(-ro+(major?24:18),y);ctx.stroke();if(major)ctx.fillText(String(v),-ro+27,y)}
  ctx.font="600 8px 'Be Vietnam Pro',system-ui,sans-serif";ctx.fillText("mL",-ro+27,-bot-100*K-11);
  /* nhãn dán */
  if(b.sticker){
    const sx=-14,sy=-H+12,sw=52,sh=26;
    ctx.fillStyle="rgba(250,251,255,.96)";C.rr(ctx,sx,sy,sw,sh,4);ctx.fill();
    ctx.strokeStyle="rgba(0,0,0,.18)";ctx.lineWidth=.8;ctx.stroke();
    ctx.fillStyle=b.sticker.color||"#7C3AED";C.rr(ctx,sx,sy,6,sh,3);ctx.fill();
    ctx.fillStyle="#0B1230";ctx.textBaseline="alphabetic";ctx.font="800 10px 'Lexend','Be Vietnam Pro',system-ui,sans-serif";ctx.fillText(b.sticker.t1,sx+10,sy+11.5);
    ctx.font="600 8px 'Be Vietnam Pro',system-ui,sans-serif";ctx.fillStyle="#3B4472";ctx.fillText(b.sticker.t2,sx+10,sy+21.5);
  }
  ctx.restore();
}

/* dòng chất lỏng đang rót: parabol từ mỏ rót xuống mặt thoáng cốc nhận */
function drawStream(ctx,from,to,w,P){
  if(w<=.05) return;
  const mx=(from.x+to.x)/2+4,my=from.y+(to.y-from.y)*.15;
  ctx.save();ctx.lineCap="round";
  ctx.strokeStyle=P.liquidEdge;ctx.globalAlpha=.55;ctx.lineWidth=w+1.6;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.quadraticCurveTo(mx,my,to.x,to.y);ctx.stroke();
  ctx.globalAlpha=.9;ctx.strokeStyle=P.liquid.replace(/[\d.]+\)$/,".55)");ctx.lineWidth=w;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.quadraticCurveTo(mx,my,to.x,to.y);ctx.stroke();
  ctx.globalAlpha=.8;ctx.strokeStyle=P.shine;ctx.lineWidth=Math.max(.6,w*.18);ctx.beginPath();ctx.moveTo(from.x-w*.2,from.y);ctx.quadraticCurveTo(mx-w*.2,my,to.x-w*.2,to.y);ctx.stroke();
  ctx.restore();
}

/* ---------- 5. Cân điện tử (Max 500 g, d = 0,01 g) ---------- */
const BAL={w:300,panW:256,panY:-108,slots:[-62,62]};
function drawBalance(ctx,bal,P,day){
  const x=bal.x,y=bal.y,w=BAL.w,h=80;
  drawShadow(ctx,x,y+4,w*.62,18,P.shadow);
  /* thân: mặt trên (phối cảnh) + mặt trước */
  const top=ctx.createLinearGradient(0,y-h-22,0,y-h);top.addColorStop(0,day?"#F2F5FC":"#3A4677");top.addColorStop(1,day?"#DCE3F2":"#273260");
  ctx.fillStyle=top;ctx.beginPath();ctx.moveTo(x-w/2+14,y-h-20);ctx.lineTo(x+w/2-14,y-h-20);ctx.lineTo(x+w/2,y-h);ctx.lineTo(x-w/2,y-h);ctx.closePath();ctx.fill();
  const fr=ctx.createLinearGradient(0,y-h,0,y);fr.addColorStop(0,day?"#E4E9F5":"#2B3666");fr.addColorStop(1,day?"#C6CFE3":"#18204A");
  ctx.fillStyle=fr;C.rr(ctx,x-w/2,y-h,w,h,10);ctx.fill();
  ctx.strokeStyle=day?"rgba(30,40,90,.25)":"rgba(170,190,255,.25)";ctx.lineWidth=1;C.rr(ctx,x-w/2,y-h,w,h,10);ctx.stroke();
  /* chân */
  ctx.fillStyle=day?"#8D98B6":"#0B1030";[-w/2+22,w/2-22].forEach(dx=>{C.rr(ctx,x+dx-12,y-2,24,7,3);ctx.fill()});
  /* màn hình */
  const lx=x-118,ly=y-h+14,lw=168,lh=44;
  ctx.fillStyle="#061512";C.rr(ctx,lx,ly,lw,lh,6);ctx.fill();
  ctx.strokeStyle=day?"#6B7799":"#4A5799";ctx.lineWidth=2;C.rr(ctx,lx,ly,lw,lh,6);ctx.stroke();
  const lit=bal.on?"#7CFFC9":"#0E2A22",off="rgba(124,255,201,.07)";
  if(bal.on){
    ctx.save();ctx.shadowColor="#2CFFB0";ctx.shadowBlur=8;
    const txt=bal.text;const th=26;const tw=C.sevenWidth(txt,th);
    C.seven(ctx,txt,lx+lw-26-tw,ly+9,th,lit,off);
    ctx.restore();
    ctx.fillStyle=lit;ctx.font="700 13px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textBaseline="alphabetic";ctx.fillText("g",lx+lw-18,ly+34);
    /* dấu ổn định */
    ctx.font="700 11px system-ui,sans-serif";ctx.fillStyle=bal.stable?lit:"rgba(124,255,201,.25)";ctx.fillText(bal.stable?"●":"○",lx+8,ly+16);
    if(bal.tared){ctx.font="700 8px system-ui,sans-serif";ctx.fillStyle=lit;ctx.fillText("NET",lx+6,ly+36)}
  }
  /* nhãn thông số */
  ctx.fillStyle=day?"#3B4472":"#AEB8E6";ctx.font="600 9.5px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textBaseline="alphabetic";
  ctx.fillText("Max 500 g   d = 0,01 g",x-w/2+14,y-8);
  /* nút */
  bal.btn=[];
  [["TARE",x+86],["ON/OFF",x+126]].forEach(([t,bx],i)=>{
    const by=y-h+36;
    const g=ctx.createRadialGradient(bx-3,by-4,2,bx,by,13);g.addColorStop(0,day?"#FFFFFF":"#7E8BC4");g.addColorStop(1,day?"#AEB9D4":"#3A4680");
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(bx,by,12,0,6.283);ctx.fill();
    ctx.strokeStyle=i===1&&bal.on?"#2CFFB0":(day?"rgba(30,40,90,.35)":"rgba(200,210,255,.35)");ctx.lineWidth=1.6;ctx.stroke();
    ctx.fillStyle=day?"#28336A":"#CBD3F4";ctx.font="700 8.5px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textAlign="center";ctx.fillText(t,bx,by+25);ctx.textAlign="left";
    bal.btn.push({id:i?"power":"tare",x:bx,y:by,r:16});
  });
  /* đĩa cân inox */
  const py=y+BAL.panY+4,pw=BAL.panW;
  ctx.fillStyle=day?"#9AA6C4":"#1C2552";ctx.fillRect(x-14,py,28,y-h-20-py+2);
  const pg=ctx.createLinearGradient(x-pw/2,0,x+pw/2,0);pg.addColorStop(0,day?"#D7DEEE":"#8E9AC8");pg.addColorStop(.35,day?"#FFFFFF":"#E6EBFA");pg.addColorStop(.7,day?"#C9D2E6":"#A4AFD8");pg.addColorStop(1,day?"#B4BFD8":"#6E7AAE");
  ctx.fillStyle=pg;ctx.beginPath();ctx.moveTo(x-pw/2+12,py-16);ctx.lineTo(x+pw/2-12,py-16);ctx.lineTo(x+pw/2,py);ctx.lineTo(x-pw/2,py);ctx.closePath();ctx.fill();
  ctx.fillStyle=day?"#8E99B8":"#4C578A";ctx.fillRect(x-pw/2,py,pw,5);
  if(bal.glow){ctx.save();ctx.globalAlpha=bal.glow;ctx.strokeStyle=P.accent;ctx.lineWidth=3;ctx.shadowColor=P.accent;ctx.shadowBlur=18;ctx.beginPath();ctx.moveTo(x-pw/2+12,py-16);ctx.lineTo(x+pw/2-12,py-16);ctx.lineTo(x+pw/2,py);ctx.lineTo(x-pw/2,py);ctx.closePath();ctx.stroke();ctx.restore()}
}

/* ---------- 6. Bàn thí nghiệm (vẽ theo toạ độ màn hình, phủ toàn khung) ---------- */
function drawLab(ctx,W,H,benchBack,benchFront,P,t){
  const g=ctx.createLinearGradient(0,0,0,benchBack);g.addColorStop(0,P.wall2);g.addColorStop(1,P.wall1);
  ctx.fillStyle=g;ctx.fillRect(0,0,W,benchBack+1);
  /* gạch men tường mờ */
  ctx.strokeStyle=P.wall1===("#E9EEFB")?"rgba(40,60,140,.06)":"rgba(150,170,255,.05)";ctx.lineWidth=1;
  const tile=Math.max(36,W/26);
  for(let x=(W%tile)/2;x<W;x+=tile){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,benchBack);ctx.stroke()}
  for(let y=benchBack-tile;y>0;y-=tile){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}
  /* quầng sáng đèn trần */
  const sp=ctx.createRadialGradient(W*.5,-H*.1,10,W*.5,-H*.1,H*.95);sp.addColorStop(0,"rgba(255,255,255,.10)");sp.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=sp;ctx.fillRect(0,0,W,benchBack);
  /* mặt bàn */
  const b=ctx.createLinearGradient(0,benchBack,0,benchFront);b.addColorStop(0,P.bench2);b.addColorStop(1,P.bench1);
  ctx.fillStyle=b;ctx.fillRect(0,benchBack,W,benchFront-benchBack);
  const refl=ctx.createLinearGradient(0,benchBack,0,benchFront);refl.addColorStop(0,"rgba(255,255,255,.06)");refl.addColorStop(1,"rgba(255,255,255,0)");
  ctx.fillStyle=refl;ctx.fillRect(0,benchBack,W,(benchFront-benchBack)*.4);
  ctx.fillStyle=P.benchEdge;ctx.fillRect(0,benchFront-1,W,2.5);
  ctx.fillStyle=P.benchFace;ctx.fillRect(0,benchFront+1.5,W,H-benchFront);
}

/* ---------- 7. Kính lúp hạt: mô hình hạt cho dung dịch trong một cốc ---------- */
const ION={
  Ba:{r:.105,c:"#38BDF8",q:"2+",ten:"Ba²⁺"},
  Cl:{r:.082,c:"#4ADE80",q:"−",ten:"Cl⁻"},
  Na:{r:.066,c:"#C084FC",q:"+",ten:"Na⁺"},
  SO4:{r:.06,c:"#FACC15",q:"2−",ten:"SO₄²⁻"}
};
class Lens{
  constructor(seed){this.r=C.rng(seed||7);this.parts=[];this.pairs=[];this.Q=4;this.t=0}
  reset(){this.parts=[];this.pairs=[]}
  spawn(kind,top){const r=this.r;const a=r()*6.283,d=Math.sqrt(r())*.78;const p={k:kind,x:top?(r()-.5)*1.1:Math.cos(a)*d,y:top?-.86+r()*.12:Math.sin(a)*d,vx:(r()-.5)*.2,vy:top?.35+r()*.2:(r()-.5)*.2,ang:r()*6.283,al:top?0:1,die:false,bound:null};this.parts.push(p);return p}
  /* đồng bộ số hạt với thành phần cốc (mỗi 0,25 mmol vẽ 1 hạt) */
  sync(mix){
    const Q=this.Q,io=mix.ions(),want={Ba:Math.round((io.Ba||0)*Q),Cl:Math.round((io.Cl||0)*Q),Na:Math.round((io.Na||0)*Q),SO4:Math.round((io.SO4||0)*Q)};
    let solid=0;for(const o of [mix.susp,mix.sed])solid+=(o.BaSO4||0);
    const wantSolid=Math.round(solid*Q);
    /* tạo cặp kết tủa: ghép Ba²⁺ với SO₄²⁻ gần nhất */
    while(this.pairs.length<wantSolid){
      const bas=this.parts.filter(p=>p.k==="Ba"&&!p.bound&&!p.die),sos=this.parts.filter(p=>p.k==="SO4"&&!p.bound&&!p.die);
      if(!bas.length||!sos.length) break;
      let best=null,bd=1e9;for(const a of bas)for(const s of sos){const d=Math.hypot(a.x-s.x,a.y-s.y);if(d<bd){bd=d;best=[a,s]}}
      const slot=this.slot(this.pairs.length);const pr={a:best[0],s:best[1],slot,ph:0};best[0].bound=pr;best[1].bound=pr;this.pairs.push(pr);
    }
    /* chất rắn đã có sẵn trong cốc (bật kính lúp sau phản ứng): đặt thẳng vào mạng */
    while(this.pairs.length<wantSolid){
      const i=this.pairs.length,slot=this.slot(i);
      const a=this.spawn("Ba",false),s=this.spawn("SO4",false);
      a.x=slot.x-.07;a.y=slot.y;s.x=slot.x+.085;s.y=slot.y;a.al=s.al=0;
      const pr={a,s,slot,ph:1};a.bound=pr;s.bound=pr;this.pairs.push(pr);
    }
    while(this.pairs.length>wantSolid){const pr=this.pairs.pop();pr.a.die=true;pr.s.die=true}
    for(const k of ["Ba","Cl","Na","SO4"]){
      const free=this.parts.filter(p=>p.k===k&&!p.bound&&!p.die);
      let n=free.length;
      while(n<want[k]){this.spawn(k,this.inflow);n++}
      for(let i=0;n>want[k]&&i<free.length;i++){free[i].die=true;n--}
    }
  }
  slot(i){ /* mạng tinh thể nhỏ ở đáy vòng tròn: mỗi ô là một cặp Ba²⁺–SO₄²⁻ */
    const per=[3,4,4,4,4,4,3,3,2];let row=0,acc=0;while(row<per.length-1&&i>=acc+per[row]){acc+=per[row];row++}
    const n=per[row],j=Math.min(n-1,i-acc);const y=.7-row*.19;const x=(j-(n-1)/2)*.34;return{x,y};
  }
  step(dt){
    this.t+=dt;const r=this.r;
    for(const p of this.parts){
      if(p.die){p.al-=dt*2.5;continue}
      if(p.al<1)p.al=Math.min(1,p.al+dt*2);
      p.ang+=dt*.6;
      if(p.bound){
        const pr=p.bound;pr.ph=Math.min(1,pr.ph+dt*.9);
        const meet={x:(pr.a.x+pr.s.x)/2,y:(pr.a.y+pr.s.y)/2};
        const tx=pr.ph<.5?meet.x:pr.slot.x+(p.k==="Ba"?-.07:.085),ty=pr.ph<.5?meet.y:pr.slot.y;
        const k=pr.ph<.5?3:2.2;p.x+=(tx-p.x)*Math.min(1,k*dt);p.y+=(ty-p.y)*Math.min(1,k*dt);continue;
      }
      p.vx+=(r()-.5)*1.6*dt;p.vy+=(r()-.5)*1.6*dt;p.vx*=Math.pow(.6,dt);p.vy*=Math.pow(.6,dt);
      const sp=Math.hypot(p.vx,p.vy);if(sp>.32){p.vx*=.32/sp;p.vy*=.32/sp}
      p.x+=p.vx*dt;p.y+=p.vy*dt;
      const R=.92-ION[p.k].r,d=Math.hypot(p.x,p.y);if(d>R){const nx=p.x/d,ny=p.y/d;p.x=nx*R;p.y=ny*R;const dot=p.vx*nx+p.vy*ny;p.vx-=2*dot*nx;p.vy-=2*dot*ny}
    }
    this.parts=this.parts.filter(p=>!(p.die&&p.al<=0));
    this.pairs=this.pairs.filter(pr=>!pr.a.die);
  }
  draw(ctx,cx,cy,R,P,label){
    ctx.save();
    /* tay cầm */
    ctx.save();ctx.translate(cx,cy);ctx.rotate(.8);const hg=ctx.createLinearGradient(R,-8,R,8);hg.addColorStop(0,P.ring1);hg.addColorStop(1,P.ring2);ctx.fillStyle=hg;C.rr(ctx,R+2,-9,R*.75,18,8);ctx.fill();ctx.restore();
    /* nền dung dịch phóng to */
    ctx.beginPath();ctx.arc(cx,cy,R,0,6.283);ctx.save();ctx.clip();
    const g=ctx.createRadialGradient(cx-R*.3,cy-R*.35,R*.1,cx,cy,R);g.addColorStop(0,P.lensBg1);g.addColorStop(1,P.lensBg2);ctx.fillStyle=g;ctx.fillRect(cx-R,cy-R,2*R,2*R);
    ctx.fillStyle="rgba(140,180,255,.06)";for(let i=0;i<40;i++){const a=i*2.399,d=Math.sqrt((i+.5)/40)*R;ctx.beginPath();ctx.arc(cx+Math.cos(a)*d,cy+Math.sin(a)*d,1.6,0,6.283);ctx.fill()}
    /* chất rắn: viền sáng cho các cặp đã khóa vào mạng */
    for(const pr of this.pairs){if(pr.ph<.75)continue;ctx.fillStyle="rgba(255,255,255,.13)";C.rr(ctx,cx+(pr.slot.x-.17)*R,cy+(pr.slot.y-.1)*R,.34*R,.2*R,5);ctx.fill()}
    const order=this.parts.slice().sort((a,b)=>(a.bound?1:0)-(b.bound?1:0));
    for(const p of order){
      const I=ION[p.k],x=cx+p.x*R,y=cy+p.y*R,rr=I.r*R;
      ctx.globalAlpha=Math.max(0,Math.min(1,p.al));
      if(p.k==="SO4"){
        for(let k=0;k<4;k++){const a=p.ang+k*1.5708+.785;ball(ctx,x+Math.cos(a)*rr*1.35,y+Math.sin(a)*rr*1.35,rr*.78,"#F87171")}
        ball(ctx,x,y,rr,I.c);
      }else ball(ctx,x,y,rr,I.c);
      if(R>70){ctx.fillStyle="#0B1230";ctx.font=`800 ${Math.max(7,rr*.75)}px system-ui,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(I.q,x+(p.k==="SO4"?0:0),y+.5)}
      ctx.globalAlpha=1;
    }
    ctx.restore();
    /* vành kính */
    const rg=ctx.createLinearGradient(cx-R,cy-R,cx+R,cy+R);rg.addColorStop(0,P.ring1);rg.addColorStop(.5,P.ring2);rg.addColorStop(1,P.ring1);
    ctx.strokeStyle=rg;ctx.lineWidth=9;ctx.beginPath();ctx.arc(cx,cy,R+4,0,6.283);ctx.stroke();
    ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,cy,R-6,3.6,4.6);ctx.stroke();
    if(label){ctx.fillStyle=P.ink;ctx.font="700 12px 'Be Vietnam Pro',system-ui,sans-serif";ctx.textAlign="center";ctx.textBaseline="alphabetic";ctx.fillText(label,cx,cy-R-14)}
    ctx.textAlign="left";
    ctx.restore();
  }
}
function ball(ctx,x,y,r,c){const g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);g.addColorStop(0,"#FFFFFF");g.addColorStop(.25,c);g.addColorStop(1,C.mix(c,"#000000",.45));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill()}

window.LabChem={AT,SP,RX,Mix,BK,Beaker,BAL,palette,drawBeaker,drawStream,drawBalance,drawLab,drawShadow,Lens,ION,ball,clipBelow,area};
})();
