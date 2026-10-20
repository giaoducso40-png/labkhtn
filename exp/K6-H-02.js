/* K6-H-02 · Oxygen duy trì sự cháy; thành phần của không khí (SGK KHTN 6 – Kết nối tri thức, Bài 9 Oxygen, Bài 10 Không khí và bảo vệ môi trường không khí) · 3D
   1. Que đóm còn tàn đỏ: đưa vào bình không khí (tàn đỏ lụi dần) và bình oxygen (que đóm bùng cháy).
   2. Đốt nến trong cốc úp trên chậu nước: nến tắt, nước dâng lên khoảng 1/5 cột không khí trong cốc (theo SGK).
   3. Thành phần không khí (theo thể tích, không khí khô): khoảng 78 % nitrogen, 21 % oxygen, 1 % các khí khác. Mô hình 100 phân tử. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q,H=G.hex;
const fmt=C.fmt;
const SPEC={
  predict:[{id:"p1",q:"Đưa que đóm còn tàn đỏ vào bình chứa khí oxygen, que đóm sẽ:",opts:[["bung","Bùng cháy"],["tat","Tắt ngay"],["kd","Không thay đổi"]],ans:"bung",res:"Kết quả: que đóm bùng cháy thành ngọn lửa: oxygen duy trì sự cháy."},
    {id:"p2",q:"Khí chiếm tỉ lệ thể tích lớn nhất trong không khí là:",opts:[["n2","Nitrogen"],["o2","Oxygen"],["co2","Carbon dioxide"]],ans:"n2",res:"Kết quả: nitrogen khoảng 78 %, oxygen khoảng 21 %."}],
  taskLead:"Làm lần lượt ba thí nghiệm. Kết quả tự ghi vào bảng.",
  tasks:[{html:"<b>Que đóm:</b> thử ở cả bình không khí và bình oxygen.",done:()=>S.ox.kk.t>=1&&S.ox.o2.t>=1},{html:"<b>Nến trong cốc úp:</b> châm nến, úp cốc và quan sát mực nước.",done:()=>S.kk.ph>=3},{html:"<b>Thành phần:</b> xem cả ba nhóm khí trong mô hình.",done:()=>Object.keys(S.tp).length>=3}],
  obs:[{id:"a",q:"Que đóm cháy mạnh trong bình oxygen hơn trong không khí vì:",opts:[["ok","Bình oxygen có nhiều oxygen hơn, mà oxygen duy trì sự cháy"],["n2","Nitrogen duy trì sự cháy"],["nong","Bình oxygen nóng hơn"]],ans:"ok",why:"Trong không khí, oxygen chỉ chiếm khoảng 21 % thể tích."},
    {id:"b",q:"Trong thí nghiệm nến, nước dâng lên khoảng:",opts:[["15","1/5 cột không khí trong cốc"],["12","1/2"],["full","Đầy cốc"]],ans:"15",why:"SGK dùng kết quả này để ước lượng oxygen chiếm khoảng 1/5 thể tích không khí."},
    {id:"c",q:"Nến tắt sau một thời gian vì:",opts:[["ok","Lượng oxygen trong cốc giảm, không đủ duy trì sự cháy"],["nuoc","Nước dập tắt nến"],["gio","Có gió"]],ans:"ok",why:"Cốc úp ngăn không khí bên ngoài đi vào."}],
  concl:{html:`<ul class="tlist"><li><b>Oxygen</b> là chất khí không màu, không mùi, không vị, ít tan trong nước, nặng hơn không khí; oxygen <b>duy trì sự cháy và sự sống</b>.</li>
    <li><b>Không khí</b> là hỗn hợp khí; theo thể tích gồm khoảng 78 % nitrogen, 21 % oxygen, 1 % các khí khác (hơi nước, carbon dioxide, khí hiếm…).</li>
    <li>Nến cháy trong cốc úp tắt khi thiếu oxygen; nước dâng lên chiếm chỗ phần khí đã mất đi.</li></ul>`,
    quiz:[{id:"q1",q:"Để dập tắt đám cháy nhỏ, phủ chăn ướt lên đám cháy nhằm:",opts:[["a","Ngăn không cho oxygen tiếp xúc với vật cháy"],["b","Tăng lượng oxygen"],["c","Tăng nhiệt độ"]],ans:"a",why:{b:"Tăng oxygen làm cháy mạnh hơn.",c:"Chăn ướt làm giảm nhiệt độ, không tăng."}},
      {id:"q2",q:"Trong 100 lít không khí có khoảng bao nhiêu lít oxygen?",opts:[["a","21 lít"],["b","78 lít"],["c","1 lít"]],ans:"a",why:{b:"78 lít là nitrogen.",c:"1 lít là các khí khác."}}],
    done:`<h2>Hoàn thành: Oxygen và không khí</h2><p class="muted">Oxygen duy trì sự cháy; không khí có khoảng 21 % oxygen, 78 % nitrogen.</p>`},
  gv:["Thí nghiệm nến – cốc úp chỉ cho kết quả gần đúng: nến thường tắt trước khi hết oxygen; nước dâng còn do khí trong cốc nguội đi và co lại, một phần carbon dioxide tan vào nước. Nên giải thích như một ước lượng, không coi là phép đo chính xác.","An toàn: dùng que đóm, diêm dưới sự giám sát của giáo viên; bình oxygen để xa nguồn lửa lớn.","Gợi ý mở rộng (Bài 10): nguồn gây ô nhiễm không khí và biện pháp bảo vệ."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 9, Bài 10)</p><ul class="tlist"><li>Nêu được một số tính chất của oxygen (trạng thái, màu sắc, tính tan…); nêu được tầm quan trọng của oxygen đối với sự sống, sự cháy và quá trình đốt nhiên liệu.</li><li>Nêu được thành phần của không khí (oxygen, nitrogen, carbon dioxide, khí hiếm, hơi nước); tiến hành được thí nghiệm đơn giản để xác định thành phần phần trăm thể tích của oxygen trong không khí.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài và tỉ lệ thành phần không khí (khoảng 78 % nitrogen, 21 % oxygen, 1 % các khí khác): SGK KHTN 6 (Kết nối tri thức), Bài 9 Oxygen, Bài 10 Không khí và bảo vệ môi trường không khí.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Mức nước dâng trong thí nghiệm nến được mô phỏng đúng bằng 1/5 cột khí theo kết quả SGK; thực tế dao động (xem ghi chú giáo viên).</li>
<li>Mô hình 100 phân tử: 78 N₂, 21 O₂ và 1 nguyên tử argon đại diện cho “các khí khác”; khoảng cách, kích thước, tốc độ hạt không theo tỉ lệ thật.</li></ul>`;

let S;
LabKHTN.register("K6-H-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D oxygen và thành phần không khí",legend:{w:290},bench:[11,3.2],seed:9,
      views:{ox:{t:[-3,.75,0],yaw:.1,pitch:.2,rad:.95,label:"Que đóm",icon:IC.fire},kk:{t:[0,.68,0],yaw:.1,pitch:.18,rad:.85,label:"Nến trong cốc úp",icon:IC.beaker},tp:{t:[3.2,.68,0],yaw:0,pitch:.2,rad:.95,label:"Thành phần không khí",icon:IC.grid}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,rnd=K.rnd;
    S={ox:{kk:{t:0,run:false},o2:{t:0,run:false}},kk:{ph:0,t:0},tp:{},tsel:null,recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const ease=t=>t*t*(3-2*t);
    const tagM=(txt)=>{const c=document.createElement("canvas");c.width=256;c.height=96;const g=c.getContext("2d");g.fillStyle="#FFFFFF";C.rr(g,4,4,248,88,18);g.fill();g.fillStyle="#111827";g.font="800 44px system-ui";g.textAlign="center";g.fillText(txt,128,64);
      const pl=G.plane(.26,.1);const P=pl.pos,N=pl.nrm;for(let i=0;i<P.length;i+=3){const pz=P[i+2];P[i+1]=-pz;P[i+2]=0;N[i]=0;N[i+1]=0;N[i+2]=1}
      return R.mesh(pl,{type:"unlit",color:"#FFFFFF",key:"tag",hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.5)discard;base.rgb=c.rgb;}"},textures:{uTex:R.tex2D(c)}})};
    /* ---------- 1. que đóm ---------- */
    const OXX=-3;const JAR={};
    for(const [k,dx,t] of [["kk",-.38,"Không khí"],["o2",.38,"Oxygen"]]){const n=root.add(new G.Node());n.pos=[OXX+dx,0,0];
      n.add(K3.glass(R,.2,.72,{lip:.02}));if(k==="o2")n.add(R.mesh(G.cylinder(.18,.66,32),{type:"unlit",color:"#BFDBFE",alpha:.08,transparent:true,key:"o2tint"})).pos=[0,.04,0];
      const lid=n.add(R.mesh(G.box(.5,.018,.5,.006,2),{type:"glass",color:"#E0F2FE",alpha:.4,key:"lid"}));lid.pos=[0,.735,0];
      const tg=n.add(tagM(t));tg.pos=[0,.3,.205];
      const sp=root.add(new G.Node());sp.add(R.mesh(G.box(.014,.6,.014,.003,1),{color:"#D6B37A",rough:.8})).pos=[0,.3,0];
      const ember=sp.add(R.mesh(G.sphere(.012,12,8),{color:"#7C2D12",emis:"#FB923C",rough:.7}));ember.pos=[0,0,0];ember.scl=[1,1.6,1];
      const fl=sp.add(K3.flame(R,[1,.55,.12],[1,.95,.75]));fl.scl=[.3,.38,.3];fl.pos=[0,-.01,0];fl.visible=false;
      JAR[k]={n,lid,sp,ember,fl,x:OXX+dx}}
    const smoke=root.add(K3.puffs(R,80,"#D1D5DB"));
    /* ---------- 2. nến trong cốc úp ---------- */
    const trough=root.add(new G.Node());
    trough.add(R.mesh(G.lathe([[0,0],[.56,0],[.58,.02],[.58,.3],[.6,.31],[.56,.31],[.555,.03],[0,.03]],56),{type:"glass",color:"#CFE6FF",alpha:.16,side:"double"}));
    const WS=.2;trough.add(K3.liquid(R,.55,.03,WS,H("#2563EB"),.4));
    trough.add(R.mesh(G.cylinder(.07,.22,24),{color:"#A8A29E",rough:.7})).pos=[0,.03,0];
    const cand=trough.add(R.mesh(G.cylinder(.03,.2,20),{color:"#FEF3C7",rough:.55,coat:.2}));cand.pos=[0,.25,0];trough.add(R.mesh(G.cylinder(.003,.03,6),{color:"#1F2937"})).pos=[0,.45,0];
    const cfl=trough.add(K3.flame(R,[1,.58,.14],[1,.95,.75]));cfl.pos=[0,.46,0];cfl.scl=[.32,.4,.32];cfl.visible=false;
    const CB=.05,CT=1.1,CR=.2;   /* cốc úp: miệng ở y = CB, đáy ở y = CT */
    const cup=trough.add(new G.Node());cup.add(R.mesh(G.lathe([[CR,0],[CR,CT-CB-.04],[CR-.03,CT-CB],[0,CT-CB],[0,CT-CB-.012],[CR-.035,CT-CB-.012],[CR-.012,CT-CB-.05],[CR-.012,0]],48),{type:"glass",color:"#E0F2FE",alpha:.14,side:"double"}));
    const AIR=CT-.012-WS,MK=[1,2,3,4].map(i=>WS+AIR*i/5);
    for(const y of MK)cup.add(R.mesh(G.tube(Array.from({length:33},(_,j)=>[Math.cos(j/32*3.1)*(CR+.002)-0,y-CB,Math.sin(j/32*3.1)*(CR+.002)]),.0035,4),{color:"#F8FAFC"}));
    const inW=cup.add(K3.liquid(R,CR-.014,0,1,H("#2563EB"),.5));inW.visible=false;
    const csmoke=root.add(K3.puffs(R,40,"#9CA3AF"));
    const CUPUP=.32;
    /* ---------- 3. thành phần không khí ---------- */
    const TPX=3.2,BW=1.1;const tpN=root.add(new G.Node());tpN.pos=[TPX,0,0];
    tpN.add(R.mesh(G.box(BW,BW,BW,.02,2),{type:"glass",color:"#E2E8F0",alpha:.08,side:"double",key:"tpbox"})).pos=[0,BW/2+.03,0];tpN.add(R.mesh(G.box(BW+.04,.03,BW+.04,.01,2),{color:"#334155",rough:.5})).pos=[0,.015,0];
    const KIND={n2:{t:"Nitrogen (N₂)",c:"#3B82F6",n:78,pct:"≈ 78 %"},o2:{t:"Oxygen (O₂)",c:"#EF4444",n:21,pct:"≈ 21 %"},kh:{t:"Các khí khác",c:"#A3A3A3",n:1,pct:"≈ 1 %"}};
    const AR=.032;const IMM={};const MOL=[];
    for(const k in KIND){IMM[k]=R.instanced(G.sphere(1,14,10),{color:KIND[k].c,rough:.35,coat:.3},KIND[k].n*2);tpN.add(IMM[k]);
      for(let i=0;i<KIND[k].n;i++){const a=rnd()*6.283,b=rnd()*2-1,sp=.25+rnd()*.25;MOL.push({k,p:[(rnd()-.5)*(BW-.12),.1+rnd()*(BW-.14),(rnd()-.5)*(BW-.12)],v:[Math.cos(a)*sp,b*sp,Math.sin(a)*sp],ax:V3.norm([rnd()-.5,rnd()-.5,rnd()-.5]),w:V3.norm([rnd()-.5,rnd()-.5,rnd()-.5]),ws:2+rnd()*3})}}
    const rot=(v,ax,a)=>{const c=Math.cos(a),s=Math.sin(a);return V3.add(V3.add(V3.scale(v,c),V3.scale(V3.cross(ax,v),s)),V3.scale(ax,V3.dot(ax,v)*(1-c)))};
    function stepTP(dt){const lo=-(BW/2-.06),hi=BW/2-.06;const cnt={n2:0,o2:0,kh:0};
      for(const m of MOL){m.p=V3.add(m.p,V3.scale(m.v,dt));for(const ax of [0,1,2]){const L=ax===1?.09:lo,Hh=ax===1?BW-.03:hi;if(m.p[ax]<L){m.p[ax]=L;m.v[ax]=Math.abs(m.v[ax])}if(m.p[ax]>Hh){m.p[ax]=Hh;m.v[ax]=-Math.abs(m.v[ax])}}
        m.ax=V3.norm(rot(m.ax,m.w,m.ws*dt));const D=IMM[m.k].data;const sel=S.tsel&&S.tsel!==m.k;const sc=sel?.7:1;
        if(m.k==="kh"){D.set([m.p[0],m.p[1],m.p[2],AR*1.25*sc,1,1,1,1],cnt.kh*8);cnt.kh++}
        else for(const sg of [1,-1]){const q=V3.add(m.p,V3.scale(m.ax,AR*.85*sg));D.set([q[0],q[1],q[2],AR*sc,1,1,1,1],cnt[m.k]*8);cnt[m.k]++}}
      for(const k in IMM)IMM[k].setInstances(cnt[k])}
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}
      for(const k of ["kk","o2"]){const P=S.ox[k],J=JAR[k];if(P.run){P.t=Math.min(1,P.t+dt/4.5);if(P.t>=1){P.run=false;api.record(k==="o2"?{tn:"Que đóm còn tàn đỏ vào bình oxygen",ht:"que đóm bùng cháy thành ngọn lửa",kl:"oxygen duy trì sự cháy"}:{tn:"Que đóm còn tàn đỏ vào bình không khí",ht:"tàn đỏ lụi dần, không bùng cháy",kl:"không khí chỉ có khoảng 21 % oxygen"});refresh()}}
        const t=P.t;const lid=ease(C.clamp(t*4,0,1)),dn=ease(C.clamp(t*3-.3,0,1));J.lid.pos=[0,.735+lid*.02,-lid*.36];
        const tipY=1.25-.75*dn;J.sp.pos=[J.x-.02,tipY,0];J.sp.quat=Q.euler(0,0,.12);
        const glow=k==="o2"?(t>.55?1.4:1):Math.max(.15,1-Math.max(0,t-.45)*1.6);J.ember.mat.emis=V3.scale(H("#FB923C"),glow);
        J.fl.visible=k==="o2"&&t>.55;if(J.fl.visible){const s=Math.min(1,(t-.55)*5);J.fl.scl=[.55*s,.75*s,.55*s]}
        if(rnd()<dt*(k==="kk"&&t>.5?6:1.5))smoke.spawn([J.x-.02,tipY+.02,0],.015,[(rnd()-.5)*.03,.12,0],1.8,.25,2)}
      smoke.step(dt);
      const P=S.kk;if(P.ph===2){P.t+=dt;if(P.t>8){P.ph=3;api.record({tn:"Đốt nến, úp cốc lên trên chậu nước",ht:"nến tắt; nước dâng lên khoảng 1/5 cốc",kl:"oxygen chiếm khoảng 1/5 thể tích không khí"});refresh()}}
      const down=P.ph>=2?ease(Math.min(1,P.t/1.2)):0;cup.pos=[0,CB+CUPUP*(1-down),0];
      const out=P.ph>=2&&P.t>4.6;cfl.visible=P.ph>=1&&!out;if(cfl.visible&&P.ph===2){const s=Math.max(.15,1-Math.max(0,P.t-2)/2.8);cfl.scl=[.32*s,.4*s,.32*s]}
      if(out&&P.t<7&&rnd()<dt*8)csmoke.spawn([0,.47,0],.012,[0,.06,0],1.5,.3,2);csmoke.step(dt);
      const rise=P.ph>=2?ease(C.clamp((P.t-3.2)/4.3,0,1)):0;const L=WS+AIR/5*rise;inW.visible=P.ph>=2&&rise>.001;inW.pos=[0,WS-CB,0];inW.scl=[1,Math.max(.001,L-WS),1];
      if(K.view==="tp")stepTP(Math.min(dt,.04))});
    /* ---------- tương tác ---------- */
    K.dockFn(()=>{const v=K.view;if(v==="ox"){const O=S.ox;return[{k:"sp",v:"kk",label:"Que đóm vào bình không khí",icon:IC.fire,dis:O.kk.run||O.kk.t>=1},{k:"sp",v:"o2",label:"Que đóm vào bình oxygen",icon:IC.fire,dis:O.o2.run||O.o2.t>=1},{k:"ors",label:"Làm lại",icon:IC.reset}]}
      if(v==="kk"){const P=S.kk;return[{k:"light",label:P.ph>=1?"Nến đã châm":"Châm nến",icon:IC.fire,dis:P.ph>=1},{k:"cup",label:P.ph>=2?"Đã úp cốc":"Úp cốc lên nến",icon:IC.beaker,dis:P.ph!==1},{k:"krs",label:"Làm lại",icon:IC.reset}]}
      return[{grid:Object.keys(KIND).map(k=>({k:"tk",v:k,label:KIND[k].t,icon:"",on:S.tsel===k}))}]});
    K.onDock((k,v)=>{if(k==="sp"){S.ox[v].run=true;S.ox[v].t=0}else if(k==="ors"){for(const q of ["kk","o2"])S.ox[q]={t:0,run:false}}
      else if(k==="light")S.kk.ph=1;else if(k==="cup"){S.kk.ph=2;S.kk.t=0}else if(k==="krs"){S.kk={ph:0,t:0}}
      else if(k==="tk"){S.tsel=v;if(!S.tp[v]){S.tp[v]=1;const q=KIND[v];api.record({tn:`Mô hình 100 phân tử: ${q.t}`,ht:`${q.n} / 100 hạt`,kl:`chiếm ${q.pct} thể tích không khí`})}}refresh()});
    /* nhãn */
    K.label("Bình không khí",[OXX-.38,.74,-.1],{view:"ox",dir:"nw",len:24});K.label("Bình oxygen",[OXX+.38,.74,-.1],{view:"ox",dir:"ne",len:24});K.label("Que đóm còn tàn đỏ",()=>[JAR.o2.x-.02+Math.sin(.12)*-.3,JAR.o2.sp.pos[1]+.32,0],{view:"ox",dir:"ne",len:26});
    K.label("Cốc thủy tinh (chia 5 phần)",()=>[CR,cup.pos[1]+.75,0],{view:"kk",dir:"ne",len:26});K.label("Nến",[0,.33,.03],{view:"kk",dir:"w",len:70});K.label("Chậu nước",[.5,.12,.2],{view:"kk",dir:"se",len:20});
    K.label("1/5",()=>S.kk.ph>=2&&cup.pos[1]<CB+.01?[-CR,MK[0],0]:[-99,-99,-99],{view:"kk",dir:"w",len:26});
    K.label("Mô hình 100 phân tử không khí",[TPX,BW+.05,0],{view:"tp",dir:"n",len:16});
    function pie(){const W=150,r=52,cx=75,cy=60;let a0=-Math.PI/2,out="";for(const k in KIND){const f=KIND[k].n/100,a1=a0+f*6.283;const lg=f>.5?1:0;
        out+=`<path d="M${cx},${cy} L${(cx+r*Math.cos(a0)).toFixed(1)},${(cy+r*Math.sin(a0)).toFixed(1)} A${r},${r} 0 ${lg} 1 ${(cx+r*Math.cos(a1)).toFixed(1)},${(cy+r*Math.sin(a1)).toFixed(1)} Z" fill="${KIND[k].c}" opacity="${S.tsel&&S.tsel!==k?.35:1}"/>`;a0=a1}
      return `<svg viewBox="0 0 ${W} 120" width="150" style="display:block;margin:4px 0">${out}</svg>`}
    K.infoFn(()=>{const v=K.view;if(v==="ox"){const O=S.ox;return `<div><b>Que đóm còn tàn đỏ</b></div><div>Bình không khí: ${O.kk.t>=1?"tàn đỏ lụi dần":O.kk.run?"đang thử…":"chưa thử"}</div><div>Bình oxygen: ${O.o2.t>=1?"bùng cháy":O.o2.run?"đang thử…":"chưa thử"}</div>`}
      if(v==="kk"){const P=S.kk;return `<div><b>Nến trong cốc úp</b></div><small>${P.ph===0?"Châm nến rồi úp cốc lên.":P.ph===1?"Nến đang cháy trong không khí.":P.ph===2?(P.t<4.6?"Cốc đã úp, nến cháy yếu dần…":"Nến tắt, nước dâng dần vào cốc…"):"Nước dâng lên khoảng 1/5 cột không khí trong cốc."}</small>`}
      return `<div><b>Thành phần không khí</b> (theo thể tích)</div>${pie()}<small><span style="color:#3B82F6">■</span> Nitrogen ≈ 78 % · <span style="color:#EF4444">■</span> Oxygen ≈ 21 % · <span style="color:#A3A3A3">■</span> Khí khác ≈ 1 % (hơi nước, carbon dioxide, khí hiếm…)</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"sp",v:"kk",p:()=>V3.add(JAR.kk.sp.pos,[0,.25,0]),tip:"Chạm: que đóm vào bình không khí",view:"ox"},{k:"sp",v:"o2",p:()=>V3.add(JAR.o2.sp.pos,[0,.25,0]),tip:"Chạm: que đóm vào bình oxygen",view:"ox"},{k:"light",p:[0,.47,0],tip:"Chạm để châm nến",view:"kk"},{k:"cup",p:()=>[0,cup.pos[1]+.75,0],tip:"Chạm để úp cốc lên nến",view:"kk"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const q of ["kk","o2"]){S.ox[q].run=true;S.ox[q].t=.999}S.kk.ph=2;S.kk.t=7.99;K.goView("tp");for(const k in KIND)K._dockH("tk",k);K.goView("ox")}};
    return K.mount(st)}
});
})();
