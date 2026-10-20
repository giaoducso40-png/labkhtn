/* K7-H-01 · Lắp ráp nguyên tử (SGK KHTN 7 – Kết nối tri thức, Bài 2: Nguyên tử) · bản 3D
   Mô hình Rutherford – Bohr: hạt nhân (proton, neutron) xếp đặc ở tâm, electron chuyển động theo lớp; khối lượng nguyên tử theo amu.
   Cảnh 3D (LabGL): kéo hạt từ khay vào nguyên tử hoặc chạm khay để thêm; chạm hạt để bỏ ra; xem lớp electron dạng vòng Bohr hoặc vỏ cầu. */
(function(){
"use strict";
const C=window.LabCore,A=window.LabAtom,G=window.LabGL;
const fmt=C.fmt,H=G.hex;

const TASKS=[
  {k:"C",p:6,n:6,e:6,t:"Lắp nguyên tử carbon: 6 proton, 6 neutron, 6 electron."},
  {k:"O",p:8,n:8,e:8,t:"Lắp nguyên tử oxygen: 8 proton, 8 neutron, 8 electron."},
  {k:"Na",p:11,n:12,e:11,t:"Lắp nguyên tử sodium: 11 proton, 12 neutron, 11 electron. Lớp ngoài cùng có mấy electron?"},
  {k:"X",t:"Thử thách: lắp một nguyên tử trung hòa có 3 lớp electron, lớp ngoài cùng có 7 electron, số neutron như dạng thường gặp.",test:i=>i.p===17&&i.e===17&&i.n===18}
];

const GV=`<p><b>Yêu cầu cần đạt</b> (trích mục tiêu Bài 2)</p>
<ul class="tlist"><li>Trình bày được mô hình nguyên tử của Rutherford – Bohr (mô hình sắp xếp electron trong các lớp vỏ nguyên tử).</li><li>Nêu được khối lượng của một nguyên tử theo đơn vị quốc tế amu (đơn vị khối lượng nguyên tử).</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức (15 phút)</b></p>
<ul class="tlist"><li>Trình chiếu, cho học sinh lên kéo từng hạt từ khay vào nguyên tử 3D (có thể xoay để nhìn hạt nhân từ nhiều phía); cả lớp đếm số hạt và đọc tên nguyên tố trên thẻ bên phải.</li><li>Cho thêm một proton vào carbon: tên nguyên tố đổi ngay. Cho thêm một neutron: tên không đổi, chỉ khối lượng đổi.</li><li>Chọn 0,25× để electron quay chậm, chỉ rõ từng lớp.</li></ul>
<p style="margin-top:10px"><b>Lỗi học sinh hay gặp</b></p>
<ul class="tlist"><li>Nghĩ số neutron quyết định tên nguyên tố.</li><li>Xếp electron vào lớp ngoài khi lớp trong chưa đủ.</li><li>Cộng cả khối lượng electron như 1 amu.</li></ul>
<p style="margin-top:10px"><b>Lưu ý chuyên môn</b>: lớp electron thứ ba thật ra chứa được tới 18 electron; với 20 nguyên tố đầu, sau khi lớp 3 có 8 electron thì electron tiếp theo vào lớp 4 (K, Ca). Học sinh sẽ học kĩ ở lớp 10.</p>`;

const SRC=`<ul class="tlist">
<li>Mục tiêu bài: <a href="https://hoatieu.vn/powerpoint-khoa-hoc-tu-nhien-7-bai-2-nguyen-tu-231571" target="_blank" rel="noopener">kế hoạch bài dạy Bài 2 KNTT</a>.</li>
<li>Điện tích, khối lượng hạt (proton +1, 1 amu; neutron 0, 1 amu; electron −1, ≈ 0,00055 amu), lớp 1 tối đa 2 electron, lớp tiếp theo 8 electron, ví dụ carbon 6p–6n–6e (12 amu), lithium 3p–4n, fluorine 9p–10n (19 amu): sách bài tập KHTN 7 KNTT Bài 2, đối chiếu qua <a href="https://vndoc.com/giai-sbt-khtn-7-bai-2-nguyen-tu-274188" target="_blank" rel="noopener">VnDoc</a>.</li>
<li>Số neutron “thường gặp” là của đồng vị phổ biến nhất trong tự nhiên (ví dụ Cl-35: 18 neutron, Ar-40: 22 neutron, K-39: 20 neutron).</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p>
<ul class="tlist"><li>Kích thước hạt nhân và các lớp vẽ không theo tỉ lệ thật (hạt nhân thật nhỏ hơn nguyên tử khoảng hàng chục nghìn lần).</li>
<li>Electron vẽ trên các vòng tròn theo mô hình Bohr (hoặc trên vỏ cầu khi chọn “Vỏ cầu”); tốc độ quay chỉ để minh họa. Electron thật không chạy trên quỹ đạo tròn xác định.</li><li>Hạt nhân vẽ các proton, neutron xếp sát nhau thành khối cầu; màu sắc chỉ để phân biệt.</li>
<li>Chỉ dựng tới 20 proton (20 nguyên tố đầu), tối đa 20 electron, 30 neutron.</li></ul>`;

LabKHTN.register("K7-H-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"ten",t:"Nguyên tố"},{k:"pne",t:"p – n – e"},{k:"m",t:"Khối lượng",u:"amu"},{k:"lop",t:"Các lớp e"}],empty:"Lắp xong một nguyên tử thì bấm “Ghi nguyên tử này”."},
  gv:GV,sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Mô hình nguyên tử 3D: hạt nhân gồm proton và neutron, electron chuyển động trên các lớp; ba khay hạt để lắp ráp");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,simT=0,frameN=0,bodyEl=null,stepIdx=0;
    const S={nuc:[],e:0,task:0,done:[false,false,false,false],recs:[],p1:null,p2:null,locked:false,obs:{},seen:{},q:{},finished:false,hint:true,sphere:false};
    const cnt=t=>S.nuc.filter(x=>x===t).length;
    const cur=()=>A.info(cnt("p"),cnt("n"),S.e);

    /* ================= kích thước (không theo tỉ lệ thật) ================= */
    const RN=.105,RE=.055,SH=[.68,.98,1.28,1.58];
    const TILT=G.Q.euler(-.42,0,0);                 /* mặt phẳng các lớp hơi ngả về sau để thấy chiều sâu */
    const rotQ=(q,v)=>{const x=q[0],y=q[1],z=q[2],w=q[3];const ix=w*v[0]+y*v[2]-z*v[1],iy=w*v[1]+z*v[0]-x*v[2],iz=w*v[2]+x*v[1]-y*v[0],iw=-x*v[0]-y*v[1]-z*v[2];
      return[ix*w+iw*-x+iy*-z-iz*-y,iy*w+iw*-y+iz*-x-ix*-z,iz*w+iw*-z+ix*-y-iy*-x]};
    const COLP=H("#D8383A"),COLN=H("#8E99AE"),COLE=H("#4F8DFF");
    const root=new G.Node();
    const atomN=root.add(new G.Node());

    /* hạt nhân và electron: vẽ theo lô (instancing) */
    const nucM=root.add(R.instanced(G.sphere(1,24,16),{color:"#FFFFFF",rough:.42,coat:.35},60));
    const eM=root.add(R.instanced(G.sphere(1,18,12),{type:"unlit",color:"#FFFFFF"},40));
    const halo=root.add(R.instanced(G.sphere(1,14,10),{type:"unlit",color:"#6FA8FF",transparent:true,blend:"add",order:4,key:"ehalo",
      hooks:{fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=pow(abs(dot(N,V)),2.2);base.rgb=uBase.rgb*vC.rgb*f*.9;base.a=f;}`}},120));
    /* các lớp: vòng tròn mảnh (mô hình Bohr) và vỏ cầu mờ */
    const ringGeo=r=>G.tube(Array.from({length:97},(_,i)=>[Math.cos(i/96*6.2832)*r,0,Math.sin(i/96*6.2832)*r]),.0075,6);
    const rings=SH.map(r=>{const n=atomN.add(R.mesh(ringGeo(r),{type:"unlit",color:"#9FB4FF",transparent:true,alpha:.5,order:2}));n.quat=G.Q.mul(TILT,G.Q.euler(Math.PI/2,0,0));return n});
    const shells=SH.map(r=>{const n=atomN.add(R.mesh(G.sphere(r,48,32),{type:"glass",color:"#8FB0FF",alpha:.18}));n.visible=false;return n});
    const glow=atomN.add(R.mesh(G.sphere(1,32,20),{type:"unlit",color:"#B48CFF",transparent:true,blend:"add",order:1,key:"nglow",
      hooks:{fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=pow(abs(dot(N,V)),3.);base.rgb=uBase.rgb*f*.16;base.a=f;}`}}));

    /* khay hạt (nguồn) */
    const BINL={p:[-2.55,.85,0],n:[-2.55,0,0],e:[-2.55,-.85,0]},BINP={p:[-1.1,-2.3,0],n:[0,-2.3,0],e:[1.1,-2.3,0]};
    let BIN=BINL;
    const trayM={type:"glass",color:"#CFE0FF",alpha:.4};
    const trays={};for(const t of ["p","n","e"]){const n=root.add(new G.Node());n.add(R.mesh(G.lathe([[0,-.06],[.36,-.06],[.42,.02],[.4,.04],[.33,-.02],[0,-.02]],48),trayM));
      const pile=[];for(let q=0;q<6;q++){const a=q*2.4,r=q?.17:0;pile.push([Math.cos(a)*r,.06+(q>3?.07:0),Math.sin(a)*r])}trays[t]={n,pile};n.quat=G.Q.euler(.5,0,0)}

    /* hạt đang bay (thêm/bớt) */
    let fly=[];
    const sm=k=>k<=0?0:k>=1?1:k*k*(3-2*k);

    /* ================= nhãn, thẻ nguyên tố ================= */
    const LB=G.labels(over,R,{bounds:api.safe});
    const shellL=SH.map((r,i)=>LB.add(`<span></span>`,()=>{const p=S.sphere?[0,r,0]:rotQ(TILT,[0,r,0]);return[p[0],p[1]+.07,p[2]]}));
    const binL={p:LB.add(`<span>Proton<small>+1 · 1 amu</small></span>`,()=>V3a(BIN.p,[0,.42,0])),n:LB.add(`<span>Neutron<small>0 · 1 amu</small></span>`,()=>V3a(BIN.n,[0,.42,0])),e:LB.add(`<span>Electron<small>−1 · 0,00055 amu</small></span>`,()=>V3a(BIN.e,[0,.42,0]))};
    const V3a=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    const hintL=LB.add(`<span>Kéo hạt từ khay vào nguyên tử · chạm hạt trong nguyên tử để bỏ ra</span>`,()=>PRE===PREP?[0,2.15,0]:[0,-2.12,0],"plain");
    const card=document.createElement("div");card.className="gl-card glass";over.appendChild(card);

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:-1.2,maxPitch:1.3});
    const PREL={t:[-.55,0,0],yaw:0,pitch:.16,rad:2.3},PREP={t:[0,-.38,0],yaw:0,pitch:.12,rad:2.0};let PRE=PREL;
    let safe={x:0,y:0,w:1,h:1},zoom=1;
    function fitDist(rad){const s=R.size();const tv=Math.tan(cam.fov/2)*safe.h/s.h,th=Math.tan(cam.fov/2)*(s.w/s.h)*safe.w/s.w;return rad/Math.min(tv,th)}
    function home(){Object.assign(cam,{target:[...PRE.t],yaw:PRE.yaw,pitch:PRE.pitch,dist:fitDist(PRE.rad)*zoom})}
    let cardWH=[0,0];
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));const sf=api.safe();const s=R.size();
      const narrow=s.w<640;
      if(narrow){card.style.left=(sf.x+10)+"px";card.style.right=(s.w-sf.x-sf.w+10)+"px";card.style.top=(sf.y+10)+"px"}
      else{card.style.right=(s.w-sf.x-sf.w+12)+"px";card.style.left="auto";card.style.top=(sf.y+12)+"px"}
      /* vùng dành cho cảnh 3D: trừ chỗ của thẻ nguyên tố để thẻ không che nguyên tử */
      cardWH=[card.offsetWidth,card.offsetHeight];
      safe=narrow?{x:sf.x,y:sf.y+cardWH[1]+14,w:sf.w,h:Math.max(80,sf.h-cardWH[1]-14)}:{x:sf.x,y:sf.y,w:Math.max(80,sf.w-cardWH[0]-18),h:sf.h};
      cam.shift=[2*(safe.x+safe.w/2)/s.w-1,1-2*(safe.y+safe.h/2)/s.h];
      const port=safe.w<safe.h*1.25;if(port!==(PRE===PREP)){PRE=port?PREP:PREL;BIN=port?BINP:BINL;home()}cam.dist=fitDist(PRE.rad)*zoom}
    function theme(){day=api.day;const E=R.env;
      if(day){E.bgTop=H("#EEF2FC");E.bgBot=H("#D2DAEE");E.bgGlow=H("#FFFFFF");E.sky=H("#C3CCE8");E.gnd=H("#8A90A6");E.hor=H("#D2D9EC");E.exposure=.9;E.ink=.45}
      else{E.bgTop=H("#141B44");E.bgBot=H("#04061A");E.bgGlow=H("#2C2A78");E.sky=H("#5B68A8");E.gnd=H("#141830");E.hor=H("#36406A");E.exposure=.85;E.ink=0}
      E.k1c=[2.3,2.15,2.0];E.k2c=[.7,.8,1.1];E.k3c=[1,.85,1.1];
      rings.forEach(r=>{r.mat.color=day?H("#3B4DA8"):H("#9FB4FF")});glow.mat.color=day?H("#7C5CE0"):H("#B48CFF");over.classList.toggle("day",day)}

    /* ================= thao tác ================= */
    function add(t,silent,from){
      const i=cur();
      if(t==="p"&&i.p>=20){if(!silent)api.toast("Bản này dựng tới 20 proton (20 nguyên tố đầu).","info");return false}
      if(t==="n"&&i.n>=30){if(!silent)api.toast("Đã đủ 30 neutron – mức tối đa của bản này.","info");return false}
      if(t==="e"){if(S.e>=20){if(!silent)api.toast("Tối đa 20 electron trong bản này.","info");return false}S.e++}else S.nuc.push(t);
      if(!silent){const to=t==="e"?ePos(A.shells(S.e).length-1,A.shells(S.e).slice(-1)[0]-1,A.shells(S.e).slice(-1)[0],simT):[0,0,0];fly.push({t,from:from||trayTop(t),to,k:0,add:true})}
      S.hint=false;afterChange();return true}
    function remove(t,idx){let from=null;
      if(t==="e"){if(S.e<=0)return false;const sh=A.shells(S.e);from=ePos(sh.length-1,sh[sh.length-1]-1,sh[sh.length-1],simT);S.e--}
      else{const k=(idx!=null&&S.nuc[idx]===t)?idx:S.nuc.lastIndexOf(t);if(k<0)return false;from=nucPos(k,S.nuc.length,simT);S.nuc.splice(k,1)}
      fly.push({t,from,to:trayTop(t),k:0,add:false});afterChange();return true}
    function clearAll(){S.nuc=[];S.e=0;fly=[];afterChange()}
    function setAtom(p,n,e){S.hint=false;S.nuc=[];for(let i=0;i<Math.max(p,n);i++){if(i<p)S.nuc.push("p");if(i<n)S.nuc.push("n")}S.e=e;fly=[];afterChange()}
    function afterChange(){
      const i=cur();
      if(i.p===6&&i.n===7)S.seen.n=true;
      if(i.p===7&&i.n===6)S.seen.p=true;
      if(stepIdx===1)TASKS.forEach((t,j)=>{if(S.done[j])return;const ok=t.test?t.test(i):(i.p===t.p&&i.n===t.n&&i.e===t.e);
        if(ok){S.done[j]=true;recordAtom(true);api.toast(`Đúng! ${i.el[1]} (${i.el[0]}): ${i.p} p – ${i.n} n – ${i.e} e, khối lượng ≈ ${i.massRound} amu.`,"ok",4500);const nx=S.done.indexOf(false);if(nx>=0)S.task=nx}});
      updateCard();refresh()}
    function recordAtom(auto){
      const i=cur();if(!i.p&&!i.n&&!i.e){api.toast("Chưa có hạt nào.","info");return}
      S.recs.push({...i});
      api.record({lan:String(S.recs.length),ten:i.el?`${i.el[1]} (${i.el[0]})${i.charge?` · điện tích ${i.charge>0?"+":""}${i.charge}`:""}`:"(chưa có proton)",pne:`${i.p} – ${i.n} – ${i.e}`,m:fmt(i.mass,4),lop:i.sh.join(", ")||"—"});
      if(!auto)api.toast("Đã ghi vào bảng.","ok",1500)}

    /* ================= vị trí hạt ================= */
    /* hạt nhân: xếp đặc theo hình cầu (bán kính tăng theo căn bậc ba số hạt), hướng theo xoắn Fibonacci; rung nhẹ */
    /* xếp đặc tham lam: mỗi hạt mới đặt ở chỗ gần tâm nhất còn trống, sát các hạt đã có → khối gần cầu, hạt cũ giữ nguyên chỗ */
    const PACK=(()=>{const d=2*RN*.9,P=[[0,0,0]];const dirs=[];for(let i=0;i<40;i++){const y=1-2*(i+.5)/40,r=Math.sqrt(1-y*y),a=i*2.399963;dirs.push([Math.cos(a)*r,y,Math.sin(a)*r])}
      while(P.length<60){let best=null,bd=1e9;for(const q of P)for(const u of dirs){const c=[q[0]+u[0]*d,q[1]+u[1]*d,q[2]+u[2]*d];const m=Math.hypot(...c);if(m>=bd)continue;
          let ok=true;for(const o of P){if(Math.hypot(c[0]-o[0],c[1]-o[1],c[2]-o[2])<d*.985){ok=false;break}}if(ok){bd=m;best=c}}P.push(best)}
      /* đưa tâm khối về gốc theo từng N */
      return P})();
    const CEN=[];{let sx=0,sy=0,sz=0;for(let i=0;i<PACK.length;i++){sx+=PACK[i][0];sy+=PACK[i][1];sz+=PACK[i][2];CEN.push([sx/(i+1),sy/(i+1),sz/(i+1)])}}
    function nucPos(idx,N,t){const p=PACK[idx],c=CEN[Math.max(0,N-1)];const j=api.fx?.006:0;
      return[p[0]-c[0]+Math.sin(t*9+idx)*j,p[1]-c[1]+Math.cos(t*8+idx*1.7)*j,p[2]-c[2]+Math.sin(t*7+idx*2.3)*j]}
    function ePos(k,j,n,t){const w=[.9,.62,.45,.34][k];const r=SH[k];
      if(S.sphere){/* vỏ cầu: electron phân bố trên mặt cầu, cả vỏ quay chậm */
        const y=n>1?1-2*(j+.5)/n:0,rr=Math.sqrt(1-y*y),a=j*2.399963+t*w*(k%2?-1:1);return[Math.cos(a)*rr*r,y*r,Math.sin(a)*rr*r]}
      const a=Math.PI/2+j/n*6.2832+t*w*(k%2?-1:1);return rotQ(TILT,[Math.cos(a)*r,Math.sin(a)*r,0])}
    function trayTop(t){const b=BIN[t];return[b[0],b[1]+.12,b[2]+.05]}

    /* ================= vẽ ================= */
    function draw(){
      const i=cur(),sh=i.sh,N=S.nuc.length;
      /* hạt nhân */
      const D=nucM.data;let c=0;const flyN=fly.filter(f=>f.add&&f.t!=="e").length;
      for(let idx=0;idx<N;idx++){if(idx>=N-flyN)continue;const p=nucPos(idx,N,simT);const col=S.nuc[idx]==="p"?COLP:COLN;D.set([p[0],p[1],p[2],RN,col[0],col[1],col[2],1],c*8);c++}
      /* khay */
      for(const t of ["p","n","e"]){const b=BIN[t],tr=trays[t];tr.n.pos=b;
        for(const q of tr.pile){const qq=rotQ(G.Q.euler(.5,0,0),q);const col=t==="p"?COLP:t==="n"?COLN:COLE;if(t!=="e"){D.set([b[0]+qq[0],b[1]+qq[1],b[2]+qq[2],RN,col[0],col[1],col[2],1],c*8);c++}}}
      /* hạt đang bay */
      const E=eM.data,Hh=halo.data;let ce=0,ch=0;
      for(const f of fly){const k=sm(f.k);const p=[f.from[0]+(f.to[0]-f.from[0])*k,f.from[1]+(f.to[1]-f.from[1])*k+Math.sin(Math.PI*k)*.35,f.from[2]+(f.to[2]-f.from[2])*k];
        if(f.t==="e"){E.set([p[0],p[1],p[2],RE,COLE[0]*1.2,COLE[1]*1.2,COLE[2]*1.2,1],ce*8);ce++;Hh.set([p[0],p[1],p[2],RE*2.6,.6,.8,1,1],ch*8);ch++}
        else{const col=f.t==="p"?COLP:COLN;D.set([p[0],p[1],p[2],RN,col[0],col[1],col[2],1],c*8);c++}}
      if(drag&&drag.moved){const p=drag.p;if(drag.t==="e"){E.set([p[0],p[1],p[2],RE*1.2,COLE[0]*1.2,COLE[1]*1.2,COLE[2]*1.2,1],ce*8);ce++;Hh.set([p[0],p[1],p[2],RE*3,.6,.8,1,1],ch*8);ch++}
        else{const col=drag.t==="p"?COLP:COLN;D.set([p[0],p[1],p[2],RN*1.1,col[0],col[1],col[2],1],c*8);c++}}
      nucM.setInstances(c);
      /* electron trên các lớp (+ vệt sáng phía sau) */
      const flyE=fly.filter(f=>f.add&&f.t==="e").length;let left=Math.max(0,S.e-flyE);const shV=A.shells(left);
      for(let k=0;k<shV.length;k++)for(let j=0;j<shV[k];j++){const p=ePos(k,j,shV[k],simT);E.set([p[0],p[1],p[2],RE,COLE[0]*1.25,COLE[1]*1.25,COLE[2]*1.3,1],ce*8);ce++;
        Hh.set([p[0],p[1],p[2],RE*2.6,.55,.75,1,1],ch*8);ch++;
        for(let tr=1;tr<=3;tr++){const q=ePos(k,j,shV[k],simT-tr*.045);const a=.5-tr*.13;Hh.set([q[0],q[1],q[2],RE*(1.6-tr*.25),.5*a,.7*a,1*a,1],ch*8);ch++}}
      /* electron trong khay */
      const b=BIN.e;for(const q of trays.e.pile){const qq=rotQ(G.Q.euler(.5,0,0),q);E.set([b[0]+qq[0],b[1]+qq[1],b[2]+qq[2],RE,COLE[0],COLE[1],COLE[2],1],ce*8);ce++}
      eM.setInstances(ce);halo.setInstances(ch);
      /* vòng lớp, vỏ cầu, quầng hạt nhân */
      const used=sh.length;rings.forEach((r,k)=>{r.visible=!S.sphere;r.mat.alpha=k<used?.55:.14});shells.forEach((s,k)=>{s.visible=S.sphere&&k<Math.max(1,used)});
      const nr=N?RN*1.05*Math.cbrt(N)+RN:.12;glow.scl=[nr*2.2,nr*2.2,nr*2.2];glow.visible=N>0;
      shellL.forEach((L,k)=>{L.on=!S.sphere||k<used;const h=`<span>Lớp ${k+1}${k<used?` · ${sh[k]} e`:""}</span>`;if(L._h!==h){L.el.innerHTML=h;L._h=h}L.el.style.opacity=k<used?1:.55});
      hintL.on=S.hint}
    function updateCard(){const i=cur();
      const chgV=`${i.charge>0?"+":""}${i.charge}`,chgS=i.charge===0?(i.p?"trung hòa":""):"chưa trung hòa";
      const note=i.el&&i.n!==i.commonN?`Dạng ${i.el[1]} thường gặp có ${i.commonN} neutron.`:"";
      card.innerHTML=`<div class="tile ${i.el?"":"none"}"><span class="sym">${i.el?i.el[0]:"?"}</span><span class="z">${i.p||"?"}</span><span class="nm">${i.el?i.el[1]+(i.el[3]?` <small style="font-weight:600;opacity:.8">(${i.el[3]})</small>`:""):"Chưa có proton"}</span></div>
        <div class="cnt"><div><b>${i.p}</b><i style="background:#EF4444"></i>proton</div><div><b>${i.n}</b><i style="background:#A3AEC2"></i>neutron</div><div><b>${i.e}</b><i style="background:#4F8DFF"></i>electron</div></div>
        <dl><dt>Điện tích</dt><dd>${chgV}${chgS?` · ${chgS}`:""}</dd><dt>Khối lượng</dt><dd>${fmt(i.mass,4)} amu</dd><dt>≈ p + n</dt><dd>${i.massRound} amu</dd><dt>Các lớp e</dt><dd>${i.sh.join(", ")||"—"}</dd></dl>
        ${note?`<div class="note">${note}</div>`:""}`;if(Math.abs(card.offsetWidth-cardWH[0])>4||Math.abs(card.offsetHeight-cardWH[1])>4)layout()}

    /* ================= con trỏ: kéo hạt từ khay, chạm để bỏ ================= */
    let drag=null;
    const V3s=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],V3n=a=>{const l=Math.hypot(...a)||1;return[a[0]/l,a[1]/l,a[2]/l]};
    const camEye=()=>cam.eye||[0,0,6];
    function onPlane(px,py){/* giao tia với mặt phẳng qua tâm nguyên tử, vuông góc hướng nhìn */const r=R.ray(px,py);const n=V3n(V3s(camEye(),[0,0,0]));const dn=r.d[0]*n[0]+r.d[1]*n[1]+r.d[2]*n[2];if(Math.abs(dn)<1e-5)return null;const t=-(r.o[0]*n[0]+r.o[1]*n[1]+r.o[2]*n[2])/dn;return t>0?[r.o[0]+r.d[0]*t,r.o[1]+r.d[1]*t,r.o[2]+r.d[2]*t]:null}
    function pick(px,py){const r=R.ray(px,py);let best=null,bt=1e9;const test=(c,rad,o)=>{const t=G.hit.sphere(r,c,rad);if(t!=null&&t<bt){bt=t;best=o}};
      for(const t of ["p","n","e"])test(trayTop(t),.42,{bin:t});
      const sh=A.shells(S.e);for(let k=0;k<sh.length;k++)for(let j=0;j<sh[k];j++)test(ePos(k,j,sh[k],simT),RE*2.4,{t:"e"});
      const N=S.nuc.length;for(let idx=0;idx<N;idx++)test(nucPos(idx,N,simT),RN*1.15,{t:S.nuc[idx],idx});
      return best}
    const ptr=C.pointer(cv,{
      down(p,e){const k=pick(p.x,p.y);if(k&&k.bin){drag={t:k.bin,from:"bin",p:trayTop(k.bin),moved:false};return true}
        if(k&&k.t){drag={t:k.t,idx:k.idx,from:"atom",p:null,moved:false};return true}orbit.start(p,e.pointerId);return true},
      move(p,e){if(drag){const q=onPlane(p.x,p.y);if(q){drag.p=q;drag.moved=true}return}orbit.move(p,e.pointerId)},
      up(p,e,tap){if(!drag){orbit.end(e.pointerId);return}const d=drag;drag=null;
        if(d.from==="bin"){if(tap){add(d.t);return}const q=d.p,r=Math.hypot(...q);
          if(r<SH[3]+.3){if(d.t!=="e"&&r>SH[0]-.15)api.toast("Proton và neutron nằm trong hạt nhân ở tâm nguyên tử.","info",2600);
            if(d.t==="e"&&r<.35)api.toast("Electron chuyển động ở lớp vỏ, không nằm trong hạt nhân.","info",2600);
            if(d.t==="e"&&!S.sphere){const want=SH.findIndex(R0=>Math.abs(r-R0)<.17);const next=A.shells(S.e+1).length-1;if(want>=0&&want!==next)api.toast(`Electron xếp từ lớp trong ra ngoài: electron này vào lớp ${next+1}.`,"info",3000)}
            add(d.t,false,q)}
          else api.toast("Thả hạt vào bên trong nguyên tử.","info",1800)}
        else if(tap||(d.p&&Math.hypot(...d.p)>SH[3]+.3))remove(d.t,d.idx)},
      cancel(){drag=null;orbit.end()},
      hover(p){if(frameN%3)return;const k=pick(p.x,p.y);cv.style.cursor=k&&k.bin?"grab":k?"pointer":"default"}});
    function onWheel(e){e.preventDefault();zoom=C.clamp(zoom*Math.exp(e.deltaY*.0012),.5,2.2);cam.dist=fitDist(PRE.rad)*zoom}
    cv.addEventListener("wheel",onWheel,{passive:false});

    /* ================= khay ================= */
    const ico=t=>`<svg viewBox="0 0 40 40"><defs><radialGradient id="g${t}" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="${A.COL[t]}"/><stop offset="1" stop-color="${A.COL[t]}" stop-opacity=".75"/></radialGradient></defs><circle cx="20" cy="20" r="11" fill="url(#g${t})"/><text x="20" y="25" text-anchor="middle" font-size="15" font-weight="900" fill="#fff">${A.LAB[t]}</text></svg>`;
    function refreshDock(){
      const i=cur();
      api.dock.innerHTML=["p","n","e"].map(t=>`<div class="titem" style="gap:4px">${ico(t)}${{p:"Proton",n:"Neutron",e:"Electron"}[t]} · ${t==="p"?i.p:t==="n"?i.n:i.e}<div style="display:flex;gap:4px"><button class="btn sm" data-k="rm" data-v="${t}" aria-label="Bớt ${t}" style="min-height:30px;padding:0 9px">−</button><button class="btn sm" data-k="add" data-v="${t}" aria-label="Thêm ${t}" style="min-height:30px;padding:0 9px">+</button></div></div>`).join("")+
      `<button class="titem" data-k="shape" aria-pressed="${S.sphere}"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2"><circle cx="20" cy="20" r="13"/><ellipse cx="20" cy="20" rx="13" ry="5"/><circle cx="20" cy="20" r="3" fill="currentColor"/></svg>${S.sphere?"Vỏ cầu":"Vòng Bohr"}</button><button class="titem" data-k="clear"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 12h20M16 12V8h8v4M13 12l1.5 20h11L27 12"/></svg>Xóa hết</button><button class="titem" data-k="rec"><svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><rect x="8" y="7" width="24" height="27" rx="3"/><path d="M13 15h14M13 21h14M13 27h8" stroke-linecap="round"/></svg>Ghi vào<br>bảng</button>`}
    function onDock(e){const t=e.target.closest("[data-k]");if(!t)return;const k=t.dataset.k;if(k==="add")add(t.dataset.v);else if(k==="rm")remove(t.dataset.v);else if(k==="clear")clearAll();else if(k==="rec")recordAtom(false);
      else if(k==="shape"){S.sphere=!S.sphere;refreshDock();api.toast(S.sphere?"Vỏ cầu: electron có thể ở mọi hướng quanh hạt nhân; mỗi lớp là một vùng không gian.":"Vòng Bohr: mỗi lớp vẽ thành một vòng tròn như SGK.","info",3200)}}
    api.dock.addEventListener("click",onDock);

    function refresh(){
      refreshDock();
      api.okAt(0,S.locked);api.okAt(1,S.done.slice(0,3).every(Boolean));
      api.okAt(2,S.obs.a==="khong"&&S.obs.b==="N"&&S.obs.c==="e");api.okAt(3,S.finished);
      if(bodyEl)renderStep();
    }
    function renderStep(){
      const el=bodyEl;if(!el)return;const i=cur();
      const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      if(stepIdx===0){
        const q1=[["6","Khoảng 6 amu"],["12","Khoảng 12 amu"],["18","Khoảng 18 amu"]];
        const q2=[["pe","Số proton bằng số electron"],["pn","Số proton bằng số neutron"],["n","Vì có neutron không mang điện"]];
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2"><b>Câu 1.</b> Nguyên tử carbon có 6 proton, 6 neutron, 6 electron. Khối lượng của nguyên tử carbon khoảng:</p>
          <div class="opts">${q1.map(([k,t],j)=>`<button class="opt" data-p1="${k}" aria-pressed="${S.p1===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>
          <p class="lead2"><b>Câu 2.</b> Nguyên tử trung hòa về điện vì:</p>
          <div class="opts">${q2.map(([k,t],j)=>`<button class="opt" data-p2="${k}" aria-pressed="${S.p2===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}`;
      }else if(stepIdx===1){
        el.innerHTML=`<h3>Lắp ráp nguyên tử</h3>
          <ol class="todo">${TASKS.map((t,j)=>`<li class="${S.done[j]?"done":""} ${S.task===j&&!S.done[j]?"now":""}"><span class="tick">✓</span><div>${t.t}${S.task===j&&!S.done[j]?`<div class="muted" style="font-size:.82rem;margin-top:3px">Đang có: ${i.p} p – ${i.n} n – ${i.e} e</div>`:""}${!S.done[j]&&S.task!==j?`<div class="act"><button class="btn sm" data-k="task" data-v="${j}">Làm mục này</button></div>`:""}</div></li>`).join("")}</ol>
          <div class="callout">Kéo hạt từ khay vào nguyên tử, hoặc chạm vào khay để thêm một hạt. Chạm vào hạt trong nguyên tử để bỏ ra. Kéo nền để xoay mô hình; nút +/− ở khay dụng cụ cũng dùng được.</div>
          <button class="btn sm" data-k="clear">Xóa hết để lắp nguyên tử mới</button>
          ${gvTip("hỏi trước khi học sinh thả electron thứ 3 của lithium: electron này vào lớp nào, vì sao?")}`;
      }else if(stepIdx===2){
        const oa=[["doi","Tên nguyên tố thay đổi"],["khong","Tên nguyên tố không đổi, khối lượng tăng 1 amu"]];
        const ob=[["N","Thành nitrogen"],["C","Vẫn là carbon"],["O","Thành oxygen"]];
        const oc=[["e","Có, electron rất nhẹ (khoảng 0,00055 amu)"],["k","Không, electron nặng như proton"]];
        const box=(id,txt,opts,ok,expl,need)=>`<p class="lead2">${txt}</p>${need?`<div class="muted" style="font-size:.84rem">${need}</div>`:`<div class="opts">${opts.map(([k,t],j)=>`<button class="opt ${S.obs[id]===k?(k===ok?"right":"wrong"):""}" data-obs="${id}" data-v="${k}"><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>${S.obs[id]&&S.obs[id]!==ok?`<div class="callout bad">${expl}</div>`:""}`}`;
        el.innerHTML=`<h3>Quan sát</h3>
          <div class="act" style="display:flex;gap:6px;flex-wrap:wrap"><button class="btn sm" data-k="setC">Lắp sẵn carbon 6–6–6</button><button class="btn sm" data-k="addn">+1 neutron</button><button class="btn sm" data-k="addp">+1 proton</button><button class="btn sm" data-k="adde">+1 electron</button></div>
          ${box("a","<b>1.</b> Từ carbon 6–6–6, thêm 1 neutron. Điều gì xảy ra?",oa,"khong","Nhìn ô nguyên tố: số proton vẫn là 6 nên vẫn là carbon; chỉ khối lượng tăng.",S.seen.n?"":"Bấm “Lắp sẵn carbon 6–6–6” rồi “+1 neutron” và nhìn ô nguyên tố.")}
          ${box("b","<b>2.</b> Từ carbon 6–6–6, thêm 1 proton. Tên nguyên tố trên thẻ đổi thành:",ob,"N","Số proton quyết định nguyên tố: 7 proton là nitrogen. (Lúc này điện tích là +1 vì có 7 proton nhưng chỉ 6 electron.)",S.seen.p?"":"Bấm “Lắp sẵn carbon 6–6–6” rồi “+1 proton” và nhìn ô nguyên tố.")}
          ${box("c","<b>3.</b> So sánh “Khối lượng” trên thẻ (ví dụ 12,0033) với p + n (12). Phần lẻ rất nhỏ có phải do electron?",oc,"e","Mỗi electron chỉ khoảng 0,00055 amu, nên khối lượng nguyên tử gần bằng khối lượng hạt nhân.")}
          ${S.recs.length?`<div class="table-wrap"><table class="atoms"><thead><tr><th>Nguyên tố</th><th>p–n–e</th><th>Khối lượng (amu)</th><th>Lớp e</th></tr></thead><tbody>${S.recs.map(r=>`<tr><td>${r.el?r.el[0]:"?"}</td><td class="num">${r.p}–${r.n}–${r.e}</td><td class="num">${fmt(r.mass,4)}</td><td>${r.sh.join(", ")}</td></tr>`).join("")}</tbody></table></div>`:""}`;
      }else{
        const Q=[
          {k:"a",t:"Hạt nào mang điện tích dương, nằm trong hạt nhân?",o:[["a","Electron"],["b","Proton"],["c","Neutron"]],ok:"b",why:{a:"Electron mang điện tích −1 và chuyển động ở lớp vỏ.",c:"Neutron không mang điện."}},
          {k:"b",t:"Nguyên tử sodium có 11 electron. Số electron ở các lớp từ trong ra ngoài là:",o:[["a","2, 8, 1"],["b","8, 2, 1"],["c","2, 9"]],ok:"a",why:{b:"Lớp trong cùng (lớp 1) tối đa 2 electron, xếp từ trong ra ngoài.",c:"Lớp 2 tối đa 8 electron, electron thứ 11 phải sang lớp 3."}},
          {k:"c",t:"Nguyên tử fluorine có 9 proton và 10 neutron. Khối lượng nguyên tử fluorine khoảng:",o:[["a","9 amu"],["b","10 amu"],["c","19 amu"]],ok:"c",why:{a:"Cần cộng cả neutron: khối lượng ≈ p + n.",b:"Cần cộng cả proton: khối lượng ≈ p + n."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="12"?"ok":"bad"}">Câu 1 em dự đoán: <b>khoảng ${S.p1} amu</b>. Carbon 6–6–6 có khối lượng ≈ 6 + 6 = 12 amu (electron gần như không đáng kể).</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="pe"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{pe:"số p bằng số e",pn:"số p bằng số n",n:"có neutron không mang điện"}[S.p2]}</b>. Nguyên tử trung hòa vì tổng điện tích dương của proton bằng tổng điện tích âm của electron.</div>`:""}
          <ul class="tlist"><li>Nguyên tử gồm <b>hạt nhân</b> (proton mang điện +1, neutron không mang điện) và <b>vỏ</b> gồm các electron (mang điện −1) chuyển động theo từng lớp.</li>
          <li>Số proton cho biết đó là nguyên tố nào. Trong nguyên tử, số proton bằng số electron.</li>
          <li>Electron xếp từ lớp trong ra ngoài: lớp 1 tối đa 2 electron, lớp 2 tối đa 8 electron.</li>
          <li>Khối lượng nguyên tử (amu) ≈ số proton + số neutron.</li></ul>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],j)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`;
      }
    }
    function onBody(e){
      const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}
      if(d.obs){S.obs[d.obs]=d.v;refresh();return}
      switch(d.k){
        case "lock":S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok");break;
        case "task":S.task=+d.v;refresh();break;
        case "clear":clearAll();break;
        case "setC":setAtom(6,6,6);break;
        case "addn":add("n");break;case "addp":add("p");break;case "adde":add("e");break;
        case "finish":S.finished=true;refresh();api.done(`<h2>Hoàn thành: Lắp ráp nguyên tử</h2><p class="muted">Số proton quyết định nguyên tố; khối lượng nguyên tử ≈ p + n (amu); electron xếp theo lớp 2, 8, …</p>`);break;
      }
    }


    function frame(dt){frameN++;const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      for(const f of fly)f.k=Math.min(1,f.k+dt/.55);fly=fly.filter(f=>f.k<1);
      draw();R.render(root,simT);LB.update();
      const i=cur();api.time.label(`${i.el?i.el[1]:"Chưa có proton"} · ${i.p} p · ${i.n} n · ${i.e} e`,null)}
    theme();layout();home();updateCard();refreshDock();
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{clearAll();simT=0});
    vp.__lab={get S(){return S},cur,add,remove,setAtom,clearAll,recordAtom,pick,R,get fly(){return fly}};
    return{step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},layout,prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
