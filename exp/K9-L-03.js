/* K9-L-03 · Khúc xạ ánh sáng; phản xạ toàn phần (SGK KHTN 9 – Kết nối tri thức, Bài 5–6) · 2D, điều tra
   Bàn đo: thước đo góc tròn, khối bán trụ trong suốt (thủy tinh hoặc nước đựng trong hộp nhựa mỏng), đèn laser chiếu vào tâm.
   1. Khúc xạ: tia sáng từ không khí vào bán trụ qua mặt phẳng; đo góc tới i, góc khúc xạ r; tính sin i / sin r.
   2. Phản xạ toàn phần: tia sáng đi trong bán trụ tới mặt phẳng ra không khí; khi i ≥ i_gh thì không còn tia khúc xạ.
   Định luật khúc xạ n₁·sin i = n₂·sin r; độ sáng tia phản xạ, khúc xạ tính theo công thức Fresnel (ánh sáng không phân cực). */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt,D=Math.PI/180;
const MED={tt:{ten:"thủy tinh",n:1.5},nuoc:{ten:"nước",n:1.33}};
const CX=500,CY=330,RR=230;

const SPEC={
  predict:[{id:"p1",q:"Tia sáng đi xiên từ không khí vào thủy tinh. Góc khúc xạ so với góc tới:",opts:[["nho","Nhỏ hơn"],["lon","Lớn hơn"],["bang","Bằng nhau"]],ans:"nho",res:"Kết quả: tia khúc xạ lệch lại gần pháp tuyến, góc khúc xạ nhỏ hơn góc tới."},
    {id:"p2",q:"Tia sáng đi từ thủy tinh ra không khí với góc tới rất lớn sẽ:",opts:[["tp","Phản xạ hoàn toàn trở lại thủy tinh"],["ra","Luôn ló ra không khí"],["dung","Đi thẳng không đổi hướng"]],ans:"tp",res:"Kết quả: khi góc tới lớn hơn góc tới hạn (khoảng 42° với thủy tinh), không còn tia khúc xạ, toàn bộ ánh sáng bị phản xạ."}],
  taskLead:"Kéo đèn laser quanh thước đo góc (hoặc bấm ± ở khay) để đổi góc tới. Bấm “Ghi số đo” sau mỗi lần đo.",
  tasks:[{html:"<b>Khúc xạ:</b> ghi số đo ở ít nhất 4 góc tới khác nhau (không khí → thủy tinh).",done:()=>new Set(S.log.filter(l=>l.mode==="kx"&&l.m==="tt").map(l=>l.i)).size>=4},
    {html:"<b>Khúc xạ:</b> đổi sang nước, ghi ít nhất 2 số đo.",done:()=>S.log.filter(l=>l.mode==="kx"&&l.m==="nuoc").length>=2},
    {html:"<b>Phản xạ toàn phần:</b> tăng góc tới tới khi tia khúc xạ biến mất; ghi số đo trước và sau góc tới hạn.",done:()=>S.log.some(l=>l.mode==="tp"&&l.tir)&&S.log.some(l=>l.mode==="tp"&&!l.tir)}],
  obs:[{id:"a",q:"Tỉ số sin i / sin r khi ánh sáng đi từ không khí vào thủy tinh:",opts:[["kd","Gần như không đổi (khoảng 1,5) với mọi góc tới"],["tang","Tăng theo góc tới"],["giam","Giảm theo góc tới"]],ans:"kd",why:"Đó là chiết suất của thủy tinh đối với không khí; với nước khoảng 1,33."},
    {id:"b",q:"Điều kiện để có phản xạ toàn phần là:",opts:[["dk","Ánh sáng đi từ môi trường chiết suất lớn sang môi trường chiết suất nhỏ và góc tới ≥ góc tới hạn"],["nguoc","Ánh sáng đi từ không khí vào nước"],["moi","Mọi góc tới đều được"]],ans:"dk",why:"sin i_gh = n₂/n₁; với thủy tinh – không khí, i_gh ≈ 41,8°."}],
  concl:{html:`<div class="eq">n₁·sin i = n₂·sin r &nbsp;&nbsp;&nbsp; n = c/v &nbsp;&nbsp;&nbsp; sin i<sub>gh</sub> = n₂/n₁</div><ul class="tlist">
    <li><b>Khúc xạ ánh sáng</b> là hiện tượng tia sáng bị gãy khúc tại mặt phân cách giữa hai môi trường trong suốt khác nhau. Tia khúc xạ nằm trong mặt phẳng tới, ở bên kia pháp tuyến.</li>
    <li>Chiết suất n của môi trường cho biết tốc độ ánh sáng trong môi trường đó nhỏ hơn trong chân không bao nhiêu lần.</li>
    <li><b>Phản xạ toàn phần</b> xảy ra khi ánh sáng đi từ môi trường có chiết suất lớn sang môi trường có chiết suất nhỏ hơn với góc tới lớn hơn hoặc bằng góc tới hạn. Ứng dụng: sợi quang, lăng kính phản xạ toàn phần.</li></ul>`,
    quiz:[{id:"q1",q:"Tia sáng từ không khí vào nước (n = 1,33) với góc tới 30°. Góc khúc xạ gần nhất với:",opts:[["a","22°"],["b","30°"],["c","40°"]],ans:"a",why:{b:"Tia sáng lệch lại gần pháp tuyến khi vào nước.",c:"sin r = sin 30°/1,33 ≈ 0,376 → r ≈ 22°."}},
      {id:"q2",q:"Cáp quang truyền ánh sáng đi xa nhờ hiện tượng:",opts:[["a","Phản xạ toàn phần"],["b","Tán sắc"],["c","Khúc xạ"]],ans:"a",why:{b:"Tán sắc là sự phân tách ánh sáng trắng.",c:"Ánh sáng bị phản xạ toàn phần liên tiếp ở thành sợi."}}],
    done:`<h2>Hoàn thành: Khúc xạ và phản xạ toàn phần</h2><p class="muted">sin i / sin r = n; phản xạ toàn phần khi i ≥ i_gh.</p>`},
  gv:["Cho học sinh lập bảng i, r, sin i, sin r, sin i/sin r; nhận xét tỉ số gần như không đổi.","Hỏi: nhìn chiếc thìa trong cốc nước thấy bị gãy, vì sao?","Ở phản xạ toàn phần, tăng chậm góc tới quanh 40°–43° để thấy tia khúc xạ mờ dần, sát mặt phân cách rồi biến mất."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 5–6)</p><ul class="tlist"><li>Thực hiện thí nghiệm chứng tỏ được khi truyền từ môi trường này sang môi trường khác, tia sáng có thể bị khúc xạ; phát biểu định luật khúc xạ; nêu chiết suất có giá trị bằng tỉ số tốc độ ánh sáng.</li><li>Thực hiện thí nghiệm để rút ra điều kiện xảy ra phản xạ toàn phần, xác định góc tới hạn.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 5 Khúc xạ ánh sáng, Bài 6 Phản xạ toàn phần.</li>
<li>Chiết suất nước 1,33, thủy tinh thường khoảng 1,5; định luật Snell, công thức Fresnel, góc tới hạn: <a href="https://openstax.org/books/college-physics-2e/pages/25-3-the-law-of-refraction" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 25.3</a>, <a href="https://openstax.org/books/college-physics-2e/pages/25-4-total-internal-reflection" target="_blank" rel="noopener">mục 25.4</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Tia laser đi qua tâm bán trụ nên đi thẳng qua mặt cong; bỏ qua thành hộp nhựa khi dùng nước. Số đo góc làm tròn tới 0,5°.</li></ul>`;

let S;
LabKHTN.register("K9-L-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Trường hợp"},{k:"i",t:"i"},{k:"r",t:"r (hoặc phản xạ)"},{k:"ti",t:"sin i / sin r"}],empty:"Bấm “Ghi số đo” để ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:660,aria:"Bàn đo khúc xạ ánh sáng và phản xạ toàn phần",views:{kx:{label:"Khúc xạ",icon:IC.lens,frame:[200,70,600,560]},tp:{label:"Phản xạ toàn phần",icon:IC.swap,frame:[200,70,600,560]}}});
    S={m:"tt",i:{kx:40,tp:30},log:[],recs:0};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const calc=()=>{const v=K.view,n=MED[S.m].n;const i=S.i[v]*D;const n1=v==="kx"?1:n,n2=v==="kx"?n:1;const s=n1/n2*Math.sin(i);
      const tir=s>=1;const r=tir?null:Math.asin(s);let Rf=1;if(!tir){const ci=Math.cos(i),cr=Math.cos(r);const rs=Math.pow((n1*ci-n2*cr)/(n1*ci+n2*cr),2),rp=Math.pow((n1*cr-n2*ci)/(n1*cr+n2*ci),2);Rf=(rs+rp)/2}
      return{i,r,tir,Rf,n1,n2,ic:Math.asin(Math.min(1,n2/n1))}};
    function draw(ctx,P){const v=K.view,c=calc();const dark=!K.day;
      /* đĩa thước đo góc */
      ctx.fillStyle=K.day?"#F8FAFC":"#111a3d";ctx.beginPath();ctx.arc(CX,CY,RR+30,0,6.283);ctx.fill();ctx.strokeStyle=P.line;ctx.lineWidth=2;ctx.stroke();
      for(let a=0;a<360;a+=2){const big=a%10===0;const r1=RR+30,r2=RR+(big?14:22);const t=a*D;ctx.strokeStyle=P.mut;ctx.lineWidth=big?1.6:1;ctx.beginPath();ctx.moveTo(CX+Math.cos(t)*r1,CY+Math.sin(t)*r1);ctx.lineTo(CX+Math.cos(t)*r2,CY+Math.sin(t)*r2);ctx.stroke()}
      for(let a=0;a<360;a+=30){/* số đo tính từ pháp tuyến (đường thẳng đứng) */const t=(a-90)*D;const lab=a<=90?a:a<=180?180-a:a<=270?a-180:360-a;D2.text(ctx,`${lab}°`,CX+Math.cos(t)*(RR+2),CY+Math.sin(t)*(RR+2)+5,{s:14,w:700,c:P.mut,a:"center"})}
      /* khối bán trụ: nửa dưới */
      const med=S.m==="tt"?(K.day?"rgba(140,200,240,.45)":"rgba(130,190,255,.22)"):(K.day?"rgba(80,160,230,.35)":"rgba(70,150,255,.2)");ctx.fillStyle=med;ctx.beginPath();ctx.moveTo(CX-RR*.92,CY);ctx.arc(CX,CY,RR*.92,0,Math.PI);ctx.closePath();ctx.fill();
      ctx.strokeStyle=K.day?"rgba(30,90,150,.6)":"rgba(160,210,255,.6)";ctx.lineWidth=2;ctx.stroke();
      /* pháp tuyến và mặt phân cách */
      ctx.setLineDash([8,8]);ctx.strokeStyle=P.mut;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(CX,CY-RR-24);ctx.lineTo(CX,CY+RR+24);ctx.stroke();ctx.setLineDash([]);
      ctx.strokeStyle=P.ink;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(CX-RR-24,CY);ctx.lineTo(CX+RR+24,CY);ctx.stroke();
      /* tia sáng */
      const ray=(x1,y1,x2,y2,a,w)=>{if(a<.01)return;ctx.save();ctx.globalAlpha=Math.min(1,a);ctx.strokeStyle="rgba(255,60,60,.35)";ctx.lineWidth=(w||4)*2.6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle="#FF2D2D";ctx.lineWidth=w||4;ctx.stroke();
        const mx=(x1+x2)/2,my=(y1+y2)/2,an=Math.atan2(y2-y1,x2-x1);ctx.fillStyle="#FF2D2D";ctx.beginPath();ctx.moveTo(mx+Math.cos(an)*10,my+Math.sin(an)*10);ctx.lineTo(mx+Math.cos(an+2.5)*10,my+Math.sin(an+2.5)*10);ctx.lineTo(mx+Math.cos(an-2.5)*10,my+Math.sin(an-2.5)*10);ctx.fill();ctx.restore()};
      const L=RR*.92;
      if(v==="kx"){/* tới từ trên trái, khúc xạ xuống dưới phải, phản xạ lên trên phải */
        const sx=CX-Math.sin(c.i)*(RR+10),sy=CY-Math.cos(c.i)*(RR+10);ray(sx,sy,CX,CY,1,4);ray(CX,CY,CX+Math.sin(c.r)*L,CY+Math.cos(c.r)*L,1-c.Rf,4);ray(CX,CY,CX+Math.sin(c.i)*L,CY-Math.cos(c.i)*L,c.Rf*1.6+.05,3);
        laser(ctx,sx,sy,Math.atan2(CY-sy,CX-sx));
        arcA(ctx,-Math.PI/2,-Math.PI/2-c.i,62,"#FDE047",`i = ${fmt(S.i.kx,1)}°`,-1);arcA(ctx,Math.PI/2,Math.PI/2-c.r,82,"#86EFAC",`r = ${fmt(c.r/D,1)}°`,1)}
      else{/* tới từ dưới trái (trong bán trụ), ló ra trên phải hoặc phản xạ toàn phần xuống dưới phải */
        const sx=CX-Math.sin(c.i)*(RR+10),sy=CY+Math.cos(c.i)*(RR+10);ray(sx,sy,CX,CY,1,4);
        if(!c.tir)ray(CX,CY,CX+Math.sin(c.r)*(RR+10),CY-Math.cos(c.r)*(RR+10),1-c.Rf,4);ray(CX,CY,CX+Math.sin(c.i)*L,CY+Math.cos(c.i)*L,c.tir?1:c.Rf*1.4+.05,c.tir?4:3);
        laser(ctx,sx,sy,Math.atan2(CY-sy,CX-sx));
        arcA(ctx,Math.PI/2,Math.PI/2+c.i,62,"#FDE047",`i = ${fmt(S.i.tp,1)}°`,-1);if(!c.tir)arcA(ctx,-Math.PI/2,-Math.PI/2+c.r,82,"#86EFAC",`r = ${fmt(c.r/D,1)}°`,1);
        /* vạch góc tới hạn */
        const t=Math.PI/2+c.ic;ctx.save();ctx.setLineDash([3,6]);ctx.strokeStyle="#F59E0B";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(CX,CY);ctx.lineTo(CX+Math.cos(t)*RR,CY+Math.sin(t)*RR);ctx.stroke();ctx.restore();
        D2.text(ctx,`i_gh ≈ ${fmt(c.ic/D,1)}°`,CX+Math.cos(t)*120-10,CY+Math.sin(t)*120+6,{s:15,w:800,c:"#F59E0B",a:"right"})}
      const mn=`${MED[S.m].ten[0].toUpperCase()+MED[S.m].ten.slice(1)} (n = ${String(MED[S.m].n).replace(".",",")})`;
      D2.text(ctx,"Không khí",CX+RR*.55,CY-24,{s:17,w:800,c:P.ink,a:"center"});D2.text(ctx,mn,CX+RR*.55,CY+40,{s:17,w:800,c:P.ink,a:"center"})}
    function laser(ctx,x,y,ang){ctx.save();ctx.translate(x,y);ctx.rotate(ang);D2.block(ctx,-70,-12,64,24,6,"#374151","#111827",{stroke:"rgba(255,255,255,.2)"});ctx.fillStyle="#EF4444";ctx.fillRect(-8,-4,6,8);ctx.restore()}
    function arcA(ctx,a0,a1,r,col,txt,side){ctx.strokeStyle=col;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(CX,CY,r,Math.min(a0,a1),Math.max(a0,a1));ctx.stroke();const am=(a0+a1)/2;D2.text(ctx,txt,CX+Math.cos(am)*(r+46),CY+Math.sin(am)*(r+46)+6,{s:17,w:800,c:col,a:"center"})}
    K.drawFn(draw);
    K.label("Đèn laser",()=>{const v=K.view,i=S.i[v]*D;return[CX-Math.sin(i)*(RR+46),v==="kx"?CY-Math.cos(i)*(RR+46):CY+Math.cos(i)*(RR+46)]},{dir:"w",len:40});
    K.label("Pháp tuyến",[CX,CY-RR-20],{dir:"n",len:16});K.label("Khối bán trụ",[CX+RR*.62,CY+RR*.5],{dir:"se",len:40});
    /* kéo đèn quanh vòng tròn */
    K.pickFn((q,mode)=>{const d=Math.hypot(q[0]-CX,q[1]-CY);if(d>RR-30&&d<RR+90&&(K.view==="kx"?q[1]<CY:q[1]>CY)&&q[0]<CX)return{k:"laser",drag:true};return null});
    K.dragFn((ph,k,q)=>{if(!q)return;const v=K.view;const dx=CX-q[0],dy=v==="kx"?CY-q[1]:q[1]-CY;let a=Math.atan2(dx,dy)/D;a=C.clamp(Math.round(a*2)/2,0,89);S.i[v]=a;if(ph==="end")refresh();else K.updateInfo()});
    K.dockFn(()=>[{seg:Object.keys(MED).map(k=>({k:"m",v:k,label:MED[k].ten[0].toUpperCase()+MED[k].ten.slice(1),icon:"",on:S.m===k})),label:"Chất"},
      {grid:[{k:"di",v:"-5",label:"Góc tới −5°",icon:IC.minus},{k:"di",v:"5",label:"Góc tới +5°",icon:IC.plus},{k:"di",v:"-1",label:"−1°",icon:IC.minus},{k:"di",v:"1",label:"+1°",icon:IC.plus}]},
      "hr",{k:"rec",label:"Ghi số đo",icon:IC.pen}]);
    K.onDock((k,v)=>{if(k==="m")S.m=v;else if(k==="di"){const w=K.view;S.i[w]=C.clamp(S.i[w]+(+v),0,89)}
      else if(k==="rec"){const c=calc(),w=K.view;const it={mode:w,m:S.m,i:S.i[w],tir:c.tir};S.log.push(it);S.recs++;
        api.record({lan:String(S.recs),tn:w==="kx"?`Không khí → ${MED[S.m].ten}`:`${MED[S.m].ten[0].toUpperCase()+MED[S.m].ten.slice(1)} → không khí`,i:`${fmt(S.i[w],1)}°`,r:c.tir?"phản xạ toàn phần (không có tia khúc xạ)":`${fmt(c.r/D,1)}°`,ti:c.tir?"—":S.i[w]===0?"—":fmt(Math.sin(c.i)/Math.sin(c.r),2)})}
      refresh()});
    K.infoFn(()=>{const c=calc(),w=K.view;return `<div><b>${w==="kx"?`Không khí → ${MED[S.m].ten}`:`${MED[S.m].ten[0].toUpperCase()+MED[S.m].ten.slice(1)} → không khí`}</b></div><div>Góc tới i = ${fmt(S.i[w],1)}°</div>
      <div>${c.tir?"<b>Phản xạ toàn phần</b>: không có tia khúc xạ":`Góc khúc xạ r = ${fmt(c.r/D,1)}°`}</div>${!c.tir&&S.i[w]>0?`<div>sin i / sin r = ${fmt(Math.sin(c.i)/Math.sin(c.r),2)}</div>`:""}<div>Phần ánh sáng phản xạ: ${fmt(c.Rf*100,0)}%</div>${w==="tp"?`<small>Góc tới hạn i_gh ≈ ${fmt(c.ic/D,1)}°.</small>`:"<small>Kéo đèn laser để đổi góc tới.</small>"}`});
    K.timeLabel(()=>`Góc tới ${fmt(S.i[K.view],1)}°`);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const press=()=>{const b=document.querySelector('[data-k="rec"]');b&&b.click()};K.goView("kx");S.m="tt";[20,30,45,60].forEach(i=>{S.i.kx=i;press()});S.m="nuoc";[30,50].forEach(i=>{S.i.kx=i;press()});
        K.goView("tp");S.m="tt";S.i.tp=35;press();S.i.tp=50;press();refresh()}};
    return K.mount(st)}
});
})();
