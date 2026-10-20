/* K9-S-02 · Cấu trúc DNA; gene (SGK KHTN 9 – Kết nối tri thức, Bài 38) · 3D
   Chuỗi xoắn kép DNA dạng B dựng theo số đo thật: đường kính khoảng 2 nm, mỗi cặp nucleotide cao 0,34 nm, khoảng 10 cặp mỗi vòng xoắn,
   hai mạch ngược chiều (5'→3' và 3'→5'), rãnh lớn và rãnh nhỏ. Mỗi nucleotide: nhóm phosphate – đường deoxyribose – base nitrogen.
   A liên kết với T bằng 2 liên kết hydrogen, G với C bằng 3 liên kết hydrogen (nguyên tắc bổ sung).
   Phần “Gene”: một đoạn DNA mang thông tin mã hóa một sản phẩm. Phần “Bổ sung mạch”: học sinh lắp mạch 2 theo nguyên tắc bổ sung. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,IC=KIT.ICON,V3=G.V3;
const fmt=C.fmt,H=G.hex;
const BASE={A:{ten:"Adenine",c:"#E53935",pur:true},T:{ten:"Thymine",c:"#FDD835",pur:false},G:{ten:"Guanine",c:"#43A047",pur:true},C:{ten:"Cytosine",c:"#1E88E5",pur:false}};
const PAIR={A:"T",T:"A",G:"C",C:"G"};
const SEQ="TACCGGATGCAATTGCCGATACGGTCAATG";   /* mạch 1, chiều 5'→3' (trình tự minh họa) */
const NB=SEQ.length,RISE=.34,TW=2*Math.PI/10,RP=1.0,RS=.68,GAP=2.42;   /* 1 đơn vị = 1 nm; góc lệch giữa hai mạch tạo rãnh nhỏ */
const GENE=[6,24];

const SPEC={
  predict:[{id:"p1",q:"Theo nguyên tắc bổ sung, base A trên mạch này liên kết với base nào trên mạch kia?",opts:[["T","T (thymine)"],["G","G (guanine)"],["C","C (cytosine)"]],ans:"T",res:"Kết quả: A liên kết với T bằng 2 liên kết hydrogen; G liên kết với C bằng 3 liên kết hydrogen."},
    {id:"p2",q:"Một vòng xoắn của phân tử DNA gồm khoảng bao nhiêu cặp nucleotide?",opts:[["10","10 cặp"],["3","3 cặp"],["100","100 cặp"]],ans:"10",res:"Kết quả: mỗi chu kì xoắn gồm khoảng 10 cặp nucleotide, dài khoảng 3,4 nm."}],
  taskLead:"Chọn phần ở khay. Kéo để xoay; chạm vào một cặp base để xem tên và số liên kết hydrogen.",
  tasks:[{html:"<b>Xoắn kép:</b> chạm vào ít nhất một cặp A – T và một cặp G – C.",done:()=>S.tAT&&S.tGC},
    {html:"<b>Nucleotide:</b> xem cấu tạo một nucleotide.",done:()=>!!S.seen.nu},
    {html:"<b>Gene:</b> xem đoạn gene trên phân tử DNA.",done:()=>!!S.seen.gene},
    {html:"<b>Bổ sung mạch:</b> lắp đúng 10 nucleotide của mạch 2.",done:()=>S.b.k>=10}],
  obs:[{id:"a",q:"Một đoạn mạch 1 có trình tự A – T – G – C. Trình tự tương ứng trên mạch 2 là:",opts:[["ok","T – A – C – G"],["giong","A – T – G – C"],["dao","C – G – T – A"]],ans:"ok",why:"A – T, T – A, G – C, C – G."},
    {id:"b",q:"Hai mạch đơn của DNA liên kết với nhau nhờ:",opts:[["h","Liên kết hydrogen giữa các cặp base bổ sung"],["p","Liên kết giữa các nhóm phosphate"],["d","Liên kết giữa các phân tử đường"]],ans:"h",why:"Trong mỗi mạch, các nucleotide nối với nhau bằng liên kết giữa đường và phosphate; giữa hai mạch là liên kết hydrogen."},
    {id:"c",q:"Gene là:",opts:[["doan","Một đoạn DNA mang thông tin di truyền quy định một sản phẩm (RNA hoặc protein)"],["ca","Toàn bộ phân tử DNA"],["nu","Một nucleotide"]],ans:"doan",why:"Mỗi phân tử DNA có rất nhiều gene."}],
  concl:{html:`<ul class="tlist"><li>DNA (deoxyribonucleic acid) là đại phân tử cấu tạo theo nguyên tắc đa phân, đơn phân là các nucleotide; mỗi nucleotide gồm nhóm phosphate, đường deoxyribose và một trong bốn loại base: A, T, G, C.</li>
    <li>DNA là chuỗi xoắn kép gồm hai mạch song song, ngược chiều, xoắn đều quanh một trục; các base của hai mạch liên kết với nhau theo <b>nguyên tắc bổ sung</b>: A – T (2 liên kết hydrogen), G – C (3 liên kết hydrogen).</li>
    <li>Mỗi chu kì xoắn dài khoảng 3,4 nm gồm khoảng 10 cặp nucleotide; đường kính khoảng 2 nm.</li>
    <li><b>Gene</b> là một đoạn DNA mang thông tin di truyền mã hóa cho một sản phẩm (RNA hoặc chuỗi polypeptide). Trình tự nucleotide khác nhau tạo nên tính đa dạng và đặc thù của DNA.</li></ul>`,
    quiz:[{id:"q1",q:"Một đoạn DNA có 20% nucleotide loại A. Tỉ lệ nucleotide loại G là:",opts:[["a","30%"],["b","20%"],["c","80%"]],ans:"a",why:{b:"A = T = 20% → G = C = (100 − 40)/2 = 30%.",c:"G = C = 30%."}},
      {id:"q2",q:"Đoạn DNA có 100 cặp nucleotide dài khoảng:",opts:[["a","34 nm"],["b","3,4 nm"],["c","340 nm"]],ans:"a",why:{b:"Mỗi cặp dài 0,34 nm: 100 × 0,34 = 34 nm.",c:"100 × 0,34 = 34 nm."}}],
    done:`<h2>Hoàn thành: DNA và gene</h2><p class="muted">Xoắn kép, nguyên tắc bổ sung A – T, G – C; gene là đoạn DNA mang thông tin di truyền.</p>`},
  gv:["Cho học sinh đếm số cặp base trong một vòng xoắn trên mô hình.","Hỏi: vì sao cặp G – C bền hơn cặp A – T?","Liên hệ: xét nghiệm DNA xác định quan hệ huyết thống dựa vào tính đặc thù của trình tự nucleotide."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 38)</p><ul class="tlist"><li>Nêu được chức năng của DNA trong việc lưu giữ, truyền đạt thông tin di truyền; mô tả cấu trúc DNA (thành phần, xoắn kép, nguyên tắc bổ sung); nêu được khái niệm gene.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 9 (Kết nối tri thức), Bài 38 Nucleic acid và gene.</li>
<li>Số đo DNA dạng B (đường kính khoảng 2 nm, 0,34 nm mỗi cặp base, khoảng 10,5 cặp base mỗi vòng, rãnh lớn – rãnh nhỏ): <a href="https://openstax.org/books/biology-2e/pages/14-2-dna-structure-and-sequencing" target="_blank" rel="noopener">OpenStax Biology 2e, mục 14.2</a>.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Mô hình dùng 10 cặp mỗi vòng theo cách trình bày của SGK. Trình tự nucleotide là ví dụ minh họa, không phải một gene thật. Màu các base là quy ước của mô hình.</li></ul>`;

let S;
LabKHTN.register("K9-S-02",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"lan",t:"Lần"},{k:"tn",t:"Quan sát"},{k:"kq",t:"Kết quả"}],empty:"Kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D phân tử DNA xoắn kép",legend:{w:270},
      views:{xoan:{t:[0,0,0],yaw:.3,pitch:.12,rad:5.6,label:"Xoắn kép",icon:IC.dna},nu:{t:[-9,0,0],yaw:0,pitch:.05,rad:2.9,label:"Nucleotide",icon:IC.cell},gene:{t:[0,-.3,0],yaw:.9,pitch:.1,rad:5.8,label:"Gene",icon:IC.grid},bs:{t:[8,-1.6,0],yaw:0,pitch:.08,rad:2.6,label:"Bổ sung mạch",icon:IC.swap}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={seen:{},tAT:false,tGC:false,sel:null,b:{k:0,err:0},spin:true,recs:0};
    const rec=(tn,kq)=>{S.recs++;api.record({lan:String(S.recs),tn,kq})};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    const PH={color:"#F59E0B",rough:.35,coat:.4},SU={color:"#E8E3D6",rough:.45};
    const pentG=(()=>{const g=G.fromSDF((x,y,z)=>{const a=Math.atan2(z,x);const k=Math.PI/5;const r=Math.hypot(x,z)*Math.cos(((a%(2*k))+2*k)%(2*k)-k);return Math.max(r-.11,Math.abs(y)-.035)},[-.14,-.05,-.14],[.14,.05,.14],[18,8,18]);return g})();
    const sphP=G.sphere(.1,20,14),sphO=G.sphere(.05,12,8),cyl=G.cylinder(.035,1,10,false),BBG=G.cylinder(.045,1,8,false),hb=G.cylinder(.012,1,6,false);
    function seg(par,a,b,geo,mat){const n=par.add(R.mesh(geo,mat));const d=V3.sub(b,a);n.pos=a;n.quat=G.Q.toward(d);n.scl=[1,V3.len(d),1];return n}
    /* ===== dựng xoắn kép ===== */
    function helix(par,seq,opt){opt=opt||{};const pts1=[],pts2=[],bps=[];const y0=-(seq.length-1)*RISE/2;
      for(let i=0;i<seq.length;i++){const th=i*TW,y=y0+i*RISE;const b1=seq[i],b2=PAIR[b1];const n2=[];
        const P1=[Math.cos(th)*RP,y,Math.sin(th)*RP],P2=[Math.cos(th+GAP)*RP,y,Math.sin(th+GAP)*RP];const S1=[Math.cos(th+.22)*RS,y+.05,Math.sin(th+.22)*RS],S2=[Math.cos(th+GAP-.22)*RS,y-.05,Math.sin(th+GAP-.22)*RS];
        pts1.push(P1,S1);pts2.push(P2,S2);
        const p1=par.add(R.mesh(sphP,PH));p1.pos=P1;for(const o of [[.07,.06,0],[-.05,.07,.05]])par.add(R.mesh(sphO,{color:"#E53935",rough:.4})).pos=V3.add(P1,o);
        const s1=par.add(R.mesh(pentG,SU));s1.pos=S1;s1.quat=G.Q.euler(0,-th,0);
        const mid=V3.lerp(S1,S2,.5);const L=V3.dist(S1,S2);const dir=V3.norm(V3.sub(S2,S1));
        const len1=BASE[b1].pur?.56:.4;const e1=V3.add(S1,V3.scale(dir,L*len1/(.56+.4)-.03));
        const bm1=seg(par,S1,e1,cyl,{color:BASE[b1].c,rough:.4});bm1.scl=[2.6,bm1.scl[1],1.1];
        let bm2=null,hbs=[];
        {const p2=par.add(R.mesh(sphP,PH));p2.pos=P2;n2.push(p2);for(const o of [[.07,-.06,0],[-.05,-.07,.05]]){const ox=par.add(R.mesh(sphO,{color:"#E53935",rough:.4}));ox.pos=V3.add(P2,o);n2.push(ox)}
          const s2=par.add(R.mesh(pentG,SU));s2.pos=S2;s2.quat=G.Q.euler(0,-th-GAP,0);n2.push(s2);const e2=V3.add(e1,V3.scale(dir,.06));bm2=seg(par,e2,S2,cyl,{color:BASE[b2].c,rough:.4});bm2.scl=[2.6,bm2.scl[1],1.1];n2.push(bm2);
          const nH=(b1==="G"||b1==="C")?3:2;for(let k=0;k<nH;k++){const off=[0,(k-(nH-1)/2)*.035,0];const h=seg(par,V3.add(e1,off),V3.add(e2,off),hb,{type:"unlit",color:"#FFFFFF",alpha:.85,transparent:true});hbs.push(h);n2.push(h)}
          if(opt.seg2){const BB={color:"#9FC8F0",rough:.4};n2.push(seg(par,P2,S2,BBG,BB));if(i>0){const pv=bps[i-1];n2.push(seg(par,pv.S2,P2,BBG,BB))}}}
        bps.push({i,b1,b2,S1,S2,mid,bm1,bm2,P1,P2,n2})}
      par.add(R.mesh(G.tube(G.spline(pts1,3),.045,8),{color:"#F2C47B",rough:.4,alpha:.85,transparent:true}));
      if(!opt.seg2)par.add(R.mesh(G.tube(G.spline(pts2,3),.045,8),{color:"#9FC8F0",rough:.4,alpha:.85,transparent:true}));
      return bps}
    const hx=root.add(new G.Node());const BP=helix(hx,SEQ);
    /* tay áo bán trong suốt đánh dấu đoạn gene */
    const y0=-(NB-1)*RISE/2;const gl=root.add(R.mesh(G.cylinder(1.25,(GENE[1]-GENE[0])*RISE+.2,48,false),{type:"unlit",color:"#A78BFA",alpha:.14,transparent:true,order:6,side:"double",depth:false}));gl.pos=[0,y0+GENE[0]*RISE-.1,0];
    /* ===== bổ sung mạch ===== */
    const BX=8,bsSeq=SEQ.slice(0,10);const bsN=root.add(new G.Node());bsN.pos=[BX,-1.6,0];const BSP=helix(bsN,bsSeq,{seg2:true});
    function buildBS(){for(const b of BSP)for(const n of b.n2)n.visible=b.i<S.b.k}
    buildBS();
    S.ang=0;const rotY=p=>{const a=S.ang;const c=Math.cos(a),s=Math.sin(a);return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c]};
    /* ===== nhãn ===== */
    const lab=(h,p,v,o)=>K.label(h,p,Object.assign({view:v},o||{}));const top=BP[NB-3];
    const RY=p=>()=>rotY(p);
    lab("Mạch 1 (5′ → 3′)",RY(V3.add(BP[NB-1].P1,[0,.1,0])),"xoan",{dir:"ne",len:30});lab("Mạch 2 (3′ → 5′)",RY(V3.add(BP[NB-1].P2,[0,.1,0])),"xoan",{dir:"nw",len:30});
    lab("Đường kính ≈ 2 nm",[1.05,BP[2].P1[1],0],"xoan",{dir:"e",len:40});lab("1 vòng xoắn ≈ 10 cặp, dài ≈ 3,4 nm",[-1.05,BP[12].P1[1],0],"xoan",{dir:"w",len:40});
    lab("Rãnh lớn",RY([Math.cos(GAP/2+Math.PI)*1.1,BP[16].P1[1],Math.sin(GAP/2+Math.PI)*1.1]),"xoan",{dir:"w",len:30});
    /* ===== mô hình phóng to hai cặp nucleotide (A – T và G – C) ===== */
    const NX=-9,nuN=root.add(new G.Node());nuN.pos=[NX,0,0];
    const ngon=(x,y,n,ap,rot)=>{let d=-1e9;for(let k=0;k<n;k++){const a=rot+k*2*Math.PI/n;d=Math.max(d,x*Math.cos(a)+y*Math.sin(a))}return d-ap};
    const plate=(f,mn,mx)=>G.fromSDF((x,y,z)=>Math.max(f(x,y),Math.abs(z)-.05),[mn[0],mn[1],-.07],[mx[0],mx[1],.07],[30,30,6]);
    const HA=.26,PA=HA*.7947;
    const purG=plate((x,y)=>Math.min(ngon(x,y,6,HA,0),ngon(x+HA+PA,y,5,PA,0)),[-HA-2*PA-.25,-.36],[.36,.36]);   /* vòng 6 cạnh + vòng 5 cạnh, mép chung */
    const pyrG=plate((x,y)=>ngon(x,y,6,HA,0),[-.36,-.36],[.36,.36]);
    const sugG=plate((x,y)=>ngon(x,y,5,.2,Math.PI/2),[-.3,-.3],[.3,.3]);
    const NUL={};
    function nucleo(b,side,y){const sg=side<0?1:-1;const pur=BASE[b].pur;   /* side −1: bên trái, +1: bên phải */
      const xb=side*(pur?.12+HA:.12+HA);const bp=nuN.add(R.mesh(pur?purG:pyrG,{color:BASE[b].c,rough:.45}));bp.pos=[xb,y,0];if(side>0)bp.quat=G.Q.euler(0,0,Math.PI);
      const xBaseEnd=side*(pur?.12+2*HA+2*PA:.12+2*HA);const xs=xBaseEnd+side*.42;const su=nuN.add(R.mesh(sugG,SU));su.pos=[xs,y+.1,0];
      const so=nuN.add(R.mesh(sphO,{color:"#E53935",rough:.4}));so.pos=[xs,y+.3,.0];
      seg(nuN,[xBaseEnd,y,0],[xs-side*.18,y+.05,0],cyl,{color:"#CBD5E1",rough:.5});
      const xp=xs+side*.62,yp=y+.42;const P=nuN.add(R.mesh(G.sphere(.17,20,14),PH));P.pos=[xp,yp,0];
      for(const o of [[0,.24,0],[side*.22,-.06,.08],[side*.05,-.12,-.2],[-side*.2,-.08,.1]])nuN.add(R.mesh(G.sphere(.085,14,10),{color:"#E53935",rough:.4})).pos=V3.add([xp,yp,0],o);
      seg(nuN,[xs+side*.18,y+.18,0],[xp-side*.2,yp-.08,0],cyl,{color:"#CBD5E1",rough:.5});
      return{xb,xs,xp,yp,xBaseEnd,y}}
    function pair(b1,y){const L=nucleo(b1,-1,y),Rr=nucleo(PAIR[b1],1,y);const nH=(b1==="G"||b1==="C")?3:2;
      for(let k=0;k<nH;k++){const yy=y+(k-(nH-1)/2)*.17;for(let d=0;d<3;d++){const x0=-.11+d*.08;seg(nuN,[x0,yy,0],[x0+.045,yy,0],G.cylinder(.018,1,6,false),{type:"unlit",color:"#FFFFFF"})}}
      return{L,R:Rr}}
    const PAT=pair("A",.95),PGC=pair("G",-.95);
    /* liên kết đường – phosphate giữa hai nucleotide kế tiếp trên cùng một mạch */
    seg(nuN,[PGC.L.xp,PGC.L.yp+.2,0],[PAT.L.xs-.1,PAT.L.y-.1,0],cyl,{color:"#CBD5E1",rough:.5});seg(nuN,[PGC.R.xp,PGC.R.yp+.2,0],[PAT.R.xs+.1,PAT.R.y-.1,0],cyl,{color:"#CBD5E1",rough:.5});
    const np=(p)=>V3.add([NX,0,0],p);
    lab("Nhóm phosphate",np([PAT.L.xp,PAT.L.yp+.15,0]),"nu",{dir:"nw",len:40});lab("Đường deoxyribose",np([PAT.R.xs,PAT.R.y+.25,0]),"nu",{dir:"ne",len:40});
    lab("A – adenine (2 vòng)",np([PAT.L.xb-.2,.95,0]),"nu",{dir:"n",len:55});lab("T – thymine (1 vòng)",np([PAT.R.xb,.95+.2,0]),"nu",{dir:"n",len:30});
    lab("G – guanine",np([PGC.L.xb-.2,-.95-.25,0]),"nu",{dir:"s",len:40});lab("C – cytosine",np([PGC.R.xb,-.95-.25,0]),"nu",{dir:"s",len:40});
    lab("2 liên kết hydrogen",np([0,.95,0]),"nu",{dir:"n",len:90});lab("3 liên kết hydrogen",np([0,-.95,0]),"nu",{dir:"s",len:90});
    lab("Liên kết đường – phosphate",np([(PGC.R.xp+PAT.R.xs)/2+.05,0,0]),"nu",{dir:"e",len:40});
    lab("Gene",[1.25,y0+(GENE[0]+GENE[1])/2*RISE,0],"gene",{dir:"e",len:40});lab("Đoạn DNA ngoài gene",[1.1,y0+3*RISE,0],"gene",{dir:"e",len:40});
    const lBs=lab("",[BX,.4,0],"bs",{dir:"n",len:6,cls:"plain"});
    /* ===== cập nhật ===== */
    K.onFrame(sdt=>{const v=K.view;hx.visible=v==="xoan"||v==="gene";nuN.visible=v==="nu";gl.visible=v==="gene";if(S.spin&&(v==="xoan"||v==="gene"))S.ang+=sdt*.25;hx.quat=G.Q.euler(0,S.ang,0);
      bsN.visible=v==="bs";if(v==="bs")bsN.quat=G.Q.euler(0,Math.sin(K.simT*.4)*.35,0);
      for(const b of BP){const hi=S.sel===b.i;b.bm1.scl[0]=hi?3.4:2.6;if(b.bm2)b.bm2.scl[0]=hi?3.4:2.6}
      lBs.set(`<div style="text-align:center">Mạch 1: ${bsSeq.split("").join(" ")}<br>${S.b.k<10?`Chọn base bổ sung cho vị trí ${S.b.k+1}`:"Đã lắp xong mạch 2"}</div>`)});
    const viewSeen=v=>{if(!S.seen[v]){S.seen[v]=1;if(v==="nu")rec("Cấu tạo một nucleotide","gồm nhóm phosphate, đường deoxyribose (5 carbon) và một base nitrogen (A, T, G hoặc C)");if(v==="gene")rec("Gene trên phân tử DNA",`đoạn từ cặp ${GENE[0]+1} đến cặp ${GENE[1]} (${GENE[1]-GENE[0]} cặp nucleotide) là một gene minh họa; phân tử DNA thật có hàng nghìn gene`);refresh()}};
    const og=K.goView;K.goView=function(v,i){og(v,i);viewSeen(v)};
    /* ===== chạm ===== */
    K.pickFn((x,y)=>{if(K.view!=="xoan"&&K.view!=="gene")return null;const r=R.ray(x,y);let best=null,bd=1e9;const q=hx.quat;
      for(const b of BP){const t=G.hit.sphere(r,rotY(b.mid),.28);if(t!=null&&t<bd){bd=t;best=b}}return best?{b:best}:null});
    K.tapFn(k=>{if(!k)return;const b=k.b;S.sel=b.i;const at=b.b1==="A"||b.b1==="T";if(at)S.tAT=true;else S.tGC=true;
      rec(`Cặp base thứ ${b.i+1}`,`${BASE[b.b1].ten} (${b.b1}) – ${BASE[b.b2].ten} (${b.b2}): ${at?2:3} liên kết hydrogen`);refresh()});
    K.dockFn(()=>{const v=K.view;if(v==="bs")return[{grid:["A","T","G","C"].map(x=>({k:"pick",v:x,label:x,title:BASE[x].ten,icon:`<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="${BASE[x].c}"/></svg>`,dis:S.b.k>=10}))},{k:"rbs",label:"Làm lại",icon:IC.reset}];
      if(v==="xoan"||v==="gene")return[{k:"spin",label:S.spin?"Dừng xoay":"Tự xoay",icon:IC.swap,on:S.spin},{k:"rnd",label:"Chọn một cặp base ngẫu nhiên",icon:IC.eye}];return[]});
    K.onDock((k,v)=>{if(k==="spin")S.spin=!S.spin;else if(k==="rnd"){const b=BP[Math.floor(Math.random()*NB)];K._tap({b})}
      else if(k==="pick"){const need=PAIR[bsSeq[S.b.k]];if(v===need){S.b.k++;buildBS();if(S.b.k===10)rec("Lắp mạch 2 theo nguyên tắc bổ sung",`mạch 1: 5′-${bsSeq}-3′ → mạch 2: 3′-${bsSeq.split("").map(x=>PAIR[x]).join("")}-5′ (sai ${S.b.err} lần)`)}else{S.b.err++;api.toast(`${bsSeq[S.b.k]} chỉ liên kết với ${need}.`,"warn",1800)}}
      else if(k==="rbs"){S.b={k:0,err:0};buildBS()}refresh()});
    K.infoFn(()=>{const v=K.view;
      if(v==="xoan"){const b=S.sel!=null?BP[S.sel]:null;return `<div><b>Chuỗi xoắn kép DNA</b> · ${NB} cặp nucleotide</div>${Object.keys(BASE).map(k=>`<div><i style="background:${BASE[k].c}"></i>${k} – ${BASE[k].ten}</div>`).join("")}${b?`<div style="margin-top:6px"><b>Cặp ${b.i+1}: ${b.b1} – ${b.b2}</b> · ${(b.b1==="G"||b.b1==="C")?3:2} liên kết hydrogen</div>`:"<small>Chạm vào một cặp base.</small>"}`}
      if(v==="nu")return `<div><b>Nucleotide</b> – đơn phân của DNA</div><div>Nhóm phosphate · đường deoxyribose · base nitrogen</div><small>Có 4 loại nucleotide, phân biệt bởi base: A, T, G, C. A, G có 2 vòng; T, C có 1 vòng, nên mỗi cặp bổ sung (A – T hoặc G – C) có chiều dài gần bằng nhau và đường kính xoắn kép ổn định.</small>`;
      if(v==="gene")return `<div><b>Gene</b></div><small>Gene là một đoạn DNA mang thông tin di truyền mã hóa một sản phẩm. Trong mô hình, gene là đoạn được tô tím (${GENE[1]-GENE[0]} cặp); gene thật thường dài hàng trăm tới hàng nghìn cặp nucleotide.</small>`;
      return `<div><b>Lắp mạch 2</b></div><div>Đã lắp: ${S.b.k}/10 · sai: ${S.b.err}</div><small>A – T, G – C.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    /* trạm tự động */K.autoStations&&K.autoStations();
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){const a=BP.find(b=>b.b1==="A"),g=BP.find(b=>b.b1==="G");K._tap({b:a});K._tap({b:g});viewSeen("nu");viewSeen("gene");for(const x of bsSeq)K._dockH("pick",PAIR[x])}};
    return K.mount(st)}
});
})();
