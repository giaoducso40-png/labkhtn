/* K8-S-02 · Hệ vận động ở người; sơ cứu khi gãy xương (SGK KHTN 8 – Kết nối tri thức, Bài 31) · 3D
   Trạm 1: bộ xương người 3D, chạm từng phần để xem tên và chức năng.
   Trạm 2: cánh tay gập – duỗi ở khớp khuỷu: cơ hai đầu co (ngắn lại, phình to) kéo xương cẳng tay lên, cơ ba đầu dãn; đảo lại khi duỗi.
   Trạm 3: sơ cứu gãy xương cẳng tay theo đúng thứ tự: đặt nẹp → lót vải mềm → buộc cố định → băng, đeo cẳng tay vào cổ. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,V3=G.V3,KIT=window.LabKit,IC=KIT.ICON,fmt=C.fmt,H=G.hex;
const PARTS=[
  {k:"skull",ten:"Xương đầu (hộp sọ, xương mặt)",p:[.3,2.45,.1],f:"Hộp sọ bảo vệ não; xương mặt tạo khuôn mặt; xương hàm dưới là xương duy nhất cử động được của đầu (khi nhai, nói)."},
  {k:"spine",ten:"Cột sống",p:[0,.6,-.26],f:"Gồm nhiều đốt sống nối với nhau, cong hình chữ S giúp đỡ cơ thể ở tư thế đứng thẳng và giảm chấn động; bảo vệ tủy sống."},
  {k:"ribs",ten:"Lồng ngực (xương sườn, xương ức)",p:[.62,1.1,.15],f:"12 đôi xương sườn cùng xương ức và cột sống tạo lồng ngực, bảo vệ tim, phổi."},
  {k:"shoulder",ten:"Đai vai (xương đòn, xương bả vai)",p:[-.4,1.6,.08],f:"Nối xương chi trên với thân, giúp tay cử động linh hoạt."},
  {k:"pelvis",ten:"Đai hông (xương chậu)",p:[.5,-.5,0],f:"Nâng đỡ các cơ quan trong ổ bụng, nối xương chi dưới với cột sống, chịu trọng lượng cơ thể."},
  {k:"armL",ten:"Xương chi trên",p:[.8,.4,-.06],f:"Xương cánh tay, xương cẳng tay (xương quay, xương trụ), xương cổ tay, bàn tay, ngón tay: giúp cầm nắm, lao động."},
  {k:"legL",ten:"Xương chi dưới",p:[.34,-2.8,.04],f:"Xương đùi (dài và chắc nhất), xương bánh chè, xương cẳng chân (xương chày, xương mác), xương bàn chân: nâng đỡ, di chuyển."}];
const SPEC={
  predict:[{id:"p1",q:"Khi gập cẳng tay lên, cơ hai đầu ở mặt trước cánh tay:",opts:[["co","Co lại, ngắn và phình to ra"],["dan","Dãn ra, dài hơn"],["khong","Không thay đổi"]],ans:"co",res:"Kết quả: cơ hai đầu co, kéo xương cẳng tay lên; cơ ba đầu ở mặt sau dãn ra."},
    {id:"p2",q:"Gặp người bị gãy xương cẳng tay, việc làm đầu tiên nên là:",opts:[["nep","Đặt nẹp giữ cố định chỗ gãy, không nắn chỗ gãy"],["nan","Nắn xương về chỗ cũ"],["xoa","Xoa bóp chỗ đau"]],ans:"nep",res:"Không tự nắn chỗ gãy: cố định bằng nẹp rồi đưa ngay tới cơ sở y tế."}],
  taskLead:"Chọn trạm ở khay.",
  tasks:[{html:"<b>Bộ xương:</b> chạm xem ít nhất 5 phần.",done:()=>Object.keys(S.seen).length>=5},{html:"<b>Cơ và xương:</b> gập và duỗi cẳng tay, quan sát hai cơ.",done:()=>S.flexed&&S.extended},
    {html:"<b>Sơ cứu:</b> làm đủ 4 bước đúng thứ tự cho cẳng tay bị gãy.",done:()=>S.aid>=4}],
  obs:[{id:"a",q:"Vì sao cột sống người có dạng cong chữ S?",opts:[["s","Giúp đỡ cơ thể đứng thẳng, giảm chấn động khi di chuyển"],["dep","Cho đẹp"],["dai","Để cột sống dài hơn"]],ans:"s",why:"Các chỗ cong giúp phân tán lực, giữ thăng bằng ở tư thế đứng thẳng."},
    {id:"b",q:"Cơ bám vào xương qua bộ phận nào và hoạt động ra sao?",opts:[["gan","Qua gân; cơ co kéo xương chuyển động quanh khớp"],["sun","Qua sụn; cơ đẩy xương"],["ko","Cơ không bám vào xương"]],ans:"gan",why:"Cơ chỉ co (kéo), không đẩy được; vì vậy cần cặp cơ đối kháng (cơ hai đầu – cơ ba đầu) để gập và duỗi."},
    {id:"c",q:"Vì sao phải lót vải mềm giữa nẹp và tay?",opts:[["dem","Để không cọ xát, chèn ép gây đau, tổn thương da"],["dep","Cho đẹp"],["am","Để tay ấm"]],ans:"dem",why:"Nẹp cứng tì trực tiếp có thể làm tổn thương da và mạch máu."}],
  concl:{html:`<ul class="tlist"><li>Hệ vận động gồm bộ xương và hệ cơ; bộ xương người trưởng thành có khoảng 206 xương, chia thành xương đầu, xương thân, xương chi.</li>
    <li>Chức năng: nâng đỡ, tạo hình dạng cơ thể; bảo vệ các cơ quan bên trong; cùng hệ cơ giúp cơ thể vận động.</li>
    <li>Cơ co làm xương chuyển động quanh khớp; các cơ hoạt động thành cặp đối kháng.</li>
    <li>Sơ cứu gãy xương: không nắn chỗ gãy; đặt nẹp, lót vải mềm, buộc cố định ở hai đầu nẹp và hai bên chỗ gãy, băng lại; gãy xương cẳng tay thì đeo cẳng tay vào cổ; đưa ngay tới cơ sở y tế.</li></ul>`,
    quiz:[{id:"q1",q:"Xương nào bảo vệ não?",opts:[["a","Hộp sọ"],["b","Xương sườn"],["c","Xương chậu"]],ans:"a",why:{b:"Xương sườn bảo vệ tim, phổi.",c:"Xương chậu nâng đỡ cơ quan ổ bụng."}},
      {id:"q2",q:"Để xương phát triển tốt, cần:",opts:[["a","Ăn đủ chất (calcium, vitamin D), tắm nắng, vận động hợp lí, ngồi đúng tư thế"],["b","Mang vác vật thật nặng"],["c","Ngồi học cúi gập người"]],ans:"a",why:{b:"Mang vác quá nặng gây cong vẹo, tổn thương xương.",c:"Ngồi sai tư thế gây cong vẹo cột sống."}}],
    done:`<h2>Hoàn thành: Hệ vận động</h2><p class="muted">Xương nâng đỡ, bảo vệ; cơ co kéo xương chuyển động quanh khớp; sơ cứu gãy xương đúng cách.</p>`},
  gv:["Cho học sinh chỉ trên cơ thể mình vị trí các phần xương vừa chạm.","Đặt tay lên cánh tay bạn khi bạn gập tay để cảm nhận cơ co.","Hỏi: vì sao phải buộc cố định cả hai khớp gần chỗ gãy?","Thực hành băng bó theo nhóm với nẹp, băng thật."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 31)</p><ul class="tlist"><li>Nêu được chức năng của hệ vận động; cấu tạo, sự phù hợp giữa cấu tạo và chức năng của xương, cơ; thực hành sơ cứu, băng bó khi người khác bị gãy xương.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 31 Hệ vận động ở người.</li>
<li>Bộ xương người trưởng thành khoảng 206 xương; cặp cơ đối kháng cơ hai đầu – cơ ba đầu cánh tay: <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/11-1-interactions-of-skeletal-muscles-their-fascicle-arrangement-and-their-lever-systems" target="_blank" rel="noopener">OpenStax Anatomy and Physiology 2e, mục 11.1</a>.</li>
<li>Mô hình bộ xương giản lược (số đốt sống, xương bàn tay, bàn chân không đủ chi tiết thật) để học sinh nhận biết các phần chính.</li></ul>`;

let S;
LabKHTN.register("K8-S-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thao tác"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D bộ xương người, cánh tay có cơ hai đầu và cơ ba đầu, cẳng tay được sơ cứu bằng nẹp",legend:{w:250},
      views:{xuong:{t:[0,-.6,0],yaw:.25,pitch:.05,rad:3.6,label:"Bộ xương",icon:IC.eye},co:{t:[10.72,.72,0],yaw:1.4,pitch:.12,rad:1.12,label:"Cơ và khớp",icon:IC.hand},socuu:{t:[-10,.55,0],yaw:0,pitch:.55,rad:1.0,label:"Sơ cứu",icon:IC.plus}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={seen:{},sel:null,ang:.15,tgt:.15,flexed:false,extended:false,aid:0,recs:0};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const boneMat=o=>Object.assign({color:"#FFFFFF",rough:.55,coat:.2,hooks:KIT.TISSUE,uniforms:{uBump:.05,uNF:30}},o||{});
    const muscle=o=>Object.assign({color:"#B8323A",rough:.45,sheen:.5,coat:.3,hooks:KIT.TISSUE,uniforms:{uBump:.1,uNF:40}},o||{});
    const loadEl=document.createElement("div");loadEl.className="gl-loading glass";loadEl.innerHTML=`<i aria-hidden="true"></i>Đang dựng bộ xương 3D…`;K.over.appendChild(loadEl);
    /* ---------- trạm 1 ---------- */
    const skel=root.add(new G.Node());const PM={};
    window.LabOrgans.build("buildSkeleton").then(P=>{if(K.dead)return;for(const k in P)PM[k]=skel.add(R.mesh(P[k],boneMat()));loadEl.classList.add("out");setTimeout(()=>loadEl.remove(),400)});
    const pl=PARTS.map(p=>K.label(p.ten,p.p,{view:"xuong",dir:p.p[0]>=0?"e":"w",len:50}));
    const GROUP={skull:["skull"],spine:["spine"],ribs:["ribs"],shoulder:["shoulder"],pelvis:["pelvis"],armL:["armL","armR"],legL:["legL","legR"]};
    /* ---------- trạm 2: cánh tay (toạ độ trạm đặt tại x = 10) ---------- */
    const armN=root.add(new G.Node());armN.pos=[10,0,0];let rig=null,fore=null,bic=null,tri=null;
    const skinA=armN.add(new G.Node());
    window.LabOrgans.build("buildArmRig").then(P=>{if(K.dead)return;rig=P;armN.add(R.mesh(P.upper,boneMat()));fore=armN.add(new G.Node());fore.pos=P.joints.el;fore.add(R.mesh(P.fore,boneMat()));
      bic=armN.add(new G.Node());tri=armN.add(new G.Node());const sp=G.sphere(1,28,18);bic.add(R.mesh(sp,muscle()));tri.add(R.mesh(sp,muscle({color:"#A52A33"})));
      const tendon=o=>armN.add(R.mesh(G.cylinder(.012,1,8),{color:"#F2EEE6",rough:.4}));armN.tb1=tendon();armN.tb2=tendon();armN.tt1=tendon();armN.tt2=tendon()});
    const lBic=K.label("Cơ hai đầu (mặt trước)",[10.8,1.1,.1],{view:"co",dir:"e",len:40}),lTri=K.label("Cơ ba đầu (mặt sau)",[10.7,1.1,-.16],{view:"co",dir:"w",len:40}),lEl=K.label("Khớp khuỷu",[10.74,.72,-.1],{view:"co",dir:"sw",len:30});
    K.label("Xương cánh tay",[10.66,1.35,-.08],{view:"co",dir:"nw",len:30});const lFore=K.label("Xương cẳng tay",[10.78,.4,0],{view:"co",dir:"s",len:30});
    function placeMuscle(node,a,b,thick,tA,tB){/* thân cơ là elip nối hai điểm bám, độ dày theo độ co */const m=V3.lerp(a,b,.5);const L=V3.dist(a,b);node.pos=m;node.quat=G.Q.toward(V3.sub(b,a));node.scl=[thick,L*.42,thick*.9];
      const set=(t,p,q)=>{const l=V3.dist(p,q);t.pos=p;t.quat=G.Q.toward(V3.sub(q,p));t.scl=[1,l,1]};set(tA[0],tA[1],V3.add(m,V3.scale(V3.norm(V3.sub(a,b)),L*.38)));set(tB[0],tB[1],V3.add(m,V3.scale(V3.norm(V3.sub(b,a)),L*.38)))}
    /* ---------- trạm 3: sơ cứu (cẳng tay đặt nằm trên bàn) ---------- */
    const aid=root.add(new G.Node());aid.pos=[-10,0,0];
    aid.add(R.mesh(G.box(2.6,.08,1.5,.03,3),{color:"#D8DEE6",rough:.6})).pos=[0,.04,0];
    const skin={color:"#E8B48F",rough:.55,sheen:.5,hooks:KIT.TISSUE,uniforms:{uBump:.03,uNF:30}};
    const armPts=[[-.95,.2,0],[-.5,.2,0],[0,.19,0],[.4,.18,0],[.62,.18,0]];
    aid.add(R.mesh(G.tube(G.spline(armPts,6),t=>.12-.045*t,24,{caps:true}),skin));
    const handM=aid.add(R.mesh(G.fromSDF((x,y,z)=>{let d=Math.hypot((x-.78)/.16,(y-.17)/.05,z/.1)-1;return d*.06},[.6,.1,-.12],[.98,.24,.12],[20,10,14]),skin));
    const bruise=aid.add(R.mesh(G.sphere(1,20,14),{color:"#7B3A5C",alpha:.55,rough:.6,transparent:true,order:1}));bruise.pos=[0,.27,0];bruise.scl=[.09,.03,.08];
    const splints=[-1,1].map(s=>{const n=aid.add(R.mesh(G.box(1.5,.03,.07,.01,2),{color:"#C79A63",rough:.75}));n.pos=[-.15,.2,s*.16];n.quat=G.Q.euler(s*1.2,0,0);n.visible=false;return n});
    const pads=[-1,1].map(s=>{const n=aid.add(R.mesh(G.box(1.42,.015,.09,.006,2),{color:"#F7F5EF",rough:.95}));n.pos=[-.15,.2,s*.13];n.quat=G.Q.euler(s*1.2,0,0);n.visible=false;return n});
    const ties=[-.85,-.22,.22,.55].map(x=>{const n=aid.add(R.mesh(G.lathe([[.17,-.02],[.18,-.01],[.18,.01],[.17,.02]],28),{color:"#F2F0E8",rough:.9}));n.pos=[x,.19,0];n.quat=G.Q.euler(0,0,Math.PI/2);n.visible=false;return n});
    const band=aid.add(R.mesh(G.tube(G.spline(armPts.slice(0,4),6),.165,20),{color:"#F4F2EC",rough:.95,alpha:.97}));band.visible=false;
    const sling=aid.add(R.mesh(G.fromSDF((x,y,z)=>{const d=Math.max(Math.abs(z)-.25+(x+.3)*.12,Math.abs(y-.18)-.17);return Math.max(d,Math.abs(x+.15)-.55)},[-.75,-.02,-.4],[.45,.38,.4],[30,12,20]),{color:"#3B82F6",rough:.9,alpha:.85,transparent:true,order:2}));sling.visible=false;
    const AID=[{k:"nep",ten:"Đặt hai nẹp (gỗ, tre) dọc hai bên cẳng tay, dài quá hai khớp gần chỗ gãy",show:()=>splints.forEach(n=>n.visible=true)},
      {k:"lot",ten:"Lót vải mềm, gạc giữa nẹp và da ở chỗ tiếp xúc",show:()=>pads.forEach(n=>n.visible=true)},
      {k:"buoc",ten:"Buộc cố định nẹp ở hai đầu nẹp và hai bên chỗ gãy",show:()=>ties.forEach(n=>n.visible=true)},
      {k:"bang",ten:"Băng cố định rồi dùng khăn đeo cẳng tay vào cổ; đưa ngay tới cơ sở y tế",show:()=>{band.visible=true;sling.visible=true}}];
    K.label("Chỗ xương gãy",[-10,.28,0],{view:"socuu",dir:"n",len:40});
    /* ---------- cập nhật ---------- */
    K.onFrame((dt,rdt)=>{
      skel.visible=K.view==="xuong";armN.visible=K.view==="co";aid.visible=K.view==="socuu";
      const on=S.sel?GROUP[S.sel]:null;for(const k in PM){const hi=!on||on.includes(k);PM[k].mat.color=hi&&on?H("#FFE7A3"):H("#FFFFFF");PM[k].mat.alpha=hi?1:.35;PM[k].mat.transparent=!hi}
      S.ang+=(S.tgt-S.ang)*Math.min(1,rdt*2.5);
      if(rig&&fore){const el=rig.joints.el;fore.quat=G.Q.axis([1,0,0],-S.ang*1.9);
        const sh=rig.joints.sh;const rot=p=>{const q=V3.sub(p,el);const a=-S.ang*1.9,c=Math.cos(a),s=Math.sin(a);return V3.add(el,[q[0],q[1]*c-q[2]*s,q[1]*s+q[2]*c])};
        const bA=[sh[0]+.05,sh[1]-.1,sh[2]+.07],bB=rot([el[0]+.02,el[1]-.12,el[2]+.05]);const tA=[sh[0]-.05,sh[1]-.08,sh[2]-.08],tB=[el[0]-.06,el[1]-.02,el[2]-.07];
        const L0=V3.dist([sh[0]+.05,sh[1]-.1,sh[2]+.07],[el[0]+.02,el[1]-.12,el[2]+.05]);const kb=V3.dist(bA,bB)/L0;/* <1 khi co */
        placeMuscle(bic,bA,bB,.065/Math.sqrt(kb),[armN.tb1,bA],[armN.tb2,bB]);placeMuscle(tri,tA,tB,.06*(1+.1*(1-S.ang)),[armN.tt1,tA],[armN.tt2,tB]);
        lBic.p=V3.add(V3.lerp(bA,bB,.5),[10.05,0,0]);lFore.p=V3.add(rot([el[0]+.03,el[1]-.4,el[2]]),[10,0,0])}});
    /* ---------- chạm ---------- */
    K.pickFn((x,y)=>{if(K.view!=="xuong")return null;const r=R.ray(x,y);let best=null,bd=1e9;
      const box={skull:[[-.4,1.7,-.5],[.4,2.8,.48]],spine:[[-.1,-.8,-.35],[.1,1.8,-.05]],ribs:[[-.8,.7,-.5],[.8,1.55,.35]],shoulder:[[-.7,1.45,-.45],[.7,1.68,.25]],pelvis:[[-.66,-1.05,-.3],[.66,-.15,.32]],
        armL:[[.55,-.4,-.2],[1.0,1.55,.15]],armR:[[-1.0,-.4,-.2],[-.55,1.55,.15]],legL:[[.15,-4,-.2],[.45,-.8,.4]],legR:[[-.45,-4,-.2],[-.15,-.8,.4]]};
      for(const k in box){const t=G.hit.box(r,box[k][0],box[k][1]);if(t!=null&&t<bd){bd=t;best=k}}return best?{part:best==="armR"?"armL":best==="legR"?"legL":best}:null});
    K.tapFn(k=>{if(!k)return;S.sel=k.part;S.seen[k.part]=1;pl.forEach((it,i)=>it.el.classList.toggle("follow",PARTS[i].k===S.sel));refresh()});
    K.dockFn(()=>{const v=K.view;if(v==="xuong")return[{grid:PARTS.map(p=>({k:"part",v:p.k,label:p.ten.split(" (")[0],icon:IC.eye,on:S.sel===p.k}))}];
      if(v==="co")return[{k:"gap",label:"Gập cẳng tay",icon:IC.hand,on:S.tgt>.6},{k:"duoi",label:"Duỗi cẳng tay",icon:IC.step,on:S.tgt<.3}];
      return AID.map((a,i)=>({k:"aid",v:String(i),label:["Đặt nẹp","Lót vải mềm","Buộc cố định","Băng, đeo tay vào cổ"][i],icon:i<S.aid?'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 21l7 7 13-15"/></svg>':IC.plus,dis:i<S.aid})).concat([{k:"raid",label:"Làm lại",icon:IC.reset}])});
    K.onDock((k,v)=>{if(k==="part"){S.sel=v;S.seen[v]=1;pl.forEach((it,i)=>it.el.classList.toggle("follow",PARTS[i].k===S.sel))}
      else if(k==="gap"){S.tgt=.85;if(!S.flexed){S.flexed=true;rec("Gập cẳng tay","cơ hai đầu co: ngắn lại, phình to, kéo xương cẳng tay quay lên quanh khớp khuỷu; cơ ba đầu dãn ra")}}
      else if(k==="duoi"){S.tgt=.12;if(S.flexed&&!S.extended){S.extended=true;rec("Duỗi cẳng tay","cơ ba đầu co kéo xương cẳng tay xuống; cơ hai đầu dãn ra, dài và mỏng lại")}}
      else if(k==="aid"){const i=+v;if(i!==S.aid){api.toast(`Chưa đúng thứ tự. Bước tiếp theo: ${AID[S.aid].ten.toLowerCase()}.`,"warn",2600)}else{AID[i].show();S.aid++;rec(`Sơ cứu bước ${i+1}`,AID[i].ten);if(S.aid===4)api.toast("Đã sơ cứu xong. Đưa người bị nạn tới cơ sở y tế gần nhất.","ok",2600)}}
      else if(k==="raid"){S.aid=0;splints.concat(pads,ties,[band,sling]).forEach(n=>n.visible=false)}refresh()});
    K.infoFn(()=>{const v=K.view;if(v==="xuong"){const p=PARTS.find(x=>x.k===S.sel);return p?`<div><b>${p.ten}</b></div><small>${p.f}</small>`:`<div><b>Bộ xương người</b></div><small>Khoảng 206 xương: xương đầu, xương thân, xương chi. Chạm vào một phần để xem.</small>`}
      if(v==="co")return `<div><b>Cơ và khớp</b></div><div>Góc gập khuỷu: ${fmt(S.ang*1.9*180/Math.PI,0)}°</div><small>Cơ chỉ co (kéo) được: cơ hai đầu gập tay, cơ ba đầu duỗi tay.</small>`;
      return `<div><b>Sơ cứu gãy xương cẳng tay</b></div>${AID.map((a,i)=>`<div>${i<S.aid?"✓":i+1+"."} ${a.ten}</div>`).join("")}`});
    K.timeLabel(()=>`t = ${fmt(K.simT,1)} s`);
    K.onReset(()=>{S.sel=null;S.tgt=.15;refresh()});
    /* trạm tự động */K.autoStations&&K.autoStations();
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"gap",p:[10.78,.4,0],tip:"Chạm để gập cẳng tay",view:"co"},{k:"duoi",p:[10.8,1.0,.1],tip:"Chạm để duỗi cẳng tay",view:"co"}]);
    K.start();
    api.vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){PARTS.forEach(p=>S.seen[p.k]=1);K._dockH("gap");setTimeout(()=>K._dockH("duoi"),2500);for(let i=0;i<4;i++)K._dockH("aid",String(i));refresh()}};
    return K.mount(st)}
});
})();
