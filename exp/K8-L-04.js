/* K8-L-04 · Tác dụng làm quay của lực, moment lực; đòn bẩy (SGK KHTN 8 – Kết nối tri thức, Bài 18–19) · 2D
   Ba trạm:
   1. Moment lực: đẩy cánh cửa (nhìn từ trên xuống) với lực F đặt ở các khoảng cách khác nhau tới bản lề, theo ba hướng.
      M = F·d, d là khoảng cách từ trục quay tới giá của lực. Cửa có tay co thủy lực tạo moment cản (giả định 2 N·m).
   2. Điều kiện cân bằng của đòn bẩy: thước có lỗ cách đều 5 cm, điểm tựa ở giữa; treo quả nặng 50 g vào các lỗ, thả thước.
   3. Ba loại đòn bẩy: xà beng (loại 1), xe cút kít (loại 2), cần câu (loại 3); tính lực cần để nâng vật. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const G=9.8,MW=.05;                 /* quả nặng 50 g */
const DOOR={L:.8,m:20,Mc:2,push:.4,px:5};   /* cánh cửa 80 cm, 20 kg; moment cản của tay co 2 N·m (giả định); đẩy trong 0,4 s */
DOOR.I=DOOR.m*DOOR.L*DOOR.L/3;
const DS=[.1,.4,.75],FS=[5,10,20],DIRS=[["vg","Vuông góc",90],["xien","Xiên 30°",30],["doc","Dọc cánh cửa",0]];
const RUL={hole:.05,n:6,px:12,m:.1,len:.7};
const LEV={
  l1:{ten:"Xà beng bẩy hòn đá",loai:1,P:600,dP:.2,dF:1.0,vat:"hòn đá"},
  l2:{ten:"Xe cút kít chở đất",loai:2,P:600,dP:.4,dF:1.2,vat:"thùng đất"},
  l3:{ten:"Cần câu nhấc con cá",loai:3,P:10,dP:2.0,dF:.4,vat:"con cá"}};

const SPEC={
  predict:[
    {id:"p1",q:"Muốn mở cánh cửa nặng dễ nhất, nên đẩy ở chỗ nào?",opts:[["xa","Xa bản lề nhất (chỗ tay nắm)"],["gan","Sát bản lề"],["giua","Chỗ nào cũng như nhau"]],ans:"xa",res:"Kết quả: đẩy ở tay nắm, xa bản lề, cửa quay dễ nhất."},
    {id:"p2",q:"Bên trái điểm tựa treo 2 quả nặng ở lỗ thứ 3. Bên phải phải treo 3 quả ở lỗ thứ mấy để thước cân bằng?",opts:[["2","Lỗ thứ 2"],["3","Lỗ thứ 3"],["6","Lỗ thứ 6"]],ans:"2",res:"Kết quả: 2 × 3 = 3 × 2, thước cân bằng khi treo 3 quả ở lỗ thứ 2."}],
  taskLead:"Chọn trạm ở khay. Ở trạm đòn bẩy, chạm vào lỗ trên thước để treo thêm quả nặng, chạm vào chùm quả nặng để bớt một quả.",
  tasks:[
    {html:"<b>Moment lực:</b> đẩy cửa với cùng một lực ở ít nhất hai khoảng cách khác nhau tới bản lề.",done:()=>new Set(S.mo.log.filter(r=>r.dir==="vg").map(r=>r.d+"|"+r.F)).size>=2&&new Set(S.mo.log.filter(r=>r.dir==="vg").map(r=>r.d)).size>=2},
    {html:"<b>Moment lực:</b> đẩy cửa theo hướng dọc cánh cửa.",done:()=>S.mo.log.some(r=>r.dir==="doc")},
    {html:"<b>Đòn bẩy cân bằng:</b> làm thước cân bằng với số quả nặng hai bên khác nhau.",done:()=>S.cb.balUneq},
    {html:"<b>Ba loại đòn bẩy:</b> nâng vật bằng cả ba dụng cụ.",done:()=>["l1","l2","l3"].every(k=>S.lv.done[k])}],
  obs:[
    {id:"a",q:"Đẩy cửa bằng lực 10 N ở tay nắm (75 cm) và ở gần bản lề (10 cm). Moment lực khi đẩy ở tay nắm lớn gấp mấy lần?",opts:[["7","Khoảng 7,5 lần"],["1","Bằng nhau"],["10","10 lần"]],ans:"7",why:"M = F·d: 10 N × 0,75 m = 7,5 N·m so với 10 N × 0,1 m = 1 N·m."},
    {id:"b",q:"Đẩy theo hướng dọc cánh cửa (giá của lực đi qua bản lề), cửa:",opts:[["khong","Không quay, vì khoảng cách từ trục quay tới giá của lực bằng 0"],["quay","Quay chậm"],["nhanh","Quay nhanh nhất"]],ans:"khong",why:"Giá của lực đi qua trục quay nên d = 0 và M = 0."},
    {id:"c",q:"Khi thước cân bằng, giữa hai bên điểm tựa có quan hệ:",opts:[["mo","Trọng lượng × khoảng cách bên trái bằng trọng lượng × khoảng cách bên phải"],["so","Số quả nặng hai bên bằng nhau"],["kc","Khoảng cách hai bên bằng nhau"]],ans:"mo",why:"Hai moment lực làm thước quay theo hai chiều ngược nhau bằng nhau thì thước không quay."},
    {id:"d",q:"Đòn bẩy nào trong ba dụng cụ cần lực lớn hơn trọng lượng vật?",opts:[["l3","Cần câu (loại 3)"],["l1","Xà beng (loại 1)"],["l2","Xe cút kít (loại 2)"]],ans:"l3",why:"Ở cần câu, tay đặt lực gần điểm tựa hơn con cá nên phải dùng lực lớn hơn, bù lại đầu cần đi được quãng đường dài hơn."}],
  concl:{html:`<ul class="tlist"><li>Lực có thể làm vật quay quanh một trục khi giá của lực không song song và không đi qua trục quay.</li>
    <li><b>Moment lực</b> đặc trưng cho tác dụng làm quay của lực: <b>M = F·d</b>, trong đó d là khoảng cách từ trục quay tới giá của lực; đơn vị N·m. Lực càng lớn, d càng lớn thì tác dụng làm quay càng mạnh.</li>
    <li><b>Đòn bẩy</b> là thanh cứng quay quanh điểm tựa O. Đòn bẩy cân bằng khi moment của lực tác dụng bằng moment của trọng lượng vật theo chiều ngược lại.</li>
    <li>Khoảng cách từ O tới giá của lực tác dụng lớn hơn khoảng cách từ O tới giá của trọng lượng vật thì được lợi về lực (xà beng, xe cút kít); ngược lại thì thiệt về lực nhưng lợi về đường đi (cần câu, cái gắp).</li></ul>`,
    quiz:[
      {id:"q1",q:"Cái kéo cắt giấy là đòn bẩy loại mấy?",opts:[["1","Loại 1 (điểm tựa ở giữa)"],["2","Loại 2"],["3","Loại 3"]],ans:"1",why:{2:"Ở kéo, chốt (điểm tựa) nằm giữa tay cầm và giấy.",3:"Ở kéo, chốt (điểm tựa) nằm giữa tay cầm và giấy."}},
      {id:"q2",q:"Dùng cờ lê dài vặn đai ốc dễ hơn cờ lê ngắn vì:",opts:[["d","Khoảng cách từ trục quay tới giá của lực lớn hơn nên moment lực lớn hơn"],["nang","Cờ lê dài nặng hơn"],["chac","Cờ lê dài cứng hơn"]],ans:"d",why:{nang:"Với cùng lực tay, d lớn hơn cho moment lớn hơn.",chac:"Với cùng lực tay, d lớn hơn cho moment lớn hơn."}},
      {id:"q3",q:"Cái mở nắp chai (điểm tựa ở đầu, nắp chai ở giữa, tay ở đầu kia) là đòn bẩy:",opts:[["2","Loại 2, lợi về lực"],["3","Loại 3, thiệt về lực"],["1","Loại 1"]],ans:"2",why:{3:"Nắp chai (vật) nằm giữa điểm tựa và tay nên là loại 2.",1:"Điểm tựa ở đầu dụng cụ, không nằm giữa."}}],
    done:`<h2>Hoàn thành: Moment lực và đòn bẩy</h2><p class="muted">M = F·d; đòn bẩy cân bằng khi hai moment lực ngược chiều bằng nhau.</p>`},
  gv:["Trước khi đẩy cửa, cho học sinh đoán thứ tự dễ đến khó của ba vị trí đặt lực.","Ở trạm đòn bẩy, yêu cầu học sinh tìm ít nhất hai cách cân bằng khác nhau với 2 quả bên trái ở lỗ thứ 3.","Liên hệ: tay nắm cửa đặt xa bản lề; cán kéo cắt tôn dài; cái gắp đá là đòn bẩy loại 3."]
};

const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 18–19)</p><ul class="tlist"><li>Thực hiện thí nghiệm để mô tả được tác dụng làm quay của lực; nêu được tác dụng làm quay của lực lên một vật quanh một điểm hoặc một trục được đặc trưng bằng moment lực.</li><li>Mô tả được cấu tạo của đòn bẩy; thực hiện thí nghiệm để rút ra điều kiện để đòn bẩy cân bằng; lấy được ví dụ về đòn bẩy trong cơ thể người và trong đời sống.</li></ul>
<p style="margin-top:10px"><b>Lưu ý khi làm thật</b></p><ul class="tlist"><li>Treo quả nặng nhẹ tay, giữ thước trước khi thay đổi quả nặng; không để quả nặng rơi vào chân.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 18 Tác dụng làm quay của lực. Moment lực; Bài 19 Đòn bẩy và ứng dụng.</li>
<li>Moment lực và điều kiện cân bằng của vật rắn: <a href="https://openstax.org/books/college-physics-2e/pages/9-2-the-second-condition-for-equilibrium" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 9.2</a>; đòn bẩy: <a href="https://openstax.org/books/college-physics-2e/pages/9-5-simple-machines" target="_blank" rel="noopener">mục 9.5 Simple Machines</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Cánh cửa rộng 80 cm, khối lượng 20 kg; tay co thủy lực tạo moment cản 2 N·m; mỗi lần đẩy kéo dài 0,4 s; cửa mở tối đa 90°.</li>
<li>Thước dài 70 cm, có 6 lỗ mỗi bên cách nhau 5 cm, trọng tâm thước ở điểm tựa; quả nặng 50 g, g = 9,8 m/s².</li>
<li>Ba dụng cụ ở trạm 3 bỏ qua trọng lượng của chính đòn bẩy; kích thước và trọng lượng vật là số minh họa.</li></ul>`;

let S;
LabKHTN.register("K8-L-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tram",t:"Trạm"},{k:"tn",t:"Làm gì"},{k:"kq",t:"Kết quả"}],empty:"Kết quả từng lần làm tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:600,aria:"Bàn thí nghiệm moment lực và đòn bẩy",views:{
      moment:{label:"Moment lực",icon:IC.hand,frame:[170,46,680,550]},
      canbang:{label:"Đòn bẩy cân bằng",icon:IC.swap,frame:[70,170,860,400]},
      loai:{label:"Ba loại đòn bẩy",icon:IC.step,frame:[120,130,820,480]}}});
    const freshMo=()=>({d:2,F:1,dir:0,th:0,w:0,push:0,log:[],maxTh:0,pending:null});
    const freshCb=()=>({W:{},held:true,phi:0,om:0,settle:0,recKey:null,balUneq:S&&S.cb?S.cb.balUneq:false});
    const freshLv=()=>({k:"l1",a:0,go:false,done:S&&S.lv?S.lv.done:{}});
    S={mo:freshMo(),cb:null,lv:null,recs:0};S.cb=freshCb();S.lv=freshLv();
    const rec=(tram,tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tram,tn,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};

    /* ================= cửa ================= */
    const HG=[300,470];
    const moM=()=>{const M=S.mo;return FS[M.F]*DS[M.d]*Math.sin(DIRS[M.dir][2]*Math.PI/180)};
    function stepMo(dt){const M=S.mo;if(dt<=0)return;let left=dt;
      while(left>1e-6){const h=Math.min(left,1/120);left-=h;
        let tau=0;if(M.push>0){tau=moM();M.push-=h}
        /* moment cản của tay co: luôn chống lại chuyển động hoặc chống lại lực đẩy khi cửa đứng yên */
        if(Math.abs(M.w)<1e-4){if(Math.abs(tau)<=DOOR.Mc){M.w=0;tau=0}else tau-=Math.sign(tau)*DOOR.Mc}
        else tau-=Math.sign(M.w)*DOOR.Mc;
        const w0=M.w;M.w+=tau/DOOR.I*h;if(M.push<=0&&w0*M.w<0)M.w=0;
        M.th+=M.w*h;if(M.th>Math.PI/2){M.th=Math.PI/2;M.w=0}if(M.th<0){M.th=0;M.w=Math.max(0,M.w)}
        M.maxTh=Math.max(M.maxTh,M.th)}
      if(M.pending&&M.push<=0&&M.w===0){const p=M.pending;M.pending=null;const dth=(M.th-p.th0)*180/Math.PI;
        M.log.push({d:M.d,F:M.F,dir:DIRS[M.dir][0]});
        rec("Moment lực",`F = ${FS[p.F]} N, ${DIRS[p.dir][1].toLowerCase()}, đặt cách bản lề ${fmt(DS[p.d]*100,0)} cm`,`M = ${fmt(p.Mv,2)} N·m: ${p.Mv<=DOOR.Mc?"cửa không quay":`cửa quay thêm ${fmt(dth,0)}°`}`);
        refresh()}}
    /* ================= thước đòn bẩy ================= */
    const PV=[500,250];
    const sumM=()=>{let m=0;for(const k in S.cb.W)m+=S.cb.W[k]*(+k);return m};    /* đơn vị: quả × lỗ */
    const cnt=s=>{let n=0;for(const k in S.cb.W)if(Math.sign(+k)===s)n+=S.cb.W[k];return n};
    function stepCb(dt){const B=S.cb;if(dt<=0)return;
      if(B.held){B.phi+=(0-B.phi)*Math.min(1,dt*8);B.om=0;return}
      let I=RUL.m*RUL.len*RUL.len/12;for(const k in B.W)I+=B.W[k]*MW*Math.pow(+k*RUL.hole,2);
      let left=dt;while(left>1e-6){const h=Math.min(left,1/120);left-=h;
        const tau=MW*G*RUL.hole*sumM()*Math.cos(B.phi)-B.om*.04;B.om+=tau/I*h;B.phi+=B.om*h;
        const lim=.24;if(B.phi>lim){B.phi=lim;B.om=-B.om*.25}if(B.phi<-lim){B.phi=-lim;B.om=-B.om*.25}}
      B.settle+=dt;
      if(B.settle>1.6){const key=JSON.stringify(Object.entries(B.W).filter(e=>e[1]>0).sort((a,b)=>a[0]-b[0]));
        if(key!==B.recKey&&key!=="[]"){B.recKey=key;const m=sumM();const desc=s=>Object.entries(B.W).filter(e=>e[1]>0&&Math.sign(+e[0])===s).sort((a,b)=>Math.abs(a[0])-Math.abs(b[0])).map(e=>`${e[1]} quả ở lỗ ${Math.abs(e[0])}`).join(", ")||"không treo";
          const ML=-Object.entries(B.W).filter(e=>+e[0]<0).reduce((s,e)=>s+e[1]*e[0],0),MR=Object.entries(B.W).filter(e=>+e[0]>0).reduce((s,e)=>s+e[1]*e[0],0);
          const k=MW*G*RUL.hole;
          rec("Đòn bẩy cân bằng",`Trái: ${desc(-1)}; phải: ${desc(1)}`,`M trái = ${fmt(ML*k,3)} N·m, M phải = ${fmt(MR*k,3)} N·m: ${m===0?"thước cân bằng":m>0?"thước nghiêng về bên phải":"thước nghiêng về bên trái"}`);
          if(m===0&&cnt(-1)!==cnt(1)&&cnt(-1)>0)B.balUneq=true;refresh()}}}
    function stepLv(dt){const L=S.lv;if(!L.go||dt<=0)return;L.a=Math.min(1,L.a+dt*.6);
      if(L.a>=1&&L.go){L.go=false;const d=LEV[L.k];const F=d.P*d.dP/d.dF;if(!L.done[L.k]){L.done[L.k]=true;
          rec("Ba loại đòn bẩy",`${d.ten} (loại ${d.loai}): vật ${fmt(d.P,0)} N cách O ${fmt(d.dP*100,0)} cm; tay cách O ${fmt(d.dF*100,0)} cm`,`lực cần ≈ ${fmt(F,0)} N (${F<d.P?"lợi về lực":"thiệt về lực"}); tay đi quãng đường ${fmt(d.dF/d.dP,1)} lần vật`)}refresh()}}
    K.onFrame(dt=>{stepMo(dt);stepCb(dt);stepLv(dt)});

    /* ================= vẽ ================= */
    const wood=(ctx,x,y,w,h,r,c1,c2)=>{const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,c1);g.addColorStop(1,c2);ctx.fillStyle=g;C.rr(ctx,x,y,w,h,r);ctx.fill();
      ctx.save();ctx.clip();ctx.strokeStyle="rgba(60,30,10,.18)";ctx.lineWidth=1.2;for(let i=0;i<6;i++){ctx.beginPath();const yy=y+h*(i+.5)/6;ctx.moveTo(x,yy);for(let s=0;s<=w;s+=20)ctx.lineTo(x+s,yy+Math.sin(s*.03+i*1.7)*h*.05);ctx.stroke()}ctx.restore()};
    function forceArrow(ctx,x1,y1,x2,y2,lab,c){D2.arrow(ctx,x1,y1,x2,y2,c,6,18);if(lab){const L=Math.hypot(x2-x1,y2-y1)||1,nx=-(y2-y1)/L,ny=(x2-x1)/L,sg=nx>0||(nx===0&&ny<0)?1:-1;const mx=x1+(x2-x1)*.4+sg*nx*26,my=y1+(y2-y1)*.4+sg*ny*26;D2.text(ctx,lab,mx,my,{s:21,w:800,c,a:sg*nx>=.3?"left":sg*nx<=-.3?"right":"center",b:"middle"})}}
    function drawMo(ctx,P){const M=S.mo,px=DOOR.px*100;const [hx,hy]=HG;
      /* sàn gạch */
      ctx.save();ctx.globalAlpha=K.day?.5:.35;D2.grid(ctx,180,60,640,394,50,P.line);ctx.restore();
      /* tường hai bên khung cửa */
      for(const [x,w] of [[180,hx-180-6],[hx+DOOR.L*px+12,120]]){D2.block(ctx,x,hy-16,w,32,3,K.day?"#CBD5E1":"#475569",K.day?"#94A3B8":"#334155",{shadow:false});
        ctx.save();ctx.strokeStyle="rgba(0,0,0,.2)";ctx.lineWidth=1;for(let xx=x+10;xx<x+w+12;xx+=16){ctx.beginPath();ctx.moveTo(xx,hy-16);ctx.lineTo(xx-12,hy+16);ctx.stroke()}ctx.restore()}
      /* cung quỹ đạo mép cửa tới 90° */
      ctx.save();ctx.setLineDash([6,8]);ctx.strokeStyle=P.line;ctx.lineWidth=2;ctx.beginPath();ctx.arc(hx,hy,DOOR.L*px,-Math.PI/2,0);ctx.stroke();ctx.restore();
      D2.text(ctx,"90°",hx+14,hy-DOOR.L*px+34,{s:18,w:700,c:P.mut});
      /* cánh cửa */
      const th=M.th,u=[Math.cos(th),-Math.sin(th)],n=[-Math.sin(th),-Math.cos(th)];
      ctx.save();ctx.translate(hx,hy);ctx.rotate(-th);ctx.shadowColor="rgba(0,0,0,.35)";ctx.shadowBlur=12;ctx.shadowOffsetY=5;wood(ctx,0,-11,DOOR.L*px,22,3,"#B07A45","#7A4E26");ctx.shadowColor="transparent";
      ctx.strokeStyle="rgba(40,20,5,.5)";ctx.lineWidth=1.5;C.rr(ctx,0,-11,DOOR.L*px,22,3);ctx.stroke();
      /* tay nắm ở 75 cm */
      ctx.fillStyle="#D1D5DB";ctx.strokeStyle="#6B7280";ctx.lineWidth=1.5;C.rr(ctx,.75*px-16,11,32,8,3);ctx.fill();ctx.stroke();C.rr(ctx,.75*px-16,-19,32,8,3);ctx.fill();ctx.stroke();
      ctx.restore();
      /* bản lề */
      D2.ball(ctx,hx,hy,12,"#9CA3AF");ctx.fillStyle="#374151";ctx.beginPath();ctx.arc(hx,hy,3,0,6.283);ctx.fill();
      /* vạch chia cm trên cửa */
      [10,40,75].forEach(cm=>{const x=hx+u[0]*cm/100*px,y=hy+u[1]*cm/100*px;ctx.strokeStyle=P.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x+n[0]*11,y+n[1]*11);ctx.lineTo(x+n[0]*22,y+n[1]*22);ctx.stroke();if(cm!==Math.round(DS[M.d]*100))D2.text(ctx,cm+" cm",x+n[0]*36,y+n[1]*36+5,{s:16,w:700,c:P.mut,a:"center"})});
      /* lực F */
      const d=DS[M.d],F=FS[M.F],ang=DIRS[M.dir][2]*Math.PI/180;
      const ap=[hx+u[0]*d*px,hy+u[1]*d*px];   /* điểm đặt trên đường giữa cánh cửa (nhìn từ trên xuống) */
      const fdir=[n[0]*Math.sin(ang)-u[0]*Math.cos(ang),n[1]*Math.sin(ang)-u[1]*Math.cos(ang)];
      const Lf=30+F*4;const tail=[ap[0]-fdir[0]*Lf,ap[1]-fdir[1]*Lf];
      const col=M.push>0?"#F97316":(K.day?"#C2410C":"#FDBA74");
      /* giá của lực (nét đứt) và cánh tay đòn d */
      ctx.save();ctx.setLineDash([4,6]);ctx.strokeStyle=C.rgba(col,.7);ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(ap[0]-fdir[0]*420,ap[1]-fdir[1]*420);ctx.lineTo(ap[0]+fdir[0]*260,ap[1]+fdir[1]*260);ctx.stroke();ctx.restore();
      if(M.dir!==2){/* chân đường vuông góc từ bản lề xuống giá của lực */
        const vx=hx-ap[0],vy=hy-ap[1];const t=vx*fdir[0]+vy*fdir[1];const ft=[ap[0]+fdir[0]*t,ap[1]+fdir[1]*t];
        ctx.strokeStyle=K.day?"#2563EB":"#93C5FD";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(ft[0],ft[1]);ctx.stroke();
        const dd=Math.hypot(ft[0]-hx,ft[1]-hy)/px;D2.text(ctx,`d = ${fmt(dd*100,0)} cm`,(hx+ft[0])/2-70,(hy+ft[1])/2+34,{s:18,w:800,c:K.day?"#1D4ED8":"#BFDBFE"});
        /* dấu góc vuông */
        const a1=[-fdir[0]*10,-fdir[1]*10],dl=Math.hypot(hx-ft[0],hy-ft[1])||1,a2=[(hx-ft[0])/dl*10,(hy-ft[1])/dl*10];
        ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(ft[0]+a1[0],ft[1]+a1[1]);ctx.lineTo(ft[0]+a1[0]+a2[0],ft[1]+a1[1]+a2[1]);ctx.lineTo(ft[0]+a2[0],ft[1]+a2[1]);ctx.stroke()}
      forceArrow(ctx,tail[0],tail[1],ap[0],ap[1],`F = ${F} N`,col);
      ctx.fillStyle=col;ctx.beginPath();ctx.arc(ap[0],ap[1],5,0,6.283);ctx.fill();
}
    const holeP=(i,phi)=>{const x=i*RUL.hole*100*RUL.px,y=i?6:0;return[PV[0]+x*Math.cos(phi)-y*Math.sin(phi),PV[1]+x*Math.sin(phi)+y*Math.cos(phi)]};
    function drawCb(ctx,P){const B=S.cb,phi=B.phi;
      /* giá đỡ */
      D2.block(ctx,PV[0]-150,540,300,22,8,"#4B5563","#1F2937");ctx.fillStyle="#6B7280";ctx.fillRect(PV[0]-7,PV[1],14,292);
      const sg=ctx.createLinearGradient(PV[0]-7,0,PV[0]+7,0);sg.addColorStop(0,"#9CA3AF");sg.addColorStop(.5,"#E5E7EB");sg.addColorStop(1,"#6B7280");ctx.fillStyle=sg;ctx.fillRect(PV[0]-6,PV[1],12,292);
      /* chốt giữ thước (khi đang giữ) */
      if(B.held)for(const s of [-1,1]){const x=PV[0]+s*330;ctx.fillStyle=K.day?"#94A3B8":"#64748B";ctx.fillRect(x-8,PV[1]+22,16,318);D2.block(ctx,x-22,PV[1]+14,44,10,3,"#CBD5E1","#94A3B8",{shadow:false})}
      /* thước */
      ctx.save();ctx.translate(PV[0],PV[1]);ctx.rotate(phi);const W=RUL.len*100*RUL.px;
      ctx.shadowColor="rgba(0,0,0,.35)";ctx.shadowBlur=10;ctx.shadowOffsetY=4;
      const g=ctx.createLinearGradient(0,-20,0,20);g.addColorStop(0,"#E5E7EB");g.addColorStop(.5,"#C0C6CE");g.addColorStop(1,"#8B939D");ctx.fillStyle=g;C.rr(ctx,-W/2,-20,W,40,5);ctx.fill();ctx.shadowColor="transparent";
      ctx.strokeStyle="rgba(0,0,0,.3)";ctx.lineWidth=1;C.rr(ctx,-W/2,-20,W,40,5);ctx.stroke();
      for(let i=-RUL.n;i<=RUL.n;i++){const x=i*RUL.hole*100*RUL.px;ctx.fillStyle="#1F2937";ctx.beginPath();ctx.arc(x,i?6:0,i?6:8,0,6.283);ctx.fill();
        if(i){ctx.font="800 15px 'Be Vietnam Pro',system-ui,sans-serif";ctx.fillStyle="#111827";ctx.textAlign="center";ctx.fillText(String(Math.abs(i)),x,-6);ctx.textAlign="left"}}
      ctx.restore();
      /* trục điểm tựa */
      D2.ball(ctx,PV[0],PV[1],7,"#F59E0B");
      /* quả nặng: treo thẳng đứng dưới lỗ */
      for(const k in B.W){const n=B.W[k];if(!n)continue;const [x,y]=holeP(+k,phi);
        ctx.strokeStyle="#9CA3AF";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+47);ctx.stroke();
        for(let j=0;j<n;j++){const yy=y+40+j*20;const gg=ctx.createLinearGradient(x-18,0,x+18,0);gg.addColorStop(0,"#6B7280");gg.addColorStop(.35,"#E5E7EB");gg.addColorStop(.7,"#9CA3AF");gg.addColorStop(1,"#4B5563");
          ctx.fillStyle=gg;C.rr(ctx,x-18,yy,36,18,4);ctx.fill();ctx.strokeStyle="rgba(0,0,0,.35)";ctx.lineWidth=1;ctx.stroke();ctx.fillStyle="#111827";ctx.fillRect(x-1.5,yy,3,6)}
        D2.text(ctx,`${n}×50 g`,x,y+40+n*20+22,{s:17,w:800,c:P.mut,a:"center"})}
      /* tổng moment */
      const k=MW*G*RUL.hole;let ML=0,MR=0;for(const kk in B.W){if(+kk<0)ML-=B.W[kk]*kk;else MR+=B.W[kk]*kk}
      D2.text(ctx,`M trái = ${fmt(ML*k,3)} N·m`,90,520,{s:21,w:800,c:K.day?"#1D4ED8":"#93C5FD"});
      D2.text(ctx,`M phải = ${fmt(MR*k,3)} N·m`,910,520,{s:21,w:800,c:K.day?"#B91C1C":"#FCA5A5",a:"right"})}
    function drawLv(ctx,P){const L=S.lv,d=LEV[L.k];const a=L.a;const ink=P.ink;
      const cF="#F97316",cP=K.day?"#2563EB":"#60A5FA",cO="#FACC15";
      ctx.fillStyle=K.day?"#C7B299":"#3B3326";ctx.fillRect(120,470,820,10);
      let O,Fp,Pp;
      if(L.k==="l1"){/* xà beng: điểm tựa là hòn đá nhỏ, đầu ngắn bẩy hòn đá to */
        const ang=-.08-a*.12;O=[420,440];const ux=Math.cos(ang),uy=Math.sin(ang);const sc=380;
        Pp=[O[0]-ux*d.dP*sc,O[1]-uy*d.dP*sc];Fp=[O[0]+ux*d.dF*sc,O[1]+uy*d.dF*sc];
        /* hòn kê */
        ctx.fillStyle="#78716C";ctx.beginPath();ctx.moveTo(O[0]-30,470);ctx.quadraticCurveTo(O[0],O[1]-6,O[0]+30,470);ctx.fill();
        /* hòn đá lớn */
        const lift=a*30;const sx=Pp[0]-70,sy=470-lift;const rg=ctx.createRadialGradient(sx-20,sy-80,10,sx,sy-50,110);rg.addColorStop(0,"#A8A29E");rg.addColorStop(1,"#44403C");ctx.fillStyle=rg;
        ctx.beginPath();ctx.moveTo(sx-90,sy);ctx.bezierCurveTo(sx-110,sy-70,sx-40,sy-125,sx+20,sy-110);ctx.bezierCurveTo(sx+80,sy-100,sx+95,sy-40,sx+80,sy);ctx.closePath();ctx.fill();
        /* thanh xà beng */
        ctx.strokeStyle="#374151";ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(Pp[0]-20*ux,Pp[1]-20*uy+4);ctx.lineTo(Fp[0],Fp[1]);ctx.stroke();ctx.strokeStyle="#9CA3AF";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(Pp[0],Pp[1]-3);ctx.lineTo(Fp[0],Fp[1]-3);ctx.stroke();
        forceArrow(ctx,Fp[0],Fp[1]-120,Fp[0],Fp[1]-8,`F ≈ ${fmt(d.P*d.dP/d.dF,0)} N`,cF);forceArrow(ctx,Pp[0],Pp[1]-110,Pp[0],Pp[1]-6,"",cP);D2.text(ctx,`P = ${d.P} N`,Pp[0]-150,Pp[1]-150,{s:21,w:800,c:cP})}
      else if(L.k==="l2"){/* xe cút kít: trục bánh xe là điểm tựa */
        const ang=-a*.16;O=[230,410];const ux=Math.cos(ang),uy=Math.sin(ang);const sc=480;
        Pp=[O[0]+ux*d.dP*sc,O[1]+uy*d.dP*sc];Fp=[O[0]+ux*d.dF*sc,O[1]+uy*d.dF*sc];
        /* bánh xe */
        ctx.fillStyle="#1F2937";ctx.beginPath();ctx.arc(O[0],O[1],58,0,6.283);ctx.fill();ctx.fillStyle="#9CA3AF";ctx.beginPath();ctx.arc(O[0],O[1],30,0,6.283);ctx.fill();
        ctx.strokeStyle="#4B5563";ctx.lineWidth=3;for(let i=0;i<6;i++){const t=i*1.047;ctx.beginPath();ctx.moveTo(O[0],O[1]);ctx.lineTo(O[0]+Math.cos(t)*30,O[1]+Math.sin(t)*30);ctx.stroke()}
        /* thùng xe */
        ctx.save();ctx.translate(O[0],O[1]);ctx.rotate(ang);
        const tg=ctx.createLinearGradient(0,-150,0,-20);tg.addColorStop(0,"#16A34A");tg.addColorStop(1,"#14532D");ctx.fillStyle=tg;ctx.beginPath();ctx.moveTo(40,-30);ctx.lineTo(5,-150);ctx.lineTo(370,-150);ctx.lineTo(300,-30);ctx.closePath();ctx.fill();
        ctx.fillStyle="#7C4A1E";ctx.beginPath();ctx.ellipse(188,-150,180,26,0,Math.PI,0);ctx.fill();
        ctx.strokeStyle="#57534E";ctx.lineWidth=11;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(d.dF*sc,0);ctx.stroke();
        ctx.lineWidth=7;ctx.beginPath();ctx.moveTo(300,0);ctx.lineTo(320,60);ctx.stroke();ctx.restore();
        forceArrow(ctx,Fp[0],Fp[1]+120,Fp[0],Fp[1]+8,`F ≈ ${fmt(d.P*d.dP/d.dF,0)} N`,cF);forceArrow(ctx,Pp[0],Pp[1]-120,Pp[0],Pp[1]+10,"",cP);D2.text(ctx,`P = ${d.P} N`,Pp[0]+12,Pp[1]-140,{s:21,w:800,c:cP})}
      else{/* cần câu: tay sau giữ cuối cần là điểm tựa, tay trước kéo lên */
        const ang=-.35-a*.25;O=[170,400];const ux=Math.cos(ang),uy=Math.sin(ang);const sc=330;
        Fp=[O[0]+ux*d.dF*sc,O[1]+uy*d.dF*sc];const tip=[O[0]+ux*d.dP*sc,O[1]+uy*d.dP*sc];
        ctx.strokeStyle="#92400E";ctx.lineCap="round";for(let i=0;i<20;i++){const s0=i/20,s1=(i+1)/20;ctx.lineWidth=12-10*s0;ctx.beginPath();ctx.moveTo(O[0]+(tip[0]-O[0])*s0,O[1]+(tip[1]-O[1])*s0);ctx.lineTo(O[0]+(tip[0]-O[0])*s1,O[1]+(tip[1]-O[1])*s1);ctx.stroke()}
        const fy=tip[1]+150;ctx.strokeStyle=P.mut;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(tip[0],tip[1]);ctx.lineTo(tip[0],fy);ctx.stroke();
        Pp=[tip[0],tip[1]];
        /* mặt nước và con cá */
        ctx.fillStyle=K.day?"rgba(59,130,246,.25)":"rgba(59,130,246,.18)";ctx.fillRect(560,420,400,50);
        ctx.save();ctx.translate(tip[0],fy+26);ctx.rotate(Math.PI/2);const fg=ctx.createLinearGradient(-30,0,30,0);fg.addColorStop(0,"#94A3B8");fg.addColorStop(1,"#E2E8F0");ctx.fillStyle=fg;ctx.beginPath();ctx.ellipse(0,0,30,12,0,0,6.283);ctx.fill();
        ctx.beginPath();ctx.moveTo(26,0);ctx.lineTo(44,-12);ctx.lineTo(44,12);ctx.closePath();ctx.fill();ctx.fillStyle="#111827";ctx.beginPath();ctx.arc(-18,-3,2.4,0,6.283);ctx.fill();ctx.restore();
        forceArrow(ctx,Fp[0]-30,Fp[1]-120,Fp[0],Fp[1]-6,`F ≈ ${fmt(d.P*d.dP/d.dF,0)} N`,cF);forceArrow(ctx,tip[0]+30,fy+60,tip[0]+30,fy+150,"",cP);D2.text(ctx,`P = ${d.P} N`,tip[0]+44,fy+120,{s:21,w:800,c:cP})}
      /* điểm tựa O */
      ctx.fillStyle=cO;ctx.beginPath();ctx.arc(O[0],O[1],8,0,6.283);ctx.fill();D2.text(ctx,"O",O[0]-30,O[1]+34,{s:22,w:900,c:cO});
}
    K.drawFn((ctx,P)=>{const v=K.view;if(v==="moment")drawMo(ctx,P);else if(v==="canbang")drawCb(ctx,P);else drawLv(ctx,P)});

    /* ================= nhãn ================= */
    K.label("Bản lề (trục quay)",[HG[0],HG[1]],{view:"moment",dir:"sw",len:44});
    K.label("Tay nắm",()=>[HG[0]+Math.cos(S.mo.th)*.75*DOOR.px*100,HG[1]-Math.sin(S.mo.th)*.75*DOOR.px*100],{view:"moment",dir:"n",len:40});
    K.label("Giá của lực",()=>{const M=S.mo,th=M.th,u=[Math.cos(th),-Math.sin(th)],n=[-Math.sin(th),-Math.cos(th)],ang=DIRS[M.dir][2]*Math.PI/180;const f=[n[0]*Math.sin(ang)-u[0]*Math.cos(ang),n[1]*Math.sin(ang)-u[1]*Math.cos(ang)];
      const ap=[HG[0]+u[0]*DS[M.d]*DOOR.px*100,HG[1]+u[1]*DS[M.d]*DOOR.px*100];return[ap[0]+f[0]*170,ap[1]+f[1]*170]},{view:"moment",dir:"e",len:40});
    K.label("Điểm tựa O",PV,{view:"canbang",dir:"n",len:64});
    K.label("Lỗ treo, cách nhau 5 cm",()=>holeP(4,S.cb.phi),{view:"canbang",dir:"ne",len:70});
    K.label("Giá đỡ",[PV[0],480],{view:"canbang",dir:"e",len:60});

    /* ================= chạm ================= */
    K.pickFn((q,mode)=>{if(K.view!=="canbang")return null;const B=S.cb;
      for(const k in B.W){const n=B.W[k];if(!n)continue;const [x,y]=holeP(+k,B.phi);if(q[0]>x-22&&q[0]<x+22&&q[1]>y+34&&q[1]<y+44+n*20)return{k:"rm",i:+k}}
      for(let i=-RUL.n;i<=RUL.n;i++){if(!i)continue;const [x,y]=holeP(i,B.phi);if(Math.hypot(q[0]-x,q[1]-y)<20)return{k:"add",i}}return null});
    K.tapFn(k=>{if(!k)return;const B=S.cb;if(k.k==="add"){const tot=Object.values(B.W).reduce((a,b)=>a+b,0);if(tot>=10){api.toast("Hộp chỉ có 10 quả nặng.","info",1600);return}if((B.W[k.i]||0)>=4){api.toast("Mỗi lỗ treo tối đa 4 quả.","info",1600);return}B.W[k.i]=(B.W[k.i]||0)+1}
      else{B.W[k.i]--;if(!B.W[k.i])delete B.W[k.i]}B.settle=0;refresh()});

    /* ================= khay ================= */
    K.dockFn(()=>{const v=K.view;
      if(v==="moment"){const M=S.mo;return[{seg:DS.map((d,i)=>({k:"d",v:String(i),label:`d = ${fmt(d*100,0)} cm`,icon:"",on:M.d===i})),label:"Khoảng cách tới bản lề"},
        {seg:FS.map((f,i)=>({k:"F",v:String(i),label:`F = ${f} N`,icon:"",on:M.F===i})),label:"Độ lớn lực"},
        {seg:DIRS.map((r,i)=>({k:"dir",v:String(i),label:r[1],icon:"",on:M.dir===i})),label:"Hướng lực"},
        "hr",{k:"push",label:"Đẩy cửa",icon:IC.play,dis:M.push>0||M.w!==0||!!M.pending},{k:"close",label:"Đóng cửa",icon:IC.reset,dis:M.push>0||M.w!==0}]}
      if(v==="canbang"){const B=S.cb;return[{k:"hold",label:B.held?"Thả thước":"Giữ thước",icon:B.held?IC.play:IC.hand,on:!B.held},{k:"clr",label:"Bỏ hết quả nặng",icon:IC.minus,dis:!Object.keys(B.W).length},
        {k:"ex",label:"Ví dụ: 2 quả lỗ 3",icon:IC.plus}]}
      const L=S.lv;return[{seg:["l1","l2","l3"].map(k=>({k:"lv",v:k,label:`Loại ${LEV[k].loai}`,icon:IC.step,on:L.k===k})),label:"Dụng cụ"},
        {k:"lift",label:L.a>=1?"Hạ xuống":"Nâng vật",icon:L.a>=1?IC.reset:IC.hand,dis:L.go}]});
    K.onDock((k,v)=>{const M=S.mo;
      if(k==="d"&&!M.pending)M.d=+v;else if(k==="F"&&!M.pending)M.F=+v;else if(k==="dir"&&!M.pending)M.dir=+v;
      else if(k==="push"){if(M.th>=Math.PI/2-.01){api.toast("Cửa đã mở hết cỡ. Bấm “Đóng cửa”.","info",1800)}else{M.push=DOOR.push;M.pending={F:M.F,d:M.d,dir:M.dir,Mv:moM(),th0:M.th};if(!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}}
      else if(k==="close"){M.th=0;M.w=0}
      else if(k==="hold"){const B=S.cb;B.held=!B.held;B.settle=0;if(B.held)B.recKey=null}
      else if(k==="clr"){S.cb.W={};S.cb.settle=0}
      else if(k==="ex"){const B=S.cb;B.W={"-3":2};B.held=true;B.settle=0;api.toast("Bên trái: 2 quả ở lỗ 3. Hãy treo quả nặng bên phải rồi thả thước.","info",2600)}
      else if(k==="lv"){S.lv.k=v;S.lv.a=0;S.lv.go=false}
      else if(k==="lift"){const L=S.lv;if(L.a>=1)L.a=0;else L.go=true}
      refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="moment"){const M=S.mo;return `<div><b>Moment lực</b> M = F·d</div><div>F = ${FS[M.F]} N · ${DIRS[M.dir][1].toLowerCase()} · cách bản lề ${fmt(DS[M.d]*100,0)} cm</div><div>M = ${fmt(moM(),2)} N·m ${moM()>DOOR.Mc?"&gt;":"≤"} ${DOOR.Mc} N·m (cản)</div><small>d là khoảng cách từ trục quay tới giá của lực (nét xanh).</small>`}
      if(v==="canbang"){const B=S.cb;return `<div><b>Thước đòn bẩy</b> · quả nặng 50 g</div><div>Bên trái: ${cnt(-1)} quả · bên phải: ${cnt(1)} quả</div><div><b>${B.held?"Thước đang được giữ nằm ngang":(Math.abs(B.phi)<.004&&sumM()===0?"Thước cân bằng":"Thước nghiêng về bên "+(B.phi>0?"phải":"trái"))}</b></div><small>Chạm vào lỗ để treo thêm, chạm vào chùm quả nặng để bớt. ${B.held?"Bấm “Thả thước” để xem thước quay.":""}</small>`}
      const d=LEV[S.lv.k];return `<div><b>${d.ten}</b> · đòn bẩy loại ${d.loai}</div><div><i style="background:#FACC15"></i>O: điểm tựa</div><div><i style="background:#F97316"></i>F: lực của tay</div><div><i style="background:#60A5FA"></i>P: trọng lượng ${d.vat}</div><div>F × ${fmt(d.dF*100,0)} cm = P × ${fmt(d.dP*100,0)} cm → F ≈ ${fmt(d.P*d.dP/d.dF,0)} N</div><small>${d.P*d.dP/d.dF<d.P?"F &lt; P: lợi về lực.":"F &gt; P: thiệt về lực, lợi về đường đi."}</small>`});
    K.timeLabel(()=>{const v=K.view;if(v==="moment")return `Góc mở cửa ${fmt(S.mo.th*180/Math.PI,0)}°`;if(v==="canbang")return `Thước nghiêng ${fmt(S.cb.phi*180/Math.PI,1)}°`;return[`Nâng vật ${fmt(S.lv.a*100,0)}%`,S.lv.a]});
    K.onReset(()=>{const bu=S.cb.balUneq,dn=S.lv.done;S.mo=freshMo();S.cb=freshCb();S.cb.balUneq=bu;S.lv=freshLv();S.lv.done=dn;refresh()});
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const M=S.mo;M.F=1;M.d=0;M.push=DOOR.push;M.pending={F:1,d:0,dir:0,Mv:moM(),th0:0};
        setTimeout(()=>{M.d=2;M.push=DOOR.push;M.pending={F:1,d:2,dir:0,Mv:moM(),th0:M.th}},2500);
        setTimeout(()=>{M.th=0;M.dir=2;M.push=DOOR.push;M.pending={F:1,d:2,dir:2,Mv:moM(),th0:0}},5000);
        const B=S.cb;B.W={"-3":2,"2":3};B.held=false;B.settle=0;
        ["l1","l2","l3"].forEach(k=>{const d=LEV[k],F=d.P*d.dP/d.dF;S.lv.done[k]=true;rec("Ba loại đòn bẩy",`${d.ten} (loại ${d.loai})`,`lực cần ≈ ${fmt(F,0)} N (${F<d.P?"lợi về lực":"thiệt về lực"})`)});refresh()}};
    return K.mount(st)}
});
})();
