/* K6-S-04 · Quan sát vi khuẩn và nguyên sinh vật (SGK KHTN 6 – Kết nối tri thức, Bài 26–27) · kính hiển vi quang học 3D + thị trường
   - Vi khuẩn trong sữa chua (vi khuẩn lactic hình que, đứng riêng hoặc xếp thành chuỗi): dài khoảng 2 – 4 µm, cần vật kính dầu ×100 (1000 lần).
   - Nguyên sinh vật trong nước ao: trùng giày (dài khoảng 200 µm, có lông bơi), trùng roi xanh (khoảng 50 µm, có roi, có hạt diệp lục, điểm mắt đỏ),
     trùng biến hình (thay đổi hình dạng nhờ chân giả). Quan sát tốt ở vật kính ×10.
   Thị trường tính theo số trường 18 mm của thị kính ×10; ảnh mờ khi lệch tiêu cự. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,M=window.LabMicro,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const SP={aoho:{t:"Giọt nước ao",st:null},suachua:{t:"Sữa chua (vi khuẩn lactic)",st:"xanh methylene"}};
const SPEC={
  predict:[{id:"p1",q:"Để quan sát vi khuẩn trong sữa chua cần dùng:",opts:[["khv","Kính hiển vi với độ phóng đại lớn (khoảng 1000 lần)"],["lup","Kính lúp"],["mat","Mắt thường"]],ans:"khv",res:"Kết quả: vi khuẩn chỉ dài vài micromet, cần vật kính dầu ×100."},
    {id:"p2",q:"Trùng giày di chuyển nhờ:",opts:[["long","Lông bơi"],["roi","Roi"],["chan","Chân giả"]],ans:"long",res:"Kết quả: trùng giày có nhiều lông bơi phủ khắp cơ thể; trùng roi di chuyển nhờ roi; trùng biến hình nhờ chân giả."}],
  taskLead:"Đặt tiêu bản, bật đèn, chọn vật kính và chỉnh ốc to, ốc nhỏ cho rõ; chuyển sang “Thị kính” để quan sát, kéo để di chuyển tiêu bản.",
  tasks:[{html:"<b>Nguyên sinh vật:</b> nhìn rõ giọt nước ao ở vật kính ×10.",done:()=>!!S.seen["aoho|1"]},{html:"<b>Vi khuẩn:</b> nhìn rõ vi khuẩn sữa chua ở vật kính ×100.",done:()=>!!S.seen["suachua|3"]}],
  obs:[{id:"a",q:"Trùng roi xanh có màu xanh lục vì:",opts:[["ok","Có hạt diệp lục, có thể quang hợp"],["an","Ăn tảo xanh"],["nuoc","Do màu nước ao"]],ans:"ok",why:"Trùng roi xanh vừa tự dưỡng (quang hợp) vừa có thể dị dưỡng."},
    {id:"b",q:"Vi khuẩn lactic trong sữa chua có hình:",opts:[["que","Hình que"],["xoan","Hình xoắn"],["sao","Hình sao"]],ans:"que",why:"Vi khuẩn có các hình dạng: hình cầu, hình que, hình dấu phẩy, hình xoắn."},
    {id:"c",q:"So với tế bào trùng giày, tế bào vi khuẩn:",opts:[["ok","Nhỏ hơn rất nhiều, chưa có nhân hoàn chỉnh (tế bào nhân sơ)"],["lon","Lớn hơn"],["nhan","Có nhân hoàn chỉnh"]],ans:"ok",why:"Nguyên sinh vật là sinh vật nhân thực, phần lớn đơn bào."}],
  concl:{html:`<ul class="tlist"><li><b>Vi khuẩn</b> là những sinh vật đơn bào, nhân sơ, kích thước rất nhỏ (vài micromet), có nhiều hình dạng (cầu, que, xoắn, dấu phẩy). Vi khuẩn lactic trong sữa chua có lợi cho tiêu hóa.</li>
    <li><b>Nguyên sinh vật</b> phần lớn là sinh vật đơn bào, nhân thực, kích thước lớn hơn vi khuẩn nhiều lần: trùng giày (di chuyển bằng lông bơi), trùng roi (bằng roi), trùng biến hình (bằng chân giả).</li>
    <li>Muốn quan sát vi khuẩn cần kính hiển vi có độ phóng đại lớn (vật kính dầu ×100); nguyên sinh vật quan sát được ở độ phóng đại 100 – 400 lần.</li></ul>`,
    quiz:[{id:"q1",q:"Bệnh sốt rét do sinh vật nào gây ra?",opts:[["a","Trùng sốt rét (một loại nguyên sinh vật)"],["b","Vi khuẩn lactic"],["c","Virus"]],ans:"a",why:{b:"Vi khuẩn lactic có lợi.",c:"Sốt rét do nguyên sinh vật Plasmodium, lây qua muỗi Anopheles."}},
      {id:"q2",q:"Ở độ phóng đại 1000 lần, một vi khuẩn dài 3 µm có ảnh dài khoảng:",opts:[["a","3 mm"],["b","3 cm"],["c","0,3 mm"]],ans:"a",why:{b:"3 µm × 1000 = 3000 µm = 3 mm.",c:"3 µm × 1000 = 3 mm."}}],
    done:`<h2>Hoàn thành: quan sát vi khuẩn và nguyên sinh vật</h2><p class="muted">Vi khuẩn rất nhỏ, cần độ phóng đại lớn; nguyên sinh vật lớn hơn, di chuyển bằng lông bơi, roi hoặc chân giả.</p>`},
  gv:["Chuẩn bị nước ao hoặc nước ngâm rơm, cỏ khô 5 – 7 ngày để có nhiều trùng giày.","Vật kính dầu ×100 cần nhỏ một giọt dầu soi lên lam kính.","Hỏi: vì sao trùng giày bơi ra khỏi thị trường rất nhanh ở vật kính lớn?"]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 26, 27)</p><ul class="tlist"><li>Quan sát và vẽ được hình vi khuẩn quan sát được dưới kính hiển vi; quan sát và vẽ được hình nguyên sinh vật dưới kính lúp hoặc kính hiển vi; nhận biết được một số nguyên sinh vật thường gặp.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 26 Thực hành quan sát vi khuẩn; Bài 27 Nguyên sinh vật.</li>
<li>Đường kính thị trường = số trường của thị kính : độ phóng đại vật kính: <a href="https://www.microscopyu.com/microscopy-basics/field-of-view" target="_blank" rel="noopener">Nikon MicroscopyU – Field of View</a>.</li>
<li>Hình dạng, kích thước vi khuẩn và nguyên sinh vật: <a href="https://openstax.org/books/microbiology/pages/3-3-unique-characteristics-of-prokaryotic-cells" target="_blank" rel="noopener">OpenStax Microbiology, mục 3.3</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Kích thước: vi khuẩn lactic 2 – 4 µm; trùng giày khoảng 200 µm; trùng roi xanh khoảng 50 µm; trùng biến hình 200 – 300 µm (giá trị điển hình). Chuyển động và hình dạng là mô phỏng.</li></ul>`;

let S;
LabKHTN.register("K6-S-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"mau",t:"Mẫu vật"},{k:"dp",t:"Độ phóng đại"},{k:"qs",t:"Quan sát được"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Kính hiển vi 3D quan sát vi khuẩn và nguyên sinh vật",legend:{w:280},bench:[1.6,.8],seed:2,
      views:{kinh:{t:[0,.33,0],yaw:.55,pitch:.18,rad:.36,label:"Kính hiển vi",icon:IC.lens},thi:{t:[0,.33,0],yaw:.55,pitch:.18,rad:.36,label:"Thị kính",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={spec:"aoho",stain:true,slide:false,light:false,obj:0,z:-3,lowered:false,pan:[0,0],seen:{},lup:false,lab:true,recs:0};
    const rec=(mau,dp,qs)=>{S.recs++;api.record({lan:String(S.recs),mau,dp,qs})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const mic=root.add(M.build3D(R,G,{nObj:4}));mic.setObj(0);mic.setLight(false);
    /* ---------- lớp vẽ thị trường (canvas phủ) ---------- */
    const ov=document.createElement("canvas");ov.style.cssText="position:absolute;display:none;touch-action:none;border-radius:14px";K.over.appendChild(ov);let oc=ov.getContext("2d"),OW=0,OH=0;
    K.onLayout((sf,safe)=>{const dpr=Math.min(2,window.devicePixelRatio||1);ov.style.left=safe.x+"px";ov.style.top=safe.y+"px";ov.style.width=safe.w+"px";ov.style.height=safe.h+"px";OW=safe.w;OH=safe.h;ov.width=Math.round(safe.w*dpr);ov.height=Math.round(safe.h*dpr);oc=ov.getContext("2d");oc.setTransform(dpr,0,0,dpr,0,0)});
    let drag=null;ov.addEventListener("pointerdown",e=>{drag=[e.clientX,e.clientY,S.pan[0],S.pan[1]];ov.setPointerCapture(e.pointerId)});ov.addEventListener("pointermove",e=>{if(!drag)return;const ob=M.OBJ[S.obj];const R0=Math.min(OW,OH)*.42;const um=2*R0/ob.fov;S.pan=[drag[2]-(e.clientX-drag[0])/um,drag[3]-(e.clientY-drag[1])/um]});ov.addEventListener("pointerup",()=>drag=null);
    const focusErr=()=>S.z;   /* mm; 0 = đúng tiêu cự */
    const sharp=()=>Math.abs(focusErr())<M.OBJ[S.obj].dof*.6;
    function drawOv(){const v=K.view;if(v!=="thi"){ov.style.display="none";return}ov.style.display="block";const g=oc;g.clearRect(0,0,OW,OH);g.fillStyle="#05070F";g.fillRect(0,0,OW,OH);
      const R0=Math.min(OW,OH)*.42,cx=OW/2,cy=OH/2+6;const ok=S.slide&&S.light;
      M.eyepiece(g,cx,cy,R0,ok?S.spec:null,{obj:S.obj,focus:focusErr(),light:S.light?1:0,stain:S.stain,t:K.simT,pan:S.pan,scale:true});
      txt(g,`Độ phóng đại: 10 × ${M.OBJ[S.obj].m} = ${10*M.OBJ[S.obj].m} lần${M.OBJ[S.obj].oil?" (vật kính dầu)":""}`,cx,cy-R0-14);
      if(!S.light)txt(g,"Chưa bật đèn",cx,cy);else if(!S.slide)txt(g,"Chưa đặt tiêu bản",cx,cy);else if(!sharp())txt(g,Math.abs(focusErr())>1.2?"Chưa thấy ảnh – vặn ốc to":"Ảnh còn mờ – vặn ốc nhỏ",cx,cy+R0+26);
      else if(S.lab){const um=2*R0/M.OBJ[S.obj].fov;const sx=x=>cx+(x-S.pan[0])*um,sy=y=>cy+(y-S.pan[1])*um;
        if(S.spec==="aoho"){const done={};const sides=[[-.62,-.66],[.62,-.66],[.68,.6]];let k=0;for(const o of M.SPECS.aoho.org){if(done[o.k])continue;const X=sx(o.x),Y=sy(o.y);if(Math.hypot(X-cx,Y-cy)<R0*.85){done[o.k]=1;const sd=sides[k++%3];arrowLbl(g,X,Y,cx+R0*sd[0],cy+R0*sd[1],{giay:"Trùng giày",roi:"Trùng roi xanh",bh:"Trùng biến hình"}[o.k])}}
          if(!Object.keys(done).length)txt(g,"Kéo để tìm nguyên sinh vật",cx,cy+R0+26)}
        else if(S.obj===3)arrowLbl(g,cx+4,cy+2,cx+R0*.55,cy-R0*.62,"Vi khuẩn hình que");else txt(g,"Vi khuẩn quá nhỏ – cần vật kính ×100",cx,cy+R0+26)}}
    function txt(g,t,x,y){g.font="700 15px 'Be Vietnam Pro',system-ui";g.textAlign="center";g.fillStyle="#E2E8F0";g.fillText(t,x,y);g.textAlign="left"}
    function arrowLbl(g,x,y,lx,ly,t){g.strokeStyle="#FDE047";g.lineWidth=2;g.beginPath();g.moveTo(lx,ly);g.lineTo(x,y);g.stroke();g.fillStyle="#FDE047";g.beginPath();g.arc(x,y,3.5,0,6.283);g.fill();g.font="700 13px 'Be Vietnam Pro',system-ui";const w=g.measureText(t).width+14;g.fillStyle="rgba(15,23,42,.85)";C.rr(g,lx-w/2,ly-22,w,22,8);g.fill();g.fillStyle="#FDE047";g.textAlign="center";g.fillText(t,lx,ly-6);g.textAlign="left"}
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame(dt=>{mic.setStage(-.002*Math.max(-6,Math.min(1,S.z))*1+0);mic.P.slide.visible=S.slide;if(M.SPECS.aoho.step)M.SPECS.aoho.step(dt*(S.spec==="aoho"?1:0));drawOv();
      tk+=dt;if(tk>.25){tk=0;K.updateInfo()}
      if(K.view==="thi"&&S.slide&&S.light&&sharp()){const key=S.spec+"|"+S.obj;if(!S.seen[key]&&(S.spec==="aoho"?S.obj>=1:S.obj===3)){S.seen[key]=1;rec(SP[S.spec].t,`${10*M.OBJ[S.obj].m} lần`,S.spec==="aoho"?"trùng giày (hình chiếc giày, lông bơi), trùng roi xanh (màu xanh, có roi), trùng biến hình (chân giả)":"vi khuẩn hình que nhỏ, đứng riêng hoặc thành chuỗi ngắn");refresh()}}});
    const knob=(c,f)=>{S.kc=(S.kc||0)+c;S.kf=(S.kf||0)+f;mic.knobs(S.kc,S.kf)};
    K.dockFn(()=>{const v=K.view;
      const it=[{seg:Object.keys(SP).map(k=>({k:"spec",v:k,label:SP[k].t,icon:"",on:S.spec===k})),label:"Tiêu bản"},
        {grid:[{k:"slide",label:S.slide?"Lấy tiêu bản ra":"Đặt tiêu bản, kẹp lại",icon:IC.hand,on:S.slide},{k:"light",label:S.light?"Tắt đèn":"Bật đèn",icon:IC.sun,on:S.light}]},
        {seg:[0,1,2,3].map(i=>({k:"obj",v:String(i),label:`×${M.OBJ[i].m}`,icon:"",on:S.obj===i})),label:"Vật kính (xoay đĩa)"},
        {grid:[{k:"co",v:"1",label:"Ốc to ↑",icon:"",title:"Nâng bàn kính"},{k:"co",v:"-1",label:"Ốc to ↓",icon:""},{k:"fi",v:"1",label:"Ốc nhỏ ↑",icon:""},{k:"fi",v:"-1",label:"Ốc nhỏ ↓",icon:""}]},{k:"stain",label:S.stain?"Mẫu đã nhuộm":"Mẫu chưa nhuộm",icon:IC.drop,on:S.stain},{k:"lab",label:S.lab?"Ẩn chú thích":"Hiện chú thích",icon:IC.eye,on:S.lab}];return it});
    K.onDock((k,v)=>{if(k==="spec"){S.spec=v;S.pan=[0,0]}else if(k==="slide"){S.slide=!S.slide}else if(k==="light"){S.light=!S.light;mic.setLight(S.light)}
      else if(k==="obj"){const ni=+v;if(ni>S.obj&&!sharp())api.toast("Nên chỉnh rõ ảnh ở vật kính nhỏ trước khi chuyển sang vật kính lớn.","warn",2400);S.obj=ni;mic.setObj(ni)}
      else if(k==="co"){const d=+v*.4;if(S.obj>=2&&d>0&&S.z>-.5)api.toast("Vật kính ×40 rất sát tiêu bản – chỉ dùng ốc nhỏ để tránh chạm vỡ tiêu bản.","warn",2600);S.z=C.clamp(S.z+d,-6,S.obj>=2?.05:.6);knob(+v*.8,0)}
      else if(k==="fi"){S.z=C.clamp(S.z+(+v)*.01,-6,.6);knob(0,+v*.3)}else if(k==="stain")S.stain=!S.stain;else if(k==="lab")S.lab=!S.lab;refresh()});
    K.label("Thị kính",()=>[0,.5+.03+.19*Math.cos(.55),.01+.19*Math.sin(.55)*0-.1],{view:"kinh",dir:"n",len:24});K.label("Vật kính",[0,.42,.08],{view:"kinh",dir:"e",len:50});
    K.label("Bàn kính",()=>[.12,.25,.06],{view:"kinh",dir:"e",len:30});K.label("Đèn chiếu sáng",[0,.1,.1],{view:"kinh",dir:"e",len:40});K.label("Ốc to",[-.08,.25,-.12],{view:"kinh",dir:"w",len:40});K.label("Ốc nhỏ",[-.09,.22,-.12],{view:"kinh",dir:"sw",len:30});
    K.label("Thân kính",[0,.4,-.19],{view:"kinh",dir:"nw",len:30});K.label("Chân kính",[-.17,.03,.1],{view:"kinh",dir:"sw",len:20});K.label("Đĩa quay",[-.06,.44,.06],{view:"kinh",dir:"w",len:40});
    K.infoFn(()=>{      const e=focusErr();return `<div><b>${SP[S.spec].t}</b>${S.stain&&SP[S.spec].st?` · nhuộm ${SP[S.spec].st}`:""}</div><div>${S.slide?"✓":"○"} tiêu bản · ${S.light?"✓":"○"} đèn · vật kính ×${M.OBJ[S.obj].m}</div><div>Lệch tiêu cự: ${e>0?"+":""}${fmt(e,2)} mm ${sharp()?"· <b>rõ nét</b>":""}</div><small>Ốc to: mỗi nấc 0,4 mm · ốc nhỏ: 0,01 mm. Chuyển sang “Thị kính” để nhìn.</small>`});
    K.timeLabel(()=>`×${10*M.OBJ[S.obj].m}`);
    K.onUnmount&&K.onUnmount(()=>ov.remove());
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"slide",p:[0,.256,.16],tip:S.slide?"Chạm để lấy tiêu bản ra":"Chạm để đặt tiêu bản lên bàn kính",view:"kinh"},{k:"light",p:[0,.1,.08],tip:S.light?"Chạm để tắt đèn":"Chạm để bật đèn",view:"kinh"},{k:"co",v:"1",p:[.062,.29,-.12],tip:"Chạm ốc to để nâng bàn kính",view:"kinh"},{k:"fi",v:"1",p:[.095,.235,-.12],tip:"Chạm ốc nhỏ để chỉnh rõ nét",view:"kinh"},{k:"obj",v:String((S.obj+1)%4),p:[0,.43,.1],tip:"Chạm để xoay đĩa đổi vật kính",view:"kinh"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K.goView("thi");S.slide=true;S.light=true;mic.setLight(true);S.z=0;for(const [sp,o] of [["aoho",1],["suachua",3]]){S.spec=sp;S.obj=o;S.seen[sp+"|"+o]=1;rec(SP[sp].t,`${10*M.OBJ[o].m} lần`,"quan sát rõ")}S.spec="aoho";S.obj=1;mic.setObj(1);refresh()}};
    return K.mount(st)}
});
})();
