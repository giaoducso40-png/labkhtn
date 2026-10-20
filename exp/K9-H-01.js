/* K9-H-01 · Tính chất chung của kim loại (SGK KHTN 9 – Kết nối tri thức, Bài 18)
   Bàn hóa học 3D (LabGL + LabChem3D):
   1. Kim loại + nước có phenolphthalein: Li, Na, K nổi; Na, K nóng chảy thành giọt tròn chạy trên mặt nước, K bốc cháy lửa tím hồng,
      Na có thể cháy lửa vàng khi dính thành chậu; Ca chìm, sủi bọt; Mg, Cu không phản ứng với nước lạnh. Vệt hồng do base tạo thành.
   2. Kim loại + dung dịch HCl: Mg sủi bọt nhanh, Zn và Fe sủi bọt vừa, Cu không phản ứng; thử khí bằng que đóm (tiếng nổ nhỏ).
   3. Kim loại + dung dịch muối: Zn đẩy Cu ra khỏi CuSO4 (lớp đồng đỏ nâu bám, màu xanh nhạt dần); Cu không phản ứng với ZnSO4. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,V3=G.V3;
const fmt=C.fmt,H=G.hex;

/* ---- số liệu và hành vi (nguồn ở tab Nguồn) ---- */
const PHYS={Li:{rho:.534,mp:180.5},Na:{rho:.97,mp:97.8},K:{rho:.89,mp:63.5},Ca:{rho:1.54,mp:842}};
const WATER={
  Li:{float:true,melt:null,life:40,kick:.07,fizz:26,dye:.5,fire:null,tarn:9},
  Na:{float:true,melt:.5,life:9,kick:.62,fizz:80,dye:1.7,fire:"Na",tarn:2.5},
  K:{float:true,melt:.22,life:5.2,kick:.9,fizz:120,dye:2.3,fire:"K",tarn:18},
  Ca:{float:false,melt:null,life:80,kick:0,fizz:30,dye:.55,fire:null,tarn:6},
  Mg:{float:false,none:true},Cu:{float:false,none:true}
};
const ACID={Mg:{rate:55,life:32,ten:"nhanh, mạnh"},Zn:{rate:16,life:400,ten:"vừa"},Fe:{rate:11,life:600,ten:"vừa, chậm hơn kẽm"},Cu:{rate:0,life:1e9,ten:"không có"}};
/* tên gọi theo Chương trình GDPT 2018 môn Hóa học: natri, kali, đồng, kẽm, sắt giữ tên tiếng Việt (kèm tên IUPAC); các nguyên tố khác dùng tên IUPAC */
const NAME={Li:"Lithium",Na:"Natri (sodium)",K:"Kali (potassium)",Ca:"Calcium",Mg:"Magnesium",Cu:"Đồng (copper)",Zn:"Kẽm (zinc)",Fe:"Sắt (iron)"};
const NL={Li:"lithium",Na:"natri",K:"kali",Ca:"calcium",Mg:"magnesium",Cu:"đồng",Zn:"kẽm",Fe:"sắt"};
const EQ={Na:"2Na + 2H₂O → 2NaOH + H₂↑",K:"2K + 2H₂O → 2KOH + H₂↑",Li:"2Li + 2H₂O → 2LiOH + H₂↑",Ca:"Ca + 2H₂O → Ca(OH)₂ + H₂↑",
  aMg:"Mg + 2HCl → MgCl₂ + H₂↑",aZn:"Zn + 2HCl → ZnCl₂ + H₂↑",aFe:"Fe + 2HCl → FeCl₂ + H₂↑",sZn:"Zn + CuSO₄ → ZnSO₄ + Cu"};

const GV=`<p><b>Yêu cầu cần đạt</b> (trích mục tiêu Bài 18)</p>
<ul class="tlist"><li>Trình bày được tính chất hóa học cơ bản của kim loại: tác dụng với phi kim, nước hoặc hơi nước, dung dịch hydrochloric acid, dung dịch muối.</li><li>Tiến hành được thí nghiệm, quan sát, mô tả hiện tượng và viết phương trình hóa học.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức</b></p>
<ul class="tlist"><li>Cho cả lớp dự đoán trước khi thả natri; chạy 0,25× để thấy mẩu natri vo tròn, chạy trên mặt nước và vệt hồng chìm xuống.</li><li>So sánh Li – Na – K cùng điều kiện để học sinh tự xếp mức độ phản ứng.</li><li>Ở ống HCl, cho học sinh thử que đóm trên ống Cu (không có tiếng nổ) để đối chứng.</li></ul>
<p style="margin-top:10px"><b>An toàn khi làm thật</b></p>
<ul class="tlist"><li>Kim loại kiềm do giáo viên cắt và bảo quản trong dầu; dùng mẩu rất nhỏ (Li 5 mm, Na 4 mm, K 3 mm), có tấm chắn an toàn, đeo kính bảo hộ.</li><li>Không cầm kim loại kiềm bằng tay; không dùng mẩu to.</li></ul>`;
const SRC=`<ul class="tlist">
<li>Mục tiêu, các thí nghiệm của Bài 18 KNTT (sodium với nước, zinc với HCl, zinc với CuSO₄) và kết luận: Na, K, Ca tác dụng với nước ở nhiệt độ thường tạo hydroxide và khí hydrogen; một số kim loại tác dụng với HCl tạo muối và H₂; kim loại tác dụng với muối tạo muối mới và kim loại mới (trừ K, Na, Ca): <a href="https://hoatieu.vn/powerpoint-khoa-hoc-tu-nhien-9-bai-18-tinh-chat-chung-cua-kim-loai-239494" target="_blank" rel="noopener">kế hoạch bài dạy Bài 18 (Hoatieu)</a>.</li>
<li>Li nổi, sủi khí, không bốc cháy; Na nổi, chạy trên mặt nước mạnh hơn, có thể bốc cháy lửa vàng, khói trắng khi dính thành chậu; K chạy mạnh, nóng chảy, sủi khí, bốc cháy lửa tím hồng (lilac); cỡ mẩu 5 mm, 4 mm, 3 mm; Li khó cắt nhất; bảo quản trong dầu: <a href="https://edu.rsc.org/experiments/reactivity-trends-of-the-alkali-metals/731.article" target="_blank" rel="noopener">Royal Society of Chemistry</a>.</li>
<li>Na thành giọt nóng chảy chạy quanh, để lại vệt hồng trong nước có phenolphthalein: <a href="https://www.colorado.edu/lab/lecture-demo-manual/x818-periodic-trends-alkali-metals-water" target="_blank" rel="noopener">University of Colorado</a>.</li>
<li>Na, K nóng chảy thành giọt chạy nhanh trên mặt nước; Ca chìm, sủi bọt hydrogen trên bề mặt; Mg chỉ phản ứng rất yếu với nước lạnh (Mg(OH)₂ không tan nên dừng lại), phản ứng với hơi nước; với HCl loãng: Mg nhanh, Zn và Fe vừa, Cu không phản ứng: <a href="https://pmt.physicsandmathstutor.com/download/Chemistry/GCSE/Notes/CIE-IGCSE/9-Metals/Detailed/9.4%20Reactivity%20series.pdf" target="_blank" rel="noopener">ghi chú IGCSE 9.4 (PMT)</a>.</li>
<li>Khối lượng riêng, nhiệt độ nóng chảy: Li 0,534 g/cm³, 180,5 °C; Na 0,97 g/cm³, 97,8 °C (mờ đi trong vài giây ngoài không khí); K 0,89 g/cm³, 63,5 °C; Ca 1,54 g/cm³: <a href="https://periodic-table.rsc.org/element/11/sodium" target="_blank" rel="noopener">bảng tuần hoàn RSC</a>.</li>
<li>Khí hydrogen làm que đóm cháy có tiếng nổ nhỏ; với CuSO₄: màu xanh nhạt dần, kim loại phủ lớp đồng màu đỏ nâu, dung dịch nóng lên: <a href="https://edu.rsc.org/download?ac=546506" target="_blank" rel="noopener">RSC – phản ứng thế</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p>
<ul class="tlist"><li>Thời gian phản ứng, tốc độ chạy của mẩu kim loại và lượng bọt khí là minh họa định tính, không phải số đo. Phản ứng kẽm với CuSO₄ được rút ngắn còn vài chục giây; làm thật cần lâu hơn.</li>
<li>Mẩu Ca và Mg không mô tả việc dung dịch vẩn đục; vệt hồng chỉ cho thấy dung dịch có base.</li>
<li>Lửa của Na chỉ xuất hiện khi mẩu dính thành chậu một lúc (theo mô tả của RSC: “có thể bốc cháy”).</li></ul>`;

LabKHTN.register("K9-H-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng sau mỗi thí nghiệm."},
  gv:GV,sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Bàn thí nghiệm hóa học 3D: chậu nước có phenolphthalein, ống nghiệm HCl, cốc dung dịch muối");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,simT=0,view="nuoc",bodyEl=null,stepIdx=0,frameN=0;
    const rnd=C.rng(918273);
    const S={p1:null,p2:null,locked:false,done:{Na:false,water2:new Set(),acid:new Set(),splint:false,salt:new Set()},obs:{},q:{},finished:false,recs:[],
      held:null,pieces:[],tubes:[null,null,null,null],beakers:[{m:null,t:0,dep:0},{m:null,t:0,dep:0}],tool:null,splint:null};

    /* ================= cảnh ================= */
    const root=new G.Node();
    root.add(K3.bench(R,8.6,4.4,day));
    /* --- chậu nước --- */
    const DISH={c:[0,0,.25],r:1.05,h:.55,lvl:.4};
    const dye=K3.DyeField(40,14,40),dyeTex=R.tex3D(40,14,40);
    const dish=root.add(new G.Node());dish.pos=DISH.c;
    dish.add(K3.glass(R,DISH.r,DISH.h,{lip:.02,th:.03}));
    const water=dish.add(K3.waterVolume(R,DISH.r-.03,DISH.h,DISH.lvl,dyeTex,{orig:DISH.c,k:22,dyeCol:[.96,.22,.6]}));
    const ripple=dish.add(R.mesh(G.tube(Array.from({length:49},(_,i)=>[Math.cos(i/48*6.283),0,Math.sin(i/48*6.283)]),.04,6),{type:"unlit",color:"#FFFFFF",alpha:.0,transparent:true,order:2}));ripple.visible=false;
    /* --- khay kim loại và lọ dầu --- */
    const tray=root.add(new G.Node());tray.pos=[-2.75,0,1.05];
    tray.add(R.mesh(G.box(2.2,.04,.9,.015,2),{color:"#EEF1F4",rough:.3})).pos=[0,.02,0];
    const JAR=[["Li",-.75],["Na",-.25],["K",.25]];const jarNodes={};
    for(const [m,x] of JAR){const j=tray.add(new G.Node());j.pos=[x,.04,-.05];j.add(K3.glass(R,.17,.42,{lip:.0,th:.02}));j.add(K3.liquid(R,.15,.03,.3,H("#E8D27A"),.38));
      const pc=j.add(R.mesh(K3.pieceGeom("cube"),{color:K3.METAL[m].tarn,rough:.6,metal:.6}));pc.pos=[0,.1,0];pc.size(1.3);
      j.add(R.mesh(G.cylinder(.18,.05,32),{color:"#30364A",rough:.5})).pos=[0,.42,0];jarNodes[m]=j}
    const dryN={};for(const [m,x,kind] of [["Ca",.75,"granule"],["Mg",-.6,"ribbon"],["Cu",.0,"wire"]]){const d=tray.add(new G.Node());d.pos=m==="Ca"?[x,.04,-.05]:[x,.04,.3];
      d.add(R.mesh(G.lathe([[0,0],[.16,0],[.2,.04],[.17,.05],[.0,.012]],32),{type:"glass",color:"#E6F2FF",alpha:.45}));const pc=d.add(R.mesh(K3.pieceGeom(kind),{color:K3.METAL[m].col,rough:K3.METAL[m].rough,metal:.85}));pc.pos=[0,.025,0];if(kind!=="granule")pc.rot(Math.PI/2,0,0);dryN[m]=d}
    /* lọ phenolphthalein */
    const ph=root.add(new G.Node());ph.pos=[1.12,0,.82];ph.add(K3.glass(R,.16,.45,{lip:0}));ph.add(K3.liquid(R,.14,.03,.3,H("#F4F6FA"),.25));ph.add(R.mesh(G.lathe([[0,.45],[.08,.45],[.09,.52],[.06,.66],[0,.68]],24),{color:"#1F2333",rough:.5}));
    /* --- giá ống nghiệm HCl --- */
    const RACK={c:[2.75,0,-.35]},TX=[-.48,-.16,.16,.48],TUBE={r:.11,h:1.05,lvl:.68};
    const rack=root.add(new G.Node());rack.pos=RACK.c;
    const wood={color:"#9C6B3F",rough:.55,key:"wood",hooks:{fu:K3.NOISE+"uniform float uNF;",fs:`{float g=vn(vec3(vO.x*3.,vO.y*40.,vO.z*3.))*.6+vn(vO*18.)*.4;base.rgb*=.8+.35*g;}`},uniforms:{uNF:1}};
    rack.add(R.mesh(G.box(1.45,.06,.42,.02,2),wood)).pos=[0,.03,0];rack.add(R.mesh(G.box(1.45,.05,.42,.02,2),wood)).pos=[0,.62,0];
    for(const x of [-.7,.7])rack.add(R.mesh(G.box(.06,.62,.42,.015,2),wood)).pos=[x,.33,0];
    const tubes=TX.map((x,i)=>{const t=rack.add(new G.Node());t.pos=[x,.07,0];t.add(K3.testTube(R,TUBE.r,TUBE.h));const liq=t.add(R.mesh(K3.liquidGeom(TUBE.r-.014,.014,TUBE.lvl,true),{color:H("#CFE2F5"),alpha:.46,rough:.04,coat:.6,order:1}));return{node:t,liq,x,i}});
    /* --- cốc dung dịch muối --- */
    const BK=[{c:[-2.55,0,-1.05],sol:"CuSO₄",col:H("#2F7FD8"),metal:"Zn",strip:"Zn"},{c:[-1.75,0,-1.05],sol:"ZnSO₄",col:H("#EAF2FB"),metal:"Cu",strip:"Cu"}];
    const beakers=BK.map((b,i)=>{const n=root.add(new G.Node());n.pos=b.c;n.add(K3.glass(R,.34,.62,{lip:.025}));
      const liq=n.add(R.mesh(K3.liquidGeom(.31,.03,.44,false),{color:b.col,alpha:i===0?.62:.22,rough:.05,coat:.4,order:1}));
      const stripM={color:K3.METAL[b.metal].col,rough:.35,metal:.85,key:"strip",hooks:{fu:K3.NOISE+"uniform float uDep,uLvl;",fs:`{float n=vn(vO*36.)*.7+vn(vO*90.)*.3;float under=step(vO.y,uLvl);float cov=smoothstep(1.-uDep*1.15,1.-uDep*1.15+.12,n)*under;base.rgb=mix(base.rgb,vec3(.42,.12,.05),cov);rough=mix(rough,.85,cov);metal=mix(metal,.15,cov);}`},uniforms:{uDep:0,uLvl:0}};
      const strip=n.add(R.mesh(K3.pieceGeom("strip"),stripM));strip.pos=[0,1.4,0];strip.visible=false;return{n,liq,strip,def:b,i}});
    /* --- hạt --- */
    const fizz=root.add(K3.bubbles(R,900));const smoke=root.add(K3.puffs(R,160,"#F2F2F2"));const sparks=root.add(K3.puffs(R,80,"#FFFFFF",true));
    const flames={Na:root.add(K3.flame(R,[1,.58,.08],[1,.93,.7])),K:root.add(K3.flame(R,[.72,.42,1],[1,.85,1])),splint:root.add(K3.flame(R,[1,.55,.1],[1,.9,.6]))};Object.values(flames).forEach(f=>f.visible=false);
    /* --- dụng cụ cầm tay: kẹp, que đóm --- */
    const tongs=root.add(new G.Node());tongs.add(R.mesh(G.merge([G.box(.03,.02,.9,.008,1),G.box(.03,.02,.9,.008,1)]),{color:"#B8BEC8",rough:.25,metal:1}));tongs.visible=false;
    const splint=root.add(new G.Node());splint.add(R.mesh(G.cylinder(.018,.9,10),{color:"#D9B37A",rough:.7})).quat=G.Q.euler(0,0,-1.1);splint.visible=false;
    const ember=splint.add(R.mesh(G.sphere(.03,10,8),{type:"unlit",color:"#FF8A2A"}));ember.pos=[.8,.4,0];

    /* ================= nhãn ================= */
    const LB=G.labels(over,R,{bounds:api.safe});
    const LBL=[["nuoc","Chậu nước có phenolphthalein",[0,.62,-.85]],["ban","Chậu nước + phenolphthalein",[0,.7,-.9]],["ban","Kim loại bảo quản trong dầu",[-2.75,.62,1.05]],["nuoc","Lọ dầu: Li · Na · K",[-2.75,.62,1.0]],
      ["ban","Ống nghiệm HCl loãng",[2.75,1.3,-.35]],["ban","Dung dịch CuSO₄",[-2.55,.78,-1.05]],["ban","Dung dịch ZnSO₄",[-1.75,.78,-1.05]],
      ["muoi","CuSO₄ + lá kẽm",[-2.55,.8,-1.05]],["muoi","ZnSO₄ + lá đồng",[-1.75,.8,-1.05]],
      ...TX.map((x,i)=>["axit",`Ống ${i+1}`,[RACK.c[0]+x,i%2?1.42:1.2,RACK.c[2]]])].map(([v,t,p])=>{const it=LB.add(`<span>${t}</span>`,p);it.view=v;return it});
    const tubeLab=TX.map((x,i)=>LBL.find(l=>l.view==="axit"&&l.p[0]===RACK.c[0]+x));const saltLab=[0,1].map(i=>LBL.filter(l=>l.view==="muoi")[i]);
    const pieceLab=LB.add(`<span></span>`,[0,0,0],"follow");pieceLab.view="nuoc";
    const info=document.createElement("div");info.className="gl-legend glass";info.innerHTML="";over.appendChild(info);

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:.05,maxPitch:1.35});
    const PRE={ban:{t:[0,.25,0],yaw:0,pitch:.55,rad:4.4},nuoc:{t:[-.55,.25,.35],yaw:0,pitch:.68,rad:1.9},axit:{t:[2.64,.84,-.35],yaw:-.22,pitch:.2,rad:1.0},muoi:{t:[-2.15,.5,-1.05],yaw:.2,pitch:.3,rad:1.0}};
    let safe={x:0,y:0,w:1,h:1},zoom=1;
    function fitDist(rad){const s=R.size();const tv=Math.tan(cam.fov/2)*safe.h/s.h,th=Math.tan(cam.fov/2)*(s.w/s.h)*safe.w/s.w;return rad/Math.min(tv,th)}
    const PREP={nuoc:{t:[DISH.c[0],.3,DISH.c[2]],rad:1.3},axit:{t:[2.75,.7,-.35],rad:.95},muoi:{t:[-2.15,.5,-1.05],rad:.95}};
    const preOf=v=>{const s=R.size();return s.w<s.h*.9&&PREP[v]?Object.assign({},PRE[v],PREP[v]):PRE[v]};
    function goView(v,instant){view=v;const p=preOf(v);const to={target:p.t,yaw:p.yaw,pitch:p.pitch,dist:fitDist(p.rad)*zoom};if(instant)Object.assign(cam,{target:[...p.t],yaw:p.yaw,pitch:p.pitch,dist:to.dist});else orbit.fly(to,.9);applyVis();refresh()}
    function applyVis(){for(const it of LBL)it.on=it.view===view||(view==="ban"&&false);pieceLab.on=false}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));safe=api.safe();const s=R.size();cam.shift=[2*(safe.x+safe.w/2)/s.w-1,1-2*(safe.y+safe.h/2)/s.h];
      info.style.left=(safe.x+10)+"px";info.style.top=(safe.y+10)+"px";cam.dist=fitDist(preOf(view).rad)*zoom;const port=s.w<s.h*.9;if(R._port!==undefined&&R._port!==port){R._port=port;goView(view,true)}R._port=port}
    function theme(){day=api.day;const E=R.env;
      if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=.55}
      else{E.bgTop=H("#1B2347");E.bgBot=H("#06091A");E.bgGlow=H("#2B3670");E.sky=H("#6070A0");E.gnd=H("#171B2B");E.hor=H("#3E4868");E.exposure=.8;E.ink=0}
      E.k1c=[2.1,2.0,1.85];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9];
      over.classList.toggle("day",day)}

    /* ================= kim loại + nước ================= */
    function hold(m){if(S.pieces.some(p=>p.phase!=="done"&&WATER[p.m].float))return api.toast("Chờ mẩu kim loại đang phản ứng hết đã.","info",2000);
      const w=WATER[m];S.held={m,t:0};goView("nuoc");
      api.toast(m==="Li"||m==="Na"||m==="K"?`Mẩu ${NL[m]} vừa cắt từ lọ dầu${m==="Li"?" (lithium khó cắt nhất)":""}: mặt cắt sáng ánh kim, mờ dần trong không khí. Chạm vào mặt nước để thả.`:`Đã kẹp mẩu ${NL[m]}. Chạm vào mặt nước để thả.`,"info",4200);refresh()}
    const GEO={};const geo=k=>GEO[k]||(GEO[k]=K3.pieceGeom(k));
    function newMesh(m,kind){const n=root.add(R.mesh(geo(kind),{color:K3.METAL[m].col,rough:K3.METAL[m].rough,metal:.95,coat:.2}));n.visible=false;return n}
    const heldM={};function heldMesh(m,kind){return heldM[m]||(heldM[m]=newMesh(m,kind))}
    function drop(x,z){const h=S.held;if(!h)return;S.held=null;const w=WATER[h.m];
      const r=Math.hypot(x-DISH.c[0],z-DISH.c[2]);const lim=DISH.r-.18;if(r>lim){x=DISH.c[0]+(x-DISH.c[0])*lim/r;z=DISH.c[2]+(z-DISH.c[2])*lim/r}
      const kind=h.m==="Ca"?"granule":h.m==="Mg"?"ribbon":h.m==="Cu"?"wire":"cube";
      const p={m:h.m,kind,x,z,y:.85,vy:0,vx:0,vz:0,mass:1,phase:"fall",t:0,tarn:Math.min(1,h.t/w.tarn||0),melt:0,fire:0,stuck:0,next:0,spin:rnd()*6,obs:new Set(),dyeTot:0,maxSpeed:0,burned:false};
      p.mesh=newMesh(h.m,kind);if(kind==="cube")p.ball=newMesh(h.m,"ball");S.pieces.push(p);if(G.audio)G.audio.ensure();refresh()}
    function stepWater(dt){
      const top=DISH.lvl;let fizzLevel=0;
      for(const p of S.pieces){if(p.phase==="done")continue;const w=WATER[p.m];p.t+=dt;
        if(p.phase==="fall"){p.vy-=9.8*.25*dt;p.y+=p.vy*dt;if(p.y<=top+.03){p.y=top+.02;p.phase=w.float?"float":"sink";p.vy=w.float?0:-.1;splash(p.x,p.z,w.float?.5:.8)}continue}
        if(p.phase==="sink"){p.vy=Math.max(p.vy-dt*1.2,-.35);p.y+=p.vy*dt;const floor=.045;if(p.y<=floor){p.y=floor;p.phase=w.none?"rest":"react";p.t=0}continue}
        const rate=w.none?0:1;
        if(p.phase==="rest"){if(p.t>4&&!p.recorded){p.recorded=true;recordWater(p)}continue}
        /* phản ứng */
        if(w.melt!=null)p.melt=Math.min(1,p.melt+dt/w.melt);
        p.mass-=dt/w.life*(.75+.5*rnd());
        if(p.phase==="float"){
          p.next-=dt;if(p.next<=0){p.next=.05+rnd()*.14;const a=rnd()*6.283,k=w.kick*(.55+.9*rnd());p.vx+=Math.cos(a)*k;p.vz+=Math.sin(a)*k}
          const damp=Math.exp(-2.4*dt);p.vx*=damp;p.vz*=damp;p.x+=p.vx*dt;p.z+=p.vz*dt;
          const dx=p.x-DISH.c[0],dz=p.z-DISH.c[2],r=Math.hypot(dx,dz),lim=DISH.r-.12;
          if(r>lim){const nx=dx/r,nz=dz/r;const vn=p.vx*nx+p.vz*nz;if(vn>0){p.vx-=1.6*vn*nx;p.vz-=1.6*vn*nz}p.x=DISH.c[0]+nx*lim;p.z=DISH.c[2]+nz*lim;p.stuck+=dt*(Math.hypot(p.vx,p.vz)<.25?1:.4)}else p.stuck=Math.max(0,p.stuck-dt*.5);
          const sp=Math.hypot(p.vx,p.vz);p.maxSpeed=Math.max(p.maxSpeed,sp);p.spin+=sp*dt*14;
          /* lửa */
          if(w.fire==="K"&&p.t>.3&&p.mass>.04)p.fire=Math.min(1,p.fire+dt*5);
          else if(w.fire==="Na"&&p.stuck>.55&&p.mass>.15&&!p.burned){p.burned=true}
          if(w.fire==="Na"&&p.burned)p.fire=Math.min(1,p.fire+dt*3);
          if(p.fire>0&&p.mass<.06)p.fire=Math.max(0,p.fire-dt*6);
        }
        /* bọt khí, khói, chất chỉ thị */
        const rr=.055*Math.cbrt(Math.max(p.mass,.001));const n=w.fizz*rate*dt*(p.mass>.02?1:.3);fizzLevel+=w.fizz*rate*(p.mass>.02?1:0);
        for(let i=0;i<n+(rnd()<n%1?1:0);i++){const a=rnd()*6.283;
          if(p.phase==="float")fizz.spawn([p.x+Math.cos(a)*rr*(1+rnd()*.6),top+.006,p.z+Math.sin(a)*rr*(1+rnd()*.6)],.011+rnd()*.02,[Math.cos(a)*.12,.03+rnd()*.05,Math.sin(a)*.12],.3+rnd()*.5,1);
          else fizz.spawn([p.x+Math.cos(a)*rr*.8,p.y+rnd()*rr,p.z+Math.sin(a)*rr*.8],.009+rnd()*.014,[(rnd()-.5)*.03,.22+rnd()*.12,(rnd()-.5)*.03],2.2,.85)}
        if(p.fire>.3&&rnd()<dt*30)smoke.spawn([p.x+(rnd()-.5)*.05,top+.08,p.z+(rnd()-.5)*.05],.035,[(rnd()-.5)*.05,.32+rnd()*.12,(rnd()-.5)*.05],2.4,.18,2.2);
        if(p.phase==="float"&&(p.m==="Na"||p.m==="K")&&rnd()<dt*14)smoke.spawn([p.x,top+.03,p.z],.02,[0,.18,0],1.1,.07,2);
        const u=(p.x-DISH.c[0])/(2*(DISH.r-.03))+.5,wv=(p.z-DISH.c[2])/(2*(DISH.r-.03))+.5,v=p.phase==="float"?.93:.06;
        if(p.mass>.01){dye.add(u,v,wv,w.dye*dt*11*(p.phase==="float"?1:.6),.03);p.dyeTot+=w.dye*dt}
        /* ghi nhận hiện tượng */
        p.obs.add("khi");if(p.phase==="float")p.obs.add("noi");else p.obs.add("chim");if(p.melt>.9)p.obs.add("tron");if(p.maxSpeed>.35)p.obs.add("chay");if(p.fire>.5)p.obs.add(p.m==="K"?"lilac":"vang");if(p.dyeTot>.3)p.obs.add("hong");
        if(p.mass<=0){p.mass=0;p.phase="done";if(p.m==="K"){G.audio&&G.audio.pop(.8);for(let i=0;i<14;i++)sparks.spawn([p.x,top+.03,p.z],.012,[(rnd()-.5)*1.2,.6+rnd()*.8,(rnd()-.5)*1.2],.35,.9,.3)}if(!p.recorded){p.recorded=true;recordWater(p)}}
        if(p.m==="Ca"&&p.t>14&&!p.recorded){p.recorded=true;recordWater(p)}
        if(p.m==="Li"&&p.t>14&&!p.recorded){p.recorded=true;recordWater(p)}
      }
      /* âm xèo xèo */
      if(G.audio&&G.audio.ready){if(!hiss&&fizzLevel>0)hiss=G.audio.hiss();if(hiss)hiss.set(Math.min(1,fizzLevel/110))}
      dye.step(dt,.4,.32);if(frameN%2===0)dyeTex.update(dye.bytes());
    }
    let hiss=null;
    function splash(x,z,a){ripple.visible=true;ripple.t0=simT;ripple.x=x;ripple.z=z;ripple.a=a;for(let i=0;i<10;i++){const g=rnd()*6.283;fizz.spawn([x,DISH.lvl+.01,z],.012,[Math.cos(g)*.35,.5+rnd()*.4,Math.sin(g)*.35],.3,.8)}}
    function obsText(p){const o=p.obs,w=WATER[p.m];const t=[];
      if(w.none){t.push(p.m==="Cu"?"chìm xuống đáy, không có bọt khí":"chìm xuống đáy, gần như không thấy bọt khí (nước lạnh)");return t.join(", ")}
      t.push(o.has("noi")?"nổi trên mặt nước":"chìm xuống đáy");if(o.has("tron"))t.push("nóng chảy thành giọt tròn sáng");if(o.has("chay"))t.push("chạy nhanh trên mặt nước");
      t.push("sủi bọt khí");if(o.has("vang"))t.push("bốc cháy lửa vàng, khói trắng");if(o.has("lilac"))t.push("bốc cháy lửa tím hồng");if(o.has("hong"))t.push("dung dịch chuyển màu hồng");if(p.phase==="done")t.push("mẩu kim loại tan hết");return t.join(", ")}
    function recordWater(p){const w=WATER[p.m];S.recs.push({kind:"water",m:p.m});if(p.m==="Na")S.done.Na=true;else S.done.water2.add(p.m);
      api.record({lan:String(S.recs.length),tn:`${NAME[p.m]} + nước (có phenolphthalein)`,ht:obsText(p),kl:w.none?(p.m==="Mg"?"Với nước lạnh chỉ phản ứng rất yếu rồi dừng (Mg(OH)₂ không tan phủ bề mặt); magnesium phản ứng với hơi nước":"Không phản ứng với nước ở nhiệt độ thường"):`Có phản ứng: ${EQ[p.m]}; dung dịch có base làm phenolphthalein hóa hồng`});refresh()}

    /* ================= kim loại + HCl ================= */
    function addToTube(m,i){if(i==null)i=S.tubes.findIndex(t=>!t);if(i<0)return api.toast("Các ống đã có kim loại. Bấm “Thay acid” để làm lại.","info",2600);
      if(S.tubes[i])return api.toast(`Ống ${i+1} đã có ${NAME[S.tubes[i].m]}.`,"info",2000);
      S.tubes[i]={m,mass:1,t:0,gas:0,y:.9,phase:"fall",rec:false};goView("axit");refresh()}
    const tubePieces={};
    function stepAcid(dt){let lvl=0;
      S.tubes.forEach((tb,i)=>{if(!tb)return;tb.t+=dt;const a=ACID[tb.m];
        if(tb.phase==="fall"){tb.y-=dt*1.6;if(tb.y<=.04){tb.y=.04;tb.phase="react";tb.t=0}return}
        if(a.rate>0&&tb.mass>0){tb.mass-=dt/a.life;const n=a.rate*dt*(tb.mass>0?1:0);lvl+=a.rate;tb.gas=Math.min(3,tb.gas+a.rate*dt/60);
          const base=[RACK.c[0]+TX[i],RACK.c[1]+.07,RACK.c[2]];for(let k=0;k<n+(rnd()<n%1?1:0);k++)fizz.spawn([base[0]+(rnd()-.5)*.08,base[1]+tb.y+rnd()*.12,base[2]+(rnd()-.5)*.08],.007+rnd()*.012,[(rnd()-.5)*.02,.32+rnd()*.25,(rnd()-.5)*.02],(TUBE.lvl-.12)/.4,.8)}
        if(tb.t>3.5&&!tb.rec){tb.rec=true;S.recs.push({kind:"acid",m:tb.m});S.done.acid.add(tb.m);
          api.record({lan:String(S.recs.length),tn:`${NAME[tb.m]} + dung dịch HCl loãng`,ht:a.rate>0?`sủi bọt khí ${a.ten}${tb.m==="Mg"?", mẩu magnesium tan dần":""}`:"không có hiện tượng",kl:a.rate>0?`Có phản ứng: ${EQ["a"+tb.m]}`:"Không phản ứng với HCl"});refresh()}});
      if(G.audio&&G.audio.ready&&hissA)hissA.set(Math.min(.5,lvl/120));else if(G.audio&&G.audio.ready&&lvl>0)hissA=G.audio.hiss()}
    let hissA=null;
    function splintTest(i){const tb=S.tubes[i];S.splint={i,t:0,res:null};goView("axit");
      const pop=tb&&tb.gas>.18;S.splint.res=pop;refresh()}
    function stepSplint(dt){const sp=S.splint;if(!sp){splint.visible=false;flames.splint.visible=false;return}sp.t+=dt;const x=RACK.c[0]+TX[sp.i],z=RACK.c[2];
      const k=1-Math.pow(1-Math.min(1,sp.t/.9),3);const tip=[x-.55+.53*k,1.95-.72*k,z+.32-.3*k];splint.visible=true;splint.pos=[tip[0]-.8,tip[1]-.41,tip[2]];flames.splint.visible=true;flames.splint.pos=[tip[0],tip[1]-.02,tip[2]];flames.splint.scl=[.4,.4,.4];
      if(sp.t>.9&&!sp.fired){sp.fired=true;const tb=S.tubes[sp.i];
        if(sp.res){G.audio&&G.audio.pop(1);for(let q=0;q<18;q++)sparks.spawn([x,1.15,z],.02,[(rnd()-.5)*.8,.4+rnd()*.6,(rnd()-.5)*.8],.3,.9,.4);tb.gas=0;S.done.splint=true;api.toast("Nghe tiếng nổ nhỏ (“bép”) ở miệng ống: khí thoát ra là hydrogen.","ok",4200);
          S.recs.push({kind:"splint"});api.record({lan:String(S.recs.length),tn:`Que đóm cháy đưa vào miệng ống ${sp.i+1} (${tb?NL[tb.m]:""})`,ht:"có tiếng nổ nhỏ",kl:"Khí sinh ra là hydrogen (H₂)"})}
        else{api.toast(tb?`Ống ${sp.i+1} không có tiếng nổ: ${ACID[tb.m].rate?"chưa đủ khí, đợi thêm vài giây":"không có khí thoát ra"}.`:`Ống ${sp.i+1} chưa có kim loại.`,"info",3200);
          if(tb&&!ACID[tb.m].rate&&!tb.ctl){tb.ctl=true;S.recs.push({kind:"splint0"});api.record({lan:String(S.recs.length),tn:`Que đóm cháy đưa vào miệng ống ${sp.i+1} (${NL[tb.m]})`,ht:"không có tiếng nổ, que đóm vẫn cháy bình thường",kl:"Không có khí hydrogen (đối chứng)"})}}refresh()}
      if(sp.t>2.2)S.splint=null}

    /* ================= kim loại + muối ================= */
    function addStrip(bi){const b=S.beakers[bi];if(b.m)return api.toast("Cốc này đã có lá kim loại.","info",1800);b.m=BK[bi].metal;b.t=0;b.y=1.4;goView("muoi");refresh()}
    function stepSalt(dt){S.beakers.forEach((b,i)=>{const B=beakers[i];if(!b.m){B.strip.visible=false;return}b.t+=dt;B.strip.visible=true;b.y=Math.max(.5,b.y-dt*1.5);B.strip.pos=[0,b.y,0];
        if(i===0&&b.y<=.5){b.dep=Math.min(1,b.dep+dt/40);const blue=H("#2F7FD8"),pale=H("#B9D4EE");B.liq.mat.color=blue.map((c,k)=>c+(pale[k]-c)*b.dep*.75);B.liq.mat.alpha=.62-.3*b.dep;
        }
        B.strip.mat.uniforms.uDep=b.dep;B.strip.mat.uniforms.uLvl=.44-b.y;
        if(b.t>(i===0?14:8)&&!b.rec){b.rec=true;S.recs.push({kind:"salt",i});S.done.salt.add(i);
          api.record({lan:String(S.recs.length),tn:i===0?"Lá kẽm + dung dịch CuSO₄":"Lá đồng + dung dịch ZnSO₄",ht:i===0?"lá kẽm phủ dần lớp chất rắn màu đỏ nâu, màu xanh của dung dịch nhạt dần":"không có hiện tượng",kl:i===0?`Có phản ứng: ${EQ.sZn}`:"Không phản ứng (đồng hoạt động kém hơn kẽm)"});refresh()}})}

    /* ================= con trỏ ================= */
    function pick(px,py){const r=R.ray(px,py);
      const tw=G.hit.planeY(r,DISH.lvl);if(tw!=null){const p=G.hit.at(r,tw);if(Math.hypot(p[0]-DISH.c[0],p[2]-DISH.c[2])<DISH.r)return{dish:p}}
      for(let i=0;i<4;i++){const x=RACK.c[0]+TX[i];const t=G.hit.box(r,[x-.14,0,RACK.c[2]-.14],[x+.14,1.2,RACK.c[2]+.14]);if(t!=null)return{tube:i}}
      for(let i=0;i<2;i++){const c=BK[i].c;const t=G.hit.box(r,[c[0]-.36,0,c[2]-.36],[c[0]+.36,.7,c[2]+.36]);if(t!=null)return{beaker:i}}
      for(const [m,x] of JAR){const t=G.hit.box(r,[-2.75+x-.2,0,1.0-.2],[-2.75+x+.2,.5,1.0+.2]);if(t!=null)return{jar:m}}
      for(const m in dryN){const d=dryN[m];const p=[tray.pos[0]+d.pos[0],0,tray.pos[2]+d.pos[2]];const t=G.hit.box(r,[p[0]-.22,0,p[2]-.22],[p[0]+.22,.2,p[2]+.22]);if(t!=null)return{jar:m}}
      return null}
    const ptr=C.pointer(cv,{down(p,e){orbit.start(p,e.pointerId);return true},move(p,e){orbit.move(p,e.pointerId)},up(p,e,tap){orbit.end(e.pointerId);if(tap)onTap(p)},cancel(){orbit.end()},
      hover(p){if(frameN%3)return;const k=pick(p.x,p.y);cv.style.cursor=k&&(k.jar||k.tube!=null&&S.tool||k.beaker!=null||k.dish&&S.held)?"pointer":"grab"}});
    function onWheel(e){e.preventDefault();zoom=C.clamp(zoom*Math.exp(e.deltaY*.0012),.45,2.4);cam.dist=fitDist(preOf(view).rad)*zoom}
    cv.addEventListener("wheel",onWheel,{passive:false});
    function onTap(p){const k=pick(p.x,p.y);if(!k)return;G.audio&&G.audio.ensure();
      if(k.dish&&S.held){drop(k.dish[0],k.dish[2]);return}
      if(k.jar){if(WATER[k.jar])hold(k.jar);return}
      if(k.tube!=null){if(S.tool==="splint"){splintTest(k.tube);return}if(S.tool&&ACID[S.tool]){addToTube(S.tool,k.tube);S.tool=null;refresh();return}api.toast("Chọn kim loại hoặc que đóm ở khay trước.","info",2000);return}
      if(k.beaker!=null){addStrip(k.beaker);return}}

    /* ================= khay ================= */
    const IC={
      nuoc:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 18h28v6a14 8 0 0 1-28 0z"/><path d="M10 22c3 2 6 2 10 0s7-2 10 0"/></svg>',
      axit:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M14 5v24a6 6 0 0 0 12 0V5"/><path d="M14 18h12"/><circle cx="20" cy="26" r="1.6" fill="currentColor"/><circle cx="18" cy="22" r="1.2" fill="currentColor"/></svg>',
      muoi:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M9 8v24h22V8"/><path d="M9 18h22v14H9z" fill="currentColor" opacity=".25" stroke="none"/><path d="M20 4v22" stroke-width="3"/></svg>',
      ban:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 24h32M8 24v10M32 24v10"/><path d="M10 24v-8h6v8M22 24V12h4v12"/></svg>',
      splint:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 34L28 14"/><path d="M30 6c3 4 3 7 0 9-3-2-3-5 0-9z" fill="currentColor"/></svg>',
      reset:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 20a12 12 0 1 0 4-9L8 15"/><path d="M8 7v8h8"/></svg>'
    };
    const chip=(m,sub)=>`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="${K3.METAL[m].col}" stroke="currentColor" stroke-width="1.5"/><text x="20" y="25" text-anchor="middle" font-size="13" font-weight="800" fill="#1B1F2E">${m}</text></svg>`;
    function refreshDock(){
      const st=`<div class="tseg" role="group" aria-label="Trạm thí nghiệm"><button class="titem" data-k="view" data-v="nuoc" aria-pressed="${view==="nuoc"}" title="Kim loại + nước">${IC.nuoc}Nước</button><button class="titem" data-k="view" data-v="axit" aria-pressed="${view==="axit"}" title="Kim loại + acid">${IC.axit}Acid</button><button class="titem" data-k="view" data-v="muoi" aria-pressed="${view==="muoi"}" title="Kim loại + muối">${IC.muoi}Muối</button><button class="titem" data-k="view" data-v="ban" aria-pressed="${view==="ban"}" title="Toàn bàn">${IC.ban}Cả bàn</button></div><hr>`;
      let items="";
      if(view==="nuoc"||view==="ban")items=`<div class="tgrid">`+["Li","Na","K","Ca","Mg","Cu"].map(m=>`<button class="titem" data-k="hold" data-v="${m}" aria-pressed="${S.held&&S.held.m===m}">${chip(m)}${K3.METAL[m].vi}</button>`).join("")+`</div><button class="titem" data-k="dropC" ${S.held?"":"disabled"}>${IC.nuoc}Thả vào<br>giữa chậu</button><button class="titem" data-k="clearW">${IC.reset}Thay nước</button>`;
      else if(view==="axit")items=`<div class="tgrid">`+["Mg","Zn","Fe","Cu"].map(m=>`<button class="titem" data-k="tool" data-v="${m}" aria-pressed="${S.tool===m}">${chip(m)}${K3.METAL[m].vi}</button>`).join("")+`</div><button class="titem" data-k="tool" data-v="splint" aria-pressed="${S.tool==="splint"}">${IC.splint}Que đóm<br>đang cháy</button><button class="titem" data-k="clearA">${IC.reset}Thay acid</button>`;
      else items=`<button class="titem" data-k="strip" data-v="0" ${S.beakers[0].m?"disabled":""}>${chip("Zn")}Lá kẽm →<br>CuSO₄</button><button class="titem" data-k="strip" data-v="1" ${S.beakers[1].m?"disabled":""}>${chip("Cu")}Lá đồng →<br>ZnSO₄</button><button class="titem" data-k="clearS">${IC.reset}Làm lại</button>`;
      api.dock.innerHTML=st+items}
    function onDock(e){const t=e.target.closest("[data-k]");if(!t||t.disabled)return;const k=t.dataset.k,v=t.dataset.v;G.audio&&G.audio.ensure();
      if(k==="view"){zoom=1;goView(v)}else if(k==="hold")hold(v);else if(k==="dropC"){if(S.held)drop(DISH.c[0]+(rnd()-.5)*.3,DISH.c[2]+(rnd()-.5)*.3)}
      else if(k==="clearW"){S.pieces.forEach(p=>{p.mesh.visible=false;if(p.ball)p.ball.visible=false});S.pieces=[];dye.clear();dyeTex.update(dye.bytes());S.held=null;fizz.list.length=0;smoke.list.length=0;refresh()}
      else if(k==="tool"){S.tool=S.tool===v?null:v;if(S.tool)api.toast(v==="splint"?"Chạm vào một ống nghiệm để đưa que đóm vào miệng ống.":`Chạm vào một ống nghiệm để cho ${NAME[v]} vào.`,"info",2200);refresh()}
      else if(k==="clearA"){S.tubes=[null,null,null,null];fizz.list.length=0;refresh()}
      else if(k==="strip")addStrip(+v);else if(k==="clearS"){S.beakers=[{m:null,t:0,dep:0},{m:null,t:0,dep:0}];beakers[0].liq.mat.color=H("#2F7FD8");beakers[0].liq.mat.alpha=.62;refresh()}}
    api.dock.addEventListener("click",onDock);

    /* ================= hướng dẫn ================= */
    const doneW2=()=>S.done.water2.size>=2,doneA=()=>S.done.acid.size>=3&&S.done.splint,doneS=()=>S.done.salt.size>=2;
    function refresh(){refreshDock();api.okAt(0,S.locked);api.okAt(1,S.done.Na&&doneW2()&&doneA()&&doneS());
      api.okAt(2,S.obs.a==="rho"&&S.obs.b==="nhiet"&&S.obs.c==="base"&&S.obs.d==="KNaLi");api.okAt(3,S.finished);if(bodyEl)renderStep()}
    function renderStep(){const el=bodyEl;if(!el)return;const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      const opt=(attr,cur,arr,dis)=>`<div class="opts">${arr.map(([k,t],j)=>`<button class="opt" data-${attr}="${k}" aria-pressed="${cur===k}" ${dis?"disabled":""}><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>`;
      if(stepIdx===0){
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2"><b>Câu 1.</b> Thả một mẩu natri nhỏ vào chậu nước có vài giọt phenolphthalein. Em dự đoán:</p>
          ${opt("p1",S.p1,[["chim","Natri chìm xuống đáy, không có hiện tượng gì"],["noi","Natri nổi, chạy trên mặt nước, sủi khí, nước chuyển màu hồng"],["xanh","Natri tan, nước chuyển màu xanh"]],S.locked)}
          <p class="lead2"><b>Câu 2.</b> Kim loại nào <b>không</b> tác dụng với dung dịch HCl loãng?</p>
          ${opt("p2",S.p2,[["Zn","Kẽm"],["Cu","Đồng"],["Fe","Sắt"]],S.locked)}
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}
          <p class="muted" style="font-size:.84rem">Kéo để xoay bàn thí nghiệm, lăn chuột hoặc chụm hai ngón để phóng to.</p>`;
      }else if(stepIdx===1){
        const li=(ok,now,html)=>`<li class="${ok?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${html}</div></li>`;
        el.innerHTML=`<h3>Làm thí nghiệm</h3><ol class="todo">
          ${li(S.done.Na,!S.done.Na,`<b>Natri + nước:</b> chọn <b>natri</b> ở khay (hoặc chạm lọ dầu), rồi chạm vào mặt nước để thả. Quan sát đến khi mẩu natri tan hết.`)}
          ${li(doneW2(),S.done.Na&&!doneW2(),`<b>So sánh:</b> thả thêm ít nhất 2 kim loại khác (Li, K, Ca, Mg, Cu). Đã làm: ${[...S.done.water2].join(", ")||"chưa có"}.`)}
          ${li(doneA(),S.done.Na&&doneW2()&&!doneA(),`<b>Kim loại + HCl:</b> cho ít nhất 3 kim loại vào ống HCl, rồi đưa <b>que đóm</b> vào miệng ống đang sủi bọt. Đã làm: ${[...S.done.acid].join(", ")||"chưa có"}${S.done.splint?" · đã thử que đóm":""}.`)}
          ${li(doneS(),!doneS()&&doneA(),`<b>Kim loại + muối:</b> cho lá kẽm vào CuSO₄ và lá đồng vào ZnSO₄, đợi quan sát.`)}</ol>
          ${S.held?`<div class="callout">Đang kẹp <b>${NAME[S.held.m]}</b>. Chạm vào mặt nước trong chậu để thả.</div>`:""}
          <div class="callout warn">Thí nghiệm thật với kim loại kiềm chỉ do giáo viên làm, mẩu rất nhỏ, có tấm chắn và kính bảo hộ.</div>
          ${gvTip("cho học sinh nói to hiện tượng trước khi xem bảng: nổi hay chìm, có vo tròn không, có lửa không, màu dung dịch.")}`;
      }else if(stepIdx===2){
        const box=(id,txt,arr,ok,expl)=>`<p class="lead2">${txt}</p><div class="opts">${arr.map(([k,t],j)=>`<button class="opt ${S.obs[id]===k?(k===ok?"right":"wrong"):""}" data-obs="${id}" data-v="${k}"><span class="k">${"ABCD"[j]}</span>${t}</button>`).join("")}</div>${S.obs[id]&&S.obs[id]!==ok?`<div class="callout bad">${expl}</div>`:""}`;
        el.innerHTML=`<h3>Quan sát và lí giải</h3>
          ${box("a","<b>1.</b> Vì sao mẩu natri nổi trên mặt nước?",[["rho","Khối lượng riêng của natri (0,97 g/cm³) nhỏ hơn của nước"],["khi","Vì natri là chất khí"],["dau","Vì natri còn dính dầu"]],"rho","So sánh khối lượng riêng: natri 0,97 g/cm³, nước khoảng 1 g/cm³. Calcium (1,54 g/cm³) thì chìm.")}
          ${box("b","<b>2.</b> Vì sao natri vo tròn thành giọt sáng, còn lithium thì không?",[["nhiet","Phản ứng tỏa nhiệt làm natri nóng chảy (natri nóng chảy ở 97,8 °C, lithium ở 180,5 °C)"],["nuoc","Nước làm natri co lại"],["dau","Lớp dầu bao quanh natri"]],"nhiet","Natri nóng chảy ở nhiệt độ thấp nên nhiệt tỏa ra đủ làm nó chảy thành giọt; lithium nóng chảy ở 180,5 °C.")}
          ${box("c","<b>3.</b> Dung dịch chuyển màu hồng với phenolphthalein chứng tỏ điều gì?",[["acid","Dung dịch có acid"],["base","Dung dịch có base (NaOH) tạo thành"],["muoi","Dung dịch có muối ăn"]],"base","Phenolphthalein không màu trong nước, chuyển hồng khi có base.")}
          ${box("d","<b>4.</b> Từ hiện tượng với nước, xếp mức độ phản ứng giảm dần:",[["KNaLi","K > Na > Li"],["LiNaK","Li > Na > K"],["NaKLi","Na > K > Li"]],"KNaLi","K bốc cháy ngay, Na chạy mạnh, Li chỉ sủi bọt chậm.")}`;
      }else{
        const Q=[{k:"a",t:"Khí sinh ra khi natri tác dụng với nước là:",o:[["a","Oxygen"],["b","Hydrogen"],["c","Carbon dioxide"]],ok:"b",why:{a:"Que đóm gặp khí này cháy có tiếng nổ nhỏ: đó là hydrogen.",c:"Phản ứng không có carbon."}},
          {k:"b",t:"Phương trình đúng của kẽm với dung dịch HCl:",o:[["a","Zn + HCl → ZnCl + H"],["b","Zn + 2HCl → ZnCl₂ + H₂↑"],["c","Zn + 2HCl → ZnH₂ + Cl₂"]],ok:"b",why:{a:"Chưa cân bằng; hydrogen tồn tại dạng phân tử H₂.",c:"Sản phẩm là muối zinc chloride và khí hydrogen."}},
          {k:"c",t:"Vì sao lá đồng không phản ứng với dung dịch ZnSO₄?",o:[["a","Đồng hoạt động hóa học kém hơn kẽm"],["b","Dung dịch không có màu"],["c","Lá đồng quá nhỏ"]],ok:"a",why:{b:"Màu dung dịch không quyết định phản ứng.",c:"Kích thước không làm phản ứng xảy ra hay không."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="noi"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{chim:"chìm, không hiện tượng",noi:"nổi, chạy, sủi khí, hóa hồng",xanh:"tan, hóa xanh"}[S.p1]}</b>. Kết quả: natri nổi, nóng chảy thành giọt, chạy trên mặt nước, sủi khí; dung dịch hóa hồng.</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="Cu"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{Zn:"kẽm",Cu:"đồng",Fe:"sắt"}[S.p2]}</b>. Kết quả: đồng không phản ứng với HCl loãng.</div>`:""}
          <div class="eq">${EQ.Na}<br>${EQ.aZn}<br>${EQ.sZn}</div>
          <ul class="tlist"><li>Một số kim loại (Na, K, Ca…) tác dụng với nước ở nhiệt độ thường tạo base và khí hydrogen.</li><li>Một số kim loại tác dụng với dung dịch HCl tạo muối và khí hydrogen; đồng không phản ứng.</li><li>Kim loại hoạt động mạnh hơn đẩy kim loại yếu hơn ra khỏi dung dịch muối (trừ K, Na, Ca…).</li></ul>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],i)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`}}
    function onBody(e){const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}if(d.obs){S.obs[d.obs]=d.v;refresh();return}
      if(d.k==="lock"){S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok")}
      if(d.k==="finish"){S.finished=true;refresh();api.done(`<h2>Hoàn thành: Tính chất chung của kim loại</h2><p class="muted">Kim loại tác dụng với nước (Na, K, Ca…), với acid, với muối; mức độ hoạt động khác nhau.</p>`)}}

    /* ================= vẽ từng khung ================= */
    const META=new Map();
    function drawPieces(){for(const n of Object.values(heldM))n.visible=false;
      Object.values(flames).forEach(f=>{if(f!==flames.splint)f.visible=false});
      tongs.visible=!!S.held;
      if(S.held){const m=S.held.m,w=WATER[m];const kind=m==="Ca"?"granule":m==="Mg"?"ribbon":m==="Cu"?"wire":"cube";const n=heldMesh(m,kind);n.visible=true;n.pos=[DISH.c[0],.82+Math.sin(simT*2)*.01,DISH.c[2]];n.quat=G.Q.euler(.2,simT*.4,0);n.scl=[1,1,1];
        const tr=w.tarn?Math.min(1,S.held.t/w.tarn):0;const M=K3.METAL[m];const a=H(M.col),b=H(M.tarn);n.mat.color=a.map((c,i)=>c+(b[i]-c)*tr);n.mat.rough=M.rough+.45*tr;n.mat.metal=.95-.5*tr;
        tongs.pos=[DISH.c[0]+.02,.86,DISH.c[2]+.48];}
      for(const p of S.pieces){const w=WATER[p.m];if(p.phase==="done"){p.mesh.visible=false;if(p.ball)p.ball.visible=false;continue}
        const sc=Math.cbrt(Math.max(p.mass,.001));
        if(p.kind==="cube"){const n=p.mesh;n.visible=p.melt<1;n.pos=[p.x,p.y,p.z];n.scl=[sc*(1-p.melt),sc*(1-p.melt*.7),sc*(1-p.melt)];n.quat=G.Q.euler(0,p.spin,0);const M=K3.METAL[p.m];const a=H(M.col),b=H(M.tarn);n.mat.color=a.map((c,i)=>c+(b[i]-c)*p.tarn);n.mat.rough=M.rough+.3*p.tarn;n.mat.metal=.9;
          const bl=p.ball;bl.visible=p.melt>0;bl.pos=[p.x,p.y-.005,p.z];const s=sc*p.melt*.95;bl.scl=[s,s*.92,s];bl.mat.color=H("#F4F6FA");bl.mat.rough=.1;bl.mat.metal=.82;bl.mat.coat=.8}
        else{const n=p.mesh;n.visible=true;n.pos=[p.x,p.y,p.z];n.scl=[sc,sc,sc];if(p.kind!=="granule")n.quat=G.Q.euler(Math.PI/2,.3,0)}
        if(p.fire>0){const f=flames[w.fire];f.visible=true;f.pos=[p.x,DISH.lvl+.02,p.z];const s=(.85+.22*Math.sin(simT*23))*p.fire*Math.max(.7,sc);f.scl=[s,s*1.15,s];f.mat.uniforms.uAmp=.85+.3*Math.sin(simT*31)}}
      /* ống nghiệm */
      S.tubes.forEach((tb,i)=>{const key="t"+i;if(!tb)return;const kind=tb.m==="Mg"?"ribbon":tb.m==="Zn"?"granule":tb.m==="Fe"?"nail":"wire";const nm=tb.m+kind+"_tube"+i;
        let n=tubePieces[nm];if(!n){n=root.add(R.mesh(K3.pieceGeom(kind),{color:K3.METAL[tb.m].col,rough:K3.METAL[tb.m].rough,metal:.9}));tubePieces[nm]=n}
        n.visible=tb.mass>0;const s=Math.cbrt(Math.max(tb.mass,.01))*(kind==="nail"?.75:kind==="ribbon"?.75:.9);n.scl=[s,s,s];n.pos=[RACK.c[0]+TX[i],RACK.c[1]+.07+tb.y,RACK.c[2]];n.quat=kind==="nail"?G.Q.euler(0,0,.12):G.Q.euler(0,i,0)});
      for(const nm in tubePieces){const i=+nm.split("_tube")[1];const tb=S.tubes[i];if(!tb||!nm.startsWith(tb.m))tubePieces[nm].visible=false}
      if(ripple.visible){const k=Math.max(0,simT-ripple.t0)/.7;ripple.pos=[ripple.x-DISH.c[0],DISH.lvl+.004,ripple.z-DISH.c[2]];const s=.05+k*.35;ripple.scl=[s,1,s];ripple.mat.alpha=.5*(1-k)*ripple.a;if(k>=1)ripple.visible=false}}
    function updateInfo(){let html="";
      if(view==="nuoc"){const p=S.pieces.filter(p=>p.phase!=="done").slice(-1)[0];if(p){html=`<div><b>${NAME[p.m]}</b></div><div>${obsText(p)}</div>${PHYS[p.m]?`<small>Khối lượng riêng ${fmt(PHYS[p.m].rho,PHYS[p.m].rho<1?2:2)} g/cm³ · nóng chảy ở ${fmt(PHYS[p.m].mp,1)} °C</small>`:""}`}
        else if(S.held)html=`<div><b>${NAME[S.held.m]}</b> đang kẹp</div><small>Chạm vào mặt nước để thả</small>`;else html=`<div><b>Chậu nước có phenolphthalein</b></div><small>Chọn kim loại ở khay rồi chạm mặt nước để thả.</small>`}
      else if(view==="axit")html=`<div><b>4 ống HCl loãng</b></div><small>${S.tool==="splint"?"Que đóm đang cháy: chạm vào miệng ống để thử khí.":S.tubes.every(t=>t)?"Dùng que đóm cháy để thử khí thoát ra.":"Chọn kim loại ở khay rồi chạm vào ống."}</small>`;
      else if(view==="muoi")html=`<div><b>Kim loại + dung dịch muối</b></div><small>${S.beakers.every(b=>b.m)?"So sánh hai cốc sau vài chục giây.":"Chọn lá kim loại ở khay để nhúng vào cốc."}</small>`;
      else html=`<div><b>Bàn thí nghiệm</b></div><small>Chọn trạm ở khay: nước, acid, muối.</small>`;
      TX.forEach((x,i)=>{const t=S.tubes[i];const h=`<span>Ống ${i+1}${t?` · ${t.m}`:""}${t?`<small>${{Mg:"bọt khí mạnh",Zn:"bọt khí vừa",Fe:"bọt khí ít hơn",Cu:"không có bọt"}[t.m]}</small>`:""}</span>`;const L=tubeLab[i];if(L&&L._h!==h){L.el.innerHTML=h;L._h=h}});
      [0,1].forEach(i=>{const b=S.beakers[i];const L=saltLab[i];const st=b.m?(i===0?(b.dep>.15?"đồng bám, xanh nhạt":"đang phản ứng…"):"không có hiện tượng"):"";const h=`<span>${i===0?"CuSO₄ + lá kẽm":"ZnSO₄ + lá đồng"}${st?`<small>${st}</small>`:""}</span>`;if(L&&L._h!==h){L.el.innerHTML=h;L._h=h}});
      if(info._h!==html){info.innerHTML=html;info._h=html}}

    /* tên mẩu đang phản ứng */
    function frame(dt){frameN++;const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      if(S.held)S.held.t+=sdt;
      stepWater(sdt);stepAcid(sdt);stepSalt(sdt);stepSplint(sdt);
      const lim=b=>{if(b.p[1]>DISH.lvl+.01&&Math.hypot(b.p[0]-DISH.c[0],b.p[2]-DISH.c[2])<DISH.r&&b.v[1]>.2&&b.life>1)b.dead=true;
        for(let i=0;i<4;i++){const x=RACK.c[0]+TX[i];if(Math.abs(b.p[0]-x)<.12&&Math.abs(b.p[2]-RACK.c[2])<.12&&b.p[1]>RACK.c[1]+.07+TUBE.lvl-.02)b.dead=true}};
      fizz.step(sdt,lim);smoke.step(sdt);sparks.step(sdt);
      drawPieces();R.render(root,simT);LB.update();if(frameN%6===0)updateInfo();
      api.time.label(`t = ${fmt(simT,1)} s · ${{nuoc:"kim loại + nước",axit:"kim loại + dung dịch HCl",muoi:"kim loại + dung dịch muối",ban:"bàn thí nghiệm"}[view]}`,null)}
    theme();layout();goView("nuoc",true);
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{S.pieces.forEach(p=>{p.mesh.visible=false;if(p.ball)p.ball.visible=false});S.pieces=[];S.held=null;dye.clear();dyeTex.update(dye.bytes());S.tubes=[null,null,null,null];S.beakers=[{m:null,t:0,dep:0},{m:null,t:0,dep:0}];beakers[0].liq.mat.color=H("#2F7FD8");beakers[0].liq.mat.alpha=.62;fizz.list.length=0;smoke.list.length=0;S.tool=null;S.splint=null;simT=0;refresh()});
    vp.__lab={get S(){return S},hold,drop,addToTube,splintTest,addStrip,goView,R,dye,pick,DISH};
    return{step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},layout,prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);if(hiss)hiss.stop();if(hissA)hissA.stop();LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
