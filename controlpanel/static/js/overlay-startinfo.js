/* Start info overlay */

function loadStartlists(initial) {
    let fileinputelem = $('#startlists-file-input')[0];
    let file = fileinputelem.files[0];

    if (!file) return;

    let reader = new FileReader();
    reader.onload = function() {
        let data = JSON.parse(reader.result);
        let startlists = data.lists;

        if (!startlists) {
            alert("Keine Startlisten gefunden!");
            return;
        }

        let startlistSelect = $("#startlist-select-input");
        startlistSelect.empty();

        for (let lid in startlists) {
            let startlist = startlists[lid];
            startlistSelect.append($("<option>", { value: lid, text: startlist.name }));
        }

        let storedval = sessionStorage.getItem("tamtour-startlist-id");
        if (initial && storedval < startlists.length) startlistSelect.val(storedval);
        

        window.tamtour_startlists = startlists;
        loadStartlist(initial);
    }
    reader.readAsText(file);
}

function loadStartlist(initial) {
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

    let storedval = sessionStorage.getItem("tamtour-startlist-itemid");
    if (initial && storedval < startlistitems.length) startlistitemSelect.val(storedval);

    loadStartlistitem();
}

function loadStartlistitem() {
    let lid = $("#startlist-select-input").val();
    sessionStorage.setItem("tamtour-startlist-id", lid);
    let sid = $("#startlistitem-select-input").val();
    sessionStorage.setItem("tamtour-startlist-itemid", sid);
    let startlist = window.tamtour_startlists[lid];
    let startlistitems = startlist.items;
    let item = startlistitems[sid];

    $("#startinfo-form-kategorie").val(item.kategorie);
    $("#startinfo-form-startnummer").val(item.startnummer);
    $("#startinfo-form-name").val(item.name);
    $("#startinfo-form-verein").val(item.verein);
    $("#startinfo-form-vortrag").val(item.vortrag);
}

async function sendShowInfoOverlayGUI() {
    let data = {
        kategorie: $("#startinfo-form-kategorie").val(),
        startnummer: $("#startinfo-form-startnummer").val(),
        name: $("#startinfo-form-name").val(),
        verein: $("#startinfo-form-verein").val(),
        vortrag: $("#startinfo-form-vortrag").val(),
        duration: $("#startinfo-form-duration").val()*1 || 7500,
    }

    if (!data.kategorie || !data.startnummer || !data.name || !data.verein || !data.vortrag) {
        alert("Bitte alle Felder ausfüllen!");
        return;
    }


    let success = await sendAction("showStartInfoOverlay", data);
    if (!success) return;

    let button = $("#startinfo-form-send");
    button.prop("disabled", true);

    setTimeout(() => {button.prop("disabled", false)}, data.duration+3000);
}

window.addEventListener("load", () => {
    loadStartlists(true);
});
