/* ECO WORLD 4.9 — EcoImpact dashboard. Public, read-only, bilingual. */
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
if(active==='classes'){const ranks=Array.isArray(data.rankings?.classes)?data.rankings.classes.filter(r=>r&&finite(r.points)):[];if(ranks.length){view.append(elem('h4','eco47-subhead',t.class));const thresholds=[0,10,50,150,300];ranks.forEach(r=>{let level=0;thresholds.forEach((n,i)=>{if(r.points>=n)level=i});const target=thresholds[level+1];if(target)reward(r.className+' · '+t.levels[level],r.points,target);else group.append(elem('div','eco47-level',r.className+' · 🏆 '+t.levels[level]));});}}
if(active==='awards'){view.append(elem('h4','eco47-subhead',t.people));const people=Array.isArray(data.awards?.participants)?data.awards.participants:[];let n=0;people.forEach((p,i)=>{const count=p?.confirmedContributionsCount??p?.contributionsCount;if(!finite(count))return;n++;let level=-1;[1,3,10,25].forEach((v,j)=>{if(count>=v)level=j});const target=[1,3,10,25][level+1];if(target)reward((lang()==='kk'?'Қатысушы ':'Участник ')+(i+1)+' · '+(level<0?'—':t.names[level]),count,target);else group.append(elem('div','eco47-level','🏆 '+(lang()==='kk'?'Қатысушы ':'Участник ')+(i+1)+' · '+t.names[3]));});if(!n)group.append(elem('p','eco47-level',t.unavailable));}
view.append(group);
if(active==='overview'){const toggle=elem('button','eco48-toggle',eco48ShowAll?i18n.hide:i18n.show);toggle.type='button';toggle.setAttribute('aria-expanded',String(eco48ShowAll));toggle.onclick=()=>{eco48ShowAll=!eco48ShowAll;render();};view.append(toggle);}
}

const tabs=elem('div','eco46-tabs');tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','EcoImpact');
const view=elem('section','eco46-view');view.id='eco46-view';view.setAttribute('aria-live','polite');
const tabNames=['overview','classes','awards'];
for(let i=0;i<tabNames.length;i++) {const b=elem('button','eco46-tab');b.type='button';b.dataset.tab=tabNames[i];b.setAttribute('role','tab');b.setAttribute('aria-controls',view.id);b.onclick=()=>{active=tabNames[i];render();};tabs.append(b);}
ui.metrics.after(tabs,view);const modal=ui.panel.closest('.modal');
function render(){const t=dict();ui.heading.textContent=t.heading;ui.retry.textContent=t.refresh;[...tabs.children].forEach((b,i)=>{b.textContent=t.tabs[i];b.setAttribute('aria-selected',String(active===tabNames[i]));});ui.metrics.replaceChildren();view.replaceChildren();if(!data){tabs.hidden=true;view.hidden=true;return;}tabs.hidden=false;view.hidden=false;
 const values=[data.count,data.paperKg,data.capsCount,data.contributionsCount];values.forEach((v,i)=>{if(!finite(v))return;const tile=elem('div','impact-metric');tile.append(elem('strong','',number(v,i===1?1:0)),elem('span','',t.labels[i]));ui.metrics.append(tile)});
 ui.status.textContent=(data.duplicateSuspected===true||data.quality?.duplicateSuspected===true||data.quality?.possibleDuplicate===true)?t.duplicate:(data.preliminary===true||data.quality?.preliminary===true)?t.prelim:t.ok;
 if(data.updatedAt){const date=new Date(data.updatedAt);ui.stamp.textContent=t.date+': '+(Number.isNaN(date.getTime())?String(data.updatedAt).slice(0,10):new Intl.DateTimeFormat(lang()==='kk'?'kk-KZ':'ru-RU',{dateStyle:'medium',timeStyle:'short'}).format(date));}
 if(active==='overview'){
  const goal=finite(data.goal)&&data.goal>0?data.goal:null;const total=finite(data.count)?data.count:0;
  if(goal){const hdr=elem('div','eco46-goal-top');hdr.append(elem('span','',t.goal),elem('strong','',`${number(total)} / ${number(goal)} · ${number(Math.min(100,total/goal*100))}%`));const tr=elem('div','eco46-track');const f=elem('i');f.style.width=Math.min(100,total/goal*100)+'%';tr.append(f);view.append(hdr,tr);}
  else view.append(elem('p','eco46-small',t.empty));
 } else if(active==='classes'){
  view.append(elem('strong','',t.ranking));const ranks=Array.isArray(data.rankings?.classes)?data.rankings.classes.filter(c=>c&&typeof c.className==='string'&&finite(c.points)).slice().sort((a,b)=>b.points-a.points).slice(0,6):[];
  if(!ranks.length)view.append(elem('p','eco46-small',t.noRanks));else{const max=Math.max(1,...ranks.map(r=>r.points));const list=elem('div','eco46-list');ranks.forEach((r,i)=>{const card=elem('div','eco46-rank');const h=elem('div','eco46-rank-heading');h.append(elem('b','',`${i+1}. ${r.className.slice(0,24)}`),elem('span','',`${number(r.points,1)} ${t.points}`));const track=elem('div','eco46-rank-track');const f=elem('i');f.style.width=100*r.points/max+'%';track.append(f);card.append(h,track);list.append(card)});view.append(list)}view.append(elem('p','eco46-small',t.rankNote));
 }else if(active==='awards'){
  view.append(elem('strong','',t.awards));const raw=Array.isArray(data.awards?.participants)?data.awards.participants:[];const all=Array.isArray(data.awards?.badges)?data.awards.badges:[];const badges=all.map(b=>({...b,total:raw.filter(p=>Array.isArray(p.badges)&&p.badges.includes(b.id)).length})).filter(b=>b.total>0).sort((a,b)=>b.total-a.total);
  if(!badges.length)view.append(elem('p','eco46-small',t.noAwards));else{const wrap=elem('div','eco46-badges');for(const b of badges){const x=elem('div','eco46-badge');const title=elem('strong');title.append(elem('span','eco46-badge-icon',typeof b.icon==='string'?b.icon:'🏅'),document.createTextNode(typeof b[lang()]==='string'?b[lang()]:String(b.id)));x.append(title,elem('small','',`${number(b.total)} ${t.earned}`));wrap.append(x)}view.append(wrap)}view.append(elem('p','eco46-small',t.awardsNote));
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
