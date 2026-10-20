/* K8-H-02 · Dung dịch và nồng độ; độ tan (SGK KHTN 8 – Kết nối tri thức, Bài 4) · 3D
   Trạm 1: pha 50 g dung dịch NaCl 10% (cân 5 g NaCl, đong 45 mL nước, khuấy tan).
   Trạm 2: pha 100 mL dung dịch CuSO₄ 0,1 M (cân 1,6 g CuSO₄ khan, thêm nước tới vạch 100 mL của bình định mức).
   Trạm 3: độ tan: thêm dần từng gam NaCl và KNO₃ vào 20 g nước ở 20 °C tới khi không tan thêm; đun tới 60 °C, KNO₃ tan thêm nhiều, NaCl gần như không. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON,fmt=C.fmt,H=G.hex;
/* độ tan (g/100 g nước), nội suy tuyến tính theo bảng thông dụng */
const SOL={NaCl:[[0,35.7],[20,35.9],[40,36.4],[60,37.1],[80,38],[100,39.2]],KNO3:[[0,13.3],[20,31.6],[40,63.9],[60,110],[80,169],[100,246]]};
const Sol=(k,T)=>{const t=SOL[k];for(let i=1;i<t.length;i++)if(T<=t[i][0]){const a=t[i-1],b=t[i];return a[1]+(b[1]-a[1])*(T-a[0])/(b[0]-a[0])}return t[t.length-1][1]};
const WATER=20;/* g nước trong mỗi cốc ở trạm độ tan */
const SPEC={
  predict:[{id:"p1",q:"Muốn pha 50 g dung dịch NaCl 10% cần cân bao nhiêu gam NaCl?",opts:[["5","5 g"],["10","10 g"],["50","50 g"]],ans:"5",res:"Khối lượng chất tan: m = C% × m(dd) / 100 = 10 × 50 / 100 = 5 g."},
    {id:"p2",q:"Khi tăng nhiệt độ, độ tan của KNO₃ trong nước thay đổi thế nào?",opts:[["tang","Tăng nhiều"],["giam","Giảm"],["khong","Gần như không đổi"]],ans:"tang",res:"Kết quả: ở 60 °C, KNO₃ tan nhiều gấp khoảng 3,5 lần so với ở 20 °C; NaCl gần như không đổi."}],
  taskLead:"Làm lần lượt ba trạm. Các bước cân, đong, khuấy, đun bấm ở khay.",
  tasks:[{html:"<b>Pha dung dịch NaCl 10%:</b> cân 5 g NaCl, đong 45 mL nước, đổ vào cốc và khuấy tan.",done:()=>S.nacl.done},
    {html:"<b>Pha dung dịch CuSO₄ 0,1 M:</b> cân 1,6 g CuSO₄, cho vào bình định mức, thêm nước tới vạch 100 mL, lắc đều.",done:()=>S.cuso4.done},
    {html:"<b>Độ tan ở 20 °C:</b> thêm dần từng gam NaCl và KNO₃ vào hai cốc nước cho tới khi không tan thêm.",done:()=>S.dt.sat20.NaCl&&S.dt.sat20.KNO3},
    {html:"<b>Ảnh hưởng của nhiệt độ:</b> đun hai cốc tới 60 °C rồi thêm tiếp chất tan.",done:()=>S.dt.sat60.KNO3&&S.dt.sat60.NaCl}],
  obs:[{id:"a",q:"Dung dịch thu được khi hòa tan 5 g NaCl vào 45 g nước có nồng độ:",opts:[["10","10%"],["11","11,1%"],["5","5%"]],ans:"10",why:"C% = m(chất tan) / m(dung dịch) × 100% = 5 / (5 + 45) × 100% = 10%. Không chia cho khối lượng nước."},
    {id:"b",q:"Hòa tan 1,6 g CuSO₄ (M = 160 g/mol) thành 100 mL dung dịch. Nồng độ mol:",opts:[["01","0,1 M"],["16","1,6 M"],["001","0,01 M"]],ans:"01",why:"n = 1,6 / 160 = 0,01 mol; C_M = n / V = 0,01 / 0,1 L = 0,1 mol/L."},
    {id:"c",q:"Ở 20 °C, cốc 20 g nước hòa tan tối đa khoảng 7 g NaCl. Độ tan của NaCl ở 20 °C khoảng:",opts:[["36","36 g trong 100 g nước"],["7","7 g trong 100 g nước"],["20","20 g trong 100 g nước"]],ans:"36",why:"Độ tan tính cho 100 g nước: 7,2 g × 100 / 20 = 36 g."}],
  concl:{html:`<div class="eq">C% = m<sub>ct</sub> / m<sub>dd</sub> × 100% &nbsp;&nbsp; C<sub>M</sub> = n / V &nbsp;&nbsp; S = m<sub>ct</sub> / m<sub>nước</sub> × 100</div><ul class="tlist">
    <li>Dung dịch là hỗn hợp đồng nhất của dung môi và chất tan.</li><li>Nồng độ phần trăm cho biết số gam chất tan trong 100 g dung dịch; nồng độ mol cho biết số mol chất tan trong 1 lít dung dịch.</li>
    <li>Độ tan của một chất trong nước là số gam chất đó hòa tan trong 100 g nước để tạo thành dung dịch bão hòa ở nhiệt độ, áp suất xác định.</li>
    <li>Độ tan của hầu hết chất rắn tăng khi nhiệt độ tăng (KNO₃ tăng mạnh, NaCl tăng rất ít).</li></ul>`,
    quiz:[{id:"q1",q:"Hòa tan 20 g đường vào 80 g nước. Nồng độ phần trăm dung dịch đường:",opts:[["a","20%"],["b","25%"],["c","80%"]],ans:"a",why:{b:"Phải chia cho khối lượng dung dịch (100 g), không chia cho khối lượng nước.",c:"80 g là khối lượng nước."}},
      {id:"q2",q:"Dung dịch bão hòa là dung dịch:",opts:[["a","Không thể hòa tan thêm chất tan ở nhiệt độ đó"],["b","Có nhiều nước"],["c","Có màu đậm"]],ans:"a",why:{b:"Lượng nước không quyết định bão hòa.",c:"Màu không quyết định bão hòa."}}],
    done:`<h2>Hoàn thành: Dung dịch và nồng độ</h2><p class="muted">C% = m<sub>ct</sub>/m<sub>dd</sub>·100%; C<sub>M</sub> = n/V; độ tan phụ thuộc nhiệt độ.</p>`},
  gv:["Yêu cầu học sinh tự tính lượng chất cần cân trước khi bấm cân.","Nhắc: đong nước, đọc vạch ngang đáy vòm khum.","Hỏi: vì sao phải thêm nước tới vạch chứ không đong sẵn 100 mL nước?","Liên hệ: pha nước muối sinh lí 0,9%."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 4)</p><ul class="tlist"><li>Nêu được dung dịch, chất tan, dung môi, độ tan; tính được nồng độ phần trăm, nồng độ mol; pha được một dung dịch theo nồng độ cho trước.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 4 Dung dịch và nồng độ.</li>
<li>Độ tan (g/100 g nước) dùng trong mô hình: NaCl khoảng 36 (20 °C) và 37 (60 °C); KNO₃ khoảng 32 (20 °C), 64 (40 °C), 110 (60 °C): giá trị của bảng độ tan thông dụng trong sách hóa học; trong phiên làm bài này chưa đối chiếu lại được với nguồn gốc, Thầy nên kiểm tra với bảng trong SGK.</li>
<li>Khối lượng mol CuSO₄ = 160 g/mol (Cu 64, S 32, O 16).</li></ul>`;

let S;
LabKHTN.register("K8-H-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"sl",t:"Số liệu"},{k:"kq",t:"Kết quả"}],empty:"Số liệu tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Bàn pha dung dịch: cân điện tử, ống đong, cốc, bình định mức; hai cốc thử độ tan NaCl và KNO₃",bench:[8,3],legend:{w:250},
      views:{nacl:{t:[-2.4,.6,0],yaw:0,pitch:.3,rad:1.05,label:"NaCl 10%",icon:IC.beaker},cuso4:{t:[0,.65,0],yaw:0,pitch:.28,rad:1.05,label:"CuSO₄ 0,1 M",icon:IC.tube},dotan:{t:[2.5,.55,0],yaw:0,pitch:.28,rad:1.1,label:"Độ tan",icon:IC.thermo}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,BN=BL.create(K),rnd=K.rnd;
    S={nacl:{m:0,w:0,stir:false,done:false},cuso4:{m:0,fill:0,shake:false,done:false},dt:{T:20,heat:false,add:{NaCl:0,KNO3:0},sat20:{},sat60:{}},recs:0};
    const rec=(tn,sl,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,sl,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    /* cân điện tử nhỏ dùng chung hình */
    function balance(x,z){const n=root.add(new G.Node());n.pos=[x,0,z];n.add(R.mesh(G.box(.6,.12,.5,.04,3),{color:"#E9ECEF",rough:.35,coat:.4})).pos=[0,.06,0];
      n.add(R.mesh(G.cylinder(.2,.02,32),{color:"#C9CED5",metal:.85,rough:.25})).pos=[0,.12,-.04];n.add(R.mesh(G.box(.3,.06,.08,.02,2),{color:"#2C313A"})).pos=[0,.1,.22];
      const L=K.label("0,00 g",[x,.14,z+.24],{cls:"plain lcd"});return L}
    /* ---------- trạm 1 ---------- */
    const balA=balance(-3.0,.15);const boatA=root.add(R.mesh(G.box(.22,.03,.22,.01,2),{color:"#F2F4F7",rough:.6}));boatA.pos=[-3.0,.15,.11];
    const saltOnBoat=BN.addSolid({x:-3.0,z:.11,y0:.13,yb:.03,inner:.09,isT:false,solids:[]},"crystal",{col:"#F7F7F4",n:60,size:.01,instant:true});saltOnBoat.m.setInstances(0);
    const cupA=BN.vessel({id:"A",kind:"beaker",x:-2.3,z:0,r:.28,h:.55,sol:{level:.03,a:.0}});
    const cylA=BN.vessel({id:"Acyl",kind:"tube",x:-1.75,z:0,r:.09,h:.95,y:0,sol:{col:"#CFE6FF",a:.0,level:.02}});
    K.label("Cân điện tử",[-3.3,.1,.15],{view:"nacl",dir:"w",len:20});K.label("Cốc pha",[-2.3,.6,0],{view:"nacl",dir:"n",len:14});K.label("Ống đong 50 mL",[-1.66,.9,0],{view:"nacl",dir:"e",len:20});
    /* ---------- trạm 2: bình định mức 100 mL ---------- */
    const balB=balance(-.65,.15);const flaskP=[.35,0,0];const flask=root.add(new G.Node());flask.pos=flaskP;
    const prof=[[0,0],[.26,0],[.32,.06],[.33,.18],[.28,.3],[.12,.38],[.055,.44],[.055,1.15],[.07,1.17],[.06,1.18],[.045,1.15],[.045,.44],[.1,.38],[.26,.3],[.3,.18],[.29,.07],[.24,.025],[0,.025]];
    flask.add(R.mesh(G.lathe(prof,48),{type:"glass",color:"#E2F1FF",alpha:.52}));
    const mark=flask.add(R.mesh(G.lathe([[.0565,.98],[.0565,.986]],32),{type:"unlit",color:"#1E2A40"}));
    const fLiq=flask.add(R.mesh(G.lathe([[0,.03],[.235,.03],[.28,.075],[.29,.18],[.255,.29],[.095,.37],[.042,.43],[.042,1.0],[0,1.0]],40),{color:H("#9ED0F7"),alpha:.0,rough:.04,coat:.6,order:1}));
    const LP=[[.03,.235],[.075,.28],[.18,.29],[.29,.255],[.37,.095],[.43,.042],[1.0,.042]];const rAt=y=>{for(let i=1;i<LP.length;i++)if(y<=LP[i][0]){const a=LP[i-1],b=LP[i];return a[1]+(b[1]-a[1])*(y-a[0])/(b[0]-a[0])}return .042};
    const fTop=flask.add(R.mesh(G.disk(1,0,40,true),{color:H("#9ED0F7"),alpha:.0,rough:.04,coat:.6,order:1}));
    const cuOnBoat=root.add(R.mesh(G.box(.14,.012,.14,.004,1),{color:"#E9EEF2",rough:.6}));cuOnBoat.pos=[-.65,.14,.11];
    const cuPow=BN.addSolid({x:-.65,z:.11,y0:.14,yb:.01,inner:.06,isT:false,solids:[]},"powder",{col:"#EDEFF0",n:40,size:.008,instant:true});cuPow.m.setInstances(0);
    const wash=BN.vessel({id:"wash",kind:"tube",x:1.0,z:.05,r:.12,h:.55,y:0,sol:{col:"#E3EEF9",a:.4,level:.45}});
    K.label("Bình định mức 100 mL",[.4,.9,0],{view:"cuso4",dir:"e",len:40});K.label("Vạch 100 mL",[.41,.98,0],{view:"cuso4",dir:"w",len:40});K.label("Bình nước cất",[1.0,.6,.05],{view:"cuso4",dir:"e",len:16});
    /* ---------- trạm 3 ---------- */
    const cups={NaCl:BN.vessel({id:"dNa",kind:"beaker",x:2.15,z:0,r:.22,h:.42,sol:{level:.2,a:.4}}),KNO3:BN.vessel({id:"dK",kind:"beaker",x:2.85,z:0,r:.22,h:.42,sol:{level:.2,a:.4}})};
    const exc={};for(const k in cups){const T=cups[k];exc[k]=root.add(R.instanced(G.box(1,1,1,.15,1),{color:"#F5F5F2",rough:.4},220));exc[k].P=Array.from({length:220},()=>({a:rnd()*6.283,r:Math.sqrt(rnd())*.17,y:rnd()*.03,s:.007+rnd()*.007}))}
    const hot=root.add(R.mesh(G.box(1.5,.06,.6,.03,3),{color:"#3A3F48",rough:.4}));hot.pos=[2.5,.03,0];cups.NaCl.n.pos[1]=cups.KNO3.n.pos[1]=.06;cups.NaCl.y0=cups.KNO3.y0=.06;
    const hotPlate=root.add(R.mesh(G.box(1.4,.012,.5,.01,1),{type:"unlit",color:"#3A3F48"}));hotPlate.pos=[2.5,.062,0];
    K.label("NaCl + 20 g nước",[2.15,.5,0],{view:"dotan",dir:"n",len:18});K.label("KNO₃ + 20 g nước",[2.85,.5,0],{view:"dotan",dir:"n",len:18});K.label("Bếp điện",[3.2,.04,.2],{view:"dotan",dir:"e",len:20});

    /* ================= cập nhật ================= */
    let balAshow=0,balBshow=0;
    K.onFrame((dt,rdt)=>{
      /* trạm 1 */
      const A=S.nacl;balAshow+=(A.m-balAshow)*Math.min(1,rdt*5);balA.set(`${fmt(Math.max(0,balAshow),2)} g`);saltOnBoat.m.setInstances(A.onBoat?Math.round(60*A.m/5):0);
      const D=saltOnBoat.m.data;let c=0;if(A.onBoat)for(const p of saltOnBoat.P.slice(0,Math.round(60*A.m/5))){D.set([-3.0+Math.cos(p.a)*p.r,.17+p.y*.2,.11+Math.sin(p.a)*p.r,p.s,1,1,1,1],c*8);c++}saltOnBoat.m.setInstances(c);
      cylA.level=.02+(A.wCyl||0)/50*.8;cylA.a=A.wCyl?.4:0;
      /* trạm 2 */
      const B=S.cuso4;balBshow+=(B.m-balBshow)*Math.min(1,rdt*5);balB.set(`${fmt(Math.max(0,balBshow),2)} g`);
      const D2=cuPow.m.data;let c2=0;if(B.onBoat)for(const p of cuPow.P.slice(0,Math.round(40*B.m/1.6))){D2.set([-.65+Math.cos(p.a)*p.r,.155+p.y*.2,.11+Math.sin(p.a)*p.r,p.s,1,1,1,1],c2*8);c2++}cuPow.m.setInstances(c2);
      if(B.filling){B.fill=Math.min(B.fillTo,B.fill+dt*.25);if(B.fill>=B.fillTo)B.filling=false}
      const fy=.03+B.fill*(B.fill<.9?.37/.9:1)*(B.fill<.9?1:0)+(B.fill>=.9?.4+(B.fill-.9)/.1*.58:0);fLiq.mat.clip=[0,-1,0,fy];
      const conc=B.mIn?(B.shake?1:.55):0;fLiq.mat.alpha=B.fill>0?.42+.3*conc:0;fLiq.mat.color=conc?H(B.shake?"#4C9BE6":"#8FC3EE"):H("#CFE6FF");
      const ra=rAt(fy);fTop.pos=[0,fy,0];fTop.scl=[ra,1,ra];fTop.mat.alpha=fLiq.mat.alpha;fTop.mat.color=fLiq.mat.color;fLiq.mat.clip=[0,-1,0,fy+flaskP[1]];
      /* trạm 3 */
      const T3=S.dt;if(T3.heat){T3.T=Math.min(60,T3.T+dt*3)}
      for(const k in cups){const T=cups[k];const smax=Sol(k,T3.T)*WATER/100;const add=T3.add[k];const ex=Math.max(0,add-smax);
        T.col=k==="NaCl"?H("#E7F1FA"):H("#E9F0F8");T.turbTgt=ex>0?.15:0;T.turbCol=H("#F3F3F0");
        const D=exc[k].data;let c=0;const n=Math.min(220,Math.round(ex*26));for(let i=0;i<n;i++){const p=exc[k].P[i];D.set([T.x+Math.cos(p.a)*p.r,T.y0+.035+p.y,T.z+Math.sin(p.a)*p.r,p.s,1,1,1,1],c*8);c++}exc[k].setInstances(c)}
      hotPlate.mat.color=T3.heat?H("#B93A1C"):H("#3A3F48")});
    /* ================= khay ================= */
    K.dockFn(()=>{const v=K.view,A=S.nacl,B=S.cuso4,T=S.dt;
      if(v==="nacl")return[{k:"cA",label:A.m>=5?"Đã cân 5 g NaCl":"Cân thêm 1 g NaCl",icon:IC.plus,dis:A.m>=5||A.inCup},{k:"wA",label:A.wCyl>=45?"Đã đong 45 mL":"Đong thêm 15 mL nước",icon:IC.drop,dis:A.wCyl>=45||A.w>0},
        {k:"toA",label:"Đổ muối và nước vào cốc",icon:IC.beaker,dis:!(A.m>=5&&A.wCyl>=45)||A.inCup},{k:"sA",label:"Khuấy",icon:IC.swap,dis:!A.inCup||A.stir},{k:"rA",label:"Làm lại",icon:IC.reset}];
      if(v==="cuso4")return[{k:"cB",label:B.m>=1.6?"Đã cân 1,6 g":"Cân thêm 0,4 g CuSO₄",icon:IC.plus,dis:B.m>=1.6||B.mIn},{k:"toB",label:"Cho vào bình định mức",icon:IC.tube,dis:B.m<1.6||B.mIn},
        {k:"fB",label:B.fill>=1?"Đã tới vạch":B.fill>=.5?"Thêm nước tới vạch":"Thêm nước tới nửa bình",icon:IC.drop,dis:!B.mIn||B.fill>=1||B.filling},{k:"shB",label:"Đậy nắp, lắc đều",icon:IC.swap,dis:B.fill<1||B.shake},{k:"rB",label:"Làm lại",icon:IC.reset}];
      return[{grid:[{k:"aNa",label:"Thêm 1 g NaCl",icon:IC.plus},{k:"aK",label:"Thêm 1 g KNO₃",icon:IC.plus}]},{k:"heat",label:T.heat?"Tắt bếp":"Bật bếp (tới 60 °C)",icon:IC.fire,on:T.heat},{k:"rC",label:"Làm lại",icon:IC.reset}]});
    K.onDock(k=>{const A=S.nacl,B=S.cuso4,T=S.dt;
      if(k==="cA"){A.onBoat=true;A.m=Math.min(5,A.m+1)}else if(k==="wA"){A.wCyl=Math.min(45,(A.wCyl||0)+15)}
      else if(k==="toA"){A.inCup=true;A.onBoat=false;const sd=BN.addSolid(cupA,"crystal",{col:"#F7F7F4",n:70,size:.011});BN.dropSolid(sd,()=>{BN.pour(cupA,.32,"#E9F2FB",()=>{A.wCyl=0;A.w=45;cupA.a=.4;refresh()})});A.m=0;A.sd=sd}
      else if(k==="sA"){A.stir=true;if(A.sd)A.sd.rate=.25;setTimeout(()=>{A.done=true;rec("Pha 50 g dung dịch NaCl 10%","m(NaCl) = 5 g; m(nước) = 45 g (45 mL)","C% = 5 / 50 × 100% = 10%");api.toast("Muối tan hết: đã có 50 g dung dịch NaCl 10%.","ok",2400);refresh()},2500)}
      else if(k==="rA"){S.nacl={m:0,w:0,stir:false,done:S.nacl.done};cupA.reset();}
      else if(k==="cB"){B.onBoat=true;B.m=Math.round((B.m+.4)*10)/10}else if(k==="toB"){B.mIn=true;B.onBoat=false;B.m=0}
      else if(k==="fB"){B.filling=true;B.fillTo=B.fill>=.5?1:.5}
      else if(k==="shB"){B.shake=true;B.done=true;rec("Pha 100 mL dung dịch CuSO₄ 0,1 M","m(CuSO₄) = 1,6 g → n = 1,6 / 160 = 0,01 mol; V = 100 mL","C_M = 0,01 / 0,1 = 0,1 M; dung dịch màu xanh lam đồng đều");refresh()}
      else if(k==="rB"){S.cuso4={m:0,fill:0,shake:false,done:S.cuso4.done}}
      else if(k==="aNa"||k==="aK"){const kk=k==="aNa"?"NaCl":"KNO3";const smax=Sol(kk,T.T)*WATER/100;if(T.add[kk]>smax+.5){api.toast("Đã có chất rắn không tan nằm ở đáy cốc: dung dịch đã bão hòa.","info",2200)}
        T.add[kk]+=1;const after=Math.max(0,T.add[kk]-smax);
        if(after>0){const tag=T.T>=59?"sat60":T.T<=21?"sat20":null;if(tag&&!T[tag][kk]){T[tag][kk]=true;rec(`Độ tan của ${kk==="NaCl"?"NaCl":"KNO₃"} ở ${fmt(T.T,0)} °C`,`20 g nước hòa tan tối đa khoảng ${fmt(smax,1)} g`,`S ≈ ${fmt(smax*100/WATER,1)} g / 100 g nước`)}}}
      else if(k==="heat"){T.heat=!T.heat}else if(k==="rC"){S.dt={T:20,heat:false,add:{NaCl:0,KNO3:0},sat20:S.dt.sat20,sat60:S.dt.sat60}}
      refresh()});
    K.infoFn(()=>{const v=K.view;if(v==="nacl"){const A=S.nacl;return `<div><b>Pha 50 g dung dịch NaCl 10%</b></div><div>Cân: ${fmt(A.m,2)} g · ống đong: ${A.wCyl||0} mL</div><small>m(NaCl) = 10 × 50 / 100 = 5 g; m(nước) = 50 − 5 = 45 g ≈ 45 mL.</small>`}
      if(v==="cuso4"){const B=S.cuso4;return `<div><b>Pha 100 mL CuSO₄ 0,1 M</b></div><div>Cân: ${fmt(B.m,1)} g · bình: ${B.fill>=1?"tới vạch 100 mL":B.fill>0?"khoảng nửa bình":"chưa có nước"}</div><small>n = 0,1 × 0,1 = 0,01 mol; m = 0,01 × 160 = 1,6 g.</small>`}
      const T=S.dt;const row=k=>{const smax=Sol(k,T.T)*WATER/100,a=T.add[k];return `<div>${k==="NaCl"?"NaCl":"KNO₃"}: đã thêm ${a} g · tan tối đa ${fmt(smax,1)} g${a>smax?" · <b>bão hòa</b>":""}</div>`};
      return `<div><b>Độ tan</b> · nhiệt độ ${fmt(T.T,0)} °C</div>${row("NaCl")}${row("KNO3")}<small>Mỗi cốc 20 g nước.</small>`});
    K.timeLabel(()=>K.view==="dotan"?`Nhiệt độ hai cốc: ${fmt(S.dt.T,0)} °C`:`t = ${fmt(K.simT,1)} s`);
    K.onReset(()=>{S.nacl={m:0,w:0,stir:false,done:false};S.cuso4={m:0,fill:0,shake:false,done:false};S.dt={T:20,heat:false,add:{NaCl:0,KNO3:0},sat20:{},sat60:{}};BN.resetAll();refresh()});
    /* trạm tự động */K.autoStations&&K.autoStations();
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"cA",p:[-3.0,.15,.05],tip:"Chạm cân để cân thêm 1 g NaCl",view:"nacl"},{k:"wA",p:[-1.75,.75,0],tip:"Chạm ống đong để đong thêm 15 mL nước",view:"nacl"},{k:"toA",p:[-2.3,.62,0],tip:"Chạm cốc để đổ muối và nước vào",view:"nacl"},{k:"sA",p:[-2.3,.45,0],tip:"Chạm để khuấy",view:"nacl"},{k:"cB",p:[-.65,.15,.05],tip:"Chạm cân để cân thêm 0,4 g CuSO₄",view:"cuso4"},{k:"toB",p:[.35,.45,0],tip:"Chạm bình để cho CuSO₄ vào",view:"cuso4"},{k:"fB",p:[1.0,.5,.05],tip:"Chạm bình nước cất để thêm nước",view:"cuso4"},{k:"shB",p:[.35,.3,0],tip:"Chạm để đậy nắp, lắc đều",view:"cuso4"},{k:"heat",p:[3.2,.08,.2],tip:"Chạm để bật / tắt bếp",view:"dotan"}]);
    K.start();
    api.vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),press:k=>{K._dockH(k);K.refreshDock()},
      auto(){const P=k=>{K._dockH(k)};const q=["cA","cA","cA","cA","cA","wA","wA","wA","toA","@4","sA","cB","cB","cB","cB","toB","fB","@6","fB","@6","shB"];
        for(let i=0;i<9;i++)q.push("aNa","aK");q.push("heat","@40");for(let i=0;i<20;i++)q.push("aK");q.push("aNa");
        let i=0;const go=()=>{if(i>=q.length)return;const k=q[i++];if(k[0]==="@"){setTimeout(go,+k.slice(1)*1000);return}if(BN.busy()){i--;return setTimeout(go,300)}P(k);setTimeout(go,120)};go()}};
    return K.mount(st)}
});
})();
