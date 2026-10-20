/* K8-S-04 · Tim, vòng tuần hoàn, nhóm máu (SGK KHTN 8 – Kết nối tri thức, Bài 33: Máu và hệ tuần hoàn của cơ thể người)
   Bản 3D (WebGL2, bộ máy LabGL + LabBody):
   - Toàn hệ tuần hoàn: tim, phổi, mạng mao mạch các cơ quan; hồng cầu chảy theo hai vòng, đổi màu ở mao mạch
   - Tim 3D: xoay mọi phía, co bóp theo chu kì 0,8 s; mạch vành trên mặt tim
   - Mặt cắt bốn ngăn: van nhĩ – thất, van động mạch đóng mở theo pha; dòng máu trong các ngăn
   - Xét nghiệm nhóm máu ABO trên phiến sứ 3D; thử trộn máu người cho với huyết tương người nhận */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,B=window.LabBody,V3=G.V3;
const fmt=C.fmt;

/* ---- Chu kì tim ở nhịp 75 lần/phút: 0,8 s = nhĩ co 0,1 + thất co 0,3 (tăng áp 0,05 + tống máu 0,25) + dãn chung 0,4 ---- */
const CYC=0.8;
function phase(t){
  const x=((t%CYC)+CYC)%CYC;
  if(x<0.1) return {k:"nhi",ten:"Pha nhĩ co",av:1,sl:0,atr:Math.sin(x/0.1*Math.PI),ven:0,pulse:0,x};
  if(x<0.15) return {k:"tangap",ten:"Pha thất co (tăng áp, mọi van đều đóng)",av:0,sl:0,atr:0,ven:(x-0.1)/0.05*.35,pulse:0,x};
  if(x<0.4) return {k:"tong",ten:"Pha thất co (tống máu)",av:0,sl:1,atr:0,ven:.35+.65*Math.sin((x-0.15)/0.25*Math.PI*.5),pulse:Math.sin((x-0.15)/0.25*Math.PI),x};
  if(x<0.45) return {k:"giandt",ten:"Pha dãn chung (mọi van đều đóng)",av:0,sl:0,atr:0,ven:1-(x-0.4)/0.05,pulse:0,x};
  return {k:"dan",ten:"Pha dãn chung (máu về tâm nhĩ, xuống tâm thất)",av:1,sl:0,atr:0,ven:0,pulse:0,x};
}
/* ---- Nhóm máu ABO ---- */
const GROUPS={A:{ag:["A"],ab:["B"]},B:{ag:["B"],ab:["A"]},AB:{ag:["A","B"],ab:[]},O:{ag:[],ab:["A","B"]}};
const agglut=(serum,group)=>GROUPS[group].ag.includes(serum);
const compatible=(donor,recip)=>!GROUPS[donor].ag.some(a=>GROUPS[recip].ab.includes(a));

const GV=`<p><b>Yêu cầu cần đạt</b> (trích kế hoạch bài dạy Bài 33)</p>
<ul class="tlist"><li>Kể tên các cơ quan của hệ tuần hoàn, nêu chức năng và sự phối hợp giữa chúng.</li><li>Nêu khái niệm nhóm máu và ý nghĩa của việc hiểu biết nhóm máu.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức (15–20 phút)</b></p>
<ul class="tlist"><li>Cảnh “Toàn hệ tuần hoàn”: cho học sinh nhìn màu hồng cầu đổi ở mao mạch phổi và mao mạch các cơ quan trước khi giải thích.</li><li>Cảnh “Mặt cắt”: chọn 0,25× để thấy van nhĩ – thất đóng khi tâm thất co; xoay nhẹ để thấy thành tâm thất trái dày hơn.</li><li>Cảnh nhóm máu: mỗi nhóm học sinh xác định 4 mẫu; hỏi vì sao mẫu nhóm O không ngưng kết với cả hai huyết thanh.</li></ul>
<p style="margin-top:10px"><b>Lỗi học sinh hay gặp</b></p>
<ul class="tlist"><li>Nghĩ động mạch luôn chứa máu đỏ tươi: động mạch phổi chứa máu đỏ thẫm.</li><li>Nhầm bên: hình nhìn từ phía trước nên nửa trái của tim nằm bên phải hình.</li><li>Nhầm “nhóm O nhận được của mọi nhóm”.</li></ul>`;
const SRC=`<ul class="tlist">
<li>Mục tiêu bài và nội dung nhóm máu, hệ tuần hoàn: kế hoạch bài dạy Bài 33 KNTT (<a href="https://kenhgiaovien.com/tai-lieu/giao-khtn-8-ket-noi-bai-33-mau-va-he-tuan-hoan-cua-co-nguoi" target="_blank" rel="noopener">Kênh giáo viên</a>).</li>
<li>Kháng nguyên trên hồng cầu, kháng thể anti-A, anti-B trong huyết tương; đường đi của máu trong vòng tuần hoàn lớn và nhỏ; thành tâm thất trái dày hơn; tim trái chứa máu đỏ tươi, tim phải chứa máu đỏ thẫm: tài liệu KHTN 8 “Máu và hệ tuần hoàn ở người” (<a href="https://thcshongthaidong.dongtrieu.edu.vn/documents/20446/78716/KHTN+8_B%C3%80I+30_M%C3%81U+V%C3%80%20H%E1%BB%86%20TU%E1%BA%A6N+HO%C3%80N+%E1%BB%9E%20NG%C6%AF%E1%BB%9CI" target="_blank" rel="noopener">THCS Hồng Thái Đông</a>).</li>
<li>Chu kì tim 0,8 s ở nhịp 75 lần/phút; nhĩ co 0,1 s; thất co 0,3 s (tăng áp 0,05 s, tống máu 0,25 s); dãn chung 0,4 s (<a href="https://www.vinmec.com/vie/bai-viet/chu-ky-hoat-dong-cua-tim-vi" target="_blank" rel="noopener">Vinmec</a>).</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p>
<ul class="tlist"><li>Tim, phổi, mạch máu là mô hình 3D giản lược để nhận biết các phần; hình dạng và tỉ lệ không đúng chi tiết giải phẫu. Phổi, mạng mao mạch vẽ to, gần tim để thấy trọn hai vòng tuần hoàn.</li>
<li>Màu mạch theo quy ước sách: máu đỏ tươi (giàu O₂) màu đỏ, máu đỏ thẫm (nghèo O₂) màu tím sẫm/xanh. Mạch máu thật không có màu xanh.</li>
<li>Mặt cắt bốn ngăn là mặt phẳng nghiêng để thấy cùng lúc cả bốn ngăn; van vẽ dạng lá phẳng, mở – đóng theo pha.</li>
<li>Đầu pha dãn chung có khoảng 0,05 s mọi van đều đóng (lấy gần đúng) trước khi van nhĩ – thất mở. Tốc độ hồng cầu chỉ minh họa nhịp đẩy máu theo pha.</li>
<li>Thời gian ngưng kết rút ngắn để dễ quan sát. Sơ đồ cho – nhận chỉ xét kháng nguyên trên hồng cầu người cho và kháng thể trong huyết tương người nhận (hệ ABO); thực tế ưu tiên truyền cùng nhóm và phải xét nghiệm.</li></ul>`;

const PARTS={
  RA:{ten:"Tâm nhĩ phải",chuc:"Nhận máu đỏ thẫm từ tĩnh mạch chủ, đẩy xuống tâm thất phải."},
  RV:{ten:"Tâm thất phải",chuc:"Co bóp đẩy máu đỏ thẫm vào động mạch phổi, lên phổi."},
  LA:{ten:"Tâm nhĩ trái",chuc:"Nhận máu đỏ tươi từ tĩnh mạch phổi, đẩy xuống tâm thất trái."},
  LV:{ten:"Tâm thất trái",chuc:"Thành dày nhất; co bóp mạnh đẩy máu đỏ tươi vào động mạch chủ đi khắp cơ thể."},
  Ao:{ten:"Động mạch chủ",chuc:"Dẫn máu đỏ tươi từ tâm thất trái đi tới các cơ quan."},
  PA:{ten:"Động mạch phổi",chuc:"Dẫn máu đỏ thẫm từ tâm thất phải lên phổi."},
  PV:{ten:"Tĩnh mạch phổi",chuc:"Dẫn máu đỏ tươi từ phổi về tâm nhĩ trái."},
  VC:{ten:"Tĩnh mạch chủ",chuc:"Dẫn máu đỏ thẫm từ các cơ quan về tâm nhĩ phải (tĩnh mạch chủ trên và tĩnh mạch chủ dưới)."},
  capL:{ten:"Mao mạch phổi",chuc:"Máu nhận O₂, thải CO₂ → từ đỏ thẫm thành đỏ tươi."},
  capB:{ten:"Mao mạch các cơ quan",chuc:"Máu nhường O₂ và chất dinh dưỡng cho tế bào, nhận CO₂ → từ đỏ tươi thành đỏ thẫm."},
  TV:{ten:"Van nhĩ – thất (bên phải)",chuc:"Chỉ cho máu đi từ tâm nhĩ phải xuống tâm thất phải; đóng khi tâm thất co."},
  MV:{ten:"Van nhĩ – thất (bên trái)",chuc:"Chỉ cho máu đi từ tâm nhĩ trái xuống tâm thất trái; đóng khi tâm thất co."},
  AoV:{ten:"Van động mạch chủ",chuc:"Mở khi tâm thất trái tống máu; đóng lại để máu không chảy ngược về tâm thất."},
  PVv:{ten:"Van động mạch phổi",chuc:"Mở khi tâm thất phải tống máu; đóng lại để máu không chảy ngược về tâm thất."},
  sep:{ten:"Vách ngăn tim",chuc:"Ngăn đôi nửa phải (máu đỏ thẫm) và nửa trái (máu đỏ tươi) của tim, hai dòng máu không trộn lẫn."}
};
const ORDER={lon:["LV","Ao","capB","VC","RA"],nho:["RV","PA","capL","PV","LA"]};

/* ---- shader: co bóp theo pha + vân bề mặt ---- */
const NOISE=`float hsh(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hsh(i),hsh(i+vec3(1,0,0)),f.x),mix(hsh(i+vec3(0,1,0)),hsh(i+vec3(1,1,0)),f.x),f.y),mix(mix(hsh(i+vec3(0,0,1)),hsh(i+vec3(1,0,1)),f.x),mix(hsh(i+vec3(0,1,1)),hsh(i+vec3(1,1,1)),f.x),f.y),f.z);}
uniform float uBump,uNF;`;
const BEAT={vu:`uniform float uVen,uAtr,uPulse;`,vs:`{vec3 c=vec3(.02,-.12,.02);vec3 ax=normalize(vec3(.38,-1.,.18));vec3 d=p-c;float al=dot(d,ax);vec3 rad=d-al*ax;
 p-=rad*(.09*uVen*aW.x);p-=ax*(al*.05*uVen*aW.x);vec3 ac=mix(vec3(-.43,.27,-.03),vec3(.13,.32,-.2),aW.z);p-=(p-ac)*(.08*uAtr*aW.y);p+=n*(.012*uPulse*aW.w);}`,
 fu:NOISE,fs:`{float f=uNF;vec3 q=vO*f;float e=.35;float n0=vn(q);vec3 gN=vec3(vn(q+vec3(e,0,0))-n0,vn(q+vec3(0,e,0))-n0,vn(q+vec3(0,0,e))-n0)/e;float n1=vn(q*3.1);
 N=normalize(N-gN*uBump);base.rgb*=.86+.22*n0+.08*n1;rough=clamp(rough+.2*(n1-.5),.15,.9);}`};
const TISSUE={fu:NOISE,fs:`{float f=uNF;vec3 q=vO*f;float e=.35;float n0=vn(q);vec3 gN=vec3(vn(q+vec3(e,0,0))-n0,vn(q+vec3(0,e,0))-n0,vn(q+vec3(0,0,e))-n0)/e;N=normalize(N-gN*uBump);base.rgb*=.85+.3*n0;}`};

LabKHTN.register("K8-S-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"mau",t:"Mẫu"},{k:"a",t:"Với anti-A"},{k:"b",t:"Với anti-B"},{k:"kl",t:"Em kết luận"},{k:"ok",t:"Đúng"}],empty:"Xác định nhóm máu của 4 mẫu ở cảnh “Xét nghiệm nhóm máu”."},
  gv:GV, sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Mô hình 3D tim, hai vòng tuần hoàn và phiến xét nghiệm nhóm máu");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới, bật “Tăng tốc phần cứng”.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,simT=0,view="tuan",bodyEl=null,stepIdx=0,frameN=0;
    const S={p1:null,p2:null,locked:false,task:null,seq:[],done:{lon:false,nho:false,type:false},sel:null,follow:false,labels:true,
      samples:[],answers:{},reagent:null,obs:{},tx:null,txLog:[],q:{},finished:false,drops:[]};
    const rnd=C.rng(20261014);

    /* ================= cảnh tuần hoàn ================= */
    const root=new G.Node();
    const heart=root.add(new G.Node());
    const matHeart={color:"#FFFFFF",rough:.36,wrap:.45,coat:.45,sheen:.12,key:"heart",hooks:BEAT,uniforms:{uVen:0,uAtr:0,uPulse:0,uBump:.06,uNF:38}};
    /* mặt ngoài tim, phổi và mặt cắt được dựng ở luồng phụ; nút chứa có sẵn để phần còn lại của bài chạy ngay */
    let dead=false,cutG=null,ready=false;const outerM=heart.add(new G.Node());
    const loadEl=document.createElement("div");loadEl.className="gl-loading glass";loadEl.innerHTML=`<i aria-hidden="true"></i>Đang dựng mô hình tim 3D…`;over.appendChild(loadEl);
    const coroM=heart.add(R.mesh(B.coronaryGeom(),Object.assign({},matHeart,{rough:.25,coat:.7,uniforms:{uVen:0,uAtr:0,uPulse:0,uBump:.02,uNF:80}})));
    let cutM=null,valves=null;
    function ensureCut(){if(cutM)return;cutM=heart.add(R.mesh(cutG||B.buildCut(84),Object.assign({},matHeart,{side:"double",uniforms:{uVen:0,uAtr:0,uPulse:0,uBump:.05,uNF:42}})));buildValves()}
    const lungs=root.add(new G.Node());
    const lungMat={color:"#FFFFFF",alpha:.42,rough:.55,wrap:.6,sheen:.5,key:"lung",hooks:TISSUE,uniforms:{uBump:.08,uNF:16},order:-1};
    B.buildAsync("buildOuter",88).then(g=>{if(dead)return;outerM.add(R.mesh(g,matHeart));ready=true;loadEl.classList.add("out");setTimeout(()=>loadEl.remove(),400);
      return Promise.all([B.buildAsync("buildLung","L",48),B.buildAsync("buildLung","R",48)])}).then(r=>{if(dead||!r)return;lungs.add(R.mesh(r[0],lungMat));lungs.add(R.mesh(r[1],lungMat));
      return B.buildAsync("buildCut",84)}).then(g=>{if(!dead&&g)cutG=g}).catch(()=>{});
    lungs.add(R.mesh(B.lungNet("L"),{color:"#FFFFFF",rough:.4,coat:.4}));lungs.add(R.mesh(B.lungNet("R"),{color:"#FFFFFF",rough:.4,coat:.4}));
    const bed=root.add(new G.Node());
    bed.add(R.mesh(G.box(3.1,.12,1.5,.06,4),{color:"#5E2E3A",rough:.75,wrap:.4,key:"bed",hooks:TISSUE,uniforms:{uBump:.12,uNF:9}})).pos=[0,-2.23,0];
    bed.add(R.mesh(B.bedNet(),{color:"#FFFFFF",rough:.4,coat:.4}));
    const ext=root.add(new G.Node());
    for(const k in B.EXT){const e=B.EXT[k];ext.add(R.mesh(G.tube(G.spline(e.pts,10),e.r,16,{caps:false}),{color:e.col,alpha:.5,rough:.25,coat:.5}))}
    /* hồng cầu */
    const NC=300;const cellsN=root.add(R.instanced(G.sphere(1,12,8),{color:"#FFFFFF",rough:.35,coat:.3},NC));
    const cells=[];
    {const order=["sys","bed","ret","toL","lungL","backL","toR","lungR","backR"];let tot=0;const segs=[];for(const k of order){const s=B.segOf(k,0);segs.push([k,s.len]);tot+=s.len}
     for(let i=0;i<NC;i++){let u=rnd()*tot,k="sys";for(const [kk,l] of segs){if(u<l){k=kk;break}u-=l}const idx=k==="bed"?Math.floor(rnd()*9):(k==="lungL"||k==="lungR")?Math.floor(rnd()*5):0;
       const o=(k==="sys"||k==="backL"||k==="backR")?1:(k==="ret"||k==="toL"||k==="toR")?0:.5;cells.push({k,i:idx,d:u,o,j:[(rnd()-.5)*.05,(rnd()-.5)*.05,(rnd()-.5)*.05],s:.85+rnd()*.3})}}
    function speed(typ,ph){if(typ==="cap")return .22;if(typ==="art")return ph.sl?1.15:.2;if(typ==="vein")return ph.k==="nhi"?.2:.32;
      if(typ==="atr")return ph.av?(ph.k==="nhi"?.7:.3):.03;if(typ==="av")return ph.av?(ph.k==="nhi"?.7:.35):0;if(typ==="sl")return ph.sl?.9:0;if(typ==="vent")return ph.sl?.75:(ph.av?.2:0);return .2}
    function stepCells(dt,ph){for(const c of cells){const s=B.segOf(c.k,c.i);const sm=B.sample(s,c.d);c.d+=speed(sm.typ,ph)*dt;
        if(c.k==="bed")c.o=Math.max(0,1-c.d/s.len*1.3);else if(c.k==="lungL"||c.k==="lungR")c.o=Math.min(1,c.d/s.len*1.3);
        else{const tgt=(c.k==="sys"||c.k==="backL"||c.k==="backR")?1:0;c.o+=(tgt-c.o)*Math.min(1,dt*2)}
        if(c.d>=s.len){const [k,i]=B.nextSeg(c,rnd);c.d-=s.len;c.k=k;c.i=i}}}
    const OXY=G.hex("#E3263B"),DEOXY=G.hex("#4B1238");
    function writeCells(){const D=cellsN.data;let n=0;const inCut=view==="cat";const rad=inCut?.022:.03;
      for(let ci=0;ci<cells.length;ci++){const c=cells[ci];const s=B.segOf(c.k,c.i);let p=B.sample(s,c.d).p;
        const jit=s.typ[0]==="cap"?.25:1;p=[p[0]+c.j[0]*jit,p[1]+c.j[1]*jit,p[2]+c.j[2]*jit];
        if(inCut){if(Math.abs(p[0])>.75||p[1]<-.8||p[1]>1.12)continue;const d=B.planeD(p[0],p[1],p[2]);if(d>-.02){const k=d+.025;p=[p[0]-B.CUT.n[0]*k,p[1]-B.CUT.n[1]*k,p[2]-B.CUT.n[2]*k]}if(B.cavityXYZ(p[0],p[1],p[2])>.005)continue}
        const col=[OXY[0]+(DEOXY[0]-OXY[0])*(1-c.o),OXY[1]+(DEOXY[1]-OXY[1])*(1-c.o),OXY[2]+(DEOXY[2]-OXY[2])*(1-c.o)];
        const f=S.follow&&ci===37;D.set([p[0],p[1],p[2],rad*c.s*(f?1.9:1),f?2.2:col[0],f?1.6:col[1],f?.2:col[2],1],n*8);n++}
      cellsN.setInstances(n)}

    /* ---- van tim (chỉ hiện ở mặt cắt) ---- */
    function buildValves(){valves=heart.add(new G.Node());const clip=[-B.CUT.n[0],-B.CUT.n[1],-B.CUT.n[2],B.CUT.d+.004];
      for(const key in B.VALVE){const v=B.VALVE[key];const base=valves.add(new G.Node());base.pos=v.c;base.quat=G.Q.toward(V3.scale(v.a,-1));base.leaf=[];base.def=v;
        const L=v.av?.11:.075;const w=2*Math.PI*v.r/v.n*1.08;const geo=B.leafletGeom(w,L,v.av?.012:.02);
        for(let i=0;i<v.n;i++){const ph=i/v.n*Math.PI*2+(v.av?.4:0);const piv=base.add(new G.Node());piv.pos=[Math.cos(ph)*v.r,0,Math.sin(ph)*v.r];
          const tg=[-Math.sin(ph),0,Math.cos(ph)],up=[0,1,0],inw=V3.cross(tg,up);piv.q0=G.Q.basis(tg,up,inw);piv.quat=piv.q0;
          piv.add(R.mesh(geo,{color:"#E7D3BC",rough:.5,wrap:.6,sheen:.3,side:"double",clip}));base.leaf.push(piv)}
        base.L=L;base.open=1}}
    function animValves(dt,ph){if(!valves)return;for(const b of valves.children){const v=b.def;const tgt=v.av?ph.av:ph.sl;b.open+=(tgt-b.open)*Math.min(1,dt*14);
      const closed=Math.asin(Math.min(.98,v.r/b.L))*(v.av?1:.92);const th=closed*(1-b.open)-(v.av?.18:.12)*b.open;
      for(const piv of b.leaf)piv.quat=G.Q.mul(piv.q0,G.Q.axis([1,0,0],-th))}}

    /* ================= cảnh xét nghiệm nhóm máu ================= */
    const lab=new G.Node();let labBuilt=false;const WELLS=[];let bottles=[];
    const WX=[-.42,.42],WZ=i=>-1.02+i*.68;const TXW=[1.75,.06,.0];
    function buildLab(){if(labBuilt)return;labBuilt=true;
      /* bàn và phiến sứ */
      const table=lab.add(R.mesh(G.box(6.8,.2,4.4,.04,2),{color:"#2A3150",rough:.6}));table.pos=[0,-.16,0];
      const wellsC=[];for(let i=0;i<4;i++)for(let j=0;j<2;j++)wellsC.push([WX[j],WZ(i)]);wellsC.push([TXW[0],TXW[2]]);
      const plateF=(x,y,z)=>{const qx=Math.abs(x)-.92,qy=Math.abs(y)-.05,qz=Math.abs(z)-1.45;const ox=Math.max(qx,0),oy=Math.max(qy,0),oz=Math.max(qz,0);let d=Math.sqrt(ox*ox+oy*oy+oz*oz)+Math.min(Math.max(qx,qy,qz),0)-.04;
        for(const [cx,cz] of wellsC.slice(0,8)){const w=Math.hypot(x-cx,y-.38,z-cz)-.4;d=Math.max(d,-w)}return d};
      lab.add(R.mesh(G.fromSDF(plateF,[-1,-.12,-1.55],[1,.12,1.55],[110,16,170]),{color:"#F4F2EE",rough:.22,coat:.6}));
      const dish=lab.add(R.mesh(G.lathe([[0,-.06],[.42,-.06],[.48,-.02],[.5,.06],[.46,.07],[.4,-.01],[0,-.01]],48),{color:"#F4F2EE",rough:.22,coat:.6}));dish.pos=[TXW[0],0,TXW[2]];
      /* giọt máu trong giếng */
      wellsC.forEach((c,k)=>{const n=new G.Node();n.pos=[c[0],k<8?.022:-.0,c[1]];lab.add(n);
        const drop=n.add(R.mesh(G.lathe(k<8?[[0,.036],[.1,.033],[.17,.02],[.205,0],[0,0]]:[[0,.035],[.12,.03],[.2,.018],[.25,0],[0,0]],40),{color:"#7A0A16",rough:.08,coat:.6,alpha:1}));
        const cellsI=n.add(R.instanced(G.sphere(1,10,6),{color:"#FFFFFF",rough:.4},96));const pts=[];
        for(let q=0;q<96;q++){const a=rnd()*6.283,r=Math.sqrt(rnd())*.16;pts.push({x:Math.cos(a)*r,z:Math.sin(a)*r,c:Math.floor(rnd()*7),ox:(rnd()-.5)*.05,oz:(rnd()-.5)*.05})}
        const cl=[];for(let q=0;q<7;q++){const a=rnd()*6.283,r=.03+rnd()*.1;cl.push([Math.cos(a)*r,Math.sin(a)*r])}
        WELLS.push({n,drop,cellsI,pts,cl,serum:false,mix:0,agg:0,willAgg:false,tint:null,idx:k})});
      /* lọ huyết thanh */
      bottles=[["A","#3B82F6",[-2.15,0,-.6]],["B","#EAB308",[-2.15,0,.6]]].map(([s,col,pos])=>{const n=lab.add(new G.Node());n.pos=pos;
        n.add(R.mesh(G.lathe([[0,0],[.22,0],[.24,.03],[.24,.5],[.2,.58],[.1,.62],[.1,.7],[0,.7]],40),{type:"glass",color:"#CFE6FF",alpha:.6}));
        n.add(R.mesh(G.merge([G.lathe([[0,.02],[.215,.02],[.215,.4]],40),G.disk(.215,.4,40,true)]),{color:col,alpha:.78,rough:.1}));
        n.add(R.mesh(G.cylinder(.225,.12,40),{color:"#F8FAFC",rough:.5})).pos=[0,.2,0];
        n.add(R.mesh(G.lathe([[0,.68],[.11,.68],[.12,.74],[.09,.95],[.06,1.0],[0,1.02]],32),{color:"#1F2333",rough:.55,coat:.3}));
        n.add(R.mesh(G.cylinder(.02,.25,12),{type:"glass",color:"#E6F2FF",alpha:.5})).pos=[0,.45,0];
        const ring=n.add(R.mesh(G.tube(Array.from({length:41},(_,i)=>[Math.cos(i/40*6.283)*.34,.005,Math.sin(i/40*6.283)*.34]),.018,8),{type:"unlit",color:"#FF6BD6",alpha:.9}));ring.visible=false;
        return{s,n,ring,pos}});
      /* ống nhỏ giọt khi đang nhỏ */
    }
    const dropper=new G.Node();lab.add(dropper);let dropAnim=null;
    function setWellSerum(w,serum,willAgg,tint){w.serum=true;w.mix=0;w.agg=0;w.willAgg=willAgg;w.tint=tint}

    /* ================= nhãn và bảng pha ================= */
    const LB=G.labels(over,R,{bounds:api.safe});
    const PRE_RING={tim:[0,.27,0],cat:[-.04,.17,0]};
    const LBL=[
      ["tuan","Phổi",[-1.75,-.25,-.2]],["tuan","Mao mạch phổi",[1.75,-.25,-.2]],["tuan","Mao mạch các cơ quan",[0,-2.42,.7]],["tuan","Tim",[-.42,.25,.42],"heart"],
      ["tuan","Động mạch chủ",[.72,-1.3,-.3]],["tuan","Tĩnh mạch chủ dưới",[-.75,-1.3,-.22]],["tuan","Động mạch phổi",[.82,.78,-.2]],["tuan","Tĩnh mạch phổi",[.82,.22,-.34]],
      ["tim","Tâm nhĩ phải",[-.66,.28,.02],"RA"],["tim","Tâm nhĩ trái",[.52,.36,-.02],"LA"],["tim","Tâm thất phải",[-.3,-.22,.33],"RV"],["tim","Tâm thất trái",[.46,-.38,.1],"LV"],
      ["tim","Động mạch chủ",[-.1,.86,.06],"Ao"],["tim","Động mạch phổi",[.2,.56,.28],"PA"],["tim","Tĩnh mạch chủ trên",[-.42,1.06,-.06],"VC"],
      ["tim","Tĩnh mạch phổi",[.66,.42,-.36],"PV"],["tim","Động mạch vành",[.2,-.12,.38],null],
      ["cat","Tâm nhĩ phải",[-.44,.3,-.06]],["cat","Tâm nhĩ trái",[.16,.38,-.16]],["cat","Tâm thất phải",[-.2,-.12,.05]],["cat","Tâm thất trái",[.2,-.16,-.08]],
      ["cat","Van nhĩ – thất",[-.28,.1,0]],["cat","Van nhĩ – thất",[.11,.12,-.14]],["cat","Van động mạch chủ",[.0,.3,-.04]],["cat","Vách ngăn",[-.03,-.36,.02]],["cat","Động mạch chủ",[-.06,.72,-.04]]
    ].map(([v,t,p,k])=>{const it=LB.add(`<span>${t}</span>`,p,"v-"+v);it.view=v;it.key=k;it.p0=p.slice();
      /* nhãn tim và mặt cắt toả ra ngoài khối tim, đường dẫn mũi tên chỉ vào đúng vị trí */
      if(k==="heart"){it.dir="w";it.len=40}
      if(v==="tim")it.ring={c:PRE_RING.tim,r:.92,gap:20};if(v==="cat")it.ring={c:PRE_RING.cat,r:.82,gap:20};return it});
    const LBLAB=[];
    const phaseBox=document.createElement("div");phaseBox.className="gl-phase glass";phaseBox.innerHTML=`<svg viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="46" fill="none" stroke="#F59E0B" stroke-width="12" stroke-dasharray="${(.1/CYC*289).toFixed(1)} 289" transform="rotate(-90 60 60)"/><circle cx="60" cy="60" r="46" fill="none" stroke="#EF4444" stroke-width="12" stroke-dasharray="${(.3/CYC*289).toFixed(1)} 289" stroke-dashoffset="${(-.1/CYC*289).toFixed(1)}" transform="rotate(-90 60 60)"/><circle cx="60" cy="60" r="46" fill="none" stroke="#3B82F6" stroke-width="12" stroke-dasharray="${(.4/CYC*289).toFixed(1)} 289" stroke-dashoffset="${(-.4/CYC*289).toFixed(1)}" transform="rotate(-90 60 60)"/><circle id="phDot" cx="60" cy="14" r="8" fill="currentColor"/><text id="phT" x="60" y="62" text-anchor="middle" font-size="17" font-weight="800" fill="currentColor">0,00 s</text><text x="60" y="80" text-anchor="middle" font-size="10" fill="currentColor" opacity=".7">chu kì 0,8 s</text></svg>
      <div class="ph-name" id="phN">Pha dãn chung</div><div class="ph-v"><span id="phAV">Van nhĩ – thất: MỞ</span><span id="phSL">Van động mạch: đóng</span></div>
      <div class="ph-k"><span><i style="background:#F59E0B"></i>Nhĩ co 0,1 s</span><span><i style="background:#EF4444"></i>Thất co 0,3 s</span><span><i style="background:#3B82F6"></i>Dãn chung 0,4 s</span></div>`;
    over.appendChild(phaseBox);
    const legend=document.createElement("div");legend.className="gl-legend glass";legend.innerHTML=`<div><i style="background:#E3263B"></i>Máu đỏ tươi: giàu O₂</div><div><i style="background:#5A1A48"></i>Máu đỏ thẫm: nghèo O₂, nhiều CO₂</div><small>Nhìn từ phía trước cơ thể: nửa trái của tim nằm bên phải hình.</small>`;over.appendChild(legend);
    const followTag=document.createElement("div");followTag.className="gl-lab follow";followTag.innerHTML="<span></span>";over.appendChild(followTag);

    /* ================= camera, bố cục ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minDist:1.6,maxDist:16,minPitch:-.5,maxPitch:1.3});
    const PRE={tuan:{t:[0,-.38,-.05],yaw:.22,pitch:.1,rad:2.45},tim:{t:[0,.27,0],yaw:.38,pitch:.12,rad:1.18},cat:{t:[-.04,.17,0],yaw:Math.atan2(B.CUT.n[0],B.CUT.n[2]),pitch:Math.asin(B.CUT.n[1])*.6,rad:1.08},mau:{t:[-.15,0,.05],yaw:0,pitch:.95,rad:2.45}};
    let safe={x:0,y:0,w:1,h:1},zoom=1;
    function fitDist(rad){const s=R.size();const tv=Math.tan(cam.fov/2)*safe.h/s.h,th=Math.tan(cam.fov/2)*(s.w/s.h)*safe.w/s.w;return rad/Math.min(tv,th)}
    function goView(v,instant){view=v;if(v==="cat")ensureCut();if(v==="mau")buildLab();const p=PRE[v];const to={target:p.t,yaw:p.yaw,pitch:p.pitch,dist:fitDist(p.rad)};
      if(instant){Object.assign(cam,{target:[...p.t],yaw:p.yaw,pitch:p.pitch,dist:to.dist})}else orbit.fly(to,.9);
      applyVis();refresh()}
    function applyVis(){const showHeart=view!=="mau";heart.visible=showHeart;outerM.visible=view!=="cat";coroM.visible=view==="tim"||view==="tuan";
      if(cutM){cutM.visible=view==="cat";valves.visible=view==="cat"}
      lungs.visible=bed.visible=ext.visible=view==="tuan";cellsN.visible=view==="tuan"||view==="cat";
      phaseBox.style.display=legend.style.display=showHeart?"":"none";
      for(const it of LBL)it.on=S.labels&&it.view===view;for(const it of LBLAB)it.on=S.labels&&view==="mau";followTag.style.display=S.follow&&(view==="tuan"||view==="cat")?"":"none"}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));const sf=api.safe();safe=sf;
      const s=R.size();cam.shift=[2*(sf.x+sf.w/2)/s.w-1,1-2*(sf.y+sf.h/2)/s.h];
      phaseBox.style.left=(sf.x+10)+"px";phaseBox.style.top=(sf.y+10)+"px";
      legend.style.left=(sf.x+10)+"px";legend.style.top=(sf.y+sf.h-legend.offsetHeight-10)+"px";
      const p=PRE[view];cam.dist=fitDist(p.rad)*zoom;}
    function theme(){day=api.day;const E=R.env;
      if(day){E.bgTop=G.hex("#F4F6FC");E.bgBot=G.hex("#D9E0F2");E.bgGlow=G.hex("#FFFFFF");E.sky=G.hex("#B8C4E6");E.gnd=G.hex("#8C93A8");E.hor=G.hex("#D5DCEE");E.exposure=.9;E.ink=.45}
      else{E.bgTop=G.hex("#1E2756");E.bgBot=G.hex("#05081A");E.bgGlow=G.hex("#2E3A7A");E.sky=G.hex("#5E6E9E");E.gnd=G.hex("#1A1F33");E.hor=G.hex("#3A4466");E.exposure=.85;E.ink=0}
      over.classList.toggle("day",day)}

    /* ================= chọn vật bằng tia ================= */
    const heartSDF=(x,y,z)=>B.outerXYZ(x,y,z),cutSDF=(x,y,z)=>B.cutXYZ(x,y,z);
    function regionAt(p,cut){if(cut){
        const vs=[["TV",B.VALVE.TV],["MV",B.VALVE.MV],["AoV",B.VALVE.AoV],["PVv",B.VALVE.PV]];for(const [k,v] of vs)if(V3.dist(p,v.c)<v.r+.035)return k;
        const ca={LV:B.dE(B.A.cLV,...p),RV:B.dE(B.A.cRV,...p),RA:B.dE(B.A.cRA,...p),LA:B.dE(B.A.cLA,...p)};let k=null,b=.09;for(const kk in ca)if(ca[kk]<b){b=ca[kk];k=kk}
        if(k)return k;if(ca.LV<.2&&ca.RV<.2&&p[1]<.15)return"sep"}
      const q=B.parts(p);let best=null,bd=1e9;for(const k of ["LV","RV","RA","LA","Ao","PA","VC","PV"])if(q[k]<bd){bd=q[k];best=k}return best}
    function rayPoly(r,pts,rad){let best=null;for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];for(let s=0;s<=6;s++){const p=V3.lerp(a,b,s/6);const t=V3.dot(V3.sub(p,r.o),r.d);if(t<0)continue;const q=V3.add(r.o,V3.scale(r.d,t));if(V3.dist(p,q)<rad+.05&&(!best||t<best))best=t}}return best}
    function pick(px,py){const r=R.ray(px,py);
      if(view==="mau")return pickLab(r);
      const hits=[];const th=G.hit.sdf(r,view==="cat"?cutSDF:heartSDF,40);if(th!=null)hits.push([th,regionAt(G.hit.at(r,th),view==="cat")]);
      if(view==="tuan"){for(const s of ["L","R"]){const t=G.hit.sdf(r,(x,y,z)=>B.lungXYZ(x,y,z,s),40);if(t!=null)hits.push([t,"capL"])}
        const tb=G.hit.box(r,[-1.55,-2.3,-.78],[1.55,-2.05,.78]);if(tb!=null)hits.push([tb,"capB"]);
        const map={AoD:"Ao",IVC:"VC",LPA:"PA",RPA:"PA",LPV:"PV",RPV:"PV"};for(const k in B.EXT){const t=rayPoly(r,G.spline(B.EXT[k].pts,4),B.EXT[k].r);if(t!=null)hits.push([t-.02,map[k]])}}
      hits.sort((a,b)=>a[0]-b[0]);return hits.length?hits[0][1]:null}
    function pickLab(r){
      for(const b of bottles){const t=G.hit.box(r,[b.pos[0]-.28,0,b.pos[2]-.28],[b.pos[0]+.28,1.05,b.pos[2]+.28]);if(t!=null)return{bottle:b.s}}
      for(const w of WELLS){const c=w.n.pos;const t=G.hit.sphere(r,[c[0],.03,c[2]],.3);if(t!=null)return{well:w.idx}}return null}

    /* ================= con trỏ ================= */
    let downAt=null;
    const ptr=C.pointer(cv,{
      down(p,e){downAt=p;orbit.start(p,e.pointerId);return true},
      move(p,e){orbit.move(p,e.pointerId)},
      up(p,e,tap){orbit.end(e.pointerId);if(tap)onTap(p)},
      cancel(){orbit.end()},
      hover(p){if(frameN%3)return;const k=pick(p.x,p.y);cv.style.cursor=k?"pointer":"grab"}
    });
    function onWheel(e){e.preventDefault();zoom=C.clamp(zoom*Math.exp(e.deltaY*.0012),.45,2.2);cam.dist=fitDist(PRE[view].rad)*zoom}
    cv.addEventListener("wheel",onWheel,{passive:false});
    function onTap(p){const k=pick(p.x,p.y);if(!k)return;
      if(view==="mau"){if(k.bottle){S.reagent=S.reagent===k.bottle?null:k.bottle;refresh();return}
        if(k.well!=null){if(k.well>=8)return;const si=Math.floor(k.well/2),wi=k.well%2;if(!S.reagent){api.toast("Chọn lọ huyết thanh trước (anti-A hoặc anti-B).","info",2200);return}
          const want=wi===0?"A":"B";if(S.reagent!==want){api.toast(`Cột này dành cho huyết thanh anti-${want}.`,"warn",2200);return}addSerum(si,wi)}return}
      tapPart(k)}
    function tapPart(k){
      if(S.task){const ord=ORDER[S.task];const want=ord[S.seq.length];
        if(k===want){S.seq.push(k);if(S.seq.length===ord.length){S.done[S.task]=true;api.toast(`Đúng! ${S.task==="lon"?"Vòng tuần hoàn lớn":"Vòng tuần hoàn nhỏ"}: ${ord.map(x=>PARTS[x].ten).join(" → ")}.`,"ok",6000);setTimeout(()=>{S.task=null;S.seq=[];refresh()},1600)}else api.toast(`${PARTS[k].ten} ✓`,"ok",1200);refresh()}
        else api.toast(`Chưa đúng: ${(PARTS[k]||{ten:k}).ten}. ${S.seq.length?`Sau ${PARTS[S.seq[S.seq.length-1]].ten}, máu đi tới đâu?`:`Bắt đầu từ ngăn tim đẩy máu đi.`}`,"warn",3200);return}
      if(!PARTS[k])return;S.sel=k;api.card(`<h3>${PARTS[k].ten}</h3><p style="margin-top:8px">${PARTS[k].chuc}</p>`)}

    /* ================= xét nghiệm ================= */
    function newSamples(){const g=["A","B","AB","O"];for(let i=g.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[g[i],g[j]]=[g[j],g[i]]}S.samples=g.map((grp,i)=>({i,grp}));S.answers={};
      for(const w of WELLS){w.serum=false;w.mix=0;w.agg=0;w.willAgg=false}}
    function wellOf(si,wi){return WELLS[si*2+wi]}
    function addSerum(si,wi,instant){buildLab();const w=wellOf(si,wi);if(w.serum)return;const serum=wi===0?"A":"B";
      if(instant||!api.time.playing){setWellSerum(w,serum,agglut(serum,S.samples[si].grp),serum);refresh();return}
      S.drops.push({w,serum,t:0,will:agglut(serum,S.samples[si].grp)});refresh()}
    function wellResult(w){if(!w||!w.serum)return"chưa nhỏ";if(w.mix<1||(w.willAgg&&w.agg<.6))return"đang trộn…";return w.willAgg?"ngưng kết":"không ngưng kết"}
    const TINT={A:G.hex("#5B8BE6"),B:G.hex("#E2B93B"),P:G.hex("#E5C27E")};const BLOOD=G.hex("#7A0A16"),CLEAR=G.hex("#F1D9A6"),H2=G.hex("#9E1A26");
    function stepLab(dt){
      for(const d of S.drops){d.t+=dt;if(d.t>=.55&&!d.done){d.done=true;setWellSerum(d.w,d.serum,d.will,d.serum)}}
      S.drops=S.drops.filter(d=>d.t<.9);
      for(const w of WELLS){if(w.serum){if(w.mix<1)w.mix=Math.min(1,w.mix+dt/1.2);if(w.willAgg&&w.mix>=1)w.agg=Math.min(1,w.agg+dt/5)}
        const tint=w.tint?TINT[w.tint]||TINT.P:BLOOD;const m=w.serum?w.mix:0;
        /* chưa ngưng kết: máu đồng đều, hơi nhạt khi trộn huyết thanh; ngưng kết: hồng cầu vón cục, dịch xung quanh trong và mang màu huyết thanh */
        let col=BLOOD.map((c,i)=>c+(tint[i]*.03+c*.97-c)*m+(H2[i]-c)*.15*m);
        if(w.agg>0)col=col.map((c,i)=>c+(CLEAR[i]*.6+tint[i]*.4-c)*Math.min(1,w.agg*1.25));
        w.drop.mat.color=col;
        const D=w.cellsI.data;const sc=w.idx===8?1.15:1;
        w.pts.forEach((c,q)=>{if(w.serum&&w.agg<1){c.x+=(rnd()-.5)*(1-w.agg)*.12*dt;c.z+=(rnd()-.5)*(1-w.agg)*.12*dt;const r=Math.hypot(c.x,c.z);if(r>.17){c.x*=.17/r;c.z*=.17/r}}
          const cl=w.cl[c.c];const x=(c.x+(cl[0]+c.ox*.6-c.x)*w.agg)*sc,z=(c.z+(cl[1]+c.oz*.6-c.z)*w.agg)*sc;const vis=Math.min(1,w.agg*2.5);
          D.set([x,.03+.006*w.agg,z,.019*vis,.42,.02,.04,1],q*8)});w.cellsI.setInstances(w.agg>0?96:0)}
      dropper.visible=S.drops.length>0;if(S.drops.length){const d=S.drops[0];const c=d.w.n.pos;const y=.9-Math.min(1,d.t/.5)*.35;dropper.pos=[c[0],y,c[2]]}
      for(const b of bottles){b.ring.visible=S.reagent===b.s;b.n.pos=[b.pos[0],S.reagent===b.s?.08:0,b.pos[2]]}}
    function makeDropper(){dropper.add(R.mesh(G.lathe([[0,0],[.025,.02],[.03,.3],[.06,.36],[.065,.55],[0,.58]],24),{type:"glass",color:"#DDEBFF",alpha:.6}));
      dropper.add(R.mesh(G.lathe([[0,.5],[.07,.5],[.08,.6],[.05,.75],[0,.78]],24),{color:"#1F2333",rough:.5})).pos=[0,0,0];dropper.visible=false}
    makeDropper();

    /* ================= khay ================= */
    const ico={
      tuan:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 8c-8 0-14 5-14 12s6 12 14 12 14-5 14-12"/><path d="M34 20l-4-4M34 20l4-4"/><circle cx="20" cy="20" r="4" fill="currentColor"/></svg>',
      heart:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 34S6 25 6 15a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 19-14 19z"/></svg>',
      cut:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 34S6 25 6 15a7 7 0 0 1 14-2 7 7 0 0 1 14 2c0 10-14 19-14 19z"/><path d="M20 13v21M8 22h24" stroke-dasharray="2.5 3"/></svg>',
      drop:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 5c7 9 11 15 11 20a11 11 0 0 1-22 0c0-5 4-11 11-20z"/><circle cx="16" cy="25" r="2" fill="currentColor"/><circle cx="23" cy="28" r="2" fill="currentColor"/></svg>',
      eye:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="20" cy="20" r="5"/><path d="M4 20s6-10 16-10 16 10 16 10-6 10-16 10S4 20 4 20z"/></svg>',
      tag:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M6 8h14l14 14-12 12L8 20z"/><circle cx="14" cy="14" r="2.5"/></svg>',
      home:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 20a12 12 0 1 0 4-9L8 15"/><path d="M8 7v8h8"/></svg>'
    };
    function refreshDock(){
      api.dock.innerHTML=`<button class="titem" data-k="tuan" aria-pressed="${view==="tuan"}">${ico.tuan}Toàn hệ<br>tuần hoàn</button><button class="titem" data-k="tim" aria-pressed="${view==="tim"}">${ico.heart}Tim 3D</button><button class="titem" data-k="cat" aria-pressed="${view==="cat"}">${ico.cut}Mặt cắt<br>4 ngăn</button><button class="titem" data-k="mau" aria-pressed="${view==="mau"}">${ico.drop}Xét nghiệm<br>nhóm máu</button><button class="titem" data-k="follow" aria-pressed="${S.follow}">${ico.eye}Theo dõi<br>1 hồng cầu</button><button class="titem" data-k="labels" aria-pressed="${S.labels}">${ico.tag}Nhãn<br>tên gọi</button><button class="titem" data-k="home">${ico.home}Góc nhìn<br>ban đầu</button>`;
    }
    function onDock(e){const t=e.target.closest("[data-k]");if(!t)return;const k=t.dataset.k;
      if(k==="tuan"||k==="tim"||k==="cat"||k==="mau"){api.closeCard();zoom=1;goView(k)}
      else if(k==="follow"){S.follow=!S.follow;if(S.follow&&view!=="tuan"&&view!=="cat")goView("tuan");applyVis();refresh()}
      else if(k==="labels"){S.labels=!S.labels;applyVis();refresh()}
      else if(k==="home"){zoom=1;goView(view)}}
    api.dock.addEventListener("click",onDock);

    /* ================= hướng dẫn ================= */
    function typedAll(){return S.samples.length===4&&S.samples.every(s=>S.answers[s.i]===s.grp)}
    function refresh(){refreshDock();S.done.type=typedAll();
      api.okAt(0,S.locked);api.okAt(1,S.done.lon&&S.done.nho&&S.done.type);api.okAt(2,!!(S.obs.q1==="av"&&S.obs.q2==="0.4"));api.okAt(3,S.finished);
      if(bodyEl)renderStep()}
    function sel(id){const v=id==="d"?(S.txD||"O"):(S.txR||"A");return `<select data-sel="${id}" style="min-height:40px;border-radius:10px;border:1px solid var(--stroke-hi);background:var(--glass);padding:0 8px">${["A","B","AB","O"].map(g=>`<option ${g===v?"selected":""}>${g}</option>`).join("")}</select>`}
    function txDiagram(){const P={O:[150,22],A:[60,92],B:[240,92],AB:[150,160]};const arrows=[["O","A"],["O","B"],["O","AB"],["A","AB"],["B","AB"]];
      let s=`<svg viewBox="0 0 300 186" role="img" aria-label="Sơ đồ cho – nhận nhóm máu ABO" fill="none" stroke="currentColor" stroke-width="2"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>`;
      for(const [a,b] of arrows){const [x1,y1]=P[a],[x2,y2]=P[b];const d=Math.hypot(x2-x1,y2-y1);const ux=(x2-x1)/d,uy=(y2-y1)/d;s+=`<line x1="${x1+ux*24}" y1="${y1+uy*24}" x2="${x2-ux*26}" y2="${y2-uy*26}" marker-end="url(#ar)"/>`}
      for(const g in P){const [x,y]=P[g];s+=`<circle cx="${x}" cy="${y}" r="21" fill="var(--glass-solid)"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="15" font-weight="800" fill="currentColor" stroke="none">${g}</text>`}
      return s+`<text x="150" y="182" text-anchor="middle" font-size="10" fill="currentColor" stroke="none">Mũi tên: từ nhóm cho tới nhóm nhận (không kể truyền cùng nhóm)</text></svg>`}
    function renderStep(){const el=bodyEl;if(!el)return;
      const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      if(stepIdx===0){
        const q1=[["phoi","Lên phổi qua động mạch phổi"],["coquan","Đi tới các cơ quan qua động mạch chủ"],["nhi","Trở về tâm nhĩ phải"]];
        const q2=[["A","Chỉ nhóm A"],["AO","Nhóm A và nhóm O"],["tat","Cả bốn nhóm A, B, AB, O"]];
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2"><b>Câu 1.</b> Khi tâm thất trái co, máu từ tâm thất trái được đẩy đi đâu?</p>
          <div class="opts">${q1.map(([k,t],i)=>`<button class="opt" data-p1="${k}" aria-pressed="${S.p1===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          <p class="lead2"><b>Câu 2.</b> Theo sơ đồ cho – nhận (hệ ABO), người có nhóm máu A nhận được máu của nhóm nào?</p>
          <div class="opts">${q2.map(([k,t],i)=>`<button class="opt" data-p2="${k}" aria-pressed="${S.p2===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}
          <p class="muted" style="font-size:.84rem">Kéo trên mô hình để xoay, lăn chuột hoặc chụm hai ngón để phóng to, chạm vào một phần để xem tên và chức năng.</p>`;
      }else if(stepIdx===1){
        const task=(id,ten)=>{const ord=ORDER[id];const on=S.task===id;return `<li class="${S.done[id]?"done":""} ${on?"now":""}"><span class="tick">✓</span><div><b>${ten}</b>: ở cảnh “Toàn hệ tuần hoàn”, chạm lần lượt 5 chặng máu đi qua, bắt đầu từ ngăn tim đẩy máu đi.
          ${on?`<div class="chipset" style="margin-top:6px">${ord.map((k,i)=>`<button disabled aria-pressed="${i<S.seq.length}">${i<S.seq.length?PARTS[k].ten:(i+1)+". ?"}</button>`).join("")}</div>`:""}
          <div class="act">${S.done[id]?"":on?`<button class="btn sm" data-k="cancel">Dừng</button>`:`<button class="btn sm" data-k="task" data-v="${id}">Bắt đầu</button>`}</div></div></li>`};
        const nOk=S.samples.filter(s=>S.answers[s.i]===s.grp).length;
        el.innerHTML=`<h3>Làm</h3>
          <ol class="todo">${task("lon","Vòng tuần hoàn lớn")}${task("nho","Vòng tuần hoàn nhỏ")}
          <li class="${S.done.type?"done":""} ${S.done.lon&&S.done.nho&&!S.done.type?"now":""}"><span class="tick">✓</span><div><b>Xét nghiệm nhóm máu</b> 4 mẫu: chạm lọ huyết thanh, rồi chạm giếng cùng cột; quan sát hồng cầu có ngưng kết (vón cục) không, rồi chọn nhóm máu.
            <div class="act"><button class="btn sm" data-k="view" data-v="mau">Mở cảnh xét nghiệm</button> <button class="btn sm" data-k="allA">Nhỏ anti-A vào 4 mẫu</button> <button class="btn sm" data-k="allB">Nhỏ anti-B vào 4 mẫu</button></div></div></li></ol>
          <div class="samples">${S.samples.map(s=>`<div class="smp" data-row="${s.i}"><div><b>Mẫu ${s.i+1}</b> · anti-A: <span class="ra">${wellResult(wellOf(s.i,0))}</span> · anti-B: <span class="rb">${wellResult(wellOf(s.i,1))}</span></div><div class="chipset">${["A","B","AB","O"].map(g=>`<button data-ans="${s.i}" data-v="${g}" aria-pressed="${S.answers[s.i]===g}" ${wellOf(s.i,0)&&wellOf(s.i,0).serum&&wellOf(s.i,1).serum?"":"disabled"}>Nhóm ${g}</button>`).join("")}${S.answers[s.i]?(S.answers[s.i]===s.grp?" <span style=\"color:var(--sinh);font-weight:800\">✓</span>":" <span style=\"color:#EF4444;font-weight:800\">✗</span>"):""}</div></div>`).join("")}</div>
          <p class="muted" style="font-size:.84rem">Đúng ${nOk}/4. Kháng thể anti-A làm ngưng kết hồng cầu mang kháng nguyên A; anti-B làm ngưng kết hồng cầu mang kháng nguyên B.</p>
          ${gvTip("cho học sinh nói to: “Mẫu này ngưng kết với anti-A nên hồng cầu có kháng nguyên A”.")}`;
      }else if(stepIdx===2){
        const o1=[["av","Van nhĩ – thất đóng, van động mạch mở"],["mo","Cả hai loại van cùng mở"],["sl","Van nhĩ – thất mở, van động mạch đóng"]];
        const o2=[["0.1","0,1 s"],["0.3","0,3 s"],["0.4","0,4 s"]];
        el.innerHTML=`<h3>Quan sát chu kì tim và thử truyền máu</h3>
          <p class="lead2">Mở <b>Mặt cắt 4 ngăn</b>, chọn <b>0,25×</b> ở thanh thời gian (phím cách để dừng hình). Quan sát van và đồng hồ pha.</p>
          <button class="btn sm" data-k="view" data-v="cat">Mở mặt cắt</button>
          <p class="lead2"><b>Câu hỏi quan sát 1.</b> Trong pha tống máu của tâm thất, hai loại van ở trạng thái nào?</p>
          <div class="opts">${o1.map(([k,t],i)=>`<button class="opt ${S.obs.q1===k?(k==="av"?"right":"wrong"):""}" data-o1="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          ${S.obs.q1&&S.obs.q1!=="av"?`<div class="callout bad">Xem lại lúc đồng hồ pha ở vùng đỏ: van nhĩ – thất đóng để máu không chảy ngược lên tâm nhĩ.</div>`:""}
          <p class="lead2"><b>Câu hỏi quan sát 2.</b> Trong một chu kì 0,8 s, tim được nghỉ hoàn toàn (pha dãn chung) bao lâu?</p>
          <div class="opts">${o2.map(([k,t],i)=>`<button class="opt ${S.obs.q2===k?(k==="0.4"?"right":"wrong"):""}" data-o2="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          ${S.obs.q2&&S.obs.q2!=="0.4"?`<div class="callout bad">Nhìn cung màu xanh trên đồng hồ pha.</div>`:""}
          <p class="lead2" style="margin-top:6px"><b>Thử truyền máu</b> (trộn hồng cầu người cho với huyết tương người nhận, ở đĩa bên phải phiến sứ):</p>
          <div class="numin"><label>Người cho</label>${sel("d")}<label>Người nhận</label>${sel("r")}<button class="btn sm" data-k="tx">Thử trộn</button></div>
          ${S.txLog.length?`<ul class="tlist">${S.txLog.slice(-5).map(x=>`<li>Cho ${x.d} → nhận ${x.r}: ${x.ok?"<b>không ngưng kết</b>":"<b style=\"color:#EF4444\">ngưng kết</b>"}</li>`).join("")}</ul>`:""}`;
      }else{
        const Q=[
          {k:"a",t:"Vòng tuần hoàn nhỏ bắt đầu và kết thúc ở đâu?",o:[["a","Bắt đầu ở tâm thất phải, kết thúc ở tâm nhĩ trái"],["b","Bắt đầu ở tâm thất trái, kết thúc ở tâm nhĩ phải"],["c","Bắt đầu ở tâm nhĩ phải, kết thúc ở tâm thất trái"]],ok:"a",why:{b:"Đó là vòng tuần hoàn lớn.",c:"Máu luôn được đẩy đi từ tâm thất, không phải tâm nhĩ."}},
          {k:"b",t:"Vì sao thành tâm thất trái dày nhất?",o:[["a","Vì chứa máu đỏ thẫm"],["b","Vì phải co bóp mạnh để đẩy máu đi khắp cơ thể"],["c","Vì nhận máu từ phổi"]],ok:"b",why:{a:"Tâm thất trái chứa máu đỏ tươi.",c:"Máu từ phổi về tâm nhĩ trái; độ dày thành liên quan tới quãng đường phải đẩy máu đi."}},
          {k:"c",t:"Người nhóm máu O nhận được máu của nhóm nào (theo sơ đồ cho – nhận)?",o:[["a","Mọi nhóm"],["b","Chỉ nhóm O"],["c","Nhóm O và AB"]],ok:"b",why:{a:"Huyết tương nhóm O có cả anti-A và anti-B nên làm ngưng kết hồng cầu nhóm A, B, AB.",c:"Hồng cầu nhóm AB mang cả kháng nguyên A và B."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="coquan"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{phoi:"lên phổi",coquan:"tới các cơ quan qua động mạch chủ",nhi:"về tâm nhĩ phải"}[S.p1]}</b>. Đúng là: tâm thất trái → động mạch chủ → các cơ quan.</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="AO"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{A:"chỉ nhóm A",AO:"nhóm A và O",tat:"cả bốn nhóm"}[S.p2]}</b>. Theo sơ đồ cho – nhận: nhóm A nhận được nhóm A và nhóm O.</div>`:""}
          <ul class="tlist">
          <li><b>Vòng tuần hoàn lớn:</b> tâm thất trái → động mạch chủ → mao mạch các cơ quan → tĩnh mạch chủ → tâm nhĩ phải. Máu mang O₂, chất dinh dưỡng tới tế bào và nhận CO₂, chất thải.</li>
          <li><b>Vòng tuần hoàn nhỏ:</b> tâm thất phải → động mạch phổi → mao mạch phổi → tĩnh mạch phổi → tâm nhĩ trái. Máu thải CO₂, nhận O₂, từ đỏ thẫm thành đỏ tươi.</li>
          <li><b>Van tim</b> chỉ cho máu đi một chiều: tâm nhĩ → tâm thất → động mạch.</li>
          <li><b>Nhóm máu ABO</b> xác định theo kháng nguyên A, B trên hồng cầu. Truyền máu không phù hợp làm hồng cầu người cho bị ngưng kết. Thực tế phải xét nghiệm và ưu tiên truyền cùng nhóm.</li></ul>
          <div class="schbox">${txDiagram()}</div>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],i)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`;
      }
    }
    function onBody(e){const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}
      if(d.o1){S.obs.q1=d.o1;refresh();return}if(d.o2){S.obs.q2=d.o2;refresh();return}
      if(d.ans!=null&&d.v){const i=+d.ans;S.answers[i]=d.v;const sm=S.samples[i];
        api.record({mau:String(i+1),a:wellResult(wellOf(i,0)),b:wellResult(wellOf(i,1)),kl:"Nhóm "+d.v,ok:d.v===sm.grp?"✓":"✗"});
        if(d.v!==sm.grp)api.toast(`Mẫu ${i+1} chưa đúng. Ngưng kết với anti-A ⇒ có kháng nguyên A; ngưng kết với anti-B ⇒ có kháng nguyên B.`,"warn",4200);refresh();return}
      switch(d.k){
        case "lock":S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok");break;
        case "task":if(view!=="tuan")goView("tuan");S.task=d.v;S.seq=[];api.closeCard();api.toast(d.v==="lon"?"Chạm vào ngăn tim bắt đầu vòng tuần hoàn lớn.":"Chạm vào ngăn tim bắt đầu vòng tuần hoàn nhỏ.","info",2600);refresh();break;
        case "cancel":S.task=null;S.seq=[];refresh();break;
        case "view":goView(d.v);break;
        case "allA":goView("mau");S.samples.forEach(s=>addSerum(s.i,0,true));break;
        case "allB":goView("mau");S.samples.forEach(s=>addSerum(s.i,1,true));break;
        case "tx":{const dd=S.txD||"O",rr=S.txR||"A";if(view!=="mau")goView("mau");buildLab();const w=WELLS[8];w.serum=false;setWellSerum(w,"P",!compatible(dd,rr),"P");S.tx={d:dd,r:rr};S.txLog.push({d:dd,r:rr,ok:compatible(dd,rr)});
          api.toast(`Người cho ${dd} → người nhận ${rr}: ${compatible(dd,rr)?"không ngưng kết":"hồng cầu sẽ ngưng kết"} (quan sát đĩa bên phải).`,compatible(dd,rr)?"ok":"warn",4200);refresh();break}
        case "finish":S.finished=true;refresh();api.done(`<h2>Hoàn thành: Tim, vòng tuần hoàn, nhóm máu</h2><p class="muted">Em đã xác định đúng đường đi của máu trong hai vòng tuần hoàn và nhóm máu của 4 mẫu.</p>`);break;
      }}
    function onBodyChange(e){const s=e.target.closest("select[data-sel]");if(!s)return;if(s.dataset.sel==="d")S.txD=s.value;else S.txR=s.value}

    /* ================= nhãn phiến xét nghiệm ================= */
    function labLabels(){if(LBLAB.length)return;buildLab();
      LBLAB.push(Object.assign(LB.add(`<span>anti-A</span>`,[WX[0],.12,-1.5],"v-mau"),{view:"mau"}),Object.assign(LB.add(`<span>anti-B</span>`,[WX[1],.12,-1.5],"v-mau"),{view:"mau"}));
      for(let i=0;i<4;i++)LBLAB.push(Object.assign(LB.add(`<span id="lbS${i}">Mẫu ${i+1}</span>`,[.98,.1,WZ(i)],"v-mau right"),{view:"mau"}));
      LBLAB.push(Object.assign(LB.add(`<span>Huyết thanh anti-A</span>`,[-2.15,1.12,-.6],"v-mau"),{view:"mau"}),Object.assign(LB.add(`<span>Huyết thanh anti-B</span>`,[-2.15,1.12,.6],"v-mau"),{view:"mau"}),
        Object.assign(LB.add(`<span id="lbTx">Đĩa thử truyền máu</span>`,[TXW[0],.18,.62],"v-mau"),{view:"mau",dir:"s",len:34}))}

    /* ================= vòng lặp ================= */
    let occT=0;
    function frame(dt){frameN++;
      const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;const ph=phase(simT);
      orbit.update(dt);
      if(view!=="mau"){const u=matHeart.uniforms;u.uVen=ph.ven;u.uAtr=ph.atr;u.uPulse=ph.pulse;coroM.mat.uniforms.uVen=ph.ven;coroM.mat.uniforms.uPulse=ph.pulse;if(cutM){const cu=cutM.mat.uniforms;cu.uVen=ph.ven*.7;cu.uAtr=ph.atr;cu.uPulse=ph.pulse}
        stepCells(sdt,ph);animValves(sdt||dt*0,ph);writeCells();R.render(root,simT)}
      else{labLabels();stepLab(sdt);R.render(lab,simT)}
      /* nhãn */
      occT+=dt;if(occT>.2&&view!=="mau"){occT=0;const f=view==="cat"?cutSDF:heartSDF;for(const it of LBL){if(!it.on||it.view===view&&view==="tuan")continue;const p0=it.p0||it.p;const d=V3.dist(cam.eye,p0);const r={o:cam.eye,d:V3.norm(V3.sub(p0,cam.eye))};const t=G.hit.sdf(r,f,d+.1);
        /* điểm neo nằm sâu dưới bề mặt một chút thì neo lên bề mặt nhìn thấy; khuất hẳn phía sau thì ẩn */
        const occ=t!=null&&t<d-.06,snap=occ&&d-t<.6;it.p=snap?[r.o[0]+r.d[0]*t,r.o[1]+r.d[1]*t,r.o[2]+r.d[2]*t]:p0;it.el.classList.toggle("hid",occ&&!snap)}}
      LB.update();
      if(S.follow&&(view==="tuan"||view==="cat")){const c=cells[37];const s=B.segOf(c.k,c.i);const p=B.sample(s,c.d).p;const q=R.project(p);followTag.style.transform=`translate(${q.x.toFixed(1)}px,${q.y.toFixed(1)}px)`;
        const nm={sys:"động mạch chủ → các cơ quan",bed:"mao mạch các cơ quan",ret:"tĩnh mạch chủ → tim phải → động mạch phổi",toL:"động mạch phổi (sang phổi trái)",toR:"động mạch phổi (sang phổi phải)",lungL:"mao mạch phổi",lungR:"mao mạch phổi",backL:"tĩnh mạch phổi → tim trái",backR:"tĩnh mạch phổi → tim trái"}[c.k];
        followTag.firstChild.textContent="Hồng cầu đang ở: "+nm}
      if(view!=="mau"&&frameN%2===0){const a=-Math.PI/2+ph.x/CYC*Math.PI*2;const dot=over.querySelector("#phDot");dot.setAttribute("cx",(60+Math.cos(a)*46).toFixed(1));dot.setAttribute("cy",(60+Math.sin(a)*46).toFixed(1));
        over.querySelector("#phT").textContent=fmt(ph.x,2)+" s";over.querySelector("#phN").textContent=ph.ten;over.querySelector("#phAV").textContent="Van nhĩ – thất: "+(ph.av?"MỞ":"đóng");over.querySelector("#phSL").textContent="Van động mạch: "+(ph.sl?"MỞ":"đóng")}
      if(view==="mau"&&frameN%10===0){for(let i=0;i<4;i++){const el=document.getElementById("lbS"+i);if(el){const sm=S.samples[i];const a=S.answers[i];el.textContent=`Mẫu ${i+1}${a?` · em chọn ${a} ${a===sm.grp?"✓":"✗"}`:""}`}}
        const tx=document.getElementById("lbTx");if(tx)tx.textContent=S.tx?`Cho ${S.tx.d} → nhận ${S.tx.r}: ${WELLS[8].mix>=1&&(!WELLS[8].willAgg||WELLS[8].agg>.6)?(WELLS[8].willAgg?"ngưng kết":"không ngưng kết"):"đang trộn…"}`:"Đĩa thử truyền máu"}
      api.time.label(`t = ${fmt(simT,1)} s · ${view==="mau"?"xét nghiệm nhóm máu":ph.ten.split(" (")[0]}`,view==="mau"?null:ph.x/CYC);
      if(stepIdx===1&&bodyEl&&view==="mau"&&frameN%20===0)renderStepLight();
    }
    function renderStepLight(){if(!bodyEl)return;bodyEl.querySelectorAll(".smp").forEach(row=>{const s=S.samples[+row.dataset.row];if(!s)return;const a=wellOf(s.i,0),b=wellOf(s.i,1);
      row.querySelector(".ra").textContent=wellResult(a);row.querySelector(".rb").textContent=wellResult(b);row.querySelectorAll("button").forEach(x=>x.disabled=!(a&&b&&a.serum&&b.serum))})}

    theme();buildLab();newSamples();layout();goView("tuan",true);
    const loop=C.loop(frame);
    const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{simT=0;newSamples();S.tx=null;S.task=null;S.seq=[];S.drops=[];if(WELLS[8]){WELLS[8].serum=false}refresh()});
    vp.__lab={get S(){return S},get view(){return view},set view(v){goView(v,true)},goView,phase,cells,compatible,agglut,tapPart,addSerum,pick,R,get valves(){return valves},WELLS};
    return{
      step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;el.onchange=onBodyChange;renderStep()},
      layout,
      prefs(){theme();renderStep()},
      unmount(){dead=true;loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);LB.clear();R.dispose(root);R.dispose(lab);
        const ext=R.gl.getExtension("WEBGL_lose_context");if(ext)ext.loseContext();cv.remove();over.remove();delete vp.__lab}
    };
  }
});
})();
