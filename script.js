/* script.js – English-only logic (expects window.POP_DATA from data_crops.js) */

/* ========== Utils ========== */
const fmt = d =>
  new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "2-digit" });

const addDays = (d, days) => {
  const nd = new Date(d);
  nd.setDate(nd.getDate() + days);
  return nd;
};

const byDay = (a, b) => a.day - b.day;

/* ICS helpers (all-day events for simplicity) */
const pad2 = n => String(n).padStart(2, "0");
const yyyymmdd = d => `${d.getUTCFullYear()}${pad2(d.getUTCMonth() + 1)}${pad2(d.getUTCDate())}`;
const icsEscape = s =>
  String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,");

/* CSV helpers */
const csvEscape = s => `"${String(s || "").replace(/"/g, '""')}"`;

/* ========== DOM ========== */
const seasonEl = document.getElementById("season");
const cropEl = document.getElementById("crop");
const sowingEl = document.getElementById("sowing");
const varietyEl = document.getElementById("variety");
const summaryEl = document.getElementById("summary");
const tableWrap = document.getElementById("tableWrap");

const incIrrEl = document.getElementById("incIrr");
const incFertEl = document.getElementById("incFert");
const incWeedEl = document.getElementById("incWeed");
const incPPEl = document.getElementById("incPP");

/* ========== Data plumbing ========== */
function loadCrops() {
  const s = seasonEl.value;
  cropEl.innerHTML = '<option value="">-- Select Crop --</option>';
  if (!s || !window.POP_DATA || !window.POP_DATA[s]) return;
  Object.keys(window.POP_DATA[s]).forEach(cropName => {
    if (cropName === "_labelPa") return; // ignore any label helpers if present
    const o = document.createElement("option");
    o.value = cropName;
    o.textContent = cropName;
    cropEl.appendChild(o);
  });
}

seasonEl.addEventListener("change", loadCrops);

document.getElementById("reset").addEventListener("click", () => {
  seasonEl.value = "";
  cropEl.innerHTML = "";
  sowingEl.value = "";
  varietyEl.value = "";
  incIrrEl.checked = incFertEl.checked = incWeedEl.checked = incPPEl.checked = true;
  tableWrap.innerHTML = "";
  tableWrap.dataset.rows = "[]";
  summaryEl.textContent = "";
});

/* Resolve which variant/template to use for a crop (uses variety input loosely) */
function resolveVariant(template, varietyInput) {
  if (!template) return null;
  const keys = Object.keys(template);

  // If variety provided, try exact key match first
  if (varietyInput) {
    const exact = keys.find(k => k.toLowerCase() === varietyInput.toLowerCase());
    if (exact) return template[exact];

    // Try alias match
    for (const k of keys) {
      const t = template[k];
      if (t && Array.isArray(t.aliases)) {
        const hit = t.aliases.some(a => a.toLowerCase() === varietyInput.toLowerCase());
        if (hit) return t;
      }
    }
  }

  // If "default" points to another key via $use
  if (template.default && template.default.$use && template[template.default.$use]) {
    return template[template.default.$use];
  }

  // If a "default" object with real content
  if (template.default && !template.default.$use) {
    return template.default;
  }

  // Otherwise first key
  return template[keys[0]];
}

function buildEvents(chosen, includes) {
  if (!chosen) return [];

  const events = [];

  // Fertilizer: basal + splits
  if (chosen.fertilizer) {
    if (includes.fert && chosen.fertilizer.basal) {
      events.push({
        day: chosen.fertilizer.basal.day || 0,
        category: "Fertilizer",
        title: "Basal application",
        desc: chosen.fertilizer.basal.text || chosen.fertilizer.basal.note || ""
      });
    }
    if (includes.fert && Array.isArray(chosen.fertilizer.splits)) {
      chosen.fertilizer.splits.forEach(s =>
        events.push({
          day: s.day ?? 0,
          category: "Fertilizer",
          title: s.note ? `Fertilizer split — ${s.note}` : "Fertilizer split",
          desc: s.text || ""
        })
      );
    }
  }

  // Irrigation
  if (includes.irrig && Array.isArray(chosen.irrigation)) {
    chosen.irrigation.forEach(i =>
      events.push({
        day: i.day ?? 0,
        category: "Irrigation",
        title: i.title || "Irrigation",
        desc: i.note || ""
      })
    );
  }

  // Weed management
  if (includes.weed && Array.isArray(chosen.weed)) {
    chosen.weed.forEach(w =>
      events.push({
        day: w.day ?? 0,
        category: "Weed management",
        title: w.title || "Weed management",
        desc: w.note || ""
      })
    );
  }

  // Plant protection
  if (includes.pp && Array.isArray(chosen.pp)) {
    chosen.pp.forEach(p =>
      events.push({
        day: p.day ?? 0,
        category: "Plant protection",
        title: p.title || "Plant protection",
        desc: p.note || ""
      })
    );
  }

  // Harvest (always include as a milestone; doesn’t depend on toggles)
  if (chosen.harvest && (typeof chosen.harvest.day === "number")) {
    events.push({
      day: chosen.harvest.day,
      category: "Harvest",
      title: "Harvest window",
      desc: chosen.harvest.note || ""
    });
  }

  return events.sort(byDay);
}

/* Generate table */
document.getElementById("generate").addEventListener("click", () => {
  const season = seasonEl.value;
  const crop = cropEl.value;
  const sow = sowingEl.value;

  if (!season || !crop) {
    alert("Choose season and crop.");
    return;
  }
  if (!sow) {
    alert("Pick sowing/transplanting date.");
    return;
  }

  const data = window.POP_DATA?.[season]?.[crop];
  if (!data || !data.template) {
    alert("No template found for this crop.");
    return;
  }

  const includes = {
    irrig: incIrrEl.checked,
    fert: incFertEl.checked,
    weed: incWeedEl.checked,
    pp: incPPEl.checked
  };

  const chosen = resolveVariant(data.template, (varietyEl.value || "").trim());
  if (!chosen) {
    alert("No variety/type template available.");
    return;
  }

  const meta = data.meta || {};
  const events = buildEvents(chosen, includes);

  const sDate = new Date(sow);
  const rows = events.map((e, idx) => {
    const date = addDays(sDate, e.day || 0);
    return {
      idx: idx + 1,
      date: fmt(date),
      dateISO: new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString(), // for ICS DTSTAMP
      das: e.day || 0,
      category: e.category,
      title: e.title,
      desc: e.desc || ""
    };
  });

  summaryEl.innerHTML =
    `<div class="chips">
      <span class="chip">Season: <b>${season}</b></span>
      <span class="chip">Crop: <b>${crop}</b></span>
      ${varietyEl.value ? `<span class="chip">Variety/Type: <b>${varietyEl.value}</b></span>` : ""}
      ${document.getElementById("area").value ? `<span class="chip">Area: <b>${document.getElementById("area").value} ${document.getElementById("areaUnit").value}</b></span>` : ""}
      ${meta.note ? `<span class="chip">${meta.note}</span>` : ""}
    </div>`;

  if (!rows.length) {
    tableWrap.innerHTML = '<div style="padding:12px;color:var(--muted)">No tasks after applying filters.</div>';
    tableWrap.dataset.rows = "[]";
    return;
  }

  tableWrap.dataset.rows = JSON.stringify(rows);

  let html = '<div style="overflow:auto"><table><thead><tr>' +
    '<th>#</th><th>Date</th><th>DAS</th><th>Category</th><th>Task</th><th>Notes</th>' +
    '</tr></thead><tbody>';

  html += rows.map(r =>
    `<tr>
      <td style="width:36px">${r.idx}</td>
      <td>${r.date}</td>
      <td>${r.das}</td>
      <td>${r.category}</td>
      <td>${r.title}</td>
      <td>${r.desc}</td>
    </tr>`
  ).join("");

  html += "</tbody></table></div>";
  tableWrap.innerHTML = html;
});

/* CSV download */
document.getElementById("downloadCSV").addEventListener("click", () => {
  const rows = JSON.parse(tableWrap.dataset.rows || "[]");
  if (!rows.length) {
    alert("Generate a calendar first.");
    return;
  }
  const header = ["Index", "Date", "DAS", "Category", "Task", "Notes"];
  const lines = [header.join(",")].concat(
    rows.map(r => [r.idx, csvEscape(r.date), r.das, csvEscape(r.category), csvEscape(r.title), csvEscape(r.desc)].join(","))
  );
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "crop_calendar_" + Date.now() + ".csv";
  a.click();
});

/* ICS download (all-day events) */
document.getElementById("downloadICS").addEventListener("click", () => {
  const rows = JSON.parse(tableWrap.dataset.rows || "[]");
  if (!rows.length) {
    alert("Generate a calendar first.");
    return;
  }
  const now = new Date();
  let ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//PAU Crop Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:PAU Crop Calendar",
    "X-WR-TIMEZONE:Asia/Kolkata"
  ].join("\r\n") + "\r\n";

  rows.forEach(r => {
    const d = new Date(r.dateISO);
    const dUTC = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())); // all-day date
    ics += [
      "BEGIN:VEVENT",
      `UID:${Date.now()}-${Math.random().toString(36).slice(2)}@pau-calendar`,
      `DTSTAMP:${yyyymmdd(now)}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`,
      `DTSTART;VALUE=DATE:${yyyymmdd(dUTC)}`,
      `SUMMARY:${icsEscape(`${r.category}: ${r.title}`)}`,
      `DESCRIPTION:${icsEscape(`DAS ${r.das} — ${r.desc || ""}`)}`,
      "END:VEVENT"
    ].join("\r\n") + "\r\n";
  });

  ics += "END:VCALENDAR";

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "crop_calendar_" + Date.now() + ".ics";
  a.click();
});

/* Print */
document.getElementById("print").addEventListener("click", () => {
  if (!tableWrap.dataset.rows) {
    alert("Generate a calendar first.");
    return;
  }
  window.print();
});

/* Init crops if season preselected */
if (seasonEl.value) loadCrops();
