/* K8-H-07 · Base. Thang pH (SGK KHTN 8 – Kết nối tri thức, Bài 9)
   Bàn hóa học 3D (LabGL + LabChem3D), 4 trạm:
   1. Chất chỉ thị: 6 dung dịch (HCl, CH3COOH, nước cất, NaCl, NaOH, Ca(OH)2) thử bằng quỳ tím, phenolphthalein, giấy pH.
      pH tính từ nồng độ (acid mạnh, acid yếu Ka, base mạnh); màu chỉ thị theo khoảng chuyển màu.
   2. Trung hòa: 20 mL NaOH 0,01 M có phenolphthalein, nhỏ HCl 0,01 M từ burette; pH tính chính xác theo cân bằng điện tích,
      vệt mất màu cục bộ nơi giọt acid rơi, khuấy thì màu đồng đều trở lại cho tới điểm tương đương.
   3. Base không tan: Mg(OH)2 rắn tan dần trong HCl loãng.
   4. Đo pH thực phẩm bằng giấy pH, so bảng màu. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D;
const fmt=C.fmt,H=G.hex;

/* ---------- hóa học ---------- */
const KW=1e-14;
const pHx=d=>{const h=(-d+Math.sqrt(d*d+4*KW))/2;return -Math.log10(h)};            /* d = [OH⁻] − [H⁺] do chất mạnh tạo ra */
const SOL=[
  {k:"HCl",f:"HCl",ten:"HCl 0,1 M",ten2:"dung dịch HCl 0,1 M",t:"sa",c:.1},
  {k:"AcOH",f:"CH₃COOH",ten:"CH₃COOH 0,1 M",ten2:"dung dịch CH₃COOH 0,1 M",t:"wa",c:.1,Ka:1.75e-5},
  {k:"H2O",f:"H₂O",ten:"Nước cất",ten2:"nước cất",t:"n"},
  {k:"NaCl",f:"NaCl",ten:"NaCl 0,1 M",ten2:"dung dịch NaCl 0,1 M",t:"n"},
  {k:"NaOH",f:"NaOH",ten:"NaOH 0,01 M",ten2:"dung dịch NaOH 0,01 M",t:"sb",c:.01,n:1},
  {k:"CaOH",f:"Ca(OH)₂",ten:"Ca(OH)₂ 0,0125 M",ten2:"nước vôi trong Ca(OH)₂ 0,0125 M",t:"sb",c:.0125,n:2}];
function pHof(s){if(s.t==="sa")return pHx(-s.c);if(s.t==="sb")return pHx(s.c*s.n);if(s.t==="wa"){const K=s.Ka;return -Math.log10((-K+Math.sqrt(K*K+4*K*s.c))/2)}return 7}
SOL.forEach(s=>s.pH=pHof(s));
/* chuẩn độ */
const TIT={Vb:20,Cb:.01,Ca:.01};
const pHT=v=>pHx((TIT.Cb*TIT.Vb-TIT.Ca*v)/(TIT.Vb+v));
const VEQ=TIT.Cb*TIT.Vb/TIT.Ca;
/* chất chỉ thị */
const ppF=pH=>pH<8.2?0:1/(1+Math.pow(10,9.3-pH));
const mixc=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*C.clamp(t,0,1));
const LRED=H("#C8323A"),LPUR=H("#7A4A9A"),LBLU=H("#3657C0");
function litmus(pH){if(pH<=4.5)return LRED;if(pH<5.5)return mixc(LRED,LPUR,pH-4.5);if(pH<=7.5)return LPUR;if(pH<8.3)return mixc(LPUR,LBLU,(pH-7.5)/.8);return LBLU}
const UIC=["#E31E24","#E31E24","#EC3A26","#F26B21","#F7941D","#FBB917","#F2D21B","#7AB648","#3FA86B","#2A9BB0","#2577C2","#3657A8","#4B3F99","#5A3290","#5E2A7E"].map(H);
const UIN=["","đỏ","đỏ","đỏ cam","cam","vàng cam","vàng","xanh lá","xanh lục","xanh ngọc","xanh dương","chàm","tím chàm","tím","tím"];
function uiCol(pH){const p=C.clamp(pH,1,14),i=Math.floor(p);return i>=14?UIC[14]:mixc(UIC[i],UIC[i+1],p-i)}
const env=pH=>pH<6.95?"acid":pH<=7.05?"trung tính":"base";
const envTxt=pH=>pH<6.95?"Môi trường acid":pH<=7.05?"Môi trường trung tính":"Môi trường base";
/* mẫu thực phẩm (giá trị tham khảo, xem tab Nguồn) */
const CUP=[{k:"nuoc",ten:"Nước lọc",pH:7,col:"#D6E8F8",a:.32,src:"khoảng 7"},{k:"giam",ten:"Giấm ăn",pH:2.8,col:"#F3F0E2",a:.38,src:"khoảng 2,8"},
  {k:"chanh",ten:"Nước chanh",pH:2.4,col:"#EEE39A",a:.62,src:"khoảng 2–3"},{k:"soda",ten:"Nước ngọt có gas",pH:3.4,col:"#E2F1D8",a:.36,src:"khoảng 3–4",gas:true},
  {k:"bicarb",ten:"Dung dịch baking soda",pH:8.3,col:"#EEF1F5",a:.5,src:"khoảng 8,3"}];

const GV=`<p><b>Yêu cầu cần đạt</b> (trích mục tiêu Bài 9)</p>
<ul class="tlist"><li>Nêu được khái niệm base; tiến hành được thí nghiệm base làm đổi màu chất chỉ thị, phản ứng với acid tạo muối; viết phương trình hóa học.</li><li>Nêu được thang pH, sử dụng pH để đánh giá môi trường acid – base; đo pH bằng giấy pH với một số đồ uống, hoa quả.</li><li>Liên hệ pH trong dạ dày, trong máu, nước mưa, đất.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức</b></p>
<ul class="tlist"><li>Cho học sinh dự đoán màu quỳ tím với từng ống trước khi thử, rồi đối chiếu với pH tính được.</li><li>Ở trạm trung hòa: tắt khuấy rồi nhỏ từng giọt để thấy vệt mất màu cục bộ; bật khuấy để thấy màu hồng trở lại khi chưa đủ acid.</li><li>Yêu cầu học sinh bấm “Ghi số đo” ở vài thể tích (0, 10, 18, 19,5, 20, 22 mL) để thấy pH đổi đột ngột gần 20 mL.</li></ul>
<p style="margin-top:10px"><b>An toàn khi làm thật</b></p>
<ul class="tlist"><li>Dung dịch acid, kiềm dù loãng vẫn gây hại cho mắt: đeo kính bảo hộ, không nếm thử, rửa ngay bằng nhiều nước nếu dính vào da.</li></ul>`;
const SRC=`<ul class="tlist">
<li>Các thí nghiệm của Bài 9 (base đổi màu quỳ tím và phenolphthalein; NaOH có phenolphthalein + HCl: hồng → không màu; Mg(OH)₂ rắn + HCl: chất rắn tan dần; đo pH bằng giấy pH với nước lọc, giấm ăn 2,8, nước chanh 2–3, nước ngọt có gas 3–4) và pH máu 7,35–7,45, dịch vị 1,5–3,5, nước mưa khoảng 5,6, đất trồng 5–8: <a href="https://minio.ftech.ai/fs-landing/KHTN_8_Ket_noi_Bai_9_ebf4490faf.pdf" target="_blank" rel="noopener">tài liệu bài dạy KHTN 8 KNTT Bài 9</a>.</li>
<li>Mục tiêu bài học: <a href="https://hoatieu.vn/powerpoint-khoa-hoc-tu-nhien-8-bai-9-ket-noi-tri-thuc-232563" target="_blank" rel="noopener">kế hoạch bài dạy Bài 9 (Hoatieu)</a>.</li>
<li>Khoảng chuyển màu: quỳ (litmus) đỏ dưới pH 4,5, xanh trên 8,3; phenolphthalein không màu dưới 8,3, hồng tím tới 10,0 và mất màu dần trong khoảng pH 12,0–13,0; màu chỉ thị vạn năng: đỏ (1–3), cam/vàng (3–6), xanh lá (7), xanh dương (8–11), tím chàm (11–14): <a href="https://en.wikipedia.org/wiki/PH_indicator" target="_blank" rel="noopener">Wikipedia – pH indicator</a>.</li></ul>
<p style="margin-top:10px"><b>Cách tính và giả định của mô hình</b></p>
<ul class="tlist"><li>pH tính ở 25 °C: acid mạnh, base mạnh phân li hoàn toàn; CH₃COOH là acid yếu với Ka = 1,75·10⁻⁵ (pH 0,1 M ≈ 2,9). Chuẩn độ dùng cân bằng điện tích nên pH đúng cả lúc gần điểm tương đương.</li>
<li>Dùng NaOH 0,01 M (pH 12) vì ở pH trên khoảng 12, phenolphthalein dần mất màu.</li>
<li>Nước cất và NaCl được coi là trung tính (pH 7); nước cất để lâu ngoài không khí hấp thụ CO₂ nên pH thực tế thấp hơn 7 một chút.</li>
<li>Baking soda: tài liệu bài dạy ghi pH 9,5; dung dịch NaHCO₃ tinh khiết có pH khoảng 8,3 (trung bình pKa₁ = 6,35 và pKa₂ = 10,33 của H₂CO₃). Mô hình dùng 8,3; sản phẩm thương mại có thể cho giá trị khác.</li>
<li>Màu giấy pH là màu minh họa của chỉ thị vạn năng; mỗi hãng giấy pH có bảng màu riêng in trên hộp. Giá trị pH thực phẩm thay đổi theo sản phẩm.</li></ul>`;

LabKHTN.register("K8-H-07",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng / số đo"},{k:"kl",t:"Kết luận"}],empty:"Kết quả tự ghi vào bảng sau mỗi lần thử."},
  gv:GV,sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Bàn thí nghiệm 3D: ống dung dịch thử chất chỉ thị, cốc chuẩn độ có burette và máy đo pH, ống Mg(OH)₂, cốc mẫu thực phẩm");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,simT=0,view="chithi",bodyEl=null,stepIdx=0,frameN=0;
    const rnd=C.rng(70913);
    const freshTubes=()=>SOL.map(()=>({pp:0,ppOn:false,quy:null,ph:null}));
    const freshT=()=>({v:0,open:false,stir:true,drops:[],hist:[[0,pHT(0)]],end:false,marks:[]});
    const freshM=()=>({n:1,acid:0,shake:0,cloud:0,rec:false,drops:[]});
    const S={p1:null,p2:null,locked:false,obs:{},q:{},finished:false,recs:0,
      tool:null,tb:freshTubes(),anim:null,T:freshT(),M:freshM(),cups:CUP.map(()=>({done:false,t:-1})),
      done:{quy:new Set(),pp:new Set(),ph:new Set(),cup:new Set()}};
    const rec=(tn,ht,kl)=>{S.recs++;api.record({lan:String(S.recs),tn,ht,kl})};

    /* ================= cảnh ================= */
    const root=new G.Node();
    root.add(K3.bench(R,8.6,4.4,day));
    const wood={color:"#9C6B3F",rough:.55,key:"wood",hooks:{fu:K3.NOISE+"uniform float uNF;",fs:`{float g=vn(vec3(vO.x*3.,vO.y*40.,vO.z*3.))*.6+vn(vO*18.)*.4;base.rgb*=.8+.35*g;}`},uniforms:{uNF:1}};
    const BASEC=H("#CFE2F5"),PINK=H("#E5307F");
    /* --- trạm 1: giá 6 ống nghiệm --- */
    const RK={c:[-2.25,0,-.8]},TX=[-.8,-.48,-.16,.16,.48,.8],TB={r:.1,h:1.0,lvl:.56};
    const rack=root.add(new G.Node());rack.pos=RK.c;
    rack.add(R.mesh(G.box(1.95,.06,.4,.02,2),wood)).pos=[0,.03,0];rack.add(R.mesh(G.box(1.95,.05,.4,.02,2),wood)).pos=[0,.5,0];
    for(const x of [-.95,.95])rack.add(R.mesh(G.box(.06,.5,.4,.015,2),wood)).pos=[x,.27,0];
    const tubes=TX.map((x,i)=>{const t=rack.add(new G.Node());t.pos=[x,.07,0];t.add(K3.testTube(R,TB.r,TB.h));
      const liq=t.add(R.mesh(K3.liquidGeom(TB.r-.013,.013,TB.lvl,true),{color:BASEC,alpha:.46,rough:.04,coat:.6,order:1}));return{node:t,liq}});
    /* tấm sứ trắng: hàng giấy quỳ và hàng giấy pH */
    const TILE={c:[-2.25,0,.05]};
    const tile=root.add(new G.Node());tile.pos=TILE.c;tile.add(R.mesh(G.box(2.05,.05,.62,.02,3),{color:"#F4F5F7",rough:.25,coat:.5})).pos=[0,.025,0];
    const ROWZ={quy:-.13,ph:.15};
    const bits={quy:[],ph:[]};
    for(const row of ["quy","ph"])TX.forEach((x,i)=>{const b=tile.add(R.mesh(G.box(.13,.006,.2,.002,1),{color:row==="quy"?LPUR:H("#EDC35A"),rough:.85}));b.pos=[x,.053,ROWZ[row]];bits[row].push(b)});
    /* lọ phenolphthalein, hộp giấy quỳ, hộp giấy pH */
    const dropBottle=(pos,body,cap)=>{const n=root.add(new G.Node());n.pos=pos;n.add(K3.glass(R,.13,.34,{lip:0,tint:body}));n.add(K3.liquid(R,.11,.03,.22,H("#F2F4F8"),.25));
      n.add(R.mesh(G.lathe([[0,.34],[.07,.34],[.075,.4],[.05,.5],[.03,.6],[0,.62]],24),{color:cap,rough:.5}));return n};
    dropBottle([-3.65,0,-.55],"#D9E6F5","#2B2F42");
    const box1=root.add(new G.Node());box1.pos=[-3.65,0,.05];box1.add(R.mesh(G.box(.38,.08,.26,.02,2),{color:"#7A4A9A",rough:.6})).pos=[0,.04,0];
    const box2=root.add(new G.Node());box2.pos=[-3.65,0,.5];box2.add(R.mesh(G.box(.38,.08,.26,.02,2),{color:"#F2B33D",rough:.6})).pos=[0,.04,0];
    /* đũa thủy tinh và ống nhỏ giọt (dụng cụ động) */
    const rod=root.add(new G.Node());rod.add(R.mesh(G.cylinder(.012,.95,10),{type:"glass",color:"#E6F2FF",alpha:.6}));rod.visible=false;
    const dropper=root.add(new G.Node());dropper.add(R.mesh(G.lathe([[0,0],[.012,.02],[.016,.08],[.02,.42],[0,.42]],16),{type:"glass",color:"#E6F2FF",alpha:.6}));
    dropper.add(R.mesh(G.lathe([[0,.42],[.035,.42],[.04,.5],[.032,.6],[0,.62]],16),{color:"#2B2F42",rough:.5}));dropper.visible=false;
    const drop1=root.add(R.mesh(G.sphere(.022,12,8),{type:"glass",color:"#F4F8FF",alpha:.7}));drop1.visible=false;

    /* --- trạm 2: chuẩn độ --- */
    const BK={c:[.8,0,-.6],r:.42,h:.78,y0:.14};
    const stirrer=root.add(new G.Node());stirrer.pos=[BK.c[0],0,BK.c[2]];
    stirrer.add(R.mesh(G.box(1.0,.14,1.0,.04,3),{color:"#E9ECF1",rough:.35,coat:.4})).pos=[0,.07,0];
    stirrer.add(R.mesh(G.cylinder(.06,.03,20),{color:"#3B4256",rough:.4})).pos=[.36,.04,.5];
    const lamp=stirrer.add(R.mesh(G.sphere(.022,10,8),{type:"unlit",color:"#3BE07A"}));lamp.pos=[.2,.1,.5];
    const beaker=root.add(new G.Node());beaker.pos=[BK.c[0],BK.y0,BK.c[2]];
    beaker.add(K3.glass(R,BK.r,BK.h,{lip:.025}));
    const lvlOf=v=>.03+(TIT.Vb+v)*.0068;const L0=lvlOf(0);
    const field=K3.DyeField(24,10,24),fTex=R.tex3D(24,10,24);
    const wv=beaker.add(K3.waterVolume(R,BK.r-.03,BK.h,L0,fTex,{orig:[BK.c[0],BK.y0,BK.c[2]],k:4.2,dyeCol:[.9,.16,.5],water:H("#B9D6F2")}));
    const stirBar=beaker.add(R.mesh(G.box(.2,.035,.045,.017,2),{color:"#F4F4F4",rough:.3,coat:.6}));stirBar.pos=[0,.045,0];
    /* máy đo pH (bút) */
    const probe=beaker.add(new G.Node());probe.pos=[.2,0,.12];probe.quat=G.Q.euler(0,0,-.1);
    probe.add(R.mesh(G.cylinder(.032,.9,16),{color:"#E9EDF2",rough:.3,coat:.5})).pos=[0,.1,0];
    probe.add(R.mesh(G.cylinder(.05,.42,20),{color:"#25304A",rough:.45})).pos=[0,1.0,0];
    probe.add(R.mesh(G.box(.07,.12,.006,.01,1),{type:"unlit",color:"#BFE9C7"})).pos=[0,1.25,.051];
    /* giá, burette */
    const stand=root.add(new G.Node());stand.pos=[BK.c[0]-.95,0,BK.c[2]];
    stand.add(R.mesh(G.box(.6,.05,.9,.02,2),{color:"#2A2F3D",rough:.5})).pos=[0,.025,0];
    stand.add(R.mesh(G.cylinder(.022,3.0,12),{color:"#AEB4BF",rough:.25,metal:1})).pos=[-.15,.05,0];
    stand.add(R.mesh(G.box(1.0,.04,.04,.01,1),{color:"#AEB4BF",rough:.25,metal:1})).pos=[.35,2.3,0];
    stand.add(R.mesh(G.box(.1,.12,.12,.02,1),{color:"#3B4256",rough:.4})).pos=[.95,2.3,0];
    const BU={x:BK.c[0],z:BK.c[2],tip:1.12,y0:1.32,y1:3.0,r:.045,top:2.86,mlLen:.03};
    const bur=root.add(new G.Node());bur.pos=[BU.x,0,BU.z];
    bur.add(R.mesh(G.lathe([[0,BU.tip],[.008,BU.tip],[.012,BU.tip+.06],[.016,BU.y0-.08],[BU.r,BU.y0],[BU.r,BU.y1],[BU.r+.008,BU.y1+.01],[BU.r-.006,BU.y1+.01],[BU.r-.006,BU.y0+.004],[0,BU.y0+.004]],24),{type:"glass",color:"#E2F0FF",alpha:.6}));
    const ticks=[];for(let m=0;m<=50;m+=1){const y=BU.top-m*BU.mlLen;const long=m%10===0,mid=m%5===0;const g=G.box(long?.03:mid?.022:.014,.004,.004,0,1);for(let q=0;q<g.pos.length;q+=3){g.pos[q]+=BU.r-.004+(long?.015:mid?.011:.007);g.pos[q+1]+=y}ticks.push(g)}
    bur.add(R.mesh(G.merge(ticks),{color:"#1E2433",rough:.5})).quat=G.Q.euler(0,-Math.PI/2+.25,0);
    const burLiq=bur.add(R.mesh(G.cylinder(BU.r-.008,1,20),{color:H("#D8E8F8"),alpha:.42,rough:.05,coat:.5,order:1}));
    const cockN=bur.add(new G.Node());cockN.pos=[0,BU.tip+.13,0];cockN.add(R.mesh(G.box(.05,.05,.05,.012,1),{color:"#E9EDF2",rough:.3}));
    const handle=cockN.add(R.mesh(G.box(.17,.022,.03,.008,1),{color:"#2C6BD9",rough:.4}));
    const stream=root.add(R.mesh(G.cylinder(.006,1,8),{type:"glass",color:"#F2F8FF",alpha:.6}));stream.visible=false;
    const tdrops=[];for(let i=0;i<6;i++){const d=root.add(R.mesh(G.sphere(.016,10,8),{type:"glass",color:"#F4F8FF",alpha:.7}));d.visible=false;tdrops.push(d)}

    /* --- trạm 3: Mg(OH)2 --- */
    const MG={c:[2.45,0,-.75],r:.11,h:1.0};
    const blk=root.add(new G.Node());blk.pos=MG.c;blk.add(R.mesh(G.box(.42,.32,.42,.04,2),wood)).pos=[0,.16,0];
    const mgT=root.add(new G.Node());mgT.pos=[MG.c[0],.33,MG.c[2]];mgT.add(K3.testTube(R,MG.r,MG.h));
    const mgLiq=mgT.add(R.mesh(K3.liquidGeom(MG.r-.013,.013,.3,true),{color:BASEC,alpha:.42,rough:.05,coat:.5,order:1}));
    const grains=root.add(R.instanced(G.sphere(1,10,8),{color:"#F5F5F2",rough:.85},60));
    const GR=Array.from({length:60},()=>{const a=rnd()*6.283,r=Math.sqrt(rnd())*.06;return{x:Math.cos(a)*r,z:Math.sin(a)*r,y:.032+rnd()*.045,s:.01+rnd()*.012,ph:rnd()*6.28}});
    const hclB=dropBottle([MG.c[0]+.6,0,MG.c[2]+.15],"#E6EEF8","#8C2B2B");

    /* --- trạm 4: mẫu thực phẩm + giấy pH --- */
    const CX=[.6,1.15,1.7,2.25,2.8],CZ=.85;
    const cups=CUP.map((c,i)=>{const n=root.add(new G.Node());n.pos=[CX[i],0,CZ];n.add(K3.glass(R,.21,.36,{lip:.015}));
      const liq=n.add(R.mesh(K3.liquidGeom(.19,.03,.25,false),{color:H(c.col),alpha:c.a,rough:.05,coat:.5,order:1}));
      const strip=new G.Node();root.add(strip);const up=strip.add(R.mesh(G.box(.07,.34,.006,.002,1),{color:H("#EDC35A"),rough:.85}));up.pos=[0,.27,0];
      const lo=strip.add(R.mesh(G.box(.07,.16,.006,.002,1),{color:H("#EDC35A"),rough:.85}));lo.pos=[0,.02,0];strip.visible=false;
      return{n,liq,strip,lo}});
    /* bảng so màu pH */
    const cvs=document.createElement("canvas");cvs.width=1024;cvs.height=200;{const g=cvs.getContext("2d");g.fillStyle="#FFFFFF";g.fillRect(0,0,1024,200);
      const w=1024/14.6,x0=(1024-w*14)/2;for(let p=1;p<=14;p++){const c=UIC[p].map(v=>Math.round(v*255));g.fillStyle=`rgb(${c})`;g.fillRect(x0+(p-1)*w+3,28,w-6,96);
        g.fillStyle="#1B2033";g.font="700 40px system-ui,Segoe UI,Arial,sans-serif";g.textAlign="center";g.fillText(String(p),x0+(p-.5)*w,168)}
      g.font="600 22px system-ui,Segoe UI,Arial,sans-serif";g.fillStyle="#C1272D";g.textAlign="left";g.fillText("acid",x0+4,20);g.fillStyle="#2E7D32";g.textAlign="center";g.fillText("trung tính",x0+6.5*w,20);g.fillStyle="#3B3F9E";g.textAlign="right";g.fillText("base",x0+14*w-4,20)}
    const cardTex=R.tex2D(cvs,{mip:true});
    const card=root.add(R.mesh(G.plane(2.4,.47),{type:"unlit",color:"#FFFFFF",key:"phcard",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:cardTex},uniforms:{uDim:.92}}));
    card.pos=[1.7,.012,1.55];
    const soda=root.add(K3.bubbles(R,160));

    /* ================= nhãn ================= */
    const LB=G.labels(over,R,{bounds:api.safe});
    const mk=(v,html,p,cls)=>{const it=LB.add(html,p,cls);it.view=v;return it};
    const tubeLab=SOL.map((s,i)=>mk("chithi",`<span>${s.f}</span>`,[RK.c[0]+TX[i],i%2?1.36:1.2,RK.c[2]]));
    const banL=[mk("ban",`<span>Chất chỉ thị</span>`,[RK.c[0],1.3,RK.c[2]]),mk("ban",`<span>Trung hòa</span>`,[BK.c[0],2.1,BK.c[2]]),mk("ban",`<span>Mg(OH)₂ + HCl</span>`,[MG.c[0],1.55,MG.c[2]]),mk("ban",`<span>Đo pH thực phẩm</span>`,[1.7,.62,CZ])];
    const rowL=[mk("chithi",`<span>Quỳ tím</span>`,[TILE.c[0]-1.02,.06,TILE.c[2]+ROWZ.quy],"left"),mk("chithi",`<span>Giấy pH</span>`,[TILE.c[0]-1.02,.06,TILE.c[2]+ROWZ.ph],"left")];
    const burL=mk("trunghoa",`<span></span>`,[BU.x+.06,2.2,BU.z],"right");
    const meterL=mk("trunghoa",`<span></span>`,[BK.c[0]+.15,BK.y0+1.3,BK.c[2]+.12],"right");
    const mgL=mk("mgoh",`<span>Mg(OH)₂ + nước</span>`,[MG.c[0]+.14,1.05,MG.c[2]],"right");
    const cupL=CUP.map((c,i)=>mk("doph",`<span>${c.ten}</span>`,[CX[i],i%2?.78:.58,CZ]));
    const info=document.createElement("div");info.className="gl-legend glass";over.appendChild(info);

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:.05,maxPitch:1.35});
    const PRE={ban:{t:[-.2,.5,0],yaw:0,pitch:.55,rad:4.2},chithi:{t:[-2.4,.72,-.35],yaw:0,pitch:.4,rad:1.32},trunghoa:{t:[.75,1.45,-.6],yaw:-.12,pitch:.16,rad:1.5},
      mgoh:{t:[2.55,.85,-.7],yaw:-.1,pitch:.25,rad:.85},doph:{t:[1.7,.3,1.1],yaw:0,pitch:.62,rad:1.45}};
    const PREP={chithi:{rad:1.15,t:[-2.25,.5,-.3]},doph:{rad:1.35},trunghoa:{rad:1.45,t:[.45,1.4,-.6]}};
    let safe={x:0,y:0,w:1,h:1},zoom=1;
    function fitDist(rad){const s=R.size();const tv=Math.tan(cam.fov/2)*safe.h/s.h,th=Math.tan(cam.fov/2)*(s.w/s.h)*safe.w/s.w;return rad/Math.min(tv,th)}
    const preOf=v=>{const s=R.size();return s.w<s.h*.9&&PREP[v]?Object.assign({},PRE[v],PREP[v]):PRE[v]};
    function goView(v,instant){view=v;const p=preOf(v);const to={target:p.t,yaw:p.yaw,pitch:p.pitch,dist:fitDist(p.rad)*zoom};if(instant)Object.assign(cam,{target:[...p.t],yaw:p.yaw,pitch:p.pitch,dist:to.dist});else orbit.fly(to,.9);
      for(const it of LB.items)it.on=it.view===v;refresh()}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));safe=api.safe();const s=R.size();cam.shift=[2*(safe.x+safe.w/2)/s.w-1,1-2*(safe.y+safe.h/2)/s.h];
      info.style.left=(safe.x+10)+"px";info.style.top=(safe.y+10)+"px";cam.dist=fitDist(preOf(view).rad)*zoom;const port=s.w<s.h*.9;if(R._port!==undefined&&R._port!==port){R._port=port;goView(view,true)}R._port=port}
    function theme(){day=api.day;const E=R.env;
      if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=.55}
      else{E.bgTop=H("#1B2347");E.bgBot=H("#06091A");E.bgGlow=H("#2B3670");E.sky=H("#6070A0");E.gnd=H("#171B2B");E.hor=H("#3E4868");E.exposure=.8;E.ink=0}
      E.k1c=[2.1,2.0,1.85];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9];card.mat.uniforms.uDim=day?1:.88;
      over.classList.toggle("day",day)}

    /* ================= trạm 1: chất chỉ thị ================= */
    const TOOLN={quy:"quỳ tím",pp:"phenolphthalein",ph:"giấy pH"};
    function test(tool,i){if(S.anim)return api.toast("Đợi thao tác trước xong đã.","info",1600);
      const t=S.tb[i];if(tool==="pp"&&t.ppOn)return api.toast("Ống này đã có phenolphthalein.","info",1800);if(tool!=="pp"&&t[tool])return api.toast(`Đã thử ${TOOLN[tool]} với ống này.`,"info",1800);
      S.anim={tool,i,t:0,applied:false};if(view!=="chithi")goView("chithi");refresh()}
    const lerp3=(a,b,k)=>a.map((x,j)=>x+(b[j]-x)*k);
    const sm=k=>k<=0?0:k>=1?1:k*k*(3-2*k);
    function rodPath(a,t){const x=RK.c[0]+TX[a.i],zt=RK.c[2],xs=TILE.c[0]+TX[a.i],zs=TILE.c[2]+ROWZ[a.tool];const top=1.35,dip=.42;
      const P=[[x,top,zt],[x,dip,zt],[x,top,zt],[xs,.5,zs],[xs,.082,zs],[xs,.55,zs]],T=[0,.35,.7,1.15,1.35,1.7];
      for(let k=0;k<5;k++)if(t<=T[k+1])return lerp3(P[k],P[k+1],sm((t-T[k])/(T[k+1]-T[k])));return P[5]}
    function stepTubes(dt){const a=S.anim;rod.visible=false;dropper.visible=false;drop1.visible=false;
      if(a){a.t+=dt;const s=SOL[a.i],t=S.tb[a.i];
        if(a.tool==="pp"){const x=RK.c[0]+TX[a.i],z=RK.c[2];const yIn=Math.min(1,a.t/.3);dropper.visible=a.t<1.5;dropper.pos=[x,1.75-.32*sm(yIn),z];
          const surf=.07+TB.lvl;for(const td of [.45,.85]){const k=(a.t-td)/.28;if(k>0&&k<1){drop1.visible=true;drop1.pos=[x,1.42-(1.42-surf)*k*k,z]}}
          if(a.t>.73&&!t.ppOn){t.ppOn=true}
          if(a.t>1.7){S.anim=null;S.done.pp.add(a.i);const f=ppF(s.pH);rec(`Phenolphthalein + ${s.ten2}`,f>.05?"dung dịch từ không màu chuyển sang màu hồng":"dung dịch không đổi màu (không màu)",`${envTxt(s.pH)} (pH ≈ ${fmt(s.pH,1)})`);refresh()}}
        else{rod.visible=true;const p=rodPath(a,a.t);rod.pos=p;rod.quat=G.Q.euler(0,0,.06);
          if(a.t>=1.3&&!a.applied){a.applied=true;t[a.tool]=s.pH;const b=bits[a.tool][a.i];b._from=b.mat.color.slice();b._to=a.tool==="quy"?litmus(s.pH):uiCol(s.pH);b._k=0}
          if(a.t>1.75){S.anim=null;S.done[a.tool].add(a.i);
            if(a.tool==="quy")rec(`Quỳ tím + ${s.ten2}`,`quỳ tím ${s.pH<=4.5?"chuyển màu đỏ":s.pH>=8.3?"chuyển màu xanh":"không đổi màu"}`,`${envTxt(s.pH)} (pH ≈ ${fmt(s.pH,1)})`);
            else rec(`Giấy pH + ${s.ten2}`,`giấy pH màu ${UIN[Math.round(C.clamp(s.pH,1,14))]}, so bảng màu: pH ≈ ${Math.round(s.pH)}`,`${envTxt(s.pH)}; pH tính được ${fmt(s.pH,2)}`);refresh()}}}
      /* màu */
      S.tb.forEach((t,i)=>{if(t.ppOn)t.pp=Math.min(1,t.pp+dt/1.1);const f=ppF(SOL[i].pH)*sm(t.pp);const L=tubes[i].liq;L.mat.color=mixc(BASEC,PINK,f*1.1);L.mat.alpha=.46+.36*f});
      for(const row of ["quy","ph"])bits[row].forEach(b=>{if(b._to){b._k=Math.min(1,b._k+dt/.7);b.mat.color=mixc(b._from,b._to,sm(b._k));if(b._k>=1){b.mat.color=b._to;b._to=null}}})}
    function resetTubes(){S.tb=freshTubes();S.anim=null;bits.quy.forEach(b=>{b._to=null;b.mat.color=LPUR});bits.ph.forEach(b=>{b._to=null;b.mat.color=H("#EDC35A")})}

    /* ================= trạm 2: chuẩn độ ================= */
    const fillField=v=>{field.c.fill(v)};
    function relaxField(dt){const T=S.T,f=ppF(pHT(T.v)),k=1-Math.exp(-(T.stir?1.7:.16)*dt),c=field.c;for(let q=0;q<c.length;q++)c[q]+=(f-c[q])*k}
    function fadeAt(u,w,amt){const c=field.c,nx=24,ny=10,nz=24;const ci=u*(nx-1),ck=w*(nz-1);
      for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const d=((i-ci)/3.2)**2+((k-ck)/3.2)**2+((ny-1-j)/(S.T.stir?3.5:6))**2;if(d<1){const q=(k*ny+j)*nx+i;c[q]*=1-Math.min(1,amt*(1-d))}}}
    const HIT={u:.5+.0,w:.5};
    function addAcid(dv){const T=S.T;if(T.v>=50-1e-9)return;dv=Math.min(dv,50-T.v);const rem=Math.max(.02,1-T.v/VEQ);T.v+=dv;
      fadeAt(HIT.u,HIT.w,dv*.6/rem);if(!T.cross&&ppF(pHT(T.v))<.02)T.cross={v:T.v,pH:pHT(T.v)};const ph=pHT(T.v);const last=T.hist[T.hist.length-1];if(T.v-last[0]>.08||Math.abs(ph-last[1])>.15)T.hist.push([T.v,ph])}
    function oneDrop(){const T=S.T;if(T.v>=50)return api.toast("Burette đã hết acid. Bấm “Làm lại”.","info",2000);const d=T.drops.length<6?{y:BU.tip-.02,vy:0}:null;if(d)T.drops.push(d);else addAcid(.05);if(view!=="trunghoa")goView("trunghoa")}
    function stepTit(dt){const T=S.T;const L=lvlOf(T.v);const surf=BK.y0+L;
      if(T.open){addAcid(.6*dt);if(T.v>=50){T.open=false;refresh()}}
      for(let i=T.drops.length-1;i>=0;i--){const d=T.drops[i];d.vy-=9.8*.5*dt;d.y+=d.vy*dt;if(d.y<=surf){T.drops.splice(i,1);addAcid(.05)}}
      relaxField(dt);field.step(dt,T.stir?.9:.12,0);
      /* nhận ra điểm hết màu (khi dung dịch đã đều) */
      if(!T.end&&T.cross){let s=0;const c=field.c;for(let q=0;q<c.length;q++)s+=c[q];if(s/c.length<.02){T.end=true;
        rec(`Nhỏ từ từ HCl 0,01 M vào 20 mL NaOH 0,01 M có phenolphthalein${T.stir?" (có khuấy)":""}`,`màu hồng biến mất khi thêm ${fmt(T.cross.v,2)} mL HCl; lúc đó pH-mét chỉ ${fmt(T.cross.pH,2)}`,"NaOH + HCl → NaCl + H₂O: acid trung hòa base, tạo muối và nước");api.toast("Dung dịch vừa mất màu hồng.","ok",2600);refresh()}}}
    function drawTit(){const T=S.T;const L=lvlOf(T.v),surf=BK.y0+L;
      wv.scl=[1,L/L0,1];wv.mat.uniforms.uH=L;if(frameN%2===0)fTex.update(field.bytes());
      const rem=Math.max(0,50-T.v);const yTop=BU.top-T.v*BU.mlLen,yBot=BU.y0+.004;burLiq.pos=[0,yBot,0];burLiq.scl=[1,Math.max(.001,yTop-yBot),1];burLiq.visible=rem>0;
      handle.quat=G.Q.euler(0,T.open?0:Math.PI/2,0);
      stream.visible=T.open;if(T.open){stream.pos=[BU.x,surf,BU.z];stream.scl=[1,BU.tip-surf,1]}
      tdrops.forEach((m,i)=>{const d=T.drops[i];m.visible=!!d;if(d)m.pos=[BU.x,d.y,BU.z]});
      stirBar.visible=true;if(T.stir)stirBar.quat=G.Q.euler(0,simT*14,0);lamp.mat.color=T.stir?H("#3BE07A"):H("#566078");
      const ph=pHT(T.v);burL.el.innerHTML=`<span>Burette HCl 0,01 M<small>đã dùng ${fmt(T.v,2)} mL</small></span>`;meterL.el.innerHTML=`<span>pH-mét: ${fmt(ph,2)}</span>`}
    function chartSVG(){const T=S.T,small=R.size().w<520,W=small?150:210,Hh=small?70:104,px=v=>8+v/30*(W-14),py=p=>Hh-8-p/14*(Hh-16);const pts=T.hist.concat([[T.v,pHT(T.v)]]).filter(p=>p[0]<=30);
      return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" style="display:block;margin-top:6px" role="img" aria-label="Đồ thị pH theo thể tích HCl">
      <rect x="8" y="${py(14)}" width="${W-14}" height="${py(0)-py(14)}" fill="none" stroke="currentColor" stroke-opacity=".25"/>
      <line x1="8" x2="${W-6}" y1="${py(7)}" y2="${py(7)}" stroke="currentColor" stroke-opacity=".3" stroke-dasharray="3 3"/>
      ${[0,10,20,30].map(v=>`<text x="${px(v)}" y="${Hh-0.5}" font-size="8" text-anchor="middle" fill="currentColor" opacity=".7">${v}</text>`).join("")}
      <text x="2" y="${py(7)+3}" font-size="8" fill="currentColor" opacity=".7">7</text>
      <polyline fill="none" stroke="#FF5C9E" stroke-width="2" points="${pts.map(p=>`${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(" ")}"/>
      ${T.marks.map(m=>`<circle cx="${px(Math.min(30,m[0]))}" cy="${py(m[1])}" r="2.6" fill="#FFE066"/>`).join("")}</svg>`}
    function mark(){const T=S.T,ph=pHT(T.v);T.marks.push([T.v,ph]);rec(`Đo pH khi đã thêm ${fmt(T.v,2)} mL HCl 0,01 M`,`pH-mét chỉ ${fmt(ph,2)}; dung dịch ${ppF(ph)>.05?"màu hồng":"không màu"}`,envTxt(ph));refresh()}
    function resetTit(){S.T=freshT();fillField(ppF(pHT(0)));fTex.update(field.bytes())}

    /* ================= trạm 3: Mg(OH)2 ================= */
    function addHClMg(){const M=S.M;if(M.drops.length)return;if(M.acid>=4)return api.toast("Ống đã đầy. Bấm “Làm lại”.","info",1800);M.drops=[0,.18,.36].map(d=>({t:-d}));if(view!=="mgoh")goView("mgoh")}
    function stepMg(dt){const M=S.M;const surf=.33+.013+.3+M.acid*.035;
      for(let i=M.drops.length-1;i>=0;i--){const d=M.drops[i];d.t+=dt;if(d.t>=.3){M.drops.splice(i,1);M.acid+=.5/3;M.cloud=Math.min(1,M.cloud+.15)}}
      const target=Math.max(0,1-M.acid/2);const k=1-Math.exp(-(M.shake>0?1.4:.25)*dt);if(M.n>target)M.n=Math.max(target,M.n-(M.n-target)*k-(M.n>target?.002:0));
      M.shake=Math.max(0,M.shake-dt);if(M.shake>0)M.cloud=Math.min(1,M.cloud+dt*2.5);else M.cloud=Math.max(0,M.cloud-dt*.35);
      if(!M.rec&&M.n<=.02){M.rec=true;rec("Mg(OH)₂ (rắn) + dung dịch HCl loãng","chất rắn màu trắng tan dần rồi tan hết, dung dịch trong suốt, không màu","Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O: base không tan vẫn tác dụng với acid");api.toast("Mg(OH)₂ đã tan hết.","ok",2200);refresh()}}
    function drawMg(){const M=S.M;const L=.3+M.acid*.035;mgLiq.scl=[1,L/.3,1];
      const cl=M.cloud*Math.min(1,M.n*1.6);mgLiq.mat.color=mixc(BASEC,H("#F3F5F7"),cl);mgLiq.mat.alpha=.42+.48*cl;
      const wob=M.shake>0?Math.sin(simT*26)*.12*Math.min(1,M.shake):0;mgT.quat=G.Q.euler(0,0,wob);
      const n=Math.round(60*M.n),D=grains.data,sc=Math.cbrt(Math.max(M.n,.05));let c=0;
      for(let i=0;i<60&&c<n;i++){const g=GR[i];const lift=M.shake>0?(.1+.3*Math.abs(Math.sin(simT*3+g.ph)))*M.cloud:0;const x=MG.c[0]+g.x+Math.sin(wob)*(.4+g.y),y=.33+g.y+lift,z=MG.c[2]+g.z;D.set([x,y,z,g.s*sc,1,1,1,1],c*8);c++}
      grains.setInstances(c);
      const md=M.drops.find(d=>d.t>0);dropper.visible=dropper.visible||M.drops.length>0;if(M.drops.length){dropper.pos=[MG.c[0],1.55,MG.c[2]]}
      if(md){drop1.visible=true;const k=md.t/.3;drop1.pos=[MG.c[0],1.55-(1.55-(.33+L))*k*k,MG.c[2]]}
      mgL.el.innerHTML=`<span>Mg(OH)₂ + nước<small>${M.acid>0?`đã thêm ${fmt(M.acid,1)} mL HCl · còn ${Math.round(M.n*100)}% chất rắn`:"chất rắn màu trắng lắng đáy"}</small></span>`}
    function resetMg(){S.M=freshM()}

    /* ================= trạm 4: đo pH thực phẩm ================= */
    function dipCup(i){const c=S.cups[i];if(c.t>=0&&c.t<1.6)return;if(c.done)return api.toast(`Đã đo ${CUP[i].ten.toLowerCase()}.`,"info",1600);c.t=0;cups[i].lo.mat.color=H("#EDC35A");if(view!=="doph")goView("doph")}
    function stepCups(dt){S.cups.forEach((c,i)=>{const U=cups[i];if(c.t<0){U.strip.visible=false;return}c.t+=dt;U.strip.visible=true;
        const k=sm(Math.min(1,c.t/.5));const y=.8-.62*k;U.strip.pos=[CX[i]+.06*k,y,CZ];U.strip.quat=G.Q.euler(0,0,-.32*k);
        if(c.t>.55){const f=Math.min(1,(c.t-.55)/.6);U.lo.mat.color=mixc(H("#EDC35A"),uiCol(CUP[i].pH),sm(f))}
        if(c.t>1.4&&!c.done){c.done=true;S.done.cup.add(i);const C1=CUP[i];rec(`Giấy pH + ${C1.ten.toLowerCase()}`,`giấy pH màu ${UIN[Math.round(C.clamp(C1.pH,1,14))]}, so bảng màu: pH ≈ ${Math.round(C1.pH)}`,`${envTxt(C1.pH)} (giá trị tham khảo ${C1.src})`);refresh()}});
      if(CUP[3].gas&&rnd()<dt*30)soda.spawn([CX[3]+(rnd()-.5)*.28,.05+rnd()*.05,CZ+(rnd()-.5)*.28],.006+rnd()*.008,[0,.12+rnd()*.08,0],1.6,.8)}
    function resetCups(){S.cups=CUP.map(()=>({done:false,t:-1}));cups.forEach(u=>{u.strip.visible=false;u.lo.mat.color=H("#EDC35A")})}

    /* ================= con trỏ ================= */
    function pick(px,py){const r=R.ray(px,py);
      for(let i=0;i<6;i++){const x=RK.c[0]+TX[i];if(G.hit.box(r,[x-.13,0,RK.c[2]-.15],[x+.13,1.12,RK.c[2]+.15])!=null)return{tube:i}}
      if(G.hit.box(r,[BK.c[0]-.45,0,BK.c[2]-.45],[BK.c[0]+.45,BK.y0+BK.h,BK.c[2]+.45])!=null)return{beaker:1};
      if(G.hit.box(r,[BU.x-.09,BU.tip,BU.z-.09],[BU.x+.09,BU.y1,BU.z+.09])!=null)return{bur:1};
      if(G.hit.box(r,[MG.c[0]-.25,0,MG.c[2]-.25],[MG.c[0]+.25,1.4,MG.c[2]+.25])!=null)return{mg:1};
      for(let i=0;i<5;i++)if(G.hit.box(r,[CX[i]-.23,0,CZ-.23],[CX[i]+.23,.4,CZ+.23])!=null)return{cup:i};
      return null}
    const ptr=C.pointer(cv,{down(p,e){orbit.start(p,e.pointerId);return true},move(p,e){orbit.move(p,e.pointerId)},up(p,e,tap){orbit.end(e.pointerId);if(tap)onTap(p)},cancel(){orbit.end()},
      hover(p){if(frameN%3)return;const k=pick(p.x,p.y);cv.style.cursor=k?"pointer":"grab"}});
    function onWheel(e){e.preventDefault();zoom=C.clamp(zoom*Math.exp(e.deltaY*.0012),.45,2.4);cam.dist=fitDist(preOf(view).rad)*zoom}
    cv.addEventListener("wheel",onWheel,{passive:false});
    function onTap(p){const k=pick(p.x,p.y);if(!k)return;
      if(k.tube!=null){if(view!=="chithi"){goView("chithi");return}if(!S.tool)return api.toast("Chọn quỳ tím, phenolphthalein hoặc giấy pH ở khay trước.","info",2200);test(S.tool,k.tube);return}
      if(k.bur||k.beaker){if(view!=="trunghoa"){goView("trunghoa");return}oneDrop();return}
      if(k.mg){if(view!=="mgoh"){goView("mgoh");return}addHClMg();return}
      if(k.cup!=null){if(view!=="doph"){goView("doph");return}dipCup(k.cup)}}

    /* ================= khay ================= */
    const IC={
      chithi:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 5v24a5 5 0 0 0 10 0V5"/><path d="M10 18h10" /><rect x="25" y="8" width="7" height="24" rx="1.5" fill="currentColor" opacity=".35"/></svg>',
      trunghoa:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 3v14"/><path d="M18 17h4"/><path d="M20 21v3"/><path d="M9 22h22l-2 14H11z"/><path d="M11 29h18" opacity=".5"/></svg>',
      mgoh:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M14 5v24a6 6 0 0 0 12 0V5"/><circle cx="18" cy="29" r="1.6" fill="currentColor"/><circle cx="22" cy="30" r="1.6" fill="currentColor"/><circle cx="20" cy="27" r="1.4" fill="currentColor"/></svg>',
      doph:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 14h12v18a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3z"/><rect x="25" y="6" width="6" height="26" rx="1.5"/><path d="M25 22h6" /></svg>',
      ban:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 24h32M8 24v10M32 24v10"/><path d="M10 24v-8h6v8M22 24V12h4v12"/></svg>',
      quy:'<svg viewBox="0 0 40 40"><rect x="15" y="4" width="10" height="32" rx="2" fill="#7A4A9A" stroke="currentColor" stroke-width="1.5"/></svg>',
      pp:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 4v8"/><rect x="15" y="12" width="10" height="16" rx="3"/><path d="M20 28v5"/><path d="M20 35c-2 2-2 4 0 4s2-2 0-4z" fill="#E5307F" stroke="none"/></svg>',
      ph:'<svg viewBox="0 0 40 40"><defs><linearGradient id="phg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDC35A"/><stop offset=".55" stop-color="#EDC35A"/><stop offset=".56" stop-color="#E31E24"/><stop offset=".72" stop-color="#7AB648"/><stop offset="1" stop-color="#4B3F99"/></linearGradient></defs><rect x="15" y="4" width="10" height="32" rx="2" fill="url(#phg)" stroke="currentColor" stroke-width="1.5"/></svg>',
      drop:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6c6 9 9 14 9 19a9 9 0 0 1-18 0c0-5 3-10 9-19z"/></svg>',
      valve:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 4v26"/><path d="M12 18h16" stroke-width="3.2"/><path d="M20 33v3"/></svg>',
      stir:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 20a12 6 0 1 0 24 0"/><path d="M32 20a12 6 0 0 0-20-4"/><path d="M14 13l-3 3 4 2"/><rect x="15" y="27" width="10" height="3" rx="1.5" fill="currentColor"/></svg>',
      pen:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 32l4-1 18-18-3-3-18 18z"/><path d="M8 36h24"/></svg>',
      shake:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M16 6v22a4 4 0 0 0 8 0V6"/><path d="M8 12l-3 4 3 4M32 12l3 4-3 4"/></svg>',
      reset:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 20a12 12 0 1 0 4-9L8 15"/><path d="M8 7v8h8"/></svg>'};
    const sw=c=>`<svg viewBox="0 0 40 40"><path d="M10 12h20v18a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4z" fill="${c}" stroke="currentColor" stroke-width="1.5"/></svg>`;
    function refreshDock(){
      const st=`<div class="tseg" role="group" aria-label="Trạm thí nghiệm">${[["chithi","Chỉ thị"],["trunghoa","Trung hòa"],["mgoh","Base không tan"],["doph","Đo pH"],["ban","Cả bàn"]].map(([v,t])=>`<button class="titem" data-k="view" data-v="${v}" aria-pressed="${view===v}">${IC[v]}${t}</button>`).join("")}</div><hr>`;
      let it="";
      if(view==="chithi"||view==="ban")it=`<div class="tgrid">${["quy","pp","ph"].map(k=>`<button class="titem" data-k="tool" data-v="${k}" aria-pressed="${S.tool===k}">${IC[k]}${{quy:"Quỳ tím",pp:"Phenol­phthalein",ph:"Giấy pH"}[k]}</button>`).join("")}<button class="titem" data-k="resetA">${IC.reset}Làm lại</button></div>`;
      else if(view==="trunghoa")it=`<div class="tgrid"><button class="titem" data-k="drop">${IC.drop}Nhỏ 1 giọt</button><button class="titem" data-k="valve" aria-pressed="${S.T.open}">${IC.valve}${S.T.open?"Khóa van":"Mở van"}</button><button class="titem" data-k="stir" aria-pressed="${S.T.stir}">${IC.stir}Khuấy</button><button class="titem" data-k="mark">${IC.pen}Ghi số đo</button></div><button class="titem" data-k="resetT">${IC.reset}Làm lại</button>`;
      else if(view==="mgoh")it=`<div class="tgrid"><button class="titem" data-k="mgadd" ${S.M.acid>=4?"disabled":""}>${IC.drop}Thêm 0,5 mL HCl</button><button class="titem" data-k="shake">${IC.shake}Lắc ống</button></div><button class="titem" data-k="resetM">${IC.reset}Làm lại</button>`;
      else it=`<div class="tgrid">${CUP.map((c,i)=>`<button class="titem" data-k="cup" data-v="${i}" aria-pressed="${S.cups[i].done}">${sw(c.col)}${c.ten.replace("Dung dịch ","")}</button>`).join("")}<button class="titem" data-k="resetC">${IC.reset}Làm lại</button></div>`;
      api.dock.innerHTML=st+it}
    function onDock(e){const t=e.target.closest("[data-k]");if(!t||t.disabled)return;const k=t.dataset.k,v=t.dataset.v;
      if(k==="view"){zoom=1;goView(v);return}
      if(k==="tool"){S.tool=S.tool===v?null:v;if(view!=="chithi")goView("chithi");if(S.tool)api.toast(`Chạm vào một ống nghiệm để thử bằng ${TOOLN[v]}.`,"info",2000);refresh();return}
      if(k==="resetA"){resetTubes();refresh();return}
      if(k==="drop"){oneDrop();return}
      if(k==="valve"){S.T.open=!S.T.open;refresh();return}
      if(k==="stir"){S.T.stir=!S.T.stir;refresh();return}
      if(k==="mark"){mark();return}
      if(k==="resetT"){resetTit();refresh();return}
      if(k==="mgadd"){addHClMg();refresh();return}
      if(k==="shake"){S.M.shake=1.6;return}
      if(k==="resetM"){resetMg();refresh();return}
      if(k==="cup"){dipCup(+v);return}
      if(k==="resetC"){resetCups();refresh()}}
    api.dock.addEventListener("click",onDock);

    /* ================= hướng dẫn ================= */
    const hasAcidBase=set=>[...set].some(i=>SOL[i].pH<7)&&[...set].some(i=>SOL[i].pH>7);
    const doneA=()=>S.done.quy.size>=3&&hasAcidBase(S.done.quy)&&[...S.done.pp].some(i=>SOL[i].pH>7);
    const doneB=()=>S.T.end,doneC=()=>S.M.rec,doneD=()=>S.done.cup.size>=3;
    function refresh(){refreshDock();api.okAt(0,S.locked);api.okAt(1,doneA()&&doneB()&&doneC()&&doneD());
      api.okAt(2,S.obs.a==="base"&&S.obs.b==="du"&&S.obs.c==="yeu"&&S.obs.d==="kiem");api.okAt(3,S.finished);if(bodyEl)renderStep();updateInfo(true)}
    function renderStep(){const el=bodyEl;if(!el)return;const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      const opt=(attr,cur,arr,dis)=>`<div class="opts">${arr.map(([k,t],j)=>`<button class="opt" data-${attr}="${k}" aria-pressed="${cur===k}" ${dis?"disabled":""}><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>`;
      if(stepIdx===0){
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2"><b>Câu 1.</b> Nhỏ phenolphthalein vào dung dịch NaOH, rồi thêm từ từ dung dịch HCl đến dư. Màu dung dịch thay đổi thế nào?</p>
          ${opt("p1",S.p1,[["hong","Không màu → hồng → mất màu hồng"],["xanh","Không màu → xanh → đỏ"],["khong","Không đổi màu"]],S.locked)}
          <p class="lead2"><b>Câu 2.</b> Nước chanh có pH khoảng bao nhiêu?</p>
          ${opt("p2",S.p2,[["2","Khoảng 2–3"],["7","Khoảng 7"],["12","Khoảng 11–12"]],S.locked)}
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}
          <p class="muted" style="font-size:.84rem">Kéo để xoay bàn thí nghiệm, lăn chuột hoặc chụm hai ngón để phóng to.</p>`;
      }else if(stepIdx===1){
        const li=(ok,now,html)=>`<li class="${ok?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${html}</div></li>`;
        el.innerHTML=`<h3>Làm thí nghiệm</h3><ol class="todo">
          ${li(doneA(),!doneA(),`<b>Chất chỉ thị:</b> thử quỳ tím với ít nhất 3 ống (có cả acid và base), nhỏ phenolphthalein vào ít nhất một dung dịch base. Quỳ đã thử: ${S.done.quy.size} ống.`)}
          ${li(doneB(),doneA()&&!doneB(),`<b>Trung hòa:</b> nhỏ HCl vào cốc NaOH có phenolphthalein đến khi dung dịch vừa mất màu hồng. Bấm <b>Ghi số đo</b> ở vài thể tích.`)}
          ${li(doneC(),doneB()&&!doneC(),`<b>Base không tan:</b> thêm HCl vào ống Mg(OH)₂, lắc đến khi chất rắn tan hết.`)}
          ${li(doneD(),doneC()&&!doneD(),`<b>Đo pH:</b> nhúng giấy pH vào ít nhất 3 mẫu thực phẩm, so với bảng màu. Đã đo: ${S.done.cup.size}.`)}</ol>
          ${view==="chithi"&&S.tool?`<div class="callout">Đang cầm <b>${TOOLN[S.tool]}</b>: chạm vào một ống nghiệm.</div>`:""}
          ${gvTip("dừng ở 19,5 mL rồi nhỏ từng giọt: một giọt làm pH đổi vài đơn vị, đó là lí do màu hồng mất “đột ngột”.")}`;
      }else if(stepIdx===2){
        const box=(id,txt,arr,ok,expl)=>`<p class="lead2">${txt}</p><div class="opts">${arr.map(([k,t],j)=>`<button class="opt ${S.obs[id]===k?(k===ok?"right":"wrong"):""}" data-obs="${id}" data-v="${k}"><span class="k">${"ABCD"[j]}</span>${t}</button>`).join("")}</div>${S.obs[id]&&S.obs[id]!==ok?`<div class="callout bad">${expl}</div>`:""}`;
        el.innerHTML=`<h3>Quan sát và lí giải</h3>
          ${box("a","<b>1.</b> Những dung dịch nào làm quỳ tím chuyển màu xanh?",[["acid","HCl và CH₃COOH"],["base","NaOH và Ca(OH)₂"],["trung","Nước cất và NaCl"]],"base","Quỳ tím chuyển xanh trong môi trường base (pH > 7): NaOH, Ca(OH)₂.")}
          ${box("b","<b>2.</b> Khi nhỏ HCl vào NaOH có phenolphthalein, màu hồng mất hẳn khi nào?",[["ngay","Ngay giọt đầu tiên"],["du","Khi lượng HCl vừa đủ trung hòa NaOH"],["khong","Không bao giờ mất"]],"du","Giọt đầu chỉ làm mất màu tại chỗ; khuấy đều thì màu hồng trở lại vì NaOH còn dư. Màu mất hẳn khi HCl vừa đủ (khoảng 20 mL).")}
          ${box("c","<b>3.</b> Cùng nồng độ 0,1 M, vì sao pH của CH₃COOH (khoảng 2,9) lớn hơn của HCl (1,0)?",[["yeu","CH₃COOH là acid yếu, chỉ một phần phân tử tạo ra ion H⁺"],["dac","CH₃COOH đặc hơn HCl"],["base","CH₃COOH là base"]],"yeu","Cùng nồng độ nhưng CH₃COOH tạo ra ít ion H⁺ hơn nên pH lớn hơn.")}
          ${box("d","<b>4.</b> Máu người có pH khoảng 7,35–7,45. Máu có môi trường:",[["acid","Acid"],["kiem","Base rất yếu (gần trung tính)"],["trung","Trung tính tuyệt đối"]],"kiem","pH lớn hơn 7 một chút nên máu có tính base rất yếu.")}`;
      }else{
        const Q=[{k:"a",t:"Dung dịch có pH = 12 là dung dịch:",o:[["a","Acid"],["b","Trung tính"],["c","Base"]],ok:"c",why:{a:"Acid có pH < 7.",b:"Trung tính có pH = 7."}},
          {k:"b",t:"Phương trình đúng của Mg(OH)₂ với HCl:",o:[["a","Mg(OH)₂ + HCl → MgCl + H₂O"],["b","Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O"],["c","Mg(OH)₂ + 2HCl → MgH₂ + Cl₂ + O₂"]],ok:"b",why:{a:"Chưa đúng công thức muối và chưa cân bằng.",c:"Sản phẩm là muối và nước."}},
          {k:"c",t:"Để phân biệt dung dịch CH₃COOH và Ca(OH)₂, có thể dùng:",o:[["a","Quỳ tím"],["b","Nước cất"],["c","Dung dịch NaCl"]],ok:"a",why:{b:"Nước cất không làm đổi màu dung dịch nào.",c:"NaCl không cho hiện tượng."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="hong"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{hong:"không màu → hồng → mất hồng",xanh:"không màu → xanh → đỏ",khong:"không đổi màu"}[S.p1]}</b>. Kết quả: phenolphthalein hóa hồng trong NaOH và mất màu khi HCl vừa đủ.</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="2"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{2:"2–3",7:"7",12:"11–12"}[S.p2]}</b>. Giấy pH cho nước chanh khoảng 2–3.</div>`:""}
          <div class="eq">NaOH + HCl → NaCl + H₂O<br>Mg(OH)₂ + 2HCl → MgCl₂ + 2H₂O</div>
          <ul class="tlist"><li>Base là hợp chất mà phân tử có nguyên tử kim loại liên kết với nhóm hydroxide (OH); khi tan trong nước tạo ra ion OH⁻. Base tan gọi là kiềm.</li><li>Dung dịch base làm quỳ tím hóa xanh, phenolphthalein không màu hóa hồng; base tác dụng với acid tạo muối và nước.</li>
          <li>Thang pH: pH &lt; 7 môi trường acid, pH = 7 trung tính, pH &gt; 7 môi trường base. Dịch vị dạ dày 1,5–3,5; máu 7,35–7,45; nước mưa khoảng 5,6; đất trồng trọt thường 5–8.</li></ul>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],i)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`}}
    function onBody(e){const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}if(d.obs){S.obs[d.obs]=d.v;refresh();return}
      if(d.k==="lock"){S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok")}
      if(d.k==="finish"){S.finished=true;refresh();api.done(`<h2>Hoàn thành: Base · Thang pH</h2><p class="muted">Base đổi màu chất chỉ thị, tác dụng với acid tạo muối và nước; pH cho biết môi trường acid, trung tính hay base.</p>`)}}

    /* ================= khung hình ================= */
    function updateInfo(force){let h="";
      if(view==="chithi"){h=`<div><b>6 dung dịch, 3 chất chỉ thị</b></div><small>${S.tool?`Đang cầm ${TOOLN[S.tool]}: chạm vào ống.`:"Chọn chất chỉ thị ở khay rồi chạm vào ống."}</small>`}
      else if(view==="trunghoa"){const T=S.T,ph=pHT(T.v);h=`<div><b>20 mL NaOH 0,01 M + phenolphthalein</b></div><div>V<sub>HCl</sub> = <b>${fmt(T.v,2)} mL</b> · pH = <b>${fmt(ph,2)}</b></div>${chartSVG()}<small>${T.open?"Van đang mở":"Nhỏ từng giọt gần 20 mL"}${T.stir?" · đang khuấy":""}</small>`}
      else if(view==="mgoh")h=`<div><b>Base không tan + acid</b></div><small>Thêm HCl rồi lắc ống; quan sát chất rắn màu trắng.</small>`;
      else if(view==="doph")h=`<div><b>Đo pH bằng giấy pH</b></div><small>Chọn mẫu ở khay hoặc chạm vào cốc; so màu với bảng.</small>`;
      else h=`<div><b>Bàn thí nghiệm</b></div><small>Chọn trạm ở khay.</small>`;
      if(force||info._h!==h){info.innerHTML=h;info._h=h}
      SOL.forEach((s,i)=>{const t=S.tb[i];const parts=[];if(t.ph!=null)parts.push(`pH ≈ ${Math.round(t.ph)}`);
        const html=`<span>${s.f}${parts.length?`<small>${parts.join(" · ")}</small>`:""}</span>`;const L=tubeLab[i];if(L._h!==html){L.el.innerHTML=html;L._h=html}});
      CUP.forEach((c,i)=>{const html=`<span>${c.ten}${S.cups[i].done?`<small>pH ≈ ${Math.round(c.pH)}</small>`:""}</span>`;const L=cupL[i];if(L._h!==html){L.el.innerHTML=html;L._h=html}})}
    function frame(dt){frameN++;const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      stepTubes(sdt);stepTit(sdt);stepMg(sdt);stepCups(sdt);
      soda.step(sdt,b=>{if(b.p[1]>.27)b.dead=true});
      drawTit();drawMg();R.render(root,simT);LB.update();if(frameN%6===0)updateInfo();
      api.time.label(`t = ${fmt(simT,1)} s · ${{chithi:"chất chỉ thị",trunghoa:"phản ứng trung hòa",mgoh:"base không tan + acid",doph:"đo pH thực phẩm",ban:"bàn thí nghiệm"}[view]}`,null)}
    theme();layout();resetTit();goView("chithi",true);
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{resetTubes();resetTit();resetMg();resetCups();S.tool=null;simT=0;soda.list.length=0;refresh()});
    vp.__lab={get S(){return S},demo(){SOL.forEach((s,i)=>{const t=S.tb[i];t.quy=s.pH;t.ph=s.pH;bits.quy[i].mat.color=litmus(s.pH);bits.ph[i].mat.color=uiCol(s.pH)});[4,5].forEach(i=>{S.tb[i].ppOn=true;S.tb[i].pp=1});refresh()},test,oneDrop,addAcid,addHClMg,dipCup,mark,goView,pHT,SOL,R,pick,setStir(v){S.T.stir=v;refresh()},setOpen(v){S.T.open=v;refresh()},shake(){S.M.shake=1.6}};
    return{step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},layout,prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
