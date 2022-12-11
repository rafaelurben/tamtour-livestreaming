async function sendShowInfoOverlayGUI() {
    let data = {
        kategorie: $("#info-form-kategorie").val(),
        startnummer: $("#info-form-startnummer").val(),
        name: $("#info-form-name").val(),
        verein: $("#info-form-verein").val(),
        vortrag: $("#info-form-vortrag").val(),
        duration: $("#info-form-duration").val()*1 || 7500,
    }
    sendAction("showInfoOverlay", data);

    let button = $("#info-form-send");
    button.prop("disabled", true);

    setTimeout(() => {button.prop("disabled", false)}, data.duration+3000);
}

async function sendPlaySponsorsVideo() {
    return await sendAction("playSponsorsVideo")
}