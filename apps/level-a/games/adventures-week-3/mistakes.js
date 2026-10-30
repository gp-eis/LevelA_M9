(() => {
  const items=[
    {id:'toaster',name:'Toaster',x:11.3,y:41.4,w:12,h:14,icon:'🍞',message:'A toaster belongs in the kitchen. It makes toast!'},
    {id:'pillow',name:'Pillow',x:74.6,y:75.6,w:33,h:25,icon:'🛏️',message:'A pillow belongs on a bed. Keep it clean and cozy!'},
    {id:'duck',name:'Bath duck',x:92.6,y:19.5,w:10,h:13,icon:'🦆',message:'A bath duck belongs with bath toys. It is not a sports toy!'}
  ];
  const normal=[['Basketball',71.1,43.3,8.5,11],['Soccer ball',14.5,86,17,24],['Tennis rackets',85,51,14,32],['Helmet',95,65.5,10,15],['Sneakers',94,37.7,10,11],['Football',65,47.3,8,10],['Water bottle',26.3,62.7,3,8],['Exercise mats',93,52,14,14],['Blue towel',9,59.7,12,27],['Jump rope',29,54,10,26],['Training cone',43.5,42,5,10]];
  window.Month9Mistakes={mount({stage,prompt,instruction,tone,feedback,complete,say=()=>{}}){
    const found=new Set();let timer,done=false;
    prompt.textContent='Find 3 things that do not belong.';
    instruction.textContent='The GP Friends are tidying the sports hall. Which three things do not belong with their sports kit?';
    stage.innerHTML=`<div class="picture-hunt"><div class="hunt-scene"><div class="hunt-art-frame"><img class="hunt-photo" src="assets/sports-mistakes-story-v2.webp" alt="The GP owl coils a jump rope while the GP lion puts balls away in a sunlit sports hall. A toaster, pillow and bath duck are mixed into the sports kit." draggable="false">${items.map(i=>`<button class="mistake-target" data-mistake="${i.id}" aria-label="${i.name}" style="left:${i.x}%;top:${i.y}%;width:${i.w}%;height:${i.h}%"></button>`).join('')}${normal.map(([name,x,y,w,h])=>`<button class="mistake-target" data-normal="${name}" aria-label="${name}" style="left:${x}%;top:${y}%;width:${w}%;height:${h}%"></button>`).join('')}<span class="hunt-wrong-mark" aria-hidden="true">×</span></div><div class="hunt-response" role="status"></div></div><aside class="hunt-list mistakes-list"><h3>My discoveries <span class="hunt-count">0 / 3</span></h3><ul>${items.map((_,i)=>`<li data-slot="${i}"><span class="discovery-icon">?</span><span class="list-name">Mystery ${i+1}</span></li>`).join('')}</ul><p>What looks out of place?</p></aside></div>`;
    const scene=stage.querySelector('.hunt-scene'),frame=stage.querySelector('.hunt-art-frame'),response=stage.querySelector('.hunt-response'),wrong=stage.querySelector('.hunt-wrong-mark');
    const fit=()=>{const width=Math.min(scene.clientWidth,scene.clientHeight*3/2);frame.style.width=width+'px';frame.style.height=width*2/3+'px';};
    const observer=new ResizeObserver(fit);observer.observe(scene);fit();
    function respond(text,kind){clearTimeout(timer);response.textContent=text;response.className='hunt-response visible '+kind;timer=setTimeout(()=>{response.classList.remove('visible');wrong.classList.remove('show');},900);}
    function choose(e){if(done)return;const b=e.target.closest('button');if(!b){feedback('Look closely. Tap something that does not belong.');return;}
      if(b.dataset.normal){const r=frame.getBoundingClientRect(),p=b.getBoundingClientRect();wrong.style.left=p.x+p.width/2-r.x+'px';wrong.style.top=p.y+p.height/2-r.y+'px';wrong.classList.add('show');respond('× This belongs here','try');tone('wrong');feedback(`${b.dataset.normal} belongs in the sports hall. Keep looking!`);say(`${b.dataset.normal}. This belongs here. Look for something out of place.`);return;}
      const item=items.find(i=>i.id===b.dataset.mistake);if(!item)return;if(found.has(item.id)){respond('✓ Already discovered!','good');say(item.name+'. You already found this one!');return;}
      wrong.classList.remove('show');const slot=stage.querySelector(`[data-slot="${found.size}"]`);found.add(item.id);slot.classList.add('discovered');slot.querySelector('.discovery-icon').textContent=item.icon;slot.querySelector('.list-name').textContent=item.name;
      const check=document.createElement('span');check.className='hunt-found-mark';check.textContent='✓';check.style.left=item.x+'%';check.style.top=item.y+'%';frame.append(check);b.setAttribute('aria-label',item.name+' found');
      stage.querySelector('.hunt-count').textContent=found.size+' / 3';respond('✓ Mistake found!','good');feedback(item.message,'good');tone('good');say(item.name+'. '+item.message);
      if(found.size===3){done=true;complete(b,'You found all three mistakes! Great spotting.');}
    }
    const pointer=e=>{if(e.button===0&&e.isPrimary)choose(e);},keyboard=e=>{if(e.detail===0)choose(e);};
    scene.addEventListener('pointerdown',pointer);scene.addEventListener('click',keyboard);feedback('Three silly things have sneaked into the sports hall!');
    return {dispose(){clearTimeout(timer);observer.disconnect();scene.removeEventListener('pointerdown',pointer);scene.removeEventListener('click',keyboard);}};
  }};
})();

