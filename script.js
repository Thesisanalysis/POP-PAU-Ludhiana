// ---------- helpers ----------
const byId = (id) => document.getElementById(id);
const fmt = (d) => new Date(d).toLocaleDateString(undefined, {year:"numeric", month:"short", day:"2-digit"});
const addDays = (d, n) => { const dt = new Date(d); dt.setDate(dt.getDate() + n); return dt; };

// ---------- elements ----------
const seasonEl  = byId("season");
const cropEl    = byId("crop");
const varietyEl = byId("variety");
const sowingEl  = byId("sowing");
const summaryEl = byId("summary");
const tableWrap = byId("tableWrap");

// ---------- populate crops & varieties ----------
function loadCrops() {
  cropEl.innerHTML = '<option value="">-- Select Crop --</option>';
  varietyEl.innerHTML = '<option value="">-- Auto / Default --</option>';
  const season = seasonEl.value;
  if (!season || !window.POP_DATA || !window.POP_DATA[season]) return;
  Object.keys(window.POP_DATA[season]).forEach(c => {
    const o = document.createElement("option");
    o.value = c; o.textContent = c;
    cropEl.appendChild(o);
  });
}

function loadVarieties() {
  varietyEl.innerHTML = '<option value="">-- Auto / Default --</option>';
  const season = seasonEl.value, crop = cropEl.value;
  if (!season || !crop) return;
  const tpl = window.POP_DATA[season][crop]?.template || {};
  Object.keys(tpl).forEach(v => {
    if (v === "default" || v === "$use") return;
    const o = document.createElement("option");
    o.value = v; o.textContent = v;
    varietyEl.appendChild(o);
  });
}

seasonEl.addEventListener("change", loadCrops);
cropEl.addEventListener("change", loadVarieties);

// ---------- generate table ----------
function resolveTemplate(season, crop, variety) {
  const base = window.POP_DATA[season][crop];
  const templ = base.template;
  let vKey = variety && templ[variety] ? variety : "default";
  if (vKey === "default" && templ.default && templ.default.$use) vKey = templ.default.$use;
  const picked = templ[vKey] || {};
  return { meta: base.meta || {}, plan: picked };
}

function buildRows(plan, sowingDate, includeFlags) {
  const rows = [];
  // Fertilizer: basal + splits (if included)
  if (includeFlags.fert && plan.fertilizer) {
    if (plan.fertilizer.basal) {
      rows.push({ day: plan.fertilizer.basal.day, task: "Fertilizer — Basal", note: plan.fertilizer.basal.text });
    }
    if (Array.isArray(plan.fertilizer.splits)) {
      plan.fertilizer.splits.forEach((s, i) => {
        rows.push({ day: s.day, task: `Fertilizer — Split ${i+1}`, note: s.text });
      });
    }
    if (plan.fertilizer.totalsNote) {
      rows.push({ day: 0, task: "Fertilizer — Totals (info)", note: plan.fertilizer.totalsNote });
    }
    if (plan.fertilizer.doseNotes) {
      rows.push({ day: 0, task: "Fertilizer — Note", note: plan.fertilizer.doseNotes });
    }
  }

  // Irrigation
  if (includeFlags.irrig && Array.isArray(plan.irrigation)) {
    plan.irrigation.forEach(it => rows.push({ day: it.day, task: "Irrigation", note: `${it.title}${it.note?": "+it.note:""}` }));
  }

  // Weed management
  if (includeFlags.weed && Array.isArray(plan.weed)) {
    plan.weed.forEach(it => rows.push({ day: it.day, task: "Weed management", note: `${it.title}${it.note?": "+it.note:""}` }));
  }

  // Plant protection
  if (includeFlags.pp && Array.isArray(plan.pp)) {
    plan.pp.forEach(it => rows.push({ day: it.day, task: "Plant protection", note: `${it.title}${it.note?": "+it.note:""}` }));
  }

  // Harvest (always included)
  if (plan.harvest) {
    rows.push({ day: plan.harvest.day, task: "Harvest window", note: plan.harvest.note || "" });
  }

  // Convert to dated rows
  rows.sort((a,b)=>a.day-b.day);
  const sDate = new Date(sowingDate);
  return rows.map((r, idx) => {
    const d = addDays(sDate, r.day);
    return { idx: idx+1, date: fmt(d), iso: d.toISOString(), das: r.day, task: r.task, note: r.note||"" };
  });
}

function showRows(rows, meta, season, crop, variety) {
  summaryEl.innerHTML = `
    <div class="chips">
      <span class="chip">Season: <b>${season}</b></span>
      <span class="chip">Crop: <b>${crop}</b></span>
      ${variety ? `<span class="chip">Variety/Condition: <b>${variety}</b></span>` : ""}
      ${meta?.note ? `<span class="chip">${meta.note}</span>` : ""}
      ${byId("area").value ? `<span class="chip">Area: <b>${byId("area").value} ${byId("areaUnit").value}</b></span>` : ""}
    </div>
  `;

  if (!rows.length) {
    tableWrap.dataset.rows = "[]";
    tableWrap.innerHTML = '<div style="padding:12px;color:#557">No tasks for the selected filters.</div>';
    return;
  }

  tableWrap.dataset.rows = JSON.stringify(rows);
  let html = '<div style="overflow:auto"><table><thead><tr><th>#</th><th>Date</th><th>DAS</th><th>Task</th><th>Notes</th></tr></thead><tbody>';
  html += rows.map(r => `<tr><td style="width:36px">${r.idx}</td><td>${r.date}</td><td>${r.das}</td><td>${r.task}</td><td>${r.note}</td></tr>`).join("");
  html += "</tbody></table></div>";
  tableWrap.innerHTML = html;
}

byId("generate").addEventListener("click", () => {
  const season = seasonEl.value, crop = cropEl.value, sow = sowingEl.value;
  if (!season || !crop) { alert("Choose season and crop."); return; }
  if (!sow) { alert("Pick sowing/transplanting date."); return; }
  const inc = {
    irrig: byId("incIrr").checked,
    fert:  byId("incFert").checked,
    weed:  byId("incWeed").checked,
    pp:    byId("incPP").checked
  };
  const { meta, plan } = resolveTemplate(season, crop, varietyEl.value);
  const rows = buildRows(plan, sow, inc);
  showRows(rows, meta, season, crop, varietyEl.value);
});

byId("reset").addEventListener("click", () => {
  seasonEl.value = ""; cropEl.innerHTML = '<option value="">-- Select Crop --</option>';
  varietyEl.innerHTML = '<option value="">-- Auto / Default --</option>';
  sowingEl.value = ""; byId("area").value = "";
  ["incIrr","incFert","incWeed","incPP"].forEach(id => byId(id).checked = true);
  summaryEl.textContent = ""; tableWrap.innerHTML = ""; tableWrap.dataset.rows = "[]";
});

// ---------- CSV ----------
byId("downloadCSV").addEventListener("click", () => {
  const rows = JSON.parse(tableWrap.dataset.rows || "[]");
  if (!rows.length) { alert("Generate a calendar first."); return; }
  const header = ["Index","Date","DAS","Task","Notes"];
  const lines = [header.join(",")].concat(rows.map(r =>
    [r.idx, r.date, r.das, `"${r.task.replace(/"/g,'""')}"`, `"${r.note.replace(/"/g,'""')}"`].join(",")
  ));
  const blob = new Blob(["\ufeff" + lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = "crop_calendar_"+Date.now()+".csv"; a.click();
});

// ---------- ICS ----------
function icsDate(d){
  const pad = (n)=>String(n).padStart(2,"0");
  return d.getUTCFullYear()+pad(d.getUTCMonth()+1)+pad(d.getUTCDate())+"T"+pad(d.getUTCHours())+pad(d.getUTCMinutes())+"00Z";
}
function escICS(s){ return String(s).replace(/\\/g,"\\\\").replace(/\n/g,"\\n").replace(/,/g,"\\,").replace(/;/g,"\\;"); }

byId("downloadICS").addEventListener("click", () => {
  const rows = JSON.parse(tableWrap.dataset.rows || "[]");
  if (!rows.length) { alert("Generate a calendar first."); return; }
  const now = new Date();
  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//PAU Crop Calendar//EN\nCALSCALE:GREGORIAN\n";
  rows.forEach(r => {
    const start = new Date(r.iso); const s = new Date(start); s.setHours(9,0,0,0);
    const e = new Date(start); e.setHours(10,0,0,0);
    ics += "BEGIN:VEVENT\n";
    ics += "UID:"+Date.now()+Math.random().toString(36).slice(2)+"@pau-calendar\n";
    ics += "DTSTAMP:"+icsDate(now)+"\n";
    ics += "DTSTART:"+icsDate(s)+"\n";
    ics += "DTEND:"+icsDate(e)+"\n";
    ics += "SUMMARY:"+escICS(r.task)+"\n";
    ics += "DESCRIPTION:"+escICS("DAS "+r.das+" — "+r.note)+"\n";
    ics += "END:VEVENT\n";
  });
  ics += "END:VCALENDAR";
  const blob = new Blob([ics], { type:"text/calendar" });
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
  a.download = "crop_calendar_"+Date.now()+".ics"; a.click();
});

// ---------- Print ----------
byId("print").addEventListener("click", () => {
  const rows = JSON.parse(tableWrap.dataset.rows || "[]");
  if (!rows.length) { alert("Generate a calendar first."); return; }
  window.print();
});

// Initialize if season pre-selected (Blogger sometimes restores form state)
if (seasonEl.value) loadCrops();
