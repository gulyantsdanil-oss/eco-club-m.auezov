/* ECO WORLD 5.0 — responsive EcoImpact dashboard. Public, read-only, bilingual. */
(()=>{'use strict';
const API='https://script.google.com/macros/s/AKfycbz0DrR9pZv-R1L6T1HmhuYAAYJt2OoQgJf851uglXsxPtkGH9K1s_o0kCUB_LNRL9bmdA/exec';
const get=id=>document.getElementById(id);
const ui={panel:get('impact-panel'),heading:get('impact-heading'),stamp:get('impact-stamp'),status:get('impact-status'),metrics:get('impact-metrics'),retry:get('impact-retry'),overlay:get('overlay'),title:get('modal-title')};
if(Object.values(ui).some(x=>!x))return;
if(window.__ecoImpact46)return;window.__ecoImpact46=true;
const I={ru:{heading:'Экологический вклад школы',loading:'Загружаем данные Eco Club…',failed:'Не удалось получить данные. Повторите попытку.',invalid:'Сервер вернул неполные показатели.',prelim:'Данные Eco Club предварительные.',duplicate:'Возможный дубль в записях — требуется проверка.',ok:'Данные Eco Club успешно загружены.',date:'Обновлено',refresh:'Обновить показатели',tabs:['Обзор','Классы','Достижения'],labels:['Участники','Макулатура, кг','Крышки, шт.','Вклады'],goal:'Цель участников',ranking:'Рейтинг классов',rankNote:'Рейтинг по текущим данным · 10 баллов за кг + 0,1 за крышку',noRanks:'Рейтинг пока недоступен.',awards:'Полученные достижения',awardsNote:'Анонимизированные достижения участников',noAwards:'Достижения пока недоступны.',earned:'получений',people:'участников',points:'баллов',empty:'Пока нет данных'},kk:{heading:'Мектептің экологиялық үлесі',loading:'Eco Club деректері жүктелуде…',failed:'Деректер жүктелмеді. Қайталап көріңіз.',invalid:'Сервер толық деректерді қайтармады.',prelim:'Eco Club деректері алдын ала берілген.',duplicate:'Жазбаларда қайталану болуы мүмкін — тексеру қажет.',ok:'Eco Club деректері сәтті жүктелді.',date:'Жаңартылды',refresh:'Көрсеткіштерді жаңарту',tabs:['Шолу','Сыныптар','Жетістіктер'],labels:['Қатысушылар','Макулатура, кг','Қақпақтар, дана','Үлестер'],goal:'Қатысушылар мақсаты',ranking:'Сыныптар рейтингі',rankNote:'Ағымдағы деректер бойынша рейтинг · әр кг үшін 10 балл + әр қақпақ үшін 0,1',noRanks:'Рейтинг әзірге қолжетімсіз.',awards:'Алынған жетістіктер',awardsNote:'Қатысушылардың анонимделген жетістіктері',noAwards:'Жетістіктер әзірге қолжетімсіз.',earned:'алу',people:'қатысушы',points:'ұпай',empty:'Деректер әзірге жоқ'}};
let data=null,version=0,active='overview',lastLang='ru';
const lang=()=>document.documentElement.lang==='kk'?'kk':'ru';
const dict=()=>I[lang()];
const number=(v,precision=0)=>new Intl.NumberFormat(lang()==='kk'?'kk-KZ':'ru-RU',{maximumFractionDigits:precision}).format(v);
const finite=v=>typeof v==='number'&&Number.isFinite(v)&&v>=0;
const elem=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x};
const style=elem('style');style.id='eco-impact-46-css';style.textContent=`
.modal.eco-impact-46-modal{max-width:670px;max-height:calc(100dvh - 36px);padding:22px 24px;overflow:auto;overscroll-behavior:contain}
.eco-impact-46-modal>.symbol,.eco-impact-46-modal>#modal-desc,.eco-impact-46-modal>#modal-topics-title,.eco-impact-46-modal>#modal-topics,.eco-impact-46-modal>#modal-kicker,.eco-impact-46-modal>#modal-go{display:none!important}
.eco-impact-46-modal>#modal-title{font-size:23px;margin:1px 38px 7px 0}
.eco-impact-46-modal .impact-panel{margin-top:6px;padding:14px 15px;background:#082b23ad}
.eco-impact-46-modal .impact-head h4{font-size:15px}
.eco-impact-46-modal .impact-status{margin:7px 0!important;font-size:12px!important}
.eco-impact-46-modal .impact-metrics{grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}
.eco-impact-46-modal .impact-metric{padding:10px 8px}
.eco-impact-46-modal .impact-metric strong{font-size:21px}
.eco-impact-46-modal .impact-metric span{font-size:10px;line-height:1.3}
.eco46-tabs{display:flex;gap:5px;margin:13px 0 10px;padding:4px;background:#ffffff0c;border-radius:12px}
.eco46-tab{flex:1;border:0;border-radius:9px;padding:9px 6px;background:transparent;color:#d0ead5;font-size:12px;font-weight:750;cursor:pointer}
.eco46-tab[aria-selected=true]{background:#c8f5a8;color:#123626}
.eco46-view{min-height:94px}.eco46-view[hidden]{display:none}
.eco46-goal-top{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:#d9f4de;margin-bottom:7px}
.eco46-track,.eco46-rank-track{height:9px;overflow:hidden;border-radius:12px;background:#ffffff21}
.eco46-track>i,.eco46-rank-track>i{display:block;height:100%;border-radius:12px;background:linear-gradient(90deg,#79dca2,#c9ffa4)}
.eco46-list{display:grid;gap:9px;margin-top:7px}.eco46-rank{border:1px solid #b9eeba20;border-radius:11px;padding:8px 10px;background:#ffffff07}.eco46-rank-heading{display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px;gap:12px}.eco46-rank-track{height:6px}
.eco46-small{color:#b5dcc5;font-size:11px;margin:7px 0 0}.eco46-badges{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.eco46-badge{background:#ffffff0a;border:1px solid #a6e4aa27;border-radius:11px;padding:10px}.eco46-badge strong{display:block;font-size:12px}.eco46-badge small{color:#c0e6cb;font-size:11px}.eco46-badge-icon{font-size:23px;margin-right:5px}
.eco-impact-46-modal .impact-retry{margin-top:10px}
@media(max-width:600px){.modal.eco-impact-46-modal{width:min(100%,520px);max-height:calc(100dvh - 20px);padding:14px 13px}.eco-impact-46-modal .impact-panel{padding:10px}.eco-impact-46-modal .impact-metric{padding:8px 5px}.eco-impact-46-modal .impact-metric strong{font-size:18px}.eco-impact-46-modal .impact-metric span{font-size:9px}.eco46-badges{grid-template-columns:1fr 1fr}}
@media(max-width:385px){.eco-impact-46-modal .impact-metrics{grid-template-columns:repeat(2,minmax(0,1fr))}.eco46-badges{grid-template-columns:1fr}}
@media(prefers-reduced-motion:reduce){.eco46-track>i,.eco46-rank-track>i{transition:none!important}}
`;
document.head.append(style);
/* EcoImpact 4.7: progress from verified aggregate data; no personal identification. */
const progressStyle=elem('style');progressStyle.textContent=`
.eco47-progress{display:grid;gap:8px;margin-top:13px}.eco47-reward{padding:9px 10px;border:1px solid #b5e7ad40;border-radius:11px;background:#123f32}.eco47-reward-top{display:flex;justify-content:space-between;gap:8px;font-size:12px}.eco47-meter{height:7px;margin-top:7px;border-radius:9px;background:#ffffff21;overflow:hidden}.eco47-meter i{display:block;height:100%;border-radius:9px;background:linear-gradient(90deg,#82dbaa,#cdfda6)}.eco47-level{font-size:11px;color:#bddbc8;margin:4px 0} .eco47-subhead{font-size:13px;margin:12px 0 5px;color:#ddffda}.eco48-toggle{display:block;width:100%;margin:9px 0 1px;padding:9px 12px;border:1px solid #b8e9a977;border-radius:10px;background:#ffffff08;color:#d9ffd5;font-weight:750;font-size:12px;cursor:pointer}.eco48-toggle:hover{background:#ffffff14}.eco48-toggle:focus-visible{outline:2px solid #c9ffa8;outline-offset:2px}.eco47-reward-top span{color:#cbf0d1;text-align:right}`;document.head.append(progressStyle);
const eco47={ru:{next:'До награды',done:'Получено',school:'Следующие цели школы',class:'Уровни классов',levels:['Начало пути','Эко-старт','Зелёный класс','Экогерои класса','Эколидеры класса'],goals:['25 кг макулатуры','50 кг макулатуры','100 кг макулатуры','100 крышек','500 крышек','1000 крышек','10 вкладов','25 вкладов','50 вкладов'],people:'Уровни участников',unavailable:'Персональный прогресс станет доступен, если сервер предоставит подтверждённое число вкладов по каждому участнику без раскрытия личности.',names:['Новичок','Экоактивист','Экогерой','Эколидер']},kk:{next:'Марапатқа дейін',done:'Алынды',school:'Мектептің келесі мақсаттары',class:'Сынып деңгейлері',levels:['Бастау','Эко-старт','Жасыл сынып','Сынып экобатырлары','Сынып экокөшбасшылары'],goals:['25 кг макулатура','50 кг макулатура','100 кг макулатура','100 қақпақ','500 қақпақ','1000 қақпақ','10 үлес','25 үлес','50 үлес'],people:'Қатысушылар деңгейлері',unavailable:'Сервер әр қатысушының расталған үлес санын жеке басын ашпай ұсынғанда жеке прогресс қолжетімді болады.',names:['Бастаушы','Экоактивист','Экобатыр','Экокөшбасшы']}};
let eco48ShowAll=false;
const eco48Lang={ru:{next:'Осталось',done:'Цель достигнута',show:'Показать все 9 целей',hide:'Скрыть дополнительные цели',units:{paperKg:' кг',capsCount:' шт.',contributionsCount:' вкладов',points:' баллов'}},kk:{next:'Қалды',done:'Мақсат орындалды',show:'Барлық 9 мақсатты көрсету',hide:'Қосымша мақсаттарды жасыру',units:{paperKg:' кг',capsCount:' дана',contributionsCount:' үлес',points:' ұпай'}}};
function eco47Render(){const t=eco47[lang()],i18n=eco48Lang[lang()];if(!data)return;const group=elem('div','eco47-progress');function reward(title,now,target,unit='',precision=0){if(!finite(now))return;const box=elem('div','eco47-reward'),top=elem('div','eco47-reward-top');top.append(elem('strong','',title),elem('span','',now>=target?i18n.done:i18n.next+': '+number(Math.max(0,target-now),precision)+unit));const meter=elem('div','eco47-meter'),bar=elem('i');bar.style.width=Math.min(100,now/target*100)+'%';meter.append(bar);box.append(top,meter);group.append(box)}
if(active==='overview'){view.append(elem('h4','eco47-subhead',t.school));
const goals=[['paperKg',25],['paperKg',50],['paperKg',100],['capsCount',100],['capsCount',500],['capsCount',1000],['contributionsCount',10],['contributionsCount',25],['contributionsCount',50]];
const shown=eco48ShowAll?goals: [goals.slice(0,3),goals.slice(3,6),goals.slice(6,9)].map(section=>section.find(([key,target])=>finite(data[key])&&data[key]<target)||section.findLast(([key])=>finite(data[key]))).filter(Boolean);
shown.forEach(([key,target])=>{const i=goals.findIndex(([k,v])=>k===key&&v===target);reward(t.goals[i],data[key],target,i18n.units[key],key==='paperKg'?1:0);});
}
if(active==='awards'){view.append(elem('h4','eco47-subhead',t.people));const people=Array.isArray(data.awards?.participants)?data.awards.participants:[];let n=0;people.forEach((p,i)=>{const count=p?.confirmedContributionsCount??p?.contributionsCount;if(!finite(count))return;n++;let level=-1;[1,3,10,25].forEach((v,j)=>{if(count>=v)level=j});const target=[1,3,10,25][level+1];if(target)reward((lang()==='kk'?'Қатысушы ':'Участник ')+(i+1)+' · '+(level<0?'—':t.names[level]),count,target);else group.append(elem('div','eco47-level','🏆 '+(lang()==='kk'?'Қатысушы ':'Участник ')+(i+1)+' · '+t.names[3]));});if(!n)group.append(elem('p','eco47-level',t.unavailable));}
if(group.children.length)view.append(group);
if(active==='overview'){const toggle=elem('button','eco48-toggle',eco48ShowAll?i18n.hide:i18n.show);toggle.type='button';toggle.setAttribute('aria-expanded',String(eco48ShowAll));toggle.onclick=()=>{eco48ShowAll=!eco48ShowAll;render();};view.append(toggle);}
}

const eco50Style=elem('style');eco50Style.id='eco-impact-50-css';eco50Style.textContent="\n/* EcoImpact 5.0 — responsive panel, podium and interactive award cards */\n.modal.eco-impact-46-modal{max-width:720px;width:min(100%,720px);scrollbar-gutter:stable;overflow-x:hidden;box-shadow:0 28px 90px #000b}\n.modal.eco-impact-46-modal>.close{position:sticky;float:right;top:9px;right:auto;z-index:8;width:42px;height:42px;margin:-3px 0 -40px 0;border:1px solid #bbefb854;background:#244f40;backdrop-filter:blur(6px)}\n.eco-impact-46-modal>#modal-title{padding-right:46px;min-height:35px}\n.eco-impact-46-modal .impact-panel{border-radius:17px}\n.eco-impact-46-modal .impact-metric{background:linear-gradient(145deg,#1a533d,#113f31);border-color:#ceffbd26}\n.eco-impact-46-modal .impact-metric strong{color:#c9f9a9}\n.eco-impact-46-modal .impact-status{overflow-wrap:anywhere}\n.eco46-tabs{position:sticky;top:0;z-index:4;backdrop-filter:blur(10px);background:#113a2fed;border:1px solid #ffffff12}\n.eco46-tab{min-height:44px;touch-action:manipulation;transition:background .16s}\n.eco46-tab:focus-visible,.eco50-badge:focus-visible{outline:2px solid #d5ffb8;outline-offset:2px}\n.eco46-rank{padding:12px;transition:border-color .2s;min-width:0}\n.eco46-rank.eco50-top{background:linear-gradient(125deg,#205642,#103a2e);border-color:#c4f0ad55}\n.eco46-rank-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:4px}\n.eco50-rank-name{display:flex;align-items:center;gap:10px;min-width:0;flex:1}\n.eco50-rank-name strong{font-size:14px;overflow-wrap:anywhere}\n.eco50-medal{width:35px;height:35px;border-radius:12px;background:#ffffff14;display:grid;place-items:center;flex:none;font-size:20px}\n.eco50-score{font-size:13px;font-weight:800;color:#d1ffad;font-variant-numeric:tabular-nums;white-space:nowrap}\n.eco50-level{font-size:11px;color:#cee5d2;margin:4px 0 9px 45px}\n.eco46-rank-track{height:8px}\n.eco50-award-grid{gap:10px}\n.eco50-badge{border-radius:15px;overflow:hidden;background:linear-gradient(145deg,#1b4b3b,#12382c);border:1px solid #a6e4aa48}\n.eco50-badge[open]{border-color:#bef4a0;box-shadow:0 0 18px #b5f9a01c}\n.eco50-badge summary{cursor:pointer;display:flex;gap:10px;align-items:center;padding:13px;list-style:none;min-height:72px}\n.eco50-badge summary::-webkit-details-marker{display:none}\n.eco50-badge .eco50-emoji{height:43px;width:43px;display:grid;place-items:center;border-radius:14px;background:#c8f6aa1b;flex:none;font-size:25px}\n.eco50-badge .eco50-badge-copy{min-width:0;flex:1}\n.eco50-badge strong{display:block;font-size:13px;line-height:1.4;overflow-wrap:anywhere}\n.eco50-badge small{display:block;color:#b8dcc4;font-size:11px;margin-top:4px}\n.eco50-arrow{color:#caffaf;flex:none;font-size:14px;transition:transform .2s}\n.eco50-badge[open] .eco50-arrow{transform:rotate(180deg)}\n.eco50-badge p{border-top:1px solid #ffffff20;margin:0;padding:11px 13px;font-size:12px;color:#d2e8d5;line-height:1.5}\n.eco48-toggle{min-height:44px;touch-action:manipulation}\n.eco47-reward-top{align-items:baseline}\n.eco47-reward-top strong{min-width:0;overflow-wrap:anywhere}\n.eco47-reward-top span{flex:none;font-variant-numeric:tabular-nums}\n@media(max-width:600px){\n .overlay:has(.eco-impact-46-modal){padding:8px}\n .modal.eco-impact-46-modal{width:100%;max-height:calc(100dvh - 16px);padding:13px 12px 17px;border-radius:19px;scrollbar-gutter:auto}\n .modal.eco-impact-46-modal>.close{height:44px;width:44px;top:4px}\n .eco-impact-46-modal>#modal-title{font-size:22px;margin:4px 44px 9px 0;padding-right:0}\n .eco-impact-46-modal .impact-panel{padding:12px 10px}\n .eco-impact-46-modal .impact-head{display:flex;flex-direction:column;gap:3px}\n .eco-impact-46-modal .impact-head h4{font-size:14px}\n .eco-impact-46-modal .impact-stamp{font-size:10px}\n .eco-impact-46-modal .impact-metrics{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}\n .eco-impact-46-modal .impact-metric{min-height:75px;padding:12px}\n .eco-impact-46-modal .impact-metric strong{font-size:25px}\n .eco-impact-46-modal .impact-metric span{font-size:11px}\n .eco46-tab{font-size:12px;padding:10px 3px;min-width:0}\n .eco46-badges.eco50-award-grid{grid-template-columns:1fr}\n .eco47-reward-top{flex-wrap:wrap;gap:3px}\n .eco47-reward-top span{font-size:11px}\n .eco46-rank{padding:10px}\n .eco50-score{font-size:12px}\n}\n@media(max-width:360px){\n .eco-impact-46-modal .impact-metric{padding:9px}\n .eco-impact-46-modal .impact-metric strong{font-size:21px}\n .eco50-rank-name{gap:5px}\n .eco50-level{margin-left:40px}\n .eco50-medal{width:32px;height:32px}\n}\n@media(prefers-reduced-motion:reduce){.eco50-arrow,.eco46-tab{transition:none}}\n";document.head.append(eco50Style);
const eco50Text={ru:{awarded:'Отмечено у участников Eco Club. Имена не публикуются.',medals:['🥇','🥈','🥉'],level:'Уровень класса'},kk:{awarded:'Eco Club қатысушыларына берілген. Есімдер жарияланбайды.',medals:['🥇','🥈','🥉'],level:'Сынып деңгейі'}};
const tabs=elem('div','eco46-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','EcoImpact');
const view=elem('section','eco46-view');view.id='eco46-view';view.setAttribute('aria-live','polite');
const tabNames=['overview','classes','awards'];
for(let i=0;i<tabNames.length;i++) {const b=elem('button','eco46-tab');b.type='button';b.dataset.tab=tabNames[i];b.setAttribute('role','tab');b.setAttribute('aria-controls',view.id);b.onclick=()=>{active=tabNames[i];render();if(modal)modal.scrollTop=0;};tabs.append(b);}
tabs.addEventListener('keydown',e=>{if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;e.preventDefault();const i=tabNames.indexOf(active),next=(i+(e.key==='ArrowRight'?1:-1)+tabNames.length)%tabNames.length;tabs.children[next].click();tabs.children[next].focus();});view.setAttribute('role','tabpanel');ui.metrics.after(tabs,view);const modal=ui.panel.closest('.modal');
function render(){
 const t=dict(),extra=eco50Text[lang()];
 ui.heading.textContent=t.heading;
 ui.retry.textContent=t.refresh;
 [...tabs.children].forEach((b,i)=>{b.textContent=t.tabs[i];const on=active===tabNames[i];b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});
 ui.metrics.replaceChildren();view.replaceChildren();if(!data){tabs.hidden=true;view.hidden=true;return;}
 tabs.hidden=false;view.hidden=false;
 const values=[data.count,data.paperKg,data.capsCount,data.contributionsCount];
 values.forEach((v,i)=>{if(!finite(v))return;const tile=elem('div','impact-metric');tile.append(elem('strong','',number(v,i===1?1:0)),elem('span','',t.labels[i]));ui.metrics.append(tile)});
 ui.status.textContent=(data.duplicateSuspected===true||data.quality?.duplicateSuspected===true||data.quality?.possibleDuplicate===true)?t.duplicate:(data.preliminary===true||data.quality?.preliminary===true)?t.prelim:t.ok;
 ui.stamp.textContent='';
 if(data.updatedAt){const date=new Date(data.updatedAt);ui.stamp.textContent=t.date+': '+(Number.isNaN(date.getTime())?String(data.updatedAt).slice(0,10):new Intl.DateTimeFormat(lang()==='kk'?'kk-KZ':'ru-RU',{dateStyle:'medium',timeStyle:'short'}).format(date));}
 if(active==='overview'){
  const goal=finite(data.goal)&&data.goal>0?data.goal:null,total=finite(data.count)?data.count:0;
  if(goal){const hdr=elem('div','eco46-goal-top');hdr.append(elem('span','',t.goal),elem('strong','',number(total)+' / '+number(goal)+' · '+number(Math.min(100,total/goal*100))+'%'));const tr=elem('div','eco46-track');tr.setAttribute('role','progressbar');tr.setAttribute('aria-label',t.goal);tr.setAttribute('aria-valuemin','0');tr.setAttribute('aria-valuemax',String(goal));tr.setAttribute('aria-valuenow',String(Math.min(total,goal)));const fill=elem('i');fill.style.width=Math.min(100,total/goal*100)+'%';tr.append(fill);view.append(hdr,tr);}
  else view.append(elem('p','eco46-small',t.empty));
 }else if(active==='classes'){
  view.append(elem('strong','',t.ranking));
  const ranks=Array.isArray(data.rankings?.classes)?data.rankings.classes.filter(r=>r&&typeof r.className==='string'&&finite(r.points)).slice().sort((a,b)=>b.points-a.points).slice(0,20):[];
  if(!ranks.length)view.append(elem('p','eco46-small',t.noRanks));
  else{const max=Math.max(1,...ranks.map(r=>r.points)),list=elem('div','eco46-list');const thresholds=[0,10,50,150,300],levelNames=eco47[lang()].levels;
   ranks.forEach((r,i)=>{let level=0;thresholds.forEach((value,j)=>{if(r.points>=value)level=j;});
    const card=elem('article','eco46-rank'+(i<3?' eco50-top':'')),header=elem('div','eco46-rank-heading'),name=elem('div','eco50-rank-name'),medal=elem('span','eco50-medal',i<3?extra.medals[i]:String(i+1));
    medal.setAttribute('aria-label',String(i+1));name.append(medal,elem('strong','',r.className.slice(0,32)));
    header.append(name,elem('span','eco50-score',number(r.points,1)+' '+t.points));card.append(header,elem('div','eco50-level',extra.level+': '+levelNames[level]));
    const track=elem('div','eco46-rank-track'),bar=elem('i');bar.style.width=Math.min(100,100*r.points/max)+'%';
    track.setAttribute('role','progressbar');track.setAttribute('aria-label',r.className);track.setAttribute('aria-valuemin','0');track.setAttribute('aria-valuemax',String(max));track.setAttribute('aria-valuenow',String(r.points));track.append(bar);card.append(track);list.append(card);
   });view.append(list);
  }
  view.append(elem('p','eco46-small',t.rankNote));
 }else if(active==='awards'){
  view.append(elem('strong','',t.awards));
  const persons=Array.isArray(data.awards?.participants)?data.awards.participants:[],all=Array.isArray(data.awards?.badges)?data.awards.badges:[];
  const badges=all.filter(b=>b&&typeof b.id==='string').map(b=>({...b,total:persons.filter(p=>Array.isArray(p?.badges)&&p.badges.includes(b.id)).length})).filter(b=>b.total>0).sort((a,b)=>b.total-a.total);
  if(!badges.length)view.append(elem('p','eco46-small',t.noAwards));
  else{const wrap=elem('div','eco46-badges eco50-award-grid');
   for(const b of badges){const tile=elem('details','eco50-badge'),sum=elem('summary'),copy=elem('span','eco50-badge-copy'),label=typeof b[lang()]==='string'?b[lang()]:b.id;
    copy.append(elem('strong','',label),elem('small','',number(b.total)+' '+t.earned));
    sum.append(elem('span','eco50-emoji',typeof b.icon==='string'?b.icon:'🏅'),copy,elem('span','eco50-arrow','⌄'));
    tile.append(sum,elem('p','',extra.awarded));wrap.append(tile);
   }
   view.append(wrap);
  }
  view.append(elem('p','eco46-small',t.awardsNote));
 }
 eco47Render();
}
function jsonp(){return new Promise((resolve,reject)=>{const cb='ecoImpact46_'+Date.now()+'_'+Math.floor(Math.random()*1e6);const s=document.createElement('script');let done=false;const finish=(err,val)=>{if(done)return;done=true;clearTimeout(timer);delete window[cb];s.remove();err?reject(err):resolve(val);};const timer=setTimeout(()=>finish(new Error('timeout')),15000);window[cb]=v=>finish(null,v);s.onerror=()=>finish(new Error('network'));s.src=API+'?callback='+encodeURIComponent(cb)+'&t='+Date.now();document.head.append(s);});}
async function load(){const token=++version;data=null;ui.stamp.textContent='';ui.metrics.replaceChildren();view.replaceChildren();tabs.hidden=true;view.hidden=true;ui.status.textContent=dict().loading;ui.heading.textContent=dict().heading;
 try{const v=await jsonp();if(token!==version)return;if(!v||v.success!==true||!finite(v.count)||!finite(v.paperKg)||!finite(v.capsCount)){ui.status.textContent=dict().invalid;return;}data=v;render();}catch(err){if(token===version)ui.status.textContent=dict().failed;}}
function visible(){return !ui.overlay.hidden&&ui.title.textContent.trim()==='EcoImpact';}
function sync(){const on=visible();const was=!ui.panel.hidden;ui.panel.hidden=!on;modal?.classList.toggle('eco-impact-46-modal',on);if(on&&!was){active='overview';eco48ShowAll=false;load();}if(!on&&was){version++;data=null;ui.metrics.replaceChildren();view.replaceChildren();}}
const mo=new MutationObserver(sync);mo.observe(ui.overlay,{attributes:true,attributeFilter:['hidden']});mo.observe(ui.title,{childList:true,subtree:true});
new MutationObserver(()=>{if(!ui.panel.hidden)render()}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
ui.retry.addEventListener('click',load);sync();
})();
