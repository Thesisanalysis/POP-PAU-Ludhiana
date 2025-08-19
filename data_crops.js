// data_crops.js
// Crop Package of Practices - PAU (English only)

const cropData = {
    "Wheat": {
        season: "Rabi",
        sowingTime: "Nov 1 - Nov 15 (Timely); up to Dec 15 (Late)",
        varieties: "PBW 725, PBW 677, PBW 826 (timely); WH 1105 (late)",
        seedRate: "40 kg/acre (row sowing); 50 kg/acre (broadcasting)",
        fertilizer: "N: 55 kg (2 bags urea), P2O5: 24 kg (1 bag DAP), K2O: 12 kg (20 kg MOP) per acre. Apply half N + full P & K at sowing, remaining N at 1st irrigation.",
        irrigation: "First irrigation at CRI (20–25 DAS), then at 40–45 DAS, booting, flowering and milking stage. 4–5 irrigations in total.",
        plantProtection: "Weeds: Apply Pendimethalin 1 L/acre as pre-emergence. Insects/Diseases: Spray recommended fungicides/insecticides as per incidence."
    },
    "Paddy": {
        season: "Kharif",
        sowingTime: "May 25 – June 10 (nursery); transplant by June 20 – July 5",
        varieties: "PR 126, PR 121, PR 131 (recommended PAU varieties)",
        seedRate: "8 kg/acre for nursery",
        fertilizer: "N: 60 kg (5 bags urea), P2O5: 24 kg (1 bag DAP), K2O: 12 kg (20 kg MOP) per acre. Apply 1/3 N + full P & K at puddling; rest N in 2 equal splits at tillering and panicle initiation.",
        irrigation: "Maintain standing water 5–7 cm. First irrigation 2–3 days after transplanting, then continuous ponding till maturity.",
        plantProtection: "Weeds: Butachlor 1.25 L/acre or Bispyribac 100 ml/acre. Pests: Apply Chlorantraniliprole/Thiamethoxam as per recommendation."
    },
    "Maize": {
        season: "Kharif/Rabi",
        sowingTime: "Mid-June – July (Kharif), early Feb (Spring)",
        varieties: "PMH 1, PMH 2, PMH 4",
        seedRate: "8 kg/acre",
        fertilizer: "N: 60 kg (5 bags urea), P2O5: 24 kg (1 bag DAP), K2O: 12 kg (20 kg MOP) per acre. Apply 1/2 N + full P & K at sowing, rest N at knee-high stage.",
        irrigation: "Knee-high, tasseling, silking, and grain-filling stages are critical.",
        plantProtection: "Weeds: Atrazine 800 g/acre as pre-emergence. Pests: Spray Emamectin benzoate for fall armyworm."
    },
    "Cotton": {
        season: "Kharif",
        sowingTime: "April 15 – May 10",
        varieties: "PAU Bt 2, PAU Bt 3, F 1861",
        seedRate: "2 packets of Bt cotton seed/acre",
        fertilizer: "N: 75 kg (6 bags urea), P2O5: 30 kg (1.25 bags DAP), K2O: 12 kg (20 kg MOP) per acre. Apply 1/2 N + full P & K at sowing; rest N in 2 splits at 60 & 90 DAS.",
        irrigation: "First irrigation at 20–25 DAS, then at 10–12 day interval. Critical: flowering & boll development.",
        plantProtection: "Pink bollworm: Install pheromone traps. Spray Profenophos/Thiodicarb as per recommendation."
    },
    "Sugarcane": {
        season: "Spring (Feb–Mar)",
        sowingTime: "Feb 15 – Mar 15",
        varieties: "CoJ 64, CoPb 95",
        seedRate: "3 eye bud setts, 50,000 setts/acre",
        fertilizer: "N: 75 kg (6 bags urea), P2O5: 30 kg (1.25 bags DAP), K2O: 20 kg (33 kg MOP) per acre. Apply full P & K + 1/2 N at planting, rest N in 2 splits at 60 & 120 DAS.",
        irrigation: "First irrigation immediately after planting, then at 10–12 day interval. Critical at tillering & grand growth stage.",
        plantProtection: "Borers: Apply Chlorpyriphos in furrows. Whitefly & scale: Spray Imidacloprid."
    },
    "Mustard": {
        season: "Rabi",
        sowingTime: "Oct 15 – Oct 30",
        varieties: "PBR 210, PBR 378",
        seedRate: "1.5 kg/acre",
        fertilizer: "N: 40 kg (3.5 bags urea), P2O5: 12 kg (0.5 bag DAP), per acre. Apply full P and 1/2 N at sowing, rest N at 1st irrigation.",
        irrigation: "First irrigation 3–4 weeks after sowing, then at flowering & pod filling stage.",
        plantProtection: "Mustard aphid: Spray Imidacloprid or Thiamethoxam. Diseases: Treat seed with Thiram before sowing."
    },
    "Sunflower": {
        season: "Spring",
        sowingTime: "Mid-Jan – End Feb",
        varieties: "PSH 1962, PSH 2080",
        seedRate: "2 kg/acre",
        fertilizer: "N: 40 kg (3.5 bags urea), P2O5: 12 kg (0.5 bag DAP), K2O: 12 kg (20 kg MOP) per acre. Apply full dose at sowing.",
        irrigation: "First irrigation 20 DAS, then at 10–15 day interval. Critical: flowering & seed filling.",
        plantProtection: "Head borer: Spray Spinosad/Chlorantraniliprole."
    }
};
