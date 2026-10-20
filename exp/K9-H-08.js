/* K9-H-08 · Đá vôi, vôi sống; công nghiệp silicate (SGK KHTN 9 – Kết nối tri thức, Bài 34 và bài về silicate) · 3D
   1. Nhiệt phân đá vôi: ống nghiệm chứa 5,00 g bột CaCO₃ đun mạnh, khí dẫn sang ống nước vôi trong; cân khối lượng chất rắn còn lại (CaO): 5,00 g → 2,80 g.
   2. Tôi vôi: cho vôi sống CaO vào nước: tỏa nhiều nhiệt, vôi rã thành vôi tôi Ca(OH)₂; dung dịch làm phenolphthalein hóa hồng.
   3. Công nghiệp silicate: xi măng, thủy tinh, gốm sứ: nguyên liệu, các công đoạn chính. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const X1=-2.4,X2=0,X3=2.6;
const M0=5.00,MCaO=M0*56.08/100.09;   /* khối lượng mol CaCO₃ 100,09; CaO 56,08 */
const IND={
  xm:{ten:"Xi măng",nl:"Đá vôi, đất sét (và một ít quặng sắt)",cd:["Nghiền nhỏ, trộn nguyên liệu với nước thành bùn (hoặc trộn khô)","Nung trong lò quay ở khoảng 1 400–1 500 °C thành clinker","Nghiền clinker với một ít thạch cao (và phụ gia) thành bột mịn: xi măng"],ud:"Vật liệu xây dựng: bê tông, vữa."},
  tt:{ten:"Thủy tinh",nl:"Cát thạch anh (SiO₂), đá vôi (CaCO₃), soda (Na₂CO₃)",cd:["Trộn nguyên liệu theo tỉ lệ thích hợp","Nấu chảy trong lò ở khoảng 1 400–1 500 °C","Làm nguội từ từ, đồng thời ép, thổi thành chai, lọ, tấm kính"],ud:"Cửa kính, chai lọ, dụng cụ thí nghiệm."},
  gs:{ten:"Gốm sứ",nl:"Đất sét, cao lanh, thạch anh, fenspat",cd:["Nhào nguyên liệu với nước thành khối dẻo, tạo hình","Sấy khô, phủ men (với đồ sứ)","Nung trong lò ở nhiệt độ cao (đồ sứ khoảng 1 200–1 400 °C)"],ud:"Gạch ngói, bát đĩa, sứ vệ sinh, sứ cách điện."}};

const SPEC={
  predict:[{id:"p1",q:"Nung 5,00 g đá vôi (CaCO₃) tới khi phản ứng hoàn toàn, khối lượng chất rắn còn lại:",opts:[["giam","Giảm còn khoảng 2,8 g"],["kd","Vẫn là 5,00 g"],["tang","Tăng lên"]],ans:"giam",res:"Kết quả: khí CO₂ thoát ra, chỉ còn CaO: 5,00 × 56/100 ≈ 2,80 g."},
    {id:"p2",q:"Cho vôi sống vào nước, em thấy:",opts:[["nong","Nước nóng lên, có hơi bốc lên, vôi rã ra"],["lanh","Nước lạnh đi"],["khong","Không có hiện tượng"]],ans:"nong",res:"Kết quả: phản ứng tôi vôi tỏa rất nhiều nhiệt."}],
  taskLead:"Chọn phần ở khay rồi làm theo các nút thao tác.",
  tasks:[{html:"<b>Nhiệt phân:</b> đun ống đá vôi tới khi phản ứng xong, đọc khối lượng chất rắn còn lại.",done:()=>S.n.rec},
    {html:"<b>Tôi vôi:</b> cho vôi sống vào nước, rồi nhỏ phenolphthalein.",done:()=>S.t.cao&&S.t.pp},
    {html:"<b>Silicate:</b> xem quy trình sản xuất xi măng, thủy tinh, gốm sứ.",done:()=>Object.keys(S.s).length>=3}],
  obs:[{id:"a",q:"Nước vôi trong ở ống bên cạnh bị vẩn đục khi đun đá vôi, chứng tỏ:",opts:[["co2","Có khí CO₂ thoát ra"],["o2","Có khí O₂"],["h2o","Có hơi nước"]],ans:"co2",why:"CaCO₃ → CaO + CO₂↑ (t°); CO₂ làm đục nước vôi trong."},
    {id:"b",q:"Khối lượng giảm 2,20 g khi nung 5,00 g CaCO₃ là khối lượng của:",opts:[["co2","Khí CO₂ thoát ra"],["cao","CaO"],["nuoc","Nước"]],ans:"co2",why:"Theo định luật bảo toàn khối lượng: m(CaCO₃) = m(CaO) + m(CO₂)."}],
  concl:{html:`<div class="eq">CaCO₃ → CaO + CO₂↑ (t° ≈ 900 °C)<br>CaO + H₂O → Ca(OH)₂ (tỏa nhiệt)<br>CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O</div><ul class="tlist">
    <li>Đá vôi (thành phần chính CaCO₃) dùng làm vật liệu xây dựng, sản xuất vôi sống, xi măng, thủy tinh. Vôi sống CaO dùng khử chua đất, xử lí nước thải, sát trùng, xây dựng.</li>
    <li><b>Công nghiệp silicate</b> sản xuất đồ gốm, thủy tinh, xi măng từ các hợp chất tự nhiên của silicon (cát, đất sét, cao lanh…).</li></ul>`,
    quiz:[{id:"q1",q:"Nguyên liệu chính để sản xuất thủy tinh thường là:",opts:[["a","Cát, đá vôi, soda"],["b","Đất sét, thạch cao"],["c","Quặng sắt, than"]],ans:"a",why:{b:"Đó là nguyên liệu của xi măng, gốm.",c:"Đó là nguyên liệu luyện gang."}},
      {id:"q2",q:"Vì sao khi tôi vôi phải cẩn thận?",opts:[["a","Phản ứng tỏa nhiều nhiệt, vôi có tính base mạnh, gây bỏng"],["b","Phản ứng sinh khí độc"],["c","Vôi dễ nổ"]],ans:"a",why:{b:"Không sinh khí độc.",c:"Không gây nổ."}}],
    done:`<h2>Hoàn thành: Đá vôi, vôi sống và công nghiệp silicate</h2><p class="muted">Nhiệt phân đá vôi; tôi vôi; xi măng, thủy tinh, gốm sứ.</p>`},
  gv:["Ở trạm nhiệt phân, cho học sinh tính trước khối lượng CaO thu được từ 5,00 g CaCO₃.","Liên hệ: lò vôi thủ công gây ô nhiễm bụi, khí CO₂; khai thác đá vôi ảnh hưởng cảnh quan (vịnh Hạ Long, núi đá vôi).","An toàn: khi kết thúc nhiệt phân, tháo ống dẫn khí ra khỏi nước vôi trong trước rồi mới tắt đèn để tránh nước bị hút ngược."]};
const GVH=`<p><b>Yêu cầu cần đạt</b></p><ul class="tlist"><li>Nêu được thành phần chính của đá vôi, các ứng dụng của đá vôi; tiến hành (hoặc quan sát) thí nghiệm nhiệt phân đá vôi, tôi vôi.</li><li>Nêu được sơ lược về công nghiệp silicate: nguyên liệu, công đoạn chính sản xuất đồ gốm, thủy tinh, xi măng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), phần Khai thác tài nguyên từ vỏ Trái Đất (đá vôi, công nghiệp silicate).</li>
<li>Khối lượng mol CaCO₃ 100,09 g/mol, CaO 56,08 g/mol (IUPAC). Nhiệt độ nung clinker khoảng 1 400–1 500 °C: <a href="https://www.britannica.com/technology/cement-building-material" target="_blank" rel="noopener">Britannica – Cement</a>; thủy tinh soda-lime nấu ở khoảng 1 500 °C: <a href="https://www.britannica.com/technology/glass" target="_blank" rel="noopener">Britannica – Glass</a>.</li>
<li>Đèn trong phòng thí nghiệm không đạt 900 °C; thí nghiệm thật dùng đèn khí hoặc nung mẩu đá vôi nhỏ trực tiếp trên ngọn lửa; mô phỏng tua nhanh thời gian.</li></ul>`;

let S;
LabKHTN.register("K9-H-08",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D nhiệt phân đá vôi, tôi vôi và sản phẩm công nghiệp silicate",legend:{w:270},bench:[9,2.4],seed:34,
      views:{nung:{t:[X1+.35,.62,0],yaw:0,pitch:.18,rad:1.0,label:"Nhiệt phân đá vôi",icon:IC.fire},toi:{t:[X2,.35,0],yaw:0,pitch:.3,rad:.7,label:"Tôi vôi",icon:IC.beaker},sil:{t:[X3,.3,0],yaw:0,pitch:.22,rad:.85,label:"Công nghiệp silicate",icon:IC.grid}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={n:{on:false,f:0,rec:false},t:{cao:false,pp:false},s:{},sel:null,recs:0};
    const rec=(tn,ht,kl)=>{S.recs++;api.record({lan:String(S.recs),tn,ht,kl})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const BN=BL.create(K);const glassM={type:"glass",color:"#EAF6FF",alpha:.5};
    /* ================= 1. nhiệt phân ================= */
    const burn=BN.burner(X1,0,1);
    const AX=[Math.cos(-.14),Math.sin(-.14)];const BOT=[X1-.02,.52];const tN=root.add(new G.Node());tN.pos=[BOT[0]+AX[0]*.35,BOT[1]+AX[1]*.35,0];tN.quat=G.Q.euler(0,0,-Math.PI/2-.14);tN.add(K3.testTube(R,.1,.7)).pos=[0,-.35,0];
    const MOUTH=[BOT[0]+AX[0]*.7,BOT[1]+AX[1]*.7];
    /* giá kẹp: cọc đứng và tay kẹp ngang giữ ống gần miệng */
    root.add(R.mesh(G.box(.3,.03,.3,.01,2),{color:"#4B5058",metal:.6})).pos=[X1+.48,.015,-.25];root.add(R.mesh(G.cylinder(.015,.85,10),{color:"#4B5058",metal:.8})).pos=[X1+.48,0,-.25];
    root.add(R.mesh(G.box(.03,.03,.26,.01,1),{color:"#4B5058",metal:.8})).pos=[X1+.48,.47,-.12];root.add(R.mesh(G.lathe([[.11,-.025],[.125,-.02],[.125,.02],[.11,.025]],24),{color:"#6B4F2A",rough:.6})).quat=G.Q.euler(0,0,Math.PI/2-.14),root.children[root.children.length-1].pos=[BOT[0]+AX[0]*.52,BOT[1]+AX[1]*.52,0];
    const powder=tN.add(R.mesh(G.fromSDF((x,y,z)=>Math.max(Math.hypot(x,z)-.085,Math.abs(y+.3)-.035),[-.1,-.34,-.1],[.1,-.26,.1],[18,10,18]),{color:"#EDE8DC",rough:.9}));
    root.add(R.mesh(G.tube(G.spline([[MOUTH[0]-.05,MOUTH[1],0],[MOUTH[0]+.12,MOUTH[1]+.05,0],[X1+1.02,1.25,0],[X1+1.06,1.15,0],[X1+1.06,.14,0]],8),.012,8),glassM));
    BN.rack(X1+1.06,0,1,.2);const lime=BN.vessel({id:"lw",kind:"tube",x:X1+1.06,z:0,sol:{col:"#EEF4FA",a:.38,level:.5}});
    /* cân điện tử nhỏ hiển thị khối lượng chất rắn (đặt ống lên cân khi nguội) */
    const bal=root.add(new G.Node());bal.pos=[X1-.55,0,.15];bal.add(R.mesh(G.box(.3,.06,.26,.02,3),{color:"#E5E7EB",rough:.5})).pos=[0,.03,0];
    const lc=document.createElement("canvas");lc.width=256;lc.height=96;const lt=R.tex2D(lc);let lastM="";
    const lcdM={type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:lt}};
    const disp=bal.add(R.mesh(G.plane(.18,.06),lcdM));disp.quat=G.Q.euler(Math.PI/2*.6,0,0);disp.pos=[0,.07,.13];
    /* ================= 2. tôi vôi ================= */
    const bk=BN.vessel({id:"b1",kind:"beaker",x:X2,z:0,r:.24,h:.42,sol:{col:"#E6F1FB",a:.32,level:.22}});
    /* ================= 3. silicate: sản phẩm ================= */
    const prod={};
    {const n=root.add(new G.Node());n.pos=[X3-.6,0,0];n.add(R.mesh(G.box(.3,.38,.16,.06,4),{color:"#C9BFA8",rough:.85,hooks:KIT.TISSUE,uniforms:{uBump:.05,uNF:30}})).pos=[0,.19,0];n.add(R.mesh(G.box(.2,.08,.005,.01,1),{color:"#B91C1C",rough:.6})).pos=[0,.24,.081];prod.xm=n}
    {const n=root.add(new G.Node());n.pos=[X3,0,0];n.add(R.mesh(G.lathe([[0,0],[.09,0],[.1,.02],[.1,.26],[.06,.33],[.035,.38],[.035,.46],[.04,.47]],40),{type:"glass",color:"#7FC79A",alpha:.6}));prod.tt=n}
    {const n=root.add(new G.Node());n.pos=[X3+.6,0,0];n.add(R.mesh(G.lathe([[0,0],[.07,0],[.08,.015],[.17,.1],[.2,.16],[.19,.165],[.16,.11],[.07,.03],[0,.03]],48),{color:"#F4F6F8",rough:.18,coat:.8,side:"double"}));
      n.add(R.mesh(G.lathe([[.185,.145],[.195,.15],[.19,.155]],48),{color:"#2E5AAC",rough:.3}));prod.gs=n}
    /* ================= nhãn ================= */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    lab("Bột đá vôi CaCO₃",[BOT[0]+AX[0]*.06,BOT[1]-.02,0],"nung",{dir:"w",len:50});lab("Ống dẫn khí",[X1+.9,1.08,0],"nung",{dir:"n",len:30});lab("Nước vôi trong",[X1+1.06,.45,0],"nung",{dir:"e",len:30});lab("Miệng ống hơi chúc xuống",[MOUTH[0],MOUTH[1]-.05,0],"nung",{dir:"s",len:40});lab("Cân",[X1-.55,.06,.15],"nung",{dir:"sw",len:30});
    lab("Cốc nước",[X2+.24,.3,0],"toi",{dir:"e",len:30});
    lab("Bao xi măng",[X3-.6,.36,0],"sil",{dir:"n",len:30});lab("Chai thủy tinh",[X3,.47,0],"sil",{dir:"n",len:30});lab("Bát sứ",[X3+.6,.17,0],"sil",{dir:"n",len:30});
    /* ================= cập nhật ================= */
    K.onFrame(dt=>{const N=S.n;burn.on=N.on;
      if(N.on&&dt>0&&N.f<1){N.f=Math.min(1,N.f+dt/10);if(N.f>.08&&Math.random()<dt*20)lime.fizz(14,.7);lime.data.cl=Math.min(1,(lime.data.cl||0)+dt*.12);
        powder.mat.color=H(C.mix("#EDE8DC","#FBFBF8",N.f));powder.scl=[1,1-.25*N.f,1];
        if(N.f>=1&&!N.rec){N.rec=true;lime.fizz(0);N.on=false;rec("Đun mạnh ống nghiệm chứa 5,00 g bột đá vôi",`nước vôi trong ở ống bên cạnh vẩn đục; để nguội cân chất rắn còn lại: ${fmt(MCaO,2)} g (giảm ${fmt(M0-MCaO,2)} g)`,"CaCO₃ → CaO + CO₂↑; khối lượng giảm là khối lượng CO₂ thoát ra");refresh()}}
      if(lime.data.cl&&!lime.data.clSet&&lime.data.cl>.3){lime.data.clSet=1;lime.precip("#FFFFFF",.7,6)}
      const m=M0-(M0-MCaO)*N.f;const s=fmt(m,2)+" g";if(s!==lastM){lastM=s;const g=lc.getContext("2d");g.fillStyle="#9DB59A";g.fillRect(0,0,256,96);g.fillStyle="#1C2A1C";g.font="700 58px 'Courier New',monospace";g.textAlign="center";g.fillText(s,128,70);lt.update(lc)}
      for(const k in prod){const hi=S.sel===k;prod[k].scl=hi?[1.12,1.12,1.12]:[1,1,1]}});
    /* ================= khay ================= */
    K.dockFn(()=>{const v=K.view;
      if(v==="nung")return[{k:"heat",label:S.n.on?"Tắt đèn":"Đun mạnh ống đá vôi",icon:IC.fire,on:S.n.on,dis:S.n.rec},{k:"rn",label:"Làm lại",icon:IC.reset}];
      if(v==="toi")return[{k:"cao",label:"Cho vôi sống CaO vào nước",icon:IC.plus,dis:S.t.cao},{k:"pp",label:"Nhỏ phenolphthalein",icon:IC.drop,dis:S.t.pp},{k:"rt",label:"Làm lại",icon:IC.reset}];
      return[{grid:Object.keys(IND).map(k=>({k:"ind",v:k,label:IND[k].ten,icon:S.s[k]?'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="3"><path d="M10 21l7 7 13-15"/></svg>':IC.grid,on:S.sel===k}))}]});
    K.onDock((k,v)=>{
      if(k==="heat"){S.n.on=!S.n.on;if(!api.time.playing&&S.n.on)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600)}
      else if(k==="rn"){S.n={on:false,f:0,rec:S.n.rec&&false};lime.reset();powder.scl=[1,1,1];powder.mat.color=H("#EDE8DC")}
      else if(k==="cao"){S.t.cao=true;const sd=BN.addSolid(bk,"lump",{col:"#F2EFE6",scale:1.1,rough:.9});BN.dropSolid(sd,()=>{sd.rate=1/12;bk.tempTgt=85;bk.tempK=.2;bk.steamOn=true;bk.cloud("#F5F5F0",.55);
          rec("Cho vài mẩu vôi sống vào cốc nước","vôi sống rã ra thành chất bột nhão màu trắng; nước nóng lên mạnh, có hơi nước bốc lên","CaO + H₂O → Ca(OH)₂: phản ứng tỏa nhiệt");refresh()})}
      else if(k==="pp"){if(!S.t.cao){api.toast("Cho vôi sống vào nước trước.","info",1800);return}S.t.pp=true;BN.dropInto(bk,"#F4F6F8",4,()=>{bk.setColor("#E5488F",.55,2);rec("Nhỏ phenolphthalein vào nước vôi","dung dịch chuyển màu hồng","Ca(OH)₂ là base");refresh()})}
      else if(k==="rt"){bk.reset();S.t={cao:false,pp:false}}
      else if(k==="ind"){S.sel=v;if(!S.s[v]){S.s[v]=1;const I=IND[v];rec(`Sản xuất ${I.ten.toLowerCase()}`,`Nguyên liệu: ${I.nl}`,I.cd.map((c,i)=>`(${i+1}) ${c}`).join("; "))}}
      refresh()});
    K.pickFn((x,y)=>{if(K.view!=="sil")return null;const r=R.ray(x,y);let best=null,bd=1e9;for(const k in prod){const p=prod[k].pos;const t=G.hit.box(r,[p[0]-.22,0,-.2],[p[0]+.22,.5,.2]);if(t!=null&&t<bd){bd=t;best=k}}return best?{k:best}:null});
    K.tapFn(k=>{if(k)K._dockH("ind",k.k)});
    K.infoFn(()=>{const v=K.view;if(v==="nung")return `<div><b>Nhiệt phân đá vôi</b></div><div>Khối lượng chất rắn: ${fmt(M0-(M0-MCaO)*S.n.f,2)} g</div><div>Mức phản ứng: ${fmt(S.n.f*100,0)}%</div><small>Tua nhanh thời gian; khối lượng tính theo phương trình CaCO₃ → CaO + CO₂.</small>`;
      if(v==="toi")return `<div><b>Tôi vôi</b></div><div>Nhiệt độ nước: ${fmt(bk.temp!=null?bk.temp:25,0)} °C</div><small>Cho vôi sống vào nước, rồi thử bằng phenolphthalein.</small>`;
      const I=S.sel?IND[S.sel]:null;return I?`<div><b>Sản xuất ${I.ten.toLowerCase()}</b></div><div>Nguyên liệu: ${I.nl}</div>${I.cd.map((c,i)=>`<div>${i+1}. ${c}</div>`).join("")}<small>Ứng dụng: ${I.ud}</small>`:`<div><b>Công nghiệp silicate</b></div><small>Chạm vào bao xi măng, chai thủy tinh hoặc bát sứ.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.n.on=true;K._dockH("cao");setTimeout(()=>{if(!K.dead)K._dockH("pp")},2500);["xm","tt","gs"].forEach(k=>K._dockH("ind",k));refresh()}};
    return K.mount(st)}
});
})();
