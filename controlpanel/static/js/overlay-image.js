/* Default image overlay */

async function sendOverlayImage() {
    let fileinputelem = $('#settings-defaultoverlay-image-input')[0];
    let file = fileinputelem.files[0];

    if (!file) return;

    let reader = new FileReader();
    reader.onload = async function () {
        let success = obs.sendAction("setImageOverlaySource", {src: reader.result})
        if (!success) return false;

        let button = $("#btn-update-image-overlay-src");
        button.prop("disabled", true);
        setTimeout(() => { button.prop("disabled", false) }, 1000);
    }
    reader.readAsDataURL(file);
}

async function displayImageOverlay() {
    let success = await obs.sendAction("displayImageOverlay", {
        duration: $("#image-form-duration").val(),
    });
    if (!success) return false;

    let button = $("#btn-display-image-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function showImageOverlay() {
    let success = await obs.sendAction("showImageOverlay");
    if (!success) return false;

    let button = $("#btn-show-image-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function hideImageOverlay() {
    let success = await obs.sendAction("hideImageOverlay");
    if (!success) return false;

    let button = $("#btn-hide-image-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}
