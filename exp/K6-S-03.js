/* K6-S-03 · Xây dựng khóa lưỡng phân (SGK KHTN 6 – Kết nối tri thức, Bài 23) · 2D
   Khóa lưỡng phân: ở mỗi bước, dựa vào một đặc điểm đối lập (có / không có) để chia nhóm sinh vật thành hai nhóm nhỏ, tiếp tục đến khi mỗi nhóm chỉ còn một sinh vật.
   1. Xây khóa: chọn nhóm còn nhiều hơn một sinh vật, chọn đặc điểm để chia đôi nhóm.
   2. Tra khóa: dùng khóa vừa xây để xác định tên một sinh vật bí ẩn bằng cách trả lời có / không ở từng bước. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const ORG=[{k:"cc",t:"Châu chấu"},{k:"ca",t:"Cá chép"},{k:"ech",t:"Ếch đồng"},{k:"tl",t:"Thằn lằn"},{k:"bc",t:"Chim bồ câu"},{k:"meo",t:"Mèo"}];
const TR=[{k:"xs",t:"Có xương sống",n:"Không có xương sống",v:{cc:0,ca:1,ech:1,tl:1,bc:1,meo:1}},
  {k:"canh",t:"Có cánh",n:"Không có cánh",v:{cc:1,ca:0,ech:0,tl:0,bc:1,meo:0}},
  {k:"vu",t:"Có lông vũ",n:"Không có lông vũ",v:{cc:0,ca:0,ech:0,tl:0,bc:1,meo:0}},
  {k:"mao",t:"Có lông mao",n:"Không có lông mao",v:{cc:0,ca:0,ech:0,tl:0,bc:0,meo:1}},
  {k:"vay",t:"Có vây, bơi trong nước",n:"Không có vây",v:{cc:0,ca:1,ech:0,tl:0,bc:0,meo:0}},
  {k:"vayda",t:"Cơ thể phủ vảy",n:"Cơ thể không phủ vảy",v:{cc:0,ca:1,ech:0,tl:1,bc:0,meo:0}},
  {k:"datran",t:"Da trần, luôn ẩm",n:"Da không trần",v:{cc:0,ca:0,ech:1,tl:0,bc:0,meo:0}},
  {k:"chan4",t:"Có 4 chân",n:"Không có 4 chân",v:{cc:0,ca:0,ech:1,tl:1,bc:0,meo:1}},
  {k:"chan6",t:"Có 6 chân",n:"Không có 6 chân",v:{cc:1,ca:0,ech:0,tl:0,bc:0,meo:0}},
  {k:"decon",t:"Đẻ con",n:"Đẻ trứng",v:{cc:0,ca:0,ech:0,tl:0,bc:0,meo:1}}];
const TRK=Object.fromEntries(TR.map(t=>[t.k,t])),ORK=Object.fromEntries(ORG.map(o=>[o.k,o]));
const SPEC={
  predict:[{id:"p1",q:"Mỗi bước của khóa lưỡng phân chia nhóm sinh vật thành:",opts:[["2","Hai nhóm, theo một đặc điểm đối lập"],["3","Ba nhóm"],["nhieu","Nhiều nhóm tùy ý"]],ans:"2",res:"Kết quả: “lưỡng phân” nghĩa là chia đôi; mỗi bước dùng một cặp đặc điểm đối lập (có / không có)."},
    {id:"p2",q:"Đặc điểm nào chia được nhóm {châu chấu, cá chép, ếch, thằn lằn, chim bồ câu, mèo} thành hai nhóm?",opts:[["xs","Có xương sống / không có xương sống"],["mat","Có mắt / không có mắt"],["song","Sống / không sống"]],ans:"xs",res:"Kết quả: châu chấu không có xương sống; năm loài còn lại có xương sống."}],
  taskLead:"Chọn một nhóm còn từ hai sinh vật trở lên, rồi chọn đặc điểm ở khay để chia đôi nhóm. Lặp lại đến khi mỗi nhóm chỉ còn một sinh vật.",
  tasks:[{html:"<b>Xây khóa:</b> chia đến khi mỗi nhóm chỉ còn một sinh vật.",done:()=>S.built},{html:"<b>Tra khóa:</b> dùng khóa xác định đúng 2 sinh vật bí ẩn.",done:()=>S.ok>=2}],
  obs:[{id:"a",q:"Vì sao không dùng đặc điểm “có mắt” để chia nhóm 6 sinh vật này?",opts:[["ok","Vì cả 6 loài đều có mắt, không chia được thành hai nhóm"],["kho","Vì khó quan sát"],["sai","Vì mắt không phải đặc điểm"]],ans:"ok",why:"Đặc điểm dùng trong khóa phải chia nhóm thành hai phần đều có sinh vật."},
    {id:"b",q:"Với 6 sinh vật, khóa lưỡng phân hoàn chỉnh cần bao nhiêu bước chia?",opts:[["5","5 bước"],["6","6 bước"],["3","3 bước"]],ans:"5",why:"Mỗi bước tách thêm một nhóm; từ 1 nhóm thành 6 nhóm cần 5 bước, dù chọn đặc điểm nào."},
    {id:"c",q:"Một nhóm sinh vật có thể có nhiều khóa lưỡng phân khác nhau không?",opts:[["co","Có, tùy đặc điểm chọn ở mỗi bước"],["khong","Không, chỉ có một khóa đúng"]],ans:"co",why:"Mọi khóa đều đúng nếu mỗi bước dùng đặc điểm đối lập rõ ràng và cuối cùng mỗi nhóm còn một sinh vật."}],
  concl:{html:`<ul class="tlist"><li><b>Khóa lưỡng phân</b> là cách phân chia sinh vật thành từng cặp nhóm dựa vào các đặc điểm đối lập (có / không có), đến khi xác định được tên từng sinh vật.</li>
    <li>Các bước xây dựng: xác định đặc điểm đặc trưng của từng sinh vật → chọn một đặc điểm để chia nhóm thành hai → tiếp tục chia mỗi nhóm nhỏ → đến khi mỗi nhóm chỉ còn một sinh vật.</li>
    <li>Dùng khóa: lần lượt trả lời từng cặp đặc điểm, đi theo nhánh đúng để tìm tên sinh vật.</li></ul>`,
    quiz:[{id:"q1",q:"Đặc điểm nào chia được nhóm {chim bồ câu, mèo} thành hai?",opts:[["a","Có lông vũ / không có lông vũ"],["b","Có xương sống / không có xương sống"],["c","Có đầu / không có đầu"]],ans:"a",why:{b:"Cả hai đều có xương sống.",c:"Cả hai đều có đầu."}},
      {id:"q2",q:"Trong khóa lưỡng phân, mỗi cặp đặc điểm phải:",opts:[["a","Đối lập nhau, dễ quan sát"],["b","Giống nhau"],["c","Ba lựa chọn trở lên"]],ans:"a",why:{b:"Đặc điểm giống nhau không chia được nhóm.",c:"Lưỡng phân là chia đôi."}}],
    done:`<h2>Hoàn thành: Khóa lưỡng phân</h2><p class="muted">Chia đôi nhóm theo đặc điểm đối lập đến khi mỗi nhóm còn một sinh vật.</p>`},
  gv:["Khuyến khích mỗi nhóm học sinh xây một khóa khác nhau rồi so sánh: tất cả đều đúng nếu mỗi bước chia đôi rõ ràng.","Đặc điểm nên quan sát được trực tiếp (lông, vảy, cánh, số chân), tránh đặc điểm mơ hồ (to / nhỏ, đẹp / xấu).","Mở rộng: cho học sinh xây khóa cho một nhóm lá cây hoặc đồ vật quen thuộc."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 23)</p><ul class="tlist"><li>Thông qua ví dụ, nhận biết được cách xây dựng khóa lưỡng phân và thực hành xây dựng được khóa lưỡng phân với đối tượng sinh vật.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 23 Thực hành xây dựng khóa lưỡng phân.</li><li>Đặc điểm sinh vật dùng ở mức hình thái dễ quan sát (xương sống, lông vũ, lông mao, vảy, vây, da trần, số chân, đẻ con hay đẻ trứng).</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Hình sinh vật là hình vẽ minh họa, không theo tỉ lệ.</li></ul>`;

/* ---------- hình vẽ sinh vật (vẽ trong khung khoảng 140 × 90, tâm tại gốc) ---------- */
function ell(g,x,y,rx,ry,r){g.beginPath();g.ellipse(x,y,rx,ry,r||0,0,6.283)}
function grad(g,x0,y0,x1,y1,a,b){const q=g.createLinearGradient(x0,y0,x1,y1);q.addColorStop(0,a);q.addColorStop(1,b);return q}
const DRAW={
  ca(g){g.fillStyle=grad(g,0,-30,0,30,"#F59E0B","#B45309");g.beginPath();g.moveTo(42,0);g.lineTo(66,-24);g.lineTo(60,0);g.lineTo(66,24);g.closePath();g.fill();
    g.beginPath();g.moveTo(-10,-24);g.quadraticCurveTo(8,-42,26,-22);g.closePath();g.fill();g.beginPath();g.moveTo(4,22);g.quadraticCurveTo(14,36,24,20);g.closePath();g.fill();
    g.fillStyle=grad(g,0,-28,0,28,"#FCD34D","#D97706");ell(g,0,0,48,24);g.fill();g.strokeStyle="rgba(120,53,15,.45)";g.lineWidth=1;
    for(let i=0;i<5;i++)for(let j=-1;j<=1;j++){g.beginPath();g.arc(-14+i*10,j*10,6,-1.2,1.2);g.stroke()}g.fillStyle="#FEF3C7";ell(g,-4,12,30,7);g.fill();
    g.strokeStyle="#92400E";g.lineWidth=1.4;g.beginPath();g.arc(-30,0,14,-.9,.9);g.stroke();g.fillStyle="#FFF";ell(g,-38,-6,5,5);g.fill();g.fillStyle="#111";ell(g,-39,-6,2.6,2.6);g.fill();g.beginPath();g.moveTo(-48,4);g.lineTo(-54,8);g.stroke()},
  ech(g){g.fillStyle="#3F6212";g.beginPath();g.moveTo(10,10);g.quadraticCurveTo(46,-6,48,22);g.quadraticCurveTo(30,30,14,26);g.fill();g.beginPath();g.moveTo(40,22);g.lineTo(62,30);g.lineTo(34,32);g.fill();
    g.fillStyle=grad(g,0,-26,0,26,"#84CC16","#4D7C0F");g.beginPath();g.moveTo(-40,4);g.quadraticCurveTo(-36,-22,-6,-20);g.quadraticCurveTo(30,-18,36,8);g.quadraticCurveTo(30,26,-4,24);g.quadraticCurveTo(-34,22,-40,4);g.fill();
    g.fillStyle="#65A30D";g.beginPath();g.moveTo(-18,18);g.lineTo(-24,32);g.lineTo(-10,32);g.lineTo(-12,20);g.fill();g.fillStyle="#3F6212";for(const [x,y,r] of [[0,-6,4],[14,-2,3],[-10,4,3],[22,8,3]]){ell(g,x,y,r,r*.8);g.fill()}
    g.fillStyle="#ECFCCB";ell(g,-14,16,18,6);g.fill();g.fillStyle="#A3E635";ell(g,-28,-18,8,7);g.fill();g.fillStyle="#FDE047";ell(g,-28,-19,5,5);g.fill();g.fillStyle="#111";ell(g,-28,-19,4,1.6);g.fill();
    g.strokeStyle="#365314";g.lineWidth=1.4;g.beginPath();g.moveTo(-40,4);g.quadraticCurveTo(-30,10,-18,6);g.stroke()},
  tl(g){g.strokeStyle="#57534E";g.lineWidth=3;for(const [x,y,a] of [[-24,6,-1],[-24,-6,1],[16,6,-1],[16,-6,1]]){g.beginPath();g.moveTo(x,y);g.lineTo(x+(a>0?-8:-8),y+a*-14);g.lineTo(x-4,y+a*-18);g.stroke()}
    g.fillStyle=grad(g,0,-12,0,12,"#A3A35A","#57532E");g.beginPath();g.moveTo(-58,0);g.quadraticCurveTo(-50,-10,-38,-7);g.quadraticCurveTo(-10,-12,22,-6);g.quadraticCurveTo(50,-2,74,4);g.quadraticCurveTo(48,6,22,8);g.quadraticCurveTo(-10,12,-38,7);g.quadraticCurveTo(-50,9,-58,0);g.fill();
    g.fillStyle="rgba(30,30,10,.35)";for(let i=0;i<9;i++){ell(g,-30+i*7,-2+(i%2)*3,2.4,1.6);g.fill()}g.strokeStyle="rgba(255,255,200,.35)";g.lineWidth=1;g.beginPath();g.moveTo(-36,-3);g.lineTo(30,-2);g.stroke();
    g.fillStyle="#111";ell(g,-48,-3,1.8,1.8);g.fill()},
  bc(g){g.fillStyle="#6B7280";g.beginPath();g.moveTo(26,-2);g.lineTo(60,-10);g.lineTo(58,8);g.closePath();g.fill();
    g.fillStyle=grad(g,0,-30,0,26,"#D1D5DB","#6B7280");g.beginPath();g.moveTo(-30,-12);g.quadraticCurveTo(-12,-24,20,-10);g.quadraticCurveTo(36,0,24,10);g.quadraticCurveTo(0,26,-22,14);g.quadraticCurveTo(-34,4,-30,-12);g.fill();
    g.fillStyle=grad(g,0,-20,0,10,"#9CA3AF","#4B5563");g.beginPath();g.moveTo(-14,-12);g.quadraticCurveTo(14,-20,40,-6);g.quadraticCurveTo(14,6,-8,2);g.closePath();g.fill();g.strokeStyle="#1F2937";g.lineWidth=2.2;g.beginPath();g.moveTo(2,-6);g.lineTo(14,-8);g.moveTo(6,0);g.lineTo(20,-2);g.stroke();
    g.fillStyle="#065F46";g.globalAlpha=.55;ell(g,-28,-14,9,8);g.fill();g.globalAlpha=1;g.fillStyle="#9CA3AF";ell(g,-36,-24,10,9);g.fill();g.fillStyle="#F97316";ell(g,-40,-26,2.2,2.2);g.fill();g.fillStyle="#111";ell(g,-40,-26,1.1,1.1);g.fill();
    g.fillStyle="#E5E7EB";g.beginPath();g.moveTo(-45,-26);g.lineTo(-54,-23);g.lineTo(-45,-21);g.fill();g.strokeStyle="#DB2777";g.lineWidth=2;g.beginPath();g.moveTo(-6,18);g.lineTo(-8,32);g.lineTo(-14,34);g.moveTo(2,18);g.lineTo(2,32);g.lineTo(-4,34);g.stroke()},
  meo(g){g.strokeStyle="#EA580C";g.lineWidth=8;g.lineCap="round";g.beginPath();g.moveTo(30,22);g.quadraticCurveTo(60,20,54,-10);g.stroke();g.lineCap="butt";
    g.fillStyle=grad(g,0,-30,0,34,"#FDBA74","#EA580C");g.beginPath();g.moveTo(-20,-6);g.quadraticCurveTo(10,-14,34,4);g.quadraticCurveTo(40,30,24,34);g.lineTo(-20,34);g.quadraticCurveTo(-30,14,-20,-6);g.fill();
    g.strokeStyle="#C2410C";g.lineWidth=2.5;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-2+i*9,-8+i);g.quadraticCurveTo(2+i*9,4,-1+i*9,14);g.stroke()}
    g.fillStyle="#F97316";g.beginPath();g.moveTo(-40,-26);g.lineTo(-36,-44);g.lineTo(-26,-32);g.lineTo(-16,-42);g.lineTo(-12,-24);g.quadraticCurveTo(-12,-6,-28,-6);g.quadraticCurveTo(-44,-8,-40,-26);g.fill();
    g.fillStyle="#FED7AA";g.beginPath();g.moveTo(-37,-36);g.lineTo(-35,-30);g.lineTo(-31,-33);g.fill();g.fillStyle="#FFF7ED";ell(g,-28,-14,9,6);g.fill();
    g.fillStyle="#84CC16";ell(g,-33,-24,3,3.4);g.fill();ell(g,-21,-24,3,3.4);g.fill();g.fillStyle="#111";ell(g,-33,-24,1,3);g.fill();ell(g,-21,-24,1,3);g.fill();g.fillStyle="#DB2777";ell(g,-27,-17,2,1.4);g.fill();
    g.strokeStyle="rgba(255,255,255,.8)";g.lineWidth=.8;for(const s of [-1,1])for(let i=0;i<3;i++){g.beginPath();g.moveTo(-27+s*5,-14);g.lineTo(-27+s*20,-17+i*4);g.stroke()}
    g.fillStyle="#FDBA74";ell(g,-14,32,8,4);g.fill();ell(g,4,32,8,4);g.fill()},
  cc(g){g.strokeStyle="#4D7C0F";g.lineWidth=3;g.beginPath();g.moveTo(14,2);g.lineTo(36,-22);g.lineTo(52,16);g.stroke();g.lineWidth=2;g.beginPath();g.moveTo(-6,6);g.lineTo(-10,20);g.lineTo(-4,24);g.moveTo(-18,6);g.lineTo(-26,18);g.lineTo(-22,22);g.stroke();
    g.fillStyle=grad(g,0,-12,0,12,"#A3E635","#4D7C0F");g.beginPath();g.moveTo(-40,-2);g.quadraticCurveTo(-36,-12,-22,-10);g.lineTo(40,-4);g.quadraticCurveTo(52,0,40,4);g.lineTo(-22,8);g.quadraticCurveTo(-38,8,-40,-2);g.fill();
    g.fillStyle="rgba(101,163,13,.75)";g.beginPath();g.moveTo(-14,-8);g.quadraticCurveTo(20,-16,50,-6);g.quadraticCurveTo(20,-2,-14,-4);g.fill();g.strokeStyle="#365314";g.lineWidth=.8;for(let i=0;i<6;i++){g.beginPath();g.moveTo(-8+i*9,-9);g.lineTo(-4+i*9,-5);g.stroke()}
    g.strokeStyle="#3F6212";g.lineWidth=4;g.beginPath();g.moveTo(10,0);g.lineTo(34,-24);g.stroke();g.fillStyle="#111";ell(g,-34,-5,2.6,3);g.fill();
    g.strokeStyle="#4D7C0F";g.lineWidth=1.2;g.beginPath();g.moveTo(-36,-9);g.quadraticCurveTo(-50,-36,-30,-44);g.moveTo(-34,-9);g.quadraticCurveTo(-42,-40,-20,-42);g.stroke()}};
function drawOrg(g,k,x,y,s){g.save();g.translate(x,y);g.scale(s,s);DRAW[k](g);g.restore()}

let S;
LabKHTN.register("K6-S-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"b",t:"Bước"},{k:"nh",t:"Nhóm được chia"},{k:"co",t:"Có đặc điểm"},{k:"kh",t:"Không có đặc điểm"}],empty:"Mỗi bước chia nhóm tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Xây dựng và sử dụng khóa lưỡng phân",views:{xay:{label:"Xây khóa",icon:IC.grid,frame:[20,20,960,600]},tra:{label:"Tra khóa",icon:IC.eye,frame:[20,20,960,600]}}});
    S={root:{id:0,o:ORG.map(o=>o.k)},nid:1,sel:0,msg:"",built:false,ok:0,quiz:null,steps:0,recs:0};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(g,t,x,y,s,c,a,w)=>D2.text(g,t,x,y,{s:s||14,w:w||700,c,a:a||"center"});
    const nodes=()=>{const L=[];(function f(n,d){n.d=d;L.push(n);if(n.y)f(n.y,d+1);if(n.n)f(n.n,d+1)})(S.root,0);return L};
    const byId=id=>nodes().find(n=>n.id===id);
    const leaves=n=>n.y?leaves(n.y).concat(leaves(n.n)):[n];
    function layout(){const L=leaves(S.root),NL=L.length;const X0=330,X1=975;L.forEach((n,i)=>{n.x=X0+(X1-X0)*(i+.5)/NL});
      (function f(n){if(n.y){f(n.y);f(n.n);n.x=(n.y.x+n.n.x)/2}})(S.root);const maxD=Math.max(...nodes().map(n=>n.d));const dy=Math.min(118,470/Math.max(1,maxD));nodes().forEach(n=>n.yy=60+n.d*dy)}
    function boxOf(n){const one=n.o.length===1;const w=one?96:Math.min(150,24+n.o.length*30),h=one?78:48;return[n.x-w/2,n.yy-h/2,w,h]}
    /* ---------- vẽ ---------- */
    K.drawFn((g,P)=>{const v=K.view;layout();
      /* cột trái: thẻ sinh vật */
      g.fillStyle=P.card;C.rr(g,20,20,290,600,16);g.fill();T(g,"Các sinh vật cần phân loại",165,46,15,P.ink);
      const active=v==="tra"&&S.quiz&&!S.quiz.done;
      if(active){g.fillStyle=K.day?"#FEF9C3":"rgba(250,204,21,.12)";C.rr(g,40,90,250,300,14);g.fill();drawOrg(g,S.quiz.org,165,230,1.9);T(g,"Sinh vật bí ẩn",165,360,16,P.ink);T(g,"Quan sát hình để trả lời",165,420,13,P.mut)}
      else ORG.forEach((o,i)=>{const cx=20+75+(i%2)*145,cy=118+Math.floor(i/2)*180;g.fillStyle=K.day?"#F8FAFC":"rgba(255,255,255,.06)";C.rr(g,cx-66,cy-62,132,150,12);g.fill();drawOrg(g,o.k,cx,cy,.95);T(g,o.t,cx,cy+72,14,P.ink)});
      /* cây khóa */
      const L=nodes();g.lineWidth=2;
      for(const n of L)if(n.y){const [bx,by,bw,bh]=boxOf(n);for(const [c,lab,col] of [[n.y,"Có","#22C55E"],[n.n,"Không","#F97316"]]){const [cx,cy,cw,ch]=boxOf(c);g.strokeStyle=col;g.beginPath();g.moveTo(n.x,by+bh);g.lineTo(n.x,by+bh+10);g.lineTo(c.x,by+bh+10);g.lineTo(c.x,cy);g.stroke();
          const tl=lab==="Có"?TRK[n.tr].t:TRK[n.tr].n;g.font="700 11px system-ui";const tw=Math.min(150,g.measureText(tl).width+14);const mx=c.x,my=(by+bh+10+cy)/2+4;g.fillStyle=K.day?"#FFFFFF":"#0F172A";C.rr(g,mx-tw/2,my-11,tw,20,8);g.fill();g.strokeStyle=col;g.lineWidth=1.2;C.rr(g,mx-tw/2,my-11,tw,20,8);g.stroke();g.lineWidth=2;T(g,tl,mx,my+3,11,col,"center",700)}}
      const path=v==="tra"&&S.quiz?S.quiz.path:[];
      for(const n of L){const [x,y,w,h]=boxOf(n);const one=n.o.length===1,sel=v==="xay"&&S.sel===n.id&&!one;const cur=v==="tra"&&S.quiz&&S.quiz.at===n.id;const onP=path.includes(n.id);
        g.fillStyle=one?(K.day?"#ECFDF5":"rgba(34,197,94,.14)"):(K.day?"#EFF6FF":"rgba(59,130,246,.14)");C.rr(g,x,y,w,h,10);g.fill();g.strokeStyle=cur?"#FACC15":sel?"#FACC15":onP?"#A78BFA":one?"#22C55E":"#3B82F6";g.lineWidth=cur||sel?3.5:1.6;C.rr(g,x,y,w,h,10);g.stroke();
        if(one){const k=n.o[0];if(!active)drawOrg(g,k,n.x,y+30,.42);T(g,ORK[k].t,n.x,active?n.yy+4:y+h-8,active?13:11,P.ink)}
        else{if(!active)n.o.forEach((k,i)=>drawOrg(g,k,x+20+i*30,n.yy-4,.2));T(g,`${n.o.length} sinh vật`,n.x,y+h-5,10,P.mut)}}
      /* hướng dẫn */
      g.fillStyle=P.mut;const msg=v==="xay"?(S.built?"Khóa đã hoàn chỉnh. Chuyển sang “Tra khóa” để sử dụng.":S.msg||"Chạm vào một ô màu xanh dương (nhóm có từ 2 sinh vật) rồi chọn đặc điểm ở khay."):(!S.built?"Hãy xây xong khóa trước.":S.quiz?(S.quiz.done?S.quiz.res:"Trả lời câu hỏi ở ô viền vàng bằng nút Có / Không."):"Bấm “Sinh vật bí ẩn” để bắt đầu.");
      T(g,msg,650,612,13,S.msg&&v==="xay"&&!S.built?"#F87171":P.mut)});
    K.pickFn(q=>{if(K.view!=="xay")return null;for(const n of nodes()){const [x,y,w,h]=boxOf(n);if(q[0]>=x&&q[0]<=x+w&&q[1]>=y&&q[1]<=y+h&&n.o.length>1)return{id:n.id}}return null});
    K.tapFn(h=>{if(h){S.sel=h.id;S.msg="";refresh()}});
    function split(tk){const n=byId(S.sel);if(!n||n.o.length<2||n.y)return;const t=TRK[tk];const Y=n.o.filter(k=>t.v[k]),N=n.o.filter(k=>!t.v[k]);
      if(!Y.length||!N.length){S.msg=`“${t.t}”: ${!Y.length?"không":"tất cả"} sinh vật trong nhóm đều ${!Y.length?"không có":"có"} đặc điểm này nên không chia được. Chọn đặc điểm khác.`;refresh();return}
      n.tr=tk;n.y={id:S.nid++,o:Y};n.n={id:S.nid++,o:N};S.steps++;S.msg="";api.record({b:String(S.steps),nh:n.o.map(k=>ORK[k].t).join(", "),co:`${t.t}: ${Y.map(k=>ORK[k].t).join(", ")}`,kh:`${t.n}: ${N.map(k=>ORK[k].t).join(", ")}`});
      const open=nodes().filter(m=>!m.y&&m.o.length>1);if(open.length)S.sel=open[0].id;else{S.built=true;S.sel=-1}refresh()}
    function newQuiz(){const pool=ORG.map(o=>o.k).filter(k=>!S.quiz||k!==S.quiz.org);const org=pool[Math.floor(Math.random()*pool.length)];S.quiz={org,at:S.root.id,path:[S.root.id],done:false,res:"",wrong:false}}
    function answer(yes){const Qz=S.quiz;if(!Qz||Qz.done)return;const n=byId(Qz.at);if(!n.y)return;const truth=!!TRK[n.tr].v[Qz.org];if(yes!==truth)Qz.wrong=true;const nx=yes?n.y:n.n;Qz.at=nx.id;Qz.path.push(nx.id);
      if(!nx.y){Qz.done=true;const got=nx.o[0];const ok=got===Qz.org;if(ok)S.ok++;Qz.res=ok?`Đúng: sinh vật bí ẩn là ${ORK[got].t}.`:`Chưa đúng: khóa dẫn tới ${ORK[got].t}, sinh vật bí ẩn là ${ORK[Qz.org].t}. Xem lại đặc điểm của nó.`;
        api.record({b:"Tra khóa",nh:"Sinh vật bí ẩn",co:ok?`xác định đúng: ${ORK[got].t}`:`dẫn tới ${ORK[got].t}`,kh:ok?"—":`đáp án: ${ORK[Qz.org].t}`})}refresh()}
    K.dockFn(()=>{if(K.view==="xay"){const n=byId(S.sel);const can=n&&n.o.length>1&&!n.y;return[{grid:TR.map(t=>({k:"tr",v:t.k,label:t.t,icon:"",dis:!can}))},{k:"undo",label:"Xóa bước cuối",icon:IC.reset,dis:S.steps===0},{k:"rs",label:"Làm lại",icon:IC.reset}]}
      const Qz=S.quiz;return[{k:"new",label:"Sinh vật bí ẩn",icon:IC.play,dis:!S.built||(Qz&&!Qz.done)},{k:"yes",label:"Có",icon:"",dis:!Qz||Qz.done},{k:"no",label:"Không",icon:"",dis:!Qz||Qz.done}]});
    K.onDock((k,v)=>{if(k==="tr")split(v);else if(k==="rs"){S.root={id:0,o:ORG.map(o=>o.k)};S.nid=1;S.sel=0;S.built=false;S.steps=0;S.quiz=null;S.msg=""}
      else if(k==="undo"){let last=null;(function f(n){if(n.y){if(!n.y.y&&!n.n.y){if(last==null||n.id>last.id)last=n}f(n.y);f(n.n)}})(S.root);if(last){delete last.y;delete last.n;delete last.tr;S.steps--;S.built=false;S.sel=last.id;S.quiz=null}}
      else if(k==="new")newQuiz();else if(k==="yes")answer(true);else if(k==="no")answer(false);refresh()});
    function keyText(){const L=nodes().filter(n=>n.y);if(!L.length)return"<small>Chưa có bước nào.</small>";const num={};L.forEach((n,i)=>num[n.id]=i+1);
      const to=c=>c.y?`→ ${num[c.id]}`:`→ <b>${ORK[c.o[0]].t}</b>`;return L.map(n=>`<div>${num[n.id]}a. ${TRK[n.tr].t} ${to(n.y)}</div><div>${num[n.id]}b. ${TRK[n.tr].n} ${to(n.n)}</div>`).join("")}
    K.infoFn(()=>{if(K.view==="xay"){const n=byId(S.sel);return `<div><b>Khóa lưỡng phân</b> · ${S.steps} bước${S.built?" · hoàn chỉnh":""}</div>${n&&n.o.length>1&&!n.y?`<div>Nhóm đang chọn: ${n.o.map(k=>ORK[k].t).join(", ")}</div>`:""}<small>Đi theo các nhánh “Có / Không” trên sơ đồ; bảng kết quả ghi lại từng bước.</small>`}
      const Qz=S.quiz;if(!Qz)return `<div><b>Tra khóa</b></div><small>${S.built?"Bấm “Sinh vật bí ẩn”, quan sát đặc điểm của sinh vật đó và trả lời từng câu hỏi.":"Cần xây xong khóa ở phần “Xây khóa”."} Đã xác định đúng ${S.ok} sinh vật.</small>`;
      const n=byId(Qz.at);return `<div><b>Tra khóa</b> · sinh vật bí ẩn</div>${Qz.done?`<div>${Qz.res}</div>`:`<div>Sinh vật này: <b>${TRK[n.tr].t}</b>?</div><small>Quan sát hình sinh vật bí ẩn rồi chọn Có hoặc Không.</small>`}<small> Đã xác định đúng ${S.ok}.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const t of ["xs","vu","mao","vay","datran"]){const open=nodes().filter(m=>!m.y&&m.o.length>1);if(!open.length)break;S.sel=open[0].id;split(t)}K.goView("tra");for(let r=0;r<2;r++){newQuiz();let g=0;while(!S.quiz.done&&g++<10){const n=byId(S.quiz.at);answer(!!TRK[n.tr].v[S.quiz.org])}}K.goView("xay")}};
    return K.mount(st)}
});
})();
