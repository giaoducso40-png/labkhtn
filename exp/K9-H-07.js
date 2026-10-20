/* K9-H-07 · Glucose, saccharose; tinh bột, cellulose: nhận biết bằng thí nghiệm (SGK KHTN 9 – Kết nối tri thức, Bài 29–30) · 3D
   1. Phản ứng tráng bạc: dung dịch glucose và dung dịch saccharose + dung dịch AgNO₃ trong NH₃, ngâm trong cốc nước nóng;
      chỉ ống glucose có lớp bạc sáng như gương bám trên thành ống.
   2. Iodine với tinh bột: hồ tinh bột chuyển xanh tím; đun nóng mất màu, để nguội màu xanh tím xuất hiện trở lại;
      bông (cellulose) và glucose không cho màu xanh tím. */
(function(){
"use strict";
const C=window.LabCore,KIT=window.LabKit,BL=window.LabBench,K3=window.LabChem3D,G=window.LabGL,IC=KIT.ICON,H=G.hex;
const VIOLET="#3A1E78",IOD="#C98A2B";
const SPEC={
  predict:[{id:"p1",q:"Nhỏ dung dịch iodine vào hồ tinh bột, hồ tinh bột chuyển màu:",opts:[["tim","Xanh tím"],["do","Đỏ"],["khong","Không đổi màu"]],ans:"tim",res:"Kết quả: hồ tinh bột chuyển xanh tím; đây là phản ứng dùng để nhận biết tinh bột."},
    {id:"p2",q:"Chất nào cho phản ứng tráng bạc (tạo lớp bạc sáng bóng)?",opts:[["glu","Glucose"],["sac","Saccharose"],["ca2","Cả hai"]],ans:"glu",res:"Kết quả: chỉ glucose có phản ứng tráng bạc."}],
  taskLead:"Chọn hóa chất ở khay rồi chạm vào ống nghiệm.",
  tasks:[{html:"<b>Tráng bạc:</b> nhỏ AgNO₃/NH₃ vào cả hai ống rồi ngâm vào nước nóng.",done:()=>["ag@g1","ag@g2","bath@g1","bath@g2"].every(x=>L.S.done.has(x))},
    {html:"<b>Iodine:</b> nhỏ dung dịch iodine vào cả 3 ống.",done:()=>["iod@s1","iod@s2","iod@s3"].every(x=>L.S.done.has(x))},
    {html:"<b>Đun và để nguội:</b> đun ống hồ tinh bột đã có iodine, rồi để nguội.",done:()=>!!L.S.tag.cool}],
  obs:[{id:"a",q:"Thuốc thử dùng để nhận biết tinh bột là:",opts:[["iod","Dung dịch iodine"],["ag","AgNO₃ trong NH₃"],["quy","Quỳ tím"]],ans:"iod",why:"Tinh bột cho màu xanh tím đặc trưng với iodine."},
    {id:"b",q:"Phân biệt dung dịch glucose với dung dịch saccharose bằng:",opts:[["ag","Phản ứng tráng bạc"],["iod","Dung dịch iodine"],["nuoc","Hòa tan vào nước"]],ans:"ag",why:"Glucose cho lớp bạc; saccharose không phản ứng."}],
  concl:{html:`<div class="eq">C₆H₁₂O₆ + Ag₂O → C₆H₁₂O₇ + 2Ag↓ (NH₃, t°; viết gọn)</div><ul class="tlist">
    <li><b>Glucose</b> C₆H₁₂O₆ có nhiều trong quả chín (nho), mật ong; có phản ứng tráng bạc; lên men tạo ethanol.</li>
    <li><b>Saccharose</b> C₁₂H₂₂O₁₁ (đường mía, củ cải đường) không có phản ứng tráng bạc; bị thủy phân (xúc tác acid hoặc enzyme) tạo glucose và fructose.</li>
    <li><b>Tinh bột</b> và <b>cellulose</b> (C₆H₁₀O₅)ₙ là polymer thiên nhiên; tinh bột tạo màu xanh tím với iodine, cellulose thì không.</li></ul>`,
    quiz:[{id:"q1",q:"Nhỏ dung dịch iodine lên lát chuối xanh thấy màu xanh tím, chứng tỏ chuối xanh có:",opts:[["a","Tinh bột"],["b","Glucose"],["c","Saccharose"]],ans:"a",why:{b:"Glucose không cho màu xanh tím với iodine.",c:"Saccharose không cho màu xanh tím."}},
      {id:"q2",q:"Ứng dụng phản ứng tráng bạc của glucose trong thực tế là:",opts:[["a","Tráng ruột phích, tráng gương"],["b","Nấu xà phòng"],["c","Sản xuất phân bón"]],ans:"a",why:{b:"Không liên quan.",c:"Không liên quan."}}],
    done:`<h2>Hoàn thành: Glucose, saccharose, tinh bột, cellulose</h2><p class="muted">Tráng bạc nhận biết glucose; iodine nhận biết tinh bột.</p>`},
  gv:["Khi làm thật: ống nghiệm tráng bạc phải thật sạch (rửa bằng NaOH rồi nước cất) thì lớp bạc mới bóng đẹp; không đun trực tiếp trên ngọn lửa.","Hỏi: vì sao nhai cơm lâu thấy có vị ngọt? (enzyme amylase thủy phân tinh bột, nối với KHTN 8).","Thí nghiệm mở rộng: nhỏ iodine lên lát khoai, bánh mì, giấy viết."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 29–30)</p><ul class="tlist"><li>Nêu được công thức, tính chất, trạng thái tự nhiên, ứng dụng của glucose, saccharose, tinh bột, cellulose.</li><li>Tiến hành được thí nghiệm (hoặc quan sát) phản ứng tráng bạc của glucose, phản ứng màu của tinh bột với iodine.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 29 Carbohydrate. Glucose và saccharose; Bài 30 Tinh bột và cellulose.</li>
<li>Phản ứng tráng bạc (thuốc thử Tollens), phản ứng màu tinh bột – iodine: <a href="https://chem.libretexts.org/Bookshelves/Organic_Chemistry/Organic_Chemistry_(OpenStax)/25%3A_Biomolecules-_Carbohydrates" target="_blank" rel="noopener">OpenStax Organic Chemistry, chương 25</a>.</li><li>Thời gian xuất hiện lớp bạc, độ đậm màu là minh họa định tính.</li></ul>`;

let L;
LabKHTN.register("K9-H-07",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const tube=(id,x,name,short,col,a)=>({id,kind:"tube",x,z:0,name,short,sol:{col:col||"#F1F6FA",a:a||.34,level:.36}});
    const def={aria:"Bàn thí nghiệm 3D nhận biết glucose, saccharose, tinh bột, cellulose",bench:[8,3],seed:29,
      stations:{
        tb:{label:"Tráng bạc",icon:IC.tube,view:{t:[-1.9,.6,0],yaw:0,pitch:.25,rad:1.0},racks:[[-2.35,0,2]],
          vessels:[tube("g1",-2.51,"ống 1 (dung dịch glucose)","Ống 1: glucose"),tube("g2",-2.19,"ống 2 (dung dịch saccharose)","Ống 2: saccharose"),{id:"bk",kind:"beaker",x:-1.45,z:0,r:.3,h:.45,name:"cốc nước nóng (khoảng 70 °C)",short:"Cốc nước nóng",sol:{col:"#E3EEF8",a:.3,level:.3}}]},
        iod:{label:"Iodine",icon:IC.drop,view:{t:[1.75,.6,0],yaw:0,pitch:.25,rad:1.0},racks:[[1.75,0,3]],burners:[[2.55,0,"b"]],
          vessels:[tube("s1",1.43,"ống 1 (hồ tinh bột)","Ống 1: hồ tinh bột","#F2F1EA",.5),tube("s2",1.75,"ống 2 (bông trong nước)","Ống 2: bông"),tube("s3",2.07,"ống 3 (dung dịch glucose)","Ống 3: glucose")]}},
      reagents:[{k:"ag",label:"Dung dịch AgNO₃ trong NH₃",type:"drop",c:"#F4F6F8",n:5,at:["tb"],chip:"#F4F6F8",sym:"Ag⁺"},{k:"bath",label:"Ngâm ống vào cốc nước nóng",type:"none",at:["tb"],icon:IC.beaker},
        {k:"iod",label:"Dung dịch iodine",type:"drop",c:IOD,n:3,at:["iod"],chip:IOD,sym:"I₂"},{k:"hot",label:"Đun nóng ống 1",type:"none",at:["iod"],icon:IC.fire},{k:"cool",label:"Để nguội ống 1",type:"none",at:["iod"],icon:IC.thermo}],
      react(k,T,ctx){const D=T.data,id=T.id;
        if(k==="ag"){if(id==="bk")return{cancel:true,toast:"Nhỏ vào ống 1 hoặc ống 2."};D.ag=1;return{tn:`Nhỏ dung dịch AgNO₃ trong NH₃ vào ${T.name}`,ht:"dung dịch trong suốt, chưa có hiện tượng",kl:"Cần đun nóng nhẹ"}}
        if(k==="bath"){if(id==="bk")return{cancel:true,toast:"Chạm vào ống nghiệm cần ngâm."};if(!D.ag)return{cancel:true,toast:"Nhỏ AgNO₃/NH₃ vào ống trước."};if(D.bath)return{cancel:true,toast:"Ống đã được ngâm."};D.bath=1;
          const glu=id==="g1";return{fx(B){dip(B,T,glu)},tn:`Ngâm ${T.name} vào cốc nước nóng vài phút`,ht:glu?"thành ống nghiệm phủ một lớp bạc sáng bóng như gương":"không có hiện tượng",kl:glu?"Glucose có phản ứng tráng bạc":"Saccharose không có phản ứng tráng bạc"}}
        if(k==="iod"){if(D.iod)return{cancel:true,toast:"Ống đã có iodine."};D.iod=1;const s=id==="s1";return{fx(B,T){T.setColor(s?VIOLET:"#E3C27A",s?.82:.42,1.5)},tn:`Nhỏ dung dịch iodine vào ${T.name}`,ht:s?"dung dịch chuyển màu xanh tím":"chỉ có màu vàng nâu nhạt của iodine",kl:s?"Tinh bột tạo màu xanh tím với iodine":id==="s2"?"Cellulose không cho màu xanh tím với iodine":"Glucose không cho màu xanh tím với iodine"}}
        if(k==="hot"){if(id!=="s1")return{cancel:true,toast:"Đun ống 1 (hồ tinh bột)."};if(!D.iod)return{cancel:true,toast:"Nhỏ iodine vào trước."};if(D.hot)return{cancel:true,toast:"Đang nóng."};D.hot=1;return{fx(B,T){burnB.on=true;B.toBurner(T,burnB,true);T.setColor("#E8D9A8",.4,3);T.steamOn=true},tn:"Đun nóng ống hồ tinh bột đã có iodine",ht:"màu xanh tím nhạt dần rồi biến mất",kl:"Khi nóng, phức màu bị phá vỡ"}}
        if(k==="cool"){if(id!=="s1")return{cancel:true,toast:"Chọn ống 1."};if(!D.hot)return{cancel:true,toast:"Đun nóng trước."};if(D.cool)return{cancel:true,toast:"Đã để nguội."};D.cool=1;ctx.S.tag.cool=true;return{fx(B,T){burnB.on=false;B.toBurner(T,burnB,false);T.steamOn=false;T.setColor(VIOLET,.82,4)},tn:"Để nguội ống hồ tinh bột",ht:"màu xanh tím xuất hiện trở lại",kl:"Phản ứng màu của tinh bột với iodine thay đổi theo nhiệt độ"}}
        return null},
      info(v,S,V){if(v==="tb")return `<div><b>Phản ứng tráng bạc</b></div><small>Nhỏ AgNO₃/NH₃ vào từng ống rồi ngâm vào cốc nước nóng (không đun trực tiếp).</small>`;
        return `<div><b>Phản ứng với iodine</b></div><small>Nhỏ iodine vào 3 ống; sau đó đun nóng ống 1 rồi để nguội.</small>`}};
    let burnB;const coats={};
    L=BL.chemLab(api,def,SPEC);if(!L.BN)return L.mount;
    const K=L.K,R=K.R;burnB=L.V["@b"];
    /* lớp bạc bám thành ống: ống trụ kim loại mỏng trong lòng ống nghiệm */
    for(const id of ["g1","g2"]){const T=L.V[id];const m=T.n.add(R.mesh(G.cylinder(.103,.36,32,false),{color:"#DDE2E8",metal:.5,rough:.14,coat:.8,alpha:0,transparent:true,order:2,side:"double"}));m.pos=[0,.01,0];coats[id]={m,k:0,on:false,T}}
    function dip(B,T,glu){const c=coats[T.id];c.on=glu;c.dx=T.x;c.tt=0;const bk=L.V.bk;B.moveTube(T,[bk.x+(T.id==="g1"?-.1:.1),.05,bk.z],null,false)}
    K.onFrame(dt=>{for(const id in coats){const c=coats[id];const T=c.T;if(c.dx!=null){c.tt+=dt;/* ống được nhấc sang cốc nước nóng */}
        if(c.on&&dt>0){c.k=Math.min(1,c.k+dt/5);c.m.mat.alpha=c.k*.95}}});
    K.start();
    api.vp.__lab={get S(){return L.S},K,st:L.st,goView:v=>K.goView(v),apply:(k,id)=>L.apply(k,L.V[id]),
      auto(){const q=[["ag","g1"],["ag","g2"],["bath","g1"],["bath","g2"],["iod","s1"],["iod","s2"],["iod","s3"],["hot","s1"],["cool","s1"]];let i=0;const go=()=>{if(i>=q.length)return;if(L.BN.busy())return setTimeout(go,300);L.apply(q[i][0],L.V[q[i][1]]);i++;setTimeout(go,i===8?3000:300)};go()}};
    return K.mount(L.st)}
});
})();
