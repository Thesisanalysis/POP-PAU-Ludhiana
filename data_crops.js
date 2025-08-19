<script>
window.POP_DATA = {
  "Kharif": {
    "Paddy (Rice)": {
      "meta": { "sowingLabel":"Transplanting / DSR", "note":"Apply fertilizers on soil test basis. Doses below are for medium fertility soils." },
      "template": {
        /* PR 126 has lower N and earlier 3rd split */
        "PR 126": {
          "aliases":["PR126"],
          "irrigation":[
            {"day":0, "title":"Maintain 2–5 cm water", "note":"Shallow water immediately after transplanting (as per system)."},
            {"day":60, "title":"AWD/critical irrigation", "note":"Avoid stress till milky stage."}
          ],
          "fertilizer":{
            "basal": { "day":0, "text":"Full P & K before/at transplanting: P₂O₅ 12 kg/ac (~27 kg DAP or 75 kg SSP); K₂O 12 kg/ac (~20 kg MOP in K-deficient soils). Reduce urea by 10 kg if 27 kg DAP is used on P-deficient soils.", "note":"" },
            "splits":[
              {"day":0, "text":"N 10.5 kg/ac (≈ 22.5 kg neem-coated urea) within 0–7 DAT", "note":"1st split"},
              {"day":21, "text":"N 10.5 kg/ac (≈ 22.5 kg urea)", "note":"2nd split at tillering"},
              {"day":35, "text":"N 10.5 kg/ac (≈ 22.5 kg urea)", "note":"3rd split (earlier for PR 126)"}
            ]
          },
          "weed":[
            {"day":22, "title":"Weeding/Herbicide (20–25 DAT)", "note":"Use PAU-recommended product and nozzle; follow label & PoP thresholds."}
          ],
          "pp":[
            {"day":80, "title":"Scouting (BPH/leaf folder)", "note":"Weekly scouting; spray only when above PoP threshold."}
          ],
          "harvest":{"day":110, "note":"Harvest at recommended grain moisture."}
        },

        /* PR 132 and “all other varieties” use higher N and third split at ~42 DAT */
        "PR 132": {
          "aliases":["PR132","Other Varieties","PR 114","PR 121","PR 130"],
          "irrigation":[
            {"day":0, "title":"Maintain 2–5 cm water", "note":"Shallow water after transplanting."},
            {"day":60, "title":"AWD/critical irrigation", "note":"Avoid stress till milky stage."}
          ],
          "fertilizer":{
            "basal": { "day":0, "text":"Full P & K at transplanting: P₂O₅ 12 kg/ac (~27 kg DAP or 75 kg SSP); K₂O 12 kg/ac (~20 kg MOP in K-deficient soils). Reduce urea by 10 kg if 27 kg DAP is used on P-deficient soils.", "note":"" },
            "splits":[
              {"day":0, "text":"N 14 kg/ac (≈ 30 kg urea) within 0–7 DAT", "note":"1st split"},
              {"day":21, "text":"N 14 kg/ac (≈ 30 kg urea)", "note":"2nd split at tillering"},
              {"day":42, "text":"N 14 kg/ac (≈ 30 kg urea)", "note":"3rd split"}
            ]
          },
          "weed":[
            {"day":22, "title":"Weeding/Herbicide (20–25 DAT)", "note":"Use PAU-recommended product and nozzle; follow label & PoP thresholds."}
          ],
          "pp":[
            {"day":80, "title":"Scouting (BPH/leaf folder)", "note":"Weekly scouting; spray only when above PoP threshold."}
          ],
          "harvest":{"day":115, "note":"Harvest at recommended grain moisture."}
        },

        /* default: “all other varieties” behaviour */
        "default": { "$use":"PR 132" }
      }
    },

    "Maize (hybrid/composite)": {
      "meta": { "sowingLabel":"Sowing", "note":"Irrigated dose shown; rainfed option included below." },
      "template": {
        "default": {
          "irrigation":[
            {"day":12, "title":"Irrigation / moisture check", "note":"As needed."},
            {"day":30, "title":"Irrigation around 4–5 leaf stage", "note":"Avoid water stress pre-tasseling."}
          ],
          "fertilizer":{
            "basal": { "day":0, "text":"Basal: P₂O₅ 24 kg/ac (~55 kg DAP or 150 kg SSP) + N 13.5 kg/ac (~30 kg urea) + K as per soil test.", "note":"Irrigated conditions: total N 40, P₂O₅ 24 kg/ac." },
            "splits":[
              {"day":25, "text":"N 13.5 kg/ac (~30 kg urea) at 4–5 leaf stage", "note":"2nd split"},
              {"day":45, "text":"N 13.5 kg/ac (~30 kg urea) pre-tasseling", "note":"Final split"}
            ]
          },
          "weed":[{"day":20, "title":"Weed control / interculture (20–25 DAS)", "note":""}],
          "pp":[{"day":18, "title":"Scout stem borer/FAW", "note":"Weekly scouting; manage as per PoP thresholds."}],
          "harvest":{"day":105, "note":"Physiological maturity (black layer)."}
        },
        "Rainfed": {
          "aliases":["Rainfed"],
          "irrigation":[{"day":0,"title":"Conserve moisture","note":"Ridge/furrow; mulch where possible."}],
          "fertilizer":{
            "basal": { "day":0, "text":"Basal for rainfed: N 8.5 kg/ac (~18.5 kg urea) + P₂O₅ 12 kg/ac (~27 kg DAP or 75 kg SSP).", "note":"Total N 25, P₂O₅ 12 kg/ac." },
            "splits":[
              {"day":25, "text":"N 8.5 kg/ac (~18.5 kg urea)", "note":""},
              {"day":45, "text":"N 8.5 kg/ac (~18.5 kg urea)", "note":""}
            ]
          }
        }
      }
    },

    "Cotton (Bt & non-Bt)": {
      "meta": { "sowingLabel":"Sowing", "note":"Follow PAU spacing and varieties. Use soil test for K." },
      "template": {
        "Bt hybrids": {
          "aliases":["BT","Bt Hybrid","BGII"],
          "irrigation":[
            {"day":30, "title":"Irrigation at square initiation (~30 DAS)", "note":"Critical irrigation at flowering."},
            {"day":60, "title":"Irrigation at flowering/peak boll set", "note":""}
          ],
          "fertilizer":{
            "basal": { "day":0, "text":"Drill full P and 1/3 N at sowing. (Dose examples below)", "note":"" },
            "splits":[
              {"day":30, "text":"Top-dress 1/3 N at square initiation", "note":""},
              {"day":60, "text":"Top-dress final 1/3 N at flowering", "note":""}
            ],
            "doseNotes":"See PoP cotton table for district & irrigation-specific doses (e.g., 45–60 kg N/ac typical; use 90–120 kg urea total depending on situation)."
          },
          "weed":[{"day":20,"title":"Interculture/Weed management","note":""}],
          "pp":[{"day":35,"title":"Pink bollworm monitoring (pheromone traps)","note":"Weekly scouting; act on threshold."}],
          "harvest":{"day":150,"note":"First picking window; repeat every 10–12 days."}
        },
        "default": {"$use":"Bt hybrids"}
      }
    }
  },

  "Rabi": {
    "Wheat": {
      "meta": { "sowingLabel":"Sowing", "note":"Medium fertility soils; apply on soil test basis where available." },
      "template": {
        "default": {
          "irrigation":[
            {"day":21, "title":"1st Irrigation (CRI/tillering)", "note":"Critical for tillering."},
            {"day":45, "title":"2nd Irrigation (late tillering)", "note":""},
            {"day":85, "title":"3rd Irrigation (flowering)", "note":""}
          ],
          "fertilizer":{
            "basal": { "day":0, "text":"Drill full P and 1/2 N at sowing: P₂O₅ 25 kg/ac (~55 kg DAP or 155 kg SSP); N total 50 kg/ac (~110 kg neem-coated urea).", "note":"From PAU Rabi 2024–25 wheat table." },
            "splits":[
              {"day":21, "text":"Top-dress 1/4 N (~27.5 kg urea) with 1st irrigation", "note":""},
              {"day":65, "text":"Top-dress 1/4 N (~27.5 kg urea) around booting", "note":""}
            ]
          },
          "weed":[{"day":20,"title":"Weed control (20–25 DAS)","note":"Use PAU-recommended herbicide & nozzle."}],
          "pp":[{"day":100,"title":"Scout for rusts/aphids","note":"Spray only when above PoP threshold."}],
          "harvest":{"day":140,"note":"Harvest at ~20% grain moisture; dry properly."}
        }
      }
    },

    "Gobhi Sarson / Raya (rapeseed-mustard)": {
      "meta": { "sowingLabel":"Sowing / Transplanting (where advised)", "note":"Apply on soil test basis; K only on K-deficient soils." },
      "template": {
        "default": {
          "irrigation":[
            {"day":10, "title":"Irrigation after pre-sowing irrigation (rauni)", "note":"Light irrigation if needed."},
            {"day":30, "title":"Irrigation at branching/flower initiation", "note":"Avoid stress during flowering to seed filling."}
          ],
          "fertilizer":{
            "basal": { "day":0, "text":"Under irrigated conditions (direct seeded or transplanted): N 40 + P₂O₅ 12 (+K₂O 6 in K-deficient soils). Drill 1/2 N + full P (and K if needed) at sowing/transplanting ~ ⇒ Urea 90 kg/ac + SSP 75 kg/ac; add MOP 10 kg/ac only if K-deficient.", "note":"Raya, Gobhi sarson, African sarson." },
            "splits":[
              {"day":21, "text":"Top-dress remaining 1/2 N (~45 kg urea) with 1st irrigation", "note":""}
            ]
          },
          "weed":[
            {"day":21,"title":"1st hoeing (3–4 WAS)","note":"Second hoeing 3 weeks later if required."}
          ],
          "harvest":{"day":110,"note":"Harvest when siliquae turn yellow and seeds harden."}
        }
      }
    }
  }
};
</script>
