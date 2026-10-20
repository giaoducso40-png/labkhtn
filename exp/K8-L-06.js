/* K8-L-06 · Lắp mạch điện; đo cường độ dòng điện và hiệu điện thế · bản 3D
   SGK KHTN 8 – Kết nối tri thức: Bài 22 (Mạch điện đơn giản), Bài 24 (Cường độ dòng điện và hiệu điện thế), Bài 25 (Thực hành đo)
   Dụng cụ theo SGK Bài 25: nguồn 1,5 V; 3 V; 6 V · ampe kế GHĐ ≥ 0,5 A, ĐCNN 0,01 A · vôn kế GHĐ 6 V, ĐCNN 0,1 V · bóng đèn pin 6 V – 0,5 A
   Giải mạch bằng phương pháp thế nút (LabCircuit); bảng lắp mạch 3D (LabGL): chốt nối, dây mềm, kim đồng hồ, dây tóc nóng sáng. */
(function(){
"use strict";
const C=window.LabCore,L=window.LabCircuit,G=window.LabGL;
const fmt=C.fmt,H=G.hex;

const GV=`<p><b>Yêu cầu cần đạt</b> (trích mục tiêu năng lực Bài 25)</p>
<ul class="tlist"><li>Đo được cường độ dòng điện và hiệu điện thế bằng dụng cụ thực hành.</li><li>Đo được cường độ dòng điện trong mạch điện bằng ampe kế.</li><li>Trung thực khi ghi và báo cáo kết quả.</li></ul>
<p style="margin-top:10px"><b>Gợi ý tổ chức (20–25 phút)</b></p>
<ul class="tlist"><li>Trước khi làm: cho lớp tranh luận câu “dòng điện có giảm sau khi đi qua bóng đèn không?”.</li><li>Yêu cầu học sinh tự nối dây; chỉ dùng nút “Lắp sẵn” khi nhóm bị kẹt quá lâu.</li><li>Mỗi lần đọc số, học sinh phải gõ số mình đọc được; bảng đo ghi cả số đọc và số kim chỉ để giáo viên xem kĩ năng đọc ĐCNN.</li><li>Cố ý cho một nhóm mắc ampe kế song song hoặc ngược cực để cả lớp thấy hậu quả (trong mô phỏng không hỏng thiết bị thật).</li></ul>
<p style="margin-top:10px"><b>Lỗi học sinh hay gặp</b></p>
<ul class="tlist"><li>Nghĩ dòng điện “bị đèn dùng bớt” nên I₂ &lt; I₁.</li><li>Mắc ampe kế song song với đèn, hoặc nối chốt (−) của ampe kế về phía cực (+) của nguồn.</li><li>Đọc sai vì nhầm ĐCNN của ampe kế (0,01 A) với vôn kế (0,1 V).</li></ul>`;

const SRC=`<ul class="tlist">
<li>Dụng cụ, các bước đo và kết luận (I₁ = I₂; U đèn nhỏ hơn U nguồn; nguyên nhân sai số): SGK KHTN 8 KNTT Bài 25, đối chiếu qua <a href="https://minio.ftech.ai/fs-landing/KHTN_8_Ket_noi_Bai_25_83f6453308.pdf" target="_blank" rel="noopener">tài liệu Bài 25</a> và <a href="https://hoatieu.vn/powerpoint-khoa-hoc-tu-nhien-8-bai-25-ket-noi-tri-thuc-233746" target="_blank" rel="noopener">kế hoạch bài dạy</a>.</li>
<li>Cách mắc ampe kế, vôn kế; pin mới, pin cũ: SGK Bài 24, đối chiếu qua <a href="https://minio.ftech.ai/fs-landing/KHTN_8_Ket_noi_Bai_24_e197ad5090.pdf" target="_blank" rel="noopener">tài liệu Bài 24</a>.</li>
<li>Kí hiệu sơ đồ, quy ước chiều dòng điện (từ cực + qua dây dẫn và dụng cụ tới cực −): SGK Bài 22, đối chiếu qua <a href="https://minio.ftech.ai/fs-landing/KHTN_8_Ket_noi_Bai_22_1_9ce04e3ba8.pdf" target="_blank" rel="noopener">tài liệu Bài 22</a>.</li>
<li>Bóng đèn dây tóc: I ≈ I<sub>đm</sub>·(U/U<sub>đm</sub>)<sup>0,55</sup> (<a href="https://en.wikipedia.org/wiki/Lamp_rerating" target="_blank" rel="noopener">Lamp rerating</a>; số mũ thay đổi chút ít theo loại đèn).</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p>
<ul class="tlist"><li>Mỗi pin mới: 1,5 V, điện trở trong 0,2 Ω; pin cũ: 1,3 V, 1,0 Ω (giá trị minh họa).</li>
<li>Ampe kế 0,1 Ω, vôn kế 6 kΩ, mỗi dây nối và công tắc 0,01 Ω.</li>
<li>Đèn 6 V – 0,5 A: điện trở khi sáng bình thường 12 Ω, khi nguội không nhỏ hơn 1,2 Ω.</li>
<li>Kết quả tính sẵn với mạch SGK: nguồn 1,5 V → I ≈ 0,23 A, U đèn ≈ 1,42 V; 3 V → 0,33 A, 2,82 V; 6 V → 0,48 A, 5,54 V.</li>
<li>Ampe kế có cầu chì bảo vệ, đứt khi dòng qua lớn hơn 2 A; trong mô phỏng thay lại bằng nút “Thay cầu chì”.</li>
<li>Bảng lắp mạch vẽ 3D; kích thước linh kiện không theo tỉ lệ thật.</li><li>Chấm chạy trên dây biểu diễn chiều dòng điện quy ước; tốc độ chấm tỉ lệ với cường độ dòng điện, không phải tốc độ thật của electron.</li></ul>`;

/* sơ đồ mạch (SVG) cho hướng dẫn: kí hiệu theo SGK */
function sch(kind){
  const lamp=(x,y)=>`<line x1="${x-26}" y1="${y}" x2="${x-11}" y2="${y}"/><circle cx="${x}" cy="${y}" r="11" fill="none"/><path d="M${x-7.8} ${y-7.8}L${x+7.8} ${y+7.8}M${x+7.8} ${y-7.8}L${x-7.8} ${y+7.8}"/><line x1="${x+11}" y1="${y}" x2="${x+26}" y2="${y}"/>`;
  const meter=(x,y,t,vert)=>`<circle cx="${x}" cy="${y}" r="12" fill="var(--glass-solid)"/><text x="${x}" y="${y+4.5}" text-anchor="middle" font-size="13" font-weight="800" fill="currentColor" stroke="none">${t}</text>`;
  const bat=(x,y)=>`<line x1="${x-6}" y1="${y-14}" x2="${x-6}" y2="${y+14}"/><line x1="${x+6}" y1="${y-8}" x2="${x+6}" y2="${y+8}" stroke-width="5"/><text x="${x-16}" y="${y-12}" font-size="13" font-weight="800" fill="#E5484D" stroke="none">+</text><text x="${x+12}" y="${y-10}" font-size="13" font-weight="800" fill="currentColor" stroke="none">−</text>`;
  const sw=(x,y)=>`<circle cx="${x}" cy="${y-16}" r="2.5" fill="currentColor"/><line x1="${x}" y1="${y-16}" x2="${x+14}" y2="${y+10}"/><circle cx="${x}" cy="${y+16}" r="2.5" fill="currentColor"/><text x="${x+12}" y="${y-14}" font-size="12" font-weight="800" fill="currentColor" stroke="none">K</text>`;
  let s=`<svg viewBox="0 0 300 172" class="sch" role="img" aria-label="Sơ đồ mạch điện" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">`;
  /* khung mạch */
  s+=`<path d="M144 146H30V96M30 72V26H124M176 26H270V70M270 102V146H156"/>`;
  s+=bat(150,146)+lamp(150,26)+sw(270,86);
  if(kind==="p1"){s+=`<path d="M30 72V96"/>`+meter(30,84,"A")+`<text x="40" y="104" font-size="11" font-weight="800" fill="#E5484D" stroke="none">+</text><text x="40" y="70" font-size="12" font-weight="800" fill="currentColor" stroke="none">−</text><text x="6" y="62" font-size="11" font-weight="700" fill="var(--m2)" stroke="none">(1)</text>`}
  else s+=`<path d="M30 72V96"/>`;
  if(kind==="p2"){s+=meter(220,26,"A")+`<text x="196" y="18" font-size="11" font-weight="800" fill="#E5484D" stroke="none">+</text><text x="236" y="18" font-size="12" font-weight="800" fill="currentColor" stroke="none">−</text><text x="210" y="54" font-size="11" font-weight="700" fill="var(--m2)" stroke="none">(2)</text>`}
  if(kind==="v"){s=s.replace('viewBox="0 0 300 172"','viewBox="0 -44 300 216"');s+=`<path d="M124 26V-30H138M162 -30H176V26"/>`+meter(150,-30,"V")+`<text x="112" y="-34" font-size="11" font-weight="800" fill="#E5484D" stroke="none">+</text><text x="180" y="-34" font-size="12" font-weight="800" fill="currentColor" stroke="none">−</text>`}
  s+=`<path d="M64 146l-10 -5v10z" fill="var(--m2)" stroke="none"/><text x="70" y="166" font-size="10" font-weight="700" fill="currentColor" stroke="none">chiều dòng điện</text>`;
  return s+`</svg>`;
}

LabKHTN.register("K8-L-06",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"nguon",t:"Nguồn"},{k:"dai",t:"Đo ở"},{k:"doc",t:"Em đọc"},{k:"kim",t:"Kim chỉ"}],empty:"Chạm vào ampe kế hoặc vôn kế để phóng to mặt đồng hồ, đọc số rồi bấm “Ghi vào bảng”."},
  gv:GV, sources:SRC,
  mount(api){
    const vp=api.vp;
    const cv=document.createElement("canvas");cv.className="stagecv";cv.setAttribute("role","img");cv.setAttribute("aria-label","Bảng lắp mạch 3D: nguồn điện, công tắc, bóng đèn, ampe kế, vôn kế, dây nối");vp.insertBefore(cv,vp.firstChild);
    const over=document.createElement("div");over.className="gl-over";vp.appendChild(over);
    const R=G.create(cv);
    if(!R){over.innerHTML=`<div class="gl-fail">Trình duyệt này chưa bật WebGL2 nên chưa hiện được mô hình 3D. Hãy mở bằng Chrome, Edge hoặc Firefox bản mới.</div>`;return{step(){},layout(){},prefs(){},unmount(){cv.remove();over.remove()}}}
    let P=L.palette(api.day),A0=null,simT=0,frameN=0,day=api.day;
    const bat={id:"bat",type:"battery",cells:1,old:false},lamp={id:"lamp",type:"lamp"},sw={id:"sw",type:"switch",closed:false,anim:0},
          am={id:"am",type:"ammeter",blown:false,needle:0,vel:0},vm={id:"vm",type:"voltmeter",needle:0,vel:0};
    const comps=[bat,lamp,sw,am,vm];
    let wires=[],wseq=0,res=null,glow=0,flowPhase={};
    const S={p1:null,p2:null,locked:false,recs:[],flow:false,sel:null,pending:null,hover:null,q:{},finished:false,warned:{},hint:true,dialFor:null,lastRead:null};
    let drag=null,wdrag=null,bodyEl=null,stepIdx=0;
    function anchors(portrait){
      return portrait?{W:640,H:940,board:{x:12,y:12,w:616,h:916},pos:{am:{x:150,y:190},vm:{x:470,y:190},lamp:{x:320,y:450},sw:{x:470,y:680},bat:{x:270,y:840}}}
                     :{W:1000,H:640,board:{x:14,y:14,w:972,h:612},pos:{am:{x:200,y:225},lamp:{x:500,y:170},vm:{x:810,y:205},sw:{x:800,y:450},bat:{x:470,y:540}}};
    }

    /* ---------- tính mạch ---------- */
    function recalc(){
      res=L.solve(comps,wires);
      const Ia=res.meter.am;
      if(Ia!=null&&Math.abs(Ia)>L.PAR.fuseA&&!am.blown){
        am.blown=true;api.toast("<b>Cầu chì ampe kế bị đứt!</b> Dòng điện qua ampe kế quá lớn vì ampe kế bị nối thẳng vào hai cực nguồn hoặc mắc song song. SGK: không được nối trực tiếp hai chốt ampe kế vào hai cực nguồn.","danger",7000);
        res=L.solve(comps,wires);
      }
      let shortW=false;for(const k in res.wireI)if(Math.abs(res.wireI[k])>L.PAR.shortA)shortW=true;
      if(shortW&&!S.warned.short){S.warned.short=true;api.toast("<b>Đoản mạch nguồn:</b> có dây nối thẳng hai cực pin (qua dây hoặc công tắc). Pin nóng và nhanh hỏng. Tháo dây đỏ rực đó ra.","danger",6500)}
      if(!shortW)S.warned.short=false;
      const Ia2=res.meter.am;if(Ia2!=null&&Ia2<-0.005&&!S.warned.revA){S.warned.revA=true;api.toast("Kim ampe kế lệch ngược: dòng điện đang đi vào chốt (−). Đổi hai dây ở hai chốt ampe kế.","warn",6000)}
      if(!(Ia2<-0.005))S.warned.revA=false;
      const U=res.meter.vm;if(U!=null&&U<-0.05&&!S.warned.revV){S.warned.revV=true;api.toast("Kim vôn kế lệch ngược: chốt (+) của vôn kế phải nối về phía cực (+) của nguồn.","warn",6000)}
      if(!(U<-0.05))S.warned.revV=false;
      if(Ia2!=null&&Ia2>0.66&&!am.blown&&!S.warned.over){S.warned.over=true;api.toast("Kim ampe kế vượt quá giới hạn đo 0,6 A.","warn")}
      refresh();
    }
    const meterVal=c=>{if(!res)return 0;const v=res.meter[c.id];return v==null?0:v};
    function trueRead(c){const m=L.METER[c.type==="ammeter"?"A":"V"];const v=meterVal(c);return Math.round(v/m.step)*m.step}
    function nguonLabel(){return `${fmt(bat.cells*1.5,bat.cells===1?1:0)} V${bat.old?" (pin cũ)":""}`}
    function srcKey(){return bat.cells+(bat.old?"o":"n")}
    /* vị trí đo */
    function posOf(c){
      const net=L.nets(comps,wires);
      if(c.type==="voltmeter"){
        const a=net("vm.p"),b=net("vm.n");
        const same=(x,y)=>(a===net(x)&&b===net(y))||(a===net(y)&&b===net(x));
        if(same("lamp.a","lamp.b"))return "hai đầu đèn";
        if(same("bat.p","bat.n"))return (sw.closed&&Math.abs(meterVal(am))>0.005)||Math.abs(res.lamp.lamp?res.lamp.lamp.I:0)>0.005?"hai cực nguồn (mạch kín)":"hai cực nguồn (mạch hở)";
        return "vị trí khác";
      }
      const Ia=meterVal(am);
      if(Math.abs(Ia)<0.003||!res.lamp.lamp||Math.abs(res.lamp.lamp.I)<0.003)return "chưa có dòng điện";
      const va=(res.V["am.p"]+res.V["am.n"])/2,vl=(res.V["lamp.a"]+res.V["lamp.b"])/2;
      return va>vl?"(1) trước đèn":"(2) sau đèn";
    }

    /* ---------- dây nối ---------- */
    function termAll(){return comps.flatMap(c=>L.terms(c))}
    function termAt(p,r){let best=null,bd=r||20;for(const t of termAll()){const d=Math.hypot(p.x-t.x,p.y-t.y);if(d<bd){bd=d;best=t}}return best}
    function tpos(id){const [c,k]=id.split(".");return L.terms(comps.find(x=>x.id===c)).find(t=>t.k===k)}
    function addWire(a,b,silent){
      if(a===b)return false;
      if(wires.some(w=>(w.a===a&&w.b===b)||(w.a===b&&w.b===a))){if(!silent)api.toast("Hai chốt này đã được nối.","info");return false}
      const cnt=id=>wires.filter(w=>w.a===id||w.b===id).length;
      if(cnt(a)>=3||cnt(b)>=3){if(!silent)api.toast("Mỗi chốt chỉ kẹp tối đa 3 dây.","warn");return false}
      let col;if(a==="bat.p"||b==="bat.p")col=L.WCOL[0];else if(a==="bat.n"||b==="bat.n")col=L.WCOL[1];else col=L.WCOL[2+(wseq%4)];
      wires.push({id:"w"+(++wseq),a,b,col});S.hint=false;recalc();return true;
    }
    function delWire(id){wires=wires.filter(w=>w.id!==id);if(S.sel===id)S.sel=null;recalc()}
    function preset(kind){
      const keepV=wires.filter(w=>w.a.startsWith("vm.")||w.b.startsWith("vm."));
      if(kind==="p1"||kind==="p2"){
        wires=keepV.slice();
        const list=kind==="p1"?[["bat.p","am.p"],["am.n","lamp.a"],["lamp.b","sw.a"],["sw.b","bat.n"]]:[["bat.p","lamp.a"],["lamp.b","am.p"],["am.n","sw.a"],["sw.b","bat.n"]];
        for(const [a,b] of list)addWire(a,b,true);
        api.toast(kind==="p1"?"Đã lắp mạch Hình 25.1 với ampe kế ở vị trí (1), trước bóng đèn. Đóng công tắc để đo.":"Đã chuyển ampe kế sang vị trí (2), sau bóng đèn.","info");
      }else if(kind==="vl"){
        wires=wires.filter(w=>!(w.a.startsWith("vm.")||w.b.startsWith("vm.")));addWire("vm.p","lamp.a",true);addWire("vm.n","lamp.b",true);api.toast("Đã mắc vôn kế song song với hai đầu bóng đèn.","info");
      }else if(kind==="vs"){
        wires=wires.filter(w=>!(w.a.startsWith("vm.")||w.b.startsWith("vm.")));addWire("vm.p","bat.p",true);addWire("vm.n","bat.n",true);api.toast("Đã mắc vôn kế vào hai cực nguồn.","info");
      }
      recalc();
    }

    /* ---------- thẻ thông tin, mặt đồng hồ phóng to ---------- */
    function batCard(){
      api.card(`<h3>Nguồn điện</h3><p class="sub">Pin 1,5 V mắc nối tiếp: 1 pin = 1,5 V; 2 pin = 3 V; 4 pin = 6 V</p>
        <div class="chipset" style="margin-top:12px">${[1,2,4].map(n=>`<button data-cv="cells" data-n="${n}" aria-pressed="${bat.cells===n}">${fmt(n*1.5,n===1?1:0)} V · ${n} pin</button>`).join("")}</div>
        <div class="chipset" style="margin-top:8px"><button data-cv="old" data-v="0" aria-pressed="${!bat.old}">Pin mới</button><button data-cv="old" data-v="1" aria-pressed="${bat.old}">Pin cũ</button></div>
        <ul class="tlist" style="margin-top:12px"><li>Số vôn ghi trên pin là hiệu điện thế giữa hai cực khi pin còn mới, chưa mắc vào mạch.</li><li>Không nối hai cực pin bằng một dây dẫn (đoản mạch).</li><li>Nên ngắt công tắc trước khi đổi nguồn.</li></ul>`);
    }
    function lampCard(){
      const b=glow;
      api.card(`<h3>Bóng đèn pin 6 V – 0,5 A</h3><p class="sub">Lắp sẵn trên đế, có hai chốt nối</p>
        <ul class="tlist" style="margin-top:12px"><li>6 V là hiệu điện thế định mức: đèn sáng bình thường khi hiệu điện thế giữa hai đầu đèn bằng 6 V.</li><li>0,5 A là cường độ dòng điện định mức chạy qua đèn khi đó.</li><li>Hiệu điện thế nhỏ hơn thì dòng điện nhỏ hơn và đèn sáng yếu hơn.</li></ul>
        <p class="sub" style="margin-top:10px">Độ sáng lúc này: <b>${b<.02?"tắt":b<.25?"sáng mờ":b<.6?"sáng vừa":"sáng mạnh"}</b>. Muốn biết U, I phải đo bằng vôn kế, ampe kế.</p>`);
    }
    function meterCard(c){
      const m=L.METER[c.type==="ammeter"?"A":"V"];S.dialFor=c.id;
      api.card(`<h3>${m.name} · đọc số chỉ</h3><p class="sub">GHĐ ${fmt(m.max,m.unit==="A"?1:0)} ${m.unit} · ĐCNN ${fmt(m.step,m.dec)} ${m.unit} (mỗi vạch nhỏ)</p>
        <canvas id="dialCv" style="width:100%;height:auto;aspect-ratio:2/1;display:block;margin-top:10px;border-radius:14px"></canvas>
        <p class="sub" id="dialPos" style="margin-top:6px"></p>
        ${c.blown?`<div class="callout bad" style="margin-top:8px">Cầu chì ampe kế đã đứt. <button class="btn sm" data-cv="fuse">Thay cầu chì</button></div>`:""}
        <div class="numin" style="margin-top:10px"><label for="readIn">Em đọc được:</label><input id="readIn" inputmode="decimal" placeholder="${m.unit==="A"?"0,00":"0,0"}"><span>${m.unit}</span><button class="btn sm main" data-cv="rec" data-m="${c.id}">Ghi vào bảng</button></div>
        <div id="readFb" style="margin-top:8px"></div>`);
      setTimeout(()=>{const i=document.getElementById("readIn");if(i)i.focus({preventScroll:true})},50);
    }
    function recordReading(id){
      const c=comps.find(x=>x.id===id);const m=L.METER[c.type==="ammeter"?"A":"V"];
      const inp=document.getElementById("readIn");const fb=document.getElementById("readFb");
      const raw=inp?String(inp.value).trim().replace(",","."):"";
      if(raw===""||isNaN(+raw)){if(fb)fb.innerHTML=`<div class="callout warn">Gõ số em đọc được trên mặt đồng hồ trước đã.</div>`;return}
      const read=+raw,tr=trueRead(c),ok=Math.abs(read-tr)<=m.step*1.01+1e-9;
      const vt=posOf(c);
      const rec={nguon:nguonLabel(),key:srcKey(),kind:m.unit==="A"?"I":"U",vt,read,tr,ok};
      S.recs.push(rec);
      const short={"(1) trước đèn":"I₁ · (1)","(2) sau đèn":"I₂ · (2)","hai đầu đèn":"U đèn","hai cực nguồn (mạch hở)":"U nguồn, K mở","hai cực nguồn (mạch kín)":"U nguồn, K đóng"}[vt]||(rec.kind+" · "+vt);
      api.record({lan:String(S.recs.length),nguon:rec.nguon.replace(" (pin cũ)"," cũ"),dai:short,doc:fmt(read,m.dec)+(ok?" ✓":" ✗"),kim:fmt(tr,m.dec)+" "+m.unit});
      if(fb)fb.innerHTML=ok?`<div class="callout ok">Đã ghi. Kim chỉ ${fmt(tr,m.dec)} ${m.unit}, em đọc ${fmt(read,m.dec)} ${m.unit}: khớp.</div>`
        :`<div class="callout bad">Đã ghi. Kim chỉ ${fmt(tr,m.dec)} ${m.unit}, em đọc ${fmt(read,m.dec)} ${m.unit}: lệch. Đếm lại: mỗi vạch nhỏ là ${fmt(m.step,m.dec)} ${m.unit}, mỗi vạch có số là ${fmt(m.major,m.unit==="A"?1:0)} ${m.unit}.</div>`;
      if(inp){inp.value="";}
      refresh();
    }
    function onVpClick(e){
      const t=e.target.closest("[data-cv]");if(!t)return;const k=t.dataset.cv;
      if(k==="cells"){bat.cells=+t.dataset.n;recalc();batCard();api.toast(`Nguồn ${nguonLabel()}.`,"info",1800)}
      else if(k==="old"){bat.old=t.dataset.v==="1";recalc();batCard()}
      else if(k==="rec")recordReading(t.dataset.m);
      else if(k==="fuse"){am.blown=false;recalc();meterCard(am);api.toast("Đã thay cầu chì ampe kế. Kiểm tra lại cách mắc trước khi đóng công tắc.","info")}
    }
    function onVpKey(e){if(e.key==="Enter"&&e.target.id==="readIn"){e.preventDefault();const b=api.vp.querySelector('[data-cv="rec"]');if(b)recordReading(b.dataset.m)}}
    api.vp.addEventListener("click",onVpClick);api.vp.addEventListener("keydown",onVpKey);


    function compAt(p){for(const c of comps.slice().reverse()){const s=L.SPEC[c.type];if(Math.abs(p.x-c.x)<s.w/2&&Math.abs(p.y-c.y)<s.h/2+6)return c}return null}
    function wireAt(p){for(const w of wires.slice().reverse()){const pts=L.sample(L.wirePts(tpos(w.a),tpos(w.b)),24);if(L.distToPoly(p,pts)<9)return w}return null}
    function delHandle(){if(!S.sel)return null;const w=wires.find(x=>x.id===S.sel);if(!w)return null;return L.bez(L.wirePts(tpos(w.a),tpos(w.b)),.5)}

    /* ================= cảnh 3D: toạ độ bảng (đơn vị thiết kế) ↔ không gian ================= */
    const s=.0034,PY=.075;                     /* 1 đơn vị bảng = 3,4 mm cảnh; đỉnh chốt nối cao PY */
    const toW=(x,y,h)=>[(x-A0.W/2)*s,h||0,(y-A0.H/2)*s];
    const root=new G.Node();
    const wood={color:"#B98A5A",rough:.6,coat:.15,key:"board",hooks:{fu:"uniform float uDay;",fs:`{float g=sin(vO.x*38.+sin(vO.z*7.)*2.+sin(vO.x*3.1)*4.)*.5+.5;float n=fract(sin(dot(floor(vO.xz*90.),vec2(12.9,78.2)))*43758.5);base.rgb*=.86+.16*g+.04*n;}`},uniforms:{uDay:1}};
    let board=null;
    const plastic=(c)=>({color:c,rough:.4,coat:.35});const metal={color:"#C9CED8",rough:.25,metal:1};
    /* --- linh kiện --- */
    const N={};for(const c of comps){N[c.id]=root.add(new G.Node())}
    /* nguồn: hộp pin, tối đa 4 pin AA nằm nối tiếp */
    {const n=N.bat;const w=SPECW("battery"),d=SPECH("battery");n.add(R.mesh(G.box(w,.07,d,.02,3),plastic("#2D3348"))).pos=[0,.035,0];
      n.add(R.mesh(G.box(w-.06,.02,d-.08,.01,2),plastic("#1B1F2D"))).pos=[0,.07,0];
      n.cells=[0,1,2,3].map(i=>{const cl=n.add(new G.Node());const L0=.2;cl.add(R.mesh(G.cylinder(.048,L0,24),{color:"#2FA35B",rough:.35,coat:.5})).quat=G.Q.euler(0,0,-Math.PI/2);cl.children[0].pos=[-L0/2,0,0];
        cl.add(R.mesh(G.cylinder(.05,.03,24),{color:"#C9A227",rough:.3,metal:.8})).quat=G.Q.euler(0,0,-Math.PI/2);cl.children[1].pos=[L0/2-.03,0,0];
        cl.add(R.mesh(G.cylinder(.018,.012,12),metal)).quat=G.Q.euler(0,0,-Math.PI/2);cl.children[2].pos=[L0/2,0,0];cl.pos=[(i-1.5)*.205,.09,0];return cl})}
    /* bóng đèn trên đế */
    {const n=N.lamp;n.add(R.mesh(G.box(SPECW("lamp")*.8,.06,SPECH("lamp")*.55,.02,3),plastic("#3A4058"))).pos=[0,.03,.04];
      n.add(R.mesh(G.cylinder(.05,.07,24),metal)).pos=[0,.06,0];
      n.add(R.mesh(G.cylinder(.042,.05,24),{color:"#D9DEE6",rough:.3,metal:.9})).pos=[0,.13,0];
      n.glass=n.add(R.mesh(G.sphere(.105,32,24),{type:"glass",color:"#F2F6FF",alpha:.5}));n.glass.pos=[0,.27,0];
      const fil=[];for(let i=0;i<=40;i++){const t=i/40,a=t*Math.PI*2*6;fil.push([-.035+.07*t,.27+Math.sin(a)*.008,Math.cos(a)*.008])}
      n.fil=n.add(R.mesh(G.merge([G.tube(fil,.0028,5),G.tube([[-.035,.27,0],[-.03,.16,0]],.002,4),G.tube([[.035,.27,0],[.03,.16,0]],.002,4)]),{type:"unlit",color:"#3A3A3A"}));
      n.halo=n.add(R.mesh(G.sphere(1,24,16),{type:"unlit",color:"#FFD98A",transparent:true,blend:"add",order:5,key:"halo",hooks:{fu:"uniform float uI;",fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=pow(abs(dot(N,V)),2.4)*uI;base.rgb=uBase.rgb*f;base.a=f;}`},uniforms:{uI:0}}));n.halo.pos=[0,.27,0];
      n.spot=n.add(R.mesh(G.disk(1,0,40,true),{type:"unlit",color:"#FFC86A",transparent:true,blend:"add",order:4,key:"spotb",hooks:{fu:"uniform float uI;",fs:`{float r=length(vO.xz);float f=pow(clamp(1.-r,0.,1.),2.)*uI;base.rgb=uBase.rgb*f*.5;base.a=f;}`},uniforms:{uI:0}}));n.spot.pos=[0,.002,0]}
    /* công tắc cầu dao */
    {const n=N.sw;n.add(R.mesh(G.box(SPECW("switch")*.92,.035,SPECH("switch")*.8,.012,2),plastic("#E4E7EE"))).pos=[0,.018,0];
      const a=-.3,b=.3;n.add(R.mesh(G.box(.05,.08,.06,.008,1),metal)).pos=[a+.02,.075,0];n.add(R.mesh(G.box(.07,.06,.06,.008,1),metal)).pos=[b-.03,.065,0];
      n.lever=n.add(new G.Node());n.lever.pos=[a+.02,.1,0];n.lever.add(R.mesh(G.box(.52,.012,.04,.004,1),metal)).pos=[.26,0,0];
      n.lever.add(R.mesh(G.cylinder(.025,.12,16),plastic("#C2413A"))).pos=[.52,0,0]}
    /* đồng hồ đo: hộp, mặt số nghiêng có kim (vẽ lên texture) */
    function meterBuild(c){const n=N[c.id];const w=SPECW(c.type)*.9,d=SPECH(c.type)*.82;
      n.add(R.mesh(G.box(w,.12,d,.03,3),plastic(c.type==="ammeter"?"#E9EDF5":"#E9EDF5"))).pos=[0,.06,-.02];
      const cnv=document.createElement("canvas");cnv.width=512;cnv.height=300;const tex=R.tex2D(cnv,{mip:false});
      const face=n.add(R.mesh(G.plane(w*.86,d*.7),{type:"unlit",color:"#FFFFFF",key:"dial",hooks:{fu:"uniform sampler2D uTex;uniform float uDim;",fs:"{base.rgb=texture(uTex,vUV).rgb*uDim;}"},textures:{uTex:tex},uniforms:{uDim:1}}));
      face.pos=[0,.125,-.05];face.quat=G.Q.euler(.35,0,0);
      n.add(R.mesh(G.box(w*.9,.012,d*.76,.006,2),plastic("#9AA3B5"))).pos=[0,.118,-.05];
      n.cnv=cnv;n.tex=tex;n.last=null}
    meterBuild(am);meterBuild(vm);
    function SPECW(t){return L.SPEC[t].w*s}function SPECH(t){return L.SPEC[t].h*s}
    /* chốt nối */
    const posts={};
    function postFor(t){const n=root.add(new G.Node());const col=t.pol==="+"?"#D63A3F":t.pol==="−"?"#20242F":"#B08A3C";
      n.add(R.mesh(G.cylinder(.03,.04,20),{color:col,rough:.35,coat:.5}));n.add(R.mesh(G.cylinder(.024,.03,20),metal)).pos=[0,.04,0];
      n.ring=n.add(R.mesh(G.tube(Array.from({length:33},(_,i)=>[Math.cos(i/32*6.283)*.045,.002,Math.sin(i/32*6.283)*.045]),.006,6),{type:"unlit",color:"#FF6BD6"}));n.ring.visible=false;return n}
    /* dây nối: ống mềm uốn cong lên khỏi mặt bảng */
    let wireNodes={},wireSig="",tmpWire=null;
    function wirePath(a,b){const pts=L.sample(L.wirePts(a,b),28);return pts.map((p,i)=>{const t=i/(pts.length-1);const w=toW(p.x,p.y);w[1]=PY+.02+Math.sin(Math.PI*t)*.07;return w})}
    function wireMesh(pts,col,o){o=o||{};return R.mesh(G.tube(pts,o.r||.013,8),{color:col,rough:.45,coat:.4,emis:o.hot?[1.2,.15,.1]:[0,0,0]})}
    function rebuildWires(){const sig=wires.map(w=>w.id+w.a+w.b+(S.sel===w.id?"s":"")+(res&&Math.abs(res.wireI[w.id]||0)>L.PAR.shortA?"h":"")).join("|")+comps.map(c=>c.x+","+c.y).join(";");
      if(sig===wireSig)return;wireSig=sig;for(const k in wireNodes){root.remove(wireNodes[k]);R.dispose(wireNodes[k])}wireNodes={};
      for(const w of wires){const a=tpos(w.a),b=tpos(w.b);const hot=res&&Math.abs(res.wireI[w.id]||0)>L.PAR.shortA;const n=root.add(wireMesh(wirePath(a,b),S.sel===w.id?"#C4B5FD":w.col,{hot,r:S.sel===w.id?.017:.013}));wireNodes[w.id]=n}}
    const flowM=root.add(R.instanced(G.sphere(1,10,8),{type:"unlit",color:"#FFFFFF",transparent:true,blend:"add",order:5,key:"flowdot",hooks:{fs:`{vec3 N=normalize(vN);vec3 V=normalize(uCam-vW);float f=pow(abs(dot(N,V)),1.5);base.rgb=uBase.rgb*vC.rgb*f*1.4;base.a=f;}`}},400));

    /* nhãn và nút xóa dây */
    const LB=G.labels(over,R,{bounds:api.safe});
    const tag={};for(const c of comps)tag[c.id]=LB.add(`<span></span>`,()=>{const w=toW(c.x,c.y);return[w[0],.32,w[2]-L.SPEC[c.type].h*s*.45]});
    const hintL=LB.add(`<span>Chạm một chốt kim loại, rồi chạm chốt khác để nối dây</span>`,()=>toW(A0.W/2,A0.board.y+40,.05),"plain");
    const delBtn=document.createElement("div");delBtn.className="gl-menu";delBtn.hidden=true;delBtn.innerHTML=`<button class="main" data-del="1">Gỡ dây này</button>`;over.appendChild(delBtn);
    delBtn.addEventListener("click",e=>{if(e.target.closest("[data-del]")&&S.sel)delWire(S.sel);delBtn.hidden=true});

    /* ================= camera ================= */
    const cam=R.cam;const orbit=G.orbit(cam,{minPitch:.35,maxPitch:1.45});
    let safe={x:0,y:0,w:1,h:1},zm=1,PRE={t:[0,0,.02],yaw:0,pitch:1.0,rad:1.8};
    function fitDist(rad){const sz=R.size();const tv=Math.tan(cam.fov/2)*safe.h/sz.h,th=Math.tan(cam.fov/2)*(sz.w/sz.h)*safe.w/sz.w;return rad/Math.min(tv,th)}
    function home(){Object.assign(cam,{target:[...PRE.t],yaw:PRE.yaw,pitch:PRE.pitch,dist:fitDist(PRE.rad)*zm})}
    function buildBoard(){if(board){root.remove(board);R.dispose(board)}board=root.add(new G.Node());const b=A0.board;const w=b.w*s,d=b.h*s;
      board.add(R.mesh(G.box(w,.06,d,.03,3),wood)).pos=[0,-.03,0];
      for(const k in posts){root.remove(posts[k]);R.dispose(posts[k])}for(const t of termAll())posts[t.id]=postFor(t)}
    function layout(){const r=vp.getBoundingClientRect();R.resize(r.width,r.height,Math.min(2,window.devicePixelRatio||1));safe=api.safe();const sz=R.size();
      const portrait=safe.w/safe.h<0.9;const was=A0&&A0.W;A0=anchors(portrait);
      if(was!==A0.W){for(const c of comps)Object.assign(c,A0.pos[c.id]);buildBoard();wireSig="";PRE={t:[0,0,portrait?.06:.05],yaw:0,pitch:portrait?1.22:1.12,rad:portrait?1.58:1.6};home()}
      cam.shift=[2*(safe.x+safe.w/2)/sz.w-1,1-2*(safe.y+safe.h/2)/sz.h];cam.dist=fitDist(PRE.rad)*zm}
    function theme(){day=api.day;P=L.palette(day);const E=R.env;
      if(day){E.bgTop=H("#EEF2FC");E.bgBot=H("#D2DAEE");E.bgGlow=H("#FFFFFF");E.sky=H("#C3CCE8");E.gnd=H("#8A90A6");E.hor=H("#D2D9EC");E.exposure=.9;E.ink=.45}
      else{E.bgTop=H("#141B44");E.bgBot=H("#04061A");E.bgGlow=H("#2C2A78");E.sky=H("#5B68A8");E.gnd=H("#141830");E.hor=H("#36406A");E.exposure=.82;E.ink=0}
      E.k1c=[2.1,2.0,1.9];E.k2c=[.65,.75,1];E.k3c=[.85,.8,.95];am.last=vm.last=null;N.am.last=N.vm.last=null;over.classList.toggle("day",day)}

    /* ================= con trỏ: điểm trên mặt bảng ================= */
    function boardPt(px,py){const r=R.ray(px,py);if(Math.abs(r.d[1])<1e-6)return null;const t=(PY-r.o[1])/r.d[1];if(t<=0)return null;const x=r.o[0]+r.d[0]*t,z=r.o[2]+r.d[2]*t;return{x:x/s+A0.W/2,y:z/s+A0.H/2}}
    const ptr=C.pointer(cv,{
      down(p,e){const b=boardPt(p.x,p.y);if(!b){orbit.start(p,e.pointerId);return true}
        const t=termAt(b,22);
        if(t){if(S.pending&&S.pending!==t.id){addWire(S.pending,t.id);S.pending=null;return true}wdrag={from:t.id,cur:b,moved:false};S.sel=null;return true}
        S.pending=null;
        const c=compAt(b);if(c){drag={c,dx:b.x-c.x,dy:b.y-c.y};S.sel=null;return true}
        const w=wireAt(b);if(w){S.sel=w.id;return true}
        S.sel=null;orbit.start(p,e.pointerId);drag={orbit:1};return true},
      move(p,e){if(drag&&drag.orbit){orbit.move(p,e.pointerId);return}const b=boardPt(p.x,p.y);if(!b)return;
        if(wdrag){wdrag.cur=b;wdrag.moved=true;const t=termAt(b,24);S.hover=t&&t.id!==wdrag.from?t.id:null;return}
        if(drag){const bd=A0.board,sp=L.SPEC[drag.c.type];drag.c.x=C.clamp(Math.round((b.x-drag.dx)/10)*10,bd.x+sp.w/2+20,bd.x+bd.w-sp.w/2-20);drag.c.y=C.clamp(Math.round((b.y-drag.dy)/10)*10,bd.y+sp.h/2+24,bd.y+bd.h-sp.h/2-40);drag.moved=true;movePosts()}},
      up(p,e,tap){if(drag&&drag.orbit){orbit.end(e.pointerId);drag=null;return}const b=boardPt(p.x,p.y)||{x:-1e4,y:-1e4};
        if(wdrag){const from=wdrag.from;wdrag=null;S.hover=null;const t=termAt(b,24);
          if(t&&t.id!==from)addWire(from,t.id);else if(tap){S.pending=from;api.toast("Đã chọn một chốt. Chạm tiếp vào chốt cần nối.","info",2200)}return}
        if(drag){const c=drag.c;const moved=drag.moved;drag=null;if(moved&&!tap)return;
          if(c===sw){sw.closed=!sw.closed;recalc();if(sw.closed)api.toast("Đã đóng công tắc K.","info",1400)}
          else if(c===bat)batCard();else if(c===lamp)lampCard();else meterCard(c)}},
      cancel(){drag=null;wdrag=null;orbit.end()},
      hover(p){if(frameN%2)return;const b=boardPt(p.x,p.y);if(!b){S.hover=null;return}const t=termAt(b,22);S.hover=t?t.id:null;cv.style.cursor=t?"crosshair":compAt(b)?"pointer":wireAt(b)?"pointer":"grab"}});
    function onWheel(e){e.preventDefault();zm=C.clamp(zm*Math.exp(e.deltaY*.0012),.55,1.8);cam.dist=fitDist(PRE.rad)*zm}
    cv.addEventListener("wheel",onWheel,{passive:false});

    /* ---------- khay ---------- */
    const ico={
      bat:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><rect x="6" y="13" width="26" height="14" rx="3"/><path d="M32 17v6M13 20h4M15 18v4M22 20h4"/></svg>',
      lamp:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="20" cy="17" r="9"/><path d="M16 26h8M17 30h6M15 13l10 8M25 13l-10 8"/></svg>',
      sw:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M5 26h8M27 26h8"/><circle cx="13" cy="26" r="2.5"/><circle cx="27" cy="26" r="2.5"/><path d="M13 26l13-10"/></svg>',
      A:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="20" cy="20" r="13"/><text x="20" y="25" text-anchor="middle" font-size="14" font-weight="800" fill="currentColor" stroke="none">A</text></svg>',
      V:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="20" cy="20" r="13"/><text x="20" y="25" text-anchor="middle" font-size="14" font-weight="800" fill="currentColor" stroke="none">V</text></svg>',
      flow:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 20h22M22 13l7 7-7 7"/><circle cx="10" cy="20" r="2" fill="currentColor"/></svg>',
      cut:'<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="28" r="5"/><circle cx="28" cy="28" r="5"/><path d="M15 24L29 8M25 24L11 8"/></svg>'
    };
    function refreshDock(){
      api.dock.innerHTML=`<button class="titem" data-k="bat">${ico.bat}Nguồn<br>${nguonLabel().replace(" (pin cũ)","")}</button><button class="titem" data-k="lamp">${ico.lamp}Bóng đèn<br>6 V–0,5 A</button><button class="titem" data-k="sw" aria-pressed="${sw.closed}">${ico.sw}Công tắc<br>${sw.closed?"đóng":"mở"}</button><button class="titem" data-k="am">${ico.A}Ampe kế</button><button class="titem" data-k="vm">${ico.V}Vôn kế</button><button class="titem" data-k="flow" aria-pressed="${S.flow}">${ico.flow}Chiều<br>dòng điện</button><button class="titem" data-k="clear">${ico.cut}Gỡ hết<br>dây nối</button>`;
    }
    function onDock(e){const t=e.target.closest("[data-k]");if(!t)return;const k=t.dataset.k;
      if(k==="bat")batCard();else if(k==="lamp")lampCard();else if(k==="sw"){sw.closed=!sw.closed;recalc()}else if(k==="am")meterCard(am);else if(k==="vm")meterCard(vm);
      else if(k==="flow"){S.flow=!S.flow;refreshDock()}
      else if(k==="clear"){if(t.dataset.arm){wires=[];S.sel=null;recalc();delete t.dataset.arm}else{t.dataset.arm="1";t.lastChild.textContent="";t.innerHTML=ico.cut+"Chạm lần nữa<br>để gỡ";setTimeout(()=>{if(t.isConnected)refreshDock()},2600)}}}
    api.dock.addEventListener("click",onDock);

    /* ---------- hướng dẫn theo bước ---------- */
    const has=(kind,vt,key)=>S.recs.some(r=>r.kind===kind&&r.vt.startsWith(vt)&&(!key||r.key===key));
    function pairKeys(){const ks=[...new Set(S.recs.map(r=>r.key))];return ks.filter(k=>has("I","(1)",k)&&has("I","(2)",k))}
    function seriesReady(){ /* mạch nối tiếp đủ bốn bộ phận: thử đóng công tắc để kiểm */
      const was=sw.closed;sw.closed=true;const r=L.solve(comps,wires);sw.closed=was;
      return r.meter.am!=null&&Math.abs(r.meter.am)>0.05&&r.lamp.lamp&&Math.abs(r.lamp.lamp.I)>0.05&&Math.abs(r.meter.am)<1;
    }
    function refresh(){
      refreshDock();
      api.okAt(0,S.locked);
      const k=pairKeys();
      const step1=k.length>0&&has("U","hai đầu đèn")&&has("U","hai cực nguồn");
      api.okAt(1,step1);api.okAt(2,step1);api.okAt(3,S.finished);
      if(bodyEl)renderStep();
    }
    function sumBySource(){
      const keys=[...new Set(S.recs.map(r=>r.key))];
      const last=(f)=>{const a=S.recs.filter(f);return a.length?a[a.length-1].tr:null};
      return keys.map(key=>({key,nguon:S.recs.find(r=>r.key===key).nguon,I1:last(r=>r.key===key&&r.kind==="I"&&r.vt.startsWith("(1)")),I2:last(r=>r.key===key&&r.kind==="I"&&r.vt.startsWith("(2)")),Un:last(r=>r.key===key&&r.kind==="U"&&r.vt.startsWith("hai cực nguồn (mạch hở)"))??last(r=>r.key===key&&r.kind==="U"&&r.vt.startsWith("hai cực nguồn")),Ud:last(r=>r.key===key&&r.kind==="U"&&r.vt==="hai đầu đèn")}));
    }
    function renderStep(){
      const el=bodyEl;if(!el)return;
      const gvTip=t=>api.mode==="gv"?`<div class="callout"><b>Giáo viên:</b> ${t}</div>`:"";
      if(stepIdx===0){
        const q1=[["lon","I₁ lớn hơn I₂ (đèn “dùng bớt” dòng điện)"],["bang","I₁ bằng I₂"],["nho","I₁ nhỏ hơn I₂"]];
        const q2=[["lon","Lớn hơn"],["bang","Bằng"],["nho","Nhỏ hơn"]];
        el.innerHTML=`<h3>Dự đoán trước khi đo</h3>
          <p class="lead2"><b>Câu 1.</b> Đo cường độ dòng điện bằng ampe kế ở vị trí (1) – trước bóng đèn – được I₁, ở vị trí (2) – sau bóng đèn – được I₂. Em dự đoán:</p>
          <div class="opts">${q1.map(([k,t],i)=>`<button class="opt" data-p1="${k}" aria-pressed="${S.p1===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          <p class="lead2"><b>Câu 2.</b> Khi đèn đang sáng, hiệu điện thế giữa hai đầu bóng đèn so với số vôn đo được giữa hai cực nguồn (lúc chưa mắc vào mạch) sẽ:</p>
          <div class="opts">${q2.map(([k,t],i)=>`<button class="opt" data-p2="${k}" aria-pressed="${S.p2===k}" ${S.locked?"disabled":""}><span class="k">${"ABC"[i]}</span>${t}</button>`).join("")}</div>
          ${S.locked?`<div class="callout ok">Đã chốt dự đoán. Bấm <b>Bước tiếp</b> để lắp mạch và đo.</div>`:`<button class="btn main" data-k="lock" ${S.p1&&S.p2?"":"disabled"}>Chốt dự đoán</button>`}
          ${gvTip("câu 1 là quan niệm sai phổ biến; nên cho học sinh giải thích lí do trước khi đo.")}`;
      }else if(stepIdx===1){
        const key=srcKey();const sr=seriesReady();
        const items=[
          [sr||has("I","(1)"),"Lắp mạch nối tiếp: nguồn – ampe kế ở vị trí (1) – bóng đèn – công tắc. Chốt (+) của ampe kế nối về phía cực (+) của nguồn.",sch("p1"),`<button class="btn sm" data-k="p1">Lắp sẵn mạch này</button>`,"Chạm một chốt rồi chạm chốt khác để nối dây (hoặc kéo từ chốt này sang chốt kia)."],
          [has("I","(1)",key),"Đóng công tắc K, chạm vào ampe kế để phóng to, đọc và ghi I₁.","",`<button class="btn sm" data-k="close">Đóng công tắc</button> <button class="btn sm" data-k="readA">Đọc ampe kế</button>`,""],
          [has("I","(2)",key),"Ngắt công tắc, chuyển ampe kế sang vị trí (2) – sau bóng đèn. Đóng công tắc, đọc và ghi I₂.",sch("p2"),`<button class="btn sm" data-k="p2">Chuyển sẵn sang (2)</button> <button class="btn sm" data-k="close">Đóng công tắc</button> <button class="btn sm" data-k="readA">Đọc ampe kế</button>`,""],
          [has("U","hai cực nguồn")&&has("U","hai đầu đèn"),"Đo hiệu điện thế: vôn kế nối vào hai cực nguồn khi công tắc mở; rồi mắc vôn kế song song với hai đầu đèn, đóng công tắc, đọc U đèn.",sch("v"),`<button class="btn sm" data-k="vs">Vôn kế vào hai cực nguồn</button> <button class="btn sm" data-k="vl">Vôn kế vào hai đầu đèn</button> <button class="btn sm" data-k="open">Mở công tắc</button> <button class="btn sm" data-k="close">Đóng công tắc</button> <button class="btn sm" data-k="readV">Đọc vôn kế</button>`,""],
          [pairKeys().length>=2,"Đổi nguồn 3 V hoặc 6 V (chạm vào nguồn) rồi đo lại I₁, I₂, U.","",`<button class="btn sm" data-k="bat">Đổi nguồn</button>`,"Không bắt buộc, nhưng cần để thấy nguồn càng lớn thì dòng điện càng lớn."]];
        let nowSet=false;
        el.innerHTML=`<h3>Lắp mạch và đo · nguồn ${nguonLabel()}</h3>
          <ol class="todo">${items.map(([d,t,img,b,h])=>{const now=!d&&!nowSet;if(now)nowSet=true;return`<li class="${d?"done":""} ${now?"now":""}"><span class="tick">✓</span><div>${t}${now&&img?`<div class="schbox">${img}</div>`:""}${now&&h?`<div class="muted" style="font-size:.82rem;margin-top:2px">${h}</div>`:""}${!d?`<div class="act">${b}</div>`:""}</div></li>`}).join("")}</ol>
          <div class="callout warn"><b>An toàn (SGK):</b> không nối trực tiếp hai chốt ampe kế vào hai cực nguồn; luôn để công tắc mở khi nối dây; nhờ giáo viên kiểm tra mạch trước khi đóng công tắc.</div>
          <p class="muted" style="font-size:.84rem">Chạm vào dây để chọn, chạm dấu ✕ để gỡ. Bật “Chiều dòng điện” ở khay để thấy dòng điện chạy từ cực (+) qua mạch về cực (−).</p>
          ${gvTip("chọn 0,25× rồi bấm đóng công tắc để cả lớp thấy kim ampe kế dao động rồi mới đứng yên – vì vậy phải chờ kim đứng yên mới đọc.")}`;
      }else if(stepIdx===2){
        const rows=sumBySource();const nOk=S.recs.filter(r=>r.ok).length;
        el.innerHTML=`<h3>Quan sát và so sánh</h3>
          ${rows.length?`<div class="table-wrap"><table class="atoms"><thead><tr><th>Nguồn</th><th>I₁ (A)</th><th>I₂ (A)</th><th>U nguồn (V)</th><th>U đèn (V)</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.nguon}</td><td class="num">${r.I1==null?"—":fmt(r.I1,2)}</td><td class="num">${r.I2==null?"—":fmt(r.I2,2)}</td><td class="num">${r.Un==null?"—":fmt(r.Un,1)}</td><td class="num">${r.Ud==null?"—":fmt(r.Ud,1)}</td></tr>`).join("")}</tbody></table></div><p class="muted" style="font-size:.82rem">Theo số kim chỉ; số em đọc nằm trong bảng đo.</p>`:`<div class="callout warn">Chưa có số đo. Quay lại bước 2.</div>`}
          ${S.recs.length?`<div class="callout ${nOk===S.recs.length?"ok":""}">Em đọc đúng <b>${nOk}/${S.recs.length}</b> lần (lệch không quá một vạch nhỏ).</div>`:""}
          <ul class="tlist"><li>So sánh I₁ và I₂ trong cùng một nguồn.</li><li>So sánh U đèn với U nguồn.</li><li>Nguồn lớn hơn thì số chỉ ampe kế và độ sáng của đèn thay đổi thế nào?</li></ul>
          ${gvTip("cho các nhóm đọc to bảng của mình; nếu I₁ và I₂ lệch một vạch, thảo luận về sai số khi đọc.")}`;
      }else{
        const rows=sumBySource().filter(r=>r.I1!=null&&r.I2!=null);
        const eq=rows.length&&rows.every(r=>Math.abs(r.I1-r.I2)<0.011);
        const r0=sumBySource().find(r=>r.Un!=null&&r.Ud!=null);
        const Q=[
          {k:"a",t:"Muốn đo cường độ dòng điện chạy qua bóng đèn, mắc ampe kế thế nào?",o:[["a","Song song với bóng đèn"],["b","Nối tiếp với bóng đèn, chốt (+) của ampe kế nối về phía cực (+) của nguồn"],["c","Nối tiếp với bóng đèn, chốt (−) của ampe kế nối về phía cực (+) của nguồn"],["d","Nối thẳng hai chốt ampe kế vào hai cực nguồn"]],ok:"b",why:{a:"Mắc song song thì gần như toàn bộ dòng điện đi qua ampe kế (điện trở rất nhỏ): đèn tắt, ampe kế có thể hỏng.",c:"Dòng điện đi vào chốt (−) làm kim lệch ngược về phía dưới số 0.",d:"Đây là điều SGK cấm: dòng điện rất lớn làm hỏng ampe kế và nguồn."}},
          {k:"b",t:"Để đo hiệu điện thế giữa hai đầu bóng đèn, mắc vôn kế thế nào?",o:[["a","Nối tiếp với bóng đèn"],["b","Song song với bóng đèn: hai chốt vôn kế nối vào hai đầu đèn, chốt (+) về phía cực (+)"],["c","Chỉ nối một chốt vôn kế vào đèn"]],ok:"b",why:{a:"Vôn kế có điện trở rất lớn; mắc nối tiếp thì dòng điện gần bằng 0, đèn tắt và vôn kế chỉ gần bằng số vôn của nguồn.",c:"Vôn kế đo hiệu điện thế giữa hai điểm nên cần nối cả hai chốt."}},
          {k:"c",t:"Một pin ghi 1,5 V. Nối vôn kế vào hai cực pin (chưa mắc vào mạch), vôn kế chỉ 1,3 V. Kết luận?",o:[["a","Pin còn mới"],["b","Pin đã cũ"],["c","Chắc chắn vôn kế bị hỏng"]],ok:"b",why:{a:"Pin mới cho số chỉ bằng số vôn ghi trên pin.",c:"Có thể kiểm tra vôn kế bằng một pin mới; số chỉ nhỏ hơn số ghi trên pin là dấu hiệu pin cũ (SGK Bài 24, 25)."}}];
        const all=Q.every(q=>S.q[q.k]===q.ok);
        el.innerHTML=`<h3>Giải thích và kết luận</h3>
          ${S.p1?`<div class="callout ${S.p1==="bang"?"ok":"bad"}">Câu 1 em dự đoán: <b>${{lon:"I₁ > I₂",bang:"I₁ = I₂",nho:"I₁ < I₂"}[S.p1]}</b>. Số đo: ${rows.length?(eq?"<b>I₁ = I₂</b>":"I₁ và I₂ lệch nhau – kiểm tra lại cách đọc"):"chưa đủ số đo"}.</div>`:""}
          ${S.p2&&r0?`<div class="callout ${S.p2==="nho"?"ok":"bad"}">Câu 2 em dự đoán: <b>${{lon:"lớn hơn",bang:"bằng",nho:"nhỏ hơn"}[S.p2]}</b>. Số đo (${r0.nguon}): U nguồn ${fmt(r0.Un,1)} V, U đèn ${fmt(r0.Ud,1)} V.</div>`:""}
          <ul class="tlist">
          <li><b>I₁ = I₂:</b> dòng điện không bị bóng đèn “dùng bớt”. Ý kiến “cường độ dòng điện giảm sau khi đi qua bóng đèn” là không đúng. Đèn chuyển năng lượng điện thành nhiệt và ánh sáng chứ không giữ lại dòng điện.</li>
          <li><b>U đèn nhỏ hơn U nguồn:</b> một phần hiệu điện thế nằm trên dây nối, ampe kế và bên trong pin.</li>
          <li><b>Nguồn có hiệu điện thế lớn hơn</b> thì số chỉ ampe kế lớn hơn và đèn sáng hơn.</li>
          <li><b>Sai số</b> có thể do: pin không đúng giá trị ghi trên vỏ, dây nối lỏng, đọc kim chưa chính xác, điện trở của dây dẫn, ampe kế, vôn kế.</li></ul>
          ${Q.map((q,qi)=>`<p class="lead2"><b>Câu ${qi+1}.</b> ${q.t}</p><div class="opts">${q.o.map(([k,t],i)=>`<button class="opt ${S.q[q.k]===k?(k===q.ok?"right":"wrong"):""}" data-q="${q.k}" data-v="${k}"><span class="k">${"ABCD"[i]}</span>${t}</button>`).join("")}</div>${S.q[q.k]&&S.q[q.k]!==q.ok?`<div class="callout bad">${q.why[S.q[q.k]]}</div>`:""}`).join("")}
          ${all?(S.finished?`<div class="callout ok">Em đã hoàn thành bài.</div>`:`<button class="btn main" data-k="finish">Hoàn thành bài</button>`):""}`;
      }
    }
    function onBody(e){
      const t=e.target.closest("button");if(!t)return;const d=t.dataset;
      if(d.p1){S.p1=d.p1;renderStep();return}
      if(d.p2){S.p2=d.p2;renderStep();return}
      if(d.q){S.q[d.q]=d.v;renderStep();return}
      switch(d.k){
        case "lock":S.locked=true;refresh();api.toast("Đã chốt dự đoán.","ok");break;
        case "p1":sw.closed=false;preset("p1");break;
        case "p2":sw.closed=false;preset("p2");break;
        case "vs":preset("vs");break;
        case "vl":preset("vl");break;
        case "close":sw.closed=true;recalc();break;
        case "open":sw.closed=false;recalc();break;
        case "readA":meterCard(am);break;
        case "readV":meterCard(vm);break;
        case "bat":batCard();break;
        case "finish":S.finished=true;refresh();
          api.done(`<h2>Hoàn thành: Đo cường độ dòng điện và hiệu điện thế</h2><p class="muted">Em đã ghi ${S.recs.length} số đo, đọc đúng ${S.recs.filter(r=>r.ok).length} lần. Kết luận: I₁ = I₂; U đèn nhỏ hơn U nguồn; nguồn lớn hơn thì dòng điện lớn hơn.</p>`);break;
      }
    }

    /* ---------- vòng lặp ---------- */

    /* ================= vẽ ================= */
    function movePosts(){for(const t of termAll()){const n=posts[t.id];if(n)n.pos=toW(t.x,t.y,0)}}
    function place(){
      for(const c of comps){const w=toW(c.x,c.y,0);N[c.id].pos=w}
      movePosts();
      for(const t of termAll()){const n=posts[t.id];if(!n)continue;const on=S.pending===t.id||(wdrag&&wdrag.from===t.id)||S.hover===t.id;n.ring.visible=!!on;n.ring.mat.color=S.pending===t.id||(wdrag&&wdrag.from===t.id)?H("#FF6BD6"):H("#A78BFA")}
      /* nguồn: số pin, pin cũ */
      N.bat.cells.forEach((cl,i)=>{const show=i<bat.cells;cl.visible=show;cl.pos=[(i-(bat.cells-1)/2)*.205,.09,0];cl.children[0].mat.color=bat.old?H("#7D8A7A"):H("#2FA35B")});
      /* đèn */
      const n=N.lamp;n.fil.mat.color=glow>.02?[1.2+2*glow,.75+1.1*glow,.3+.4*glow]:H("#3A3A3A");n.halo.mat.uniforms.uI=glow*1.3;const hs=.12+.35*glow;n.halo.scl=[hs,hs,hs];n.halo.visible=glow>.01;
      n.spot.mat.uniforms.uI=glow*.9;const ss=.25+.55*glow;n.spot.scl=[ss,1,ss];n.spot.visible=glow>.01;
      /* công tắc */
      N.sw.lever.quat=G.Q.euler(0,0,(1-sw.anim)*1.05);
      /* đồng hồ */
      for(const c of [am,vm]){const m=L.METER[c.type==="ammeter"?"A":"V"];const nn=N[c.id];if(nn.last!=null&&Math.abs(nn.last-c.needle)<m.max*.0012&&nn.lastBlown===c.blown)continue;nn.last=c.needle;nn.lastBlown=c.blown;
        const g=nn.cnv.getContext("2d");g.setTransform(1,0,0,1,0,0);g.fillStyle=P.dial;g.fillRect(0,0,512,300);L.dial(g,256,282,250,m,c.needle,P,{big:true});
        if(c.blown){g.fillStyle="rgba(229,72,77,.9)";g.fillRect(0,0,512,46);g.fillStyle="#fff";g.font="800 26px system-ui,sans-serif";g.textAlign="center";g.fillText("CẦU CHÌ ĐỨT",256,32);g.textAlign="left"}
        nn.tex.update(nn.cnv)}
      rebuildWires();
      /* dây đang kéo */
      if(tmpWire){root.remove(tmpWire);R.dispose(tmpWire);tmpWire=null}
      if(wdrag&&wdrag.moved){const a=tpos(wdrag.from);tmpWire=root.add(wireMesh(wirePath(a,wdrag.cur),"#A78BFA",{r:.011}))}
      /* chấm chạy theo chiều dòng điện */
      const D=flowM.data;let k=0;
      if(S.flow)for(const w of wires){const i=res&&res.wireI[w.id]||0;if(Math.abs(i)<.002)continue;const pts=wirePath(tpos(w.a),tpos(w.b));let len=0;const acc=[0];for(let j=1;j<pts.length;j++){len+=Math.hypot(pts[j][0]-pts[j-1][0],pts[j][1]-pts[j-1][1],pts[j][2]-pts[j-1][2]);acc.push(len)}
        const gap=26*s,ph=((flowPhase[w.id]*s%gap)+gap)%gap;const fc=H(P.flow);
        for(let d=ph;d<len&&k<400;d+=gap){let j=1;while(j<acc.length&&acc[j]<d)j++;const a=pts[j-1],b=pts[Math.min(j,pts.length-1)];const t=(d-acc[j-1])/Math.max(1e-6,acc[Math.min(j,acc.length-1)]-acc[j-1]);
          const dd=i<0?len-d:d;void dd;D.set([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t+.004,a[2]+(b[2]-a[2])*t,.016,fc[0],fc[1],fc[2],1],k*8);k++}}
      flowM.setInstances(k);
      /* nhãn */
      const lab={bat:`Nguồn ${nguonLabel()}`,lamp:"Bóng đèn 6 V – 0,5 A",sw:`Công tắc K · ${sw.closed?"đóng":"mở"}`,am:"Ampe kế"+(am.blown?" · cầu chì đứt":""),vm:"Vôn kế"};
      for(const c of comps){const h=`<span>${lab[c.id]}</span>`;if(tag[c.id]._h!==h){tag[c.id].el.innerHTML=h;tag[c.id]._h=h}}
      hintL.on=S.hint&&!wires.length;
      /* nút gỡ dây */
      if(S.sel){const w=wires.find(x=>x.id===S.sel);if(w){const m=L.bez(L.wirePts(tpos(w.a),tpos(w.b)),.5);const q=R.project(toW(m.x,m.y,PY+.1));delBtn.hidden=false;delBtn.style.left=q.x+"px";delBtn.style.top=(q.y-8)+"px"}else delBtn.hidden=true}else delBtn.hidden=true}
    function frame(dt){frameN++;
      const sdt=api.time.playing?dt*api.time.speed:0;simT+=sdt;orbit.update(dt);
      if(!res)recalc();
      sw.anim+=((sw.closed?1:0)-sw.anim)*Math.min(1,dt*14);
      for(const c of [am,vm]){const m=L.METER[c.type==="ammeter"?"A":"V"];const tgt=C.clamp(meterVal(c),-m.max*.06,m.max*1.06);const acc=160*(tgt-c.needle)-15*c.vel;c.vel+=acc*sdt;c.needle+=c.vel*sdt}
      const lp=res&&res.lamp.lamp?res.lamp.lamp.P:0;const tg=C.clamp(Math.pow(lp/3,0.6),0,1);glow+=(tg-glow)*Math.min(1,sdt*10);
      for(const w of wires){const i=res&&res.wireI[w.id]||0;flowPhase[w.id]=((flowPhase[w.id]||0)+i*170*sdt)}
      place();R.render(root,simT);LB.update();
      const Ia=meterVal(am);
      api.time.label(`t = ${fmt(simT,1)} s · ${sw.closed?"K đóng":"K mở"}${Math.abs(Ia)>0.003?` · dòng điện chạy trong mạch`:""}`,glow);
      const dc=document.getElementById("dialCv");
      if(dc&&S.dialFor){
        const c=comps.find(x=>x.id===S.dialFor);const m=L.METER[c.type==="ammeter"?"A":"V"];
        const r=dc.getBoundingClientRect();const dpr=Math.min(2.5,window.devicePixelRatio||1);
        if(dc.width!==Math.round(r.width*dpr)){dc.width=Math.round(r.width*dpr);dc.height=Math.round(r.height*dpr)}
        const g=dc.getContext("2d");g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,r.width,r.height);
        g.fillStyle=P.dial;C.rr(g,0,0,r.width,r.height,14);g.fill();
        L.dial(g,r.width/2,r.height*.93,r.height*.82,m,c.needle,P,{big:true});
        const pe=document.getElementById("dialPos");if(pe)pe.textContent=`Vị trí đo: ${posOf(c)} · Nguồn ${nguonLabel()} · công tắc ${sw.closed?"đóng":"mở"}`;
      }else S.dialFor=null}

    theme();layout();recalc();
    const loop=C.loop(frame);const ro=new ResizeObserver(()=>layout());ro.observe(vp);
    api.time.onReset(()=>{wires=[];sw.closed=false;am.blown=false;bat.cells=1;bat.old=false;S.sel=null;S.pending=null;for(const c of comps)Object.assign(c,A0.pos[c.id]);am.needle=vm.needle=0;am.vel=vm.vel=0;wireSig="";recalc()});
    vp.__lab={get S(){return S},comps,get wires(){return wires},preset,recalc,get res(){return res},addWire,sw,bat,am,vm,recordReading,meterCard,trueRead,R,boardPt,toW:(x,y,h)=>toW(x,y,h)};
    return{
      step(i,el){stepIdx=i;bodyEl=el;el.onclick=onBody;renderStep()},
      layout,
      prefs(){theme();renderStep()},
      unmount(){loop.stop();ptr.destroy();ro.disconnect();cv.removeEventListener("wheel",onWheel);api.dock.removeEventListener("click",onDock);api.vp.removeEventListener("click",onVpClick);api.vp.removeEventListener("keydown",onVpKey);LB.clear();R.dispose(root);
        const x=R.gl.getExtension("WEBGL_lose_context");if(x)x.loseContext();cv.remove();over.remove();delete vp.__lab}};
  }
});
})();
