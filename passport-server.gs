/**
 * Eco Club / EcoPassport 5.2
 * PRIVATE Google Apps Script web application.
 *
 * 1) Create a separate Apps Script project owned by the spreadsheet owner.
 * 2) Add this file as Code.gs, and passport-portal.html as PassportPortal.html.
 * 3) In Script Properties, set ECO_SOURCE_SPREADSHEET_ID to the PRIVATE Eco Club spreadsheet ID.
 * 4) Run adminInitialize_() once from Apps Script editor.
 * 5) To issue a code, set PASSPORT_ISSUE_NAME and PASSPORT_ISSUE_CLASS in Script Properties,
 *    then run adminIssueCode_(). Collect code from "Паспорт — выдача", deliver privately,
 *    and delete the plaintext after delivery.
 * 6) Deploy as Web App, execute as owner, access "Anyone with the link".
 *    SECURITY: User data is never returned without a long high-entropy possession credential.
 *    Do not expose the private spreadsheet via separate public API actions.
 * 7) Paste ONLY the web-app /exec URL into public eco-passport.html.
 *
 * This code intentionally has NO unauthenticated endpoint to search participants.
 * It does not expose student names, totals or codes via JSONP / GET.
 */
const ECO_PASSPORT = Object.freeze({
  spreadsheetProperty: 'ECO_SOURCE_SPREADSHEET_ID',
  contributionTab: 'Вклад',
  accessTab: 'Паспорт — доступ',
  deliveryTab: 'Паспорт — выдача',
  maxHistory: 100
});

function doGet() {
  return HtmlService.createHtmlOutputFromFile('PassportPortal')
    .setTitle('Eco Club — Личный экологический паспорт')
    .addMetaTag('viewport','width=device-width, initial-scale=1');
}

function getMyPassport(code) {
  // This is the ONLY remotely callable data reader.
  // No name, class or participant ID is accepted from the browser.
  const submitted = String(code || '').trim();
  if (!/^[0-9a-f]{64}$/i.test(submitted)) throw new Error('ACCESS_DENIED');
  const fingerprint = sha256_(submitted.toLowerCase());
  const book = sourceWorkbook_();
  const accessSheet = book.getSheetByName(ECO_PASSPORT.accessTab);
  if (!accessSheet) throw new Error('ACCESS_DENIED');

  const records = accessSheet.getDataRange().getValues();
  let authorised = null;
  for (let i = 1; i < records.length; i++) {
    const row = records[i];
    if (String(row[2] || '') === fingerprint && row[3] === true) {
      authorised = {name: String(row[0]||''), className: String(row[1]||'')};
      break;
    }
  }
  if (!authorised) throw new Error('ACCESS_DENIED');

  const sheet = book.getSheetByName(ECO_PASSPORT.contributionTab);
  if (!sheet) throw new Error('DATA_UNAVAILABLE');
  const rows = sheet.getDataRange().getValues();
  const key = identityKey_(authorised.name, authorised.className);
  const history = [];
  const uniqueRequestIds = new Set();
  let paperKg = 0, capsCount = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (identityKey_(row[1],row[2]) !== key) continue;
    if (!isConfirmed_(row[7])) continue;
    const reqId = String(row[8] || '').trim();
    if (reqId && uniqueRequestIds.has(reqId)) continue;
    if (reqId) uniqueRequestIds.add(reqId);
    const paper = nonNegative_(row[3]), caps = nonNegative_(row[4]);
    if (paper === null || caps === null) continue;
    paperKg += paper; capsCount += caps;
    const date = row[0] instanceof Date
      ? Utilities.formatDate(row[0], Session.getScriptTimeZone(), 'yyyy-MM-dd')
      : String(row[0]||'').slice(0,24);
    history.push({date, paperKg:paper, capsCount:caps});
  }
  const count = history.length;
  const milestones = [1,3,10,25];
  let level = -1;
  milestones.forEach((n,i)=>{if(count>=n)level=i;});
  const nextTarget = milestones[level+1] || null;
  const awards = [
    {id:'first', icon:'🌱', ru:'Первый вклад', kk:'Алғашқы үлес', earned:count>=1},
    {id:'three', icon:'✨', ru:'3 вклада', kk:'3 үлес', earned:count>=3},
    {id:'paper5', icon:'🌿', ru:'Первые 5 кг', kk:'Алғашқы 5 кг', earned:paperKg>=5},
    {id:'paper10', icon:'🌳', ru:'10 кг добра', kk:'10 кг жақсылық', earned:paperKg>=10},
    {id:'caps100', icon:'♻️', ru:'100 крышек', kk:'100 қақпақ', earned:capsCount>=100}
  ];
  return {
    success:true,
    name:authorised.name, className:authorised.className,
    confirmedCount:count,
    paperKg:Math.round(paperKg*1000)/1000,
    capsCount,
    level,
    nextTarget,
    awards,
    history:history.slice(-ECO_PASSPORT.maxHistory).reverse()
  };
}

function sourceWorkbook_() {
  const id=PropertiesService.getScriptProperties().getProperty(ECO_PASSPORT.spreadsheetProperty);
  if (!id || !/^[\w-]{20,}$/.test(id)) throw new Error('NOT_CONFIGURED');
  return SpreadsheetApp.openById(id);
}

function identityKey_(name,cl) {
  const norm=x=>String(x||'').normalize('NFKC').replace(/ё/gi,'е').replace(/\s+/g,' ').trim().toLowerCase();
  return norm(name)+'|'+norm(cl).replace(/\s/g,'');
}

function isConfirmed_(status) {
  const normalized=String(status||'').normalize('NFKC').toLowerCase().replace(/[^a-zа-яәғқңөұүһіё]/g,'');
  return ['подтверждено','подтвердждено','confirmed','approved','расталды','бекітілді'].includes(normalized);
}

function nonNegative_(value) {
  if (value===null || value==='' || value===undefined) return 0;
  const n=Number(String(value).replace(',','.'));
  return Number.isFinite(n)&&n>=0?n:null;
}

function sha256_(text) {
  const bytes=Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,text,Utilities.Charset.UTF_8);
  return bytes.map(x=>(x&255).toString(16).padStart(2,'0')).join('');
}

// ------- ADMIN-ONLY FUNCTIONS: functions ending in "_" are not callable by google.script.run -------
function adminInitialize_() {
  const book=sourceWorkbook_();
  if(!book.getSheetByName(ECO_PASSPORT.accessTab)){
    const sheet=book.insertSheet(ECO_PASSPORT.accessTab);
    sheet.appendRow(['ФИО','Класс','SHA-256 кода','Активен','Дата выдачи','Дата отзыва']);
    sheet.setFrozenRows(1);
  }
  if(!book.getSheetByName(ECO_PASSPORT.deliveryTab)){
    const sheet=book.insertSheet(ECO_PASSPORT.deliveryTab);
    sheet.appendRow(['Время','ФИО','Класс','ОДНОРАЗОВАЯ ВЫДАЧА КОДА — удалить после передачи']);
    sheet.setFrozenRows(1);
  }
}

function adminIssueCode_() {
  // Execute ONLY from the editor. Set both properties; never put student names in repository source.
  const props=PropertiesService.getScriptProperties();
  const name=String(props.getProperty('PASSPORT_ISSUE_NAME')||'').trim();
  const cl=String(props.getProperty('PASSPORT_ISSUE_CLASS')||'').trim();
  if(name.length<3||!cl)throw new Error('Set PASSPORT_ISSUE_NAME and PASSPORT_ISSUE_CLASS in Script Properties.');
  if(/тест/i.test(name))throw new Error('Do not issue credentials for test identities.');
  const book=sourceWorkbook_();
  const contributions=book.getSheetByName(ECO_PASSPORT.contributionTab).getDataRange().getValues();
  if(!contributions.slice(1).some(row=>identityKey_(row[1],row[2])===identityKey_(name,cl))){
    throw new Error('Participant not found in contribution register; verify exact name and class.');
  }
  adminInitialize_();
  const lock=LockService.getScriptLock();lock.waitLock(30000);
  try {
    const tab=book.getSheetByName(ECO_PASSPORT.accessTab);
    const existing=tab.getDataRange().getValues();
    for(let i=existing.length-1;i>=1;i--){
      if(identityKey_(existing[i][0],existing[i][1])===identityKey_(name,cl)){
        tab.getRange(i+1,4,1,3).setValues([[false,existing[i][4]||'',new Date()]]);
      }
    }
    const code=(Utilities.getUuid()+Utilities.getUuid()).replace(/-/g,'').toLowerCase();
    tab.appendRow([name,cl,sha256_(code),true,new Date(),'']);
    book.getSheetByName(ECO_PASSPORT.deliveryTab).appendRow([new Date(),name,cl,code]);
    props.deleteProperty('PASSPORT_ISSUE_NAME');
    props.deleteProperty('PASSPORT_ISSUE_CLASS');
    return 'Issued: transfer the code privately from the issue sheet; then delete that plaintext row.';
  } finally {lock.releaseLock();}
}

function adminRevokeCode_() {
  const props=PropertiesService.getScriptProperties();
  const name=String(props.getProperty('PASSPORT_REVOKE_NAME')||'').trim();
  const cl=String(props.getProperty('PASSPORT_REVOKE_CLASS')||'').trim();
  if(!name||!cl)throw new Error('Set PASSPORT_REVOKE_NAME and PASSPORT_REVOKE_CLASS.');
  const tab=sourceWorkbook_().getSheetByName(ECO_PASSPORT.accessTab);
  if(!tab)throw new Error('Access sheet not initialized.');
  const rows=tab.getDataRange().getValues();let changed=0;
  for(let i=1;i<rows.length;i++){
    if(identityKey_(rows[i][0],rows[i][1])===identityKey_(name,cl)){
      tab.getRange(i+1,4,1,3).setValues([[false,rows[i][4]||'',new Date()]]);
      changed++;
    }
  }
  props.deleteProperty('PASSPORT_REVOKE_NAME');
  props.deleteProperty('PASSPORT_REVOKE_CLASS');
  return 'Revoked '+changed+' credential(s).';
}


// Editor-only, aggregate diagnostics. This function never returns student names.
function adminAudit_() {
  const source=sourceWorkbook_().getSheetByName(ECO_PASSPORT.contributionTab);
  if(!source)throw new Error('Contribution sheet missing.');
  const rows=source.getDataRange().getValues().slice(1);
  const stats={total:0,confirmed:0,rejectedOrUnconfirmed:0,testMarkedConfirmed:0,confirmedMissingRequestId:0,duplicateConfirmedRequestIds:0};
  const ids=new Set();
  rows.forEach(row=>{
    if(!row.some(v=>v!==''&&v!==null&&v!==undefined))return;
    stats.total++;
    if(!isConfirmed_(row[7])){stats.rejectedOrUnconfirmed++;return;}
    stats.confirmed++;
    if(/тест/i.test(String(row[1]||'')))stats.testMarkedConfirmed++;
    const requestId=String(row[8]||'').trim();
    if(!requestId)stats.confirmedMissingRequestId++;
    else if(ids.has(requestId))stats.duplicateConfirmedRequestIds++;
    else ids.add(requestId);
  });
  return stats;
}
