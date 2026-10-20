/* K7-L-01 · Đo tốc độ bằng cổng quang điện; đồ thị quãng đường – thời gian (SGK KHTN 7 – Kết nối tri thức, Bài 9–10) · 3D, điều tra
   1. Xe lăn chạy trên máng nhôm có thước; hai cổng quang điện A, B nối với đồng hồ đo thời gian hiện số (chế độ A ↔ B):
      đồng hồ bắt đầu đếm khi tấm chắn sáng đi qua cổng A, dừng khi qua cổng B. Tốc độ trung bình v = s / t.
   2. Xe đồ chơi chạy pin chuyển động đều; học sinh bấm dừng/chạy để tạo các đoạn chuyển động khác nhau; đồ thị s – t vẽ theo thời gian thực.
   Mô hình: xe lăn chịu lực cản nhỏ (giảm tốc 0,04 m/s²); đồng hồ hiện số làm tròn tới 0,001 s. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const X0=-.62,DEC=.04;
const SPEC={
  predict:[{id:"p1",q:"Khoảng cách giữa hai cổng quang là 0,50 m, đồng hồ chỉ 1,000 s. Tốc độ trung bình của xe là:",opts:[["ok","0,50 m/s"],["2","2,0 m/s"],["5","5,0 m/s"]],ans:"ok",res:"Kết quả: v = s / t = 0,50 m : 1,000 s = 0,50 m/s."},
    {id:"p2",q:"Trên đồ thị quãng đường – thời gian, đoạn nằm ngang (song song trục thời gian) cho biết:",opts:[["dung","Vật đứng yên"],["nhanh","Vật chuyển động rất nhanh"],["deu","Vật chuyển động đều"]],ans:"dung",res:"Kết quả: quãng đường không thay đổi theo thời gian → vật đứng yên."}],
  taskLead:"Phần “Cổng quang”: chọn khoảng cách hai cổng và mức đẩy, bấm “Thả xe”, đọc đồng hồ. Phần “Đồ thị s – t”: chạy xe, bấm dừng/chạy để tạo đồ thị.",
  tasks:[{html:"<b>Cổng quang:</b> đo tốc độ ít nhất 3 lần với khoảng cách hoặc mức đẩy khác nhau.",done:()=>S.meas.length>=3},
    {html:"<b>Đồ thị s – t:</b> tạo một đồ thị có ít nhất một đoạn xe dừng và đi hết máng.",done:()=>S.g.hadStop&&S.g.finished}],
  obs:[{id:"a",q:"Đồng hồ đo thời gian hiện số ở chế độ A ↔ B đo:",opts:[["ok","Thời gian xe đi từ cổng A tới cổng B"],["tong","Toàn bộ thời gian xe chạy"],["1","Thời gian tấm chắn đi qua một cổng"]],ans:"ok",why:"Vì vậy cần đo chính xác khoảng cách s giữa hai cổng."},
    {id:"b",q:"Trên đồ thị s – t, đoạn thẳng càng dốc thì:",opts:[["ok","Tốc độ càng lớn"],["nho","Tốc độ càng nhỏ"],["k","Không liên quan tới tốc độ"]],ans:"ok",why:"Tốc độ bằng quãng đường đi được trong một đơn vị thời gian."},
    {id:"c",q:"Ưu điểm của cổng quang điện so với đồng hồ bấm giây:",opts:[["ok","Loại bỏ sai số do phản xạ của người bấm, đo được khoảng thời gian rất ngắn"],["re","Rẻ hơn"],["k","Không cần đo quãng đường"]],ans:"ok",why:"Thời gian phản ứng của người khoảng vài phần mười giây."}],
  concl:{html:`<ul class="tlist"><li><b>Tốc độ</b> cho biết mức độ nhanh hay chậm của chuyển động: v = s / t; đơn vị m/s hoặc km/h.</li>
    <li>Đo tốc độ bằng <b>cổng quang điện</b> và đồng hồ đo thời gian hiện số: đo khoảng cách s giữa hai cổng, đọc thời gian t (chế độ A ↔ B), tính v = s / t.</li>
    <li><b>Đồ thị quãng đường – thời gian</b>: chuyển động đều có đồ thị là đường thẳng xiên; vật đứng yên có đồ thị là đoạn nằm ngang. Từ đồ thị có thể đọc quãng đường, thời gian và tính tốc độ.</li></ul>`,
    quiz:[{id:"q1",q:"Một người đi xe đạp được 6 km trong 0,5 h. Tốc độ là:",opts:[["a","12 km/h"],["b","3 km/h"],["c","6,5 km/h"]],ans:"a",why:{b:"v = s / t = 6 : 0,5 = 12 km/h.",c:"Không cộng s với t."}},
      {id:"q2",q:"0,5 m/s bằng bao nhiêu km/h?",opts:[["a","1,8 km/h"],["b","0,5 km/h"],["c","5 km/h"]],ans:"a",why:{b:"1 m/s = 3,6 km/h → 0,5 × 3,6 = 1,8.",c:"0,5 × 3,6 = 1,8 km/h."}}],
    done:`<h2>Hoàn thành: đo tốc độ, đồ thị s – t</h2><p class="muted">v = s / t; đồ thị s – t của chuyển động đều là đường thẳng xiên.</p>`},
  gv:["Cho mỗi nhóm đo ở 3 khoảng cách khác nhau, so sánh tốc độ.","Hỏi: vì sao tốc độ đo ở đoạn sau thường nhỏ hơn một chút? (lực cản)","Dùng đồ thị để tính tốc độ ở từng đoạn."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 9, 10)</p><ul class="tlist"><li>Mô tả được sơ lược cách đo tốc độ bằng đồng hồ bấm giây và cổng quang điện; vẽ được đồ thị quãng đường – thời gian cho chuyển động thẳng; từ đồ thị xác định được tốc độ, quãng đường, thời gian.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 9 Đo tốc độ; Bài 10 Đồ thị quãng đường – thời gian.</li>
<li>Tốc độ trung bình, đồ thị vị trí – thời gian: <a href="https://openstax.org/books/physics/pages/2-3-position-vs-time-graphs" target="_blank" rel="noopener">OpenStax Physics, mục 2.3</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Xe lăn chịu lực cản nhỏ, giảm tốc đều 0,04 m/s²; tốc độ đầu ứng với ba mức đẩy là 0,40; 0,60; 0,80 m/s. Xe chạy pin chuyển động đều 0,15 m/s. Đồng hồ hiện số làm tròn tới 0,001 s.</li></ul>`;

let S;
LabKHTN.register("K7-L-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"s",t:"s (m)"},{k:"t",t:"t (s)"},{k:"v",t:"v = s/t (m/s)"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D đo tốc độ bằng cổng quang điện",legend:{w:290},bench:[2.4,1.0],seed:7,
      views:{cong:{t:[.02,.06,-.1],yaw:.12,pitch:.4,rad:.68,label:"Cổng quang",icon:IC.eye},dt:{t:[.02,.05,0],yaw:-.1,pitch:.42,rad:.68,label:"Đồ thị s – t",icon:IC.grid}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={s:.5,push:1,run:null,meas:[],g:{run:false,x:0,t:0,go:true,pts:[[0,0]],hadStop:false,finished:false},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const texM=(tex,o)=>Object.assign({type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}},o||{});
    const metal={color:"#C9CED4",metal:.85,rough:.28};
    /* ---------- máng nhôm có thước ---------- */
    const TL=1.4;root.add(R.mesh(G.box(TL,.02,.09,.004,2),metal)).pos=[0,.01,0];
    for(const z of [-.04,.04])root.add(R.mesh(G.box(TL,.018,.006,.002,2),metal)).pos=[0,.028,z];
    const rc=document.createElement("canvas");rc.width=2048;rc.height=64;{const g=rc.getContext("2d");g.fillStyle="#F8F3E1";g.fillRect(0,0,2048,64);g.fillStyle="#111";
      for(let mm=0;mm<=1300;mm+=10){const x=(mm+50)/1400*2048;const L=mm%100===0?40:mm%50===0?28:16;g.fillRect(x-1,0,2,L);if(mm%100===0){g.font="700 20px system-ui";g.textAlign="center";g.fillText(String(mm/10),x,60)}}}
    const ruler=root.add(R.mesh(G.plane(TL,.03),texM(R.tex2D(rc))));ruler.quat=Q.euler(-Math.PI/2+.0,0,0);ruler.pos=[0,.0201,.0455];ruler.quat=Q.euler(Math.PI/2,0,0);ruler.pos=[0,.012,.0452];
    /* đầu máng: lò xo bắn xe, đầu cuối: tấm chặn */
    root.add(R.mesh(G.box(.02,.06,.09,.004,2),{color:"#374151",rough:.5})).pos=[-.7,.05,0];
    const spring=root.add(R.mesh(G.tube(Array.from({length:60},(_,i)=>[-.69+i*.0008,.05+Math.sin(i*.9)*.012,Math.cos(i*.9)*.012]),.0018,6),metal));
    root.add(R.mesh(G.box(.02,.06,.09,.004,2),{color:"#374151",rough:.5})).pos=[.7,.05,0];
    /* ---------- xe lăn ---------- */
    const cart=root.add(new G.Node());cart.add(R.mesh(G.box(.12,.035,.07,.008,3),{color:"#1D4ED8",rough:.4,coat:.4})).pos=[0,.058,0];
    const wheels=[];for(const x of [-.04,.04])for(const z of [-.04,.04]){const w=cart.add(R.mesh(G.cylinder(.012,.008,18),{color:"#111827",rough:.6}));w.quat=Q.euler(Math.PI/2,0,0);w.pos=[x,.04,z+(z>0?-.004:.004)];wheels.push(w)}
    cart.add(R.mesh(G.box(.004,.05,.03,.001,1),{color:"#111827",rough:.6})).pos=[0,.1,0];   /* tấm chắn sáng */
    cart.pos=[X0,0,0];
    /* ---------- cổng quang ---------- */
    function gate(){const n=root.add(new G.Node());const col={color:"#111827",rough:.5};
      for(const z of [-.075,.075])n.add(R.mesh(G.box(.025,.15,.02,.004,2),col)).pos=[0,.075,z];n.add(R.mesh(G.box(.025,.02,.17,.004,2),col)).pos=[0,.16,0];
      n.add(R.mesh(G.box(.06,.012,.2,.003,2),{color:"#374151",rough:.5})).pos=[0,.006,0];
      const led=n.add(R.mesh(G.sphere(.006,10,8),{type:"unlit",color:"#7F1D1D"}));led.pos=[.014,.15,.075];
      const beam=n.add(R.mesh(G.cylinder(.0012,.15,6,false),{type:"unlit",color:"#F87171",alpha:.35,transparent:true}));beam.quat=Q.euler(Math.PI/2,0,0);beam.pos=[0,.1,-.075];
      return{n,led,beam}}
    const GA=gate(),GB=gate();
    /* ---------- đồng hồ hiện số ---------- */
    const tm=root.add(new G.Node());tm.pos=[.1,0,-.36];tm.add(R.mesh(G.box(.26,.1,.16,.012,3),{color:"#E5E7EB",rough:.5})).pos=[0,.05,0];
    const lc=document.createElement("canvas");lc.width=384;lc.height=128;const lt=R.tex2D(lc);let lastL="";
    function lcdSet(txt,mode){const k=txt+mode;if(k===lastL)return;lastL=k;const g=lc.getContext("2d");g.fillStyle="#9DB59A";g.fillRect(0,0,384,128);g.fillStyle="#1C2A1C";g.font="700 72px 'Courier New',monospace";g.textAlign="right";g.fillText(txt,330,90);g.font="700 30px system-ui";g.fillText("s",370,90);g.textAlign="left";g.font="700 22px system-ui";g.fillText(mode,12,28);lt.update(lc)}
    const scr=tm.add(R.mesh(G.plane(.19,.063),texM(lt)));scr.quat=Q.euler(Math.PI/2*0,0,0);scr.pos=[0,.1005,-.01];
    lcdSet("0.000","MODE A↔B");
    /* dây nối */
    let cables=[];
    function wire(a,b){const m=V3.lerp(a,b,.5);m[1]=-.0;const pts=G.spline([a,[a[0],.005,a[2]-.08],m,[b[0],.005,b[2]+.06],b],6);return root.add(R.mesh(G.tube(pts,.003,6),{color:"#1F2937",rough:.6}))}
    function placeGates(){const xa=X0+.18,xb=xa+S.s;GA.n.pos=[xa,0,0];GB.n.pos=[xb,0,0];for(const c of cables)root.remove(c);cables=[wire([xa,.005,-.1],[.03,.03,-.29]),wire([xb,.005,-.1],[.17,.03,-.29])]}
    placeGates();
    /* ---------- chạy ---------- */
    const V0=[.4,.6,.8];
    function release(){if(S.run)return;cart.pos=[X0,0,0];S.run={x:X0,v:V0[S.push],tA:null,tB:null,t:0};lcdSet("0.000","MODE A↔B")}
    const xa=()=>X0+.18,xb=()=>X0+.18+S.s;
    K.onFrame(dt=>{const v=K.view;GA.n.visible=GB.n.visible=v==="cong";for(const c of cables)c.visible=v==="cong";
      if(v==="cong"){const r=S.run;if(r){const sub=8;for(let i=0;i<sub;i++){const h=dt/sub;r.t+=h;const vv=Math.max(0,r.v-DEC*h);r.x+=(r.v+vv)/2*h;r.v=vv;
            if(r.tA==null&&r.x>=xa())r.tA=r.t-(r.x-xa())/Math.max(r.v,1e-6);if(r.tB==null&&r.x>=xb()){r.tB=r.t-(r.x-xb())/Math.max(r.v,1e-6);const T=r.tB-r.tA;lcdSet(T.toFixed(3),"MODE A↔B");
              S.meas.push({s:S.s,t:+T.toFixed(3)});const vv2=S.s/+T.toFixed(3);api.record({lan:String(S.meas.length),s:fmt(S.s,2),t:fmt(+T.toFixed(3),3),v:fmt(vv2,3)});refresh()}
            if(r.x>=.62||r.v<=0){r.x=Math.min(r.x,.62);S.run=null;break}}
          if(r.tA!=null&&r.tB==null)lcdSet((r.t-r.tA).toFixed(3),"MODE A↔B");cart.pos=[r.x,0,0];wheels.forEach(w=>w.quat=Q.mul(Q.euler(Math.PI/2,0,0),Q.euler(0,-r.x/.012,0)))}
        const blk=g=>Math.abs(cart.pos[0]-g.n.pos[0])<.003;for(const g of [GA,GB]){const b=blk(g);g.led.mat.color=b?G.hex("#F87171"):G.hex("#7F1D1D");g.beam.visible=!b}
        spring.scl=[S.run&&S.run.t<.15?.4:1,1,1]}
      else{const g=S.g;if(g.run){if(g.go&&!g.finished){g.x+=.15*dt;if(g.x>=1.2){g.x=1.2;g.finished=true;g.run=false;refresh();api.record({lan:"đồ thị",s:fmt(g.x,2),t:fmt(g.t,1),v:"xem đồ thị"})}}g.t+=dt;const last=g.pts[g.pts.length-1];if(g.t-last[0]>=.1)g.pts.push([+g.t.toFixed(2),+g.x.toFixed(3)])}
        cart.pos=[X0+g.x,0,0]}});
    K.dockFn(()=>{if(K.view==="cong")return[{grid:[.3,.5,.7,.9].map(s=>({k:"s",v:String(s),label:`s = ${fmt(s,1)} m`,icon:"",on:Math.abs(S.s-s)<1e-6,dis:!!S.run}))},
        {seg:[0,1,2].map(i=>({k:"push",v:String(i),label:["Nhẹ","Vừa","Mạnh"][i],icon:"",on:S.push===i})),label:"Mức đẩy"},{k:"go",label:"Thả xe",icon:IC.play,dis:!!S.run},{k:"back",label:"Đưa xe về đầu máng",icon:IC.reset,dis:!!S.run}];
      const g=S.g;return[{k:"grun",label:g.finished?"Xe đã tới cuối máng":g.run?"Đang chạy":"Bật xe",icon:IC.play,dis:g.run||g.finished},{k:"gtog",label:g.go?"Dừng xe":"Cho xe chạy tiếp",icon:IC.step,dis:!g.run},{k:"grs",label:"Làm lại đồ thị",icon:IC.reset}]});
    K.onDock((k,v)=>{if(k==="s"){S.s=+v;placeGates()}else if(k==="push")S.push=+v;else if(k==="go")release();else if(k==="back"){cart.pos=[X0,0,0];lcdSet("0.000","MODE A↔B")}
      else if(k==="grun"){S.g.run=true;S.g.go=true}else if(k==="gtog"){S.g.go=!S.g.go;if(!S.g.go)S.g.hadStop=true}else if(k==="grs")S.g={run:false,x:0,t:0,go:true,pts:[[0,0]],hadStop:false,finished:false};refresh()});
    function svgChart(){const g=S.g,W=250,H=150,tm=Math.max(10,g.t),pad=28;const px=t=>pad+t/tm*(W-pad-6),py=s=>H-20-s/1.2*(H-30);
      const pts=g.pts.concat(g.run?[[g.t,g.x]]:[]).map(p=>`${px(p[0]).toFixed(1)},${py(p[1]).toFixed(1)}`).join(" ");
      let ax=`<line x1="${pad}" y1="${H-20}" x2="${W-4}" y2="${H-20}" stroke="currentColor" opacity=".5"/><line x1="${pad}" y1="8" x2="${pad}" y2="${H-20}" stroke="currentColor" opacity=".5"/>`;
      for(let s=0;s<=1.2;s+=.4)ax+=`<text x="${pad-4}" y="${py(s)+4}" font-size="9" text-anchor="end" fill="currentColor">${fmt(s,1)}</text>`;for(let t=0;t<=tm;t+=Math.ceil(tm/5))ax+=`<text x="${px(t)}" y="${H-6}" font-size="9" text-anchor="middle" fill="currentColor">${t}</text>`;
      return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:${W}px;display:block;margin-top:4px">${ax}<text x="${pad+2}" y="12" font-size="9" fill="currentColor">s (m)</text><text x="${W-4}" y="${H-24}" font-size="9" text-anchor="end" fill="currentColor">t (s)</text><polyline points="${pts}" fill="none" stroke="#F59E0B" stroke-width="2.2"/></svg>`}
    K.infoFn(()=>{if(K.view==="cong"){const m=S.meas[S.meas.length-1];return `<div><b>Cổng quang điện</b> · s = ${fmt(S.s,2)} m</div><div>Mức đẩy: ${["nhẹ","vừa","mạnh"][S.push]}</div><div>Đồng hồ: <b>${lastL.slice(0,5)} s</b></div>${m?`<div>Lần ${S.meas.length}: t = ${fmt(m.t,3)} s → v = s / t = ${fmt(m.s/m.t,3)} m/s</div>`:"<small>Bấm “Thả xe”.</small>"}`}
      const g=S.g;return `<div><b>Đồ thị quãng đường – thời gian</b></div><div>t = ${fmt(g.t,1)} s · s = ${fmt(g.x,2)} m ${g.run?(g.go?"· đang chạy":"· đang dừng"):""}</div>${svgChart()}`});
    K.label("Cổng quang A",()=>V3.add(GA.n.pos,[0,.17,0]),{view:"cong",dir:"n",len:20});K.label("Cổng quang B",()=>V3.add(GB.n.pos,[0,.17,0]),{view:"cong",dir:"n",len:20});
    K.label("Đồng hồ đo thời gian hiện số",[.1,.1,-.36],{view:"cong",dir:"ne",len:30});K.label("Tấm chắn sáng",()=>V3.add(cart.pos,[0,.125,0]),{view:"cong",dir:"nw",len:40});
    K.label("Xe lăn",()=>V3.add(cart.pos,[-.06,.06,.035]),{view:["cong","dt"],dir:"sw",len:30});K.label("Thước đo (cm)",[.3,.012,.046],{view:["cong","dt"],dir:"s",len:30});
    let tick=0;K.onFrame(dt=>{tick+=dt;if(tick>.2&&(K.view==="dt"||S.run)){tick=0;K.updateInfo(true)}});
    K.timeLabel(()=>K.view==="cong"?(S.run?`t = ${fmt(S.run.t,2)} s`:"Cổng quang"):`t = ${fmt(S.g.t,1)} s`);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"go",p:()=>V3.add(cart.pos,[0,.09,0]),tip:"Chạm vào xe để thả xe",view:"cong"},{k:"grun",p:()=>V3.add(cart.pos,[0,.09,0]),tip:"Chạm vào xe để bật xe",view:"dt"},{k:"gtog",p:()=>V3.add(cart.pos,[0,.09,0]),tip:S.g.go?"Chạm để dừng xe":"Chạm để cho xe chạy tiếp",view:"dt"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){const go=(s,p)=>{S.s=s;placeGates();S.push=p;S.run=null;release();let tt=0;while(S.run&&tt<10){K._step?K._step(.02):null;tt+=.02;const r=S.run;r.t+=.02;const vv=Math.max(0,r.v-DEC*.02);r.x+=(r.v+vv)/2*.02;r.v=vv;if(r.tA==null&&r.x>=xa())r.tA=r.t;if(r.tB==null&&r.x>=xb()){r.tB=r.t;const T=r.tB-r.tA;S.meas.push({s,t:+T.toFixed(3)});api.record({lan:String(S.meas.length),s:fmt(s,2),t:fmt(+T.toFixed(3),3),v:fmt(s/+T.toFixed(3),3)});S.run=null}}};
      go(.3,0);go(.5,1);go(.9,2);S.g.hadStop=true;S.g.finished=true;refresh()}};
    return K.mount(st)}
});
})();
