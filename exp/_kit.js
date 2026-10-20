/* LabKHTN · BỘ KHUNG BÀI THÍ NGHIỆM (dùng chung cho các bài từ bản 11)
   - scene3D: canvas WebGL2 (LabGL), camera theo các góc nhìn đặt tên, chú thích có mũi tên, bảng thông tin nổi, khay nút, vòng lặp
   - scene2D: canvas 2D có hệ toạ độ thiết kế W×H, cùng hệ chú thích và khay
   - steps: bốn bước học (Dự đoán – Làm – Quan sát – Giải thích) khai báo bằng DỮ LIỆU:
       predict:[{id,q,opts:[[k,text]...],ans,res}]   – câu dự đoán, chốt rồi mới làm; res: câu nói kết quả thật ở bước 4
       tasks:[{html,done:()=>bool}]                 – nhiệm vụ thao tác, tự tích khi hoàn thành
       obs:[{id,q,opts,ans,why}]                    – câu hỏi quan sát, giải thích khi chọn sai
       concl:{html, quiz:[{id,q,opts,ans,why:{k:text}} | {id,q,order:[...],ans:[...],hint}], done:"<h2>…"}
       gv:["gợi ý GV bước 1", …]
     Giáo viên muốn sửa câu hỏi, đáp án: chỉ sửa phần dữ liệu này ở đầu tệp bài. */
(function(){
"use strict";
if(window.LabKit) return;
const C=window.LabCore,G=window.LabGL;
const H=G?G.hex:null;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));

const ICON={
  play:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="20" cy="20" r="13"/><path d="M17 14l9 6-9 6z" fill="currentColor"/></svg>',
  reset:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 20a12 12 0 1 0 4-9L8 15"/><path d="M8 7v8h8"/></svg>',
  pen:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 32l4-1 18-18-3-3-18 18z"/><path d="M8 36h24"/></svg>',
  ban:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 24h32M8 24v10M32 24v10"/><path d="M10 24v-8h6v8M22 24V12h4v12"/></svg>',
  eye:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M4 20s6-10 16-10 16 10 16 10-6 10-16 10S4 20 4 20z"/><circle cx="20" cy="20" r="4.5"/></svg>',
  lens:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="17" cy="17" r="10"/><path d="M25 25l9 9"/></svg>',
  plus:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M20 9v22M9 20h22"/></svg>',
  minus:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M9 20h22"/></svg>',
  drop:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 5c6 9 10 14 10 19a10 10 0 0 1-20 0c0-5 4-10 10-19z"/></svg>',
  fire:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M20 4c2 7 10 10 10 19a10 10 0 0 1-20 0c0-5 3-7 4-11 2 3 3 4 5 4-1-5 0-9 1-12z"/></svg>',
  tube:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M15 5v24a5 5 0 0 0 10 0V5"/><path d="M12 5h16"/><path d="M15 20h10"/></svg>',
  beaker:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M9 7h22M11 7v24a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7"/><path d="M11 20h18"/></svg>',
  bolt:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"><path d="M22 4L9 23h10l-2 13 14-20H21z"/></svg>',
  sun:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="20" cy="20" r="7"/><path d="M20 4v4M20 32v4M4 20h4M32 20h4M8.7 8.7l2.8 2.8M28.5 28.5l2.8 2.8M8.7 31.3l2.8-2.8M28.5 11.5l2.8-2.8"/></svg>',
  thermo:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M17 26V8a3 3 0 0 1 6 0v18a6 6 0 1 1-6 0z"/><path d="M20 14v14"/></svg>',
  grid:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="6" y="6" width="11" height="11" rx="2"/><rect x="23" y="6" width="11" height="11" rx="2"/><rect x="6" y="23" width="11" height="11" rx="2"/><rect x="23" y="23" width="11" height="11" rx="2"/></svg>',
  swap:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M8 14h22l-5-5M32 26H10l5 5"/></svg>',
  hand:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 20V9a2.5 2.5 0 0 1 5 0v9M19 17V7a2.5 2.5 0 0 1 5 0v10M24 17V9a2.5 2.5 0 0 1 5 0v13c0 7-4 12-10 12-5 0-7-3-10-8l-3-5a2.5 2.5 0 0 1 4-3l4 4"/></svg>',
  step:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M10 30l8-10-8-10M22 30l8-10-8-10"/></svg>',
  dna:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 4c0 10 16 12 16 22s-16 0-16 10M28 4c0 10-16 12-16 22s16 0 16 10"/><path d="M14 10h12M14 30h12"/></svg>',
  cell:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><ellipse cx="20" cy="20" rx="15" ry="11"/><circle cx="22" cy="19" r="4.5"/></svg>'
};

/* ============== bốn bước học, khai báo bằng dữ liệu ============== */
function steps(api,spec,hooks){hooks=hooks||{};
  const S={pred:{},locked:false,obs:{},q:{},finished:false,seq:{}};let el=null,idx=0;
  const L="ABCDEF";
  const gvTip=i=>api.mode==="gv"&&spec.gv&&spec.gv[i]?`<div class="callout"><b>Giáo viên:</b> ${spec.gv[i]}</div>`:"";
  const tasksDone=()=>(spec.tasks||[]).every(t=>{try{return !!t.done()}catch(e){return false}});
  const obsOk=()=>(spec.obs||[]).every(o=>S.obs[o.id]===o.ans);
  const quizOk=()=>((spec.concl&&spec.concl.quiz)||[]).every(q=>q.order?(S.seq[q.id]||[]).join("|")===q.ans.join("|"):S.q[q.id]===q.ans);
  function refresh(){api.okAt(0,S.locked||!(spec.predict||[]).length);api.okAt(1,tasksDone());api.okAt(2,obsOk());api.okAt(3,S.finished);if(el)render()}
  function mcq(attr,id,cur,arr,dis,ans){return `<div class="opts">${arr.map(([k,t],j)=>`<button class="opt ${ans!=null&&cur===k?(k===ans?"right":"wrong"):""}" data-${attr}="${esc(id)}" data-v="${esc(k)}" aria-pressed="${cur===k}" ${dis?"disabled":""}><span class="k">${L[j]}</span>${t}</button>`).join("")}</div>`}
  function render(){if(!el)return;let h="";
    if(idx===0){const P=spec.predict||[];
      h=`<h3>${spec.predictTitle||"Dự đoán"}</h3>${spec.intro?`<p class="lead2">${spec.intro}</p>`:""}`+P.map((p,i)=>`<p class="lead2"><b>Câu ${i+1}.</b> ${p.q}</p>${mcq("pr",p.id,S.pred[p.id],p.opts,S.locked)}`).join("")+
        (P.length?(S.locked?`<div class="callout ok">Đã chốt dự đoán. Bấm <b>Bước tiếp</b> để làm thí nghiệm.</div>`:`<button class="btn main" data-k="lock" ${P.every(p=>S.pred[p.id])?"":"disabled"}>Chốt dự đoán</button>`):`<div class="callout">Bấm <b>Bước tiếp</b> để bắt đầu.</div>`)+
        `<p class="muted" style="font-size:.84rem">${spec.hint||"Kéo để xoay, lăn chuột hoặc chụm hai ngón để phóng to."}</p>${gvTip(0)}`}
    else if(idx===1){const T=spec.tasks||[];let first=true;
      h=`<h3>${spec.taskTitle||"Làm thí nghiệm"}</h3>${spec.taskLead?`<p class="lead2">${spec.taskLead}</p>`:""}<ol class="todo">${T.map(t=>{let ok=false;try{ok=!!t.done()}catch(e){}const now=!ok&&first;if(!ok)first=false;return `<li class="${ok?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${t.html}</div></li>`}).join("")}</ol>${gvTip(1)}`}
    else if(idx===2){const O=spec.obs||[];
      h=`<h3>${spec.obsTitle||"Quan sát và lí giải"}</h3>`+O.map((o,i)=>`<p class="lead2"><b>${i+1}.</b> ${o.q}</p>${mcq("ob",o.id,S.obs[o.id],o.opts,false,o.ans)}${S.obs[o.id]&&S.obs[o.id]!==o.ans?`<div class="callout bad">${o.why}</div>`:""}`).join("")+gvTip(2)}
    else{const Cc=spec.concl||{};const Q=Cc.quiz||[];
      const pr=(spec.predict||[]).filter(p=>S.pred[p.id]).map((p,i)=>{const t=(p.opts.find(o=>o[0]===S.pred[p.id])||[])[1]||"";const right=p.ans==null||S.pred[p.id]===p.ans;
        return `<div class="callout ${right?"ok":"bad"}">Câu ${i+1} em dự đoán: <b>${t}</b>.${p.res?` ${p.res}`:""}</div>`}).join("");
      h=`<h3>${spec.conclTitle||"Giải thích và kết luận"}</h3>${pr}${Cc.html||""}`+Q.map((q,qi)=>{
        if(q.order){const cur=S.seq[q.id]||[];const done=cur.length===q.ans.length;const ok=done&&cur.join("|")===q.ans.join("|");
          return `<p class="lead2"><b>Câu ${qi+1}.</b> ${q.q}</p><div class="seqbox">${cur.length?cur.map(x=>`<span class="mchip">${x}</span>`).join('<span class="sep">›</span>'):'<span class="muted">chưa chọn</span>'}</div>
            <div class="opts row">${q.order.map(x=>`<button class="opt" data-sq="${esc(q.id)}" data-v="${esc(x)}" ${cur.includes(x)||done?"disabled":""}>${x}</button>`).join("")}<button class="opt" data-sq="${esc(q.id)}" data-v="__reset">Xếp lại</button></div>
            ${done?(ok?`<div class="callout ok">Đúng.</div>`:`<div class="callout bad">${q.hint||"Chưa đúng, xếp lại."}</div>`):""}`}
        return `<p class="lead2"><b>Câu ${qi+1}.</b> ${q.q}</p>${mcq("qz",q.id,S.q[q.id],q.opts,false,q.ans)}${S.q[q.id]&&S.q[q.id]!==q.ans?`<div class="callout bad">${(q.why&&q.why[S.q[q.id]])||"Chưa đúng, đọc lại kết luận ở trên."}</div>`:""}`}).join("")+
        (quizOk()?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):"")+gvTip(3)}
    el.innerHTML=h}
  function onBody(e){const t=e.target.closest("button");if(!t||t.disabled)return;const d=t.dataset;
    if(d.pr!=null){S.pred[d.pr]=d.v;render();hooks.onPredict&&hooks.onPredict(d.pr,d.v);return}
    if(d.ob!=null){S.obs[d.ob]=d.v;refresh();return}
    if(d.qz!=null){S.q[d.qz]=d.v;render();return}
    if(d.sq!=null){const a=S.seq[d.sq]||(S.seq[d.sq]=[]);if(d.v==="__reset")S.seq[d.sq]=[];else if(!a.includes(d.v))a.push(d.v);render();return}
    if(d.k==="lock"){S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok");return}
    if(d.k==="finish"){S.finished=true;refresh();api.done((spec.concl&&spec.concl.done)||"<h2>Hoàn thành bài</h2>")}}
  return{S,refresh,render,step(i,body){idx=i;el=body;body.onclick=onBody;render()},
    /* lời giải mẫu: dùng khi kiểm thử tự động */
    solve(){(spec.predict||[]).forEach(p=>S.pred[p.id]=p.ans!=null?p.ans:p.opts[0][0]);S.locked=true;(spec.obs||[]).forEach(o=>S.obs[o.id]=o.ans);
      ((spec.concl&&spec.concl.quiz)||[]).forEach(q=>{if(q.order)S.seq[q.id]=q.ans.slice();else S.q[q.id]=q.ans});refresh()},
    finish(){S.finished=true;refresh()},tasksDone,obsOk,quizOk}}

/* ============== khay nút ============== */
/* items: [{k,label,icon,on?,dis?,v?}] hoặc "hr" hoặc {grid:[...]} hoặc {seg:[...],label} */
function dockHTML(items){const b=it=>`<button class="titem" data-k="${esc(it.k)}" ${it.v!=null?`data-v="${esc(it.v)}"`:""} ${it.on!=null?`aria-pressed="${!!it.on}"`:""} ${it.dis?"disabled":""} ${it.title?`title="${esc(it.title)}"`:""}>${it.icon||""}${it.label}</button>`;
  return items.filter(Boolean).map(it=>it==="hr"?"<hr>":it.seg?`<div class="tseg" role="group" aria-label="${esc(it.label||"Chọn")}">${it.seg.map(b).join("")}</div>`:it.grid?`<div class="tgrid">${it.grid.map(b).join("")}</div>`:b(it)).join("")}

/* ============== môi trường sáng/tối dùng chung ============== */
function theme3D(R,day,ink){const E=R.env;
  if(day){E.bgTop=H("#F2F4FA");E.bgBot=H("#D6DCEA");E.bgGlow=H("#FFFFFF");E.sky=H("#B8C2DE");E.gnd=H("#7E8496");E.hor=H("#CDD4E6");E.exposure=.85;E.ink=ink==null?.55:ink}
  else{E.bgTop=H("#1B2347");E.bgBot=H("#06091A");E.bgGlow=H("#2B3670");E.sky=H("#6070A0");E.gnd=H("#171B2B");E.hor=H("#3E4868");E.exposure=.8;E.ink=0}
  E.k1c=[2.1,2.0,1.85];E.k2c=[.6,.7,.9];E.k3c=[.8,.75,.9]}

/* ============== điểm chạm trên dụng cụ (thao tác trực tiếp) ==============
   K.hotFn(()=>[{k,v,p,tip,view,px}]): p = điểm 3D (cảnh 3D) hoặc [x,y] toạ độ thiết kế (cảnh 2D), có thể là hàm.
   Chạm vào điểm đó = bấm nút có cùng k, v ở khay (chỉ khi nút đang dùng được). Vòng sáng nhấp nháy báo chỗ chạm được. */
function hotLayer(K,project){const layer=document.createElement("div");layer.className="gl-hots";K.over.appendChild(layer);const els=[];let hov=-1,last=[];
  K.hotFn=f=>{K._hot=f};
  const flat=()=>{const out=[];(K._dock&&K._dock()||[]).forEach(it=>{if(!it||it==="hr")return;if(it.grid)out.push(...it.grid);else if(it.seg)out.push(...it.seg);else out.push(it)});return out};
  function active(){if(!K._hot)return[];const D=flat();return (K._hot()||[]).filter(h=>{if(h.view&&h.view!==K.view&&!(Array.isArray(h.view)&&h.view.includes(K.view)))return false;
    const it=D.find(d=>d.k===h.k&&(h.v==null?d.v==null:String(d.v)===String(h.v)));return it?!it.dis:!!h.always})}
  function scr(h){const p=typeof h.p==="function"?h.p():h.p;if(!p)return null;const q=project(p);if(!q||q.behind)return null;return q}
  K._hotHit=function(sx,sy){let best=-1,bd=1e9;last.forEach((h,i)=>{const q=h._q;if(!q)return;const d=Math.hypot(q.x-sx,q.y-sy);const r=h.px||30;if(d<r&&d<bd){bd=d;best=i}});return best>=0?last[best]:null};
  K._hotFire=function(h){K._dockH&&K._dockH(h.k,h.v);K.refreshDock();K.updateInfo&&K.updateInfo(true)};
  K._hotHover=h=>{hov=h?last.indexOf(h):-1};
  K._hotUpdate=function(){if(K.frameN%2)return;last=active().slice(0,6);last.forEach(h=>h._q=scr(h));
    while(els.length<last.length){const e=document.createElement("div");e.className="gl-hot";e.innerHTML="<i></i><b></b>";layer.appendChild(e);els.push(e)}
    els.forEach((e,i)=>{const h=last[i];if(!h||!h._q){e.hidden=true;return}e.hidden=false;e.style.left=h._q.x+"px";e.style.top=h._q.y+"px";const sf=K.safe||{x:0,y:0,w:layer.clientWidth,h:layer.clientHeight},hw=Math.min(150,sf.w/2);e.classList.toggle("r",h._q.x>sf.x+sf.w-hw);e.classList.toggle("l",h._q.x<sf.x+hw);e.classList.toggle("u",h._q.y>sf.y+sf.h-50);const vk=K.view+"|"+last.length;if(vk!==K._hotVK){K._hotVK=vk;K._hotT=performance.now()}const show=i===hov||(i===0&&h.tip&&performance.now()-K._hotT<6000);e.classList.toggle("tip",!!(show&&h.tip));const t=h.tip||"";if(e._t!==t){e.lastChild.textContent=t;e._t=t}})}}
/* ============== cảnh 3D ============== */
/* o: {aria, views:{key:{t,yaw,pitch,rad}}, view, legend:{w}|false, bench:[w,d]|null, orbit:{minPitch,maxPitch}, ink} */
function scene3D(api,o){o=o||{};const vp=api.vp,K3=window.LabChem3D;
  const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label",o.aria||"Mô hình 3D của thí nghiệm");vp.insertBefore(cv,vp.firstChild);
  const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
  const R=G.create(cv);
  const K={api,vp,cv,over,R,ok:!!R,views:o.views,simT:0,frameN:0,view:o.view||Object.keys(o.views)[0],zoom:1,day:api.day,rnd:C.rng(o.seed||1234),
    _frame:[],_tap:null,_pick:null,_dock:null,_dockH:null,_reset:[],_un:[],_layout:[],info:null,legendW:0};
  if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới, bật “Tăng tốc phần cứng”.</div>`;
    K.mount=steps=>({step(i,el){steps&&steps.step(i,el)},layout(){},prefs(){},unmount(){cv.remove();over.remove()}});return K}
  const root=K.root=new G.Node();
  if(o.bench&&K3)root.add(K3.bench(R,o.bench[0],o.bench[1],api.day));
  const cam=K.cam=R.cam;const orbit=K.orbit=G.orbit(cam,Object.assign({minPitch:.05,maxPitch:1.35},o.orbit||{}));
  const LB=K.LB=G.labels(over,R,{bounds:()=>api.safe()});
  /* bảng thông tin nổi: cột trái (màn rộng) hoặc dải trên (màn hẹp) */
  if(o.legend!==false){K.info=document.createElement("div");K.info.className="gl-legend glass";over.appendChild(K.info);K.legendW=(o.legend&&o.legend.w)||250}
  let safe={x:0,y:0,w:1,h:1};K.wide=true;
  function fitDist(rad){const sz=R.size();const tv=Math.tan(cam.fov/2)*safe.h/sz.h,th=Math.tan(cam.fov/2)*(sz.w/sz.h)*safe.w/sz.w;return rad/Math.max(1e-3,Math.min(tv,th))}
  K.fitDist=fitDist;
  K.goView=function(v,instant){if(!o.views[v])return;K.view=v;const p=o.views[v];const to={target:p.t.slice(),yaw:p.yaw||0,pitch:p.pitch==null?.3:p.pitch,dist:fitDist(p.rad)*K.zoom};
    if(instant){orbit.stop&&orbit.stop();Object.assign(cam,{target:to.target,yaw:to.yaw,pitch:to.pitch,dist:to.dist})}else orbit.fly(to,.9);
    for(const it of LB.items)it.on=!it.view||it.view===v||(Array.isArray(it.view)&&it.view.includes(v));K.refreshDock();K.updateInfo(true)};
  K.layout=function(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));const sf=api.safe();const sz=R.size();safe={...sf};
    K.wide=sf.w>=600;
    if(K.info){const I=K.info;I.style.left=(sf.x+10)+"px";I.style.top=(sf.y+10)+"px";I.style.width=K.wide?K.legendW+"px":(sf.w-20)+"px";I.style.maxWidth=K.wide?K.legendW+"px":"none";I.classList.toggle("narrow",!K.wide);
      if(I.innerHTML){if(K.wide){safe.x+=K.legendW+10;safe.w-=K.legendW+10}else{const ih=Math.min(sf.h*.42,I.offsetHeight||90);safe.y+=ih+12;safe.h-=ih+12}}}
    K.safe=safe;cam.shift=[2*(safe.x+safe.w/2)/sz.w-1,1-2*(safe.y+safe.h/2)/sz.h];const p=o.views[K.view];if(p)cam.dist=fitDist(p.rad)*K.zoom;K._layout.forEach(f=>f(sf,safe))};
  K.theme=function(){K.day=api.day;theme3D(R,api.day,o.ink);over.classList.toggle("day",api.day);o.onTheme&&o.onTheme(api.day)};
  /* nhãn: view = tên góc nhìn (hoặc mảng) mà nhãn hiện; dir n/s/e/w/ne/nw/se/sw; len độ dài đường dẫn (px) */
  K.label=function(html,p,opt){opt=opt||{};const it=LB.add(`<span>${html}</span>`,p,opt.cls||"");if(opt.view)it.view=opt.view;if(opt.dir)it.dir=opt.dir;if(opt.len!=null)it.len=opt.len;if(opt.ring)it.ring=opt.ring;
    it.set=h=>{const s=`<span>${h}</span>`;if(it._h!==s){it.el.innerHTML=s;it._h=s}};return it};
  let infoH="";K.setInfo=function(h){infoH=h};
  K.updateInfo=function(force){if(!K.info)return;const h=typeof K._info==="function"?K._info():infoH;if(force||K.info._h!==h){const h0=K.info.offsetHeight;K.info.innerHTML=h;K.info._h=h;if((!!h0)!==(!!K.info.offsetHeight)||Math.abs(h0-K.info.offsetHeight)>20)K.layout()}};
  K.infoFn=f=>{K._info=f};
  /* khay nút */
  K.dockFn=f=>{K._dock=f};K.onDock=f=>{K._dockH=f};
  K.refreshDock=function(){if(!K._dock)return;const vs=o.views;const vk=Object.keys(vs).filter(k=>vs[k].label);
    const seg=vk.length>1?{seg:vk.map(k=>({k:"__view",v:k,label:vs[k].label,icon:vs[k].icon||ICON.eye,on:K.view===k})),label:"Góc nhìn"}:null;
    api.dock.innerHTML=dockHTML([seg,seg?"hr":null].concat(K._dock()||[]))};
  function onDockClick(e){const t=e.target.closest("[data-k]");if(!t||t.disabled)return;const k=t.dataset.k,v=t.dataset.v;if(k==="__view"){K.zoom=1;K.goView(v);return}K._dockH&&K._dockH(k,v,t);K.refreshDock()}
  api.dock.addEventListener("click",onDockClick);
  /* con trỏ: chạm (tap) chọn vật, kéo để xoay; kéo vật nếu pick trả về {drag:true} */
  let dragging=null;
  hotLayer(K,q=>R.project(q));
  const ptr=C.pointer(cv,{down(p,e){const k=K._pick?K._pick(p.x,p.y,"down"):null;if(k&&k.drag&&K._drag){dragging=k;K._drag("start",k,p);return true}orbit.start(p,e.pointerId);return true},
    move(p,e){if(dragging){K._drag("move",dragging,p);return}orbit.move(p,e.pointerId)},
    up(p,e,tap){if(dragging){K._drag("end",dragging,p);const d=dragging;dragging=null;if(tap&&K._tap)K._tap(d,p);return}orbit.end(e.pointerId);if(tap){const k=K._pick?K._pick(p.x,p.y,"tap"):null;const h=!k&&K._hotHit(p.x,p.y);if(h){K._hotFire(h);return}if(K._tap)K._tap(k,p)}},
    cancel(){if(dragging){K._drag("cancel",dragging);dragging=null}orbit.end()},
    hover(p){if(K.frameN%3)return;const k=K._pick?K._pick(p.x,p.y,"hover"):null;const h=!k&&K._hotHit(p.x,p.y);K._hotHover(h);cv.style.cursor=k?(k.drag?"grab":"pointer"):h?"pointer":"grab"}});
  K.pickFn=f=>{K._pick=f};K.tapFn=f=>{K._tap=f};K.dragFn=f=>{K._drag=f};
  function onWheel(e){e.preventDefault();K.zoom=C.clamp(K.zoom*Math.exp(e.deltaY*.0012),.4,2.6);const p=o.views[K.view];cam.dist=fitDist(p.rad)*K.zoom}
  cv.addEventListener("wheel",onWheel,{passive:false});
  K.onFrame=f=>K._frame.push(f);K.onReset=f=>K._reset.push(f);K.onUnmount=f=>K._un.push(f);K.onLayout=f=>K._layout.push(f);
  /* kính lúp: khung vẽ lại cảnh từ camera gần */
  K.inset=function(title,camFn,opt){opt=opt||{};const F=document.createElement("div");F.className="gl-zoom";F.innerHTML=`<div class="zt"></div>`;over.appendChild(F);let rect=null;
    function place(){const sf=api.safe();const wide=sf.w>=600;let lx,ly,lw,lh;
      if(opt.pos==="br"||!wide||!K.info){lw=Math.min(wide?240:176,Math.round(sf.w*.46));lh=wide?190:130;lx=sf.x+sf.w-lw-10;ly=sf.y+sf.h-lh-10}
      else{lw=K.legendW;lx=sf.x+10;ly=sf.y+10+(K.info.offsetHeight||0)+10;lh=Math.max(110,Math.min(220,sf.y+sf.h-10-ly))}
      Object.assign(F.style,{left:lx+"px",top:ly+"px",width:lw+"px",height:lh+"px"});rect={x:lx+1.5,y:ly+23,w:lw-3,h:lh-24.5}}
    K._layout.push(place);
    const ins={el:F,on:true,place,draw(){const c=ins.on?camFn():null;F.hidden=!c;if(!c||!rect)return;R.renderInset(root,K.simT,rect,c);const t=typeof title==="function"?title():title;if(F._t!==t){F.firstChild.textContent=t;F._t=t}}};
    K._insets=(K._insets||[]).concat([ins]);return ins};
  function frame(dt){K.frameN++;const sdt=api.time.playing?dt*api.time.speed:0;K.simT+=sdt;orbit.update(dt);
    for(const f of K._frame)f(sdt,dt);if(K._st)K._stUpd();R.render(root,K.simT);if(K._insets)for(const i of K._insets)i.draw();LB.update();K._hotUpdate();if(K.frameN%8===0)K.updateInfo();
    if(K._label)api.time.label(...K._label())}
  K.timeLabel=f=>{K._label=()=>{const r=f();return Array.isArray(r)?r:[r,null]}};
  /* trạm thí nghiệm: nhóm vật thể chỉ hiện khi camera đang ở gần góc nhìn của trạm (tránh thấy dụng cụ của trạm bên cạnh) */
  K.station=(node,v)=>{(K._st=K._st||[]).push([node,v]);K._stR=null;return node};
  K._stUpd=()=>{if(!K._stR){const T=Object.values(o.views).map(p=>p.t);let m=Infinity;for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const d=Math.hypot(T[i][0]-T[j][0],T[i][2]-T[j][2]);if(d>.3)m=Math.min(m,d)}K._stR=isFinite(m)?m*.62:1e9}
    const t=cam.target;for(const [n,v] of K._st){const vs=Array.isArray(v)?v:[v];const near=vs.some(k=>{const p=o.views[k];return p&&Math.hypot(t[0]-p.t[0],t[2]-p.t[2])<K._stR});
      if(!near){if(!n._stH||n.visible){n._stPrev=n.visible;n._stH=true}n.visible=false}else if(n._stH){n.visible=n._stPrev;n._stH=false}}};
  /* tự chia trạm: mọi vật thêm vào cảnh sau khi dựng bàn, nằm gần tâm một góc nhìn (theo x, z) thì thuộc trạm đó */
  K._kid0=root.children.length;
  K.autoStations=(skip)=>{const T=Object.entries(o.views).map(([k,p])=>[k,p.t]);if(T.length<2)return;K._stR=null;K._stUpd&&0;const kids=root.children.slice(K._kid0);
    let m=Infinity;for(let i=0;i<T.length;i++)for(let j=i+1;j<T.length;j++){const d=Math.hypot(T[i][1][0]-T[j][1][0],T[i][1][2]-T[j][1][2]);if(d>.3)m=Math.min(m,d)}if(!isFinite(m))return;
    for(const n of kids){if(skip&&skip.includes(n))continue;if(Math.abs(n.pos[0])+Math.abs(n.pos[2])<1e-6)continue;let bk=null,bd=Infinity;for(const [k,t] of T){const d=Math.hypot(n.pos[0]-t[0],n.pos[2]-t[2]);if(d<bd){bd=d;bk=k}}
      const same=T.filter(([k,t])=>Math.hypot(n.pos[0]-t[0],n.pos[2]-t[2])<bd+.3).map(([k])=>k);if(bd<m*.6)K.station(n,same.length>1?same:bk)}};
  K.start=function(){K.theme();K.layout();K.goView(K.view,true);K.loop=C.loop(frame);K.ro=new ResizeObserver(()=>K.layout());K.ro.observe(vp);
    api.time.onReset(()=>{K.simT=0;K._reset.forEach(f=>f());K.refreshDock();K.updateInfo(true)})};
  K.mount=function(st){return{step(i,el){st&&st.step(i,el)},layout(){K.layout()},prefs(){K.theme();st&&st.render()},
    unmount(){K.dead=true;K.loop&&K.loop.stop();ptr.destroy();K.ro&&K.ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDockClick);K._un.forEach(f=>{try{f()}catch(e){}});LB.clear();R.dispose(root);
      const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}}};
  return K}

/* ============== cảnh 2D (canvas, toạ độ thiết kế W×H) ============== */
/* o: {W,H,aria,legend:{w}|false,pad} ; draw(ctx,f,dt) với f.s tỉ lệ, f.toScreen */
function scene2D(api,o){o=o||{};const vp=api.vp;
  const st=C.stage(vp);st.cv.setAttribute("aria-label",o.aria||"Mô phỏng 2D của thí nghiệm");
  const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
  const K={api,vp,cv:st.cv,ctx:st.ctx,st,over,ok:true,simT:0,frameN:0,day:api.day,W:o.W||1000,H:o.H||620,f:null,rnd:C.rng(o.seed||4321),
    _frame:[],_draw:null,_tap:null,_pick:null,_drag:null,_dock:null,_dockH:null,_reset:[],_un:[],_layout:[],info:null,legendW:0,view:"main"};
  /* chiếu toạ độ cảnh → px để dùng chung hệ chú thích của LabGL */
  const proj={project:p=>{const f=K.f;return f?{x:p[0]*f.s+f.ox,y:p[1]*f.s+f.oy,z:0,behind:false}:{x:-999,y:-999,behind:true}},size:()=>({w:st.w,h:st.h})};
  const LB=K.LB=G.labels(over,proj,{bounds:()=>api.safe()});
  if(o.legend!==false){K.info=document.createElement("div");K.info.className="gl-legend glass";over.appendChild(K.info);K.legendW=(o.legend&&o.legend.w)||250}
  K.layout=function(){st.resize();const sf=api.safe();let safe={...sf};K.wide=sf.w>=600;
    /* mỗi phần (view) có thể khai báo khung nội dung frame:[x,y,w,h] để phóng vừa vùng an toàn */
    const fr=(K.views&&K.views[K.view]&&K.views[K.view].frame)||K.frame||[0,0,K.W,K.H];const pad=o.pad==null?8:o.pad;
    if(K.info){const I=K.info;I.style.left=(sf.x+10)+"px";I.style.top=(sf.y+10)+"px";
      const setW=w=>{K.wide=w;I.style.width=w?K.legendW+"px":(sf.w-20)+"px";I.style.maxWidth=w?K.legendW+"px":"none";I.classList.toggle("narrow",!w)};
      const side=()=>({...sf,x:sf.x+K.legendW+10,w:sf.w-K.legendW-10}),top=()=>{const ih=Math.min(sf.h*.42,I.offsetHeight||90);return{...sf,y:sf.y+ih+12,h:sf.h-ih-12}};
      if(!I.innerHTML)setW(sf.w>=600);
      else if(sf.w<600){setW(false);safe=top()}
      else{/* bảng thông tin đặt bên trái hay ở trên: chọn cách cho hình vẽ lớn hơn */
        setW(false);const tS=top();setW(true);const sS=side();
        if(C.fit(tS,fr[2],fr[3],pad).s>C.fit(sS,fr[2],fr[3],pad).s*1.04){setW(false);safe=tS}else safe=sS}}
    const f=C.fit(safe,fr[2],fr[3],pad);f.ox-=fr[0]*f.s;f.oy-=fr[1]*f.s;
    K.safe=safe;K.f=f;K._layout.forEach(fn=>fn(sf,safe))};
  K.theme=function(){K.day=api.day;over.classList.toggle("day",api.day);o.onTheme&&o.onTheme(api.day)};
  K.label=function(html,p,opt){opt=opt||{};const it=LB.add(`<span>${html}</span>`,p,opt.cls||"");if(opt.view)it.view=opt.view;if(opt.dir)it.dir=opt.dir;if(opt.len!=null)it.len=opt.len;
    it.set=h=>{const s=`<span>${h}</span>`;if(it._h!==s){it.el.innerHTML=s;it._h=s}};return it};
  let infoH="";K.setInfo=h=>{infoH=h};K.infoFn=f=>{K._info=f};
  K.updateInfo=function(force){if(!K.info)return;const h=typeof K._info==="function"?K._info():infoH;if(force||K.info._h!==h){const h0=K.info.offsetHeight;K.info.innerHTML=h;K.info._h=h;if((!!h0)!==(!!K.info.offsetHeight)||Math.abs(h0-K.info.offsetHeight)>20)K.layout()}};
  K.dockFn=f=>{K._dock=f};K.onDock=f=>{K._dockH=f};
  K.views=o.views||null;
  K.goView=function(v){K.view=v;K.layout();for(const it of LB.items)it.on=!it.view||it.view===v||(Array.isArray(it.view)&&it.view.includes(v));o.onView&&o.onView(v);K.refreshDock();K.updateInfo(true)};
  K.refreshDock=function(){if(!K._dock)return;const vs=K.views;const vk=vs?Object.keys(vs):[];
    const seg=vk.length>1?{seg:vk.map(k=>({k:"__view",v:k,label:vs[k].label,icon:vs[k].icon||ICON.eye,on:K.view===k})),label:"Phần"}:null;
    api.dock.innerHTML=dockHTML([seg,seg?"hr":null].concat(K._dock()||[]))};
  function onDockClick(e){const t=e.target.closest("[data-k]");if(!t||t.disabled)return;const k=t.dataset.k,v=t.dataset.v;if(k==="__view"){K.goView(v);return}K._dockH&&K._dockH(k,v,t);K.refreshDock()}
  api.dock.addEventListener("click",onDockClick);
  let dragging=null;/* toạ độ thiết kế: mảng [x,y] đồng thời có .x .y (các thí nghiệm dùng cả hai cách) */const sc=p=>{const q=K.f?K.f.toScene(p):p;const a=[q.x,q.y];a.x=q.x;a.y=q.y;return a};
  hotLayer(K,q=>proj.project(q));
  const ptr=C.pointer(st.cv,{down(p){const q=sc(p);const k=K._pick?K._pick(q,"down"):null;if(k&&k.drag&&K._drag){dragging=k;K._drag("start",k,q);return true}return true},
    move(p){if(dragging)K._drag("move",dragging,sc(p))},
    up(p,e,tap){const q=sc(p);if(dragging){K._drag("end",dragging,q);const d=dragging;dragging=null;if(tap&&K._tap)K._tap(d,q);return}if(tap){const k=K._pick?K._pick(q,"tap"):null;const h=!k&&K._hotHit(p.x,p.y);if(h){K._hotFire(h);return}if(K._tap)K._tap(k,q)}},
    cancel(){if(dragging){K._drag("cancel",dragging);dragging=null}},
    hover(p){if(K.frameN%3)return;const k=K._pick?K._pick(sc(p),"hover"):null;const h=!k&&K._hotHit(p.x,p.y);K._hotHover(h);st.cv.style.cursor=k?(k.drag?"grab":"pointer"):h?"pointer":"default"}});
  K.pickFn=f=>{K._pick=f};K.tapFn=f=>{K._tap=f};K.dragFn=f=>{K._drag=f};K.drawFn=f=>{K._draw=f};
  K.onFrame=f=>K._frame.push(f);K.onReset=f=>K._reset.push(f);K.onUnmount=f=>K._un.push(f);K.onLayout=f=>K._layout.push(f);
  K.timeLabel=f=>{K._label=()=>{const r=f();return Array.isArray(r)?r:[r,null]}};
  /* màu nền / mực theo chế độ sáng tối */
  K.pal=()=>K.day?{bg1:"#EEF1F8",bg2:"#DCE2EE",ink:"#0D1433",mut:"#5A6488",line:"rgba(13,20,51,.18)",card:"#FFFFFF",grid:"rgba(13,20,51,.07)"}:{bg1:"#141B3F",bg2:"#070B1E",ink:"#F1F4FF",mut:"#9AA5D6",line:"rgba(190,205,255,.22)",card:"#1A2350",grid:"rgba(150,175,255,.08)"};
  function frame(dt){K.frameN++;const sdt=api.time.playing?dt*api.time.speed:0;K.simT+=sdt;for(const f of K._frame)f(sdt,dt);
    const ctx=st.ctx;ctx.setTransform(st.dpr,0,0,st.dpr,0,0);const P=K.pal();const g=ctx.createLinearGradient(0,0,0,st.h);g.addColorStop(0,P.bg1);g.addColorStop(1,P.bg2);ctx.fillStyle=g;ctx.fillRect(0,0,st.w,st.h);
    if(K.f&&K._draw){const f=K.f;ctx.save();ctx.translate(f.ox,f.oy);ctx.scale(f.s,f.s);K._draw(ctx,P,sdt,f);ctx.restore()}
    LB.update();K._hotUpdate();if(K.frameN%8===0)K.updateInfo();if(K._label)api.time.label(...K._label())}
  K.start=function(){K.theme();K.layout();if(K.views)K.goView(Object.keys(K.views)[0]);else K.refreshDock();K.loop=C.loop(frame);K.ro=new ResizeObserver(()=>K.layout());K.ro.observe(vp);
    api.time.onReset(()=>{K.simT=0;K._reset.forEach(f=>f());K.refreshDock();K.updateInfo(true)})};
  K.mount=function(stp){return{step(i,el){stp&&stp.step(i,el)},layout(){K.layout()},prefs(){K.theme();stp&&stp.render()},
    unmount(){K.dead=true;K.loop&&K.loop.stop();ptr.destroy();K.ro&&K.ro.disconnect();api.dock.removeEventListener("click",onDockClick);K._un.forEach(f=>{try{f()}catch(e){}});LB.clear();st.destroy();over.remove();delete vp.__lab}}};
  return K}

/* ============== tiện ích vẽ 2D ============== */
const D2={
  rr:C.rr,
  text(ctx,t,x,y,o){o=o||{};ctx.font=`${o.w||600} ${o.s||16}px ${o.f||"'Be Vietnam Pro',system-ui,sans-serif"}`;ctx.fillStyle=o.c||"#fff";ctx.textAlign=o.a||"left";ctx.textBaseline=o.b||"alphabetic";ctx.fillText(t,x,y);ctx.textAlign="left";ctx.textBaseline="alphabetic"},
  arrow(ctx,x1,y1,x2,y2,c,w,hs){const a=Math.atan2(y2-y1,x2-x1);hs=hs||9;ctx.strokeStyle=c;ctx.fillStyle=c;ctx.lineWidth=w||2;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2-Math.cos(a)*hs*.8,y2-Math.sin(a)*hs*.8);ctx.stroke();
    ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-Math.cos(a-.42)*hs,y2-Math.sin(a-.42)*hs);ctx.lineTo(x2-Math.cos(a+.42)*hs,y2-Math.sin(a+.42)*hs);ctx.closePath();ctx.fill()},
  /* khối nổi: bóng đổ, viền sáng trên, gradient dọc */
  block(ctx,x,y,w,h,r,c1,c2,o){o=o||{};ctx.save();if(o.shadow!==false){ctx.shadowColor="rgba(0,0,0,.35)";ctx.shadowBlur=o.blur||14;ctx.shadowOffsetY=o.dy==null?6:o.dy}
    const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,c1);g.addColorStop(1,c2||c1);ctx.fillStyle=g;C.rr(ctx,x,y,w,h,r);ctx.fill();ctx.restore();
    if(o.stroke){ctx.strokeStyle=o.stroke;ctx.lineWidth=o.lw||1.5;C.rr(ctx,x,y,w,h,r);ctx.stroke()}
    ctx.save();ctx.globalAlpha=.35;const hl=ctx.createLinearGradient(0,y,0,y+Math.min(h,22));hl.addColorStop(0,"rgba(255,255,255,.9)");hl.addColorStop(1,"rgba(255,255,255,0)");ctx.fillStyle=hl;C.rr(ctx,x+1,y+1,w-2,Math.min(h-2,22),Math.max(0,r-1));ctx.fill();ctx.restore()},
  ball(ctx,x,y,r,c,label,ink){const g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.1,x,y,r);g.addColorStop(0,"#FFFFFF");g.addColorStop(.3,c);g.addColorStop(1,C.mix(c,"#000000",.45));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill();
    if(label){ctx.fillStyle=ink||"#fff";ctx.font=`800 ${Math.round(r*(label.length>1?.85:1.05))}px 'Lexend',system-ui,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(label,x,y+r*.04);ctx.textAlign="left";ctx.textBaseline="alphabetic"}},
  grid(ctx,x,y,w,h,step,c){ctx.strokeStyle=c;ctx.lineWidth=1;ctx.beginPath();for(let gx=x;gx<=x+w+.1;gx+=step){ctx.moveTo(gx,y);ctx.lineTo(gx,y+h)}for(let gy=y;gy<=y+h+.1;gy+=step){ctx.moveTo(x,gy);ctx.lineTo(x+w,gy)}ctx.stroke()},
  /* đồ thị đường: series [{pts:[[x,y]],c,w,dash}], khung {x,y,w,h,x0,x1,y0,y1,xl,yl,ticks} */
  chart(ctx,F,series,P){const {x,y,w,h}=F;const px=v=>x+(v-F.x0)/(F.x1-F.x0)*w,py=v=>y+h-(v-F.y0)/(F.y1-F.y0)*h;
    ctx.fillStyle=P.card;ctx.globalAlpha=.55;C.rr(ctx,x-46,y-24,w+62,h+60,12);ctx.fill();ctx.globalAlpha=1;
    ctx.strokeStyle=P.grid;ctx.lineWidth=1;const nx=F.nx||5,ny=F.ny||4;ctx.beginPath();for(let i=0;i<=nx;i++){const gx=x+w*i/nx;ctx.moveTo(gx,y);ctx.lineTo(gx,y+h)}for(let i=0;i<=ny;i++){const gy=y+h*i/ny;ctx.moveTo(x,gy);ctx.lineTo(x+w,gy)}ctx.stroke();
    ctx.strokeStyle=P.mut;ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();
    ctx.font="600 12px 'Be Vietnam Pro',system-ui,sans-serif";ctx.fillStyle=P.mut;ctx.textAlign="center";
    for(let i=0;i<=nx;i++){const v=F.x0+(F.x1-F.x0)*i/nx;ctx.fillText(C.fmt(v,F.xd||0),x+w*i/nx,y+h+16)}
    ctx.textAlign="right";for(let i=0;i<=ny;i++){const v=F.y0+(F.y1-F.y0)*i/ny;ctx.fillText(C.fmt(v,F.yd||0),x-6,y+h-h*i/ny+4)}
    ctx.textAlign="left";ctx.fillStyle=P.ink;ctx.font="700 12.5px 'Be Vietnam Pro',system-ui,sans-serif";if(F.yl)ctx.fillText(F.yl,x-40,y-8);ctx.textAlign="right";if(F.xl)ctx.fillText(F.xl,x+w+12,y+h+32);ctx.textAlign="left";
    for(const s of series){if(!s.pts.length)continue;ctx.strokeStyle=s.c;ctx.lineWidth=s.w||2.6;ctx.setLineDash(s.dash||[]);ctx.lineJoin="round";ctx.beginPath();s.pts.forEach((p,i)=>{const X=px(C.clamp(p[0],F.x0,F.x1)),Y=py(C.clamp(p[1],F.y0,F.y1));i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)});ctx.stroke();ctx.setLineDash([]);
      if(s.dot){const p=s.pts[s.pts.length-1];ctx.fillStyle=s.c;ctx.beginPath();ctx.arc(px(C.clamp(p[0],F.x0,F.x1)),py(C.clamp(p[1],F.y0,F.y1)),4.5,0,6.283);ctx.fill()}}
    return{px,py}}
};

/* ============== bảng SVG nhỏ cho thẻ thông tin ============== */
function miniChart(series,o){o=o||{};const W=o.w||230,Hh=o.h||100;const tmax=o.x1||Math.max(1,...series.flatMap(s=>s.pts.map(p=>p[0])));const vmin=o.y0==null?0:o.y0;
  const vmax=o.y1||Math.max(vmin+1e-6,...series.flatMap(s=>s.pts.map(p=>p[1])))*1.08;const px=t=>30+t/tmax*(W-38),py=v=>Hh-16-(v-vmin)/(vmax-vmin)*(Hh-30);
  return `<svg viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" style="display:block;margin-top:4px;max-width:100%" role="img" aria-label="${esc(o.aria||"Đồ thị")}">
    <line x1="30" y1="${Hh-16}" x2="${W-6}" y2="${Hh-16}" stroke="currentColor" stroke-opacity=".35"/><line x1="30" y1="12" x2="30" y2="${Hh-16}" stroke="currentColor" stroke-opacity=".35"/>
    <text x="${W-6}" y="${Hh-3}" font-size="8.5" text-anchor="end" fill="currentColor" opacity=".75">${esc(o.xl||"")}</text><text x="34" y="10" font-size="8.5" fill="currentColor" opacity=".75">${esc(o.yl||"")}</text>
    <text x="26" y="${py(vmax/1.08)+3}" font-size="8" text-anchor="end" fill="currentColor" opacity=".7">${C.fmt(vmax/1.08,o.yd==null?1:o.yd)}</text>
    ${series.map(s=>s.pts.length?`<polyline fill="none" stroke="${s.c}" stroke-width="2.2" stroke-linejoin="round" points="${s.pts.map(p=>`${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(" ")}"/>`:"").join("")}
    ${series.map((s,i)=>s.name?`<rect x="${W-(series.length-i)*58}" y="3" width="8" height="8" rx="2" fill="${s.c}"/><text x="${W-(series.length-i)*58+11}" y="10" font-size="8.5" fill="currentColor">${esc(s.name)}</text>`:"").join("")}</svg>`}

/* vân mô sống (nhiễu thủ tục làm gồ ghề pháp tuyến): vật liệu cần uniforms {uBump, uNF} */
const NOISE=`float hsh(vec3 p){p=fract(p*.3183099+.1);p*=17.;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(hsh(i),hsh(i+vec3(1,0,0)),f.x),mix(hsh(i+vec3(0,1,0)),hsh(i+vec3(1,1,0)),f.x),f.y),mix(mix(hsh(i+vec3(0,0,1)),hsh(i+vec3(1,0,1)),f.x),mix(hsh(i+vec3(0,1,1)),hsh(i+vec3(1,1,1)),f.x),f.y),f.z);}`;
const TISSUE={fu:NOISE+"uniform float uBump,uNF;",fs:`{float f=uNF;vec3 q=vO*f;float e=.35;float n0=vn(q);vec3 gN=vec3(vn(q+vec3(e,0,0))-n0,vn(q+vec3(0,e,0))-n0,vn(q+vec3(0,0,e))-n0)/e;N=normalize(N-gN*uBump);base.rgb*=.85+.3*n0;}`};
window.LabKit={steps,scene3D,scene2D,dockHTML,ICON,D2,miniChart,theme3D,esc,NOISE,TISSUE};
})();
