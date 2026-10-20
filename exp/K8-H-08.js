/* K8-H-08 · Oxide; Muối (SGK KHTN 8 – Kết nối tri thức, Bài 10–11) · 3D
   Trạm 1 (oxide): CaO + nước (tỏa nhiệt, dung dịch làm phenolphthalein hóa hồng); CuO + dung dịch HCl (dung dịch màu xanh);
                   sục khí CO₂ vào nước vôi trong (vẩn đục CaCO₃).
   Trạm 2 (muối): Fe + CuSO₄ (đồng đỏ bám đinh); BaCl₂ + H₂SO₄ (BaSO₄↓ trắng); CuSO₄ + NaOH (Cu(OH)₂↓ xanh); BaCl₂ + Na₂SO₄ (BaSO₄↓ trắng). */
(function(){
"use strict";
const C=window.LabCore,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON;
const BLUE="#2F7FD8",PINK="#E5488F",PURPLE="#7A4A9A";

const SPEC={
  predict:[{id:"p1",q:"Cho vôi sống (CaO) vào nước rồi nhỏ phenolphthalein, dung dịch sẽ:",opts:[["hong","Chuyển màu hồng"],["khong","Không màu"],["xanh","Chuyển xanh lam"]],ans:"hong",res:"Kết quả: CaO tác dụng với nước tạo Ca(OH)₂ là base, dung dịch làm phenolphthalein chuyển hồng."},
    {id:"p2",q:"Ngâm đinh sắt sạch trong dung dịch copper(II) sulfate (CuSO₄) màu xanh, sau một lúc:",opts:[["do","Có lớp kim loại màu đỏ bám trên đinh, màu xanh nhạt dần"],["khong","Không có hiện tượng"],["khi","Sủi bọt khí mạnh"]],ans:"do",res:"Kết quả: sắt đẩy đồng ra khỏi dung dịch muối; đồng màu đỏ bám trên đinh."}],
  taskLead:"Chọn hóa chất ở khay rồi chạm vào ống nghiệm cần thêm.",
  tasks:[
    {html:"<b>Oxide base + nước:</b> cho CaO vào ống nước, rồi nhỏ phenolphthalein.",done:()=>L.S.done.has("CaO@o1")&&L.S.done.has("pp@o1")},
    {html:"<b>Oxide base + acid:</b> cho CuO vào ống HCl.",done:()=>L.S.done.has("CuO@o2")},
    {html:"<b>Oxide acid + base:</b> sục khí CO₂ vào nước vôi trong.",done:()=>L.S.done.has("co2@o3")},
    {html:"<b>Muối:</b> làm đủ 4 thí nghiệm của muối (với kim loại, acid, base, muối).",done:()=>["Fe@m1","h2so4@m2","naoh@m3","na2so4@m4"].every(x=>L.S.done.has(x))}],
  obs:[{id:"a",q:"CaO, CuO tác dụng với acid tạo muối và nước. Đó là:",opts:[["base","Oxide base"],["acid","Oxide acid"],["trung","Oxide trung tính"]],ans:"base",why:"Oxide base tác dụng với dung dịch acid tạo thành muối và nước; một số oxide base (CaO, Na₂O…) tác dụng với nước tạo base."},
    {id:"b",q:"CO₂ làm nước vôi trong vẩn đục. CO₂ là:",opts:[["acid","Oxide acid"],["base","Oxide base"],["muoi","Muối"]],ans:"acid",why:"Oxide acid tác dụng với dung dịch base tạo thành muối và nước: CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O."},
    {id:"c",q:"Ống BaCl₂ + H₂SO₄ và ống BaCl₂ + Na₂SO₄ đều có kết tủa trắng. Kết tủa đó là:",opts:[["baso4","BaSO₄"],["bacl2","BaCl₂"],["nacl","NaCl"]],ans:"baso4",why:"Ion Ba²⁺ kết hợp với ion sulfate tạo BaSO₄ không tan; NaCl, HCl tan trong nước."},
    {id:"d",q:"Phản ứng của muối với acid, base, muối khác chỉ xảy ra khi:",opts:[["ket","Sản phẩm có chất kết tủa (hoặc chất khí)"],["mau","Dung dịch có màu"],["nong","Ống nghiệm nóng lên"]],ans:"ket",why:"Đó là điều kiện để phản ứng trao đổi trong dung dịch xảy ra."}],
  concl:{html:`<div class="eq">CaO + H₂O → Ca(OH)₂<br>CuO + 2HCl → CuCl₂ + H₂O<br>CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O<br>Fe + CuSO₄ → FeSO₄ + Cu<br>BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl<br>CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄<br>BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl</div><ul class="tlist">
    <li><b>Oxide</b> là hợp chất của hai nguyên tố, trong đó có một nguyên tố là oxygen. Oxide base tác dụng với acid tạo muối và nước; oxide acid tác dụng với base tạo muối và nước. Ngoài ra còn oxide lưỡng tính (Al₂O₃, ZnO) và oxide trung tính (CO, NO).</li>
    <li><b>Muối</b> là hợp chất được tạo thành từ sự thay thế ion H⁺ của acid bằng ion kim loại hoặc ion ammonium (NH₄⁺).</li>
    <li>Muối tác dụng với kim loại (kim loại hoạt động mạnh hơn đẩy kim loại yếu hơn), với acid, với base và với muối khác; phản ứng trao đổi xảy ra khi tạo chất kết tủa hoặc chất khí.</li></ul>`,
    quiz:[{id:"q1",q:"Chất nào là oxide acid?",opts:[["so2","SO₂"],["cao","CaO"],["na2o","Na₂O"]],ans:"so2",why:{cao:"CaO là oxide base.",na2o:"Na₂O là oxide base."}},
      {id:"q2",q:"Tên gọi của Na₂SO₄ là:",opts:[["a","Sodium sulfate"],["b","Sodium sulfite"],["c","Sodium sulfide"]],ans:"a",why:{b:"Sulfite là gốc SO₃.",c:"Sulfide là gốc S."}},
      {id:"q3",q:"Cặp chất nào khi trộn dung dịch không xảy ra phản ứng?",opts:[["a","NaCl và KNO₃"],["b","BaCl₂ và Na₂SO₄"],["c","CuSO₄ và NaOH"]],ans:"a",why:{b:"Tạo BaSO₄ kết tủa.",c:"Tạo Cu(OH)₂ kết tủa."}}],
    done:`<h2>Hoàn thành: Oxide và muối</h2><p class="muted">Oxide base, oxide acid; tính chất hóa học của muối.</p>`},
  gv:["Ở ống CaO + nước, cho học sinh sờ đáy ống (khi làm thật, cẩn thận) để cảm nhận ống nóng lên.","Hỏi: vì sao đinh sắt phải được làm sạch gỉ trước khi ngâm vào CuSO₄?","So sánh hai ống có kết tủa trắng BaSO₄: chung ion nào?","Nhắc: sục quá nhiều CO₂, kết tủa CaCO₃ có thể tan dần thành Ca(HCO₃)₂ (kiến thức mở rộng)."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 10–11)</p><ul class="tlist"><li>Nêu được khái niệm oxide; phân loại được oxide theo khả năng phản ứng với acid, base; tiến hành được thí nghiệm oxide kim loại phản ứng với acid, oxide phi kim phản ứng với base.</li>
<li>Nêu được khái niệm muối; tiến hành được thí nghiệm muối phản ứng với kim loại, acid, base, muối; nêu được kết luận về tính chất hóa học của muối.</li></ul>
<p style="margin-top:10px"><b>An toàn khi làm thật</b></p><ul class="tlist"><li>CaO phản ứng với nước tỏa nhiều nhiệt; NaOH, H₂SO₄ ăn da; muối barium độc: đeo găng, kính, không nếm, thu gom chất thải đúng nơi quy định.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 10 Oxide, Bài 11 Muối.</li>
<li>Màu và độ tan: Cu(OH)₂ kết tủa xanh lam, BaSO₄ và CaCO₃ kết tủa trắng, dung dịch CuSO₄ xanh lam, CuCl₂ xanh lục; đồng kim loại màu đỏ: <a href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/15%3A_Equilibria_of_Other_Reaction_Classes/15.01%3A_Precipitation_and_Dissolution" target="_blank" rel="noopener">OpenStax Chemistry 2e, mục 15.1</a>; bảng tính tan trong SGK.</li>
<li>Tốc độ đổi màu, lượng kết tủa trong mô phỏng là minh họa định tính.</li></ul>`;

let L;
LabKHTN.register("K8-H-08",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const tube=(id,x,name,short,col,a)=>({id,kind:"tube",x,z:0,name,short,sol:{col:col||"#EDF4FB",a:a||.36,level:.42}});
    const def={aria:"Bàn thí nghiệm 3D về oxide và muối",bench:[7,3],seed:1011,
      stations:{
        oxide:{label:"Oxide",icon:IC.tube,view:{t:[-1.75,.62,0],yaw:0,pitch:.25,rad:1.0},racks:[[-1.75,0,3]],
          vessels:[tube("o1",-2.07,"ống 1 (nước cất)","Ống 1: nước"),tube("o2",-1.75,"ống 2 (dung dịch HCl)","Ống 2: HCl"),tube("o3",-1.43,"ống 3 (nước vôi trong)","Ống 3: nước vôi")]},
        muoi:{label:"Muối",icon:IC.drop,view:{t:[1.75,.62,0],yaw:0,pitch:.25,rad:1.05},racks:[[1.75,0,4]],
          vessels:[tube("m1",1.27,"ống 1 (dung dịch CuSO₄)","CuSO₄",BLUE,.62),tube("m2",1.59,"ống 2 (dung dịch BaCl₂)","BaCl₂"),tube("m3",1.91,"ống 3 (dung dịch CuSO₄)","CuSO₄ ",BLUE,.62),tube("m4",2.23,"ống 4 (dung dịch BaCl₂)","BaCl₂ ")]}},
      reagents:[
        {k:"CaO",label:"Vôi sống CaO",type:"solid",at:["oxide"],chip:"#F2EFE6",sym:"CaO",solid:{kind:"lump",col:"#F2EFE6",scale:.8,rough:.9}},
        {k:"CuO",label:"Bột CuO",type:"solid",at:["oxide"],chip:"#1F1D1C",sym:"CuO",solid:{kind:"powder",col:"#1F1D1C",scale:.8,rough:.9}},
        {k:"pp",label:"Phenolphthalein",type:"drop",c:"#F4F6F8",at:["oxide"],chip:"#F4F6F8",sym:"pp"},
        {k:"co2",label:"Sục khí CO₂",type:"none",at:["oxide"],icon:IC.drop},
        {k:"Fe",label:"Đinh sắt",type:"solid",at:["muoi"],chip:"#8A8F96",sym:"Fe",solid:{kind:"nail",col:"#8A8F96",scale:.75,metal:.85,rough:.4}},
        {k:"h2so4",label:"Dung dịch H₂SO₄",type:"drop",c:"#EEF4FA",at:["muoi"],chip:"#EEF4FA",sym:"H₂SO₄"},
        {k:"naoh",label:"Dung dịch NaOH",type:"drop",c:"#EEF4FA",at:["muoi"],chip:"#EEF4FA",sym:"NaOH"},
        {k:"na2so4",label:"Dung dịch Na₂SO₄",type:"drop",c:"#EEF4FA",at:["muoi"],chip:"#EEF4FA",sym:"Na₂SO₄"}],
      react(k,T,ctx){const D=T.data;const id=T.id;
        if(k==="CaO"){if(id!=="o1")return{cancel:true,toast:"CaO dùng cho ống 1 (nước cất)."};if(D.cao)return{cancel:true,toast:"Ống 1 đã có CaO."};D.cao=true;
          return{fx(B,T){T.tempTgt=58;T.tempK=.15;const sd=T.data.solid;if(sd){sd.rate=1/14;B.solidTint(sd,"#FFFFFF",.4)}T.cloud("#F5F5F0",.25);T.steamOn=true;setTimeout(()=>{if(!L.K.dead)T.steamOn=false},6000);if(D.pp)T.setColor(PINK,.6,4)},
            tn:"Cho một mẩu vôi sống CaO vào ống nước cất",ht:"mẩu CaO rã ra, tan một phần; ống nghiệm nóng lên, có hơi nước bốc lên; nước hơi vẩn đục",kl:"CaO + H₂O → Ca(OH)₂ (phản ứng tỏa nhiệt)"}}
        if(k==="pp"){if(id==="o1"){D.pp=true;return D.cao?{fx(B,T){T.setColor(PINK,.6,2.5)},tn:"Nhỏ phenolphthalein vào ống 1 (CaO + nước)",ht:"dung dịch chuyển màu hồng",kl:"Dung dịch Ca(OH)₂ là base"}:
              {tn:"Nhỏ phenolphthalein vào ống nước cất",ht:"không đổi màu",kl:"Nước cất trung tính"}}
          if(id==="o3")return{fx(B,T){T.setColor(PINK,.55,2)},tn:"Nhỏ phenolphthalein vào nước vôi trong",ht:"dung dịch chuyển màu hồng",kl:"Nước vôi trong là dung dịch base Ca(OH)₂"};
          return{tn:"Nhỏ phenolphthalein vào ống HCl",ht:"không đổi màu",kl:"Phenolphthalein không đổi màu trong acid"}}
        if(k==="CuO"){if(id!=="o2")return{cancel:true,toast:"CuO dùng cho ống 2 (dung dịch HCl)."};if(D.cuo)return{cancel:true,toast:"Ống 2 đã có CuO."};D.cuo=true;
          return{fx(B,T){const sd=T.data.solid;if(sd)sd.rate=1/16;T.setColor("#2FA58C",.62,10)},tn:"Cho một ít bột CuO (màu đen) vào dung dịch HCl, lắc nhẹ",ht:"bột đen tan dần; dung dịch từ không màu chuyển sang màu xanh",kl:"CuO + 2HCl → CuCl₂ + H₂O: oxide base tác dụng với acid tạo muối và nước"}}
        if(k==="co2"){if(id!=="o3")return{cancel:true,toast:"Sục CO₂ vào ống 3 (nước vôi trong)."};if(D.co2)return{cancel:true,toast:"Ống 3 đã vẩn đục."};D.co2=true;
          return{fx(B,T){T.fizz(30,.9);T.precip("#FFFFFF",.75,6);setTimeout(()=>{if(!L.K.dead)T.fizz(0)},6500)},tn:"Dùng ống dẫn sục khí CO₂ vào nước vôi trong",ht:"nước vôi trong vẩn đục trắng",kl:"CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O: oxide acid tác dụng với base tạo muối và nước"}}
        if(k==="Fe"){if(id!=="m1")return{cancel:true,toast:"Thả đinh sắt vào ống 1 (CuSO₄)."};if(D.fe)return{cancel:true,toast:"Ống 1 đã có đinh sắt."};D.fe=true;
          return{fx(B,T){const sd=T.data.solid;T.setColor("#9CC9A6",.45,40);let k=0;const iv=setInterval(()=>{if(L.K.dead||!sd){clearInterval(iv);return}k=Math.min(.9,k+.03);B.solidTint(sd,"#B5532D",k);if(k>=.9)clearInterval(iv)},250)},
            tn:"Ngâm đinh sắt đã đánh sạch vào dung dịch CuSO₄",ht:"có lớp kim loại màu đỏ bám trên đinh sắt; màu xanh của dung dịch nhạt dần",kl:"Fe + CuSO₄ → FeSO₄ + Cu: kim loại mạnh hơn đẩy kim loại yếu hơn ra khỏi muối"}}
        if(k==="h2so4"){if(id==="m2"||id==="m4"){if(D.ppt)return{cancel:true,toast:"Ống này đã có kết tủa."};D.ppt=true;return{fx(B,T){T.precip("#FFFFFF",.8,2.5)},tn:`Nhỏ dung dịch H₂SO₄ vào ${T.name}`,ht:"xuất hiện kết tủa trắng",kl:"BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl: muối tác dụng với acid"}}
          return{tn:`Nhỏ dung dịch H₂SO₄ vào ${T.name}`,ht:"không có hiện tượng",kl:"Không tạo kết tủa hay chất khí nên không xảy ra phản ứng"}}
        if(k==="naoh"){if(id==="m1"||id==="m3"){if(D.ppt)return{cancel:true,toast:"Ống này đã có kết tủa."};D.ppt=true;return{fx(B,T){T.precip("#3B7FD0",.8,2.5);T.setColor("#CFE3F5",.35,4)},tn:`Nhỏ dung dịch NaOH vào ${T.name}`,ht:"xuất hiện kết tủa màu xanh lam",kl:"CuSO₄ + 2NaOH → Cu(OH)₂↓ + Na₂SO₄: muối tác dụng với base"}}
          return{tn:`Nhỏ dung dịch NaOH vào ${T.name}`,ht:"không có hiện tượng",kl:"Không tạo kết tủa hay chất khí nên không xảy ra phản ứng"}}
        if(k==="na2so4"){if(id==="m2"||id==="m4"){if(D.ppt)return{cancel:true,toast:"Ống này đã có kết tủa."};D.ppt=true;return{fx(B,T){T.precip("#FFFFFF",.8,2.5)},tn:`Nhỏ dung dịch Na₂SO₄ vào ${T.name}`,ht:"xuất hiện kết tủa trắng",kl:"BaCl₂ + Na₂SO₄ → BaSO₄↓ + 2NaCl: muối tác dụng với muối"}}
          return{tn:`Nhỏ dung dịch Na₂SO₄ vào ${T.name}`,ht:"không có hiện tượng",kl:"Không tạo kết tủa hay chất khí nên không xảy ra phản ứng"}}
        return null},
      info(v,S,V){if(v==="oxide"){const t=V.o1;return `<div><b>Tính chất của oxide</b></div><div>Ống 1: ${V.o1.data.cao?"CaO + nước":"nước cất"}${V.o1.data.pp?" · đã nhỏ phenolphthalein":""}</div><div>Ống 2: ${V.o2.data.cuo?"HCl + CuO":"dung dịch HCl"}</div><div>Ống 3: ${V.o3.data.co2?"đã sục CO₂":"nước vôi trong"}</div><small>Nhiệt độ ống 1: ${C.fmt(t.temp!=null?t.temp:25,0)} °C</small>`}
        return `<div><b>Tính chất hóa học của muối</b></div><div>Muối + kim loại: Fe vào ống 1</div><div>Muối + acid: H₂SO₄ vào ống 2</div><div>Muối + base: NaOH vào ống 3</div><div>Muối + muối: Na₂SO₄ vào ống 4</div>`}};
    L=BL.chemLab(api,def,SPEC);if(!L.BN)return L.mount;
    L.K.start();
    api.vp.__lab={get S(){return L.S},K:L.K,st:L.st,goView:v=>L.K.goView(v),apply:(k,id)=>L.apply(k,L.V[id]),
      auto(){const q=[["CaO","o1"],["pp","o1"],["CuO","o2"],["co2","o3"],["Fe","m1"],["h2so4","m2"],["naoh","m3"],["na2so4","m4"]];let i=0;const go=()=>{if(i>=q.length)return;if(L.BN.busy())return setTimeout(go,300);L.apply(q[i][0],L.V[q[i][1]]);i++;setTimeout(go,300)};go()}};
    return L.K.mount(L.st)}
});
})();
