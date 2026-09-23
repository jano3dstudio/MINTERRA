export type Direction = 'up' | 'right' | 'down' | 'left';
export const directions: Direction[] = ['up', 'right', 'down', 'left'];
export interface Board { width: number; height: number; floor: number[]; walls: number[]; plates: number[]; gates: number[]; goals: number[]; start: State }
export interface State { people: number[]; crates: number[] }
export interface Level { id: string; chapter: number; name: [string,string]; thought: [string,string]; hint: [string,string]; rows: string[] }
export function parse(rows: string[]): Board {
 const width = rows[0].length;
 if (rows.some(r=>r.length!==width)) throw new Error('Non-rectangular board');
 const b: Board = {width,height:rows.length,floor:[],walls:[],plates:[],gates:[],goals:[],start:{people:[],crates:[]}};
 rows.forEach((row,y)=>[...row].forEach((c,x)=>{const p=y*width+x;
  if(c==='#') {b.walls.push(p);return;}
  if(c===' ')return;
  b.floor.push(p);
  if(c==='A')b.start.people[0]=p;if(c==='B')b.start.people[1]=p;
  if(c==='a')b.goals[0]=p;if(c==='b')b.goals[1]=p;
  if(c==='X')b.start.crates.push(p);if(c==='o')b.plates.push(p);if(c==='|')b.gates.push(p);
 }));
 if(!b.start.people.length || b.start.people.length!==b.goals.length)throw new Error('Missing people or goals');
 return b;
}
export const clone = (s: State): State => ({people:[...s.people],crates:[...s.crates]});
export const key = (s: State) => s.people.join(',')+';'+[...s.crates].sort((a,b)=>a-b).join(',');
export const solved = (b: Board,s: State) => s.people.every((p,i)=>p===b.goals[i]);
export const gateOpen = (b: Board,s: State) => b.plates.some(p=>s.people.includes(p)||s.crates.includes(p));
export function adjacent(b: Board,p:number,d:Direction):number {
 const x=p%b.width,y=Math.floor(p/b.width),dx=d==='right'?1:d==='left'?-1:0,dy=d==='down'?1:d==='up'?-1:0;
 if(x+dx<0||x+dx>=b.width||y+dy<0||y+dy>=b.height)return -1;
 return (y+dy)*b.width+x+dx;
}
// Every walker receives the same command. Walls stop only that walker.
// Walkers may share a tile. Plan all moves against the same starting state.
// A crate slides one tile; never push chains. A gate samples plates BEFORE the step.
export function step(b:Board,s:State,d:Direction):State {
 const open=gateOpen(b,s);
 const pass=(p:number)=>b.floor.includes(p)&&(!b.gates.includes(p)||open);
 const plans=s.people.map(p=>{
  const to=adjacent(b,p,d);if(!pass(to))return {to:p,crate:-1,dest:-1};
  const crate=s.crates.indexOf(to);if(crate<0)return {to,crate:-1,dest:-1};
  const dest=adjacent(b,to,d);
  if(!pass(dest)||s.crates.includes(dest)||s.people.includes(dest))return {to:p,crate:-1,dest:-1};
  return {to,crate,dest};
 });
 const crates=[...s.crates];for(const p of plans)if(p.crate>=0)crates[p.crate]=p.dest;
 return {people:plans.map(p=>p.to),crates};
}
export interface SearchNode { state:State; parent:number; direction:Direction|null; depth:number }
export function explore(b:Board,initial=b.start,limit=120000):SearchNode[] {
 const nodes:SearchNode[]=[{state:clone(initial),parent:-1,direction:null,depth:0}],seen=new Set([key(initial)]);
 for(let i=0;i<nodes.length&&nodes.length<limit;i++)for(const d of directions){const n=step(b,nodes[i].state,d),k=key(n);if(seen.has(k))continue;seen.add(k);nodes.push({state:n,parent:i,direction:d,depth:nodes[i].depth+1});}
 return nodes;
}
export function path(nodes:SearchNode[],i:number):Direction[]{const out:Direction[]=[];while(nodes[i].parent>=0){out.push(nodes[i].direction!);i=nodes[i].parent;}return out.reverse();}
export function solve(b:Board,s=b.start,limit=120000):Direction[]|null {
 const nodes:SearchNode[]=[{state:clone(s),parent:-1,direction:null,depth:0}],seen=new Set([key(s)]);
 for(let i=0;i<nodes.length&&nodes.length<limit;i++){
  if(solved(b,nodes[i].state))return path(nodes,i);
  for(const d of directions){const n=step(b,nodes[i].state,d),k=key(n);if(!seen.has(k)){seen.add(k);nodes.push({state:n,parent:i,direction:d,depth:nodes[i].depth+1});}}
 }
 return null;
}
