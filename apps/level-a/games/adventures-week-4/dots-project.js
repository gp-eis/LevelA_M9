/* Picture-building dot-to-dot: coordinates are part of each illustration, not an overlay on a finished image. */
(() => {
 const pictures={
 letters:{name:'helmet',range:'A–F',points:[[160,280],[170,180],[250,110],[350,110],[430,180],[440,280]],
 segments:['M160 280 Q140 225 170 180','M170 180 Q194 129 250 110','M250 110 Q300 93 350 110','M350 110 Q406 129 430 180','M430 180 Q460 225 440 280'],close:'M440 280 Q300 325 160 280',
 art:`<g class="worksheet-details" stroke="#34434a" stroke-width="5" stroke-linejoin="round"><path class="helmet-strap" d="M195 286 L281 409 Q300 427 319 409 L405 286 L382 291 L305 391 Q300 398 295 391 L218 291Z" fill="white"/><rect x="282" y="388" width="36" height="26" rx="5" fill="#34434a"/><path class="reveal-detail" d="M160 280 Q140 225 170 180 Q194 129 250 110 Q300 93 350 110 Q406 129 430 180 Q460 225 440 280 Q300 325 160 280Z" fill="url(#helmet)" stroke="none"/><path d="M205 250 Q218 205 244 177 Q251 185 248 198 Q228 224 223 255Z M286 258 V165 Q300 147 314 165 V258Z M352 198 Q349 185 356 177 Q382 205 395 250 L377 255 Q372 224 352 198Z" fill="#34434a" stroke-width="2"/><path d="M174 280 Q300 318 426 280" fill="none" stroke-width="3"/></g>`},
 numbers:{name:'sports shirt',range:'1–8',points:[[240,110],[190,145],[215,230],[205,420],[395,420],[385,230],[410,145],[360,110]],
 segments:['M240 110 L190 145','M190 145 Q195 205 215 230','M215 230 L205 420','M205 420 Q300 440 395 420','M395 420 L385 230','M385 230 Q405 205 410 145','M410 145 L360 110'],close:'M360 110 Q345 172 300 172 Q255 172 240 110',
 art:`<g class="worksheet-details" stroke="#34434a" stroke-width="5" stroke-linejoin="round"><path class="reveal-detail" d="M240 110 L190 145 Q195 205 215 230 L205 420 Q300 440 395 420 L385 230 Q405 205 410 145 L360 110 Q345 172 300 172 Q255 172 240 110Z" fill="url(#jersey)" stroke="none"/><path d="M247 117 Q263 184 300 184 Q337 184 353 117 M216 405 Q300 422 384 405" fill="none" stroke="#34434a" stroke-width="4"/><path class="jersey-star" d="M300 248 L316 282 L352 286 L325 311 L332 347 L300 330 L268 347 L275 311 L248 286 L284 282Z" fill="white" stroke-width="3"/></g>`}
 };
 window.Month9Dots={mount({stage,prompt,instruction,tone,feedback,complete,mode='letters',say=()=>{}}){
  const spec=pictures[mode==='numbers'?'numbers':'letters'],numberMode=mode==='numbers',label=i=>numberMode?String(i+1):String.fromCharCode(65+i),total=spec.points.length;
  const numberWords=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
  const spokenLabel=i=>numberMode?numberWords[i]:`Letter ${label(i)}`;
  let count=0,done=false,timer,dragging=false;
  const progress=document.getElementById('progress');progress.textContent=`0 / ${total}`;
  prompt.textContent=`Finish the ${spec.name} picture!`;
  instruction.textContent=`Join ${spec.range} in order. Tap the dots or slide to the next one.`;
  stage.innerHTML=`<div class="picture-dots-game"><div class="picture-dots-heading"><span>✏️ Connect and discover</span><b>${spec.range}</b></div><div class="worksheet-area"><div class="picture-dots-board"><svg viewBox="0 0 600 500" aria-hidden="true"><defs><linearGradient id="helmet" x2=".8" y2="1"><stop stop-color="#d8b7ff"/><stop offset="1" stop-color="#8651c1"/></linearGradient><linearGradient id="jersey" x2=".8" y2="1"><stop stop-color="#84e5f6"/><stop offset="1" stop-color="#2b91c7"/></linearGradient></defs><ellipse class="picture-shadow" cx="300" cy="${numberMode?460:410}" rx="180" ry="12" fill="#c5bdcb"/>${spec.art}<path class="picture-joined-line" fill="none" stroke="#34434a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>${spec.points.map(([x,y],i)=>`<button class="picture-dot ${i===0?'is-next':''}" data-dot="${i}" aria-label="Dot ${label(i)}" style="left:${x/6}%;top:${y/5}%"><span class="dot-label">${label(i)}</span><span class="dot-point"></span></button>`).join('')}</div></div><div class="picture-dots-hint" role="status">Start at <b>${label(0)}</b></div></div>`;
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
