export const edges = [[1,2,10],[3,6,15],[4,6,20],[2,6,25],[1,4,30],[3,5,35],[2,5,40],[1,5,45],[2,3,50],[5,6,55]];
export function mst(mode='prim') {
  const sorted=[...edges].sort((a,b)=>a[2]-b[2]), steps=[], visited=new Set(), parent=Array.from({length:7},(_,i)=>i);
  const find=x=>parent[x]===x?x:parent[x]=find(parent[x]);
  if(mode==='prim') {
    while(visited.size<6) {
      const edge=sorted.find(([a,b])=>!visited.size || visited.has(a)!==visited.has(b));
      if(!edge) break;
      visited.add(edge[0]); visited.add(edge[1]); steps.push({edge,accepted:true});
    }
  } else {
    for(const edge of sorted) {
      const [a,b]=edge,accepted=find(a)!==find(b);
      if(accepted) parent[find(a)]=find(b);
      steps.push({edge,accepted});
      if(steps.filter(s=>s.accepted).length===5) break;
    }
  }
  return steps;
}
export function buildTree(values) {
  let root=null;
  for(const value of values) {
    if(!root) {root={value};continue;}
    let n=root;
    while(n.value!==value) {const side=value<n.value?'left':'right';if(!n[side]){n[side]={value};break;}n=n[side];}
  }
  return root;
}
export function traverse(n,mode='inorder') {
  if(!n)return [];
  const l=traverse(n.left,mode),r=traverse(n.right,mode);
  return mode==='preorder'?[n.value,...l,...r]:mode==='postorder'?[...l,...r,n.value]:[...l,n.value,...r];
}
export function huffman(text) {
  const freq=new Map();for(const ch of text)freq.set(ch,(freq.get(ch)||0)+1);
  const queue=[...freq].map(([char,weight])=>({char,weight}));
  while(queue.length>1){queue.sort((a,b)=>a.weight-b.weight);const left=queue.shift(),right=queue.shift();queue.push({weight:left.weight+right.weight,left,right});}
  const codes={}; const walk=(n,code)=>{if(n.char!==undefined)codes[n.char]=code||'0';else{walk(n.left,code+'0');walk(n.right,code+'1');}};
  if(queue.length)walk(queue[0],'');
  return {freq,codes,bits:[...text].map(c=>codes[c]).join('')};
}
