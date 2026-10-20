/* K8-L-01 · Thực hành xác định khối lượng riêng (SGK KHTN 8 – Kết nối tri thức, Bài 13–14) · 3D
   Cân điện tử (độ chia 0,1 g) và bình chia độ 100 mL (độ chia 1 mL) chứa 50 mL nước.
   Vật: khối nhôm, khối sắt, khối đồng (lập phương cạnh 2 cm), hòn đá (không đều), khối gỗ (nổi: dùng kim ấn chìm).
   Học sinh đặt vật lên cân đọc m, thả vào bình đọc V₂, tính D = m / (V₂ − V₁). Kính lúp phóng to mặt nước để đọc theo đáy vòm khum. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,K3=window.LabChem3D,KIT=window.LabKit,IC=KIT.ICON,fmt=C.fmt,H=G.hex;
/* khối lượng riêng (g/cm³): OpenStax College Physics 2e, Bảng 11.1 (nhôm 2,7; sắt/thép 7,8; đồng 8,92; gỗ sồi khoảng 0,71) */
const OBJ=[
  {k:"al",ten:"Khối nhôm",rho:2.70,V:8,col:"#C9CED6",metal:.9,rough:.32,shape:"cube"},
  {k:"fe",ten:"Khối sắt",rho:7.87,V:8,col:"#8D9299",metal:.9,rough:.4,shape:"cube"},
  {k:"cu",ten:"Khối đồng",rho:8.92,V:8,col:"#C87F4F",metal:.95,rough:.3,shape:"cube"},
  {k:"da",ten:"Hòn đá",rho:2.65,V:11.5,col:"#8E8577",metal:0,rough:.9,shape:"rock"},
  {k:"go",ten:"Khối gỗ",rho:.71,V:8,col:"#B98552",metal:0,rough:.75,shape:"cube",floats:true}];
OBJ.forEach(o=>o.m=Math.round(o.rho*o.V*10)/10);
const CYL={r:.15,h:2.3,area:Math.PI*1.5*1.5,V0:50};/* bán kính trong 1,5 cm; 1 đơn vị cảnh = 10 cm */
const lvl=V=>.06+V/CYL.area/10;/* độ cao mặt nước (đơn vị cảnh) */

const SPEC={
  predict:[{id:"p1",q:"Khối nhôm và khối sắt cùng thể tích 8 cm³. Khối nào nặng hơn?",opts:[["fe","Khối sắt"],["al","Khối nhôm"],["nhu","Bằng nhau"]],ans:"fe",res:"Kết quả: khối sắt nặng hơn gần 3 lần vì khối lượng riêng của sắt lớn hơn."},
    {id:"p2",q:"Cắt đôi khối nhôm, khối lượng riêng của mỗi nửa:",opts:[["giu","Không đổi"],["nua","Giảm một nửa"],["gap","Tăng gấp đôi"]],ans:"giu",res:"Khối lượng riêng là đặc trưng của chất, không phụ thuộc kích thước vật."}],
  taskLead:"Chạm vào một vật để chọn, rồi chạm vào cân hoặc bình chia độ (hoặc dùng nút ở khay).",
  tasks:[{html:"Đo khối lượng và thể tích của <b>khối nhôm</b>, tính khối lượng riêng.",done:()=>S.done.al},{html:"Làm tương tự với <b>ít nhất hai vật khác</b>, trong đó có hòn đá (vật không có hình dạng xác định).",done:()=>S.done.da&&Object.keys(S.done).length>=3},
    {html:"Dùng <b>kính lúp</b> đọc mực nước ngang đáy vòm khum ít nhất một lần.",done:()=>S.lensUsed}],
  obs:[{id:"a",q:"Đọc thể tích nước trong bình chia độ, mắt đặt như thế nào?",opts:[["ngang","Ngang với mức đáy vòm khum của mặt nước"],["tren","Nhìn từ trên xuống"],["duoi","Nhìn từ dưới lên"]],ans:"ngang",why:"Đặt mắt ngang mặt nước, đọc theo vạch gần nhất với đáy vòm khum để tránh sai số."},
    {id:"b",q:"Hòn đá làm nước dâng từ 50 mL lên 61,5 mL (đọc được 61 hoặc 62 mL). Thể tích hòn đá khoảng:",opts:[["11","11–12 cm³"],["61","61 cm³"],["50","50 cm³"]],ans:"11",why:"Thể tích vật bằng thể tích nước dâng thêm: V = V₂ − V₁."},
    {id:"c",q:"Vì sao không đo được thể tích khối gỗ bằng cách thả tự do?",opts:[["noi","Gỗ nổi, chỉ chìm một phần nên nước dâng ít hơn thể tích vật"],["nang","Gỗ nặng quá"],["tan","Gỗ tan trong nước"]],ans:"noi",why:"Khối lượng riêng gỗ nhỏ hơn nước nên gỗ nổi; phải dùng kim ấn chìm hẳn rồi mới đọc."}],
  concl:{html:`<div class="eq">D = m / V &nbsp;&nbsp;(D: khối lượng riêng, m: khối lượng, V: thể tích)</div><ul class="tlist">
    <li>Khối lượng riêng của một chất là khối lượng của một đơn vị thể tích chất đó; đơn vị kg/m³ hoặc g/cm³ (1 g/cm³ = 1 000 kg/m³).</li>
    <li>Đo khối lượng bằng cân; đo thể tích vật rắn không thấm nước bằng bình chia độ: V = V₂ − V₁.</li>
    <li>Các chất khác nhau có khối lượng riêng khác nhau: dựa vào khối lượng riêng có thể nhận biết chất.</li></ul>`,
    quiz:[{id:"q1",q:"Một vật có m = 54 g, V = 20 cm³. Khối lượng riêng của vật là:",opts:[["a","2,7 g/cm³"],["b","1 080 g/cm³"],["c","0,37 g/cm³"]],ans:"a",why:{b:"Phải chia m cho V, không nhân.",c:"Phải lấy m chia V, không phải V chia m."}},
      {id:"q2",q:"Đổi 7 870 kg/m³ sang g/cm³:",opts:[["a","7,87 g/cm³"],["b","787 g/cm³"],["c","0,787 g/cm³"]],ans:"a",why:{b:"1 g/cm³ = 1 000 kg/m³.",c:"1 g/cm³ = 1 000 kg/m³."}}],
    done:`<h2>Hoàn thành: Khối lượng riêng</h2><p class="muted">D = m / V; mỗi chất có một khối lượng riêng xác định.</p>`},
  gv:["Cho học sinh ước lượng khối lượng trước khi đặt lên cân.","Nhắc trừ bì: cân phải hiện 0,0 g trước khi đặt vật.","Hỏi: vì sao kết quả đo hòn đá có sai số lớn hơn khối kim loại?","So sánh kết quả với bảng khối lượng riêng để nhận biết chất."]};
const GV=`<p><b>Yêu cầu cần đạt</b> (Bài 13–14)</p><ul class="tlist"><li>Nêu được định nghĩa khối lượng riêng, viết được công thức; thực hiện thí nghiệm xác định khối lượng riêng của một khối hộp chữ nhật, một vật có hình dạng bất kì và một lượng chất lỏng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Khối lượng riêng nhôm 2,7; sắt 7,8; đồng 8,92 g/cm³; gỗ khoảng 0,5–0,9 g/cm³: <a href="https://openstax.org/books/college-physics-2e/pages/11-2-density" target="_blank" rel="noopener">OpenStax College Physics 2e, mục 11.2, Bảng 11.1</a>.</li>
<li>Nội dung bài: SGK KHTN 8 (Kết nối tri thức), Bài 13 Khối lượng riêng, Bài 14 Thực hành xác định khối lượng riêng.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Khối lập phương cạnh 2 cm (8 cm³); hòn đá 11,5 cm³; sắt lấy 7,87 g/cm³; gỗ 0,71 g/cm³. Bình chia độ 100 mL, đường kính trong 3 cm, độ chia 1 mL; cân điện tử độ chia 0,1 g.</li></ul>`;

let S;
LabKHTN.register("K8-L-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"vat",t:"Vật"},{k:"m",t:"m",u:"g",num:true},{k:"v1",t:"V₁",u:"mL",num:true},{k:"v2",t:"V₂",u:"mL",num:true},{k:"V",t:"V = V₂ − V₁",u:"cm³",num:true},{k:"D",t:"D = m/V",u:"g/cm³",num:true}],empty:"Đo xong mỗi vật, số đo tự ghi vào bảng."},
  gv:GV,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Bàn đo khối lượng riêng: cân điện tử, bình chia độ, các vật bằng nhôm, sắt, đồng, đá, gỗ",bench:[5,2.6],legend:{w:250},
      views:{ban:{t:[0,.65,0],yaw:0,pitch:.32,rad:1.6,label:"Bàn đo",icon:IC.ban}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={sel:null,on:null,inCyl:null,m:{},v2:{},done:{},lensUsed:false,rows:0,pin:false,anim:null};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    /* cân điện tử */
    const BAL=[-1.15,0,.1];const bal=root.add(new G.Node());bal.pos=BAL;
    bal.add(R.mesh(G.box(.9,.16,.75,.06,4),{color:"#E9ECEF",rough:.35,coat:.4})).pos=[0,.08,0];
    bal.add(R.mesh(G.box(.5,.1,.16,.03,3),{color:"#2C313A",rough:.4})).pos=[0,.13,.3];
    const lcd=bal.add(R.mesh(G.box(.36,.012,.08,.005,1),{type:"unlit",color:"#9FD39B"}));lcd.pos=[0,.185,.3];
    bal.add(R.mesh(G.cylinder(.3,.025,40),{color:"#C9CED5",rough:.25,metal:.85})).pos=[0,.17,-.06];
    const lcdL=K.label("0,0 g",[BAL[0],.2,BAL[2]+.3],{cls:"plain lcd"});
    /* bình chia độ */
    const CX=[.35,0,.05];const cyl=root.add(new G.Node());cyl.pos=CX;
    cyl.add(R.mesh(G.lathe([[0,0],[.3,0],[.3,.04],[.18,.05],[.17,.06]],40),{type:"glass",color:"#DCEEFF",alpha:.55}));
    cyl.add(R.mesh(G.lathe([[CYL.r+.02,.06],[CYL.r+.02,CYL.h],[CYL.r+.05,CYL.h+.03],[CYL.r+.01,CYL.h+.04],[CYL.r,CYL.h],[CYL.r,.07],[0,.07]],48),{type:"glass",color:"#E2F1FF",alpha:.5}));
    /* vạch chia: mỗi 1 mL vạch ngắn, mỗi 10 mL vạch dài có số */
    const tickM={type:"unlit",color:"#24324A"};const ticks=[];
    for(let v=0;v<=100;v++){const y=lvl(v);const L=v%10===0?.07:v%5===0?.05:.03;const t=cyl.add(R.mesh(G.box(L,.0025,.002,.0005,1),tickM));t.pos=[-.02,y,CYL.r+.021];ticks.push(t)}
    const water=cyl.add(R.mesh(K3.liquidGeom(CYL.r-.003,.07,1,false),{color:H("#9CC8F0"),alpha:.42,rough:.04,coat:.6,order:1}));
    const menis=cyl.add(R.mesh(G.lathe([[0,0],[CYL.r*.7,.002],[CYL.r-.004,.012],[CYL.r-.002,.02]],40),{color:H("#CFE6FF"),alpha:.5,order:1}));
    const scaleL=[];for(let v=20;v<=100;v+=20)scaleL.push(K.label(String(v),[CX[0]-.02,lvl(v),CX[2]+CYL.r+.03],{cls:"plain tick"}));
    let Vw=CYL.V0;
    /* kim ấn gỗ */
    const pin=root.add(R.mesh(G.tube([[0,0,0],[0,.9,0]],.004,6),{color:"#A0A6AE",metal:.9,rough:.3}));pin.visible=false;
    /* vật trên khay gỗ */
    const tray=root.add(R.mesh(G.box(1.6,.03,.4,.015,2),{color:"#7A5636",rough:.6}));tray.pos=[0,.015,.75];
    const rockG=G.fromSDF((x,y,z)=>Math.hypot(x*1.05,y*1.35,z*.95)-.12+.018*Math.sin(x*41+z*17)*Math.sin(y*37),[-.16,-.12,-.16],[.16,.12,.16],[24,20,24]);
    const objs=OBJ.map((o,i)=>{const side=.2;const g=o.shape==="cube"?G.box(side,side,side,.012,2):rockG;const m=root.add(R.mesh(g,{color:o.col,metal:o.metal,rough:o.rough}));
      if(o.shape==="rock"){const s=Math.cbrt(o.V/(4/3*Math.PI*1.2*1.2*1.2*.9))*.95;m.scl=[s,s,s]}
      const home=[-.62+i*.31,.03+.1,.75];m.pos=home.slice();return{o,m,home,pos:home.slice(),y0:.1}});
    const objL=objs.map(b=>K.label(b.o.ten,b.home.slice(),{dir:"s",len:18}));
    K.label("Cân điện tử",[BAL[0]-.45,.12,BAL[2]],{dir:"w",len:20});K.label("Bình chia độ 100 mL",[CX[0]+CYL.r+.02,1.6,CX[2]],{dir:"e",len:26});
    /* kính lúp vào mặt nước */
    const lens=K.inset(()=>`Kính lúp · đọc mực nước: ${fmt(Vw,1)} mL`,()=>S.lens?{target:[CX[0],lvl(Vw)+.01,CX[2]+.05],yaw:0,pitch:0,dist:.42,fov:.6}:null);
    S.lens=false;
    /* di chuyển vật */
    function moveTo(b,to,cb){S.anim={b,from:b.pos.slice(),to,t:0,cb}}
    function place(b,where){if(S.anim)return;
      if(where==="bal"){if(S.on&&S.on!==b)return api.toast("Cân đang có vật khác. Lấy vật đó ra trước.","info",1800);if(S.inCyl===b)return api.toast("Vật đang ở trong bình. Lấy ra, lau khô rồi mới cân.","info",2000);
        S.on=b;moveTo(b,[BAL[0],.2+.1,BAL[2]-.06],()=>{S.m[b.o.k]=b.o.m;check(b);refresh()})}
      else if(where==="cyl"){if(S.inCyl&&S.inCyl!==b)return api.toast("Bình đang có vật khác. Lấy vật đó ra trước.","info",1800);if(S.on===b)S.on=null;
        S.inCyl=b;moveTo(b,[CX[0],lvl(CYL.V0)+.6,CX[2]],()=>{b.sink=0;refresh()})}
      else{if(S.on===b)S.on=null;if(S.inCyl===b){S.inCyl=null;b.sink=null;S.pin=false}moveTo(b,b.home.slice(),refresh)}}
    function check(b){const k=b.o.k;if(S.m[k]!=null&&S.v2[k]!=null&&!S.done[k]){S.done[k]=true;const V=S.v2[k]-CYL.V0;const D=S.m[k]/V;
      api.record({vat:b.o.ten,m:fmt(S.m[k],1),v1:fmt(CYL.V0,0),v2:fmt(S.v2[k],0),V:fmt(V,0),D:fmt(D,2)});
      api.toast(`${b.o.ten}: D = ${fmt(S.m[k],1)} / ${fmt(V,0)} ≈ ${fmt(D,2)} g/cm³`,"ok",2600)}}
    K.onFrame((dt,rdt)=>{const A=S.anim;if(A){A.t+=rdt*1.6;const k=Math.min(1,A.t),e=k*k*(3-2*k);const lift=Math.sin(Math.PI*k)*.35;A.b.pos=A.from.map((v,i)=>v+(A.to[i]-v)*e+(i===1?lift:0));if(k>=1){S.anim=null;A.cb&&A.cb()}}
      /* vật chìm trong bình */
      const b=S.inCyl;let Vsub=0;
      if(b&&b.sink!=null&&!S.anim){const top=lvl(Vw);const bottom=.07+.1;const side=.2;
        if(b.o.floats&&!S.pin){/* gỗ nổi: phần chìm = ρ_gỗ/ρ_nước */const f=b.o.rho/1;const y=top+side*(.5-f);b.pos[1]+=(y-b.pos[1])*Math.min(1,dt*3);Vsub=b.o.V*C.clamp((top-(b.pos[1]-side/2))/side,0,1)}
        else{b.pos[1]=Math.max(bottom,b.pos[1]-dt*.9);const sub=b.o.shape==="cube"?C.clamp((top-(b.pos[1]-side/2))/side,0,1):C.clamp((top-(b.pos[1]-.1))/.2,0,1);Vsub=b.o.V*sub;
          if(b.pos[1]<=bottom+1e-4&&b.sink===0){b.sink=1;S.v2[b.o.k]=Math.round(CYL.V0+b.o.V);check(b);refresh()}}}
      Vw+=(CYL.V0+Vsub-Vw)*Math.min(1,dt*6);
      water.scl=[1,(lvl(Vw)-.07)/.93,1];water.pos=[0,.07*(1-water.scl[1]),0];menis.pos=[0,lvl(Vw)-.012,0];
      pin.visible=S.pin&&!!b;if(pin.visible)pin.pos=[b.pos[0]+.02,b.pos[1]+.1,b.pos[2]];
      objs.forEach((o,i)=>{o.m.pos=o.pos;objL[i].p=[o.pos[0],o.pos[1]-.1,o.pos[2]+.12];objL[i].on=o!==S.on&&o!==S.inCyl&&!(S.anim&&S.anim.b===o)});
      /* số trên cân: ổn định sau 0,6 s */
      const mm=S.on&&!S.anim?S.on.o.m:0;S.balT=S.on&&!S.anim?(S.balT||0)+dt:0;const shown=mm&&S.balT<.6?mm*(.9+.1*S.balT/.6)+Math.sin(S.balT*40)*.3:mm;lcdL.set(`${fmt(Math.max(0,shown),1)} g`);
      if(S.lens)S.lensUsed=true});
    /* chọn bằng chạm */
    K.pickFn((x,y)=>{const r=R.ray(x,y);for(const b of objs){const p=b.pos;if(G.hit.box(r,[p[0]-.12,p[1]-.12,p[2]-.12],[p[0]+.12,p[1]+.12,p[2]+.12])!=null)return{b}}
      if(G.hit.box(r,[BAL[0]-.45,0,BAL[2]-.38],[BAL[0]+.45,.25,BAL[2]+.38])!=null)return{bal:1};if(G.hit.box(r,[CX[0]-.2,0,CX[2]-.2],[CX[0]+.2,CYL.h,CX[2]+.2])!=null)return{cyl:1};return null});
    K.tapFn(k=>{if(!k)return;if(k.b){if(S.sel===k.b){place(k.b,"home");S.sel=null}else{S.sel=k.b;api.toast(`Đã chọn ${k.b.o.ten.toLowerCase()}. Chạm vào cân hoặc bình chia độ.`,"info",1800)}refresh();return}
      if(!S.sel)return api.toast("Chạm vào một vật trên khay trước.","info",1600);if(k.bal)place(S.sel,"bal");if(k.cyl)place(S.sel,"cyl");refresh()});
    K.dockFn(()=>{const b=S.sel;return[{grid:objs.map(o=>({k:"sel",v:o.o.k,label:o.o.ten.replace("Khối ",""),icon:`<svg viewBox="0 0 40 40"><rect x="10" y="10" width="20" height="20" rx="3" fill="${o.o.col}" stroke="currentColor" stroke-width="1.5"/></svg>`,on:S.sel===o}))},"hr",
      {grid:[{k:"bal",label:"Đặt lên cân",icon:IC.grid,dis:!b},{k:"cyl",label:"Thả vào bình",icon:IC.beaker,dis:!b}]},{grid:[{k:"home",label:"Lấy về khay",icon:IC.reset,dis:!b},{k:"pin",label:"Kim ấn chìm",icon:IC.step,dis:!(S.inCyl&&S.inCyl.o.floats),on:S.pin}]},{k:"lens",label:"Kính lúp",icon:IC.lens,on:S.lens}]});
    K.onDock((k,v)=>{if(k==="sel"){S.sel=objs.find(o=>o.o.k===v)}else if(k==="bal"&&S.sel)place(S.sel,"bal");else if(k==="cyl"&&S.sel)place(S.sel,"cyl");else if(k==="home"&&S.sel)place(S.sel,"home");
      else if(k==="pin"){S.pin=!S.pin;if(S.pin&&S.inCyl){S.inCyl.sink=0}}else if(k==="lens")S.lens=!S.lens;refresh()});
    K.infoFn(()=>{const b=S.sel;return `<div><b>Đo khối lượng riêng</b></div><div>Nước trong bình: V₁ = ${CYL.V0} mL</div>${b?`<div>Đang chọn: ${b.o.ten}</div><div>m = ${S.m[b.o.k]!=null?fmt(S.m[b.o.k],1)+" g":"chưa cân"} · V₂ = ${S.v2[b.o.k]!=null?S.v2[b.o.k]+" mL":"chưa đo"}</div>`:"<small>Chạm vào một vật trên khay.</small>"}<small>Bảng tham khảo (g/cm³): nhôm 2,7 · sắt 7,8 · đồng 8,9 · đá 2,6–2,7 · gỗ 0,5–0,9</small>`});
    K.timeLabel(()=>`Cân: ${S.on?fmt(S.on.o.m,1):"0,0"} g · bình: ${fmt(Vw,1)} mL`);
    K.onReset(()=>{objs.forEach(o=>{o.pos=o.home.slice();o.sink=null});S.on=S.inCyl=S.sel=null;S.pin=false;S.anim=null;Vw=CYL.V0;refresh()});
    K.start();
    api.vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),place:(k,w)=>place(objs.find(o=>o.o.k===k),w),
      auto(){const seq=["al","fe","da","go"];let i=0;S.lens=true;const go=()=>{if(i>=seq.length)return;const b=objs.find(o=>o.o.k===seq[i]);
        if(S.anim)return setTimeout(go,300);if(S.on&&S.on!==b){place(S.on,"home");return setTimeout(go,400)}if(S.inCyl&&S.inCyl!==b){place(S.inCyl,"home");return setTimeout(go,400)}
        if(S.m[b.o.k]==null){if(S.on!==b)place(b,"bal");return setTimeout(go,400)}if(S.v2[b.o.k]==null){if(S.inCyl===b)return setTimeout(go,400);place(b,"cyl");if(b.o.floats)setTimeout(()=>{S.pin=true;b.sink=0},1500);return setTimeout(go,600)}i++;setTimeout(go,300)};go()}};
    return K.mount(st)}
});
})();
