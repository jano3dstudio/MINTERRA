import test from 'node:test';
import assert from 'node:assert/strict';
import {levels} from '../src/puzzle/levels';
import {chapterOpen,chapterCount} from '../src/puzzle/world';
import {parse,solve} from '../src/puzzle/engine';
test('Three completed gardens unlock exactly the following chapter',()=>{
 const done=new Set<string>();assert.equal(chapterOpen(0,done),true);assert.equal(chapterOpen(1,done),false);
 done.add(levels[0].id);done.add(levels[1].id);assert.equal(chapterOpen(1,done),false);
 done.add(levels[2].id);assert.equal(chapterCount(0,done),3);assert.equal(chapterOpen(1,done),true);assert.equal(chapterOpen(2,done),false);
 levels.slice(3,6).forEach(l=>done.add(l.id));assert.equal(chapterOpen(2,done),true);
 assert.deepEqual([0,1,2].map(c=>levels.filter(l=>l.chapter===c).length),[3,3,3]);
});
test('Every planter lesson requires moving its planter, not just walking around it',()=>{
 for(const l of levels.filter(l=>l.chapter===1)){
  const b=parse(l.rows),fixed={...b,floor:b.floor.filter(p=>!b.start.crates.includes(p)),start:{people:b.start.people,crates:[]}};
  assert.equal(solve(fixed),null,l.name[0]);
 }
});
