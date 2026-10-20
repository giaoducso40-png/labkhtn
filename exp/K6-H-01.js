/* K6-H-01 · Các thể của chất và sự chuyển thể (SGK KHTN 6 – Kết nối tri thức, Bài 8) · 3D
   1. Đun nước đá: cốc nước đá (200 g, −5 °C) đặt trên kiềng có lưới tản nhiệt, đun bằng đèn cồn; nhiệt kế đo nhiệt độ; vẽ đồ thị nhiệt độ – thời gian.
      Mô hình nhiệt: công suất truyền vào cốc coi như không đổi 150 W, bỏ qua hao phí và trao đổi nhiệt với môi trường, áp suất 1 atm.
      Hằng số (làm tròn): c(nước đá) = 2,1 J/(g·K); nhiệt nóng chảy 334 J/g; c(nước) = 4,18 J/(g·K); nhiệt hóa hơi ở 100 °C ≈ 2 257 J/g.
   2. Mô hình hạt: ba thể rắn – lỏng – khí (sắp xếp và chuyển động của các hạt).
   3. Ngưng tụ: đậy tấm kính lạnh trên cốc nước nóng, hơi nước ngưng tụ thành giọt ở mặt dưới tấm kính. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q,H=G.hex;
const fmt=C.fmt;
const M=200,PW=150,CI=2.1,LF=334,CW=4.18,LV=2257,T0=-5;
const Q1=M*CI*(0-T0),Q2=Q1+M*LF,Q3=Q2+M*CW*100;
const TEND=20*60;
function stateOf(Qh){if(Qh<Q1)return{T:T0+Qh/(M*CI),f:0,ev:0};if(Qh<Q2)return{T:0,f:(Qh-Q1)/(M*LF),ev:0};if(Qh<Q3)return{T:(Qh-Q2)/(M*CW),f:1,ev:0};return{T:100,f:1,ev:(Qh-Q3)/LV}}
const theOf=s=>s.f<=0?"rắn":s.f<1?"rắn + lỏng":s.T>=100?"lỏng + khí (sôi)":"lỏng";
const SPEC={
  predict:[{id:"p1",q:"Trong lúc nước đá đang tan, nhiệt độ của hỗn hợp nước đá và nước sẽ:",opts:[["tang","Tăng dần"],["kd","Không đổi"],["giam","Giảm dần"]],ans:"kd",res:"Kết quả: trong suốt thời gian nóng chảy, nhiệt kế chỉ 0 °C."},
    {id:"p2",q:"Khi nước đang sôi mà vẫn tiếp tục đun, nhiệt độ của nước:",opts:[["tang","Tiếp tục tăng"],["kd","Không đổi"],["giam","Giảm"]],ans:"kd",res:"Kết quả: ở áp suất 1 atm, nước sôi ở 100 °C và nhiệt độ giữ nguyên khi đang sôi."}],
  taskLead:"Bấm “Đốt đèn cồn” rồi theo dõi nhiệt kế và đồ thị. Mỗi 2 phút, số liệu tự ghi vào bảng.",
  tasks:[{html:"<b>Đun nước đá:</b> đun đến khi nước sôi được vài phút (đủ 20 phút).",done:()=>S.t>=TEND},{html:"<b>Mô hình hạt:</b> chạm vào cả ba hộp rắn, lỏng, khí.",done:()=>Object.keys(S.hat).length>=3},{html:"<b>Ngưng tụ:</b> đậy tấm kính lạnh lên cốc nước nóng và quan sát.",done:()=>S.ng.t>=1}],
  obs:[{id:"a",q:"Đoạn nằm ngang thứ nhất trên đồ thị (ở 0 °C) ứng với quá trình:",opts:[["nc","Nóng chảy"],["soi","Sôi"],["dd","Đông đặc"]],ans:"nc",why:"Nhiệt cung cấp lúc này dùng để chuyển nước đá từ thể rắn sang thể lỏng nên nhiệt độ không đổi."},
    {id:"b",q:"Giọt nước đọng ở mặt dưới tấm kính là kết quả của sự:",opts:[["nt","Ngưng tụ"],["bh","Bay hơi"],["nc","Nóng chảy"]],ans:"nt",why:"Hơi nước gặp tấm kính lạnh chuyển từ thể khí sang thể lỏng."},
    {id:"c",q:"Ở thể nào các hạt ở xa nhau nhất và chuyển động hỗn loạn nhất?",opts:[["khi","Thể khí"],["long","Thể lỏng"],["ran","Thể rắn"]],ans:"khi",why:"Vì vậy chất khí dễ nén và không có hình dạng, thể tích xác định."}],
  concl:{html:`<ul class="tlist"><li>Chất tồn tại ở ba thể cơ bản: <b>rắn</b> (hạt sắp xếp khít, chỉ dao động tại chỗ, có hình dạng xác định), <b>lỏng</b> (hạt gần nhau, trượt lên nhau, có hình dạng theo vật chứa), <b>khí</b> (hạt rất xa nhau, chuyển động hỗn loạn, dễ nén).</li>
    <li><b>Nóng chảy</b>: rắn → lỏng; <b>đông đặc</b>: lỏng → rắn; <b>bay hơi</b>: lỏng → khí (xảy ra ở bề mặt, ở mọi nhiệt độ); <b>ngưng tụ</b>: khí → lỏng.</li>
    <li><b>Sôi</b> là sự bay hơi xảy ra cả trong lòng và trên bề mặt chất lỏng. Trong lúc nóng chảy và lúc sôi, nhiệt độ không đổi (nước đá nóng chảy ở 0 °C, nước sôi ở 100 °C ở áp suất 1 atm).</li></ul>`,
    quiz:[{id:"q1",q:"Hiện tượng sương đọng trên lá cây vào sáng sớm là:",opts:[["a","Sự ngưng tụ"],["b","Sự nóng chảy"],["c","Sự sôi"]],ans:"a",why:{b:"Nóng chảy là rắn → lỏng.",c:"Sôi cần chất lỏng đạt nhiệt độ sôi."}},
      {id:"q2",q:"Phơi quần áo ướt ngoài nắng, nước trong quần áo biến mất là do:",opts:[["a","Sự bay hơi"],["b","Sự ngưng tụ"],["c","Sự đông đặc"]],ans:"a",why:{b:"Ngưng tụ là khí → lỏng.",c:"Đông đặc là lỏng → rắn."}}],
    done:`<h2>Hoàn thành: Các thể của chất và sự chuyển thể</h2><p class="muted">Nóng chảy ở 0 °C, sôi ở 100 °C; nhiệt độ không đổi trong lúc chuyển thể.</p>`},
  gv:["Đồ thị trong mô phỏng lý tưởng: thực tế đoạn 0 °C hơi dốc vì hỗn hợp không đều nhiệt, nên khuấy nhẹ khi đo.","Lưu ý an toàn: đèn cồn chỉ đốt bằng diêm/bật lửa, tắt bằng nắp; không thổi.","“Khói trắng” trên miệng cốc là các giọt nước rất nhỏ (hơi nước đã ngưng tụ), hơi nước thật không nhìn thấy được."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 8)</p><ul class="tlist"><li>Nêu được một số tính chất của chất (thể, nhiệt độ nóng chảy, nhiệt độ sôi…); trình bày được quá trình diễn ra sự chuyển thể: nóng chảy, đông đặc, bay hơi, ngưng tụ, sôi.</li><li>Tiến hành được thí nghiệm về sự chuyển thể của chất.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 8 Sự đa dạng và các thể cơ bản của chất. Tính chất của chất.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>200 g nước đá ở −5 °C; nhiệt truyền vào cốc không đổi 150 W; bỏ qua hao phí nhiệt, nhiệt dung của cốc và nhiệt kế; áp suất 1 atm.</li>
<li>Hằng số làm tròn theo giá trị tra bảng thông dụng: nhiệt dung riêng nước đá 2,1 J/(g·K), nước 4,18 J/(g·K); nhiệt nóng chảy của nước đá 334 J/g; nhiệt hóa hơi của nước ở 100 °C khoảng 2 257 J/g.</li>
<li>Thời gian trong mô phỏng được tua nhanh (1 giây xem ≈ 30 giây thí nghiệm). Mô hình hạt chỉ minh họa cách sắp xếp và chuyển động, không theo tỉ lệ kích thước thật.</li></ul>`;

let S;
LabKHTN.register("K6-H-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tg",t:"Thời gian (phút)"},{k:"nd",t:"Nhiệt độ (°C)"},{k:"the",t:"Thể của nước"},{k:"ht",t:"Hiện tượng"}],empty:"Đốt đèn cồn, số liệu tự ghi mỗi 2 phút."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D sự chuyển thể của nước",legend:{w:300},bench:[12,3.2],seed:8,
      views:{dun:{t:[-.15,1.08,0],yaw:.12,pitch:.16,rad:1.25,label:"Đun nước đá",icon:IC.fire},hat:{t:[-4,.5,0],yaw:0,pitch:.25,rad:1.7,label:"Mô hình hạt",icon:IC.grid},ng:{t:[4.05,.42,0],yaw:.1,pitch:.25,rad:.75,label:"Ngưng tụ",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={Q:0,t:0,on:false,pts:[[0,T0]],nextRec:0,ev:{},hat:{},hsel:null,ng:{on:false,t:0},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const vplane=(w,h)=>{const g=G.plane(w,h);const P=g.pos,N=g.nrm;for(let i=0;i<P.length;i+=3){const pz=P[i+2];P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}return g};
    const texM=(c,key)=>({type:"unlit",color:"#FFFFFF",key,hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.5)discard;base.rgb=c.rgb;}"},textures:{uTex:R.tex2D(c)}});
    /* ---------- 1. bộ đun ---------- */
    const DN=root.add(new G.Node());
    /* đèn cồn */
    const lamp=DN.add(new G.Node());lamp.add(R.mesh(G.lathe([[0,0],[.2,0],[.22,.03],[.22,.16],[.17,.27],[.08,.31],[.07,.34],[0,.34]],40),{type:"glass",color:"#DBEAFE",alpha:.5}));
    lamp.add(K3.liquid(R,.2,.02,.14,H("#BFDBFE"),.45));lamp.add(R.mesh(G.cylinder(.055,.06,20),{color:"#9CA3AF",metal:.8,rough:.3})).pos=[0,.33,0];lamp.add(R.mesh(G.cylinder(.016,.06,10),{color:"#F5F5F4",rough:.9})).pos=[0,.38,0];
    const fl=lamp.add(K3.flame(R,[.35,.55,1],[.85,.92,1]));fl.pos=[0,.43,0];fl.scl=[.6,.75,.6];fl.visible=false;
    const fl2=lamp.add(K3.flame(R,[1,.55,.12],[1,.9,.6]));fl2.pos=[0,.45,0];fl2.scl=[.42,.6,.42];fl2.visible=false;
    const cap=DN.add(R.mesh(G.lathe([[0,0],[.07,0],[.07,.1],[.06,.12],[0,.12]],20),{color:"#E5E7EB",rough:.4}));cap.pos=[0,.33,0];
    /* kiềng ba chân + lưới tản nhiệt */
    const TY=.78;DN.add(R.mesh(G.tube(Array.from({length:49},(_,j)=>[Math.cos(j/48*6.283)*.36,TY-.02,Math.sin(j/48*6.283)*.36]),.018,6),{color:"#374151",metal:.7,rough:.4}));
    for(let i=0;i<3;i++){const a=i/3*6.283+.5;DN.add(R.mesh(G.tube([[Math.cos(a)*.36,TY-.02,Math.sin(a)*.36],[Math.cos(a)*.46,0,Math.sin(a)*.46]],.016,6),{color:"#374151",metal:.7,rough:.4}))}
    {const c=document.createElement("canvas");c.width=c.height=256;const g=c.getContext("2d");g.fillStyle="rgba(0,0,0,0)";g.clearRect(0,0,256,256);g.strokeStyle="#4B5563";g.lineWidth=2;for(let i=0;i<=256;i+=10){g.beginPath();g.moveTo(i,0);g.lineTo(i,256);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(256,i);g.stroke()}
      g.fillStyle="#E7E5E4";g.beginPath();g.arc(128,128,62,0,6.283);g.fill();g.fillStyle="#D6D3D1";for(let i=0;i<300;i++){g.fillRect(70+Math.random()*116,70+Math.random()*116,2,2)}g.strokeStyle="#9CA3AF";g.lineWidth=6;g.strokeRect(3,3,250,250);
      const gz=DN.add(R.mesh(G.plane(.9,.9),texM(c,"gauze")));gz.pos=[0,TY,0]}
    /* cốc thủy tinh, nước đá, nước */
    const BY=TY+.005,BR=.3;const bk=DN.add(K3.glass(R,BR,.78));bk.pos=[0,BY,0];
    {const c=document.createElement("canvas");c.width=128;c.height=512;const g=c.getContext("2d");g.clearRect(0,0,128,512);g.fillStyle="#F8FAFC";g.font="700 26px system-ui";for(let i=1;i<=5;i++){const y=512-i*80-20;g.fillRect(0,y,40,4);g.fillText(String(i*50),48,y+10)}g.fillText("ml",48,40);
      const sc=DN.add(R.mesh(vplane(.16,.64),texM(c,"bkscale")));sc.pos=[-.06,BY+.4,BR+.004]}
    const water=DN.add(K3.liquid(R,BR-.03,.03,1,H("#7DD3FC"),.42));water.pos=[0,BY,0];
    const WL=m=>.03+.32*m/M;   /* mực nước theo khối lượng nước lỏng */
    const ICE=[];{let s=5;const r=()=>{s=(s*16807)%2147483647;return s/2147483647};const sl=[[-.1,-.09],[.1,-.1],[-.12,.1],[.09,.09],[0,0],[-.02,.18],[.17,0],[-.18,0],[0,-.17]];
      sl.forEach(([x,z],i)=>{for(let l=0;l<2;l++){const m=DN.add(R.mesh(G.box(.13,.12,.13,.025,3),{type:"glass",color:"#E0F2FE",alpha:.62,key:"ice"}));const b={m,x:x+(r()-.5)*.03,z:z+(r()-.5)*.03,y0:.09+l*.13,q:Q.euler((r()-.5)*.5,r()*3,(r()-.5)*.5)};m.quat=b.q;ICE.push(b)}})}
    /* nhiệt kế + giá kẹp */
    const TX=.13,TZ=.05;const stand=DN.add(new G.Node());stand.add(R.mesh(G.box(.5,.04,.32,.01,2),{color:"#1F2937",rough:.5})).pos=[-.85,.02,0];stand.add(R.mesh(G.cylinder(.018,2.3,12),{color:"#9CA3AF",metal:.85,rough:.25})).pos=[-.85,0,0];
    stand.add(R.mesh(G.tube([[-.85,1.95,0],[TX,1.95,TZ]],.014,6),{color:"#9CA3AF",metal:.85,rough:.25}));stand.add(R.mesh(G.box(.06,.08,.06,.01,2),{color:"#6B7280",metal:.6,rough:.4})).pos=[TX,1.95,TZ];
    const tm=DN.add(new G.Node());tm.pos=[TX,BY+.07,TZ];tm.add(R.mesh(G.cylinder(.02,1.5,14),{type:"glass",color:"#F8FAFC",alpha:.45}));tm.add(R.mesh(G.sphere(.026,14,10),{color:"#DC2626",rough:.3}));
    const col=tm.add(R.mesh(G.cylinder(.007,1,8),{color:"#DC2626",rough:.3}));
    const SC0=.2,SCH=1.2;const yOf=T=>SC0+SCH*(((T+10)/120*940+42)/1024);
    {const c=document.createElement("canvas");c.width=96;c.height=1024;const g=c.getContext("2d");g.fillStyle="#FFFFFF";g.fillRect(0,0,96,1024);g.fillStyle="#111";g.font="700 26px system-ui";
      for(let T=-10;T<=110;T+=2){const y=1024-((T+10)/120*940+42);g.fillRect(0,y-1,T%10===0?34:16,T%10===0?3:2);if(T%10===0)g.fillText(String(T),38,y+9)}
      const scm=tm.add(R.mesh(vplane(.06,SCH),{type:"unlit",color:"#FFFFFF",key:"tscale",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:R.tex2D(c,{mip:true})}}));scm.pos=[.05,SC0+SCH/2,0]}
    const bub=root.add(K3.bubbles(R,260)),steam=root.add(K3.puffs(R,120,"#FFFFFF"));
    /* ---------- 2. mô hình hạt ---------- */
    const HX=-4,BW=.9;const HN=root.add(new G.Node());HN.pos=[HX,0,0];
    const BOX={ran:{x:-1.05,t:"Thể rắn",c:"#2563EB"},long:{x:0,t:"Thể lỏng",c:"#0891B2"},khi:{x:1.05,t:"Thể khí",c:"#7C3AED"}};
    for(const k in BOX){const b=BOX[k];const n=HN.add(R.mesh(G.box(BW,BW,BW,.02,2),{type:"glass",color:"#E2E8F0",alpha:.18,side:"double",key:"hbox"}));n.pos=[b.x,BW/2+.02,0];
      HN.add(R.mesh(G.box(BW+.04,.03,BW+.04,.01,2),{color:"#334155",rough:.5})).pos=[b.x,.015,0]}
    const PR=.055;const mk=(k,n)=>{const m=R.instanced(G.sphere(1,16,12),{color:BOX[k].c,rough:.35,coat:.3},n);HN.add(m);return m};
    const PA={ran:[],long:[],khi:[]};const rnd=K.rnd;
    for(let i=0;i<5;i++)for(let j=0;j<5;j++)for(let l=0;l<4;l++)PA.ran.push({h:[(i-2)*.13,.1+l*.13,(j-2)*.13],p:[0,0,0]});
    for(let i=0;i<70;i++)PA.long.push({p:[(rnd()-.5)*.7,.08+rnd()*.35,(rnd()-.5)*.7],v:[0,0,0]});
    for(let i=0;i<14;i++){const a=rnd()*6.283,b=rnd()*2-1;PA.khi.push({p:[(rnd()-.5)*.7,.1+rnd()*.7,(rnd()-.5)*.7],v:[Math.cos(a)*1.1,b*1.1,Math.sin(a)*1.1]})}
    const IM={ran:mk("ran",100),long:mk("long",70),khi:mk("khi",14)};
    function stepHat(dt){const tt=K.simT;PA.ran.forEach((q,i)=>{q.p=[q.h[0]+.012*Math.sin(tt*23+i*1.7),q.h[1]+.012*Math.sin(tt*19+i*2.3),q.h[2]+.012*Math.sin(tt*27+i*.9)]});
      const L=PA.long,lo=-.39,hi=.39;for(const a of L){a.v[0]+=(rnd()-.5)*dt*3;a.v[1]+=(rnd()-.5)*dt*3-dt*1.5;a.v[2]+=(rnd()-.5)*dt*3;a.v=V3.scale(a.v,1-dt*1.5)}
      for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++){const d=V3.sub(L[i].p,L[j].p),dd=V3.len(d);if(dd<PR*2.05&&dd>1e-6){const push=V3.scale(d,(PR*2.05-dd)/dd*.5);L[i].p=V3.add(L[i].p,push);L[j].p=V3.sub(L[j].p,push)}}
      for(const a of L){a.p=V3.add(a.p,V3.scale(a.v,dt));for(const ax of [0,2]){if(a.p[ax]<lo+PR){a.p[ax]=lo+PR;a.v[ax]*=-.5}if(a.p[ax]>hi-PR){a.p[ax]=hi-PR;a.v[ax]*=-.5}}if(a.p[1]<.02+PR+.02){a.p[1]=.04+PR;a.v[1]=Math.abs(a.v[1])*.3}}
      for(const a of PA.khi){a.p=V3.add(a.p,V3.scale(a.v,dt));for(const ax of [0,1,2]){const lo2=ax===1?.04+PR:lo+PR,hi2=ax===1?.02+BW-PR:hi-PR;if(a.p[ax]<lo2){a.p[ax]=lo2;a.v[ax]=Math.abs(a.v[ax])}if(a.p[ax]>hi2){a.p[ax]=hi2;a.v[ax]=-Math.abs(a.v[ax])}}}
      for(const k in IM){const D=IM[k].data,arr=PA[k],x=BOX[k].x;arr.forEach((a,i)=>D.set([x+a.p[0],(k==="ran"?.02:0)+a.p[1],a.p[2],PR,1,1,1,1],i*8));IM[k].setInstances(arr.length)}}
    /* ---------- 3. ngưng tụ ---------- */
    const NX=3.8;const NG=root.add(new G.Node());NG.pos=[NX,0,0];NG.add(R.mesh(G.cylinder(.34,.04,40),{color:"#B45309",rough:.8}));
    const nb=NG.add(K3.glass(R,.24,.5));nb.pos=[0,.04,0];NG.add(K3.liquid(R,.215,.07,.34,H("#BAE6FD"),.42)).pos=[0,.04,0];
    const plate=NG.add(new G.Node());plate.add(R.mesh(G.box(.66,.02,.66,.008,2),{type:"glass",color:"#E0F2FE",alpha:.35,key:"plate"}));plate.pos=[.95,.6,0];
    const drops=R.instanced(G.sphere(1,10,8),{type:"glass",color:"#F0F9FF",alpha:.75,key:"drop"},90);NG.add(drops);const DR=[];for(let i=0;i<90;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*.24;DR.push([Math.cos(a)*d,Math.sin(a)*d,.6+rnd()*.4,rnd()])}
    const nsteam=NG.add(K3.puffs(R,60,"#FFFFFF"));
    /* ---------- vòng lặp ---------- */
    const rec=(tg,ht)=>{const s=stateOf(S.Q);api.record({tg,nd:fmt(s.T,1),the:theOf(s),ht})};
    let tk=0,sp=0,np=0;
    K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}
      if(S.on&&S.t<TEND){const ds=Math.min(dt*30,TEND-S.t);S.t+=ds;S.Q+=PW*ds;
        const s=stateOf(S.Q);const last=S.pts[S.pts.length-1];if(S.t-last[0]>=10)S.pts.push([S.t,s.T]);
        const evs=[["nc",S.Q>=Q1,"Nước đá bắt đầu nóng chảy"],["tan",S.Q>=Q2,"Nước đá tan hết"],["soi",S.Q>=Q3,"Nước bắt đầu sôi"]];
        for(const [k,c,txt] of evs)if(c&&!S.ev[k]){S.ev[k]=S.t;rec(fmt(S.t/60,1),txt)}
        while(S.t>=S.nextRec){const s2=stateOf(S.Q);rec(String(Math.round(S.nextRec/60)),s2.f<=0?"nước đá chưa tan":s2.f<1?`đang tan (${Math.round(s2.f*100)} %)`:s2.T>=100?"sôi mạnh, có nhiều bọt khí":s2.T>70?"có bọt khí nhỏ ở đáy cốc":"nước nóng dần");S.nextRec+=120}
        if(S.t>=TEND){S.on=false;rec("20","Tắt đèn cồn, kết thúc đun")}refresh()}
      const s=stateOf(S.Q);fl.visible=fl2.visible=S.on;cap.visible=!S.on;
      const mw=M*s.f-s.ev;const lvl=WL(Math.max(mw,0));water.scl=[1,lvl,1];water.visible=s.f>0;
      ICE.forEach(b=>{const k=Math.max(0,1-s.f);const sc=Math.cbrt(k);b.m.visible=sc>.03;b.m.scl=[sc,sc,sc];const y=Math.max(b.y0*sc,lvl-.03-.06*sc);b.m.pos=[b.x*(.6+.4*sc),BY+.03+y,b.z*(.6+.4*sc)]});
      col.scl=[1,Math.max(.01,yOf(s.T)-.01),1];
      /* bọt khí và hơi */
      sp+=dt;const rate=s.T>=100?120:s.T>70?(s.T-70)*.8:0;while(S.on&&sp>0&&rate>0){sp-=1/rate;const a=rnd()*6.283,d=Math.sqrt(rnd())*(BR-.05);bub.spawn([Math.cos(a)*d,BY+.04,Math.sin(a)*d],s.T>=100?.012+rnd()*.022:.006,[0,s.T>=100?.5:.15,0],2,1)}if(sp>0)sp=0;
      bub.step(dt,b=>{const top=BY+lvl;if(b.p[1]>top-.01){b.dead=true}else if(s.T<100&&b.age>.6){b.dead=true}});
      np+=dt;const sr=s.T>=100?14:s.T>80?(s.T-80)*.25:0;while(sr>0&&np>0){np-=1/sr;steam.spawn([(rnd()-.5)*.3,BY+.82,(rnd()-.5)*.3],.05,[(rnd()-.5)*.05,.25,0],2.2,s.T>=100?.38:.18,2.2)}if(np>0)np=0;steam.step(dt);
      if(K.view==="hat")stepHat(Math.min(dt,.04));
      const N=S.ng;if(N.on&&N.t<1){N.t=Math.min(1,N.t+dt/5);if(N.t>=1){api.record({tg:"—",nd:"≈ 80",the:"khí → lỏng",ht:"Mặt dưới tấm kính đọng nhiều giọt nước (ngưng tụ)"});refresh()}}
      const e=N.on?Math.min(1,N.t*4):0;plate.pos=[.95*(1-e),.6-.04*e+(1-e)*.0,0];
      let c=0;const D=drops.data;DR.forEach((d,i)=>{const g=C.clamp((N.t-d[3]*.7)/.3,0,1);if(N.on&&g>0&&e>=1){D.set([d[0],.585,d[1],.006+.018*g*d[2],1,1,1,1],c*8);c++}});drops.setInstances(c);
      if(rnd()<dt*(N.on&&e>=1?3:9))nsteam.spawn([(rnd()-.5)*.25,.42,(rnd()-.5)*.25],.04,[0,N.on&&e>=1?.02:.2,0],N.on?1:2,.2,1.6);nsteam.step(dt)});
    /* ---------- tương tác ---------- */
    K.pickFn((x,y)=>{if(K.view!=="hat")return null;const r=R.ray(x,y);for(const k in BOX){const b=BOX[k];if(G.hit.box(r,[HX+b.x-BW/2,0,-BW/2],[HX+b.x+BW/2,BW+.04,BW/2])!=null)return{k}}return null});
    K.tapFn(h=>{if(h)selHat(h.k)});
    const HD={ran:"Các hạt sắp xếp khít nhau, theo trật tự; chỉ dao động tại chỗ → có hình dạng và thể tích xác định, rất khó nén.",long:"Các hạt ở gần nhau, không theo trật tự, trượt lên nhau → có thể tích xác định, hình dạng theo vật chứa, khó nén.",khi:"Các hạt ở rất xa nhau, chuyển động hỗn loạn, nhanh → không có hình dạng, thể tích xác định, chiếm đầy vật chứa, dễ nén."};
    function selHat(k){S.hsel=k;if(!S.hat[k]){S.hat[k]=1;api.record({tg:"—",nd:"—",the:BOX[k].t.replace("Thể ",""),ht:HD[k].split(" → ")[0]})}refresh()}
    K.dockFn(()=>{const v=K.view;if(v==="dun")return[{k:"lamp",label:S.on?"Tắt đèn cồn":S.t>=TEND?"Đã đun đủ 20 phút":"Đốt đèn cồn",icon:IC.fire,on:S.on,dis:S.t>=TEND},{k:"rs",label:"Làm lại",icon:IC.reset}];
      if(v==="hat")return[{grid:Object.keys(BOX).map(k=>({k:"hb",v:k,label:BOX[k].t,icon:"",on:S.hsel===k}))}];
      return[{k:"plate",label:S.ng.on?"Đã đậy tấm kính lạnh":"Đậy tấm kính lạnh",icon:IC.eye,dis:S.ng.on},{k:"nrs",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{if(k==="lamp")S.on=!S.on;else if(k==="rs"){S.Q=0;S.t=0;S.on=false;S.pts=[[0,T0]];S.nextRec=0;S.ev={};bub.list.length=0;steam.list.length=0}else if(k==="hb")selHat(v);else if(k==="plate"){S.ng.on=true;S.ng.t=0}else if(k==="nrs"){S.ng.on=false;S.ng.t=0}refresh()});
    /* nhãn */
    K.label("Đèn cồn",[0,.2,.22],{view:"dun",dir:"sw",len:26});K.label("Kiềng và lưới tản nhiệt",[.4,TY,.3],{view:"dun",dir:"se",len:30});K.label("Nhiệt kế",()=>[TX,BY+1.35,TZ],{view:"dun",dir:"ne",len:30});
    K.label("",()=>{const s=stateOf(S.Q);return s.f<1?[.15,BY+.3,.2]:[-99,-99,-99]},{view:"dun",dir:"e",len:60}).set("Nước đá");
    K.label("Giá kẹp",[-.85,1.7,0],{view:"dun",dir:"nw",len:24});
    for(const k in BOX)K.label(BOX[k].t,[HX+BOX[k].x,BW+.06,0],{view:"hat",dir:"n",len:16});
    K.label("Tấm kính lạnh",()=>V3.add([NX,0,0],V3.add(plate.pos,[.3,.02,0])),{view:"ng",dir:"ne",len:26});K.label("Cốc nước nóng (≈ 80 °C)",[NX-.24,.3,0],{view:"ng",dir:"w",len:30});
    /* đồ thị */
    function graph(){const W=270,Hh=150,pl=30,pb=22,pt=8,pr=8;const X=t=>pl+(W-pl-pr)*t/TEND,Y=T=>pt+(Hh-pt-pb)*(1-(T+10)/120);
      let ax=`<line x1="${pl}" y1="${Y(-10)}" x2="${W-pr}" y2="${Y(-10)}" stroke="currentColor" opacity=".5"/><line x1="${pl}" y1="${pt}" x2="${pl}" y2="${Y(-10)}" stroke="currentColor" opacity=".5"/>`;
      for(const T of [0,20,40,60,80,100])ax+=`<line x1="${pl}" y1="${Y(T)}" x2="${W-pr}" y2="${Y(T)}" stroke="currentColor" opacity=".12"/><text x="${pl-3}" y="${Y(T)+3}" font-size="8" text-anchor="end" fill="currentColor">${T}</text>`;
      for(let m=0;m<=20;m+=5)ax+=`<text x="${X(m*60)}" y="${Hh-pb+11}" font-size="8" text-anchor="middle" fill="currentColor">${m}</text>`;
      const pts=S.pts.concat([[S.t,stateOf(S.Q).T]]).map(p=>`${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ");
      return `<svg viewBox="0 0 ${W} ${Hh}" width="100%" style="max-width:${W}px;display:block;margin-top:4px">${ax}<text x="${pl+3}" y="${pt+8}" font-size="8" fill="currentColor">t (°C)</text><text x="${W-pr}" y="${Hh-pb-4}" font-size="8" text-anchor="end" fill="currentColor">thời gian (phút)</text><polyline points="${pts}" fill="none" stroke="#EF4444" stroke-width="2"/></svg>`}
    K.infoFn(()=>{const v=K.view;if(v==="dun"){const s=stateOf(S.Q);return `<div><b>${fmt(S.t/60,1)} phút</b> · nhiệt kế: <b>${fmt(s.T,1)} °C</b></div><div>Thể: ${theOf(s)}${s.f>0&&s.f<1?` · đã tan ${Math.round(s.f*100)} %`:""}${s.ev>0?` · đã hóa hơi ${fmt(s.ev,1)} g`:""}</div>${graph()}`}
      if(v==="hat")return S.hsel?`<div><b>${BOX[S.hsel].t}</b></div><small>${HD[S.hsel]}</small>`:`<div><b>Mô hình hạt</b></div><small>Chạm vào từng hộp để xem cách sắp xếp và chuyển động của các hạt.</small>`;
      const N=S.ng;return `<div><b>Ngưng tụ</b></div><small>${!N.on?"Hơi nước bốc lên từ cốc nước nóng. Đậy tấm kính lạnh lên miệng cốc.":N.t<1?"Hơi nước gặp tấm kính lạnh…":"Mặt dưới tấm kính đọng nhiều giọt nước: hơi nước (khí) đã ngưng tụ thành nước (lỏng)."}</small>`});
    K.timeLabel(()=>K.view==="dun"?`${fmt(S.t/60,1)} phút`:K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"lamp",p:[0,.36,.15],tip:S.on?"Chạm để tắt đèn cồn":"Chạm để đốt đèn cồn",view:"dun"},{k:"plate",p:()=>V3.add([NX,0,0],V3.add(plate.pos,[0,.03,0])),tip:"Chạm để đậy tấm kính lạnh",view:"ng"}]);
    /* trạm */if(K.station){K.station(DN,'dun');K.station(HN,'hat');K.station(NG,'ng');}
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.on=true;S.t=TEND-1;S.Q=PW*(TEND-1);S.nextRec=TEND;S.ev={nc:1,tan:1,soi:1};for(let m=0;m<=TEND;m+=60)S.pts.push([m,stateOf(PW*m).T]);K.goView("hat");for(const k in BOX)selHat(k);S.ng.on=true;S.ng.t=1;api.record({tg:"—",nd:"≈ 80",the:"khí → lỏng",ht:"Mặt dưới tấm kính đọng nhiều giọt nước (ngưng tụ)"});K.goView("dun");refresh()}};
    return K.mount(st)}
});
})();
