/* Picture-building dot-to-dot: coordinates are part of each illustration, not an overlay on a finished image. */
(() => {
 const kiteCorners=[[300,70],[480,220],[300,355],[120,220]];
 const kitePoints=kiteCorners.flatMap((p,i)=>Array.from({length:3},(_,j)=>[p[0]+(kiteCorners[(i+1)%4][0]-p[0])*j/3,p[1]+(kiteCorners[(i+1)%4][1]-p[1])*j/3]));
 const starPoints=[[300,80],[343,180],[470,180],[375,260],[410,380],[300,310],[190,380],[225,260],[130,180],[257,180]];
 const lines=points=>points.slice(1).map((p,i)=>`M${points[i].join(' ')} L${p.join(' ')}`);
 const pictures={
  letters:{name:'kite',range:'A–L',points:kitePoints,segments:lines(kitePoints),close:'M240 120 L300 70',
   art:`<g class="worksheet-details" stroke="#34434a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><g class="reveal-detail"><path d="M300 70 480 220H300Z" fill="#ffd66d"/><path d="M300 70 120 220H300Z" fill="#f39099"/><path d="M120 220 300 355V220Z" fill="#7fcbbb"/><path d="M480 220 300 355V220Z" fill="#b0a0e9"/></g><path d="M300 355 Q265 380 310 405 T300 464" fill="none"/><path class="kite-bows" d="M290 385 l-18-12v24Z m0 0 18-12v24Z M317 431 l-18-12v24Z m0 0 18-12v24Z" fill="white"/></g>`},
  numbers:{name:'starfish',range:'1–10',points:starPoints,segments:lines(starPoints),close:'M257 180 L300 80',
   art:`<g class="worksheet-details" stroke="#34434a" stroke-width="4" stroke-linecap="round"><path class="star-fill reveal-detail" d="M300 80 343 180 470 180 375 260 410 380 300 310 190 380 225 260 130 180 257 180Z" fill="url(#star-color)" stroke="none"/><g class="reveal-detail" fill="#f7ce8c" stroke="none"><circle cx="300" cy="131" r="7"/><circle cx="413" cy="194" r="7"/><circle cx="388" cy="326" r="7"/><circle cx="217" cy="330" r="7"/><circle cx="184" cy="195" r="7"/></g><ellipse cx="276" cy="222" rx="6" ry="9" fill="#34434a" stroke="none"/><ellipse cx="324" cy="222" rx="6" ry="9" fill="#34434a" stroke="none"/><path d="M284 248 Q300 264 316 248" fill="none"/></g>`}
 };
 window.Month9Dots={mount({stage,prompt,instruction,tone,feedback,complete,mode='letters',say=()=>{}}){
  const spec=pictures[mode==='numbers'?'numbers':'letters'],numberMode=mode==='numbers',label=i=>numberMode?String(i+1):String.fromCharCode(65+i),total=spec.points.length;
  const numberWords=['one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen','twenty'];
  const spokenLabel=i=>numberMode?numberWords[i]:`Letter ${label(i)}`;
  stage.dataset.dotPicture=numberMode?'numbers':'letters';
  document.getElementById('activity-category').textContent=numberMode?'Puzzle Park':'Phonics';
  let count=0,done=false,timer,dragging=false;
  const progress=document.getElementById('star-progress');progress.textContent=`0 / ${total}`;progress.setAttribute("aria-label",`0 of ${total} dots joined`);
  prompt.textContent=`Finish the ${spec.name} picture!`;
  instruction.textContent=`Join ${spec.range} in order. Tap the dots or slide to the next one.`;
  stage.innerHTML=`<div class="picture-dots-game"><div class="picture-dots-heading"><span>✏️ Connect and discover</span><b>${spec.range}</b></div><div class="worksheet-area"><div class="picture-dots-board"><svg viewBox="0 0 600 500" aria-hidden="true"><defs><radialGradient id="star-color"><stop stop-color="#ffd480"/><stop offset="1" stop-color="#ee9258"/></radialGradient><linearGradient id="skin" x2="0.8" y2="1"><stop stop-color="#d1f391"/><stop offset="1" stop-color="#62af65"/></linearGradient><radialGradient id="shell"><stop stop-color="#ffe79b"/><stop offset="1" stop-color="#a4cb64"/></radialGradient><linearGradient id="icing" x2="0.7" y2="1"><stop stop-color="#ffe5f2"/><stop offset="1" stop-color="#f18ab7"/></linearGradient><linearGradient id="wrapper" x2="0.8" y2="1"><stop stop-color="#c9c3ff"/><stop offset="1" stop-color="#8c78c7"/></linearGradient></defs><ellipse class="picture-shadow" cx="300" cy="${numberMode?402:477}" rx="180" ry="12" fill="#c5bdcb"/>${spec.art}<path class="picture-joined-line" fill="none" stroke="#34434a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>${spec.points.map(([x,y],i)=>`<button class="picture-dot ${i===0?'is-next':''}" data-dot="${i}" aria-label="Dot ${label(i)}" style="left:${x/6}%;top:${y/5}%"><span class="dot-label">${label(i)}</span><span class="dot-point"></span></button>`).join('')}</div></div><div class="picture-dots-hint" role="status">Start at <b>${label(0)}</b></div></div>`;
  const board=stage.querySelector('.picture-dots-board'),line=stage.querySelector('.picture-joined-line'),hint=stage.querySelector('.picture-dots-hint');
  function choose(b){if(!b)return;const i=Number(b.dataset.dot);if(done||i<count){say(spokenLabel(i));return;}
   if(i!==count){say(`Find ${spokenLabel(count)} next.`);clearTimeout(timer);b.classList.add('try-again');hint.textContent=`Find ${label(count)} next.`;feedback(`Try ${label(count)}. Your picture is still here!`);timer=setTimeout(()=>b.classList.remove('try-again'),500);return;}
   b.classList.remove('is-next');b.classList.add('is-joined');b.setAttribute('aria-label',`Dot ${label(i)}, connected`);count++;line.setAttribute('d',spec.segments.slice(0,count-1).join(' '));tone('good');progress.textContent=`${count} / ${total}`;progress.setAttribute("aria-label",`${count} of ${total} dots joined`);
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
