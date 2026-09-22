import {simulate,validLayout} from './simulation';
self.onmessage=(event:MessageEvent)=>{const {id,layout,count}=event.data;try{if(!validLayout(layout)||!Number.isInteger(count)||count<3||count>5000)throw Error('Ungültiges Szenario');self.postMessage({id,result:simulate(layout,count)});}catch(e){self.postMessage({id,error:String(e)});}};
