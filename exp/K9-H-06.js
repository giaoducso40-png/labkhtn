/* K9-H-06 · Acetic acid; phản ứng ester hóa (SGK KHTN 9 – Kết nối tri thức, Bài 27) · 3D
   1. Tính acid: dung dịch CH₃COOH làm quỳ tím hóa đỏ; tác dụng với kẽm (khí H₂), đá vôi CaCO₃ (khí CO₂), dung dịch NaOH có phenolphthalein (mất màu hồng).
   2. Ester hóa: ethanol + acetic acid + vài giọt H₂SO₄ đặc, đun nhẹ; rót ra cốc nước muối lạnh: lớp ethyl acetate không tan nổi lên trên, có mùi thơm. */
(function(){
"use strict";
const C=window.LabCore,KIT=window.LabKit,BL=window.LabBench,K3=window.LabChem3D,G=window.LabGL,IC=KIT.ICON;
const RED="#C8323A",PURPLE="#7A4A9A",PINK="#E5488F";
const SPEC={
  predict:[{id:"p1",q:"Nhúng quỳ tím vào giấm ăn (dung dịch acetic acid), quỳ tím:",opts:[["do","Chuyển đỏ"],["xanh","Chuyển xanh"],["khong","Không đổi màu"]],ans:"do",res:"Kết quả: quỳ tím chuyển đỏ: acetic acid có tính acid."},
    {id:"p2",q:"Đun ethanol với acetic acid (có H₂SO₄ đặc), sản phẩm có mùi thơm là:",opts:[["ester","Ethyl acetate (một ester)"],["muoi","Muối ăn"],["khi","Khí CO₂"]],ans:"ester",res:"Kết quả: tạo ethyl acetate CH₃COOC₂H₅, chất lỏng mùi thơm, ít tan trong nước."}],
  taskLead:"Chọn hóa chất hoặc dụng cụ ở khay rồi chạm vào ống nghiệm cần dùng.",
  tasks:[{html:"<b>Tính acid:</b> thử quỳ tím; cho kẽm, đá vôi vào acetic acid.",done:()=>["quy@a1","Zn@a2","caco3@a3"].every(x=>L.S.done.has(x))},
    {html:"<b>Trung hòa:</b> nhỏ acetic acid vào ống NaOH có phenolphthalein.",done:()=>L.S.done.has("acid@a4")},
    {html:"<b>Ester hóa:</b> thêm H₂SO₄ đặc vào ống ethanol + acetic acid, đun nhẹ, rót ra cốc nước muối.",done:()=>!!L.S.tag.ester}],
  obs:[{id:"a",q:"Đá vôi tan trong giấm, sủi bọt khí. Khí đó là:",opts:[["co2","CO₂"],["h2","H₂"],["o2","O₂"]],ans:"co2",why:"2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O."},
    {id:"b",q:"Vai trò của H₂SO₄ đặc trong phản ứng ester hóa là:",opts:[["xt","Chất xúc tác"],["sp","Chất tham gia tạo sản phẩm chính"],["mau","Tạo màu"]],ans:"xt",why:"H₂SO₄ đặc làm phản ứng xảy ra nhanh hơn (xúc tác), đồng thời hút nước."}],
  concl:{html:`<div class="eq">2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂↑<br>2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O<br>CH₃COOH + NaOH → CH₃COONa + H₂O<br>CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O (H₂SO₄ đặc, t°)</div><ul class="tlist">
    <li>Acetic acid CH₃COOH là chất lỏng không màu, vị chua, tan vô hạn trong nước; giấm ăn là dung dịch acetic acid 2–5%.</li>
    <li>Nhóm –COOH làm cho acetic acid có tính acid: làm quỳ tím hóa đỏ, tác dụng với kim loại đứng trước H, oxide base, base, muối carbonate.</li>
    <li>Phản ứng giữa acid và alcohol tạo ester và nước gọi là phản ứng ester hóa; đây là phản ứng thuận nghịch.</li></ul>`,
    quiz:[{id:"q1",q:"Dùng giấm có thể làm sạch cặn trắng (CaCO₃) trong ấm đun nước vì:",opts:[["a","Acetic acid tác dụng với CaCO₃ tạo muối tan và khí CO₂"],["b","Giấm làm nguội ấm"],["c","Giấm có màu"]],ans:"a",why:{b:"Lí do là phản ứng hóa học.",c:"Giấm không có màu đáng kể."}},
      {id:"q2",q:"Ethyl acetate có công thức:",opts:[["a","CH₃COOC₂H₅"],["b","C₂H₅OH"],["c","CH₃COOH"]],ans:"a",why:{b:"Đó là ethanol.",c:"Đó là acetic acid."}}],
    done:`<h2>Hoàn thành: Acetic acid</h2><p class="muted">Tính acid của nhóm –COOH; phản ứng ester hóa.</p>`},
  gv:["An toàn: H₂SO₄ đặc gây bỏng nặng, chỉ giáo viên thao tác; ngửi mùi ester bằng cách phẩy nhẹ tay.","Hỏi: vì sao giấm có thể làm mềm vỏ trứng?"]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 27)</p><ul class="tlist"><li>Nêu được công thức, tính chất vật lí, tính chất hóa học của acetic acid (phản ứng với quỳ tím, kim loại, oxide, base, muối carbonate; phản ứng ester hóa); ứng dụng.</li><li>Tiến hành được thí nghiệm (hoặc quan sát) chứng minh tính chất hóa học của acetic acid.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 27 Acetic acid.</li><li>Ethyl acetate ít tan trong nước, khối lượng riêng khoảng 0,90 g/cm³: <a href="https://pubchem.ncbi.nlm.nih.gov/compound/Ethyl-Acetate" target="_blank" rel="noopener">PubChem – Ethyl acetate</a>.</li><li>Tốc độ sủi bọt, độ dày lớp ester là minh họa định tính.</li></ul>`;

let L;
LabKHTN.register("K9-H-06",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const tube=(id,x,name,short,col,a)=>({id,kind:"tube",x,z:0,name,short,sol:{col:col||"#F1F6FA",a:a||.36,level:.4}});
    const def={aria:"Bàn thí nghiệm 3D về acetic acid và phản ứng ester hóa",bench:[8,3],seed:27,
      stations:{
        acid:{label:"Tính acid",icon:IC.tube,view:{t:[-2,.62,0],yaw:0,pitch:.25,rad:1.05},racks:[[-2,0,4]],
          vessels:[tube("a1",-2.48,"ống 1 (CH₃COOH)","Ống 1"),tube("a2",-2.16,"ống 2 (CH₃COOH)","Ống 2"),tube("a3",-1.84,"ống 3 (CH₃COOH)","Ống 3"),tube("a4",-1.52,"ống 4 (NaOH + phenolphthalein)","Ống 4: NaOH",PINK,.55)]},
        ester:{label:"Ester hóa",icon:IC.fire,view:{t:[1.8,.62,0],yaw:0,pitch:.22,rad:1.05},burners:[[1.45,0,"b"]],
          vessels:[{id:"e1",kind:"tube",x:1.45,z:0,y:.5,name:"ống nghiệm (C₂H₅OH + CH₃COOH)",short:"Ống phản ứng",sol:{col:"#F2F7FB",a:.3,level:.3},ly:1.7},{id:"e2",kind:"beaker",x:2.3,z:0,r:.24,h:.42,name:"cốc nước muối lạnh",short:"Cốc nước muối",sol:{col:"#E6F1FB",a:.32,level:.5}}]}},
      reagents:[{k:"quy",label:"Giấy quỳ tím",type:"strip",c:PURPLE,at:["acid"],chip:PURPLE},{k:"Zn",label:"Kẽm viên",type:"solid",at:["acid"],chip:"#AEB7C2",sym:"Zn",solid:{kind:"granule",col:"#AEB7C2",scale:.8,metal:.85,rough:.4}},
        {k:"caco3",label:"Đá vôi CaCO₃",type:"solid",at:["acid"],chip:"#EDE8DC",sym:"CaCO₃",solid:{kind:"lump",col:"#EDE8DC",scale:.8,rough:.9}},{k:"acid",label:"Nhỏ CH₃COOH",type:"drop",c:"#F1F6FA",n:6,at:["acid"],chip:"#F1F6FA",sym:"CH₃COOH"},
        {k:"h2so4",label:"Vài giọt H₂SO₄ đặc",type:"drop",c:"#F5F2E8",n:3,at:["ester"],chip:"#F5F2E8",sym:"H₂SO₄"},{k:"heat",label:"Đun nhẹ bằng đèn cồn",type:"heat",at:["ester"],icon:IC.fire},{k:"rot",label:"Rót ra cốc nước muối",type:"none",at:["ester"],icon:IC.beaker}],
      react(k,T,ctx){const D=T.data,id=T.id;
        if(k==="quy"){const ac=id!=="a4";return{strip:ac?RED:"#2E5AAC",tn:`Nhúng quỳ tím vào ${T.name}`,ht:ac?"quỳ tím chuyển đỏ":"quỳ tím chuyển xanh",kl:ac?"Acetic acid có tính acid":"Dung dịch NaOH có tính base"}}
        if(k==="Zn"){if(id==="a4")return{cancel:true,toast:"Cho kẽm vào ống có acetic acid."};if(D.s)return{cancel:true,toast:"Ống đã có chất rắn."};D.s=1;return{fx(B,T){T.fizz(8,.8);const sd=T.data.solid;if(sd)sd.rate=1/120},tn:`Cho viên kẽm vào ${T.name}`,ht:"có bọt khí thoát ra chậm (chậm hơn so với HCl cùng nồng độ)",kl:"2CH₃COOH + Zn → (CH₃COO)₂Zn + H₂↑"}}
        if(k==="caco3"){if(id==="a4")return{cancel:true,toast:"Cho đá vôi vào ống có acetic acid."};if(D.s)return{cancel:true,toast:"Ống đã có chất rắn."};D.s=1;return{fx(B,T){T.fizz(34,1.1);const sd=T.data.solid;if(sd)sd.rate=1/50},tn:`Cho mẩu đá vôi vào ${T.name}`,ht:"đá vôi tan dần, sủi bọt khí mạnh",kl:"2CH₃COOH + CaCO₃ → (CH₃COO)₂Ca + CO₂↑ + H₂O"}}
        if(k==="acid"){if(id!=="a4")return{cancel:true,toast:"Nhỏ acetic acid vào ống 4 (NaOH có phenolphthalein)."};if(D.n)return{cancel:true,toast:"Ống 4 đã mất màu."};D.n=1;return{fx(B,T){T.setColor("#F4F6F8",.34,3)},tn:"Nhỏ từ từ acetic acid vào ống NaOH có phenolphthalein",ht:"màu hồng nhạt dần rồi mất màu",kl:"CH₃COOH + NaOH → CH₃COONa + H₂O (phản ứng trung hòa)"}}
        if(k==="h2so4"){if(id!=="e1")return{cancel:true,toast:"Nhỏ vào ống phản ứng."};D.xt=1;return{tn:"Nhỏ vài giọt H₂SO₄ đặc vào ống chứa ethanol và acetic acid",ht:"hỗn hợp hơi nóng lên",kl:"H₂SO₄ đặc là chất xúc tác"}}
        if(k==="heat"){if(id!=="e1")return{cancel:true,toast:"Đun ống phản ứng."};if(!D.xt)return{cancel:true,toast:"Thêm vài giọt H₂SO₄ đặc trước khi đun."};T.burner="b";D.heatT=D.heatT||0;return{fx(){}}}
        if(k==="rot"){if(id!=="e2")return{cancel:true,toast:"Chạm vào cốc nước muối để rót hỗn hợp sang."};const E=ctx.V.e1.data;if(!E.done)return{cancel:true,toast:"Đun hỗn hợp vài phút trước (khoảng 4 giây trên màn hình)."};if(D.layer)return{cancel:true,toast:"Đã rót."};D.layer=1;ctx.S.tag.ester=true;
          return{fx(){layer.visible=true;layT=0},tn:"Rót hỗn hợp sau phản ứng vào cốc nước muối lạnh",ht:"có lớp chất lỏng không màu, không tan, nổi lên trên mặt nước, có mùi thơm",kl:"Sản phẩm là ethyl acetate: CH₃COOH + C₂H₅OH ⇌ CH₃COOC₂H₅ + H₂O"}}
        return null},
      info(v,S,V){if(v==="acid")return `<div><b>Tính chất của acetic acid</b></div><small>Quỳ tím, kẽm, đá vôi → ống 1–3; nhỏ CH₃COOH → ống 4 (NaOH có phenolphthalein).</small>`;
        const E=V.e1.data;return `<div><b>Phản ứng ester hóa</b></div><div>${E.xt?"Đã thêm H₂SO₄ đặc":"Chưa thêm xúc tác"} · ${E.done?"đã đun xong":V.e1.heat?"đang đun":"chưa đun"}</div><small>Ống chứa sẵn 2 mL ethanol và 2 mL acetic acid đặc.</small>`}};
    let layer,layT=0;
    L=BL.chemLab(api,def,SPEC);if(!L.BN)return L.mount;L.BN.clamp(1.45,0,.95);
    const K=L.K,R=K.R;
    layer=K.root.add(R.mesh(G.cylinder(.225,.035,40),{color:"#FFF9E0",alpha:.55,transparent:true,order:3,rough:.05,coat:.6}));layer.pos=[2.3,.2,0];layer.visible=false;
    K.onFrame(dt=>{const T=L.V.e1,d=T.data;if(T.heat&&d.heatT!=null){d.heatT+=dt;T.steamOn=true;if(d.heatT>3.5&&!d.done){d.done=true;L.rec("Đun nhẹ hỗn hợp ethanol, acetic acid và H₂SO₄ đặc","hỗn hợp sôi nhẹ, có hơi bay lên; ngửi thấy mùi thơm","Đã tạo thành ester (ethyl acetate)");L.refresh()}}
      if(layer.visible&&dt>0){layT+=dt;const k=Math.min(1,layT/2);layer.scl=[1,k,1]}});
    K.start();
    api.vp.__lab={get S(){return L.S},K,st:L.st,goView:v=>K.goView(v),apply:(k,id)=>L.apply(k,L.V[id]),
      auto(){const q=[["quy","a1"],["Zn","a2"],["caco3","a3"],["acid","a4"],["h2so4","e1"],["heat","e1"]];let i=0;const go=()=>{if(i>=q.length){const w=()=>{if(K.dead)return;if(!L.V.e1.data.done)return setTimeout(w,300);L.apply("rot",L.V.e2)};return w()}if(L.BN.busy())return setTimeout(go,300);L.apply(q[i][0],L.V[q[i][1]]);i++;setTimeout(go,300)};go()}};
    return K.mount(L.st)}
});
})();
