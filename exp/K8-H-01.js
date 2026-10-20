/* K8-H-01 · Biến đổi vật lí, biến đổi hóa học; dấu hiệu nhận biết phản ứng (SGK KHTN 8 – Kết nối tri thức, Bài 2) · 3D
   Trạm 1 (vật lí hay hóa học?): muối ăn tan trong nước; nước đá tan chảy; đun nóng đường (đường chảy, hóa nâu rồi thành than đen, có hơi nước).
   Trạm 2 (dấu hiệu phản ứng): kẽm + HCl (khí); CuSO₄ + NaOH (kết tủa xanh); NaOH + phenolphthalein (đổi màu); vôi sống + nước (tỏa nhiệt). */
(function(){
"use strict";
const C=window.LabCore,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON,fmt=C.fmt;
const SPEC={
  predict:[{id:"p1",q:"Đun nóng đường trong ống nghiệm, đường chuyển dần sang màu đen. Đây là:",opts:[["hh","Biến đổi hóa học"],["vl","Biến đổi vật lí"],["ca","Không phải biến đổi nào"]],ans:"hh",res:"Kết quả: đường bị phân hủy thành than và hơi nước, có chất mới sinh ra: biến đổi hóa học."},
    {id:"p2",q:"Hòa tan muối ăn vào nước, rồi đun cạn dung dịch thì thu được:",opts:[["muoi","Lại muối ăn như ban đầu"],["moi","Một chất mới"],["khong","Không còn gì"]],ans:"muoi",res:"Kết quả: muối chỉ tan, không biến thành chất khác: biến đổi vật lí."}],
  taskLead:"Chọn hóa chất hoặc dụng cụ ở khay rồi chạm vào ống nghiệm, cốc.",
  tasks:[{html:"<b>Vật lí hay hóa học:</b> hòa tan muối ăn, làm tan nước đá, đun nóng đường.",done:()=>L.S.tag.salt&&L.S.tag.ice&&L.S.tag.sugar},
    {html:"<b>Dấu hiệu phản ứng:</b> làm cả bốn thí nghiệm ở trạm 2.",done:()=>L.S.tag.gas&&L.S.tag.ppt&&L.S.tag.color&&L.S.tag.heat}],
  obs:[{id:"a",q:"Dấu hiệu nào chứng tỏ khi đun nóng, đường đã biến đổi hóa học?",opts:[["den","Đường hóa đen (than), có giọt nước đọng ở thành ống"],["chay","Đường chảy lỏng ra"],["nong","Ống nghiệm nóng lên"]],ans:"den",why:"Than và nước là các chất mới; còn đường chảy lỏng chỉ là đổi trạng thái."},
    {id:"b",q:"Cho dung dịch NaOH vào dung dịch CuSO₄ thấy xuất hiện chất rắn màu xanh lam. Dấu hiệu đó là:",opts:[["ket","Tạo chất kết tủa"],["khi","Tạo chất khí"],["nhiet","Tỏa nhiệt"]],ans:"ket",why:"Chất rắn không tan sinh ra trong dung dịch gọi là kết tủa: Cu(OH)₂ màu xanh lam."},
    {id:"c",q:"Nhiệt độ của nước tăng nhanh khi cho vôi sống vào. Điều này cho biết:",opts:[["toa","Phản ứng tỏa nhiệt"],["thu","Phản ứng thu nhiệt"],["khong","Không có phản ứng"]],ans:"toa",why:"CaO + H₂O → Ca(OH)₂ tỏa nhiều nhiệt làm nước nóng lên."}],
  concl:{html:`<div class="eq">Zn + 2HCl → ZnCl₂ + H₂↑<br>CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄<br>CaO + H₂O → Ca(OH)₂</div><ul class="tlist">
    <li><b>Biến đổi vật lí:</b> chất chỉ thay đổi trạng thái, hình dạng…, không tạo thành chất mới (muối tan, nước đá tan).</li>
    <li><b>Biến đổi hóa học:</b> có chất mới tạo thành (đường hóa than). Quá trình đó gọi là phản ứng hóa học.</li>
    <li><b>Dấu hiệu nhận biết phản ứng:</b> tạo chất khí, tạo kết tủa, thay đổi màu sắc, tỏa nhiệt hoặc phát sáng.</li></ul>`,
    quiz:[{id:"q1",q:"Hiện tượng nào là biến đổi hóa học?",opts:[["a","Sắt để lâu ngoài không khí bị gỉ"],["b","Cồn để trong lọ hở bị bay hơi"],["c","Thủy tinh nóng chảy được thổi thành bình"]],ans:"a",why:{b:"Cồn bay hơi chỉ đổi trạng thái.",c:"Thủy tinh chỉ đổi hình dạng."}},
      {id:"q2",q:"Đốt cháy cây nến, phần nào là biến đổi vật lí?",opts:[["a","Sáp nến nóng chảy"],["b","Sáp cháy tạo khí carbon dioxide và hơi nước"],["c","Cả hai đều là biến đổi hóa học"]],ans:"a",why:{b:"Sáp cháy tạo chất mới: biến đổi hóa học.",c:"Sáp nóng chảy là biến đổi vật lí."}}],
    done:`<h2>Hoàn thành: Biến đổi vật lí, biến đổi hóa học</h2><p class="muted">Có chất mới sinh ra là biến đổi hóa học; dấu hiệu: khí, kết tủa, đổi màu, tỏa nhiệt hoặc phát sáng.</p>`},
  gv:["Cho học sinh phân loại các hiện tượng quen thuộc trước khi làm.","Đun đường: chạy 0,25× để thấy đường chảy, hóa nâu, rồi đen.","Hỏi: dấu hiệu nào chắc chắn có chất mới?","Vôi sống tỏa nhiệt mạnh: không cầm cốc khi làm thật."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 2)</p><ul class="tlist"><li>Phân biệt được biến đổi vật lí, biến đổi hóa học; nêu được dấu hiệu nhận biết phản ứng hóa học.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 2 Phản ứng hóa học.</li>
<li>Kết tủa Cu(OH)₂ xanh lam khi cho NaOH vào CuSO₄; CaO + H₂O tỏa nhiệt; đường đun nóng phân hủy thành than (carbon) và nước: kiến thức hóa học phổ thông.</li>
<li>Nhiệt độ cốc vôi sống trong mô hình (tăng tới khoảng 70 °C) là minh họa; thực tế phụ thuộc lượng vôi và nước.</li></ul>`;

let L;
LabKHTN.register("K8-H-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const def={aria:"Bàn thí nghiệm 3D: biến đổi vật lí, biến đổi hóa học và dấu hiệu phản ứng",bench:[7.4,3],seed:1201,
      stations:{
        bd:{label:"Vật lí – hóa học",icon:IC.beaker,view:{t:[-1.9,.55,0],yaw:0,pitch:.28,rad:1.25},racks:[],burners:[[-1.25,0,"b"]],stands:[],
          vessels:[{id:"c1",kind:"beaker",x:-2.65,z:0,r:.26,h:.5,name:"cốc nước (muối)",short:"Cốc nước",sol:{level:.3}},
            {id:"c2",kind:"beaker",x:-1.95,z:0,r:.26,h:.5,name:"cốc thủy tinh (nước đá)",short:"Cốc rỗng",sol:{level:.03,a:.2}},
            {id:"t1",kind:"tube",x:-1.25,z:0,y:.5,name:"ống nghiệm (đường)",short:"Ống đường",sol:{level:.013,a:0},ly:1.7}]},
        dh:{label:"Dấu hiệu phản ứng",icon:IC.tube,view:{t:[1.75,.6,0],yaw:0,pitch:.25,rad:1.05},racks:[[1.75,0,4]],
          vessels:[{id:"d1",kind:"tube",x:1.27,z:0,name:"ống 1 (HCl)",short:"HCl"},{id:"d2",kind:"tube",x:1.59,z:0,name:"ống 2 (CuSO₄)",short:"CuSO₄",sol:{col:"#3E92E0",a:.62}},
            {id:"d3",kind:"tube",x:1.91,z:0,name:"ống 3 (NaOH)",short:"NaOH"},{id:"d4",kind:"tube",x:2.23,z:0,name:"ống 4 (nước)",short:"Nước"}]}},
      reagents:[{k:"salt",label:"Muối ăn",type:"solid",at:["bd"],chip:"#F5F5F2",solid:{kind:"crystal",col:"#F7F7F4",n:110,size:.012,rough:.3}},
        {k:"ice",label:"Nước đá",type:"solid",at:["bd"],chip:"#DCEFFC",solid:{kind:"cube",col:"#E6F5FF",metal:0,rough:.05,scale:1.6}},
        {k:"sugar",label:"Đường",type:"solid",at:["bd"],chip:"#FFFFFF",solid:{kind:"powder",col:"#FBFAF6",n:90,size:.012}},
        {k:"heat",label:"Đèn cồn",type:"heat",at:["bd"],icon:IC.fire},{k:"stir",label:"Khuấy",type:"none",at:["bd"],icon:IC.swap},
        {k:"Zn",label:"Kẽm viên",type:"solid",at:["dh"],chip:"#AEB7C2",sym:"Zn",solid:{kind:"granule",col:"#AEB7C2",scale:.8}},
        {k:"naoh",label:"Dung dịch NaOH",type:"drop",at:["dh"],c:"#EEF4FA",chip:"#EEF4FA",n:6},
        {k:"pp",label:"Phenolphthalein",type:"drop",at:["dh"],c:"#F4F4F4",chip:"#FFFFFF",n:3},
        {k:"cao",label:"Vôi sống CaO",type:"solid",at:["dh"],chip:"#ECEAE3",solid:{kind:"powder",col:"#EDEBE4",n:70,size:.012}}],
      react(k,T,ctx){const d=T.data;
        if(k==="salt"){if(T.id!=="c1")return{cancel:true,toast:"Cho muối vào cốc nước."};d.salt=true;return{fx(B,T){},tn:"Cho muối ăn vào cốc nước",ht:"muối nằm ở đáy cốc; khuấy thì muối tan dần",kl:"Chưa kết luận: khuấy để quan sát"}}
        if(k==="stir"){if(T.id==="c1"&&d.salt&&!d.stirred){d.stirred=true;return{fx(B,T){const s=T.data.solid;if(s)s.rate=.12},tag:"salt",tn:"Khuấy cốc nước muối",ht:"muối tan hết, dung dịch trong suốt; nếm thấy vị mặn (không nếm khi làm thật)",kl:"Biến đổi vật lí: muối chỉ tan, không tạo chất mới"}}
          return{cancel:true,toast:"Khuấy cốc nước có muối."}}
        if(k==="ice"){if(T.id!=="c2")return{cancel:true,toast:"Cho nước đá vào cốc rỗng."};
          return{fx(B,T){const s=T.data.solid;s.rate=.03;T.setLevel(.12,30)},tag:"ice",tn:"Để nước đá trong cốc ở nhiệt độ phòng",ht:"nước đá tan dần thành nước lỏng",kl:"Biến đổi vật lí: chỉ chuyển từ thể rắn sang thể lỏng"}}
        if(k==="sugar"){if(T.id!=="t1")return{cancel:true,toast:"Cho đường vào ống nghiệm."};d.sugar=true;return{fx(){},tn:"Cho đường vào ống nghiệm khô",ht:"đường dạng hạt màu trắng",kl:"Đun nóng để quan sát"}}
        if(k==="heat"){if(T.id!=="t1")return{cancel:true,toast:"Đun ống nghiệm có đường."};if(!d.sugar)return{cancel:true,toast:"Cho đường vào ống trước."};if(d.heatT==null)d.heatT=0;T.burner="b";return{fx(){}}}
        if(k==="Zn"){if(T.id!=="d1")return{cancel:true,toast:"Cho kẽm vào ống HCl."};return{fx(B,T){T.fizz(24);if(T.data.solid)T.data.solid.rate=.006},tag:"gas",tn:"Cho kẽm vào dung dịch HCl",ht:"sủi bọt khí, kẽm tan dần",kl:"Dấu hiệu: tạo chất khí (H₂)"}}
        if(k==="naoh"){if(T.id==="d2")return{fx(B,T){T.precip("#3A86D8",.8,3);T.setColor("#9CC6EE",.5,4)},tag:"ppt",tn:"Nhỏ dung dịch NaOH vào dung dịch CuSO₄",ht:"xuất hiện kết tủa màu xanh lam, lắng dần xuống đáy",kl:"Dấu hiệu: tạo chất kết tủa Cu(OH)₂"};
          if(T.id==="d3")return{cancel:true,toast:"Ống 3 đã là dung dịch NaOH. Nhỏ phenolphthalein vào ống này."};return null}
        if(k==="pp"){if(T.id==="d3")return{fx(B,T){T.setColor("#E0338A",.75,1.5)},tag:"color",tn:"Nhỏ phenolphthalein vào dung dịch NaOH",ht:"dung dịch từ không màu chuyển sang màu hồng",kl:"Dấu hiệu: thay đổi màu sắc"};return{fx(){},tn:`Nhỏ phenolphthalein vào ${T.name}`,ht:"không đổi màu",kl:"Không có base"}}
        if(k==="cao"){if(T.id!=="d4")return{cancel:true,toast:"Cho vôi sống vào ống nước."};return{fx(B,T){T.tempTgt=72;T.tempK=.12;T.steamOn=true;T.cloud("#F2F2EE",.6);if(T.data.solid)T.data.solid.rate=.02},tag:"heat",tn:"Cho vôi sống vào nước",ht:"vôi sống tan ra, nước nóng lên nhanh, bốc hơi; dung dịch vẩn đục màu trắng",kl:"Dấu hiệu: tỏa nhiệt"}}
        return null},
      info(v,S,V){if(v==="bd"){const t=V.t1;return `<div><b>Vật lí hay hóa học?</b></div><div>Ống đường: ${t.data.char?"than đen, có hơi nước":t.data.melt?"đường chảy, hóa nâu":t.data.sugar?"đường trắng":"chưa có đường"}</div><small>Muối: cho vào cốc nước rồi khuấy. Nước đá: cho vào cốc rỗng. Đường: cho vào ống rồi đun bằng đèn cồn.</small>`}
        return `<div><b>Dấu hiệu phản ứng</b></div><div>Ống 4: ${fmt(V.d4.temp,0)} °C</div><small>Kẽm → ống 1; NaOH → ống 2; phenolphthalein → ống 3; vôi sống → ống 4.</small>`}};
    L=BL.chemLab(api,def,SPEC);if(!L.BN)return L.mount;L.BN.clamp(-1.25,0,.95);
    /* đun đường: chảy (vàng nâu) → caramel → than đen, hơi nước đọng ở miệng ống */
    L.K.onFrame(dt=>{const T=L.V.t1,d=T.data;if(d.heatT==null||!T.heat)return;d.heatT+=dt;const s=d.solid;if(!s)return;
      if(d.heatT>3&&!d.melt){d.melt=true;s.colTo=[.55,.32,.08];s.tint=0;L.refresh()}
      if(d.melt&&s.tint<1){s.tint=Math.min(1,s.tint+dt/6)}
      if(d.heatT>9&&!d.char){d.char=true;s.col0=[.55,.32,.08];s.colTo=[.03,.025,.02];s.tint=0;T.smoke=.6;T.steamOn=true;
        L.rec("Đun nóng đường trong ống nghiệm","đường chảy lỏng, chuyển màu nâu rồi đen; có khói và hơi nước đọng ở thành ống","Biến đổi hóa học: đường phân hủy thành than (carbon) và nước");L.S.tag.sugar=true;L.refresh()}
      if(d.char&&s.tint<1)s.tint=Math.min(1,s.tint+dt/5)});
    L.K.start();
    api.vp.__lab={get S(){return L.S},K:L.K,st:L.st,goView:v=>L.K.goView(v),apply:(k,id)=>L.apply(k,L.V[id]),
      auto(){const q=[["salt","c1"],["stir","c1"],["ice","c2"],["sugar","t1"],["heat","t1"],["Zn","d1"],["naoh","d2"],["pp","d3"],["cao","d4"]];let i=0;const go=()=>{if(i>=q.length)return;if(L.BN.busy())return setTimeout(go,300);L.apply(q[i][0],L.V[q[i][1]]);i++;setTimeout(go,300)};go()}};
    return L.K.mount(L.st)}
});
})();
