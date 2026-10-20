/* K6-L-02 · Biến dạng của lò xo; đo lực bằng lực kế (SGK KHTN 6 – Kết nối tri thức, Bài 39) · 3D, điều tra
   1. Treo lần lượt 1 – 5 quả nặng 50 g vào lò xo, đọc chiều dài lò xo trên thước; độ dãn Δl = l − l₀ tỉ lệ thuận với khối lượng vật treo.
      Lò xo mô hình có độ cứng 20 N/m (mỗi quả nặng 50 g làm lò xo dãn thêm khoảng 2,5 cm), chiều dài tự nhiên l₀ = 10,0 cm.
   2. Lực kế lò xo (GHĐ 5 N, ĐCNN 0,1 N): treo vật, đọc số chỉ = trọng lượng P. Dùng hệ thức gần đúng của SGK: P = 10 · m (m tính bằng kg). */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const KS=20,L0=.10,MW=.05;
const OBJS=[{k:"bong",t:"Quả bóng tennis",m:.058},{k:"khoa",t:"Chùm chìa khóa",m:.08},{k:"tao",t:"Quả táo",m:.15},{k:"hop",t:"Hộp bút",m:.23}];
const SPEC={
  predict:[{id:"p1",q:"Treo 1 quả nặng, lò xo dãn 2,5 cm. Treo 3 quả nặng như thế, lò xo dãn khoảng:",opts:[["7.5","7,5 cm"],["2.5","2,5 cm"],["5","5 cm"]],ans:"7.5",res:"Kết quả: độ dãn của lò xo tỉ lệ thuận với khối lượng vật treo (trong giới hạn đàn hồi)."},
    {id:"p2",q:"Một vật có khối lượng 200 g có trọng lượng khoảng:",opts:[["2","2 N"],["200","200 N"],["20","20 N"]],ans:"2",res:"Kết quả: P = 10 · m = 10 · 0,2 = 2 N."}],
  taskLead:"Phần “Lò xo”: treo thêm quả nặng, đọc chiều dài lò xo và ghi kết quả. Phần “Lực kế”: treo từng vật, đọc số chỉ lực kế.",
  tasks:[{html:"<b>Lò xo:</b> ghi kết quả với 1, 2, 3, 4, 5 quả nặng.",done:()=>[1,2,3,4,5].every(n=>S.lx.log[n])},{html:"<b>Lực kế:</b> đo đúng trọng lượng của 3 vật.",done:()=>Object.keys(S.lk.ok).length>=3}],
  obs:[{id:"a",q:"Từ bảng kết quả, độ dãn của lò xo:",opts:[["ok","Tăng gấp đôi khi khối lượng vật treo tăng gấp đôi"],["k","Không đổi"],["giam","Giảm khi treo thêm vật"]],ans:"ok",why:"Độ dãn tỉ lệ thuận với khối lượng (và trọng lượng) vật treo."},
    {id:"b",q:"Khi bỏ hết quả nặng ra, lò xo:",opts:[["ok","Trở lại chiều dài tự nhiên ban đầu"],["dai","Vẫn dài như khi treo vật"],["ngan","Ngắn hơn ban đầu"]],ans:"ok",why:"Lò xo có tính đàn hồi (nếu không bị kéo quá giới hạn)."},
    {id:"c",q:"Đơn vị của lực là:",opts:[["ok","Newton (N)"],["kg","Kilôgam (kg)"],["m","Mét (m)"]],ans:"ok",why:"Kilôgam là đơn vị của khối lượng."}],
  concl:{html:`<ul class="tlist"><li>Lò xo bị kéo thì dãn ra; khi thôi kéo, lò xo trở lại chiều dài ban đầu: biến dạng của lò xo là <b>biến dạng đàn hồi</b>.</li>
    <li>Độ dãn của lò xo treo thẳng đứng <b>tỉ lệ thuận</b> với khối lượng của vật treo: Δl = l − l₀.</li>
    <li>Lực kế lò xo dùng để đo lực; đơn vị lực là newton (N). Trọng lượng P (N) của vật có khối lượng m (kg): P ≈ 10 · m.</li></ul>`,
    quiz:[{id:"q1",q:"Lò xo dài tự nhiên 12 cm, treo vật thì dài 15 cm. Độ dãn là:",opts:[["a","3 cm"],["b","27 cm"],["c","15 cm"]],ans:"a",why:{b:"Độ dãn là hiệu, không phải tổng.",c:"15 cm là chiều dài khi treo vật."}},
      {id:"q2",q:"Lực kế có GHĐ 5 N không nên dùng để đo vật nặng 1 kg vì:",opts:[["a","Trọng lượng 10 N vượt GHĐ, có thể làm hỏng lò xo"],["b","Vật quá nhẹ"],["c","Lực kế chỉ đo khối lượng"]],ans:"a",why:{b:"1 kg có trọng lượng khoảng 10 N, lớn hơn 5 N.",c:"Lực kế đo lực."}}],
    done:`<h2>Hoàn thành: biến dạng lò xo, lực kế</h2><p class="muted">Độ dãn tỉ lệ thuận với khối lượng vật treo; P ≈ 10 · m.</p>`},
  gv:["Cho học sinh vẽ đồ thị độ dãn theo khối lượng trên giấy kẻ ô.","Hỏi: nếu treo 10 quả nặng, lò xo có còn trở lại như cũ không? (giới hạn đàn hồi)","Trước khi đo, điều chỉnh kim lực kế về vạch 0."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 39)</p><ul class="tlist"><li>Thực hiện thí nghiệm chứng minh độ giãn của lò xo treo thẳng đứng tỉ lệ thuận với khối lượng vật treo; đo được lực bằng lực kế lò xo; nêu được đơn vị lực; phân biệt khối lượng và trọng lượng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 39 Biến dạng của lò xo; các bài về lực và trọng lượng trong chương Lực trong đời sống.</li>
<li>Định luật Hooke cho lò xo: <a href="https://openstax.org/books/physics/pages/16-1-hookes-law-stress-and-strain-revisited" target="_blank" rel="noopener">OpenStax Physics, mục 16.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Lò xo độ cứng 20 N/m, chiều dài tự nhiên 10,0 cm, bỏ qua khối lượng lò xo; quả nặng 50 g. Khối lượng các vật ở phần lực kế là số của mô hình; dùng g ≈ 10 N/kg như SGK.</li></ul>`;

let S;
LabKHTN.register("K6-L-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"m",t:"Khối lượng vật (g)"},{k:"l",t:"Chiều dài l (cm)"},{k:"dl",t:"Độ dãn Δl (cm)"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D biến dạng lò xo và lực kế",legend:{w:290},bench:[1.6,.8],seed:17,
      views:{lx:{t:[-.3,.33,0],yaw:.12,pitch:.08,rad:.24,label:"Lò xo",icon:IC.grid},lk:{t:[.33,.31,.05],yaw:-.1,pitch:.16,rad:.32,label:"Lực kế",icon:IC.thermo}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={lx:{n:0,log:{},y:L0},lk:{o:-1,ok:{},y:0},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const texM=(tex,key)=>({type:"unlit",color:"#FFFFFF",key,hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}});
    const vplane=(w,h)=>{const g=G.plane(w,h);const P=g.pos,N=g.nrm;for(let i=0;i<P.length;i+=3){const px=P[i],pz=P[i+2];P[i]=px;P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}return g};
    const metal={color:"#9CA3AF",metal:.85,rough:.3},dark={color:"#374151",rough:.5};
    /* lò xo: ống xoắn chiều dài 1, co giãn theo trục y */
    const coil=(r,turns,w)=>{const pts=[];for(let i=0;i<=turns*20;i++){const a=i/20*6.283;pts.push([Math.cos(a)*r,-i/(turns*20),Math.sin(a)*r])}return G.tube(pts,w,6)};
    /* ---------- 1. giá treo + lò xo + thước ---------- */
    const LX=-.3,TOP=.55;const sN=root.add(new G.Node());sN.pos=[LX,0,0];
    sN.add(R.mesh(G.box(.2,.012,.12,.004,2),dark)).pos=[0,.006,0];sN.add(R.mesh(G.cylinder(.006,.6,10),metal)).pos=[-.08,.012,0];sN.add(R.mesh(G.box(.14,.01,.012,.003,1),metal)).pos=[-.01,TOP+.01,0];
    const spring=sN.add(R.mesh(coil(.009,18,.0011),{color:"#CBD5E1",metal:.9,rough:.25}));spring.pos=[0,TOP,0];
    const hang=sN.add(new G.Node());const hook=hang.add(R.mesh(G.cylinder(.0015,.02,6),metal));hook.pos=[0,-.02,0];const ptr=hang.add(R.mesh(G.box(.05,.002,.002,.0005,1),{color:"#DC2626",rough:.4}));ptr.pos=[-.03,-.002,0];
    const hanger=hang.add(new G.Node());hanger.pos=[0,-.02,0];hanger.add(R.mesh(G.cylinder(.0018,.06,6),metal)).pos=[0,-.06,0];hanger.add(R.mesh(G.cylinder(.018,.004,24),metal)).pos=[0,-.064,0];
    const wts=[];for(let i=0;i<5;i++){const w=hanger.add(R.mesh(G.cylinder(.017,.011,28),{color:"#B45309",metal:.5,rough:.35}));w.pos=[0,-.06+i*.0115,0];w.visible=false;wts.push(w)}
    /* thước đứng: số 0 ở mép dưới móc treo trên */
    const rc=document.createElement("canvas");rc.width=96;rc.height=1024;{const g=rc.getContext("2d");g.fillStyle="#FDF6E3";g.fillRect(0,0,96,1024);g.fillStyle="#111";for(let mm=0;mm<=300;mm++){const y=20+mm/300*984;const L=mm%10===0?44:mm%5===0?30:18;g.fillRect(0,y-1,L,2);if(mm%10===0){g.font="700 22px system-ui";g.fillText(String(mm/10),50,y+8)}}}
    const RH=.3/(984/1024);const ruler=sN.add(R.mesh(vplane(.03,RH),texM(R.tex2D(rc,{mip:true}),"vr")));ruler.pos=[-.055,TOP+RH*(20/1024)-RH/2,.003];   /* vạch 0 ngang đầu trên lò xo */
    /* ---------- 2. lực kế ---------- */
    const KX=.35;const kN=root.add(new G.Node());kN.pos=[KX,0,0];kN.add(R.mesh(G.box(.2,.012,.12,.004,2),dark)).pos=[0,.006,0];kN.add(R.mesh(G.cylinder(.006,.62,10),metal)).pos=[.08,.012,0];kN.add(R.mesh(G.box(.12,.01,.012,.003,1),metal)).pos=[.025,.62,0];
    const fm=kN.add(new G.Node());fm.pos=[0,.6,0];fm.add(R.mesh(G.cylinder(.012,.27,20),{type:"glass",color:"#F8FAFC",alpha:.45})).pos=[0,-.27,0];
    const fc=document.createElement("canvas");fc.width=96;fc.height=768;{const g=fc.getContext("2d");g.fillStyle="#FFFFFF";g.fillRect(0,0,96,768);g.fillStyle="#111";for(let i=0;i<=50;i++){const y=40+i/50*680;const L=i%10===0?40:i%5===0?28:16;g.fillRect(0,y-1,L,2);if(i%10===0){g.font="700 26px system-ui";g.fillText(String(i/10),46,y+9)}}g.font="700 24px system-ui";g.fillText("N",50,760)}
    const fsc=fm.add(R.mesh(vplane(.018,.18),texM(R.tex2D(fc,{mip:true}),"fs")));fsc.pos=[0,-.087+.18*(40/768)-.09,.0125];
    const s2=fm.add(R.mesh(coil(.007,14,.0008),{color:"#CBD5E1",metal:.9,rough:.25}));s2.pos=[0,-.012,0];
    const rod=fm.add(new G.Node());rod.add(R.mesh(G.cylinder(.0018,.08,6),metal)).pos=[0,-.08,0];const fptr=rod.add(R.mesh(G.box(.02,.003,.003,.0008,1),{color:"#DC2626"}));fptr.pos=[0,0,.013];const hk2=rod.add(R.mesh(G.cylinder(.0015,.02,6),metal));hk2.pos=[0,-.1,0];
    const FSP=.18*(680/768)/5;   /* m mỗi newton */
    const mkObj=(o,par)=>{const n=par.add(new G.Node());if(o.k==="bong")n.add(R.mesh(G.sphere(.033,24,16),{color:"#D9F99D",rough:.8}));else if(o.k==="tao"){n.add(R.mesh(G.sphere(.04,24,16),{color:"#DC2626",rough:.35,coat:.6})).scl=[1,.9,1];n.add(R.mesh(G.cylinder(.002,.015,6),{color:"#78350F"})).pos=[0,.035,0]}
      else if(o.k==="hop")n.add(R.mesh(G.box(.05,.11,.025,.006,2),{color:"#2563EB",rough:.5}));else{for(let i=0;i<4;i++){const m=n.add(R.mesh(G.box(.008,.04,.002,.001,1),{color:"#D1D5DB",metal:.9,rough:.25}));m.pos=[(i-1.5)*.012,0,0];m.quat=Q.euler(0,0,(i-1.5)*.25)}n.add(R.mesh(G.tube(Array.from({length:25},(_,i)=>[Math.cos(i/24*6.283)*.012,.03+Math.sin(i/24*6.283)*.012,0]),.0015,6),metal))}
      return n};
    const objN=OBJS.map(o=>{const n=mkObj(o,rod);n.pos=[0,-.12-(o.k==="hop"?.06:o.k==="tao"?.045:o.k==="bong"?.04:.035),0];n.visible=false;return n});
    /* các vật chưa treo đặt sẵn trên bàn, chạm vào vật để treo lên lực kế */
    const BP=OBJS.map((o,i)=>[-.17+i*.075,{hop:.055,tao:.036,bong:.033,khoa:.003}[o.k],.15]);
    const benchN=OBJS.map((o,i)=>{const n=mkObj(o,kN);n.pos=BP[i];if(o.k==="khoa")n.quat=Q.euler(-Math.PI/2,0,0);return n});
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame(dt=>{tk+=dt;if(tk>.25){tk=0;K.updateInfo()}const X=S.lx;const tgt=L0+X.n*MW*10/KS;X.y+=(tgt-X.y)*Math.min(1,dt*6);
      spring.scl=[1,X.y,1];hang.pos=[0,TOP-X.y,0];wts.forEach((w,i)=>w.visible=i<X.n);
      const L=S.lk;const F=L.o>=0?OBJS[L.o].m*10:0;L.y+=(F*FSP-L.y)*Math.min(1,dt*6);s2.scl=[1,.075+L.y,1];rod.pos=[0,-.012-.075-L.y,0];objN.forEach((n,i)=>n.visible=i===L.o);benchN.forEach((n,i)=>n.visible=i!==L.o)});
    const lNow=()=>+(S.lx.y*100).toFixed(1);
    K.dockFn(()=>{const v=K.view;if(v==="lx"){const X=S.lx;return[{grid:[{k:"w",v:"-1",label:"Bớt 1 quả nặng",icon:IC.minus,dis:X.n<=0},{k:"w",v:"1",label:"Treo thêm 1 quả nặng",icon:IC.plus,dis:X.n>=5}]},{k:"rec",label:"Ghi kết quả",icon:IC.pen,dis:!!X.log[X.n]}]}
      const L=S.lk;const it=[{grid:OBJS.map((o,i)=>({k:"obj",v:String(i),label:o.t,icon:"",on:L.o===i}))}];if(L.o>=0){const P=OBJS[L.o].m*10;const ops=[P,P+.5,P*2].map(x=>+x.toFixed(1)).sort(()=>Math.random()-.5);it.push({grid:ops.map(x=>({k:"read",v:String(x),label:`${fmt(x,1)} N`,icon:"",dis:!!L.ok[L.o]}))})}return it});
    K.onDock((k,v)=>{const X=S.lx,L=S.lk;if(k==="w")X.n=C.clamp(X.n+(+v),0,5);else if(k==="rec"){X.log[X.n]=1;const l=+(100*(L0+X.n*MW*10/KS)).toFixed(1);S.recs++;api.record({lan:String(S.recs),m:String(X.n*50),l:fmt(l,1),dl:fmt(l-100*L0,1)})}
      else if(k==="obj")L.o=+v;else if(k==="read"){const o=OBJS[L.o],P=+(o.m*10).toFixed(1);if(Math.abs(+v-P)<1e-6){L.ok[L.o]=1;S.recs++;api.record({lan:String(S.recs),m:`${o.t}: ${fmt(o.m*1000,0)}`,l:"(lực kế)",dl:`P = ${fmt(P,1)} N`})}else api.toast("Đọc lại vạch mà kim chỉ (mỗi vạch nhỏ 0,1 N).","warn",2000)}refresh()});
    K.label("Lò xo",[LX+.012,TOP-.04,0],{view:"lx",dir:"e",len:30});K.label("Kim chỉ",()=>[LX-.055,TOP-S.lx.y-.002,0],{view:"lx",dir:"w",len:30});K.label("Quả nặng 50 g",()=>[LX+.017,TOP-S.lx.y-.07,0],{view:"lx",dir:"e",len:30});
    K.label("Thang đo (N)",[KX,.5,.013],{view:"lk",dir:"w",len:30});K.label("Kim chỉ thị",()=>[KX,.6-.012-.075-S.lk.y,.013],{view:"lk",dir:"e",len:30});
    function svg(){const pts=[0,1,2,3,4,5].filter(n=>S.lx.log[n]||n===0).map(n=>[n*50,n*MW*10/KS*100]);const W=230,H=120,px=m=>30+m/250*(W-40),py=d=>H-18-d/12.5*(H-28);
      return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;display:block;margin-top:4px"><line x1="30" y1="${H-18}" x2="${W-6}" y2="${H-18}" stroke="currentColor" opacity=".5"/><line x1="30" y1="6" x2="30" y2="${H-18}" stroke="currentColor" opacity=".5"/>
        ${[0,50,100,150,200,250].map(m=>`<text x="${px(m)}" y="${H-5}" font-size="9" text-anchor="middle" fill="currentColor">${m}</text>`).join("")}${[0,5,10].map(d=>`<text x="26" y="${py(d)+3}" font-size="9" text-anchor="end" fill="currentColor">${d}</text>`).join("")}
        <text x="34" y="12" font-size="9" fill="currentColor">Δl (cm)</text><text x="${W-6}" y="${H-22}" font-size="9" text-anchor="end" fill="currentColor">m (g)</text>
        <polyline points="${pts.map(p=>`${px(p[0])},${py(p[1])}`).join(" ")}" fill="none" stroke="#F59E0B" stroke-width="2"/>${pts.map(p=>`<circle cx="${px(p[0])}" cy="${py(p[1])}" r="3" fill="#F59E0B"/>`).join("")}</svg>`}
    K.infoFn(()=>{if(K.view==="lx"){const X=S.lx;return `<div><b>Lò xo</b> · l₀ = ${fmt(L0*100,1)} cm</div><div>${X.n} quả nặng (${X.n*50} g) · l = ${fmt(lNow(),1)} cm · Δl = ${fmt(lNow()-L0*100,1)} cm</div>${svg()}`}
      const L=S.lk;return `<div><b>Lực kế</b> · GHĐ 5 N · ĐCNN 0,1 N</div><div>${L.o>=0?OBJS[L.o].t:"Chọn vật để treo"}</div><small>Đọc vạch kim chỉ thị. P ≈ 10 · m.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"w",v:"1",p:()=>[LX+.017,TOP-S.lx.y-.1,0],tip:"Chạm để treo thêm 1 quả nặng 50 g",view:"lx"},...OBJS.map((o,i)=>({k:"obj",v:String(i),p:[KX+BP[i][0],BP[i][1]+.04,BP[i][2]],tip:"Chạm để treo "+o.t.toLowerCase()+" lên lực kế",view:"lk"})).filter((h,i)=>i!==S.lk.o)]);
    /* trạm */if(K.station){K.station(sN,'lx');K.station(kN,'lk');}
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(let n=1;n<=5;n++){S.lx.n=n;K._dockH("rec")}for(let i=0;i<3;i++){S.lk.o=i;K._dockH("read",String(+(OBJS[i].m*10).toFixed(1)))}}};
    return K.mount(st)}
});
})();
