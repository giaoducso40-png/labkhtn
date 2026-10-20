/* K6-H-03 · Dung dịch, huyền phù, nhũ tương; các yếu tố ảnh hưởng đến lượng chất rắn hòa tan (SGK KHTN 6 – Kết nối tri thức, Bài 15 Chất tinh khiết – Hỗn hợp) · 3D
   1. Ba cốc nước: muối ăn (tan → dung dịch), bột đá vôi (không tan, lơ lửng rồi lắng → huyền phù), dầu ăn (lắc → giọt nhỏ, để yên tách lớp → nhũ tương).
   2. Yếu tố ảnh hưởng đến tốc độ hòa tan của đường: khuấy, nhiệt độ nước, kích thước hạt. Tốc độ trong mô hình là minh họa định tính
      (khuấy ×3, nước nóng ×2,5, hạt nhỏ ×4 so với đối chứng), không phải số đo. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q,H=G.hex;
const fmt=C.fmt;
const FAC={khuay:{t:"Khuấy",A:"Có khuấy",B:"Không khuấy",kA:3,kB:1,kl:"khuấy làm chất rắn hòa tan nhanh hơn"},nhiet:{t:"Nhiệt độ",A:"Nước nóng (60 °C)",B:"Nước nguội (20 °C)",kA:2.5,kB:1,kl:"nước nóng làm chất rắn hòa tan nhanh hơn"},hat:{t:"Kích thước hạt",A:"Đường kính (hạt nhỏ)",B:"Đường viên (hạt to)",kA:4,kB:1,kl:"hạt càng nhỏ, hòa tan càng nhanh"}};
const SPEC={
  predict:[{id:"p1",q:"Cho bột đá vôi vào nước, khuấy đều rồi để yên. Em dự đoán:",opts:[["lang","Bột đá vôi lắng xuống đáy cốc"],["tan","Bột đá vôi tan hết"],["noi","Bột đá vôi nổi lên mặt nước"]],ans:"lang",res:"Kết quả: đá vôi không tan; các hạt lơ lửng làm nước đục, để yên thì lắng xuống."},
    {id:"p2",q:"Hòa tan đường trong nước nóng và nước nguội (cùng lượng, cùng cách khuấy):",opts:[["nong","Nước nóng tan nhanh hơn"],["nguoi","Nước nguội tan nhanh hơn"],["nhu","Như nhau"]],ans:"nong",res:"Kết quả: đường tan trong nước nóng nhanh hơn."}],
  taskLead:"Cho từng chất vào cốc nước, khuấy hoặc lắc, rồi để yên và quan sát. Sau đó so sánh các yếu tố ảnh hưởng đến sự hòa tan.",
  tasks:[{html:"<b>Phân loại hỗn hợp:</b> làm với cả muối ăn, bột đá vôi và dầu ăn.",done:()=>Object.keys(S.ph.done).length>=3},{html:"<b>Yếu tố ảnh hưởng:</b> so sánh cả ba yếu tố: khuấy, nhiệt độ, kích thước hạt.",done:()=>Object.keys(S.yt.done).length>=3}],
  obs:[{id:"a",q:"Hỗn hợp muối ăn tan hoàn toàn trong nước là:",opts:[["dd","Dung dịch"],["hp","Huyền phù"],["nt","Nhũ tương"]],ans:"dd",why:"Muối (chất tan) phân bố đều trong nước (dung môi), tạo hỗn hợp đồng nhất."},
    {id:"b",q:"Dầu ăn lắc với nước tạo thành:",opts:[["nt","Nhũ tương"],["dd","Dung dịch"],["hp","Huyền phù"]],ans:"nt",why:"Chất lỏng (dầu) phân tán vào chất lỏng khác (nước) dưới dạng giọt nhỏ, không hòa tan."},
    {id:"c",q:"Muốn đường tan nhanh trong cốc nước, nên:",opts:[["ok","Dùng đường kính, nước ấm và khuấy đều"],["vien","Dùng đường viên, nước lạnh"],["de","Để yên không khuấy"]],ans:"ok",why:"Khuấy, tăng nhiệt độ và làm nhỏ hạt đều làm chất rắn hòa tan nhanh hơn."}],
  concl:{html:`<ul class="tlist"><li><b>Dung dịch</b> là hỗn hợp đồng nhất của dung môi và chất tan (ví dụ: nước muối, nước đường).</li>
    <li><b>Huyền phù</b> là hỗn hợp gồm các hạt chất rắn lơ lửng trong chất lỏng (ví dụ: nước bột đá vôi); <b>nhũ tương</b> là hỗn hợp gồm chất lỏng phân tán dưới dạng giọt nhỏ trong chất lỏng khác (ví dụ: dầu ăn lắc với nước). Huyền phù và nhũ tương là hỗn hợp không đồng nhất, để yên thì tách ra.</li>
    <li>Khuấy, đun nóng dung môi, làm nhỏ chất rắn giúp chất rắn hòa tan nhanh hơn.</li></ul>`,
    quiz:[{id:"q1",q:"Sữa tươi (giọt chất béo phân tán trong nước) là:",opts:[["a","Nhũ tương"],["b","Dung dịch"],["c","Chất tinh khiết"]],ans:"a",why:{b:"Chất béo không tan, phân tán thành giọt.",c:"Sữa gồm nhiều chất."}},
      {id:"q2",q:"Nước phù sa (đất mịn lơ lửng trong nước) là:",opts:[["a","Huyền phù"],["b","Nhũ tương"],["c","Dung dịch"]],ans:"a",why:{b:"Đất là chất rắn, không phải giọt lỏng.",c:"Đất không tan, để lâu sẽ lắng."}}],
    done:`<h2>Hoàn thành: Dung dịch, huyền phù, nhũ tương</h2><p class="muted">Muối tan tạo dung dịch; đá vôi tạo huyền phù; dầu ăn tạo nhũ tương.</p>`},
  gv:["Tiêu chí phân biệt: chất rắn tan → dung dịch; chất rắn không tan → huyền phù; chất lỏng không tan → nhũ tương.","Thí nghiệm yếu tố hòa tan cần thay đổi một yếu tố, giữ nguyên các yếu tố khác (lượng đường, lượng nước…).","Tốc độ hòa tan trong mô phỏng chỉ có ý nghĩa so sánh."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 15)</p><ul class="tlist"><li>Phân biệt được dung dịch với huyền phù, nhũ tương.</li><li>Nhận ra được một số khí cũng có thể hòa tan trong nước; chất rắn hòa tan và không hòa tan trong nước.</li><li>Nêu được các yếu tố ảnh hưởng đến lượng chất rắn hòa tan trong nước.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 15 Chất tinh khiết – Hỗn hợp.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Tốc độ hòa tan của đường trong mô hình: khuấy nhanh gấp 3, nước 60 °C nhanh gấp 2,5, hạt nhỏ nhanh gấp 4 so với đối chứng. Các hệ số chỉ để so sánh định tính, không phải kết quả đo.</li>
<li>Thời gian lắng của huyền phù và tách lớp của nhũ tương được rút ngắn.</li></ul>`;

let S;
LabKHTN.register("K6-H-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D dung dịch, huyền phù, nhũ tương",legend:{w:290},bench:[10,3.2],seed:15,
      views:{ph:{t:[-2.4,.42,0],yaw:0,pitch:.2,rad:.85,label:"Phân loại hỗn hợp",icon:IC.beaker},yt:{t:[2,.42,0],yaw:0,pitch:.22,rad:.7,label:"Yếu tố hòa tan",icon:IC.thermo}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,rnd=K.rnd;
    S={ph:{b:{muoi:{add:0,stir:0,set:0},voi:{add:0,stir:0,set:0},dau:{add:0,stir:0,set:0}},stirT:0,setT:0,done:{}},yt:{f:"khuay",run:false,t:0,p:[0,0],tA:null,tB:null,done:{}},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const tagM=(txt,w)=>{w=w||.3;const c=document.createElement("canvas");c.width=320;c.height=96;const g=c.getContext("2d");g.fillStyle="#FFFFFF";C.rr(g,4,4,312,88,18);g.fill();g.fillStyle="#111827";g.font="800 40px system-ui";g.textAlign="center";g.fillText(txt,160,62);
      const pl=G.plane(w,w*.3);const P=pl.pos,N=pl.nrm;for(let i=0;i<P.length;i+=3){const pz=P[i+2];P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}
      return R.mesh(pl,{type:"unlit",color:"#FFFFFF",key:"tag3",hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.5)discard;base.rgb=c.rgb;}"},textures:{uTex:R.tex2D(c)}})};
    const BR=.22,WT=.42;
    function beaker(x,lbl){const n=root.add(new G.Node());n.pos=[x,0,0];n.add(K3.glass(R,BR,.6));const w=n.add(K3.liquid(R,BR-.02,.03,WT,H("#BFDBFE"),.35));const tg=n.add(tagM(lbl));tg.pos=[0,.52,BR+.004];
      const rod=n.add(R.mesh(G.cylinder(.008,.7,8),{type:"glass",color:"#F8FAFC",alpha:.6,key:"rod"}));rod.visible=false;return{n,w,rod,x}}
    /* ---------- 1. phân loại ---------- */
    const PX={muoi:-3,voi:-2.4,dau:-1.8};const PB={};
    PB.muoi=beaker(PX.muoi,"Muối ăn");PB.voi=beaker(PX.voi,"Bột đá vôi");PB.dau=beaker(PX.dau,"Dầu ăn");
    const salt=R.instanced(G.box(1,1,1,.12,1),{color:"#F8FAFC",rough:.3,coat:.4,key:"salt"},60);root.add(salt);const SL=[];
    const sed=PB.voi.n.add(R.mesh(G.cylinder(BR-.022,1,32),{color:"#E7E5E4",rough:.95}));sed.pos=[0,.031,0];sed.scl=[1,.001,1];
    const cloud=PB.voi.n.add(K3.liquid(R,BR-.024,.035,WT-.005,H("#F5F5F4"),0));cloud.mat.alpha=0;
    const powder=R.instanced(G.sphere(1,6,4),{color:"#F5F5F4",rough:.9,key:"powder"},120);root.add(powder);const PWD=[];
    const oilL=PB.dau.n.add(K3.liquid(R,BR-.02,WT,WT+.045,H("#FACC15"),.85));oilL.visible=false;
    const drops=R.instanced(G.sphere(1,12,8),{color:"#FACC15",rough:.15,coat:.6,alpha:.9,transparent:true,key:"oild"},80);root.add(drops);const DRP=[];
    for(let i=0;i<80;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*(BR-.05);DRP.push({x:Math.cos(a)*d,z:Math.sin(a)*d,y:.07+rnd()*(WT-.12),r:.008+rnd()*.016,ph:rnd()*6})}
    /* ---------- 2. yếu tố ---------- */
    const YX=[1.65,2.35];const YB=[beaker(YX[0],"Cốc A"),beaker(YX[1],"Cốc B")];
    const sugar=YB.map(b=>{const big=b.n.add(R.mesh(G.box(.07,.06,.05,.008,2),{color:"#FFFFFF",rough:.5,coat:.3,key:"sug"}));big.pos=[0,.06,0];
      const gr=R.instanced(G.box(1,1,1,.15,1),{color:"#FFFFFF",rough:.4,coat:.3,key:"sugg"},40);b.n.add(gr);const GL=[];for(let i=0;i<40;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*.09;GL.push([Math.cos(a)*d,.04+rnd()*.012,Math.sin(a)*d,.009+rnd()*.006])}return{big,gr,GL}});
    const steam=root.add(K3.puffs(R,40,"#FFFFFF"));
    /* ---------- vòng lặp ---------- */
    let tk=0;const P=S.ph;
    function recPh(k){if(P.done[k])return;P.done[k]=1;api.record(k==="muoi"?{tn:"Muối ăn + nước, khuấy",ht:"muối tan hết, chất lỏng trong suốt; để yên không tách lớp",kl:"dung dịch (hỗn hợp đồng nhất)"}:k==="voi"?{tn:"Bột đá vôi + nước, khuấy rồi để yên",ht:"nước đục; để yên, bột lắng xuống đáy",kl:"huyền phù (chất rắn không tan lơ lửng)"}:{tn:"Dầu ăn + nước, lắc rồi để yên",ht:"lắc: dầu thành giọt nhỏ lơ lửng; để yên: dầu nổi thành lớp riêng",kl:"nhũ tương (chất lỏng không tan phân tán thành giọt)"});refresh()}
    K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}const B=P.b;
      if(P.stirT>0){P.stirT=Math.max(0,P.stirT-dt);for(const k in B)if(B[k].add)B[k].stir=Math.min(1,B[k].stir+dt/2.5);if(P.stirT===0)refresh()}
      if(P.setT>0){P.setT=Math.max(0,P.setT-dt);for(const k in B)if(B[k].add&&B[k].stir>0)B[k].set=Math.min(1,B[k].set+dt/5);if(P.setT===0){if(B.voi.set>=1)recPh("voi");if(B.dau.set>=1)recPh("dau");refresh()}}
      const stirring=P.stirT>0;for(const k in PB){const b=PB[k];b.rod.visible=stirring&&B[k].add;if(b.rod.visible){const a=K.simT*7;b.rod.pos=[Math.cos(a)*.1,.06,Math.sin(a)*.1];b.rod.quat=Q.euler(Math.sin(a)*.18,0,Math.cos(a)*.18)}}
      /* muối */
      for(const s of SL){if(s.y>s.floor)s.y=Math.max(s.floor,s.y-dt*(s.y>WT?1.2:.35));s.r=Math.max(0,s.r-dt*(stirring?.004:.0004)*(s.y<WT?1:0))}
      if(SL.length&&SL.every(s=>s.r<=.0005)&&B.muoi.stir>0)recPh("muoi");
      {const D=salt.data;let c=0;for(const s of SL)if(s.r>.0005){D.set([PX.muoi+s.x,s.y,s.z,s.r,1,1,1,1],c*8);c++}salt.setInstances(c)}
      /* đá vôi */
      const v=B.voi;const turb=v.add?(v.stir>0?Math.min(1,v.stir*1.5)*(1-v.set*.85):.12):0;cloud.mat.alpha=.85*turb;sed.scl=[1,Math.max(.001,(v.add?(v.stir>0?.025*v.set:.012):0)),1];
      for(const p of PWD){if(p.y>p.f)p.y=Math.max(p.f,p.y-dt*(p.y>WT?1.2:.25))}{const D=powder.data;let c=0;for(const p of PWD)if(v.stir<.4){D.set([PX.voi+p.x,p.y,p.z,.006,1,1,1,1],c*8);c++}powder.setInstances(c)}
      /* dầu */
      const d=B.dau;const em=d.add?C.clamp(d.stir*1.4,0,1)*(1-d.set):0;oilL.visible=d.add&&em<.95;oilL.scl=[1,1,1];oilL.pos=[0,0,0];oilL.mat.alpha=.85*(1-em);
      {const D=drops.data;let c=0;if(em>.02)DRP.forEach((q,i)=>{const yy=q.y+(WT-q.y)*d.set*d.set+.004*Math.sin(K.simT*2+q.ph);if(i/80<em+.1){D.set([PX.dau+q.x,Math.min(WT-.005,yy),q.z,q.r*(.5+.5*em),1,1,1,1],c*8);c++}});drops.setInstances(c)}
      PB.dau.w.mat.color=H(em>.3?"#FEF9C3":"#BFDBFE");
      /* yếu tố */
      const Y=S.yt,F=FAC[Y.f];if(Y.run){Y.t+=dt;const base=1/24;Y.p[0]=Math.min(1,Y.p[0]+dt*base*F.kA);Y.p[1]=Math.min(1,Y.p[1]+dt*base*F.kB);if(Y.p[0]>=1&&Y.tA==null){Y.tA=Y.t;refresh()}
        if(Y.p[0]>=1&&Y.tB==null&&Y.t>Y.tA+2.5){Y.run=false;Y.done[Y.f]=1;api.record({tn:`${F.t}: ${F.A} (A) và ${F.B} (B)`,ht:`đường ở cốc A tan hết trước; cốc B còn ${Math.round((1-Y.p[1])*100)} %`,kl:F.kl});refresh()}}
      YB.forEach((b,i)=>{const p=Y.p[i];const big=(Y.f==="hat"&&i===1)||Y.f!=="hat";const sg=sugar[i];sg.big.visible=big&&p<1;const s=Math.cbrt(Math.max(.001,1-p));sg.big.scl=[s,s,s];
        const D=sg.gr.data;let c=0;if(!big)sg.GL.forEach(g=>{const r=g[3]*Math.cbrt(Math.max(0,1-p));if(r>.001){D.set([g[0],g[1],g[2],r,1,1,1,1],c*8);c++}});sg.gr.setInstances(c);
        const stir=Y.run&&(Y.f!=="khuay"?true:i===0);b.rod.visible=stir;if(stir){const a=K.simT*7+i;b.rod.pos=[Math.cos(a)*.1,.06,Math.sin(a)*.1];b.rod.quat=Q.euler(Math.sin(a)*.18,0,Math.cos(a)*.18)}
        b.w.mat.color=H(Y.f==="nhiet"&&i===0?"#FECACA":"#BFDBFE")});
      if(Y.f==="nhiet"&&rnd()<dt*4)steam.spawn([YX[0]+(rnd()-.5)*.2,WT+.05,(rnd()-.5)*.2],.03,[0,.12,0],1.6,.22,2);steam.step(dt)});
    /* ---------- tương tác ---------- */
    function add(k){const b=P.b[k];if(b.add)return;b.add=1;
      if(k==="muoi")for(let i=0;i<40;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*(BR-.06);SL.push({x:Math.cos(a)*d,z:Math.sin(a)*d,y:WT+.15+rnd()*.25,floor:.04+rnd()*.01,r:.008+rnd()*.006})}
      if(k==="voi")for(let i=0;i<120;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*(BR-.05);PWD.push({x:Math.cos(a)*d,z:Math.sin(a)*d,y:WT+.1+rnd()*.3,f:.04+rnd()*.012})}
      refresh()}
    K.dockFn(()=>{const v=K.view,B=P.b;if(v==="ph")return[{grid:[{k:"add",v:"muoi",label:"Cho muối ăn",icon:"",dis:!!B.muoi.add},{k:"add",v:"voi",label:"Cho bột đá vôi",icon:"",dis:!!B.voi.add},{k:"add",v:"dau",label:"Cho dầu ăn",icon:"",dis:!!B.dau.add}]},
        {k:"stir",label:"Khuấy / lắc các cốc",icon:IC.play,dis:!(B.muoi.add||B.voi.add||B.dau.add)||P.stirT>0},{k:"set",label:"Để yên một lúc",icon:IC.eye,dis:!(B.voi.stir>0||B.dau.stir>0)||P.setT>0||P.stirT>0},{k:"prs",label:"Làm lại",icon:IC.reset}];
      const Y=S.yt;return[{grid:Object.keys(FAC).map(k=>({k:"fac",v:k,label:FAC[k].t,icon:"",on:Y.f===k,dis:Y.run}))},{k:"go",label:Y.run?"Đang hòa tan…":"Cho đường vào, bắt đầu",icon:IC.play,dis:Y.run}]});
    K.onDock((k,v)=>{if(k==="add")add(v);else if(k==="stir")P.stirT=2.6;else if(k==="set")P.setT=5.2;else if(k==="prs"){for(const q in P.b)P.b[q]={add:0,stir:0,set:0};SL.length=0;PWD.length=0;P.stirT=P.setT=0}
      else if(k==="fac"){const Y=S.yt;Y.f=v;Y.p=[0,0];Y.tA=Y.tB=null;Y.t=0}else if(k==="go"){const Y=S.yt;Y.p=[0,0];Y.tA=Y.tB=null;Y.t=0;Y.run=true}refresh()});
    /* nhãn */
    for(const k in PX)K.label({muoi:"Cốc 1",voi:"Cốc 2",dau:"Cốc 3"}[k],[PX[k],.62,0],{view:"ph",dir:"n",len:14});
    const la=K.label("A",()=>[YX[0],.62,0],{view:"yt",dir:"n",len:14}),lb=K.label("B",()=>[YX[1],.62,0],{view:"yt",dir:"n",len:14});
    K.onFrame(()=>{const F=FAC[S.yt.f];la.set("A · "+F.A);lb.set("B · "+F.B)});
    K.infoFn(()=>{if(K.view==="ph"){const B=P.b;const st2=k=>{const b=B[k];if(!b.add)return"chưa cho chất";if(k==="muoi")return b.stir>0?(P.done.muoi?"muối tan hết, trong suốt → dung dịch":"muối đang tan…"):"muối nằm ở đáy cốc";
          if(k==="voi")return b.stir>0?(b.set>=1?"bột lắng xuống đáy, nước trong dần → huyền phù":b.set>0?"bột đang lắng…":"nước đục trắng"):"bột đọng ở đáy cốc";
          return b.stir>0?(b.set>=1?"dầu nổi thành lớp trên mặt nước → nhũ tương":b.set>0?"giọt dầu đang nổi lên…":"dầu thành giọt nhỏ lơ lửng"):"dầu nổi trên mặt nước"};
        return `<div><b>Phân loại hỗn hợp</b></div><div>Cốc 1 (muối ăn): ${st2("muoi")}</div><div>Cốc 2 (bột đá vôi): ${st2("voi")}</div><div>Cốc 3 (dầu ăn): ${st2("dau")}</div>`}
      const Y=S.yt,F=FAC[Y.f];return `<div><b>Yếu tố: ${F.t}</b></div><div>A · ${F.A}: đã tan ${Math.round(Y.p[0]*100)} %</div><div>B · ${F.B}: đã tan ${Math.round(Y.p[1]*100)} %</div><small>Giữ nguyên lượng đường, lượng nước; chỉ thay đổi một yếu tố. Đã so sánh ${Object.keys(Y.done).length}/3 yếu tố.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"add",v:"muoi",p:[PX.muoi,.62,0],tip:"Chạm: cho muối ăn",view:"ph"},{k:"add",v:"voi",p:[PX.voi,.62,0],tip:"Chạm: cho bột đá vôi",view:"ph"},{k:"add",v:"dau",p:[PX.dau,.62,0],tip:"Chạm: cho dầu ăn",view:"ph"},{k:"stir",p:[PX.voi,.3,.22],tip:"Chạm để khuấy, lắc các cốc",view:"ph"},{k:"go",p:[2,.7,0],tip:"Chạm: cho đường vào hai cốc",view:"yt"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const k of ["muoi","voi","dau"])add(k);for(const k in P.b){P.b[k].stir=1;P.b[k].set=1}SL.forEach(s=>s.r=0);recPh("muoi");recPh("voi");recPh("dau");
      for(const f in FAC){S.yt.f=f;S.yt.done[f]=1;api.record({tn:`${FAC[f].t}: ${FAC[f].A} (A) và ${FAC[f].B} (B)`,ht:"đường ở cốc A tan hết trước",kl:FAC[f].kl})}S.yt.f="khuay";K.goView("yt");K.goView("ph");refresh()}};
    return K.mount(st)}
});
})();
