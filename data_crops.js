// data_crops.js
// Crop Data (English only, based on PAU Package of Practices)

const cropData = {
  wheat: {
    name: "Wheat",
    season: "Rabi",
    sowingTime: "Late October to Mid-November",
    seedRate: "40 kg/acre (recommended varieties)",
    fertilizer: "Nitrogen: 55 kg/acre, Phosphorus: 12 kg/acre, Potassium: 10 kg/acre (as per PAU recommendations)",
    irrigation: "First irrigation 21 days after sowing; subsequent irrigations at critical stages (Crown root initiation, Tillering, Jointing, Flowering, Dough stage)",
    plantProtection: "Control of weeds with Isoproturon/Metsulfuron; manage rusts and termite as per PAU POP"
  },

  paddy: {
    name: "Paddy (Rice)",
    season: "Kharif",
    sowingTime: "Nursery: 10th–30th May; Transplanting: 20th June–5th July",
    seedRate: "8 kg/acre for nursery raising",
    fertilizer: "Nitrogen: 30 kg/acre, Phosphorus: 12 kg/acre, Potassium: 10 kg/acre",
    irrigation: "Maintain 2–5 cm standing water after transplanting till dough stage; stop irrigation 10 days before harvesting",
    plantProtection: "Follow PAU schedule for stem borer, leaf folder, sheath blight, and weeds (Butachlor/Pretilachlor recommended)"
  },

  maize: {
    name: "Maize",
    season: "Kharif/Rabi",
    sowingTime: "Kharif: Mid-June to Early July; Rabi: Mid-October to November",
    seedRate: "8–10 kg/acre (hybrid); 6–8 kg/acre (composite)",
    fertilizer: "Nitrogen: 40 kg/acre, Phosphorus: 12 kg/acre, Potassium: 12 kg/acre",
    irrigation: "First irrigation 20 days after sowing; subsequent irrigations at tasseling, silking, and grain filling",
    plantProtection: "Weed control with Atrazine; manage stem borer and foliar diseases as per PAU POP"
  },

  cotton: {
    name: "Cotton",
    season: "Kharif",
    sowingTime: "April–May",
    seedRate: "2 packets/acre (Bt hybrids)",
    fertilizer: "Nitrogen: 50 kg/acre, Phosphorus: 12 kg/acre, Potassium: 10 kg/acre",
    irrigation: "First irrigation 3 weeks after sowing; irrigate at 15–20 day intervals depending on soil and weather",
    plantProtection: "Pink bollworm, whitefly, jassid management as per PAU recommendations"
  },

  barley: {
    name: "Barley",
    season: "Rabi",
    sowingTime: "Mid-October to November",
    seedRate: "35 kg/acre",
    fertilizer: "Nitrogen: 30 kg/acre, Phosphorus: 12 kg/acre",
    irrigation: "First irrigation 20–25 days after sowing; 2–3 irrigations sufficient depending on rainfall",
    plantProtection: "Weed management with Isoproturon; manage aphids and rusts as per PAU POP"
  }
};
