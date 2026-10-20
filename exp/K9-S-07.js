/* K9-S-07 · Di truyền học với con người: phân tích phả hệ (SGK KHTN 9 – Kết nối tri thức, Bài 47) · 2D, điều tra
   Học sinh đọc phả hệ (kí hiệu: □ nam, ○ nữ, tô đậm: mắc bệnh; nối ngang: vợ chồng; nhánh dọc: con) và xác định kiểu gene từng người.
   1. Bệnh bạch tạng: gene lặn a trên NST thường (A: bình thường).
   2. Bệnh máu khó đông: gene lặn h trên NST giới tính X, không có allele tương ứng trên Y (H: bình thường).
   Các phả hệ là ví dụ minh họa được dựng để có thể suy luận kiểu gene; không phải gia đình thật. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
/* phả hệ: x, thế hệ g, giới (m/f), mắc bệnh, kiểu gene đúng, giải thích */
const PED={
  bt:{ten:"Bệnh bạch tạng",gene:"a (lặn, NST thường)",opts:["AA","Aa","aa","AA hoặc Aa"],
    ppl:[{id:"I-1",x:330,g:0,s:"m",d:0,gt:"Aa",why:"Bình thường nhưng có con gái II-1 bị bệnh (aa) → phải cho con một allele a."},
      {id:"I-2",x:470,g:0,s:"f",d:0,gt:"Aa",why:"Bình thường nhưng có con gái II-1 bị bệnh (aa) → mang allele a."},
      {id:"II-1",x:300,g:1,s:"f",d:1,gt:"aa",why:"Bị bệnh do gene lặn → aa."},{id:"II-2",x:160,g:1,s:"m",d:0,gt:"Aa",why:"Bình thường nhưng có con trai III-1 bị bệnh (aa) → mang allele a."},
      {id:"II-3",x:500,g:1,s:"m",d:0,gt:"AA hoặc Aa",why:"Bình thường, bố mẹ đều Aa → có thể AA (1/3) hoặc Aa (2/3); phả hệ không đủ để khẳng định."},
      {id:"III-1",x:170,g:2,s:"m",d:1,gt:"aa",why:"Bị bệnh → aa."},{id:"III-2",x:290,g:2,s:"f",d:0,gt:"Aa",why:"Bình thường nhưng mẹ II-1 là aa → chắc chắn nhận một allele a từ mẹ."}],
    mar:[["I-1","I-2",["II-1","II-3"]],["II-2","II-1",["III-1","III-2"]]]},
  mkd:{ten:"Bệnh máu khó đông",gene:"h (lặn, trên NST X)",opts:["XᴴY","XʰY","XᴴXᴴ","XᴴXʰ","XʰXʰ","XᴴXᴴ hoặc XᴴXʰ"],
    ppl:[{id:"I-1",x:330,g:0,s:"m",d:0,gt:"XᴴY",why:"Nam bình thường → XᴴY (Y không mang allele của gene này)."},
      {id:"I-2",x:470,g:0,s:"f",d:0,gt:"XᴴXʰ",why:"Bình thường nhưng có con trai II-1 bị bệnh; con trai nhận X từ mẹ → mẹ mang Xʰ."},
      {id:"II-1",x:540,g:1,s:"m",d:1,gt:"XʰY",why:"Nam bị bệnh → XʰY."},{id:"II-2",x:330,g:1,s:"f",d:0,gt:"XᴴXʰ",why:"Bình thường nhưng có con trai III-1 bị bệnh, mà con trai nhận Xʰ từ mẹ → II-2 mang Xʰ."},
      {id:"II-3",x:190,g:1,s:"m",d:0,gt:"XᴴY",why:"Nam bình thường → XᴴY."},
      {id:"III-1",x:200,g:2,s:"m",d:1,gt:"XʰY",why:"Nam bị bệnh → XʰY."},{id:"III-2",x:320,g:2,s:"f",d:0,gt:"XᴴXᴴ hoặc XᴴXʰ",why:"Nhận Xᴴ từ bố (II-3) và Xᴴ hoặc Xʰ từ mẹ (XᴴXʰ) → chưa xác định được."}],
    mar:[["I-1","I-2",["II-2","II-1"]],["II-3","II-2",["III-1","III-2"]]]}};
const GY=[150,315,480];

const SPEC={
  predict:[{id:"p1",q:"Bố mẹ đều bình thường sinh con bị bệnh. Gene gây bệnh là:",opts:[["lan","Gene lặn"],["troi","Gene trội"],["kxd","Không xác định được"]],ans:"lan",res:"Kết quả: bố mẹ bình thường mang allele bệnh ở trạng thái dị hợp → gene bệnh là gene lặn."},
    {id:"p2",q:"Bệnh do gene lặn trên NST X thường gặp nhiều hơn ở:",opts:[["nam","Nam giới"],["nu","Nữ giới"],["nhau","Như nhau ở nam và nữ"]],ans:"nam",res:"Kết quả: nam (XY) chỉ cần một allele lặn trên X là biểu hiện bệnh."}],
  taskLead:"Chạm vào một người trong phả hệ rồi chọn kiểu gene ở khay. Xác định đúng kiểu gene của tất cả mọi người trong mỗi phả hệ.",
  tasks:[{html:"<b>Bạch tạng:</b> xác định kiểu gene của 7 người.",done:()=>done("bt")},{html:"<b>Máu khó đông:</b> xác định kiểu gene của 7 người.",done:()=>done("mkd")}],
  obs:[{id:"a",q:"Trong phả hệ bệnh bạch tạng, bệnh xuất hiện ở cả nam và nữ với tỉ lệ gần như nhau; bố mẹ bình thường có thể sinh con bệnh. Kết luận:",opts:[["ok","Gene lặn trên NST thường"],["x","Gene trội trên NST X"],["y","Gene trên NST Y"]],ans:"ok",why:"Gene trên NST thường biểu hiện ở hai giới như nhau."},
    {id:"b",q:"Con trai bị bệnh máu khó đông nhận gene bệnh từ:",opts:[["me","Mẹ"],["bo","Bố"],["ca","Cả bố và mẹ"]],ans:"me",why:"Con trai nhận X từ mẹ và Y từ bố."},
    {id:"c",q:"Phương pháp nghiên cứu phả hệ dùng để:",opts:[["ok","Xác định tính trạng do gene trội hay lặn, trên NST thường hay NST giới tính quy định"],["kq","Thay đổi gene gây bệnh"],["nst","Đếm số NST trong tế bào"]],ans:"ok",why:"Từ đó dự đoán khả năng xuất hiện bệnh ở thế hệ sau, phục vụ tư vấn di truyền."}],
  concl:{html:`<ul class="tlist"><li><b>Phả hệ</b> là sơ đồ ghi lại sự di truyền một tính trạng qua các thế hệ của một gia đình, dùng kí hiệu quy ước (□ nam, ○ nữ, tô đậm: mắc bệnh).</li>
    <li>Phân tích phả hệ giúp xác định tính trạng do gene trội hay lặn, nằm trên NST thường hay NST giới tính; từ đó suy ra kiểu gene và dự đoán khả năng mắc bệnh ở thế hệ sau.</li>
    <li>Bạch tạng: gene lặn trên NST thường. Máu khó đông: gene lặn trên NST X, biểu hiện chủ yếu ở nam; mẹ mang gene có thể truyền cho con trai.</li>
    <li>Ứng dụng: tư vấn di truyền, khuyên không kết hôn cận huyết để hạn chế bệnh di truyền.</li></ul>`,
    quiz:[{id:"q1",q:"Bố mẹ đều có kiểu gene Aa (bình thường, mang gene bạch tạng). Xác suất sinh con bị bạch tạng:",opts:[["a","1/4"],["b","1/2"],["c","3/4"]],ans:"a",why:{b:"Aa × Aa → 1 AA : 2 Aa : 1 aa; con aa chiếm 1/4.",c:"3/4 là tỉ lệ con bình thường."}},
      {id:"q2",q:"Mẹ XᴴXʰ, bố XᴴY. Xác suất sinh con trai bị máu khó đông (tính trên tổng số con):",opts:[["a","1/4"],["b","1/2"],["c","0"]],ans:"a",why:{b:"1/2 là xác suất trong số con trai; tính trên tổng số con là 1/4 (XʰY).",c:"Mẹ mang Xʰ nên có thể sinh con trai bệnh."}}],
    done:`<h2>Hoàn thành: phân tích phả hệ</h2><p class="muted">Đã xác định kiểu gene trong hai phả hệ: gene lặn trên NST thường và gene lặn trên NST X.</p>`},
  gv:["Cho học sinh giải thích từng bước suy luận trước khi chọn kiểu gene.","Hỏi: vì sao II-3 trong phả hệ bạch tạng chưa xác định được kiểu gene?","Liên hệ: tư vấn di truyền và luật không kết hôn cận huyết."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 47)</p><ul class="tlist"><li>Nêu được khái niệm phả hệ; vận dụng phân tích phả hệ đơn giản để xác định tính trạng trội, lặn, gene trên NST thường hay NST giới tính; nêu được một số bệnh, tật di truyền ở người.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 47 Di truyền học với con người.</li>
<li>Các kiểu di truyền đơn gene (lặn trên NST thường, lặn liên kết X) và dấu hiệu nhận biết trên phả hệ: <a href="https://www.ncbi.nlm.nih.gov/books/NBK132145/" target="_blank" rel="noopener">Genetic Alliance – Understanding Genetics, Appendix B: Classic Mendelian Genetics (NCBI Bookshelf)</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Hai phả hệ là ví dụ được dựng để luyện suy luận, không phải gia đình thật. Giả định không có đột biến mới; người ngoài gia đình (II-2 ở phả hệ 1, II-3 ở phả hệ 2) được suy ra từ kiểu hình của con.</li></ul>`;

let S;
function done(k){return PED[k].ppl.every(p=>S.ok[k+p.id])}
LabKHTN.register("K9-S-07",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"ph",t:"Phả hệ"},{k:"ng",t:"Người"},{k:"kg",t:"Kiểu gene"},{k:"ld",t:"Lí do"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Phân tích phả hệ bệnh bạch tạng và bệnh máu khó đông",views:{bt:{label:"Bạch tạng",icon:IC.dna,frame:[40,40,700,560]},mkd:{label:"Máu khó đông",icon:IC.grid,frame:[40,40,700,560]}}});
    S={sel:{bt:"II-1",mkd:"I-2"},ok:{},err:0,recs:0};
    const rec=(ph,ng,kg,ld)=>{S.recs++;api.record({lan:String(S.recs),ph,ng,kg,ld})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const R0=24;
    function sym(ctx,P,p,sel,ok){const x=p.x+70,y=GY[p.g];ctx.save();
      if(sel){ctx.fillStyle=C.rgba("#FDE047",.18);ctx.beginPath();ctx.arc(x,y,R0+9,0,6.283);ctx.fill();ctx.strokeStyle="#FDE047";ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(x,y,R0+9,0,6.283);ctx.stroke()}
      const fill=p.d?(K.day?"#1F2937":"#E2E8F0"):(K.day?"#FFFFFF":"#1A2350");ctx.fillStyle=fill;ctx.strokeStyle=K.day?"#1F2937":"#E2E8F0";ctx.lineWidth=3;
      ctx.beginPath();if(p.s==="m")ctx.rect(x-R0,y-R0,2*R0,2*R0);else ctx.arc(x,y,R0,0,6.283);ctx.fill();ctx.stroke();
      T(ctx,p.id,x,y+R0+26,14,P.mut);T(ctx,ok?p.gt:"?",x,y+R0+47,ok?17:18,ok?(K.day?"#047857":"#6EE7B7"):P.mut);ctx.restore()}
    const pos=(k,id)=>{const p=PED[k].ppl.find(q=>q.id===id);return[p.x+70,GY[p.g]]};
    function drawPed(ctx,P,k){const D=PED[k];
      ["I","II","III"].forEach((t,i)=>T(ctx,t,40,GY[i]+6,18,P.mut,"left"));
      ctx.strokeStyle=K.day?"#334155":"#CBD5E1";ctx.lineWidth=2.5;
      for(const [a,b,kids] of D.mar){const A=pos(k,a),B=pos(k,b);const my=A[1];ctx.beginPath();ctx.moveTo(Math.min(A[0],B[0])+R0,my);ctx.lineTo(Math.max(A[0],B[0])-R0,my);ctx.stroke();
        const mx=(A[0]+B[0])/2,cy=GY[PED[k].ppl.find(q=>q.id===kids[0]).g]-R0-30;ctx.beginPath();ctx.moveTo(mx,my);ctx.lineTo(mx,cy);ctx.stroke();
        const xs=kids.map(id=>pos(k,id)[0]);ctx.beginPath();ctx.moveTo(Math.min(mx,...xs),cy);ctx.lineTo(Math.max(mx,...xs),cy);ctx.stroke();for(const x of xs){ctx.beginPath();ctx.moveTo(x,cy);ctx.lineTo(x,cy+30);ctx.stroke()}}
      for(const p of D.ppl)sym(ctx,P,p,S.sel[k]===p.id,!!S.ok[k+p.id]);
      /* chú thích kí hiệu */
      const lx=70,ly=590;ctx.save();ctx.strokeStyle=K.day?"#1F2937":"#E2E8F0";ctx.lineWidth=2;const nf=K.day?"#FFFFFF":"#1A2350",af=K.day?"#1F2937":"#E2E8F0";
      [[0,"m",0,"Nam bình thường"],[1,"f",0,"Nữ bình thường"],[2,"m",1,"Nam mắc bệnh"],[3,"f",1,"Nữ mắc bệnh"]].forEach(([i,s,d,t])=>{const x=lx+i*160;ctx.fillStyle=d?af:nf;ctx.beginPath();if(s==="m")ctx.rect(x-9,ly-9,18,18);else ctx.arc(x,ly,9,0,6.283);ctx.fill();ctx.stroke();T(ctx,t,x+16,ly+5,14,P.mut,"left",700)});ctx.restore();
      T(ctx,`${D.ten} · gene ${D.gene}`,70,78,18,P.ink,"left")}
    K.drawFn((ctx,P)=>drawPed(ctx,P,K.view));
    K.pickFn(q=>{const k=K.view;for(const p of PED[k].ppl){const [x,y]=pos(k,p.id);if(Math.abs(q[0]-x)<R0+10&&Math.abs(q[1]-y)<R0+10)return{id:p.id}}return null});
    K.tapFn(h=>{if(!h)return;S.sel[K.view]=h.id;refresh()});
    function answer(v){const k=K.view,id=S.sel[k],p=PED[k].ppl.find(q=>q.id===id);if(S.ok[k+id])return;
      if(v===p.gt){S.ok[k+id]=1;rec(PED[k].ten,`${id} (${p.s==="m"?"nam":"nữ"}, ${p.d?"mắc bệnh":"bình thường"})`,p.gt,p.why);
        const nx=PED[k].ppl.find(q=>!S.ok[k+q.id]);if(nx)S.sel[k]=nx.id}
      else{S.err++;api.toast(hint(k,p,v),"warn",2600)}refresh()}
    function hint(k,p,v){if(p.d)return `${p.id} mắc bệnh do gene lặn: kiểu gene phải mang toàn allele bệnh.`;
      if(k==="mkd"&&p.s==="m"&&v.includes("X")&&v.length>3)return "Nam chỉ có một NST X (kiểu gene dạng X…Y).";
      if(k==="mkd"&&p.s==="f"&&v.endsWith("Y"))return "Nữ có hai NST X.";
      return `Chưa đúng. Gợi ý: xem kiểu hình của ${p.g<2?"con":"bố mẹ"} của ${p.id}.`}
    K.dockFn(()=>{const k=K.view,id=S.sel[k];const okk=!!S.ok[k+id];return[{grid:PED[k].opts.map(o=>({k:"gt",v:o,label:o,icon:"",dis:okk}))},{k:"next",label:"Người tiếp theo",icon:IC.step},{k:"clr",label:"Làm lại phả hệ",icon:IC.reset}]});
    K.onDock((k,v)=>{const vw=K.view;if(k==="gt")answer(v);else if(k==="next"){const L=PED[vw].ppl;const i=L.findIndex(q=>q.id===S.sel[vw]);for(let j=1;j<=L.length;j++){const q=L[(i+j)%L.length];if(!S.ok[vw+q.id]){S.sel[vw]=q.id;break}}}
      else if(k==="clr"){for(const p of PED[vw].ppl)delete S.ok[vw+p.id]}refresh()});
    K.infoFn(()=>{const k=K.view,D=PED[k],id=S.sel[k],p=D.ppl.find(q=>q.id===id);const n=D.ppl.filter(q=>S.ok[k+q.id]).length;
      return `<div><b>${p.id}</b>: ${p.s==="m"?"nam":"nữ"}, ${p.d?"<b>mắc bệnh</b>":"bình thường"}</div><div>${S.ok[k+id]?`Kiểu gene: <b>${p.gt}</b>`:"Chọn kiểu gene ở khay"}</div>${S.ok[k+id]?`<small>${p.why}</small>`:""}<div style="margin-top:4px">Đã xác định: ${n}/${D.ppl.length}</div>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const k of ["bt","mkd"]){K.goView(k);for(const p of PED[k].ppl){S.sel[k]=p.id;answer(p.gt)}}}};
    return K.mount(st)}
});
})();
