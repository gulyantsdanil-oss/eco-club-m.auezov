/* Eco Club Living Nature Hero v1 — additive visual enhancement.
   This module decorates the existing .hero. It does not replace its contents,
   touch application API calls, or change any original language handlers. */
(()=>{
 'use strict';
 if(window.__ecoHeroV1) return;
 const hero=document.querySelector('main .hero, section.hero, .hero');
 if(!hero) return;
 window.__ecoHeroV1=true;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 const style=document.createElement('style');
 style.textContent=`
  body.eco-hero-enhanced .hero{isolation:isolate;background:#082b21!important;overflow:hidden;min-height:calc(100svh - 78px)}
  body.eco-hero-enhanced .hero .hero-grid{position:relative;z-index:3}
  body.eco-hero-enhanced .hero .hero-grid > *{min-width:0}
  body.eco-hero-enhanced .hero .hero-grid h1{letter-spacing:-.055em;line-height:.9;text-shadow:0 18px 75px rgba(0,0,0,.26)}
  body.eco-hero-enhanced .hero .hero-desc{color:#d9efe3}
  body.eco-hero-enhanced .hero .logo-ring{background:rgba(7,41,30,.28);border:1px solid rgba(195,255,205,.25);box-shadow:0 0 0 24px rgba(217,255,220,.025),0 0 85px 15px rgba(178,234,156,.12),0 40px 110px rgba(0,0,0,.4);backdrop-filter:blur(4px)}
  body.eco-hero-enhanced .hero .logo-ring img{filter:drop-shadow(0 25px 35px rgba(0,0,0,.38))}
  .eco-hero-environment{position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;contain:paint}
  .eco-hero-photo{position:absolute;inset:-4%;background:linear-gradient(90deg,rgba(3,22,16,.94) 0%,rgba(4,34,24,.87) 36%,rgba(4,40,28,.43) 76%,rgba(4,24,18,.55) 100%),linear-gradient(0deg,rgba(2,21,13,.85),transparent 46%),url('./merki-2.jpg.jpeg') center 48%/cover no-repeat;transform:scale(1.04);filter:saturate(1.12) contrast(1.02);animation:ecoHeroBreath 20s ease-in-out infinite alternate}
  .eco-hero-vignette{position:absolute;inset:0;background:radial-gradient(ellipse at 79% 35%,rgba(160,255,160,.16),transparent 34%),linear-gradient(180deg,rgba(0,0,0,.05),transparent 44%,rgba(0,18,9,.55))}
  .eco-hero-rays{position:absolute;inset:-20%;transform-origin:75% 0;background:conic-gradient(from 188deg at 75% 0%,transparent 0 7deg,rgba(232,255,189,.13) 12deg,transparent 21deg,transparent 33deg,rgba(228,255,200,.07) 40deg,transparent 50deg);opacity:.8;mix-blend-mode:screen;animation:ecoHeroRay 14s ease-in-out infinite alternate}
  .eco-hero-orb{position:absolute;left:70%;top:18%;width:29vw;height:29vw;max-width:430px;max-height:430px;border-radius:50%;background:radial-gradient(circle,rgba(207,255,186,.15),rgba(88,180,118,.05) 47%,transparent 70%);filter:blur(12px);animation:ecoHeroFloat 13s ease-in-out infinite alternate}
  .eco-hero-foreground{position:absolute;bottom:-4%;left:-8%;right:-8%;height:22%;background:linear-gradient(0deg,#05261a 8%,rgba(5,35,23,.75) 45%,transparent);filter:blur(9px)}
  .eco-hero-particles{position:absolute;inset:0}
  .eco-hero-particle{position:absolute;border-radius:50%;width:3px;height:3px;background:#dcffbe;box-shadow:0 0 13px rgba(215,255,177,.72);opacity:.47;animation:ecoHeroSpark var(--time) ease-in-out infinite alternate;animation-delay:var(--delay)}
  .eco-hero-lab{position:relative;z-index:4;display:flex;gap:10px;flex-wrap:wrap;margin-top:22px;max-width:700px}
  .eco-hero-lab a{display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:9px 14px;border-radius:13px;background:rgba(13,66,46,.55);border:1px solid rgba(199,250,202,.26);color:#f0fff2;font:750 13px/1.3 inherit;backdrop-filter:blur(12px);box-shadow:0 8px 24px rgba(0,0,0,.13);text-decoration:none;transition:transform .23s ease,background .23s ease,border-color .23s ease}
  .eco-hero-lab a:hover,.eco-hero-lab a:focus-visible{transform:translateY(-3px);background:rgba(19,91,61,.78);border-color:rgba(215,255,215,.62)}
  .eco-hero-lab a:focus-visible{outline:2px solid #d2fa9b;outline-offset:3px}
  .eco-hero-section-note{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#bbf9bd;margin-top:16px;font-weight:900}
  @keyframes ecoHeroBreath{from{transform:scale(1.04) translateY(0)}to{transform:scale(1.11) translateY(-1%)}}
  @keyframes ecoHeroRay{from{transform:rotate(-2deg);opacity:.42}to{transform:rotate(4deg);opacity:.93}}
  @keyframes ecoHeroFloat{from{transform:translate(0,0)}to{transform:translate(-4%,5%)}}
  @keyframes ecoHeroSpark{from{opacity:.15;transform:translateY(15px) scale(.7)}to{opacity:.8;transform:translateY(-20px) scale(1.4)}}
  @media(max-width:780px){body.eco-hero-enhanced .hero .hero-grid{gap:22px;padding-top:54px;padding-bottom:56px}body.eco-hero-enhanced .hero .hero-grid h1{font-size:clamp(55px,15vw,91px);letter-spacing:-.06em}.eco-hero-photo{background-position:center 45%}.eco-hero-lab{gap:8px}.eco-hero-lab a{font-size:12px;padding:8px 11px}.eco-hero-rays{opacity:.4}}
  @media(max-width:480px){.eco-hero-lab{display:grid;grid-template-columns:repeat(2,minmax(0,1fr))}.eco-hero-lab a{justify-content:center}.eco-hero-lab a:last-child{grid-column:1/-1}}
  @media(prefers-reduced-motion:reduce){.eco-hero-photo,.eco-hero-rays,.eco-hero-orb,.eco-hero-particle{animation:none!important}body.eco-hero-enhanced .hero .logo-ring{animation:none!important}.eco-hero-lab a{transition:none!important}}
 `;
 document.head.appendChild(style);
 const env=document.createElement('div');env.className='eco-hero-environment';env.setAttribute('aria-hidden','true');
 env.innerHTML='<div class="eco-hero-photo"></div><div class="eco-hero-vignette"></div><div class="eco-hero-rays"></div><div class="eco-hero-orb"></div><div class="eco-hero-particles"></div><div class="eco-hero-foreground"></div>';
 hero.insertBefore(env,hero.firstChild);
 if(!motion.matches){const holder=env.querySelector('.eco-hero-particles');for(let i=0;i<18;i++){const dot=document.createElement('i');dot.className='eco-hero-particle';dot.style.left=(6+(i*37)%87)+'%';dot.style.top=(9+(i*23)%73)+'%';dot.style.setProperty('--delay',(-i*0.37)+'s');dot.style.setProperty('--time',(4+(i%5))+'s');holder.append(dot)}}
 const grid=hero.querySelector('.hero-grid');
 const info=grid&&grid.firstElementChild;
 if(info){
   const lab=document.createElement('nav');lab.className='eco-hero-lab';lab.setAttribute('aria-label','ECO LAB');
   const links=[['📊','Waste Audit','./waste-audit.html'],['🎮','EcoGames','./eco-games.html'],['♻️','EcoCraft','./eco-craft.html']];
   links.forEach(([icon,title,url])=>{const a=document.createElement('a');a.href=url;a.textContent=icon+' '+title;lab.appendChild(a)});
   info.append(lab);
 }
 document.body.classList.add('eco-hero-enhanced');
})();
