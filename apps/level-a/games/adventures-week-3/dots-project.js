/* Picture-building dot-to-dot: coordinates are part of each illustration, not an overlay on a finished image. */
(() => {
 const pictures={
  letters:{name:'trophy',range:'A–F',points:[[200,130],[400,130],[385,240],[340,300],[260,300],[215,240]],
   segments:['M200 130 H400','M400 130 Q403 185 385 240','M385 240 Q374 279 340 300','M340 300 Q300 323 260 300','M260 300 Q226 279 215 240'],close:'M215 240 Q197 185 200 130',
   art:`<g class="worksheet-details" stroke="#34434a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"><path class="trophy-metal" d="M207 159 H163 Q146 250 228 256 L220 232 Q175 227 185 182 H210Z M393 159 H437 Q454 250 372 256 L380 232 Q425 227 415 182 H390Z" fill="white"/><path class="trophy-metal" d="M281 302 H319 V376 H353 L365 408 H235 L247 376 H281Z" fill="white"/><path class="trophy-base" d="M232 408 H368 V443 H232Z" fill="white"/><path class="reveal-detail" d="M200 130 H400 Q403 185 385 240 Q374 279 340 300 Q300 323 260 300 Q226 279 215 240 Q197 185 200 130Z" fill="url(#gold)" stroke="none"/><path d="M300 184 L310 206 L335 209 L317 225 L321 250 L300 238 L279 250 L283 225 L265 209 L290 206Z" fill="white" stroke-width="3"/></g>`},
  numbers:{name:'tennis racket',range:'1–8',points:[[300,80],[380,115],[410,190],[380,265],[300,300],[220,265],[190,190],[220,115]],
   segments:['M300 80 Q350 80 380 115','M380 115 Q410 145 410 190','M410 190 Q410 235 380 265','M380 265 Q350 300 300 300','M300 300 Q250 300 220 265','M220 265 Q190 235 190 190','M190 190 Q190 145 220 115'],close:'M220 115 Q250 80 300 80',
   art:`<g class="worksheet-details" stroke="#34434a" stroke-width="5" stroke-linejoin="round"><path class="racket-neck" d="M260 289 L285 350 H315 L340 289 L321 297 L305 332 H295 L279 297Z" fill="white"/><rect class="racket-grip" x="281" y="350" width="38" height="100" rx="12" fill="white"/><path d="M284 370 L316 359 M284 390 L316 379 M284 410 L316 399 M284 430 L316 419" fill="none" stroke-width="3"/><g class="reveal-detail"><ellipse cx="300" cy="190" rx="105" ry="105" fill="#e2fbff" stroke="#37b7c2" stroke-width="14"/><path d="M240 112 V268 M270 91 V289 M300 87 V293 M330 91 V289 M360 112 V268 M222 130 H378 M200 160 H400 M199 190 H401 M200 220 H400 M222 250 H378" fill="none" stroke="#84beca" stroke-width="2"/></g></g>`}
 };
 window.Month9Dots={mount({stage,prompt,instruction,tone,feedback,complete,mode='letters',say=()=>{}}){
  const spec=pictures[mode==='numbers'?'numbers':'letters'],numberMode=mode==='numbers',label=i=>numberMode?String(i+1):String.fromCharCode(65+i),total=spec.points.length;
  const numberWords=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
  const spokenLabel=i=>numberMode?numberWords[i]:`Letter ${label(i)}`;
  let count=0,done=false,timer,dragging=false;
  const progress=document.getElementById('progress');progress.textContent=`0 / ${total}`;
  prompt.textContent=`Finish the ${spec.name} picture!`;
  instruction.textContent=`Join ${spec.range} in order. Tap the dots or slide to the next one.`;
  stage.innerHTML=`<div class="picture-dots-game"><div class="picture-dots-heading"><span>✏️ Connect and discover</span><b>${spec.range}</b></div><div class="worksheet-area"><div class="picture-dots-board"><svg viewBox="0 0 600 500" aria-hidden="true"><defs><linearGradient id="gold" x2=".8" y2="1"><stop stop-color="#fff4a2"/><stop offset=".45" stop-color="#ffd44a"/><stop offset="1" stop-color="#ed971c"/></linearGradient></defs><ellipse class="picture-shadow" cx="300" cy="${numberMode?460:410}" rx="180" ry="12" fill="#c5bdcb"/>${spec.art}<path class="picture-joined-line" fill="none" stroke="#34434a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>${spec.points.map(([x,y],i)=>`<button class="picture-dot ${i===0?'is-next':''}" data-dot="${i}" aria-label="Dot ${label(i)}" style="left:${x/6}%;top:${y/5}%"><span class="dot-label">${label(i)}</span><span class="dot-point"></span></button>`).join('')}</div></div><div class="picture-dots-hint" role="status">Start at <b>${label(0)}</b></div></div>`;
  const board=stage.querySelector('.picture-dots-board'),line=stage.querySelector('.picture-joined-line'),hint=stage.querySelector('.picture-dots-hint');
  function choose(b){if(!b)return;const i=Number(b.dataset.dot);if(done||i<count){say(spokenLabel(i));return;}
   if(i!==count){say(`Find ${spokenLabel(count)} next.`);clearTimeout(timer);b.classList.add('try-again');hint.textContent=`Find ${label(count)} next.`;feedback(`Try ${label(count)}. Your picture is still here!`);timer=setTimeout(()=>b.classList.remove('try-again'),500);return;}
   b.classList.remove('is-next');b.classList.add('is-joined');b.setAttribute('aria-label',`Dot ${label(i)}, connected`);count++;line.setAttribute('d',spec.segments.slice(0,count-1).join(' '));tone('good');progress.textContent=`${count} / ${total}`;
   if(count===total){say(spokenLabel(i));done=true;line.setAttribute('d',spec.segments.join(' ')+' '+spec.close);board.classList.add('is-complete');hint.textContent=`You made a ${spec.name}!`;complete(b,`You connected the dots and made a ${spec.name}!`);}
   else{say(numberMode?spokenLabel(i):`${spokenLabel(i)}. Find ${spokenLabel(count)} next.`);stage.querySelector(`[data-dot="${count}"]`).classList.add('is-next');hint.innerHTML=`Next: <b>${label(count)}</b>`;feedback(`${label(i)} joined. Find ${label(count)}!`);}
  }
  const down=e=>{if(e.button!==0)return;const b=e.target.closest('[data-dot]');if(!b)return;dragging=true;choose(b);board.setPointerCapture(e.pointerId);e.preventDefault();};
  const move=e=>{if(!dragging||done)return;const b=stage.querySelector(`[data-dot="${count}"]`),r=b.getBoundingClientRect();if(e.clientX>=r.left-5&&e.clientX<=r.right+5&&e.clientY>=r.top-5&&e.clientY<=r.bottom+5)choose(b);};
  const up=()=>{dragging=false;};
  const click=e=>{if(e.detail===0)choose(e.target.closest('[data-dot]'));};
  board.addEventListener('pointerdown',down);board.addEventListener('pointermove',move);board.addEventListener('pointerup',up);board.addEventListener('pointercancel',up);board.addEventListener('click',click);feedback(`Start with ${label(0)} to draw the missing outline.`);
  return {dispose(){clearTimeout(timer);board.removeEventListener('pointerdown',down);board.removeEventListener('pointermove',move);board.removeEventListener('pointerup',up);board.removeEventListener('pointercancel',up);board.removeEventListener('click',click);}};
 }};
})();
