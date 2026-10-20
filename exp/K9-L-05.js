/* K9-L-05 · Thấu kính; đo tiêu cự thấu kính hội tụ; kính lúp (SGK KHTN 9 – Kết nối tri thức, Bài 8–10) · 3D, điều tra
   1. Giá quang học dài 1 m: vật sáng hình chữ F (cao 2 cm) – thấu kính đặt ở vạch 50 cm – màn hứng ảnh.
      Học sinh dịch vật và màn để tìm ảnh rõ nét; ảnh trên màn tính từ công thức thấu kính 1/f = 1/d + 1/d', độ nhòe theo độ lệch của màn.
      Đo tiêu cự bằng cách tìm vị trí d = d' (= 2f) cho ảnh thật bằng vật.
   2. Thấu kính phân kì: không hứng được ảnh trên màn; nhìn qua thấu kính thấy ảnh ảo cùng chiều, nhỏ hơn vật.
   3. Kính lúp: số bội giác G = 25/f (f tính bằng cm); quan sát dòng chữ nhỏ qua kính lúp. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const LENS={ht:{ten:"Thấu kính hội tụ",f:10},pk:{ten:"Thấu kính phân kì",f:-10}};
const U=.02;          /* 1 cm = 0,02 đơn vị cảnh (giá dài 1 m = 2 đơn vị) */
const LX=50,HOBJ=2,AP=4;   /* thấu kính ở vạch 50 cm; vật cao 2 cm; đường kính thấu kính 4 cm */
const MAGS=[{f:10,G:2.5},{f:5,G:5}];

const SPEC={
  predict:[{id:"p1",q:"Đặt vật sáng ở rất xa thấu kính hội tụ (d > 2f). Ảnh hứng được trên màn là:",opts:[["nho","Ảnh thật, ngược chiều, nhỏ hơn vật"],["lon","Ảnh thật, cùng chiều, lớn hơn vật"],["ao","Không hứng được ảnh"]],ans:"nho",res:"Kết quả: ảnh thật, ngược chiều, nhỏ hơn vật."},
    {id:"p2",q:"Để đo tiêu cự thấu kính hội tụ, ta tìm vị trí cho ảnh thật bằng vật. Khi đó khoảng cách vật – thấu kính bằng:",opts:[["2f","2f"],["f","f"],["f2","f/2"]],ans:"2f",res:"Kết quả: d = d' = 2f, nên f = d/2."}],
  taskLead:"Dịch vật và màn bằng các nút ở khay (mỗi bước 1 cm) cho tới khi ảnh trên màn rõ nét nhất, rồi bấm “Ghi kết quả”.",
  tasks:[{html:"<b>Thấu kính hội tụ:</b> ghi kết quả ảnh rõ nét ở ít nhất 3 vị trí vật khác nhau (cả d > 2f và f < d < 2f).",done:()=>{const L=S.log.filter(l=>l.k==="ht"&&l.sharp);return new Set(L.map(l=>l.d)).size>=3&&L.some(l=>l.d>20)&&L.some(l=>l.d<20&&l.d>10)}},
    {html:"<b>Đo tiêu cự:</b> tìm vị trí cho ảnh thật bằng vật và tính f.",done:()=>S.log.some(l=>l.k==="ht"&&l.sharp&&l.d===20)},
    {html:"<b>Ảnh ảo:</b> đặt vật trong khoảng tiêu cự của thấu kính hội tụ, và thử với thấu kính phân kì.",done:()=>S.log.some(l=>l.k==="ht"&&l.d<10)&&S.log.some(l=>l.k==="pk")},
    {html:"<b>Kính lúp:</b> quan sát dòng chữ qua hai kính lúp.",done:()=>S.mag[0]&&S.mag[1]}],
  obs:[{id:"a",q:"Với thấu kính hội tụ f = 10 cm, đặt vật cách thấu kính 30 cm. Ảnh rõ nét cách thấu kính:",opts:[["15","15 cm"],["30","30 cm"],["10","10 cm"]],ans:"15",why:"1/d' = 1/f − 1/d = 1/10 − 1/30 = 2/30 → d' = 15 cm; ảnh thật, ngược chiều, nhỏ bằng 1/2 vật."},
    {id:"b",q:"Thấu kính phân kì luôn cho ảnh:",opts:[["ao","Ảnh ảo, cùng chiều, nhỏ hơn vật"],["that","Ảnh thật, ngược chiều"],["bang","Ảnh ảo bằng vật"]],ans:"ao",why:"Chùm tia ló phân kì; đường kéo dài của chúng gặp nhau trước thấu kính."},
    {id:"c",q:"Kính lúp có tiêu cự 5 cm có số bội giác:",opts:[["5","G = 5×"],["2","G = 2×"],["25","G = 25×"]],ans:"5",why:"G = 25/f = 25/5 = 5."}],
  concl:{html:`<div class="eq">1/f = 1/d + 1/d' &nbsp;&nbsp; h'/h = d'/d &nbsp;&nbsp; G = 25/f</div><ul class="tlist">
    <li><b>Thấu kính hội tụ</b> (rìa mỏng): vật ngoài tiêu cự cho ảnh thật, ngược chiều; vật trong tiêu cự cho ảnh ảo, cùng chiều, lớn hơn vật. Vật ở 2f cho ảnh thật bằng vật ở 2f.</li>
    <li><b>Thấu kính phân kì</b> (rìa dày): luôn cho ảnh ảo, cùng chiều, nhỏ hơn vật.</li>
    <li><b>Kính lúp</b> là thấu kính hội tụ tiêu cự ngắn; đặt vật trong khoảng tiêu cự để thấy ảnh ảo lớn hơn vật; số bội giác G = 25/f (f tính bằng cm).</li></ul>`,
    quiz:[{id:"q1",q:"Vật đặt cách thấu kính hội tụ (f = 12 cm) 24 cm. Ảnh:",opts:[["a","Thật, ngược chiều, bằng vật, cách thấu kính 24 cm"],["b","Ảo, cùng chiều, lớn hơn vật"],["c","Thật, nhỏ hơn vật"]],ans:"a",why:{b:"Vật ở ngoài tiêu cự nên ảnh thật.",c:"Vật ở 2f cho ảnh bằng vật."}},
      {id:"q2",q:"Muốn quan sát vật nhỏ qua kính lúp, phải đặt vật:",opts:[["a","Trong khoảng tiêu cự của kính"],["b","Ở rất xa kính"],["c","Đúng ở tiêu điểm"]],ans:"a",why:{b:"Khi đó ảnh nhỏ, thật.",c:"Ảnh ở rất xa, khó quan sát."}}],
    done:`<h2>Hoàn thành: Thấu kính và kính lúp</h2><p class="muted">1/f = 1/d + 1/d'; kính lúp G = 25/f.</p>`},
  gv:["Yêu cầu học sinh tự dịch màn tìm ảnh rõ nét, không đoán theo công thức trước.","Đo tiêu cự: dịch đồng thời vật và màn sao cho ảnh rõ và bằng vật; f = L/4 với L là khoảng cách vật – màn.","Liên hệ: máy ảnh, mắt (thể thủy tinh), kính cận, kính viễn."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 8–10)</p><ul class="tlist"><li>Nhận biết thấu kính hội tụ, phân kì; vẽ đường truyền tia sáng; dựng ảnh; thực hiện thí nghiệm đo tiêu cự thấu kính hội tụ.</li><li>Nêu được cấu tạo, công dụng của kính lúp và số bội giác G = 25/f.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 8 Thấu kính, Bài 9 Thực hành đo tiêu cự thấu kính hội tụ, Bài 10 Kính lúp.</li>
<li>Công thức thấu kính mỏng, độ phóng đại: <a href="https://openstax.org/books/college-physics-2e/pages/25-6-image-formation-by-lenses" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 25.6</a>; kính lúp G = 25 cm/f: <a href="https://openstax.org/books/college-physics-2e/pages/26-4-microscopes" target="_blank" rel="noopener">mục 26.4</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thấu kính mỏng tiêu cự 10 cm, đường kính 4 cm; độ nhòe trên màn tính gần đúng theo hình nón của chùm tia ló; bỏ qua quang sai.</li></ul>`;

let S;
LabKHTN.register("K9-L-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tk",t:"Thấu kính"},{k:"d",t:"d (cm)"},{k:"dd",t:"d' (cm)"},{k:"kq",t:"Ảnh"}],empty:"Bấm “Ghi kết quả” để ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Giá quang học 3D: vật sáng, thấu kính, màn và kính lúp",legend:{w:260},bench:[7,2.2],seed:9,
      views:{gia:{t:[0,.24,0],yaw:-.6,pitch:.22,rad:.62,label:"Giá quang học",icon:IC.lens},lup:{t:[2.6,.08,0],yaw:0,pitch:1.05,rad:.38,label:"Kính lúp",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={lens:"ht",d:30,s:20,log:[],mag:{},m:0,recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const X=cm=>(cm-50)*U;const RY=.22;   /* độ cao trục chính */
    const vplane=(w,h)=>{const g=G.plane(w,h);const P=g.pos,N=g.nrm;for(let i=0;i<P.length;i+=3){const px=P[i],pz=P[i+2];P[i]=0;P[i+1]=-pz;P[i+2]=px;N[i]=-1;N[i+1]=0;N[i+2]=0}return g};
    const texM=(tex,extra)=>Object.assign({type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:tex},uniforms:{uDim:1}},extra||{});
    /* giá quang học và thước chia cm */
    root.add(R.mesh(G.box(2.1,.03,.12,.01,2),{color:"#4B5563",metal:.6,rough:.35})).pos=[0,.015,0];
    const rc=document.createElement("canvas");rc.width=2048;rc.height=64;{const g=rc.getContext("2d");g.fillStyle="#F3F0E6";g.fillRect(0,0,2048,64);g.fillStyle="#111";g.font="700 22px system-ui,Arial";g.textAlign="center";
      for(let i=0;i<=100;i++){const x=24+i*20;g.fillRect(x-1,0,2,i%10?14:i%5?20:26);if(i%10===0)g.fillText(String(i),x,54)}}
    const rail=root.add(R.mesh(G.plane(2.1*1024/1024,.06),texM(R.tex2D(rc,{mip:true}))));rail.pos=[(24+1000-1024)/2048*2.1*0,.031,.03];rail.scl=[1,1,1];
    /* vật sáng: hộp đèn có màn mờ in chữ F */
    const fc=document.createElement("canvas");fc.width=128;fc.height=128;{const g=fc.getContext("2d");g.fillStyle="#2A2A2A";g.fillRect(0,0,128,128);g.fillStyle="#FFF6C8";g.fillRect(44,14,14,100);g.fillRect(44,14,52,14);g.fillRect(44,56,38,13)}
    const objN=root.add(new G.Node());objN.add(R.mesh(G.box(.05,.14,.1,.01,2),{color:"#1F2937",rough:.5})).pos=[-.03,0,0];
    const fPlane=objN.add(R.mesh(vplane(.08,.08),texM(R.tex2D(fc),{side:"double"})));fPlane.pos=[-.056,0,0];
    objN.add(R.mesh(G.cylinder(.008,RY,8),{color:"#9CA3AF",metal:.7})).pos=[-.03,-RY,0];
    /* thấu kính */
    const lensN=root.add(new G.Node());lensN.pos=[X(LX),RY,0];
    const mkL=conv=>{const R0=AP/2*U*1.6;const f=conv?(x,y,z)=>Math.max(Math.hypot(x-.09,y,z)-.1,Math.hypot(x+.09,y,z)-.1,Math.hypot(y,z)-R0):(x,y,z)=>Math.max(Math.abs(x)-.012,Math.hypot(y,z)-R0,-(Math.hypot(x-.075,y,z)-.07),-(Math.hypot(x+.075,y,z)-.07));
      return lensN.add(R.mesh(G.fromSDF(f,[-.02,-R0-.01,-R0-.01],[.02,R0+.01,R0+.01],[12,32,32]),{type:"glass",color:"#DDF0FF",alpha:.5}))};
    const lHT=mkL(true),lPK=mkL(false);
    lensN.add(R.mesh(G.cylinder(.008,RY,8),{color:"#9CA3AF",metal:.7})).pos=[0,-RY,0];
    const ring=lensN.add(R.mesh(G.lathe([[.066,-.004],[.07,-.004],[.07,.004],[.066,.004]],36),{color:"#374151",metal:.6}));ring.quat=G.Q.euler(0,0,Math.PI/2);
    /* màn ảnh */
    const scrN=root.add(new G.Node());scrN.add(R.mesh(G.box(.012,.17,.17,.004,2),{color:"#D1D5DB",rough:.9})).pos=[.008,0,0];
    const sc=document.createElement("canvas");sc.width=256;sc.height=256;const sTex=R.tex2D(sc);
    const sPlane=scrN.add(R.mesh(vplane(.15,.15),texM(sTex)));sPlane.pos=[0,0,0];
    scrN.add(R.mesh(G.cylinder(.008,RY,8),{color:"#9CA3AF",metal:.7})).pos=[.01,-RY,0];
    /* ảnh ảo: chữ F mờ phía sau thấu kính (nhìn qua thấu kính) */
    const ghost=root.add(R.mesh(vplane(.08,.08),texM(R.tex2D(fc),{type:"unlit",alpha:.55,transparent:true,order:6,side:"double"})));
    const rays=root.add(new G.Node());
    function calc(){const f=LENS[S.lens].f,d=S.d;if(Math.abs(d-f)<1e-6)return{f,d,inf:true};const dd=d*f/(d-f);return{f,d,dd,k:-dd/d,real:dd>0}}
    let sKey="";
    function drawScreen(){const c=calc();const key=[S.lens,S.d,S.s].join();if(key===sKey)return;sKey=key;const g=sc.getContext("2d");g.filter="none";g.fillStyle="#6B6B66";g.fillRect(0,0,256,256);
      const pxcm=256/7.5;
      if(c.real&&!c.inf){const blur=Math.abs(S.s-c.dd)/c.dd*AP/2*pxcm;const k=c.k;const h=HOBJ*Math.abs(k)*pxcm;const sh=Math.min(1,1/(Math.abs(k)+.2));
        g.save();g.filter=`blur(${Math.min(40,blur).toFixed(1)}px)`;g.translate(128,128);g.scale(-1,-1);/* ảnh thật: ngược chiều (lộn ngược và đảo trái phải) */
        const s=h/100;g.scale(s,s);g.globalAlpha=Math.max(.2,Math.min(1,.95*sh+.15)/(1+blur/40));g.fillStyle="#FFF4C0";g.fillRect(-20,-50,14,100);g.fillRect(-20,-50,52,14);g.fillRect(-20,-8,38,13);g.restore()}
      else{const r=60+S.s*2;const gr=g.createRadialGradient(128,128,4,128,128,r);gr.addColorStop(0,"rgba(255,233,138,.35)");gr.addColorStop(1,"rgba(255,233,138,0)");g.fillStyle=gr;g.fillRect(0,0,256,256)}
      sTex.update(sc)}
    let rKey="";
    function drawRays(){const c=calc();const key=[S.lens,S.d,S.s].join();if(key===rKey)return;rKey=key;rays.children.slice().forEach(n=>rays.remove(n));
      const P=(cm,h)=>[X(cm),RY+h*U,0];const top=HOBJ;const ox=LX-S.d;const tubes=[];const ln=(a,b)=>tubes.push(G.tube([a,b],.0025,4));
      const f=c.f;
      /* tia song song trục chính → qua tiêu điểm (hoặc kéo dài qua tiêu điểm phía trước với thấu kính phân kì) */
      ln(P(ox,top),P(LX,top));const far=LX+60;const slope1=-top/f;ln(P(LX,top),P(far,top+slope1*60));
      /* tia qua quang tâm đi thẳng */
      const slope2=-top/S.d;ln(P(ox,top),P(far,top+slope2*(far-ox)));
      rays.add(R.mesh(G.merge(tubes),{type:"unlit",color:"#FDE047",alpha:.75,transparent:true,order:5}));
      if(!c.real||c.inf){/* đường kéo dài (nét đứt) tới ảnh ảo */const dsh=[];if(!c.inf){const ix=LX+c.dd,ih=top*c.k;for(let i=0;i<14;i++){const t0=i/14,t1=(i+.5)/14;const a=V3.lerp(P(LX,top),P(ix,ih),t0),b=V3.lerp(P(LX,top),P(ix,ih),t1);dsh.push(G.tube([a,b],.0018,4));const a2=V3.lerp(P(ox,top),P(ix,ih),t0),b2=V3.lerp(P(ox,top),P(ix,ih),t1);dsh.push(G.tube([a2,b2],.0018,4))}}
        if(dsh.length)rays.add(R.mesh(G.merge(dsh),{type:"unlit",color:"#FDE047",alpha:.45,transparent:true,order:5}))}
      /* tiêu điểm */
      for(const s of [-1,1]){const m=rays.add(R.mesh(G.sphere(.006,10,8),{type:"unlit",color:"#F97316"}));m.pos=P(LX+s*Math.abs(f),0)}}
    K.onFrame(()=>{const c=calc();objN.pos=[X(LX-S.d),RY,0];scrN.pos=[X(LX+S.s),RY,0];lHT.visible=S.lens==="ht";lPK.visible=S.lens==="pk";
      ghost.visible=!c.real&&!c.inf&&K.view==="gia";if(ghost.visible){ghost.pos=[X(LX+c.dd)-.002,RY+0,0];const k=Math.abs(c.k);ghost.scl=[1,k,k]}
      drawScreen();drawRays();rays.visible=K.view==="gia"&&S.rays;mag.visible=K.view==="lup"});
    S.rays=true;
    /* ================= kính lúp ================= */
    const MX=2.6;const page=document.createElement("canvas");page.width=1024;page.height=512;{const g=page.getContext("2d");g.fillStyle="#FBFAF4";g.fillRect(0,0,1024,512);g.fillStyle="#222";g.font="400 15px Georgia,serif";
      const txt="Kính lúp là thấu kính hội tụ có tiêu cự ngắn, dùng để quan sát các vật nhỏ. Số bội giác G = 25/f. Vật cần quan sát đặt trong khoảng tiêu cự của kính để thu được ảnh ảo, cùng chiều, lớn hơn vật. ";
      for(let r=0;r<30;r++){g.fillText((txt+txt).slice((r*37)%txt.length,(r*37)%txt.length+120),12,20+r*16.5)}
      g.fillStyle="#7A1E1E";g.font="700 10px system-ui";g.fillText("Hạt phấn hoa (ảnh in ×1)",420,260);for(let i=0;i<6;i++){g.beginPath();g.arc(450+i*14,280,4,0,6.283);g.fill()}}
    const pTex=R.tex2D(page,{mip:true});const paper=root.add(R.mesh(G.plane(.8,.4),texM(pTex,{uniforms:{uDim:.95}})));paper.pos=[MX,.002,0];
    const mag=root.add(new G.Node());mag.pos=[MX,.06,.0];
    const lensView=mag.add(R.mesh(G.plane(.16,.16),{type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;uniform float uS;uniform vec2 uC;",fs:"{vec2 d=vUV-.5;if(length(d)>.5)discard;vec2 q=uC+vec2(d.x*uS,d.y*uS*2.);base.rgb=texture(uTex,q).rgb*(1.-.25*smoothstep(.38,.5,length(d)));}"},textures:{uTex:pTex},uniforms:{uS:.2,uC:[.5,.5]}}));
    mag.add(R.mesh(G.lathe([[.08,-.006],[.088,-.006],[.088,.006],[.08,.006]],48),{color:"#2D2D2D",metal:.5,rough:.4}));
    const handle=mag.add(R.mesh(G.box(.24,.02,.03,.01,2),{color:"#5D4037",rough:.6}));handle.pos=[.2,0,.0];
    K.label("Kính lúp",[MX+.09,.06,0],{view:"lup",dir:"ne",len:40});
    K.label("Vật sáng (chữ F)",()=>V3.add(objN.pos,[0,.05,0]),{view:"gia",dir:"n",len:40});K.label("Thấu kính (vạch 50 cm)",[X(LX),RY+.08,0],{view:"gia",dir:"n",len:40});
    K.label("Màn hứng ảnh",()=>V3.add(scrN.pos,[0,.12,0]),{view:"gia",dir:"n",len:30});K.label("F",[X(LX-10),RY,0],{view:"gia",dir:"s",len:30});K.label("F′",[X(LX+10),RY,0],{view:"gia",dir:"s",len:30});
    const lGhost=K.label("Ảnh ảo",()=>ghost.pos,{view:"gia",dir:"n",len:60});
    K.onFrame(()=>{lGhost.on=K.view==="gia"&&ghost.visible;const M=MAGS[S.m];lensView.mat.uniforms.uS=.16/.8/M.G});
    /* ================= khay ================= */
    K.dockFn(()=>{if(K.view==="lup")return[{seg:MAGS.map((m,i)=>({k:"mg",v:String(i),label:`f = ${m.f} cm (G = ${String(m.G).replace(".",",")}×)`,icon:"",on:S.m===i})),label:"Kính lúp"}];
      return[{seg:Object.keys(LENS).map(k=>({k:"lens",v:k,label:LENS[k].ten,icon:"",on:S.lens===k})),label:"Thấu kính"},
        {grid:[{k:"d",v:"-1",label:"Vật lại gần 1 cm",icon:IC.plus},{k:"d",v:"1",label:"Vật ra xa 1 cm",icon:IC.minus},{k:"s",v:"-1",label:"Màn lại gần 1 cm",icon:IC.plus},{k:"s",v:"1",label:"Màn ra xa 1 cm",icon:IC.minus},
          {k:"d",v:"-5",label:"Vật lại gần 5 cm",icon:IC.plus},{k:"d",v:"5",label:"Vật ra xa 5 cm",icon:IC.minus},{k:"s",v:"-5",label:"Màn lại gần 5 cm",icon:IC.plus},{k:"s",v:"5",label:"Màn ra xa 5 cm",icon:IC.minus}]},
        "hr",{k:"rays",label:S.rays?"Ẩn đường truyền tia sáng":"Hiện đường truyền tia sáng",icon:IC.eye,on:S.rays},{k:"rec",label:"Ghi kết quả",icon:IC.pen}]});
    K.onDock((k,v)=>{if(k==="lens")S.lens=v;else if(k==="d")S.d=C.clamp(S.d+(+v),3,48);else if(k==="s")S.s=C.clamp(S.s+(+v),2,48);else if(k==="rays")S.rays=!S.rays;else if(k==="mg"){S.m=+v;S.mag[S.m]=1;
        if(Object.keys(S.mag).length&&!S.magRec?.[S.m]){S.magRec=S.magRec||{};S.magRec[S.m]=1;S.recs++;api.record({lan:String(S.recs),tk:`Kính lúp f = ${MAGS[S.m].f} cm`,d:`< ${MAGS[S.m].f}`,dd:"—",kq:`ảnh ảo, cùng chiều, lớn hơn vật; số bội giác G = 25/${MAGS[S.m].f} = ${String(MAGS[S.m].G).replace(".",",")}×`})}}
      else if(k==="rec"){const c=calc();const sharp=c.real&&!c.inf&&Math.abs(S.s-c.dd)<=.6;const it={k:S.lens,d:S.d,sharp};S.log.push(it);S.recs++;
        api.record({lan:String(S.recs),tk:LENS[S.lens].ten,d:String(S.d),dd:c.real&&!c.inf?(sharp?fmt(S.s,0):`màn ở ${S.s} cm: ảnh nhòe`):"—",
          kq:c.inf?"vật ở tiêu điểm: không có ảnh (chùm tia ló song song)":c.real?(sharp?`ảnh thật, ngược chiều, ${Math.abs(c.k)>1.05?"lớn hơn":Math.abs(c.k)<.95?"nhỏ hơn":"bằng"} vật (h'/h = ${fmt(Math.abs(c.k),2)})${S.d===20&&S.lens==="ht"?` → f = d/2 = ${fmt(S.d/2,0)} cm`:""}`:"chưa rõ nét, dịch màn tiếp"):`không hứng được ảnh trên màn; nhìn qua thấu kính thấy ảnh ảo, cùng chiều, ${Math.abs(c.k)>1?"lớn hơn":"nhỏ hơn"} vật (h'/h = ${fmt(Math.abs(c.k),2)})`})}
      refresh()});
    K.infoFn(()=>{if(K.view==="lup"){const M=MAGS[S.m];return `<div><b>Kính lúp</b> f = ${M.f} cm</div><div>Số bội giác G = 25/f = ${String(M.G).replace(".",",")}×</div><small>Kính đặt gần trang giấy (vật trong khoảng tiêu cự) cho ảnh ảo, cùng chiều, lớn hơn vật.</small>`}
      const c=calc();const L=LENS[S.lens];return `<div><b>${L.ten}</b> f = ${Math.abs(L.f)} cm</div><div>Vật: vạch ${LX-S.d} cm (d = ${S.d} cm)</div><div>Màn: vạch ${LX+S.s} cm (cách thấu kính ${S.s} cm)</div>
        <div>${c.inf?"Vật ở tiêu điểm":c.real?(Math.abs(S.s-c.dd)<=.6?"<b>Ảnh rõ nét trên màn</b>":"Ảnh trên màn còn nhòe"):"Không hứng được ảnh trên màn (ảnh ảo)"}</div><small>Dịch màn từng 1 cm để tìm ảnh rõ nét nhất.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* thao tác tay: kéo vật sáng hoặc màn chắn dọc giá quang học (mỗi nấc 1 cm) */
    K.pickFn((x,y)=>{if(K.view!=="gia")return null;const r=R.ray(x,y);if(G.hit.sphere(r,V3.add(objN.pos,[0,.05,0]),.075)!=null)return{drag:true,k:"obj"};if(G.hit.sphere(r,V3.add(scrN.pos,[0,.1,0]),.1)!=null)return{drag:true,k:"scr"};return null});
    K.dragFn((ph,o,p)=>{const r=R.ray(p.x,p.y);if(Math.abs(r.d[2])<1e-4)return;const t=-r.o[2]/r.d[2];if(t<=0)return;const cm=(r.o[0]+r.d[0]*t)/U+50;
      if(o.k==="obj")S.d=C.clamp(Math.round(LX-cm),3,48);else S.s=C.clamp(Math.round(cm-LX),2,48);K.refreshDock();K.updateInfo(true)});
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const press=()=>{const b=document.querySelector('[data-k="rec"]');b&&b.click()};S.lens="ht";for(const d of [30,20,15]){S.d=d;S.s=Math.round(d*10/(d-10));refresh();press()}S.d=6;refresh();press();S.lens="pk";S.d=20;refresh();press();S.lens="ht";S.d=30;S.s=15;S.mag={0:1,1:1};refresh()}};
    return K.mount(st)}
});
})();
