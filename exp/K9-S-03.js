/* K9-S-03 · Tái bản DNA, phiên mã, dịch mã (SGK KHTN 9 – Kết nối tri thức, Bài 39–40) · mô hình 2D
   1. Tái bản DNA: enzyme tháo xoắn tách hai mạch; DNA polymerase lắp nucleotide tự do theo nguyên tắc bổ sung (A – T, G – C),
      mạch mới kéo dài theo chiều 5′ → 3′: một mạch tổng hợp liên tục, mạch kia tổng hợp từng đoạn ngắn rồi được nối lại.
      Kết quả: hai phân tử DNA con giống hệt nhau và giống mẹ, mỗi phân tử có một mạch cũ, một mạch mới (nguyên tắc bán bảo toàn).
   2. Phiên mã: RNA polymerase dùng mạch khuôn của gene (3′ → 5′) tổng hợp mRNA (5′ → 3′): A – U, T – A, G – C, C – G.
   3. Dịch mã: ribosome trượt trên mRNA từng bộ ba; tRNA mang amino acid có bộ ba đối mã khớp bổ sung với codon;
      bắt đầu ở AUG (Met), dừng ở mã kết thúc (UAA). Bảng mã dùng là bảng mã di truyền chuẩn. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const COL={A:"#E53935",T:"#FDD835",G:"#43A047",C:"#1E88E5",U:"#AB47BC"};
const DPAIR={A:"T",T:"A",G:"C",C:"G"},RPAIR={A:"U",T:"A",G:"C",C:"G"},RR={A:"U",U:"A",G:"C",C:"G"};
/* ---- tái bản ---- */
const RSEQ="TACGGCATTCAGGCTA";   /* mạch khuôn trên, viết 3′ → 5′ từ trái sang phải (trình tự minh họa) */
const RN=RSEQ.length;
/* ---- gene dùng cho phiên mã và dịch mã ---- */
const CODING="ATGGCTTTCAAAGGCTGGTAA";   /* mạch mã hóa 5′ → 3′ */
const TEMPL=CODING.split("").map(b=>DPAIR[b]).join("");   /* mạch khuôn 3′ → 5′ */
const MRNA=CODING.replace(/T/g,"U");
const CODE={AUG:["Met","Methionine"],GCU:["Ala","Alanine"],UUC:["Phe","Phenylalanine"],AAA:["Lys","Lysine"],GGC:["Gly","Glycine"],UGG:["Trp","Tryptophan"],UAA:null,
  CUU:["Leu","Leucine"],UCU:["Ser","Serine"],GAA:["Glu","Glutamic acid"]};   /* trích bảng mã di truyền chuẩn */
const AAC={Met:"#F59E0B",Ala:"#22D3EE",Phe:"#F472B6",Lys:"#A3E635",Gly:"#FB923C",Trp:"#818CF8",Leu:"#2DD4BF",Ser:"#FCA5A5",Glu:"#C084FC"};
const NCOD=MRNA.length/3;
const TRNAS=["AUG","GCU","UUC","AAA","GGC","UGG","CUU","GAA"].map(c=>({c,anti:c.split("").map(x=>RR[x]).join(""),aa:CODE[c][0]}));

const SPEC={
  predict:[{id:"p1",q:"Sau một lần tái bản, mỗi phân tử DNA con gồm:",opts:[["ban","Một mạch của DNA mẹ và một mạch mới tổng hợp"],["moi","Hai mạch đều mới"],["cu","Hai mạch đều của DNA mẹ"]],ans:"ban",res:"Kết quả: mỗi DNA con giữ lại một mạch của mẹ (nguyên tắc bán bảo toàn)."},
    {id:"p2",q:"Trong phân tử RNA, base nào thay cho thymine (T) của DNA?",opts:[["U","Uracil (U)"],["A","Adenine (A)"],["G","Guanine (G)"]],ans:"U",res:"Kết quả: RNA dùng uracil (U); khi phiên mã, A trên mạch khuôn ghép với U."}],
  taskLead:"Chọn phần ở khay. Mỗi phần có nút chạy tự động và nút thao tác từng bước.",
  tasks:[{html:"<b>Tái bản:</b> cho quá trình tái bản chạy tới khi tạo xong hai DNA con.",done:()=>S.r.done},
    {html:"<b>Phiên mã:</b> lắp đủ 21 ribonucleotide của mRNA (tự chọn ít nhất 3).",done:()=>S.t.k>=MRNA.length&&S.t.self>=3},
    {html:"<b>Dịch mã:</b> chọn đúng tRNA cho từng codon tới mã kết thúc.",done:()=>S.d.done}],
  obs:[{id:"a",q:"Mạch khuôn của gene có đoạn 3′-TAC-5′. Đoạn mRNA tương ứng là:",opts:[["ok","5′-AUG-3′"],["dna","5′-ATG-3′"],["sai","5′-UAC-3′"]],ans:"ok",why:"T – A, A – U, C – G; RNA dùng U thay T."},
    {id:"b",q:"Mỗi amino acid trong chuỗi polypeptide được quy định bởi:",opts:[["ba","Một bộ ba nucleotide (codon) trên mRNA"],["mot","Một nucleotide"],["hai","Hai nucleotide"]],ans:"ba",why:"Mã di truyền là mã bộ ba."},
    {id:"c",q:"Quá trình dịch mã dừng lại khi ribosome gặp:",opts:[["kt","Mã kết thúc (UAA, UAG hoặc UGA)"],["md","Mã mở đầu AUG"],["het","Hết tRNA trong tế bào"]],ans:"kt",why:"Không có tRNA nào mang bộ ba đối mã khớp với mã kết thúc."}],
  concl:{html:`<ul class="tlist"><li><b>Tái bản DNA</b>: hai mạch tách nhau; mỗi mạch làm khuôn để tổng hợp mạch mới theo nguyên tắc bổ sung (A – T, G – C). Hai DNA con giống hệt mẹ, mỗi DNA con có một mạch cũ và một mạch mới (nguyên tắc bán bảo toàn).</li>
    <li><b>Phiên mã</b>: thông tin trên mạch khuôn của gene được sao sang mRNA theo nguyên tắc bổ sung (A – U, T – A, G – C, C – G).</li>
    <li><b>Dịch mã</b>: ribosome đọc mRNA theo từng bộ ba; tRNA mang amino acid có bộ ba đối mã khớp với codon; các amino acid nối với nhau tạo chuỗi polypeptide, bắt đầu từ AUG và kết thúc ở mã kết thúc.</li>
    <li>Mối quan hệ: <b>gene (DNA) → mRNA → polypeptide (protein) → tính trạng</b>.</li></ul>`,
    quiz:[{id:"q1",q:"Một đoạn mRNA có 300 nucleotide (tính từ AUG tới hết mã kết thúc). Chuỗi polypeptide tạo ra có bao nhiêu amino acid (tính cả amino acid mở đầu)?",opts:[["a","99"],["b","100"],["c","300"]],ans:"a",why:{b:"300 : 3 = 100 bộ ba, trong đó 1 mã kết thúc không mã hóa amino acid → 99.",c:"Mỗi amino acid ứng với 3 nucleotide."}},
      {id:"q2",q:"Một phân tử DNA tái bản 3 lần liên tiếp tạo ra bao nhiêu DNA con?",opts:[["a","8"],["b","6"],["c","3"]],ans:"a",why:{b:"Mỗi lần số DNA tăng gấp đôi: 2³ = 8.",c:"2³ = 8."}}],
    done:`<h2>Hoàn thành: tái bản, phiên mã, dịch mã</h2><p class="muted">DNA → mRNA → polypeptide, đều theo nguyên tắc bổ sung.</p>`},
  gv:["Cho học sinh đếm số mạch cũ, mạch mới trong hai DNA con.","Hỏi: vì sao chỉ một mạch của gene được dùng làm khuôn phiên mã?","Lưu ý: mô hình trình bày đơn giản; tế bào thật có nhiều enzyme và protein tham gia."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 39, 40)</p><ul class="tlist"><li>Nêu được quá trình tái bản DNA theo nguyên tắc bổ sung và bán bảo toàn; nêu được khái niệm phiên mã, dịch mã; mã di truyền là mã bộ ba; mối quan hệ gene → mRNA → protein → tính trạng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 39 Tái bản DNA và phiên mã tạo RNA; Bài 40 Dịch mã và mối quan hệ từ gene đến tính trạng.</li>
<li>Tái bản DNA (bán bảo toàn, mạch tổng hợp liên tục và mạch tổng hợp từng đoạn): <a href="https://openstax.org/books/biology-2e/pages/14-3-basics-of-dna-replication" target="_blank" rel="noopener">OpenStax Biology 2e, mục 14.3</a>.</li>
<li>Mã di truyền bộ ba, codon – amino acid: <a href="https://openstax.org/books/biology-2e/pages/15-1-the-genetic-code" target="_blank" rel="noopener">OpenStax Biology 2e, mục 15.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Trình tự là ví dụ minh họa (gene ngắn 21 cặp nucleotide). Các enzyme được vẽ dạng khối, không theo hình dạng thật. Mô hình không thể hiện đoạn mồi và các enzyme phụ trợ.</li></ul>`;

let S;
LabKHTN.register("K9-S-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"qt",t:"Quá trình"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô hình tái bản DNA, phiên mã và dịch mã",views:{tb:{label:"Tái bản DNA",icon:IC.dna,frame:[80,96,860,524]},pm:{label:"Phiên mã",icon:IC.swap,frame:[56,30,920,590]},dm:{label:"Dịch mã",icon:IC.grid,frame:[110,100,830,400]}}});
    S={r:{T:0,run:false,done:false},t:{k:0,self:0,auto:false,acc:0,err:0},d:{c:1,anim:0,done:false,err:0,chain:["Met"],fly:null,shift:0},recs:0};
    const rec=(qt,kq)=>{S.recs++;api.record({lan:String(S.recs),qt,kq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    /* một nucleotide: thân (đường + phosphate) nằm trên trục mạch, base nhô về phía mạch đối diện */
    function nt(ctx,x,y,b,up,o){o=o||{};const w=o.w||32,h=o.h||38,c=COL[b];ctx.save();ctx.globalAlpha=o.a==null?1:o.a;
      const y1=up?y-h:y,y2=up?y:y+h;const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,C.mix(c,"#FFFFFF",.25));g.addColorStop(1,C.mix(c,"#000000",.25));ctx.fillStyle=g;
      ctx.beginPath();const tip=up?y1:y2,base=up?y2:y1;const pur=b==="A"||b==="G";
      /* đầu base: purine lõm, pyrimidine nhọn để thấy chúng khớp nhau */
      ctx.moveTo(x-w/2,base);ctx.lineTo(x-w/2,tip+(up?8:-8));if(pur){ctx.lineTo(x-6,tip+(up?8:-8));ctx.lineTo(x,tip+(up?14:-14));ctx.lineTo(x+6,tip+(up?8:-8))}else{ctx.lineTo(x-6,tip+(up?8:-8));ctx.lineTo(x,tip+(up?2:-2));ctx.lineTo(x+6,tip+(up?8:-8))}
      ctx.lineTo(x+w/2,tip+(up?8:-8));ctx.lineTo(x+w/2,base);ctx.closePath();ctx.fill();
      ctx.strokeStyle=o.stroke||"rgba(0,0,0,.35)";ctx.lineWidth=o.sw||1.2;ctx.stroke();
      T(ctx,b,x,(y1+y2)/2+(up?3:7),17,b==="T"?"#3A2F00":"#FFFFFF");ctx.restore()}
    function backbone(ctx,pts,col,w,dash){if(pts.length<2)return;ctx.save();ctx.strokeStyle=col;ctx.lineWidth=w||7;ctx.lineCap="round";ctx.lineJoin="round";if(dash)ctx.setLineDash(dash);ctx.beginPath();pts.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke();ctx.restore()}
    const OLD="#334E9C",OLDd="#1E3A8A",NEW="#7DD3FC",RNA="#C4B5FD";
    const ez=(ctx,x,y,rx,ry,c,txt,P)=>{ctx.save();const g=ctx.createRadialGradient(x-rx*.3,y-ry*.3,4,x,y,Math.max(rx,ry));g.addColorStop(0,C.rgba(C.mix(c,"#FFFFFF",.4),.85));g.addColorStop(1,C.rgba(c,.55));ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,6.283);ctx.fill();ctx.strokeStyle=C.rgba(c,.9);ctx.lineWidth=2;ctx.stroke();ctx.restore();if(txt)T(ctx,txt,x,y+5,13,"#0B1330")};
    /* ================= TÁI BẢN ================= */
    const RX0=150,RDX=46,RY=320;const rx=i=>RX0+i*RDX;
    const leadT=i=>i+2.5,fragStart=k=>4*k+4+1.5,lagT=i=>{const k=Math.floor(i/4);return fragStart(k)+(3-i%4)};
    const RDONE=Math.max(...Array.from({length:RN},(_,i)=>Math.max(leadT(i),lagT(i))))+1.6;
    const srcPos=Array.from({length:RN*2},(_,i)=>[RX0+((i*137)%RN)*RDX+20,RY-40+((i*71)%80)]);
    const FREE=Array.from({length:14},(_,i)=>({b:"ATGC"[i%4],x:140+((i*.618034)%1)*740,y:255+((i*.7548)%1)*130,ph:i*1.7}));
    function drawRep(ctx,P){const R=S.r,Tm=R.T,f=Math.min(RN+2,Tm);
      const op=i=>{const d=f-i-.5;return C.clamp(d/2.2,0,1)};const ease=t=>t*t*(3-2*t);
      const topY=i=>RY-40-150*ease(op(i)),botY=i=>RY+40+150*ease(op(i));
      /* nucleotide tự do trong nhân tế bào */
      for(const n of FREE){const x=n.x+Math.sin(K.simT*.6+n.ph)*14,y=n.y+Math.cos(K.simT*.5+n.ph)*10;const i=Math.round((x-RX0)/RDX);if(i>=-1&&i<=RN&&op(C.clamp(i,0,RN-1))<.97)continue;nt(ctx,x,y,n.b,false,{a:.45})}
      /* mạch cũ (khuôn) */
      const tp=[],bp=[];for(let i=0;i<RN;i++){tp.push([rx(i),topY(i)]);bp.push([rx(i),botY(i)])}
      tp.unshift([rx(0)-30,topY(0)]);tp.push([rx(RN-1)+30,topY(RN-1)]);bp.unshift([rx(0)-30,botY(0)]);bp.push([rx(RN-1)+30,botY(RN-1)]);
      backbone(ctx,tp,OLD,8);backbone(ctx,bp,OLD,8);
      for(let i=0;i<RN;i++){nt(ctx,rx(i),topY(i),RSEQ[i],false,{stroke:OLDd,sw:2});nt(ctx,rx(i),botY(i),DPAIR[RSEQ[i]],true,{stroke:OLDd,sw:2})}
      /* mạch mới */
      const lead=[],lag=[];for(let i=0;i<RN;i++){
        const t1=leadT(i);if(Tm>=t1){const k=C.clamp((Tm-t1)/.6,0,1),e=ease(k);const s=srcPos[i];const tx=rx(i),ty=topY(i)+80;const x=s[0]+(tx-s[0])*e,y=s[1]+(ty-s[1])*e;nt(ctx,x,y,DPAIR[RSEQ[i]],true,{a:.5+.5*e,stroke:"#0369A1",sw:2});if(k>=1)lead.push([tx,ty])}
        const t2=lagT(i);if(Tm>=t2){const k=C.clamp((Tm-t2)/.6,0,1),e=ease(k);const s=srcPos[RN+i];const tx=rx(i),ty=botY(i)-80;const x=s[0]+(tx-s[0])*e,y=s[1]+(ty-s[1])*e;nt(ctx,x,y,RSEQ[i],false,{a:.5+.5*e,stroke:"#0369A1",sw:2});if(k>=1)lag.push([tx,ty,i])}}
      if(lead.length)backbone(ctx,lead.length>1?lead:[[lead[0][0]-12,lead[0][1]],[lead[0][0]+12,lead[0][1]]],NEW,7);
      /* mạch tổng hợp từng đoạn: vẽ từng đoạn, khe hở được nối sau khi hai đoạn kề nhau hoàn tất */
      const frags={};for(const p of lag){const k=Math.floor(p[2]/4);(frags[k]=frags[k]||[]).push(p)}
      const J=k=>Tm>fragStart(k+1)+4.5;const NF=Math.ceil(RN/4);
      for(const k in frags){const L=frags[k].sort((a,b)=>a[0]-b[0]);const kk=+k;const x0=L[0][0]-(kk>0&&J(kk-1)?23:14),x1=L[L.length-1][0]+(kk<NF-1&&J(kk)?23:14);backbone(ctx,[[x0,L[0][1]],[x1,L[0][1]]],NEW,7)}
      /* enzyme */
      if(Tm<RDONE-1){const fx=RX0+(f-.3)*RDX;if(f<RN+1)ez(ctx,Math.min(fx,rx(RN-1)+20),RY,38,30,"#F59E0B","",P);
        const li=Math.floor(Tm-2.5);if(li>=0&&li<RN)ez(ctx,rx(li)+24,topY(li)+62,34,22,"#38BDF8","",P);
        for(let k=0;k<4;k++){const s=fragStart(k);if(Tm>=s&&Tm<s+4){const i=4*k+3-Math.floor(Tm-s);if(i>=0&&i<RN)ez(ctx,rx(i)-24,botY(i)-62,34,22,"#38BDF8","",P)}}}
      /* đầu mạch */
      const end=(t,x,y,c)=>T(ctx,t,x,y,14,c||P.mut);end("3′",rx(0)-46,topY(0)+4);end("5′",rx(RN-1)+46,topY(RN-1)+4);end("5′",rx(0)-46,botY(0)+4);end("3′",rx(RN-1)+46,botY(RN-1)+4);
      if(lead.length>1){end("5′",lead[0][0]-30,lead[0][1]-12,"#7DD3FC");end("3′",lead[lead.length-1][0]+30,lead[0][1]-12,"#7DD3FC")}
      /* chú thích màu */
      const lx=96,ly=612;ctx.fillStyle=OLD;ctx.fillRect(lx,ly-8,26,7);T(ctx,"Mạch cũ (của DNA mẹ)",lx+34,ly,13,P.mut,"left",700);ctx.fillStyle=NEW;ctx.fillRect(lx+220,ly-8,26,7);T(ctx,"Mạch mới tổng hợp",lx+254,ly,13,P.mut,"left",700);
      ctx.globalAlpha=.45;nt(ctx,lx+430,ly-24,"A",false);ctx.globalAlpha=1;T(ctx,"Nucleotide tự do",lx+452,ly,13,P.mut,"left",700)}
    /* ================= PHIÊN MÃ ================= */
    const PX0=172,PDX=37,PYc=230,PN=MRNA.length;const px=i=>PX0+i*PDX;
    function drawTx(ctx,P){const Tt=S.t,p=Tt.k;const fin=p>=PN;const pol=fin?PN+3:p;
      const op=i=>fin||p===0?0:C.clamp(1-(Math.abs(i-(p-3))-4)/3,0,1);const ease=t=>t*t*(3-2*t);
      const cy=i=>PYc-36-46*ease(op(i)),ty=i=>PYc+36+46*ease(op(i));
      /* vùng gene */
      ctx.save();ctx.fillStyle=C.rgba("#A78BFA",.08);C.rr(ctx,px(0)-24,PYc-130,PN*PDX+12,250,14);ctx.fill();ctx.restore();T(ctx,"Gene",px(0)-14,PYc-112,13,"#A78BFA","left");
      const tp=[],bp=[];for(let i=-1;i<=PN;i++){const ii=C.clamp(i,0,PN-1);tp.push([px(i),cy(ii)]);bp.push([px(i),ty(ii)])}backbone(ctx,tp,OLD,7);backbone(ctx,bp,"#1D4ED8",7);
      for(let i=0;i<PN;i++){nt(ctx,px(i),cy(i),CODING[i],false,{stroke:OLDd});nt(ctx,px(i),ty(i),TEMPL[i],true,{stroke:"#1E40AF",sw:2})}
      T(ctx,"Mạch mã hóa 5′",px(0)-24,cy(0)+24,13,P.mut,"right");T(ctx,"3′",px(PN-1)+30,cy(PN-1)+24,13,P.mut);
      T(ctx,"Mạch khuôn 3′",px(0)-24,ty(0)-16,13,"#93C5FD","right");T(ctx,"5′",px(PN-1)+30,ty(PN-1)-16,13,"#93C5FD");
      /* mRNA: 8 ribonucleotide cuối còn ghép với mạch khuôn, phần trước rời ra phía dưới */
      const mp=[];for(let i=0;i<p;i++){const back=p-1-i;const d=ease(C.clamp((back-5)/3,0,1));const hy=ty(i)-80,ly=PYc+36+90;const x=px(i),y=fin?PYc+250:hy+(ly-hy)*d;mp.push([x,y]);
        nt(ctx,x,y,MRNA[i],false,{stroke:"#7C3AED",sw:1.6})}
      if(mp.length>1)backbone(ctx,mp,RNA,6);if(mp.length)T(ctx,"5′",mp[0][0]-26,mp[0][1]+4,13,"#C4B5FD");
      if(!fin){const ex=px(Math.max(0,p-1))+18;ez(ctx,ex,PYc,58,96,"#34D399","",P);
        D2.block(ctx,740,40,220,50,10,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,`Vị trí ${p+1}: mạch khuôn ${TEMPL[p]}`,850,62,14,P.ink);T(ctx,"→ chọn ribonucleotide bổ sung",850,80,12,P.mut,"center",600)}
      else{T(ctx,"mRNA rời khỏi gene, ra tế bào chất để dịch mã",px(PN/2),PYc+316,15,"#C4B5FD")}
      /* quy tắc */
      D2.block(ctx,64,560,420,50,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,"Mạch khuôn → mRNA:  A → U   ·   T → A   ·   G → C   ·   C → G",274,591,14,P.ink)}
    /* ================= DỊCH MÃ ================= */
    const MX0=170,MDX=34,MY=430;const mx=i=>MX0+i*MDX;const cx=c=>mx(c*3+1);
    function tRNA(ctx,x,y,anti,aa,P,a){ctx.save();ctx.globalAlpha=a==null?1:a;
      /* tRNA dạng chữ L rút gọn: thân, hai thùy bên, thùy đối mã ở dưới */
      ctx.fillStyle=C.rgba("#F9A8D4",.9);ctx.strokeStyle="#BE185D";ctx.lineWidth=2;
      ctx.beginPath();ctx.moveTo(x-14,y-26);ctx.lineTo(x-14,y-90);ctx.lineTo(x+14,y-90);ctx.lineTo(x+14,y-26);ctx.closePath();ctx.fill();ctx.stroke();
      for(const s of [-1,1]){ctx.beginPath();ctx.ellipse(x+s*30,y-62,18,13,0,0,6.283);ctx.fill();ctx.stroke()}
      ctx.beginPath();ctx.roundRect?ctx.roundRect(x-48,y-28,96,28,8):ctx.rect(x-48,y-28,96,28);ctx.fill();ctx.stroke();
      for(let j=0;j<3;j++){const b=anti[j];ctx.fillStyle=COL[b];ctx.fillRect(x-48+4+j*30,y-24,26,20);T(ctx,b,x-48+17+j*30,y-9,13,"#fff")}
      ctx.restore();if(aa){D2.ball(ctx,x,y-104,15,AAC[aa]||"#999",aa,"#0B1330")}}
    function drawTl(ctx,P){const Dd=S.d;const sh=Dd.shift;   /* sh: tiến trình trượt 0 → 1 */
      const pos=Dd.c-1+sh;   /* vị trí P-site (đơn vị codon) */
      /* ribosome */
      if(!Dd.done){const rxp=cx(0)+(pos+.5)*MDX*3;ctx.save();ctx.globalAlpha=.55;const g=ctx.createRadialGradient(rxp-30,MY-110,10,rxp,MY-80,170);g.addColorStop(0,"#FDE68A");g.addColorStop(1,"#B45309");ctx.fillStyle=g;
        ctx.beginPath();ctx.ellipse(rxp,MY-82,150,92,0,Math.PI*1.03,Math.PI*1.97);ctx.lineTo(rxp+150,MY-30);ctx.lineTo(rxp-150,MY-30);ctx.closePath();ctx.fill();
        ctx.beginPath();ctx.ellipse(rxp,MY+12,120,24,0,0,6.283);ctx.fill();ctx.restore();
        T(ctx,"Ribosome",rxp+120,MY-150,13,"#FCD34D");
        for(const [k,t] of [[0,"P"],[1,"A"]])T(ctx,t,cx(0)+(pos+k)*MDX*3,MY-40,13,"#FDE68A")}
      /* mRNA */
      const pts=[];for(let i=0;i<MRNA.length;i++)pts.push([mx(i),MY]);pts.unshift([mx(0)-30,MY]);pts.push([mx(MRNA.length-1)+30,MY]);backbone(ctx,pts,RNA,7);
      for(let i=0;i<MRNA.length;i++)nt(ctx,mx(i),MY,MRNA[i],true,{stroke:"#7C3AED",w:30});
      for(let c=0;c<NCOD;c++){ctx.strokeStyle=P.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(mx(c*3)-16,MY+12);ctx.lineTo(mx(c*3)-16,MY+22);ctx.lineTo(mx(c*3+2)+16,MY+22);ctx.lineTo(mx(c*3+2)+16,MY+12);ctx.stroke();
        T(ctx,c===NCOD-1?"mã kết thúc":c===0?"mã mở đầu":`codon ${c+1}`,cx(c),MY+40,12,P.mut,"center",600)}
      T(ctx,"5′",mx(0)-44,MY+4,13,"#C4B5FD");T(ctx,"3′",mx(MRNA.length-1)+44,MY+4,13,"#C4B5FD");
      /* tRNA trong ribosome */
      if(!Dd.done){const pT=TRNAS.find(t=>t.c===MRNA.substr((Dd.c-1)*3,3)),aT=TRNAS.find(t=>t.c===MRNA.substr(Dd.c*3,3));
        if(sh>0){if(pT)tRNA(ctx,cx(Dd.c-1)-sh*50,MY-38-sh*90,pT.anti,null,P,1-sh);if(aT)tRNA(ctx,cx(Dd.c),MY-38,aT.anti,null,P)}
        else{if(pT)tRNA(ctx,cx(Dd.c-1),MY-38,pT.anti,null,P);
          if(Dd.fly){const f=Dd.fly;const e=C.clamp(f.t,0,1),ee=e*e*(3-2*e);const tx=cx(Dd.c),ty=MY-38;const x=900+(tx-900)*ee,y=150+(ty-150)*ee;tRNA(ctx,x,y,f.tr.anti,f.tr.aa,P)}}}
      /* chuỗi polypeptide nối từ tRNA ở vị trí P */
      const ch=Dd.chain;const ax=Dd.done?500:(sh>0?cx(Dd.c):cx(Dd.c-1)),ay=Dd.done?160:MY-142;
      const cp=[];for(let i=ch.length-1,k=0;i>=0;i--,k++)cp.push(Dd.done?[500+(ch.length-1)/2*46-k*46,ay]:[ax-k*30,ay-k*14]);
      ctx.strokeStyle="#E2E8F0";ctx.lineWidth=3;ctx.beginPath();cp.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
      cp.forEach((q,k)=>D2.ball(ctx,q[0],q[1],Dd.done?19:15,AAC[ch[ch.length-1-k]],ch[ch.length-1-k],"#0B1330"));
      if(Dd.done)T(ctx,"Chuỗi polypeptide: "+ch.join(" – "),500,220,16,P.ink);
      else if(Dd.c<NCOD){const cod=MRNA.substr(Dd.c*3,3);D2.block(ctx,120,110,260,56,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,`Codon ở vị trí A: ${cod}`,250,134,15,P.ink);T(ctx,CODE[cod]?"chọn tRNA có bộ ba đối mã khớp":"mã kết thúc → bấm “Kết thúc dịch mã”",250,154,12,P.mut,"center",600)}}
    K.drawFn((ctx,P)=>K.view==="tb"?drawRep(ctx,P):K.view==="pm"?drawTx(ctx,P):drawTl(ctx,P));
    /* ---------------- nhãn ---------------- */
    const OFF=[-9999,-9999];
    K.label("Enzyme tháo xoắn",()=>S.r.done?OFF:[Math.min(RX0+(Math.min(RN+2,S.r.T)-.3)*RDX,RX0+(RN-1)*RDX+20),RY-30],{view:"tb",dir:"ne",len:30});
    K.label("DNA polymerase",()=>{const li=Math.floor(S.r.T-2.5);if(li<0||li>=RN||S.r.done)return OFF;return[RX0+li*RDX+24,RY-40-150+80-22]},{view:"tb",dir:"n",len:26});
    K.label("RNA polymerase",()=>{if(S.t.k>=PN)return OFF;const p=Math.max(0,S.t.k-1);return[px(p)+18,PYc-96]},{view:"pm",dir:"n",len:24});
    K.label("tRNA (bộ ba đối mã ở dưới)",()=>S.d.done?OFF:[cx(S.d.c-1)-48,MY-80],{view:"dm",dir:"w",len:40});K.label("Codon",()=>S.d.done?OFF:[cx(S.d.c)+12,MY-38],{view:"dm",dir:"ne",len:50});
    /* ---------------- chạy ---------------- */
    K.onFrame(dt=>{const R=S.r;if(R.run&&!R.done){R.T+=dt*1.1;if(R.T>=RDONE){R.T=RDONE;R.run=false;R.done=true;
        rec("Tái bản DNA",`mạch khuôn 3′-${RSEQ}-5′ ghép với mạch mới 5′-${RSEQ.split("").map(b=>DPAIR[b]).join("")}-3′; tạo 2 DNA con giống hệt nhau, mỗi DNA con 1 mạch cũ + 1 mạch mới`);refresh()}}
      const Tt=S.t;if(Tt.auto&&Tt.k<PN){Tt.acc+=dt*3;while(Tt.acc>=1&&Tt.k<PN){Tt.acc-=1;addTx(MRNA[Tt.k],false)}}
      const Dd=S.d;if(Dd.fly){Dd.fly.t+=dt*1.6;if(Dd.fly.t>=1){Dd.chain.push(Dd.fly.tr.aa);Dd.fly=null;Dd.shift=.0001}}
      else if(Dd.shift>0){Dd.shift+=dt*1.4;if(Dd.shift>=1){Dd.shift=0;Dd.c++;if(Dd.auto)autoTl();refresh()}}});
    function addTx(b,self){const Tt=S.t;if(Tt.k>=PN)return;const need=RPAIR[TEMPL[Tt.k]];if(b!==need){Tt.err++;api.toast(`Mạch khuôn là ${TEMPL[Tt.k]} → ghép ${need}.`,"warn",1800);return}
      Tt.k++;if(self)Tt.self++;if(Tt.k===PN){Tt.auto=false;rec("Phiên mã",`mạch khuôn 3′-${TEMPL}-5′ → mRNA 5′-${MRNA}-3′ (tự chọn ${Tt.self}, sai ${Tt.err} lần)`)}refresh()}
    function pickT(tr){const Dd=S.d;if(Dd.done||Dd.fly||Dd.shift>0)return;const cod=MRNA.substr(Dd.c*3,3);
      if(!CODE[cod]){Dd.err++;api.toast(`${cod} là mã kết thúc, không có tRNA tương ứng.`,"warn",2000);return}
      if(tr.c!==cod){Dd.err++;api.toast(`Bộ ba đối mã ${tr.anti} không khớp codon ${cod}.`,"warn",1800);return}
      Dd.fly={tr,t:0};refresh()}
    function stopTl(){const Dd=S.d;if(Dd.done||Dd.fly||Dd.shift>0)return;const cod=MRNA.substr(Dd.c*3,3);if(CODE[cod]){Dd.err++;api.toast(`${cod} mã hóa ${CODE[cod][0]}, chưa phải mã kết thúc.`,"warn",1800);return}
      Dd.done=true;Dd.auto=false;rec("Dịch mã",`mRNA 5′-${MRNA}-3′ → chuỗi ${Dd.chain.join(" – ")} (${Dd.chain.length} amino acid; sai ${Dd.err} lần)`);refresh()}
    function autoTl(){const Dd=S.d;if(Dd.done)return;const cod=MRNA.substr(Dd.c*3,3);if(!CODE[cod])stopTl();else pickT(TRNAS.find(t=>t.c===cod))}
    K.dockFn(()=>{const v=K.view;
      if(v==="tb"){const R=S.r;return[{k:"rrun",label:R.done?"Đã xong":R.run?"Tạm dừng":"Bắt đầu tái bản",icon:IC.play,on:R.run,dis:R.done},{k:"rreset",label:"Làm lại",icon:IC.reset}]}
      if(v==="pm"){const Tt=S.t,full=Tt.k>=PN;return[{grid:["A","U","G","C"].map(b=>({k:"tx",v:b,label:b,icon:`<svg viewBox="0 0 40 40"><rect x="9" y="9" width="22" height="22" rx="5" fill="${COL[b]}"/></svg>`,dis:full}))},{k:"txauto",label:Tt.auto?"Tạm dừng":"Tự động",icon:IC.play,on:Tt.auto,dis:full},{k:"txreset",label:"Làm lại",icon:IC.reset}]}
      const Dd=S.d,busy=Dd.done||!!Dd.fly||Dd.shift>0;return[{grid:TRNAS.map(t=>({k:"tr",v:t.c,label:`${t.anti} · ${t.aa}`,icon:`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="${AAC[t.aa]}"/></svg>`,dis:busy}))},{k:"stop",label:"Kết thúc dịch mã",icon:IC.ban,dis:busy},{k:"tlauto",label:"Tự động",icon:IC.play,dis:busy},{k:"tlreset",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k,v)=>{const R=S.r;
      if(k==="rrun")R.run=!R.run;else if(k==="rreset")Object.assign(R,{T:0,run:false,done:false});
      else if(k==="tx")addTx(v,true);else if(k==="txauto")S.t.auto=!S.t.auto;else if(k==="txreset")Object.assign(S.t,{k:0,self:0,auto:false,acc:0,err:0});
      else if(k==="tr")pickT(TRNAS.find(t=>t.c===v));else if(k==="stop")stopTl();else if(k==="tlauto"){S.d.auto=true;autoTl()}
      else if(k==="tlreset")Object.assign(S.d,{c:1,anim:0,done:false,err:0,chain:["Met"],fly:null,shift:0,auto:false});refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="tb"){const R=S.r;return `<div><b>Tái bản DNA</b> · ${RN} cặp nucleotide</div><div><i style="background:${COL.A}"></i>A – T <i style="background:${COL.G};margin-left:10px"></i>G – C</div><div>${R.done?"<b>Xong:</b> 2 DNA con, mỗi DNA con có 1 mạch cũ + 1 mạch mới":`Tiến trình: ${fmt(C.clamp(R.T/RDONE*100,0,100),0)}%`}</div><small>Mạch mới luôn kéo dài theo chiều 5′ → 3′: mạch trên được tổng hợp liên tục, mạch dưới tổng hợp từng đoạn ngắn rồi được nối lại.</small>`}
      if(v==="pm"){const Tt=S.t;return `<div><b>Phiên mã</b> · mRNA ${Tt.k}/${PN} nucleotide</div><div>mRNA: 5′-${MRNA.slice(0,Tt.k)||"…"}</div><small>Chỉ mạch khuôn (3′ → 5′) được dùng. Trình tự mRNA giống mạch mã hóa, chỉ thay T bằng U. Sai: ${Tt.err}.</small>`}
      const Dd=S.d;return `<div><b>Dịch mã</b> · bảng mã (trích)</div><div style="display:grid;grid-template-columns:repeat(3,auto);gap:0 14px">${["AUG","GCU","UUC","AAA","GGC","UGG","CUU","GAA"].map(c=>`<span>${c} → ${CODE[c][0]}</span>`).join("")}<span>UAA → kết thúc</span></div><small>Sai: ${Dd.err}. Amino acid mở đầu Met có thể bị cắt bỏ sau dịch mã.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.r.T=RDONE-.01;S.r.run=true;for(let i=0;i<3;i++)addTx(MRNA[S.t.k],true);S.t.auto=true;S.d.auto=true;autoTl()}};
    return K.mount(st)}
});
})();
