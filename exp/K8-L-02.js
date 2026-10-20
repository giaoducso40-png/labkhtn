/* K8-L-02 · Áp suất trên bề mặt; áp suất chất lỏng; áp suất khí quyển (SGK KHTN 8 – Kết nối tri thức, Bài 15–16) · 3D
   Trạm 1: viên gạch 20 × 10 × 5 cm, 2 kg đặt lên tấm mút theo ba mặt; xếp chồng 2 viên. p = F / S; độ lún tỉ lệ với áp suất.
   Trạm 2: bình nước có ba lỗ ở độ sâu 10, 20, 30 cm; tia nước phun ra xa hơn ở lỗ sâu hơn (vận tốc phun v = √(2gh)).
   Trạm 3: cốc nước đầy đậy tờ giấy, úp ngược: nước không chảy; hút bớt không khí trong hộp sữa giấy: hộp bị bẹp. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,fmt=C.fmt,H=G.hex;
const g=9.8,DW=10000;/* trọng lượng riêng của nước 10 000 N/m³ (SGK lấy gần đúng) */
const FACE=[{k:"nam",ten:"mặt rộng (20 × 10 cm)",S:.02,dims:[.2,.05,.1]},{k:"nghieng",ten:"mặt bên (20 × 5 cm)",S:.01,dims:[.2,.1,.05]},{k:"dung",ten:"mặt đầu (10 × 5 cm)",S:.005,dims:[.05,.2,.1]}];
const HOLES=[.1,.2,.3];/* độ sâu (m) tính từ mặt nước */
const SPEC={
  predict:[{id:"p1",q:"Đặt viên gạch lên tấm mút. Đặt mặt nào thì gạch lún sâu nhất?",opts:[["dung","Mặt nhỏ nhất (dựng đứng)"],["nam","Mặt rộng nhất (nằm)"],["nhu","Như nhau vì cùng một viên gạch"]],ans:"dung",res:"Kết quả: cùng áp lực, diện tích bị ép càng nhỏ thì áp suất càng lớn, gạch lún càng sâu."},
    {id:"p2",q:"Bình nước có ba lỗ ở các độ sâu khác nhau. Tia nước ở lỗ nào phun xa nhất?",opts:[["sau","Lỗ sâu nhất (gần đáy)"],["nong","Lỗ gần mặt nước nhất"],["nhu","Ba tia như nhau"]],ans:"sau",res:"Kết quả: càng xuống sâu, áp suất chất lỏng càng lớn, tia nước phun càng mạnh."}],
  taskLead:"Chọn trạm ở khay, làm theo các nút.",
  tasks:[{html:"<b>Áp suất chất rắn:</b> đặt viên gạch lên mút theo cả ba mặt.",done:()=>FACE.every(f=>S.face[f.k])},{html:"Xếp thêm một viên gạch (gấp đôi áp lực) và quan sát.",done:()=>S.stack2},
    {html:"<b>Áp suất chất lỏng:</b> mở ba lỗ của bình nước.",done:()=>S.holesOpen},{html:"<b>Áp suất khí quyển:</b> úp ngược cốc nước đậy giấy; hút không khí trong hộp sữa.",done:()=>S.cupDone&&S.boxDone}],
  obs:[{id:"a",q:"Viên gạch 20 N dựng đứng trên mặt 10 × 5 cm. Áp suất lên mút:",opts:[["4000","4 000 Pa"],["40","40 Pa"],["1000","1 000 Pa"]],ans:"4000",why:"S = 0,1 × 0,05 = 0,005 m²; p = F/S = 20 / 0,005 = 4 000 Pa."},
    {id:"b",q:"Áp suất của nước tại lỗ sâu 30 cm (trọng lượng riêng nước 10 000 N/m³):",opts:[["3000","3 000 Pa"],["300","300 Pa"],["30000","30 000 Pa"]],ans:"3000",why:"p = d·h = 10 000 × 0,3 = 3 000 Pa."},
    {id:"c",q:"Vì sao nước trong cốc úp ngược không chảy ra?",opts:[["kq","Áp suất khí quyển tác dụng lên tờ giấy từ dưới lên lớn hơn áp suất do cột nước gây ra"],["dinh","Giấy dính chặt vào cốc"],["nhe","Nước rất nhẹ"]],ans:"kq",why:"Áp suất khí quyển khoảng 100 000 Pa, còn cột nước cao 10 cm chỉ gây áp suất khoảng 1 000 Pa."}],
  concl:{html:`<div class="eq">p = F / S &nbsp;&nbsp; p = d · h</div><ul class="tlist">
    <li>Áp suất là độ lớn của áp lực trên một đơn vị diện tích bị ép; đơn vị pascal: 1 Pa = 1 N/m².</li>
    <li>Tăng áp suất: tăng áp lực hoặc giảm diện tích bị ép (lưỡi dao sắc, mũi đinh nhọn); giảm áp suất thì làm ngược lại (xe tăng có xích bản rộng).</li>
    <li>Chất lỏng gây áp suất theo mọi phương lên đáy, thành bình và các vật trong lòng nó; càng xuống sâu áp suất càng lớn.</li>
    <li>Không khí gây ra áp suất khí quyển theo mọi phương lên mọi vật trên Trái Đất.</li></ul>`,
    quiz:[{id:"q1",q:"Vì sao lưỡi dao, lưỡi kéo thường được mài sắc?",opts:[["a","Để giảm diện tích bị ép, tăng áp suất"],["b","Để tăng áp lực"],["c","Để dao nhẹ hơn"]],ans:"a",why:{b:"Mài sắc không làm thay đổi áp lực tay ấn.",c:"Không phải mục đích chính."}},
      {id:"q2",q:"Thợ lặn càng xuống sâu càng thấy tức ngực vì:",opts:[["a","Áp suất nước tăng theo độ sâu"],["b","Nước lạnh hơn"],["c","Thiếu ánh sáng"]],ans:"a",why:{b:"Nhiệt độ không gây tức ngực.",c:"Ánh sáng không gây áp lực."}}],
    done:`<h2>Hoàn thành: Áp suất</h2><p class="muted">p = F/S; áp suất chất lỏng tăng theo độ sâu; không khí gây ra áp suất khí quyển.</p>`},
  gv:["Hỏi: cùng một viên gạch, áp lực có thay đổi khi đổi mặt đặt không?","Yêu cầu học sinh tự tính áp suất ba cách đặt.","Liên hệ: đê, đập thủy điện chân rộng hơn đỉnh.","Làm thật thí nghiệm cốc úp ngược trên chậu."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 15–16)</p><ul class="tlist"><li>Nêu được áp suất là độ lớn của áp lực trên một đơn vị diện tích; đơn vị; cách tăng, giảm áp suất.</li><li>Thực hiện thí nghiệm khảo sát tác dụng của chất lỏng lên vật đặt trong chất lỏng; lấy được ví dụ về áp suất khí quyển.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 15 Áp suất trên một bề mặt, Bài 16 Áp suất chất lỏng. Áp suất khí quyển.</li>
<li>Vận tốc tia nước phun ra ở lỗ sâu h dưới mặt nước v = √(2gh) (định luật Torricelli): <a href="https://openstax.org/books/college-physics-2e/pages/12-2-bernoullis-equation" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 12.2</a>.</li>
<li>Giả định: viên gạch 2 kg (trọng lượng 20 N, lấy g ≈ 10 m/s²); độ lún của mút tỉ lệ với áp suất, phóng đại để dễ thấy. Mực nước trong bình được giữ không đổi bằng vòi cấp nước.</li></ul>`;

let S;
LabKHTN.register("K8-L-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"sl",t:"Số liệu"},{k:"kq",t:"Kết quả"}],empty:"Số liệu tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm áp suất: viên gạch trên tấm mút, bình nước có ba lỗ, cốc nước úp ngược và hộp sữa",bench:[8,3],legend:{w:250},
      views:{ran:{t:[-2.6,.35,0],yaw:.35,pitch:.32,rad:.85,label:"Chất rắn",icon:IC.grid},long:{t:[0,.75,0],yaw:-.5,pitch:.12,rad:1.2,label:"Chất lỏng",icon:IC.beaker},kq:{t:[2.6,.55,0],yaw:0,pitch:.2,rad:1.05,label:"Khí quyển",icon:IC.eye}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,rnd=K.rnd;
    S={face:{},cur:"nam",n:1,stack2:false,dep:0,holesOpen:false,open:[false,false,false],cupDone:false,boxDone:false,cup:{flip:0,go:false},box:{p:0,go:false},recs:0};
    const rec=(tn,sl,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,sl,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    /* ---------- trạm 1 (1 đơn vị = 1 m ở trạm này; phóng to 2 lần cho dễ nhìn) ---------- */
    const S1=root.add(new G.Node());S1.pos=[-2.6,0,0];S1.scl=[2,2,2];
    const foam=S1.add(R.mesh(G.box(.5,.08,.36,.02,3),{color:"#F1D267",rough:.95,hooks:KIT.TISSUE,uniforms:{uBump:.25,uNF:120}}));foam.pos=[0,.04,0];
    const brickM={color:"#B5502E",rough:.85,hooks:KIT.TISSUE,uniforms:{uBump:.18,uNF:60}};
    const bricks=[S1.add(new G.Node()),S1.add(new G.Node())];bricks.forEach(b=>{b.add(R.mesh(G.box(1,1,1,.04,2),brickM))});
    /* ---------- trạm 2: bình nước (đơn vị m, phóng 2 lần) ---------- */
    const S2=root.add(new G.Node());S2.pos=[0,0,0];
    const TK={r:.11,h:.42,y0:.14,lvl:.4};/* đáy bình đặt trên kệ cao 14 cm; mực nước cách đáy 40 cm → lỗ ở 10/20/30 cm dưới mặt nước */
    const SC=1.6;const tank=S2.add(new G.Node());tank.scl=[SC,SC,SC];
    tank.add(R.mesh(G.box(.32,TK.y0,.32,.02,2),{color:"#6B4F2A",rough:.6})).pos=[0,TK.y0/2,0];
    const tg=tank.add(K3.glass(R,TK.r,TK.h+.04,{lip:.01,th:.008}));tg.pos=[0,TK.y0,0];
    const tw=tank.add(R.mesh(K3.liquidGeom(TK.r-.008,.012,TK.lvl,false),{color:H("#8EC5F2"),alpha:.42,rough:.04,coat:.6,order:1}));tw.pos=[0,TK.y0,0];
    const plugs=HOLES.map((d,i)=>{const p=tank.add(R.mesh(G.sphere(.012,12,8),{color:"#30343C",rough:.5}));p.pos=[TK.r,TK.y0+TK.lvl-d,0];return p});
    const tray=tank.add(R.mesh(G.box(1.2,.02,.36,.01,2),{color:"#B9C4D3",rough:.3,metal:.6}));tray.pos=[.6,.01,0];
    for(let k=0;k<=12;k++){const m=tank.add(R.mesh(G.box(.003,.003,.3,.001,1),{type:"unlit",color:"#24324A"}));m.pos=[.1+k*.08,.022,0]}
    const jets=root.add(R.instanced(G.sphere(1,8,6),{color:H("#9CCDF5"),alpha:.85,rough:.05,coat:.7,transparent:true,order:2},900));const JP=[];
    /* ---------- trạm 3 ---------- */
    const S3=root.add(new G.Node());S3.pos=[2.6,0,0];
    const basin=S3.add(K3.glass(R,.48,.22,{lip:.02}));basin.pos=[-.35,0,0];const bw=S3.add(R.mesh(K3.liquidGeom(.455,.02,.14,false),{color:H("#8EC5F2"),alpha:.35,order:1}));bw.pos=[-.35,0,0];
    const cup=S3.add(new G.Node());const cg=cup.add(K3.glass(R,.12,.32,{lip:.01}));const cw=cup.add(R.mesh(K3.liquidGeom(.11,.02,.31,false),{color:H("#8EC5F2"),alpha:.45,order:1}));
    const paper=cup.add(R.mesh(G.box(.3,.004,.3,.002,1),{color:"#F7F5EE",rough:.9}));paper.pos=[0,.325,0];
    const boxN=S3.add(new G.Node());boxN.pos=[.45,0,0];const boxM=boxN.add(R.mesh(G.box(.2,.32,.13,.015,3),{color:"#E9EEF5",rough:.7}));boxM.pos=[0,.16,0];
    const boxBand=boxN.add(R.mesh(G.box(.205,.09,.135,.01,2),{color:"#2F7FD8",rough:.6}));boxBand.pos=[0,.2,0];
    const straw=boxN.add(R.mesh(G.tube([[.04,.31,0],[.04,.45,0],[.0,.52,0]],.008,8),{color:"#F2A9C4",rough:.5}));
    /* nhãn */
    K.label("Tấm mút",[-2.6+.25*2,.08,0],{view:"ran",dir:"e",len:30});const lBrick=K.label("Viên gạch 2 kg",[-2.6,.3,0],{view:"ran",dir:"n",len:16});
    const lH=HOLES.map((d,i)=>K.label(`Lỗ ${i+1} · sâu ${d*100} cm`,[TK.r*SC,(TK.y0+TK.lvl-d)*SC,0],{view:"long",dir:"w",len:90}));
    K.label("Mặt nước",[0,(TK.y0+TK.lvl)*SC+.01,TK.r*SC],{view:"long",dir:"n",len:30});
    K.label("Cốc nước đầy, đậy tờ giấy",[2.6-.35,.4,0],{view:"kq",dir:"n",len:20});K.label("Hộp sữa giấy",[2.6+.45+.1,.3,0],{view:"kq",dir:"e",len:20});
    /* ---------- cập nhật ---------- */
    K.onFrame((dt,rdt)=>{
      /* gạch */
      const f=FACE.find(x=>x.k===S.cur);const p=S.n*20/f.S;const dTo=p/4000*.03;S.dep+=(dTo-S.dep)*Math.min(1,rdt*3);
      bricks.forEach((b,i)=>{b.visible=i<S.n;const d=f.dims;b.scl=d;b.pos=[0,.08-S.dep+d[1]/2+i*d[1],0]});lBrick.p=[-2.6,(.08-S.dep+f.dims[1]*S.n)*2+.02,0];
      /* tia nước: mỗi lỗ mở phun hạt với vận tốc ngang v = √(2gh) */
      for(let i=0;i<3;i++){if(!S.open[i])continue;const h=HOLES[i],v=Math.sqrt(2*g*h);const n=dt*120;for(let q=0;q<n+(rnd()<n%1?1:0);q++)JP.push({x:TK.r,y:TK.y0+TK.lvl-h,vx:v*(.97+rnd()*.06),vy:(rnd()-.5)*.05,z:(rnd()-.5)*.01})}
      for(let i=JP.length-1;i>=0;i--){const P=JP[i];P.vy-=g*dt;P.x+=P.vx*dt;P.y+=P.vy*dt;if(P.y<.02||JP.length>880)JP.splice(i,1)}
      const D=jets.data;let c=0;for(const P of JP){if(c>=900)break;D.set([P.x*SC,P.y*SC,P.z*SC,.006*SC,1,1,1,1],c*8);c++}jets.setInstances(c);
      plugs.forEach((pl,i)=>pl.visible=!S.open[i]);
      /* cốc úp ngược */
      const U=S.cup;if(U.go)U.flip=Math.min(1,U.flip+rdt*.6);const a=Math.PI*(U.flip<.5?0:1)*0+Math.PI*C.ease.inOut(U.flip);
      cup.quat=G.Q.euler(0,0,a);cup.pos=[-.35+.0,.0+Math.sin(a)*.0+(U.flip>0?.34*Math.min(1,U.flip*2):0)+(U.flip>0?.12:0),0];
      if(U.flip>=1&&!S.cupDone){S.cupDone=true;rec("Úp ngược cốc nước đầy đậy tờ giấy","cột nước cao khoảng 10 cm: p ≈ 10 000 × 0,1 = 1 000 Pa","nước không chảy ra: áp suất khí quyển (khoảng 100 000 Pa) đẩy tờ giấy lên");refresh()}
      /* hộp sữa */
      const B=S.box;if(B.go)B.p=Math.min(1,B.p+rdt*.35);boxM.scl=[1-.45*B.p,1-.12*B.p,1-.55*B.p];boxM.pos=[0,.16*(1-.12*B.p),0];boxBand.scl=[1-.45*B.p,1,1-.55*B.p];
      if(B.p>=1&&!S.boxDone){S.boxDone=true;rec("Hút bớt không khí trong hộp sữa giấy","áp suất không khí trong hộp giảm","hộp bị bẹp theo nhiều phía: áp suất khí quyển bên ngoài lớn hơn bên trong");refresh()}});
    /* ---------- khay ---------- */
    K.dockFn(()=>{const v=K.view;
      if(v==="ran")return[{grid:FACE.map(f=>({k:"face",v:f.k,label:f.k==="nam"?"Đặt nằm":f.k==="nghieng"?"Đặt nghiêng":"Dựng đứng",icon:IC.grid,on:S.cur===f.k}))},{k:"n2",label:S.n===2?"Bỏ bớt 1 viên":"Xếp thêm 1 viên",icon:IC.plus,on:S.n===2}];
      if(v==="long")return HOLES.map((d,i)=>({k:"hole",v:String(i),label:S.open[i]?`Bịt lỗ ${i+1}`:`Mở lỗ ${i+1}`,icon:IC.drop,on:S.open[i]})).concat([{k:"allH",label:"Mở cả ba lỗ",icon:IC.drop}]);
      return[{k:"cup",label:"Úp ngược cốc",icon:IC.swap,dis:S.cup.go},{k:"box",label:"Hút không khí trong hộp",icon:IC.hand,dis:S.box.go},{k:"r3",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{if(k==="face"){S.cur=v;markFace()}else if(k==="n2"){S.n=S.n===2?1:2;if(S.n===2){S.stack2=true;markFace()}}
      else if(k==="hole"){S.open[+v]=!S.open[+v];markHoles()}else if(k==="allH"){S.open=[true,true,true];markHoles()}
      else if(k==="cup")S.cup.go=true;else if(k==="box")S.box.go=true;else if(k==="r3"){S.cup={flip:0,go:false};S.box={p:0,go:false}}refresh()});
    function markFace(){const f=FACE.find(x=>x.k===S.cur);const key=f.k+S.n;if(S["r_"+key])return;S["r_"+key]=1;if(S.n===1)S.face[f.k]=true;
      const F=20*S.n,p=F/f.S;rec(`${S.n} viên gạch đặt trên ${f.ten}`,`F = ${F} N; S = ${fmt(f.S*1e4,0)} cm² = ${fmt(f.S,3)} m²`,`p = F/S = ${fmt(p,0)} Pa; mút lún ${p>=4000?"sâu nhất":p>=2000?"vừa":"ít"}`)}
    function markHoles(){if(S.open.every(x=>x)&&!S.holesOpen){S.holesOpen=true;HOLES.forEach((h,i)=>{const v=Math.sqrt(2*g*h);const yh=TK.y0+TK.lvl-h;const t=Math.sqrt(2*yh/g);
        rec(`Mở lỗ ${i+1}, sâu ${h*100} cm`,`p = d·h = ${fmt(DW*h,0)} Pa; v = √(2gh) ≈ ${fmt(v,2)} m/s`,`tia nước chạm khay cách bình khoảng ${fmt(v*t*100,0)} cm`)})}}
    markFace();
    K.infoFn(()=>{const v=K.view;if(v==="ran"){const f=FACE.find(x=>x.k===S.cur);const F=20*S.n,p=F/f.S;return `<div><b>Áp suất chất rắn</b></div><div>Áp lực F = ${F} N</div><div>Diện tích bị ép S = ${fmt(f.S*1e4,0)} cm²</div><div>p = F/S = <b>${fmt(p,0)} Pa</b></div>`}
      if(v==="long")return `<div><b>Áp suất chất lỏng</b> (p = d·h)</div>${HOLES.map((h,i)=>`<div>Lỗ ${i+1}: h = ${h*100} cm · p = ${fmt(DW*h,0)} Pa</div>`).join("")}<small>Mực nước được giữ không đổi. Tia nước ở lỗ sâu hơn phun mạnh hơn.</small>`;
      return `<div><b>Áp suất khí quyển</b></div><div>p₀ ≈ 100 000 Pa (khoảng 76 cmHg)</div><small>Áp suất khí quyển tác dụng theo mọi phương.</small>`});
    K.timeLabel(()=>`t = ${fmt(K.simT,1)} s`);
    K.onReset(()=>{S.open=[false,false,false];JP.length=0;S.cup={flip:0,go:false};S.box={p:0,go:false};refresh()});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"face",v:FACE[(FACE.findIndex(f=>f.k===S.cur)+1)%FACE.length].k,p:[-2.6,.09,.19],tip:"Chạm để đổi cách đặt viên gạch",view:"ran"},...HOLES.map((d,i)=>({k:"hole",v:String(i),p:[TK.r*SC,(TK.y0+TK.lvl-d)*SC,0],tip:(S.open[i]?"Chạm để bịt lỗ ":"Chạm để mở lỗ ")+(i+1),view:"long"})),{k:"cup",p:[2.25,.42,0],tip:"Chạm để úp ngược cốc",view:"kq"},{k:"box",p:[3.15,.32,0],tip:"Chạm để hút không khí trong hộp",view:"kq"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    api.vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){["nam","nghieng","dung"].forEach(f=>{S.cur=f;markFace()});S.n=2;S.stack2=true;markFace();S.open=[true,true,true];markHoles();S.cup.go=true;S.box.go=true;refresh()}};
    return K.mount(st)}
});
})();
