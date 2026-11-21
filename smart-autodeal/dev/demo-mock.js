
(function(){
  window.DEMO = true; window.DEMO_PHOTOS = {};
  const PAL = [['#3D3BF3','#8EA2FF'],['#0E9F6E','#7FE0B8'],['#E8590C','#FFC08A'],['#7C3AED','#C4A7FF'],['#334155','#94A3B8']];
  const fakePhoto = (label, i, angle) => { const [a,b] = PAL[i % PAL.length];
    const body = angle === 0
      ? '<path d="M120 300 L180 215 Q200 190 240 188 L420 188 Q455 190 480 215 L560 300 Z" fill="#fff" opacity=".95"/><rect x="80" y="290" width="520" height="80" rx="30" fill="#fff"/><circle cx="190" cy="372" r="42" fill="#1f2937"/><circle cx="190" cy="372" r="18" fill="#cbd5e1"/><circle cx="490" cy="372" r="42" fill="#1f2937"/><circle cx="490" cy="372" r="18" fill="#cbd5e1"/><path d="M205 290 L240 222 L330 222 L330 290 Z M350 290 L350 222 L430 222 L475 290 Z" fill="'+a+'" opacity=".55"/>'
      : '<rect x="170" y="170" width="340" height="230" rx="40" fill="#fff"/><rect x="205" y="200" width="270" height="90" rx="18" fill="'+a+'" opacity=".55"/><circle cx="235" cy="335" r="20" fill="#fde68a"/><circle cx="445" cy="335" r="20" fill="#fde68a"/><rect x="290" y="325" width="100" height="22" rx="6" fill="#1f2937"/>';
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 510"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="'+a+'"/><stop offset="1" stop-color="'+b+'"/></linearGradient></defs><rect width="680" height="510" fill="url(#g)"/><rect y="400" width="680" height="110" fill="#000" opacity=".12"/>'+body+'<text x="30" y="60" font-family="sans-serif" font-size="34" font-weight="700" fill="#fff">'+label+'</text><text x="30" y="96" font-family="sans-serif" font-size="20" fill="#fff" opacity=".85">DEMO PHOTO '+(angle+1)+'</text></svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg); };
  const D = off => { const d = new Date(); d.setDate(d.getDate() + off); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0,10); };
  const users = [{id:1,name:'मालक',username:'admin',role:'admin',tenant:'sevasai',active:true,pw:'admin123'},{id:2,name:'रमेश',username:'staff',role:'staff',tenant:'sevasai',active:true,pw:'staff123'},{id:10,name:'जीवन',username:'super',role:'super',tenant:null,active:true,pw:'super123'},{id:11,name:'राहुल जाधव',username:'malhar',role:'admin',tenant:'malhar',active:true,pw:'malhar123'},{id:12,name:'गणेश शेळके',username:'ganesh',role:'admin',tenant:'ganesh',active:true,pw:'ganesh123'}];
  let session = 10, acting = null, clock = Date.now();
  const tick = () => ++clock;
  let docs = new Map(); const stores = { sevasai: docs };
  const put = (col, data, by) => docs.set(col+'/'+data.id, {col, id:data.id, data, deleted:false, updated_at:tick()});
  const seller = {name:'सेवासाई वाहन बाजार', phone:'8669184363', address:'Paithan Road, Farola Tanda, Bidkin', occupation:'वाहन व्यवसाय'};
  put('settings', {id:'shop', name:'सेवासाई वाहन बाजार', owner:'', phone:'8669184363', address:'Paithan Road, Farola Tanda, Bidkin Dist. Chh. Sambhajinagar', firstReceipt:255, showPrice:true, requireForm:true, catAccent:'blue', catIntro:'तपासलेल्या, कागदपत्रे पूर्ण असलेल्या जुन्या गाड्या – बिडकीन, पैठण रोड', tagline:'Trusted used cars • Easy loan • RC transfer'});
  const cars = [
    ['c1','Maruti','Swift VXI',2019,'MH20 DV 4521','stock',-12,385000,455000,'petrol','पांढरा',48000,[['denting',8500],['tyre',7200]]],
    ['c2','Mahindra','Bolero ZLX',2017,'MH20 CS 8812','stock',-65,520000,610000,'diesel','सिल्व्हर',112000,[['repair',35000]]],
    ['c3','Hyundai','i20 Sportz',2018,'MH21 BH 3307','stock',-25,410000,475000,'petrol','लाल',61000,[['service',12000]]],
    ['c4','Maruti','WagonR VXI',2016,'MH20 BN 2290','booked',-30,240000,285000,'cng','निळा',88000,[]],
    ['c5','Toyota','Innova 2.5 G',2014,'MH17 AJ 9001','stock',-50,640000,735000,'diesel','पांढरा',165000,[['repair',22000],['polish',1500]]],
    ['c6','Tata','Nexon XM',2020,'MH20 EE 1290','sold',-20,640000,735000,'diesel','निळा',54000,[['commission',5000]]],
    ['c7','Maruti','Ertiga VDI',2016,'MH17 AZ 6654','sold',-75,470000,540000,'diesel','ग्रे',134000,[['repair',25000]]],
    ['c8','Maruti','Alto 800',2015,'MH20 AK 1111','sold',-80,150000,190000,'petrol','लाल',70000,[]],
    ['c9','Honda','City VX',2017,'MH20 CH 7070','sold',-110,520000,610000,'petrol','पांढरा',82000,[['denting',9000]]],
    ['c10','Mahindra','Scorpio S11',2016,'MH20 SC 5555','sold',-140,690000,790000,'diesel','काळा',121000,[['tyre',18000]]],
    ['c11','Maruti','Dzire ZXI',2018,'MH21 DZ 2121','sold',-170,430000,495000,'petrol','सिल्व्हर',66000,[]],
    ['c12','Maruti','Baleno Delta',2019,'MH20 BL 3434','sold',-15,470000,540000,'petrol','निळा',39000,[['service',6000]]],
  ];
  cars.forEach(([id,company,model,year,reg,status,bd,buyPrice,askPrice,fuel,color,km,ex], ci) => put('cars',{photos: status==='sold' ? [] : [0,1].map(a => { const pid = 'ph'+id+a; window.DEMO_PHOTOS[pid] = fakePhoto(company+' '+model, ci, a); return pid; }), buySource: {c1:['owner','संजय देशमुख','9822012345'],c2:['broker','सुनील (दलाल)','9850011122'],c3:['exchange','राजेश कुलकर्णी','9423334455'],c4:['owner','मनोज वाघ','9765001122'],c5:['dealer','औरंगाबाद मोटर्स','9890223344'],c6:['broker','सुनील (दलाल)','9850011122'],c7:['owner','अशोक माने','9922556677'],c8:['auction','SBI लिलाव',''],c9:['owner','दीपक जोशी','9011445566'],c10:['broker','इम्रान (दलाल)','9860778899'],c11:['exchange','प्रवीण सोनवणे','9404112233'],c12:['online','OLX – नितीन','9370998877']}[id][0], buyFrom: {c1:['owner','संजय देशमुख','9822012345'],c2:['broker','सुनील (दलाल)','9850011122'],c3:['exchange','राजेश कुलकर्णी','9423334455'],c4:['owner','मनोज वाघ','9765001122'],c5:['dealer','औरंगाबाद मोटर्स','9890223344'],c6:['broker','सुनील (दलाल)','9850011122'],c7:['owner','अशोक माने','9922556677'],c8:['auction','SBI लिलाव',''],c9:['owner','दीपक जोशी','9011445566'],c10:['broker','इम्रान (दलाल)','9860778899'],c11:['exchange','प्रवीण सोनवणे','9404112233'],c12:['online','OLX – नितीन','9370998877']}[id][1], buyFromPhone: {c1:['owner','संजय देशमुख','9822012345'],c2:['broker','सुनील (दलाल)','9850011122'],c3:['exchange','राजेश कुलकर्णी','9423334455'],c4:['owner','मनोज वाघ','9765001122'],c5:['dealer','औरंगाबाद मोटर्स','9890223344'],c6:['broker','सुनील (दलाल)','9850011122'],c7:['owner','अशोक माने','9922556677'],c8:['auction','SBI लिलाव',''],c9:['owner','दीपक जोशी','9011445566'],c10:['broker','इम्रान (दलाल)','9860778899'],c11:['exchange','प्रवीण सोनवणे','9404112233'],c12:['online','OLX – नितीन','9370998877']}[id][2], soldDate: status==='sold' ? D(bd+40) : '', features: id==='c1' ? 'सिंगल ओनर\nनवीन टायर आणि बॅटरी\nसर्व्हिस रेकॉर्ड उपलब्ध' : '',id,company,model,year,reg,status,buyDate:D(bd),buyPrice,askPrice,fuel,color,km,ownerNo:1,chassis:'MA3'+id.toUpperCase()+'K45210',engine:'EN'+id.toUpperCase()+'9921',insurance:id==='c3'?D(9):D(200),tax:'LTT',expenses:ex.map(([type,amount],i)=>({date:D(bd+2+i),type,amount,note:''}))}));
  const veh = id => { const c = docs.get('cars/'+id).data; return {reg:c.reg, model:c.model, color:c.color, company:c.company, chassis:c.chassis, engine:c.engine, insurance:'', tax:c.tax, finance:''}; };
  const deals = [
    ['d1',255,'c11',-160,495000,495000,'विजय म्हस्के','9011223344',{}],
    ['d2',256,'c10',-128,780000,780000,'संतोष पाटील','9822334455',{}],
    ['d3',257,'c9',-97,600000,600000,'अनिल गायकवाड','9765443322',{}],
    ['d4',258,'c8',-66,185000,185000,'प्रकाश शिंदे','9890112233',{}],
    ['d5',259,'c7',-36,535000,480000,'दत्ता जाधव','9970556677',{dueDate:D(-3), chequeNo:'004411', chequeAmount:55000}],
    ['d6',260,'c6',-8,720000,220000,'गणेश काळे','9890011223',{finAmount:450000, finBank:'Mahindra Finance', finFileNo:'MF-AUR-88231', finExpected:D(-4), dueDate:D(10)}],
    ['d7',261,'c12',-2,535000,535000,'सचिन मोरे','9423001122',{}],
  ];
  deals.forEach(([id,receiptNo,carId,dd,dealAmount,cash,name,phone,extra]) => put('deals',{id,receiptNo,carId,date:D(dd),time:'11:30',place:'सेवासाई वाहन बाजार',dealAmount,cash,payments:[],buyer:{name,phone,age:35,occupation:'शेती',address:'बिडकीन'},seller,vehicle:veh(carId),...extra}));
  const leads = [
    ['l1','संदीप पवार','9876543210','olx','follow',0,'Maruti Swift VXI (MH20 DV 4521)',450000],
    ['l2','अमोल जाधव','9822001122','walkin','test',-1,'Mahindra Bolero ZLX (MH20 CS 8812)',600000],
    ['l3','राहुल शिंदे','9765012345','facebook','new',3,'',350000],
    ['l4','किरण भोसले','9850098500','referral','new',0,'Toyota Innova 2.5 G (MH17 AJ 9001)',700000],
    ['l5','महेश गवळी','9922112211','olx','lost',-10,'',250000],
    ['l6','गणेश काळे','9890011223','referral','booked',-8,'Tata Nexon XM (MH20 EE 1290)',720000],
  ];
  leads.forEach(([id,name,phone,source,status,fu,interest,budget]) => put('leads',{id,name,phone,source,status,followUp:D(fu),interest,budget,address:'पैठण'}));
  // ---- WhatsApp demo data ----
  const T0 = Date.now(), MIN = 60000, HR = 3600000;
  [['l7','प्रशांत गायकवाड','9823456701','meta_ad','test','Maruti Swift VXI (MH20 DV 4521)','Meta जाहिरात: Swift ऑफर – नोव्हेंबर'],
   ['l8','योगेश मुंडे','9970123488','meta_ad','new','','Meta जाहिरात: SUV – Bolero/Innova'],
   ['l9','रवी साळवे','9422876501','meta_ad','booked','Maruti Baleno Delta (MH20 BL 3434)','Meta जाहिरात: Swift ऑफर – नोव्हेंबर'],
   ['l10','अक्षय बोरसे','9561002233','meta_ad','new','','Meta जाहिरात: बजेट गाड्या ₹3 लाखांखाली']].forEach(([id,name,phone,source,status,interest,note]) => put('leads',{id,name,phone,source,status,followUp:D(0),interest,budget:'',address:'',note}));
  const msg = (dir, text, ago, extra) => ({id:'m'+Math.random().toString(36).slice(2,9), dir, text, at:T0-ago, status: dir==='out' ? 'read' : undefined, by: dir==='out' ? 'मालक' : undefined, ...(extra||{})});
  const W = 'नमस्कार {n} 🙏 सेवासाई वाहन बाजार मध्ये आपले स्वागत! आमच्या सर्व गाड्या फोटो आणि किंमतीसह इथे पहा: ' + location.href.split('#')[0] + '#c/sevasai';
  const chats = [
    {id:'ch1', phone:'9823456701', name:'प्रशांत गायकवाड', leadId:'l7', adName:'Swift ऑफर – नोव्हेंबर', assignee:'मालक', labels:['lb_hot','lb_test'], unread:2, status:'open', messages:[
      msg('in','नमस्कार, जाहिरातीतली Swift अजून आहे का?', 26*MIN), msg('out', W.replace('{n}','प्रशांत गायकवाड'), 26*MIN-2000, {auto:true, by:'Bot'}),
      msg('in','किती km चालली आहे? आणि loan होईल का?', 9*MIN), msg('in','उद्या बघायला येऊ का?', 4*MIN)]},
    {id:'ch2', phone:'9970123488', name:'योगेश मुंडे', leadId:'l8', adName:'SUV – Bolero/Innova', assignee:'रमेश', labels:['lb_price'], unread:1, status:'open', messages:[
      msg('in','Bolero ची किंमत?', 3*HR), msg('out', W.replace('{n}','योगेश मुंडे'), 3*HR-2000, {auto:true, by:'Bot'}),
      msg('out','नमस्कार योगेशजी, Bolero ZLX 2017 – ₹6,10,000. सिंगल ओनर, डिझेल.', 2.5*HR, {by:'रमेश'}), msg('note','ग्राहक शेतकरी आहे, लोन लागेल', 2.4*HR, {by:'रमेश'}), msg('in','थोडी कमी होईल का?', 40*MIN)]},
    {id:'ch3', phone:'9422876501', name:'रवी साळवे', leadId:'l9', adName:'Swift ऑफर – नोव्हेंबर', assignee:'मालक', labels:[], unread:0, status:'closed', messages:[
      msg('in','Baleno बद्दल माहिती हवी', 4*24*HR), msg('out','नमस्कार रवीजी, Baleno Delta 2019 – ₹5,40,000. उद्या टेस्ट ड्राइव्हला या.', 4*24*HR-HR), msg('in','ठीक आहे, बुकिंग करतो 👍', 3*24*HR)]},
    {id:'ch4', phone:'9876543210', name:'संदीप पवार', leadId:'l1', adName:'', assignee:'मालक', labels:['lb_loan'], unread:0, status:'open', messages:[
      msg('in','Swift चा EMI किती येईल?', 30*HR), msg('out','₹1 लाख डाउन पेमेंट केल्यास साधारण ₹9,500 महिना (5 वर्षे).', 29*HR)]},
    {id:'ch5', phone:'9561002233', name:'अक्षय बोरसे', leadId:'l10', adName:'बजेट गाड्या ₹3 लाखांखाली', assignee:'', labels:[], unread:1, status:'open', messages:[
      msg('in','3 लाखात कोणती गाडी आहे?', 15*MIN), msg('out', W.replace('{n}','अक्षय बोरसे'), 15*MIN-2000, {auto:true, by:'Bot'})]},
  ];
  chats.forEach(c => { c.lastInboundAt = Math.max(...c.messages.filter(m => m.dir==='in').map(m => m.at)); c.lastAt = Math.max(...c.messages.map(m => m.at)); put('chats', c); });
  put('broadcasts', {id:'bc1', name:'नवीन स्टॉक – ऑक्टोबर', tpl:'new_stock', at:T0-20*24*HR, sent:18, delivered:17, read:12, replied:4});
  docs.get('settings/shop').data.wa = { adSpend: {'Swift ऑफर – नोव्हेंबर': 3500, 'SUV – Bolero/Innova': 2500, 'बजेट गाड्या ₹3 लाखांखाली': 1200} };
  let e = 0;
  for (let m = 0; m <= 5; m++) { put('expenses',{id:'e'+(++e),category:'rent',amount:15000,date:D(-m*30-1),note:''}); put('expenses',{id:'e'+(++e),category:'salary',amount:18000,date:D(-m*30-2),note:'2 कामगार'}); }
  put('expenses',{id:'e'+(++e),category:'electricity',amount:2300,date:D(-5),note:''});
  put('expenses',{id:'e'+(++e),category:'ads',amount:1800,date:D(-6),note:'OLX'});

  const views = [];
  [['c1',14],['c2',6],['c3',9],['c5',11],['c4',3]].forEach(([c,n]) => { for (let i = 0; i < n; i++) views.push({car:c, kind:'view', at:Date.now()-i*86400000*1.7}); });
  for (let i = 0; i < 4; i++) views.push({car:'c1', kind:'lead', at:Date.now()-i*86400000*3});
  const shopData = () => docs.get('settings/shop').data;
  const pShop = s => ({name:s.name, phone:s.phone, whatsapp:s.whatsapp||s.phone, address:s.address, mapUrl:s.mapUrl||'', intro:s.catIntro||'', showPrice:s.showPrice!==false, requireForm:s.requireForm!==false, accent:s.catAccent||'blue'});
  const mask = r => { const p = String(r||'').split(' '); return p.length>=3 ? p[0]+' ** '+p[p.length-1] : r; };
  const pCar = (c, sh) => ({id:c.id, company:c.company, model:c.model, year:c.year, fuel:c.fuel, km:c.km, color:c.color, ownerNo:c.ownerNo, status:c.status||'stock', reg:mask(c.reg), photos:c.photos||[], price: sh.showPrice ? c.askPrice : null, insurance:c.insurance, features:c.features||''});
  const liveCars = () => [...docs.values()].filter(r => r.col==='cars' && !r.deleted).map(r => r.data);
  // ---- multi-dealer (tenants) ----
  const addM = (iso, months) => { const d = new Date(iso); d.setMonth(d.getMonth() + months); return d.toISOString().slice(0,10); };
  let plans = [
    {id:'basic', name:'Basic', price:999, maxCars:30, maxStaff:2, rcPerMonth:0, features:{catalog:false, wa:false}},
    {id:'pro', name:'Pro', price:1999, maxCars:100, maxStaff:5, rcPerMonth:100, features:{catalog:true, wa:false}},
    {id:'premium', name:'Premium', price:3499, maxCars:0, maxStaff:10, rcPerMonth:300, features:{catalog:true, wa:true}} ];
  const tenants = [
    {id:'sevasai', name:'सेवासाई वाहन बाजार', city:'बिडकीन, छ. संभाजीनगर', ownerName:'मालक', phone:'8669184363', username:'admin', plan:'premium', trial:false, suspended:false, expiry:D(23), features:{catalog:true, wa:true}, notes:'पहिला ग्राहक – case study', lastLogin:Date.now()-2*3600000, payments:[{date:D(-37), amount:3499, months:1, note:'UPI'},{date:D(-7), amount:3499, months:1, note:'UPI'}]},
    {id:'malhar', name:'जय मल्हार मोटर्स', city:'पैठण', ownerName:'राहुल जाधव', phone:'9822114455', username:'malhar', plan:'pro', trial:true, suspended:false, expiry:D(2), features:{catalog:true, wa:false}, notes:'डेमो दाखवला, बजेट विचारत आहेत', lastLogin:Date.now()-26*3600000, payments:[]},
    {id:'ganesh', name:'श्री गणेश कार्स', city:'जालना', ownerName:'गणेश शेळके', phone:'9405667788', username:'ganesh', plan:'basic', trial:true, suspended:false, expiry:D(-4), features:{catalog:false, wa:false}, notes:'', lastLogin:Date.now()-9*86400000, payments:[]},
  ];
  let supportPhone = '9822000000';
  const pc = (id, en, hi, mr, tier, sort) => ({ id, names: { en, hi, mr }, tier, active: true, sort });
  const PCATS = [pc('festival','Festivals','त्योहार','सण','basic',1), pc('national','National days','राष्ट्रीय दिवस','राष्ट्रीय दिवस','basic',2), pc('jayanti','Jayanti','जयंती','जयंती','basic',3), pc('good-morning','Good Morning','सुप्रभात','शुभ सकाळ','basic',4), pc('tips','Car tips','गाड़ी टिप्स','गाडी टिप्स','basic',5), pc('offer','Offers','ऑफ़र','ऑफर','pro',6), pc('business','Business','बिज़नेस','व्यवसाय','pro',7)];
  const ps = (id, en, hi, mr, sort) => ({ id, names: { en, hi, mr }, active: true, sort });
  const PSEGS = [ps('cars','Used cars','पुरानी कारें','जुन्या कार',1), ps('bikes','Two-wheelers','टू-व्हीलर','टू-व्हीलर',2), ps('commercial','Commercial vehicles','कमर्शियल वाहन','व्यावसायिक वाहने',3), ps('tractors','Tractors','ट्रैक्टर','ट्रॅक्टर',4), ps('other','Other','अन्य','इतर',99)];
  let posterLib = null; const getLib = () => posterLib || (posterLib = { categories: PCATS, segments: PSEGS, posters: starterPosters(true) });
  let posterCfg = { designerApprove: false };
  const dealerPoster = { sevasai: { segment: 'cars', pattiStatus: 'approved', pattiImages: [null, null, null] }, malhar: { segment: 'cars', pattiStatus: 'pending', pattiImages: [null, null, null] } };
  const news = [{id:'n1', text:'नवीन: आता गाडीच्या खरेदी स्रोतानुसार नफा डॅशबोर्डवर पाहा!', at:Date.now()-2*86400000, active:true}];
  const logs = [{at:Date.now()-7*86400000, who:'जीवन', what:'पेमेंट नोंदले ₹3,499 – 1 महिना', tenant:'sevasai'},{at:Date.now()-3*86400000, who:'जीवन', what:'नवीन डीलर – ट्रायल 14 दिवस', tenant:'malhar'}];
  const logIt = (who, what, tenant) => logs.unshift({at:Date.now(), who, what, tenant});
  const mkStore = (tid, shop, carsList, leadsList) => { const keep = docs; docs = stores[tid] = new Map();
    put('settings', {id:'shop', firstReceipt:1, showPrice:true, requireForm:true, catAccent:'blue', ...shop});
    (carsList||[]).forEach(c => put('cars', c)); (leadsList||[]).forEach(l => put('leads', l)); docs = keep; };
  mkStore('malhar', {name:'जय मल्हार मोटर्स', phone:'9822114455', address:'पैठण'},
    [{id:'m1', company:'Maruti', model:'Alto K10', year:2017, reg:'MH20 AB 1010', status:'stock', buyDate:D(-10), buyPrice:180000, askPrice:225000, fuel:'petrol', expenses:[], photos:[], buySource:'owner'},
     {id:'m2', company:'Hyundai', model:'Santro', year:2015, reg:'MH20 CD 2020', status:'stock', buyDate:D(-5), buyPrice:150000, askPrice:195000, fuel:'petrol', expenses:[], photos:[], buySource:'broker'}],
    [{id:'ml1', name:'विकास मोरे', phone:'9876001122', source:'walkin', status:'new', followUp:D(0), interest:'', budget:200000}]);
  mkStore('ganesh', {name:'श्री गणेश कार्स', phone:'9405667788', address:'जालना'},
    [{id:'g1', company:'Tata', model:'Indica', year:2014, reg:'MH21 EF 3030', status:'stock', buyDate:D(-30), buyPrice:120000, askPrice:150000, fuel:'diesel', expenses:[], photos:[], buySource:'owner'}], []);
  const tState = tn => tn.suspended ? 'suspended' : (tn.expiry < D(0) ? 'expired' : (tn.trial ? 'trial' : 'active'));
  const dleft = tn => Math.round((new Date(tn.expiry) - new Date(D(0))) / 86400000);
  const tStats = tn => { const st = stores[tn.id] || new Map(); const live = col => [...st.values()].filter(r => r.col===col && !r.deleted).length;
    return {cars:live('cars'), leads:live('leads'), deals:live('deals'), staff:users.filter(u => u.tenant===tn.id && u.active).length}; };
  // RC lookup (fake data – the real server asks the RC provider set in RC_PROVIDER)
  const rcLog = {};
  const rcStat = tn => { const lim = Number((plans.find(x => x.id === tn.plan) || {}).rcPerMonth) || 0; return {enabled: lim > 0, limit: lim, used: lim ? Object.keys(rcLog[tn.id] || {}).length : 0}; };
  const RCM = [['MARUTI SUZUKI INDIA LTD','SWIFT VXI','PEARL ARCTIC WHITE','PETROL'],['HYUNDAI MOTOR INDIA LTD','CRETA 1.6 SX','PHANTOM BLACK','DIESEL'],['MAHINDRA & MAHINDRA LTD','SCORPIO S11','NAPOLI BLACK','DIESEL'],['TATA MOTORS LTD','NEXON XZ PLUS','FLAME RED','PETROL'],['TOYOTA KIRLOSKAR MOTOR PVT LTD','INNOVA CRYSTA 2.4 VX','SILVER','DIESEL']];
  const rcFake = reg => { const h = [...reg].reduce((a, c) => a * 31 + c.charCodeAt(0) >>> 0, 7); const [mk, md, col, fuel] = RCM[h % RCM.length]; const y = 2014 + h % 9;
    return {reg, company:mk, model:md, year:String(y), color:col, fuel:fuel.toLowerCase(), ownerNo:1 + h % 3, owner:['SANJAY DESHMUKH','RAJESH KULKARNI','ANIL PATIL'][h % 3],
      chassis:'MA3'+String(h).slice(0,6).padEnd(6,'0')+'XXXXX', engine:'XXXX'+String(h).slice(-5), insurance:D(40 + h % 200), insurer:'NEW INDIA ASSURANCE', tax:'LTT',
      finance: h % 2 ? 'HDFC BANK LTD' : '', regDate:y+'-0'+(1 + h % 9)+'-1'+(h % 9), rto:'AURANGABAD RTO, Maharashtra', vehicleClass:'Motor Car (LMV)', blacklisted:false}; };
  const tInfo = (tn, imp) => { const latest = news.filter(n => n.active).slice(-1)[0];
    return {id:tn.id, name:tn.name, plan:tn.plan, status:tState(tn), rc:rcStat(tn), daysLeft:dleft(tn), expiry:tn.expiry, features:tn.features, impersonating:!!imp, supportPhone, poster: { ...(dealerPoster[tn.id] || {}), designerApprove: posterCfg.designerApprove }, news: latest ? {id:latest.id, text:latest.text} : null}; };
  const pub = u => ({id:u.id,name:u.name,username:u.username,role:u.role});
  const json = (status, body) => new Response(JSON.stringify(body), {status, headers:{'Content-Type':'application/json'}});
  const orig = window.fetch.bind(window);
  window.fetch = async (url, opts = {}) => {
    const u = new URL(String(url && url.url ? url.url : url), 'http://demo.local/');
    if (u.hostname !== 'demo.local') return orig(url, opts);
    if (!u.pathname.startsWith('/api/') && !u.pathname.startsWith('/p/')) return orig(url, opts);
    await new Promise(r => setTimeout(r, 60));
    let pubT = null;
    const m = (opts.method || 'GET').toUpperCase(), p = u.pathname.replace(/^\/api\/public\/([\w-]+)\//, (x, tt) => { pubT = tt; return '/api/public/'; }), body = opts.body ? JSON.parse(opts.body) : {};
    const me = users.find(x => x.id === session);
    const tid = me ? (me.role === 'super' ? acting : me.tenant) : 'sevasai';
    docs = stores[tid] || stores.sevasai;
    if (pubT) { const pt = tenants.find(x => x.id === pubT); if (!pt || pt.suspended || (pt.features && pt.features.catalog === false)) return json(404,{error:'nf'}); docs = stores[pubT]; }
    const ten = tenants.find(x => x.id === tid);
    if (p === '/api/public/catalog') { const sh = pShop(shopData()); return json(200,{shop:sh, cars: liveCars().filter(c => c.status!=='sold' && !c.hideOnline).map(c => pCar(c, sh))}); }
    let pm = p.match(/^\/api\/public\/car\/([\w-]+)$/);
    if (pm) { const sh = pShop(shopData()); const r = docs.get('cars/'+pm[1]); return json(200,{shop:sh, car: r && !r.deleted ? {...pCar(r.data, sh), sold:r.data.status==='sold'} : null}); }
    if (p === '/api/public/view') { views.push({car:body.carId||null, kind:'view', at:Date.now()}); return json(200,{ok:true}); }
    if (p === '/api/public/lead') {
      const phone = String(body.phone||'').replace(/\D/g,'').slice(-10); if (String(body.name||'').trim().length < 2 || !/^[6-9]\d{9}$/.test(phone)) return json(400,{error:'fields'});
      const c = body.carId && docs.get('cars/'+body.carId) ? docs.get('cars/'+body.carId).data : null; const carText = c ? (c.company+' '+c.model+' ('+c.reg+')') : '';
      const day = D(0); const line = 'QR/कॅटलॉग '+day+(carText ? ' – '+carText : '')+(body.geo ? ' – https://maps.google.com/?q='+body.geo : '');
      const ex = [...docs.values()].find(r => r.col==='leads' && !r.deleted && String(r.data.phone).endsWith(phone));
      let lead; if (ex) { lead = {...ex.data, note:[ex.data.note,line].filter(Boolean).join('\n'), followUp: ex.data.status==='booked' ? ex.data.followUp : day}; if (carText) lead.interest = carText; if (lead.status==='lost') lead.status='follow'; }
      else lead = {id:'qr'+Date.now().toString(36), name:String(body.name).trim(), phone, source:'qr', status:'new', followUp:day, interest:carText, address:body.location||'', budget:'', note:line};
      put('leads', lead); views.push({car:body.carId||null, kind:'lead', at:Date.now()}); return json(200,{ok:true}); }
    if (p === '/api/login') { const x = users.find(x => x.username === String(body.username||'').trim().toLowerCase() && x.pw === body.password && x.active); if (!x) return json(401,{error:'bad'}); const tn = tenants.find(y => y.id === x.tenant); if (tn && tn.suspended) return json(403,{error:'suspended'}); session = x.id; acting = null; if (tn) tn.lastLogin = Date.now(); return json(200,{user:pub(x)}); }
    if (p === '/api/logout') { session = null; acting = null; return json(200,{ok:true}); }
    if (!me) return json(401,{error:'login'});
    const admin = me.role === 'admin' || (me.role === 'super' && !!acting);
    if (p === '/api/me') { if (me.role === 'super' && acting) return json(200,{user:{...pub(me), role:'admin', name:me.name+' (Super Admin)'}, tenant:tInfo(ten, true)}); return json(200,{user:pub(me), tenant: ten ? tInfo(ten) : null}); }
    if (p.startsWith('/api/sa/')) {
      if (me.role !== 'super') return json(403,{error:'super'});
      if (p === '/api/sa/overview') return json(200,{tenants:tenants.map(tn => ({...tn, stats:tStats(tn)})), plans, news, logs, supportPhone, posterLib:getLib(), posterCfg, dealerPoster});
      if (p === '/api/sa/exit') { acting = null; return json(200,{ok:true}); }
      let sm = p.match(/^\/api\/sa\/impersonate\/([\w-]+)$/);
      if (sm) { const tn = tenants.find(x => x.id === sm[1]); if (!tn) return json(404,{}); acting = tn.id; logIt(me.name, 'डीलर म्हणून उघडले', tn.id); return json(200,{ok:true}); }
      if (p === '/api/sa/tenants' && m === 'POST') {
        const un = String(body.username||'').trim().toLowerCase();
        if (!body.name || !body.ownerName || !/^[6-9]\d{9}$/.test(String(body.phone||'').replace(/\D/g,'').slice(-10)) || !/^[a-z0-9._-]{3,50}$/.test(un) || String(body.password||'').length < 6) return json(400,{error:'fields'});
        if (users.some(u => u.username === un)) return json(409,{error:'exists'});
        const id = un.replace(/[^a-z0-9]/g,'') + Math.random().toString(36).slice(2,5); const pl = plans.find(x => x.id === body.plan) || plans[0];
        const tn = {id, name:body.name, city:body.city||'', ownerName:body.ownerName, phone:body.phone, username:un, plan:pl.id, trial:true, suspended:false, expiry:D(Number(body.trialDays)||14), features:{...pl.features}, notes:'', lastLogin:null, payments:[]};
        tenants.push(tn); users.push({id:users.length+100, name:body.ownerName, username:un, role:'admin', tenant:id, active:true, pw:body.password});
        mkStore(id, {name:body.name, phone:body.phone, address:body.city||''}, [], []);
        logIt(me.name, `नवीन डीलर – ट्रायल ${Number(body.trialDays)||14} दिवस`, id); return json(200,{ok:true,id}); }
      sm = p.match(/^\/api\/sa\/tenants\/([\w-]+)$/);
      if (sm && m === 'PATCH') { const tn = tenants.find(x => x.id === sm[1]); if (!tn) return json(404,{});
        ['name','city','ownerName','phone','notes'].forEach(k => { if (body[k] !== undefined) tn[k] = body[k]; });
        if (body.plan && body.plan !== tn.plan) { tn.plan = body.plan; logIt(me.name, 'प्लॅन बदलला: ' + body.plan, tn.id); }
        if (body.features) tn.features = body.features;
        if (typeof body.suspended === 'boolean') { tn.suspended = body.suspended; logIt(me.name, body.suspended ? 'खाते बंद केले' : 'खाते चालू केले', tn.id); }
        if (body.extendDays) { const base = tn.expiry > D(0) ? tn.expiry : D(0); const d = new Date(base); d.setDate(d.getDate() + Number(body.extendDays)); tn.expiry = d.toISOString().slice(0,10); logIt(me.name, `मुदत +${body.extendDays} दिवस`, tn.id); }
        if (body.payment) { const pmt = body.payment; const base = tn.expiry > D(0) ? tn.expiry : D(0); tn.expiry = addM(base, Number(pmt.months)||1); tn.trial = false; tn.payments.push(pmt); logIt(me.name, `पेमेंट नोंदले ₹${Number(pmt.amount).toLocaleString('en-IN')} – ${pmt.months} महिना`, tn.id); }
        if (body.ownerPassword) { const o = users.find(u => u.tenant === tn.id && u.username === tn.username); if (o) o.pw = body.ownerPassword; logIt(me.name, 'मालकाचा पासवर्ड रीसेट', tn.id); }
        return json(200,{ok:true, expiry:tn.expiry}); }
      if (p === '/api/sa/posterlib' && m === 'PUT') { posterLib = { categories: body.categories || PCATS, segments: body.segments || PSEGS, posters: body.posters || [] }; return json(200,{ok:true}); }
      if (p === '/api/sa/postercfg' && m === 'PUT') { posterCfg = { designerApprove: !!body.designerApprove }; return json(200,{ok:true}); }
      if (p === '/api/sa/asset' && m === 'POST') { const id = 'as'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); window.DEMO_PHOTOS[id] = body.data; return json(200,{ok:true,id}); }
      { const pm2 = p.match(/^\/api\/sa\/dealerposter\/([\w-]+)$/); if (pm2 && m === 'PUT') { const cur = dealerPoster[pm2[1]] || { pattiStatus: 'pending', pattiImages: [null, null, null] }; if (body.segment !== undefined) cur.segment = body.segment; if (Array.isArray(body.pattiImages)) cur.pattiImages = [0,1,2].map(i => body.pattiImages[i] || null); if (body.pattiStatus) { cur.pattiStatus = body.pattiStatus; logIt(me.name, 'पट्टी: ' + body.pattiStatus, pm2[1]); } dealerPoster[pm2[1]] = cur; return json(200,{ok:true,poster:cur}); } }
      if (p === '/api/sa/platform' && m === 'PUT') { if (body.supportPhone !== undefined) supportPhone = String(body.supportPhone); return json(200,{ok:true}); }
      if (p === '/api/sa/plans' && m === 'PUT') { plans = body.plans; logIt(me.name, 'प्लॅन बदलले', null); return json(200,{ok:true}); }
      if (p === '/api/sa/news' && m === 'POST') { news.push({id:'n'+Date.now(), text:body.text, at:Date.now(), active:true}); logIt(me.name, 'सर्वांना सूचना पाठवली', null); return json(200,{ok:true}); }
      sm = p.match(/^\/api\/sa\/news\/([\w-]+)$/); if (sm) { const n = news.find(x => x.id === sm[1]); if (n) n.active = false; return json(200,{ok:true}); }
      return json(404,{error:'not found'});
    }
    if (me.role === 'super' && !acting) return json(403,{error:'super'});
    if (p === '/api/posters') { const lb = getLib(); const dp = dealerPoster[tid] || {}; const cats = lb.categories.filter(c => c.active).sort((a, b) => a.sort - b.sort); const live = new Set(cats.map(c => c.id)); return json(200,{categories: cats, segments: lb.segments.filter(s => s.active), posters: lb.posters.filter(x => x.active && live.has(x.category) && (!(x.segments||[]).length || x.segments.includes(dp.segment)))}); }
    const writable = ten && ['trial','active'].includes(tState(ten));
    const plan = ten ? (plans.find(x => x.id === ten.plan) || {}) : {};
    if (p === '/api/stats/marketing') { const since = Date.now()-30*86400000; const by = {}; views.filter(v => v.kind==='view' && v.car).forEach(v => { by[v.car] = (by[v.car]||0)+1; }); return json(200,{views30: views.filter(v => v.kind==='view' && v.at>since).length, leads30: views.filter(v => v.kind==='lead' && v.at>since).length, byCar: by}); }
    if (p === '/api/photos' && m === 'POST') { if (!writable) return json(402,{error:'expired'}); const id = 'up'+Date.now().toString(36)+Math.random().toString(36).slice(2,6); window.DEMO_PHOTOS[id] = body.data; return json(200,{ok:true,id}); }
    if (/^\/api\/photos\//.test(p) && m === 'DELETE') return json(200,{ok:true});
    if (p === '/api/rc/status') return ten ? json(200, rcStat(ten)) : json(403,{error:'tenant'});
    if (p === '/api/rc/lookup' && m === 'POST') { if (!ten) return json(403,{error:'tenant'}); if (!writable) return json(402,{error:'expired'});
      const reg = String(body.reg || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); if (!/^([A-Z]{2}\d{1,2}[A-Z]{0,3}\d{4}|\d{2}BH\d{4}[A-Z]{1,2})$/.test(reg)) return json(400,{error:'rc_reg'});
      const st = rcStat(ten); if (!st.limit) return json(403,{error:'rc_plan'}); const log = rcLog[ten.id] = rcLog[ten.id] || {};
      if (log[reg]) return json(200,{rc:log[reg], cached:true, ...rcStat(ten)}); if (st.used >= st.limit) return json(403,{error:'rc_limit'});
      if (reg.endsWith('0000')) return json(404,{error:'rc_nf'}); log[reg] = rcFake(reg); return json(200,{rc:log[reg], cached:false, ...rcStat(ten)}); }
    if (p === '/api/me/password') { if (body.oldPassword !== me.pw) return json(400,{error:'old'}); me.pw = body.newPassword; return json(200,{ok:true}); }
    if (p === '/api/data') { const since = Number(u.searchParams.get('since')||0); const rows = [...docs.values()].filter(r => r.updated_at > since && (since || !r.deleted) && (admin || r.col !== 'expenses')).map(r => ({col:r.col,id:r.id,deleted:r.deleted,data:r.deleted?null:JSON.parse(JSON.stringify(r.data))})); return json(200,{now:tick(),rows}); }
    let mm = p.match(/^\/api\/docs\/(\w+)\/([\w-]+)$/);
    if (mm) { const [, col, id] = mm;
      if (m === 'PUT') { if (!writable) return json(402,{error:'expired'}); if (['expenses','settings'].includes(col) && !admin) return json(403,{error:'admin'});
        if (col === 'cars' && !docs.has('cars/'+id) && plan.maxCars && [...docs.values()].filter(r => r.col==='cars' && !r.deleted).length >= plan.maxCars) return json(403,{error:'limit'}); put(col,{...body.data,id}); return json(200,{ok:true,now:clock}); }
      if (m === 'DELETE') { if (!writable) return json(402,{error:'expired'}); if (!admin) return json(403,{error:'admin'}); const r = docs.get(col+'/'+id); if (r) { r.deleted = true; r.updated_at = tick(); } return json(200,{ok:true}); } }
    if (!admin) return json(403,{error:'admin'});
    if (p === '/api/users' && m === 'GET') return json(200,{users:users.filter(x => x.tenant === tid).map(x => ({...pub(x),active:x.active}))});
    if (p === '/api/users' && m === 'POST') { if (!body.name || !/^[a-z0-9._-]{3,50}$/.test(body.username||'') || (body.password||'').length < 6) return json(400,{error:'fields'}); if (plan.maxStaff && users.filter(x => x.tenant === tid && x.active).length >= plan.maxStaff) return json(403,{error:'limit'}); if (users.some(x => x.username === body.username)) return json(409,{error:'exists'}); users.push({id:users.length+1,tenant:tid,name:body.name,username:body.username,role:body.role==='admin'?'admin':'staff',active:true,pw:body.password}); return json(200,{ok:true}); }
    mm = p.match(/^\/api\/users\/(\d+)$/);
    if (mm) { const x = users.find(y => y.id === Number(mm[1])); if (x.id === me.id && body.active === false) return json(400,{error:'self'}); if (typeof body.active === 'boolean') x.active = body.active; if (body.password) x.pw = body.password; return json(200,{ok:true}); }
    if (p === '/api/backup') { const out = {app:'smart-autodeal',version:3,cars:[],leads:[],deals:[],expenses:[],shop:null}; docs.forEach(r => { if (r.deleted) return; if (r.col === 'settings') out.shop = r.data; else out[r.col].push(r.data); }); return json(200,out); }
    if (p === '/api/restore') { let n = 0; ['cars','leads','deals','expenses'].forEach(c => (body[c]||[]).forEach(d => { put(c,d); n++; })); if (body.shop) { put('settings',{...body.shop,id:'shop'}); n++; } return json(200,{ok:true,count:n}); }
    return json(404,{error:'not found'});
  };
})();

