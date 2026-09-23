import {parse,explore,path,solve,gateOpen,step,key,type Level} from '../src/puzzle/engine';
import {writeFileSync} from 'node:fs';
const templates = [
 {name:['Ein Schritt','A first step'],thought:['Ein kleiner Weg. Deine erste Bewegung.','A small path. Your first move.'],hint:['Pfeiltasten oder die Richtungstasten unten bewegen Mara.','Arrow keys or the buttons below move Mara.'], rows:['#####','#A.a#','#####'],depth:2,chapter:0},
 {name:['Zusammen','Together'],thought:['Zwei Wege. Ein gemeinsamer Impuls.','Two paths. One shared impulse.'],hint:['Beide Figuren hören auf dieselbe Richtung.','Both walkers follow the same direction.'],rows:['#######','#A..a##','#######','##B..b#','#######'],depth:3,chapter:0},
 {name:['Warten lernen','Learning to wait'],thought:['Auch Stillstehen verändert etwas.','Standing still changes things, too.'],hint:['Lass eine Figur an einer Wand warten, während die andere weitergeht.','Let one walker wait at a wall while the other keeps moving.'],rows:['#######','#A....#','###.#.#','#B....#','#.#...#','#a...b#','#######'],depth:8,chapter:0},
 {name:['Ein Umweg','A detour'],thought:['Nicht jeder Schritt zum Ziel führt näher heran.','Not every step towards home brings you closer.'],hint:['Du darfst ein Ziel wieder verlassen. Erst beide zusammen zählen.','You can leave a home again. Both must arrive together.'],rows:['#######','#A..#.#','#.#...#','#...#B#','##....#','#a...b#','#######'],depth:12,chapter:0},
 {name:['Andere Seite','The other side'],thought:['Eine Ecke kann zwei Wege trennen.','A corner can separate two paths.'],hint:['Versuche, die Figuren auf verschiedene Seiten eines Hindernisses zu bringen.','Try to put the walkers on different sides of an obstacle.'],rows:['#######','#A....#','#.###.#','#...#B#','#.#...#','#a...b#','#######'],depth:18,chapter:0},
 {name:['Bewegliche Wand','A movable wall'],thought:['Manche Grenzen lassen sich verschieben.','Some boundaries can move.'],hint:['Gehe gegen den Pflanzkasten. Dahinter muss ein Feld frei sein.','Walk into the planter. The tile behind it must be free.'],rows:['#######','#A.Xa.#','#######'],depth:3,chapter:1},
 {name:['Ein Platz zum Warten','A place to wait'],thought:['Was im Weg steht, kann dir helfen.','What blocks your path may help you.'],hint:['Der Kasten kann eine Figur aufhalten, während die andere weiterläuft.','The planter can hold one walker while the other moves on.'],rows:['#######','#A....#','#..X#.#','#.#..B#','#.....#','#a...b#','#######'],depth:13,chapter:1},
 {name:['Nicht zu weit','Not too far'],thought:['Eine Bewegung lässt sich zurücknehmen.','You can take a step back.'],hint:['Kästen lassen sich schieben, aber nicht ziehen. Z nimmt einen Zug zurück.','Planters can be pushed, but not pulled. Z undoes a move.'],rows:['#######','#A..#.#','#.#X..#','#....B#','#.##..#','#a...b#','#######'],depth:13,chapter:1},
 {name:['Der gemeinsame Hof','The shared courtyard'],thought:['Zwei Menschen. Eine veränderbare Grenze.','Two walkers. One movable boundary.'],hint:['Auch Cem kann den Kasten verschieben. Plane, von welcher Seite du ihn später brauchst.','Cem can push the planter too. Think about which side you will need later.'],rows:['########','#A.....#','#..#X..#','#.#..#B#','#...#..#','#.a..b.#','########'],depth:18,chapter:1},
 {name:['Die Schwelle','The threshold'],thought:['Jemand hält den Weg offen.','Someone keeps the way open.'],hint:['Eine Figur oder ein Kasten auf der runden Platte öffnet alle Tore. Sie gilt zu Beginn eines Zuges.','A walker or planter on the round plate opens every gate. Its state at the start of a step counts.'],rows:['#######','#A.o#.#','#...|B#','#.#.#.#','#...#.#','#a..#b#','#######'],depth:9,chapter:2},
 {name:['Bleib noch','Stay a little'],thought:['Manchmal ist Warten die halbe Lösung.','Sometimes waiting is half the answer.'],hint:['Nutze die Wand neben der Platte, um eine Figur dort stehenzulassen.','Use the wall next to the plate to keep one walker in place.'],rows:['########','#Ao.#..#','#.#.|B.#','#...#..#','##..#..#','#a..#b.#','########'],depth:13,chapter:2},
 {name:['Ein stiller Helfer','A quiet helper'],thought:['Nicht immer muss jemand zurückbleiben.','Someone does not always have to stay behind.'],hint:['Ein Pflanzkasten kann die Platte für euch besetzen.','A planter can hold down the plate for you.'],rows:['########','#A..#..#','#.Xo#..#','#...|.B#','#.#.#..#','#a..#b.#','########'],depth:18,chapter:2},
 {name:['Alles verbunden','Everything connects'],thought:['Du kennst alle Regeln. Sie gehören zusammen.','You know every rule. They belong together.'],hint:['Denke zuerst darüber nach, wer das Tor offen hält. Dann, wie ihr euch wieder trennt.','First think about what holds the gate open. Then how to separate again.'],rows:['########','#A..#..#','#.Xo#..#','#.#.|.B#','#...#..#','#a..#b.#','########'],depth:18,chapter:2},
];
const levels:Level[]=[],report=[];
for(let t=0;t<templates.length;t++){
 const v=templates[t], b=parse(v.rows);
 let rows=[...v.rows], chosen:ReturnType<typeof path>|null=null;
 if([0,1,5].includes(t)){chosen=solve(b);} else {
  const nodes=explore(b,b.start,180000),pairs=new Set<string>();let best=-1,score=-Infinity;
  for(let i=0;i<nodes.length;i++){
   const n=nodes[i],pair=n.state.people.join(',');if(pairs.has(pair))continue;pairs.add(pair);
   if(n.state.people[0]===n.state.people[1]||n.state.people.some(p=>b.start.people.includes(p)||b.plates.includes(p)||b.gates.includes(p)||b.start.crates.includes(p)))continue;
   if(n.depth<Math.max(5,v.depth-3)||n.depth>v.depth+5)continue;
   const moves=path(nodes,i);let s=b.start,push=false,gate=false;
   for(const d of moves){const next=step(b,s,d);if(s.crates.join()!=next.crates.join())push=true;if(next.people.some(p=>b.gates.includes(p)))gate=true;s=next;}
   if(v.chapter===1&&!push)continue;if(v.chapter===2&&!gate)continue;if(t>=11&&!push)continue;
   const candidate={...b,goals:n.state.people};
   if(v.chapter===2){const blocked={...candidate,floor:b.floor.filter(p=>!b.gates.includes(p)),gates:[]};if(solve(blocked,b.start,20000))continue;}
   if(v.chapter===1 || t>=11){const staticBox={...candidate,floor:b.floor.filter(p=>!b.start.crates.includes(p)),start:{people:b.start.people,crates:[]}};const staticSolution=solve(staticBox,staticBox.start,20000);if(staticSolution && staticSolution.length<=moves.length+2)continue;}
   const separation=Math.abs(n.state.people[0]%b.width-n.state.people[1]%b.width)+Math.abs(Math.floor(n.state.people[0]/b.width)-Math.floor(n.state.people[1]/b.width));
   const rating=-Math.abs(n.depth-v.depth)*10+separation;
   if(rating>score){score=rating;best=i;chosen=moves;}
  }
  if(best<0)throw new Error('No candidate '+t+' '+v.name[0]+' states '+nodes.length);
  const target=nodes[best].state.people;
  rows=rows.map((r,y)=>[...r].map((c,x)=>{const p=y*b.width+x;if(p===target[0])return 'a';if(p===target[1])return 'b';return c==='a'||c==='b'?'.':c;}).join(''));
 }
 if(!chosen)throw new Error('Unsolvable '+v.name[0]);
 levels.push({id:'garden-'+String(t+1).padStart(2,'0'),chapter:v.chapter,name:v.name as [string,string],thought:v.thought as [string,string],hint:v.hint as [string,string],rows});
 report.push({level:t+1,name:v.name[0],moves:chosen.length,solution:chosen,rows});
 console.log(t+1,v.name[0],chosen.length, rows.join('/'));
}
writeFileSync('src/puzzle/levels.ts',`import type { Level } from './engine';\nexport const levels: Level[] = ${JSON.stringify(levels,null,2)};\n`);
writeFileSync('tests/puzzle-solutions.json',JSON.stringify(report,null,2));







