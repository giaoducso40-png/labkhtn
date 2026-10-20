/* K7-H-03 · Phân tử, đơn chất, hợp chất; khối lượng phân tử (SGK KHTN 7 – Kết nối tri thức, Bài 5) · mô hình 3D
   - Mẫu chất: các hạt chuyển động trong bình (chất khí, chất lỏng) hoặc xếp đều đặn (chất rắn).
   - Đơn chất: tạo nên từ một nguyên tố (Cu, O₂, N₂, H₂); hợp chất: từ hai nguyên tố trở lên (H₂O, CO₂, NaCl, CH₄).
   - Khối lượng phân tử = tổng khối lượng các nguyên tử trong phân tử (amu). Kim loại Cu: hạt hợp thành là nguyên tử;
     NaCl: hạt hợp thành là ion Na⁺ và Cl⁻ – khối lượng tính theo công thức NaCl.
   Hình học phân tử theo số đo thực (độ dài liên kết, góc liên kết); bán kính quả cầu thu nhỏ để thấy rõ liên kết. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const AT={H:{c:"#F1F5F9",r:.25,m:1,ten:"hydrogen"},C:{c:"#3F444C",r:.36,m:12,ten:"carbon"},N:{c:"#3B6FE0",r:.35,m:14,ten:"nitơ (nitrogen)"},O:{c:"#E53935",r:.34,m:16,ten:"oxygen"},
  Cl:{c:"#4CC24A",r:.45,m:35.5,ten:"chlorine"},Na:{c:"#9B59D0",r:.3,m:23,ten:"natri (sodium)"},Cu:{c:"#C8783E",r:.62,m:64,ten:"đồng (copper)"}};
const D2R=Math.PI/180;
/* tọa độ nguyên tử (Å) */
const tet=1.09/Math.sqrt(3);
const SUB={
  Cu:{ten:"Đồng",ct:"Cu",loai:"don",the:"ran",hat:"nguyên tử",m:64,note:"Kim loại đồng: các nguyên tử Cu xếp khít nhau, đều đặn (mạng lập phương tâm mặt, cạnh ô 3,61 Å)."},
  O2:{ten:"Oxygen",ct:"O₂",loai:"don",the:"khi",hat:"phân tử",m:32,at:[["O",-.605,0,0],["O",.605,0,0]],b:[[0,1,2]]},
  N2:{ten:"Nitơ (nitrogen)",ct:"N₂",loai:"don",the:"khi",hat:"phân tử",m:28,at:[["N",-.55,0,0],["N",.55,0,0]],b:[[0,1,3]]},
  H2:{ten:"Hydrogen",ct:"H₂",loai:"don",the:"khi",hat:"phân tử",m:2,at:[["H",-.37,0,0],["H",.37,0,0]],b:[[0,1,1]]},
  H2O:{ten:"Nước",ct:"H₂O",loai:"hop",the:"long",hat:"phân tử",m:18,at:[["O",0,0,0],["H",.96*Math.sin(52.25*D2R),-.96*Math.cos(52.25*D2R),0],["H",-.96*Math.sin(52.25*D2R),-.96*Math.cos(52.25*D2R),0]],b:[[0,1,1],[0,2,1]]},
  CO2:{ten:"Carbon dioxide",ct:"CO₂",loai:"hop",the:"khi",hat:"phân tử",m:44,at:[["C",0,0,0],["O",1.16,0,0],["O",-1.16,0,0]],b:[[0,1,2],[0,2,2]]},
  NaCl:{ten:"Muối ăn (sodium chloride)",ct:"NaCl",loai:"hop",the:"ran",hat:"ion Na⁺ và Cl⁻",m:58.5,note:"Muối ăn: các ion Na⁺ và Cl⁻ xếp xen kẽ, đều đặn (khoảng cách Na⁺ – Cl⁻ 2,82 Å)."},
  CH4:{ten:"Methane",ct:"CH₄",loai:"hop",the:"khi",hat:"phân tử",m:16,at:[["C",0,0,0],["H",tet,tet,tet],["H",-tet,-tet,tet],["H",-tet,tet,-tet],["H",tet,-tet,-tet]],b:[[0,1,1],[0,2,1],[0,3,1],[0,4,1]]}};
const KEYS=["Cu","O2","N2","H2","H2O","CO2","NaCl","CH4"];
const ATS=k=>{const s=SUB[k];if(!s.at)return k==="Cu"?{Cu:1}:{Na:1,Cl:1};const o={};for(const a of s.at)o[a[0]]=(o[a[0]]||0)+1;return o};
const massExpr=k=>{const o=ATS(k);return Object.keys(o).map(e=>o[e]>1?`${o[e]} × ${fmt(AT[e].m,AT[e].m%1?1:0)}`:`${fmt(AT[e].m,AT[e].m%1?1:0)}`).join(" + ")};

const SPEC={
  predict:[{id:"p1",q:"Khí oxygen (O₂) là đơn chất hay hợp chất?",opts:[["don","Đơn chất – chỉ do nguyên tố O tạo nên"],["hop","Hợp chất – vì có 2 nguyên tử"]],ans:"don",res:"Kết quả: phân tử O₂ gồm 2 nguyên tử của cùng một nguyên tố → đơn chất."},
    {id:"p2",q:"Khối lượng phân tử nước (H₂O) là:",opts:[["18","18 amu"],["17","17 amu"],["3","3 amu"]],ans:"18",res:"Kết quả: 2 × 1 + 16 = 18 amu."}],
  taskLead:"Chọn chất ở khay để quan sát các hạt hợp thành; phân loại đơn chất/hợp chất và chọn khối lượng phân tử đúng.",
  tasks:[{html:"<b>Phân loại</b> đúng cả 8 chất.",done:()=>KEYS.every(k=>S.cls[k])},{html:"<b>Khối lượng phân tử:</b> tính đúng cho 6 chất có phân tử.",done:()=>KEYS.filter(k=>SUB[k].at).every(k=>S.km[k])}],
  obs:[{id:"a",q:"Phân tử là:",opts:[["ok","Hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau, thể hiện đầy đủ tính chất hóa học của chất"],["nt","Hạt nhỏ nhất không thể chia"],["ion","Một ion"]],ans:"ok",why:"Ví dụ phân tử nước gồm 2 nguyên tử H và 1 nguyên tử O."},
    {id:"b",q:"Chất nào sau đây là hợp chất?",opts:[["ok","CO₂"],["o2","O₂"],["cu","Cu"]],ans:"ok",why:"CO₂ do hai nguyên tố C và O tạo nên."},
    {id:"c",q:"Ở chất rắn, các hạt hợp thành:",opts:[["ok","Xếp sít nhau, đều đặn, chỉ dao động tại chỗ"],["xa","Ở xa nhau, chuyển động hỗn loạn"],["k","Đứng yên tuyệt đối"]],ans:"ok",why:"Ở chất khí, các phân tử ở rất xa nhau và chuyển động hỗn loạn."}],
  concl:{html:`<ul class="tlist"><li><b>Phân tử</b> là hạt đại diện cho chất, gồm một số nguyên tử liên kết với nhau và thể hiện đầy đủ tính chất hóa học của chất.</li>
    <li><b>Đơn chất</b> là chất được tạo nên từ một nguyên tố hóa học (Cu, O₂, N₂, H₂). <b>Hợp chất</b> là chất được tạo nên từ hai hay nhiều nguyên tố (H₂O, CO₂, NaCl, CH₄).</li>
    <li><b>Khối lượng phân tử</b> bằng tổng khối lượng các nguyên tử trong phân tử, đơn vị amu. Ví dụ: CO₂ = 12 + 2 × 16 = 44 amu.</li></ul>`,
    quiz:[{id:"q1",q:"Khối lượng phân tử của NH₃ (N = 14, H = 1) là:",opts:[["a","17 amu"],["b","15 amu"],["c","42 amu"]],ans:"a",why:{b:"Có 3 nguyên tử H: 14 + 3 × 1 = 17.",c:"Nhân sai: chỉ nhân khối lượng H với 3."}},
      {id:"q2",q:"Dãy nào gồm toàn đơn chất?",opts:[["a","Cu, O₂, Cl₂"],["b","H₂O, O₂, Cu"],["c","NaCl, CO₂, N₂"]],ans:"a",why:{b:"H₂O là hợp chất.",c:"NaCl, CO₂ là hợp chất."}}],
    done:`<h2>Hoàn thành: phân tử, đơn chất, hợp chất</h2><p class="muted">Đơn chất – một nguyên tố; hợp chất – từ hai nguyên tố trở lên; khối lượng phân tử bằng tổng khối lượng nguyên tử.</p>`},
  gv:["Cho học sinh đếm số nguyên tử mỗi loại trong phân tử trước khi tính khối lượng.","So sánh cách sắp xếp hạt ở mẫu đồng (rắn), nước (lỏng), oxygen (khí).","Lưu ý: NaCl là hợp chất ion, hạt hợp thành là ion (kiến thức Bài 6)."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 5)</p><ul class="tlist"><li>Nêu được khái niệm phân tử, đơn chất, hợp chất; đưa ra được một số ví dụ về đơn chất và hợp chất; tính được khối lượng phân tử theo đơn vị amu.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 5 Phân tử – Đơn chất – Hợp chất.</li>
<li>Độ dài liên kết và góc liên kết (O₂ 1,21 Å; N₂ 1,10 Å; H₂ 0,74 Å; H₂O 0,96 Å, 104,5°; CO₂ 1,16 Å; CH₄ 1,09 Å, 109,5°): <a href="https://cccbdb.nist.gov/" target="_blank" rel="noopener">NIST Computational Chemistry Comparison and Benchmark Database (CCCBDB)</a>.</li>
<li>Hằng số mạng Cu (3,61 Å) và NaCl (5,64 Å): <a href="https://openstax.org/books/chemistry-2e/pages/10-6-lattice-structures-in-crystalline-solids" target="_blank" rel="noopener">OpenStax Chemistry 2e, mục 10.6</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Kích thước quả cầu thu nhỏ so với bán kính thật để thấy liên kết; màu theo quy ước mô hình (H trắng, C xám, O đỏ, N xanh dương, Cl xanh lá). Mật độ và tốc độ hạt trong bình chỉ để minh họa.</li></ul>`;

let S;
LabKHTN.register("K7-H-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"chat",t:"Chất"},{k:"loai",t:"Loại"},{k:"hat",t:"Hạt hợp thành"},{k:"m",t:"Khối lượng phân tử"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D phân tử, đơn chất và hợp chất",legend:{w:270},
      views:{mau:{t:[0,0,0],yaw:.45,pitch:.3,rad:3.2,label:"Mẫu chất",icon:IC.beaker},pt:{t:[12,0,0],yaw:.3,pitch:.2,rad:1.5,label:"Một hạt",icon:IC.dna}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={k:"H2O",cls:{},km:{},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const SC=.62;   /* 1 Å = 0,62 đơn vị cảnh */
    const sph=G.sphere(1,26,18),cyl=G.cylinder(1,1,12,false);
    const AM={};for(const e in AT)AM[e]={color:AT[e].c,rough:e==="Cu"?.3:.42,metal:e==="Cu"?.75:0,coat:.35};
    const BM={color:"#CBD5E1",rough:.5};
    function bond(par,a,b,order){const d=V3.sub(b,a),L=V3.len(d),u=V3.norm(d);const side=V3.norm(V3.cross(u,Math.abs(u[1])<.9?[0,1,0]:[1,0,0]));
      for(let k=0;k<order;k++){const off=V3.scale(side,(k-(order-1)/2)*.11);const n=par.add(R.mesh(cyl,BM));n.pos=V3.add(a,off);n.quat=Q.toward(d);n.scl=[.045,L,.045]}}
    function molecule(par,k,scale,bk){bk=bk||1;const s=SUB[k],g=par.add(new G.Node());const P=s.at.map(a=>[a[1]*SC*scale,a[2]*SC*scale,a[3]*SC*scale]);
      s.at.forEach((a,i)=>{const n=g.add(R.mesh(sph,AM[a[0]]));n.pos=P[i];const r=AT[a[0]].r*scale*bk;n.scl=[r,r,r]});for(const [i,j,o] of s.b)bond(g,P[i],P[j],o);return{g,P}}
    /* ---------- bình chứa ---------- */
    const BOX=[2.4,1.5,1.5];
    const box=root.add(R.mesh(G.box(BOX[0]*2,BOX[1]*2,BOX[2]*2,.06,4),{type:"glass",color:"#DCEBFF",alpha:.12,rough:.05,order:8}));
    let grp=null,parts=[];
    function build(){if(grp)root.remove(grp);grp=root.add(new G.Node());parts=[];const s=SUB[S.k];
      if(s.the==="ran"){const SS=.3;const a=S.k==="Cu"?3.61*SS:5.64*SS/2;const n=S.k==="Cu"?3:5;
        for(let i=0;i<n;i++)for(let j=0;j<n;j++)for(let l=0;l<n;l++){const c=[(i-(n-1)/2)*a,(j-(n-1)/2)*a,(l-(n-1)/2)*a];
          if(S.k==="Cu"){for(const f of [[0,0,0],[.5,.5,0],[.5,0,.5],[0,.5,.5]]){const p=V3.add(c,V3.scale(f,a));if(Math.max(Math.abs(p[0]),Math.abs(p[1]),Math.abs(p[2]))>a*1.6)continue;const m=grp.add(R.mesh(sph,AM.Cu));m.pos=p;const r=1.28*SS;m.scl=[r,r,r];parts.push({n:m,p0:p,ph:Math.random()*6})}}
          else{const e=(i+j+l)%2?"Na":"Cl";const m=grp.add(R.mesh(sph,AM[e]));m.pos=c;const r=(e==="Na"?1.02:1.81)*SS;m.scl=[r,r,r];parts.push({n:m,p0:c,ph:Math.random()*6})}}}
      else{const N=s.the==="long"?34:10;for(let i=0;i<N;i++){const {g}=molecule(grp,S.k,s.the==="long"?.62:.55);const p=[(Math.random()*2-1)*(BOX[0]-.4),s.the==="long"?-BOX[1]+.35+Math.random()*1.5:(Math.random()*2-1)*(BOX[1]-.4),(Math.random()*2-1)*(BOX[2]-.4)];
        const sp=s.the==="long"?.35:1.3;parts.push({n:g,p,v:[(Math.random()-.5)*sp,(Math.random()-.5)*sp,(Math.random()-.5)*sp],q:[Math.random()*6,Math.random()*6,Math.random()*6],w:[(Math.random()-.5)*2,(Math.random()-.5)*2,(Math.random()-.5)*2]})}}
      buildOne()}
    /* ---------- một hạt phóng to ---------- */
    let one=null,oneP=[];const OX=12;
    function buildOne(){if(one)root.remove(one);one=root.add(new G.Node());one.pos=[OX,0,0];const s=SUB[S.k];
      if(s.at){const m=molecule(one,S.k,1.9,.62);oneP=m.P}else if(S.k==="Cu"){const m=one.add(R.mesh(sph,AM.Cu));const r=1.28*SC*1.2;m.scl=[r,r,r];oneP=[[0,0,0]]}
      else{const a=2.82*SC*1.2;oneP=[[-a/2,0,0],[a/2,0,0]];[["Na",1.02],["Cl",1.81]].forEach(([e,rr],i)=>{const m=one.add(R.mesh(sph,AM[e]));m.pos=oneP[i];const r=rr*SC*.75;m.scl=[r,r,r]})}}
    build();
    /* nhãn nguyên tử ở chế độ một hạt */
    const ang=()=>K.simT*.35;const rotY=p=>{const a=ang(),c=Math.cos(a),s=Math.sin(a);return[OX+p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c]};
    const LBL=[];for(let i=0;i<5;i++)LBL.push(K.label("",()=>{const s=SUB[S.k];const L=s.at?s.at:S.k==="Cu"?[["Cu"]]:[["Na"],["Cl"]];if(i>=L.length)return[-99,-99,-99];return rotY(oneP[i]||[0,0,0])},{view:"pt",dir:["n","s","e","w","ne"][i],len:34}));
    const lblBox=K.label("Bình chứa mẫu chất",[BOX[0],BOX[1],BOX[2]],{view:"mau",dir:"ne",len:20});
    K.onFrame(dt=>{const v=K.view;const s=SUB[S.k];grp.visible=v==="mau";box.visible=v==="mau"&&s.the!=="ran";one.visible=v==="pt";one.quat=Q.euler(0,ang(),0);
      if(s.the==="ran"){for(const p of parts){const j=.03;p.n.pos=[p.p0[0]+Math.sin(K.simT*9+p.ph)*j,p.p0[1]+Math.sin(K.simT*11+p.ph*2)*j,p.p0[2]+Math.sin(K.simT*10+p.ph*3)*j]}}
      else for(const p of parts){for(let i=0;i<3;i++){p.p[i]+=p.v[i]*dt;const lim=BOX[i]-.35;if(p.p[i]>lim){p.p[i]=lim;p.v[i]*=-1}if(p.p[i]<-lim){p.p[i]=-lim;p.v[i]*=-1}}
        if(s.the==="long"){if(p.p[1]>-BOX[1]+1.9){p.p[1]=-BOX[1]+1.9;p.v[1]=-Math.abs(p.v[1])}p.v=p.v.map(x=>x+(Math.random()-.5)*dt*.8)}
        for(let i=0;i<3;i++)p.q[i]+=p.w[i]*dt;p.n.pos=p.p.slice();p.n.quat=Q.euler(p.q[0],p.q[1],p.q[2])}
      const L=s.at?s.at:S.k==="Cu"?[["Cu"]]:[["Na"],["Cl"]];LBL.forEach((l,i)=>{if(i<L.length){const e=L[i][0];l.set(s.at?e:S.k==="Cu"?"Nguyên tử Cu":e==="Na"?"Ion Na⁺":"Ion Cl⁻")}});
      lblBox.set(s.the==="ran"?"Chất rắn: hạt xếp đều đặn":s.the==="long"?"Chất lỏng: phân tử ở gần nhau":"Chất khí: phân tử ở xa nhau")});
    function done1(k){const s=SUB[k];if(S.cls[k]&&(S.km[k]||!s.at)&&!S["r"+k]){S["r"+k]=1;api.record({chat:`${s.ten} (${s.ct})`,loai:s.loai==="don"?"Đơn chất":"Hợp chất",hat:s.hat,m:s.at?`${massExpr(k)} = ${fmt(s.m,s.m%1?1:0)} amu`:`${k==="Cu"?"KL nguyên tử Cu":"theo công thức NaCl: 23 + 35,5"} = ${fmt(s.m,s.m%1?1:0)} amu`})}}
    function mOpts(k){const m=SUB[k].m;const o=ATS(k);const a=Object.keys(o).reduce((s,e)=>s+AT[e].m,0),b=a*Math.max(...Object.values(o));const set=[m];for(const w of [a,b,m+2,m+4])if(!set.includes(w)&&set.length<3)set.push(w);return set.sort((x,y)=>x-y)}
    K.dockFn(()=>{const k=S.k,s=SUB[k];const it=[{grid:KEYS.map(x=>({k:"sub",v:x,label:SUB[x].ct,icon:"",on:x===k}))},
      {seg:[{k:"cls",v:"don",label:"Đơn chất",icon:"",on:S.cls[k]&&s.loai==="don"},{k:"cls",v:"hop",label:"Hợp chất",icon:"",on:S.cls[k]&&s.loai==="hop"}],label:"Phân loại"}];
      if(s.at)it.push({grid:mOpts(k).map(m=>({k:"m",v:String(m),label:`${fmt(m,m%1?1:0)} amu`,icon:"",on:S.km[k]&&m===s.m}))});return it});
    K.onDock((k,v)=>{const s=SUB[S.k];
      if(k==="sub"){S.k=v;build()}
      else if(k==="cls"){if(v===s.loai){S.cls[S.k]=1;done1(S.k)}else api.toast(s.loai==="don"?`${s.ct} chỉ do một nguyên tố tạo nên.`:`${s.ct} do ${Object.keys(ATS(S.k)).length} nguyên tố tạo nên.`,"warn",2200)}
      else if(k==="m"){if(+v===s.m){S.km[S.k]=1;done1(S.k)}else api.toast(`Đếm lại: ${massExpr(S.k)}.`,"warn",2400)}refresh()});
    K.infoFn(()=>{const k=S.k,s=SUB[k],o=ATS(k);return `<div><b>${s.ten}</b> · ${s.ct}</div><div>Hạt hợp thành: ${s.hat}</div><div>${Object.keys(o).map(e=>`<i style="background:${AT[e].c}"></i>${e}: ${o[e]}`).join(" &nbsp; ")}</div>`+
      (S.km[k]||(!s.at&&S.cls[k])?`<div style="margin-top:4px"><b>${s.at?"Khối lượng phân tử":"Khối lượng"}:</b> ${s.at?massExpr(k)+" = ":""}${fmt(s.m,s.m%1?1:0)} amu</div>`:"")+(s.note?`<small>${s.note}</small>`:`<small>Khối lượng nguyên tử: ${Object.keys(o).map(e=>`${e} = ${fmt(AT[e].m,AT[e].m%1?1:0)}`).join(", ")} (amu).</small>`)});
    K.timeLabel(()=>`${SUB[S.k].ten} (${SUB[S.k].ct})`);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const k of KEYS){K._dockH("sub",k);K._dockH("cls",SUB[k].loai);if(SUB[k].at)K._dockH("m",String(SUB[k].m))}}};
    return K.mount(st)}
});
})();
