/* K7-S-02 · Thực hành: chứng minh quang hợp ở cây xanh (SGK KHTN 7 – Kết nối tri thức, Bài 24) · 3D
   1. Tinh bột được tạo thành khi lá được chiếu sáng: để chậu cây trong tối 2 ngày → bịt một phần lá bằng băng giấy đen ở cả hai mặt → chiếu sáng
      4 – 6 giờ → ngắt lá, bỏ băng giấy → đun cách thủy trong cồn 90° để tẩy diệp lục → rửa nước ấm → nhỏ dung dịch iodine loãng.
      Phần lá được chiếu sáng có màu xanh tím (có tinh bột); phần bị bịt không có màu xanh tím.
   2. Khí oxygen được tạo ra: cành rong đuôi chó trong cốc nước, úp ống nghiệm đầy nước; chiếu sáng → bọt khí nổi lên đẩy nước trong ống xuống.
      Đưa que đóm còn tàn đỏ vào miệng ống → que đóm bùng cháy. Cốc đối chứng để trong tối: không có bọt khí. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt,H=G.hex;
const STEPS=[{t:"Để chậu cây vào chỗ tối 2 ngày",d:"Lá không quang hợp được; tinh bột có sẵn trong lá được chuyển đi hết.",dur:2.2,tl:"2 ngày"},
  {t:"Bịt một phần lá bằng băng giấy đen (cả hai mặt)",d:"Phần bị bịt không nhận được ánh sáng.",dur:1.4},
  {t:"Chiếu sáng 4 – 6 giờ",d:"Phần lá không bị bịt được chiếu sáng.",dur:2.4,tl:"6 giờ"},
  {t:"Ngắt lá, bỏ băng giấy, cho vào cồn 90°",d:"Chuẩn bị tẩy diệp lục.",dur:2.0},
  {t:"Đun cách thủy",d:"Cồn hòa tan diệp lục: lá mất màu xanh, cồn chuyển màu xanh lục.",dur:3.4,tl:"≈ 10 phút"},
  {t:"Rửa lá trong cốc nước ấm",d:"Loại bỏ cồn còn bám trên lá.",dur:1.8},
  {t:"Nhỏ dung dịch iodine loãng lên lá",d:"Iodine làm tinh bột chuyển màu xanh tím.",dur:2.6}];
const SPEC={
  predict:[{id:"p1",q:"Sau khi nhỏ iodine, phần lá bị bịt băng giấy đen sẽ:",opts:[["k","Không có màu xanh tím"],["xt","Có màu xanh tím"],["den","Chuyển màu đen hoàn toàn"]],ans:"k",res:"Kết quả: phần bị bịt không được chiếu sáng nên không tạo tinh bột, không chuyển màu xanh tím."},
    {id:"p2",q:"Khí trong ống nghiệm úp trên cành rong được chiếu sáng làm que đóm còn tàn đỏ:",opts:[["bung","Bùng cháy"],["tat","Tắt ngay"],["k","Không thay đổi"]],ans:"bung",res:"Kết quả: que đóm bùng cháy → khí đó là oxygen."}],
  taskLead:"Chọn phần ở khay và bấm “Bước tiếp theo” để làm lần lượt từng bước như trong SGK.",
  tasks:[{html:"<b>Tinh bột:</b> làm đủ 7 bước và quan sát màu của lá.",done:()=>S.tb>=STEPS.length&&S.tbT>=1},
    {html:"<b>Oxygen:</b> thu khí từ cành rong được chiếu sáng và thử bằng que đóm.",done:()=>!!S.ox.tested}],
  obs:[{id:"a",q:"Mục đích của việc để chậu cây vào chỗ tối 2 ngày là:",opts:[["ok","Làm cho lá không còn tinh bột có sẵn từ trước"],["toi","Làm cây chết"],["nuoc","Để cây hút nhiều nước"]],ans:"ok",why:"Nhờ đó tinh bột phát hiện sau thí nghiệm chắc chắn được tạo ra trong lúc chiếu sáng."},
    {id:"b",q:"Vì sao phải đun lá trong cồn trước khi thử iodine?",opts:[["ok","Để tẩy hết diệp lục, dễ quan sát màu xanh tím"],["tb","Để tạo tinh bột"],["chin","Để lá mềm"]],ans:"ok",why:"Màu xanh của diệp lục che màu do iodine tạo ra."},
    {id:"c",q:"Cốc rong để trong tối không có bọt khí chứng tỏ:",opts:[["ok","Cây chỉ quang hợp, thải oxygen khi có ánh sáng"],["chet","Rong đã chết"],["nuoc","Nước không có khí"]],ans:"ok",why:"Đó là thí nghiệm đối chứng."}],
  concl:{html:`<ul class="tlist"><li>Phần lá được chiếu sáng có màu xanh tím khi nhỏ iodine → lá tạo ra <b>tinh bột</b> khi có ánh sáng. Phần lá bị bịt kín không tạo tinh bột.</li>
    <li>Cành rong được chiếu sáng thải ra khí làm que đóm còn tàn đỏ bùng cháy → khí đó là <b>oxygen</b>. Trong tối không có bọt khí.</li>
    <li>Kết luận: cây xanh quang hợp cần ánh sáng; sản phẩm của quang hợp gồm tinh bột (chất hữu cơ) và khí oxygen.</li></ul>`,
    quiz:[{id:"q1",q:"Thuốc thử dùng để nhận biết tinh bột là:",opts:[["a","Dung dịch iodine"],["b","Nước vôi trong"],["c","Cồn"]],ans:"a",why:{b:"Nước vôi trong dùng nhận biết khí carbon dioxide.",c:"Cồn dùng để tẩy diệp lục."}},
      {id:"q2",q:"Phương trình chữ của quang hợp là:",opts:[["a","Nước + Carbon dioxide → (ánh sáng, diệp lục) Glucose + Oxygen"],["b","Glucose + Oxygen → Nước + Carbon dioxide"],["c","Nước + Oxygen → Glucose"]],ans:"a",why:{b:"Đây là phương trình hô hấp tế bào.",c:"Thiếu carbon dioxide và sản phẩm oxygen."}}],
    done:`<h2>Hoàn thành: chứng minh quang hợp</h2><p class="muted">Lá tạo tinh bột khi có ánh sáng; quang hợp thải khí oxygen.</p>`},
  gv:["Lưu ý an toàn: cồn dễ cháy – chỉ đun cách thủy, không đun trực tiếp trên lửa.","Hỏi: vì sao phải bịt cả hai mặt lá?","Cho học sinh so sánh cốc rong được chiếu sáng với cốc để trong tối."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 24)</p><ul class="tlist"><li>Tiến hành được thí nghiệm chứng minh quang hợp ở cây xanh: thí nghiệm chứng minh tinh bột được tạo thành khi lá được chiếu sáng và thí nghiệm chứng minh quang hợp giải phóng khí oxygen.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung và các bước tiến hành: SGK KHTN 7 (Kết nối tri thức), Bài 24 Thực hành: Chứng minh quang hợp ở cây xanh.</li>
<li>Phản ứng iodine – tinh bột cho màu xanh tím; sản phẩm của quang hợp: <a href="https://openstax.org/books/biology-2e/pages/8-1-overview-of-photosynthesis" target="_blank" rel="noopener">OpenStax Biology 2e, mục 8.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thời gian các bước được rút ngắn để quan sát. Màu sắc lá sau các bước là hình mô phỏng dựa theo mô tả của SGK.</li></ul>`;

let S;
LabKHTN.register("K7-S-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Bước"},{k:"tn",t:"Thao tác"},{k:"kq",t:"Hiện tượng / kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D chứng minh quang hợp",legend:{w:290},bench:[14,3.4],seed:9,
      views:{tb:{t:[-.4,.75,0],yaw:.1,pitch:.3,rad:2.05,label:"Tinh bột",icon:IC.dna},kq:{t:[2.75,.05,0],yaw:0,pitch:1.0,rad:.5,label:"Lá sau thí nghiệm",icon:IC.eye},ox:{t:[5,1.0,0],yaw:-.15,pitch:.18,rad:1.55,label:"Khí oxygen",icon:IC.drop}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={tb:0,tbT:1,ox:{light:false,gas:0,phase:0,t:0,tested:false},recs:0};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const ease=t=>t*t*(3-2*t);
    /* ---------- lá: lưới mặt cong + texture vẽ bằng canvas ---------- */
    function leafGeo(L,W,curl){const NU=24,NV=8,p=[],n=[],uv=[],ix=[];const wf=u=>W*Math.pow(Math.sin(Math.PI*Math.min(1,u*1.02)),.75)*(1-.25*u);
      const P=(u,v)=>{const x=u*L,w=wf(u)*v;return[x,-curl*x*x+Math.abs(v)*.12*wf(u),w]};
      for(let i=0;i<=NU;i++)for(let j=0;j<=NV;j++){const u=i/NU,v=j/NV*2-1;const a=P(u,v),du=V3.sub(P(Math.min(1,u+.01),v),P(Math.max(0,u-.01),v)),dv=V3.sub(P(u,Math.min(1,v+.02)),P(u,Math.max(-1,v-.02)));
        const nn=V3.norm(V3.cross(dv,du));p.push(...a);n.push(...(isNaN(nn[0])?[0,1,0]:nn));uv.push(u,(v+1)/2)}
      for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j,b=a+NV+1;ix.push(a,b,a+1,a+1,b,b+1)}
      return{pos:new Float32Array(p),nrm:new Float32Array(n),idx:new Uint16Array(ix),col:null,uv:new Float32Array(uv)}}
    const leafMat=tex=>({type:"std",color:"#FFFFFF",rough:.85,sheen:.12,side:"double",key:"leaf",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}});
    const LCV=document.createElement("canvas");LCV.width=512;LCV.height=256;const LT=R.tex2D(LCV);
    const GREEN=[52,112,40],PALE=[205,196,148],BLUE=[24,14,48],BROWN=[150,104,36];const mix=(a,b,t)=>a.map((x,i)=>Math.round(x+(b[i]-x)*t));
    function paintLeaf(st,k){const g=LCV.getContext("2d");let base=GREEN,strip=GREEN;
      if(st>=5){base=mix(GREEN,PALE,st===5?k:1);strip=base}if(st>=7){base=mix(PALE,BLUE,k);strip=mix(PALE,BROWN,k*.8)}
      g.fillStyle=`rgb(${base})`;g.fillRect(0,0,512,256);g.fillStyle=`rgb(${strip})`;g.fillRect(512*.42,0,512*.2,256);
      /* gân lá */
      const vein=st>=5?"rgba(255,255,240,.55)":"rgba(210,240,170,.55)";g.strokeStyle=vein;g.lineWidth=5;g.beginPath();g.moveTo(0,128);g.lineTo(512,128);g.stroke();g.lineWidth=2.2;
      for(let i=1;i<9;i++){const x=i*55;for(const s of [-1,1]){g.beginPath();g.moveTo(x,128);g.quadraticCurveTo(x+30,128+s*50,x+60,128+s*118);g.stroke()}}
      const sp=g.createLinearGradient(0,0,0,256);sp.addColorStop(0,"rgba(255,255,255,.12)");sp.addColorStop(.5,"rgba(0,0,0,0)");sp.addColorStop(1,"rgba(0,0,0,.15)");g.fillStyle=sp;g.fillRect(0,0,512,256);LT.update(LCV)}
    paintLeaf(0,0);
    const LG=leafGeo(.62,.2,.25);
    /* ---------- chậu cây ---------- */
    const PX=-2.4;const pot=root.add(new G.Node());pot.pos=[PX,0,0];
    pot.add(R.mesh(G.lathe([[0,0],[.26,0],[.3,.42],[.34,.46],[.33,.5],[0,.5]],40),{color:"#B45309",rough:.75}));pot.add(R.mesh(G.cylinder(.3,.02,40),{color:"#3F2A1C",rough:.95})).pos=[0,.46,0];
    const stemP=[[0,.46,0],[.02,.8,0],[-.01,1.15,.01],[.01,1.5,0]];pot.add(R.mesh(G.tube(G.spline(stemP,6),t=>.03*(1-t*.5),10),{color:"#4D7C0F",rough:.6}));
    const otherLeafMat={color:"#3F8A2E",rough:.55,sheen:.3,side:"double"};
    const LEAVES=[[.75,.4,.5],[.95,2.6,.35],[1.15,.9,.45],[1.35,3.6,.3],[1.5,5.2,.25]];
    for(const [y,a,tilt] of LEAVES){const n=pot.add(new G.Node());n.pos=[0,y,0];n.quat=Q.mul(Q.euler(0,a,0),Q.euler(0,0,tilt));n.add(R.mesh(LG,otherLeafMat)).scl=[.8,.8,.8]}
    /* lá thí nghiệm (đi qua các trạm) */
    const leaf=root.add(new G.Node());const leafM=leaf.add(R.mesh(LG,leafMat(LT)));
    const strip=leaf.add(R.mesh(G.box(.13,.025,.36,.006,2),{color:"#111111",rough:.8}));strip.pos=[.62*.52,-.02,0];strip.visible=false;
    const onPlant={p:[PX,1.05,0],q:Q.mul(Q.euler(0,-.25,0),Q.euler(0,0,.4))};
    /* hộp tối, đèn */
    const box=root.add(R.mesh(G.box(1.1,1.8,1.1,.03,2),{color:"#111827",rough:.9,alpha:.92,transparent:true,order:4}));box.pos=[PX,3.5,0];
    const lamp=root.add(new G.Node());lamp.pos=[PX-.95,0,.25];lamp.add(R.mesh(G.cylinder(.2,.04,30),{color:"#1F2937",rough:.4}));lamp.add(R.mesh(G.cylinder(.025,1.7,10),{color:"#9CA3AF",metal:.8,rough:.3}));
    const head=lamp.add(new G.Node());head.pos=[.25,1.7,0];head.quat=Q.euler(0,0,.9);head.add(R.mesh(G.lathe([[.06,0],[.22,-.28],[.24,-.3]],30),{color:"#F59E0B",rough:.4,side:"double"}));const bulb=head.add(R.mesh(G.sphere(.08,16,12),{type:"unlit",color:"#57534E"}));bulb.pos=[0,-.15,0];
    const beam=root.add(R.mesh(G.lathe([[.05,0],[.65,-1.1]],30),{type:"unlit",color:"#FEF3C7",alpha:.12,transparent:true,side:"double",depth:false,order:8}));beam.pos=[PX-.62,1.55,.25];beam.quat=Q.euler(0,0,.75);beam.visible=false;
    /* bếp cách thủy */
    const BX=-.5;const wb=root.add(new G.Node());wb.pos=[BX,0,0];
    for(let i=0;i<3;i++){const a=i/3*6.283;const leg=wb.add(R.mesh(G.cylinder(.015,.62,8),{color:"#374151",metal:.6,rough:.4}));leg.pos=[Math.cos(a)*.3,0,Math.sin(a)*.3]}wb.add(R.mesh(G.cylinder(.34,.02,30),{color:"#4B5563",metal:.5,rough:.4})).pos=[0,.62,0];
    const lampAl=wb.add(R.mesh(G.lathe([[0,0],[.12,0],[.14,.18],[.05,.25],[.03,.3],[0,.3]],24),{type:"glass",color:"#E0F2FE",alpha:.45}));const wick=wb.add(R.mesh(G.cylinder(.012,.05,8),{color:"#F5F5F4",rough:.9}));wick.pos=[0,.3,0];
    const fl=wb.add(K3.flame(R,[1,.6,.15],[1,.95,.75]));fl.pos=[0,.34,0];fl.scl=[.6,.6,.6];fl.visible=false;
    const big=wb.add(K3.glass(R,.3,.55));big.pos=[0,.64,0];const water=wb.add(K3.liquid(R,.285,.66,1.0,H("#CFE6FF"),.35));
    const small=wb.add(K3.glass(R,.16,.5));small.pos=[0,.7,0];const alc=wb.add(K3.liquid(R,.145,.72,1.02,H("#F1F5F9"),.4));
    const bub=root.add(K3.bubbles(R,160));
    /* cốc nước ấm, đĩa petri */
    const RX=.9;const rinse=root.add(K3.glass(R,.28,.55));rinse.pos=[RX,0,0];const rinseW=root.add(K3.liquid(R,.265,.02,.38,H("#CFE6FF"),.35));rinseW.pos=[RX,0,0];
    const DX=2.75;const petri=root.add(R.mesh(G.lathe([[0,0],[.42,0],[.43,.06],[.41,.06],[.41,.01],[0,.01]],48),{type:"glass",color:"#E0F2FE",alpha:.22}));petri.pos=[DX,0,0];
    const drop=root.add(new G.Node());drop.add(R.mesh(G.lathe([[0,0],[.025,.05],[.03,.5],[.06,.52],[.06,.68],[0,.7]],20),{type:"glass",color:"#FDE68A",alpha:.6}));drop.add(R.mesh(G.cylinder(.065,.12,20),{color:"#111827",rough:.6})).pos=[0,.66,0];drop.pos=[DX+.1,1.0,0];drop.visible=false;
    const idrop=root.add(R.mesh(G.sphere(.025,12,8),{color:"#B45309",alpha:.8,transparent:true}));idrop.visible=false;
    /* đường đi của lá */
    const POSE=[onPlant,onPlant,onPlant,onPlant,{p:[BX-.22,.85,0],q:Q.euler(0,0,-1.2)},{p:[BX-.22,.85,0],q:Q.euler(0,0,-1.2)},{p:[RX-.25,.3,0],q:Q.euler(0,0,-1.0)},{p:[DX-.3,.045,0],q:Q.euler(0,0,.16)}];
    function leafPose(){const s=S.tb,k=ease(Math.min(1,S.tbT));const A=POSE[Math.max(0,s-1)]||onPlant,B=POSE[s];return{p:V3.lerp(A.p,B.p,s===4||s===6||s===7?k:1),q:s===4||s===6||s===7?nl(A.q,B.q,k):B.q}}
    const nl=(a,b,t)=>{const d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3];const s=d<0?-1:1;const q=a.map((v,i)=>v*(1-t)+b[i]*t*s);const l=Math.hypot(...q);return q.map(v=>v/l)};
    /* ---------- thí nghiệm oxygen ---------- */
    const OX=5;function sprig(par){const n=par.add(new G.Node());const pts=[[0,0,0],[.03,.25,.01],[-.02,.5,0],[.01,.75,.02]];n.add(R.mesh(G.tube(G.spline(pts,6),.012,6),{color:"#3F6212",rough:.6}));
      const LF=G.cylinder(.004,.11,4,false),lm={color:"#4D7C0F",rough:.6};for(let w=0;w<14;w++){const y=.06+w*.05;for(let k=0;k<6;k++){const a=k/6*6.283+w*.5;const m=n.add(R.mesh(LF,lm));m.pos=[0,y,0];m.quat=Q.toward([Math.cos(a),.55,Math.sin(a)]);m.scl=[1,1-w*.03,1]}}return n}
    const cups=[];for(const [x,lit] of [[OX-.55,true],[OX+.65,false]]){const n=root.add(new G.Node());n.pos=[x,0,0];n.add(K3.glass(R,.36,.8));n.add(K3.liquid(R,.345,.02,.68,H("#CFE6FF"),.32));
      const sp=sprig(n);sp.pos=[0,.03,0];const tube=n.add(new G.Node());tube.pos=[0,1.24,0];tube.quat=Q.euler(Math.PI,0,0);tube.add(K3.testTube(R,.09,1.2));
      const tw=tube.add(R.mesh(K3.liquidGeom(.078,.012,1.1,true),{color:H("#CFE6FF"),alpha:.38,rough:.04,coat:.6,order:1}));cups.push({n,x,lit,tube,tw,sp})}
    const dark=root.add(R.mesh(G.box(.95,1.6,.95,.03,2),{color:"#111827",rough:.9,alpha:.88,transparent:true,order:4}));dark.pos=[OX+.65,.8,0];
    const lamp2=root.add(new G.Node());lamp2.pos=[OX-1.6,0,.1];lamp2.add(R.mesh(G.cylinder(.2,.04,30),{color:"#1F2937",rough:.4}));lamp2.add(R.mesh(G.cylinder(.025,1.4,10),{color:"#9CA3AF",metal:.8,rough:.3}));
    const head2=lamp2.add(new G.Node());head2.pos=[.25,1.4,0];head2.quat=Q.euler(0,0,-.9);head2.add(R.mesh(G.lathe([[.06,0],[.22,-.28],[.24,-.3]],30),{color:"#F59E0B",rough:.4,side:"double"}));const bulb2=head2.add(R.mesh(G.sphere(.08,16,12),{type:"unlit",color:"#57534E"}));bulb2.pos=[0,-.15,0];
    const splint=root.add(new G.Node());splint.add(R.mesh(G.box(.03,.9,.03,.004,1),{color:"#D6B37A",rough:.8})).pos=[0,.45,0];const ember=splint.add(R.mesh(G.sphere(.022,12,8),{type:"unlit",color:"#F97316"}));
    const sfl=splint.add(K3.flame(R,[1,.6,.15],[1,.95,.75]));sfl.scl=[.35,.35,.35];sfl.quat=Q.euler(Math.PI,0,0);sfl.visible=false;splint.visible=false;
    /* ---------- cập nhật ---------- */
    K.onFrame(dt=>{const v=K.view;
      /* tinh bột */
      if(S.tbT<1){S.tbT=Math.min(1,S.tbT+dt/STEPS[S.tb-1].dur);if(S.tbT>=1)finishStep()}
      const s=S.tb,k=S.tbT;const lp=leafPose();leaf.pos=lp.p;leaf.quat=lp.q;
      box.visible=s===1;box.pos=[PX,3.5-2.6*ease(k),0];
      strip.visible=s>=2&&s<4||(s===4&&k<.4);if(s===2)strip.scl=[1,1,ease(k)];
      const lampOn=s===3&&k<1||s===3;beam.visible=lampOn&&s===3;bulb.mat.color=H(s===3?"#FFF7D6":"#57534E");
      fl.visible=s===5&&k<1;if(s===5&&k<1&&Math.random()<.5)bub.spawn([BX+(Math.random()-.5)*.4,.7,(Math.random()-.5)*.4],.012+Math.random()*.01,[0,.5,0],.6);
      alc.mat.color=H(s>=5?(k>.3||s>5?"#9CCB6A":"#F1F5F9"):"#F1F5F9");
      if(s===5)paintLeaf(5,ease(k));else if(s===7)paintLeaf(7,ease(Math.max(0,(k-.35)/.65)));
      drop.visible=s===7&&k<.9;if(s===7&&k<.6){drop.pos=[DX+.05,.4+(1-ease(Math.min(1,k*3)))*.5,0];idrop.visible=k>.2&&k<.55;idrop.pos=[DX+.05,.38-(k-.2)*1.0,0]}else idrop.visible=false;
      /* oxygen */
      const O=S.ox;bulb2.mat.color=H(O.light?"#FFF7D6":"#57534E");const lc=cups[0];
      if(O.light&&O.phase===0){O.gas=Math.min(1,O.gas+dt/9);if(Math.random()<.7)bub.spawn([lc.x+(Math.random()-.5)*.08,.25+Math.random()*.45,(Math.random()-.5)*.08],.008+Math.random()*.008,[0,.35,0],2.2)}
      {const sc=1-O.gas*.55;lc.tw.scl=[1,sc,1];lc.tw.pos=[0,1.1*(1-sc),0]}
      if(O.phase===1){O.t=Math.min(1,O.t+dt/1.6);const e=ease(O.t);lc.tube.pos=[e*.0,1.24+e*.9,0];lc.tube.quat=nl(Q.euler(Math.PI,0,0),Q.euler(0,0,0),e);if(O.t>=1){O.phase=2;O.t=0}}
      if(O.phase===2){O.t=Math.min(1,O.t+dt/1.8);splint.visible=true;const e=ease(O.t);splint.pos=[lc.x+.4-.4*e,2.9-.4*e,0];splint.quat=Q.euler(0,0,Math.PI*.92-.1*e);
        const inside=O.t>.7;ember.mat.color=H(inside?"#FDE047":"#F97316");sfl.visible=inside;if(O.t>=1&&!O.tested){O.tested=true;rec("Que đóm còn tàn đỏ đưa vào ống nghiệm","que đóm bùng cháy → khí thu được là oxygen");refresh()}}
      bub.step(dt,b=>{if(Math.abs(b.p[0]-lc.x)<.1&&Math.abs(b.p[2])<.1){if(b.p[1]>1.24-.605*O.gas-.01||O.phase>0)b.dead=true}else if(Math.abs(b.p[0]-BX)<.5){if(b.p[1]>1.0)b.dead=true}else if(b.p[1]>.68)b.dead=true});
      for(const c of cups)c.n.visible=v==="ox";for(const o of [pot,leaf,lamp,wb,rinse,rinseW,petri])o.visible=v!=="ox";if(v==="ox"){beam.visible=false;box.visible=false;drop.visible=false}dark.visible=v==="ox";lamp2.visible=v==="ox";if(v!=="ox")splint.visible=false});
    function finishStep(){const s=S.tb,Sx=STEPS[s-1];const kq=[["lá không còn tinh bột có sẵn"],["phần lá bị bịt không nhận ánh sáng"],["phần lá không bị bịt được chiếu sáng"],["lá được ngâm trong cồn"],["lá mất màu xanh (trắng vàng), cồn chuyển màu xanh lục"],["lá sạch cồn"],["phần lá được chiếu sáng: xanh tím (có tinh bột); phần bị bịt: không có màu xanh tím (vàng nâu của iodine)"]][s-1][0];rec(Sx.t,kq);refresh()}
    K.dockFn(()=>{if(K.view!=="ox"){const s=S.tb;return[{k:"next",label:s<STEPS.length?`Bước ${s+1}: ${STEPS[s].t}`:"Đã làm xong",icon:IC.step,dis:s>=STEPS.length||S.tbT<1},{k:"rtb",label:"Làm lại",icon:IC.reset}]}
      const O=S.ox;return[{k:"light",label:O.light?"Tắt đèn":"Chiếu sáng",icon:IC.sun,on:O.light,dis:O.phase>0},{k:"test",label:"Lấy ống nghiệm, thử bằng que đóm",icon:IC.fire,dis:O.gas<.6||O.phase>0},{k:"rox",label:"Làm lại",icon:IC.reset}]});
    K.onDock(k=>{if(k==="next"){if(S.tb<STEPS.length&&S.tbT>=1){S.tb++;S.tbT=0}}else if(k==="rtb"){S.tb=0;S.tbT=1;paintLeaf(0,0)}
      else if(k==="light")S.ox.light=!S.ox.light;else if(k==="test"){S.ox.phase=1;S.ox.t=0;rec("Chiếu sáng cành rong",`khí tích tụ ở đáy ống nghiệm úp ngược, đẩy nước xuống; cốc để trong tối không có bọt khí`)}
      else if(k==="rox"){S.ox={light:false,gas:0,phase:0,t:0,tested:S.ox.tested};const lc=cups[0];lc.tube.pos=[0,1.24,0];lc.tube.quat=Q.euler(Math.PI,0,0);splint.visible=false}refresh()});
    K.label("Băng giấy đen",()=>S.tb>=2&&S.tb<4?V3.add(leaf.pos,[.05,.2,.1]):[-99,-99,-99],{view:"tb",dir:"ne",len:30});
    K.label("Cồn 90° (trong cốc nhỏ)",[BX,1.15,0],{view:"tb",dir:"n",len:24});K.label("Nước ấm",[RX,.6,0],{view:"tb",dir:"n",len:20});K.label("Đĩa petri",[DX,.06,.42],{view:"tb",dir:"s",len:20});
    K.label("Đèn chiếu sáng",[PX-.75,1.7,.25],{view:"tb",dir:"nw",len:24});K.label("Lá thí nghiệm",()=>S.tb>=7?[DX,.06,0]:[-99,-99,-99],{view:"kq",dir:"n",len:60});
    K.label("Cành rong đuôi chó",[OX-.55,.45,.1],{view:"ox",dir:"sw",len:40});K.label("Ống nghiệm úp ngược",()=>S.ox.phase===0?[OX-.55+.09,1.0,0]:[-99,-99,-99],{view:"ox",dir:"e",len:40});K.label("Cốc đối chứng (để trong tối)",[OX+.65,1.62,0],{view:"ox",dir:"n",len:20});
    K.label("Que đóm",()=>S.ox.phase===2?V3.add(splint.pos,[.1,.4,0]):[-99,-99,-99],{view:"ox",dir:"ne",len:30});
    K.infoFn(()=>{if(K.view!=="ox"){const s=S.tb;const cur=s>0?STEPS[s-1]:null;return `<div><b>Chứng minh lá tạo tinh bột khi có ánh sáng</b></div><div>${s}/${STEPS.length} bước${cur&&cur.tl?` · thời gian thật: ${cur.tl}`:""}</div>${cur?`<small><b>${cur.t}.</b> ${cur.d}</small>`:"<small>Bấm “Bước tiếp theo”.</small>"}`}
      const O=S.ox;return `<div><b>Chứng minh quang hợp thải oxygen</b></div><div>${O.light?"Đèn đang chiếu sáng":"Đèn tắt"} · khí trong ống: ${fmt(O.gas*100,0)}%</div><small>${O.tested?"Que đóm bùng cháy: khí là oxygen.":"Khi khí chiếm khoảng 2/3 ống, lấy ống ra thử bằng que đóm còn tàn đỏ."}</small>`});
    K.timeLabel(()=>{if(K.view!=="ox"){const s=S.tb;return s?STEPS[s-1].t:"Chuẩn bị"}return S.ox.light?"Đang chiếu sáng":"Khí oxygen"});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"next",p:()=>{const s=S.tb;return s===1?V3.add(leaf.pos,[0,.12,0]):[[PX,.55,0],null,[PX-.75,1.7,.25],[BX,1.15,0],[BX,.85,0],[RX,.6,0],[DX,.08,.3]][s]||[-99,-99,-99]},tip:S.tb<STEPS.length?STEPS[S.tb].t:"",view:["tb","kq"]},{k:"light",p:[OX-.55,.55,.1],tip:"Chạm để chiếu sáng cành rong",view:"ox"},{k:"test",p:[OX-.46,1.05,0],tip:"Chạm để lấy ống nghiệm, thử bằng que đóm",view:"ox"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(let i=0;i<STEPS.length;i++){S.tb=i+1;S.tbT=1;finishStep()}paintLeaf(7,1);S.ox.gas=1;S.ox.light=true;K._dockH("test");S.ox.phase=2;S.ox.t=.99}};
    return K.mount(st)}
});
})();
