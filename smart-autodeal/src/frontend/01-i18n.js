/* ================= i18n ================= */
const T = {
  appSub:['गाडी विक्री व्यवस्थापन','Used car management'],
  nav_dashboard:['डॅशबोर्ड','Dashboard'], nav_cars:['गाड्या','Cars'], nav_leads:['ग्राहक','Customers'], nav_deals:['सौदे / पावती','Deals / Receipts'], nav_expenses:['खर्च','Expenses'],
  nav_deals_short:['पावती','Receipts'],
  loading:['डेटा लोड होत आहे…','Loading data…'],
  login_title:['लॉगिन करा','Sign in'], username:['युजरनेम','Username'], password:['पासवर्ड','Password'], login_btn:['लॉगिन','Sign in'],
  login_bad:['युजरनेम किंवा पासवर्ड चुकीचा आहे','Wrong username or password'], login_wait:['खूप वेळा चुकीचा पासवर्ड. १० मिनिटांनी पुन्हा प्रयत्न करा.','Too many attempts. Try again in 10 minutes.'],
  net_err:['सर्व्हरशी जोडणी झाली नाही. इंटरनेट तपासा.','Could not reach the server. Check your internet.'],
  offline:['ऑफलाइन','Offline'], logout:['लॉगआउट','Sign out'], settings:['सेटिंग','Settings'],
  hello:['नमस्कार','Hello'], install:['📲 ॲप इन्स्टॉल करा','📲 Install app'], add_exp:['+ खर्च','+ Expense'], new_receipt:['+ नवीन पावती','+ New receipt'],
  st_stock:['स्टॉकमधील गाड्या','Cars in stock'], st_invest:['{x} गुंतवणूक','{x} invested'],
  st_month_sales:['या महिन्याची विक्री','Sales this month'], st_turnover:['{x} व्यवहार','{x} turnover'],
  st_net:['या महिन्याचा निव्वळ नफा','Net profit this month'], st_net_note:['गाडी नफा {a} − दुकान खर्च {b}','Car profit {a} − shop expenses {b}'],
  st_fin:['फायनान्सकडून येणे','Due from finance'], st_fin_note:['{n} लोन फाईल','{n} loan files'], late_n:['{n} उशीर','{n} late'],
  st_cust:['ग्राहकांकडून येणे','Due from customers'], st_cust_note:['{n} सौदे','{n} deals'], overdue_n:['{n} मुदत संपली','{n} overdue'],
  p_followups:['आजचे फॉलो-अप','Today’s follow-ups'], all_customers:['सर्व ग्राहक','All customers'], no_followups:['आज कोणाला फोन करायचा बाकी नाही.','No calls due today.'],
  late:['उशीर','Late'], budget:['बजेट','Budget'], call:['कॉल','Call'], update:['अपडेट','Update'],
  p_chart:['मागील ६ महिन्यांचा निव्वळ नफा','Net profit, last 6 months'], cars_n:['{n} गाड्या','{n} cars'],
  p_fin:['फायनान्स / लोन येणे बाकी','Loan payments pending'], all_deals:['सर्व सौदे','All deals'], file:['फाईल','File'],
  days_late:['{n} दिवस उशीर','{n} days late'], expected:['अपेक्षित {d}','Expected {d}'], no_date:['तारीख नाही','No date'], no_fin:['कोणत्याही लोनची रक्कम बाकी नाही.','No loan payments pending.'],
  p_cust:['ग्राहकांकडून बाकी','Pending from customers'], receipt_no:['पावती {n}','Receipt {n}'], overdue_on:['मुदत संपली {d}','Overdue {d}'], no_due:['कोणतीही रक्कम बाकी नाही.','Nothing pending.'],
  p_old:['जुना स्टॉक (४५+ दिवस)','Old stock (45+ days)'], stock:['स्टॉक','Stock'], days_n:['{n} दिवस','{n} days'], no_old:['सर्व गाड्या ४५ दिवसांच्या आतल्या आहेत.','All cars are under 45 days in stock.'],
  cars_title:['गाड्या','Cars'], cars_sub:['{n} गाड्या स्टॉकमध्ये','{n} cars in stock'], add_car:['+ गाडी जोडा','+ Add car'], search_cars:['नंबर, कंपनी किंवा मॉडेल शोधा','Search number, make or model'],
  f_stock:['स्टॉक','In stock'], f_booked:['बुक','Booked'], f_sold:['विकली','Sold'], f_all:['सर्व','All'],
  no_number:['नंबर नाही','No number'], km:['किमी','km'], margin:['मार्जिन {x}','Margin {x}'], no_cars:['इथे कोणतीही गाडी नाही. वरच्या बटणाने नवीन गाडी जोडा.','No cars here. Add one with the button above.'],
  leads_title:['ग्राहक','Customers'], leads_sub:['गाडी घेण्यास इच्छुक लोक आणि फॉलो-अप','People interested in buying, and follow-ups'], add_lead:['+ ग्राहक जोडा','+ Add customer'], search_leads:['नाव, फोन किंवा गाडी शोधा','Search name, phone or car'],
  f_open:['चालू','Open'], f_lost:['गमावले','Lost'], no_car_chosen:['गाडी ठरली नाही','No car chosen'], followup_on:['फॉलो-अप {d}','Follow-up {d}'], receipt:['पावती','Receipt'], no_leads:['इथे कोणी नाही. नवीन ग्राहक जोडा.','Nobody here. Add a customer.'],
  deals_title:['सौदे / पावती','Deals / Receipts'], deals_sub:['डिलिव्हरी नोट, सही आणि बाकी रक्कम','Delivery notes, signatures and dues'], search_deals:['पावती क्र., नाव किंवा गाडी नंबर','Receipt no., name or car number'],
  f_due:['बाकी','Pending'], f_done:['पूर्ण','Complete'], due_x:['बाकी {x}','Due {x}'], loan_x:['लोन {x}','Loan {x}'], done:['पूर्ण','Complete'], profit_x:['नफा {x}','Profit {x}'], no_deals:['अजून पावती नाही. पहिली पावती बनवा.','No receipts yet. Create the first one.'],
  exp_title:['दुकान खर्च','Shop expenses'], exp_sub:['भाडे, पगार, बिल – हे निव्वळ नफ्यातून वजा होतात','Rent, salary, bills – deducted from net profit'], add_expense:['+ खर्च जोडा','+ Add expense'], month:['महिना','Month'],
  shop_exp:['दुकान खर्च','Shop expenses'], entries_n:['{n} नोंदी','{n} entries'], car_exp:['गाड्यांवरील खर्च','Spent on cars'], car_exp_note:['हा खर्च त्या-त्या गाडीच्या नफ्यात धरला आहे','Counted in each car’s profit'], by_type:['प्रकारानुसार','By type'], no_exp:['या महिन्यात खर्च नोंदवलेला नाही.','No expenses recorded this month.'],
  close:['बंद करा','Close'], cancel:['रद्द','Cancel'], delete:['हटवा','Delete'],
  car_info:['गाडी माहिती','Car details'], new_car:['नवीन गाडी','New car'], g_car:['गाडी','Car'], g_papers:['कागदपत्रे','Papers'], g_price:['किंमत','Price'],
  reg:['रजिस्टर नंबर','Registration no.'], company:['कंपनी','Make'], model:['मॉडेल','Model'], year:['वर्ष','Year'], color:['कलर','Colour'], fuel:['इंधन','Fuel'], km_run:['चाललेले किमी','Km driven'], owner_no:['कितवा मालक','Owner no.'],
  chassis:['चेसिस नंबर','Chassis no.'], engine:['इंजिन नंबर','Engine no.'], insurance_till:['इन्शुरन्स पर्यंत','Insurance valid till'], tax:['टॅक्स','Tax'], finance_on_car:['बँक लोन / फायनान्स','Bank loan / hypothecation'],
  buy_date:['खरेदी दिनांक','Purchase date'], buy_price:['खरेदी किंमत','Purchase price'], ask_price:['विक्री किंमत','Selling price'], status:['स्थिती','Status'], note:['नोंद','Note'],
  car_exp_title:['या गाडीवर केलेला खर्च','Money spent on this car'], exp_note_ph:['नोंद (उदा. गॅरेज)','Note (e.g. garage)'], amount:['रक्कम','Amount'], add:['+ जोडा','+ Add'], no_car_exp:['अजून खर्च जोडलेला नाही.','No expenses added yet.'],
  enter_exp_amt:['खर्चाची रक्कम भरा','Enter the expense amount'], car_calc:['खरेदी {a} + खर्च {b} = एकूण','Purchase {a} + expenses {b} = total'], exp_profit:['अपेक्षित नफा','Expected profit'],
  save_car:['गाडी सेव्ह करा','Save car'], confirm_del_car:['ही गाडी हटवायची?','Delete this car?'], need_reg_model:['रजिस्टर नंबर आणि मॉडेल भरा','Enter registration number and model'], car_saved:['गाडी सेव्ह झाली','Car saved'],
  cust_info:['ग्राहक माहिती','Customer details'], new_cust:['नवीन ग्राहक','New customer'], g_cust:['ग्राहक','Customer'], name:['नाव','Name'], phone:['फोन नंबर','Phone'], source:['कुठून आला','Source'],
  liked_car:['आवडलेली गाडी','Car of interest'], choose:['— निवडा —','— Choose —'], next_followup:['पुढचा फॉलो-अप','Next follow-up'], village:['गाव / पत्ता','Village / address'],
  make_receipt:['पावती बनवा','Create receipt'], save_cust:['ग्राहक सेव्ह करा','Save customer'], confirm_del_lead:['हा ग्राहक हटवायचा?','Delete this customer?'], need_name_phone:['नाव आणि फोन नंबर भरा','Enter name and phone'], cust_saved:['ग्राहक सेव्ह झाला','Customer saved'],
  edit_exp:['खर्च बदला','Edit expense'], new_exp:['नवीन दुकान खर्च','New shop expense'], g_exp:['खर्च','Expense'], type:['प्रकार','Type'], date:['दिनांक','Date'], save_exp:['खर्च सेव्ह करा','Save expense'],
  confirm_del_exp:['हा खर्च हटवायचा?','Delete this expense?'], need_amt:['रक्कम भरा','Enter the amount'], exp_saved:['खर्च सेव्ह झाला','Expense saved'],
  dn_title:['डिलिव्हरी नोट / पावती #{n}','Delivery note / Receipt #{n}'], g_buyer:['वाहन घेणार (खरेदीदार)','Buyer'], g_seller:['वाहन देणार (विक्रेता)','Seller'], age:['वय','Age'], occupation:['व्यवसाय','Occupation'], address:['पत्ता','Address'],
  g_vehicle:['वाहन','Vehicle'], from_stock:['स्टॉकमधील गाडी','Car from stock'], choose_stock:['— स्टॉकमधून निवडा —','— Choose from stock —'],
  g_deal:['व्यवहार','Deal'], time:['वेळ','Time'], place:['डिलिव्हरी व्यवहाराचे ठिकाण','Place of delivery'], deal_amt:['सौदा रक्कम','Deal amount'], cash_at:['ताब्यात घेतेवेळी रोख रक्कम','Cash paid at delivery'], due_date:['बाकी रक्कम देण्याचा दिनांक','Balance due date'],
  cheque_no:['सिक्युरिटी चेक नं.','Security cheque no.'], cheque_amt:['चेक रक्कम','Cheque amount'],
  g_fin:['फायनान्स / लोन (असल्यास)','Finance / loan (if any)'], fin_bank:['बँक / फायनान्स कंपनी','Bank / finance company'], fin_file:['लोन / फाईल नंबर','Loan / file no.'], fin_amt:['लोन रक्कम (बँकेकडून येणार)','Loan amount (paid by bank)'], fin_exp:['रक्कम येण्याची अपेक्षित तारीख','Expected payout date'],
  g_witness:['साक्षीदार','Witnesses'], witness1:['साक्षीदार १','Witness 1'], witness2:['साक्षीदार २','Witness 2'], mobile:['मोबाईल','Mobile'],
  g_photo:['ग्राहकाचा फोटो','Customer photo'], take_photo:['📷 फोटो काढा','📷 Take photo'], remove_photo:['फोटो हटवा','Remove photo'], no_photo:['फोटो नाही','No photo'],
  g_sign:['सही','Signatures'], sign_help:['स्क्रीनवर बोटाने सही करा, किंवा कागदावर सही घेऊन "📷 सहीचा फोटो" दाबा. फोटोमधून सही आपोआप स्वच्छ करून कापली जाते.','Sign on screen with a finger, or sign on paper and tap "📷 Photo of signature". The signature is cleaned and cropped automatically.'],
  sign_buyer:['घेणाराची सही / अंगठा','Buyer’s signature / thumb'], sign_seller:['देणाराची सही','Seller’s signature'], sign_photo:['📷 सहीचा फोटो','📷 Photo of signature'], erase:['पुसा','Clear'],
  save_receipt:['पावती सेव्ह करा','Save receipt'], need_buyer_amt:['खरेदीदाराचे नाव आणि सौदा रक्कम भरा','Enter buyer name and deal amount'], receipt_saved:['पावती सेव्ह झाली','Receipt saved'],
  calc_deal:['सौदा','Deal'], calc_cash:['रोख','Paid'], calc_loan:['लोन','Loan'], calc_cust_due:['ग्राहकाकडून बाकी','Due from customer'], in_words:['अक्षरी','In words'], due_in_words:['बाकी अक्षरी','Balance in words'],
  photo_err:['फोटो उघडता आला नाही','Could not open the photo'], no_sign_found:['फोटोमध्ये सही दिसली नाही, पुन्हा काढा','No signature found in the photo, try again'], sign_added:['सही जोडली','Signature added'],
  receipt_t:['पावती #{n}','Receipt #{n}'], buyer:['खरेदीदार','Buyer'], car:['गाडी','Car'], number:['नंबर','Number'], received:['मिळालेली रक्कम','Received'], cust_due:['ग्राहकाकडून बाकी','Due from customer'], profit:['नफा','Profit'],
  instalments:['मिळालेले हप्ते','Payments received'], g_loan:['फायनान्स / लोन','Finance / loan'], bank:['बँक','Bank'], loan_amt:['लोन रक्कम','Loan amount'], received_on:['मिळाली {d}','Received {d}'], pending:['बाकी','Pending'],
  loan_recv_date:['रक्कम मिळाल्याचा दिनांक','Date received'], loan_received:['लोन रक्कम मिळाली','Loan amount received'], loan_saved:['लोन रक्कम जमा झाली','Loan payment recorded'],
  collect_due:['बाकी रक्कम जमा करा','Record a payment'], pay_note_ph:['रोख / UPI / चेक','Cash / UPI / cheque'], collect:['जमा करा','Record'], pay_saved:['रक्कम जमा झाली','Payment recorded'],
  confirm_del_deal:['ही पावती हटवायची?','Delete this receipt?'], send_wa:['WhatsApp पाठवा','Send on WhatsApp'], edit:['बदला','Edit'], print:['प्रिंट / PDF','Print / PDF'], print_err:['प्रिंट उघडता आला नाही','Could not open print'],
  wa_hello:['नमस्कार','Hello'], wa_deal:['सौदा रक्कम','Deal amount'], wa_recv:['मिळालेली रक्कम','Received'], wa_due:['बाकी रक्कम','Balance'], wa_till:['पर्यंत','by'], wa_full:['पूर्ण रक्कम मिळाली. धन्यवाद!','Paid in full. Thank you!'],
  set_title:['सेटिंग','Settings'], language:['भाषा','Language'], g_shop:['पावतीवर छापली जाणारी माहिती','Details printed on receipts'], shop_name:['दुकानाचे नाव','Shop name'], proprietor:['प्रोप्रायटर नाव','Proprietor name'], first_receipt:['पहिला पावती क्र.','First receipt no.'],
  save_info:['माहिती सेव्ह करा','Save details'], info_saved:['माहिती सेव्ह झाली','Details saved'],
  g_backup:['बॅकअप','Backup'], backup_help:['सर्व डेटा सर्व्हरवर सुरक्षित आहे. तरीही महिन्यातून एकदा बॅकअप फाईल डाउनलोड करून ठेवा. जुन्या ऑफलाइन ॲपचा बॅकअपही इथे इम्पोर्ट करता येतो.','All data is kept on the server. Still, download a backup file once a month. Backups from the old offline app can be imported here too.'],
  backup_dl:['बॅकअप डाउनलोड करा','Download backup'], backup_imp:['बॅकअप इम्पोर्ट करा','Import backup'], backup_done:['बॅकअप फाईल डाउनलोड झाली','Backup downloaded'],
  imp_confirm:['बॅकअपमधील नोंदी सर्व्हरवर जोडल्या जातील (सारख्या नोंदी बदलल्या जातील). पुढे जायचे?','Records from the backup will be added to the server (matching ones replaced). Continue?'], imp_done:['{n} नोंदी इम्पोर्ट झाल्या','{n} records imported'], imp_bad:['ही बॅकअप फाईल वापरता येत नाही','This backup file can’t be used'],
  g_users:['कर्मचारी व लॉगिन','Staff & logins'], manage_users:['कर्मचारी व्यवस्थापन','Manage staff'], g_mypass:['माझा पासवर्ड बदला','Change my password'], old_pass:['जुना पासवर्ड','Current password'], new_pass:['नवा पासवर्ड (६+ अक्षरे)','New password (6+ characters)'], change_pass:['पासवर्ड बदला','Change password'],
  pass_changed:['पासवर्ड बदलला','Password changed'], pass_short:['पासवर्ड किमान ६ अक्षरांचा हवा','Password must be at least 6 characters'], pass_old_bad:['जुना पासवर्ड चुकीचा आहे','Current password is wrong'],
  users_title:['कर्मचारी व्यवस्थापन','Manage staff'], role:['भूमिका','Role'], active:['चालू','Active'], disabled:['बंद','Disabled'], disable:['बंद करा','Disable'], enable:['चालू करा','Enable'], reset_pass:['पासवर्ड रीसेट','Reset password'],
  new_pass_for:['{n} साठी नवा पासवर्ड (६+ अक्षरे):','New password for {n} (6+ characters):'], g_new_user:['नवीन लॉगिन बनवा','Create a login'], create_user:['लॉगिन बनवा','Create login'],
  user_created:['लॉगिन तयार झाले','Login created'], user_exists:['हे युजरनेम आधीच आहे','That username is taken'], user_fields:['नाव, युजरनेम (३+ इंग्रजी अक्षरे) आणि ६+ अक्षरी पासवर्ड भरा','Enter name, username (3+ English letters) and a 6+ character password'], self_err:['स्वतःचे खाते बंद करता येत नाही','You can’t disable your own account'],
  saved:['सेव्ह झाले','Saved'], save_err:['सेव्ह झाले नाही. इंटरनेट तपासा.','Not saved. Check your internet.'], admin_only:['हे फक्त मालक करू शकतात','Only the owner can do this'], del_err:['हटवता आले नाही','Could not delete'],
  staff_note:['तुम्ही कर्मचारी म्हणून लॉगिन आहात. नफा आणि दुकान खर्च फक्त मालकाला दिसतात.','You are signed in as staff. Profit and shop expenses are visible only to the owner.'],
};
let L = 'en';
try { if (localStorage.getItem('scrm-lang') === 'mr') L = 'mr'; } catch (e) {}
const tEn = (k, p) => { const keep = L; L = 'en'; const s = t(k, p); L = keep; return s; };
const t = (k, p) => { let s = (T[k] || [k, k])[L === 'en' ? 1 : 0]; if (p) for (const [a, b] of Object.entries(p)) s = s.split('{' + a + '}').join(b); return s; };
const loc = () => (L === 'en' ? 'en-IN' : 'mr-IN');
function setLang(l) { L = l; try { localStorage.setItem('scrm-lang', l); } catch (e) {} document.documentElement.lang = l === 'en' ? 'en' : 'mr'; document.title = (S.shop.name ? S.shop.name + ' – ' : '') + BRAND; if (pubActive) { if (PUB) pubRefresh(); return; } if (me) { render(); if ($('#overlay').classList.contains('open')) closeSheet(); } else renderLogin(); }

const OPT = {
  fuel: { petrol:['पेट्रोल','Petrol'], diesel:['डिझेल','Diesel'], cng:['CNG','CNG'], ev:['इलेक्ट्रिक','Electric'] },
  source: { walkin:['शोरूम भेट','Walk-in'], olx:['OLX','OLX'], facebook:['फेसबुक','Facebook'], instagram:['इंस्टाग्राम','Instagram'], referral:['ओळखीतून','Referral'], old:['जुना ग्राहक','Old customer'], other:['इतर','Other'] },
  leadSt: { new:['नवीन','New'], follow:['फॉलो-अप','Follow-up'], test:['टेस्ट ड्राइव्ह','Test drive'], booked:['बुकिंग','Booked'], lost:['गमावला','Lost'] },
  carSt: { stock:['स्टॉक','In stock'], booked:['बुक','Booked'], sold:['विकली','Sold'] },
  carExp: { repair:['दुरुस्ती','Repair'], denting:['डेंटिंग-पेंटिंग','Denting-painting'], tyre:['टायर / बॅटरी','Tyre / battery'], service:['सर्व्हिस','Service'], rto:['RTO / ट्रान्सफर','RTO / transfer'], commission:['कमिशन / दलाली','Commission'], polish:['धुलाई / पॉलिश','Wash / polish'], transport:['वाहतूक','Transport'], other:['इतर','Other'] },
  shopExp: { rent:['दुकान भाडे','Shop rent'], salary:['पगार','Salary'], electricity:['लाईट बिल','Electricity bill'], phone:['फोन / इंटरनेट','Phone / internet'], ads:['जाहिरात (OLX, फेसबुक)','Ads (OLX, Facebook)'], tea:['चहा-पाणी','Tea / snacks'], fuel:['पेट्रोल / प्रवास','Fuel / travel'], interest:['बँक व्याज','Bank interest'], other:['इतर','Other'] },
  role: { admin:['मालक','Owner'], staff:['कर्मचारी','Staff'] },
};
const ol = (g, v) => { const o = OPT[g][v]; return o ? o[L === 'en' ? 1 : 0] : (v || ''); };
const opts = g => Object.keys(OPT[g]).map(k => [k, ol(g, k)]);
const CAR_TAG = { stock:'', booked:'amber', sold:'green' };
const LEAD_TAG = { new:'', follow:'amber', test:'amber', booked:'green', lost:'red' };

/* ================= helpers ================= */
const $ = s => document.querySelector(s);
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const num = v => { const n = parseFloat(String(v ?? '').replace(/,/g, '')); return isFinite(n) ? n : 0; };
const rs = n => '₹' + Math.round(num(n)).toLocaleString('en-IN');
const today = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);
const fmtDate = s => s ? new Date(s).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—';
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const getP = (o, p) => p.split('.').reduce((a, k) => a == null ? undefined : a[k], o);
const setP = (o, p, v) => { const ks = p.split('.'); let c = o; ks.slice(0, -1).forEach(k => { if (typeof c[k] !== 'object' || c[k] === null) c[k] = {}; c = c[k]; }); c[ks[ks.length - 1]] = v; };
const clone = o => JSON.parse(JSON.stringify(o));
const waNum = p => String(p || '').replace(/\D/g, '').slice(-10);
function toast(msg) { const el = $('#toast'); el.textContent = msg; el.style.display = 'block'; clearTimeout(toast._t); toast._t = setTimeout(() => el.style.display = 'none', 2600); }

const MR = 'शून्य एक दोन तीन चार पाच सहा सात आठ नऊ दहा अकरा बारा तेरा चौदा पंधरा सोळा सतरा अठरा एकोणीस वीस एकवीस बावीस तेवीस चोवीस पंचवीस सव्वीस सत्तावीस अठ्ठावीस एकोणतीस तीस एकतीस बत्तीस तेहेतीस चौतीस पस्तीस छत्तीस सदतीस अडतीस एकोणचाळीस चाळीस एक्केचाळीस बेचाळीस त्रेचाळीस चव्वेचाळीस पंचेचाळीस सेहेचाळीस सत्तेचाळीस अठ्ठेचाळीस एकोणपन्नास पन्नास एक्कावन्न बावन्न त्रेपन्न चोपन्न पंचावन्न छप्पन्न सत्तावन्न अठ्ठावन्न एकोणसाठ साठ एकसष्ठ बासष्ठ त्रेसष्ठ चौसष्ठ पासष्ठ सहासष्ठ सदुसष्ठ अडुसष्ठ एकोणसत्तर सत्तर एकाहत्तर बाहत्तर त्र्याहत्तर चौऱ्याहत्तर पंच्याहत्तर शहात्तर सत्याहत्तर अठ्ठ्याहत्तर एकोणऐंशी ऐंशी एक्याऐंशी ब्याऐंशी त्र्याऐंशी चौऱ्याऐंशी पंच्याऐंशी शहाऐंशी सत्त्याऐंशी अठ्ठ्याऐंशी एकोणनव्वद नव्वद एक्याण्णव ब्याण्णव त्र्याण्णव चौऱ्याण्णव पंच्याण्णव शहाण्णव सत्त्याण्णव अठ्ठ्याण्णव नव्याण्णव'.split(' ');
function mrWords(n) {
  n = Math.floor(num(n)); if (!n) return '';
  const out = []; const cr = Math.floor(n / 1e7); n %= 1e7; const lk = Math.floor(n / 1e5); n %= 1e5; const th = Math.floor(n / 1e3); n %= 1e3; const hu = Math.floor(n / 100); const r = n % 100;
  if (cr) out.push(mrWords(cr).replace(' रुपये फक्त', '') + ' कोटी');
  if (lk) out.push(MR[lk] + ' लाख'); if (th) out.push(MR[th] + ' हजार');
  if (hu) out.push(hu === 1 ? (r ? 'एकशे' : 'शंभर') : MR[hu] + 'शे'); if (r) out.push(MR[r]);
  return out.join(' ') + ' रुपये फक्त';
}
const ONES = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['','','twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];
const en99 = n => n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? '-' + ONES[n % 10] : '');
function enWords(n) {
  n = Math.floor(num(n)); if (!n) return '';
  const p = []; const cr = Math.floor(n / 1e7); n %= 1e7; const lk = Math.floor(n / 1e5); n %= 1e5; const th = Math.floor(n / 1e3); n %= 1e3; const hu = Math.floor(n / 100); const r = n % 100;
  if (cr) p.push(enWords(cr).replace(' rupees only', '').toLowerCase() + ' crore');
  if (lk) p.push(en99(lk) + ' lakh'); if (th) p.push(en99(th) + ' thousand'); if (hu) p.push(ONES[hu] + ' hundred'); if (r) p.push((p.length ? 'and ' : '') + en99(r));
  const s = p.join(' ') + ' rupees only'; return s.charAt(0).toUpperCase() + s.slice(1);
}
const words = n => (L === 'en' ? enWords(n) : mrWords(n));

/* ================= data + server ================= */
const BRAND = 'Smart AutoDeal';
const DEFAULT_SHOP = { id:'shop', name:'', owner:'', phone:'', address:'', firstReceipt:1 };
const S = { cars:[], leads:[], deals:[], expenses:[], shop:{ ...DEFAULT_SHOP } };
let me = null, lastSync = 0, isOnline = true, loaded = false;
const isAdmin = () => me && me.role === 'admin';

async function api(method, url, body) {
  let r;
  try { r = await fetch(url, { method, credentials:'same-origin', headers: body ? { 'Content-Type':'application/json' } : {}, body: body ? JSON.stringify(body) : undefined }); }
  catch (e) { setOnline(false); throw { code:0 }; }
  setOnline(true);
  if (r.status === 401 && !url.endsWith('/api/login') && !url.endsWith('/api/me/password')) { me = null; showLogin(); throw { code:401 }; }
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw { code:r.status, ...j };
  return j;
}
function setOnline(v) { if (isOnline !== v) { isOnline = v; if (me && loaded) render(); } }
function applyRows(rows) {
  rows.forEach(({ col, id, data, deleted }) => {
    if (col === 'settings') { if (id === 'shop' && !deleted) S.shop = { ...DEFAULT_SHOP, ...data, id:'shop' }; return; }
    if (!S[col]) return;
    const i = S[col].findIndex(x => x.id === id);
    if (deleted) { if (i >= 0) S[col].splice(i, 1); }
    else { const o = { ...data, id }; if (i >= 0) S[col][i] = o; else S[col].push(o); }
  });
}
async function sync(full) {
  try {
    const j = await api('GET', '/api/data' + (full ? '' : '?since=' + Math.max(0, lastSync - 3000)));
    if (full) { S.cars = []; S.leads = []; S.deals = []; S.expenses = []; S.chats = []; S.broadcasts = []; S.shop = { ...DEFAULT_SHOP }; }
    applyRows(j.rows); lastSync = j.now; loaded = true;
        const ae = document.activeElement; const typing = ae && ae.closest && ae.closest('#main') && /INPUT|TEXTAREA|SELECT/.test(ae.tagName);
    if (full || (j.rows.length && !typing)) render();
  } catch (e) {}
}
setInterval(() => { if (me && document.visibilityState === 'visible') sync(false); }, 20000);
document.addEventListener('visibilitychange', () => { if (me && document.visibilityState === 'visible') sync(false); });

async function save(col, obj) {
  const clean = clone(obj);
  try { await api('PUT', `/api/docs/${col}/${encodeURIComponent(clean.id)}`, { data: clean }); }
  catch (e) { if (e.code === 402) toast(t('t_exp_short')); else if (e.code === 403 && e.error === 'limit') toast(t('t_limit')); else if (e.code === 403) toast(t('admin_only')); else if (e.code !== 401) toast(t('save_err')); return false; }
  if (col === 'settings') S.shop = { ...DEFAULT_SHOP, ...clean };
  else { const list = S[col]; const i = list.findIndex(x => x.id === clean.id); if (i >= 0) list[i] = clean; else list.push(clean); }
  render(); return true;
}
async function removeDoc(col, id) {
  try { await api('DELETE', `/api/docs/${col}/${encodeURIComponent(id)}`); }
  catch (e) { toast(e.code === 402 ? t('t_exp_short') : e.code === 403 ? t('admin_only') : t('del_err')); return; }
  S[col] = S[col].filter(x => x.id !== id); render();
}

