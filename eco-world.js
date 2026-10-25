(function(){
  'use strict';
  if (window.__ECO_WORLD_23_LOADED__) return;
  window.__ECO_WORLD_23_LOADED__ = true;

  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const I18N = {
    ru: {
      badge: 'ECO CLUB / ECO WORLD',
      eyebrow: 'КИНЕМАТОГРАФИЧНАЯ ЭКОСИСТЕМА',
      title: 'Природа начинается с наших действий.',
      subtitle: 'Исследуй. Играй. Создавай. Три пути изменить школьный мир к лучшему.',
      progressTitle: 'Уровень развития природы',
      hints: [
        'Семя пробуждается',
        'Появляются первые ростки',
        'Формируется ствол',
        'Распускаются листья',
        'Экосистема крепнет',
        'Экосистема процветает'
      ],
      note: 'Интерактивная демонстрация — не реальные показатели школы',
      back: 'Вернуться на сайт',
      lang: 'ҚАЗ / РУС',
      open: '🌱 ECO WORLD',
      card1t: 'Исследуй отходы',
      card1d: 'Waste Audit · 9 месяцев наблюдений',
      card2t: 'Проверь свои знания',
      card2d: 'EcoGames · 114 заданий',
      card3t: 'Создавай из вторсырья',
      card3d: 'EcoCraft · творческая мастерская',
      footer1: 'Свет, туман и ветер усиливают ощущение живой природы.',
      footer2: 'Двигай ползунок, чтобы увидеть рост экосистемы.',
      sceneLabel: 'Eco World growing tree'
    },
    kz: {
      badge: 'ECO CLUB / ECO WORLD',
      eyebrow: 'КИНЕМАТОГРАФИЯЛЫҚ ЭКОЖҮЙЕ',
      title: 'Табиғат біздің әрекетімізден басталады.',
      subtitle: 'Зертте. Ойна. Жаса. Мектеп әлемін жақсартудың үш жолы.',
      progressTitle: 'Табиғаттың даму деңгейі',
      hints: [
        'Тұқым оянады',
        'Алғашқы өскіндер пайда болады',
        'Дің қалыптасады',
        'Жапырақтар жайқалады',
        'Экожүйе нығаяды',
        'Экожүйе гүлденеді'
      ],
      note: 'Интерактивті демонстрация — мектептің нақты көрсеткіштері емес',
      back: 'Сайтқа оралу',
      lang: 'ҚАЗ / РУС',
      open: '🌱 ECO WORLD',
      card1t: 'Қалдықтарды зертте',
      card1d: 'Waste Audit · 9 айлық бақылау',
      card2t: 'Біліміңді тексер',
      card2d: 'EcoGames · 114 тапсырма',
      card3t: 'Қайта өңделген заттан жаса',
      card3d: 'EcoCraft · шығармашылық шеберхана',
      footer1: 'Жарық, тұман және жел тірі табиғат әсерін күшейтеді.',
      footer2: 'Экожүйенің өсуін көру үшін жүгірткіні жылжытыңыз.',
      sceneLabel: 'Eco World growing tree'
    }
  };

  let lang = 'ru';
  try {
    const saved = localStorage.getItem('ecoWorldLang');
    if (saved === 'kz' || saved === 'ru') lang = saved;
    else {
      const pageText = document.documentElement.lang || document.body.innerText || '';
      if (/қаз|қазақ|қалдық|экол|жасыл/i.test(pageText)) lang = 'kz';
    }
  } catch (_) {}

  const style = document.createElement('style');
  style.textContent = `
    .ew22-launch{position:fixed;right:18px;bottom:18px;z-index:99992;display:inline-flex;align-items:center;gap:10px;padding:14px 18px;border-radius:999px;border:1px solid rgba(147,255,175,.24);background:linear-gradient(135deg,rgba(6,48,34,.94),rgba(17,84,56,.94));color:#eaffea;font:800 14px/1.1 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;box-shadow:0 18px 48px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.05) inset;cursor:pointer;backdrop-filter:blur(12px);transition:transform .2s ease,box-shadow .2s ease,opacity .2s ease}
    .ew22-launch.ew22-hidden{display:none!important}.ew22-launch:hover{transform:translateY(-2px);box-shadow:0 22px 54px rgba(0,0,0,.36),0 0 0 1px rgba(255,255,255,.08) inset}
    .ew22-root{position:fixed;inset:0;width:100%;height:100dvh;max-width:100%;z-index:99991;display:none;overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain;background:
      radial-gradient(circle at 75% 20%, rgba(138,255,196,.18), transparent 22%),
      radial-gradient(circle at 20% 75%, rgba(63,173,118,.13), transparent 28%),
      linear-gradient(135deg,#06281f 0%, #0b3127 34%, #072118 100%);color:#eef8ef;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;overflow:auto}
    .ew22-root.ew22-open{display:block}
    .ew22-root *{box-sizing:border-box;min-width:0}.ew22-root img,.ew22-root svg{max-width:100%}
    .ew22-shell{max-width:1180px;width:100%;min-width:0;margin:0 auto;padding:28px 20px 34px;position:relative}
    .ew22-atmo,.ew22-atmo:before,.ew22-atmo:after{pointer-events:none;position:absolute;inset:0;content:""}
    .ew22-atmo{background:radial-gradient(circle at 80% 25%,rgba(214,255,214,.12),transparent 22%), radial-gradient(circle at 50% 100%,rgba(73,168,108,.16),transparent 35%)}
    .ew22-atmo:before{background:linear-gradient(120deg,transparent 0 30%, rgba(220,255,220,.07) 38%, transparent 45%, transparent 55%, rgba(220,255,220,.04) 64%, transparent 70%);opacity:.8;animation:ew22rays 18s linear infinite}
    .ew22-atmo:after{background:radial-gradient(circle at 20% 40%, rgba(255,255,255,.06), transparent 6%), radial-gradient(circle at 70% 30%, rgba(255,255,255,.08), transparent 5%), radial-gradient(circle at 60% 70%, rgba(255,255,255,.07), transparent 5%), radial-gradient(circle at 85% 60%, rgba(255,255,255,.07), transparent 4%);filter:blur(1px);animation:ew22twinkle 8s ease-in-out infinite}
    .ew22-top{display:flex;justify-content:space-between;align-items:center;gap:12px;position:relative;z-index:1;margin-bottom:24px}
    .ew22-badge{display:inline-flex;align-items:center;gap:10px;font-weight:900;letter-spacing:.14em;color:#b2ffc2;font-size:16px;text-transform:uppercase}
    .ew22-controls{display:flex;gap:10px;flex-wrap:wrap}
    .ew22-btn{border:1px solid rgba(149,240,176,.25);background:rgba(14,58,42,.72);color:#eef8ef;padding:12px 18px;border-radius:999px;font-weight:700;cursor:pointer;backdrop-filter:blur(12px);box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}
    .ew22-main{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:28px;align-items:start;position:relative;z-index:1}
    .ew22-eyebrow{font-size:12px;font-weight:900;letter-spacing:.28em;color:#b4ffc4;margin:20px 0 14px;text-transform:uppercase}
    .ew22-title{font-size:clamp(42px,7vw,86px);line-height:.96;font-weight:950;letter-spacing:-.05em;margin:0 0 18px;max-width:760px}
    .ew22-subtitle{font-size:clamp(19px,2.1vw,27px);line-height:1.45;color:#d4ebd9;max-width:720px;margin:0 0 28px}
    .ew22-progress{background:linear-gradient(180deg,rgba(9,58,41,.88),rgba(9,48,35,.72));border:1px solid rgba(138,245,170,.18);padding:20px;border-radius:24px;box-shadow:0 26px 70px rgba(0,0,0,.22), inset 0 1px 0 rgba(255,255,255,.03);max-width:560px}
    .ew22-progress h3{margin:0 0 14px;font-size:28px;line-height:1.1}
    .ew22-range{width:100%;accent-color:#a6f0aa;cursor:pointer}
    .ew22-meter{display:flex;justify-content:space-between;align-items:center;margin-top:12px;gap:12px}
    .ew22-hint{font-weight:700;color:#c9f5d2}
    .ew22-percent{font-size:30px;font-weight:900;color:#fff}
    .ew22-note{margin-top:8px;color:#b9d2bd;font-size:14px}
    .ew22-footerline{margin-top:8px;color:#d9efe0;font-size:15px}
    .ew22-sceneWrap{position:relative;background:linear-gradient(180deg,rgba(5,34,25,.92),rgba(7,40,31,.88));border:1px solid rgba(166,237,183,.18);border-radius:30px;padding:18px;box-shadow:0 30px 80px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.04);min-height:490px;overflow:hidden}
    .ew22-sceneGlow{position:absolute;inset:10px;border-radius:26px;background:radial-gradient(circle at 55% 33%, rgba(195,255,190,.34), rgba(91,176,116,.08) 35%, transparent 62%);filter:blur(4px);pointer-events:none}
    .ew22-sceneLabel{position:absolute;left:18px;bottom:16px;padding:8px 12px;border-radius:12px;background:rgba(8,40,28,.7);color:#dff7e4;font-size:12px;border:1px solid rgba(168,240,182,.15);backdrop-filter:blur(8px)}
    .ew22-badgePct{position:absolute;right:18px;bottom:16px;padding:10px 14px;border-radius:16px;background:rgba(12,53,38,.8);display:flex;gap:8px;align-items:center;font-weight:900;font-size:28px;color:#fff;border:1px solid rgba(167,242,181,.2);backdrop-filter:blur(10px)}
    .ew22-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:26px;position:relative;z-index:1}
    .ew22-card{display:block;text-decoration:none;color:#f2fbf3;background:linear-gradient(135deg,rgba(12,64,45,.9),rgba(20,84,56,.62));border:1px solid rgba(145,238,172,.16);padding:22px;border-radius:24px;box-shadow:0 20px 48px rgba(0,0,0,.18);transition:transform .2s ease,border-color .2s ease, box-shadow .2s ease}
    .ew22-card:hover{transform:translateY(-4px);border-color:rgba(181,255,198,.35);box-shadow:0 26px 56px rgba(0,0,0,.22)}
    .ew22-cardIcon{font-size:34px;display:block;margin-bottom:10px}
    .ew22-cardTitle{font-size:18px;font-weight:900;margin-bottom:8px}
    .ew22-cardDesc{font-size:14px;color:#d0ead6}
    .ew22-mist{position:absolute;left:-10%;right:-10%;bottom:6%;height:34%;background:radial-gradient(ellipse at center, rgba(213,255,222,.12), rgba(213,255,222,0) 60%);filter:blur(22px);animation:ew22mist 16s ease-in-out infinite;pointer-events:none}
    .ew22-svg{display:block;width:100%;height:auto;position:relative;z-index:1}
    .ew22-closeHint{margin-top:18px;color:#b8d1be;font-size:13px}
    .ew22-hidden{display:none!important}
    @keyframes ew22rays{0%{transform:translateX(-2%) translateY(0)}50%{transform:translateX(2%) translateY(1%)}100%{transform:translateX(-2%) translateY(0)}}
    @keyframes ew22mist{0%,100%{transform:translateX(-2%)}50%{transform:translateX(3%)}}
    @keyframes ew22twinkle{0%,100%{opacity:.75}50%{opacity:1}}
    @media (max-width: 980px){.ew22-main{grid-template-columns:1fr}.ew22-cards{grid-template-columns:1fr}.ew22-title{max-width:100%}.ew22-progress{max-width:none}}
    @media (max-width: 680px){.ew22-shell{padding:18px 14px 24px}.ew22-badge{font-size:14px;letter-spacing:.1em}.ew22-title{font-size:clamp(34px,12vw,56px)}.ew22-subtitle{font-size:18px}.ew22-progress h3{font-size:24px}.ew22-badgePct{font-size:22px}.ew22-controls{justify-content:flex-end}.ew22-btn{padding:10px 14px}}
  `;
  document.head.appendChild(style);

  const root = document.createElement('div');
  root.className = 'ew22-root';
  root.setAttribute('aria-hidden','true');
  root.innerHTML = `
    <div class="ew22-atmo"></div>
    <div class="ew22-shell">
      <div class="ew22-top">
        <div class="ew22-badge">🌿 <span class="ew22-i18n" data-k="badge"></span></div>
        <div class="ew22-controls">
          <button class="ew22-btn" type="button" data-act="lang"><span class="ew22-i18n" data-k="lang"></span></button>
          <button class="ew22-btn" type="button" data-act="back"><span class="ew22-i18n" data-k="back"></span></button>
        </div>
      </div>
      <div class="ew22-main">
        <div>
          <div class="ew22-eyebrow ew22-i18n" data-k="eyebrow"></div>
          <h1 class="ew22-title ew22-i18n" data-k="title"></h1>
          <p class="ew22-subtitle ew22-i18n" data-k="subtitle"></p>
          <div class="ew22-progress">
            <h3 class="ew22-i18n" data-k="progressTitle"></h3>
            <input class="ew22-range" type="range" min="0" max="100" value="35" aria-label="progress">
            <div class="ew22-meter"><div class="ew22-hint"></div><div class="ew22-percent">35%</div></div>
            <div class="ew22-note ew22-i18n" data-k="note"></div>
            <div class="ew22-footerline ew22-i18n" data-k="footer1"></div>
            <div class="ew22-footerline ew22-i18n" data-k="footer2"></div>
          </div>
          <div class="ew22-closeHint">Esc — close</div>
        </div>
        <div class="ew22-sceneWrap">
          <div class="ew22-sceneGlow"></div>
          <div class="ew22-mist"></div>
          <div class="ew22-scene"></div>
          <div class="ew22-sceneLabel ew22-i18n" data-k="sceneLabel"></div>
          <div class="ew22-badgePct">🌱 <span class="ew22-pctText">35%</span></div>
        </div>
      </div>
      <div class="ew22-cards">
        <a class="ew22-card" href="./waste-audit.html">
          <span class="ew22-cardIcon">📊</span>
          <div class="ew22-cardTitle ew22-i18n" data-k="card1t"></div>
          <div class="ew22-cardDesc ew22-i18n" data-k="card1d"></div>
        </a>
        <a class="ew22-card" href="./eco-games.html">
          <span class="ew22-cardIcon">🎮</span>
          <div class="ew22-cardTitle ew22-i18n" data-k="card2t"></div>
          <div class="ew22-cardDesc ew22-i18n" data-k="card2d"></div>
        </a>
        <a class="ew22-card" href="./eco-craft.html">
          <span class="ew22-cardIcon">♻️</span>
          <div class="ew22-cardTitle ew22-i18n" data-k="card3t"></div>
          <div class="ew22-cardDesc ew22-i18n" data-k="card3d"></div>
        </a>
      </div>
    </div>`;
  document.body.appendChild(root);

  const launch = document.createElement('button');
  launch.type = 'button';
  launch.className = 'ew22-launch';
  launch.textContent = I18N[lang].open;
  document.body.appendChild(launch);

  const els = {
    range: root.querySelector('.ew22-range'),
    hint: root.querySelector('.ew22-hint'),
    percent: root.querySelector('.ew22-percent'),
    pctText: root.querySelector('.ew22-pctText'),
    scene: root.querySelector('.ew22-scene'),
    langBtn: root.querySelector('[data-act="lang"]'),
    backBtn: root.querySelector('[data-act="back"]')
  };

  function applyText(){
    const t = I18N[lang];
    root.querySelectorAll('.ew22-i18n').forEach(el=>{
      const key = el.getAttribute('data-k');
      if (t[key] != null) el.textContent = t[key];
    });
    launch.textContent = t.open;
    updateHint(Number(els.range.value));
    try { localStorage.setItem('ecoWorldLang', lang); } catch(_){}
  }

  function updateHint(v){
    const steps = I18N[lang].hints;
    let idx = 0;
    if (v >= 95) idx = 5;
    else if (v >= 75) idx = 4;
    else if (v >= 55) idx = 3;
    else if (v >= 35) idx = 2;
    else if (v >= 15) idx = 1;
    els.hint.textContent = steps[idx];
  }

  let prevHtmlOverflow="", prevBodyOverflow="";
  function openWorld(){
    prevHtmlOverflow=document.documentElement.style.overflow;
    prevBodyOverflow=document.body.style.overflow;
    launch.classList.add("ew22-hidden");
    root.classList.add('ew22-open');
    root.setAttribute('aria-hidden','false');
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
  }
  function closeWorld(){
    root.classList.remove('ew22-open');
    root.setAttribute('aria-hidden','true');
    document.documentElement.style.overflow=prevHtmlOverflow;
    document.body.style.overflow=prevBodyOverflow;
    launch.classList.remove('ew22-hidden');
  }

  function lerp(a,b,t){ return a + (b-a)*t; }
  function fmt(n){ return Math.round(n); }

  function leaf(cx, cy, rx, ry, rot, fill, opacity){
    return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${rot} ${cx} ${cy})" fill="${fill}" opacity="${opacity}"/>`;
  }

  function flower(x,y,s,color){
    return `<g transform="translate(${x} ${y}) scale(${s})" opacity=".95">
      <circle cx="0" cy="0" r="2.4" fill="#f4f4b4"/>
      <circle cx="0" cy="-5" r="3.4" fill="${color}"/>
      <circle cx="4.4" cy="-1.5" r="3.4" fill="${color}"/>
      <circle cx="2.8" cy="3.4" r="3.4" fill="${color}"/>
      <circle cx="-2.8" cy="3.4" r="3.4" fill="${color}"/>
      <circle cx="-4.4" cy="-1.5" r="3.4" fill="${color}"/>
      <rect x="-0.8" y="0" width="1.6" height="14" fill="#4e9d5f"/>
    </g>`;
  }

  function bird(x,y,s){
    return `<path d="M ${x} ${y} q ${6*s} ${-6*s} ${12*s} 0 q ${6*s} ${-6*s} ${12*s} 0" fill="none" stroke="rgba(215,255,220,.92)" stroke-width="${1.5*s}" stroke-linecap="round"/>`;
  }

  function renderScene(progress){
    const p = progress / 100;
    const trunkH = lerp(40, 160, p);
    const trunkTopY = 300 - trunkH;
    const canopyR = lerp(14, 82, p); // Scene tree scales progressively to 150%
    const canopyY = trunkTopY + 10;
    const branchA = p > .22 ? 1 : 0;
    const branchB = p > .35 ? 1 : 0;
    const branchC = p > .55 ? 1 : 0;
    const grassOpacity = Math.max(.15, p);
    const shrubOpacity = Math.max(0, (p - .35) / .65);
    const flowerOpacity = Math.max(0, (p - .55) / .45);
    const birdOpacity = Math.max(0, (p - .72) / .28);
    const fruitOpacity = Math.max(0, (p - .88) / .12);

    const leaves = [];
    const colors = ['#6ccc79','#81d98d','#61b86e','#9fe3a1','#4da966','#7ed28a','#aef0b2'];
    const centers = [
      [330,canopyY,0],[365,canopyY-15,18],[398,canopyY+3,-12],[350,canopyY-45,7],[390,canopyY-38,-18],[314,canopyY-24,-22],
      [425,canopyY-18,12],[288,canopyY+7,-14],[346,canopyY+18,-7],[389,canopyY+24,20],[332,canopyY-70,10],[370,canopyY-72,-10]
    ];
    const totalLeaves = Math.max(3, Math.round(centers.length * (0.18 + p*0.92)));
    for(let i=0;i<totalLeaves;i++){
      const c = centers[i % centers.length];
      const cx = c[0] + ((i%3)-1)*6;
      const cy = c[1] + ((i%4)-1.5)*4;
      const rx = lerp(6,18,p) * (0.85 + (i%4)*0.08);
      const ry = lerp(10,24,p) * (0.82 + (i%3)*0.1);
      const rot = c[2] + (i*13 % 22) - 11;
      const fill = colors[i % colors.length];
      leaves.push(leaf(cx,cy,rx,ry,rot,fill,0.4 + p*0.5));
    }

    const flowers = [
      flower(175,330,0.9,'#d8ff8c'),
      flower(220,348,0.8,'#ffd77a'),
      flower(270,338,1.0,'#ffe28f'),
      flower(430,342,0.95,'#ffdb94'),
      flower(485,334,0.85,'#cdfa89'),
      flower(545,347,1.05,'#f9ee8e')
    ].join('');

    const shrubs = `
      <g opacity="${shrubOpacity}">
        <ellipse cx="210" cy="330" rx="30" ry="15" fill="#448f57"/>
        <ellipse cx="195" cy="334" rx="22" ry="12" fill="#62ab6d"/>
        <ellipse cx="475" cy="336" rx="36" ry="16" fill="#3c8a4f"/>
        <ellipse cx="497" cy="339" rx="24" ry="11" fill="#5fa16a"/>
      </g>`;

    const fruits = `
      <g opacity="${fruitOpacity}">
        <circle cx="355" cy="122" r="4.8" fill="#f3c85e"/>
        <circle cx="390" cy="142" r="4.6" fill="#ffd769"/>
        <circle cx="326" cy="156" r="4.5" fill="#efcb67"/>
        <circle cx="407" cy="179" r="4.8" fill="#f5c851"/>
        <circle cx="342" cy="187" r="4.2" fill="#ffd76f"/>
      </g>`;

    const rays = !reduceMotion ? `<g opacity=".22">
      <path d="M 420 18 L 288 268" stroke="url(#rayGrad)" stroke-width="18" stroke-linecap="round"/>
      <path d="M 468 12 L 352 256" stroke="url(#rayGrad)" stroke-width="12" stroke-linecap="round" opacity=".75"/>
      <path d="M 530 18 L 430 246" stroke="url(#rayGrad)" stroke-width="9" stroke-linecap="round" opacity=".65"/>
    </g>` : '';

    els.scene.innerHTML = `
      <svg class="ew22-svg" viewBox="0 0 640 420" role="img" aria-label="${I18N[lang].sceneLabel}">
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#082c23"/>
            <stop offset="52%" stop-color="#0d4334"/>
            <stop offset="100%" stop-color="#0a2c23"/>
          </linearGradient>
          <radialGradient id="moonGlow" cx="55%" cy="28%" r="35%">
            <stop offset="0%" stop-color="rgba(221,255,220,.85)"/>
            <stop offset="25%" stop-color="rgba(182,242,186,.32)"/>
            <stop offset="100%" stop-color="rgba(182,242,186,0)"/>
          </radialGradient>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#215642"/>
            <stop offset="50%" stop-color="#2b7558"/>
            <stop offset="100%" stop-color="#1f5b46"/>
          </linearGradient>
          <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#996342"/>
            <stop offset="100%" stop-color="#7b4c31"/>
          </linearGradient>
          <linearGradient id="branchGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#8f5b3d"/>
            <stop offset="100%" stop-color="#70452f"/>
          </linearGradient>
          <linearGradient id="rayGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="rgba(255,255,220,.55)"/>
            <stop offset="100%" stop-color="rgba(255,255,220,0)"/>
          </linearGradient>
          <filter id="softBlur"><feGaussianBlur stdDeviation="6"/></filter>
          <filter id="treeShadow"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="rgba(0,0,0,.24)"/></filter>
        </defs>
        <rect width="640" height="420" fill="url(#skyGrad)"/>
        <circle cx="350" cy="130" r="130" fill="url(#moonGlow)" filter="url(#softBlur)"/>
        ${rays}
        <g opacity=".75">
          <circle cx="95" cy="52" r="2" fill="#ddffe1"/>
          <circle cx="156" cy="74" r="2.2" fill="#d5ffd8"/>
          <circle cx="512" cy="58" r="1.8" fill="#e4ffe5"/>
          <circle cx="552" cy="88" r="2" fill="#dcffe0"/>
          <circle cx="98" cy="124" r="1.6" fill="#dfffe0"/>
          <circle cx="480" cy="118" r="1.7" fill="#deffe0"/>
          <circle cx="578" cy="145" r="1.6" fill="#d9ffde"/>
          <circle cx="530" cy="198" r="2" fill="#d8ffdd"/>
          <circle cx="206" cy="164" r="1.6" fill="#e8ffea"/>
          <circle cx="137" cy="204" r="1.8" fill="#ecffee"/>
          <circle cx="452" cy="214" r="2" fill="#e6ffe8"/>
        </g>
        <g opacity=".55">${birdOpacity ? bird(420,92,1.1) + bird(468,78,.95) + bird(496,106,.8) : ''}</g>
        <path d="M0 334 C120 280, 210 292, 316 328 C412 358, 528 350, 640 312 L640 420 L0 420 Z" fill="#184534"/>
        <path d="M0 345 C110 312, 230 326, 330 350 C420 372, 522 364, 640 334 L640 420 L0 420 Z" fill="url(#groundGrad)"/>
        <g opacity="${grassOpacity}">
          <path d="M84 332 q10 -16 16 0 q-3 -12 8 -18 q-2 14 11 19" fill="none" stroke="#8cd592" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M142 344 q9 -16 15 0 q-1 -12 8 -17 q-2 13 10 18" fill="none" stroke="#7bc683" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M532 344 q10 -16 16 0 q-3 -12 8 -18 q-2 14 11 19" fill="none" stroke="#8dd693" stroke-width="2.2" stroke-linecap="round"/>
          <path d="M580 335 q9 -15 14 0 q-1 -11 7 -16 q-2 12 10 17" fill="none" stroke="#79c482" stroke-width="2.2" stroke-linecap="round"/>
        </g>
        ${shrubs}
        <g transform="translate(322 300) scale(${(1 + 0.50*p).toFixed(3)}) translate(-322 -300)" filter="url(#treeShadow)">
          <rect x="313" y="${300-trunkH}" width="18" height="${trunkH}" rx="9" fill="url(#trunkGrad)"/>
          ${branchA ? `<path d="M322 ${trunkTopY+18} C300 ${trunkTopY+4}, 286 ${trunkTopY-8}, 274 ${trunkTopY-18}" fill="none" stroke="url(#branchGrad)" stroke-width="7" stroke-linecap="round"/>` : ''}
          ${branchB ? `<path d="M322 ${trunkTopY+6} C346 ${trunkTopY-12}, 367 ${trunkTopY-21}, 392 ${trunkTopY-24}" fill="none" stroke="url(#branchGrad)" stroke-width="7" stroke-linecap="round"/>` : ''}
          ${branchC ? `<path d="M322 ${trunkTopY+2} C335 ${trunkTopY-26}, 325 ${trunkTopY-44}, 315 ${trunkTopY-60}" fill="none" stroke="url(#branchGrad)" stroke-width="6" stroke-linecap="round"/>` : ''}
          <g>${leaves.join('')}</g>
          ${fruits}
        </g>
        <g opacity="${flowerOpacity}">${flowers}</g>
      </svg>`;
    els.percent.textContent = progress + '%';
    els.pctText.textContent = progress + '%';
    updateHint(progress);
  }

  function setProgress(v){
    const value = Math.max(0, Math.min(100, Number(v) || 0));
    els.range.value = String(value);
    renderScene(value);
  }

  launch.addEventListener('click', openWorld);
  els.backBtn.addEventListener('click', closeWorld);
  els.langBtn.addEventListener('click', ()=>{ lang = lang === 'ru' ? 'kz' : 'ru'; applyText(); setProgress(els.range.value); });
  root.addEventListener('click', (e)=>{ if (e.target === root) closeWorld(); });
  document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape' && root.classList.contains('ew22-open')) closeWorld(); });
  els.range.addEventListener('input', ()=>setProgress(els.range.value));

  applyText();
  setProgress(35);
})();
