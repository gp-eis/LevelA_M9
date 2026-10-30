/* A picture-search game with original vector scenery and accessible targets. */
(() => {
  'use strict';
  // Level A is age 3: one scene with six easy-to-recognize targets.
  const targets=['soccer','basketball','racket','shoe','cap','cone'];
  const names={soccer:'Soccer ball',whistle:'Whistle',bottle:'Water bottle',shoe:'Running shoe',basketball:'Basketball',racket:'Tennis racket',medal:'Medal',cap:'Sports cap',jersey:'Team jersey',cone:'Training cone',trophy:'Trophy',rope:'Jump rope'};
  const spots={soccer:[31.3,35],whistle:[79,69],bottle:[58.5,55],shoe:[52.3,75],basketball:[83.5,35],racket:[19.5,67],medal:[92.5,59],cap:[71.5,60],jersey:[82.5,53],cone:[67,84],trophy:[64.5,54],rope:[80,86]};
  const sceneObjects={playground:[10,19],hoop:[91,18],goal:[32,23],net:[7,58]};
  const sceneNames={playground:'Playground',hoop:'Basketball ring',goal:'Soccer goal',net:'Tennis net'};
  const icon={
    soccer:'<circle r="21" fill="#fffdf5" stroke="#536d61" stroke-width="3"/><path d="M0-11 11-3 7 11H-7L-11-3Z" fill="#536d61"/><path d="M0-11 0-20M11-3 20-8M7 11 13 19M-7 11-13 19M-11-3-20-8" stroke="#536d61" stroke-width="3"/>',
    basketball:'<circle r="22" fill="#ebaa59" stroke="#9b6338" stroke-width="3"/><path d="M-22 0H22M0-22V22M-17-14Q1 0-17 14M17-14Q-1 0 17 14" fill="none" stroke="#8c5a3b" stroke-width="2.5"/>',
    bottle:'<rect x="-10" y="-20" width="20" height="35" rx="5" fill="#67b5bd" stroke="#478b94" stroke-width="2"/><rect x="-7" y="-26" width="14" height="7" rx="2" fill="#5a8aaf"/><path d="M-9-2H9" stroke="#d9f4ed" stroke-width="7"/>',
    whistle:'<path d="M-19-5Q-17-17-4-17H14V0H-4Q-8 9-17 7Z" fill="#edc665" stroke="#94734c" stroke-width="3"/><circle cx="-9" cy="-5" r="3" fill="#7d6150"/><path d="M13-10H24" stroke="#94734c" stroke-width="4"/>',
    shoe:'<path d="M-24 3Q-16-8-8-5L3 4 21 5Q26 7 24 16H-24Z" fill="#f09a83" stroke="#a96e68" stroke-width="3"/><path d="M-20 12H23M-2 2 4-3M4 5 10 0" stroke="#fff9e4" stroke-width="3"/>',
    racket:'<ellipse cx="-5" cy="-10" rx="16" ry="22" fill="#e5f4d1" stroke="#8a74a1" stroke-width="5"/><path d="M-18-19H8M-20-10H10M-18-1H8M-12-30V10M-3-31V11M5-28V8M5 9 22 30" stroke="#a894b9" stroke-width="2"/><path d="M18 25 24 31" stroke="#765e83" stroke-width="7"/>',
    medal:'<path d="M-15-28-3-2H4L16-28" fill="none" stroke="#8677bd" stroke-width="9"/><circle cy="8" r="17" fill="#eac562" stroke="#b38c4f" stroke-width="3"/><text y="14" text-anchor="middle" font-size="18" fill="#916d38">★</text>',
    cap:'<path d="M-19 3Q-18-17 0-17Q18-17 19 3Z" fill="#e88e9b" stroke="#a85c6d" stroke-width="3"/><path d="M1 3Q16-2 29 6Q19 12 3 10Z" fill="#e88e9b" stroke="#a85c6d" stroke-width="3"/>',
    jersey:'<path d="M-15-23-27-11-21 1-15-3V24H15V-3L21 1 27-11 15-23 7-16H-7Z" fill="#84acd0" stroke="#648cac" stroke-width="3"/><text y="11" text-anchor="middle" font-size="23" font-weight="bold" fill="white">9</text>',
    cone:'<path d="M-18 18-7-23H7L18 18Z" fill="#e9a65f" stroke="#ad7748" stroke-width="3"/><path d="M-12 3H12M-17 16H17" stroke="#fff4d8" stroke-width="6"/><rect x="-23" y="18" width="46" height="7" rx="2" fill="#ad7748"/>',
    trophy:'<path d="M-14-20H14V1Q14 14 0 14Q-14 14-14 1Z" fill="#e7c25f" stroke="#9f8147" stroke-width="3"/><path d="M-14-15Q-27-17-24-3Q-21 4-11 3M14-15Q27-17 24-3Q21 4 11 3M0 14V24M-13 25H13" fill="none" stroke="#9f8147" stroke-width="4"/>',
    rope:'<path d="M-18-14Q-32 24 0 20Q32 24 18-14" fill="none" stroke="#bb84b4" stroke-width="5"/><path d="M-19-23V-9M19-23V-9" stroke="#6888a5" stroke-width="8" stroke-linecap="round"/>'
  };
  const decorations='<svg class="hunt-land" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true"><defs><pattern id="grass" width="32" height="26" patternUnits="userSpaceOnUse"><path d="M4 20l3-5 2 5M22 8l3-5 2 5" fill="none" stroke="#b6d08b" stroke-width="2"/></pattern></defs><rect width="1000" height="620" fill="#bde5e3"/><path d="M0 158Q250 90 500 145T1000 145V620H0" fill="#83bb84"/><rect y="180" width="1000" height="440" fill="url(#grass)"/><path d="M0 520Q310 390 1000 550" fill="none" stroke="#e5bb83" stroke-width="100"/><path d="M0 520Q310 390 1000 550" fill="none" stroke="#fff0d5" stroke-width="3" stroke-dasharray="18 18"/><rect x="80" y="160" width="265" height="165" rx="24" fill="#76a7af" stroke="#fff8e0" stroke-width="5"/><path d="M215 160V325M80 245H345" stroke="#fff8e0" stroke-width="4"/><circle cx="215" cy="245" r="35" fill="none" stroke="#fff8e0" stroke-width="4"/><rect x="420" y="170" width="345" height="240" rx="23" fill="#8bb4a7" stroke="#fff8e0" stroke-width="6"/><path d="M592 170V410M420 290H765" stroke="#fff8e0" stroke-width="4"/><circle cx="592" cy="290" r="48" fill="none" stroke="#fff8e0" stroke-width="4"/><path d="M790 190h90v125h-90M885 190h90v125h-90" fill="none" stroke="#fff8e0" stroke-width="9"/><path d="M0 170h1000" stroke="#6c9970" stroke-width="22"/><g fill="#fff9ed"><ellipse cx="177" cy="75" rx="95" ry="25"/><ellipse cx="690" cy="60" rx="110" ry="23"/></g><path d="M15 127h970" stroke="#6e9d78" stroke-width="8"/><g fill="#f3ead6" stroke="#8eae8c" stroke-width="4"><rect x="17" y="90" width="105" height="53" rx="8"/><rect x="875" y="91" width="105" height="53" rx="8"/></g><g fill="#d6a178"><circle cx="443" cy="90" r="14"/><circle cx="813" cy="390" r="14"/></g><g stroke="#698984" stroke-width="12" stroke-linecap="round"><path d="M443 108v44m0-27-25 17m25-17 24 17m-24 8-19 29m19-29 20 29M813 408v51m0-25-23 16m23-16 22 16m-22 9-20 28m20-28 19 28"/></g><path d="M10 375h170m630 35h175" stroke="#8da971" stroke-width="10" stroke-linecap="round"/><path d="M55 360v42m55-42v42m745-5v40m65-40v40" stroke="#8da971" stroke-width="10"/></svg>';
  function mount({stage,tone,feedback,prompt,instruction,progress,complete,say=()=>{}}){
    const wanted=targets,found=new Set();let finished=false;
    prompt.textContent=`Find ${wanted.length} sports treasures!`;
    progress(0,wanted.length);
    instruction.textContent='Tap a little picture to hear its name. Then find it in the big picture.';
    stage.innerHTML=`<div class="picture-hunt"><div class="hunt-scene" aria-label="Illustrated sports playground"><div class="hunt-art-frame"><img class="hunt-photo" src="assets/sports-picture-hunt-sample.png" alt="Sports playground filled with gear to find" draggable="false">${Object.keys(sceneObjects).map(id=>`<button type="button" class="hunt-object hunt-large-object" data-find="${id}" style="--x:${sceneObjects[id][0]}%;--y:${sceneObjects[id][1]}%" aria-label="${sceneNames[id]}"></button>`).join('')}${Object.keys(spots).map(id=>`<button type="button" class="hunt-object ${wanted.includes(id)?'is-target':''}" data-find="${id}" style="--x:${spots[id][0]}%;--y:${spots[id][1]}%" aria-label="${names[id]}"><span class="found-ring" aria-hidden="true">✓</span></button>`).join('')}<span class="hunt-wrong-mark" aria-hidden="true">×</span></div></div><aside class="hunt-list" aria-label="Items to find"><h3>Find these <span class="hunt-count">0 / ${wanted.length}</span></h3><ul>${wanted.map(id=>`<li data-list="${id}" data-voice-name="${names[id]}" role="button" tabindex="0" aria-label="Hear ${names[id]}"><span class="list-check" aria-hidden="true">○</span><svg class="list-picture" viewBox="-32 -34 64 68" aria-hidden="true">${icon[id]}</svg><span class="list-name">${names[id]}</span></li>`).join('')}</ul><p>Look all around the picture!</p></aside></div>`;
    const scene=stage.querySelector('.hunt-scene');
    const frame=stage.querySelector('.hunt-art-frame');
    const fit=()=>{const w=scene.clientWidth,h=scene.clientHeight;if(!w||!h)return;const width=Math.min(w,h*(1672/942));frame.style.width=`${width}px`;frame.style.height=`${width*942/1672}px`;};
    const observer=new ResizeObserver(fit);observer.observe(scene);fit();
    const wrongMark=stage.querySelector('.hunt-wrong-mark');
    const response=document.createElement('div');response.className='hunt-response';response.setAttribute('role','status');response.setAttribute('aria-live','polite');scene.append(response);
    let responseTimer;
    const showResponse=(text,kind)=>{clearTimeout(responseTimer);response.textContent=text;response.className=`hunt-response visible ${kind}`;responseTimer=setTimeout(()=>response.classList.remove('visible'),1200);};
    let wrongTimer;
    const clearWrong=()=>{clearTimeout(wrongTimer);wrongMark.classList.remove('show');};
    const onClick=e=>{
      if(finished)return;
      let b=e.target.closest('[data-find]');
      if(!b)return;
      // Nearby items can share touch areas; select the object closest to the tap.
      if(e.type==='pointerdown'){
        const r=frame.getBoundingClientRect();
        const candidates=Array.from(frame.querySelectorAll('[data-find]')).filter(item=>{
          const hit=item.getBoundingClientRect();
          return e.clientX>=hit.left&&e.clientX<=hit.right&&e.clientY>=hit.top&&e.clientY<=hit.bottom;
        });
        b=candidates.reduce((best,item)=>{
          const distance=node=>{const pos=spots[node.dataset.find]||sceneObjects[node.dataset.find];return Math.hypot(e.clientX-r.left-pos[0]*r.width/100,e.clientY-r.top-pos[1]*r.height/100);};
          return distance(item)<distance(best)?item:best;
        },b);
      }
      const id=b.dataset.find;if(found.has(id)){say(names[id],{queue:true});clearWrong();showResponse('✓ Already found!','good');feedback(`${names[id]} is already found. Keep looking!`);return;}
      if(!wanted.includes(id)){
        const r=frame.getBoundingClientRect(),p=b.getBoundingClientRect(),x=p.left+p.width/2,y=p.top+p.height/2;
        wrongMark.style.left=`${Math.max(18,Math.min(r.width-18,x-r.left))}px`;
        wrongMark.style.top=`${Math.max(18,Math.min(r.height-18,y-r.top))}px`;
        clearWrong();void wrongMark.offsetWidth;wrongMark.classList.add('show');
        wrongTimer=setTimeout(()=>wrongMark.classList.remove('show'),800);
        showResponse('× Try another item','try');tone('wrong');say(names[id]||sceneNames[id]);feedback('Match one of the pictures on your list.','try');return;
      }
      clearWrong();found.add(id);b.classList.add('found');b.setAttribute('aria-label',`${names[id]} found`);
      const check=document.createElement('span');check.className='hunt-found-mark';check.textContent='✓';check.setAttribute('aria-hidden','true');check.style.left=`${spots[id][0]}%`;check.style.top=`${spots[id][1]}%`;frame.append(check);
      const row=stage.querySelector(`[data-list="${id}"]`);row.classList.add('crossed');row.querySelector('.list-check').textContent='✓';
      stage.querySelector('.hunt-count').textContent=`${found.size} / ${wanted.length}`;progress(found.size,wanted.length);tone('good');
      showResponse(`✓ Found! ${names[id]}`,'good');
      say(names[id],{queue:true});
      if(found.size===wanted.length){finished=true;complete(b,'You found everything in the picture!');}
      else feedback(`${names[id]} found! ${wanted.length-found.size} more to go.`,'good');
    };
    const onPointer=e=>{if(e.button!==0||!e.isPrimary)return;onClick(e);};
    const onKeyboardClick=e=>{if(e.detail===0)onClick(e);};
    scene.addEventListener('pointerdown',onPointer);
    scene.addEventListener('click',onKeyboardClick);
    feedback('Search the whole sports picture. Tick off every item on your list!');
    return {dispose:()=>{clearWrong();clearTimeout(responseTimer);scene.removeEventListener('pointerdown',onPointer);scene.removeEventListener('click',onKeyboardClick);observer.disconnect();}};
  }
  window.Month9PictureHunt={mount};
})();

