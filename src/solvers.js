import {buildTree,traverse} from './algorithms.js';

export const presets={
  graph:'a b 5\nb c 4\na d 2\nb d 3\nb e 5\nb f 6\nc f 3\nd e 7\ne f 1\nd g 6\nd h 8\ne h 3\nf h 4\nf i 4\ng h 4\nh i 2',
  nary:'a: b c d\nb: e f g\nc: h i\nd: j k l m\ne: n o\nl: p q',
  bst:'P, T, B, F, H, K, N, S, A, U, M, I, D, C, W, O'
};
const validLabel=s=>/^[A-Za-z0-9_-]{1,12}$/.test(s);
export function solveGraph(nodeText,edgeText){
  const nodes=nodeText.trim().split(/[\s,]+/).filter(Boolean);
  if(!nodes.length||nodes.length>20||nodes.some(n=>!validLabel(n))||new Set(nodes).size!==nodes.length)throw Error('Masukkan 1–20 nama simpul unik (huruf, angka, _ atau -, maksimal 12 karakter).');
  const lines=edgeText.trim()?edgeText.trim().split(/\r?\n/).filter(l=>l.trim()):[];
  if(lines.length>80)throw Error('Maksimal 80 sisi.');
  const keys=new Set(),edges=lines.map((line,i)=>{
    const parts=line.trim().split(/[\s,]+/),[a,b,w]=parts,weight=Number(w);
    if(parts.length!==3||!nodes.includes(a)||!nodes.includes(b)||a===b||!w||!Number.isFinite(weight)||Math.abs(weight)>1000000)throw Error(`Baris ${i+1}: gunakan "simpul1 simpul2 bobot", dua simpul berbeda yang terdaftar, dan bobot antara −1.000.000 dan 1.000.000.`);
    const key=[a,b].sort().join('|');if(keys.has(key))throw Error(`Baris ${i+1}: sisi ${a}–${b} duplikat.`);keys.add(key);return {a,b,weight};
  });
  const parent=new Map(nodes.map(n=>[n,n])),find=n=>parent.get(n)===n?n:find(parent.get(n));
  let total=0;const selected=[],steps=[];
  for(const e of [...edges].sort((a,b)=>a.weight-b.weight)){
    const accepted=find(e.a)!==find(e.b);
    if(accepted){parent.set(find(e.a),find(e.b));selected.push(e);total+=e.weight;}
    steps.push({...e,accepted});
  }
  return {nodes,edges,selected,steps,total,components:new Set(nodes.map(find)).size};
}
export function solveNary(text){
  const nodes=new Map(),parents=new Map(),defined=new Set();
  const get=v=>{if(!validLabel(v))throw Error('Nama simpul harus 1–12 karakter huruf, angka, _ atau -.');if(!nodes.has(v))nodes.set(v,{value:v,children:[]});return nodes.get(v);};
  for(const line of text.trim().split(/\r?\n/).filter(l=>l.trim())){
    const parts=line.split(':');if(parts.length!==2)throw Error('Gunakan satu baris per orangtua: a: b c d. Daun boleh ditulis a:');
    const label=parts[0].trim(),n=get(label);if(defined.has(label))throw Error(`Orangtua ${label} ditulis lebih dari sekali.`);defined.add(label);
    const children=parts[1].trim().split(/[\s,]+/).filter(Boolean);if(children.length>4)throw Error('Pohon 4-ary memiliki maksimal 4 anak per simpul.');
    for(const child of children){if(child===label||parents.has(child))throw Error(`Simpul ${child} mempunyai relasi diri sendiri atau lebih dari satu orangtua.`);parents.set(child,label);n.children.push(get(child));}
  }
  if(!nodes.size||nodes.size>25)throw Error('Masukkan pohon dengan 1–25 simpul.');
  const roots=[...nodes.values()].filter(n=>!parents.has(n.value));if(roots.length!==1)throw Error('Pohon harus mempunyai tepat satu akar, terhubung, dan tanpa sirkuit.');
  const seen=new Set();const walk=n=>{if(seen.has(n.value))throw Error('Pohon mengandung sirkuit.');seen.add(n.value);n.children.forEach(walk);};walk(roots[0]);
  if(seen.size!==nodes.size)throw Error('Ada simpul terpisah atau sirkuit di luar pohon utama.');
  const visit=(n,mode)=>{const groups=n.children.map(c=>visit(c,mode));return mode==='preorder'?[n.value,...groups.flat()]:mode==='postorder'?[...groups.flat(),n.value]:[...(groups[0]||[]),n.value,...groups.slice(1).flat()];};
  return {root:roots[0],orders:Object.fromEntries(['preorder','inorder','postorder'].map(m=>[m,visit(roots[0],m)]))};
}
export function solveBST(text,type){
  const tokens=text.trim().split(/[\s,]+/).filter(Boolean);if(!tokens.length||tokens.length>25)throw Error('Masukkan 1–25 nilai, dipisahkan koma atau spasi.');
  let values;
  if(type==='number'){if(tokens.some(t=>!/^[-+]?\d+$/.test(t)||!Number.isSafeInteger(Number(t))||Math.abs(Number(t))>9999))throw Error('Gunakan angka bulat antara −9999 dan 9999.');values=tokens.map(Number);}
  else{if(tokens.some(t=>!/^[A-Za-z]$/.test(t)))throw Error('Gunakan satu huruf A–Z per nilai. Huruf kecil akan diubah menjadi huruf besar.');values=tokens.map(t=>t.toUpperCase());}
  const unique=[...new Set(values)],root=buildTree(unique);
  const convert=n=>n?{value:n.value,children:[n.left&&convert(n.left),n.right&&convert(n.right)],binary:true}:null;
  return {root:convert(root),duplicates:values.length-unique.length,orders:Object.fromEntries(['preorder','inorder','postorder'].map(m=>[m,traverse(root,m)]))};
}
export function solveTennis(target=3,streak=2){
  if(!Number.isInteger(target)||target<2||target>5||!Number.isInteger(streak)||streak<2||streak>3)throw Error('Target total 2–5 set; kemenangan beruntun 2–3 set.');
  const outcomes=[];
  const walk=(path,a,b,last,run)=>{
    const winner=a>=target?'A':b>=target?'B':run>=streak?last:null;
    const node={value:path.length?path.at(-1):'Mulai',children:[]};
    if(winner){outcomes.push({path:path.join(''),winner,a,b,reason:run>=streak?`${streak} set beruntun`:`${target} set total`});node.winner=winner;return node;}
    for(const player of ['A','B'])node.children.push(walk([...path,player],a+(player==='A'),b+(player==='B'),player,last===player?run+1:1));
    return node;
  };
  return {root:walk([],0,0,'',0),outcomes};
}

export const coinStates=Array.from({length:8},(_,i)=>[{coin:i+1,kind:1},{coin:i+1,kind:-1}]).flat();
export function coinOutcome(state,weigh){return Math.sign((weigh.left.includes(state.coin)?1:weigh.right.includes(state.coin)?-1:0)*state.kind);}
let cachedCoinTree;
export function solveCoins(){
  if(cachedCoinTree)return cachedCoinTree;
  const weighings=[];
  for(let code=1;code<3**8;code++){
    let k=code;const left=[],right=[];
    for(let i=1;i<=8;i++){const digit=k%3;k=Math.floor(k/3);if(digit===1)left.push(i);if(digit===2)right.push(i);}
    if(left.length&&left.length===right.length&&left[0]<right[0])weighings.push({left,right});
  }
  const memo=new Map();
  function search(states,remaining){
    if(states.length===1)return {states,result:states[0]};
    if(!remaining||states.length>3**remaining)return null;
    const key=states.map(s=>s.coin* s.kind).join(',')+':'+remaining;
    if(memo.has(key))return memo.get(key);
    const options=weighings.map(w=>{const groups=[-1,0,1].map(o=>states.filter(s=>coinOutcome(s,w)===o));return {w,groups,max:Math.max(...groups.map(g=>g.length))};}).filter(x=>x.max<states.length&&x.max<=3**(remaining-1)).sort((a,b)=>a.max-b.max||a.w.left.length-b.w.left.length);
    for(const {w,groups}of options){const branches={};let valid=true;for(let i=0;i<3;i++){if(!groups[i].length){branches[i-1]=null;continue;}branches[i-1]=search(groups[i],remaining-1);if(!branches[i-1]){valid=false;break;}}if(valid){const answer={states,weigh:w,branches};memo.set(key,answer);return answer;}}
    memo.set(key,null);return null;
  }
  cachedCoinTree=search(coinStates,3);
  if(!cachedCoinTree)throw Error('Strategi penimbangan tidak ditemukan.');
  return cachedCoinTree;
}
