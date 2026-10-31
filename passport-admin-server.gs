/**
 * EcoPassport 5.6 — OWNER-ONLY administration.
 * Standalone Apps Script project, NEVER put this in the pupils' project.
 * Deploy: execute as USER ACCESSING THE APP; only owner may access.
 * Script properties: ECO_SOURCE_SPREADSHEET_ID and ECO_ADMIN_EMAIL.
 * No plaintext student access codes are stored, emailed or logged.
 */
const PASSPORT_ADMIN54=Object.freeze({
 sheetProperty:'ECO_SOURCE_SPREADSHEET_ID',
 emailProperty:'ECO_ADMIN_EMAIL',
 contributions:'Вклад',
 access:'Паспорт — доступ',
 roster:'Паспорт — участники',
 audit:'Паспорт — аудит',
 days:180,
 limit:500
});
function doGet(){
 requirePassportAdmin_();
 return HtmlService.createHtmlOutputFromFile('AdminPanel')
  .setTitle('Eco Club — Управление паспортами')
  .addMetaTag('viewport','width=device-width, initial-scale=1');
}
function admin54Overview(){
 requirePassportAdmin_();
 const book=passportAdminBook_();
 const contribution=passportAdminSheet_(book,PASSPORT_ADMIN54.contributions);
 const access=passportAdminSheet_(book,PASSPORT_ADMIN54.access);
 const roster=book.getSheetByName(PASSPORT_ADMIN54.roster);
 const records=contribution.getDataRange().getValues().slice(1);
 const issued=access.getDataRange().getValues().slice(1);
 const persons=new Map(),audit=passportAdminAuditRows_(records);
 const registry=roster?roster.getDataRange().getValues().slice(1):[];
 const rosterById=new Map();
 registry.forEach(r=>{
  const id=String(r[0]||'').trim();
  if(id&&r[4]!==false)rosterById.set(id,{id,name:String(r[1]||''),className:String(r[2]||'')});
 });
 const activeByKey=new Map(),activeById=new Map();
 let expiredCodes=0,legacyCodes=0;
 issued.forEach(r=>{
  if(r[3]!==true)return;
  if(!passportAdminNotExpired_(r)){expiredCodes++;return;}
  if(!r[6])legacyCodes++;
  const id=String(r[7]||'').trim(), key=passportAdminIdentity_(r[0],r[1]);
  if(id)activeById.set(id,(activeById.get(id)||0)+1);
  else if(key)activeByKey.set(key,(activeByKey.get(key)||0)+1);
 });
 records.forEach(r=>{
  if(!passportAdminConfirmed_(r[7])||/тест/i.test(String(r[1]||'')))return;
  const paper=passportAdminNumber_(r[3]),caps=passportAdminNumber_(r[4]);
  if(paper===null||caps===null)return;
  let id=String(r[12]||'').trim();
  let p=id?rosterById.get(id):null;
  // Before the migration only, show existing participants by name/class.
  if(!roster){
   const key=passportAdminIdentity_(r[1],r[2]);if(!key)return;
   if(!persons.has(key))persons.set(key,{id:'',name:String(r[1]),className:String(r[2]),contributions:0,paperKg:0,capsCount:0});
   p=persons.get(key);id=key;
  }else{
   if(!p)return; // New rows must be explicitly synced before counting in a passport.
   if(!persons.has(id))persons.set(id,{id:p.id,name:p.name,className:p.className,contributions:0,paperKg:0,capsCount:0});
   p=persons.get(id);
  }
  p.contributions++;p.paperKg+=paper;p.capsCount+=caps;
 });
 // Keep a card for a person with an ID but temporarily no confirmed contributions.
 if(roster)rosterById.forEach(p=>{
  if(!persons.has(p.id))persons.set(p.id,{...p,contributions:0,paperKg:0,capsCount:0});
 });
 const expiry=passportAdmin56ExpiryOverview_(issued);
 const participants=Array.from(persons.values()).map(p=>{
  const key=passportAdminIdentity_(p.name,p.className);
  const n=(p.id?(activeById.get(p.id)||0):0)+(activeByKey.get(key)||0);
  const accessState=passportAdmin56ExpiryForPerson_(issued,p.id,key);
  return {...p,paperKg:Math.round(p.paperKg*1000)/1000,accessActive:n>0,accessCount:n,
   credentialStatus:accessState.status,expiryDate:accessState.expiryDate,
   daysUntilExpiry:accessState.daysUntilExpiry,
   participantRef:p.id?'ECO-'+p.id.slice(0,8).toUpperCase():null};
 }).sort((a,b)=>a.className.localeCompare(b.className,'ru')||a.name.localeCompare(b.name,'ru'));
 return {ok:true,participants:participants.slice(0,PASSPORT_ADMIN54.limit),
  setupRequired:!roster,summary:{total:participants.length,
  active:participants.filter(p=>p.accessActive).length,
  withoutAccess:participants.filter(p=>!p.accessActive).length,
  moreThanOneActive:participants.filter(p=>p.accessCount>1).length,
  expiredCodes,legacyCodes,expiresWithin7Days:expiry.within7,
  expiresWithin30Days:expiry.within30,invalidExpiry:expiry.invalid},
  audit,isTruncated:participants.length>PASSPORT_ADMIN54.limit};
}
/** Called from admin UI after explicit review. Idempotent; no deletions. */
function admin54Migrate(confirm){
 requirePassportAdmin_();
 if(confirm!=='MIGRATE_ECO55')throw new Error('CONFIRM_MIGRATION');
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try {
  const result=passportAdminLinkRows_();
  passportAdminLog_('MIGRATION','', 'OK','linked:'+result.linked+' newIDs:'+result.newIds+' linkedCodes:'+result.linkedCodes);
  return {ok:true,...result};
 }finally{lock.releaseLock();}
}
/** Re-run when new contributions arrive, after checking their identity. */
function admin54Sync(confirm){
 requirePassportAdmin_();
 if(confirm!=='SYNC_ECO55')throw new Error('CONFIRM_SYNC');
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try {
  const book=passportAdminBook_();
  if(!book.getSheetByName(PASSPORT_ADMIN54.roster))throw new Error('MIGRATE_FIRST');
  const result=passportAdminLinkRows_();
  passportAdminLog_('SYNC','', 'OK','linked:'+result.linked+' newIDs:'+result.newIds);
  return {ok:true,...result};
 }finally{lock.releaseLock();}
}
function passportAdminLinkRows_(){
 const book=passportAdminBook_();
 const contributions=passportAdminSheet_(book,PASSPORT_ADMIN54.contributions);
 const access=passportAdminSheet_(book,PASSPORT_ADMIN54.access);
 let roster=book.getSheetByName(PASSPORT_ADMIN54.roster);
 if(!roster){
  roster=book.insertSheet(PASSPORT_ADMIN54.roster);
  roster.appendRow(['ID участника','ФИО','Класс','Создан','Активен']);
  roster.setFrozenRows(1);
 }
 const audit=book.getSheetByName(PASSPORT_ADMIN54.audit);
 if(!audit){
  const log=book.insertSheet(PASSPORT_ADMIN54.audit);
  log.appendRow(['Время','Действие','ID участника','Результат','Администратор','Описание']);
  log.setFrozenRows(1);
 }
 const h=contributions.getRange(1,13).getValue();
 if(h && String(h).trim()!=='ID участника')throw new Error('COLUMN_M_IN_USE');
 if(!h)contributions.getRange(1,13).setValue('ID участника');
 const ah=access.getRange(1,7).getValue(),aId=access.getRange(1,8).getValue();
 if(ah && String(ah)!=='Истекает')throw new Error('ACCESS_COLUMN_G_IN_USE');
 if(aId && String(aId)!=='ID участника')throw new Error('ACCESS_COLUMN_H_IN_USE');
 if(!ah)access.getRange(1,7).setValue('Истекает');
 if(!aId)access.getRange(1,8).setValue('ID участника');
 const rosterRows=roster.getDataRange().getValues().slice(1);
 const byKey=new Map(),ids=new Set();
 rosterRows.forEach(r=>{
  const id=String(r[0]||'').trim(),key=passportAdminIdentity_(r[1],r[2]);
  if(!id||!key||ids.has(id)||byKey.has(key))throw new Error('AMBIGUOUS_ROSTER');
  ids.add(id);byKey.set(key,id);
 });
 const raw=contributions.getDataRange().getValues(),creds=access.getDataRange().getValues();
 // Preflight: an existing ID must point to the same roster identity.
 for(let i=1;i<raw.length;i++){
  const r=raw[i];if(!passportAdminConfirmed_(r[7])||/тест/i.test(String(r[1]||'')))continue;
  const key=passportAdminIdentity_(r[1],r[2]),stored=String(r[12]||'').trim();
  if(!key)throw new Error('MISSING_IDENTITY_ROW_'+(i+1));
  if(stored&&byKey.has(key)&&stored!==byKey.get(key))throw new Error('CONTRIBUTION_ID_CONFLICT_'+(i+1));
  if(stored&&!byKey.has(key))throw new Error('UNKNOWN_CONTRIBUTION_ID_'+(i+1));
 }
 for(let i=1;i<creds.length;i++){
  const r=creds[i];const key=passportAdminIdentity_(r[0],r[1]),id=String(r[7]||'').trim();
  if(id&&byKey.has(key)&&id!==byKey.get(key))throw new Error('ACCESS_ID_CONFLICT_'+(i+1));
  if(id&&!byKey.has(key))throw new Error('UNKNOWN_ACCESS_ID_'+(i+1));
 }
 let linked=0,newIds=0,linkedCodes=0;
 for(let i=1;i<raw.length;i++){
  const r=raw[i];if(!passportAdminConfirmed_(r[7])||/тест/i.test(String(r[1]||'')))continue;
  const key=passportAdminIdentity_(r[1],r[2]);
  let id=byKey.get(key);
  if(!id){
   id=Utilities.getUuid().replace(/-/g,'').toLowerCase();
   roster.appendRow([id,String(r[1]).trim(),String(r[2]).trim(),new Date(),true]);
   byKey.set(key,id);newIds++;
  }
  if(!String(r[12]||'').trim()){contributions.getRange(i+1,13).setValue(id);linked++;}
 }
 for(let i=1;i<creds.length;i++){
  const r=creds[i];
  const key=passportAdminIdentity_(r[0],r[1]),id=byKey.get(key);
  if(id&&!String(r[7]||'').trim()){access.getRange(i+1,8).setValue(id);linkedCodes++;}
 }
 return {linked,newIds,linkedCodes};
}
function admin54Issue(name,className){
 requirePassportAdmin_();
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try {
  const book=passportAdminBook_(),access=passportAdminSheet_(book,PASSPORT_ADMIN54.access);
  const rows=passportAdminSheet_(book,PASSPORT_ADMIN54.contributions).getDataRange().getValues();
  const roster=book.getSheetByName(PASSPORT_ADMIN54.roster);
  if(!roster)throw new Error('MIGRATE_FIRST');
  const key=passportAdminIdentity_(name,className);
  const people=roster.getDataRange().getValues().slice(1).filter(r=>
   passportAdminIdentity_(r[1],r[2])===key&&r[4]!==false);
  if(people.length!==1)throw new Error('INVALID_PARTICIPANT');
  const id=String(people[0][0]||'').trim();
  if(!id||/тест/i.test(String(name)))throw new Error('INVALID_PARTICIPANT');
  if(!rows.slice(1).some(r=>String(r[12]||'').trim()===id&&passportAdminConfirmed_(r[7])))
   throw new Error('NO_LINKED_CONFIRMED_CONTRIBUTIONS');
  const code=(Utilities.getUuid()+Utilities.getUuid()).replace(/-/g,'').toLowerCase();
  const now=new Date(),expires=new Date(now.getTime()+PASSPORT_ADMIN54.days*24*3600000);
  const previous=access.getDataRange().getValues();
  // First store only the hash and explicit ID/expiry; then invalidate previous.
  access.appendRow([String(people[0][1]).trim(),String(people[0][2]).trim(),
    passportAdminHash_(code),true,now,'',expires,id]);
  let revokedPrevious=0;
  for(let i=1;i<previous.length;i++){
   const r=previous[i],legacyKey=passportAdminIdentity_(r[0],r[1]);
   if(r[3]===true&&(String(r[7]||'').trim()===id||(!r[7]&&legacyKey===key))){
    access.getRange(i+1,4,1,3).setValues([[false,r[4]||'',now]]);
    revokedPrevious++;
   }
  }
  passportAdminLog_('ISSUE',id,'OK','replaced:'+revokedPrevious+' validityDays:'+PASSPORT_ADMIN54.days);
  return {ok:true,code,revokedPrevious,expiresAt:expires.toISOString()};
 }finally{lock.releaseLock();}
}
function admin54Revoke(name,className){
 requirePassportAdmin_();
 const lock=LockService.getScriptLock();lock.waitLock(30000);
 try {
  const book=passportAdminBook_(),access=passportAdminSheet_(book,PASSPORT_ADMIN54.access);
  const roster=book.getSheetByName(PASSPORT_ADMIN54.roster);if(!roster)throw new Error('MIGRATE_FIRST');
  const key=passportAdminIdentity_(name,className);
  const candidates=roster.getDataRange().getValues().slice(1).filter(r=>
   passportAdminIdentity_(r[1],r[2])===key&&r[4]!==false);
  if(candidates.length!==1)throw new Error('INVALID_PARTICIPANT');
  const id=String(candidates[0][0]||'').trim();
  const rows=access.getDataRange().getValues(),now=new Date();let revoked=0;
  for(let i=1;i<rows.length;i++){
   if(rows[i][3]===true&&(String(rows[i][7]||'').trim()===id||
     (!rows[i][7]&&passportAdminIdentity_(rows[i][0],rows[i][1])===key))){
    access.getRange(i+1,4,1,3).setValues([[false,rows[i][4]||'',now]]);
    revoked++;
   }
  }
  passportAdminLog_('REVOKE',id,'OK','count:'+revoked);
  return {ok:true,revoked};
 }finally{lock.releaseLock();}
}
function passportAdminLog_(action,id,result,info){
 const book=passportAdminBook_(),sheet=book.getSheetByName(PASSPORT_ADMIN54.audit);
 if(!sheet)throw new Error('MIGRATE_FIRST');
 sheet.appendRow([new Date(),action,id,result,Session.getActiveUser().getEmail(),info]);
}
function passportAdminAuditRows_(rows){
 const audit={rows:0,confirmed:0,unconfirmed:0,testConfirmed:0,
  confirmedWithoutRequestId:0,duplicateRequestIds:0,possibleRepeatedSubmissions:0,
  unlinkedConfirmed:0};
 const ids=new Set(),signatures=new Map();
 rows.forEach(r=>{
  if(!r.some(v=>v!==''&&v!=null))return;audit.rows++;
  if(!passportAdminConfirmed_(r[7])){audit.unconfirmed++;return;}
  audit.confirmed++;
  if(/тест/i.test(String(r[1]||''))){audit.testConfirmed++;return;}
  const requestId=String(r[8]||'').trim();
  if(!requestId)audit.confirmedWithoutRequestId++;
  else if(ids.has(requestId))audit.duplicateRequestIds++;
  else ids.add(requestId);
  if(!String(r[12]||'').trim())audit.unlinkedConfirmed++;
  const key=passportAdminIdentity_(r[1],r[2])+'|'+r[3]+'|'+r[4];
  signatures.set(key,(signatures.get(key)||0)+1);
 });
 signatures.forEach(n=>{if(n>1)audit.possibleRepeatedSubmissions+=n-1;});
 return audit;
}
function passportAdminNotExpired_(row){
 if(row[6]===''||row[6]==null)return true; // legacy codes remain valid until rotation/revocation
 const time=row[6] instanceof Date?row[6].getTime():new Date(row[6]).getTime();
 return Number.isFinite(time)&&Date.now()<time;
}
function requirePassportAdmin_(){
 const props=PropertiesService.getScriptProperties();
 const expected=String(props.getProperty(PASSPORT_ADMIN54.emailProperty)||'').trim().toLowerCase();
 const active=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
 const effective=String(Session.getEffectiveUser().getEmail()||'').trim().toLowerCase();
 if(!expected||!active||!effective||active!==expected||effective!==expected)
  throw new Error('ADMIN_ACCESS_DENIED');
}
function passportAdminBook_(){
 const id=PropertiesService.getScriptProperties().getProperty(PASSPORT_ADMIN54.sheetProperty);
 if(!id||!/^[A-Za-z0-9_-]{20,}$/.test(id))throw new Error('NOT_CONFIGURED');
 return SpreadsheetApp.openById(id);
}
function passportAdminSheet_(book,name){
 const sheet=book.getSheetByName(name);
 if(!sheet)throw new Error('MISSING_SHEET_'+name);
 return sheet;
}
function passportAdminIdentity_(name,className){
 const norm=s=>String(s||'').normalize('NFKC').replace(/ё/gi,'е')
  .replace(/\s+/g,' ').trim().toLowerCase();
 const n=norm(name),cl=norm(className).replace(/\s/g,'');
 return n&&cl?n+'|'+cl:'';
}
function passportAdminConfirmed_(status){
 const s=String(status||'').normalize('NFKC').toLowerCase().replace(/[^a-zа-яәғқңөұүһіё]/g,'');
 return ['подтверждено','подтвердждено','confirmed','approved','расталды','бекітілді'].includes(s);
}
function passportAdminNumber_(n){
 const x=Number(String(n==null||n===''?0:n).replace(',','.'));
 return Number.isFinite(x)&&x>=0?x:null;
}
function passportAdminHash_(code){
 return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,code,Utilities.Charset.UTF_8)
  .map(v=>(v&255).toString(16).padStart(2,'0')).join('');
}


// --- EcoPassport 5.6: owner-facing expiry status and optional weekly mail digest ---
// These functions never log or email plaintext codes, hashes, pupil names or IDs.
// Old credentials without an expiry are explicitly reported as legacy.
function passportAdmin56ExpiryOverview_(rows,now) {
  const current=typeof now==='number'?now:Date.now();
  const result={within7:0,within30:0,expired:0,legacy:0,invalid:0,valid:0};
  rows.forEach(r=>{
    if(r[3]!==true)return;
    const check=passportAdmin56Classify_(r,current);
    if(check.status==='legacy')result.legacy++;
    else if(check.status==='expired')result.expired++;
    else if(check.status==='invalid')result.invalid++;
    else if(check.status==='within7'){result.within7++;result.within30++;}
    else if(check.status==='within30')result.within30++;
    else if(check.status==='valid')result.valid++;
  });
  return result;
}
function passportAdmin56Classify_(row,now) {
  const current=typeof now==='number'?now:Date.now();
  if(row[3]!==true)return {status:'revoked',expiryDate:null,daysUntilExpiry:null};
  const raw=row[6];
  if(raw===''||raw==null)return {status:'legacy',expiryDate:null,daysUntilExpiry:null};
  const millis=raw instanceof Date?raw.getTime():new Date(raw).getTime();
  if(!Number.isFinite(millis))return {status:'invalid',expiryDate:null,daysUntilExpiry:null};
  const days=Math.ceil((millis-current)/86400000);
  const expiryDate=Utilities.formatDate(new Date(millis),Session.getScriptTimeZone(),'yyyy-MM-dd');
  if(millis<=current)return {status:'expired',expiryDate,daysUntilExpiry:0};
  if(millis-current<=7*86400000)return {status:'within7',expiryDate,daysUntilExpiry:days};
  if(millis-current<=30*86400000)return {status:'within30',expiryDate,daysUntilExpiry:days};
  return {status:'valid',expiryDate,daysUntilExpiry:days};
}
function passportAdmin56ExpiryForPerson_(issued,id,key,now) {
  const all=issued.filter(r=>String(r[7]||'').trim()===id&&id||
    !String(r[7]||'').trim()&&passportAdminIdentity_(r[0],r[1])===key);
  const priorities={within7:1,within30:2,legacy:3,valid:4,expired:5,invalid:6,revoked:7};
  const summary=all.map(r=>passportAdmin56Classify_(r,now)).sort((a,b)=>
    priorities[a.status]-priorities[b.status]);
  return summary[0]||{status:'none',expiryDate:null,daysUntilExpiry:null};
}
/** Owner-only settings, no email sent by status lookup. */
function admin56NotificationStatus(){
  requirePassportAdmin_();
  const enabled=PropertiesService.getScriptProperties().getProperty('ECO56_REMINDERS_ENABLED')==='1';
  const actual=ScriptApp.getProjectTriggers().some(t=>t.getHandlerFunction()==='passportAdmin56WeeklyDigest_');
  return {enabled:enabled&&actual,timezone:Session.getScriptTimeZone(),
    schedule:'Понедельник, около 08:00 (временная зона проекта)'};
}
/** Called only after explicit click and confirmation in the owner-only admin panel. */
function admin56SetNotifications(enabled){
  requirePassportAdmin_();
  if(typeof enabled!=='boolean')throw new Error('INVALID_VALUE');
  const props=PropertiesService.getScriptProperties();
  const triggers=ScriptApp.getProjectTriggers().filter(t=>
    t.getHandlerFunction()==='passportAdmin56WeeklyDigest_');
  if(enabled){
    if(triggers.length===0)ScriptApp.newTrigger('passportAdmin56WeeklyDigest_')
      .timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(8)
      .everyWeeks(1).inTimezone('Asia/Almaty').create();
    // Remove duplicate triggers if any; do not affect other workflows.
    const matching=ScriptApp.getProjectTriggers().filter(t=>
      t.getHandlerFunction()==='passportAdmin56WeeklyDigest_');
    matching.slice(1).forEach(t=>ScriptApp.deleteTrigger(t));
  }else{
    triggers.forEach(t=>ScriptApp.deleteTrigger(t));
  }
  props.setProperty('ECO56_REMINDERS_ENABLED',enabled?'1':'0');
  passportAdminLog_(enabled?'REMINDERS_ENABLED':'REMINDERS_DISABLED','', 'OK','aggregate counts only');
  return admin56NotificationStatus();
}
/**
 * Private installable trigger — never remotely callable via google.script.run.
 * Triggers may have no active-user email; trust only effective account,
 * project-owned property and the flag for owner-initiated scheduling.
 */
function passportAdmin56WeeklyDigest_(){
  const props=PropertiesService.getScriptProperties();
  const owner=String(props.getProperty('ECO_ADMIN_EMAIL')||'').trim().toLowerCase();
  const effective=String(Session.getEffectiveUser().getEmail()||'').trim().toLowerCase();
  if(!owner||!effective||owner!==effective||props.getProperty('ECO56_REMINDERS_ENABLED')!=='1')
    throw new Error('REMINDER_ACCESS_DENIED');
  const access=passportAdminSheet_(passportAdminBook_(),PASSPORT_ADMIN54.access)
    .getDataRange().getValues().slice(1);
  const counts=passportAdmin56ExpiryOverview_(access);
  // Do not send an empty report. Legacy keys are included to encourage rotation.
  if(!counts.within7&&!counts.within30&&!counts.legacy&&!counts.expired&&!counts.invalid)
    return {sent:false,reason:'NO_ATTENTION_REQUIRED'};
  const lines=[
    'Eco Club — сводный отчёт по доступам EcoPassport',
    '',
    'Истекают в ближайшие 7 дней: '+counts.within7,
    'Истекают в ближайшие 30 дней (включая 7 дней): '+counts.within30,
    'Старые коды без срока действия: '+counts.legacy,
    'Уже истёкшие коды: '+counts.expired,
    'Некорректные даты окончания: '+counts.invalid,
    '',
    'Откройте закрытую панель Eco Club — Passport Admin для действий.',
    'В письме намеренно отсутствуют ФИО учащихся и секретные коды.'
  ];
  MailApp.sendEmail({to:owner,subject:'EcoPassport: контроль сроков кодов',body:lines.join('\n')});
  return {sent:true,counts};
}
