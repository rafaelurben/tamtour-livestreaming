/* Start info overlay */

async function setStartInfoOverlayContent() {
    let data = {
        kategorie: $("#startinfo-form-category").val(),
        startnummer: $("#startinfo-form-start_num").val(),
        name: $("#startinfo-form-main-big").val(),
        verein: $("#startinfo-form-main-small").val(),
        vortrag: $("#startinfo-form-presentation").val(),
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
    setTimeout(() => {
        button.prop("disabled", false)
    }, 1000);

    sendStartlistItemToApiIfEnabled();

    return true;
}

async function showStartInfoOverlay() {
    let success0 = await setStartInfoOverlayContent();
    if (!success0) return false;

    let success = await obs.sendAction("showStartInfoOverlay");
    if (!success) return false;

    let button = $("#btn-show-startinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => {
        button.prop("disabled", false)
    }, 1000);

    return true;
}

async function hideStartInfoOverlay() {
    let success = await obs.sendAction("hideStartInfoOverlay");
    if (!success) return false;

    let button = $("#btn-hide-startinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => {
        button.prop("disabled", false)
    }, 1000);

    return true;
}

// Helpers

function clearStartInfoOverlayData() {
    $("#startinfo-form-category").val("");
    $("#startinfo-form-start_num").val("");
    $("#startinfo-form-main-big").val("");
    $("#startinfo-form-main-small").val("");
    $("#startinfo-form-presentation").val("");
}

function updateStartlistNavButtons() {
    let selectelem = $('#startlistitem-select-input')[0];
    if (selectelem.selectedIndex === 0) {
        $("#btn-previous-startlistitem").prop("disabled", true);
        $("#btn-next-startlistitem").prop("disabled", selectelem.length <= 1);
    } else if (selectelem.selectedIndex === selectelem.length - 1) {
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
            item.time,
            `${item.category_short || item.category}#${item.start_num}`,
            item.name,
            item.club,
        ];
    });
}

function showStartListPreview() {
    let title = $("#startlist-form-title").val();
    let items = getStartListAnmiationItems();

    if (!title || !items) {
        alert("Kein Titel festgelegt oder Startliste leer!");
        return;
    }

    $("#startlist-preview-title").text(title);
    let table = $("#startlist-preview-table");

    table.empty();
    for (let item of items) {
        table.append($("<tr>").append(item.map((text) => $("<td>").text(text))));
    }

    $('#startlist-preview-dialog').modal("show");
}

async function playStartListAnimation() {
    let title = $("#startlist-form-title").val();
    let items = getStartListAnmiationItems();

    if (!title || !items) {
        alert("Kein Titel festgelegt oder Startliste leer!");
        return;
    }

    // Convert to dict (needed because Arrays for some reason aren't transferred to the OBS browsersource)
    itemsasdict = {};
    for (let i = 0; i < items.length; i++) {
        itemasdict = {};
        for (let j = 0; j < items[i].length; j++) {
            itemasdict[j] = items[i][j];
        }
        itemsasdict[i] = itemasdict;
    }

    let data = {title, items: itemsasdict};
    await obs.sendAction("playStartListAnimation", data);

    let button = $("#btn-display-startlist-overlay");
    button.prop("disabled", true);
    setTimeout(() => {
        button.prop("disabled", false)
    }, 1000);
}

async function cancelStartListAnimation() {
    await obs.sendAction("cancelStartListAnimation");

    let button = $("#btn-cancel-startlist-overlay");
    button.prop("disabled", true);
    setTimeout(() => {
        button.prop("disabled", false)
    }, 1000);
}
