/* K7-H-02 · Từ số proton đến nguyên tố; vị trí trong bảng tuần hoàn (SGK KHTN 7 – Kết nối tri thức, Bài 3–4) · 2D
   1. Nguyên tố hóa học là tập hợp những nguyên tử cùng loại, có cùng số proton trong hạt nhân. Học sinh thêm/bớt proton (Z = 1…20),
      nguyên tử trung hòa có số electron bằng số proton; xem kí hiệu, tên, khối lượng nguyên tử, số lớp electron và số electron lớp ngoài cùng.
   2. Bảng tuần hoàn: 7 chu kì, các nhóm A (IA…VIIIA) và nhóm B. Với các nguyên tố nhóm A trong 20 nguyên tố đầu:
      số thứ tự chu kì = số lớp electron; số thứ tự nhóm = số electron lớp ngoài cùng (He là ngoại lệ: 2 electron, nhóm VIIIA).
      Học sinh đặt nguyên tố vào đúng ô trong bảng. */
(function(){
"use strict";
const C=window.LabCore,A=window.LabAtom,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const SYM="H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og".split(" ");
const MASS=[0,1,4,7,9,11,12,14,16,19,20,23,24,27,28,31,32,35.5,40,39,40];   /* khối lượng nguyên tử làm tròn theo SGK (amu) */
const KIND=z=>[2,10,18].includes(z)?"kh":[3,4,11,12,13,19,20].includes(z)?"kl":"pk";
const KN={kl:"Kim loại",pk:"Phi kim",kh:"Khí hiếm"},KC={kl:"#60A5FA",pk:"#F59E0B",kh:"#C084FC"};
const GA=["IA","IIA","IIIB","IVB","VB","VIB","VIIB","VIIIB","VIIIB","VIIIB","IB","IIB","IIIA","IVA","VA","VIA","VIIA","VIIIA"];
/* vị trí (chu kì, cột) của nguyên tố Z trong bảng 18 cột; họ lanthanide/actinide đặt ở hai hàng riêng (hàng 8, 9) */
function cell(z){if(z===1)return[1,1];if(z===2)return[1,18];
  const st=[0,2,10,18,36,54,86,118];let p=1;while(z>st[p])p++;const i=z-st[p-1];
  if(p<=3)return[p,i<=2?i:i+10];if(p<=5)return[p,i];
  if(i<=2)return[p,i];if(i<=17)return[p+2,i+1];return[p,i-14]}
const group=z=>{const c=cell(z)[1];return GA[c-1]};

const SPEC={
  predict:[{id:"p1",q:"Điều gì quyết định một nguyên tử thuộc nguyên tố nào?",opts:[["p","Số proton trong hạt nhân"],["n","Số neutron"],["e","Số lớp electron"]],ans:"p",res:"Kết quả: nguyên tử có cùng số proton thuộc cùng một nguyên tố. Số proton là số hiệu nguyên tử."},
    {id:"p2",q:"Nguyên tử có 3 lớp electron, lớp ngoài cùng có 1 electron nằm ở:",opts:[["ok","Chu kì 3, nhóm IA"],["13","Chu kì 1, nhóm IIIA"],["31","Chu kì 3, nhóm IIIA"]],ans:"ok",res:"Kết quả: đó là natri (sodium, Z = 11) ở chu kì 3, nhóm IA."}],
  taskLead:"Phần “Nguyên tử”: thêm hoặc bớt proton để đổi nguyên tố. Phần “Bảng tuần hoàn”: chạm vào ô đúng của nguyên tố được hỏi.",
  tasks:[{html:"<b>Nguyên tố:</b> tạo ít nhất 6 nguyên tố khác nhau.",done:()=>Object.keys(S.made).length>=6},
    {html:"<b>Bảng tuần hoàn:</b> đặt đúng ít nhất 8 nguyên tố.",done:()=>Object.keys(S.placed).length>=8}],
  obs:[{id:"a",q:"Nguyên tử có Z = 17 có:",opts:[["ok","17 proton, 17 electron, xếp thành 3 lớp: 2, 8, 7"],["a","17 proton, 18 electron"],["b","2 lớp electron"]],ans:"ok",why:"Chlorine: chu kì 3, nhóm VIIA, là phi kim."},
    {id:"b",q:"Các nguyên tố trong cùng một nhóm A có đặc điểm chung:",opts:[["ok","Cùng số electron lớp ngoài cùng (trừ He)"],["lop","Cùng số lớp electron"],["kl","Cùng khối lượng"]],ans:"ok",why:"Vì vậy chúng có tính chất hóa học tương tự nhau."},
    {id:"c",q:"Các nguyên tố trong cùng một chu kì có:",opts:[["ok","Cùng số lớp electron"],["ng","Cùng số electron lớp ngoài cùng"],["pr","Cùng số proton"]],ans:"ok",why:"Trong một chu kì, số proton tăng dần từ trái sang phải."}],
  concl:{html:`<ul class="tlist"><li><b>Nguyên tố hóa học</b> là tập hợp những nguyên tử cùng loại, có cùng số proton trong hạt nhân. Mỗi nguyên tố có một kí hiệu hóa học (1 hoặc 2 chữ cái, chữ đầu viết hoa).</li>
    <li>Bảng tuần hoàn xếp các nguyên tố theo chiều tăng dần của điện tích hạt nhân. Mỗi ô ghi số hiệu nguyên tử, kí hiệu, tên, khối lượng nguyên tử.</li>
    <li><b>Chu kì</b> gồm các nguyên tố có cùng số lớp electron (7 chu kì). <b>Nhóm</b> gồm các nguyên tố có tính chất hóa học tương tự, xếp thành cột; với nhóm A, số electron lớp ngoài cùng bằng số thứ tự nhóm (trừ He).</li>
    <li>Các nguyên tố được chia thành kim loại, phi kim và khí hiếm.</li></ul>`,
    quiz:[{id:"q1",q:"Nguyên tố X ở chu kì 2, nhóm VIA. Số proton của X là:",opts:[["a","8"],["b","6"],["c","16"]],ans:"a",why:{b:"Nhóm VIA: 6 electron lớp ngoài; chu kì 2: 2 lớp → 2 + 6 = 8 (oxygen).",c:"16 là sulfur, chu kì 3."}},
      {id:"q2",q:"Nguyên tố nào là khí hiếm?",opts:[["a","Argon (Ar)"],["b","Chlorine (Cl)"],["c","Calcium (Ca)"]],ans:"a",why:{b:"Chlorine là phi kim nhóm VIIA.",c:"Calcium là kim loại nhóm IIA."}}],
    done:`<h2>Hoàn thành: nguyên tố và bảng tuần hoàn</h2><p class="muted">Số proton quyết định nguyên tố; chu kì = số lớp electron, nhóm A = số electron lớp ngoài cùng.</p>`},
  gv:["Cho học sinh dự đoán vị trí trước khi chạm vào ô.","Hỏi: vì sao He có 2 electron lớp ngoài cùng nhưng ở nhóm VIIIA?","Liên hệ: kim loại ở bên trái, phi kim ở bên phải bảng."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 3, 4)</p><ul class="tlist"><li>Phát biểu được khái niệm nguyên tố hóa học, kí hiệu nguyên tố; nêu được nguyên tắc xây dựng bảng tuần hoàn; mô tả được cấu tạo bảng tuần hoàn (ô, nhóm, chu kì); sử dụng bảng tuần hoàn để chỉ ra các nhóm nguyên tố kim loại, phi kim, khí hiếm.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 3 Nguyên tố hóa học; Bài 4 Sơ lược về bảng tuần hoàn các nguyên tố hóa học.</li>
<li>Tên gọi theo Chương trình GDPT 2018 môn Hóa học (nitơ, natri, nhôm, lưu huỳnh, kali giữ tên tiếng Việt kèm tên IUPAC).</li>
<li>Bảng tuần hoàn 118 nguyên tố, cách xếp chu kì và nhóm: <a href="https://iupac.org/what-we-do/periodic-table-of-elements/" target="_blank" rel="noopener">IUPAC Periodic Table of the Elements</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Số neutron hiển thị là của đồng vị phổ biến nhất. Electron xếp theo mô hình Bohr đơn giản dùng cho 20 nguyên tố đầu (2, 8, 8, 2). Boron, silicon được xếp vào nhóm phi kim như cách phân loại đơn giản ở lớp 7.</li></ul>`;

let S;
LabKHTN.register("K7-H-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"z",t:"Số proton"},{k:"nt",t:"Nguyên tố"},{k:"vt",t:"Vị trí"},{k:"loai",t:"Loại"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô hình số proton – nguyên tố và bảng tuần hoàn",views:{nt:{label:"Nguyên tử",icon:IC.dna,frame:[30,30,940,580]},bth:{label:"Bảng tuần hoàn",icon:IC.grid,frame:[30,40,940,560]}}});
    const order=[...Array(20)].map((_,i)=>i+1).sort(()=>Math.random()-.5);
    S={z:6,made:{},placed:{},q:order,qi:0,err:0,recs:0};
    const rec=(z,why)=>{S.recs++;const el=A.EL[z];const [p,c]=cell(z);api.record({lan:String(S.recs),z:String(z),nt:`${el[1]}${el[3]?` (${el[3]})`:""} – ${el[0]}`,vt:`ô ${z}, chu kì ${p}, nhóm ${GA[c-1]}${why?" · "+why:""}`,loai:KN[KIND(z)]})};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const name=z=>{const e=A.EL[z];return e[1]+(e[3]?` (${e[3]})`:"")};
    function mark(z){if(!S.made[z]){S.made[z]=1;rec(z,`${A.shells(z).join(", ")} electron`)}}
    mark(6);
    /* ô nguyên tố */
    function tile(ctx,x,y,w,h,z,o){o=o||{};const k=z<=20?KIND(z):null;const c=k?KC[k]:"#64748B";ctx.save();
      ctx.fillStyle=o.empty?"rgba(0,0,0,.18)":C.rgba(c,o.dim?.16:.32);ctx.strokeStyle=o.hi?"#FDE047":C.rgba(c,o.dim?.35:.85);ctx.lineWidth=o.hi?3:1.2;C.rr(ctx,x,y,w,h,5);ctx.fill();ctx.stroke();
      if(!o.empty){T(ctx,String(z),x+4,y+h*.27,h*.2,"#E2E8F0","left",700);T(ctx,SYM[z-1],x+w/2,y+h*.7,h*.38,o.dim?"#94A3B8":"#FFFFFF");if(o.big){T(ctx,name(z),x+w/2,y+h*.86,h*.09,"#E2E8F0","center",700);T(ctx,fmt(MASS[z],z===17?1:0),x+w-6,y+h*.27,h*.15,"#E2E8F0","right",700)}}
      else T(ctx,"?",x+w/2,y+h*.66,h*.36,"#64748B");ctx.restore()}
    /* ---------- nguyên tử ---------- */
    function drawNT(ctx,P){const z=S.z,sh=A.shells(z),n=A.EL[z][2],cx=290,cy=320;
      const RS=[70,118,166,214];sh.forEach((_,i)=>{ctx.strokeStyle=C.rgba("#93C5FD",.35);ctx.lineWidth=1.5;ctx.setLineDash([5,6]);ctx.beginPath();ctx.arc(cx,cy,RS[i],0,6.283);ctx.stroke();ctx.setLineDash([])});
      /* hạt nhân */
      const tot=z+n,cs=4.6;const items=[];let np_=0,nn_=0;for(let i=0;i<tot;i++){if(np_<z&&(nn_>=n||np_*Math.max(1,n)<=nn_*z)){items.push("p");np_++}else{items.push("n");nn_++}}
      for(let i=tot-1;i>=0;i--){const q=A.nucleusPos(i,cs);A.ball(ctx,cx+q.x,cy+q.y,7.5,A.COL[items[i]],items[i]==="p"?"+":"")}
      /* electron */
      sh.forEach((k,i)=>{for(let j=0;j<k;j++){const a=j/k*6.283+K.simT*(.9-i*.17)+i*.4;A.ball(ctx,cx+Math.cos(a)*RS[i],cy+Math.sin(a)*RS[i],8,A.COL.e,"−")}T(ctx,`${k}e`,cx+RS[i]*.7+14,cy-RS[i]*.7-6,13,"#93C5FD")});
      T(ctx,`Hạt nhân: ${z} proton, ${n} neutron`,cx,cy+250,14,P.mut,"center",700);
      /* thẻ nguyên tố */
      tile(ctx,560,70,170,170,z,{big:true});
      const [p,c]=cell(z);const k=KIND(z);const lx=750;
      T(ctx,name(z),lx,96,20,P.ink,"left");T(ctx,`Kí hiệu: ${SYM[z-1]}`,lx,124,15,P.mut,"left",700);T(ctx,`Số hiệu nguyên tử: ${z}`,lx,148,15,P.mut,"left",700);T(ctx,`Khối lượng nguyên tử: ${fmt(MASS[z],z===17?1:0)} amu`,lx,172,15,P.mut,"left",700);
      T(ctx,`Lớp electron: ${sh.join(", ")}`,lx,196,15,P.mut,"left",700);T(ctx,KN[k],lx,224,15,KC[k],"left");
      D2.block(ctx,560,262,400,70,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,`${sh.length} lớp electron → chu kì ${p}`,760,290,15,P.ink);
      T(ctx,z===2?"He: 2 electron lớp ngoài, xếp vào nhóm VIIIA (khí hiếm)":`${sh[sh.length-1]} electron lớp ngoài cùng → nhóm ${GA[c-1]}`,760,316,14,K.day?"#B45309":"#FCD34D");
      /* bảng mini 20 nguyên tố */
      const mx=560,my=360,cw=22;T(ctx,"Vị trí trong bảng tuần hoàn (4 chu kì đầu)",mx,my-10,13,P.mut,"left",700);
      for(let zz=1;zz<=20;zz++){const [pp,cc]=cell(zz);tile(ctx,mx+(cc-1)*cw,my+(pp-1)*(cw+4),cw-2,cw,zz,{hi:zz===z,dim:zz!==z})}
      for(let pp=1;pp<=4;pp++)T(ctx,String(pp),mx-10,my+(pp-1)*(cw+4)+16,11,P.mut);
      /* chú thích */
      ["kl","pk","kh"].forEach((kk,i)=>{ctx.fillStyle=C.rgba(KC[kk],.5);ctx.fillRect(mx+i*130,my+124,14,14);T(ctx,KN[kk],mx+i*130+20,my+136,13,P.mut,"left",700)})}
    /* ---------- bảng tuần hoàn ---------- */
    const TX=78,TY=110,CW=47,CH=46;
    const cellXY=(p,c)=>[TX+(c-1)*CW,p<=7?TY+(p-1)*CH:TY+7*CH+18+(p-8)*CH];
    function drawBTH(ctx,P){const tgt=S.q[S.qi];
      for(let c=1;c<=18;c++)T(ctx,GA[c-1],TX+(c-1)*CW+CW/2-1,TY-8,10.5,c<=2||c>=13?P.ink:P.mut,"center",700);
      for(let p=1;p<=7;p++)T(ctx,String(p),TX-16,TY+(p-1)*CH+28,14,P.mut);T(ctx,"Chu kì",TX-16,TY-8,10,P.mut);
      for(let z=1;z<=118;z++){const [p,c]=cell(z);const [x,y]=cellXY(p,c);if(z<=20){if(S.placed[z])tile(ctx,x,y,CW-3,CH-3,z);else tile(ctx,x,y,CW-3,CH-3,z,{empty:true})}else tile(ctx,x,y,CW-3,CH-3,z,{dim:true})}
      for(const [p,t] of [[6,"57–71"],[7,"89–103"]]){const [x,y]=cellXY(p,3);ctx.fillStyle="rgba(0,0,0,.18)";C.rr(ctx,x,y,CW-3,CH-3,5);ctx.fill();T(ctx,t,x+CW/2-2,y+28,10,P.mut,"center",700)}
      /* câu hỏi */
      if(tgt){D2.block(ctx,TX+2*CW+6,TY+4,9*CW,CH*2.6,12,P.card,P.card,{stroke:P.line,shadow:false});
        T(ctx,`Đặt nguyên tố: ${name(tgt)} – ${SYM[tgt-1]}`,TX+6.5*CW+6,TY+34,17,P.ink);T(ctx,`Z = ${tgt} · lớp electron: ${A.shells(tgt).join(", ")}`,TX+6.5*CW+6,TY+60,15,K.day?"#B45309":"#FCD34D");T(ctx,"Chạm vào ô đúng trong bảng",TX+6.5*CW+6,TY+84,12.5,P.mut,"center",600)}
      else{D2.block(ctx,TX+2*CW+6,TY+4,9*CW,CH*2.6,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,"Đã đặt đủ 20 nguyên tố đầu!",TX+6.5*CW+6,TY+60,17,"#6EE7B7")}
      ["kl","pk","kh"].forEach((kk,i)=>{ctx.fillStyle=C.rgba(KC[kk],.5);ctx.fillRect(TX+i*140,TY+9*CH+40,14,14);T(ctx,KN[kk],TX+i*140+20,TY+9*CH+52,13,P.mut,"left",700)});
      T(ctx,"Ô mờ: các nguyên tố từ Z = 21 trở đi (lớp 7 chưa học chi tiết)",TX+460,TY+9*CH+52,12.5,P.mut,"left",600)}
    K.drawFn((ctx,P)=>K.view==="nt"?drawNT(ctx,P):drawBTH(ctx,P));
    K.pickFn(q=>{if(K.view!=="bth")return null;for(let z=1;z<=118;z++){const [p,c]=cell(z);const [x,y]=cellXY(p,c);if(q[0]>=x&&q[0]<x+CW-3&&q[1]>=y&&q[1]<y+CH-3)return{z,p,c}}
      for(let p=1;p<=7;p++)for(let c=1;c<=18;c++){const [x,y]=cellXY(p,c);if(q[0]>=x&&q[0]<x+CW-3&&q[1]>=y&&q[1]<y+CH-3)return{z:0,p,c}}return null});
    K.tapFn(h=>{if(!h)return;place(h)});
    function place(h){const tgt=S.q[S.qi];if(!tgt)return;const [p,c]=cell(tgt);
      if(h.p===p&&h.c===c){S.placed[tgt]=1;S.qi++;rec(tgt,"đặt đúng ô")}
      else{S.err++;const sh=A.shells(tgt);api.toast(`${SYM[tgt-1]}: ${sh.length} lớp electron → chu kì ${sh.length}; ${tgt===2?"He thuộc nhóm VIIIA":`${sh[sh.length-1]} electron lớp ngoài → nhóm ${GA[c-1]}`}.`,"warn",2600)}refresh()}
    K.label("Hạt nhân",[290,320],{view:"nt",dir:"nw",len:90});K.label("Lớp electron",[290+118*.71,320+118*.71],{view:"nt",dir:"se",len:40});
    K.dockFn(()=>K.view==="nt"?[{grid:[{k:"p",v:"-1",label:"Bớt 1 proton",icon:IC.minus,dis:S.z<=1},{k:"p",v:"1",label:"Thêm 1 proton",icon:IC.plus,dis:S.z>=20}]},{grid:[1,6,8,11,17,20].map(z=>({k:"z",v:String(z),label:SYM[z-1],icon:""}))}]
      :[{k:"skip",label:"Bỏ qua nguyên tố này",icon:IC.step,dis:!S.q[S.qi]},{k:"rs",label:"Làm lại bảng",icon:IC.reset}]);
    K.onDock((k,v)=>{if(k==="p"){S.z=C.clamp(S.z+(+v),1,20);mark(S.z)}else if(k==="z"){S.z=+v;mark(S.z)}else if(k==="skip"){const t=S.q.splice(S.qi,1)[0];S.q.push(t)}else if(k==="rs"){S.placed={};S.qi=0;S.q.sort(()=>Math.random()-.5)}refresh()});
    K.infoFn(()=>K.view==="nt"?`<div><b>Z = ${S.z}</b>: ${name(S.z)}</div><div>${S.z} proton · ${S.z} electron (nguyên tử trung hòa)</div><small>Đổi số proton là đổi nguyên tố. Đã tạo ${Object.keys(S.made).length} nguyên tố.</small>`
      :`<div><b>Bảng tuần hoàn</b> · 7 chu kì, nhóm A và nhóm B</div><div>Đã đặt đúng: ${Object.keys(S.placed).length}/20</div><small>Chu kì = số lớp electron; nhóm A = số electron lớp ngoài cùng (trừ He).</small>`);
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const z of [1,8,11,13,17,20])K._dockH("z",String(z));for(let i=0;i<8;i++){const t=S.q[S.qi];const [p,c]=cell(t);place({z:t,p,c})}}};
    return K.mount(st)}
});
})();
