/* K6-L-04 · Chuyển hóa và bảo toàn năng lượng (SGK KHTN 6 – Kết nối tri thức, Bài 41–42) · 2D
   1. Con lắc: thế năng ↔ động năng; có lực cản thì một phần năng lượng chuyển thành nhiệt; tổng năng lượng không đổi.
   2. Quả bóng nảy: mỗi lần chạm đất, một phần năng lượng chuyển thành nhiệt và âm thanh nên bóng nảy thấp dần (độ cao giảm 30% mỗi lần – giả định).
   3. Thiết bị điện: điện năng chuyển hóa thành năng lượng có ích và năng lượng hao phí (tỉ lệ minh họa).
   Biểu đồ cột hiển thị từng dạng năng lượng (J) theo thời gian; tổng luôn bằng năng lượng ban đầu (định luật bảo toàn năng lượng). */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const g0=9.8;
const DEV=[{k:"soi",t:"Bóng đèn sợi đốt",out:[["Năng lượng ánh sáng",5,"#FDE047"],["Nhiệt năng (hao phí)",95,"#F97316"]]},{k:"led",t:"Đèn LED",out:[["Năng lượng ánh sáng",30,"#FDE047"],["Nhiệt năng (hao phí)",70,"#F97316"]]},
  {k:"quat",t:"Quạt điện",out:[["Động năng cánh quạt",75,"#60A5FA"],["Nhiệt năng (hao phí)",20,"#F97316"],["Năng lượng âm (hao phí)",5,"#C084FC"]]},{k:"am",t:"Ấm đun nước",out:[["Nhiệt năng làm nóng nước",85,"#F87171"],["Nhiệt tỏa ra môi trường (hao phí)",15,"#F97316"]]}];
const SPEC={
  predict:[{id:"p1",q:"Con lắc dao động một lúc rồi dừng lại. Năng lượng của nó:",opts:[["ok","Chuyển dần thành nhiệt năng (do ma sát, lực cản), tổng năng lượng không mất đi"],["mat","Mất đi hoàn toàn"],["tang","Tăng lên"]],ans:"ok",res:"Kết quả: năng lượng không tự sinh ra hoặc tự mất đi, chỉ chuyển từ dạng này sang dạng khác."},
    {id:"p2",q:"Đèn LED tiết kiệm điện hơn đèn sợi đốt vì:",opts:[["ok","Phần điện năng chuyển thành nhiệt hao phí ít hơn"],["sang","Đèn LED không phát sáng"],["k","Đèn LED không dùng điện"]],ans:"ok",res:"Kết quả: với cùng độ sáng, đèn LED tiêu thụ ít điện năng hơn."}],
  taskLead:"Chọn phần ở khay. Quan sát cột năng lượng thay đổi theo thời gian và tổng năng lượng.",
  tasks:[{html:"<b>Con lắc:</b> quan sát khi có lực cản tới khi con lắc gần dừng.",done:()=>!!S.pd.rec},{html:"<b>Bóng nảy:</b> thả bóng và quan sát tới khi bóng dừng.",done:()=>!!S.b.rec},{html:"<b>Thiết bị điện:</b> xem ít nhất 3 thiết bị.",done:()=>Object.keys(S.dv.seen).length>=3}],
  obs:[{id:"a",q:"Ở vị trí thấp nhất, con lắc có:",opts:[["ok","Động năng lớn nhất, thế năng nhỏ nhất"],["tn","Thế năng lớn nhất"],["0","Động năng bằng 0"]],ans:"ok",why:"Thế năng chuyển hóa thành động năng khi con lắc đi xuống."},
    {id:"b",q:"Quả bóng nảy thấp dần vì:",opts:[["ok","Mỗi lần chạm đất một phần năng lượng chuyển thành nhiệt và âm thanh"],["mat","Năng lượng tự mất đi"],["nang","Bóng nặng dần"]],ans:"ok",why:"Tổng năng lượng vẫn bảo toàn."},
    {id:"c",q:"Năng lượng có ích của quạt điện là:",opts:[["ok","Động năng của cánh quạt"],["nhiet","Nhiệt năng làm nóng động cơ"],["am","Năng lượng âm thanh"]],ans:"ok",why:"Nhiệt năng, năng lượng âm là năng lượng hao phí."}],
  concl:{html:`<ul class="tlist"><li>Năng lượng có thể chuyển hóa từ dạng này sang dạng khác (thế năng ↔ động năng; điện năng → quang năng, nhiệt năng, cơ năng…).</li>
    <li><b>Định luật bảo toàn năng lượng</b>: năng lượng không tự sinh ra hoặc tự mất đi, nó chỉ chuyển từ dạng này sang dạng khác hoặc truyền từ vật này sang vật khác.</li>
    <li>Trong quá trình chuyển hóa luôn có năng lượng có ích và năng lượng hao phí; cần chọn thiết bị có ít hao phí để tiết kiệm năng lượng.</li></ul>`,
    quiz:[{id:"q1",q:"Khi một ô tô phanh gấp, động năng của xe chủ yếu chuyển thành:",opts:[["a","Nhiệt năng ở má phanh, lốp và mặt đường"],["b","Điện năng"],["c","Quang năng"]],ans:"a",why:{b:"Xe thông thường không thu hồi điện năng khi phanh.",c:"Quang năng không đáng kể."}},
      {id:"q2",q:"Một bóng đèn tiêu thụ 100 J điện năng, phát ra 5 J năng lượng ánh sáng. Năng lượng hao phí là:",opts:[["a","95 J"],["b","105 J"],["c","5 J"]],ans:"a",why:{b:"Hao phí không thể lớn hơn năng lượng tiêu thụ.",c:"5 J là phần có ích."}}],
    done:`<h2>Hoàn thành: chuyển hóa và bảo toàn năng lượng</h2><p class="muted">Năng lượng chỉ chuyển hóa, không tự sinh ra hay mất đi.</p>`},
  gv:["Cho học sinh chỉ ra năng lượng có ích, hao phí trong các thiết bị ở nhà.","Hỏi: nếu không có lực cản, con lắc dao động thế nào?","Lưu ý: tỉ lệ năng lượng ở thiết bị điện là số minh họa."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 41, 42)</p><ul class="tlist"><li>Nêu được sự truyền năng lượng trong một số trường hợp đơn giản; nêu được định luật bảo toàn năng lượng và lấy ví dụ minh họa; nêu được năng lượng hao phí luôn xuất hiện khi năng lượng chuyển từ dạng này sang dạng khác; đề xuất biện pháp tiết kiệm năng lượng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 41 – 42 (năng lượng, sự chuyển hóa và bảo toàn năng lượng, năng lượng hao phí).</li>
<li>Bảo toàn cơ năng và năng lượng: <a href="https://openstax.org/books/physics/pages/9-2-mechanical-energy-and-conservation-of-energy" target="_blank" rel="noopener">OpenStax Physics, mục 9.2</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Con lắc: vật 0,2 kg, dây 1 m, góc ban đầu 40°; lực cản tỉ lệ với vận tốc. Bóng 0,1 kg thả từ 1,5 m, mỗi lần nảy giữ lại 70% năng lượng. Tỉ lệ năng lượng của thiết bị điện (ví dụ đèn sợi đốt 5% ánh sáng, đèn LED 30%) là số minh họa xu hướng, không phải số đo.</li></ul>`;

let S;
LabKHTN.register("K6-L-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"ht",t:"Hiện tượng"},{k:"cd",t:"Chuyển hóa năng lượng"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng chuyển hóa và bảo toàn năng lượng",views:{cl:{label:"Con lắc",icon:IC.swap,frame:[30,40,940,560]},bn:{label:"Bóng nảy",icon:IC.drop,frame:[30,40,940,560]},dv:{label:"Thiết bị điện",icon:IC.bolt,frame:[30,40,940,560]}}});
    const M=.2,Lp=1;let TH0=40*Math.PI/180,E0=M*g0*Lp*(1-Math.cos(TH0));
    S={pd:{th:TH0,w:0,drag:true,run:false,q:0,t:0,rec:false},b:{h:1.5,v:0,q:0,run:false,n:0,rec:false},dv:{i:0,seen:{}},recs:0};
    const rec=(ht,cd,kq)=>{S.recs++;api.record({lan:String(S.recs),ht,cd,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    function bars(ctx,P,x,y,items,tot,title){const H=300,w=58;T(ctx,title,x+items.length*(w+20)/2,y-H-36,15,P.ink);
      items.forEach(([t,v,c],i)=>{const bx=x+i*(w+20);ctx.fillStyle="rgba(0,0,0,.18)";ctx.fillRect(bx,y-H,w,H);const h=H*C.clamp(v/tot,0,1);const g=ctx.createLinearGradient(0,y-h,0,y);g.addColorStop(0,C.mix(c,"#FFFFFF",.3));g.addColorStop(1,c);ctx.fillStyle=g;ctx.fillRect(bx,y-h,w,h);
        T(ctx,`${fmt(v,2)} J`,bx+w/2,y-h-8,12.5,P.ink);t.split("\n").forEach((l,j)=>T(ctx,l,bx+w/2,y+18+j*15,12,P.mut,"center",700))});
      const bx=x+items.length*(w+20)+10;const sum=items.reduce((a,b)=>a+b[1],0);ctx.fillStyle="rgba(0,0,0,.18)";ctx.fillRect(bx,y-H,w,H);let yy=y;for(const [,v,c] of items){const h=H*v/tot;ctx.fillStyle=c;ctx.fillRect(bx,yy-h,w,h);yy-=h}
      T(ctx,`${fmt(sum,2)} J`,bx+w/2,y-H-8,12.5,K.day?"#047857":"#6EE7B7");T(ctx,"Tổng",bx+w/2,y+18,12,P.mut,"center",700)}
    /* ---------- con lắc ---------- */
    function drawCL(ctx,P){const p=S.pd;const px=260,py=110,Lpx=330;ctx.fillStyle="#475569";ctx.fillRect(px-90,py-12,180,12);
      const bx=px+Math.sin(p.th)*Lpx,by=py+Math.cos(p.th)*Lpx;ctx.strokeStyle="#CBD5E1";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(bx,by);ctx.stroke();
      ctx.save();ctx.setLineDash([4,6]);ctx.strokeStyle="rgba(148,163,184,.4)";ctx.beginPath();ctx.arc(px,py,Lpx,Math.PI/2-Math.abs(TH0),Math.PI/2+Math.abs(TH0));ctx.stroke();ctx.restore();
      const g=ctx.createRadialGradient(bx-8,by-8,3,bx,by,24);g.addColorStop(0,"#FFFFFF");g.addColorStop(.3,"#F59E0B");g.addColorStop(1,"#92400E");ctx.fillStyle=g;ctx.beginPath();ctx.arc(bx,by,22,0,6.283);ctx.fill();
      ctx.strokeStyle="rgba(148,163,184,.5)";ctx.beginPath();ctx.moveTo(px-200,py+Lpx+22);ctx.lineTo(px+200,py+Lpx+22);ctx.stroke();
      const Wt=M*g0*Lp*(1-Math.cos(p.th)),Wd=.5*M*(p.w*Lp)**2;bars(ctx,P,560,470,[["Thế năng",Wt,"#60A5FA"],["Động năng",Wd,"#34D399"],["Nhiệt năng",p.q,"#F97316"]],E0*1.05,"Năng lượng của con lắc")}
    /* ---------- bóng nảy ---------- */
    let B0=1.5;const MB=.1;
    function drawBN(ctx,P){const b=S.b;const gx=140,gy=520,sc=260;ctx.fillStyle="#334155";ctx.fillRect(gx-40,gy,320,16);for(let i=0;i<=15;i++){ctx.fillStyle=P.mut;ctx.fillRect(gx-60,gy-i/10*sc,i%5?6:12,2);if(i%5===0)T(ctx,fmt(i/10,1)+" m",gx-66,gy-i/10*sc+4,11,P.mut,"right",700)}
      const y=gy-b.h*sc-18;const g=ctx.createRadialGradient(gx+120-6,y-6,3,gx+120,y,18);g.addColorStop(0,"#FFFFFF");g.addColorStop(.3,"#EF4444");g.addColorStop(1,"#7F1D1D");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(gx+120,y,18,b.squash?14:18,0,0,6.283);ctx.fill();
      const Wt=MB*g0*b.h,Wd=.5*MB*b.v*b.v;bars(ctx,P,560,470,[["Thế năng",Wt,"#60A5FA"],["Động năng",Wd,"#34D399"],["Nhiệt năng\nvà âm",b.q,"#F97316"]],MB*g0*B0*1.05,"Năng lượng của quả bóng");
      T(ctx,`Số lần nảy: ${b.n}`,gx+120,90,15,P.ink)}
    /* ---------- thiết bị điện ---------- */
    function drawDV(ctx,P){const d=DEV[S.dv.i];const x0=180,y0=320;
      /* biểu tượng thiết bị */
      ctx.save();ctx.translate(x0,y0);if(d.k==="soi"||d.k==="led"){ctx.fillStyle=d.k==="soi"?"rgba(253,224,71,.9)":"rgba(219,234,254,.95)";ctx.beginPath();ctx.arc(0,-30,52,0,6.283);ctx.fill();ctx.fillStyle="#9CA3AF";ctx.fillRect(-22,18,44,40);if(d.k==="soi"){ctx.strokeStyle="#B45309";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-14,10);for(let i=0;i<8;i++)ctx.lineTo(-14+i*4,-40+(i%2)*10);ctx.lineTo(14,10);ctx.stroke()}else{ctx.fillStyle="#FDE047";ctx.fillRect(-16,-38,32,14)}
        const glow=ctx.createRadialGradient(0,-30,20,0,-30,120);glow.addColorStop(0,"rgba(253,224,71,.35)");glow.addColorStop(1,"rgba(253,224,71,0)");ctx.fillStyle=glow;ctx.beginPath();ctx.arc(0,-30,120,0,6.283);ctx.fill()}
      else if(d.k==="quat"){ctx.fillStyle="#475569";ctx.fillRect(-8,10,16,90);ctx.fillRect(-50,100,100,12);for(let i=0;i<3;i++){const a=K.simT*12+i*2.094;ctx.save();ctx.rotate(a);ctx.fillStyle="rgba(147,197,253,.85)";ctx.beginPath();ctx.ellipse(0,-36,18,38,0,0,6.283);ctx.fill();ctx.restore()}ctx.fillStyle="#1F2937";ctx.beginPath();ctx.arc(0,0,12,0,6.283);ctx.fill();ctx.strokeStyle="rgba(148,163,184,.6)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,82,0,6.283);ctx.stroke()}
      else{ctx.fillStyle="#CBD5E1";ctx.beginPath();ctx.moveTo(-60,60);ctx.lineTo(-50,-40);ctx.lineTo(50,-40);ctx.lineTo(60,60);ctx.closePath();ctx.fill();ctx.fillStyle="#1F2937";ctx.fillRect(-70,60,140,16);ctx.strokeStyle="#64748B";ctx.lineWidth=8;ctx.beginPath();ctx.arc(64,10,30,-1.2,1.2);ctx.stroke();for(let i=0;i<3;i++){ctx.strokeStyle="rgba(226,232,240,.5)";ctx.lineWidth=3;ctx.beginPath();const sx=-20+i*20,o=Math.sin(K.simT*3+i)*6;ctx.moveTo(sx,-50);ctx.bezierCurveTo(sx+10+o,-70,sx-10-o,-90,sx,-110);ctx.stroke()}}
      ctx.restore();T(ctx,d.t,x0,y0+140,17,P.ink);
      /* sơ đồ dòng năng lượng (độ rộng tỉ lệ phần trăm) */
      const sx=330,W=200;let yy=200;ctx.fillStyle="#38BDF8";C.rr(ctx,sx,yy,100,W,8);ctx.fill();T(ctx,"Điện năng",sx+50,yy+W/2-4,15,"#0B1330");T(ctx,"100%",sx+50,yy+W/2+16,13,"#0B1330");
      let off=0;d.out.forEach(([t,p,c],i)=>{const h=W*p/100;const ty=150+i*130;ctx.fillStyle=C.rgba(c,.75);ctx.beginPath();ctx.moveTo(sx+100,yy+off);ctx.bezierCurveTo(sx+260,yy+off,sx+260,ty,sx+380,ty);ctx.lineTo(sx+380,ty+Math.max(4,h));ctx.bezierCurveTo(sx+260,ty+Math.max(4,h),sx+260,yy+off+h,sx+100,yy+off+h);ctx.closePath();ctx.fill();
        T(ctx,`${t}`,sx+392,ty+Math.max(4,h)/2-2,14,P.ink,"left");T(ctx,`${p}%${i===0?" (có ích)":""}`,sx+392,ty+Math.max(4,h)/2+16,13,i===0?(K.day?"#047857":"#6EE7B7"):"#FDBA74","left",700);off+=h});
      T(ctx,"Tổng năng lượng ra = điện năng tiêu thụ (100%)",650,560,13.5,P.mut,"center",700)}
    /* thao tác tay: kéo quả nặng con lắc lệch một góc rồi thả; kéo quả bóng lên độ cao muốn thả */
    K.pickFn(q=>{const v=K.view;if(v==="cl"){const p=S.pd,bx=260+Math.sin(p.th)*330,by=110+Math.cos(p.th)*330;return Math.hypot(q[0]-bx,q[1]-by)<44?{drag:true,k:"bob"}:null}
      if(v==="bn"){const b=S.b,y=520-b.h*260-18;return Math.hypot(q[0]-260,q[1]-y)<40?{drag:true,k:"ball"}:null}return null});
    K.dragFn((ph,o,q)=>{const k=o.k;if(k==="bob"){const p=S.pd;if(ph==="start"){p.run=false;p.w=0;p.q=0;return}
        if(ph==="move"){p.th=C.clamp(Math.atan2(q[0]-260,q[1]-110),-1.2,1.2);return}
        if(Math.abs(p.th)<.06){p.th=TH0;return}TH0=p.th;E0=M*g0*Lp*(1-Math.cos(TH0));Object.assign(p,{w:0,q:0,t:0,run:true,rec:false});refresh();return}
      if(k==="ball"){const b=S.b;if(ph==="start"){b.run=false;b.v=0;b.q=0;b.n=0;return}
        if(ph==="move"){b.h=C.clamp((520-18-q[1])/260,.2,1.5);return}
        B0=b.h;Object.assign(b,{v:0,q:0,n:0,run:true,rec:false});refresh()}});
    K.drawFn((ctx,P)=>{const v=K.view;if(v==="cl")drawCL(ctx,P);else if(v==="bn")drawBN(ctx,P);else drawDV(ctx,P)});
    K.onFrame(dt=>{const p=S.pd;if(p.run){const sub=10;for(let i=0;i<sub;i++){const h=dt/sub;const c=p.drag?.25:0;const a=-(g0/Lp)*Math.sin(p.th)-c*p.w;const wN=p.w+a*h;const loss=c*p.w*p.w*M*Lp*Lp*h;p.q+=loss;p.w=wN;p.th+=p.w*h}p.t+=dt;
        const Etot=M*g0*Lp*(1-Math.cos(p.th))+.5*M*(p.w*Lp)**2;if(p.drag){p.q=Math.max(0,E0-Etot)}
        if(p.drag&&Etot<E0*.05&&!p.rec){p.rec=true;rec("Con lắc có lực cản",`thế năng ↔ động năng; một phần chuyển thành nhiệt năng`,`sau ${fmt(p.t,0)} s còn ${fmt(Etot/E0*100,0)}% cơ năng; tổng năng lượng vẫn ${fmt(E0,2)} J`);refresh()}}
      const b=S.b;if(b.run){const sub=10;for(let i=0;i<sub;i++){const h=dt/sub;b.v-=g0*h;b.h+=b.v*h;b.squash=false;if(b.h<=0){b.h=0;const E=.5*MB*b.v*b.v;const kept=E*.7;b.q+=E-kept;b.v=Math.sqrt(2*kept/MB);b.n++;b.squash=true;if(kept<MB*g0*.005){b.v=0;b.run=false;b.q=MB*g0*B0;if(!b.rec){b.rec=true;rec("Bóng nảy",`thế năng ↔ động năng; mỗi lần chạm đất một phần thành nhiệt, âm`,`bóng dừng sau ${b.n} lần nảy; toàn bộ ${fmt(MB*g0*B0,2)} J đã thành nhiệt năng và năng lượng âm`);refresh()}break}}}}});
    K.dockFn(()=>{const v=K.view;if(v==="cl"){const p=S.pd;return[{seg:[{k:"drag",v:"1",label:"Có lực cản",icon:"",on:p.drag},{k:"drag",v:"0",label:"Lí tưởng",icon:"",on:!p.drag}],label:"Điều kiện"},{k:"pgo",label:p.run?"Dừng":"Thả con lắc",icon:IC.play,on:p.run},{k:"prs",label:"Làm lại",icon:IC.reset}]}
      if(v==="bn")return[{k:"bgo",label:"Thả quả bóng",icon:IC.play,dis:S.b.run},{k:"brs",label:"Làm lại",icon:IC.reset}];
      return[{grid:DEV.map((d,i)=>({k:"dev",v:String(i),label:d.t,icon:"",on:S.dv.i===i}))}]});
    K.onDock((k,v)=>{const p=S.pd,b=S.b;if(k==="drag"){p.drag=v==="1";Object.assign(p,{th:TH0,w:0,q:0,t:0})}else if(k==="pgo")p.run=!p.run;else if(k==="prs"){TH0=40*Math.PI/180;E0=M*g0*Lp*(1-Math.cos(TH0))}if(k==="prs")Object.assign(p,{th:TH0,w:0,q:0,t:0,run:false});
      else if(k==="bgo"){Object.assign(b,{h:B0,v:0,q:0,n:0,run:true})}else if(k==="brs"){B0=1.5;Object.assign(b,{h:B0,v:0,q:0,n:0,run:false})}
      else if(k==="dev"){S.dv.i=+v;const d=DEV[+v];if(!S.dv.seen[d.k]){S.dv.seen[d.k]=1;rec(d.t,`điện năng → ${d.out.map(o=>o[0].toLowerCase()).join(", ")}`,d.out.map(o=>`${o[0]}: ${o[1]}%`).join("; "))}}refresh()});
    K.dockFn&&0;
    let tk=0;K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}});
    K.infoFn(()=>{const v=K.view;if(v==="cl"){const p=S.pd;return `<div><b>Con lắc</b> · ${p.drag?"có lực cản":"lí tưởng (không lực cản)"}</div><div>Năng lượng ban đầu: ${fmt(E0,2)} J</div><small>Kéo quả nặng lệch sang một bên rồi thả tay (hoặc bấm “Thả con lắc”). Vị trí cao nhất: thế năng lớn nhất; vị trí thấp nhất: động năng lớn nhất.</small>`}
      if(v==="bn")return `<div><b>Quả bóng</b> 0,1 kg thả từ ${fmt(B0,1)} m</div><div>Năng lượng ban đầu: ${fmt(MB*g0*B0,2)} J</div><small>Kéo quả bóng lên độ cao muốn thả rồi buông tay. Mỗi lần chạm đất, bóng giữ lại 70% năng lượng (giả định).</small>`;
      return `<div><b>${DEV[S.dv.i].t}</b></div><small>Tỉ lệ phần trăm là số minh họa. Đã xem ${Object.keys(S.dv.seen).length} thiết bị.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.pd.rec=true;rec("Con lắc có lực cản","thế năng ↔ động năng → nhiệt","tổng không đổi");S.b.rec=true;rec("Bóng nảy","→ nhiệt, âm","bóng dừng");K.goView("dv");for(let i=0;i<3;i++)K._dockH("dev",String(i))}};
    return K.mount(st)}
});
})();
