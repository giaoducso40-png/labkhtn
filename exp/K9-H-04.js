/* K9-H-04 · Alkane; alkene: phản ứng cháy, phản ứng với nước bromine (SGK KHTN 9 – Kết nối tri thức, Bài 23–24) · 3D, mô hình
   1. Dẫn khí methane và khí ethylene vào hai ống nghiệm đựng nước bromine (màu vàng cam): chỉ ống có ethylene mất màu.
   2. Đốt khí methane, khí ethylene ở đầu ống dẫn; úp cốc khô (thấy hơi nước đọng) và cốc tráng nước vôi trong (thấy vẩn đục: CO₂).
   3. Mô hình phản ứng cộng: liên kết đôi C=C của ethylene mở ra, hai nguyên tử Br gắn vào hai nguyên tử C tạo 1,2-dibromoethane. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const BR="#D9822B";
const X1=-2.6,X2=0,X3=4.2;

const SPEC={
  predict:[{id:"p1",q:"Dẫn khí ethylene vào nước bromine màu vàng cam, em đoán:",opts:[["mat","Nước bromine mất màu"],["dam","Màu đậm hơn"],["khong","Không đổi màu"]],ans:"mat",res:"Kết quả: ethylene làm mất màu nước bromine; methane thì không."},
    {id:"p2",q:"Sản phẩm khi đốt cháy hoàn toàn methane là:",opts:[["co2","CO₂ và H₂O"],["c","C và H₂"],["co","Chỉ CO"]],ans:"co2",res:"Kết quả: cốc khô có hơi nước đọng, cốc tráng nước vôi trong bị vẩn đục: sản phẩm là H₂O và CO₂."}],
  taskLead:"Chọn phần ở khay rồi làm theo các nút thao tác.",
  tasks:[{html:"<b>Nước bromine:</b> dẫn khí methane vào ống 1 và khí ethylene vào ống 2.",done:()=>S.b.ch4&&S.b.c2h4},
    {html:"<b>Phản ứng cháy:</b> đốt cả hai khí, úp cốc khô và cốc tráng nước vôi trong lên ngọn lửa.",done:()=>["ch4","c2h4"].every(g=>S.c.dry[g]&&S.c.lime[g])},
    {html:"<b>Mô hình:</b> cho phân tử ethylene cộng với bromine.",done:()=>S.m.done}],
  obs:[{id:"a",q:"Vì sao ethylene làm mất màu nước bromine còn methane thì không?",opts:[["doi","Phân tử ethylene có liên kết đôi C=C kém bền, tham gia phản ứng cộng"],["it","Methane ít tan trong nước"],["mau","Methane có màu"]],ans:"doi",why:"Methane chỉ có liên kết đơn, không có phản ứng cộng."},
    {id:"b",q:"Cốc tráng nước vôi trong úp lên ngọn lửa bị vẩn đục. Điều đó chứng tỏ:",opts:[["co2","Sản phẩm cháy có CO₂"],["h2o","Sản phẩm cháy có H₂O"],["o2","Khí còn dư O₂"]],ans:"co2",why:"CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O."}],
  concl:{html:`<div class="eq">CH₄ + 2O₂ → CO₂ + 2H₂O (t°)<br>C₂H₄ + 3O₂ → 2CO₂ + 2H₂O (t°)<br>CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br</div><ul class="tlist">
    <li><b>Alkane</b> (CₙH₂ₙ₊₂, chỉ có liên kết đơn): cháy tỏa nhiều nhiệt, dùng làm nhiên liệu; không làm mất màu nước bromine.</li>
    <li><b>Alkene</b> (CₙH₂ₙ, có một liên kết đôi C=C): cháy; tham gia phản ứng cộng (làm mất màu nước bromine) và phản ứng trùng hợp (tạo polyethylene).</li></ul>`,
    quiz:[{id:"q1",q:"Thuốc thử dùng để phân biệt khí methane và khí ethylene là:",opts:[["a","Nước bromine"],["b","Nước vôi trong"],["c","Giấy quỳ tím"]],ans:"a",why:{b:"Sản phẩm cháy của cả hai đều làm đục nước vôi trong.",c:"Cả hai khí đều không làm quỳ đổi màu."}},
      {id:"q2",q:"Khí biogas, khí thiên nhiên có thành phần chính là:",opts:[["a","Methane"],["b","Ethylene"],["c","Hydrogen"]],ans:"a",why:{b:"Ethylene dùng làm nguyên liệu sản xuất nhựa PE, kích thích quả chín.",c:"Thành phần chính là methane."}}],
    done:`<h2>Hoàn thành: Alkane và alkene</h2><p class="muted">Cả hai đều cháy tạo CO₂, H₂O; chỉ alkene làm mất màu nước bromine.</p>`},
  gv:["An toàn khi làm thật: chỉ đốt khí ở đầu ống dẫn sau khi đã thử độ tinh khiết; bromine độc, làm trong tủ hút.","Hỏi: vì sao ngọn lửa ethylene sáng hơn và có muội?","Liên hệ: dùng khí ethylene để làm chín trái cây."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 23–24)</p><ul class="tlist"><li>Nêu được khái niệm alkane, alkene; viết được công thức cấu tạo, gọi tên một số chất đơn giản.</li><li>Trình bày được tính chất hóa học: phản ứng cháy; alkene có phản ứng cộng với bromine, phản ứng trùng hợp. Tiến hành được thí nghiệm hoặc quan sát thí nghiệm.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 23 Alkane, Bài 24 Alkene.</li>
<li>Phản ứng cộng bromine của alkene: <a href="https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_(OpenStax)/08%3A_Alkenes-_Reactions_and_Synthesis/8.02%3A_Halogenation_of_Alkenes_-_Addition_of_X2" target="_blank" rel="noopener">OpenStax Organic Chemistry, mục 8.2</a>.</li>
<li>Thời gian mất màu, lượng kết tủa trong mô phỏng là minh họa định tính.</li></ul>`;

let S;
LabKHTN.register("K9-H-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D methane, ethylene với nước bromine, phản ứng cháy và mô hình phản ứng cộng",legend:{w:260},bench:[11,2.4],seed:24,
      views:{brom:{t:[X1,.5,0],yaw:0,pitch:.22,rad:.8,label:"Nước bromine",icon:IC.tube},chay:{t:[X2,.55,0],yaw:0,pitch:.18,rad:.85,label:"Phản ứng cháy",icon:IC.fire},mh:{t:[X3,1.75,0],yaw:.2,pitch:.1,rad:2.5,label:"Mô hình",icon:IC.cell}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={b:{ch4:false,c2h4:false},c:{burn:{},dry:{},lime:{},cup:{}},m:{t:-1,done:false},recs:0};
    const rec=(tn,ht,kl)=>{S.recs++;api.record({lan:String(S.recs),tn,ht,kl})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const BN=BL.create(K);const glassM={type:"glass",color:"#EAF6FF",alpha:.5};
    /* ================= 1. nước bromine ================= */
    BN.rack(X1,0,2,.34);const T1=BN.vessel({id:"b1",kind:"tube",x:X1-.17,z:0,sol:{col:BR,a:.62,level:.42}}),T2=BN.vessel({id:"b2",kind:"tube",x:X1+.17,z:0,sol:{col:BR,a:.62,level:.42}});
    for(const [x,c] of [[X1-.17,"#90CAF9"],[X1+.17,"#A5D6A7"]]){root.add(R.mesh(G.tube([[x+.01,.08,0],[x+.01,1.15,0],[x+.25,1.3,-.1]],.008,8),glassM));root.add(R.mesh(G.tube([[x+.25,1.3,-.1],[x+.5,1.32,-.3]],.014,8),{color:c,rough:.6}))}
    /* ================= 2. đốt khí ================= */
    const NZ=[X2-.35,X2+.35];const fl={};const cups={};
    NZ.forEach((x,i)=>{root.add(R.mesh(G.tube([[x,0,0],[x,.32,0]],.012,10),glassM));root.add(R.mesh(G.box(.14,.04,.14,.01,2),{color:"#3F4652"})).pos=[x,.02,0];
      const g=i?"c2h4":"ch4";const f=root.add(K3.flame(R,i?[1,.62,.18]:[.35,.55,1],i?[1,.95,.7]:[.7,.85,1]));f.pos=[x,.33,0];f.scl=i?[.5,.95,.5]:[.4,.7,.4];f.visible=false;fl[g]=f;
      const cup=root.add(new G.Node());const gm=cup.add(K3.glass(R,.12,.24));gm.quat=G.Q.euler(Math.PI,0,0);gm.pos=[0,.24,0];
      const fog=cup.add(R.mesh(G.lathe([[.112,.02],[.112,.22],[0,.225]],32),{color:"#FFFFFF",alpha:0,transparent:true,order:4,side:"double"}));cup.pos=[x,.55,0];cup.visible=false;cups[g]={cup,fog,kind:null,t:0}});
    const smokeB=root.add(K3.puffs(R,80,"#555555"));
    /* ================= 3. mô hình phản ứng cộng ================= */
    const EL={H:["#F4F6F8",.17],C:["#3A3F47",.28],Br:["#8E2A1E",.36]};const SC=.42;
    const atoms=[["C",-.665,0],["C",.665,0],["H",-1.23,.92],["H",-1.23,-.92],["H",1.23,.92],["H",1.23,-.92]].map(a=>({e:a[0],p:[a[1]*SC*3,a[2]*SC*3,0]}));
    const brA=[{e:"Br",p0:[-.9,2.3,0]},{e:"Br",p0:[.9,2.3,0]}];
    const mh=root.add(new G.Node());mh.pos=[X3,1.5,0];const sph={};for(const e in EL)sph[e]=G.sphere(EL[e][1],28,20);
    const an=[...atoms,...brA].map(a=>{const n=mh.add(R.mesh(sph[a.e],{color:EL[a.e][0],rough:.3,coat:.5}));n.pos=a.p||a.p0;return n});
    const cyl=G.cylinder(.05,1,12,false);const bonds=[];const mkB=(i,j,k,ord)=>{const n=mh.add(R.mesh(cyl,{color:"#C9CED6",rough:.4,alpha:1,transparent:true}));const b={n,i,j,k,ord};bonds.push(b);return b};
    mkB(0,1,0,2);mkB(0,1,1,2);mkB(0,2,0,1);mkB(0,3,0,1);mkB(1,4,0,1);mkB(1,5,0,1);const bBr=mkB(6,7,0,1);const bC1=mkB(0,6,0,1),bC2=mkB(1,7,0,1);
    function place(){for(const b of bonds){const A=an[b.i].pos,B=an[b.j].pos;const d=V3.sub(B,A),L=V3.len(d);const side=V3.norm(V3.cross(d,[0,0,1]));const off=b.ord>1?(b.k-.5)*.12:0;b.n.pos=V3.add(A,V3.scale(side,off));b.n.quat=G.Q.toward(d);b.n.scl=[1,L,1]}}
    /* ================= nhãn ================= */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    lab("Ống 1: nước bromine + khí methane",[X1-.17,.5,0],"brom",{dir:"w",len:30});lab("Ống 2: nước bromine + khí ethylene",[X1+.17,.5,0],"brom",{dir:"e",len:30});
    lab("Khí methane",[NZ[0],.15,0],"chay",{dir:"w",len:30});lab("Khí ethylene",[NZ[1],.15,0],"chay",{dir:"e",len:30});
    const lM=lab("",[X3,4.1,0],"mh",{dir:"n",len:0,cls:"plain"});const lDB=lab("Liên kết đôi C=C",[X3,1.5,0],"mh",{dir:"s",len:60});
    /* ================= cập nhật ================= */
    K.onFrame((dt)=>{
      for(const g in fl){fl[g].visible=!!S.c.burn[g];if(fl[g].visible)fl[g].scl=g==="c2h4"?[.5,.95+.05*Math.sin(K.simT*20),.5]:[.4,.7+.04*Math.sin(K.simT*23),.4]}
      if(S.c.burn.c2h4&&dt>0&&Math.random()<dt*6)smokeB.spawn([NZ[1],.75,0],.02,[0,.3,0],1.2,.25);smokeB.step(dt);
      for(const g in cups){const c=cups[g];c.cup.visible=!!c.kind;if(c.kind&&dt>0){c.t+=dt;const k=C.clamp(c.t/3,0,1);c.fog.mat.alpha=c.kind==="dry"?.28*k:.55*k;c.fog.mat.color=c.kind==="dry"?[.92,.96,1]:[1,1,1];
          if(c.t>3&&!c.done){c.done=true;const nm=g==="ch4"?"methane":"ethylene";if(c.kind==="dry"){S.c.dry[g]=1;rec(`Úp cốc khô lên ngọn lửa ${nm}`,"thành cốc mờ đi, có những giọt nước nhỏ","Sản phẩm cháy có H₂O")}else{S.c.lime[g]=1;rec(`Úp cốc tráng nước vôi trong lên ngọn lửa ${nm}`,"lớp nước vôi trong trên thành cốc vẩn đục trắng","Sản phẩm cháy có CO₂")}refresh()}}}
      /* mô hình */
      const M=S.m;if(M.t>=0&&dt>0){M.t+=dt;const u=C.clamp(M.t/3,0,1),s=u*u*(3-2*u);
        brA.forEach((b,i)=>{const C0=an[i].pos;const tgt=V3.add(atoms[i].p,[i?.35:-.35,.95,0]);an[6+i].pos=V3.lerp(b.p0,tgt,s)});
        bonds[1].n.mat.alpha=1-s;bBr.n.mat.alpha=1-s;bC1.n.mat.alpha=s;bC2.n.mat.alpha=s;
        if(u>=1&&!M.done){M.done=true;rec("Mô hình: C₂H₄ + Br₂","một liên kết trong liên kết đôi C=C bị phá vỡ; mỗi nguyên tử C nhận thêm một nguyên tử Br","CH₂=CH₂ + Br₂ → CH₂Br–CH₂Br (1,2-dibromoethane): phản ứng cộng");refresh()}}
      else if(M.t<0){brA.forEach((b,i)=>an[6+i].pos=b.p0);bonds[1].n.mat.alpha=1;bBr.n.mat.alpha=1;bC1.n.mat.alpha=0;bC2.n.mat.alpha=0}
      place();lDB.set(S.m.done?"Liên kết đơn C–C":"Liên kết đôi C=C");lM.set(`<b>${S.m.done?"CH₂Br–CH₂Br":"CH₂=CH₂ + Br₂"}</b>`)});
    /* ================= khay ================= */
    K.dockFn(()=>{const v=K.view;
      if(v==="brom")return[{k:"g",v:"ch4",label:"Dẫn khí methane vào ống 1",icon:IC.drop,dis:S.b.ch4},{k:"g",v:"c2h4",label:"Dẫn khí ethylene vào ống 2",icon:IC.drop,dis:S.b.c2h4},{k:"rb",label:"Làm lại",icon:IC.reset}];
      if(v==="chay"){const it=[];for(const g of ["ch4","c2h4"]){const nm=g==="ch4"?"methane":"ethylene";it.push({k:"burn",v:g,label:S.c.burn[g]?`Tắt khí ${nm}`:`Đốt khí ${nm}`,icon:IC.fire,on:!!S.c.burn[g]},
        {grid:[{k:"cup",v:g+"|dry",label:"Úp cốc khô",icon:IC.beaker,dis:!S.c.burn[g]},{k:"cup",v:g+"|lime",label:"Úp cốc tráng nước vôi",icon:IC.beaker,dis:!S.c.burn[g]}]})}return it}
      return[{k:"add",label:"Cho C₂H₄ cộng Br₂",icon:IC.play,dis:S.m.t>=0},{k:"rm",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{
      if(k==="g"){const T=v==="ch4"?T1:T2;T.fizz(26,.8);setTimeout(()=>{if(!K.dead)T.fizz(0)},7000);S.b[v]=true;
        if(v==="c2h4"){T.setColor("#F7F3E6",.18,7);rec("Dẫn khí ethylene vào nước bromine (ống 2)","màu vàng cam của nước bromine nhạt dần rồi mất màu","Ethylene có phản ứng cộng với bromine")}
        else rec("Dẫn khí methane vào nước bromine (ống 1)","nước bromine vẫn giữ màu vàng cam","Methane không phản ứng với nước bromine")}
      else if(k==="rb"){T1.reset();T2.reset();S.b={ch4:false,c2h4:false}}
      else if(k==="burn"){S.c.burn[v]=!S.c.burn[v];if(!S.c.burn[v]){cups[v].kind=null}else rec(`Đốt khí ${v==="ch4"?"methane":"ethylene"} ở đầu ống dẫn`,v==="ch4"?"khí cháy với ngọn lửa màu xanh nhạt, tỏa nhiều nhiệt":"khí cháy với ngọn lửa sáng hơn, có ít muội than","Phản ứng cháy tỏa nhiệt")}
      else if(k==="cup"){const [g,kind]=v.split("|");const c=cups[g];c.kind=kind;c.t=0;c.done=false;c.fog.mat.alpha=0}
      else if(k==="add"){S.m.t=0}else if(k==="rm"){S.m.t=-1}
      refresh()});
    K.infoFn(()=>{const v=K.view;if(v==="brom")return `<div><b>Nước bromine</b> (dung dịch Br₂ loãng, vàng cam)</div><div>Ống 1: ${S.b.ch4?"đã dẫn methane":"chưa dẫn khí"}</div><div>Ống 2: ${S.b.c2h4?"đã dẫn ethylene":"chưa dẫn khí"}</div>`;
      if(v==="chay")return `<div><b>Đốt khí ở đầu ống dẫn</b></div><small>Cốc khô: phát hiện hơi nước; cốc tráng nước vôi trong: phát hiện CO₂.</small>`;
      return `<div><b>Mô hình phản ứng cộng</b></div><div><i style="background:#3A3F47"></i>C &nbsp;<i style="background:#F4F6F8"></i>H &nbsp;<i style="background:#8E2A1E"></i>Br</div><small>Liên kết đôi C=C gồm một liên kết bền và một liên kết kém bền; liên kết kém bền bị phá vỡ khi cộng bromine.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* trạm tự động */K.autoStations&&K.autoStations();
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"g",v:"ch4",p:[X1-.17,.75,0],tip:"Chạm để dẫn khí methane vào ống 1",view:"brom"},{k:"g",v:"c2h4",p:[X1+.17,.75,0],tip:"Chạm để dẫn khí ethylene vào ống 2",view:"brom"},...["ch4","c2h4"].map((g,i)=>({k:"burn",v:g,p:[NZ[i],.3,0],tip:S.c.burn[g]?"Chạm để tắt khí":"Chạm để đốt khí",view:"chay"})),{k:"add",p:[X3,1.5,0],tip:"Chạm để cho C₂H₄ cộng Br₂",view:"mh"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const click=(k,v)=>K._dockH(k,v);K.goView("brom");click("g","ch4");click("g","c2h4");K.goView("chay");click("burn","ch4");click("burn","c2h4");click("cup","ch4|dry");click("cup","c2h4|dry");
        const w=()=>{if(K.dead)return;if(!(S.c.dry.ch4&&S.c.dry.c2h4))return setTimeout(w,300);click("cup","ch4|lime");click("cup","c2h4|lime")};w();S.m.t=0;refresh()}};
    return K.mount(st)}
});
})();
