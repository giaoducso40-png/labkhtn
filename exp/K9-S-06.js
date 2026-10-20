/* K9-S-06 · NST giới tính, cơ chế xác định giới tính; di truyền liên kết (SGK KHTN 9 – Kết nối tri thức, Bài 44–45) · 2D
   1. Người: nữ 44A + XX, nam 44A + XY. Mẹ cho một loại trứng (22A + X), bố cho hai loại tinh trùng (22A + X và 22A + Y) với tỉ lệ ngang nhau
      → tỉ lệ con trai : con gái xấp xỉ 1 : 1. Học sinh “sinh” ngẫu nhiên nhiều con và đếm.
   2. Thí nghiệm của Morgan ở ruồi giấm: P thân xám, cánh dài × thân đen, cánh cụt → F1 100% thân xám, cánh dài.
      Lai phân tích ruồi đực F1 (BV/bv) với ruồi cái thân đen, cánh cụt (bv/bv) → 1 xám, dài : 1 đen, cụt (gene B và V cùng nằm trên một NST,
      ở ruồi đực không xảy ra trao đổi chéo). So sánh với kết quả dự đoán nếu hai gene phân li độc lập (1 : 1 : 1 : 1). */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const SPEC={
  predict:[{id:"p1",q:"Ở người, giới tính của con do yếu tố nào quyết định?",opts:[["tt","Loại tinh trùng (mang X hay Y) thụ tinh với trứng"],["trung","Loại trứng của mẹ"],["mt","Chế độ ăn của mẹ"]],ans:"tt",res:"Kết quả: trứng luôn mang X; tinh trùng mang X hoặc Y. Tinh trùng Y thụ tinh → con trai (XY)."},
    {id:"p2",q:"Lai phân tích ruồi đực F1 thân xám, cánh dài. Nếu hai gene nằm trên hai NST khác nhau, Fa có tỉ lệ:",opts:[["4","1 : 1 : 1 : 1"],["2","1 : 1"],["31","3 : 1"]],ans:"4",res:"Kết quả thực nghiệm của Morgan: chỉ 1 : 1 → hai gene cùng nằm trên một NST (liên kết gene)."}],
  taskLead:"Chọn phần ở khay. Mỗi lần bấm, con sinh ra được chọn ngẫu nhiên theo loại giao tử.",
  tasks:[{html:"<b>Giới tính:</b> sinh ít nhất 100 con và tính tỉ lệ trai : gái.",done:()=>S.g.n>=100},
    {html:"<b>Morgan:</b> lai P tạo F1.",done:()=>S.m.f1},
    {html:"<b>Lai phân tích:</b> tạo ít nhất 100 ruồi Fa.",done:()=>S.m.fa.n>=100},
    {html:"<b>So sánh:</b> xem kết quả dự đoán nếu hai gene phân li độc lập.",done:()=>!!S.m.seenInd}],
  obs:[{id:"a",q:"Tỉ lệ con trai : con gái xấp xỉ 1 : 1 vì:",opts:[["ok","Bố tạo hai loại tinh trùng X và Y với tỉ lệ ngang nhau, khả năng thụ tinh như nhau"],["me","Mẹ tạo hai loại trứng"],["nn","Do ngẫu nhiên, không có nguyên nhân"]],ans:"ok",why:"Mẹ (XX) chỉ tạo một loại trứng mang X."},
    {id:"b",q:"Kết quả Fa 1 xám, dài : 1 đen, cụt chứng tỏ:",opts:[["ok","Gene quy định màu thân và gene quy định độ dài cánh cùng nằm trên một NST, di truyền cùng nhau"],["dl","Hai gene phân li độc lập"],["gt","Hai gene nằm trên NST giới tính"]],ans:"ok",why:"F1 chỉ tạo hai loại giao tử BV và bv."},
    {id:"c",q:"Di truyền liên kết có ý nghĩa:",opts:[["ok","Các tính trạng tốt do các gene trên cùng một NST được di truyền cùng nhau, ứng dụng trong chọn giống"],["bd","Tạo nhiều biến dị tổ hợp"],["k","Không có ý nghĩa"]],ans:"ok",why:"Liên kết gene hạn chế xuất hiện biến dị tổ hợp, đảm bảo sự di truyền bền vững của từng nhóm tính trạng."}],
  concl:{html:`<ul class="tlist"><li>Trong tế bào lưỡng bội có các <b>NST thường</b> và một cặp <b>NST giới tính</b>. Ở người: nữ 44A + XX, nam 44A + XY.</li>
    <li>Cơ chế xác định giới tính ở người: mẹ tạo một loại trứng (X), bố tạo hai loại tinh trùng (X và Y) tỉ lệ 1 : 1; trứng X + tinh trùng X → con gái (XX), trứng X + tinh trùng Y → con trai (XY). Tỉ lệ trai : gái xấp xỉ 1 : 1.</li>
    <li><b>Di truyền liên kết</b> là hiện tượng một nhóm tính trạng được di truyền cùng nhau do các gene quy định chúng cùng nằm trên một NST và cùng phân li trong phân bào.</li>
    <li>Morgan: lai phân tích ruồi đực F1 (BV/bv) cho Fa 1 xám, dài : 1 đen, cụt thay vì 1 : 1 : 1 : 1.</li></ul>`,
    quiz:[{id:"q1",q:"Một cặp vợ chồng đã có hai con gái. Xác suất người con thứ ba là con trai:",opts:[["a","1/2"],["b","1/3"],["c","1"]],ans:"a",why:{b:"Mỗi lần sinh là độc lập, xác suất con trai luôn xấp xỉ 1/2.",c:"Các lần sinh độc lập nhau."}},
      {id:"q2",q:"Ruồi đực F1 BV/bv (liên kết hoàn toàn) tạo các loại giao tử:",opts:[["a","BV và bv"],["b","BV, Bv, bV, bv"],["c","Chỉ BV"]],ans:"a",why:{b:"Bốn loại giao tử chỉ có khi phân li độc lập hoặc có trao đổi chéo.",c:"F1 dị hợp, tạo hai loại giao tử."}}],
    done:`<h2>Hoàn thành: NST giới tính, di truyền liên kết</h2><p class="muted">Tỉ lệ trai : gái ≈ 1 : 1; gene trên cùng một NST di truyền cùng nhau.</p>`},
  gv:["Gộp số liệu cả lớp để thấy tỉ lệ trai : gái tiến gần 1 : 1 khi số lần sinh lớn.","Hỏi: vì sao ở ruồi đực F1 không xuất hiện thân xám, cánh cụt?","Lưu ý: ở ruồi cái có thể xảy ra trao đổi chéo (hoán vị gene) – kiến thức mở rộng."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 44, 45)</p><ul class="tlist"><li>Nêu được khái niệm NST giới tính, NST thường; trình bày được cơ chế xác định giới tính ở người; nêu được khái niệm di truyền liên kết, ý nghĩa của di truyền liên kết.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 44 Nhiễm sắc thể giới tính và cơ chế xác định giới tính; Bài 45 Di truyền liên kết.</li>
<li>Liên kết gene và thí nghiệm của Morgan ở ruồi giấm: <a href="https://openstax.org/books/biology-2e/pages/13-1-chromosomal-theory-and-genetic-linkage" target="_blank" rel="noopener">OpenStax Biology 2e, mục 13.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Mỗi con sinh ra được chọn ngẫu nhiên với xác suất 1/2 cho mỗi loại giao tử của bố; không mô phỏng các yếu tố sinh học khác ảnh hưởng tới tỉ lệ giới tính khi sinh. Ruồi đực F1 được giả định liên kết hoàn toàn. Hình ruồi là hình vẽ mô phỏng.</li></ul>`;

let S;
LabKHTN.register("K9-S-06",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"pl",t:"Phép lai"},{k:"kq",t:"Kết quả"},{k:"tl",t:"Tỉ lệ"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng cơ chế xác định giới tính ở người và thí nghiệm di truyền liên kết của Morgan",views:{gt:{label:"Xác định giới tính",icon:IC.dna,frame:[30,30,940,580]},lk:{label:"Di truyền liên kết",icon:IC.grid,frame:[30,30,940,580]}}});
    const rnd=Math.random;
    S={g:{n:0,boy:0,last:[],anim:0},m:{f1:false,mode:"lk",fa:{n:0,c:[0,0,0,0],flies:[]},seenInd:false},recs:0};
    const rec=(pl,kq,tl)=>{S.recs++;api.record({lan:String(S.recs),pl,kq,tl})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const HI=()=>K.day?"#B45309":"#FCD34D";
    /* NST: thân bo tròn, eo ở tâm động, vân ngang */
    function chrom(ctx,x,y,len,w,col,cen,o){o=o||{};ctx.save();ctx.translate(x,y);if(o.rot)ctx.rotate(o.rot);const y0=-len*cen,y1=len*(1-cen);
      const g=ctx.createLinearGradient(-w,0,w,0);g.addColorStop(0,C.mix(col,"#000000",.25));g.addColorStop(.45,C.mix(col,"#FFFFFF",.25));g.addColorStop(1,C.mix(col,"#000000",.3));ctx.fillStyle=g;
      ctx.beginPath();ctx.moveTo(-w/2,y0+w/2);ctx.arc(0,y0+w/2,w/2,Math.PI,0);ctx.lineTo(w/2,-w*.3);ctx.quadraticCurveTo(w*.18,0,w/2,w*.3);ctx.lineTo(w/2,y1-w/2);ctx.arc(0,y1-w/2,w/2,0,Math.PI);ctx.lineTo(-w/2,w*.3);ctx.quadraticCurveTo(-w*.18,0,-w/2,-w*.3);ctx.closePath();ctx.fill();
      ctx.save();ctx.clip();ctx.fillStyle="rgba(0,0,0,.18)";for(let k=0;k<6;k++){const yy=y0+(k+.5)*(y1-y0)/6;if(Math.abs(yy)<w*.5)continue;ctx.fillRect(-w,yy-1.5,2*w,3+(k%2)*2)}ctx.restore();
      if(o.loci)for(const L of o.loci){const yy=y0+L.f*(y1-y0);ctx.fillStyle=L.c;ctx.fillRect(-w/2,yy-3,w,6);if(o.side<0)T(ctx,L.t,-w/2-8,yy+5,15,L.c,"right");else T(ctx,L.t,w/2+8,yy+5,15,L.c,"left")}
      if(o.label)T(ctx,o.label,0,y1+18,13,o.lc||"#fff");ctx.restore()}
    const XC="#E879A0",YC="#60A5FA",AC_="#94A3B8";
    /* tinh trùng, trứng */
    function sperm(ctx,x,y,s,lbl,c){ctx.save();ctx.translate(x,y);ctx.strokeStyle=C.rgba("#E2E8F0",.8);ctx.lineWidth=2*s;ctx.beginPath();for(let i=0;i<=20;i++){const u=i/20;const xx=-10*s-u*46*s,yy=Math.sin(u*9+K.simT*8)*4*s*u;i?ctx.lineTo(xx,yy):ctx.moveTo(xx,yy)}ctx.stroke();
      const g=ctx.createRadialGradient(-2*s,-3*s,1,0,0,12*s);g.addColorStop(0,"#FFFFFF");g.addColorStop(1,c);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,12*s,8.5*s,0,0,6.283);ctx.fill();T(ctx,lbl,0,5*s,12*s,"#0B1330");ctx.restore()}
    function egg(ctx,x,y,r,lbl){const g=ctx.createRadialGradient(x-r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,"#FFF7ED");g.addColorStop(.7,"#FBCFE8");g.addColorStop(1,"#F472B6");ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill();
      ctx.strokeStyle="rgba(244,114,182,.6)";ctx.lineWidth=4;ctx.beginPath();ctx.arc(x,y,r+4,0,6.283);ctx.stroke();ctx.fillStyle="rgba(190,24,93,.25)";ctx.beginPath();ctx.arc(x+r*.15,y,r*.36,0,6.283);ctx.fill();T(ctx,lbl,x,y+r+20,13,"#F9A8D4")}
    function kid(ctx,x,y,s,boy){ctx.save();ctx.translate(x,y);const c=boy?"#60A5FA":"#F472B6";ctx.fillStyle=C.mix(c,"#FFFFFF",.15);ctx.beginPath();ctx.arc(0,-14*s,7*s,0,6.283);ctx.fill();
      ctx.beginPath();if(boy){C.rr(ctx,-7*s,-6*s,14*s,16*s,4*s)}else{ctx.moveTo(-5*s,-6*s);ctx.lineTo(5*s,-6*s);ctx.lineTo(9*s,10*s);ctx.lineTo(-9*s,10*s);ctx.closePath()}ctx.fill();ctx.restore()}
    function drawGT(ctx,P){const Gg=S.g;
      T(ctx,"P:",70,96,18,P.ink,"left");
      /* mẹ, bố */
      T(ctx,"Mẹ: 44A + XX",250,62,16,"#F9A8D4");T(ctx,"Bố: 44A + XY",650,62,16,"#93C5FD");
      chrom(ctx,225,110,62,16,XC,.42,{label:"X"});chrom(ctx,262,110,62,16,XC,.42,{label:"X"});
      chrom(ctx,630,110,62,16,XC,.42,{label:"X"});chrom(ctx,668,96,26,14,YC,.3,{label:"Y"});T(ctx,"×",450,118,26,P.mut);
      T(ctx,"Giao tử:",70,236,15,P.ink,"left");
      egg(ctx,250,232,26,"Trứng 22A + X (100%)");sperm(ctx,600,224,1.1,"X","#FBCFE8");sperm(ctx,720,224,1.1,"Y","#BFDBFE");T(ctx,"Tinh trùng 22A + X",585,272,12.5,"#F9A8D4");T(ctx,"Tinh trùng 22A + Y",735,272,12.5,"#93C5FD");
      T(ctx,"50%",600,200,12,P.mut);T(ctx,"50%",720,200,12,P.mut);
      /* bảng tổ hợp */
      const tx=110,ty=310,cw=140,chh=46;ctx.strokeStyle=P.line;ctx.lineWidth=1.4;for(let i=0;i<=3;i++){ctx.beginPath();ctx.moveTo(tx+i*cw,ty);ctx.lineTo(tx+i*cw,ty+2*chh);ctx.stroke()}for(let j=0;j<=2;j++){ctx.beginPath();ctx.moveTo(tx,ty+j*chh);ctx.lineTo(tx+3*cw,ty+j*chh);ctx.stroke()}
      T(ctx,"♀ \\ ♂",tx+cw/2,ty+28,14,P.mut);T(ctx,"X",tx+cw*1.5,ty+29,17,"#F9A8D4");T(ctx,"Y",tx+cw*2.5,ty+29,17,"#93C5FD");T(ctx,"X",tx+cw/2,ty+chh+29,17,"#F9A8D4");
      T(ctx,"XX – con gái",tx+cw*1.5,ty+chh+29,15,"#F9A8D4");T(ctx,"XY – con trai",tx+cw*2.5,ty+chh+29,15,"#93C5FD");
      /* đàn con đã sinh */
      const ox=560,oy=320,cols=18,sz=21;D2.block(ctx,ox-12,oy-14,cols*sz+24,8*sz+30,12,"rgba(0,0,0,.14)","rgba(0,0,0,.14)",{shadow:false});
      const L=Gg.last;const Ls=L.slice(-144);for(let k=0;k<Ls.length;k++){const c=k%cols,r=Math.floor(k/cols);kid(ctx,ox+c*sz+sz/2,oy+r*sz+sz/2+6,.62,Ls[k])}
      T(ctx,`Đã sinh ${Gg.n} con (hiện tối đa 144 con gần nhất)`,ox+cols*sz/2,oy+8*sz+36,13,P.mut,"center",600);
      /* tỉ lệ */
      const gx=110,gy=440,gw=420,gh=26,n=Math.max(1,Gg.n),b=Gg.boy,gi=Gg.n-Gg.boy;ctx.fillStyle="rgba(0,0,0,.16)";C.rr(ctx,gx,gy,gw,gh,8);ctx.fill();
      ctx.fillStyle="#60A5FA";ctx.fillRect(gx,gy,gw*b/n,gh);ctx.fillStyle="#F472B6";ctx.fillRect(gx+gw*b/n,gy,gw*gi/n,gh);ctx.fillStyle="#E2E8F0";ctx.fillRect(gx+gw/2-1,gy-6,2,gh+12);
      T(ctx,`Con trai: ${b} (${fmt(b/n*100,1)}%)`,gx,gy+50,15,"#93C5FD","left");T(ctx,`Con gái: ${gi} (${fmt(gi/n*100,1)}%)`,gx+gw,gy+50,15,"#F9A8D4","right");
      if(Gg.n)T(ctx,`Trai : gái ≈ ${fmt(b/Math.max(1,gi),2)} : 1`,gx+gw/2,gy+82,18,HI())}
    /* ---------- ruồi giấm ---------- */
    function fly(ctx,x,y,s,gray,long,o){o=o||{};ctx.save();ctx.translate(x,y);ctx.scale(s,s);
      const body=gray?"#B08B5A":"#2A2522",bodyD=gray?"#6B4F2E":"#0F0D0C";
      /* chân */
      ctx.strokeStyle=bodyD;ctx.lineWidth=1.6;for(const sd of [-1,1])for(let k=0;k<3;k++){ctx.beginPath();ctx.moveTo(sd*5,-4+k*5);ctx.lineTo(sd*15,-8+k*8);ctx.lineTo(sd*19,-2+k*10);ctx.stroke()}
      /* cánh */
      ctx.fillStyle="rgba(220,235,255,.55)";ctx.strokeStyle="rgba(150,170,200,.9)";ctx.lineWidth=1;
      for(const sd of [-1,1]){ctx.save();ctx.scale(sd,1);ctx.beginPath();if(long){ctx.moveTo(2,-4);ctx.bezierCurveTo(16,-2,22,22,10,34);ctx.bezierCurveTo(4,30,1,10,2,-4)}else{ctx.moveTo(2,-4);ctx.bezierCurveTo(9,-3,11,4,8,8);ctx.bezierCurveTo(5,9,3,4,2,-4)}ctx.fill();ctx.stroke();ctx.restore()}
      /* bụng, ngực, đầu */
      const g=ctx.createRadialGradient(-2,6,1,0,10,14);g.addColorStop(0,C.mix(body,"#FFFFFF",.25));g.addColorStop(1,bodyD);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,11,6.5,11,0,0,6.283);ctx.fill();
      ctx.strokeStyle="rgba(0,0,0,.35)";ctx.lineWidth=1.3;for(let k=0;k<4;k++){ctx.beginPath();ctx.moveTo(-6,6+k*4);ctx.quadraticCurveTo(0,8+k*4,6,6+k*4);ctx.stroke()}
      ctx.fillStyle=body;ctx.beginPath();ctx.ellipse(0,-4,6,6,0,0,6.283);ctx.fill();ctx.beginPath();ctx.ellipse(0,-12,4.6,4,0,0,6.283);ctx.fill();
      ctx.fillStyle="#C1121F";for(const sd of [-1,1]){ctx.beginPath();ctx.ellipse(sd*3.6,-12.5,2.4,2.8,0,0,6.283);ctx.fill()}ctx.restore()}
    const PH=[["Thân xám, cánh dài",true,true],["Thân đen, cánh cụt",false,false],["Thân xám, cánh cụt",true,false],["Thân đen, cánh dài",false,true]];
    function faCross(n){const M=S.m;for(let i=0;i<n;i++){let gt;if(M.mode==="lk")gt=rnd()<.5?0:1;else{const b=rnd()<.5,v=rnd()<.5;gt=b&&v?0:!b&&!v?1:b?2:3}M.fa.c[gt]++;M.fa.flies.push(gt)}M.fa.n=M.fa.flies.length;
      if([100,400,1000].includes(M.fa.n)||M.fa.n%600===0){const c=M.fa.c;rec(M.mode==="lk"?"Lai phân tích: ♂ F1 (BV/bv) × ♀ bv/bv":"Dự đoán nếu phân li độc lập: ♂ BbVv × ♀ bbvv",`${M.fa.n} ruồi: ${c[0]} xám, dài; ${c[1]} đen, cụt; ${c[2]} xám, cụt; ${c[3]} đen, dài`,M.mode==="lk"?`≈ ${fmt(c[0]/Math.max(1,c[1]),2)} : 1 (Morgan: 1 : 1)`:`≈ ${c.map(v=>fmt(v/Math.max(1,c[1]),1)).join(" : ")} (lí thuyết 1 : 1 : 1 : 1)`)}refresh()}
    function drawLK(ctx,P){const M=S.m,lk=M.mode==="lk";
      T(ctx,"P:",50,82,17,P.ink,"left");fly(ctx,130,74,1.5,true,true);T(ctx,"Thân xám, cánh dài",130,140,13,P.ink);T(ctx,"×",215,82,24,P.mut);fly(ctx,300,74,1.5,false,false);T(ctx,"Thân đen, cánh cụt",300,140,13,P.ink);
      /* NST mang gene */
      const L1=[{f:.3,t:"B",c:"#FCD34D"},{f:.72,t:"V",c:"#86EFAC"}],L0=[{f:.3,t:"b",c:"#FCA5A5"},{f:.72,t:"v",c:"#FCA5A5"}];
      chrom(ctx,112,200,70,14,"#B08B5A",.15,{loci:L1,side:-1});chrom(ctx,148,200,70,14,"#B08B5A",.15,{loci:L1});chrom(ctx,282,200,70,14,"#475569",.15,{loci:L0,side:-1});chrom(ctx,318,200,70,14,"#475569",.15,{loci:L0});
      T(ctx,"BV/BV",130,292,14,P.mut);T(ctx,"bv/bv",300,292,14,P.mut);T(ctx,"(vạch màu: vị trí gene trên NST)",215,306,11.5,P.mut,"center",600);
      D2.arrow(ctx,215,314,215,330,P.mut,2);T(ctx,"F1:",50,356,17,P.ink,"left");
      if(M.f1){fly(ctx,215,346,1.5,true,true);T(ctx,"100% thân xám, cánh dài (BV/bv)",215,428,13,P.ink);chrom(ctx,128,470,60,13,"#B08B5A",.15,{loci:L1,side:-1});chrom(ctx,164,470,60,13,"#475569",.15,{loci:L0})}
      else T(ctx,"Bấm “Lai P → F1” ở khay",215,360,14,P.mut,"center",600);
      if(M.f1){T(ctx,"Giao tử ♂ F1:",215,478,13,P.ink,"left");T(ctx,lk?"BV, bv (50% : 50%)":"BV, Bv, bV, bv",215,498,13,lk?HI():"#FCA5A5","left");if(!lk)T(ctx,"(mỗi loại 25%)",215,516,12,"#FCA5A5","left",600)}
      /* kết quả Fa */
      const ox=470,oy=60;D2.block(ctx,ox-14,oy-20,500,540,14,"rgba(0,0,0,.12)","rgba(0,0,0,.12)",{shadow:false});
      T(ctx,lk?"Fa thực nghiệm (gene liên kết)":"Fa dự đoán nếu hai gene phân li độc lập",ox+236,oy+6,15,lk?HI():"#FCA5A5");
      const fl=M.fa.flies.slice(-120);for(let k=0;k<fl.length;k++){const c=k%15,r=Math.floor(k/15);const p=PH[fl[k]];fly(ctx,ox+14+c*31,oy+38+r*34,.62,p[1],p[2])}
      const tot=Math.max(1,M.fa.n);PH.forEach((p,i)=>{const y=oy+330+i*46;fly(ctx,ox+14,y+6,.72,p[1],p[2]);T(ctx,p[0],ox+40,y+10,14,P.ink,"left");const w=C.clamp(M.fa.c[i]/tot,0,1)*200;
        ctx.fillStyle=i===0?"#D6B482":i===1?"#57534E":"#94A3B8";ctx.fillRect(ox+200,y-6,w,22);ctx.strokeStyle=P.line;ctx.strokeRect(ox+200,y-6,200,22);T(ctx,`${M.fa.c[i]} (${fmt(M.fa.c[i]/tot*100,1)}%)`,ox+410,y+10,13,P.ink,"left")});
      T(ctx,`Đã tạo ${M.fa.n} ruồi`,ox+236,oy+518,13,P.mut,"center",600)}
    K.drawFn((ctx,P)=>K.view==="gt"?drawGT(ctx,P):drawLK(ctx,P));
    K.label("NST giới tính",[690,96],{view:"gt",dir:"e",len:30});
    
    K.dockFn(()=>{if(K.view==="gt")return[{grid:[{k:"g",v:"1",label:"Sinh 1 con",icon:IC.plus},{k:"g",v:"50",label:"Sinh 50 con",icon:IC.plus}]},{k:"gclr",label:"Xóa kết quả",icon:IC.reset}];
      const M=S.m;return[{k:"f1",label:"Lai P → F1",icon:IC.dna,dis:M.f1},{seg:[{k:"mode",v:"lk",label:"Thực nghiệm",icon:"",on:M.mode==="lk"},{k:"mode",v:"dl",label:"Nếu phân li độc lập",icon:"",on:M.mode==="dl"}],label:"Kết quả Fa"},
        {grid:[{k:"fa",v:"10",label:"Lai phân tích 10",icon:IC.plus,dis:!M.f1},{k:"fa",v:"100",label:"Lai phân tích 100",icon:IC.plus,dis:!M.f1}]},{k:"faclr",label:"Xóa kết quả",icon:IC.reset}]});
    K.onDock((k,v)=>{const Gg=S.g,M=S.m;
      if(k==="g"){for(let i=0;i<+v;i++){const boy=rnd()<.5;Gg.n++;if(boy)Gg.boy++;Gg.last.push(boy)}if(Gg.last.length>200)Gg.last=Gg.last.slice(-200);
        if(Gg.n>=100&&!Gg.r100||Gg.n>=500&&!Gg.r500){if(Gg.n>=500)Gg.r500=1;Gg.r100=1;rec("Mẹ (XX) × bố (XY)",`${Gg.n} con: ${Gg.boy} trai, ${Gg.n-Gg.boy} gái`,`trai : gái ≈ ${fmt(Gg.boy/Math.max(1,Gg.n-Gg.boy),2)} : 1`)}}
      else if(k==="gclr")Object.assign(Gg,{n:0,boy:0,last:[],r100:0,r500:0});
      else if(k==="f1"){M.f1=true;rec("P: ♀ thân xám, cánh dài (BV/BV) × ♂ thân đen, cánh cụt (bv/bv)","F1: 100% thân xám, cánh dài","F1: BV/bv")}
      else if(k==="mode"){if(M.mode!==v){M.mode=v;M.fa={n:0,c:[0,0,0,0],flies:[]};if(v==="dl")M.seenInd=true}}
      else if(k==="fa")faCross(+v);else if(k==="faclr")M.fa={n:0,c:[0,0,0,0],flies:[]};refresh()});
    K.infoFn(()=>{if(K.view==="gt"){const Gg=S.g;return `<div><b>NST giới tính ở người</b></div><div>Nữ: 44A + XX · Nam: 44A + XY</div><small>Mỗi lần sinh: tinh trùng X hoặc Y (xác suất 1/2) thụ tinh với trứng X.</small>`}
      const M=S.m;return `<div><b>Morgan, ruồi giấm</b></div><div>B: thân xám, b: thân đen · V: cánh dài, v: cánh cụt</div><small>${M.mode==="lk"?"Thực nghiệm: ruồi đực F1 chỉ tạo hai loại giao tử BV và bv.":"Giả sử hai gene nằm trên hai NST khác nhau: F1 tạo bốn loại giao tử."}</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"g",v:"1",p:[450,96],tip:"Chạm để sinh 1 con",view:"gt"},{k:"f1",p:[215,110],tip:"Chạm để lai hai ruồi P",view:"lk"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K._dockH("g","50");K._dockH("g","50");K._dockH("f1");K._dockH("fa","100");K._dockH("mode","dl");K._dockH("fa","100");K._dockH("mode","lk");K._dockH("fa","100")}};
    return K.mount(st)}
});
})();
