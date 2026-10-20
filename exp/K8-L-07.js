/* K8-L-07 · Tác dụng của dòng điện (SGK KHTN 8 – Kết nối tri thức, Bài 23) · 3D
   Bốn trạm, mỗi trạm một mạch kín: nguồn (2 pin 1,5 V), công tắc, dây nối và:
   1. Tác dụng nhiệt: dây sắt mảnh căng giữa hai cọc, có mẩu giấy vắt lên dây; đóng mạch, dây nóng lên, đỏ dần, giấy cháy sém và đứt.
   2. Tác dụng phát sáng: bóng đèn sợi đốt (dây tóc nóng sáng) và đèn LED (chỉ sáng khi dòng điện đi vào cực dương của LED).
   3. Tác dụng hóa học: hai thỏi than nhúng trong dung dịch copper(II) sulfate; thỏi nối cực âm được phủ lớp đồng màu đỏ, ở thỏi nối cực dương có bọt khí.
   4. Tác dụng từ: cuộn dây quấn quanh lõi sắt (nam châm điện) hút các ghim sắt khi có dòng điện, nhả ra khi ngắt điện. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const XS={nhiet:-4.6,sang:-1.55,hoa:1.55,tu:4.6};

const SPEC={
  predict:[{id:"p1",q:"Dòng điện chạy qua dây sắt mảnh có mẩu giấy vắt lên, sau một lúc:",opts:[["nong","Dây nóng lên, giấy cháy sém"],["lanh","Dây lạnh đi"],["khong","Không có gì thay đổi"]],ans:"nong",res:"Kết quả: dây sắt nóng lên rồi nóng đỏ, mẩu giấy cháy sém và đứt."},
    {id:"p2",q:"Đóng mạch có cuộn dây quấn quanh đinh sắt, đưa lại gần các ghim sắt nhỏ:",opts:[["hut","Đinh sắt hút các ghim"],["day","Đinh sắt đẩy các ghim"],["khong","Không có tác dụng"]],ans:"hut",res:"Kết quả: khi có dòng điện, cuộn dây có lõi sắt trở thành nam châm điện, hút các ghim sắt."}],
  taskLead:"Chọn trạm ở khay. Đóng công tắc để cho dòng điện chạy qua mạch, quan sát rồi ngắt công tắc.",
  tasks:[{html:"<b>Nhiệt:</b> đóng mạch tới khi mẩu giấy trên dây sắt cháy đứt.",done:()=>S.nh.burnt},
    {html:"<b>Phát sáng:</b> đóng mạch có bóng đèn và LED; đảo chiều LED rồi đóng mạch lại.",done:()=>S.sg.okRev&&S.sg.okFwd},
    {html:"<b>Hóa học:</b> cho dòng điện chạy qua dung dịch CuSO₄ ít nhất 2 phút.",done:()=>S.ho.t>=120},
    {html:"<b>Từ:</b> đóng mạch để nam châm điện hút ghim, rồi ngắt mạch.",done:()=>S.tu.rel}],
  obs:[{id:"a",q:"Khi bóng đèn sợi đốt sáng, bóng đèn còn:",opts:[["nong","Nóng lên (tác dụng nhiệt đi kèm tác dụng phát sáng)"],["lanh","Lạnh đi"],["tu","Hút sắt mạnh"]],ans:"nong",why:"Dây tóc bóng đèn bị dòng điện đốt nóng tới nhiệt độ rất cao nên phát sáng."},
    {id:"b",q:"Đèn LED không sáng khi:",opts:[["nguoc","Dòng điện đi vào cực âm của LED (mắc ngược chiều)"],["dung","Dòng điện đi vào cực dương của LED"],["ngan","Dây nối quá ngắn"]],ans:"nguoc",why:"Đèn LED chỉ cho dòng điện đi qua theo một chiều nhất định."},
    {id:"c",q:"Lớp màu đỏ bám vào thỏi than nối với cực âm là:",opts:[["cu","Đồng (copper)"],["fe","Sắt"],["c","Than bị cháy"]],ans:"cu",why:"Dòng điện làm dung dịch muối đồng bị phân tích, đồng tách ra bám vào thỏi than nối cực âm: tác dụng hóa học của dòng điện."},
    {id:"d",q:"Ngắt mạch, các ghim sắt rơi khỏi nam châm điện. Điều đó cho thấy:",opts:[["chi","Nam châm điện chỉ có từ tính khi có dòng điện chạy qua cuộn dây"],["mat","Đinh sắt bị hỏng"],["nhe","Ghim quá nhẹ"]],ans:"chi",why:"Lõi sắt non chỉ bị nhiễm từ khi có dòng điện; ngắt điện, từ tính gần như mất."}],
  concl:{html:`<ul class="tlist"><li><b>Tác dụng nhiệt:</b> dòng điện chạy qua vật dẫn làm vật dẫn nóng lên (bàn là, ấm điện, nồi cơm điện, máy sấy tóc).</li>
    <li><b>Tác dụng phát sáng:</b> dòng điện làm sáng bóng đèn sợi đốt, đèn LED, đèn ống.</li>
    <li><b>Tác dụng hóa học:</b> dòng điện đi qua dung dịch muối đồng làm đồng tách ra bám vào điện cực nối với cực âm (mạ điện).</li>
    <li><b>Tác dụng từ:</b> cuộn dây có dòng điện (nam châm điện) hút các vật bằng sắt, thép; làm quay kim nam châm (chuông điện, cần cẩu điện, loa).</li>
    <li><b>Tác dụng sinh lí:</b> dòng điện qua cơ thể người làm co cơ, có thể gây bỏng, ngừng tim, ngừng thở; được ứng dụng có kiểm soát trong y học (máy kích tim). Không chạm vào ổ điện, dây điện hở.</li></ul>`,
    quiz:[{id:"q1",q:"Thiết bị nào hoạt động chủ yếu dựa vào tác dụng nhiệt của dòng điện?",opts:[["a","Ấm điện"],["b","Quạt điện"],["c","Chuông điện"]],ans:"a",why:{b:"Quạt điện dựa vào tác dụng từ (động cơ điện).",c:"Chuông điện dựa vào tác dụng từ."}},
      {id:"q2",q:"Mạ vàng, mạ bạc đồ trang sức dựa vào:",opts:[["a","Tác dụng hóa học của dòng điện"],["b","Tác dụng phát sáng"],["c","Tác dụng sinh lí"]],ans:"a",why:{b:"Mạ điện dựa vào tác dụng hóa học.",c:"Mạ điện dựa vào tác dụng hóa học."}},
      {id:"q3",q:"Khi thấy người bị điện giật, việc đầu tiên cần làm là:",opts:[["a","Ngắt nguồn điện (cầu dao, aptomat) hoặc dùng vật cách điện khô tách người bị nạn khỏi dây điện"],["b","Dùng tay kéo người bị nạn ra"],["c","Dội nước vào người bị nạn"]],ans:"a",why:{b:"Chạm trực tiếp, chính mình cũng bị điện giật.",c:"Nước dẫn điện, rất nguy hiểm."}}],
    done:`<h2>Hoàn thành: Tác dụng của dòng điện</h2><p class="muted">Nhiệt, phát sáng, hóa học, từ, sinh lí.</p>`},
  gv:["Ở trạm nhiệt, hỏi: vì sao dây dẫn điện trong nhà dùng đồng, còn dây đốt nóng của bàn là dùng hợp kim nichrome?","Ở trạm LED, cho học sinh chỉ ra chân dài (cực dương) của LED.","An toàn khi làm thật: chỉ dùng pin; không dùng điện lưới 220 V; dây sắt nóng đỏ có thể gây bỏng."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 23)</p><ul class="tlist"><li>Thực hiện thí nghiệm để nêu được các tác dụng cơ bản của dòng điện: nhiệt, phát sáng, hóa học, từ, sinh lí.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 23 Tác dụng của dòng điện.</li>
<li>Điện phân dung dịch CuSO₄ với điện cực than: đồng bám ở cực âm, khí oxygen thoát ra ở cực dương: <a href="https://chem.libretexts.org/Bookshelves/General_Chemistry/Chemistry_2e_(OpenStax)/17%3A_Electrochemistry/17.07%3A_Electrolysis" target="_blank" rel="noopener">OpenStax Chemistry 2e, mục 17.7</a>.</li>
<li>Kim loại bắt đầu phát sáng đỏ sẫm từ khoảng 500 °C (điểm Draper); giấy tự bốc cháy ở khoảng 230 °C: giá trị tham khảo phổ biến.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Nhiệt độ dây sắt, tốc độ đồng bám và lực hút của nam châm điện là mô hình định tính. Thời gian ở trạm hóa học được tua nhanh 20 lần.</li></ul>`;

let S;
LabKHTN.register("K8-L-07",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tram",t:"Tác dụng"},{k:"tn",t:"Làm gì"},{k:"kq",t:"Hiện tượng"}],empty:"Hiện tượng tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const V=(k,o)=>Object.assign({t:[XS[k]+.02,.16,.05],yaw:0,pitch:.62,rad:.78},o);
    const K=KIT.scene3D(api,{aria:"Bàn thí nghiệm 3D các tác dụng của dòng điện",legend:{w:250},bench:[12,2.6],seed:23,
      views:{nhiet:V("nhiet",{label:"Nhiệt",icon:IC.fire}),sang:V("sang",{label:"Phát sáng",icon:IC.sun}),hoa:V("hoa",{t:[XS.hoa+.02,.24,.05],pitch:.5,label:"Hóa học",icon:IC.beaker}),tu:V("tu",{label:"Từ",icon:IC.bolt})}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,rnd=K.rnd;
    S={nh:{on:false,T:25,burnt:false,char:0,rec:false},sg:{on:false,rev:false,okFwd:false,okRev:false,f:25},ho:{on:false,t:0,cu:0,rec:false},tu:{on:false,clips:[],grab:false,rel:false,rec:false},recs:0};
    const rec=(tram,tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tram,tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const metal={color:"#B9C0C8",metal:.85,rough:.3},copper={color:"#C77A43",metal:.85,rough:.32},plasticB={color:"#20232A",rough:.5},plasticR={color:"#C62828",rough:.45};
    /* ---------- linh kiện dùng chung ---------- */
    function battery(x,z){const n=root.add(new G.Node());n.pos=[x,0,z];
      n.add(R.mesh(G.box(.36,.09,.2,.02,3),{color:"#2B2F38",rough:.6})).pos=[0,.045,0];
      for(const dx of [-.085,.085]){const c=n.add(new G.Node());c.pos=[dx,.12,0];c.quat=G.Q.euler(0,0,Math.PI/2);
        c.add(R.mesh(G.cylinder(.07,.3,24),{color:"#1C1C1C",rough:.35,coat:.5})).pos=[0,-.15,0];c.add(R.mesh(G.cylinder(.071,.08,24),{color:"#C8A23A",metal:.6,rough:.35})).pos=[0,.07,0];
        c.add(R.mesh(G.cylinder(.022,.02,12),metal)).pos=[0,.15,0]}
      n.add(R.mesh(G.cylinder(.018,.04,10),plasticR)).pos=[-.2,.06,.07];n.add(R.mesh(G.cylinder(.018,.04,10),plasticB)).pos=[-.2,.06,-.07];
      return{n,p:[x-.2,.1,z+.07],m:[x-.2,.1,z-.07]}}
    function sw(x,z){const n=root.add(new G.Node());n.pos=[x,0,z];n.add(R.mesh(G.box(.26,.03,.12,.01,2),{color:"#E9E4D8",rough:.6})).pos=[0,.015,0];
      for(const dx of [-.09,.09])n.add(R.mesh(G.cylinder(.018,.04,10),metal)).pos=[dx,.03,0];
      const lev=n.add(new G.Node());lev.pos=[-.09,.06,0];lev.add(R.mesh(G.box(.2,.012,.03,.005,2),metal)).pos=[.1,0,0];lev.add(R.mesh(G.sphere(.022,12,8),plasticB)).pos=[.2,.0,0];
      return{n,lev,a:[x-.09,.07,z],b:[x+.09,.07,z],set(on){lev.quat=G.Q.euler(0,0,on?-.03:.55)}}}
    const wire=(pts,col)=>root.add(R.mesh(G.tube(G.spline(pts,8),.012,8),{color:col||"#D32F2F",rough:.45,coat:.3}));
    const up=(p,h)=>[p[0],p[1]+h,p[2]];
    /* ================= 1. nhiệt ================= */
    const X1=XS.nhiet;const b1=battery(X1-.55,-.12),s1=sw(X1-.2,.3);s1.set(false);
    const posts=[[X1-.02,0,.02],[X1+.62,0,.02]];for(const p of posts){root.add(R.mesh(G.cylinder(.03,.32,14),{color:"#7A5232",rough:.6})).pos=p;root.add(R.mesh(G.cylinder(.022,.03,10),metal)).pos=[p[0],.32,p[2]]}
    const fePts=[];for(let i=0;i<=40;i++){const t=i/40;fePts.push([posts[0][0]+(posts[1][0]-posts[0][0])*t,.33-.012*Math.sin(Math.PI*t),.02])}
    const feM=root.add(R.mesh(G.tube(fePts,.006,8),{color:"#6E747C",metal:.7,rough:.4}));
    const glowM=root.add(R.mesh(G.tube(fePts,.016,8),{type:"unlit",color:"#FF6A1A",alpha:0,transparent:true,order:5,depth:false}));
    const paper=root.add(new G.Node());paper.pos=[X1+.3,.33,.02];const papL=paper.add(R.mesh(G.box(.012,.12,.06,.003,1),{color:"#F4F1E6",rough:.85,side:"double"}));papL.pos=[-.008,-.06,0];papL.quat=G.Q.euler(0,0,.12);
    const papR=paper.add(R.mesh(G.box(.012,.12,.06,.003,1),{color:"#F4F1E6",rough:.85,side:"double"}));papR.pos=[.008,-.06,0];papR.quat=G.Q.euler(0,0,-.12);
    const smoke=root.add(K3.puffs(R,80,"#BDBDBD"));
    wire([b1.p,[X1-.45,.08,.0],[X1-.15,.06,-.05],up(posts[0],.33)]);wire([b1.m,[X1-.5,.04,.12],s1.a],"#212121");wire([s1.b,[X1+.2,.04,.3],[X1+.6,.05,.2],up(posts[1],.33)],"#212121");
    /* ================= 2. phát sáng ================= */
    const X2=XS.sang;const b2=battery(X2-.55,-.12),s2=sw(X2-.2,.3);s2.set(false);
    /* bóng đèn sợi đốt trên đế */
    const bulbP=[X2+.12,0,.02];root.add(R.mesh(G.cylinder(.06,.06,20),{color:"#3B3F46",rough:.5})).pos=bulbP;root.add(R.mesh(G.cylinder(.045,.08,20),{color:"#C9CDD2",metal:.8,rough:.3})).pos=[bulbP[0],.06,bulbP[2]];
    root.add(R.mesh(G.sphere(.11,28,20),{type:"glass",color:"#F6FBFF",alpha:.35})).pos=[bulbP[0],.24,bulbP[2]];
    const fil=[];for(let i=0;i<=40;i++){const t=i/40;fil.push([bulbP[0]-.04+.08*t,.24+.008*Math.sin(t*Math.PI*14),bulbP[2]+.008*Math.cos(t*Math.PI*14)])}
    const filM=root.add(R.mesh(G.tube(fil,.0035,5),{color:"#5B5B5B",metal:.6}));root.add(R.mesh(G.tube([[bulbP[0]-.04,.24,bulbP[2]],[bulbP[0]-.03,.14,bulbP[2]]],.002,4),{color:"#777"}));root.add(R.mesh(G.tube([[bulbP[0]+.04,.24,bulbP[2]],[bulbP[0]+.03,.14,bulbP[2]]],.002,4),{color:"#777"}));
    const halo=root.add(R.mesh(G.sphere(.2,20,14),{type:"unlit",color:"#FFE7A0",alpha:0,transparent:true,order:6,depth:false}));halo.pos=[bulbP[0],.24,bulbP[2]];
    /* đèn LED: chân dài là cực dương */
    const ledP=[X2+.52,0,.02];const led=root.add(new G.Node());led.pos=ledP;
    led.add(R.mesh(G.box(.12,.025,.08,.01,2),{color:"#2E7D32",rough:.6})).pos=[0,.012,0];
    const ledDome=led.add(R.mesh(G.lathe([[.032,0],[.032,.06],[.028,.075],[.018,.088],[0,.094]],24),{type:"glass",color:"#FF5252",alpha:.7}));ledDome.pos=[0,.14,0];
    led.add(R.mesh(G.cylinder(.036,.008,24),{type:"glass",color:"#FF5252",alpha:.7})).pos=[0,.135,0];
    led.add(R.mesh(G.tube([[-.014,.025,0],[-.014,.135,0]],.0025,4),metal));led.add(R.mesh(G.tube([[.014,.025,0],[.014,.135,0]],.0025,4),metal));
    const ledGlow=led.add(R.mesh(G.sphere(.075,18,12),{type:"unlit",color:"#FF3B30",alpha:0,transparent:true,order:6,depth:false}));ledGlow.pos=[0,.19,0];
    const ledCore=led.add(R.mesh(G.sphere(.016,12,8),{type:"unlit",color:"#FF8A80"}));ledCore.pos=[0,.17,0];
    wire([b2.p,[X2-.45,.08,0],[X2-.1,.05,-.05],[bulbP[0]-.05,.04,bulbP[2]]]);wire([[bulbP[0]+.05,.04,bulbP[2]],[X2+.32,.04,-.06],[ledP[0]-.06,.03,ledP[2]]],"#F57C00");
    wire([b2.m,[X2-.5,.04,.12],s2.a],"#212121");wire([s2.b,[X2+.2,.04,.32],[ledP[0]+.1,.04,.22],[ledP[0]+.06,.03,ledP[2]]],"#212121");
    /* ================= 3. hóa học ================= */
    const X3=XS.hoa;const b3=battery(X3-.6,-.12),s3=sw(X3-.22,.32);s3.set(false);
    const BKP=[X3+.32,0,0];const bk=root.add(K3.glass(R,.24,.42));bk.pos=BKP;
    const liq=root.add(K3.liquid(R,.225,.02,.3,H("#2F7FD8"),.5));liq.pos=BKP;
    const rodC=[[BKP[0]-.09,0,BKP[2]],[BKP[0]+.09,0,BKP[2]]];   /* trái: nối cực dương (anode), phải: nối cực âm (cathode) */
    rodC.forEach(p=>root.add(R.mesh(G.cylinder(.022,.5,16),{color:"#2C2C2C",rough:.85})).pos=[p[0],.06,p[2]]);
    root.add(R.mesh(G.box(.36,.025,.08,.008,2),{color:"#8D6E63",rough:.6})).pos=[BKP[0],.47,BKP[2]];
    const cuCoat=root.add(R.mesh(G.cylinder(.026,.26,16),{color:"#D2693C",metal:.55,rough:.35}));cuCoat.pos=[rodC[1][0],.05,rodC[1][2]];
    const bub=root.add(K3.bubbles(R,260));
    wire([b3.p,[X3-.45,.1,0],[X3-.05,.45,-.05],[rodC[0][0],.56,rodC[0][2]]]);wire([b3.m,[X3-.55,.04,.12],s3.a],"#212121");wire([s3.b,[X3+.1,.05,.36],[X3+.62,.3,.2],[X3+.6,.58,.02],[rodC[1][0],.56,rodC[1][2]]],"#212121");
    /* ================= 4. từ ================= */
    const X4=XS.tu;const b4=battery(X4-.6,-.12),s4=sw(X4-.22,.32);s4.set(false);
    const nail=root.add(new G.Node());nail.pos=[X4+.35,.3,.02];nail.quat=G.Q.euler(0,0,0);
    nail.add(R.mesh(G.cylinder(.012,.42,12),{color:"#9AA1A9",metal:.85,rough:.3})).pos=[0,-.3,0];nail.add(R.mesh(G.cylinder(.03,.012,16),{color:"#9AA1A9",metal:.85,rough:.3})).pos=[0,.12,0];
    const coil=[];for(let i=0;i<=600;i++){const t=i/600;const a=t*Math.PI*2*60;coil.push([Math.cos(a)*.024,-.22+t*.28,Math.sin(a)*.024])}nail.add(R.mesh(G.tube(coil,.0035,5),copper));
    /* giá đỡ đinh */
    root.add(R.mesh(G.cylinder(.012,.42,10),{color:"#4B5563",metal:.5})).pos=[X4+.6,0,.02];root.add(R.mesh(G.box(.16,.02,.12,.006,2),{color:"#374151",metal:.4,rough:.5})).pos=[X4+.63,.01,.02];root.add(R.mesh(G.tube([[X4+.6,.41,.02],[X4+.35,.41,.02],[X4+.35,.42,.02]],.01,8),{color:"#4B5563",metal:.5}));
    const clipG=(()=>{const pts=[];for(let i=0;i<=40;i++){const t=i/40*Math.PI*3.4;pts.push([Math.cos(t)*.012*(1-i/120),-.025+i/40*.05,Math.sin(t)*.012*(1-i/120)*.25])}return G.tube(pts,.0022,4)})();
    for(let i=0;i<9;i++){const m=root.add(R.mesh(clipG,{color:"#C0C6CC",metal:.85,rough:.3}));const p0=[X4+.35+(rnd()-.5)*.24,.005,.04+(rnd()-.5)*.18];m.pos=p0;m.quat=G.Q.euler(Math.PI/2,rnd()*3,0);S.tu.clips.push({m,p0,p:p0.slice(),t:0,stuck:false,i})}
    wire([b4.p,[X4-.45,.1,0],[X4+.05,.3,-.05],[X4+.33,.1,.02]],"#D32F2F");wire([b4.m,[X4-.55,.04,.12],s4.a],"#212121");wire([s4.b,[X4+.1,.05,.34],[X4+.25,.3,.15],[X4+.37,.36,.02]],"#212121");

    /* ================= nhãn ================= */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));
    for(const k in XS){const B=[b1,b2,b3,b4][Object.keys(XS).indexOf(k)],W=[s1,s2,s3,s4][Object.keys(XS).indexOf(k)];lab("Nguồn điện (2 pin)",[B.n.pos[0],.2,B.n.pos[2]],k,{dir:"w",len:30});lab("Công tắc",[W.n.pos[0],.08,W.n.pos[2]],k,{dir:"s",len:24})}
    lab("Dây sắt mảnh",[X1+.52,.33,.02],"nhiet",{dir:"ne",len:40});const lPap=lab("Mẩu giấy",()=>[X1+.3,paper.pos[1]-.08,.04],"nhiet",{dir:"s",len:50});
    lab("Bóng đèn sợi đốt",[bulbP[0],.34,bulbP[2]],"sang",{dir:"n",len:30});const lLed=lab("",[ledP[0],.24,ledP[2]],"sang",{dir:"ne",len:30});
    lab("Dung dịch CuSO₄",[BKP[0]+.22,.15,BKP[2]+.08],"hoa",{dir:"se",len:30});lab("Thỏi than nối cực âm",[rodC[1][0],.5,rodC[1][2]],"hoa",{dir:"ne",len:30});lab("Thỏi than nối cực dương",[rodC[0][0],.5,rodC[0][2]],"hoa",{dir:"nw",len:30});
    lab("Nam châm điện (cuộn dây quấn quanh đinh sắt)",[X4+.37,.2,.02],"tu",{dir:"ne",len:50});lab("Ghim sắt",[X4+.45,.01,.12],"tu",{dir:"se",len:30});

    /* ================= cập nhật ================= */
    const heatCol=T=>{const t=C.clamp((T-480)/350,0,1);return t<.5?C.mix("#5A1A0A","#E2420F",t*2):C.mix("#E2420F","#FFB347",(t-.5)*2)};
    K.onFrame((dt)=>{
      /* nhiệt */
      const N=S.nh;s1.set(N.on);const Tt=N.on?720:25;N.T+=(Tt-N.T)*(1-Math.exp(-dt/(N.on?2.4:3.5)));
      const g=C.clamp((N.T-480)/300,0,1);glowM.mat.alpha=g*.85;glowM.mat.color=H(heatCol(N.T));feM.mat.color=H(N.T>480?heatCol(N.T):C.mix("#6E747C","#4A2A1E",C.clamp((N.T-200)/280,0,1)));
      if(!N.burnt&&N.T>230&&dt>0){N.char=Math.min(1,N.char+dt*.35);if(rnd()<dt*14)smoke.spawn([X1+.3+(rnd()-.5)*.02,.34,.02],.02,[0,.25,0],1.4,.35);
        papL.mat.color=papR.mat.color=H(C.mix("#F4F1E6","#3A2A1A",N.char));if(N.char>=1){N.burnt=true;if(!N.rec){N.rec=true;rec("Nhiệt","Đóng mạch: dòng điện chạy qua dây sắt mảnh có vắt mẩu giấy","dây sắt nóng lên rồi nóng đỏ; mẩu giấy cháy sém, đứt rơi xuống");refresh()}}}
      if(N.burnt){paper.pos=[X1+.3,Math.max(.006,paper.pos[1]-dt*.6),.02];paper.quat=G.Q.euler(paper.pos[1]<.01?1.4:0,0,0)}
      smoke.step(dt);
      /* phát sáng */
      const L=S.sg;s2.set(L.on);const ledOn=L.on&&!L.rev;const tgt=L.on?(L.rev?25:2300):25;L.f+=(tgt-L.f)*(1-Math.exp(-dt/.25));
      const fg=C.clamp((L.f-900)/1300,0,1);filM.mat.color=H(fg>0?C.mix("#FF8A3D","#FFF4C2",fg):"#5B5B5B");halo.mat.alpha=fg*.55;
      ledGlow.mat.alpha=ledOn?.55:0;ledCore.mat.color=H(ledOn?"#FFFFFF":"#7A1E1E");led.quat=G.Q.euler(0,L.rev?Math.PI:0,0);
      lLed.set(`Đèn LED (${L.rev?"mắc ngược":"mắc đúng chiều"})`);
      /* hóa học */
      const Ho=S.ho;s3.set(Ho.on);if(Ho.on&&dt>0){Ho.t+=dt*20;Ho.cu=Math.min(1,Ho.t/600);
        if(rnd()<dt*30)bub.spawn([rodC[0][0]+(rnd()-.5)*.03,.05+rnd()*.2,rodC[0][2]+(rnd()-.5)*.03],.006+rnd()*.005,[0,.25+rnd()*.1,0],1.0,.8);
        if(Ho.t>=120&&!Ho.rec){Ho.rec=true;rec("Hóa học","Cho dòng điện chạy qua dung dịch CuSO₄ (hai thỏi than) khoảng 2 phút","thỏi than nối cực âm được phủ một lớp màu đỏ (đồng); ở thỏi than nối cực dương có bọt khí; màu xanh của dung dịch nhạt dần");refresh()}}
      bub.step(dt,b=>{if(b.p[1]>.29)b.age=b.life});cuCoat.visible=Ho.cu>.015;cuCoat.mat.color=H(C.mix("#3A2A22","#D2693C",Math.min(1,Ho.cu*2.5)));liq.mat.color=H(C.mix("#2F7FD8","#9EC9F0",Ho.cu*.6));
      /* từ */
      const T4=S.tu;s4.set(T4.on);const tip=[X4+.35,.08,.02];let n=0;
      for(const c of T4.clips){if(T4.on){if(!c.stuck){const d=V3.dist(c.p,tip);if(d<.32){c.t+=dt;const k=C.clamp(c.t*2.2,0,1);const tg=[tip[0]+Math.cos(c.i)*.02,tip[1]-.035-(n%3)*.03,tip[2]+Math.sin(c.i)*.02];c.p=V3.lerp(c.p,tg,k*k);if(k>=1)c.stuck=true}}}
        else{c.stuck=false;c.t=0;c.p=[c.p[0],Math.max(c.p0[1],c.p[1]-dt*1.6),c.p[2]];if(c.p[1]<=c.p0[1]+.001)c.p=c.p0.slice()}
        if(c.stuck)n++;c.m.pos=c.p}
      if(T4.on&&n>=3&&!T4.grab){T4.grab=true;rec("Từ","Đóng mạch: dòng điện chạy qua cuộn dây quấn quanh đinh sắt",`đinh sắt hút ${n} ghim sắt`);refresh()}
      if(!T4.on&&T4.grab&&!T4.rel){T4.rel=true;rec("Từ","Ngắt mạch","các ghim sắt rơi xuống: nam châm điện mất từ tính");refresh()}
      T4.n=n});

    /* ================= khay ================= */
    const key={nhiet:"nh",sang:"sg",hoa:"ho",tu:"tu"};
    K.dockFn(()=>{const v=K.view,X=S[key[v]];const it=[{k:"sw",label:X.on?"Ngắt công tắc":"Đóng công tắc",icon:X.on?IC.ban:IC.bolt,on:X.on}];
      if(v==="sang")it.push({k:"rev",label:"Đảo chiều LED",icon:IC.swap,dis:S.sg.on});
      it.push({k:"rs",label:"Làm lại trạm",icon:IC.reset});return it});
    K.onDock(k=>{const v=K.view,X=S[key[v]];
      if(k==="sw"){X.on=!X.on;if(!api.time.playing&&X.on)api.toast("Đang tạm dừng: bấm ▶ để chạy.","info",1600);
        if(v==="sang"&&X.on){setTimeout(()=>{if(K.dead||!S.sg.on)return;if(!S.sg.rev&&!S.sg.okFwd){S.sg.okFwd=true;rec("Phát sáng","Đóng mạch có bóng đèn sợi đốt và đèn LED mắc đúng chiều","dây tóc bóng đèn nóng sáng; đèn LED sáng");refresh()}
          if(S.sg.rev&&!S.sg.okRev){S.sg.okRev=true;rec("Phát sáng","Đảo chiều đèn LED rồi đóng mạch","bóng đèn sợi đốt và đèn LED đều không sáng: LED không cho dòng điện đi qua theo chiều ngược nên cả mạch không có dòng điện");refresh()}},900)}}
      else if(k==="rev")S.sg.rev=!S.sg.rev;
      else if(k==="rs"){if(v==="nhiet"){S.nh={on:false,T:25,burnt:false,char:0,rec:S.nh.rec};paper.pos=[X1+.3,.33,.02];paper.quat=G.Q.euler(0,0,0);papL.mat.color=papR.mat.color=H("#F4F1E6")}
        else if(v==="sang")Object.assign(S.sg,{on:false,rev:false});else if(v==="hoa")S.ho={on:false,t:0,cu:0,rec:S.ho.rec};else Object.assign(S.tu,{on:false})}
      refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="nhiet"){const N=S.nh;return `<div><b>Tác dụng nhiệt</b></div><div>Công tắc: ${N.on?"đóng (có dòng điện)":"ngắt"}</div><div>Nhiệt độ dây sắt ≈ ${fmt(N.T,0)} °C</div><small>${N.T>480?"Dây nóng đỏ.":N.burnt?"Mẩu giấy đã cháy đứt.":"Giấy cháy sém khi dây nóng trên khoảng 230 °C."}</small>`}
      if(v==="sang"){const L=S.sg;return `<div><b>Tác dụng phát sáng</b></div><div>Công tắc: ${L.on?"đóng":"ngắt"} · LED ${L.rev?"mắc ngược":"mắc đúng chiều"}</div><div>${L.on?(L.rev?"Mạch không có dòng điện: đèn không sáng":"Bóng đèn và LED đều sáng"):"Chưa có dòng điện"}</div><small>Chân dài của LED là cực dương, phải nối về phía cực dương của nguồn.</small>`}
      if(v==="hoa"){const Ho=S.ho;return `<div><b>Tác dụng hóa học</b> · tua nhanh ×20</div><div>Thời gian thật: ${fmt(Ho.t/60,1)} phút</div><div>Lớp đồng trên thỏi than (cực âm): ${Ho.cu<.02?"chưa thấy":Ho.cu<.4?"mỏng":"rõ, màu đỏ"}</div><small>Bọt khí ở thỏi than nối cực dương.</small>`}
      return `<div><b>Tác dụng từ</b></div><div>Công tắc: ${S.tu.on?"đóng":"ngắt"}</div><div>Số ghim bị hút: ${S.tu.n||0}</div><small>Cuộn dây có dòng điện quấn quanh lõi sắt là nam châm điện.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.onReset(()=>{});
    /* trạm tự động */K.autoStations&&K.autoStations();
    /* điểm chạm */K.hotFn&&K.hotFn(()=>Object.keys(XS).map((k,i)=>{const W=[s1,s2,s3,s4][i];return{k:"sw",p:[W.n.pos[0],.06,W.n.pos[2]],tip:S[key[k]].on?"Chạm để ngắt công tắc":"Chạm để đóng công tắc",view:k}}));
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),
      auto(){S.nh.on=true;S.ho.on=true;S.tu.on=true;S.sg.on=true;S.sg.okFwd=true;rec("Phát sáng","Đóng mạch (LED đúng chiều)","bóng đèn và LED sáng");
        setTimeout(()=>{S.sg.on=false;S.sg.rev=true;S.sg.okRev=true;rec("Phát sáng","Đảo chiều LED","không sáng");S.tu.on=false;refresh()},9000);refresh()}};
    return K.mount(st)}
});
})();
