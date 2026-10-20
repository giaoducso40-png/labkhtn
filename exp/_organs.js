/* LabKHTN · BỘ MÁY CƠ QUAN NGƯỜI 3D (dựng theo hình giải phẫu, giản lược cho học sinh THCS)
   Toạ độ chung của cơ thể: y lên trên (rốn ≈ 0, đỉnh vai ≈ 1,6, mu ≈ −1,15), x sang phải người xem (= bên TRÁI người được nhìn), z hướng về người xem.
   - Hệ tiêu hóa: khoang miệng, lưỡi, tuyến nước bọt, hầu, thực quản, dạ dày hình chữ J, gan hai thùy và túi mật, tụy, tá tràng hình chữ C,
     ruột non cuộn nhiều vòng, ruột già có các ngấn (manh tràng, ruột thừa, đại tràng lên – ngang – xuống – sigma), trực tràng, hậu môn.
   - Hệ hô hấp: mũi, họng, thanh quản, khí quản có vòng sụn, cây phế quản phân nhánh, phổi phải 3 thùy, phổi trái 2 thùy có khuyết tim, cơ hoành.
   - Thân người mờ làm nền.
   Mặt cong dựng bằng hàm khoảng cách (LabGL.fromSDF), ống dựng bằng LabGL.tube; màu theo từng loại mô.
   Lưới nặng được dựng trong Web Worker khi trang chạy trên máy chủ (http/https); mở trực tiếp từ tệp thì dựng ngay. */
(function(){
"use strict";
if(window.LabOrgans) return;
const G=window.LabGL,V3=G.V3,H=G.hex;
const smin=(a,b,k)=>{let h=.5+.5*(b-a)/k;h=h<0?0:h>1?1:h;return b+(a-b)*h-k*h*(1-h)};
const smax=(a,b,k)=>-smin(-a,-b,k);
const clamp=(x,a,b)=>x<a?a:x>b?b:x;
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const n3=(x,y,z)=>Math.sin(x*12.9898+y*78.233+z*37.719)*.5+Math.sin(x*4.1+z*3.3)*Math.cos(y*5.7)*.5;/* nhiễu nhẹ, xác định */
/* elip */
const ell=(x,y,z,c,r)=>{const X=(x-c[0])/r[0],Y=(y-c[1])/r[1],Z=(z-c[2])/r[2];const k0=Math.sqrt(X*X+Y*Y+Z*Z);const k1=Math.sqrt(X*X/(r[0]*r[0])+Y*Y/(r[1]*r[1])+Z*Z/(r[2]*r[2]));return k1>1e-9?k0*(k0-1)/k1:-Math.min(...r)};
/* ống có bán kính thay đổi theo đường đi (chuỗi đoạn thẳng, bán kính nội suy) */
function sweep(pts,rf){const S=[];let L=0;const len=[0];for(let i=1;i<pts.length;i++){L+=V3.dist(pts[i],pts[i-1]);len.push(L)}
  for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const bx=b[0]-a[0],by=b[1]-a[1],bz=b[2]-a[2];S.push({a,bx,by,bz,inv:1/(bx*bx+by*by+bz*bz),t0:len[i]/L,t1:len[i+1]/L})}
  return(x,y,z)=>{let d=1e9;for(const s of S){const px=x-s.a[0],py=y-s.a[1],pz=z-s.a[2];let h=(px*s.bx+py*s.by+pz*s.bz)*s.inv;h=h<0?0:h>1?1:h;
    const qx=px-s.bx*h,qy=py-s.by*h,qz=pz-s.bz*h;const r=rf(s.t0+(s.t1-s.t0)*h);const v=Math.sqrt(qx*qx+qy*qy+qz*qz)-r;if(v<d)d=v}return d}}
function paint(g,fn){const n=g.pos.length/3;g.col=new Float32Array(n*4);for(let i=0;i<n;i++){const c=fn(g.pos[i*3],g.pos[i*3+1],g.pos[i*3+2]);g.col[i*4]=c[0];g.col[i*4+1]=c[1];g.col[i*4+2]=c[2];g.col[i*4+3]=1}return g}

/* ================= HỆ TIÊU HÓA ================= */
const COL={stomach:H("#E08A80"),stomach2:H("#C0625B"),liver:H("#8E3328"),liver2:H("#6A251D"),gall:H("#4F7A2F"),pan:H("#E6B48A"),pan2:H("#D19A6C"),
  si:H("#E9A090"),si2:H("#D8857A"),li:H("#D9A07E"),li2:H("#B97C5E"),eso:H("#D98C82"),tongue:H("#D9677A"),gland:H("#E8C08F"),mucosa:H("#C9585E")};
/* dạ dày: hình chữ J — đáy vị phồng ở trên trái người (phải màn hình), thân vị, hang vị thu hẹp tới môn vị ở giữa */
const ST_PATH=[[.36,.66,-.05],[.43,.58,-.02],[.45,.45,.02],[.42,.31,.06],[.33,.21,.09],[.2,.18,.1],[.07,.22,.08],[-.02,.28,.05]];
const ST_R=t=>t<.15?.2+.05*Math.sin(t/.15*Math.PI/2):t<.55?.25-(t-.15)*.16:t<.85?.172-(t-.55)*.29:.085-(t-.85)*.12;
function stomachSDF(){const sw=sweep(G.spline(ST_PATH,6),ST_R);return(x,y,z)=>{let d=sw(x,y,z);/* nếp gấp bờ cong lớn rất nhẹ */return d+.004*Math.sin(x*60+y*40)}}
function buildStomach(res){res=res||56;const f=stomachSDF();const g=G.fromSDF(f,[-.12,.0,-.25],[.68,.9,.35],[res,Math.round(res*1.1),Math.round(res*.75)]);
  return paint(g,(x,y,z)=>mix(COL.stomach,COL.stomach2,clamp(.5+.5*n3(x*3,y*3,z*3)*.6+(.3-z)*.6,0,1)*.55))}
/* gan: thùy phải lớn (trái màn hình), thùy trái mỏng kéo sang phải màn hình; mặt dưới phẳng nghiêng; túi mật dưới thùy phải */
function liverSDF(){return(x,y,z)=>{let d=ell(x,y,z,[-.3,.62,.05],[.46,.31,.3]);d=smin(d,ell(x,y,z,[.16,.68,.08],[.36,.17,.2]),.12);
  d=smax(d,(-(y-.4)+(x+.3)*.25),.06);/* mặt dưới nghiêng */d=smax(d,y-.92-.06*x,.08);/* vòm trên theo cơ hoành */
  d=smax(d,-ell(x,y,z,[.32,.58,.12],[.2,.12,.25]),.05);/* chỗ lõm cho dạ dày */return d}}
function buildLiver(res){res=res||56;const g=G.fromSDF(liverSDF(),[-.82,.28,-.3],[.6,1.0,.4],[res,Math.round(res*.55),Math.round(res*.5)]);
  return paint(g,(x,y,z)=>mix(COL.liver,COL.liver2,clamp(.5+.4*n3(x*5,y*5,z*5)+(.66-y)*.6,0,1)*.6))}
function buildGall(){const g=G.fromSDF((x,y,z)=>ell(x,y,z,[-.18,.47,.2],[.055,.1,.05])-0*0,[-.27,.34,.12],[-.09,.6,.28],[16,22,14]);return paint(g,()=>COL.gall)}
/* tụy: dài, đầu nằm trong vòng tá tràng (trái màn hình), đuôi về phía lách (phải màn hình) */
const PAN_PATH=[[-.12,.19,-.06],[0,.22,-.1],[.15,.26,-.13],[.3,.3,-.15],[.42,.34,-.14]];
function buildPancreas(res){res=res||44;const sw=sweep(G.spline(PAN_PATH,5),t=>.07-.035*t);const f=(x,y,z)=>sw(x,y,z)+.008*Math.sin(x*80)*Math.sin(y*70+z*50);
  const g=G.fromSDF(f,[-.25,.08,-.27],[.52,.44,.02],[res,Math.round(res*.48),Math.round(res*.4)]);return paint(g,(x,y,z)=>mix(COL.pan,COL.pan2,clamp(.5+.5*Math.sin(x*70)*Math.sin(z*60),0,1)))}
/* tá tràng hình chữ C từ môn vị vòng quanh đầu tụy */
const DUO=[[-.02,.28,.05],[-.12,.27,.04],[-.2,.22,.0],[-.22,.12,-.02],[-.18,.05,-.03],[-.06,.04,-.05],[.06,.07,-.07],[.14,.12,-.08]];
/* ruột non: các vòng cuộn trong khung ruột già */
function smallIntestinePath(){const pts=[[.14,.12,-.08],[.2,.06,.0]];const rows=7;
  for(let j=0;j<rows;j++){const y=-.04-j*.1;const dir=j%2?-1:1;const x0=-.3*dir,x1=.32*dir;const N=9;
    for(let i=0;i<=N;i++){const t=i/N;const x=x0+(x1-x0)*t;const z=.12+.07*Math.sin(t*Math.PI*3+j)+(j%3)*.02;const yy=y+.035*Math.sin(t*Math.PI*4+j*1.7);pts.push([x,yy,z])}}
  pts.push([-.12,-.74,.1],[-.3,-.72,.08],[-.44,-.66,.06]);return pts}
/* ruột già: manh tràng (dưới trái màn hình) → đại tràng lên → ngang → xuống → sigma → trực tràng */
const LI_PATH=[[-.47,-.74,.05],[-.5,-.5,.06],[-.52,-.2,.07],[-.5,.04,.08],[-.38,.12,.14],[-.15,.06,.2],[.05,.02,.2],[.25,.06,.17],[.45,.13,.1],[.55,.05,.05],[.55,-.25,.04],[.52,-.55,.04],[.4,-.75,.08],[.2,-.82,.12],[.08,-.92,.05],[0,-1.02,-.04],[0,-1.17,-.02]];
function buildDigestive(){const parts={};
  parts.stomach=buildStomach(58);parts.liver=buildLiver(60);parts.gall=buildGall();parts.pancreas=buildPancreas(46);
  const tubeC=(pts,r,c1,c2,seg,o)=>{const g=G.tube(pts,r,seg||14,o);return paint(g,(x,y,z)=>mix(c1,c2,clamp(.5+.5*n3(x*7,y*7,z*7),0,1)*.6))};
  parts.duo=tubeC(G.spline(DUO,6),.05,COL.si,COL.si2);
  const sip=G.spline(smallIntestinePath(),5);parts.si=tubeC(sip,t=>.052+.004*Math.sin(t*900),COL.si,COL.si2,12);
  const lip=G.spline(LI_PATH,10);const NL=lip.length;
  parts.li=tubeC(lip,t=>{const k=t*(NL-1);const base=t<.06?.12:t>.88?.075+(1-t)*.2:.1;return base*(1+.12*Math.max(0,Math.sin(k*1.1)))},COL.li,COL.li2,18);/* ngấn của ruột già */
  parts.app=tubeC(G.spline([[-.47,-.8,.05],[-.43,-.9,.07],[-.38,-.96,.09]],6),t=>.022-.008*t,COL.li,COL.li2,8,{caps:true});
  parts.eso=tubeC(G.spline([[0,1.98,-.12],[.0,1.7,-.14],[.02,1.3,-.15],[.08,.95,-.14],[.22,.78,-.1],[.36,.66,-.05]],8),.045,COL.eso,COL.mucosa,12);
  /* đầu: khoang miệng, lưỡi, tuyến nước bọt (mang tai, dưới hàm, dưới lưỡi) */
  parts.tongue=paint(G.fromSDF((x,y,z)=>smin(ell(x,y,z,[0,2.12,.18],[.13,.05,.17]),ell(x,y,z,[0,2.07,.03],[.1,.07,.08]),.06),[-.18,1.98,-.1],[.18,2.22,.38],[26,20,32]),()=>COL.tongue);
  const gl=[[[-.24,2.24,-.02],[.06,.1,.06]],[[.24,2.24,-.02],[.06,.1,.06]],[[-.15,2.0,.08],[.05,.035,.06]],[[.15,2.0,.08],[.05,.035,.06]],[[-.06,2.04,.2],[.03,.02,.06]],[[.06,2.04,.2],[.03,.02,.06]]];
  parts.glands=paint(G.fromSDF((x,y,z)=>{let d=1e9;for(const [c,r] of gl)d=Math.min(d,ell(x,y,z,c,r));return d+.006*Math.sin(x*90)*Math.sin(y*80)},[-.33,1.9,-.1],[.33,2.37,.28],[40,32,26]),()=>COL.gland);
  parts.rectum=tubeC(G.spline([[0,-1.02,-.04],[0,-1.12,-.03],[0,-1.2,0]],5),t=>.075-.03*t,COL.li2,COL.mucosa,14);
  return parts}

/* ================= HỆ HÔ HẤP ================= */
const RCOL={lung:H("#E5899A"),lung2:H("#C25F72"),cart:H("#EEE6DA"),airway:H("#E6CFC4"),dia:H("#B5444F"),bron:H("#F1E9E2")};
/* phổi: đỉnh hẹp ở trên xương đòn, đáy rộng lõm theo vòm cơ hoành, mặt trong lõm (rốn phổi); phổi trái có khuyết tim; khe chia thùy */
function lungSDF(side){const s=side==="R"?-1:1;/* R = phổi phải người (trái màn hình) */
  return(x,y,z)=>{const X=x*s;/* đưa về nửa dương */
    let d=ell(X,y,z,[.48,1.0,-.05],[.36,.62,.34]);
    d=smin(d,ell(X,y,z,[.5,.66,-.04],[.39,.3,.36]),.15);/* đáy rộng */
    d=smax(d,-ell(X,y,z,[.48,.2,-.02],[.6,.42,.6]),.08);/* lõm đáy theo cơ hoành */
    d=smax(d,-ell(X,y,z,[.02,.85,.02],[.2,.42,.3]),.06);/* mặt trong (trung thất) */
    if(side==="L")d=smax(d,-ell(X,y,z,[.14,.72,.2],[.2,.22,.2]),.05);/* khuyết tim của phổi trái */
    /* khe chéo (cả hai phổi) và khe ngang (phổi phải) */
    const ob=(y-.95)+(z+.05)*.9-(X-.45)*.1;d=smax(d,-(Math.abs(ob)-.008),.012);
    if(side==="R"){const hz=(y-1.0)-(z-.15)*.05;if(z>-.1+(y-1.0)*.9-.0)d=smax(d,-(Math.abs(hz)-.007),.012)}
    return d+.006*n3(X*20,y*20,z*20)}}
function buildLung(side,res){res=res||60;const s=side==="R"?-1:1;const mn=s>0?[.02,.3,-.45]:[-.92,.3,-.45],mx=s>0?[.92,1.68,.36]:[-.02,1.68,.36];
  const g=G.fromSDF(lungSDF(side),mn,mx,[Math.round(res*.66),res,Math.round(res*.6)]);
  return paint(g,(x,y,z)=>mix(RCOL.lung,RCOL.lung2,clamp(.45+.35*n3(x*9,y*9,z*9)+(.8-y)*.25,0,1)*.7))}
/* cây phế quản: khí quản → phế quản chính → phế quản thùy → các nhánh nhỏ (phân nhánh đôi, xác định) */
function bronchialTree(){const list=[];
  const T=[[0,1.95,-.08],[0,1.55,-.1],[0,1.22,-.11]];
  const branch=(a,dir,len,r,depth)=>{const b=V3.add(a,V3.scale(dir,len));list.push(G.tube([a,b],t=>r*(1-.25*t),8));if(depth<=0)return;
    const up=Math.abs(dir[1])<.9?[0,1,0]:[1,0,0];const s1=V3.norm(V3.cross(dir,up)),s2=V3.cross(dir,s1);const ang=.5+.06*depth;
    for(const sg of [1,-1]){const nd=V3.norm(V3.add(V3.scale(dir,Math.cos(ang)),V3.add(V3.scale(s1,sg*Math.sin(ang)*.85),V3.scale(s2,Math.sin(ang)*.5*(depth%2?1:-1)))));branch(b,nd,len*.72,r*.7,depth-1)}};
  for(const s of [1,-1]){const main=V3.norm([s*.65,-.55,0]);const a=T[2];const len=s>0?.22:.18;const b=V3.add(a,V3.scale(main,len));list.push(G.tube([a,b],.042,10));
    const lobes=s>0?[[.3,.45,0],[.35,-.75,.05]]:[[.3,.55,.0],[.4,-.1,.1],[.3,-.8,.05]];for(const L of lobes)branch(b,V3.norm(L),.17,.03,4)}
  return paint(G.merge(list),()=>RCOL.bron)}
function buildRespiratory(){const parts={};parts.lungR=buildLung("R",62);parts.lungL=buildLung("L",62);parts.tree=bronchialTree();
  /* khí quản có vòng sụn hình chữ C (mặt sau là cơ trơn) */
  const tr=[];for(let k=0;k<11;k++){const y=1.25+k*.065;tr.push(G.lathe([[.072,y],[.08,y+.012],[.08,y+.034],[.072,y+.046]],24))}
  parts.rings=paint(G.merge(tr),()=>RCOL.cart);for(let i=0;i<parts.rings.pos.length/3;i++)parts.rings.pos[i*3+2]-=.11;
  parts.trachea=paint(G.tube([[0,1.97,-.09],[0,1.6,-.11],[0,1.22,-.11]],.068,20),()=>RCOL.airway);
  /* thanh quản: sụn giáp hình lá chắn */
  parts.larynx=paint(G.fromSDF((x,y,z)=>smax(ell(x,y,z,[0,2.03,-.06],[.085,.08,.075]),-ell(x,y,z,[0,2.03,-.1],[.06,.12,.06]),.02),[-.14,1.92,-.17],[.14,2.18,.08],[24,22,22]),()=>RCOL.cart);
  /* cơ hoành: vòm hai bên, phải cao hơn trái */
  parts.dia=paint(G.fromSDF((x,y,z)=>{const top=.58+.12*Math.exp(-((x+.42)**2)*6)+.1*Math.exp(-((x-.42)**2)*6)-.16*z*z-.25*Math.max(0,Math.abs(x)-.6)**2;const r=Math.hypot(x/.95,z/.55);
      return smax(Math.abs(y-top)-.015,r-1,.02)},[-1,.25,-.6],[1,.78,.6],[60,26,36]),(x,y,z)=>mix(RCOL.dia,H("#E8D5C8"),Math.hypot(x/.3,z/.2)<1?.6:0));
  return parts}

/* ================= THÂN NGƯỜI MỜ ================= */
function bodySDF(){return(x,y,z)=>{let d=ell(x,y,z,[0,1.0,-.05],[.78,.75,.42]);d=smin(d,ell(x,y,z,[0,-.1,0],[.64,.78,.42]),.25);d=smin(d,ell(x,y,z,[0,-.9,-.02],[.72,.42,.42]),.2);
  d=smin(d,ell(x,y,z,[0,1.85,-.08],[.16,.25,.15]),.12);d=smin(d,ell(x,y,z,[0,2.38,0],[.32,.42,.36]),.1);
  for(const s of [1,-1])d=smin(d,ell(x,y,z,[s*.92,1.4,-.06],[.22,.18,.2]),.15);return d}}
/* thân người đủ tay chân (dáng đứng thẳng, tay buông) làm nền mờ cho hệ thần kinh */
function bodyFullSDF(){const b=bodySDF();const arm=[1,-1].map(s=>sweep([[s*.8,1.42,-.06],[s*.86,.72,-.08],[s*.9,.04,-.02]],t=>.16-.07*t)),leg=[1,-1].map(s=>sweep([[s*.33,-.9,0],[s*.29,-2.3,.03],[s*.27,-3.66,-.02]],t=>t<.5?.27-.12*t*2:.15-.06*(t-.5)*2));
  return(x,y,z)=>{let d=b(x,y,z);for(let i=0;i<2;i++){const s=i?-1:1;d=smin(d,arm[i](x,y,z),.1);d=smin(d,ell(x,y,z,[s*.92,-.18,0],[.06,.17,.09]),.06);d=smin(d,leg[i](x,y,z),.14);
    d=smin(d,ell(x,y,z,[s*.27,-3.8,.1],[.1,.07,.22]),.06)}return d}}
function buildBodyFull(res){res=res||120;return G.fromSDF(bodyFullSDF(),[-1.15,-3.92,-.5],[1.15,2.85,.4],[Math.round(res*.34),res,Math.round(res*.14)])}
function buildBody(res){res=res||44;return G.fromSDF(bodySDF(),[-1.2,-1.4,-.55],[1.2,2.85,.5],[Math.round(res*.56),res,Math.round(res*.25)])}

/* ================= BỘ XƯƠNG NGƯỜI =================
   Toạ độ riêng: 1 đơn vị ≈ 25 cm; bàn chân y = −4, đỉnh đầu y ≈ 2,8; x sang phải người xem; z hướng về người xem.
   Mỗi phần trả về một lưới riêng để có thể tô sáng, chạm chọn: hộp sọ, cột sống, lồng ngực, đai vai, đai hông, chi trên, chi dưới. */
const BONE=H("#EEE3CC"),BONE2=H("#D9C9A8"),CART=H("#CFE0E6");
const boneCol=(x,y,z)=>mix(BONE,BONE2,clamp(.5+.5*n3(x*6,y*6,z*6),0,1)*.55);
/* xương dài: thân ống, hai đầu phình (lồi cầu) */
function longBone(a,b,r,ra,rb){const L=V3.dist(a,b);const d=V3.norm(V3.sub(b,a));const pts=[];for(let i=0;i<=16;i++)pts.push(V3.add(a,V3.scale(d,L*i/16)));
  const shaft=G.tube(pts,t=>r*(1+.35*Math.pow(Math.abs(t-.5)*2,4)),12);
  const ea=G.fromSDF((x,y,z)=>Math.hypot(x-a[0],y-a[1],z-a[2])-ra,V3.add(a,[-ra*1.2,-ra*1.2,-ra*1.2]),V3.add(a,[ra*1.2,ra*1.2,ra*1.2]),[10,10,10]);
  const eb=G.fromSDF((x,y,z)=>{const p=[x-b[0],y-b[1],z-b[2]];return Math.hypot(p[0]/1.25,p[1],p[2]/.95)-rb},V3.add(b,[-rb*1.5,-rb*1.3,-rb*1.3]),V3.add(b,[rb*1.5,rb*1.3,rb*1.3]),[12,10,10]);
  return G.merge([shaft,ea,eb])}
function buildSkull(){const f=(x,y,z)=>{let d=ell(x,y,z,[0,2.42,-.05],[.34,.36,.42]);/* hộp sọ */
    d=smin(d,ell(x,y,z,[0,2.12,.2],[.25,.24,.2]),.12);/* mặt */d=smin(d,ell(x,y,z,[0,1.9,.2],[.2,.1,.17]),.08);/* hàm trên */
    for(const s of [1,-1])d=smax(d,-ell(x,y,z,[s*.12,2.24,.36],[.085,.075,.12]),.03);/* hốc mắt */
    d=smax(d,-ell(x,y,z,[0,2.07,.42],[.045,.07,.08]),.02);/* hốc mũi */
    for(const s of [1,-1])d=smin(d,ell(x,y,z,[s*.26,2.06,.08],[.05,.05,.12]),.05);/* gò má */
    return d};
  const sk=G.fromSDF(f,[-.4,1.75,-.5],[.4,2.8,.48],[44,56,52]);
  /* xương hàm dưới hình chữ U */const jaw=G.fromSDF((x,y,z)=>{const p=sweep([[-.24,1.98,-.02],[-.2,1.8,.14],[0,1.74,.3],[.2,1.8,.14],[.24,1.98,-.02]],t=>.05-.012*Math.sin(t*Math.PI));return p(x,y,z)},[-.32,1.66,-.1],[.32,2.06,.38],[34,24,28]);
  /* hàm răng */const teeth=[];for(let i=0;i<14;i++){const a=-1.15+i/13*2.3;teeth.push(G.box(.028,.04,.024,.008,1));const t=teeth[i];const cx=Math.sin(a)*.17,cz=.12+Math.cos(a)*.2;for(let k=0;k<t.pos.length/3;k++){t.pos[k*3]+=cx;t.pos[k*3+1]+=1.86;t.pos[k*3+2]+=cz}}
  return paint(G.merge([sk,jaw,...teeth]),boneCol)}
function buildSpine(){const list=[];/* cột sống cong chữ S: 7 đốt cổ, 12 đốt ngực, 5 đốt thắt lưng, xương cùng, xương cụt */
  const P=[[0,1.78,-.12],[0,1.45,-.1],[0,1.1,-.22],[0,.6,-.26],[0,.15,-.16],[0,-.25,-.08],[0,-.55,-.2],[0,-.75,-.26]];const path=G.spline(P,8);
  const N=24;for(let i=0;i<N;i++){const t=i/(N-1)*.83;const k=Math.floor(t*(path.length-1));const c=path[k];const r=i<7?.055:i<19?.07:.085;const h=i<7?.04:i<19?.055:.07;
    const v=G.cylinder(r,h,16);for(let q=0;q<v.pos.length/3;q++){v.pos[q*3]+=c[0];v.pos[q*3+1]+=c[1]-h/2;v.pos[q*3+2]+=c[2]}list.push(v);
    const sp=G.box(.03,.03,.12,.01,1);for(let q=0;q<sp.pos.length/3;q++){sp.pos[q*3]+=c[0];sp.pos[q*3+1]+=c[1]-.01-(i>6&&i<19?.03:0);sp.pos[q*3+2]+=c[2]-.1}list.push(sp)}
  const sac=G.fromSDF((x,y,z)=>ell(x,y,z,[0,-.58,-.2],[.17,.2,.08]),[-.2,-.82,-.3],[.2,-.36,-.1],[18,20,10]);list.push(sac);
  return paint(G.merge(list),boneCol)}
function buildRibcage(){const list=[];for(let k=0;k<12;k++){const y=1.48-k*.12,w=Math.sin(Math.PI*(k+1.2)/13.5),rx=.45+.35*w,rz=.32+.14*w;const L=k<7?.86:k<10?.78:.55;
    for(const sd of [1,-1]){const pts=[];for(let i=0;i<=22;i++){const t=i/22*L,a=Math.PI*(1-.86*t);pts.push([sd*Math.sin(a)*rx,y-.36*t*t+.04*Math.sin(t*Math.PI),-Math.cos(a)*rz-.12])}
      list.push(G.tube(pts,.018,7));if(k<10){const e=pts[pts.length-1];list.push(G.tube(G.spline([e,[sd*.12,y-.38-.03*k,.2+.0],[sd*.04,1.38-k*.07,.24]],4),.012,6))}}}
  const st=G.fromSDF((x,y,z)=>smin(ell(x,y,z,[0,1.12,.25],[.06,.32,.025]),ell(x,y,z,[0,1.45,.24],[.09,.08,.03]),.04),[-.12,.75,.18],[.12,1.56,.31],[12,40,10]);list.push(st);
  return paint(G.merge(list),boneCol)}
function buildShoulders(){const list=[];for(const s of [1,-1]){list.push(G.tube(G.spline([[s*.04,1.56,.2],[s*.25,1.6,.16],[s*.48,1.62,.02]],5),.025,8));
    list.push(G.fromSDF((x,y,z)=>{const X=x*s;return smax(ell(X,y,z,[.4,1.32,-.36],[.2,.26,.04]),-((y-1.6)+(X-.3)*1.2),.02)},s>0?[.15,1.0,-.45]:[-.65,1.0,-.45],s>0?[.65,1.62,-.28]:[-.15,1.62,-.28],[20,26,8]))}
  return paint(G.merge(list),boneCol)}
function buildPelvis(){const f=(x,y,z)=>{let d=1e9;for(const s of [1,-1]){const X=x*s;d=Math.min(d,smax(ell(X,y,z,[.36,-.48,-.06],[.24,.3,.14]),Math.abs((z+.06)-(X-.36)*.35)-.03,.02));/* cánh chậu */
      d=smin(d,ell(X,y,z,[.28,-.85,.06],[.14,.12,.08]),.06)}/* ụ ngồi, ổ cối */
    d=smin(d,sweep([[-.18,-.86,.16],[0,-.8,.2],[.18,-.86,.16]],()=>.035)(x,y,z),.06);/* khớp mu */
    for(const s of [1,-1])d=smax(d,-ell(x,y,z,[s*.18,-.92,.12],[.08,.07,.12]),.02);/* lỗ bịt */
    return d};return paint(G.fromSDF(f,[-.66,-1.05,-.3],[.66,-.15,.32],[60,44,30]),boneCol)}
function buildArm(s){/* s=1: tay trái người (phải màn hình); khuỷu gập theo góc truyền vào sau */
  const sh=[s*.62,1.5,-.08],el=[s*.74,.72,-.1],wr=[s*.8,.02,-.02];const parts={};
  parts.upper=paint(longBone(sh,el,.035,.075,.055),boneCol);
  parts.lower=paint(G.merge([longBone(el,V3.add(wr,[s*.04,0,.03]),.022,.04,.035),longBone(V3.add(el,[-s*.03,0,-.02]),V3.add(wr,[-s*.04,0,-.02]),.02,.035,.03)]),boneCol);
  const hand=[];for(let f=0;f<5;f++){const a=(f-2)*.06,b=[wr[0]+s*(f-2)*.035,wr[1]-.08,wr[2]+(f===0?.06:0)];hand.push(G.tube(G.spline([b,V3.add(b,[s*a*.6,-.18+(f===0?.08:0),f===0?.05:0]),V3.add(b,[s*a,-.32+(f===0?.13:0)+(f===4?.06:0),f===0?.08:0])],4),.013,6))}
  hand.push(G.fromSDF((x,y,z)=>ell(x,y,z,[wr[0],wr[1]-.04,wr[2]],[.09,.05,.035]),[wr[0]-.12,wr[1]-.12,wr[2]-.06],[wr[0]+.12,wr[1]+.03,wr[2]+.06],[14,10,8]));
  parts.hand=paint(G.merge(hand),boneCol);parts.joints={sh,el,wr};return parts}
function buildLeg(s){const hip=[s*.3,-.82,.02],kn=[s*.27,-2.3,.04],an=[s*.26,-3.78,-.02];const parts={};
  parts.femur=paint(G.merge([longBone(hip,kn,.042,.085,.08),G.fromSDF((x,y,z)=>Math.hypot(x-hip[0]-s*-.03,y-hip[1]-.02,z-hip[2])-.075,V3.add(hip,[-.12,-.1,-.1]),V3.add(hip,[.12,.12,.1]),[10,10,10])]),boneCol);
  parts.patella=paint(G.fromSDF((x,y,z)=>ell(x,y,z,[kn[0],kn[1]+.02,kn[2]+.1],[.055,.065,.03]),V3.add(kn,[-.08,-.07,.05]),V3.add(kn,[.08,.11,.15]),[10,12,8]),boneCol);
  parts.shin=paint(G.merge([longBone(kn,an,.034,.075,.05),longBone(V3.add(kn,[s*.08,-.08,-.03]),V3.add(an,[s*.08,0,-.03]),.017,.03,.035)]),boneCol);
  const foot=[G.fromSDF((x,y,z)=>smin(ell(x,y,z,[an[0],an[1]-.12,an[2]+.08],[.09,.07,.2]),ell(x,y,z,[an[0],an[1]-.16,an[2]-.06],[.06,.06,.08]),.05),V3.add(an,[-.14,-.26,-.18]),V3.add(an,[.14,-.02,.34]),[12,12,22])];
  for(let f=0;f<5;f++){const b=[an[0]+s*(f-2)*.03,an[1]-.15,an[2]+.26];foot.push(G.tube([b,V3.add(b,[0,-.03,.12-f*.012])],.012,6))}
  parts.foot=paint(G.merge(foot),boneCol);parts.joints={hip,kn,an};return parts}
function buildSkeleton(){const P={skull:buildSkull(),spine:buildSpine(),ribs:buildRibcage(),shoulder:buildShoulders(),pelvis:buildPelvis()};
  for(const s of [1,-1]){const a=buildArm(s),l=buildLeg(s);const k=s>0?"L":"R";P["arm"+k]=G.merge([a.upper,a.lower,a.hand]);P["leg"+k]=G.merge([l.femur,l.patella,l.shin,l.foot])}
  return P}
/* cánh tay có thể gập: trả về từng đoạn riêng (cánh tay, cẳng tay + bàn tay), cơ hai đầu và cơ ba đầu */
function buildArmRig(){const a=buildArm(1);const el=a.joints.el;
  const fore=G.merge([a.lower,a.hand]);for(let i=0;i<fore.pos.length/3;i++){fore.pos[i*3]-=el[0];fore.pos[i*3+1]-=el[1];fore.pos[i*3+2]-=el[2]}
  return{upper:a.upper,fore,joints:a.joints}}

/* ================= NHIỄU PERLIN (dùng cho nếp cuộn não) ================= */
const PERM=(()=>{const p=[];for(let i=0;i<256;i++)p[i]=i;let s=1234567;for(let i=255;i>0;i--){s=(s*16807)%2147483647;const j=s%(i+1);[p[i],p[j]]=[p[j],p[i]]}return p.concat(p)})();
const fade=t=>t*t*t*(t*(t*6-15)+10),lerp=(a,b,t)=>a+(b-a)*t;
const grad=(h,x,y,z)=>{h&=15;const u=h<8?x:y,v=h<4?y:h===12||h===14?x:z;return((h&1)?-u:u)+((h&2)?-v:v)};
function perlin(x,y,z){let X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z);x-=X;y-=Y;z-=Z;X&=255;Y&=255;Z&=255;const u=fade(x),v=fade(y),w=fade(z);const P=PERM;
  const A=P[X]+Y,AA=P[A]+Z,AB=P[A+1]+Z,B=P[X+1]+Y,BA=P[B]+Z,BB=P[B+1]+Z;
  return lerp(lerp(lerp(grad(P[AA],x,y,z),grad(P[BA],x-1,y,z),u),lerp(grad(P[AB],x,y-1,z),grad(P[BB],x-1,y-1,z),u),v),
    lerp(lerp(grad(P[AA+1],x,y,z-1),grad(P[BA+1],x-1,y,z-1),u),lerp(grad(P[AB+1],x,y-1,z-1),grad(P[BB+1],x-1,y-1,z-1),u),v),w)}
/* khoét rãnh gần bề mặt: g ≈ khoảng cách tới mặt giữa rãnh, w nửa bề rộng, dep độ sâu */
const groove=(d,g,w,dep)=>Math.max(d,Math.min(w-Math.abs(g),d+dep));
const segD2=(py,pz,a,b)=>{const by=b[0]-a[0],bz=b[1]-a[1];let h=((py-a[0])*by+(pz-a[1])*bz)/(by*by+bz*bz);h=h<0?0:h>1?1:h;return Math.hypot(py-a[0]-by*h,pz-a[1]-bz*h)};

/* ================= NÃO BỘ =================
   Hệ toạ độ riêng của não: x sang bên, y lên trên, z ra phía trước (trán); 1 đơn vị = 10 cm.
   Đại não dài khoảng 16–17 cm, rộng khoảng 14 cm; hai bán cầu ngăn bởi khe dọc; rãnh bên (khe Sylvius) tách thùy thái dương, rãnh trung tâm;
   các nếp cuộn tạo bằng đường đồng mức 0 của nhiễu Perlin. Tiểu não có các lá song song, nằm dưới thùy chẩm; trụ não nối xuống tủy sống. */
const BCOL={cer:H("#E3B3AA"),cerD:H("#B97F78"),cb:H("#D49A94"),cbD:H("#9E6661"),st:H("#E6C2B4")};
const gyri=(x,y,z)=>perlin(x*6.2+11,y*6.2+3,z*6.2+7)+.35*perlin(x*13+2,y*13+5,z*13+1);
function cerebrumSDF(){return(x,y,z)=>{const X=Math.abs(x);
  let d=ell(X,y,z,[.355,.06,0],[.36,.47,.83]);
  d=smin(d,ell(X,y,z,[.47,-.2,.16],[.23,.2,.4]),.1);              /* thùy thái dương */
  d=smax(d,-(y+.4),.06);
  d=smax(d,.012-X,.006);                                          /* khe dọc giữa hai bán cầu */
  /* rãnh bên (khe Sylvius) và rãnh trung tâm */
  d=groove(d,Math.min(segD2(y,z,[-.08,.42],[.08,-.12]),segD2(y,z,[.08,-.12],[.2,-.3]))+(X<.4?.5:0),.022,.09);
  {const zc=.02+(.5-y)*.32;d=groove(d,(z-zc)*.9+(X<.03||y<.02?.5:0),.016,.06)}
  d=groove(d,gyri(x,y,z)*.07,.0085,.045);
  return d}}
function buildBrain(res){res=res||120;const P={};
  const f=cerebrumSDF();const g=G.fromSDF(f,[-.76,-.46,-.88],[.76,.56,.88],[Math.round(res*.86),Math.round(res*.58),res]);
  P.cerebrum=paint(g,(x,y,z)=>{const n=Math.abs(gyri(x,y,z));const sul=n<.03?1-n/.03:0;return mix(BCOL.cer,BCOL.cerD,clamp(sul*.85+.15*(1-y)*.5,0,1))});
  /* tiểu não: các lá (folia) là những nếp cong song song quanh tâm */
  const cbf=(x,y,z)=>{let d=ell(x,y,z,[0,-.36,-.5],[.5,.22,.3]);d=smin(d,ell(x,y,z,[0,-.42,-.42],[.2,.17,.24]),.05);
    const r=Math.hypot(y+.2,z+.28);d=groove(d,Math.sin(r*92)*.012,.0035,.02);d=groove(d,Math.abs(x)-.0,.02,.03);return d};
  P.cerebellum=paint(G.fromSDF(cbf,[-.53,-.6,-.82],[.53,-.12,-.18],[Math.round(res*.6),Math.round(res*.3),Math.round(res*.38)]),(x,y,z)=>{const r=Math.hypot(y+.2,z+.28);return mix(BCOL.cb,BCOL.cbD,clamp(.5+.5*Math.sin(r*92)*1.4,0,1)*.6)});
  /* trụ não (não giữa, cầu não, hành não) */
  const sw=sweep([[0,-.1,-.08],[0,-.3,-.14],[0,-.52,-.2],[0,-.78,-.24]],t=>.12-.045*t);
  const stf=(x,y,z)=>smin(sw(x,y,z),ell(x,y,z,[0,-.34,-.08],[.15,.11,.12]),.06);
  P.stem=paint(G.fromSDF(stf,[-.2,-.8,-.4],[.2,-.02,.08],[34,62,40]),()=>BCOL.st);
  return P}

/* ================= CẦU MẮT (cắt đôi theo mặt phẳng chứa trục nhìn) =================
   Trục nhìn theo x, ánh sáng đi từ −x vào; 1 đơn vị = 1 cm (cầu mắt đường kính khoảng 2,4 cm). Giữ phần z ≤ 0 để nhìn thấy bên trong. */
const ECOL={scl:H("#F4F1EC"),cho:H("#5A2A22"),ret:H("#E9937A"),mac:H("#E8C24A"),iris:H("#6B4226"),iris2:H("#A0703F"),cil:H("#7A3E30"),nerve:H("#F1E3C8"),lens:H("#F3F0E2")};
const cutZ=d=>(x,y,z)=>Math.max(d(x,y,z),z);
const sph=(x,y,z,c,r)=>Math.hypot(x-c[0],y-c[1],z-c[2])-r;
function buildEye(){const P={};
  P.sclera=paint(G.fromSDF(cutZ((x,y,z)=>{let d=Math.max(sph(x,y,z,[0,0,0],1.2),-sph(x,y,z,[0,0,0],1.13));d=Math.max(d,-(x+.98));
    const on=[Math.cos(-.26)*1.16,Math.sin(-.26)*1.16];d=Math.max(d,-(Math.hypot(x-on[0],y-on[1],z)-.16));return d}),[-1.05,-1.25,-1.25],[1.25,1.25,.02],[84,88,46]),()=>ECOL.scl);
  P.choroid=paint(G.fromSDF(cutZ((x,y,z)=>{let d=Math.max(sph(x,y,z,[0,0,0],1.13),-sph(x,y,z,[0,0,0],1.075));d=Math.max(d,-(x+.78));
    const on=[Math.cos(-.26)*1.1,Math.sin(-.26)*1.1];d=Math.max(d,-(Math.hypot(x-on[0],y-on[1],z)-.15));return d}),[-.85,-1.16,-1.16],[1.16,1.16,.02],[74,84,42]),()=>ECOL.cho);
  P.retina=paint(G.fromSDF(cutZ((x,y,z)=>{let d=Math.max(sph(x,y,z,[0,0,0],1.075),-sph(x,y,z,[0,0,0],1.035));d=Math.max(d,-(x+.72));
    const on=[Math.cos(-.26)*1.05,Math.sin(-.26)*1.05];d=Math.max(d,-(Math.hypot(x-on[0],y-on[1],z)-.14));
    d=Math.max(d,-(Math.hypot(x-1.07,y,z)-.05));return d}),[-.8,-1.1,-1.1],[1.1,1.1,.02],[72,82,40]),(x,y,z)=>mix(ECOL.ret,H("#C9614F"),clamp((1-x)*.25,0,1)));
  /* điểm vàng: chỗ lõm nhỏ màu vàng ở cực sau trên trục nhìn */
  P.macula=paint(G.fromSDF(cutZ((x,y,z)=>Math.max(Math.max(sph(x,y,z,[0,0,0],1.075),-sph(x,y,z,[0,0,0],1.025)),Math.hypot(y,z)-.16)),[.9,-.2,-.2],[1.1,.2,.02],[24,40,22]),()=>ECOL.mac);
  /* giác mạc: chỏm cầu trong suốt lồi phía trước */
  P.cornea=G.fromSDF(cutZ((x,y,z)=>{let d=Math.max(sph(x,y,z,[-.585,0,0],.78),-sph(x,y,z,[-.585,0,0],.725));return Math.max(d,x+.97)}),[-1.4,-.75,-.75],[-.9,.75,.02],[40,70,36]);
  /* mống mắt (lòng đen) và đồng tử (con ngươi) */
  P.iris=paint(G.fromSDF(cutZ((x,y,z)=>{const r=Math.hypot(y,z);return Math.max(Math.abs(x+.93)-.025,Math.max(r-.62,.2-r))}),[-.98,-.66,-.66],[-.88,.66,.02],[12,72,38]),
    (x,y,z)=>{const a=Math.atan2(z,y),r=Math.hypot(y,z);return mix(ECOL.iris,ECOL.iris2,clamp(.5+.5*Math.sin(a*46)*.8+(r<.32?.3:0),0,1))});
  /* thể thủy tinh: thấu kính hai mặt lồi, mặt trước cong ít hơn mặt sau */
  P.lens=G.fromSDF(cutZ((x,y,z)=>Math.max(sph(x,y,z,[.1,0,0],1.0),sph(x,y,z,[-1.1,0,0],.6))),[-.92,-.5,-.5],[-.48,.5,.02],[30,56,30]);
  /* thể mi (cơ thể mi) và dây chằng treo thể thủy tinh */
  const cil=(x,y,z)=>{const r=Math.hypot(y,z);return Math.hypot(x+.78,(r-.66))*1-.07};
  P.ciliary=paint(G.fromSDF(cutZ(cil),[-.9,-.78,-.78],[-.66,.78,.02],[16,72,38]),()=>ECOL.cil);
  const zon=[];for(let k=0;k<18;k++){const a=Math.PI+k/17*Math.PI;const c=Math.cos(a),s=Math.sin(a);zon.push(G.tube([[-.77,.6*c,.6*s],[-.7,.43*c,.43*s]],.006,4))}P.zonule=G.merge(zon);
  /* dây thần kinh thị giác đi ra ở điểm mù (lệch khỏi trục khoảng 15°) */
  const a0=-.26,on=[Math.cos(a0),Math.sin(a0)];P.nerve=paint(G.fromSDF(cutZ(sweep([[on[0]*1.0,on[1]*1.0,0],[on[0]*1.5,on[1]*1.5,0],[on[0]*2.1+.1,on[1]*2.1-.1,0]],t=>.16+.02*t)),[.8,-1.1,-.24],[2.3,.1,.02],[56,46,10]),()=>ECOL.nerve);
  /* dịch thủy tinh trong suốt lấp đầy khoang sau */
  P.vitreous=G.fromSDF(cutZ((x,y,z)=>Math.max(sph(x,y,z,[0,0,0],1.03),-(x+.5)-.0+Math.min(0,sph(x,y,z,[-1.1,0,0],.6))*0)),[-.6,-1.05,-1.05],[1.05,1.05,.02],[48,60,30]);
  return P}

/* ================= ĐOẠN TỦY SỐNG (lát cắt ngang) =================
   Trục tủy theo y; mặt cắt phía trên (y = 0) lộ chất xám hình cánh bướm ở giữa, chất trắng bao ngoài; sừng sau hướng −z, sừng trước hướng +z. Đơn vị tùy ý, bán kính tủy 0,5. */
const butterfly=(x,z)=>{const X=Math.abs(x);/* hình cánh bướm (chữ H) */
  const post=Math.hypot((X-.17)/.09,(z+.2)/.26)-1,ant=Math.hypot((X-.2)/.15,(z-.17)/.2)-1,bar=Math.max(Math.abs(z)-.06,X-.2);
  return Math.min(post,ant,bar/.1)};
function buildCordSeg(){const P={};
  const f=(x,y,z)=>{const r=Math.hypot(x/1.12,z);let d=Math.max(r-.5,Math.abs(y+.35)-.35);d=Math.max(d,-(Math.hypot(x,z+.52)-.06));d=Math.max(d,-(Math.hypot(x,z-.54)-.09));return d};
  P.cord=paint(G.fromSDF(f,[-.6,-.75,-.58],[.6,.05,.58],[56,40,54]),(x,y,z)=>y>-.012&&butterfly(x,z)<0?H("#8E8C99"):H("#F2ECDF"));
  return P}

/* ================= HỆ BÀI TIẾT (nước tiểu): thận hình hạt đậu, niệu quản, bóng đái, niệu đạo ================= */
function buildUrinary(){const P={};
  const kid=(x,y,z)=>{let d=1e9;for(const s of [1,-1]){const X=x*s;let k=ell(X,y,z,[.3,.42,-.3],[.12,.21,.085]);k=smax(k,-ell(X,y,z,[.19,.4,-.28],[.07,.08,.08]),.04);/* rốn thận lõm vào phía trong */d=Math.min(d,k)}return d+.004*Math.sin(y*60)};
  P.kidney=paint(G.fromSDF(kid,[-.45,.18,-.42],[.45,.66,-.18],[64,40,22]),(x,y,z)=>mix(H("#8B3A2E"),H("#A9483A"),clamp(.5+.5*Math.sin(y*30+x*20),0,1)*.6));
  const ur=[];for(const s of [1,-1])ur.push(G.tube(G.spline([[s*.2,.38,-.27],[s*.18,.1,-.22],[s*.16,-.4,-.18],[s*.12,-.85,-.05],[s*.05,-.98,.04]],6),.016,8));
  P.ureter=paint(G.merge(ur),()=>H("#E8C9A0"));
  P.bladder=paint(G.fromSDF((x,y,z)=>smin(ell(x,y,z,[0,-1.02,.08],[.15,.12,.12]),ell(x,y,z,[0,-1.13,.07],[.05,.06,.05]),.04),[-.18,-1.22,-.07],[.18,-.88,.23],[26,26,24]),()=>H("#E7B3A0"));
  P.urethra=paint(G.tube([[0,-1.13,.07],[0,-1.25,.08],[0,-1.33,.1]],.014,8),()=>H("#E8C9A0"));
  return P}
/* ================= HỆ TUẦN HOÀN: động mạch (đỏ) và tĩnh mạch (xanh) lớn đi khắp cơ thể ================= */
function buildVessels(){const A=[],V=[];const art=(pts,r)=>A.push(G.tube(G.spline(pts,6),r,8)),ven=(pts,r)=>V.push(G.tube(G.spline(pts,6),r,8));
  /* cung động mạch chủ, động mạch chủ ngực – bụng, động mạch chậu xuống chân */
  art([[.06,1.12,.12],[.04,1.38,.08],[-.04,1.45,-.06],[-.04,1.3,-.3],[-.03,.9,-.36],[-.02,.2,-.34],[-.02,-.6,-.3]],.04);
  for(const s of [1,-1]){art([[-.02,-.6,-.3],[s*.15,-.8,-.18],[s*.3,-1.05,-.04],[s*.3,-1.8,-.02],[s*.28,-2.3,-.06],[s*.27,-3.0,-.04],[s*.26,-3.6,0],[s*.27,-3.82,.2]],.028);
    /* động mạch dưới đòn → cánh tay */
    art([[s*.02,1.43,-.02],[s*.2,1.5,-.06],[s*.55,1.45,-.06],[s*.78,1.3,-.06],[s*.84,.72,-.06],[s*.88,.05,-.0],[s*.92,-.2,.02]],.02);
    /* động mạch cảnh lên đầu */
    art([[s*.03,1.44,.0],[s*.07,1.75,.05],[s*.09,2.1,.03],[s*.1,2.42,-.04]],.022);
    /* động mạch thận */art([[-.02,.42,-.34],[s*.2,.42,-.3]],.016);
    /* tĩnh mạch đi song song, hơi lệch */
    ven([[s*.92,-.2,.06],[s*.9,.05,.04],[s*.87,.72,-.02],[s*.8,1.32,-.02],[s*.55,1.5,-.02],[s*.2,1.52,-.0],[-.08,1.38,.06]],.022);
    ven([[s*.13,2.42,0],[s*.13,2.1,.08],[s*.11,1.75,.09],[-.08,1.4,.08]],.024);
    ven([[s*.3,-3.82,.24],[s*.3,-3.6,.04],[s*.31,-3.0,0],[s*.32,-2.3,-.02],[s*.34,-1.8,.02],[s*.34,-1.05,0],[s*.18,-.8,-.14],[.04,-.6,-.27]],.03);
    ven([[s*.2,.4,-.27],[.04,.4,-.3]],.018)}
  /* tĩnh mạch chủ dưới và trên về tâm nhĩ phải (bên phải người = trái màn hình) */
  ven([[.04,-.6,-.27],[.06,.2,-.3],[-.04,.85,-.2],[-.14,.95,0]],.045);ven([[-.08,1.4,.07],[-.13,1.25,.06],[-.15,1.08,.04]],.04);
  /* động mạch phổi, tĩnh mạch phổi */
  art([[-.02,1.15,.12],[-.02,1.28,.04],[-.3,1.25,-.02],[-.42,1.2,-.05]].map(p=>p),.03);art([[-.02,1.28,.04],[.3,1.25,-.02],[.42,1.18,-.05]],.03);
  return{art:paint(G.merge(A),()=>H("#C8202C")),vein:paint(G.merge(V),()=>H("#2C4FB8"))}}
/* ================= HỆ NỘI TIẾT: tuyến yên, tuyến giáp, tuyến trên thận ================= */
function buildEndocrine(){const P={};
  P.pituitary=paint(G.fromSDF((x,y,z)=>ell(x,y,z,[0,2.33,.02],[.03,.025,.03]),[-.05,2.29,-.02],[.05,2.37,.06],[12,12,12]),()=>H("#D98CA0"));
  P.thyroid=paint(G.fromSDF((x,y,z)=>{let d=1e9;for(const s of [1,-1])d=Math.min(d,ell(x,y,z,[s*.055,1.83,.06],[.04,.075,.035]));return smin(d,ell(x,y,z,[0,1.8,.08],[.04,.02,.02]),.02)},[-.12,1.73,0],[.12,1.93,.12],[24,20,14]),()=>H("#B4485A"));
  P.adrenal=paint(G.fromSDF((x,y,z)=>{let d=1e9;for(const s of [1,-1])d=Math.min(d,ell(x*s,y,z,[.28,.67,-.29],[.07,.04,.04]));return d},[-.38,.6,-.35],[.38,.74,-.23],[30,12,12]),()=>H("#E3A13B"));
  return P}

/* ================= HỆ THẦN KINH TOÀN THÂN: tủy sống, dây thần kinh tủy, liên sườn, tay, chân, dây thần kinh sọ; hạch rễ sau ================= */
function buildNerves(){const NG=[];const nv=(pts,r)=>NG.push(G.tube(G.spline(pts,6),r||.012,6));
  const cordPts=G.spline([[0,2.14,-.17],[0,1.85,-.36],[0,1.4,-.46],[0,.8,-.47],[0,.3,-.42],[0,.08,-.4]],8);
  const cord=paint(G.tube(cordPts,t=>.05-.012*t,12),()=>H("#F3E7D3"));
  for(let i=0;i<5;i++){const x=(i-2)*.018;nv([[x*.5,.1,-.4],[x,-.3,-.38],[x*1.4,-.62,-.32]],.006)}
  const gang=[];
  for(let k=0;k<20;k++){const t=.06+k*.045;const i=Math.min(cordPts.length-1,Math.round(t*(cordPts.length-1)));const p=cordPts[i];
    for(const s of [1,-1]){nv([[s*.03,p[1],p[2]],[s*.1,p[1]-.03,p[2]+.02],[s*.16,p[1]-.07,p[2]+.05]],.008);gang.push(G.fromSDF((x,y,z)=>Math.hypot(x-s*.1,y-p[1]+.03,z-p[2]-.02)-.022,[s*.1-.03,p[1]-.06,p[2]-.01],[s*.1+.03,p[1],p[2]+.05],[6,6,6]))}}
  for(let k=0;k<8;k++){const y=1.5-k*.12;for(const s of [1,-1]){const pts=[];for(let i=0;i<=8;i++){const a=Math.PI*(1-.75*i/8);pts.push([s*Math.sin(a)*(.6+.18*Math.sin(Math.PI*k/9)),y-.2*i/8,-Math.cos(a)*.34])}NG.push(G.tube(pts,.006,5))}}
  for(const s of [1,-1]){nv([[s*.08,1.92,-.3],[s*.4,1.62,-.18],[s*.72,1.4,-.08],[s*.82,.75,-.06],[s*.88,.05,-.0],[s*.92,-.22,.02]],.016);
    nv([[s*.82,.75,-.06],[s*.86,.4,.04],[s*.9,.0,.06],[s*.94,-.28,.06]],.009);nv([[s*.74,1.3,-.1],[s*.9,.8,-.12],[s*.93,.2,-.08],[s*.95,-.26,-.04]],.009);
    nv([[s*.08,-.35,-.36],[s*.28,-.8,-.18],[s*.3,-1.6,-.08],[s*.29,-2.3,-.06],[s*.28,-3.0,-.04],[s*.27,-3.62,0],[s*.27,-3.82,.22]],.02);
    nv([[s*.29,-2.25,-.06],[s*.34,-2.9,.06],[s*.3,-3.6,.08]],.009);
    nv([[s*.03,2.42,-.04],[s*.1,2.47,.12],[s*.14,2.5,.28]],.01);nv([[s*.05,2.24,-.12],[s*.18,2.3,.08],[s*.22,2.2,.26]],.008)}
  return{cord,nerves:paint(G.merge(NG),()=>H("#F2CF5B")),ganglia:paint(G.merge(gang),()=>H("#E9B949"))}}

/* ================= dựng ở luồng phụ ================= */
const JOBS={buildDigestive,buildRespiratory,buildBody,buildStomach,buildLiver,buildLung,buildSkeleton,buildArmRig,buildBrain,buildEye,buildCordSeg,buildBodyFull,buildUrinary,buildVessels,buildEndocrine,buildNerves};
let WK=null,seq=0;const pend={};
function worker(){if(WK!==null)return WK;WK=false;try{if(!/^https?:$/.test(location.protocol)||typeof Worker==="undefined")return WK;
  const url=n=>{const s=[...document.scripts].find(x=>x.src&&x.src.includes("/exp/"+n+".js"));return s?s.src:null};const u=[url("_gl"),url("_organs")];if(u.some(x=>!x))return WK;
  const src=`self.window=self;self.document={createElement:function(){return{getContext:function(){return null}}},createElementNS:function(){return{}},scripts:[]};importScripts(${u.map(x=>JSON.stringify(x)).join(",")});
function pack(g,tr){tr.push(g.pos.buffer,g.nrm.buffer,g.idx.buffer);if(g.col)tr.push(g.col.buffer);if(g.uv)tr.push(g.uv.buffer);return g}
onmessage=function(e){var d=e.data;try{var r=self.LabOrgans.JOBS[d.job].apply(null,d.args),tr=[];if(r&&r.pos)pack(r,tr);else for(var k in r)if(r[k]&&r[k].pos)pack(r[k],tr);postMessage({id:d.id,r:r},tr)}catch(err){postMessage({id:d.id,err:String(err)})}};`;
  const w=new Worker(URL.createObjectURL(new Blob([src],{type:"text/javascript"})));w.onmessage=e=>{const p=pend[e.data.id];if(!p)return;delete pend[e.data.id];e.data.err?p.local():p.res(e.data.r)};
  w.onerror=e=>{try{e.preventDefault()}catch(_){}WK=false;for(const id in pend){const p=pend[id];delete pend[id];p.local()}};WK=w}catch(e){WK=false}return WK}
function build(job,...args){return new Promise(res=>{const local=()=>setTimeout(()=>res(JOBS[job](...args)),0);const w=worker();if(!w)return local();const id=++seq;pend[id]={res,local};try{w.postMessage({id,job,args})}catch(e){delete pend[id];local()}})}

window.LabOrgans={JOBS,build,COL,RCOL,ST_PATH,LI_PATH,ell,sweep,paint,perlin,butterfly};
})();
