/* Eco Club — School Campus Hero v4.0. Independent, reversible enhancement. */
(()=>{'use strict';if(window.__ecoCampusHeroV4)return;window.__ecoCampusHeroV4=true;
const start=()=>{
 const hero=document.querySelector('section.ln-hero');if(!hero||hero.classList.contains('eco-school-v4'))return;
 const css=`
 .ln-hero.eco-school-v4{position:relative!important;isolation:isolate;overflow:hidden!important;background:#071c17!important;color:#fff!important;min-height:min(820px,92vh)!important}
 .ln-hero.eco-school-v4:before{display:none!important}
 .ln-hero.eco-school-v4 .eco-v32-bg,.ln-hero.eco-school-v4 .eco-v31-bg{display:none!important}
 .ln-hero.eco-school-v4 .eco-campus-back{position:absolute;inset:0;pointer-events:none;z-index:0;background-image:linear-gradient(90deg,rgba(3,23,18,.97) 0%,rgba(3,24,19,.92) 25%,rgba(6,33,25,.70) 46%,rgba(5,30,24,.24) 76%,rgba(5,27,23,.20) 100%),linear-gradient(0deg,rgba(4,28,20,.57),transparent 35%),url('./eco-school.webp');background-size:cover;background-position:center center;transform:scale(1.03);transition:transform 1.1s ease}
 .ln-hero.eco-school-v4 .eco-campus-vignette{position:absolute;inset:0;z-index:0;pointer-events:none;background:radial-gradient(ellipse at 87% 20%,rgba(250,223,123,.17),transparent 46%)}
 .ln-hero.eco-school-v4 .ln-hero-inner{position:relative!important;z-index:2!important;min-height:690px!important;align-items:center!important;padding-top:80px!important;padding-bottom:120px!important}
 .ln-hero.eco-school-v4 .ln-hero-copy{position:relative!important;z-index:3!important;max-width:680px!important}
 .ln-hero.eco-school-v4 h1{color:#fff!important;text-shadow:0 8px 30px #001a10a0}
 .ln-hero.eco-school-v4 h1 em{color:#c4f3a2!important}
 .ln-hero.eco-school-v4 .ln-hero-copy>p,.ln-hero.eco-school-v4 .ln-school{color:#e2f3e9!important}
 .ln-hero.eco-school-v4 .ln-overline{background:#073b2bbf!important;color:#dffadd!important;border-color:#8fda994b!important}
 .ln-hero.eco-school-v4 .ln-primary{background:#c9f5a5!important;color:#153c28!important}
 .ln-hero.eco-school-v4 .ln-cta:not(.ln-primary){background:#ffffff23!important;color:#fff!important;border:1px solid #ffffff44!important}
 .ln-hero.eco-school-v4 .ln-scene{display:none!important}
 .ln-hero.eco-school-v4 .eco-campus-entry{position:absolute;right:clamp(24px,5vw,94px);bottom:clamp(105px,13%,175px);z-index:4;max-width:328px;text-decoration:none;color:white;padding:22px 24px;border:1px solid #e7ffe177;border-radius:23px;background:linear-gradient(140deg,#0d4a35e8,#08281eca);box-shadow:0 18px 65px #0019109c, inset 0 1px #ffffff38;backdrop-filter:blur(18px);transition:transform .25s,box-shadow .25s}
 .ln-hero.eco-school-v4 .eco-campus-entry:hover,.ln-hero.eco-school-v4 .eco-campus-entry:focus-visible{transform:translateY(-6px);box-shadow:0 25px 70px #001910af;outline:2px solid #c0f8a9;outline-offset:3px}
 .eco-campus-entry .eco-badge{font-size:11px;letter-spacing:.12em;font-weight:800;color:#bcf7a4}.eco-campus-entry strong{display:block;font-size:clamp(24px,2.4vw,31px);line-height:1.3;margin:8px 0}.eco-campus-entry small{display:block;color:#c8e8d5;font-size:14px;line-height:1.5}.eco-campus-entry .eco-visit{display:inline-flex;align-items:center;gap:8px;margin-top:15px;font-size:13px;font-weight:800;color:#c9f6ae}
 .ln-hero.eco-school-v4:after{content:'';position:absolute;bottom:0;left:0;right:0;height:90px;pointer-events:none;background:linear-gradient(transparent,#f0f7efcc);z-index:1}
 @media(max-width:1050px){.ln-hero.eco-school-v4 .ln-hero-inner{min-height:700px!important}.ln-hero.eco-school-v4 .eco-campus-entry{right:24px;bottom:65px;max-width:278px}}
 @media(max-width:760px){.ln-hero.eco-school-v4{min-height:820px!important}.ln-hero.eco-school-v4 .eco-campus-back{background-image:linear-gradient(180deg,#031b15eF 0%,#041b16cc 39%,#031b16a0 100%),url('./eco-school.webp');background-position:center center}.ln-hero.eco-school-v4 .ln-hero-inner{min-height:800px!important;align-items:flex-start!important;padding:75px 20px 320px!important}.ln-hero.eco-school-v4 .ln-hero-copy{max-width:100%!important}.ln-hero.eco-school-v4 h1{font-size:clamp(40px,9.3vw,64px)!important}.ln-hero.eco-school-v4 .eco-campus-entry{bottom:78px;left:20px;right:20px;max-width:none;padding:16px 20px}.eco-campus-entry strong{font-size:24px}}
 @media(prefers-reduced-motion:reduce){.ln-hero.eco-school-v4 .eco-campus-back,.ln-hero.eco-school-v4 .eco-campus-entry{transition:none!important;transform:none!important}}
 `;
 const style=document.createElement('style');style.id='eco-school-v4-style';style.textContent=css;document.head.append(style);
 const bg=document.createElement('div');bg.className='eco-campus-back';bg.setAttribute('aria-hidden','true');hero.prepend(bg);
 const vignette=document.createElement('div');vignette.className='eco-campus-vignette';vignette.setAttribute('aria-hidden','true');hero.append(vignette);
 const entry=document.createElement('a');entry.className='eco-campus-entry';entry.href='./eco-world-campus.html';entry.innerHTML='<span class="eco-badge">✦ INTERACTIVE ECO CAMPUS</span><strong>ECO WORLD <span aria-hidden="true">↗</span></strong><small class="eco-campus-desc">Исследуйте экологические зоны нашей школы</small><span class="eco-visit">Открыть интерактивную карту <span aria-hidden="true">→</span></span>';hero.append(entry);
 const applyLang=()=>{const kk=document.documentElement.lang.toLowerCase().startsWith('kk')||document.querySelector('[data-lang="kk"][aria-pressed="true"], [data-lang="kz"].active, .lang-kk.active');entry.querySelector('.eco-campus-desc').textContent=kk?'Мектебіміздің экологиялық аймақтарын зерттеңіз':'Исследуйте экологические зоны нашей школы';entry.querySelector('.eco-visit').firstChild.textContent=kk?'Интерактивті картаны ашу ':'Открыть интерактивную карту ';entry.href='./eco-world-campus.html?lang='+(kk?'kk':'ru')};
 applyLang();const langObserver=new MutationObserver(applyLang);langObserver.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 hero.classList.add('eco-school-v4');
 // Prevent v3.2 pointer parallax from moving an inactive backdrop; no older scripts are deleted.
};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
