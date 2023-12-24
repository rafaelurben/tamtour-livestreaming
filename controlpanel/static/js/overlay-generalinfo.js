/* General info overlay */

async function setGeneralInfoOverlayContent() {
    let data = {
        title: $("#generalinfo-form-title").val(),
        description: $("#generalinfo-form-description").val(),
    }
    if (!data.title || !data.description) {
        alert("Bitte Titel & Beschreibung ausfüllen!");
        return false;
    }

    let success = await obs.sendAction("setGeneralInfoOverlayContent", data);
    return success ? true : false;
}

async function displayGeneralInfoOverlay() {
    let success0 = await setGeneralInfoOverlayContent();
    if (!success0) return false;

    let success = await obs.sendAction("displayGeneralInfoOverlay", {
        duration: $("#generalinfo-form-duration").val(),
    });
    if (!success) return false;

    let button = $("#btn-display-generalinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function showGeneralInfoOverlay() {
    let success0 = await setGeneralInfoOverlayContent();
    if (!success0) return false;

    let success = await obs.sendAction("showGeneralInfoOverlay");
    if (!success) return false;

    let button = $("#btn-show-generalinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function hideGeneralInfoOverlay() {
    let success = await obs.sendAction("hideGeneralInfoOverlay");
    if (!success) return false;

    let button = $("#btn-hide-generalinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

// Helper

function clearGeneralInfoOverlayData() {
    $("#generalinfo-form-title").val("");
    $("#generalinfo-form-description").val("");
}

/* General info overlay presets */

function addGeneralInfoOverlayPreset() {
    let $container = $("#general-info-overlay-presets");
    let title = $("#generalinfo-form-title").val();
    let description = $("#generalinfo-form-description").val();

    if (!title || !description) {
        alert("Bitte Titel & Beschreibung ausfüllen!");
        return false;
    }

    let $option = $("<option></option>");
    $option.text(`${title} - ${description}`);
    $option.val(`${title} - ${description}`);
    $option.data("title", title);
    $option.data("description", description);
    $option.appendTo($container);

    $container.val($option.val());
}

function removeGeneralInfoOverlayPreset() {
    let $option = $(`#general-info-overlay-presets option:selected`);
    $option.remove();
}

function loadGeneralInfoOverlayPreset() {
    let $option = $(`#general-info-overlay-presets option:selected`);

    $("#generalinfo-form-title").val($option.data("title"));
    $("#generalinfo-form-description").val($option.data("description"));
}
