/* ECO WORLD 4.5 — read-only EcoImpact from the existing Eco Club public Apps Script API.
   Collection totals are preliminary while the potential duplicate is under review.
   No personal data is rendered; no write requests are made. */
(()=>{'use strict';
const API='https://script.google.com/macros/s/AKfycbz0DrR9pZv-R1L6T1HmhuYAAYJt2OoQgJf851uglXsxPtkGH9K1s_o0kCUB_LNRL9bmdA/exec';
const el=id=>document.getElementById(id);
const ui={panel:el('impact-panel'),heading:el('impact-heading'),stamp:el('impact-stamp'),status:el('impact-status'),metrics:el('impact-metrics'),retry:el('impact-retry'),overlay:el('overlay'),modalTitle:el('modal-title')};
if(Object.values(ui).some(x=>!x))return;
const translations={
 ru:{heading:'Реальный вклад школы',fetching:'Загружаем показатели из Eco Club…',error:'Не удалось получить данные. Нажмите «Обновить показатели».',missing:'Сервер не вернул корректные показатели.',asof:'Ответ сервера: ',retry:'Обновить показатели',preliminary:'Предварительная статистика: вероятный дубль ещё проверяется.',labels:{members:'Принятые участники',paperKg:'Макулатура, кг',capsCount:'Крышки, шт.',contributionsCount:'Учтённые вклады'}},
 kk:{heading:'Мектебіміздің нақты үлесі',fetching:'Eco Club көрсеткіштері жүктелуде…',error:'Деректер алынбады. «Көрсеткіштерді жаңарту» түймесін басыңыз.',missing:'Сервер дұрыс көрсеткіштерді қайтармады.',asof:'Сервер жауабы: ',retry:'Көрсеткіштерді жаңарту',preliminary:'Алдын ала статистика: ықтимал қайталанған жазба тексерілуде.',labels:{members:'Қабылданған қатысушылар',paperKg:'Макулатура, кг',capsCount:'Қақпақтар, дана',contributionsCount:'Есептелген үлестер'}}
};
let requestToken=0,lastData=null;
const lang=()=>document.documentElement.lang==='kk'?'kk':'ru';
function clear(){ui.metrics.replaceChildren();ui.stamp.textContent='';}
function render(){const t=translations[lang()];ui.heading.textContent=t.heading;ui.retry.textContent=t.retry;if(!lastData)return;
 clear();const n=[['members',lastData.count],['paperKg',lastData.paperKg],['capsCount',lastData.capsCount],['contributionsCount',lastData.contributionsCount]];
 for(const [key,value] of n){if(!Number.isFinite(value))continue;const tile=document.createElement('div');tile.className='impact-metric';const strong=document.createElement('strong');strong.textContent=new Intl.NumberFormat(lang()==='kk'?'kk-KZ':'ru-RU',{maximumFractionDigits:key==='paperKg'?1:0}).format(value);const label=document.createElement('span');label.textContent=t.labels[key];tile.append(strong,label);ui.metrics.append(tile);}
 ui.status.textContent=t.preliminary;
 if(lastData.updatedAt){const d=new Date(lastData.updatedAt);ui.stamp.textContent=t.asof+(Number.isNaN(d.valueOf())?lastData.updatedAt:new Intl.DateTimeFormat(lang()==='kk'?'kk-KZ':'ru-RU',{dateStyle:'medium',timeStyle:'short'}).format(d));}
}
function jsonp(token){return new Promise((resolve,reject)=>{
 const callback='ecoImpactPublicCb_'+Date.now()+'_'+Math.floor(Math.random()*1000000);
 const s=document.createElement('script');let settled=false;
 const finish=(error,value)=>{if(settled)return;settled=true;clearTimeout(timer);delete window[callback];s.remove();error?reject(error):resolve(value);};
 const timer=setTimeout(()=>finish(new Error('Timeout')),15000);
 window[callback]=data=>finish(null,data);
 s.onerror=()=>finish(new Error('Network error'));
 s.src=API+'?callback='+encodeURIComponent(callback)+'&t='+Date.now();
 document.head.appendChild(s);
 });}
async function read(){const token=++requestToken;lastData=null;clear();const t=translations[lang()];ui.heading.textContent=t.heading;ui.retry.textContent=t.retry;ui.status.textContent=t.fetching;
 try{const data=await jsonp(token);if(token!==requestToken)return;
 const keys=['count','paperKg','capsCount','contributionsCount'];
 const number=k=>typeof data?.[k]==='number'&&Number.isFinite(data[k])&&data[k]>=0?data[k]:null;
 if(data?.success!==true||number('count')===null||number('paperKg')===null||number('capsCount')===null){ui.status.textContent=translations[lang()].missing;return;}
 lastData={count:number('count'),paperKg:number('paperKg'),capsCount:number('capsCount'),contributionsCount:number('contributionsCount'),updatedAt:typeof data.updatedAt==='string'?data.updatedAt:null};render();
 }catch(_){if(token===requestToken)ui.status.textContent=translations[lang()].error;}
}
const isVisible=()=>!ui.overlay.hidden&&ui.modalTitle.textContent.trim()==='EcoImpact';
function syncModal(){const visible=isVisible();const was=ui.panel.hidden;ui.panel.hidden=!visible;if(visible&&was)read();if(!visible&&!was){++requestToken;lastData=null;clear();}}
const modalObserver=new MutationObserver(syncModal);modalObserver.observe(ui.overlay,{attributes:true,attributeFilter:['hidden']});modalObserver.observe(ui.modalTitle,{childList:true,subtree:true});
new MutationObserver(()=>{if(!ui.panel.hidden)render();}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
ui.retry.addEventListener('click',read);
syncModal();
})();
