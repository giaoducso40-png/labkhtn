/* K9-L-06 · Định luật Ohm; đoạn mạch nối tiếp, đoạn mạch song song (SGK KHTN 9 – Kết nối tri thức, Bài 11–12) · 3D, điều tra
   Ba bảng mạch lắp sẵn trên bàn: nguồn điện một chiều điều chỉnh được (0–12 V), công tắc, điện trở (dải màu), ampe kế, vôn kế số.
   1. Định luật Ohm: thay đổi hiệu điện thế, đọc cường độ dòng điện qua điện trở 10 Ω hoặc 20 Ω; vẽ đồ thị I – U.
   2. Hai điện trở mắc nối tiếp: I như nhau, U = U₁ + U₂, R = R₁ + R₂.
   3. Hai điện trở mắc song song: U như nhau, I = I₁ + I₂, 1/R = 1/R₁ + 1/R₂.
   Đồng hồ là lí tưởng (ampe kế điện trở 0, vôn kế điện trở rất lớn); số đọc làm tròn theo độ chia nhỏ nhất 0,01 A và 0,1 V. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const RS=[10,20],US=[0,1.5,3,4.5,6,7.5,9,12];
const XB={ohm:-3.2,nt:0,ss:3.2};
const BAND=["#111111","#7B3F00","#D32F2F","#F57C00","#FDD835","#2E7D32","#1565C0","#6A1B9A","#757575","#FAFAFA"];

const SPEC={
  predict:[{id:"p1",q:"Tăng hiệu điện thế giữa hai đầu điện trở lên gấp đôi, cường độ dòng điện qua điện trở sẽ:",opts:[["gap2","Tăng gấp đôi"],["kd","Không đổi"],["giam","Giảm một nửa"]],ans:"gap2",res:"Kết quả: I tỉ lệ thuận với U (đồ thị I – U là đường thẳng qua gốc toạ độ)."},
    {id:"p2",q:"Hai điện trở 10 Ω và 20 Ω mắc song song. Điện trở tương đương của đoạn mạch:",opts:[["nho","Nhỏ hơn 10 Ω"],["30","Bằng 30 Ω"],["15","Bằng 15 Ω"]],ans:"nho",res:"Kết quả: R = 10·20/(10 + 20) ≈ 6,7 Ω, nhỏ hơn mỗi điện trở thành phần."}],
  taskLead:"Chọn bảng mạch ở khay. Đóng công tắc, chỉnh hiệu điện thế của nguồn, đọc ampe kế và vôn kế rồi bấm “Ghi số đo”.",
  tasks:[{html:"<b>Định luật Ohm:</b> với cùng một điện trở, ghi ít nhất 4 cặp số đo U, I khác nhau.",done:()=>[0,1].some(r=>new Set(S.log.filter(l=>l.b==="ohm"&&l.r===r&&l.U>0).map(l=>l.U)).size>=4)},
    {html:"<b>Nối tiếp:</b> ghi số đo của vôn kế ở cả 3 vị trí (R₁, R₂, cả đoạn mạch).",done:()=>["r1","r2","ab"].every(p=>S.log.some(l=>l.b==="nt"&&l.vp===p&&l.U>0))},
    {html:"<b>Song song:</b> ghi số đo ở ít nhất 2 giá trị hiệu điện thế; so sánh I với I₁ + I₂.",done:()=>new Set(S.log.filter(l=>l.b==="ss"&&l.U>0).map(l=>l.U)).size>=2}],
  obs:[{id:"a",q:"Đồ thị I theo U của một điện trở là:",opts:[["thang","Đường thẳng đi qua gốc toạ độ"],["cong","Đường cong"],["ngang","Đường nằm ngang"]],ans:"thang",why:"I = U/R với R không đổi: I tỉ lệ thuận với U."},
    {id:"b",q:"Trong đoạn mạch nối tiếp R₁ = 10 Ω, R₂ = 20 Ω, hiệu điện thế trên R₂ so với trên R₁:",opts:[["gap2","Lớn gấp đôi"],["bang","Bằng nhau"],["nua","Bằng một nửa"]],ans:"gap2",why:"Cùng cường độ dòng điện, U tỉ lệ với R: U₂/U₁ = R₂/R₁ = 2."},
    {id:"c",q:"Trong đoạn mạch song song, nhánh nào có dòng điện lớn hơn?",opts:[["nho","Nhánh có điện trở nhỏ hơn"],["lon","Nhánh có điện trở lớn hơn"],["bang","Hai nhánh như nhau"]],ans:"nho",why:"Cùng hiệu điện thế U, I = U/R nên R nhỏ thì I lớn."}],
  concl:{html:`<div class="eq">I = U/R &nbsp;&nbsp; Nối tiếp: I = I₁ = I₂; U = U₁ + U₂; R = R₁ + R₂ &nbsp;&nbsp; Song song: U = U₁ = U₂; I = I₁ + I₂; 1/R = 1/R₁ + 1/R₂</div><ul class="tlist">
    <li><b>Định luật Ohm</b>: cường độ dòng điện chạy qua một đoạn dây dẫn tỉ lệ thuận với hiệu điện thế đặt vào hai đầu dây và tỉ lệ nghịch với điện trở của dây.</li>
    <li>Điện trở đặc trưng cho mức độ cản trở dòng điện của vật dẫn; đơn vị ohm (Ω).</li></ul>`,
    quiz:[{id:"q1",q:"Đặt hiệu điện thế 6 V vào hai đầu điện trở 12 Ω. Cường độ dòng điện là:",opts:[["a","0,5 A"],["b","2 A"],["c","72 A"]],ans:"a",why:{b:"I = U/R = 6/12.",c:"Phải chia, không nhân."}},
      {id:"q2",q:"Ba điện trở 6 Ω mắc song song có điện trở tương đương:",opts:[["a","2 Ω"],["b","18 Ω"],["c","6 Ω"]],ans:"a",why:{b:"Đó là mắc nối tiếp.",c:"1/R = 3/6 → R = 2 Ω."}}],
    done:`<h2>Hoàn thành: Định luật Ohm, mạch nối tiếp, song song</h2><p class="muted">I = U/R; nối tiếp cộng điện trở, song song cộng nghịch đảo điện trở.</p>`},
  gv:["Cho học sinh vẽ đồ thị I – U từ bảng số liệu, tính R = U/I ở từng lần đo rồi lấy trung bình.","Hỏi: vì sao các đèn trong nhà được mắc song song?","An toàn khi làm thật: ngắt công tắc khi thay đổi cách mắc; chọn thang đo phù hợp của ampe kế."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 11–12)</p><ul class="tlist"><li>Thực hiện thí nghiệm để xây dựng được định luật Ohm; nêu được điện trở có tác dụng cản trở dòng điện.</li><li>Thực hiện thí nghiệm rút ra cường độ dòng điện, hiệu điện thế trong đoạn mạch nối tiếp, song song; tính được điện trở tương đương.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 11 Điện trở. Định luật Ohm; Bài 12 Đoạn mạch nối tiếp, song song.</li>
<li>Định luật Ohm, mạch nối tiếp và song song: <a href="https://openstax.org/books/college-physics-2e/pages/20-2-ohms-law-resistance-and-simple-circuits" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 20.2</a>; <a href="https://openstax.org/books/college-physics-2e/pages/21-1-resistors-in-series-and-parallel" target="_blank" rel="noopener">mục 21.1</a>.</li>
<li>Mã màu điện trở 10 Ω: nâu – đen – đen (×1); 20 Ω: đỏ – đen – đen (×1); vạch sai số vàng kim 5% (quy ước IEC 60062).</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Nguồn lí tưởng; đồng hồ lí tưởng; điện trở không đổi theo nhiệt độ.</li></ul>`;

let S;
LabKHTN.register("K9-L-06",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"mach",t:"Mạch"},{k:"u",t:"U (V)"},{k:"i",t:"I (A)"},{k:"kq",t:"Nhận xét"}],empty:"Bấm “Ghi số đo” để ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const V=(k,o)=>Object.assign({t:[XB[k],.08,.12],yaw:0,pitch:.82,rad:.64},o);
    const K=KIT.scene3D(api,{aria:"Bảng mạch 3D đo hiệu điện thế, cường độ dòng điện",legend:{w:260},bench:[10,2.4],seed:11,
      views:{ohm:V("ohm",{label:"Định luật Ohm",icon:IC.bolt}),nt:V("nt",{label:"Nối tiếp",icon:IC.step}),ss:V("ss",{label:"Song song",icon:IC.grid})}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={U:{ohm:3,nt:6,ss:6},on:{ohm:false,nt:false,ss:false},r:0,vp:"ab",ap:"main",log:[],recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const texM=tex=>({type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}});
    const metal={color:"#C0C6CC",metal:.85,rough:.3};
    /* ---------- linh kiện ---------- */
    function resistor(x,z,ohm,rot){const n=root.add(new G.Node());n.pos=[x,.035,z];n.quat=G.Q.euler(0,rot||0,0);
      const body=n.add(new G.Node());body.quat=G.Q.euler(0,0,Math.PI/2);body.add(R.mesh(G.lathe([[.0,-.08],[.022,-.075],[.026,-.05],[.022,-.03],[.022,.03],[.026,.05],[.022,.075],[0,.08]],24),{color:"#D9C49A",rough:.5}));
      const d=[Math.floor(ohm/10)%10,ohm%10,0];const cols=[BAND[d[0]],BAND[d[1]],BAND[0],"#C9A227"];
      cols.forEach((c,i)=>body.add(R.mesh(G.cylinder(.0235,.01,20),{color:c,rough:.4,metal:i===3?.7:0})).pos=[0,-.045+i*.025,0]);
      for(const s of [-1,1])n.add(R.mesh(G.cylinder(.003,.06,6),metal)).quat=G.Q.euler(0,0,Math.PI/2),n.children[n.children.length-1].pos=[s*.08+(s>0?.06:0),0,0];
      return n}
    function lcd(){const c=document.createElement("canvas");c.width=256;c.height=96;const t=R.tex2D(c);let last="";return{c,t,set(txt,unit){const k=txt+unit;if(k===last)return;last=k;const g=c.getContext("2d");g.fillStyle="#9DB59A";g.fillRect(0,0,256,96);g.fillStyle="#1C2A1C";g.font="700 60px 'Courier New',monospace";g.textAlign="right";g.fillText(txt,200,70);g.font="700 34px system-ui";g.fillText(unit,248,70);t.update(c)}}}
    function meter(x,z,kind){const n=root.add(new G.Node());n.pos=[x,0,z];n.add(R.mesh(G.box(.26,.07,.18,.02,3),{color:kind==="A"?"#B71C1C":"#0D47A1",rough:.5})).pos=[0,.035,0];
      const L=lcd();const sc=n.add(R.mesh(G.plane(.17,.065),texM(L.t)));sc.pos=[0,.0705,-.02];
      n.add(R.mesh(G.box(.06,.004,.03,.002,1),{color:"#F5F5F5",type:"unlit"})).pos=[0,.072,.05];
      for(const [dx,c] of [[-.08,"#D32F2F"],[.08,"#212121"]])n.add(R.mesh(G.cylinder(.012,.02,10),{color:c,rough:.4})).pos=[dx,.07,.06];
      const lb=document.createElement("canvas");lb.width=64;lb.height=64;{const g=lb.getContext("2d");g.fillStyle="#FFFFFF";g.font="800 52px system-ui";g.textAlign="center";g.fillText(kind,32,52)}
      const sym=n.add(R.mesh(G.plane(.035,.035),{type:"unlit",color:"#FFFFFF",alpha:1,transparent:true,hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 t=texture(uTex,vUV);if(t.a<.3)discard;base.rgb=t.rgb;}"},textures:{uTex:R.tex2D(lb)}}));sym.pos=[-.1,.0705,.04];
      return{n,L,a:[x-.08,.08,z+.06],b:[x+.08,.08,z+.06]}}
    function supply(x,z){const n=root.add(new G.Node());n.pos=[x,0,z];n.add(R.mesh(G.box(.34,.14,.2,.02,3),{color:"#E3E7EC",rough:.5})).pos=[0,.07,0];
      const L=lcd();const sc=n.add(R.mesh(G.plane(.15,.055),texM(L.t)));sc.quat=G.Q.euler(Math.PI/2,0,0);sc.pos=[-.05,.09,.1005];
      const kn=n.add(R.mesh(G.cylinder(.03,.025,24),{color:"#222",rough:.4}));kn.quat=G.Q.euler(Math.PI/2,0,0);kn.pos=[.1,.08,.1];
      for(const [dx,c] of [[-.1,"#D32F2F"],[.1,"#212121"]])n.add(R.mesh(G.cylinder(.012,.025,10),{color:c,rough:.4})).pos=[dx,.14,.03];
      return{n,L,kn,p:[x-.1,.15,z+.03],m:[x+.1,.15,z+.03]}}
    function sw(x,z){const n=root.add(new G.Node());n.pos=[x,0,z];n.add(R.mesh(G.box(.16,.02,.08,.006,2),{color:"#EDE7DA",rough:.6})).pos=[0,.01,0];
      const lev=n.add(new G.Node());lev.pos=[-.055,.035,0];lev.add(R.mesh(G.box(.12,.008,.02,.003,1),metal)).pos=[.06,0,0];return{n,lev,a:[x-.055,.03,z],b:[x+.055,.03,z],set(on){lev.quat=G.Q.euler(0,0,on?-.02:.5)}}}
    const W=(pts,col)=>root.add(R.mesh(G.tube(G.spline(pts,6),.006,6),{color:col||"#D32F2F",rough:.45,coat:.3}));
    const up=(p,h)=>[p[0],h,p[2]];
    /* dòng điện: chấm sáng chạy dọc dây theo chiều quy ước (từ cực dương) */
    const flows=[];const dots=root.add(R.instanced(G.sphere(1,8,6),{type:"unlit",color:"#FFFFFF"},400));
    function flowPath(b,pts,getI){const P=G.spline(pts,6);let L=0;const ls=[0];for(let i=1;i<P.length;i++){L+=V3.dist(P[i],P[i-1]);ls.push(L)}flows.push({b,P,ls,L,getI,ph:0})}
    const board=x=>{root.add(R.mesh(G.box(1.6,.02,1.0,.01,2),{color:"#C69C6D",rough:.6,hooks:KIT.TISSUE,uniforms:{uBump:.03,uNF:30}})).pos=[x,.01,.08]};
    const B={};
    /* ===== bảng 1: Ohm ===== */
    {const x=XB.ohm;board(x);const ps=supply(x-.52,-.18),s1=sw(x-.05,-.25),am=meter(x+.48,-.18,"A"),vm=meter(x+.1,.42,"V");const r10=resistor(x-.08,.18,10),r20=resistor(x-.08,.18,20);
      const RA=[x-.21,.035,.18],RB=[x+.06,.035,.18];
      W([ps.p,up(ps.p,.2),[x-.3,.05,-.2],s1.a]);W([s1.b,[x+.15,.05,-.3],[x+.3,.06,-.12],am.a]);W([am.b,[x+.6,.06,0],[x+.35,.05,.18],RB],"#D32F2F");W([RA,[x-.45,.05,.15],[x-.5,.06,0],ps.m],"#212121");
      W([vm.a,[x-.05,.08,.35],[x-.22,.06,.24],RA],"#D32F2F");W([vm.b,[x+.25,.08,.35],[x+.1,.06,.24],RB],"#212121");
      flowPath("ohm",[ps.p,up(ps.p,.2),[x-.3,.05,-.2],s1.a,s1.b,[x+.15,.05,-.3],[x+.3,.06,-.12],am.a,am.b,[x+.6,.06,0],[x+.35,.05,.18],RB,RA,[x-.45,.05,.15],[x-.5,.06,0],ps.m],()=>cur("ohm").I);
      B.ohm={ps,s1,am,vm,r10,r20}}
    /* ===== bảng 2: nối tiếp R1 = 10 Ω, R2 = 20 Ω ===== */
    {const x=XB.nt;board(x);const ps=supply(x-.52,-.18),s1=sw(x-.05,-.25),am=meter(x+.48,-.18,"A"),vm=meter(x+.15,.46,"V");resistor(x-.3,.16,10);resistor(x+.18,.16,20);
      const A=[x-.43,.035,.16],M=[x-.16,.035,.16],M2=[x+.05,.035,.16],Bp=[x+.32,.035,.16];
      W([ps.p,up(ps.p,.2),[x-.3,.05,-.2],s1.a]);W([s1.b,[x+.15,.05,-.3],[x+.3,.06,-.12],am.a]);W([am.b,[x+.65,.06,0],[x+.5,.05,.16],Bp]);W([M,[x-.06,.05,.12],M2],"#F57C00");W([A,[x-.55,.05,.12],[x-.55,.06,0],ps.m],"#212121");
      const vw=root.add(new G.Node());B.nt={ps,s1,am,vm,vw,pts:{A,M,M2,B:Bp}};
      flowPath("nt",[ps.p,up(ps.p,.2),[x-.3,.05,-.2],s1.a,s1.b,[x+.15,.05,-.3],[x+.3,.06,-.12],am.a,am.b,[x+.65,.06,0],[x+.5,.05,.16],Bp,M2,[x-.06,.05,.12],M,A,[x-.55,.05,.12],[x-.55,.06,0],ps.m],()=>cur("nt").I)}
    /* ===== bảng 3: song song: ampe kế A ở mạch chính, A₁, A₂ ở hai nhánh ===== */
    {const x=XB.ss;board(x);const ps=supply(x-.52,-.18),s1=sw(x-.05,-.25),am=meter(x+.5,-.15,"A"),vm=meter(x-.45,.5,"V");
      const a1=meter(x-.1,.12,"A"),a2=meter(x-.1,.36,"A");for(const m of [a1,a2]){m.n.scl=[.62,.62,.62];m.a=[x-.1-.05,.05,m.n.pos[2]+.037];m.b=[x-.1+.05,.05,m.n.pos[2]+.037]}
      resistor(x+.2,.12,10);resistor(x+.2,.36,20);
      const N1=[x-.3,.035,.24],N2=[x+.48,.035,.24];
      W([ps.p,up(ps.p,.2),[x-.3,.05,-.2],s1.a]);W([s1.b,[x+.15,.05,-.3],[x+.32,.06,-.2],am.a]);W([am.b,[x+.66,.06,-.02],[x+.55,.05,.15],N2]);
      for(const [m,z] of [[a1,.12],[a2,.36]]){W([N1,[x-.3,.04,z],[x-.2,.04,z+.03],m.a],"#212121");W([m.b,[x+.0,.04,z+.03],[x+.06,.035,z]],"#212121");W([[x+.34,.035,z],[x+.48,.04,z],N2],"#D32F2F")}
      W([N1,[x-.42,.05,.2],[x-.6,.06,0],ps.m],"#212121");
      W([vm.a,[x-.5,.08,.36],[x-.3,.05,.3],N1],"#212121");W([vm.b,[x-.1,.09,.62],[x+.45,.07,.45],N2],"#D32F2F");
      B.ss={ps,s1,am,vm,a1,a2,N1,N2,x};
      flowPath("ss",[ps.p,up(ps.p,.2),[x-.3,.05,-.2],s1.a,s1.b,[x+.15,.05,-.3],[x+.32,.06,-.2],am.a,am.b,[x+.66,.06,-.02],[x+.55,.05,.15],N2],()=>cur("ss").I);
      flowPath("ss",[N2,[x+.48,.04,.12],[x+.34,.035,.12],[x+.06,.035,.12],[x+.0,.04,.15],a1.b,a1.a,[x-.2,.04,.15],[x-.3,.04,.12],N1],()=>cur("ss").I1);
      flowPath("ss",[N2,[x+.48,.04,.36],[x+.34,.035,.36],[x+.06,.035,.36],[x+.0,.04,.39],a2.b,a2.a,[x-.2,.04,.39],[x-.3,.04,.36],N1],()=>cur("ss").I2);
      flowPath("ss",[N1,[x-.42,.05,.2],[x-.6,.06,0],ps.m],()=>cur("ss").I)}
    /* dây nối vôn kế (nối tiếp) và ampe kế (song song) đổi theo vị trí chọn */
    function rewire(){const N=B.nt;N.vw.children.slice().forEach(n=>N.vw.remove(n));const P=N.pts;const pr={r1:[P.A,P.M],r2:[P.M2,P.B],ab:[P.A,P.B]}[S.vp];
      N.vw.add(R.mesh(G.tube(G.spline([N.vm.a,[N.vm.a[0]-.1,.09,.36],[pr[0][0],.07,pr[0][2]+.06],pr[0]],6),.006,6),{color:"#D32F2F",rough:.45}));
      N.vw.add(R.mesh(G.tube(G.spline([N.vm.b,[N.vm.b[0]+.1,.09,.36],[pr[1][0],.07,pr[1][2]+.06],pr[1]],6),.006,6),{color:"#212121",rough:.45}));
}
    rewire();
    /* ---------- tính toán ---------- */
    function cur(b){const U=S.on[b]?S.U[b]:0;if(b==="ohm"){const Rr=RS[S.r];return{U,I:U/Rr,R:Rr,V:U}}
      if(b==="nt"){const I=U/30;const V={r1:I*10,r2:I*20,ab:U}[S.vp];return{U,I,V,R:30}}
      const I1=U/10,I2=U/20;return{U,I:I1+I2,I1,I2,V:U,A:I1+I2,R:20/3}}
    const r2=v=>Math.round(v*100)/100,r1=v=>Math.round(v*10)/10;
    K.onFrame((dt)=>{for(const b in B){const Bb=B[b];const c=cur(b);Bb.s1.set(S.on[b]);Bb.ps.L.set(fmt(S.U[b],1),"V");Bb.ps.kn.quat=G.Q.mul(G.Q.euler(Math.PI/2,0,0),G.Q.euler(0,S.U[b]/12*4.5,0));
        const Ishow=b==="ss"?c.A:c.I;Bb.am.L.set(fmt(r2(Ishow),2),"A");Bb.vm.L.set(fmt(r1(c.V),1),"V");if(b==="ss"){Bb.a1.L.set(fmt(r2(c.I1),2),"A");Bb.a2.L.set(fmt(r2(c.I2),2),"A")}}
      B.ohm.r10.visible=S.r===0;B.ohm.r20.visible=S.r===1;
      /* chấm dòng điện */
      const D=dots.data,col=H("#FDE047");let n=0;for(const f of flows){const c=f.getI();if(f.b!==K.view||!S.on[f.b]||c<=0)continue;f.ph=(f.ph+dt*c*.5)%1;const N=Math.round(f.L/.06);
        for(let k=0;k<N&&n<400;k++){const t=((k+f.ph)/N)*f.L;let i=1;while(i<f.ls.length-1&&f.ls[i]<t)i++;const p=V3.lerp(f.P[i-1],f.P[i],C.clamp((t-f.ls[i-1])/((f.ls[i]-f.ls[i-1])||1),0,1));D.set([p[0],p[1]+.008,p[2],.006,col[0],col[1],col[2],1],n*8);n++}}
      dots.setInstances(n)});
    /* ---------- nhãn ---------- */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    for(const b in B){const Bb=B[b];lab("Nguồn điện điều chỉnh",V3.add(Bb.ps.n.pos,[0,.15,0]),b,{dir:"nw",len:30});lab("Công tắc",V3.add(Bb.s1.n.pos,[0,.03,0]),b,{dir:"n",len:30});lab("Ampe kế",V3.add(Bb.am.n.pos,[0,.08,0]),b,{dir:"ne",len:30});lab("Vôn kế",V3.add(Bb.vm.n.pos,[0,.08,0]),b,{dir:"se",len:30})}
    const lR=lab("",[XB.ohm-.08,.06,.18],"ohm",{dir:"s",len:30});lab("R₁ = 10 Ω",[XB.nt-.3,.06,.16],"nt",{dir:"s",len:24});lab("R₂ = 20 Ω",[XB.nt+.18,.06,.16],"nt",{dir:"s",len:24});
    lab("R₁ = 10 Ω",[XB.ss+.2,.06,.12],"ss",{dir:"n",len:16});lab("R₂ = 20 Ω",[XB.ss+.2,.06,.36],"ss",{dir:"s",len:16});lab("A₁",[XB.ss-.1,.05,.12],"ss",{dir:"w",len:20});lab("A₂",[XB.ss-.1,.05,.36],"ss",{dir:"w",len:20});
    K.onFrame(()=>lR.set(`Điện trở R = ${RS[S.r]} Ω`));
    /* ---------- khay ---------- */
    K.dockFn(()=>{const b=K.view;const it=[{k:"on",label:S.on[b]?"Ngắt công tắc":"Đóng công tắc",icon:S.on[b]?IC.ban:IC.bolt,on:S.on[b]},{grid:[{k:"u",v:"-",label:"Giảm U",icon:IC.minus,dis:S.U[b]<=0},{k:"u",v:"+",label:"Tăng U",icon:IC.plus,dis:S.U[b]>=12}]}];
      if(b==="ohm")it.push({seg:RS.map((r,i)=>({k:"r",v:String(i),label:`R = ${r} Ω`,icon:"",on:S.r===i})),label:"Điện trở"});
      if(b==="nt")it.push({seg:[["r1","Vôn kế đo R₁"],["r2","Vôn kế đo R₂"],["ab","Vôn kế đo cả đoạn mạch"]].map(([k,t])=>({k:"vp",v:k,label:t,icon:"",on:S.vp===k})),label:"Vị trí vôn kế"});
      it.push("hr",{k:"rec",label:"Ghi số đo",icon:IC.pen,dis:!S.on[b]});return it});
    K.onDock((k,v)=>{const b=K.view;
      if(k==="on")S.on[b]=!S.on[b];else if(k==="u"){const i=US.indexOf(S.U[b]);const j=C.clamp((i<0?0:i)+(v==="+"?1:-1),0,US.length-1);S.U[b]=US[j]}
      else if(k==="r")S.r=+v;else if(k==="vp"){S.vp=v;rewire()}else if(k==="ap"){S.ap=v;rewire()}
      else if(k==="rec"){const c=cur(b);const I=b==="ss"?c.A:c.I;const it={b,U:S.U[b],r:S.r,vp:S.vp,ap:S.ap};S.log.push(it);S.recs++;
        const mach=b==="ohm"?`Điện trở ${RS[S.r]} Ω`:b==="nt"?`Nối tiếp 10 Ω + 20 Ω · vôn kế đo ${{r1:"R₁",r2:"R₂",ab:"cả đoạn mạch"}[S.vp]}`:`Song song 10 Ω // 20 Ω`;
        api.record({lan:String(S.recs),mach,u:fmt(r1(c.V),1),i:fmt(r2(I),2),kq:b==="ohm"?(c.U>0?`U/I = ${fmt(c.V/I,1)} Ω`:"U = 0 thì I = 0"):b==="nt"?`nguồn ${fmt(S.U[b],1)} V; I = ${fmt(r2(c.I),2)} A`:`I₁ = ${fmt(r2(c.I1),2)} A; I₂ = ${fmt(r2(c.I2),2)} A; I = I₁ + I₂ = ${fmt(r2(c.I),2)} A`})}
      refresh()});
    K.infoFn(()=>{const b=K.view,c=cur(b);
      if(b==="ohm"){const pts=S.log.filter(l=>l.b==="ohm"&&l.r===S.r).map(l=>[l.U,l.U/RS[l.r]]);const ch=pts.length?KIT.miniChart([{pts:[[0,0]].concat(pts).sort((a,b)=>a[0]-b[0]),c:"#FDE047",dot:true}],{w:220,h:120,y0:0,y1:1.2,xl:"U (V)",yl:"I (A)",x0:0,x1:12}):"";
        return `<div><b>Định luật Ohm</b> · R = ${RS[S.r]} Ω</div><div>U = ${fmt(c.V,1)} V · I = ${fmt(r2(c.I),2)} A</div>${ch}<small>Đồ thị vẽ từ các số đo đã ghi.</small>`}
      if(b==="nt")return `<div><b>Đoạn mạch nối tiếp</b> R₁ = 10 Ω, R₂ = 20 Ω</div><div>I = ${fmt(r2(c.I),2)} A ở mọi vị trí</div><div>U₁ = ${fmt(r1(c.I*10),1)} V · U₂ = ${fmt(r1(c.I*20),1)} V · U = ${fmt(c.U,1)} V</div><small>R tương đương = R₁ + R₂ = 30 Ω.</small>`;
      return `<div><b>Đoạn mạch song song</b> R₁ = 10 Ω, R₂ = 20 Ω</div><div>U = ${fmt(c.U,1)} V trên mỗi nhánh</div><div>I₁ = ${fmt(r2(c.I1),2)} A · I₂ = ${fmt(r2(c.I2),2)} A · I = ${fmt(r2(c.I),2)} A</div><small>1/R = 1/10 + 1/20 → R ≈ 6,7 Ω.</small>`});
    K.timeLabel(()=>`${K.views[K.view].label} · ${S.on[K.view]?"có dòng điện":"công tắc ngắt"}`);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>Object.keys(B).flatMap(b=>[{k:"on",p:V3.add(B[b].s1.n.pos,[0,.04,0]),tip:S.on[b]?"Chạm để ngắt công tắc":"Chạm để đóng công tắc",view:b},{k:"u",v:"+",p:V3.add(B[b].ps.n.pos,[0,.12,0]),tip:"Chạm để tăng hiệu điện thế",view:b}]));
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){const press=()=>{const b=document.querySelector('[data-k="rec"]');b&&b.click()};K.goView("ohm");S.on.ohm=true;S.r=0;refresh();for(const u of [1.5,3,6,9]){S.U.ohm=u;refresh();press()}
        K.goView("nt");S.on.nt=true;refresh();for(const p of ["r1","r2","ab"]){S.vp=p;rewire();refresh();press()}K.goView("ss");S.on.ss=true;refresh();for(const u of [6,9]){S.U.ss=u;refresh();press()}}};
    return K.mount(st)}
});
})();
