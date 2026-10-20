/* K8-S-06 · Hệ thần kinh và các giác quan ở người: phản xạ; mắt và tật khúc xạ (SGK KHTN 8 – Kết nối tri thức, Bài 37) · 3D
   Năm phần:
   1. Tổng quan: thân người mờ, não bộ, tủy sống, dây thần kinh tủy và các dây thần kinh đi tới tay chân; hạch thần kinh cạnh tủy sống.
   2. Não bộ: đại não (hai bán cầu có các nếp cuộn, khe dọc, rãnh bên, rãnh trung tâm), tiểu não có các lá song song, trụ não nối tủy sống.
   3. Phản xạ rụt tay khi chạm vật nóng: cơ quan thụ cảm ở da → dây thần kinh cảm giác (qua hạch rễ sau) → tủy sống (chất xám)
      → dây thần kinh vận động → cơ hai đầu co, cẳng tay gập lại.
   4. Cấu tạo mắt: cầu mắt cắt đôi theo trục nhìn.
   5. Tật khúc xạ: mắt bình thường, cận thị, viễn thị; vật ở xa hoặc ở gần; đeo kính phân kì hoặc hội tụ. Tính bằng độ tụ (dioptre). */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const NX=12,PX=-12,EX=24;          /* toạ độ x của các trạm */

/* mô hình mắt rút gọn (một thấu kính mỏng), số đo độ tụ tính bằng dioptre (D = 1/m) */
const EYE={
  thuong:{ten:"Mắt bình thường",L:1/60,P:[60,70],kinh:0},
  can:{ten:"Mắt cận thị",L:1/58,P:[60,70],kinh:-2},
  vien:{ten:"Mắt viễn thị",L:1/63,P:[60,65],kinh:3}};
const OBJ={xa:{ten:"Vật ở rất xa",V:0},gan:{ten:"Vật ở gần (cách mắt 25 cm)",V:-4}};
const EXG=4;   /* hình phóng đại độ lệch chiều dài cầu mắt và vị trí ảnh 4 lần cho dễ thấy */

const BRAIN={cerebrum:{ten:"Đại não",ct:"Gồm hai bán cầu não, bề mặt có nhiều nếp cuộn làm tăng diện tích chất xám (vỏ não). Là trung khu của các phản xạ có điều kiện; nơi hình thành ý thức, tư duy, trí nhớ, ngôn ngữ; nhận và xử lí cảm giác, điều khiển vận động có ý thức."},
  cerebellum:{ten:"Tiểu não",ct:"Nằm phía sau, dưới đại não. Điều hòa, phối hợp các cử động phức tạp và giữ thăng bằng cho cơ thể."},
  stem:{ten:"Trụ não",ct:"Nối não với tủy sống. Điều khiển, điều hòa hoạt động của các cơ quan nội tạng như tuần hoàn, hô hấp, tiêu hóa."}};
const ARC=[["thu","Cơ quan thụ cảm (da đầu ngón tay)"],["cg","Dây thần kinh cảm giác (hướng tâm)"],["tw","Trung ương thần kinh (chất xám tủy sống)"],["vd","Dây thần kinh vận động (li tâm)"],["pu","Cơ quan phản ứng (cơ hai đầu)"]];

const SPEC={
  predict:[
    {id:"p1",q:"Tay chạm phải vật nóng, ta rụt tay lại ngay. Bộ phận nào điều khiển phản xạ này?",opts:[["tuy","Tủy sống"],["tieu","Tiểu não"],["tim","Tim"]],ans:"tuy",res:"Kết quả: tín hiệu từ da đi vào tủy sống, tủy sống phát lệnh tới cơ làm rụt tay."},
    {id:"p2",q:"Người cận thị nhìn vật ở xa, ảnh của vật hiện ở đâu?",opts:[["truoc","Trước màng lưới"],["tren","Đúng trên màng lưới"],["sau","Sau màng lưới"]],ans:"truoc",res:"Kết quả: ở mắt cận, ảnh của vật ở xa hiện trước màng lưới nên nhìn mờ."}],
  taskLead:"Chọn phần ở khay. Kéo để xoay, cuộn để phóng to; chạm vào các bộ phận để xem tên và chức năng.",
  tasks:[
    {html:"<b>Tổng quan:</b> chạm vào não, tủy sống và một dây thần kinh để phân biệt bộ phận trung ương và ngoại biên.",done:()=>S.seen.nao&&S.seen.tuy&&S.seen.day},
    {html:"<b>Não bộ:</b> chạm vào đại não, tiểu não và trụ não.",done:()=>["cerebrum","cerebellum","stem"].every(k=>S.bseen[k])},
    {html:"<b>Phản xạ:</b> đưa tay lại gần ngọn nến và quan sát đường đi của xung thần kinh.",done:()=>S.rfDone},
    {html:"<b>Cận thị:</b> nhìn vật ở xa khi không đeo kính và khi đeo kính.",done:()=>S.obs["can|xa|0"]&&S.obs["can|xa|1"]},
    {html:"<b>Viễn thị:</b> nhìn vật ở gần khi không đeo kính và khi đeo kính.",done:()=>S.obs["vien|gan|0"]&&S.obs["vien|gan|1"]}],
  obs:[
    {id:"a",q:"Bộ phận trung ương của hệ thần kinh gồm:",opts:[["nt","Não và tủy sống"],["dh","Dây thần kinh và hạch thần kinh"],["nd","Não và dây thần kinh"]],ans:"nt",why:"Não nằm trong hộp sọ, tủy sống nằm trong ống xương sống; dây thần kinh và hạch thần kinh là bộ phận ngoại biên."},
    {id:"b",q:"Trong phản xạ rụt tay, xung thần kinh đi theo thứ tự:",opts:[["dung","Da → dây cảm giác → tủy sống → dây vận động → cơ"],["nguoc","Cơ → dây vận động → tủy sống → dây cảm giác → da"],["nao","Da → não → tim → cơ"]],ans:"dung",why:"Đó là năm thành phần của cung phản xạ: cơ quan thụ cảm, nơron cảm giác, trung ương thần kinh, nơron vận động, cơ quan phản ứng."},
    {id:"c",q:"Mắt cận thị nhìn rõ vật ở xa khi đeo kính:",opts:[["pk","Thấu kính phân kì"],["ht","Thấu kính hội tụ"],["kh","Kính không độ"]],ans:"pk",why:"Thấu kính phân kì làm chùm tia loe ra trước khi vào mắt, ảnh lùi ra sau đúng màng lưới."},
    {id:"d",q:"Mắt viễn thị nhìn vật ở gần, ảnh hiện ở đâu khi chưa đeo kính?",opts:[["sau","Sau màng lưới"],["truoc","Trước màng lưới"],["tren","Trên màng lưới"]],ans:"sau",why:"Cầu mắt ngắn (hoặc thể thủy tinh kém phồng), chùm tia chưa kịp hội tụ đã gặp màng lưới; đeo thấu kính hội tụ để khắc phục."}],
  concl:{html:`<ul class="tlist"><li>Hệ thần kinh gồm <b>bộ phận trung ương</b> (não, tủy sống) và <b>bộ phận ngoại biên</b> (dây thần kinh, hạch thần kinh). Não gồm đại não, tiểu não, trụ não (và não trung gian).</li>
    <li><b>Phản xạ</b> là phản ứng của cơ thể trả lời kích thích của môi trường, thông qua hệ thần kinh. Cung phản xạ gồm: cơ quan thụ cảm → dây thần kinh cảm giác → trung ương thần kinh → dây thần kinh vận động → cơ quan phản ứng.</li>
    <li><b>Mắt</b>: màng cứng (phía trước là giác mạc trong suốt), màng mạch (có lòng đen và con ngươi), màng lưới (có điểm vàng, điểm mù); bên trong có thủy dịch, thể thủy tinh, dịch thủy tinh.</li>
    <li><b>Cận thị</b>: chỉ nhìn rõ vật ở gần, ảnh của vật ở xa hiện trước màng lưới; đeo kính phân kì. <b>Viễn thị</b>: khó nhìn rõ vật ở gần, ảnh hiện sau màng lưới; đeo kính hội tụ.</li></ul>`,
    quiz:[
      {id:"q1",q:"Bộ phận giúp giữ thăng bằng và phối hợp cử động là:",opts:[["tieu","Tiểu não"],["dai","Đại não"],["tru","Trụ não"]],ans:"tieu",why:{dai:"Đại não là trung khu của ý thức, tư duy, phản xạ có điều kiện.",tru:"Trụ não điều khiển hoạt động các nội quan."}},
      {id:"q2",q:"Thói quen nào dễ dẫn tới cận thị ở học sinh?",opts:[["gan","Đọc sách quá gần, nơi thiếu ánh sáng, dùng điện thoại lâu"],["xa","Nhìn ra xa sau mỗi 20–30 phút học"],["sang","Học ở nơi đủ ánh sáng"]],ans:"gan",why:{xa:"Đây là thói quen tốt giúp mắt nghỉ ngơi.",sang:"Đủ ánh sáng giúp mắt đỡ mỏi."}},
      {id:"q3",q:"Điểm mù trên màng lưới là nơi:",opts:[["day","Dây thần kinh thị giác đi ra, không có tế bào thụ cảm thị giác"],["vang","Tập trung nhiều tế bào nón nhất"],["mach","Có nhiều mạch máu nhất"]],ans:"day",why:{vang:"Đó là điểm vàng.",mach:"Điểm mù không có tế bào thụ cảm thị giác nên ảnh rơi vào đó không được nhận biết."}}],
    done:`<h2>Hoàn thành: Hệ thần kinh, phản xạ và mắt</h2><p class="muted">Trung ương: não, tủy sống; ngoại biên: dây và hạch thần kinh. Cận thị đeo kính phân kì, viễn thị đeo kính hội tụ.</p>`},
  gv:["Ở phần phản xạ, chạy 0,25× và cho học sinh gọi tên từng thành phần của cung phản xạ khi xung thần kinh đi qua.","Hỏi: nếu dây thần kinh vận động ở tay bị tổn thương thì còn rụt tay được không? Còn cảm giác nóng không?","Ở phần tật khúc xạ, cho học sinh dự đoán vị trí ảnh trước khi đổi loại mắt hoặc đeo kính.","Liên hệ: quy tắc 20-20-20 khi dùng màn hình (mỗi 20 phút nhìn xa khoảng 6 m trong 20 giây) là khuyến nghị phổ biến để giảm mỏi mắt."]
};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 37)</p><ul class="tlist"><li>Nêu được chức năng của hệ thần kinh và các giác quan; kể tên các bộ phận của hệ thần kinh.</li><li>Trình bày được cấu tạo của mắt; nêu được một số bệnh, tật về mắt (cận thị, viễn thị) và cách phòng tránh.</li><li>Lấy được ví dụ về phản xạ; mô tả được cung phản xạ.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 37 Hệ thần kinh và các giác quan ở người.</li>
<li>Cấu tạo não, tủy sống, cung phản xạ: <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/13-2-the-central-nervous-system" target="_blank" rel="noopener">OpenStax Anatomy and Physiology 2e, mục 13.2</a>; cấu tạo mắt: <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/14-1-sensory-perception" target="_blank" rel="noopener">mục 14.1</a>.</li>
<li>Kích thước não người trưởng thành (dài khoảng 16–17 cm, rộng khoảng 14 cm) và cầu mắt (đường kính khoảng 24 mm): giá trị điển hình trong sách giải phẫu.</li>
<li>Mắt rút gọn có độ tụ khoảng 60 D; cận thị dùng thấu kính phân kì, viễn thị dùng thấu kính hội tụ: <a href="https://openstax.org/books/college-physics-2e/pages/26-2-vision-correction" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 26.2 Vision Correction</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Mắt coi như một thấu kính mỏng có độ tụ 60 D khi không điều tiết. Mắt bình thường điều tiết thêm tới 10 D; mắt cận 2 D (cầu mắt dài hơn); mắt viễn 3 D (cầu mắt ngắn hơn), điều tiết thêm tối đa 5 D. Kính đặt sát mắt, bỏ qua khoảng cách kính – mắt.</li>
<li>Hình phóng đại 4 lần độ chênh chiều dài cầu mắt và vị trí ảnh. Vật ở gần đặt cách mắt 25 cm, hình vẽ rút ngắn khoảng cách.</li>
<li>Xung thần kinh trong phản xạ được làm chậm lại rất nhiều để quan sát; thực tế phản xạ rụt tay xảy ra trong một phần nhỏ của giây.</li>
<li>Hình dạng não, tủy sống, dây thần kinh và cầu mắt dựng giản lược theo hình giải phẫu; nếp cuộn đại não không ứng với từng hồi não thật.</li></ul>`;

let S;
LabKHTN.register("K8-S-06",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Quan sát"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D hệ thần kinh, cung phản xạ và cấu tạo mắt",legend:{w:260},
      views:{tongquan:{t:[0,-.55,0],yaw:.35,pitch:.06,rad:4.6,label:"Tổng quan",icon:IC.eye},
        nao:{t:[NX,-.2,-.05],yaw:1.2,pitch:.22,rad:1.95,label:"Não bộ",icon:IC.cell},
        phanxa:{t:[PX+.15,-.62,0],yaw:0,pitch:.1,rad:2.75,label:"Phản xạ",icon:IC.bolt},
        mat:{t:[EX+.3,0,0],yaw:.12,pitch:.12,rad:3.0,label:"Cấu tạo mắt",icon:IC.lens},
        tat:{t:[EX-1.15,0,0],yaw:0,pitch:.04,rad:3.9,label:"Tật khúc xạ",icon:IC.lens}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={seen:{},bseen:{},sel:null,rf:{ph:"idle",t:0,th:-.2},rfDone:false,rfN:0,eye:"can",obj:"xa",kinh:false,obs:{},obsT:0,lastKey:null,recs:0};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const tis=o=>Object.assign({color:"#FFFFFF",rough:.5,wrap:.5,sheen:.35,coat:.2,hooks:KIT.TISSUE,uniforms:{uBump:.05,uNF:20}},o||{});
    const NERVE="#F2CF5B";
    const loadEl=document.createElement("div");loadEl.className="gl-loading glass";loadEl.innerHTML=`<i aria-hidden="true"></i>Đang dựng mô hình não, tủy sống và mắt…`;K.over.appendChild(loadEl);
    let pend=3;const done1=()=>{if(--pend<=0){loadEl.classList.add("out");setTimeout(()=>loadEl.remove(),400)}};

    /* ================= 1. tổng quan ================= */
    const body=root.add(new G.Node());
    window.LabOrgans.build("buildBodyFull",110).then(g=>{if(K.dead)return;body.add(R.mesh(g,{color:"#F2C6A8",alpha:.1,rough:.6,order:-2,transparent:true}))});
    const brainBody=body.add(new G.Node());brainBody.pos=[0,2.46,-.06];brainBody.scl=[.4,.4,.4];
    const cordPts=G.spline([[0,2.14,-.17],[0,1.85,-.36],[0,1.4,-.46],[0,.8,-.47],[0,.3,-.42],[0,.08,-.4]],8);
    body.add(R.mesh(G.tube(cordPts,t=>.05-.012*t,12),tis({color:"#F3E7D3",uniforms:{uBump:.02,uNF:30}})));
    const nerveG=[];const nv=(pts,r)=>nerveG.push(G.tube(G.spline(pts,6),r||.012,6));
    /* đuôi ngựa: các rễ thần kinh thắt lưng – cùng đi xuống trong ống sống */
    for(let i=0;i<5;i++){const x=(i-2)*.018;nv([[x*.5,.1,-.4],[x,-.3,-.38],[x*1.4,-.62,-.32]],.006)}
    /* dây thần kinh tủy: từng đôi đi ra hai bên tủy sống; hạch thần kinh rễ sau */
    const gang=[];
    for(let k=0;k<20;k++){const t=.06+k*.045;const i=Math.min(cordPts.length-1,Math.round(t*(cordPts.length-1)));const p=cordPts[i];
      for(const s of [1,-1]){nv([[s*.03,p[1],p[2]],[s*.1,p[1]-.03,p[2]+.02],[s*.16,p[1]-.07,p[2]+.05]],.008);gang.push([s*.1,p[1]-.03,p[2]+.02])}}
    /* dây thần kinh liên sườn: men theo xương sườn ra trước */
    for(let k=0;k<8;k++){const y=1.5-k*.12;for(const s of [1,-1]){const pts=[];for(let i=0;i<=8;i++){const a=Math.PI*(1-.75*i/8);pts.push([s*Math.sin(a)*(.6+.18*Math.sin(Math.PI*k/9)),y-.2*i/8,-Math.cos(a)*.34])}nerveG.push(G.tube(pts,.006,5))}}
    /* đám rối cánh tay → dây thần kinh giữa, trụ, quay tới bàn tay */
    for(const s of [1,-1]){nv([[s*.08,1.92,-.3],[s*.4,1.62,-.18],[s*.72,1.4,-.08],[s*.82,.75,-.06],[s*.88,.05,-.0],[s*.92,-.22,.02]],.016);
      nv([[s*.82,.75,-.06],[s*.86,.4,.04],[s*.9,.0,.06],[s*.94,-.28,.06]],.009);nv([[s*.74,1.3,-.1],[s*.9,.8,-.12],[s*.93,.2,-.08],[s*.95,-.26,-.04]],.009);
      /* dây thần kinh hông (lớn nhất cơ thể) đi xuống chân */
      nv([[s*.08,-.35,-.36],[s*.28,-.8,-.18],[s*.3,-1.6,-.08],[s*.29,-2.3,-.06],[s*.28,-3.0,-.04],[s*.27,-3.62,0],[s*.27,-3.82,.22]],.02);
      nv([[s*.29,-2.25,-.06],[s*.34,-2.9,.06],[s*.3,-3.6,.08]],.009);
      /* dây thần kinh sọ: thị giác tới mắt, tới mặt */
      nv([[s*.03,2.42,-.04],[s*.1,2.47,.12],[s*.14,2.5,.28]],.01);nv([[s*.05,2.24,-.12],[s*.18,2.3,.08],[s*.22,2.2,.26]],.008)}
    body.add(R.mesh(G.merge(nerveG),{color:NERVE,rough:.4,coat:.3}));
    const gI=body.add(R.instanced(G.sphere(1,10,8),{color:"#E9B949",rough:.45},gang.length));{const D=gI.data,c=H("#E9B949");gang.forEach((p,i)=>{D.set([p[0],p[1],p[2],.022,c[0],c[1],c[2],1],i*8)});gI.setInstances(gang.length)}

    /* ================= 2. não bộ ================= */
    const brainN=root.add(new G.Node());brainN.pos=[NX,0,0];
    const BM={};let brainReady=false;
    brainN.add(R.mesh(G.tube(G.spline([[0,-.74,-.24],[0,-1.05,-.26],[0,-1.4,-.25]],5),t=>.08-.01*t,14),tis({color:"#F3E7D3"})));
    window.LabOrgans.build("buildBrain",128).then(P=>{if(K.dead)return;
      const mat={cerebrum:tis({uniforms:{uBump:.04,uNF:34}}),cerebellum:tis({uniforms:{uBump:.03,uNF:40}}),stem:tis({uniforms:{uBump:.02,uNF:30}})};
      for(const k of ["cerebrum","cerebellum","stem"]){BM[k]=brainN.add(R.mesh(P[k],mat[k]));brainBody.add(R.mesh(P[k],tis({color:"#FFD9CF",uniforms:{uBump:.03,uNF:30}})))}
      brainReady=true;done1()});

    /* ================= 3. phản xạ rụt tay ================= */
    const rfN=root.add(new G.Node());
    const C0=[PX-1.5,.35,0],CS=.9;const cw=(x,z,d)=>[C0[0]+x*CS,C0[1]-z*CS,(d||0)*CS+.012];   /* toạ độ trên mặt cắt tủy sống */
    const cordN=rfN.add(new G.Node());cordN.pos=C0;cordN.quat=G.Q.euler(Math.PI/2,0,0);cordN.scl=[CS,CS,CS];
    window.LabOrgans.build("buildCordSeg").then(P=>{if(K.dead)return;cordN.add(R.mesh(P.cord,tis({uniforms:{uBump:.02,uNF:24}})));done1()});
    /* màng tủy mỏng bao ngoài (cắt bớt để nhìn) */
    const S0=[PX-.2,.1,0],E0=[PX+1.2,-.35,0];const FL=1.25;
    const skinM={color:"#F4C3A2",alpha:.42,rough:.55,transparent:true,order:3,sheen:.45,wrap:.5};
    rfN.add(R.mesh(G.tube([V3.add(S0,[-.15,.05,0]),S0,E0],t=>.19-.04*t,20),skinM));
    rfN.add(R.mesh(G.sphere(.17,20,14),skinM)).pos=E0;
    /* xương cánh tay */
    rfN.add(R.mesh(G.tube([S0,E0],.045,10),{color:"#EFE6D6",rough:.45,alpha:.85,transparent:true,order:1}));
    /* cơ hai đầu ở mặt trước (trên) cánh tay */
    const bic=rfN.add(R.mesh(G.sphere(1,28,18),tis({color:"#C8443F",uniforms:{uBump:.05,uNF:30}})));
    const BA=V3.add(V3.lerp(S0,E0,.12),[0,.09,0]),BB=V3.add(V3.lerp(S0,E0,.92),[0,.07,0]);
    function placeBic(k){const a=BA,b=V3.add(BB,[0,0,0]);const c=V3.lerp(a,b,.5);const L=V3.dist(a,b)/2;bic.pos=V3.add(c,[0,.03*k,0]);const ang=Math.atan2(b[1]-a[1],b[0]-a[0]);bic.quat=G.Q.euler(0,0,ang);bic.scl=[L*(1-.12*k),.085*(1+.35*k),.11*(1+.25*k)]}
    placeBic(0);
    /* cẳng tay + bàn tay quay quanh khớp khuỷu */
    const fore=rfN.add(new G.Node());fore.pos=E0;
    fore.add(R.mesh(G.tube([[0,0,0],[FL*.5,-.01,0],[FL,-.02,0]],t=>.15-.06*t,18),skinM));
    fore.add(R.mesh(G.tube([[0,0,-.03],[FL,-.02,-.03]],.03,8),{color:"#EFE6D6",rough:.45,alpha:.85,transparent:true,order:1}));
    const handG=[G.fromSDF((x,y,z)=>window.LabOrgans.ell(x,y,z,[FL+.16,-.03,0],[.2,.075,.14]),[FL-.06,-.12,-.17],[FL+.4,.06,.17],[22,12,18])];
    for(let f=0;f<4;f++){const z=-.09+f*.06;handG.push(G.tube(G.spline([[FL+.3,-.03,z],[FL+.43,-.06,z*1.05],[FL+.52,-.12,z*1.1]],4),.027,7))}
    handG.push(G.tube(G.spline([[FL+.1,-.02,.12],[FL+.2,-.03,.2],[FL+.27,-.05,.24]],4),.026,6));
    fore.add(R.mesh(G.merge(handG),{color:"#EDB596",alpha:.85,rough:.5,transparent:true,order:2,sheen:.5,wrap:.5}));
    /* ngọn nến */
    const candle=rfN.add(new G.Node());candle.pos=[PX+2.55,-1.95,0];
    candle.add(R.mesh(G.cylinder(.13,.5,24),{color:"#F5EFE0",rough:.35,sheen:.5,coat:.3}));candle.add(R.mesh(G.cylinder(.006,.06,6),{color:"#222222"})).pos=[0,.5,0];
    const flame=candle.add(K3.flame(R,[1,.6,.15],[1,.95,.75]));flame.pos=[0,.52,0];flame.scl=[.55,.7,.55];
    /* đường đi của dây thần kinh */
    const rotZ=(p,a)=>[p[0]*Math.cos(a)-p[1]*Math.sin(a),p[0]*Math.sin(a)+p[1]*Math.cos(a),p[2]];
    const fw=(p)=>V3.add(E0,rotZ(p,S.rf.th));
    const RCP=[FL+.48,-.1,.03];     /* cơ quan thụ cảm ở da đầu ngón tay (toạ độ cẳng tay) */
    const SEN_F=[RCP,[FL+.2,-.07,.03],[FL*.6,-.08,.03],[.05,-.07,.03]];
    const MOT_A=V3.lerp(BA,BB,.55);
    const G1=cw(.95,-.62),J=cw(1.35,-.05);
    const senArm=[V3.add(E0,[-.06,-.07,.03]),V3.add(V3.lerp(S0,E0,.5),[0,-.08,.03]),V3.add(S0,[0,-.06,.03]),V3.add(J,[.25,-.02,.03]),V3.add(J,[0,0,.03])];
    const senRoot=[V3.add(J,[0,0,.03]),G1,cw(.55,-.52),cw(.3,-.45),cw(.2,-.3)];
    const inter=[cw(.2,-.3),cw(.12,-.06),cw(.14,.12),cw(.24,.22)];
    const motRoot=[cw(.24,.22),cw(.4,.36),cw(.85,.3),V3.add(J,[0,-.05,-.03])];
    const motArm=[V3.add(J,[0,-.05,-.03]),V3.add(J,[.25,-.06,-.03]),V3.add(S0,[0,-.02,-.03]),V3.add(V3.lerp(S0,E0,.3),[0,.0,-.03]),MOT_A];
    const COLS="#60A5FA",COLM="#F87171",COLI="#C4B5FD";
    rfN.add(R.mesh(G.tube(G.spline(senArm,6),.018,6),{color:COLS,rough:.35,coat:.3}));rfN.add(R.mesh(G.tube(G.spline(senRoot,6),.016,6),{color:COLS,rough:.35}));
    rfN.add(R.mesh(G.tube(G.spline(motRoot,6),.016,6),{color:COLM,rough:.35}));rfN.add(R.mesh(G.tube(G.spline(motArm,6),.018,6),{color:COLM,rough:.35,coat:.3}));
    rfN.add(R.mesh(G.tube(G.spline(inter,5),.012,6),{color:COLI,rough:.35}));
    fore.add(R.mesh(G.tube(G.spline(SEN_F,6),.018,6),{color:COLS,rough:.35,coat:.3}));
    /* thân nơron: nơron cảm giác ở hạch rễ sau, nơron trung gian, nơron vận động ở sừng trước */
    rfN.add(R.mesh(G.sphere(.11,20,14),tis({color:"#E9B949"}))).pos=G1;
    for(const [p,c,r] of [[G1,COLS,.045],[cw(.13,0),COLI,.03],[cw(.24,.22),COLM,.045]])rfN.add(R.mesh(G.sphere(r,14,10),{color:c,rough:.3})).pos=V3.add(p,[0,0,.03]);
    /* đầu mút cảm giác ở da và tấm vận động trên cơ */
    const rcpM=fore.add(R.mesh(G.sphere(.035,12,8),{type:"unlit",color:"#93C5FD"}));rcpM.pos=RCP;
    const pulse=rfN.add(R.mesh(G.sphere(.06,16,12),{type:"unlit",color:"#FFFFFF",alpha:.95,transparent:true,order:6}));pulse.visible=false;
    const halo=rfN.add(R.mesh(G.sphere(.12,16,12),{type:"unlit",color:"#FDE68A",alpha:.35,transparent:true,order:6,depth:false}));halo.visible=false;
    /* ================= 4–5. mắt ================= */
    const eyeN=root.add(new G.Node());eyeN.pos=[EX,0,0];
    const shellN=eyeN.add(new G.Node());const EM={};
    const lensN=eyeN.add(new G.Node());lensN.pos=[-.7,0,0];
    const glassM={type:"glass",color:"#EAF6FF",alpha:.35};
    window.LabOrgans.build("buildEye").then(P=>{if(K.dead)return;
      const t2=(c,o)=>tis(Object.assign({color:c||"#FFFFFF"},o||{}));
      EM.sclera=shellN.add(R.mesh(P.sclera,t2(null,{uniforms:{uBump:.02,uNF:14}})));EM.choroid=shellN.add(R.mesh(P.choroid,t2()));EM.retina=shellN.add(R.mesh(P.retina,t2(null,{uniforms:{uBump:.03,uNF:30}})));
      EM.macula=shellN.add(R.mesh(P.macula,t2()));EM.nerve=shellN.add(R.mesh(P.nerve,t2(null,{uniforms:{uBump:.03,uNF:22}})));
      EM.vitreous=shellN.add(R.mesh(P.vitreous,{type:"glass",color:"#DDF1FF",alpha:.12,order:2}));
      EM.cornea=eyeN.add(R.mesh(P.cornea,{type:"glass",color:"#E6F6FF",alpha:.4,order:3}));EM.iris=eyeN.add(R.mesh(P.iris,t2(null,{uniforms:{uBump:.04,uNF:40}})));
      EM.ciliary=eyeN.add(R.mesh(P.ciliary,t2()));EM.zonule=eyeN.add(R.mesh(P.zonule,{color:"#E7D9C5",rough:.6}));
      const lg=P.lens;for(let i=0;i<lg.pos.length;i+=3)lg.pos[i]+=.7;EM.lens=lensN.add(R.mesh(lg,{type:"glass",color:"#FFF8E1",alpha:.55,order:3}));
      done1()});
    /* thủy dịch: vùng trong suốt giữa giác mạc và mống mắt */
    /* kính đeo: thấu kính phân kì hoặc hội tụ, đặt trước mắt */
    const XG=-2.9;
    const mkLens=conv=>{const f=conv?(x,y,z)=>Math.max(Math.hypot(x-1.05,y,z)-1.15,Math.hypot(x+1.05,y,z)-1.15,Math.hypot(y,z)-.62)
        :(x,y,z)=>Math.max(Math.max(Math.abs(x)-.13,Math.hypot(y,z)-.62),Math.max(-(Math.hypot(x-1.2,y,z)-1.15),-(Math.hypot(x+1.2,y,z)-1.15)));
      const g=G.fromSDF((x,y,z)=>Math.max(f(x,y,z),z-.0),[-.16,-.66,-.66],[.16,.66,.02],[14,46,24]);const n=eyeN.add(R.mesh(g,{type:"glass",color:"#D6F0FF",alpha:.5,order:3}));n.pos=[XG,0,0];return n};
    const lensPK=mkLens(false),lensHT=mkLens(true);
    const rayN=eyeN.add(new G.Node());const spot=eyeN.add(R.mesh(G.sphere(1,18,12),{type:"unlit",color:"#FDE047",alpha:.75,transparent:true,order:7,depth:false}));
    const objN=eyeN.add(new G.Node());const star=objN.add(R.mesh(G.sphere(.07,16,12),{type:"unlit",color:"#FDE047"}));
    const XO=-4.7,XP=-1.2,D0=2.25,XC=-1.36,XL=-.7;
    function eyeCalc(){const E=EYE[S.eye],O=OBJ[S.obj];const Pg=S.kinh?E.kinh:0;const V=O.V+Pg;const need=1/E.L-V;const P=C.clamp(need,E.P[0],E.P[1]);const v=1/(V+P);
      const map=u=>XP+D0*(1+(u*60-1)*EXG);return{E,O,Pg,V,need,P,v,ximg:map(v),xret:map(E.L),ok:Math.abs(need-P)<.05}}
    let rayKey=null;
    function buildRays(){const c=eyeCalc();const key=S.eye+S.obj+S.kinh;
      const sx=(c.xret+.98)/(1.05+.98);shellN.scl=[sx,1,1];shellN.pos=[-.98*(1-sx),0,0];
      lensN.scl=[1+(c.P-60)/28,1,1];
      lensPK.visible=S.kinh&&c.Pg<0;lensHT.visible=S.kinh&&c.Pg>0;objN.visible=S.obj==="gan";star.pos=[XO,0,.02];
      if(key===rayKey)return c;rayKey=key;
      rayN.children.slice().forEach(n=>rayN.remove(n));
      const hs=[-.17,-.085,0,.085,.17];const Pd=.075;   /* độ lệch tia vẽ ở kính: 0,075 đơn vị hình / dioptre */
      const hit=[];const tubes=[];
      for(const h of hs){const pts=[];let x0=XO-.6,y0=h,s0=0;
        if(S.obj==="gan"){x0=XO;y0=0}
        /* tia tới kính (nếu có) rồi tới giác mạc */
        let hg,sl;
        const fac=S.obj==="gan"?(1+(1/(XG-XO)-(S.kinh?c.Pg*Pd:0))*(XC-XG)):1;
        if(S.kinh){hg=S.obj==="gan"?h/fac:h;sl=(S.obj==="gan"?hg/(XG-XO):0)-hg*c.Pg*Pd;pts.push([x0,y0,.02],[XG,hg,.02]);var hc=hg+sl*(XC-XG)}
        else{hc=h;pts.push([x0,y0,.02])}
        const sag=hc*hc/(2*.78);pts.push([XC+sag,hc,.02]);
        /* qua giác mạc lệch một phần, qua thể thủy tinh hội tụ về điểm ảnh */
        const yl=hc*(1-.35*(XL-XC)/Math.max(.3,c.ximg-XC)*1.6);pts.push([XL,yl,.02]);
        /* từ thể thủy tinh đi tới điểm ảnh rồi tiếp tục tới màng lưới */
        const dx=c.ximg-XL,dy=-yl;const L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L;
        /* giao với màng lưới (elip do cầu mắt giãn theo x) */
        const sx=(c.xret+.98)/(1.05+.98),piv=-.98,Rr=1.05;let tHit=null;
        for(let t=.1;t<6;t+=.01){const X=XL+ux*t,Y=yl+uy*t;const xx=(X-piv)/sx+piv;if(xx>0&&xx*xx+Y*Y>=Rr*Rr){tHit=t;break}}
        const tEnd=tHit==null?L:tHit;pts.push([XL+ux*tEnd,yl+uy*tEnd,.02]);hit.push(yl+uy*tEnd);
        tubes.push(G.tube(pts,.011,5))}
      rayN.add(R.mesh(G.merge(tubes),{type:"unlit",color:"#FDE047",alpha:.9,transparent:true,order:6}));
      const spr=Math.max(...hit)-Math.min(...hit);c.spread=spr;
      spot.pos=[c.xret,0,.03];const r=Math.max(.035,spr/2);spot.scl=[.02,r,r];
      S.spread=spr;return c}

    /* ================= nhãn ================= */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    lab("Não bộ (trung ương)",[.12,2.62,-.05],"tongquan",{dir:"e",len:60});lab("Tủy sống (trung ương)",[0,1.0,-.47],"tongquan",{dir:"w",len:70});
    lab("Dây thần kinh (ngoại biên)",[.3,-1.6,-.08],"tongquan",{dir:"e",len:60});lab("Hạch thần kinh (ngoại biên)",[-.1,1.3,-.42],"tongquan",{dir:"w",len:50});
    lab("Đại não",[NX+.3,.45,.2],"nao",{dir:"n",len:40});lab("Tiểu não",[NX+.3,-.42,-.62],"nao",{dir:"e",len:50});lab("Trụ não",[NX+.08,-.55,-.18],"nao",{dir:"s",len:40});
    lab("Tủy sống",[NX+.06,-1.25,-.25],"nao",{dir:"e",len:40});lab("Rãnh bên",[NX+.66,-.05,.2],"nao",{dir:"w",len:60});
    lab("Chất xám",cw(-.2,.1,0),"phanxa",{dir:"w",len:50});lab("Chất trắng",cw(-.48,-.1,0),"phanxa",{dir:"w",len:40});lab("Hạch thần kinh",V3.add(G1,[0,.1,0]),"phanxa",{dir:"n",len:40});
    const lR=lab("Cơ quan thụ cảm",()=>fw(RCP),"phanxa",{dir:"e",len:50});lab("Dây cảm giác (hướng tâm)",V3.lerp(senArm[1],senArm[2],.4),"phanxa",{dir:"s",len:70});
    lab("Dây vận động (li tâm)",V3.add(motArm[2],[.1,.02,0]),"phanxa",{dir:"n",len:60});lab("Cơ hai đầu (cơ quan phản ứng)",()=>V3.add(bic.pos,[0,bic.scl[1],0]),"phanxa",{dir:"n",len:40});
    lab("Tủy sống",cw(0,-.5,0),"phanxa",{dir:"n",len:60});
    const E=(p)=>[EX+p[0],p[1],p[2]];
    lab("Giác mạc",E([-1.33,.35,0]),"mat",{dir:"nw",len:40});lab("Thủy dịch",E([-1.1,-.12,0]),"mat",{dir:"sw",len:60});lab("Lòng đen (mống mắt)",E([-.93,.45,0]),"mat",{dir:"n",len:60});
    lab("Con ngươi (đồng tử)",E([-.93,-.05,0]),"mat",{dir:"w",len:70});lab("Thể thủy tinh",E([-.7,-.25,0]),"mat",{dir:"s",len:70});lab("Thể mi",E([-.78,.66,0]),"mat",{dir:"ne",len:30});
    lab("Dịch thủy tinh",E([.2,.35,0]),"mat",{dir:"n",len:30});lab("Màng cứng",E([.3,1.16,0]),"mat",{dir:"n",len:30});lab("Màng mạch",E([.75,.83,0]),"mat",{dir:"ne",len:40});
    lab("Màng lưới",E([.98,.35,0]),"mat",{dir:"e",len:50});lab("Điểm vàng",E([1.05,0,0]),"mat",{dir:"e",len:40});lab("Điểm mù",E([1.0,-.27,0]),"mat",{dir:"se",len:40});
    lab("Dây thần kinh thị giác",E([1.75,-.52,0]),"mat",{dir:"s",len:40});
    const lRet=lab("Màng lưới",()=>E([eyeCalc().xret,.45,0]),"tat",{dir:"ne",len:40});const lImg=lab("",()=>E([C.clamp(eyeCalc().ximg,-.5,1.8),0,.02]),"tat",{dir:"s",len:110});
    const lKinh=lab("",E([XG,.62,0]),"tat",{dir:"n",len:30});lab("Thể thủy tinh",E([-.7,.42,0]),"tat",{dir:"n",len:60});
    const lObj=lab("Vật (nguồn sáng)",E([XO,0,0]),"tat",{dir:"s",len:40});

    /* ================= cập nhật ================= */
    const PATH=()=>{const a=SEN_F.map(fw),b=senArm,c=senRoot,d=inter,e=motRoot,f=motArm;return{sen:G.spline(a.concat(b.slice(1),c.slice(1)),4),inter:G.spline(d,4),mot:G.spline(e.concat(f.slice(1)),4)}};
    const along=(pts,u)=>{let L=0;const ls=[0];for(let i=1;i<pts.length;i++){L+=V3.dist(pts[i],pts[i-1]);ls.push(L)}const t=u*L;let i=1;while(i<ls.length-1&&ls[i]<t)i++;const k=(t-ls[i-1])/((ls[i]-ls[i-1])||1);return V3.lerp(pts[i-1],pts[i],C.clamp(k,0,1))};
    const PH={reach:1.1,sen:1.8,tw:.8,mot:1.6,pu:.9};let path=null;
    K.onFrame((dt,rdt)=>{const v=K.view;
      body.visible=v==="tongquan";brainN.visible=v==="nao";rfN.visible=v==="phanxa";eyeN.visible=v==="mat"||v==="tat";rayN.visible=spot.visible=v==="tat";
      if(eyeN.visible){const c=buildRays();if(v!=="tat"){shellN.scl=[1,1,1];shellN.pos=[0,0,0];lensN.scl=[1,1,1];lensPK.visible=lensHT.visible=objN.visible=false}
        else{lImg.set(c.ok?"Ảnh hiện đúng trên màng lưới":c.ximg<c.xret?"Ảnh hiện trước màng lưới":"Ảnh hiện sau màng lưới");lKinh.set(S.kinh?(c.Pg<0?`Kính phân kì ${fmt(c.Pg,0)} D`:c.Pg>0?`Kính hội tụ +${fmt(c.Pg,0)} D`:""):"");lKinh.on=S.kinh&&c.Pg!==0;lObj.on=S.obj==="gan";
          const key=`${S.eye}|${S.obj}|${S.kinh?1:0}`;if(key!==S.lastKey){S.lastKey=key;S.obsT=0}else S.obsT+=rdt;
          if(S.obsT>1.2&&!S.obs[key]){S.obs[key]=1;rec(`${c.E.ten}, ${c.O.ten.toLowerCase()}, ${S.kinh&&c.Pg?(c.Pg<0?"đeo kính phân kì":"đeo kính hội tụ"):"không đeo kính"}`,
            `${c.ok?"ảnh hiện trên màng lưới: nhìn rõ":c.ximg<c.xret?"ảnh hiện trước màng lưới: nhìn mờ":"ảnh hiện sau màng lưới: nhìn mờ"} (mắt cần độ tụ ${fmt(c.need,0)} D, điều tiết được ${c.E.P[0]}–${c.E.P[1]} D)`);refresh()}}}
      else{lKinh.on=false;lObj.on=false}
      /* phản xạ */
      const F=S.rf;if(F.ph!=="idle"&&F.ph!=="done"){F.t+=dt;const T=PH[F.ph];const u=C.clamp(F.t/T,0,1);
        if(F.ph==="reach"){F.th=-.2-.25*(.5-.5*Math.cos(Math.PI*u))}
        if(F.ph==="sen"||F.ph==="tw"||F.ph==="mot"){if(!path)path=PATH();const pts=F.ph==="sen"?path.sen:F.ph==="tw"?path.inter:path.mot;const p=along(pts,u);pulse.pos=p;halo.pos=p;pulse.visible=halo.visible=true;
          halo.mat.color=H(F.ph==="sen"?COLS:F.ph==="tw"?COLI:COLM)}
        else{pulse.visible=halo.visible=false}
        if(F.ph==="pu"){F.th=-.45+1.05*(.5-.5*Math.cos(Math.PI*u));placeBic(.5-.5*Math.cos(Math.PI*u))}
        if(u>=1){const order=["reach","sen","tw","mot","pu"];const i=order.indexOf(F.ph);F.t=0;if(i<order.length-1)F.ph=order[i+1];else{F.ph="done";path=null;S.rfN++;
          if(!S.rfDone){S.rfDone=true}rec("Phản xạ rụt tay khi chạm ngọn nến",`da đầu ngón tay → dây thần kinh cảm giác → tủy sống → dây thần kinh vận động → cơ hai đầu co, cẳng tay gập lên, tay rời xa ngọn nến`);refresh()}
          K.updateInfo(true)}}
      fore.quat=G.Q.euler(0,0,F.th);
      flame.scl=[.55*(1+.05*Math.sin(K.simT*23)),.7*(1+.08*Math.sin(K.simT*17)),.55];
      rcpM.mat.color=H(F.ph==="reach"&&F.t>.8||F.ph==="sen"&&F.t<.3?"#FFFFFF":"#93C5FD");
      /* làm nổi bộ phận não được chọn */
      if(brainReady)for(const k in BM){const hi=!S.sel||S.sel===k;BM[k].mat.alpha=hi?1:.25;BM[k].mat.transparent=!hi;BM[k].mat.order=hi?0:2}});

    /* ================= chạm ================= */
    K.pickFn((x,y)=>{const v=K.view;const r=R.ray(x,y);let best=null,bd=1e9;const tb=(k,mn,mx)=>{const t=G.hit.box(r,mn,mx);if(t!=null&&t<bd){bd=t;best=k}};
      if(v==="tongquan"){tb("nao",[-.32,2.25,-.4],[.32,2.75,.3]);tb("tuy",[-.07,.05,-.55],[.07,2.15,-.3]);
        for(const s of [1,-1]){tb("day",[s>0?.6:-1.0,-.4,-.25],[s>0?1.0:-.6,1.5,.15]);tb("day",[s>0?.15:-.45,-3.7,-.25],[s>0?.45:-.15,-.9,.3])}return best?{k:best}:null}
      if(v==="nao"){const o=[NX,0,0];tb("cerebellum",[NX-.5,-.6,-.82],[NX+.5,-.16,-.25]);if(best)return{k:best};tb("stem",[NX-.16,-.78,-.32],[NX+.16,-.12,.02]);tb("cerebrum",[NX-.75,-.4,-.88],[NX+.75,.56,.88]);
        /* tiểu não nằm sau – dưới: ưu tiên nếu tia trúng hộp của nó */return best?{k:best}:null}
      return null});
    const TQ={nao:"Não nằm trong hộp sọ: bộ phận trung ương.",tuy:"Tủy sống nằm trong ống xương sống: bộ phận trung ương.",day:"Dây thần kinh tỏa tới mọi cơ quan; cùng với hạch thần kinh là bộ phận ngoại biên."};
    K.tapFn(k=>{if(!k)return;if(K.view==="tongquan"){S.seen[k.k]=1;S.tq=k.k;api.toast(TQ[k.k],"info",2600)}
      else if(K.view==="nao"){S.sel=S.sel===k.k?null:k.k;if(S.sel&&!S.bseen[S.sel]){S.bseen[S.sel]=1;rec(`Não bộ: ${BRAIN[S.sel].ten}`,BRAIN[S.sel].ct)}}refresh()});

    /* ================= khay ================= */
    K.dockFn(()=>{const v=K.view;
      if(v==="tongquan")return[{k:"tq",v:"nao",label:"Não",icon:IC.eye,on:S.tq==="nao"},{k:"tq",v:"tuy",label:"Tủy sống",icon:IC.eye,on:S.tq==="tuy"},{k:"tq",v:"day",label:"Dây thần kinh",icon:IC.eye,on:S.tq==="day"}];
      if(v==="nao")return[{grid:Object.keys(BRAIN).map(k=>({k:"br",v:k,label:BRAIN[k].ten,icon:IC.eye,on:S.sel===k}))},{k:"br",v:"",label:"Hiện tất cả",icon:IC.grid,dis:!S.sel}];
      if(v==="phanxa"){const busy=S.rf.ph!=="idle"&&S.rf.ph!=="done";return[{k:"rf",label:"Đưa tay lại gần ngọn nến",icon:IC.hand,dis:busy},{k:"rfr",label:"Đặt tay về chỗ cũ",icon:IC.reset,dis:busy||S.rf.ph==="idle"}]}
      if(v==="mat")return[];
      return[{seg:Object.keys(EYE).map(k=>({k:"eye",v:k,label:EYE[k].ten.replace("Mắt ",""),icon:"",on:S.eye===k})),label:"Loại mắt"},
        {seg:[{k:"obj",v:"xa",label:"Vật ở xa",icon:"",on:S.obj==="xa"},{k:"obj",v:"gan",label:"Vật ở gần",icon:"",on:S.obj==="gan"}],label:"Vật"},
        {k:"kinh",label:S.kinh?"Bỏ kính":"Đeo kính",icon:IC.lens,on:S.kinh,dis:S.eye==="thuong"}]});
    K.onDock((k,v)=>{if(k==="tq"){S.seen[v]=1;S.tq=v;api.toast(TQ[v],"info",2600)}
      else if(k==="br"){S.sel=v||null;if(S.sel&&!S.bseen[S.sel]){S.bseen[S.sel]=1;rec(`Não bộ: ${BRAIN[S.sel].ten}`,BRAIN[S.sel].ct)}}
      else if(k==="rf"){S.rf={ph:"reach",t:0,th:-.2};placeBic(0);if(!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}
      else if(k==="rfr"){S.rf={ph:"idle",t:0,th:-.2};placeBic(0)}
      else if(k==="eye"){S.eye=v;if(v==="thuong")S.kinh=false}else if(k==="obj")S.obj=v;else if(k==="kinh")S.kinh=!S.kinh;
      refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="tongquan")return `<div><b>Hệ thần kinh</b></div><div><i style="background:#F3B7A8"></i>Bộ phận trung ương: não, tủy sống</div><div><i style="background:${NERVE}"></i>Bộ phận ngoại biên: dây thần kinh, hạch thần kinh</div><small>Chạm vào não, tủy sống hoặc một dây thần kinh ở tay, chân.</small>`;
      if(v==="nao"){const b=S.sel?BRAIN[S.sel]:null;return b?`<div><b>${b.ten}</b></div><small>${b.ct}</small>`:`<div><b>Não bộ</b> (nhìn từ bên trái)</div><div>Đại não · tiểu não · trụ não</div><small>Chạm vào từng phần để xem chức năng. Não trung gian nằm sâu bên trong, bị đại não che khuất.</small>`}
      if(v==="phanxa"){const ph=S.rf.ph;const cur={reach:-1,sen:1,tw:2,mot:3,pu:4,done:5,idle:-2}[ph];
        return `<div><b>Cung phản xạ rụt tay</b></div>${ARC.map((a,i)=>`<div style="${cur===i||(ph==="sen"&&i===0&&S.rf.t<.3)?"font-weight:800;color:var(--acc,#FDE047)":cur>i?"opacity:.85":"opacity:.6"}"><i style="background:${[ "#93C5FD",COLS,COLI,COLM,"#C8443F"][i]}"></i>${i+1}. ${a[1]}</div>`).join("")}<small>${ph==="idle"?"Bấm “Đưa tay lại gần ngọn nến”.":ph==="done"?"Tay đã rụt lại. Xung thần kinh được làm chậm để quan sát.":"Xung thần kinh đang truyền (đã làm chậm)."}</small>`}
      if(v==="mat")return `<div><b>Cấu tạo cầu mắt</b> (cắt đôi)</div><div>Ba lớp màng: màng cứng, màng mạch, màng lưới</div><div>Môi trường trong suốt: giác mạc, thủy dịch, thể thủy tinh, dịch thủy tinh</div><small>Ánh sáng đi từ trái sang phải, tạo ảnh trên màng lưới; điểm vàng nhìn rõ nhất, điểm mù không có tế bào thụ cảm thị giác.</small>`;
      const c=eyeCalc();return `<div><b>${c.E.ten}</b> · ${c.O.ten.toLowerCase()}</div><div>${S.kinh&&c.Pg?(c.Pg<0?`Đeo kính phân kì ${fmt(c.Pg,0)} D`:`Đeo kính hội tụ +${fmt(c.Pg,0)} D`):"Không đeo kính"}</div><div>Độ tụ mắt cần: ${fmt(c.need,0)} D · mắt điều tiết được ${c.E.P[0]}–${c.E.P[1]} D</div><div><b>${c.ok?"Ảnh rõ nét trên màng lưới":c.ximg<c.xret?"Ảnh trước màng lưới: nhìn mờ":"Ảnh sau màng lưới: nhìn mờ"}</b></div><small>Hình phóng đại 4 lần độ chênh chiều dài cầu mắt.</small>`});
    K.timeLabel(()=>{const v=K.view;if(v==="phanxa"){const ph=S.rf.ph;return ph==="idle"?"Sẵn sàng":ph==="done"?`Đã rụt tay (${S.rfN} lần)`:{reach:"Tay đưa lại gần ngọn nến",sen:"Xung thần kinh cảm giác về tủy sống",tw:"Tủy sống xử lí, chuyển sang nơron vận động",mot:"Xung thần kinh vận động tới cơ",pu:"Cơ hai đầu co, cẳng tay gập lên"}[ph]}
      if(v==="tat"){const c=eyeCalc();return `Độ tụ mắt ${fmt(c.P,1)} D`}return K.views[v].label});
    K.onReset(()=>{S.rf={ph:"idle",t:0,th:-.2};placeBic(0);refresh()});
    /* trạm tự động */K.autoStations&&K.autoStations();
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"rf",p:()=>V3.add(candle.pos,[0,.55,0]),tip:"Chạm để đưa tay lại gần ngọn nến",view:"phanxa"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){S.seen={nao:1,tuy:1,day:1};["cerebrum","cerebellum","stem"].forEach(k=>{S.bseen[k]=1;rec(`Não bộ: ${BRAIN[k].ten}`,BRAIN[k].ct)});S.rf={ph:"reach",t:0,th:-.2};
        for(const [e,o,g] of [["can","xa",0],["can","xa",1],["vien","gan",0],["vien","gan",1]]){S.eye=e;S.obj=o;S.kinh=!!g;const c=eyeCalc();S.obs[`${e}|${o}|${g}`]=1;rec(`${c.E.ten}, ${c.O.ten.toLowerCase()}, ${g?"đeo kính":"không đeo kính"}`,c.ok?"ảnh hiện trên màng lưới":c.ximg<c.xret?"ảnh hiện trước màng lưới":"ảnh hiện sau màng lưới")}
        S.eye="can";S.obj="xa";S.kinh=false;refresh()}};
    return K.mount(st)}
});
})();
