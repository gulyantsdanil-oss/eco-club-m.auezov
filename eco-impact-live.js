/* ECO WORLD 4.4 — read-only public metrics. Never display unverified fallback numbers. */
(()=>{'use strict';
const ui={panel:document.getElementById('impact-panel'),heading:document.getElementById('impact-heading'),stamp:document.getElementById('impact-stamp'),status:document.getElementById('impact-status'),metrics:document.getElementById('impact-metrics'),retry:document.getElementById('impact-retry'),overlay:document.getElementById('overlay')};
if(!ui.panel||!ui.overlay)return;
const dictionary={ru:{heading:'Реальный вклад школы',fetching:'Загружаем опубликованные показатели…',missing:'Подтверждённые показатели пока не опубликованы. Числа не подменяются демонстрационными данными.',error:'Не удалось загрузить публичную статистику. Попробуйте обновить данные.',asof:'По состоянию на ',retry:'Обновить показатели',verified:'Подтверждённые показатели',labels:{members:'Участники',paperKg:'Макулатура, кг',capsCount:'Крышки, шт.',batteriesCount:'Батарейки, шт.',plantsCount:'Посадки, шт.',eventsCount:'Мероприятия, шт.'}},kk:{heading:'Мектебіміздің нақты үлесі',fetching:'Жарияланған көрсеткіштер жүктелуде…',missing:'Расталған көрсеткіштер әлі жарияланбаған. Демонстрациялық сандар көрсетілмейді.',error:'Ашық статистиканы жүктеу мүмкін болмады. Қайта байқап көріңіз.',asof:'Жаңартылған күні: ',retry:'Көрсеткіштерді жаңарту',verified:'Расталған көрсеткіштер',labels:{members:'Қатысушылар',paperKg:'Макулатура, кг',capsCount:'Қақпақтар, дана',batteriesCount:'Батареялар, дана',plantsCount:'Отырғызылған өсімдіктер, дана',eventsCount:'Іс-шаралар, дана'}}};
const keys=['members','paperKg','capsCount','batteriesCount','plantsCount','eventsCount'];let requestToken=0;
function currentLang(){return document.documentElement.lang==='kk'?'kk':'ru'}
function reset(){ui.metrics.replaceChildren();ui.stamp.textContent='';}
function display(){const l=dictionary[currentLang()];ui.heading.textContent=l.heading;ui.retry.textContent=l.retry;}
async function read(){const token=++requestToken,l=dictionary[currentLang()];display();reset();ui.status.textContent=l.fetching;let data;
try{const response=await fetch('./eco-impact-public.json?reload='+Date.now(),{cache:'no-store'});if(!response.ok)throw new Error('HTTP '+response.status);data=await response.json();}catch(err){if(token===requestToken)ui.status.textContent=l.error;return;}
if(token!==requestToken)return;
// Publish only approved records, never trust partial, test or negative metrics.
if(!data||data.public!==true||data.verified!==true||!data.updatedAt||!/^\d{4}-\d\d-\d\d(?:T|$)/.test(data.updatedAt)||!data.metrics||typeof data.metrics!=='object') {ui.status.textContent=l.missing;return;}
const valid=keys.filter(key=>{const n=data.metrics[key];return typeof n==='number'&&Number.isFinite(n)&&n>=0&&(Number.isInteger(n)||key==='paperKg')});if(!valid.length){ui.status.textContent=l.missing;return;}
for(const key of valid){const tile=document.createElement('div');tile.className='impact-metric';const value=document.createElement('strong');value.textContent=new Intl.NumberFormat(currentLang()==='kk'?'kk-KZ':'ru-RU',{maximumFractionDigits:2}).format(data.metrics[key]);const label=document.createElement('span');label.textContent=l.labels[key];tile.append(value,label);ui.metrics.append(tile)}
ui.status.textContent=l.verified;const date=new Date(data.updatedAt);ui.stamp.textContent=l.asof+(Number.isNaN(date.valueOf())?data.updatedAt.slice(0,10):new Intl.DateTimeFormat(currentLang()==='kk'?'kk-KZ':'ru-RU',{year:'numeric',month:'short',day:'numeric'}).format(date));
}
const observer=new MutationObserver(()=>{if(ui.overlay.hidden||ui.panel.hidden)return;display()});observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
const modalTitle=document.getElementById('modal-title');
const modalObserver=new MutationObserver(()=>{const visible=!ui.overlay.hidden&&modalTitle.textContent==='EcoImpact';const was=ui.panel.hidden;ui.panel.hidden=!visible;if(visible&&was)read();if(!visible&&!was){requestToken++;reset();}});
modalObserver.observe(ui.overlay,{attributes:true,attributeFilter:['hidden']});modalObserver.observe(modalTitle,{childList:true});
ui.retry.addEventListener('click',read);
})();
