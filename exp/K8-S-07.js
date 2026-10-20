/* K8-S-07 · Quần thể, quần xã, hệ sinh thái; lưới thức ăn; cân bằng tự nhiên (SGK KHTN 8 – Kết nối tri thức, Bài 42–46) · 2D, điều tra
   Ba trạm:
   1. Điều tra mật độ quần thể bằng ô đất mẫu 1 m × 1 m trên bãi cỏ 20 m × 10 m; ba kiểu phân bố cá thể (đều, ngẫu nhiên, theo nhóm).
   2. Lưới thức ăn: chạm lần lượt các sinh vật để lập chuỗi thức ăn; kiểm tra quan hệ dinh dưỡng; xếp sinh vật vào bậc dinh dưỡng.
   3. Cân bằng tự nhiên: quần thể cỏ – thỏ – cáo (mô hình vật săn mồi – con mồi); săn bắt hết cáo để thấy mất cân bằng. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const FIELD={W:20,H:10,N:300};   /* bãi cỏ 20 m × 10 m, 300 cây (mật độ thật 1,5 cây/m²) */
/* sinh vật trong lưới: vị trí trên hình, bậc dinh dưỡng (1 = sinh vật sản xuất), ăn những loài nào */
const ORG={
  co:{ten:"Cỏ",x:260,y:520,lv:1,an:[]},lua:{ten:"Cây lúa",x:470,y:520,lv:1,an:[]},
  chau:{ten:"Châu chấu",x:215,y:395,lv:2,an:["co","lua"]},sau:{ten:"Sâu",x:390,y:400,lv:2,an:["lua","co"]},chuot:{ten:"Chuột",x:575,y:400,lv:2,an:["lua","co"]},tho:{ten:"Thỏ",x:760,y:400,lv:2,an:["co"]},
  ech:{ten:"Ếch",x:230,y:265,lv:3,an:["chau","sau"]},chim:{ten:"Chim sâu",x:410,y:262,lv:3,an:["sau","chau"]},ran:{ten:"Rắn",x:600,y:255,lv:4,an:["chuot","ech","chim"]},cao:{ten:"Cáo",x:820,y:260,lv:3,an:["tho","chuot"]},
  daibang:{ten:"Đại bàng",x:520,y:120,lv:5,an:["ran","tho","chuot","chim"]},
  vk:{ten:"Vi khuẩn, nấm",x:880,y:530,lv:0,an:[]}};
const POP={g:.35,c:.0016,r:2.0,d:.5,k:.0002,a:.012,b:.004,m:.5};   /* cỏ (phần so với tối đa), thỏ, cáo; thời gian: năm */   /* tham số mô hình, đơn vị thời gian: năm */

const SPEC={
  predict:[{id:"p1",q:"Để biết mật độ cây cỏ trên một bãi rộng mà không đếm hết, em làm thế nào?",opts:[["o","Đếm trong vài ô đất mẫu có diện tích biết trước rồi tính trung bình"],["mot","Đếm ở một chỗ nhiều cỏ nhất"],["uoc","Nhìn rồi ước lượng"]],ans:"o",res:"Kết quả: đặt ngẫu nhiên nhiều ô mẫu, lấy trung bình số cây trên 1 m²."},
    {id:"p2",q:"Nếu con người săn bắt hết cáo trong một khu rừng, số lượng thỏ sẽ:",opts:[["tang","Tăng nhanh, sau đó có thể giảm mạnh vì thiếu thức ăn"],["giam","Giảm ngay"],["khong","Không thay đổi"]],ans:"tang",res:"Kết quả: thỏ tăng vọt, ăn trụi cỏ, rồi chính thỏ bị thiếu thức ăn và giảm mạnh."}],
  taskLead:"Chọn trạm ở khay. Trạm 1: chạm lên bãi cỏ để đặt ô mẫu. Trạm 2: chạm lần lượt từ sinh vật bị ăn tới sinh vật ăn nó.",
  tasks:[{html:"<b>Điều tra:</b> đặt ít nhất 5 ô đất mẫu và tính mật độ trung bình.",done:()=>S.q.list.length>=5},
    {html:"<b>Lưới thức ăn:</b> lập đúng ít nhất 2 chuỗi thức ăn, mỗi chuỗi có từ 3 mắt xích.",done:()=>S.w.ok.length>=2},
    {html:"<b>Cân bằng:</b> cho hệ chạy ít nhất 20 năm, rồi săn bắt hết cáo và quan sát tiếp ít nhất 15 năm.",done:()=>S.p.killT!=null&&S.p.t-S.p.killT>=15}],
  obs:[{id:"a",q:"Mật độ quần thể là:",opts:[["md","Số lượng cá thể trên một đơn vị diện tích hoặc thể tích"],["tong","Tổng số cá thể của quần thể"],["kl","Khối lượng của một cá thể"]],ans:"md",why:"Ví dụ: 1,5 cây cỏ/m²; 2 con cá/m³ nước."},
    {id:"b",q:"Trong lưới thức ăn ở trạm 2, sinh vật nào là sinh vật sản xuất?",opts:[["co","Cỏ, cây lúa"],["tho","Thỏ, chuột"],["vk","Vi khuẩn, nấm"]],ans:"co",why:"Cây xanh tự tổng hợp chất hữu cơ nhờ quang hợp; vi khuẩn, nấm là sinh vật phân giải."},
    {id:"c",q:"Khi chưa săn bắt cáo, số thỏ và số cáo thay đổi thế nào?",opts:[["dd","Dao động quanh một mức ổn định: thỏ tăng thì cáo tăng theo, cáo tăng thì thỏ giảm"],["tang","Cùng tăng mãi"],["giam","Cùng giảm về 0"]],ans:"dd",why:"Số lượng cá thể của các quần thể khống chế lẫn nhau, giữ cho hệ ở trạng thái cân bằng sinh học."}],
  concl:{html:`<ul class="tlist"><li><b>Quần thể</b> là tập hợp các cá thể cùng loài, sống trong một khoảng không gian xác định, ở một thời điểm nhất định, có khả năng sinh sản tạo thế hệ mới. Đặc trưng: số lượng và mật độ, tỉ lệ giới tính, thành phần nhóm tuổi, phân bố cá thể (đều, ngẫu nhiên, theo nhóm).</li>
    <li><b>Quần xã</b> gồm nhiều quần thể khác loài cùng sống; <b>hệ sinh thái</b> gồm quần xã và môi trường sống (nhân tố vô sinh).</li>
    <li><b>Chuỗi thức ăn</b> là dãy loài có quan hệ dinh dưỡng, loài đứng trước là thức ăn của loài đứng sau; các chuỗi có mắt xích chung tạo thành <b>lưới thức ăn</b>. Thành phần: sinh vật sản xuất, sinh vật tiêu thụ (bậc 1, 2, 3…), sinh vật phân giải.</li>
    <li><b>Cân bằng tự nhiên</b>: số lượng cá thể mỗi quần thể dao động quanh mức ổn định nhờ khống chế sinh học. Săn bắt quá mức, phá rừng, ô nhiễm… làm mất cân bằng.</li></ul>`,
    quiz:[{id:"q1",q:"Chuỗi thức ăn nào viết đúng?",opts:[["a","Cỏ → thỏ → cáo"],["b","Cáo → thỏ → cỏ"],["c","Thỏ → cỏ → cáo"]],ans:"a",why:{b:"Mũi tên chỉ từ sinh vật bị ăn tới sinh vật ăn nó.",c:"Thỏ không phải thức ăn của cỏ."}},
      {id:"q2",q:"Dùng ong mắt đỏ để diệt sâu đục thân lúa là biện pháp:",opts:[["a","Đấu tranh sinh học, dựa vào khống chế sinh học"],["b","Dùng thuốc hóa học"],["c","Phá vỡ cân bằng"]],ans:"a",why:{b:"Không dùng hóa chất.",c:"Biện pháp này giúp giữ cân bằng."}},
      {id:"q3",q:"Một tập hợp nào là quần thể?",opts:[["a","Các cây lúa trong một ruộng lúa"],["b","Các con cá trong một cái ao"],["c","Các cây trong một khu rừng"]],ans:"a",why:{b:"Cá trong ao gồm nhiều loài khác nhau.",c:"Rừng gồm nhiều loài cây khác nhau."}}],
    done:`<h2>Hoàn thành: Quần thể, hệ sinh thái và cân bằng tự nhiên</h2><p class="muted">Mật độ, lưới thức ăn, khống chế sinh học.</p>`},
  gv:["Ở trạm 1, so sánh mật độ ước tính khi đặt 2 ô với khi đặt 10 ô: càng nhiều ô, ước tính càng gần mật độ thật.","Với kiểu phân bố theo nhóm, ô mẫu dễ cho kết quả lệch: cần đặt ngẫu nhiên và nhiều ô.","Ở trạm 3, hỏi: sau khi hết cáo, vì sao cuối cùng thỏ lại giảm?","Điều tra thật: chia nhóm, dùng khung 1 m × 1 m bằng dây, đặt ngẫu nhiên trên bãi cỏ sân trường."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 42–46)</p><ul class="tlist"><li>Phát biểu được khái niệm quần thể; lấy được ví dụ; nêu được các đặc trưng cơ bản của quần thể; tính được mật độ quần thể.</li>
<li>Nêu được khái niệm hệ sinh thái, chuỗi và lưới thức ăn; xác định được sinh vật sản xuất, tiêu thụ, phân giải.</li><li>Nêu được khái niệm cân bằng tự nhiên và biện pháp bảo vệ.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 42 Quần thể sinh vật, Bài 43 Quần xã sinh vật, Bài 44 Hệ sinh thái, Bài 46 Cân bằng tự nhiên.</li>
<li>Phương pháp ô mẫu (quadrat) để ước lượng mật độ; mô hình vật săn mồi – con mồi Lotka–Volterra có giới hạn sức chứa: <a href="https://openstax.org/books/biology-2e/pages/45-6-community-ecology" target="_blank" rel="noopener">OpenStax Biology 2e, mục 45.6</a>; <a href="https://openstax.org/books/biology-2e/pages/45-1-population-demography" target="_blank" rel="noopener">mục 45.1 (quadrat)</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Bãi cỏ 20 m × 10 m có 300 cây; vị trí cây sinh ngẫu nhiên theo kiểu phân bố đã chọn.</li>
<li>Lưới thức ăn là ví dụ minh họa của một hệ sinh thái đồng ruộng – bìa rừng.</li><li>Trạm 3 dùng tham số giả định, đơn vị thời gian là năm; số lượng tính bằng mô hình, không phải số liệu điều tra.</li></ul>`;

let S;
LabKHTN.register("K8-S-07",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tram",t:"Trạm"},{k:"tn",t:"Làm gì"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:620,aria:"Điều tra quần thể, lưới thức ăn và cân bằng tự nhiên",views:{
      quanthe:{label:"Điều tra mật độ",icon:IC.grid,frame:[40,60,920,520]},luoi:{label:"Lưới thức ăn",icon:IC.swap,frame:[40,50,930,540]},canbang:{label:"Cân bằng tự nhiên",icon:IC.reset,frame:[40,40,920,560]}}});
    const rnd=K.rnd;
    const genField=kind=>{const P=[];const N=FIELD.N;
      if(kind==="deu"){const nx=30,ny=10;for(let j=0;j<ny;j++)for(let i=0;i<nx;i++)P.push([(i+.5)/nx*FIELD.W+(rnd()-.5)*.12,(j+.5)/ny*FIELD.H+(rnd()-.5)*.12])}
      else if(kind==="nn"){for(let i=0;i<N;i++)P.push([rnd()*FIELD.W,rnd()*FIELD.H])}
      else{const cs=[];for(let k=0;k<12;k++)cs.push([1+rnd()*(FIELD.W-2),1+rnd()*(FIELD.H-2)]);for(let i=0;i<N;i++){const c=cs[i%12];const a=rnd()*6.283,r=Math.sqrt(-2*Math.log(Math.max(1e-6,rnd())))*.55;P.push([C.clamp(c[0]+Math.cos(a)*r,.05,FIELD.W-.05),C.clamp(c[1]+Math.sin(a)*r,.05,FIELD.H-.05)])}}
      return P.map(p=>({x:p[0],y:p[1],s:.8+rnd()*.5,rot:rnd()*6.28}))};
    S={q:{kind:"nn",plants:null,list:[],recDone:{}},w:{chain:[],ok:[],flash:null,showAll:false},p:{t:0,R:200,F:20,Gs:1,hist:[],kill:false,killT:null,rec20:false,rec15:false},recs:0};
    S.q.plants=genField("nn");
    const rec=(tram,tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tram,tn,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};

    /* ================= vẽ sinh vật (hình giản lược) ================= */
    function tuft(ctx,x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.strokeStyle=col||"#3F9B45";ctx.lineWidth=1.6;ctx.lineCap="round";
      for(let k=-3;k<=3;k++){ctx.beginPath();ctx.moveTo(k*.8,0);ctx.quadraticCurveTo(k*1.6,-5,k*2.6+(k?0:.5),-9+Math.abs(k)*1.2);ctx.stroke()}ctx.restore()}
    function draw(ctx,k,x,y,s,P){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const E=(cx,cy,rx,ry,c,a)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse(cx,cy,rx,ry,a||0,0,6.283);ctx.fill()};
      const eye=(cx,cy,r)=>{E(cx,cy,r,r,"#FFFFFF");E(cx+r*.2,cy,r*.55,r*.55,"#111")};
      if(k==="co"){for(let i=-2;i<=2;i++){ctx.save();ctx.translate(i*14,0);ctx.scale(2.6,2.6);tuft(ctx,0,0,1,i%2?"#4CAF50":"#2E7D32");ctx.restore()}}
      else if(k==="lua"){ctx.strokeStyle="#7CB342";ctx.lineWidth=3;for(let i=-3;i<=3;i++){ctx.beginPath();ctx.moveTo(i*5,0);ctx.quadraticCurveTo(i*7,-30,i*11,-48);ctx.stroke()}
        ctx.fillStyle="#E3B23C";for(let i=-2;i<=2;i++)for(let j=0;j<5;j++){E(i*11+12+j*3,-44+j*6,2.6,4.2,"#E3B23C",.6)}}
      else if(k==="chau"){E(0,0,26,9,"#7CB342");E(-24,-2,10,9,"#689F38");eye(-28,-5,3.5);ctx.strokeStyle="#558B2F";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(4,4);ctx.lineTo(18,-14);ctx.lineTo(34,10);ctx.stroke();
        ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-30,-10);ctx.quadraticCurveTo(-40,-30,-24,-38);ctx.stroke();E(6,-5,20,5,"rgba(160,200,90,.7)",-.1)}
      else if(k==="sau"){for(let i=0;i<7;i++)E(-30+i*10,Math.sin(i*.9)*3,8,8,i%2?"#8BC34A":"#9CCC65");eye(34,-2,3);ctx.strokeStyle="#33691E";ctx.lineWidth=1.5;for(let i=0;i<6;i++){ctx.beginPath();ctx.moveTo(-28+i*10,6);ctx.lineTo(-28+i*10,11);ctx.stroke()}}
      else if(k==="chuot"){E(0,0,26,15,"#8D8580");E(26,-4,14,11,"#9E9690");E(22,-16,7,8,"#C9A9A0");eye(33,-7,3);E(40,-2,2.5,2.5,"#E57373");ctx.strokeStyle="#B0A39C";ctx.lineWidth=2.5;ctx.beginPath();ctx.moveTo(-26,4);ctx.quadraticCurveTo(-50,10,-58,-6);ctx.stroke()}
      else if(k==="tho"){E(0,0,28,22,"#EEE6DA");E(26,-14,15,13,"#F3ECE2");E(20,-42,5,17,"#F3ECE2",-.15);E(29,-42,5,17,"#F3ECE2",.2);E(20,-42,2.5,12,"#F2B8B8",-.15);eye(33,-17,3);E(-28,-4,7,7,"#FFFFFF")}
      else if(k==="ech"){E(0,0,28,16,"#4CAF50");E(-14,-12,8,8,"#66BB6A");E(14,-12,8,8,"#66BB6A");eye(-14,-14,4.5);eye(14,-14,4.5);ctx.strokeStyle="#2E7D32";ctx.lineWidth=5;ctx.lineCap="round";
        ctx.beginPath();ctx.moveTo(-22,8);ctx.lineTo(-36,16);ctx.lineTo(-30,20);ctx.moveTo(22,8);ctx.lineTo(36,16);ctx.lineTo(30,20);ctx.stroke();ctx.strokeStyle="#1B5E20";ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-2,10,.3,2.8);ctx.stroke()}
      else if(k==="chim"){E(0,0,22,14,"#6D8B3A");E(18,-10,11,10,"#7C9A44");E(-4,-2,16,8,"#55702A",-.3);E(4,6,14,6,"#E7D58C");eye(22,-12,2.8);ctx.fillStyle="#3E2723";ctx.beginPath();ctx.moveTo(28,-10);ctx.lineTo(40,-8);ctx.lineTo(28,-6);ctx.fill();
        ctx.fillStyle="#4E5F2A";ctx.beginPath();ctx.moveTo(-20,-2);ctx.lineTo(-38,-8);ctx.lineTo(-36,4);ctx.fill()}
      else if(k==="ran"){ctx.strokeStyle="#8D6E2E";ctx.lineWidth=12;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(-46,10);ctx.bezierCurveTo(-30,-14,-12,26,6,4);ctx.bezierCurveTo(18,-10,30,-6,40,-4);ctx.stroke();
        ctx.strokeStyle="#C9A74A";ctx.lineWidth=4;ctx.setLineDash([6,8]);ctx.stroke();ctx.setLineDash([]);E(44,-4,11,8,"#8D6E2E");eye(47,-7,2.5);ctx.strokeStyle="#C62828";ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(55,-3);ctx.lineTo(62,-3);ctx.stroke()}
      else if(k==="cao"){E(0,0,30,15,"#D9772B");E(28,-10,13,11,"#E0843A");ctx.fillStyle="#D9772B";ctx.beginPath();ctx.moveTo(22,-18);ctx.lineTo(25,-34);ctx.lineTo(31,-19);ctx.fill();ctx.beginPath();ctx.moveTo(30,-18);ctx.lineTo(36,-32);ctx.lineTo(38,-16);ctx.fill();
        ctx.fillStyle="#E0843A";ctx.beginPath();ctx.moveTo(38,-12);ctx.lineTo(50,-6);ctx.lineTo(36,-3);ctx.fill();E(-34,2,18,8,"#D9772B",.3);E(-46,6,7,5,"#FFF3E0",.3);eye(34,-12,2.6);E(4,6,18,6,"#FBE9D7")}
      else if(k==="daibang"){ctx.fillStyle="#5D4037";ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-60,-22);ctx.lineTo(-48,-6);ctx.lineTo(-62,2);ctx.lineTo(-20,10);ctx.closePath();ctx.fill();ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(60,-22);ctx.lineTo(48,-6);ctx.lineTo(62,2);ctx.lineTo(20,10);ctx.closePath();ctx.fill();
        E(0,4,12,18,"#6D4C41");E(0,-14,9,9,"#F5F5F5");eye(3,-16,2.4);ctx.fillStyle="#F9A825";ctx.beginPath();ctx.moveTo(6,-13);ctx.lineTo(13,-10);ctx.lineTo(6,-8);ctx.fill()}
      else if(k==="vk"){ctx.fillStyle="#C8A27A";ctx.fillRect(-6,-18,12,22);E(0,-22,22,12,"#C0392B");for(let i=0;i<5;i++)E(-12+i*6,-26+(i%2)*4,2.5,2,"#FFFFFF");
        for(let i=0;i<4;i++){ctx.save();ctx.translate(30+i*9,-4+(i%2)*6);ctx.rotate(i);E(0,0,6,2.6,"#7E57C2");ctx.restore()}}
      ctx.restore()}

    /* ================= trạm 1: điều tra mật độ ================= */
    const FX={x:70,y:110,w:860,h:430};const sx=FX.w/FIELD.W,sy=FX.h/FIELD.H;
    const inQ=(q,p)=>p.x>=q.x&&p.x<q.x+1&&p.y>=q.y&&p.y<q.y+1;
    function addQuad(x,y){const Q=S.q;const q={x:C.clamp(Math.floor(x),0,FIELD.W-1),y:C.clamp(Math.floor(y),0,FIELD.H-1)};if(Q.list.some(o=>o.x===q.x&&o.y===q.y)){api.toast("Ô này đã đếm rồi. Chọn chỗ khác.","info",1600);return}
      q.n=Q.plants.filter(p=>inQ(q,p)).length;Q.list.push(q);const n=Q.list.length;const mean=Q.list.reduce((a,o)=>a+o.n,0)/n;
      if(n===5||n===10){rec("Điều tra mật độ",`${n} ô mẫu 1 m², phân bố ${KN[Q.kind].toLowerCase()}`,`số cây đếm được: ${Q.list.map(o=>o.n).join(", ")} → mật độ trung bình ${fmt(mean,1)} cây/m² (thật: ${fmt(FIELD.N/(FIELD.W*FIELD.H),1)} cây/m²)`)}refresh()}
    const KN={deu:"Đều",nn:"Ngẫu nhiên",nhom:"Theo nhóm"};
    function drawQ(ctx,P){const Q=S.q;
      const g=ctx.createLinearGradient(0,FX.y,0,FX.y+FX.h);g.addColorStop(0,K.day?"#B8D98A":"#3D5F2B");g.addColorStop(1,K.day?"#9CC66B":"#2F4D22");ctx.fillStyle=g;C.rr(ctx,FX.x,FX.y,FX.w,FX.h,10);ctx.fill();
      ctx.strokeStyle=K.day?"rgba(30,60,20,.15)":"rgba(255,255,255,.07)";ctx.lineWidth=1;ctx.beginPath();for(let i=1;i<FIELD.W;i++){ctx.moveTo(FX.x+i*sx,FX.y);ctx.lineTo(FX.x+i*sx,FX.y+FX.h)}for(let j=1;j<FIELD.H;j++){ctx.moveTo(FX.x,FX.y+j*sy);ctx.lineTo(FX.x+FX.w,FX.y+j*sy)}ctx.stroke();
      for(const p of Q.plants){const hi=Q.list.some(q=>inQ(q,p));tuft(ctx,FX.x+p.x*sx,FX.y+p.y*sy+5,p.s,hi?"#FDE047":(K.day?"#2E7D32":"#7BC67E"))}
      for(const q of Q.list){ctx.strokeStyle="#FFFFFF";ctx.lineWidth=3;ctx.strokeRect(FX.x+q.x*sx,FX.y+q.y*sy,sx,sy);D2.block(ctx,FX.x+q.x*sx+sx/2-14,FX.y+q.y*sy-26,28,22,6,"#111827","#111827",{shadow:false});D2.text(ctx,String(q.n),FX.x+q.x*sx+sx/2,FX.y+q.y*sy-9,{s:16,w:800,c:"#FDE047",a:"center"})}
      /* thước tỉ lệ */
      D2.text(ctx,"20 m",FX.x+FX.w/2,FX.y+FX.h+30,{s:17,w:700,c:P.mut,a:"center"});D2.arrow(ctx,FX.x+FX.w/2-40,FX.y+FX.h+24,FX.x,FX.y+FX.h+24,P.mut,1.5,8);D2.arrow(ctx,FX.x+FX.w/2+40,FX.y+FX.h+24,FX.x+FX.w,FX.y+FX.h+24,P.mut,1.5,8);
      D2.text(ctx,"10 m",FX.x-14,FX.y+FX.h/2,{s:17,w:700,c:P.mut,a:"right",b:"middle"});
      D2.text(ctx,"Mỗi ô lưới 1 m × 1 m",FX.x+FX.w,FX.y-14,{s:15,w:700,c:P.mut,a:"right"})}
    /* ================= trạm 2: lưới thức ăn ================= */
    const edges=[];for(const k in ORG)for(const f of ORG[k].an)edges.push([f,k]);
    const isEdge=(a,b)=>ORG[b].an.includes(a);
    function drawW(ctx,P){const W=S.w;
      /* dải bậc dinh dưỡng */
      const bands=[[470,560,"Sinh vật sản xuất"],[345,445,"Tiêu thụ bậc 1"],[200,320,"Tiêu thụ bậc 2, 3"],[70,175,"Tiêu thụ cấp cao nhất"]];
      bands.forEach((b,i)=>{ctx.fillStyle=K.day?["rgba(76,175,80,.12)","rgba(255,193,7,.12)","rgba(255,112,67,.1)","rgba(121,85,72,.1)"][i]:["rgba(76,175,80,.1)","rgba(255,193,7,.08)","rgba(255,112,67,.08)","rgba(161,136,127,.08)"][i];C.rr(ctx,40,b[0],760,b[1]-b[0],12);ctx.fill();D2.text(ctx,b[2],52,b[0]+20,{s:14,w:700,c:P.mut})});
      ctx.fillStyle=K.day?"rgba(126,87,194,.1)":"rgba(126,87,194,.12)";C.rr(ctx,815,470,150,90,12);ctx.fill();D2.text(ctx,"Sinh vật phân giải",826,490,{s:14,w:700,c:P.mut});
      /* mũi tên quan hệ dinh dưỡng: từ sinh vật bị ăn tới sinh vật ăn nó */
      const chainE=new Set();for(let i=1;i<W.chain.length;i++)chainE.add(W.chain[i-1]+">"+W.chain[i]);const okE=new Set();W.ok.forEach(c=>{for(let i=1;i<c.length;i++)okE.add(c[i-1]+">"+c[i])});
      for(const [a,b] of edges){const A=ORG[a],B=ORG[b];const on=chainE.has(a+">"+b),ok=okE.has(a+">"+b);const vis=W.showAll||on||ok;if(!vis)continue;
        const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy);const x1=A.x+dx/L*40,y1=A.y+dy/L*34,x2=B.x-dx/L*44,y2=B.y-dy/L*38;
        D2.arrow(ctx,x1,y1,x2,y2,on?"#FDE047":ok?(K.day?"#15803D":"#86EFAC"):C.rgba(P.ink,.35),on?4:ok?3:1.6,on?14:10)}
      for(const k in ORG){const o=ORG[k];const sel=W.chain.includes(k);
        if(sel){ctx.fillStyle="rgba(253,224,71,.25)";ctx.beginPath();ctx.arc(o.x,o.y-6,52,0,6.283);ctx.fill()}
        draw(ctx,k,o.x,o.y,k==="daibang"?.9:1,P);D2.text(ctx,o.ten,o.x,o.y+40,{s:16,w:800,c:P.ink,a:"center"})}
      if(W.flash){const f=W.flash;ctx.globalAlpha=C.clamp(f.t,0,1);D2.text(ctx,f.msg,500,40,{s:19,w:800,c:f.ok?(K.day?"#15803D":"#86EFAC"):(K.day?"#B91C1C":"#FCA5A5"),a:"center"});ctx.globalAlpha=1}}
    function tapOrg(k){const W=S.w;if(k==="vk"){W.flash={msg:"Vi khuẩn, nấm phân giải xác sinh vật ở mọi mắt xích, không đứng trong chuỗi ăn thịt.",ok:true,t:3};return}
      if(!W.chain.length){if(ORG[k].lv!==1){W.flash={msg:"Chuỗi thức ăn nên bắt đầu từ sinh vật sản xuất (cây xanh).",ok:false,t:2.5};return}W.chain=[k];return}
      const last=W.chain[W.chain.length-1];if(k===last){W.chain.pop();return}
      if(!isEdge(last,k)){W.flash={msg:`${ORG[k].ten} không ăn ${ORG[last].ten.toLowerCase()}.`,ok:false,t:2.5};return}
      W.chain.push(k);W.flash={msg:W.chain.map(c=>ORG[c].ten).join(" → "),ok:true,t:2.5}}
    function saveChain(){const W=S.w;if(W.chain.length<3){api.toast("Chuỗi cần ít nhất 3 mắt xích.","info",1800);return}const key=W.chain.join(">");if(W.ok.some(c=>c.join(">")===key)){api.toast("Chuỗi này đã ghi rồi.","info",1600);return}
      W.ok.push(W.chain.slice());rec("Lưới thức ăn","Lập chuỗi thức ăn",W.chain.map(c=>ORG[c].ten).join(" → ")+` (${W.chain.length} mắt xích)`);W.chain=[];refresh()}
    /* ================= trạm 3: cân bằng tự nhiên ================= */
    function stepP(dt){const Pp=S.p;if(dt<=0)return;const yrs=dt*.5;let left=yrs;
      while(left>1e-6){const h=Math.min(left,.01);left-=h;const R=Pp.R,F=Pp.F,Gs=Pp.Gs;
        const dG=POP.g*Gs*(1-Gs)-POP.c*R*Gs+.001,dR=R*(POP.r*Gs-POP.d-POP.k*R)-POP.a*R*F,dF=POP.b*R*F-POP.m*F;
        Pp.R=Math.max(.5,R+dR*h);Pp.F=Pp.kill?0:Math.max(0,F+dF*h);Pp.Gs=C.clamp(Gs+dG*h,.01,1);Pp.t+=h;
        const H=Pp.hist;if(!H.length||Pp.t-H[H.length-1][0]>=.1){H.push([Pp.t,Pp.R,Pp.F,Pp.Gs*100]);if(H.length>900)H.shift()}}
      if(!Pp.rec20&&Pp.t>=20){Pp.rec20=true;const last=Pp.hist.filter(h=>h[0]>=Pp.t-8);rec("Cân bằng tự nhiên","Cỏ – thỏ – cáo, 20 năm đầu",`thỏ dao động ${fmt(Math.min(...last.map(h=>h[1])),0)}–${fmt(Math.max(...last.map(h=>h[1])),0)} con, cáo ${fmt(Math.min(...last.map(h=>h[2])),0)}–${fmt(Math.max(...last.map(h=>h[2])),0)} con: hệ dao động quanh mức cân bằng`);refresh()}
      if(Pp.killT!=null&&!Pp.rec15&&Pp.t-Pp.killT>=15){Pp.rec15=true;const seg=Pp.hist.filter(h=>h[0]>=Pp.killT);const mx=Math.max(...seg.map(h=>h[1]));const mn=Math.min(...seg.map(h=>h[3]));
        rec("Cân bằng tự nhiên",`Săn bắt hết cáo ở năm thứ ${fmt(Pp.killT,0)}, theo dõi 15 năm`,`thỏ tăng vọt tới khoảng ${fmt(mx,0)} con; cỏ giảm còn ${fmt(mn,0)}% so với ban đầu; sau đó thỏ giảm mạnh vì thiếu thức ăn: hệ mất cân bằng`);refresh()}}
    function drawP(ctx,P){const Pp=S.p;const F={x:110,y:90,w:820,h:380,x0:Math.max(0,Pp.t-40),x1:Math.max(40,Pp.t),y0:0,y1:Math.max(300,Math.ceil(Math.max(...Pp.hist.map(h=>h[1]),1)/100)*100),nx:8,ny:6,xl:"t (năm)",yl:"số cá thể"};
      const seg=Pp.hist.filter(h=>h[0]>=F.x0);
      D2.chart(ctx,F,[{pts:seg.map(h=>[h[0],h[3]*F.y1/100]),c:"#66BB6A"},{pts:seg.map(h=>[h[0],h[1]]),c:"#E5D3B3"},{pts:seg.map(h=>[h[0],h[2]]),c:"#F57C00"}],P);
      if(Pp.killT!=null&&Pp.killT>=F.x0){const x=F.x+(Pp.killT-F.x0)/(F.x1-F.x0)*F.w;ctx.strokeStyle="#EF4444";ctx.setLineDash([6,6]);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,F.y);ctx.lineTo(x,F.y+F.h);ctx.stroke();ctx.setLineDash([]);D2.text(ctx,"săn bắt hết cáo",x+6,F.y+16,{s:15,w:800,c:"#EF4444"})}
      /* chú giải và hình minh họa */
      const lg=[["#66BB6A","Cỏ (đỉnh trục = 100%)",130],["#E5D3B3","Thỏ (con)",430],["#F57C00","Cáo (con)",620]];lg.forEach(l=>{ctx.fillStyle=l[0];ctx.fillRect(l[2],520,26,6);D2.text(ctx,l[1],l[2]+32,528,{s:15,w:700,c:P.ink})});
      draw(ctx,"tho",200,585,.7,P);D2.text(ctx,`${fmt(Pp.R,0)} con`,240,592,{s:17,w:800,c:P.ink});draw(ctx,"cao",470,585,.7,P);D2.text(ctx,Pp.kill?"0 con":`${fmt(Pp.F,0)} con`,515,592,{s:17,w:800,c:P.ink});
      draw(ctx,"co",740,598,.6,P);D2.text(ctx,`${fmt(Pp.Gs*100,0)}%`,790,592,{s:17,w:800,c:P.ink})}
    K.onFrame(dt=>{stepP(dt);if(S.w.flash){S.w.flash.t-=dt>0?dt:1/60;if(S.w.flash.t<=0)S.w.flash=null}});
    K.drawFn((ctx,P)=>{const v=K.view;if(v==="quanthe")drawQ(ctx,P);else if(v==="luoi")drawW(ctx,P);else drawP(ctx,P)});

    /* ================= nhãn ================= */
    K.label("Ô đất mẫu 1 m²",()=>{const q=S.q.list[S.q.list.length-1];return q?[FX.x+(q.x+1)*sx,FX.y+(q.y+1)*sy]:[-999,-999]},{view:"quanthe",dir:"se",len:30});
    K.label("Mũi tên: từ sinh vật bị ăn → sinh vật ăn nó",[ORG.daibang.x+70,ORG.daibang.y-10],{view:"luoi",dir:"e",len:40});

    /* ================= chạm ================= */
    K.pickFn(q=>{const v=K.view;if(v==="quanthe"){if(q[0]>=FX.x&&q[0]<FX.x+FX.w&&q[1]>=FX.y&&q[1]<FX.y+FX.h)return{k:"field",x:(q[0]-FX.x)/sx,y:(q[1]-FX.y)/sy};return null}
      if(v==="luoi"){for(const k in ORG){const o=ORG[k];if(Math.hypot(q[0]-o.x,q[1]-o.y+6)<50)return{k:"org",o:k}}}return null});
    K.tapFn(k=>{if(!k)return;if(k.k==="field")addQuad(k.x,k.y);else if(k.k==="org"){tapOrg(k.o);refresh()}});
    K.dockFn(()=>{const v=K.view;
      if(v==="quanthe")return[{seg:Object.keys(KN).map(k=>({k:"kind",v:k,label:KN[k],icon:"",on:S.q.kind===k})),label:"Kiểu phân bố"},{k:"rq",label:"Đặt 1 ô ngẫu nhiên",icon:IC.grid},{k:"cq",label:"Xóa các ô",icon:IC.reset,dis:!S.q.list.length}];
      if(v==="luoi")return[{k:"save",label:"Ghi chuỗi thức ăn",icon:IC.pen,dis:S.w.chain.length<3},{k:"undo",label:"Bỏ mắt xích cuối",icon:IC.minus,dis:!S.w.chain.length},{k:"all",label:S.w.showAll?"Ẩn lưới thức ăn":"Hiện cả lưới thức ăn",icon:IC.swap,on:S.w.showAll}];
      const Pp=S.p;return[{k:"kill",label:"Săn bắt hết cáo",icon:IC.ban,dis:Pp.kill},{k:"rp",label:"Làm lại từ đầu",icon:IC.reset}]});
    K.onDock((k,v)=>{const Q=S.q;
      if(k==="kind"){Q.kind=v;Q.plants=genField(v);Q.list=[]}else if(k==="rq"){let tries=0;while(tries++<50){const x=rnd()*FIELD.W,y=rnd()*FIELD.H;if(!Q.list.some(o=>o.x===Math.floor(x)&&o.y===Math.floor(y))){addQuad(x,y);break}}}
      else if(k==="cq")Q.list=[];
      else if(k==="save")saveChain();else if(k==="undo")S.w.chain.pop();else if(k==="all")S.w.showAll=!S.w.showAll;
      else if(k==="kill"){S.p.kill=true;S.p.killT=S.p.t;S.p.F=0}else if(k==="rp"){S.p={t:0,R:200,F:20,Gs:1,hist:[],kill:false,killT:null,rec20:S.p.rec20,rec15:S.p.rec15}}
      refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="quanthe"){const Q=S.q;const n=Q.list.length;const mean=n?Q.list.reduce((a,o)=>a+o.n,0)/n:0;return `<div><b>Điều tra mật độ cây cỏ</b> · phân bố ${KN[Q.kind].toLowerCase()}</div><div>Số ô đã đếm: ${n}</div><div>Mật độ ước tính: ${n?fmt(mean,2)+" cây/m²":"—"}</div><div>Ước tính cả bãi (200 m²): ${n?fmt(mean*200,0)+" cây":"—"}</div><small>Mật độ = số cá thể : diện tích. Chạm lên bãi cỏ để đặt ô.</small>`}
      if(v==="luoi"){const W=S.w;return `<div><b>Lập chuỗi thức ăn</b></div><div>${W.chain.length?W.chain.map(c=>ORG[c].ten).join(" → "):"Chạm vào một sinh vật sản xuất để bắt đầu"}</div><div>Đã ghi: ${W.ok.length} chuỗi</div><small>Chạm lại mắt xích cuối để bỏ nó.</small>`}
      const Pp=S.p;return `<div><b>Cỏ – thỏ – cáo</b> · năm thứ ${fmt(Pp.t,1)}</div><div>Thỏ: ${fmt(Pp.R,0)} con · Cáo: ${Pp.kill?0:fmt(Pp.F,0)} con</div><div>Cỏ: ${fmt(Pp.Gs*100,0)}% so với ban đầu</div><small>Mô hình vật săn mồi – con mồi, tham số giả định.</small>`});
    K.timeLabel(()=>K.view==="canbang"?`Năm thứ ${fmt(S.p.t,1)}`:K.views[K.view].label);
    K.onReset(()=>{});
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){for(let i=0;i<6;i++){S.q.list.length<10&&addQuad(rnd()*FIELD.W,rnd()*FIELD.H)}
        S.w.chain=["co","tho","cao"];saveChain();S.w.chain=["lua","sau","chim","ran","daibang"];saveChain();
        stepP(40/.5);S.p.kill=true;S.p.killT=S.p.t;stepP(16/.5);refresh()}};
    return K.mount(st)}
});
})();
