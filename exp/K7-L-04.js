/* K7-L-04 · Định luật phản xạ ánh sáng; ảnh của vật tạo bởi gương phẳng (SGK KHTN 7 – Kết nối tri thức, Bài 16–17) · 2D
   1. Tia sáng từ đèn laser chiếu tới gương phẳng đặt trên bảng có chia độ: tia phản xạ nằm trong mặt phẳng tới, góc phản xạ bằng góc tới (r = i).
      Học sinh kéo đèn laser (hoặc chọn góc) và ghi góc tới, góc phản xạ.
   2. Ảnh của ngọn nến qua tấm kính (gương phẳng): ảnh ảo, lớn bằng vật, khoảng cách từ ảnh tới gương bằng khoảng cách từ vật tới gương.
      Các tia phản xạ tới mắt có đường kéo dài (nét đứt) đi qua ảnh. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt,D=Math.PI/180;
const SPEC={
  predict:[{id:"p1",q:"Chiếu tia sáng tới gương phẳng với góc tới 40°. Góc phản xạ bằng:",opts:[["40","40°"],["50","50°"],["80","80°"]],ans:"40",res:"Kết quả: góc phản xạ luôn bằng góc tới."},
    {id:"p2",q:"Đặt cây nến cách gương phẳng 20 cm. Ảnh của nến cách gương:",opts:[["20","20 cm"],["40","40 cm"],["10","10 cm"]],ans:"20",res:"Kết quả: ảnh và vật đối xứng nhau qua gương."}],
  taskLead:"Phần “Phản xạ”: kéo đèn laser trên vòng chia độ hoặc chọn góc ở khay, bấm “Ghi kết quả”. Phần “Ảnh qua gương”: kéo ngọn nến tới các vị trí khác nhau.",
  tasks:[{html:"<b>Định luật phản xạ:</b> ghi góc tới và góc phản xạ ở ít nhất 3 góc tới khác nhau.",done:()=>new Set(S.log.map(r=>r.i)).size>=3},
    {html:"<b>Ảnh qua gương:</b> ghi khoảng cách vật – gương và ảnh – gương ở ít nhất 3 vị trí.",done:()=>new Set(S.img.map(r=>r.d)).size>=3}],
  obs:[{id:"a",q:"Góc tới là góc hợp bởi:",opts:[["ok","Tia tới và pháp tuyến tại điểm tới"],["g","Tia tới và mặt gương"],["pr","Tia tới và tia phản xạ"]],ans:"ok",why:"Pháp tuyến là đường vuông góc với mặt gương tại điểm tới."},
    {id:"b",q:"Ảnh của vật tạo bởi gương phẳng:",opts:[["ok","Là ảnh ảo, không hứng được trên màn, lớn bằng vật"],["that","Là ảnh thật, hứng được trên màn"],["nho","Nhỏ hơn vật"]],ans:"ok",why:"Ảnh ảo nằm ở giao điểm đường kéo dài của các tia phản xạ."},
    {id:"c",q:"Khi chiếu tia tới vuông góc với mặt gương (i = 0°), tia phản xạ:",opts:[["ok","Bật ngược trở lại theo phương cũ"],["k","Song song với mặt gương"],["mat","Biến mất"]],ans:"ok",why:"r = i = 0°."}],
  concl:{html:`<ul class="tlist"><li><b>Định luật phản xạ ánh sáng</b>: tia phản xạ nằm trong mặt phẳng chứa tia tới và pháp tuyến của gương tại điểm tới; góc phản xạ bằng góc tới (r = i).</li>
    <li><b>Ảnh của vật tạo bởi gương phẳng</b>: là ảnh ảo, không hứng được trên màn chắn, lớn bằng vật; khoảng cách từ ảnh tới gương bằng khoảng cách từ vật tới gương (ảnh và vật đối xứng qua gương).</li>
    <li>Ta nhìn thấy ảnh vì các tia phản xạ lọt vào mắt có đường kéo dài đi qua ảnh.</li></ul>`,
    quiz:[{id:"q1",q:"Tia tới hợp với mặt gương một góc 30°. Góc phản xạ bằng:",opts:[["a","60°"],["b","30°"],["c","120°"]],ans:"a",why:{b:"30° là góc giữa tia tới và mặt gương; góc tới i = 90° − 30° = 60°.",c:"Góc phản xạ không lớn hơn 90°."}},
      {id:"q2",q:"Một người đứng cách gương phẳng 1,5 m. Khoảng cách từ người đó tới ảnh của mình là:",opts:[["a","3 m"],["b","1,5 m"],["c","0,75 m"]],ans:"a",why:{b:"1,5 m là khoảng cách ảnh – gương; người – ảnh là 1,5 + 1,5.",c:"Ảnh không nằm giữa người và gương."}}],
    done:`<h2>Hoàn thành: phản xạ ánh sáng, ảnh qua gương phẳng</h2><p class="muted">r = i; ảnh ảo, lớn bằng vật, đối xứng với vật qua gương.</p>`},
  gv:["Cho học sinh tự đo góc trên vòng chia độ trước khi đọc số liệu.","Hỏi: vì sao ảnh trong gương không hứng được trên màn?","Liên hệ: kính chiếu hậu, kính tiềm vọng."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 16, 17)</p><ul class="tlist"><li>Thực hiện thí nghiệm rút ra định luật phản xạ ánh sáng; vận dụng định luật vẽ hình tia phản xạ; nêu được tính chất ảnh của vật qua gương phẳng; dựng được ảnh của một vật tạo bởi gương phẳng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 16 Sự phản xạ ánh sáng; Bài 17 Ảnh của vật qua gương phẳng.</li>
<li>Định luật phản xạ, ảnh qua gương phẳng: <a href="https://openstax.org/books/physics/pages/16-1-reflection" target="_blank" rel="noopener">OpenStax Physics, mục 16.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Gương phẳng lí tưởng (phản xạ toàn bộ); bỏ qua bề dày tấm kính ở phần 2.</li></ul>`;

let S;
LabKHTN.register("K7-L-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"a",t:"Đại lượng 1"},{k:"b",t:"Đại lượng 2"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng định luật phản xạ và ảnh qua gương phẳng",views:{px:{label:"Phản xạ",icon:IC.eye,frame:[40,40,920,560]},anh:{label:"Ảnh qua gương",icon:IC.swap,frame:[40,40,920,560]}}});
    S={i:40,log:[],ox:-230,oy:0,img:[],recs:0};
    const rec=(tn,a,b)=>{S.recs++;api.record({lan:String(S.recs),tn,a,b})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const HI=()=>K.day?"#B45309":"#FCD34D";
    /* ---------- phản xạ ---------- */
    const CX=500,CY=470,RR=330;
    function beam(ctx,x1,y1,x2,y2,arrow){ctx.save();ctx.strokeStyle="rgba(239,68,68,.35)";ctx.lineWidth=9;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle="#EF4444";ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
      if(arrow){const mx=(x1+x2)/2,my=(y1+y2)/2,a=Math.atan2(y2-y1,x2-x1);ctx.fillStyle="#EF4444";ctx.beginPath();ctx.moveTo(mx+Math.cos(a)*10,my+Math.sin(a)*10);ctx.lineTo(mx+Math.cos(a+2.6)*10,my+Math.sin(a+2.6)*10);ctx.lineTo(mx+Math.cos(a-2.6)*10,my+Math.sin(a-2.6)*10);ctx.closePath();ctx.fill()}ctx.restore()}
    function drawPx(ctx,P){const i=S.i*D;
      /* bảng chia độ */
      ctx.fillStyle=K.day?"#FFFFFF":"#1A2350";ctx.beginPath();ctx.arc(CX,CY,RR+18,Math.PI,0);ctx.closePath();ctx.fill();ctx.strokeStyle=P.line;ctx.lineWidth=1.5;ctx.stroke();
      for(let a=0;a<=180;a++){const t=Math.PI+a*D;const L=a%10===0?16:a%5===0?10:5;ctx.strokeStyle=a%10===0?P.ink:P.mut;ctx.lineWidth=a%10===0?1.5:1;ctx.beginPath();ctx.moveTo(CX+Math.cos(t)*RR,CY+Math.sin(t)*RR);ctx.lineTo(CX+Math.cos(t)*(RR-L),CY+Math.sin(t)*(RR-L));ctx.stroke();
        if(a%10===0){const v=Math.abs(90-a);T(ctx,String(v),CX+Math.cos(t)*(RR-30),CY+Math.sin(t)*(RR-30)+4,12,P.mut,"center",700)}}
      /* gương */
      ctx.fillStyle="#BFDBFE";ctx.fillRect(CX-260,CY,520,10);ctx.fillStyle="#475569";for(let x=CX-260;x<CX+260;x+=12){ctx.fillRect(x,CY+10,8,4)}T(ctx,"Gương phẳng",CX+270,CY+8,13,P.mut,"left",700);
      /* pháp tuyến */
      ctx.save();ctx.setLineDash([8,6]);ctx.strokeStyle=P.mut;ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(CX,CY);ctx.lineTo(CX,CY-RR-10);ctx.stroke();ctx.restore();T(ctx,"N (pháp tuyến)",CX,CY-RR-24,13,P.mut);
      /* tia tới, tia phản xạ */
      const sx=CX-Math.sin(i)*(RR-40),sy=CY-Math.cos(i)*(RR-40);const rx=CX+Math.sin(i)*(RR-40),ry=CY-Math.cos(i)*(RR-40);
      beam(ctx,sx,sy,CX,CY,true);beam(ctx,CX,CY,rx,ry,true);
      /* cung góc */
      ctx.lineWidth=3;ctx.strokeStyle="#60A5FA";ctx.beginPath();ctx.arc(CX,CY,80,-Math.PI/2-i,-Math.PI/2);ctx.stroke();ctx.strokeStyle="#34D399";ctx.beginPath();ctx.arc(CX,CY,96,-Math.PI/2,-Math.PI/2+i);ctx.stroke();
      T(ctx,`i = ${S.i}°`,CX-Math.sin(i/2)*120-12,CY-Math.cos(i/2)*120,16,"#60A5FA");T(ctx,`r = ${S.i}°`,CX+Math.sin(i/2)*130+12,CY-Math.cos(i/2)*130,16,"#34D399");
      /* đèn laser */
      ctx.save();ctx.translate(CX-Math.sin(i)*(RR-12),CY-Math.cos(i)*(RR-12));ctx.rotate(Math.PI/2-i);ctx.fillStyle="#1F2937";C.rr(ctx,-34,-11,62,22,6);ctx.fill();ctx.fillStyle="#EF4444";ctx.fillRect(26,-4,6,8);ctx.fillStyle="#9CA3AF";ctx.fillRect(-20,-11,6,22);ctx.restore();
      T(ctx,"S",sx-16,sy-6,15,P.ink);T(ctx,"I",CX+10,CY-8,15,P.ink);T(ctx,"R",rx+14,ry-6,15,P.ink)}
    /* ---------- ảnh qua gương ---------- */
    const MX=520,BASE=470;
    function candle(ctx,x,y,a,flick){ctx.save();ctx.globalAlpha=a;const g=ctx.createLinearGradient(x-14,0,x+14,0);g.addColorStop(0,"#E7D7B5");g.addColorStop(.5,"#FFF8E7");g.addColorStop(1,"#D8C5A0");ctx.fillStyle=g;ctx.fillRect(x-14,y-120,28,120);
      ctx.strokeStyle="#111";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y-120);ctx.lineTo(x,y-130);ctx.stroke();const fl=1+(flick?Math.sin(K.simT*13)*.06:0);
      const fg=ctx.createRadialGradient(x,y-142,2,x,y-142,22*fl);fg.addColorStop(0,"#FFFFFF");fg.addColorStop(.3,"#FDE047");fg.addColorStop(1,"rgba(249,115,22,0)");ctx.fillStyle=fg;ctx.beginPath();ctx.ellipse(x,y-145,9*fl,20*fl,0,0,6.283);ctx.fill();ctx.restore()}
    function drawAnh(ctx,P){const ox=MX+S.ox,oy=BASE+S.oy,ix=MX-S.ox;const d=-S.ox;
      /* bàn */
      ctx.fillStyle=K.day?"#E5E7EB":"#111a3a";ctx.fillRect(60,BASE,880,40);
      /* gương / tấm kính */
      ctx.fillStyle="rgba(147,197,253,.35)";ctx.fillRect(MX-4,120,8,BASE-120);ctx.strokeStyle="#93C5FD";ctx.lineWidth=2;ctx.strokeRect(MX-4,120,8,BASE-120);T(ctx,"Gương phẳng (tấm kính)",MX,108,13,"#93C5FD");
      candle(ctx,ox,oy,1,true);candle(ctx,ix,oy,.45,true);T(ctx,"Vật",ox,oy+28,14,P.ink);T(ctx,"Ảnh (ảo)",ix,oy+28,14,"#93C5FD");
      /* mắt */
      const ex=MX-330,ey=210;ctx.save();ctx.fillStyle="#F1F5F9";ctx.beginPath();ctx.ellipse(ex,ey,24,15,0,0,6.283);ctx.fill();ctx.fillStyle="#1E3A8A";ctx.beginPath();ctx.arc(ex+6,ey,7,0,6.283);ctx.fill();ctx.restore();T(ctx,"Mắt",ex,ey-20,13,P.mut);
      /* tia từ ngọn lửa tới gương rồi tới mắt; đường kéo dài nét đứt tới ảnh */
      const fy=oy-145;for(const dy of [-10,10]){const ey2=ey+dy;const hy=fy+(ey2-fy)*((MX-ox)/((MX-ox)+(MX-ex)));
        beam(ctx,ox,fy,MX,hy,true);beam(ctx,MX,hy,ex+18,ey2,true);ctx.save();ctx.setLineDash([6,6]);ctx.strokeStyle="rgba(239,68,68,.7)";ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(MX,hy);ctx.lineTo(ix,fy);ctx.stroke();ctx.restore()}
      /* thước đo khoảng cách */
      const ry=BASE+70;ctx.strokeStyle=P.mut;ctx.lineWidth=1.5;for(const [a,b] of [[ox,MX],[MX,ix]]){ctx.beginPath();ctx.moveTo(a,ry);ctx.lineTo(b,ry);ctx.stroke();ctx.beginPath();ctx.moveTo(a,ry-6);ctx.lineTo(a,ry+6);ctx.moveTo(b,ry-6);ctx.lineTo(b,ry+6);ctx.stroke()}
      const cm=v=>fmt(v/10,1);T(ctx,`${cm(d)} cm`,(ox+MX)/2,ry-8,15,HI());T(ctx,`${cm(d)} cm`,(ix+MX)/2,ry-8,15,"#93C5FD")}
    K.drawFn((ctx,P)=>K.view==="px"?drawPx(ctx,P):drawAnh(ctx,P));
    K.pickFn(q=>{if(K.view==="px"){const dx=q[0]-CX,dy=CY-q[1];if(dy>-10&&Math.hypot(dx,dy)>RR-90&&Math.hypot(dx,dy)<RR+40&&dx<0)return{drag:true,k:"laser"};return null}
      const ox=MX+S.ox,oy=BASE+S.oy;if(Math.abs(q[0]-ox)<30&&q[1]>oy-170&&q[1]<oy+10)return{drag:true,k:"candle"};return null});
    K.dragFn((ph,k,q)=>{if(!q)return;if(k.k==="laser"){const dx=q[0]-CX,dy=CY-q[1];S.i=Math.round(C.clamp(Math.atan2(-dx,Math.max(dy,0))/D,0,85))}
      else{S.ox=C.clamp(q[0]-MX,-400,-60)}if(ph==="end")refresh()});
    K.label("Đèn laser",()=>K.view==="px"?[CX-Math.sin(S.i*D)*(RR-12),CY-Math.cos(S.i*D)*(RR-12)-14]:[-99,-99],{view:"px",dir:"nw",len:24});
    K.label("Tia tới",()=>{const i=S.i*D;return[CX-Math.sin(i)*150,CY-Math.cos(i)*150]},{view:"px",dir:"w",len:40});
    K.label("Tia phản xạ",()=>{const i=S.i*D;return[CX+Math.sin(i)*170,CY-Math.cos(i)*170]},{view:"px",dir:"e",len:40});
    K.dockFn(()=>K.view==="px"?[{grid:[0,20,30,45,60,75].map(a=>({k:"i",v:String(a),label:`i = ${a}°`,icon:"",on:S.i===a}))},{k:"rec",label:"Ghi kết quả",icon:IC.pen}]
      :[{grid:[100,150,200,300].map(d=>({k:"d",v:String(d),label:`Vật cách gương ${d/10} cm`,icon:"",on:-S.ox===d}))},{k:"rec2",label:"Ghi kết quả",icon:IC.pen}]);
    K.onDock((k,v)=>{if(k==="i")S.i=+v;else if(k==="rec"){if(!S.log.some(r=>r.i===S.i)){S.log.push({i:S.i});rec("Phản xạ",`góc tới i = ${S.i}°`,`góc phản xạ r = ${S.i}°`)}else api.toast("Đã ghi góc này.","info",1400)}
      else if(k==="d")S.ox=-(+v);else if(k==="rec2"){const d=Math.round(-S.ox);if(!S.img.some(r=>r.d===d)){S.img.push({d});rec("Ảnh qua gương phẳng",`vật – gương: ${fmt(d/10,1)} cm`,`ảnh – gương: ${fmt(d/10,1)} cm; ảnh cao bằng vật`)}else api.toast("Đã ghi vị trí này.","info",1400)}refresh()});
    K.infoFn(()=>K.view==="px"?`<div><b>Góc tới i = ${S.i}°</b> · góc phản xạ r = ${S.i}°</div><small>Kéo đèn laser trên vòng chia độ. Đã ghi ${S.log.length} góc.</small>`
      :`<div><b>Vật cách gương ${fmt(-S.ox/10,1)} cm</b></div><div>Ảnh cách gương ${fmt(-S.ox/10,1)} cm</div><small>Kéo ngọn nến. Nét đứt: đường kéo dài của tia phản xạ đi qua ảnh.</small>`);
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const a of [20,45,60]){K._dockH("i",String(a));K._dockH("rec")}K.goView("anh");for(const d of [100,200,300]){K._dockH("d",String(d));K._dockH("rec2")}}};
    return K.mount(st)}
});
})();
