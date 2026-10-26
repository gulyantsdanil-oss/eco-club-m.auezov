/* Eco Club — Living Nature Hero v3.2 — Cinematic Polish */
(() => {
  'use strict';
  if (window.__ecoHeroV32) return;
  const init = () => {
    const hero = document.querySelector('.ln-hero');
    if (!hero || hero.classList.contains('eco-v32')) return;
    window.__ecoHeroV32 = true;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const style = document.createElement('style');
    style.id = 'eco-hero-v32-style';
    style.textContent = `
      .ln-hero.eco-v32 {position:relative!important; isolation:isolate; overflow:hidden!important;
        background:#082719!important; color:#f4fff2!important; --eco-x:0; --eco-y:0;}
      .ln-hero.eco-v32::before {display:none!important}
      .ln-hero.eco-v32 .eco-v32-bg {position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
      .ln-hero.eco-v32 .eco-v32-photo {position:absolute;inset:-2%;background:#092c1d url('./eco-forest.webp') center 50% /cover no-repeat;
        transform:scale(1.045) translate3d(calc(var(--eco-x)*-7px),calc(var(--eco-y)*-5px),0);
        transition:transform .6s ease;will-change:transform;}
      .ln-hero.eco-v32 .eco-v32-shade {position:absolute;inset:0;background:linear-gradient(90deg,
        rgba(3,23,16,.93) 0%,rgba(4,29,19,.85) 36%,rgba(5,35,24,.47) 67%,rgba(4,24,17,.20) 100%);}
      .ln-hero.eco-v32 .eco-v32-glow {position:absolute;inset:0;background:radial-gradient(ellipse at 81% 29%,rgba(255,233,150,.24),transparent 32%);}
      .ln-hero.eco-v32 .ln-hero-inner {position:relative!important;z-index:2!important;}
      .ln-hero.eco-v32 .ln-hero-copy {position:relative;z-index:4;}
      .ln-hero.eco-v32 h1,.ln-hero.eco-v32 h1 em {color:#f0fff1!important;text-shadow:0 5px 28px rgba(0,0,0,.38)}
      .ln-hero.eco-v32 h1 em {color:#c0ecaa!important}
      .ln-hero.eco-v32 .ln-hero-copy>p {color:#e3eee2!important;text-shadow:0 2px 13px rgba(0,0,0,.3)}
      .ln-hero.eco-v32 .ln-school {color:#c5e7bd!important}
      .ln-hero.eco-v32 .ln-overline {color:#d9f7d5!important;background:rgba(5,43,28,.56)!important;border-color:rgba(199,245,190,.32)!important;backdrop-filter:blur(9px)}
      .ln-hero.eco-v32 .ln-primary {background:#c9f09c!important;color:#113923!important;}
      .ln-hero.eco-v32 .ln-cta:not(.ln-primary) {background:rgba(245,255,246,.12)!important;color:#f2fff0!important;border-color:rgba(229,255,224,.34)!important;backdrop-filter:blur(12px)}
      .ln-hero.eco-v32 .ln-scene {position:relative;z-index:3;}
      .ln-hero.eco-v32 .ln-scene .ln-landscape {filter:drop-shadow(0 18px 42px rgba(0,0,0,.2));}
      .ln-hero.eco-v32 .ln-scene-label {background:rgba(248,255,249,.93)!important;color:#123d27!important}
      /* Controlled framing and bottom transition */
      .ln-hero.eco-v32 .eco-v32-bg::after {content:"";position:absolute;left:0;right:0;bottom:0;height:115px;
        background:linear-gradient(180deg,transparent,rgba(13,49,33,.23) 38%,rgba(242,248,241,.92) 100%);pointer-events:none;}
      .ln-hero.eco-v32 .ln-scene-label {box-shadow:0 15px 45px rgba(0,0,0,.18)!important;backdrop-filter:blur(12px);}
      .ln-hero.eco-v32 .ln-scene-stamp {color:#d6f2d0!important;text-shadow:0 2px 12px rgba(0,0,0,.65);}
      .ln-hero.eco-v32 .ln-hero-copy,.ln-hero.eco-v32 .ln-scene {min-width:0;}
      .ln-hero.eco-v32 .ln-hero-inner {gap:clamp(18px,3vw,48px);}
      .ln-hero.eco-v32 .ln-scene .ln-landscape {max-width:100%;height:auto;}
      .ln-hero.eco-v32 .ln-cta {transition:transform .22s ease, background-color .22s ease,box-shadow .22s ease;}
      .ln-hero.eco-v32 .ln-cta:hover {transform:translateY(-3px);box-shadow:0 12px 28px rgba(0,0,0,.22);}
      @media(max-width:950px){
        .ln-hero.eco-v32 .ln-hero-inner{padding:48px 24px 88px;gap:8px;}
        .ln-hero.eco-v32 .ln-hero-copy {max-width:680px;margin:0 auto;}
        .ln-hero.eco-v32 .ln-scene {min-height:clamp(320px,57vw,490px);}
        .ln-hero.eco-v32 .ln-scene-stamp{left:10%;}
      }
      @media(max-width:620px){
        .ln-hero.eco-v32 .ln-hero-inner {padding:44px 17px 74px;}
        .ln-hero.eco-v32 h1 {font-size:clamp(39px,10.5vw,59px);line-height:1.09;letter-spacing:-.045em;}
        .ln-hero.eco-v32 .ln-scene {min-height:320px;max-width:100%;}
        .ln-hero.eco-v32 .ln-scene .ln-landscape {max-width:min(100%,360px);}
        .ln-hero.eco-v32 .ln-scene-label {right:2%;bottom:4%;padding:10px 12px;border-radius:14px;}
        .ln-hero.eco-v32 .ln-scene-label strong{font-size:13px;}
        .ln-hero.eco-v32 .ln-scene-stamp{left:3%;font-size:16px;top:3%;}
        .ln-hero.eco-v32 .eco-v32-photo {background-position:67% center;}
        .ln-hero.eco-v32 .eco-v32-shade {background:linear-gradient(180deg,rgba(2,22,13,.83),rgba(3,25,16,.66) 54%,rgba(3,25,16,.55));}
      }
      @media(max-width:950px){.ln-hero.eco-v32 .eco-v32-shade{background:linear-gradient(180deg,rgba(3,24,16,.75),rgba(4,27,18,.74) 48%,rgba(4,25,17,.36))}
        .ln-hero.eco-v32 .eco-v32-photo{background-position:64% center}}
      @media(prefers-reduced-motion:reduce){.ln-hero.eco-v32 .eco-v32-photo{transform:none!important;transition:none!important}}
    `;
    document.head.appendChild(style);
    const layer = document.createElement('div');
    layer.className = 'eco-v32-bg';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML = '<div class="eco-v32-photo"></div><div class="eco-v32-shade"></div><div class="eco-v32-glow"></div>';
    hero.insertBefore(layer,hero.firstChild);
    hero.classList.add('eco-v32');
    if (!reduce) {
      let frame=0;
      hero.addEventListener('pointermove', e => {
        if (innerWidth < 950) return;
        if (frame) cancelAnimationFrame(frame);
        frame=requestAnimationFrame(() => {
          const rect=hero.getBoundingClientRect();
          hero.style.setProperty('--eco-x',Math.max(-1,Math.min(1,(e.clientX-rect.left)/rect.width*2-1)).toFixed(2));
          hero.style.setProperty('--eco-y',Math.max(-1,Math.min(1,(e.clientY-rect.top)/rect.height*2-1)).toFixed(2));
          frame=0;
        });
      },{passive:true});
      hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--eco-x','0');hero.style.setProperty('--eco-y','0');});
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
