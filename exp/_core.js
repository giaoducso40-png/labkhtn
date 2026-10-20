/* LabKHTN · bộ máy dùng chung cho mọi thí nghiệm (canvas, vòng lặp, con trỏ, vẽ, định dạng số)
   Mọi module exp/<mã>.js dùng window.LabCore. Không phụ thuộc thư viện ngoài. */
(function(){
"use strict";
if(window.LabCore) return;

const clamp=(x,a,b)=>x<a?a:x>b?b:x;
const lerp=(a,b,t)=>a+(b-a)*t;
const ease={
  inOut:t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,
  out:t=>1-Math.pow(1-t,3),
  in:t=>t*t*t,
  back:t=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}
};
/* số kiểu Việt Nam: dấu phẩy thập phân */
const fmt=(x,d)=>Number(x).toFixed(d==null?2:d).replace(".",",");
/* bộ sinh ngẫu nhiên có hạt giống: cùng hạt giống → cùng cảnh, dễ kiểm định */
function rng(seed){let a=seed>>>0||1;return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}

function hex2rgb(h){h=h.replace("#","");if(h.length===3)h=h.split("").map(c=>c+c).join("");const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255]}
function rgba(h,a){const[r,g,b]=hex2rgb(h);return`rgba(${r},${g},${b},${a})`}
function mix(h1,h2,t){const a=hex2rgb(h1),b=hex2rgb(h2);return"#"+a.map((v,i)=>Math.round(lerp(v,b[i],t)).toString(16).padStart(2,"0")).join("")}

/* Canvas phủ kín vùng sân khấu, tự theo devicePixelRatio */
function stage(root){
  const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");
  root.insertBefore(cv,root.firstChild);
  const ctx=cv.getContext("2d");
  const st={cv,ctx,w:0,h:0,dpr:1};
  st.resize=function(){
    const r=root.getBoundingClientRect();
    const dpr=Math.min(2.5,window.devicePixelRatio||1);
    const w=Math.max(1,Math.round(r.width)),h=Math.max(1,Math.round(r.height));
    if(w!==st.w||h!==st.h||dpr!==st.dpr){st.w=w;st.h=h;st.dpr=dpr;cv.width=Math.round(w*dpr);cv.height=Math.round(h*dpr)}
    return st;
  };
  st.destroy=function(){cv.remove()};
  st.resize();
  return st;
}

/* Vòng lặp: dt thực (giây, chặn 0,05 s), tự dừng khi tab ẩn */
function loop(fn){
  let raf=0,last=0,alive=true;
  function tick(t){if(!alive)return;const dt=last?Math.min(.05,(t-last)/1000):0;last=t;try{fn(dt,t/1000)}catch(e){console.error(e)}raf=requestAnimationFrame(tick)}
  function vis(){if(document.hidden){cancelAnimationFrame(raf);raf=0;last=0}else if(alive&&!raf){raf=requestAnimationFrame(tick)}}
  document.addEventListener("visibilitychange",vis);
  raf=requestAnimationFrame(tick);
  return{stop(){alive=false;cancelAnimationFrame(raf);document.removeEventListener("visibilitychange",vis)}};
}

/* Con trỏ thống nhất chuột / cảm ứng / bút; toạ độ theo px CSS của canvas */
function pointer(cv,h){
  let id=null,down=null,moved=false;
  const pos=e=>{const r=cv.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}};
  function pd(e){if(id!==null)return;const p=pos(e);if(h.down&&h.down(p,e)===false)return;id=e.pointerId;down=p;moved=false;try{cv.setPointerCapture(id)}catch(_){}e.preventDefault()}
  function pm(e){const p=pos(e);if(id===e.pointerId){if(Math.hypot(p.x-down.x,p.y-down.y)>6)moved=true;h.move&&h.move(p,e,true)}else if(id===null){h.hover&&h.hover(p,e)}}
  function pu(e){if(id!==e.pointerId)return;const p=pos(e);id=null;h.up&&h.up(p,e,!moved);try{cv.releasePointerCapture(e.pointerId)}catch(_){}}
  function pc(e){if(id!==e.pointerId)return;id=null;h.cancel&&h.cancel()}
  function pl(){h.leave&&h.leave()}
  cv.addEventListener("pointerdown",pd);cv.addEventListener("pointermove",pm);cv.addEventListener("pointerup",pu);cv.addEventListener("pointercancel",pc);cv.addEventListener("pointerleave",pl);
  return{destroy(){cv.removeEventListener("pointerdown",pd);cv.removeEventListener("pointermove",pm);cv.removeEventListener("pointerup",pu);cv.removeEventListener("pointercancel",pc);cv.removeEventListener("pointerleave",pl)}};
}

/* Khung cảnh có kích thước thiết kế (đơn vị cảnh) đặt vừa vào vùng an toàn của sân khấu */
function fit(safe,W,H,pad){
  pad=pad||0;
  const s=Math.min((safe.w-2*pad)/W,(safe.h-2*pad)/H);
  return{s,ox:safe.x+(safe.w-W*s)/2,oy:safe.y+(safe.h-H*s)/2,W,H,
    toScene(p){return{x:(p.x-this.ox)/this.s,y:(p.y-this.oy)/this.s}},
    toScreen(p){return{x:p.x*this.s+this.ox,y:p.y*this.s+this.oy}}};
}

function rr(ctx,x,y,w,h,r){r=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}

/* Chữ số 7 đoạn cho màn hình dụng cụ đo (cân, đồng hồ số) */
const SEG={"0":"abcdef","1":"bc","2":"abged","3":"abgcd","4":"fgbc","5":"afgcd","6":"afgecd","7":"abc","8":"abcdefg","9":"abcdfg","-":"g"," ":"","E":"afged","r":"eg","o":"cdeg","L":"fed","P":"abefg"};
function seven(ctx,text,x,y,h,on,off){
  const w=h*.52,t=h*.11,sk=h*.08,gap=h*.2;
  let cx=x;
  for(let i=0;i<text.length;i++){
    const ch=text[i];
    if(ch==="."||ch===","){ctx.fillStyle=on;ctx.beginPath();ctx.arc(cx-gap*.5,y+h-t*.5,t*.62,0,6.283);ctx.fill();continue}
    const segs=SEG[ch]||"";
    const P={a:[[0,0],[w,0]],b:[[w,0],[w,h/2]],c:[[w,h/2],[w,h]],d:[[0,h],[w,h]],e:[[0,h/2],[0,h]],f:[[0,0],[0,h/2]],g:[[0,h/2],[w,h/2]]};
    for(const k of "abcdefg"){
      const lit=segs.includes(k);if(!lit&&!off)continue;
      const[[x1,y1],[x2,y2]]=P[k];const sx=yy=>sk*(1-yy/h);
      ctx.strokeStyle=lit?on:off;ctx.lineWidth=t;ctx.lineCap="round";
      ctx.beginPath();const sh=t*.55;
      if(y1===y2){ctx.moveTo(cx+x1+sh+sx(y1),y+y1);ctx.lineTo(cx+x2-sh+sx(y2),y+y2)}else{ctx.moveTo(cx+x1+sx(y1+sh),y+y1+sh);ctx.lineTo(cx+x2+sx(y2-sh),y+y2-sh)}
      ctx.stroke();
    }
    cx+=w+gap;
  }
  return cx-x;
}
function sevenWidth(text,h){let n=0,d=0;for(const c of text){if(c==="."||c===",")d++;else n++}return n*(h*.52+h*.2)}

/* Hình đồ cảnh báo GHS (đường viền đỏ hình thoi) */
function ghs(code){
  const frame='<path d="M24 2L46 24 24 46 2 24Z" fill="#fff" stroke="#E0001B" stroke-width="3.5" stroke-linejoin="round"/>';
  const sym={
    GHS06:'<g fill="#111"><ellipse cx="24" cy="19" rx="7.2" ry="6.6"/><rect x="20" y="23" width="8" height="4" rx="1.2"/></g><g fill="#fff"><circle cx="21.3" cy="18.8" r="1.9"/><circle cx="26.7" cy="18.8" r="1.9"/></g><path d="M15 27.5l18 7M33 27.5l-18 7" stroke="#111" stroke-width="2.6" stroke-linecap="round"/>',
    GHS07:'<path d="M24 12v14" stroke="#111" stroke-width="4" stroke-linecap="round"/><circle cx="24" cy="32.5" r="2.6" fill="#111"/>'
  }[code]||"";
  return `<svg viewBox="0 0 48 48" role="img" aria-label="Hình đồ ${code}">${frame}${sym}</svg>`;
}

/* Biểu tượng cho khay dụng cụ */
const ICONS={
  beaker:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7h24M10 7v24a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V7"/><path d="M10.5 20h19v11a2.5 2.5 0 0 1-2.5 2.5H13A2.5 2.5 0 0 1 10.5 31z" fill="currentColor" opacity=".28" stroke="none"/></svg>',
  balance:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M8 16h24l2 3H6z"/><rect x="5" y="21" width="30" height="12" rx="2.5"/><rect x="11" y="24" width="14" height="6" rx="1" fill="currentColor" opacity=".3"/><circle cx="30" cy="27" r="1.6" fill="currentColor"/></svg>',
  lens:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="17" cy="17" r="10"/><path d="M24.5 24.5L34 34"/><circle cx="14" cy="15" r="2.2" fill="currentColor" stroke="none"/><circle cx="20" cy="19" r="1.6" fill="currentColor" stroke="none"/><circle cx="15" cy="21" r="1.2" fill="currentColor" stroke="none"/></svg>',
  card:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="7" y="8" width="26" height="24" rx="3"/><path d="M12 15h16M12 20h16M12 25h10" stroke-linecap="round"/></svg>'
};

window.LabCore={clamp,lerp,ease,fmt,rng,hex2rgb,rgba,mix,stage,loop,pointer,fit,rr,seven,sevenWidth,ghs,ICONS};
})();
