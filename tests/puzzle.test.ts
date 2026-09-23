import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {parse,step,solve,solved,key,clone,gateOpen,type Direction} from '../src/puzzle/engine';
import {levels} from '../src/puzzle/levels';
const reference=JSON.parse(readFileSync(new URL('./puzzle-solutions.json',import.meta.url),'utf8'));
test('Every released garden has a replayable shortest solution',()=>{
 for(let i=0;i<levels.length;i++){
  const b=parse(levels[i].rows),result=solve(b);assert.ok(result,levels[i].id);assert.equal(result.length,reference[i].moves);
  let s=clone(b.start);for(const d of reference[i].solution as Direction[]){const old=JSON.stringify(s);const next=step(b,s,d);assert.equal(JSON.stringify(s),old,'input must stay immutable');assert.notEqual(key(next),key(s),'no empty solution steps');s=next;assert.equal(new Set(s.crates).size,s.crates.length);assert.ok(s.people.every(p=>b.floor.includes(p)));assert.ok(s.crates.every(p=>b.floor.includes(p)));assert.ok(s.people.every(p=>!s.crates.includes(p)));}assert.ok(solved(b,s),levels[i].id);
 }
});
test('A wall stops just one walker; home does not freeze a walker',()=>{
 const b=parse(['#######','#A...a#','###B.b#','#######']);const next=step(b,b.start,'left');assert.equal(next.people[0],b.start.people[0]);assert.equal(next.people[1],b.start.people[1]);
 const up=step(b,b.start,'up');assert.equal(up.people[0],b.start.people[0]);assert.notEqual(up.people[1],b.start.people[1]);
 assert.ok(!solved(b,step(b,{people:b.goals,crates:[]},'left')));
});
test('Sharing a tile is legal and symmetric; swapping identities swaps output',()=>{
 const b=parse(levels[3].rows);const s={people:[b.start.people[0],b.start.people[0]],crates:[]};const n=step(b,s,'right');assert.equal(n.people[0],n.people[1]);
 for(const d of ['up','right','down','left'] as Direction[]){const a=step(b,b.start,d),r=step(b,{people:[...b.start.people].reverse(),crates:[]},d);assert.deepEqual(a.people,[...r.people].reverse());}
});
test('Planters push one tile, cannot be pulled or pushed through a wall',()=>{
 const b=parse(['#######','#A.Xa.#','#######']);let s=step(b,b.start,'right');s=step(b,s,'right');assert.equal(s.crates[0],b.start.crates[0]+1);const before=s.crates[0];s=step(b,s,'left');assert.equal(s.crates[0],before);s=step(b,s,'right');s=step(b,s,'right');assert.equal(s.crates[0],b.start.crates[0]+2);assert.equal(key(step(b,s,'right')),key(s));
});
test('A plate samples the start of a move; gates do not crush occupants',()=>{
 const b=parse(['########','#Ao.|B.#','#a...b.#','########']);const plate=b.plates[0],gate=b.gates[0];
 const s={people:[plate,gate+1],crates:[]};assert.ok(gateOpen(b,s));const cross=step(b,s,'left');assert.equal(cross.people[1],gate);assert.ok(!gateOpen(b,cross));const leave=step(b,cross,'left');assert.equal(leave.people[1],gate-1);
 const closed=step(b,{people:[plate-1,gate+1],crates:[]},'left');assert.equal(closed.people[1],gate+1);
 assert.ok(gateOpen(b,{people:b.start.people,crates:[plate]}));
});
test('Undo snapshots restore every element including plate and crate state',()=>{
 const b=parse(levels[8].rows),solution=solve(b)!;let s=clone(b.start);const history=[];
 for(const d of solution){history.push(clone(s));s=step(b,s,d);}while(history.length)s=history.pop()!;assert.deepEqual(s,b.start);
});
test('Gate chapter actually needs traversal of a gate',()=>{
 for(const l of levels.filter(x=>x.chapter===2)){const b=parse(l.rows);const closed={...b,floor:b.floor.filter(p=>!b.gates.includes(p)),gates:[]};assert.equal(solve(closed,closed.start,20000),null,l.id);}
});
test('All garden ids are stable and unique',()=>{assert.equal(new Set(levels.map(l=>l.id)).size,levels.length);assert.equal(levels.length,9);});
