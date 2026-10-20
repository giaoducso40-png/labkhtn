/* K7-S-03 · Hô hấp tế bào ở hạt nảy mầm (SGK KHTN 7 – Kết nối tri thức, Bài 27) · 3D
   So sánh hạt đang nảy mầm (bình A) với hạt đã luộc chín – không còn sống (bình B, đối chứng):
   1. Hô hấp thải khí carbon dioxide: cốc nước vôi trong đặt cạnh hạt trong bình kín; sau vài giờ, nước vôi trong ở bình A vẩn đục, có váng trắng.
   2. Hô hấp lấy khí oxygen: mở nắp, đưa ngọn nến đang cháy vào bình; nến ở bình A tắt nhanh, ở bình B vẫn cháy.
   3. Hô hấp tỏa nhiệt: nhiệt kế trong bình giữ nhiệt chứa hạt; nhiệt độ bình A tăng, bình B gần như không đổi.
   Phương trình chữ: Glucose + Oxygen → Carbon dioxide + Nước + Năng lượng (ATP và nhiệt). */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt,H=G.hex;
const T0=25,DT=6;   /* giả định của mô hình: nhiệt độ bình A tăng khoảng 6 °C sau 24 giờ */
const SPEC={
  predict:[{id:"p1",q:"Sau vài giờ, cốc nước vôi trong đặt cùng hạt đang nảy mầm trong bình kín sẽ:",opts:[["duc","Vẩn đục"],["trong","Vẫn trong"],["xanh","Chuyển xanh"]],ans:"duc",res:"Kết quả: hạt nảy mầm hô hấp thải khí carbon dioxide làm nước vôi trong vẩn đục."},
    {id:"p2",q:"Đưa nến đang cháy vào bình chứa hạt nảy mầm (đậy kín vài giờ), nến sẽ:",opts:[["tat","Tắt nhanh"],["sang","Cháy sáng hơn"],["k","Cháy bình thường"]],ans:"tat",res:"Kết quả: hạt hô hấp đã lấy oxygen trong bình nên nến tắt."}],
  taskLead:"Chọn thí nghiệm ở khay. Bấm “Để … giờ” để thời gian trôi qua, rồi làm bước kiểm tra và so sánh bình A (hạt nảy mầm) với bình B (hạt đã luộc chín).",
  tasks:[{html:"<b>Carbon dioxide:</b> quan sát nước vôi trong ở hai bình.",done:()=>!!S.done.co2},{html:"<b>Oxygen:</b> thử bằng ngọn nến ở hai bình.",done:()=>!!S.done.o2},{html:"<b>Nhiệt:</b> đo nhiệt độ hai bình sau 24 giờ.",done:()=>!!S.done.nh}],
  obs:[{id:"a",q:"Vì sao cần bình B chứa hạt đã luộc chín?",opts:[["ok","Làm đối chứng: hạt chết không hô hấp, để so sánh"],["nhieu","Để có nhiều hạt hơn"],["k","Không cần thiết"]],ans:"ok",why:"Chỉ khác nhau ở một yếu tố: hạt sống hay chết."},
    {id:"b",q:"Nước vôi trong vẩn đục chứng tỏ có khí:",opts:[["co2","Carbon dioxide"],["o2","Oxygen"],["n2","Nitrogen"]],ans:"co2",why:"Carbon dioxide tác dụng với nước vôi trong tạo chất không tan (calcium carbonate)."},
    {id:"c",q:"Nhiệt độ bình A tăng chứng tỏ:",opts:[["ok","Hô hấp giải phóng năng lượng, một phần dưới dạng nhiệt"],["mt","Bình bị nắng chiếu"],["k","Hạt hút nhiệt"]],ans:"ok",why:"Một phần năng lượng giải phóng ra từ hô hấp được dùng cho hoạt động sống, phần còn lại tỏa ra dưới dạng nhiệt."}],
  concl:{html:`<ul class="tlist"><li><b>Hô hấp tế bào</b> là quá trình phân giải chất hữu cơ (glucose) với sự tham gia của oxygen, tạo ra carbon dioxide, nước và giải phóng năng lượng.</li>
    <li>Phương trình chữ: Glucose + Oxygen → Carbon dioxide + Nước + Năng lượng (ATP + nhiệt).</li>
    <li>Hạt đang nảy mầm hô hấp mạnh: lấy oxygen (nến tắt), thải carbon dioxide (nước vôi trong vẩn đục) và tỏa nhiệt (nhiệt độ tăng). Hạt đã chết không hô hấp.</li>
    <li>Ứng dụng: bảo quản hạt giống, nông sản ở nơi khô, mát, thoáng hoặc làm giảm hô hấp (sấy khô, bảo quản lạnh).</li></ul>`,
    quiz:[{id:"q1",q:"Để bảo quản hạt giống lâu, cần:",opts:[["a","Phơi khô, để nơi khô ráo, thoáng mát"],["b","Ngâm nước"],["c","Để nơi ấm và ẩm"]],ans:"a",why:{b:"Hạt ngậm nước hô hấp mạnh, nhanh hỏng.",c:"Nhiệt độ, độ ẩm cao làm tăng hô hấp."}},
      {id:"q2",q:"Sản phẩm của hô hấp tế bào là:",opts:[["a","Carbon dioxide, nước và năng lượng"],["b","Glucose và oxygen"],["c","Tinh bột"]],ans:"a",why:{b:"Đó là sản phẩm của quang hợp.",c:"Tinh bột là chất hữu cơ dự trữ, bị phân giải trong hô hấp."}}],
    done:`<h2>Hoàn thành: hô hấp ở hạt nảy mầm</h2><p class="muted">Hô hấp lấy oxygen, thải carbon dioxide và tỏa nhiệt.</p>`},
  gv:["Chuẩn bị hạt đỗ xanh ngâm ủ 1 – 2 ngày cho nảy mầm; hạt đối chứng luộc chín để nguội.","Hỏi: vì sao phải đậy kín bình?","Liên hệ: không nên để nhiều cây xanh trong phòng ngủ đóng kín vào ban đêm."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 27)</p><ul class="tlist"><li>Tiến hành được thí nghiệm về hô hấp tế bào ở thực vật thông qua sự nảy mầm của hạt; nêu được khái niệm, nguyên liệu, sản phẩm của hô hấp tế bào; viết được phương trình hô hấp dạng chữ.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 27 Thực hành: Hô hấp ở thực vật.</li>
<li>Hô hấp tế bào (nguyên liệu, sản phẩm, năng lượng tỏa nhiệt): <a href="https://openstax.org/books/biology-2e/pages/7-1-energy-in-living-systems" target="_blank" rel="noopener">OpenStax Biology 2e, chương 7</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thời gian được rút ngắn. Mức tăng nhiệt độ bình A (khoảng 6 °C sau 24 giờ, từ 25 °C) là số minh họa xu hướng, không phải số đo; mức thực tế phụ thuộc loại hạt, lượng hạt và độ cách nhiệt của bình.</li></ul>`;

let S;
LabKHTN.register("K7-S-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tn",t:"Thí nghiệm"},{k:"a",t:"Bình A (hạt nảy mầm)"},{k:"b",t:"Bình B (hạt đã luộc)"},{k:"kl",t:"Kết luận"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D hô hấp ở hạt nảy mầm",legend:{w:290},bench:[14,3.2],seed:4,
      views:{co2:{t:[-4,.6,0],yaw:.1,pitch:.25,rad:1.45,label:"Thải CO₂",icon:IC.beaker},o2:{t:[0,.7,0],yaw:.1,pitch:.25,rad:1.45,label:"Lấy O₂",icon:IC.fire},nh:{t:[4,.6,0],yaw:.1,pitch:.25,rad:1.4,label:"Tỏa nhiệt",icon:IC.thermo}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={co2:{t:0,run:false},o2:{t:0,run:false,c:0},nh:{t:0,run:false},done:{},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const ease=t=>t*t*(3-2*t);
    /* ---------- hạt (gộp thành một lưới) ---------- */
    const qrot=(q,v)=>{const t=V3.scale(V3.cross([q[0],q[1],q[2]],v),2);return V3.add(V3.add(v,V3.scale(t,q[3])),V3.cross([q[0],q[1],q[2]],t))};
    function xform(g,p,s,q){const P=Array.from(g.pos),N=Array.from(g.nrm);
      for(let i=0;i<P.length;i+=3){const v=qrot(q,[P[i]*s[0],P[i+1]*s[1],P[i+2]*s[2]]);P[i]=v[0]+p[0];P[i+1]=v[1]+p[1];P[i+2]=v[2]+p[2];const n=V3.norm(qrot(q,[N[i]/s[0],N[i+1]/s[1],N[i+2]/s[2]]));N[i]=n[0];N[i+1]=n[1];N[i+2]=n[2]}
      return{pos:new Float32Array(P),nrm:new Float32Array(N),idx:g.idx,col:null,uv:g.uv}}
    const seedG=G.sphere(1,12,8);
    function seeds(sprout,r){const rnd=(()=>{let s=sprout?11:29;return()=>{s=(s*16807)%2147483647;return s/2147483647}})();const L=[],Lr=[];
      for(let i=0;i<70;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*r;const p=[Math.cos(a)*d,.02+rnd()*.06,Math.sin(a)*d];const q=Q.euler(rnd()*3,rnd()*3,rnd()*3);L.push(xform(seedG,p,[.045,.032,.032],q));
        if(sprout&&rnd()<.8){const dir=V3.norm([rnd()-.5,rnd()*.4,rnd()-.5]);const pts=[p,V3.add(p,V3.scale(dir,.05)),V3.add(p,V3.add(V3.scale(dir,.1),[0,-.02,0]))];Lr.push(G.tube(G.spline(pts,3),.006,5))}}
      const n=new G.Node();n.add(R.mesh(G.merge(L),{color:sprout?"#65A30D":"#A3A355",rough:.55,coat:.2}));if(Lr.length)n.add(R.mesh(G.merge(Lr),{color:"#F5F5DC",rough:.6}));return n}
    /* ---------- dụng cụ ---------- */
    const tag=(par,txt,pos)=>{const c=document.createElement("canvas");c.width=128;c.height=128;const g=c.getContext("2d");g.fillStyle="#FFFFFF";g.beginPath();g.arc(64,64,60,0,6.283);g.fill();g.fillStyle="#111827";g.font="900 80px system-ui";g.textAlign="center";g.fillText(txt,64,92);
      const m=par.add(R.mesh(G.plane(.16,.16),{type:"unlit",color:"#FFFFFF",key:"tag",hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.5)discard;base.rgb=c.rgb;}"},textures:{uTex:R.tex2D(c)}}));m.pos=pos;m.quat=Q.euler(Math.PI/2,0,0)};
    /* 1. CO2: chuông thủy tinh úp trên đĩa, trong có hạt và cốc nước vôi trong */
    const CO=[];for(const [x,live] of [[-4.6,true],[-3.4,false]]){const n=root.add(new G.Node());n.pos=[x,0,0];
      n.add(R.mesh(G.cylinder(.5,.03,40),{color:"#E5E7EB",rough:.4}));const sd=seeds(live,.32);sd.pos=[-.08,.03,0];n.add(sd);
      const cup=n.add(K3.glass(R,.11,.22));cup.pos=[.22,.03,.12];const lw=n.add(K3.liquid(R,.1,.05,.2,H("#E0F2FE"),.3));lw.pos=[.22,0,.12];const film=n.add(R.mesh(G.cylinder(.098,.004,24),{color:"#FFFFFF",alpha:0,transparent:true,rough:.6}));film.pos=[.22,.2,.12];
      const bell=n.add(R.mesh(G.lathe([[.46,0],[.46,.55],[.4,.75],[.2,.85],[.06,.88],[.06,.98],[0,.98]],48),{type:"glass",color:"#E0F2FE",alpha:.32,side:"double"}));bell.pos=[0,.03,0];
      tag(n,live?"A":"B",[0,.04,.5]);CO.push({n,lw,film,live})}
    /* 2. O2: lọ thủy tinh có nắp, hạt ở đáy; nến gắn que */
    const OJ=[];for(const [x,live] of [[-.6,true],[.6,false]]){const n=root.add(new G.Node());n.pos=[x,0,0];const jar=n.add(K3.glass(R,.3,.9));const sd=seeds(live,.24);sd.pos=[0,.03,0];n.add(sd);
      const lid=n.add(R.mesh(G.cylinder(.33,.05,36),{color:"#9CA3AF",metal:.5,rough:.4}));lid.pos=[0,.92,0];
      const cand=n.add(new G.Node());cand.add(R.mesh(G.cylinder(.004,.6,6),{color:"#9CA3AF",metal:.8,rough:.3})).pos=[0,.12,0];cand.add(R.mesh(G.cylinder(.04,.12,16),{color:"#FAFAF9",rough:.6}));const fl=cand.add(K3.flame(R,[1,.6,.15],[1,.95,.75]));fl.pos=[0,.13,0];fl.scl=[.45,.45,.45];
      cand.pos=[0,1.6,0];tag(n,live?"A":"B",[0,.04,.32]);OJ.push({n,lid,cand,fl,live})}
    /* 3. nhiệt: bình giữ nhiệt + nhiệt kế */
    const TH=[];for(const [x,live] of [[3.5,true],[4.5,false]]){const n=root.add(new G.Node());n.pos=[x,0,0];
      n.add(R.mesh(G.lathe([[0,0],[.26,0],[.28,.05],[.28,.85],[.22,.95],[.12,.98],[.12,1.02],[0,1.02]],40),{color:"#CBD5E1",metal:.9,rough:.25}));n.add(R.mesh(G.cylinder(.13,.08,24),{color:"#7C2D12",rough:.9})).pos=[0,1.02,0];
      const tm=n.add(new G.Node());tm.pos=[0,.6,0];tm.add(R.mesh(G.cylinder(.025,1.1,14),{type:"glass",color:"#F8FAFC",alpha:.5}));tm.add(R.mesh(G.sphere(.034,14,10),{color:"#DC2626",rough:.3}));const col=tm.add(R.mesh(G.cylinder(.009,1,8),{color:"#DC2626",rough:.3}));col.pos=[0,.02,0];
      const sc=document.createElement("canvas");sc.width=64;sc.height=512;const g=sc.getContext("2d");g.fillStyle="#FFFFFF";g.fillRect(0,0,64,512);g.fillStyle="#111";g.font="700 20px system-ui";for(let t=20;t<=40;t+=1){const y=512-((t-20)/20*460+30);g.fillRect(0,y,t%5===0?26:14,2);if(t%5===0)g.fillText(String(t),30,y+7)}
      const vpl=G.plane(.05,.42);const P=vpl.pos,N=vpl.nrm;for(let i=0;i<P.length;i+=3){const px=P[i],pz=P[i+2];P[i]=px;P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}
      const scm=tm.add(R.mesh(vpl,{type:"unlit",color:"#FFFFFF",key:"scale",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:R.tex2D(sc)}}));scm.pos=[.05,.72,.0];
      tag(n,live?"A":"B",[0,.04,.3]);TH.push({n,col,live})}
    const tempOf=(th,t)=>T0+(th.live?DT*ease(t):.2*t);
    /* thang đo nhiệt kế: 20 °C ở y = 0,5·(30/512)… ánh xạ theo canvas */
    const yOf=T=>{const v=((T-20)/20*460+30)/512;return .51+(v-.5)*.42};
    let tk=0;K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}
      for(const k of ["co2","o2","nh"]){const P=S[k];if(P.run){P.t=Math.min(1,P.t+dt/3);if(P.t>=1){P.run=false;refresh()}}}
      for(const c of CO){const k=c.live?ease(S.co2.t):0;c.lw.mat.color=H(c.live&&k>.3?"#F1F5F9":"#E0F2FE");c.lw.mat.alpha=.3+.55*k;c.film.mat.alpha=.85*k}
      const O=S.o2;for(const j of OJ){if(O.c>0){const e=ease(Math.min(1,O.c*2));j.lid.pos=[0,.92*(1-e)+.025*e+.4*Math.sin(Math.PI*e),-.66*e];const d=ease(C.clamp(O.c*2-.6,0,1));j.cand.pos=[0,1.6-.95*d,0];
          const out=j.live&&O.c>.8;const s=out?Math.max(0,.45*(1-(O.c-.8)/.2)):.45;j.fl.scl=[s,s,s];j.fl.visible=s>.01}else{j.lid.pos=[0,.92,0];j.cand.pos=[0,1.6,0];j.fl.scl=[.45,.45,.45];j.fl.visible=true}}
      if(O.c>0&&O.c<1){O.c=Math.min(1,O.c+dt/3.2);if(O.c>=1&&!S.done.o2){S.done.o2=1;api.record({tn:"Đưa nến đang cháy vào bình",a:"nến tắt nhanh",b:"nến vẫn cháy",kl:"hạt nảy mầm hô hấp lấy khí oxygen"});refresh()}}
      for(const th of TH){const T=tempOf(th,S.nh.t);const top=yOf(T);th.col.scl=[1,Math.max(.02,top-.02),1]}});
    K.dockFn(()=>{const v=K.view;if(v==="co2"){const P=S.co2;return[{k:"run",v:"co2",label:P.t>=1?"Đã để 2 giờ":"Đậy kín, để 2 giờ",icon:IC.play,dis:P.run||P.t>=1},{k:"chk",v:"co2",label:"Quan sát nước vôi trong",icon:IC.eye,dis:P.t<1||!!S.done.co2},{k:"rs",v:"co2",label:"Làm lại",icon:IC.reset}]}
      if(v==="o2"){const P=S.o2;return[{k:"run",v:"o2",label:P.t>=1?"Đã để 2 giờ":"Đậy kín, để 2 giờ",icon:IC.play,dis:P.run||P.t>=1},{k:"cand",label:"Mở nắp, đưa nến đang cháy vào",icon:IC.fire,dis:P.t<1||P.c>0},{k:"rs",v:"o2",label:"Làm lại",icon:IC.reset}]}
      const P=S.nh;return[{k:"run",v:"nh",label:P.t>=1?"Đã để 24 giờ":"Để 24 giờ",icon:IC.play,dis:P.run||P.t>=1},{k:"chk",v:"nh",label:"Đọc nhiệt kế",icon:IC.thermo,dis:P.t<1||!!S.done.nh},{k:"rs",v:"nh",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{if(k==="run"){S[v].run=true}else if(k==="cand"){S.o2.c=.001}
      else if(k==="chk"){if(v==="co2"&&!S.done.co2){S.done.co2=1;api.record({tn:"Nước vôi trong trong bình kín (2 giờ)",a:"vẩn đục, có váng trắng trên mặt",b:"vẫn trong",kl:"hạt nảy mầm hô hấp thải khí carbon dioxide"})}
        if(v==="nh"&&!S.done.nh){S.done.nh=1;api.record({tn:"Nhiệt độ trong bình giữ nhiệt (24 giờ)",a:`${fmt(tempOf(TH[0],1),1)} °C (ban đầu ${T0} °C)`,b:`${fmt(tempOf(TH[1],1),1)} °C`,kl:"hô hấp tỏa nhiệt"})}}
      else if(k==="rs"){S[v]=v==="o2"?{t:0,run:false,c:0}:{t:0,run:false}}refresh()});
    K.label("Nước vôi trong",[-4.6+.22,.25,.12],{view:"co2",dir:"ne",len:40});K.label("Hạt đang nảy mầm",[-4.68,.1,0],{view:"co2",dir:"sw",len:40});K.label("Hạt đã luộc chín",[-3.48,.1,0],{view:"co2",dir:"se",len:40});
    K.label("Chuông thủy tinh",[-3.4,.85,0],{view:"co2",dir:"ne",len:30});
    K.label("Ngọn nến",()=>V3.add(OJ[1].n.pos,V3.add(OJ[1].cand.pos,[0,.2,0])),{view:"o2",dir:"ne",len:30});
    K.label("Nhiệt kế",[4.5,1.3,0],{view:"nh",dir:"ne",len:30});K.label("Bình giữ nhiệt",[3.5,.5,.28],{view:"nh",dir:"sw",len:30});
    K.infoFn(()=>{const v=K.view;if(v==="co2"){const P=S.co2;return `<div><b>Hô hấp thải khí carbon dioxide</b></div><div>Thời gian: ${fmt(P.t*2,1)} giờ</div><small>${P.t>=1?"Bình A: nước vôi trong vẩn đục, có váng trắng. Bình B: vẫn trong.":"Bình A: hạt nảy mầm · Bình B: hạt đã luộc chín."}</small>`}
      if(v==="o2"){const P=S.o2;return `<div><b>Hô hấp lấy khí oxygen</b></div><div>Thời gian đậy kín: ${fmt(P.t*2,1)} giờ</div><small>${P.c>=1?"Nến ở bình A tắt nhanh; nến ở bình B vẫn cháy.":"Sau 2 giờ, mở nắp và đưa nến đang cháy vào hai bình."}</small>`}
      const P=S.nh;return `<div><b>Hô hấp tỏa nhiệt</b> · ${fmt(P.t*24,0)} giờ</div><div>Bình A: ${fmt(tempOf(TH[0],P.t),1)} °C · Bình B: ${fmt(tempOf(TH[1],P.t),1)} °C</div><small>Mức tăng nhiệt độ là số minh họa của mô hình.</small>`});
    K.timeLabel(()=>{const v=K.view;const P=S[v];return v==="nh"?`${fmt(P.t*24,0)} giờ`:`${fmt(P.t*2,1)} giờ`});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"run",v:"co2",p:[-3.4,.9,0],tip:"Chạm để đậy kín chuông, để 2 giờ",view:"co2"},{k:"chk",v:"co2",p:[-4.38,.3,.12],tip:"Chạm để quan sát nước vôi trong",view:"co2"},{k:"run",v:"o2",p:()=>V3.add(OJ[1].n.pos,[0,.55,0]),tip:"Chạm để đậy kín bình, để 2 giờ",view:"o2"},{k:"cand",p:()=>V3.add(OJ[1].n.pos,V3.add(OJ[1].cand.pos,[0,.22,0])),tip:"Chạm để mở nắp, đưa nến đang cháy vào",view:"o2"},{k:"run",v:"nh",p:[3.5,.6,.28],tip:"Chạm để bắt đầu, để 24 giờ",view:"nh"},{k:"chk",v:"nh",p:[4.5,1.3,0],tip:"Chạm để đọc nhiệt kế",view:"nh"}]);
    /* trạm */if(K.station){K.station(CO[0].n,'co2');K.station(CO[1].n,'co2');K.station(OJ[0].n,'o2');K.station(OJ[1].n,'o2');K.station(TH[0].n,'nh');K.station(TH[1].n,'nh');}
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.co2.t=1;K._dockH("chk","co2");S.o2.t=1;S.o2.c=.999;S.nh.t=1;K._dockH("chk","nh")}};
    return K.mount(st)}
});
})();
