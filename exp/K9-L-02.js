/* K9-L-02 · Công và công suất (SGK KHTN 9 – Kết nối tri thức, Bài 4) · 2D
   Trạm 1 – Công cơ học: kéo thùng hàng trên sàn bằng lực F theo phương chuyển động, hoặc theo phương vuông góc với chuyển động;
           nâng vật lên cao: A = F·s; lực vuông góc với phương chuyển động không thực hiện công.
   Trạm 2 – Công suất: hai người kéo gạch lên cao 4 m bằng ròng rọc cố định; so sánh công và thời gian: P = A/t. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const FS=[50,100,200],SS=[2,4,6],BR=16,HH=4;   /* lực kéo (N); quãng đường (m); mỗi viên gạch 16 N; độ cao 4 m */

const SPEC={
  predict:[{id:"p1",q:"Người phục vụ bưng khay đồ ăn đi trên sàn nằm ngang. Lực nâng khay của tay có thực hiện công cơ học không?",opts:[["khong","Không, vì lực vuông góc với phương chuyển động"],["co","Có, vì khay có di chuyển"]],ans:"khong",res:"Kết quả: lực nâng khay thẳng đứng, khay chuyển động nằm ngang nên lực này không sinh công."},
    {id:"p2",q:"An kéo 10 viên gạch lên cao 4 m mất 50 s; Bình kéo 15 viên lên cao 4 m mất 60 s. Ai làm việc khỏe hơn?",opts:[["binh","Bình"],["an","An"],["nhu","Như nhau"]],ans:"binh",res:"Kết quả: An 640 J trong 50 s (12,8 W); Bình 960 J trong 60 s (16 W): Bình có công suất lớn hơn."}],
  taskLead:"Chọn trạm ở khay. Mỗi lần kéo xong, công và công suất tự ghi vào bảng.",
  tasks:[{html:"<b>Công:</b> kéo thùng với ít nhất 2 cặp giá trị lực, quãng đường khác nhau.",done:()=>S.a.log.filter(l=>l.dir==="ngang").length>=2},
    {html:"<b>Công:</b> thử lực vuông góc với phương chuyển động.",done:()=>S.a.log.some(l=>l.dir==="vuong")},
    {html:"<b>Công suất:</b> cho An và Bình cùng kéo gạch, so sánh công suất.",done:()=>S.p.rec}],
  obs:[{id:"a",q:"Lực 100 N kéo thùng đi 4 m theo phương của lực. Công của lực là:",opts:[["400","400 J"],["25","25 J"],["104","104 J"]],ans:"400",why:"A = F·s = 100 N × 4 m = 400 J."},
    {id:"b",q:"Công suất cho biết:",opts:[["nhanh","Công thực hiện được trong một đơn vị thời gian (làm việc nhanh hay chậm)"],["nhieu","Tổng công thực hiện được"],["luc","Độ lớn của lực"]],ans:"nhanh",why:"P = A/t; đơn vị W (1 W = 1 J/s)."}],
  concl:{html:`<div class="eq">A = F·s &nbsp;&nbsp;&nbsp; P = A/t</div><ul class="tlist">
    <li>Có công cơ học khi có lực tác dụng vào vật và vật dịch chuyển theo phương không vuông góc với phương của lực. Khi lực cùng phương chuyển động: A = F·s; đơn vị J (1 J = 1 N·m).</li>
    <li>Công suất là công thực hiện được trong một đơn vị thời gian: P = A/t; đơn vị W (1 W = 1 J/s; 1 kW = 1000 W).</li></ul>`,
    quiz:[{id:"q1",q:"Một máy bơm thực hiện công 36 000 J trong 1 phút. Công suất máy bơm là:",opts:[["a","600 W"],["b","36 000 W"],["c","6 W"]],ans:"a",why:{b:"Phải chia cho thời gian 60 s.",c:"P = 36 000 : 60 = 600 W."}},
      {id:"q2",q:"Trường hợp nào trọng lực thực hiện công?",opts:[["a","Quả táo rơi từ cành cây xuống"],["b","Xe chạy trên đường nằm ngang"],["c","Quyển sách nằm yên trên bàn"]],ans:"a",why:{b:"Xe chuyển động nằm ngang, vuông góc với trọng lực.",c:"Sách không dịch chuyển."}}],
    done:`<h2>Hoàn thành: Công và công suất</h2><p class="muted">A = F·s; P = A/t.</p>`},
  gv:["Ở trạm 1, cho học sinh dự đoán công trước khi bấm kéo.","Hỏi: muốn An có công suất bằng Bình thì An phải kéo 10 viên gạch trong bao lâu?","Liên hệ: công suất ghi trên quạt điện, máy bơm, động cơ xe máy."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 4)</p><ul class="tlist"><li>Liệt kê được một số đơn vị thường dùng đo công; tính được công và công suất trong một số trường hợp đơn giản.</li><li>Nêu được công suất là tốc độ thực hiện công.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 4 Công và công suất.</li><li>Định nghĩa công, công suất: <a href="https://openstax.org/books/college-physics-2e/pages/7-1-work-the-scientific-definition" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 7.1</a> và <a href="https://openstax.org/books/college-physics-2e/pages/7-7-power" target="_blank" rel="noopener">mục 7.7</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thùng chuyển động đều; bỏ qua khối lượng dây, ròng rọc và ma sát ở ròng rọc. Mỗi viên gạch nặng 16 N; số liệu An, Bình theo bài tập quen thuộc trong sách giáo khoa.</li></ul>`;

let S;
LabKHTN.register("K9-L-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"so",t:"Số liệu"},{k:"kq",t:"Công, công suất"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:620,aria:"Mô phỏng công và công suất",views:{cong:{label:"Công cơ học",icon:IC.hand,frame:[40,140,930,420]},congsuat:{label:"Công suất",icon:IC.bolt,frame:[60,30,880,580]}}});
    S={a:{F:1,s:1,dir:"ngang",x:0,go:false,log:[]},p:{run:false,t:0,ppl:[{ten:"An",n:10,T:50,y:0,done:false},{ten:"Bình",n:15,T:60,y:0,done:false}],rec:false},recs:0};
    const rec=(tn,so,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,so,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const PX=90;   /* 90 px ứng với 1 m ở trạm 1 */
    function person(ctx,x,y,s,pose,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col||"#334155";ctx.fillStyle=col||"#334155";ctx.lineWidth=7;ctx.lineCap="round";ctx.lineJoin="round";
      const lean=pose.lean||0;ctx.beginPath();ctx.arc(lean*30,-118,13,0,6.283);ctx.fill();
      ctx.beginPath();ctx.moveTo(lean*26,-102);ctx.lineTo(lean*12,-52);ctx.stroke();
      ctx.beginPath();ctx.moveTo(lean*12,-52);ctx.lineTo(-14+(pose.step||0),0);ctx.moveTo(lean*12,-52);ctx.lineTo(14-(pose.step||0),0);ctx.stroke();
      ctx.beginPath();ctx.moveTo(lean*24,-92);ctx.lineTo(pose.hx,pose.hy);ctx.moveTo(lean*24,-92);ctx.lineTo(pose.hx2==null?pose.hx:pose.hx2,pose.hy2==null?pose.hy:pose.hy2);ctx.stroke();ctx.restore()}
    function crate(ctx,x,y,w,h){D2.block(ctx,x,y-h,w,h,6,"#C08A4A","#8A5A2B",{stroke:"rgba(0,0,0,.35)"});ctx.strokeStyle="rgba(60,30,10,.45)";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(x+6,y-h+6);ctx.lineTo(x+w-6,y-6);ctx.moveTo(x+w-6,y-h+6);ctx.lineTo(x+6,y-6);ctx.stroke();ctx.strokeRect(x+4,y-h+4,w-8,h-8)}
    /* ================= trạm 1 ================= */
    function stepA(dt){const A=S.a;if(!A.go||dt<=0)return;const L=SS[A.s];A.x=Math.min(L,A.x+dt*1.2);
      if(A.x>=L){A.go=false;const F=FS[A.F];const W=A.dir==="ngang"?F*L:0;A.log.push({dir:A.dir,F,s:L,W});
        rec(A.dir==="ngang"?"Kéo thùng theo phương chuyển động":"Bưng thùng đi ngang (lực nâng thẳng đứng)",`F = ${F} N; s = ${L} m`,A.dir==="ngang"?`A = F·s = ${F} × ${L} = ${fmt(W,0)} J`:`lực vuông góc với phương chuyển động: A = 0 J`);refresh()}}
    function drawA(ctx,P){const A=S.a;const y0=470,x0=120;
      ctx.fillStyle=K.day?"#CBD5E1":"#334155";ctx.fillRect(60,y0,900,14);ctx.strokeStyle=P.line;for(let i=0;i<45;i++){ctx.beginPath();ctx.moveTo(60+i*20,y0+14);ctx.lineTo(50+i*20,y0+26);ctx.stroke()}
      /* thước đo quãng đường */
      for(let m=0;m<=8;m++){const x=x0+60+m*PX;ctx.strokeStyle=P.mut;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y0+30);ctx.lineTo(x,y0+44);ctx.stroke();D2.text(ctx,`${m} m`,x,y0+64,{s:15,w:700,c:P.mut,a:"center"})}
      const L=SS[A.s];ctx.fillStyle=C.rgba("#FDE047",.25);ctx.fillRect(x0+60,y0+30,L*PX,8);
      const cx=x0+A.x*PX;
      if(A.dir==="ngang"){crate(ctx,cx,y0,120,90);const hx=cx+120+60;person(ctx,hx+40,y0,1.15,{lean:.35,step:Math.sin(A.x*6)*8,hx:-40,hy:-60},K.day?"#1E293B":"#CBD5E1");
        ctx.strokeStyle="#A16207";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(cx+120,y0-45);ctx.lineTo(hx,y0-68);ctx.stroke();
        D2.arrow(ctx,cx+60,y0-45,cx+60+40+FS[A.F]*.6,y0-45,"#F97316",6,18);D2.text(ctx,`F = ${FS[A.F]} N`,cx+60,y0-108,{s:20,w:800,c:"#F97316",a:"left"})}
      else{person(ctx,cx+60,y0,1.15,{lean:0,step:Math.sin(A.x*6)*8,hx:-30,hy:-128,hx2:30,hy2:-128},K.day?"#1E293B":"#CBD5E1");crate(ctx,cx+12,y0-140,96,56);
        D2.arrow(ctx,cx+60,y0-198,cx+60,y0-238-FS[A.F]*.25,"#F97316",6,18);D2.text(ctx,`F = ${FS[A.F]} N`,cx+76,y0-225,{s:20,w:800,c:"#F97316"})}
      /* mũi tên phương chuyển động */
      D2.arrow(ctx,x0+60,y0-290,x0+60+L*PX,y0-290,K.day?"#2563EB":"#93C5FD",3,12);D2.text(ctx,`s = ${L} m (phương chuyển động)`,x0+60,y0-302,{s:17,w:700,c:K.day?"#1D4ED8":"#BFDBFE"})}
    /* ================= trạm 2 ================= */
    const LX=[300,700],GY=560,TOPY=110,PXM=(GY-TOPY-50)/HH;
    function stepP(dt){const Pp=S.p;if(!Pp.run||dt<=0)return;const spd=4;Pp.t+=dt*spd;let all=true;
      for(const p of Pp.ppl){if(p.done)continue;p.y=Math.min(HH,HH*Pp.t/p.T);if(p.y>=HH){p.done=true}else all=false}
      if(all){Pp.run=false;if(!Pp.rec){Pp.rec=true}Pp.ppl.forEach(p=>{const A=p.n*BR*HH;rec(`${p.ten} kéo ${p.n} viên gạch lên cao ${HH} m`,`${p.n} × ${BR} N = ${p.n*BR} N; t = ${p.T} s`,`A = ${fmt(A,0)} J; P = A/t = ${fmt(A/p.T,1)} W`)});refresh()}}
    function drawP(ctx,P){const Pp=S.p;
      ctx.fillStyle=K.day?"#CBD5E1":"#334155";ctx.fillRect(60,GY,880,14);
      LX.forEach((x,i)=>{const p=Pp.ppl[i];
        /* giàn giáo */
        ctx.strokeStyle=K.day?"#64748B":"#94A3B8";ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(x+90,GY);ctx.lineTo(x+90,TOPY);ctx.lineTo(x-10,TOPY);ctx.stroke();ctx.lineWidth=3;
        for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(x+90,GY-k*PXM);ctx.lineTo(x+150,GY-k*PXM-PXM);ctx.stroke()}
        D2.block(ctx,x+90,TOPY+50-14,120,14,3,"#A16207","#713F12",{shadow:false});
        /* ròng rọc */
        ctx.fillStyle="#9CA3AF";ctx.beginPath();ctx.arc(x,TOPY+16,16,0,6.283);ctx.fill();ctx.fillStyle="#374151";ctx.beginPath();ctx.arc(x,TOPY+16,4,0,6.283);ctx.fill();
        const by=GY-p.y*PXM;/* thùng gạch */
        ctx.strokeStyle="#D6D3D1";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+16,TOPY+16);ctx.lineTo(x+16,by-44);ctx.moveTo(x-16,TOPY+16);ctx.lineTo(x-16,GY-120+p.y*PXM*.0);ctx.stroke();
        D2.block(ctx,x-4,by-44,40,44,4,"#57534E","#292524",{shadow:false});const rows=Math.ceil(p.n/5);for(let r=0;r<Math.min(rows,4);r++)for(let c=0;c<Math.min(5,p.n-r*5);c++){ctx.fillStyle="#B45309";ctx.fillRect(x-1+c*7,by-40+r*9,6,7)}
        person(ctx,x-40,GY,1.05,{lean:-.25,step:Pp.run&&!p.done?Math.sin(Pp.t*2)*6:0,hx:24,hy:-110-(Pp.run&&!p.done?Math.sin(Pp.t*3)*10:0)},K.day?"#1E293B":"#CBD5E1");
        D2.text(ctx,p.ten,x-40,GY+40,{s:20,w:800,c:P.ink,a:"center"});
        D2.text(ctx,`${p.n} viên · ${p.T} s`,x+40,GY+40,{s:16,w:700,c:P.mut,a:"left"});
        if(p.done){const A=p.n*BR*HH;D2.block(ctx,x+100,TOPY+70,170,58,10,P.card,P.card,{stroke:P.line,shadow:false});D2.text(ctx,`A = ${fmt(A,0)} J`,x+112,TOPY+94,{s:17,w:800,c:P.ink});D2.text(ctx,`P = ${fmt(A/p.T,1)} W`,x+112,TOPY+117,{s:17,w:800,c:K.day?"#B45309":"#FCD34D"})}});
      /* thước độ cao */
      for(let m=0;m<=HH;m++){const y=GY-m*PXM;ctx.strokeStyle=P.mut;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(120,y);ctx.lineTo(136,y);ctx.stroke();D2.text(ctx,`${m} m`,114,y+5,{s:15,w:700,c:P.mut,a:"right"})}
      D2.text(ctx,`t = ${fmt(Math.min(S.p.t,60),0)} s`,500,60,{s:22,w:800,c:P.ink,a:"center"})}
    K.onFrame(dt=>{stepA(dt);stepP(dt)});
    K.drawFn((ctx,P)=>{K.view==="cong"?drawA(ctx,P):drawP(ctx,P)});
    K.label("Thùng hàng",()=>[120+S.a.x*PX+(S.a.dir==="ngang"?20:12),S.a.dir==="ngang"?420:300],{view:"cong",dir:"w",len:50});
    K.label("Ròng rọc cố định",[LX[0],TOPY+16],{view:"congsuat",dir:"w",len:50});K.label("Thùng gạch",()=>[LX[1]+16,GY-S.p.ppl[1].y*PXM-44],{view:"congsuat",dir:"e",len:60});
    K.dockFn(()=>{const v=K.view,A=S.a;
      if(v==="cong")return[{seg:FS.map((f,i)=>({k:"F",v:String(i),label:`F = ${f} N`,icon:"",on:A.F===i})),label:"Lực"},{seg:SS.map((s,i)=>({k:"s",v:String(i),label:`s = ${s} m`,icon:"",on:A.s===i})),label:"Quãng đường"},
        {seg:[{k:"dir",v:"ngang",label:"Kéo theo phương chuyển động",icon:"",on:A.dir==="ngang"},{k:"dir",v:"vuong",label:"Lực vuông góc (bưng thùng)",icon:"",on:A.dir==="vuong"}],label:"Hướng lực"},"hr",
        {k:"go",label:"Kéo thùng",icon:IC.play,dis:A.go},{k:"ra",label:"Đặt lại",icon:IC.reset,dis:A.go}];
      const Pp=S.p;return[{k:"pgo",label:"Bắt đầu kéo gạch",icon:IC.play,dis:Pp.run},{k:"pr",label:"Làm lại",icon:IC.reset,dis:Pp.run},"hr",
        {grid:[{k:"an",v:"-",label:"An bớt 1 viên",icon:IC.minus,dis:Pp.run},{k:"an",v:"+",label:"An thêm 1 viên",icon:IC.plus,dis:Pp.run},{k:"bi",v:"-",label:"Bình bớt 1 viên",icon:IC.minus,dis:Pp.run},{k:"bi",v:"+",label:"Bình thêm 1 viên",icon:IC.plus,dis:Pp.run}]}]});
    K.onDock((k,v)=>{const A=S.a,Pp=S.p;
      if(k==="F")A.F=+v;else if(k==="s")A.s=+v;else if(k==="dir")A.dir=v;else if(k==="go"){A.x=0;A.go=true;if(!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}else if(k==="ra"){A.x=0}
      else if(k==="pgo"){Pp.t=0;Pp.ppl.forEach(p=>{p.y=0;p.done=false});Pp.run=true}else if(k==="pr"){Pp.t=0;Pp.run=false;Pp.ppl.forEach(p=>{p.y=0;p.done=false})}
      else if(k==="an"||k==="bi"){const p=Pp.ppl[k==="an"?0:1];p.n=C.clamp(p.n+(v==="+"?1:-1),1,20);p.T=Math.round(p.n*BR*HH/(k==="an"?12.8:16));p.y=0;p.done=false}
      refresh()});
    K.infoFn(()=>{if(K.view==="cong"){const A=S.a,F=FS[A.F],L=SS[A.s];return `<div><b>Công cơ học</b></div><div>F = ${F} N · s = ${L} m</div><div>${A.dir==="ngang"?`A = F·s = ${fmt(F*L,0)} J`:"Lực vuông góc với phương chuyển động: A = 0"}</div><small>1 J = 1 N·m.</small>`}
      const Pp=S.p;return `<div><b>Công suất</b> · gạch 16 N/viên, cao 4 m</div>${Pp.ppl.map(p=>`<div>${p.ten}: ${p.n} viên, ${p.T} s → P = ${fmt(p.n*BR*HH/p.T,1)} W</div>`).join("")}<small>Đổi số viên gạch: thời gian tính theo công suất riêng của mỗi người (An 12,8 W, Bình 16 W).</small>`});
    K.timeLabel(()=>K.view==="cong"?`Quãng đường đã đi ${fmt(S.a.x,1)} m`:`t = ${fmt(Math.min(S.p.t,Math.max(...S.p.ppl.map(p=>p.T))),0)} s (tua nhanh ×4)`);
    K.onReset(()=>{});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"go",p:()=>[120+S.a.x*PX+60,425],tip:"Chạm vào thùng để kéo",view:"cong"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const A=S.a;A.F=1;A.s=1;A.dir="ngang";A.x=0;A.go=true;setTimeout(()=>{A.F=2;A.s=0;A.x=0;A.go=true},5000);setTimeout(()=>{A.dir="vuong";A.x=0;A.go=true},10000);S.p.run=true}};
    return K.mount(st)}
});
})();
