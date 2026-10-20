/* K9-S-01 · Lai một cặp và hai cặp tính trạng (Mendel) (SGK KHTN 9 – Kết nối tri thức, Bài 37) · 2D, điều tra
   1. Lai một cặp tính trạng ở đậu Hà Lan: màu hạt vàng (A) trội hoàn toàn so với xanh (a). P: AA × aa → F1: Aa; F1 tự thụ phấn → F2.
      Lai phân tích: F1 (Aa) × aa.
   2. Lai hai cặp tính trạng: vàng (A) – xanh (a), trơn (B) – nhăn (b); F1 AaBb tự thụ phấn → F2 9 : 3 : 3 : 1.
   Mỗi hạt F2 được tạo bằng cách chọn ngẫu nhiên một giao tử của bố và một giao tử của mẹ (phân li độc lập), học sinh đếm và so sánh với số liệu của Mendel. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const MENDEL={mau:{t:6022,l:2001},hai:[315,108,101,32]};   /* Mendel (1866): màu hạt 6022 vàng : 2001 xanh; F2 hai tính trạng 315 : 108 : 101 : 32 */

const SPEC={
  predict:[{id:"p1",q:"Lai cây đậu hạt vàng thuần chủng với cây hạt xanh thuần chủng, F1 có hạt:",opts:[["vang","Toàn hạt vàng"],["xanh","Toàn hạt xanh"],["ca","Một nửa vàng, một nửa xanh"]],ans:"vang",res:"Kết quả: F1 đồng tính hạt vàng: vàng là tính trạng trội."},
    {id:"p2",q:"Cho F1 tự thụ phấn, tỉ lệ kiểu hình ở F2 xấp xỉ:",opts:[["31","3 vàng : 1 xanh"],["11","1 vàng : 1 xanh"],["10","Toàn vàng"]],ans:"31",res:"Kết quả: F2 phân li theo tỉ lệ xấp xỉ 3 trội : 1 lặn."}],
  taskLead:"Chọn phần ở khay. Bấm “Gieo hạt” để tạo các hạt đời con ngẫu nhiên; gieo càng nhiều, tỉ lệ càng gần với tỉ lệ lí thuyết.",
  tasks:[{html:"<b>Một cặp tính trạng:</b> tạo F1, rồi gieo ít nhất 400 hạt F2 và đọc tỉ lệ.",done:()=>S.m.f1&&S.m.n.F2>=400},
    {html:"<b>Lai phân tích:</b> gieo ít nhất 100 hạt của phép lai F1 × hạt xanh.",done:()=>S.m.n.PT>=100},
    {html:"<b>Hai cặp tính trạng:</b> gieo ít nhất 400 hạt F2.",done:()=>S.h.n>=400}],
  obs:[{id:"a",q:"Tỉ lệ 3 : 1 ở F2 được giải thích là do:",opts:[["gt","F1 (Aa) tạo hai loại giao tử A và a với tỉ lệ ngang nhau; các giao tử kết hợp ngẫu nhiên"],["tron","Các nhân tố di truyền hòa trộn vào nhau"],["moitruong","Môi trường làm đổi màu hạt"]],ans:"gt",why:"F2: 1 AA : 2 Aa : 1 aa → 3 vàng : 1 xanh."},
    {id:"b",q:"Lai phân tích F1 với cây hạt xanh cho tỉ lệ 1 : 1 chứng tỏ:",opts:[["dh","F1 có kiểu gene dị hợp Aa"],["dong","F1 đồng hợp AA"],["lan","Hạt xanh là trội"]],ans:"dh",why:"Cây aa chỉ cho giao tử a; F1 cho A và a tỉ lệ 1 : 1."},
    {id:"c",q:"F2 lai hai cặp tính trạng có tỉ lệ 9 : 3 : 3 : 1 vì:",opts:[["dl","Hai cặp nhân tố di truyền phân li độc lập, tổ hợp tự do"],["lk","Hai tính trạng luôn đi cùng nhau"],["nn","Do ngẫu nhiên"]],ans:"dl",why:"(3 : 1) × (3 : 1) = 9 : 3 : 3 : 1."}],
  concl:{html:`<ul class="tlist"><li><b>Quy luật phân li</b>: mỗi tính trạng do một cặp nhân tố di truyền quy định; khi giảm phân, mỗi giao tử chỉ chứa một nhân tố của cặp; F1 dị hợp tự thụ phấn cho F2 phân li 3 trội : 1 lặn (1 AA : 2 Aa : 1 aa).</li>
    <li><b>Lai phân tích</b>: lai cá thể mang tính trạng trội cần xác định kiểu gene với cá thể mang tính trạng lặn.</li>
    <li><b>Quy luật phân li độc lập</b>: các cặp nhân tố di truyền phân li độc lập trong quá trình phát sinh giao tử; F2 của phép lai hai cặp tính trạng: 9 : 3 : 3 : 1.</li></ul>`,
    quiz:[{id:"q1",q:"Kiểu gene nào tạo được 4 loại giao tử?",opts:[["a","AaBb"],["b","AABb"],["c","aabb"]],ans:"a",why:{b:"AABb chỉ tạo AB và Ab.",c:"aabb chỉ tạo ab."}},
      {id:"q2",q:"P: Aa × aa cho đời con có tỉ lệ kiểu hình:",opts:[["a","1 trội : 1 lặn"],["b","3 trội : 1 lặn"],["c","Toàn trội"]],ans:"a",why:{b:"Đó là Aa × Aa.",c:"Đó là AA × aa."}}],
    done:`<h2>Hoàn thành: Các quy luật di truyền của Mendel</h2><p class="muted">Phân li 3 : 1; lai phân tích 1 : 1; phân li độc lập 9 : 3 : 3 : 1.</p>`},
  gv:["Cho các nhóm cùng gieo 100 hạt rồi cộng kết quả cả lớp; so sánh với số liệu của Mendel.","Hỏi: vì sao gieo ít hạt tỉ lệ có thể lệch nhiều?","Mở rộng: thí nghiệm gieo đồng xu (hai mặt tượng trưng cho hai loại giao tử)."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 37)</p><ul class="tlist"><li>Nêu được ý tưởng của Mendel về nhân tố di truyền; dựa vào thí nghiệm lai một cặp, hai cặp tính trạng, nêu được quy luật phân li, phân li độc lập.</li><li>Phân biệt được các thuật ngữ: tính trạng, nhân tố di truyền, cơ thể thuần chủng, cặp tính trạng tương phản, gene trội, gene lặn, kiểu hình, kiểu gene, đồng hợp, dị hợp, lai phân tích.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 37 Các quy luật di truyền của Mendel.</li>
<li>Số liệu gốc của Mendel (1866) – màu hạt F2: 6 022 vàng : 2 001 xanh; hai tính trạng F2: 315 vàng trơn, 108 xanh trơn, 101 vàng nhăn, 32 xanh nhăn: <a href="https://www.mendelweb.org/Mendel.html" target="_blank" rel="noopener">MendelWeb – bản dịch “Experiments in Plant Hybridization”</a>; <a href="https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits" target="_blank" rel="noopener">OpenStax Biology 2e, mục 12.2</a>.</li></ul>`;

let S;
LabKHTN.register("K9-S-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"pl",t:"Phép lai"},{k:"so",t:"Số hạt đếm được"},{k:"tl",t:"Tỉ lệ"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng phép lai của Mendel ở đậu Hà Lan",views:{mot:{label:"Một cặp tính trạng",icon:IC.dna,frame:[20,20,960,600]},hai:{label:"Hai cặp tính trạng",icon:IC.grid,frame:[20,20,960,600]}}});
    const rnd=Math.random;   /* mỗi lần gieo khác nhau như thí nghiệm thật */
    S={m:{cross:"F2",f1:false,seeds:{F2:[],PT:[]},n:{F2:0,PT:0}},h:{seeds:[],n:0,cnt:[0,0,0,0]},recs:0};
    const rec=(pl,so,tl)=>{S.recs++;api.record({lan:String(S.recs),pl,so,tl})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const YEL="#E9C93B",GRN="#7DAA3A";
    function pea(ctx,x,y,r,yellow,round){ctx.save();ctx.translate(x,y);const g=ctx.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r);const c=yellow?YEL:GRN;g.addColorStop(0,C.mix(c,"#FFFFFF",.55));g.addColorStop(.6,c);g.addColorStop(1,C.mix(c,"#000000",.35));ctx.fillStyle=g;
      ctx.beginPath();if(round)ctx.arc(0,0,r,0,6.283);else{for(let i=0;i<=24;i++){const a=i/24*6.283;const rr=r*(.86+.1*Math.sin(a*5)+.04*Math.cos(a*9));i?ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr):ctx.moveTo(Math.cos(a)*rr,Math.sin(a)*rr)}ctx.closePath()}ctx.fill();
      if(!round){ctx.strokeStyle=C.rgba(C.mix(c,"#000000",.5),.5);ctx.lineWidth=Math.max(1,r*.08);for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(r*.1,r*.05,r*(.3+k*.2),-.6+k,.8+k);ctx.stroke()}}ctx.restore()}
    const lbl=(ctx,t,x,y,s,c,a)=>D2.text(ctx,t,x,y,{s:s||16,w:800,c:c,a:a||"center"});
    /* ---------------- một cặp ---------------- */
    function sow1(n){const M=S.m,cr=M.cross;const L=M.seeds[cr];for(let i=0;i<n;i++){const g1=rnd()<.5?"A":"a",g2=cr==="F2"?(rnd()<.5?"A":"a"):"a";L.push(g1+g2)}M.n[cr]=L.length;
      const y=L.filter(s=>s.includes("A")).length,x=L.length-y;if([100,400,1000].includes(L.length)||L.length%500===0)rec(cr==="F2"?"F1 × F1 (Aa × Aa)":"Lai phân tích: F1 (Aa) × aa",`${L.length} hạt: ${y} vàng, ${x} xanh`,cr==="F2"?`${fmt(y/Math.max(1,x),2)} : 1 (lí thuyết 3 : 1; Mendel ${fmt(MENDEL.mau.t/MENDEL.mau.l,2)} : 1)`:`${fmt(y/Math.max(1,x),2)} : 1 (lí thuyết 1 : 1)`);refresh()}
    function draw1(ctx,P){const M=S.m;
      /* sơ đồ lai */
      lbl(ctx,"P (thuần chủng)",120,60,17,P.mut);pea(ctx,80,100,20,true,true);lbl(ctx,"AA",80,140,16,P.ink);lbl(ctx,"×",120,106,24,P.ink);pea(ctx,160,100,20,false,true);lbl(ctx,"aa",160,140,16,P.ink);
      D2.arrow(ctx,120,150,120,190,P.mut,2);lbl(ctx,"F1",60,220,17,P.mut);if(M.f1){pea(ctx,120,215,20,true,true);lbl(ctx,"Aa (100% vàng)",120,256,15,P.ink)}else lbl(ctx,"chưa lai",120,220,15,P.mut);
      /* bảng Punnett */
      const cr=M.cross,px=60,py=300,cw=60;lbl(ctx,cr==="F2"?"F1 × F1: Aa × Aa":"Lai phân tích: Aa × aa",150,py-14,16,P.ink);
      const g1=["A","a"],g2=cr==="F2"?["A","a"]:["a","a"];
      ctx.strokeStyle=P.line;ctx.lineWidth=1.5;for(let i=0;i<=3;i++){ctx.beginPath();ctx.moveTo(px,py+i*cw);ctx.lineTo(px+3*cw,py+i*cw);ctx.stroke();ctx.beginPath();ctx.moveTo(px+i*cw,py);ctx.lineTo(px+i*cw,py+3*cw);ctx.stroke()}
      lbl(ctx,"♀ \\ ♂",px+cw/2,py+cw/2+6,14,P.mut);g1.forEach((g,i)=>lbl(ctx,g,px+cw*(1.5+i),py+cw/2+6,20,P.ink));g2.forEach((g,j)=>lbl(ctx,g,px+cw/2,py+cw*(1.5+j)+6,20,P.ink));
      for(let i=0;i<2;i++)for(let j=0;j<2;j++){const gt=[g1[i],g2[j]].sort().join("");const yv=gt.includes("A");pea(ctx,px+cw*(1.5+i),py+cw*(1.5+j)-6,13,yv,true);lbl(ctx,gt,px+cw*(1.5+i),py+cw*(1.5+j)+22,13,P.ink)}
      /* hạt đã gieo */
      const L=M.seeds[cr];const ox=300,oy=60,cols=40,sz=15;D2.block(ctx,ox-12,oy-12,cols*sz+24,25*sz+24,12,P.card,P.card,{stroke:P.line,shadow:false});
      const shown=L.slice(-1000);for(let k=0;k<shown.length;k++){const c=k%cols,r=Math.floor(k/cols);if(r>=25)break;pea(ctx,ox+c*sz+sz/2,oy+r*sz+sz/2,sz*.42,shown[k].includes("A"),true)}
      const y=L.filter(s=>s.includes("A")).length,x=L.length-y;
      lbl(ctx,`Đã gieo ${L.length} hạt (hiện tối đa 1 000 hạt gần nhất)`,ox+cols*sz/2,oy+25*sz+36,15,P.mut);
      /* cột tỉ lệ */
      const bx=420,by=560,bw=200;const tot=Math.max(1,L.length);D2.block(ctx,bx,by,bw*2+120,28,8,"rgba(0,0,0,.15)","rgba(0,0,0,.15)",{shadow:false});
      ctx.fillStyle=YEL;ctx.fillRect(bx,by,(bw*2+120)*y/tot,28);ctx.fillStyle=GRN;ctx.fillRect(bx+(bw*2+120)*y/tot,by,(bw*2+120)*x/tot,28);
      lbl(ctx,`Vàng ${y} (${fmt(y/tot*100,1)}%)`,bx+6,by+50,16,P.ink,"left");lbl(ctx,`Xanh ${x} (${fmt(x/tot*100,1)}%)`,bx+bw*2+120,by+50,16,P.ink,"right");
      if(L.length)lbl(ctx,`Tỉ lệ ≈ ${fmt(y/Math.max(1,x),2)} : 1`,bx+(bw*2+120)/2,by+50,18,K.day?"#B45309":"#FCD34D")}
    /* ---------------- hai cặp ---------------- */
    const PH=[["Vàng, trơn",true,true],["Xanh, trơn",false,true],["Vàng, nhăn",true,false],["Xanh, nhăn",false,false]];
    function sow2(n){const Hh=S.h;for(let i=0;i<n;i++){const a=(rnd()<.5?1:0)+(rnd()<.5?1:0),b=(rnd()<.5?1:0)+(rnd()<.5?1:0);const yv=a>0,rd=b>0;const idx=yv&&rd?0:!yv&&rd?1:yv&&!rd?2:3;Hh.cnt[idx]++;Hh.seeds.push(idx)}Hh.n=Hh.seeds.length;
      if([160,400,1000].includes(Hh.n)||Hh.n%800===0){const c=Hh.cnt,m=c[3]||1;rec("F1 × F1 (AaBb × AaBb)",`${Hh.n} hạt: ${c.join(" : ")}`,`≈ ${c.map(v=>fmt(v/m,1)).join(" : ")} (lí thuyết 9 : 3 : 3 : 1; Mendel 315 : 108 : 101 : 32)`)}refresh()}
    function draw2(ctx,P){const Hh=S.h;
      lbl(ctx,"P: vàng, trơn (AABB) × xanh, nhăn (aabb)",230,50,17,P.ink);pea(ctx,90,90,18,true,true);lbl(ctx,"×",130,96,22,P.ink);pea(ctx,170,90,18,false,false);D2.arrow(ctx,240,90,300,90,P.mut,2);
      lbl(ctx,"F1: AaBb (100% vàng, trơn)",420,96,16,P.ink,"left");pea(ctx,400,90,18,true,true);
      /* Punnett 4×4 */
      const G4=["AB","Ab","aB","ab"],px=40,py=150,cw=56;ctx.strokeStyle=P.line;ctx.lineWidth=1.2;for(let i=0;i<=5;i++){ctx.beginPath();ctx.moveTo(px,py+i*cw);ctx.lineTo(px+5*cw,py+i*cw);ctx.stroke();ctx.beginPath();ctx.moveTo(px+i*cw,py);ctx.lineTo(px+i*cw,py+5*cw);ctx.stroke()}
      G4.forEach((g,i)=>{lbl(ctx,g,px+cw*(1.5+i),py+cw/2+6,16,P.ink);lbl(ctx,g,px+cw/2,py+cw*(1.5+i)+6,16,P.ink)});
      for(let i=0;i<4;i++)for(let j=0;j<4;j++){const g=G4[i]+G4[j];const yv=g.includes("A"),rd=g.includes("B");pea(ctx,px+cw*(1.5+i),py+cw*(1.5+j)-5,12,yv,rd);
        const gt=[g[0],g[2]].sort().join("")+[g[1],g[3]].sort().join("");lbl(ctx,gt,px+cw*(1.5+i),py+cw*(1.5+j)+20,11,P.mut)}
      /* kết quả gieo */
      const ox=380,oy=150;const tot=Math.max(1,Hh.n);PH.forEach((p,i)=>{const y=oy+i*95;pea(ctx,ox+20,y+30,20,p[1],p[2]);lbl(ctx,p[0],ox+52,y+24,17,P.ink,"left");lbl(ctx,`${Hh.cnt[i]} hạt`,ox+52,y+46,15,P.mut,"left");
        const w=C.clamp(Hh.cnt[i]/tot,0,1)*380;ctx.fillStyle=p[1]?YEL:GRN;ctx.globalAlpha=.85;ctx.fillRect(ox+180,y+14,w,30);ctx.globalAlpha=1;ctx.strokeStyle=P.line;ctx.strokeRect(ox+180,y+14,380,30);
        lbl(ctx,`${fmt(Hh.cnt[i]/tot*100,1)}% (lí thuyết ${[56.25,18.75,18.75,6.25][i].toString().replace(".",",")}%)`,ox+570,y+35,14,P.ink,"right")});
      if(Hh.n){const m=Hh.cnt[3]||1;lbl(ctx,`Tỉ lệ ≈ ${Hh.cnt.map(v=>fmt(v/m,1)).join(" : ")} (${Hh.n} hạt)`,ox+290,oy+410,18,K.day?"#B45309":"#FCD34D")}}
    K.drawFn((ctx,P)=>K.view==="mot"?draw1(ctx,P):draw2(ctx,P));
    K.label("Bảng tổ hợp giao tử (Punnett)",[60,300],{view:"mot",dir:"w",len:20});K.label("Giao tử của F1",[208,180],{view:"hai",dir:"n",len:20});
    K.dockFn(()=>{if(K.view==="mot"){const M=S.m;return[{k:"f1",label:"Lai P → F1",icon:IC.dna,dis:M.f1},{seg:[{k:"cr",v:"F2",label:"F1 × F1",icon:"",on:M.cross==="F2"},{k:"cr",v:"PT",label:"Lai phân tích",icon:"",on:M.cross==="PT"}],label:"Phép lai"},
        {grid:[{k:"s1",v:"10",label:"Gieo 10 hạt",icon:IC.plus,dis:!M.f1},{k:"s1",v:"100",label:"Gieo 100 hạt",icon:IC.plus,dis:!M.f1}]},{k:"c1",label:"Xóa kết quả",icon:IC.reset}]}
      return[{grid:[{k:"s2",v:"16",label:"Gieo 16 hạt",icon:IC.plus},{k:"s2",v:"160",label:"Gieo 160 hạt",icon:IC.plus}]},{k:"c2",label:"Xóa kết quả",icon:IC.reset}]});
    K.onDock((k,v)=>{const M=S.m;
      if(k==="f1"){M.f1=true;rec("P: hạt vàng (AA) × hạt xanh (aa)","F1: 100% hạt vàng","Kiểu gene F1: Aa; vàng trội hoàn toàn so với xanh")}else if(k==="cr")M.cross=v;else if(k==="s1")sow1(+v);else if(k==="c1"){M.seeds[M.cross]=[];M.n[M.cross]=0}
      else if(k==="s2")sow2(+v);else if(k==="c2")Object.assign(S.h,{seeds:[],n:0,cnt:[0,0,0,0]});refresh()});
    K.infoFn(()=>{if(K.view==="mot"){const M=S.m;return `<div><b>Lai một cặp tính trạng</b> (màu hạt)</div><div>A: vàng (trội) · a: xanh (lặn)</div><div>${M.f1?"F1: Aa (vàng)":"Bấm “Lai P → F1”"}</div><small>Mendel đếm được ${MENDEL.mau.t} hạt vàng : ${MENDEL.mau.l} hạt xanh ở F2 (≈ ${fmt(MENDEL.mau.t/MENDEL.mau.l,2)} : 1).</small>`}
      return `<div><b>Lai hai cặp tính trạng</b></div><div>A: vàng, a: xanh · B: trơn, b: nhăn</div><small>F1 AaBb cho 4 loại giao tử AB, Ab, aB, ab với tỉ lệ ngang nhau.</small>`});
    K.timeLabel(()=>K.view==="mot"?`Đã gieo ${S.m.n[S.m.cross]} hạt`:`Đã gieo ${S.h.n} hạt`);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"f1",p:[120,170],tip:"Chạm để lai hai cây P",view:"mot"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K._dockH("f1");S.m.cross="F2";sow1(400);S.m.cross="PT";sow1(100);S.m.cross="F2";sow2(400)}};
    return K.mount(st)}
});
})();
