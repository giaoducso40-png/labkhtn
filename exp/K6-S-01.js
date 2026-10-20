/* K6-S-01 · Cấu tạo tế bào: tế bào động vật, tế bào thực vật, tế bào nhân sơ (SGK KHTN 6 – Kết nối tri thức, Bài 17 Tế bào) · 3D
   Mô hình cắt bỏ một phần tư để nhìn vào bên trong (kiểu hình vẽ cắt trong sách). Mặt cắt của mỗi khối được tô màu riêng.
   Thành phần chính của tế bào: màng tế bào, chất tế bào, nhân (tế bào nhân thực) hoặc vùng nhân (tế bào nhân sơ).
   Thực vật có thêm thành tế bào, lục lạp, không bào trung tâm lớn. Vi khuẩn: thành tế bào, màng, chất tế bào, vùng nhân, roi, lông.
   Hình dạng, kích thước, số lượng bào quan là mô hình minh họa, không theo tỉ lệ thật. */
(function(){
"use strict";
const C=window.LabCore,G=window.LabGL,KIT=window.LabKit,K3=window.LabChem3D,IC=KIT.ICON,V3=G.V3,Q=G.Q,H=G.hex;
const PART={
  mang:{t:"Màng tế bào",f:"Bao bọc chất tế bào; bảo vệ và kiểm soát sự trao đổi chất giữa tế bào với môi trường."},
  chat:{t:"Chất tế bào",f:"Nơi diễn ra phần lớn các hoạt động sống của tế bào; chứa các bào quan."},
  nhan:{t:"Nhân",f:"Có màng nhân bao bọc, chứa vật chất di truyền; điều khiển mọi hoạt động sống của tế bào."},
  nhancon:{t:"Nhân con",f:"Nằm trong nhân, nơi tạo ra các thành phần của ribosome."},
  tithe:{t:"Ti thể",f:"Nơi diễn ra hô hấp tế bào, tạo năng lượng cho tế bào hoạt động."},
  lnc:{t:"Lưới nội chất",f:"Hệ thống túi và ống trong chất tế bào; tham gia tổng hợp và vận chuyển các chất."},
  golgi:{t:"Bộ máy Golgi",f:"Thu nhận, hoàn thiện, đóng gói và chuyển các chất đến nơi cần dùng."},
  ribo:{t:"Ribosome",f:"Hạt rất nhỏ, nơi tổng hợp protein (có ở cả tế bào nhân sơ và nhân thực)."},
  thanh:{t:"Thành tế bào",f:"Lớp bao ngoài màng tế bào, giúp tế bào có hình dạng ổn định và được bảo vệ."},
  lucl:{t:"Lục lạp",f:"Chứa chất diệp lục, nơi diễn ra quang hợp; chỉ có ở tế bào thực vật (phần xanh của cây)."},
  khong:{t:"Không bào trung tâm",f:"Túi lớn chứa dịch tế bào; giữ nước, giúp tế bào căng."},
  vungnhan:{t:"Vùng nhân",f:"Chứa vật chất di truyền nhưng không có màng nhân bao bọc."},
  roi:{t:"Roi",f:"Giúp vi khuẩn di chuyển."},
  long:{t:"Lông",f:"Giúp vi khuẩn bám vào bề mặt."}};
const CELL={dv:{t:"Tế bào động vật",parts:["mang","chat","nhan","nhancon","tithe","lnc","golgi","ribo"],need:["mang","chat","nhan"]},
  tv:{t:"Tế bào thực vật",parts:["thanh","mang","chat","nhan","lucl","khong","tithe"],need:["thanh","lucl","khong"]},
  ns:{t:"Tế bào nhân sơ (vi khuẩn)",parts:["thanh","mang","chat","vungnhan","ribo","roi","long"],need:["vungnhan","roi"]}};
const SPEC={
  predict:[{id:"p1",q:"Thành phần nào có ở tế bào thực vật nhưng không có ở tế bào động vật?",opts:[["luc","Lục lạp và thành tế bào"],["nhan","Nhân"],["mang","Màng tế bào"]],ans:"luc",res:"Kết quả: tế bào thực vật có thành tế bào, lục lạp và không bào trung tâm lớn."},
    {id:"p2",q:"Tế bào vi khuẩn có nhân hoàn chỉnh (có màng nhân) không?",opts:[["khong","Không, chỉ có vùng nhân"],["co","Có"],["kbiet","Vi khuẩn không có vật chất di truyền"]],ans:"khong",res:"Kết quả: vi khuẩn là tế bào nhân sơ, vật chất di truyền nằm ở vùng nhân."}],
  taskLead:"Xoay mô hình, chạm vào từng thành phần hoặc chọn ở khay để xem tên và chức năng.",
  tasks:[{html:"<b>Tế bào động vật:</b> tìm màng tế bào, chất tế bào, nhân.",done:()=>CELL.dv.need.every(p=>S.seen.dv[p])},{html:"<b>Tế bào thực vật:</b> tìm thành tế bào, lục lạp, không bào.",done:()=>CELL.tv.need.every(p=>S.seen.tv[p])},{html:"<b>Tế bào nhân sơ:</b> tìm vùng nhân và roi.",done:()=>CELL.ns.need.every(p=>S.seen.ns[p])}],
  obs:[{id:"a",q:"Ba thành phần chính có ở mọi tế bào là:",opts:[["ok","Màng tế bào, chất tế bào, nhân hoặc vùng nhân"],["luc","Thành tế bào, lục lạp, không bào"],["roi","Roi, lông, ribosome"]],ans:"ok",why:"Tế bào nhân thực có nhân; tế bào nhân sơ có vùng nhân."},
    {id:"b",q:"Điểm khác nhau cơ bản giữa tế bào nhân sơ và nhân thực:",opts:[["ok","Nhân sơ chưa có nhân hoàn chỉnh (không có màng nhân)"],["mang","Nhân sơ không có màng tế bào"],["chat","Nhân sơ không có chất tế bào"]],ans:"ok",why:"Tế bào nhân sơ cũng có màng tế bào và chất tế bào."},
    {id:"c",q:"Lục lạp có vai trò:",opts:[["qh","Quang hợp"],["dc","Điều khiển hoạt động sống"],["bv","Bảo vệ tế bào"]],ans:"qh",why:"Lục lạp chứa diệp lục, hấp thụ ánh sáng để quang hợp."}],
  concl:{html:`<ul class="tlist"><li>Tế bào gồm ba thành phần chính: <b>màng tế bào</b>, <b>chất tế bào</b>, <b>nhân</b> (tế bào nhân thực) hoặc <b>vùng nhân</b> (tế bào nhân sơ).</li>
    <li><b>Tế bào nhân sơ</b> (vi khuẩn) chưa có nhân hoàn chỉnh; <b>tế bào nhân thực</b> (động vật, thực vật) có nhân với màng nhân và nhiều bào quan có màng.</li>
    <li>Tế bào thực vật khác tế bào động vật: có <b>thành tế bào</b>, <b>lục lạp</b> và <b>không bào trung tâm</b> lớn.</li></ul>`,
    quiz:[{id:"q1",q:"Nơi điều khiển mọi hoạt động sống của tế bào là:",opts:[["a","Nhân"],["b","Màng tế bào"],["c","Không bào"]],ans:"a",why:{b:"Màng tế bào kiểm soát trao đổi chất.",c:"Không bào chứa dịch tế bào."}},
      {id:"q2",q:"Tế bào nào sau đây là tế bào nhân sơ?",opts:[["a","Vi khuẩn"],["b","Tế bào lá cây"],["c","Tế bào da người"]],ans:"a",why:{b:"Tế bào thực vật là nhân thực.",c:"Tế bào động vật là nhân thực."}}],
    done:`<h2>Hoàn thành: Cấu tạo tế bào</h2><p class="muted">Màng tế bào, chất tế bào, nhân/vùng nhân; thực vật có thêm thành tế bào, lục lạp, không bào.</p>`},
  gv:["Mô hình cắt một phần tư để học sinh thấy bên trong; dùng nút “Nguyên khối” để xem hình dạng bên ngoài.","So sánh ba tế bào bằng bảng: thành phần nào chung, thành phần nào riêng.","Các bào quan như ti thể, lưới nội chất, bộ máy Golgi, ribosome chỉ giới thiệu tên và vai trò ở mức nhận biết."]};
const GVH=`<p><b>Yêu cầu cần đạt</b> (Bài 17)</p><ul class="tlist"><li>Nêu được khái niệm tế bào, chức năng của tế bào; mô tả được hình dạng và kích thước của một số loại tế bào.</li><li>Trình bày được cấu tạo tế bào và chức năng mỗi thành phần (ba thành phần chính: màng tế bào, chất tế bào, nhân tế bào); nhận biết được lục lạp là bào quan thực hiện chức năng quang hợp ở cây xanh.</li><li>Phân biệt được tế bào động vật, tế bào thực vật; tế bào nhân thực, tế bào nhân sơ thông qua quan sát hình ảnh.</li></ul>`;
const SRC=`<ul class="tlist"><li>Nội dung bài: SGK KHTN 6 (Kết nối tri thức), Bài 17 Tế bào.</li></ul>
<p style="margin-top:10px"><b>Giả định của mô hình</b></p><ul class="tlist"><li>Mô hình cắt một phần tư; hình dạng, kích thước, màu sắc và số lượng bào quan chỉ để minh họa (màu sắc là quy ước, tế bào thật phần lớn không màu).</li><li>Ba tế bào không vẽ cùng tỉ lệ: tế bào vi khuẩn thật nhỏ hơn nhiều so với tế bào động vật, thực vật.</li></ul>`;

const CUTFS=`{vec3 q=vW-uCC;if(uCut>.5&&q.x>0.&&q.z>0.)discard;
 if(!gl_FrontFacing&&uFlat>.5){float n=vn(vW*36.)*.6+vn(vW*90.)*.4;vec3 c=uCutC*(.9+.14*n);
   if(uPat>.5&&uPat<1.5){float s=sin(vO.x*95.+sin(vO.y*40.)*2.);c*=mix(1.,.62,smoothstep(.55,.9,s));}
   if(uPat>1.5){float s=sin(vO.y*150.);float g=step(.45,vn(vO*26.));c*=mix(1.,.55,smoothstep(.3,.8,s)*g);}
   if(uPat>2.5){c=mix(c,uCutC*.8,smoothstep(.7,.76,vn(vW*60.)));}
   c*=1.+uHl*(.25+.2*sin(uTime*6.));frag=vec4(pow(c,vec3(.4545)),1.);return;}
 emis+=base.rgb*uHl*(.25+.2*sin(uTime*6.));}`;
let S;
LabKHTN.register("K6-S-01",{
  steps:["Dự đoán","Làm","Quan sát","Giải thích"],
  table:{cols:[{k:"tb",t:"Tế bào"},{k:"tp",t:"Thành phần"},{k:"cn",t:"Chức năng"}],empty:"Chạm vào các thành phần, kết quả tự ghi vào bảng."},
  gv:GVH,sources:SRC,
  mount(api){
    const K=KIT.scene3D(api,{aria:"Mô hình 3D cấu tạo tế bào động vật, thực vật, nhân sơ",legend:{w:300},seed:17,
      views:{dv:{t:[0,0,0],yaw:.8,pitch:.42,rad:1.15,label:"Tế bào động vật",icon:IC.eye},tv:{t:[0,0,0],yaw:.8,pitch:.42,rad:1.75,label:"Tế bào thực vật",icon:IC.leaf||IC.eye},ns:{t:[.1,0,0],yaw:-.6,pitch:.38,rad:1.75,label:"Tế bào nhân sơ",icon:IC.grid}}});
    if(!K.ok)return K.mount(null);
    const R=K.R,root=K.root;
    S={cut:true,sel:null,seen:{dv:{},tv:{},ns:{}},recs:0};
    const st=KIT.steps(api,SPEC);const refresh=()=>{st.refresh();K.refreshDock();K.updateInfo(true)};
    let seed=101;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
    /* ---------- tiện ích hình học ---------- */
    function normals(P,I){const N=new Float32Array(P.length);for(let i=0;i<I.length;i+=3){const a=I[i]*3,b=I[i+1]*3,c=I[i+2]*3;const ux=P[b]-P[a],uy=P[b+1]-P[a+1],uz=P[b+2]-P[a+2],vx=P[c]-P[a],vy=P[c+1]-P[a+1],vz=P[c+2]-P[a+2];const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;for(const k of [a,b,c]){N[k]+=nx;N[k+1]+=ny;N[k+2]+=nz}}
      for(let i=0;i<N.length;i+=3){const l=Math.hypot(N[i],N[i+1],N[i+2])||1;N[i]/=l;N[i+1]/=l;N[i+2]/=l}return N}
    function weld(g){/* ghép normal tại đường nối của khối cầu */const P=g.pos,N=g.nrm,map=new Map();for(let i=0;i<P.length;i+=3){const k=`${P[i].toFixed(4)},${P[i+1].toFixed(4)},${P[i+2].toFixed(4)}`;if(!map.has(k))map.set(k,[]);map.get(k).push(i)}
      for(const L of map.values())if(L.length>1){let x=0,y=0,z=0;for(const i of L){x+=N[i];y+=N[i+1];z+=N[i+2]}const l=Math.hypot(x,y,z)||1;for(const i of L){N[i]=x/l;N[i+1]=y/l;N[i+2]=z/l}}return g}
    function blob(radFn,su,sv){const g=G.sphere(1,su||72,sv||48);const P=new Float32Array(g.pos);for(let i=0;i<P.length;i+=3){const d=V3.norm([P[i],P[i+1],P[i+2]]);const r=radFn(d);P[i]=d[0]*r;P[i+1]=d[1]*r;P[i+2]=d[2]*r}
      return weld({pos:P,nrm:normals(P,g.idx),idx:g.idx,uv:g.uv,col:null})}
    function xformG(g,f){const P=new Float32Array(g.pos);for(let i=0;i<P.length;i+=3){const v=f([P[i],P[i+1],P[i+2]]);P[i]=v[0];P[i+1]=v[1];P[i+2]=v[2]}return weld({pos:P,nrm:normals(P,g.idx),idx:g.idx,uv:g.uv,col:null})}
    const supE=(a,b,c,n)=>d=>Math.pow(Math.pow(Math.abs(d[0])/a,n)+Math.pow(Math.abs(d[1])/b,n)+Math.pow(Math.abs(d[2])/c,n),-1/n);
    const capsR=(h,a)=>d=>{let lo=0,hi=h+a+.01;for(let k=0;k<40;k++){const t=(lo+hi)/2;const p=V3.scale(d,t);const cx=C.clamp(p[0],-h,h);const dd=Math.hypot(p[0]-cx,p[1],p[2]);if(dd<a)lo=t;else hi=t}return lo};
    /* ---------- vật liệu cắt ---------- */
    const MATS=[];
    function cm(col,cut,key,o){o=o||{};const m={type:"std",color:col,rough:o.rough==null?.45:o.rough,coat:o.coat==null?.35:o.coat,sheen:o.sheen||0,side:"double",key:"cell_"+key,
        hooks:{fu:K3.NOISE+"uniform vec3 uCC,uCutC;uniform float uCut,uHl,uFlat,uPat;",fs:CUTFS},uniforms:{uCC:[0,0,0],uCutC:H(cut||col),uCut:1,uHl:0,uFlat:o.flat===false?0:1,uPat:o.pat||0}};return m}
    const groups={dv:root.add(new G.Node()),tv:root.add(new G.Node()),ns:root.add(new G.Node())};
    const PARTM={dv:{},tv:{},ns:{}};   /* phần → danh sách mesh để tô sáng */
    const PICK={dv:[],tv:[],ns:[]};
    function add(cell,part,node){groups[cell].add(node);(PARTM[cell][part]=PARTM[cell][part]||[]).push(node);const walk=n=>{if(n.mat&&n.mat.uniforms&&n.mat.uniforms.uHl!=null)MATS.push(n.mat);(n.children||[]).forEach(walk)};walk(node);return node}
    const inCut=p=>p[0]>0&&p[2]>0;
    function randIn(rmax,test){for(let k=0;k<400;k++){const p=[(rnd()*2-1)*rmax[0],(rnd()*2-1)*rmax[1],(rnd()*2-1)*rmax[2]];if(test(p))return p}return null}
    /* bào quan dùng chung */
    const mitoG=(()=>{const a=.055,h=.07,pr=[];for(let i=0;i<=8;i++){const t=-Math.PI/2+i/8*Math.PI/2;pr.push([Math.cos(t)*a,-h+Math.sin(t)*a])}for(let i=0;i<=8;i++){const t=i/8*Math.PI/2;pr.push([Math.cos(t)*a,h+Math.sin(t)*a])}pr[0][0]=.0005;pr[pr.length-1][0]=.0005;return xformG(G.lathe(pr,28),v=>[v[0],v[1],v[2]*.78])})();
    function mito(cell,p,s){const m=R.mesh(mitoG,cm("#F97316","#FDBA74","mito",{pat:1,rough:.5}));m.pos=p;m.quat=Q.euler(rnd()*3,rnd()*3,rnd()*3);m.scl=[s,s,s];add(cell,"tithe",m);PICK[cell].push({part:"tithe",c:p,r:.12*s});return m}
    function riboField(cell,n,test,ext,col){const m=R.instanced(G.sphere(1,6,4),cm(col||"#7C3AED","#7C3AED","ribo",{flat:false,coat:0}),n);let c=0;const D=m.data;for(let i=0;i<n*3&&c<n;i++){const p=randIn(ext,test);if(!p)break;D.set([p[0],p[1],p[2],.0085,1,1,1,1],c*8);c++}m.setInstances(c);add(cell,"ribo",m);return m}
    /* ================= 1. TẾ BÀO ĐỘNG VẬT ================= */
    {const cell="dv";const rA=d=>{const th=Math.atan2(d[2],d[0]);return 1*(1+.05*Math.sin(3*th+.7)*(1-d[1]*d[1])+.035*Math.sin(4*d[1]+1.3)+.025*Math.sin(5*th+2)*(1-d[1]*d[1]))*(1-.08*d[1]*d[1])};
      add(cell,"mang",R.mesh(blob(rA),cm("#F0ABFC","#FDE7D6","dvmem",{sheen:.5,coat:.5,pat:3})));
      PARTM.dv.chat=[];
      const nuc=add(cell,"nhan",R.mesh(blob(d=>.33*(1+.03*Math.sin(5*d[0]+2*d[1])),56,40),cm("#7C3AED","#C4B5FD","dvnuc",{coat:.4})));nuc.pos=[-.03,.02,-.03];
      const pores=R.instanced(G.sphere(1,6,4),cm("#4C1D95","#4C1D95","pore",{flat:false,coat:0}),160);{let c=0;const D=pores.data;for(let i=0;i<300&&c<160;i++){const th=rnd()*6.283,ph=Math.acos(2*rnd()-1);const d=[Math.sin(ph)*Math.cos(th),Math.cos(ph),Math.sin(ph)*Math.sin(th)];const p=V3.add(nuc.pos,V3.scale(d,.333));D.set([p[0],p[1],p[2],.012,1,1,1,1],c*8);c++}pores.setInstances(c)}add(cell,"nhan",pores);
      const nl=add(cell,"nhancon",R.mesh(G.sphere(.11,32,24),cm("#4C1D95","#6D28D9","dvnl",{coat:.3})));nl.pos=[-.08,.07,-.06];
      PICK.dv.push({part:"nhancon",c:[-.08,.07,-.06],r:.12},{part:"nhan",c:nuc.pos,r:.34});
      /* lưới nội chất hạt: các tấm cong lượn sóng quanh nhân */
      const er=[];for(let k=0;k<4;k++){const r0=.42+k*.055,P=[],I=[];const NU=60,NV=10;const t0=Math.PI*.55+k*.06,t1=Math.PI*1.95-k*.05;
        for(let j=0;j<=NV;j++)for(let i=0;i<=NU;i++){const t=t0+(t1-t0)*i/NU,v=-1+2*j/NV;const rr=r0+.018*Math.sin(t*9+k)+.012*Math.sin(v*5+t*3);const y=v*(.2-.02*k)+.03*Math.sin(t*4+k);P.push(-.03+Math.cos(t)*rr,.02+y,-.03+Math.sin(t)*rr)}
        for(let j=0;j<NV;j++)for(let i=0;i<NU;i++){const a=j*(NU+1)+i,b=a+NU+1;I.push(a,b,a+1,b,b+1,a+1)}const Pf=new Float32Array(P),If=new Uint16Array(I);er.push({pos:Pf,nrm:normals(Pf,If),idx:If,uv:null,col:null})}
      const erM=add(cell,"lnc",R.mesh(G.merge(er),cm("#60A5FA","#60A5FA","dver",{flat:false,rough:.35,coat:.5})));
      {const m=R.instanced(G.sphere(1,6,4),cm("#1E3A8A","#1E3A8A","erribo",{flat:false,coat:0}),500);let c=0;const D=m.data;er.forEach(g=>{for(let i=0;i<g.pos.length&&c<500;i+=3*7){D.set([g.pos[i]+g.nrm[i]*.006,g.pos[i+1]+g.nrm[i+1]*.006,g.pos[i+2]+g.nrm[i+2]*.006,.0075,1,1,1,1],c*8);c++}});m.setInstances(c);add(cell,"lnc",m)}
      PICK.dv.push({part:"lnc",c:[-.45,.02,-.3],r:.2},{part:"lnc",c:[.3,.02,-.45],r:.18},{part:"lnc",c:[-.5,.02,.25],r:.16});
      /* lưới nội chất trơn: ống lượn */
      {const T=[];for(let k=0;k<6;k++){const pts=[];let p=[-.25-rnd()*.3,-.35+rnd()*.15,-.45-rnd()*.2];for(let i=0;i<8;i++){pts.push(p.slice());p=V3.add(p,[(rnd()-.4)*.09,(rnd()-.5)*.08,(rnd()-.3)*.09])}T.push(G.tube(G.spline(pts,4),.014,6))}add(cell,"lnc",R.mesh(G.merge(T),cm("#5EEAD4","#99F6E4","dvser",{rough:.3})))}
      /* bộ máy Golgi */
      {const gn=new G.Node();gn.pos=[.05,.38,-.55];gn.quat=Q.euler(.25,.4,-.15);for(let k=0;k<5;k++){const w=.2-k*.018,d=.11-k*.008;const g=xformG(G.sphere(1,36,14),v=>{const x=v[0]*w,z=v[2]*d;return[x,v[1]*.016+k*.034+2.2*x*x,z]});gn.add(R.mesh(g,cm("#FACC15","#FEF08A","golgi",{rough:.35})))}
        for(let i=0;i<7;i++){const a=rnd()*6.283;gn.add(R.mesh(G.sphere(.018,12,8),cm("#FDE047","#FEF9C3","gves"))).pos=[Math.cos(a)*.24,.05+rnd()*.15,Math.sin(a)*.1]}add(cell,"golgi",gn);PICK.dv.push({part:"golgi",c:[.05,.45,-.55],r:.2})}
      /* ti thể */
      for(let i=0;i<11;i++){const p=randIn([.8,.6,.8],q=>{const l=V3.len(q);return l<.78&&l>.5&&!inCut(q)&&!(q[1]>.25&&q[2]<-.35)});if(p)mito(cell,p,.9+rnd()*.4)}
      /* tiêu thể / túi nhỏ */
      for(let i=0;i<6;i++){const p=randIn([.75,.6,.75],q=>{const l=V3.len(q);return l<.75&&l>.5&&!inCut(q)});if(p){const m=R.mesh(G.sphere(.04,16,12),cm("#FB7185","#FECDD3","lyso"));m.pos=p;add(cell,"chat",m)}}
      riboField(cell,260,q=>{const l=V3.len(q);return l<.85&&l>.4&&!inCut(q)},[.9,.75,.9]);
}
    /* ================= 2. TẾ BÀO THỰC VẬT ================= */
    {const cell="tv";const A=1.25,B=.82,Cc=.82;
      add(cell,"thanh",R.mesh(blob(supE(A,B,Cc,7),88,56),cm("#65A30D","#A3B86C","tvwall",{rough:.6,coat:.15,pat:3})));
      add(cell,"mang",R.mesh(blob(supE(A-.06,B-.06,Cc-.06,7),88,56),cm("#F0ABFC","#F0ABFC","tvmem",{rough:.4})));
      add(cell,"chat",R.mesh(blob(supE(A-.075,B-.075,Cc-.075,7),88,56),cm("#ECFCCB","#F3F7D9","tvcyt",{rough:.5,pat:3})));
      const vac=add(cell,"khong",R.mesh(blob(supE(.82,.5,.52,4),72,48),cm("#BFDBFE","#DBEAFE","tvvac",{rough:.15,coat:.7})));vac.pos=[-.22,-.04,-.06];PICK.tv.push({part:"khong",c:[-.22,-.04,-.06],r:.5});
      const nuc=add(cell,"nhan",R.mesh(G.sphere(.2,48,32),cm("#7C3AED","#C4B5FD","tvnuc")));nuc.pos=[.78,.28,-.1];const nl=add(cell,"nhan",R.mesh(G.sphere(.065,24,16),cm("#4C1D95","#6D28D9","tvnl")));nl.pos=[.8,.3,-.12];PICK.tv.push({part:"nhan",c:nuc.pos,r:.21});
      const chlG=xformG(G.sphere(1,32,20),v=>[v[0]*.11,v[1]*.045,v[2]*.075]);
      let nC=0;for(let i=0;i<400&&nC<22;i++){const p=randIn([A-.12,B-.12,Cc-.12],q=>{if(inCut(q))return false;const e=Math.pow(Math.abs(q[0])/(A-.12),6)+Math.pow(Math.abs(q[1])/(B-.12),6)+Math.pow(Math.abs(q[2])/(Cc-.12),6);if(e>1||e<.45)return false;const v=V3.sub(q,vac.pos);return Math.pow(Math.abs(v[0])/.92,4)+Math.pow(Math.abs(v[1])/.6,4)+Math.pow(Math.abs(v[2])/.62,4)>1&&V3.len(V3.sub(q,nuc.pos))>.3});
        if(!p)continue;const m=R.mesh(chlG,cm("#16A34A","#4ADE80","chl",{pat:2,rough:.4}));m.pos=p;const n=V3.norm([p[0]/A/A,p[1]/B/B,p[2]/Cc/Cc]);m.quat=Q.euler(Math.atan2(n[2],n[1])*.9+rnd()*.3,rnd()*3,Math.atan2(n[0],n[1])*.9);add(cell,"lucl",m);PICK.tv.push({part:"lucl",c:p,r:.11});nC++}
      for(let i=0;i<6;i++){const p=randIn([A-.15,B-.15,Cc-.15],q=>{if(inCut(q))return false;const v=V3.sub(q,vac.pos);return Math.pow(Math.abs(v[0])/.92,4)+Math.pow(Math.abs(v[1])/.6,4)+Math.pow(Math.abs(v[2])/.62,4)>1.05});if(p)mito(cell,p,.8)}}
    /* ================= 3. TẾ BÀO NHÂN SƠ ================= */
    {const cell="ns";const h=.72,a=.36;
      add(cell,"thanh",R.mesh(blob(capsR(h,a),80,48),cm("#A3E635","#BEF264","nswall",{rough:.55,coat:.2})));
      add(cell,"mang",R.mesh(blob(capsR(h,a-.04),80,48),cm("#F0ABFC","#F0ABFC","nsmem")));
      add(cell,"chat",R.mesh(blob(capsR(h,a-.055),80,48),cm("#FEF3C7","#FEF3C7","nscyt",{pat:3})));
      /* vùng nhân: sợi DNA xoắn rối, không có màng bao */
      {const pts=[];for(let i=0;i<=90;i++){const t=i/90*6.283;pts.push([.42*Math.sin(t)+.06*Math.sin(t*7),.13*Math.sin(t*3+.5)+.04*Math.sin(t*11),.14*Math.cos(t*2)+.05*Math.cos(t*9)])}
        add(cell,"vungnhan",R.mesh(G.tube(G.spline(pts,3),.012,6),cm("#7C3AED","#A78BFA","nsdna",{rough:.4})));PICK.ns.push({part:"vungnhan",c:[0,0,0],r:.3})}
      riboField(cell,220,q=>{const cx=C.clamp(q[0],-h,h);return Math.hypot(q[0]-cx,q[1],q[2])<a-.08&&!inCut(q)&&Math.hypot(q[1],q[2])>.05},[h+a,a,a],"#7C3AED");
      /* roi: xoắn dài ở đầu trái */
      {const pts=[];for(let i=0;i<=160;i++){const t=i/160;pts.push([-(h+a-.02)-t*2.1,Math.sin(t*6.283*3.2)*.09*Math.min(1,t*4),Math.cos(t*6.283*3.2)*.09*Math.min(1,t*4)])}add(cell,"roi",R.mesh(G.tube(pts,.012,6),cm("#A16207","#A16207","nsroi",{flat:false})));PICK.ns.push({part:"roi",c:[-(h+a)-1,0,0],r:.25},{part:"roi",c:[-(h+a)-.4,0,0],r:.2})}
      /* lông: sợi ngắn khắp bề mặt */
      {const L=[];const rf=capsR(h,a);for(let i=0;i<70;i++){const th=rnd()*6.283,ph=Math.acos(2*rnd()-1);const d=[Math.sin(ph)*Math.cos(th),Math.cos(ph),Math.sin(ph)*Math.sin(th)];const p=V3.scale(d,rf(d));const n=V3.norm([p[0]-C.clamp(p[0],-h,h),p[1],p[2]]);L.push(G.tube([p,V3.add(p,V3.scale(V3.norm(V3.add(n,[(rnd()-.5)*.4,(rnd()-.5)*.4,(rnd()-.5)*.4])),.16+rnd()*.06))],.004,4))}
        add(cell,"long",R.mesh(G.merge(L),cm("#65A30D","#65A30D","nslong",{flat:false})));PICK.ns.push({part:"long",c:[0,a+.1,0],r:.12},{part:"long",c:[0,-a-.1,0],r:.12})}}
    /* ---------- chọn thành phần ---------- */
    const cellBound={dv:p=>V3.len(p),tv:p=>Math.pow(Math.pow(Math.abs(p[0])/1.25,7)+Math.pow(Math.abs(p[1])/.82,7)+Math.pow(Math.abs(p[2])/.82,7),1/7),ns:p=>{const cx=C.clamp(p[0],-.72,.72);return Math.hypot(p[0]-cx,p[1],p[2])/.36}};
    function pick(x,y){const v=K.view;const r=R.ray(x,y);let best=null,bd=1e9;
      for(const it of PICK[v]){const t=G.hit.sphere(r,it.c,it.r);if(t!=null&&t<bd){const p=V3.add(r.o,V3.scale(r.d,t));bd=t;best=it.part;}}
      /* tia đi vào khối tế bào */
      let tIn=null;for(let t=0;t<12;t+=.01){const p=V3.add(r.o,V3.scale(r.d,t));if(cellBound[v](p)<=1&&!(S.cut&&inCut(p))){tIn=t;break}}
      if(tIn!=null&&tIn<bd){const p=V3.add(r.o,V3.scale(r.d,tIn));const ins=(()=>{const back=V3.add(r.o,V3.scale(r.d,tIn-.02));return S.cut&&inCut(back)})();best=ins?"chat":(v==="dv"?"mang":"thanh");bd=tIn}
      return best?{part:best}:null}
    K.pickFn((x,y)=>pick(x,y));K.tapFn(h=>{if(h)sel(h.part)});
    function sel(p){S.sel=p;const v=K.view;if(!S.seen[v][p]){S.seen[v][p]=1;api.record({tb:CELL[v].t,tp:PART[p].t,cn:PART[p].f})}refresh()}
    let tk=0;
    K.onFrame(dt=>{tk+=dt;if(tk>.3){tk=0;K.updateInfo()}const v=K.view;for(const k in groups)groups[k].visible=k===v;
      for(const m of MATS){m.uniforms.uCut=S.cut?1:0;m.uniforms.uHl=0}if(S.sel&&PARTM[v][S.sel])for(const n of PARTM[v][S.sel]){const f=x=>{if(x.mat&&x.mat.uniforms&&x.mat.uniforms.uHl!=null)x.mat.uniforms.uHl=1;(x.children||[]).forEach(f)};f(n)}});
    K.goView=(og=>function(v,i){og(v,i);S.sel=null;refresh()})(K.goView);
    K.dockFn(()=>{const v=K.view;return[{grid:CELL[v].parts.map(p=>({k:"p",v:p,label:PART[p].t,icon:"",on:S.sel===p}))},{k:"cut",label:S.cut?"Xem nguyên khối":"Xem mặt cắt",icon:IC.eye,on:!S.cut}]});
    K.onDock((k,v)=>{if(k==="p")sel(v);else if(k==="cut")S.cut=!S.cut;refresh()});
    /* nhãn: ba thành phần chính luôn hiện, thành phần đang chọn hiện thêm */
    const LP={dv:{mang:[-.55,.62,.45],chat:[.0,-.45,.6],nhan:[0,-.12,.18]},tv:{thanh:[-.7,.79,.5],chat:[.95,-.45,0],nhan:[.78,.42,-.04]},ns:{thanh:[.55,.33,-.15],chat:[.6,-.1,0],vungnhan:[.2,.08,0]}};
    for(const v in LP)for(const p in LP[v]){K.label(PART[p].t,()=>S.cut||p==="mang"||p==="thanh"?LP[v][p]:[-99,-99,-99],{view:v,dir:p==="nhan"||p==="vungnhan"?"ne":p==="chat"?"se":"nw",len:30})}
    const selL=K.label("",()=>{const v=K.view,p=S.sel;if(!p||(LP[v]&&LP[v][p]))return[-99,-99,-99];let it=null,bd=1e9;const eye=R.cam.eye;for(const q of PICK[v])if(q.part===p){const d=V3.len(V3.sub(q.c,eye))-q.r*2;if(d<bd){bd=d;it=q}}if(it)return it.c;if(p==="chat")return LP[v].chat;if(p==="mang")return v==="dv"?[-.55,.62,.45]:[.4,.76,-.4];if(p==="ribo")return v==="dv"?[-.6,-.3,.2]:[-.4,-.12,-.1];return[-99,-99,-99]},{view:["dv","tv","ns"],dir:"sw",len:34});
    K.onFrame(()=>{if(S.sel)selL.set(PART[S.sel].t)});
    K.infoFn(()=>{const v=K.view,c=CELL[v];const seen=Object.keys(S.seen[v]).length;
      return `<div><b>${c.t}</b></div>${S.sel?`<div><b>${PART[S.sel].t}</b>: ${PART[S.sel].f}</div>`:`<small>Chạm vào một thành phần để xem tên và chức năng.</small>`}<small>Đã xem ${seen}/${c.parts.length} thành phần.</small>`});
    K.timeLabel(()=>K.views[K.view].label);
    K.start();
    vp.__lab={get S(){return S},K,st,goView:v=>K.goView(v),auto(){for(const v of ["dv","tv","ns"]){K.goView(v);for(const p of CELL[v].parts)sel(p)}K.goView("dv")}};
    return K.mount(st)}
});
})();
