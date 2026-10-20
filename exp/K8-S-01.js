/* K8-S-01 · Khái quát về cơ thể người: các hệ cơ quan (SGK KHTN 8 – Kết nối tri thức, Bài 30) · 3D
   Thân người mờ; mỗi phần hiện một hệ cơ quan dựng theo hình giải phẫu (LabOrgans, LabBody):
   vận động (bộ xương), tuần hoàn (tim, động mạch, tĩnh mạch), hô hấp, tiêu hóa, bài tiết (thận, niệu quản, bóng đái),
   thần kinh (não, tủy sống, dây thần kinh), nội tiết (tuyến yên, tuyến giáp, tuyến tụy, tuyến trên thận); khoang ngực – khoang bụng.
   Chạm vào cơ quan để xem tên, thuộc hệ nào, chức năng. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const SYS={
  vandong:{ten:"Hệ vận động",cq:"Bộ xương và hệ cơ",cn:"Nâng đỡ, bảo vệ cơ thể; giúp cơ thể cử động và di chuyển."},
  tuanhoan:{ten:"Hệ tuần hoàn",cq:"Tim và hệ mạch (động mạch, tĩnh mạch, mao mạch)",cn:"Vận chuyển chất dinh dưỡng, O₂, hormone tới tế bào và vận chuyển CO₂, chất thải tới cơ quan bài tiết."},
  hohap:{ten:"Hệ hô hấp",cq:"Đường dẫn khí (mũi, họng, thanh quản, khí quản, phế quản) và hai lá phổi",cn:"Lấy O₂ từ môi trường vào cơ thể và thải CO₂ ra ngoài."},
  tieuhoa:{ten:"Hệ tiêu hóa",cq:"Ống tiêu hóa và tuyến tiêu hóa",cn:"Biến đổi thức ăn thành chất dinh dưỡng, hấp thụ chất dinh dưỡng vào máu, thải chất cặn bã."},
  baitiet:{ten:"Hệ bài tiết",cq:"Hệ bài tiết nước tiểu: thận, ống dẫn nước tiểu, bóng đái, ống đái (da và phổi cũng tham gia bài tiết)",cn:"Lọc máu, thải chất thải, chất độc, chất dư thừa ra ngoài; giữ ổn định môi trường trong cơ thể."},
  thankinh:{ten:"Hệ thần kinh",cq:"Não, tủy sống, dây thần kinh, hạch thần kinh",cn:"Điều khiển, điều hòa và phối hợp hoạt động của các cơ quan; tiếp nhận và trả lời kích thích."},
  noitiet:{ten:"Hệ nội tiết",cq:"Các tuyến nội tiết: tuyến yên, tuyến giáp, tuyến tụy, tuyến trên thận, tuyến sinh dục…",cn:"Tiết hormone vào máu, điều hòa các quá trình sinh lí của cơ thể."},
  khoang:{ten:"Khoang cơ thể",cq:"Khoang ngực và khoang bụng, ngăn cách bởi cơ hoành",cn:"Khoang ngực chứa tim, phổi; khoang bụng chứa dạ dày, ruột, gan, tụy, thận, bóng đái…"}};
/* cơ quan chạm được: [khóa, tên, hệ, chức năng, hộp chạm min, max] */
const ORG=[
  ["skull","Xương đầu (hộp sọ)","vandong","Bảo vệ não.",[-.36,2.05,-.48],[.36,2.8,.4]],["ribs","Lồng ngực","vandong","Bảo vệ tim, phổi.",[-.8,.7,-.5],[.8,1.55,.35]],
  ["spine","Cột sống","vandong","Trụ đỡ của cơ thể, bảo vệ tủy sống.",[-.1,-.8,-.55],[.1,1.9,-.25]],["leg","Xương chi dưới","vandong","Nâng đỡ cơ thể, giúp di chuyển.",[-.45,-3.9,-.2],[.45,-.9,.4]],
  ["heart","Tim","tuanhoan","Co bóp đẩy máu đi khắp cơ thể.",[-.22,.82,-.12],[.3,1.28,.3]],["art","Động mạch","tuanhoan","Dẫn máu từ tim đi tới các cơ quan.",[.15,-3.8,-.2],[.4,-.9,.2]],
  ["vein","Tĩnh mạch","tuanhoan","Dẫn máu từ các cơ quan trở về tim.",[-.4,-3.8,-.2],[-.15,-.9,.2]],
  ["lung","Phổi","hohap","Nơi trao đổi khí giữa không khí trong phế nang và máu.",[-.9,.35,-.45],[.9,1.65,.35]],["trachea","Khí quản","hohap","Dẫn khí vào, ra phổi; làm ẩm, làm ấm, lọc không khí.",[-.08,1.6,-.2],[.08,2.0,0]],
  ["stomach","Dạ dày","tieuhoa","Chứa và biến đổi thức ăn (co bóp, enzyme pepsin).",[-.05,.15,-.2],[.62,.85,.35]],["liver","Gan","tieuhoa","Tiết dịch mật, dự trữ chất, khử độc.",[-.82,.3,-.25],[-.05,.95,.38]],
  ["si","Ruột non","tieuhoa","Tiêu hóa và hấp thụ phần lớn chất dinh dưỡng.",[-.35,-.8,-.05],[.38,.05,.3]],["li","Ruột già","tieuhoa","Hấp thụ nước, tạo và thải phân.",[-.6,-1.0,-.15],[.6,.2,.25]],
  ["kidney","Thận","baitiet","Lọc máu, tạo nước tiểu.",[-.45,.2,-.42],[.45,.65,-.18]],["bladder","Bóng đái","baitiet","Chứa nước tiểu trước khi thải ra ngoài.",[-.18,-1.2,-.07],[.18,-.88,.23]],
  ["ureter","Ống dẫn nước tiểu","baitiet","Dẫn nước tiểu từ thận xuống bóng đái.",[-.25,-.9,-.3],[.25,.3,0]],
  ["brain","Não","thankinh","Trung ương thần kinh: điều khiển, điều hòa hoạt động của cơ thể.",[-.32,2.25,-.4],[.32,2.75,.3]],["cord","Tủy sống","thankinh","Trung ương thần kinh: dẫn truyền và điều khiển các phản xạ.",[-.07,.05,-.55],[.07,2.15,-.3]],
  ["nerve","Dây thần kinh","thankinh","Dẫn truyền xung thần kinh giữa trung ương và các cơ quan.",[.6,-.4,-.25],[1.0,1.5,.15]],
  ["pituitary","Tuyến yên","noitiet","Tiết hormone điều khiển hoạt động của nhiều tuyến nội tiết khác, hormone tăng trưởng.",[-.06,2.28,-.03],[.06,2.38,.07]],
  ["thyroid","Tuyến giáp","noitiet","Tiết hormone thyroxine điều hòa trao đổi chất.",[-.12,1.73,0],[.12,1.93,.12]],
  ["pancreas","Tuyến tụy","noitiet","Tiết insulin và glucagon điều hòa lượng đường trong máu (còn tiết dịch tụy tiêu hóa).",[-.25,.1,-.27],[.5,.42,.02]],
  ["adrenal","Tuyến trên thận","noitiet","Tiết adrenaline và một số hormone khác.",[-.38,.6,-.35],[.38,.74,-.23]]];

const SPEC={
  predict:[{id:"p1",q:"Cơ quan nào ngăn cách khoang ngực và khoang bụng?",opts:[["coh","Cơ hoành"],["xs","Xương sườn"],["da","Dạ dày"]],ans:"coh",res:"Kết quả: cơ hoành ngăn cách khoang ngực (tim, phổi) và khoang bụng."},
    {id:"p2",q:"Tim thuộc hệ cơ quan nào?",opts:[["th","Hệ tuần hoàn"],["hh","Hệ hô hấp"],["tk","Hệ thần kinh"]],ans:"th",res:"Kết quả: tim cùng hệ mạch tạo thành hệ tuần hoàn."}],
  taskLead:"Chọn từng hệ cơ quan ở khay. Kéo để xoay, cuộn để phóng to; chạm vào cơ quan để xem tên và chức năng.",
  tasks:[{html:"Xem đủ 7 hệ cơ quan ở khay.",done:()=>["vandong","tuanhoan","hohap","tieuhoa","baitiet","thankinh","noitiet"].every(k=>S.seen[k])},
    {html:"Chạm vào ít nhất 6 cơ quan khác nhau.",done:()=>Object.keys(S.org).length>=6},
    {html:"Xem khoang ngực, khoang bụng và cơ hoành.",done:()=>!!S.seen.khoang}],
  obs:[{id:"a",q:"Hệ cơ quan vận chuyển O₂, chất dinh dưỡng tới tế bào là:",opts:[["th","Hệ tuần hoàn"],["tk","Hệ thần kinh"],["bt","Hệ bài tiết"]],ans:"th",why:"Máu do tim bơm đi theo hệ mạch mang O₂, chất dinh dưỡng tới tế bào."},
    {id:"b",q:"Thận, ống dẫn nước tiểu, bóng đái thuộc:",opts:[["bt","Hệ bài tiết"],["th","Hệ tiêu hóa"],["nt","Hệ nội tiết"]],ans:"bt",why:"Đó là hệ bài tiết nước tiểu."},
    {id:"c",q:"Khi chạy, nhịp tim và nhịp thở cùng tăng. Điều đó cho thấy:",opts:[["phoi","Các hệ cơ quan phối hợp hoạt động với nhau, dưới sự điều khiển của hệ thần kinh và hệ nội tiết"],["rieng","Mỗi hệ hoạt động riêng rẽ"],["tim","Chỉ tim hoạt động mạnh lên"]],ans:"phoi",why:"Cơ hoạt động cần nhiều O₂ và năng lượng; hệ tuần hoàn, hô hấp cùng tăng cường hoạt động."}],
  concl:{html:`<ul class="tlist"><li>Cơ thể người gồm ba phần: đầu, thân, tay chân. Khoang thân được cơ hoành chia thành khoang ngực và khoang bụng.</li>
    <li>Các hệ cơ quan: vận động, tiêu hóa, tuần hoàn, hô hấp, bài tiết, thần kinh, nội tiết, sinh dục, … Mỗi hệ gồm nhiều cơ quan cùng thực hiện một chức năng.</li>
    <li>Các hệ cơ quan phối hợp với nhau tạo thành một thể thống nhất, dưới sự điều khiển, điều hòa của hệ thần kinh và hệ nội tiết.</li></ul>`,
    quiz:[{id:"q1",q:"Cơ quan nào thuộc hệ hô hấp?",opts:[["a","Khí quản"],["b","Thực quản"],["c","Thận"]],ans:"a",why:{b:"Thực quản thuộc hệ tiêu hóa.",c:"Thận thuộc hệ bài tiết."}},
      {id:"q2",q:"Tuyến nào vừa là tuyến tiêu hóa vừa là tuyến nội tiết?",opts:[["tuy","Tuyến tụy"],["giap","Tuyến giáp"],["nb","Tuyến nước bọt"]],ans:"tuy",why:{giap:"Tuyến giáp chỉ là tuyến nội tiết.",nb:"Tuyến nước bọt chỉ là tuyến tiêu hóa."}},
      {id:"q3",q:"Khoang ngực chứa:",opts:[["a","Tim và phổi"],["b","Dạ dày và gan"],["c","Thận và bóng đái"]],ans:"a",why:{b:"Dạ dày, gan nằm trong khoang bụng.",c:"Thận, bóng đái nằm trong khoang bụng."}}],
    done:`<h2>Hoàn thành: Các hệ cơ quan của cơ thể người</h2><p class="muted">Bảy hệ cơ quan phối hợp hoạt động dưới sự điều khiển của hệ thần kinh và hệ nội tiết.</p>`},
  gv:["Cho học sinh lập bảng: tên hệ – các cơ quan – chức năng, rồi đối chiếu với thông tin khi chạm vào cơ quan.","Hỏi: khi ăn no rồi chạy ngay, những hệ nào phải cùng hoạt động mạnh?","Hệ sinh dục có trong SGK nhưng không dựng hình trong mô phỏng này; giới thiệu qua tranh SGK."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 30)</p><ul class="tlist"><li>Nêu được tên và vai trò chính của các cơ quan và hệ cơ quan trong cơ thể người.</li><li>Kể được tên các hệ cơ quan; nêu được mối quan hệ giữa các hệ cơ quan.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 30 Khái quát về cơ thể người.</li>
<li>Vị trí, hình dạng các cơ quan: <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/1-2-structural-organization-of-the-human-body" target="_blank" rel="noopener">OpenStax Anatomy and Physiology 2e, mục 1.2 (các hệ cơ quan)</a> và các chương tương ứng.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Cơ quan dựng giản lược theo hình giải phẫu, kích thước và vị trí gần đúng; mạch máu chỉ vẽ các mạch lớn; dây thần kinh chỉ vẽ các dây chính.</li></ul>`;

let S;
LabKHTN.register("K8-S-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"cq",t:"Cơ quan"},{k:"he",t:"Thuộc hệ"},{k:"cn",t:"Chức năng"}],empty:"Chạm vào cơ quan, thông tin tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const full={t:[0,-.55,0],yaw:.35,pitch:.06,rad:3.75};
    const K=KIT.scene3D(api,{aria:"Mô hình 3D cơ thể người và các hệ cơ quan",legend:{w:260},
      views:{vandong:Object.assign({},full,{label:"Vận động",icon:IC.hand}),tuanhoan:Object.assign({},full,{label:"Tuần hoàn",icon:IC.drop}),
        hohap:{t:[0,1.35,0],yaw:.3,pitch:.1,rad:1.28,label:"Hô hấp",icon:IC.cell},tieuhoa:{t:[0,.62,0],yaw:.3,pitch:.1,rad:1.78,label:"Tiêu hóa",icon:IC.beaker},
        baitiet:{t:[0,-.3,-.1],yaw:.6,pitch:.12,rad:1.0,label:"Bài tiết",icon:IC.drop},thankinh:Object.assign({},full,{label:"Thần kinh",icon:IC.bolt}),
        noitiet:{t:[0,1.35,0],yaw:.35,pitch:.1,rad:1.55,label:"Nội tiết",icon:IC.dna},khoang:{t:[0,.55,0],yaw:.5,pitch:.12,rad:1.45,label:"Khoang cơ thể",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={seen:{},org:{},sel:null,recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const tis=o=>Object.assign({color:"#FFFFFF",rough:.5,wrap:.5,sheen:.35,coat:.2,hooks:KIT.TISSUE,uniforms:{uBump:.05,uNF:22}},o||{});
    const loadEl=document.createElement("div");loadEl.className="gl-loading glass";loadEl.innerHTML=`<i aria-hidden="true"></i>Đang dựng mô hình cơ thể người…`;K.over.appendChild(loadEl);
    const body=root.add(new G.Node());
    window.LabOrgans.build("buildBodyFull",110).then(g=>{if(K.dead)return;body.add(R.mesh(g,{color:"#F2C6A8",alpha:.1,rough:.6,order:-2,transparent:true}));loadEl.classList.add("out");setTimeout(()=>loadEl.remove(),400)});
    const N={};for(const k of Object.keys(SYS))N[k]=root.add(new G.Node());
    const M={};   /* lưới theo khóa cơ quan để làm nổi */
    const add=(sys,key,g,mat)=>{const m=N[sys].add(R.mesh(g,mat||tis()));(M[key]=M[key]||[]).push(m);return m};
    const built={};
    function build(sys){if(built[sys])return;built[sys]=true;const L=window.LabOrgans;
      if(sys==="vandong")L.build("buildSkeleton").then(P=>{if(K.dead)return;const bm=tis({rough:.42,coat:.25,uniforms:{uBump:.03,uNF:30}});
        add(sys,"skull",P.skull,bm);add(sys,"spine",P.spine,bm);add(sys,"ribs",P.ribs,bm);add(sys,"ribs",P.shoulder,bm);add(sys,"leg",P.pelvis,bm);
        for(const k of ["armL","armR"])add(sys,"arm",P[k],bm);for(const k of ["legL","legR"])add(sys,"leg",P[k],bm)});
      if(sys==="tuanhoan"){L.build("buildVessels").then(P=>{if(K.dead)return;add(sys,"art",P.art,{color:"#FFFFFF",rough:.35,coat:.4});add(sys,"vein",P.vein,{color:"#FFFFFF",rough:.4,coat:.3})});
        window.LabBody.buildAsync("buildOuter",72).then(g=>{if(K.dead)return;const n=add(sys,"heart",g,tis({rough:.36,coat:.45,uniforms:{uBump:.05,uNF:38}}));n.scl=[.3,.3,.3];n.pos=[.04,1.05,.1]})}
      if(sys==="hohap"||sys==="khoang")L.build("buildRespiratory").then(P=>{if(K.dead)return;const s=sys;
        const lm=tis({alpha:sys==="khoang"?.55:.92,transparent:true,order:1,uniforms:{uBump:.09,uNF:26}});
        add(s,"lung",P.lungR,lm);add(s,"lung",P.lungL,lm);if(s==="hohap"){add(s,"trachea",P.trachea);add(s,"trachea",P.rings);add(s,"trachea",P.larynx);add(s,"lung",P.tree)}
        else add(s,"dia",P.dia,tis({side:"double",uniforms:{uBump:.12,uNF:14}}))});
      if(sys==="tieuhoa"||sys==="khoang")L.build("buildDigestive").then(P=>{if(K.dead)return;
        for(const k in P){if(!P[k]||!P[k].pos)continue;if(sys==="khoang"&&(k==="tongue"||k==="glands"||k==="eso"))continue;add(sys,k,P[k],tis({uniforms:{uBump:.06,uNF:22}}))}});
      if(sys==="khoang")window.LabBody.buildAsync("buildOuter",64).then(g=>{if(K.dead)return;const n=add(sys,"heart",g,tis({rough:.36,coat:.45}));n.scl=[.3,.3,.3];n.pos=[.04,1.05,.1]});
      if(sys==="baitiet"||sys==="khoang")L.build("buildUrinary").then(P=>{if(K.dead)return;for(const k in P)add(sys,k==="urethra"?"bladder":k,P[k],tis({uniforms:{uBump:.04,uNF:24}}))});
      if(sys==="thankinh"){L.build("buildNerves").then(P=>{if(K.dead)return;add(sys,"cord",P.cord);add(sys,"nerve",P.nerves,{color:"#FFFFFF",rough:.4,coat:.3});add(sys,"nerve",P.ganglia)});
        L.build("buildBrain",96).then(P=>{if(K.dead)return;for(const k of ["cerebrum","cerebellum","stem"]){const n=add(sys,"brain",P[k],tis({uniforms:{uBump:.03,uNF:34}}));n.pos=[0,2.46,-.06];n.scl=[.4,.4,.4]}})}
      if(sys==="noitiet"){L.build("buildEndocrine").then(P=>{if(K.dead)return;for(const k in P)add(sys,k,P[k],tis())});
        L.build("buildDigestive").then(P=>{if(K.dead)return;add(sys,"pancreas",P.pancreas,tis({uniforms:{uBump:.06,uNF:30}}))});
        L.build("buildUrinary").then(P=>{if(K.dead)return;add(sys,"kidneyG",P.kidney,tis({alpha:.3,transparent:true,order:1}))});
        L.build("buildBrain",72).then(P=>{if(K.dead)return;for(const k of ["cerebrum","cerebellum","stem"]){const n=add(sys,"brainG",P[k],tis({alpha:.22,transparent:true,order:1}));n.pos=[0,2.46,-.06];n.scl=[.4,.4,.4]}})}}

    /* ================= nhãn (mỗi nhãn gắn với một hệ) ================= */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    lab("Xương đầu",[.3,2.5,0],"vandong",{dir:"e",len:40});lab("Lồng ngực",[-.6,1.15,.2],"vandong",{dir:"w",len:40});lab("Cột sống",[0,.1,-.42],"vandong",{dir:"w",len:70});
    lab("Xương chi trên",[.84,.4,-.06],"vandong",{dir:"e",len:30});lab("Xương chậu",[.4,-.6,0],"vandong",{dir:"e",len:50});lab("Xương chi dưới",[-.3,-2.6,0],"vandong",{dir:"w",len:40});
    lab("Tim",[.1,1.0,.25],"tuanhoan",{dir:"e",len:60});lab("Động mạch",[.3,-1.8,-.02],"tuanhoan",{dir:"e",len:50});lab("Tĩnh mạch",[-.34,-1.8,.02],"tuanhoan",{dir:"w",len:50});
    lab("Động mạch chủ",[-.03,.4,-.34],"tuanhoan",{dir:"w",len:80});
    lab("Thanh quản",[.09,2.03,-.06],"hohap",{dir:"e",len:40});lab("Khí quản",[.07,1.6,-.1],"hohap",{dir:"e",len:60});lab("Phế quản",[-.2,1.16,-.06],"hohap",{dir:"w",len:70});
    lab("Phổi phải",[-.75,1.0,.1],"hohap",{dir:"w",len:30});lab("Phổi trái",[.75,1.0,.1],"hohap",{dir:"e",len:30});
    lab("Thực quản",[.02,1.4,-.15],"tieuhoa",{dir:"e",len:60});lab("Gan",[-.6,.6,.2],"tieuhoa",{dir:"w",len:30});lab("Dạ dày",[.45,.45,.1],"tieuhoa",{dir:"e",len:30});
    lab("Ruột non",[.05,-.35,.2],"tieuhoa",{dir:"s",len:60});lab("Ruột già",[.55,-.4,.05],"tieuhoa",{dir:"e",len:30});lab("Tụy",[.3,.28,-.12],"tieuhoa",{dir:"e",len:70});lab("Lưỡi, khoang miệng",[0,2.12,.3],"tieuhoa",{dir:"e",len:50});
    lab("Thận",[.38,.42,-.3],"baitiet",{dir:"e",len:40});lab("Ống dẫn nước tiểu",[.16,-.4,-.18],"baitiet",{dir:"e",len:60});lab("Bóng đái",[0,-1.02,.2],"baitiet",{dir:"s",len:30});lab("Ống đái",[0,-1.3,.1],"baitiet",{dir:"w",len:50});
    lab("Não",[.12,2.62,-.05],"thankinh",{dir:"e",len:60});lab("Tủy sống",[0,1.0,-.47],"thankinh",{dir:"w",len:70});lab("Dây thần kinh",[.3,-1.6,-.08],"thankinh",{dir:"e",len:60});
    lab("Tuyến yên",[0,2.33,.04],"noitiet",{dir:"e",len:70});lab("Tuyến giáp",[.08,1.83,.08],"noitiet",{dir:"e",len:50});lab("Tuyến tụy",[.35,.3,-.13],"noitiet",{dir:"e",len:50});lab("Tuyến trên thận",[-.3,.69,-.29],"noitiet",{dir:"w",len:50});
    lab("Khoang ngực",[-.5,1.3,.2],"khoang",{dir:"w",len:50,cls:"plain"});lab("Cơ hoành",[.6,.62,.15],"khoang",{dir:"e",len:40});lab("Khoang bụng",[-.45,-.3,.2],"khoang",{dir:"w",len:50,cls:"plain"});
    lab("Tim",[.1,1.0,.25],"khoang",{dir:"n",len:40});

    /* ================= cập nhật ================= */
    let last=null;
    K.onFrame(()=>{const v=K.view;if(v!==last){last=v;build(v);if(!S.seen[v]){S.seen[v]=1;refresh()}S.sel=null}
      for(const k in N)N[k].visible=k===v;
      const sel=S.sel;for(const k in M){const hi=!sel||k===sel;for(const m of M[k]){if(m.mat.alpha0==null)m.mat.alpha0=m.mat.alpha==null?1:m.mat.alpha,m.mat.tr0=!!m.mat.transparent;
        m.mat.alpha=hi?m.mat.alpha0:.18;m.mat.transparent=hi?m.mat.tr0:true}}});
    K.pickFn((x,y)=>{const r=R.ray(x,y);let best=null,bd=1e9;for(const o of ORG){if(o[2]!==K.view&&!(K.view==="khoang"&&["heart","lung","stomach","liver","si","li","kidney","bladder"].includes(o[0])))continue;
      const t=G.hit.box(r,o[4],o[5]);if(t!=null&&t<bd){bd=t;best=o}}return best?{o:best}:null});
    K.tapFn(k=>{if(!k){S.sel=null;refresh();return}const o=k.o;S.sel=S.sel===o[0]?null:o[0];if(!S.org[o[0]]){S.org[o[0]]=1;S.recs++;api.record({lan:String(S.recs),cq:o[1],he:SYS[o[2]].ten,cn:o[3]})}refresh()});
    K.dockFn(()=>{const v=K.view;const list=ORG.filter(o=>o[2]===v||(v==="khoang"&&["heart","lung","stomach","liver","kidney","bladder"].includes(o[0])));
      return list.length?[{grid:list.map(o=>({k:"org",v:o[0],label:o[1].replace(" (hộp sọ)",""),icon:IC.eye,on:S.sel===o[0]}))}]:[]});
    K.onDock((k,v)=>{if(k==="org"){const o=ORG.find(x=>x[0]===v);S.sel=S.sel===v?null:v;if(!S.org[v]){S.org[v]=1;S.recs++;api.record({lan:String(S.recs),cq:o[1],he:SYS[o[2]].ten,cn:o[3]})}}refresh()});
    K.infoFn(()=>{const s=SYS[K.view];const o=S.sel?ORG.find(x=>x[0]===S.sel):null;
      return `<div><b>${s.ten}</b></div><div>${s.cq}</div><small>${s.cn}</small>${o?`<div style="margin-top:6px"><b>${o[1]}</b> · ${SYS[o[2]].ten.toLowerCase()}</div><small>${o[3]}</small>`:""}`});
    K.timeLabel(()=>`${SYS[K.view].ten} · đã chạm ${Object.keys(S.org).length} cơ quan`);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){["vandong","tuanhoan","hohap","tieuhoa","baitiet","thankinh","noitiet","khoang"].forEach(k=>{S.seen[k]=1});
        ["heart","lung","stomach","kidney","brain","thyroid","skull"].forEach(v=>{const o=ORG.find(x=>x[0]===v);S.org[v]=1;S.recs++;api.record({lan:String(S.recs),cq:o[1],he:SYS[o[2]].ten,cn:o[3]})});refresh()}};
    return K.mount(st)}
});
})();
