/* Eco Club — Living Nature Hero v3.1, compatible with .ln-hero */
(() => {
  'use strict';
  if (window.__ecoHeroV31) return;
  const init = () => {
    const hero = document.querySelector('.ln-hero');
    if (!hero || hero.classList.contains('eco-v31')) return;
    window.__ecoHeroV31 = true;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const style = document.createElement('style');
    style.id = 'eco-hero-v31-style';
    style.textContent = `
      .ln-hero.eco-v31 {position:relative!important; isolation:isolate; overflow:hidden!important;
        background:#082719!important; color:#f4fff2!important; --eco-x:0; --eco-y:0;}
      .ln-hero.eco-v31::before {display:none!important}
      .ln-hero.eco-v31 .eco-v31-bg {position:absolute;inset:0;z-index:0;pointer-events:none;overflow:hidden;}
      .ln-hero.eco-v31 .eco-v31-photo {position:absolute;inset:-2%;background:#092c1d url('./eco-forest.webp') center 50% /cover no-repeat;
        transform:scale(1.045) translate3d(calc(var(--eco-x)*-7px),calc(var(--eco-y)*-5px),0);
        transition:transform .6s ease;will-change:transform;}
      .ln-hero.eco-v31 .eco-v31-shade {position:absolute;inset:0;background:linear-gradient(90deg,
        rgba(3,23,16,.93) 0%,rgba(4,29,19,.85) 36%,rgba(5,35,24,.47) 67%,rgba(4,24,17,.20) 100%);}
      .ln-hero.eco-v31 .eco-v31-glow {position:absolute;inset:0;background:radial-gradient(ellipse at 81% 29%,rgba(255,233,150,.24),transparent 32%);}
      .ln-hero.eco-v31 .ln-hero-inner {position:relative!important;z-index:2!important;}
      .ln-hero.eco-v31 .ln-hero-copy {position:relative;z-index:4;}
      .ln-hero.eco-v31 h1,.ln-hero.eco-v31 h1 em {color:#f0fff1!important;text-shadow:0 5px 28px rgba(0,0,0,.38)}
      .ln-hero.eco-v31 h1 em {color:#c0ecaa!important}
      .ln-hero.eco-v31 .ln-hero-copy>p {color:#e3eee2!important;text-shadow:0 2px 13px rgba(0,0,0,.3)}
      .ln-hero.eco-v31 .ln-school {color:#c5e7bd!important}
      .ln-hero.eco-v31 .ln-overline {color:#d9f7d5!important;background:rgba(5,43,28,.56)!important;border-color:rgba(199,245,190,.32)!important;backdrop-filter:blur(9px)}
      .ln-hero.eco-v31 .ln-primary {background:#c9f09c!important;color:#113923!important;}
      .ln-hero.eco-v31 .ln-cta:not(.ln-primary) {background:rgba(245,255,246,.12)!important;color:#f2fff0!important;border-color:rgba(229,255,224,.34)!important;backdrop-filter:blur(12px)}
      .ln-hero.eco-v31 .ln-scene {position:relative;z-index:3;}
      .ln-hero.eco-v31 .ln-scene .ln-landscape {filter:drop-shadow(0 18px 42px rgba(0,0,0,.2));}
      .ln-hero.eco-v31 .ln-scene-label {background:rgba(248,255,249,.93)!important;color:#123d27!important}
      @media(max-width:950px){.ln-hero.eco-v31 .eco-v31-shade{background:linear-gradient(180deg,rgba(3,24,16,.75),rgba(4,27,18,.74) 48%,rgba(4,25,17,.36))}
        .ln-hero.eco-v31 .eco-v31-photo{background-position:64% center}}
      @media(prefers-reduced-motion:reduce){.ln-hero.eco-v31 .eco-v31-photo{transform:none!important;transition:none!important}}
    `;
    document.head.appendChild(style);
    const layer = document.createElement('div');
    layer.className = 'eco-v31-bg';
    layer.setAttribute('aria-hidden','true');
    layer.innerHTML = '<div class="eco-v31-photo"></div><div class="eco-v31-shade"></div><div class="eco-v31-glow"></div>';
    hero.insertBefore(layer,hero.firstChild);
    hero.classList.add('eco-v31');
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
