import './style.css';
import {parse,clone,step,key,solved,directions,type Direction,type State} from './engine';
import {levels} from './levels';
import {drawBoard,updateBoard} from './view';
import {worldMarkup,chapterOpen,chapterCount} from './world';
let atWorld=true,selected=0;
const STORE='minterra.puzzle.v3';
type Lang=0|1;
let lang:Lang=0,index=0,board=parse(levels[0].rows),state=clone(board.start),history:State[]=[],commands:Direction[]=[],completed=new Set<string>(),saved=false,hinted=false,lastMove=0;
const text=(de:string,en:string)=>lang?en:de;
const icons:Record<string,string>={up:'M6 14l6-6 6 6',right:'M10 6l6 6-6 6',down:'M6 10l6 6 6-6',left:'M14 6l-6 6 6 6',undo:'M9 5 4 10l5 5M4 10h9a6 6 0 0 1 0 12',reset:'M4 10a8 8 0 1 1 1 9M4 4v6h6',grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',sound:'M4 9h4l5-4v14l-5-4H4zM17 8q5 4 0 8',check:'M5 12l4 4 10-10',hint:'M9 18h6M10 21h4M8 14a6 6 0 1 1 8 0l-1 2H9z',save:'M5 3h12l4 4v14H3V3h2M7 3v7h10V3M7 21v-8h10v8'};
const icon=(name:string)=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[name]}"/></svg>`;
let sound=false,audio:AudioContext|undefined;
function tone(win=false){if(!sound)return;try{audio??=new AudioContext();void audio.resume();const t=audio.currentTime;for(let j=0;j<(win?3:1);j++){const o=audio.createOscillator(),g=audio.createGain();o.type='sine';o.frequency.value=win?[392,494,587][j]:220+index*12;g.gain.setValueAtTime(0,t+j*.1);g.gain.linearRampToValueAtTime(.055,t+j*.1+.01);g.gain.exponentialRampToValueAtTime(.001,t+j*.1+.25);o.connect(g);g.connect(audio.destination);o.start(t+j*.1);o.stop(t+j*.1+.28);}}catch{sound=false;}}
function replay(i:number,list:Direction[]){const b=parse(levels[i].rows);let s=clone(b.start);const h:State[]=[];for(const d of list){if(solved(b,s))throw Error('Moves after finish');const next=step(b,s,d);if(key(next)===key(s))throw Error('Invalid saved move');h.push(s);s=next;}return {b,s,h};}
try{const raw=localStorage.getItem(STORE);if(raw){const data=JSON.parse(raw);if(data.version!==3||!Number.isInteger(data.level)||data.level<0||data.level>=levels.length||!Array.isArray(data.moves)||data.moves.length>10000||data.moves.some((d:unknown)=>!directions.includes(d as Direction))||!Array.isArray(data.completed))throw Error('Invalid save');const r=replay(data.level,data.moves);index=data.level;board=r.b;state=r.s;history=r.h;commands=data.moves;completed=new Set(data.completed.filter((id:unknown)=>levels.some(l=>l.id===id)));lang=data.lang===1?1:0;saved=true;}}catch{/* Keep old or unsupported saves intact. */}
function store(){if(!saved)return;try{localStorage.setItem(STORE,JSON.stringify({version:3,level:index,moves:commands,completed:[...completed],lang}));}catch{saved=false;toast(text('Speichern nicht möglich. Dein Spiel läuft weiter.','Cannot save here. You can keep playing.'));}}
function toast(message:string){const el=document.querySelector<HTMLElement>('#notice');if(el)el.textContent=message;}
function mount(){
 window.scrollTo({top:0,behavior:'instant'});
 document.documentElement.lang=lang?'en':'de';
 document.querySelector('#app')!.innerHTML=`
 <header class="top"><a class="brand" href="https://jonaschlegelmilch.de/minterra/"><img src="./icon.svg" alt=""><span>MINTERRA<small>${text('GÄRTEN DES GLEICHKLANGS','GARDENS IN UNISON')}</small></span></a><div class="top-actions"><button id="map" title="${text('Zur Oberwelt','Return to world')}">${icon('grid')}<span>${text('Oberwelt','World')}</span></button><button id="sound" aria-pressed="${sound}" title="${text('Ton ein oder aus','Toggle sound')}">${icon('sound')}<span>${sound?text('Ton an','Sound on'):text('Ton aus','Sound off')}</span></button><button id="lang" aria-label="${text('Switch to English','Auf Deutsch wechseln')}">${lang?'EN':'DE'}</button></div></header>
 <section id="world" ${atWorld?'':'hidden'}>${worldMarkup(completed,selected,lang)}</section><main ${atWorld?'hidden':''}><div class="chapter-line"><span id="chapter"></span><div class="progress" aria-label="${text('Gärten auswählen','Choose a garden')}">${levels.map((l,i)=>`<button data-level="${i}" aria-label="${i+1}. ${l.name[lang]}" title="${l.name[lang]}">${i+1}</button>`).join('')}</div><span id="count"></span></div>
 <section class="play-area" aria-label="${text('Spielfeld','Game board')}"><div class="level-heading"><span class="eyebrow" id="number"></span><h1 id="title"></h1><p id="thought"></p></div><div class="board-wrap"><svg id="board" role="img" aria-label="${text('Garten mit Figuren und ihren Zielfeldern','Garden with walkers and their homes')}"></svg><div id="success" class="success" hidden><span class="win-icon">${icon('check')}</span><div><strong id="win-title"></strong><p id="win-text"></p></div><button id="next">${text('Nächster Garten','Next garden')} ${icon('right')}</button></div></div>
 <div class="legend"><span><i class="diamond"></i>${text('Mara → Raute','Mara → diamond')}</span><span id="cem-key"><i class="circle"></i>${text('Cem → Kreis','Cem → circle')}</span><span id="moves"></span></div></section>
 <section class="bottom-controls" aria-label="${text('Spielsteuerung','Game controls')}"><div class="tools"><button id="undo">${icon('undo')}<span>${text('Zurück','Undo')}<kbd>Z</kbd></span></button><button id="reset">${icon('reset')}<span>${text('Neustart','Restart')}<kbd>R</kbd></span></button></div><div class="direction-wrap"><p id="rule"></p><div class="directions">${directions.map(d=>`<button data-dir="${d}" aria-label="${({up:text('Nach oben','Move up'),right:text('Nach rechts','Move right'),down:text('Nach unten','Move down'),left:text('Nach links','Move left')})[d]}">${icon(d)}</button>`).join('')}</div><small>${text('Pfeiltasten · WASD · Wischen','Arrow keys · WASD · Swipe')}</small></div><div class="hint-wrap"><button id="hint">${icon('hint')} ${text('Ein Gedanke','A thought')}</button><p id="hint-text" hidden></p></div></section>
 <div class="session"><button id="remember">${icon('save')}<span>${saved?text('Fortschritt wird gemerkt','Progress is saved'):text('Fortschritt merken','Remember progress')}</span></button><span>${text('Nur auf diesem Gerät. Kein Konto.','Only on this device. No account.')}</span><span id="notice" role="status" aria-live="polite"></span></div></main>
 <footer><a href="https://www.linkedin.com/in/jonaschlegelmilch/" title="LinkedIn-Profil öffnen">Created by Jona Fynn Schlegelmilch</a><span>${text('Rätselprototyp','Puzzle prototype')} 0.3.0</span></footer>
 <dialog id="gardens"><div class="dialog-head"><div><span class="eyebrow">MINTERRA</span><h2>${text('Such dir einen Gedanken aus.','Pick a thought to follow.')}</h2></div><button id="close-map">${text('Schließen','Close')}</button></div><p>${text('Drei Gärten öffnen den nächsten Teil des Viertels. Innerhalb eines Kapitels kannst du frei wechseln.','Three gardens open the next part of the neighbourhood. Explore each chapter in any order.')}</p>${[0,1,2].map(c=>`<h3>${chapterName(c)}</h3><div class="garden-grid">${levels.map((l,i)=>l.chapter===c?`<button data-garden="${i}"><span>${String(i+1).padStart(2,'0')}</span><strong>${l.name[lang]}</strong><small>${completed.has(l.id)?text('Entdeckt','Discovered'):text('Betreten','Enter')}</small></button>`:'').join('')}</div>`).join('')}<p class="storage-note">${text('Gespeichert wird nur dein Rätselstand im Browser. Der frühere Stadt-Spielstand bleibt erhalten.','Only puzzle progress is saved in your browser. Your earlier city save stays intact.')}</p><div class="data-actions"><button id="export">${text('Spielstand exportieren','Export progress')}</button><button id="delete">${text('Gespeicherten Rätselstand löschen','Delete saved puzzle progress')}</button></div></dialog>`;
 document.querySelector('#map')!.addEventListener('click',()=>{atWorld=true;selected=index;mount();});
 document.querySelectorAll<HTMLElement>('[data-world]').forEach(el=>el.addEventListener('click',()=>selectWorld(Number(el.dataset.world))));
 document.querySelector('#enter-garden')!.addEventListener('click',()=>{if(chapterOpen(levels[selected].chapter,completed))load(selected);});
 document.querySelector('#world-save')!.addEventListener('click',()=>document.querySelector<HTMLButtonElement>('#remember')!.click());
 document.querySelector('#world-journal')!.addEventListener('click',()=>document.querySelector<HTMLDialogElement>('#gardens')!.showModal());
 document.querySelectorAll<HTMLButtonElement>('[data-garden]').forEach(el=>el.disabled=!chapterOpen(levels[Number(el.dataset.garden)].chapter,completed));
 document.querySelectorAll<HTMLButtonElement>('[data-level]').forEach(el=>el.disabled=!chapterOpen(levels[Number(el.dataset.level)].chapter,completed));
 document.querySelector('#close-map')!.addEventListener('click',()=>document.querySelector<HTMLDialogElement>('#gardens')!.close());
 document.querySelector('#sound')!.addEventListener('click',()=>{sound=!sound;mount();if(sound)tone();});
 document.querySelector('#lang')!.addEventListener('click',()=>{lang=lang?0:1;store();mount();});
 document.querySelectorAll<HTMLElement>('[data-dir]').forEach(el=>el.addEventListener('click',()=>move(el.dataset.dir as Direction)));
 document.querySelectorAll<HTMLElement>('[data-level],[data-garden]').forEach(el=>el.addEventListener('click',()=>load(Number(el.dataset.level??el.dataset.garden))));
 document.querySelector('#undo')!.addEventListener('click',undo);
 document.querySelector('#reset')!.addEventListener('click',()=>{state=clone(board.start);history=[];commands=[];hinted=false;store();refresh(true);});
 document.querySelector('#next')!.addEventListener('click',()=>{atWorld=true;selected=Math.min(index+1,levels.length-1);mount();});
 document.querySelector('#hint')!.addEventListener('click',()=>{hinted=!hinted;refresh();});
 document.querySelector('#remember')!.addEventListener('click',()=>{saved=true;store();mount();toast(saved?text('Gespeichert. Weitere Züge werden automatisch gemerkt.','Saved. Further moves are remembered automatically.'):text('Speichern ist hier nicht verfügbar.','Saving is unavailable here.'));});
 document.querySelector('#export')!.addEventListener('click',()=>{const blob=new Blob([JSON.stringify({version:3,level:index,moves:commands,completed:[...completed],lang},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='minterra-puzzle.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
 document.querySelector('#delete')!.addEventListener('click',()=>{if(confirm(text('Gespeicherten Rätselstand auf diesem Gerät löschen? Exportiere ihn bei Bedarf vorher. Die laufende Sitzung und der alte Stadt-Spielstand bleiben erhalten.','Delete saved puzzle progress on this device? Export it first if needed. The current session and old city save remain.'))){try{localStorage.removeItem(STORE);saved=false;mount();toast(text('Gespeicherter Rätselstand gelöscht.','Saved puzzle progress deleted.'));}catch{toast(text('Löschen nicht möglich.','Unable to delete.'));}}});
 const area=document.querySelector<HTMLElement>('.board-wrap')!;let start:[number,number]|null=null;
 area.addEventListener('pointerdown',e=>{if((e.target as Element).closest('button'))return;start=[e.clientX,e.clientY];area.setPointerCapture(e.pointerId);});
 area.addEventListener('pointerup',e=>{if(!start)return;const dx=e.clientX-start[0],dy=e.clientY-start[1];start=null;if(Math.max(Math.abs(dx),Math.abs(dy))>24)move(Math.abs(dx)>Math.abs(dy)?dx>0?'right':'left':dy>0?'down':'up');});
 area.addEventListener('pointercancel',()=>{start=null;});
 drawBoard(document.querySelector<SVGSVGElement>('#board')!,board,state);refresh(true);
}
function chapterName(c:number){return [['I · Der verwilderte Hof','I · The forgotten courtyard'],['II · Die Dachgärten','II · The roof gardens'],['III · Das Gewächshaus','III · The greenhouse']][c][lang];}
function refresh(instant=false){
 const level=levels[index],win=solved(board,state),q=(id:string)=>document.querySelector<HTMLElement>(id)!;
 q('#chapter').textContent=chapterName(level.chapter);q('#number').textContent=text('GARTEN','GARDEN')+' '+String(index+1).padStart(2,'0')+' / '+levels.length;
 q('#title').textContent=level.name[lang];q('#thought').textContent=level.thought[lang];q('#moves').textContent=history.length+' '+(history.length===1?text('Zug','move'):text('Züge','moves'));
 q('#count').textContent=completed.size+' / '+levels.length+' '+text('entdeckt','discovered');q('#cem-key').hidden=board.start.people.length<2;
 q('#rule').textContent=board.start.people.length===1?text('Bring Mara auf die Raute.','Bring Mara to the diamond.'):text('Ein Zug bewegt beide. Beide müssen nach Hause.','One move leads both. Bring them both home.');
 q('#hint-text').textContent=level.hint[lang];q('#hint-text').hidden=!hinted;
 q('#success').hidden=!win;q('#win-title').textContent=index===levels.length-1?text('Alles hängt zusammen.','Everything connects.'):text('Ein Gedanke weiter.','One thought further.');
 q('#win-text').textContent=chapterCount(level.chapter,completed)===3?text('Drei Gärten blühen. Ein neuer Teil des Viertels erwacht.','Three gardens bloom. Another part of the neighbourhood awakens.'):text('Ein Stück unseres Gartens ist zurück.','A little piece of our garden is back.');
 q('#next').innerHTML=text('Zur Oberwelt','Back to world')+icon('right');
 (q('#undo') as HTMLButtonElement).disabled=history.length===0;
 document.querySelectorAll<HTMLButtonElement>('[data-dir]').forEach(el=>el.disabled=win);
 document.querySelectorAll<HTMLElement>('[data-level]').forEach(el=>{const i=Number(el.dataset.level);el.classList.toggle('current',i===index);el.classList.toggle('done',completed.has(levels[i].id));el.setAttribute('aria-current',String(i===index));});
 document.querySelector('.board-wrap')!.classList.toggle('won',win);
 updateBoard(document.querySelector<SVGSVGElement>('#board')!,board,state,instant);
 const positions=state.people.map((p,i)=>`${i===0?'Mara':'Cem'}: ${text('Zeile','row')} ${Math.floor(p/board.width)}, ${text('Spalte','column')} ${p%board.width}${p===board.goals[i]?text(', am Ziel',', home'):''}`).join('. ');
 document.querySelector('#board')!.setAttribute('aria-label',positions);
}
function load(i:number){if(!chapterOpen(levels[i].chapter,completed))return;if(atWorld&&i===index&&history.length){atWorld=false;mount();return;}atWorld=false;index=i;board=parse(levels[i].rows);state=clone(board.start);history=[];commands=[];hinted=false;lastMove=0;store();mount();}
function move(d:Direction){if(atWorld)return;if(solved(board,state))return;const now=performance.now();lastMove=now;const next=step(board,state,d);if(key(next)===key(state)){if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.querySelector('.board-wrap')!.animate([{transform:'translateX(0)'},{transform:'translateX(3px)'},{transform:'translateX(0)'}],{duration:130});toast(text('Hier halten beide an. Eine andere Richtung?','Both stop here. Another direction?'));return;}
 history.push(clone(state));commands.push(d);state=next;const win=solved(board,state);if(win)completed.add(levels[index].id);tone(win);store();refresh();if(win)celebrate();toast(win?text('Garten gelöst. Weiter oder mit Z zurück.','Garden solved. Continue or undo with Z.'):'');}
function undo(){if(!history.length)return;state=history.pop()!;commands.pop();store();refresh();toast('');}
window.addEventListener('keydown',e=>{if(document.querySelector<HTMLDialogElement>('#gardens')?.open)return;const target=e.target as HTMLElement;if(['INPUT','SELECT','TEXTAREA'].includes(target.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;const map:Record<string,Direction>={ArrowUp:'up',ArrowRight:'right',ArrowDown:'down',ArrowLeft:'left',w:'up',d:'right',s:'down',a:'left'};const d=map[e.key];if(atWorld){if(d){e.preventDefault();selectWorld(Math.max(0,Math.min(levels.length-1,selected+(d==='left'||d==='up'?-1:1))));}else if(e.key==='Enter'&&(target.hasAttribute('data-world')||(target.tagName!=='BUTTON'&&target.tagName!=='A'))){e.preventDefault();if(chapterOpen(levels[selected].chapter,completed))load(selected);}return;}if(e.key==='Escape'){atWorld=true;selected=index;mount();return;}if(d){e.preventDefault();if(!e.repeat||performance.now()-lastMove>130)move(d);}else if(e.key.toLowerCase()==='z'||e.key==='Backspace'){e.preventDefault();undo();}else if(e.key.toLowerCase()==='r'){e.preventDefault();document.querySelector<HTMLButtonElement>('#reset')!.click();}});
selected=index;mount();


function selectWorld(i:number){const previous=selected;selected=i;const panel=document.querySelector<HTMLElement>('#world')!;panel.innerHTML=worldMarkup(completed,selected,lang,previous);panel.querySelectorAll<HTMLElement>('[data-world]').forEach(el=>el.addEventListener('click',()=>selectWorld(Number(el.dataset.world))));panel.querySelector('#enter-garden')!.addEventListener('click',()=>{if(chapterOpen(levels[selected].chapter,completed))load(selected);});panel.querySelector('#world-save')!.addEventListener('click',()=>document.querySelector<HTMLButtonElement>('#remember')!.click());panel.querySelector('#world-journal')!.addEventListener('click',()=>document.querySelector<HTMLDialogElement>('#gardens')!.showModal());panel.querySelector<HTMLButtonElement>(`[data-world="${i}"]`)?.focus({preventScroll:true});}
function celebrate(){
 const wrap=document.querySelector('.board-wrap')!;
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const particles=document.createElement('div');particles.className='petals';particles.setAttribute('aria-hidden','true');
 particles.innerHTML=Array.from({length:36},(_,i)=>`<i style="--x:${Math.sin(i*2.4)*240}px;--y:${-80-(i%7)*40}px;--r:${i*47}deg;--delay:${i%6*.055}s;background:${['#f4ce78','#95e5b5','#f6a9af','#bdb1fa'][i%4]}"></i>`).join('');wrap.append(particles);setTimeout(()=>particles.remove(),2300);
}

import './return.css';
