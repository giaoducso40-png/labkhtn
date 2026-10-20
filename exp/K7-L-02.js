/* K7-L-02 · Sóng âm; độ to – biên độ, độ cao – tần số (SGK KHTN 7 – Kết nối tri thức, Bài 12–13) · 2D, điều tra
   1. Màng loa dao động làm các lớp không khí bị nén, dãn liên tiếp → sóng âm truyền đi. Dao động kí hiển thị đồ thị dao động trong 10 ms.
      Tần số (số dao động trong 1 giây, Hz) lớn → âm cao (bổng); biên độ dao động lớn → âm to.
      Học sinh đổi tần số, biên độ, nghe âm thật (tạo bằng Web Audio) và ghi kết quả.
   2. Hạ âm – siêu âm: tai người nghe được âm có tần số từ 20 Hz đến 20 000 Hz. */
(function(){
"use strict";
const C=window.LabCore,K0=window.LabKit,D2=K0.D2,IC=K0.ICON;
const fmt=C.fmt;
const FR=[128,256,512,1024],AMP=[{k:"nho",t:"Nhỏ",a:.3},{k:"vua",t:"Vừa",a:.6},{k:"lon",t:"Lớn",a:1}];
const SPEC={
  predict:[{id:"p1",q:"Gõ mạnh vào mặt trống thì âm phát ra to hơn vì:",opts:[["bd","Mặt trống dao động với biên độ lớn hơn"],["ts","Tần số dao động lớn hơn"],["vt","Âm truyền nhanh hơn"]],ans:"bd",res:"Kết quả: biên độ dao động càng lớn, âm càng to."},
    {id:"p2",q:"Âm có tần số 512 Hz so với âm 128 Hz thì:",opts:[["cao","Cao (bổng) hơn"],["thap","Thấp (trầm) hơn"],["to","To hơn"]],ans:"cao",res:"Kết quả: tần số càng lớn, âm càng cao (bổng)."}],
  taskLead:"Đổi tần số hoặc biên độ ở khay, quan sát dao động kí; bấm “Nghe âm” để nghe (bật loa của máy với âm lượng vừa phải). Bấm “Ghi kết quả” sau mỗi lần đổi.",
  tasks:[{html:"<b>Độ cao:</b> ghi kết quả với ít nhất 3 tần số khác nhau, cùng biên độ.",done:()=>{const by={};for(const r of S.log){by[r.a]=by[r.a]||new Set();by[r.a].add(r.f)}return Object.values(by).some(s=>s.size>=3)}},
    {html:"<b>Độ to:</b> ghi kết quả với 3 biên độ khác nhau, cùng tần số.",done:()=>{const by={};for(const r of S.log){by[r.f]=by[r.f]||new Set();by[r.f].add(r.a)}return Object.values(by).some(s=>s.size>=3)}},
    {html:"<b>Hạ âm – siêu âm:</b> xem vùng tần số tai người nghe được.",done:()=>!!S.seenHa}],
  obs:[{id:"a",q:"Trên dao động kí, khi tăng tần số (giữ nguyên biên độ):",opts:[["ok","Số dao động trong cùng khoảng thời gian tăng, đường cong sít hơn"],["cao","Đường cong cao hơn"],["k","Không thay đổi"]],ans:"ok",why:"Tần số là số dao động trong 1 giây."},
    {id:"b",q:"Khi tăng biên độ (giữ nguyên tần số):",opts:[["ok","Đường cong cao hơn, âm to hơn, độ cao không đổi"],["sit","Đường cong sít hơn"],["cao","Âm cao hơn"]],ans:"ok",why:"Biên độ là độ lệch lớn nhất so với vị trí cân bằng."},
    {id:"c",q:"Sóng âm truyền trong không khí là do:",opts:[["ok","Các lớp không khí bị nén, dãn liên tiếp"],["gio","Gió thổi"],["as","Ánh sáng"]],ans:"ok",why:"Sóng âm không truyền được trong chân không."}],
  concl:{html:`<ul class="tlist"><li>Âm do vật dao động phát ra; sóng âm là sự lan truyền dao động (các lớp môi trường bị nén, dãn) trong chất rắn, lỏng, khí; không truyền được trong chân không.</li>
    <li><b>Tần số</b> là số dao động trong 1 giây, đơn vị hertz (Hz). Tần số càng lớn, âm càng <b>cao</b> (bổng); tần số càng nhỏ, âm càng <b>thấp</b> (trầm).</li>
    <li><b>Biên độ</b> dao động càng lớn, âm càng <b>to</b>.</li>
    <li>Tai người nghe được âm có tần số từ 20 Hz đến 20 000 Hz. Âm dưới 20 Hz là hạ âm, trên 20 000 Hz là siêu âm.</li></ul>`,
    quiz:[{id:"q1",q:"Một vật dao động 500 lần trong 2 giây. Tần số dao động là:",opts:[["a","250 Hz"],["b","1000 Hz"],["c","500 Hz"]],ans:"a",why:{b:"Tần số = số dao động : thời gian = 500 : 2.",c:"Phải chia cho 2 giây."}},
      {id:"q2",q:"Âm có tần số 30 000 Hz là:",opts:[["a","Siêu âm, tai người không nghe được"],["b","Hạ âm"],["c","Âm nghe được"]],ans:"a",why:{b:"Hạ âm có tần số dưới 20 Hz.",c:"Tai người nghe tới khoảng 20 000 Hz."}}],
    done:`<h2>Hoàn thành: độ cao và độ to của âm</h2><p class="muted">Tần số quyết định độ cao, biên độ quyết định độ to.</p>`},
  gv:["Cho học sinh đếm số dao động trên màn dao động kí trong 10 ms rồi suy ra tần số.","Lưu ý âm lượng loa trước khi cho nghe.","Liên hệ: dây đàn ngắn, căng → tần số lớn → âm cao."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 12, 13)</p><ul class="tlist"><li>Mô tả được các bước tiến hành thí nghiệm tạo sóng âm; giải thích được sự truyền sóng âm trong không khí; nêu được đơn vị tần số; nêu được sự liên quan của độ to của âm với biên độ âm, độ cao của âm với tần số âm.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 7 (Kết nối tri thức), Bài 12 Sóng âm; Bài 13 Độ to và độ cao của âm.</li>
<li>Sóng âm, tần số, biên độ; vùng nghe của tai người khoảng 20 Hz – 20 000 Hz: <a href="https://openstax.org/books/physics/pages/14-1-speed-of-sound-frequency-and-wavelength" target="_blank" rel="noopener">OpenStax Physics, mục 14.1</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Chuyển động của màng loa và các lớp không khí được vẽ chậm lại nhiều lần để mắt theo dõi được; dao động kí hiển thị đúng số dao động trong 10 ms. Âm nghe được tạo bằng bộ dao động hình sin của trình duyệt; độ to thực tế còn phụ thuộc loa của máy.</li></ul>`;

let S;
LabKHTN.register("K7-L-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"f",t:"Tần số (Hz)"},{k:"a",t:"Biên độ"},{k:"n",t:"Số dao động / 10 ms"},{k:"nx",t:"Nhận xét"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=K0.scene2D(api,{W:1000,H:640,aria:"Mô phỏng sóng âm, tần số và biên độ",views:{song:{label:"Sóng âm",icon:IC.bolt,frame:[30,30,940,580]},ha:{label:"Hạ âm – siêu âm",icon:IC.grid,frame:[30,30,940,580]}}});
    S={fi:1,ai:1,sound:false,log:[],seenHa:false,recs:0};
    const st=K0.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const T=(ctx,t,x,y,s,c,a,w)=>D2.text(ctx,t,x,y,{s:s||15,w:w||800,c,a:a||"center"});
    /* ---------- âm thanh thật ---------- */
    let ac=null,osc=null,gn=null;
    function soundOn(){try{if(!ac){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){api.toast("Trình duyệt không hỗ trợ phát âm.","warn",2000);return false}ac=new AC()}
      if(ac.state==="suspended")ac.resume();osc=ac.createOscillator();gn=ac.createGain();osc.type="sine";osc.frequency.value=FR[S.fi];gn.gain.value=0;osc.connect(gn).connect(ac.destination);osc.start();setGain();return true}catch(e){return false}}
    function setGain(){if(gn&&ac)gn.gain.setTargetAtTime(.05+.17*AMP[S.ai].a*AMP[S.ai].a,ac.currentTime,.03);if(osc&&ac)osc.frequency.setTargetAtTime(FR[S.fi],ac.currentTime,.02)}
    function soundOff(){try{if(gn&&ac){gn.gain.setTargetAtTime(0,ac.currentTime,.03);const o=osc;setTimeout(()=>{try{o.stop()}catch(e){}},200)}}catch(e){}osc=null;gn=null}
    K.onUnmount&&K.onUnmount(()=>{soundOff();try{ac&&ac.close()}catch(e){}});
    /* ---------- vẽ ---------- */
    const HI=()=>K.day?"#B45309":"#FCD34D";
    function drawSong(ctx,P){const f=FR[S.fi],A=AMP[S.ai].a;const fv=.6+S.fi*.35;   /* tần số hiển thị (làm chậm) */const ph=K.simT*fv*6.283;
      /* loa */
      const lx=120,ly=210;ctx.save();ctx.fillStyle="#1F2937";C.rr(ctx,lx-70,ly-90,70,180,10);ctx.fill();
      const mx=lx+Math.sin(ph)*8*A;ctx.fillStyle="#4B5563";ctx.beginPath();ctx.moveTo(lx,ly-26);ctx.lineTo(mx+34,ly-78);ctx.lineTo(mx+34,ly+78);ctx.lineTo(lx,ly+26);ctx.closePath();ctx.fill();
      ctx.strokeStyle="#9CA3AF";ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(mx+34,ly-78);ctx.quadraticCurveTo(mx+44,ly,mx+34,ly+78);ctx.stroke();ctx.fillStyle="#111827";ctx.beginPath();ctx.ellipse(mx+30,ly,8,20,0,0,6.283);ctx.fill();ctx.restore();
      T(ctx,"Màng loa",lx+10,ly+110,13,P.mut);
      /* các lớp không khí */
      const x0=180,x1=900,y0=130,y1=290,lam=170-S.fi*30;for(let row=0;row<9;row++){const y=y0+row*20;for(let i=0;i<64;i++){const xe=x0+i*(x1-x0)/63;const d=Math.sin(6.283*(xe-x0)/lam-ph)*10*A*Math.exp(-(xe-x0)/2200);
        ctx.fillStyle=C.rgba("#93C5FD",.85);ctx.beginPath();ctx.arc(xe-d,y+((i*7+row*3)%5-2),2.6,0,6.283);ctx.fill()}}
      /* đánh dấu nén / dãn */
      const fr=((ph/6.283)%1+1)%1;for(let n=-1;n<9;n++){const xc=x0+lam*(fr+n),xr=xc+lam/2;if(xc>x0+15&&xc<x1-15)T(ctx,"nén",xc,y0-12,12,HI());if(xr>x0+15&&xr<x1-15)T(ctx,"dãn",xr,y0-12,12,P.mut)}
      D2.arrow(ctx,760,316,880,316,P.mut,2);T(ctx,"Sóng âm truyền đi",820,338,13,P.mut);T(ctx,"(hình ảnh được làm chậm)",320,316,12,P.mut,"center",600);
      /* dao động kí */
      const ox=170,oy=370,ow=560,oh=220;ctx.fillStyle="#04160C";C.rr(ctx,ox,oy,ow,oh,10);ctx.fill();ctx.strokeStyle="rgba(74,222,128,.18)";ctx.lineWidth=1;
      for(let i=0;i<=10;i++){ctx.beginPath();ctx.moveTo(ox+i*ow/10,oy);ctx.lineTo(ox+i*ow/10,oy+oh);ctx.stroke()}for(let j=0;j<=8;j++){ctx.beginPath();ctx.moveTo(ox,oy+j*oh/8);ctx.lineTo(ox+ow,oy+j*oh/8);ctx.stroke()}
      ctx.strokeStyle="#4ADE80";ctx.lineWidth=2.6;ctx.shadowColor="#4ADE80";ctx.shadowBlur=8;ctx.beginPath();for(let i=0;i<=600;i++){const t=i/600*.01;const y=oy+oh/2-Math.sin(6.283*f*t)*A*oh*.42;const x=ox+i/600*ow;i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke();ctx.shadowBlur=0;
      T(ctx,"Dao động kí · khung 10 ms (mỗi ô 1 ms)",ox+8,oy-8,12.5,P.mut,"left",700);
      /* bảng số */
      const bx=760;D2.block(ctx,bx,370,190,220,12,P.card,P.card,{stroke:P.line,shadow:false});
      T(ctx,`${f} Hz`,bx+95,410,26,P.ink);T(ctx,`${fmt(f*.01,2)} dao động / 10 ms`,bx+95,436,13,P.mut,"center",700);
      T(ctx,`Biên độ: ${AMP[S.ai].t}`,bx+95,476,16,P.ink);T(ctx,`Độ cao: ${["trầm","hơi trầm","hơi bổng","bổng"][S.fi]}`,bx+95,512,14,HI());T(ctx,`Độ to: ${["nhỏ","vừa","to"][S.ai]}`,bx+95,538,14,HI());
      T(ctx,S.sound?"🔊 đang phát":"Bấm “Nghe âm”",bx+95,572,12.5,P.mut,"center",700)}
    function drawHa(ctx,P){const x0=80,x1=920,y=300;const lx=f=>x0+Math.log10(f)/7*(x1-x0);   /* 1 Hz … 10 MHz */
      ctx.fillStyle="rgba(148,163,184,.25)";C.rr(ctx,x0,y-18,x1-x0,36,10);ctx.fill();const g=ctx.createLinearGradient(lx(20),0,lx(20000),0);g.addColorStop(0,"#60A5FA");g.addColorStop(1,"#F472B6");ctx.fillStyle=g;ctx.fillRect(lx(20),y-18,lx(20000)-lx(20),36);
      for(const e of [1,10,100,1000,10000,100000,1000000,10000000]){ctx.fillStyle=P.mut;ctx.fillRect(lx(e)-1,y+18,2,10);T(ctx,e>=1e6?(e/1e6)+" MHz":e>=1000?(e/1000)+" kHz":e+" Hz",lx(e),y+46,13,P.mut)}
      T(ctx,"Hạ âm (dưới 20 Hz)",(x0+lx(20))/2,y-34,15,"#93C5FD");T(ctx,"Âm nghe được: 20 Hz – 20 000 Hz",(lx(20)+lx(20000))/2,y+6,16,"#0B1330");T(ctx,"Siêu âm (trên 20 000 Hz)",(lx(20000)+x1)/2,y-34,15,"#F9A8D4");
      for(const f of FR){ctx.fillStyle="#FDE047";ctx.beginPath();ctx.moveTo(lx(f),y-20);ctx.lineTo(lx(f)-6,y-31);ctx.lineTo(lx(f)+6,y-31);ctx.closePath();ctx.fill()}T(ctx,"▼ các tần số trong thí nghiệm (128 – 1024 Hz)",lx(360),y-62,12.5,"#FDE047","center",700);
      const ex=[["Voi","phát và cảm nhận được hạ âm",lx(10),"#93C5FD"],["Người","nói và nghe trong vùng âm nghe được",lx(800),"#E2E8F0"],["Dơi, cá heo","phát siêu âm để định vị",lx(80000),"#F9A8D4"],["Máy siêu âm (y tế)","dùng siêu âm tần số hàng triệu Hz",lx(5e6),"#F9A8D4"]];
      ex.forEach(([a,b,x,c],i)=>{const yy=y+100+(i%2)*70;ctx.strokeStyle=C.rgba(c,.6);ctx.beginPath();ctx.moveTo(x,y+18);ctx.lineTo(x,yy-18);ctx.stroke();const al=x>x1-160?"right":x<x0+120?"left":"center",tx=al==="right"?x+14:al==="left"?x-14:x;T(ctx,a,tx,yy,15,c,al);T(ctx,b,tx,yy+20,12.5,P.mut,al,600)});
      T(ctx,"Thang tần số (thang logarit)",x0,y-110,15,P.ink,"left")}
    K.drawFn((ctx,P)=>K.view==="song"?drawSong(ctx,P):drawHa(ctx,P));
    K.label("Các lớp không khí",[540,130],{view:"song",dir:"n",len:16});
    K.dockFn(()=>K.view==="song"?[{seg:FR.map((f,i)=>({k:"f",v:String(i),label:`${f}`,icon:"",on:S.fi===i})),label:"Tần số (Hz)"},{seg:AMP.map((a,i)=>({k:"a",v:String(i),label:a.t,icon:"",on:S.ai===i})),label:"Biên độ"},
        {k:"snd",label:S.sound?"Tắt âm":"Nghe âm",icon:IC.play,on:S.sound},{k:"rec",label:"Ghi kết quả",icon:IC.pen}]:[]);
    K.onDock((k,v)=>{if(k==="f"){S.fi=+v;setGain()}else if(k==="a"){S.ai=+v;setGain()}else if(k==="snd"){if(S.sound){soundOff();S.sound=false}else S.sound=soundOn()}
      else if(k==="rec"){const f=FR[S.fi],a=AMP[S.ai].t;if(S.log.some(r=>r.f===f&&r.a===a)){api.toast("Đã ghi trường hợp này.","info",1500)}else{S.log.push({f,a});S.recs++;
        api.record({lan:String(S.recs),f:String(f),a,n:fmt(f*.01,2),nx:`âm ${["trầm","hơi trầm","hơi bổng","bổng"][S.fi]}, ${["nhỏ","vừa","to"][S.ai]}`})}}refresh()});
    const og=K.goView;K.goView=function(v,i){og(v,i);if(v==="ha"&&!S.seenHa){S.seenHa=true;refresh()}if(v!=="song"&&S.sound){soundOff();S.sound=false}};
    K.infoFn(()=>K.view==="song"?`<div><b>Nguồn âm: loa</b> · ${FR[S.fi]} Hz · biên độ ${AMP[S.ai].t.toLowerCase()}</div><small>Tần số → độ cao; biên độ → độ to. Đã ghi ${S.log.length} kết quả.</small>`:`<div><b>Vùng tần số</b></div><small>Tai người nghe được âm từ 20 Hz đến 20 000 Hz.</small>`);
    K.timeLabel(()=>K.views[K.view].label);
    /* điểm chạm */K.hotFn&&K.hotFn(()=>[{k:"snd",p:[150,210],tip:S.sound?"Chạm vào loa để tắt âm":"Chạm vào loa để nghe âm",view:"song"}]);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){S.ai=1;for(let i=0;i<3;i++){S.fi=i;K._dockH("rec")}S.fi=1;for(let i=0;i<3;i++){S.ai=i;K._dockH("rec")}K.goView("ha");K.goView("song")}};
    return K.mount(st)}
});
})();
