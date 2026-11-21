/* ================= receipt format settings (per dealer) ================= */
Object.assign(T, {
  brand_tag:['डीलरचा डिजिटल मुनीम','Your dealership’s digital munim'],
  g_rcpt:['पावती फॉरमॅट','Receipt format'], g_rcpt_sub:['तुमच्या कागदी पावतीप्रमाणे शीर्षक, नियम-अटी आणि रंग बदला. नियमात {cheque}, {chequeAmt}, {reg} लिहिल्यास तिथे चेक नंबर, चेक रक्कम आणि गाडी नंबर आपोआप भरले जातात.','Match your paper receipt: title, terms and colour. In terms, {cheque}, {chequeAmt} and {reg} are filled with cheque no., cheque amount and car number.'],
  r_title:['पावतीचे शीर्षक','Receipt title'], r_terms:['नियम व अटी (एका ओळीत एक)','Terms (one per line)'], r_banner:['खालची ओळ','Bottom line'], r_color:['छपाईचा रंग','Print colour'],
  r_default:['मूळ नियम परत आणा','Restore default terms'], r_test:['शेवटची पावती प्रिंट करून पहा','Test-print the last receipt'], r_none:['अजून पावती नाही','No receipts yet'],
  pc_red:['लाल','Red'], pc_blue:['निळा','Blue'], pc_green:['हिरवा','Green'], pc_black:['काळा','Black'], pc_purple:['जांभळा','Purple'],
});
function rcptSettings() {
  const R = rcpt();
  return `<div class="card wide"><h2>${t('g_rcpt')}</h2><p class="sub">${t('g_rcpt_sub')}</p>
    <div class="fields"><div class="f"><label for="rc_t">${t('r_title')}</label><input id="rc_t" value="${esc(R.title)}"></div>
    <div class="f"><label for="rc_c">${t('r_color')}</label><select id="rc_c">${Object.keys(PRINT_COLORS).map(k => `<option value="${k}" ${(S.shop.printColor || 'red') === k ? 'selected' : ''}>${t('pc_' + k)}</option>`).join('')}</select></div>
    <div class="f full"><label for="rc_terms">${t('r_terms')}</label><textarea id="rc_terms" rows="9">${esc(R.terms.join('\n'))}</textarea></div>
    <div class="f full"><label for="rc_b">${t('r_banner')}</label><input id="rc_b" value="${esc(R.banner)}"></div></div>
    <div class="sheet-foot"><button class="btn grow" onclick="document.querySelector('#rc_terms').value=DEFAULT_TERMS.join('\\n')">${t('r_default')}</button>
      <button class="btn" onclick="testPrint()">${t('r_test')}</button><button class="btn primary" onclick="saveRcpt()">${t('save_info')}</button></div></div>`;
}
async function saveRcpt() {
  const terms = $('#rc_terms').value.split('\n').map(x => x.trim()).filter(Boolean);
  const o = { ...clone(S.shop), id: 'shop', printTitle: $('#rc_t').value.trim(), printColor: $('#rc_c').value, printBanner: $('#rc_b').value.trim(), terms: terms.join('|') === DEFAULT_TERMS.join('|') ? [] : terms };
  if (await save('settings', o)) toast(t('info_saved'));
}
function testPrint() { const d = S.deals.slice().sort((a, b) => num(b.receiptNo) - num(a.receiptNo))[0]; if (!d) { toast(t('r_none')); return; } printDeal(d.id); }

Object.assign(T, { pub_off:['हा कॅटलॉग सध्या उपलब्ध नाही.','This catalogue isn’t available right now.'], support_ph:['सपोर्ट नंबर (डीलरना दिसेल)','Support number (shown to dealers)'], support_ph_sub:['ट्रायल संपताना आणि प्लॅन संपल्यावर डीलरला हा नंबर दाखवला जातो.','Dealers see this number when their trial or plan ends.'] });
async function saSupport() { try { await api('PUT', '/api/sa/platform', { supportPhone: $('#spPh').value.trim() }); await loadSA(); toast(t('saved_ok')); } catch (e) { toast(t('save_err')); } }

boot();
