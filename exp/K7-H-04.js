/* K7-H-04 · Liên kết ion và liên kết cộng hóa trị (SGK KHTN 7 – Kết nối tri thức, Bài 6) · mô hình 2D
   Mô hình Bohr của nguyên tử; electron của mỗi nguyên tử tô một màu để thấy electron đi về đâu.
   - Liên kết ion: Na (2, 8, 1) nhường 1 electron cho Cl (2, 8, 7) → Na⁺ (2, 8) và Cl⁻ (2, 8, 8), hai ion trái dấu hút nhau.
     Mg (2, 8, 2) nhường 2 electron cho O (2, 6) → Mg²⁺ và O²⁻.
   - Liên kết cộng hóa trị: H₂ – mỗi nguyên tử H góp 1 electron tạo một cặp electron dùng chung;
     H₂O – nguyên tử O góp chung với mỗi nguyên tử H một cặp electron.
   Sau khi liên kết, mỗi nguyên tử/ion có lớp electron ngoài cùng giống khí hiếm (He, Ne, Ar). */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const EX={
  nacl:{ten:"Sodium chloride (NaCl)",loai:"ion",steps:["Na nhường 1 electron cho Cl","Hai ion trái dấu hút nhau"],
    kq:"Na (2, 8, 1) nhường 1e → Na⁺ (2, 8) giống Ne; Cl (2, 8, 7) nhận 1e → Cl⁻ (2, 8, 8) giống Ar; Na⁺ và Cl⁻ hút nhau bằng lực hút tĩnh điện → liên kết ion."},
  mgo:{ten:"Magnesium oxide (MgO)",loai:"ion",steps:["Mg nhường 2 electron cho O","Hai ion trái dấu hút nhau"],
    kq:"Mg (2, 8, 2) nhường 2e → Mg²⁺ (2, 8) giống Ne; O (2, 6) nhận 2e → O²⁻ (2, 8) giống Ne; Mg²⁺ và O²⁻ hút nhau → liên kết ion."},
  h2:{ten:"Hydrogen (H₂)",loai:"cht",steps:["Hai nguyên tử H tiến lại gần nhau","Mỗi H góp 1 electron tạo cặp electron dùng chung"],
    kq:"Mỗi nguyên tử H góp 1 electron tạo 1 cặp electron dùng chung; mỗi H có 2 electron ở lớp ngoài như He → liên kết cộng hóa trị."},
  h2o:{ten:"Nước (H₂O)",loai:"cht",steps:["Hai nguyên tử H tiến lại gần nguyên tử O","O góp chung với mỗi H một cặp electron"],
    kq:"O (2, 6) góp chung 1 cặp electron với mỗi H → O có 8 electron lớp ngoài như Ne, mỗi H có 2 electron như He; có 2 liên kết cộng hóa trị O – H."}};
const KEYS=["nacl","mgo","h2","h2o"];
const SPEC={
  predict:[{id:"p1",q:"Vì sao các nguyên tử khí hiếm (He, Ne, Ar) hầu như không liên kết với nguyên tử khác?",opts:[["ok","Lớp electron ngoài cùng đã bền vững (He: 2, các khí hiếm khác: 8 electron)"],["nang","Vì chúng quá nặng"],["kl","Vì chúng là kim loại"]],ans:"ok",res:"Kết quả: các nguyên tử khác có xu hướng nhường, nhận hoặc góp chung electron để đạt lớp ngoài cùng giống khí hiếm."},
    {id:"p2",q:"Khi tạo liên kết với Cl, nguyên tử Na sẽ:",opts:[["nh","Nhường 1 electron"],["nn","Nhận 7 electron"],["gc","Góp chung electron"]],ans:"nh",res:"Kết quả: Na nhường 1 electron lớp ngoài cùng trở thành ion Na⁺."}],
  taskLead:"Chọn ví dụ ở khay, bấm “Bước tiếp” để xem electron di chuyển. Màu electron cho biết electron đến từ nguyên tử nào.",
  tasks:[{html:"<b>Liên kết ion:</b> xem hết các bước của NaCl và MgO.",done:()=>S.done.nacl&&S.done.mgo},{html:"<b>Liên kết cộng hóa trị:</b> xem hết các bước của H₂ và H₂O.",done:()=>S.done.h2&&S.done.h2o}],
  obs:[{id:"a",q:"Liên kết ion được hình thành do:",opts:[["ok","Lực hút giữa các ion mang điện tích trái dấu"],["cap","Cặp electron dùng chung"],["nt","Nguyên tử khí hiếm"]],ans:"ok",why:"Ion dương tạo ra khi nguyên tử nhường electron, ion âm khi nhận electron."},
    {id:"b",q:"Trong phân tử H₂O có:",opts:[["ok","2 cặp electron dùng chung giữa O và 2 nguyên tử H"],["ion","Ion H⁺ và O²⁻"],["1","1 cặp electron dùng chung"]],ans:"ok",why:"Nước là hợp chất cộng hóa trị."},
    {id:"c",q:"Hợp chất ion thường ở thể nào ở điều kiện thường?",opts:[["ran","Rắn"],["khi","Khí"],["long","Lỏng"]],ans:"ran",why:"Ví dụ muối ăn NaCl là chất rắn, nhiệt độ nóng chảy cao."}],
  concl:{html:`<ul class="tlist"><li>Nguyên tử các nguyên tố có xu hướng tạo liên kết để có lớp electron ngoài cùng bền vững giống khí hiếm.</li>
    <li><b>Liên kết ion</b>: hình thành do lực hút giữa các ion mang điện tích trái dấu; thường giữa kim loại (nhường electron) và phi kim (nhận electron). Ví dụ: NaCl, MgO.</li>
    <li><b>Liên kết cộng hóa trị</b>: hình thành do các nguyên tử góp chung electron (cặp electron dùng chung); thường giữa các phi kim. Ví dụ: H₂, H₂O, Cl₂, CO₂.</li>
    <li>Hợp chất ion thường là chất rắn ở điều kiện thường; hợp chất cộng hóa trị có thể ở thể rắn, lỏng hoặc khí.</li></ul>`,
    quiz:[{id:"q1",q:"Ion được tạo ra khi nguyên tử Mg nhường 2 electron là:",opts:[["a","Mg²⁺"],["b","Mg²⁻"],["c","Mg⁺"]],ans:"a",why:{b:"Nhường electron (mang điện âm) → ion dương.",c:"Nhường 2 electron → điện tích 2+."}},
      {id:"q2",q:"Trong phân tử Cl₂, hai nguyên tử Cl liên kết với nhau bằng:",opts:[["a","Một cặp electron dùng chung"],["b","Lực hút giữa Cl⁺ và Cl⁻"],["c","Hai cặp electron dùng chung"]],ans:"a",why:{b:"Hai nguyên tử phi kim giống nhau không nhường – nhận electron.",c:"Mỗi Cl cần thêm 1 electron → góp chung 1 cặp."}}],
    done:`<h2>Hoàn thành: liên kết ion và liên kết cộng hóa trị</h2><p class="muted">Nhường – nhận electron tạo ion hút nhau; góp chung electron tạo cặp electron dùng chung.</p>`},
  gv:["Cho học sinh đếm electron lớp ngoài cùng trước và sau mỗi bước.","Hỏi: ion Na⁺ có cấu hình electron giống khí hiếm nào?","Mở rộng: viết sơ đồ hình thành liên kết trong Cl₂, CO₂."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 6)</p><ul class="tlist"><li>Nêu được mô hình sắp xếp electron trong vỏ nguyên tử khí hiếm; sự tạo thành liên kết ion, liên kết cộng hóa trị theo nguyên tắc dùng chung electron hoặc nhường – nhận electron để tạo lớp vỏ bền như khí hiếm; chỉ ra được sự khác nhau về một số tính chất của chất ion và chất cộng hóa trị.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 6 Giới thiệu về liên kết hóa học.</li>
<li>Liên kết ion, liên kết cộng hóa trị: <a href="https://openstax.org/books/chemistry-2e/pages/7-1-ionic-bonding" target="_blank" rel="noopener">OpenStax Chemistry 2e, mục 7.1</a> và <a href="https://openstax.org/books/chemistry-2e/pages/7-2-covalent-bonding" target="_blank" rel="noopener">mục 7.2</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Dùng mô hình Bohr (electron trên các vòng tròn) như SGK; kích thước nguyên tử, ion không theo tỉ lệ thật. Hai màu electron chỉ để phân biệt nguồn gốc; mọi electron đều giống nhau.</li></ul>`;

let S;
LabKHTN.register("K7-H-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"chat",t:"Chất"},{k:"loai",t:"Loại liên kết"},{k:"kq",t:"Sự hình thành liên kết"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô hình hình thành liên kết ion và liên kết cộng hóa trị",views:{ion:{label:"Liên kết ion",icon:IC.bolt,frame:[40,50,920,560]},cht:{label:"Liên kết cộng hóa trị",icon:IC.dna,frame:[40,50,920,560]}}});
    S={ex:{ion:"nacl",cht:"h2"},st:{nacl:0,mgo:0,h2:0,h2o:0},t:1,done:{},recs:0};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const EA="#3B82F6",EB="#F97316";
    const ease=t=>t*t*(3-2*t);
    const RS=[36,68,100];
    function eball(ctx,x,y,c){const g=ctx.createRadialGradient(x-2,y-2,1,x,y,8);g.addColorStop(0,"#FFFFFF");g.addColorStop(.35,c);g.addColorStop(1,C.mix(c,"#000000",.4));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,7.5,0,6.283);ctx.fill();T(ctx,"−",x,y+4.5,11,"#fff")}
    function nucleus(ctx,x,y,sym,Z,col){const g=ctx.createRadialGradient(x-5,y-5,2,x,y,19);g.addColorStop(0,C.mix(col,"#FFFFFF",.4));g.addColorStop(1,C.mix(col,"#000000",.3));ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,18,0,6.283);ctx.fill();T(ctx,sym,x,y+1,14,"#fff");T(ctx,`+${Z}`,x,y+13,9.5,"#fff","center",700)}
    function rings(ctx,x,y,n,a){ctx.save();ctx.globalAlpha=a==null?1:a;ctx.strokeStyle=C.rgba("#93C5FD",.4);ctx.lineWidth=1.4;ctx.setLineDash([4,5]);for(let i=0;i<n;i++){ctx.beginPath();ctx.arc(x,y,RS[i],0,6.283);ctx.stroke()}ctx.setLineDash([]);ctx.restore()}
    /* vị trí electron trên lớp: lớp trong chia đều; lớp ngoài theo từng cặp ở 4 hướng (kiểu Lewis) */
    const LEW=[0,Math.PI/2,Math.PI,Math.PI*1.5];
    function epos(x,y,i,j,n,outer,rot){const r=RS[i];if(!outer||n<=2&&i===0){const a=(rot||0)+j/n*6.283+(i===0?Math.PI/2:0);return[x+Math.cos(a)*r,y+Math.sin(a)*r]}
      const slot=j%4,second=j>=4;const a=(rot||0)+LEW[slot]+(n>4||second?(second?.2:-.2):0);return[x+Math.cos(a)*r,y-Math.sin(a)*r]}
    function shellE(ctx,x,y,sh,col,skip,rot){sh.forEach((k,i)=>{for(let j=0;j<k;j++){if(skip&&skip(i,j))continue;const p=epos(x,y,i,j,k,i===sh.length-1,rot);eball(ctx,p[0],p[1],col)}})}
    const charge=(ctx,x,y,t,c)=>{ctx.save();ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,13,0,6.283);ctx.fill();T(ctx,t,x,y+5,13,"#fff");ctx.restore()};
    const bez=(a,b,h,t)=>{const m=[(a[0]+b[0])/2,(a[1]+b[1])/2-h];const u=1-t;return[u*u*a[0]+2*u*t*m[0]+t*t*b[0],u*u*a[1]+2*u*t*m[1]+t*t*b[1]]};
    /* ---------- liên kết ion ---------- */
    function ionGeo(){const k=S.ex.ion,s=S.st[k],t=ease(S.t);const gap=s<2?400:400-170*t;return{ax:500-gap/2,bx:500+gap/2}}
    function drawIon(ctx,P){const k=S.ex.ion,s=S.st[k],t=ease(S.t);const nacl=k==="nacl";
      const A={sym:nacl?"Na":"Mg",Z:nacl?11:12,sh:nacl?[2,8,1]:[2,8,2],col:"#8B5CF6"},B={sym:nacl?"Cl":"O",Z:nacl?17:8,sh:nacl?[2,8,7]:[2,6],col:nacl?"#22C55E":"#EF4444"};const nt=nacl?1:2;
      const {ax,bx}=ionGeo();const y=300;
      const moved=s>=1?(s===1?t:1):0;   /* tiến trình electron chuyển */
      rings(ctx,ax,y,A.sh.length,1-moved*(1));rings(ctx,ax,y,A.sh.length-1);rings(ctx,bx,y,B.sh.length);
      nucleus(ctx,ax,y,A.sym,A.Z,A.col);nucleus(ctx,bx,y,B.sym,B.Z,B.col);
      const ia=A.sh.length-1,ib=B.sh.length-1;
      shellE(ctx,ax,y,A.sh,EA,(i,j)=>i===ia);shellE(ctx,bx,y,B.sh,EB);
      for(let j=0;j<nt;j++){const from=epos(ax,y,ia,j,A.sh[ia],true);const to=epos(bx,y,ib,B.sh[ib]+j,B.sh[ib]+nt,true);const p=moved<1?bez(from,to,90+j*30,moved):to;eball(ctx,p[0],p[1],EA)}
      if(moved>=1){charge(ctx,ax+RS[A.sh.length-2]*.75,y-RS[A.sh.length-2]*.75-10,nacl?"+":"2+","#7C3AED");charge(ctx,bx+RS[ib]*.75,y-RS[ib]*.75-10,nacl?"−":"2−","#B91C1C")}
      T(ctx,moved>=1?`${A.sym}${nacl?"⁺":"²⁺"} (${A.sh.slice(0,-1).join(", ")}) – giống Ne`:`${A.sym} (${A.sh.join(", ")})`,ax,y+150,17,P.ink);
      const bsh=B.sh.slice();if(moved>=1)bsh[ib]+=nt;T(ctx,moved>=1?`${B.sym}${nacl?"⁻":"²⁻"} (${bsh.join(", ")}) – giống ${nacl?"Ar":"Ne"}`:`${B.sym} (${B.sh.join(", ")})`,bx,y+150,17,P.ink);
      if(s>=2){ctx.save();ctx.strokeStyle=K.day?"#B45309":"#FCD34D";ctx.lineWidth=2;ctx.setLineDash([6,5]);const xa=ax+RS[A.sh.length-2]+6,xb=bx-RS[ib]-6;const hc=K.day?"#B45309":"#FCD34D";D2.arrow(ctx,ax-10,y-128,ax+60,y-128,hc,3,12);D2.arrow(ctx,bx+10,y-128,bx-60,y-128,hc,3,12);ctx.restore();
        T(ctx,"Lực hút tĩnh điện giữa hai ion trái dấu",500,y-146,16,hc)}
      legend(ctx,P,A.sym,B.sym);stepBar(ctx,P,k)}
    /* ---------- liên kết cộng hóa trị ---------- */
    function drawCov(ctx,P){const k=S.ex.cht,s=S.st[k],t=ease(S.t);const app=s>=1?(s===1?t:1):0,sh=s>=2?(s===2?t:1):0;const y=300;
      if(k==="h2"){const d=300-240*app,ax=500-d/2,bx=500+d/2;rings(ctx,ax,y,1);rings(ctx,bx,y,1);nucleus(ctx,ax,y,"H",1,"#64748B");nucleus(ctx,bx,y,"H",1,"#64748B");
        const fa=[ax+RS[0],y],fb=[bx-RS[0],y];const ma=[500,y-9],mb=[500,y+9];const pa=sh?[fa[0]+(ma[0]-fa[0])*sh,fa[1]+(ma[1]-fa[1])*sh]:fa,pb=sh?[fb[0]+(mb[0]-fb[0])*sh,fb[1]+(mb[1]-fb[1])*sh]:fb;eball(ctx,pa[0],pa[1],EA);eball(ctx,pb[0],pb[1],EB);
        if(sh>=1){ctx.strokeStyle=K.day?"#B45309":"#FCD34D";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(500,y,16,24,0,0,6.283);ctx.stroke();T(ctx,"Cặp electron dùng chung",500,y-60,15,K.day?"#B45309":"#FCD34D");T(ctx,"H – H",500,y+120,20,P.ink);T(ctx,"Mỗi nguyên tử H có 2 electron ở lớp ngoài cùng, giống He",500,y+150,14,P.mut,"center",700)}
        legend(ctx,P,"H","H")}
      else{const ox=500,oy=y-20,ang=52.25*Math.PI/180;const L=110-34*app;const H=[[ox-Math.sin(ang)*L*1.6,oy+Math.cos(ang)*L*1.6],[ox+Math.sin(ang)*L*1.6,oy+Math.cos(ang)*L*1.6]].map(p=>[ox+(p[0]-ox)*(L/110)/1.6*1.6,oy+(p[1]-oy)*(L/110)]);
        const Hp=[0,1].map(i=>{const sg=i?1:-1;const dist=180-84*app;return[ox+sg*Math.sin(ang)*dist,oy+Math.cos(ang)*dist]});
        rings(ctx,ox,oy,2);nucleus(ctx,ox,oy,"O",8,"#EF4444");Hp.forEach(p=>{rings(ctx,p[0],p[1],1);nucleus(ctx,p[0],p[1],"H",1,"#64748B")});
        /* electron O: lớp 1 (2), lớp 2 (6): 4 electron không liên kết ở phía trên, 2 electron hướng về phía H */
        shellE(ctx,ox,oy,[2],EA);
        const up=[[-.35,1],[-.15,1],[.15,1],[.35,1]].map(([a])=>{const aa=Math.PI/2+a*2.2;return[ox+Math.cos(aa)*RS[1],oy-Math.sin(aa)*RS[1]]});up.forEach(p=>eball(ctx,p[0],p[1],EA));
        Hp.forEach((p,i)=>{const sg=i?1:-1;const dir=[sg*Math.sin(ang),Math.cos(ang)];const oE=[ox+dir[0]*RS[1],oy+dir[1]*RS[1]],hE=[p[0]-dir[0]*RS[0],p[1]-dir[1]*RS[0]];
          const mid=[(ox+p[0])/2+dir[0]*14,(oy+p[1])/2+dir[1]*14];const nrm=[-dir[1],dir[0]];const m1=[mid[0]+nrm[0]*9,mid[1]+nrm[1]*9],m2=[mid[0]-nrm[0]*9,mid[1]-nrm[1]*9];
          const po=sh?[oE[0]+(m1[0]-oE[0])*sh,oE[1]+(m1[1]-oE[1])*sh]:oE,ph=sh?[hE[0]+(m2[0]-hE[0])*sh,hE[1]+(m2[1]-hE[1])*sh]:hE;eball(ctx,po[0],po[1],EA);eball(ctx,ph[0],ph[1],EB);
          if(sh>=1){ctx.strokeStyle=K.day?"#B45309":"#FCD34D";ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(mid[0],mid[1],15,24,Math.atan2(dir[1],dir[0])+Math.PI/2,0,6.283);ctx.stroke()}});
        if(sh>=1){T(ctx,"2 cặp electron dùng chung",ox,oy+175,15,K.day?"#B45309":"#FCD34D");T(ctx,"H – O – H",ox,oy+205,19,P.ink);T(ctx,"O có 8 electron lớp ngoài (giống Ne); mỗi H có 2 electron (giống He)",ox,oy+232,14,P.mut,"center",700)}
        legend(ctx,P,"O","H")}
      stepBar(ctx,P,k)}
    function legend(ctx,P,a,b){eball(ctx,70,590,EA);T(ctx,`electron của ${a}`,84,595,13,P.mut,"left",700);eball(ctx,230,590,EB);T(ctx,`electron của ${b}`,244,595,13,P.mut,"left",700)}
    function stepBar(ctx,P,k){const E=EX[k],s=S.st[k];D2.block(ctx,60,60,880,48,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,E.ten,80,90,16,P.ink,"left");
      E.steps.forEach((t,i)=>{const done=s>i;T(ctx,`${i+1}. ${t}`,360+i*300,90,13,done?(K.day?"#047857":"#6EE7B7"):P.mut,"left",700)})}
    /* thao tác tay: kéo electron lớp ngoài sang nguyên tử kia, kéo hai nguyên tử / hai ion lại gần nhau */
    function grab(){const v=K.view,k=S.ex[v],st=S.st[k];if(S.t<1)return null;
      if(v==="ion"){const nacl=k==="nacl",sh=nacl?[2,8,1]:[2,8,2],{ax,bx}=ionGeo();if(st===0){const ia=sh.length-1;return{k:"e",from:epos(ax,300,ia,0,sh[ia],true),to:[bx,300],r:28}}
        if(st===1)return{k:"atom",from:[ax,300],to:[bx,300],r:70};return null}
      if(st===0){if(k==="h2")return{k:"atom",from:[350,300],to:[500,300],r:60};const ang=52.25*Math.PI/180;return{k:"atom",from:[500-Math.sin(ang)*180,280+Math.cos(ang)*180],to:[500,280],r:55}}
      if(st===1){if(k==="h2")return{k:"e",from:[500-30+RS[0],300],to:[500,300],r:28};return{k:"e",from:[500,280],to:[500,280],r:120,tap:true}}return null}
    K.pickFn(q=>{const g=grab();if(!g)return null;return Math.hypot(q[0]-g.from[0],q[1]-g.from[1])<g.r?{drag:true,g}:null});
    K.dragFn((ph,o,q)=>{const g=o.g;if(ph==="start"){S.dg={x:q[0],y:q[1],g};return}if(ph==="move"){if(S.dg){S.dg.x=q[0];S.dg.y=q[1]}return}
      const d0=Math.hypot(g.to[0]-g.from[0],g.to[1]-g.from[1]),d1=Math.hypot(g.to[0]-q[0],g.to[1]-q[1]);S.dg=null;if(ph==="end"&&(g.tap||d1<d0*.6||d1<60))K._dockH("next")});
    K.drawFn((ctx,P)=>{K.view==="ion"?drawIon(ctx,P):drawCov(ctx,P);const d=S.dg;if(d&&!d.g.tap){ctx.save();if(d.g.k==="e"){ctx.globalAlpha=.9;eball(ctx,d.x,d.y,EA)}else{ctx.globalAlpha=.55;ctx.strokeStyle=K.day?"#334155":"#E2E8F0";ctx.setLineDash([6,6]);ctx.lineWidth=2;ctx.beginPath();ctx.arc(d.x,d.y,48,0,6.283);ctx.stroke()}
      ctx.globalAlpha=.8;ctx.setLineDash([4,6]);ctx.strokeStyle=K.day?"#B45309":"#FCD34D";ctx.beginPath();ctx.moveTo(d.g.from[0],d.g.from[1]);ctx.lineTo(d.x,d.y);ctx.stroke();ctx.restore()}});
    K.label("Hạt nhân",()=>[ionGeo().ax-6,306],{view:"ion",dir:"sw",len:80});
    K.label("Lớp electron",()=>{const g=ionGeo();return[g.bx+RS[2]*.71,300-RS[2]*.71]},{view:"ion",dir:"ne",len:30});
    K.onFrame(dt=>{if(S.t<1){S.t=Math.min(1,S.t+dt/1.6);if(S.t>=1)K.updateInfo(true)}});
    const cur=()=>S.ex[K.view];
    K.dockFn(()=>{const v=K.view,k=cur(),E=EX[k],s=S.st[k];const ex=v==="ion"?["nacl","mgo"]:["h2","h2o"];
      return[{grid:ex.map(x=>({k:"ex",v:x,label:x==="nacl"?"NaCl":x==="mgo"?"MgO":x==="h2"?"H₂":"H₂O",icon:"",on:x===k}))},{k:"next",label:s<E.steps.length?`Bước ${s+1}: ${E.steps[s]}`:"Đã xong",icon:IC.step,dis:s>=E.steps.length||S.t<1},{k:"rs",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{const vw=K.view;if(k==="ex"){S.ex[vw]=v;S.t=1}else if(k==="next"){const x=cur(),E=EX[x];if(S.st[x]<E.steps.length&&S.t>=1){S.st[x]++;S.t=0;if(S.st[x]===E.steps.length&&!S.done[x]){S.done[x]=1;api.record({chat:E.ten,loai:E.loai==="ion"?"Liên kết ion":"Liên kết cộng hóa trị",kq:E.kq})}}}
      else if(k==="rs"){S.st[cur()]=0;S.t=1}refresh()});
    K.infoFn(()=>{const k=cur(),E=EX[k],s=S.st[k];return `<div><b>${E.ten}</b> · ${E.loai==="ion"?"liên kết ion":"liên kết cộng hóa trị"}</div><div>Bước ${Math.min(s,E.steps.length)}/${E.steps.length}</div>${s>=E.steps.length?`<small>${E.kq}</small>`:"<small>Kéo electron lớp ngoài sang nguyên tử kia, kéo hai nguyên tử lại gần nhau, hoặc bấm “Bước tiếp” ở khay.</small>"}`});
    K.timeLabel(()=>EX[cur()].ten);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const [v,ks] of [["ion",["nacl","mgo"]],["cht",["h2","h2o"]]]){K.goView(v);for(const x of ks){K._dockH("ex",x);for(let i=0;i<2;i++){S.t=1;K._dockH("next")}}}S.t=1}};
    return K.mount(st)}
});
})();
