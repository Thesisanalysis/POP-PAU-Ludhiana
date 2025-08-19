// script.js

function loadCrops() {
    const cropSelect = document.getElementById("cropSelect");
    cropSelect.innerHTML = `<option value="">-- Select Crop --</option>`;
    Object.keys(cropData).forEach(crop => {
        cropSelect.innerHTML += `<option value="${crop}">${crop}</option>`;
    });
}

function showDetails() {
    const crop = document.getElementById("cropSelect").value;
    const detailsDiv = document.getElementById("cropDetails");
    if (!crop || !cropData[crop]) {
        detailsDiv.innerHTML = "<p>Please select a crop.</p>";
        return;
    }

    const data = cropData[crop];
    detailsDiv.innerHTML = `
        <h2>${crop}</h2>
        <p><b>Season:</b> ${data.season}</p>
        <p><b>Sowing Time:</b> ${data.sowingTime}</p>
        <p><b>Varieties:</b> ${data.varieties}</p>
        <p><b>Seed Rate:</b> ${data.seedRate}</p>
        <p><b>Fertilizer Dose:</b> ${data.fertilizer}</p>
        <p><b>Irrigation Schedule:</b> ${data.irrigation}</p>
        <p><b>Plant Protection:</b> ${data.plantProtection}</p>
    `;
}

window.onload = loadCrops;
