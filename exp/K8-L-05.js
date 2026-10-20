/* K8-L-05 · Hiện tượng nhiễm điện do cọ xát (SGK KHTN 8 – Kết nối tri thức, Bài 20) · 3D
   Ba trạm:
   1. Cọ xát thước nhựa bằng mảnh vải len rồi đưa lại gần giấy vụn: giấy vụn bị hút. Thước chưa cọ xát: không hút (đối chứng).
   2. Treo một thước nhựa đã cọ xát len bằng sợi chỉ; đưa lại gần một thước nhựa khác cũng cọ xát len (đẩy nhau)
      hoặc thanh thủy tinh cọ xát lụa (hút nhau).
   3. Giải thích bằng electron: khi cọ xát, electron chuyển từ len sang nhựa; nhựa nhận thêm electron nhiễm điện âm, len mất electron nhiễm điện dương. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const X1=-5,X2=0,X3=5;
const NEG="#3B82F6",POS="#EF4444";

const SPEC={
  predict:[
    {id:"p1",q:"Cọ xát thước nhựa vào mảnh vải len khô rồi đưa lại gần các mẩu giấy vụn. Em đoán:",opts:[["hut","Thước hút các mẩu giấy vụn"],["day","Thước đẩy giấy vụn ra xa"],["khong","Không có hiện tượng"]],ans:"hut",res:"Kết quả: thước nhựa đã cọ xát hút các mẩu giấy vụn."},
    {id:"p2",q:"Hai thước nhựa cùng cọ xát bằng vải len rồi đưa lại gần nhau, chúng sẽ:",opts:[["day","Đẩy nhau"],["hut","Hút nhau"],["khong","Không tác dụng"]],ans:"day",res:"Kết quả: hai thước nhiễm điện cùng loại nên đẩy nhau."}],
  taskLead:"Chọn trạm ở khay. Dùng các nút ở khay để cọ xát và đưa vật lại gần.",
  tasks:[
    {html:"<b>Đối chứng:</b> đưa thước nhựa <i>chưa cọ xát</i> lại gần giấy vụn.",done:()=>S.p.ctl},
    {html:"<b>Cọ xát:</b> cọ thước nhựa bằng vải len rồi đưa lại gần giấy vụn.",done:()=>S.p.hut},
    {html:"<b>Cùng loại:</b> đưa thước nhựa đã cọ xát len lại gần thước nhựa đang treo.",done:()=>S.h.rec.nhua},
    {html:"<b>Khác loại:</b> đưa thanh thủy tinh đã cọ xát lụa lại gần thước nhựa đang treo.",done:()=>S.h.rec.tt},
    {html:"<b>Electron:</b> cọ xát ở mức nguyên tử, quan sát electron dịch chuyển.",done:()=>S.e.done}],
  obs:[
    {id:"a",q:"Vì sao thước nhựa chưa cọ xát không hút giấy vụn?",opts:[["trung","Thước chưa nhiễm điện (trung hòa về điện)"],["nang","Thước quá nặng"],["xa","Thước để quá xa"]],ans:"trung",why:"Chỉ sau khi cọ xát, thước mới nhiễm điện và hút được các vật nhẹ."},
    {id:"b",q:"Thước nhựa treo bị thanh thủy tinh (cọ lụa) hút lại. Điều đó cho biết:",opts:[["khac","Hai vật nhiễm điện khác loại"],["cung","Hai vật nhiễm điện cùng loại"],["mot","Chỉ một vật nhiễm điện"]],ans:"khac",why:"Hai vật nhiễm điện khác loại thì hút nhau, cùng loại thì đẩy nhau. Thủy tinh cọ lụa nhiễm điện dương, nhựa cọ len nhiễm điện âm."},
    {id:"c",q:"Sau khi cọ xát, thước nhựa nhiễm điện âm vì:",opts:[["nhan","Thước nhận thêm electron từ vải len"],["mat","Thước mất bớt electron"],["prot","Thước nhận thêm proton"]],ans:"nhan",why:"Khi cọ xát, một số electron chuyển từ len sang nhựa. Hạt nhân (proton) không dịch chuyển."}],
  concl:{html:`<ul class="tlist"><li>Nhiều vật bị nhiễm điện khi cọ xát; vật nhiễm điện có khả năng hút các vật khác (giấy vụn, tóc, sợi bông…).</li>
    <li>Có hai loại điện tích: điện tích dương (+) và điện tích âm (−). Các vật nhiễm điện cùng loại thì đẩy nhau, khác loại thì hút nhau.</li>
    <li>Vật nhiễm điện âm khi nhận thêm electron, nhiễm điện dương khi mất bớt electron. Khi cọ xát, electron dịch chuyển từ vật này sang vật kia.</li>
    <li>Ứng dụng và hiện tượng: sơn tĩnh điện, lọc bụi tĩnh điện; tia chớp, sét là sự phóng điện giữa các đám mây nhiễm điện hoặc giữa mây và mặt đất.</li></ul>`,
    quiz:[
      {id:"q1",q:"Hai quả cầu nhỏ treo gần nhau đẩy nhau. Kết luận nào đúng?",opts:[["cung","Hai quả cầu nhiễm điện cùng loại"],["khac","Hai quả cầu nhiễm điện khác loại"],["khong","Hai quả cầu không nhiễm điện"]],ans:"cung",why:{khac:"Khác loại thì hút nhau.",khong:"Vật không nhiễm điện không đẩy nhau."}},
      {id:"q2",q:"Vì sao cánh quạt điện lâu ngày bám nhiều bụi ở mép cánh?",opts:[["co","Cánh quạt cọ xát với không khí nên nhiễm điện, hút bụi"],["dau","Cánh quạt có dầu"],["gio","Gió thổi bụi vào"]],ans:"co",why:{dau:"Lí do chính là cánh quạt nhiễm điện do cọ xát với không khí.",gio:"Lí do chính là cánh quạt nhiễm điện do cọ xát với không khí."}},
      {id:"q3",q:"Để tránh nguy hiểm khi có sét, nên:",opts:[["tranh","Không trú dưới cây cao đứng một mình, tránh xa vật kim loại cao, ở trong nhà"],["cay","Trú dưới gốc cây to"],["o","Giơ ô kim loại lên cao"]],ans:"tranh",why:{cay:"Cây cao đứng một mình dễ bị sét đánh.",o:"Vật kim loại giơ cao dễ thu hút tia sét."}}],
    done:`<h2>Hoàn thành: Nhiễm điện do cọ xát</h2><p class="muted">Cùng loại đẩy, khác loại hút; nhận thêm electron nhiễm điện âm, mất electron nhiễm điện dương.</p>`},
  gv:["Làm thật: thước nhựa, vải len, giấy vụn phải thật khô; ngày nồm ẩm thí nghiệm khó thành công.","Hỏi: nếu cọ xát bằng tay ướt thì sao?","Liên hệ: chải tóc khô bằng lược nhựa, tóc dựng lên theo lược; cởi áo len nghe lách tách."]
};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 20)</p><ul class="tlist"><li>Thực hiện được thí nghiệm để chứng tỏ vật nhiễm điện do cọ xát; giải thích được sơ lược nguyên nhân một vật cách điện nhiễm điện do cọ xát.</li><li>Chỉ ra được vật nhiễm điện chỉ có thể nhiễm một trong hai loại điện tích.</li><li>Nêu được sự tạo thành tia chớp, sét.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 20 Hiện tượng nhiễm điện do cọ xát.</li>
<li>Thủy tinh cọ lụa nhiễm điện dương; nhựa cọ len (dạ) nhiễm điện âm; giải thích bằng sự dịch chuyển electron: <a href="https://openstax.org/books/college-physics-2e/pages/18-1-static-electricity-and-charge-conservation-of-charge" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 18.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Độ lớn lực hút, đẩy và số điện tích vẽ trên vật là minh họa định tính, không theo tỉ lệ. Mỗi chấm “−” hoặc “+” tượng trưng cho rất nhiều điện tích.</li></ul>`;

let S;
LabKHTN.register("K8-L-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Bàn thí nghiệm 3D nhiễm điện do cọ xát",legend:{w:250},bench:[16,3],seed:2020,
      views:{giay:{t:[X1+.1,.3,0],yaw:.1,pitch:.38,rad:.68,label:"Hút giấy vụn",icon:IC.hand},treo:{t:[X2+.3,1.02,.45],yaw:.45,pitch:.3,rad:.85,label:"Hút và đẩy",icon:IC.swap},electron:{t:[X3,.75,0],yaw:0,pitch:.08,rad:.95,label:"Electron",icon:IC.cell}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,rnd=K.rnd;
    S={p:{q:0,rub:null,low:false,ctl:false,hut:false,stuck:0},h:{tool:null,dist:1.0,ang:0,om:0,rec:{}},e:{t:-1,moved:0,done:false},recs:0};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const plastic={color:"#E8B730",rough:.32,coat:.55},glassM={type:"glass",color:"#E9F6FF",alpha:.5};
    const wool={color:"#8E3B46",rough:.95,sheen:.8,wrap:.6,hooks:KIT.TISSUE,uniforms:{uBump:.25,uNF:90}};
    const silk={color:"#EEE5F7",rough:.5,sheen:.9,coat:.2};
    const chargeG=G.sphere(1,10,8);
    function charges(n,col){const m=root.add(R.instanced(chargeG,{type:"unlit",color:"#FFFFFF"},n));m.col=H(col);return m}
    function setCh(m,list){const D=m.data;list.forEach((p,i)=>D.set([p[0],p[1],p[2],.012,m.col[0],m.col[1],m.col[2],1],i*8));m.setInstances(list.length)}

    /* ================= 1. hút giấy vụn ================= */
    const ruler=root.add(new G.Node());
    ruler.add(R.mesh(G.box(1.0,.022,.1,.006,2),plastic));
    for(let i=0;i<=20;i++)ruler.add(R.mesh(G.box(.003,.002,i%5?.025:.045,0,1),{color:"#2B2B2B",rough:.6})).pos=[-.48+i*.048,.012,.03-(i%5?.0:.01)];
    const cloth=root.add(new G.Node());cloth.add(R.mesh(G.box(.32,.05,.22,.04,4),wool));
    const RUL={hi:[X1,.62,0],lo:[X1,.2,0]};let rY=RUL.hi[1];
    const bits=[];for(let i=0;i<16;i++){const m=root.add(R.mesh(G.box(.035+rnd()*.03,.003,.03+rnd()*.03,0,1),{color:"#F7F5EE",rough:.8}));
      const p=[X1-.35+rnd()*.7,.0035,-.12+rnd()*.24];m.pos=p.slice();m.quat=G.Q.euler(0,rnd()*3,0);bits.push({m,p0:p,y:0,v:0,stuck:false,off:[(p[0]-X1),0,(p[2])*.3]})}
    const chR=charges(24,NEG),chC=charges(24,POS);
    /* ================= 2. hút và đẩy ================= */
    const stand=root.add(new G.Node());stand.pos=[X2,0,0];
    stand.add(R.mesh(G.box(.6,.04,.4,.01,2),{color:"#4B5563",rough:.5})).pos=[0,.02,-.1];stand.add(R.mesh(G.cylinder(.015,1.5,12),{color:"#B7BEC6",metal:.8,rough:.3})).pos=[0,0,-.25];
    stand.add(R.mesh(G.cylinder(.012,.6,10),{color:"#B7BEC6",metal:.8,rough:.3})).quat=G.Q.euler(Math.PI/2,0,0);stand.children[stand.children.length-1].pos=[0,1.48,-.25];
    stand.add(R.mesh(G.cylinder(.002,.42,4),{color:"#F5F5F5"})).pos=[0,1.06,.35];
    const hang=stand.add(new G.Node());hang.pos=[0,1.06,.35];hang.add(R.mesh(G.box(1.0,.022,.1,.006,2),plastic));
    const tool=root.add(new G.Node());const toolR=tool.add(R.mesh(G.box(1.0,.022,.1,.006,2),plastic)),toolG=tool.add(R.mesh(G.cylinder(.028,1.0,20),glassM));toolG.quat=G.Q.euler(0,0,Math.PI/2);toolG.pos=[.5,0,0];
    const chH=charges(16,NEG),chT=charges(16,NEG);
    /* ================= 3. electron ================= */
    const eN=root.add(new G.Node());eN.pos=[X3,0,0];
    const nucG=G.sphere(.055,16,12),elG=G.sphere(.022,10,8);
    const atomsW=[],atomsP=[];
    for(let i=0;i<5;i++)for(let j=0;j<2;j++){atomsW.push([-.6+i*.3,1.0+j*.24,0]);atomsP.push([-.6+i*.3,.5-j*.24,0])}
    eN.add(R.mesh(G.box(1.6,.5,.25,.04,3),Object.assign({},wool,{alpha:.25,transparent:true,order:2}))).pos=[0,1.12,0];
    eN.add(R.mesh(G.box(1.6,.5,.25,.04,3),Object.assign({},plastic,{alpha:.25,transparent:true,order:2}))).pos=[0,.38,0];
    const nucs=eN.add(R.instanced(nucG,{color:"#FFFFFF",rough:.35},atomsW.length+atomsP.length));
    {const D=nucs.data,c=H("#E06A6A");atomsW.concat(atomsP).forEach((p,i)=>D.set([p[0],p[1],p[2],1,c[0],c[1],c[2],1],i*8));nucs.setInstances(atomsW.length+atomsP.length)}
    const els=eN.add(R.instanced(elG,{type:"unlit",color:"#FFFFFF"},40));
    /* mỗi nguyên tử trung hòa có 2 electron (minh họa); khi cọ xát 4 electron từ len chuyển sang nhựa */
    const EL=[];atomsW.forEach((a,i)=>{for(let k=0;k<2;k++)EL.push({home:i,side:"W",ph:k*Math.PI+i,mv:null})});atomsP.forEach((a,i)=>{for(let k=0;k<2;k++)EL.push({home:i,side:"P",ph:k*Math.PI+i*.7,mv:null})});
    const MOVE=[1,3,5,7].map(i=>EL.findIndex(e=>e.side==="W"&&e.home===i&&e.ph<Math.PI+i&&e.ph>=i-0.01));
    const lPlus=K.label("",[X3-.85,1.12,0],{view:"electron",dir:"w",len:40}),lMinus=K.label("",[X3-.85,.38,0],{view:"electron",dir:"w",len:40});

    /* ================= nhãn ================= */
    K.label("Thước nhựa",()=>[X1+.42,rY+.01,.05],{view:"giay",dir:"ne",len:40});K.label("Mảnh vải len",()=>cloth.pos,{view:"giay",dir:"e",len:50});K.label("Giấy vụn",[X1-.25,0,.1],{view:"giay",dir:"sw",len:40});
    K.label("Sợi chỉ",[X2,1.3,.35],{view:"treo",dir:"w",len:40});K.label("Thước nhựa treo (đã cọ xát len)",[X2-.45,1.06,.35],{view:"treo",dir:"w",len:40});
    const lTool=K.label("",()=>V3.add(tool.pos,[.45,0,0]),{view:"treo",dir:"e",len:40});
    K.label("Len",[X3+.85,1.12,0],{view:"electron",dir:"e",len:30});K.label("Nhựa",[X3+.85,.38,0],{view:"electron",dir:"e",len:30});
    K.label("Hạt nhân (+)",[X3-.6+.3*4,1.24,0],{view:"electron",dir:"ne",len:30});K.label("Electron (−)",()=>V3.add(elPos(EL[2]),[X3,0,0]),{view:"electron",dir:"n",len:40});

    /* ================= cập nhật ================= */
    function elPos(e){const A=e.side==="W"?atomsW:atomsP;const a=A[e.home];const t=K.simT*2+e.ph;let p=[a[0]+Math.cos(t)*.12,a[1]+Math.sin(t)*.12*.6,a[2]+Math.sin(t)*.05];
      if(e.mv){const m=e.mv;const q=C.clamp(m.t/1.2,0,1);const b=atomsP[m.to];const pb=[b[0]+Math.cos(t)*.12,b[1]+Math.sin(t)*.12*.6,b[2]];const s=q*q*(3-2*q);p=V3.lerp(p,pb,s);p[0]+=Math.sin(q*Math.PI)*.08}return p}
    K.onFrame((dt,rdt)=>{const P=S.p,v=K.view;
      /* cọ xát: vải trượt qua lại dọc thước */
      if(P.rub){P.rub.t+=dt;const k=P.rub.t;P.q=Math.min(1,P.rub.q0+k/2.4);if(k>=2.4){P.rub=null;api.toast("Đã cọ xát 10 lần. Đưa thước lại gần giấy vụn.","ok",2000);refresh()}}
      const tgtY=P.low?RUL.lo[1]:RUL.hi[1];rY+=(tgtY-rY)*Math.min(1,dt*3.2);ruler.pos=[X1,rY,0];
      cloth.pos=P.rub?[X1+Math.sin(P.rub.t*13)*.33,rY+.036,0]:[X1+.56,.025,.2];cloth.quat=P.rub?G.Q.euler(0,0,0):G.Q.euler(0,.4,0);
      /* điện tích */
      const nq=Math.round(P.q*22);const lr=[],lc=[];for(let i=0;i<nq;i++){lr.push([X1-.46+i*.042,rY-.016,(i%2?.03:-.03)]);lc.push([cloth.pos[0]-.13+(i%8)*.037,cloth.pos[1]+.028,cloth.pos[2]-.06+Math.floor(i/8)*.06])}
      if(v==="giay"){setCh(chR,lr);setCh(chC,P.rub||cloth.pos[1]>.03?lc:lc)}else{chR.setInstances(0);chC.setInstances(0)}
      /* giấy vụn: khi thước nhiễm điện ở gần, giấy bật lên bám vào mặt dưới thước */
      let stuck=0;for(const b of bits){const gap=rY-.012-b.y;const pull=P.q>.25&&gap<.32&&Math.abs(b.p0[0]-X1)<.48;
        if(b.stuck){b.y=rY-.016;}else if(pull&&dt>0){b.v+=dt*(P.q*2.2/Math.max(.02,gap*gap)*.02-1.5);b.y=Math.max(0,b.y+b.v*dt);if(b.y>=rY-.02){b.stuck=true;b.y=rY-.016}}
        else if(dt>0){b.v-=dt*9.8;b.y=Math.max(0,b.y+b.v*dt);if(b.y<=0)b.v=0}
        if(b.stuck&&(rY>RUL.hi[1]-.05&&P.q<.25))b.stuck=false;
        b.m.pos=[b.p0[0],b.y+.0035,b.p0[2]];if(b.stuck)stuck++}
      P.stuck=stuck;
      if(P.low&&Math.abs(rY-RUL.lo[1])<.01&&!P.recLow){P.recLow=true;if(P.q<.05){if(!P.ctl){P.ctl=true;rec("Đưa thước nhựa chưa cọ xát lại gần giấy vụn","giấy vụn nằm yên, không bị hút");refresh()}}else P.tLow=0}
      if(P.low&&P.q>.25&&P.tLow!=null){P.tLow+=dt;if(P.tLow>1.4&&!P.hut){P.hut=true;rec("Cọ xát thước nhựa bằng vải len rồi đưa lại gần giấy vụn",`${stuck} mẩu giấy vụn bật lên, bám vào thước`);refresh()}}
      /* thước treo */
      const Hh=S.h;const tz=.35+Hh.dist;tool.pos=[X2+.82,1.06,tz];tool.visible=!!Hh.tool;toolR.visible=Hh.tool==="nhua";toolG.visible=Hh.tool==="tt";
      lTool.set(Hh.tool==="nhua"?"Thước nhựa đã cọ xát len (−)":Hh.tool==="tt"?"Thanh thủy tinh đã cọ xát lụa (+)":"");lTool.on=K.view==="treo"&&!!Hh.tool;
      if(dt>0){let tau=0;if(Hh.tool){const d=Math.max(.05,Hh.dist-.5*Math.sin(Hh.ang));const s=Hh.tool==="nhua"?-1:1;tau=s*.012/(d*d)}
        Hh.om+=(tau-Hh.om*1.2-Hh.ang*.4)*dt;Hh.ang=C.clamp(Hh.ang+Hh.om*dt,-.9,.42);
        if(Hh.tool&&!Hh.rec[Hh.tool]&&Hh.dist<.4){Hh.t=(Hh.t||0)+dt;if(Hh.t>1.5){Hh.rec[Hh.tool]=true;rec(Hh.tool==="nhua"?"Đưa thước nhựa đã cọ xát len lại gần đầu thước nhựa đang treo":"Đưa thanh thủy tinh đã cọ xát lụa lại gần đầu thước nhựa đang treo",
          Hh.tool==="nhua"?`thước treo quay ra xa (góc ${fmt(Math.abs(Hh.ang)*180/Math.PI,0)}°): hai vật đẩy nhau`:`thước treo quay lại gần (góc ${fmt(Math.abs(Hh.ang)*180/Math.PI,0)}°): hai vật hút nhau`);refresh()}}}
      hang.quat=G.Q.euler(0,-Hh.ang,0);
      if(v==="treo"){const lh=[],lt=[];for(let i=0;i<12;i++){const x=-.45+i*.082;lh.push(V3.add([X2,1.06-.016,.35],[x*Math.cos(Hh.ang),0,x*Math.sin(Hh.ang)]))}
        if(Hh.tool)for(let i=0;i<12;i++)lt.push([X2+.37+i*.082,1.06-(Hh.tool==="tt"?.032:.016),tz]);setCh(chH,lh);chT.col=H(Hh.tool==="tt"?POS:NEG);setCh(chT,lt)}else{chH.setInstances(0);chT.setInstances(0)}
      /* electron */
      const E=S.e;if(E.t>=0){E.t+=dt;MOVE.forEach((ei,k)=>{const e=EL[ei];if(!e)return;const t0=k*.5;if(E.t>t0&&!e.mv&&e.side==="W"){e.mv={t:0,to:[1,3,5,7][k]+0}}});
        for(const e of EL)if(e.mv){e.mv.t+=dt;if(e.mv.t>=1.2){e.side="P";e.home=e.mv.to;e.mv=null;E.moved++}}
        if(E.moved>=4&&!E.done){E.done=true;rec("Cọ xát len với nhựa (mức nguyên tử)","4 electron chuyển từ len sang nhựa: nhựa thừa electron (nhiễm điện âm), len thiếu electron (nhiễm điện dương)");refresh()}}
      if(v==="electron"){const D=els.data,c=H("#60A5FA");EL.forEach((e,i)=>{const p=elPos(e);D.set([p[0],p[1],p[2],1,c[0],c[1],c[2],1],i*8)});els.setInstances(EL.length)}else els.setInstances(0);
      const nW=EL.filter(e=>e.side==="W"&&!e.mv).length,nP=EL.filter(e=>e.side==="P"||e.mv).length;
      lPlus.set(nW<20?`Len: thiếu ${20-nW} electron → nhiễm điện dương`:"Len: trung hòa về điện");lMinus.set(nP>20?`Nhựa: thừa ${nP-20} electron → nhiễm điện âm`:"Nhựa: trung hòa về điện")});

    /* ================= khay ================= */
    K.dockFn(()=>{const v=K.view,P=S.p;
      if(v==="giay")return[{k:"rub",label:"Cọ xát thước bằng vải len",icon:IC.hand,dis:!!P.rub||P.low},{k:"low",label:P.low?"Nhấc thước lên":"Đưa thước lại gần giấy vụn",icon:P.low?IC.step:IC.step,on:P.low,dis:!!P.rub},{k:"rp",label:"Làm lại (thước trung hòa)",icon:IC.reset}];
      if(v==="treo"){const Hh=S.h;return[{seg:[{k:"tool",v:"nhua",label:"Thước nhựa (cọ len)",icon:"",on:Hh.tool==="nhua"},{k:"tool",v:"tt",label:"Thủy tinh (cọ lụa)",icon:"",on:Hh.tool==="tt"}],label:"Vật đưa lại gần"},
        {k:"near",label:"Đưa lại gần",icon:IC.step,dis:!Hh.tool||Hh.dist<.4},{k:"far",label:"Đưa ra xa",icon:IC.reset,dis:!Hh.tool||Hh.dist>.8}]}
      return[{k:"erub",label:"Cọ xát len với nhựa",icon:IC.hand,dis:S.e.t>=0&&!S.e.done},{k:"er",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{const P=S.p;
      if(k==="rub"){P.rub={t:0,q0:P.q};P.tLow=null;P.recLow=false;if(!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}
      else if(k==="low"){P.low=!P.low;P.recLow=false;if(!P.low){P.tLow=null;}}
      else if(k==="rp"){P.q=0;P.low=false;P.rub=null;P.tLow=null;P.recLow=false;bits.forEach(b=>{b.stuck=false;b.y=0;b.v=0})}
      else if(k==="tool"){S.h.tool=v;S.h.dist=1.0;S.h.t=0}else if(k==="near"){S.h.dist=.26;S.h.t=0}else if(k==="far")S.h.dist=1.0;
      else if(k==="erub"){S.e.t=0}else if(k==="er"){S.e={t:-1,moved:0,done:S.e.done};EL.forEach((e,i)=>{const n=EL.length/2;e.side=i<n?"W":"P";e.home=Math.floor((i%n)/2);e.mv=null})}
      refresh()});
    K.infoFn(()=>{const v=K.view,P=S.p;
      if(v==="giay")return `<div><b>Thước nhựa và giấy vụn</b></div><div>Thước: ${P.q<.05?"trung hòa về điện":`nhiễm điện âm (mức ${fmt(P.q*100,0)}%)`}</div><div>Giấy vụn bám vào thước: ${P.stuck}</div><small><span style="color:${NEG}">●</span> điện tích âm · <span style="color:${POS}">●</span> điện tích dương (minh họa)</small>`;
      if(v==="treo"){const Hh=S.h;return `<div><b>Thước nhựa treo</b> nhiễm điện âm</div><div>Vật đưa lại gần: ${Hh.tool==="nhua"?"thước nhựa (âm)":Hh.tool==="tt"?"thủy tinh (dương)":"chưa chọn"}</div><div>Góc quay: ${fmt(Hh.ang*180/Math.PI,0)}° ${Hh.ang<-.05?"(quay ra xa)":Hh.ang>.05?"(quay lại gần)":""}</div><small>Cùng loại đẩy nhau, khác loại hút nhau.</small>`}
      return `<div><b>Electron khi cọ xát</b></div><div><span style="color:#E06A6A">●</span> hạt nhân mang điện dương (không dịch chuyển)</div><div><span style="color:#60A5FA">●</span> electron mang điện âm</div><small>Mỗi nguyên tử vẽ 2 electron cho dễ nhìn.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.onReset(()=>{});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"rub",p:()=>cloth.pos,tip:"Chạm để cọ xát thước bằng vải len",view:"giay"},{k:"low",p:()=>[X1+.42,rY+.01,.05],tip:S.p.low?"Chạm để nhấc thước lên":"Chạm để đưa thước lại gần giấy vụn",view:"giay"},...(S.h.tool?[{k:S.h.dist>.6?"near":"far",p:()=>V3.add(tool.pos,[.3,0,0]),tip:S.h.dist>.6?"Chạm để đưa lại gần":"Chạm để đưa ra xa",view:"treo"}]:[]),{k:"erub",p:[X3+.85,.75,0],tip:"Chạm để cọ xát len với nhựa",view:"electron"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const P=S.p;P.low=true;P.recLow=false;setTimeout(()=>{P.low=false;setTimeout(()=>{P.rub={t:0,q0:0};setTimeout(()=>{P.low=true;P.recLow=false;P.tLow=null},4200)},800)},2500);
        S.h.tool="nhua";S.h.dist=.26;S.e.t=0;setTimeout(()=>{S.h.tool="tt";S.h.t=0},9000)}};
    return K.mount(st)}
});
})();
