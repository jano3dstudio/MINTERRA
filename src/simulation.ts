export type Mode='walk'|'bike'|'car';
export type Layout={links:string[]; street:'mixed'|'bike'|'free'; park:'none'|'garden'|'square'; entrance:'west'|'east'; unlimited:boolean};
export type Point={id:string;x:number;z:number;name:string};
export const nodes:Point[]=[
 {id:'home',x:-48,z:18,name:'Wohnhof'},{id:'west',x:-48,z:-24,name:'Westweg'},
 {id:'nw',x:-48,z:-58,name:'Westkreuz'},{id:'north',x:0,z:-58,name:'Schulstraße'},
 {id:'school',x:0,z:-18,name:'Schule'},{id:'ne',x:48,z:-58,name:'Nordkreuz'},
 {id:'work',x:48,z:-18,name:'Atelierhof'},{id:'junction',x:48,z:18,name:'Ostkreuz'},
 {id:'exit',x:80,z:18,name:'Ausfahrt'},{id:'south',x:0,z:52,name:'Südweg'},
 {id:'sw',x:-48,z:52,name:'Südkreuz'},{id:'se',x:48,z:52,name:'Südost'},
 {id:'park',x:0,z:18,name:'Grünort'}];
export const point=(id:string)=>nodes.find(n=>n.id===id)!;
export const connections=[
 {id:'school-gate',a:'home',b:'school',cost:55,name:'Schuldurchgang'},
 {id:'park-west',a:'home',b:'park',cost:25,name:'Westlicher Grünweg'},
 {id:'park-north',a:'park',b:'school',cost:20,name:'Schulanschluss'},
 {id:'park-east',a:'park',b:'junction',cost:25,name:'Östlicher Grünweg'}];
export const initialLayout=():Layout=>({links:[],street:'mixed',park:'none',entrance:'west',unlimited:false});
export const END=5400;
export const BUDGET=115;
export function layoutValue(l:Layout){return l.links.reduce((v,id)=>v+connections.find(c=>c.id===id)!.cost,0)+(l.street==='mixed'?0:35)+(l.park==='none'?0:l.park==='garden'?25:35);}
export function changeCost(a:Layout,b:Layout){return b.links.filter(x=>!a.links.includes(x)).reduce((v,id)=>v+connections.find(c=>c.id===id)!.cost,0)+(a.street!==b.street?35:0)+(a.park!==b.park&&b.park!=='none'?(b.park==='garden'?25:35):0)+(a.entrance!==b.entrance&&b.park!=='none'?5:0);}
export function validLayout(x:unknown):x is Layout{
 const l=x as Layout;return !!l&&Array.isArray(l.links)&&l.links.every(id=>connections.some(c=>c.id===id))&&new Set(l.links).size===l.links.length&&['mixed','bike','free'].includes(l.street)&&['none','garden','square'].includes(l.park)&&['west','east'].includes(l.entrance)&&typeof l.unlimited==='boolean';
}
export type Edge={id:string;a:string;b:string;length:number;modes:Mode[];bikeSpeed:number;headway:number};
export function graph(l:Layout):Edge[]{
 const pairs=[['home','west'],['west','nw'],['nw','north'],['north','ne'],['north','school'],['ne','work'],['work','junction'],['junction','exit'],['home','sw'],['sw','south'],['south','se'],['se','junction']];
 const make=(id:string,a:string,b:string,modes:Mode[],bikeSpeed=4.2,headway=2):Edge=>({id,a,b,length:Math.hypot(point(a).x-point(b).x,point(a).z-point(b).z)*5,modes,bikeSpeed,headway});
 const edges=pairs.map(([a,b],i)=>make('road-'+i,a,b,['walk','bike','car']));
 // The central carriageway is physically north of the green plot. Its bend is reflected in length.
 const central=make('main','home','junction',l.street==='free'?['walk','bike']:['walk','bike','car'],l.street==='mixed'?2.4:5.2,l.street==='bike'?16:2.5);
 central.length=620;edges.push(central);
 for(const c of connections) if(l.links.includes(c.id)) edges.push(make(c.id,c.a,c.b,['walk','bike'],4.2,0));
 return edges;
}
export type Route={nodes:string[];edges:string[];seconds:number};
export function route(edges:Edge[],start:string,end:string,mode:Mode):Route|null{
 const distance=new Map(nodes.map(n=>[n.id,Infinity]));distance.set(start,0);
 const previous=new Map<string,{from:string;edge:Edge}>();const remaining=new Set(nodes.map(n=>n.id));
 while(remaining.size){let u=[...remaining].sort((a,b)=>distance.get(a)!-distance.get(b)!||a.localeCompare(b))[0];
 if(!Number.isFinite(distance.get(u)!))break;remaining.delete(u);if(u===end)break;
 for(const e of edges){if(!e.modes.includes(mode)||e.a!==u&&e.b!==u)continue;const v=e.a===u?e.b:e.a;
 const t=e.length/(mode==='walk'?1.35:mode==='bike'?e.bikeSpeed:8);
 if(distance.get(u)!+t<distance.get(v)!){distance.set(v,distance.get(u)!+t);previous.set(v,{from:u,edge:e});}}
 }
 if(!Number.isFinite(distance.get(end)!))return null;
 const ids=[end],es:string[]=[];let v=end;while(v!==start){const p=previous.get(v)!;es.unshift(p.edge.id);ids.unshift(p.from);v=p.from;}
 return {nodes:ids,edges:es,seconds:distance.get(end)!};
}
export type Resident={id:number;name:string;home:string;goal:string;mode:Mode;depart:number;deadline:number;breakStart:number;breakEnd:number;bio:string};
export function residents(count=500,seed=20260922):Resident[]{
 let s=seed>>>0;const rand=()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};
 const special:Resident[]=[
 {id:0,name:'Mara',home:'home',goal:'school',mode:'walk',depart:120,deadline:540,breakStart:0,breakEnd:0,bio:'Schulweg zu Fuß · Ankunft bis 07:39'},
 {id:1,name:'Cem',home:'home',goal:'work',mode:'bike',depart:180,deadline:480,breakStart:2100,breakEnd:2910,bio:'Mit dem Rad ins Atelier · Pause 08:05–08:18:30'},
 {id:2,name:'Ruth',home:'home',goal:'exit',mode:'car',depart:190,deadline:370,breakStart:0,breakEnd:0,bio:'Externes Arbeitsziel · Auto für diese Reise erforderlich'}];
 for(let id=3;id<count;id++){const r=rand(),mode:Mode=r<.32?'walk':r<.64?'bike':'car';const home=rand()<.72?'home':'sw';const goal=mode==='car'?'exit':mode==='walk'?'school':'work';const depart=Math.floor(90+rand()*560);
 special.push({id,name:`Bewohner ${id+1}`,home,goal,mode,depart,deadline:depart+(mode==='walk'?480:mode==='bike'?300:240),breakStart:2100+Math.floor(rand()*300),breakEnd:2700+Math.floor(rand()*300),bio:''});}
 return special.slice(0,count);
}
export type Segment={a:string;b:string;start:number;end:number;kind:'move'|'wait'|'stay';edge:string};
export type Journey={person:Resident;route:Route|null;segments:Segment[];arrival:number|null;wait:number;visit:boolean;visitReason:string;returnAt:number|null};
export type Result={journeys:Journey[];onTime:number;arrived:number;unreachable:number;visits:number;meanSeconds:number;flow:Record<string,number>;computeMs:number};
type Event={t:number;id:number;i:number;seq:number};
class Heap {data:Event[]=[]; before(a:Event,b:Event){return a.t<b.t||a.t===b.t&&a.seq<b.seq;} push(e:Event){let i=this.data.length;this.data.push(e);while(i){const p=(i-1)>>1;if(!this.before(e,this.data[p]))break;this.data[i]=this.data[p];i=p;}this.data[i]=e;} pop(){const root=this.data[0],last=this.data.pop()!;if(this.data.length){let i=0;while(i*2+1<this.data.length){let c=i*2+1;if(c+1<this.data.length&&this.before(this.data[c+1],this.data[c]))c++;if(!this.before(this.data[c],last))break;this.data[i]=this.data[c];i=c;}this.data[i]=last;}return root;}}
export function simulate(l:Layout,count=500,seed=20260922):Result{
 const began=performance.now(),edges=graph(l),byId=new Map(edges.map(e=>[e.id,e])),queue=new Heap();let seq=0;
 const cache=new Map<string,Route|null>();const getRoute=(a:string,b:string,m:Mode)=>{const key=`${a}/${b}/${m}`;if(!cache.has(key))cache.set(key,route(edges,a,b,m));return cache.get(key)!;};
 const journeys:Journey[]=residents(count,seed).map(person=>({person,route:getRoute(person.home,person.goal,person.mode),segments:[],arrival:null,wait:0,visit:false,visitReason:'Kein freies Zeitfenster.',returnAt:null}));
 for(const j of journeys)if(j.route)queue.push({t:j.person.depart,id:j.person.id,i:0,seq:seq++});
 const ready=new Map<string,number>(),flow:Record<string,number>={};
 while(queue.data.length){const ev=queue.pop(),j=journeys[ev.id],r=j.route!;
 if(ev.i===r.edges.length){j.arrival=ev.t;continue;}
 const e=byId.get(r.edges[ev.i])!,a=r.nodes[ev.i],b=r.nodes[ev.i+1],mode=j.person.mode,key=`${e.id}/${a}`;
 const start=mode==='car'?Math.max(ev.t,ready.get(key)||0):ev.t;
 if(mode==='car')ready.set(key,start+e.headway);
 if(start>ev.t){j.segments.push({a,b:a,start:ev.t,end:start,kind:'wait',edge:e.id});j.wait+=start-ev.t;}
 const end=start+e.length/(mode==='walk'?1.35:mode==='bike'?e.bikeSpeed:8);
 j.segments.push({a,b,start,end,kind:'move',edge:e.id});flow[e.id]=(flow[e.id]||0)+1;queue.push({t:end,id:ev.id,i:ev.i+1,seq:seq++});
 }
 // One capacity-limited visit, planned in stable departure order. Both walks and a full stay must fit.
 const reservations:{start:number;end:number}[]=[];const capacity=l.park==='garden'?8:14;
 for(const j of [...journeys].sort((a,b)=>a.person.breakStart-b.person.breakStart||a.person.id-b.person.id)){
 const p=j.person;if(!p.breakStart)continue;
 if(l.park==='none'){j.visitReason='Noch kein gestalteter Aufenthaltsort.';continue;}
 const gate=l.entrance==='west'?'park-west':'park-east';
 if(!l.links.includes(gate)){j.visitReason='Der gewählte Platzeingang ist nicht angeschlossen.';continue;}
 if(j.arrival===null||j.arrival>p.breakStart){j.visitReason='Das Tagesziel wurde vor der Pause nicht erreicht.';continue;}
 const visitEdges=edges.filter(e=>!e.id.startsWith('park-')||e.id===gate);
 const there=route(visitEdges,p.goal,'park','walk'),back=route(visitEdges,'park',p.goal,'walk');
 if(!there||!back){j.visitReason='Kein nutzbarer Hin- und Rückweg.';continue;}
 const start=p.breakStart+there.seconds,end=start+90,returnAt=end+back.seconds;
 if(returnAt>p.breakEnd){j.visitReason='Hinweg, 90 Sekunden Pause und Rückweg passen nicht ins Zeitfenster.';continue;}
 const checkpoints=[start,...reservations.filter(r=>r.start>start&&r.start<end).map(r=>r.start)];
 if(checkpoints.some(t=>reservations.filter(r=>r.start<=t&&r.end>t).length>=capacity)){j.visitReason='Der Ort ist in diesem Zeitfenster belegt.';continue;}
 let t=p.breakStart;const append=(r:Route)=>{for(let i=0;i<r.edges.length;i++){const e=byId.get(r.edges[i])!,next=t+e.length/1.35;j.segments.push({a:r.nodes[i],b:r.nodes[i+1],start:t,end:next,kind:'move',edge:e.id});flow[e.id]=(flow[e.id]||0)+1;t=next;}};
 append(there);j.segments.push({a:'park',b:'park',start:t,end:t+90,kind:'stay',edge:''});t+=90;append(back);
 reservations.push({start,end});j.visit=true;j.returnAt=returnAt;j.visitReason='Hinweg, 90 Sekunden Pause und Rückweg passen; ein Platz ist frei.';
 }
 const arrived=journeys.filter(j=>j.arrival!==null),onTime=arrived.filter(j=>j.arrival!<=j.person.deadline).length;
 return {journeys,onTime,arrived:arrived.length,unreachable:count-arrived.length,visits:journeys.filter(j=>j.visit).length,meanSeconds:arrived.reduce((s,j)=>s+j.arrival!-j.person.depart,0)/Math.max(1,arrived.length),flow,computeMs:performance.now()-began};
}
export function position(j:Journey,t:number){
 const seg=j.segments.find(s=>t>=s.start&&t<s.end);
 if(seg){const a=point(seg.a),b=point(seg.b),f=(t-seg.start)/(seg.end-seg.start);return {x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f,kind:seg.kind,edge:seg.edge,f,a:seg.a,b:seg.b};}
 const past=j.segments.filter(s=>s.end<=t).at(-1);const p=point(past?.b||j.person.home);return {...p,kind:t<j.person.depart?'home':j.arrival===null?'unreachable':'arrived',edge:'',f:0,a:p.id,b:p.id};
}
export const clock=(t:number)=>{const seconds=Math.floor(t)+7*3600+30*60;return `${String(Math.floor(seconds/3600)).padStart(2,'0')}:${String(Math.floor(seconds/60)%60).padStart(2,'0')}`;};
