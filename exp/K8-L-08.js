/* K8-L-08 · Sự truyền nhiệt; sự nở vì nhiệt (SGK KHTN 8 – Kết nối tri thức, Bài 28–29) · 2D
   Bốn trạm:
   1. Dẫn nhiệt: bốn thanh đồng, nhôm, thép, thủy tinh cùng được đốt một đầu; nhiệt truyền theo phương trình truyền nhiệt một chiều
      có mất nhiệt ra không khí; đinh gắn sáp rơi khi chỗ gắn nóng tới khoảng 60 °C.
   2. Đối lưu: đun cốc nước ở đáy bên trái, hạt thuốc tím vẽ dòng đối lưu.
   3. Bức xạ nhiệt: hai bình giống nhau, một bình sơn đen, một bình mạ bạc, đặt cách đều bóng đèn.
   4. Nở vì nhiệt: quả cầu và vòng kim loại (đồng thau), băng kép đồng – thép. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;

/* ---------- vật liệu (OpenStax College Physics 2e, Bảng 14.3 và 13.2; nhiệt dung riêng, khối lượng riêng gần đúng) ---------- */
const MAT=[
  {k:"cu",ten:"Đồng",kc:390,rho:8960,c:387,col:"#C8794A",hi:"#F0B08A"},
  {k:"al",ten:"Nhôm",kc:220,rho:2700,c:900,col:"#B9C0C8",hi:"#E8EDF2"},
  {k:"fe",ten:"Thép",kc:80,rho:7860,c:452,col:"#7D838B",hi:"#B5BBC2"},
  {k:"gl",ten:"Thủy tinh",kc:.84,rho:2500,c:840,col:"#BFE3F2",hi:"#EAF8FF",glass:true}];
const ROD={L:.3,N:60,r:.004,h:12,T0:25,Tmax:350,tau:20};   /* thanh dài 30 cm, bán kính 4 mm; hệ số tỏa nhiệt ra không khí h = 12 W/(m²·K) (giả định) */
MAT.forEach(m=>{m.a=m.kc/(m.rho*m.c);m.b=2*ROD.h/(m.rho*m.c*ROD.r)});
const PIN=[.05,.1,.15,.2,.25],WAX=60;
const ACC={dan:30,doiluu:12,bucxa:10,no:6};                  /* tua nhanh: mỗi giây trên màn hình bằng bấy nhiêu giây thật */
const ALPHA_BRASS=19e-6,ALPHA_CU=17e-6,ALPHA_FE=12e-6;
const BALL={d0:25.00,ring0:25.03};                            /* mm ở 25 °C: quả cầu vừa lọt vòng */

const SPEC={
  predict:[
    {id:"p1",q:"Đốt nóng cùng lúc một đầu thanh đồng, thanh thép và thanh thủy tinh có gắn đinh bằng sáp. Đinh trên thanh nào rơi trước?",opts:[["cu","Thanh đồng"],["fe","Thanh thép"],["gl","Thanh thủy tinh"]],ans:"cu",res:"Kết quả: đinh trên thanh đồng rơi trước; thanh thủy tinh hầu như không đinh nào rơi."},
    {id:"p2",q:"Quả cầu kim loại vừa lọt qua vòng kim loại. Hơ nóng riêng quả cầu thì:",opts:[["van","Quả cầu vẫn lọt qua vòng"],["khong","Quả cầu không lọt qua vòng nữa"],["de","Quả cầu lọt dễ hơn"]],ans:"khong",res:"Kết quả: quả cầu nóng nở ra, không lọt qua vòng."}],
  taskLead:"Chọn trạm ở khay. Thời gian được tua nhanh để kịp quan sát; số giây ghi trong bảng là thời gian thật.",
  tasks:[
    {html:"<b>Dẫn nhiệt:</b> đốt đèn cồn, quan sát đinh rơi trên bốn thanh cho tới khi bảng ghi kết quả.",done:()=>S.dan.rec},
    {html:"<b>Đối lưu:</b> đun cốc nước có hạt thuốc tím, quan sát dòng nước màu tím ít nhất 1 phút.",done:()=>S.dl.t>=60},
    {html:"<b>Bức xạ nhiệt:</b> bật đèn chiếu vào hai bình, đợi tới khi ghi nhiệt độ sau 3 phút.",done:()=>S.bx.rec},
    {html:"<b>Nở vì nhiệt:</b> thử quả cầu nóng với vòng nguội, rồi hơ nóng cả vòng và thử lại.",done:()=>S.no.stuck&&S.no.passHot}],
  obs:[
    {id:"a",q:"Vì sao đinh trên thanh thủy tinh hầu như không rơi?",opts:[["kem","Thủy tinh dẫn nhiệt kém"],["nang","Thủy tinh nặng hơn đồng"],["sap","Sáp trên thủy tinh dính hơn"]],ans:"kem",why:"Thủy tinh dẫn nhiệt kém hơn đồng khoảng 460 lần (0,84 so với 390 W/(m·K)), nhiệt chỉ lan được vài centimet rồi tỏa hết ra không khí."},
    {id:"b",q:"Đun cốc nước ở đáy bên trái. Dòng nước màu tím chuyển động thế nào?",opts:[["vong","Đi lên ở chỗ đun, sang ngang trên mặt rồi đi xuống ở phía bên kia"],["xuong","Đi xuống ở chỗ đun"],["dung","Đứng yên, chỉ tan dần"]],ans:"vong",why:"Nước nóng nở ra, nhẹ hơn nên đi lên; nước nguội nặng hơn chìm xuống thế chỗ, tạo thành dòng đối lưu."},
    {id:"c",q:"Hai bình cách đều bóng đèn. Bình nào nóng lên nhanh hơn?",opts:[["den","Bình sơn đen"],["bac","Bình mạ bạc"],["nhu","Như nhau"]],ans:"den",why:"Mặt màu đen hấp thụ nhiều tia nhiệt; mặt sáng bóng phản xạ phần lớn tia nhiệt."},
    {id:"d",q:"Vì sao hơ nóng cả vòng thì quả cầu nóng lại lọt qua được?",opts:[["no","Vòng nóng cũng nở ra, lỗ vòng rộng thêm"],["co","Vòng nóng co lại"],["mem","Kim loại nóng mềm ra"]],ans:"no",why:"Vòng nở ra như một tấm kim loại liền: lỗ vòng cũng rộng ra theo cùng tỉ lệ."}],
  concl:{html:`<ul class="tlist"><li><b>Dẫn nhiệt:</b> nhiệt truyền từ phần nóng sang phần lạnh trong vật; kim loại dẫn nhiệt tốt (đồng tốt nhất trong bốn thanh), thủy tinh, không khí dẫn nhiệt kém.</li>
    <li><b>Đối lưu:</b> nhiệt truyền nhờ dòng chất lỏng hoặc chất khí chuyển động; xảy ra chủ yếu ở chất lỏng và chất khí.</li>
    <li><b>Bức xạ nhiệt:</b> nhiệt truyền bằng các tia nhiệt đi thẳng, kể cả qua chân không; vật màu tối, mặt xù xì hấp thụ tia nhiệt tốt.</li>
    <li><b>Nở vì nhiệt:</b> các chất nở ra khi nóng lên, co lại khi lạnh đi; các chất rắn khác nhau nở vì nhiệt khác nhau (băng kép cong về phía thép vì đồng nở nhiều hơn).</li></ul>`,
    quiz:[
      {id:"q1",q:"Mùa hè nên mặc áo màu nào để đỡ nóng khi đi ngoài nắng?",opts:[["sang","Màu sáng"],["toi","Màu tối"],["nhu","Màu nào cũng như nhau"]],ans:"sang",why:{toi:"Áo màu tối hấp thụ nhiều tia nhiệt của Mặt Trời hơn.",nhu:"Màu sắc ảnh hưởng tới lượng tia nhiệt hấp thụ."}},
      {id:"q2",q:"Giữa các thanh ray đường sắt có khe hở nhỏ để:",opts:[["no","Thanh ray nở dài khi trời nóng không bị cong"],["nuoc","Thoát nước mưa"],["nhe","Tàu chạy nhẹ hơn"]],ans:"no",why:{nuoc:"Khe hở rất nhỏ, mục đích là chừa chỗ cho thanh ray nở dài.",nhe:"Khe hở không làm tàu nhẹ hơn."}},
      {id:"q3",q:"Nồi nấu ăn bằng nhôm nhưng tay cầm bằng nhựa hoặc gỗ vì:",opts:[["dan","Nhôm dẫn nhiệt tốt để nấu nhanh; nhựa, gỗ dẫn nhiệt kém nên cầm không nóng tay"],["re","Nhựa, gỗ rẻ hơn nhôm"],["nhe","Nhựa, gỗ nhẹ hơn"]],ans:"dan",why:{re:"Lí do chính là khả năng dẫn nhiệt.",nhe:"Lí do chính là khả năng dẫn nhiệt."}}],
    done:`<h2>Hoàn thành: Truyền nhiệt và nở vì nhiệt</h2><p class="muted">Dẫn nhiệt, đối lưu, bức xạ nhiệt; các chất nở ra khi nóng lên.</p>`},
  gv:["Cho học sinh dự đoán thứ tự rơi của đinh trên bốn thanh trước khi đốt.","Ở trạm dẫn nhiệt, cho chạy 0,25× để học sinh thấy vùng nóng (màu đỏ cam) lan dọc thanh.","Hỏi thêm: vì sao lò sưởi đặt sát sàn, còn máy lạnh treo cao?","Liên hệ: dây điện mùa hè võng hơn mùa đông; bóng đèn sợi đốt, ấm đun nước."]
};

const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 28–29)</p><ul class="tlist"><li>Lấy được ví dụ, giải thích được ba hình thức truyền nhiệt: dẫn nhiệt, đối lưu, bức xạ nhiệt.</li><li>Thực hiện thí nghiệm chứng tỏ các chất nở ra khi nóng lên, co lại khi lạnh đi; nêu được một số ứng dụng.</li></ul>
<p style="margin-top:10px"><b>An toàn khi làm thật</b></p><ul class="tlist"><li>Đèn cồn: không châm từ đèn khác, tắt bằng nắp. Quả cầu, vòng vừa hơ rất nóng: chỉ cầm qua cán gỗ.</li></ul>`;
const SRC=`<ul class="tlist"><li>Hệ số dẫn nhiệt: đồng 390, nhôm 220, thép 80, thủy tinh 0,84 W/(m·K): <a href="https://openstax.org/books/college-physics-2e/pages/14-5-conduction" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 14.5, Bảng 14.3</a>.</li>
<li>Hệ số nở dài: đồng thau 19·10⁻⁶, đồng 17·10⁻⁶, sắt thép 12·10⁻⁶ (1/°C): <a href="https://openstax.org/books/college-physics-2e/pages/13-2-thermal-expansion-of-solids-and-liquids" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 13.2, Bảng 13.2</a>.</li>
<li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 28 Sự truyền nhiệt, Bài 29 Sự nở vì nhiệt.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thanh dài 30 cm, bán kính 4 mm; đầu đốt nóng dần tới khoảng 350 °C; hệ số tỏa nhiệt ra không khí 12 W/(m²·K); sáp chảy ở khoảng 60 °C. Nhiệt dung riêng, khối lượng riêng lấy giá trị gần đúng của từng chất.</li>
<li>Dòng đối lưu và tốc độ nóng lên của hai bình trong trạm bức xạ là mô hình định tính; hệ số hấp thụ giả định: sơn đen 0,95, mạ bạc 0,1.</li>
<li>Quả cầu 25,00 mm, lỗ vòng 25,03 mm ở 25 °C, cùng bằng đồng thau. Hình vẽ phóng đại độ nở để nhìn thấy được; số đo trong bảng là số tính từ hệ số nở.</li></ul>`;

let S;
LabKHTN.register("K8-L-08",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tram",t:"Trạm"},{k:"tn",t:"Làm gì"},{k:"kq",t:"Kết quả"}],empty:"Kết quả từng trạm tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:600,aria:"Bàn thí nghiệm truyền nhiệt và nở vì nhiệt",views:{dan:{label:"Dẫn nhiệt",icon:IC.fire,frame:[120,100,850,540]},doiluu:{label:"Đối lưu",icon:IC.beaker,frame:[210,40,580,600]},bucxa:{label:"Bức xạ",icon:IC.sun,frame:[150,30,820,600]},no:{label:"Nở vì nhiệt",icon:IC.thermo,frame:[80,40,880,520]}}});
    const rnd=K.rnd;
    function freshDan(){return{on:false,t:0,TB:ROD.T0,rods:MAT.map(()=>({T:new Float64Array(ROD.N).fill(ROD.T0),fall:PIN.map(()=>null),drop:PIN.map(()=>0)})),rec:false}}
    const GX=56,GY=52;function freshDl(){return{on:false,t:0,T:25,c:new Float32Array(GX*GY),src:1}}
    function freshBx(){return{on:false,t:0,T:[25,25],hist:[[[0,25]],[[0,25]]],rec:false}}
    function freshNo(){return{Tb:25,Tr:25,heatB:false,heatR:false,test:null,stuck:false,passHot:false,Tbi:25,heatBi:false}}
    S={dan:freshDan(),dl:freshDl(),bx:freshBx(),no:freshNo(),recs:0};
    const rec=(tram,tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tram,tn,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};

    /* ================= mô phỏng ================= */
    function stepDan(dt){const D=S.dan;if(!D.on&&D.TB<=ROD.T0+.5)return;const real=dt*ACC.dan;let left=real;
      while(left>1e-9){const h=Math.min(left,.08);left-=h;D.t+=D.on?h:0;
        D.TB=D.on?ROD.T0+(ROD.Tmax-ROD.T0)*(1-Math.exp(-D.t/ROD.tau)):ROD.T0+(D.TB-ROD.T0)*Math.exp(-h/60);
        const dx=ROD.L/(ROD.N-1);
        MAT.forEach((m,ri)=>{const T=D.rods[ri].T,Tn=T.slice();Tn[0]=D.TB;
          for(let i=1;i<ROD.N;i++){const l=T[i-1],r=i<ROD.N-1?T[i+1]:T[i-1];Tn[i]=T[i]+h*(m.a*(l-2*T[i]+r)/(dx*dx)-m.b*(T[i]-ROD.T0))}
          D.rods[ri].T=Tn;
          PIN.forEach((x,pi)=>{if(D.rods[ri].fall[pi]==null&&Tat(Tn,x)>=WAX)D.rods[ri].fall[pi]=D.t})})}
      MAT.forEach((m,ri)=>D.rods[ri].drop=D.rods[ri].drop.map((v,pi)=>D.rods[ri].fall[pi]!=null?Math.min(1,v+dt*1.6):v));
      if(D.on&&!D.rec&&(D.rods[2].fall.every(f=>f!=null)||D.t>=900)){D.rec=true;
        MAT.forEach((m,ri)=>{const f=D.rods[ri].fall;const n=f.filter(v=>v!=null).length;
          rec("Dẫn nhiệt",`Thanh ${m.ten.toLowerCase()} (sau ${fmt(D.t/60,0)} phút)`,n?`${n}/5 đinh rơi; đinh đầu tiên rơi sau ${fmt(f[0],0)} s${n===5?`, đinh cuối (25 cm) sau ${fmt(f[4],0)} s`:""}`:"không đinh nào rơi")});
        api.toast("Đã ghi kết quả dẫn nhiệt của bốn thanh.","ok",2200);refresh()}}
    const Tat=(T,x)=>{const f=x/ROD.L*(ROD.N-1),i=Math.floor(f);return T[i]+(T[Math.min(ROD.N-1,i+1)]-T[i])*(f-i)};
    /* đối lưu: hàm dòng ψ ~ sin(πx)·sin(πy) lệch về phía nguồn nhiệt (bên trái) */
    const BK={x:300,y:120,w:400,h:380};
    /* hàm dòng ψ = A·sin(πX)·sin(πY): nước đi lên ở phía đun (trái), sang phải trên mặt, đi xuống phía phải, quay về dọc đáy */
    function vel(x,y,amp){const u=C.clamp((x-BK.x)/BK.w,.02,1),v=C.clamp((y-BK.y-30)/(BK.h-30),0,1);const X=.04+.92*Math.pow(u,.75),Y=.06+.88*v;
      const dX=.92*.75*Math.pow(u,-.25)/BK.w,dY=.88/(BK.h-30);const A=amp*(BK.h-30)/(.88*Math.PI)*55/16;
      return[A*Math.PI*Math.sin(Math.PI*X)*Math.cos(Math.PI*Y)*dY,-A*Math.PI*Math.cos(Math.PI*X)*Math.sin(Math.PI*Y)*dX]}
    function stepDl(dt){const L=S.dl;if(!L.on)return;const real=dt*ACC.doiluu;L.t+=real;L.T=Math.min(96,L.T+real*.055);
      const amp=Math.min(1,.2+(L.T-25)/25)*16;
      /* hạt thuốc tím tan dần từ tinh thể ở đáy bên trái */
      /* thuốc tím: trường nồng độ trên lưới, vận chuyển theo dòng đối lưu (bán Lagrange) và khuếch tán */
      const c=L.c,n=new Float32Array(GX*GY),cw=BK.w/GX,ch=(BK.h-30)/GY,y0=BK.y+30;const sub=Math.max(1,Math.ceil(dt*8));const h=dt/sub;
      const smp=(x,y)=>{const fx=C.clamp((x-BK.x)/cw-.5,0,GX-1.001),fy=C.clamp((y-y0)/ch-.5,0,GY-1.001);const i=fx|0,j=fy|0,a=fx-i,b=fy-j;const q=j*GX+i;
        return c[q]*(1-a)*(1-b)+c[q+1]*a*(1-b)+c[q+GX]*(1-a)*b+c[q+GX+1]*a*b};
      for(let k=0;k<sub;k++){for(let j=0;j<GY;j++)for(let i=0;i<GX;i++){const x=BK.x+(i+.5)*cw,y=y0+(j+.5)*ch;const [vx,vy]=vel(x,y,amp);const vm=Math.hypot(vx,vy),cap=70,kk=vm>cap?cap/vm:1;
          const [vx2,vy2]=vel(x-vx*kk*h*.5,y-vy*kk*h*.5,amp);const vm2=Math.hypot(vx2,vy2),k2=vm2>cap?cap/vm2:1;n[j*GX+i]=smp(x-vx2*k2*h,y-vy2*k2*h)}
        for(let j=0;j<GY;j++)for(let i=0;i<GX;i++){const q=j*GX+i,v=n[q];const l=i?n[q-1]:v,r=i<GX-1?n[q+1]:v,u=j?n[q-GX]:v,d=j<GY-1?n[q+GX]:v;c[q]=v+.16*h*(l+r+u+d-4*v)}
        /* tinh thể tan dần ở đáy bên trái */
        if(L.src>0){const add=Math.min(L.src,h*.05);L.src-=add;const si=Math.round((72)/cw),sj=GY-2;for(let di=-1;di<=1;di++)c[sj*GX+si+di]+=add*520}}}
    function stepBx(dt){const B=S.bx;if(!B.on)return;const real=dt*ACC.bucxa;B.t+=real;
      const A=[.95,.1];for(let i=0;i<2;i++){B.T[i]+=real*(A[i]*.17-.004*(B.T[i]-25));const h=B.hist[i];if(B.t-h[h.length-1][0]>=5)h.push([B.t,B.T[i]])}
      if(!B.rec&&B.t>=180){B.rec=true;rec("Bức xạ nhiệt","Hai bình cách đều bóng đèn, sau 3 phút",`bình sơn đen ${fmt(B.T[0],1)} °C; bình mạ bạc ${fmt(B.T[1],1)} °C (ban đầu 25 °C)`);refresh()}}
    function stepNo(dt){const N=S.no;const real=dt*ACC.no;const app=(T,on)=>on?T+(320-T)*(1-Math.exp(-real/25)):T+(25-T)*(1-Math.exp(-real/60));
      N.Tb=app(N.Tb,N.heatB);N.Tr=app(N.Tr,N.heatR);N.Tbi=app(N.Tbi,N.heatBi);
      if(N.test){const T=N.test;T.t+=dt;if(T.t>1.2&&!T.done){T.done=true;const db=dB(),dr=dR();const pass=db<=dr;T.pass=pass;
          if(!pass&&N.Tb>60&&N.Tr<60)N.stuck=true;if(pass&&N.Tb>60&&N.Tr>60)N.passHot=true;
          rec("Nở vì nhiệt",`Thả quả cầu (${fmt(N.Tb,0)} °C) qua vòng (${fmt(N.Tr,0)} °C)`,`quả cầu ${fmt(db,3)} mm, lỗ vòng ${fmt(dr,3)} mm: ${pass?"quả cầu lọt qua vòng":"quả cầu không lọt"}`);
          api.toast(pass?"Quả cầu lọt qua vòng.":"Quả cầu bị giữ lại trên vòng.",pass?"ok":"info",2000);refresh()}
        if(T.t>3.4)N.test=null}}
    const dB=()=>BALL.d0*(1+ALPHA_BRASS*(S.no.Tb-25)),dR=()=>BALL.ring0*(1+ALPHA_BRASS*(S.no.Tr-25));
    K.onFrame(dt=>{stepDan(dt);stepDl(dt);stepBx(dt);stepNo(dt)});

    /* ================= vẽ ================= */
    let dyeCv=null,dyeImg=null;
    const heat=T=>{const t=C.clamp((T-25)/300,0,1);return t<.33?C.mix("#3B82F6","#FDE047",t/.33):t<.66?C.mix("#FDE047","#F97316",(t-.33)/.33):C.mix("#F97316","#DC2626",(t-.66)/.34)};
    function lamp(ctx,x,y,on,s){s=s||1;ctx.save();ctx.translate(x,y);ctx.scale(s,s);
      const g=ctx.createLinearGradient(-30,0,30,0);g.addColorStop(0,"#9FC7E6");g.addColorStop(.5,"#E8F6FF");g.addColorStop(1,"#86B3D6");
      ctx.fillStyle=g;ctx.globalAlpha=.85;ctx.beginPath();ctx.ellipse(0,40,34,26,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;
      ctx.fillStyle="#E6EEF5";ctx.globalAlpha=.6;ctx.beginPath();ctx.ellipse(0,52,28,10,0,0,Math.PI);ctx.fill();ctx.globalAlpha=1;
      D2.block(ctx,-9,6,18,14,3,"#9AA3AD","#5E6670",{shadow:false});ctx.fillStyle="#F5F1E6";ctx.fillRect(-2,-6,4,13);
      if(on){const t=performance.now()/1000;for(let k=0;k<3;k++){const f=1+.08*Math.sin(t*17+k*2);ctx.save();ctx.globalCompositeOperation="lighter";
          const fg=ctx.createRadialGradient(0,-24,2,0,-20,26*f);fg.addColorStop(0,"rgba(255,250,220,.95)");fg.addColorStop(.35,"rgba(120,170,255,.6)");fg.addColorStop(1,"rgba(255,140,40,0)");
          ctx.fillStyle=fg;ctx.beginPath();ctx.moveTo(0,-6);ctx.bezierCurveTo(-14,-14,-8*f,-40*f,0,-52*f);ctx.bezierCurveTo(8*f,-40*f,14,-14,0,-6);ctx.fill();ctx.restore()}}
      ctx.restore()}
    function thermo(ctx,x,y,h,T,P,lab){const t=C.clamp((T-0)/100,0,1);D2.block(ctx,x-7,y,14,h,7,"rgba(230,240,250,.9)","rgba(200,215,235,.9)",{shadow:false,stroke:P.line});
      ctx.fillStyle="#DC2626";ctx.beginPath();ctx.arc(x,y+h+4,9,0,6.283);ctx.fill();ctx.fillRect(x-2.5,y+h-(h-10)*t,5,(h-10)*t+4);
      ctx.strokeStyle="rgba(30,40,60,.6)";ctx.lineWidth=1;for(let k=0;k<=10;k++){const yy=y+h-(h-10)*k/10;ctx.beginPath();ctx.moveTo(x+7,yy);ctx.lineTo(x+(k%5?11:14),yy);ctx.stroke()}
      if(lab)D2.text(ctx,lab,x,y-12,{s:20,w:800,c:P.ink,a:"center"})}
    const table=(ctx,x,y,w)=>{D2.block(ctx,x,y,w,14,4,"#8B6A43","#5C4428",{shadow:false});ctx.fillStyle="rgba(0,0,0,.18)";ctx.fillRect(x+6,y+14,w-12,6)};
    const pole=(ctx,x,y0,y1)=>{ctx.fillStyle="#4B5563";ctx.fillRect(x-5,y0,10,y1-y0);D2.block(ctx,x-46,y1-10,92,10,4,"#374151","#1F2937",{shadow:false})};
    const block=(ctx,x,y,w,h)=>D2.block(ctx,x-w/2,y,w,h,5,"#A47A4D","#6B4F2A",{shadow:false,stroke:"rgba(0,0,0,.25)"});
    function drawDan(ctx,P){const D=S.dan;const x0=250,x1=850,ys=[150,250,350,450];
      /* bàn, giá sắt kẹp khối đồng; đèn cồn đặt trên bàn, ngọn lửa chạm đáy khối đồng */
      table(ctx,170,613,780);pole(ctx,x0-112,110,613);ctx.fillStyle="#4B5563";ctx.fillRect(x0-112,ys[1]+16,70,10);ctx.fillRect(x0-56,ys[1]+8,8,26);
      /* khối đồng nối bốn đầu thanh, đèn cồn bên dưới */
      D2.block(ctx,x0-50,ys[0]-30,52,ys[3]-ys[0]+60,8,C.mix("#7A5232",heat(D.TB),.55),C.mix("#4A3020",heat(D.TB),.4),{stroke:"rgba(0,0,0,.3)"});
      lamp(ctx,x0-24,540,D.on,1.1);
      MAT.forEach((m,ri)=>{const y=ys[ri],R=D.rods[ri];
        /* thân thanh tô màu theo nhiệt độ từng đoạn */
        for(let i=0;i<ROD.N-1;i++){const xa=x0+(x1-x0)*i/(ROD.N-1),xb=x0+(x1-x0)*(i+1)/(ROD.N-1);const tt=C.clamp((R.T[i]-25)/250,0,1);
          const g=ctx.createLinearGradient(0,y-9,0,y+9);const base=C.mix(m.col,heat(R.T[i]),Math.min(.85,tt*1.4));g.addColorStop(0,C.mix(base,"#FFFFFF",.45));g.addColorStop(.5,base);g.addColorStop(1,C.mix(base,"#000000",.35));
          ctx.fillStyle=g;ctx.globalAlpha=m.glass?.8:1;ctx.fillRect(xa,y-9,xb-xa+.6,18);ctx.globalAlpha=1}
        ctx.strokeStyle="rgba(0,0,0,.28)";ctx.lineWidth=1;C.rr(ctx,x0,y-9,x1-x0,18,4);ctx.stroke();
        D2.text(ctx,m.ten,x1+16,y+6,{s:20,w:800,c:P.ink});
        /* đinh gắn sáp */
        PIN.forEach((px,pi)=>{const X=x0+(x1-x0)*px/ROD.L;const f=R.drop[pi];const fy=y+9+f*f*(ys[0]+380-y)*.0+f*f*90;
          ctx.save();ctx.globalAlpha=f>=1?.35:1;ctx.fillStyle="#F3E6B8";ctx.beginPath();ctx.ellipse(X,y+12+(f>0?fy-y-9:0),6,4,0,0,6.283);ctx.fill();
          ctx.strokeStyle="#6B7280";ctx.lineWidth=2.4;ctx.beginPath();ctx.moveTo(X,y+14+(f>0?fy-y-9:0));ctx.lineTo(X+(f>0?6*f:0),y+40+(f>0?fy-y-9:0));ctx.stroke();ctx.restore()});
        if(ri===0)PIN.forEach(px=>{const X=x0+(x1-x0)*px/ROD.L;D2.text(ctx,`${Math.round(px*100)} cm`,X,y-18,{s:15,w:700,c:P.mut,a:"center"})})});
      D2.text(ctx,"đầu được đốt nóng",x0-24,ys[0]-44,{s:16,w:700,c:P.mut,a:"center"})}
    function drawDl(ctx,P){const L=S.dl;const b=BK;
      /* bàn, kiềng ba chân và lưới; đèn cồn đặt trên bàn dưới lưới, ngọn lửa chạm lưới ở phía có thuốc tím */
      table(ctx,b.x-80,624,b.w+160);ctx.strokeStyle="#4B5563";ctx.lineWidth=7;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(b.x-22,b.y+b.h+8);ctx.lineTo(b.x-46,624);ctx.moveTo(b.x+b.w+22,b.y+b.h+8);ctx.lineTo(b.x+b.w+46,624);ctx.moveTo(b.x+b.w/2+40,b.y+b.h+8);ctx.lineTo(b.x+b.w/2+52,624);ctx.stroke();
      lamp(ctx,b.x+72,561,L.on,.95);
      ctx.fillStyle="#6B7280";ctx.fillRect(b.x-30,b.y+b.h+4,b.w+60,6);ctx.strokeStyle="rgba(203,213,225,.5)";ctx.lineWidth=1;for(let gx=b.x-26;gx<b.x+b.w+30;gx+=10){ctx.beginPath();ctx.moveTo(gx,b.y+b.h+4);ctx.lineTo(gx+5,b.y+b.h+10);ctx.stroke()}
      const wg=ctx.createLinearGradient(0,b.y+30,0,b.y+b.h);const wc=C.mix("#BFDBFE","#FCA5A5",C.clamp((L.T-25)/70,0,1)*.45);wg.addColorStop(0,C.rgba(wc,.55));wg.addColorStop(1,C.rgba(C.mix(wc,"#60A5FA",.3),.7));
      ctx.fillStyle=wg;ctx.fillRect(b.x,b.y+30,b.w,b.h-30);
      /* thuốc tím */
      if(!dyeCv){dyeCv=document.createElement("canvas");dyeCv.width=GX;dyeCv.height=GY;dyeImg=dyeCv.getContext("2d").createImageData(GX,GY)}
      const im=dyeImg.data;for(let q=0;q<GX*GY;q++){const a=Math.min(1,L.c[q]*1.6);im[q*4]=118;im[q*4+1]=28;im[q*4+2]=196;im[q*4+3]=Math.round(a*215)}dyeCv.getContext("2d").putImageData(dyeImg,0,0);
      ctx.save();ctx.imageSmoothingEnabled=true;ctx.drawImage(dyeCv,b.x,b.y+30,b.w,b.h-30);ctx.restore();
      if(L.src>.02){ctx.fillStyle="#4C1D95";ctx.beginPath();ctx.arc(b.x+72,b.y+b.h-8,6*Math.sqrt(L.src),0,6.283);ctx.fill()}
      /* thành cốc thủy tinh */
      ctx.strokeStyle="rgba(220,235,255,.9)";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(b.x-4,b.y);ctx.lineTo(b.x-4,b.y+b.h+2);ctx.lineTo(b.x+b.w+4,b.y+b.h+2);ctx.lineTo(b.x+b.w+4,b.y);ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(b.x+10,b.y+40);ctx.lineTo(b.x+10,b.y+b.h-20);ctx.stroke();
      /* mũi tên dòng đối lưu khi đã chạy đủ lâu */
      if(L.on&&L.t>20){const a=.5+.5*Math.sin(K.simT*2);ctx.globalAlpha=.55+.3*a;const c=K.day?"#7C3AED":"#E9D5FF";
        D2.arrow(ctx,b.x+75,b.y+b.h-60,b.x+75,b.y+90,c,3);D2.arrow(ctx,b.x+95,b.y+60,b.x+b.w-80,b.y+60,c,3);D2.arrow(ctx,b.x+b.w-60,b.y+90,b.x+b.w-60,b.y+b.h-60,c,3);D2.arrow(ctx,b.x+b.w-80,b.y+b.h-30,b.x+105,b.y+b.h-30,c,3);ctx.globalAlpha=1}
      thermo(ctx,b.x+b.w-40,b.y-40,200,L.T,P,`${fmt(L.T,0)} °C`)}
    function drawBx(ctx,P){const B=S.bx;const cx=500,cy=250;
      /* bóng đèn */
      if(B.on){const g=ctx.createRadialGradient(cx,cy,10,cx,cy,260);g.addColorStop(0,"rgba(255,220,120,.55)");g.addColorStop(1,"rgba(255,180,60,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(cx,cy,260,0,6.283);ctx.fill();
        ctx.strokeStyle="rgba(255,200,90,.6)";ctx.lineWidth=2;ctx.setLineDash([10,10]);ctx.lineDashOffset=-K.simT*40;for(const s of [-1,1])for(let k=-2;k<=2;k++){ctx.beginPath();ctx.moveTo(cx+s*40,cy+k*14);ctx.lineTo(cx+s*190,cy+k*34);ctx.stroke()}ctx.setLineDash([])}
      const bg=ctx.createRadialGradient(cx-10,cy-14,4,cx,cy,44);bg.addColorStop(0,B.on?"#FFFBEB":"#F1F5F9");bg.addColorStop(1,B.on?"#FBBF24":"#CBD5E1");ctx.fillStyle=bg;ctx.beginPath();ctx.arc(cx,cy,40,0,6.283);ctx.fill();
      D2.block(ctx,cx-16,cy+34,32,26,4,"#9CA3AF","#4B5563",{shadow:false});ctx.fillStyle="#374151";ctx.fillRect(cx-4,cy+60,8,250);D2.block(ctx,cx-60,cy+310,120,16,6,"#4B5563","#1F2937");
      /* hai bình */
      [[250,0,"Bình sơn đen"],[750,1,"Bình mạ bạc"]].forEach(([x,i,t])=>{const y=200;
        if(i===0){D2.block(ctx,x-55,y,110,150,18,"#3F3F46","#09090B",{stroke:"rgba(255,255,255,.15)"})}
        else{const g=ctx.createLinearGradient(x-55,0,x+55,0);g.addColorStop(0,"#9CA3AF");g.addColorStop(.35,"#F9FAFB");g.addColorStop(.6,"#D1D5DB");g.addColorStop(1,"#6B7280");ctx.fillStyle=g;C.rr(ctx,x-55,y,110,150,18);ctx.fill()}
        D2.block(ctx,x-18,y-16,36,18,4,"#78716C","#44403C",{shadow:false});
        thermo(ctx,x,y-150,150,B.T[i],P,`${fmt(B.T[i],1)} °C`);D2.text(ctx,t,x,y+182,{s:20,w:800,c:P.ink,a:"center"})});
      /* đồ thị nhỏ */
      const F={x:700,y:470,w:250,h:100,x0:0,x1:Math.max(180,Math.ceil(B.t/60)*60),y0:20,y1:Math.max(40,Math.ceil(Math.max(...B.T)/10)*10+5),nx:3,ny:2,xl:"t (s)",yl:"T (°C)"};
      D2.chart(ctx,F,[{pts:B.hist[0].concat([[B.t,B.T[0]]]),c:"#F87171",dot:true},{pts:B.hist[1].concat([[B.t,B.T[1]]]),c:"#93C5FD",dot:true}],P)}
    function drawNo(ctx,P){const N=S.no;const cx=330;
      /* giá treo, vòng trên cán, quả cầu treo dây xích */
      D2.block(ctx,cx-218,520,370,18,6,"#6B4F2A","#3E2C15");ctx.fillStyle="#4B5563";ctx.fillRect(cx+120,80,10,440);ctx.fillRect(cx-40,80,170,8);ctx.fillRect(cx-3,80,6,14);
      const ringY=330,rr=70*(1+(N.Tr-25)/320*.12),br=68*(1+(N.Tb-25)/320*.12);/* phóng đại độ nở để nhìn thấy */
      const T=N.test;let by=200;if(T){const k=Math.min(1,T.t/1.2);by=200+k*(T.done&&T.pass?252-br+68:ringY-200-Math.sqrt(Math.max(0,br*br-rr*rr))-2);if(T.done&&T.pass)by=200+Math.min(1,T.t/2)*(252-br+68)}
      /* cán và vòng */
      ctx.fillStyle="#8B5A2B";ctx.fillRect(cx+60,ringY-6,120,12);
      const rc=C.mix("#C9A227",heat(N.Tr),C.clamp((N.Tr-25)/300,0,1)*.7);ctx.strokeStyle=rc;ctx.lineWidth=12;ctx.beginPath();ctx.ellipse(cx,ringY,rr+6,18,0,0,Math.PI*2);ctx.stroke();
      ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(cx,ringY-2,rr+6,17,0,Math.PI*1.05,Math.PI*1.95);ctx.stroke();
      /* dây xích */
      /* quả cầu có xích và cán gỗ: bình thường móc trên tay giá; khi hơ thì được cầm sang phía trái, đặt trên ngọn lửa đèn cồn ở bàn */
      const hb=N.heatB&&!T,bX=hb?160:cx,bY=hb?352:by,top=hb?bY-br-46:94;
      ctx.strokeStyle="#9CA3AF";ctx.lineWidth=2;for(let yy=top;yy<bY-br;yy+=12){ctx.beginPath();ctx.ellipse(bX,yy+6,3,6,0,0,6.283);ctx.stroke()}
      D2.block(ctx,bX-28,top-12,56,12,6,"#A47A4D","#6B4F2A",{shadow:false});
      const bc=C.mix("#D4AF37",heat(N.Tb),C.clamp((N.Tb-25)/300,0,1)*.7);D2.ball(ctx,bX,bY,br,bc);
      /* nửa trước của vòng vẽ đè lên quả cầu khi quả cầu đi qua */
      ctx.strokeStyle=rc;ctx.lineWidth=12;ctx.beginPath();ctx.ellipse(cx,ringY,rr+6,18,0,0,Math.PI);ctx.stroke();
      lamp(ctx,160,461,!!hb,.9);if(N.heatR&&!T){block(ctx,cx+60,449,84,71);lamp(ctx,cx+60,390,true,.9)}
      /* băng kép đồng – thép */
      const bx=640,byy=300,Lb=260;/* 260 px ứng với 10 cm; băng dày 1 mm, độ cong κ ≈ 1,5·Δα·ΔT / độ dày (hai lớp dày bằng nhau); hình phóng đại độ cong 2 lần */
      const kap=1.5*(ALPHA_CU-ALPHA_FE)*(N.Tbi-25)/.001,kp=kap*2/2600;
      D2.block(ctx,bx-70,520,360,18,6,"#6B4F2A","#3E2C15");pole(ctx,bx-17,byy+30,520);ctx.fillStyle="#8B5A2B";ctx.fillRect(bx-34,byy-30,34,60);
      ctx.save();for(const [off,col] of [[-4.5,"#C8794A"],[4.5,"#7D838B"]]){ctx.strokeStyle=col;ctx.lineWidth=9;ctx.lineCap="butt";ctx.beginPath();
        for(let i=0;i<=40;i++){const sp=i/40*Lb;const th=kp*sp;const x=bx+(kp>1e-9?Math.sin(th)/kp:sp),y=byy+(kp>1e-9?(1-Math.cos(th))/kp:0);
          const X=x-off*Math.sin(th),Y=y+off*Math.cos(th)*-1*-1;i?ctx.lineTo(X,Y):ctx.moveTo(X,Y)}ctx.stroke()}ctx.restore();
      D2.text(ctx,"đồng",bx+40,byy-14,{s:15,w:700,c:"#E8A17A",a:"center"});D2.text(ctx,"thép",bx+40,byy+28,{s:15,w:700,c:"#A9B0B8",a:"center"});
      if(N.heatBi){block(ctx,bx+150,426,84,94);lamp(ctx,bx+150,367,true,.9)}
      D2.text(ctx,"Băng kép (đồng – thép)",bx+130,byy-64,{s:19,w:800,c:P.ink,a:"center"});
      D2.text(ctx,`${fmt(N.Tbi,0)} °C`,bx+130,byy-40,{s:16,w:700,c:P.mut,a:"center"})}
    K.drawFn((ctx,P)=>{const v=K.view;if(v==="dan")drawDan(ctx,P);else if(v==="doiluu")drawDl(ctx,P);else if(v==="bucxa")drawBx(ctx,P);else drawNo(ctx,P)});

    /* ================= nhãn có mũi tên ================= */
    K.label("Đèn cồn",[200,590],{view:"dan",dir:"w",len:30});
    K.label("Đinh gắn bằng sáp",[250+600*PIN[4]/ROD.L,190],{view:"dan",dir:"e",len:40});
    K.label("Hạt thuốc tím",[366,494],{view:"doiluu",dir:"w",len:60});K.label("Nước",[640,300],{view:"doiluu",dir:"e",len:30});K.label("Đèn cồn",[342,590],{view:"doiluu",dir:"w",len:30});
    K.label("Bóng đèn",[500,210],{view:"bucxa",dir:"n",len:20});
    K.label("Vòng kim loại",[400,330],{view:"no",dir:"e",len:40});K.label("Quả cầu",()=>S.no.heatB&&!S.no.test?[98,330]:[262,200],{view:"no",dir:"w",len:30});

    /* ================= khay, thông tin ================= */
    K.dockFn(()=>{const v=K.view;
      if(v==="dan")return[{k:"dan",label:S.dan.on?"Tắt đèn cồn":"Đốt đèn cồn",icon:IC.fire,on:S.dan.on},{k:"rDan",label:"Làm lại",icon:IC.reset}];
      if(v==="doiluu")return[{k:"dl",label:S.dl.on?"Tắt đèn":"Đun cốc nước",icon:IC.fire,on:S.dl.on},{k:"rDl",label:"Làm lại",icon:IC.reset}];
      if(v==="bucxa")return[{k:"bx",label:S.bx.on?"Tắt đèn":"Bật đèn",icon:IC.sun,on:S.bx.on},{k:"rBx",label:"Làm lại",icon:IC.reset}];
      const N=S.no;return[{k:"hb",label:N.heatB?"Thôi hơ quả cầu":"Hơ quả cầu",icon:IC.fire,on:N.heatB},{k:"hr",label:N.heatR?"Thôi hơ vòng":"Hơ vòng",icon:IC.fire,on:N.heatR},
        {k:"test",label:"Thả qua vòng",icon:IC.step,dis:!!N.test},{k:"hbi",label:N.heatBi?"Thôi hơ băng kép":"Hơ băng kép",icon:IC.thermo,on:N.heatBi},{k:"rNo",label:"Làm lại",icon:IC.reset}]});
    K.onDock(k=>{const N=S.no;
      if(k==="dan"){S.dan.on=!S.dan.on}else if(k==="rDan")S.dan=freshDan();
      else if(k==="dl")S.dl.on=!S.dl.on;else if(k==="rDl")S.dl=freshDl();
      else if(k==="bx")S.bx.on=!S.bx.on;else if(k==="rBx")S.bx=freshBx();
      else if(k==="hb")N.heatB=!N.heatB;else if(k==="hr")N.heatR=!N.heatR;else if(k==="hbi")N.heatBi=!N.heatBi;
      else if(k==="test"){if(!N.test)N.test={t:0,done:false,pass:null}}else if(k==="rNo")S.no=freshNo();
      refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="dan"){const D=S.dan;return `<div><b>Dẫn nhiệt</b> · tua nhanh ×${ACC.dan}</div><div>Thời gian thật: ${fmt(D.t,0)} s · đầu nóng ${fmt(D.TB,0)} °C</div>${MAT.map((m,ri)=>`<div><i style="background:${m.col}"></i>${m.ten}: ${D.rods[ri].fall.filter(f=>f!=null).length}/5 đinh rơi</div>`).join("")}<small>Sáp chảy ở khoảng 60 °C; màu trên thanh cho biết nhiệt độ.</small>`}
      if(v==="doiluu"){const L=S.dl;return `<div><b>Đối lưu</b> · tua nhanh ×${ACC.doiluu}</div><div>Thời gian thật: ${fmt(L.t,0)} s · nước ${fmt(L.T,0)} °C</div><small>${L.on?"Nước nóng ở chỗ đun đi lên, nước nguội chìm xuống.":"Bấm “Đun cốc nước” ở khay."}</small>`}
      if(v==="bucxa"){const B=S.bx;return `<div><b>Bức xạ nhiệt</b> · tua nhanh ×${ACC.bucxa}</div><div>Thời gian thật: ${fmt(B.t,0)} s</div><div><i style="background:#F87171"></i>Bình đen: ${fmt(B.T[0],1)} °C</div><div><i style="background:#93C5FD"></i>Bình bạc: ${fmt(B.T[1],1)} °C</div>`}
      const N=S.no;return `<div><b>Nở vì nhiệt</b> (đồng thau)</div><div>Quả cầu ${fmt(N.Tb,0)} °C: Ø ${fmt(dB(),3)} mm</div><div>Lỗ vòng ${fmt(N.Tr,0)} °C: Ø ${fmt(dR(),3)} mm</div><small>Hình vẽ phóng đại độ nở; số đo tính từ hệ số nở dài.</small>`});
    K.timeLabel(()=>{const v=K.view;const t=v==="dan"?S.dan.t:v==="doiluu"?S.dl.t:v==="bucxa"?S.bx.t:0;return v==="no"?`Quả cầu ${fmt(S.no.Tb,0)} °C · vòng ${fmt(S.no.Tr,0)} °C`:[`Thời gian thật ${fmt(t,0)} s · ${K.views[v].label.toLowerCase()}`,v==="bucxa"?Math.min(1,t/180):null]});
    K.onReset(()=>{S.dan=freshDan();S.dl=freshDl();S.bx=freshBx();S.no=freshNo();refresh()});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"dan",p:[226,520],tip:S.dan.on?"Chạm để tắt đèn cồn":"Chạm để đốt đèn cồn",view:"dan"},{k:"dl",p:[372,540],tip:S.dl.on?"Chạm để tắt đèn cồn":"Chạm để đốt đèn cồn",view:"doiluu"},{k:"bx",p:[500,250],tip:S.bx.on?"Chạm để tắt bóng đèn":"Chạm để bật bóng đèn",view:"bucxa"},{k:"hb",p:[160,440],tip:S.no.heatB?"Chạm để thôi hơ quả cầu":"Chạm để hơ quả cầu trên đèn cồn",view:"no"},{k:"test",p:[330,345],tip:"Chạm vòng để thả quả cầu qua vòng",view:"no"},{k:"hbi",p:[790,300],tip:S.no.heatBi?"Chạm để thôi hơ băng kép":"Chạm để hơ băng kép",view:"no"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){S.dan.on=true;S.dl.on=true;S.bx.on=true;S.no.heatB=true;
        const N=S.no;N.Tb=300;S.no.test={t:0,done:false};setTimeout(()=>{N.heatR=true;N.Tr=300;N.test={t:0,done:false}},4500)}};
    return K.mount(st)}
});
})();
