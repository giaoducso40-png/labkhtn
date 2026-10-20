/* K6-L-01 · Trạm đo: chiều dài, khối lượng, thời gian, nhiệt độ (SGK KHTN 6 – Kết nối tri thức, Bài 4–7) · 3D
   1. Chiều dài: đặt thước dọc theo vật, đầu vật không trùng vạch 0 → chiều dài = số chỉ ở đầu cuối − số chỉ ở đầu đầu (thước GHĐ 30 cm, ĐCNN 1 mm).
   2. Khối lượng: cân điện tử, dùng nút trừ bì (TARE) để đo khối lượng nước trong cốc.
   3. Thời gian: đồng hồ bấm giây đo thời gian viên bi lăn hết máng nghiêng; so sánh với thời gian thật (tính theo chuyển động lăn
      không trượt của viên bi: a = 5/7 · g · sin α) để thấy sai số do thao tác bấm.
   4. Nhiệt độ: nhiệt kế phòng thí nghiệm (−10 °C … 110 °C, ĐCNN 1 °C) đặt vào cốc nước, chờ ổn định rồi đọc, mắt nhìn ngang mức chất lỏng. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const g0=9.81,ANG=8*Math.PI/180,LR=.8,TTRUE=Math.sqrt(2*LR/(5/7*g0*Math.sin(ANG)));
const SPEC={
  predict:[{id:"p1",q:"Đầu bút chì đặt ở vạch 2,0 cm, đầu kia ở vạch 16,5 cm. Chiều dài bút chì là:",opts:[["ok","14,5 cm"],["16","16,5 cm"],["18","18,5 cm"]],ans:"ok",res:"Kết quả: 16,5 − 2,0 = 14,5 cm."},
    {id:"p2",q:"Dùng đồng hồ bấm giây đo thời gian rất ngắn (khoảng 1 giây) thường có sai số lớn vì:",opts:[["ok","Thời gian phản ứng của người bấm"],["dh","Đồng hồ chạy sai"],["k","Không có sai số"]],ans:"ok",res:"Kết quả: thời gian phản ứng của người khoảng 0,1 – 0,3 giây; nên đo nhiều lần, lấy giá trị trung bình."}],
  taskLead:"Làm lần lượt bốn trạm đo ở khay. Đọc kết quả rồi chọn đáp án đúng.",
  tasks:[{html:"<b>Chiều dài:</b> đọc đúng chiều dài bút chì.",done:()=>!!S.d.ok},{html:"<b>Khối lượng:</b> đo đúng khối lượng nước bằng nút trừ bì.",done:()=>!!S.m.ok},
    {html:"<b>Thời gian:</b> bấm giây 3 lần, tính giá trị trung bình.",done:()=>S.t.list.length>=3},{html:"<b>Nhiệt độ:</b> đọc đúng nhiệt độ của 2 cốc nước.",done:()=>Object.keys(S.n.ok).length>=2}],
  obs:[{id:"a",q:"Khi đọc nhiệt kế, cần:",opts:[["ok","Đặt mắt nhìn ngang với mức chất lỏng trong ống"],["tren","Nhìn từ trên xuống"],["duoi","Nhìn từ dưới lên"]],ans:"ok",why:"Nhìn xiên làm số đọc bị lệch (sai số do cách đặt mắt)."},
    {id:"b",q:"Nút TARE (trừ bì) trên cân điện tử dùng để:",opts:[["ok","Đưa số chỉ về 0 khi trên cân đã có vật chứa"],["tat","Tắt cân"],["doi","Đổi đơn vị"]],ans:"ok",why:"Nhờ đó cân chỉ khối lượng của vật cho thêm vào."},
    {id:"c",q:"Vì sao nên đo thời gian nhiều lần và lấy trung bình?",opts:[["ok","Để giảm sai số ngẫu nhiên"],["nhanh","Để đo nhanh hơn"],["k","Không cần thiết"]],ans:"ok",why:"Các sai số ngẫu nhiên lớn hơn hoặc nhỏ hơn giá trị thật bù trừ một phần cho nhau."}],
  concl:{html:`<ul class="tlist"><li>Đơn vị đo chiều dài trong hệ SI là mét (m); khối lượng: kilôgam (kg); thời gian: giây (s); nhiệt độ thường dùng: độ C (°C); trong hệ SI: kelvin (K).</li>
    <li>Cách đo chung: ước lượng giá trị cần đo → chọn dụng cụ có GHĐ, ĐCNN phù hợp → đặt dụng cụ đúng cách → đặt mắt đúng cách (vuông góc với vạch chia, ngang mức chất lỏng) → đọc và ghi kết quả theo vạch chia gần nhất.</li>
    <li>Có thể đo nhiều lần và lấy giá trị trung bình để giảm sai số.</li></ul>`,
    quiz:[{id:"q1",q:"Nhiệt độ cơ thể người bình thường khoảng:",opts:[["a","37 °C"],["b","27 °C"],["c","47 °C"]],ans:"a",why:{b:"27 °C là nhiệt độ phòng.",c:"47 °C là quá nóng."}},
      {id:"q2",q:"Ba lần bấm giây được 1,30 s; 1,22 s; 1,35 s. Giá trị trung bình là:",opts:[["a","1,29 s"],["b","1,35 s"],["c","3,87 s"]],ans:"a",why:{b:"Đó là giá trị lớn nhất.",c:"Cần chia tổng cho 3: 3,87 : 3 = 1,29 s."}}],
    done:`<h2>Hoàn thành: trạm đo</h2><p class="muted">Đo chiều dài, khối lượng, thời gian, nhiệt độ đúng cách.</p>`},
  gv:["Cho học sinh ước lượng trước khi đo.","Ở trạm thời gian, so sánh kết quả giữa các bạn để thấy sai số do phản xạ.","Lưu ý đọc nhiệt kế: chờ cột chất lỏng đứng yên."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 4 – 7)</p><ul class="tlist"><li>Đo được chiều dài, khối lượng, thời gian, nhiệt độ bằng dụng cụ thông dụng; nêu được cách đo, đơn vị đo; chỉ ra được một số thao tác sai khi đo và cách khắc phục.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 4 Đo chiều dài; Bài 5 Đo khối lượng; Bài 6 Đo thời gian; Bài 7 Thang nhiệt độ Celsius. Đo nhiệt độ.</li>
<li>Thời gian phản ứng của người và sai số khi bấm giây; chuyển động lăn trên mặt nghiêng: <a href="https://openstax.org/books/university-physics-volume-1/pages/11-1-rolling-motion" target="_blank" rel="noopener">OpenStax University Physics 1, mục 11.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Máng nghiêng dài 0,80 m, góc 8°, bi lăn không trượt (bỏ qua ma sát lăn) → thời gian thật ${"≈ "+TTRUE.toFixed(2).replace(".",",")} s. Nhiệt độ các cốc nước, khối lượng cốc và nước là số của mô hình.</li></ul>`;

let S;
LabKHTN.register("K6-L-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"dl",t:"Đại lượng"},{k:"dc",t:"Dụng cụ"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Trạm đo 3D: chiều dài, khối lượng, thời gian, nhiệt độ",legend:{w:290},bench:[3,1.1],seed:12,
      views:{dai:{t:[-.98,.02,.045],yaw:0,pitch:1.3,rad:.14,label:"Chiều dài",icon:IC.grid},kl:{t:[-.35,.07,0],yaw:.12,pitch:.42,rad:.33,label:"Khối lượng",icon:IC.beaker},tg:{t:[.45,.12,0],yaw:-.1,pitch:.3,rad:.5,label:"Thời gian",icon:IC.play},nd:{t:[1.15,.12,0],yaw:-.1,pitch:.12,rad:.24,label:"Nhiệt độ",icon:IC.thermo}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    const rnd=Math.random;
    const L0=2.0,LP=+(10+Math.round(rnd()*70)/10).toFixed(1);   /* chiều dài bút chì (cm), đặt từ vạch 2,0 */
    const MC=+(80+Math.round(rnd()*120)/10).toFixed(1),MW=+(110+Math.round(rnd()*600)/10).toFixed(1);
    const TEMPS=[{t:"Cốc nước đá",v:3+Math.round(rnd()*3)},{t:"Cốc nước để lâu trong phòng",v:25+Math.round(rnd()*5)},{t:"Cốc nước ấm",v:45+Math.round(rnd()*15)}];
    S={d:{ok:false},m:{cup:false,tare:0,water:false,ok:false},t:{run:false,tt:0,ball:null,list:[],sw:0},n:{cup:-1,T:25,ok:{}},recs:0};
    const rec=(dl,dc,kq)=>{S.recs++;api.record({lan:String(S.recs),dl,dc,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const texM=(tex,key)=>({type:"unlit",color:"#FFFFFF",key,hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}});
    const H=G.hex;
    /* ---------- 1. thước + bút chì ---------- */
    const DX=-1;const rc=document.createElement("canvas");rc.width=2048;rc.height=160;{const g=rc.getContext("2d");g.fillStyle="#FDF6E3";g.fillRect(0,0,2048,160);g.fillStyle="#111";
      for(let mm=0;mm<=300;mm++){const x=24+mm/300*2000;const L=mm%10===0?70:mm%5===0?48:30;g.fillRect(x-1.2,0,2.4,L);if(mm%10===0){g.font="700 30px system-ui";g.textAlign="center";g.fillText(String(mm/10),x,112)}}g.font="700 22px system-ui";g.textAlign="left";g.fillText("cm",1990,148)}
    const ruler=root.add(new G.Node());ruler.pos=[DX,0,.05];ruler.add(R.mesh(G.box(.32,.003,.04,.001,1),{color:"#FDF6E3",rough:.6})).pos=[0,.0015,0];const rt=ruler.add(R.mesh(G.plane(.3133,.04),texM(R.tex2D(rc,{mip:true}),"ruler")));rt.pos=[.0015,.0032,0];
    const x0r=DX-.3133/2+.3133*(24/2048);const xcm=c=>x0r+c/30*.3133*(2000/2048);
    const pen=root.add(new G.Node());const PL=LP/100;pen.pos=[xcm(L0),.006,.035];pen.quat=Q.euler(0,0,-Math.PI/2);
    pen.add(R.mesh(G.cylinder(.0045,PL*.82,6),{color:"#FACC15",rough:.5})).pos=[0,PL*.06,0];pen.add(R.mesh(G.cylinder(.0046,PL*.06,12),{color:"#F472B6",rough:.7}));pen.add(R.mesh(G.lathe([[.0045,0],[.0012,PL*.1],[0,PL*.12]],12),{color:"#E7C89A",rough:.6})).pos=[0,PL*.88,0];
    /* ---------- 2. cân điện tử ---------- */
    const MX=-.35;const sc=root.add(new G.Node());sc.pos=[MX,0,0];sc.add(R.mesh(G.box(.2,.035,.18,.012,2),{color:"#E5E7EB",rough:.4})).pos=[0,.0175,0];const plate=sc.add(R.mesh(G.cylinder(.075,.006,40),{color:"#CBD5E1",metal:.85,rough:.25}));plate.pos=[0,.035,-.01];
    const lc=document.createElement("canvas");lc.width=320;lc.height=100;const lt=R.tex2D(lc);let lastL="";function lcd(t){if(t===lastL)return;lastL=t;const g=lc.getContext("2d");g.fillStyle="#9DB59A";g.fillRect(0,0,320,100);g.fillStyle="#1C2A1C";g.font="700 64px 'Courier New',monospace";g.textAlign="right";g.fillText(t,260,74);g.font="700 34px system-ui";g.fillText("g",305,74);lt.update(lc)}
    const scr=sc.add(R.mesh(G.plane(.09,.028),texM(lt,"lcd")));scr.pos=[0,.0355,.07];lcd("0.0");
    const cup=sc.add(new G.Node());cup.add(R.mesh(G.lathe([[0,0],[.035,0],[.04,.075],[.042,.078],[0,.078]],32),{type:"glass",color:"#E0F2FE",alpha:.4}));const water=cup.add(R.mesh(G.cylinder(.034,1,32),{color:"#93C5FD",alpha:.55,transparent:true,rough:.05}));water.scl=[1,.0001,1];water.pos=[0,.003,0];cup.pos=[.25,0,.02];
    const jug=sc.add(new G.Node());jug.add(R.mesh(G.lathe([[0,0],[.045,0],[.05,.12],[.035,.14],[0,.14]],30),{type:"glass",color:"#E0F2FE",alpha:.4}));jug.add(R.mesh(G.cylinder(.044,.09,30),{color:"#93C5FD",alpha:.5,transparent:true})).pos=[0,.004,0];jug.pos=[-.24,0,.02];
    const reading=()=>{const m=S.m;return (m.cup?MC:0)+(m.water?MW:0)-m.tare};
    /* ---------- 3. máng nghiêng + bi + đồng hồ bấm giây ---------- */
    const TX=.45;const ramp=root.add(new G.Node());ramp.pos=[TX-LR/2*Math.cos(ANG),0,0];
    const rN=ramp.add(new G.Node());rN.pos=[0,.012+LR*Math.sin(ANG),0];rN.quat=Q.euler(0,0,-ANG);
    rN.add(R.mesh(G.box(LR+.05,.012,.06,.003,2),{color:"#9CA3AF",metal:.6,rough:.35})).pos=[LR/2,-.006,0];for(const z of [-.022,.022])rN.add(R.mesh(G.box(LR+.05,.012,.006,.002,1),{color:"#6B7280",metal:.6,rough:.35})).pos=[LR/2,.004,z];
    for(const [f,c] of [[0,"#16A34A"],[1,"#DC2626"]]){rN.add(R.mesh(G.box(.006,.03,.07,.002,1),{color:c,rough:.5})).pos=[f*LR,.015,0]}
    ramp.add(R.mesh(G.box(.05,LR*Math.sin(ANG)+.01,.06,.003,2),{color:"#78716C",rough:.7})).pos=[0,(LR*Math.sin(ANG)+.01)/2,0];
    const ball=rN.add(R.mesh(G.sphere(.012,24,16),{color:"#E5E7EB",metal:.9,rough:.15}));ball.pos=[.0,.012,0];
    const sw=root.add(new G.Node());sw.pos=[TX+.1,0,.2];sw.add(R.mesh(G.cylinder(.05,.016,36),{color:"#111827",rough:.4}));const swc=document.createElement("canvas");swc.width=256;swc.height=96;const swt=R.tex2D(swc);let lastS="";
    function swSet(t){const s=t.toFixed(2).replace(".",",");if(s===lastS)return;lastS=s;const g=swc.getContext("2d");g.fillStyle="#9DB59A";g.fillRect(0,0,256,96);g.fillStyle="#1C2A1C";g.font="700 60px 'Courier New',monospace";g.textAlign="center";g.fillText(s,128,72);swt.update(swc)}
    const sws=sw.add(R.mesh(G.plane(.07,.026),texM(swt,"sw")));sws.pos=[0,.0165,0];swSet(0);
    /* ---------- 4. nhiệt kế + cốc nước ---------- */
    const NX=1.15;const cups=TEMPS.map((tp,i)=>{const n=root.add(new G.Node());n.pos=[NX-.18+i*.18,0,0];n.add(R.mesh(G.lathe([[0,0],[.045,0],[.05,.11],[.053,.114],[0,.114]],32),{type:"glass",color:"#E0F2FE",alpha:.4}));
      n.add(R.mesh(G.cylinder(.043,.08,32),{color:i===2?"#BFDBFE":"#93C5FD",alpha:.5,transparent:true})).pos=[0,.004,0];if(i===0)for(let k=0;k<5;k++)n.add(R.mesh(G.box(.02,.02,.02,.004,1),{color:"#F8FAFC",alpha:.7,transparent:true})).pos=[Math.cos(k*1.3)*.02,.07,Math.sin(k*1.3)*.02];return n});
    const th=root.add(new G.Node());th.add(R.mesh(G.cylinder(.004,.28,12),{type:"glass",color:"#F8FAFC",alpha:.55}));th.add(R.mesh(G.sphere(.0055,12,8),{color:"#DC2626",rough:.3}));const col=th.add(R.mesh(G.cylinder(.0014,1,6),{color:"#DC2626",rough:.3}));
    const tc=document.createElement("canvas");tc.width=64;tc.height=1024;{const g=tc.getContext("2d");g.fillStyle="#FFFFFF";g.fillRect(0,0,64,1024);g.fillStyle="#111";g.font="700 18px system-ui";for(let T=-10;T<=110;T++){const y=1004-(T+10)/120*960;g.fillRect(0,y,T%10===0?28:T%5===0?20:12,2);if(T%10===0)g.fillText(String(T),30,y+6)}}
    const tvp=G.plane(.018,.25);{const P=tvp.pos,N=tvp.nrm;for(let i=0;i<P.length;i+=3){const px=P[i],pz=P[i+2];P[i]=px;P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}}
    const tsc=th.add(R.mesh(tvp,texM(R.tex2D(tc,{mip:true}),"therm")));tsc.pos=[.012,.155,0];
    const yT=T=>.155-.125+(T+10)/120*.25*(960/1024)+.25*(20/1024);   /* chiều cao cột ứng với nhiệt độ T */
    const TH0=[NX-.15,.007,.13];th.pos=TH0.slice();let thA=Math.PI/2;th.quat=Q.euler(0,0,-thA);
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame((dt,rdt)=>{tk+=dt;if(tk>.2){tk=0;K.updateInfo()}const m=S.m;cup.pos=m.cup?[0,.038,-.01]:[.25,0,.02];water.scl=[1,m.water?.055:.0001,1];lcd(fmt(Math.max(0,reading()),1).replace(",","."));
      const T=S.t;if(T.ball){T.ball.t+=dt;const s=Math.min(LR,.5*(5/7*g0*Math.sin(ANG))*T.ball.t*T.ball.t);ball.pos=[s,.012,0];ball.quat=Q.euler(0,0,-s/.012);if(s>=LR&&!T.ball.end)T.ball.end=T.ball.t}
      if(T.run){T.sw+=dt}swSet(T.sw);
      const N=S.n;if(N.cup>=0){const tgt=TEMPS[N.cup].v;N.T+=(tgt-N.T)*Math.min(1,dt*.9);th.pos=V3.lerp(th.pos,V3.add(cups[N.cup].pos,[0,.025,0]),Math.min(1,dt*4));thA+=(0-thA)*Math.min(1,dt*5)}else{N.T+=(25-N.T)*Math.min(1,dt*.9);th.pos=V3.lerp(th.pos,TH0,Math.min(1,dt*4));thA+=(Math.PI/2-thA)*Math.min(1,dt*5)}th.quat=Q.euler(0,0,-thA);
      const top=yT(N.T);col.scl=[1,Math.max(.002,top),1]});
    const opts=(v,d,f)=>{const a=[v,+(v+d).toFixed(f),+(v-d).toFixed(f)];return a.sort(()=>rnd()-.5)};
    let dOpts=opts(LP,2.0,1),mOpts=[MW,+(MW+MC).toFixed(1),MC].sort(()=>rnd()-.5);
    K.dockFn(()=>{const v=K.view;
      if(v==="dai")return[{grid:dOpts.map(x=>({k:"dai",v:String(x),label:`${fmt(x,1)} cm`,icon:"",dis:S.d.ok}))}];
      if(v==="kl"){const m=S.m;return[{grid:[{k:"cup",label:m.cup?"Nhấc cốc ra":"Đặt cốc lên cân",icon:IC.beaker,dis:m.water},{k:"tare",label:"Nhấn TARE (trừ bì)",icon:IC.reset,dis:!m.cup},{k:"pour",label:"Rót nước vào cốc",icon:IC.drop,dis:!m.cup||m.water},{k:"mr",label:"Làm lại",icon:IC.reset}]},
        {grid:mOpts.map(x=>({k:"mw",v:String(x),label:`Nước: ${fmt(x,1)} g`,icon:"",dis:!m.water||m.ok}))}]}
      if(v==="tg"){const T=S.t;return[{k:"drop",label:"Thả viên bi",icon:IC.play,dis:!!(T.ball&&!T.ball.end)},{grid:[{k:"sw",v:"start",label:"Bấm: chạy",icon:"",dis:T.run},{k:"sw",v:"stop",label:"Bấm: dừng",icon:"",dis:!T.run},{k:"sw",v:"reset",label:"Đưa về 0",icon:IC.reset,dis:T.run}]},{k:"save",label:"Ghi lần đo",icon:IC.pen,dis:T.run||T.sw===0}]}
      const N=S.n;return[{grid:TEMPS.map((tp,i)=>({k:"cupT",v:String(i),label:tp.t,icon:"",on:N.cup===i}))},{grid:N.cup>=0?[TEMPS[N.cup].v-2,TEMPS[N.cup].v,TEMPS[N.cup].v+3].map(x=>({k:"rt",v:String(x),label:`${x} °C`,icon:"",dis:!!N.ok[N.cup]})):[]}]});
    K.onDock((k,v)=>{const m=S.m,T=S.t,N=S.n;
      if(k==="dai"){if(+v===LP){S.d.ok=true;rec("Chiều dài bút chì","thước GHĐ 30 cm, ĐCNN 1 mm",`${fmt(L0+LP,1)} − ${fmt(L0,1)} = ${fmt(LP,1)} cm`)}else api.toast(`Đầu bút chì ở vạch ${fmt(L0,1)} cm, không phải vạch 0. Lấy số chỉ đầu kia trừ ${fmt(L0,1)}.`,"warn",2600)}
      else if(k==="cup"){m.cup=!m.cup;if(!m.cup)m.tare=0}else if(k==="tare"){m.tare=(m.cup?MC:0)+(m.water?MW:0)}else if(k==="pour"){m.water=true}else if(k==="mr"){Object.assign(m,{cup:false,tare:0,water:false})}
      else if(k==="mw"){if(+v===MW){m.ok=true;rec("Khối lượng nước","cân điện tử, nút trừ bì",`cốc ${fmt(MC,1)} g (trừ bì) → nước ${fmt(MW,1)} g`)}else api.toast(m.tare>0?"Cân đã trừ bì: số chỉ chính là khối lượng nước.":"Chưa trừ bì: số chỉ gồm cả khối lượng cốc.","warn",2400)}
      else if(k==="drop"){T.ball={t:0,end:null};ball.pos=[0,.012,0]}else if(k==="sw"){if(v==="start"){T.run=true;T.tStart=T.ball?T.ball.t:null}else if(v==="stop")T.run=false;else T.sw=0}
      else if(k==="save"){T.list.push(+T.sw.toFixed(2));const avg=T.list.reduce((a,b)=>a+b,0)/T.list.length;rec("Thời gian bi lăn hết máng",`đồng hồ bấm giây (lần ${T.list.length})`,`${fmt(T.sw,2)} s · trung bình ${fmt(avg,2)} s · thời gian thật ≈ ${fmt(TTRUE,2)} s`);T.sw=0}
      else if(k==="cupT"){N.cup=+v}else if(k==="rt"){const i=N.cup;if(Math.abs(N.T-TEMPS[i].v)>.6){api.toast("Chờ cột chất lỏng đứng yên rồi mới đọc.","warn",2000)}else if(+v===TEMPS[i].v){N.ok[i]=1;rec("Nhiệt độ",`nhiệt kế (−10 … 110 °C, ĐCNN 1 °C) – ${TEMPS[i].t.toLowerCase()}`,`${TEMPS[i].v} °C`)}else api.toast("Đọc lại vạch ngang mức chất lỏng (mỗi vạch nhỏ 1 °C).","warn",2200)}refresh()});
    K.label("Đầu bút chì ở vạch 2,0 cm",[xcm(L0),.008,.035],{view:"dai",dir:"sw",len:30});K.label("Đầu kia",[xcm(L0+LP),.008,.035],{view:"dai",dir:"se",len:30});
    K.label("Nút TARE",[MX-.06,.03,.08],{view:"kl",dir:"sw",len:30});K.label("Màn hình cân",[MX,.036,.07],{view:"kl",dir:"s",len:20});
    K.label("Vạch xuất phát",[TX-LR/2*Math.cos(ANG),.012+LR*Math.sin(ANG)+.03,0],{view:"tg",dir:"n",len:20});K.label("Vạch đích",[TX+LR/2*Math.cos(ANG),.04,0],{view:"tg",dir:"ne",len:20});K.label("Đồng hồ bấm giây",[TX+.1,.02,.2],{view:"tg",dir:"e",len:30});
    K.label("Nhiệt kế",()=>V3.add(th.pos,[.2*Math.sin(thA),.2*Math.cos(thA)+.01,0]),{view:"nd",dir:"n",len:20});
    K.infoFn(()=>{const v=K.view;if(v==="dai")return `<div><b>Đo chiều dài bút chì</b></div><div>Thước: GHĐ 30 cm · ĐCNN 1 mm</div><small>Đầu bút chì đặt ở vạch ${fmt(L0,1)} cm. Nhìn vuông góc với thước, đọc vạch gần nhất ở đầu kia.</small>`;
      if(v==="kl"){const m=S.m;return `<div><b>Đo khối lượng nước</b></div><div>Số chỉ cân: ${fmt(Math.max(0,reading()),1)} g ${m.tare?"(đã trừ bì)":""}</div><small>Đặt cốc → nhấn TARE → rót nước → đọc số chỉ.</small>`}
      if(v==="tg"){const T=S.t;return `<div><b>Đo thời gian bi lăn</b></div><div>Đồng hồ: ${fmt(T.sw,2)} s ${T.run?"(đang chạy)":""}</div>${T.list.length?`<div>Các lần đo: ${T.list.map(x=>fmt(x,2)).join("; ")} s</div>`:""}<small>Bấm “chạy” khi bi bắt đầu lăn, “dừng” khi bi chạm vạch đích.</small>`}
      const N=S.n;return `<div><b>Đo nhiệt độ</b></div><div>${N.cup>=0?TEMPS[N.cup].t:"Chọn cốc nước"}</div><small>Nhiệt kế: −10 °C … 110 °C, ĐCNN 1 °C. Chờ cột chất lỏng đứng yên, mắt nhìn ngang mức chất lỏng.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* trạm */if(K.station){K.station(ramp,'tg');K.station(sw,'tg');;}
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"cup",p:()=>V3.add([MX,0,0],V3.add(cup.pos,[0,.095,0])),tip:S.m.cup?"Chạm để nhấc cốc ra":"Chạm để đặt cốc lên cân",view:"kl"},{k:"tare",p:[MX-.06,.03,.08],tip:"Chạm nút TARE (trừ bì)",view:"kl"},{k:"pour",p:[MX-.24,.16,.02],tip:"Chạm để rót nước vào cốc",view:"kl"},{k:"drop",p:[TX-LR/2*Math.cos(ANG),.012+LR*Math.sin(ANG)+.04,0],tip:"Chạm để thả viên bi",view:"tg"},{k:"sw",v:S.t.run?"stop":"start",p:[TX+.1,.03,.2],tip:S.t.run?"Chạm để bấm dừng đồng hồ":"Chạm để bấm chạy đồng hồ",view:"tg"},...TEMPS.map((tp,i)=>({k:"cupT",v:String(i),p:V3.add(cups[i].pos,[0,.13,0]),tip:"Chạm để nhúng nhiệt kế vào "+tp.t.toLowerCase(),view:"nd"}))]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K._dockH("dai",String(LP));K._dockH("cup");K._dockH("tare");K._dockH("pour");K._dockH("mw",String(MW));for(let i=0;i<3;i++){S.t.sw=TTRUE+(i-1)*.08;K._dockH("save")}for(const i of [0,2]){S.n.cup=i;S.n.T=TEMPS[i].v;K._dockH("rt",String(TEMPS[i].v))}}};
    return K.mount(st)}
});
})();
