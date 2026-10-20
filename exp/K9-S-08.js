/* K9-S-08 · Chọn lọc tự nhiên và cơ chế tiến hóa (SGK KHTN 9 – Kết nối tri thức, Bài 49–50) · 2D, điều tra
   Ví dụ kinh điển: bướm sâu đo bạch dương (Biston betularia). Dạng thân sẫm (allele C, trội) và dạng thân sáng (allele c, lặn).
   Trên thân cây sáng (có địa y), bướm sẫm dễ bị chim phát hiện; khi khói bụi công nghiệp làm thân cây sẫm màu, bướm sáng dễ bị phát hiện hơn.
   Học sinh đóng vai chim săn bướm (chạm để bắt), hoặc cho chim săn tự động qua nhiều thế hệ; bướm sống sót giao phối ngẫu nhiên sinh thế hệ sau.
   Tỉ lệ bị bắt trong chế độ tự động là giả định của mô hình (mục Nguồn). */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const N=40;
const PEAT={sang:{d:.5,l:.12},sam:{d:.12,l:.5}};   /* xác suất bị chim bắt trong một thế hệ (giả định mô hình) */
const BX=60,BY=60,BW=560,BH=520;

const SPEC={
  predict:[{id:"p1",q:"Khi thân cây bị khói bụi làm sẫm màu, qua nhiều thế hệ tỉ lệ bướm thân sẫm sẽ:",opts:[["tang","Tăng dần"],["giam","Giảm dần"],["k","Không đổi"]],ans:"tang",res:"Kết quả: bướm sẫm khó bị phát hiện hơn, sống sót và sinh sản nhiều hơn → tỉ lệ bướm sẫm tăng dần."},
    {id:"p2",q:"Màu thân sẫm của bướm xuất hiện là do:",opts:[["db","Đột biến xảy ra ngẫu nhiên từ trước, rồi được chọn lọc giữ lại"],["mt","Bướm tự đổi màu cho hợp với môi trường"],["an","Bướm ăn bụi than"]],ans:"db",res:"Kết quả: biến dị di truyền có sẵn trong quần thể; chọn lọc tự nhiên giữ lại biến dị có lợi trong môi trường mới."}],
  taskLead:"Đóng vai chim: chạm vào bướm để bắt (tối đa một nửa đàn mỗi lượt), rồi bấm “Sinh thế hệ mới”. Có thể cho chim săn tự động.",
  tasks:[{html:"<b>Làm chim:</b> tự săn ít nhất 1 lượt và sinh thế hệ mới.",done:()=>S.manual>=1},
    {html:"<b>Thân cây sẫm:</b> theo dõi ít nhất 10 thế hệ.",done:()=>S.gens.sam>=10},
    {html:"<b>Thân cây sáng:</b> theo dõi ít nhất 10 thế hệ.",done:()=>S.gens.sang>=10}],
  obs:[{id:"a",q:"Trên thân cây sẫm, sau nhiều thế hệ bướm sẫm chiếm ưu thế vì:",opts:[["ok","Chim bắt bướm sáng nhiều hơn; bướm sẫm sống sót, sinh sản và truyền allele C cho đời sau"],["bien","Bướm sáng biến thành bướm sẫm"],["an","Chim chỉ thích ăn bướm sáng"]],ans:"ok",why:"Chọn lọc tự nhiên tác động lên kiểu hình, qua đó làm thay đổi tần số allele của quần thể."},
    {id:"b",q:"Thực chất của chọn lọc tự nhiên là:",opts:[["ok","Phân hóa khả năng sống sót và sinh sản của các cá thể có kiểu gene khác nhau trong quần thể"],["tao","Tạo ra các biến dị mới"],["dk","Làm cho mọi cá thể giống nhau"]],ans:"ok",why:"Chọn lọc không tạo ra biến dị; đột biến và giao phối tạo nguồn biến dị."},
    {id:"c",q:"Khi chuyển lại sang thân cây sáng, allele c của bướm sáng:",opts:[["ok","Vẫn còn ở dạng dị hợp Cc nên tỉ lệ bướm sáng có thể tăng trở lại"],["mat","Đã mất hoàn toàn"],["k","Không bao giờ tăng lại"]],ans:"ok",why:"Allele lặn có thể tồn tại ở thể dị hợp dù kiểu hình lặn hiếm gặp."}],
  concl:{html:`<ul class="tlist"><li><b>Chọn lọc tự nhiên</b>: trong một môi trường, các cá thể mang biến dị có lợi sống sót và sinh sản nhiều hơn, truyền biến dị đó cho đời sau; cá thể mang biến dị bất lợi bị đào thải dần.</li>
    <li>Ví dụ bướm sâu đo bạch dương: khi thân cây sẫm do ô nhiễm, tỉ lệ bướm thân sẫm tăng; khi môi trường sạch trở lại, tỉ lệ bướm thân sáng tăng trở lại. Đặc điểm thích nghi chỉ hợp lí tương đối, phụ thuộc môi trường.</li>
    <li><b>Cơ chế tiến hóa</b> (thuyết tiến hóa hiện đại): đột biến và giao phối tạo nguồn biến dị; chọn lọc tự nhiên, di – nhập gene và các yếu tố ngẫu nhiên làm thay đổi tần số allele của quần thể; quá trình lâu dài có thể dẫn tới hình thành loài mới.</li></ul>`,
    quiz:[{id:"q1",q:"Theo Darwin, nguồn nguyên liệu của chọn lọc là:",opts:[["a","Các biến dị cá thể (biến dị di truyền)"],["b","Những thay đổi do tập quán sống"],["c","Thức ăn"]],ans:"a",why:{b:"Thay đổi do tập quán không di truyền được.",c:"Thức ăn là yếu tố môi trường."}},
      {id:"q2",q:"Một quần thể vi khuẩn tiếp xúc liên tục với kháng sinh, sau một thời gian tỉ lệ vi khuẩn kháng thuốc tăng. Đây là kết quả của:",opts:[["a","Chọn lọc tự nhiên giữ lại vi khuẩn mang gene kháng thuốc"],["b","Kháng sinh tạo ra gene kháng thuốc ở mọi vi khuẩn"],["c","Vi khuẩn học cách kháng thuốc"]],ans:"a",why:{b:"Gene kháng thuốc đã có sẵn do đột biến; kháng sinh chỉ đóng vai trò chọn lọc.",c:"Không phải sự “học”."}}],
    done:`<h2>Hoàn thành: chọn lọc tự nhiên</h2><p class="muted">Môi trường thay đổi → chọn lọc làm tăng tần số biến dị có lợi trong quần thể.</p>`},
  gv:["Cho các nhóm làm chim trên hai loại thân cây, so sánh số bướm sáng/sẫm bị bắt.","Hỏi: chọn lọc tự nhiên có tạo ra bướm sẫm không?","Mở rộng: tỉ lệ bướm sẫm ở Anh giảm mạnh sau khi có luật giảm ô nhiễm không khí."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 49, 50)</p><ul class="tlist"><li>Nêu được khái niệm tiến hóa, chọn lọc nhân tạo và chọn lọc tự nhiên; trình bày được một số luận điểm về cơ chế tiến hóa (Darwin, thuyết tiến hóa hiện đại).</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 49 Khái niệm tiến hóa và các hình thức chọn lọc; Bài 50 Cơ chế tiến hóa.</li>
<li>Bằng chứng chim săn chọn lọc bướm sâu đo bạch dương: Cook, L. M., Grant, B. S., Saccheri, I. J., & Mallet, J. (2012). Selective bird predation on the peppered moth: the last experiment of Michael Majerus. <i>Biology Letters</i>, 8(4), 609–612. <a href="https://doi.org/10.1098/rsbl.2011.1136" target="_blank" rel="noopener">doi:10.1098/rsbl.2011.1136</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Quần thể 40 con, giao phối ngẫu nhiên, kích thước không đổi qua các thế hệ. Allele sẫm C trội hoàn toàn so với c. Xác suất bị chim bắt mỗi thế hệ (chế độ tự động): 12% với bướm cùng màu thân cây, 50% với bướm khác màu – là số giả định để minh họa, không phải số đo thực tế.</li></ul>`;

let S;
LabKHTN.register("K9-S-08",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tt",t:"Thế hệ"},{k:"mt",t:"Thân cây"},{k:"bat",t:"Bị bắt (sẫm / sáng)"},{k:"sau",t:"Bướm sẫm ở thế hệ sau"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng chọn lọc tự nhiên ở bướm sâu đo bạch dương",views:{cay:{label:"Thân cây",icon:IC.eye,frame:[40,40,940,560]},dt:{label:"Đồ thị",icon:IC.grid,frame:[40,40,940,560]}}});
    const rnd=Math.random;
    S={env:"sam",gen:0,pop:[],eaten:{d:0,l:0},manual:0,hist:[],gens:{sang:0,sam:0},auto:false,acc:0,recs:0};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    /* ---------- vỏ cây (vẽ một lần ra canvas phụ) ---------- */
    function seeded(seed){let s=seed;return()=>{s=(s*16807)%2147483647;return s/2147483647}}
    function mkBark(dark){const cv=document.createElement("canvas");cv.width=BW*2;cv.height=BH*2;const c=cv.getContext("2d");c.scale(2,2);const r=seeded(dark?77:13);
      const base=dark?"#3A3530":"#CFCBC0";c.fillStyle=base;c.fillRect(0,0,BW,BH);
      for(let i=0;i<2600;i++){const x=r()*BW,y=r()*BH,w=2+r()*14,h=1+r()*3;const v=r();c.fillStyle=dark?`rgba(${20+v*45},${18+v*40},${16+v*34},.55)`:`rgba(${150+v*90},${150+v*88},${140+v*80},.55)`;c.fillRect(x,y,w,h)}
      /* vết nứt dọc */
      c.strokeStyle=dark?"rgba(8,6,5,.75)":"rgba(70,62,52,.55)";for(let i=0;i<46;i++){let x=r()*BW,y=r()*BH;c.lineWidth=.8+r()*2.2;c.beginPath();c.moveTo(x,y);for(let k=0;k<8;k++){x+=(r()-.5)*6;y+=8+r()*14;c.lineTo(x,y)}c.stroke()}
      /* địa y (chỉ trên thân sáng) hoặc muội than */
      for(let i=0;i<(dark?160:260);i++){const x=r()*BW,y=r()*BH,rr=3+r()*16;c.fillStyle=dark?`rgba(0,0,0,${.2+r()*.3})`:`rgba(${190+r()*40},${200+r()*35},${170+r()*30},${.3+r()*.35})`;c.beginPath();for(let k=0;k<9;k++){const a=k/9*6.283,q=rr*(.6+r()*.5);k?c.lineTo(x+Math.cos(a)*q,y+Math.sin(a)*q):c.moveTo(x+Math.cos(a)*q,y+Math.sin(a)*q)}c.closePath();c.fill()}
      /* đổ bóng hình trụ */
      const g=c.createLinearGradient(0,0,BW,0);g.addColorStop(0,"rgba(0,0,0,.45)");g.addColorStop(.25,"rgba(0,0,0,0)");g.addColorStop(.7,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.5)");c.fillStyle=g;c.fillRect(0,0,BW,BH);return cv}
    const BARK={sang:mkBark(false),sam:mkBark(true)};
    /* ---------- bướm (sprite) ---------- */
    function mkMoth(dark,seed){const cv=document.createElement("canvas");cv.width=96;cv.height=72;const c=cv.getContext("2d");c.scale(2,2);c.translate(24,18);const r=seeded(seed);
      const wing=dark?"#2A2623":"#DAD5C8",spk=dark?"rgba(120,110,100,.5)":"rgba(30,26,22,.75)";
      c.save();for(const sd of [-1,1]){c.save();c.scale(sd,1);c.beginPath();c.moveTo(1,-6);c.bezierCurveTo(10,-12,21,-8,22,-1);c.bezierCurveTo(18,4,10,8,1,6);c.closePath();c.fillStyle=wing;c.fill();
        c.save();c.clip();for(let k=0;k<70;k++){c.fillStyle=spk;c.beginPath();c.arc(1+r()*22,-11+r()*19,.4+r()*1.1,0,6.283);c.fill()}c.strokeStyle=spk;c.lineWidth=.7;c.beginPath();c.moveTo(4,-5);c.quadraticCurveTo(12,-6,16,2);c.stroke();c.restore();
        c.beginPath();c.moveTo(1,4);c.bezierCurveTo(8,6,13,11,9,15);c.bezierCurveTo(5,15,2,11,1,6);c.closePath();c.fillStyle=dark?"#24201D":"#CFC9BA";c.fill();c.restore()}
      c.fillStyle=dark?"#1A1715":"#B9B2A2";c.beginPath();c.ellipse(0,2,2.2,9,0,0,6.283);c.fill();c.strokeStyle=c.fillStyle;c.lineWidth=.7;c.beginPath();c.moveTo(-1,-7);c.lineTo(-5,-13);c.moveTo(1,-7);c.lineTo(5,-13);c.stroke();c.restore();return cv}
    const SPR={d:[1,2,3].map(i=>mkMoth(true,i*31)),l:[1,2,3].map(i=>mkMoth(false,i*57))};
    const isDark=g=>g!=="cc";
    /* quần thể lớn (NP cá thể) được theo dõi bằng tần số allele; 40 con trên thân cây là mẫu ngẫu nhiên của quần thể */
    const NP=1000;
    function newPop(fC){S.pop=[];for(let i=0;i<N;i++){const a=rnd()<fC?"C":"c",b=rnd()<fC?"C":"c";S.pop.push(moth((a+b).split("").sort().join("")))}}
    const gauss=()=>{let u=0,v=0;while(!u)u=rnd();while(!v)v=rnd();return Math.sqrt(-2*Math.log(u))*Math.cos(6.283*v)};
    function moth(g){return{g,x:BX+30+rnd()*(BW-60),y:BY+30+rnd()*(BH-60),a:rnd()*6.283,v:Math.floor(rnd()*3),alive:true,t:0}}
    const fracDark=L=>L.filter(m=>isDark(m.g)).length/Math.max(1,L.length);
    const popDark=p=>1-(1-p)*(1-p);
    function startEnv(env){S.env=env;S.gen=0;S.hist=[];S.eaten={d:0,l:0};S.p=env==="sam"?.03:.3;newPop(S.p);S.hist.push({g:0,d:popDark(S.p),c:S.p})}
    function nextGen(manual){const surv=S.pop.filter(m=>m.alive);if(surv.length<2){api.toast("Còn quá ít bướm để sinh sản.","warn",1800);return}
      /* tỉ lệ sống sót của từng kiểu hình: lấy từ lượt săn trên mẫu 40 con (học sinh) hoặc từ giả định của mô hình (tự động) */
      const nd=S.pop.filter(m=>isDark(m.g)).length,nl=S.pop.length-nd;
      manual=!S.autoH&&S.eaten.d+S.eaten.l>0;const sd=manual?(nd?1-S.eaten.d/nd:1):1-PEAT[S.env].d,sl=manual?(nl?1-S.eaten.l/nl:1):1-PEAT[S.env].l;S.autoH=false;
      const p=S.p,q=1-p;const cc=p*p*sd,ch=2*p*q*sd,ll=q*q*sl,tot=cc+ch+ll||1;let p2=(cc+ch/2)/tot;
      p2=C.clamp(p2+gauss()*Math.sqrt(p2*(1-p2)/(2*NP)),0,1);   /* biến động ngẫu nhiên do quần thể hữu hạn */
      const before=popDark(S.p);S.p=p2;newPop(p2);S.gen++;S.gens[S.env]++;if(manual)S.manual++;const d=popDark(p2);S.hist.push({g:S.gen,d,c:p2});
      api.record({tt:String(S.gen),mt:S.env==="sam"?"Sẫm (ô nhiễm)":"Sáng (có địa y)",bat:`${S.eaten.d} / ${S.eaten.l}${manual?" (học sinh săn)":""}`,sau:`${fmt(d*100,0)}% (thế hệ trước ${fmt(before*100,0)}%)`});S.eaten={d:0,l:0};refresh()}
    function autoHunt(){S.autoH=true;for(const m of S.pop){if(!m.alive)continue;const p=PEAT[S.env][isDark(m.g)?"d":"l"];if(rnd()<p){m.alive=false;m.t=0;S.eaten[isDark(m.g)?"d":"l"]++}}}
    function eat(m){if(!m.alive)return;const e=S.eaten.d+S.eaten.l;if(e>=N/2){api.toast("Mỗi lượt chim bắt tối đa một nửa đàn. Bấm “Sinh thế hệ mới”.","warn",2200);return}m.alive=false;m.t=0;S.eaten[isDark(m.g)?"d":"l"]++;refresh()}
    startEnv("sam");
    /* ---------- vẽ ---------- */
    function drawCay(ctx,P){ctx.save();C.rr(ctx,BX,BY,BW,BH,26);ctx.clip();ctx.drawImage(BARK[S.env],BX,BY,BW,BH);
      for(const m of S.pop){const sp=SPR[isDark(m.g)?"d":"l"][m.v];ctx.save();ctx.translate(m.x,m.y);ctx.rotate(m.a);let al=1;if(!m.alive){al=Math.max(0,1-m.t*2.5);ctx.scale(1+m.t,1+m.t)}ctx.globalAlpha=al;if(al>0)ctx.drawImage(sp,-24,-18,48,36);ctx.restore()}ctx.restore();
      ctx.strokeStyle=P.line;ctx.lineWidth=2;C.rr(ctx,BX,BY,BW,BH,26);ctx.stroke();
      /* bảng bên phải */
      const x=660;T(ctx,`Thế hệ ${S.gen}`,x,90,22,P.ink,"left");T(ctx,S.env==="sam"?"Thân cây sẫm (khói bụi)":"Thân cây sáng (có địa y)",x,118,15,P.mut,"left",700);
      const alive=S.pop.filter(m=>m.alive),nd=alive.filter(m=>isDark(m.g)).length,nl=alive.length-nd;
      ctx.drawImage(SPR.d[0],x,148,48,36);T(ctx,`Bướm sẫm: ${nd}`,x+60,172,16,P.ink,"left");ctx.drawImage(SPR.l[0],x,196,48,36);T(ctx,`Bướm sáng: ${nl}`,x+60,220,16,P.ink,"left");
      T(ctx,`Chim đã bắt: ${S.eaten.d} sẫm, ${S.eaten.l} sáng`,x,266,15,HI(),"left");
      const f=popDark(S.p);ctx.fillStyle="rgba(0,0,0,.18)";C.rr(ctx,x,296,280,22,8);ctx.fill();ctx.fillStyle="#57534E";ctx.fillRect(x,296,280*f,22);ctx.fillStyle="#D6D3C7";ctx.fillRect(x+280*f,296,280*(1-f),22);
      T(ctx,`Bướm sẫm trong quần thể: ${fmt(f*100,1)}%`,x,342,14,P.mut,"left",700);T(ctx,`Tần số allele C: ${fmt(S.p,3)} · allele c: ${fmt(1-S.p,3)}`,x,364,14,P.mut,"left",700);
      /* đồ thị nhỏ */
      D2.chart(ctx,{x:x+46,y:410,w:220,h:120,x0:0,x1:Math.max(10,S.gen),y0:0,y1:100,nx:5,ny:4,yl:"% bướm sẫm",xl:"thế hệ"},[{pts:S.hist.map(h=>[h.g,h.d*100]),c:"#F59E0B",w:2.6,dot:true}],P)}
    const HI=()=>K.day?"#B45309":"#FCD34D";
    function drawDT(ctx,P){D2.chart(ctx,{x:130,y:80,w:760,h:400,x0:0,x1:Math.max(10,S.gen),y0:0,y1:100,nx:Math.min(10,Math.max(5,S.gen)),ny:5,yl:"%",xl:"thế hệ"},[{pts:S.hist.map(h=>[h.g,h.d*100]),c:"#F59E0B",w:3,dot:true},{pts:S.hist.map(h=>[h.g,h.c*100]),c:"#60A5FA",w:2.2,dash:[6,5]}],P);
      ctx.fillStyle="#F59E0B";ctx.fillRect(140,540,24,4);T(ctx,"Tỉ lệ bướm thân sẫm (%)",172,546,14,P.ink,"left",700);ctx.fillStyle="#60A5FA";ctx.fillRect(420,540,24,4);T(ctx,"Tần số allele C (× 100)",452,546,14,P.ink,"left",700);
      T(ctx,S.env==="sam"?"Môi trường: thân cây sẫm":"Môi trường: thân cây sáng",890,546,14,HI(),"right")}
    K.drawFn((ctx,P)=>K.view==="cay"?drawCay(ctx,P):drawDT(ctx,P));
    K.pickFn(q=>{if(K.view!=="cay")return null;let best=null,bd=22;for(const m of S.pop){if(!m.alive)continue;const d=Math.hypot(q[0]-m.x,q[1]-m.y);if(d<bd){bd=d;best=m}}return best?{m:best}:null});
    K.tapFn(k=>{if(k)eat(k.m)});
    K.onFrame(dt=>{for(const m of S.pop)if(!m.alive)m.t+=dt;if(S.auto){S.acc+=dt;if(S.acc>.7){S.acc=0;autoHunt();nextGen(false);if(S.gens[S.env]>=30||S.gen>=40)S.auto=false;refresh()}}});
    K.dockFn(()=>[{seg:[{k:"env",v:"sang",label:"Thân sáng",icon:"",on:S.env==="sang"},{k:"env",v:"sam",label:"Thân sẫm",icon:"",on:S.env==="sam"}],label:"Môi trường"},
      {k:"gen",label:"Sinh thế hệ mới",icon:IC.step,dis:S.auto},{k:"hunt",label:"Chim săn tự động 1 lượt",icon:IC.eye,dis:S.auto},{k:"auto",label:S.auto?"Dừng":"Tự động nhiều thế hệ",icon:IC.play,on:S.auto},{k:"rst",label:"Làm lại quần thể",icon:IC.reset}]);
    K.onDock((k,v)=>{if(k==="env"){if(v!==S.env){/* giữ quần thể, chỉ đổi môi trường */S.env=v;api.toast(v==="sam"?"Khói bụi làm thân cây sẫm màu.":"Không khí sạch, địa y mọc lại, thân cây sáng.","info",1800)}}
      else if(k==="gen"){if(S.eaten.d+S.eaten.l===0)autoHunt();nextGen()}else if(k==="hunt"){if(S.eaten.d+S.eaten.l===0)autoHunt()}else if(k==="auto")S.auto=!S.auto;else if(k==="rst"){S.auto=false;startEnv(S.env)}refresh()});
    K.infoFn(()=>`<div><b>Bướm sâu đo bạch dương</b></div><div><i style="background:#2A2623"></i>Thân sẫm: CC, Cc · <i style="background:#DAD5C8;margin-left:8px"></i>Thân sáng: cc</div><small>Chạm vào bướm để bắt. Nếu chưa bắt con nào, “Sinh thế hệ mới” sẽ cho chim săn tự động trước.</small>`);
    K.timeLabel(()=>`Thế hệ ${S.gen}`);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const m of S.pop.filter(m=>!isDark(m.g)).slice(0,10))eat(m);K._dockH("gen");for(let i=0;i<10;i++){autoHunt();nextGen(false)}K._dockH("env","sang");for(let i=0;i<10;i++){autoHunt();nextGen(false)}}};
    return K.mount(st)}
});
})();
