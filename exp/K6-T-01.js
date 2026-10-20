/* K6-T-01 · Chuyển động nhìn thấy của Mặt Trời; Mặt Trăng và các pha (SGK KHTN 6 – Kết nối tri thức, Bài 43–44) · 3D
   1. Trái Đất tự quay quanh trục từ tây sang đông (một vòng khoảng 24 giờ) → người ở Việt Nam thấy Mặt Trời mọc ở phía đông, lên cao dần
      tới giữa trưa rồi lặn ở phía tây. Bầu trời địa phương tính cho vĩ độ 16° B vào ngày xuân phân (Mặt Trời mọc khoảng 6 giờ, lặn khoảng 18 giờ).
   2. Mặt Trăng quay quanh Trái Đất (chu kì tuần trăng khoảng 29,5 ngày); nửa Mặt Trăng hướng về Mặt Trời luôn được chiếu sáng.
      Phần được chiếu sáng mà ta nhìn thấy thay đổi theo vị trí của Mặt Trăng → các pha: không trăng, lưỡi liềm, bán nguyệt, trăng khuyết, trăng tròn…
   Bản đồ Trái Đất: đường bờ biển, độ sâu đại dương từ dữ liệu Natural Earth; mây sinh ngẫu nhiên. Kích thước và khoảng cách không theo tỉ lệ. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q,LE=window.LabEarth;
const fmt=C.fmt,D=Math.PI/180;
const LAT=16,LON=106,SYN=29.53;
const PHASES=[[1,"Không trăng (trăng mới)"],[4,"Trăng lưỡi liềm đầu tháng"],[8,"Trăng bán nguyệt đầu tháng (thượng huyền)"],[11,"Trăng khuyết đầu tháng"],[15,"Trăng tròn"],[19,"Trăng khuyết cuối tháng"],[22,"Trăng bán nguyệt cuối tháng (hạ huyền)"],[26,"Trăng lưỡi liềm cuối tháng"]];
const SPEC={
  predict:[{id:"p1",q:"Hằng ngày ta thấy Mặt Trời mọc ở phía đông, lặn ở phía tây là do:",opts:[["ok","Trái Đất tự quay quanh trục theo hướng từ tây sang đông"],["mt","Mặt Trời chuyển động quanh Trái Đất"],["tt","Mặt Trăng che Mặt Trời"]],ans:"ok",res:"Kết quả: chuyển động hằng ngày của Mặt Trời chỉ là chuyển động nhìn thấy."},
    {id:"p2",q:"Khi Mặt Trăng ở giữa Trái Đất và Mặt Trời, ta thấy:",opts:[["moi","Không trăng (trăng mới)"],["tron","Trăng tròn"],["ban","Trăng bán nguyệt"]],ans:"moi",res:"Kết quả: nửa được chiếu sáng của Mặt Trăng quay về phía Mặt Trời, ta nhìn thấy nửa tối."}],
  taskLead:"Phần “Ngày và đêm”: bấm tua nhanh, quan sát Mặt Trời trên bầu trời địa phương. Phần “Tuần trăng”: chọn ngày âm lịch để thấy hình dạng Mặt Trăng.",
  tasks:[{html:"<b>Mặt Trời mọc, lặn:</b> theo dõi từ trước 6 giờ tới sau 18 giờ.",done:()=>S.d.rise&&S.d.set},{html:"<b>Tuần trăng:</b> xem ít nhất 6 hình dạng khác nhau của Mặt Trăng.",done:()=>Object.keys(S.m.seen).length>=6}],
  obs:[{id:"a",q:"Vào khoảng 12 giờ trưa, Mặt Trời ở:",opts:[["ok","Vị trí cao nhất trên bầu trời trong ngày"],["dong","Sát chân trời phía đông"],["tay","Sát chân trời phía tây"]],ans:"ok",why:"Buổi sáng Mặt Trời ở phía đông, chiều ở phía tây."},
    {id:"b",q:"Trăng tròn xuất hiện khi:",opts:[["ok","Trái Đất ở giữa Mặt Trời và Mặt Trăng (Mặt Trăng ở phía đối diện Mặt Trời)"],["giua","Mặt Trăng ở giữa"],["k","Mặt Trăng không được chiếu sáng"]],ans:"ok",why:"Ta nhìn thấy toàn bộ nửa được chiếu sáng."},
    {id:"c",q:"Hình dạng nhìn thấy của Mặt Trăng lặp lại sau khoảng:",opts:[["ok","29,5 ngày"],["7","7 ngày"],["365","365 ngày"]],ans:"ok",why:"Đó là chu kì tuần trăng (tháng âm lịch)."}],
  concl:{html:`<ul class="tlist"><li>Trái Đất tự quay quanh trục từ tây sang đông nên ta thấy Mặt Trời mọc ở phía đông và lặn ở phía tây; đó là chuyển động nhìn thấy (biểu kiến) của Mặt Trời.</li>
    <li>Mặt Trăng không tự phát sáng, nó phản xạ ánh sáng Mặt Trời; nửa hướng về Mặt Trời được chiếu sáng.</li>
    <li>Do Mặt Trăng quay quanh Trái Đất, phần được chiếu sáng mà ta nhìn thấy thay đổi theo chu kì khoảng 29,5 ngày: không trăng → lưỡi liềm → bán nguyệt (thượng huyền) → trăng khuyết → trăng tròn → … → hạ huyền → lưỡi liềm → không trăng.</li></ul>`,
    quiz:[{id:"q1",q:"Ngày rằm (15 âm lịch) thường có:",opts:[["a","Trăng tròn"],["b","Không trăng"],["c","Trăng lưỡi liềm"]],ans:"a",why:{b:"Không trăng vào khoảng mùng 1.",c:"Lưỡi liềm vào đầu hoặc cuối tháng."}},
      {id:"q2",q:"Ở Việt Nam, trăng đầu tháng (trước rằm) sáng ở phía nào khi nhìn từ Trái Đất?",opts:[["a","Phía bên phải"],["b","Phía bên trái"],["c","Toàn bộ"]],ans:"a",why:{b:"Bên trái sáng là trăng cuối tháng.",c:"Toàn bộ sáng là trăng tròn."}}],
    done:`<h2>Hoàn thành: Mặt Trời mọc lặn, tuần trăng</h2><p class="muted">Trái Đất tự quay → Mặt Trời mọc ở đông, lặn ở tây; vị trí Mặt Trăng → các pha.</p>`},
  gv:["Dùng đèn pin (Mặt Trời), quả bóng (Mặt Trăng) để học sinh tự tạo các pha.","Giao bài tập quan sát Mặt Trăng mỗi tối trong một tuần.","Lưu ý mô hình không theo tỉ lệ kích thước và khoảng cách."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 43, 44)</p><ul class="tlist"><li>Giải thích được một cách định tính và sơ lược: từ Trái Đất thấy Mặt Trời mọc và lặn hằng ngày; thiết kế mô hình thực tế để giải thích được một số hình dạng nhìn thấy của Mặt Trăng trong Tuần Trăng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 43 Chuyển động nhìn thấy của Mặt Trời; Bài 44 Chuyển động nhìn thấy của Mặt Trăng.</li>
<li>Đường bờ biển, độ sâu đại dương, vùng băng, hoang mạc trên bản đồ Trái Đất: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> (dữ liệu miền công cộng). Màu lục địa theo đới khí hậu và lớp mây là mô phỏng, không phải ảnh vệ tinh.</li>
<li>Pha Mặt Trăng và chu kì giao hội 29,53 ngày: <a href="https://science.nasa.gov/moon/moon-phases/" target="_blank" rel="noopener">NASA Science – Moon Phases</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Bầu trời địa phương tính cho vĩ độ 16° B vào ngày xuân phân, bỏ qua khúc xạ khí quyển. Vị trí các biển trên Mặt Trăng gần đúng; miệng hố sinh ngẫu nhiên. Kích thước, khoảng cách Trái Đất – Mặt Trăng – Mặt Trời không theo tỉ lệ; quỹ đạo Mặt Trăng coi là tròn và nằm trong mặt phẳng quỹ đạo Trái Đất.</li></ul>`;

let S;
LabKHTN.register("K6-T-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tg",t:"Thời điểm"},{k:"qs",t:"Quan sát"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D Trái Đất tự quay và các pha Mặt Trăng",legend:{w:290},seed:21,
      views:{ngay:{t:[1.2,0,0],yaw:.75,pitch:.5,rad:2.4,label:"Ngày và đêm",icon:IC.sun},trang:{t:[30,0,0],yaw:0,pitch:1.15,rad:5.6,label:"Tuần trăng",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={d:{h:5,run:false,rise:false,set:false},m:{day:4,seen:{}},recs:0};
    const rec=(tg,qs)=>{S.recs++;api.record({lan:String(S.recs),tg,qs})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    /* ---------- cảnh 1: Trái Đất + Mặt Trời (hướng Mặt Trời: +x) ---------- */
    root.add(LE.stars(R,1800,120,3));
    const sun=root.add(LE.sun(R,1.2,"a"));sun.pos=[9,0,0];
    const earth=root.add(LE.earth(R,{radius:1,key:"a"}));
    const ax=root.add(R.mesh(G.cylinder(.01,2.7,8),{type:"unlit",color:"#CBD5E1"}));ax.pos=[0,-1.35,0];
    const pin=earth.add(new G.Node());{const lr=LAT*D,lo=LON*D;const p=[Math.cos(lr)*Math.cos(lo),Math.sin(lr),-Math.cos(lr)*Math.sin(lo)];pin.pos=V3.scale(p,1.0);pin.quat=Q.toward(p);pin.add(R.mesh(G.cylinder(.008,.13,8),{color:"#F8FAFC",rough:.4}));pin.add(R.mesh(G.sphere(.032,14,10),{color:"#EF4444",rough:.35,coat:.5})).pos=[0,.13,0]}
    /* ---------- cảnh 2: tuần trăng (đặt xa) ---------- */
    const MX=30;const e2=root.add(new G.Node());e2.pos=[MX,0,0];const earth2=e2.add(LE.earth(R,{radius:1,key:"b"}));
    const moon=e2.add(LE.moon(R,{radius:.34,key:"b"}));
    const orbit=e2.add(R.mesh(G.tube(Array.from({length:97},(_,i)=>[Math.cos(i/96*6.283)*4,0,Math.sin(i/96*6.283)*4]),.012,5),{type:"unlit",color:"#475569"}));
    const mk=[];PHASES.forEach(([d])=>{const a=(d-1)/SYN*6.283;const m=e2.add(R.mesh(G.sphere(.06,10,8),{type:"unlit",color:"#64748B"}));m.pos=[4*Math.cos(a),0,-4*Math.sin(a)];mk.push(m)});
    const sunDir=[];for(let i=0;i<7;i++){const m=e2.add(R.mesh(G.cylinder(.012,2.4,6),{type:"unlit",color:"#FDE68A",alpha:.28,transparent:true}));m.quat=Q.euler(0,0,Math.PI/2);m.pos=[8.2,0,(i-3)*1.3];sunDir.push(m)}
    /* ---------- lớp phủ: bầu trời địa phương / Mặt Trăng nhìn từ Trái Đất ---------- */
    const ov=document.createElement("canvas");ov.style.cssText="position:absolute;pointer-events:none;border-radius:16px;box-shadow:0 8px 30px rgba(0,0,0,.35)";K.over.appendChild(ov);let oc=ov.getContext("2d"),OW=0,OH=0;
    K.onLayout((sf,safe)=>{const dpr=Math.min(2,window.devicePixelRatio||1);OW=Math.round(Math.min(safe.w*.56,460));OH=Math.round(OW*.62);ov.style.left=(safe.x+safe.w-OW-12)+"px";ov.style.top=(safe.y+safe.h-OH-12)+"px";ov.style.width=OW+"px";ov.style.height=OH+"px";ov.width=OW*dpr;ov.height=OH*dpr;oc=ov.getContext("2d");oc.setTransform(dpr,0,0,dpr,0,0)});
    function sunAltAz(h){const H=(h-12)*15*D,phi=LAT*D;const alt=Math.asin(Math.cos(phi)*Math.cos(H));const az=Math.atan2(Math.sin(H),Math.cos(H)*Math.sin(phi));return{alt,az}}   /* az: 0 = nam, dương = tây */
    function sky(){const g=oc,W=OW,Hh=OH,h=S.d.h;const {alt,az}=sunAltAz(h);const day=Math.sin(alt);
      const top=day>0?C.mix("#0B1E4B","#4FA3E0",C.clamp(day*2,0,1)):C.mix("#0B1E4B","#020617",C.clamp(-day*3,0,1));const sg=g.createLinearGradient(0,0,0,Hh*.75);sg.addColorStop(0,top);sg.addColorStop(1,day>-.1&&day<.25?"#F59E0B":C.mix(top,"#FFFFFF",.15));g.fillStyle=sg;g.fillRect(0,0,W,Hh);
      const hy=Hh*.75;const xOf=a=>W/2+a/(Math.PI/2)*W*.42,yOf=e=>hy-e/(Math.PI/2)*hy*.9;
      g.save();g.setLineDash([4,5]);g.strokeStyle="rgba(255,255,255,.35)";g.beginPath();for(let t=5.8;t<=18.2;t+=.1){const p=sunAltAz(t);const x=xOf(p.az),y=yOf(p.alt);t<5.85?g.moveTo(x,y):g.lineTo(x,y)}g.stroke();g.restore();
      if(alt>-.1){const x=xOf(az),y=yOf(alt);const gl=g.createRadialGradient(x,y,2,x,y,30);gl.addColorStop(0,"rgba(255,240,180,.9)");gl.addColorStop(1,"rgba(255,200,80,0)");g.fillStyle=gl;g.beginPath();g.arc(x,y,30,0,6.283);g.fill();g.fillStyle="#FDE047";g.beginPath();g.arc(x,y,11,0,6.283);g.fill()}
      g.fillStyle=day>0?"#3F6212":"#1A2E05";g.fillRect(0,hy,W,Hh-hy);g.fillStyle=day>0?"#365314":"#14230A";for(let i=0;i<9;i++){const x=i*W/8;g.beginPath();g.moveTo(x-30,hy);g.lineTo(x,hy-14-(i%3)*8);g.lineTo(x+30,hy);g.fill()}
      g.font="700 13px 'Be Vietnam Pro',system-ui";g.fillStyle="#F8FAFC";g.textAlign="center";g.fillText("Đông",xOf(-Math.PI/2),hy+18);g.fillText("Nam",W/2,hy+18);g.fillText("Tây",xOf(Math.PI/2),hy+18);
      g.textAlign="left";g.font="800 15px 'Be Vietnam Pro',system-ui";g.fillText(`${String(Math.floor(h)).padStart(2,"0")}:${String(Math.floor((h%1)*60)).padStart(2,"0")}`,10,20);g.font="600 11.5px 'Be Vietnam Pro',system-ui";g.fillText("Nhìn về phía nam · vĩ độ 16° B",10,36)}
    function moonView(){const g=oc,W=OW,Hh=OH;const key=S.m.day+'|'+OW;if(moonView.key===key&&moonView.ok)return;moonView.key=key;g.fillStyle="#020617";g.fillRect(0,0,W,Hh);for(let i=0;i<70;i++){g.fillStyle=`rgba(255,255,255,${.25+(i%5)*.12})`;g.fillRect((i*97)%W,(i*53)%Hh,i%7?1:1.6,i%7?1:1.6)}
      const a=(S.m.day-1)/SYN*6.283;const r=Hh*.33,cx=W/2,cy=Hh*.52;moonView.ok=LE.moonDisk(g,cx,cy,r,a,R);
      g.font="800 13px 'Be Vietnam Pro',system-ui";g.fillStyle="#F8FAFC";g.textAlign="center";g.fillText(`Ngày ${S.m.day} âm lịch (nhìn từ Việt Nam)`,cx,20);g.font="700 12px 'Be Vietnam Pro',system-ui";g.fillText(phaseName(S.m.day),cx,Hh-10);g.textAlign="left"}
    const phaseName=d=>{let best=PHASES[0];for(const p of PHASES)if(Math.abs(p[0]-d)<Math.abs(best[0]-d))best=p;if(d>=28)return PHASES[0][1];return best[1]};
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame(dt=>{const v=K.view;tk+=dt;if(tk>.3){tk=0;K.updateInfo()}
      const d=S.d;if(d.run){const p=d.h;d.h+=dt*1.6;if(d.h>=24)d.h-=24;if(p<6&&d.h>=6&&!d.rise){d.rise=true;rec("Khoảng 6 giờ","Mặt Trời mọc ở chân trời phía đông");refresh()}if(p<18&&d.h>=18&&!d.set){d.set=true;rec("Khoảng 18 giờ","Mặt Trời lặn ở chân trời phía tây");refresh()}if(p<12&&d.h>=12)rec("Khoảng 12 giờ","Mặt Trời ở vị trí cao nhất (về phía nam)")}
      earth.quat=Q.euler(0,(-LON+15*(d.h-12))*D,0);
      const a=(S.m.day-1)/SYN*6.283;moon.pos=[4*Math.cos(a),0,-4*Math.sin(a)];moon.quat=Q.euler(0,a+Math.PI,0);earth.spin(dt);earth2.spin(dt);
      if(v==="ngay")sky();else moonView()});
    K.dockFn(()=>{if(K.view==="ngay"){const d=S.d;return[{k:"run",label:d.run?"Tạm dừng":"Tua nhanh thời gian",icon:IC.play,on:d.run},{grid:[5,6,9,12,15,18,19].map(h=>({k:"h",v:String(h),label:`${h} giờ`,icon:"",on:Math.abs(d.h-h)<.05}))}]}
      return[{grid:PHASES.map(([dd,t])=>({k:"day",v:String(dd),label:`Ngày ${dd}`,icon:"",on:S.m.day===dd}))},{grid:[{k:"step",v:"-1",label:"Lùi 1 ngày",icon:IC.minus},{k:"step",v:"1",label:"Tới 1 ngày",icon:IC.plus}]}]});
    K.onDock((k,v)=>{const d=S.d,m=S.m;if(k==="run")d.run=!d.run;else if(k==="h"){d.run=false;d.h=+v}else if(k==="day"||k==="step"){m.day=k==="day"?+v:((m.day-1+(+v)+30)%30)+1;const n=phaseName(m.day);if(!m.seen[n]){m.seen[n]=1;rec(`Ngày ${m.day} âm lịch`,n)}}refresh()});
    K.label("Mặt Trời",[9,1.3,0],{view:"ngay",dir:"n",len:20});K.label("Việt Nam",()=>{const lr=LAT*D,ang=15*(S.d.h-12)*D;return[Math.cos(lr)*Math.cos(ang)*1.14,Math.sin(lr)*1.14,-Math.cos(lr)*Math.sin(ang)*1.14]},{view:"ngay",dir:"nw",len:30});
    K.label("Trục Trái Đất",[0,1.4,0],{view:"ngay",dir:"ne",len:20});K.label("Ánh sáng Mặt Trời chiếu tới (từ phải sang)",[1.25,-.85,0],{view:"ngay",dir:"se",len:24});K.label("Ánh sáng Mặt Trời",[MX+8,.1,-3.9],{view:"trang",dir:"s",len:16});K.label("Mặt Trăng",()=>V3.add([MX,0,0],V3.add(moon.pos,[0,.35,0])),{view:"trang",dir:"ne",len:20});K.label("Trái Đất",[MX,1,0],{view:"trang",dir:"nw",len:20});
    K.infoFn(()=>{if(K.view==="ngay"){const {alt}=sunAltAz(S.d.h);return `<div><b>Trái Đất tự quay</b> từ tây sang đông</div><div>${String(Math.floor(S.d.h)).padStart(2,"0")} giờ · Mặt Trời ${alt>0?`cao ${fmt(alt/D,0)}° trên chân trời`:"ở dưới chân trời (ban đêm)"}</div><small>Kéo ngang Trái Đất để quay. Khung nhỏ: bầu trời nhìn từ Việt Nam (ngày xuân phân).</small>`}
      return `<div><b>Tuần trăng</b> · ngày ${S.m.day} âm lịch</div><div>${phaseName(S.m.day)}</div><small>Kéo Mặt Trăng dọc quỹ đạo để đổi ngày. Nửa hướng về Mặt Trời luôn được chiếu sáng. Đã xem ${Object.keys(S.m.seen).length} hình dạng.</small>`});
    K.timeLabel(()=>K.view==="ngay"?`${Math.floor(S.d.h)} giờ`:`Ngày ${S.m.day}`);
    K.onUnmount&&K.onUnmount(()=>ov.remove());
    /* thao tác tay: kéo ngang Trái Đất để quay (đổi giờ); kéo Mặt Trăng dọc quỹ đạo (đổi ngày âm lịch) */
    K.pickFn((x,y)=>{const r=R.ray(x,y);if(K.view==="ngay")return G.hit.sphere(r,[0,0,0],1.06)!=null?{drag:true,k:"earth"}:null;
      const mp=V3.add([MX,0,0],moon.pos);return G.hit.sphere(r,mp,.7)!=null?{drag:true,k:"moon"}:null});
    K.dragFn((ph,o,p)=>{if(o.k==="earth"){const d=S.d;if(ph==="start"){d.run=false;o.lx=p.x;return}if(ph==="move"){d.h=((d.h+(p.x-o.lx)*.035)%24+24)%24;o.lx=p.x;K.refreshDock();K.updateInfo(true)}return}
      if(o.k==="moon"){const r=R.ray(p.x,p.y),t=G.hit.planeY(r,0);if(t!=null&&(ph==="move"||ph==="end")){const q=G.hit.at(r,t);let a=Math.atan2(-q[2],q[0]-MX);if(a<0)a+=6.283;const day=C.clamp(Math.round(a/6.283*SYN)+1,1,30);
        if(ph==="move"){S.m.day=day;K.refreshDock();K.updateInfo(true)}else K._dockH("day",String(day))}}});
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.d.rise=S.d.set=true;rec("6 giờ","Mặt Trời mọc ở phía đông");rec("18 giờ","Mặt Trời lặn ở phía tây");K.goView("trang");for(const [d] of PHASES)K._dockH("day",String(d));K.goView("ngay");S.d.h=9}};
    return K.mount(st)}
});
})();
