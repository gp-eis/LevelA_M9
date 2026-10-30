(() => {
 const tracks=[
  {name:'Basketball',icon:'🏀',color:'#cb653d',x:110,end:490,d:'M110 180 L110 280 Q110 310 150 310 L420 310 Q490 310 490 370 L490 620'},
  {name:'Soccer',icon:'⚽',color:'#5578b3',x:300,end:110,d:'M300 180 L300 235 Q300 260 265 260 L205 260 Q170 260 170 300 L170 405 Q170 440 130 440 Q110 440 110 480 L110 620'},
  {name:'Tennis',icon:'🎾',color:'#68893d',x:490,end:300,d:'M490 180 L490 220 Q490 240 450 240 L390 240 Q350 240 350 280 L350 460 Q350 500 300 500 L250 500 Q215 500 215 540 Q215 570 260 570 Q300 570 300 600 L300 620'}
 ];
 window.Month9Connecting={mount({stage,prompt,instruction,tone,feedback,complete,say=()=>{}}){
  let active=-1,drag=false,done=false,timer,xScale=1;const progress=[0,0,0],found=new Set();
  prompt.textContent='Connect each player to their ball!';instruction.textContent='Choose a player. Follow the winding path with your finger, or tap the glowing dot.';
  stage.innerHTML=`<div class="connect-game"><div class="connect-players" role="group" aria-label="Choose a player">${tracks.map((t,i)=>`<button data-player="${i}" aria-pressed="false" aria-label="${t.name} player"><span aria-hidden="true">${t.icon}</span><b>${t.name}</b><span class="connect-check"></span></button>`).join('')}</div><div class="connect-board"><svg viewBox="0 0 600 800" role="group" aria-label="Three winding sports paths"><image href="assets/connecting-arena.png" width="600" height="800" preserveAspectRatio="none"/><g class="connect-paths" fill="none" stroke-linecap="round" stroke-linejoin="round">${tracks.map((t,i)=>`<path d="${t.d}" stroke="#ac834d" stroke-width="32"/><path class="connect-route" data-route="${i}" d="${t.d}" stroke="#fff3d4" stroke-width="24"/><path class="connect-ink" data-ink="${i}" d="${t.d}" stroke="${t.color}" stroke-width="14" stroke-dasharray="0 9999"/>`).join('')}</g>${tracks.map((t,i)=>`<g class="connect-start" data-start="${i}" role="button" tabindex="0" aria-label="Start ${t.name} path"><path d="M${t.x-25} 110 l-20 20 15 20 10-8 v44 h40 v-44 l10 8 15-20-20-20z" fill="${t.color}" stroke="white" stroke-width="3"/><text x="${t.x}" y="156" text-anchor="middle" font-size="27">${t.icon}</text></g><g data-end="${i}"><circle cx="${t.end}" cy="652" r="29" fill="#fffdf0" stroke="${t.color}" stroke-width="4"/><text x="${t.end}" y="665" text-anchor="middle" font-size="36">${t.icon}</text></g>`).join('')}<circle class="connect-tip" r="17" fill="white" stroke="#8065b2" stroke-width="5" visibility="hidden"/><circle class="connect-next" r="12" fill="#ffe56d" stroke="white" stroke-width="4" visibility="hidden"/></svg></div><div class="connect-footer"><span class="connect-count" aria-live="polite">0 / 3 connected</span><button class="connect-step" disabled>Follow the dot →</button></div></div>`;
  const playArea=stage.querySelector('.connect-board');
  const fitArea=()=>{
    const host=playArea.parentElement,wide=matchMedia('(min-width:751px)').matches,desktop=matchMedia('(min-width:901px)').matches;
    xScale=wide?2:1;const ratio=wide?3/2:3/4;
    // The desktop workstation fits the complete landscape illustration with CSS.
    // Keep the established phone/tablet sizing and input coordinate mapping.
    if(desktop){playArea.style.width='';playArea.style.height='';}
    else{const rail=wide?140:0,foot=wide?62:115;const availableW=host.clientWidth-rail,availableH=host.clientHeight-foot,width=Math.max(0,Math.min(availableW,availableH*ratio));playArea.style.width=width+'px';playArea.style.height=width/ratio+'px';}
    const svg=stage.querySelector('.connect-board svg');svg.setAttribute('viewBox',`0 0 ${600*xScale} 800`);
    const background=svg.querySelector('image');background.setAttribute('href',wide?'assets/connecting-arena-landscape.png':'assets/connecting-arena.png');background.setAttribute('width',600*xScale);
    svg.querySelector('.connect-paths').setAttribute('transform',`scale(${xScale} 1)`);
    tracks.forEach((t,i)=>{svg.querySelector(`[data-start="${i}"]`).setAttribute('transform',`translate(${t.x*(xScale-1)} 0)`);svg.querySelector(`[data-end="${i}"]`).setAttribute('transform',`translate(${t.end*(xScale-1)} 0)`);});
    if(active>=0)paint();
  };
  const sizeObserver=new ResizeObserver(fitArea);sizeObserver.observe(stage);if(stage.parentElement)sizeObserver.observe(stage.parentElement);fitArea();
  const board=stage.querySelector('svg'),tip=stage.querySelector('.connect-tip'),next=stage.querySelector('.connect-next'),step=stage.querySelector('.connect-step');
  const routes=[...stage.querySelectorAll('.connect-route')],lengths=routes.map(p=>p.getTotalLength());
  const announce=(text,kind)=>{feedback(text,kind);say(text);};
  function point(distance){return routes[active].getPointAtLength(distance);}
  function paint(){if(active<0)return;const d=progress[active],p=point(d),q=point(Math.min(lengths[active],d+45));tip.setAttribute('cx',p.x*xScale);tip.setAttribute('cy',p.y);next.setAttribute('cx',q.x*xScale);next.setAttribute('cy',q.y);tip.setAttribute('visibility','visible');next.setAttribute('visibility','visible');stage.querySelector(`[data-ink="${active}"]`).setAttribute('stroke-dasharray',`${d} 9999`);}
  function choose(i){if(done)return;if(found.has(i)){announce('That player already has their ball! Choose another player.');return;}active=i;step.disabled=false;stage.querySelectorAll('[data-player]').forEach((b,j)=>b.setAttribute('aria-pressed',j===i));paint();announce(`${tracks[i].name}. Follow the player to the matching ball.`);}
  function advance(d){if(active<0||done)return;progress[active]=Math.min(lengths[active],d);paint();if(progress[active]>=lengths[active]-1){const i=active;found.add(i);stage.querySelector(`[data-player="${i}"] .connect-check`).textContent='✓';stage.querySelector('.connect-count').textContent=`${found.size} / 3 connected`;tone('good');announce(`${tracks[i].name} connected!${found.size<tracks.length?' Choose another player.':''}`,'good');tip.setAttribute('visibility','hidden');next.setAttribute('visibility','hidden');stage.querySelector(`[data-player="${i}"]`).setAttribute('aria-pressed','false');active=-1;step.disabled=true;if(found.size===3){done=true;complete(board,'All three players have their balls! Great connecting.');}}}
  function follow(e){if(active<0)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform(board.getScreenCTM().inverse());p.x/=xScale;let best=progress[active],distance=25;for(let d=progress[active];d<=Math.min(lengths[active],progress[active]+65);d+=2){const q=point(d),gap=Math.hypot(p.x-q.x,p.y-q.y);if(gap<distance){distance=gap;best=d;}}if(best>progress[active])advance(best>=lengths[active]-3?lengths[active]:best);}
  function down(e){if(e.button!==0)return;const start=e.target.closest('[data-start]');if(start){choose(Number(start.dataset.start));return;}if(active<0){feedback('Choose a player at the top first.');return;}drag=true;board.setPointerCapture(e.pointerId);follow(e);e.preventDefault();}
  const motion=e=>{if(drag)follow(e);},up=()=>drag=false;
  function click(e){const b=e.target.closest('[data-player]');if(b)choose(Number(b.dataset.player));if(e.target.closest('.connect-step')&&active>=0)advance(progress[active]+45);}
  function key(e){const start=e.target.closest('[data-start]');if(start&&(e.key==='Enter'||e.key===' ')){e.preventDefault();choose(Number(start.dataset.start));}}
  stage.addEventListener('click',click);board.addEventListener('pointerdown',down);board.addEventListener('pointermove',motion);board.addEventListener('pointerup',up);board.addEventListener('pointercancel',up);board.addEventListener('keydown',key);feedback('Choose any player to start connecting.');
  return {dispose(){sizeObserver.disconnect();clearTimeout(timer);stage.removeEventListener('click',click);board.removeEventListener('pointerdown',down);board.removeEventListener('pointermove',motion);board.removeEventListener('pointerup',up);board.removeEventListener('pointercancel',up);board.removeEventListener('keydown',key);}};
 }};
})();
