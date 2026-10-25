/* Living Nature Hero v2 — additive motion layer for Eco Club.
   Preserves original HTML, language switching, emblem, links, and site integrations. */
(() => {
  'use strict';
  if (window.__ecoHeroMotionV2) return;
  const hero = document.querySelector('main .hero, section.hero, .hero');
  if (!hero) return;
  window.__ecoHeroMotionV2 = true;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const style = document.createElement('style');
  style.textContent = `
    /* Effects are layered behind the existing hero content. Original light design is retained. */
    .hero.eco-cinema-v2{position:relative;isolation:isolate;overflow:hidden}
    .hero.eco-cinema-v2 > :not(.eco-cinema-layer){position:relative;z-index:2}
    .hero.eco-cinema-v2 .eco-cinema-layer{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;contain:paint}
    .hero.eco-cinema-v2 .eco-cinema-layer::before{
      content:"";position:absolute;inset:-9%;background:
      radial-gradient(ellipse 36% 43% at 76% 39%,rgba(183,230,147,.25),transparent 78%),
      radial-gradient(ellipse 28% 52% at 12% 75%,rgba(92,156,113,.13),transparent 76%);
      transform:translate3d(calc(var(--eco-mx,0) * 16px),calc(var(--eco-my,0) * 12px),0);
      transition:transform .5s ease;will-change:transform
    }
    .hero.eco-cinema-v2 .eco-cinema-rays{
      position:absolute;inset:-20% -10%;opacity:.48;
      background:conic-gradient(from 207deg at 77% 0%,transparent 0deg,rgba(228,246,175,.16) 8deg,transparent 15deg,transparent 25deg,rgba(186,233,167,.13) 33deg,transparent 42deg);
      mix-blend-mode:multiply;animation:ecoCinemaRay 16s ease-in-out infinite alternate
    }
    .hero.eco-cinema-v2 .eco-cinema-glow{
      position:absolute;width:min(60vw,640px);height:min(60vw,640px);right:6%;top:6%;
      border-radius:50%;background:radial-gradient(circle,rgba(160,224,113,.19),rgba(150,213,146,.07) 48%,transparent 72%);
      filter:blur(22px);animation:ecoCinemaGlow 12s ease-in-out infinite alternate
    }
    .hero.eco-cinema-v2 .eco-cinema-specks{position:absolute;inset:0}
    .hero.eco-cinema-v2 .eco-cinema-speck{position:absolute;width:3px;height:3px;border-radius:50%;background:#7fa86c;opacity:.38;box-shadow:0 0 13px rgba(139,198,100,.32);animation:ecoCinemaSpeck var(--eco-speed) ease-in-out infinite alternate;animation-delay:var(--eco-delay)}
    .hero.eco-cinema-v2 .hero-visual{transform:translate3d(calc(var(--eco-mx,0) * -7px),calc(var(--eco-my,0) * -5px),0);transition:transform .6s ease;will-change:transform}
    .hero.eco-cinema-v2 .logo-ring{box-shadow:0 0 0 16px rgba(178,223,152,.06),0 0 80px rgba(123,180,109,.16),0 22px 58px rgba(26,86,52,.09)}
    .hero.eco-cinema-v2 .hero-content{transform:translate3d(calc(var(--eco-mx,0) * 4px),calc(var(--eco-my,0) * 3px),0);transition:transform .6s ease}
    .hero.eco-cinema-v2 .eco-cinema-entry{animation:ecoCinemaEntry .95s cubic-bezier(.19,.8,.2,1) both}
    .hero.eco-cinema-v2 .eco-cinema-entry:nth-child(2){animation-delay:.09s}
    .hero.eco-cinema-v2 .eco-cinema-entry:nth-child(3){animation-delay:.16s}
    .hero.eco-cinema-v2 .eco-cinema-entry:nth-child(4){animation-delay:.23s}
    @keyframes ecoCinemaEntry{from{opacity:0;translate:0 19px;filter:blur(5px)}to{opacity:1;translate:0 0;filter:blur(0)}}
    @keyframes ecoCinemaRay{from{transform:rotate(-3deg);opacity:.25}to{transform:rotate(4deg);opacity:.55}}
    @keyframes ecoCinemaGlow{from{transform:translate(-1%,0) scale(.97)}to{transform:translate(2%,2%) scale(1.06)}}
    @keyframes ecoCinemaSpeck{from{transform:translateY(9px);opacity:.16}to{transform:translateY(-17px);opacity:.65}}
    @media(max-width:900px){
      .hero.eco-cinema-v2 .hero-visual,.hero.eco-cinema-v2 .hero-content{transform:none!important}
      .hero.eco-cinema-v2 .eco-cinema-rays{opacity:.24}
    }
    @media(prefers-reduced-motion:reduce){
      .hero.eco-cinema-v2 .eco-cinema-rays,.hero.eco-cinema-v2 .eco-cinema-glow,
      .hero.eco-cinema-v2 .eco-cinema-speck,.hero.eco-cinema-v2 .eco-cinema-entry{animation:none!important;filter:none!important}
      .hero.eco-cinema-v2 .hero-visual,.hero.eco-cinema-v2 .hero-content{transform:none!important;transition:none!important}
    }
  `;
  document.head.append(style);
  const layer = document.createElement('div');
  layer.className='eco-cinema-layer';
  layer.setAttribute('aria-hidden','true');
  layer.innerHTML='<div class="eco-cinema-rays"></div><div class="eco-cinema-glow"></div><div class="eco-cinema-specks"></div>';
  hero.insertBefore(layer,hero.firstChild);
  hero.classList.add('eco-cinema-v2');
  const specks=layer.querySelector('.eco-cinema-specks');
  if(!reduced.matches){
    for(let i=0;i<18;i++){
      const dot=document.createElement('i');
      dot.className='eco-cinema-speck';
      dot.style.left=(8+i*41%84)+'%';
      dot.style.top=(10+i*29%73)+'%';
      dot.style.setProperty('--eco-speed',(4+i%6)+'s');
      dot.style.setProperty('--eco-delay',(-i*.32)+'s');
      specks.append(dot);
    }
  }
  const content=hero.querySelector('.hero-content');
  if(content){
    [...content.children].slice(0,5).forEach(el=>el.classList.add('eco-cinema-entry'));
  }
  let raf=0;
  function move(ev){
    if(reduced.matches || window.innerWidth<=900) return;
    if(raf) cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      const box=hero.getBoundingClientRect();
      const x=((ev.clientX-box.left)/box.width-.5)*2;
      const y=((ev.clientY-box.top)/box.height-.5)*2;
      hero.style.setProperty('--eco-mx',String(Math.max(-1,Math.min(1,x))));
      hero.style.setProperty('--eco-my',String(Math.max(-1,Math.min(1,y))));
      raf=0;
    });
  }
  hero.addEventListener('pointermove',move,{passive:true});
  hero.addEventListener('pointerleave',()=>{
    hero.style.setProperty('--eco-mx','0');
    hero.style.setProperty('--eco-my','0');
  });
})();
