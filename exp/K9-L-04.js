/* K9-L-04 · Lăng kính; tán sắc ánh sáng; màu sắc của vật (SGK KHTN 9 – Kết nối tri thức, Bài 7) · 3D
   1. Tán sắc: chùm sáng trắng hẹp qua lăng kính thủy tinh (góc chiết quang 60°) tách thành dải màu từ đỏ tới tím trên màn.
      Đường đi từng tia tính bằng định luật khúc xạ tại hai mặt bên, chiết suất phụ thuộc bước sóng theo công thức Cauchy.
   2. Ánh sáng đơn sắc: chùm laser đỏ (hoặc lục) qua lăng kính chỉ bị lệch, không bị tách màu.
   3. Màu sắc của vật: vật trắng, đỏ, lục, lam đặt dưới ánh sáng trắng, đỏ, lục, lam; màu ta thấy là ánh sáng vật tán xạ được. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex,D=Math.PI/180;
const nOf=l=>1.5046+4200/(l*l);    /* thủy tinh BK7: A = 1,5046, B = 0,00420 µm² (λ tính bằng nm) */
const BANDS=[["Đỏ",680,"#FF2A1A"],["Cam",610,"#FF8A00"],["Vàng",580,"#FFE600"],["Lục",530,"#3DDC3D"],["Lam",470,"#2E9BFF"],["Chàm",440,"#4B3BFF"],["Tím",410,"#9A3BFF"]];
const SRC_={trang:{ten:"Ánh sáng trắng",l:null},do:{ten:"Laser đỏ",l:650,c:"#FF2A1A"},luc:{ten:"Laser lục",l:532,c:"#3DDC3D"}};
const LIGHT={trang:[1,1,1],do:[1,.08,.06],luc:[.08,1,.1],lam:[.1,.25,1]};
const OBJ=[["trang","Tờ giấy trắng",[.92,.92,.92]],["do","Quả cà chua đỏ",[.85,.08,.06]],["luc","Lá cây xanh lục",[.12,.62,.14]],["lam","Tấm bìa xanh lam",[.08,.22,.8]]];
const XP=0,XM=6;
const EXAG=4;   /* phóng đại độ chênh góc lệch giữa các màu để dải màu đủ rộng trên màn */

const SPEC={
  predict:[{id:"p1",q:"Chiếu chùm sáng trắng hẹp qua lăng kính, trên màn ta thấy:",opts:[["dai","Một dải màu từ đỏ tới tím"],["trang","Một vệt sáng trắng"],["do","Chỉ một vệt màu đỏ"]],ans:"dai",res:"Kết quả: ánh sáng trắng bị tách thành dải màu đỏ, cam, vàng, lục, lam, chàm, tím."},
    {id:"p2",q:"Chiếu ánh sáng đỏ vào quả cà chua đỏ và chiếc lá xanh lục, ta thấy:",opts:[["dd","Cà chua màu đỏ, lá gần như màu đen"],["dl","Cà chua đỏ, lá vẫn xanh"],["den","Cả hai màu đen"]],ans:"dd",res:"Kết quả: lá xanh lục hầu như không tán xạ ánh sáng đỏ nên trông gần như đen."}],
  taskLead:"Chọn phần ở khay. Bật nguồn sáng, đổi loại ánh sáng để so sánh.",
  tasks:[{html:"<b>Tán sắc:</b> chiếu ánh sáng trắng qua lăng kính, quan sát dải màu trên màn.",done:()=>S.seen.trang},
    {html:"<b>Đơn sắc:</b> chiếu laser đỏ và laser lục qua lăng kính.",done:()=>S.seen.do&&S.seen.luc},
    {html:"<b>Màu vật:</b> chiếu lần lượt ít nhất 3 loại ánh sáng lên các vật.",done:()=>Object.keys(S.lit).length>=3}],
  obs:[{id:"a",q:"Trong dải màu, tia nào bị lăng kính làm lệch nhiều nhất?",opts:[["tim","Tia tím"],["do","Tia đỏ"],["nhu","Các tia lệch như nhau"]],ans:"tim",why:"Chiết suất của thủy tinh với ánh sáng tím lớn nhất, với ánh sáng đỏ nhỏ nhất."},
    {id:"b",q:"Laser đỏ qua lăng kính không bị tách màu vì:",opts:[["don","Ánh sáng laser đỏ là ánh sáng đơn sắc"],["yeu","Laser quá yếu"],["lk","Lăng kính chỉ tách được ánh sáng trắng của Mặt Trời"]],ans:"don",why:"Ánh sáng đơn sắc có một màu xác định, qua lăng kính chỉ bị lệch hướng."},
    {id:"c",q:"Vật màu trắng dưới ánh sáng lam trông có màu:",opts:[["lam","Lam"],["trang","Trắng"],["den","Đen"]],ans:"lam",why:"Vật màu trắng tán xạ tốt mọi ánh sáng màu chiếu tới nó."}],
  concl:{html:`<ul class="tlist"><li><b>Lăng kính</b> là khối chất trong suốt hình lăng trụ đứng có tiết diện thẳng là tam giác. Tia sáng qua lăng kính bị lệch về phía đáy.</li>
    <li><b>Tán sắc ánh sáng</b>: ánh sáng trắng là hỗn hợp nhiều ánh sáng màu; qua lăng kính bị tách thành dải màu đỏ, cam, vàng, lục, lam, chàm, tím vì chiết suất của lăng kính khác nhau với mỗi ánh sáng màu.</li>
    <li>Ánh sáng đơn sắc qua lăng kính không bị tách màu.</li>
    <li><b>Màu sắc của vật</b>: ta nhìn thấy vật màu nào là do vật tán xạ mạnh ánh sáng màu đó vào mắt. Vật màu trắng tán xạ tốt mọi màu; vật màu đen hầu như không tán xạ ánh sáng.</li></ul>`,
    quiz:[{id:"q1",q:"Cầu vồng là hiện tượng:",opts:[["a","Tán sắc ánh sáng Mặt Trời qua các giọt nước"],["b","Phản xạ ánh sáng trên mây"],["c","Ánh sáng tự phát ra từ không khí"]],ans:"a",why:{b:"Giọt nước làm khúc xạ và tán sắc ánh sáng.",c:"Không khí không tự phát sáng."}},
      {id:"q2",q:"Chiếc áo màu đỏ đặt dưới ánh sáng lục trông có màu gần như:",opts:[["a","Đen"],["b","Đỏ"],["c","Lục"]],ans:"a",why:{b:"Không có ánh sáng đỏ chiếu tới.",c:"Áo đỏ tán xạ kém ánh sáng lục."}}],
    done:`<h2>Hoàn thành: Lăng kính, tán sắc, màu sắc vật</h2><p class="muted">Ánh sáng trắng là hỗn hợp nhiều màu; vật có màu nào là do tán xạ mạnh ánh sáng màu đó.</p>`},
  gv:["Cho học sinh kể thứ tự các màu trong dải tán sắc; so sánh với cầu vồng.","Hỏi: vì sao trong phòng tối dưới đèn đỏ, chữ viết bằng mực đỏ trên giấy trắng khó đọc?","Lưu ý an toàn: không chiếu laser vào mắt."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 7)</p><ul class="tlist"><li>Thực hiện thí nghiệm với lăng kính tam giác để rút ra đường đi của tia sáng qua lăng kính; nêu được tán sắc ánh sáng; giải thích được sơ lược màu sắc của vật.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 7 Lăng kính.</li>
<li>Tán sắc, chiết suất phụ thuộc bước sóng: <a href="https://openstax.org/books/college-physics-2e/pages/25-5-dispersion-the-rainbow-and-prisms" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 25.5</a>. Hệ số Cauchy gần đúng của thủy tinh quang học BK7 (A ≈ 1,5046; B ≈ 0,0042 µm²).</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Độ chênh góc lệch giữa các màu được phóng đại 4 lần để dải màu rộng đủ quan sát; thứ tự màu và hướng lệch đúng như tính toán.</li>
<li>Hệ số tán xạ màu của các vật ở phần 3 là giá trị minh họa.</li></ul>`;

let S;
LabKHTN.register("K9-L-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D lăng kính, tán sắc ánh sáng và màu sắc vật",legend:{w:250},bench:[11,2.4],seed:7,
      views:{lk:{t:[XP+.05,.45,0],yaw:0,pitch:.3,rad:1.25,label:"Lăng kính",icon:IC.sun},mau:{t:[XM,.3,0],yaw:0,pitch:.3,rad:1.0,label:"Màu sắc vật",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={src:"trang",on:true,seen:{},light:"trang",lit:{},recs:0};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    /* lăng kính: tiết diện tam giác đều cạnh 0,5; trục dọc theo z */
    const PY=.3,SID=.5,HGT=SID*Math.sqrt(3)/2;const A=[XP,PY+HGT],B=[XP-SID/2,PY],Cc=[XP+SID/2,PY];
    const half=(p,a,b)=>{const nx=b[1]-a[1],ny=-(b[0]-a[0]);const L=Math.hypot(nx,ny);return((p[0]-a[0])*nx+(p[1]-a[1])*ny)/L};
    const prismF=(x,y,z)=>Math.max(half([x,y],A,B),half([x,y],B,Cc),half([x,y],Cc,A),Math.abs(z)-.18);
    const pg=G.fromSDF(prismF,[XP-.3,PY-.02,-.2],[XP+.3,PY+HGT+.02,.2],[48,46,30]);
    root.add(R.mesh(pg,{type:"glass",color:"#EAF6FF",alpha:.38}));
    root.add(R.mesh(G.box(.56,.3,.36,.02,2),{color:"#3F4652",rough:.5})).pos=[XP,.15,0];
    /* đèn chiếu có khe hẹp */
    const ANG0=20*D,MID=[XP-SID/4,PY+HGT/2],P0=[MID[0]-1.0*Math.cos(ANG0),MID[1]-1.0*Math.sin(ANG0)],DIR0=[Math.cos(ANG0),Math.sin(ANG0),0];
    const lamp=root.add(new G.Node());lamp.pos=[P0[0]-.2*Math.cos(ANG0),P0[1]-.2*Math.sin(ANG0),0];lamp.quat=G.Q.euler(0,0,ANG0);lamp.add(R.mesh(G.box(.34,.18,.2,.03,3),{color:"#2B2F38",rough:.5}));const lens=lamp.add(R.mesh(G.cylinder(.05,.03,20),{color:"#D9E7F5",metal:.5}));lens.quat=G.Q.euler(0,0,-Math.PI/2);lens.pos=[.17,0,0];
    root.add(R.mesh(G.cylinder(.012,lamp.pos[1],10),{color:"#6B7280",metal:.6})).pos=[lamp.pos[0],0,0];
    /* màn hứng */
    const SCX=XP+1.1;const scr=root.add(new G.Node());scr.pos=[SCX,0,0];scr.add(R.mesh(G.box(.02,.9,.6,.006,2),{color:"#F2F2EE",rough:.85})).pos=[0,.48,0];scr.add(R.mesh(G.box(.2,.03,.3,.01,2),{color:"#3F4652"})).pos=[0,.015,0];
    const rays=root.add(new G.Node());const spots=root.add(new G.Node());
    /* dò tia trong mặt phẳng z = 0 */
    function inter(p,d,a,b){const ex=b[0]-a[0],ey=b[1]-a[1];const den=d[0]*ey-d[1]*ex;if(Math.abs(den)<1e-9)return null;const t=((a[0]-p[0])*ey-(a[1]-p[1])*ex)/den,u=((a[0]-p[0])*d[1]-(a[1]-p[1])*d[0])/den;return t>1e-6&&u>=0&&u<=1?{t,pt:[p[0]+d[0]*t,p[1]+d[1]*t]}:null}
    function refr(d,a,b,n1,n2,outward){/* pháp tuyến hướng ra ngoài lăng kính */let nx=b[1]-a[1],ny=-(b[0]-a[0]);const L=Math.hypot(nx,ny);nx/=L;ny/=L;const ctr=[XP,PY+HGT/3];const mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];if((mid[0]-ctr[0])*nx+(mid[1]-ctr[1])*ny<0){nx=-nx;ny=-ny}
      if(outward){nx=-nx;ny=-ny}/* n hướng về phía môi trường chứa tia tới */const ci=-(d[0]*nx+d[1]*ny);const k=n1/n2;const s2=k*k*(1-ci*ci);if(s2>1)return null;const ct=Math.sqrt(1-s2);return[k*d[0]+(k*ci-ct)*nx,k*d[1]+(k*ci-ct)*ny]}
    function trace(l,exag){let n=nOf(l);if(exag){const n0=nOf(560);n=n0+(n-n0)*EXAG}const pts=[[P0[0],P0[1]]];let d=[DIR0[0],DIR0[1]];
      const h1=inter(P0,d,B,A);if(!h1)return null;pts.push(h1.pt);const d1=refr(d,B,A,1,n,false);if(!d1)return null;
      const h2=inter(h1.pt,d1,A,Cc);if(!h2)return null;pts.push(h2.pt);const d2=refr(d1,A,Cc,n,1,true);if(!d2)return null;
      const t=(SCX-.012-h2.pt[0])/d2[0];pts.push([h2.pt[0]+d2[0]*t,h2.pt[1]+d2[1]*t]);return{pts,dev:-Math.abs(Math.atan2(d2[1],d2[0])-Math.atan2(DIR0[1],DIR0[0]))}}
    let key=null;
    function build(){const k=S.src+S.on;if(k===key)return;key=k;rays.children.slice().forEach(n=>rays.remove(n));spots.children.slice().forEach(n=>spots.remove(n));if(!S.on)return;
      const add=(pts,col,r,a)=>{rays.add(R.mesh(G.tube(pts.map(p=>[p[0],p[1],0]),r,6),{type:"unlit",color:col,alpha:a,transparent:true,order:6,depth:false}))};
      if(S.src==="trang"){const t0=trace(560,true);add(t0.pts.slice(0,2),"#FFFFFF",.008,.95);
        for(let i=0;i<28;i++){const l=400+i*(300/27);const tr=trace(l,true);const col=specCol(l);add(tr.pts.slice(1,3),col,.0045,.5);add(tr.pts.slice(2),col,.006,.75);
          const sp=spots.add(R.mesh(G.box(.006,.022,.3,.002,1),{type:"unlit",color:col}));sp.pos=[SCX-.012,tr.pts[3][1],0]}}
      else{const s=SRC_[S.src];const tr=trace(s.l,true);add(tr.pts,s.c,.008,.95);const sp=spots.add(R.mesh(G.sphere(.03,14,10),{type:"unlit",color:s.c,alpha:.9,transparent:true}));sp.pos=[SCX-.014,tr.pts[3][1],0];sp.scl=[.3,1,1]}}
    function specCol(l){const t=C.clamp((l-400)/300,0,1);const stops=[[0,"#8A2BE2"],[.12,"#4B3BFF"],[.25,"#2E9BFF"],[.42,"#3DDC3D"],[.58,"#FFE600"],[.7,"#FF8A00"],[1,"#FF1A1A"]];for(let i=1;i<stops.length;i++)if(t<=stops[i][0]){const k=(t-stops[i-1][0])/(stops[i][0]-stops[i-1][0]);return C.mix(stops[i-1][1],stops[i][1],k)}return"#FF1A1A"}
    const lBand=BANDS.filter(b=>b[0]==="Đỏ"||b[0]==="Tím").map(b=>K.label(b[0]==="Đỏ"?"Đỏ (lệch ít nhất)":"Tím (lệch nhiều nhất)",()=>{const tr=trace(b[1],true);return[SCX,tr.pts[3][1],.31]},{view:"lk",dir:"e",len:40}));
    K.label("Lăng kính",[XP,PY+HGT*.55,.18],{view:"lk",dir:"n",len:70});K.label("Đèn chiếu có khe hẹp",()=>V3.add(lamp.pos,[0,.09,0]),{view:"lk",dir:"n",len:30});K.label("Màn hứng",[SCX,.92,0],{view:"lk",dir:"n",len:20});
    /* ================= màu sắc vật ================= */
    const objs=OBJ.map((o,i)=>{const x=XM-.75+i*.5;let m;if(o[0]==="do")m=root.add(R.mesh(G.sphere(.12,32,24),{color:"#FFFFFF",rough:.35,coat:.5}));
      else if(o[0]==="luc")m=root.add(R.mesh(G.fromSDF((x2,y,z)=>Math.max(Math.hypot(x2/1.0,y/1.8,z/.12)-.1,-1e3),[-.12,-.2,-.02],[.12,.2,.02],[20,30,6]),{color:"#FFFFFF",rough:.5,side:"double"}));
      else m=root.add(R.mesh(G.box(.26,.34,.012,.004,2),{color:"#FFFFFF",rough:.85}));m.pos=[x,o[0]==="do"?.12:.2,0];if(o[0]==="luc")m.quat=G.Q.euler(0,0,.3);return{m,o}});
    const cone=root.add(R.mesh(G.lathe([[0,0],[1,-1.4]],32,{}),{type:"unlit",color:"#FFFFFF",alpha:.08,transparent:true,order:5,depth:false,side:"double"}));cone.pos=[XM,1.5,.1];
    K.label("Đèn chiếu màu",[XM,1.5,.1],{view:"mau",dir:"n",len:20});OBJ.forEach((o,i)=>K.label(o[1],[XM-.75+i*.5,o[0]==="do"?.02:.0,.1],{view:"mau",dir:i%2?"s":"s",len:i%2?50:24}));
    K.onFrame(()=>{build();const Lc=LIGHT[S.light];for(const {m,o} of objs){const c=o[2].map((v,i)=>Math.min(1,v*Lc[i]*1.05));m.mat.color=c}cone.mat.color=[Lc[0],Lc[1],Lc[2]];
      const tr=K.view==="lk";rays.visible=spots.visible=tr;lBand.forEach(l=>l.on=tr&&S.on&&S.src==="trang")});
    const recSrc=()=>{if(!S.on||S.seen[S.src])return;S.seen[S.src]=1;
      if(S.src==="trang"){const r=trace(680,false),v=trace(410,false);rec("Chiếu ánh sáng trắng qua lăng kính",`trên màn có dải màu đỏ, cam, vàng, lục, lam, chàm, tím; tia đỏ lệch ít nhất (${fmt(r.dev/D*-1,1)}°), tia tím lệch nhiều nhất (${fmt(v.dev/D*-1,1)}°)`)}
      else{const s=SRC_[S.src],t=trace(s.l,false);rec(`Chiếu ${s.ten.toLowerCase()} qua lăng kính`,`chùm sáng bị lệch về phía đáy lăng kính một góc ${fmt(-t.dev/D,1)}°, không bị tách màu`)}refresh()};
    const recLit=()=>{if(S.lit[S.light])return;S.lit[S.light]=1;const Lc=LIGHT[S.light];const nm={trang:"trắng",do:"đỏ",luc:"lục",lam:"lam"};
      const look=o=>{const c=o[2].map((v,i)=>v*Lc[i]);const s=c[0]+c[1]+c[2];if(s<.25)return"gần như đen";const mx=Math.max(...c);if(c.every(v=>v>.6))return"trắng";return c[0]===mx?"đỏ":c[1]===mx?"lục":"lam"};
      rec(`Chiếu ánh sáng ${nm[S.light]} lên các vật`,OBJ.map(o=>`${o[1].toLowerCase()}: ${look(o)}`).join("; "));refresh()};
    K.dockFn(()=>K.view==="lk"?[{seg:Object.keys(SRC_).map(k=>({k:"src",v:k,label:SRC_[k].ten,icon:"",on:S.src===k})),label:"Nguồn sáng"},{k:"on",label:S.on?"Tắt đèn":"Bật đèn",icon:IC.sun,on:S.on}]
      :[{seg:Object.keys(LIGHT).map(k=>({k:"light",v:k,label:{trang:"Ánh sáng trắng",do:"Ánh sáng đỏ",luc:"Ánh sáng lục",lam:"Ánh sáng lam"}[k],icon:"",on:S.light===k})),label:"Ánh sáng chiếu"}]);
    K.onDock((k,v)=>{if(k==="src"){S.src=v;recSrc()}else if(k==="on"){S.on=!S.on;recSrc()}else if(k==="light"){S.light=v;recLit()}refresh()});
    K.infoFn(()=>{if(K.view==="lk"){if(!S.on)return `<div><b>Lăng kính</b> (góc chiết quang 60°)</div><small>Bật đèn để chiếu sáng.</small>`;
        if(S.src==="trang")return `<div><b>Ánh sáng trắng</b> qua lăng kính</div>${BANDS.map(b=>`<div><i style="background:${b[2]}"></i>${b[0]} (≈${b[1]} nm): n = ${fmt(nOf(b[1]),4)}</div>`).join("")}<small>Hình phóng đại độ chênh góc lệch ×${EXAG}.</small>`;
        const s=SRC_[S.src],t=trace(s.l,false);return `<div><b>${s.ten}</b> (${s.l} nm)</div><div>n = ${fmt(nOf(s.l),4)} · góc lệch ${fmt(-t.dev/D,1)}°</div><small>Ánh sáng đơn sắc: không bị tách màu.</small>`}
      const nm={trang:"trắng",do:"đỏ",luc:"lục",lam:"lam"};return `<div><b>Màu sắc của vật</b> dưới ánh sáng ${nm[S.light]}</div><small>Vật có màu nào thì tán xạ mạnh ánh sáng màu đó.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.onLayout(()=>{});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"on",p:()=>V3.add(lamp.pos,[0,.09,0]),tip:S.on?"Chạm để tắt đèn":"Chạm để bật đèn chiếu",view:"lk"},{k:"light",v:(()=>{const ks=Object.keys(LIGHT);return ks[(ks.indexOf(S.light)+1)%ks.length]})(),p:[XM,1.5,.1],tip:"Chạm vào đèn để đổi màu ánh sáng chiếu",view:"mau"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();recSrc();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){["do","luc","trang"].forEach(s=>{S.src=s;recSrc()});["do","luc","lam"].forEach(l=>{S.light=l;recLit()});refresh()}};
    return K.mount(st)}
});
})();
