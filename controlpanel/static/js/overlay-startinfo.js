/* Start info overlay */

async function setStartInfoOverlayContent() {
    let data = {
        kategorie: $("#startinfo-form-kategorie").val(),
        startnummer: $("#startinfo-form-startnummer").val(),
        name: $("#startinfo-form-name").val(),
        verein: $("#startinfo-form-verein").val(),
        vortrag: $("#startinfo-form-vortrag").val(),
    }
    if (!data.kategorie || !data.startnummer || !data.name || !data.verein || !data.vortrag) {
        alert("Bitte alle Felder ausfüllen!");
        return false;
    }

    let success = await obs.sendAction("setStartInfoOverlayContent", data);
    return success ? true : false;
}

async function displayStartInfoOverlay() {
    let success0 = await setStartInfoOverlayContent();
    if (!success0) return false;

    let success = await obs.sendAction("displayStartInfoOverlay", {
        duration: $("#startinfo-form-duration").val(),
    });
    if (!success) return false;

    let button = $("#btn-display-startinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function showStartInfoOverlay() {
    let success0 = await setStartInfoOverlayContent();
    if (!success0) return false;

    let success = await obs.sendAction("showStartInfoOverlay");
    if (!success) return false;

    let button = $("#btn-show-startinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function hideStartInfoOverlay() {
    let success = await obs.sendAction("hideStartInfoOverlay");
    if (!success) return false;

    let button = $("#btn-hide-startinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

// Importer

function updateStartlistImportUI(initial) {
    let url_mode = $("#startlists-import-mode").prop("checked");

    $("#startlists-import-file-input").prop("disabled", url_mode);
    $("#startlists-import-url-input").prop("disabled", !url_mode);
    $("#startlists-import-url-button").prop("disabled", !url_mode);

    $('#startlist-select-input').empty();
    $('#startlistitem-select-input').empty();

    $(".nostartlistdisabled").prop("disabled", true);

    sessionStorage.setItem("tamtour-startlist-mode", url_mode ? "url" : "file")

    if (url_mode && initial === true) {
        loadStartlistsFromURL(initial);
    } else if (!url_mode) {
        loadStartlistsFromFile(initial);
    }
}

$("#startlists-import-mode").change(updateStartlistImportUI);

function loadStartlistsFromFile(initial) {
    let fileinputelem = $('#startlists-import-file-input')[0];
    let file = fileinputelem.files[0];

    if (!file) return;

    let reader = new FileReader();
    reader.onload = function() {
        let data = JSON.parse(reader.result);
        loadStartlistsFromData(data, initial);
    }
    reader.readAsText(file);
}

function loadStartlistsFromURL(initial) {
    let url = $('#startlists-import-url-input').val()
    if (!url) return;

    $.getJSON(url, function(data) {
        if (!(initial === true)) alert("Datei erfolgreich geladen!");
        loadStartlistsFromData(data, initial);
    });
}

function loadStartlistsFromData(data, initial) {
    let startlists = data.lists;

    if (!startlists || startlists.length == 0) {
        alert("Keine Startlisten gefunden!");
        return;
    }

    $(".nostartlistdisabled").prop("disabled", false);

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

    updateStartlistNavButtons();
}

// Helpers

function clearStartInfoOverlayData() {
    $("#startinfo-form-kategorie").val("");
    $("#startinfo-form-startnummer").val("");
    $("#startinfo-form-name").val("");
    $("#startinfo-form-verein").val("");
    $("#startinfo-form-vortrag").val("");
}

function updateStartlistNavButtons() {
    let selectelem = $('#startlistitem-select-input')[0];
    if (selectelem.selectedIndex == 0) {
        $("#btn-previous-startlistitem").prop("disabled", true);
        $("#btn-next-startlistitem").prop("disabled", selectelem.length <= 1);
    } else if (selectelem.selectedIndex == selectelem.length - 1) {
        $("#btn-next-startlistitem").prop("disabled", true);
        $("#btn-previous-startlistitem").prop("disabled", selectelem.length <= 1);
    } else {
        $("#btn-previous-startlistitem").prop("disabled", false);
        $("#btn-next-startlistitem").prop("disabled", false);
    }
}

function previousStartlistitem() {
    let selectelem = $('#startlistitem-select-input')[0];
    if (selectelem.selectedIndex > 0) selectelem.selectedIndex--;
    loadStartlistitem();
}

function nextStartlistitem() {
    let selectelem = $('#startlistitem-select-input')[0];
    selectelem.selectedIndex++;
    loadStartlistitem();
}

// Start list overlay

function getStartListAnmiationItems() {
    let lid = $("#startlist-select-input").val();
    let startlist = window.tamtour_startlists[lid];
    let sid = $("#startlistitem-select-input").val();

    return startlist.items.slice(sid).map((item) => {
        return [
            `${item.kategorie_kurz || item.kategorie}#${item.startnummer}`,
            item.name,
            item.verein,
            item.zeit,
        ];
    });
}

function loadStartListPreview() {
    let title = $("#startlist-form-title").val();
    let items = getStartListAnmiationItems();

    $("#startlist-preview-title").text(title);
    let table = $("#startlist-preview-table");

    table.empty();
    for (let item of items) {
        table.append($("<tr>").append(item.map((text) => $("<td>").text(text))));
    }
}

async function playStartListAnimation() {
    let title = $("#startlist-form-title").val();
    let items = getStartListAnmiationItems();
    
    // Convert to dict (needed because Arrays for some reason aren't transferred to the OBS browsersource)
    itemsasdict = {};
    for (let i = 0; i < items.length; i++) {
        itemasdict = {};
        for (let j = 0; j < items[i].length; j++) {
            itemasdict[j] = items[i][j];
        }
        itemsasdict[i] = itemasdict;
    }

    let data = { title, items: itemsasdict };
    await obs.sendAction("playStartListAnimation", data);

    let button = $("#btn-display-startlist-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);
}

async function cancelStartListAnimation() {
    await obs.sendAction("cancelStartListAnimation");

    let button = $("#btn-cancel-startlist-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);
}

// Event listeners

window.addEventListener("load", () => {
    if (sessionStorage.getItem("tamtour-startlist-mode")) {
        url_mode = sessionStorage.getItem("tamtour-startlist-mode") === "url";
        $("#startlists-import-mode").prop("checked", url_mode);
    }

    updateStartlistImportUI(true);
});
