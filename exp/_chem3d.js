/* LabKHTN · bộ máy BÀN HÓA HỌC 3D (dùng LabGL)
   - Bàn thí nghiệm, cốc, chậu thủy tinh, ống nghiệm, giá ống nghiệm, lọ dầu đựng kim loại
   - Nước có chất chỉ thị: trường nồng độ 3D mô phỏng khuếch tán và chìm xuống, vẽ bằng dò tia trong shader (vệt hồng)
   - Bọt khí, khói, lửa (cộng sáng), mảnh kim loại các dạng: khối, hạt, dải, đinh, lá */
(function(){
"use strict";
if(window.LabChem3D) return;
const G=window.LabGL,V3=G.V3,H=G.hex;

const NOISE=`float hsh(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hsh(i),hsh(i+vec3(1,0,0)),f.x),mix(hsh(i+vec3(0,1,0)),hsh(i+vec3(1,1,0)),f.x),f.y),mix(mix(hsh(i+vec3(0,0,1)),hsh(i+vec3(1,0,1)),f.x),mix(hsh(i+vec3(0,1,1)),hsh(i+vec3(1,1,1)),f.x),f.y),f.z);}`;

/* ---------- bàn ---------- */
function bench(R,w,d,day){const n=new G.Node();
  const top=n.add(R.mesh(G.box(w,.16,d,.03,3),{color:day?"#DCD6CB":"#1E2333",rough:.62,coat:.12,key:"bench",hooks:{fu:NOISE+"uniform float uNF;",fs:`{float q=vn(vO*uNF)*.6+vn(vO*uNF*3.7)*.4;base.rgb*=.9+.18*q;}`},uniforms:{uNF:3}}));top.pos=[0,-.0815,0];
  const legM={color:day?"#B9B2A6":"#161A28",rough:.6};
  const front=n.add(R.mesh(G.box(w,.9,.06,.02,2),legM));front.pos=[0,-.6,d/2-.05];
  const sh=n.add(R.mesh(G.plane(w*1.6,d*1.6),{type:"shadow",alpha:.0}));sh.visible=false;
  return n}
/* ---------- thủy tinh ---------- */
function vesselProfile(r,h,th,lip){const p=[[0,0],[r-.05,0],[r,.04],[r,h-.02]];if(lip)p.push([r+lip,h],[r+lip*.6,h+.012]);p.push([r-th,h],[r-th,th+.04],[r-th-.04,th],[0,th]);return p}
function glass(R,r,h,o){o=o||{};const g=G.lathe(vesselProfile(r,h,o.th||.025,o.lip==null?.03:o.lip),o.seg||64);return R.mesh(g,{type:"glass",color:o.tint||"#CFE6FF",alpha:o.alpha||.55})}
function testTube(R,r,h){const p=[];const N=10;for(let i=0;i<=N;i++){const a=i/N*Math.PI/2;p.push([Math.sin(a)*r,r-Math.cos(a)*r])}p.push([r,h],[r+.014,h+.01],[r-.012,h+.012]);
  for(let i=N;i>=0;i--){const a=i/N*Math.PI/2;p.push([Math.sin(a)*(r-.012),r-Math.cos(a)*(r-.012)+.012])}return R.mesh(G.lathe(p,40),{type:"glass",color:"#D6ECFF",alpha:.55})}
/* chất lỏng trong cốc/ống: thân trụ + mặt thoáng; đáy tròn nếu là ống nghiệm */
function liquidGeom(r,y0,y1,round){const p=[];if(round){const N=8;for(let i=0;i<=N;i++){const a=i/N*Math.PI/2;p.push([Math.sin(a)*r,y0+r-Math.cos(a)*r])}}else p.push([0,y0],[r,y0]);p.push([r,y1]);return G.merge([G.lathe(p,40),G.disk(r,y1,40,true)])}
function liquid(R,r,y0,y1,col,alpha,round){return R.mesh(liquidGeom(r,y0,y1,round),{color:col,alpha:alpha==null?.6:alpha,rough:.05,coat:.4,order:1})}

/* ---------- nước có trường nồng độ chất chỉ thị (dò tia trong shader) ---------- */
function DyeField(nx,ny,nz){const N=nx*ny*nz;let c=new Float32Array(N),t=new Float32Array(N);const bytes=new Uint8Array(N);
  const I=(i,j,k)=>(k*ny+j)*nx+i;
  return{nx,ny,nz,c,
    add(u,v,w,amt,rad){/* u,v,w ∈ [0,1] */const ri=Math.max(1,rad*nx),rj=Math.max(1,rad*ny*1.6),rk=Math.max(1,rad*nz);const ci=u*(nx-1),cj=v*(ny-1),ck=w*(nz-1);
      for(let k=Math.max(0,Math.floor(ck-rk));k<=Math.min(nz-1,Math.ceil(ck+rk));k++)for(let j=Math.max(0,Math.floor(cj-rj));j<=Math.min(ny-1,Math.ceil(cj+rj));j++)for(let i=Math.max(0,Math.floor(ci-ri));i<=Math.min(nx-1,Math.ceil(ci+ri));i++){
        const d=((i-ci)/ri)**2+((j-cj)/rj)**2+((k-ck)/rk)**2;if(d<1){const q=I(i,j,k);c[q]=Math.min(4,c[q]+amt*(1-d))}}},
    step(dt,D,sink){/* khuếch tán + chìm (dung dịch kiềm nặng hơn nước một chút) */const a=Math.min(.16,D*dt);const s=Math.min(.45,sink*dt);
      for(let k=0;k<nz;k++)for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){const q=I(i,j,k);const v=c[q];
        const l=i>0?c[q-1]:v,r=i<nx-1?c[q+1]:v,dn=j>0?c[q-nx]:v,up=j<ny-1?c[q+nx]:v,b=k>0?c[q-nx*ny]:v,f=k<nz-1?c[q+nx*ny]:v;
        t[q]=v+a*(l+r+dn+up+b+f-6*v)}
      /* chìm: chuyển một phần xuống ô dưới */
      for(let k=0;k<nz;k++)for(let i=0;i<nx;i++)for(let j=1;j<ny;j++){const q=I(i,j,k),qd=q-nx;const mv=t[q]*s;t[q]-=mv;t[qd]+=mv}
      const tmp=c;c=t;t=tmp;this.c=c},
    clear(){c.fill(0);t.fill(0)},
    bytes(){for(let q=0;q<N;q++)bytes[q]=Math.min(255,c[q]*170);return bytes},
    total(){let s=0;for(let q=0;q<N;q++)s+=c[q];return s/N}}}
function waterVolume(R,r,h,level,tex,o){o=o||{};
  const g=G.merge([G.lathe([[0,.012],[r,.012],[r,level]],64),G.disk(r,level,64,true)]);
  const hooks={fu:`uniform highp sampler3D uDye;uniform vec3 uOrig;uniform float uR,uH,uK,uA0;uniform vec3 uDyeCol,uWater;`,
    fs:`{vec3 d=normalize(vW-uCam);vec3 p0=vW-uOrig;
      float A=max(d.x*d.x+d.z*d.z,1e-5),Bq=2.*(p0.x*d.x+p0.z*d.z),Cq=p0.x*p0.x+p0.z*p0.z-uR*uR;float disc=Bq*Bq-4.*A*Cq;float t1=disc>0.?(-Bq+sqrt(disc))/(2.*A):0.;t1=min(t1,10.);
      float ty=d.y<0.?(0.012-p0.y)/d.y:(uH-p0.y)/max(d.y,1e-4);float te=max(0.,min(t1,ty));
      float tau=0.;const int NS=22;float dt=te/float(NS);for(int i=0;i<NS;i++){vec3 q=p0+d*(dt*(float(i)+.5));vec3 uvw=vec3(q.x/(2.*uR)+.5,q.y/uH,q.z/(2.*uR)+.5);tau+=texture(uDye,uvw).r*dt;}
      float a=1.-exp(-tau*uK);vec3 N=normalize(vN);vec3 V=-d;float F=.02+.98*pow(1.-abs(dot(N,V)),5.);
      vec3 env=envC(reflect(d,N),.05);
      base.rgb=outc(uWater*.6+env*F*1.4)*(1.-a)+uDyeCol*a;base.a=clamp(uA0+F*.5+a*.85,0.,.96);}`};
  /* bản unlit để tự tính màu; cần hàm envC/outc trong FS_HEAD */
  return R.mesh(g,{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,order:1,key:"water3d",hooks,
    uniforms:{uOrig:o.orig||[0,0,0],uR:r,uH:level,uK:o.k||9,uA0:o.a0==null?.1:o.a0,uDyeCol:o.dyeCol||[.95,.18,.55],uWater:o.water||H("#9CC8F0")},textures:{uDye:tex}})}

/* ---------- hạt: bọt khí (viền sáng), khói, tia nước ---------- */
function bubbles(R,max,o){o=o||{};const n=R.instanced(G.sphere(1,12,8),{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,order:2,key:"bubble",
  hooks:{fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float rim=pow(1.-abs(dot(N,V)),2.2);base.rgb=vec3(1.)*(.55+.6*rim);base.a=(.12+.8*rim)*vC.a;}`}},max);
  const P=[];n.spawn=(p,r,v,life,a)=>{if(P.length<max)P.push({p:[...p],r,v:[...v],life,age:0,a:a==null?1:a})};
  n.step=(dt,lim)=>{for(const b of P){b.age+=dt;b.p[0]+=b.v[0]*dt;b.p[1]+=b.v[1]*dt;b.p[2]+=b.v[2]*dt;if(lim)lim(b)}
    for(let i=P.length-1;i>=0;i--)if(P[i].age>=P[i].life||P[i].dead)P.splice(i,1);
    const D=n.data;P.forEach((b,i)=>{const f=Math.min(1,b.age/.08)*Math.min(1,(b.life-b.age)/.15);D.set([b.p[0],b.p[1],b.p[2],b.r*Math.max(.2,f),1,1,1,b.a],i*8)});n.setInstances(P.length)};
  n.list=P;return n}
function puffs(R,max,col,additive){const n=R.instanced(G.sphere(1,10,6),{type:"unlit",color:col||"#FFFFFF",alpha:1,transparent:true,order:3,blend:additive?"add":null,key:"puff"+(additive?"a":""),
  hooks:{fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=pow(abs(dot(N,V)),1.5);base.a=vC.a*f;base.rgb=uBase.rgb*vC.rgb;}`}},max);
  const P=[];n.spawn=(p,r,v,life,a,grow)=>{if(P.length<max)P.push({p:[...p],r,v:[...v],life,age:0,a:a==null?.5:a,g:grow||1.5})};
  n.step=(dt)=>{for(const b of P){b.age+=dt;b.p[0]+=b.v[0]*dt;b.p[1]+=b.v[1]*dt;b.p[2]+=b.v[2]*dt;b.v[1]*=1-dt*.6}
    for(let i=P.length-1;i>=0;i--)if(P[i].age>=P[i].life)P.splice(i,1);
    const D=n.data;P.forEach((b,i)=>{const k=b.age/b.life;D.set([b.p[0],b.p[1],b.p[2],b.r*(1+k*b.g),1,1,1,b.a*(1-k)*Math.min(1,b.age/.1)],i*8)});n.setInstances(P.length)};
  n.list=P;return n}
/* ---------- lửa: khối giọt nước ngược, cộng sáng, rung theo nhiễu ---------- */
function flame(R,col,core){const prof=[];for(let i=0;i<=16;i++){const t=i/16;prof.push([Math.sin(Math.PI*Math.pow(t,.6))*.11*(1-t*.35),t*.42])}
  const n=R.mesh(G.lathe(prof,24),{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,blend:"pre",depth:true,order:4,side:"double",key:"flame",
    hooks:{fu:NOISE+`uniform vec3 uFC,uCore;uniform float uAmp;`,fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float t=clamp(vO.y/.42,0.,1.);float fl=vn(vO*9.+vec3(0.,-uTime*7.,0.))*.7+vn(vO*21.+vec3(0.,-uTime*13.,0.))*.3;
      float e=pow(abs(dot(N,V)),1.3);float I=pow(1.-t,1.1)*(.45+.9*fl)*e*uAmp;base.rgb=mix(uCore,uFC,smoothstep(.0,.55,t))*I*1.15;base.a=clamp(I*.55,0.,.8);}`},
    uniforms:{uFC:col||[1,.6,.1],uCore:core||[1,.95,.7],uAmp:1}});return n}

/* ---------- mảnh kim loại ---------- */
const METAL={
  Li:{ten:"Lithium",vi:"lithium",col:"#B9BEC6",tarn:"#8E9097",rough:.3},Na:{ten:"Sodium",vi:"natri",col:"#D7DCE2",tarn:"#B6B2A8",rough:.18},
  K:{ten:"Potassium",vi:"kali",col:"#D4D8E0",tarn:"#9DA6B8",rough:.18},Ca:{ten:"Calcium",vi:"calcium",col:"#C9CCD0",tarn:"#9C9B97",rough:.5},
  Mg:{ten:"Magnesium",vi:"magnesium",col:"#C8CDD3",tarn:"#A3A8AE",rough:.35},Zn:{ten:"Zinc",vi:"kẽm",col:"#AEB7C2",tarn:"#8D96A1",rough:.4},
  Fe:{ten:"Iron",vi:"sắt",col:"#8A8F96",tarn:"#6F6A66",rough:.45},Cu:{ten:"Copper",vi:"đồng",col:"#C87F4F",tarn:"#9C5A3A",rough:.3}
};
function pieceGeom(kind){
  if(kind==="cube")return G.box(.12,.1,.11,.022,3);
  if(kind==="ball")return G.sphere(.065,24,16);
  if(kind==="granule")return G.fromSDF((x,y,z)=>Math.hypot(x*1.1,y*1.3,z)-.05+.012*Math.sin(x*61)*Math.sin(y*53+z*31),[-.08,-.07,-.08],[.08,.07,.08],[20,18,20]);
  if(kind==="ribbon"){const pts=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*3.2;pts.push([Math.cos(a)*.045,i/40*.24,Math.sin(a)*.045])}return G.tube(pts,.012,6)}
  if(kind==="nail")return G.merge([G.lathe([[0,0],[.016,.03],[.016,.42],[.045,.43],[.045,.45],[0,.45]],20)]);
  if(kind==="wire"){const pts=[];for(let i=0;i<=40;i++){const a=i/40*Math.PI*5;pts.push([Math.cos(a)*.035,i/40*.26,Math.sin(a)*.035])}return G.tube(pts,.008,6)}
  if(kind==="strip")return G.box(.16,.9,.012,.004,2);
  return G.box(.1,.1,.1,.02,2)}

window.LabChem3D={NOISE,bench,glass,testTube,liquid,liquidGeom,DyeField,waterVolume,bubbles,puffs,flame,METAL,pieceGeom};
})();
