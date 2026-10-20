/* K9-L-01 · Động năng, thế năng, cơ năng (SGK KHTN 9 – Kết nối tri thức, Bài 2–3) · 3D, điều tra
   Hai trạm:
   1. Máng nghiêng: viên bi lăn từ độ cao h xuống, va vào khúc gỗ; quãng đường khúc gỗ dịch chuyển cho biết động năng của bi.
      Bi lăn không trượt: v = √(10gh/7); va chạm với hệ số phục hồi e; khúc gỗ trượt có ma sát: s = V²/(2μg).
   2. Con lắc đơn: thế năng ↔ động năng; cơ năng không đổi khi bỏ qua sức cản, giảm dần khi có sức cản không khí. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const g=9.8;
const RAMP={L:.9,hs:[.1,.2,.3],ms:[.025,.05],M:.1,mu:.35,e:.5,r:.012};   /* độ cao thả 10–30 cm; bi 25 g, 50 g; khúc gỗ 100 g */
const PEN={L:.8,ms:[.05,.1],angs:[20,40,60],c:.18};
const XR=-2.4,XP=2.2;

const SPEC={
  predict:[{id:"p1",q:"Thả viên bi từ độ cao lớn hơn trên máng nghiêng, khúc gỗ bị đẩy đi:",opts:[["xa","Xa hơn"],["gan","Gần hơn"],["nhu","Như nhau"]],ans:"xa",res:"Kết quả: thả càng cao, bi tới chân máng càng nhanh, động năng càng lớn, khúc gỗ đi càng xa."},
    {id:"p2",q:"Con lắc đơn đi từ vị trí cao nhất xuống vị trí thấp nhất. Thế năng và động năng thay đổi thế nào?",opts:[["tg","Thế năng giảm, động năng tăng"],["tt","Cả hai cùng tăng"],["gt","Thế năng tăng, động năng giảm"]],ans:"tg",res:"Kết quả: thế năng chuyển dần thành động năng; ở vị trí thấp nhất động năng lớn nhất."}],
  taskLead:"Chọn trạm ở khay. Ở máng nghiêng, thay đổi độ cao thả và khối lượng viên bi, mỗi lần đo quãng đường khúc gỗ dịch chuyển.",
  tasks:[{html:"<b>Máng nghiêng:</b> cùng một viên bi, thả ở 3 độ cao khác nhau.",done:()=>{const m=S.r.log.map(l=>l.m);return [0,1].some(mi=>new Set(S.r.log.filter(l=>l.m===mi).map(l=>l.h)).size>=3)}},
    {html:"<b>Máng nghiêng:</b> cùng độ cao, thả 2 viên bi khối lượng khác nhau.",done:()=>[0,1,2].some(hi=>new Set(S.r.log.filter(l=>l.h===hi).map(l=>l.m)).size>=2)},
    {html:"<b>Con lắc:</b> thả con lắc, quan sát ít nhất 3 dao động khi không có sức cản.",done:()=>!!S.p.rec3done},
    {html:"<b>Con lắc:</b> bật sức cản không khí và quan sát cơ năng giảm.",done:()=>S.p.dragRec}],
  obs:[{id:"a",q:"Kết quả ở máng nghiêng cho thấy động năng của vật phụ thuộc vào:",opts:[["mv","Khối lượng và tốc độ của vật"],["m","Chỉ khối lượng"],["h","Chỉ màu sắc, hình dạng"]],ans:"mv",why:"Wđ = ½mv². Bi nặng hơn hoặc nhanh hơn có động năng lớn hơn."},
    {id:"b",q:"Khi bỏ qua sức cản, cơ năng của con lắc:",opts:[["kd","Không đổi"],["tang","Tăng dần"],["giam","Giảm dần"]],ans:"kd",why:"Cơ năng W = Wđ + Wt được bảo toàn khi chỉ có trọng lực thực hiện công."},
    {id:"c",q:"Vì sao con lắc có sức cản không khí dao động yếu dần rồi dừng?",opts:[["nhiet","Một phần cơ năng chuyển hóa thành nhiệt năng do lực cản"],["mat","Năng lượng tự mất đi"],["nang","Quả nặng nặng dần"]],ans:"nhiet",why:"Năng lượng không tự mất đi; cơ năng giảm vì chuyển thành nhiệt năng của không khí và vật."}],
  concl:{html:`<div class="eq">Wđ = ½·m·v² &nbsp;&nbsp; Wt = P·h = m·g·h &nbsp;&nbsp; W = Wđ + Wt</div><ul class="tlist">
    <li><b>Động năng</b> là năng lượng vật có do chuyển động; phụ thuộc khối lượng và tốc độ.</li><li><b>Thế năng trọng trường</b> là năng lượng vật có do ở độ cao so với mặt đất (hoặc mốc chọn trước); phụ thuộc trọng lượng và độ cao.</li>
    <li><b>Cơ năng</b> là tổng động năng và thế năng. Khi vật chuyển động trong trọng trường và bỏ qua sức cản, cơ năng được bảo toàn: động năng và thế năng chuyển hóa qua lại.</li></ul>`,
    quiz:[{id:"q1",q:"Một vật 2 kg chuyển động với tốc độ 3 m/s có động năng:",opts:[["a","9 J"],["b","6 J"],["c","18 J"]],ans:"a",why:{b:"Wđ = ½·2·3² = 9 J.",c:"Quên hệ số ½."}},
      {id:"q2",q:"Quả táo 0,2 kg ở độ cao 3 m so với mặt đất có thế năng (g = 9,8 m/s²):",opts:[["a","5,88 J"],["b","0,6 J"],["c","58,8 J"]],ans:"a",why:{b:"Wt = m·g·h = 0,2·9,8·3.",c:"Wt = m·g·h = 0,2·9,8·3 = 5,88 J."}},
      {id:"q3",q:"Thả rơi một vật (bỏ qua sức cản), khi rơi tới nửa độ cao ban đầu thì:",opts:[["a","Wđ = Wt"],["b","Wđ = 2Wt"],["c","Wđ = 0"]],ans:"a",why:{b:"Cơ năng chia đều khi ở nửa độ cao.",c:"Vật đang chuyển động nên có động năng."}}],
    done:`<h2>Hoàn thành: Động năng, thế năng, cơ năng</h2><p class="muted">Wđ = ½mv²; Wt = mgh; bỏ qua sức cản, cơ năng được bảo toàn.</p>`},
  gv:["Cho học sinh lập bảng: độ cao thả, khối lượng bi, quãng đường khúc gỗ; rút ra quan hệ.","Hỏi: nhân đôi độ cao thả thì quãng đường khúc gỗ thay đổi thế nào? (gần như gấp đôi vì động năng tỉ lệ với h).","Ở con lắc, chạy 0,25× để học sinh đọc các thanh năng lượng tại vị trí cao nhất và thấp nhất."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 2–3)</p><ul class="tlist"><li>Viết được biểu thức tính động năng, thế năng của vật; vận dụng tính trong một số trường hợp đơn giản.</li><li>Nêu được cơ năng là tổng động năng và thế năng; vận dụng khái niệm cơ năng phân tích sự chuyển hóa năng lượng trong một số trường hợp đơn giản.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 2 Động năng. Thế năng; Bài 3 Cơ năng.</li>
<li>Vật lăn không trượt (quả cầu đặc): v = √(10gh/7); bảo toàn cơ năng, con lắc đơn: <a href="https://openstax.org/books/college-physics-2e/pages/10-3-dynamics-of-rotational-motion-rotational-inertia" target="_blank" rel="noopener">OpenStax College Physics 2e, chương 10</a>; <a href="https://openstax.org/books/college-physics-2e/pages/7-4-conservative-forces-and-potential-energy" target="_blank" rel="noopener">mục 7.4</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Bi thép 25 g hoặc 50 g; khúc gỗ 100 g; hệ số ma sát trượt gỗ – bàn 0,35; hệ số phục hồi va chạm 0,5; bỏ qua mất mát năng lượng khi bi lăn trên máng và khi chuyển từ máng sang mặt bàn.</li>
<li>Con lắc dài 0,8 m; sức cản không khí mô hình bằng lực tỉ lệ với tốc độ, phóng đại để thấy rõ trong vài dao động.</li></ul>`;

let S;
LabKHTN.register("K9-L-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"so",t:"Số liệu"},{k:"kq",t:"Kết quả"}],empty:"Mỗi lần thả, kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D động năng, thế năng, cơ năng",legend:{w:260},bench:[8,2.2],seed:91,
      views:{mang:{t:[XR-.08,.16,0],yaw:0,pitch:.24,rad:.8,label:"Máng nghiêng",icon:IC.step},conlac:{t:[XP,.55,0],yaw:0,pitch:.08,rad:.72,label:"Con lắc",icon:IC.swap}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={r:{h:1,m:0,ph:"idle",t:0,s:0,v:0,bx:0,log:[]},p:{m:0,a:1,th:0,om:0,on:false,drag:false,drag0:false,osc:0,lastSign:0,W0:0,dragRec:false,dragT:0},recs:0};
    const rec=(tn,so,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,so,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const steel={color:"#C9CFD6",metal:.95,rough:.18},woodM={color:"#B07A45",rough:.55,hooks:KIT.TISSUE,uniforms:{uBump:.04,uNF:40}};
    /* ================= máng nghiêng ================= */
    const angR=Math.asin(.3/RAMP.L);const base=[XR,0,0];   /* chân máng tại base, máng nghiêng về bên trái */
    const ramp=root.add(new G.Node());ramp.pos=base;ramp.quat=G.Q.euler(0,0,-angR);
    ramp.add(R.mesh(G.box(RAMP.L,.012,.08,.004,2),{color:"#8D99A6",metal:.6,rough:.35})).pos=[-RAMP.L/2,-.006,0];
    for(const z of [-.03,.03])ramp.add(R.mesh(G.box(RAMP.L,.03,.008,.003,1),{color:"#8D99A6",metal:.6,rough:.35})).pos=[-RAMP.L/2,.012,z];
    for(let i=1;i<=3;i++){const x=-(.1*i)/Math.sin(angR);ramp.add(R.mesh(G.box(.004,.035,.09,.001,1),{color:"#F59E0B",type:"unlit"})).pos=[x,.02,0]}
    root.add(R.mesh(G.box(.06,.3,.1,.01,2),woodM)).pos=[XR-RAMP.L*Math.cos(angR)+.03,.15,0];
    root.add(R.mesh(G.box(.64,.004,.12,.002,1),{color:"#D8C9A8",rough:.8})).pos=[XR+.4,.002,0];
    for(let i=0;i<=60;i++)root.add(R.mesh(G.box(.0015,.002,i%10?.02:i%5?.03:.05,0,1),{color:"#2B2B2B"})).pos=[XR+.08+i*.01,.0045,-.035];
    const ball=root.add(R.mesh(G.sphere(1,28,20),steel));
    const block=root.add(R.mesh(G.box(.08,.06,.08,.006,2),woodM));const BX0=XR+.12;
    const posOnRamp=d=>[base[0]-d*Math.cos(angR),base[1]+d*Math.sin(angR),0];   /* d: quãng đường dọc máng tính từ chân máng */
    /* ================= con lắc ================= */
    const stand=root.add(new G.Node());stand.pos=[XP,0,-.15];stand.add(R.mesh(G.box(.5,.03,.3,.01,2),{color:"#3F4652",rough:.5})).pos=[0,.015,0];
    stand.add(R.mesh(G.cylinder(.012,1.0,10),{color:"#B7BEC6",metal:.8})).pos=[-.2,0,0];stand.add(R.mesh(G.tube([[-.2,.99,0],[0,.99,0],[0,.99,.15]],.01,8),{color:"#B7BEC6",metal:.8}));
    const pivot=[XP,.99,0];const pend=root.add(new G.Node());pend.pos=pivot;
    const thread=pend.add(R.mesh(G.cylinder(.0015,PEN.L,4),{color:"#EDEDED"}));thread.pos=[0,-PEN.L,0];
    const bob=pend.add(R.mesh(G.sphere(1,28,20),{color:"#B8860B",metal:.9,rough:.22}));
    const arcG=[];for(let i=0;i<=60;i++){const a=-1.05+2.1*i/60;arcG.push([pivot[0]+Math.sin(a)*PEN.L,pivot[1]-Math.cos(a)*PEN.L,0])}
    root.add(R.mesh(G.tube(arcG,.0015,4),{type:"unlit",color:"#94A3B8",alpha:.5,transparent:true}));
    const trail=root.add(R.instanced(G.sphere(1,8,6),{type:"unlit",color:"#FFFFFF"},40));const TR=[];
    /* thước đo độ cao */

    /* ================= nhãn ================= */
    K.label("Máng nghiêng",posOnRamp(.55),{view:"mang",dir:"nw",len:30});K.label("Viên bi thép",()=>ball.pos,{view:"mang",dir:"n",len:40});K.label("Khúc gỗ",()=>V3.add(block.pos,[0,.03,0]),{view:"mang",dir:"ne",len:40});
    K.label("Vạch độ cao 10, 20, 30 cm",posOnRamp(.3/Math.sin(angR)*.66),{view:"mang",dir:"sw",len:40});K.label("Thước đo (vạch 1 cm)",[XR+.6,.004,-.04],{view:"mang",dir:"se",len:30});
    
    K.label("Quả nặng",()=>{const a=S.p.th;return[pivot[0]+Math.sin(a)*PEN.L,pivot[1]-Math.cos(a)*PEN.L,0]},{view:"conlac",dir:"sw",len:40});K.label("Sợi dây",[pivot[0],pivot[1]-.3,0],{view:"conlac",dir:"w",len:30});

    /* ================= mô phỏng ================= */
    function resetRamp(){const Rr=S.r;Rr.ph="idle";Rr.t=0;Rr.bx=0;Rr.v=0;Rr.d=RAMP.hs[Rr.h]/Math.sin(angR)}
    resetRamp();
    function stepRamp(dt){const Rr=S.r;const m=RAMP.ms[Rr.m],r=RAMP.r*(Rr.m?1.26:1);ball.scl=[r,r,r];
      if(Rr.ph==="roll"){const a=5/7*g*Math.sin(angR);Rr.v+=a*dt;Rr.d-=Rr.v*dt;if(Rr.d<=0){Rr.d=0;Rr.v=Math.sqrt(10*g*RAMP.hs[Rr.h]/7);Rr.ph="flat";Rr.x=0}}
      else if(Rr.ph==="flat"){Rr.x+=Rr.v*dt;if(Rr.x>=BX0-XR-.04-r){/* va chạm */const v=Rr.v;const V=m*(1+RAMP.e)*v/(m+RAMP.M);const vb=(m-RAMP.e*RAMP.M)*v/(m+RAMP.M);Rr.V=V;Rr.vb=Math.max(0,vb);Rr.ph="slide";Rr.v0=v;Rr.x=BX0-XR-.04-r}}
      else if(Rr.ph==="slide"){const de=RAMP.mu*g;const st=Math.min(dt,Rr.V/de);Rr.bx+=Rr.V*st-.5*de*st*st;Rr.V=Math.max(0,Rr.V-de*st);Rr.vb=Math.max(0,Rr.vb-.6*dt);Rr.x+=Rr.vb*dt;if(Rr.x>BX0-XR-.04-r+Rr.bx)Rr.x=BX0-XR-.04-r+Rr.bx;
        if(Rr.V<=0&&Rr.vb<=0){Rr.ph="done";const s=Rr.bx;const Wd=.5*m*Rr.v0*Rr.v0;Rr.log.push({h:Rr.h,m:Rr.m,s});
          rec("Máng nghiêng",`h = ${fmt(RAMP.hs[Rr.h]*100,0)} cm; bi ${fmt(m*1000,0)} g`,`tốc độ bi ở chân máng ${fmt(Rr.v0,2)} m/s; Wđ ≈ ${fmt(Wd*1000,0)} mJ; khúc gỗ dịch chuyển ${fmt(s*100,1)} cm`);refresh()}}
      ball.pos=Rr.ph==="idle"||Rr.ph==="roll"?V3.add(posOnRamp(Rr.d),[Math.sin(angR)*r,Math.cos(angR)*r,0]):[XR+Rr.x,r,0];
      block.pos=[BX0+Rr.bx,.03,0]}
    function penE(){const P=S.p,m=PEN.ms[P.m];const Wt=m*g*PEN.L*(1-Math.cos(P.th)),Wd=.5*m*Math.pow(PEN.L*P.om,2);return{Wt,Wd,W:Wt+Wd}}
    function stepPen(dt){const P=S.p;const r=P.m?.03:.024;bob.scl=[r,r,r];bob.pos=[0,-PEN.L,0];
      if(P.on&&dt>0){let left=dt;while(left>1e-6){const h=Math.min(left,1/240);left-=h;const acc=-(g/PEN.L)*Math.sin(P.th)-(P.drag?PEN.c*P.om:0);P.om+=acc*h;P.th+=P.om*h}
        const sg=Math.sign(P.om);if(sg&&sg!==P.lastSign){if(P.lastSign<0)P.osc+=1;P.lastSign=sg}
        if(P.osc>=3&&!P.rec3&&!P.drag0){P.rec3=true;P.rec3done=true;const E=penE();rec("Con lắc (không sức cản)",`quả nặng ${fmt(PEN.ms[P.m]*1000,0)} g; góc thả ${PEN.angs[P.a]}°`,`sau 3 dao động cơ năng vẫn ≈ ${fmt(E.W*1000,1)} mJ (ban đầu ${fmt(P.W0*1000,1)} mJ): cơ năng được bảo toàn`);refresh()}
        if(P.drag){P.dragT+=dt;if(P.dragT>12&&!P.dragRec){P.dragRec=true;const E=penE();rec("Con lắc (có sức cản không khí)",`sau ${fmt(P.dragT,0)} s`,`cơ năng giảm từ ${fmt(P.W0*1000,1)} mJ còn ${fmt(E.W*1000,1)} mJ; phần mất đi chuyển thành nhiệt năng`);refresh()}}}
      pend.quat=G.Q.euler(0,0,P.th);
      /* vệt chuyển động */
      if(P.on&&K.frameN%3===0){const p=[pivot[0]+Math.sin(P.th)*PEN.L,pivot[1]-Math.cos(P.th)*PEN.L,0];TR.push(p);if(TR.length>40)TR.shift()}
      const D=trail.data,c=H("#FDE68A");TR.forEach((p,i)=>D.set([p[0],p[1],p[2],.004+.004*i/40,c[0],c[1],c[2],1],i*8));trail.setInstances(K.view==="conlac"?TR.length:0);
      if(K.view==="conlac"&&K.frameN%4===0)K.updateInfo()}
    function releasePen(){const P=S.p;P.th=-PEN.angs[P.a]*Math.PI/180;P.om=0;P.on=true;P.osc=0;P.lastSign=0;P.rec3=false;P.dragT=0;P.drag0=P.drag;const m=PEN.ms[P.m];P.W0=m*g*PEN.L*(1-Math.cos(P.th));TR.length=0}
    S.p.th=-PEN.angs[1]*Math.PI/180;
    K.onFrame(dt=>{stepRamp(dt);stepPen(dt)});

    /* ================= khay ================= */
    K.dockFn(()=>{const v=K.view;
      if(v==="mang"){const Rr=S.r,busy=Rr.ph!=="idle"&&Rr.ph!=="done";return[{seg:RAMP.hs.map((h,i)=>({k:"h",v:String(i),label:`h = ${h*100} cm`,icon:"",on:Rr.h===i})),label:"Độ cao thả"},
        {seg:RAMP.ms.map((m,i)=>({k:"m",v:String(i),label:`Bi ${m*1000} g`,icon:"",on:Rr.m===i})),label:"Khối lượng bi"},"hr",{k:"go",label:"Thả viên bi",icon:IC.play,dis:busy||Rr.ph==="done"},{k:"rr",label:"Đặt lại bi và khúc gỗ",icon:IC.reset,dis:busy}]}
      const P=S.p;return[{seg:PEN.angs.map((a,i)=>({k:"a",v:String(i),label:`${a}°`,icon:"",on:P.a===i})),label:"Góc thả"},{seg:PEN.ms.map((m,i)=>({k:"pm",v:String(i),label:`${m*1000} g`,icon:"",on:P.m===i})),label:"Quả nặng"},
        {k:"drag",label:P.drag?"Bỏ sức cản không khí":"Có sức cản không khí",icon:IC.swap,on:P.drag},"hr",{k:"rel",label:"Thả con lắc",icon:IC.play},{k:"stop",label:"Giữ con lắc lại",icon:IC.hand,dis:!P.on}]});
    K.onDock((k,v)=>{const Rr=S.r,P=S.p;
      if(k==="h"){Rr.h=+v;resetRamp()}else if(k==="m"){Rr.m=+v;resetRamp()}else if(k==="go"){Rr.ph="roll";Rr.v=0;if(!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}else if(k==="rr")resetRamp();
      else if(k==="a"){P.a=+v;P.on=false;P.th=-PEN.angs[P.a]*Math.PI/180;P.om=0}else if(k==="pm"){P.m=+v;P.on=false;P.om=0}else if(k==="drag"){P.drag=!P.drag;if(P.on){P.drag0=P.drag0||P.drag;P.dragT=0;P.W0=penE().W}}
      else if(k==="rel")releasePen();else if(k==="stop"){P.on=false;P.om=0}
      refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="mang"){const Rr=S.r;const rows=Rr.log.slice(-6).map(l=>`<tr><td>${RAMP.hs[l.h]*100}</td><td>${RAMP.ms[l.m]*1000}</td><td>${fmt(l.s*100,1)}</td></tr>`).join("");
        return `<div><b>Viên bi lăn xuống máng</b></div><div>h = ${RAMP.hs[Rr.h]*100} cm · bi ${RAMP.ms[Rr.m]*1000} g</div>${rows?`<table class="mx"><tr><th>h (cm)</th><th>m (g)</th><th>s (cm)</th></tr>${rows}</table>`:""}<small>s: quãng đường khúc gỗ dịch chuyển.</small>`}
      const P=S.p,E=penE();const mx=Math.max(1e-9,P.W0||E.W);const bar=(v,col,t)=>`<div style="display:flex;align-items:center;gap:6px;margin:3px 0"><span style="width:24px">${t}</span><span style="display:inline-block;height:11px;width:${Math.round(100*C.clamp(v/mx,0,1.05))}px;background:${col};border-radius:4px"></span><span>${fmt(v*1000,1)} mJ</span></div>`;
      return `<div><b>Con lắc đơn</b> · dài ${PEN.L*100} cm</div>${bar(E.Wt,"#60A5FA","Wt")}${bar(E.Wd,"#F87171","Wđ")}${bar(E.W,"#FDE047","W")}<div>Góc lệch: ${fmt(Math.abs(P.th)*180/Math.PI,0)}° · tốc độ ${fmt(Math.abs(P.om)*PEN.L,2)} m/s</div><div>${P.drag?"Có sức cản không khí":"Bỏ qua sức cản"}</div><small>Mốc thế năng: vị trí thấp nhất của quả nặng.</small>`});
    K.timeLabel(()=>K.view==="mang"?`Bi: ${{idle:"đứng yên",roll:"lăn trên máng",flat:"lăn trên bàn",slide:"khúc gỗ đang trượt",done:"đã dừng"}[S.r.ph]}`:`Đã dao động ${S.p.osc} lần`);
    K.onReset(()=>{resetRamp();S.p.on=false;S.p.om=0;refresh()});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"go",p:()=>V3.add(ball.pos,[0,.035,0]),tip:"Chạm vào viên bi để thả",view:"mang"}]);
    /* thao tác tay: kéo quả nặng lệch sang trái tới góc muốn thả (10°, 20°, 30°…) rồi buông tay */
    const bobP=()=>{const a=S.p.th;return[pivot[0]+Math.sin(a)*PEN.L,pivot[1]-Math.cos(a)*PEN.L,0]};
    K.pickFn((x,y)=>{if(K.view!=="conlac")return null;return G.hit.sphere(R.ray(x,y),bobP(),.07)!=null?{drag:true,k:"bob"}:null});
    K.dragFn((ph,o,p)=>{const P=S.p;if(ph==="start"){P.on=false;P.om=0;return}const r=R.ray(p.x,p.y);if(Math.abs(r.d[2])<1e-4)return;const t=-r.o[2]/r.d[2];if(t<=0)return;
      const q=G.hit.at(r,t);const deg=Math.abs(Math.atan2(q[0]-pivot[0],pivot[1]-q[1]))*180/Math.PI;let bi=0;PEN.angs.forEach((a,i)=>{if(Math.abs(a-deg)<Math.abs(PEN.angs[bi]-deg))bi=i});
      P.a=bi;P.th=-PEN.angs[bi]*Math.PI/180;K.refreshDock();K.updateInfo(true);if(ph==="end")K._dockH("rel")});
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const Rr=S.r;const seq=[[0,0],[1,0],[2,0],[2,1]];let i=0;const go=()=>{if(K.dead||i>=seq.length)return;if(Rr.ph!=="idle"&&Rr.ph!=="done")return setTimeout(go,300);Rr.h=seq[i][0];Rr.m=seq[i][1];resetRamp();Rr.ph="roll";i++;setTimeout(go,400)};go();
        releasePen();setTimeout(()=>{S.p.drag=true;S.p.drag0=true;S.p.dragT=0;S.p.W0=penE().W},14000)}};
    return K.mount(st)}
});
})();
