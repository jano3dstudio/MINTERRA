import {gateOpen, type Board,type State} from './engine';
const colors=['#df9863','#429f99'];
const pt=(b:Board,p:number)=>[64+(p%b.width)*64,55+Math.floor(p/b.width)*64];
const shape=(i:number,x:number,y:number,fill:string,stroke='none')=>i===0?`<path d="M${x} ${y-12}l12 12-12 12-12-12Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`:`<circle cx="${x}" cy="${y}" r="11" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
export function drawBoard(svg:SVGSVGElement,b:Board,s:State){
 svg.setAttribute('viewBox',`0 0 ${b.width*64+64} ${b.height*64+106}`);
 let out=`<defs><filter id="soft"><feGaussianBlur stdDeviation="7"/></filter><pattern id="grain" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".6" fill="#284b34" opacity=".08"/></pattern></defs>`;
 out+=`<rect x="31" y="38" width="${b.width*64+2}" height="${b.height*64+2}" rx="28" fill="#394e39" opacity=".17" filter="url(#soft)" transform="translate(0 22)"/>`;
 out+=`<rect x="32" y="28" width="${b.width*64}" height="${b.height*64}" rx="21" fill="#3c695a"/><rect x="32" y="22" width="${b.width*64}" height="${b.height*64}" rx="21" fill="#82ae90"/>`;
 for(let y=0;y<b.height;y++)for(let x=0;x<b.width;x++){
  const p=y*b.width+x,[cx,cy]=pt(b,p),wall=b.walls.includes(p);
  if(!wall&&!b.floor.includes(p))continue;
  if(wall){
   const edge=x===0||y===0||x===b.width-1||y===b.height-1;
   const h=edge?9:16;
   out+=`<g class="wall"><rect x="${cx-29}" y="${cy-22}" width="58" height="56" rx="7" fill="${edge?'#416e59':'#608563'}"/><rect x="${cx-29}" y="${cy-26-h}" width="58" height="56" rx="7" fill="${edge?'#71a685':'#a2c391'}"/><rect x="${cx-26}" y="${cy-23-h}" width="52" height="50" rx="5" fill="url(#grain)"/></g>`;
   if((x*13+y*7)%5===0)out+=`<g opacity=".9"><path d="M${cx} ${cy+7-h}v-15" stroke="#718869" stroke-width="2"/><ellipse cx="${cx-5}" cy="${cy-7-h}" rx="7" ry="4" transform="rotate(25 ${cx-5} ${cy-7-h})" fill="#748e6a"/><ellipse cx="${cx+5}" cy="${cy-13-h}" rx="7" ry="4" transform="rotate(-30 ${cx+5} ${cy-13-h})" fill="#69835f"/></g>`;
  }else{
   out+=`<rect x="${cx-30}" y="${cy-29}" width="60" height="59" rx="5" fill="${(x+y)%2?'#eee0ba':'#e3d3ad'}"/><path d="M${cx-22} ${cy+23}h43" stroke="#dadbc7" opacity=".65"/>`;
  }
 }
 out+='<g class="blooms">';for(const p of b.walls.filter(p=>p%3===0)){const [x,y]=pt(b,p);out+=`<g transform="translate(${x} ${y-17})"><path d="M0 14V0" stroke="#54774e" stroke-width="2"/><circle cx="-4" cy="-3" r="5" fill="#f4d889"/><circle cx="4" cy="-3" r="5" fill="#f4d889"/><circle cy="-8" r="5" fill="#f4d889"/><circle cy="-3" r="3" fill="#bf823c"/></g>`;}out+='</g>';
 for(const p of b.plates){const [x,y]=pt(b,p);out+=`<g class="plate" data-pos="${p}"><circle cx="${x}" cy="${y}" r="20" fill="#a7b5a0" stroke="#617e6c" stroke-width="2"/><circle class="plate-light" cx="${x}" cy="${y}" r="11" fill="#dce6c8"/><path d="M${x-5} ${y}h10M${x} ${y-5}v10" stroke="#547b61" stroke-width="2"/></g>`;}
 for(const p of b.gates){const [x,y]=pt(b,p);out+=`<g class="gate" data-pos="${p}" transform="translate(${x} ${y})"><rect x="-26" y="-25" width="52" height="51" rx="4" fill="#87b0a3" opacity=".18"/><g class="gate-bars"><path d="M-18 -22v43M-6 -22v43M6 -22v43M18 -22v43" stroke="#557e6b" stroke-width="5"/><path d="M-24 -12h48M-24 12h48" stroke="#739682" stroke-width="4"/></g><circle cy="-25" r="5" fill="#e4bd61"/></g>`;}
 for(let i=0;i<b.goals.length;i++){const [x,y]=pt(b,b.goals[i]);out+=`<g class="home" data-home="${i}"><circle cx="${x}" cy="${y}" r="25" fill="${colors[i]}" opacity=".10"/><circle class="home-ring" cx="${x}" cy="${y}" r="23" fill="none" stroke="${colors[i]}" stroke-width="2" stroke-dasharray="3 5"/>${shape(i,x,y,'none',colors[i])}</g>`;}
 for(let i=0;i<s.crates.length;i++)out+=`<g id="crate-${i}" class="piece crate"><ellipse cy="18" rx="23" ry="12" fill="#5c6547" opacity=".18"/><rect x="-23" y="-19" width="46" height="43" rx="5" fill="#947053"/><rect x="-23" y="-25" width="46" height="39" rx="5" fill="#bd956c"/><rect x="-18" y="-20" width="36" height="28" rx="4" fill="#667c50"/><circle cx="-8" cy="-7" r="10" fill="#9cb878"/><circle cx="9" cy="-11" r="10" fill="#809e61"/><circle cx="0" cy="-17" r="8" fill="#b9cb8c"/><path d="M-19 16h38" stroke="#ddba8e" opacity=".55"/></g>`;
 for(let i=0;i<s.people.length;i++)out+=`<g id="walker-${i}" class="piece walker" aria-label="${i===0?'Mara':'Cem'}"><ellipse cy="14" rx="17" ry="9" fill="#394d39" opacity=".2"/><g class="body"><path d="M-13 10Q-16 -12 0 -15Q16 -12 13 10Q0 20 -13 10Z" fill="${colors[i]}"/><circle cy="-18" r="10" fill="#f1d8b2"/><path d="M-10 -20q0-13 15-7l5 9q-12-5-20-2" fill="${i===0?'#725644':'#394a41'}"/>${shape(i,0,0,'#f4f0dc')}<circle cx="4" cy="-17" r="1.4" fill="#493f31"/></g></g>`;
 svg.innerHTML=out;updateBoard(svg,b,s,true);
}
export function updateBoard(svg:SVGSVGElement,b:Board,s:State,instant=false){
 const open=gateOpen(b,s);svg.classList.toggle('open',open);
 const position=(id:string,p:number,offset=0)=>{const el=svg.querySelector<SVGGElement>(id)!;const [x,y]=pt(b,p);el.style.transition=instant?'none':'';el.style.transform=`translate(${x+offset}px,${y}px)`;};
 s.crates.forEach((p,i)=>position('#crate-'+i,p));
 s.people.forEach((p,i)=>{position('#walker-'+i,p,s.people.length===2&&s.people[0]===s.people[1]?(i===0?-11:11):0);svg.querySelector('#walker-'+i)?.classList.toggle('arrived',p===b.goals[i]);svg.querySelector(`[data-home="${i}"]`)?.classList.toggle('filled',p===b.goals[i]);});
 b.plates.forEach(p=>svg.querySelector(`[data-pos="${p}"].plate`)?.classList.toggle('pressed',s.people.includes(p)||s.crates.includes(p)));
}
