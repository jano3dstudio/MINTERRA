import {Engine} from '@babylonjs/core/Engines/engine';
import {Scene} from '@babylonjs/core/scene';
import {ArcRotateCamera} from '@babylonjs/core/Cameras/arcRotateCamera';
import {Vector3,Matrix} from '@babylonjs/core/Maths/math.vector';
import {Color3,Color4} from '@babylonjs/core/Maths/math.color';
import {HemisphericLight} from '@babylonjs/core/Lights/hemisphericLight';
import {DirectionalLight} from '@babylonjs/core/Lights/directionalLight';
import {MeshBuilder} from '@babylonjs/core/Meshes/meshBuilder';
import {StandardMaterial} from '@babylonjs/core/Materials/standardMaterial';
import {Mesh} from '@babylonjs/core/Meshes/mesh';
import {TransformNode} from '@babylonjs/core/Meshes/transformNode';
import '@babylonjs/core/Rendering/outlineRenderer';
import {connections,graph,point,position,type Layout,type Result,type Journey} from './simulation';
export class World {
 engine:Engine;scene:Scene;camera:ArcRotateCamera;dynamic:TransformNode;routeRoot:TransformNode;
 agents:Mesh[]=[];markers:Mesh[]=[];time=0;result:Result|null=null;selected=0;flow=false;onSelect:(kind:string,id:string)=>void=()=>{};labels:HTMLElement[]=[];
 materials=new Map<string,StandardMaterial>();
 constructor(public canvas:HTMLCanvasElement,public labelRoot:HTMLElement){
 this.engine=new Engine(canvas,true,{preserveDrawingBuffer:true,stencil:true});this.scene=new Scene(this.engine);this.scene.clearColor=new Color4(.9,.94,.91,1);
 this.camera=new ArcRotateCamera('camera',-Math.PI/2.8,0.78,295,new Vector3(8,0,-1),this.scene);this.camera.attachControl(canvas,true);this.camera.lowerBetaLimit=.28;this.camera.upperBetaLimit=1.25;this.camera.lowerRadiusLimit=80;this.camera.upperRadiusLimit=380;this.camera.wheelPrecision=12;this.camera.panningSensibility=65;this.camera.inertia=.65;
 const fill=new HemisphericLight('sky',new Vector3(0,1,0),this.scene);fill.intensity=.67;fill.groundColor=Color3.FromHexString('#879e86');const sun=new DirectionalLight('sun',new Vector3(-.7,-1,.4),this.scene);sun.intensity=.3;
 this.dynamic=new TransformNode('dynamic',this.scene);this.routeRoot=new TransformNode('routes',this.scene);
 this.box('table',0,-2.2,0,192,4,148,'#bdcdb8');this.box('land',0,.02,0,189,.18,145,'#d3dfc9');
 // Small model blocks, with deliberately open gaps for player-built connections.
 const houses=[[-64,-48,12,14,13],[-63,-26,13,16,11],[-65,0,12,13,17],[-63,35,12,12,11],[-63,56,12,12,14],[-29,-44,13,16,17],[-12,-43,11,14,12],[17,-44,11,16,13],[33,-43,10,16,20],[65,-46,15,17,12],[67,-21,15,19,17],[66,0,12,12,10],[-30,39,13,13,10],[-13,39,12,13,14],[20,40,13,13,13],[36,41,10,12,10],[68,45,15,15,16]];
 houses.forEach(([x,z,w,d,h],i)=>this.building(x,z,w,d,h,i));
 this.box('school',-5,4,-26,24,8,12,'#f8f5e9');this.box('school-roof',-5,8.2,-26,25,.65,13,'#aab7a2');
 this.box('school-yard',9,.25,-15,12,.3,10,'#dcdac8');
 this.box('home-court',-39,.24,20,10,.25,13,'#e9e6d6');
 for(let i=0;i<42;i++){const x=-86+(i*37%170),z=-66+(i*53%130);if(Math.abs(z-4)<9||Math.abs(z-18)<13||Math.abs(x+48)<6||Math.abs(x-48)<7||Math.abs(z+58)<6)continue;this.tree(x,z,2+(i%3)*.35);}
 for(const [id,text] of [['home','WOHNHOF'],['school','SCHULE'],['work','ATELIERHOF'],['exit','AUSFAHRT'],['park','DEIN GRÜNORT']]){const el=document.createElement('button');el.className='world-label';el.textContent=text;el.dataset.node=id;el.onclick=()=>this.onSelect('place',id);labelRoot.append(el);this.labels.push(el);}
 let hovered:Mesh|null=null;
 this.scene.onPointerObservable.add(info=>{if(info.type===4){if(hovered)hovered.renderOutline=false;hovered=info.pickInfo?.pickedMesh as Mesh|null;if(hovered?.metadata){hovered.renderOutline=true;hovered.outlineColor=Color3.FromHexString('#54c98b');hovered.outlineWidth=.3;}else hovered=null;}if(info.type===1&&info.pickInfo?.hit){const meta=info.pickInfo.pickedMesh?.metadata;if(meta)this.onSelect(meta.kind,meta.id);}});
 this.scene.onBeforeRenderObservable.add(()=>this.animate());this.engine.runRenderLoop(()=>this.scene.render());window.addEventListener('resize',()=>this.engine.resize());
 }
 mat(hex:string){if(!this.materials.has(hex)){const m=new StandardMaterial(hex,this.scene);m.diffuseColor=Color3.FromHexString(hex);m.specularColor=Color3.Black();this.materials.set(hex,m);}return this.materials.get(hex)!;}
 box(name:string,x:number,y:number,z:number,w:number,h:number,d:number,color:string,parent?:TransformNode){const m=MeshBuilder.CreateBox(name,{width:w,height:h,depth:d},this.scene);m.position.set(x,y,z);m.material=this.mat(color);if(parent)m.parent=parent;return m;}
 tree(x:number,z:number,r:number,parent?:TransformNode){this.box('trunk',x,1.2,z,.4,2.4,.4,'#9a9975',parent);const crown=MeshBuilder.CreateIcoSphere('tree',{radius:r,subdivisions:1},this.scene);crown.position.set(x,3.5,z);crown.scaling.y=1.1;crown.material=this.mat('#88ae77');if(parent)crown.parent=parent;}
 building(x:number,z:number,w:number,d:number,h:number,i:number){this.box('shadow',x+2,.15,z+2,w+3,.1,d+3,'#bdccb5');this.box('house',x,h/2,z,w,h,d,i%3?'#f4f2e7':'#e6e7db');this.box('roof',x,h+.2,z,w+.5,.5,d+.5,i%4?'#c4cfbf':'#9eafa0');this.box('roof-garden',x,h+.6,z,w*.6,.5,d*.6,'#a8bd98');for(let q=0;q<Math.floor(w/3);q++)for(let floor=0;floor<Math.floor(h/4);floor++)this.box('window',x-w/2+2+q*3,2.3+floor*4,z+d/2+.04,1.05,1.65,.1,'#91a8a0');}
 pathPoints(a:string,b:string,id:string){const p=point(a),q=point(b);return id==='main'?[new Vector3(p.x,.35,p.z),new Vector3(p.x,.35,4),new Vector3(q.x,.35,4),new Vector3(q.x,.35,q.z)]:[new Vector3(p.x,.35,p.z),new Vector3(q.x,.35,q.z)];}
 strip(points:Vector3[],width:number,color:string,parent:TransformNode,meta?:any){for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],m=this.box('path',(a.x+b.x)/2,a.y,(a.z+b.z)/2,width,.14,Vector3.Distance(a,b),color,parent);m.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);m.metadata=meta;}}
 update(layout:Layout,result:Result,baseline:Result,selected:number){this.dynamic.dispose();this.dynamic=new TransformNode('dynamic',this.scene);this.result=result;this.selected=selected;
 for(const e of graph(layout)){const pts=this.pathPoints(e.a,e.b,e.id),isLink=connections.some(c=>c.id===e.id);const color=isLink?'#a5d7af':e.id==='main'&&layout.street!=='mixed'?'#97c3ad':'#eeeede';this.strip(pts,isLink?2.5:e.id==='main'?5.6:4.1,color,this.dynamic,{kind:'edge',id:e.id});if(!isLink)this.strip(pts,.16,'#c2cec1',this.dynamic);}
 for(const c of connections){if(layout.links.includes(c.id))continue;const a=point(c.a),b=point(c.b),dist=Math.hypot(b.x-a.x,b.z-a.z);for(let t=0;t<dist;t+=5){const f=t/dist,g=Math.min(t+2,dist)/dist;this.strip([new Vector3(a.x+(b.x-a.x)*f,.6,a.z+(b.z-a.z)*f),new Vector3(a.x+(b.x-a.x)*g,.6,a.z+(b.z-a.z)*g)],.55,'#91b79e',this.dynamic,{kind:'connection',id:c.id});}
 const dot=MeshBuilder.CreateSphere('build-point',{diameter:2.8,segments:8},this.scene);dot.position.set((a.x+b.x)/2,.85,(a.z+b.z)/2);dot.material=this.mat('#427760');dot.parent=this.dynamic;dot.metadata={kind:'connection',id:c.id};}
 this.box('park-base',0,.3,21,23,.35,16,layout.park==='none'?'#bdcdb0':layout.park==='garden'?'#9ec48c':'#e0d7ba',this.dynamic).metadata={kind:'place',id:'park'};
 if(layout.park!=='none'){for(const x of [-8,8])for(const z of [17,26])this.tree(x,z,2.2,this.dynamic);for(const x of [-5,5])this.box('bench',x,1,21,3,.5,1,'#9c8d70',this.dynamic);const x=layout.entrance==='west'?-12:12;this.box('entrance',x,.65,18,3,.3,4,'#edf2d9',this.dynamic);}
 this.agents=[];for(const j of result.journeys){const mode=j.person.mode;const m=mode==='walk'?MeshBuilder.CreateCapsule('resident',{height:1.6,radius:.42,tessellation:4,subdivisions:1},this.scene):MeshBuilder.CreateBox('resident',{width:mode==='car'?1.35:.5,height:mode==='car'?.8:1,depth:mode==='car'?2.7:1.8},this.scene);m.material=this.mat(j.person.id<3?['#cd9862','#388a75','#6e83b4'][j.person.id]:mode==='walk'?'#a48061':mode==='bike'?'#458871':'#8395ad');m.parent=this.dynamic;m.metadata={kind:'resident',id:String(j.person.id)};this.agents.push(m);}
 this.markers=[];for(let i=0;i<3;i++){const m=MeshBuilder.CreateTorus('person-ring',{diameter:4,thickness:.35,tessellation:24},this.scene);m.material=this.mat(['#d49650','#2e856a','#6c82b5'][i]);m.parent=this.dynamic;this.markers.push(m);}
 this.showRoute(selected,baseline);
 }
 showRoute(id:number,baseline:Result){this.selected=id;this.routeRoot.dispose();this.routeRoot=new TransformNode('routes',this.scene);if(!this.result)return;
 for(const [r,color,y,w] of [[baseline,'#bd997e',.73,.35],[this.result,'#287b62',.9,.7]] as const){const route=r.journeys[id]?.route;if(!route)continue;route.edges.forEach((edge,i)=>{const pts=this.pathPoints(route.nodes[i],route.nodes[i+1],edge).map(p=>new Vector3(p.x,y,p.z));this.strip(pts,w,color,this.routeRoot);});}}
 animate(){if(this.result){for(let i=0;i<this.agents.length;i++){const j=this.result.journeys[i],p=position(j,this.time),m=this.agents[i];let x=p.x,z=p.z;
 if(p.edge==='main'&&p.kind==='move'){const pts=this.pathPoints(p.a,p.b,'main');const lengths=pts.slice(1).map((v,k)=>Vector3.Distance(v,pts[k]));let d=p.f*lengths.reduce((a,b)=>a+b,0);for(let k=0;k<lengths.length;k++){if(d<=lengths[k]){const v=Vector3.Lerp(pts[k],pts[k+1],d/lengths[k]);x=v.x;z=v.z;break;}d-=lengths[k];}}
 const offset=(i%5-2)*.27;m.position.set(x+offset,.95,z+offset);m.setEnabled(i<3||['move','wait','stay'].includes(p.kind));if(p.a!==p.b){const a=point(p.a),b=point(p.b);m.rotation.y=Math.atan2(b.x-a.x,b.z-a.z);}if(i<3)this.markers[i].position.set(x,.7,z);}
 }
 for(const el of this.labels){const p=point(el.dataset.node!),v=Vector3.Project(new Vector3(p.x,5,p.z),Matrix.Identity(),this.scene.getTransformMatrix(),this.camera.viewport.toGlobal(this.engine.getRenderWidth(),this.engine.getRenderHeight()));el.style.left=`${v.x/this.engine.getHardwareScalingLevel()}px`;el.style.top=`${v.y/this.engine.getHardwareScalingLevel()}px`;el.hidden=v.z<0||v.z>1;}
 }
 focus(id:string){const p=point(id);this.camera.setTarget(new Vector3(p.x,0,p.z));}
 resetCamera(){this.camera.setTarget(new Vector3(8,0,-1));this.camera.alpha=-Math.PI/2.8;this.camera.beta=.78;this.camera.radius=295;}
}
