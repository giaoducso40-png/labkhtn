/* K8-H-05 · Tốc độ phản ứng và chất xúc tác (SGK KHTN 8 – Kết nối tri thức, Bài 7) · 3D
   Bốn trạm theo bốn thí nghiệm của bài, mỗi trạm hai ống/cốc chỉ khác nhau một yếu tố:
   A. Nồng độ: đinh sắt trong HCl 0,1 M và 1 M.        B. Nhiệt độ: viên C sủi trong nước lạnh và nước nóng.
   C. Diện tích bề mặt: đá vôi dạng viên và dạng bột trong HCl 0,1 M.   D. Chất xúc tác: H2O2 3% không và có MnO2; thử khí bằng que đóm còn tàn đỏ.
   Thể tích khí sinh ra tính theo mô hình tốc độ (giả định minh họa, xem tab Nguồn); vẽ đồ thị V(khí) theo thời gian của hai ống. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D;
const fmt=C.fmt,H=G.hex;

/* ---------- mô hình tốc độ (minh họa) ---------- */
const VM=24;                        /* mL khí ứng với 1 mmol ở khoảng 20 °C, 1 atm */
const ST={
  A:{ten:"Nồng độ",tube:["HCl 0,1 M","HCl 1 M"],gas:"H₂",eq:"Fe + 2HCl → FeCl₂ + H₂↑",Vsol:5,c:[.1,1],k:.08,
     viec:"Thả đinh sắt vào hai ống",kl:"Nồng độ chất phản ứng lớn hơn thì phản ứng xảy ra nhanh hơn"},
  B:{ten:"Nhiệt độ",tube:["Nước lạnh ~10 °C","Nước nóng ~60 °C"],gas:"CO₂",eq:"viên C sủi tan, giải phóng khí CO₂",T:[10,60],Vmax:60,k20:.09,
     viec:"Thả viên C sủi vào hai cốc",tRec:30,kl:"Nhiệt độ cao hơn thì phản ứng xảy ra nhanh hơn"},
  C:{ten:"Diện tích bề mặt",tube:["Đá vôi dạng viên","Đá vôi dạng bột"],gas:"CO₂",eq:"CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O",Vsol:3,c0:.1,area:[1,12],k:.1,
     viec:"Rót HCl 0,1 M vào hai ống",kl:"Diện tích bề mặt tiếp xúc lớn hơn (dạng bột) thì phản ứng xảy ra nhanh hơn"},
  D:{ten:"Chất xúc tác",tube:["H₂O₂ 3%","H₂O₂ 3% + MnO₂"],gas:"O₂",eq:"2H₂O₂ → 2H₂O + O₂↑ (xúc tác MnO₂)",n0:2.65,k:[.00004,.08],
     viec:"Thêm một ít MnO₂ vào ống 2",kl:"Chất xúc tác (MnO₂) làm phản ứng xảy ra nhanh hơn; sau phản ứng MnO₂ vẫn còn nguyên"}};
const kB=T=>ST.B.k20*Math.pow(1.3,(T-20)/10);
const cl01=x=>x<0?0:x>1?1:x,easeIn=x=>x*x,easeOut=x=>1-(1-x)*(1-x);
/* mức tiếp xúc chất phản ứng ngay sau khi bắt đầu: vật rắn đang rơi xuống, hoặc acid đang được rót vào (trạm C) */
function contact(s,t){return s==="A"?cl01((t-.55)/.1):s==="B"?cl01((t-.6)/.1):s==="C"?cl01((t-.3)/.9):cl01((t-.6)/.3)}
function newRun(){return{on:false,t:0,V:[0,0],x:[0,0],fin:[null,null],hist:[[[0,0]],[[0,0]]],rec:false,recFin:false}}
/* tốc độ thoát khí (mL/s) của ống i ở trạm s */
function rate(s,R,i){const P=ST[s];
  if(s==="A"){const c=Math.max(0,(P.c[i]*P.Vsol-2*R.V[i]/VM)/P.Vsol);return P.k*c}
  if(s==="B"){const m=Math.max(0,1-R.x[i]);return m>1e-4?P.Vmax*kB(P.T[i])*Math.pow(m,2/3)/3:0}
  if(s==="C"){const c=Math.max(0,(P.c0*P.Vsol-2*R.V[i]/VM)/P.Vsol);return P.k*P.area[i]*c}
  const n=Math.max(0,P.n0-2*R.V[i]/VM);return P.k[i]*n*VM/2}

const GV=`<p><b>Yêu cầu cần đạt</b> (trích mục tiêu Bài 7)</p>
<ul class="tlist"><li>Nêu được khái niệm tốc độ phản ứng và chất xúc tác.</li><li>Tiến hành được thí nghiệm, quan sát và so sánh tốc độ phản ứng; trình bày được các yếu tố ảnh hưởng: nồng độ, nhiệt độ, diện tích bề mặt tiếp xúc, chất xúc tác.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức</b></p>
<ul class="tlist"><li>Mỗi nhóm một trạm; trước khi bấm bắt đầu, nhóm dự đoán ống nào sủi khí mạnh hơn.</li><li>Nhắc nguyên tắc so sánh công bằng: hai ống chỉ khác nhau đúng một yếu tố.</li><li>Dùng đồ thị V khí theo thời gian: đường dốc hơn là phản ứng nhanh hơn.</li></ul>
<p style="margin-top:10px"><b>An toàn khi làm thật</b></p>
<ul class="tlist"><li>HCl, H₂O₂ gây kích ứng da và mắt: đeo kính, găng tay. Không dùng nước sôi; cầm cốc nước nóng bằng kẹp.</li></ul>`;
const SRC=`<ul class="tlist">
<li>Bốn thí nghiệm của bài (HCl 0,1 M và 1 M với đinh sắt; viên C sủi trong nước lạnh và nước nóng; đá vôi dạng bột và dạng viên với HCl 0,1 M; H₂O₂ 3% không và có MnO₂), quan sát và khái niệm tốc độ phản ứng, chất xúc tác: <a href="https://minio.ftech.ai/fs-landing/KHTN_8_Ket_noi_Bai_7_7f9a55f99b.pdf" target="_blank" rel="noopener">tài liệu bài dạy KHTN 8 KNTT Bài 7</a>.</li>
<li>H₂O₂ phân hủy nhanh, sủi bọt mạnh khi có MnO₂; oxygen làm que đóm còn tàn đỏ bùng cháy; chất xúc tác được thu hồi nguyên vẹn: <a href="https://www.chemguide.co.uk/14to16/air/making.html" target="_blank" rel="noopener">Chemguide – making oxygen</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình (minh họa, không phải số đo)</b></p>
<ul class="tlist"><li>1 mmol khí chiếm khoảng 24 mL (khoảng 20 °C, 1 atm).</li>
<li>Trạm A: tốc độ tỉ lệ với nồng độ HCl còn lại; 5 mL dung dịch mỗi ống. Trạm C: tốc độ tỉ lệ với diện tích bề mặt (bột lớn gấp 12 lần viên) và nồng độ HCl; 3 mL HCl 0,1 M là chất hết trước, tối đa khoảng 3,6 mL CO₂.</li>
<li>Trạm B: viên C sủi tan dần từ bề mặt, tốc độ tăng khoảng 1,3 lần khi nước nóng thêm 10 °C (giả định chọn để minh họa: ở ~60 °C viên tan hết sau khoảng 30 giây, ở ~10 °C sau khoảng 2 phút); tổng khí khoảng 60 mL.</li>
<li>Trạm D: 3 mL H₂O₂ 3% ≈ 2,65 mmol, tối đa khoảng 32 mL O₂; không có MnO₂ thì phân hủy rất chậm ở nhiệt độ phòng.</li>
<li>Số bọt khí vẽ trên màn hình tăng theo tốc độ thoát khí, không phải số bọt thật.</li></ul>`;

LabKHTN.register("K8-H-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"yt",t:"Yếu tố"},{k:"o1",t:"Ống 1"},{k:"o2",t:"Ống 2"},{k:"kl",t:"Nhận xét"}],empty:"Kết quả mỗi trạm tự ghi vào bảng sau 60 giây (trạm nhiệt độ: 30 giây)."},
  gv:GV,sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Bàn thí nghiệm 3D về tốc độ phản ứng: bốn cặp ống nghiệm và cốc so sánh nồng độ, nhiệt độ, diện tích bề mặt, chất xúc tác");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,simT=0,view="A",bodyEl=null,stepIdx=0,frameN=0;
    const rnd=C.rng(5521);
    const S={p1:null,p2:null,locked:false,obs:{},q:{},finished:false,recs:0,run:{A:newRun(),B:newRun(),C:newRun(),D:newRun()},splint:null,splintRes:[null,null]};
    const rec=(yt,o1,o2,kl)=>{S.recs++;api.record({lan:String(S.recs),yt,o1,o2,kl})};

    /* ================= cảnh ================= */
    const root=new G.Node();root.add(K3.bench(R,9.2,3.6,day));
    const wood={color:"#9C6B3F",rough:.55,key:"wood",hooks:{fu:K3.NOISE+"uniform float uNF;",fs:`{float g=vn(vec3(vO.x*3.,vO.y*40.,vO.z*3.))*.6+vn(vO*18.)*.4;base.rgb*=.8+.35*g;}`},uniforms:{uNF:1}};
    const SX={A:-3.0,B:-1.0,C:1.0,D:3.0},DX=[-.25,.25],TB={r:.12,h:1.05,lvl:.6};
    const LIQ=H("#CFE2F5");
    function rack2(x){const n=root.add(new G.Node());n.pos=[x,0,0];
      n.add(R.mesh(G.box(.95,.05,.4,.02,2),wood)).pos=[0,.025,0];n.add(R.mesh(G.box(.95,.05,.4,.02,2),wood)).pos=[0,.3,0];
      for(const sx of [-.45,.45])n.add(R.mesh(G.box(.05,.3,.4,.012,2),wood)).pos=[sx,.16,0];return n}
    const tubes={};
    for(const s of ["A","C","D"]){rack2(SX[s]);tubes[s]=DX.map(dx=>{const n=root.add(new G.Node());n.pos=[SX[s]+dx,.05,0];n.add(K3.testTube(R,TB.r,TB.h));
      const liq=n.add(R.mesh(K3.liquidGeom(TB.r-.013,.013,TB.lvl,true),{color:LIQ,alpha:.44,rough:.04,coat:.6,order:1}));return{n,liq}})}
    /* trạm B: hai cốc nước lạnh / nóng */
    const cupsB=DX.map((dx,i)=>{const n=root.add(new G.Node());n.pos=[SX.B+dx*1.55,0,0];n.add(K3.glass(R,.3,.6,{lip:.02}));
      const liq=n.add(R.mesh(K3.liquidGeom(.28,.03,.38,false),{color:i?H("#F2C8A8"):H("#A9D3F7"),alpha:.4,rough:.04,coat:.6,order:1}));return{n,liq}});
    const iceB=[0,1,2].map(i=>{const n=root.add(R.mesh(G.box(.08,.07,.08,.014,2),{type:"glass",color:"#F2FAFF",alpha:.7}));return n});
    const steamB=root.add(K3.puffs(R,60,"#FFFFFF"));
    /* nhiệt kế trong mỗi cốc: cột chất lỏng đỏ dài theo nhiệt độ (thang 0–100 °C) */
    cupsB.forEach((c,i)=>{const t=c.n.add(new G.Node());t.pos=[.17,.045,-.12];t.quat=G.Q.euler(0,0,-.12);
      t.add(R.mesh(G.cylinder(.016,.62,16),{type:"glass",color:"#E8F2FF",alpha:.5}));t.add(R.mesh(G.sphere(.024,14,10),{color:"#D7262E",rough:.3,coat:.6})).pos=[0,.012,0];
      t.add(R.mesh(G.cylinder(.006,.04+.5*ST.B.T[i]/100,8),{type:"unlit",color:"#E0323A"})).pos=[0,.02,0];
      for(let k=0;k<=10;k++)t.add(R.mesh(G.box(k%5?.012:.022,.003,.003,.001,1),{type:"unlit",color:"#3A4150"})).pos=[.018,.06+.05*k,0]});
    /* vật rắn: đinh sắt, viên sủi, đá vôi viên, đá vôi bột, MnO2 */
    const nails=DX.map(()=>{const n=root.add(R.mesh(K3.pieceGeom("nail"),{color:"#8A8F96",rough:.45,metal:.9}));n.visible=false;return n});
    const tabs=DX.map(()=>{const n=root.add(R.mesh(G.cylinder(.11,.045,32),{color:"#F4F1E8",rough:.75}));n.visible=false;return n});
    const lumps=[0,1,2].map(i=>{const n=root.add(R.mesh(K3.pieceGeom("granule"),{color:"#E7E3D8",rough:.85}));n.visible=false;n.scl=[.9,.9,.9];return n});
    const powder=root.add(R.instanced(G.sphere(1,8,6),{color:"#ECE8DF",rough:.9},260));
    const mno2=root.add(R.instanced(G.sphere(1,8,6),{color:"#1C1C1F",rough:.8},200));
    const PW=Array.from({length:260},()=>({a:rnd()*6.283,r:Math.sqrt(rnd())*.085,y:rnd()*.06,s:.007+rnd()*.006,ph:rnd()*6.28}));
    /* bóng cao su chụp miệng ống: cổ bóng cố định, bầu bóng phồng theo thể tích khí */
    /* bầu bóng hình giọt nước, đáy thu nhỏ lồng vào cổ bóng */
    const bulbG=G.lathe([[.001,-.02],[.42,0],[.5,.15],[.7,.35],[.88,.6],[.98,.9],[1,1.15],[.95,1.45],[.8,1.72],[.55,1.92],[.28,2.03],[.001,2.06]],32);
    const balloons={};for(const s of ["A","C"])balloons[s]=DX.map((dx,i)=>{const col=i?"#3B82F6":"#E5484D";
      const neck=root.add(R.mesh(G.cylinder(TB.r+.016,.1,24),{color:col,rough:.4,coat:.5}));neck.pos=[SX[s]+dx,.05+TB.h-.06,0];
      const bulb=root.add(R.mesh(bulbG,{color:col,rough:.32,coat:.7,alpha:.96}));return{neck,bulb}});
    const fizz=root.add(K3.bubbles(R,1200));const foam=root.add(K3.puffs(R,160,"#F4F6FA"));
    /* que đóm trạm D */
    /* que đóm: đầu tàn đỏ ở gốc (0,0,0), thân chéo lên phía phải, ra ngoài miệng ống */
    const splint=root.add(new G.Node());splint.add(R.mesh(G.cylinder(.016,.9,10),{color:"#D9B37A",rough:.7})).quat=G.Q.euler(0,0,-.55);splint.visible=false;
    const ember=splint.add(R.mesh(G.sphere(.024,10,8),{type:"unlit",color:"#FF7A2A"}));ember.pos=[0,0,0];
    const charr=splint.add(R.mesh(G.cylinder(.0175,.05,10),{color:"#2A1A12",rough:.9}));charr.quat=G.Q.euler(0,0,-.55);
    const flame=root.add(K3.flame(R,[1,.6,.15],[1,.95,.75]));flame.visible=false;

    /* nhãn */
    const LB=G.labels(over,R,{bounds:api.safe});
    const mk=(v,p,cls)=>{const it=LB.add(`<span></span>`,p,cls);it.view=v;return it};
    /* nhãn ống/cốc đặt hai bên (ống 1 bên trái, ống 2 bên phải), mũi tên chỉ vào thân ống: không vướng bóng cao su và que đóm */
    const tlab={};for(const s of ["A","B","C","D"])tlab[s]=DX.map((dx,i)=>{const it=mk(s,s==="B"?[SX.B+dx*1.55+(i?.3:-.3),.42,0]:[SX[s]+dx+(i?TB.r:-TB.r),.78,0]);it.dir=i?"e":"w";it.len=26;return it});
    const banL=["A","B","C","D"].map(s=>mk("ban",[SX[s],1.5,0]));
    const info=document.createElement("div");info.className="gl-legend glass";over.appendChild(info);

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:.05,maxPitch:1.35});
    const PRE={ban:{t:[0,.5,0],yaw:0,pitch:.5,rad:4.5}};for(const s of ["A","B","C","D"])PRE[s]={t:[SX[s],s==="B"?.5:.78,0],yaw:0,pitch:.22,rad:s==="B"?1.0:1.05};
    let safe={x:0,y:0,w:1,h:1},zoom=1;
    function fitDist(rad){const sz=R.size();const tv=Math.tan(cam.fov/2)*safe.h/sz.h,th=Math.tan(cam.fov/2)*(sz.w/sz.h)*safe.w/sz.w;return rad/Math.min(tv,th)}
    function goView(v,instant){view=v;const p=PRE[v];const to={target:p.t,yaw:p.yaw,pitch:p.pitch,dist:fitDist(p.rad)*zoom};if(instant)Object.assign(cam,{target:[...p.t],yaw:p.yaw,pitch:p.pitch,dist:to.dist});else orbit.fly(to,.9);
      for(const it of LB.items)it.on=it.view===v;refresh()}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));const sf=api.safe();const sz=R.size();safe={...sf};
      /* bảng số liệu + đồ thị chiếm một cột trái (màn rộng) hoặc một dải trên (màn hẹp): trừ khỏi vùng đặt cảnh */
      const wide=sf.w>=560;info.style.left=(sf.x+10)+"px";info.style.top=(sf.y+10)+"px";info.style.width=wide?"244px":(sf.w-20)+"px";info.style.maxWidth=wide?"244px":"none";info.classList.toggle("narrow",!wide);
      if(wide){safe.x+=254;safe.w-=254}else{const ih=118;safe.y+=ih;safe.h-=ih}
      cam.shift=[2*(safe.x+safe.w/2)/sz.w-1,1-2*(safe.y+safe.h/2)/sz.h];cam.dist=fitDist(PRE[view].rad)*zoom}
    function theme(){day=api.day;const E=R.env;
      if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=.55}
      else{E.bgTop=H("#1B2347");E.bgBot=H("#06091A");E.bgGlow=H("#2B3670");E.sky=H("#6070A0");E.gnd=H("#171B2B");E.hor=H("#3E4868");E.exposure=.8;E.ink=0}
      E.k1c=[2.1,2.0,1.85];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9];over.classList.toggle("day",day)}

    /* ================= thao tác ================= */
    function start(s){const R0=S.run[s];if(R0.on){api.toast("Trạm này đang chạy. Bấm “Làm lại” để làm từ đầu.","info",2000);return}
      S.run[s]=newRun();S.run[s].on=true;if(s==="D"){S.splintRes=[null,null]}if(view!==s)goView(s);
      api.toast({A:"Đã thả đinh sắt vào hai ống HCl và chụp bóng cao su lên miệng ống.",B:"Đã thả viên C sủi vào hai cốc.",C:"Đã rót 3 mL HCl 0,1 M vào hai ống đá vôi và chụp bóng cao su.",D:"Đã rắc một ít MnO₂ vào ống 2."}[s],"info",2400);refresh()}
    function reset(s){S.run[s]=newRun();if(s==="D"){S.splint=null;S.splintRes=[null,null]}refresh()}
    function splintTest(i){if(S.splint)return;if(view!=="D")goView("D");S.splint={i,t:0,done:false};refresh()}
    function mark(s){const R0=S.run[s];if(!R0.on)return api.toast("Bấm bắt đầu trạm này trước.","info",1800);
      rec(`${ST[s].ten} · sau ${fmt(R0.t,0)} s`,`${ST[s].tube[0]}: ${fmt(R0.V[0],1)} mL ${ST[s].gas}`,`${ST[s].tube[1]}: ${fmt(R0.V[1],1)} mL ${ST[s].gas}`,R0.V[1]>R0.V[0]*1.2?"Ống 2 thoát khí nhanh hơn":"Chưa thấy khác biệt rõ");refresh()}

    /* ================= mô phỏng ================= */
    function stepRuns(dt){
      for(const s of ["A","B","C","D"]){const R0=S.run[s];if(!R0.on)continue;R0.t+=dt;
        for(let i=0;i<2;i++){const r=rate(s,R0,i)*contact(s,R0.t);R0.V[i]+=r*dt;if(s==="B")R0.x[i]=Math.min(1,R0.V[i]/ST.B.Vmax);
          const last=R0.hist[i][R0.hist[i].length-1];if(R0.t-last[0]>=1)R0.hist[i].push([R0.t,R0.V[i]]);
          /* bọt khí */
          const n=Math.min(s==="D"?170:90,r*({A:120,B:12,C:180,D:30}[s]))*dt;const base=posBubble(s,i);
          for(let q=0;q<n+(rnd()<n%1?1:0);q++){const a=rnd()*6.283,rr=rnd()*base.spread;
            fizz.spawn([base.p[0]+Math.cos(a)*rr,base.p[1]+rnd()*base.h,base.p[2]+Math.sin(a)*rr],.006+rnd()*.012*(s==="D"&&i?1.3:1),[(rnd()-.5)*.03,.25+rnd()*.15,(rnd()-.5)*.03],base.life,.9)}
          if(s==="D"&&i&&r>.35&&rnd()<dt*25)foam.spawn([SX.D+DX[1]+(rnd()-.5)*.1,.05+TB.lvl+.02,(rnd()-.5)*.1],.03,[0,.05,0],1.2,.35,1.6)}
        const tR=ST[s].tRec||60;
        if(!R0.rec&&R0.t>=tR){R0.rec=true;const P=ST[s];
          rec(`${P.ten} (sau ${tR} s)`,`${P.tube[0]}: ${fmt(R0.V[0],1)} mL ${P.gas}`,`${P.tube[1]}: ${fmt(R0.V[1],1)} mL ${P.gas}`,P.kl);api.toast(`Trạm ${P.ten.toLowerCase()}: đã ghi kết quả sau ${tR} giây.`,"ok",2400);refresh()}
        if(s==="B"){for(let i=0;i<2;i++)if(R0.fin[i]==null&&R0.x[i]>=.999){R0.fin[i]=R0.t;api.toast(`Viên C sủi trong ${ST.B.tube[i].toLowerCase()} đã tan hết sau ${fmt(R0.t,0)} giây.`,"info",2600)}
          if(!R0.recFin&&R0.fin[0]!=null&&R0.fin[1]!=null){R0.recFin=true;rec("Nhiệt độ · thời gian viên sủi tan hết",`${ST.B.tube[0]}: ${fmt(R0.fin[0],0)} s`,`${ST.B.tube[1]}: ${fmt(R0.fin[1],0)} s`,"Trong nước nóng viên sủi tan hết nhanh hơn");refresh()}}}
      if(S.splint){const sp=S.splint;sp.t+=dt;if(sp.t>.9&&!sp.done){sp.done=true;const R0=S.run.D;const ox=R0.on?R0.V[sp.i]:0;const lit=ox>2;S.splintRes[sp.i]=lit;
          rec(`Que đóm còn tàn đỏ vào ống ${sp.i+1} (${ST.D.tube[sp.i]})`,sp.i===0?(lit?"que đóm bùng cháy":"tàn đỏ không bùng cháy"):"—",sp.i===1?(lit?"que đóm bùng cháy":"tàn đỏ không bùng cháy"):"—",lit?"Khí thoát ra là oxygen":"Chưa có đủ khí oxygen");
          api.toast(lit?"Que đóm bùng cháy: khí thoát ra là oxygen.":"Tàn đỏ không bùng cháy: hầu như chưa có oxygen thoát ra.",lit?"ok":"info",2800);refresh()}
        if(sp.t>2.6)S.splint=null}}
    function posBubble(s,i){if(s==="B"){const c=cupsB[i].n.pos;return{p:[c[0],.06,c[2]],spread:.09*Math.max(.15,Math.cbrt(1-S.run.B.x[i])),h:.03,life:1.2}}
      const x=SX[s]+DX[i];if(s==="A")return{p:[x,.08,0],spread:.03,h:.3,life:1.3};if(s==="C")return{p:[x,.07,0],spread:i?.075:.04,h:.03,life:1.4};return{p:[x,.07,0],spread:.07,h:i?.12:.01,life:1.3}}

    /* ================= vẽ ================= */
    function draw(){
      const A=S.run.A,B=S.run.B,Cc=S.run.C,D=S.run.D;
      /* đinh sắt thả từ miệng ống, chậm lại khi vào dung dịch */
      nails.forEach((n,i)=>{n.visible=A.on;const k=easeOut(cl01(A.t/.55));n.pos=[SX.A+DX[i],.08+(1.02-.08)*(1-k),0];n.quat=G.Q.euler(0,0,.12*k);n.scl=[.75,.75,.75]});
      tabs.forEach((n,i)=>{const m=1-B.x[i];n.visible=B.on&&m>.01;const c=cupsB[i].n.pos;const sc=Math.cbrt(Math.max(m,.001));const k=easeIn(cl01(B.t/.6));n.pos=[c[0],.035+(.7-.035)*(1-k),c[2]];n.scl=[sc,Math.max(.05,sc),sc]});
      cupsB[1].liq.mat.color=H("#F3CDB0");iceB.forEach((n,i)=>{const a=i*2.1+.4,c=cupsB[0].n.pos;n.pos=[c[0]+Math.cos(a)*.16,.39,c[2]+Math.sin(a)*.16];n.quat=G.Q.euler(.2*i,i,.1)});
      if(simT!==draw._t&&rnd()<.3)steamB.spawn([cupsB[1].n.pos[0]+(rnd()-.5)*.36,.42+rnd()*.1,(rnd()-.5)*.36],.035,[(rnd()-.5)*.04,.12,0],2.4,day?.22:.16,2.6);
      /* trạm C: đá vôi có sẵn trong ống khô; bấm bắt đầu thì rót HCl 0,1 M vào (mực dâng dần) */
      const fillC=Cc.on?easeOut(cl01(Cc.t/1.1)):0;tubes.C.forEach(T=>{T.liq.visible=fillC>.01;T.liq.scl=[1,Math.max(.01,fillC),1]});
      /* đá vôi: viên ở ống 1, bột ở ống 2 */
      const s1=Math.max(.6,1-Cc.V[0]/30);lumps.forEach((n,k)=>{n.visible=true;n.pos=[SX.C+DX[0]+(k-1)*.035,.07+k%2*.03,(k-1)*.02];n.scl=[.75*s1,.75*s1,.75*s1]});
      const D1=powder.data;let c=0;const swirlP=Cc.on?Math.min(1,rate("C",Cc,1)*contact("C",Cc.t)*8):0;
      for(const p of PW){if(c>=200)break;const lift=swirlP*(.05+.25*Math.abs(Math.sin(simT*2+p.ph)));D1.set([SX.C+DX[1]+Math.cos(p.a)*p.r,.06+p.y*.35+lift,Math.sin(p.a)*p.r,p.s*.8,1,1,1,1],c*8);c++}
      powder.setInstances(c);
      /* MnO2 chỉ ở ống 2 sau khi thêm */
      const D2=mno2.data;let k=0;if(D.on){const stir=Math.min(1,rate("D",D,1)*contact("D",D.t)*.6);for(let q=0;q<160;q++){const p=PW[q];const lift=stir*(.05+.3*Math.abs(Math.sin(simT*3+p.ph)));
        /* bột MnO2 rắc từ miệng ống, rơi lệch nhau theo từng hạt */const f=easeIn(cl01((D.t-p.ph*.03)/.6)),y0=.06+p.y*.3+lift;
        D2.set([SX.D+DX[1]+Math.cos(p.a)*p.r*(.3+.65*f),y0+(1.05-y0)*(1-f),Math.sin(p.a)*p.r*(.3+.65*f),p.s*.7,1,1,1,1],k*8);k++}}
      mno2.setInstances(k);
      /* bóng bay chứa khí */
      for(const s of ["A","C"])balloons[s].forEach((b,i)=>{const R0=S.run[s];const on=R0.on&&R0.t>(s==="A"?.7:1.2);b.neck.visible=b.bulb.visible=on;if(!on)return;const V=R0.V[i];const f=Math.min(1,V/(s==="A"?2:1.2));const r=.14+.045*Math.cbrt(V),ry=r*(.55+.6*f);
        b.bulb.pos=[SX[s]+DX[i],.05+TB.h+.06,0];b.bulb.scl=[r,ry,r]});
      /* que đóm */
      if(S.splint){const sp=S.splint,x=SX.D+DX[sp.i];const kk=Math.min(1,sp.t/.8);splint.visible=true;const tip=[x+.02,1.55-.5*kk,0];splint.pos=tip;
        const lit=sp.done&&S.splintRes[sp.i];ember.mat.color=lit?H("#FFE7A0"):(.6+.4*Math.sin(simT*9)>.5?H("#FF7A2A"):H("#E0501C"));flame.visible=!!lit;if(lit){flame.pos=[tip[0],tip[1]-.03,0];const f=.5+.08*Math.sin(simT*30);flame.scl=[f,f*1.2,f]}}
      else{splint.visible=false;flame.visible=false}
      /* nhãn */
      for(const s of ["A","B","C","D"])tlab[s].forEach((L,i)=>{const R0=S.run[s];const h=`<span>${ST[s].tube[i]}${R0.on?`<small>${fmt(R0.V[i],1)} mL ${ST[s].gas}</small>`:""}</span>`;if(L._h!==h){L.el.innerHTML=h;L._h=h}});
      draw._t=simT;
      banL.forEach((L,j)=>{const s="ABCD"[j];const h=`<span>${ST[s].ten}</span>`;if(L._h!==h){L.el.innerHTML=h;L._h=h}})}
    function chart(s,W,Hh){const R0=S.run[s];const tmax=Math.max(60,Math.ceil(R0.t/30)*30);const vmax=Math.max(1,...R0.hist[0].map(p=>p[1]),...R0.hist[1].map(p=>p[1]),R0.V[0],R0.V[1])*1.1;
      const px=t=>30+t/tmax*(W-38),py=v=>Hh-16-v/vmax*(Hh-32);const line=(i,col)=>`<polyline fill="none" stroke="${col}" stroke-width="2.2" points="${R0.hist[i].concat([[R0.t,R0.V[i]]]).map(p=>`${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(" ")}"/>`;
      return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" style="display:block;margin-top:4px;max-width:100%" role="img" aria-label="Đồ thị thể tích khí theo thời gian của hai ống">
        <line x1="30" y1="${Hh-16}" x2="${W-6}" y2="${Hh-16}" stroke="currentColor" stroke-opacity=".35"/><line x1="30" y1="6" x2="30" y2="${Hh-16}" stroke="currentColor" stroke-opacity=".35"/>
        <text x="${W-6}" y="${Hh-3}" font-size="8.5" text-anchor="end" fill="currentColor" opacity=".75">t (s) · 0–${tmax}</text><text x="34" y="11" font-size="8.5" fill="currentColor" opacity=".75">V (mL)</text>
        <text x="26" y="${py(vmax/1.1)+3}" font-size="8" text-anchor="end" fill="currentColor" opacity=".7">${fmt(vmax/1.1,1)}</text>
        ${line(0,"#F87171")}${line(1,"#60A5FA")}
        <rect x="${W-96}" y="4" width="8" height="8" rx="2" fill="#F87171"/><text x="${W-85}" y="11" font-size="8.5" fill="currentColor">ống 1</text><rect x="${W-50}" y="4" width="8" height="8" rx="2" fill="#60A5FA"/><text x="${W-39}" y="11" font-size="8.5" fill="currentColor">ống 2</text></svg>`}
    function updateInfo(){let h;
      if(view==="ban")h=`<div><b>Bốn yếu tố ảnh hưởng tốc độ phản ứng</b></div><small>Chọn một trạm ở khay.</small>`;
      else{const P=ST[view],R0=S.run[view],nar=info.classList.contains("narrow");const cw=nar?Math.max(200,Math.round(info.clientWidth-24)):220;
        h=`<div><b>${P.ten}</b>${nar?"":` · ${P.eq}`}</div>${R0.on?`<div>t = ${fmt(R0.t,0)} s · ống 1: ${fmt(R0.V[0],1)} mL · ống 2: ${fmt(R0.V[1],1)} mL</div>${chart(view,cw,nar?62:110)}`:`<small>${nar?P.eq+". ":""}Bấm “${P.viec}” ở khay để bắt đầu.</small>`}`}
      if(info._h!==h){info.innerHTML=h;info._h=h}}

    /* ================= con trỏ ================= */
    function pick(px,py){const r=R.ray(px,py);
      for(const s of ["A","C","D"])for(let i=0;i<2;i++){const x=SX[s]+DX[i];if(G.hit.box(r,[x-.15,0,-.15],[x+.15,1.15,.15])!=null)return{s,i}}
      for(let i=0;i<2;i++){const c=cupsB[i].n.pos;if(G.hit.box(r,[c[0]-.32,0,c[2]-.32],[c[0]+.32,.62,c[2]+.32])!=null)return{s:"B",i}}return null}
    const ptr=C.pointer(cv,{down(p,e){orbit.start(p,e.pointerId);return true},move(p,e){orbit.move(p,e.pointerId)},up(p,e,tap){orbit.end(e.pointerId);if(tap)onTap(p)},cancel(){orbit.end()},
      hover(p){if(frameN%3)return;cv.style.cursor=pick(p.x,p.y)?"pointer":"grab"}});
    function onWheel(e){e.preventDefault();zoom=C.clamp(zoom*Math.exp(e.deltaY*.0012),.45,2.4);cam.dist=fitDist(PRE[view].rad)*zoom}
    cv.addEventListener("wheel",onWheel,{passive:false});
    function onTap(p){const k=pick(p.x,p.y);if(!k)return;if(view!==k.s){goView(k.s);return}
      if(k.s==="D"&&S.run.D.on){splintTest(k.i);return}if(!S.run[k.s].on)start(k.s)}

    /* ================= khay ================= */
    const IC={
      A:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 6v22a4 4 0 0 0 8 0V6M22 6v22a4 4 0 0 0 8 0V6"/><path d="M10 20h8"/><path d="M22 14h8" stroke-width="3.2"/></svg>',
      B:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M17 26V8a3 3 0 0 1 6 0v18a6 6 0 1 1-6 0z"/><path d="M20 14v14"/></svg>',
      C:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M6 26l6-8 7 4 5-7 10 11z"/><circle cx="12" cy="31" r="1.5" fill="currentColor"/><circle cx="18" cy="32" r="1.5" fill="currentColor"/><circle cx="25" cy="31" r="1.5" fill="currentColor"/></svg>',
      D:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M14 5v24a6 6 0 0 0 12 0V5"/><circle cx="18" cy="27" r="2" fill="currentColor"/><circle cx="22" cy="22" r="1.4" fill="currentColor"/><circle cx="20" cy="17" r="1" fill="currentColor"/></svg>',
      ban:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 24h32M8 24v10M32 24v10"/><path d="M10 24v-8h6v8M22 24V12h4v12"/></svg>',
      go:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="20" cy="20" r="13"/><path d="M17 14l9 6-9 6z" fill="currentColor"/></svg>',
      splint:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 34L28 14"/><circle cx="29" cy="12" r="3" fill="#FF7A2A" stroke="none"/></svg>',
      pen:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 32l4-1 18-18-3-3-18 18z"/><path d="M8 36h24"/></svg>',
      reset:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 20a12 12 0 1 0 4-9L8 15"/><path d="M8 7v8h8"/></svg>'};
    function refreshDock(){
      const st=`<div class="tseg" role="group" aria-label="Trạm thí nghiệm">${[["A","Nồng độ"],["B","Nhiệt độ"],["C","Bề mặt"],["D","Xúc tác"],["ban","Cả bàn"]].map(([v,t])=>`<button class="titem" data-k="view" data-v="${v}" aria-pressed="${view===v}">${IC[v]}${t}</button>`).join("")}</div><hr>`;
      let it="";
      if(view!=="ban"){const R0=S.run[view];it=`<button class="titem" data-k="go" ${R0.on?"disabled":""}>${IC.go}${ST[view].viec}</button>`+(view==="D"?`<div class="tgrid"><button class="titem" data-k="spl" data-v="0" ${R0.on?"":"disabled"}>${IC.splint}Que đóm<br>ống 1</button><button class="titem" data-k="spl" data-v="1" ${R0.on?"":"disabled"}>${IC.splint}Que đóm<br>ống 2</button></div>`:"")+`<div class="tgrid"><button class="titem" data-k="mark" ${R0.on?"":"disabled"}>${IC.pen}Ghi số đo</button><button class="titem" data-k="reset">${IC.reset}Làm lại</button></div>`}
      api.dock.innerHTML=st+it}
    function onDock(e){const t=e.target.closest("[data-k]");if(!t||t.disabled)return;const k=t.dataset.k,v=t.dataset.v;
      if(k==="view"){zoom=1;goView(v)}else if(k==="go")start(view);else if(k==="spl")splintTest(+v);else if(k==="mark")mark(view);else if(k==="reset")reset(view)}
    api.dock.addEventListener("click",onDock);

    /* ================= hướng dẫn ================= */
    const doneAll=()=>["A","B","C","D"].every(s=>S.run[s].rec||doneSet.has(s));
    const doneSet=new Set();
    function refresh(){for(const s of ["A","B","C","D"])if(S.run[s].rec)doneSet.add(s);
      refreshDock();api.okAt(0,S.locked);api.okAt(1,doneAll()&&S.splintRes.some(x=>x));
      api.okAt(2,S.obs.a==="2"&&S.obs.b==="nong"&&S.obs.c==="bot"&&S.obs.d==="xt");api.okAt(3,S.finished);if(bodyEl)renderStep();info._h=null;updateInfo()}
    function renderStep(){const el=bodyEl;if(!el)return;const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      const opt=(attr,cur,arr,dis)=>`<div class="opts">${arr.map(([k,t],j)=>`<button class="opt" data-${attr}="${k}" aria-pressed="${cur===k}" ${dis?"disabled":""}><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>`;
      if(stepIdx===0){
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2"><b>Câu 1.</b> Cho đá vôi vào dung dịch HCl. Đá vôi dạng nào phản ứng nhanh hơn?</p>
          ${opt("p1",S.p1,[["vien","Dạng viên"],["bot","Dạng bột"],["nhu","Như nhau"]],S.locked)}
          <p class="lead2"><b>Câu 2.</b> Thêm MnO₂ vào dung dịch H₂O₂. Sau phản ứng, lượng MnO₂:</p>
          ${opt("p2",S.p2,[["het","Bị tiêu hao hết"],["con","Vẫn còn nguyên"],["tang","Tăng lên"]],S.locked)}
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}
          <p class="muted" style="font-size:.84rem">Kéo để xoay bàn, lăn chuột hoặc chụm hai ngón để phóng to.</p>`;
      }else if(stepIdx===1){
        const li=(ok,now,html)=>`<li class="${ok?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${html}</div></li>`;
        const d=s=>S.run[s].rec||doneSet.has(s);
        el.innerHTML=`<h3>Làm thí nghiệm</h3><p class="lead2">Mỗi trạm có hai ống chỉ khác nhau <b>một yếu tố</b>. Bấm bắt đầu rồi theo dõi bọt khí, bóng cao su và đồ thị; kết quả tự ghi sau 60 giây (trạm nhiệt độ: 30 giây).</p><ol class="todo">
          ${li(d("A"),!d("A"),"<b>Nồng độ:</b> đinh sắt trong HCl 0,1 M và HCl 1 M.")}
          ${li(d("B"),d("A")&&!d("B"),"<b>Nhiệt độ:</b> viên C sủi trong nước lạnh và nước nóng.")}
          ${li(d("C"),d("B")&&!d("C"),"<b>Diện tích bề mặt:</b> rót HCl 0,1 M vào hai ống chứa đá vôi dạng viên và dạng bột.")}
          ${li(d("D")&&S.splintRes.some(x=>x),d("C")&&!(d("D")&&S.splintRes.some(x=>x)),"<b>Chất xúc tác:</b> thêm MnO₂ vào ống 2; đưa que đóm còn tàn đỏ vào miệng ống để thử khí.")}</ol>
          ${gvTip("hỏi trước mỗi trạm: muốn so sánh công bằng thì những gì phải giữ giống nhau giữa hai ống?")}`;
      }else if(stepIdx===2){
        const box=(id,txt,arr,ok,expl)=>`<p class="lead2">${txt}</p><div class="opts">${arr.map(([k,t],j)=>`<button class="opt ${S.obs[id]===k?(k===ok?"right":"wrong"):""}" data-obs="${id}" data-v="${k}"><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>${S.obs[id]&&S.obs[id]!==ok?`<div class="callout bad">${expl}</div>`:""}`;
        el.innerHTML=`<h3>Quan sát và lí giải</h3>
          ${box("a","<b>1.</b> Ở trạm nồng độ, ống nào thoát khí nhanh hơn?",[["1","Ống HCl 0,1 M"],["2","Ống HCl 1 M"],["nhu","Như nhau"]],"2","Nồng độ HCl lớn hơn thì các hạt chất phản ứng va chạm nhiều hơn, phản ứng nhanh hơn.")}
          ${box("b","<b>2.</b> Viên C sủi tan nhanh hơn trong:",[["lanh","Nước lạnh"],["nong","Nước nóng"],["nhu","Như nhau"]],"nong","Nhiệt độ cao làm phản ứng xảy ra nhanh hơn.")}
          ${box("c","<b>3.</b> Đá vôi dạng nào phản ứng nhanh hơn?",[["vien","Dạng viên"],["bot","Dạng bột"],["nhu","Như nhau"]],"bot","Dạng bột có diện tích bề mặt tiếp xúc lớn hơn nhiều.")}
          ${box("d","<b>4.</b> Vì sao ống 2 ở trạm D sủi bọt mạnh và que đóm bùng cháy?",[["xt","MnO₂ là chất xúc tác làm H₂O₂ phân hủy nhanh, tạo oxygen"],["pu","MnO₂ phản ứng hết với H₂O₂"],["nhiet","Vì ống 2 nóng hơn"]],"xt","MnO₂ không mất đi; nó làm tăng tốc độ phân hủy H₂O₂, khí oxygen làm que đóm bùng cháy.")}`;
      }else{
        const Q=[{k:"a",t:"Tốc độ phản ứng là:",o:[["a","Đại lượng đặc trưng cho sự nhanh chậm của phản ứng hóa học"],["b","Lượng chất sản phẩm sau phản ứng"],["c","Nhiệt độ của phản ứng"]],ok:"a",why:{b:"Lượng sản phẩm chưa nói lên nhanh hay chậm.",c:"Nhiệt độ là yếu tố ảnh hưởng, không phải tốc độ."}},
          {k:"b",t:"Muốn nhóm bếp than nhanh cháy, người ta thường đập nhỏ than. Yếu tố được dùng là:",o:[["a","Nồng độ"],["b","Diện tích bề mặt tiếp xúc"],["c","Chất xúc tác"]],ok:"b",why:{a:"Than là chất rắn; đập nhỏ làm tăng diện tích tiếp xúc với oxygen.",c:"Không thêm chất nào khác."}},
          {k:"c",t:"Bảo quản thực phẩm trong tủ lạnh giúp thực phẩm lâu hỏng vì:",o:[["a","Nhiệt độ thấp làm các phản ứng gây hỏng xảy ra chậm hơn"],["b","Tủ lạnh có chất xúc tác"],["c","Thực phẩm có diện tích bề mặt nhỏ hơn"]],ok:"a",why:{b:"Không có chất xúc tác nào trong tủ lạnh.",c:"Diện tích bề mặt không đổi."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="bot"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{vien:"dạng viên",bot:"dạng bột",nhu:"như nhau"}[S.p1]}</b>. Kết quả: đá vôi dạng bột phản ứng nhanh hơn.</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="con"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{het:"bị tiêu hao hết",con:"vẫn còn nguyên",tang:"tăng lên"}[S.p2]}</b>. Chất xúc tác MnO₂ vẫn còn nguyên sau phản ứng.</div>`:""}
          <div class="eq">Fe + 2HCl → FeCl₂ + H₂↑<br>CaCO₃ + 2HCl → CaCl₂ + CO₂↑ + H₂O<br>2H₂O₂ → 2H₂O + O₂↑ (xúc tác MnO₂)</div>
          <ul class="tlist"><li>Tốc độ phản ứng là đại lượng đặc trưng cho sự nhanh chậm của phản ứng hóa học.</li><li>Tăng nồng độ, tăng nhiệt độ, tăng diện tích bề mặt tiếp xúc, dùng chất xúc tác thì phản ứng xảy ra nhanh hơn.</li><li>Chất xúc tác làm tăng tốc độ phản ứng nhưng khối lượng và bản chất hóa học của nó không thay đổi sau phản ứng.</li></ul>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],i)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`}}
    function onBody(e){const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}if(d.obs){S.obs[d.obs]=d.v;refresh();return}
      if(d.k==="lock"){S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok")}
      if(d.k==="finish"){S.finished=true;refresh();api.done(`<h2>Hoàn thành: Tốc độ phản ứng</h2><p class="muted">Nồng độ, nhiệt độ, diện tích bề mặt và chất xúc tác đều ảnh hưởng tới tốc độ phản ứng.</p>`)}}

    function frame(dt){frameN++;const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      stepRuns(sdt);fizz.step(sdt,b=>{const top=b.p[0]>SX.B-.8&&b.p[0]<SX.B+.8?.38:.05+TB.lvl;if(b.p[1]>top)b.dead=true});foam.step(sdt);steamB.step(sdt);
      draw();R.render(root,simT);LB.update();if(frameN%10===0)updateInfo();
      const R0=view==="ban"?null:S.run[view];
      api.time.label(`t = ${fmt(R0&&R0.on?R0.t:simT,1)} s · ${view==="ban"?"bàn thí nghiệm":ST[view].ten.toLowerCase()}`,R0&&R0.on?Math.min(1,R0.t/60):null)}
    theme();layout();goView("A",true);
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{for(const s of ["A","B","C","D"])S.run[s]=newRun();S.splint=null;S.splintRes=[null,null];fizz.list.length=0;foam.list.length=0;simT=0;refresh()});
    vp.__lab={get S(){return S},start,reset,splintTest,mark,goView,rate,R,pick};
    return{step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},layout,prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
