/* K7-L-05 · Nam châm; từ trường, từ phổ; chế tạo nam châm điện (SGK KHTN 7 – Kết nối tri thức, Bài 18–20) · 3D
   1. Từ phổ: rắc mạt sắt lên tấm nhựa đặt trên nam châm rồi gõ nhẹ: mạt sắt xếp theo các đường sức từ. Kim nam châm (la bàn nhỏ) đặt quanh nam châm
      định hướng theo từ trường. Hướng từ trường được tính theo mô hình hai cực từ (cực Bắc N, cực Nam S) của nam châm.
   2. Nam châm điện: cuộn dây quấn quanh lõi sắt (đinh), nối với pin qua công tắc. Khi có dòng điện, lõi sắt hút ghim giấy; ngắt điện, ghim rơi.
      Tăng số vòng dây hoặc số pin (cường độ dòng điện) thì nam châm điện mạnh hơn. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const CFG={thanh:{t:"Thanh nam châm",p:[[.06,0,1],[-.06,0,-1]]},u:{t:"Nam châm chữ U",p:[[-.035,.05,1],[.035,.05,-1]]},nn:{t:"Hai cực cùng tên (N – N)",p:[[-.025,0,1],[-.145,0,-1],[.025,0,1],[.145,0,-1]]},ns:{t:"Hai cực khác tên (N – S)",p:[[-.025,0,1],[-.145,0,-1],[.025,0,-1],[.145,0,1]]}};
const SPEC={
  predict:[{id:"p1",q:"Đưa hai cực cùng tên của hai nam châm lại gần nhau thì chúng:",opts:[["day","Đẩy nhau"],["hut","Hút nhau"],["k","Không tương tác"]],ans:"day",res:"Kết quả: các cực cùng tên đẩy nhau, khác tên hút nhau."},
    {id:"p2",q:"Tăng số vòng dây của nam châm điện thì số ghim giấy bị hút:",opts:[["tang","Tăng"],["giam","Giảm"],["k","Không đổi"]],ans:"tang",res:"Kết quả: nam châm điện mạnh hơn khi tăng số vòng dây hoặc tăng cường độ dòng điện."}],
  taskLead:"Phần “Từ phổ”: chọn cách đặt nam châm, rắc mạt sắt rồi gõ nhẹ tấm nhựa. Phần “Nam châm điện”: chọn số vòng dây, số pin, đóng công tắc và ghi số ghim bị hút.",
  tasks:[{html:"<b>Từ phổ thanh nam châm:</b> rắc mạt sắt và gõ nhẹ tấm nhựa.",done:()=>!!S.seen.thanh},{html:"<b>So sánh:</b> quan sát từ phổ của ít nhất 2 cách đặt khác.",done:()=>["u","nn","ns"].filter(k=>S.seen[k]).length>=2},
    {html:"<b>Nam châm điện:</b> ghi số ghim bị hút trong ít nhất 3 trường hợp khác nhau.",done:()=>Object.keys(S.em.log).length>=3}],
  obs:[{id:"a",q:"Ở hai cực của thanh nam châm, mạt sắt:",opts:[["ok","Dày đặc nhất – từ trường mạnh nhất"],["it","Thưa nhất"],["k","Không có"]],ans:"ok",why:"Đường sức từ ở hai cực sít nhau nhất."},
    {id:"b",q:"Bên ngoài nam châm, đường sức từ có chiều:",opts:[["ok","Đi ra từ cực Bắc (N), đi vào cực Nam (S)"],["sn","Đi ra từ cực Nam, đi vào cực Bắc"],["k","Không có chiều"]],ans:"ok",why:"Chiều đường sức từ là chiều từ cực Nam tới cực Bắc của kim nam châm đặt cân bằng trên đường sức."},
    {id:"c",q:"Ngắt công tắc, ghim giấy rơi xuống vì:",opts:[["ok","Không còn dòng điện, lõi sắt non gần như mất từ tính"],["nang","Ghim quá nặng"],["pin","Pin hết điện ngay"]],ans:"ok",why:"Lõi sắt non chỉ nhiễm từ khi có dòng điện chạy qua cuộn dây."}],
  concl:{html:`<ul class="tlist"><li>Nam châm có hai cực: cực Bắc (N) và cực Nam (S). Các cực cùng tên đẩy nhau, khác tên hút nhau. Nam châm hút sắt, thép, niken, coban.</li>
    <li>Xung quanh nam châm có <b>từ trường</b>. <b>Từ phổ</b> là hình ảnh các đường mạt sắt xếp quanh nam châm; các đường sức từ bên ngoài nam châm đi ra từ cực N, đi vào cực S; nơi đường sức dày, từ trường mạnh.</li>
    <li><b>Nam châm điện</b> gồm ống dây có dòng điện chạy qua, bên trong có lõi sắt non. Tăng số vòng dây hoặc cường độ dòng điện thì nam châm điện mạnh hơn; ngắt dòng điện thì nam châm điện mất từ tính.</li></ul>`,
    quiz:[{id:"q1",q:"Trái Đất có từ trường vì:",opts:[["a","Kim la bàn luôn chỉ hướng Bắc – Nam địa lí"],["b","Trái Đất hút mọi vật"],["c","Trái Đất quay"]],ans:"a",why:{b:"Lực hút mọi vật là lực hấp dẫn, không phải từ trường.",c:"Chuyển động quay không phải dấu hiệu nhận biết từ trường."}},
      {id:"q2",q:"Ưu điểm của nam châm điện so với nam châm vĩnh cửu là:",opts:[["a","Có thể bật, tắt và điều chỉnh độ mạnh"],["b","Không cần nguồn điện"],["c","Luôn yếu hơn"]],ans:"a",why:{b:"Nam châm điện cần dòng điện.",c:"Nam châm điện có thể rất mạnh (cần cẩu điện từ)."}}],
    done:`<h2>Hoàn thành: nam châm, từ phổ, nam châm điện</h2><p class="muted">Đường sức từ đi ra từ N, vào S; nam châm điện mạnh hơn khi tăng số vòng dây, cường độ dòng điện.</p>`},
  gv:["Cho học sinh dự đoán hình dạng từ phổ trước khi gõ tấm nhựa.","Hỏi: vì sao ở giữa hai cực cùng tên có vùng gần như không có mạt sắt?","Liên hệ: cần cẩu điện từ, chuông điện."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 18, 19, 20)</p><ul class="tlist"><li>Tiến hành thí nghiệm để nêu được tác dụng của nam châm; xác định được cực Bắc, cực Nam; nêu được vùng không gian bao quanh nam châm có từ trường; dùng mạt sắt tạo từ phổ; vẽ được đường sức từ; chế tạo được nam châm điện đơn giản và làm thay đổi được từ trường của nó bằng thay đổi dòng điện.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 18 Nam châm; Bài 19 Từ trường; Bài 20 Chế tạo nam châm điện đơn giản.</li>
<li>Từ trường, đường sức từ, nam châm điện: <a href="https://openstax.org/books/physics/pages/20-1-magnetic-fields-field-lines-and-force" target="_blank" rel="noopener">OpenStax Physics, mục 20.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Từ trường trong mặt tấm nhựa được tính gần đúng bằng hai “cực từ” điểm ở hai đầu mỗi nam châm. Số ghim bị hút được mô hình hóa tỉ lệ thuận với tích số vòng dây × số pin (minh họa xu hướng, không phải số đo thực).</li></ul>`;

let S;
LabKHTN.register("K7-L-05",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Thí nghiệm"},{k:"dk",t:"Điều kiện"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D từ phổ và nam châm điện",legend:{w:280},bench:[2.2,1.0],seed:5,
      views:{tp:{t:[0,.03,0],yaw:0,pitch:1.1,rad:.235,label:"Từ phổ",icon:IC.grid},em:{t:[.93,.12,0],yaw:.45,pitch:.22,rad:.19,label:"Nam châm điện",icon:IC.bolt}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={cfg:"thanh",fil:0,aligned:0,seen:{},em:{N:50,pin:1,on:false,log:{},clips:[]},recs:0};
    const rec=(tn,dk,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,dk,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const texM=(tex,o)=>Object.assign({type:"unlit",color:"#FFFFFF",key:"tex",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}},o||{});
    const cutM=tex=>({type:"unlit",color:"#FFFFFF",key:"cut",transparent:true,hooks:{fu:"uniform sampler2D uTex;",fs:"{vec4 c=texture(uTex,vUV);if(c.a<.35)discard;base.rgb=c.rgb;}"},textures:{uTex:tex}});
    /* ---------- nam châm ---------- */
    function magnetTex(){const c=document.createElement("canvas");c.width=256;c.height=64;const g=c.getContext("2d");g.fillStyle="#C62828";g.fillRect(128,0,128,64);g.fillStyle="#1565C0";g.fillRect(0,0,128,64);g.fillStyle="#fff";g.font="900 44px system-ui";g.textAlign="center";g.fillText("S",64,48);g.fillText("N",192,48);return R.tex2D(c)}
    const MT=magnetTex();
    function bar(x,z,rot){const n=root.add(new G.Node());n.pos=[x,0,z];n.quat=Q.euler(0,rot,0);const h=n.add(R.mesh(G.box(.12,.018,.026,.003,2),{color:"#9CA3AF",rough:.4}));h.pos=[0,.009,0];
      const half=(col,sx)=>{const m=n.add(R.mesh(G.box(.06,.018,.026,.003,2),{color:col,rough:.35,coat:.4}));m.pos=[sx,.009,0]};half("#C62828",.03);half("#1565C0",-.03);
      const top=n.add(R.mesh(G.plane(.12,.026),texM(MT)));top.pos=[0,.0182,0];return n}
    const mags={thanh:[bar(0,0,0)],nn:[bar(-.085,0,0),bar(.085,0,Math.PI)],ns:[bar(-.085,0,0),bar(.085,0,0)]};
    /* nam châm chữ U: hai nhánh song song, cực ở phía trước (z dương) */
    {const n=root.add(new G.Node());const arc=[];for(let i=0;i<=24;i++){const a=Math.PI+i/24*Math.PI;arc.push([Math.cos(a)*.035,0,-.03+Math.sin(a)*.035])}
      const pts=[[-.035,0,.05],[-.035,0,-.03],...arc.slice(1,-1),[.035,0,-.03],[.035,0,.05]];n.add(R.mesh(G.tube(G.spline(pts,4),.011,14),{color:"#9CA3AF",rough:.35,metal:.3}));
      for(const [x,col] of [[-.035,"#C62828"],[.035,"#1565C0"]]){const m=n.add(R.mesh(G.cylinder(.0115,.025,16),{color:col,rough:.35,coat:.4}));m.quat=Q.euler(Math.PI/2,0,0);m.pos=[x,0,.025]}
      n.pos=[0,.012,0];mags.u=[n]}
    /* ---------- tấm nhựa + mạt sắt (vẽ trên canvas) ---------- */
    const SW=.36,SD=.26,TS=1024;const fc=document.createElement("canvas");fc.width=TS;fc.height=Math.round(TS*SD/SW);const ftex=R.tex2D(fc);
    const sheet=root.add(R.mesh(G.plane(SW,SD),{color:"#F8FAFC",alpha:.55,transparent:true,rough:.6,order:6}));sheet.pos=[0,.032,0];
    const fil=root.add(R.mesh(G.plane(SW,SD),cutM(ftex)));fil.pos=[0,.0325,0];
    function field(x,z){const P=CFG[S.cfg].p;let bx=0,bz=0;for(const [px,pz,q] of P){const dx=x-px,dz=z-pz,r2=dx*dx+dz*dz+1e-5,r3=r2*Math.sqrt(r2);bx+=q*dx/r3;bz+=q*dz/r3}return[bx,bz]}
    const inMag=(x,z)=>{if(S.cfg==="u")return(Math.abs(Math.abs(x)-.035)<.012&&z<.065&&z>-.07)||(z<-.03&&Math.hypot(x,z+.03)>.024&&Math.hypot(x,z+.03)<.046);
      if(S.cfg==="thanh")return Math.abs(x)<.062&&Math.abs(z)<.015;return Math.abs(Math.abs(x)-.085)<.062&&Math.abs(z)<.015};
    let F=[];
    function sprinkle(){F=[];const rnd=Math.random;let tries=0;while(F.length<3200&&tries<90000){tries++;const x=(rnd()-.5)*SW,z=(rnd()-.5)*SD;if(inMag(x,z))continue;const b=field(x,z),m=Math.hypot(b[0],b[1]);
      if(rnd()<C.clamp(Math.pow(m/260,.75),.035,1))F.push({x,z,a0:rnd()*Math.PI,a:Math.atan2(b[1],b[0]),l:.004+rnd()*.005,c:20+Math.floor(rnd()*35)})}S.fil=1;S.aligned=0;paint(0)}
    function paint(k){const g=fc.getContext("2d");g.clearRect(0,0,fc.width,fc.height);if(!S.fil){ftex.update(fc);return}const sx=fc.width/SW,sz=fc.height/SD;g.lineCap="round";
      for(const f of F){let da=f.a-f.a0;da=((da+Math.PI/2)%Math.PI+Math.PI)%Math.PI-Math.PI/2;const a=f.a0+da*k;const cx=(f.x+SW/2)*sx,cy=(f.z+SD/2)*sz,L=f.l*sx;g.strokeStyle=`rgb(${f.c},${f.c},${f.c+6})`;g.lineWidth=3.4;g.beginPath();g.moveTo(cx-Math.cos(a)*L,cy-Math.sin(a)*L);g.lineTo(cx+Math.cos(a)*L,cy+Math.sin(a)*L);g.stroke()}ftex.update(fc)}
    paint(0);
    /* la bàn nhỏ */
    const comp=[];for(let i=0;i<8;i++){const n=root.add(new G.Node());n.add(R.mesh(G.cylinder(.015,.004,28),{color:"#374151",rough:.4}));n.add(R.mesh(G.cylinder(.0135,.0042,28),{color:"#F1F5F9",rough:.5}));
      const nd=n.add(new G.Node());nd.pos=[0,.0042,0];const hN=nd.add(R.mesh(G.box(.012,.0014,.0034,.0006,1),{color:"#DC2626",rough:.4}));hN.pos=[.006,0,0];const hS=nd.add(R.mesh(G.box(.012,.0014,.0034,.0006,1),{color:"#1D4ED8",rough:.4}));hS.pos=[-.006,0,0];comp.push({n,nd})}
    function placeComp(){const L=S.cfg==="thanh"?[[.1,0],[-.1,0],[0,.05],[0,-.05],[.075,.045],[-.075,.045],[.075,-.045],[-.075,-.045]]:S.cfg==="u"?[[0,.08],[0,.04],[-.08,.07],[.08,.07],[-.09,0],[.09,0],[0,-.09],[0,.11]]:[[0,0],[0,.05],[0,-.05],[-.2,0],[.2,0],[-.085,.05],[.085,.05],[0,.1]];
      comp.forEach((c,i)=>{const [x,z]=L[i];c.n.pos=[x,.033,z];c.x=x;c.z=z})}
    placeComp();
    /* ---------- nam châm điện ---------- */
    const EX=.9;const em=root.add(new G.Node());em.pos=[EX,0,0];
    /* giá đỡ, đinh sắt thẳng đứng */
    em.add(R.mesh(G.box(.1,.01,.08,.003,2),{color:"#6B4F2E",rough:.7})).pos=[-.06,.005,-.03];em.add(R.mesh(G.cylinder(.004,.24,10),{color:"#9CA3AF",metal:.8,rough:.3})).pos=[-.09,.01,-.03];
    em.add(R.mesh(G.box(.11,.008,.012,.002,1),{color:"#9CA3AF",metal:.8,rough:.3})).pos=[-.04,.245,-.03];
    const nail=em.add(new G.Node());nail.pos=[0,.12,-.03];nail.add(R.mesh(G.cylinder(.0045,.13,16),{color:"#6B7280",metal:.85,rough:.35}));nail.add(R.mesh(G.cylinder(.009,.004,20),{color:"#6B7280",metal:.85,rough:.35})).pos=[0,.13,0];
    nail.add(R.mesh(G.lathe([[0,-.012],[.0045,0]],12),{color:"#6B7280",metal:.85,rough:.35}));
    let coil=null;function buildCoil(){if(coil)nail.remove(coil);const turns=S.em.N===50?26:48;const pts=[];const h0=.02,h1=.12;for(let i=0;i<=turns*16;i++){const t=i/(turns*16);const a=t*turns*6.283;const r=.0062+(S.em.N===100?.0018*Math.floor(t*2)%2:0);pts.push([Math.cos(a)*r,h0+(h1-h0)*t,Math.sin(a)*r])}coil=nail.add(R.mesh(G.tube(pts,.0011,5),{color:"#C2410C",metal:.7,rough:.3}))}
    buildCoil();
    /* pin, công tắc, dây */
    const pins=[];for(let i=0;i<2;i++){const p=em.add(new G.Node());p.pos=[.1,.012,.06-i*.03];p.quat=Q.euler(0,0,Math.PI/2);p.add(R.mesh(G.cylinder(.007,.05,20),{color:i?"#111827":"#111827",rough:.4}));p.add(R.mesh(G.cylinder(.0071,.012,20),{color:"#F59E0B",rough:.4})).pos=[0,.038,0];p.add(R.mesh(G.cylinder(.0025,.003,10),{color:"#D1D5DB",metal:.8,rough:.3})).pos=[0,.05,0];pins.push(p)}
    const sw=em.add(new G.Node());sw.pos=[.05,0,.1];sw.add(R.mesh(G.box(.04,.008,.025,.002,2),{color:"#1F2937",rough:.5})).pos=[0,.004,0];const lever=sw.add(new G.Node());lever.pos=[-.012,.01,0];lever.add(R.mesh(G.box(.03,.0025,.006,.001,1),{color:"#D1D5DB",metal:.8,rough:.3})).pos=[.015,0,0];
    const wires=[];function wire(a,b,mid){const pts=G.spline([a,mid||V3.lerp(a,b,.5),b],8);wires.push(em.add(R.mesh(G.tube(pts,.0016,6),{color:"#B91C1C",rough:.5})))}
    wire([0,.14,-.024],[.03,.006,.1],[.0,.03,.04]);wire([.07,.006,.1],[.07,.012,.06],[.09,.006,.09]);wire([.13,.012,.06],[0,.24,-.024],[.08,.09,.0]);
    /* ghim giấy */
    const clipG=(()=>{const p=[];const L=.016,W=.0045;const seg=(a,b,n)=>{for(let i=0;i<n;i++)p.push(V3.lerp(a,b,i/n))};const arc=(c,r,a0,a1,n)=>{for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/n;p.push([c[0]+Math.cos(a)*r,c[1]+Math.sin(a)*r,0])}};
      seg([W*.3,-L*.35,0],[W*.3,L*.35,0],6);arc([0,L*.35],W*.3,0,Math.PI,8);seg([-W*.3,L*.35,0],[-W*.3,-L*.45,0],8);arc([W*.05,-L*.45],W*.35,Math.PI,Math.PI*2,8);seg([W*.4,-L*.45,0],[W*.4,L*.45,0],8);arc([W*.0,L*.45],W*.4,0,Math.PI,8);seg([-W*.4,L*.45,0],[-W*.4,L*.2,0],3);return G.tube(p,.00045,5)})();
    const CLM={color:"#CBD5E1",metal:.9,rough:.25};const clips=[];for(let i=0;i<14;i++){const n=em.add(R.mesh(clipG,CLM));const a=i*2.4,r=.008+(i%5)*.006;const base=[Math.cos(a)*r,.0012,-.03+Math.sin(a)*r];n.pos=base;n.quat=Q.euler(Math.PI/2,a,0);clips.push({n,base,qb:n.quat,up:0,tgt:null})}
    const nClips=()=>Math.round(S.em.N/50*S.em.pin*2.3);   /* mô hình: tỉ lệ với số vòng × số pin */
    function setEM(on){const E=S.em;E.on=on;lever.quat=Q.euler(0,0,on?0:.5);const n=on?Math.min(clips.length,nClips()):0;
      clips.forEach((c,i)=>{c.tgt=i<n?[(i%3-1)*.004+Math.sin(i)*.002,.106-.012-Math.floor(i/3)*.013,-.03+(i%2?.003:-.003)]:null});
      if(on){const key=`${E.N}|${E.pin}`;if(!E.log[key]){E.log[key]=n;rec("Nam châm điện",`${E.N} vòng dây, ${E.pin} pin`,`hút được ${n} ghim giấy`)}}refresh()}
    lever.quat=Q.euler(0,0,.5);
    /* ---------- vòng lặp ---------- */
    let tap=0;
    K.onFrame(dt=>{const v=K.view;for(const k in mags)for(const m of mags[k])m.visible=v==="tp"&&k===S.cfg;sheet.visible=fil.visible=v==="tp";comp.forEach(c=>c.n.visible=v==="tp");em.visible=v==="em";
      if(tap>0){tap=Math.max(0,tap-dt);S.aligned=Math.min(1,S.aligned+dt*1.4);paint(1-Math.pow(1-S.aligned,2));fil.pos=[Math.sin(tap*60)*.0008,.0325,0];if(S.aligned>=1&&!S.seen[S.cfg]){S.seen[S.cfg]=1;rec("Từ phổ",CFG[S.cfg].t,S.cfg==="nn"?"giữa hai cực cùng tên có vùng ít mạt sắt, các đường sức đẩy nhau":S.cfg==="ns"?"các đường sức nối liền từ cực N sang cực S":"mạt sắt dày ở hai cực, xếp thành các đường cong đi từ cực này sang cực kia");refresh()}}
      for(const c of comp){const b=field(c.x,c.z);const a=Math.atan2(b[1],b[0]);c.nd.quat=Q.euler(0,-a,0)}
      for(const c of clips){const tgt=c.tgt;const cur=c.n.pos;if(tgt){c.n.pos=V3.lerp(cur,tgt,Math.min(1,dt*7));c.n.quat=Q.euler(0,0,(c.base[0]>0?.3:-.3))}else{const p=V3.lerp(cur,c.base,Math.min(1,dt*9));c.n.pos=p;if(V3.dist(p,c.base)<.002)c.n.quat=c.qb}}});
    K.dockFn(()=>{if(K.view==="tp")return[{grid:Object.keys(CFG).map(k=>({k:"cfg",v:k,label:CFG[k].t,icon:"",on:S.cfg===k}))},{k:"spr",label:"Rắc mạt sắt",icon:IC.drop},{k:"tap",label:"Gõ nhẹ tấm nhựa",icon:IC.hand,dis:!S.fil||tap>0}];
      const E=S.em;return[{seg:[50,100].map(n=>({k:"N",v:String(n),label:`${n} vòng`,icon:"",on:E.N===n})),label:"Số vòng dây"},{seg:[1,2].map(n=>({k:"pin",v:String(n),label:`${n} pin`,icon:"",on:E.pin===n})),label:"Nguồn điện"},{k:"sw",label:E.on?"Ngắt công tắc":"Đóng công tắc",icon:IC.bolt,on:E.on}]});
    K.onDock((k,v)=>{if(k==="cfg"){S.cfg=v;S.fil=0;S.aligned=0;paint(0);placeComp()}else if(k==="spr")sprinkle();else if(k==="tap"){if(S.fil)tap=.9}
      else if(k==="N"){S.em.N=+v;buildCoil();if(S.em.on)setEM(true)}else if(k==="pin"){S.em.pin=+v;pins[1].visible=S.em.pin===2;if(S.em.on)setEM(true)}else if(k==="sw")setEM(!S.em.on);refresh()});
    pins[1].visible=false;
    K.label("Cực Bắc (N)",()=>K.view==="tp"&&S.cfg==="thanh"?[.05,.034,0]:[-9,-9,-9],{view:"tp",dir:"ne",len:30});K.label("Cực Nam (S)",()=>K.view==="tp"&&S.cfg==="thanh"?[-.05,.034,0]:[-9,-9,-9],{view:"tp",dir:"nw",len:30});
    K.label("Kim nam châm",()=>[comp[0].x,.04,comp[0].z],{view:"tp",dir:"se",len:30});
    K.label("Lõi sắt (đinh) và cuộn dây",[EX,.18,-.03],{view:"em",dir:"nw",len:30});K.label("Pin",[EX+.1,.03,.06],{view:"em",dir:"ne",len:24});K.label("Công tắc",[EX+.05,.012,.1],{view:"em",dir:"s",len:20});K.label("Ghim giấy",[EX,.004,-.01],{view:"em",dir:"se",len:30});
    K.infoFn(()=>{if(K.view==="tp")return `<div><b>${CFG[S.cfg].t}</b></div><div>${!S.fil?"Bấm “Rắc mạt sắt”.":S.aligned<1?"Gõ nhẹ để mạt sắt xếp theo đường sức từ.":"Mạt sắt đã xếp theo đường sức từ."}</div><small>Kim nam châm: đầu đỏ là cực Bắc, chỉ theo chiều đường sức từ.</small>`;
      const E=S.em;return `<div><b>Nam châm điện</b> · ${E.N} vòng · ${E.pin} pin</div><div>${E.on?`Có dòng điện: hút ${Math.min(clips.length,nClips())} ghim`:"Công tắc đang ngắt"}</div><small>Đã ghi ${Object.keys(E.log).length} trường hợp.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[...(S.fil?[{k:"tap",p:[.09,.03,.06],tip:"Chạm để gõ nhẹ tấm nhựa",view:"tp"}]:[{k:"spr",p:[0,.03,0],tip:"Chạm để rắc mạt sắt lên tấm nhựa",view:"tp"}]),{k:"sw",p:[EX+.05,.015,.1],tip:S.em.on?"Chạm để ngắt công tắc":"Chạm để đóng công tắc",view:"em"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const c of ["thanh","u","nn"]){K._dockH("cfg",c);sprinkle();S.aligned=1;S.seen[c]=1;paint(1)}K.goView("em");for(const [n,p] of [[50,1],[100,1],[100,2]]){K._dockH("N",String(n));K._dockH("pin",String(p));if(!S.em.on)K._dockH("sw")}}};
    return K.mount(st)}
});
})();
