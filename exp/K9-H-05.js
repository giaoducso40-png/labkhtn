/* K9-H-05 · Ethylic alcohol (SGK KHTN 9 – Kết nối tri thức, Bài 26) · 3D
   1. Tính chất: ethanol tan vô hạn trong nước; ethanol tác dụng với sodium giải phóng khí hydrogen (que đóm cháy có tiếng nổ nhỏ).
   2. Phản ứng cháy: đốt ethanol trong chén sứ, ngọn lửa màu xanh nhạt; úp cốc tráng nước vôi trong thấy vẩn đục.
   3. Độ cồn (độ rượu): rót V mL ethanol vào ống đong 100 mL rồi thêm nước tới vạch 100 mL; độ cồn = V. */
(function(){
"use strict";
const C=window.LabCore,KIT=window.LabKit,BL=window.LabBench,K3=window.LabChem3D,G=window.LabGL,IC=KIT.ICON;
const fmt=C.fmt;
const SPEC={
  predict:[{id:"p1",q:"Rót ethanol vào nước rồi lắc, em thấy:",opts:[["tan","Ethanol tan hoàn toàn, hỗn hợp đồng nhất"],["lop","Tách thành hai lớp"],["kt","Có kết tủa"]],ans:"tan",res:"Kết quả: ethanol tan vô hạn trong nước."},
    {id:"p2",q:"Rượu 45° nghĩa là:",opts:[["45","Trong 100 mL rượu có 45 mL ethanol nguyên chất"],["nhiet","Rượu được đun tới 45 °C"],["g","Trong 100 g rượu có 45 g nước"]],ans:"45",res:"Kết quả: độ cồn là số mL ethanol nguyên chất có trong 100 mL hỗn hợp ethanol với nước."}],
  taskLead:"Chọn hóa chất hoặc dụng cụ ở khay, rồi chạm vào ống nghiệm, chén sứ hoặc ống đong.",
  tasks:[{html:"<b>Tính tan:</b> rót ethanol vào ống nước.",done:()=>L.S.done.has("etoh@t2")},
    {html:"<b>Với sodium:</b> cho mẩu sodium vào ethanol khan, thử khí bằng que đóm cháy.",done:()=>L.S.done.has("na@t1")&&!!L.S.tag.pop},
    {html:"<b>Phản ứng cháy:</b> đốt ethanol trong chén sứ, úp cốc tráng nước vôi trong.",done:()=>L.S.done.has("lua@d1")&&L.S.done.has("voi@d1")},
    {html:"<b>Độ cồn:</b> pha một dung dịch ethanol trong ống đong 100 mL.",done:()=>!!L.S.tag.do}],
  obs:[{id:"a",q:"Khí thoát ra khi cho sodium vào ethanol là:",opts:[["h2","Hydrogen"],["o2","Oxygen"],["co2","Carbon dioxide"]],ans:"h2",why:"Nguyên tử H trong nhóm –OH bị sodium thay thế: 2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑."},
    {id:"b",q:"Ethanol cháy với ngọn lửa:",opts:[["xanh","Màu xanh nhạt, tỏa nhiều nhiệt, gần như không có muội"],["do","Màu đỏ, nhiều khói đen"],["khong","Không cháy"]],ans:"xanh",why:"C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O; ethanol được dùng làm nhiên liệu (cồn, xăng E5)."}],
  concl:{html:`<div class="eq">C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O (t°)<br>2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑</div><ul class="tlist">
    <li>Ethylic alcohol (ethanol) C₂H₆O (CH₃–CH₂–OH) là chất lỏng không màu, sôi ở 78,3 °C, tan vô hạn trong nước, hòa tan được nhiều chất.</li>
    <li>Nhóm –OH làm cho ethanol có tính chất đặc trưng: tác dụng với sodium giải phóng hydrogen.</li>
    <li>Độ cồn là số mL ethanol nguyên chất có trong 100 mL hỗn hợp ethanol và nước. Lạm dụng rượu bia gây hại cho sức khỏe; không lái xe sau khi uống rượu bia.</li></ul>`,
    quiz:[{id:"q1",q:"Trong 500 mL rượu 40° có bao nhiêu mL ethanol nguyên chất?",opts:[["a","200 mL"],["b","40 mL"],["c","460 mL"]],ans:"a",why:{b:"40 mL ứng với 100 mL rượu.",c:"Đó là gần đúng thể tích nước."}},
      {id:"q2",q:"Ethanol được dùng để:",opts:[["a","Làm nhiên liệu, dung môi, sát trùng (cồn 70°)"],["b","Làm nước uống hằng ngày"],["c","Làm phân bón"]],ans:"a",why:{b:"Ethanol có hại khi uống nhiều.",c:"Không dùng làm phân bón."}}],
    done:`<h2>Hoàn thành: Ethylic alcohol</h2><p class="muted">Tan vô hạn trong nước, cháy, tác dụng với sodium; độ cồn.</p>`},
  gv:["An toàn khi làm thật: ethanol dễ cháy, đậy kín lọ, để xa lửa; sodium chỉ dùng mẩu nhỏ bằng hạt đỗ, cắt bằng dao, không cầm bằng tay.","Hỏi: vì sao cồn 70° sát trùng tốt hơn cồn 96°? (cần nước để thấm qua màng tế bào vi khuẩn, kiến thức mở rộng)."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 26)</p><ul class="tlist"><li>Nêu được công thức phân tử, cấu tạo, tính chất vật lí, tính chất hóa học của ethylic alcohol; khái niệm độ cồn; ứng dụng; tác hại của rượu bia.</li><li>Tiến hành được thí nghiệm (hoặc quan sát thí nghiệm) ethanol cháy, tác dụng với sodium.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 26 Ethylic alcohol.</li><li>Nhiệt độ sôi ethanol 78,3 °C: <a href="https://pubchem.ncbi.nlm.nih.gov/compound/Ethanol" target="_blank" rel="noopener">PubChem – Ethanol</a>.</li>
<li>Bỏ qua sự co thể tích khi trộn ethanol với nước (thực tế 50 mL + 50 mL cho khoảng 96–97 mL).</li></ul>`;

let L;
LabKHTN.register("K9-H-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"ht",t:"Hiện tượng"},{k:"kl",t:"Kết luận"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const def={aria:"Bàn thí nghiệm 3D về ethylic alcohol",bench:[8,3],seed:26,
      stations:{
        tc:{label:"Tính chất",icon:IC.tube,view:{t:[-2.5,.62,0],yaw:0,pitch:.25,rad:.9},racks:[[-2.5,0,2]],
          vessels:[{id:"t1",kind:"tube",x:-2.66,z:0,name:"ống 1 (ethanol khan)",short:"Ống 1: ethanol",sol:{col:"#F2F7FB",a:.32,level:.4}},{id:"t2",kind:"tube",x:-2.34,z:0,name:"ống 2 (nước cất)",short:"Ống 2: nước",sol:{col:"#E6F1FB",a:.34,level:.3}}]},
        chay:{label:"Phản ứng cháy",icon:IC.fire,view:{t:[0,.35,0],yaw:0,pitch:.3,rad:.7},vessels:[{id:"d1",kind:"beaker",x:0,z:0,r:.125,h:.085,name:"chén sứ chứa ethanol",short:"Chén sứ",sol:{col:"#F2F7FB",a:.3,level:.4},ly:.2}]},
        doc:{label:"Độ cồn",icon:IC.beaker,view:{t:[2.4,.45,0],yaw:0,pitch:.2,rad:.75},vessels:[{id:"c1",kind:"beaker",x:2.4,z:0,r:.1,h:.8,name:"ống đong 100 mL",short:"Ống đong 100 mL",sol:{col:"#E3EEF8",a:.36,level:.0},ly:.9}]}},
      reagents:[{k:"etoh",label:"Ethanol",type:"pour",add:.12,c:"#F2F7FB",at:["tc"],chip:"#F2F7FB",sym:"C₂H₅OH"},{k:"na",label:"Mẩu sodium",type:"solid",at:["tc"],chip:"#C9CDD3",sym:"Na",solid:{kind:"lump",col:"#C9CDD3",scale:.5,metal:.7,rough:.4}},
        {k:"splint",label:"Que đóm cháy",type:"splint",at:["tc"],icon:IC.fire},
        {k:"lua",label:"Châm lửa",type:"none",at:["chay"],icon:IC.fire},{k:"voi",label:"Úp cốc tráng nước vôi trong",type:"none",at:["chay"],icon:IC.beaker},
        ...[20,45,70].map(v=>({k:"e"+v,label:`Rót ${v} mL ethanol`,type:"pour",add:v/100*.85,c:"#F2F7FB",at:["doc"],icon:IC.drop})),{k:"nuoc",label:"Thêm nước tới vạch 100 mL",type:"pour",add:.3,c:"#E6F1FB",at:["doc"],icon:IC.drop}],
      react(k,T,ctx){const D=T.data;
        if(k==="etoh"){if(T.id!=="t2")return{cancel:true,toast:"Rót ethanol vào ống 2 (nước)."};return{tn:"Rót ethanol vào ống nước, lắc nhẹ",ht:"ethanol tan hết, hỗn hợp trong suốt, đồng nhất, không tách lớp",kl:"Ethanol tan vô hạn trong nước"}}
        if(k==="na"){if(T.id!=="t1")return{cancel:true,toast:"Chỉ cho sodium vào ethanol khan (ống 1). Không cho sodium vào nước: phản ứng rất mãnh liệt, nguy hiểm."};if(D.na)return{cancel:true,toast:"Ống 1 đã có sodium."};D.na=true;
          return{fx(B,T){T.fizz(14,.8);const sd=T.data.solid;if(sd)sd.rate=1/40},tn:"Cho mẩu sodium nhỏ vào ống ethanol khan",ht:"mẩu sodium tan dần, có bọt khí thoát ra (êm dịu hơn nhiều so với sodium vào nước)",kl:"2C₂H₅OH + 2Na → 2C₂H₅ONa + H₂↑"}}
        if(k==="splint"){const g=T.id==="t1"&&D.na;return{splint:g?"pop":"none",tag:g?"pop":null,tn:`Đưa que đóm cháy vào miệng ${T.name}`,ht:g?"có tiếng nổ nhỏ":"que đóm vẫn cháy, không có tiếng nổ",kl:g?"Khí thoát ra là hydrogen":"Không có khí hydrogen"}}
        if(k==="lua"){if(D.burn)return{cancel:true,toast:"Ethanol đang cháy."};D.burn=true;return{fx(){flame.visible=true},tn:"Châm lửa vào chén sứ chứa ethanol",ht:"ethanol cháy với ngọn lửa màu xanh nhạt, tỏa nhiều nhiệt, không có muội",kl:"C₂H₅OH + 3O₂ → 2CO₂ + 3H₂O"}}
        if(k==="voi"){if(!D.burn)return{cancel:true,toast:"Châm lửa trước."};return{fx(){cup.visible=true;cupT=0},tn:"Úp cốc tráng nước vôi trong lên ngọn lửa",ht:"thành cốc vẩn đục trắng",kl:"Sản phẩm cháy có CO₂"}}
        if(k.startsWith("e")){if(D.v)return{cancel:true,toast:"Ống đong đã có ethanol. Bấm “Làm lại trạm” để pha lại."};D.v=+k.slice(1);return{tn:`Rót ${D.v} mL ethanol vào ống đong 100 mL`,ht:`mực chất lỏng ở vạch ${D.v} mL`,kl:"Tiếp tục thêm nước tới vạch 100 mL"}}
        if(k==="nuoc"){if(!D.v)return{cancel:true,toast:"Rót ethanol trước."};if(D.full)return{cancel:true,toast:"Đã thêm nước tới vạch 100 mL."};D.full=true;ctx.S.tag.do=true;return{fx(B,T){T.setLevel(.85,1.2)},tn:`Thêm nước vào ống đong tới vạch 100 mL, khuấy đều`,ht:`thu được 100 mL dung dịch chứa ${D.v} mL ethanol`,kl:`Độ cồn của dung dịch là ${D.v}°`}}
        return null},
      info(v,S,V){if(v==="tc")return `<div><b>Tính chất của ethanol</b></div><small>Ethanol → ống 2 (nước); sodium → ống 1 (ethanol khan); que đóm cháy thử khí.</small>`;
        if(v==="chay")return `<div><b>Đốt ethanol</b></div><small>Châm lửa, sau đó úp cốc tráng nước vôi trong lên ngọn lửa.</small>`;
        const D=V.c1.data;return `<div><b>Pha dung dịch ethanol</b></div><div>Ethanol: ${D.v?D.v+" mL":"chưa rót"}</div><div>${D.full?`Độ cồn: <b>${D.v}°</b>`:"Thêm nước tới vạch 100 mL để tính độ cồn"}</div><small>Độ cồn = số mL ethanol trong 100 mL hỗn hợp.</small>`},
      onReset(v,S,V){if(!v||v==="chay"){flame.visible=false;cup.visible=false}}};
    let flame,cup,cupT=0;
    L=BL.chemLab(api,def,SPEC);if(!L.BN)return L.mount;
    const K=L.K,R=K.R;
    flame=K.root.add(K3.flame(R,[.35,.55,1],[.75,.88,1]));flame.pos=[0,.13,0];flame.scl=[1.1,.9,1.1];flame.visible=false;
    cup=K.root.add(new G.Node());const cg=cup.add(K3.glass(R,.2,.3));cg.quat=G.Q.euler(Math.PI,0,0);cg.pos=[0,.3,0];const fog=cup.add(R.mesh(G.lathe([[.19,.02],[.19,.28],[0,.29]],32),{color:"#FFFFFF",alpha:0,transparent:true,order:4,side:"double"}));cup.pos=[0,.5,0];cup.visible=false;
    const dish=K.root.add(R.mesh(G.lathe([[0,0],[.09,0],[.1,.01],[.15,.05],[.185,.11],[.19,.125],[.18,.125],[.14,.06],[.09,.03],[0,.03]],40),{color:"#F4F2EC",rough:.25,coat:.6}));dish.pos=[0,0,0];
    /* vạch chia ống đong */
    for(let i=1;i<=10;i++)K.root.add(R.mesh(G.box(i%5?.025:.045,.003,.003,0,1),{color:"#1F2937"})).pos=[2.4+.07,.68*i/10,.07];
    K.onFrame(dt=>{if(flame.visible)flame.scl=[1.1,.9+.06*Math.sin(K.simT*21),1.1];if(cup.visible&&dt>0){cupT+=dt;fog.mat.alpha=Math.min(.55,cupT*.18)}});
    K.start();
    api.vp.__lab={get S(){return L.S},K,st:L.st,goView:v=>K.goView(v),apply:(k,id)=>L.apply(k,L.V[id]),
      auto(){const q=[["etoh","t2"],["na","t1"],["splint","t1"],["lua","d1"],["voi","d1"],["e45","c1"],["nuoc","c1"]];let i=0;const go=()=>{if(i>=q.length)return;if(L.BN.busy())return setTimeout(go,300);L.apply(q[i][0],L.V[q[i][1]]);i++;setTimeout(go,300)};go()}};
    return K.mount(L.st)}
});
})();
