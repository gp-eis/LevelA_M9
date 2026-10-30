/* Level A (age 3): short, untimed sports adventures with forgiving input. */
(() => {
 'use strict';
 const names={spotlight:'Picture Hunt',mistakes:'Spot the Mistakes',connecting:'Path Finder',coloring:'Color Studio',abc:'ABC Connect',maze:'Maze Explorer',numbers:'Number Connect',puzzle:'Picture Puzzle',pattern:'Pattern Builder',collect:'Count & Collect',arithmetic:'Add & Take Away'};
 const requested=new URLSearchParams(location.search).get('game');
 const game=Object.hasOwn(names,requested)?requested:'spotlight';
 const category=['spotlight','mistakes','connecting','coloring'].includes(game)?'wonder':game==='abc'?'phonics':'puzzle';
 const $=id=>document.getElementById(id),stage=$('stage'),labels={basketball:'Basketball',soccer:'Soccer ball',racket:'Tennis racket',helmet:'Helmet',sneaker:'Sneaker',bottle:'Water bottle'};
 const img=(id,cls='piece-img')=>`<img class="${cls}" src="assets/sports-${id}.png" alt="" draggable="false">`;
 const item=(id,x,y,extra='',size=18,height=22)=>`<button class="item ${extra}" data-item="${id}" aria-label="${labels[id]}" style="--x:${x}%;--y:${y}%;--size:${size}%;--height:${height}%">${img(id)}</button>`;
 let solved=false,muted=false,dispose=()=>{},timers=[],sounds=[];
 const later=(fn,ms)=>{const t=setTimeout(fn,ms);timers.push(t);return t;};
 const voice=window.Month9GameVoice.create({isMuted:()=>muted,onSpeaking:speaking=>sounds.forEach(clip=>{clip.volume=speaking ? .12 : .55;})});
 const say=(text,options)=>voice.say(text,options);
 voice.connect({prompt:$('prompt'),instruction:$('instruction'),listen:$('listen')});
 const tone=(finish=false)=>{if(muted)return;const audio=new Audio('../adventures/assets/'+(finish?'round-celebration':'correct-bounce')+'.wav');audio.volume=voice.speaking ? .12 : .55;sounds.push(audio);audio.play().catch(()=>{});audio.onended=()=>{sounds=sounds.filter(x=>x!==audio);};};
 const feedback=text=>{$('feedback').textContent=text;};
 const progress=(n,total)=>{$('progress').textContent=`${n} / ${total}`;};
 function sparkle(target=stage){const star=document.createElement('span');star.className='spark';star.textContent='✨';star.setAttribute('aria-hidden','true');target.append(star);later(()=>star.remove(),750);}
 function finish(text){if(solved)return;solved=true;feedback(text);say(text,{queue:true});tone(true);sparkle();$('celebrate').hidden=false;$('celebrate').focus({preventScroll:true});}
 function setup(title,instruction){$('prompt').textContent=title;$('instruction').textContent=instruction;}
 function listenClick(handler){stage.onclick=e=>{if(!solved)handler(e);};}
 function hunt(){
  setup('Help set up sports day!','Tap a little picture to hear its name. Find six things around the court.');
  const ids=['basketball','soccer','racket','helmet','sneaker','bottle'],positions=[[88,79],[58.1,79.3],[83.4,61.8],[13.5,57.4],[31.2,81.1],[23.7,51.1]],sizes=[[16,24],[11,16],[14,33],[16.5,15.5],[13.5,13],[7.5,24]],found=new Set();progress(0,6);
  stage.innerHTML=`<div class="play-layout"><div class="scene contextual-hunt" role="group" aria-label="The GP beaver sets up a winding sports course with a trolley of cones, a tennis net, a goal and a hoop. Find the gear around the benches and track.">${ids.map((id,i)=>item(id,...positions[i],'hunt-hotspot',...sizes[i])).join('')}</div><aside class="side-panel" aria-label="Objects to find"><h3>Find these!</h3>${ids.map(id=>`<div class="check-item" data-check="${id}" data-voice-name="${labels[id]}" role="button" tabindex="0" aria-label="Hear ${labels[id]}">${img(id)}<span>${labels[id]}</span></div>`).join('')}</aside></div>`;
  listenClick(e=>{const b=e.target.closest('[data-item]');if(!b||found.has(b.dataset.item))return;const id=b.dataset.item;found.add(id);b.classList.add('found');b.disabled=true;stage.querySelector(`[data-check="${id}"]`).classList.add('done');tone();say(labels[id],{queue:true});progress(found.size,6);feedback(`${labels[id]} found!`);if(found.size===6)finish('You found all six sports things!');});
 }
 let round=0;
 function baseline(){
  voice.newRound();
  stage.classList.add('baseline-stage');
  const options={stage,say,game,round,mode:game==='numbers'?'numbers':'letters',prompt:$('prompt'),instruction:$('instruction'),tone:type=>{if(type!=='wrong')tone(type==='finish');},feedback,reset:()=>{dispose();$('celebrate').hidden=true;$('progress').textContent='';baseline();},complete:(_,message)=>{if(['pattern','collect','arithmetic'].includes(game)&&round<2){feedback(message);say(message,{queue:true});tone();$('progress').textContent=`${round+1} / 3 rounds`;$('celebrate').hidden=false;$('celebrate').textContent='Next round →';$('celebrate').onclick=()=>{round++;dispose();$('celebrate').hidden=true;baseline();};}else{if(['pattern','collect','arithmetic'].includes(game))$('progress').textContent='3 / 3 rounds';finish(message);$('celebrate').textContent='Great job! ★';$('celebrate').onclick=()=>{voice.stop();window.showActivityReward();const v=document.querySelector('.reward-modal video');if(v)v.muted=muted;};}}};
  const module=['pattern','collect','arithmetic'].includes(game)?window.Month9MathGames:game==='mistakes'?window.Month9Mistakes:game==='connecting'?window.Month9Connecting:game==='maze'?window.Month9Maze:['abc','numbers'].includes(game)?window.Month9Dots:window.Month9Puzzle;
  const mounted=module.mount(options);dispose=()=>mounted.dispose();
 }
 function start(){dispose();dispose=()=>{};timers.forEach(clearTimeout);timers=[];sounds.forEach(a=>a.pause());sounds=[];voice.newRound();solved=false;stage.onclick=null;stage.innerHTML='';stage.classList.remove('baseline-stage');round=0;$('celebrate').textContent='Great job! ★';$('celebrate').hidden=true;$('progress').textContent='';feedback('Take your time. Let’s play!');if(['pattern','collect','arithmetic','connecting','maze','puzzle','abc','numbers','mistakes'].includes(game)){baseline();return;}({spotlight:hunt,coloring:()=>{const mounted=window.Month9Coloring.mount({stage,say,prompt:$('prompt'),instruction:$('instruction'),tone,feedback,complete:(_,message)=>finish(message)});dispose=()=>mounted.dispose();}})[game]();}
 document.body.dataset.category=category;document.body.dataset.game=game;$('title').textContent=names[game];document.title=names[game]+' · Level A · Week 3';$('back').href=category==='phonics'?'../phonics.html?week=3':`../${category}-week-3.html`;
 $('listen').onclick=()=>voice.readInstructions(true);
 $('restart').onclick=start;$('sound').onclick=()=>{muted=!muted;$('sound').textContent=muted?'♪̸':'♫';$('sound').setAttribute('aria-pressed',String(muted));$('sound').setAttribute('aria-label',muted?'Turn sounds on':'Mute sounds');if(muted){voice.stop();sounds.forEach(a=>a.pause());}};
 $('celebrate').onclick=()=>{voice.stop();window.showActivityReward();const video=document.querySelector('.reward-modal video');if(video)video.muted=muted;};
 addEventListener('pagehide',()=>{dispose();timers.forEach(clearTimeout);sounds.forEach(a=>a.pause());voice.stop();});start();
})();
