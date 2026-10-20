/* LabKHTN · bộ máy MÔ HÌNH HẠT (nguyên tử, sau này: phân tử, liên kết)
   - Mô hình Rutherford – Bohr theo SGK KHTN 7: proton (+1, 1 amu), neutron (0, 1 amu), electron (−1, ≈ 0,00055 amu)
   - Electron xếp từ lớp trong ra ngoài; với 20 nguyên tố đầu: lớp 1 tối đa 2, lớp 2 tối đa 8, lớp 3 nhận 8 rồi chuyển sang lớp 4 (K, Ca)
   - Vẽ bằng Canvas 2D: hạt nhân xếp theo xoắn ốc vàng, electron quay theo lớp */
(function(){
"use strict";
if(window.LabAtom) return;
const C=window.LabCore;

/* 20 nguyên tố đầu: kí hiệu, tên gọi, số neutron của dạng phổ biến nhất trong tự nhiên, tên IUPAC (ghi kèm khi nguyên tố giữ tên tiếng Việt).
   Theo Chương trình GDPT 2018 môn Hóa học: nitơ, natri, nhôm, lưu huỳnh, kali giữ tên tiếng Việt (kèm tên IUPAC); các nguyên tố khác gọi theo IUPAC. */
const EL=[null,
 ["H","Hydrogen",0],["He","Helium",2],["Li","Lithium",4],["Be","Beryllium",5],["B","Boron",6],["C","Carbon",6],["N","Nitơ",7,"nitrogen"],["O","Oxygen",8],["F","Fluorine",10],["Ne","Neon",10],
 ["Na","Natri",12,"sodium"],["Mg","Magnesium",12],["Al","Nhôm",14,"aluminium"],["Si","Silicon",14],["P","Phosphorus",16],["S","Lưu huỳnh",16,"sulfur"],["Cl","Chlorine",18],["Ar","Argon",22],["K","Kali",20,"potassium"],["Ca","Calcium",20]];
const CAP=[2,8,8,2];
const ME=0.00055;
function shells(e){const out=[];let left=e;for(const c of CAP){if(left<=0)break;const k=Math.min(c,left);out.push(k);left-=k}return out}
function info(p,n,e){
  const el=p>=1&&p<=20?EL[p]:null;
  return{el,p,n,e,charge:p-e,mass:p+n+e*ME,massRound:p+n,sh:shells(e),commonN:el?el[2]:null};
}
/* vị trí hạt nhân: xoắn ốc vàng, hạt thứ i ở bán kính c·√(i+0.5) */
function nucleusPos(i,c){const r=c*Math.sqrt(i+.5),a=i*2.399963;return{x:Math.cos(a)*r,y:Math.sin(a)*r}}
function ball(ctx,x,y,r,c,label,ink){
  const g=ctx.createRadialGradient(x-r*.35,y-r*.4,r*.12,x,y,r);g.addColorStop(0,"#FFFFFF");g.addColorStop(.28,c);g.addColorStop(1,C.mix(c,"#000000",.45));
  ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,y,r,0,6.283);ctx.fill();
  if(label){ctx.fillStyle=ink||"#FFFFFF";ctx.font=`900 ${Math.round(r*1.15)}px system-ui,sans-serif`;ctx.textAlign="center";ctx.textBaseline="middle";ctx.fillText(label,x,y+r*.05);ctx.textAlign="left";ctx.textBaseline="alphabetic"}
}
const COL={p:"#EF4444",n:"#94A3B8",e:"#3B82F6"};
const LAB={p:"+",n:"",e:"−"};

window.LabAtom={EL,CAP,ME,shells,info,nucleusPos,ball,COL,LAB};
})();
