/* K6-S-02 · Thực hành: quan sát tế bào sinh vật (SGK KHTN 6 – Kết nối tri thức, Bài 18) · kính hiển vi quang học 3D + thị trường
   - Trứng cá: quan sát bằng kính lúp (tế bào lớn, nhìn thấy bằng mắt thường).
   - Biểu bì vảy hành, tế bào niêm mạc miệng: làm tiêu bản, quan sát bằng kính hiển vi theo đúng trình tự: đặt tiêu bản → bật đèn → vật kính ×4
     → vặn ốc to hạ dần (nhìn từ bên ngoài) → nhìn thị kính, vặn ốc to nâng từ từ tới khi thấy ảnh → vặn ốc nhỏ cho rõ nét → chuyển vật kính lớn hơn.
   Thị trường tính theo số trường 18 mm của thị kính ×10; ảnh mờ khi lệch khỏi mặt phẳng tiêu cự (độ sâu trường ảnh giảm khi tăng độ phóng đại). */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,M=window.LabMicro,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const SP={hanh:{t:"Biểu bì vảy hành",st:"dung dịch iodine loãng"},mieng:{t:"Niêm mạc miệng",st:"xanh methylene"}};
const SPEC={
  predict:[{id:"p1",q:"Khi bắt đầu quan sát bằng kính hiển vi, nên dùng vật kính:",opts:[["nho","Có độ phóng đại nhỏ nhất (×4 hoặc ×10)"],["lon","Có độ phóng đại lớn nhất (×40)"],["k","Vật kính nào cũng được"]],ans:"nho",res:"Kết quả: vật kính nhỏ có thị trường rộng, dễ tìm mẫu, ít nguy cơ chạm vỡ tiêu bản."},
    {id:"p2",q:"Tế bào biểu bì vảy hành có hình dạng:",opts:[["dai","Hình đa giác dài, xếp sát nhau"],["tron","Hình tròn rời nhau"],["sao","Hình sao"]],ans:"dai",res:"Kết quả: các tế bào vảy hành xếp sát nhau như những viên gạch, có vách tế bào rõ."}],
  taskLead:"Phần “Kính hiển vi”: làm theo trình tự ở khay. Phần “Thị kính”: chỉnh ốc to, ốc nhỏ cho ảnh rõ, kéo để di chuyển tiêu bản. Phần “Kính lúp”: quan sát trứng cá.",
  tasks:[{html:"<b>Trứng cá:</b> quan sát bằng kính lúp.",done:()=>!!S.lup},
    {html:"<b>Vảy hành:</b> nhìn rõ tế bào ở vật kính ×10 và ×40.",done:()=>!!S.seen["hanh|1"]&&!!S.seen["hanh|2"]},
    {html:"<b>Niêm mạc miệng:</b> nhìn rõ tế bào đã nhuộm.",done:()=>!!S.seen["mieng|1"]||!!S.seen["mieng|2"]}],
  obs:[{id:"a",q:"Bộ phận nào của kính hiển vi dùng để điều chỉnh cho ảnh rõ nét nhất?",opts:[["ok","Ốc nhỏ (ốc điều chỉnh tinh)"],["to","Đĩa quay"],["den","Đèn chiếu sáng"]],ans:"ok",why:"Ốc to dùng để tìm ảnh, ốc nhỏ để chỉnh ảnh rõ nét."},
    {id:"b",q:"Độ phóng đại của kính hiển vi khi dùng thị kính ×10 và vật kính ×40 là:",opts:[["ok","400 lần"],["50","50 lần"],["40","40 lần"]],ans:"ok",why:"Độ phóng đại = độ phóng đại thị kính × độ phóng đại vật kính."},
    {id:"c",q:"Tế bào thực vật (vảy hành) khác tế bào động vật (niêm mạc miệng) ở chỗ có:",opts:[["ok","Vách tế bào"],["nhan","Nhân"],["mang","Màng tế bào"]],ans:"ok",why:"Cả hai đều có màng tế bào, tế bào chất và nhân."}],
  concl:{html:`<ul class="tlist"><li>Tế bào trứng cá có kích thước lớn, quan sát được bằng mắt thường hoặc kính lúp. Đa số tế bào rất nhỏ, phải dùng kính hiển vi.</li>
    <li>Tế bào biểu bì vảy hành: hình đa giác dài, xếp sát nhau, có vách tế bào, tế bào chất và nhân. Tế bào niêm mạc miệng: hình dạng không đều, có màng tế bào, tế bào chất và nhân, không có vách tế bào.</li>
    <li>Trình tự dùng kính hiển vi: đặt tiêu bản, bật đèn, dùng vật kính nhỏ, hạ vật kính sát tiêu bản (nhìn bên ngoài), nhìn thị kính và vặn ốc to nâng từ từ tới khi thấy ảnh, vặn ốc nhỏ cho rõ; muốn phóng to hơn mới chuyển sang vật kính lớn.</li></ul>`,
    quiz:[{id:"q1",q:"Khi dùng vật kính ×40, nên chỉnh ảnh bằng:",opts:[["a","Ốc nhỏ"],["b","Ốc to, vặn mạnh"],["c","Kẹp giữ mẫu"]],ans:"a",why:{b:"Ở vật kính lớn, vặn ốc to dễ làm vật kính chạm vỡ tiêu bản và mất ảnh.",c:"Kẹp chỉ giữ tiêu bản."}},
      {id:"q2",q:"Vì sao cần nhuộm tế bào bằng iodine hoặc xanh methylene?",opts:[["a","Để nhân và các thành phần tế bào hiện rõ hơn"],["b","Để tế bào lớn hơn"],["c","Để tế bào chuyển động"]],ans:"a",why:{b:"Thuốc nhuộm không làm tế bào lớn lên.",c:"Thuốc nhuộm không làm tế bào chuyển động."}}],
    done:`<h2>Hoàn thành: quan sát tế bào</h2><p class="muted">Dùng kính lúp và kính hiển vi quan sát trứng cá, vảy hành, niêm mạc miệng.</p>`},
  gv:["Hướng dẫn học sinh luôn nhìn từ bên ngoài khi hạ vật kính sát tiêu bản.","Cho học sinh vẽ hình tế bào quan sát được và chú thích.","Lưu ý: kính hiển vi thật ở trường có thể nâng hạ ống kính thay vì bàn kính."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 18)</p><ul class="tlist"><li>Thực hành quan sát tế bào bằng kính lúp và kính hiển vi; vẽ được hình tế bào quan sát được; nhận biết được tế bào là đơn vị cấu trúc của cơ thể sống.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 18 Thực hành quan sát tế bào sinh vật; Bài 3 (cách sử dụng kính hiển vi quang học).</li>
<li>Đường kính thị trường = số trường của thị kính : độ phóng đại vật kính: <a href="https://www.microscopyu.com/microscopy-basics/field-of-view" target="_blank" rel="noopener">Nikon MicroscopyU – Field of View</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thị kính ×10, số trường 18 mm. Kích thước tế bào vảy hành (dài khoảng 200 – 350 µm), tế bào niêm mạc miệng (khoảng 50 – 80 µm), trứng cá (khoảng 1 mm) là giá trị điển hình; hình tế bào được vẽ mô phỏng. Mô hình nâng hạ bàn kính để lấy nét.</li></ul>`;

let S;
LabKHTN.register("K6-S-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"mau",t:"Mẫu vật"},{k:"dp",t:"Độ phóng đại"},{k:"qs",t:"Quan sát được"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Kính hiển vi 3D và thị trường quan sát tế bào",legend:{w:280},bench:[1.6,.8],seed:2,
      views:{kinh:{t:[0,.33,0],yaw:.55,pitch:.18,rad:.36,label:"Kính hiển vi",icon:IC.lens},thi:{t:[0,.33,0],yaw:.55,pitch:.18,rad:.36,label:"Thị kính",icon:IC.eye},lup:{t:[.85,.04,.18],yaw:.35,pitch:.75,rad:.2,label:"Kính lúp",icon:IC.lens}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={spec:"hanh",stain:true,slide:false,light:false,obj:0,z:-3,lowered:false,pan:[0,0],seen:{},lup:false,lab:true,recs:0};
    const rec=(mau,dp,qs)=>{S.recs++;api.record({lan:String(S.recs),mau,dp,qs})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const mic=root.add(M.build3D(R,G,{nObj:3}));mic.setObj(0);mic.setLight(false);
    /* kính lúp và đĩa trứng cá */
    const lupN=root.add(new G.Node());lupN.pos=[.85,0,.18];lupN.add(R.mesh(G.lathe([[0,0],[.08,0],[.085,.012],[.08,.012],[.08,.003],[0,.003]],40),{type:"glass",color:"#E0F2FE",alpha:.3}));
    const egg=G.sphere(.0055,10,8);for(let i=0;i<46;i++){const a=i*2.4,r=Math.sqrt(i)*.0095;const m=lupN.add(R.mesh(egg,{color:"#F59E0B",rough:.3,coat:.6,alpha:.92,transparent:true}));m.pos=[Math.cos(a)*r,.009,Math.sin(a)*r]}
    const lens=lupN.add(new G.Node());lens.pos=[0,.09,0];lens.add(R.mesh(G.lathe([[0,-.006],[.05,0],[0,.006]],40),{type:"glass",color:"#F8FAFC",alpha:.35}));lens.add(R.mesh(G.tube(Array.from({length:41},(_,i)=>[Math.cos(i/40*6.283)*.051,0,Math.sin(i/40*6.283)*.051]),.004,8),{color:"#1F2937",rough:.4}));
    const hd=lens.add(R.mesh(G.cylinder(.008,.12,12),{color:"#7C2D12",rough:.6}));hd.quat=Q.euler(0,0,Math.PI/2);hd.pos=[.11,0,0];
    /* ---------- lớp vẽ thị trường (canvas phủ) ---------- */
    const ov=document.createElement("canvas");ov.style.cssText="position:absolute;display:none;touch-action:none;border-radius:14px";K.over.appendChild(ov);let oc=ov.getContext("2d"),OW=0,OH=0;
    K.onLayout((sf,safe)=>{const dpr=Math.min(2,window.devicePixelRatio||1);ov.style.left=safe.x+"px";ov.style.top=safe.y+"px";ov.style.width=safe.w+"px";ov.style.height=safe.h+"px";OW=safe.w;OH=safe.h;ov.width=Math.round(safe.w*dpr);ov.height=Math.round(safe.h*dpr);oc=ov.getContext("2d");oc.setTransform(dpr,0,0,dpr,0,0)});
    let drag=null;ov.addEventListener("pointerdown",e=>{drag=[e.clientX,e.clientY,S.pan[0],S.pan[1]];ov.setPointerCapture(e.pointerId)});ov.addEventListener("pointermove",e=>{if(!drag)return;const ob=K.view==="lup"?{fov:9000}:M.OBJ[S.obj];const R0=Math.min(OW,OH)*.42;const um=2*R0/ob.fov;S.pan=[drag[2]-(e.clientX-drag[0])/um,drag[3]-(e.clientY-drag[1])/um]});ov.addEventListener("pointerup",()=>drag=null);
    const focusErr=()=>S.z;   /* mm; 0 = đúng tiêu cự */
    const sharp=()=>Math.abs(focusErr())<M.OBJ[S.obj].dof*.6;
    function drawOv(){const v=K.view;if(v!=="thi"&&v!=="lup"){ov.style.display="none";return}ov.style.display="block";const g=oc;g.clearRect(0,0,OW,OH);g.fillStyle="#05070F";g.fillRect(0,0,OW,OH);
      const R0=Math.min(OW,OH)*.42,cx=OW/2,cy=OH/2+6;
      if(v==="lup"){M.eyepiece(g,cx,cy,R0,"trungca",{lens:{fov:9000,dof:5},focus:0,light:1,t:K.simT,pan:S.pan,scale:true});txt(g,"Kính lúp ×4 · trứng cá",cx,cy-R0-14);
        if(S.lab){arrowLbl(g,cx-R0*.1,cy+R0*.05,cx-R0*.62,cy-R0*.62,"Tế bào trứng cá")}return}
      const ok=S.slide&&S.light;M.eyepiece(g,cx,cy,R0,ok?S.spec:null,{obj:S.obj,focus:focusErr(),light:S.light?1:0,stain:S.stain,t:K.simT,pan:S.pan,scale:true});
      txt(g,`Độ phóng đại: 10 × ${M.OBJ[S.obj].m} = ${10*M.OBJ[S.obj].m} lần`,cx,cy-R0-14);
      if(!S.light)txt(g,"Chưa bật đèn",cx,cy);else if(!S.slide)txt(g,"Chưa đặt tiêu bản",cx,cy);else if(!sharp())txt(g,Math.abs(focusErr())>1.2?"Chưa thấy ảnh – vặn ốc to":"Ảnh còn mờ – vặn ốc nhỏ",cx,cy+R0+26);
      else if(S.lab&&S.obj>=1){const um=2*R0/M.OBJ[S.obj].fov;const sx=x=>cx+(x-S.pan[0])*um,sy=y=>cy+(y-S.pan[1])*um;
        if(S.spec==="hanh"){const cs=M.SPECS.hanh.cells;let best=null,bd=1e9;for(const c of cs){const d=Math.hypot(c.x+c.w/2-S.pan[0]-40/um*0,c.y+c.h/2-S.pan[1]);if(d<bd){bd=d;best=c}}
          if(best){arrowLbl(g,sx(best.x+best.w*best.nx),sy(best.y+best.h*best.ny),cx+R0*.55,cy-R0*.62,"Nhân");arrowLbl(g,sx(best.x+best.w),sy(best.y+best.h*.5),cx+R0*.75,cy+R0*.2,"Vách tế bào");arrowLbl(g,sx(best.x+best.w*.25),sy(best.y+best.h*.55),cx-R0*.7,cy+R0*.55,"Tế bào chất")}}
        else{arrowLbl(g,cx,cy,cx+R0*.6,cy-R0*.6,"(chạm kéo để tìm tế bào)")}}}
    function txt(g,t,x,y){g.font="700 15px 'Be Vietnam Pro',system-ui";g.textAlign="center";g.fillStyle="#E2E8F0";g.fillText(t,x,y);g.textAlign="left"}
    function arrowLbl(g,x,y,lx,ly,t){g.strokeStyle="#FDE047";g.lineWidth=2;g.beginPath();g.moveTo(lx,ly);g.lineTo(x,y);g.stroke();g.fillStyle="#FDE047";g.beginPath();g.arc(x,y,3.5,0,6.283);g.fill();g.font="700 13px 'Be Vietnam Pro',system-ui";const w=g.measureText(t).width+14;g.fillStyle="rgba(15,23,42,.85)";C.rr(g,lx-w/2,ly-22,w,22,8);g.fill();g.fillStyle="#FDE047";g.textAlign="center";g.fillText(t,lx,ly-6);g.textAlign="left"}
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame(dt=>{mic.setStage(-.002*Math.max(-6,Math.min(1,S.z))*1+0);mic.P.slide.visible=S.slide;lupN.visible=K.view==="lup"||K.view==="kinh";drawOv();
      tk+=dt;if(tk>.25){tk=0;K.updateInfo()}
      if(K.view==="thi"&&S.slide&&S.light&&sharp()&&S.obj>=1){const key=S.spec+"|"+S.obj;if(!S.seen[key]){S.seen[key]=1;rec(SP[S.spec].t+(S.stain?` (nhuộm ${SP[S.spec].st})`:""),`${10*M.OBJ[S.obj].m} lần`,S.spec==="hanh"?"tế bào hình đa giác dài, xếp sát nhau; thấy rõ vách tế bào, nhân, tế bào chất":"tế bào hình dạng không đều, có màng tế bào, nhân (bắt màu xanh), không có vách");refresh()}}
      if(K.view==="lup"&&!S.lup){S.lup=true;rec("Trứng cá","kính lúp ×4","tế bào hình cầu, kích thước khoảng 1 mm, nhìn thấy được bằng mắt thường");refresh()}});
    const knob=(c,f)=>{S.kc=(S.kc||0)+c;S.kf=(S.kf||0)+f;mic.knobs(S.kc,S.kf)};
    K.dockFn(()=>{const v=K.view;if(v==="lup")return[{k:"lab",label:S.lab?"Ẩn chú thích":"Hiện chú thích",icon:IC.eye,on:S.lab}];
      const it=[{seg:Object.keys(SP).map(k=>({k:"spec",v:k,label:SP[k].t,icon:"",on:S.spec===k})),label:"Tiêu bản"},
        {grid:[{k:"slide",label:S.slide?"Lấy tiêu bản ra":"Đặt tiêu bản, kẹp lại",icon:IC.hand,on:S.slide},{k:"light",label:S.light?"Tắt đèn":"Bật đèn",icon:IC.sun,on:S.light}]},
        {seg:[0,1,2].map(i=>({k:"obj",v:String(i),label:`×${M.OBJ[i].m}`,icon:"",on:S.obj===i})),label:"Vật kính (xoay đĩa)"},
        {grid:[{k:"co",v:"1",label:"Ốc to ↑",icon:"",title:"Nâng bàn kính"},{k:"co",v:"-1",label:"Ốc to ↓",icon:""},{k:"fi",v:"1",label:"Ốc nhỏ ↑",icon:""},{k:"fi",v:"-1",label:"Ốc nhỏ ↓",icon:""}]},{k:"stain",label:S.stain?"Mẫu đã nhuộm":"Mẫu chưa nhuộm",icon:IC.drop,on:S.stain},{k:"lab",label:S.lab?"Ẩn chú thích":"Hiện chú thích",icon:IC.eye,on:S.lab}];return it});
    K.onDock((k,v)=>{if(k==="spec"){S.spec=v;S.pan=[0,0]}else if(k==="slide"){S.slide=!S.slide}else if(k==="light"){S.light=!S.light;mic.setLight(S.light)}
      else if(k==="obj"){const ni=+v;if(ni>S.obj&&!sharp())api.toast("Nên chỉnh rõ ảnh ở vật kính nhỏ trước khi chuyển sang vật kính lớn.","warn",2400);S.obj=ni;mic.setObj(ni)}
      else if(k==="co"){const d=+v*.4;if(S.obj===2&&d>0&&S.z>-.5)api.toast("Vật kính ×40 rất sát tiêu bản – chỉ dùng ốc nhỏ để tránh chạm vỡ tiêu bản.","warn",2600);S.z=C.clamp(S.z+d,-6,S.obj===2?.05:.6);knob(+v*.8,0)}
      else if(k==="fi"){S.z=C.clamp(S.z+(+v)*.01,-6,.6);knob(0,+v*.3)}else if(k==="stain")S.stain=!S.stain;else if(k==="lab")S.lab=!S.lab;refresh()});
    K.label("Thị kính",()=>[0,.5+.03+.19*Math.cos(.55),.01+.19*Math.sin(.55)*0-.1],{view:"kinh",dir:"n",len:24});K.label("Vật kính",[0,.42,.08],{view:"kinh",dir:"e",len:50});
    K.label("Bàn kính",()=>[.12,.25,.06],{view:"kinh",dir:"e",len:30});K.label("Đèn chiếu sáng",[0,.1,.1],{view:"kinh",dir:"e",len:40});K.label("Ốc to",[-.08,.25,-.12],{view:"kinh",dir:"w",len:40});K.label("Ốc nhỏ",[-.09,.22,-.12],{view:"kinh",dir:"sw",len:30});
    K.label("Thân kính",[0,.4,-.19],{view:"kinh",dir:"nw",len:30});K.label("Chân kính",[-.17,.03,.1],{view:"kinh",dir:"sw",len:20});K.label("Đĩa quay",[-.06,.44,.06],{view:"kinh",dir:"w",len:40});
    K.infoFn(()=>{if(K.view==="lup")return `<div><b>Trứng cá</b> dưới kính lúp</div><small>Tế bào trứng cá lớn (khoảng 1 mm), có thể thấy bằng mắt thường. Kéo để di chuyển.</small>`;
      const e=focusErr();return `<div><b>${SP[S.spec].t}</b>${S.stain?` · nhuộm ${SP[S.spec].st}`:""}</div><div>${S.slide?"✓":"○"} tiêu bản · ${S.light?"✓":"○"} đèn · vật kính ×${M.OBJ[S.obj].m}</div><div>Lệch tiêu cự: ${e>0?"+":""}${fmt(e,2)} mm ${sharp()?"· <b>rõ nét</b>":""}</div><small>Ốc to: mỗi nấc 0,4 mm · ốc nhỏ: 0,01 mm. Chuyển sang “Thị kính” để nhìn.</small>`});
    K.timeLabel(()=>`×${10*M.OBJ[S.obj].m}`);
    K.onUnmount&&K.onUnmount(()=>ov.remove());
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"slide",p:[0,.256,.16],tip:S.slide?"Chạm để lấy tiêu bản ra":"Chạm để đặt tiêu bản lên bàn kính",view:"kinh"},{k:"light",p:[0,.1,.08],tip:S.light?"Chạm để tắt đèn":"Chạm để bật đèn",view:"kinh"},{k:"co",v:"1",p:[.062,.29,-.12],tip:"Chạm ốc to để nâng bàn kính",view:"kinh"},{k:"fi",v:"1",p:[.095,.235,-.12],tip:"Chạm ốc nhỏ để chỉnh rõ nét",view:"kinh"},{k:"obj",v:String((S.obj+1)%3),p:[0,.43,.1],tip:"Chạm để xoay đĩa đổi vật kính",view:"kinh"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K.goView("lup");S.lup=true;rec("Trứng cá","kính lúp ×4","tế bào hình cầu, kích thước khoảng 1 mm");K.goView("thi");S.slide=true;S.light=true;mic.setLight(true);S.z=0;for(const [sp,o] of [["hanh",1],["hanh",2],["mieng",1]]){S.spec=sp;S.obj=o;S.seen[sp+"|"+o]=1;rec(SP[sp].t,`${10*M.OBJ[o].m} lần`,"quan sát rõ tế bào")}S.spec="hanh";S.obj=2;mic.setObj(2);refresh()}};
    return K.mount(st)}
});
})();
