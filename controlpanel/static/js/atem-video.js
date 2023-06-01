// ATEM commands about video

let inputIds = {
    0: "BLK",
    1: "CAM1",
    2: "CAM2",
    3: "CAM3",
    4: "CAM4",
    3010: "MP1",
}
let inputIdsReverse = Object.fromEntries(Object.entries(inputIds).map(a => a.reverse()));

// Actions

$(".atem-pvw-btn").click(function (e) {
    let inputId = inputIdsReverse[$(this).data("name")];
    atem.post("preview-input", { index: 0, source: inputId });
});

$(".atem-pgm-btn").click(function (e) {
    let inputId = inputIdsReverse[$(this).data("name")];
    atem.post("program-input", { index: 0, source: inputId });
});

$(".atem-upkfill-btn").click(function (e) {
    let inputId = inputIdsReverse[$(this).data("name")];
    atem.post("key-fill", { index: 0, keyer: 0, source: inputId });
});

// Events

$(window).on("atem-get-preview-bus-input", function (e, data) {
    let currId = data["0"].source;
    let name = inputIds[currId];

    $(`.atem-pvw-btn:not([data-name="${name}"])`).removeClass("btn-success").addClass("btn-outline-secondary");
    $(`.atem-pvw-btn[data-name="${name}"]`).addClass("btn-success").removeClass("btn-outline-secondary");
});

$(window).on("atem-get-program-bus-input", function (e, data) {
    let currId = data["0"].source;
    let name = inputIds[currId];

    $(`.atem-pgm-btn:not([data-name="${name}"])`).removeClass("btn-danger").addClass("btn-outline-secondary");
    $(`.atem-pgm-btn[data-name="${name}"]`).addClass("btn-danger").removeClass("btn-outline-secondary");
});

$(window).on("atem-get-key-properties-base", function (e, data) {
    let currFillId = data["0"]["0"].fill_source;
    let name = inputIds[currFillId];

    $(`.atem-upkfill-btn:not([data-name="${name}"])`).removeClass("btn-warning").addClass("btn-outline-secondary");
    $(`.atem-upkfill-btn[data-name="${name}"]`).addClass("btn-warning").removeClass("btn-outline-secondary");
});

// Interval

let atemInterval = undefined;

$(window).on("atem-connected", function () {
    atemInterval = setInterval(function () {
        atem.get("preview-bus-input");
        atem.get("program-bus-input");
        atem.get("key-properties-base");
    }, 500);
});

$(window).on("atem-disconnected", function () {
    console.log("Disconnected!");
    clearInterval(atemInterval);
});
