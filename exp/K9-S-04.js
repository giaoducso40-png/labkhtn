/* K9-S-04 · Đột biến gene (SGK KHTN 9 – Kết nối tri thức, Bài 41) · mô hình 2D
   1. Các dạng đột biến điểm: thay thế, mất, thêm một cặp nucleotide. Học sinh chọn vị trí trên gene, gây đột biến và so sánh
      chuỗi polypeptide trước và sau đột biến (dịch theo bảng mã di truyền chuẩn, đầy đủ 64 codon).
   2. Ví dụ thật: bệnh hồng cầu hình liềm – đoạn đầu gene HBB (NM_000518.4, c.1–30: ATG GTG CAT CTG ACT CCT GAG GAG AAG TCT);
      đột biến c.20A>T đổi GAG → GTG, glutamic acid (Glu) → valine (Val) ở vị trí thứ 6 của chuỗi β-globin (thứ 7 nếu tính Met mở đầu). */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const COL={A:"#E53935",T:"#FDD835",G:"#43A047",C:"#1E88E5"};
const PR={A:"T",T:"A",G:"C",C:"G"};
const B4="TCAG",AA1="FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG";   /* bảng mã di truyền chuẩn, thứ tự T C A G */
const AA3={A:"Ala",R:"Arg",N:"Asn",D:"Asp",C:"Cys",Q:"Gln",E:"Glu",G:"Gly",H:"His",I:"Ile",L:"Leu",K:"Lys",M:"Met",F:"Phe",P:"Pro",S:"Ser",T:"Thr",W:"Trp",Y:"Tyr",V:"Val"};
const AAN={Ala:"alanine",Arg:"arginine",Asn:"asparagine",Asp:"aspartic acid",Cys:"cysteine",Gln:"glutamine",Glu:"glutamic acid",Gly:"glycine",His:"histidine",Ile:"isoleucine",Leu:"leucine",Lys:"lysine",Met:"methionine",Phe:"phenylalanine",Pro:"proline",Ser:"serine",Thr:"threonine",Trp:"tryptophan",Tyr:"tyrosine",Val:"valine"};
const AC={Met:"#F59E0B",Tyr:"#F472B6",Lys:"#A3E635",Gly:"#FB923C",Trp:"#818CF8",Leu:"#2DD4BF",His:"#FCA5A5",Val:"#38BDF8",Glu:"#C084FC",Thr:"#FDE68A",Pro:"#94A3B8",Ser:"#FDBA74"};
const acol=a=>AC[a]||"#CBD5E1";
const cod=c=>{const i=16*B4.indexOf(c[0])+4*B4.indexOf(c[1])+B4.indexOf(c[2]);return AA1[i]};
function translate(seq){const out=[];let stop=false,stopAt=-1;for(let i=0;i+3<=seq.length;i+=3){const a=cod(seq.substr(i,3));if(a==="*"){stop=true;stopAt=i/3;break}out.push(AA3[a])}return{aa:out,stop,stopAt}}
const GENE="ATGTACAAAGGCTGGCTTCATTAA";   /* gene minh họa, mạch mã hóa 5′ → 3′: Met – Tyr – Lys – Gly – Trp – Leu – His – kết thúc */
const HBB="ATGGTGCATCTGACTCCTGAGGAGAAGTCT",HBBm=HBB.slice(0,19)+"T"+HBB.slice(20);   /* c.20A>T */

const SPEC={
  predict:[{id:"p1",q:"Thay thế một cặp nucleotide trong gene có thể làm chuỗi polypeptide:",opts:[["nhieu","Không đổi, đổi một amino acid, hoặc ngắn lại – tùy vị trí và base thay thế"],["luon","Luôn thay đổi toàn bộ"],["khong","Không bao giờ thay đổi"]],ans:"nhieu",res:"Kết quả: tùy codon mới tạo thành mà chuỗi polypeptide có thể không đổi, đổi một amino acid hoặc dừng sớm."},
    {id:"p2",q:"Mất một cặp nucleotide ở đầu gene thường gây hậu quả lớn hơn thay thế một cặp vì:",opts:[["khung","Các bộ ba từ điểm đột biến trở đi bị đọc lệch"],["mat","Gene bị mất hoàn toàn"],["dna","DNA không tái bản được"]],ans:"khung",res:"Kết quả: mất hoặc thêm một cặp làm lệch khung đọc, nhiều amino acid phía sau thay đổi."}],
  taskLead:"Ở phần “Các dạng đột biến”: chạm vào một cặp nucleotide trên gene ban đầu, chọn dạng đột biến ở khay rồi chọn base.",
  tasks:[{html:"<b>Thay thế</b> một cặp nucleotide.",done:()=>!!S.done.thay},{html:"<b>Mất</b> một cặp nucleotide.",done:()=>!!S.done.mat},{html:"<b>Thêm</b> một cặp nucleotide.",done:()=>!!S.done.them},
    {html:"<b>Hồng cầu hình liềm:</b> gây đột biến trên gene HBB và quan sát hồng cầu.",done:()=>S.hl.m}],
  obs:[{id:"a",q:"Đột biến gene là:",opts:[["ok","Những biến đổi trong cấu trúc của gene, liên quan tới một hoặc một số cặp nucleotide"],["nst","Biến đổi số lượng nhiễm sắc thể"],["kh","Biến đổi kiểu hình do môi trường"]],ans:"ok",why:"Các dạng thường gặp: mất, thêm, thay thế một cặp nucleotide."},
    {id:"b",q:"Ở bệnh hồng cầu hình liềm, đột biến thay A bằng T làm codon GAG thành GTG. Hậu quả là:",opts:[["ok","Glutamic acid được thay bằng valine trong chuỗi β-globin"],["ngan","Chuỗi β-globin ngắn lại"],["k","Không thay đổi gì"]],ans:"ok",why:"Một amino acid thay đổi làm hemoglobin dễ kết tụ khi thiếu oxygen, hồng cầu biến dạng hình liềm."},
    {id:"c",q:"Khi thêm 3 cặp nucleotide liền nhau vào giữa hai codon, chuỗi polypeptide thường:",opts:[["ok","Thêm một amino acid, các amino acid khác giữ nguyên"],["lech","Lệch khung đọc hoàn toàn"],["dung","Dừng ngay"]],ans:"ok",why:"Thêm đúng một bộ ba không làm lệch khung đọc (nếu bộ ba thêm vào không phải mã kết thúc)."}],
  concl:{html:`<ul class="tlist"><li><b>Đột biến gene</b> là những biến đổi trong cấu trúc của gene, thường liên quan tới một cặp nucleotide: <b>mất</b>, <b>thêm</b> hoặc <b>thay thế</b> một cặp nucleotide.</li>
    <li>Thay thế một cặp có thể không làm đổi amino acid, đổi một amino acid, hoặc tạo mã kết thúc sớm. Mất hoặc thêm một cặp làm <b>lệch khung đọc</b>, thường làm thay đổi nhiều amino acid.</li>
    <li>Nguyên nhân: tác nhân vật lí (tia phóng xạ, tia UV…), hóa học, sinh học, hoặc sai sót ngẫu nhiên khi tái bản DNA.</li>
    <li>Đa số đột biến gene có hại hoặc trung tính, một số có lợi; đột biến gene cung cấp nguyên liệu cho tiến hóa và chọn giống. Ví dụ có hại: bệnh hồng cầu hình liềm.</li></ul>`,
    quiz:[{id:"q1",q:"Đột biến làm codon TAC (Tyr) thành TAA. Hậu quả:",opts:[["a","Chuỗi polypeptide dừng sớm tại vị trí đó"],["b","Thay Tyr bằng amino acid khác"],["c","Không đổi"]],ans:"a",why:{b:"TAA (UAA trên mRNA) là mã kết thúc.",c:"TAA là mã kết thúc nên dịch mã dừng."}},
      {id:"q2",q:"Dạng đột biến nào sau đây chắc chắn không làm thay đổi tổng số nucleotide của gene?",opts:[["a","Thay thế một cặp nucleotide"],["b","Mất một cặp nucleotide"],["c","Thêm một cặp nucleotide"]],ans:"a",why:{b:"Mất một cặp làm giảm 2 nucleotide.",c:"Thêm một cặp làm tăng 2 nucleotide."}}],
    done:`<h2>Hoàn thành: đột biến gene</h2><p class="muted">Thay thế, mất, thêm một cặp nucleotide và hậu quả trên chuỗi polypeptide.</p>`},
  gv:["Cho các nhóm cùng thay thế ở base thứ 3 của một codon rồi so sánh với thay thế ở base thứ 1, thứ 2.","Hỏi: vì sao đột biến mất cặp ở gần cuối gene ít ảnh hưởng hơn ở đầu gene?","Liên hệ: các tác nhân gây đột biến và biện pháp phòng tránh (hạn chế tiếp xúc tia UV, hóa chất độc)."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 41)</p><ul class="tlist"><li>Nêu được khái niệm đột biến gene; các dạng đột biến gene (mất, thêm, thay thế một cặp nucleotide); ý nghĩa và tác hại của đột biến gene.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 41 Đột biến gene.</li>
<li>Trình tự đoạn đầu gene HBB (c.1–30) theo trình tự tham chiếu NM_000518.4: <a href="https://databases.lovd.nl/shared/refseq/HBB_NM_000518.4_codingDNA.html" target="_blank" rel="noopener">LOVD – HBB coding DNA reference sequence</a>.</li>
<li>Đột biến HbS (GAG → GTG, Glu → Val) và bệnh hồng cầu hình liềm: <a href="https://medlineplus.gov/genetics/gene/hbb/" target="_blank" rel="noopener">MedlinePlus Genetics – HBB gene</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Gene ở phần 1 là gene minh họa ngắn (24 cặp nucleotide). Dịch mã bắt đầu từ ATG đầu tiên và dùng bảng mã di truyền chuẩn. Hình hồng cầu là hình vẽ mô phỏng.</li></ul>`;

let S;
LabKHTN.register("K9-S-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"db",t:"Đột biến"},{k:"kq",t:"Chuỗi polypeptide"},{k:"hq",t:"Hậu quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô hình đột biến gene và hậu quả trên chuỗi polypeptide",views:{dang:{label:"Các dạng đột biến",icon:IC.dna,frame:[40,40,920,580]},hl:{label:"Hồng cầu hình liềm",icon:IC.cell,frame:[40,40,920,580]}}});
    S={sel:9,mode:"thay",mut:null,done:{},hl:{m:false},recs:0};
    const rec=(db,kq,hq)=>{S.recs++;api.record({lan:String(S.recs),db,kq,hq})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    function nt(ctx,x,y,b,up,o){o=o||{};const w=o.w||26,h=o.h||30,c=COL[b];const y1=up?y-h:y,y2=up?y:y+h;
      ctx.save();const g=ctx.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,C.mix(c,"#FFFFFF",.25));g.addColorStop(1,C.mix(c,"#000000",.25));ctx.fillStyle=g;
      const tip=up?y1:y2,base=up?y2:y1,s=up?1:-1,pur=b==="A"||b==="G";ctx.beginPath();ctx.moveTo(x-w/2,base);ctx.lineTo(x-w/2,tip+s*7);ctx.lineTo(x-5,tip+s*7);ctx.lineTo(x,tip+s*(pur?12:2));ctx.lineTo(x+5,tip+s*7);ctx.lineTo(x+w/2,tip+s*7);ctx.lineTo(x+w/2,base);ctx.closePath();ctx.fill();
      ctx.strokeStyle=o.hi?"#FDE047":"rgba(0,0,0,.35)";ctx.lineWidth=o.hi?3:1.2;ctx.stroke();T(ctx,b,x,(y1+y2)/2+(up?3:7),15,b==="T"?"#3A2F00":"#FFFFFF");ctx.restore()}
    /* vẽ một gene hai mạch + chuỗi polypeptide, các codon tách nhau theo khung đọc */
    function geneRow(ctx,P,seq,x0,y,o){o=o||{};const dx=o.dx||28,gap=o.gap||8;const tr=translate(seq);const xs=[];
      for(let i=0;i<seq.length;i++)xs.push(x0+i*dx+Math.floor(i/3)*gap);
      const last=xs[xs.length-1]||x0;ctx.save();ctx.strokeStyle="#334E9C";ctx.lineWidth=6;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(x0-16,y);ctx.lineTo(last+16,y);ctx.moveTo(x0-16,y+70);ctx.lineTo(last+16,y+70);ctx.stroke();ctx.restore();
      for(let i=0;i<seq.length;i++){const hi=o.hi&&o.hi.includes(i);nt(ctx,xs[i],y,seq[i],false,{hi});nt(ctx,xs[i],y+70,PR[seq[i]],true,{hi})}
      T(ctx,"5′",x0-30,y+20,12,P.mut);T(ctx,"3′",x0-30,y+60,12,P.mut);T(ctx,"Polypeptide",x0-34,y+116,12,P.mut,"right",700);
      /* polypeptide dưới từng codon */
      const ncod=Math.floor(seq.length/3);for(let c=0;c<ncod;c++){const cx=(xs[c*3]+xs[c*3+2])/2;const isStop=tr.stop&&c===tr.stopAt;const after=tr.stop&&c>tr.stopAt;
        ctx.strokeStyle=P.line;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(xs[c*3]-12,y+80);ctx.lineTo(xs[c*3]-12,y+86);ctx.lineTo(xs[c*3+2]+12,y+86);ctx.lineTo(xs[c*3+2]+12,y+80);ctx.stroke();
        if(after)continue;if(isStop){D2.block(ctx,cx-26,y+98,52,26,8,"#475569","#334155",{shadow:false});T(ctx,"Dừng",cx,y+116,12,"#fff");continue}
        const a=tr.aa[c];const diff=o.cmp&&o.cmp[c]!==a;if(c>0)(()=>{const px=(xs[(c-1)*3]+xs[(c-1)*3+2])/2;ctx.strokeStyle="#E2E8F0";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(px+16,y+111);ctx.lineTo(cx-16,y+111);ctx.stroke()})();
        D2.ball(ctx,cx,y+111,16,acol(a),a,"#0B1330");if(diff){ctx.strokeStyle="#FDE047";ctx.lineWidth=3;ctx.beginPath();ctx.arc(cx,y+111,20,0,6.283);ctx.stroke()}}
      if(!tr.stop&&ncod>0){const cx=xs[seq.length-1]+30;T(ctx,"…",cx,y+116,18,P.mut)}
      if(seq.length%3){const r=seq.length%3;T(ctx,`(dư ${r} nucleotide)`,xs[seq.length-1]+24,y+40,11,P.mut,"left",600)}
      return{xs,tr}}
    /* ---------------- áp dụng đột biến ---------------- */
    function mutate(type,b){const i=S.sel,g=GENE;let seq,desc,hi;
      if(type==="thay"){if(g[i]===b){api.toast("Base mới trùng base cũ.","warn",1500);return}seq=g.slice(0,i)+b+g.slice(i+1);desc=`Thay cặp ${g[i]} – ${PR[g[i]]} bằng cặp ${b} – ${PR[b]} ở vị trí ${i+1}`;hi=[i]}
      else if(type==="mat"){seq=g.slice(0,i)+g.slice(i+1);desc=`Mất cặp ${g[i]} – ${PR[g[i]]} ở vị trí ${i+1}`;hi=[]}
      else{seq=g.slice(0,i)+b+g.slice(i);desc=`Thêm cặp ${b} – ${PR[b]} vào trước vị trí ${i+1}`;hi=[i]}
      const o=translate(g),m=translate(seq);const hq=judge(type,o,m,seq);S.mut={seq,desc,hi,hq,type};S.done[type]=true;
      rec(desc,`${m.aa.join(" – ")}${m.stop?"":" …"}`,hq);refresh()}
    function judge(type,o,m,seq){const r=judge0(type,o,m,seq);return r.charAt(0).toUpperCase()+r.slice(1)}
    function judge0(type,o,m,seq){if(seq.slice(0,3)!=="ATG")return "Mất mã mở đầu ATG (AUG trên mRNA): gene không được dịch mã như bình thường.";
      if(!m.stop)return (type==="thay"?"":"Lệch khung đọc, ")+"mất mã kết thúc: dịch mã đọc tiếp ra ngoài đoạn gene, chuỗi polypeptide dài và sai khác.";
      const n=Math.max(o.aa.length,m.aa.length);let d=0,first=-1;for(let k=0;k<n;k++)if(o.aa[k]!==m.aa[k]){d++;if(first<0)first=k}
      if(!d)return "Chuỗi polypeptide không thay đổi (codon mới vẫn mã hóa cùng amino acid).";
      const fs=type==="thay"?"":"Lệch khung đọc, ";
      if(m.aa.length<o.aa.length&&o.aa.slice(0,m.aa.length).join()===m.aa.join())return `${fs}xuất hiện mã kết thúc sớm: chuỗi chỉ còn ${m.aa.length} amino acid (ban đầu ${o.aa.length}).`;
      if(type==="thay"&&d===1)return `Thay đổi 1 amino acid: ${o.aa[first]} → ${m.aa[first]} ở vị trí ${first+1}.`;
      return `Lệch khung đọc: từ amino acid thứ ${first+1} trở đi bị thay đổi (${d} vị trí khác).`}
    /* ---------------- vẽ ---------------- */
    const X0=150,DX=28,GAP=8;
    function drawDang(ctx,P){T(ctx,"Gene ban đầu",60,52,15,P.ink,"left");T(ctx,"(chạm để chọn vị trí)",168,52,12,P.mut,"left",600);
      const r0=geneRow(ctx,P,GENE,X0,82,{hi:[S.sel]});
      /* con trỏ vị trí */
      const sx=r0.xs[S.sel];ctx.fillStyle="#FDE047";ctx.beginPath();ctx.moveTo(sx,70);ctx.lineTo(sx-7,58);ctx.lineTo(sx+7,58);ctx.closePath();ctx.fill();
      const y2=330;T(ctx,"Gene đột biến",60,y2-30,15,P.ink,"left");
      if(S.mut){geneRow(ctx,P,S.mut.seq,X0,y2,{hi:S.mut.hi,cmp:r0.tr.aa});
        if(S.mut.type==="mat"){const x=X0+S.sel*DX+Math.floor(S.sel/3)*GAP-DX/2;ctx.strokeStyle="#FDE047";ctx.lineWidth=2;ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(x,y2-8);ctx.lineTo(x,y2+78);ctx.stroke();ctx.setLineDash([])}
        D2.block(ctx,60,y2+150,880,64,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,S.mut.desc,500,y2+176,15,P.ink);T(ctx,S.mut.hq,500,y2+200,14,K.day?"#B45309":"#FCD34D","center",700)}
      else{D2.block(ctx,60,y2+20,880,90,12,"rgba(0,0,0,.12)","rgba(0,0,0,.12)",{shadow:false});T(ctx,"Chọn vị trí, chọn dạng đột biến ở khay rồi chọn base",500,y2+72,15,P.mut,"center",700)}}
    /* hồng cầu */
    function rbc(ctx,x,y,r,sick,a){ctx.save();ctx.translate(x,y);ctx.rotate(a);
      if(!sick){const g=ctx.createRadialGradient(0,0,r*.15,0,0,r);g.addColorStop(0,"#F87171");g.addColorStop(.45,"#B91C1C");g.addColorStop(.8,"#DC2626");g.addColorStop(1,"#7F1D1D");ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(0,0,r,r*.92,0,0,6.283);ctx.fill();
        ctx.fillStyle="rgba(255,200,200,.18)";ctx.beginPath();ctx.ellipse(0,0,r*.42,r*.38,0,0,6.283);ctx.fill()}
      else{const g=ctx.createLinearGradient(-r,0,r,0);g.addColorStop(0,"#7F1D1D");g.addColorStop(.5,"#DC2626");g.addColorStop(1,"#7F1D1D");ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,r*.55,r*1.25,Math.PI*1.12,Math.PI*1.88);ctx.arc(0,r*1.25,r*1.35,Math.PI*1.8,Math.PI*1.2,true);ctx.closePath();ctx.fill()}
      ctx.restore()}
    const CELLS=Array.from({length:16},(_,i)=>({x:(i*.618034%1),y:.15+((i*.7548)%1)*.7,a:i*1.3,s:.8+((i*.37)%1)*.4}));
    function drawHl(ctx,P){const m=S.hl.m;T(ctx,"Đoạn đầu gene HBB (mạch mã hóa, codon 1 – 10)",60,64,15,P.ink,"left");
      const seq=m?HBBm:HBB;const r=geneRow(ctx,P,seq,110,82,{hi:m?[19]:[],cmp:translate(HBB).aa,dx:26,gap:6});
      const c7=(r.xs[18]+r.xs[20])/2;T(ctx,m?"codon 7: GTG → Val":"codon 7: GAG → Glu",c7,250,13,K.day?"#B45309":"#FCD34D");
      /* mạch máu */
      const bx=60,by=300,bw=880,bh=180;ctx.save();C.rr(ctx,bx,by,bw,bh,90);ctx.clip();const g=ctx.createLinearGradient(0,by,0,by+bh);g.addColorStop(0,"#3F0D12");g.addColorStop(.5,"#5B1A1F");g.addColorStop(1,"#3F0D12");ctx.fillStyle=g;ctx.fillRect(bx,by,bw,bh);
        for(const c of CELLS){const x=bx+((c.x*bw+K.simT*(m?28:55)*c.s)%(bw+80))-40,y=by+c.y*bh;const sick=m&&(c.a*7%3)<2.3;rbc(ctx,x,y+Math.sin(K.simT+c.a)*6,24*c.s,sick,sick?c.a+Math.sin(K.simT*.5+c.a)*.2:K.simT*.3+c.a)}ctx.restore();
      ctx.strokeStyle="rgba(255,255,255,.18)";ctx.lineWidth=2;C.rr(ctx,bx,by,bw,bh,90);ctx.stroke();
      D2.block(ctx,60,500,880,70,12,P.card,P.card,{stroke:P.line,shadow:false});
      T(ctx,m?"Hemoglobin S: Glu được thay bằng Val ở vị trí 6 của chuỗi β-globin (không tính Met mở đầu).":"Hemoglobin bình thường (HbA): hồng cầu hình đĩa lõm hai mặt, mềm dẻo, đi qua mao mạch dễ dàng.",500,528,14,P.ink);
      T(ctx,m?"Khi thiếu oxygen, HbS kết tụ thành sợi, hồng cầu biến dạng hình liềm, dễ vỡ và dễ gây tắc mạch máu nhỏ.":"Bấm “Gây đột biến c.20A>T” ở khay để thay một cặp nucleotide.",500,552,13,P.mut,"center",600)}
    K.drawFn((ctx,P)=>K.view==="dang"?drawDang(ctx,P):drawHl(ctx,P));
    K.pickFn(q=>{if(K.view!=="dang")return null;for(let i=0;i<GENE.length;i++){const x=X0+i*DX+Math.floor(i/3)*GAP;if(Math.abs(q[0]-x)<14&&q[1]>70&&q[1]<160)return{i}}return null});
    K.tapFn(k=>{if(!k)return;S.sel=k.i;refresh()});
    K.label("Hồng cầu trong mạch máu",[500,300],{view:"hl",dir:"n",len:6});
    K.dockFn(()=>{if(K.view==="dang"){const m=S.mode;const it=[{seg:[{k:"mode",v:"thay",label:"Thay thế",icon:"",on:m==="thay"},{k:"mode",v:"mat",label:"Mất",icon:"",on:m==="mat"},{k:"mode",v:"them",label:"Thêm",icon:"",on:m==="them"}],label:"Dạng đột biến"}];
        if(m==="mat")it.push({k:"del",label:`Xóa cặp ở vị trí ${S.sel+1}`,icon:IC.minus});
        else it.push({grid:["A","T","G","C"].map(b=>({k:"base",v:b,label:b,icon:`<svg viewBox="0 0 40 40"><rect x="9" y="9" width="22" height="22" rx="5" fill="${COL[b]}"/></svg>`,dis:m==="thay"&&GENE[S.sel]===b}))});
        it.push({grid:[{k:"mv",v:"-1",label:"Vị trí trước",icon:IC.minus},{k:"mv",v:"1",label:"Vị trí sau",icon:IC.plus}]},{k:"clr",label:"Khôi phục gene",icon:IC.reset});return it}
      return[{k:"hlm",label:S.hl.m?"Gene bình thường":"Gây đột biến c.20A>T",icon:IC.swap,on:S.hl.m}]});
    K.onDock((k,v)=>{if(k==="mode")S.mode=v;else if(k==="base")mutate(S.mode,v);else if(k==="del")mutate("mat");else if(k==="mv")S.sel=C.clamp(S.sel+(+v),0,GENE.length-1);else if(k==="clr")S.mut=null;
      else if(k==="hlm"){S.hl.m=!S.hl.m;if(S.hl.m&&!S.hl.rec){S.hl.rec=1;rec("HBB c.20A>T (GAG → GTG ở codon 7)",translate(HBBm).aa.join(" – ")+" …","Glu → Val; hemoglobin S, hồng cầu hình liềm khi thiếu oxygen")}}refresh()});
    K.infoFn(()=>{if(K.view==="dang"){const i=S.sel,c=Math.floor(i/3);return `<div><b>Vị trí ${i+1}</b>: cặp ${GENE[i]} – ${PR[GENE[i]]} · thuộc codon ${c+1} (${GENE.substr(c*3,3)} → ${translate(GENE).aa[c]||"kết thúc"})</div><small>Gene minh họa: ${GENE.length} cặp nucleotide, 7 amino acid + mã kết thúc. Vòng vàng: amino acid khác với ban đầu.</small>`}
      return `<div><b>Gene HBB</b> (chuỗi β-globin của hemoglobin)</div><div>${S.hl.m?"Đột biến: c.20A>T · GAG → GTG · Glu → Val":"Bình thường: codon 7 là GAG (Glu)"}</div><small>Người mang hai allele đột biến biểu hiện bệnh hồng cầu hình liềm.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.sel=5;mutate("thay","A");S.sel=9;mutate("mat");S.sel=4;mutate("them","G");K._dockH("hlm")}};
    return K.mount(st)}
});
})();
