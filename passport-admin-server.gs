/**
 * EcoPassport 5.4 — OWNER-ONLY ADMIN WEB APP.
 * DEPLOY THIS IN A SEPARATE GOOGLE APPS SCRIPT PROJECT.
 * DO NOT copy into the existing student passport project.
 *
 * Script properties:
 * ECO_SOURCE_SPREADSHEET_ID = private Eco Club spreadsheet ID
 * ECO_ADMIN_EMAIL = email of the spreadsheet owner (owner's own email)
 *
 * Deploy: Execute as "User accessing the web app";
 * Who has access: "Only myself".
 *
 * All public server functions below verify BOTH active and effective identity.
 * Fail closed when Google does not provide the email.
 * No plaintext access codes are written to a sheet or to logs.
 */
const PASSPORT_ADMIN54 = Object.freeze({
  sheetProperty: 'ECO_SOURCE_SPREADSHEET_ID',
  emailProperty: 'ECO_ADMIN_EMAIL',
  contributions: 'Вклад',
  access: 'Паспорт — доступ',
  limit: 500
});

function doGet() {
  requirePassportAdmin_();
  return HtmlService.createHtmlOutputFromFile('AdminPanel')
    .setTitle('Eco Club — Управление паспортами')
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}

function admin54Overview() {
  requirePassportAdmin_();
  const book=passportAdminBook_();
  const source=book.getSheetByName(PASSPORT_ADMIN54.contributions);
  const access=book.getSheetByName(PASSPORT_ADMIN54.access);
  if(!source||!access)throw new Error('MISSING_SHEETS');
  const contributions=source.getDataRange().getValues().slice(1);
  const credentials=access.getDataRange().getValues().slice(1);
  const people=new Map(), seenIds=new Set(), signatures=new Map();
  const audit={rows:0,confirmed:0,unconfirmed:0,testConfirmed:0,confirmedWithoutRequestId:0,duplicateRequestIds:0,possibleRepeatedSubmissions:0};
  contributions.forEach(row=>{
    if(!row.some(v=>v!==''&&v!==null&&v!==undefined))return;
    audit.rows++;
    if(!passportAdminConfirmed_(row[7])){audit.unconfirmed++;return;}
    audit.confirmed++;
    const name=String(row[1]||'').trim(),cl=String(row[2]||'').trim();
    if(/тест/i.test(name)){audit.testConfirmed++;return;}
    const requestId=String(row[8]||'').trim();
    if(!requestId)audit.confirmedWithoutRequestId++;
    if(requestId&&seenIds.has(requestId)){audit.duplicateRequestIds++;return;}
    if(requestId)seenIds.add(requestId);
    const key=passportAdminIdentity_(name,cl),paper=passportAdminNumber_(row[3]),caps=passportAdminNumber_(row[4]);
    if(!key||paper===null||caps===null)return;
    const signature=key+'|'+paper+'|'+caps;
    signatures.set(signature,(signatures.get(signature)||0)+1);
    if(!people.has(key))people.set(key,{name,className:cl,contributions:0,paperKg:0,capsCount:0,active:0,records:0});
    const p=people.get(key);p.contributions++;p.paperKg+=paper;p.capsCount+=caps;
  });
  signatures.forEach(n=>{if(n>1)audit.possibleRepeatedSubmissions+=n-1;});
  credentials.forEach(row=>{
    if(row[3]!==true)return;
    const key=passportAdminIdentity_(row[0],row[1]);
    if(people.has(key)){people.get(key).active++;people.get(key).records++;}
  });
  const participants=Array.from(people.values()).slice(0,PASSPORT_ADMIN54.limit).map(x=>({
    name:x.name,className:x.className,contributions:x.contributions,
    paperKg:Math.round(x.paperKg*1000)/1000,capsCount:x.capsCount,
    accessActive:x.active>0,accessCount:x.active
  })).sort((a,b)=>a.className.localeCompare(b.className,'ru')||a.name.localeCompare(b.name,'ru'));
  return {ok:true,participants,audit,summary:{
    total:people.size,active:participants.filter(x=>x.accessActive).length,
    withoutAccess:participants.filter(x=>!x.accessActive).length,
    moreThanOneActive:participants.filter(x=>x.accessCount>1).length
  },isTruncated:people.size>PASSPORT_ADMIN54.limit};
}

function admin54Issue(name,className) {
  requirePassportAdmin_();
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const book=passportAdminBook_();
    const access=book.getSheetByName(PASSPORT_ADMIN54.access);
    const contributions=book.getSheetByName(PASSPORT_ADMIN54.contributions);
    if(!access||!contributions)throw new Error('MISSING_SHEETS');
    const key=passportAdminIdentity_(name,className);
    if(!key||/тест/i.test(String(name)))throw new Error('INVALID_PARTICIPANT');
    const rows=contributions.getDataRange().getValues().slice(1);
    const match=rows.find(row=>passportAdminConfirmed_(row[7])&&
       passportAdminIdentity_(row[1],row[2])===key);
    if(!match)throw new Error('NOT_CONFIRMED_PARTICIPANT');
    const canonicalName=String(match[1]||'').trim();
    const canonicalClass=String(match[2]||'').trim();
    // Two independent UUIDv4 values. Access code is shown ONCE to the admin.
    const code=(Utilities.getUuid()+Utilities.getUuid()).replace(/-/g,'').toLowerCase();
    const hash=passportAdminHash_(code);
    const previous=access.getDataRange().getValues();
    const now=new Date();
    // Append new active hash first; then invalidate older matching credentials.
    access.appendRow([canonicalName,canonicalClass,hash,true,now,'']);
    let revoked=0;
    for(let i=1;i<previous.length;i++) {
      if(previous[i][3]===true&&passportAdminIdentity_(previous[i][0],previous[i][1])===key){
        access.getRange(i+1,4,1,3).setValues([[false,previous[i][4]||'',now]]);
        revoked++;
      }
    }
    return {ok:true,code,revokedPrevious:revoked};
  } finally {lock.releaseLock();}
}

function admin54Revoke(name,className) {
  requirePassportAdmin_();
  const key=passportAdminIdentity_(name,className);
  if(!key)throw new Error('INVALID_PARTICIPANT');
  const lock=LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    const tab=passportAdminBook_().getSheetByName(PASSPORT_ADMIN54.access);
    if(!tab)throw new Error('MISSING_SHEETS');
    const rows=tab.getDataRange().getValues(),now=new Date();
    let revoked=0;
    for(let i=1;i<rows.length;i++){
      if(rows[i][3]===true&&passportAdminIdentity_(rows[i][0],rows[i][1])===key){
        tab.getRange(i+1,4,1,3).setValues([[false,rows[i][4]||'',now]]);
        revoked++;
      }
    }
    return {ok:true,revoked};
  }finally{lock.releaseLock();}
}

// PRIVATE helpers: deliberately inaccessible to google.script.run.
function requirePassportAdmin_() {
  const props=PropertiesService.getScriptProperties();
  const expected=String(props.getProperty(PASSPORT_ADMIN54.emailProperty)||'').trim().toLowerCase();
  const active=String(Session.getActiveUser().getEmail()||'').trim().toLowerCase();
  const effective=String(Session.getEffectiveUser().getEmail()||'').trim().toLowerCase();
  if(!expected||!active||!effective||active!==expected||effective!==expected){
    throw new Error('ADMIN_ACCESS_DENIED');
  }
}

function passportAdminBook_() {
  const id=PropertiesService.getScriptProperties().getProperty(PASSPORT_ADMIN54.sheetProperty);
  if(!id||!/^[A-Za-z0-9_-]{20,}$/.test(id))throw new Error('NOT_CONFIGURED');
  return SpreadsheetApp.openById(id);
}

function passportAdminIdentity_(name,className) {
  const normalize=s=>String(s||'').normalize('NFKC')
    .replace(/ё/gi,'е').replace(/\s+/g,' ').trim().toLowerCase();
  const a=normalize(name),b=normalize(className).replace(/\s/g,'');
  return a&&b?a+'|'+b:'';
}
function passportAdminConfirmed_(status){
  const s=String(status||'').normalize('NFKC').toLowerCase().replace(/[^a-zа-яәғқңөұүһіё]/g,'');
  return ['подтверждено','подтвердждено','confirmed','approved','расталды','бекітілді'].includes(s);
}
function passportAdminNumber_(value) {
  const num=Number(String(value==null||value===''?0:value).replace(',','.'));
  return Number.isFinite(num)&&num>=0?num:null;
}
function passportAdminHash_(code){
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,code,Utilities.Charset.UTF_8)
    .map(v=>(v&255).toString(16).padStart(2,'0')).join('');
}
