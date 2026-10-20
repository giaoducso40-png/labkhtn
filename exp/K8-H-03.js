/* K8-H-03 · Định luật bảo toàn khối lượng (SGK KHTN 8 – Kết nối tri thức, Bài 5) · bản 3D
   Thí nghiệm SGK: đặt hai cốc (dung dịch barium chloride, dung dịch sodium sulfate) lên cân, đổ cốc này vào cốc kia,
   lắc nhẹ, quan sát chất rắn màu trắng, so sánh tổng khối lượng trước và sau phản ứng.
   - Khối lượng luôn tính từ lượng chất (LabChem.Mix): bảo toàn khối lượng là hệ quả của mô hình, không gán sẵn.
   - Cảnh 3D (LabGL + LabChem3D): cân điện tử có màn hình số, cốc 100 mL có vạch chia; khi rót, mặt thoáng luôn nằm ngang
     và lưu lượng tính từ phần chất lỏng vượt mép cốc; BaSO4 hiện thành đám vẩn đục trắng (trường nồng độ 3D) rồi lắng dần. */
(function(){
"use strict";
const C=window.LabCore,K=window.LabChem,G=window.LabGL,K3=window.LabChem3D;
const fmt=C.fmt,H=G.hex;

/* ---- Số liệu thí nghiệm (xem mục "Nguồn và giả định") ---- */
const CM=0.1;                 /* mol/L, cả hai dung dịch */
const D_A=1.02,D_B=1.01;      /* g/mL, gần đúng */
const GLASS={A:51.84,B:52.37};/* g, cốc 100 mL */
const RESID=0.10;             /* mL dung dịch còn dính thành cốc sau khi rót */
const PRESETS=[{a:25,b:25},{a:20,b:30},{a:30,b:20}];

const ICON_A='<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7h24M10 7v24a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7"/><path d="M10.5 22h19v9a2.5 2.5 0 0 1-2.5 2.5H13A2.5 2.5 0 0 1 10.5 31z" fill="#38BDF8" opacity=".45" stroke="none"/><text x="20" y="18" text-anchor="middle" font-size="9" font-weight="800" fill="currentColor" stroke="none">A</text></svg>';
const ICON_B='<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7h24M10 7v24a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7"/><path d="M10.5 22h19v9a2.5 2.5 0 0 1-2.5 2.5H13A2.5 2.5 0 0 1 10.5 31z" fill="#FACC15" opacity=".45" stroke="none"/><text x="20" y="18" text-anchor="middle" font-size="9" font-weight="800" fill="currentColor" stroke="none">B</text></svg>';

const GV=`<p><b>Yêu cầu cần đạt</b> (CT GDPT 2018, KHTN 8)</p>
<ul class="tlist"><li>Tiến hành được thí nghiệm để chứng minh: trong phản ứng hoá học, khối lượng được bảo toàn.</li><li>Phát biểu được định luật bảo toàn khối lượng.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức (10–15 phút)</b></p>
<ul class="tlist"><li>Bước 1: cả lớp chọn một trong ba phương án, giáo viên ghi số học sinh mỗi phương án lên bảng.</li><li>Bước 2: bật Trình chiếu, mời một học sinh thao tác; chọn 0,25× lúc rót để cả lớp thấy chất rắn trắng xuất hiện.</li><li>Bước 3: làm thêm lần 2 hoặc lần 3 với lượng khác để thấy kết luận không phụ thuộc lượng chất.</li><li>Bước 4: bật kính lúp hạt, đếm nguyên tử trước và sau.</li></ul>
<p style="margin-top:10px"><b>Lỗi học sinh hay gặp</b></p>
<ul class="tlist"><li>Nghĩ có chất rắn sinh ra nên tổng khối lượng tăng.</li><li>Sau khi rót chỉ đặt cốc B lên cân, quên cốc A; cốc A đã được tính trong m₁ và vẫn còn dính dung dịch.</li><li>Viết “khối lượng dung dịch” thay cho “khối lượng các chất phản ứng”.</li></ul>
<p style="margin-top:10px"><b>Có thể thảo luận thêm</b> (chưa dựng trong bản này): phản ứng sinh chất khí trong cốc để hở làm số chỉ cân giảm, dẫn tới khái niệm hệ kín và hệ hở.</p>`;

const SRC=`<ul class="tlist">
<li>SGK KHTN 8 (Kết nối tri thức), Bài 5: thí nghiệm barium chloride và sodium sulfate, phát biểu định luật, ví dụ 20,8 g + 14,2 g → 23,3 g + 11,7 g (đối chiếu qua <a href="https://vndoc.com/dinh-luat-bao-toan-khoi-luong-va-phuong-trinh-hoa-hoc-kntt-355345" target="_blank" rel="noopener">VnDoc</a>).</li>
<li>Yêu cầu cần đạt: CT GDPT 2018 môn KHTN, trích trong <a href="https://hoatieu.vn/powerpoint-khoa-hoc-tu-nhien-8-bai-5-ket-noi-tri-thuc-232392" target="_blank" rel="noopener">kế hoạch bài dạy Bài 5</a>.</li>
<li>Nguyên tử khối theo SGK: Ba 137, Cl 35,5, Na 23, S 32, O 16 → M(BaCl₂) = 208, M(Na₂SO₄) = 142, M(BaSO₄) = 233, M(NaCl) = 58,5 g/mol.</li>
<li>An toàn: BaCl₂·2H₂O theo SDS Merck – H301, H332, H319, hình đồ GHS06 (<a href="https://nextsds.com/sds/en/281331501301667/barium-chloride-dihydrate-for-analysis-emsure-acs-iso-reag-ph-eur" target="_blank" rel="noopener">NextSDS</a>); Na₂SO₄ “không phải chất hoặc hỗn hợp nguy hại” theo <a href="https://deca.upc.edu/en/laboratories/latem/security/reactius-quimics/sodium-sulfate-sigma-aldrich.pdf" target="_blank" rel="noopener">SDS Sigma-Aldrich</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p>
<ul class="tlist"><li>Hai dung dịch 0,1 mol/L; khối lượng riêng lấy gần đúng 1,02 g/mL (BaCl₂) và 1,01 g/mL (Na₂SO₄). Giá trị này chỉ làm thay đổi số chỉ cân, không làm thay đổi kết luận.</li>
<li>Cốc 100 mL nặng 51,84 g (A) và 52,37 g (B); cân Max 500 g, d = 0,01 g; bỏ qua bay hơi trong vài phút làm thí nghiệm.</li>
<li>Sau khi rót, thành cốc A còn dính khoảng 0,1 mL dung dịch.</li>
<li>Kết tủa tạo thành ngay khi hai dung dịch gặp nhau. Đám vẩn đục trắng, tốc độ lắng và độ dày lớp lắng chỉ để minh họa, không định lượng.</li><li>Khi rót: mặt chất lỏng trong cốc nghiêng luôn nằm ngang; lưu lượng tăng theo phần chất lỏng vượt mép cốc (mô hình gần đúng, tối đa khoảng 38 mL/s).</li>
<li>Kính lúp hạt: mỗi hạt vẽ đại diện cho rất nhiều ion thật; không vẽ phân tử nước.</li>
<li>Khối lượng mỗi cốc luôn được tính từ lượng chất (mmol × khối lượng mol) cộng khối lượng nước và cốc; mô hình không gán sẵn số chỉ “sau phản ứng”.</li></ul>`;

LabKHTN.register("K8-H-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"luc",t:"Thời điểm"},{k:"tren",t:"Trên đĩa cân"},{k:"m",t:"Số chỉ",u:"g",num:true}],empty:"Bấm “Ghi số chỉ cân” khi dấu ● trên màn hình cân sáng."},
  gv:GV, sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Bàn thí nghiệm 3D: cân điện tử, cốc A chứa dung dịch barium chloride, cốc B chứa dung dịch sodium sulfate");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,P=K.palette(day),simT=0,frameN=0,bodyEl=null,stepIdx=0;
    const S={trial:null,lan:0,pred:null,why:null,locked:false,lensOn:false,lensTarget:"B",q1:null,q2:null,finished:false,sel:null};
    const bal={on:true,tare:0,shown:0,target:0,stable:true,settle:0,delta:0,text:"0.00",tared:false,shownRaw:null};
    const lens=new K.Lens(11);

    /* ================= kích thước (đơn vị cảnh; cốc 100 mL cao 0,62) ================= */
    const BR=.3,RI=.272,BH=.62,Y0=.03,MLH=.0052,LIPX=BR+.025,LIPY=BH;
    const BAL3={c:[-.45,0,-.2],w:1.75,d:1.3,top:.2875,slots:[-.34,.34]};
    const HOMEL={A:[.95,0,.55],B:[1.68,0,.55]},HOMEP={A:[-.8,0,-1.2],B:[-.1,0,-1.2]};let HOME=HOMEL;
    const root=new G.Node();root.add(K3.bench(R,8.6,4.4,day));

    /* ---------- cân điện tử ---------- */
    const balN=root.add(new G.Node());balN.pos=BAL3.c;
    const bodyM={color:"#323A52",rough:.42,coat:.35};
    balN.add(R.mesh(G.box(BAL3.w,.22,BAL3.d,.05,3),bodyM)).pos=[0,.13,0];
    for(const [x,z] of [[-.75,-.55],[.75,-.55],[-.75,.55],[.75,.55]])balN.add(R.mesh(G.cylinder(.05,.02,16),{color:"#14182A",rough:.6})).pos=[x,0,z];
    balN.add(R.mesh(G.cylinder(.08,.03,20),{color:"#9AA1AE",rough:.3,metal:1})).pos=[0,.24,0];
    balN.add(R.mesh(G.box(1.4,.03,1.06,.012,2),{color:"#7E8794",rough:.55,metal:.75,coat:.1})).pos=[0,.27,0];
    const fcv=document.createElement("canvas");fcv.width=1024;fcv.height=128;const fctx=fcv.getContext("2d");
    const faceTex=R.tex2D(fcv);
    const face=balN.add(R.mesh(G.plane(BAL3.w-.08,.2),{type:"unlit",color:"#FFFFFF",key:"balface",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:faceTex},uniforms:{uDim:.95}}));
    face.pos=[0,.13,BAL3.d/2+.003];face.quat=G.Q.euler(Math.PI/2,0,0);
    const BTN={tare:{x:.5},power:{x:.7}};
    for(const k in BTN){const b=balN.add(R.mesh(G.cylinder(.045,.025,24),{color:k==="power"?"#C2413A":"#5B657C",rough:.35,coat:.4}));b.pos=[BTN[k].x,.105,BAL3.d/2+.002];b.quat=G.Q.euler(Math.PI/2,0,0);BTN[k].n=b}
    const fxOf=x=>(x/(BAL3.w-.08)+.5)*1024;
    let faceKey="";
    function drawFace(){const key=[bal.on,bal.text,bal.stable,bal.tared,day].join("|");if(key===faceKey)return;faceKey=key;
      const g=fctx,W=1024,Hh=128;const gr=g.createLinearGradient(0,0,0,Hh);gr.addColorStop(0,day?"#56607A":"#3A4360");gr.addColorStop(1,day?"#3D4560":"#262D44");g.fillStyle=gr;g.fillRect(0,0,W,Hh);
      const lx=70,ly=18,lw=470,lh=92;g.fillStyle="#061512";C.rr(g,lx,ly,lw,lh,10);g.fill();g.strokeStyle="#5A6690";g.lineWidth=3;C.rr(g,lx,ly,lw,lh,10);g.stroke();
      const lit="#7CFFC9",off="rgba(124,255,201,.07)";
      if(bal.on){g.save();g.shadowColor="#2CFFB0";g.shadowBlur=14;const th=58,tw=C.sevenWidth(bal.text,th);C.seven(g,bal.text,lx+lw-56-tw,ly+17,th,lit,off);g.restore();
        g.fillStyle=lit;g.font="700 30px system-ui,sans-serif";g.fillText("g",lx+lw-40,ly+72);
        g.font="700 26px system-ui,sans-serif";g.fillStyle=bal.stable?lit:"rgba(124,255,201,.25)";g.fillText(bal.stable?"●":"○",lx+14,ly+34);
        if(bal.tared){g.font="800 18px system-ui,sans-serif";g.fillStyle=lit;g.fillText("NET",lx+12,ly+78)}}
      g.fillStyle="#C9D1EA";g.font="600 20px system-ui,sans-serif";g.fillText("Max 500 g   d = 0,01 g",lx+lw+30,52);
      g.font="800 18px system-ui,sans-serif";g.textAlign="center";g.fillText("TARE",fxOf(BTN.tare.x),30);g.fillText("ON/OFF",fxOf(BTN.power.x),30);g.textAlign="left";
      faceTex.update(fcv)}
    const panPos=i=>[BAL3.c[0]+BAL3.slots[i],BAL3.top,BAL3.c[2]];

    /* ---------- cốc thủy tinh 100 mL có vạch chia và nhãn ---------- */
    function arcPatch(r,a0,a1,y0,y1,n){const p=[],nm=[],uv=[],ix=[];for(let i=0;i<=n;i++){const a=a0+(a1-a0)*i/n,s=Math.sin(a),c=Math.cos(a);for(let j=0;j<=1;j++){p.push(r*s,j?y1:y0,r*c);nm.push(s,0,c);uv.push(i/n,j?0:1)}}
      for(let i=0;i<n;i++){const a=i*2,b=a+2;ix.push(a,b,b+1,a,b+1,a+1)}return{pos:new Float32Array(p),nrm:new Float32Array(nm),idx:new Uint16Array(ix),col:null,uv:new Float32Array(uv)}}
    const scv=document.createElement("canvas");scv.width=256;scv.height=512;{const g=scv.getContext("2d");g.clearRect(0,0,256,512);g.fillStyle="#FFFFFF";g.font="700 34px system-ui,sans-serif";
      const ya=Y0,yb=Y0+110*MLH;const cy=v=>(1-((Y0+v*MLH)-ya)/(yb-ya))*512;
      for(let v=10;v<=100;v+=5){const y=cy(v),major=v%10===0;g.fillRect(8,y-2,major?70:42,major?5:3);if(major&&v%20===0)g.fillText(String(v),92,y+12)}
      g.font="800 30px system-ui,sans-serif";g.fillText("mL",92,cy(104)+10)}
    const scaleTex=R.tex2D(scv,{mip:true});
    const scaleGeo=arcPatch(BR+.003,-.95,-.35,Y0,Y0+110*MLH,10);
    function stickerTex(t1,t2,col){const c=document.createElement("canvas");c.width=256;c.height=128;const g=c.getContext("2d");g.fillStyle="#FBFBF7";g.fillRect(0,0,256,128);g.fillStyle=col;g.fillRect(0,0,256,30);
      g.fillStyle="#141A33";g.font="800 46px system-ui,sans-serif";g.textAlign="center";g.fillText(t1,128,80);g.font="600 24px system-ui,sans-serif";g.fillText(t2,128,112);return R.tex2D(c,{mip:true})}
    const LIQ=H("#B4D2F0");
    function makeBeaker(id,name,glass,mix,sticker){
      const node=root.add(new G.Node());
      node.add(K3.glass(R,BR,BH,{lip:.025}));
      const sc=node.add(R.mesh(scaleGeo,{type:"unlit",color:"#FFFFFF",transparent:true,alpha:1,order:3,side:"double",key:"bkscale",hooks:{fu:"uniform sampler2D uTex;uniform vec3 uScInk;",fs:"{vec4 t=texture(uTex,vUV);base=vec4(uScInk,t.a*.9);}"},textures:{uTex:scaleTex},uniforms:{uScInk:[.92,.95,1]}}));
      const st=node.add(R.mesh(arcPatch(BR+.004,-.36,.36,.2,.34,8),{type:"unlit",color:"#FFFFFF",order:2,side:"double",key:"sticker",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:stickerTex(sticker.t1,sticker.t2,sticker.color)},uniforms:{uDim:.9}}));
      const b={id,name,glass,mix,node,sc,st,loc:"home",base:[...HOME[id]],phi:0,piv:null,swirl:null,wob:[0,0],
        mass(){return this.glass+this.mix.mass()},get V(){return this.mix.V}};
      return b}

    /* chất lỏng trong cốc nghiêng: trụ cắt bởi mặt phẳng nằm ngang (mặt thoáng luôn nằm ngang) */
    function clipLiquid(b){const m={color:LIQ,alpha:.3,rough:.04,coat:.5,order:1,side:"double",transparent:true};
      b.side=b.node.add(R.mesh(G.merge([G.lathe([[RI,Y0],[RI,BH-.004]],48),G.disk(RI,Y0,48,false)]),Object.assign({},m)));
      b.surf=b.node.add(R.mesh(G.disk(RI,0,48,true),Object.assign({},m,{alpha:.5})))}
    const GRID=(()=>{const N=18,xs=[];const d=2*RI/N;for(let i=0;i<N;i++)for(let k=0;k<N;k++){const x=-RI+(i+.5)*d,z=-RI+(k+.5)*d;if(x*x+z*z<=RI*RI)xs.push(x)}return{xs,A:xs.length*d*d}})();
    /* thể tích (mL) nằm dưới mặt phẳng y = piv.y + hRel khi cốc quay góc phi quanh mép rót */
    function volBelow(hRel,phi){const s=Math.sin(phi),c=Math.max(.05,Math.cos(phi));let v=0;for(const x of GRID.xs){const yt=LIPY+(hRel-s*(x-LIPX))/c;v+=Math.max(0,Math.min(yt,BH)-Y0)}return v*GRID.A/GRID.xs.length/(GRID.A*MLH)}
    function levelRel(V,phi){let lo=-1.4,hi=0;for(let i=0;i<26;i++){const m=(lo+hi)/2;if(volBelow(m,phi)<V)lo=m;else hi=m}return(lo+hi)/2}
    const rotZ=(v,a)=>[v[0]*Math.cos(a)-v[1]*Math.sin(a),v[0]*Math.sin(a)+v[1]*Math.cos(a),v[2]];

    /* ---------- dung dịch có kết tủa (cốc B): trường độ đục 3D, dò tia trong shader ---------- */
    const FN=[16,10,16];
    let A,B,beakers=[],tweens=[],pour=null,sedU=0;
    const field=K3.DyeField(...FN),fTex=R.tex3D(...FN);
    const L0=Y0+25*MLH;
    function waterOf(b){b.water=b.node.add(K3.waterVolume(R,RI,BH,L0,fTex,{orig:[0,0,0],k:24,a0:.2,dyeCol:[.94,.95,.97],water:H("#A9CBEE")}));
      b.sed=b.node.add(R.mesh(G.cylinder(RI-.012,1,40),{color:"#F4F5F7",rough:.95}));b.sed.pos=[0,Y0,0];b.sed.visible=false}

    /* ---------- dòng chảy khi rót ---------- */
    const stream=root.add(R.mesh(G.cylinder(1,1,12,false),{type:"glass",color:"#EAF4FF",alpha:.75}));stream.visible=false;

    /* ---------- kính lúp hạt (lớp vẽ 2D phủ lên cảnh) ---------- */
    const lcv=document.createElement("canvas");lcv.className="gl-lens";over.appendChild(lcv);const lctx=lcv.getContext("2d");lcv.hidden=true;

    /* ---------- nhãn, menu ngữ cảnh ---------- */
    const LB=G.labels(over,R,{bounds:api.safe});
    const tagA=LB.add(`<span></span>`,()=>tagPos(A)),tagB=LB.add(`<span></span>`,()=>tagPos(B));
    const homeL=LB.add(`<span>Khu chuẩn bị</span>`,()=>[(HOME.A[0]+HOME.B[0])/2,.02,HOME.A[2]+(HOME===HOMEP?-.42:.42)],"plain");
    function tagPos(b){const p=worldBase(b);return[p[0],p[1]+BH+.12,p[2]]}
    const menu=document.createElement("div");menu.className="gl-menu";menu.hidden=true;over.appendChild(menu);

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:.05,maxPitch:1.35});
    const PREL={t:[.4,.36,.2],yaw:-.06,pitch:.5,rad:1.32},PREP={t:[-.45,.38,-.55],yaw:0,pitch:.55,rad:1.05};let PRE=PREL;
    let safe={x:0,y:0,w:1,h:1},zoom=1;
    function fitDist(rad){const s=R.size();const tv=Math.tan(cam.fov/2)*safe.h/s.h,th=Math.tan(cam.fov/2)*(s.w/s.h)*safe.w/s.w;return rad/Math.min(tv,th)}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));safe=api.safe();const s=R.size();cam.shift=[2*(safe.x+safe.w/2)/s.w-1,1-2*(safe.y+safe.h/2)/s.h];
      const port=s.w<s.h*.9;if(port!==(PRE===PREP)){PRE=port?PREP:PREL;HOME=port?HOMEP:HOMEL;for(const b of beakers)if(b.loc==="home")b.base=[...HOME[b.id]];home()}
      cam.dist=fitDist(PRE.rad)*zoom;const d=Math.min(2,window.devicePixelRatio||1);lcv.width=Math.round(r.width*d);lcv.height=Math.round(r.height*d);lcv.style.width=r.width+"px";lcv.style.height=r.height+"px";lcv._d=d}
    function home(){Object.assign(cam,{target:[...PRE.t],yaw:PRE.yaw,pitch:PRE.pitch,dist:fitDist(PRE.rad)*zoom})}
    function theme(){day=api.day;P=K.palette(day);const E=R.env;
      if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=.55}
      else{E.bgTop=H("#1B2347");E.bgBot=H("#06091A");E.bgGlow=H("#2B3670");E.sky=H("#6070A0");E.gnd=H("#171B2B");E.hor=H("#3E4868");E.exposure=.8;E.ink=0}
      E.k1c=[2.1,2.0,1.85];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9];
      for(const b of beakers){b.sc.mat.uniforms.uScInk=day?[.1,.14,.3]:[.92,.95,1];b.st.mat.uniforms.uDim=day?1:.88}
      face.mat.uniforms.uDim=day?1:.95;faceKey="";over.classList.toggle("day",day)}

    /* ================= vị trí cốc ================= */
    const onPan=b=>b.loc==="pan0"||b.loc==="pan1";
    const panFree=i=>!beakers.some(b=>b.loc==="pan"+i||b.dest==="pan"+i);
    const locPos=(loc,id)=>loc==="pan0"||loc==="pan1"?panPos(+loc[3]):[...HOME[id]];
    function worldBase(b){if(b.piv){const o=rotZ([LIPX,LIPY,0],b.phi);return[b.piv[0]-o[0],b.piv[1]-o[1],b.piv[2]]}return[b.base[0]+b.wob[0],b.base[1],b.base[2]+b.wob[1]]}
    function moveTo(b,loc,done){const to=locPos(loc,b.id);b.dest=loc;b.loc="move";tweens=tweens.filter(t=>t.b!==b);
      tweens.push({b,from:[...b.base],to,t:0,dur:.55,arc:.38,done:()=>{b.loc=loc;b.dest=null;done&&done();refresh()}});closeMenu()}

    /* ================= lần thí nghiệm ================= */
    function newTrial(pi){
      const pr=PRESETS[pi];S.lan++;
      S.trial={pi,lan:S.lan,a:pr.a,b:pr.b,m1:null,m2:null,reacted:false,poured:false,swirled:false,settled:0};
      if(!A){A=makeBeaker("A","Cốc A",GLASS.A,null,{t1:"BaCl₂",t2:"0,1 mol/L · A",color:"#38BDF8"});clipLiquid(A);
        B=makeBeaker("B","Cốc B",GLASS.B,null,{t1:"Na₂SO₄",t2:"0,1 mol/L · B",color:"#FACC15"});waterOf(B);beakers=[A,B]}
      A.mix=K.Mix.solution("BaCl2",CM,pr.a,D_A);B.mix=K.Mix.solution("Na2SO4",CM,pr.b,D_B);
      for(const b of beakers){b.loc="home";b.dest=null;b.base=[...HOME[b.id]];b.piv=null;b.phi=0;b.swirl=null;b.wob=[0,0]}tweens=[];pour=null;simT=0;bal.tare=0;bal.tared=false;sedU=0;field.clear();fTex.update(field.bytes());
      lens.reset();lens.inflow=false;S.sel=null;closeMenu();theme();refresh()}

    /* ================= cân ================= */
    function gross(){let s=0;for(const b of beakers)if(onPan(b))s+=b.mass();return s}
    let pendingRec=false;
    function balUpdate(dt){
      if(!bal.on){bal.text="";return}
      const tgt=Math.round((gross()-bal.tare)*100)/100;
      if(Math.abs(tgt-bal.target)>0.004){bal.delta=(bal.shownRaw!=null?bal.shownRaw:bal.target)-tgt;bal.target=tgt;bal.settle=0;bal.stable=false}
      bal.settle+=dt;const off=bal.delta*Math.exp(-7*bal.settle)*Math.cos(19*bal.settle);bal.shownRaw=bal.target+off;
      if(!bal.stable&&bal.settle>1.0){bal.stable=true;bal.shownRaw=bal.target;if(pendingRec){pendingRec=false;setTimeout(record,0)}}
      const v=bal.stable?bal.target:Math.round(bal.shownRaw*100)/100;bal.shown=v;bal.text=(Object.is(v,-0)?0:v).toFixed(2)}
    function tare(){if(!bal.on)return;bal.tare=gross();bal.tared=Math.abs(bal.tare)>.004;api.toast(bal.tared?"Đã trừ bì: cân hiện 0,00 g với những gì đang trên đĩa.":"Đã đưa cân về 0,00 g.","info")}
    function power(){bal.on=!bal.on;if(bal.on){bal.stable=false;bal.settle=0;bal.delta=0}}

    /* ================= rót ================= */
    function startPour(b,T,origin){
      if(pour)return;
      if(b.V<=RESID+.05){api.toast(`${b.name} đã rỗng.`,"info");return}
      if(T.V+b.V>98){api.toast("Cốc nhận sẽ quá đầy.","warn");return}
      if(b.loc==="move"||T.loc==="move")return;
      closeMenu();
      const tb=worldBase(T);const target=[tb[0]-BR+.13,tb[1]+BH+.07,tb[2]];
      const from=V3add(worldBase(b),[LIPX,LIPY,0]);
      b.piv=[...from];b.phi=0;b.loc="pour";
      pour={b,T,origin,ph:"approach",k:0,from,to:target,Q:0};
      if(S.lensOn&&S.lensTarget===T.id)lens.inflow=true;refresh()}
    const V3add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]];
    function approachStep(dt){if(!pour||pour.ph!=="approach")return;const b=pour.b;pour.k=Math.min(1,pour.k+dt/.7);const k=C.ease.inOut(pour.k);
      b.piv=[C.lerp(pour.from[0],pour.to[0],k),C.lerp(pour.from[1],pour.to[1],k)+Math.sin(Math.PI*k)*.35,C.lerp(pour.from[2],pour.to[2],k)];b.phi=-.5*k;if(pour.k>=1)pour.ph="tilt"}
    function pourStep(dt){if(!pour)return;const {b,T}=pour;
      if(pour.ph==="tilt"){
        /* chia nhỏ bước thời gian để dòng chảy ổn định khi chạy nhanh */
        const n=Math.max(1,Math.ceil(dt/.02)),h=dt/n;
        for(let i=0;i<n;i++){
          const cap=volBelow(0,b.phi),ex=b.V-cap;const Q=ex>0?Math.min(38,4.2*ex):0;pour.Q=Q;
          b.phi=Math.max(-1.97,b.phi-(Q>.2?22:70)*Math.PI/180*h);
          let dV=Q*h;if(b.V-dV<RESID)dV=Math.max(0,b.V-RESID);
          if(dV>0){const o=b.mix.take(dV);T.mix.add(o);const xi=T.mix.react();if(xi>0){S.trial.reacted=true;spawnPpt(T,xi)}}
          if(b.V<=RESID+1e-6||(b.phi<=-1.96&&Q<.05)){pour.ph="back";pour.Q=0;b.wet=1;S.trial.poured=true;lens.inflow=false;refresh();break}}}
      else if(pour.ph==="back"){b.phi=Math.min(0,b.phi+Math.PI*1.1*dt);
        if(b.phi>=0){const base=worldBase(b);b.piv=null;b.phi=0;b.base=base;const o=pour.origin;pour=null;moveTo(b,o==="pan0"||o==="pan1"?(panFree(+o[3])?o:"home"):"home")}}}
    function landPoint(){const b=pour.b,T=pour.T;const tb=worldBase(T);return[b.piv[0]+.03+.008*Math.sqrt(pour.Q),tb[1]+Y0+T.V*MLH,b.piv[2]]}
    function spawnPpt(T,xi){if(T!==B)return;const lp=landPoint(),tb=worldBase(T);const u=(lp[0]-tb[0])/(2*RI)+.5,w=(lp[2]-tb[2])/(2*RI)+.5;
      const uu=C.clamp(u,.1,.9);for(const [v,k,r] of [[.88,4,.2],[.62,4,.24],[.36,3,.26],[.14,2,.28]])field.add(C.clamp(uu+(.88-v)*.25,.1,.9),v,w,xi*k,r)}
    function swirlB(){if(!B||B.V<1){api.toast("Cốc này chưa có dung dịch để lắc.","info");return}if(B.loc==="move"||pour&&pour.T===B&&pour.ph!=="back")return;B.swirl={t:0,dur:1.8};if(S.trial.reacted){S.trial.swirled=true;refresh()}closeMenu()}
    function stepField(dt,rdt){const sw=!!(B&&B.swirl),jet=!!(pour&&pour.T===B&&pour.Q>.2);field.step(dt,sw?3.2:jet?2.4:.35,sw||jet?0:.12);const c=field.c,N=c.length,nx=FN[0],ny=FN[1];
      if(sw){const r=Math.min(sedU,sedU*2.5*rdt);sedU-=r;const add=r/N;for(let q=0;q<N;q++)c[q]+=add}
      else{const k=Math.min(1,.22*dt);for(let kk=0;kk<FN[2];kk++)for(let i=0;i<nx;i++){const q=(kk*ny)*nx+i;const m=c[q]*k;c[q]-=m;sedU+=m}}
      let tot=0;for(let q=0;q<N;q++)tot+=c[q];const frac=sedU+tot>1e-9?sedU/(sedU+tot):0;B.mix.settleTo(frac);if(S.trial)S.trial.settled=S.trial.reacted?frac:0;
      if(frameN%2===0)fTex.update(field.bytes())}

    /* ================= ghi số đo ================= */
    function where(){const on=beakers.filter(onPan).map(b=>b.id).sort();return on.length===2?"Cốc A + cốc B":on.length===1?("Chỉ cốc "+on[0]):"Đĩa trống"}
    function record(){
      if(!bal.on){api.toast("Cân đang tắt. Bấm nút ON/OFF trên cân.","warn");return}
      if(tweens.length){api.toast("Đặt cốc xuống xong rồi mới ghi số chỉ.","warn");return}
      if(pour){api.toast("Đang rót. Ghi sau khi rót xong.","warn");return}
      if(!bal.stable){if(!pendingRec){pendingRec=true;api.toast("Đang chờ số chỉ ổn định (dấu ●)… sẽ tự ghi.","info",1800)}return}
      const both=beakers.every(onPan);const T=S.trial;const luc=T.reacted?"Sau phản ứng":"Trước phản ứng";const val=bal.shown;
      api.record({lan:String(T.lan),luc,tren:where()+(bal.tared?" (đã trừ bì)":""),m:fmt(val,2)});
      if(both&&!bal.tared){if(!T.reacted){T.m1=val;api.toast(`Đã ghi m₁ = ${fmt(val,2)} g`,"ok")}else if(T.poured){T.m2=val;api.toast(`Đã ghi m₂ = ${fmt(val,2)} g`,"ok")}}
      else if(!both&&T.reacted)api.toast("Trên cân chưa đủ hai cốc. Đặt cả cốc A trở lại cân: cốc A đã được cân lúc đầu và vẫn còn dính dung dịch.","warn",6000);
      else if(bal.tared)api.toast("Cân đang trừ bì nên số chỉ không phải tổng khối lượng. Bấm TARE khi đĩa trống để đưa về 0.","warn",6000);
      closeMenu();refresh()}

    /* ================= thao tác ================= */
    const act={
      placeBoth(){if(A.loc==="home")moveTo(A,panFree(0)?"pan0":"pan1");if(B.loc==="home")moveTo(B,panFree(1)?"pan1":"pan0")},
      record,
      pour(){if(pour||A.loc==="move"||B.loc==="move")return;if(A.V<=RESID+.05){api.toast("Cốc A đã rót xong.","info");return}startPour(A,B,A.loc)},
      swirl(){swirlB()},
      returnA(){if(A.loc==="home")moveTo(A,panFree(0)?"pan0":"pan1")},
      lens(){S.lensOn=!S.lensOn;lens.reset();lcv.hidden=!S.lensOn;refreshDock();refresh()},
      trial(i){newTrial(i);api.toast(`Bắt đầu lần ${S.lan}: ${PRESETS[i].a} mL dung dịch A, ${PRESETS[i].b} mL dung dịch B.`,"info")}
    };
    function toggleLoc(b){if(b.loc==="home")moveTo(b,panFree(b.id==="A"?0:1)?(b.id==="A"?"pan0":"pan1"):(panFree(0)?"pan0":"pan1"));else if(onPan(b))moveTo(b,"home")}

    /* menu ngữ cảnh: chạm vào vật để thấy thao tác */
    let menuAnchor=null;
    function openMenu(kind,b){S.sel=kind==="bal"?"bal":b.id;const it=[];
      if(kind==="bal"){it.push(["rec","Ghi số chỉ cân",1],["tare","TARE (trừ bì)"],["pow",bal.on?"Tắt cân":"Bật cân"],["cardBal","Thông tin cân"]);menuAnchor=()=>[BAL3.c[0]-.2,.36,BAL3.c[2]+BAL3.d/2]}
      else{if(!pour){if(b.loc==="home")it.push(["place","Đặt lên cân",1]);else if(onPan(b))it.push(["home","Cất về khu chuẩn bị"])}
        if(b===A&&A.V>RESID+.05&&!pour)it.push(["pour","Rót vào cốc B",1]);if(b===B&&B.V>1)it.push(["swirl","Lắc nhẹ"]);
        if(S.lensOn)it.push(["lensT","Soi bằng kính lúp"]);it.push(["card","Thông tin"]);menuAnchor=()=>tagPos(b)}
      menu.innerHTML=it.map(([k,t,m])=>`<button data-m="${k}" class="${m?"main":""}">${t}</button>`).join("");menu.hidden=false;placeMenu()}
    function closeMenu(){menu.hidden=true;S.sel=null;menuAnchor=null}
    function placeMenu(){if(menu.hidden||!menuAnchor)return;const q=R.project(menuAnchor());if(q.behind){menu.hidden=true;return}const w=menu.offsetWidth,s=R.size();
      menu.style.left=C.clamp(q.x,w/2+8,s.w-w/2-8)+"px";menu.style.top=Math.max(menu.offsetHeight+8,q.y-28)+"px"}
    menu.addEventListener("click",e=>{const t=e.target.closest("[data-m]");if(!t)return;const k=t.dataset.m;const b=S.sel==="A"?A:S.sel==="B"?B:null;
      if(k==="rec")record();else if(k==="tare"){tare();closeMenu()}else if(k==="pow"){power();closeMenu()}else if(k==="cardBal"){closeMenu();showBalanceCard()}
      else if(k==="place"&&b){toggleLoc(b)}else if(k==="home"&&b){moveTo(b,"home")}else if(k==="pour")act.pour();else if(k==="swirl")act.swirl();
      else if(k==="lensT"&&b){S.lensTarget=b.id;lens.reset();closeMenu();api.toast(`Kính lúp đang nhìn vào ${b.name}.`,"info")}else if(k==="card"&&b){closeMenu();showChemCard(b)}});

    function pick(px,py){const r=R.ray(px,py);
      const bc=BAL3.c,fz=bc[2]+BAL3.d/2;
      for(const k in BTN){const p=[bc[0]+BTN[k].x,.105,fz+.01];if(G.hit.sphere(r,p,.07)!=null)return{btn:k}}
      let best=null,bt=1e9;for(const b of beakers){if(b.loc==="pour"||b.loc==="move")continue;const p=worldBase(b);const t=G.hit.box(r,[p[0]-BR-.02,p[1],p[2]-BR-.02],[p[0]+BR+.02,p[1]+BH+.03,p[2]+BR+.02]);if(t!=null&&t<bt){bt=t;best={b}}}
      if(best)return best;
      if(G.hit.box(r,[bc[0]-BAL3.w/2,0,bc[2]-BAL3.d/2],[bc[0]+BAL3.w/2,.3,bc[2]+BAL3.d/2])!=null)return{bal:1};
      return null}
    const ptr=C.pointer(cv,{down(p,e){orbit.start(p,e.pointerId);return true},move(p,e){orbit.move(p,e.pointerId)},up(p,e,tap){orbit.end(e.pointerId);if(tap)onTap(p)},cancel(){orbit.end()},
      hover(p){if(frameN%3)return;cv.style.cursor=pick(p.x,p.y)?"pointer":"grab"}});
    function onWheel(e){e.preventDefault();zoom=C.clamp(zoom*Math.exp(e.deltaY*.0012),.45,2.4);cam.dist=fitDist(PRE.rad)*zoom}
    cv.addEventListener("wheel",onWheel,{passive:false});
    function onTap(p){const k=pick(p.x,p.y);if(!k){closeMenu();return}
      if(k.btn==="tare"){tare();return}if(k.btn==="power"){power();return}
      if(k.bal){if(S.sel==="bal")closeMenu();else openMenu("bal");return}
      if(k.b){if(S.lensOn&&S.sel===k.b.id){S.lensTarget=k.b.id;lens.reset()}if(S.sel===k.b.id){closeMenu();return}openMenu("b",k.b)}}

    /* ================= thẻ thông tin ================= */
    function showChemCard(b){
      const isA=b.id==="A";const m=b.mix;
      const parts=Object.entries(m.n).filter(([k,v])=>v>1e-6).map(([k,v])=>`${K.SP[k].f} ${fmt(v,2)} mmol`).concat(Object.entries(m.susp).concat(Object.entries(m.sed)).filter(([k,v])=>v>1e-6).map(([k,v])=>`${K.SP[k].f} (rắn) ${fmt(v,2)} mmol`));
      const safety=isA?`<div class="ghs">${C.ghs("GHS06")}<div><b>Độc nếu nuốt</b> (H301), có hại nếu hít (H332), gây kích ứng mắt nghiêm trọng (H319) – theo SDS của BaCl₂ rắn. Dung dịch loãng vẫn không được nếm, ngửi trực tiếp; đeo kính, găng; rửa tay sau thí nghiệm.</div></div>`
        :`<div class="callout ok" style="margin-top:12px">Na₂SO₄ không phải chất nguy hại theo GHS (SDS Sigma-Aldrich). Vẫn đeo kính khi rót, lau ngay nếu đổ ra bàn.</div>`;
      api.card(`<h3>${b.name}: ${isA?"dung dịch barium chloride":"dung dịch sodium sulfate"}</h3>
        <p class="sub">${isA?"BaCl₂ · M = 137 + 2 × 35,5 = 208 g/mol":"Na₂SO₄ · M = 2 × 23 + 32 + 4 × 16 = 142 g/mol"}</p>
        <dl><dt>Nồng độ ban đầu</dt><dd>0,1 mol/L, không màu</dd><dt>Thể tích hiện có</dt><dd>${fmt(b.V,1)} mL</dd><dt>Chất trong cốc</dt><dd>${parts.join("; ")||"—"}</dd><dt>Khối lượng cốc</dt><dd>${fmt(b.glass,2)} g (cốc rỗng)</dd></dl>${safety}`)}
    function showBalanceCard(){api.card(`<h3>Cân điện tử</h3><p class="sub">Max 500 g · d = 0,01 g (độ chia nhỏ nhất)</p>
      <ul class="tlist" style="margin-top:10px"><li>Đặt vật vào giữa đĩa cân, chờ dấu <b>●</b> trên màn hình sáng rồi mới đọc.</li><li><b>TARE</b> (trừ bì): đưa số chỉ về 0 với những gì đang trên đĩa. Bài này không cần trừ bì; nếu đã bấm, nhấc hết cốc ra rồi bấm TARE lần nữa.</li><li>Màn hình cân dùng dấu chấm thập phân (154.96); khi ghi vào bảng viết 154,96 g.</li></ul>`)}

    /* ================= khay ================= */
    function refreshDock(){
      api.dock.innerHTML=`<button class="titem" data-k="cardA">${ICON_A}Cốc A<br>BaCl₂</button><button class="titem" data-k="cardB">${ICON_B}Cốc B<br>Na₂SO₄</button><button class="titem" data-k="cardBal">${C.ICONS.balance}Cân<br>điện tử</button><button class="titem" data-k="lens" aria-pressed="${S.lensOn}">${C.ICONS.lens}Kính lúp<br>hạt</button><button class="titem" data-k="view">${'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 20a14 8 0 0 0 28 0 14 8 0 0 0-28 0z"/><circle cx="20" cy="20" r="4"/></svg>'}Góc nhìn<br>ban đầu</button>`}
    function onDock(e){const t=e.target.closest("[data-k]");if(!t)return;const k=t.dataset.k;
      if(k==="cardA")showChemCard(A);else if(k==="cardB")showChemCard(B);else if(k==="cardBal")showBalanceCard();else if(k==="lens")act.lens();else if(k==="view"){zoom=1;orbit.fly({target:PRE.t,yaw:PRE.yaw,pitch:PRE.pitch,dist:fitDist(PRE.rad)},.8)}}
    api.dock.addEventListener("click",onDock);

    /* ================= hướng dẫn theo bước ================= */
    function trialDone(T){return T&&T.m1!=null&&T.m2!=null}
    let doneTrials=[];
    function refresh(){
      if(S.trial&&trialDone(S.trial)&&!doneTrials.some(t=>t.lan===S.trial.lan))doneTrials.push({...S.trial});
      api.okAt(0,S.locked);api.okAt(1,doneTrials.length>0);api.okAt(2,doneTrials.length>0);api.okAt(3,S.finished);
      if(bodyEl)renderStep()}
    function renderStep(){
      const el=bodyEl;if(!el)return;
      const T=S.trial;
      const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      if(stepIdx===0){
        const o=[["tang","Tăng lên"],["giam","Giảm đi"],["khong","Không đổi"]];
        const w=[["moi","Có chất rắn mới sinh ra"],["mat","Có chất mất đi"],["xep","Các nguyên tử chỉ sắp xếp lại"],["chua","Em chưa chắc"]];
        el.innerHTML=`<h3>Dự đoán trước khi làm</h3>
          <p class="lead2">Cốc A chứa dung dịch <b>barium chloride</b>, cốc B chứa dung dịch <b>sodium sulfate</b>. Em đặt cả hai cốc lên cân, rồi đổ cốc A vào cốc B. Hai chất phản ứng với nhau. Sau đó đặt lại cả hai cốc lên cân. Số chỉ của cân sẽ:</p>
          <div class="opts">${o.map(([k,t],i)=>`<button class="opt" data-pred="${k}" aria-pressed="${S.pred===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          <p class="lead2">Vì sao em nghĩ vậy?</p>
          <div class="chipset">${w.map(([k,t])=>`<button data-why="${k}" aria-pressed="${S.why===k}" ${S.locked?"disabled":""}>${t}</button>`).join("")}</div>
          ${S.locked?`<div class="callout ok">Em đã chốt: <b>${o.find(x=>x[0]===S.pred)[1]}</b>. Bấm <b>Bước tiếp</b> để làm thí nghiệm.</div>`:`<button class="btn main" data-k="lock" ${S.pred?"":"disabled"}>Chốt dự đoán</button>`}
          ${gvTip("cho cả lớp giơ tay theo ba phương án và ghi số lượng lên bảng trước khi chốt.")}`;
      }else if(stepIdx===1){
        const both=beakers.every(onPan);
        const items=[
          [both||T.m1!=null,"Đặt cốc A và cốc B lên đĩa cân.",`<button class="btn sm" data-k="place">Đặt hai cốc lên cân</button>`,"Hoặc chạm vào từng cốc rồi chọn “Đặt lên cân”."],
          [T.m1!=null,"Chờ dấu ● trên cân sáng, ghi khối lượng trước phản ứng m₁.",`<button class="btn sm" data-k="rec">Ghi số chỉ cân</button>`,""],
          [T.reacted&&T.poured,"Đổ cốc A vào cốc B.",`<button class="btn sm" data-k="pour">Rót cốc A vào cốc B</button>`,"Hoặc chạm vào cốc A rồi chọn “Rót vào cốc B”."],
          [T.swirled,"Lắc nhẹ cốc B cho hai dung dịch trộn đều.",`<button class="btn sm" data-k="swirl">Lắc nhẹ cốc B</button>`,"Hoặc chạm vào cốc B rồi chọn “Lắc nhẹ”."],
          [T.m2!=null,"Đặt cốc A trở lại đĩa cân, ghi khối lượng sau phản ứng m₂.",`<button class="btn sm" data-k="retA">Đặt cốc A lên cân</button> <button class="btn sm" data-k="rec">Ghi số chỉ cân</button>`,""]];
        let nowSet=false;
        el.innerHTML=`<h3>Làm thí nghiệm · lần ${T.lan}</h3>
          <p class="lead2">Cốc A: ${T.a} mL BaCl₂ 0,1 mol/L · Cốc B: ${T.b} mL Na₂SO₄ 0,1 mol/L</p>
          <ol class="todo">${items.map(([d,t,b,h],i)=>{const now=!d&&!nowSet;if(now)nowSet=true;return`<li class="${d?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${t}${now&&h?`<div class="muted" style="font-size:.82rem;margin-top:2px">${h}</div>`:""}${now||!d?`<div class="act">${b}</div>`:""}</div></li>`}).join("")}</ol>
          ${trialDone(T)?`<div class="callout ok">Đã có m₁ và m₂ của lần ${T.lan}. Bấm <b>Bước tiếp</b> để so sánh.</div>`:""}
          <div class="callout warn"><b>An toàn:</b> barium chloride độc nếu nuốt. Ở phòng thí nghiệm thật: đeo kính, găng; không nếm, ngửi; thu chất thải vào bình riêng theo hướng dẫn của giáo viên.</div>
          <p class="muted" style="font-size:.84rem">Mẹo: chọn <b>0,25×</b> ở thanh thời gian để rót chậm và nhìn rõ chất rắn trắng xuất hiện.</p>
          ${gvTip("dừng hình (phím cách) đúng lúc dòng dung dịch chạm cốc B để hỏi lớp: em thấy gì?")}`;
      }else if(stepIdx===2){
        const last=doneTrials[doneTrials.length-1];
        const left=PRESETS.map((p,i)=>i).filter(i=>!doneTrials.some(t=>t.pi===i)&&!(S.trial&&S.trial.pi===i&&!trialDone(S.trial)));
        el.innerHTML=`<h3>Quan sát và so sánh</h3>
          ${T.reacted?`<div class="callout"><b>Hiện tượng:</b> khi dung dịch A chảy vào cốc B, xuất hiện chất rắn <b>màu trắng</b> làm dung dịch vẩn đục. Đó là barium sulfate (BaSO₄), hầu như không tan trong nước; để lâu sẽ lắng xuống đáy cốc (chọn 4× để xem nhanh).</div>`:`<div class="callout">Chưa rót cốc A vào cốc B ở lần này.</div>`}
          ${last?`<div class="cmp"><div class="v"><small>m₁ · trước</small><b>${fmt(last.m1,2)} g</b></div><span class="op">${Math.abs(last.m1-last.m2)<.005?"=":"≠"}</span><div class="v"><small>m₂ · sau</small><b>${fmt(last.m2,2)} g</b></div></div>
          <p class="lead2">Lần ${last.lan} (${last.a} mL A + ${last.b} mL B): tổng khối lượng trước và sau phản ứng ${Math.abs(last.m1-last.m2)<.005?"<b>bằng nhau</b>":"khác nhau – kiểm tra lại các cốc trên cân"}.</p>`:`<div class="callout warn">Chưa có cặp m₁, m₂ nào. Quay lại bước 2 để ghi đủ hai số chỉ.</div>`}
          ${doneTrials.length>1?`<p class="lead2">Đã làm ${doneTrials.length} lần: ${doneTrials.map(t=>`lần ${t.lan}: ${fmt(t.m1,2)} → ${fmt(t.m2,2)} g`).join("; ")}.</p>`:""}
          ${left.length?`<p class="lead2"><b>Làm thêm với lượng khác</b> để kiểm tra kết luận:</p><div class="chipset">${left.map(i=>`<button data-trial="${i}">${PRESETS[i].a} mL A + ${PRESETS[i].b} mL B</button>`).join("")}</div>`:""}
          <button class="btn sm" data-k="lens">${S.lensOn?"Tắt kính lúp hạt":"Nhìn ở cấp độ hạt (kính lúp)"}</button>
          ${gvTip("hỏi lớp: chất rắn trắng ở đâu ra? Nếu khối lượng không đổi thì chất rắn được tạo từ đâu?")}`;
      }else{
        const pr=S.pred;const right=pr==="khong";
        const last=doneTrials[doneTrials.length-1];
        let massRow="";
        if(last){const nA=CM*last.a,nB=CM*last.b,x=Math.min(nA,nB);
          const mBa=x*208/1000,mNa=x*142/1000,mS=x*233/1000,mCl=x*2*58.5/1000;
          massRow=`<p class="lead2">Với lần ${last.lan}, lượng đã phản ứng là ${fmt(x,1)} mmol mỗi chất${nA!==nB?` (chất ${nA<nB?"BaCl₂":"Na₂SO₄"} hết trước, chất kia còn dư và không đổi khối lượng)`:""}:</p>
            <div class="eq" style="font-size:.95rem">${fmt(mBa,4)} g + ${fmt(mNa,4)} g = ${fmt(mBa+mNa,4)} g<br>${fmt(mS,4)} g + ${fmt(mCl,4)} g = ${fmt(mS+mCl,4)} g</div>`}
        el.innerHTML=`<h3>Giải thích</h3>
          ${pr?`<div class="callout ${right?"ok":"bad"}">Em dự đoán: <b>${{tang:"tăng lên",giam:"giảm đi",khong:"không đổi"}[pr]}</b>. Kết quả: <b>không đổi</b>. ${right?"Dự đoán đúng.":pr==="tang"?"Chất rắn trắng không từ ngoài vào: nó được tạo từ chính các nguyên tử Ba, S, O đã có sẵn trong hai dung dịch.":"Không có chất nào thoát ra khỏi hai cốc, nên không có khối lượng nào mất đi."}</div>`:""}
          <div class="eq">barium chloride + sodium sulfate → barium sulfate + sodium chloride<br>BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl</div>
          <table class="atoms"><thead><tr><th>Nguyên tử</th><th>Trước (BaCl₂ + Na₂SO₄)</th><th>Sau (BaSO₄ + 2NaCl)</th></tr></thead><tbody>
          ${[["Ba",1,1],["Cl",2,2],["Na",2,2],["S",1,1],["O",4,4]].map(r=>`<tr><td>${r[0]}</td><td class="num">${r[1]}</td><td class="num">${r[2]}</td></tr>`).join("")}</tbody></table>
          <div class="callout"><b>Định luật bảo toàn khối lượng</b> (SGK): “Trong một phản ứng hoá học, tổng khối lượng của các chất sản phẩm bằng tổng khối lượng các chất tham gia phản ứng.” Trong phản ứng chỉ có liên kết giữa các nguyên tử thay đổi, số nguyên tử của mỗi nguyên tố giữ nguyên.</div>
          <div class="eq">m<sub>BaCl₂</sub> + m<sub>Na₂SO₄</sub> = m<sub>BaSO₄</sub> + m<sub>NaCl</sub></div>
          ${massRow}
          <p class="lead2"><b>Câu 1.</b> Cho 20,8 g BaCl₂ phản ứng vừa đủ với 14,2 g Na₂SO₄, thu được 23,3 g BaSO₄. Khối lượng NaCl tạo thành là bao nhiêu gam?</p>
          <div class="numin"><input id="q1" inputmode="decimal" placeholder="?" value="${S.q1v||""}" aria-label="Khối lượng NaCl (g)"><span>g</span><button class="btn sm" data-k="q1">Kiểm tra</button></div>
          ${S.q1===true?`<div class="callout ok">Đúng: 20,8 + 14,2 − 23,3 = 11,7 g.</div>`:S.q1===false?`<div class="callout bad">Chưa đúng. Gợi ý: tổng khối lượng hai chất tham gia bằng tổng khối lượng hai sản phẩm.</div>`:""}
          <p class="lead2"><b>Câu 2.</b> Vì sao tổng khối lượng không đổi?</p>
          <div class="opts">${[["a","Vì chất rắn sinh ra rất nhẹ"],["b","Vì số nguyên tử của mỗi nguyên tố giữ nguyên, chỉ liên kết giữa các nguyên tử thay đổi"],["c","Vì cân không đủ nhạy để thấy thay đổi"],["d","Vì nước bay hơi bù vào phần tăng thêm"]].map(([k,t],i)=>`<button class="opt ${S.q2===k?(k==="b"?"right":"wrong"):""}" data-q2="${k}"><span class="k">${"ABCD"[i]}</span>${t}</button>`).join("")}</div>
          ${S.q2&&S.q2!=="b"?`<div class="callout bad">${{a:"Chất rắn nặng hay nhẹ không quyết định tổng khối lượng; điều quan trọng là có chất nào vào hay ra khỏi hệ không.",c:"Cân đo đến 0,01 g và làm nhiều lần với lượng khác nhau đều cho kết quả bằng nhau.",d:"Không có nước thêm vào; bay hơi trong vài phút không đáng kể và nếu có thì làm khối lượng giảm, không bù vào."}[S.q2]}</div>`:""}
          ${S.q1===true&&S.q2==="b"?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`;
      }
    }
    function onBody(e){
      const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.pred){S.pred=d.pred;renderStep();return}
      if(d.why){S.why=d.why;renderStep();return}
      if(d.trial){act.trial(+d.trial);api.goStep(1);return}
      if(d.q2){S.q2=d.q2;renderStep();return}
      switch(d.k){
        case "lock":if(S.pred){S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok")}break;
        case "place":act.placeBoth();break;
        case "rec":act.record();break;
        case "pour":act.pour();break;
        case "swirl":act.swirl();break;
        case "retA":act.returnA();break;
        case "lens":act.lens();break;
        case "q1":{const inp=bodyEl.querySelector("#q1");const v=parseFloat(String(inp.value).replace(",","."));S.q1v=inp.value;S.q1=Math.abs(v-11.7)<0.051;renderStep();break}
        case "finish":S.finished=true;refresh();
          api.done(`<h2>Hoàn thành: Định luật bảo toàn khối lượng</h2><p class="muted">${doneTrials.length>1?`Cả ${doneTrials.length} lần thí nghiệm với lượng chất khác nhau, tổng khối lượng trước và sau phản ứng đều bằng nhau.`:`Tổng khối lượng trước và sau phản ứng bằng nhau: ${fmt(doneTrials[0].m1,2)} g. Có thể làm thêm với lượng khác ở bước 3.`}</p><div class="eq">BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl</div>`);break;
      }
    }


    /* ================= vẽ ================= */
    function placeBeaker(b){const wb=worldBase(b);
      if(b.piv){b.node.quat=G.Q.euler(0,0,b.phi);const o=rotZ([LIPX,LIPY,0],b.phi);b.node.pos=[b.piv[0]-o[0],b.piv[1]-o[1],b.piv[2]]}
      else{b.node.quat=[0,0,0,1];b.node.pos=wb}
      if(b.side){/* mặt thoáng nằm ngang cắt trụ chất lỏng */
        let yc,hW;const vis=b.V>.02;
        if(b.piv){const hRel=levelRel(b.V,b.phi);hW=b.piv[1]+hRel;const c=Math.max(.05,Math.cos(b.phi));yc=LIPY+(hRel-Math.sin(b.phi)*(0-LIPX))/c;
          b.surf.quat=G.Q.euler(0,0,-b.phi);b.surf.scl=[1/c,1,1]}
        else{yc=Y0+b.V*MLH;hW=wb[1]+yc;b.surf.quat=[0,0,0,1];b.surf.scl=[1,1,1]}
        b.surf.pos=[0,Math.min(yc,BH),0];b.side.mat.clip=[0,-1,0,hW];b.side.visible=vis;b.surf.visible=vis&&yc>Y0;
        if(b.piv&&yc>BH+.02)b.surf.visible=false}
      if(b.water){const L=Math.max(.004,Y0+b.V*MLH);b.water.scl=[1,L/L0,1];b.water.mat.uniforms.uH=L;b.water.mat.uniforms.uOrig=wb;
        const sedM=(b.mix.sed.BaSO4||0);b.sed.visible=sedM>.01;b.sed.scl=[1,.0015+.0075*sedM,1]}}
    function drawStream(){if(!pour||pour.Q<=.05||pour.ph!=="tilt"){stream.visible=false;return}const a=pour.b.piv,l=landPoint();const d=[a[0]-l[0],a[1]-l[1],a[2]-l[2]];const len=Math.hypot(...d);
      const rad=.005+.0032*Math.sqrt(pour.Q);stream.visible=true;stream.pos=l;stream.quat=G.Q.toward(d);stream.scl=[rad,len,rad]}
    function drawLens(){const d=lcv._d||1;lctx.setTransform(1,0,0,1,0,0);lctx.clearRect(0,0,lcv.width,lcv.height);if(!S.lensOn)return;
      lctx.setTransform(d,0,0,d,0,0);const s=R.size(),small=safe.w<560;const Rr=small?62:90;const L={x:safe.x+Rr+18,y:safe.y+Rr+16,r:Rr};
      const tb=S.lensTarget==="A"?A:B;const wb=worldBase(tb);const q=R.project([wb[0],wb[1]+Y0+Math.max(.02,tb.V*MLH*.5),wb[2]]);
      if(!q.behind){lctx.save();lctx.strokeStyle=C.rgba(day?"#7C3AED":"#FF6BD6",.6);lctx.lineWidth=2;lctx.setLineDash([5,6]);const a=Math.atan2(q.y-L.y,q.x-L.x);
        lctx.beginPath();lctx.moveTo(L.x+Math.cos(a)*(L.r+8),L.y+Math.sin(a)*(L.r+8));lctx.lineTo(q.x,q.y);lctx.stroke();lctx.setLineDash([]);lctx.fillStyle=lctx.strokeStyle;lctx.beginPath();lctx.arc(q.x,q.y,4,0,6.283);lctx.fill();lctx.restore()}
      lens.draw(lctx,L.x,L.y,L.r,P,`Kính lúp hạt · ${tb.name}`);
      const items=[["Ba","Ba²⁺"],["Cl","Cl⁻"],["Na","Na⁺"],["SO4","SO₄²⁻"]];let y=L.y+L.r+22,x0=L.x-L.r-6;
      const bw=(L.r+6)*2+40;lctx.fillStyle=day?"rgba(255,255,255,.88)":"rgba(7,10,28,.72)";C.rr(lctx,x0-8,y-14,bw,small?60:76,10);lctx.fill();
      lctx.font="700 11px system-ui,sans-serif";lctx.textBaseline="middle";
      items.forEach(([k,t],i)=>{const x=x0+(i%2)*(L.r+6),yy=y+Math.floor(i/2)*18;K.ball(lctx,x+7,yy,6,K.ION[k].c);lctx.fillStyle=P.ink;lctx.fillText(t,x+18,yy)});
      if(!small){const yy=y+38;lctx.fillStyle="rgba(255,255,255,.18)";C.rr(lctx,x0,yy-7,14,14,4);lctx.fill();lctx.fillStyle=P.ink;lctx.fillText("BaSO₄ (rắn, xếp thành khối)",x0+20,yy)}
      lctx.textBaseline="alphabetic"}
    function updateTags(){for(const [b,t] of [[A,tagA],[B,tagB]]){const show=b.loc!=="pour"&&b.loc!=="move";t.on=show;
        const h=`<span>${b.name} · ${fmt(b.V,1)} mL</span>`;if(t._h!==h){t.el.innerHTML=h;t._h=h}}
      homeL.on=A.loc!=="home"||B.loc!=="home"?false:true}
    function frame(dt){frameN++;const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      for(const tw of tweens.slice()){tw.t+=dt/tw.dur;const k=C.ease.inOut(Math.min(1,tw.t));tw.b.base=[C.lerp(tw.from[0],tw.to[0],k),C.lerp(tw.from[1],tw.to[1],k)+Math.sin(Math.PI*k)*tw.arc,C.lerp(tw.from[2],tw.to[2],k)];if(tw.t>=1){tw.b.base=[...tw.to];tweens=tweens.filter(x=>x!==tw);tw.done&&tw.done()}}
      approachStep(dt);pourStep(sdt);
      if(B.swirl){const s=B.swirl;s.t+=dt;const k=s.t/s.dur,a=k*Math.PI*8,amp=.028*Math.sin(Math.PI*Math.min(1,k));B.wob=[Math.cos(a)*amp,Math.sin(a)*amp];if(k>=1){B.swirl=null;B.wob=[0,0]}}
      stepField(sdt,dt);balUpdate(dt);drawFace();
      if(S.lensOn){const tb=S.lensTarget==="A"?A:B;lens.sync(tb.mix);lens.step(sdt)}
      for(const b of beakers)placeBeaker(b);drawStream();
      R.render(root,simT);updateTags();LB.update();placeMenu();drawLens();
      const s=pour?` · đang rót ${fmt(pour.Q,1)} mL/s`:(S.trial&&S.trial.reacted?` · đã lắng ${Math.round(S.trial.settled*100)}%`:"");
      api.time.label(`t = ${fmt(simT,1)} s${s}`,pour?1-(pour.b.V-RESID)/Math.max(1,(pour.b===A?S.trial.a:S.trial.b)):(S.trial&&S.trial.reacted?S.trial.settled:0))}

    /* ================= khởi động ================= */
    refreshDock();newTrial(0);layout();home();
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{const pi=S.trial?S.trial.pi:0;newTrial(pi)});
    vp.__lab={act,get S(){return S},get A(){return A},get B(){return B},bal,R,pick,tare,power,field,get pour(){return pour},swirlB,toggleLoc,openMenu};
    return{
      step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},
      layout:()=>{layout();cam.dist=fitDist(PRE.rad)*zoom},
      prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
