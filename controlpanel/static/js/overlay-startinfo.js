/* Start info overlay */

function loadStartlists() {
    let fileinputelem = $('#startlists-file-input')[0];
    let file = fileinputelem.files[0];

    if (!file) return;

    let reader = new FileReader();
    reader.onload = function() {
        let data = JSON.parse(reader.result);
        let startlists = data.lists;

        let startlistSelect = $("#startlist-select-input");
        startlistSelect.empty();

        for (let lid in startlists) {
            let startlist = startlists[lid];
            startlistSelect.append($("<option>", { value: lid, text: startlist.name }));
        }

        window.tamtour_startlists = startlists;
        loadStartlist();
    }
    reader.readAsText(file);
}

function loadStartlist() {
    let lid = $("#startlist-select-input").val();
    let startlist = window.tamtour_startlists[lid];
    let startlistitems = startlist.items;

    let startlistitemSelect = $("#startlistitem-select-input");
    startlistitemSelect.empty();

    for (let sid in startlistitems) {
        let data = startlistitems[sid];
        let title = `${data.kategorie}#${data.startnummer} ${data.name}`;
        startlistitemSelect.append($("<option>", { value: sid, text: title }));
    }

    loadStartlistitem();
}

function loadStartlistitem() {
    let lid = $("#startlist-select-input").val();
    let sid = $("#startlistitem-select-input").val();
    let startlist = window.tamtour_startlists[lid];
    let startlistitems = startlist.items;
    let item = startlistitems[sid];

    $("#info-form-kategorie").val(item.kategorie);
    $("#info-form-startnummer").val(item.startnummer);
    $("#info-form-name").val(item.name);
    $("#info-form-verein").val(item.verein);
    $("#info-form-vortrag").val(item.vortrag);
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
    let success = await sendAction("showStartInfoOverlay", data);
    if (!success) return;

    let button = $("#info-form-send");
    button.prop("disabled", true);

    setTimeout(() => {button.prop("disabled", false)}, data.duration+3000);
}

window.addEventListener("load", () => {
    loadStartlists();
});
