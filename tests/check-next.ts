import {levels} from '../src/puzzle/levels';
import {parse,solve,step} from '../src/puzzle/engine';
import {writeFileSync} from 'node:fs';
const result=levels.map(l=>{const b=parse(l.rows),s=solve(b);let state=b.start,pushes=0;for(const d of s??[]){const n=step(b,state,d);if(n.crates.join()!==state.crates.join())pushes++;state=n;}return {id:l.id,moves:s?.length,solution:s,pushes};});
console.log(JSON.stringify(result,null,2));
if(result.some(r=>!r.solution))process.exit(1);
writeFileSync('tests/puzzle-solutions.json',JSON.stringify(result,null,2));
