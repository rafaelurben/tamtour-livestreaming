/* General info overlay */

async function sendShowGeneralOverlayGUI() {
    let data = {
        title: $("#generalinfo-form-title").val(),
        description: $("#generalinfo-form-description").val(),
    }
    let success = await sendAction("showGeneralInfoOverlay", data);
    if (!success) return;

    let button = $("#btn-show-generalinfo-overlay");
    button.prop("disabled", true);

    setTimeout(() => {button.prop("disabled", false)}, 5000);
}

async function sendHideGeneralOverlay() {
    let success = await sendAction("hideGeneralInfoOverlay", {});
    if (!success) return;

    let button = $("#btn-hide-generalinfo-overlay");
    button.prop("disabled", true);

    setTimeout(() => { button.prop("disabled", false) }, 1000);
}


