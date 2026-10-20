/* _earth.js · Trái Đất và Mặt Trăng dùng chung (K6-T-01, K6-T-02)
   Kết cấu tạo sẵn trong thư mục tex/ (sinh bằng gen_tex.py):
   - earth_day.webp: bản đồ màu Trái Đất phép chiếu trụ đều, đường bờ biển và độ sâu đại dương từ dữ liệu Natural Earth (miền công cộng),
     màu lục địa theo đới khí hậu, hoang mạc, núi, băng (giản lược, không phải ảnh vệ tinh).
   - earth_clouds.webp: lớp mây sinh ngẫu nhiên theo các đới mây (xích đạo, ôn đới), không phải mây thật.
   - moon.webp: Mặt Trăng; các biển (vùng tối) đặt theo vị trí gần đúng của các biển chính ở mặt gần, miệng hố sinh ngẫu nhiên.
   Trong lúc tải ảnh, quả cầu dùng màu nền tạm. */
(function(){
"use strict";
if(window.LabEarth)return;
const G=window.LabGL,V3=G.V3;
const TEXV="12";
function loadTex(R,url,fallbackColor){const c=document.createElement("canvas");c.width=c.height=4;const g=c.getContext("2d");g.fillStyle=fallbackColor||"#334155";g.fillRect(0,0,4,4);
  const t=R.tex2D(c,{mip:true});const img=new Image();img.decoding="async";img.onload=()=>{try{t.update(img);t.img=img;(t.onload||[]).forEach(f=>f(img))}catch(e){console.warn("LabEarth: không nạp được kết cấu",url)}};img.src=url+"?v="+TEXV;t.onload=[];return t}
const cache=new WeakMap();
function texSet(R){let s=cache.get(R);if(!s){s={day:loadTex(R,"tex/earth_day.webp","#1E3A8A"),clouds:loadTex(R,"tex/earth_clouds.webp","rgba(0,0,0,0)"),moon:loadTex(R,"tex/moon.webp","#8B8B8B")};cache.set(R,s)}return s}
const GAM="vec3 lin(vec3 c){return pow(c,vec3(2.2));}vec3 srgb(vec3 c){return pow(max(c,vec3(0.)),vec3(1./2.2));}";
/* Trái Đất: o.radius, o.key (khóa riêng cho mỗi cảnh), o.sun = hàm trả hướng Mặt Trời (thế giới) */
function earth(R,o){o=o||{};const r=o.radius||1,k=o.key||"e";const T=texSet(R);const n=new G.Node();
  const U={uSun:o.sunDir||[1,0,0]};
  const surf=n.add(R.mesh(G.sphere(r,96,64),{type:"unlit",color:"#FFFFFF",key:"earthS"+k,hooks:{fu:"uniform sampler2D uTex;uniform vec3 uSun;"+GAM,fs:`{vec3 N=normalize(vN),L=normalize(uSun),V=normalize(uCam-vW);vec3 c=lin(texture(uTex,vUV).rgb);
      float d=dot(N,L);float day=smoothstep(-.12,.14,d);float ocean=clamp((c.b-max(c.r,c.g)*1.2)*9.,0.,1.);
      vec3 Hh=normalize(L+V);float sp=pow(max(dot(N,Hh),0.),60.)*ocean*day;
      vec3 lit=c*(max(d,0.)*1.35+.035)+sp*vec3(.9,.85,.75)*.9+c*vec3(.55,.22,.06)*exp(-pow(d/.13,2.))*.7;
      vec3 night=c*.012+vec3(.003,.006,.016);vec3 col=mix(night,lit,day);
      float rim=pow(1.-max(dot(N,V),0.),2.6);col+=vec3(.18,.38,.95)*rim*(.06+.6*smoothstep(-.25,.45,d));base.rgb=srgb(col);}`},textures:{uTex:T.day},uniforms:U}));
  const cl=n.add(R.mesh(G.sphere(r*1.007,96,64),{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,order:3,key:"earthC"+k,hooks:{fu:"uniform sampler2D uTex;uniform vec3 uSun;"+GAM,fs:`{vec3 N=normalize(vN),L=normalize(uSun);float a=texture(uTex,vUV).a;float d=dot(N,L);
      vec3 c=vec3(1.)*(max(d,0.)*1.15+.02)+vec3(.5,.22,.08)*exp(-pow(d/.14,2.))*.5;base.rgb=srgb(c);base.a=a*.92;}`},textures:{uTex:T.clouds},uniforms:U}));
  const at=n.add(R.mesh(G.sphere(r*1.045,64,40),{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,blend:"add",order:5,side:"double",key:"earthA"+k,hooks:{fu:"uniform vec3 uSun;",fs:`{vec3 N=normalize(vN),L=normalize(uSun),V=normalize(uCam-vW);float nv=dot(N,V);
      float g=gl_FrontFacing?pow(1.-abs(nv),5.)*.55:pow(max(1.-abs(nv),0.),1.2)*smoothstep(.0,.35,abs(nv))*1.1;float d=dot(N,L);float lit=smoothstep(-.3,.4,d);
      base.rgb=vec3(.3,.55,1.)*g*lit;base.a=1.;}`},uniforms:U}));
  n.surf=surf;n.clouds=cl;n.atmo=at;n.U=U;n.setSun=d=>{U.uSun=d};n.spin=(dt)=>{cl.quat=G.Q.mul(cl.quat||[0,0,0,1],G.Q.euler(0,dt*.004,0))};return n}
/* Mặt Trăng: kinh độ 0 (tâm mặt gần) nằm theo hướng +x của mô hình */
function moon(R,o){o=o||{};const r=o.radius||.27,k=o.key||"m";const T=texSet(R);const U={uSun:o.sunDir||[1,0,0]};
  const m=R.mesh(G.sphere(r,72,48),{type:"unlit",color:"#FFFFFF",key:"moonS"+k,hooks:{fu:"uniform sampler2D uTex;uniform vec3 uSun;"+GAM,fs:`{vec3 N=normalize(vN),L=normalize(uSun),V=normalize(uCam-vW);vec3 c=lin(texture(uTex,vUV).rgb);
      float d=dot(N,L);float lam=max(d,0.);float ls=lam/(lam+max(dot(N,V),.05));vec3 col=c*mix(lam,ls*1.6,.45)*1.25+c*.006;base.rgb=srgb(col);}`},textures:{uTex:T.moon},uniforms:U});
  m.U=U;m.setSun=d=>{U.uSun=d};return m}
/* sao nền */
function stars(R,n,rad,seed){const N=R.instanced(G.sphere(1,5,4),{type:"unlit",color:"#FFFFFF",key:"bgstars"},n);let s=seed||5;const rr=()=>{s=(s*16807)%2147483647;return s/2147483647};const D=N.data;
  for(let i=0;i<n;i++){const th=rr()*6.283,ph=Math.acos(2*rr()-1);const b=Math.pow(rr(),3);const tint=rr();const c=tint<.15?[1,.85,.7]:tint<.3?[.8,.88,1]:[1,1,1];D.set([Math.sin(ph)*Math.cos(th)*rad,Math.cos(ph)*rad,Math.sin(ph)*Math.sin(th)*rad,rad*(.0005+.0014*b),c[0]*(.4+.6*b),c[1]*(.4+.6*b),c[2]*(.4+.6*b),1],i*8)}N.setInstances(n);return N}
/* Mặt Trời: lõi sáng + quầng cộng sáng */
function sun(R,r,key){const n=new G.Node();n.add(R.mesh(G.sphere(r,48,32),{type:"unlit",color:"#FFFFFF",key:"sunC"+(key||""),hooks:{fu:"",fs:"{vec3 N=normalize(vN),V=normalize(uCam-vW);float m=max(dot(N,V),0.);base.rgb=mix(vec3(1.,.55,.12),vec3(1.,.97,.86),pow(m,.45));}"}}));
  n.add(R.mesh(G.sphere(r*2.6,40,28),{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,blend:"add",order:6,depth:false,key:"sunH"+(key||""),hooks:{fu:"",fs:"{vec3 N=normalize(vN),V=normalize(uCam-vW);float m=max(dot(N,V),0.);float g=pow(m,3.)*.55+pow(m,12.)*.6;base.rgb=vec3(1.,.72,.32)*g;base.a=1.;}"}}));return n}
/* Hình Mặt Trăng nhìn từ Trái Đất (2D), có biển tối thật và phần sáng theo tuổi trăng.
   age: 0 → 2π (0 = trăng mới, π = trăng tròn); nửa đầu sáng bên phải (nhìn từ Bắc bán cầu). */
const nearCache={};
function moonDisk(ctx,cx,cy,r,age,R){const T=texSet(R);const img=T.moon.img;const N=Math.max(8,Math.round(r*2));
  const key=N;let near=nearCache[key];
  if(!near&&img){const src=document.createElement("canvas");src.width=img.width;src.height=img.height;const sg=src.getContext("2d");sg.drawImage(img,0,0);let sd;try{sd=sg.getImageData(0,0,img.width,img.height).data}catch(e){return false}
    near=new Uint8ClampedArray(N*N*4);for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i+.5)/N*2-1,y=1-(j+.5)/N*2;const q=x*x+y*y;if(q>1)continue;const z=Math.sqrt(1-q);
      const lat=Math.asin(y),lon=Math.atan2(x,z);const u=Math.floor((lon/Math.PI*.5+.5)*img.width)%img.width,v=Math.min(img.height-1,Math.floor((.5-lat/Math.PI)*img.height));const o=(v*img.width+u)*4,p=(j*N+i)*4;near[p]=sd[o];near[p+1]=sd[o+1];near[p+2]=sd[o+2];near[p+3]=255}
    nearCache[key]=near}
  const out=ctx.createImageData(N,N);const D=out.data;const sx=Math.sin(age),sz=-Math.cos(age);
  for(let j=0;j<N;j++)for(let i=0;i<N;i++){const x=(i+.5)/N*2-1,y=1-(j+.5)/N*2;const q=x*x+y*y;const p=(j*N+i)*4;if(q>1){D[p+3]=0;continue}const z=Math.sqrt(1-q);
    const d=x*sx+z*sz;const lit=Math.max(0,Math.min(1,(d+.03)/.08));const shade=.04+.96*lit*Math.pow(Math.max(d,0),.25);const edge=Math.min(1,(1-q)*40);
    const c=near?[near[p],near[p+1],near[p+2]]:[170,170,165];D[p]=c[0]*shade;D[p+1]=c[1]*shade;D[p+2]=c[2]*shade*1.02;D[p+3]=255*edge}
  const tmp=document.createElement("canvas");tmp.width=tmp.height=N;tmp.getContext("2d").putImageData(out,0,0);ctx.save();ctx.imageSmoothingQuality="high";ctx.drawImage(tmp,cx-r,cy-r,2*r,2*r);ctx.restore();return !!near}
window.LabEarth={earth,moon,stars,sun,moonDisk,texSet,TEXV};
})();
