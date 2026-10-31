/** EcoPassport 5.5 — pupil-facing read-only server.
 * Hosted in EXISTING student Apps Script. Do not insert owner administration code.
 * Old legacy credentials (no expiry / no stable ID) continue working during migration.
 * New credentials require both participant ID and non-expired timestamp.
 * Real personal data never goes to GitHub Pages.
 */
const ECO_PASSPORT = Object.freeze({
  spreadsheetProperty: 'ECO_SOURCE_SPREADSHEET_ID',
  contributionTab: 'Вклад',
  accessTab: 'Паспорт — доступ',
  deliveryTab: 'Паспорт — выдача',
  maxHistory: 100,
  participantTab: 'Паспорт — участники'
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
  const now = Date.now();
  for (let i = 1; i < records.length; i++) {
    const row = records[i];
    if (String(row[2] || '').toLowerCase() !== fingerprint || row[3] !== true) continue;
    // G: expiration. Empty G only applies to pre-5.5 legacy credentials.
    const rawExpiry = row[6];
    if (rawExpiry !== '' && rawExpiry != null) {
      const expiry = rawExpiry instanceof Date ? rawExpiry.getTime() : new Date(rawExpiry).getTime();
      if (!Number.isFinite(expiry) || now >= expiry) continue;
    }
    authorised = {
      name: String(row[0]||''),
      className: String(row[1]||''),
      participantId: String(row[7]||'').trim(),
      legacy: rawExpiry === '' || rawExpiry == null
    };
    break;
  }
  if (!authorised) throw new Error('ACCESS_DENIED');
  if (authorised.participantId) {
    const roster = book.getSheetByName(ECO_PASSPORT.participantTab);
    if (!roster) throw new Error('ACCESS_DENIED');
    const matches = roster.getDataRange().getValues().slice(1)
      .filter(r => String(r[0]||'').trim() === authorised.participantId && r[4] !== false);
    if (matches.length !== 1) throw new Error('ACCESS_DENIED');
    authorised.name = String(matches[0][1]||'').trim();
    authorised.className = String(matches[0][2]||'').trim();
  }

  const sheet = book.getSheetByName(ECO_PASSPORT.contributionTab);
  if (!sheet) throw new Error('DATA_UNAVAILABLE');
  const rows = sheet.getDataRange().getValues();
  const key = identityKey_(authorised.name, authorised.className);
  const history = [];
  const uniqueRequestIds = new Set();
  let paperKg = 0, capsCount = 0;
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (authorised.participantId) {
      if (String(row[12]||'').trim() !== authorised.participantId) continue;
    } else if (identityKey_(row[1],row[2]) !== key) continue;
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
    participantRef: authorised.participantId ? 'ECO-'+authorised.participantId.slice(0,8).toUpperCase() : null,
    legacyAccess: authorised.legacy,
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
