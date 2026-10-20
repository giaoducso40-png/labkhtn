/* K6-H-04 · Một số phương pháp tách chất ra khỏi hỗn hợp: lọc, cô cạn, chiết (SGK KHTN 6 – Kết nối tri thức, Bài 16) · 3D
   1. Lọc: tách cát (chất rắn không tan) ra khỏi nước bằng phễu và giấy lọc.
   2. Cô cạn: đun nước muối trong bát sứ, nước bay hơi, còn lại muối.
   3. Chiết: tách dầu ăn và nước bằng phễu chiết; nước nặng hơn ở lớp dưới, mở khóa cho nước chảy ra, khóa lại khi lớp dầu tới gần khóa. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q,H=G.hex;
const fmt=C.fmt;
const SPEC={
  predict:[{id:"p1",q:"Để lấy muối ăn từ nước muối, ta dùng cách:",opts:[["co","Cô cạn"],["loc","Lọc"],["chiet","Chiết"]],ans:"co",res:"Kết quả: đun cho nước bay hơi hết, còn lại muối."},
    {id:"p2",q:"Trong phễu chiết chứa dầu ăn và nước, lớp ở dưới là:",opts:[["nuoc","Nước"],["dau","Dầu ăn"],["tron","Hai chất trộn đều"]],ans:"nuoc",res:"Kết quả: dầu nhẹ hơn nước, nổi lên trên; nước ở dưới."}],
  taskLead:"Làm lần lượt ba cách tách chất. Kết quả tự ghi vào bảng.",
  tasks:[{html:"<b>Lọc:</b> rót hỗn hợp nước và cát qua phễu có giấy lọc.",done:()=>S.loc.t>=1},{html:"<b>Cô cạn:</b> đun nước muối trong bát sứ đến khi thu được muối.",done:()=>S.co.t>=1},{html:"<b>Chiết:</b> tách hết nước ra khỏi phễu chiết mà không để dầu chảy theo.",done:()=>!!S.ch.ok}],
  obs:[{id:"a",q:"Sau khi lọc, cát ở đâu?",opts:[["giay","Nằm lại trên giấy lọc"],["coc","Chảy xuống cốc"],["tan","Tan vào nước"]],ans:"giay",why:"Hạt cát lớn hơn lỗ giấy lọc nên bị giữ lại; nước đi qua giấy lọc."},
    {id:"b",q:"Phương pháp cô cạn dựa vào:",opts:[["ok","Nước dễ bay hơi khi đun, muối không bay hơi"],["kt","Kích thước hạt khác nhau"],["kl","Khối lượng riêng khác nhau"]],ans:"ok",why:"Khi đun, nước chuyển thành hơi, chất tan (muối) còn lại."},
    {id:"c",q:"Phương pháp chiết dùng để tách:",opts:[["ok","Hai chất lỏng không tan vào nhau"],["rl","Chất rắn không tan khỏi chất lỏng"],["dd","Chất tan khỏi dung dịch"]],ans:"ok",why:"Hai chất lỏng tách thành hai lớp, lần lượt cho từng lớp chảy ra."}],
  concl:{html:`<ul class="tlist"><li><b>Lọc</b>: tách chất rắn không tan ra khỏi chất lỏng (cát và nước).</li>
    <li><b>Cô cạn</b>: tách chất rắn hòa tan ra khỏi dung dịch bằng cách làm bay hơi dung môi (muối ăn từ nước muối).</li>
    <li><b>Chiết</b>: tách hai chất lỏng không hòa tan vào nhau, tách thành lớp (dầu ăn và nước).</li></ul>`,
    quiz:[{id:"q1",q:"Ở vùng biển, người ta làm muối từ nước biển bằng cách:",opts:[["a","Cho nước biển bay hơi dưới nắng (cô cạn)"],["b","Lọc nước biển"],["c","Chiết nước biển"]],ans:"a",why:{b:"Muối tan trong nước nên không lọc được.",c:"Muối không tạo thành lớp lỏng riêng."}},
      {id:"q2",q:"Pha cà phê phin, giữ bã cà phê lại phía trên là ứng dụng của:",opts:[["a","Lọc"],["b","Chiết"],["c","Cô cạn"]],ans:"a",why:{b:"Bã cà phê là chất rắn.",c:"Không làm bay hơi nước."}}],
    done:`<h2>Hoàn thành: Tách chất ra khỏi hỗn hợp</h2><p class="muted">Lọc, cô cạn và chiết dựa vào tính chất khác nhau của các chất trong hỗn hợp.</p>`},
  gv:["Khi cô cạn, đun đến khi còn ít nước thì tắt đèn, để nhiệt còn lại làm khô muối, tránh muối bắn ra ngoài.","Khi lọc, giấy lọc phải áp sát thành phễu, mực chất lỏng thấp hơn mép giấy lọc.","Khi chiết, mở nút ở đầu phễu chiết để chất lỏng chảy đều; khóa lại ngay khi lớp phân cách tới khóa."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 16)</p><ul class="tlist"><li>Trình bày được một số cách đơn giản để tách chất ra khỏi hỗn hợp và ứng dụng của các cách tách đó.</li><li>Sử dụng được một số dụng cụ, thiết bị cơ bản để tách chất ra khỏi hỗn hợp bằng cách lọc, cô cạn, chiết.</li><li>Chỉ ra được mối liên hệ giữa tính chất vật lí của một số chất thông thường với phương pháp tách chúng.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 16 Một số phương pháp tách chất ra khỏi hỗn hợp.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Thời gian lọc, cô cạn được rút ngắn. Lượng nước và dầu trong phễu chiết: 60 ml nước, 40 ml dầu ăn; lưu lượng qua khóa coi như không đổi.</li></ul>`;

let S;
LabKHTN.register("K6-H-04",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"pp",t:"Phương pháp"},{k:"hh",t:"Hỗn hợp"},{k:"ht",t:"Hiện tượng"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Thí nghiệm 3D tách chất: lọc, cô cạn, chiết",legend:{w:290},bench:[11,3.2],seed:16,
      views:{loc:{t:[-3,.75,0],yaw:.1,pitch:.16,rad:.85,label:"Lọc",icon:IC.beaker},co:{t:[0,.6,0],yaw:.1,pitch:.62,rad:.68,label:"Cô cạn",icon:IC.fire},chiet:{t:[3,.8,0],yaw:.1,pitch:.12,rad:.9,label:"Chiết",icon:IC.beaker}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root,rnd=K.rnd;
    S={loc:{t:0,run:false},co:{t:0,on:false},ch:{open:false,vw:60,vo:40,dw:0,doil:0,ok:false,tries:0},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const ease=t=>t*t*(3-2*t);
    const metal={color:"#9CA3AF",metal:.85,rough:.25};
    const cutM=(col,alpha,key,extra)=>Object.assign({color:col,alpha,transparent:alpha<1,rough:.12,coat:.4,side:"double",key,hooks:{fu:"uniform float uLo,uHi;",fs:"{if(vO.y>uHi||vO.y<uLo)discard;}"},uniforms:{uLo:-1,uHi:-1},order:1},extra||{});
    function stand(x,ringY,ringX,ringR){const n=root.add(new G.Node());n.add(R.mesh(G.box(.5,.04,.32,.01,2),{color:"#1F2937",rough:.5})).pos=[x,.02,0];n.add(R.mesh(G.cylinder(.016,1.7,12),metal)).pos=[x,0,0];
      n.add(R.mesh(G.tube([[x,ringY,0],[ringX-ringR,ringY,0]],.012,6),metal));n.add(R.mesh(G.tube(Array.from({length:41},(_,j)=>[ringX+Math.cos(j/40*6.283)*ringR,ringY,Math.sin(j/40*6.283)*ringR]),.011,6),metal));return n}
    function lamp(x,z){const n=root.add(new G.Node());n.pos=[x,0,z||0];n.add(R.mesh(G.lathe([[0,0],[.2,0],[.22,.03],[.22,.16],[.17,.27],[.08,.31],[.07,.34],[0,.34]],40),{type:"glass",color:"#DBEAFE",alpha:.5}));
      n.add(K3.liquid(R,.2,.02,.14,H("#BFDBFE"),.45));n.add(R.mesh(G.cylinder(.055,.06,20),metal)).pos=[0,.33,0];n.add(R.mesh(G.cylinder(.016,.06,10),{color:"#F5F5F4",rough:.9})).pos=[0,.38,0];
      const f1=n.add(K3.flame(R,[.35,.55,1],[.85,.92,1]));f1.pos=[0,.43,0];f1.scl=[.6,.75,.6];const f2=n.add(K3.flame(R,[1,.55,.12],[1,.9,.6]));f2.pos=[0,.45,0];f2.scl=[.42,.6,.42];
      const cap=n.add(R.mesh(G.lathe([[0,0],[.07,0],[.07,.1],[.06,.12],[0,.12]],20),{color:"#E5E7EB",rough:.4}));cap.pos=[0,.33,0];
      return{set(on){f1.visible=f2.visible=on;cap.visible=!on}}}
    /* ---------- 1. lọc ---------- */
    const LX=-3,FT=1.05,FB=.8,FS=.55;   /* phễu: miệng y = FT, đáy nón y = FB, cuối cuống y = FS */
    stand(LX-.55,FB+.18,LX,.115);
    const rF=y=>.016+(y-FB)/(FT-FB)*.19;
    root.add(R.mesh(G.lathe([[.012,FS],[.016,FB],[rF(FT),FT],[rF(FT)+.012,FT+.008]],40),{type:"glass",color:"#E0F2FE",alpha:.4,side:"double"})).pos=[LX,0,0];
    const paperG=G.lathe([[.004,FB+.012],[rF(FT-.02)-.008,FT-.02]],40);root.add(R.mesh(paperG,{type:"unlit",color:"#E7E5E4",side:"double",alpha:.9,transparent:true,order:1,key:"paper"})).pos=[LX,0,0];
    const fLiq=root.add(R.mesh(G.merge([G.lathe([[0,FB+.014],[rF(FT-.03)-.014,FT-.03]],36)]),cutM(H("#92400E"),.8,"fliq")));fLiq.pos=[LX,0,0];
    const fCap=root.add(R.mesh(G.disk(1,0,36,true),{color:"#92400E",alpha:.85,transparent:true,rough:.1,order:2}));
    const resid=root.add(R.mesh(G.lathe([[0,FB+.013],[rF(FT-.02)-.01,FT-.02]],36),cutM(H("#B7791F"),1,"resid",{type:"unlit"})));resid.pos=[LX,0,0];
    const lb=root.add(K3.glass(R,.17,.42));lb.pos=[LX,0,0];const filt=root.add(K3.liquid(R,.15,.03,1,H("#BAE6FD"),.4));filt.pos=[LX,0,0];
    const mix=root.add(new G.Node());mix.add(K3.glass(R,.13,.34));const mixL=mix.add(K3.liquid(R,.115,.03,1,H("#92400E"),.82));mixL.scl=[1,.24,1];const sand=mix.add(R.mesh(G.cylinder(.115,.04,24),{color:"#CA8A04",rough:.95}));sand.pos=[0,.03,0];
    const stream=root.add(R.mesh(G.cylinder(.008,1,8),{color:"#92400E",alpha:.85,transparent:true,rough:.1}));stream.visible=false;
    const drip=root.add(K3.bubbles(R,30));
    /* ---------- 2. cô cạn ---------- */
    const CX=0,TY=.78;const lp=lamp(CX);
    root.add(R.mesh(G.tube(Array.from({length:49},(_,j)=>[CX+Math.cos(j/48*6.283)*.32,TY-.02,Math.sin(j/48*6.283)*.32]),.017,6),{color:"#374151",metal:.7,rough:.4}));
    for(let i=0;i<3;i++){const a=i/3*6.283+.5;root.add(R.mesh(G.tube([[CX+Math.cos(a)*.32,TY-.02,Math.sin(a)*.32],[CX+Math.cos(a)*.42,0,Math.sin(a)*.42]],.015,6),{color:"#374151",metal:.7,rough:.4}))}
    root.add(R.mesh(G.box(.72,.008,.72,.002,1),{color:"#57534E",rough:.8,metal:.3})).pos=[CX,TY,0];
    const RS=.26,DH=.1;const rD=y=>Math.sqrt(Math.max(0,RS*RS-(RS-y)*(RS-y)));
    const dprof=[];for(let i=0;i<=16;i++){const y=DH*i/16;dprof.push([rD(y),y])}dprof.push([rD(DH)+.012,DH+.006]);for(let i=16;i>=0;i--){const y=.008+(DH-.008)*i/16;dprof.push([Math.max(.001,rD(y)-.01),y+.006])}
    const dish=root.add(R.mesh(G.lathe(dprof,48),{color:"#F5F5F4",rough:.35,coat:.5}));dish.pos=[CX,TY+.012,0];
    const brine=root.add(R.mesh(G.disk(1,0,40,true),{color:"#BAE6FD",alpha:.7,transparent:true,rough:.05,coat:.5,order:2}));
    const salt=R.instanced(G.box(1,1,1,.15,1),{color:"#FFFFFF",rough:.4,coat:.3,key:"salt2"},120);root.add(salt);const SLT=[];for(let i=0;i<120;i++){const a=rnd()*6.283,d=Math.sqrt(rnd())*.14;SLT.push([Math.cos(a)*d,Math.sin(a)*d,.004+rnd()*.006,rnd()])}
    const steam=root.add(K3.puffs(R,60,"#FFFFFF"));
    /* ---------- 3. chiết ---------- */
    const XX=3,Y0=.95,HB=.5;   /* phễu chiết: đáy bầu y = Y0, cao HB */
    stand(XX-.55,Y0+.3,XX,.1);
    const rP=y=>y<=0?.012:y>=HB?.03:Math.max(.012,Math.min(.17*Math.pow(Math.sin(Math.PI*Math.min(y/(HB*.92),1)),.75),y>HB*.85?.03+(.17-.03)*(HB-y)/(HB*.15):1));
    const pprof=[];for(let i=0;i<=40;i++){const y=HB*i/40;pprof.push([rP(y)+.008,y])}pprof.push([.038,HB+.1],[.04,HB+.11]);
    root.add(R.mesh(G.lathe([[.009,-.36],[.009,-.12],[.012,0]].concat(pprof),48),{type:"glass",color:"#E0F2FE",alpha:.35,side:"double"})).pos=[XX,Y0,0];
    root.add(R.mesh(G.cylinder(.035,.05,16),{color:"#E5E7EB",rough:.5})).pos=[XX,Y0+HB+.1,0];
    const tapY=Y0-.18;const tap=root.add(new G.Node());tap.pos=[XX,tapY,0];tap.add(R.mesh(G.box(.05,.04,.05,.01,2),{type:"glass",color:"#E0F2FE",alpha:.5}));const handle=tap.add(R.mesh(G.box(.11,.018,.02,.006,2),{color:"#2563EB",rough:.4}));handle.pos=[0,0,.04];
    const inner=[];for(let i=0;i<=40;i++){const y=HB*i/40;inner.push([Math.max(.001,rP(y)-.002),y])}
    const wLiq=root.add(R.mesh(G.lathe([[0,0]].concat(inner),40),cutM(H("#93C5FD"),.55,"cw")));wLiq.pos=[XX,Y0,0];
    const oLiq=root.add(R.mesh(G.lathe([[0,0]].concat(inner),40),cutM(H("#FACC15"),.8,"co")));oLiq.pos=[XX,Y0,0];
    const wCap=root.add(R.mesh(G.disk(1,0,36,true),{color:"#F59E0B",alpha:.6,transparent:true,rough:.1,order:2})),oCap=root.add(R.mesh(G.disk(1,0,36,true),{color:"#FDE047",alpha:.8,transparent:true,rough:.1,order:2}));
    /* bảng thể tích theo chiều cao */
    const VT=[0];const DY=.002;for(let y=DY;y<=HB+1e-9;y+=DY){const r=rP(y-DY/2)-.002;VT.push(VT[VT.length-1]+Math.PI*r*r*DY)}
    const VMAX=VT[Math.round(.86*HB/DY)],ML=VMAX/115;   /* 100 ml chiếm tới khoảng 0,86·HB… quy đổi mô hình */
    const yOfV=v=>{v=v*ML;let i=0;while(i<VT.length-1&&VT[i+1]<v)i++;return i*DY};
    const cb=root.add(K3.glass(R,.17,.42));cb.pos=[XX,0,0];const cbW=root.add(K3.liquid(R,.15,.03,1,H("#93C5FD"),.5));cbW.pos=[XX,0,0];const cbO=root.add(K3.liquid(R,.15,0,1,H("#FACC15"),.85));cbO.pos=[XX,0,0];
    const cstream=root.add(R.mesh(G.cylinder(.006,1,8),{color:"#93C5FD",alpha:.7,transparent:true,rough:.1}));cstream.visible=false;
    /* ---------- vòng lặp ---------- */
    let tk=0;
    K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}
      /* lọc */
      const L=S.loc;if(L.run){L.t=Math.min(1,L.t+dt/12);if(L.t>=1){L.run=false;api.record({pp:"Lọc",hh:"Nước và cát",ht:"nước trong chảy xuống cốc; cát nằm lại trên giấy lọc",kq:"tách được cát ra khỏi nước"});refresh()}}
      const pour=L.t>0&&L.t<.42;const pe=ease(C.clamp(L.t/.08,0,1))*(1-ease(C.clamp((L.t-.36)/.06,0,1)));
      mix.pos=[LX+.62-.42*pe,.0+FT+.06-(FT+.06)*(1-pe),0];mix.quat=Q.euler(0,0,1.15*pe);mixL.scl=[1,Math.max(.001,.24*(1-C.clamp((L.t-.06)/.3,0,1))),1];mixL.visible=L.t<.36&&(pe<.2||L.t<.06);sand.visible=L.t<.2;
      stream.visible=pour&&pe>.85;if(stream.visible){const top=V3.add(mix.pos,[Math.cos(1.15)*-.13+Math.sin(1.15)*-.34*0,0,0]);const x0=mix.pos[0]-.12*Math.cos(1.15)-.34*Math.sin(1.15),y0=mix.pos[1]+.34*Math.cos(1.15)-.12*Math.sin(1.15);stream.pos=[x0,FT-.05,0];stream.scl=[1,Math.max(.01,y0-(FT-.05)),1]}
      const fl=L.t<=0?0:L.t<.4?ease(L.t/.4):1-ease((L.t-.4)/.6);const hf=FB+.014+(FT-.05-FB-.014)*fl;fLiq.visible=fCap.visible=fl>.02;fLiq.mat.uniforms.uLo=-1;fLiq.mat.uniforms.uHi=hf;fCap.pos=[LX,hf,0];const cr=rF(hf)-.016;fCap.scl=[cr,1,cr];
      const rh=FB+.013+.06*ease(C.clamp(L.t/.5,0,1));resid.visible=L.t>0;resid.mat.uniforms.uLo=-1;resid.mat.uniforms.uHi=rh;
      const fv=ease(C.clamp((L.t-.08)/.92,0,1));filt.visible=fv>.005;filt.scl=[1,.03+.2*fv,1];
      if(L.t>.08&&L.t<.98&&rnd()<dt*14)drip.spawn([LX,FS-.01,0],.009,[0,-1.4,0],.6,1);drip.step(dt,b=>{if(b.p[1]<.03+.2*fv+.02)b.dead=true});
      /* cô cạn */
      const Cc=S.co;if(Cc.on&&Cc.t<1){Cc.t=Math.min(1,Cc.t+dt/14);if(Cc.t>=1){Cc.on=false;api.record({pp:"Cô cạn",hh:"Nước muối",ht:"nước bay hơi dần; gần cạn thì tắt đèn, còn lại chất rắn màu trắng",kq:"thu được muối ăn"});refresh()}}lp.set(Cc.on);
      const lv=.075*(1-ease(Cc.t));brine.visible=lv>.004;const rr=rD(lv+.006)-.012;brine.pos=[CX,TY+.012+.006+lv,0];brine.scl=[rr,1,rr];
      {const D=salt.data;let c=0;const g=C.clamp((Cc.t-.55)/.45,0,1);for(const s of SLT)if(s[3]<g){const d=Math.hypot(s[0],s[1]);const y=TY+.012+.006+(RS-Math.sqrt(RS*RS-d*d));D.set([CX+s[0],y+s[2]*.4,s[1],s[2]*(.6+.4*g),1,1,1,1],c*8);c++}salt.setInstances(c)}
      if(Cc.on&&rnd()<dt*10)steam.spawn([CX+(rnd()-.5)*.25,TY+.1,(rnd()-.5)*.25],.04,[(rnd()-.5)*.04,.22,0],2,.28,2.2);steam.step(dt);
      /* chiết */
      const Ch=S.ch;if(Ch.open){let q=dt*6;   /* ml/s (mô hình) */
        const a=Math.min(q,Ch.vw);Ch.vw-=a;Ch.dw+=a;q-=a;if(q>0&&Ch.vo>0){const b=Math.min(q,Ch.vo);Ch.vo-=b;Ch.doil+=b}if(Ch.vo<=0){Ch.open=false;closeTap()}}
      handle.quat=Q.euler(0,Ch.open?Math.PI/2:0,0);
      const yi=yOfV(Ch.vw),yt=yOfV(Ch.vw+Ch.vo);wLiq.mat.uniforms.uLo=-1;wLiq.mat.uniforms.uHi=yi;oLiq.mat.uniforms.uLo=yi;oLiq.mat.uniforms.uHi=yt;wLiq.visible=Ch.vw>.3;oLiq.visible=Ch.vo>.3;
      const ri=rP(yi)-.003,rt=rP(yt)-.003;wCap.visible=Ch.vw>.3&&Ch.vo>.3;wCap.pos=[XX,Y0+yi,0];wCap.scl=[ri,1,ri];oCap.visible=Ch.vo>.3;oCap.pos=[XX,Y0+yt,0];oCap.scl=[rt,1,rt];if(!oCap.visible&&Ch.vw>.3){oCap.visible=true;oCap.mat.color=H("#93C5FD");oCap.pos=[XX,Y0+yi,0];oCap.scl=[ri,1,ri]}else oCap.mat.color=H("#FDE047");
      const kc=.2/100;const hw=Ch.dw*kc,ho=Ch.doil*kc;cbW.visible=hw>.002;cbW.scl=[1,.03+hw,1];cbO.visible=ho>.001;cbO.pos=[XX,.03+hw,0];cbO.scl=[1,Math.max(.001,ho),1];
      cstream.visible=Ch.open;if(Ch.open){cstream.mat.color=H(Ch.vw>0?"#93C5FD":"#FACC15");const bot=.03+hw+ho;cstream.pos=[XX,bot,0];cstream.scl=[1,Y0-.36-bot,1]}});
    function closeTap(){const Ch=S.ch;Ch.open=false;Ch.tries++;let ht,kq;if(Ch.doil>.5){ht=`khóa muộn: ${fmt(Ch.doil,0)} ml dầu chảy lẫn vào cốc nước`;kq="chưa tách sạch, cần làm lại"}else if(Ch.vw>3){ht=`khóa sớm: còn ${fmt(Ch.vw,0)} ml nước trong phễu`;kq="chưa tách hết nước, mở khóa tiếp"}else{ht="nước chảy xuống cốc; lớp dầu ở lại trong phễu";kq="tách được nước và dầu ăn";Ch.ok=true}
      api.record({pp:"Chiết",hh:"Dầu ăn và nước",ht,kq});refresh()}
    /* ---------- tương tác ---------- */
    K.dockFn(()=>{const v=K.view;if(v==="loc")return[{k:"pour",label:S.loc.t>=1?"Đã lọc xong":S.loc.run?"Đang lọc…":"Rót hỗn hợp vào phễu",icon:IC.play,dis:S.loc.run||S.loc.t>=1},{k:"lrs",label:"Làm lại",icon:IC.reset}];
      if(v==="co")return[{k:"heat",label:S.co.t>=1?"Đã cô cạn":S.co.on?"Tắt đèn cồn":"Đốt đèn cồn",icon:IC.fire,on:S.co.on,dis:S.co.t>=1},{k:"crs",label:"Làm lại",icon:IC.reset}];
      const Ch=S.ch;return[{k:"tap",label:Ch.open?"Khóa lại":"Mở khóa phễu chiết",icon:Ch.open?IC.reset:IC.play,on:Ch.open,dis:Ch.vo<=0},{k:"chrs",label:"Làm lại",icon:IC.reset}]});
    K.onDock((k)=>{if(k==="pour"){S.loc.run=true;S.loc.t=0}else if(k==="lrs")S.loc={t:0,run:false};else if(k==="heat")S.co.on=!S.co.on;else if(k==="crs")S.co={t:0,on:false};
      else if(k==="tap"){if(S.ch.open)closeTap();else S.ch.open=true}else if(k==="chrs")S.ch={open:false,vw:60,vo:40,dw:0,doil:0,ok:S.ch.ok,tries:S.ch.tries};refresh()});
    /* nhãn */
    K.label("Giấy lọc",[LX-.15,FT-.04,.05],{view:"loc",dir:"nw",len:26});K.label("Phễu",[LX-.03,FS+.12,0],{view:"loc",dir:"w",len:40});K.label("Nước lọc",[LX+.12,.12,.12],{view:"loc",dir:"se",len:22});K.label("Nước lẫn cát",()=>V3.add(mix.pos,[.05,.36,0]),{view:"loc",dir:"ne",len:22});
    K.label("Bát sứ",[CX+.24,TY+.07,.05],{view:"co",dir:"ne",len:24});K.label("Đèn cồn",[CX+.15,.2,.15],{view:"co",dir:"se",len:20});
    K.label("Phễu chiết",[XX+.15,Y0+.32,0],{view:"chiet",dir:"ne",len:24});K.label("Khóa",[XX+.05,tapY,.04],{view:"chiet",dir:"e",len:40});
    K.label("Dầu ăn",()=>S.ch.vo>.3?[XX-.1,Y0+(yOfV(S.ch.vw)+yOfV(S.ch.vw+S.ch.vo))/2,.05]:[-99,-99,-99],{view:"chiet",dir:"w",len:40});K.label("Nước",()=>S.ch.vw>.3?[XX-.08,Y0+yOfV(S.ch.vw)/2+.01,.05]:[-99,-99,-99],{view:"chiet",dir:"w",len:50});
    K.infoFn(()=>{const v=K.view;if(v==="loc"){const L=S.loc;return `<div><b>Lọc</b> · hỗn hợp nước và cát</div><small>${L.t<=0?"Bấm “Rót hỗn hợp vào phễu”. Mực chất lỏng trong phễu luôn thấp hơn mép giấy lọc.":L.t<1?"Nước thấm qua giấy lọc, chảy xuống cốc…":"Nước lọc trong suốt; cát nằm lại trên giấy lọc."}</small>`}
      if(v==="co"){const Cc=S.co;return `<div><b>Cô cạn</b> · nước muối</div><div>Đã bay hơi khoảng ${Math.round(ease(Cc.t)*100)} % lượng nước</div><small>${Cc.t>=1?"Còn lại muối ăn màu trắng trong bát sứ.":Cc.t>.55?"Bắt đầu xuất hiện tinh thể muối.":"Nước bay hơi dần."}</small>`}
      const Ch=S.ch;return `<div><b>Chiết</b> · dầu ăn và nước</div><div>Trong phễu: nước ${fmt(Ch.vw,0)} ml · dầu ${fmt(Ch.vo,0)} ml</div><div>Trong cốc: nước ${fmt(Ch.dw,0)} ml${Ch.doil>.05?` · dầu ${fmt(Ch.doil,1)} ml`:""}</div><small>${Ch.ok?"Đã tách xong.":"Mở khóa, quan sát lớp phân cách; khóa lại ngay khi lớp dầu tới gần khóa."}</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"pour",p:()=>V3.add(mix.pos,[0,.36,0]),tip:"Chạm để rót hỗn hợp vào phễu",view:"loc"},{k:"heat",p:[CX,.36,.18],tip:S.co.on?"Chạm để tắt đèn cồn":"Chạm để đốt đèn cồn",view:"co"},{k:"tap",p:[XX,tapY,.05],tip:S.ch.open?"Chạm để khóa lại":"Chạm để mở khóa phễu chiết",view:"chiet"}]);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.loc.run=true;S.loc.t=.999;S.co.on=true;S.co.t=.999;S.ch.vw=0;S.ch.dw=60;closeTap();K.goView("co");K.goView("loc")}};
    return K.mount(st)}
});
})();
