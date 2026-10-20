/* K9-L-08 · Cảm ứng điện từ; dòng điện xoay chiều (SGK KHTN 9 – Kết nối tri thức, Bài 14–15) · 3D
   1. Cảm ứng điện từ: đưa nam châm thẳng lại gần, ra xa cuộn dây kín nối với điện kế; kim điện kế lệch khi số đường sức từ qua tiết diện cuộn dây biến thiên.
      Từ thông qua cuộn dây mô hình theo từ trường trên trục của một lưỡng cực: Φ(x) ∝ 1/(1 + (x/a)²)^{3/2}; suất điện động e = −N·dΦ/dt.
   2. Máy phát điện xoay chiều mô hình: nam châm quay trước cuộn dây có lõi sắt; dòng điện cảm ứng đổi chiều liên tục, hai đèn LED mắc song song ngược chiều sáng luân phiên;
      màn dao động kí hiện đồ thị hình sin; tần số bằng số vòng quay mỗi giây. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const X1=-2,X2=2;
const COIL={x:X1+.35,a:.18,N:200,R:5,phi0:2e-4};   /* cuộn dây 200 vòng, điện trở mạch 5 Ω; Φ₀ minh họa 0,2 mWb */
const SPEEDS=[["cham","Chậm (1 vòng/s)",1],["nhanh","Nhanh (3 vòng/s)",3]];

const SPEC={
  predict:[{id:"p1",q:"Để yên nam châm nằm trong lòng cuộn dây nối với điện kế. Kim điện kế:",opts:[["khong","Không lệch"],["lech","Lệch về một phía và giữ nguyên"],["dao","Dao động liên tục"]],ans:"khong",res:"Kết quả: nam châm đứng yên, số đường sức từ qua cuộn dây không đổi, không có dòng điện cảm ứng."},
    {id:"p2",q:"Đưa nam châm lại gần cuộn dây nhanh hơn, kim điện kế lệch:",opts:[["nhieu","Nhiều hơn"],["it","Ít hơn"],["nhu","Như cũ"]],ans:"nhieu",res:"Kết quả: số đường sức từ biến thiên càng nhanh, dòng điện cảm ứng càng lớn."}],
  taskLead:"Chọn phần ở khay. Phần 1: dùng các nút để di chuyển nam châm; phần 2: quay nam châm và quan sát đèn LED, màn dao động kí.",
  tasks:[{html:"<b>Cảm ứng:</b> đưa nam châm vào cuộn dây và kéo ra, quan sát chiều lệch của kim.",done:()=>S.c.recIn&&S.c.recOut},
    {html:"<b>Cảm ứng:</b> đưa nam châm vào nhanh và chậm, so sánh độ lệch.",done:()=>S.c.fast&&S.c.slow},
    {html:"<b>Cảm ứng:</b> giữ nam châm đứng yên trong cuộn dây.",done:()=>S.c.still},
    {html:"<b>Xoay chiều:</b> quay nam châm ở hai tốc độ, đọc tần số trên màn dao động kí.",done:()=>S.g.rec.cham&&S.g.rec.nhanh}],
  obs:[{id:"a",q:"Dòng điện cảm ứng xuất hiện trong cuộn dây kín khi:",opts:[["bien","Số đường sức từ xuyên qua tiết diện cuộn dây biến thiên"],["co","Có nam châm ở gần, dù đứng yên"],["day","Cuộn dây làm bằng đồng"]],ans:"bien",why:"Đó là điều kiện xuất hiện dòng điện cảm ứng."},
    {id:"b",q:"Khi đưa nam châm vào rồi kéo ra, kim điện kế lệch:",opts:[["nguoc","Về hai phía ngược nhau"],["cung","Về cùng một phía"],["khong","Không lệch khi kéo ra"]],ans:"nguoc",why:"Số đường sức từ tăng rồi giảm nên dòng điện cảm ứng đổi chiều."},
    {id:"c",q:"Hai đèn LED mắc ngược chiều sáng luân phiên cho thấy:",opts:[["xc","Dòng điện đổi chiều liên tục (dòng điện xoay chiều)"],["mc","Dòng điện một chiều"],["hong","Một đèn bị hỏng"]],ans:"xc",why:"Mỗi LED chỉ sáng khi dòng điện qua nó theo đúng chiều."}],
  concl:{html:`<ul class="tlist"><li><b>Hiện tượng cảm ứng điện từ</b>: khi số đường sức từ xuyên qua tiết diện của cuộn dây dẫn kín biến thiên thì trong cuộn dây xuất hiện dòng điện cảm ứng.</li>
    <li>Số đường sức từ biến thiên càng nhanh, dòng điện cảm ứng càng lớn; khi số đường sức từ đang tăng chuyển sang giảm (hoặc ngược lại) thì dòng điện cảm ứng đổi chiều.</li>
    <li><b>Dòng điện xoay chiều</b> là dòng điện luân phiên đổi chiều. Máy phát điện xoay chiều tạo ra dòng điện xoay chiều nhờ cho nam châm (hoặc cuộn dây) quay. Điện lưới ở Việt Nam có tần số 50 Hz.</li></ul>`,
    quiz:[{id:"q1",q:"Trường hợp nào KHÔNG xuất hiện dòng điện cảm ứng?",opts:[["a","Nam châm và cuộn dây cùng đứng yên"],["b","Quay nam châm trước cuộn dây"],["c","Đưa cuộn dây lại gần nam châm"]],ans:"a",why:{b:"Số đường sức từ biến thiên.",c:"Số đường sức từ tăng."}},
      {id:"q2",q:"Dòng điện xoay chiều tần số 50 Hz đổi chiều bao nhiêu lần mỗi giây?",opts:[["a","100 lần"],["b","50 lần"],["c","25 lần"]],ans:"a",why:{b:"Mỗi chu kì dòng điện đổi chiều 2 lần.",c:"Mỗi chu kì đổi chiều 2 lần: 2 × 50 = 100."}}],
    done:`<h2>Hoàn thành: Cảm ứng điện từ, dòng điện xoay chiều</h2><p class="muted">Số đường sức từ qua cuộn dây biến thiên thì có dòng điện cảm ứng.</p>`},
  gv:["Cho học sinh nói chiều lệch của kim khi đưa cực N vào, kéo cực N ra, rồi đổi sang cực S.","Hỏi: vì sao máy phát điện ở nhà máy thủy điện phải quay liên tục?","Liên hệ: đinamo xe đạp, sạc không dây, bếp từ."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 14–15)</p><ul class="tlist"><li>Thực hiện thí nghiệm để rút ra điều kiện xuất hiện dòng điện cảm ứng; giải thích được nguyên tắc tạo ra dòng điện xoay chiều.</li><li>Nêu được dòng điện xoay chiều; một số tác dụng của dòng điện xoay chiều.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 14 Cảm ứng điện từ, Bài 15 Dòng điện xoay chiều.</li>
<li>Định luật Faraday, máy phát điện: <a href="https://openstax.org/books/college-physics-2e/pages/23-2-faradays-law-of-induction-lenzs-law" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 23.2</a>, <a href="https://openstax.org/books/college-physics-2e/pages/23-5-electric-generators" target="_blank" rel="noopener">mục 23.5</a>.</li>
<li>Tần số điện lưới Việt Nam 50 Hz.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Từ thông, số vòng dây, điện trở mạch là giá trị minh họa để kim điện kế lệch rõ; chiều lệch theo định luật Lenz.</li></ul>`;

let S;
LabKHTN.register("K9-L-08",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thao tác"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D cảm ứng điện từ và máy phát điện xoay chiều",legend:{w:260},bench:[7,2.2],seed:14,
      views:{cu:{t:[X1+.2,.14,-.02],yaw:0,pitch:.38,rad:.72,label:"Cảm ứng điện từ",icon:IC.bolt},xc:{t:[X2+.18,.18,.08],yaw:.25,pitch:.3,rad:.6,label:"Dòng điện xoay chiều",icon:IC.swap}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={c:{x:X1-.75,v:0,tgt:null,spd:0,flip:false,I:0,ang:0,om:0,peak:0,act:null,recIn:false,recOut:false,fast:false,slow:false,still:false,stillT:0},g:{on:false,sp:0,th:0,hist:[],rec:{}},recs:0};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const copper={color:"#C77A43",metal:.85,rough:.32};
    const texM=tex=>({type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}});
    function coil(x,z,len,r,turns,axisY){const pts=[];for(let i=0;i<=turns*24;i++){const t=i/(turns*24),a=t*turns*6.283;pts.push(axisY?[Math.cos(a)*r,t*len,Math.sin(a)*r]:[t*len-len/2,Math.cos(a)*r,Math.sin(a)*r])}const n=root.add(new G.Node());n.pos=[x,0,z];n.add(R.mesh(G.tube(pts,.006,5),copper));return n}
    function magnet(){const n=new G.Node();n.add(R.mesh(G.box(.16,.06,.06,.008,2),{color:"#D32F2F",rough:.4})).pos=[.08,0,0];n.add(R.mesh(G.box(.16,.06,.06,.008,2),{color:"#1E5BBF",rough:.4})).pos=[-.08,0,0];
      const lab=(t,x)=>{const c=document.createElement("canvas");c.width=64;c.height=64;const g=c.getContext("2d");g.fillStyle="#fff";g.font="900 46px system-ui";g.textAlign="center";g.fillText(t,32,48);const m=n.add(R.mesh(G.plane(.04,.04),{type:"unlit",color:"#FFFFFF",transparent:true,hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 t=texture(uTex,vUV);if(t.a<.3)discard;base.rgb=t.rgb;}"},textures:{uTex:R.tex2D(c)}}));m.pos=[x,.0305,0]};
      lab("N",.12);lab("S",-.12);return n}
    function galvo(x,z){const n=root.add(new G.Node());n.pos=[x,0,z];n.add(R.mesh(G.box(.32,.2,.08,.02,3),{color:"#2B2F38",rough:.5})).pos=[0,.1,0];
      const c=document.createElement("canvas");c.width=256;c.height=160;{const g=c.getContext("2d");g.fillStyle="#F6F3EA";g.fillRect(0,0,256,160);g.strokeStyle="#111";g.lineWidth=3;g.beginPath();g.arc(128,150,110,Math.PI*1.2,Math.PI*1.8);g.stroke();g.font="700 18px system-ui";g.fillStyle="#111";g.textAlign="center";
        for(let i=-5;i<=5;i++){const a=Math.PI*1.5+i*Math.PI*.06;g.beginPath();g.moveTo(128+Math.cos(a)*110,150+Math.sin(a)*110);g.lineTo(128+Math.cos(a)*(i%5?100:92),150+Math.sin(a)*(i%5?100:92));g.stroke();if(i%5===0)g.fillText(String(Math.abs(i)*0+i),128+Math.cos(a)*78,150+Math.sin(a)*78)}g.font="800 30px system-ui";g.fillStyle="#B91C1C";g.fillText("G",128,128)}
      const face=n.add(R.mesh(G.plane(.26,.16),texM(R.tex2D(c))));face.quat=G.Q.euler(Math.PI/2,0,0);face.pos=[0,.11,.041];
      const nd=n.add(new G.Node());nd.pos=[0,.035,.045];nd.add(R.mesh(G.box(.003,.13,.002,.001,1),{type:"unlit",color:"#D32F2F"})).pos=[0,.065,0];
      for(const [dx,cl] of [[-.1,"#D32F2F"],[.1,"#212121"]])n.add(R.mesh(G.cylinder(.012,.025,10),{color:cl})).pos=[dx,.2,.0];
      return{n,nd,a:[x-.1,.22,z],b:[x+.1,.22,z]}}
    const W=(pts,col)=>root.add(R.mesh(G.tube(G.spline(pts,6),.005,6),{color:col||"#D32F2F",rough:.45}));
    /* ================= 1. cảm ứng điện từ ================= */
    const CY=.12;const cl=coil(COIL.x,0,.36,.07,22);cl.pos=[COIL.x,CY,0];
    root.add(R.mesh(G.lathe([[.06,0],[.062,0],[.062,.4],[.06,.4]],32),{color:"#E9DCC2",rough:.6,alpha:.6,transparent:true})).quat=G.Q.euler(0,0,Math.PI/2),root.children[root.children.length-1].pos=[COIL.x+.2,CY,0];
    root.add(R.mesh(G.box(.42,.04,.18,.01,2),{color:"#7A5232",rough:.6})).pos=[COIL.x,.02,0];for(const dx of [-.15,.15])root.add(R.mesh(G.box(.03,.07,.12,.008,2),{color:"#7A5232",rough:.6})).pos=[COIL.x+dx,.06,0];
    const gv=galvo(COIL.x+.55,-.12);W([[COIL.x-.18,CY-.06,.02],[COIL.x-.2,.04,-.18],[COIL.x+.3,.06,-.2],gv.a]);W([[COIL.x+.18,CY-.06,.02],[COIL.x+.3,.04,.05],[COIL.x+.68,.08,-.05],gv.b],"#212121");
    const mg=root.add(magnet());
    const phi=x=>{const u=(x-COIL.x)/COIL.a;return COIL.phi0/Math.pow(1+u*u,1.5)};
    /* ================= 2. máy phát xoay chiều ================= */
    const gx=X2-.25;const core=root.add(R.mesh(G.box(.06,.06,.3,.01,2),{color:"#7D838B",metal:.8,rough:.3}));core.pos=[gx,.2,0];
    const cl2=root.add(new G.Node());{const pts=[];for(let i=0;i<=18*24;i++){const t=i/(18*24),a=t*18*6.283;pts.push([Math.cos(a)*.05,Math.sin(a)*.05,t*.22-.11])}cl2.add(R.mesh(G.tube(pts,.005,5),copper));cl2.pos=[gx,.2,0]}
    root.add(R.mesh(G.box(.2,.2,.04,.01,2),{color:"#4B5563",rough:.5})).pos=[gx,.1,-.18];
    const rot=root.add(new G.Node());rot.pos=[gx,.2,.26];const rm=rot.add(magnet());rm.quat=G.Q.euler(0,0,0);
    /* giá đỡ phía trước: trụ đứng + trục ngang nằm trên trục cuộn dây, nam châm quay quanh trục này */
    root.add(R.mesh(G.cylinder(.008,.2,8),{color:"#9CA3AF",metal:.7})).pos=[gx,0,.38];root.add(R.mesh(G.box(.1,.012,.08,.004,1),{color:"#4B5563",rough:.5})).pos=[gx,.006,.38];
    {const ax=root.add(R.mesh(G.cylinder(.006,.12,8),{color:"#9CA3AF",metal:.7}));ax.pos=[gx,.2,.26];ax.quat=G.Q.euler(Math.PI/2,0,0)}
    const crank=rot.add(R.mesh(G.box(.012,.012,.08,.004,1),{color:"#9CA3AF",metal:.7}));crank.pos=[0,0,.05];
    /* hai LED mắc song song ngược chiều */
    const ledG=(col,x)=>{const n=root.add(new G.Node());n.pos=[x,0,.05];n.add(R.mesh(G.box(.06,.02,.05,.008,2),{color:"#2E7D32"})).pos=[0,.01,0];
      const d=n.add(R.mesh(G.lathe([[.018,0],[.018,.03],[.012,.045],[0,.05]],20),{type:"glass",color:col,alpha:.7}));d.pos=[0,.06,0];
      const gl=n.add(R.mesh(G.sphere(.05,14,10),{type:"unlit",color:col,alpha:0,transparent:true,order:6,depth:false}));gl.pos=[0,.085,0];n.add(R.mesh(G.tube([[-.008,.02,0],[-.008,.06,0]],.0015,4),{color:"#C0C6CC"}));n.add(R.mesh(G.tube([[.008,.02,0],[.008,.06,0]],.0015,4),{color:"#C0C6CC"}));return gl};
    const ledR=ledG("#FF3B30",X2+.25),ledGr=ledG("#3DDC3D",X2+.38);
    W([[gx+.05,.2,-.1],[X2+.1,.1,-.05],[X2+.25,.03,.05]]);W([[gx+.05,.2,.1],[X2+.15,.08,.12],[X2+.38,.03,.05]],"#212121");W([[X2+.25,.03,.07],[X2+.31,.04,.1],[X2+.38,.03,.07]],"#F57C00");
    /* màn dao động kí */
    const osc=root.add(new G.Node());osc.pos=[X2+.6,0,-.2];osc.add(R.mesh(G.box(.42,.3,.2,.02,3),{color:"#37474F",rough:.5})).pos=[0,.15,0];
    const ocv=document.createElement("canvas");ocv.width=320;ocv.height=200;const oTex=R.tex2D(ocv);const oscFace=osc.add(R.mesh(G.plane(.32,.2),texM(oTex)));oscFace.quat=G.Q.euler(Math.PI/2,0,0);oscFace.pos=[-.03,.16,.101];
    W([[gx+.05,.2,-.1],[X2+.3,.15,-.25],[X2+.45,.12,-.12]],"#FDD835");
    /* ================= nhãn ================= */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    lab("Cuộn dây (200 vòng)",[COIL.x,CY+.08,0],"cu",{dir:"n",len:40});lab("Nam châm thẳng",()=>V3.add(mg.pos,[0,.04,0]),"cu",{dir:"nw",len:40});lab("Điện kế",[COIL.x+.55,.22,-.12],"cu",{dir:"ne",len:30});
    lab("Nam châm quay",[gx,.24,.26],"xc",{dir:"nw",len:30});lab("Cuộn dây có lõi sắt",[gx,.26,0],"xc",{dir:"n",len:40});lab("Hai đèn LED mắc ngược chiều",[X2+.31,.1,.05],"xc",{dir:"ne",len:40});lab("Màn dao động kí",[X2+.6,.3,-.2],"xc",{dir:"n",len:20});
    /* ================= mô phỏng ================= */
    let lastPhi=null;
    K.onFrame((dt)=>{const Cc=S.c;
      if(Cc.tgt!=null&&dt>0){const d=Cc.tgt-Cc.x;const step=Math.sign(d)*Math.min(Math.abs(d),Cc.spd*dt);Cc.v=dt>0?step/dt:0;Cc.x+=step;if(Math.abs(Cc.tgt-Cc.x)<1e-6){Cc.tgt=null;Cc.v=0;const a=Cc.act;Cc.act=null;
          if(a){const pk=Cc.peak;Cc.peak=0;if(a.k==="in"){Cc.recIn=true;if(a.sp>1)Cc.fast=true;else Cc.slow=true;rec(`Đưa ${Cc.flip?"cực S":"cực N"} của nam châm ${a.sp>1?"nhanh":"chậm"} vào trong cuộn dây`,`kim điện kế lệch về bên ${pk>0?"phải":"trái"} (cực đại ${fmt(Math.abs(pk)*1000,1)} mA) rồi trở về 0`)}
            else{Cc.recOut=true;if(a.sp>1)Cc.fast=true;else Cc.slow=true;rec(`Kéo nam châm ${a.sp>1?"nhanh":"chậm"} ra khỏi cuộn dây`,`kim lệch về bên ${pk>0?"phải":"trái"} (cực đại ${fmt(Math.abs(pk)*1000,1)} mA): ngược chiều với khi đưa vào`)}refresh()}}}
      else Cc.v=0;
      mg.pos=[Cc.x,CY,0];mg.quat=G.Q.euler(0,Cc.flip?Math.PI:0,0);
      const ph=phi(Cc.x)*(Cc.flip?-1:1);if(lastPhi==null)lastPhi=ph;const e=dt>0?-COIL.N*(ph-lastPhi)/dt:0;lastPhi=ph;Cc.I=e/COIL.R;if(Math.abs(Cc.I)>Math.abs(Cc.peak))Cc.peak=Cc.I;
      /* kim điện kế: dao động tắt dần theo dòng điện */
      const tgtA=C.clamp(Cc.I*12,-.9,.9);if(dt>0){Cc.om+=((tgtA-Cc.ang)*90-Cc.om*14)*dt;Cc.ang+=Cc.om*dt}gv.nd.quat=G.Q.euler(0,0,-Cc.ang);
      if(Cc.tgt==null&&Math.abs(Cc.x-COIL.x)<.05){Cc.stillT+=dt;if(Cc.stillT>2&&!Cc.still){Cc.still=true;rec("Giữ nam châm đứng yên trong lòng cuộn dây","kim điện kế chỉ số 0: không có dòng điện cảm ứng");refresh()}}else Cc.stillT=0;
      /* máy phát */
      const g=S.g;const w=g.on?SPEEDS[g.sp][2]*6.283:0;g.th+=w*dt;rot.quat=G.Q.euler(0,0,g.th);
      const eg=g.on?COIL.N*COIL.phi0*8*w*Math.sin(g.th):0;   /* e = NΦω·sin(ωt) */
      ledR.mat.alpha=eg>.05?C.clamp(eg/1.2,0,1)*.7:0;ledGr.mat.alpha=eg<-.05?C.clamp(-eg/1.2,0,1)*.7:0;
      if(g.on&&dt>0){g.t=(g.t||0)+dt;g.hist.push([g.t,eg]);while(g.hist.length&&g.t-g.hist[0][0]>2)g.hist.shift();
        const sk=SPEEDS[g.sp][0];if(!g.rec[sk]&&g.t>2.2){g.rec[sk]=1;const f=SPEEDS[g.sp][2];rec(`Quay nam châm ${SPEEDS[g.sp][1].toLowerCase()}`,`hai LED sáng luân phiên; đồ thị hình sin, ${f} chu kì mỗi giây: f = ${f} Hz; suất điện động cực đại ≈ ${fmt(COIL.N*COIL.phi0*8*w,2)} V`);refresh()}}
      if(K.view==="xc"&&K.frameN%2===0){const o=ocv.getContext("2d");o.fillStyle="#06210F";o.fillRect(0,0,320,200);o.strokeStyle="rgba(80,255,140,.18)";o.lineWidth=1;for(let i=1;i<10;i++){o.beginPath();o.moveTo(i*32,0);o.lineTo(i*32,200);o.stroke()}for(let j=1;j<8;j++){o.beginPath();o.moveTo(0,j*25);o.lineTo(320,j*25);o.stroke()}
        o.strokeStyle="#4CFF8A";o.lineWidth=2.5;o.beginPath();const t1=g.t||0;g.hist.forEach((h,i)=>{const x=320-(t1-h[0])/2*320,y=100-h[1]/7*90;i?o.lineTo(x,y):o.moveTo(x,y)});o.stroke();o.fillStyle="#4CFF8A";o.font="700 14px monospace";o.fillText("2 s / màn",8,18);oTex.update(ocv)}});
    /* ================= khay ================= */
    const IN=COIL.x,OUT=X1-.75;
    K.dockFn(()=>{const Cc=S.c,busy=Cc.tgt!=null;if(K.view==="cu")return[{k:"in",v:"1",label:"Đưa vào chậm",icon:IC.step,dis:busy||Cc.x>IN-.01},{k:"in",v:"3",label:"Đưa vào nhanh",icon:IC.step,dis:busy||Cc.x>IN-.01},
        {k:"out",v:"1",label:"Kéo ra chậm",icon:IC.reset,dis:busy||Cc.x<OUT+.01},{k:"out",v:"3",label:"Kéo ra nhanh",icon:IC.reset,dis:busy||Cc.x<OUT+.01},{k:"flip",label:"Đổi đầu nam châm",icon:IC.swap,dis:busy||Cc.x>OUT+.01}];
      const g=S.g;return[{seg:SPEEDS.map((s,i)=>({k:"sp",v:String(i),label:s[1],icon:"",on:g.sp===i})),label:"Tốc độ quay"},{k:"rot",label:g.on?"Dừng quay":"Quay nam châm",icon:g.on?IC.ban:IC.play,on:g.on}]});
    K.onDock((k,v)=>{const Cc=S.c;if(k==="in"){Cc.tgt=IN;Cc.spd=+v*.25;Cc.act={k:"in",sp:+v};Cc.peak=0}else if(k==="out"){Cc.tgt=OUT;Cc.spd=+v*.25;Cc.act={k:"out",sp:+v};Cc.peak=0}else if(k==="flip")Cc.flip=!Cc.flip;
      else if(k==="sp"){S.g.sp=+v;S.g.t=0;S.g.hist=[]}else if(k==="rot"){S.g.on=!S.g.on;S.g.t=0;S.g.hist=[]}
      if((k==="in"||k==="out"||k==="rot")&&!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600);refresh()});
    K.infoFn(()=>{if(K.view==="cu"){const Cc=S.c;return `<div><b>Cảm ứng điện từ</b></div><div>Nam châm: ${Math.abs(Cc.x-IN)<.02?"trong lòng cuộn dây":Math.abs(Cc.x-OUT)<.02?"ở xa cuộn dây":"đang di chuyển"}${Cc.flip?" (cực S hướng vào)":" (cực N hướng vào)"}</div><div>Dòng điện cảm ứng: ${fmt(Cc.I*1000,1)} mA</div><small>Kim chỉ lệch khi số đường sức từ qua cuộn dây thay đổi.</small>`}
      const g=S.g;return `<div><b>Máy phát điện xoay chiều</b> (mô hình)</div><div>${g.on?`Quay ${SPEEDS[g.sp][1].toLowerCase()} → f = ${SPEEDS[g.sp][2]} Hz`:"Nam châm đứng yên"}</div><div><i style="background:#FF3B30"></i>LED đỏ sáng khi dòng điện theo chiều thuận</div><div><i style="background:#3DDC3D"></i>LED lục sáng khi dòng điện đổi chiều</div>`});
    K.timeLabel(()=>K.view==="cu"?`I = ${fmt(S.c.I*1000,1)} mA`:(S.g.on?`f = ${SPEEDS[S.g.sp][2]} Hz`:"Đứng yên"));
    /* thao tác tay: vuốt nam châm về phía cuộn dây (đưa vào) hoặc ra xa (kéo ra); vuốt nhanh = chuyển động nhanh */
    K.pickFn((x,y)=>{if(K.view!=="cu"||S.c.tgt!=null)return null;return G.hit.sphere(R.ray(x,y),mg.pos,.12)!=null?{drag:true,k:"mag",t0:performance.now()}:null});
    K.dragFn((ph,o,p)=>{if(ph==="start"){o.x0=p.x;return}if(ph!=="end")return;const dx=p.x-o.x0,dt=Math.max(.05,(performance.now()-o.t0)/1000);if(Math.abs(dx)<12)return;
      const v=Math.abs(dx)/dt>500?"3":"1";const Cc=S.c;if(dx>0&&Cc.x<IN-.01)K._dockH("in",v);else if(dx<0&&Cc.x>OUT+.01)K._dockH("out",v)});
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const Cc=S.c;const seq=[["in",3],["out",3],["in",1],["out",1]];let i=0;const go=()=>{if(K.dead)return;if(Cc.tgt!=null)return setTimeout(go,250);if(i===3&&!Cc.still)return setTimeout(go,300);if(i>=seq.length)return;const [k,sp]=seq[i++];Cc.tgt=k==="in"?IN:OUT;Cc.spd=sp*.25;Cc.act={k,sp};Cc.peak=0;setTimeout(go,300)};go();
        S.g.on=true;setTimeout(()=>{S.g.sp=1;S.g.t=0;S.g.hist=[]},9000)}};
    return K.mount(st)}
});
})();
