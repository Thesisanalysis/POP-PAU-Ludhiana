// script.js
document.getElementById("cropSelect").addEventListener("change", function () {
  const cropKey = this.value;
  const cropInfoDiv = document.getElementById("cropInfo");

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
