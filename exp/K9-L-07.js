/* K9-L-07 · Năng lượng của dòng điện và công suất điện (SGK KHTN 9 – Kết nối tri thức, Bài 13) · 2D
   1. Đo công suất bóng đèn 6 V – 3 W: thay đổi hiệu điện thế, đọc vôn kế, ampe kế, tính P = U·I, so sánh với công suất định mức.
   2. Tiêu thụ điện trong gia đình: bật, tắt các đồ dùng điện; công tơ điện đếm số kWh, đĩa quay nhanh khi tổng công suất lớn.
      A = P·t; 1 kWh = 3 600 000 J. Thời gian tua nhanh: 1 giây trên màn hình = 30 phút thật. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
/* bóng đèn sợi đốt 6 V – 3 W: I = 0,5·(U/6)^0,55 A (điện trở dây tóc tăng khi nóng, gần đúng) */
const lampI=U=>U<=0?0:.5*Math.pow(U/6,.55);
const US=[0,1.5,3,4.5,6];
const APP=[["led","Đèn LED",9],["quat","Quạt điện",50],["tv","Tivi",100],["tl","Tủ lạnh",120],["noi","Nồi cơm điện",700],["dh","Điều hòa",1000],["am","Ấm siêu tốc",1800]];
const PRICE=2000;   /* đồng/kWh: giá minh họa */

const SPEC={
  predict:[{id:"p1",q:"Bóng đèn ghi 6 V – 3 W. Khi mắc vào hiệu điện thế 6 V, cường độ dòng điện qua đèn là:",opts:[["05","0,5 A"],["2","2 A"],["18","18 A"]],ans:"05",res:"Kết quả: I = P/U = 3/6 = 0,5 A; đèn sáng bình thường."},
    {id:"p2",q:"Ấm siêu tốc 1 800 W đun nước trong 6 phút tiêu thụ điện năng:",opts:[["018","0,18 kWh"],["108","10,8 kWh"],["18","1,8 kWh"]],ans:"018",res:"Kết quả: A = P·t = 1,8 kW × 0,1 h = 0,18 kWh."}],
  taskLead:"Chọn phần ở khay. Phần 1: tăng dần hiệu điện thế, ghi số đo. Phần 2: bật các đồ dùng điện, chạy thời gian và đọc công tơ.",
  tasks:[{html:"<b>Công suất đèn:</b> ghi số đo ở ít nhất 3 hiệu điện thế, trong đó có 6 V.",done:()=>S.l.log.length>=3&&S.l.log.some(l=>l.U===6)},
    {html:"<b>Công tơ:</b> bật ít nhất 3 đồ dùng và cho chạy đủ 1 ngày (24 giờ).",done:()=>S.h.rec24}],
  obs:[{id:"a",q:"Khi U nhỏ hơn 6 V, công suất của đèn 6 V – 3 W so với 3 W:",opts:[["nho","Nhỏ hơn, đèn sáng yếu"],["bang","Bằng 3 W"],["lon","Lớn hơn"]],ans:"nho",why:"Công suất định mức chỉ đạt được khi đèn dùng đúng hiệu điện thế định mức."},
    {id:"b",q:"Số đếm của công tơ điện cho biết:",opts:[["A","Điện năng đã tiêu thụ, tính bằng kWh"],["P","Công suất của các dụng cụ"],["I","Cường độ dòng điện"]],ans:"A",why:"Mỗi số đếm (1 “số điện”) ứng với 1 kWh."},
    {id:"c",q:"Đồ dùng nào làm công tơ quay nhanh nhất khi bật riêng?",opts:[["am","Ấm siêu tốc"],["led","Đèn LED"],["quat","Quạt điện"]],ans:"am",why:"Công suất càng lớn, điện năng tiêu thụ trong cùng thời gian càng nhiều."}],
  concl:{html:`<div class="eq">P = U·I &nbsp;&nbsp; A = P·t = U·I·t &nbsp;&nbsp; 1 kWh = 3,6·10⁶ J</div><ul class="tlist">
    <li>Dòng điện có năng lượng (điện năng) vì có thể thực hiện công và cung cấp nhiệt lượng; điện năng chuyển hóa thành các dạng năng lượng khác.</li>
    <li>Công suất điện của một đoạn mạch: P = U·I; đơn vị W. Số oát ghi trên dụng cụ là công suất định mức khi dùng đúng hiệu điện thế định mức.</li>
    <li>Điện năng tiêu thụ được đo bằng công tơ điện, đơn vị thường dùng là kWh.</li></ul>`,
    quiz:[{id:"q1",q:"Một bóng đèn 220 V – 60 W dùng đúng định mức 5 giờ mỗi ngày trong 30 ngày tiêu thụ:",opts:[["a","9 kWh"],["b","300 kWh"],["c","0,3 kWh"]],ans:"a",why:{b:"Phải đổi W sang kW: 0,06 kW × 150 h.",c:"Đó là điện năng 1 ngày."}},
      {id:"q2",q:"Cách tiết kiệm điện năng hiệu quả là:",opts:[["a","Dùng đèn LED, tắt thiết bị khi không dùng"],["b","Bật đèn cả ngày cho sáng"],["c","Mở cửa tủ lạnh lâu"]],ans:"a",why:{b:"Lãng phí điện.",c:"Tủ lạnh phải chạy nhiều hơn."}}],
    done:`<h2>Hoàn thành: Năng lượng và công suất điện</h2><p class="muted">P = U·I; A = P·t; công tơ đếm số kWh.</p>`},
  gv:["Cho học sinh tính trước số tiền điện một tháng của gia đình mình từ công suất và thời gian dùng các đồ điện.","Giá điện trong mô phỏng là giá minh họa; khi dạy có thể lấy biểu giá bán lẻ điện sinh hoạt hiện hành.","Hỏi: vì sao đèn LED tiết kiệm điện hơn đèn sợi đốt cùng độ sáng?"]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 13)</p><ul class="tlist"><li>Lấy ví dụ chứng tỏ dòng điện có năng lượng; nêu được công suất điện định mức; tính được năng lượng điện và công suất điện trong trường hợp đơn giản.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 13 Năng lượng của dòng điện và công suất điện.</li>
<li>Công suất điện, kWh: <a href="https://openstax.org/books/college-physics-2e/pages/20-4-electric-power-and-energy" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 20.4</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Điện trở dây tóc tăng khi nóng nên I ≈ 0,5·(U/6)^0,55 A (gần đúng). Công suất các đồ dùng là giá trị điển hình; tủ lạnh coi như chạy liên tục với công suất trung bình 120 W. Giá điện 2 000 đồng/kWh là giá minh họa, không phải biểu giá hiện hành.</li></ul>`;

let S;
LabKHTN.register("K9-L-07",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"so",t:"Số liệu"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:620,aria:"Đo công suất bóng đèn và tiêu thụ điện trong gia đình",views:{den:{label:"Công suất đèn",icon:IC.sun,frame:[80,60,840,520]},nha:{label:"Công tơ điện",icon:IC.bolt,frame:[30,40,940,560]}}});
    S={l:{U:3,log:[]},h:{on:{led:1,tl:1},t:0,kwh:0,run:false,disc:0,rec24:false,hist:[]},recs:0};
    const rec=(tn,so,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,so,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const Ptot=()=>APP.reduce((s,a)=>s+(S.h.on[a[0]]?a[2]:0),0);
    function dial(ctx,x,y,r,val,max,unit,label,P){D2.block(ctx,x-r-14,y-r-14,2*r+28,2*r*.8+40,14,P.card,P.card,{stroke:P.line});
      ctx.strokeStyle=P.ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y+r*.35,r,Math.PI*1.15,Math.PI*1.85);ctx.stroke();
      for(let i=0;i<=10;i++){const a=Math.PI*(1.15+.7*i/10);ctx.beginPath();ctx.moveTo(x+Math.cos(a)*r,y+r*.35+Math.sin(a)*r);ctx.lineTo(x+Math.cos(a)*(r-(i%5?8:14)),y+r*.35+Math.sin(a)*(r-(i%5?8:14)));ctx.stroke();
        if(i%5===0)D2.text(ctx,fmt(max*i/10,max<1?1:max<10?1:0),x+Math.cos(a)*(r-28),y+r*.35+Math.sin(a)*(r-28)+5,{s:13,w:700,c:P.mut,a:"center"})}
      const a=Math.PI*(1.15+.7*C.clamp(val/max,0,1));ctx.strokeStyle="#DC2626";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x,y+r*.35);ctx.lineTo(x+Math.cos(a)*(r-6),y+r*.35+Math.sin(a)*(r-6));ctx.stroke();
      D2.text(ctx,unit,x,y+r*.25,{s:26,w:900,c:"#DC2626",a:"center"});D2.text(ctx,label,x,y+r*.35+28,{s:16,w:800,c:P.ink,a:"center"})}
    function bulb(ctx,x,y,b){const g=ctx.createRadialGradient(x,y,4,x,y,160);g.addColorStop(0,`rgba(255,230,150,${.75*b})`);g.addColorStop(1,"rgba(255,200,80,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,160,0,6.283);ctx.fill();
      ctx.fillStyle="rgba(230,240,255,.35)";ctx.strokeStyle="rgba(200,215,235,.9)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,48,0,6.283);ctx.fill();ctx.stroke();
      ctx.strokeStyle=b>.05?C.mix("#FF9A3D","#FFF6D0",Math.min(1,b)):"#6B7280";ctx.lineWidth=3;ctx.beginPath();for(let i=0;i<=24;i++){const t=i/24;ctx.lineTo(x-18+36*t,y-4+5*Math.sin(t*Math.PI*8))}ctx.stroke();
      D2.block(ctx,x-22,y+44,44,30,4,"#9CA3AF","#4B5563",{shadow:false});ctx.fillStyle="#374151";for(let i=0;i<3;i++)ctx.fillRect(x-22,y+50+i*8,44,3)}
    function drawL(ctx,P){const U=S.l.U,I=lampI(U),Pw=U*I;
      bulb(ctx,330,230,C.clamp(Pw/3,0,1.1));D2.text(ctx,"6 V – 3 W",330,340,{s:18,w:800,c:P.ink,a:"center"});
      dial(ctx,640,170,96,U,6,"V","Vôn kế",P);dial(ctx,640,420,96,I,.6,"A","Ampe kế",P);
      D2.block(ctx,110,420,300,130,12,P.card,P.card,{stroke:P.line});D2.text(ctx,`U = ${fmt(U,1)} V`,130,456,{s:20,w:800,c:P.ink});D2.text(ctx,`I = ${fmt(I,2)} A`,130,486,{s:20,w:800,c:P.ink});D2.text(ctx,`P = U·I = ${fmt(Pw,2)} W`,130,520,{s:20,w:900,c:K.day?"#B45309":"#FCD34D"})}
    function stepH(dt){const Hh=S.h;if(!Hh.run||dt<=0)return;const hrs=dt*.5;/* 1 s = 30 phút */Hh.t+=hrs;Hh.kwh+=Ptot()/1000*hrs;Hh.disc+=Ptot()*dt*.004;
      if(!Hh.rec24&&Hh.t>=24){Hh.rec24=true;const list=APP.filter(a=>Hh.on[a[0]]);rec("Dùng điện 24 giờ",list.map(a=>`${a[1].toLowerCase()} ${a[2]} W`).join(", "),`tổng công suất ${fmt(Ptot(),0)} W; công tơ tăng ${fmt(Hh.kwh,2)} kWh (= ${fmt(Hh.kwh*3.6,1)}·10⁶ J); tiền điện ≈ ${fmt(Math.round(Hh.kwh*PRICE/100)*100,0)} đồng (giá minh họa)`);Hh.run=false;refresh()}}
    const ICON={led:(c,x,y)=>{c.fillStyle="#FFF4C2";c.beginPath();c.arc(x,y-6,16,Math.PI,0);c.fill();c.fillStyle="#9CA3AF";c.fillRect(x-14,y-6,28,10)},
      quat:(c,x,y,t)=>{c.save();c.translate(x,y-8);c.rotate(t);c.fillStyle="#93C5FD";for(let i=0;i<3;i++){c.rotate(2.094);c.beginPath();c.ellipse(0,-10,6,11,0,0,6.283);c.fill()}c.restore();c.fillStyle="#6B7280";c.fillRect(x-2,y,4,14)},
      tv:(c,x,y)=>{D2.block(c,x-24,y-24,48,32,3,"#111827","#111827",{shadow:false});c.fillStyle="#3B82F6";c.fillRect(x-20,y-20,40,24);c.fillStyle="#6B7280";c.fillRect(x-8,y+8,16,4)},
      tl:(c,x,y)=>{D2.block(c,x-16,y-30,32,46,4,"#E5E7EB","#9CA3AF",{shadow:false});c.strokeStyle="#6B7280";c.beginPath();c.moveTo(x-16,y-12);c.lineTo(x+16,y-12);c.stroke()},
      noi:(c,x,y)=>{D2.block(c,x-20,y-16,40,28,10,"#F3F4F6","#9CA3AF",{shadow:false});c.fillStyle="#EF4444";c.fillRect(x-4,y-4,8,5)},
      dh:(c,x,y)=>{D2.block(c,x-28,y-18,56,20,6,"#F9FAFB","#D1D5DB",{shadow:false});c.strokeStyle="#9CA3AF";for(let i=0;i<4;i++){c.beginPath();c.moveTo(x-22,y-4+i*.0);c.lineTo(x+22,y-4);c.stroke()}},
      am:(c,x,y)=>{c.fillStyle="#D1D5DB";c.beginPath();c.moveTo(x-16,y+12);c.lineTo(x-12,y-18);c.lineTo(x+12,y-18);c.lineTo(x+16,y+12);c.closePath();c.fill();c.strokeStyle="#9CA3AF";c.lineWidth=4;c.beginPath();c.arc(x+18,y-4,8,-1.4,1.4);c.stroke()}};
    function drawH(ctx,P){const Hh=S.h;
      /* ngôi nhà */
      ctx.fillStyle=K.day?"#E2E8F0":"#1E293B";ctx.beginPath();ctx.moveTo(60,230);ctx.lineTo(330,70);ctx.lineTo(600,230);ctx.closePath();ctx.fill();D2.block(ctx,80,230,500,330,8,K.day?"#F8FAFC":"#243049",K.day?"#E2E8F0":"#1A2338",{stroke:P.line});
      APP.forEach((a,i)=>{const col=i%3,row=Math.floor(i/3);const x=170+col*160,y=300+row*100;const on=!!Hh.on[a[0]];
        if(on){ctx.fillStyle="rgba(253,224,71,.16)";ctx.beginPath();ctx.arc(x,y-6,40,0,6.283);ctx.fill()}ctx.globalAlpha=on?1:.45;ICON[a[0]](ctx,x,y,K.simT*12);ctx.globalAlpha=1;
        D2.text(ctx,a[1],x,y+34,{s:15,w:800,c:P.ink,a:"center"});D2.text(ctx,`${a[2]} W`,x,y+52,{s:14,w:700,c:on?(K.day?"#B45309":"#FCD34D"):P.mut,a:"center"})});
      /* công tơ điện */
      const mx=780,my=150;D2.block(ctx,mx-120,my-80,240,330,16,"#E5E7EB","#9CA3AF",{stroke:"rgba(0,0,0,.25)"});D2.block(ctx,mx-100,my-60,200,160,10,"#F8FAFC","#E2E8F0",{shadow:false,stroke:"rgba(0,0,0,.2)"});
      const v=Hh.kwh;const digs=String(Math.floor(v*10)).padStart(6,"0");for(let i=0;i<6;i++){const last=i===5;D2.block(ctx,mx-84+i*28,my-40,26,40,3,last?"#B91C1C":"#111827",last?"#7F1D1D":"#111827",{shadow:false});D2.text(ctx,digs[i],mx-71+i*28,my-12,{s:24,w:800,c:"#FFFFFF",a:"center",f:"'Courier New',monospace"})}
      D2.text(ctx,"kWh",mx+86,my+16,{s:14,w:800,c:"#111827",a:"right"});D2.text(ctx,"CÔNG TƠ ĐIỆN 1 PHA · 220 V",mx-10,my+36,{s:12,w:800,c:"#374151",a:"center"});
      /* đĩa quay: vạch đỏ cho thấy tốc độ quay */
      ctx.fillStyle="#9CA3AF";ctx.fillRect(mx-80,my+50,160,10);const dx=((Hh.disc%1)*160);ctx.fillStyle="#DC2626";ctx.fillRect(mx-80+dx,my+50,10,10);
      D2.text(ctx,"đĩa nhôm (vạch đỏ)",mx,my+80,{s:12,w:700,c:"#374151",a:"center"});
      D2.text(ctx,`P = ${fmt(Ptot(),0)} W`,mx,my+130,{s:26,w:900,c:"#111827",a:"center"});D2.text(ctx,`Thời gian: ${fmt(Hh.t,1)} giờ`,mx,my+164,{s:18,w:800,c:"#111827",a:"center"});
      D2.text(ctx,`Tiền điện ≈ ${fmt(Math.round(v*PRICE/100)*100,0)} đồng`,mx,my+196,{s:16,w:700,c:"#374151",a:"center"});
      /* đồ thị điện năng theo thời gian */
      if(Hh.hist.length>1)D2.chart(ctx,{x:660,y:420,w:280,h:110,x0:0,x1:Math.max(24,Math.ceil(Hh.t)),y0:0,y1:Math.max(1,Math.ceil(Hh.kwh)),nx:4,ny:2,xl:"t (giờ)",yl:"kWh"},[{pts:Hh.hist,c:"#F59E0B"}],P)}
    K.onFrame(dt=>{stepH(dt);const Hh=S.h;if(Hh.run&&(!Hh.hist.length||Hh.t-Hh.hist[Hh.hist.length-1][0]>.25))Hh.hist.push([Hh.t,Hh.kwh])});
    K.drawFn((ctx,P)=>K.view==="den"?drawL(ctx,P):drawH(ctx,P));
    K.label("Dây tóc nóng sáng",[330,226],{view:"den",dir:"n",len:70});K.label("Số đếm (1 số = 1 kWh)",[780,110],{view:"nha",dir:"n",len:20});
    K.pickFn(q=>{if(K.view!=="nha")return null;for(let i=0;i<APP.length;i++){const col=i%3,row=Math.floor(i/3);const x=170+col*160,y=300+row*100;if(Math.abs(q[0]-x)<60&&Math.abs(q[1]-y)<45)return{a:APP[i][0]}}return null});
    K.tapFn(k=>{if(!k)return;S.h.on[k.a]=!S.h.on[k.a];refresh()});
    K.dockFn(()=>{if(K.view==="den")return[{grid:[{k:"u",v:"-",label:"Giảm U",icon:IC.minus,dis:S.l.U<=0},{k:"u",v:"+",label:"Tăng U",icon:IC.plus,dis:S.l.U>=6}]},{k:"rec",label:"Ghi số đo",icon:IC.pen}];
      const Hh=S.h;return[{grid:APP.map(a=>({k:"app",v:a[0],label:a[1],icon:IC.bolt,on:!!Hh.on[a[0]]}))},"hr",{k:"run",label:Hh.run?"Tạm dừng thời gian":"Chạy thời gian",icon:Hh.run?IC.ban:IC.play,on:Hh.run},{k:"rh",label:"Đặt lại công tơ",icon:IC.reset}]});
    K.onDock((k,v)=>{if(k==="u"){const i=US.indexOf(S.l.U);S.l.U=US[C.clamp(i+(v==="+"?1:-1),0,US.length-1)]}
      else if(k==="rec"){const U=S.l.U,I=lampI(U);S.l.log.push({U});rec("Đo công suất đèn 6 V – 3 W",`U = ${fmt(U,1)} V; I = ${fmt(I,2)} A`,`P = U·I = ${fmt(U*I,2)} W${U===6?" (bằng công suất định mức, đèn sáng bình thường)":U>0?" (nhỏ hơn 3 W, đèn sáng yếu)":""}`)}
      else if(k==="app")S.h.on[v]=!S.h.on[v];else if(k==="run")S.h.run=!S.h.run;else if(k==="rh"){Object.assign(S.h,{t:0,kwh:0,run:false,hist:[],rec24:S.h.rec24})}
      refresh()});
    K.infoFn(()=>{if(K.view==="den"){const U=S.l.U,I=lampI(U);return `<div><b>Bóng đèn 6 V – 3 W</b></div><div>U = ${fmt(U,1)} V · I = ${fmt(I,2)} A</div><div>P = ${fmt(U*I,2)} W</div><small>Công suất định mức 3 W đạt được khi U = 6 V.</small>`}
      const Hh=S.h;return `<div><b>Tiêu thụ điện</b> · tua nhanh: 1 s = 30 phút</div><div>Đang bật: ${APP.filter(a=>Hh.on[a[0]]).map(a=>a[1]).join(", ")||"không"}</div><div>Tổng công suất: ${fmt(Ptot(),0)} W</div><div>Điện năng: ${fmt(Hh.kwh,2)} kWh</div><small>Chạm vào đồ dùng để bật, tắt.</small>`});
    K.timeLabel(()=>K.view==="den"?`U = ${fmt(S.l.U,1)} V`:[`${fmt(S.h.t,1)} giờ`,Math.min(1,S.h.t/24)]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){for(const u of [1.5,3,6]){S.l.U=u;const I=lampI(u);S.l.log.push({U:u});rec("Đo công suất đèn 6 V – 3 W",`U = ${fmt(u,1)} V; I = ${fmt(I,2)} A`,`P = ${fmt(u*I,2)} W`)}S.h.on={led:1,tl:1,tv:1,quat:1};S.h.run=true;refresh()}};
    return K.mount(st)}
});
})();
