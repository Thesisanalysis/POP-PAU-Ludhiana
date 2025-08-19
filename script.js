// script.js

const cropSelect = document.getElementById("cropSelect");
const cropInfoDiv = document.getElementById("cropInfo");

// ✅ Populate dropdown dynamically
for (const key in cropData) {
  const option = document.createElement("option");
  option.value = key;
  option.textContent = cropData[key].name;
  cropSelect.appendChild(option);
}

// ✅ Show info when crop selected
cropSelect.addEventListener("change", function () {
  const cropKey = this.value;

  if (!cropKey || !cropData[cropKey]) {
    cropInfoDiv.style.display = "none";
    cropInfoDiv.innerHTML = "";
    return;
  }

  const crop = cropData[cropKey];

  cropInfoDiv.style.display = "block";
  cropInfoDiv.innerHTML = `
    <h2>${crop.name}</h2>
    <p><strong>Season:</strong> ${crop.season}</p>
    <p><strong>Sowing Time:</strong> ${crop.sowingTime}</p>
    <p><strong>Seed Rate:</strong> ${crop.seedRate}</p>
    <p><strong>Fertilizer:</strong> ${crop.fertilizer}</p>
    <p><strong>Irrigation:</strong> ${crop.irrigation}</p>
    <p><strong>Plant Protection:</strong> ${crop.plantProtection}</p>
  `;
});
