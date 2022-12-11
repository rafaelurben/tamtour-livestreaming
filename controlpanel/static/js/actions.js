function loadCategories() {
    let fileinputelem = $('#categorylist-file-input')[0];
    let file = fileinputelem.files[0];
    let reader = new FileReader();
    reader.onload = function() {
        let data = JSON.parse(reader.result);
        let kategorien = data.kategorien;

        let kategorieSelect = $("#categorylist-select-input");
        kategorieSelect.empty();

        for (let kid in kategorien) {
            let kategorie = kategorien[kid];
            kategorieSelect.append($("<option>", { value: kid, text: kategorie.name }));
        }

        window.tamtour_kategorien = kategorien;
        loadCategory();
    }
    reader.readAsText(file);
}

function loadCategory() {
    let kid = $("#categorylist-select-input").val();
    let kategorie = window.tamtour_kategorien[kid];
    let startliste = kategorie.startliste;

    let startlistSelect = $("#startlist-select-input");
    startlistSelect.empty();

    for (let sid in startliste) {
        let data = startliste[sid];
        let title = `#${data.startnummer} ${data.name}`;
        startlistSelect.append($("<option>", { value: sid, text: title }));
    }

    loadPerson();
}

function loadPerson() {
    let kid = $("#categorylist-select-input").val();
    let sid = $("#startlist-select-input").val();
    let kategorie = window.tamtour_kategorien[kid];
    let data = kategorie.startliste[sid];

    $("#info-form-kategorie").val(kategorie.name);
    $("#info-form-startnummer").val(data.startnummer);
    $("#info-form-name").val(data.name);
    $("#info-form-verein").val(data.verein);
    $("#info-form-vortrag").val(data.vortrag);
}

async function sendShowInfoOverlayGUI() {
    let data = {
        kategorie: $("#info-form-kategorie").val(),
        startnummer: $("#info-form-startnummer").val(),
        name: $("#info-form-name").val(),
        verein: $("#info-form-verein").val(),
        vortrag: $("#info-form-vortrag").val(),
        duration: $("#info-form-duration").val()*1 || 7500,
    }
    let success = await sendAction("showInfoOverlay", data);
    if (!success) return;

    let button = $("#info-form-send");
    button.prop("disabled", true);

    setTimeout(() => {button.prop("disabled", false)}, data.duration+3000);
}

async function sendPlaySponsorsVideo() {
    return await sendAction("playSponsorsVideo")
}

window.addEventListener("load", () => {
    loadCategories();
});
