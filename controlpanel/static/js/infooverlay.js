function sendShowInfoOverlayGUI() {
    let data = {
        kategorie: $("#info-form-kategorie").val(),
        startnummer: $("#info-form-startnummer").val(),
        name: $("#info-form-name").val(),
        verein: $("#info-form-verein").val(),
        vortrag: $("#info-form-vortrag").val(),
    }
    let duration = $("#info-form-duration").val()
    sendShowInfoOverlay(data, duration);
}
