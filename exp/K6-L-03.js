/* K6-L-03 · Lực ma sát trên các bề mặt (SGK KHTN 6 – Kết nối tri thức, Bài 40) · 2D, điều tra
   Kéo khối gỗ bằng lực kế theo phương ngang trên các bề mặt khác nhau:
   - Khi tăng dần lực kéo, lúc đầu khối gỗ chưa chuyển động (lực ma sát nghỉ cân bằng lực kéo); khi lực kéo vượt quá giá trị lớn nhất của ma sát nghỉ,
     khối gỗ bắt đầu trượt. Kéo cho khối gỗ chuyển động đều: số chỉ lực kế bằng độ lớn lực ma sát trượt.
   - So sánh các bề mặt; đặt thêm khối gỗ lên trên (tăng áp lực) và lắp bánh xe (ma sát lăn).
   Hệ số ma sát của mô hình là giá trị minh họa (mục Nguồn). */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const SURF=[{k:"kinh",t:"Mặt kính",mu:.2,c1:"#BFDBFE",c2:"#93C5FD"},{k:"go",t:"Mặt gỗ nhẵn",mu:.3,c1:"#D6B37A",c2:"#B98B4E"},{k:"tham",t:"Mặt thảm",mu:.5,c1:"#B91C1C",c2:"#7F1D1D"},{k:"nham",t:"Giấy nhám",mu:.65,c1:"#A8A29E",c2:"#78716C"}];
const MU_ROLL=.04,P1=2.0;   /* trọng lượng một khối gỗ: 2,0 N (khoảng 200 g) */
const SPEC={
  predict:[{id:"p1",q:"Kéo khối gỗ trên giấy nhám so với trên mặt kính, lực kéo cần dùng:",opts:[["lon","Lớn hơn"],["nho","Nhỏ hơn"],["bang","Bằng nhau"]],ans:"lon",res:"Kết quả: bề mặt càng nhám, lực ma sát càng lớn."},
    {id:"p2",q:"Lắp bánh xe vào khối gỗ thì lực kéo để vật chuyển động đều:",opts:[["giam","Giảm nhiều"],["tang","Tăng"],["k","Không đổi"]],ans:"giam",res:"Kết quả: lực ma sát lăn nhỏ hơn nhiều so với lực ma sát trượt."}],
  taskLead:"Chọn bề mặt và cách đặt vật ở khay, bấm “Kéo bằng lực kế”. Đọc số chỉ lực kế khi khối gỗ bắt đầu chuyển động và khi chuyển động đều.",
  tasks:[{html:"<b>Bề mặt:</b> đo lực ma sát trượt trên cả 4 bề mặt.",done:()=>SURF.every(s=>S.log[s.k+"|1|0"])},{html:"<b>Áp lực:</b> đo khi đặt thêm một khối gỗ lên trên (cùng bề mặt).",done:()=>Object.keys(S.log).some(k=>k.endsWith("|2|0"))},{html:"<b>Ma sát lăn:</b> đo khi lắp bánh xe.",done:()=>Object.keys(S.log).some(k=>k.endsWith("|1"))}],
  obs:[{id:"a",q:"Khi khối gỗ chưa chuyển động dù đang bị kéo, lực nào cân bằng với lực kéo?",opts:[["ok","Lực ma sát nghỉ"],["trl","Trọng lực"],["k","Không có lực nào"]],ans:"ok",why:"Lực ma sát nghỉ giữ cho vật không trượt khi có lực tác dụng."},
    {id:"b",q:"Khi vật chuyển động đều, số chỉ lực kế:",opts:[["ok","Bằng độ lớn lực ma sát trượt"],["lon","Lớn hơn nhiều so với lực ma sát"],["0","Bằng 0"]],ans:"ok",why:"Hai lực cân bằng thì vật chuyển động đều."},
    {id:"c",q:"Ví dụ ma sát có lợi:",opts:[["ok","Ma sát giữa đế giày và mặt đường giúp ta đi lại không bị trượt"],["hai","Ma sát làm mòn xích xe đạp"],["k","Ma sát làm nóng máy"]],ans:"ok",why:"Ma sát làm mòn, làm nóng các bộ phận máy là ma sát có hại."}],
  concl:{html:`<ul class="tlist"><li><b>Lực ma sát</b> xuất hiện ở bề mặt tiếp xúc giữa hai vật, cản trở chuyển động (hoặc xu hướng chuyển động) của vật.</li>
    <li>Có ma sát nghỉ (giữ vật không trượt), ma sát trượt (khi vật trượt), ma sát lăn (khi vật lăn). Ma sát lăn nhỏ hơn ma sát trượt nhiều lần.</li>
    <li>Lực ma sát phụ thuộc tính chất bề mặt tiếp xúc (nhám hay nhẵn) và lực ép giữa hai bề mặt.</li>
    <li>Ma sát có thể có lợi (đi lại, phanh xe, cầm nắm) hoặc có hại (mài mòn, tốn năng lượng); có thể tăng hoặc giảm ma sát tùy mục đích.</li></ul>`,
    quiz:[{id:"q1",q:"Biện pháp làm giảm ma sát có hại trong máy móc:",opts:[["a","Tra dầu mỡ, dùng ổ bi"],["b","Làm nhám bề mặt"],["c","Tăng lực ép"]],ans:"a",why:{b:"Làm nhám bề mặt làm tăng ma sát.",c:"Tăng lực ép làm tăng ma sát."}},
      {id:"q2",q:"Lốp xe có khía rãnh để:",opts:[["a","Tăng ma sát với mặt đường, tránh trượt"],["b","Giảm ma sát"],["c","Làm xe nhẹ hơn"]],ans:"a",why:{b:"Khía rãnh làm tăng độ bám.",c:"Khía rãnh không nhằm giảm khối lượng."}}],
    done:`<h2>Hoàn thành: lực ma sát</h2><p class="muted">Ma sát phụ thuộc bề mặt và lực ép; ma sát lăn nhỏ hơn ma sát trượt.</p>`},
  gv:["Nhấn mạnh thao tác kéo lực kế song song với mặt bàn, kéo đều tay.","Cho các nhóm so sánh số đo với nhau và giải thích chênh lệch.","Liên hệ: rải cát trên đường trơn, tra dầu ổ trục."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 40)</p><ul class="tlist"><li>Nêu được lực ma sát là lực tiếp xúc xuất hiện ở bề mặt tiếp xúc giữa hai vật; khái niệm lực ma sát trượt, ma sát nghỉ; sự tương tác giữa bề mặt hai vật tạo ra lực ma sát; lấy được ví dụ về tác dụng cản trở và tác dụng thúc đẩy chuyển động của lực ma sát.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 40 Lực ma sát.</li>
<li>Ma sát nghỉ lớn nhất lớn hơn ma sát trượt; lực ma sát tỉ lệ với áp lực: <a href="https://openstax.org/books/physics/pages/5-2-friction" target="_blank" rel="noopener">OpenStax Physics, mục 5.2</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Khối gỗ nặng 2,0 N. Hệ số ma sát trượt (kính 0,20; gỗ nhẵn 0,30; thảm 0,50; giấy nhám 0,65; lăn 0,04) và ma sát nghỉ lớn nhất bằng 1,2 lần ma sát trượt là giá trị minh họa, không phải số đo.</li></ul>`;

let S;
LabKHTN.register("K6-L-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"bm",t:"Bề mặt, cách đặt"},{k:"nghi",t:"Lúc bắt đầu trượt (N)"},{k:"truot",t:"Khi chuyển động đều (N)"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng đo lực ma sát bằng lực kế",views:{ms:{label:"Lực ma sát",icon:IC.hand,frame:[30,40,940,560]}}});
    S={si:1,n:1,wheel:0,ph:"idle",F:0,x:0,t:0,peak:0,log:{},recs:0};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const Nf=()=>P1*S.n,mu=()=>S.wheel?MU_ROLL:SURF[S.si].mu,Fk=()=>mu()*Nf(),Fs=()=>S.wheel?Fk()*1.5:Fk()*1.2;
    const HI=()=>K.day?"#B45309":"#FCD34D";
    function drawSurf(ctx,x,y,w,h){const s=SURF[S.si];const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,s.c1);g.addColorStop(1,s.c2);ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
      if(s.k==="nham"){for(let i=0;i<700;i++){ctx.fillStyle=i%2?"rgba(0,0,0,.25)":"rgba(255,255,255,.2)";ctx.fillRect(x+(i*37)%w,y+(i*13)%h,2,2)}}
      else if(s.k==="tham"){ctx.strokeStyle="rgba(0,0,0,.18)";for(let i=0;i<w;i+=5){ctx.beginPath();ctx.moveTo(x+i,y);ctx.lineTo(x+i,y+h);ctx.stroke()}}
      else if(s.k==="go"){ctx.strokeStyle="rgba(120,80,30,.35)";for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(x,y+4+i*h/7);ctx.bezierCurveTo(x+w*.3,y+i*h/7,x+w*.6,y+8+i*h/7,x+w,y+3+i*h/7);ctx.stroke()}}
      else{ctx.fillStyle="rgba(255,255,255,.35)";ctx.fillRect(x,y+2,w,4)}}
    function block(ctx,x,y,w,h){const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,"#E7C48A");g.addColorStop(1,"#B9884A");ctx.fillStyle=g;C.rr(ctx,x,y,w,h,4);ctx.fill();ctx.strokeStyle="rgba(90,60,20,.5)";ctx.lineWidth=1.5;ctx.stroke();
      ctx.strokeStyle="rgba(120,80,30,.35)";for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(x+4,y+i*h/4);ctx.quadraticCurveTo(x+w/2,y+i*h/4+4,x+w-4,y+i*h/4);ctx.stroke()}}
    function scale(ctx,x,y,F,len){/* lực kế nằm ngang: thân + thang 0–5 N, móc nối khối gỗ ở bên trái */ctx.save();ctx.fillStyle="#F8FAFC";C.rr(ctx,x,y-14,len,28,8);ctx.fill();ctx.strokeStyle="#64748B";ctx.lineWidth=2;ctx.stroke();
      const s0=x+24,s1=x+len-30;ctx.fillStyle="#111";for(let i=0;i<=50;i++){const px=s0+i/50*(s1-s0);const L=i%10===0?12:i%5===0?8:5;ctx.fillRect(px-.6,y-14,1.2,L);if(i%10===0)T(ctx,String(i/10),px,y+11,10,"#111")}
      const pp=s0+C.clamp(F,0,5)/5*(s1-s0);ctx.fillStyle="#DC2626";ctx.beginPath();ctx.moveTo(pp,y-14);ctx.lineTo(pp-5,y-22);ctx.lineTo(pp+5,y-22);ctx.closePath();ctx.fill();ctx.fillRect(pp-1,y-14,2,16);ctx.restore()}
    const geo=()=>{const sx=120,sy=420,bw=130,bh=70,bx=sx+40+S.x*.8,by=sy-bh-(S.wheel?16:0),hy=by+bh/2,lx=bx+bw+40;return{bx,by,bw,bh,hy,lx,hx:lx+262}};
    function finish(){S.ph="done";S.F=Fk();S.man=false;const key=`${SURF[S.si].k}|${S.n}|${S.wheel}`;if(!S.log[key]){S.log[key]=1;S.recs++;api.record({lan:String(S.recs),bm:`${SURF[S.si].t}${S.n===2?", thêm 1 khối gỗ":""}${S.wheel?", có bánh xe":""}`,nghi:fmt(S.peak,1),truot:fmt(Fk(),1)})}refresh()}
    /* kéo trực tiếp bằng tay: nắm tay cầm lực kế, kéo sang phải */
    K.pickFn(q=>{if(S.ph==="slip")return null;const g=geo();return Math.abs(q[0]-g.hx)<70&&Math.abs(q[1]-g.hy)<45||(q[0]>g.lx-10&&q[0]<g.lx+250&&Math.abs(q[1]-g.hy)<24)?{drag:true,k:"hand"}:null});
    K.dragFn((ph,k,q)=>{if(ph==="start"){if(S.ph==="done"){S.ph="idle";S.F=0;S.x=0;S.peak=0}S.man=true;S.gx=q[0];S.x0=S.x;S.sx0=null;return}
      if(ph==="move"){const dx=q[0]-S.gx;if(S.ph==="idle"||S.ph==="hold"){const F=C.clamp(dx/45,0,5.2);S.F=Math.max(0,F);S.peak=Math.max(S.peak,S.F);S.ph=S.F>.04?"hold":"idle";if(S.F>=Fs()){S.F=Fs();S.peak=Fs();S.ph="move";S.sx0=q[0]}}
        else if(S.ph==="move"){S.x=Math.max(S.x0,S.x0+(q[0]-S.sx0)/.8);S.F=Fk()+Math.sin(K.simT*9)*.02;if(S.x>420)finish()}refresh();return}
      if(ph==="end"||ph==="cancel"){if(S.ph==="move"&&S.x-S.x0>60)finish();else if(S.ph!=="done"){S.ph="idle";S.F=0;S.x=0;S.peak=0;S.man=false}refresh()}});
    function draw(ctx,P){const sx=120,sy=420,sw=760,sh=60;drawSurf(ctx,sx,sy,sw,sh);T(ctx,SURF[S.si].t,sx,sy+sh+22,14,P.mut,"left",700);
      const bw=130,bh=70,bx=sx+40+S.x*.8,by=sy-bh-(S.wheel?16:0);block(ctx,bx,by,bw,bh);if(S.n===2)block(ctx,bx+10,by-60,bw-20,60);
      if(S.wheel){for(const wx of [bx+28,bx+bw-28]){ctx.fillStyle="#111827";ctx.beginPath();ctx.arc(wx,sy-9,9,0,6.283);ctx.fill();ctx.fillStyle="#9CA3AF";ctx.beginPath();ctx.arc(wx,sy-9,3,0,6.283);ctx.fill()}}
      /* dây nối + lực kế + tay */
      const hy=by+bh/2,lx=bx+bw+40,sc_=K.day?"#334155":"#E2E8F0";ctx.strokeStyle="#94A3B8";ctx.lineWidth=3;ctx.beginPath();ctx.arc(bx+bw+5,hy,5,0,6.283);ctx.stroke();ctx.strokeStyle=sc_;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(bx+bw+10,hy);ctx.lineTo(lx-8,hy);ctx.stroke();ctx.strokeStyle="#94A3B8";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(lx,hy);ctx.lineTo(lx-8,hy);ctx.arc(lx-8,hy+4,4,-Math.PI/2,Math.PI/2,true);ctx.stroke();scale(ctx,lx,hy,S.F,240);
      ctx.fillStyle="#F2C9A0";ctx.beginPath();ctx.ellipse(lx+262,hy,26,18,0,0,6.283);ctx.fill();ctx.fillStyle="#E5B48A";for(let i=0;i<4;i++){ctx.beginPath();ctx.ellipse(lx+250,hy-12+i*8,7,4,0,0,6.283);ctx.fill()}
      /* mũi tên lực */
      if(S.F>0){const k=26;D2.arrow(ctx,bx+bw,hy-50,bx+bw+S.F*k,hy-50,"#EF4444",4,12);T(ctx,`F kéo = ${fmt(S.F,1)} N`,bx+bw+S.F*k+8,hy-46,14,"#F87171","left");
        const fr=S.ph==="hold"?S.F:Math.min(S.F,S.ph==="move"||S.ph==="done"?Fk():S.F);D2.arrow(ctx,bx,sy-4,bx-fr*k,sy-4,"#60A5FA",4,12);T(ctx,`F ma sát = ${fmt(fr,1)} N`,bx-fr*k-8,sy-12,14,"#93C5FD","right")}
      /* trạng thái */
      const msg={idle:"Nắm tay cầm lực kế và kéo sang phải (hoặc bấm “Kéo bằng lực kế”)",hold:S.man?"Kéo mạnh dần – khối gỗ vẫn đứng yên (ma sát nghỉ)":"Lực kéo tăng dần – khối gỗ vẫn đứng yên (ma sát nghỉ)",slip:"Khối gỗ bắt đầu trượt!",move:S.man?"Khối gỗ đã trượt: tiếp tục kéo đều tay sang phải":"Kéo cho khối gỗ chuyển động đều",done:"Đã đo xong"}[S.ph];T(ctx,msg,500,120,18,HI());
      if(S.ph==="done"||S.ph==="move")T(ctx,`Lúc bắt đầu trượt: ${fmt(S.peak,1)} N · khi chuyển động đều: ${fmt(Fk(),1)} N`,500,150,15,P.ink);
      T(ctx,`Trọng lượng vật: ${fmt(Nf(),1)} N${S.wheel?" · có bánh xe":""}`,500,180,14,P.mut,"center",700)}
    K.drawFn(draw);
    K.onFrame(dt=>{if(S.man)return;if(S.ph==="hold"){S.F+=dt*.8*Math.max(.4,Fs());S.peak=S.F;if(S.F>=Fs()){S.F=Fs();S.peak=Fs();S.ph="slip";S.t=0}}
      else if(S.ph==="slip"){S.t+=dt;S.x+=dt*60;S.F+=(Fk()-S.F)*Math.min(1,dt*4);if(S.t>.6){S.ph="move";S.t=0}}
      else if(S.ph==="move"){S.t+=dt;S.x+=dt*70;S.F=Fk()+Math.sin(K.simT*9)*.02;if(S.t>2.2||S.x>420){S.ph="done";S.F=Fk();const key=`${SURF[S.si].k}|${S.n}|${S.wheel}`;if(!S.log[key]){S.log[key]=1;S.recs++;api.record({lan:String(S.recs),bm:`${SURF[S.si].t}${S.n===2?", thêm 1 khối gỗ":""}${S.wheel?", có bánh xe":""}`,nghi:fmt(S.peak,1),truot:fmt(Fk(),1)})}refresh()}}});
    K.dockFn(()=>{const busy=S.ph==="hold"||S.ph==="slip"||S.ph==="move";return[{grid:SURF.map((s,i)=>({k:"si",v:String(i),label:s.t,icon:"",on:S.si===i,dis:busy}))},
      {seg:[{k:"n",v:"1",label:"1 khối gỗ",icon:"",on:S.n===1},{k:"n",v:"2",label:"2 khối chồng",icon:"",on:S.n===2}],label:"Áp lực"},{seg:[{k:"wh",v:"0",label:"Trượt",icon:"",on:!S.wheel},{k:"wh",v:"1",label:"Có bánh xe",icon:"",on:!!S.wheel}],label:"Cách chuyển động"},
      {k:"pull",label:"Kéo bằng lực kế",icon:IC.hand,dis:busy}]});
    K.onDock((k,v)=>{const reset=()=>{S.ph="idle";S.F=0;S.x=0;S.peak=0};if(k==="si"){S.si=+v;reset()}else if(k==="n"){S.n=+v;reset()}else if(k==="wh"){S.wheel=+v;reset()}else if(k==="pull"){reset();S.man=false;S.ph="hold"}refresh()});
    K.infoFn(()=>`<div><b>${SURF[S.si].t}</b> · ${S.n} khối gỗ${S.wheel?" · bánh xe":""}</div><div>Số chỉ lực kế: ${fmt(S.F,1)} N</div><small>Lực kế: GHĐ 5 N, ĐCNN 0,1 N. Đã đo ${Object.keys(S.log).length} trường hợp.</small>`);
    K.timeLabel(()=>"Lực ma sát");
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){const go=()=>{S.peak=Fs();S.ph="move";S.t=9};for(let i=0;i<4;i++){S.si=i;S.n=1;S.wheel=0;go();K._frameTick?0:0;const key=`${SURF[i].k}|1|0`;S.log[key]=1;S.recs++;api.record({lan:String(S.recs),bm:SURF[i].t,nghi:fmt(Fs(),1),truot:fmt(Fk(),1)})}
      S.n=2;S.log["go|2|0"]=1;api.record({lan:"5",bm:"Gỗ, 2 khối",nghi:fmt(Fs(),1),truot:fmt(Fk(),1)});S.n=1;S.wheel=1;S.log["go|1|1"]=1;api.record({lan:"6",bm:"Gỗ, bánh xe",nghi:fmt(Fs(),1),truot:fmt(Fk(),1)});S.wheel=0;S.ph="idle";refresh()}};
    return K.mount(st)}
});
})();
