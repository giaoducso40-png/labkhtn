/* K9-S-05 · Nhiễm sắc thể; nguyên phân, giảm phân (SGK KHTN 9 – Kết nối tri thức, Bài 42–43) · 3D
   Tế bào mô hình có bộ NST 2n = 4 (hai cặp tương đồng: một cặp dài, một cặp ngắn; màu đỏ: NST có nguồn gốc từ mẹ, màu xanh: từ bố).
   - NST kép: hai chromatid chị em đính nhau ở tâm động; mỗi chromatid gồm một phân tử DNA quấn quanh protein histone.
   - Nguyên phân: kì trung gian (NST nhân đôi) → kì đầu → kì giữa (NST kép xếp một hàng trên mặt phẳng xích đạo) → kì sau
     (hai chromatid tách nhau về hai cực) → kì cuối → 2 tế bào con, mỗi tế bào 2n NST.
   - Giảm phân: lần I (kì đầu I tiếp hợp, có thể trao đổi chéo; kì giữa I các cặp NST kép tương đồng xếp hai hàng; kì sau I mỗi NST kép
     trong cặp đi về một cực) → 2 tế bào n NST kép; lần II như nguyên phân → 4 tế bào con, mỗi tế bào n NST đơn. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const MOM=G.hex("#E0605A"),DAD=G.hex("#4F8FE0");
/* 4 NST: 0 dài – mẹ, 1 dài – bố, 2 ngắn – mẹ, 3 ngắn – bố */
const CH=[{L:1.3,c:.38,col:MOM,pair:0},{L:1.3,c:.38,col:DAD,pair:0},{L:.8,c:.5,col:MOM,pair:1},{L:.8,c:.5,col:DAD,pair:1}];
const NP=[{n:"Kì trung gian",d:"NST ở dạng sợi mảnh, duỗi xoắn trong nhân; DNA nhân đôi, mỗi NST trở thành NST kép gồm 2 chromatid."},
  {n:"Kì đầu",d:"NST kép bắt đầu co xoắn, hiện rõ dần; màng nhân dần biến mất; thoi phân bào bắt đầu hình thành."},
  {n:"Kì giữa",d:"NST kép co xoắn cực đại, xếp thành một hàng trên mặt phẳng xích đạo của thoi phân bào."},
  {n:"Kì sau",d:"Hai chromatid trong mỗi NST kép tách nhau ở tâm động, trở thành hai NST đơn và di chuyển về hai cực của tế bào."},
  {n:"Kì cuối",d:"NST đơn dãn xoắn; màng nhân hình thành; tế bào chất phân chia."},
  {n:"Hai tế bào con",d:"Từ 1 tế bào mẹ (2n) tạo ra 2 tế bào con, mỗi tế bào có bộ NST 2n giống hệt tế bào mẹ."}];
const GP=[{n:"Kì trung gian",d:"DNA nhân đôi, mỗi NST trở thành NST kép."},
  {n:"Kì đầu I",d:"NST kép co xoắn; các NST kép tương đồng tiếp hợp theo từng cặp, có thể trao đổi đoạn giữa hai chromatid không chị em (trao đổi chéo)."},
  {n:"Kì giữa I",d:"Các cặp NST kép tương đồng xếp thành hai hàng trên mặt phẳng xích đạo; mỗi cặp xếp độc lập với các cặp khác."},
  {n:"Kì sau I",d:"Mỗi NST kép trong cặp tương đồng di chuyển về một cực của tế bào (tâm động không tách)."},
  {n:"Kì cuối I",d:"Tạo thành 2 tế bào, mỗi tế bào có n NST kép."},
  {n:"Kì giữa II",d:"Trong mỗi tế bào, n NST kép xếp thành một hàng trên mặt phẳng xích đạo."},
  {n:"Kì sau II",d:"Hai chromatid của mỗi NST kép tách nhau ở tâm động, di chuyển về hai cực."},
  {n:"Bốn tế bào con",d:"Từ 1 tế bào (2n) tạo ra 4 tế bào con, mỗi tế bào có n NST đơn; các tế bào con khác nhau về tổ hợp NST."}];

const SPEC={
  predict:[{id:"p1",q:"Sau nguyên phân, mỗi tế bào con có số NST so với tế bào mẹ:",opts:[["bang","Bằng tế bào mẹ (2n)"],["nua","Bằng một nửa (n)"],["gap","Gấp đôi (4n)"]],ans:"bang",res:"Kết quả: mỗi tế bào con có bộ NST 2n giống hệt tế bào mẹ."},
    {id:"p2",q:"Một tế bào 2n giảm phân bình thường tạo ra:",opts:[["4n","4 tế bào, mỗi tế bào n NST"],["2","2 tế bào, mỗi tế bào 2n NST"],["4","4 tế bào, mỗi tế bào 2n NST"]],ans:"4n",res:"Kết quả: giảm phân gồm hai lần phân bào liên tiếp nhưng NST chỉ nhân đôi một lần, tạo 4 tế bào n."}],
  taskLead:"Chọn phần ở khay. Dùng nút kì trước/kì sau hoặc tự chạy; kéo để xoay tế bào.",
  tasks:[{html:"<b>NST:</b> xem cấu trúc NST kép và bộ NST 2n.",done:()=>!!S.seen.nst},
    {html:"<b>Nguyên phân:</b> quan sát đủ các kì tới khi tạo 2 tế bào con.",done:()=>S.np.max>=5},
    {html:"<b>Giảm phân:</b> quan sát đủ các kì tới khi tạo 4 tế bào con.",done:()=>S.gp.max>=7}],
  obs:[{id:"a",q:"Ở kì giữa của nguyên phân, NST:",opts:[["ok","Ở trạng thái kép, co xoắn cực đại, xếp một hàng trên mặt phẳng xích đạo"],["hai","Xếp thành hai hàng"],["don","Ở trạng thái đơn, duỗi xoắn"]],ans:"ok",why:"Kì giữa là lúc NST dễ quan sát nhất."},
    {id:"b",q:"Điểm khác nhau cơ bản ở kì sau I của giảm phân so với kì sau của nguyên phân:",opts:[["ok","Kì sau I: NST kép trong cặp tương đồng phân li; kì sau nguyên phân: hai chromatid tách nhau"],["k","Không có khác biệt"],["ng","Kì sau I: chromatid tách nhau"]],ans:"ok",why:"Vì vậy sau giảm phân I, số NST giảm một nửa."},
    {id:"c",q:"Ở người (2n = 46), mỗi giao tử bình thường có:",opts:[["ok","23 NST"],["46","46 NST"],["92","92 NST"]],ans:"ok",why:"Giao tử có bộ NST đơn bội n = 23."}],
  concl:{html:`<ul class="tlist"><li><b>NST</b> là cấu trúc mang gene, gồm DNA và protein histone. NST kép gồm 2 chromatid chị em đính nhau ở tâm động. Tế bào lưỡng bội có bộ NST 2n gồm các cặp NST tương đồng (một có nguồn gốc từ bố, một từ mẹ). Người: 2n = 46.</li>
    <li><b>Nguyên phân</b>: NST nhân đôi một lần, tế bào phân chia một lần → 2 tế bào con có bộ NST 2n giống tế bào mẹ. Ý nghĩa: sinh trưởng, tái sinh mô, sinh sản vô tính.</li>
    <li><b>Giảm phân</b>: NST nhân đôi một lần, tế bào phân chia hai lần → 4 tế bào con có bộ NST n. Tiếp hợp, trao đổi chéo và sự phân li độc lập của các cặp NST tạo nhiều loại giao tử khác nhau.</li>
    <li>Nguyên phân, giảm phân và thụ tinh duy trì bộ NST đặc trưng của loài qua các thế hệ.</li></ul>`,
    quiz:[{id:"q1",q:"Một tế bào 2n = 8 nguyên phân 3 lần liên tiếp tạo ra bao nhiêu tế bào con?",opts:[["a","8"],["b","6"],["c","24"]],ans:"a",why:{b:"Mỗi lần số tế bào gấp đôi: 2³ = 8.",c:"24 là số tế bào × 3, không đúng."}},
      {id:"q2",q:"Ở ruồi giấm (2n = 8), số NST trong mỗi tế bào ở kì giữa I của giảm phân là:",opts:[["a","8 NST kép"],["b","4 NST kép"],["c","16 NST đơn"]],ans:"a",why:{b:"Ở kì giữa I tế bào chưa phân chia, có 2n = 8 NST kép.",c:"NST đang ở trạng thái kép."}}],
    done:`<h2>Hoàn thành: NST, nguyên phân, giảm phân</h2><p class="muted">Nguyên phân tạo 2 tế bào 2n; giảm phân tạo 4 tế bào n.</p>`},
  gv:["Dừng ở kì giữa, yêu cầu học sinh đếm số NST kép, số chromatid, số tâm động.","So sánh kì giữa nguyên phân với kì giữa I giảm phân (một hàng / hai hàng).","Chỉ ra đoạn NST đổi màu sau trao đổi chéo ở kì đầu I."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 42, 43)</p><ul class="tlist"><li>Nêu được khái niệm, cấu trúc NST; bộ NST lưỡng bội, đơn bội; mô tả được các kì của nguyên phân, giảm phân; nêu được ý nghĩa của nguyên phân, giảm phân.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 42 Nhiễm sắc thể và bộ nhiễm sắc thể; Bài 43 Nguyên phân và giảm phân.</li>
<li>Các kì của nguyên phân, giảm phân; trao đổi chéo: <a href="https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle" target="_blank" rel="noopener">OpenStax Biology 2e, mục 10.2</a> và <a href="https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis" target="_blank" rel="noopener">mục 11.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Tế bào mô hình có 2n = 4 để dễ quan sát. Màu đỏ/xanh chỉ nguồn gốc NST (mẹ/bố). Hình dạng tế bào, thoi phân bào và vân trên NST là hình vẽ mô phỏng; kích thước không theo tỉ lệ thật.</li></ul>`;

let S;
LabKHTN.register("K9-S-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"qt",t:"Quá trình"},{k:"ki",t:"Kì"},{k:"nst",t:"NST trong mỗi tế bào"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D nhiễm sắc thể, nguyên phân và giảm phân",legend:{w:280},
      views:{nst:{t:[-11.5,0,0],yaw:0,pitch:.08,rad:2.4,label:"Nhiễm sắc thể",icon:IC.dna},np:{t:[0,0,0],yaw:0,pitch:.05,rad:5.3,label:"Nguyên phân",icon:IC.cell},gp:{t:[0,0,0],yaw:0,pitch:.05,rad:5.4,label:"Giảm phân",icon:IC.grid}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={seen:{},np:{t:0,max:0,run:false,rec:{}},gp:{t:0,max:0,run:false,rec:{}},recs:0};
    const rec=(qt,ki,nst)=>{S.recs++;api.record({lan:String(S.recs),qt,ki,nst})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const ease=t=>t*t*(3-2*t);
    /* ---------- hình học chromatid ---------- */
    const RAD=.15;
    function chromatidGeo(L,c,side,col,col2,cut){const y0=-c*L,y1=(1-c)*L,N=46,pts=[];
      for(let k=0;k<N;k++){const y=y0+(y1-y0)*k/(N-1);const bow=side*.1*Math.pow(Math.abs(y)/(L*.6),1.5);pts.push([bow,y,0])}
      const rf=t=>{const y=y0+(y1-y0)*t;const d=Math.min(y-y0,y1-y);const e=Math.min(d/RAD,1);let r=RAD*Math.sqrt(Math.max(0,1-(1-e)*(1-e)));r*=1-.45*Math.exp(-(y/.07)*(y/.07));r*=1+.05*Math.sin(y*57);return Math.max(r,.004)};
      const g=G.tube(pts,rf,14);
      G.colorize(g,(x,y,z)=>{const base=(cut!=null&&y>cut)?col2:col;const f=.78+.12*Math.sin(y*21.3+1.3)+.1*Math.sin(y*47.1);return[base[0]*f,base[1]*f,base[2]*f,1]});return g}
    const CMAT={color:"#FFFFFF",rough:.55,coat:.25,sheen:.3};
    /* ---------- tế bào: màng (SDF) ---------- */
    const smin=(a,b,k)=>{const h=C.clamp(.5+.5*(b-a)/k,0,1);return b+(a-b)*h-k*h*(1-h)};
    const NST_=8,cellG=[];for(let i=0;i<=NST_;i++){const s=i/NST_;const d=2.6*ease(s),r=3*(1-s)+2.25*s,k=1.4*(1-s)+.04;
      const rr=r-k*.25*Math.max(0,1-d/k);cellG.push(G.fromSDF((x,y,z)=>smin(Math.hypot(x-d,y,z)-rr,Math.hypot(x+d,y,z)-rr,k),[-5.2,-3.3,-3.3],[5.2,3.3,3.3],[56,36,36]))}
    const memMat=()=>({color:"#B9E3D0",alpha:.16,transparent:true,rough:.85,order:2,depth:false,wrap:.5});
    const cytMat=()=>({type:"unlit",color:"#2D6A5A",alpha:.06,transparent:true,side:"double",order:1,depth:false});
    function mkCell(par){const nodes=cellG.map(g=>{const n=par.add(R.mesh(g,memMat()));n.visible=false;return n});return{nodes,set(s,pos,rotZ,scale,a){const i=Math.round(C.clamp(s,0,1)*NST_);nodes.forEach((n,k)=>{n.visible=k===i&&a>0;n.pos=pos;n.quat=Q.euler(0,0,rotZ);n.scl=[scale,scale,scale];n.mat.alpha=.16*a})},hide(){nodes.forEach(n=>n.visible=false)}}}
    /* ---------- nhân, chất nhiễm sắc ---------- */
    const sph=G.sphere(1,36,24);
    function chromatinGeo(seed){let x=0,y=0,z=0;const pts=[];let rnd=seed;const r=()=>{rnd=(rnd*16807)%2147483647;return rnd/2147483647};
      for(let i=0;i<260;i++){x+=(r()-.5)*.35;y+=(r()-.5)*.35;z+=(r()-.5)*.35;const d=Math.hypot(x,y,z);if(d>.85){x*=.85/d;y*=.85/d;z*=.85/d}pts.push([x,y,z])}
      const g=G.tube(G.spline(pts,2),.022,5);return G.colorize(g,(px,py,pz,i)=>{const t=(px*3.1+py*1.7)%1;return t<0?[.85,.42,.42,1]:[.42,.6,.9,1]})}
    function mkNucleus(par,seed){const env=par.add(R.mesh(sph,{color:"#C7D2FE",alpha:.14,transparent:true,rough:.85,wrap:.5,order:3,depth:false}));const chr=par.add(R.mesh(chromatinGeo(seed),{color:"#FFFFFF",rough:.6,alpha:.95,transparent:true,order:4}));
      const nuc=par.add(R.mesh(G.sphere(.28,20,14),{color:"#7C3AED",alpha:.5,transparent:true,rough:.5,order:4}));
      return{set(pos,sc,a,noChr){for(const n of [env,chr,nuc]){n.visible=a>.01;n.pos=pos;n.scl=[sc,sc,sc]}if(noChr)chr.visible=false;env.mat.alpha=.14*a;chr.mat.alpha=.95*a;nuc.mat.alpha=.5*a;nuc.pos=V3.add(pos,[.3*sc,.25*sc,.1*sc])}}}
    /* ---------- thoi phân bào ---------- */
    const fibG=G.cylinder(.012,1,5,false);
    function mkSpindle(par,n){const f=[];for(let i=0;i<n;i++){const m=par.add(R.mesh(fibG,{type:"unlit",color:"#E2E8F0",alpha:.5,transparent:true,order:5}));m.visible=false;f.push(m)}
      const cs=[];for(let i=0;i<4;i++){const m=par.add(R.mesh(G.sphere(.09,14,10),{color:"#FCD34D",emis:"#7A5A00",rough:.4}));m.visible=false;cs.push(m)}
      let k=0;return{begin(){k=0;f.forEach(m=>m.visible=false);cs.forEach(m=>m.visible=false)},line(a,b,al){if(k>=f.length)return;const m=f[k++];const d=V3.sub(b,a);m.visible=true;m.pos=a;m.quat=Q.toward(d);m.scl=[1,V3.len(d),1];m.mat.alpha=.5*al},pole(i,p){cs[i].visible=true;cs[i].pos=p}}}
    /* ---------- dựng một "sân khấu" phân bào ---------- */
    function stage(ox,kind){const par=root.add(new G.Node());par.pos=[ox,0,0];
      const cells=[mkCell(par),mkCell(par)];const nucs=[0,1,2,3].map(i=>mkNucleus(par,1234+i*77));const sp=mkSpindle(par,30);
      /* 8 chromatid: chromosome i, chị em j; ở giảm phân, chromatid 1 của NST mẹ và chromatid 0 của NST bố trao đổi đoạn */
      const cts=[];for(let i=0;i<4;i++)for(let j=0;j<2;j++){const ch=CH[i];const side=j?1:-1;const g=chromatidGeo(ch.L,ch.c,side,ch.col,ch.col,null);const n=par.add(R.mesh(g,CMAT));
        let alt=null;if(kind==="gp"){const inner=(ch.col===MOM&&j===1)||(ch.col===DAD&&j===0);if(inner){const other=ch.col===MOM?DAD:MOM;alt=par.add(R.mesh(chromatidGeo(ch.L,ch.c,side,ch.col,other,(1-ch.c)*ch.L*.42),CMAT));alt.visible=false}}
        cts.push({i,j,n,alt})}
      return{par,cells,nucs,sp,cts}}
    const NPS=stage(0,"np"),GPS=stage(0,"gp");
    /* ---------- vị trí khung hình (key frame) ---------- */
        const P1=[[-.55,.35,.25],[.45,.5,-.3],[-.25,-.5,.15],[.5,-.35,.3]],A1=[[.5,1,.2],[-.6,1,.3],[1,.2,-.4],[.3,.7,1]];
    const MY=[1.6,-1.55,-.35,.6];   /* vị trí theo chiều dọc ở kì giữa nguyên phân */
    function kfNP(ph,c){const ch=CH[c.i],s=c.j?1:-1;
      if(ph<=1){const p=P1[c.i];const ax=V3.norm(A1[c.i]);const sd=V3.norm(V3.cross(ax,[0,0,1]));return{p:V3.add(p,V3.scale(sd,s*.15)),ax,sd,sc:ph===0?.25:1,v:ph===0?0:1}}
      if(ph===2)return{p:[s*.15,MY[c.i],(c.i%2?.35:-.35)],ax:[0,1,0],sd:[1,0,0],sc:1,v:1};
      if(ph===3)return{p:[s*2.0,MY[c.i]*.42,(c.i%2?.3:-.3)],ax:[-s,.25,0],sd:[0,-s,0],sc:1,v:1};
      return{p:[s*(ph===4?2.45:2.6),MY[c.i]*.3,(c.i%2?.25:-.25)],ax:[-s,.3,0],sd:[0,-s,0],sc:ph===4?.75:.6,v:1}}
    const GY=[1.0,1.0,-1.0,-1.0];
    /* kì giữa I: cặp 1 (NST mẹ bên trái), cặp 2 (NST mẹ bên phải) – phân li độc lập */
    const sideI=i=>{const mom=CH[i].col===MOM;return CH[i].pair===0?(mom?-1:1):(mom?1:-1)};
    function kfGP(ph,c){const ch=CH[c.i],s=c.j?1:-1,h=sideI(c.i);
      if(ph===0){const p=P1[c.i];return{p,ax:[0,1,0],sd:[1,0,0],sc:.25,v:0}}
      if(ph===1){/* tiếp hợp: 4 chromatid của cặp xếp cạnh nhau */const base=ch.pair===0?[-.3,.55,0]:[.35,-.6,.1];const o=ch.col===MOM?-.3:.3;return{p:V3.add(base,[o+s*.15,0,0]),ax:[0,1,0],sd:[1,0,0],sc:1,v:1}}
      if(ph===2)return{p:[h*.45+s*.15,GY[c.i],0],ax:[0,1,0],sd:[1,0,0],sc:1,v:1};
      if(ph===3)return{p:[h*2.0,GY[c.i]*.45+s*.15,(ch.pair?.3:-.3)],ax:[-h,.2,0],sd:[0,1,0],sc:1,v:1};
      if(ph===4)return{p:[h*2.6,GY[c.i]*.45+s*.15,(ch.pair?.25:-.25)],ax:[-h,.2,0],sd:[0,1,0],sc:1,v:1};
      const cx=h*2.6,xx=cx+(ch.pair?.55:-.55);
      if(ph===5)return{p:[xx,s*.15,0],ax:[1,0,0],sd:[0,1,0],sc:1,v:1};
      if(ph===6)return{p:[xx,s*1.35,0],ax:[0,-s,0],sd:[1,0,0],sc:1,v:1};
      return{p:[cx+(ch.pair?.28:-.28),s*1.95,0],ax:[0,-s,.4],sd:[1,0,0],sc:.6,v:1}}
    const quatOf=(ax,sd)=>{const y=V3.norm(ax);let x=V3.sub(sd,V3.scale(y,V3.dot(sd,y)));x=V3.norm(x);const z=V3.cross(x,y);return Q.basis(x,y,z)};
    const nlerp=(a,b,t)=>{const d=a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3];const s=d<0?-1:1;const q=[a[0]*(1-t)+b[0]*t*s,a[1]*(1-t)+b[1]*t*s,a[2]*(1-t)+b[2]*t*s,a[3]*(1-t)+b[3]*t*s];const l=Math.hypot(...q)||1;return q.map(v=>v/l)};
    function placeCts(stg,kf,t,nmax){const a=Math.floor(C.clamp(t,0,nmax)),b=Math.min(nmax,a+1),u=ease(C.clamp(t-a,0,1));
      for(const c of stg.cts){const A=kf(a,c),Bk=kf(b,c);const p=V3.lerp(A.p,Bk.p,u);const q=nlerp(quatOf(A.ax,A.sd),quatOf(Bk.ax,Bk.sd),u);const sc=A.sc+(Bk.sc-A.sc)*u,v=A.v+(Bk.v-A.v)*u;
        const shown=v>.05;const swap=c.alt&&t>=1.5;c.n.visible=shown&&!swap;if(c.alt)c.alt.visible=shown&&swap;for(const n of [c.n,c.alt])if(n){n.pos=p;n.quat=q;n.scl=[.4+.6*sc,sc,.4+.6*sc]}c.cur=p;c.q=q}}
    /* ---------- cập nhật từng quá trình ---------- */
    function upNP(t){const s=NPS;placeCts(s,kfNP,t,5);
      const div=C.clamp(t-3.3,0,1.5)/1.5;s.cells[0].set(div,[0,0,0],0,1,1);s.cells[1].hide();
      const nIn=1-C.clamp(t-.3,0,.7)/.7;s.nucs[0].set([0,0,0],1.25,Math.max(nIn,0));s.nucs[1].set([0,0,0],1,0);
      const nOut=C.clamp(t-3.8,0,1)/1;s.nucs[2].set([-2.6,0,0],.85,nOut,true);s.nucs[3].set([2.6,0,0],.85,nOut,true);
      const sp=s.sp;sp.begin();const sa=C.clamp(t-.8,0,.6)/.6*(1-C.clamp(t-3.9,0,.5)/.5);
      if(sa>0){const pl=[[-2.75,0,0],[2.75,0,0]];sp.pole(0,pl[0]);sp.pole(1,pl[1]);for(const c of s.cts)sp.line(pl[c.j?1:0],c.cur,sa);for(let k=0;k<5;k++){const yy=(k-2)*.45;sp.line(pl[0],[0,yy*1.4,(k%2?.4:-.4)],sa*.6);sp.line(pl[1],[0,yy*1.4,(k%2?.4:-.4)],sa*.6)}}}
    function upGP(t){const s=GPS;placeCts(s,kfGP,t,7);
      const d1=C.clamp(t-2.7,0,1.3)/1.3;   /* phân chia lần I */
      if(t<4.6){s.cells[0].set(d1,[0,0,0],0,1,1);s.cells[1].hide()}
      else{const d2=C.clamp(t-5.7,0,1.3)/1.3;s.cells[0].set(d2,[-2.6,0,0],Math.PI/2,.75,1);s.cells[1].set(d2,[2.6,0,0],Math.PI/2,.75,1)}
      const nIn=1-C.clamp(t-.3,0,.7)/.7;s.nucs[0].set([0,0,0],1.25,Math.max(0,nIn));
      const nEnd=C.clamp(t-6.6,0,.4)/.4;[[-2.6,1.95],[-2.6,-1.95],[2.6,1.95],[2.6,-1.95]].forEach((q,i)=>{if(i>0)s.nucs[i].set([q[0],q[1],0],.75,nEnd,true)});s.nucs[0].set(t>6.6?[-2.6,1.95,0]:[0,0,0],t>6.6?.75:1.25,t>6.6?nEnd:Math.max(0,nIn),t>6.6);
      const sp=s.sp;sp.begin();
      const sI=C.clamp(t-.9,0,.6)/.6*(1-C.clamp(t-3.6,0,.5)/.5);if(sI>0){const pl=[[-2.75,0,0],[2.75,0,0]];sp.pole(0,pl[0]);sp.pole(1,pl[1]);for(const c of s.cts)if(c.j===0)sp.line(pl[sideI(c.i)<0?0:1],c.cur,sI)}
      const sII=C.clamp(t-4.6,0,.5)/.5*(1-C.clamp(t-6.4,0,.4)/.4);if(sII>0){const pl=[[-2.6,1.75,0],[-2.6,-1.75,0],[2.6,1.75,0],[2.6,-1.75,0]];pl.forEach((p,i)=>sp.pole(i,p));for(const c of s.cts){const h=sideI(c.i)<0?0:2;sp.line(pl[h+(c.j?0:1)],c.cur,sII)}}}
    /* ---------- NST phóng to ---------- */
    const NX=-12,nstN=root.add(new G.Node());nstN.pos=[NX,0,0];
    const big=[];for(const j of [0,1]){const n=nstN.add(R.mesh(chromatidGeo(1.3,.38,j?1:-1,MOM,MOM,null),CMAT));n.pos=[(j?1:-1)*.15-.55,-.1,0];n.scl=[1.5,1.5,1.5];big.push(n)}
    /* DNA quấn quanh histone kéo ra từ đầu chromatid */
    const beads=[];for(let k=0;k<7;k++){const b=nstN.add(R.mesh(G.sphere(.075,16,12),{color:"#FBBF24",rough:.5}));b.pos=[.35+k*.2,1.05+Math.sin(k*1.1)*.08,0];beads.push(b)}
    {const pts=[];for(let k=0;k<7;k++){const c=beads[k].pos;for(let a=0;a<=1.7;a+=.1){const ang=a*Math.PI*2;pts.push([c[0]-.06+a*.07,c[1]+Math.cos(ang)*.1,Math.sin(ang)*.1])}}pts.unshift([-.42,1.12,0],[-.1,1.02,0]);nstN.add(R.mesh(G.tube(G.spline(pts,2),.014,6),{color:"#60A5FA",rough:.4}))}
    /* bộ NST 2n = 4 */
    const kar=[];CH.forEach((ch,i)=>{for(const j of [0,1]){const n=nstN.add(R.mesh(chromatidGeo(ch.L,ch.c,j?1:-1,ch.col,ch.col,null),CMAT));n.pos=[.6+i*.42+(j?1:-1)*.11,-.85,0];n.scl=[.75,.75,.75];kar.push(n)}});
    /* ---------- nhãn ---------- */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));const np=p=>V3.add([NX,0,0],p);
    lab("Chromatid",np([-.55-.15-.2,.55,0]),"nst",{dir:"w",len:50});lab("Tâm động",np([-.55,-.1,0]),"nst",{dir:"w",len:70});lab("NST kép (2 chromatid chị em)",np([-.55,1.3,0]),"nst",{dir:"n",len:20});
    lab("DNA quấn quanh protein histone",np([1.0,1.15,0]),"nst",{dir:"n",len:30});lab("Bộ NST 2n = 4: 2 cặp tương đồng",np([1.25,-1.55,0]),"nst",{dir:"s",len:20});
    lab("Màng tế bào",()=>S.np.t<3.8?[2.95,1,0]:[4.55,1.1,0],"np",{dir:"e",len:30});
    const offL=[-99,-99,-99];
    lab("Thoi phân bào",()=>{const t=S.np.t;return t>1.2&&t<3.8?[1.4,1.5,0]:offL},"np",{dir:"ne",len:30});
    lab("Mặt phẳng xích đạo",()=>Math.abs(S.np.t-2)<.35?[0,-2.55,0]:offL,"np",{dir:"s",len:20});
    lab("Màng nhân",()=>S.np.t<.25?[.9,.9,0]:offL,"np",{dir:"ne",len:40});
    lab("Trao đổi chéo",()=>Math.abs(S.gp.t-1)<.4?[-.15,.55+.75,0]:offL,"gp",{dir:"n",len:30});
    lab("Cặp NST kép tương đồng (hai hàng)",()=>Math.abs(S.gp.t-2)<.35?[.65,1.6,0]:offL,"gp",{dir:"ne",len:30});
    /* ---------- vòng cập nhật ---------- */
    K.onFrame(dt=>{const v=K.view;nstN.visible=v==="nst";NPS.par.visible=v==="np";GPS.par.visible=v==="gp";
      for(const [k,P,n] of [["np",S.np,5],["gp",S.gp,7]]){if(P.run){P.t+=dt*.28;const stop=Math.floor(P.t+1e-6);if(P.t>=n){P.t=n;P.run=false}markPh(k)}}
      if(v==="np")upNP(S.np.t);if(v==="gp")upGP(S.gp.t)});
    function markPh(k){const P=S[k],ph=Math.floor(P.t+1e-6);if(ph>P.max){P.max=ph;refresh()}const L=k==="np"?NP:GP;if(Math.abs(P.t-Math.round(P.t))<.02){const r=Math.round(P.t);if(!P.rec[r]&&r>0){P.rec[r]=1;rec(k==="np"?"Nguyên phân":"Giảm phân",L[r].n,nstText(k,r))}}}
    function nstText(k,r){if(k==="np")return["2n = 4 NST đơn → nhân đôi thành 4 NST kép","4 NST kép","4 NST kép","8 NST đơn (đang phân li về hai cực)","mỗi cực 4 NST đơn","2 tế bào, mỗi tế bào 2n = 4 NST đơn"][r];
      return["4 NST kép","4 NST kép, tiếp hợp thành 2 cặp","4 NST kép (2 cặp, hai hàng)","4 NST kép phân li: mỗi cực 2 NST kép","2 tế bào, mỗi tế bào n = 2 NST kép","2 tế bào, mỗi tế bào 2 NST kép","mỗi tế bào: 4 NST đơn đang phân li","4 tế bào, mỗi tế bào n = 2 NST đơn"][r]}
    const og=K.goView;K.goView=function(v,i){og(v,i);if(v==="nst"&&!S.seen.nst){S.seen.nst=1;rec("Nhiễm sắc thể","NST kép","2 chromatid đính ở tâm động; bộ NST 2n = 4 gồm 2 cặp tương đồng");refresh()}};
    K.dockFn(()=>{const v=K.view;if(v==="nst")return[];const P=S[v],n=v==="np"?5:7;
      return[{grid:[{k:"prev",label:"Kì trước",icon:IC.minus,dis:P.t<=0},{k:"next",label:"Kì sau",icon:IC.plus,dis:P.t>=n}]},{k:"run",label:P.run?"Tạm dừng":"Tự chạy",icon:IC.play,on:P.run,dis:P.t>=n},{k:"rst",label:"Làm lại",icon:IC.reset}]});
    K.onDock(k=>{const v=K.view;const P=S[v],n=v==="np"?5:7;
      if(k==="next"){P.run=false;P.t=Math.min(n,Math.floor(P.t+1e-6)+1);markPh(v)}else if(k==="prev"){P.run=false;P.t=Math.max(0,Math.ceil(P.t-1e-6)-1)}
      else if(k==="run"){P.run=!P.run}else if(k==="rst"){P.t=0;P.run=false}refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="nst")return `<div><b>NST kép</b> = 2 chromatid chị em đính nhau ở tâm động</div><div><i style="background:#E0605A"></i>NST có nguồn gốc từ mẹ</div><div><i style="background:#4F8FE0"></i>NST có nguồn gốc từ bố</div><small>Tế bào mô hình 2n = 4. Người 2n = 46, ruồi giấm 2n = 8, đậu Hà Lan 2n = 14.</small>`;
      const P=S[v],L=v==="np"?NP:GP,ph=Math.round(P.t),k=L[C.clamp(ph,0,L.length-1)];
      return `<div><b>${v==="np"?"Nguyên phân":"Giảm phân"} · ${k.n}</b></div><div>${nstText(v,ph)}</div><small>${k.d}</small>`});
    K.timeLabel(()=>{const v=K.view;if(v==="nst")return"Nhiễm sắc thể";const P=S[v],L=v==="np"?NP:GP;return L[Math.round(P.t)].n});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"next",p:[0,-1.9,0],tip:"Chạm để xem kì tiếp theo",view:["np","gp"]}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K.goView("nst");for(let i=0;i<5;i++){K.goView("np");K._dockH("next")}for(let i=0;i<7;i++){K.goView("gp");K._dockH("next")}}};
    return K.mount(st)}
});
})();
