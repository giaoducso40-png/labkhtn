/* K8-S-03 · Tiêu hóa ở người; enzyme amylase trong nước bọt phân giải tinh bột (SGK KHTN 8 – Kết nối tri thức, Bài 32) · 3D
   Trạm 1: mô hình ống tiêu hóa và tuyến tiêu hóa, chạm để xem chức năng từng cơ quan.
   Trạm 2: bốn ống hồ tinh bột: (1) + nước cất; (2) + nước bọt; (3) + nước bọt đã đun sôi; (4) + nước bọt + vài giọt HCl.
   Ủ ở 37 °C khoảng 15 phút rồi nhỏ dung dịch iodine: còn tinh bột thì có màu xanh tím. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON,fmt=C.fmt,H=G.hex;
const ORG=[
  {k:"mieng",ten:"Khoang miệng (lưỡi, răng)",p:[0,2.13,.3],f:"Răng nghiền nhỏ thức ăn; lưỡi đảo trộn, tạo viên thức ăn; enzyme amylase trong nước bọt biến đổi một phần tinh bột thành đường maltose."},
  {k:"tuyennb",ten:"Tuyến nước bọt",p:[-.24,2.24,-.02],f:"Tiết nước bọt (có enzyme amylase) vào khoang miệng; người có ba đôi tuyến nước bọt lớn: mang tai, dưới hàm, dưới lưỡi."},
  {k:"thucquan",ten:"Thực quản",p:[.02,1.45,-.15],f:"Ống cơ dẫn thức ăn từ hầu xuống dạ dày nhờ cử động co bóp (nhu động)."},
  {k:"daday",ten:"Dạ dày",p:[.46,.45,.12],f:"Túi cơ hình chữ J; co bóp nghiền, đảo trộn thức ăn; dịch vị có acid HCl và enzyme pepsin phân giải một phần protein."},
  {k:"gan",ten:"Gan",p:[-.45,.74,.24],f:"Tuyến lớn nhất cơ thể; tiết dịch mật giúp nhũ tương hóa lipid; dự trữ đường, khử chất độc."},
  {k:"tuimat",ten:"Túi mật",p:[-.18,.42,.24],f:"Chứa và cô đặc dịch mật do gan tiết ra, đổ mật xuống tá tràng."},
  {k:"tuy",ten:"Tụy",p:[.3,.3,-.13],f:"Tiết dịch tụy chứa enzyme tiêu hóa tinh bột, protein, lipid đổ vào tá tràng."},
  {k:"tatrang",ten:"Tá tràng",p:[-.22,.12,-.02],f:"Đoạn đầu ruột non, nhận dịch mật và dịch tụy."},
  {k:"ruotnon",ten:"Ruột non",p:[.02,-.38,.2],f:"Dài khoảng 5–6 m; nơi tiêu hóa hoàn toàn thức ăn nhờ dịch tụy, dịch mật, dịch ruột và hấp thụ chất dinh dưỡng qua lông ruột."},
  {k:"ruotgia",ten:"Ruột già",p:[-.52,-.3,.15],f:"Hấp thụ lại nước, muối khoáng; vi khuẩn có lợi phân giải chất bã; tạo phân."},
  {k:"ruotthua",ten:"Ruột thừa",p:[-.39,-.95,.1],f:"Đoạn ruột nhỏ hình ngón tay ở manh tràng; viêm ruột thừa cần được cấp cứu kịp thời."},
  {k:"tructrang",ten:"Trực tràng, hậu môn",p:[0,-1.15,0],f:"Chứa phân và thải phân ra ngoài qua hậu môn."}];
const SPEC={
  predict:[{id:"p1",q:"Ống hồ tinh bột trộn nước bọt, ủ ở 37 °C rồi nhỏ iodine. Dung dịch có màu:",opts:[["vang","Không có màu xanh tím (màu vàng nâu của iodine)"],["xanh","Xanh tím đậm"],["do","Đỏ"]],ans:"vang",res:"Kết quả: ống có nước bọt không còn màu xanh tím vì tinh bột đã bị amylase biến đổi."},
    {id:"p2",q:"Nước bọt đã đun sôi còn biến đổi được tinh bột không?",opts:[["khong","Không"],["co","Có, mạnh hơn"],["nhu","Có, như cũ"]],ans:"khong",res:"Kết quả: đun sôi làm enzyme amylase mất hoạt tính, ống 3 vẫn xanh tím."}],
  taskLead:"Trạm Ống tiêu hóa: chạm vào từng cơ quan. Trạm Enzyme: cho hóa chất vào đúng ống, ủ ở 37 °C, rồi nhỏ iodine vào cả bốn ống.",
  tasks:[{html:"<b>Hệ tiêu hóa:</b> chạm xem chức năng ít nhất 6 cơ quan.",done:()=>Object.keys(SEEN).length>=6},
    {html:"<b>Chuẩn bị:</b> nước cất → ống 1; nước bọt → ống 2; nước bọt đun sôi → ống 3; nước bọt + HCl → ống 4.",done:()=>["e1","e2","e3","e4"].every(i=>L.V[i].data.add)},
    {html:"<b>Ủ:</b> đặt bốn ống vào cốc nước 37 °C khoảng 15 phút.",done:()=>!!L.S.tag.inc},
    {html:"<b>Thử tinh bột:</b> nhỏ dung dịch iodine vào cả bốn ống.",done:()=>["e1","e2","e3","e4"].every(i=>L.S.done.has("iod@"+i))}],
  obs:[{id:"a",q:"Vì sao ống 2 không có màu xanh tím khi nhỏ iodine?",opts:[["enz","Enzyme amylase trong nước bọt đã biến đổi tinh bột thành đường"],["nuoc","Vì có nhiều nước"],["iod","Vì iodine bị hỏng"]],ans:"enz",why:"Iodine chỉ cho màu xanh tím với tinh bột; ống 2 hết tinh bột vì amylase đã phân giải."},
    {id:"b",q:"Ống 1 (nước cất) dùng để làm gì?",opts:[["dc","Ống đối chứng: chứng minh tinh bột không tự biến đổi"],["them","Để có thêm tinh bột"],["dep","Không có tác dụng"]],ans:"dc",why:"So sánh ống 2 với ống 1 (chỉ khác có hay không có nước bọt) mới kết luận được nước bọt biến đổi tinh bột."},
    {id:"c",q:"Ống 4 (có HCl) vẫn xanh tím. Điều đó cho thấy:",opts:[["ph","Amylase hoạt động kém trong môi trường acid"],["hcl","HCl tạo ra tinh bột"],["lanh","Ống 4 bị lạnh"]],ans:"ph",why:"Amylase nước bọt hoạt động tốt ở môi trường trung tính, khoảng 37 °C; trong môi trường acid (như dạ dày) gần như ngừng hoạt động."}],
  concl:{html:`<div class="eq">Tinh bột —(amylase, 37 °C)→ đường maltose</div><ul class="tlist">
    <li>Ống tiêu hóa gồm: miệng, hầu, thực quản, dạ dày, ruột non, ruột già, hậu môn; tuyến tiêu hóa: tuyến nước bọt, tuyến vị, gan, tụy, tuyến ruột.</li>
    <li>Ở khoang miệng, enzyme amylase trong nước bọt biến đổi một phần tinh bột thành đường maltose.</li>
    <li>Enzyme hoạt động tốt ở nhiệt độ cơ thể (khoảng 37 °C) và môi trường thích hợp; nhiệt độ cao làm enzyme mất hoạt tính.</li>
    <li>Ruột non là nơi tiêu hóa hoàn toàn và hấp thụ chất dinh dưỡng.</li></ul>`,
    quiz:[{id:"q1",q:"Vì sao nhai kĩ cơm lâu thấy ngọt?",opts:[["a","Amylase trong nước bọt biến đổi tinh bột thành đường"],["b","Cơm có sẵn đường"],["c","Lưỡi tạo ra đường"]],ans:"a",why:{b:"Cơm chủ yếu là tinh bột.",c:"Lưỡi chỉ cảm nhận vị."}},
      {id:"q2",q:"Cơ quan nào hấp thụ phần lớn chất dinh dưỡng?",opts:[["a","Ruột non"],["b","Dạ dày"],["c","Ruột già"]],ans:"a",why:{b:"Dạ dày chủ yếu biến đổi thức ăn.",c:"Ruột già chủ yếu hấp thụ lại nước."}}],
    done:`<h2>Hoàn thành: Tiêu hóa ở người</h2><p class="muted">Amylase nước bọt biến đổi tinh bột ở khoảng 37 °C; đun sôi hoặc môi trường acid làm enzyme mất hoạt tính.</p>`},
  gv:["Chia nhóm, mỗi nhóm một ống; dự đoán màu trước khi nhỏ iodine.","Hỏi: mỗi ống khác ống 2 ở điều kiện nào?","Liên hệ: vì sao nên nhai kĩ, ăn chậm.","Làm thật: dùng nước bọt pha loãng của chính học sinh, không dùng chung."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 32)</p><ul class="tlist"><li>Nêu được chức năng của các cơ quan tiêu hóa; tiến hành được thí nghiệm về enzyme amylase trong nước bọt.</li></ul>`;
const SRC=`<ul class="tlist"><li>Iodine cho màu xanh tím với tinh bột; amylase nước bọt phân giải tinh bột, mất hoạt tính khi đun sôi: <a href="https://edu.rsc.org/experiments/the-effect-of-temperature-on-enzyme-activity/" target="_blank" rel="noopener">RSC Education – Enzyme activity</a>; <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/23-3-the-mouth-pharynx-and-esophagus" target="_blank" rel="noopener">OpenStax Anatomy and Physiology 2e, mục 23.3</a>.</li>
<li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 32 Dinh dưỡng và tiêu hóa ở người.</li>
<li>Thời gian ủ 15 phút được tua nhanh; mô hình ống tiêu hóa vẽ giản lược.</li></ul>`;
let L;const SEEN={};
LabKHTN.register("K8-S-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const tube=(id,x,name,short)=>({id,kind:"tube",x,z:0,name,short,sol:{col:"#F2F0EA",a:.55,level:.32}});
    const ADD={nc:{t:"e1",ten:"nước cất",lv:.08},nb:{t:"e2",ten:"nước bọt",lv:.08},nbs:{t:"e3",ten:"nước bọt đã đun sôi",lv:.08},hcl:{t:"e4",ten:"nước bọt + vài giọt HCl",lv:.09}};
    const def={aria:"Mô hình 3D ống tiêu hóa và thí nghiệm enzyme amylase phân giải tinh bột",bench:[5,3],seed:3233,
      stations:{he:{label:"Ống tiêu hóa",icon:IC.eye,view:{t:[-9,.55,0],yaw:.12,pitch:.05,rad:1.85},vessels:[]},
        enz:{label:"Enzyme",icon:IC.tube,view:{t:[.35,.6,0],yaw:0,pitch:.25,rad:1.1},racks:[[0,0,4]],
          vessels:[tube("e1",-.48,"ống 1 (hồ tinh bột)","Ống 1"),tube("e2",-.16,"ống 2 (hồ tinh bột)","Ống 2"),tube("e3",.16,"ống 3 (hồ tinh bột)","Ống 3"),tube("e4",.48,"ống 4 (hồ tinh bột)","Ống 4")]}},
      reagents:[{k:"nc",label:"Nước cất",type:"drop",c:"#EEF4FB",n:6,at:["enz"],chip:"#EAF3FC"},{k:"nb",label:"Nước bọt",type:"drop",c:"#F2F2EC",n:6,at:["enz"],chip:"#F4F4EE"},
        {k:"nbs",label:"Nước bọt đun sôi",type:"drop",c:"#F2F2EC",n:6,at:["enz"],chip:"#E9E1CF"},{k:"hcl",label:"Nước bọt + HCl",type:"drop",c:"#F2F2EC",n:6,at:["enz"],chip:"#F5D7D7"},
        {k:"inc",label:"Ủ 37 °C, 15 phút",type:"none",at:["enz"],icon:IC.thermo},{k:"iod",label:"Dung dịch iodine",type:"drop",c:"#B46A1E",n:3,at:["enz"],chip:"#B46A1E"}],
      react(k,T,ctx){const d=T.data;
        if(ADD[k]){if(ADD[k].t!==T.id)return{cancel:true,toast:`Theo bài, ${ADD[k].ten} cho vào ${["","ống 1","ống 2","ống 3","ống 4"][+ADD[k].t.slice(1)]}.`};if(d.add)return{cancel:true,toast:"Ống này đã có chất thêm vào."};
          d.add=k;return{fx(B,T){T.setLevel(T.level+ADD[k].lv,.8)},tn:`Thêm ${ADD[k].ten} vào ${T.name}`,ht:"dung dịch trắng đục của hồ tinh bột",kl:""}}
        if(k==="inc"){const all=["e1","e2","e3","e4"].map(i=>ctx.V[i]);if(!all.every(t=>t.data.add))return{cancel:true,toast:"Chuẩn bị đủ bốn ống trước khi ủ."};if(ctx.S.tag.inc)return{cancel:true,toast:"Đã ủ xong."};
          incT=0;return{cancel:true}}
        if(k==="iod"){if(!ctx.S.tag.inc)return{cancel:true,toast:"Ủ bốn ống ở 37 °C trước, rồi mới nhỏ iodine."};const dig=d.add==="nb";d.iod=true;
          return{fx(B,T){T.setColor(dig?"#D9A55A":"#2E2A6E",dig?.55:.9,1.4)},tn:`Nhỏ iodine vào ${T.name} (${ADD[d.add].ten})`,ht:dig?"dung dịch có màu vàng nâu của iodine, không có màu xanh tím":"dung dịch chuyển màu xanh tím",
            kl:dig?"Không còn tinh bột: amylase đã biến đổi tinh bột":d.add==="nc"?"Còn tinh bột (ống đối chứng)":d.add==="nbs"?"Còn tinh bột: đun sôi làm amylase mất hoạt tính":"Còn tinh bột: amylase không hoạt động trong môi trường acid"}}
        return null},
      info(v,S,V){if(v==="he"){const o=ORG.find(x=>x.k===sel);return o?`<div><b>${o.ten}</b></div><small>${o.f}</small>`:`<div><b>Hệ tiêu hóa</b></div><small>Chạm vào một cơ quan để xem chức năng.</small>`}
        return `<div><b>Enzyme amylase</b></div>${["e1","e2","e3","e4"].map((i,n)=>`<div>Ống ${n+1}: ${V[i].data.add?ADD[V[i].data.add].ten:"chỉ có hồ tinh bột"}</div>`).join("")}<div>Cốc ủ: ${incT!=null?`${fmt(Math.min(15,incT*1.25),1)} / 15 phút ở 37 °C`:S.tag.inc?"đã ủ 15 phút":"chưa ủ"}</div>`}};
    let incT=null,sel=null;
    L=BL.chemLab(api,def,SPEC);if(!L.BN)return L.mount;
    const K=L.K,R=K.R,root=K.root;
    /* cốc nước ủ 37 °C */
    const bath=L.BN.vessel({id:"bath",kind:"beaker",x:0,z:0,r:.82,h:.45,sol:{col:"#BFDDF7",a:.22,level:.3}});bath.n.visible=false;
    K.onFrame(dt=>{if(incT!=null){incT+=dt;bath.n.visible=true;bath.liq.visible=true;
      if(incT>=12){incT=null;L.S.tag.inc=true;L.rec("Ủ bốn ống trong cốc nước 37 °C, 15 phút (tua nhanh)","không thấy thay đổi rõ bằng mắt thường","Nhỏ iodine để kiểm tra tinh bột");api.toast("Đã ủ xong 15 phút ở 37 °C.","ok",2000);L.refresh()}}
      else{bath.n.visible=false}bath.liq.visible=bath.n.visible});
    /* mô hình ống tiêu hóa (giản lược) */
    const he=root.add(new G.Node());he.pos=[-9,0,0];const tis=(o)=>Object.assign({color:"#FFFFFF",rough:.42,wrap:.45,sheen:.35,coat:.25,hooks:KIT.TISSUE,uniforms:{uBump:.06,uNF:22}},o||{});
    const ORGM={};let ready=false;
    const loadEl=document.createElement("div");loadEl.className="gl-loading glass";loadEl.innerHTML=`<i aria-hidden="true"></i>Đang dựng mô hình hệ tiêu hóa…`;K.over.appendChild(loadEl);
    window.LabOrgans.build("buildBody",44).then(g=>{if(K.dead)return;he.add(R.mesh(g,{color:"#F2C6A8",alpha:.13,rough:.6,order:-2,transparent:true}))});
    window.LabOrgans.build("buildDigestive").then(P=>{if(K.dead)return;
      const M={stomach:{uNF:26},liver:{uNF:14,rough:.32,coat:.45},gall:{rough:.3,coat:.5},pancreas:{uNF:40,rough:.6},si:{uNF:30},duo:{},li:{uNF:18},app:{},eso:{},tongue:{uNF:40},glands:{uNF:50,rough:.6},rectum:{}};
      for(const k in P){const o=M[k]||{};ORGM[k]=he.add(R.mesh(P[k],tis(Object.assign({},o,{uniforms:{uBump:.06,uNF:o.uNF||22}}))))}
      ready=true;loadEl.classList.add("out");setTimeout(()=>loadEl.remove(),400)});
    /* chạm vào cơ quan: các cơ quan khác mờ đi */
    const PART={mieng:["tongue"],tuyennb:["glands"],thucquan:["eso"],daday:["stomach"],gan:["liver"],tuimat:["gall"],tuy:["pancreas"],tatrang:["duo"],ruotnon:["si"],ruotgia:["li"],ruotthua:["app"],tructrang:["rectum"]};
    K.onFrame(()=>{if(!ready)return;const on=sel?PART[sel]:null;for(const k in ORGM){const m=ORGM[k];const hi=!on||on.includes(k);m.mat.alpha=hi?1:.22;m.mat.transparent=!hi;m.mat.order=hi?0:1}});
    const orgL=ORG.map(o=>{const it=K.label(o.ten,[o.p[0]-9,o.p[1],o.p[2]],{view:"he",dir:o.p[0]>=0?"e":"w",len:o.k==="tuy"||o.k==="tatrang"?90:60});return it});
    const pick0=K._pick;K.pickFn((x,y,m)=>{if(K.view!=="he")return pick0(x,y,m);const r=R.ray(x,y);let best=null,bd=1e9;
      for(const o of ORG){const c=[o.p[0]-9,o.p[1],o.p[2]];const t=G.hit.sphere(r,c,o.k==="ruotnon"?.38:o.k==="gan"?.3:.16);if(t!=null&&t<bd){bd=t;best=o}}return best?{org:best}:null});
    const tap0=K._tap;K.tapFn((k,p)=>{if(k&&k.org){sel=k.org.k;SEEN[sel]=1;orgL.forEach((it,i)=>it.el.classList.toggle("follow",ORG[i].k===sel));L.refresh();return}tap0(k,p)});
    const dock0=K._dock;K.dockFn(()=>K.view==="he"?[{grid:ORG.map(o=>({k:"org",v:o.k,label:o.ten,icon:IC.eye,on:sel===o.k}))}]:dock0());
    const dh0=K._dockH;K.onDock((k,v,t)=>{if(k==="org"){sel=v;SEEN[v]=1;orgL.forEach((it,i)=>it.el.classList.toggle("follow",ORG[i].k===sel));L.refresh();return}dh0(k,v,t)});
    /* nút ủ: dùng hành động chung của khay */
    K.start();
    api.vp.__lab={get S(){return L.S},K,st:L.st,goView:v=>K.goView(v),apply:(k,id)=>L.apply(k,L.V[id]),
      auto(){ORG.forEach(o=>SEEN[o.k]=1);const q=[["nc","e1"],["nb","e2"],["nbs","e3"],["hcl","e4"],["inc","e1"],["iod","e1"],["iod","e2"],["iod","e3"],["iod","e4"]];let i=0;
        const go=()=>{if(i>=q.length)return;if(L.BN.busy()||incT!=null)return setTimeout(go,300);L.apply(q[i][0],L.V[q[i][1]]);i++;setTimeout(go,300)};go()}};
    return K.mount(L.st)}
});
})();
