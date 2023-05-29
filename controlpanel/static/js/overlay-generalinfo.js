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

    let success = await sendAction("setGeneralInfoOverlayContent", data);
    return success ? true : false;
}

async function displayGeneralInfoOverlay() {
    let success0 = await setGeneralInfoOverlayContent();
    if (!success0) return false;

    let success = await sendAction("displayGeneralInfoOverlay", {
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

    let success = await sendAction("showGeneralInfoOverlay");
    if (!success) return false;

    let button = $("#btn-show-generalinfo-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function hideGeneralInfoOverlay() {
    let success = await sendAction("hideGeneralInfoOverlay");
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
