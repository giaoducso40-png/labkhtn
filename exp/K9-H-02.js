/* K9-H-02 · Dãy hoạt động hóa học (SGK KHTN 9 – Kết nối tri thức, Bài 19) · 3D
   Hai trạm:
   1. Khay sứ có giếng: 5 kim loại (Mg, Zn, Fe, Cu, Ag) × 6 dung dịch (HCl 0,5 M, MgSO₄, ZnSO₄, FeSO₄, CuSO₄, AgNO₃ 0,1 M).
      Kim loại mạnh hơn đẩy kim loại yếu hơn ra khỏi dung dịch muối (lớp kim loại bám, màu dung dịch đổi); kim loại đứng trước H đẩy H₂ ra khỏi acid.
   2. Thí nghiệm 3 của bài: dây đồng trong dung dịch AgNO₃ 2% — tinh thể bạc mọc trên dây, dung dịch chuyển dần sang màu xanh.
   Từ bảng kết quả, học sinh tự sắp xếp Mg, Zn, Fe, H, Cu, Ag theo mức độ hoạt động giảm dần. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D;
const fmt=C.fmt,H=G.hex;

/* ---------- hóa học ---------- */
const MET=["Mg","Zn","Fe","Cu","Ag"];
/* tên gọi theo Chương trình GDPT 2018: kẽm, sắt, đồng, bạc giữ tên tiếng Việt; magnesium theo IUPAC */
const NM={Mg:"magnesium",Zn:"kẽm",Fe:"sắt",Cu:"đồng",Ag:"bạc",H:"hydrogen"};
const NMC={Mg:"Magnesium",Zn:"Kẽm",Fe:"Sắt",Cu:"Đồng",Ag:"Bạc"};
const PIECE={Mg:"dải magnesium",Zn:"viên kẽm",Fe:"mẩu đinh sắt",Cu:"đoạn dây đồng",Ag:"đoạn dây bạc"};
const SOLS=[{k:"H",f:"HCl",ten:"HCl 0,5 M",col:"#EAF1F8",a:.42},{k:"Mg",f:"MgSO₄",ten:"MgSO₄",col:"#EAF1F8",a:.42},{k:"Zn",f:"ZnSO₄",ten:"ZnSO₄",col:"#EAF1F8",a:.42},
  {k:"Fe",f:"FeSO₄",ten:"FeSO₄",col:"#BFE0A6",a:.6},{k:"Cu",f:"CuSO₄",ten:"CuSO₄",col:"#3E92E0",a:.78},{k:"Ag",f:"AgNO₃",ten:"AgNO₃",col:"#EAF1F8",a:.42}];
/* thế điện cực chuẩn (V) chỉ dùng để xếp thứ tự và chọn tốc độ minh họa */
const E0={Mg:-2.37,Zn:-.76,Fe:-.44,H:0,Cu:.34,Ag:.80};
const ION2={Mg:"#EAF1F8",Zn:"#EAF1F8",Fe:"#BFE0A6",Cu:"#7DB6EA"};          /* màu dung dịch sau phản ứng theo ion kim loại tạo thành */
const DEP={Cu:"#9A4A26",Ag:"#B9BCC2",Fe:"#2A2B2E",Zn:"#55595F"};           /* màu lớp kim loại bám */
const DEPN={Cu:"lớp chất rắn màu đỏ nâu (đồng)",Ag:"lớp chất rắn màu xám trắng (bạc)",Fe:"lớp chất rắn màu đen xám (sắt)",Zn:"lớp chất rắn màu xám đen (kẽm)"};
const reacts=(m,s)=>m!==s&&E0[m]<E0[s];
const rateK=(m,s)=>reacts(m,s)?.05*Math.sqrt(E0[s]-E0[m]):0;                 /* tiến trình 0→1 mỗi giây (minh họa) */
const H2RATE={Mg:70,Zn:22,Fe:7,Cu:0,Ag:0};                                  /* số bọt khí/giây trong HCl (minh họa) */
function eq(m,s){if(s==="H")return `${m} + 2HCl → ${m}Cl₂ + H₂↑`;if(s==="Ag")return `${m} + 2AgNO₃ → ${m}(NO₃)₂ + 2Ag`;return `${m} + ${s}SO₄ → ${m}SO₄ + ${s}`}
const mixc=(a,b,t)=>a.map((x,i)=>x+(b[i]-x)*C.clamp(t,0,1));
const ORDER=["Mg","Zn","Fe","H","Cu","Ag"];

const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 19)</p>
<ul class="tlist"><li>Tiến hành được thí nghiệm so sánh mức độ hoạt động hóa học của kim loại; trình bày được dãy hoạt động hóa học và ý nghĩa của dãy.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức</b></p>
<ul class="tlist"><li>Làm thí nghiệm 3 của bài (dây đồng + AgNO₃ 2%) trước, rồi dùng khay giếng để mở rộng sang 5 kim loại.</li><li>Yêu cầu học sinh chỉ dùng bằng chứng trong bảng để xếp thứ tự; nhắc: bọt khí nhỏ ở giếng magnesium + muối không phải là phản ứng đẩy kim loại.</li><li>Câu hỏi mở: cần ít nhất những cặp nào để xếp được đủ 6 vị trí?</li></ul>
<p style="margin-top:10px"><b>An toàn khi làm thật</b></p>
<ul class="tlist"><li>AgNO₃ làm đen da, gây hại cho mắt; HCl gây bỏng nhẹ: đeo kính, găng tay. Đánh sạch kim loại bằng giấy nhám trước khi dùng. Thu hồi dung dịch muối kim loại vào bình chứa chất thải, không đổ xuống cống.</li></ul>`;
const SRC=`<ul class="tlist">
<li>Dãy hoạt động hóa học “K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au”; ba thí nghiệm của bài (Na, Fe, Cu với nước; Fe, Cu với HCl khoảng 0,5 M; dây đồng với AgNO₃ 2%): <a href="https://hoatieu.vn/giao-an-hoa-hoc-9-ket-noi-tri-thuc-ca-nam-226174" target="_blank" rel="noopener">giáo án KHTN 9 KNTT Bài 19 (Hoatieu)</a>; ý nghĩa của dãy và các phương trình: <a href="https://download.vn/khoa-hoc-tu-nhien-lop-9-bai-19-ket-noi-tri-thuc-52795" target="_blank" rel="noopener">Download.vn – KHTN 9 Bài 19</a>.</li>
<li>Khay giếng: dung dịch muối 0,1 M, mẩu kim loại cỡ 1 cm đánh sạch; một số dung dịch muối hơi có tính acid nên có thể thấy bọt khí hydrogen, “không tính là kim loại này đẩy kim loại kia”: <a href="https://edu.rsc.org/resources/displacement-reactions-between-metals-and-their-salts/720.article" target="_blank" rel="noopener">RSC – Displacement reactions between metals and their salts</a>.</li>
<li>Dây đồng trong AgNO₃: bạc kim loại tạo thành trên bề mặt đồng, dung dịch chuyển xanh do copper(II) nitrate: <a href="https://chem.washington.edu/lecture-demos/replacement-reaction-silver-copper" target="_blank" rel="noopener">University of Washington – Replacement reaction: silver onto copper</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình (minh họa, không phải số đo)</b></p>
<ul class="tlist"><li>Có phản ứng hay không được xác định theo thứ tự thế điện cực chuẩn: Mg −2,37; Zn −0,76; Fe −0,44; H 0; Cu +0,34; Ag +0,80 (V).</li>
<li>Tốc độ hiện màu được rút ngắn còn vài chục giây và tăng theo hiệu thế điện cực; làm thật thường cần vài phút. Số bọt khí là minh họa.</li>
<li>Màu dung dịch: Cu²⁺ xanh lam, Fe²⁺ lục nhạt, Mg²⁺ và Zn²⁺ không màu. Sắt với AgNO₃ dư có thể tạo thêm Fe³⁺; mô hình chỉ xét Fe²⁺.</li></ul>`;

LabKHTN.register("K9-H-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"km",t:"Kim loại"},{k:"dd",t:"Dung dịch"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Thả kim loại vào giếng; hiện tượng tự ghi vào bảng sau vài giây."},
  gv:GV,sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Bàn thí nghiệm 3D: khay sứ có giếng chứa các dung dịch muối và acid, năm kim loại, ống nghiệm dây đồng trong dung dịch silver nitrate");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let day=api.day,simT=0,view="khay",bodyEl=null,stepIdx=0,frameN=0;
    const rnd=C.rng(9187);
    const S={p1:null,p2:null,locked:false,obs:{},q:{},finished:false,recs:0,wells:{},tube:{on:false,t:0,k:0,rec:false},seq:[],seqOk:false,focus:null,lens:(api.safe().w||0)>=600};
    const key=(m,s)=>m+"|"+s;
    const rec=(km,dd,ht,kl)=>{S.recs++;api.record({lan:String(S.recs),km,dd,ht,kl})};

    /* ================= cảnh ================= */
    const root=new G.Node();root.add(K3.bench(R,5.6,3.1,day));
    const TX=-.55,SP=.3,NC=6,NR=5,TW=NC*SP+.22,TD=NR*SP+.22,TH=.12,WR=.115,WC=.055;
    const wx=j=>TX+(j-(NC-1)/2)*SP,wz=i=>(i-(NR-1)/2)*SP;
    /* khay sứ đúc liền: hộp bo tròn trừ đi các chỏm cầu làm giếng (dựng bằng hàm khoảng cách) */
    const tileG=G.fromSDF((x,y,z)=>{const qx=Math.abs(x)-TW/2+.03,qy=Math.abs(y-TH/2)-TH/2+.03,qz=Math.abs(z)-TD/2+.03;
        let d=Math.hypot(Math.max(qx,0),Math.max(qy,0),Math.max(qz,0))+Math.min(Math.max(qx,qy,qz),0)-.03;
        const j=C.clamp(Math.round(x/SP+(NC-1)/2),0,NC-1),i=C.clamp(Math.round(z/SP+(NR-1)/2),0,NR-1);
        const wd=Math.hypot(x-(j-(NC-1)/2)*SP,y-(TH+WC),z-(i-(NR-1)/2)*SP)-WR;return G.SDF.smax(d,-wd,.012)},
      [-TW/2-.02,-.01,-TD/2-.02],[TW/2+.02,TH+.02,TD/2+.02],[150,14,126]);
    const tile=root.add(R.mesh(tileG,{color:"#F5F3EE",rough:.28,coat:.55,key:"porcelain"}));tile.pos=[TX,0,0];
    /* dung dịch trong giếng */
    const liq={};SOLS.forEach((s,j)=>MET.forEach((m,i)=>{if(m===s.k)return;const n=root.add(R.mesh(G.disk(.088,0,32,true),{color:H(s.col),alpha:s.a,rough:.05,coat:.7,transparent:true,order:1}));
      n.pos=[wx(j),TH-.012,wz(i)];liq[key(m,s.k)]=n}));
    /* giếng trùng kim loại – muối của chính nó: để trống */
    /* mẩu kim loại */
    const coil=(()=>{const p=[];for(let k=0;k<=36;k++){const a=k/36*Math.PI*4;p.push([k/36*.1-.05,Math.sin(a)*.016,Math.cos(a)*.016])}return G.tube(p,.0045,6)})();
    const PG={Mg:G.box(.11,.006,.03,.002,1),Zn:K3.pieceGeom("granule"),Fe:G.lathe([[0,-.061],[.011,-.049],[.011,.049],[.022,.053],[.022,.061],[0,.061]],14),Cu:coil,Ag:G.lathe([[0,-.056],[.007,-.054],[.007,.054],[0,.056]],10)};
    const PM={Mg:{color:"#C9CED5",rough:.3,metal:.9},Zn:{color:"#AEB7C2",rough:.4,metal:.85},Fe:{color:"#8C9198",rough:.42,metal:.9},Cu:{color:"#C77B4C",rough:.3,metal:.95},Ag:{color:"#E4E7EC",rough:.16,metal:.95}};
    const pieces={};
    SOLS.forEach((s,j)=>MET.forEach((m,i)=>{if(m===s.k)return;const n=root.add(R.mesh(PG[m],Object.assign({},PM[m])));n.visible=false;n._base=H(PM[m].color);
      n.scl=m==="Zn"?[.7,.7,.7]:[1.25,1.25,1.25];n._s=n.scl.slice();const th=rnd()*3.1;const qy=G.Q.axis([0,1,0],th);
      n.quat=m==="Fe"||m==="Ag"?G.Q.mul(qy,G.Q.axis([0,0,1],Math.PI/2)):qy;n._dir=[Math.cos(th),0,-Math.sin(th)];n._half=m==="Zn"?.025:m==="Ag"?.065:.07;pieces[key(m,s.k)]=n}));
    /* lớp kim loại bám: các hạt nhỏ mọc trên bề mặt mẩu kim loại */
    const depo=root.add(R.instanced(G.sphere(1,8,6),{color:"#FFFFFF",rough:.6,metal:.25},1600));
    const DP=Array.from({length:44},()=>({u:rnd()*2-1,a:rnd()*6.283,s:.004+rnd()*.005,ph:rnd()}));
    const fizz=root.add(K3.bubbles(R,900));
    /* đĩa đựng kim loại trước khay */
    const dishes=MET.map((m,i)=>{const n=root.add(new G.Node());n.pos=[TX+(i-2)*.38,0,TD/2+.3];n.add(R.mesh(G.lathe([[0,0],[.1,.004],[.115,.022],[.12,.024]],32),{type:"glass",color:"#EAF4FF",alpha:.5}));
      const pc=n.add(R.mesh(PG[m],Object.assign({},PM[m])));pc.pos=[0,m==="Fe"?.03:m==="Ag"?.022:.012,0];pc.scl=m==="Zn"?[.7,.7,.7]:[1.25,1.25,1.25];if(m==="Fe"||m==="Ag")pc.quat=G.Q.euler(0,.6,Math.PI/2);return n});
    /* lọ dung dịch phía sau khay */
    SOLS.forEach((s,j)=>{const n=root.add(new G.Node());n.pos=[wx(j),0,-TD/2-.36];n.add(K3.glass(R,.075,.2,{lip:.01}));
      n.add(R.mesh(K3.liquidGeom(.066,.012,.14,false),{color:H(s.col),alpha:Math.min(.8,s.a+.15),rough:.05,coat:.6,order:1}));
      n.add(R.mesh(G.cylinder(.03,.05,16),{color:"#2B2F38",rough:.5})).pos=[0,.2,0];n.add(R.mesh(G.sphere(.032,16,10),{color:"#30343E",rough:.45})).pos=[0,.27,0]});
    /* ống nghiệm thí nghiệm 3: dây đồng + AgNO₃ 2% */
    const TB={x:2.05,z:0,r:.13,h:1.15,lvl:.55};
    const rack=root.add(new G.Node());rack.pos=[TB.x,0,TB.z];
    const wood={color:"#9C6B3F",rough:.55};
    rack.add(R.mesh(G.box(.5,.05,.42,.02,2),wood)).pos=[0,.025,0];rack.add(R.mesh(G.box(.5,.05,.42,.02,2),wood)).pos=[0,.32,0];
    for(const sx of [-.23,.23])rack.add(R.mesh(G.box(.05,.32,.42,.012,2),wood)).pos=[sx,.17,0];
    const tubeN=root.add(new G.Node());tubeN.pos=[TB.x,.05,TB.z];tubeN.add(K3.testTube(R,TB.r,TB.h));
    const tubeLiq=tubeN.add(R.mesh(K3.liquidGeom(TB.r-.013,.013,TB.lvl,true),{color:H("#EEF3F8"),alpha:.42,rough:.04,coat:.6,order:1}));
    /* dây đồng cuộn lò xo, treo vào que gác miệng ống */
    const wirePts=[];for(let k=0;k<=90;k++){const t=k/90,a=t*Math.PI*14;wirePts.push([Math.cos(a)*.045,.08+t*.42,Math.sin(a)*.045])}
    const handlePts=[];for(let k=0;k<=12;k++)handlePts.push([.045-k/12*.045,.5+k/12*.62,0]);
    const wire=root.add(R.mesh(G.tube(wirePts,.0055,6),{color:"#C77B4C",rough:.3,metal:.75}));wire._base=H("#C77B4C");
    const handle=wire.add(R.mesh(G.tube(handlePts,.0055,6),{color:"#C77B4C",rough:.3,metal:.75}));
    /* tinh thể bạc: các nhánh hạt nhỏ mọc ra từ dây theo kiểu cành cây */
    const xtal=root.add(R.instanced(G.sphere(1,8,6),{color:"#F0F2F5",rough:.3,metal:.3,coat:.5},2600));
    const XT=[];for(let b=0;b<150;b++){const k=Math.floor(rnd()*90);const p0=wirePts[k];let dir=[p0[0],0,p0[2]];const L=Math.hypot(dir[0],dir[2])||1;dir=[dir[0]/L,(rnd()-.5)*.6,dir[2]/L];
      let p=[...p0];const len=4+Math.floor(rnd()*12);const br=[];for(let q=0;q<len;q++){p=[p[0]+dir[0]*.008+(rnd()-.5)*.005,p[1]+dir[1]*.008+(rnd()-.5)*.005,p[2]+dir[2]*.008+(rnd()-.5)*.005];br.push({p:[...p],s:.0042*(1-q/len*.45),d:q/len})}
      XT.push({t0:rnd()*.35,br})}

    /* nhãn */
    const LB=G.labels(over,R,{bounds:api.safe});
    const mk=(v,html,p,dir,len)=>{const it=LB.add(`<span>${html}</span>`,p);it.view=v;if(dir)it.dir=dir;if(len!=null)it.len=len;return it};
    /* tên dung dịch trên lọ phía sau mỗi cột; kí hiệu kim loại ở đầu mỗi hàng và dưới đĩa đựng */
    const colL=SOLS.map((s,j)=>mk("khay",s.f,[wx(j),.3,-TD/2-.36],"n",6));
    const rowL=MET.map((m,i)=>mk("khay",m,[TX-TW/2-.01,TH,wz(i)],"w",8));
    const dishL=MET.map((m,i)=>mk("khay",m,[TX+(i-2)*.38,0,TD/2+.42],"s",4));
    const tubeL=mk("ong","Dung dịch AgNO₃ 2%",[TB.x+TB.r,.42,TB.z],"e",26),wireL=mk("ong","Dây đồng",[TB.x-.02,.95,TB.z],"w",34),xtalL=mk("ong","Tinh thể bạc (Ag)",[TB.x-.05,.36,TB.z],"w",30);
    const banL=[mk("ban","Khay giếng: 5 kim loại × 6 dung dịch",[TX,TH,TD/2],"s",20),mk("ban","Thí nghiệm 3: Cu + AgNO₃",[TB.x,1.25,TB.z],"n",14)];
    const info=document.createElement("div");info.className="gl-legend glass";over.appendChild(info);
    /* kính lúp: khung vẽ lại cảnh từ camera đặt sát giếng/ống đang xem */
    const lensF=document.createElement("div");lensF.className="gl-zoom";lensF.innerHTML=`<div class="zt"></div>`;over.appendChild(lensF);
    let lensRect=null;

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:.05,maxPitch:1.4});
    const PRE={khay:{t:[TX,.08,.12],yaw:0,pitch:.98,rad:1.42},ong:{t:[TB.x,.62,TB.z],yaw:-.15,pitch:.2,rad:.82},ban:{t:[.55,.3,0],yaw:0,pitch:.62,rad:2.6}};
    let safe={x:0,y:0,w:1,h:1},zoom=1;
    function fitDist(rad){const sz=R.size();const tv=Math.tan(cam.fov/2)*safe.h/sz.h,th=Math.tan(cam.fov/2)*(sz.w/sz.h)*safe.w/sz.w;return rad/Math.min(tv,th)}
    function goView(v,instant){view=v;const p=PRE[v];const to={target:p.t,yaw:p.yaw,pitch:p.pitch,dist:fitDist(p.rad)*zoom};if(instant)Object.assign(cam,{target:[...p.t],yaw:p.yaw,pitch:p.pitch,dist:to.dist});else orbit.fly(to,.9);
      for(const it of LB.items)it.on=it.view===v;layoutLens();refresh()}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));const sf=api.safe();const sz=R.size();safe={...sf};
      const wide=sf.w>=600;info.style.left=(sf.x+10)+"px";info.style.top=(sf.y+10)+"px";info.style.width=wide?"262px":(sf.w-20)+"px";info.style.maxWidth=wide?"262px":"none";info.classList.toggle("narrow",!wide);
      if(wide){safe.x+=272;safe.w-=272}else{const ih=Math.min(170,info.offsetHeight||150);safe.y+=ih+12;safe.h-=ih+12}
      cam.shift=[2*(safe.x+safe.w/2)/sz.w-1,1-2*(safe.y+safe.h/2)/sz.h];cam.dist=fitDist(PRE[view].rad)*zoom;
      layoutLens()}
    function layoutLens(){const sf=api.safe();const wide=sf.w>=600;
      /* màn rộng: kính lúp nằm ở cột trái, dưới bảng kết quả, không che cảnh; màn hẹp: góc dưới phải */
      let lx,ly,lw,lh;if(wide){lw=262;lx=sf.x+10;ly=sf.y+10+(info.offsetHeight||(view==="ong"?108:226))+10;lh=Math.max(120,Math.min(230,sf.y+sf.h-10-ly))}
      else{lw=Math.min(178,Math.round(sf.w*.48));lh=132;lx=sf.x+sf.w-lw-10;ly=sf.y+sf.h-lh-10}
      Object.assign(lensF.style,{left:lx+"px",top:ly+"px",width:lw+"px",height:lh+"px"});lensRect={x:lx+1.5,y:ly+23,w:lw-3,h:lh-24.5}}
    function theme(){day=api.day;const E=R.env;
      if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=.55}
      else{E.bgTop=H("#1B2347");E.bgBot=H("#06091A");E.bgGlow=H("#2B3670");E.sky=H("#6070A0");E.gnd=H("#171B2B");E.hor=H("#3E4868");E.exposure=.8;E.ink=0}
      E.k1c=[2.1,2.0,1.85];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9];over.classList.toggle("day",day)}

    /* ================= thao tác ================= */
    function dropWell(m,s,delay){const k=key(m,s);if(m===s||S.wells[k])return false;S.wells[k]={m,s,t:-(delay||0),k:0,rec:false};if(!delay)S.focus=k;return true}
    function dropRow(m){let n=0;SOLS.forEach((s,j)=>{if(dropWell(m,s.k,n*.18))n++});if(n)S.focus=key(m,m==="Cu"?"Ag":m==="Ag"?"Cu":"Cu");if(view!=="khay")goView("khay");
      api.toast(n?`Đã thả ${PIECE[m]} vào ${n} giếng của hàng ${m}.`:`Hàng ${m} đã có kim loại.`,"info",2000);refresh()}
    function dropAll(){let n=0;MET.forEach(m=>SOLS.forEach(s=>{if(dropWell(m,s.k,n*.06))n++}));S.focus="Fe|Cu";if(view!=="khay")goView("khay");refresh()}
    function resetTile(){S.wells={};fizz.list.length=0;refresh()}
    function startTube(){if(S.tube.on)return api.toast("Dây đồng đã ở trong dung dịch.","info",1600);S.tube={on:true,t:0,k:0,rec:false};if(view!=="ong")goView("ong");
      api.toast("Đã nhúng dây đồng vào dung dịch AgNO₃ 2%. Quan sát dây đồng và màu dung dịch.","info",2400);refresh()}
    function resetTube(){S.tube={on:false,t:0,k:0,rec:false};refresh()}

    /* ================= mô phỏng ================= */
    function htText(w){const m=w.m,s=w.s;
      if(s==="H")return H2RATE[m]?`sủi bọt khí ${m==="Mg"?"nhanh, mạnh":m==="Zn"?"vừa phải":"chậm, ít"}${m==="Fe"?"; dung dịch dần có màu lục nhạt":""}`:"không có hiện tượng";
      if(!reacts(m,s))return "không có hiện tượng";
      const sol=SOLS.find(x=>x.k===s);let col="";
      if(s==="Cu")col=m==="Fe"?"; màu xanh của dung dịch nhạt dần, chuyển lục nhạt":"; màu xanh của dung dịch nhạt dần";
      else if(s==="Fe")col="; màu lục nhạt của dung dịch nhạt dần";
      else if(s==="Ag")col=m==="Cu"?"; dung dịch chuyển dần sang màu xanh":m==="Fe"?"; dung dịch chuyển dần sang lục nhạt":"";
      return `${PIECE[m]} phủ dần ${DEPN[s]}${col}${m==="Mg"&&s!=="Ag"?"; có vài bọt khí nhỏ":""}`}
    function klText(w){const m=w.m,s=w.s;
      if(s==="H")return H2RATE[m]?`Có phản ứng: ${eq(m,"H")}. ${NMC[m]} đứng trước H trong dãy hoạt động`:`Không phản ứng: ${NM[m]} đứng sau H trong dãy hoạt động`;
      return reacts(m,s)?`Có phản ứng: ${eq(m,s)}. ${NMC[m]} hoạt động mạnh hơn ${NM[s]}`:`Không phản ứng: ${NM[m]} hoạt động yếu hơn ${NM[s]}`}
    function stepSim(dt){
      for(const k in S.wells){const w=S.wells[k];w.t+=dt;if(w.t<.45)continue;const t=w.t-.45;
        if(w.s!=="H")w.k=Math.min(1,w.k+rateK(w.m,w.s)*dt);else w.k=Math.min(1,w.k+(H2RATE[w.m]?.02:0)*dt);
        /* bọt khí: H₂ trong acid; vài bọt nhỏ khi Mg nằm trong dung dịch muối (dung dịch hơi có tính acid) */
        const j=SOLS.findIndex(x=>x.k===w.s),i=MET.indexOf(w.m);const nb=(w.s==="H"?H2RATE[w.m]*Math.max(.35,1-t/80):w.m==="Mg"&&w.s!=="Ag"?1.2:0)*dt;
        for(let q=0;q<nb+(rnd()<nb%1?1:0);q++){const a=rnd()*6.283,r=rnd()*.04;fizz.spawn([wx(j)+Math.cos(a)*r,.07,wz(i)+Math.sin(a)*r],.003+rnd()*.005,[(rnd()-.5)*.02,.12+rnd()*.06,(rnd()-.5)*.02],.5,.85)}
        const tRec=w.s==="H"?6:reacts(w.m,w.s)?Math.min(14,.3/rateK(w.m,w.s)):10;
        if(!w.rec&&t>=tRec){w.rec=true;rec(NMC[w.m]+` (${w.m})`,w.s==="H"?"HCl 0,5 M":SOLS[j].ten+" 0,1 M",htText(w),klText(w));refresh()}}
      const T=S.tube;if(T.on){T.t+=dt;if(T.t>.9){T.k=Math.min(1,T.k+dt/38)}
        if(!T.rec&&T.k>=.45){T.rec=true;rec("Đồng (Cu) – thí nghiệm 3","AgNO₃ 2%","trên dây đồng có lớp chất rắn màu xám trắng bám và lớn dần; dung dịch từ không màu chuyển dần sang màu xanh",`Có phản ứng: ${eq("Cu","Ag")}. Đồng hoạt động mạnh hơn bạc`);
          api.toast("Đồng đẩy được bạc ra khỏi dung dịch muối: đồng hoạt động mạnh hơn bạc.","ok",2600);refresh()}}}

    /* ================= vẽ ================= */
    function draw(){
      const D=depo.data;let c=0;
      for(const k in pieces){const n=pieces[k],w=S.wells[k];const [m,s]=k.split("|");const j=SOLS.findIndex(x=>x.k===s),i=MET.indexOf(m);
        const L=liq[k],sol=SOLS[j];
        if(!w){n.visible=false;L.mat.color=H(sol.col);L.mat.alpha=sol.a;continue}
        n.visible=true;const f=C.clamp(w.t/.45,0,1);const y1=m==="Zn"?.07:m==="Fe"?.088:m==="Ag"?.078:.066;n.pos=[wx(j),y1+(.42-y1)*(1-f*f),wz(i)];
        /* màu mẩu kim loại ngả dần sang màu lớp bám */
        if(s!=="H"&&reacts(m,s))n.mat.color=mixc(n._base,H(DEP[s]),w.k*.85);else n.mat.color=n._base;
        if(s==="H"&&H2RATE[m]){const sh=1-w.k*.25;n.scl=n._s.map(v=>v*sh)}
        /* màu dung dịch */
        if(s==="H")L.mat.color=m==="Fe"?mixc(H(sol.col),H("#CFE6BC"),w.k):H(sol.col);
        else if(reacts(m,s)){L.mat.color=mixc(H(sol.col),H(ION2[m]),w.k*(s==="Ag"?.55:1));L.mat.alpha=sol.a+(H2RATE[m]&&s==="Ag"&&m==="Cu"?.15*w.k:0)}
        /* hạt kim loại bám */
        if(s!=="H"&&reacts(m,s)&&w.k>.03){const col=H(DEP[s]);const cx=n.pos[0];
          const dr=n._dir,px=-dr[2],pz=dr[0],rr=m==="Zn"?.03:m==="Fe"?.03:.016;
          for(const p of DP){if(p.ph>w.k*1.2)continue;if(c>=1600)break;const g=Math.min(1,(w.k*1.2-p.ph)*3);const ca=Math.cos(p.a)*rr,u=p.u*n._half;
            D.set([cx+dr[0]*u+px*ca,n.pos[1]+.006+Math.abs(Math.sin(p.a))*rr*.6,n.pos[2]+dr[2]*u+pz*ca,p.s*g,col[0],col[1],col[2],1],c*8);c++}}}
      depo.setInstances(c);
      /* ống nghiệm 3 */
      const T=S.tube;const fall=C.clamp(T.t/.9,0,1);const dy=T.on?0:.55;const ease=1-(1-fall)*(1-fall);wire.pos=[TB.x,.05+(T.on?(1-ease)*.6:dy),TB.z];
      wire.mat.color=mixc(wire._base,H("#B5B1AD"),T.k*.6);
      tubeLiq.mat.color=mixc(H("#EEF3F8"),H("#6FAEE8"),T.k*.8);tubeLiq.mat.alpha=.42+.25*T.k;
      const X=xtal.data;let x=0;if(T.on&&T.k>0){for(const b of XT){const g=(T.k-b.t0)/(1-b.t0);if(g<=0)continue;for(const q of b.br){if(q.d>g)break;if(x>=2600)break;
        X.set([q.p[0]+wire.pos[0],q.p[1]+wire.pos[1],q.p[2]+wire.pos[2],q.s*Math.min(1,(g-q.d)*6+.3),1,1,1,1],x*8);x++}}}
      xtal.setInstances(x);
      xtalL.on=view==="ong"&&T.k>.15;
      const th=`<span>Dung dịch AgNO₃ 2%${T.on?`<small>${T.k<.15?"không màu":T.k<.5?"xanh rất nhạt":"xanh lam nhạt, đậm dần"}</small>`:""}</span>`;if(tubeL._h!==th){tubeL.el.innerHTML=th;tubeL._h=th}}
    function grid(){const cell=(m,s)=>{if(m===s)return `<td class="x">·</td>`;const w=S.wells[key(m,s)];if(!w||!w.rec)return `<td>${w?"…":""}</td>`;
        const y=s==="H"?H2RATE[m]>0:reacts(m,s);return `<td class="${y?"y":"n"}">${y?"✓":"–"}</td>`};
      return `<table class="mx" aria-label="Bảng kết quả: kim loại theo hàng, dung dịch theo cột"><thead><tr><th></th>${SOLS.map(s=>`<th>${s.f}</th>`).join("")}</tr></thead><tbody>${MET.map(m=>`<tr><th>${m}</th>${SOLS.map(s=>cell(m,s.k)).join("")}</tr>`).join("")}</tbody></table>`}
    function updateInfo(){let h;
      if(view==="ong"){const T=S.tube;h=`<div><b>Thí nghiệm 3:</b> dây đồng + AgNO₃ 2%</div>${T.on?`<div>${T.k<.08?"Chờ quan sát…":"Tinh thể bạc bám trên dây đồng, dung dịch chuyển xanh"}</div><small>Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag</small>`:`<small>Bấm “Nhúng dây đồng” ở khay.</small>`}`}
      else{const nd=Object.values(S.wells).filter(w=>w.rec).length;h=`<div><b>Bảng kết quả</b> · ${nd}/25 giếng</div>${grid()}<small>✓ có phản ứng · – không phản ứng · chạm vào giếng để thả kim loại của hàng đó</small>`}
      if(info._h!==h){const h0=info.offsetHeight;info.innerHTML=h;info._h=h;if(info.offsetHeight!==h0)layoutLens()}}

    function lensCam(){if(!S.lens||view==="ban")return null;
      if(view==="ong")return S.tube.on?{t:"Kính lúp · dây đồng trong AgNO₃",c:{target:[TB.x,.46,TB.z],yaw:-.15,pitch:.06,dist:.4,fov:.7}}:null;
      const f=S.focus&&S.wells[S.focus]?S.focus:null;if(!f)return null;const [m,s]=f.split("|");const j=SOLS.findIndex(x=>x.k===s),i=MET.indexOf(m);
      return{t:`Kính lúp · ${m} + ${SOLS[j].f}`,c:{target:[wx(j),.075,wz(i)],yaw:0,pitch:.92,dist:.36,fov:.7}}}
    /* ================= con trỏ ================= */
    function pick(px,py){const r=R.ray(px,py);
      const t=G.hit.planeY(r,TH);if(t!=null){const p=[r.o[0]+r.d[0]*t,0,r.o[2]+r.d[2]*t];for(let j=0;j<NC;j++)for(let i=0;i<NR;i++){if(Math.hypot(p[0]-wx(j),p[2]-wz(i))<.13&&MET[i]!==SOLS[j].k)return{well:[MET[i],SOLS[j].k]}}}
      if(G.hit.box(r,[TB.x-.2,0,TB.z-.2],[TB.x+.2,1.25,TB.z+.2])!=null)return{tube:1};
      for(let i=0;i<NR;i++){const d=dishes[i].pos;if(G.hit.box(r,[d[0]-.13,0,d[2]-.13],[d[0]+.13,.08,d[2]+.13])!=null)return{dish:MET[i]}}
      return null}
    const ptr=C.pointer(cv,{down(p,e){orbit.start(p,e.pointerId);return true},move(p,e){orbit.move(p,e.pointerId)},up(p,e,tap){orbit.end(e.pointerId);if(tap)onTap(p)},cancel(){orbit.end()},
      hover(p){if(frameN%3)return;cv.style.cursor=pick(p.x,p.y)?"pointer":"grab"}});
    function onWheel(e){e.preventDefault();zoom=C.clamp(zoom*Math.exp(e.deltaY*.0012),.45,2.4);cam.dist=fitDist(PRE[view].rad)*zoom}
    cv.addEventListener("wheel",onWheel,{passive:false});
    function onTap(p){const k=pick(p.x,p.y);if(!k)return;
      if(k.well){if(view!=="khay"){goView("khay");return}const [m,s]=k.well;if(S.wells[key(m,s)]){S.focus=key(m,s);S.lens=true;refresh();return}dropWell(m,s,0);refresh();return}
      if(k.dish){dropRow(k.dish);return}
      if(k.tube){if(view!=="ong"){goView("ong");return}startTube()}}

    /* ================= khay ================= */
    const IC={
      khay:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="5" y="9" width="30" height="22" rx="4"/><circle cx="13" cy="16" r="2.6"/><circle cx="20" cy="16" r="2.6"/><circle cx="27" cy="16" r="2.6"/><circle cx="13" cy="24" r="2.6"/><circle cx="20" cy="24" r="2.6"/><circle cx="27" cy="24" r="2.6"/></svg>',
      ong:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5v24a5 5 0 0 0 10 0V5"/><path d="M20 4v20" stroke-dasharray="2 2"/></svg>',
      ban:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 24h32M8 24v10M32 24v10"/><path d="M10 24v-8h6v8M22 24V12h4v12"/></svg>',
      all:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 6v18M12 16l8 8 8-8"/><path d="M8 32h24"/></svg>',
      dip:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M20 4v14"/><path d="M15 18c0 4 10 4 10 8s-10 4-10 8"/></svg>',
      reset:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 20a12 12 0 1 0 4-9L8 15"/><path d="M8 7v8h8"/></svg>',
      lens:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="17" cy="17" r="10"/><path d="M25 25l9 9"/></svg>'};
    const MCOL={Mg:"#D4D8DE",Zn:"#B9C1CB",Fe:"#959AA1",Cu:"#D08A5C",Ag:"#ECEEF2"};
    const chip=m=>`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="15" fill="${MCOL[m]}" stroke="currentColor" stroke-width="1.5"/><text x="20" y="25" text-anchor="middle" font-size="13" font-weight="800" fill="#1B1F2E">${m}</text></svg>`;
    function refreshDock(){
      const st=`<div class="tseg" role="group" aria-label="Trạm thí nghiệm">${[["khay","Khay giếng"],["ong","Ống AgNO₃"],["ban","Cả bàn"]].map(([v,t])=>`<button class="titem" data-k="view" data-v="${v}" aria-pressed="${view===v}">${IC[v]}${t}</button>`).join("")}</div><hr>`;
      let it="";
      if(view==="khay"||view==="ban"){const full=m=>SOLS.every(s=>s.k===m||S.wells[key(m,s.k)]);
        it=`<div class="tgrid">${MET.map(m=>`<button class="titem" data-k="row" data-v="${m}" ${full(m)?"disabled":""} title="Thả ${PIECE[m]} vào cả hàng ${m}">${chip(m)}Hàng ${m}</button>`).join("")}<button class="titem" data-k="all" ${MET.every(full)?"disabled":""}>${IC.all}Thả cả khay</button></div><button class="titem" data-k="resetT">${IC.reset}Làm lại khay</button>`}
      if(view==="ong")it=`<button class="titem" data-k="tube" ${S.tube.on?"disabled":""}>${IC.dip}Nhúng dây đồng</button><button class="titem" data-k="resetO">${IC.reset}Làm lại ống</button>`;
      if(view!=="ban")it+=`<button class="titem" data-k="lens" aria-pressed="${S.lens}">${IC.lens}Kính lúp</button>`;
      api.dock.innerHTML=st+it}
    function onDock(e){const t=e.target.closest("[data-k]");if(!t||t.disabled)return;const k=t.dataset.k,v=t.dataset.v;
      if(k==="view"){zoom=1;goView(v)}else if(k==="row")dropRow(v);else if(k==="all")dropAll();else if(k==="resetT")resetTile();else if(k==="tube")startTube();else if(k==="resetO")resetTube();else if(k==="lens"){S.lens=!S.lens;refresh()}}
    api.dock.addEventListener("click",onDock);

    /* ================= hướng dẫn ================= */
    const KEYP=[["Mg","Zn"],["Zn","Fe"],["Fe","H"],["Cu","H"],["Fe","Cu"],["Cu","Ag"]];
    const keyDone=()=>KEYP.every(([m,s])=>S.wells[key(m,s)]&&S.wells[key(m,s)].rec);
    function refresh(){refreshDock();api.okAt(0,S.locked);api.okAt(1,S.tube.rec&&keyDone());
      api.okAt(2,S.obs.a==="cu"&&S.obs.b==="ion"&&S.obs.c==="yeu"&&S.obs.d==="h2");api.okAt(3,S.finished);if(bodyEl)renderStep();info._h=null;updateInfo()}
    function renderStep(){const el=bodyEl;if(!el)return;const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      const opt=(attr,cur,arr,dis)=>`<div class="opts">${arr.map(([k,t],j)=>`<button class="opt" data-${attr}="${k}" aria-pressed="${cur===k}" ${dis?"disabled":""}><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>`;
      if(stepIdx===0){
        el.innerHTML=`<h3>Dự đoán</h3>
          <p class="lead2"><b>Câu 1.</b> Nhúng dây đồng vào dung dịch AgNO₃ (không màu). Sau một thời gian em sẽ thấy:</p>
          ${opt("p1",S.p1,[["khong","Không có hiện tượng gì"],["bac","Có chất rắn màu xám trắng bám trên dây đồng, dung dịch chuyển dần sang màu xanh"],["khi","Dây đồng tan, sủi bọt khí"]],S.locked)}
          <p class="lead2"><b>Câu 2.</b> Trong năm kim loại Mg, Zn, Fe, Cu, Ag, kim loại nào hoạt động hóa học mạnh nhất?</p>
          ${opt("p2",S.p2,[["Mg","Magnesium (Mg)"],["Fe","Sắt (Fe)"],["Ag","Bạc (Ag)"]],S.locked)}
          ${S.locked?`<div class="callout ok">Đã chốt. Bấm <b>Bước tiếp</b>.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}
          <p class="muted" style="font-size:.84rem">Kéo để xoay bàn, lăn chuột hoặc chụm hai ngón để phóng to.</p>`;
      }else if(stepIdx===1){
        const li=(ok,now,html)=>`<li class="${ok?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${html}</div></li>`;
        const d=(m,s)=>S.wells[key(m,s)]&&S.wells[key(m,s)].rec;
        el.innerHTML=`<h3>Làm thí nghiệm</h3><p class="lead2">Chạm vào một giếng để thả mẩu kim loại của hàng đó, hoặc bấm tên kim loại ở khay để thả cả hàng. Hiện tượng tự ghi vào bảng.</p><ol class="todo">
          ${li(S.tube.rec,!S.tube.rec,"<b>Thí nghiệm 3:</b> nhúng dây đồng vào dung dịch AgNO₃ 2% (trạm Ống AgNO₃).")}
          ${li(d("Fe","H")&&d("Cu","H"),S.tube.rec&&!(d("Fe","H")&&d("Cu","H")),"<b>Với acid:</b> Fe và Cu trong HCl 0,5 M.")}
          ${li(d("Fe","Cu")&&d("Cu","Ag"),!(d("Fe","Cu")&&d("Cu","Ag"))&&d("Fe","H"),"<b>Với muối:</b> Fe trong CuSO₄; Cu trong AgNO₃.")}
          ${li(d("Mg","Zn")&&d("Zn","Fe"),!(d("Mg","Zn")&&d("Zn","Fe"))&&d("Fe","Cu"),"<b>Mở rộng:</b> Mg trong ZnSO₄; Zn trong FeSO₄.")}</ol>
          <p class="muted" style="font-size:.84rem">Có thể làm cả khay (25 giếng) để thấy đủ các cặp.</p>
          ${gvTip("hỏi: chỉ với 6 cặp trên có xếp được đủ thứ tự Mg, Zn, Fe, H, Cu, Ag không? Vì sao?")}`;
      }else if(stepIdx===2){
        const box=(id,txt,arr,ok,expl)=>`<p class="lead2">${txt}</p><div class="opts">${arr.map(([k,t],j)=>`<button class="opt ${S.obs[id]===k?(k===ok?"right":"wrong"):""}" data-obs="${id}" data-v="${k}"><span class="k">${"ABC"[j]}</span>${t}</button>`).join("")}</div>${S.obs[id]&&S.obs[id]!==ok?`<div class="callout bad">${expl}</div>`:""}`;
        el.innerHTML=`<h3>Quan sát và lí giải</h3>
          ${box("a","<b>1.</b> Lớp chất rắn màu đỏ nâu bám trên mẩu sắt trong giếng CuSO₄ là:",[["cu","Đồng (Cu) bị sắt đẩy ra khỏi muối"],["gi","Gỉ sắt"],["s","Lưu huỳnh"]],"cu","Fe + CuSO₄ → FeSO₄ + Cu: đồng tạo thành bám lên bề mặt sắt.")}
          ${box("b","<b>2.</b> Vì sao dung dịch AgNO₃ chứa dây đồng chuyển dần sang màu xanh?",[["ion","Đồng tan vào dung dịch thành Cu(NO₃)₂ có màu xanh"],["bac","Bạc có màu xanh"],["khi","Có khí màu xanh thoát ra"]],"ion","Cu + 2AgNO₃ → Cu(NO₃)₂ + 2Ag: ion Cu²⁺ tạo thành làm dung dịch có màu xanh.")}
          ${box("c","<b>3.</b> Đồng để trong dung dịch FeSO₄ không có hiện tượng gì. Điều đó cho biết:",[["yeu","Đồng hoạt động hóa học yếu hơn sắt"],["manh","Đồng hoạt động mạnh hơn sắt"],["it","Dung dịch quá loãng nên chưa phản ứng"]],"yeu","Kim loại yếu hơn không đẩy được kim loại mạnh hơn ra khỏi dung dịch muối.")}
          ${box("d","<b>4.</b> Ở giếng magnesium + dung dịch muối có vài bọt khí nhỏ. Bọt khí đó là:",[["h2","Hydrogen, do dung dịch muối hơi có tính acid; không phải phản ứng đẩy kim loại"],["o2","Oxygen do kim loại bị đẩy ra"],["kk","Không khí trong giếng"]],"h2","Một số dung dịch muối hơi có tính acid nên Mg tạo ra một ít H₂; dấu hiệu đẩy kim loại là lớp kim loại mới bám và màu dung dịch thay đổi.")}`;
      }else{
        const pool=["Cu","H","Ag","Mg","Fe","Zn"];const done=S.seq.length===6;const okSeq=done&&S.seq.every((x,i)=>x===ORDER[i]);
        const Q=[{k:"a",t:"Kim loại nào đẩy được đồng ra khỏi dung dịch CuSO₄?",o:[["a","Ag"],["b","Fe"],["c","Cu"]],ok:"b",why:{a:"Ag đứng sau Cu nên không đẩy được Cu.",c:"Cùng một kim loại thì không có phản ứng đẩy."}},
          {k:"b",t:"Kim loại nào không tác dụng với dung dịch HCl loãng?",o:[["a","Zn"],["b","Fe"],["c","Cu"]],ok:"c",why:{a:"Zn đứng trước H nên đẩy được H₂ ra khỏi acid.",b:"Fe đứng trước H nên đẩy được H₂ ra khỏi acid."}},
          {k:"c",t:"Dựa vào dãy hoạt động hóa học, kim loại nào tác dụng được với nước ở nhiệt độ thường?",o:[["a","Ca"],["b","Fe"],["c","Cu"]],ok:"a",why:{b:"Fe không tác dụng với nước ở nhiệt độ thường.",c:"Cu không tác dụng với nước."}}];
        const all=okSeq&&Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="bac"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{khong:"không có hiện tượng",bac:"có chất rắn xám trắng bám, dung dịch chuyển xanh",khi:"đồng tan, sủi bọt khí"}[S.p1]}</b>. Kết quả: bạc bám trên dây đồng, dung dịch chuyển xanh.</div>`:""}
          ${S.p2?`<div class="callout ${S.p2==="Mg"?"ok":"bad"}">Câu 2 em dự đoán: <b>${NMC[S.p2]}</b>. Magnesium đẩy được kẽm, sắt, đồng, bạc ra khỏi dung dịch muối nên mạnh nhất.</div>`:""}
          <p class="lead2"><b>Sắp xếp</b> theo mức độ hoạt động hóa học <b>giảm dần</b> (chạm lần lượt):</p>
          <div class="seqbox">${S.seq.map(x=>`<span class="mchip m-${x}">${x}</span>`).join('<span class="sep">›</span>')||'<span class="muted">chưa chọn</span>'}</div>
          <div class="opts row">${pool.map(x=>`<button class="opt" data-seq="${x}" ${S.seq.includes(x)||done?"disabled":""}>${x==="H"?"H":x}</button>`).join("")}<button class="opt" data-seq="_reset">Xếp lại</button></div>
          ${done?(okSeq?`<div class="callout ok">Đúng: Mg › Zn › Fe › H › Cu › Ag.</div>`:`<div class="callout bad">Chưa đúng. Đối chiếu bảng: Mg đẩy được Zn; Zn đẩy được Fe; Fe đẩy được H₂ khỏi acid còn Cu thì không; Cu đẩy được Ag.</div>`):""}
          <div class="eq">Dãy hoạt động hóa học: K, Na, Ca, Mg, Al, Zn, Fe, Pb, H, Cu, Ag, Au</div>
          <ul class="tlist"><li>Mức độ hoạt động hóa học của kim loại giảm dần từ trái sang phải.</li><li>Kim loại đứng trước H phản ứng với dung dịch acid (HCl, H₂SO₄ loãng) giải phóng khí H₂.</li><li>Kim loại đứng trước (trừ K, Na, Ca…) đẩy được kim loại đứng sau ra khỏi dung dịch muối.</li><li>Kim loại K, Na, Ca phản ứng với nước ở nhiệt độ thường.</li></ul>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],i)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`}}
    function onBody(e){const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}if(d.p2){S.p2=d.p2;renderStep();return}if(d.q){S.q[d.q]=d.v;renderStep();return}if(d.obs){S.obs[d.obs]=d.v;refresh();return}
      if(d.seq){if(d.seq==="_reset")S.seq=[];else if(!S.seq.includes(d.seq)&&S.seq.length<6)S.seq.push(d.seq);renderStep();return}
      if(d.k==="lock"){S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok")}
      if(d.k==="finish"){S.finished=true;refresh();api.done(`<h2>Hoàn thành: Dãy hoạt động hóa học</h2><p class="muted">Mg › Zn › Fe › H › Cu › Ag: kim loại mạnh hơn đẩy kim loại yếu hơn ra khỏi dung dịch muối; kim loại đứng trước H đẩy được H₂ ra khỏi acid.</p>`)}}

    function frame(dt){frameN++;const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      stepSim(sdt);fizz.step(sdt,b=>{if(b.p[1]>TH-.01&&b.p[0]<TX+TW)b.dead=true});
      draw();R.render(root,simT);
      const lc=lensCam();lensF.hidden=!lc;if(lc&&lensRect){R.renderInset(root,simT,lensRect,lc.c);if(lensF._t!==lc.t){lensF.firstChild.textContent=lc.t;lensF._t=lc.t}}
      LB.update();if(frameN%8===0)updateInfo();
      const nd=Object.keys(S.wells).length;
      api.time.label(`t = ${fmt(simT,1)} s · ${view==="ong"?"dây đồng + AgNO₃":view==="khay"?`khay giếng · ${nd}/25 giếng có kim loại`:"bàn thí nghiệm"}`,view==="ong"&&S.tube.on?S.tube.k:null)}
    theme();layout();goView("khay",true);
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{S.wells={};S.tube={on:false,t:0,k:0,rec:false};fizz.list.length=0;simT=0;refresh()});
    vp.__lab={get S(){return S},dropWell,dropRow,dropAll,resetTile,startTube,resetTube,goView,reacts,R,pick};
    return{step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},layout,prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
