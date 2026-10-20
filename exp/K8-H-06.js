/* K8-H-06 · Acid (SGK KHTN 8 – Kết nối tri thức, Bài 8) · 3D
   Trạm 1: dung dịch HCl, H₂SO₄ loãng, CH₃COOH (giấm) và nước cất; thử bằng giấy quỳ tím.
   Trạm 2: bốn ống HCl loãng (khoảng 3 mL); cho kẽm, sắt, magnesium, đồng; thử khí bằng que đóm đang cháy. */
(function(){
"use strict";
const C=window.LabCore,KIT=window.LabKit,BL=window.LabBench,IC=KIT.ICON;
const RED="#C8323A",PURPLE="#7A4A9A";
const ACIDS={hcl:{f:"HCl",ten:"hydrochloric acid"},h2so4:{f:"H₂SO₄",ten:"sulfuric acid loãng"},ch3cooh:{f:"CH₃COOH",ten:"acetic acid (giấm)"}};
/* tốc độ sủi khí trong HCl loãng (minh họa, xếp theo dãy hoạt động hóa học) */
const MET={Zn:{ten:"kẽm",rate:22,col:"#AEB7C2",kind:"granule",scale:.8,eq:"Zn + 2HCl → ZnCl₂ + H₂↑"},Fe:{ten:"sắt",rate:8,col:"#8A8F96",kind:"nail",scale:.75,eq:"Fe + 2HCl → FeCl₂ + H₂↑",tint:"#CFE6BC"},
  Mg:{ten:"magnesium",rate:70,col:"#C8CDD3",kind:"ribbon",scale:.9,eq:"Mg + 2HCl → MgCl₂ + H₂↑"},Cu:{ten:"đồng",rate:0,col:"#C87F4F",kind:"wire",scale:.9}};

const SPEC={
  predict:[{id:"p1",q:"Nhỏ dung dịch acid lên giấy quỳ tím, giấy quỳ chuyển sang màu:",opts:[["do","Đỏ"],["xanh","Xanh"],["khong","Không đổi màu"]],ans:"do",res:"Kết quả: quỳ tím chuyển đỏ trong cả ba dung dịch acid; nước cất không làm quỳ đổi màu."},
    {id:"p2",q:"Cho kẽm vào dung dịch HCl, em đoán sẽ thấy:",opts:[["khi","Sủi bọt khí, kẽm tan dần"],["khong","Không có hiện tượng"],["mau","Dung dịch chuyển màu xanh"]],ans:"khi",res:"Kết quả: kẽm tan dần, sủi bọt khí hydrogen."}],
  taskLead:"Chọn hóa chất hoặc dụng cụ ở khay, rồi chạm vào ống nghiệm.",
  tasks:[{html:"<b>Chất chỉ thị:</b> nhúng giấy quỳ tím vào cả 4 ống (3 acid và nước cất).",done:()=>["a1","a2","a3","a4"].every(i=>L.S.done.has("quy@"+i))},
    {html:"<b>Acid + kim loại:</b> cho ít nhất 3 kim loại khác nhau vào các ống HCl, trong đó có đồng để đối chứng.",done:()=>["Zn","Fe","Mg","Cu"].filter(m=>[...L.S.done].some(d=>d.startsWith(m+"@"))).length>=3&&[...L.S.done].some(d=>d.startsWith("Cu@"))},
    {html:"<b>Thử khí:</b> đưa que đóm đang cháy vào miệng một ống đang sủi bọt.",done:()=>!!L.S.tag.pop}],
  obs:[{id:"a",q:"Giấy quỳ tím nhúng vào các dung dịch acid chuyển màu đỏ. Điều đó cho biết:",opts:[["acid","Dung dịch có môi trường acid"],["base","Dung dịch có môi trường base"],["muoi","Dung dịch là nước muối"]],ans:"acid",why:"Acid làm quỳ tím chuyển đỏ; base làm quỳ tím chuyển xanh."},
    {id:"b",q:"Que đóm đang cháy đưa vào miệng ống kẽm + HCl có tiếng nổ nhỏ. Khí thoát ra là:",opts:[["h2","Hydrogen"],["o2","Oxygen"],["co2","Carbon dioxide"]],ans:"h2",why:"Hydrogen cháy trong không khí gây tiếng nổ nhỏ; oxygen làm que đóm bùng cháy, CO₂ làm que đóm tắt."},
    {id:"c",q:"Vì sao ống đồng + HCl không có bọt khí?",opts:[["sau","Đồng đứng sau hydrogen trong dãy hoạt động hóa học"],["it","Lượng đồng quá ít"],["dac","Acid quá loãng"]],ans:"sau",why:"Chỉ kim loại đứng trước hydrogen mới đẩy được hydrogen ra khỏi dung dịch acid."}],
  concl:{html:`<div class="eq">Zn + 2HCl → ZnCl₂ + H₂↑<br>Fe + 2HCl → FeCl₂ + H₂↑<br>Mg + H₂SO₄ → MgSO₄ + H₂↑</div><ul class="tlist">
    <li>Acid là hợp chất trong phân tử có nguyên tử hydrogen liên kết với gốc acid; khi tan trong nước, acid tạo ra ion H⁺.</li>
    <li>Dung dịch acid làm quỳ tím chuyển sang màu đỏ.</li><li>Acid tác dụng với kim loại đứng trước hydrogen trong dãy hoạt động hóa học tạo thành muối và giải phóng khí hydrogen.</li>
    <li>Pha loãng sulfuric acid đặc: rót từ từ acid vào nước, không làm ngược lại.</li></ul>`,
    quiz:[{id:"q1",q:"Chất nào là acid?",opts:[["a","HNO₃"],["b","NaOH"],["c","NaCl"]],ans:"a",why:{b:"NaOH là base.",c:"NaCl là muối."}},
      {id:"q2",q:"Pha loãng sulfuric acid đặc an toàn bằng cách:",opts:[["a","Rót từ từ acid vào nước và khuấy đều"],["b","Rót nhanh nước vào acid"],["c","Đổ acid và nước cùng lúc"]],ans:"a",why:{b:"Rót nước vào acid đặc làm nước sôi bùng lên, bắn acid ra ngoài.",c:"Phải rót từ từ acid vào nước."}},
      {id:"q3",q:"Kim loại nào không tác dụng với dung dịch HCl?",opts:[["a","Ag"],["b","Zn"],["c","Mg"]],ans:"a",why:{b:"Zn đứng trước H.",c:"Mg đứng trước H."}}],
    done:`<h2>Hoàn thành: Acid</h2><p class="muted">Acid làm quỳ tím hóa đỏ, tác dụng với kim loại đứng trước H giải phóng hydrogen.</p>`},
  gv:["Hỏi: vì sao cần ống nước cất?","Nhắc: mỗi lần chỉ cho một mẩu kim loại nhỏ.","Đối chiếu tốc độ sủi bọt với dãy hoạt động hóa học.","Liên hệ: acid trong dạ dày, trong quả chua."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 8)</p><ul class="tlist"><li>Nêu được khái niệm acid; tiến hành được thí nghiệm acid làm đổi màu chất chỉ thị, tác dụng với kim loại; nêu được ứng dụng của một số acid.</li></ul>
<p style="margin-top:10px"><b>An toàn khi làm thật</b></p><ul class="tlist"><li>Đeo kính, găng tay; dùng HCl loãng; khí hydrogen dễ cháy, không để gần lửa khi thu nhiều khí.</li></ul>`;
const SRC=`<ul class="tlist"><li>Thí nghiệm HCl với giấy quỳ tím, 3 mL HCl với Zn; định nghĩa acid; quy tắc pha loãng H₂SO₄ đặc: <a href="https://minio.ftech.ai/fs-landing/KHTN_8_Ket_noi_Bai_8_8c865125f3.pdf" target="_blank" rel="noopener">tài liệu bài dạy KHTN 8 KNTT Bài 8</a>.</li>
<li>Tốc độ sủi bọt minh họa theo thứ tự Mg › Zn › Fe › H › Cu của dãy hoạt động hóa học (Bài 19, KHTN 9); không phải số đo.</li></ul>`;

let L;
LabKHTN.register("K8-H-06",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const tube=(id,x,name,short,col,a)=>({id,kind:"tube",x,z:0,name,short,sol:{col:col||"#EDF4FB",a:a||.36,level:.42}});
    const def={aria:"Bàn thí nghiệm 3D về acid: ống nghiệm dung dịch acid, giấy quỳ tím, kim loại, que đóm",bench:[7,3],seed:808,
      stations:{
        quy:{label:"Quỳ tím",icon:IC.drop,view:{t:[-1.75,.62,0],yaw:0,pitch:.25,rad:1.05},racks:[[-1.75,0,4]],
          vessels:[tube("a1",-2.23,"dung dịch HCl","HCl"),tube("a2",-1.91,"dung dịch H₂SO₄ loãng","H₂SO₄"),tube("a3",-1.59,"giấm ăn (CH₃COOH)","CH₃COOH","#F4F0E2",.38),tube("a4",-1.27,"nước cất","Nước cất")]},
        kl:{label:"Kim loại",icon:IC.tube,view:{t:[1.75,.62,0],yaw:0,pitch:.25,rad:1.05},racks:[[1.75,0,4]],
          vessels:[tube("b1",1.27,"ống 1 (HCl)","Ống 1"),tube("b2",1.59,"ống 2 (HCl)","Ống 2"),tube("b3",1.91,"ống 3 (HCl)","Ống 3"),tube("b4",2.23,"ống 4 (HCl)","Ống 4")]}},
      reagents:[{k:"quy",label:"Giấy quỳ tím",type:"strip",c:PURPLE,at:["quy"],chip:PURPLE},
        ...Object.keys(MET).map(m=>({k:m,label:MET[m].ten[0].toUpperCase()+MET[m].ten.slice(1),type:"solid",at:["kl"],chip:MET[m].col,sym:m,solid:{kind:MET[m].kind,col:MET[m].col,scale:MET[m].scale,metal:.85,rough:.4}})),
        {k:"splint",label:"Que đóm cháy",type:"splint",at:["kl"],icon:IC.fire}],
      react(k,T,ctx){
        if(k==="quy"){const acid=T.id!=="a4";return{strip:acid?RED:PURPLE,tn:`Nhúng giấy quỳ tím vào ${T.name}`,ht:acid?"quỳ tím chuyển màu đỏ":"quỳ tím không đổi màu",kl:acid?"Dung dịch có môi trường acid":"Nước cất trung tính"}}
        if(k==="splint"){const g=T.data.metal&&MET[T.data.metal].rate>0;if(g)T.data.pop=true;
          return{splint:g?"pop":"none",tag:g?"pop":null,tn:`Que đóm đang cháy đưa vào miệng ${T.name}${T.data.metal?` (${MET[T.data.metal].ten})`:""}`,ht:g?"có tiếng nổ nhỏ":"không có tiếng nổ, que đóm vẫn cháy",kl:g?"Khí thoát ra là hydrogen":"Không có khí hydrogen",toast:g?"Nghe tiếng nổ nhỏ: khí hydrogen.":null}}
        const m=MET[k];if(!m)return null;if(T.data.metal)return{cancel:true,toast:"Ống này đã có kim loại. Chọn ống khác hoặc làm lại trạm."};
        T.data.metal=k;
        return{fx(B,T){T.fizz(m.rate,k==="Mg"?1.2:1);const sd=T.data.solid;if(sd&&m.rate)sd.rate=m.rate/2400;if(m.tint)T.setColor(m.tint,.42,30)},
          tn:`Cho ${m.ten} vào ${T.name}`,ht:m.rate?`sủi bọt khí ${m.rate>50?"rất mạnh":m.rate>15?"mạnh":"chậm"}, mẩu ${m.ten} tan dần${m.tint?"; dung dịch dần có màu lục nhạt":""}`:"không có hiện tượng",
          kl:m.rate?`Có phản ứng: ${m.eq}`:"Đồng không tác dụng với HCl (đứng sau H)"}},
      info(v,S,V){if(v==="quy")return `<div><b>Acid làm đổi màu chất chỉ thị</b></div><small>Chọn giấy quỳ tím ở khay, rồi chạm vào từng ống.</small>`;
        const tb=["b1","b2","b3","b4"].map(i=>V[i]).map((T,i)=>`<div>Ống ${i+1}: ${T.data.metal?MET[T.data.metal].ten+(MET[T.data.metal].rate?" · sủi khí":" · không đổi"):"chưa có kim loại"}</div>`).join("");
        return `<div><b>Acid + kim loại</b> (HCl loãng)</div>${tb}<small>Que đóm cháy: thử khí ở ống đang sủi bọt.</small>`}};
    L=BL.chemLab(api,def,SPEC);if(!L.BN)return L.mount;
    L.K.start();
    api.vp.__lab={get S(){return L.S},K:L.K,st:L.st,goView:v=>L.K.goView(v),apply:(k,id)=>L.apply(k,L.V[id]),
      auto(){const q=[["quy","a1"],["quy","a2"],["quy","a3"],["quy","a4"],["Zn","b1"],["Fe","b2"],["Mg","b3"],["Cu","b4"],["splint","b1"]];let i=0;const go=()=>{if(i>=q.length)return;if(L.BN.busy())return setTimeout(go,300);L.apply(q[i][0],L.V[q[i][1]]);i++;setTimeout(go,300)};go()}};
    return L.K.mount(L.st)}
});
})();
