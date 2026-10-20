/* K8-C-01 · Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm (SGK KHTN 8 – Kết nối tri thức, Bài 1) · 3D
   Bốn phần:
   1. Dụng cụ thủy tinh: ống nghiệm, cốc thủy tinh, bình tam giác, ống đong, phễu, ống hút nhỏ giọt, đũa thủy tinh, nhiệt kế.
   2. Dụng cụ khác và thiết bị điện: đèn cồn, giá để ống nghiệm, kẹp ống nghiệm, thìa lấy hóa chất, biến áp nguồn, ampe kế, vôn kế.
   3. Thao tác: lấy hóa chất rắn bằng thìa, nhỏ giọt bằng ống hút, rót chất lỏng theo đũa thủy tinh, đun nóng ống nghiệm bằng đèn cồn.
   4. Kí hiệu cảnh báo: các biểu tượng nguy hiểm trên nhãn hóa chất và trong phòng thí nghiệm. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const X={tt:-4.2,khac:0,tt3:4.2,cb:8.4};
const TOOLS=[
  /* [khóa, phần, tên, công dụng, x, z] */
  ["ongn","tt","Ống nghiệm","Đựng lượng nhỏ hóa chất để làm thí nghiệm.",-.95,.1],["coc","tt","Cốc thủy tinh","Đựng, pha chế dung dịch; đun nóng dung dịch (đặt trên lưới).",-.55,.05],
  ["btg","tt","Bình tam giác","Đựng, pha chế dung dịch; miệng hẹp nên lắc, khuấy ít bị bắn ra ngoài.",-.05,.05],["ongd","tt","Ống đong","Đo thể tích chất lỏng.",.38,.05],
  ["pheu","tt","Phễu","Rót chất lỏng vào bình miệng nhỏ; lọc (cùng giấy lọc).",.78,.05],["hut","tt","Ống hút nhỏ giọt","Lấy và nhỏ từng giọt chất lỏng.",-.75,.48],
  ["dua","tt","Đũa thủy tinh","Khuấy dung dịch; dẫn dòng chất lỏng khi rót.",-.15,.5],["nk","tt","Nhiệt kế","Đo nhiệt độ.",.5,.5],
  ["den","khac","Đèn cồn","Đun nóng. Không châm đèn từ đèn khác; tắt bằng nắp; cồn không quá 2/3 bình.",-1.05,-.25],["gia","khac","Giá để ống nghiệm","Giữ ống nghiệm đứng thẳng.",-.55,-.25],
  ["kep","khac","Kẹp ống nghiệm","Cầm ống nghiệm khi đun, kẹp ở khoảng 1/3 ống tính từ miệng.",-.45,.38],["thia","khac","Thìa lấy hóa chất","Lấy hóa chất rắn dạng bột, hạt nhỏ.",.35,.4],
  ["bap","khac","Biến áp nguồn","Đổi điện áp xoay chiều 220 V thành điện áp nhỏ (xoay chiều hoặc một chiều) để làm thí nghiệm an toàn.",.02,-.25],
  ["ampe","khac","Ampe kế","Đo cường độ dòng điện; mắc nối tiếp với vật cần đo.",.52,-.25],["von","khac","Vôn kế","Đo hiệu điện thế; mắc song song với vật cần đo.",1.0,-.25]];
const SIGNS=[
  ["chay","Chất dễ cháy","Để xa nguồn lửa, nguồn nhiệt; đậy kín. Ví dụ: cồn, xăng."],["doc","Chất độc","Không nếm, ngửi trực tiếp; đeo găng tay, khẩu trang. Ví dụ: thủy ngân, muối barium."],
  ["anmon","Chất ăn mòn","Gây bỏng da, hỏng kim loại; đeo kính, găng tay. Ví dụ: sulfuric acid đặc, sodium hydroxide."],["no","Chất dễ nổ","Tránh va đập, ma sát, nhiệt."],
  ["oxh","Chất oxi hóa","Có thể gây hoặc làm cháy mạnh hơn; không để gần chất dễ cháy."],["canh","Chất gây kích ứng, có hại","Có thể gây kích ứng da, mắt, đường hô hấp."],
  ["moitruong","Chất độc với môi trường","Không đổ xuống cống; thu gom vào nơi quy định."],["dien","Nguy hiểm về điện","Không chạm vào chỗ hở điện; không dùng điện 220 V trực tiếp khi làm thí nghiệm."],
  ["camlua","Cấm lửa","Không mang lửa, không đun nóng ở khu vực có biển này."]];

const SPEC={
  predict:[{id:"p1",q:"Khi rót hóa chất lỏng từ chai, nhãn chai nên quay về phía nào?",opts:[["tay","Hướng vào lòng bàn tay"],["ngoai","Hướng ra ngoài"],["duoi","Hướng xuống dưới"]],ans:"tay",res:"Kết quả: nhãn hướng vào lòng bàn tay để hóa chất không chảy làm hỏng nhãn."},
    {id:"p2",q:"Khi đun ống nghiệm bằng đèn cồn, miệng ống nghiệm phải:",opts:[["xa","Hướng ra xa người làm và người xung quanh"],["mat","Hướng về phía mặt để quan sát rõ"],["dung","Để thẳng đứng, không cần nghiêng"]],ans:"xa",res:"Kết quả: nghiêng ống, miệng ống hướng ra xa mọi người để chất lỏng sôi bắn ra không gây bỏng."}],
  taskLead:"Chọn phần ở khay. Chạm vào từng dụng cụ, kí hiệu để xem tên và cách dùng; ở phần thao tác, bấm từng thao tác để xem làm đúng.",
  tasks:[{html:"<b>Dụng cụ thủy tinh:</b> chạm đủ 8 dụng cụ.",done:()=>TOOLS.filter(t=>t[1]==="tt").every(t=>S.seen[t[0]])},
    {html:"<b>Dụng cụ khác:</b> chạm đủ 7 dụng cụ, thiết bị.",done:()=>TOOLS.filter(t=>t[1]==="khac").every(t=>S.seen[t[0]])},
    {html:"<b>Thao tác:</b> thực hiện đủ 4 thao tác.",done:()=>["bot","giot","rot","dun"].every(k=>S.op[k])},
    {html:"<b>Kí hiệu cảnh báo:</b> chạm ít nhất 6 kí hiệu.",done:()=>Object.keys(S.sg).length>=6}],
  obs:[{id:"a",q:"Dụng cụ nào dùng để đo thể tích chất lỏng?",opts:[["od","Ống đong"],["coc","Cốc thủy tinh không vạch chia"],["pheu","Phễu"]],ans:"od",why:"Ống đong có vạch chia thể tích; đọc theo mặt thoáng (đáy mặt lõm) ngang tầm mắt."},
    {id:"b",q:"Kẹp ống nghiệm khi đun ở vị trí:",opts:[["13","Khoảng 1/3 ống tính từ miệng"],["day","Sát đáy ống"],["giua","Chính giữa ống"]],ans:"13",why:"Kẹp xa ngọn lửa, không vướng khi hơ nóng ống."},
    {id:"c",q:"Biểu tượng hình ngọn lửa trên nền trắng, viền đỏ hình thoi cho biết:",opts:[["chay","Chất dễ cháy"],["doc","Chất độc"],["no","Chất dễ nổ"]],ans:"chay",why:"Chất dễ cháy cần để xa nguồn lửa, nguồn nhiệt."}],
  concl:{html:`<ul class="tlist"><li>Lấy hóa chất rắn: dạng bột dùng thìa, dạng hạt to dùng kẹp; không cầm bằng tay.</li>
    <li>Lấy hóa chất lỏng: lượng nhỏ dùng ống hút nhỏ giọt; rót từ chai theo đũa thủy tinh, nhãn chai hướng vào lòng bàn tay. Hóa chất thừa không đổ lại vào chai.</li>
    <li>Đun nóng ống nghiệm: kẹp ở khoảng 1/3 ống từ miệng, hơ nóng đều ống rồi mới đun ở phần có hóa chất; nghiêng ống, miệng ống không hướng vào người.</li>
    <li>Đọc kĩ nhãn và kí hiệu cảnh báo trước khi dùng hóa chất; không nếm, không ngửi trực tiếp hóa chất.</li>
    <li>Thiết bị điện: dùng biến áp nguồn hoặc pin; ampe kế mắc nối tiếp, vôn kế mắc song song; ngắt điện khi lắp, tháo mạch.</li></ul>`,
    quiz:[{id:"q1",q:"Lỡ làm đổ acid lên tay, việc làm đầu tiên là:",opts:[["a","Rửa ngay dưới vòi nước sạch nhiều lần, báo giáo viên"],["b","Lau bằng giấy khô rồi tiếp tục làm"],["c","Bôi kem lên ngay"]],ans:"a",why:{b:"Phải rửa ngay bằng nhiều nước.",c:"Rửa sạch bằng nước trước, rồi báo giáo viên."}},
      {id:"q2",q:"Tắt đèn cồn đúng cách là:",opts:[["a","Đậy nắp đèn"],["b","Thổi tắt"],["c","Để cồn cháy hết"]],ans:"a",why:{b:"Thổi có thể làm lửa bùng ngược vào bình cồn.",c:"Không để đèn cháy không có người trông."}},
      {id:"q3",q:"Muốn đo cường độ dòng điện qua bóng đèn, mắc ampe kế:",opts:[["a","Nối tiếp với bóng đèn"],["b","Song song với bóng đèn"],["c","Thay cho bóng đèn"]],ans:"a",why:{b:"Mắc song song là cách mắc vôn kế.",c:"Ampe kế phải mắc nối tiếp với vật cần đo."}}],
    done:`<h2>Hoàn thành: Hóa chất, thiết bị và an toàn</h2><p class="muted">Biết tên, công dụng dụng cụ; thao tác đúng; đọc kí hiệu cảnh báo.</p>`},
  gv:["Cho học sinh tự gọi tên dụng cụ trước khi chạm để kiểm tra.","Ở phần thao tác, hỏi: nếu đổ hóa chất thừa trở lại chai thì điều gì xảy ra?","Liên hệ nội quy phòng thực hành của trường."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 1)</p><ul class="tlist"><li>Nhận biết được một số dụng cụ và hóa chất sử dụng trong môn KHTN 8.</li><li>Nêu được quy tắc sử dụng hóa chất an toàn; nhận biết được các thiết bị điện trong môn KHTN 8 và trình bày được cách sử dụng điện an toàn.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 1 Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thí nghiệm.</li>
<li>Biểu tượng cảnh báo nguy hiểm theo Hệ thống hài hòa toàn cầu (GHS): <a href="https://unece.org/transport/dangerous-goods/ghs-pictograms" target="_blank" rel="noopener">UNECE – GHS pictograms</a>. Hình trong mô phỏng vẽ lại giản lược.</li></ul>`;

let S;
LabKHTN.register("K8-C-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"ten",t:"Dụng cụ, thao tác, kí hiệu"},{k:"cd",t:"Công dụng, cách làm đúng"}],empty:"Chạm vào dụng cụ, thông tin tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Bàn thí nghiệm 3D giới thiệu dụng cụ, thao tác và kí hiệu an toàn",legend:{w:260},bench:[14,2.4],seed:101,
      views:{tt:{t:[X.tt,.32,.25],yaw:0,pitch:.42,rad:1.05,label:"Dụng cụ thủy tinh",icon:IC.beaker},khac:{t:[X.khac+.12,.22,.05],yaw:0,pitch:.48,rad:1.25,label:"Dụng cụ khác",icon:IC.fire},
        thaotac:{t:[X.tt3,.45,.1],yaw:0,pitch:.28,rad:1.05,label:"Thao tác",icon:IC.hand},canhbao:{t:[X.cb,.82,0],yaw:0,pitch:.05,rad:1.32,label:"Kí hiệu cảnh báo",icon:IC.ban}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={seen:{},op:{},sg:{},sel:null,heat:null,recs:0};
    const rec=(ten,cd)=>{S.recs++;api.record({lan:String(S.recs),ten,cd})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const BN=BL.create(K);
    const glassM={type:"glass",color:"#E6F3FF",alpha:.5};const metal={color:"#B7BEC6",metal:.85,rough:.3};const woodM={color:"#9C6B3F",rough:.55};
    const NODE={};const at=(k,x,z)=>{const n=root.add(new G.Node());n.pos=[x,0,z];NODE[k]=n;return n};
    const T=k=>TOOLS.find(t=>t[0]===k);
    const P=(k)=>{const t=T(k);return[X[t[1]]+t[4],0,t[5]]};
    /* ---------- dụng cụ thủy tinh ---------- */
    {let p=P("ongn");const n=at("ongn",p[0],p[2]);n.add(K3.testTube(R,.06,.5)).pos=[0,.0,0];n.add(R.mesh(G.box(.14,.02,.14,.01,2),woodM)).pos=[0,.01,0]}
    {let p=P("coc");const n=at("coc",p[0],p[2]);n.add(K3.glass(R,.15,.28));n.add(K3.liquid(R,.138,.012,.12,H("#CFE6FF"),.35))}
    {let p=P("btg");const n=at("btg",p[0],p[2]);n.add(R.mesh(G.lathe([[0,0],[.17,0],[.18,.02],[.17,.05],[.05,.3],[.042,.34],[.042,.4],[.05,.41]],48),glassM))}
    {let p=P("ongd");const n=at("ongd",p[0],p[2]);n.add(R.mesh(G.lathe([[0,0],[.11,0],[.11,.025],[.04,.03],[.035,.04],[.035,.56],[.045,.575]],40),glassM));
      n.add(K3.liquid(R,.03,.04,.3,H("#CFE6FF"),.4));for(let i=1;i<=10;i++)n.add(R.mesh(G.box(i%5?.018:.03,.002,.002,0,1),{color:"#1F2937"})).pos=[.025,.04+i*.05,.034]}
    {let p=P("pheu");const n=at("pheu",p[0],p[2]);n.add(R.mesh(G.lathe([[.012,.0],[.012,.18],[.02,.2],[.13,.36],[.135,.37]],40),glassM));n.add(R.mesh(G.cylinder(.05,.02,20),woodM))}
    {let p=P("hut");const n=at("hut",p[0],p[2]);const d=n.add(new G.Node());d.pos=[0,.03,0];d.quat=G.Q.euler(0,0,Math.PI/2);
      d.add(R.mesh(G.lathe([[0,0],[.004,0],[.012,.12],[.012,.3]],16),glassM)).pos=[0,-.15,0];d.add(R.mesh(G.lathe([[.014,0],[.03,.04],[.03,.1],[0,.13]],20),{color:"#C62828",rough:.5})).pos=[0,.15,0]}
    {let p=P("dua");const n=at("dua",p[0],p[2]);const r=n.add(R.mesh(G.cylinder(.008,.55,12),glassM));r.quat=G.Q.euler(0,0,Math.PI/2);r.pos=[.27,.012,0]}
    {let p=P("nk");const n=at("nk",p[0],p[2]);const r=n.add(new G.Node());r.quat=G.Q.euler(0,0,Math.PI/2);r.pos=[.28,.015,0];
      r.add(R.mesh(G.cylinder(.013,.56,12),glassM));r.add(R.mesh(G.sphere(.017,12,8),{color:"#C62828",rough:.3})).pos=[0,0,0];r.add(R.mesh(G.cylinder(.004,.25,6),{color:"#C62828"})).pos=[0,0,0]}
    /* ---------- dụng cụ khác, thiết bị điện ---------- */
    {let p=P("den");const B=BN.burner(p[0],p[2],.8);B.on=true;NODE.den=B.n}
    {let p=P("gia");at("gia",p[0],p[2]);BN.rack(p[0],p[2],2,.13)}
    {let p=P("kep");const n=at("kep",p[0],p[2]);n.add(R.mesh(G.box(.36,.035,.05,.012,2),woodM)).pos=[0,.02,0];n.add(R.mesh(G.box(.14,.025,.05,.01,2),woodM)).pos=[.12,.05,0];
      n.add(R.mesh(G.tube([[-.05,.035,.0],[.0,.06,0],[.06,.055,0]],.006,6),metal))}
    {let p=P("thia");const n=at("thia",p[0],p[2]);n.add(R.mesh(G.box(.26,.008,.022,.003,1),metal)).pos=[-.06,.006,0];n.add(R.mesh(G.fromSDF((x,y,z)=>Math.max(Math.hypot(x/1.6,y*3,z)-.03,-y),[-.06,-.01,-.04],[.06,.03,.04],[16,8,12]),metal)).pos=[.1,.004,0]}
    const dialTex=(sym,max)=>{const c=document.createElement("canvas");c.width=256;c.height=200;const g=c.getContext("2d");g.fillStyle="#F8F6EE";g.fillRect(0,0,256,200);
      g.strokeStyle="#1F2937";g.lineWidth=3;g.beginPath();g.arc(128,170,120,Math.PI*1.18,Math.PI*1.82);g.stroke();g.font="700 18px system-ui,Arial";g.fillStyle="#1F2937";g.textAlign="center";
      for(let i=0;i<=10;i++){const a=Math.PI*(1.18+.64*i/10);g.beginPath();g.moveTo(128+Math.cos(a)*120,170+Math.sin(a)*120);g.lineTo(128+Math.cos(a)*(i%5?108:100),170+Math.sin(a)*(i%5?108:100));g.stroke();if(i%5===0)g.fillText(String(max*i/10),128+Math.cos(a)*86,176+Math.sin(a)*86)}
      g.font="800 46px system-ui,Arial";g.fillStyle="#C62828";g.fillText(sym,128,150);g.strokeStyle="#C62828";g.lineWidth=2.5;g.beginPath();g.moveTo(128,170);g.lineTo(128+Math.cos(Math.PI*1.36)*112,170+Math.sin(Math.PI*1.36)*112);g.stroke();return R.tex2D(c,{mip:true})};
    const texM=tex=>({type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:tex},uniforms:{uDim:.95}});
    for(const [k,sym,max] of [["ampe","A",1],["von","V",6]]){const p=P(k);const n=at(k,p[0],p[2]);n.add(R.mesh(G.box(.34,.24,.16,.02,3),{color:"#1E3A5F",rough:.5})).pos=[0,.12,0];
      const face=n.add(R.mesh(G.plane(.28,.17),texM(dialTex(sym,max))));face.quat=G.Q.euler(Math.PI/2,0,0);face.pos=[0,.14,.081];
      for(const [dx,c] of [[-.1,"#C62828"],[.1,"#212121"]])n.add(R.mesh(G.cylinder(.018,.04,12),{color:c,rough:.4})).pos=[dx,.24,.04]}
    {const p=P("bap");const n=at("bap",p[0],p[2]);n.add(R.mesh(G.box(.42,.22,.26,.02,3),{color:"#E3E7EC",rough:.5})).pos=[0,.11,0];
      const k=n.add(R.mesh(G.cylinder(.045,.03,24),{color:"#222",rough:.4}));k.quat=G.Q.euler(Math.PI/2,0,0);k.pos=[-.1,.13,.13];
      for(const [dx,c] of [[.05,"#C62828"],[.12,"#212121"],[.17,"#1565C0"]])n.add(R.mesh(G.cylinder(.016,.04,12),{color:c,rough:.4})).pos=[dx,.22,.06];
      n.add(R.mesh(G.box(.06,.03,.01,.004,1),{color:"#43A047",type:"unlit"})).pos=[.08,.15,.131]}
    /* ---------- thao tác ---------- */
    const X3=X.tt3;
    const tP=BN.vessel({id:"p1",kind:"tube",x:X3-.75,z:0,sol:{col:"#EDF4FB",a:.0,level:.02}});BN.rack(X3-.75,0,1,.14);
    const tD=BN.vessel({id:"p2",kind:"tube",x:X3-.35,z:0,sol:{col:"#EDF4FB",a:.36,level:.3}});BN.rack(X3-.35,0,1,.14);
    const bR=BN.vessel({id:"p3",kind:"beaker",x:X3+.15,z:0,r:.2,h:.42,sol:{col:"#EDF4FB",a:.3,level:.12}});
    /* đun: ống nghiệm nghiêng khoảng 45°, kẹp gỗ ở 1/3 ống từ miệng, đèn cồn bên dưới */
    const burnH=BN.burner(X3+.72,0,.85);
    const htN=root.add(new G.Node());htN.pos=[X3+.72,.62,0];htN.quat=G.Q.euler(0,0,.78);
    htN.add(K3.testTube(R,.06,.5)).pos=[0,-.25,0];const htL=htN.add(K3.liquid(R,.05,-.24,-.12,H("#CFE6FF"),.45));
    const holder=htN.add(new G.Node());holder.pos=[0,.08,0];holder.add(R.mesh(G.box(.06,.04,.05,.01,2),woodM));const hArm=holder.add(R.mesh(G.box(.36,.03,.04,.01,2),woodM));hArm.pos=[-.2,.0,0];
    const htB=root.add(K3.bubbles(R,120));
    /* ---------- kí hiệu cảnh báo ---------- */
    function sign(k){const c=document.createElement("canvas");c.width=256;c.height=256;const g=c.getContext("2d");g.fillStyle="#FFFFFF";g.fillRect(0,0,256,256);
      const blk="#111";g.lineJoin="round";g.lineCap="round";
      if(k==="dien"){g.fillStyle="#F9D71C";g.beginPath();g.moveTo(128,22);g.lineTo(236,220);g.lineTo(20,220);g.closePath();g.fill();g.strokeStyle=blk;g.lineWidth=12;g.stroke();
        g.fillStyle=blk;g.beginPath();g.moveTo(140,70);g.lineTo(98,150);g.lineTo(130,150);g.lineTo(112,205);g.lineTo(162,124);g.lineTo(130,124);g.lineTo(150,70);g.closePath();g.fill();return R.tex2D(c,{mip:true})}
      if(k==="camlua"){g.strokeStyle="#D32F2F";g.lineWidth=22;g.beginPath();g.arc(128,128,100,0,6.283);g.stroke();flame(g,128,150,.9);g.strokeStyle="#D32F2F";g.lineWidth=20;g.beginPath();g.moveTo(58,58);g.lineTo(198,198);g.stroke();return R.tex2D(c,{mip:true})}
      g.save();g.translate(128,128);g.rotate(Math.PI/4);g.strokeStyle="#D32F2F";g.lineWidth=16;g.strokeRect(-80,-80,160,160);g.restore();
      g.fillStyle=blk;g.strokeStyle=blk;
      if(k==="chay")flame(g,128,150,.85);
      else if(k==="doc"){g.beginPath();g.ellipse(128,110,34,32,0,0,6.283);g.fill();g.fillRect(112,128,32,22);g.fillStyle="#FFF";g.beginPath();g.arc(116,108,9,0,6.283);g.arc(140,108,9,0,6.283);g.fill();g.fillRect(118,138,4,10);g.fillRect(126,138,4,10);g.fillRect(134,138,4,10);
        g.strokeStyle=blk;g.lineWidth=13;g.beginPath();g.moveTo(84,150);g.lineTo(172,190);g.moveTo(172,150);g.lineTo(84,190);g.stroke()}
      else if(k==="anmon"){g.save();g.translate(100,70);g.rotate(.5);g.fillRect(-8,0,16,40);g.restore();g.save();g.translate(156,70);g.rotate(-.5);g.fillRect(-8,0,16,40);g.restore();
        g.beginPath();g.arc(112,108,4,0,6.283);g.arc(146,110,4,0,6.283);g.fill();g.fillRect(70,150,50,10);g.beginPath();g.moveTo(130,150);g.lineTo(190,150);g.lineTo(190,190);g.lineTo(130,172);g.closePath();g.fill();
        g.fillStyle="#FFF";g.beginPath();g.arc(92,155,6,0,6.283);g.arc(160,160,6,0,6.283);g.fill()}
      else if(k==="no"){g.beginPath();g.arc(120,150,30,0,6.283);g.fill();g.lineWidth=6;for(let i=0;i<9;i++){const a=-Math.PI*.95+i*Math.PI*.12;g.beginPath();g.moveTo(140+Math.cos(a)*36,128+Math.sin(a)*36);g.lineTo(140+Math.cos(a)*62,128+Math.sin(a)*62);g.stroke()}}
      else if(k==="oxh"){g.lineWidth=10;g.beginPath();g.arc(128,160,28,0,6.283);g.stroke();flame(g,128,128,.6)}
      else if(k==="canh"){g.fillRect(118,72,20,74);g.beginPath();g.arc(128,172,11,0,6.283);g.fill()}
      else if(k==="moitruong"){g.lineWidth=7;g.beginPath();g.moveTo(80,175);g.lineTo(176,175);g.moveTo(104,175);g.lineTo(104,90);g.moveTo(104,110);g.lineTo(84,92);g.moveTo(104,125);g.lineTo(126,104);g.stroke();
        g.beginPath();g.ellipse(150,160,22,10,0,0,6.283);g.fill();g.beginPath();g.moveTo(170,160);g.lineTo(186,150);g.lineTo(186,170);g.closePath();g.fill();g.fillStyle="#FFF";g.beginPath();g.arc(140,157,3,0,6.283);g.fill()}
      return R.tex2D(c,{mip:true})}
    function flame(g,x,y,s){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle="#111";g.beginPath();g.moveTo(0,40);g.bezierCurveTo(-48,30,-46,-20,-6,-60);g.bezierCurveTo(-8,-30,14,-24,10,-50);g.bezierCurveTo(46,-14,50,30,0,40);g.closePath();g.fill();
      g.fillStyle="#FFF";g.beginPath();g.moveTo(0,32);g.bezierCurveTo(-20,26,-22,0,-6,-18);g.bezierCurveTo(-2,-2,10,0,8,-12);g.bezierCurveTo(24,6,22,28,0,32);g.fill();g.fillStyle="#111";g.fillRect(-56,44,112,10);g.restore()}
    const cards=[];SIGNS.forEach((s,i)=>{const col=i%5,row=Math.floor(i/5);const x=X.cb-.92+col*.46+(row?.23:0),y=1.08-row*.5;const n=root.add(new G.Node());n.pos=[x,y,0];
      n.add(R.mesh(G.box(.4,.4,.02,.01,2),{color:"#E5E7EB",rough:.6})).pos=[0,0,-.012];const f=n.add(R.mesh(G.plane(.38,.38),texM(sign(s[0]))));f.quat=G.Q.euler(Math.PI/2,0,0);cards.push({k:s[0],n,p:[x,y,0]})});
    root.add(R.mesh(G.box(2.6,1.1,.03,.02,3),{color:"#2C3550",rough:.7})).pos=[X.cb,.84,-.04];
    for(const x of [X.cb-1.2,X.cb+1.2])root.add(R.mesh(G.cylinder(.02,.4,8),metal)).pos=[x,0,-.04];

    /* ================= nhãn ================= */
    const LBL={};
    for(const t of TOOLS){const p=P(t[0]);const h={ongn:.52,coc:.3,btg:.42,ongd:.58,pheu:.38,hut:.06,dua:.03,nk:.04,den:.3,gia:.38,kep:.07,thia:.03,bap:.23,ampe:.25,von:.25}[t[0]]||.2;
      LBL[t[0]]=K.label(t[2],[p[0]+(t[0]==="dua"||t[0]==="nk"?.27:t[0]==="hut"?0:0),h,p[2]],{view:t[1],dir:p[2]>.3?"s":"n",len:p[2]>.3?26:22})}
    const lOps=[K.label("Ống 1: lấy bột bằng thìa",[X3-.75,.08,.08],{view:"thaotac",dir:"sw",len:34}),K.label("Ống 2: nhỏ giọt",[X3-.35,.08,.08],{view:"thaotac",dir:"s",len:44}),
      K.label("Cốc: rót theo đũa thủy tinh",[X3+.15,.06,.18],{view:"thaotac",dir:"s",len:26}),K.label("Đun ống nghiệm nghiêng, kẹp ở 1/3 ống từ miệng",[X3+.72,.82,0],{view:"thaotac",dir:"n",len:30})];
    const lMouth=K.label("Miệng ống hướng ra xa người",()=>{const a=.78;return[X3+.72-Math.sin(a)*.25*-1-.18,.62+Math.cos(a)*.25,0]},{view:"thaotac",dir:"ne",len:34});

    /* ================= cập nhật ================= */
    let heatT=0;
    K.onFrame(dt=>{const v=K.view;
      for(const t of TOOLS){const n=NODE[t[0]];if(!n)continue;const hi=S.sel===t[0];n.scl=hi?[1.08,1.08,1.08]:[1,1,1];LBL[t[0]].el.classList.toggle("follow",hi)}
      for(const c of cards){const hi=S.sel===c.k;c.n.pos=[c.p[0],c.p[1],hi?.06:0];c.n.scl=hi?[1.12,1.12,1.12]:[1,1,1]}
      if(S.heat){S.heat.t+=dt;burnH.on=true;const u=S.heat.t;htL.mat.color=H("#CFE6FF");if(u>2.2&&dt>0&&Math.random()<dt*20)htB.spawn([X3+.72+Math.sin(.78)*.18,.62-Math.cos(.78)*.18+.02,(Math.random()-.5)*.02],.006,[0,.25,0],.5,.8);
        if(u>5){S.heat=null;burnH.on=false;if(!S.op.dun){S.op.dun=1;rec("Đun nóng ống nghiệm bằng đèn cồn","Kẹp ống ở khoảng 1/3 từ miệng; hơ nóng đều cả ống rồi đun ở phần có chất lỏng (phần ngọn lửa phía trên, nóng nhất); ống nghiêng, miệng ống hướng ra xa mọi người; đun xong tắt đèn bằng nắp.");refresh()}}}
      htB.step(dt,b=>{if(b.p[1]>.75)b.age=b.life})});

    /* ================= chạm ================= */
    K.pickFn((x,y)=>{const v=K.view;const r=R.ray(x,y);let best=null,bd=1e9;
      if(v==="tt"||v==="khac"){for(const t of TOOLS){if(t[1]!==v)continue;const p=P(t[0]);const w=t[0]==="dua"||t[0]==="nk"?[0,.6]:[-.18,.18];const t0=G.hit.box(r,[p[0]+w[0],0,p[2]-.15],[p[0]+w[1],.6,p[2]+.15]);if(t0!=null&&t0<bd){bd=t0;best={k:t[0]}}}}
      if(v==="canhbao")for(const c of cards){const t0=G.hit.box(r,[c.p[0]-.2,c.p[1]-.2,-.05],[c.p[0]+.2,c.p[1]+.2,.08]);if(t0!=null&&t0<bd){bd=t0;best={k:c.k,sign:true}}}
      return best});
    const pickTool=k=>{S.sel=k;const t=T(k);if(!S.seen[k]){S.seen[k]=1;rec(t[2],t[3])}refresh()};
    const pickSign=k=>{S.sel=k;const s=SIGNS.find(x=>x[0]===k);if(!S.sg[k]){S.sg[k]=1;rec("Kí hiệu: "+s[1],s[2])}refresh()};
    K.tapFn(k=>{if(!k)return;k.sign?pickSign(k.k):pickTool(k.k)});
    K.dockFn(()=>{const v=K.view;
      if(v==="tt"||v==="khac")return[{grid:TOOLS.filter(t=>t[1]===v).map(t=>({k:"tool",v:t[0],label:t[2],icon:S.seen[t[0]]?'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 21l7 7 13-15"/></svg>':IC.eye,on:S.sel===t[0]}))}];
      if(v==="canhbao")return[{grid:SIGNS.map(s=>({k:"sign",v:s[0],label:s[1],icon:S.sg[s[0]]?'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 21l7 7 13-15"/></svg>':IC.ban,on:S.sel===s[0]}))}];
      const busy=BN.busy()||!!S.heat;return[{k:"op",v:"bot",label:"Lấy bột bằng thìa",icon:IC.plus,dis:busy||S.op.bot},{k:"op",v:"giot",label:"Nhỏ giọt bằng ống hút",icon:IC.drop,dis:busy||S.op.giot},
        {k:"op",v:"rot",label:"Rót theo đũa thủy tinh",icon:IC.beaker,dis:busy||S.op.rot},{k:"op",v:"dun",label:"Đun ống nghiệm",icon:IC.fire,dis:busy}]});
    K.onDock((k,v)=>{if(k==="tool")pickTool(v);else if(k==="sign")pickSign(v);
      else if(k==="op"){if(v==="bot"){const sd=BN.addSolid(tP,"powder",{col:"#F2F2EE",scale:.7});BN.dropSolid(sd,()=>{S.op.bot=1;rec("Lấy hóa chất rắn dạng bột","Dùng thìa sạch, khô xúc một lượng nhỏ, cho vào ống nghiệm (có thể nghiêng ống, đưa thìa sâu vào rồi dựng đứng ống); không cầm hóa chất bằng tay; đậy nắp lọ ngay sau khi lấy.");refresh()})}
        else if(v==="giot")BN.dropInto(tD,"#E8F2FB",4,()=>{S.op.giot=1;rec("Nhỏ giọt bằng ống hút","Bóp đầu cao su đuổi bớt không khí, nhúng đầu ống hút vào chai, thả tay để hút chất lỏng; giữ ống hút thẳng đứng phía trên miệng ống nghiệm, không chạm vào thành ống, bóp nhẹ từng giọt.");refresh()});
        else if(v==="rot")BN.pour(bR,.12,"#E8F2FB",()=>{S.op.rot=1;rec("Rót chất lỏng từ chai","Mở nắp, đặt ngửa nắp trên bàn; nhãn chai hướng vào lòng bàn tay; rót từ từ theo đũa thủy tinh; lượng thừa không đổ trở lại chai.");refresh()});
        else if(v==="dun"){S.heat={t:0};if(!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}}
      refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="tt"||v==="khac"){const t=S.sel&&T(S.sel)&&T(S.sel)[1]===v?T(S.sel):null;const n=TOOLS.filter(x=>x[1]===v).filter(x=>S.seen[x[0]]).length,N=TOOLS.filter(x=>x[1]===v).length;
        return `<div><b>${v==="tt"?"Dụng cụ thủy tinh":"Dụng cụ khác, thiết bị điện"}</b> · đã xem ${n}/${N}</div>${t?`<div><b>${t[2]}</b></div><small>${t[3]}</small>`:`<small>Chạm vào dụng cụ (hoặc chọn ở khay) để xem tên và công dụng.</small>`}`}
      if(v==="canhbao"){const s=S.sel?SIGNS.find(x=>x[0]===S.sel):null;return `<div><b>Kí hiệu cảnh báo</b> · đã xem ${Object.keys(S.sg).length}/${SIGNS.length}</div>${s?`<div><b>${s[1]}</b></div><small>${s[2]}</small>`:`<small>Hình thoi viền đỏ: biểu tượng nguy hiểm theo GHS trên nhãn hóa chất.</small>`}`}
      return `<div><b>Thao tác cơ bản</b></div>${[["bot","Lấy bột bằng thìa"],["giot","Nhỏ giọt bằng ống hút"],["rot","Rót theo đũa thủy tinh"],["dun","Đun nóng ống nghiệm"]].map(o=>`<div>${S.op[o[0]]?"✓":"○"} ${o[1]}</div>`).join("")}<small>Cách làm đúng ghi trong bảng kết quả.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){TOOLS.forEach(t=>{S.seen[t[0]]=1;rec(t[2],t[3])});SIGNS.forEach(s=>{S.sg[s[0]]=1;rec("Kí hiệu: "+s[1],s[2])});S.op.bot=S.op.giot=S.op.rot=1;S.heat={t:0};refresh()}};
    return K.mount(st)}
});
})();
