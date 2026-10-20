/* K7-S-04 · Thực hành: chứng minh thân vận chuyển nước và lá thoát hơi nước (SGK KHTN 7 – Kết nối tri thức, Bài 32) · 3D
   1. Cắm cành hoa cúc trắng (có lá) vào cốc nước pha màu đỏ. Theo thời gian, nước màu được vận chuyển theo mạch gỗ của thân lên lá và hoa:
      gân lá, cánh hoa chuyển màu. Cắt ngang thân thấy các chấm màu đỏ – vị trí các bó mạch dẫn nước.
   2. Hai chậu cây cùng loại: chậu A còn nguyên lá, chậu B đã ngắt hết lá; trùm túi nilon trong suốt lên phần thân, lá. Sau vài giờ,
      túi trùm cây A có nhiều hơi nước đọng thành giọt; túi trùm cây B gần như không có → nước thoát ra chủ yếu qua lá. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt,H=G.hex;
const SPEC={
  predict:[{id:"p1",q:"Cắm cành hoa trắng vào nước pha màu đỏ, sau vài giờ cánh hoa sẽ:",opts:[["do","Chuyển dần sang màu đỏ (hồng)"],["trang","Vẫn trắng"],["heo","Héo ngay"]],ans:"do",res:"Kết quả: nước màu được vận chuyển theo thân lên hoa, lá."},
    {id:"p2",q:"Túi nilon trùm cây nào có nhiều hơi nước đọng hơn?",opts:[["la","Cây còn nguyên lá"],["kla","Cây đã ngắt lá"],["nhu","Như nhau"]],ans:"la",res:"Kết quả: nước thoát ra chủ yếu qua lá (qua khí khổng)."}],
  taskLead:"Chọn thí nghiệm ở khay, bấm để thời gian trôi qua rồi quan sát. Ở thí nghiệm 1 có thể cắt ngang thân để xem mạch dẫn.",
  tasks:[{html:"<b>Vận chuyển nước:</b> quan sát hoa, lá sau 4 giờ.",done:()=>S.vc.t>=1},{html:"<b>Cắt ngang thân:</b> xem vị trí mạch dẫn nước.",done:()=>!!S.cut},{html:"<b>Thoát hơi nước:</b> so sánh hai túi nilon sau 3 giờ.",done:()=>S.th.t>=1&&!!S.thRec}],
  obs:[{id:"a",q:"Nước và muối khoáng được vận chuyển từ rễ lên lá nhờ:",opts:[["ok","Mạch gỗ của thân"],["ray","Mạch rây"],["bieu","Lớp biểu bì"]],ans:"ok",why:"Mạch rây vận chuyển chất hữu cơ từ lá đi các nơi."},
    {id:"b",q:"Nước thoát ra khỏi lá chủ yếu qua:",opts:[["ok","Khí khổng"],["gan","Gân lá"],["cuong","Cuống lá"]],ans:"ok",why:"Khí khổng tập trung nhiều ở mặt dưới lá."},
    {id:"c",q:"Vai trò của thoát hơi nước:",opts:[["ok","Tạo lực kéo nước từ rễ lên lá và làm mát lá"],["an","Giúp cây quang hợp vào ban đêm"],["k","Không có vai trò"]],ans:"ok",why:"Đồng thời khí khổng mở giúp CO₂ đi vào lá cho quang hợp."}],
  concl:{html:`<ul class="tlist"><li>Nước và muối khoáng được rễ hút vào, vận chuyển theo <b>mạch gỗ</b> của thân lên lá; chất hữu cơ được vận chuyển theo <b>mạch rây</b>.</li>
    <li>Phần lớn nước được cây hút vào thoát ra ngoài qua lá ở dạng hơi nước (<b>thoát hơi nước</b>), chủ yếu qua khí khổng.</li>
    <li>Thoát hơi nước tạo lực kéo nước từ rễ lên, giúp làm mát lá và tạo điều kiện cho khí CO₂ đi vào lá.</li></ul>`,
    quiz:[{id:"q1",q:"Vì sao khi trồng cây người ta thường tỉa bớt lá?",opts:[["a","Giảm thoát hơi nước để cây không bị héo"],["b","Để cây quang hợp mạnh hơn"],["c","Để rễ hút ít nước"]],ans:"a",why:{b:"Bớt lá làm giảm quang hợp.",c:"Mục đích chính là giảm mất nước khi rễ chưa phát triển."}},
      {id:"q2",q:"Cắt ngang thân cành hoa đã cắm vào nước màu, các chấm màu xuất hiện ở:",opts:[["a","Các bó mạch"],["b","Toàn bộ mặt cắt"],["c","Lớp vỏ ngoài cùng"]],ans:"a",why:{b:"Nước màu chỉ đi theo mạch gỗ.",c:"Lớp vỏ không vận chuyển nước."}}],
    done:`<h2>Hoàn thành: vận chuyển nước và thoát hơi nước</h2><p class="muted">Thân vận chuyển nước theo mạch gỗ; lá thoát hơi nước.</p>`},
  gv:["Chuẩn bị: hoa cúc trắng hoặc cần tây; mực đỏ hoặc phẩm màu thực phẩm; để 4 – 6 giờ hoặc qua đêm.","Hỏi: vì sao chậu B được dùng làm đối chứng?","Liên hệ: tưới nước cho cây vào lúc nắng gắt."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 32)</p><ul class="tlist"><li>Tiến hành được thí nghiệm chứng minh thân vận chuyển nước và lá thoát hơi nước.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 32 Thực hành: Chứng minh thân vận chuyển nước và lá thoát hơi nước.</li>
<li>Vận chuyển nước trong mạch gỗ, thoát hơi nước qua khí khổng: <a href="https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants" target="_blank" rel="noopener">OpenStax Biology 2e, mục 30.5</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thời gian rút ngắn; tốc độ lan màu và lượng hơi nước đọng là minh họa xu hướng. Vị trí bó mạch trên mặt cắt theo kiểu thân cây hai lá mầm (xếp thành vòng).</li></ul>`;


let S;
LabKHTN.register("K7-S-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tn",t:"Thí nghiệm"},{k:"tg",t:"Thời gian"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D vận chuyển nước ở thân và thoát hơi nước ở lá",legend:{w:290},bench:[12,3.2],seed:8,
      views:{vc:{t:[-3,1.02,0],yaw:.2,pitch:.16,rad:.95,label:"Vận chuyển nước",icon:IC.drop},cat:{t:[-1.55,.3,0],yaw:0,pitch:1.15,rad:.3,label:"Mặt cắt thân",icon:IC.lens},th:{t:[2.6,1.05,0],yaw:-.08,pitch:.16,rad:1.2,label:"Thoát hơi nước",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={vc:{t:0,run:false},th:{t:0,run:false},cut:false,thRec:false,recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const ease=t=>t*t*(3-2*t);
    let seed=7;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    /* ---------- tiện ích hình học ---------- */
    function normals(P,I){const N=new Float32Array(P.length);for(let i=0;i<I.length;i+=3){const a=I[i]*3,b=I[i+1]*3,c=I[i+2]*3;const ux=P[b]-P[a],uy=P[b+1]-P[a+1],uz=P[b+2]-P[a+2],vx=P[c]-P[a],vy=P[c+1]-P[a+1],vz=P[c+2]-P[a+2];const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;for(const k of [a,b,c]){N[k]+=nx;N[k+1]+=ny;N[k+2]+=nz}}
      for(let i=0;i<N.length;i+=3){const l=Math.hypot(N[i],N[i+1],N[i+2])||1;N[i]/=l;N[i+1]/=l;N[i+2]/=l}return N}
    /* bề mặt lá / cánh hoa: u dọc gân chính (0 → 1), v ngang (−1 → 1); hình dạng thật lấy từ kênh alpha của kết cấu */
    function surf(L,W,f,NU,NV){NU=NU||24;NV=NV||8;const p=[],uv=[],ix=[];for(let i=0;i<=NU;i++)for(let j=0;j<=NV;j++){const u=i/NU,v=j/NV*2-1;p.push(...f(u,v,L,W));uv.push(u,(v+1)/2)}
      for(let i=0;i<NU;i++)for(let j=0;j<NV;j++){const a=i*(NV+1)+j,b=a+NV+1;ix.push(a,b,a+1,a+1,b,b+1)}const P=new Float32Array(p),I=new Uint16Array(ix);return{pos:P,nrm:normals(P,I),idx:I,col:null,uv:new Float32Array(uv)}}
    const leafShape=(arch,fold)=>(u,v,L,W)=>{const x=u*L;return[x,-arch*x*x/L+Math.abs(v)*fold*W*.5+.02*W*Math.sin(u*9+v*2),v*W*.5]};
    const cutTex=(cv,key,o)=>Object.assign({type:"std",color:"#FFFFFF",rough:.62,sheen:0,side:"double",key,hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 t=texture(uTex,vUV);if(t.a<.5)discard;base.rgb=pow(t.rgb,vec3(2.2));if(!gl_FrontFacing)base.rgb*=vec3(1.15,1.2,1.0);emis+=base.rgb*.22;}"},textures:{uTex:R.tex2D(cv,{mip:true})}},o||{});
    function tagLetter(par,txt,pos){const c=document.createElement("canvas");c.width=128;c.height=128;const g=c.getContext("2d");g.fillStyle="#FFFFFF";g.beginPath();g.arc(64,64,60,0,6.283);g.fill();g.fillStyle="#111827";g.font="900 80px system-ui";g.textAlign="center";g.fillText(txt,64,92);
      const vpl=G.plane(.16,.16);const P=vpl.pos,N=vpl.nrm;for(let i=0;i<P.length;i+=3){const pz=P[i+2];P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}
      const m=par.add(R.mesh(vpl,{type:"unlit",color:"#FFFFFF",key:"tag",hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.5)discard;base.rgb=c.rgb;}"},textures:{uTex:R.tex2D(c)}}));m.pos=pos}
    /* ---------- kết cấu vẽ bằng canvas ---------- */
    const lerpC=(a,b,k)=>a.map((x,i)=>Math.round(x+(b[i]-x)*k));const rgb=a=>`rgb(${a[0]},${a[1]},${a[2]})`;
    /* lá cúc: xẻ thùy lông chim, gân chính và gân bên; k = mức nước màu đã lên tới lá */
    const CLV=document.createElement("canvas");CLV.width=512;CLV.height=256;
    function paintChrysLeaf(k){const g=CLV.getContext("2d");g.clearRect(0,0,512,256);const half=t=>{const env=Math.pow(Math.sin(Math.PI*Math.min(1,t*1.02)),.75)*(1-.3*t);const lob=.55+.45*Math.pow(Math.abs(Math.sin(t*Math.PI*3.5+.3)),.6);return 118*env*lob*(t<.08?t/.08:1)};
      g.beginPath();g.moveTo(0,128);for(let i=0;i<=200;i++){const t=i/200;g.lineTo(t*510,128-half(t))}for(let i=200;i>=0;i--){const t=i/200;g.lineTo(t*510,128+half(t)*.96)}g.closePath();
      const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,"#3F7A2E");gr.addColorStop(.5,"#2F6524");gr.addColorStop(1,"#3B7330");g.fillStyle=gr;g.fill();
      g.save();g.clip();for(let i=0;i<900;i++){g.fillStyle=`rgba(${rnd()<.5?"20,50,15":"120,170,90"},${.05+rnd()*.08})`;g.fillRect(rnd()*512,rnd()*256,2+rnd()*5,2+rnd()*5)}
      const vein=rgb(lerpC([170,205,140],[190,30,70],k));g.strokeStyle=vein;g.lineWidth=4+2*k;g.beginPath();g.moveTo(0,128);g.lineTo(505,128);g.stroke();g.lineWidth=1.8+1.4*k;
      for(let i=0;i<7;i++){const t=(i+.6)/7.4;const x=t*505;for(const s of [-1,1]){g.beginPath();g.moveTo(x,128);g.quadraticCurveTo(x+22,128+s*half(t+.05)*.5,x+36,128+s*half(t+.07)*.95);g.stroke()}}
      g.globalAlpha=.07*k;g.fillStyle="#BE123C";g.fillRect(0,0,512,256);g.globalAlpha=1;g.restore()}
    /* cánh hoa cúc trắng: dài, đầu tròn có khía nhỏ, gân dọc mảnh */
    const CPT=document.createElement("canvas");CPT.width=96;CPT.height=512;
    function paintPetal(k){const g=CPT.getContext("2d");g.clearRect(0,0,96,512);g.beginPath();g.moveTo(48,512);g.bezierCurveTo(20,470,6,300,10,90);g.quadraticCurveTo(14,20,36,8);g.lineTo(48,22);g.lineTo(60,8);g.quadraticCurveTo(82,20,86,90);g.bezierCurveTo(90,300,76,470,48,512);g.closePath();
      const gr=g.createLinearGradient(0,512,0,0);gr.addColorStop(0,rgb(lerpC([236,240,214],[244,140,170],k*.7)));gr.addColorStop(.25,rgb(lerpC([252,252,248],[250,214,226],k)));gr.addColorStop(1,rgb(lerpC([255,255,255],[236,72,120],k*.95)));g.fillStyle=gr;g.fill();
      g.save();g.clip();g.strokeStyle=k>.02?`rgba(190,24,72,${.25+.5*k})`:"rgba(200,200,190,.35)";g.lineWidth=1.3;for(let i=0;i<7;i++){const x=22+i*8.6;g.beginPath();g.moveTo(48+(x-48)*.25,505);g.quadraticCurveTo(x,260,x+(x-48)*.1,30);g.stroke()}g.restore()}
    /* lá cây đậu (thí nghiệm thoát hơi nước): hình trứng, mép răng cưa nhỏ */
    const BLV=document.createElement("canvas");BLV.width=512;BLV.height=320;
    {const g=BLV.getContext("2d");const half=t=>Math.pow(Math.sin(Math.PI*Math.pow(t,.8)),.9)*(1-.15*t)*150*(t<.04?t/.04:1)+(t>.05&&t<.95?2.5*Math.sin(t*120):0);
      g.beginPath();g.moveTo(0,160);for(let i=0;i<=240;i++){const t=i/240;g.lineTo(t*508,160-half(t))}for(let i=240;i>=0;i--){const t=i/240;g.lineTo(t*508,160+half(t))}g.closePath();
      const gr=g.createRadialGradient(200,150,20,250,160,280);gr.addColorStop(0,"#5FA83A");gr.addColorStop(1,"#2E6B22");g.fillStyle=gr;g.fill();g.save();g.clip();
      for(let i=0;i<1400;i++){g.fillStyle=`rgba(${rnd()<.5?"25,60,20":"150,200,110"},${.04+rnd()*.07})`;g.fillRect(rnd()*512,rnd()*320,2+rnd()*4,2+rnd()*4)}
      g.strokeStyle="#A7D686";g.lineWidth=5;g.beginPath();g.moveTo(0,160);g.lineTo(500,160);g.stroke();g.lineWidth=2.2;
      for(let i=0;i<7;i++){const x=40+i*62;for(const s of [-1,1]){g.beginPath();g.moveTo(x,160);g.quadraticCurveTo(x+40,160+s*60,x+70,160+s*half((x+70)/508)*.92);g.stroke()}}
      g.strokeStyle="rgba(167,214,134,.45)";g.lineWidth=1;for(let i=0;i<160;i++){const x=rnd()*500,y=160+(rnd()-.5)*260;g.beginPath();g.moveTo(x,y);g.lineTo(x+(rnd()-.5)*30,y+(rnd()-.5)*30);g.stroke()}g.restore()}
    /* ================= 1. CÀNH HOA CÚC TRẮNG TRONG NƯỚC MÀU ================= */
    const VX=-3;const vc=root.add(new G.Node());vc.pos=[VX,0,0];
    vc.add(K3.glass(R,.2,.6,{lip:.012,th:.012}));const dye=vc.add(K3.liquid(R,.188,.016,.42,H("#B91C1C"),.82));
    /* thân: hơi cong, thuôn dần; vệt đỏ chạy dọc theo các bó mạch khi nước màu đi lên */
    const sp=[[0,.03,.01],[.006,.4,0],[-.004,.8,-.01],[.012,1.2,.004],[.03,1.52,.02],[.05,1.7,.05]];const stemPts=G.spline(sp,10);const TOP=stemPts[stemPts.length-1];
    const stemM={type:"std",color:"#FFFFFF",rough:.55,sheen:.3,key:"chrStem",hooks:{fu:"uniform float uFront,uK;",fs:`{float ang=atan(vO.z,vO.x);float y=vW.y;vec3 g=mix(vec3(.24,.42,.14),vec3(.42,.6,.24),smoothstep(.0,1.7,y));
        float rib=.5+.5*sin(ang*16.);g*=.9+.12*rib;float streak=smoothstep(.55,.92,sin(ang*7.+1.3));float wet=1.-smoothstep(uFront-.06,uFront+.02,y);
        vec3 red=vec3(.52,.07,.12);g=mix(g,mix(g,red,.9),streak*wet*uK);g=mix(g,red*.9,wet*uK*.18);if(y<.43)g=mix(g,vec3(.35,.08,.08),.35);base.rgb=g;}`},uniforms:{uFront:0,uK:0}};
    const stem=vc.add(R.mesh(G.tube(stemPts,t=>.022-.006*t,14),stemM));
    vc.add(R.mesh(G.disk(.022,0,14,false),{color:"#C7D9A6",rough:.8})).pos=[0,.03,.01];
    /* lá cúc: cuống ngắn, xếp xen kẽ */
    paintChrysLeaf(0);const leafM=cutTex(CLV,"chrLeaf");const LT=leafM.textures.uTex;
    const leafG=surf(.34,.2,leafShape(.25,.22),26,10);const LEAVES=[];
    [[.55,.3],[.68,2.6],[.8,4.4],[.92,1.2],[1.05,3.4],[1.18,5.5]].forEach(([y,a],i)=>{const n=vc.add(new G.Node());const pidx=Math.round(y/1.7*(stemPts.length-1));n.pos=stemPts[pidx];
      n.quat=Q.mul(Q.mul(Q.euler(0,a,0),Q.euler(0,0,.5-i*.04)),Q.euler(-.75,0,0));const pet=n.add(R.mesh(G.tube([[0,0,0],[.05,.012,0]],.006,6),{color:"#4D7C2C",rough:.6}));const lf=n.add(R.mesh(leafG,leafM));lf.pos=[.045,.012,0];lf.scl=[1-i*.06,1,1-i*.05];LEAVES.push(n)});
    /* cụm hoa cúc: nhiều vòng cánh trắng quanh nhụy vàng */
    paintPetal(0);const petM=cutTex(CPT,"chrPetal",{rough:.7,sheen:.3});const PT=petM.textures.uTex;
    const head=vc.add(new G.Node());head.pos=TOP;head.quat=Q.euler(.55,0,-.12);
    head.add(R.mesh(G.lathe([[0,-.035],[.03,-.03],[.052,-.012],[.058,0],[0,0]],28),{color:"#4F7A2E",rough:.7}));
    const petG=surf(1,1,(u,v)=>{const x=u;return[x,.18*x*x-.32*Math.pow(Math.max(0,x-.55),2)+Math.abs(v)*.06,v*.5]},16,4);
    const RINGS=[[30,.17,.08,0],[30,.16,.3,.1],[28,.135,.62,.05],[24,.1,.98,.13]];
    RINGS.forEach(([n,len,elev,off],ri)=>{for(let i=0;i<n;i++){const m=head.add(R.mesh(petG,petM));const a=(i+off*n)/n*6.283+ri*.37;m.pos=[Math.cos(a)*.045*(1-ri*.18),.004+ri*.006,-Math.sin(a)*.045*(1-ri*.18)];
      m.quat=Q.mul(Q.euler(0,a,0),Q.euler(0,0,elev+(rnd()-.5)*.12));const w=.024+rnd()*.006;m.scl=[len*(.92+rnd()*.16),len,w]}});
    const flor=R.instanced(G.sphere(1,8,6),{color:"#FFFFFF",rough:.75,key:"floret"},220);head.add(flor);{const D=flor.data;const N=220;for(let i=0;i<N;i++){const r=.046*Math.sqrt((i+.5)/N),a=i*2.39996;const h=.012*(1-r*r/(.046*.046));const c=r<.02?[.86,.62,.08]:[.98,.8,.18];D.set([Math.cos(a)*r,.008+h,Math.sin(a)*r,.0042+.0015*(r/.046),c[0],c[1],c[2],1],i*8)}flor.setInstances(N)}
    /* ================= 2. MẶT CẮT NGANG THÂN (phóng to) ================= */
    const CX=-1.55;const cs=root.add(new G.Node());cs.pos=[CX,0,0];
    cs.add(R.mesh(G.box(.62,.03,.46,.01,2),{color:"#F5F5F4",rough:.35,coat:.4})).pos=[0,.015,0];
    const piece=cs.add(new G.Node());piece.pos=[0,.03,0];piece.add(R.mesh(G.cylinder(.16,.18,48,false),{type:"std",color:"#FFFFFF",rough:.55,key:"pieceSide",hooks:{fs:"{float ang=atan(vO.z,vO.x);base.rgb=mix(vec3(.25,.43,.15),vec3(.36,.55,.22),.5+.5*sin(ang*16.));}"}}));
    const CCV=document.createElement("canvas");CCV.width=1024;CCV.height=1024;const CT=R.tex2D(CCV,{mip:true});
    const cells=(()=>{const L=[];const add=(r0,r1,sz,kind)=>{const n=Math.round(Math.PI*(r1*r1-r0*r0)/(sz*sz*1.6));for(let i=0;i<n;i++){const r=Math.sqrt(r0*r0+rnd()*(r1*r1-r0*r0)),a=rnd()*6.283;L.push([512+Math.cos(a)*r,512+Math.sin(a)*r,sz*(.75+rnd()*.5),kind])}};
      add(0,262,24,"pith");add(372,478,13,"cortex");add(478,494,7,"coll");return L})();
    const NB=18;const BUN=[];for(let i=0;i<NB;i++){const a=i/NB*6.283+(rnd()-.5)*.06;const vs=[];for(let j=0;j<6;j++)vs.push([268+rnd()*44,(rnd()-.5)*.11,5+rnd()*5]);const ph=[];for(let j=0;j<22;j++)ph.push([322+rnd()*20,(rnd()-.5)*.13,2+rnd()*2.5]);BUN.push({a,vs,ph,w:.1+rnd()*.03})}
    function paintCut(k){const g=CCV.getContext("2d");g.clearRect(0,0,1024,1024);
      g.fillStyle="#2C5E1C";g.beginPath();g.arc(512,512,505,0,6.283);g.fill();g.fillStyle="#9CC66E";g.beginPath();g.arc(512,512,494,0,6.283);g.fill();
      g.fillStyle="#C9E2A2";g.beginPath();g.arc(512,512,372,0,6.283);g.fill();g.fillStyle="#EEF4DD";g.beginPath();g.arc(512,512,262,0,6.283);g.fill();
      for(const [x,y,s,kd] of cells){g.beginPath();g.arc(x,y,s,0,6.283);g.fillStyle=kd==="pith"?"#F4F8E8":kd==="cortex"?"#B7D98A":"#7FB052";g.fill();g.strokeStyle=kd==="pith"?"#CFDDB0":kd==="cortex"?"#8EB861":"#4E8A2E";g.lineWidth=kd==="pith"?2:1.4;g.stroke();
        if(kd!=="pith"&&rnd()<.6){g.fillStyle="rgba(60,120,30,.55)";for(let q=0;q<3;q++){g.beginPath();g.arc(x+(rnd()-.5)*s,y+(rnd()-.5)*s,1.6,0,6.283);g.fill()}}}
      /* vùng giữa các bó: tầng sinh mạch mảnh */
      g.strokeStyle="rgba(120,150,70,.6)";g.lineWidth=3;g.beginPath();g.arc(512,512,312,0,6.283);g.stroke();
      const wall=rgb(lerpC([120,150,70],[150,10,40],k)),lum=rgb(lerpC([246,250,236],[225,29,72],k*.85));
      for(const b of BUN){const ca=Math.cos(b.a),sa=Math.sin(b.a);const P=(r,da)=>[512+Math.cos(b.a+da)*r,512+Math.sin(b.a+da)*r];
        /* mũ sợi (cương mô) phía ngoài */
        g.save();g.translate(...P(352,0));g.rotate(b.a);g.fillStyle="#E9F1D2";g.beginPath();g.ellipse(0,0,15,34,0,0,6.283);g.fill();g.strokeStyle="#C3D39C";g.lineWidth=1;for(let q=0;q<26;q++){g.beginPath();g.arc((rnd()-.5)*22,(rnd()-.5)*52,2.5,0,6.283);g.stroke()}g.restore();
        /* mạch rây */
        g.save();g.translate(...P(327,0));g.rotate(b.a);g.fillStyle="#D7E8B4";g.beginPath();g.ellipse(0,0,14,30,0,0,6.283);g.fill();g.restore();
        for(const [r,da,s] of b.ph){const [x,y]=P(r,da);g.beginPath();g.arc(x,y,s,0,6.283);g.strokeStyle="#9DBD70";g.lineWidth=.8;g.stroke()}
        /* mạch gỗ: mạch to xếp thành dãy hướng vào tâm */
        g.save();g.translate(...P(290,0));g.rotate(b.a);g.fillStyle=k>.02?rgb(lerpC([214,228,180],[236,120,150],k)):"#D6E4B4";g.beginPath();g.ellipse(0,0,26,36,0,0,6.283);g.fill();g.restore();
        for(const [r,da,s] of b.vs){const [x,y]=P(r,da);g.beginPath();g.arc(x,y,s,0,6.283);g.fillStyle=lum;g.fill();g.strokeStyle=wall;g.lineWidth=2.6;g.stroke()}}
      g.fillStyle="rgba(255,255,255,.06)";g.beginPath();g.ellipse(430,400,300,200,-.6,0,6.283);g.fill();CT.update(CCV)}
    paintCut(0);
    const face=piece.add(R.mesh(G.plane(.32,.32),{type:"unlit",color:"#FFFFFF",key:"cutFace",hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.5)discard;base.rgb=c.rgb;}"},textures:{uTex:CT}}));face.pos=[0,.1805,0];
    const capTop=piece.add(R.mesh(G.disk(.16,.18,48,true),{color:"#3B6B22",rough:.6}));
    const knife=root.add(new G.Node());knife.add(R.mesh(G.box(.4,.006,.07,.002,2),{color:"#D1D5DB",metal:.95,rough:.15})).pos=[.2,0,0];knife.add(R.mesh(G.box(.2,.03,.045,.01,2),{color:"#7C2D12",rough:.6})).pos=[-.1,0,0];knife.pos=[CX+.05,.26,.12];knife.quat=Q.euler(0,.5,0);
    /* ================= 3. THOÁT HƠI NƯỚC ================= */
    const TX=2.6;const BLM=cutTex(BLV,"beanLeaf");const bleaf=surf(.3,.19,leafShape(.35,.28),22,10);const PL=[];
    for(const [x,leafy] of [[TX-.62,true],[TX+.62,false]]){const n=root.add(new G.Node());n.pos=[x,0,0];
      n.add(R.mesh(G.lathe([[0,0],[.2,0],[.215,.02],[.25,.36],[.285,.37],[.29,.43],[.27,.44],[.26,.42],[0,.42]],44),{color:"#B5552B",rough:.8,sheen:.15}));
      n.add(R.mesh(G.disk(.255,.405,40,true),{type:"std",color:"#FFFFFF",rough:.95,key:"soil",hooks:{fu:K3.NOISE,fs:"{float q=vn(vW*90.)*.6+vn(vW*230.)*.4;base.rgb=mix(vec3(.17,.11,.07),vec3(.32,.22,.14),q);}"}}));
      const sp=[[0,.405,0],[.01,.7,0],[-.008,1.05,.01],[.006,1.38,0],[0,1.52,0]];const spts=G.spline(sp,8);n.add(R.mesh(G.tube(spts,t=>.024-.012*t,10),{color:"#4F7F2A",rough:.6,sheen:.2}));
      for(let i=0;i<8;i++){const t=.18+i*.1;const p=spts[Math.round(t*(spts.length-1))];const a=i*2.4;const h=new G.Node();n.add(h);h.pos=p;h.quat=Q.mul(Q.mul(Q.euler(0,a,0),Q.euler(0,0,.7-i*.05)),Q.euler(-.55,0,0));
        if(leafy){h.add(R.mesh(G.tube(G.spline([[0,0,0],[.06,.03,0],[.11,.035,0]],4),.006,6),{color:"#5C8F33",rough:.6}));const lf=h.add(R.mesh(bleaf,BLM));lf.pos=[.105,.035,0];lf.quat=Q.euler(0,0,-.25);const s=1-i*.05;lf.scl=[s,s,s]}
        else{h.add(R.mesh(G.tube([[0,0,0],[.03,.012,0]],.006,6),{color:"#5C8F33",rough:.6}));h.add(R.mesh(G.disk(.006,0,8,true),{color:"#A3B86C"})).pos=[.03,.012,0]}}
      /* túi nilon: nhăn, buộc ở gốc thân bằng dây */
      const BP=[];for(let i=0;i<=28;i++){const y=.47+i/28*1.33;let r;if(y<.56)r=.03+(y-.47)/.09*.12;else if(y<.8)r=.15+(y-.56)/.24*.27;else if(y<1.55)r=.42+.03*Math.sin((y-.8)*3);else r=.42*Math.sqrt(Math.max(0,1-Math.pow((y-1.55)/.26,2)));BP.push([Math.max(.002,r),y])}
      const wr=(v)=>{const ang=Math.atan2(v[2],v[0]),y=v[1];const rr=Math.hypot(v[0],v[2]);if(rr<.01)return v;const w=1+.05*Math.sin(ang*5+y*4)*Math.sin(y*7+x)+.03*Math.sin(ang*11+y*13)+.02*Math.sin(ang*3-y*9)*(y>.6?1:0);return[v[0]*w,y+(.01*Math.sin(ang*7)),v[2]*w]};
      const bagG0=G.lathe(BP,56);const P0=new Float32Array(bagG0.pos);for(let i=0;i<P0.length;i+=3){const q=wr([P0[i],P0[i+1],P0[i+2]]);P0[i]=q[0];P0[i+1]=q[1];P0[i+2]=q[2]}const bagG={pos:P0,nrm:normals(P0,bagG0.idx),idx:bagG0.idx,uv:bagG0.uv,col:null};
      const bag=n.add(R.mesh(bagG,{type:"glass",color:"#F8FAFC",alpha:.07,side:"double"}));
      const fog=n.add(R.mesh(bagG,{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,side:"double",order:6,key:"bagfog"+(leafy?"a":"b"),hooks:{fu:K3.NOISE+"uniform float uA;",fs:"{float q=vn(vO*26.)*.6+vn(vO*70.)*.4;float lo=1.-smoothstep(.6,1.7,vO.y)*.55;base.rgb=vec3(.93,.96,.98);base.a=uA*lo*(.45+.55*q);}"},uniforms:{uA:0}}));fog.scl=[.992,1,.992];
      n.add(R.mesh(G.tube(Array.from({length:21},(_,j)=>[Math.cos(j/20*6.283)*.036,.5+.004*Math.sin(j*1.7),Math.sin(j/20*6.283)*.036]),.006,6),{color:"#DC2626",rough:.5})).pos=[0,0,0];
      n.add(R.mesh(G.tube([[.03,.5,.02],[.08,.47,.06],[.1,.44,.05]],.005,5),{color:"#DC2626",rough:.5}));
      const drops=n.add(R.instanced(G.sphere(1,10,8),{color:"#F0F9FF",alpha:.8,transparent:true,rough:.03,coat:1,key:"bagdrop"},380));
      const DP=[];for(let i=0;i<380;i++){const t=Math.pow(rnd(),1.4);const y=.6+t*1.15;let r=0;for(let j=0;j<BP.length-1;j++)if(BP[j][1]<=y&&BP[j+1][1]>y){const f=(y-BP[j][1])/(BP[j+1][1]-BP[j][1]);r=BP[j][0]+(BP[j+1][0]-BP[j][0])*f}
        const a=rnd()*6.283;const q=wr([Math.cos(a)*r,y,Math.sin(a)*r]);const inw=.985;DP.push({p:[q[0]*inw,q[1],q[2]*inw],s:(.006+rnd()*.014)*(1.3-t*.6),th:rnd()})}
      const pool=n.add(K3.liquid(R,.05,.47,.5,H("#E0F2FE"),.0));pool.mat.alpha=0;
      tagLetter(n,leafy?"A":"B",[0,.2,.255]);PL.push({n,fog,drops,DP,leafy,pool})}
    /* ---------- vòng lặp ---------- */
    let tk=0,lastK=-1,lastF=-1;
    K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}const v=K.view;
      for(const k of ["vc","th"]){const P=S[k];if(P.run){P.t=Math.min(1,P.t+dt/5);if(P.t>=1){P.run=false;rec1(k);refresh()}}}
      const kv=ease(S.vc.t);const front=.43+kv*1.4;stem.mat.uniforms.uFront=front;stem.mat.uniforms.uK=Math.min(1,kv*3);
      const kl=C.clamp((front-.95)/.6,0,1);if(Math.abs(kl-lastK)>.03){lastK=kl;paintChrysLeaf(kl);LT.update(CLV)}
      const kf=C.clamp((front-1.62)/.2,0,1);if(Math.abs(kf-lastF)>.03){lastF=kf;paintPetal(kf);PT.update(CPT)}
      dye.scl=[1,1-.1*kv,1];
      knife.visible=!S.cut;capTop.visible=!S.cut;face.visible=S.cut;
      const kt=ease(S.th.t);for(const p of PL){const amt=p.leafy?kt:kt*.05;p.fog.mat.uniforms.uA=.3*amt;const D=p.drops.data;let n=0;for(const d of p.DP){if(d.th<amt){D.set([d.p[0],d.p[1],d.p[2],d.s*Math.min(1,(amt-d.th)*5+.35),1,1,1,1],n*8);n++}}p.drops.setInstances(n);p.pool.mat.alpha=p.leafy?.6*C.clamp((kt-.6)/.4,0,1):0}});
    function rec1(k){if(k==="vc")api.record({tn:"Cành hoa cúc trắng cắm vào nước pha màu đỏ",tg:"4 giờ",kq:"thân có vệt đỏ dọc, gân lá ửng đỏ, cánh hoa chuyển hồng; mực nước trong cốc giảm"});
      else{S.thRec=true;api.record({tn:"Trùm túi nilon: A còn lá, B đã ngắt lá",tg:"3 giờ",kq:"túi A mờ hơi nước, nhiều giọt nước đọng; túi B gần như không có"})}}
    K.dockFn(()=>{const v=K.view;if(v==="vc"){const P=S.vc;return[{k:"run",v:"vc",label:P.t>=1?"Đã để 4 giờ":"Để 4 giờ",icon:IC.play,dis:P.run||P.t>=1},{k:"rs",v:"vc",label:"Làm lại",icon:IC.reset}]}
      if(v==="cat")return[{k:"cut",label:S.cut?"Đã cắt":"Cắt ngang thân",icon:IC.lens,dis:S.cut}];
      const P=S.th;return[{k:"run",v:"th",label:P.t>=1?"Đã để 3 giờ":"Để 3 giờ (ngoài nắng)",icon:IC.sun,dis:P.run||P.t>=1},{k:"rs",v:"th",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{if(k==="run")S[v].run=true;else if(k==="rs")S[v]={t:0,run:false};else if(k==="cut"){S.cut=true;paintCut(C.clamp((ease(S.vc.t)-.15)/.4,0,1));api.record({tn:"Cắt ngang thân cành hoa",tg:S.vc.t>=1?"sau 4 giờ":"trước khi cắm vào nước màu",kq:S.vc.t>=1?"các chấm đỏ xếp thành vòng ở vị trí mạch gỗ của các bó mạch":"chưa thấy chấm màu đỏ"})}refresh()});
    K.label("Nước pha màu đỏ",[VX+.19,.25,.08],{view:"vc",dir:"e",len:46});const qrot=(q,v)=>{const t=V3.scale(V3.cross([q[0],q[1],q[2]],v),2);return V3.add(V3.add(v,V3.scale(t,q[3])),V3.cross([q[0],q[1],q[2]],t))};K.label("Lá (gân lá)",()=>{const n=LEAVES[4];return V3.add([VX,0,0],V3.add(n.pos,qrot(n.quat,[.2,.02,0])))},{view:"vc",dir:"e",len:40});
    K.label("Cánh hoa",()=>[VX+TOP[0]+.12,TOP[1]+.06,TOP[2]],{view:"vc",dir:"ne",len:30});K.label("Thân",[VX+.02,.62,.02],{view:"vc",dir:"w",len:50});
    K.label("Mạch gỗ (chấm đỏ)",()=>S.cut?[CX+Math.cos(.35)*.09,.215,Math.sin(.35)*.09]:[-99,-99,-99],{view:"cat",dir:"ne",len:34});K.label("Ruột thân",()=>S.cut?[CX-.02,.215,.01]:[-99,-99,-99],{view:"cat",dir:"sw",len:40});
    K.label("Biểu bì và vỏ",()=>S.cut?[CX-.148,.215,-.04]:[-99,-99,-99],{view:"cat",dir:"nw",len:30});
    K.label("Túi nilon trong suốt",[TX-.62+.36,1.5,.2],{view:"th",dir:"ne",len:24});K.label("Hơi nước đọng thành giọt",()=>S.th.t>.4?[TX-.62-.38,.95,.2]:[-99,-99,-99],{view:"th",dir:"w",len:30});K.label("Dây buộc ở gốc",[TX+.62+.04,.5,.04],{view:"th",dir:"e",len:34});
    K.infoFn(()=>{const v=K.view;if(v==="vc"){const P=S.vc;return `<div><b>Thân vận chuyển nước</b> · ${fmt(P.t*4,1)} giờ</div><small>${P.t>=1?"Thân có vệt đỏ dọc, gân lá ửng đỏ, cánh hoa chuyển hồng: nước màu đi theo mạch gỗ.":P.t>0?"Nước màu đang theo thân đi lên…":"Cành hoa cúc trắng cắm trong nước pha mực đỏ."}</small>`}
      if(v==="cat")return `<div><b>Mặt cắt ngang thân</b> (phóng to)</div><small>${S.cut?(S.vc.t>=1?"Các chấm đỏ xếp thành vòng: đó là mạch gỗ trong các bó mạch dẫn nước.":"Chưa cắm vào nước màu nên mạch gỗ chưa có màu."):"Bấm “Cắt ngang thân”."}</small>`;
      const P=S.th;return `<div><b>Lá thoát hơi nước</b> · ${fmt(P.t*3,1)} giờ</div><small>Chậu A còn lá · chậu B đã ngắt lá. ${P.t>=1?"Túi A mờ hơi nước, nhiều giọt đọng; túi B gần như không.":""}</small>`});
    K.timeLabel(()=>{const v=K.view;return v==="th"?`${fmt(S.th.t*3,1)} giờ`:`${fmt(S.vc.t*4,1)} giờ`});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"run",v:"vc",p:[VX+.02,.62,.02],tip:"Chạm để bắt đầu, để 4 giờ",view:"vc"},{k:"cut",p:[CX,.23,0],tip:"Chạm để cắt ngang thân",view:"cat"},{k:"run",v:"th",p:[TX-.26,1.45,.2],tip:"Chạm để đặt cây ra nắng 3 giờ",view:"th"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.vc.t=1;rec1("vc");K.goView("cat");K._dockH("cut");S.th.t=1;rec1("th")}};
    return K.mount(st)}
});
})();
