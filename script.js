// --- utilities ---
const fmt = d=>new Date(d).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'2-digit'});
const addDays = (d,days)=>{ const nd=new Date(d); nd.setDate(nd.getDate()+days); return nd; };

// --- state & dom ---
const seasonEl = document.getElementById('season');
const cropEl = document.getElementById('crop');
const sowingEl = document.getElementById('sowing');
const varietyEl = document.getElementById('variety');
const summaryEl = document.getElementById('summary');
const tableWrap = document.getElementById('tableWrap');

// --- load json (baked-in for blogger; if you self-host, you can also fetch JSON) ---
let POP = null;
(async function bootstrap(){
  POP = window.POP_DATA; // from inline file
  // populate crops when season changes
  seasonEl.addEventListener('change', ()=>{
    const s = seasonEl.value;
    cropEl.innerHTML = '<option value="">-- Select Crop --</option>';
    if(!s || !POP[s]) return;
    Object.keys(POP[s]).forEach(c=>{
      const o=document.createElement('option'); o.value=c; o.textContent=c; cropEl.appendChild(o);
    });
  });

  document.getElementById('reset').addEventListener('click', ()=>{
    seasonEl.value=''; cropEl.innerHTML=''; sowingEl.value=''; varietyEl.value='';
    document.getElementById('incIrr').checked = document.getElementById('incFert').checked = document.getElementById('incWeed').checked = document.getElementById('incPP').checked = true;
    tableWrap.innerHTML=''; summaryEl.textContent='';
  });

  document.getElementById('generate').addEventListener('click', generate);
  document.getElementById('downloadCSV').addEventListener('click', downloadCSV);
  document.getElementById('downloadICS').addEventListener('click', downloadICS);
  document.getElementById('print').addEventListener('click', ()=>{ if(!tableWrap.dataset.rows){ alert('Generate a calendar first.'); return; } window.print(); });

  // Punjabi toggle (simple)
  const langToggle = document.getElementById('langToggle'); let lang='en';
  langToggle.addEventListener('click', ()=>{
    lang = (lang==='en'?'pa':'en'); langToggle.textContent = (lang==='en'?'ਪੰਜਾਬੀ':'English');
    document.querySelector('header h1').textContent = (lang==='en'?'PAU Crop Calendar / Scheduler':'ਪਾਅ ਫਸਲ ਕੈਲੰਡਰ / ਸ਼ੈਡਿਊਲਰ');
    document.getElementById('season').options[0].text = (lang==='en'?'-- Select Season --':'-- ਮੌਸਮ ਚੁਣੋ --');
  });
})();

function generate(){
  const season = seasonEl.value; const crop = cropEl.value; const sow = sowingEl.value;
  if(!season || !crop){ alert('Choose season and crop.'); return; }
  if(!sow){ alert('Pick sowing/transplanting date.'); return; }

  const include = {
    irrig: document.getElementById('incIrr').checked,
    fert:  document.getElementById('incFert').checked,
    weed:  document.getElementById('incWeed').checked,
    pp:    document.getElementById('incPP').checked
  };

  // resolve template, including variety logic if any
  const base = POP[season][crop];
  if(!base){ alert('Template not found.'); return; }

  const v = (varietyEl.value||'').trim();
  const tpl = chooseTemplate(base, v);

  // build items
  const all = [];
  // sowing row
  all.push({day:0, type:'Milestone', task: base.meta.sowingLabel || 'Sowing / Transplanting', note: base.meta.note||''});

  // irrigation
  if(include.irrig && tpl.irrigation){
    tpl.irrigation.forEach(x=>all.push({day:x.day, type:'Irrigation', task:x.title, note:x.note||''}));
  }

  // fertilizer
  if(include.fert && tpl.fertilizer){
    // basal
    if(tpl.fertilizer.basal){
      const b = tpl.fertilizer.basal;
      all.push({day:b.day||0, type:'Fertilizer', task:`Basal: ${b.text}`, note:b.note||''});
    }
    // splits
    (tpl.fertilizer.splits||[]).forEach(s=>{
      all.push({day:s.day, type:'Fertilizer', task:`Top-dress: ${s.text}`, note:s.note||''});
    });
  }

  // weed
  if(include.weed && tpl.weed){
    tpl.weed.forEach(w=>all.push({day:w.day, type:'Weed mgmt', task:w.title, note:w.note||''}));
  }

  // plant protection (scouting windows – product names intentionally omitted)
  if(include.pp && tpl.pp){
    tpl.pp.forEach(p=>all.push({day:p.day, type:'Plant protection', task:p.title, note:p.note||''}));
  }

  // harvest
  if(tpl.harvest){ all.push({day:tpl.harvest.day, type:'Harvest', task:'Harvest window', note: tpl.harvest.note||''}); }

  // filter/sort and render
  const sDate = new Date(sow);
  const rows = all
    .sort((a,b)=>a.day-b.day)
    .map((it,idx)=>{ const date = addDays(sDate,it.day); return { idx: idx+1, date: fmt(date), iso: date.toISOString(), das: it.day, task: `${it.type}: ${it.task}`, note: it.note || '' }; });

  summaryEl.innerHTML = `<div class="chips">
    <span class="chip">Season: <b>${season}</b></span>
    <span class="chip">Crop: <b>${crop}</b></span>
    ${v?`<span class="chip">Variety: <b>${v}</b></span>`:''}
    ${document.getElementById('area').value?`<span class="chip">Area: <b>${document.getElementById('area').value} ${document.getElementById('areaUnit').value}</b></span>`:''}
  </div>`;

  if(!rows.length){ tableWrap.innerHTML='<div style="padding:12px;color:var(--muted)">No tasks after applying filters.</div>'; tableWrap.dataset.rows='[]'; return; }

  tableWrap.dataset.rows = JSON.stringify(rows);
  let html = '<div style="overflow:auto"><table><thead><tr><th>#</th><th>Date</th><th>DAS</th><th>Task</th><th>Notes</th></tr></thead><tbody>';
  html += rows.map(r=>`<tr><td style="width:36px">${r.idx}</td><td>${r.date}</td><td>${r.das}</td><td>${r.task}</td><td>${r.note}</td></tr>`).join('');
  html += '</tbody></table></div>';
  tableWrap.innerHTML = html;
}

function chooseTemplate(base, variety){
  if(!variety) return base.template.default;
  const v = variety.toUpperCase().trim();
  // variety aliases
  for(const key of Object.keys(base.template)){
    if(key==='default') continue;
    const aliases = [key].concat(base.template[key].aliases||[]).map(s=>s.toUpperCase());
    if(aliases.some(a=>v.includes(a))) return base.template[key];
  }
  return base.template.default;
}

// CSV download
function downloadCSV(){
  const rows = JSON.parse(tableWrap.dataset.rows||'[]'); if(!rows.length){ alert('Generate a calendar first.'); return; }
  const header = ['Index','Date','DAS','Task','Notes'];
  const lines = [header.join(',')].concat(rows.map(r=>[r.idx, r.date, r.das, '"'+r.task.replace(/"/g,'""')+'"', '"'+r.note.replace(/"/g,'""')+'"'].join(',')));
  const blob = new Blob(["\ufeff"+lines.join('\n')],{type:'text/csv;charset=utf-8;'});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'crop_calendar_'+Date.now()+'.csv'; a.click();
}

// ICS download
function icsEscape(s){ return String(s).replace(/\\/g,'\\\\').replace(/\n/g,'\\n').replace(/\,/g,'\\,').replace(/;/g,'\\;'); }
function toICSDate(d){ const pad=n=>String(n).padStart(2,'0'); return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+'T'+pad(d.getUTCHours())+pad(d.getUTCMinutes())+'00Z'; }
function downloadICS(){
  const rows = JSON.parse(tableWrap.dataset.rows||'[]'); if(!rows.length){ alert('Generate a calendar first.'); return; }
  const now = new Date(); let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PAU Crop Calendar//EN\nCALSCALE:GREGORIAN\n';
  rows.forEach(r=>{ const start = new Date(r.iso); const s = new Date(start); s.setHours(9,0,0,0); const e = new Date(start); e.setHours(10,0,0,0);
    ics += 'BEGIN:VEVENT\n';
    ics += 'UID:'+Date.now()+Math.random().toString(36).slice(2)+'@pau-calendar\n';
    ics += 'DTSTAMP:'+toICSDate(now)+'\n';
    ics += 'DTSTART:'+toICSDate(s)+'\n';
    ics += 'DTEND:'+toICSDate(e)+'\n';
    ics += 'SUMMARY:'+icsEscape(r.task)+'\n';
    ics += 'DESCRIPTION:'+icsEscape('DAS '+r.das+' — '+r.note)+'\n';
    ics += 'END:VEVENT\n';
  });
  ics += 'END:VCALENDAR';
  const blob = new Blob([ics],{type:'text/calendar'}); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'crop_calendar_'+Date.now()+'.ics'; a.click();
}
