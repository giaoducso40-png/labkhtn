/* K9-H-03 · Giới thiệu hợp chất hữu cơ: mô hình phân tử (SGK KHTN 9 – Kết nối tri thức, Bài 22) · mô hình 3D
   Sáu phân tử dựng theo độ dài và góc liên kết thật: methane, ethane, ethylene, acetylene, ethylic alcohol, acetic acid.
   Hai kiểu mô hình: quả cầu – que nối (rỗng) và mô hình đặc (bán kính van der Waals). Công thức phân tử, công thức cấu tạo, phân loại. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const EL={H:{c:"#F4F6F8",r:.2,vdw:1.2},C:{c:"#3A3F47",r:.32,vdw:1.7},O:{c:"#E53935",r:.3,vdw:1.52}};
const TH=(c,ax,phis,len)=>{/* ba nguyên tử H quanh trục ax của nguyên tử c (dạng tứ diện) */const sx=Math.sign(ax);return phis.map(p=>["H",c[0]+sx*.363*len/1.09,c[1]+1.028*len/1.09*Math.cos(p*Math.PI/180),c[2]+1.028*len/1.09*Math.sin(p*Math.PI/180)])};
const t=1.09/Math.sqrt(3);
const MOL={
  ch4:{ten:"Methane",f:"CH₄",loai:"Hydrocarbon (alkane)",ct:"Mỗi nguyên tử C tạo 4 liên kết đơn với 4 nguyên tử H; phân tử hình tứ diện đều, góc H–C–H ≈ 109,5°.",
    ctct:"    H\n    |\nH – C – H\n    |\n    H",thu:"CH₄",a:[["C",0,0,0],["H",t,t,t],["H",t,-t,-t],["H",-t,t,-t],["H",-t,-t,t]],b:[[0,1],[0,2],[0,3],[0,4]]},
  c2h6:{ten:"Ethane",f:"C₂H₆",loai:"Hydrocarbon (alkane)",ct:"Hai nguyên tử C liên kết đơn với nhau (C–C dài 1,54 Å); mỗi C còn 3 liên kết với H.",ctct:"    H   H\n    |   |\nH – C – C – H\n    |   |\n    H   H",thu:"CH₃–CH₃",
    a:[["C",.77,0,0],["C",-.77,0,0]].concat(TH([.77,0,0],1,[0,120,240],1.09),TH([-.77,0,0],-1,[60,180,300],1.09)),b:[[0,1],[0,2],[0,3],[0,4],[1,5],[1,6],[1,7]]},
  c2h4:{ten:"Ethylene",f:"C₂H₄",loai:"Hydrocarbon (alkene)",ct:"Hai nguyên tử C liên kết đôi (C=C); phân tử phẳng, góc liên kết ≈ 120°. Liên kết đôi kém bền, dễ tham gia phản ứng cộng.",ctct:"H       H\n  \\   /\n   C = C\n  /   \\\nH       H",thu:"CH₂=CH₂",
    a:[["C",.665,0,0],["C",-.665,0,0],["H",1.23,.92,0],["H",1.23,-.92,0],["H",-1.23,.92,0],["H",-1.23,-.92,0]],b:[[0,1,2],[0,2],[0,3],[1,4],[1,5]]},
  c2h2:{ten:"Acetylene",f:"C₂H₂",loai:"Hydrocarbon (alkyne)",ct:"Hai nguyên tử C liên kết ba (C≡C); phân tử thẳng, góc liên kết 180°.",ctct:"H – C ≡ C – H",thu:"CH≡CH",
    a:[["C",.6,0,0],["C",-.6,0,0],["H",1.66,0,0],["H",-1.66,0,0]],b:[[0,1,3],[0,2],[1,3]]},
  etoh:{ten:"Ethylic alcohol (ethanol)",f:"C₂H₆O",loai:"Dẫn xuất của hydrocarbon (có nhóm –OH)",ct:"Một nguyên tử H của ethane được thay bằng nhóm –OH; nhóm –OH làm cho ethanol có tính chất đặc trưng.",ctct:"    H   H\n    |   |\nH – C – C – O – H\n    |   |\n    H   H",thu:"CH₃–CH₂–OH",
    a:(()=>{const c1=[.77,0,0],c2=[-.77,0,0];const o=[-.77-.476,1.348*Math.cos(Math.PI/3),1.348*Math.sin(Math.PI/3)];return[["C",...c1],["C",...c2],["O",...o],["H",o[0]-.75,o[1]+.55,o[2]+.15]].concat(TH(c1,1,[0,120,240],1.09),TH(c2,-1,[180,300],1.09))})(),
    b:[[0,1],[1,2],[2,3],[0,4],[0,5],[0,6],[1,7],[1,8]]},
  acoh:{ten:"Acetic acid",f:"C₂H₄O₂",loai:"Dẫn xuất của hydrocarbon (có nhóm –COOH)",ct:"Phân tử có nhóm –COOH gồm một liên kết C=O và một nhóm –OH; nhóm –COOH làm cho acetic acid có tính acid.",ctct:"    H     O\n    |    //\nH – C – C\n    |    \\\n    H     O – H",thu:"CH₃–COOH",
    a:(()=>{const c1=[-1.5,0,0];return[["C",0,0,0],["C",...c1],["O",.605,1.048,0],["O",.67,-1.16,0],["H",1.64,-1.16,0]].concat(TH(c1,-1,[0,120,240],1.09))})(),b:[[0,1],[0,2,2],[0,3],[3,4],[1,5],[1,6],[1,7]]}};

const SPEC={
  predict:[{id:"p1",q:"Trong các hợp chất hữu cơ, nguyên tử carbon luôn có hóa trị:",opts:[["4","IV"],["2","II"],["1","I"]],ans:"4",res:"Kết quả: mỗi nguyên tử C tạo đủ 4 liên kết (tính cả liên kết đôi, liên kết ba)."},
    {id:"p2",q:"Phân tử nào có liên kết đôi giữa hai nguyên tử carbon?",opts:[["c2h4","Ethylene C₂H₄"],["c2h6","Ethane C₂H₆"],["ch4","Methane CH₄"]],ans:"c2h4",res:"Kết quả: ethylene có liên kết đôi C=C."}],
  taskLead:"Chọn phân tử ở khay; kéo để xoay mô hình; đổi kiểu mô hình để so sánh.",
  tasks:[{html:"Xem đủ 6 phân tử.",done:()=>Object.keys(MOL).every(k=>S.seen[k])},{html:"Xem ít nhất 2 phân tử ở dạng mô hình đặc.",done:()=>Object.keys(S.dac).length>=2}],
  obs:[{id:"a",q:"Đếm số liên kết quanh mỗi nguyên tử C trong ethylene (liên kết đôi tính là 2):",opts:[["4","4"],["3","3"],["2","2"]],ans:"4",why:"Mỗi C: 1 liên kết đôi (2) + 2 liên kết đơn với H = 4."},
    {id:"b",q:"Hợp chất nào là dẫn xuất của hydrocarbon?",opts:[["etoh","Ethylic alcohol C₂H₅OH"],["c2h2","Acetylene C₂H₂"],["c2h6","Ethane C₂H₆"]],ans:"etoh",why:"Ngoài C, H còn có O; hydrocarbon chỉ chứa C và H."}],
  concl:{html:`<ul class="tlist"><li>Hợp chất hữu cơ là hợp chất của carbon (trừ CO, CO₂, H₂CO₃, muối carbonate, carbide, cyanide…). Hydrocarbon chỉ chứa C và H; dẫn xuất của hydrocarbon còn chứa nguyên tố khác như O, N, Cl…</li>
    <li>Trong phân tử hợp chất hữu cơ, carbon có hóa trị IV, hydrogen hóa trị I, oxygen hóa trị II. Các nguyên tử carbon có thể liên kết trực tiếp với nhau tạo mạch carbon.</li>
    <li>Công thức cấu tạo cho biết thành phần phân tử và trật tự liên kết giữa các nguyên tử.</li></ul>`,
    quiz:[{id:"q1",q:"Chất nào là hợp chất hữu cơ?",opts:[["a","CH₃COOH"],["b","CO₂"],["c","CaCO₃"]],ans:"a",why:{b:"CO₂ là hợp chất vô cơ.",c:"Muối carbonate là hợp chất vô cơ."}},
      {id:"q2",q:"Công thức cấu tạo thu gọn của ethylic alcohol là:",opts:[["a","CH₃–CH₂–OH"],["b","CH₃–O–CH₃"],["c","CH₃–COOH"]],ans:"a",why:{b:"Đó là dimethyl ether.",c:"Đó là acetic acid."}}],
    done:`<h2>Hoàn thành: Mô hình phân tử hợp chất hữu cơ</h2><p class="muted">C hóa trị IV; công thức cấu tạo cho biết trật tự liên kết.</p>`},
  gv:["Cho học sinh tự viết công thức cấu tạo đầy đủ trước khi xem.","So sánh hình dạng: CH₄ tứ diện, C₂H₄ phẳng, C₂H₂ thẳng."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 22)</p><ul class="tlist"><li>Nêu được khái niệm hợp chất hữu cơ, hydrocarbon và dẫn xuất của hydrocarbon; công thức cấu tạo; đặc điểm cấu tạo phân tử hợp chất hữu cơ.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 22 Giới thiệu về hợp chất hữu cơ.</li>
<li>Độ dài liên kết C–H 1,09 Å, C–C 1,54 Å, C=C 1,33 Å, C≡C 1,20 Å, C=O 1,21 Å; bán kính van der Waals H 1,20 Å, C 1,70 Å, O 1,52 Å: <a href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/07%3A_Chemical_Bonding_and_Molecular_Geometry/7.05%3A_Strengths_of_Ionic_and_Covalent_Bonds" target="_blank" rel="noopener">OpenStax Chemistry 2e, mục 7.5</a>; Bondi (1964).</li></ul>`;

let S;
LabKHTN.register("K9-H-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"ten",t:"Chất"},{k:"ct",t:"Công thức"},{k:"loai",t:"Phân loại"}],empty:"Chọn phân tử, thông tin tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D phân tử hợp chất hữu cơ",legend:{w:280},views:{mol:{t:[0,0,0],yaw:.4,pitch:.3,rad:2.2,label:"Phân tử",icon:IC.cell}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={m:"ch4",dac:{},seen:{},mode:"que",recs:0,spin:true};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const holder=root.add(new G.Node());const cyl=G.cylinder(.06,1,14,false);const sph={};for(const e in EL)sph[e]=G.sphere(1,32,24);
    function build(){holder.children.slice().forEach(n=>holder.remove(n));const M=MOL[S.m];const dac=S.mode==="dac";
      const cen=M.a.reduce((s,a)=>[s[0]+a[1],s[1]+a[2],s[2]+a[3]],[0,0,0]).map(v=>v/M.a.length);
      const P=M.a.map(a=>[a[1]-cen[0],a[2]-cen[1],a[3]-cen[2]]);
      M.a.forEach((a,i)=>{const r=dac?EL[a[0]].vdw*.42:EL[a[0]].r;const n=holder.add(R.mesh(sph[a[0]],{color:EL[a[0]].c,rough:.3,coat:.55}));n.pos=P[i];n.scl=[r,r,r]});
      if(!dac)M.b.forEach(b=>{const ord=b[2]||1;const A=P[b[0]],Bp=P[b[1]];const d=V3.sub(Bp,A),L=V3.len(d);const side=V3.norm(Math.abs(d[2])<.9*L?V3.cross(d,[0,0,1]):V3.cross(d,[0,1,0]));
        for(let k=0;k<ord;k++){const off=(k-(ord-1)/2)*.14;const n=holder.add(R.mesh(cyl,{color:"#C9CED6",rough:.4}));n.pos=V3.add(A,V3.scale(side,off));n.quat=G.Q.toward(d);n.scl=[1,L,1]}})}
    build();
    const show=k=>{S.m=k;S.seen[k]=1;if(S.mode==="dac")S.dac[k]=1;build();const M=MOL[k];if(!S.rec?.[k]){S.rec=S.rec||{};S.rec[k]=1;S.recs++;api.record({lan:String(S.recs),ten:M.ten,ct:`${M.f}; ${M.thu}`,loai:M.loai})}refresh()};
    K.onFrame(dt=>{if(S.spin)holder.quat=G.Q.euler(0,K.simT*.4,0)});
    K.dockFn(()=>[{grid:Object.keys(MOL).map(k=>({k:"m",v:k,label:`${MOL[k].ten.split(" (")[0]} ${MOL[k].f}`,icon:IC.cell,on:S.m===k}))},"hr",
      {seg:[{k:"mode",v:"que",label:"Quả cầu – que nối",icon:"",on:S.mode==="que"},{k:"mode",v:"dac",label:"Mô hình đặc",icon:"",on:S.mode==="dac"}],label:"Kiểu mô hình"},{k:"spin",label:S.spin?"Dừng xoay":"Tự xoay",icon:IC.swap,on:S.spin}]);
    K.onDock((k,v)=>{if(k==="m")show(v);else if(k==="mode"){S.mode=v;if(v==="dac")S.dac[S.m]=1;build();refresh()}else if(k==="spin"){S.spin=!S.spin;refresh()}});
    K.infoFn(()=>{const M=MOL[S.m];const cnt={};M.a.forEach(a=>cnt[a[0]]=(cnt[a[0]]||0)+1);
      return `<div><b>${M.ten}</b> · ${M.f}</div><div>${M.loai}</div><pre style="font:600 13px/1.25 'Courier New',monospace;margin:6px 0;white-space:pre">${M.ctct}</pre><div>Thu gọn: ${M.thu}</div><small>${M.ct}</small><div style="margin-top:4px">${Object.keys(cnt).map(e=>`<i style="background:${EL[e].c}"></i>${e}: ${cnt[e]}`).join(" &nbsp; ")}</div>`});
    K.timeLabel(()=>`${MOL[S.m].ten} · ${S.mode==="dac"?"mô hình đặc":"quả cầu – que nối"}`);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();show("ch4");
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){Object.keys(MOL).forEach(show);S.mode="dac";show("etoh");show("acoh");refresh()}};
    return K.mount(st)}
});
})();
