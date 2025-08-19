/* script.js
   PAU Crop Calendar: dataset + UI logic + CSV/ICS export
   Note: fertilizer doses are per-acre (as in PAU PoP). Convert to ha if needed.
*/

// Utility
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));
const fmtDate = d => new Date(d).toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'});
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// Dataset: each crop -> array of events {day, type, en, pa, note, cite}
// All doses expressed per acre to match PAU convention. 'cite' points to PAU PoP for quick checks.
const DATA = {
  Rabi: {
    Wheat: [
      { day:0, type:'land', en:'Field preparation: level firm seed bed; incorporate previous residues as advised', pa:'ਖੇਤ ਤਿਆਰ: ਬੀਜ ਲਈ ਸਮਤਲ ਅਤੇ ਮਜ਼ਬੂਤ ਬੈੱਡ' , cite:'PAU PoP Rabi' },
      { day:0, type:'seed', en:'Seed rate 40–45 kg/acre (use 45 kg/acre for recommended varieties). Seed treatment: Thiram/Vitavax @2 g/kg seed', pa:'ਬੀਜ ਦਰ 40–45 ਕਿ.ਗ੍ਰਾ./ਏਕੜ; ਬੀਜ ਸਨਿਪੇਸ਼ਣ 2 g/kg', cite:'PAU PoP Rabi' },
      { day:0, type:'fert', en:'Apply P & K at sowing: DAP 55 kg/acre (or SSP 155 kg/acre). Apply MOP only if soil K deficient.', pa:'DAP 55 ਕਿ.ਗ੍ਰਾ./ਏਕੜ ਜਾਂ SSP 155 ਕਿ.ਗ੍ਰਾ./ਏਕੜ; K ਦੇ ਘਾਟੇ ' , cite:'PAU PoP Rabi' },
      { day:21, type:'irrig', en:'CRI — 1st irrigation at 20–25 DAS (critical).', pa:'CRI — 1ਲੀ ਸਿੰਚਾਈ (20–25 ਦਿਨ)', cite:'PAU PoP Rabi' },
      { day:21, type:'fert', en:'1st top-dress urea (timely sown): 45 kg urea/acre at 1st irrigation (~21 DAS)', pa:'ਪਹਿਲੀ ਯੂਰੀਆ ਉਪਰਲੀ: 45 ਕਿ.ਗ੍ਰਾ./ਏਕੜ (~21 ਦਿਨ)', cite:'PAU PoP Rabi' },
      { day:45, type:'irrig', en:'2nd irrigation (40–45 DAS).', pa:'ਦੂਜੀ ਸਿੰਚਾਈ (40–45 ਦਿਨ)', cite:'PAU PoP Rabi' },
      { day:45, type:'fert', en:'2nd top-dress urea: 45 kg urea/acre (timely sown).', pa:'ਦੂਜੀ ਯੂਰੀਆ ਉਪਰਲੀ: 45 ਕਿ.ਗ੍ਰਾ./ਏਕੜ', cite:'PAU PoP Rabi' },
      { day:30, type:'weed', en:'Post-emergence weed control: apply recommended herbicide (e.g., metsulfuron/isoproturon) at 30–40 DAS as per PoP', pa:'30–40 ਦਿਨ ' , cite:'PAU PoP Rabi' },
      { day:60, type:'pest', en:'Scout for rusts, aphids and foliar diseases; apply PoP-recommended sprays if above threshold', pa:'ਰੱਸਟ/ਐਫਿਡ ਦੇ ਲਈ ਨਿਗਰਾਨੀ', cite:'PAU PoP Rabi' },
      { day:90, type:'foliar', en:'Optional foliar Zn (0.5%) + urea (2%) spray at 90 DAS if advised for biofortification', pa:'90 ਦਿਨ ਤੇ ਜਿੰਕ ਛਿੜਕਾਅ (ਓਕਸ਼ਨ)', cite:'PAU advisory' },
      { day:140, type:'harvest', en:'Harvest window ~140–150 DAS when grain mature; thresh at recommended moisture', pa:'ਕਟਾਈ ~140–150 ਦਿਨ', cite:'PAU PoP Rabi' }
    ],

    Mustard: [
      { day:0, type:'land', en:'Field preparation: fine seed bed', pa:'ਖੇਤ ਤਿਆਰ' , cite:'PAU PoP Rabi' },
      { day:0, type:'seed', en:'Seed rate: ~6–8 kg/acre (as per variety); seed treatment recommended', pa:'ਬੀਜ ਦਰ: 6–8 ਕਿ.ਗ੍ਰਾ./ਏਕੜ', cite:'PAU PoP Rabi' },
      { day:0, type:'fert', en:'Basal P & K: DAP/SSP as per PoP; half N at sowing', pa:'ਬੇਸਲ P&K; ਅਧ-ਨਾਈਟਰੋਜਨ', cite:'PAU PoP Rabi' },
      { day:25, type:'irrig', en:'1st irrigation at branching (~25 DAS)', pa:'ਪਹਿਲੀ ਸਿੰਚਾਈ (≈25 ਦਿਨ)', cite:'PAU PoP Rabi' },
      { day:30, type:'fert', en:'Top-dress remaining N at ~30 DAS', pa:'30 ਦਿਨ ਤੇ ਬਾਕੀ N', cite:'PAU PoP Rabi' },
      { day:35, type:'pest', en:'Monitor aphids/Alternaria; spray if threshold crossed as per PoP', pa:'ਐਫਿਡ/Alternaria ਨਿਗਰਾਨੀ', cite:'PAU PoP Rabi' },
      { day:110, type:'harvest', en:'Harvest when siliquae yellow and seeds harden (~110–120 DAS)', pa:'ਕਟਾਈ ~110-120 ਦਿਨ', cite:'PAU PoP Rabi' }
    ],

    Potato: [
      { day:0, type:'land', en:'Planting: use certified seed tubers; spacing per variety', pa:'ਸਰਟੀਫਾਈਡ ਬੀਜ ਅਲੂ' },
      { day:0, type:'fert', en:'Basal P & K at planting (apply as per PoP); split N', pa:'DAP/SSP/MOP per PoP' },
      { day:7, type:'irrig', en:'Light irrigation post planting; maintain soil moisture', pa:'ਰੋਪਾਈ ਬਾਅਦ ਹਲਕੀ ਸਿੰਚਾਈ', cite:'PAU PoP Rabi' },
      { day:20, type:'earthing', en:'Earthing up I (20–25 DAS) — first earthing up', pa:'20–25 ਦਿਨ ਤੇ ਮਿੱਟੀ ਚੜ੍ਹਾਉਣਾ' },
      { day:35, type:'earthing', en:'Earthing up II (35–40 DAS)', pa:'35–40 ਦਿਨ' },
      { day:25, type:'fert', en:'Top-dress N (remaining) at 25–30 DAS', pa:'25–30 ਦਿਨ ਤੇ N', cite:'PAU PoP Rabi' },
      { day:80, type:'pest', en:'Start late blight watch; spray fungicide as per advisory', pa:'Late blight ਨਿਗਰਾਨੀ', cite:'PAU PoP Rabi' },
      { day:100, type:'harvest', en:'Harvest window; dehaulm 10–15 days before harvest', pa:'ਕਟਾਈ' }
    ],

    Barley: [
      { day:0, type:'seed', en:'Sow in recommended window (seed rate as per PoP)', pa:'ਬੀਜਾਈ' },
      { day:20, type:'irrig', en:'1st irrigation', pa:'ਪਹਿਲੀ ਸਿੰਚਾਈ' },
      { day:40, type:'fert', en:'Top dress N as per PoP', pa:'N ਦੀ ਉਪਰਲੀ ਖੁਰਾਕ' },
      { day:110, type:'harvest', en:'Harvest at physiological maturity', pa:'ਕਟਾਈ' }
    ],

    Berseem: [
      { day:0, type:'seed', en:'Sowing (broadcast/line) as per PoP', pa:'ਬੀਜਾਈ' },
      { day:25, type:'cut', en:'First cutting as fodder ~25–30 DAS', pa:'ਪਹਿਲੀ ਕਟਾਈ' },
      { day:60, type:'cut', en:'Second cutting', pa:'ਦੂਜੀ ਕਟਾਈ' }
    ],

    Pea: [
      { day:0, type:'seed', en:'Sowing as per spacing', pa:'ਬੀਜਾਈ' },
      { day:20, type:'weed', en:'Weed control (interculture/herbicide)', pa:'ਨਿਰਾਈ' },
      { day:50, type:'pest', en:'Flowering; watch pod borer', pa:'ਪੌਡ ਬੋਰਰ ਨਿਗਰਾਨੀ' },
      { day:90, type:'harvest', en:'Harvest when pods mature', pa:'ਕਟਾਈ' }
    ]
  },

  Kharif: {
    Paddy: [
      { day:0, type:'prep', en:'Nursery/practices: raise 3–4 week old seedlings for transplanting', pa:'ਨਰਸਰੀ: 3–4 ਹਫ਼ਤੇ ਪੌਦੇ' },
      { day:0, type:'trans', en:'Transplanting or direct seeding as per system', pa:'ਰੋਪਾਈ/ਸਿੱਧੀ ਬੀਜਾਈ' },
      { day:0, type:'fert', en:'Basal P & K at transplanting: DAP/SSP per PoP', pa:'ਬੇਸਲ P & K' },
      { day:3, type:'irrig', en:'Establishment: maintain 2–5 cm water after establishment / check drainage', pa:'ਪਾਣੀ 2–5 cm' },
      { day:21, type:'fert', en:'1st N top-dress (1/3) at tillering (~21 DAT)', pa:'ਪਹਿਲੀ N ਖੁਰਾਕ (~21 ਦਿਨ)' },
      { day:22, type:'weed', en:'Weed control / herbicide at 20–25 DAT as recommended', pa:'ਨਿਰਾਈ 20–25 ਦਿਨ' },
      { day:42, type:'fert', en:'2nd N top-dress (2nd 1/3) at max tillering (~40–45 DAT)', pa:'ਦੂਜੀ N ਖੁਰਾਕ' },
      { day:60, type:'irrig', en:'Critical water management / AWD till milky stage', pa:'ਜਰੂਰੀ ਸਿੰਚਾਈ' },
      { day:80, type:'pest', en:'Pest scouting (BPH, leaf folder); manage as per PoP thresholds', pa:'ਬੀਪੀਐਚ, ਲੀਫ ਫੋਲਡਰ ਨਿਗਰਾਨੀ' },
      { day:110, type:'harvest', en:'Harvest at 20–22% grain moisture as per PoP', pa:'ਕਟਾਈ 20–22% ਨਮੀ' }
    ],

    Maize: [
      { day:0, type:'seed', en:'Sow recommended hybrid; seed treatment advised', pa:'ਹਾਈਬ੍ਰਿਡ ਬੀਜ' },
      { day:0, type:'fert', en:'Basal P & K + 1/3 N at sowing as per PoP', pa:'DAP/SSP + 1/3 N' },
      { day:12, type:'irrig', en:'Irrigate as needed; watch moisture', pa:'ਸਿੰਚਾਈ ਕਿਸੇ ਲੋੜ' },
      { day:18, type:'pest', en:'Early pest scouting (stem borer/FAW)', pa:'ਕੀਟ ਨਿਗਰਾਨੀ' },
      { day:25, type:'fert', en:'Top-dress N (2nd 1/3) at 4–5 leaf stage', pa:'ਦੂਜੀ N ਖੁਰਾਕ' },
      { day:45, type:'fert', en:'Top-dress N (final 1/3) pre-tasseling', pa:'ਤੀਜੀ N ਖੁਰਾਕ' },
      { day:105, type:'harvest', en:'Harvest at physiological maturity (black layer)', pa:'ਕਟਾਈ' }
    ],

    Cotton: [
      { day:0, type:'seed', en:'Sow Bt recommended hybrids; maintain recommended plant population', pa:'ਬੀਟੀ ਹਾਈਬ੍ਰਿਡ ਬੀਜ' },
      { day:0, type:'fert', en:'Basal P & K + part N per PoP', pa:'ਬੇਸਲ P&K' },
      { day:30, type:'fert', en:'Top-dress N at square initiation (first split)', pa:'N ਉਪਰਲੀ' },
      { day:35, type:'pest', en:'Pink bollworm monitoring (pheromone traps); follow PoP thresholds', pa:'ਪਿੰਕ ਬੌਲਵਰ ਨਿਗਰਾਨੀ' },
      { day:60, type:'irrig', en:'Irrigate at flowering and boll development stages', pa:'ਫੁੱਲਣ ਤੇ ਸਿੰਚਾਈ' },
      { day:150, type:'harvest', en:'First picking window; repeat picks at 10–12 day intervals', pa:'ਪਹਿਲੀ ਕਲੈਕਟ' }
    ],

    Moong: [
      { day:0, type:'seed', en:'Short-duration varieties recommended; sow as per window', pa:'ਛੋਟੀ ਮਿਆਦ ਦੀ ਬੀਜ' },
      { day:20, type:'weed', en:'Weed control/interculture at ~20–25 DAS', pa:'ਨਿਰਾਈ' },
      { day:40, type:'pest', en:'Flowering; watch pod-borer; manage as per PoP', pa:'ਪੌਡ ਬੋਰਰ ਨਿਗਰਾਨੀ' },
      { day:70, type:'harvest', en:'Harvest when pods mature', pa:'ਕਟਾਈ' }
    ],

    Mash: [
      { day:0, type:'seed', en:'Sow as per spacing; recommended varieties', pa:'ਬੀਜਾਈ' },
      { day:25, type:'weed', en:'Weed management', pa:'ਨਿਰਾਈ' },
      { day:65, type:'harvest', en:'Harvest at pod maturity', pa:'ਕਟਾਈ' }
    ],

    Bajra: [
      { day:0, type:'seed', en:'Sow in recommended window for fodder/grain', pa:'ਬਜਰਾ ਬੀਜਾਈ' },
      { day:25, type:'fert', en:'Top-dress/irrigate as per PoP', pa:'ਉਪਰਲੀ ਖੁਰਾਕ' },
      { day:80, type:'harvest', en:'Harvest at grain maturity', pa:'ਕਟਾਈ' }
    ],

    Sugarcane: [
      { day:0, type:'plant', en:'Planting setts; use recommended planting geometry', pa:'ਗੰਨੇ ਦੀ ਰੋਪਾਈ' },
      { day:30, type:'weed', en:'Earthing up & weed control', pa:'ਮਿੱਟੀ ਚੜ੍ਹਾਉਣਾ / ਨਿਰਾਈ' },
      { day:120, type:'fert', en:'Fertilizer splits & irrigation schedule per PoP (multi-split)', pa:'ਮਲ ਬੰਟਵਾਰ' },
      { day:365, type:'harvest', en:'First crushing ~10–12 months (follow sugar recovery & maturity)', pa:'ਕਟਾਈ 10–12 ਮਹੀਨੇ' }
    ]
  }
};

// UI refs
const seasonEl = qs('#season');
const cropEl = qs('#crop');
const sowEl = qs('#sowingDate');
const varEl = qs('#variety');
const incIrr = qs('#incIrr');
const incFert = qs('#incFert');
const incWeed = qs('#incWeed');
const incPP = qs('#incPP');
const generateBtn = qs('#generateBtn');
const resetBtn = qs('#resetBtn');
const scheduleList = qs('#scheduleList');
const summary = qs('#summary');
const langToggle = qs('#langToggle');
const downloadCSV = qs('#downloadCSV');
const downloadICS = qs('#downloadICS');
const printBtn = qs('#printBtn');

let currentSeason = seasonEl.value || 'Rabi';
let currentLang = 'en';

// Populate crop list based on season
function populateCrops() {
  const s = seasonEl.value;
  cropEl.innerHTML = '';
  const crops = Object.keys(DATA[s]).sort();
  crops.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    cropEl.appendChild(opt);
  });
}
seasonEl.addEventListener('change', populateCrops);
populateCrops();

// Language toggle
langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'pa' : 'en';
  langToggle.textContent = currentLang === 'en' ? 'ਪੰਜਾਬੀ' : 'English';
  // regenerate if schedule present
  if (scheduleList.dataset.rows) renderSchedule(JSON.parse(scheduleList.dataset.rows));
});

// Reset
resetBtn.addEventListener('click', () => {
  seasonEl.value = 'Rabi'; populateCrops();
  sowEl.value = ''; varEl.value = '';
  incIrr.checked = incFert.checked = incWeed.checked = incPP.checked = true;
  scheduleList.innerHTML = '<div class="empty">No schedule yet. Choose crop, date and click Generate Calendar.</div>';
  scheduleList.dataset.rows = '';
  summary.innerHTML = '';
});

// Generate
generateBtn.addEventListener('click', () => {
  const season = seasonEl.value;
  const crop = cropEl.value;
  const sowing = sowEl.value;
  if(!season || !crop){ alert('Select season and crop'); return; }
  if(!sowing){ alert('Pick sowing/transplanting date'); return; }
  const sowDate = new Date(sowing);
  const items = (DATA[season][crop] || []).filter(it => {
    if(!incFert.checked && it.type==='fert') return false;
    if(!incIrr.checked && it.type==='irrig') return false;
    if(!incWeed.checked && it.type==='weed') return false;
    if(!incPP.checked && it.type==='pest') return false;
    return true;
  }).sort((a,b)=>a.day-b.day);

  const rows = items.map((it, idx) => {
    const dt = addDays(sowDate, it.day);
    return {
      idx: idx+1,
      day: it.day,
      date_iso: dt.toISOString(),
      date_display: fmtDate(dt),
      type: it.type,
      text: currentLang === 'en' ? it.en : (it.pa || it.en),
      note: it.note || '',
      cite: it.cite || ''
    };
  });

  scheduleList.dataset.rows = JSON.stringify(rows);
  summary.innerHTML = `<div class="badge">Season: <b>${season}</b></div> <div class="badge">Crop: <b>${crop}</b></div> ${varEl.value?`<div class="badge">Variety: <b>${varEl.value}</b></div>`:''}`;
  renderSchedule(rows);
});

// Render schedule
function renderSchedule(rows){
  if(!rows || !rows.length){
    scheduleList.innerHTML = '<div class="empty">No tasks after applying filters.</div>';
    return;
  }
  let html = '';
  rows.forEach(r => {
    html += `<div class="task">
      <div style="flex:1">
        <div class="title">${r.text}</div>
        <div class="meta">${r.note? r.note + ' • ' : ''}DAS: ${r.day} • ${r.cite? 'Source: '+r.cite : ''}</div>
      </div>
      <div style="min-width:150px;text-align:right">
        <div class="date">${r.date_display}</div>
        <div class="tag">${r.type.toUpperCase()}</div>
      </div>
    </div>`;
  });
  scheduleList.innerHTML = html;
}

// CSV export
downloadCSV.addEventListener('click', () => {
  const rows = JSON.parse(scheduleList.dataset.rows || '[]');
  if(!rows.length){ alert('Generate a calendar first.'); return; }
  const header = ['Index','Date','DAS','Task','Notes'];
  const lines = [header.join(',')].concat(rows.map(r => [r.idx, `"${r.date_display}"`, r.day, `"${r.text.replace(/"/g,'""')}"`, `"${r.note.replace(/"/g,'""')}"`].join(',')));
  const blob = new Blob(["\uFEFF"+lines.join('\n')], {type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'crop_calendar_'+Date.now()+'.csv'; a.click();
});

// ICS export
downloadICS.addEventListener('click', () => {
  const rows = JSON.parse(scheduleList.dataset.rows || '[]');
  if(!rows.length){ alert('Generate a calendar first.'); return; }
  const now = new Date();
  function pad(n){return String(n).padStart(2,'0');}
  function toICSDate(d){
    const u = new Date(d);
    return u.getUTCFullYear()+pad(u.getUTCMonth()+1)+pad(u.getUTCDate())+'T'+pad(u.getUTCHours())+pad(u.getUTCMinutes())+'00Z';
  }
  let ics = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//PAU Crop Calendar//EN\r\nCALSCALE:GREGORIAN\r\n';
  rows.forEach(r => {
    const start = new Date(r.date_iso); const s = new Date(start); s.setHours(9,0,0,0); const e = new Date(start); e.setHours(10,0,0,0);
    ics += 'BEGIN:VEVENT\r\n';
    ics += 'UID:'+Date.now()+Math.random().toString(36).slice(2)+'@pau-calendar\r\n';
    ics += 'DTSTAMP:'+toICSDate(now)+'\r\n';
    ics += 'DTSTART:'+toICSDate(s)+'\r\n';
    ics += 'DTEND:'+toICSDate(e)+'\r\n';
    ics += 'SUMMARY:'+r.text.replace(/\r?\n/g,' ')+'\r\n';
    ics += 'DESCRIPTION:'+('DAS '+r.day+' • '+(r.note||'')+' • Source: '+(r.cite||'PAU'))+'\r\n';
    ics += 'END:VEVENT\r\n';
  });
  ics += 'END:VCALENDAR';
  const blob = new Blob([ics], {type:'text/calendar'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'crop_calendar_'+Date.now()+'.ics'; a.click();
});

// Print
printBtn.addEventListener('click', ()=>{ if(!scheduleList.dataset.rows){ alert('Generate a calendar first.'); return; } window.print(); });

// Init: select default season crops
populateCrops();
