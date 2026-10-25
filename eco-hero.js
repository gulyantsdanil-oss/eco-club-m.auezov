/* Eco Club — Living Nature Hero v3: Cinematic Experience */
(() => {
 'use strict';
 if (window.__ecoHeroCinematicV3) return;
 const hero = document.querySelector('.hero');
 if (!hero) return;
 window.__ecoHeroCinematicV3 = true;
 const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
 const style = document.createElement('style');
 style.id='eco-hero-v3-style';
 style.textContent = `
 /* Opt-in, reversible visual skin. The original HTML/controls remain untouched. */
 .hero.eco-hero-v3{isolation:isolate;position:relative;overflow:hidden;background:#08281c!important;color:#f7fff7!important;--eh-x:0;--eh-y:0}
 .hero.eco-hero-v3 > :not(.eco-v3-environment){position:relative;z-index:2}
 .hero.eco-hero-v3 .eco-v3-environment{position:absolute;inset:0;z-index:0;overflow:hidden;pointer-events:none}
 .hero.eco-hero-v3 .eco-v3-photo{position:absolute;inset:-24px;background:#08281c url('./eco-forest.webp') center center/cover no-repeat;filter:saturate(1.04) contrast(1.035);transform:scale(1.055) translate3d(calc(var(--eh-x)*-8px),calc(var(--eh-y)*-6px),0);transition:transform .65s ease-out;will-change:transform}
 .hero.eco-hero-v3 .eco-v3-overlay{position:absolute;inset:0;background:linear-gradient(90deg,rgba(3,24,16,.91) 0%,rgba(3,28,19,.82) 26%,rgba(5,33,22,.59) 49%,rgba(6,35,25,.24) 76%,rgba(2,24,18,.20) 100%),linear-gradient(0deg,rgba(3,28,20,.68),transparent 38%,rgba(5,32,21,.15) 100%)}
 .hero.eco-hero-v3 .eco-v3-rays{position:absolute;inset:-16%;background:conic-gradient(from 240deg at 90% 2%,transparent 0deg,rgba(255,247,174,.18) 8deg,transparent 14deg,transparent 22deg,rgba(255,242,166,.11) 30deg,transparent 38deg);opacity:.6;animation:ecoV3Rays 18s ease-in-out infinite alternate}
 .hero.eco-hero-v3 .eco-v3-haze{position:absolute;left:0;right:0;bottom:-14%;height:46%;background:radial-gradient(ellipse at 60% 40%,rgba(195,245,187,.12),transparent 65%);filter:blur(22px);animation:ecoV3Haze 13s ease-in-out infinite alternate}
 .hero.eco-hero-v3 .hero-grid{position:relative;z-index:2;min-height:min(820px,calc(100svh - 78px));padding-top:75px;padding-bottom:85px}
 .hero.eco-hero-v3 .hero-content{position:relative;z-index:4;min-width:0;transform:translate3d(calc(var(--eh-x)*5px),calc(var(--eh-y)*3px),0);transition:transform .7s ease-out}
 .hero.eco-hero-v3 .hero h1,.hero.eco-hero-v3 h1{color:#fff!important;text-shadow:0 12px 44px rgba(0,0,0,.4)}
 .hero.eco-hero-v3 h1 span{color:#d7f19b!important}
 .hero.eco-hero-v3 h2,.hero.eco-hero-v3 .school,.hero.eco-hero-v3 .hero-desc,.hero.eco-hero-v3 p{color:#e3efe8!important;text-shadow:0 3px 22px rgba(0,0,0,.26)}
 .hero.eco-hero-v3 .badge{color:#efffdf!important;background:rgba(15,73,49,.50)!important;border:1px solid rgba(226,255,223,.3)!important;backdrop-filter:blur(12px)}
 .hero.eco-hero-v3 .primary{background:#d2f08c!important;color:#103c2a!important;box-shadow:0 12px 38px rgba(6,31,18,.18)}
 .hero.eco-hero-v3 .secondary{color:#f8fff8!important;border-color:rgba(238,255,236,.52)!important;background:rgba(7,46,30,.35)!important;backdrop-filter:blur(12px)}
 .hero.eco-hero-v3 .hero-visual{position:relative;z-index:3;transform:translate3d(calc(var(--eh-x)*-9px),calc(var(--eh-y)*-6px),0);transition:transform .7s ease-out}
 .hero.eco-hero-v3 .logo-ring{background:radial-gradient(circle,rgba(255,255,255,.68),rgba(225,248,220,.29) 61%,rgba(255,255,255,.10) 70%)!important;border-color:rgba(238,255,229,.45)!important;box-shadow:0 0 0 15px rgba(225,255,209,.055),0 0 90px rgba(179,236,147,.25),0 35px 95px rgba(1,18,12,.38)!important;backdrop-filter:blur(3px)}
 .hero.eco-hero-v3 .hero-visual:after{color:rgba(255,255,255,.75)!important;text-shadow:0 3px 18px rgba(0,0,0,.35)}
 .hero.eco-hero-v3 .hero-stat,.hero.eco-hero-v3 .hero-direction{background:rgba(6,48,34,.53)!important;border-color:rgba(216,255,209,.28)!important;color:#e7f8e8!important;backdrop-filter:blur(14px)}
 .hero.eco-hero-v3 .hero-stat span,.hero.eco-hero-v3 .hero-direction span{color:#e0f2e2!important}
 .hero.eco-hero-v3 .hero-stat strong{color:#d2ef90!important}
 .hero.eco-hero-v3 .eco-v3-rise{animation:ecoV3Rise .9s cubic-bezier(.22,.8,.2,1) both}
 @keyframes ecoV3Rise{from{opacity:0;translate:0 20px;filter:blur(5px)}to{opacity:1;translate:0 0;filter:blur(0)}}
 @keyframes ecoV3Rays{from{transform:rotate(-3deg);opacity:.33}to{transform:rotate(4deg);opacity:.68}}
 @keyframes ecoV3Haze{from{transform:translateX(-3%)}to{transform:translateX(4%)}}
 @media(max-width:900px){
   .hero.eco-hero-v3 .hero-grid{min-height:0;padding:45px 0 78px}
   .hero.eco-hero-v3 .eco-v3-photo{background-position:64% center}
   .hero.eco-hero-v3 .eco-v3-overlay{background:linear-gradient(180deg,rgba(3,28,18,.72),rgba(3,27,20,.80) 57%,rgba(3,29,20,.92))}
   .hero.eco-hero-v3 .hero-content,.hero.eco-hero-v3 .hero-visual{transform:none!important}
 }
 @media(max-width:560px){
   .hero.eco-hero-v3 .hero-grid{padding-top:36px;padding-bottom:70px}
   .hero.eco-hero-v3 .hero-visual{min-height:240px}
   .hero.eco-hero-v3 .logo-ring{width:min(260px,75vw)}
 }
 @media(prefers-reduced-motion:reduce){
   .hero.eco-hero-v3 .eco-v3-rays,.hero.eco-hero-v3 .eco-v3-haze,.hero.eco-hero-v3 .eco-v3-rise{animation:none!important}
   .hero.eco-hero-v3 .eco-v3-photo,.hero.eco-hero-v3 .hero-content,.hero.eco-hero-v3 .hero-visual{transform:none!important;transition:none!important}
 }
 `;
 document.head.appendChild(style);
 const stage=document.createElement('div');
 stage.className='eco-v3-environment';stage.setAttribute('aria-hidden','true');
 stage.innerHTML='<div class="eco-v3-photo"></div><div class="eco-v3-overlay"></div><div class="eco-v3-rays"></div><div class="eco-v3-haze"></div>';
 hero.insertBefore(stage,hero.firstChild);
 hero.classList.add('eco-hero-v3');
 if (!reduced.matches){
   const content=hero.querySelector('.hero-content');
   if(content) [...content.children].slice(0,5).forEach((el,i)=>{el.classList.add('eco-v3-rise');el.style.animationDelay=(i*.09)+'s';});
 }
 let frame=0;
 hero.addEventListener('pointermove',(e)=>{
   if (reduced.matches || window.innerWidth < 900) return;
   if(frame) cancelAnimationFrame(frame);
   frame=requestAnimationFrame(()=>{
     const rect=hero.getBoundingClientRect();
     const x=Math.max(-1,Math.min(1,(e.clientX-rect.left)/rect.width*2-1));
     const y=Math.max(-1,Math.min(1,(e.clientY-rect.top)/rect.height*2-1));
     hero.style.setProperty('--eh-x',x.toFixed(3));hero.style.setProperty('--eh-y',y.toFixed(3));frame=0;
   });
 },{passive:true});
 hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--eh-x','0');hero.style.setProperty('--eh-y','0');});
})();
