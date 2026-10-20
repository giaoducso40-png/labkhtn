/* K8-H-04 · Phương trình hóa học: lập phương trình bằng mô hình hạt (SGK KHTN 8 – Kết nối tri thức, Bài 5) · 3D
   Mô hình quả cầu – que nối (màu CPK): học sinh tăng, giảm số phân tử (hệ số) ở hai vế cho tới khi số nguyên tử mỗi nguyên tố
   ở hai vế bằng nhau; khi đã cân bằng, cho phản ứng xảy ra: các liên kết cũ bị phá vỡ, nguyên tử sắp xếp lại thành phân tử mới.
   Hình dạng phân tử theo góc liên kết thật (H₂O 104,5°, NH₃ 107°, CH₄ tứ diện, CO₂ thẳng); MgO, Al₂O₃ là hợp chất ion,
   vẽ một đơn vị công thức để đếm nguyên tử. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const H=G.hex;
const EL={H:{c:"#F4F6F8",r:.2},O:{c:"#E53935",r:.3},C:{c:"#3A3F47",r:.32},N:{c:"#3F6FE0",r:.31},Mg:{c:"#7CC242",r:.4},Al:{c:"#C9A9A6",r:.38}};
const S3=Math.sqrt(3);
/* toạ độ nguyên tử trong phân tử (Å, thu nhỏ khi vẽ); b: các cặp liên kết */
const MOL={
  H2:{f:"H₂",a:[["H",-.37,0,0],["H",.37,0,0]],b:[[0,1]]},
  O2:{f:"O₂",a:[["O",-.6,0,0],["O",.6,0,0]],b:[[0,1,2]]},
  N2:{f:"N₂",a:[["N",-.55,0,0],["N",.55,0,0]],b:[[0,1,3]]},
  H2O:{f:"H₂O",a:[["O",0,.12,0],["H",-.757,-.466,0],["H",.757,-.466,0]],b:[[0,1],[0,2]]},
  NH3:{f:"NH₃",a:[["N",0,.13,0],["H",.94,-.25,0],["H",-.47,-.25,.81],["H",-.47,-.25,-.81]],b:[[0,1],[0,2],[0,3]]},
  CH4:{f:"CH₄",a:[["C",0,0,0],["H",.63,.63,.63],["H",.63,-.63,-.63],["H",-.63,.63,-.63],["H",-.63,-.63,.63]],b:[[0,1],[0,2],[0,3],[0,4]]},
  CO2:{f:"CO₂",a:[["C",0,0,0],["O",-1.16,0,0],["O",1.16,0,0]],b:[[0,1,2],[0,2,2]]},
  Mg:{f:"Mg",a:[["Mg",0,0,0]],b:[]},
  Al:{f:"Al",a:[["Al",0,0,0]],b:[]},
  MgO:{f:"MgO",a:[["Mg",-.55,0,0],["O",.55,0,0]],b:[],ion:true},
  Al2O3:{f:"Al₂O₃",a:[["O",-1.3,-.2,0],["Al",-.65,.3,0],["O",0,-.2,0],["Al",.65,.3,0],["O",1.3,-.2,0]],b:[],ion:true}};
const RX=[
  {k:"h2o",ten:"Hydrogen cháy trong oxygen",L:["H2","O2"],R:["H2O"],ans:[2,1,2]},
  {k:"mgo",ten:"Đốt cháy magnesium",L:["Mg","O2"],R:["MgO"],ans:[2,1,2]},
  {k:"al",ten:"Đốt cháy nhôm (aluminium)",L:["Al","O2"],R:["Al2O3"],ans:[4,3,2]},
  {k:"ch4",ten:"Đốt cháy khí methane",L:["CH4","O2"],R:["CO2","H2O"],ans:[1,2,1,2]},
  {k:"nh3",ten:"Tổng hợp ammonia",L:["N2","H2"],R:["NH3"],ans:[1,3,2]}];
const MAXC=6,SC=.42;

const SPEC={
  predict:[{id:"p1",q:"Sơ đồ phản ứng: H₂ + O₂ → H₂O. Muốn số nguyên tử O ở hai vế bằng nhau, cần:",opts:[["h2o","Thêm hệ số 2 trước H₂O"],["o","Đổi O₂ thành O"],["h2o2","Viết sản phẩm là H₂O₂"]],ans:"h2o",res:"Kết quả: đặt hệ số 2 trước H₂O, rồi hệ số 2 trước H₂: 2H₂ + O₂ → 2H₂O."},
    {id:"p2",q:"Khi lập phương trình hóa học, có được thay đổi chỉ số trong công thức hóa học (ví dụ H₂O thành H₂O₂) không?",opts:[["khong","Không, chỉ được đặt hệ số trước công thức"],["co","Được, nếu cân bằng nhanh hơn"]],ans:"khong",res:"Kết quả: thay đổi chỉ số là tạo ra chất khác; chỉ được thêm hệ số."}],
  taskLead:"Chọn phản ứng ở khay. Bấm + hoặc − để thay đổi số phân tử (hệ số) mỗi chất. Bảng bên trái so sánh số nguyên tử hai vế.",
  tasks:[{html:"Lập được phương trình hóa học của ít nhất 3 phản ứng.",done:()=>Object.keys(S.ok).length>=3},
    {html:"Lập phương trình đốt cháy nhôm (hệ số lớn nhất).",done:()=>!!S.ok.al},
    {html:"Cho phản ứng xảy ra ít nhất một lần và quan sát nguyên tử sắp xếp lại.",done:()=>S.anim>0}],
  obs:[{id:"a",q:"Trong phản ứng hóa học, điều gì thay đổi?",opts:[["lk","Liên kết giữa các nguyên tử thay đổi, phân tử này biến đổi thành phân tử khác"],["nt","Số nguyên tử mỗi nguyên tố thay đổi"],["ng","Nguyên tử biến thành nguyên tử khác"]],ans:"lk",why:"Số nguyên tử mỗi nguyên tố được giữ nguyên; chỉ có liên kết giữa các nguyên tử thay đổi."},
    {id:"b",q:"Phương trình 4Al + 3O₂ → 2Al₂O₃ cho biết tỉ lệ số nguyên tử Al : số phân tử O₂ : số đơn vị Al₂O₃ là:",opts:[["432","4 : 3 : 2"],["111","1 : 1 : 1"],["232","2 : 3 : 2"]],ans:"432",why:"Hệ số trong phương trình cho biết tỉ lệ số hạt (nguyên tử, phân tử) giữa các chất."}],
  concl:{html:`<div class="eq">2H₂ + O₂ → 2H₂O<br>2Mg + O₂ → 2MgO<br>4Al + 3O₂ → 2Al₂O₃<br>CH₄ + 2O₂ → CO₂ + 2H₂O<br>N₂ + 3H₂ → 2NH₃ (có xúc tác, nhiệt độ, áp suất cao)</div><ul class="tlist">
    <li>Các bước lập phương trình hóa học: (1) viết sơ đồ phản ứng; (2) so sánh số nguyên tử của mỗi nguyên tố ở hai vế; (3) chọn hệ số thích hợp đặt trước công thức hóa học; (4) viết phương trình hóa học.</li>
    <li>Không được thay đổi chỉ số trong công thức hóa học; hệ số là số nguyên nhỏ nhất.</li>
    <li>Phương trình hóa học cho biết tỉ lệ về số nguyên tử, số phân tử giữa các chất trong phản ứng.</li></ul>`,
    quiz:[{id:"q1",q:"Hệ số đúng của phương trình: ?Fe + ?Cl₂ → ?FeCl₃ là:",opts:[["a","2, 3, 2"],["b","1, 3, 1"],["c","2, 2, 2"]],ans:"a",why:{b:"Vế trái 6 Cl nhưng vế phải 3 Cl.",c:"Vế trái 4 Cl nhưng vế phải 6 Cl."}},
      {id:"q2",q:"Phương trình P₄ + 5O₂ → 2P₂O₅ có tỉ lệ số phân tử P₄ : O₂ là:",opts:[["a","1 : 5"],["b","4 : 5"],["c","5 : 2"]],ans:"a",why:{b:"Hệ số của P₄ là 1.",c:"Đó là tỉ lệ O₂ : P₂O₅."}}],
    done:`<h2>Hoàn thành: Lập phương trình hóa học</h2><p class="muted">Số nguyên tử mỗi nguyên tố ở hai vế bằng nhau; chỉ đặt hệ số, không đổi chỉ số.</p>`},
  gv:["Cho học sinh dự đoán hệ số trước, sau đó kiểm tra bằng mô hình.","Với Al + O₂, gợi ý: số O ở hai vế phải là bội chung nhỏ nhất của 2 và 3.","Hỏi: vì sao không viết 2H₂ + O₂ → H₄O₂?"]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 5)</p><ul class="tlist"><li>Lập được sơ đồ phản ứng hóa học dạng chữ và phương trình hóa học (dùng công thức hóa học) của một số phản ứng hóa học cụ thể.</li><li>Nêu được ý nghĩa của phương trình hóa học.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 5 Định luật bảo toàn khối lượng và phương trình hóa học.</li>
<li>Độ dài, góc liên kết dùng dựng mô hình: H₂O (0,96 Å; 104,5°), NH₃ (1,01 Å; 107°), CH₄ (1,09 Å; tứ diện), CO₂ (1,16 Å; thẳng): <a href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/07%3A_Chemical_Bonding_and_Molecular_Geometry/7.06%3A_Molecular_Structure_and_Polarity" target="_blank" rel="noopener">OpenStax Chemistry 2e, mục 7.6</a>.</li>
<li>Màu nguyên tử theo quy ước CPK: H trắng, O đỏ, C xám đen, N xanh dương.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>MgO, Al₂O₃ là hợp chất ion, thực tế tồn tại dạng mạng tinh thể; mô hình chỉ vẽ một đơn vị công thức để đếm nguyên tử. Kích thước quả cầu không theo tỉ lệ bán kính thật.</li></ul>`;

let S;
LabKHTN.register("K8-H-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"sd",t:"Sơ đồ"},{k:"pt",t:"Phương trình hóa học"},{k:"kt",t:"Kiểm tra số nguyên tử"}],empty:"Lập xong mỗi phương trình, kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình hạt 3D để lập phương trình hóa học",legend:{w:250},views:{pt:{t:[.15,1.2,0],yaw:0,pitch:.1,rad:3.95,label:"Phương trình",icon:IC.grid}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={rx:0,co:[1,1,1],ok:{},anim:0,run:null,recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    /* khay, mũi tên */
    const trayM={color:"#3B4566",rough:.6,alpha:.85,transparent:true,order:-1};
    for(const x of [-2.15,2.15])root.add(R.mesh(G.box(3.5,.08,1.6,.04,3),trayM)).pos=[x,-.05,0];
    const arrow=root.add(new G.Node());arrow.pos=[0,1.3,0];arrow.add(R.mesh(G.box(.5,.07,.07,.02,2),{color:"#FDE047",rough:.4})).pos=[-.06,0,0];
    const head=arrow.add(R.mesh(G.lathe([[.14,0],[0,.3]],24),{color:"#FDE047",rough:.4,side:"double"}));head.quat=G.Q.euler(0,0,-Math.PI/2);head.pos=[.18,0,0];
    const sph={};for(const e in EL)sph[e]=G.sphere(EL[e].r,28,20);const cyl=G.cylinder(.055,1,12,false);
    const matA={};for(const e in EL)matA[e]={color:EL[e].c,rough:.32,coat:.55};
    const layer=root.add(new G.Node());let atoms=[],bonds=[],pAtoms=[],pBonds=[];
    const rx=()=>RX[S.rx];
    const species=()=>rx().L.concat(rx().R);
    function slots(side,list,co){/* xếp phân tử theo cột cho từng chất; mỗi hàng chứa vừa bề rộng cột */const out=[];const n=list.length;const W=3.4,x0=side<0?-3.85:.45;
      list.forEach((m,i)=>{const cx=x0+W*(i+.5)/n;const A=MOL[m].a;const w=(Math.max(...A.map(a=>a[1]))-Math.min(...A.map(a=>a[1])))*SC+2*Math.max(...A.map(a=>EL[a[0]].r))+.1;
        const hh=Math.max(.7,(Math.max(...A.map(a=>a[2]))-Math.min(...A.map(a=>a[2])))*SC+2*Math.max(...A.map(a=>EL[a[0]].r))+.12);const per=Math.max(1,Math.min(co[i],Math.floor((W/n)/w)));for(let j=0;j<co[i];j++){const col=j%per,row=Math.floor(j/per);out.push({m,p:[cx+(col-(per-1)/2)*w,.45+row*hh,0]})}});return out}
    function makeMol(slot,ghost){const M=MOL[slot.m];const at=[],bd=[];
      M.a.forEach(a=>{const n=layer.add(R.mesh(sph[a[0]],ghost?Object.assign({},matA[a[0]],{alpha:.3,transparent:true,order:2}):matA[a[0]]));const p=V3.add(slot.p,[a[1]*SC,a[2]*SC,a[3]*SC]);n.pos=p;at.push({n,el:a[0],p})});
      M.b.forEach(b=>{const ord=b[2]||1;for(let k=0;k<ord;k++){const n=layer.add(R.mesh(cyl,{color:"#C9CED6",rough:.4,alpha:ghost?.3:1,transparent:!!ghost,order:ghost?2:0}));bd.push({n,a:at[b[0]],b:at[b[1]],k,ord})}});
      return{at,bd}}
    function placeBond(B){const a=B.a.n.pos,b=B.b.n.pos;const d=V3.sub(b,a);const L=V3.len(d);const off=B.ord>1?(B.k-(B.ord-1)/2)*.09:0;
      const side=V3.norm(V3.cross(d,[0,0,1]));B.n.pos=V3.add(a,V3.scale(side,off));B.n.quat=G.Q.toward(d);B.n.scl=[1,L,1]}
    function rebuild(){layer.children.slice().forEach(n=>layer.remove(n));atoms=[];bonds=[];pAtoms=[];pBonds=[];const r=rx();const nL=r.L.length;
      for(const s of slots(-1,r.L,S.co.slice(0,nL))){const m=makeMol(s,false);atoms.push(...m.at);bonds.push(...m.bd)}
      for(const s of slots(1,r.R,S.co.slice(nL))){const m=makeMol(s,true);pAtoms.push(...m.at);pBonds.push(...m.bd)}
      bonds.concat(pBonds).forEach(placeBond)}
    const count=(list,co)=>{const c={};list.forEach((m,i)=>{for(const a of MOL[m].a)c[a[0]]=(c[a[0]]||0)+co[i]});return c};
    const tally=()=>{const r=rx(),nL=r.L.length;const L=count(r.L,S.co.slice(0,nL)),Rr=count(r.R,S.co.slice(nL));const els=[...new Set(Object.keys(L).concat(Object.keys(Rr)))];return{L,R:Rr,els,ok:els.every(e=>L[e]===Rr[e])}};
    const gcd=(a,b)=>b?gcd(b,a%b):a;const minimal=()=>S.co.reduce(gcd)===1;
    const eqStr=(arrow)=>{const r=rx(),nL=r.L.length;const side=(list,off)=>list.map((m,i)=>`${S.co[off+i]>1?S.co[off+i]:""}${MOL[m].f}`).join(" + ");return `${side(r.L,0)} ${arrow} ${side(r.R,nL)}`};
    const schema=()=>{const r=rx();return `${r.L.map(m=>MOL[m].f).join(" + ")} ⇢ ${r.R.map(m=>MOL[m].f).join(" + ")}`};
    function setRx(i){S.rx=i;S.co=species().map(()=>1);S.run=null;rebuild();refresh()}
    setRx(0);

    /* ================= nhãn ================= */
    K.label("Các chất tham gia",[-2.15,-.05,.8],{view:"pt",dir:"s",len:20});K.label("Các chất sản phẩm",[2.15,-.05,.8],{view:"pt",dir:"s",len:20});
    const lEq=K.label("",[0,3.4,0],{view:"pt",dir:"n",len:0,cls:"plain"});

    /* ================= phản ứng: nguyên tử dịch chuyển ================= */
    function react(){const t=tally();if(!t.ok)return;const used=new Set();const pairs=[];
      for(const pa of pAtoms){let best=null,bd=1e9;atoms.forEach((a,i)=>{if(used.has(i)||a.el!==pa.el)return;const d=V3.dist(a.p,pa.p);if(d<bd){bd=d;best=i}});used.add(best);pairs.push([atoms[best],pa])}
      S.run={t:0,pairs};S.anim++;bonds.forEach(b=>b.n.visible=false);pAtoms.forEach(a=>a.n.visible=false);pBonds.forEach(b=>b.n.visible=false)}
    K.onFrame((dt)=>{const R0=S.run;if(R0){R0.t+=dt;const T=2.6;const u=C.clamp(R0.t/T,0,1);const s=u*u*(3-2*u);
        for(const [a,p] of R0.pairs){const mid=V3.add(V3.lerp(a.p,p.p,.5),[0,.9+.3*Math.sin(a.p[0]*3),0]);const q=1-s;a.n.pos=[q*q*a.p[0]+2*q*s*mid[0]+s*s*p.p[0],q*q*a.p[1]+2*q*s*mid[1]+s*s*p.p[1],q*q*a.p[2]+2*q*s*mid[2]+s*s*p.p[2]]}
        if(u>=1){R0.done=true;pBonds.forEach(b=>{b.n.visible=true;b.n.mat.alpha=1;b.n.mat.transparent=false});S.run=null;S.after=true;refresh()}}
      const t=tally();lEq.set(`<b style="font-size:1.05em">${eqStr(t.ok&&minimal()?"→":"⇢")}</b>`)});
    function check(){const t=tally();if(t.ok&&minimal()&&!S.ok[rx().k]){S.ok[rx().k]=1;S.recs++;
        api.record({lan:String(S.recs),sd:schema(),pt:eqStr("→"),kt:t.els.map(e=>`${e}: ${t.L[e]} = ${t.R[e]}`).join("; ")});api.toast("Đã cân bằng: "+eqStr("→"),"ok",2400)}}

    /* ================= khay ================= */
    K.dockFn(()=>{const sp=species(),busy=!!S.run;const t=tally();
      return[{grid:RX.map((r,i)=>({k:"rx",v:String(i),label:r.ten.replace("Đốt cháy ","Đốt ").replace(" trong oxygen",""),icon:S.ok[r.k]?'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 21l7 7 13-15"/></svg>':IC.grid,on:S.rx===i}))},"hr",
        {grid:sp.flatMap((m,i)=>[{k:"inc",v:String(i),label:`+ ${MOL[m].f}`,icon:IC.plus,dis:busy||S.co[i]>=MAXC||S.after},{k:"dec",v:String(i),label:`− ${MOL[m].f}`,icon:IC.minus,dis:busy||S.co[i]<=1||S.after}])},
        "hr",{k:"go",label:"Cho phản ứng xảy ra",icon:IC.play,dis:busy||!t.ok||S.after},{k:"back",label:"Làm lại phản ứng",icon:IC.reset,dis:busy}]});
    K.onDock((k,v)=>{if(k==="rx"){S.after=false;setRx(+v);return}
      if(k==="inc"){S.co[+v]++;rebuild();check()}else if(k==="dec"){S.co[+v]--;rebuild();check()}
      else if(k==="go"){react();if(!api.time.playing)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}
      else if(k==="back"){S.after=false;S.run=null;rebuild()}
      refresh()});
    K.infoFn(()=>{const t=tally();const r=rx();
      return `<div><b>${r.ten}</b></div><div>Sơ đồ: ${schema()}</div><table class="mx"><tr><th>Nguyên tố</th><th>Vế trái</th><th>Vế phải</th><th></th></tr>${t.els.map(e=>`<tr><td><i style="background:${EL[e].c}"></i>${e}</td><td>${t.L[e]||0}</td><td>${t.R[e]||0}</td><td>${t.L[e]===t.R[e]?"✓":"✗"}</td></tr>`).join("")}</table>
        <small>${t.ok?(minimal()?(S.after?"Phản ứng xong: số nguyên tử mỗi nguyên tố được giữ nguyên.":"Đã cân bằng. Bấm “Cho phản ứng xảy ra”."):"Đã cân bằng nhưng hệ số chưa tối giản, hãy giảm bớt."):"Chưa cân bằng: tăng, giảm số phân tử ở hai vế."}</small>`});
    K.timeLabel(()=>S.run?"Liên kết cũ bị phá vỡ, nguyên tử sắp xếp lại…":eqStr(tally().ok&&minimal()?"→":"⇢"));
    K.onReset(()=>{S.after=false;S.run=null;rebuild();refresh()});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"go",p:[0,.5,.8],tip:"Chạm để cho phản ứng xảy ra",view:Object.keys(K.views)}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){RX.forEach((r,i)=>{S.rx=i;S.co=r.ans.slice();rebuild();check()});S.rx=2;S.co=RX[2].ans.slice();rebuild();react();refresh()}};
    return K.mount(st)}
});
})();
