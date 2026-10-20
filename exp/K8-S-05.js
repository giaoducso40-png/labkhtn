/* K8-S-05 · Hô hấp, trao đổi khí ở phổi (SGK KHTN 8 – Kết nối tri thức, Bài 34) · 3D
   Ba trạm:
   1. Lồng ngực: khí quản, phế quản, hai lá phổi, xương sườn, cơ hoành; hít vào cơ hoành co (hạ xuống), xương sườn nâng lên, phổi nở;
      đồ thị thể tích khí trong phổi theo thời gian (thở thường, thở sâu).
   2. Phế nang: túi phế nang bao quanh bởi mao mạch; O₂ khuếch tán từ phế nang vào máu, CO₂ từ máu ra phế nang;
      máu đỏ thẫm (nghèo O₂) đổi thành đỏ tươi (giàu O₂) dọc mao mạch.
   3. Nước vôi trong: thổi khí thở ra vào ống 1, bơm không khí vào ống 2; ống 1 vẩn đục nhanh (CaCO₃) vì khí thở ra có nhiều CO₂. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,B=window.LabBody,KIT=window.LabKit,IC=KIT.ICON;
const fmt=C.fmt,H=G.hex;

/* thành phần không khí hít vào và thở ra (% thể tích): Đại học Glasgow, tài liệu thực hành sinh lí thể thao */
const AIR={in:{O2:20.93,CO2:.03,N2:79.04},out:{O2:16.8,CO2:4.1,N2:79.1}};
const VT=.5,VDEEP=3.0,FRC=2.4;   /* lít: khí lưu thông khi thở thường, thở sâu; khí còn lại cuối thở ra (giá trị điển hình người trưởng thành, minh họa) */

const SPEC={
  predict:[
    {id:"p1",q:"Khi hít vào, cơ hoành và lồng ngực thay đổi thế nào?",opts:[["co","Cơ hoành co, hạ xuống; lồng ngực nở rộng"],["dan","Cơ hoành dãn, nâng lên; lồng ngực thu nhỏ"],["khong","Không thay đổi"]],ans:"co",res:"Kết quả: hít vào, cơ hoành co và hạ xuống, xương sườn nâng lên, thể tích lồng ngực tăng."},
    {id:"p2",q:"Thổi khí thở ra vào nước vôi trong qua ống hút, nước vôi sẽ:",opts:[["duc","Vẩn đục"],["trong","Vẫn trong"],["xanh","Chuyển màu xanh"]],ans:"duc",res:"Kết quả: nước vôi vẩn đục vì khí thở ra có nhiều CO₂."}],
  taskLead:"Chọn trạm ở khay. Trạm lồng ngực chạy theo nhịp thở; có thể chạy chậm 0,25× để quan sát.",
  tasks:[
    {html:"<b>Lồng ngực:</b> quan sát ít nhất 2 nhịp thở thường (hít vào – thở ra).",done:()=>S.breaths>=2},
    {html:"<b>Thở sâu:</b> bấm “Hít sâu, thở ra hết” và đọc thể tích khí trên đồ thị.",done:()=>S.deepRec},
    {html:"<b>Phế nang:</b> quan sát trao đổi khí ít nhất 20 giây.",done:()=>S.alvT>=20},
    {html:"<b>Nước vôi trong:</b> thổi khí thở ra vào ống 1 và bơm không khí vào ống 2, đợi tới khi ghi kết quả.",done:()=>S.lime.rec}],
  obs:[
    {id:"a",q:"Vì sao khi hít vào, không khí đi vào phổi?",opts:[["v","Lồng ngực nở, thể tích phổi tăng, áp suất trong phổi giảm nên không khí từ ngoài tràn vào"],["day","Mũi đẩy không khí vào"],["tim","Tim hút không khí vào"]],ans:"v",why:"Cơ hoành và cơ liên sườn ngoài co làm lồng ngực rộng ra, phổi nở theo; áp suất trong phổi thấp hơn bên ngoài nên không khí đi vào."},
    {id:"b",q:"Ở phế nang, khí O₂ đi theo chiều nào?",opts:[["vao","Từ phế nang vào máu trong mao mạch"],["ra","Từ máu ra phế nang"],["dung","Không di chuyển"]],ans:"vao",why:"Nồng độ O₂ trong phế nang cao hơn trong máu nghèo O₂ nên O₂ khuếch tán vào máu; CO₂ đi theo chiều ngược lại."},
    {id:"c",q:"Ống nước vôi trong nào vẩn đục nhanh hơn?",opts:[["thoi","Ống 1 (thổi khí thở ra)"],["bom","Ống 2 (bơm không khí)"],["nhu","Như nhau"]],ans:"thoi",why:"Khí thở ra chứa khoảng 4% CO₂, gấp hơn 100 lần không khí (khoảng 0,03%)."}],
  concl:{html:`<div class="eq">CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O</div><ul class="tlist">
    <li>Hệ hô hấp gồm đường dẫn khí (mũi, họng, thanh quản, khí quản, phế quản) và hai lá phổi; đơn vị cấu tạo của phổi là phế nang.</li>
    <li>Thông khí ở phổi nhờ cử động hô hấp: hít vào (cơ hoành, cơ liên sườn ngoài co, lồng ngực nở) và thở ra (các cơ dãn, lồng ngực thu nhỏ).</li>
    <li>Trao đổi khí ở phổi theo cơ chế khuếch tán: O₂ từ phế nang vào máu, CO₂ từ máu vào phế nang.</li>
    <li>Khí thở ra có ít O₂ hơn (khoảng 16–17%) và nhiều CO₂ hơn (khoảng 4%) so với khí hít vào (khoảng 21% O₂ và 0,03% CO₂).</li></ul>`,
    quiz:[
      {id:"q1",q:"Cơ quan thực hiện trao đổi khí giữa cơ thể và môi trường là:",opts:[["phoi","Phổi"],["kq","Khí quản"],["mui","Mũi"]],ans:"phoi",why:{kq:"Khí quản chỉ dẫn khí.",mui:"Mũi dẫn, làm ấm, làm ẩm và lọc không khí."}},
      {id:"q2",q:"Nên thở bằng mũi vì:",opts:[["loc","Mũi có lông, lớp niêm mạc tiết chất nhầy và mạch máu giúp lọc, làm ẩm, làm ấm không khí"],["nhanh","Thở bằng mũi nhanh hơn"],["nhieu","Mũi lấy được nhiều O₂ hơn"]],ans:"loc",why:{nhanh:"Lí do chính là bảo vệ đường hô hấp.",nhieu:"Lượng O₂ không phụ thuộc thở bằng mũi hay miệng."}},
      {id:"q3",q:"Việc làm nào có hại cho hệ hô hấp?",opts:[["thuoc","Hút thuốc lá, hít khói thuốc"],["the","Tập thể dục đều đặn"],["cay","Trồng cây xanh"]],ans:"thuoc",why:{the:"Tập thể dục giúp tăng dung tích sống.",cay:"Cây xanh giúp không khí trong lành hơn."}}],
    done:`<h2>Hoàn thành: Hô hấp và trao đổi khí ở phổi</h2><p class="muted">Hít vào – thở ra nhờ cơ hoành và lồng ngực; O₂ vào máu, CO₂ ra phế nang theo khuếch tán.</p>`},
  gv:["Cho học sinh đặt tay lên ngực, hít sâu để tự cảm nhận lồng ngực nâng lên.","Chạy 0,25× ở trạm lồng ngực; hỏi: cơ hoành đang co hay dãn?","Hỏi: máu đi vào mao mạch phổi có màu gì, đi ra có màu gì? Vì sao?","An toàn khi làm thật: chỉ thổi, không hút ngược ống; mỗi em một ống hút riêng."]
};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 34)</p><ul class="tlist"><li>Nêu được chức năng của hệ hô hấp; mô tả cử động hô hấp và sự trao đổi khí ở phổi.</li><li>Thực hiện được thí nghiệm chứng minh khí thở ra có CO₂ (thí nghiệm bổ sung).</li></ul>`;
const SRC=`<ul class="tlist"><li>Thành phần khí hít vào (O₂ 20,93%, CO₂ 0,03%) và ví dụ khí thở ra (O₂ 16,8%, CO₂ 4,1%): <a href="https://www.mvls.gla.ac.uk/Teaching/SLS-ExSci/exsci2.html" target="_blank" rel="noopener">University of Glasgow – Exercise Science, gas analysis</a>.</li>
<li>Cơ chế hít vào, thở ra và trao đổi khí ở phế nang: <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/22-3-the-process-of-breathing" target="_blank" rel="noopener">OpenStax Anatomy and Physiology 2e, mục 22.3</a>.</li>
<li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 34 Hệ hô hấp ở người.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Khí lưu thông 0,5 L, thở sâu khoảng 3 L, khí còn lại sau thở ra thường khoảng 2,4 L: giá trị điển hình, mỗi người khác nhau.</li><li>Phổi, xương sườn, cơ hoành vẽ giản lược; độ nở của phổi được phóng đại để dễ thấy. Tốc độ vẩn đục của nước vôi tỉ lệ với % CO₂ (minh họa).</li></ul>`;

let S;
LabKHTN.register("K8-S-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D hệ hô hấp: lồng ngực, phổi, phế nang và thí nghiệm nước vôi trong",legend:{w:250},
      views:{nguc:{t:[0,1.25,0],yaw:.3,pitch:.12,rad:1.35,label:"Lồng ngực",icon:IC.eye},phenang:{t:[12,0,0],yaw:.3,pitch:.25,rad:1.25,label:"Phế nang",icon:IC.cell},voi:{t:[-12,.55,0],yaw:0,pitch:.2,rad:1.05,label:"Nước vôi",icon:IC.tube}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,rnd=K.rnd;
    S={breaths:0,phase:0,rate:16,deep:null,deepRec:false,vol:FRC,hist:[],alvT:0,lime:{blow:false,pump:false,t:[0,0],tur:[0,0],rec:false},recs:0,lastIn:false};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};

    /* ================= trạm 1: lồng ngực (mô hình giải phẫu từ LabOrgans) ================= */
    const chest=root.add(new G.Node());
    const tis=(o)=>Object.assign({color:"#FFFFFF",rough:.5,wrap:.5,sheen:.35,coat:.2,hooks:KIT.TISSUE,uniforms:{uBump:.07,uNF:18}},o||{});
    const lungN=[chest.add(new G.Node()),chest.add(new G.Node())];const LC=[[-.48,1.0,-.05],[.48,1.0,-.05]];
    let dia=chest.add(new G.Node()),parts=null;
    const loadEl=document.createElement("div");loadEl.className="gl-loading glass";loadEl.innerHTML=`<i aria-hidden="true"></i>Đang dựng mô hình hệ hô hấp…`;K.over.appendChild(loadEl);
    window.LabOrgans.build("buildBody",44).then(g=>{if(K.dead)return;chest.add(R.mesh(g,{color:"#F2C6A8",alpha:.1,rough:.6,order:-2,transparent:true}))});
    window.LabOrgans.build("buildRespiratory").then(P=>{if(K.dead)return;parts=P;
      lungN[0].add(R.mesh(P.lungR,tis({alpha:.93,transparent:true,order:1,uniforms:{uBump:.09,uNF:26}})));lungN[1].add(R.mesh(P.lungL,tis({alpha:.93,transparent:true,order:1,uniforms:{uBump:.09,uNF:26}})));
      chest.add(R.mesh(P.tree,tis({rough:.45,uniforms:{uBump:.03,uNF:30}})));chest.add(R.mesh(P.trachea,tis({uniforms:{uBump:.04,uNF:30}})));chest.add(R.mesh(P.rings,tis({rough:.4,uniforms:{uBump:.02,uNF:30}})));
      chest.add(R.mesh(P.larynx,tis({rough:.4,uniforms:{uBump:.02,uNF:30}})));dia.add(R.mesh(P.dia,tis({side:"double",uniforms:{uBump:.12,uNF:14}})));
      loadEl.classList.add("out");setTimeout(()=>loadEl.remove(),400)});
    /* mũi, họng */
    chest.add(R.mesh(G.tube(G.spline([[0,2.42,.33],[0,2.4,.2],[0,2.3,-.02],[0,2.12,-.07],[0,1.98,-.09]],8),t=>.05-.012*t,14),tis({color:"#E3A79E"})));
    /* xương sườn: 7 đôi cung từ cột sống ra trước, chếch xuống; sụn sườn nối xương ức */
    const ribs=chest.add(new G.Node());const ribNodes=[];const boneM={color:"#F1E8D8",rough:.42,coat:.25,alpha:.6,transparent:true,order:3};
    for(let k=0;k<8;k++){const y=1.58-k*.12,w=Math.sin(Math.PI*(k+1.6)/10),rx=.66+.3*w,rz=.36+.12*w;const n=ribs.add(new G.Node());n.pos=[0,y,-.06];
      for(const sd of [1,-1]){const pts=[];for(let i=0;i<=30;i++){const t=i/30,a=Math.PI*(1-.82*t);pts.push([sd*Math.sin(a)*rx,-.32*t*t+.04*Math.sin(t*Math.PI),-Math.cos(a)*rz])}
        n.add(R.mesh(G.tube(pts,.015,8),boneM));const e=pts[pts.length-1];n.add(R.mesh(G.tube(G.spline([e,[sd*.12,e[1]-.03,e[2]+.02],[sd*.05,e[1]+.05,rz+.02]],5),.015,6),{color:"#DCE6EC",rough:.5,alpha:.8,transparent:true,order:2}))}
      ribNodes.push(n)}
    const spine=chest.add(R.mesh(G.tube([[0,1.75,-.5],[0,1.1,-.56],[0,.3,-.5]],.05,12),{color:"#E6DAC4",rough:.5}));
    for(let k=0;k<12;k++)chest.add(R.mesh(G.cylinder(.07,.05,16),{color:"#EFE4D0",rough:.5})).pos=[0,.35+k*.12,-.53];
    const sternum=chest.add(R.mesh(G.box(.1,.62,.04,.02,3),boneM));sternum.pos=[0,1.1,.36];
    const air=root.add(K3.puffs(R,120,"#BFE3FF"));
    /* ================= trạm 2: phế nang ================= */
    const AX=12;const alv=root.add(new G.Node());alv.pos=[AX,0,0];
    const sacs=[];const SC=[[0,0,0,.42],[.55,.25,.1,.32],[-.5,.28,.05,.33],[.1,.62,-.1,.3],[.35,-.45,.15,.3],[-.4,-.4,.1,.3],[0,.05,.5,.28]];
    for(const [x,y,z,r] of SC){const m=alv.add(R.mesh(G.sphere(r,32,22),tis("#F3B6C0",.42,{order:-1,uniforms:{uBump:.04,uNF:10}})));m.pos=[x,y,z];sacs.push({c:[x+AX,y,z],r})}
    alv.add(R.mesh(G.tube([[0,-1.3,0],[0,-.9,0],[0,-.42,0]],.09,14),tis("#EBC9BE",.9)));
    /* mao mạch: ống uốn quanh cụm phế nang, màu đổi từ đỏ thẫm sang đỏ tươi */
    const capPts=[];for(let i=0;i<=120;i++){const t=i/120,a=t*Math.PI*5.2;capPts.push([Math.cos(a)*.62,-.75+t*1.5,Math.sin(a)*.62+.05])}
    const capG=G.tube(capPts,.05,10);{const n=capG.pos.length/3;capG.col=new Float32Array(n*4);const dark=H("#5B1724"),bright=H("#E3263A");
      for(let i=0;i<n;i++){const t=C.clamp((capG.pos[i*3+1]+.75)/1.5,0,1);const c=dark.map((v,k)=>v+(bright[k]-v)*C.clamp(t*1.6-.2,0,1));capG.col.set([...c,1],i*4)}}
    alv.add(R.mesh(capG,{color:"#FFFFFF",rough:.35,coat:.4}));
    const gasO=root.add(R.instanced(G.sphere(1,10,8),{type:"unlit",color:"#FFFFFF"},300));
    const GP=Array.from({length:240},(_,i)=>({o:i%2===0,t:rnd(),sac:Math.floor(rnd()*SC.length),ph:rnd()*6.28,cap:rnd()}));

    /* ================= trạm 3: nước vôi trong ================= */
    const VX=-12;const lime=root.add(new G.Node());lime.pos=[VX,0,0];lime.add(K3.bench(R,2.6,1.4,api.day));
    const TBX=[-.35,.35];const tubes=TBX.map(x=>{const n=lime.add(new G.Node());n.pos=[x,.05,0];n.add(K3.testTube(R,.13,1.05));
      const liq=n.add(R.mesh(K3.liquidGeom(.117,.013,.55,true),{color:H("#E8F2FB"),alpha:.35,rough:.04,coat:.6,order:1}));return{n,liq}});
    const rack=lime.add(new G.Node());rack.add(R.mesh(G.box(1.1,.05,.4,.02,2),{color:"#9C6B3F",rough:.55})).pos=[0,.025,0];rack.add(R.mesh(G.box(1.1,.05,.4,.02,2),{color:"#9C6B3F",rough:.55})).pos=[0,.32,0];
    for(const sx of [-.53,.53])rack.add(R.mesh(G.box(.05,.32,.4,.012,2),{color:"#9C6B3F",rough:.55})).pos=[sx,.17,0];
    /* ống hút (ống 1), bóng bóp cao su nối ống dẫn (ống 2) */
    const straw=lime.add(R.mesh(G.tube([[TBX[0]+.03,.12,0],[TBX[0]+.03,1.25,0],[TBX[0]-.12,1.5,0]],.018,10),{type:"glass",color:"#F4FBFF",alpha:.6}));
    const hose=lime.add(R.mesh(G.tube(G.spline([[TBX[1]+.03,.12,0],[TBX[1]+.03,1.2,0],[TBX[1]+.3,1.45,0],[TBX[1]+.55,1.25,0]],8),.02,10),{color:"#3B3F45",rough:.6}));
    const bulb=lime.add(R.mesh(G.sphere(.15,24,16),{color:"#B91C1C",rough:.5,coat:.4}));bulb.pos=[TBX[1]+.62,1.1,0];bulb.scl=[1,1.3,1];
    const fizz=root.add(K3.bubbles(R,400));

    /* ================= nhãn ================= */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    lab("Khí quản",[.07,1.6,-.1],"nguc",{dir:"e",len:50});lab("Phế quản",[.22,1.13,-.08],"nguc",{dir:"e",len:60});lab("Thanh quản",[.1,2.05,-.04],"nguc",{dir:"e",len:40});
    lab("Mũi, họng",[0,2.38,.25],"nguc",{dir:"w",len:40});
    lab("Lá phổi phải",[-.7,1.05,.1],"nguc",{dir:"w",len:40});lab("Lá phổi trái",[.7,1.05,.1],"nguc",{dir:"e",len:40});
    lab("Cơ hoành",[.6,.55,.2],"nguc",{dir:"e",len:40});lab("Xương sườn",[-.92,1.3,.1],"nguc",{dir:"w",len:30});lab("Xương ức",[0,.85,.38],"nguc",{dir:"s",len:30});
    const lPN=lab("Phế nang",[AX-.3,.35,.35],"phenang",{dir:"w",len:50});lab("Mao mạch",[AX+.62,.2,.05],"phenang",{dir:"e",len:50});
    lab("Phế quản nhỏ",[AX,-1.1,0],"phenang",{dir:"s",len:20});
    const lT1=lab("Ống 1: thổi khí thở ra",[VX+TBX[0]-.13,.5,0],"voi",{dir:"w",len:30}),lT2=lab("Ống 2: bơm không khí",[VX+TBX[1]+.13,.5,0],"voi",{dir:"e",len:30});
    const lPhase=lab("",[0,2.62,0],"nguc",{dir:"n",len:12});

    /* ================= mô phỏng ================= */
    /* thể tích phổi: thở thường dao động FRC → FRC+VT theo nhịp; thở sâu: hít tới FRC+VDEEP rồi thở ra hết */
    let lastT=0,inhaling=false;
    function breathVol(t){const per=60/S.rate;const ph=(t%per)/per;const insp=.4;/* hít vào 40% chu kì */
      const f=ph<insp?.5-.5*Math.cos(Math.PI*ph/insp):.5+.5*Math.cos(Math.PI*(ph-insp)/(1-insp));return{v:FRC+VT*f,inh:ph<insp}}
    K.onFrame((dt)=>{const t=K.simT;let v,inh;
      if(S.deep){const d=S.deep;d.t+=dt;const T1=2.5,T2=1.2,T3=3.5;/* hít sâu, nín, thở ra hết */
        if(d.t<T1){v=d.v0+(FRC+VDEEP-d.v0)*(.5-.5*Math.cos(Math.PI*d.t/T1));inh=true}else if(d.t<T1+T2){v=FRC+VDEEP;inh=false}
        else if(d.t<T1+T2+T3){const k=(d.t-T1-T2)/T3;v=FRC+VDEEP-(VDEEP+1.2)*(.5-.5*Math.cos(Math.PI*k));inh=false}
        else{v=FRC-1.2+(FRC-(FRC-1.2))*Math.min(1,(d.t-T1-T2-T3)/1.5);inh=false;if(d.t>T1+T2+T3+1.5){S.deep=null;
          if(!S.deepRec){S.deepRec=true;rec("Hít vào sâu hết sức rồi thở ra hết sức",`thể tích khí trong phổi từ ${fmt(FRC+VDEEP,1)} L xuống ${fmt(FRC-1.2,1)} L: dung tích sống ≈ ${fmt(VDEEP+1.2,1)} L (thở thường mỗi nhịp ≈ ${fmt(VT,1)} L)`)}refresh()}}}
      else{const b=breathVol(t);v=b.v;inh=b.inh}
      if(inh&&!inhaling&&!S.deep){S.breaths+=0}if(!inh&&inhaling&&!S.deep){S.breaths++;if(S.breaths===2)refresh()}inhaling=inh;
      S.vol=v;S.inh=inh;chest.visible=K.view==="nguc";if(t-lastT>.1){S.hist.push([t,v]);lastT=t;if(S.hist.length>220)S.hist.shift()}
      /* biến dạng: phổi nở, cơ hoành hạ và dẹt lại, xương sườn nâng */
      const e=(v-FRC)/VT;const k=C.clamp(e,-2.4,6);const ls=1+.03*k;lungN.forEach((n,i)=>{const c=LC[i];const sc=[ls,1+.04*k,ls];n.scl=sc;n.pos=[c[0]*(1-sc[0]),c[1]*(1-sc[1])-.025*k,c[2]*(1-sc[2])]});
      dia.pos=[0,-.035*k,0];dia.scl=[1,Math.max(.4,1-.05*k),1];
      ribNodes.forEach((n,i)=>{n.quat=G.Q.euler(-.03*k*(1-i/10),0,0)});sternum.pos=[0,1.1+.008*k,.36+.015*k];
      /* luồng khí: đi vào khi hít, đi ra khi thở */
      if(dt>0&&K.view==="nguc"&&rnd()<dt*30){const dir=inh?-1:1;air.spawn([(rnd()-.5)*.04,inh?1.95:1.25,-.1],.025,[0,dir*.7,0],1.0,.4,.6)}air.step(dt);
      lPhase.set(S.deep?(S.deep.t<2.5?"Hít vào sâu":S.deep.t<3.7?"Nín thở":"Thở ra hết sức"):inh?"Hít vào: cơ hoành co, lồng ngực nở":"Thở ra: cơ hoành dãn, lồng ngực thu nhỏ");
      /* phế nang */
      if(K.view==="phenang")S.alvT+=dt;if(S.alvT>=20&&!S.alvRec){S.alvRec=true;refresh()}
      const D=gasO.data;let c=0;const O=H("#2563EB"),CO=H("#9CA3AF");
      for(const g of GP){g.t+=dt*.25;if(g.t>1){g.t-=1;g.sac=Math.floor(rnd()*SC.length);g.cap=rnd()}const s=sacs[g.sac];
        /* O₂: tâm phế nang → thành → mao mạch; CO₂: ngược lại */
        const cp=capPts[Math.floor(g.cap*120)];const capW=[cp[0]+AX,cp[1],cp[2]];const ins=[s.c[0]+Math.cos(g.ph)*s.r*.5,s.c[1]+Math.sin(g.ph*1.3)*s.r*.5,s.c[2]+Math.sin(g.ph)*s.r*.4];
        const a=g.o?ins:capW,b=g.o?capW:ins;const u=C.clamp(g.t,0,1);const p=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];const col=g.o?O:CO;
        D.set([p[0],p[1],p[2],.028,col[0],col[1],col[2],1],c*8);c++}gasO.setInstances(K.view==="phenang"?c:0);
      /* nước vôi */
      const L=S.lime;[L.blow,L.pump].forEach((on,i)=>{if(!on)return;L.t[i]+=dt;const co2=i?AIR.in.CO2:AIR.out.CO2;L.tur[i]=Math.min(1,L.tur[i]+dt*co2*.012);
        if(rnd()<dt*40)fizz.spawn([VX+TBX[i]+.03+(rnd()-.5)*.03,.15,(rnd()-.5)*.03],.012+rnd()*.012,[(rnd()-.5)*.03,.35+rnd()*.15,(rnd()-.5)*.03],1.2,.9)});
      fizz.step(dt,b=>{if(b.p[1]>.6)b.dead=true});
      tubes.forEach((T,i)=>{const tu=L.tur[i];T.liq.mat.color=[.91+.05*tu,.95+.02*tu,.98-.02*tu];T.liq.mat.alpha=.35+.55*tu});
      bulb.scl=[1,1.3,1].map((v,i)=>i===1?v:v*(L.pump?1-.12*Math.max(0,Math.sin(K.simT*6)):1));
      if(!L.rec&&L.t[0]>=40&&L.t[1]>=40){L.rec=true;rec("Thổi khí thở ra (ống 1) và bơm không khí (ống 2) vào nước vôi trong, 40 giây",`ống 1 vẩn đục rõ (độ đục ${fmt(L.tur[0]*100,0)}%); ống 2 gần như vẫn trong (${fmt(L.tur[1]*100,0)}%)`);refresh()}
      chest.visible=K.view==="nguc";alv.visible=K.view==="phenang";lime.visible=K.view==="voi"});

    /* ================= khay, bảng ================= */
    K.dockFn(()=>{const v=K.view;
      if(v==="nguc")return[{k:"deep",label:"Hít sâu, thở ra hết",icon:IC.drop,dis:!!S.deep},{grid:[{k:"slow",label:"Thở chậm",icon:IC.minus,dis:S.rate<=10},{k:"fast",label:"Thở nhanh",icon:IC.plus,dis:S.rate>=30}]}];
      if(v==="voi")return[{k:"blow",label:S.lime.blow?"Ngừng thổi":"Thổi vào ống 1",icon:IC.drop,on:S.lime.blow},{k:"pump",label:S.lime.pump?"Ngừng bơm":"Bơm vào ống 2",icon:IC.hand,on:S.lime.pump},{k:"rl",label:"Thay nước vôi",icon:IC.reset}];
      return[]});
    K.onDock(k=>{if(k==="deep"){S.deep={t:0,v0:S.vol}}else if(k==="slow")S.rate=Math.max(10,S.rate-4);else if(k==="fast")S.rate=Math.min(30,S.rate+4);
      else if(k==="blow")S.lime.blow=!S.lime.blow;else if(k==="pump")S.lime.pump=!S.lime.pump;else if(k==="rl")S.lime={blow:false,pump:false,t:[0,0],tur:[0,0],rec:false};refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="nguc")return `<div><b>Thông khí ở phổi</b> · ${S.rate} nhịp/phút</div><div>Khí trong phổi: ${fmt(S.vol,2)} L</div>${KIT.miniChart([{pts:S.hist.map(p=>[p[0]-(S.hist[0]?S.hist[0][0]:0),p[1]]),c:"#60A5FA"}],{w:230,h:96,y0:1,y1:6,yl:"V (L)",xl:"thời gian (s)",yd:0,aria:"Đồ thị thể tích khí trong phổi"})}<small>Thở thường ≈ 0,5 L mỗi nhịp; thở sâu tới khoảng 3 L.</small>`;
      if(v==="phenang")return `<div><b>Trao đổi khí ở phế nang</b></div><div><i style="background:#2563EB"></i>O₂: phế nang → máu</div><div><i style="background:#9CA3AF"></i>CO₂: máu → phế nang</div><small>Máu vào mao mạch đỏ thẫm (nghèo O₂), ra khỏi mao mạch đỏ tươi (giàu O₂).</small>`;
      return `<div><b>Thành phần khí (% thể tích)</b></div><table class="mx"><thead><tr><th></th><th>O₂</th><th>CO₂</th><th>N₂</th></tr></thead><tbody><tr><th>Hít vào</th><td>${fmt(AIR.in.O2,2)}</td><td>${fmt(AIR.in.CO2,2)}</td><td>${fmt(AIR.in.N2,2)}</td></tr><tr><th>Thở ra</th><td>${fmt(AIR.out.O2,1)}</td><td>${fmt(AIR.out.CO2,1)}</td><td>${fmt(AIR.out.N2,1)}</td></tr></tbody></table><small>Ống 1: ${fmt(S.lime.t[0],0)} s · ống 2: ${fmt(S.lime.t[1],0)} s</small>`});
    K.timeLabel(()=>K.view==="nguc"?`t = ${fmt(K.simT,1)} s · ${S.inh?"hít vào":"thở ra"} · ${fmt(S.vol,2)} L`:K.view==="voi"?`Ống 1 đục ${fmt(S.lime.tur[0]*100,0)}% · ống 2 đục ${fmt(S.lime.tur[1]*100,0)}%`:`t = ${fmt(K.simT,1)} s · phế nang`);
    K.onReset(()=>{S.breaths=0;S.hist=[];S.deep=null;S.alvT=0;S.lime={blow:false,pump:false,t:[0,0],tur:[0,0],rec:false};air.list.length=0;fizz.list.length=0;refresh()});
    K.onUnmount(()=>{K.dead=true});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"deep",p:[0,2.38,.25],tip:"Chạm để hít sâu rồi thở ra hết",view:"nguc"},{k:"blow",p:[VX+TBX[0],.75,0],tip:S.lime.blow?"Chạm để ngừng thổi":"Chạm để thổi khí thở ra vào ống 1",view:"voi"},{k:"pump",p:[VX+TBX[1],.75,0],tip:S.lime.pump?"Chạm để ngừng bơm":"Chạm để bơm không khí vào ống 2",view:"voi"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp().__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.deep={t:0,v0:S.vol};S.lime.blow=true;S.lime.pump=true;S.alvT=20}};
    function vp(){return api.vp}
    return K.mount(st)}
});
})();
