/* K7-L-03 · Tia sáng; vùng tối, vùng nửa tối (SGK KHTN 7 – Kết nối tri thức, Bài 15) · 3D
   Nguồn sáng – vật cản (quả cầu) – màn chắn đặt trên một trục. Độ sáng mỗi điểm trên màn được tính bằng phần diện tích nguồn sáng
   (hình tròn) nhìn thấy được từ điểm đó, không bị vật cản che (hình học tia sáng truyền thẳng).
   - Nguồn sáng nhỏ (gần như nguồn điểm): trên màn có vùng tối rõ nét.
   - Nguồn sáng rộng: có vùng tối ở giữa và vùng nửa tối bao quanh.
   Bán kính vùng tối và vùng nửa tối trên màn: R_tối = r_n + (r_v − r_n)·b/a; R_nửa tối = (r_v + r_n)·b/a − r_n
   (a: khoảng cách nguồn – vật, b: khoảng cách nguồn – màn, r_n: bán kính nguồn, r_v: bán kính vật). */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3,Q=G.Q;
const fmt=C.fmt;
const XS=-.6,XSC=.6,RV=.04,SRC=[{k:"nho",t:"Nguồn nhỏ (đèn LED)",r:.003},{k:"rong",t:"Nguồn rộng (bóng đèn mờ)",r:.05}];
const XO=[-.35,-.15,.05,.3];
const SPEC={
  predict:[{id:"p1",q:"Dùng nguồn sáng rộng chiếu vào quả bóng, trên màn sẽ thấy:",opts:[["ok","Vùng tối ở giữa và vùng nửa tối bao quanh"],["toi","Chỉ có vùng tối rõ nét"],["k","Không có bóng"]],ans:"ok",res:"Kết quả: vùng nửa tối là nơi chỉ nhận được một phần ánh sáng từ nguồn."},
    {id:"p2",q:"Đưa vật cản lại gần màn chắn (nguồn rộng), vùng nửa tối sẽ:",opts:[["hep","Hẹp lại"],["rong","Rộng ra"],["k","Không đổi"]],ans:"hep",res:"Kết quả: vật càng gần màn, bóng càng rõ nét, vùng nửa tối càng hẹp."}],
  taskLead:"Chọn nguồn sáng và vị trí vật cản ở khay; quan sát màn chắn ở phần “Màn chắn”. Bấm “Hiện tia sáng” để thấy các tia giới hạn.",
  tasks:[{html:"<b>Nguồn nhỏ:</b> quan sát vùng tối.",done:()=>S.log.some(r=>r.s==="nho")},{html:"<b>Nguồn rộng:</b> quan sát vùng tối và vùng nửa tối ở ít nhất 3 vị trí của vật.",done:()=>new Set(S.log.filter(r=>r.s==="rong").map(r=>r.x)).size>=3},
    {html:"<b>Tia sáng:</b> hiện các tia sáng giới hạn.",done:()=>!!S.seenRay}],
  obs:[{id:"a",q:"Vùng tối là:",opts:[["ok","Vùng nằm sau vật cản, không nhận được ánh sáng từ nguồn"],["mot","Vùng nhận được một phần ánh sáng"],["sang","Vùng sáng nhất"]],ans:"ok",why:"Tia sáng từ mọi điểm của nguồn đều bị vật cản che."},
    {id:"b",q:"Vùng nửa tối là:",opts:[["ok","Vùng nằm sau vật cản, chỉ nhận được một phần ánh sáng từ nguồn"],["toi","Vùng không nhận được ánh sáng"],["k","Vùng trước vật cản"]],ans:"ok",why:"Chỉ có ở nguồn sáng rộng."},
    {id:"c",q:"Ta quan sát được vùng tối, vùng nửa tối vì:",opts:[["ok","Ánh sáng truyền theo đường thẳng"],["cong","Ánh sáng truyền theo đường cong"],["phan","Ánh sáng bị phản xạ"]],ans:"ok",why:"Đường truyền của ánh sáng được biểu diễn bằng tia sáng (đường thẳng có mũi tên)."}],
  concl:{html:`<ul class="tlist"><li>Trong môi trường trong suốt, đồng tính, ánh sáng truyền theo đường thẳng; đường truyền được biểu diễn bằng <b>tia sáng</b>.</li>
    <li><b>Vùng tối</b>: vùng nằm sau vật cản, không nhận được ánh sáng từ nguồn sáng. <b>Vùng nửa tối</b>: vùng nằm sau vật cản, chỉ nhận được một phần ánh sáng từ nguồn.</li>
    <li>Nguồn sáng nhỏ tạo vùng tối rõ nét; nguồn sáng rộng tạo vùng tối và vùng nửa tối. Vật càng gần màn, bóng càng rõ nét.</li></ul>`,
    quiz:[{id:"q1",q:"Khi có nhật thực, người đứng ở vùng tối của Mặt Trăng trên Trái Đất sẽ thấy:",opts:[["a","Nhật thực toàn phần"],["b","Nhật thực một phần"],["c","Mặt Trời sáng bình thường"]],ans:"a",why:{b:"Nhật thực một phần quan sát được ở vùng nửa tối.",c:"Ở vùng tối, Mặt Trời bị che hoàn toàn."}},
      {id:"q2",q:"Để bóng của tay trên tường rõ nét nhất, nên dùng:",opts:[["a","Nguồn sáng nhỏ, đặt tay gần tường"],["b","Nguồn sáng rộng, đặt tay xa tường"],["c","Nguồn sáng rộng, đặt tay gần nguồn"]],ans:"a",why:{b:"Nguồn rộng và tay xa tường làm vùng nửa tối rộng.",c:"Gần nguồn rộng thì vùng nửa tối rất rộng."}}],
    done:`<h2>Hoàn thành: tia sáng, vùng tối, vùng nửa tối</h2><p class="muted">Ánh sáng truyền thẳng tạo vùng tối, vùng nửa tối sau vật cản.</p>`},
  gv:["Cho học sinh dùng tia sáng giới hạn để giải thích vì sao có vùng nửa tối.","Đo đường kính vùng tối ở các vị trí vật khác nhau và so sánh.","Liên hệ: nhật thực, nguyệt thực."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 15)</p><ul class="tlist"><li>Thực hiện thí nghiệm thu được năng lượng ánh sáng; tạo được mô hình tia sáng bằng một chùm sáng hẹp song song; vẽ được hình biểu diễn vùng tối do nguồn sáng rộng và vùng tối do nguồn sáng hẹp.</li></ul>`;
const SRCH=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 15 Năng lượng ánh sáng. Tia sáng, vùng tối.</li>
<li>Bóng đổ, vùng tối (umbra) và vùng nửa tối (penumbra) theo quang hình học: <a href="https://openstax.org/books/physics/pages/16-1-reflection" target="_blank" rel="noopener">OpenStax Physics, chương 16 (truyền thẳng của ánh sáng)</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Nguồn sáng là một hình tròn phát sáng đều, nằm vuông góc với trục; vật cản là quả cầu bán kính 4 cm. Bỏ qua nhiễu xạ và ánh sáng phản xạ từ xung quanh (chỉ cộng một lượng sáng nền nhỏ).</li></ul>`;

let S;
LabKHTN.register("K7-L-03",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"ng",t:"Nguồn sáng"},{k:"vt",t:"Khoảng cách vật – màn"},{k:"toi",t:"Đường kính vùng tối"},{k:"nua",t:"Bề rộng vùng nửa tối"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRCH,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D vùng tối, vùng nửa tối",legend:{w:280},bench:[2.2,1.0],seed:3,
      views:{ts:{t:[0,.18,0],yaw:.75,pitch:.35,rad:.72,label:"Bố trí",icon:IC.eye},man:{t:[.6,.2,0],yaw:1.5708,pitch:.02,rad:.26,label:"Màn chắn",icon:IC.grid}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={si:1,xi:1,ray:false,seenRay:false,log:[],recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const texM=(tex,o)=>Object.assign({type:"unlit",color:"#FFFFFF",hooks:{fu:"uniform sampler2D uTex;",fs:"{base.rgb=texture(uTex,vUV).rgb;}"},textures:{uTex:tex}},o||{});
    const H0=.2;   /* độ cao trục quang */
    const stand=(x,h)=>{const n=root.add(new G.Node());n.pos=[x,0,0];n.add(R.mesh(G.cylinder(.045,.012,24),{color:"#374151",rough:.5}));n.add(R.mesh(G.cylinder(.006,h,10),{color:"#9CA3AF",metal:.8,rough:.3}));return n};
    /* nguồn sáng */
    const sN=stand(XS,H0-.02);const led=sN.add(R.mesh(G.sphere(1,20,14),{type:"unlit",color:"#FFF7D6"}));led.pos=[0,H0,0];
    const halo=sN.add(R.mesh(G.sphere(1,20,14),{type:"unlit",color:"#7A5A12",alpha:1,transparent:true,blend:"add",order:5}));halo.pos=[0,H0,0];
    /* vật cản */
    const oN=stand(XO[S.xi],H0-RV);const ball=oN.add(R.mesh(G.sphere(RV,32,22),{color:"#B91C1C",rough:.45,coat:.3}));ball.pos=[0,H0,0];
    /* màn chắn */
    const scN=root.add(new G.Node());scN.pos=[XSC,0,0];scN.add(R.mesh(G.box(.03,.012,.3,.003,2),{color:"#374151",rough:.5})).pos=[0,.006,0];
    const FR={color:"#1F2937",rough:.5};for(const z of [-.205,.205])scN.add(R.mesh(G.box(.014,.42,.012,.003,2),FR)).pos=[0,H0,z];for(const y of [-.205,.205])scN.add(R.mesh(G.box(.014,.012,.42,.003,2),FR)).pos=[0,H0+y,0];scN.add(R.mesh(G.cylinder(.006,H0-.2,8),{color:"#9CA3AF",metal:.8,rough:.3}));
    const TS=256;const sc=document.createElement("canvas");sc.width=TS;sc.height=TS;const stex=R.tex2D(sc);
    const vplane=(w,h)=>{const g=G.plane(w,h);const P=g.pos,N=g.nrm;for(let i=0;i<P.length;i+=3){const px=P[i],pz=P[i+2];P[i]=0;P[i+1]=-pz;P[i+2]=px;N[i]=-1;N[i+1]=0;N[i+2]=0}return g};
    const scr=scN.add(R.mesh(vplane(.4,.4),texM(stex,{side:"double"})));scr.pos=[-.001,H0,0];
    /* tia sáng giới hạn */
    const rayG=G.cylinder(.0012,1,6,false);const rays=[];for(let i=0;i<4;i++){const m=root.add(R.mesh(rayG,{type:"unlit",color:i<2?"#FDE047":"#FB923C",alpha:.9,transparent:true}));m.visible=false;rays.push(m)}
    function seg(m,a,b){const d=V3.sub(b,a);m.pos=a;m.quat=Q.toward(d);m.scl=[1,V3.len(d),1]}
    /* ---------- tính độ sáng trên màn ---------- */
    function lens(r1,r2,d){if(d>=r1+r2)return 0;if(d<=Math.abs(r1-r2))return Math.PI*Math.min(r1,r2)**2;
      const a=r1*r1*Math.acos(C.clamp((d*d+r1*r1-r2*r2)/(2*d*r1),-1,1)),b=r2*r2*Math.acos(C.clamp((d*d+r2*r2-r1*r1)/(2*d*r2),-1,1));return a+b-.5*Math.sqrt(Math.max(0,(-d+r1+r2)*(d+r1-r2)*(d-r1+r2)*(d+r1+r2)))}
    function vis(h){const rs=SRC[S.si].r,xo=XO[S.xi];const b=XSC-XS,c=XSC-xo;const ro=RV*b/c,d=Math.abs(h*(1-b/c));return 1-lens(rs,ro,d)/(Math.PI*rs*rs)}
    function geom(){const rs=SRC[S.si].r,a=XO[S.xi]-XS,b=XSC-XS;return{Ru:rs+(RV-rs)*b/a,Rp:(RV+rs)*b/a-rs}}
    function paint(){const g=sc.getContext("2d"),img=g.createImageData(TS,TS),half=.2;const prof=[];for(let i=0;i<=400;i++)prof.push(vis(i/400*half*1.42));
      for(let y=0;y<TS;y++)for(let x=0;x<TS;x++){const u=(x+.5)/TS*2*half-half,v=(y+.5)/TS*2*half-half;const r=Math.hypot(u,v);const f=prof[Math.min(400,Math.round(r/(half*1.42)*400))];
        const fall=1/(1+((r*r)/(.6*.6)));const L=.07+.93*f*(.85+.15*fall);const i=(y*TS+x)*4;img.data[i]=245*L+6;img.data[i+1]=242*L+6;img.data[i+2]=232*L+8;img.data[i+3]=255}
      g.putImageData(img,0,0);g.strokeStyle="rgba(0,0,0,.35)";g.lineWidth=1;for(let k=-4;k<=4;k++){const p=(k*.05+half)/(2*half)*TS;g.beginPath();g.moveTo(p,TS-10);g.lineTo(p,TS);g.stroke()}
      g.save();g.scale(-1,1);g.fillStyle="rgba(0,0,0,.55)";g.font="700 11px system-ui";g.fillText("5 cm",-(TS/2-20)-30,TS-12);g.restore();stex.update(sc)}
    function setup(){const rs=SRC[S.si].r;led.scl=[Math.max(rs,.006),Math.max(rs,.006),Math.max(rs,.006)];halo.scl=[rs*2.2+.02,rs*2.2+.02,rs*2.2+.02];oN.pos=[XO[S.xi],0,0];paint();
      const {Ru,Rp}=geom();const xo=XO[S.xi];
      seg(rays[0],[XS,H0+rs,0],[XSC,H0+Ru,0]);seg(rays[1],[XS,H0-rs,0],[XSC,H0-Ru,0]);seg(rays[2],[XS,H0-rs,0],[XSC,H0+Rp,0]);seg(rays[3],[XS,H0+rs,0],[XSC,H0-Rp,0]);
      rays.forEach((m,i)=>m.visible=S.ray&&(S.si===1||i<2))}
    setup();
    function record(){const {Ru,Rp}=geom();const key=S.si+"|"+S.xi;if(S.log.some(r=>r.key===key))return;S.log.push({key,s:SRC[S.si].k,x:S.xi});S.recs++;
      api.record({lan:String(S.recs),ng:SRC[S.si].t,vt:`${fmt((XSC-XO[S.xi])*100,0)} cm`,toi:`${fmt(Math.max(0,2*Ru)*100,1)} cm`,nua:S.si===0?"rất hẹp (≈ 0)":`${fmt((Rp-Ru)*100,1)} cm`});refresh()}
    K.label("Nguồn sáng",[XS,H0+.06,0],{view:"ts",dir:"n",len:24});K.label("Vật cản",()=>[XO[S.xi],H0+RV,0],{view:"ts",dir:"n",len:30});K.label("Màn chắn",[XSC,H0+.21,0],{view:"ts",dir:"n",len:18});
    K.label("Vùng tối",[XSC-.01,H0,0],{view:"man",dir:"w",len:110});
    K.label("Vùng nửa tối",()=>{const {Ru,Rp}=geom();return S.si===1?[XSC-.01,H0+(Ru+Rp)/2,0]:[-99,-99,-99]},{view:"man",dir:"nw",len:60});
    K.dockFn(()=>[{seg:SRC.map((s,i)=>({k:"src",v:String(i),label:i?"Nguồn rộng":"Nguồn nhỏ",icon:"",on:S.si===i})),label:"Nguồn sáng"},
      {grid:XO.map((x,i)=>({k:"x",v:String(i),label:`Vật cách màn ${fmt((XSC-x)*100,0)} cm`,icon:"",on:S.xi===i}))},{k:"ray",label:S.ray?"Ẩn tia sáng":"Hiện tia sáng",icon:IC.eye,on:S.ray},{k:"rec",label:"Ghi kết quả",icon:IC.pen}]);
    K.onDock((k,v)=>{if(k==="src")S.si=+v;else if(k==="x")S.xi=+v;else if(k==="ray"){S.ray=!S.ray;if(S.ray)S.seenRay=true}else if(k==="rec")record();setup();record();refresh()});
    K.infoFn(()=>{const {Ru,Rp}=geom();return `<div><b>${SRC[S.si].t}</b></div><div>Vật cách nguồn ${fmt((XO[S.xi]-XS)*100,0)} cm, cách màn ${fmt((XSC-XO[S.xi])*100,0)} cm</div><div>Vùng tối: đường kính ${fmt(Math.max(0,2*Ru)*100,1)} cm</div><div>${S.si?`Vùng nửa tối: vành rộng ${fmt((Rp-Ru)*100,1)} cm`:"Vùng nửa tối: gần như không có"}</div>${S.ray?`<small><span style="color:#FDE047">Tia vàng</span>: giới hạn vùng tối · <span style="color:#FB923C">tia cam</span>: giới hạn vùng nửa tối.</small>`:""}`});
    K.timeLabel(()=>SRC[S.si].t);
    /* thao tác tay: kéo vật cản dọc trục, thả ở vị trí gần nhất trong 4 vị trí đo */
    K.pickFn((x,y)=>{if(K.view!=="ts")return null;const r=R.ray(x,y);return G.hit.sphere(r,[XO[S.xi],H0,0],RV+.04)!=null?{drag:true,k:"obj"}:null});
    K.dragFn((ph,o,p)=>{const r=R.ray(p.x,p.y);if(Math.abs(r.d[2])<1e-4)return;const t=-r.o[2]/r.d[2];if(t<=0)return;const x=r.o[0]+r.d[0]*t;
      let bi=0;XO.forEach((v,i)=>{if(Math.abs(v-x)<Math.abs(XO[bi]-x))bi=i});if(bi!==S.xi){S.xi=bi;setup();refresh()}if(ph==="end"){record();refresh()}});
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"src",v:S.si?"0":"1",p:[XS,H0+.05,0],tip:S.si?"Chạm để đổi sang nguồn sáng nhỏ":"Chạm để đổi sang nguồn sáng rộng",view:"ts"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){K._dockH("src","0");K._dockH("src","1");for(const i of [0,1,2])K._dockH("x",String(i));K._dockH("ray")}};
    return K.mount(st)}
});
})();
