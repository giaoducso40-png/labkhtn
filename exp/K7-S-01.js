/* K7-S-01 · Ảnh hưởng của ánh sáng tới quang hợp (SGK KHTN 7 – Kết nối tri thức, Bài 23) · bản 3D
   Cành rong đuôi chó trong cốc nước (đặt trong chậu điều nhiệt), đèn bàn đặt ở các khoảng cách 10–40 cm trên thước, đếm số bọt khí trong 1 phút.
   Số bọt/phút lấy theo bảng số liệu của vở thực hành (10, 20, 30, 40 cm); giữa các mốc nội suy tuyến tính.
   Cảnh 3D (LabGL + LabChem3D); khung phóng to đầu cắt vẽ 2D (LabPlant) để đếm bọt. */
(function(){
"use strict";
const C=window.LabCore,PL=window.LabPlant,G=window.LabGL,K3=window.LabChem3D;
const fmt=C.fmt,H=G.hex;

const DATA=[[10,40],[20,28],[30,13],[40,5]];      // khoảng cách đèn (cm) → số bọt khí/phút (vở thực hành KHTN 7, Bài 23)
const DMIN=10,DMAX=40,UCM=12;                      // 1 cm = 12 đơn vị cảnh
const X={cx:800,bench:540,top:268,bot:536,hw:62,water:300,cut:312,sprigBot:498,bulbY:330,tubTop:430,tubHw:98,tubWater:468,therm:838};
const TEMPS=[{k:"lanh",T:8,ten:"Nước lạnh",sub:"8 °C"},{k:"phong",T:30,ten:"Nhiệt độ phòng",sub:"30 °C"},{k:"am",T:45,ten:"Nước ấm",sub:"45 °C"}];
/* hệ số nhiệt độ – đường minh họa định tính theo các mốc của nguồn: thuận lợi 25–35 °C; dưới 10 °C hoặc trên 40 °C giảm hoặc ngừng */
function fT(T){if(T<=5)return 0;if(T<10)return .1*(T-5)/5;if(T<25)return .1+.9*(T-10)/15;if(T<=35)return 1;if(T<=40)return 1-.4*(T-35)/5;if(T<45)return .6*(1-(T-40)/5);return 0}

const GV=`<p><b>Yêu cầu cần đạt</b> (trích mục tiêu Bài 23)</p>
<ul class="tlist"><li>Nêu được một số yếu tố chủ yếu ảnh hưởng đến quang hợp.</li><li>Vận dụng được những hiểu biết về quang hợp để giải thích được ý nghĩa thực tiễn của việc trồng và bảo vệ cây xanh.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức (15–20 phút)</b></p>
<ul class="tlist"><li>Chia lớp thành 4 nhóm, mỗi nhóm một khoảng cách đèn; một học sinh lên chạm khung phóng to để đếm, cả lớp đếm theo. Máy đếm chỉ hiện sau khi hết 1 phút.</li><li>Chọn 4× khi muốn đếm nhanh; chọn 1× khi học sinh tự đếm.</li><li>Hỏi trước khi đổi nhiệt độ: “Muốn biết nhiệt độ có ảnh hưởng không, cần giữ yếu tố nào không đổi?”.</li></ul>
<p style="margin-top:10px"><b>Khi làm thật</b></p>
<ul class="tlist"><li>Đèn sợi đốt làm nước nóng lên khi đặt gần; nên dùng đèn LED hoặc theo dõi nhiệt kế để nhiệt độ không đổi giữa các lần đo.</li><li>Sau mỗi lần dời đèn, nên chờ vài phút cho số bọt ổn định rồi mới đếm.</li></ul>
<p style="margin-top:10px"><b>Lỗi học sinh hay gặp</b></p>
<ul class="tlist"><li>Cho rằng bọt khí là carbon dioxide.</li><li>Thay đổi cùng lúc khoảng cách đèn và nhiệt độ nước rồi so sánh.</li></ul>`;

const SRC=`<ul class="tlist">
<li>Mục tiêu bài: <a href="https://hoatieu.vn/powerpoint-khoa-hoc-tu-nhien-7-bai-23-mot-so-yeu-to-anh-huong-den-quang-hop-231454" target="_blank" rel="noopener">kế hoạch bài dạy Bài 23 KNTT</a>.</li>
<li>Bảng số bọt khí theo khoảng cách đèn (10 cm: 40; 20 cm: 28; 30 cm: 13; 40 cm: 5 bọt/phút), cách đặt cành rong (cuống thấp hơn mặt nước 1 cm), nhiệt độ thuận lợi 25–35 °C, trên 40 °C hoặc dưới 10 °C quang hợp giảm hoặc ngừng, khí carbon dioxide tăng quá cao (khoảng 0,2%) làm cây chết, ví dụ cây ưa sáng và ưa bóng: <a href="https://vndoc.com/giai-vo-thuc-hanh-khoa-hoc-tu-nhien-7-bai-23-kntt-317368" target="_blank" rel="noopener">giải vở thực hành KHTN 7 Bài 23 (VnDoc)</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p>
<ul class="tlist"><li>Ở 25–35 °C, số bọt/phút bám đúng bảng trên tại 10, 20, 30, 40 cm; tại 15, 25, 35 cm là giá trị nội suy tuyến tính, không phải số đo.</li>
<li>Ảnh hưởng của nhiệt độ là <b>đường minh họa định tính</b> dựa trên các mốc 10, 25, 35, 40 °C của nguồn; số bọt ở 8 °C và 45 °C chỉ để thấy xu hướng giảm hoặc ngừng.</li>
<li>Bọt khí xuất hiện đều đặn (lệch nhỏ giữa các bọt), nên mỗi lần đếm 1 phút có thể chênh 1 bọt so với bảng.</li>
<li>Cành rong phản ứng gần như ngay khi đổi ánh sáng (sau khoảng 2 giây); đèn không làm nóng nước.</li><li>Cảnh 3D vẽ theo kích thước thật (cm); chùm sáng chỉ để minh họa độ sáng giảm khi đèn ra xa.</li></ul>`;

LabKHTN.register("K7-S-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"d",t:"Đèn cách cành rong"},{k:"T",t:"Nhiệt độ nước"},{k:"em",t:"Em đếm"},{k:"may",t:"Máy đếm",u:"bọt/phút"}],empty:"Bấm “Đếm 1 phút”; hết 1 phút kết quả tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Thí nghiệm 3D: cành rong đuôi chó trong cốc nước đặt trong chậu điều nhiệt, đèn bàn chiếu sáng, thước đo khoảng cách; bọt khí thoát ra ở đầu cắt");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,simT=0,frameN=0,drag=null,bodyEl=null,stepIdx=0;
    const S={d:20,dLive:20,lamp:true,Tt:30,T:30,rs:DATA[1][1],phase:.3,flip:false,grow:null,bub:[],pops:[],count:null,recs:[],
      p1:null,p2:null,locked:false,obs:{},seen:{darkT:0,dark:false},q:{},finished:false};
    const rateNow=()=>S.lamp?PL.interp(DATA,S.dLive)*fT(S.T):0;
    const rateTarget=()=>S.lamp?PL.interp(DATA,S.d)*fT(S.Tt):0;
    const stable=()=>Math.abs(S.T-S.Tt)<.5&&Math.abs(S.dLive-S.d)<.01&&Math.abs(S.rs-rateTarget())<.3&&!drag;
    const bulbX=d=>X.cx-d*UCM;

    /* ---------- khung phóng to đầu cắt (vẽ 2D trên lớp phủ) ---------- */
    const ins=document.createElement("div");ins.className="gl-card glass";ins.style.pointerEvents="auto";ins.style.cursor="pointer";ins.style.padding="0";ins.style.overflow="hidden";ins.setAttribute("role","button");ins.setAttribute("aria-label","Khung phóng to đầu cắt: chạm để đếm một bọt khí");
    const icv=document.createElement("canvas");icv.style.display="block";ins.appendChild(icv);over.appendChild(ins);
    const ctx=icv.getContext("2d");
    let L={inset:{x:0,y:0,w:300,h:214},port:false},F={s:1};
    const fz=(u,minPx)=>Math.max(u,(minPx||0)/(F?F.s:1));
    const font=(w,u,minPx,d)=>`${w} ${fz(u,minPx).toFixed(1)}px ${d?"'Lexend',":""}'Be Vietnam Pro',system-ui,sans-serif`;
    ins.addEventListener("click",()=>{if(S.count)tapCount();else api.toast("Bấm “Đếm 1 phút” rồi chạm vào khung này mỗi khi thấy một bọt khí.","info",2600)});

    /* ---------- thao tác ---------- */
    function cancelCount(why){if(S.count){S.count=null;api.toast(why||"Đã hủy lần đếm.","info",2600);refresh()}}
    function setD(d){d=C.clamp(Math.round(d/5)*5,DMIN,DMAX);if(d===S.d)return;cancelCount("Đã hủy lần đếm vì em dời đèn.");S.d=d;refresh()}
    function setT(k){const o=TEMPS.find(x=>x.k===k);if(!o||o.T===S.Tt)return;cancelCount("Đã hủy lần đếm vì em đổi nhiệt độ nước.");S.Tt=o.T;refresh()}
    function toggleLamp(on){on=on==null?!S.lamp:on;if(on===S.lamp)return;cancelCount("Đã hủy lần đếm vì em bật/tắt đèn.");S.lamp=on;refresh()}
    function startCount(){
      if(S.count){cancelCount();return}
      if(!stable()){api.toast(Math.abs(S.T-S.Tt)>=.5?"Chờ nhiệt độ nước ổn định rồi mới đếm.":"Chờ vài giây cho cành rong ổn định rồi mới đếm.","info",2600);return}
      S.count={t:0,machine:0,mine:0,tapped:false,d:S.d,T:Math.round(S.T),lamp:S.lamp};
      if(!api.time.playing)api.time.play(true);
      api.toast("Bắt đầu đếm. Mỗi lần thấy một bọt khí tách khỏi đầu cắt, chạm khung phóng to hoặc nút +1.","info",4000);refresh();
    }
    function tapCount(){if(!S.count){api.toast("Bấm “Đếm 1 phút” trước.","info",1800);return}S.count.mine++;S.count.tapped=true;refreshDock()}
    function finishCount(){
      const c=S.count;S.count=null;
      const rec={d:c.d,T:c.T,lamp:c.lamp,mine:c.tapped?c.mine:null,machine:c.machine};S.recs.push(rec);
      api.record({lan:String(S.recs.length),d:c.lamp?`${c.d} cm`:"đèn tắt",T:`${c.T} °C`,em:rec.mine==null?"—":String(rec.mine),may:String(c.machine)});
      api.toast(`Hết 1 phút: máy đếm được ${c.machine} bọt khí${rec.mine!=null?`, em đếm ${rec.mine}`:""}.`,"ok",4000);
      refresh();
    }

    /* ---------- mô phỏng ---------- */
    function sim(sdt,dt){
      if(!drag&&S.dLive!==S.d){const v=30*dt;S.dLive=Math.abs(S.d-S.dLive)<=v?S.d:S.dLive+Math.sign(S.d-S.dLive)*v}
      if(sdt<=0) return;
      S.T+=(S.Tt-S.T)*(1-Math.exp(-sdt/4));if(Math.abs(S.T-S.Tt)<.02)S.T=S.Tt;
      S.rs+=(rateNow()-S.rs)*(1-Math.exp(-sdt/0.6));
      S.phase+=S.rs/60*sdt;
      const thr=S.flip?1.12:.88;
      if(!S.grow&&S.phase>=thr){S.phase-=thr;S.flip=!S.flip;S.grow={age:0,rf:3+((S.recs.length*7+S.bub.length*3)%5)*.2}}
      if(S.grow){S.grow.age+=sdt;if(S.grow.age>=.32){S.bub.push({x:X.cx-10,y:X.cut-S.grow.rf,r:S.grow.rf,vy:0,age:0});S.grow=null;if(S.count)S.count.machine++}}
      for(const b of S.bub){b.age+=sdt;b.vy=Math.min(b.vy+90*sdt,22);b.y-=b.vy*sdt;b.x=X.cx-10+Math.sin(b.age*9)*.6}
      for(const b of S.bub)if(b.y<=X.water+b.r*.3){b.dead=true;S.pops.push({x:b.x,y:X.water,age:0})}
      S.bub=S.bub.filter(b=>!b.dead);
      for(const p of S.pops)p.age+=sdt;S.pops=S.pops.filter(p=>p.age<.35);
      if(!S.lamp&&S.rs<.3){S.seen.darkT+=sdt;if(S.seen.darkT>=8&&!S.seen.dark){S.seen.dark=true;refresh()}}else S.seen.darkT=0;
      if(S.count){S.count.t+=sdt;if(S.count.t>=60)finishCount()}
    }


    function drawBubbles(P,m){
      if(S.grow){const r=C.lerp(.5,S.grow.rf,S.grow.age/.32);PL.bubble(ctx,X.cx-10,X.cut-r*.8,r,P)}
      for(const b of S.bub)PL.bubble(ctx,b.x,b.y,b.r,P);
      for(const p of S.pops){const a=1-p.age/.35;ctx.strokeStyle=P.day?`rgba(30,80,160,${a*.6})`:`rgba(220,240,255,${a*.7})`;ctx.lineWidth=.8/m*2;ctx.beginPath();ctx.ellipse(p.x,p.y,2+p.age*18,1+p.age*5,0,0,6.283);ctx.stroke()}
    }
    function drawInset(P){
      const R=L.inset;ctx.fillStyle=P.panel;C.rr(ctx,R.x,R.y,R.w,R.h,18);ctx.fill();
      ctx.strokeStyle=S.count?P.accent:C.rgba(P.day?"#28336A":"#CBD3F4",.2);ctx.lineWidth=S.count?2.5:1;C.rr(ctx,R.x,R.y,R.w,R.h,18);ctx.stroke();
      const r=Math.min(R.h/2-22,R.w*.3),cx=R.x+16+r,cy=R.y+R.h/2+8,mag=r/22;
      ctx.fillStyle=P.muted;ctx.font=font(700,11.5,9.5);ctx.fillText("PHÓNG TO ĐẦU CẮT ×"+fmt(mag,1),R.x+16,R.y+20);
      ctx.save();ctx.beginPath();ctx.arc(cx,cy,r,0,6.283);ctx.clip();
      ctx.translate(cx,cy);ctx.scale(mag,mag);ctx.translate(-(X.cx-10),-(X.cut-6));
      ctx.fillStyle=P.air;ctx.fillRect(X.cx-60,X.cut-60,120,120);
      const g=ctx.createLinearGradient(0,X.water,0,X.cut+30);g.addColorStop(0,P.day?"rgba(140,190,245,.55)":"rgba(40,90,170,.75)");g.addColorStop(1,P.day?"rgba(100,160,235,.6)":"rgba(25,60,130,.85)");
      ctx.fillStyle=g;ctx.fillRect(X.cx-60,X.water,120,90);
      if(S.lamp){const a=.22*C.clamp(PL.interp(DATA,S.dLive)/40,0,1);ctx.fillStyle=`rgba(${P.light},${a.toFixed(3)})`;ctx.fillRect(X.cx-60,X.water,120,90)}
      ctx.strokeStyle=P.day?"rgba(30,80,160,.7)":"rgba(190,225,255,.8)";ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(X.cx-60,X.water);ctx.lineTo(X.cx+60,X.water);ctx.stroke();
      PL.drawSprig(ctx,X.cx-10,X.cut,X.sprigBot,simT,P);
      drawBubbles(P,mag);
      ctx.restore();
      ctx.strokeStyle=C.rgba(P.day?"#28336A":"#CBD3F4",.35);ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,r,0,6.283);ctx.stroke();
      ctx.fillStyle=P.muted;ctx.font=font(600,10.5,9);ctx.fillText("mặt nước",cx+r*.35,cy-6*mag-4);
      /* đồng hồ và bộ đếm */
      const rx=cx+r+18,rw=R.x+R.w-16-rx;
      const sr=Math.min(rw*.32,L.port?52:34),sx=rx+sr+2,sy=R.y+30+sr;
      ctx.strokeStyle=C.rgba(P.day?"#28336A":"#CBD3F4",.2);ctx.lineWidth=6;ctx.beginPath();ctx.arc(sx,sy,sr,0,6.283);ctx.stroke();
      if(S.count){ctx.strokeStyle=P.accent;ctx.beginPath();ctx.arc(sx,sy,sr,-Math.PI/2,-Math.PI/2+6.283*S.count.t/60);ctx.stroke()}
      ctx.fillStyle=P.ink;ctx.textAlign="center";ctx.font=font(800,L.port?22:17,12,1);ctx.fillText(S.count?String(Math.floor(S.count.t)):"60",sx,sy+5);
      ctx.font=font(600,10,8.5);ctx.fillStyle=P.muted;ctx.fillText("giây",sx,sy+sr*.55+4);ctx.textAlign="left";
      const last=S.recs[S.recs.length-1];
      const mine=S.count?S.count.mine:(last&&last.mine!=null?last.mine:"–");
      const mach=S.count?"?":(last?last.machine:"–");
      const msg=S.count?"Chạm vào khung để đếm +1":(last?"Kết quả lần đếm gần nhất":"Bấm “Đếm 1 phút” để bắt đầu");
      if(L.port){
        const tx=sx+sr+24,ty=R.y+50;
        ctx.fillStyle=P.muted;ctx.font=font(700,11,9);ctx.fillText("EM ĐẾM",tx,ty);ctx.fillText("MÁY ĐẾM",tx+150,ty);
        ctx.fillStyle=P.ink;ctx.font=font(800,34,14,1);ctx.fillText(String(mine),tx,ty+38);ctx.fillText(String(mach),tx+150,ty+38);
        ctx.fillStyle=S.count?P.accent:P.muted;ctx.font=font(700,11.5,9.5);wrapTxt(msg,40).forEach((l,j)=>ctx.fillText(l,rx,sy+sr+34+j*fz(15,12)));
      }else{
        let ty=sy+sr+26;const rr2=rx+rw;
        [["Em đếm",mine],["Máy đếm",mach]].forEach(([lab,v])=>{ctx.fillStyle=P.muted;ctx.font=font(700,11,9);ctx.fillText(lab,rx,ty);ctx.fillStyle=P.ink;ctx.font=font(800,20,13,1);ctx.textAlign="right";ctx.fillText(String(v),rr2,ty+2);ctx.textAlign="left";ty+=fz(30,22)});
        ctx.fillStyle=S.count?P.accent:P.muted;ctx.font=font(700,11,9.5);wrapTxt(msg,15).forEach((l,j)=>ctx.fillText(l,rx,ty+2+j*fz(14,11.5)));
      }
    }
    function wrapTxt(t,n){const w=t.split(" ");const o=[];let c="";for(const x of w){if((c+" "+x).trim().length>n){o.push(c.trim());c=x}else c+=" "+x}if(c.trim())o.push(c.trim());return o}

    /* ================= cảnh 3D (1 cm = 0,05 đơn vị; gốc toạ độ ở cành rong) ================= */
    const k=.05,YB=.03,wyS=sy=>YB+(X.bot-sy)/UCM*k,wx=sx=>(sx-X.cx)/UCM*k;
    const root=new G.Node();root.add(K3.bench(R,6.6,3.4,day));
    /* chậu điều nhiệt và cốc trụ */
    const bath=root.add(new G.Node());bath.add(K3.glass(R,.43,.47,{lip:.02,th:.015}));
    const bathW=bath.add(R.mesh(K3.liquidGeom(.41,.02,.3,false),{color:H("#8CC4F5"),alpha:.3,rough:.05,coat:.5,order:1}));
    const cyl=root.add(new G.Node());cyl.pos=[0,.012,0];cyl.add(K3.glass(R,.265,1.12,{lip:.012,th:.012}));
    const cylW=cyl.add(R.mesh(K3.liquidGeom(.25,.02,wyS(X.water)-.012,false),{color:H("#9CCBF4"),alpha:.26,rough:.04,coat:.6,order:1}));
    /* cành rong đuôi chó: thân cong, lá mọc vòng, mỗi lá chẻ đôi */
    const cutX=wx(X.cx-10),cutY=wyS(X.cut),botY=wyS(X.sprigBot);
    const sprigGeo=(()=>{const rnd=C.rng(23),parts=[];const stem=[];for(let i=0;i<=24;i++){const t=i/24;stem.push([cutX+Math.sin(t*2.2)*.03-.02*t,cutY-(cutY-botY)*t,Math.sin(t*3.1)*.02])}
      parts.push(G.tube(stem,.006,8));
      const at=y=>{const t=(cutY-y)/(cutY-botY),i=Math.min(23,Math.floor(t*24)),f=t*24-i;const a=stem[i],b=stem[i+1];return[a[0]+(b[0]-a[0])*f,y,a[2]+(b[2]-a[2])*f]};
      for(let y=cutY-.018;y>botY+.02;y-=.04){const c=at(y),n=7+Math.floor(rnd()*3),rot=rnd()*6.28,dens=1-(cutY-y)/(cutY-botY)*.25;
        for(let j=0;j<n;j++){const a=rot+j/n*6.283,len=(.06+rnd()*.035)*dens,up=.35+rnd()*.3;const dir=[Math.cos(a)*Math.cos(up),Math.sin(up),Math.sin(a)*Math.cos(up)];
          const m=[c[0]+dir[0]*len*.5,c[1]+dir[1]*len*.5,c[2]+dir[2]*len*.5];parts.push(G.tube([c,m],.0032,5));
          for(const s of [-.42,.42]){const a2=a+s,len2=len*.55;const d2=[Math.cos(a2)*Math.cos(up+.15),Math.sin(up+.15),Math.sin(a2)*Math.cos(up+.15)];parts.push(G.tube([m,[m[0]+d2[0]*len2,m[1]+d2[1]*len2,m[2]+d2[2]*len2]],.0026,5))}}}
      return G.merge(parts)})();
    const SWAY={vu:"",vs:`{float h=clamp((p.y-${botY.toFixed(3)})/${(cutY-botY).toFixed(3)},0.,1.);p.x+=sin(uTime*1.1+p.y*7.)*.006*h;p.z+=cos(uTime*.9+p.y*5.)*.004*h;}`};
    const sprig=root.add(R.mesh(sprigGeo,{color:"#2E9E48",rough:.55,sheen:.35,wrap:.3,key:"sprig",hooks:SWAY}));
    const cutCap=root.add(R.mesh(G.cylinder(.0075,.004,12),{color:"#C6F0B0",rough:.6}));cutCap.pos=[cutX,cutY,0];
    const bubN=root.add(K3.bubbles(R,140));
    /* nhiệt kế trong cốc */
    const tx=wx(X.therm),tTop=wyS(X.top-22),tBot=wyS(X.bot-40);
    const thermo=root.add(new G.Node());thermo.pos=[tx,0,-.06];
    thermo.add(R.mesh(G.cylinder(.012,tTop-tBot,14),{type:"glass",color:"#EAF4FF",alpha:.55})).pos=[0,tBot,0];
    thermo.add(R.mesh(G.sphere(.02,16,12),{color:"#E2382F",rough:.3})).pos=[0,tBot,0];
    const column=thermo.add(R.mesh(G.cylinder(.005,1,10),{color:"#E2382F",rough:.3}));column.pos=[0,tBot,0];
    /* đèn bàn: đế, cần, chụp, bóng; chùm sáng cộng sáng */
    const lampN=root.add(new G.Node());
    const shellM={color:"#E06A2C",rough:.38,coat:.5};
    const bY=(X.bench-X.bulbY)/UCM*k;
    lampN.add(R.mesh(G.cylinder(.16,.035,32),shellM)).pos=[-.31,0,0];
    lampN.add(R.mesh(G.cylinder(.014,bY-.02,12),{color:"#9AA3B2",rough:.3,metal:1})).pos=[-.31,.03,0];
    const armB=lampN.add(R.mesh(G.cylinder(.012,.22,12),{color:"#9AA3B2",rough:.3,metal:1}));armB.pos=[-.31,bY,0];armB.quat=G.Q.euler(0,0,-Math.PI/2);
    const shade=lampN.add(R.mesh(G.lathe([[.03,-.02],[.05,0],[.09,.08],[.12,.17],[.118,.175],[.085,.08],[.045,.005],[.028,-.012]],40),Object.assign({side:"double"},shellM)));shade.quat=G.Q.euler(0,0,-Math.PI/2);shade.pos=[-.12,bY,0];
    const bulb=lampN.add(R.mesh(G.sphere(.05,24,16),{type:"unlit",color:"#FFF4C2"}));bulb.pos=[-.02,bY,0];
    const beam=root.add(R.mesh(G.lathe([[.07,0],[.42,1]],40,{flip:true}),{type:"unlit",color:"#FFE9A6",transparent:true,blend:"add",side:"double",order:5,depth:true,key:"beam",
      hooks:{fu:"uniform float uI;",fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float e=pow(abs(dot(N,V)),1.6);float t=clamp(vO.y,0.,1.);float f=(1.-t*.7)*e*uI;base.rgb=uBase.rgb*f*.32;base.a=f;}`},uniforms:{uI:1}}));
    const glowS=root.add(R.mesh(G.sphere(1,24,16),{type:"unlit",color:"#FFE9A6",transparent:true,blend:"add",order:5,key:"glows",
      hooks:{fu:"uniform float uI;",fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=pow(abs(dot(N,V)),2.5)*uI;base.rgb=uBase.rgb*f*.5;base.a=f;}`},uniforms:{uI:1}}));glowS.scl=[.16,.16,.16];
    /* thước đo trên mặt bàn (vạch 0 ở cành rong) */
    {const c=document.createElement("canvas");c.width=1024;c.height=96;const g=c.getContext("2d");g.fillStyle="#F4D35E";g.fillRect(0,0,1024,96);g.fillStyle="#3A2E05";g.font="800 24px system-ui,sans-serif";g.textAlign="center";
      for(let cm=0;cm<=50;cm++){const x=1024-(cm/50)*1004-10;const h=cm%10===0?34:cm%5===0?24:14;g.fillRect(x-1,0,2,h);if(cm%10===0)g.fillText(String(cm),x,70)}
      g.font="700 16px system-ui,sans-serif";g.textAlign="right";g.fillText("cm",1012,90);
      const tex=R.tex2D(c,{mip:true});const ru=root.add(R.mesh(G.plane(50*k*1.02,.14),{type:"unlit",color:"#FFFFFF",key:"ruler",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:tex},uniforms:{uDim:.9}}));
      ru.pos=[-25*k+.0,.004,.62]}
    const dim=root.add(R.mesh(G.cylinder(1,1,8),{type:"unlit",color:"#FF6BD6"}));
    /* nước đá / hơi nước theo nhiệt độ */
    const ice=[];for(let i=0;i<5;i++){const n=root.add(R.mesh(G.box(.07,.06,.07,.012,2),{type:"glass",color:"#F0FAFF",alpha:.75}));n.visible=false;ice.push(n)}
    const steam=root.add(K3.puffs(R,40,"#FFFFFF"));

    /* nhãn */
    const LB=G.labels(over,R,{bounds:api.safe});
    const dTag=LB.add(`<span></span>`,()=>[(wx(bulbX(S.dLive)))/2,.06,.62]);
    const tTag=LB.add(`<span></span>`,[tx+.03,tTop+.02,-.06],"right");
    const cutTag=LB.add(`<span>Đầu cắt</span>`,[cutX-.03,cutY+.02,0],"left");
    const rongTag=LB.add(`<span>Cành rong đuôi chó</span>`,[cutX-.12,(cutY+botY)/2,0],"left");

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:-.1,maxPitch:1.3});
    const PREL={t:[-.82,.58,.05],yaw:.05,pitch:.2,rad:1.42},PREP={t:[-.7,.55,.05],yaw:.05,pitch:.22,rad:1.5};let PRE=PREL;
    let safe={x:0,y:0,w:1,h:1},zm=1,narrow=false;
    function fitDist(rad){const s=R.size();const tv=Math.tan(cam.fov/2)*safe.h/s.h,th=Math.tan(cam.fov/2)*(s.w/s.h)*safe.w/s.w;return rad/Math.min(tv,th)}
    /* khung nhìn bám theo đèn và cốc: khi dời đèn, camera lùi/tiến cho vừa */
    function fr(){const x0=wx(bulbX(S.d))-.38,x1=.47;return{t:[(x0+x1)/2,.6,.05],rad:Math.max(.82,(x1-x0)/2+.14)}}
    let frD=null;
    function home(){const f=fr();frD=S.d;Object.assign(cam,{target:f.t,yaw:PRE.yaw,pitch:PRE.pitch,dist:fitDist(f.rad)*zm})}
    function reframe(){const f=fr();frD=S.d;orbit.fly({target:f.t,yaw:cam.yaw,pitch:cam.pitch,dist:fitDist(f.rad)*zm},.8)}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));const sf=api.safe();const s=R.size();
      narrow=sf.w<560;const iw=narrow?Math.min(sf.w-20,420):300,ih=narrow?Math.round(iw*.5):214;L={inset:{x:0,y:0,w:iw,h:ih},port:false};
      ins.style.width=iw+"px";ins.style.height=ih+"px";ins.style.left=(sf.x+10)+"px";ins.style.top=(sf.y+10)+"px";
      const d=Math.min(2,window.devicePixelRatio||1);icv.width=Math.round(iw*d);icv.height=Math.round(ih*d);icv.style.width=iw+"px";icv.style.height=ih+"px";icv._d=d;
      safe=narrow?{x:sf.x,y:sf.y+ih+16,w:sf.w,h:Math.max(80,sf.h-ih-16)}:{x:sf.x+iw+18,y:sf.y,w:Math.max(80,sf.w-iw-18),h:sf.h};
      cam.shift=[2*(safe.x+safe.w/2)/s.w-1,1-2*(safe.y+safe.h/2)/s.h];const port=safe.w<safe.h;if(port!==(PRE===PREP)){PRE=port?PREP:PREL;home()}cam.dist=fitDist(fr().rad)*zm}
    function theme(){day=api.day;const E=R.env;
      if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=.55}
      else{E.bgTop=H("#16203F");E.bgBot=H("#05081A");E.bgGlow=H("#283A6E");E.sky=H("#5B6CA0");E.gnd=H("#161A2A");E.hor=H("#3A4466");E.exposure=.8;E.ink=0}
      E.k1c=[2.0,1.95,1.8];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9];over.classList.toggle("day",day)}

    /* ================= vẽ ================= */
    function place(){if(frD!==S.d&&!drag)reframe();
      const xb=wx(bulbX(S.dLive));lampN.pos=[xb+.02,0,0];
      const I=S.lamp?Math.min(1.4,Math.pow(10/S.dLive,1.2)):0;
      bulb.mat.color=S.lamp?H("#FFF4C2"):H("#5A6274");beam.visible=S.lamp;glowS.visible=S.lamp;
      const len=Math.max(.05,-xb+.25);beam.pos=[xb+.01,bY,0];beam.quat=G.Q.euler(0,0,-Math.PI/2);beam.scl=[1,len,1];beam.mat.uniforms.uI=I;
      glowS.pos=[xb,bY,0];glowS.mat.uniforms.uI=S.lamp?1:0;
      /* đường kích thước */
      const x0=xb,x1=0;dim.pos=[x0,.012,.53];dim.quat=G.Q.euler(0,0,-Math.PI/2);dim.scl=[.004,Math.max(.01,x1-x0),.004];
      /* nhiệt độ: màu nước chậu, cột nhiệt kế, đá, hơi */
      const warm=C.clamp((S.T-30)/15,0,1),cold=C.clamp((30-S.T)/22,0,1);
      bathW.mat.color=warm>0?[1,.66-.2*warm,.38]:[.45,.72+.15*cold,1];bathW.mat.alpha=.24+.12*Math.max(warm,cold);
      const h=(tTop-tBot)*.08+(tTop-tBot)*.85*C.clamp(S.T/50,0,1);column.scl=[1,h,1];
      ice.forEach((n,i)=>{n.visible=S.Tt<=12;const a=i*1.26+.4;n.pos=[Math.cos(a)*.34,.3+.01*Math.sin(simT*1.3+i),Math.sin(a)*.34];n.quat=G.Q.euler(.2*i,i,.1)});
      if(S.T>=38&&Math.random()<.15)steam.spawn([(Math.random()-.5)*.6,.42,(Math.random()-.5)*.6],.04,[0,.08,0],2.2,.12,2.5);
      /* bọt khí */
      const D=bubN.data;let c=0;
      if(S.grow){const r=C.lerp(.5,S.grow.rf,S.grow.age/.32);D.set([cutX,cutY+r/UCM*k*.8,0,r/UCM*k,1,1,1,1],c*8);c++}
      for(const b of S.bub){D.set([wx(b.x),wyS(b.y),0,b.r/UCM*k,1,1,1,1],c*8);c++}
      bubN.setInstances(c);
      const tg=`<span>d = ${fmt(S.dLive,S.dLive%1?1:0)} cm</span>`;if(dTag._h!==tg){dTag.el.innerHTML=tg;dTag._h=tg}
      const tt=`<span>${fmt(S.T,0)} °C</span>`;if(tTag._h!==tt){tTag.el.innerHTML=tt;tTag._h=tt}}
    function drawIns(){const d=icv._d||1;ctx.setTransform(d,0,0,d,0,0);ctx.clearRect(0,0,L.inset.w,L.inset.h);const P=PL.palette(day);drawInset(P)}

    /* ================= con trỏ: kéo đèn dọc thước ================= */
    function planeX(px,py){const r=R.ray(px,py);if(Math.abs(r.d[2])<1e-5)return null;const t=-r.o[2]/r.d[2];return t>0?r.o[0]+r.d[0]*t:null}
    function pick(px,py){const r=R.ray(px,py);const xb=wx(bulbX(S.dLive));
      if(G.hit.box(r,[xb-.5,0,-.2],[xb+.08,bY+.18,.2])!=null)return{lamp:1};
      if(G.hit.box(r,[-.45,0,-.45],[.45,1.15,.45])!=null)return{cyl:1};return null}
    const ptr=C.pointer(cv,{
      down(p,e){const h=pick(p.x,p.y);if(h&&h.lamp){const x=planeX(p.x,p.y);drag={off:x==null?0:wx(bulbX(S.dLive))-x};cancelCount("Đã hủy lần đếm vì em dời đèn.");return true}orbit.start(p,e.pointerId);return true},
      move(p,e){if(!drag){orbit.move(p,e.pointerId);return}const x=planeX(p.x,p.y);if(x==null)return;S.dLive=C.clamp(-(x+drag.off)/k,DMIN,DMAX)},
      up(p,e,tap){if(!drag){orbit.end(e.pointerId);return}drag=null;const nd=C.clamp(Math.round(S.dLive/5)*5,DMIN,DMAX);if(nd!==S.d){S.d=nd;refresh()}},
      cancel(){drag=null;orbit.end()},
      hover(p){if(frameN%3)return;const h=pick(p.x,p.y);cv.style.cursor=h&&h.lamp?"ew-resize":"grab"}});
    function onWheel(e){e.preventDefault();zm=C.clamp(zm*Math.exp(e.deltaY*.0012),.5,2.2);cam.dist=fitDist(fr().rad)*zm}
    cv.addEventListener("wheel",onWheel,{passive:false});
    function onKey(e){if(e.target.matches&&e.target.matches("input,textarea,select"))return;if((e.key==="b"||e.key==="B")&&S.count){e.preventDefault();tapCount()}}
    document.addEventListener("keydown",onKey);

    /* ---------- khay ---------- */
    const ico={
      lamp:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"><path d="M8 33h16M16 33V20l6-4"/><path d="M20 10l12-4v20l-12-4z"/><path d="M35 12l3-1M35 16h3M35 20l3 1"/></svg>',
      near:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20h22M23 13l7 7-7 7"/><path d="M34 10v20"/></svg>',
      far:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M32 20H10M17 13l-7 7 7 7"/><path d="M34 10v20"/></svg>',
      therm:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M17 24V8a3 3 0 0 1 6 0v16a6 6 0 1 1-6 0z"/><path d="M20 14v12"/><path d="M27 10h4M27 15h4M27 20h4"/></svg>',
      watch:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="20" cy="22" r="12"/><path d="M20 22v-7M16 5h8M20 5v5"/></svg>',
      plus:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="20" cy="20" r="13"/><path d="M20 13v14M13 20h14"/></svg>'
    };
    function refreshDock(){
      const T=TEMPS.find(x=>x.T===S.Tt);
      api.dock.innerHTML=`<button class="titem" data-k="lamp" aria-pressed="${S.lamp}">${ico.lamp}Đèn<br>${S.lamp?"đang bật":"đang tắt"}</button>
        <button class="titem" data-k="near" ${S.d<=DMIN?"disabled":""}>${ico.near}Gần hơn<br>5 cm</button>
        <button class="titem" data-k="far" ${S.d>=DMAX?"disabled":""}>${ico.far}Xa hơn<br>5 cm</button>
        <button class="titem" data-k="temp">${ico.therm}${T.ten}<br>${T.sub}</button>
        <button class="titem" data-k="count" aria-pressed="${!!S.count}">${ico.watch}${S.count?"Hủy<br>lần đếm":"Đếm<br>1 phút"}</button>
        <button class="titem" data-k="tap" ${S.count?"":"disabled"}>${ico.plus}Em đếm<br>${S.count?S.count.mine:"+1"}</button>`;
    }
    function onDock(e){const t=e.target.closest("[data-k]");if(!t||t.disabled)return;const k=t.dataset.k;
      if(k==="lamp")toggleLamp();else if(k==="near")setD(S.d-5);else if(k==="far")setD(S.d+5);
      else if(k==="temp"){const i=TEMPS.findIndex(x=>x.T===S.Tt);setT(TEMPS[(i+2)%3].k)}
      else if(k==="count")startCount();else if(k==="tap")tapCount()}
    api.dock.addEventListener("click",onDock);

    /* ---------- hướng dẫn ---------- */
    const okRec=(d)=>S.recs.some(r=>r.lamp&&r.d===d&&r.T>=25&&r.T<=35);
    const tempRec=()=>S.recs.some(r=>r.lamp&&r.d===10&&(r.T<=12||r.T>=40));
    function refresh(){
      refreshDock();
      const main=[10,20,30,40].every(okRec);
      api.okAt(0,S.locked);api.okAt(1,main);
      api.okAt(2,main&&S.obs.a==="giam"&&S.obs.b==="ngung"&&S.obs.c==="it");api.okAt(3,S.finished);
      if(bodyEl)renderStep();
    }
    function avgAt(d){const a=S.recs.filter(r=>r.lamp&&r.d===d&&r.T>=25&&r.T<=35);return a.length?a.reduce((s,r)=>s+r.machine,0)/a.length:null}
    function chart(){
      const W=320,H=200,x=d=>44+d/45*256,y=v=>164-v/50*144;
      let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Đồ thị số bọt khí mỗi phút theo khoảng cách đèn" style="width:100%;height:auto">`;
      s+=`<g stroke="currentColor" stroke-opacity=".22">${[0,10,20,30,40,50].map(v=>`<line x1="44" x2="300" y1="${y(v)}" y2="${y(v)}"/>`).join("")}</g>`;
      s+=`<g fill="currentColor" font-size="10">${[0,10,20,30,40,50].map(v=>`<text x="38" y="${y(v)+3}" text-anchor="end">${v}</text>`).join("")}${[0,10,20,30,40].map(d=>`<text x="${x(d)}" y="180" text-anchor="middle">${d}</text>`).join("")}<text x="300" y="194" text-anchor="end">Khoảng cách đèn (cm)</text><text x="6" y="12">Bọt khí/phút</text></g>`;
      s+=`<polyline fill="none" stroke="currentColor" stroke-opacity=".45" stroke-width="1.5" stroke-dasharray="4 4" points="${DATA.map(([d,v])=>`${x(d)},${y(v)}`).join(" ")}"/>`;
      s+=DATA.map(([d,v])=>`<circle cx="${x(d)}" cy="${y(v)}" r="4.5" fill="none" stroke="currentColor" stroke-opacity=".6" stroke-width="1.5"/>`).join("");
      const pts=[10,15,20,25,30,35,40].map(d=>({d,v:avgAt(d)})).filter(o=>o.v!=null);
      if(pts.length>1)s+=`<polyline fill="none" stroke="#22C55E" stroke-width="2.4" points="${pts.map(o=>`${x(o.d)},${y(o.v)}`).join(" ")}"/>`;
      s+=pts.map(o=>`<circle cx="${x(o.d)}" cy="${y(o.v)}" r="4.5" fill="#22C55E"/>`).join("");
      s+=`<g font-size="10" font-weight="700"><circle cx="170" cy="24" r="4.5" fill="#22C55E"/><text x="179" y="28" fill="currentColor">Em đo (25–35 °C)</text><circle cx="170" cy="40" r="4.5" fill="none" stroke="currentColor" stroke-width="1.5"/><text x="179" y="44" fill="currentColor">Vở thực hành</text></g>`;
      return s+`</svg>`;
    }
    function renderStep(){
      const el=bodyEl;if(!el)return;
      const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      const opt=(attr,key,cur,arr,dis)=>`<div class="opts">${arr.map(([k,t],j)=>`<button class="opt" data-${attr}="${k}" aria-pressed="${cur===k}" ${dis?"disabled":""}><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>`;
      if(stepIdx===0){
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2">Cành rong đuôi chó đặt trong cốc nước, cuống cắt hướng lên, thấp hơn mặt nước 1 cm. Chiếu đèn vào cành rong thì có bọt khí thoát ra ở đầu cắt.</p>
          <p class="lead2"><b>Câu 1.</b> Dời đèn ra xa cành rong, số bọt khí thoát ra mỗi phút sẽ:</p>
          ${opt("p1","p1",S.p1,[["tang","Tăng"],["giam","Giảm"],["khong","Không đổi"]],S.locked)}
          <p class="lead2"><b>Câu 2.</b> Bọt khí thoát ra từ cành rong chủ yếu là khí:</p>
          ${opt("p2","p2",S.p2,[["o2","Oxygen"],["co2","Carbon dioxide"],["hn","Hơi nước"]],S.locked)}
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}`;
      }else if(stepIdx===1){
        const ds=[10,20,30,40];
        el.innerHTML=`<h3>Đếm bọt khí ở 4 khoảng cách</h3>
          <p class="lead2">Giữ nước ở nhiệt độ phòng (30 °C). Đặt đèn ở từng khoảng cách, bấm <b>Đếm 1 phút</b>. Chạm khung phóng to (hoặc phím B) mỗi khi thấy một bọt khí tách khỏi đầu cắt.</p>
          <div class="chipset">${[10,15,20,25,30,35,40].map(d=>`<button data-d="${d}" aria-pressed="${S.d===d}" style="--m:#22C55E">${d} cm</button>`).join("")}</div>
          <ol class="todo" style="margin-top:10px">${ds.map(d=>`<li class="${okRec(d)?"done":""} ${S.d===d&&!okRec(d)?"now":""}"><span class="tick">✓</span><div>Đèn cách cành rong ${d} cm${okRec(d)?` · máy đếm ${S.recs.filter(r=>r.lamp&&r.d===d&&r.T>=25&&r.T<=35).slice(-1)[0].machine} bọt/phút`:""}</div></li>`).join("")}</ol>
          ${S.Tt!==30?`<div class="callout bad">Nước đang ở ${S.Tt} °C. Đổi về nhiệt độ phòng để các lần đo chỉ khác nhau ở khoảng cách đèn. <button class="btn sm" data-t="phong">Về 30 °C</button></div>`:""}
          ${!S.lamp?`<div class="callout bad">Đèn đang tắt. <button class="btn sm" data-k="lampOn">Bật đèn</button></div>`:""}
          ${gvTip("đây là thí nghiệm có một yếu tố thay đổi (khoảng cách đèn); nhiệt độ nước, cành rong, lượng nước giữ nguyên.")}`;
      }else if(stepIdx===2){
        const box=(id,txt,arr,ok,expl,need)=>`<p class="lead2">${txt}</p>${need?`<div class="muted" style="font-size:.84rem">${need}</div>`:`<div class="opts">${arr.map(([k,t],j)=>`<button class="opt ${S.obs[id]===k?(k===ok?"right":"wrong"):""}" data-obs="${id}" data-v="${k}"><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>${S.obs[id]&&S.obs[id]!==ok?`<div class="callout bad">${expl}</div>`:""}`}`;
        el.innerHTML=`<h3>Quan sát</h3>
          ${chart()}
          ${box("a","<b>1.</b> Theo đồ thị, khi đèn càng xa cành rong thì số bọt khí mỗi phút:",[["tang","Càng tăng"],["giam","Càng giảm"],["khong","Gần như không đổi"]],"giam","Nhìn lại các chấm xanh: 10 cm nhiều bọt nhất, 40 cm ít bọt nhất.")}
          ${box("b","<b>2.</b> Tắt đèn và quan sát đầu cắt khoảng 10 giây. Bọt khí:",[["nhieu","Ra nhiều hơn"],["ngung","Thưa dần rồi ngừng"],["khong","Không thay đổi"]],"ngung","Quan sát lại khung phóng to khi đèn tắt: không còn bọt mới tách ra.",S.seen.dark?"":`Bấm <button class="btn sm" data-k="lampOff">Tắt đèn</button> rồi chờ khoảng 10 giây (có thể chọn 4×).`)}
          ${box("c","<b>3.</b> Đặt đèn ở 10 cm, đổi nước sang 8 °C hoặc 45 °C rồi đếm 1 phút. So với ở 30 °C, số bọt khí:",[["nhieu","Nhiều hơn"],["it","Ít hơn hoặc ngừng hẳn"],["bang","Bằng nhau"]],"it","So sánh dòng 10 cm – 30 °C với dòng 10 cm ở nhiệt độ vừa đổi trong bảng đo.",tempRec()?"":`<div class="chipset" style="margin-top:4px"><button data-k="set10">Đèn 10 cm</button>${TEMPS.map(o=>`<button data-t="${o.k}" aria-pressed="${S.Tt===o.T}" style="--m:#F97316">${o.ten} ${o.sub}</button>`).join("")}</div><div style="margin-top:6px">Sau đó bấm <b>Đếm 1 phút</b>.</div>`)}
          ${gvTip("đường nhiệt độ trong bản này là minh họa định tính; chỉ dùng để thấy xu hướng, không dùng số bọt ở 8 °C, 45 °C làm số liệu.")}`;
      }else{
        const Q=[
          {k:"a",t:"Vì sao khi dời đèn ra xa, số bọt khí giảm?",o:[["a","Ánh sáng chiếu tới cành rong yếu đi nên quang hợp chậm lại"],["b","Nước trong cốc bị lạnh đi"],["c","Cành rong đã dùng hết nước"]],ok:"a",why:{b:"Trong thí nghiệm, nhiệt độ nước giữ ở 30 °C; chỉ khoảng cách đèn thay đổi.",c:"Cành rong luôn ngập trong nước; yếu tố thay đổi là cường độ ánh sáng."}},
          {k:"b",t:"Cây nào sau đây thuộc nhóm cây ưa bóng?",o:[["a","Cây bàng"],["b","Cây lá lốt"],["c","Cây xương rồng"]],ok:"b",why:{a:"Cây bàng là cây ưa sáng.",c:"Cây xương rồng là cây ưa sáng."}},
          {k:"c",t:"Theo bài học, khoảng nhiệt độ thuận lợi cho quá trình quang hợp là:",o:[["a","10–15 °C"],["b","25–35 °C"],["c","40–50 °C"]],ok:"b",why:{a:"Dưới 10 °C quang hợp giảm hoặc ngừng; 10–15 °C chưa phải khoảng thuận lợi.",c:"Trên 40 °C quang hợp giảm hoặc ngừng hẳn."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="giam"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{tang:"tăng",giam:"giảm",khong:"không đổi"}[S.p1]}</b>. Kết quả đo: đèn càng xa, số bọt khí mỗi phút càng ít.</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="o2"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{o2:"oxygen",co2:"carbon dioxide",hn:"hơi nước"}[S.p2]}</b>. Bọt khí thoát ra là khí oxygen do quang hợp tạo ra.</div>`:""}
          <ul class="tlist"><li>Cường độ ánh sáng càng yếu thì quang hợp càng chậm, cành rong thải ra càng ít khí oxygen.</li>
          <li>Nhiệt độ thuận lợi cho quang hợp khoảng 25–35 °C; trên 40 °C hoặc dưới 10 °C quang hợp giảm hoặc ngừng hẳn.</li>
          <li>Nồng độ khí carbon dioxide tăng thì quang hợp tăng, nhưng tăng quá cao (khoảng 0,2%) sẽ làm cây chết.</li>
          <li>Cây ưa sáng (bàng, phượng, xương rồng…) cần nhiều ánh sáng; cây ưa bóng (lá lốt, gừng, hoa nhài…) quang hợp được ở nơi ít ánh sáng. Trồng cây cần chọn nơi có ánh sáng phù hợp.</li></ul>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],j)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`;
      }
    }
    function onBody(e){
      const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}
      if(d.obs){S.obs[d.obs]=d.v;refresh();return}
      if(d.d){setD(+d.d);return}if(d.t){setT(d.t);return}
      switch(d.k){
        case "lock":S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok");break;
        case "lampOn":toggleLamp(true);break;case "lampOff":toggleLamp(false);break;
        case "set10":setD(10);break;
        case "finish":S.finished=true;refresh();api.done(`<h2>Hoàn thành: Ánh sáng và quang hợp</h2><p class="muted">Ánh sáng càng yếu, quang hợp càng chậm; nhiệt độ quá thấp hoặc quá cao cũng làm quang hợp giảm.</p>`);break;
      }
    }


    function frame(dt){frameN++;
      const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      sim(sdt,dt);steam.step(sdt);place();R.render(root,simT);LB.update();drawIns();
      api.time.label(S.count?`Đang đếm ${Math.floor(S.count.t)} / 60 s · đèn ${S.count.lamp?S.count.d+" cm":"tắt"} · ${S.count.T} °C`:`Đèn ${S.lamp?"cách "+fmt(S.dLive,0)+" cm":"tắt"} · nước ${fmt(S.T,0)} °C`,S.count?S.count.t/60:null)}
    theme();layout();home();refreshDock();
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{S.count=null;S.bub=[];S.pops=[];S.grow=null;S.lamp=true;S.Tt=30;S.T=30;S.d=20;S.dLive=20;S.rs=DATA[1][1];simT=0;refresh()});
    vp.__lab={get S(){return S},X,setD,setT,toggleLamp,startCount,tapCount,rateNow,stable,R,pick};
    return{step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},layout,prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);document.removeEventListener("keydown",onKey);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
