/* K7-H-05 · Hóa trị và lập công thức hóa học (SGK KHTN 7 – Kết nối tri thức, Bài 7) · mô hình 2D
   Quy tắc hóa trị: trong hợp chất hai nguyên tố AₓBᵧ (A hóa trị a, B hóa trị b): a × x = b × y.
   Mô hình “móc nối”: mỗi nguyên tử (hoặc nhóm nguyên tử) có số móc bằng hóa trị; công thức đúng khi mọi móc đều được nối.
   1. Lập công thức: học sinh tăng/giảm số nguyên tử mỗi loại cho tới khi tất cả móc được nối, rồi rút gọn về tỉ lệ tối giản.
   2. Tính hóa trị: từ công thức đã biết, tìm hóa trị của nguyên tố chưa biết. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const ROMAN=["","I","II","III","IV","V","VI","VII"];
const SUBS="₀₁₂₃₄₅₆₇₈₉";const sub=n=>n===1?"":String(n).split("").map(d=>SUBS[+d]).join("");
const gcd=(a,b)=>b?gcd(b,a%b):a;
/* cặp lập công thức: A (hóa trị a) – B (hóa trị b); nhóm nguyên tử có ngoặc khi chỉ số > 1 */
const BUILD=[{a:"Al",va:3,b:"O",vb:2,ten:"aluminium oxide"},{a:"Ca",va:2,b:"Cl",vb:1,ten:"calcium chloride"},{a:"Na",va:1,b:"O",vb:2,ten:"sodium oxide"},
  {a:"C",va:4,b:"O",vb:2,ten:"carbon dioxide"},{a:"N",va:3,b:"H",vb:1,ten:"ammonia",rev:true},{a:"P",va:5,b:"O",vb:2,ten:"diphosphorus pentoxide"},
  {a:"Fe",va:3,b:"SO4",vb:2,ten:"iron(III) sulfate",grp:true},{a:"Ca",va:2,b:"OH",vb:1,ten:"calcium hydroxide",grp:true},{a:"Mg",va:2,b:"PO4",vb:3,ten:"magnesium phosphate",grp:true}];
const CALC=[{f:"Fe₂O₃",x:"Fe",nx:2,o:"O",vo:2,no:3,ans:3},{f:"SO₃",x:"S",nx:1,o:"O",vo:2,no:3,ans:6},{f:"NH₃",x:"N",nx:1,o:"H",vo:1,no:3,ans:3},{f:"CuO",x:"Cu",nx:1,o:"O",vo:2,no:1,ans:2},{f:"H₂S",x:"S",nx:1,o:"H",vo:1,no:2,ans:2},{f:"CO",x:"C",nx:1,o:"O",vo:2,no:1,ans:2}];
const GN=s=>s.replace(/(\d)/g,d=>SUBS[+d]);
const formula=(B,x,y)=>{const A=B.a+sub(x),Bp=B.grp&&y>1?`(${GN(B.b)})${sub(y)}`:GN(B.b)+sub(y);return B.rev?Bp.replace(/.*/,"")+A+Bp:A+Bp};
const fNH3=(B,x,y)=>B.rev?`${B.a}${sub(x)}${B.b}${sub(y)}`:formula(B,x,y);
const COLS={Al:"#94A3B8",O:"#EF4444",Ca:"#A3E635",Cl:"#22C55E",Na:"#8B5CF6",C:"#475569",N:"#3B82F6",H:"#E2E8F0",P:"#F97316",Fe:"#B45309",SO4:"#FACC15",OH:"#F472B6",Mg:"#2DD4BF",PO4:"#FB923C",S:"#EAB308",Cu:"#C2410C"};

const SPEC={
  predict:[{id:"p1",q:"Trong hợp chất, O có hóa trị II, Al có hóa trị III. Công thức hóa học của aluminium oxide là:",opts:[["ok","Al₂O₃"],["ao","AlO"],["a3","Al₃O₂"]],ans:"ok",res:"Kết quả: III × 2 = II × 3 = 6 → Al₂O₃."},
    {id:"p2",q:"Hóa trị của S trong SO₃ (O hóa trị II) là:",opts:[["6","VI"],["3","III"],["2","II"]],ans:"6",res:"Kết quả: a × 1 = II × 3 → a = 6 (VI)."}],
  taskLead:"Phần “Lập công thức”: tăng/giảm số nguyên tử cho tới khi mọi móc đều được nối. Phần “Tính hóa trị”: chọn hóa trị đúng.",
  tasks:[{html:"<b>Lập công thức</b> đúng cho ít nhất 6 chất.",done:()=>Object.keys(S.bdone).length>=6},{html:"<b>Tính hóa trị</b> đúng cho ít nhất 4 chất.",done:()=>Object.keys(S.cdone).length>=4}],
  obs:[{id:"a",q:"Hóa trị của một nguyên tố là:",opts:[["ok","Con số biểu thị khả năng liên kết của nguyên tử nguyên tố đó với nguyên tử khác"],["kl","Khối lượng của nguyên tử"],["p","Số proton"]],ans:"ok",why:"Hóa trị của H được quy ước là I, của O là II."},
    {id:"b",q:"Theo quy tắc hóa trị, với hợp chất AₓBᵧ:",opts:[["ok","a × x = b × y"],["c","a + x = b + y"],["d","a × y = b × x luôn đúng"]],ans:"ok",why:"Tích chỉ số và hóa trị của nguyên tố này bằng tích chỉ số và hóa trị của nguyên tố kia."},
    {id:"c",q:"Khi lập công thức, nếu nhóm nguyên tử có chỉ số lớn hơn 1 thì:",opts:[["ok","Đặt nhóm trong dấu ngoặc đơn, chỉ số ghi ngoài ngoặc"],["k","Viết chỉ số vào giữa nhóm"],["b","Bỏ chỉ số"]],ans:"ok",why:"Ví dụ: Fe₂(SO₄)₃, Ca(OH)₂."}],
  concl:{html:`<ul class="tlist"><li><b>Hóa trị</b> của một nguyên tố trong hợp chất cộng hóa trị là số liên kết mà nguyên tử đó tạo được; hóa trị của H là I, của O là II. Hóa trị ghi bằng số La Mã.</li>
    <li><b>Quy tắc hóa trị</b>: trong hợp chất AₓBᵧ, a × x = b × y (a, b là hóa trị của A, B).</li>
    <li><b>Lập công thức</b>: viết AₓBᵧ → áp dụng quy tắc hóa trị → x : y = b : a, rút gọn về tỉ lệ số nguyên tối giản.</li>
    <li>Công thức hóa học cho biết: nguyên tố tạo nên chất, số nguyên tử mỗi nguyên tố trong một phân tử, khối lượng phân tử.</li></ul>`,
    quiz:[{id:"q1",q:"Công thức hóa học của hợp chất tạo bởi Ba (II) và nhóm NO₃ (I) là:",opts:[["a","Ba(NO₃)₂"],["b","BaNO₃"],["c","Ba₂NO₃"]],ans:"a",why:{b:"II × 1 ≠ I × 1.",c:"Chỉ số đặt sai nguyên tố."}},
      {id:"q2",q:"Trong hợp chất P₂O₅, hóa trị của P là:",opts:[["a","V"],["b","II"],["c","III"]],ans:"a",why:{b:"a × 2 = II × 5 → a = 5.",c:"a × 2 = II × 5 → a = 5."}}],
    done:`<h2>Hoàn thành: hóa trị và công thức hóa học</h2><p class="muted">a × x = b × y; x : y = b : a (tối giản).</p>`},
  gv:["Cho học sinh tự dự đoán số nguyên tử trước khi bấm, sau đó kiểm tra bằng móc nối.","Lưu ý trường hợp rút gọn: C (IV) và O (II) → C₂O₄ rút gọn thành CO₂.","Mở rộng: một nguyên tố có thể có nhiều hóa trị (Fe II, III; S II, IV, VI)."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 7)</p><ul class="tlist"><li>Trình bày được khái niệm về hóa trị (cho chất cộng hóa trị); cách viết công thức hóa học; viết được công thức hóa học của một số đơn chất và hợp chất đơn giản thông dụng; nêu được mối liên hệ giữa hóa trị của nguyên tố với công thức hóa học.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài và bảng hóa trị: SGK KHTN 7 (Kết nối tri thức), Bài 7 Hóa trị và công thức hóa học.</li>
<li>Tên gọi theo Chương trình GDPT 2018 môn Hóa học.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>“Móc nối” là cách biểu diễn trực quan quy tắc hóa trị, không phải hình dạng thật của phân tử. Với hợp chất ion (ví dụ CaCl₂), mô hình chỉ dùng để lập công thức theo quy tắc hóa trị như SGK.</li></ul>`;

let S;
LabKHTN.register("K7-H-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"vd",t:"Bài toán"},{k:"cach",t:"Cách làm"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô hình hóa trị và lập công thức hóa học",views:{lap:{label:"Lập công thức",icon:IC.dna,frame:[40,40,920,560]},tinh:{label:"Tính hóa trị",icon:IC.grid,frame:[40,40,920,560]}}});
    S={bi:0,x:1,y:1,bdone:{},ci:0,cdone:{},recs:0};
    const rec=(vd,cach,kq)=>{S.recs++;api.record({lan:String(S.recs),vd,cach,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const HI=()=>K.day?"#B45309":"#FCD34D",OK=()=>K.day?"#047857":"#6EE7B7";
    /* nguyên tử có móc */
    function unit(ctx,x,y,lbl,col,v,hooks,dir){const grp=lbl.length>2;const w=grp?60:40;ctx.save();
      const pts=[];for(let i=0;i<v;i++){const a=(v===1?0:(i/(v-1)-.5)*1.6)+(dir<0?Math.PI:0);pts.push([x+Math.cos(a)*(w/2+20),y+Math.sin(a)*(w/2+20)])}
      ctx.strokeStyle="#CBD5E1";ctx.lineWidth=3;ctx.lineCap="round";pts.forEach(p=>{ctx.beginPath();ctx.moveTo(x+(p[0]-x)*.55,y+(p[1]-y)*.55);ctx.lineTo(p[0],p[1]);ctx.stroke()});
      const g=ctx.createRadialGradient(x-8,y-8,3,x,y,w/2+4);g.addColorStop(0,C.mix(col,"#FFFFFF",.45));g.addColorStop(1,C.mix(col,"#000000",.3));ctx.fillStyle=g;
      if(grp){C.rr(ctx,x-w/2,y-20,w,40,14);ctx.fill()}else{ctx.beginPath();ctx.arc(x,y,20,0,6.283);ctx.fill()}
      T(ctx,GN(lbl),x,y+6,grp?15:16,["H","Ca","SO4","Mg"].includes(lbl)?"#0B1330":"#fff");ctx.restore();for(const p of pts)hooks.push(p)}
    function drawLap(ctx,P){const B=BUILD[S.bi],x=S.x,y=S.y;
      D2.block(ctx,60,60,880,58,12,P.card,P.card,{stroke:P.line,shadow:false});
      T(ctx,`${B.a} (hóa trị ${ROMAN[B.va]}) và ${GN(B.b)} (hóa trị ${ROMAN[B.vb]})`,80,95,17,P.ink,"left");T(ctx,B.ten,920,95,14,P.mut,"right",700);
      const hA=[],hB=[];const cy=300,gap=88;
      for(let i=0;i<x;i++)unit(ctx,330,cy+(i-(x-1)/2)*gap,B.a,COLS[B.a]||"#888",B.va,hA,1);
      for(let j=0;j<y;j++)unit(ctx,670,cy+(j-(y-1)/2)*gap,B.b,COLS[B.b]||"#888",B.vb,hB,-1);
      const n=Math.min(hA.length,hB.length);const ord=a=>a.map((p,i)=>[p,i]).sort((u,v)=>u[0][1]-v[0][1]).map(q=>q[0]);const A2=ord(hA),B2=ord(hB);
      ctx.strokeStyle=OK();ctx.lineWidth=2.5;for(let i=0;i<n;i++){ctx.beginPath();ctx.moveTo(A2[i][0],A2[i][1]);ctx.bezierCurveTo(500,A2[i][1],500,B2[i][1],B2[i][0],B2[i][1]);ctx.stroke()}
      ctx.fillStyle="#F87171";for(let i=n;i<A2.length;i++){ctx.beginPath();ctx.arc(A2[i][0],A2[i][1],6,0,6.283);ctx.fill()}for(let i=n;i<B2.length;i++){ctx.beginPath();ctx.arc(B2[i][0],B2[i][1],6,0,6.283);ctx.fill()}
      const ok=x*B.va===y*B.vb,g=gcd(x,y);
      T(ctx,`${ROMAN[B.va]} × ${x} = ${B.va*x}`,330,540,17,ok?OK():P.ink);T(ctx,`${ROMAN[B.vb]} × ${y} = ${B.vb*y}`,670,540,17,ok?OK():P.ink);T(ctx,ok?"=":"≠",500,540,22,ok?OK():"#F87171");
      T(ctx,ok?(g>1?`Mọi móc đã nối, nhưng ${x} : ${y} chưa tối giản → rút gọn`:`Công thức: ${fNH3(B,x,y)}`):`Còn ${Math.abs(B.va*x-B.vb*y)} móc chưa nối (chấm đỏ)`,500,585,ok&&g===1?20:15,ok?(g>1?HI():OK()):"#F87171")}
    function drawTinh(ctx,P){const Q=CALC[S.ci];const done=S.cdone[S.ci];
      D2.block(ctx,60,60,880,58,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,`Tính hóa trị của ${Q.x} trong ${Q.f}`,80,95,17,P.ink,"left");T(ctx,`${Q.o} có hóa trị ${ROMAN[Q.vo]}`,920,95,14,P.mut,"right",700);
      const hA=[],hB=[];const cy=300,gap=88;const va=done?Q.ans:0;
      for(let i=0;i<Q.nx;i++)unit(ctx,330,cy+(i-(Q.nx-1)/2)*gap,Q.x,COLS[Q.x]||"#888",va,hA,1);for(let j=0;j<Q.no;j++)unit(ctx,670,cy+(j-(Q.no-1)/2)*gap,Q.o,COLS[Q.o]||"#888",Q.vo,hB,-1);
      if(done){const ord=a=>a.map((p,i)=>[p,i]).sort((u,v)=>u[0][1]-v[0][1]).map(q=>q[0]);const A2=ord(hA),B2=ord(hB);ctx.strokeStyle=OK();ctx.lineWidth=2.5;for(let i=0;i<Math.min(A2.length,B2.length);i++){ctx.beginPath();ctx.moveTo(A2[i][0],A2[i][1]);ctx.bezierCurveTo(500,A2[i][1],500,B2[i][1],B2[i][0],B2[i][1]);ctx.stroke()}}
      T(ctx,`a × ${Q.nx} = ${ROMAN[Q.vo]} × ${Q.no}  →  a = ${done?Q.ans:"?"}`,500,550,19,done?OK():P.ink);T(ctx,done?`Hóa trị của ${Q.x} trong ${Q.f} là ${ROMAN[Q.ans]}`:"Chọn hóa trị ở khay",500,585,15,done?OK():P.mut)}
    K.drawFn((ctx,P)=>K.view==="lap"?drawLap(ctx,P):drawTinh(ctx,P));
    K.label("Móc liên kết (số móc = hóa trị)",()=>K.view==="lap"?[330+40,300-(S.x-1)/2*88-18]:[-99,-99],{view:"lap",dir:"n",len:40});
    function checkBuild(){const B=BUILD[S.bi],x=S.x,y=S.y;if(x*B.va===y*B.vb&&gcd(x,y)===1&&!S.bdone[S.bi]){S.bdone[S.bi]=1;
      rec(`${B.a} (${ROMAN[B.va]}) với ${GN(B.b)} (${ROMAN[B.vb]})`,`${ROMAN[B.va]} × x = ${ROMAN[B.vb]} × y → x : y = ${B.vb/gcd(B.va,B.vb)} : ${B.va/gcd(B.va,B.vb)}`,fNH3(B,x,y))}}
    K.dockFn(()=>{if(K.view==="lap"){const B=BUILD[S.bi];return[{grid:BUILD.map((b,i)=>({k:"bi",v:String(i),label:`${b.a} – ${GN(b.b)}`,icon:"",on:i===S.bi}))},
        {grid:[{k:"x",v:"-1",label:`Bớt ${B.a}`,icon:IC.minus,dis:S.x<=1},{k:"x",v:"1",label:`Thêm ${B.a}`,icon:IC.plus,dis:S.x>=5},{k:"y",v:"-1",label:`Bớt ${GN(B.b)}`,icon:IC.minus,dis:S.y<=1},{k:"y",v:"1",label:`Thêm ${GN(B.b)}`,icon:IC.plus,dis:S.y>=5}]}]}
      return[{grid:CALC.map((q,i)=>({k:"ci",v:String(i),label:q.f,icon:"",on:i===S.ci}))},{grid:[1,2,3,4,5,6].map(v=>({k:"va",v:String(v),label:ROMAN[v],icon:"",dis:!!S.cdone[S.ci]}))}]});
    K.onDock((k,v)=>{if(k==="bi"){S.bi=+v;S.x=1;S.y=1}else if(k==="x"){S.x=C.clamp(S.x+(+v),1,5);checkBuild()}else if(k==="y"){S.y=C.clamp(S.y+(+v),1,5);checkBuild()}
      else if(k==="ci")S.ci=+v;else if(k==="va"){const Q=CALC[S.ci];if(+v===Q.ans){S.cdone[S.ci]=1;rec(`Hóa trị của ${Q.x} trong ${Q.f}`,`a × ${Q.nx} = ${ROMAN[Q.vo]} × ${Q.no}`,`${Q.x} hóa trị ${ROMAN[Q.ans]}`)}else api.toast(`a × ${Q.nx} = ${Q.vo} × ${Q.no} = ${Q.vo*Q.no} → a = ${Q.vo*Q.no}/${Q.nx}.`,"warn",2400)}refresh()});
    K.infoFn(()=>K.view==="lap"?`<div><b>Quy tắc hóa trị</b>: a × x = b × y</div><div>Đã lập đúng: ${Object.keys(S.bdone).length}/${BUILD.length}</div><small>Mỗi nguyên tử có số móc bằng hóa trị; công thức đúng khi không còn móc thừa và tỉ lệ đã tối giản.</small>`
      :`<div><b>Tính hóa trị</b></div><div>Đã tính đúng: ${Object.keys(S.cdone).length}/${CALC.length}</div><small>Dựa vào hóa trị đã biết của nguyên tố kia (H: I, O: II).</small>`);
    K.timeLabel(()=>K.views[K.view].label);
    /* thao tác tay: chạm chỗ trống dưới cột để thêm nguyên tử (nhóm nguyên tử); chạm vào một nguyên tử để bớt */
    K.pickFn((q,mode)=>{if(K.view!=="lap"||mode!=="tap")return null;const cy=300,gap=88;for(const [col,n,k] of [[330,S.x,"x"],[670,S.y,"y"]])for(let i=0;i<n;i++){const yy=cy+(i-(n-1)/2)*gap;if(Math.hypot(q[0]-col,q[1]-yy)<34&&n>1)return{k,v:"-1"}}return null});
    K.tapFn(o=>{if(o&&o.k)K._dockH(o.k,o.v)});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>{if(K.view!=="lap")return[];const B=BUILD[S.bi],cy=300,gap=88;return[[330,S.x,"x",B.a],[670,S.y,"y",B.b]].filter(a=>a[1]<5).map(([col,n,k,l])=>({k,v:"1",p:[col,cy+((n-1)/2)*gap+gap*.75],tip:"Chạm để thêm 1 "+GN(l),view:"lap"}))});
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(let i=0;i<BUILD.length;i++){K._dockH("bi",String(i));const B=BUILD[i],g=gcd(B.va,B.vb);S.x=B.vb/g;S.y=B.va/g;checkBuild()}for(let i=0;i<CALC.length;i++){K._dockH("ci",String(i));K._dockH("va",String(CALC[i].ans))}}};
    return K.mount(st)}
});
})();
