/* K8-L-03 · Lực đẩy Archimedes (SGK KHTN 8 – Kết nối tri thức, Bài 17) · bản 3D
   Dụng cụ theo SGK: lực kế GHĐ 2 N, quả nặng 130 g, bình tràn, cốc 200 mL, giá thí nghiệm; đo ở các mức 20, 40, 60, 80 cm³ trong nước và nước muối.
   Động lực học lực kế (m·a = P − F_A − k·x − c·v), mực nước và lượng tràn tính trong LabMech; cảnh 3D (LabGL) dựng đúng kích thước thật (cm). */
(function(){
"use strict";
const C=window.LabCore,M=window.LabMech,U=M.U,G=window.LabGL,K3=window.LabChem3D;
const fmt=C.fmt,H=G.hex;
const SCALE_BODY_CM=M.SCALE.bodyH/U;

const MASS=0.130,P_W=1.3;                 /* kg, N (SGK lấy trọng lượng P = 10·m) */
const VOBJ=80,HOBJ=7.857,AOBJ=VOBJ/HOBJ;   /* cm³, cm, cm² (khối trụ đường kính 3,6 cm) */
const RCAN=4,ACAN=Math.PI*RCAN*RCAN,HSP=10,HCAN=12;   /* bình tràn: bán kính trong 4 cm, vòi ở độ cao 10 cm */
const RCUP=3,ACUP=Math.PI*RCUP*RCUP,HCUP=9;            /* cốc hứng 200 mL */
const KSPR=24;                            /* N/m: 2 N ứng với 8,33 cm */
const LIQ={
  nuoc:{ten:"Nước",d:10000,col:"rgba(110,170,255,.34)",top:"rgba(190,220,255,.7)",z:"rgba(110,170,255,.55)"},
  muoi:{ten:"Nước muối",d:11000,col:"rgba(160,205,240,.42)",top:"rgba(225,240,255,.75)",z:"rgba(150,200,240,.6)"},
  dau:{ten:"Dầu",d:8000,col:"rgba(240,190,60,.42)",top:"rgba(255,225,140,.75)",z:"rgba(240,190,60,.6)"}
};
const LEVELS=[0,20,40,60,80];
const X={rod:300,arm:470,can:470,cup:650,canBot:550,bench:556};
const ARM_MIN=30,ARM_MAX=216;

const GV=`<p><b>Mục tiêu</b> (trích kế hoạch bài dạy Bài 17)</p>
<ul class="tlist"><li>Nêu được hiện tượng chứng tỏ sự tồn tại của lực đẩy Archimedes và chỉ rõ đặc điểm của lực này.</li><li>Thực hiện thí nghiệm khảo sát tác dụng của chất lỏng lên vật đặt trong chất lỏng.</li><li>Phát biểu được định luật Archimedes.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức (15–20 phút)</b></p>
<ul class="tlist"><li>Cho cả lớp dự đoán số chỉ lực kế ở mức 80 cm³ trước khi hạ vật.</li><li>Chọn 0,25× lúc vật chạm mặt nước: kim lực kế dao động, nước bắt đầu tràn qua vòi.</li><li>Nhóm khá: thử hạ sâu thêm khi vật đã chìm hoàn toàn để thấy lực đẩy không đổi theo độ sâu.</li><li>Đổi sang nước muối hoặc dầu để thấy lực đẩy phụ thuộc trọng lượng riêng của chất lỏng.</li></ul>
<p style="margin-top:10px"><b>Lỗi học sinh hay gặp</b></p>
<ul class="tlist"><li>Nghĩ lực đẩy phụ thuộc khối lượng của vật hoặc độ sâu.</li><li>Đọc số khi kim còn dao động.</li><li>Không làm đầy bình tràn tới vòi trước khi đo nên lượng nước tràn ít hơn thể tích vật chiếm chỗ.</li></ul>`;

const SRC=`<ul class="tlist">
<li>Dụng cụ (lực kế GHĐ 2 N, cốc 200 mL, quả nặng 130 g, bình tràn), các mức 20, 40, 60, 80 cm³ với nước và nước muối, kết luận, công thức F<sub>A</sub> = d·V, ví dụ 2 N – 1,6 N = 0,4 N: SGK KHTN 8 KNTT Bài 17, đối chiếu qua <a href="https://minio.ftech.ai/fs-landing/KHTN_8_Ket_noi_Bai_17_12888a1c87.pdf" target="_blank" rel="noopener">tài liệu Bài 17</a>.</li>
<li>Trọng lượng riêng của nước 10 000 N/m³ (SGK).</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p>
<ul class="tlist"><li>Quả nặng là khối trụ đường kính 3,6 cm, thể tích 80 cm³, có vạch 20, 40, 60, 80 cm³; trọng lượng 1,3 N.</li>
<li>Nước muối 11 000 N/m³ và dầu 8 000 N/m³ là giá trị minh họa (nước muối thật tùy độ mặn).</li>
<li>Lực kế lò xo có độ cứng 24 N/m (2 N ứng với 8,3 cm), ĐCNN 0,02 N; kim dao động tắt dần, trong chất lỏng tắt nhanh hơn.</li>
<li>Bình tràn: đường kính trong 8 cm, vòi ở độ cao 10 cm; nước tràn ra tối đa 45 mL/s; cốc hứng đường kính 6 cm, vạch 5 mL.</li>
<li>Bỏ qua sức căng mặt ngoài và lượng nước còn đọng trong vòi.</li><li>Cảnh 3D vẽ đúng kích thước các dụng cụ (theo cm); hình phóng to thang lực kế và vạch cốc hứng giúp đọc số chính xác.</li></ul>`;

LabKHTN.register("K8-L-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"lq",t:"Chất lỏng"},{k:"do",t:"Đo"},{k:"doc",t:"Em đọc"},{k:"dung",t:"Giá trị đúng"}],empty:"Chạm vào lực kế hoặc cốc hứng để phóng to, đọc số rồi bấm “Ghi vào bảng”."},
  gv:GV,sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Giá thí nghiệm 3D: lực kế treo quả nặng phía trên bình tràn, cốc hứng nước tràn");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let simT=0,frameN=0,day=api.day,Q=M.palette(api.day);
    const S={liq:"nuoc",arm:ARM_MIN,armTo:null,ext:P_W/KSPR*100,vel:0,W:ACAN*HSP,cup:0,flow:0,recs:[],p1:null,p2:null,locked:false,q:{},finished:false,deep:false,lastS:0,cardFor:null};
    let bodyEl=null,stepIdx=0,drag=null;

    /* ---------- vật lí ---------- */
    function geom(ext){ /* ext: cm */
      const yb=S.arm+292.3+ext*U;          /* đáy vật (đơn vị cảnh) */
      const zb=(X.canBot-yb)/U;            /* độ cao đáy vật so với đáy bình (cm) */
      let L=S.W/ACAN,s=0;
      if(L>zb){const Lp=(S.W-AOBJ*Math.max(0,zb))/(ACAN-AOBJ);
        if(zb<0){s=0}else{s=Lp-zb;L=Lp;if(s>HOBJ){s=HOBJ;L=(S.W+AOBJ*HOBJ)/ACAN}}}
      return{yb,zb,L,s:Math.max(0,s)};
    }
    function step(dt){
      const sub=8,h=dt/sub,d=LIQ[S.liq].d;
      for(let i=0;i<sub;i++){
        const g=geom(S.ext);
        const FA=d*AOBJ*g.s*1e-6;
        const zeta=.06+.9*(g.s/HOBJ),c=2*zeta*Math.sqrt(KSPR*MASS);
        const e=S.ext/100;let a=(P_W-FA-KSPR*e-c*S.vel/100)/MASS*100;
        S.vel+=a*h;S.ext+=S.vel*h;
        const g2=geom(S.ext);if(g2.zb<0.3){S.ext=(X.canBot-0.3*U-S.arm-292.3)/U;if(S.vel>0)S.vel=0}
      }
      /* tràn qua vòi */
      const g=geom(S.ext);S.lastS=g.s;
      if(g.L>HSP){const ex=ACAN*(g.L-HSP);const dV=Math.min(ex,45*dt);S.W-=dV;S.cup=Math.min(ACUP*HCUP,S.cup+dV);S.flow=dV/Math.max(dt,1e-6)}else S.flow=0;
    }
    const reading=()=>KSPR*S.ext/100;
    const trueRead=()=>Math.round(reading()/M.SCALE.step)*M.SCALE.step;
    const vsub=()=>AOBJ*S.lastS;
    function vLabel(){const v=vsub();for(const L of LEVELS)if(Math.abs(v-L)<1.5)return L===0?"P (trong không khí)":`F khi chìm ${L} cm³`;if(Math.abs(v-VOBJ)<0.05)return"F khi chìm 80 cm³";return `F khi chìm ≈ ${Math.round(v)} cm³`}
    /* đặt giá đỡ để vật chìm đúng mức V (cm³) khi cân bằng */
    function armFor(Vt){
      const d=LIQ[S.liq].d,s=Vt/AOBJ,FA=d*Vt*1e-6,e=(P_W-FA)/KSPR*100;
      if(Vt<=0)return ARM_MIN;
      let L=Math.min(HSP,(S.W+AOBJ*s)/ACAN);const zb=L-s;
      const yb=X.canBot-zb*U;return C.clamp(yb-292.3-e*U,ARM_MIN,ARM_MAX);
    }
    function goLevel(V){S.armTo=armFor(V);S.deep=false}
    function refill(){S.W=ACAN*HSP;S.cup=0;S.armTo=ARM_MIN}
    function setLiquid(k){S.liq=k;S.arm=ARM_MIN;S.armTo=null;S.ext=P_W/KSPR*100;S.vel=0;S.W=ACAN*HSP;S.cup=0;refresh();api.toast(`Đã thay bình tràn bằng ${LIQ[k].ten.toLowerCase()} (d = ${LIQ[k].d.toLocaleString("vi-VN")} N/m³), đầy tới vòi; cốc hứng đã đổ hết.`,"info",3600)}


    /* ================= cảnh 3D (1 cm = 0,05 đơn vị) ================= */
    const k=.05,Y0=.012,wy=sy=>(X.canBot-sy)/U*k+Y0;     /* toạ độ cảnh 2D (y hướng xuống) → độ cao thật */
    const XC={rod:-.78,can:0,cup:.53};
    const root=new G.Node();root.add(K3.bench(R,6.4,3.6,day));
    const metal={color:"#B7BEC9",rough:.28,metal:1};const dark={color:"#2B3142",rough:.5};
    /* giá thí nghiệm */
    const stand=root.add(new G.Node());stand.pos=[XC.rod,0,0];
    stand.add(R.mesh(G.box(.55,.035,.5,.012,2),dark)).pos=[0,.018,0];
    stand.add(R.mesh(G.cylinder(.02,2.42,16),metal)).pos=[0,.03,0];
    const arm=root.add(new G.Node());
    arm.add(R.mesh(G.box(.1,.08,.09,.015,2),dark)).pos=[XC.rod,0,0];
    arm.add(R.mesh(G.cylinder(.013,XC.can-XC.rod+.02,12),metal)).quat=G.Q.euler(0,0,-Math.PI/2);arm.children[1].pos=[XC.rod,0,0];
    arm.add(R.mesh(G.tube(Array.from({length:13},(_,i)=>{const a=Math.PI*(.15+1.2*i/12);return[XC.can+Math.cos(a)*.022,-.03-Math.sin(a)*.022,0]}),.005,6),metal));
    /* bình tràn: thủy tinh, vòi */
    const canN=root.add(new G.Node());canN.pos=[XC.can,0,0];
    canN.add(K3.glass(R,RCAN*k+.012,HCAN*k+Y0,{lip:.012,th:.012}));
    const spY=HSP*k+Y0;
    canN.add(R.mesh(G.tube([[RCAN*k+.004,spY,0],[RCAN*k+.08,spY-.008,0],[XC.cup-XC.can-.12,spY-.03,0]],.016,10),{type:"glass",color:"#DCEBFF",alpha:.6}));
    const LCOL={nuoc:["#7FB2F0",.34],muoi:["#A9CCEB",.42],dau:["#E7B53C",.55]};
    const canLiq=canN.add(R.mesh(G.merge([G.lathe([[RCAN*k-.002,0],[RCAN*k-.002,1]],48),G.disk(RCAN*k-.002,1,48,true),G.disk(RCAN*k-.002,0,48,false)]),{color:"#7FB2F0",alpha:.34,rough:.05,coat:.5,order:1}));
    /* cốc hứng có vạch chia */
    const cupN=root.add(new G.Node());cupN.pos=[XC.cup,0,0];
    cupN.add(K3.glass(R,RCUP*k+.01,HCUP*k+Y0+.01,{lip:.012,th:.01}));
    const cupLiq=cupN.add(R.mesh(G.merge([G.lathe([[RCUP*k-.002,0],[RCUP*k-.002,1]],40),G.disk(RCUP*k-.002,1,40,true)]),{color:"#7FB2F0",alpha:.34,rough:.05,coat:.5,order:1}));
    function arcPatch(r,a0,a1,y0,y1,n){const p=[],nm=[],uv=[],ix=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n,s=Math.sin(a),c=Math.cos(a);for(let j=0;j<=1;j++){p.push(r*s,j?y1:y0,r*c);nm.push(s,0,c);uv.push(i/n,j?0:1)}}
      for(let i=0;i<n;i++){const a=i*2,b=a+2;ix.push(a,b,b+1,a,b+1,a+1)}return{pos:new Float32Array(p),nrm:new Float32Array(nm),idx:new Uint16Array(ix),col:null,uv:new Float32Array(uv)}}
    {const c=document.createElement("canvas");c.width=128;c.height=512;const g=c.getContext("2d");g.fillStyle="#fff";g.font="700 30px system-ui,sans-serif";
      const vmax=Math.PI*RCUP*RCUP*HCUP;const cy=v=>(1-v/vmax)*512;for(let v=10;v<=vmax;v+=10){const y=cy(v),maj=v%50===0;g.fillRect(4,y-2,maj?46:26,maj?4:3);if(maj)g.fillText(String(v),56,y+11)}
      const tex=R.tex2D(c,{mip:true});cupN.add(R.mesh(arcPatch(RCUP*k+.012,-.75,-.15,Y0,Y0+HCUP*k,8),{type:"unlit",color:"#FFFFFF",transparent:true,order:3,side:"double",key:"cupscale",hooks:{fu:"uniform sampler2D uTex;uniform vec3 uScInk;",fs:"{vec4 t=texture(uTex,vUV);base=vec4(uScInk,t.a*.9);}"},textures:{uTex:tex},uniforms:{uScInk:[.92,.95,1]}}))}
    const stream=root.add(R.mesh(G.cylinder(1,1,10,false),{type:"glass",color:"#EAF4FF",alpha:.75}));stream.visible=false;
    /* lực kế ống: vỏ trong suốt, bảng chia độ, lò xo, kim, móc */
    const sc=root.add(new G.Node());
    const BODY=SCALE_BODY_CM*k,TOP2SC=2*k;
    sc.add(R.mesh(G.cylinder(.03,BODY,24),{type:"glass",color:"#E2EEFF",alpha:.5})).pos=[0,-BODY,0];
    sc.add(R.mesh(G.cylinder(.034,.025,24),dark)).pos=[0,-.025,0];sc.add(R.mesh(G.cylinder(.034,.02,24),dark)).pos=[0,-BODY-.01,0];
    sc.add(R.mesh(G.tube([[0,.0,0],[0,.04,0]],.004,6),metal)).pos=[0,0,0];
    {const c=document.createElement("canvas");c.width=96;c.height=512;const g=c.getContext("2d");g.fillStyle="#F6F3E6";g.fillRect(0,0,96,512);
      const px=512/SCALE_BODY_CM,o=2*px,tr=100/U*px;g.fillStyle="#1C2233";g.font="800 22px system-ui,sans-serif";
      for(let i=0;i<=100;i++){const v=i*.02,y=o+v/2*tr;const maj=i%5===0;g.fillRect(maj?40:54,y-1.2,maj?52:38,maj?2.6:1.6);if(i%25===0){g.textAlign="right";g.fillText(fmt(v,1).replace(",0",""),36,y+8)}}
      g.font="800 20px system-ui,sans-serif";g.textAlign="center";g.fillText("N",48,o+tr+40);g.font="600 13px system-ui,sans-serif";g.fillText("2 N · 0,02 N",48,o+tr+64);
      const tex=R.tex2D(c,{mip:true});const pl=sc.add(R.mesh(G.plane(.044,BODY-.01),{type:"unlit",color:"#FFFFFF",key:"scplate",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:tex},uniforms:{uDim:.92}}));
      pl.pos=[0,-BODY/2,.0];pl.quat=G.Q.euler(Math.PI/2,0,0);sc.plate=pl}
    const springN=sc.add(new G.Node());
    const springGeo=(()=>{const pts=[];for(let i=0;i<=160;i++){const t=i/160,a=t*Math.PI*2*14;pts.push([Math.cos(a)*.016,-t,Math.sin(a)*.016+.012])}return G.tube(pts,.0025,5)})();
    const spring=springN.add(R.mesh(springGeo,metal));
    const pointer=sc.add(R.mesh(G.box(.06,.006,.012,.002,1),{color:"#E2382F",rough:.4}));
    const rodIn=sc.add(R.mesh(G.cylinder(.006,1,8),metal));
    const hook=root.add(R.mesh(G.tube([[0,0,0],[0,-.026,0]].concat(Array.from({length:13},(_,i)=>{const a=Math.PI*1.3*i/12;return[Math.sin(a)*.018,-.044+Math.cos(a)*.018,0]})),.0045,6),metal));
    /* quả nặng hình trụ có vạch 20, 40, 60 cm³ */
    const objR=Math.sqrt(AOBJ/Math.PI)*k,objH=HOBJ*k;
    const ocv=document.createElement("canvas");ocv.width=512;ocv.height=256;{const g=ocv.getContext("2d");const gr=g.createLinearGradient(0,0,512,0);gr.addColorStop(0,"#8D96A6");gr.addColorStop(.5,"#C9CFD8");gr.addColorStop(1,"#8D96A6");g.fillStyle=gr;g.fillRect(0,0,512,256);
      g.fillStyle="#14192A";g.font="800 26px system-ui,sans-serif";g.textAlign="left";for(const v of [20,40,60]){const y=256-v/VOBJ*256;g.fillRect(0,y-1.5,512,3);g.fillText(String(v),110,y-6)}}
    const ocv2=document.createElement("canvas");ocv2.width=512;ocv2.height=256;{const g=ocv2.getContext("2d");g.translate(512,256);g.scale(-1,-1);g.drawImage(ocv,0,0)}
    const objTex=R.tex2D(ocv2,{mip:true});
    const obj=root.add(new G.Node());
    obj.add(R.mesh(G.merge([G.lathe([[objR,0],[objR,objH]],48)]),{color:"#FFFFFF",rough:.35,metal:.6,key:"objtex",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb*=texture(uTex,vUV).rgb;}"},textures:{uTex:objTex}}));
    obj.add(R.mesh(G.disk(objR,objH,48,true),{color:"#B9C0CB",rough:.35,metal:.7}));obj.add(R.mesh(G.disk(objR,0,48,false),{color:"#9AA2AF",rough:.4,metal:.7}));
    obj.add(R.mesh(G.tube(Array.from({length:13},(_,i)=>{const a=Math.PI*i/12;return[Math.cos(a)*.014,objH+Math.sin(a)*.022,0]}),.004,6),metal));
    /* nhãn */
    const LB=G.labels(over,R,{bounds:api.safe});
    const lbl=(html,p,cls)=>LB.add(`<span>${html}</span>`,p,cls);
    const L1=lbl("Lực kế 2 N",()=>[.05,wy(S.arm+18)-.18,0],"right"),L2=lbl("Bình tràn",[XC.can-.24,.32,0],"left"),L3=lbl("Cốc hứng",[XC.cup,HCUP*k+.08,0]),L4=lbl("Quả nặng 130 g · 80 cm³",()=>[objR+.03,objTopY()-objH/2,0],"right");
    function objTopY(){return wy(S.arm+198+S.ext*U)}
    /* bảng phóng to (màn hình rộng) */
    const zoom=document.createElement("div");zoom.className="gl-card glass";zoom.innerHTML=`<div style="font-weight:800;font-size:.8rem">Phóng to thang lực kế</div><canvas class="zs" style="width:100%;height:auto;aspect-ratio:252/170;border-radius:10px"></canvas><div style="font-weight:800;font-size:.8rem">Phóng to vạch cốc hứng</div><canvas class="zc" style="width:100%;height:auto;aspect-ratio:252/110;border-radius:10px"></canvas><div class="note zi"></div>`;over.appendChild(zoom);
    const zs=zoom.querySelector(".zs"),zc=zoom.querySelector(".zc"),zi=zoom.querySelector(".zi");

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:-.2,maxPitch:1.3});
    const PRE={t:[-.1,1.12,0],yaw:-.08,pitch:.1,rad:1.18};
    let safe={x:0,y:0,w:1,h:1},zm=1,wide=true;
    function fitDist(rad){const s=R.size();const tv=Math.tan(cam.fov/2)*safe.h/s.h,th=Math.tan(cam.fov/2)*(s.w/s.h)*safe.w/s.w;return rad/Math.min(tv,th)}
    function home(){Object.assign(cam,{target:[...PRE.t],yaw:PRE.yaw,pitch:PRE.pitch,dist:fitDist(PRE.rad)*zm})}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));const sf=api.safe();const s=R.size();
      wide=sf.w>=560;zoom.style.display=wide?"":"none";
      if(wide){zoom.style.right=(s.w-sf.x-sf.w+12)+"px";zoom.style.top=(sf.y+12)+"px";zoom.style.left="auto";safe={x:sf.x,y:sf.y,w:Math.max(80,sf.w-zoom.offsetWidth-18),h:sf.h}}else safe=sf;
      cam.shift=[2*(safe.x+safe.w/2)/s.w-1,1-2*(safe.y+safe.h/2)/s.h];cam.dist=fitDist(PRE.rad)*zm}
    function theme(){day=api.day;Q=M.palette(day);const E=R.env;
      if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=.55}
      else{E.bgTop=H("#1B2347");E.bgBot=H("#06091A");E.bgGlow=H("#2B3670");E.sky=H("#6070A0");E.gnd=H("#171B2B");E.hor=H("#3E4868");E.exposure=.8;E.ink=0}
      E.k1c=[2.1,2.0,1.85];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9];over.classList.toggle("day",day)}

    /* ================= vẽ từng khung ================= */
    function place(){
      const aY=wy(S.arm);arm.pos=[0,aY,0];
      const top=wy(S.arm+18);sc.pos=[XC.can,top,0];
      const e=S.ext*k;               /* độ giãn lò xo (đơn vị cảnh) */
      const pY=-TOP2SC-e;pointer.pos=[0,pY,.032];
      springN.pos=[0,-.03,0];spring.scl=[1,Math.max(.02,(TOP2SC-.03)+e),1];
      rodIn.pos=[0,-BODY-e-.02,0];rodIn.scl=[1,BODY-TOP2SC+.02,1];
      const hookY=top-BODY-e-.02;hook.pos=[XC.can,hookY,0];
      obj.pos=[XC.can,objTopY()-objH,0];
      const g=geom(S.ext);const L=Math.min(g.L,HSP+.25);canLiq.pos=[0,Y0,0];canLiq.scl=[1,Math.max(.001,L*k),1];
      const lc=LCOL[S.liq];canLiq.mat.color=H(lc[0]);canLiq.mat.alpha=lc[1];cupLiq.mat.color=H(lc[0]);cupLiq.mat.alpha=lc[1];
      const hc=S.cup/ACUP*k;cupLiq.visible=S.cup>.05;cupLiq.pos=[0,Y0,0];cupLiq.scl=[1,Math.max(.001,hc),1];
      if(S.flow>.5){const x0=XC.cup-.12,y0=spY-.03,y1=Y0+hc;stream.visible=true;const rad=.004+.0015*Math.sqrt(S.flow);stream.pos=[x0+.006,y1,0];stream.scl=[rad,Math.max(.01,y0-y1),rad];stream.quat=[0,0,0,1];stream.mat.color=H(lc[0])}else stream.visible=false}
    function drawZoom(){if(!wide)return;const d=Math.min(2,window.devicePixelRatio||1);
      for(const [c,fn] of [[zs,(g,w,h)=>M.drawScaleZoom(g,w,h,reading(),Q)],[zc,(g,w,h)=>M.drawCupZoom(g,w,h,S.cup,Q,LIQ[S.liq].z)]]){const r=c.getBoundingClientRect();if(!r.width)continue;
        if(c.width!==Math.round(r.width*d)){c.width=Math.round(r.width*d);c.height=Math.round(r.height*d)}const g=c.getContext("2d");g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,r.width,r.height);fn(g,r.width,r.height)}
      const t=`${LIQ[S.liq].ten} · d = ${LIQ[S.liq].d.toLocaleString("vi-VN")} N/m³ · phần chìm ≈ ${Math.round(vsub())} cm³${Math.abs(S.vel)>.4?" · kim đang dao động":""}`;if(zi._t!==t){zi.textContent=t;zi._t=t}}

    /* ================= con trỏ: kéo tay đỡ lên xuống, chạm lực kế/cốc để đọc ================= */
    function planeY(px,py){const r=R.ray(px,py);if(Math.abs(r.d[2])<1e-5)return null;const t=-r.o[2]/r.d[2];return t>0?r.o[1]+r.d[1]*t:null}
    function pick(px,py){const r=R.ray(px,py);const g=geom(S.ext);
      const top=wy(S.arm+18);
      if(G.hit.box(r,[XC.can-.06,objTopY()-objH-.02,-.06],[XC.can+.06,top+.06,.06])!=null)return{scale:1};
      if(G.hit.box(r,[XC.rod-.08,wy(S.arm)-.06,-.12],[XC.can+.04,wy(S.arm)+.06,.04])!=null)return{arm:1};
      if(G.hit.box(r,[XC.cup-.18,0,-.18],[XC.cup+.18,HCUP*k+.04,.18])!=null)return{cup:1};
      return null}
    const ptr=C.pointer(cv,{
      down(p,e){const h=pick(p.x,p.y);if(h&&(h.scale||h.arm)){const y=planeY(p.x,p.y);drag={y0:y,a0:S.arm,tapScale:!!h.scale};S.armTo=null;return true}
        if(h&&h.cup){drag={cup:1};return true}orbit.start(p,e.pointerId);return true},
      move(p,e){if(!drag){orbit.move(p,e.pointerId);return}if(drag.cup)return;const y=planeY(p.x,p.y);if(y==null||drag.y0==null)return;S.arm=C.clamp(drag.a0-(y-drag.y0)/k*U,ARM_MIN,ARM_MAX)},
      up(p,e,tap){if(!drag){orbit.end(e.pointerId);return}const d=drag;drag=null;if(tap&&d.cup)card("cup");else if(tap&&d.tapScale)card("scale")},
      cancel(){drag=null;orbit.end()},
      hover(p){if(frameN%3)return;const h=pick(p.x,p.y);cv.style.cursor=h&&(h.scale||h.arm)?"ns-resize":h?"pointer":"grab"}});
    function onWheel(e){e.preventDefault();zm=C.clamp(zm*Math.exp(e.deltaY*.0012),.5,2.2);cam.dist=fitDist(PRE.rad)*zm}
    cv.addEventListener("wheel",onWheel,{passive:false});

    /* ---------- đọc số ---------- */
    function card(kind){
      S.cardFor=kind;
      api.card(`<h3>${kind==="scale"?"Lực kế · đọc số chỉ":"Cốc hứng · đọc thể tích nước tràn"}</h3><p class="sub">${kind==="scale"?"GHĐ 2 N · ĐCNN 0,02 N (mỗi vạch nhỏ)":"Vạch nhỏ 1 mL trong hình phóng to · số ghi mỗi 10 mL"}</p>
        <canvas id="zoomCv" style="width:100%;height:auto;aspect-ratio:2/1;display:block;margin-top:10px;border-radius:14px"></canvas>
        <p class="sub" id="zoomInfo" style="margin-top:6px"></p>
        <div class="numin" style="margin-top:10px"><label for="readIn">Em đọc được:</label><input id="readIn" inputmode="decimal" placeholder="${kind==="scale"?"0,00":"0"}"><span>${kind==="scale"?"N":"mL"}</span><button class="btn sm main" data-cv="rec" data-m="${kind}">Ghi vào bảng</button></div><div id="readFb" style="margin-top:8px"></div>`);
    }
    function record(kind){
      const inp=document.getElementById("readIn"),fb=document.getElementById("readFb");
      const raw=inp?String(inp.value).trim().replace(",","."):"";
      if(raw===""||isNaN(+raw)){if(fb)fb.innerHTML=`<div class="callout warn">Gõ số em đọc được trước đã.</div>`;return}
      const read=+raw;
      if(kind==="scale"){
        if(Math.abs(S.vel)>0.4){if(fb)fb.innerHTML=`<div class="callout warn">Kim còn dao động. Chờ kim đứng yên rồi đọc lại.</div>`;return}
        const tr=trueRead(),ok=Math.abs(read-tr)<=M.SCALE.step*1.01+1e-9,v=vsub(),lab=vLabel();
        const rec={kind:"F",liq:S.liq,V:v,lab,read,tr,ok};S.recs.push(rec);
        api.record({lan:String(S.recs.length),lq:LIQ[S.liq].ten,do:lab,doc:fmt(read,2)+" N"+(ok?" ✓":" ✗"),dung:fmt(tr,2)+" N"});
        if(fb)fb.innerHTML=ok?`<div class="callout ok">Đã ghi: ${lab} = ${fmt(tr,2)} N.</div>`:`<div class="callout bad">Đã ghi. Kim chỉ ${fmt(tr,2)} N, em đọc ${fmt(read,2)} N. Mỗi vạch nhỏ là 0,02 N.</div>`;
      }else{
        const tr=Math.round(S.cup),ok=Math.abs(read-tr)<=1.01;
        const rec={kind:"Vt",liq:S.liq,V:vsub(),lab:"V nước tràn",read,tr,ok};S.recs.push(rec);
        api.record({lan:String(S.recs.length),lq:LIQ[S.liq].ten,do:`V tràn (vật chìm ${Math.round(vsub())} cm³)`,doc:fmt(read,0)+" mL"+(ok?" ✓":" ✗"),dung:fmt(tr,0)+" mL"});
        if(fb)fb.innerHTML=ok?`<div class="callout ok">Đã ghi ${tr} mL nước tràn. Trọng lượng phần nước này: d·V = ${fmt(LIQ[S.liq].d*tr*1e-6,2)} N.</div>`:`<div class="callout bad">Đã ghi. Mực nước ở ${tr} mL, em đọc ${fmt(read,0)} mL.</div>`;
      }
      if(inp)inp.value="";refresh();
    }
    function onVp(e){const t=e.target.closest("[data-cv]");if(!t)return;if(t.dataset.cv==="rec")record(t.dataset.m)}
    function onVpKey(e){if(e.key==="Enter"&&e.target.id==="readIn"){e.preventDefault();const b=api.vp.querySelector('[data-cv="rec"]');if(b)record(b.dataset.m)}}
    api.vp.addEventListener("click",onVp);api.vp.addEventListener("keydown",onVpKey);


    /* ---------- khay ---------- */
    const ico={
      scale:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 3v4"/><rect x="14" y="7" width="12" height="20" rx="3"/><path d="M17 12h3M17 16h4M17 20h3M20 27v5"/><path d="M17 32a3 3 0 1 0 6 0"/></svg>',
      cup:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M10 8v24h20V8"/><path d="M10 22h20v10H10z" fill="currentColor" opacity=".25" stroke="none"/><path d="M26 13h4M26 18h4"/></svg>',
      drop:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 5c7 9 11 15 11 20a11 11 0 0 1-22 0c0-5 4-11 11-20z"/></svg>',
      refill:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20a12 12 0 1 0 4-9L8 15"/><path d="M8 7v8h8"/></svg>'
    };
    function refreshDock(){
      api.dock.innerHTML=`<button class="titem" data-k="scale">${ico.scale}Lực kế<br>2 N</button><button class="titem" data-k="cup">${ico.cup}Cốc hứng</button>${Object.entries(LIQ).map(([k,l])=>`<button class="titem" data-k="liq" data-v="${k}" aria-pressed="${S.liq===k}">${ico.drop}${l.ten}</button>`).join("")}<button class="titem" data-k="refill">${ico.refill}Làm đầy<br>bình tràn</button>`;
    }
    function onDock(e){const t=e.target.closest("[data-k]");if(!t)return;const k=t.dataset.k;
      if(k==="scale")card("scale");else if(k==="cup")card("cup");else if(k==="liq"){if(t.dataset.v!==S.liq)setLiquid(t.dataset.v)}else if(k==="refill"){refill();api.toast("Đã nâng vật lên, đổ nước trong cốc hứng trở lại bình; bình đầy tới vòi.","info")}}
    api.dock.addEventListener("click",onDock);

    /* ---------- hướng dẫn ---------- */
    const recF=(liq,L)=>S.recs.filter(r=>r.kind==="F"&&r.liq===liq&&Math.abs(r.V-L)<1.5);
    const has=(liq,L)=>recF(liq,L).length>0;
    function refresh(){
      refreshDock();
      const water=has("nuoc",0)&&[20,40,60,80].filter(L=>has("nuoc",L)).length>=3;
      const tran=S.recs.some(r=>r.kind==="Vt"&&r.tr>5);
      const other=["muoi","dau"].some(l=>has(l,0)&&[20,40,60,80].some(L=>has(l,L)));
      api.okAt(0,S.locked);api.okAt(1,water&&tran&&other);api.okAt(2,water&&tran&&other);api.okAt(3,S.finished);
      if(bodyEl)renderStep();
    }
    function summary(liq){
      const last=a=>a.length?a[a.length-1].tr:null;const Pa=last(recF(liq,0));
      return [20,40,60,80].map(L=>{const f=last(recF(liq,L));return{L,F:f,FA:(Pa!=null&&f!=null)?Pa-f:null}}).concat([]).map(o=>({...o,P:Pa}));
    }
    function chart(){
      const W=300,H=180,x=v=>40+v/80*240,y=f=>150-f/1*130;
      let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Đồ thị lực đẩy theo thể tích phần chìm" style="width:100%;height:auto">`;
      s+=`<g stroke="currentColor" stroke-opacity=".25">${[0,.2,.4,.6,.8,1].map(f=>`<line x1="40" x2="280" y1="${y(f)}" y2="${y(f)}"/>`).join("")}</g>`;
      s+=`<g fill="currentColor" font-size="10">${[0,.2,.4,.6,.8,1].map(f=>`<text x="34" y="${y(f)+3}" text-anchor="end">${fmt(f,1)}</text>`).join("")}${[0,20,40,60,80].map(v=>`<text x="${x(v)}" y="166" text-anchor="middle">${v}</text>`).join("")}<text x="280" y="178" text-anchor="end">V chìm (cm³)</text><text x="6" y="12">F<tspan font-size="8" dy="2">A</tspan><tspan dy="-2"> (N)</tspan></text></g>`;
      const cols={nuoc:"#3B82F6",muoi:"#0EA5E9",dau:"#EAB308"};
      for(const liq of Object.keys(LIQ)){const pts=summary(liq).filter(o=>o.FA!=null);if(!pts.length)continue;
        s+=`<polyline fill="none" stroke="${cols[liq]}" stroke-width="2" points="${[{L:0,FA:0},...pts].map(o=>`${x(o.L)},${y(o.FA)}`).join(" ")}"/>`;
        s+=pts.map(o=>`<circle cx="${x(o.L)}" cy="${y(o.FA)}" r="4" fill="${cols[liq]}"/>`).join("");}
      s+=`<g font-size="10" font-weight="700">${Object.entries(LIQ).map(([k,l],i)=>`<rect x="${52+i*80}" y="20" width="10" height="10" rx="2" fill="${cols[k]}"/><text x="${66+i*80}" y="29" fill="currentColor">${l.ten}</text>`).join("")}</g>`;
      return s+`</svg>`;
    }
    function renderStep(){
      const el=bodyEl;if(!el)return;
      const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      if(stepIdx===0){
        const q1=[["tang","Tăng dần"],["giam","Giảm dần"],["khong","Không đổi"]];
        const q2=[["kl","Khối lượng của vật"],["v","Thể tích phần vật chìm trong chất lỏng và loại chất lỏng"],["sau","Độ sâu của vật, kể cả khi vật đã chìm hẳn"]];
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2"><b>Câu 1.</b> Treo quả nặng vào lực kế rồi nhúng dần vào nước trong bình tràn. Số chỉ của lực kế sẽ:</p>
          <div class="opts">${q1.map(([k,t],i)=>`<button class="opt" data-p1="${k}" aria-pressed="${S.p1===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          <p class="lead2"><b>Câu 2.</b> Theo em, độ lớn lực mà nước đẩy vật lên phụ thuộc chủ yếu vào:</p>
          <div class="opts">${q2.map(([k,t],i)=>`<button class="opt" data-p2="${k}" aria-pressed="${S.p2===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}
          ${gvTip("có thể cho học sinh ấn quả bóng bàn xuống chậu nước (thí nghiệm khởi động SGK) trước khi dự đoán.")}`;
      }else if(stepIdx===1){
        const nW=[20,40,60,80].filter(L=>has("nuoc",L)).length;
        const items=[
          [has("nuoc",0),"Đo trọng lượng P của quả nặng trong không khí: chạm vào lực kế, đọc và ghi.",`<button class="btn sm" data-k="lv" data-v="0">Nâng vật ra khỏi nước</button> <button class="btn sm" data-k="read">Đọc lực kế</button>`],
          [nW>=3,`Nhúng vật vào nước đến các vạch 20, 40, 60, 80 cm³, mỗi mức đọc và ghi số chỉ F (đã ghi ${nW}/4).`,[20,40,60,80].map(L=>`<button class="btn sm" data-k="lv" data-v="${L}">${L} cm³</button>`).join(" ")+` <button class="btn sm" data-k="read">Đọc lực kế</button>`],
          [S.recs.some(r=>r.kind==="Vt"&&r.tr>5),"Khi vật chìm, đọc thể tích nước tràn sang cốc hứng (chạm vào cốc).",`<button class="btn sm" data-k="cupc">Đọc cốc hứng</button>`],
          [["muoi","dau"].some(l=>has(l,0)&&[20,40,60,80].some(L=>has(l,L))),"Thay nước muối (hoặc dầu) ở khay, đo lại P và ít nhất một mức chìm.",`<button class="btn sm" data-k="liq" data-v="muoi">Dùng nước muối</button> <button class="btn sm" data-k="liq" data-v="dau">Dùng dầu</button>`],
          [S.deep,"Thử thêm: khi vật đã chìm hẳn, hạ sâu hơn nữa. Số chỉ lực kế có đổi không?",`<button class="btn sm" data-k="deep">Hạ sâu thêm</button>`]];
        let nowSet=false;
        el.innerHTML=`<h3>Làm thí nghiệm · ${LIQ[S.liq].ten}</h3>
          <ol class="todo">${items.map(([d,t,b])=>{const now=!d&&!nowSet;if(now)nowSet=true;return`<li class="${d?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${t}${!d||now?`<div class="act">${b}</div>`:""}</div></li>`}).join("")}</ol>
          <div class="callout"><b>Lưu ý:</b> bình tràn phải đầy tới vòi trước khi nhúng vật. Nếu đã nâng vật lên rồi nhúng lại, bấm “Làm đầy bình tràn” ở khay để đo lại cho đúng.</div>
          <p class="muted" style="font-size:.84rem">Kéo tay đỡ hoặc lực kế lên/xuống để tự nhúng vật. Chọn 0,25× để thấy kim dao động và nước tràn.</p>
          ${gvTip("hỏi: lực kế chỉ ít đi bao nhiêu khi vật chìm 80 cm³? Lượng nước tràn ra nặng bao nhiêu?")}`;
      }else if(stepIdx===2){
        const rows=Object.keys(LIQ).map(l=>({l,s:summary(l)})).filter(o=>o.s[0].P!=null);
        const vt=S.recs.filter(r=>r.kind==="Vt");
        el.innerHTML=`<h3>Quan sát và so sánh</h3>
          ${rows.map(o=>`<p class="lead2"><b>${LIQ[o.l].ten}</b> · P = ${fmt(o.s[0].P,2)} N · d = ${LIQ[o.l].d.toLocaleString("vi-VN")} N/m³</p><div class="table-wrap"><table class="atoms"><thead><tr><th>V chìm (cm³)</th><th>F (N)</th><th>F<sub>A</sub> = P − F (N)</th><th>d·V (N)</th></tr></thead><tbody>${o.s.map(r=>`<tr><td class="num">${r.L}</td><td class="num">${r.F==null?"—":fmt(r.F,2)}</td><td class="num">${r.FA==null?"—":fmt(r.FA,2)}</td><td class="num">${fmt(LIQ[o.l].d*r.L*1e-6,2)}</td></tr>`).join("")}</tbody></table></div>`).join("")||`<div class="callout warn">Chưa có số đo. Quay lại bước 2.</div>`}
          ${vt.length?`<div class="callout">Nước tràn đo được: ${vt.map(r=>`${fmt(r.tr,0)} mL (${LIQ[r.liq].ten.toLowerCase()}, vật chìm ${Math.round(r.V)} cm³) → trọng lượng ${fmt(LIQ[r.liq].d*r.tr*1e-6,2)} N`).join("; ")}.</div>`:""}
          <div class="schbox">${chart()}</div>
          <ul class="tlist"><li>So sánh cột F<sub>A</sub> với cột d·V.</li><li>Đồ thị F<sub>A</sub> theo V có dạng gì?</li><li>Cùng thể tích chìm, chất lỏng nào đẩy vật mạnh hơn?</li></ul>`;
      }else{
        const Q=[
          {k:"a",t:"Một vật có trọng lượng 2 N. Nhúng chìm vật trong nước, lực kế chỉ 1,6 N. Lực đẩy Archimedes tác dụng lên vật là:",o:[["a","3,6 N"],["b","0,4 N"],["c","1,6 N"]],ok:"b",why:{a:"Lực đẩy hướng lên làm số chỉ giảm: F_A = P − F.",c:"1,6 N là số chỉ lực kế, không phải lực đẩy."}},
          {k:"b",t:"Một thỏi nhôm và một thỏi thép có thể tích bằng nhau, cùng nhúng chìm trong nước. Lực đẩy Archimedes:",o:[["a","Lên thỏi thép lớn hơn vì thép nặng hơn"],["b","Bằng nhau vì cùng thể tích chiếm chỗ và cùng chất lỏng"],["c","Lên thỏi nhôm lớn hơn vì nhôm nhẹ hơn"]],ok:"b",why:{a:"F_A = d·V chỉ phụ thuộc chất lỏng và thể tích phần chìm, không phụ thuộc chất làm vật.",c:"F_A = d·V không phụ thuộc vật nặng hay nhẹ."}},
          {k:"c",t:"Hai thỏi đồng cùng thể tích, một thỏi nhúng chìm trong nước, một thỏi nhúng chìm trong dầu. Thỏi nào chịu lực đẩy lớn hơn?",o:[["a","Thỏi trong nước"],["b","Thỏi trong dầu"],["c","Như nhau"]],ok:"a",why:{b:"Trọng lượng riêng của dầu nhỏ hơn của nước nên lực đẩy nhỏ hơn.",c:"Cùng V nhưng d khác nhau thì F_A khác nhau."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="giam"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{tang:"tăng dần",giam:"giảm dần",khong:"không đổi"}[S.p1]}</b>. Kết quả: số chỉ lực kế <b>giảm dần</b> khi phần chìm tăng, rồi không đổi khi vật đã chìm hẳn.</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="v"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{kl:"khối lượng vật",v:"thể tích phần chìm và loại chất lỏng",sau:"độ sâu"}[S.p2]}</b>. Lực đẩy chỉ phụ thuộc thể tích phần chất lỏng bị chiếm chỗ và trọng lượng riêng của chất lỏng.</div>`:""}
          <div class="callout"><b>SGK:</b> “Lực đẩy Archimedes tác dụng lên vật đặt trong chất lỏng có độ lớn bằng trọng lượng phần chất lỏng mà vật chiếm chỗ.”</div>
          <div class="eq">F<sub>A</sub> = d · V<br><span style="font-size:.85rem;font-weight:500">F<sub>A</sub>: lực đẩy (N) · d: trọng lượng riêng của chất lỏng (N/m³) · V: thể tích phần chất lỏng bị vật chiếm chỗ (m³)</span></div>
          <p class="lead2">Ví dụ từ số đo: vật chìm 80 cm³ = 0,00008 m³ trong nước → F<sub>A</sub> = 10 000 × 0,00008 = 0,8 N; lực kế chỉ 1,3 − 0,8 = 0,5 N.</p>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],i)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`;
      }
    }
    function onBody(e){
      const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}
      switch(d.k){
        case "lock":S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok");break;
        case "lv":goLevel(+d.v);break;
        case "read":card("scale");break;
        case "cupc":card("cup");break;
        case "liq":if(d.v!==S.liq)setLiquid(d.v);break;
        case "deep":if(vsub()<VOBJ-0.5){goLevel(80);api.toast("Đưa vật chìm hẳn trước, rồi bấm lại để hạ sâu thêm.","info")}else{S.armTo=Math.min(ARM_MAX,S.arm+10);S.deep=true;refresh();api.toast("Đã hạ sâu thêm 0,8 cm. So sánh số chỉ lực kế trước và sau.","info")}break;
        case "finish":S.finished=true;refresh();api.done(`<h2>Hoàn thành: Lực đẩy Archimedes</h2><p class="muted">Lực đẩy bằng trọng lượng phần chất lỏng bị vật chiếm chỗ: F<sub>A</sub> = d·V.</p>`);break;
      }
    }


    function frame(dt){frameN++;
      const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      if(S.armTo!=null){const d=S.armTo-S.arm;const v=Math.sign(d)*Math.min(Math.abs(d),70*dt);S.arm+=v;if(Math.abs(d)<.3){S.arm=S.armTo;S.armTo=null}}
      if(sdt>0)step(sdt);
      place();R.render(root,simT);LB.update();drawZoom();
      api.time.label(`t = ${fmt(simT,1)} s · phần chìm ${Math.round(vsub())} cm³${S.flow>0.5?" · nước đang tràn":""}`,vsub()/VOBJ);
      const zc2=document.getElementById("zoomCv");
      if(zc2&&S.cardFor){const r=zc2.getBoundingClientRect(),dpr=Math.min(2.5,window.devicePixelRatio||1);if(zc2.width!==Math.round(r.width*dpr)){zc2.width=Math.round(r.width*dpr);zc2.height=Math.round(r.height*dpr)}
        const g=zc2.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,r.width,r.height);
        if(S.cardFor==="scale")M.drawScaleZoom(g,r.width,r.height,reading(),Q);else M.drawCupZoom(g,r.width,r.height,S.cup,Q,LIQ[S.liq].z);
        const e=document.getElementById("zoomInfo");if(e)e.textContent=S.cardFor==="scale"?`${vLabel()} · ${Math.abs(S.vel)>0.4?"kim đang dao động – chờ đứng yên":"kim đã đứng yên"}`:`Chất lỏng: ${LIQ[S.liq].ten} · phần vật chìm hiện tại ≈ ${Math.round(vsub())} cm³`;
      }else S.cardFor=null}
    theme();layout();home();refreshDock();
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{S.arm=ARM_MIN;S.armTo=null;S.ext=P_W/KSPR*100;S.vel=0;S.W=ACAN*HSP;S.cup=0;simT=0;refresh()});
    vp.__lab={get S(){return S},goLevel,reading,trueRead,vsub,armFor,setLiquid,card,record,refill,geom,R,pick};
    return{step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},layout,prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);api.vp.removeEventListener("click",onVp);api.vp.removeEventListener("keydown",onVpKey);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
