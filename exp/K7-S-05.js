/* K7-S-05 · Cảm ứng ở thực vật – tua nhanh thời gian (SGK KHTN 7 – Kết nối tri thức, Bài 33–35) · 2D
   1. Tính hướng sáng: cây non trồng trong hộp kín có một khe sáng ở bên – ngọn cây mọc cong về phía ánh sáng.
   2. Tính hướng nước và hướng trọng lực: rễ cây con mọc hướng xuống đất và hướng về phía có nước.
   3. Tính hướng tiếp xúc: tua cuốn của cây đậu quấn quanh cọc khi chạm vào cọc.
   4. Cây trinh nữ: khi bị chạm, các lá chét cụp lại lần lượt; sau một thời gian lá xòe ra trở lại.
   Mỗi phần có nút tua nhanh thời gian; mức độ cong là hình mô phỏng xu hướng. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const PARTS={sang:{t:"Hướng sáng",days:5},nuoc:{t:"Hướng nước, hướng trọng lực",days:6},tx:{t:"Hướng tiếp xúc",days:4}};
const SPEC={
  predict:[{id:"p1",q:"Cây trồng trong hộp kín có khe sáng ở bên phải sẽ:",opts:[["phai","Ngọn mọc cong về bên phải (về phía ánh sáng)"],["thang","Mọc thẳng đứng"],["trai","Cong sang trái"]],ans:"phai",res:"Kết quả: thân cây có tính hướng sáng."},
    {id:"p2",q:"Rễ cây mọc như thế nào khi một bên đất ẩm, một bên khô?",opts:[["am","Hướng về phía đất ẩm"],["kho","Hướng về phía đất khô"],["k","Mọc thẳng, không đổi hướng"]],ans:"am",res:"Kết quả: rễ cây có tính hướng nước."}],
  taskLead:"Chọn phần ở khay. Bấm “Tua nhanh” để xem nhiều ngày diễn ra trong vài giây. Ở phần “Cây trinh nữ”, chạm vào lá.",
  tasks:[{html:"<b>Hướng sáng:</b> tua nhanh hết 5 ngày.",done:()=>S.p.sang.t>=1},{html:"<b>Hướng nước, trọng lực:</b> tua nhanh hết 6 ngày.",done:()=>S.p.nuoc.t>=1},{html:"<b>Hướng tiếp xúc:</b> tua nhanh hết 4 ngày.",done:()=>S.p.tx.t>=1},{html:"<b>Cây trinh nữ:</b> chạm vào lá và quan sát.",done:()=>S.mim.n>=1}],
  obs:[{id:"a",q:"Cảm ứng ở sinh vật là:",opts:[["ok","Khả năng tiếp nhận và phản ứng với các kích thích từ môi trường"],["sinh","Khả năng sinh sản"],["lon","Khả năng lớn lên"]],ans:"ok",why:"Nhờ cảm ứng, sinh vật thích nghi với môi trường."},
    {id:"b",q:"Tua cuốn của cây đậu quấn quanh cọc là ví dụ về:",opts:[["ok","Tính hướng tiếp xúc"],["sang","Tính hướng sáng"],["nuoc","Tính hướng nước"]],ans:"ok",why:"Phía tua tiếp xúc với cọc sinh trưởng chậm hơn phía đối diện nên tua cong quấn quanh cọc."},
    {id:"c",q:"Rễ cây mọc hướng xuống dưới thể hiện:",opts:[["ok","Tính hướng trọng lực (hướng đất)"],["sang","Tính hướng sáng"],["tx","Tính hướng tiếp xúc"]],ans:"ok",why:"Thân cây thì mọc ngược hướng trọng lực."}],
  concl:{html:`<ul class="tlist"><li><b>Cảm ứng</b> là khả năng tiếp nhận và phản ứng của sinh vật với các kích thích từ môi trường (ánh sáng, nước, trọng lực, tiếp xúc, hóa chất…).</li>
    <li>Ở thực vật: thân có tính hướng sáng; rễ có tính hướng nước, hướng trọng lực (hướng đất); tua cuốn có tính hướng tiếp xúc. Một số cây như trinh nữ cụp lá khi bị chạm.</li>
    <li>Vai trò: giúp cây thích nghi với sự thay đổi của môi trường, tồn tại và phát triển. Ứng dụng: làm giàn cho cây leo, tưới nước, bón phân hợp lí để rễ phát triển.</li></ul>`,
    quiz:[{id:"q1",q:"Vì sao trồng cây leo (mướp, bầu) người ta làm giàn?",opts:[["a","Lợi dụng tính hướng tiếp xúc để cây leo lên, nhận nhiều ánh sáng"],["b","Để rễ hút nhiều nước"],["c","Để cây ra hoa nhanh"]],ans:"a",why:{b:"Giàn không liên quan đến hút nước.",c:"Giàn chủ yếu giúp thân leo vươn lên."}},
      {id:"q2",q:"Cây đặt cạnh cửa sổ thường mọc nghiêng ra phía cửa sổ do:",opts:[["a","Tính hướng sáng"],["b","Tính hướng nước"],["c","Gió"]],ans:"a",why:{b:"Hướng nước thể hiện ở rễ.",c:"Gió không phải nguyên nhân chính."}}],
    done:`<h2>Hoàn thành: cảm ứng ở thực vật</h2><p class="muted">Hướng sáng, hướng nước, hướng trọng lực, hướng tiếp xúc; cây trinh nữ cụp lá khi chạm.</p>`},
  gv:["Có thể làm thật: gieo hạt đậu trong hộp giấy có khoét lỗ, quan sát sau 5 – 7 ngày.","Hỏi: vì sao rễ và thân phản ứng ngược nhau với trọng lực?","Tổ chức cho học sinh chạm lá trinh nữ và đếm thời gian lá xòe lại."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 33 – 35)</p><ul class="tlist"><li>Phát biểu được khái niệm cảm ứng ở sinh vật; nêu được vai trò của cảm ứng; lấy được ví dụ về các hiện tượng cảm ứng ở thực vật (hướng sáng, hướng nước, hướng tiếp xúc); thực hành quan sát và mô tả được hiện tượng cảm ứng ở thực vật.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 33 Cảm ứng ở sinh vật và tập tính ở động vật; Bài 35 Thực hành: Cảm ứng ở sinh vật.</li>
<li>Các kiểu vận động hướng ở thực vật: <a href="https://openstax.org/books/biology-2e/pages/30-6-plant-sensory-systems-and-responses" target="_blank" rel="noopener">OpenStax Biology 2e, mục 30.6</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Hình ảnh tua nhanh là mô phỏng; số ngày, mức độ cong và tốc độ cụp/xòe lá trinh nữ chỉ minh họa xu hướng, phụ thuộc loài cây và điều kiện thực tế.</li></ul>`;

let S;
LabKHTN.register("K7-S-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tn",t:"Thí nghiệm"},{k:"kt",t:"Kích thích"},{k:"pu",t:"Phản ứng của cây"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng tua nhanh cảm ứng ở thực vật",views:{sang:{label:"Hướng sáng",icon:IC.sun,frame:[40,40,920,560]},nuoc:{label:"Hướng nước",icon:IC.drop,frame:[40,40,920,560]},tx:{label:"Hướng tiếp xúc",icon:IC.hand,frame:[40,40,920,560]},mim:{label:"Cây trinh nữ",icon:IC.cell,frame:[40,40,920,560]}}});
    S={p:{sang:{t:0,run:false},nuoc:{t:0,run:false,side:"trai"},tx:{t:0,run:false}},mim:{n:0,touch:-99},recs:0};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    const ease=t=>t*t*(3-2*t);const HI=()=>K.day?"#B45309":"#FCD34D";
    function leaf(ctx,x,y,a,L,c){ctx.save();ctx.translate(x,y);ctx.rotate(a);const g=ctx.createLinearGradient(0,-L*.3,0,L*.3);g.addColorStop(0,C.mix(c,"#FFFFFF",.2));g.addColorStop(1,C.mix(c,"#000000",.25));ctx.fillStyle=g;
      ctx.beginPath();ctx.moveTo(0,0);ctx.bezierCurveTo(L*.3,-L*.36,L*.8,-L*.3,L,0);ctx.bezierCurveTo(L*.8,L*.3,L*.3,L*.36,0,0);ctx.fill();ctx.strokeStyle="rgba(255,255,255,.35)";ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(L*.95,0);ctx.stroke();ctx.restore()}
    function pot(ctx,x,y,w){ctx.fillStyle="#B45309";ctx.beginPath();ctx.moveTo(x-w/2,y);ctx.lineTo(x+w/2,y);ctx.lineTo(x+w*.38,y+w*.75);ctx.lineTo(x-w*.38,y+w*.75);ctx.closePath();ctx.fill();ctx.fillStyle="#92400E";ctx.fillRect(x-w/2-6,y-6,w+12,14);ctx.fillStyle="#3F2A1C";ctx.fillRect(x-w/2+4,y-10,w-8,6)}
    /* thân cong: tích phân hướng theo chiều dài */
    function stemPath(x0,y0,L,bend,n){const P=[[x0,y0]];let a=-Math.PI/2;const ds=L/n;for(let i=0;i<n;i++){const f=i/n;a+=bend*ds*(.25+1.6*f*f)/L;P.push([P[i][0]+Math.cos(a)*ds,P[i][1]+Math.sin(a)*ds])}return P}
    function drawStem(ctx,P,w,c){ctx.strokeStyle=c;ctx.lineCap="round";ctx.lineJoin="round";for(let i=0;i<P.length-1;i++){ctx.lineWidth=w*(1-.55*i/P.length);ctx.beginPath();ctx.moveTo(P[i][0],P[i][1]);ctx.lineTo(P[i+1][0],P[i+1][1]);ctx.stroke()}}
    /* ---------- 1. hướng sáng ---------- */
    function drawSang(ctx,P){const t=ease(S.p.sang.t);const bx=230,by=110,bw=520,bh=440;
      ctx.fillStyle="#3F3A33";C.rr(ctx,bx,by,bw,bh,10);ctx.fill();ctx.fillStyle="#2A2621";ctx.fillRect(bx+14,by+14,bw-28,bh-28);
      /* khe sáng bên phải và chùm sáng */
      const hy=by+150;ctx.fillStyle="#FEF9C3";ctx.fillRect(bx+bw-14,hy-30,14,60);const g=ctx.createLinearGradient(bx+bw,0,bx+200,0);g.addColorStop(0,"rgba(254,240,138,.55)");g.addColorStop(1,"rgba(254,240,138,0)");ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(bx+bw-14,hy-30);ctx.lineTo(bx+220,hy-120);ctx.lineTo(bx+220,hy+160);ctx.lineTo(bx+bw-14,hy+30);ctx.closePath();ctx.fill();
      ctx.fillStyle="#FDE047";ctx.beginPath();ctx.arc(bx+bw+70,hy,30,0,6.283);ctx.fill();for(let i=0;i<10;i++){const a=i/10*6.283;ctx.strokeStyle="#FDE047";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(bx+bw+70+Math.cos(a)*38,hy+Math.sin(a)*38);ctx.lineTo(bx+bw+70+Math.cos(a)*50,hy+Math.sin(a)*50);ctx.stroke()}
      const px=bx+170,py=by+bh-110;pot(ctx,px,py,90);
      const L=110+170*t;const Pt=stemPath(px,py-10,L,1.15*t,30);drawStem(ctx,Pt,9,"#65A30D");
      const nodes=[.35,.55,.72,.88];nodes.forEach((f,i)=>{const p=Pt[Math.min(Pt.length-1,Math.round(f*30))];const q=Pt[Math.min(Pt.length-1,Math.round(f*30)+1)];const a=Math.atan2(q[1]-p[1],q[0]-p[0]);leaf(ctx,p[0],p[1],a+(i%2?1.1:-1.1)+.25*t,34+18*t,"#4D7C0F")});
      const tip=Pt[Pt.length-1];leaf(ctx,tip[0],tip[1],Math.atan2(tip[1]-Pt[Pt.length-3][1],tip[0]-Pt[Pt.length-3][0])-.3,22,"#84CC16");
      T(ctx,"Hộp kín, khe sáng ở bên phải",bx+bw/2,by-12,14,P.mut,"center",700);dayBar(ctx,P,"sang")}
    /* ---------- 2. hướng nước, trọng lực ---------- */
    function rootPath(t,side){const P=[[500,200]];let a=Math.PI/2;const n=60,L=360*t;const wx=side==="trai"?220:780;for(let i=0;i<n;i++){const p=P[i];const tx=wx-p[0],ty=300;const want=Math.atan2(ty*.6+120,tx*.9);a+=(want-a)*.045+Math.sin(i*.9)*.02;P.push([p[0]+Math.cos(a)*L/n,p[1]+Math.sin(a)*L/n])}return P}
    function drawNuoc(ctx,P){const D=S.p.nuoc,t=ease(D.t);const side=D.side;
      /* hộp đất trong suốt */
      ctx.fillStyle="#6B4F2E";ctx.fillRect(150,190,700,380);const wx=side==="trai"?150:620;const g=ctx.createLinearGradient(wx,0,wx+230,0);if(side==="trai"){g.addColorStop(0,"rgba(30,64,175,.45)");g.addColorStop(1,"rgba(30,64,175,0)")}else{g.addColorStop(0,"rgba(30,64,175,0)");g.addColorStop(1,"rgba(30,64,175,.45)")}ctx.fillStyle=g;ctx.fillRect(wx,190,230,380);
      for(let i=0;i<260;i++){const x=150+((i*97)%700),y=195+((i*53)%370);ctx.fillStyle=i%3?"rgba(0,0,0,.15)":"rgba(255,255,255,.08)";ctx.fillRect(x,y,3,3)}
      ctx.strokeStyle="rgba(191,219,254,.6)";ctx.lineWidth=4;ctx.strokeRect(150,190,700,380);T(ctx,side==="trai"?"Đất ẩm (tưới nước)":"Đất khô",side==="trai"?260:260,585,14,side==="trai"?"#93C5FD":P.mut);T(ctx,side==="trai"?"Đất khô":"Đất ẩm (tưới nước)",740,585,14,side==="trai"?P.mut:"#93C5FD");
      /* hạt, thân */
      ctx.fillStyle="#D6B37A";ctx.beginPath();ctx.ellipse(500,196,26,16,0,0,6.283);ctx.fill();const sh=stemPath(500,186,30+60*t,0,10);drawStem(ctx,sh,7,"#65A30D");const tp=sh[sh.length-1];leaf(ctx,tp[0],tp[1],-2.4,30*t+8,"#4D7C0F");leaf(ctx,tp[0],tp[1],-.7,30*t+8,"#4D7C0F");
      /* rễ */
      const rp=rootPath(t,side);ctx.strokeStyle="#F5F5DC";ctx.lineCap="round";for(let i=0;i<rp.length-1;i++){ctx.lineWidth=7*(1-.6*i/rp.length);ctx.beginPath();ctx.moveTo(rp[i][0],rp[i][1]);ctx.lineTo(rp[i+1][0],rp[i+1][1]);ctx.stroke();
        if(i%3===0&&i>6){ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(rp[i][0],rp[i][1]);ctx.lineTo(rp[i][0]+(i%2?8:-8),rp[i][1]+6);ctx.stroke()}}
      T(ctx,"Hộp kính đựng đất – nhìn mặt cắt",500,176,14,P.mut,"center",700);dayBar(ctx,P,"nuoc")}
    /* ---------- 3. hướng tiếp xúc ---------- */
    function drawTx(ctx,P){const t=ease(S.p.tx.t);const cx=560;
      ctx.fillStyle="#3F2A1C";ctx.fillRect(140,582,720,22);pot(ctx,330,500,110);
      ctx.fillStyle="#A16207";ctx.fillRect(cx-7,140,14,442);T(ctx,"Cọc",cx,130,14,P.mut);
      const base=[330,490];const stem=stemPath(base[0],base[1],220+60*t,.5,24);drawStem(ctx,stem,8,"#65A30D");const top=stem[stem.length-1];
      [[.35,1],[.6,-1],[.85,1]].forEach(([f,s])=>{const p=stem[Math.round(f*24)];leaf(ctx,p[0],p[1],s>0?-.4:-2.6,46,"#4D7C0F")});
      /* tua cuốn: đi từ ngọn tới cọc rồi quấn quanh */
      const reach=[cx-9,top[1]-30];ctx.strokeStyle="#84CC16";ctx.lineWidth=3.4;ctx.lineCap="round";ctx.beginPath();ctx.moveTo(top[0],top[1]);ctx.quadraticCurveTo((top[0]+reach[0])/2,top[1]-70,reach[0],reach[1]);ctx.stroke();
      const turns=.2+4*t,rr=14,y0=reach[1];const N=Math.round(turns*28);const pts=[];for(let i=0;i<=N;i++){const ph=i/28*6.283;pts.push([cx+Math.cos(ph+Math.PI)*rr,y0-i*1.5,Math.sin(ph+Math.PI)])}
      for(const front of [false,true]){for(let i=0;i<pts.length-1;i++){if((pts[i][2]>0)!==front)continue;ctx.strokeStyle=front?"#A3E635":"#3F6212";ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(pts[i][0],pts[i][1]);ctx.lineTo(pts[i+1][0],pts[i+1][1]);ctx.stroke()}if(!front){ctx.fillStyle="#A16207";ctx.fillRect(cx-7,y0-N*1.5-20,14,N*1.5+40)}}
      T(ctx,`Tua cuốn quấn ${fmt(Math.max(0,turns-.2),1)} vòng`,cx+40,y0-N*.75,14,HI(),"left");dayBar(ctx,P,"tx")}
    /* ---------- 4. trinh nữ ---------- */
    const PINN=[[-.45,1],[-.15,1],[.15,1],[.45,1]];
    function fold(i,j){const dt=(K.simT-S.mim.touch);const delay=.25+i*.12+j*.045;if(dt<delay)return 0;if(dt<delay+.6)return ease((dt-delay)/.6);const rec=12+i*.6;if(dt<rec)return 1;if(dt<rec+4)return 1-ease((dt-rec)/4);return 0}
    function drawMim(ctx,P){const cx=500,cy=320;ctx.fillStyle="#3F2A1C";ctx.fillRect(140,589,720,22);pot(ctx,cx,500,120);
      drawStem(ctx,[[cx,490],[cx-10,400],[cx-4,cy]],10,"#7C2D12");
      const dt=K.simT-S.mim.touch;const droop=dt<.3?0:dt<1?ease((dt-.3)/.7):dt<14?1:dt<18?1-ease((dt-14)/4):0;
      PINN.forEach(([ang],i)=>{const a=-Math.PI/2+ang*1.8+droop*.35*Math.sign(ang||1);const len=210;const ex=cx-4+Math.cos(a)*len,ey=cy+Math.sin(a)*len+droop*30;
        ctx.strokeStyle="#4D7C0F";ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(cx-4,cy);ctx.quadraticCurveTo(cx-4+Math.cos(a)*len*.5,cy+Math.sin(a)*len*.5,ex,ey);ctx.stroke();
        for(let j=0;j<16;j++){const f=.25+j*.047;const px=cx-4+(ex-cx+4)*f,py=cy+(ey-cy)*f;const da=Math.atan2(ey-cy,ex-cx+4);const k=fold(i,j);
          for(const s of [-1,1]){const la=da+s*(Math.PI/2*(1-k)+.12*k)+(k*.0);leaf(ctx,px,py,la,24,"#65A30D")}}});
      ctx.fillStyle="#F472B6";for(const [x,y] of [[cx+60,cy-150],[cx-80,cy-160]]){for(let i=0;i<24;i++){const a=i/24*6.283;ctx.strokeStyle="#F9A8D4";ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*14,y+Math.sin(a)*14);ctx.stroke()}}
      T(ctx,dt<0?"Chạm vào lá cây":dt<1.2?"Các lá chét đang cụp lại…":dt<12?"Lá đã cụp":dt<18?"Lá đang xòe ra trở lại":"Chạm vào lá cây",cx,120,16,HI());
      if(dt>=0&&dt<20)T(ctx,`Thời gian (tua nhanh): ${fmt(Math.min(dt,20)*1,0)} phút`,cx,146,13,P.mut,"center",700)}
    function dayBar(ctx,P,k){const t=S.p[k].t,d=PARTS[k].days;D2.block(ctx,60,60,250,46,12,P.card,P.card,{stroke:P.line,shadow:false});T(ctx,`Ngày ${fmt(t*d,1)} / ${d}`,185,90,17,P.ink)}
    K.drawFn((ctx,P)=>{const v=K.view;if(v==="sang")drawSang(ctx,P);else if(v==="nuoc")drawNuoc(ctx,P);else if(v==="tx")drawTx(ctx,P);else drawMim(ctx,P)});
    K.pickFn(q=>K.view==="mim"&&q[1]<500&&q[1]>60&&Math.abs(q[0]-500)<260?{m:1}:null);
    K.tapFn(h=>{if(!h)return;S.mim.touch=K.simT;S.mim.n++;if(S.mim.n===1)api.record({tn:"Cây trinh nữ",kt:"chạm vào lá",pu:"các lá chét cụp lại lần lượt, cuống lá rủ xuống; sau một thời gian lá xòe ra trở lại"});refresh()});
    const REC={sang:["Cây trong hộp có khe sáng ở bên phải","ánh sáng chiếu từ một phía","ngọn cây mọc cong về phía ánh sáng (hướng sáng)"],nuoc:["Hạt nảy mầm trong hộp đất, một bên ẩm","nước, trọng lực","rễ mọc hướng xuống và cong về phía đất ẩm (hướng nước, hướng trọng lực); thân mọc hướng lên"],tx:["Cây đậu cạnh cọc","tiếp xúc với cọc","tua cuốn quấn quanh cọc (hướng tiếp xúc)"]};
    K.onFrame(dt=>{for(const k in S.p){const P=S.p[k];if(P.run){P.t=Math.min(1,P.t+dt/6);if(P.t>=1){P.run=false;const r=REC[k];api.record({tn:r[0],kt:r[1],pu:r[2]});refresh()}}}});
    K.dockFn(()=>{const v=K.view;if(v==="mim")return[{k:"touch",label:"Chạm vào lá",icon:IC.hand}];const P=S.p[v];const it=[{k:"run",label:P.t>=1?"Đã xong":P.run?"Tạm dừng":"Tua nhanh",icon:IC.play,on:P.run,dis:P.t>=1},{k:"rs",label:"Làm lại",icon:IC.reset}];
      if(v==="nuoc")it.unshift({seg:[{k:"side",v:"trai",label:"Ẩm bên trái",icon:"",on:P.side==="trai"},{k:"side",v:"phai",label:"Ẩm bên phải",icon:"",on:P.side==="phai"}],label:"Phía đất ẩm"});return it});
    K.onDock((k,v)=>{const vw=K.view;if(k==="touch")K._tap({m:1});else if(k==="run"){const P=S.p[vw];P.run=!P.run}else if(k==="rs"){Object.assign(S.p[vw],{t:0,run:false})}else if(k==="side"){Object.assign(S.p.nuoc,{side:v,t:0,run:false})}refresh()});
    K.infoFn(()=>{const v=K.view;if(v==="mim")return `<div><b>Cây trinh nữ</b></div><small>Chạm vào lá: các lá chét cụp lại, cuống lá rủ xuống; sau một thời gian lá xòe ra. Đã chạm ${S.mim.n} lần.</small>`;
      return `<div><b>${PARTS[v].t}</b> · ngày ${fmt(S.p[v].t*PARTS[v].days,1)}</div><small>${v==="sang"?"Ánh sáng chỉ chiếu vào từ khe bên phải.":v==="nuoc"?"Rễ mọc hướng xuống (trọng lực) và về phía đất ẩm (nước).":"Tua cuốn chạm cọc sẽ quấn quanh cọc."}</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"run",p:[820,260],tip:S.p.sang.run?"Chạm để tạm dừng":"Chạm vào Mặt Trời để tua nhanh thời gian",view:"sang"},{k:"run",p:[500,200],tip:S.p.nuoc.run?"Chạm để tạm dừng":"Chạm vào hạt để tua nhanh thời gian",view:"nuoc"},{k:"run",p:[330,440],tip:S.p.tx.run?"Chạm để tạm dừng":"Chạm vào cây để tua nhanh thời gian",view:"tx"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const k of ["sang","nuoc","tx"]){S.p[k].t=.999;S.p[k].run=true}K.goView("mim");K._dockH("touch")}};
    return K.mount(st)}
});
})();
