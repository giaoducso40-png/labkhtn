/* K6-C-01 · An toàn trong phòng thực hành; dụng cụ đo; kính lúp; kính hiển vi (SGK KHTN 6 – Kết nối tri thức, Bài 2–3) · 3D
   1. Quy tắc an toàn: chọn “Nên làm” hoặc “Không được làm” cho từng tình huống.
   2. Biển báo: biển cấm (hình tròn, viền đỏ), biển cảnh báo (hình tam giác, nền vàng, viền đen), biển bắt buộc thực hiện (hình tròn, nền xanh),
      biển chỉ dẫn (hình vuông hoặc chữ nhật, nền xanh lục hoặc đỏ). Chạm vào biển để xem ý nghĩa, rồi xếp đúng loại.
   3. Dụng cụ đo: giới hạn đo (GHĐ) và độ chia nhỏ nhất (ĐCNN) đọc trên chính dụng cụ.
   4. Kính lúp: đặt kính gần vật, dịch kính ra xa dần đến khi thấy rõ ảnh (vật nằm trong khoảng tiêu cự).
   5. Kính hiển vi quang học: tên và chức năng các bộ phận. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,M=window.LabMicro,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const RULES=[["Đeo kính bảo hộ, găng tay khi làm thí nghiệm với hóa chất",true],["Ăn uống, đùa nghịch trong phòng thực hành",false],["Ngửi, nếm trực tiếp hóa chất",false],["Báo ngay cho giáo viên khi xảy ra sự cố (vỡ dụng cụ, đổ hóa chất, cháy)",true],
  ["Tự ý làm thí nghiệm khi chưa có sự hướng dẫn của giáo viên",false],["Rửa tay sạch sẽ sau khi thực hành",true],["Đổ hóa chất thừa vào bồn rửa tay",false],["Thu dọn, vệ sinh dụng cụ và chỗ làm việc sau khi thực hành",true]];
const SIGNS=[{k:"camlua",t:"Cấm lửa",l:"cam"},{k:"camanuong",t:"Cấm ăn uống",l:"cam"},{k:"chay",t:"Chất dễ cháy",l:"canh"},{k:"doc",t:"Chất độc",l:"canh"},{k:"anmon",t:"Chất ăn mòn",l:"canh"},{k:"dien",t:"Nguy hiểm về điện",l:"canh"},
  {k:"kinh",t:"Phải đeo kính bảo hộ",l:"bb"},{k:"gang",t:"Phải đeo găng tay",l:"bb"},{k:"thoat",t:"Lối thoát hiểm",l:"cd"},{k:"binh",t:"Bình chữa cháy",l:"cd"}];
const LOAI={cam:"Biển cấm",canh:"Biển cảnh báo",bb:"Biển bắt buộc thực hiện",cd:"Biển chỉ dẫn"};
const TOOLS=[{k:"thuoc",t:"Thước kẻ",do:"chiều dài",ghd:"30 cm",dc:"1 mm"},{k:"cuon",t:"Thước cuộn",do:"chiều dài",ghd:"5 m",dc:"1 mm"},{k:"can",t:"Cân điện tử",do:"khối lượng",ghd:"500 g",dc:"0,1 g"},
  {k:"ytam",t:"Nhiệt kế y tế",do:"nhiệt độ cơ thể",ghd:"42 °C (từ 35 °C)",dc:"0,1 °C"},{k:"ptn",t:"Nhiệt kế phòng thí nghiệm",do:"nhiệt độ",ghd:"110 °C (từ −10 °C)",dc:"1 °C"},{k:"dh",t:"Đồng hồ bấm giây điện tử",do:"thời gian",ghd:"59 phút 59,99 giây",dc:"0,01 s"},
  {k:"ong",t:"Ống đong",do:"thể tích chất lỏng",ghd:"100 mL",dc:"1 mL"},{k:"lk",t:"Lực kế lò xo",do:"lực",ghd:"5 N",dc:"0,1 N"}];
const PARTS=[{k:"thi",t:"Thị kính",f:"Nơi mắt nhìn vào; phóng đại ảnh (thường ×10)."},{k:"vat",t:"Vật kính",f:"Gần vật quan sát; phóng đại ảnh (×4, ×10, ×40…)."},{k:"dia",t:"Đĩa quay",f:"Gắn các vật kính, xoay để đổi vật kính."},
  {k:"ocTo",t:"Ốc to",f:"Điều chỉnh thô, để tìm ảnh."},{k:"ocNho",t:"Ốc nhỏ",f:"Điều chỉnh tinh, cho ảnh rõ nét."},{k:"ban",t:"Bàn kính",f:"Nơi đặt tiêu bản, có kẹp giữ."},{k:"den",t:"Đèn chiếu sáng",f:"Cung cấp ánh sáng cho mẫu vật."},{k:"than",t:"Thân kính",f:"Nối các bộ phận, cầm khi di chuyển kính."},{k:"chan",t:"Chân kính",f:"Đỡ toàn bộ kính, giữ kính vững."}];
const SPEC={
  predict:[{id:"p1",q:"Biển báo hình tam giác, nền vàng, viền đen thuộc loại:",opts:[["canh","Biển cảnh báo"],["cam","Biển cấm"],["cd","Biển chỉ dẫn"]],ans:"canh",res:"Kết quả: biển cảnh báo báo trước nguy hiểm có thể xảy ra."},
    {id:"p2",q:"Độ chia nhỏ nhất (ĐCNN) của dụng cụ đo là:",opts:[["ok","Độ dài (giá trị) giữa hai vạch chia liên tiếp"],["ghd","Giá trị lớn nhất ghi trên dụng cụ"],["k","Số vạch chia"]],ans:"ok",res:"Kết quả: GHĐ là giá trị lớn nhất ghi trên dụng cụ; ĐCNN là giá trị giữa hai vạch chia liên tiếp."}],
  taskLead:"Làm lần lượt các phần ở khay: quy tắc, biển báo, dụng cụ đo, kính lúp, kính hiển vi.",
  tasks:[{html:"<b>Quy tắc an toàn:</b> chọn đúng cả 8 tình huống.",done:()=>Object.keys(S.rules).length>=RULES.length},{html:"<b>Biển báo:</b> xếp đúng loại cả 10 biển.",done:()=>Object.keys(S.signs).length>=SIGNS.length},
    {html:"<b>Dụng cụ đo:</b> xem GHĐ, ĐCNN của ít nhất 6 dụng cụ.",done:()=>Object.keys(S.tools).length>=6},{html:"<b>Kính lúp:</b> chỉnh cho ảnh rõ nét.",done:()=>!!S.lupOk},{html:"<b>Kính hiển vi:</b> nhận biết đủ 9 bộ phận.",done:()=>Object.keys(S.parts).length>=PARTS.length}],
  obs:[{id:"a",q:"Khi lỡ làm đổ hóa chất, em cần:",opts:[["ok","Báo ngay cho giáo viên"],["tu","Tự lấy tay lau"],["k","Im lặng, làm tiếp"]],ans:"ok",why:"Giáo viên sẽ hướng dẫn xử lí an toàn."},
    {id:"b",q:"Muốn đo chiều dài cuốn sách khoảng 25 cm, nên chọn:",opts:[["ok","Thước kẻ GHĐ 30 cm, ĐCNN 1 mm"],["cuon","Thước cuộn GHĐ 5 m"],["k","Ống đong"]],ans:"ok",why:"Chọn dụng cụ có GHĐ lớn hơn và gần với giá trị cần đo, ĐCNN phù hợp."},
    {id:"c",q:"Khi dùng kính lúp, cần đặt vật:",opts:[["ok","Gần kính (trong khoảng tiêu cự), dịch kính ra xa dần đến khi thấy rõ"],["xa","Rất xa kính"],["k","Ở vị trí bất kì"]],ans:"ok",why:"Khi vật ở ngoài khoảng tiêu cự, ảnh bị mờ hoặc ngược."}],
  concl:{html:`<ul class="tlist"><li>Thực hiện đúng <b>quy tắc an toàn</b> trong phòng thực hành: chỉ làm thí nghiệm khi có hướng dẫn, đeo đồ bảo hộ, không ăn uống, không ngửi nếm hóa chất, báo ngay khi có sự cố, rửa tay sau khi thực hành.</li>
    <li>Nhận biết các loại <b>biển báo</b>: biển cấm (tròn, viền đỏ), biển cảnh báo (tam giác, nền vàng), biển bắt buộc (tròn, nền xanh), biển chỉ dẫn (vuông/chữ nhật).</li>
    <li>Mỗi dụng cụ đo có <b>GHĐ</b> (giá trị lớn nhất đo được) và <b>ĐCNN</b> (giá trị giữa hai vạch chia liên tiếp).</li>
    <li><b>Kính lúp</b> phóng to ảnh của vật nhỏ khoảng 3 – 20 lần; <b>kính hiển vi quang học</b> phóng to từ 40 tới 3 000 lần (SGK).</li></ul>`,
    quiz:[{id:"q1",q:"Độ phóng đại của kính hiển vi dùng thị kính ×10 và vật kính ×10 là:",opts:[["a","100 lần"],["b","20 lần"],["c","10 lần"]],ans:"a",why:{b:"Độ phóng đại là tích, không phải tổng.",c:"10 × 10 = 100."}},
      {id:"q2",q:"Biển hình tròn, nền xanh, có hình kính bảo hộ có nghĩa là:",opts:[["a","Bắt buộc đeo kính bảo hộ"],["b","Cấm đeo kính"],["c","Cảnh báo kính dễ vỡ"]],ans:"a",why:{b:"Biển cấm có viền đỏ và gạch chéo.",c:"Biển cảnh báo hình tam giác."}}],
    done:`<h2>Hoàn thành: an toàn và dụng cụ thực hành</h2><p class="muted">Quy tắc an toàn, biển báo, dụng cụ đo, kính lúp, kính hiển vi.</p>`},
  gv:["Cho học sinh nêu thêm tình huống an toàn ở phòng thực hành của trường.","Yêu cầu học sinh tự đọc GHĐ, ĐCNN trước khi bấm vào dụng cụ.","Liên hệ: biển báo an toàn trên đường, trong nhà máy."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 2, 3)</p><ul class="tlist"><li>Nêu được các quy định an toàn khi học trong phòng thực hành; phân biệt được các kí hiệu cảnh báo; biết cách sử dụng kính lúp và kính hiển vi quang học; nhận biết các dụng cụ đo thông dụng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 2 An toàn trong phòng thực hành; Bài 3 Sử dụng kính lúp và kính hiển vi quang học; các bài đo (Bài 4 – 7).</li>
<li>Màu và hình dạng biển báo an toàn (cấm, cảnh báo, bắt buộc, chỉ dẫn) theo hệ thống biển báo an toàn quốc tế: <a href="https://www.boutique.afnor.org/en-gb/standard/iso-386412011/graphical-symbols-safety-colours-and-safety-signs-part-1-design-principles-/xs119124/117526" target="_blank" rel="noopener">ISO 3864-1:2011 – Safety colours and safety signs – Design principles</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>GHĐ, ĐCNN là thông số ghi trên các dụng cụ mẫu trong mô hình; dụng cụ thật có thể khác. Hình biển báo vẽ giản lược.</li></ul>`;

let S;
LabKHTN.register("K6-C-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"phan",t:"Phần"},{k:"nd",t:"Nội dung"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Phòng thực hành 3D: an toàn, biển báo, dụng cụ đo, kính lúp, kính hiển vi",legend:{w:290},bench:[4.4,1.1],seed:6,
      views:{qt:{t:[-1.6,.25,0],yaw:.2,pitch:.35,rad:.55,label:"Quy tắc",icon:IC.hand},bien:{t:[0,.6,-.5],yaw:0,pitch:.05,rad:.78,label:"Biển báo",icon:IC.ban},do:{t:[1.35,.08,0],yaw:-.15,pitch:.62,rad:.5,label:"Dụng cụ đo",icon:IC.grid},
        lup:{t:[-.6,.08,.15],yaw:.1,pitch:.55,rad:.25,label:"Kính lúp",icon:IC.lens},khv:{t:[-1.6,.33,0],yaw:.55,pitch:.18,rad:.36,label:"Kính hiển vi",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={ri:0,rules:{},sel:null,signs:{},tools:{},tsel:null,lupD:2,lupOk:false,parts:{},psel:null,recs:0};
    const rec=(phan,nd,kq)=>{S.recs++;api.record({lan:String(S.recs),phan,nd,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const texM=(tex,key,o)=>Object.assign({type:"unlit",color:"#FFFFFF",key:key||"tex",hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.4)discard;base.rgb=c.rgb;}"},textures:{uTex:tex}},o||{});
    const vplane=(w,h)=>{const g=G.plane(w,h);const P=g.pos,N=g.nrm;for(let i=0;i<P.length;i+=3){const px=P[i],pz=P[i+2];P[i]=px;P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}return g};
    /* ---------- biển báo (vẽ canvas) ---------- */
    function flame(g,x,y,s){g.save();g.translate(x,y);g.scale(s,s);g.beginPath();g.moveTo(0,40);g.bezierCurveTo(-40,30,-38,-10,-8,-50);g.bezierCurveTo(-6,-20,10,-30,8,-58);g.bezierCurveTo(40,-20,44,25,0,40);g.fill();g.restore()}
    function sign(k){const c=document.createElement("canvas");c.width=256;c.height=256;const g=c.getContext("2d");g.lineJoin="round";g.lineCap="round";const blk="#111";const sg=SIGNS.find(x=>x.k===k);
      if(sg.l==="cam"){g.fillStyle="#FFF";g.beginPath();g.arc(128,128,118,0,6.283);g.fill();g.fillStyle=blk;if(k==="camlua")flame(g,128,140,1.05);else{g.fillRect(84,96,46,70);g.fillRect(130,110,16,10);g.beginPath();g.moveTo(150,80);g.lineTo(150,166);g.lineWidth=8;g.strokeStyle=blk;g.stroke();g.beginPath();g.moveTo(172,80);g.lineTo(172,166);g.stroke()}
        g.strokeStyle="#D32F2F";g.lineWidth=22;g.beginPath();g.arc(128,128,106,0,6.283);g.stroke();g.beginPath();g.moveTo(53,53);g.lineTo(203,203);g.stroke()}
      else if(sg.l==="canh"){g.fillStyle="#FACC15";g.beginPath();g.moveTo(128,16);g.lineTo(244,226);g.lineTo(12,226);g.closePath();g.fill();g.strokeStyle=blk;g.lineWidth=14;g.stroke();g.fillStyle=blk;g.strokeStyle=blk;
        if(k==="chay")flame(g,128,170,.8);else if(k==="dien"){g.beginPath();g.moveTo(140,82);g.lineTo(100,158);g.lineTo(130,158);g.lineTo(112,210);g.lineTo(160,130);g.lineTo(130,130);g.lineTo(150,82);g.closePath();g.fill()}
        else if(k==="doc"){g.beginPath();g.ellipse(128,130,32,30,0,0,6.283);g.fill();g.fillRect(113,146,30,20);g.fillStyle="#FACC15";g.beginPath();g.arc(116,128,8,0,6.283);g.arc(140,128,8,0,6.283);g.fill();g.lineWidth=11;g.beginPath();g.moveTo(86,170);g.lineTo(170,204);g.moveTo(170,170);g.lineTo(86,204);g.stroke()}
        else{g.save();g.translate(104,96);g.rotate(.5);g.fillRect(-7,0,14,34);g.restore();g.save();g.translate(152,96);g.rotate(-.5);g.fillRect(-7,0,14,34);g.restore();g.beginPath();g.arc(114,138,4,0,6.283);g.arc(144,140,4,0,6.283);g.fill();g.fillRect(74,176,46,10);g.beginPath();g.moveTo(132,176);g.lineTo(186,176);g.lineTo(186,208);g.lineTo(132,192);g.closePath();g.fill()}}
      else if(sg.l==="bb"){g.fillStyle="#1D4ED8";g.beginPath();g.arc(128,128,118,0,6.283);g.fill();g.fillStyle="#FFF";g.strokeStyle="#FFF";
        if(k==="kinh"){g.beginPath();g.ellipse(92,128,32,24,0,0,6.283);g.ellipse(164,128,32,24,0,0,6.283);g.fill();g.lineWidth=10;g.beginPath();g.moveTo(124,124);g.lineTo(132,124);g.stroke();g.beginPath();g.moveTo(60,124);g.lineTo(34,112);g.moveTo(196,124);g.lineTo(222,112);g.stroke()}
        else{g.beginPath();g.moveTo(96,206);g.lineTo(96,120);g.quadraticCurveTo(96,60,108,60);g.lineTo(108,118);g.lineTo(118,52);g.quadraticCurveTo(128,46,130,56);g.lineTo(128,116);g.lineTo(142,58);g.quadraticCurveTo(152,54,154,64);g.lineTo(146,122);g.lineTo(162,80);g.quadraticCurveTo(172,78,172,90);g.lineTo(160,150);g.quadraticCurveTo(156,190,150,206);g.closePath();g.fill()}}
      else{const bg=k==="thoat"?"#15803D":"#DC2626";g.fillStyle=bg;C.rr(g,10,10,236,236,16);g.fill();g.fillStyle="#FFF";
        if(k==="thoat"){g.beginPath();g.arc(116,64,18,0,6.283);g.fill();g.lineWidth=18;g.strokeStyle="#FFF";g.beginPath();g.moveTo(108,90);g.lineTo(96,150);g.lineTo(130,176);g.lineTo(122,216);g.moveTo(96,150);g.lineTo(64,190);g.moveTo(104,104);g.lineTo(140,124);g.moveTo(104,104);g.lineTo(76,126);g.stroke();g.fillRect(170,40,48,170);g.fillStyle=bg;g.fillRect(178,50,32,150)}
        else{C.rr(g,96,70,64,150,22);g.fill();g.fillRect(118,44,20,30);g.lineWidth=10;g.strokeStyle="#FFF";g.beginPath();g.moveTo(138,56);g.lineTo(186,46);g.lineTo(196,96);g.stroke()}}
      return R.tex2D(c,{mip:true})}
    /* tường chứa biển */
    const wall=root.add(R.mesh(G.box(2.4,1.1,.04,.01,2),{color:"#E7E5E4",rough:.9}));wall.pos=[0,.55,-.62];
    const signN=[];SIGNS.forEach((sg,i)=>{const n=root.add(R.mesh(vplane(.2,.2),texM(sign(sg.k),"sign")));const col=i%5,row=Math.floor(i/5);n.pos=[-.56+col*.28,.75-row*.32,-.598];signN.push(n)});
    /* ---------- dụng cụ đo ---------- */
    const TX=1.35;const tools={};const tN=root.add(new G.Node());tN.pos=[TX,0,0];
    const ticks=(w,n,lab)=>{const c=document.createElement("canvas");c.width=1024;c.height=96;const g=c.getContext("2d");g.fillStyle="#FEF3C7";g.fillRect(0,0,1024,96);g.fillStyle="#111";for(let i=0;i<=n;i++){const x=12+i*(1000/n);const L=i%10===0?46:i%5===0?32:20;g.fillRect(x-1,0,2,L);if(i%10===0&&lab){g.font="700 22px system-ui";g.textAlign="center";g.fillText(lab(i/10),x,84)}}return R.tex2D(c,{mip:true})};
    {const n=tN.add(new G.Node());n.pos=[-.3,0,.18];n.add(R.mesh(G.box(.32,.004,.035,.001,1),{color:"#FEF3C7",rough:.6})).pos=[0,.002,0];const top=n.add(R.mesh(G.plane(.32,.035),texM(ticks(.32,300,v=>String(v)),"tick")));top.pos=[0,.0045,0];tools.thuoc=n}
    {const n=tN.add(new G.Node());n.pos=[.08,0,.2];n.add(R.mesh(G.cylinder(.04,.025,30),{color:"#FACC15",rough:.4}));n.add(R.mesh(G.box(.12,.002,.016,.0005,1),{color:"#FDE68A",rough:.5})).pos=[.08,.003,0];tools.cuon=n}
    {const n=tN.add(new G.Node());n.pos=[.32,0,.15];n.add(R.mesh(G.box(.16,.03,.14,.01,2),{color:"#E5E7EB",rough:.4})).pos=[0,.015,0];n.add(R.mesh(G.box(.13,.004,.11,.003,2),{color:"#9CA3AF",metal:.8,rough:.3})).pos=[0,.032,-.005];
      const c=document.createElement("canvas");c.width=256;c.height=96;const g=c.getContext("2d");g.fillStyle="#9DB59A";g.fillRect(0,0,256,96);g.fillStyle="#1C2A1C";g.font="700 58px 'Courier New',monospace";g.textAlign="right";g.fillText("0.0",200,70);g.font="700 30px system-ui";g.fillText("g",244,70);
      const lc=n.add(R.mesh(G.plane(.07,.025),texM(R.tex2D(c),"lcd")));lc.pos=[0,.0305,.058];lc.quat=Q.euler(-.5,0,0);tools.can=n}
    const thermo=(len,col)=>{const n=new G.Node();n.add(R.mesh(G.cylinder(.006,len,12),{type:"glass",color:"#F8FAFC",alpha:.55}));n.add(R.mesh(G.sphere(.008,12,8),{color:col,rough:.3}));n.add(R.mesh(G.cylinder(.002,len*.55,6),{color:col,rough:.3}));return n};
    {const n=tN.add(thermo(.12,"#B91C1C"));n.pos=[-.32,.008,.04];n.quat=Q.euler(0,0,Math.PI/2);tools.ytam=n}
    {const n=tN.add(thermo(.26,"#DC2626"));n.pos=[-.32,.008,-.06];n.quat=Q.euler(0,0,Math.PI/2);tools.ptn=n}
    {const n=tN.add(new G.Node());n.pos=[.06,0,-.02];n.add(R.mesh(G.cylinder(.05,.018,32),{color:"#111827",rough:.4}));n.add(R.mesh(G.cylinder(.04,.002,32),{color:"#9DB59A",rough:.5})).pos=[0,.018,0];n.add(R.mesh(G.cylinder(.008,.012,12),{color:"#9CA3AF",metal:.8})).pos=[0,.008,.052];tools.dh=n}
    {const n=tN.add(new G.Node());n.pos=[.3,0,-.1];n.add(R.mesh(G.cylinder(.03,.008,24),{color:"#1E3A8A",rough:.5}));n.add(R.mesh(G.lathe([[0,.008],[.018,.008],[.018,.24],[.022,.25],[.018,.252],[0,.252]],28),{type:"glass",color:"#E0F2FE",alpha:.5}));tools.ong=n}
    {const n=tN.add(new G.Node());n.pos=[-.1,0,-.14];n.quat=Q.euler(0,0,Math.PI/2);n.add(R.mesh(G.cylinder(.014,.2,16),{type:"glass",color:"#F8FAFC",alpha:.55}));n.add(R.mesh(G.cylinder(.006,.12,10),{color:"#9CA3AF",metal:.8})).pos=[0,.04,0];n.add(R.mesh(G.cylinder(.003,.05,6),{color:"#9CA3AF",metal:.8})).pos=[0,-.05,0];tools.lk=n;n.pos=[-.1,.015,-.14]}
    /* ---------- kính lúp ---------- */
    const LX=-.6;const lupN=root.add(new G.Node());lupN.pos=[LX,0,.15];
    const pc=document.createElement("canvas");pc.width=512;pc.height=512;{const g=pc.getContext("2d");g.fillStyle="#FAFAF9";g.fillRect(0,0,512,512);g.fillStyle="#065F46";g.font="700 34px 'Be Vietnam Pro',system-ui";g.fillText("Khoa học",40,90);g.fillStyle="#111";g.font="500 20px system-ui";
      ["Kính lúp giúp quan sát rõ","những vật nhỏ như con kiến,","vân tay, gân lá, chữ in nhỏ."].forEach((t,i)=>g.fillText(t,40,140+i*30));
      g.fillStyle="#4D7C0F";g.beginPath();g.ellipse(256,360,150,70,-.2,0,6.283);g.fill();g.strokeStyle="#BEF264";g.lineWidth=4;g.beginPath();g.moveTo(120,390);g.lineTo(390,330);g.stroke();for(let i=0;i<7;i++){g.beginPath();g.moveTo(150+i*36,385-i*8);g.lineTo(170+i*36,330-i*8);g.stroke()}}
    const paper=lupN.add(R.mesh(G.plane(.16,.16),texM(R.tex2D(pc,{mip:true}),"paper")));paper.pos=[0,.001,0];
    const lens=lupN.add(new G.Node());lens.add(R.mesh(G.lathe([[0,-.004],[.035,0],[0,.004]],40),{type:"glass",color:"#F8FAFC",alpha:.3}));lens.add(R.mesh(G.tube(Array.from({length:41},(_,i)=>[Math.cos(i/40*6.283)*.036,0,Math.sin(i/40*6.283)*.036]),.003,8),{color:"#1F2937",rough:.4}));
    const hd=lens.add(R.mesh(G.cylinder(.006,.09,12),{color:"#7C2D12",rough:.6}));hd.quat=Q.euler(0,0,Math.PI/2);hd.pos=[.08,0,0];
    const F=10;   /* tiêu cự kính lúp: 10 cm (độ bội giác cỡ ×2,5) */
    /* lớp phủ: ảnh nhìn qua kính lúp */
    const ov=document.createElement("canvas");ov.style.cssText="position:absolute;display:none;pointer-events:none;border-radius:50%";K.over.appendChild(ov);let oc=ov.getContext("2d"),OS=0;
    K.onLayout((sf,safe)=>{const dpr=Math.min(2,window.devicePixelRatio||1);OS=Math.round(Math.min(safe.w,safe.h)*.5);ov.style.left=(safe.x+safe.w-OS-16)+"px";ov.style.top=(safe.y+16)+"px";ov.style.width=OS+"px";ov.style.height=OS+"px";ov.width=OS*dpr;ov.height=OS*dpr;oc=ov.getContext("2d");oc.setTransform(dpr,0,0,dpr,0,0)});
    function lupView(){if(K.view!=="lup"){ov.style.display="none";return}ov.style.display="block";const g=oc,d=S.lupD;g.clearRect(0,0,OS,OS);g.save();g.beginPath();g.arc(OS/2,OS/2,OS/2-4,0,6.283);g.clip();
      let mag,blur,flip=false;if(d<F){mag=F/(F-d);const v=d*F/(F-d);blur=v<20?(20-v)*.35:Math.max(0,(mag-6))*1.2}else{flip=true;mag=d>F+1?F/(d-F):6;blur=8}
      mag=Math.min(mag,8);g.fillStyle="#FAFAF9";g.fillRect(0,0,OS,OS);g.save();if(blur>.3)g.filter=`blur(${blur.toFixed(1)}px)`;g.translate(OS/2,OS/2);g.scale(mag*(flip?-1:1)*OS/512*1.6,mag*(flip?-1:1)*OS/512*1.6);g.drawImage(pc,-256,-190);g.restore();g.restore();
      g.strokeStyle="#1F2937";g.lineWidth=8;g.beginPath();g.arc(OS/2,OS/2,OS/2-4,0,6.283);g.stroke();
      if(!S.lupOk&&d<F&&blur<1.2){S.lupOk=true;rec("Kính lúp",`kính cách trang giấy ${d} cm (tiêu cự ${F} cm)`,`ảnh rõ, cùng chiều, phóng to khoảng ${fmt(mag,1)} lần`);refresh()}}
    /* ---------- kính hiển vi ---------- */
    const mic=root.add(M.build3D(R,G,{nObj:3}));mic.pos=[-1.6,0,0];mic.setObj(0);mic.setLight(true);
    const PP={thi:[0,.68,.07],vat:[.03,.41,.08],dia:[0,.445,.06],ocTo:[-.07,.25,-.12],ocNho:[-.09,.25,-.12],ban:[.12,.25,.06],den:[0,.1,.06],than:[0,.38,-.19],chan:[.15,.04,.15]};
    /* ---------- quy tắc: vật dụng minh họa trên bàn ---------- */
    const qt=root.add(new G.Node());qt.pos=[-1.6,0,0];
    /* ---------- vòng lặp ---------- */
    let tk=0;K.onFrame(dt=>{const v=K.view;tk+=dt;if(tk>.3){tk=0;K.updateInfo()}lens.pos=[0,S.lupD*.006+.004,0];lupView();mic.visible=v==="khv"||v==="qt";
      signN.forEach((n,i)=>{const sel=S.sel===i;n.scl=sel?[1.12,1.12,1.12]:[1,1,1]});for(const t of TOOLS)tools[t.k].scl=S.tsel===t.k?[1.15,1.15,1.15]:[1,1,1]});
    K.pickFn((x,y)=>{const r=R.ray(x,y),v=K.view;if(v==="bien"){let best=null,bd=1e9;signN.forEach((n,i)=>{const t=G.hit.box(r,V3.add(n.pos,[-.1,-.1,-.01]),V3.add(n.pos,[.1,.1,.01]));if(t!=null&&t<bd){bd=t;best=i}});return best!=null?{s:best}:null}
      if(v==="do"){let best=null,bd=1e9;for(const t of TOOLS){const p=V3.add([TX,0,0],tools[t.k].pos);const h=G.hit.sphere(r,V3.add(p,[0,.03,0]),.09);if(h!=null&&h<bd){bd=h;best=t.k}}return best?{t:best}:null}
      if(v==="khv"){let best=null,bd=1e9;for(const p of PARTS){const h=G.hit.sphere(r,V3.add([-1.6,0,0],PP[p.k]),.035);if(h!=null&&h<bd){bd=h;best=p.k}}return best?{p:best}:null}return null});
    K.tapFn(h=>{if(!h)return;if(h.s!=null)S.sel=h.s;else if(h.t){S.tsel=h.t;if(!S.tools[h.t]){S.tools[h.t]=1;const t=TOOLS.find(x=>x.k===h.t);rec("Dụng cụ đo",`${t.t} (đo ${t.do})`,`GHĐ: ${t.ghd}; ĐCNN: ${t.dc}`)}}
      else if(h.p){S.psel=h.p;if(!S.parts[h.p]){S.parts[h.p]=1;const p=PARTS.find(x=>x.k===h.p);rec("Kính hiển vi",p.t,p.f)}}refresh()});
    K.dockFn(()=>{const v=K.view;if(v==="qt"){const i=S.ri;if(i>=RULES.length)return[{k:"rsq",label:"Làm lại",icon:IC.reset}];return[{grid:[{k:"rule",v:"1",label:"Nên làm",icon:IC.plus},{k:"rule",v:"0",label:"Không được làm",icon:IC.ban}]}]}
      if(v==="bien"){const dis=S.sel==null||!!S.signs[S.sel];return[{grid:Object.keys(LOAI).map(l=>({k:"loai",v:l,label:LOAI[l],icon:"",dis}))},{k:"nexts",label:"Biển tiếp theo",icon:IC.step}]}
      if(v==="lup")return[{grid:[{k:"lup",v:"-1",label:"Hạ kính lúp",icon:IC.minus,dis:S.lupD<=1},{k:"lup",v:"1",label:"Nâng kính lúp",icon:IC.plus,dis:S.lupD>=16}]}];
      if(v==="do")return[{grid:TOOLS.map(t=>({k:"tool",v:t.k,label:t.t,icon:"",on:S.tsel===t.k}))}];
      return[{grid:PARTS.map(p=>({k:"part",v:p.k,label:p.t,icon:"",on:S.psel===p.k}))}]});
    K.onDock((k,v)=>{if(k==="rule"){const [t,ok]=RULES[S.ri];if((v==="1")===ok){S.rules[S.ri]=1;rec("Quy tắc an toàn",t,ok?"Nên làm":"Không được làm");S.ri++}else api.toast(ok?"Đây là việc nên làm để đảm bảo an toàn.":"Đây là việc không được làm vì có thể gây nguy hiểm.","warn",2200)}
      else if(k==="rsq"){S.ri=0}
      else if(k==="loai"){const sg=SIGNS[S.sel];if(v===sg.l){S.signs[S.sel]=1;rec("Biển báo",sg.t,LOAI[sg.l]);const nx=SIGNS.findIndex((x,i)=>!S.signs[i]);S.sel=nx>=0?nx:null}else api.toast(`Gợi ý: xem hình dạng và màu nền của biển “${sg.t}”.`,"warn",2200)}
      else if(k==="nexts"){const L=SIGNS.length;for(let j=1;j<=L;j++){const i=((S.sel==null?-1:S.sel)+j)%L;if(!S.signs[i]){S.sel=i;break}}}
      else if(k==="lup")S.lupD=C.clamp(S.lupD+(+v),1,16);else if(k==="tool")K._tap({t:v});else if(k==="part")K._tap({p:v});refresh()});
    const selL=K.label("",()=>K.view==="bien"&&S.sel!=null?V3.add(signN[S.sel].pos,[0,.13,0]):[-99,-99,-99],{view:"bien",dir:"n",len:12});
    const toolL=K.label("Tên dụng cụ",()=>S.tsel?V3.add([TX,0,0],V3.add(tools[S.tsel].pos,[0,.06,0])):[-99,-99,-99],{view:"do",dir:"n",len:30});
    const partL=K.label("Bộ phận",()=>S.psel?V3.add([-1.6,0,0],PP[S.psel]):[-99,-99,-99],{view:"khv",dir:"ne",len:40});
    K.onFrame(()=>{selL.set(S.sel!=null?(S.signs[S.sel]?`${SIGNS[S.sel].t} · ${LOAI[SIGNS[S.sel].l]}`:"Biển này thuộc loại nào?"):"");if(S.tsel){const t=TOOLS.find(x=>x.k===S.tsel);toolL.set(`${t.t} · GHĐ ${t.ghd} · ĐCNN ${t.dc}`)}if(S.psel)partL.set(PARTS.find(p=>p.k===S.psel).t)});
    K.infoFn(()=>{const v=K.view;
      if(v==="qt"){const i=S.ri;return i<RULES.length?`<div><b>Tình huống ${i+1}/${RULES.length}</b></div><div>${RULES[i][0]}</div><small>Chọn “Nên làm” hoặc “Không được làm” ở khay.</small>`:`<div><b>Đã xong 8 tình huống</b></div><small>Ghi nhớ các quy tắc an toàn trong phòng thực hành.</small>`}
      if(v==="bien"){const n=Object.keys(S.signs).length;return `<div><b>Biển báo trong phòng thực hành</b> · đã xếp ${n}/${SIGNS.length}</div><small>Chạm vào một biển rồi chọn loại ở khay. Biển cấm: tròn, viền đỏ · cảnh báo: tam giác vàng · bắt buộc: tròn xanh · chỉ dẫn: vuông, chữ nhật.</small>`}
      if(v==="do"){const t=S.tsel?TOOLS.find(x=>x.k===S.tsel):null;return t?`<div><b>${t.t}</b> – đo ${t.do}</div><div>GHĐ: ${t.ghd}</div><div>ĐCNN: ${t.dc}</div>`:`<div><b>Dụng cụ đo</b></div><small>Chạm vào dụng cụ trên bàn để xem giới hạn đo và độ chia nhỏ nhất.</small>`}
      if(v==="lup")return `<div><b>Kính lúp</b> (tiêu cự ${F} cm)</div><div>Khoảng cách kính – trang giấy: ${S.lupD} cm</div><small>${S.lupD<F?"Vật trong khoảng tiêu cự: ảnh cùng chiều, phóng to.":"Vật ngoài khoảng tiêu cự: không nhìn rõ (ảnh mờ, ngược)."} Dịch kính ra xa dần đến khi ảnh rõ nhất.</small>`;
      const p=S.psel?PARTS.find(x=>x.k===S.psel):null;return p?`<div><b>${p.t}</b></div><small>${p.f}</small><div style="margin-top:4px">Đã nhận biết ${Object.keys(S.parts).length}/${PARTS.length}</div>`:`<div><b>Kính hiển vi quang học</b></div><small>Chạm vào từng bộ phận hoặc chọn tên ở khay.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.onUnmount&&K.onUnmount(()=>ov.remove());
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K.goView("qt");for(const r of RULES)K._dockH("rule",r[1]?"1":"0");K.goView("bien");SIGNS.forEach((s,i)=>{S.sel=i;K._dockH("loai",s.l)});K.goView("do");for(const t of TOOLS)K._dockH("tool",t.k);K.goView("lup");S.lupD=6;S.lupOk=true;rec("Kính lúp","6 cm","ảnh rõ");K.goView("khv");for(const p of PARTS)K._dockH("part",p.k)}};
    return K.mount(st)}
});
})();
