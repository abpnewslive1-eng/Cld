/* ================= free: read the RC card itself (no API key, nothing leaves the phone) =================
   The seller hands over the RC anyway. A photo of the RC smart card (both sides) or a screenshot of the
   DigiLocker / mParivahan RC is read on the phone with the same OCR as the plate scan, and the labelled fields
   (owner, maker, model, colour, fuel, chassis, engine, dates, owner serial, financier) fill the car form. */
Object.assign(T, {
  rc_card_scan:['📄 RC स्कॅन करा (मोफत)','📄 Scan RC (free)'],
  rc_card_reading:['RC वाचत आहे…','Reading the RC…'],
  rc_card_ok:['RC मधून {n} माहिती भरली – एकदा तपासा','Filled {n} details from the RC – please check them'],
  rc_card_fail:['RC वाचता आली नाही – उजेडात, सरळ फोटो घ्या','Couldn’t read the RC – take a straight photo in good light'],
  rc_card_tip:['RC कार्डच्या दोन्ही बाजूंचे फोटो किंवा DigiLocker / mParivahan RC चा स्क्रीनशॉट निवडा.','Pick photos of both sides of the RC card, or a screenshot of the DigiLocker / mParivahan RC.'],
});

// label patterns, most specific first (a line can hold two fields: smart cards print two columns)
const RC_FIELDS = [
  ['ownerNo', /owner\s*(?:sr|serial|s\.?\s*no)\.?\s*(?:no\.?|number)?/i],
  ['makerModel', /maker\s*[/&]\s*model(?:\s*name)?/i],
  ['mfg', /(?:month\s*[-/]?\s*y(?:ea)?r\.?\s*of\s*(?:mfg|manufacture)|mfg\.?\s*(?:month|date|yr|year)|(?:date|year|month)\s*of\s*(?:mfg|manufacture))/i],
  ['regDate', /(?:date\s*of\s*reg(?:istration|n)?\.?|reg(?:istration|n)?\.?\s*date)/i],
  ['insurance', /insurance\s*(?:upto|valid(?:ity)?(?:\s*upto)?|expiry)/i],
  ['finance', /(?:financ(?:i|e)er(?:'s)?(?:\s*name)?|hypothecat\w*(?:\s*(?:to|with))?|h\.?\s*p\.?\s*with)/i],
  ['owner', /owner'?s?\s*name/i],
  ['company', /(?:maker'?s?(?:\s*name|\s*desc(?:ription)?)?|manufacturer(?:'s)?(?:\s*name)?)/i],
  ['model', /model(?:\s*name)?/i],
  ['color', /colou?r/i],
  ['fuel', /fuel(?:\s*(?:type|used))?/i],
  ['chassis', /chas+is\s*(?:no\.?|number)?/i],
  ['engine', /(?:engine\s*(?:\/\s*motor\s*)?(?:no\.?|number)|motor\s*(?:no\.?|number)|engine)/i],
  ['vehicleClass', /(?:vehicle\s*class|class\s*of\s*vehicle)/i],
  ['rto', /(?:registering\s*authority|registered\s*at)/i],
  ['regNo', /(?:reg(?:istration|n)?\.?\s*(?:no\.?|number)|vehicle\s*(?:no\.?|number))/i],
  ['ignore', /(?:reg(?:istration|n)?\.?\s*validity|valid\s*upto|fitness\s*upto|tax\s*upto|address|son\s*\/?\s*daughter|s\/?w\/?d\s*of|emission|body\s*type|seating|cubic|unladen|wheel\s*base|no\.?\s*of\s*cyl)/i],
];
const rcIsoDate = v => { const s = String(v || ''); let m = s.match(/(\d{4})-(\d{2})-(\d{2})/); if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = s.match(/(\d{1,2})[-/. ]+(\d{1,2}|[A-Za-z]{3})[a-z]*[-/. ]+(\d{4})/); if (!m) return '';
  const mon = /\d/.test(m[2]) ? Number(m[2]) : ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'].indexOf(m[2].toLowerCase()) + 1;
  return mon >= 1 && mon <= 12 ? `${m[3]}-${String(mon).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}` : ''; };
// Turns OCR text of an RC into the same shape the RC API returns (so rcApply() can fill the form). Empty fields = not found.
function rcFromText(text) {
  // keep runs of spaces: a label only counts at the start of a line or after a wide gap (the next column), not inside a value
  const lines = String(text || '').split(/\n+/).map(l => l.replace(/[|“”"]/g, ' ').replace(/\t/g, '   ').trim()).filter(Boolean);
  const got = {};
  const hits = lines.map(line => {
    const all = [];
    for (const [k, re] of RC_FIELDS) { const g = new RegExp(re.source, 'gi'); let m; while ((m = g.exec(line))) { if (m[0].trim() && (m.index === 0 || /\s{2,}$|[:;]\s*$/.test(line.slice(0, m.index)))) all.push({ k, at: m.index, end: m.index + m[0].length }); if (!m[0]) g.lastIndex++; } }
    all.sort((a, b) => a.at - b.at || (b.end - b.at) - (a.end - a.at));
    const keep = []; for (const h of all) if (!keep.length || h.at >= keep[keep.length - 1].end) keep.push(h);
    return keep;
  });
  lines.forEach((line, i) => hits[i].forEach((h, j) => {
    let v = line.slice(h.end, j + 1 < hits[i].length ? hits[i][j + 1].at : undefined).replace(/^[\s:;.\-–=>]+/, '').replace(/\s+/g, ' ').trim();
    if (!v && j === hits[i].length - 1 && lines[i + 1] && !hits[i + 1].length) v = lines[i + 1].replace(/\s+/g, ' ');
    if (v && h.k !== 'ignore' && !got[h.k]) got[h.k] = v;
  }));
  const none = v => !v || /^(n\.?\s*a\.?|nil|none|not\s*applicable|-+)$/i.test(v.trim());
  const word = v => (v || '').replace(/[^A-Za-z0-9&./ ()-]/g, ' ').replace(/\s+/g, ' ').trim();
  if (got.makerModel) { const [mk, ...md] = got.makerModel.split('/'); got.company = got.company || mk; got.model = got.model || md.join('/'); }
  const fuelRaw = (got.fuel || '').toLowerCase();
  const fuel = /electric|battery|\bev\b/.test(fuelRaw) ? 'ev' : /cng|lpg/.test(fuelRaw) ? 'cng' : /diesel/.test(fuelRaw) ? 'diesel' : /petrol/.test(fuelRaw) ? 'petrol' : '';
  const regDate = rcIsoDate(got.regDate);
  const year = ((got.mfg || '').match(/(19|20)\d{2}/) || [])[0] || (regDate ? regDate.slice(0, 4) : '');
  const vin = (got.chassis || '').toUpperCase().replace(/[^A-Z0-9*]/g, '');
  return {
    reg: plateFromText(got.regNo || '') || plateFromText(text), company: word(got.company), model: word(got.model), year,
    color: word((got.color || '').split(/\s{2,}/)[0]), fuel, ownerNo: Number(((got.ownerNo || '').match(/\d+/) || [])[0]) || '',
    owner: word(got.owner), chassis: vin.length >= 6 ? vin : '', engine: (got.engine || '').toUpperCase().replace(/[^A-Z0-9*]/g, '').slice(0, 20),
    insurance: rcIsoDate(got.insurance), tax: '', finance: none(got.finance) ? '' : word(got.finance), regDate,
    rto: word(got.rto), vehicleClass: word(got.vehicleClass), blacklisted: false,
  };
}
async function readRcText(files) {
  if (window.RC_OCR) return window.RC_OCR(files); // tests / demo hook
  const Tess = await loadTess();
  const worker = await Tess.createWorker('eng', 1, { workerPath: OCR.workerPath, corePath: OCR.corePath, langPath: OCR.langPath, gzip: true });
  try {
    await worker.setParameters({ tessedit_pageseg_mode: '4', preserve_interword_spaces: '1' });
    let text = '';
    for (const f of files) { const img = await loadImg(f); try { const { data } = await worker.recognize(prepPlate(img, 0)); text += '\n' + data.text; } finally { URL.revokeObjectURL(img.src); } }
    return text;
  } finally { worker.terminate(); }
}
async function rcCardScan(inp) {
  const files = [...(inp.files || [])].slice(0, 4); inp.value = ''; if (!files.length) return;
  const st = $('#rcStatus'), keep = st ? st.textContent : ''; if (st) st.textContent = t('rc_card_reading');
  let rc = null; try { rc = rcFromText(await readRcText(files)); } catch (e) {}
  if (st) st.textContent = keep;
  const n = rc ? ['reg', 'company', 'model', 'year', 'color', 'fuel', 'ownerNo', 'owner', 'chassis', 'engine', 'insurance', 'finance'].filter(k => rc[k]).length : 0;
  if (!n) { toast(t('rc_card_fail')); return; }
  if (rc.reg) { const reg = $('#f_reg'); if (reg && (!reg.value.trim() || carDraft._new)) reg.value = rc.reg; }
  rcApply(rc); toast(t('rc_card_ok', { n }));
}
