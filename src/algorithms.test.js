import test from 'node:test';
import assert from 'node:assert/strict';
import {mst,buildTree,traverse,huffman} from './algorithms.js';
test('Prim and Kruskal produce PDF MST with total 105',()=>{for(const mode of ['prim','kruskal']){const selected=mst(mode).filter(s=>s.accepted);assert.equal(selected.length,5);assert.equal(selected.reduce((n,s)=>n+s.edge[2],0),105);assert.equal(new Set(selected.flatMap(s=>s.edge.slice(0,2))).size,6);}assert.equal(mst('kruskal').find(s=>s.edge[2]===30).accepted,false);});
test('BST traversal ordering and duplicate insertion',()=>{const root=buildTree([50,32,18,40,60,52,5,25,70,50]);assert.deepEqual(traverse(root),[5,18,25,32,40,50,52,60,70]);assert.deepEqual(traverse(root,'preorder'),[50,32,18,5,25,40,60,52,70]);assert.deepEqual(traverse(root,'postorder'),[5,25,18,40,32,52,70,60,50]);});
test('Huffman sample, prefix-free codes and edge cases',()=>{assert.equal(huffman('ABACCDA').bits.length,13);assert.equal(huffman('').bits,'');assert.equal(huffman('AAA').bits,'000');for(const text of ['ABACCDA','hello world','🌱🌱🌲']){const {codes,bits}=huffman(text);const entries=Object.entries(codes);for(const [a,ca] of entries)for(const [b,cb] of entries)if(a!==b)assert.equal(cb.startsWith(ca),false);let decoded='',buffer='';for(const bit of bits){buffer+=bit;const found=entries.find(([,code])=>code===buffer);if(found){decoded+=found[0];buffer='';}}assert.equal(decoded,text);}});
import {presets,solveGraph,solveNary,solveBST,solveTennis,solveCoins,coinStates,coinOutcome} from './solvers.js';
test('PDF exercise MST and disconnected/negative/single-vertex graphs',()=>{
 const r=solveGraph('a b c d e f g h i',presets.graph);assert.equal(r.total,22);assert.equal(r.selected.length,8);assert.equal(r.components,1);
 const forest=solveGraph('a b c d','a b -3\nb c 1\na c 5');assert.equal(forest.total,-2);assert.equal(forest.components,2);assert.equal(solveGraph('a','').total,0);
 assert.throws(()=>solveGraph('a b','a b 2\nb a 3'),/duplikat/);assert.throws(()=>solveGraph('a b','a c 1'));assert.throws(()=>solveGraph('a b','a a 1'));
 // Independent exhaustive check of every spanning tree of the 16-edge PDF graph.
 let minimum=Infinity;
 for(let mask=0;mask<2**r.edges.length;mask++){
  const subset=r.edges.filter((_,i)=>mask&(1<<i));if(subset.length!==8)continue;
  const reached=new Set(['a']);let changed=true;while(changed){changed=false;for(const e of subset)if(reached.has(e.a)!==reached.has(e.b)){reached.add(e.a);reached.add(e.b);changed=true;}}
  if(reached.size===9)minimum=Math.min(minimum,subset.reduce((s,e)=>s+e.weight,0));
 }
 assert.equal(r.total,minimum);
});
test('4-ary exercise traversal and malformed trees',()=>{
 const r=solveNary(presets.nary);assert.equal(r.orders.preorder.join(''),'abenofgchidjklpqm');assert.equal(r.orders.inorder.join(''),'neobfgahcijdkplqm');assert.equal(r.orders.postorder.join(''),'noefgbhicjkpqlmda');
 for(const input of ['a: b\nb: a','a: b\nc: d','a: b b','a: b\nx: y\ny: x','a: b c d e f','a: b\na: c'])assert.throws(()=>solveNary(input));
 assert.deepEqual(solveNary('a:').orders.inorder,['a']);
});
test('BST exercise supports characters, numbers, and deduplication',()=>{
 const r=solveBST(presets.bst,'letter');assert.equal(r.orders.inorder.join(''),'ABCDFHIKMNOPSTUW');assert.equal(r.orders.preorder[0],'P');assert.equal(r.orders.postorder.at(-1),'P');
 assert.deepEqual(solveBST('10 2 -3 2','number').orders.inorder,[-3,2,10]);assert.equal(solveBST('a A b','letter').duplicates,1);assert.throws(()=>solveBST('ab c','letter'));
});
test('Tennis has all and only terminal paths; PDF has 10 outcomes',()=>{
 for(const target of [2,3,5])for(const streak of [2,3]){
  const r=solveTennis(target,streak);const stop=p=>[...p].filter(c=>c==='A').length>=target||[...p].filter(c=>c==='B').length>=target||new RegExp(`A{${streak}}$|B{${streak}}$`).test(p);
  for(const o of r.outcomes){assert.ok(stop(o.path));for(let i=0;i<o.path.length;i++)assert.equal(stop(o.path.slice(0,i)),false);}
  assert.equal(new Set(r.outcomes.map(o=>o.path)).size,r.outcomes.length);
  // Every full-length binary sequence has exactly one terminating prefix.
  const length=2*target-1;for(let i=0;i<2**length;i++){const path=i.toString(2).padStart(length,'0').replaceAll('0','A').replaceAll('1','B');assert.equal(r.outcomes.filter(o=>path.startsWith(o.path)).length,1);}
 }
 assert.equal(solveTennis().outcomes.length,10);
});
test('Coin strategy identifies every heavy/light case in at most 3 weighings',()=>{
 const root=solveCoins();for(const s of coinStates){let n=root,count=0;while(!n.result){assert.equal(n.weigh.left.length,n.weigh.right.length);assert.equal(new Set([...n.weigh.left,...n.weigh.right]).size,n.weigh.left.length*2);n=n.branches[coinOutcome(s,n.weigh)];assert.ok(n);count++;assert.ok(count<=3);}assert.deepEqual(n.result,s);}
});

