/* LabKHTN · bộ máy 3D WebGL2 dùng chung (tự viết, không phụ thuộc thư viện ngoài)
   - Vật liệu PBR (GGX), ánh sáng studio 3 nguồn + môi trường thủ tục, tone map ACES
   - Kính mỏng (phản xạ Fresnel, viền dày), chất lỏng trong suốt, hạt vẽ theo lô (instancing), bóng mềm
   - Camera xoay quanh tâm, tia chọn vật, chiếu điểm 3D ra màn hình để gắn nhãn HTML
   - Dựng hình: cầu, khối tròn xoay, ống theo đường cong, hộp bo góc, mặt phẳng, bề mặt từ hàm khoảng cách (surface nets) */
(function(){
"use strict";
if(window.LabGL) return;

/* ---------- toán ---------- */
const V3={
  add:(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],sub:(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],scale:(a,s)=>[a[0]*s,a[1]*s,a[2]*s],
  dot:(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross:(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
  len:a=>Math.hypot(a[0],a[1],a[2]),norm:a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l]},
  lerp:(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t],dist:(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2])
};
const M4={
  ident(){const m=new Float32Array(16);m[0]=m[5]=m[10]=m[15]=1;return m},
  mul(a,b,o){o=o||new Float32Array(16);const r=new Float32Array(16);for(let c=0;c<4;c++)for(let w=0;w<4;w++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+w]*b[c*4+k];r[c*4+w]=s}o.set(r);return o},
  persp(fov,asp,n,f){const t=1/Math.tan(fov/2),m=new Float32Array(16);m[0]=t/asp;m[5]=t;m[10]=(f+n)/(n-f);m[11]=-1;m[14]=2*f*n/(n-f);return m},
  lookAt(e,c,up){const z=V3.norm(V3.sub(e,c)),x=V3.norm(V3.cross(up,z)),y=V3.cross(z,x),m=new Float32Array(16);
    m[0]=x[0];m[4]=x[1];m[8]=x[2];m[1]=y[0];m[5]=y[1];m[9]=y[2];m[2]=z[0];m[6]=z[1];m[10]=z[2];
    m[12]=-V3.dot(x,e);m[13]=-V3.dot(y,e);m[14]=-V3.dot(z,e);m[15]=1;return m},
  trs(p,q,s,o){o=o||new Float32Array(16);const[x,y,z,w]=q,x2=x+x,y2=y+y,z2=z+z,xx=x*x2,xy=x*y2,xz=x*z2,yy=y*y2,yz=y*z2,zz=z*z2,wx=w*x2,wy=w*y2,wz=w*z2;
    o[0]=(1-(yy+zz))*s[0];o[1]=(xy+wz)*s[0];o[2]=(xz-wy)*s[0];o[3]=0;o[4]=(xy-wz)*s[1];o[5]=(1-(xx+zz))*s[1];o[6]=(yz+wx)*s[1];o[7]=0;
    o[8]=(xz+wy)*s[2];o[9]=(yz-wx)*s[2];o[10]=(1-(xx+yy))*s[2];o[11]=0;o[12]=p[0];o[13]=p[1];o[14]=p[2];o[15]=1;return o},
  inv(m){const a=m,o=new Float32Array(16);
    const a00=a[0],a01=a[1],a02=a[2],a03=a[3],a10=a[4],a11=a[5],a12=a[6],a13=a[7],a20=a[8],a21=a[9],a22=a[10],a23=a[11],a30=a[12],a31=a[13],a32=a[14],a33=a[15];
    const b00=a00*a11-a01*a10,b01=a00*a12-a02*a10,b02=a00*a13-a03*a10,b03=a01*a12-a02*a11,b04=a01*a13-a03*a11,b05=a02*a13-a03*a12,b06=a20*a31-a21*a30,b07=a20*a32-a22*a30,b08=a20*a33-a23*a30,b09=a21*a32-a22*a31,b10=a21*a33-a23*a31,b11=a22*a33-a23*a32;
    let d=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;if(!d)return M4.ident();d=1/d;
    o[0]=(a11*b11-a12*b10+a13*b09)*d;o[1]=(a02*b10-a01*b11-a03*b09)*d;o[2]=(a31*b05-a32*b04+a33*b03)*d;o[3]=(a22*b04-a21*b05-a23*b03)*d;
    o[4]=(a12*b08-a10*b11-a13*b07)*d;o[5]=(a00*b11-a02*b08+a03*b07)*d;o[6]=(a32*b02-a30*b05-a33*b01)*d;o[7]=(a20*b05-a22*b02+a23*b01)*d;
    o[8]=(a10*b10-a11*b08+a13*b06)*d;o[9]=(a01*b08-a00*b10-a03*b06)*d;o[10]=(a30*b04-a31*b02+a33*b00)*d;o[11]=(a21*b02-a20*b04-a23*b00)*d;
    o[12]=(a11*b07-a10*b09-a12*b06)*d;o[13]=(a00*b09-a01*b07+a02*b06)*d;o[14]=(a31*b01-a30*b03-a32*b00)*d;o[15]=(a20*b03-a21*b01+a22*b00)*d;return o},
  nrm3(m){const i=M4.inv(m);return new Float32Array([i[0],i[4],i[8],i[1],i[5],i[9],i[2],i[6],i[10]])},
  xf(m,p){const x=p[0],y=p[1],z=p[2],w=m[3]*x+m[7]*y+m[11]*z+m[15];return[(m[0]*x+m[4]*y+m[8]*z+m[12])/w,(m[1]*x+m[5]*y+m[9]*z+m[13])/w,(m[2]*x+m[6]*y+m[10]*z+m[14])/w]}
};
const Q={
  euler(x,y,z){const cx=Math.cos(x/2),sx=Math.sin(x/2),cy=Math.cos(y/2),sy=Math.sin(y/2),cz=Math.cos(z/2),sz=Math.sin(z/2);
    return[sx*cy*cz+cx*sy*sz,cx*sy*cz-sx*cy*sz,cx*cy*sz+sx*sy*cz,cx*cy*cz-sx*sy*sz]},
  axis(ax,a){const s=Math.sin(a/2),n=V3.norm(ax);return[n[0]*s,n[1]*s,n[2]*s,Math.cos(a/2)]},
  mul(a,b){return[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]]},
  /* từ ba trục cơ sở trực chuẩn (cột x, y, z) */
  basis(x,y,z){const m00=x[0],m01=y[0],m02=z[0],m10=x[1],m11=y[1],m12=z[1],m20=x[2],m21=y[2],m22=z[2];const tr=m00+m11+m22;let qx,qy,qz,qw;
    if(tr>0){const s=.5/Math.sqrt(tr+1);qw=.25/s;qx=(m21-m12)*s;qy=(m02-m20)*s;qz=(m10-m01)*s}
    else if(m00>m11&&m00>m22){const s=2*Math.sqrt(1+m00-m11-m22);qw=(m21-m12)/s;qx=.25*s;qy=(m01+m10)/s;qz=(m02+m20)/s}
    else if(m11>m22){const s=2*Math.sqrt(1+m11-m00-m22);qw=(m02-m20)/s;qx=(m01+m10)/s;qy=.25*s;qz=(m12+m21)/s}
    else{const s=2*Math.sqrt(1+m22-m00-m11);qw=(m10-m01)/s;qx=(m02+m20)/s;qy=(m12+m21)/s;qz=.25*s}return[qx,qy,qz,qw]},
  /* quay trục y về hướng a */
  toward(a){const y=V3.norm(a);const t=Math.abs(y[1])<.95?[0,1,0]:[1,0,0];const x=V3.norm(V3.cross(t,y));const z=V3.cross(x,y);return Q.basis(x,y,z)}
};
const hex=(h,a)=>{h=h.replace("#","");const n=parseInt(h.length===3?h.split("").map(c=>c+c).join(""):h,16);const c=[(n>>16)&255,(n>>8)&255,n&255].map(v=>Math.pow(v/255,2.2));return a==null?c:[...c,a]};
const clamp=(v,a,b)=>v<a?a:v>b?b:v;

/* ---------- dựng hình ---------- */
function finish(pos,nrm,idx,col,uv){return{pos:new Float32Array(pos),nrm:new Float32Array(nrm),idx:(pos.length/3>65535?new Uint32Array(idx):new Uint16Array(idx)),col:col?new Float32Array(col):null,uv:uv?new Float32Array(uv):null}}
function sphere(r,sw,sh){sw=sw||32;sh=sh||20;const p=[],n=[],t=[],ix=[];
  for(let j=0;j<=sh;j++){const v=j/sh,th=v*Math.PI;for(let i=0;i<=sw;i++){const u=i/sw,ph=u*Math.PI*2;const x=-Math.cos(ph)*Math.sin(th),y=Math.cos(th),z=Math.sin(ph)*Math.sin(th);p.push(x*r,y*r,z*r);n.push(x,y,z);t.push(u,v)}}
  for(let j=0;j<sh;j++)for(let i=0;i<sw;i++){const a=j*(sw+1)+i,b=a+sw+1;ix.push(a,b,a+1,b,b+1,a+1)}return finish(p,n,ix,null,t)}
/* khối tròn xoay quanh trục y; prof = [[r,y],…] theo thứ tự từ dưới lên (hoặc tùy ý) */
function lathe(prof,seg,o){seg=seg||48;o=o||{};const p=[],n=[],t=[],ix=[],L=prof.length;
  const nr=[];for(let k=0;k<L;k++){const a=prof[Math.max(0,k-1)],b=prof[Math.min(L-1,k+1)];let dr=b[0]-a[0],dy=b[1]-a[1];const l=Math.hypot(dr,dy)||1;nr.push([dy/l,-dr/l])}
  if(o.flip)nr.forEach(v=>{v[0]=-v[0];v[1]=-v[1]});
  for(let k=0;k<L;k++)for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2,c=Math.cos(a),s=Math.sin(a);p.push(prof[k][0]*c,prof[k][1],prof[k][0]*s);n.push(nr[k][0]*c,nr[k][1],nr[k][0]*s);t.push(i/seg,k/(L-1))}
  for(let k=0;k<L-1;k++)for(let i=0;i<seg;i++){const a=k*(seg+1)+i,b=a+seg+1;ix.push(a,b,a+1,b,b+1,a+1)}
  return finish(p,n,ix,null,t)}
function disk(r,y,seg,up){seg=seg||48;const p=[0,y,0],n=[0,up?1:-1,0],ix=[];for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2;p.push(Math.cos(a)*r,y,Math.sin(a)*r);n.push(0,up?1:-1,0)}
  for(let i=1;i<=seg;i++)up?ix.push(0,i+1,i):ix.push(0,i,i+1);return finish(p,n,ix)}
function cylinder(r,h,seg,caps){const g=[lathe([[r,0],[r,h]],seg)];if(caps!==false){g.push(disk(r,h,seg,true),disk(r,0,seg,false))}return merge(g)}
function box(w,h,d,rad,seg){rad=rad||0;seg=seg||4;const N=seg*2+2;const p=[],n=[],ix=[];const hw=w/2,hh=h/2,hd=d/2;
  const face=(ax,sg)=>{const base=p.length/3;for(let j=0;j<=N;j++)for(let i=0;i<=N;i++){const u=i/N*2-1,v=j/N*2-1;let q;
      if(ax===0)q=[sg,v*sg,u];else if(ax===1)q=[u,sg,v*sg];else q=[-u*sg,v,sg];
      let x=q[0]*hw,y=q[1]*hh,z=q[2]*hd;const ix0=clamp(x,-hw+rad,hw-rad),iy0=clamp(y,-hh+rad,hh-rad),iz0=clamp(z,-hd+rad,hd-rad);
      let dx=x-ix0,dy=y-iy0,dz=z-iz0,l=Math.hypot(dx,dy,dz);let nn;
      if(rad>0&&l>1e-6){nn=[dx/l,dy/l,dz/l];x=ix0+nn[0]*rad;y=iy0+nn[1]*rad;z=iz0+nn[2]*rad}else nn=ax===0?[sg,0,0]:ax===1?[0,sg,0]:[0,0,sg];
      p.push(x,y,z);n.push(...nn)}
    for(let j=0;j<N;j++)for(let i=0;i<N;i++){const a=base+j*(N+1)+i,b=a+N+1;ix.push(a,b,a+1,b,b+1,a+1)}};
  face(0,1);face(0,-1);face(1,1);face(1,-1);face(2,1);face(2,-1);return finish(p,n,ix)}
function plane(w,d){return finish([-w/2,0,-d/2,w/2,0,-d/2,w/2,0,d/2,-w/2,0,d/2],[0,1,0,0,1,0,0,1,0,0,1,0],[0,2,1,0,3,2],null,[0,0,1,0,1,1,0,1])}
/* ống theo đường cong (khung vận chuyển song song); rad: số hoặc hàm r(t) */
function tube(pts,rad,rs,o){rs=rs||16;o=o||{};const p=[],n=[],ix=[],L=pts.length;const T=[];
  for(let k=0;k<L;k++){const a=pts[Math.max(0,k-1)],b=pts[Math.min(L-1,k+1)];T.push(V3.norm(V3.sub(b,a)))}
  let N0=Math.abs(T[0][1])<.9?V3.norm(V3.cross(T[0],[0,1,0])):V3.norm(V3.cross(T[0],[1,0,0]));const Ns=[N0];
  for(let k=1;k<L;k++){const prev=Ns[k-1];let v=V3.sub(prev,V3.scale(T[k],V3.dot(prev,T[k])));Ns.push(V3.norm(v))}
  for(let k=0;k<L;k++){const B=V3.cross(T[k],Ns[k]);const r=typeof rad==="function"?rad(k/(L-1)):rad;
    for(let i=0;i<=rs;i++){const a=i/rs*Math.PI*2,c=Math.cos(a),s=Math.sin(a);const d=[Ns[k][0]*c+B[0]*s,Ns[k][1]*c+B[1]*s,Ns[k][2]*c+B[2]*s];
      p.push(pts[k][0]+d[0]*r,pts[k][1]+d[1]*r,pts[k][2]+d[2]*r);n.push(...d)}}
  for(let k=0;k<L-1;k++)for(let i=0;i<rs;i++){const a=k*(rs+1)+i,b=a+rs+1;ix.push(a,a+1,b,b,a+1,b+1)}
  const g=finish(p,n,ix);
  if(o.caps){const parts=[g];[[0,-1],[L-1,1]].forEach(([k,sg])=>{const r=typeof rad==="function"?rad(k/(L-1)):rad;const c=pts[k],tt=V3.scale(T[k],sg);const B=V3.cross(T[k],Ns[k]);
    const pp=[...c],nn=[...tt],ii=[];for(let i=0;i<=rs;i++){const a=i/rs*Math.PI*2,cs=Math.cos(a),sn=Math.sin(a);pp.push(c[0]+(Ns[k][0]*cs+B[0]*sn)*r,c[1]+(Ns[k][1]*cs+B[1]*sn)*r,c[2]+(Ns[k][2]*cs+B[2]*sn)*r);nn.push(...tt)}
    for(let i=1;i<=rs;i++)sg>0?ii.push(0,i,i+1):ii.push(0,i+1,i);parts.push(finish(pp,nn,ii))});return merge(parts)}
  return g}
/* đường cong Catmull-Rom qua các điểm điều khiển */
function spline(cp,n){const out=[];const P=i=>cp[clamp(i,0,cp.length-1)];
  for(let s=0;s<cp.length-1;s++){const p0=P(s-1),p1=P(s),p2=P(s+1),p3=P(s+2);for(let i=0;i<n;i++){const t=i/n,t2=t*t,t3=t2*t;
    out.push([0,1,2].map(k=>.5*((2*p1[k])+(-p0[k]+p2[k])*t+(2*p0[k]-5*p1[k]+4*p2[k]-p3[k])*t2+(-p0[k]+3*p1[k]-3*p2[k]+p3[k])*t3)))}}
  out.push(cp[cp.length-1]);return out}
function merge(list){let p=[],n=[],ix=[],c=[],hasC=list.some(g=>g.col),off=0;
  for(const g of list){for(let i=0;i<g.pos.length;i++)p.push(g.pos[i]);for(let i=0;i<g.nrm.length;i++)n.push(g.nrm[i]);
    if(hasC){if(g.col)for(let i=0;i<g.col.length;i++)c.push(g.col[i]);else for(let i=0;i<g.pos.length/3;i++)c.push(1,1,1,1)}
    for(let i=0;i<g.idx.length;i++)ix.push(g.idx[i]+off);off+=g.pos.length/3}
  return finish(p,n,ix,hasC?c:null)}
function colorize(g,fn){const c=new Float32Array(g.pos.length/3*4);for(let i=0;i<g.pos.length/3;i++){const r=fn(g.pos[i*3],g.pos[i*3+1],g.pos[i*3+2],i);c[i*4]=r[0];c[i*4+1]=r[1];c[i*4+2]=r[2];c[i*4+3]=r[3]==null?1:r[3]}g.col=c;return g}
/* bề mặt từ hàm khoảng cách có dấu (naive surface nets) — f(x,y,z) nhận 3 số.
   Tính hai cấp: lưới thô trước, chỉ tính lưới mịn ở dải gần bề mặt; pháp tuyến lấy từ gradient trên lưới. */
function fromSDF(f,bmin,bmax,res,o){o=o||{};const nx=res[0],ny=res[1],nz=res[2];const dx=(bmax[0]-bmin[0])/nx,dy=(bmax[1]-bmin[1])/ny,dz=(bmax[2]-bmin[2])/nz;
  const sx=nx+1,sy=ny+1,sz=nz+1;const val=new Float32Array(sx*sy*sz);const I=(i,j,k)=>(k*sy+j)*sx+i;
  const B=o.block||4;const cd=Math.hypot(dx,dy,dz)*B*(o.margin||1.6);
  for(let k0=0;k0<sz;k0+=B)for(let j0=0;j0<sy;j0+=B)for(let i0=0;i0<sx;i0+=B){
    const ci=Math.min(i0+B/2,nx),cj=Math.min(j0+B/2,ny),ck=Math.min(k0+B/2,nz);
    const c=f(bmin[0]+ci*dx,bmin[1]+cj*dy,bmin[2]+ck*dz);
    const i1=Math.min(i0+B,sx),j1=Math.min(j0+B,sy),k1=Math.min(k0+B,sz);
    if(Math.abs(c)>cd){for(let k=k0;k<k1;k++)for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++)val[I(i,j,k)]=c;continue}
    for(let k=k0;k<k1;k++)for(let j=j0;j<j1;j++)for(let i=i0;i<i1;i++)val[I(i,j,k)]=f(bmin[0]+i*dx,bmin[1]+j*dy,bmin[2]+k*dz)}
  const vid=new Int32Array(nx*ny*nz).fill(-1);const C=(i,j,k)=>(k*ny+j)*nx+i;const p=[],n=[],ix=[];
  const E=[[0,1],[2,3],[4,5],[6,7],[0,2],[1,3],[4,6],[5,7],[0,4],[1,5],[2,6],[3,7]];
  const gv=(i,j,k)=>{i=Math.max(1,Math.min(nx-1,i));j=Math.max(1,Math.min(ny-1,j));k=Math.max(1,Math.min(nz-1,k));
    return[(val[I(i+1,j,k)]-val[I(i-1,j,k)])/dx,(val[I(i,j+1,k)]-val[I(i,j-1,k)])/dy,(val[I(i,j,k+1)]-val[I(i,j,k-1)])/dz]};
  const v=new Float32Array(8);
  for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){let neg=0;for(let c=0;c<8;c++){v[c]=val[I(i+(c&1),j+((c>>1)&1),k+((c>>2)&1))];if(v[c]<0)neg++}
    if(neg===0||neg===8)continue;
    let cnt=0;let ax=0,ay=0,az=0;for(const[a,b]of E){if((v[a]<0)!==(v[b]<0)){const t=v[a]/(v[a]-v[b]);ax+=(a&1)+(((b&1)-(a&1))*t);ay+=((a>>1)&1)+((((b>>1)&1)-((a>>1)&1))*t);az+=((a>>2)&1)+((((b>>2)&1)-((a>>2)&1))*t);cnt++}}
    const fx=ax/cnt,fy=ay/cnt,fz=az/cnt;vid[C(i,j,k)]=p.length/3;p.push(bmin[0]+(i+fx)*dx,bmin[1]+(j+fy)*dy,bmin[2]+(k+fz)*dz);
    /* gradient nội suy ba chiều từ 8 góc */
    let g=[0,0,0];for(let c=0;c<8;c++){const ci=c&1,cj=(c>>1)&1,ck=(c>>2)&1;const wgt=(ci?fx:1-fx)*(cj?fy:1-fy)*(ck?fz:1-fz);const q=gv(i+ci,j+cj,k+ck);g[0]+=q[0]*wgt;g[1]+=q[1]*wgt;g[2]+=q[2]*wgt}
    const l=Math.hypot(g[0],g[1],g[2])||1;n.push(g[0]/l,g[1]/l,g[2]/l)}
  for(let k=1;k<nz;k++)for(let j=1;j<ny;j++)for(let i=1;i<nx;i++){
    const v0=val[I(i,j,k)];
    for(let a=0;a<3;a++){const ii=i+(a===0),jj=j+(a===1),kk=k+(a===2);if(ii>nx||jj>ny||kk>nz)continue;const v1=val[I(ii,jj,kk)];if((v0<0)===(v1<0))continue;
      let q;if(a===0)q=[C(i,j,k),C(i,j-1,k),C(i,j-1,k-1),C(i,j,k-1)];else if(a===1)q=[C(i,j,k),C(i,j,k-1),C(i-1,j,k-1),C(i-1,j,k)];else q=[C(i,j,k),C(i-1,j,k),C(i-1,j-1,k),C(i,j-1,k)];
      const vv=[vid[q[0]],vid[q[1]],vid[q[2]],vid[q[3]]];if(vv[0]<0||vv[1]<0||vv[2]<0||vv[3]<0)continue;
      if(v0<0)ix.push(vv[0],vv[1],vv[2],vv[0],vv[2],vv[3]);else ix.push(vv[0],vv[2],vv[1],vv[0],vv[3],vv[2])}}
  return finish(p,n,ix)}
/* hàm khoảng cách cơ bản */
const SDF={
  sph:(p,c,r)=>Math.hypot(p[0]-c[0],p[1]-c[1],p[2]-c[2])-r,
  ell:(p,c,r)=>{const x=(p[0]-c[0])/r[0],y=(p[1]-c[1])/r[1],z=(p[2]-c[2])/r[2];const k0=Math.hypot(x,y,z),k1=Math.hypot(x/r[0],y/r[1],z/r[2]);return k1>0?k0*(k0-1)/k1:-Math.min(r[0],r[1],r[2])},
  cap:(p,a,b,r)=>{const pa=V3.sub(p,a),ba=V3.sub(b,a);const h=clamp(V3.dot(pa,ba)/V3.dot(ba,ba),0,1);return V3.len(V3.sub(pa,V3.scale(ba,h)))-r},
  smin:(a,b,k)=>{const h=clamp(.5+.5*(b-a)/k,0,1);return b+(a-b)*h-k*h*(1-h)},
  smax:(a,b,k)=>-SDF.smin(-a,-b,k)
};

/* ---------- shader ---------- */
const VS=`#version 300 es
layout(location=0) in vec3 aPos;layout(location=1) in vec3 aNrm;layout(location=2) in vec4 aCol;layout(location=3) in vec2 aUV;
layout(location=4) in vec4 aInst;layout(location=5) in vec4 aInstCol;layout(location=6) in vec4 aW;
uniform mat4 uModel,uView,uProj;uniform mat3 uNM;uniform float uTime;
//HOOK_VU
out vec3 vW;out vec3 vN;out vec4 vC;out vec2 vUV;out vec4 vWt;out vec3 vO;
void main(){vec3 p=aPos;vec3 n=aNrm;
//HOOK_VS
p=p*aInst.w+aInst.xyz;vec4 w=uModel*vec4(p,1.);vW=w.xyz;vN=normalize(uNM*n);vC=aCol*aInstCol;vUV=aUV;vWt=aW;vO=aPos;gl_Position=uProj*uView*w;}`;
const FS_HEAD=`#version 300 es
precision highp float;
in vec3 vW;in vec3 vN;in vec4 vC;in vec2 vUV;in vec4 vWt;in vec3 vO;
uniform vec3 uCam;uniform vec4 uBase;uniform vec3 uEmis;uniform float uRough,uMetal,uWrap,uCoat,uSheen,uTime,uExp,uInk;
uniform vec3 uK1d,uK1c,uK2d,uK2c,uK3d,uK3c,uSky,uGnd,uHor;uniform vec4 uClip;uniform int uUseClip;
//HOOK_FU
out vec4 frag;
vec3 envC(vec3 r,float ro){float y=r.y;vec3 c=mix(uGnd,uHor,smoothstep(-.35,0.,y));c=mix(c,uSky,smoothstep(0.,.7,y));
 float e1=mix(500.,6.,ro),e2=mix(220.,5.,ro);float g1=mix(5.,.25,ro),g2=mix(2.2,.18,ro);
 c+=pow(max(dot(r,normalize(vec3(.35,.75,.55))),0.),e1)*g1*vec3(1.,.97,.92);
 c+=pow(max(dot(r,normalize(vec3(-.8,.35,.25))),0.),e2)*g2*vec3(.85,.9,1.);
 c+=pow(max(dot(r,normalize(vec3(0.,.2,-1.))),0.),e2)*g2*.6;return c;}
float Dg(float h,float a){float a2=a*a;float d=h*h*(a2-1.)+1.;return a2/(3.14159*d*d);}
float Vg(float nv,float nl,float a){float k=a*.5;return .25/((nv*(1.-k)+k)*(nl*(1.-k)+k));}
vec3 Fs(vec3 f0,float c){return f0+(1.-f0)*pow(1.-c,5.);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec3 outc(vec3 c){return pow(aces(c*uExp),vec3(1./2.2));}
vec3 light(vec3 N,vec3 V,vec3 L,vec3 C,vec3 dif,vec3 f0,float a,float wrap){float nl0=dot(N,L);float nl=max(nl0,0.);float w=max((nl0+wrap)/(1.+wrap),0.);
 vec3 H=normalize(L+V);float nh=max(dot(N,H),0.),vh=max(dot(V,H),0.),nv=max(dot(N,V),1e-3);vec3 F=Fs(f0,vh);
 return (dif*w*(1.-F)+Dg(nh,a)*Vg(nv,nl,a)*F*nl*3.14159)*C;}
`;
const FS_STD=FS_HEAD+`void main(){
 if(uUseClip==1&&dot(vec4(vW,1.),uClip)<0.)discard;
 vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 V=normalize(uCam-vW);
 vec4 base=uBase*vC;vec3 emis=uEmis;float rough=uRough,metal=uMetal;
//HOOK_FS
 float a=max(rough*rough,.003);vec3 f0=mix(vec3(.04),base.rgb,metal);vec3 dif=base.rgb*(1.-metal);float nv=max(dot(N,V),1e-3);
 vec3 c=light(N,V,uK1d,uK1c,dif,f0,a,uWrap)+light(N,V,uK2d,uK2c,dif,f0,a,uWrap)+light(N,V,uK3d,uK3c,dif,f0,a,uWrap);
 vec3 R=reflect(-V,N);vec3 Fa=Fs(f0,nv)*(1.-rough*.7);vec3 amb=mix(uGnd,uSky,N.y*.5+.5);
 c+=dif*amb*.9+envC(R,rough)*Fa;
 if(uSheen>0.)c+=uSheen*pow(1.-nv,3.)*base.rgb*1.5;
 if(uCoat>0.){float Fc=.04+.96*pow(1.-nv,5.);c+=envC(R,.04)*Fc*uCoat;vec3 H=normalize(uK1d+V);c+=Dg(max(dot(N,H),0.),.02)*.25*Fc*uK1c*uCoat*max(dot(N,uK1d),0.);}
 c+=emis;frag=vec4(outc(c),base.a);}`;
const FS_GLASS=FS_HEAD+`void main(){
 if(uUseClip==1&&dot(vec4(vW,1.),uClip)<0.)discard;
 vec3 N=normalize(vN);if(!gl_FrontFacing)N=-N;vec3 V=normalize(uCam-vW);float nv=abs(dot(N,V));
 float F=.04+.96*pow(1.-nv,5.);vec3 R=reflect(-V,N);vec3 c=envC(R,.02)*F*1.3;
 vec3 H=normalize(uK1d+V);c+=Dg(max(dot(N,H),0.),.004)*.06*uK1c;H=normalize(uK2d+V);c+=Dg(max(dot(N,H),0.),.006)*.04*uK2c;
 float edge=pow(1.-nv,2.2);vec3 tint=uBase.rgb;
//HOOK_FS
 float al=clamp(edge*uBase.a+.03+F*.2,0.,.9);vec3 col=outc(c+tint*(.25+edge*.6)*al);
 float ink=uInk*smoothstep(.15,.85,edge);al=max(al,ink*.62);col=mix(col,vec3(.16,.2,.28)*al,ink);frag=vec4(col,al);}`;
const FS_UNLIT=FS_HEAD+`void main(){if(uUseClip==1&&dot(vec4(vW,1.),uClip)<0.)discard;vec4 base=uBase*vC;vec3 emis=uEmis;
//HOOK_FS
 frag=vec4(base.rgb+emis,base.a);}`;
const FS_SHADOW=FS_HEAD+`void main(){vec2 q=vUV*2.-1.;float r=length(q);float a=pow(clamp(1.-r,0.,1.),1.6)*uBase.a;frag=vec4(0.,0.,0.,a);}`;
const BG_VS=`#version 300 es
const vec2 P[3]=vec2[3](vec2(-1.,-1.),vec2(3.,-1.),vec2(-1.,3.));out vec2 vP;void main(){vP=P[gl_VertexID];gl_Position=vec4(vP,.999,1.);}`;
const BG_FS=`#version 300 es
precision highp float;in vec2 vP;uniform vec3 uTop,uBot,uGlow;uniform vec2 uGlowP;out vec4 frag;
void main(){float t=vP.y*.5+.5;vec3 c=mix(uBot,uTop,smoothstep(0.,1.,t));float g=exp(-pow(length((vP-uGlowP)*vec2(1.,1.4)),2.)*1.6);c+=uGlow*g;
 float v=1.-.28*pow(length(vP*vec2(.85,1.)),2.);c*=v;frag=vec4(pow(c,vec3(1./2.2)),1.);}`;

/* ---------- renderer ---------- */
class Node{
  constructor(o){this.pos=[0,0,0];this.quat=[0,0,0,1];this.scl=[1,1,1];this.children=[];this.visible=true;this.mesh=null;this.mat=null;this.world=M4.ident();this.local=M4.ident();if(o)Object.assign(this,o)}
  add(n){this.children.push(n);n.parent=this;return n}
  remove(n){const i=this.children.indexOf(n);if(i>=0)this.children.splice(i,1);return n}
  rot(x,y,z){this.quat=Q.euler(x,y,z);return this}
  set(p){this.pos=p;return this}
  size(s){this.scl=typeof s==="number"?[s,s,s]:s;return this}
}
function create(canvas,opt){
  opt=opt||{};
  const gl=canvas.getContext("webgl2",{antialias:true,alpha:false,premultipliedAlpha:false,preserveDrawingBuffer:!!opt.preserve,powerPreference:"high-performance"});
  if(!gl) return null;
  const progs={};
  function compile(type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const e=gl.getShaderInfoLog(s);console.error(e,src.split("\n").map((l,i)=>(i+1)+": "+l).join("\n"));throw new Error("shader: "+e)}return s}
  function program(vs,fs){const p=gl.createProgram();gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));
    const u={};const n=gl.getProgramParameter(p,gl.ACTIVE_UNIFORMS);for(let i=0;i<n;i++){const inf=gl.getActiveUniform(p,i);u[inf.name.replace(/\[0\]$/,"")]=gl.getUniformLocation(p,inf.name)}return{p,u}}
  function progFor(m){if(m._prog)return m._prog;const h=m.hooks||{};const key=m.type+"|"+(m.key||"")+"|"+(h.vu||"")+(h.vs||"")+"|"+(h.fu||"")+(h.fs||"");if(progs[key])return m._prog=progs[key];
    let vs=VS.replace("//HOOK_VU",h.vu||"").replace("//HOOK_VS",h.vs||"");
    const base=m.type==="glass"?FS_GLASS:m.type==="unlit"?FS_UNLIT:m.type==="shadow"?FS_SHADOW:FS_STD;
    let fs=base.replace("//HOOK_FU",h.fu||"").replace("//HOOK_FS",h.fs||"");return m._prog=progs[key]=program(vs,fs)}
  const bg=program(BG_VS,BG_FS);
  function upload(g){const vao=gl.createVertexArray();gl.bindVertexArray(vao);
    const buf=(data,loc,size)=>{const b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0);return b};
    const bufs=[buf(g.pos,0,3),buf(g.nrm,1,3)];if(g.col)bufs.push(buf(g.col,2,4));if(g.uv)bufs.push(buf(g.uv,3,2));if(g.w)bufs.push(buf(g.w,6,4));
    const ib=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ib);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,g.idx,gl.STATIC_DRAW);gl.bindVertexArray(null);
    return{vao,bufs,ib,count:g.idx.length,type:g.idx instanceof Uint32Array?gl.UNSIGNED_INT:gl.UNSIGNED_SHORT,hasCol:!!g.col,hasUV:!!g.uv,hasW:!!g.w,geo:g,inst:null}}
  function mesh(g,mat){const m=upload(g);return new Node({mesh:m,mat:material(mat)})}
  /* nhóm hạt: cùng một hình, nhiều bản sao; data mỗi bản: x,y,z,scale,r,g,b,a */
  function instanced(g,mat,max){const m=upload(g);gl.bindVertexArray(m.vao);
    const ib=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,ib);gl.bufferData(gl.ARRAY_BUFFER,max*32,gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(4);gl.vertexAttribPointer(4,4,gl.FLOAT,false,32,0);gl.vertexAttribDivisor(4,1);
    gl.enableVertexAttribArray(5);gl.vertexAttribPointer(5,4,gl.FLOAT,false,32,16);gl.vertexAttribDivisor(5,1);gl.bindVertexArray(null);
    m.inst={buf:ib,max,count:0,data:new Float32Array(max*8)};const n=new Node({mesh:m,mat:material(mat)});
    n.setInstances=function(cnt){m.inst.count=Math.min(cnt,max);gl.bindBuffer(gl.ARRAY_BUFFER,ib);gl.bufferSubData(gl.ARRAY_BUFFER,0,m.inst.data,0,m.inst.count*8)};n.data=m.inst.data;return n}
  function material(o){o=Object.assign({type:"std",color:[.8,.8,.8],alpha:1,rough:.5,metal:0,emis:[0,0,0],wrap:0,coat:0,sheen:0,side:"front",blend:null,depth:true,clip:null,order:0},o||{});
    if(typeof o.color==="string")o.color=hex(o.color);if(typeof o.emis==="string")o.emis=hex(o.emis);
    if(o.type==="glass"||o.type==="shadow"||o.alpha<1)o.transparent=o.transparent!==false;return o}
  function dispose(n){(function walk(x){if(x.mesh){gl.deleteVertexArray(x.mesh.vao);x.mesh.bufs.forEach(b=>gl.deleteBuffer(b));gl.deleteBuffer(x.mesh.ib);if(x.mesh.inst)gl.deleteBuffer(x.mesh.inst.buf)}x.children.forEach(walk)})(n)}

  const env={sky:hex("#5E6E9E"),gnd:hex("#1A1F33"),hor:hex("#3A4466"),
    k1d:V3.norm([.5,.85,.45]),k1c:[2.6,2.45,2.25],k2d:V3.norm([-.75,.35,.3]),k2c:[.75,.85,1.1],k3d:V3.norm([-.1,.5,-.9]),k3c:[1.1,1.0,1.2],exposure:1,
    bgTop:hex("#1C2554"),bgBot:hex("#05081A"),bgGlow:hex("#2E3A7A"),glowP:[0,.35]};
  let W=1,H=1,DPR=1;
  function resize(w,h,dpr){DPR=dpr||1;W=Math.max(1,Math.round(w*DPR));H=Math.max(1,Math.round(h*DPR));if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H}}
  const cam={fov:40*Math.PI/180,near:.05,far:200,target:[0,0,0],yaw:.5,pitch:.3,dist:6,eye:[0,0,6],view:M4.ident(),proj:M4.ident(),vp:M4.ident(),ivp:M4.ident(),aspect:1,shift:[0,0]};
  function updateCam(asp){const cp=Math.cos(cam.pitch);cam.eye=[cam.target[0]+cam.dist*cp*Math.sin(cam.yaw),cam.target[1]+cam.dist*Math.sin(cam.pitch),cam.target[2]+cam.dist*cp*Math.cos(cam.yaw)];
    cam.aspect=asp||W/H;cam.view=M4.lookAt(cam.eye,cam.target,[0,1,0]);cam.proj=M4.persp(cam.fov,cam.aspect,cam.near,cam.far);
    if(cam.shift[0]||cam.shift[1]){cam.proj[8]-=cam.shift[0];cam.proj[9]-=cam.shift[1]}
    cam.vp=M4.mul(cam.proj,cam.view);cam.ivp=M4.inv(cam.vp)}
  function walk(n,parent,list){if(!n.visible)return;M4.trs(n.pos,n.quat,n.scl,n.local);if(parent)M4.mul(parent,n.local,n.world);else n.world.set(n.local);
    if(n.mesh&&n.mat)list.push(n);for(const c of n.children)walk(c,n.world,list)}
  function setU(pr,m,n,time){const u=pr.u;gl.uniformMatrix4fv(u.uModel,false,n.world);gl.uniformMatrix3fv(u.uNM,false,M4.nrm3(n.world));
    gl.uniformMatrix4fv(u.uView,false,cam.view);gl.uniformMatrix4fv(u.uProj,false,cam.proj);
    const c=m.color;gl.uniform4f(u.uBase,c[0],c[1],c[2],m.alpha);if(u.uEmis)gl.uniform3fv(u.uEmis,m.emis);
    if(u.uRough!=null)gl.uniform1f(u.uRough,m.rough);if(u.uMetal!=null)gl.uniform1f(u.uMetal,m.metal);if(u.uWrap!=null)gl.uniform1f(u.uWrap,m.wrap);if(u.uCoat!=null)gl.uniform1f(u.uCoat,m.coat);if(u.uSheen!=null)gl.uniform1f(u.uSheen,m.sheen);
    if(u.uTime!=null)gl.uniform1f(u.uTime,time);if(u.uExp!=null)gl.uniform1f(u.uExp,env.exposure);if(u.uInk!=null)gl.uniform1f(u.uInk,env.ink||0);if(u.uCam)gl.uniform3fv(u.uCam,cam.eye);
    if(u.uK1d){gl.uniform3fv(u.uK1d,env.k1d);gl.uniform3fv(u.uK1c,env.k1c);gl.uniform3fv(u.uK2d,env.k2d);gl.uniform3fv(u.uK2c,env.k2c);gl.uniform3fv(u.uK3d,env.k3d);gl.uniform3fv(u.uK3c,env.k3c);}
    if(u.uSky){gl.uniform3fv(u.uSky,env.sky);gl.uniform3fv(u.uGnd,env.gnd);gl.uniform3fv(u.uHor,env.hor)}
    if(u.uUseClip!=null){gl.uniform1i(u.uUseClip,m.clip?1:0);if(m.clip)gl.uniform4fv(u.uClip,m.clip)}
    if(m.uniforms)for(const k in m.uniforms){const loc=u[k];if(loc==null)continue;const v=m.uniforms[k];
      if(typeof v==="number")gl.uniform1f(loc,v);else if(v.length===2)gl.uniform2fv(loc,v);else if(v.length===3)gl.uniform3fv(loc,v);else if(v.length===4)gl.uniform4fv(loc,v);else if(v.length===16)gl.uniformMatrix4fv(loc,false,v);else gl.uniform1fv(loc,v)}
    if(m.textures){let unit=0;for(const k in m.textures){const loc=u[k];if(loc==null)continue;const t=m.textures[k];gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(t.target,t.tex);gl.uniform1i(loc,unit);unit++}}}
  function draw(n,time,cull){const m=n.mat,me=n.mesh;const pr=progFor(m);gl.useProgram(pr.p);setU(pr,m,n,time);
    if(cull==="none"||m.side==="double")gl.disable(gl.CULL_FACE);else{gl.enable(gl.CULL_FACE);gl.cullFace(cull==="front"?gl.FRONT:gl.BACK)}
    gl.bindVertexArray(me.vao);if(!me.hasCol)gl.vertexAttrib4f(2,1,1,1,1);if(!me.hasUV)gl.vertexAttrib2f(3,0,0);if(!me.hasW)gl.vertexAttrib4f(6,0,0,0,0);
    if(me.inst){if(me.inst.count>0)gl.drawElementsInstanced(gl.TRIANGLES,me.count,me.type,0,me.inst.count)}
    else{gl.vertexAttrib4f(4,0,0,0,1);gl.vertexAttrib4f(5,1,1,1,1);gl.drawElements(gl.TRIANGLES,me.count,me.type,0)}}
  function render(root,time){updateCam();gl.viewport(0,0,W,H);pass(root,time)}
  /* khung phóng to: vẽ lại cảnh từ một camera gần vào một ô chữ nhật (px CSS) của canvas, rồi trả camera chính về như cũ */
  function renderInset(root,time,rect,c){const keep={};for(const k of ["target","yaw","pitch","dist","fov","shift","eye","view","proj","vp","ivp","aspect"])keep[k]=cam[k];
    const x=Math.round(rect.x*DPR),w=Math.max(1,Math.round(rect.w*DPR)),h=Math.max(1,Math.round(rect.h*DPR)),y=Math.round(H-(rect.y+rect.h)*DPR);
    Object.assign(cam,{target:c.target,yaw:c.yaw,pitch:c.pitch,dist:c.dist,fov:c.fov||cam.fov,shift:[0,0]});updateCam(w/h);
    gl.enable(gl.SCISSOR_TEST);gl.scissor(x,y,w,h);gl.viewport(x,y,w,h);pass(root,time);gl.disable(gl.SCISSOR_TEST);gl.viewport(0,0,W,H);Object.assign(cam,keep)}
  function pass(root,time){gl.clearColor(0,0,0,1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    /* nền */
    gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.useProgram(bg.p);gl.uniform3fv(bg.u.uTop,env.bgTop);gl.uniform3fv(bg.u.uBot,env.bgBot);gl.uniform3fv(bg.u.uGlow,env.bgGlow);gl.uniform2fv(bg.u.uGlowP,env.glowP);gl.bindVertexArray(null);gl.drawArrays(gl.TRIANGLES,0,3);
    gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);
    const list=[];walk(root,null,list);
    const opaque=list.filter(n=>!n.mat.transparent),trans=list.filter(n=>n.mat.transparent);
    gl.depthMask(true);gl.disable(gl.BLEND);for(const n of opaque)draw(n,time);
    const depth=n=>{const w=n.world;const p=[w[12],w[13],w[14]];const d=V3.dist(p,cam.eye);return d};
    trans.forEach(n=>n._d=depth(n)-(n.mat.order||0)*100);trans.sort((a,b)=>b._d-a._d);
    gl.enable(gl.BLEND);gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);
    /* kính: mặt sau trước, rồi chất lỏng/hạt, rồi mặt trước */
    gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);for(const n of trans)if(n.mat.type==="glass")draw(n,time,"front");
    for(const n of trans)if(n.mat.type!=="glass"){if(n.mat.blend==="add")gl.blendFunc(gl.ONE,gl.ONE);else if(n.mat.blend==="pre")gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);else gl.blendFuncSeparate(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA,gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
      if(n.mat.depth===false)gl.disable(gl.DEPTH_TEST);if(n.mat.zwrite)gl.depthMask(true);draw(n,time,n.mat.cull||"back");gl.enable(gl.DEPTH_TEST);gl.depthMask(false)}
    gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
    for(const n of trans)if(n.mat.type==="glass")draw(n,time,"back");
    gl.depthMask(true);gl.disable(gl.BLEND);}
  /* chiếu điểm thế giới ra px CSS của canvas */
  function project(p){const c=M4.xf(cam.vp,p);const w=cam.vp[3]*p[0]+cam.vp[7]*p[1]+cam.vp[11]*p[2]+cam.vp[15];return{x:(c[0]*.5+.5)*W/DPR,y:(1-(c[1]*.5+.5))*H/DPR,z:c[2],behind:w<=0}}
  function ray(x,y){const nx=x/(W/DPR)*2-1,ny=1-y/(H/DPR)*2;const a=M4.xf(cam.ivp,[nx,ny,-1]),b=M4.xf(cam.ivp,[nx,ny,1]);return{o:a,d:V3.norm(V3.sub(b,a))}}
  /* texture 2D từ canvas/ảnh/mảng */
  function tex2D(src,o){o=o||{};const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,t);
    if(src instanceof Uint8Array||src instanceof Float32Array){gl.texImage2D(gl.TEXTURE_2D,0,o.internal||gl.RGBA,o.w,o.h,0,o.format||gl.RGBA,src instanceof Float32Array?gl.FLOAT:gl.UNSIGNED_BYTE,src)}
    else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,src);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,o.mip?gl.LINEAR_MIPMAP_LINEAR:gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,o.repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,o.repeat?gl.REPEAT:gl.CLAMP_TO_EDGE);
    if(o.mip)gl.generateMipmap(gl.TEXTURE_2D);
    return{tex:t,target:gl.TEXTURE_2D,update(s,w,h){gl.bindTexture(gl.TEXTURE_2D,t);if(s instanceof Uint8Array)gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,w,h,gl.RGBA,gl.UNSIGNED_BYTE,s);else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,s);if(o.mip)gl.generateMipmap(gl.TEXTURE_2D)}}}
  /* texture 3D một kênh (R8) cho trường nồng độ */
  function tex3D(nx,ny,nz){const t=gl.createTexture();gl.bindTexture(gl.TEXTURE_3D,t);gl.texImage3D(gl.TEXTURE_3D,0,gl.R8,nx,ny,nz,0,gl.RED,gl.UNSIGNED_BYTE,new Uint8Array(nx*ny*nz));
    [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER].forEach(p=>gl.texParameteri(gl.TEXTURE_3D,p,gl.LINEAR));[gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T,gl.TEXTURE_WRAP_R].forEach(p=>gl.texParameteri(gl.TEXTURE_3D,p,gl.CLAMP_TO_EDGE));
    return{tex:t,target:gl.TEXTURE_3D,update(data){gl.bindTexture(gl.TEXTURE_3D,t);gl.texSubImage3D(gl.TEXTURE_3D,0,0,0,0,nx,ny,nz,gl.RED,gl.UNSIGNED_BYTE,data)}}}
  return{gl,canvas,cam,env,resize,render,renderInset,mesh,instanced,material,dispose,project,ray,updateCam,tex2D,tex3D,size:()=>({w:W/DPR,h:H/DPR,dpr:DPR})};
}

/* ---------- điều khiển camera xoay quanh tâm (gọi từ trình xử lí con trỏ của bài) ---------- */
function orbit(cam,o){o=Object.assign({minPitch:-.15,maxPitch:1.35,minDist:1,maxDist:20,minYaw:-Infinity,maxYaw:Infinity,speed:.0065},o||{});
  let drag=null,vy=0,vp=0;const ptrs=new Map();let pinch=null;const home={yaw:cam.yaw,pitch:cam.pitch,dist:cam.dist,target:[...cam.target]};let anim=null;
  return{
    start(p,id){ptrs.set(id==null?0:id,p);if(ptrs.size===2){const a=[...ptrs.values()];pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y),dist:cam.dist};drag=null;return}drag={x:p.x,y:p.y,t:performance.now()};vy=vp=0;anim=null},
    move(p,id){if(ptrs.has(id==null?0:id))ptrs.set(id==null?0:id,p);
      if(pinch&&ptrs.size===2){const a=[...ptrs.values()];const d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);cam.dist=clamp(pinch.dist*pinch.d/Math.max(d,1),o.minDist,o.maxDist);return}
      if(!drag)return;const dx=p.x-drag.x,dy=p.y-drag.y;drag.x=p.x;drag.y=p.y;vy=-dx*o.speed;vp=dy*o.speed;
      cam.yaw=clamp(cam.yaw+vy,o.minYaw,o.maxYaw);cam.pitch=clamp(cam.pitch+vp,o.minPitch,o.maxPitch)},
    end(id){ptrs.delete(id==null?0:id);if(ptrs.size<2)pinch=null;drag=null},
    wheel(e){cam.dist=clamp(cam.dist*Math.exp(e.deltaY*.0012),o.minDist,o.maxDist)},
    get active(){return !!drag||!!pinch},
    stop(){anim=null;vy=vp=0},
    update(dt){if(anim){anim.t=Math.min(1,anim.t+dt/anim.dur);const k=1-Math.pow(1-anim.t,3);for(const key of["yaw","pitch","dist"])cam[key]=anim.from[key]+(anim.to[key]-anim.from[key])*k;
        cam.target=V3.lerp(anim.from.target,anim.to.target,k);if(anim.t>=1)anim=null;return}
      if(!drag&&(Math.abs(vy)>1e-5||Math.abs(vp)>1e-5)){cam.yaw=clamp(cam.yaw+vy,o.minYaw,o.maxYaw);cam.pitch=clamp(cam.pitch+vp,o.minPitch,o.maxPitch);const f=Math.pow(.0015,dt);vy*=f;vp*=f}},
    fly(to,dur){anim={t:0,dur:dur||.8,from:{yaw:cam.yaw,pitch:cam.pitch,dist:cam.dist,target:[...cam.target]},to:Object.assign({yaw:cam.yaw,pitch:cam.pitch,dist:cam.dist,target:[...cam.target]},to)}},
    home(dur){this.fly({yaw:home.yaw,pitch:home.pitch,dist:home.dist,target:home.target},dur)},
    setHome(){home.yaw=cam.yaw;home.pitch=cam.pitch;home.dist=cam.dist;home.target=[...cam.target]}
  };
}
/* ---------- chú thích HTML gắn vào điểm 3D ----------
   Mỗi nhãn đặt lệch khỏi điểm neo theo hướng (dir) hoặc toả ra ngoài một tâm (ring), nối về điểm neo bằng đường dẫn có mũi tên.
   Nhãn tự đẩy nhau để không chồng đè và luôn nằm trong vùng bounds(); độ lệch do tránh chồng được làm mượt giữa các khung hình.
   Lớp CSS: "plain" = chữ đặt giữa điểm neo, không đường dẫn; "left"/"right" = hướng w/e, đường ngắn. */
const DIRS={n:[0,-1],s:[0,1],e:[1,0],w:[-1,0],ne:[.72,-.7],nw:[-.72,-.7],se:[.72,.7],sw:[-.72,.7]};
function labels(host,R,opt){opt=opt||{};const items=[];const NS="http://www.w3.org/2000/svg";
  const svg=document.createElementNS(NS,"svg");svg.setAttribute("class","gl-lead");svg.setAttribute("aria-hidden","true");host.insertBefore(svg,host.firstChild);
  function add(text,p,cls,data){const el=document.createElement("div");el.className="gl-lab "+(cls||"");el.innerHTML=text;if(data)Object.assign(el.dataset,data);host.appendChild(el);
    const c=" "+(cls||"")+" ";const it={el,p,on:true,plain:c.includes(" plain "),dir:c.includes(" left ")?"w":c.includes(" right ")?"e":null,len:c.includes(" left ")||c.includes(" right ")?14:null,
      path:document.createElementNS(NS,"path"),head:document.createElementNS(NS,"path"),dot:document.createElementNS(NS,"circle"),_ox:0,_oy:0,_shown:false};
    it.head.setAttribute("class","ah");it.dot.setAttribute("class","dt");it.dot.setAttribute("r","2.2");svg.append(it.path,it.head,it.dot);items.push(it);return it}
  function show(it,v){if(it._vis!==v){it._vis=v;it.el.style.display=v?"":"none"}if(!v||it.plain){it.path.setAttribute("d","");it.head.setAttribute("d","");it.dot.setAttribute("r","0")}if(!v)it._shown=false}
  let fr=0,Bc=null,Oc=[];
  /* vùng được đặt nhãn và các ô nổi (bảng số liệu, thẻ, menu) cần tránh: đo lại mỗi 12 khung hình */
  function measure(){const s=R.size();Bc=opt.bounds?opt.bounds():{x:0,y:0,w:s.w,h:s.h};const hr=host.getBoundingClientRect();
    const els=[...host.children].filter(e=>!e.classList.contains("gl-lab")&&e!==svg).concat(opt.avoid?opt.avoid():[]);const HA=hr.width*hr.height;
    Oc=els.filter(e=>e&&e.offsetParent!==null&&!e.hidden&&getComputedStyle(e).display!=="none").map(e=>{const r=e.getBoundingClientRect();return{x0:r.left-hr.left-4,y0:r.top-hr.top-4,x1:r.right-hr.left+4,y1:r.bottom-hr.top+4}}).filter(r=>r.x1-r.x0>8&&r.y1-r.y0>8&&(r.x1-r.x0)*(r.y1-r.y0)<HA*.5)}
  let tPrev=0;
  function update(){if(fr++%12===0||!Bc)measure();const B=Bc;const now=performance.now(),dtu=tPrev?Math.min(.5,(now-tPrev)/1000):1;tPrev=now;const kS=1-Math.exp(-dtu*16);const bx0=B.x+4,by0=B.y+4,bx1=B.x+B.w-4,by1=B.y+B.h-4;const V=[];
    for(const it of items){if(!it.on){show(it,false);continue}const pp=typeof it.p==="function"?it.p():it.p;const q=R.project(pp);
      const vis=!(pp[0]<=-90&&pp[1]<=-90)&&!q.behind&&q.x>bx0-30&&q.y>by0-30&&q.x<bx1+30&&q.y<by1+30;show(it,vis);if(vis)V.push({it,ax:q.x,ay:q.y})}
    for(const v of V){v.w=v.it.el.offsetWidth;v.h=v.it.el.offsetHeight;v.hid=v.it.el.classList.contains("hid")}
    for(const v of V){const it=v.it;if(it.plain){v.cx=v.ax;v.cy=v.ay;continue}
      let d,len=it.len!=null?it.len:(opt.len||22);
      if(it.ring){const r=typeof it.ring==="function"?it.ring():it.ring;const c=R.project(r.c);let dx=v.ax-c.x,dy=v.ay-c.y;const L=Math.hypot(dx,dy)||1;d=[dx/L,dy/L];
        const e=R.project([r.c[0]+r.r,r.c[1],r.c[2]]),rp=Math.hypot(e.x-c.x,e.y-c.y);len=Math.max(len,rp-L+(r.gap||18))}
      else d=DIRS[it.dir||opt.dir||"n"]||DIRS.n;
      const k=Math.min(v.w/2/Math.max(Math.abs(d[0]),1e-3),v.h/2/Math.max(Math.abs(d[1]),1e-3));
      v.dx=d[0]*(len+k);v.dy=d[1]*(len+k);v.cx=v.ax+v.dx;v.cy=v.ay+v.dy}
    /* tránh chồng đè: đẩy cặp nhãn giao nhau theo trục chồng ít hơn (ưu tiên dọc), rồi ép vào vùng bounds */
    const A=V.filter(v=>!v.hid),M=5;
    for(let n=0;n<14;n++){let mv=false;
      for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],b=A[j];const ox=(a.w+b.w)/2+M-Math.abs(a.cx-b.cx),oy=(a.h+b.h)/2+M-Math.abs(a.cy-b.cy);
        if(ox>0&&oy>0){mv=true;const pa=a.it.plain?0:1,pb=b.it.plain?0:1;const t=pa+pb||1;
          if(oy<ox*1.5){const sg=a.cy<b.cy||(a.cy===b.cy&&i<j)?-1:1;a.cy+=sg*oy*pa/t;b.cy-=sg*oy*pb/t}else{const sg=a.cx<b.cx?-1:1;a.cx+=sg*ox*pa/t;b.cx-=sg*ox*pb/t}}}
      for(const v of A){if(v.it.plain)continue;
        for(const o of Oc){const ox=Math.min(v.cx+v.w/2,o.x1)-Math.max(v.cx-v.w/2,o.x0),oy=Math.min(v.cy+v.h/2,o.y1)-Math.max(v.cy-v.h/2,o.y0);
          if(ox>0&&oy>0){mv=true;const c=[[0,-((v.cy+v.h/2)-o.y0)],[0,o.y1-(v.cy-v.h/2)],[-((v.cx+v.w/2)-o.x0),0],[o.x1-(v.cx-v.w/2),0]];
            const ok=c.filter(([dx,dy])=>v.cx+dx-v.w/2>=bx0-1&&v.cx+dx+v.w/2<=bx1+1&&v.cy+dy-v.h/2>=by0-1&&v.cy+dy+v.h/2<=by1+1);
            const m=(ok.length?ok:c).reduce((a,b)=>Math.hypot(...a)<=Math.hypot(...b)?a:b);v.cx+=m[0];v.cy+=m[1]}}
        v.cx=Math.min(Math.max(v.cx,bx0+v.w/2),Math.max(bx0+v.w/2,bx1-v.w/2));v.cy=Math.min(Math.max(v.cy,by0+v.h/2),Math.max(by0+v.h/2,by1-v.h/2))}
      if(!mv)break}
    for(const v of V){const it=v.it;if(it.plain){it.el.style.transform=`translate(${(v.cx-v.w/2).toFixed(1)}px,${(v.cy-v.h/2).toFixed(1)}px)`;continue}
      const ox=v.cx-(v.ax+v.dx),oy=v.cy-(v.ay+v.dy);if(!it._shown){it._ox=ox;it._oy=oy;it._shown=true}else{it._ox+=(ox-it._ox)*kS;it._oy+=(oy-it._oy)*kS}
      const cx=v.ax+v.dx+it._ox,cy=v.ay+v.dy+it._oy;it.el.style.transform=`translate(${(cx-v.w/2).toFixed(1)}px,${(cy-v.h/2).toFixed(1)}px)`;
      /* đường dẫn: từ mép nhãn gần điểm neo nhất tới điểm neo, đầu mũi tên chỉ vào vật */
      const px=Math.min(Math.max(v.ax,cx-v.w/2+3),cx+v.w/2-3),py=Math.min(Math.max(v.ay,cy-v.h/2+2),cy+v.h/2-2);const dx=v.ax-px,dy=v.ay-py,L=Math.hypot(dx,dy);
      if(v.hid||L<7){it.path.setAttribute("d","");it.head.setAttribute("d","");it.dot.setAttribute("r","0");continue}
      const ux=dx/L,uy=dy/L,hx=v.ax-ux*2.5,hy=v.ay-uy*2.5,bx=hx-ux*6.5,by=hy-uy*6.5;
      it.path.setAttribute("d",`M${px.toFixed(1)} ${py.toFixed(1)}L${bx.toFixed(1)} ${by.toFixed(1)}`);
      it.head.setAttribute("d",`M${hx.toFixed(1)} ${hy.toFixed(1)}L${(bx-uy*3.2).toFixed(1)} ${(by+ux*3.2).toFixed(1)}L${(bx+uy*3.2).toFixed(1)} ${(by-ux*3.2).toFixed(1)}Z`);
      it.dot.setAttribute("r","0")}}
  return{add,update,clear(){items.splice(0).forEach(it=>{it.el.remove();it.path.remove();it.head.remove();it.dot.remove()})},items,svg}}
/* ---------- giao cắt tia ---------- */
const hit={
  sphere(r,c,rad){const oc=V3.sub(r.o,c);const b=V3.dot(oc,r.d),cc=V3.dot(oc,oc)-rad*rad,h=b*b-cc;if(h<0)return null;const t=-b-Math.sqrt(h);return t>0?t:(-b+Math.sqrt(h)>0?0:null)},
  planeY(r,y){if(Math.abs(r.d[1])<1e-6)return null;const t=(y-r.o[1])/r.d[1];return t>0?t:null},
  box(r,mn,mx){let t0=-Infinity,t1=Infinity;for(let i=0;i<3;i++){const inv=1/r.d[i];let a=(mn[i]-r.o[i])*inv,b=(mx[i]-r.o[i])*inv;if(a>b)[a,b]=[b,a];t0=Math.max(t0,a);t1=Math.min(t1,b)}return t1>=t0&&t1>0?Math.max(t0,0):null},
  sdf(r,f,tmax){let t=0;for(let i=0;i<160&&t<tmax;i++){const p=V3.add(r.o,V3.scale(r.d,t));const d=f(p[0],p[1],p[2]);if(d<.002)return t;t+=Math.max(d*.9,.002)}return null},
  at:(r,t)=>V3.add(r.o,V3.scale(r.d,t))
};
/* âm thanh tổng hợp nhẹ (xèo xèo, lách tách) — chỉ bật sau thao tác của người dùng */
const audio=(function(){let ctx=null,noise=null;
  function ensure(){if(!ctx){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;ctx=new AC();const len=ctx.sampleRate*2;noise=ctx.createBuffer(1,len,ctx.sampleRate);const d=noise.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1}if(ctx.state==="suspended")ctx.resume();return ctx}
  function hiss(level,dur){const c=ensure();if(!c)return null;const s=c.createBufferSource();s.buffer=noise;s.loop=true;const f=c.createBiquadFilter();f.type="bandpass";f.frequency.value=3200;f.Q.value=.7;const g=c.createGain();g.gain.value=0;
    s.connect(f);f.connect(g);g.connect(c.destination);s.start();return{set(v){g.gain.setTargetAtTime(Math.max(0,v)*.18,c.currentTime,.05)},stop(){g.gain.setTargetAtTime(0,c.currentTime,.08);setTimeout(()=>{try{s.stop()}catch(e){}},400)}}}
  function pop(v){const c=ensure();if(!c)return;const s=c.createBufferSource();s.buffer=noise;const f=c.createBiquadFilter();f.type="lowpass";f.frequency.value=900;const g=c.createGain();g.gain.setValueAtTime((v||1)*.5,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.18);s.connect(f);f.connect(g);g.connect(c.destination);s.start();s.stop(c.currentTime+.2)}
  return{ensure,hiss,pop,get ready(){return !!ctx}}})();

window.LabGL={V3,M4,Q,hex,clamp,sphere,lathe,disk,cylinder,box,plane,tube,spline,merge,colorize,fromSDF,SDF,Node,create,orbit,labels,hit,audio};
})();
