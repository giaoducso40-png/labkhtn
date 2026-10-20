/* LabKHTN · bộ máy CƠ THỂ NGƯỜI 3D: tim giải phẫu (mặt ngoài, mặt cắt bốn ngăn), van tim, mạch máu lớn, phổi, mạng mao mạch
   Hình dựng từ hàm khoảng cách có dấu (SDF) bằng LabGL.fromSDF; mỗi đỉnh mang trọng số (aW) để co bóp theo pha tim trong shader.
   Toạ độ: y lên trên, z hướng về người xem (mặt trước cơ thể), x sang phải người xem = bên TRÁI của người được nhìn.
   Đơn vị: chiều cao tim ≈ 1,4. Hình giản lược để học sinh nhận ra các phần, không đúng tỉ lệ giải phẫu chi tiết. */
(function(){
"use strict";
if(window.LabBody) return;
const G=window.LabGL,V3=G.V3;

/* ---------- nguyên tố hình học dạng số vô hướng ---------- */
function frame(ax){const y=V3.norm(ax);const t=Math.abs(y[0])<.9?[1,0,0]:[0,0,1];const x=V3.norm(V3.cross(t,y));const z=V3.cross(x,y);return[x,y,z]}
function E(c,ax,r,tp){const F=frame(ax);return{c,F,r,cx:c[0],cy:c[1],cz:c[2],a0:F[0][0],a1:F[0][1],a2:F[0][2],b0:F[1][0],b1:F[1][1],b2:F[1][2],c0:F[2][0],c1:F[2][1],c2:F[2][2],rx:r[0],ry:r[1],rz:r[2],rm:Math.min(...r),tp:tp||0}}
/* elip xoay, thuôn dần về phía +trục (tp) để có mỏm tim */
function dE(e,x,y,z){const dx=x-e.cx,dy=y-e.cy,dz=z-e.cz;let ly=(dx*e.b0+dy*e.b1+dz*e.b2)/e.ry;const s=e.tp?1-e.tp*(ly<0?0:ly>1?1:ly)*(ly<0?0:ly>1?1:ly):1;
  const lx=(dx*e.a0+dy*e.a1+dz*e.a2)/(e.rx*s),lz=(dx*e.c0+dy*e.c1+dz*e.c2)/(e.rz*s);
  const k0=Math.sqrt(lx*lx+ly*ly+lz*lz);const ux=lx/(e.rx*s),uy=ly/e.ry,uz=lz/(e.rz*s);const k1=Math.sqrt(ux*ux+uy*uy+uz*uz);return k1>1e-9?k0*(k0-1)/k1:-e.rm}
function SEGS(pts,r){const out=[];for(let i=0;i<pts.length-1;i++){const a=pts[i],b=pts[i+1];const bx=b[0]-a[0],by=b[1]-a[1],bz=b[2]-a[2];const rr=typeof r==="function"?r(i/(pts.length-1)):r;
  out.push({ax:a[0],ay:a[1],az:a[2],bx,by,bz,inv:1/(bx*bx+by*by+bz*bz),r:rr})}return out}
function dS(list,x,y,z){let d=1e9;for(let i=0;i<list.length;i++){const s=list[i];const px=x-s.ax,py=y-s.ay,pz=z-s.az;let h=(px*s.bx+py*s.by+pz*s.bz)*s.inv;h=h<0?0:h>1?1:h;
  const qx=px-s.bx*h,qy=py-s.by*h,qz=pz-s.bz*h;const v=Math.sqrt(qx*qx+qy*qy+qz*qz)-s.r;if(v<d)d=v}return d}
const smin=(a,b,k)=>{let h=.5+.5*(b-a)/k;h=h<0?0:h>1?1:h;return b+(a-b)*h-k*h*(1-h)};
const smax=(a,b,k)=>-smin(-a,-b,k);

/* ---------- giải phẫu ---------- */
const P={
  Ao:[[.0,.28,.0],[-.03,.55,.02],[-.04,.78,-.02],[.06,.95,-.14],[.24,.92,-.3],[.32,.68,-.4],[.33,.3,-.44],[.33,-.35,-.44]],
  PA:[[.08,.3,.22],[.12,.5,.2],[.12,.66,.07],[.1,.7,-.04]],
  LPA:[[.1,.7,-.04],[.36,.73,-.12],[.58,.66,-.22]],
  RPA:[[.1,.7,-.04],[-.12,.69,-.16],[-.4,.66,-.22],[-.58,.62,-.24]],
  SVC:[[-.42,.38,-.06],[-.41,.7,-.06],[-.4,1.05,-.06]],
  IVC:[[-.38,.12,-.12],[-.36,-.12,-.16],[-.34,-.45,-.2]],
  PVs:[[[-.07,.36,-.3],[-.34,.4,-.38]],[[-.07,.26,-.29],[-.34,.21,-.37]],[[.34,.37,-.29],[.6,.41,-.36]],[[.34,.27,-.28],[.6,.24,-.35]]],
  BR:[[[.02,.97,-.08],[-.07,1.28,-.06]],[[.13,1.0,-.16],[.14,1.3,-.17]],[[.23,.97,-.25],[.31,1.26,-.28]]]
};
const LVAX=[.42,-1,.22],RVAX=[.32,-1,.12];
const A={
  LV:E([.13,-.18,-.03],LVAX,[.36,.6,.36],.42),RV:E([-.13,-.09,.13],RVAX,[.39,.48,.27],.3),
  RA:E([-.43,.27,-.03],[.15,1,.05],[.25,.3,.25]),RAu:E([-.26,.41,.19],[.5,.3,1],[.15,.16,.075]),
  LA:E([.13,.32,-.2],[0,1,0],[.31,.2,.22]),LAu:E([.41,.33,.05],[.3,.2,1],[.12,.15,.07]),
  cLV:E([.12,-.15,-.03],LVAX,[.18,.44,.18],.35),cRV:E([-.17,-.05,.13],RVAX,[.26,.34,.15],.25),
  cRA:E([-.42,.27,-.02],[.15,1,.05],[.18,.22,.18]),cLA:E([.13,.32,-.2],[0,1,0],[.24,.14,.15]),
  sAo:SEGS(P.Ao,t=>.115-.02*t),sBR:[...SEGS(P.BR[0],.055),...SEGS(P.BR[1],.042),...SEGS(P.BR[2],.042)],
  sPA:[...SEGS(P.PA,.1),...SEGS(P.LPA,.075),...SEGS(P.RPA,.075)],sPAt:SEGS(P.PA,.1),sVC:[...SEGS(P.SVC,.078),...SEGS(P.IVC,.085)],
  sPV:[].concat(...P.PVs.map(v=>SEGS(v,.045))),
  oTV:SEGS([[-.33,.17,.03],[-.22,.03,.09]],.085),oMV:SEGS([[.1,.22,-.14],[.11,.04,-.08]],.08),oAo:SEGS([[.04,.06,0],[0,.32,.01]],.07),oPA:SEGS([[.0,.12,.2],[.09,.34,.22]],.065),
  lAo:SEGS(P.Ao.slice(0,5),.07),lPA:SEGS(P.PA,.068),lSVC:SEGS(P.SVC,.05),lIVC:SEGS(P.IVC,.055)
};
/* vị trí và hướng dòng chảy qua 4 van */
const VALVE={
  TV:{c:[-.275,.1,.06],a:V3.norm([.11,-.14,.06]),r:.082,n:3,av:true,side:"R"},
  MV:{c:[.105,.13,-.11],a:V3.norm([.01,-.18,.06]),r:.078,n:2,av:true,side:"L"},
  AoV:{c:[.02,.2,.005],a:V3.norm([-.04,.26,.01]),r:.064,n:3,av:false,side:"L"},
  PV:{c:[.045,.24,.21],a:V3.norm([.09,.22,.02]),r:.06,n:3,av:false,side:"R"}
};
function partsXYZ(x,y,z,o){o=o||{};
  o.LV=dE(A.LV,x,y,z);o.RV=dE(A.RV,x,y,z);o.RA=Math.min(dE(A.RA,x,y,z),dE(A.RAu,x,y,z));o.LA=Math.min(dE(A.LA,x,y,z),dE(A.LAu,x,y,z));
  o.Ao=Math.min(dS(A.sAo,x,y,z),dS(A.sBR,x,y,z));o.PA=dS(A.sPA,x,y,z);o.VC=dS(A.sVC,x,y,z);o.PV=dS(A.sPV,x,y,z);return o}
const parts=p=>partsXYZ(p[0],p[1],p[2]);
function wrinkle(x,y,z){return .011*Math.sin(x*61+z*23)*Math.sin(y*57-x*19)*Math.sin(z*49+y*13)}
let NOBR=false;
function outerXYZ(x,y,z){
  let v=smin(dE(A.LV,x,y,z),dE(A.RV,x,y,z),.1);
  const au=Math.min(dE(A.RAu,x,y,z),dE(A.LAu,x,y,z));
  v=smin(v,smin(dE(A.RA,x,y,z),au+(au<.05?wrinkle(x,y,z):0),.05),.08);v=smin(v,dE(A.LA,x,y,z),.08);
  v=smin(v,Math.min(dS(A.sAo,x,y,z),dS(A.sBR,x,y,z)),.05);v=smin(v,NOBR?dS(A.sPAt,x,y,z):dS(A.sPA,x,y,z),.05);v=smin(v,dS(A.sVC,x,y,z),.05);v=smin(v,dS(A.sPV,x,y,z),.04);return v}
function cavityXYZ(x,y,z){
  let c=Math.min(dE(A.cLV,x,y,z),dE(A.cRV,x,y,z),dE(A.cRA,x,y,z),dE(A.cLA,x,y,z));
  c=Math.min(c,dS(A.oTV,x,y,z),dS(A.oMV,x,y,z),dS(A.oAo,x,y,z),dS(A.oPA,x,y,z),dS(A.lAo,x,y,z),dS(A.lPA,x,y,z),dS(A.lSVC,x,y,z),dS(A.lIVC,x,y,z));
  /* cơ nhú nhô lên trong tâm thất */
  c=smax(c,-Math.min(dS(PAP,x,y,z)),.02);return c}
const PAP=[...SEGS([[.2,-.42,.02],[.17,-.2,.0]],.035),...SEGS([[.02,-.38,-.1],[.05,-.18,-.08]],.032),...SEGS([[-.12,-.25,.17],[-.16,-.08,.14]],.025)];
const outer=p=>outerXYZ(p[0],p[1],p[2]),cavity=p=>cavityXYZ(p[0],p[1],p[2]);
function solidXYZ(x,y,z){const o=outerXYZ(x,y,z);if(o>.06)return o;const c=cavityXYZ(x,y,z);return o>-c?o:-c}
/* mặt cắt bốn ngăn: bỏ phần phía trước mặt phẳng n·p = d */
const CUT={n:V3.norm([.06,.22,.97]),d:-.035};
const planeD=(x,y,z)=>x*CUT.n[0]+y*CUT.n[1]+z*CUT.n[2]-CUT.d;
function cutXYZ(x,y,z){const pl=planeD(x,y,z);if(pl>.08)return pl;const s=solidXYZ(x,y,z);return s>pl?s:pl}

/* ---------- màu (tuyến tính) và trọng số co bóp ---------- */
const H=G.hex;
const COL={muscle:H("#6A1A22"),muscle2:H("#4E141B"),atrium:H("#5C1A28"),auricle:H("#481523"),fat:H("#B8934F"),
  ao:H("#C23240"),pa:H("#3A56B2"),vc:H("#2F4088"),pv:H("#B9343F"),cut:H("#94303A"),cut2:H("#6E1E28"),endo:H("#8A2732"),lumenA:H("#7E1A26"),lumenV:H("#2A3168"),pap:H("#7E2430")};
const mix=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];
const smooth=(e0,e1,x)=>{const t=Math.min(1,Math.max(0,(x-e0)/(e1-e0)));return t*t*(3-2*t)};
const sIV=SEGS([[.16,.24,.29],[.18,.0,.36],[.24,-.3,.3],[.34,-.62,.12]],0);
function fatAmt(x,y,z){const d=dS(sIV,x,y,z);const av=Math.abs(y-.2-x*.12);const n=.5+.5*Math.sin(x*29+z*17)*Math.sin(y*31-z*11);
  return Math.max(1-smooth(.015,.08,d),(1-smooth(.01,.075,av))*(z>-.35?1:.5))*(.55+.45*n)}
const Q0={};
function vertexInfo(x,y,z,isCut){
  const q=partsXYZ(x,y,z,Q0);let best="LV",bd=1e9;for(const k of ["LV","RV","RA","LA","Ao","PA","VC","PV"])if(q[k]<bd){bd=q[k];best=k}
  let col,w=[0,0,0,0];
  const pl=isCut?planeD(x,y,z):1;const onCut=isCut&&Math.abs(pl)<.012;
  const cv=isCut&&!onCut?cavityXYZ(x,y,z):1;const inner=isCut&&!onCut&&cv>-.025&&cv<.03;
  if(best==="LV"||best==="RV"){col=mix(COL.muscle,COL.muscle2,smooth(-.1,.6,-y)*.5);w[0]=1}
  else if(best==="RA"||best==="LA"){col=(dE(A.RAu,x,y,z)<.03||dE(A.LAu,x,y,z)<.03)?COL.auricle:COL.atrium;w[1]=1;w[2]=best==="LA"?1:0}
  else if(best==="Ao"){col=COL.ao;w[3]=1}else if(best==="PA"){col=COL.pa;w[3]=.8}else if(best==="VC")col=COL.vc;else col=COL.pv;
  if(!onCut&&!inner&&(best==="LV"||best==="RV"||best==="RA"||best==="LA"))col=mix(col,COL.fat,fatAmt(x,y,z)*.45);
  if(inner){const vessel=best==="Ao"||best==="PA"||best==="VC"||best==="PV";const red=best==="Ao"||best==="PV"||best==="LV"||best==="LA";
    col=vessel?(red?COL.lumenA:COL.lumenV):(dS(PAP,x,y,z)<.03?COL.pap:COL.endo)}
  if(onCut){const depth=-cavityXYZ(x,y,z);col=best==="Ao"||best==="PV"?mix(COL.ao,COL.cut,.5):best==="PA"||best==="VC"?mix(COL.pa,COL.cut2,.4):mix(COL.cut,COL.cut2,smooth(.01,.12,-depth))}
  return{col,w,region:best}
}
function finishMesh(g,isCut){const n=g.pos.length/3;const col=new Float32Array(n*4),w=new Float32Array(n*4);
  for(let i=0;i<n;i++){const v=vertexInfo(g.pos[i*3],g.pos[i*3+1],g.pos[i*3+2],isCut);col[i*4]=v.col[0];col[i*4+1]=v.col[1];col[i*4+2]=v.col[2];col[i*4+3]=1;w.set(v.w,i*4)}
  g.col=col;g.w=w;return g}
const BMIN=[-.82,-.8,-.7],BMAX=[.8,1.38,.55];
function buildOuter(res){res=res||88;return finishMesh(G.fromSDF(outerXYZ,BMIN,BMAX,[res,Math.round(res*1.35),Math.round(res*.78)]),false)}
function buildCut(res){res=res||84;NOBR=true;try{return finishMesh(G.fromSDF(cutXYZ,BMIN,BMAX,[res,Math.round(res*1.35),Math.round(res*.78)]),true)}finally{NOBR=false}}
/* trọng số cho một điểm bất kì (để mạch vành co theo tim) */
function weightAt(x,y,z){return vertexInfo(x,y,z,false).w}

/* ---------- mạch vành: chiếu điểm điều khiển lên bề mặt ngoài ---------- */
function grad(f,x,y,z){const h=.003;const g=[f(x+h,y,z)-f(x-h,y,z),f(x,y+h,z)-f(x,y-h,z),f(x,y,z+h)-f(x,y,z-h)];return V3.norm(g)}
function projectOuter(p){let q=[...p];for(let i=0;i<14;i++){const d=outerXYZ(q[0],q[1],q[2]);const g=grad(outerXYZ,q[0],q[1],q[2]);q=V3.sub(q,V3.scale(g,d));if(Math.abs(d)<1e-4)break}return{p:q,n:grad(outerXYZ,q[0],q[1],q[2])}}
function onSurface(cp,lift,n){return G.spline(cp,n||10).map(p=>{const r=projectOuter(p);return V3.add(r.p,V3.scale(r.n,lift))})}
const CORONARY={
  LAD:{a:true,r:.015,cp:[[.06,.3,.18],[.16,.2,.3],[.19,0,.37],[.25,-.3,.31],[.33,-.62,.12]]},
  LCX:{a:true,r:.013,cp:[[.12,.26,.22],[.32,.2,.16],[.46,.08,-.05],[.42,-.04,-.28]]},
  RCA:{a:true,r:.014,cp:[[-.06,.3,.2],[-.24,.22,.28],[-.45,.08,.18],[-.5,-.12,-.05]]},
  DIAG:{a:true,r:.009,cp:[[.19,.08,.36],[.33,-.12,.3],[.42,-.3,.18]]},
  RMARG:{a:true,r:.008,cp:[[-.4,.12,.24],[-.38,-.12,.25],[-.28,-.32,.24]]},
  GCV:{a:false,r:.014,cp:[[.12,.23,.32],[.15,0,.39],[.2,-.3,.34],[.29,-.6,.16]]},
  SCV:{a:false,r:.01,cp:[[-.32,.16,.27],[-.3,-.1,.3],[-.2,-.3,.28]]}
};
function coronaryGeom(){const list=[];for(const k in CORONARY){const c=CORONARY[k];const pts=onSurface(c.cp,c.r*.7,8);
    const g=G.tube(pts,t=>c.r*(1-.55*t),10,{caps:true});const col=c.a?H("#B5202F"):H("#3E3478");
    const n=g.pos.length/3;g.col=new Float32Array(n*4);g.w=new Float32Array(n*4);for(let i=0;i<n;i++){g.col.set([...col,1],i*4);g.w.set(weightAt(g.pos[i*3],g.pos[i*3+1],g.pos[i*3+2]),i*4)}list.push(g)}
  const m=G.merge(list);let off=0;const W=new Float32Array(m.pos.length/3*4);for(const g of list){W.set(g.w,off*4);off+=g.pos.length/3}m.w=W;return m}

/* ---------- van tim: lá van dạng tấm cong, xoay quanh bản lề trên vòng van ---------- */
function leafletGeom(w,L,curv){const p=[],n=[],ix=[];const NU=10,NV=10;
  for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const u=i/NU-.5,v=j/NV;const wf=1-.55*v*v;const x=u*w*wf,y=-v*L,z=curv*(1-4*u*u)*Math.sin(v*Math.PI*.8);p.push(x,y,z);n.push(0,0,1)}
  for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=j*(NU+1)+i,b=a+NU+1;ix.push(a,b,a+1,b,b+1,a+1)}
  /* pháp tuyến theo mặt */
  const N=new Float32Array(p.length);for(let t=0;t<ix.length;t+=3){const a=ix[t]*3,b=ix[t+1]*3,c=ix[t+2]*3;const e1=[p[b]-p[a],p[b+1]-p[a+1],p[b+2]-p[a+2]],e2=[p[c]-p[a],p[c+1]-p[a+1],p[c+2]-p[a+2]];const f=V3.cross(e1,e2);for(const k of[a,b,c]){N[k]+=f[0];N[k+1]+=f[1];N[k+2]+=f[2]}}
  for(let k=0;k<N.length;k+=3){const l=Math.hypot(N[k],N[k+1],N[k+2])||1;N[k]/=l;N[k+1]/=l;N[k+2]/=l}
  return{pos:new Float32Array(p),nrm:N,idx:new Uint16Array(ix),col:null,uv:null}}

/* ---------- phổi ---------- */
const LUNG={L:{c:[1.55,.55,-.2],r:[.55,.95,.5],h:[1.02,.55,-.2]},R:{c:[-1.55,.55,-.2],r:[.58,.95,.52],h:[-1.02,.55,-.2]}};
function lungXYZ(x,y,z,s){const L=LUNG[s];const e=E(L.c,[0,1,0],L.r);let d=dE(e,x,y,z);
  /* mặt trong lõm (chỗ tựa tim) và các khe chia thùy */
  d=smax(d,-dE(E([L.h[0]*.78,.2,.05],[0,1,0],[.32,.6,.4]),x,y,z),.12);
  const fz=s==="L"?(y-.55)+(x-1.55)*.6:(y-.62)-(x+1.55)*.55;d=smax(d,-(Math.abs(fz)-.012),.02);
  return d+.012*Math.sin(x*21+y*7)*Math.sin(y*23)*Math.sin(z*19+x*5)}
function buildLung(s,res){res=res||52;const L=LUNG[s];const mn=[L.c[0]-.7,L.c[1]-1.1,L.c[2]-.7],mx=[L.c[0]+.7,L.c[1]+1.1,L.c[2]+.7];
  const g=G.fromSDF((x,y,z)=>lungXYZ(x,y,z,s),mn,mx,[res,Math.round(res*1.55),res]);const n=g.pos.length/3;g.col=new Float32Array(n*4);
  const base=H("#C97482"),dark=H("#8E4A5A");for(let i=0;i<n;i++){const x=g.pos[i*3],y=g.pos[i*3+1],z=g.pos[i*3+2];const m=.5+.5*Math.sin(x*37+z*11)*Math.sin(y*29-x*17);g.col.set([...mix(base,dark,m*.35),1],i*4)}return g}

/* ---------- đường đi của hồng cầu (mỗi đoạn: điểm + loại để điều khiển tốc độ theo pha) ---------- */
function seg(list){const pts=[],typ=[];for(const [t,arr] of list)for(const p of arr){pts.push(p);typ.push(t)}return{pts,typ}}
function lungCaps(s){const sg=s==="L"?1:-1;const out=[];for(let k=0;k<5;k++){const zz=-.45+k*.2;const yy=.15+k*.17;
    out.push([[sg*1.05,.62,-.18],[sg*1.25,.92-.05*k,zz*.6],[sg*1.62,.95-.12*k,zz],[sg*1.75,.55+.08*Math.sin(k),zz*.9],[sg*1.5,yy,zz*.7],[sg*1.25,.3,-.2],[sg*1.05,.34,-.3]])}return out}
function bedCaps(){const out=[];for(let k=0;k<9;k++){const zz=-.55+k*.1375;const y=-2.12;
    out.push([[1.38,y,0],[1.0,y+.02,zz*.35],[.62,y+.03,zz*.85],[.25,y+.035,zz+.06*Math.sin(k*1.7)],[-.15,y+.035,zz-.05*Math.cos(k)],[-.6,y+.03,zz*.85],[-1.0,y+.02,zz*.35],[-1.38,y,0]])}return out}
const FLOW={
  /* tâm thất trái → động mạch chủ → các cơ quan */
  sys:seg([["vent",[[.14,-.34,-.02],[.11,-.1,-.02],[.05,.08,0]]],["sl",[[.02,.2,.005]]],["art",[[-.02,.45,.02],[-.04,.7,0],[.04,.92,-.12],[.22,.9,-.29],[.32,.62,-.4],[.33,.25,-.44],[.33,-.32,-.44],[.5,-1.0,-.38],[.9,-1.68,-.22],[1.38,-2.12,0]]]]),
  /* tĩnh mạch chủ dưới → tâm nhĩ phải → tâm thất phải → động mạch phổi */
  ret:seg([["vein",[[-1.38,-2.12,0],[-1.0,-1.62,-.22],[-.42,-.92,-.22],[-.34,-.45,-.2],[-.36,-.12,-.16],[-.38,.1,-.1]]],["atr",[[-.42,.25,-.03]]],["av",[[-.28,.1,.06]]],["vent",[[-.2,-.06,.12],[-.13,-.2,.15],[-.02,.04,.18],[.02,.14,.2]]],["sl",[[.045,.24,.21]]],["art",[[.12,.5,.2],[.12,.66,.07],[.1,.7,-.04]]]]),
  toL:seg([["art",[[.36,.73,-.12],[.58,.66,-.22],[1.05,.62,-.18]]]]),
  toR:seg([["art",[[-.12,.69,-.16],[-.4,.66,-.22],[-.58,.62,-.24],[-1.05,.62,-.18]]]]),
  backL:seg([["vein",[[1.05,.34,-.3],[.6,.32,-.36],[.34,.31,-.28]]],["atr",[[.15,.3,-.2]]],["av",[[.105,.13,-.11]]],["vent",[[.12,-.08,-.05],[.14,-.34,-.02]]]]),
  backR:seg([["vein",[[-1.05,.34,-.3],[-.6,.31,-.36],[-.34,.3,-.33],[-.07,.31,-.29]]],["atr",[[.12,.3,-.2]]],["av",[[.105,.13,-.11]]],["vent",[[.12,-.08,-.05],[.14,-.34,-.02]]]]),
  bed:bedCaps().map(c=>seg([["cap",c]])),
  lungL:lungCaps("L").map(c=>seg([["cap",c]])),lungR:lungCaps("R").map(c=>seg([["cap",c]]))
};
/* nối đoạn: sys → bed[i] → ret → (toL → lungL[j] → backL | toR → lungR[j] → backR) → sys */
function prep(s){const L=[0];for(let i=1;i<s.pts.length;i++)L.push(L[i-1]+V3.dist(s.pts[i],s.pts[i-1]));s.L=L;s.len=L[L.length-1];return s}
[FLOW.sys,FLOW.ret,FLOW.toL,FLOW.toR,FLOW.backL,FLOW.backR,...FLOW.bed,...FLOW.lungL,...FLOW.lungR].forEach(prep);
function nextSeg(cell,rnd){const k=cell.k;
  if(k==="sys")return["bed",Math.floor(rnd()*FLOW.bed.length)];if(k==="bed")return["ret",0];
  if(k==="ret")return rnd()<.5?["toL",0]:["toR",0];if(k==="toL")return["lungL",Math.floor(rnd()*5)];if(k==="toR")return["lungR",Math.floor(rnd()*5)];
  if(k==="lungL")return["backL",0];if(k==="lungR")return["backR",0];return["sys",0]}
function segOf(k,i){const s=FLOW[k];return Array.isArray(s)?s[i]:s}
function sample(s,d){d=Math.max(0,Math.min(s.len,d));let lo=0,hi=s.L.length-1;while(lo<hi-1){const m=(lo+hi)>>1;if(s.L[m]<=d)lo=m;else hi=m}
  const t=(d-s.L[lo])/((s.L[hi]-s.L[lo])||1);return{p:V3.lerp(s.pts[lo],s.pts[hi],t),typ:s.typ[lo],dir:V3.norm(V3.sub(s.pts[hi],s.pts[lo]))}}

/* ---------- mạng mao mạch các cơ quan và trong phổi (ống màu chuyển đỏ → tím xanh) ---------- */
function capNet(paths,fromCol,toCol,rEnd,rMid){const list=[];
  for(const cp of paths){const pts=G.spline(cp,10);const g=G.tube(pts,t=>{const e=Math.min(t,1-t)*2;return rEnd+(rMid-rEnd)*Math.min(1,e*2.2)},8);const n=g.pos.length/3;g.col=new Float32Array(n*4);
    const tot=pts.length;for(let i=0;i<n;i++){const t=Math.floor(i/9)/(tot-1);const c=mix(fromCol,toCol,smooth(.3,.7,t));g.col.set([...c,1],i*4)}list.push(g)}
  return G.merge(list)}
function bedNet(){return capNet(bedCaps(),H("#C42C3C"),H("#3B3F95"),.045,.012)}
function lungNet(s){return capNet(lungCaps(s),H("#3B3F95"),H("#C42C3C"),.035,.01)}
/* ống mạch ngoài tim (nối tim với phổi, các cơ quan) */
const EXT={
  AoD:{col:"#C42C3C",r:.09,pts:[[.33,-.3,-.44],[.5,-1.0,-.38],[.9,-1.68,-.22],[1.38,-2.12,0]]},
  IVC:{col:"#2F4088",r:.08,pts:[[-1.38,-2.12,0],[-1.0,-1.62,-.22],[-.42,-.92,-.22],[-.34,-.42,-.2]]},
  LPA:{col:"#3A56B2",r:.065,pts:[[.56,.66,-.22],[.8,.65,-.2],[1.05,.62,-.18]]},
  RPA:{col:"#3A56B2",r:.065,pts:[[-.56,.62,-.24],[-.8,.62,-.21],[-1.05,.62,-.18]]},
  LPV:{col:"#B9343F",r:.05,pts:[[1.05,.34,-.3],[.8,.33,-.34],[.58,.32,-.36]]},
  RPV:{col:"#B9343F",r:.05,pts:[[-1.05,.34,-.3],[-.8,.32,-.34],[-.58,.3,-.36]]}
};
/* ---------- dựng lưới trong Web Worker ----------
   Lưới tim và phổi tốn khoảng 0,5–1,5 s tính toán; chạy ở luồng phụ để giao diện không đứng hình khi mở bài.
   Trang mở trực tiếp từ tệp (file://) hoặc trình duyệt chặn Worker thì dựng ngay trên luồng chính như cũ. */
let WK=null,wkSeq=0;const wkPend={};
function wkFail(){for(const id in wkPend){const p=wkPend[id];delete wkPend[id];p.fallback()}WK=false}
function startWorker(){if(WK!==null)return WK;WK=false;
  try{if(!/^https?:$/.test(location.protocol)||typeof Worker==="undefined"||typeof Blob==="undefined")return WK;
    const url=n=>{const s=[...document.scripts].find(x=>x.src&&/\/exp\/_[a-z0-9]+\.js/.test(x.src)&&x.src.includes("/exp/"+n+".js"));return s?s.src:null};
    const u=[url("_gl"),url("_body")];if(u.some(x=>!x))return WK;
    const src=`self.window=self;self.document={createElement:function(){return{getContext:function(){return null}}},createElementNS:function(){return{}},scripts:[]};
importScripts(${u.map(x=>JSON.stringify(x)).join(",")});
onmessage=function(e){var d=e.data;try{var g=self.LabBody[d.job].apply(null,d.args);var tr=[g.pos.buffer,g.nrm.buffer,g.idx.buffer];if(g.col)tr.push(g.col.buffer);if(g.w)tr.push(g.w.buffer);if(g.uv)tr.push(g.uv.buffer);postMessage({id:d.id,g:g},tr)}catch(err){postMessage({id:d.id,err:String(err)})}};`;
    const w=new Worker(URL.createObjectURL(new Blob([src],{type:"text/javascript"})));
    w.onmessage=e=>{const p=wkPend[e.data.id];if(!p)return;delete wkPend[e.data.id];clearTimeout(p.to);if(e.data.err)p.fallback();else p.res(e.data.g)};
    w.onerror=e=>{try{e.preventDefault()}catch(_){}wkFail();try{w.terminate()}catch(_){}};WK=w}catch(e){WK=false}return WK}
const JOBS={buildOuter:(...a)=>buildOuter(...a),buildCut:(...a)=>buildCut(...a),buildLung:(...a)=>buildLung(...a)};
function buildAsync(job,...args){return new Promise(res=>{const local=()=>setTimeout(()=>res(JOBS[job](...args)),0);const w=startWorker();if(!w)return local();
  const id=++wkSeq;const p={res,fallback:()=>{clearTimeout(p.to);local()}};p.to=setTimeout(()=>{if(wkPend[id]){delete wkPend[id];local()}},20000);wkPend[id]=p;
  try{w.postMessage({id,job,args})}catch(e){delete wkPend[id];clearTimeout(p.to);local()}})}
window.LabBody={A,P,VALVE,CUT,LUNG,FLOW,EXT,COL,parts,partsXYZ,outer,cavity,outerXYZ,cavityXYZ,solidXYZ,cutXYZ,planeD,buildOuter,buildCut,buildAsync,coronaryGeom,leafletGeom,
  lungXYZ,buildLung,bedNet,lungNet,nextSeg,segOf,sample,weightAt,dE,dS,SEGS,E};
})();
