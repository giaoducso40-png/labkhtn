/* K6-T-02 · Hệ Mặt Trời và Ngân Hà (SGK KHTN 6 – Kết nối tri thức, Bài 45) · 3D
   1. Hệ Mặt Trời: Mặt Trời và 8 hành tinh quay quanh theo cùng một chiều. Số liệu (khoảng cách trung bình tới Mặt Trời, đường kính, chu kì quay quanh
      Mặt Trời) theo NASA. Khoảng cách được nén theo căn bậc hai, kích thước hành tinh phóng to để quan sát được; chu kì giữ đúng tỉ lệ.
   2. So sánh kích thước: 8 hành tinh vẽ cùng một tỉ lệ đường kính, cạnh một phần Mặt Trời.
   3. Ngân Hà: thiên hà dạng đĩa xoắn, đường kính khoảng 100 000 năm ánh sáng; Hệ Mặt Trời nằm ở một nhánh xoắn, cách tâm khoảng 26 000 năm ánh sáng. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q,LE=window.LabEarth;
const fmt=C.fmt;
const PL=[{k:"thuy",t:"Sao Thủy",au:.39,d:4879,T:.241,c:"#9CA3AF",loai:"đá"},{k:"kim",t:"Sao Kim",au:.72,d:12104,T:.615,c:"#E8C77E",loai:"đá"},{k:"dat",t:"Trái Đất",au:1,d:12756,T:1,c:"#3B82F6",loai:"đá"},{k:"hoa",t:"Sao Hỏa",au:1.52,d:6792,T:1.88,c:"#C2410C",loai:"đá"},
  {k:"moc",t:"Sao Mộc",au:5.2,d:142984,T:11.86,c:"#D6A56B",loai:"khí khổng lồ"},{k:"tho",t:"Sao Thổ",au:9.58,d:120536,T:29.46,c:"#E9D29B",loai:"khí khổng lồ"},{k:"thien",t:"Sao Thiên Vương",au:19.2,d:51118,T:84.0,c:"#93E0E6",loai:"băng khổng lồ"},{k:"hai",t:"Sao Hải Vương",au:30.1,d:49528,T:164.8,c:"#4F6FD8",loai:"băng khổng lồ"}];
const SUN_D=1392700;
const SPEC={
  predict:[{id:"p1",q:"Hành tinh nào ở gần Mặt Trời nhất?",opts:[["thuy","Sao Thủy"],["kim","Sao Kim"],["dat","Trái Đất"]],ans:"thuy",res:"Kết quả: thứ tự từ trong ra: Thủy, Kim, Trái Đất, Hỏa, Mộc, Thổ, Thiên Vương, Hải Vương."},
    {id:"p2",q:"Hành tinh càng xa Mặt Trời thì thời gian quay hết một vòng quanh Mặt Trời:",opts:[["dai","Càng dài"],["ngan","Càng ngắn"],["nhu","Như nhau"]],ans:"dai",res:"Kết quả: Sao Thủy khoảng 88 ngày, Sao Hải Vương khoảng 165 năm."}],
  taskLead:"Chạm vào hành tinh hoặc chọn ở khay để xem số liệu. Bật quay để thấy các hành tinh chuyển động theo đúng tỉ lệ chu kì.",
  tasks:[{html:"<b>Hệ Mặt Trời:</b> xem số liệu của cả 8 hành tinh.",done:()=>Object.keys(S.seen).length>=8},{html:"<b>Kích thước:</b> xem bảng so sánh kích thước.",done:()=>!!S.v.ss},{html:"<b>Ngân Hà:</b> tìm vị trí Hệ Mặt Trời trong Ngân Hà.",done:()=>!!S.v.ngh}],
  obs:[{id:"a",q:"Hành tinh lớn nhất trong Hệ Mặt Trời là:",opts:[["moc","Sao Mộc"],["tho","Sao Thổ"],["dat","Trái Đất"]],ans:"moc",why:"Đường kính Sao Mộc khoảng 143 000 km, gấp khoảng 11 lần Trái Đất."},
    {id:"b",q:"Mặt Trời là:",opts:[["ok","Một ngôi sao, tự phát ra ánh sáng"],["hanh","Một hành tinh"],["ve","Một vệ tinh"]],ans:"ok",why:"Các hành tinh không tự phát sáng, chúng phản xạ ánh sáng Mặt Trời."},
    {id:"c",q:"Ngân Hà là:",opts:[["ok","Một thiên hà chứa Hệ Mặt Trời và hàng trăm tỉ ngôi sao"],["sao","Một ngôi sao"],["hmt","Tên khác của Hệ Mặt Trời"]],ans:"ok",why:"Trong đêm trời quang, ta thấy Ngân Hà như một dải sáng vắt ngang bầu trời."}],
  concl:{html:`<ul class="tlist"><li><b>Hệ Mặt Trời</b> gồm Mặt Trời ở trung tâm, 8 hành tinh (Thủy, Kim, Trái Đất, Hỏa, Mộc, Thổ, Thiên Vương, Hải Vương) cùng các vệ tinh, tiểu hành tinh, sao chổi… Các hành tinh quay quanh Mặt Trời theo cùng một chiều.</li>
    <li>Bốn hành tinh gần Mặt Trời là hành tinh đá, nhỏ; bốn hành tinh xa là hành tinh khổng lồ. Hành tinh càng xa Mặt Trời, chu kì quay quanh Mặt Trời càng dài.</li>
    <li><b>Ngân Hà</b> là thiên hà chứa Hệ Mặt Trời, có dạng đĩa xoắn, gồm hàng trăm tỉ ngôi sao; Hệ Mặt Trời nằm ở một nhánh xoắn, xa tâm.</li></ul>`,
    quiz:[{id:"q1",q:"Khoảng cách trung bình từ Trái Đất tới Mặt Trời khoảng:",opts:[["a","150 triệu km (1 đơn vị thiên văn)"],["b","384 000 km"],["c","1 tỉ km"]],ans:"a",why:{b:"384 000 km là khoảng cách Trái Đất – Mặt Trăng.",c:"Quá xa."}},
      {id:"q2",q:"Hành tinh có vành đai dễ thấy nhất là:",opts:[["a","Sao Thổ"],["b","Sao Hỏa"],["c","Sao Kim"]],ans:"a",why:{b:"Sao Hỏa không có vành đai.",c:"Sao Kim không có vành đai."}}],
    done:`<h2>Hoàn thành: Hệ Mặt Trời và Ngân Hà</h2><p class="muted">8 hành tinh quay quanh Mặt Trời; Hệ Mặt Trời nằm trong Ngân Hà.</p>`},
  gv:["Mẹo nhớ thứ tự: Thủy – Kim – Trái Đất – Hỏa – Mộc – Thổ – Thiên Vương – Hải Vương.","Lưu ý học sinh: khoảng cách trong mô hình đã nén, không theo tỉ lệ thật.","Hỏi: vì sao Sao Thủy gần Mặt Trời nhưng Sao Kim lại nóng nhất? (khí quyển dày)"]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 45)</p><ul class="tlist"><li>Mô tả được sơ lược cấu trúc của Hệ Mặt Trời, nêu được các hành tinh cách Mặt Trời các khoảng cách khác nhau và có chu kì quay khác nhau; phân biệt được hệ Mặt Trời và Ngân Hà.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 45 Hệ Mặt Trời và Ngân Hà.</li>
<li>Số liệu hành tinh (đường kính, khoảng cách trung bình, chu kì quỹ đạo): <a href="https://nssdc.gsfc.nasa.gov/planetary/factsheet/" target="_blank" rel="noopener">NASA NSSDCA – Planetary Fact Sheet</a>.</li>
<li>Bản đồ Trái Đất: đường bờ biển, độ sâu đại dương từ <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> (miền công cộng); màu lục địa và mây là mô phỏng.</li>
<li>Ngân Hà (đường kính khoảng 100 000 năm ánh sáng, Hệ Mặt Trời cách tâm khoảng 26 000 năm ánh sáng): <a href="https://science.nasa.gov/resource/the-milky-way-galaxy/" target="_blank" rel="noopener">NASA Science – The Milky Way Galaxy</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Khoảng cách nén theo căn bậc hai, kích thước hành tinh phóng to (ở phần “Hệ Mặt Trời”); quỹ đạo coi là tròn, đồng phẳng. Hình Ngân Hà là mô phỏng dạng xoắn, không phải ảnh chụp.</li></ul>`;

let S;
LabKHTN.register("K6-T-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"hp",t:"Hành tinh"},{k:"kc",t:"Khoảng cách tới Mặt Trời"},{k:"dk",t:"Đường kính (km)"},{k:"ck",t:"Chu kì quay quanh Mặt Trời"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D Hệ Mặt Trời và Ngân Hà",legend:{w:290},seed:31,
      views:{hmt:{t:[0,0,0],yaw:.3,pitch:.7,rad:15.5,label:"Hệ Mặt Trời",icon:IC.sun},ss:{t:[4,0,0],yaw:0,pitch:.05,rad:13,label:"So sánh kích thước",icon:IC.grid},ngh:{t:[0,0,0],yaw:.2,pitch:.85,rad:88,label:"Ngân Hà",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;K.cam.far=1500;
    S={sel:2,run:true,yr:0,seen:{},v:{},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    /* kết cấu bề mặt hành tinh (canvas) */
    function ptex(p){const c=document.createElement("canvas");c.width=512;c.height=256;const g=c.getContext("2d");g.fillStyle=p.c;g.fillRect(0,0,512,256);let s=p.d;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};
      if(p.k==="moc"||p.k==="tho"){const cols=p.k==="moc"?["#C99A6B","#E7D2B0","#B07B4F","#F1E3C8","#A86D45"]:["#E3CB92","#F2E3B8","#D2B47A","#EADBB0"];for(let y=0;y<256;y+=8){g.fillStyle=cols[Math.floor(r()*cols.length)];g.fillRect(0,y,512,8+r()*6)}if(p.k==="moc"){g.fillStyle="#B9573B";g.beginPath();g.ellipse(340,170,34,18,0,0,6.283);g.fill()}}
      else if(p.k==="dat"){g.fillStyle="#1D4ED8";g.fillRect(0,0,512,256);g.fillStyle="#4D7C0F";for(let i=0;i<14;i++){g.beginPath();g.ellipse(r()*512,40+r()*170,20+r()*60,12+r()*30,r()*3,0,6.283);g.fill()}g.fillStyle="#F8FAFC";g.fillRect(0,0,512,18);g.fillRect(0,238,512,18);g.globalAlpha=.4;for(let i=0;i<30;i++){g.beginPath();g.ellipse(r()*512,r()*256,30+r()*50,6+r()*8,0,0,6.283);g.fill()}g.globalAlpha=1}
      else if(p.k==="thien"||p.k==="hai"){const gr=g.createLinearGradient(0,0,0,256);const a=p.k==="hai"?["#5B7FE6","#3557C8","#4A6CDB","#2E4DB8"]:["#B5ECEF","#93DDE3","#A6E5E9","#86D2DA"];a.forEach((c,i)=>gr.addColorStop(i/3,c));g.fillStyle=gr;g.fillRect(0,0,512,256);g.globalAlpha=.18;for(let y=0;y<256;y+=6){g.fillStyle=r()<.5?"#FFFFFF":"#1E3A8A";g.fillRect(0,y,512,2+r()*3)}g.globalAlpha=1;if(p.k==="hai"){g.fillStyle="rgba(15,30,90,.7)";g.beginPath();g.ellipse(300,150,26,13,0,0,6.283);g.fill();g.fillStyle="rgba(255,255,255,.55)";g.beginPath();g.ellipse(330,128,18,4,0,0,6.283);g.fill()}}
      else{for(let i=0;i<400;i++){g.fillStyle=`rgba(0,0,0,${.05+r()*.15})`;g.beginPath();g.arc(r()*512,r()*256,1+r()*10,0,6.283);g.fill()}if(p.k==="hoa"){g.fillStyle="#F8FAFC";g.fillRect(0,0,512,12)}}
      return R.tex2D(c,{mip:true})}
    const lit=(tex,key)=>({type:"unlit",color:"#FFFFFF",key,hooks:{fu:"uniform sampler2D uTex;",fs:"{vec3 c=texture(uTex,vUV).rgb;vec3 L=normalize(-vW);float d=max(dot(normalize(vN),L),0.);base.rgb=c*(.28+.9*d);}"},textures:{uTex:tex}});
    const flat=(tex,key)=>({type:"std",color:"#FFFFFF",rough:.8,key,hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}});
    const TX=PL.map(ptex);
    /* ---------- 1. Hệ Mặt Trời ---------- */
    const dist=au=>2.2+Math.sqrt(au)*2.1,rad=d=>.16+Math.pow(d/12756,.5)*.22;
    const hN=root.add(new G.Node());const SUNM=k=>({type:"unlit",color:"#FFFFFF",key:k,hooks:{fs:"{float m=max(dot(normalize(vN),normalize(uCam-vW)),0.);float g=.988+.012*sin(normalize(vO).x*90.)*sin(normalize(vO).y*97.)*sin(normalize(vO).z*93.);base.rgb=mix(vec3(.86,.32,.04),vec3(1.,.9,.55),pow(m,.55))*g;}"}});const sun=hN.add(R.mesh(G.sphere(1.3,48,32),SUNM("sun1")));hN.add(R.mesh(G.sphere(1.75,32,20),{type:"unlit",color:"#FDE68A",alpha:.2,transparent:true,order:4}));
    let EARTH=null,EARTH2=null;const PN=PL.map((p,i)=>{const n=hN.add(new G.Node());const m=p.k==="dat"?(EARTH=n.add(LE.earth(R,{radius:rad(p.d),key:"t2a"}))):n.add(R.mesh(G.sphere(rad(p.d),32,20),lit(TX[i],"pl"+i)));if(p.k==="tho"){const ring=n.add(R.mesh(G.lathe([[rad(p.d)*1.3,0],[rad(p.d)*2.2,0]],48),{type:"unlit",color:"#E7D7A8",alpha:.6,transparent:true,side:"double"}));ring.quat=Q.euler(.45,0,0)}
      hN.add(R.mesh(G.tube(Array.from({length:121},(_,j)=>[Math.cos(j/120*6.283)*dist(p.au),0,Math.sin(j/120*6.283)*dist(p.au)]),.012,4),{type:"unlit",color:"#475569"}));n.ph=i*.8;return n});
    /* nền sao */
    const starN=R.instanced(G.sphere(1,6,4),{type:"unlit",color:"#FFFFFF",key:"star"},1500);hN.add(starN);{let s=7;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};const D=starN.data;for(let i=0;i<1500;i++){const th=r()*6.283,ph=Math.acos(2*r()-1),R0=320;D.set([Math.sin(ph)*Math.cos(th)*R0,Math.cos(ph)*R0,Math.sin(ph)*Math.sin(th)*R0,(.08+r()*.18)*3.4,1,1,1,1],i*8)}starN.setInstances(1500)}
    /* ---------- 2. so sánh kích thước (cùng tỉ lệ) ---------- */
    const SX=0;const ssN=root.add(new G.Node());ssN.pos=[SX,0,0];const ksz=5/142984;   /* Sao Mộc đường kính 5 đơn vị */
    const sunR=SUN_D*ksz/2;const bigSun=ssN.add(R.mesh(G.sphere(sunR,96,64),SUNM("sun2")));bigSun.pos=[-sunR-6.2,0,0];
    let x=-5.6;const ssP=PL.map((p,i)=>{const r=p.d*ksz/2,rx=p.k==="tho"?r*2.3:r;x+=rx+.35;const n=p.k==="dat"?(EARTH2=ssN.add(LE.earth(R,{radius:r,key:"t2b",sunDir:[-1,.25,.6]}))):ssN.add(R.mesh(G.sphere(r,40,28),flat(TX[i],"ss"+i)));n.pos=[x,0,0];if(p.k==="tho"){const ring=ssN.add(R.mesh(G.lathe([[r*1.24,0],[r*2.27,0]],64),{type:"unlit",color:"#E7D7A8",alpha:.55,transparent:true,side:"double"}));ring.pos=n.pos;ring.quat=Q.euler(.4,0,.1)}x+=rx;return[x-rx,r]});
    /* ---------- 3. Ngân Hà ---------- */
    const GX=0;const gN=root.add(new G.Node());const gal=R.instanced(G.sphere(1,6,4),{type:"unlit",color:"#FFFFFF",key:"gal",transparent:true,blend:"add",depth:false,order:5},20000);gN.add(gal);
    const ARM=(rr,k)=>k*Math.PI+Math.log(rr/4)*2.9;   /* xoắn lôgarit, 2 nhánh chính + 2 nhánh phụ (k = 0, 1 ; 0,5 ; 1,5) */
    {let s=11;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};const g=()=>{let u=0;for(let j=0;j<4;j++)u+=r();return (u-2)/1.15};const D=gal.data;let n=0;
      const put=(x,y,z,sz,c,a)=>{D.set([GX+x,y,z,sz,c[0]*a,c[1]*a,c[2]*a,1],n*8);n++};
      for(let i=0;i<4000;i++){const rr=Math.abs(g())*4.2,th=r()*6.283;put(Math.cos(th)*rr*1.25,g()*1.6*Math.exp(-rr/5),Math.sin(th)*rr*.95,.22+r()*.3,[1,.82,.55],.5)}   /* khối phồng trung tâm, sao già màu vàng */
      for(let i=0;i<5000;i++){const rr=3+Math.pow(r(),.8)*47,th=r()*6.283;put(Math.cos(th)*rr,g()*.35,Math.sin(th)*rr,.12+r()*.18,[.8,.82,.95],.28)}   /* đĩa */
      for(let i=0;i<11000;i++){const k=[0,1,.5,1.5][i%4],main=k%1===0;const rr=4+Math.pow(r(),main?.9:1.1)*46,th=ARM(rr,k)+g()*(main?.16:.24);const sp=g()*(.6+rr*.025);
        const b=r();const c=b<.55?[.62,.75,1]:b<.85?[1,1,1]:[1,.62,.72];put(Math.cos(th)*rr+sp,g()*.3,Math.sin(th)*rr+sp,.12+r()*.26,c,main?.55:.35)}
      gal.setInstances(n)}
    const sunMark=gN.add(R.mesh(G.sphere(.7,16,12),{type:"unlit",color:"#FDE047",order:6,depth:false}));{const th=ARM(26,.5)+.12;sunMark.pos=[GX+Math.cos(th)*26,0,Math.sin(th)*26]}
    const ringMark=gN.add(R.mesh(G.tube(Array.from({length:65},(_,j)=>[Math.cos(j/64*6.283)*2.4,0,Math.sin(j/64*6.283)*2.4]),.18,4),{type:"unlit",color:"#FDE047",order:6,depth:false}));ringMark.pos=sunMark.pos;
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}if(S.run)S.yr+=dt*.6;
      PL.forEach((p,i)=>{const a=n0(i)+S.yr/p.T*6.283;PN[i].pos=[Math.cos(a)*dist(p.au),0,-Math.sin(a)*dist(p.au)];PN[i].quat=Q.euler(0,S.yr*6,0)});if(EARTH){EARTH.setSun(V3.scale(PN[2].pos,-1));EARTH.spin(dt)}ringMark.scl=[1+.15*Math.sin(K.simT*4),1,1+.15*Math.sin(K.simT*4)];const v=K.view;hN.visible=v==='hmt';ssN.visible=v==='ss';gN.visible=v==='ngh'});
    const n0=i=>i*.9;
    function show(i){S.sel=i;const p=PL[i];if(!S.seen[p.k]){S.seen[p.k]=1;api.record({hp:p.t,kc:`${fmt(p.au,2)} đvtv (≈ ${fmt(p.au*149.6,0)} triệu km)`,dk:fmt(p.d,0),ck:p.T<1?`${fmt(p.T*365.25,0)} ngày`:`${fmt(p.T,p.T<2?2:1)} năm`})}refresh()}
    K.pickFn((x,y)=>{if(K.view!=="hmt")return null;const r=R.ray(x,y);let best=null,bd=1e9;PL.forEach((p,i)=>{const t=G.hit.sphere(r,PN[i].pos,rad(p.d)+.25);if(t!=null&&t<bd){bd=t;best=i}});return best!=null?{i:best}:null});
    K.tapFn(h=>{if(h)show(h.i)});
    const og=K.goView;K.goView=function(v,i){og(v,i);if(v!=="hmt"&&!S.v[v]){S.v[v]=1;api.record({hp:v==="ss"?"So sánh kích thước":"Ngân Hà",kc:v==="ss"?"cùng tỉ lệ đường kính":"Hệ Mặt Trời cách tâm khoảng 26 000 năm ánh sáng",dk:v==="ss"?"Mặt Trời gấp khoảng 109 lần Trái Đất":"đường kính Ngân Hà khoảng 100 000 năm ánh sáng",ck:"—"});refresh()}};
    K.dockFn(()=>K.view==="hmt"?[{grid:PL.map((p,i)=>({k:"pl",v:String(i),label:p.t,icon:"",on:S.sel===i}))},{k:"run",label:S.run?"Dừng quay":"Cho quay",icon:IC.play,on:S.run}]:[]);
    K.onDock((k,v)=>{if(k==="pl")show(+v);else if(k==="run")S.run=!S.run;refresh()});
    K.label("Mặt Trời",[0,1.4,0],{view:"hmt",dir:"n",len:20});const selL=K.label("",()=>V3.add(PN[S.sel].pos,[0,rad(PL[S.sel].d)+.1,0]),{view:"hmt",dir:"ne",len:30});K.onFrame(()=>selL.set(PL[S.sel].t));
    PL.forEach((p,i)=>K.label(p.t.replace("Sao ",""),()=>{const q=ssP[i];return[SX+q[0],i%2?-q[1]-.05:q[1]+.05,0]},{view:"ss",dir:i%2?"s":"n",len:i<4?26:16}));K.label("Mặt Trời (một phần)",[SX-6.4,2,0],{view:"ss",dir:"n",len:20});
    K.label("Hệ Mặt Trời ở đây",()=>V3.add(sunMark.pos,[0,1,0]),{view:"ngh",dir:"ne",len:40});K.label("Tâm Ngân Hà",[GX,1,0],{view:"ngh",dir:"nw",len:40});
    K.infoFn(()=>{const v=K.view;if(v==="hmt"){const p=PL[S.sel];return `<div><b>${p.t}</b> · hành tinh ${p.loai}</div><div>Cách Mặt Trời: ${fmt(p.au,2)} đvtv (≈ ${fmt(p.au*149.6,0)} triệu km)</div><div>Đường kính: ${fmt(p.d,0)} km (${fmt(p.d/12756,2)} lần Trái Đất)</div><div>Quay quanh Mặt Trời: ${p.T<1?fmt(p.T*365.25,0)+" ngày":fmt(p.T,1)+" năm"}</div><small>Đã xem ${Object.keys(S.seen).length}/8. Thời gian mô hình: ${fmt(S.yr,1)} năm.</small>`}
      if(v==="ss")return `<div><b>So sánh kích thước</b> (cùng tỉ lệ)</div><small>Đường kính Mặt Trời khoảng 1,39 triệu km, gấp khoảng 109 lần Trái Đất; Sao Mộc gấp khoảng 11 lần Trái Đất.</small>`;
      return `<div><b>Ngân Hà</b></div><small>Thiên hà dạng đĩa xoắn, đường kính khoảng 100 000 năm ánh sáng, chứa hàng trăm tỉ ngôi sao. Hệ Mặt Trời cách tâm khoảng 26 000 năm ánh sáng.</small>`});
    K.timeLabel(()=>K.view==="hmt"?`${fmt(S.yr,1)} năm`:K.views[K.view].label);
    K.start();show(2);
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(let i=0;i<8;i++)show(i);K.goView("ss");K.goView("ngh");K.goView("hmt")}};
    return K.mount(st)}
});
})();
