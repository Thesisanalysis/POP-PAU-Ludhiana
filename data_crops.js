<script>
/* ====== POP DATA (PAU 2024–25) ======
   All units are per acre unless noted. “DAS”=days after sowing/transplant.
   Rice values from PAU Kharif 2024–25 (pp. 9–10). Wheat/Mustard from Rabi 2024–25.
*/
window.POP_DATA = {
  "Kharif": {
    "Rice (Paddy)": {
      meta: {
        sowingLabel: "Transplanting / DSR",
        note: "Use soil-test values when available. K only on K-deficient soils."
      },
      template: {
        // PR 126 has lower N and earlier 3rd split
        "PR 126": {
          aliases: ["PR126"],
          irrigation: [
            { day: 0,  title: "Maintain 2–5 cm water", note: "Immediately after transplanting." },
            { day: 60, title: "AWD / critical irrigation", note: "Avoid stress till milky stage." }
          ],
          fertilizer: {
            basal: {
              day: 0,
              text:
                "Full P & K before/at transplanting: P₂O₅ 12 kg/ac (≈ 27 kg DAP or 75 kg SSP); K₂O 12 kg/ac (≈ 20 kg MOP in K-deficient fields)."
            },
            splits: [
              { day: 0,  text: "N 10.5 kg/ac (≈ 22.5 kg neem-coated urea) within 0–7 DAT — 1st split." },
              { day: 21, text: "N 10.5 kg/ac (≈ 22.5 kg urea) at active tillering — 2nd split." },
              { day: 35, text: "N 10.5 kg/ac (≈ 22.5 kg urea) — 3rd split (earlier for PR 126)." }
            ],
            totalsNote: "Total N ≈ 31.5 kg/ac via ≈ 67.5 kg urea; P₂O₅ 12; K₂O 12."
          },
          weed: [
            { day: 22, title: "Weeding / Herbicide (20–25 DAT)", note: "Use PAU-recommended product; correct nozzle & volume." }
          ],
          pp: [
            { day: 80, title: "Pest scouting (BPH/leaf folder)", note: "Weekly; spray only above PAU threshold." }
          ],
          harvest: { day: 110, note: "Harvest at recommended grain moisture." }
        },

        // PR 132 and “other varieties”
        "PR 132 / others": {
          aliases: ["PR 132", "PR132", "PR 114", "PR 121", "PR 130", "Other Varieties"],
          irrigation: [
            { day: 0,  title: "Maintain 2–5 cm water", note: "Immediately after transplanting." },
            { day: 60, title: "AWD / critical irrigation", note: "Avoid stress till milky stage." }
          ],
          fertilizer: {
            basal: {
              day: 0,
              text:
                "Full P & K before/at transplanting: P₂O₅ 12 kg/ac (≈ 27 kg DAP or 75 kg SSP); K₂O 12 kg/ac (≈ 20 kg MOP in K-deficient soils)."
            },
            splits: [
              { day: 0,  text: "N 14 kg/ac (≈ 30 kg neem-coated urea) within 0–7 DAT — 1st split." },
              { day: 21, text: "N 14 kg/ac (≈ 30 kg urea) at active tillering — 2nd split." },
              { day: 42, text: "N 14 kg/ac (≈ 30 kg urea) — 3rd split." }
            ],
            totalsNote: "Total N ≈ 42 kg/ac via ≈ 90 kg urea; P₂O₅ 12; K₂O 12."
          },
          weed: [
            { day: 22, title: "Weeding / Herbicide (20–25 DAT)", note: "Use PAU-recommended product; correct nozzle & volume." }
          ],
          pp: [
            { day: 80, title: "Pest scouting (BPH/leaf folder)", note: "Weekly; spray only above PAU threshold." }
          ],
          harvest: { day: 115, note: "Harvest at recommended grain moisture." }
        },
        "default": { $use: "PR 132 / others" }
      }
    },

    "Maize (hybrid/composite)": {
      meta: { sowingLabel: "Sowing", note: "Use soil-test K. Separate schedules for irrigated vs rainfed." },
      template: {
        "Irrigated (default)": {
          aliases: ["Irrigated", "default"],
          irrigation: [
            { day: 12, title: "Irrigation / moisture check", note: "Avoid early stress." },
            { day: 30, title: "Irrigation around 4–5 leaf stage", note: "Keep uniform moisture pre-tasseling." }
          ],
          fertilizer: {
            basal: {
              day: 0,
              text: "Basal: N 13.5 kg (~30 kg urea) + P₂O₅ 24 kg (≈ 55 kg DAP or 150 kg SSP)."
            },
            splits: [
              { day: 25, text: "N 13.5 kg (~30 kg urea) at 4–5 leaf stage." },
              { day: 45, text: "N 13.5 kg (~30 kg urea) pre-tasseling (final split)." }
            ],
            totalsNote: "Total N ≈ 40 kg/ac; P₂O₅ 24 kg/ac (irrigated)."
          },
          weed: [{ day: 20, title: "Weed control (20–25 DAS)", note: "Interculture or PAU herbicide." }],
          pp: [{ day: 18, title: "Scout stem borer / FAW", note: "Weekly; act on thresholds." }],
          harvest: { day: 105, note: "Harvest at physiological maturity (black layer)." }
        },
        "Rainfed": {
          aliases: ["Rainfed"],
          irrigation: [{ day: 0, title: "Moisture conservation", note: "Ridge–furrow, mulch where possible." }],
          fertilizer: {
            basal: {
              day: 0,
              text: "Basal: N 8.5 kg (~18.5 kg urea) + P₂O₅ 12 kg (~27 kg DAP or 75 kg SSP)."
            },
            splits: [
              { day: 25, text: "N 8.5 kg (~18.5 kg urea)." },
              { day: 45, text: "N 8.5 kg (~18.5 kg urea)." }
            ],
            totalsNote: "Total N ≈ 25 kg/ac; P₂O₅ 12 kg/ac (rainfed)."
          }
        }
      }
    },

    "Cotton": {
      meta: { sowingLabel: "Sowing", note: "Follow PAU variety & spacing. K and S based on soil test." },
      template: {
        "Bt hybrids": {
          aliases: ["Bt", "BGII", "Bt Hybrid"],
          irrigation: [
            { day: 30, title: "Irrigation at square initiation (~30 DAS)", note: "Critical at flowering." },
            { day: 60, title: "Irrigation at flowering/peak boll set", note: "Repeat as needed, avoid stress." }
          ],
          fertilizer: {
            basal: { day: 0, text: "Drill full P and ~⅓ N at sowing (exact N depends on situation per PAU table)." },
            splits: [
              { day: 30, text: "Top-dress ~⅓ N at square initiation." },
              { day: 60, text: "Top-dress final ~⅓ N at flowering." }
            ],
            doseNotes:
              "Consult the Cotton fertilizer table in PAU Kharif for exact N (often 45–60 kg N/ac total depending on irrigation/soil)."
          },
          weed: [{ day: 20, title: "Interculture / Weed management", note: "" }],
          pp: [{ day: 35, title: "Pink bollworm monitoring (pheromone traps)", note: "Weekly scouting; threshold-based sprays." }],
          harvest: { day: 150, note: "First picking window; repeat every 10–12 days." }
        },
        "default": { $use: "Bt hybrids" }
      }
    }
  },

  "Rabi": {
    "Wheat": {
      meta: {
        sowingLabel: "Sowing",
        note:
          "Medium-fertility soils. Use Leaf Colour Chart (LCC)–based adjustment for N where advised in PAU PoP."
      },
      template: {
        "default": {
          irrigation: [
            { day: 21, title: "1st Irrigation (CRI/tillering)", note: "Critical for tillering." },
            { day: 45, title: "2nd Irrigation (late tillering)", note: "" },
            { day: 85, title: "3rd Irrigation (flowering)", note: "" }
          ],
          fertilizer: {
            basal: {
              day: 0,
              text: "Drill full P at sowing: P₂O₅ 25 kg/ac (≈ 55 kg DAP or 155 kg SSP)."
            },
            splits: [
              { day: 21, text: "Top-dress ~40 kg urea/ac with 1st irrigation (CRI) per PAU Wheat section." },
              { day: 65, text: "Top-dress balance N based on LCC/PoP (~27.5 kg urea typical near booting)." }
            ],
            totalsNote:
              "Typical total N around 50 kg/ac (≈ 110 kg urea) — confirm with PAU LCC guidance and previous crop P status."
          },
          weed: [
            { day: 20, title: "Weed control (20–25 DAS)", note: "Use PAU-recommended herbicide and nozzle." }
          ],
          pp: [
            { day: 100, title: "Scout for rusts/aphids", note: "Spray only when above threshold; see PAU fungicide table." }
          ],
          harvest: { day: 140, note: "Harvest near ~20% grain moisture; dry properly." }
        }
      }
    },

    "Rapeseed–Mustard (Gobhi sarson / Raya)": {
      meta: { sowingLabel: "Sowing / Transplanting", note: "K only on K-deficient soils." },
      template: {
        "default": {
          irrigation: [
            { day: 10, title: "Light irrigation (post rauni)", note: "If needed." },
            { day: 30, title: "Irrigation at branching/flower initiation", note: "Avoid stress during flowering to seed filling." }
          ],
          fertilizer: {
            basal: {
              day: 0,
              text:
                "Irrigated: N 40 + P₂O₅ 12 (+ K₂O 6 if K-deficient). Drill ½ N + full P (and K if needed) at sowing/transplanting. ≈ Urea 90 kg/ac + SSP 75 kg/ac; add MOP 10 kg/ac only if K-deficient."
            },
            splits: [
              { day: 21, text: "Top-dress remaining ½ N (≈ 45 kg urea) with 1st irrigation." }
            ],
            totalsNote: "Total N 40; P₂O₅ 12; add K only when soil test shows deficiency."
          },
          weed: [
            { day: 21, title: "1st hoeing (3–4 WAS)", note: "2nd hoeing ~3 weeks later if needed." }
          ],
          harvest: { day: 110, note: "Harvest when siliquae turn yellow and seeds harden." }
        }
      }
    }
  }
};
</script>
