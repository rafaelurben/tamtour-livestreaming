// ATEM commands about video

// Actions

$(".atem-pvw-btn").click(function (e) {
    let inputId = atemInputIdsReverse[$(this).data("name")];
    atem.post("preview-input", { index: 0, source: inputId });
});

$(".atem-pgm-btn").click(function (e) {
    let inputId = atemInputIdsReverse[$(this).data("name")];
    atem.post("program-input", { index: 0, source: inputId });
});

$(".atem-key1fill-btn").click(function (e) {
    let inputId = atemInputIdsReverse[$(this).data("name")];
    atem.post("key-fill", { index: 0, keyer: 0, source: inputId });
});

$(".atem-dkey1fill-btn").click(function (e) {
    let inputId = atemInputIdsReverse[$(this).data("name")];
    atem.post("dkey-set-fill", { index: 0, source: inputId });
});

$("#atem-key1-on-air-btn").click(function (e) {
    let isOn = atem.state.key1onair;
    atem.post("key-on-air", { index: 0, keyer: 0, enabled: isOn ? 0 : 1 });
});

// $("#atem-dkey1-on-air-btn").click(function (e) {
//     let isOn = atem.state.dkey1onair;
//     atem.post("dkey-onair", { index: 0, on_air: isOn ? 0 : 1 });
// });

// Events

$(window).on("atem-get-preview-bus-input", function (e, data) {
    let currId = data["0"].source;
    let name = atemInputIds[currId];
    atem.state.previewSource = name;

    let name2;
    if (!atem.state.nextTransition.bkgd && atem.state.programSource !== atem.state.previewSource) {
        name2 = atem.state.programSource;
    }

    $(`.atem-pvw-btn:not([data-name="${name}"]):not([data-name="${name2}"])`).addClass("btn-outline-secondary").removeClass("btn-success").removeClass("btn-outline-success");
    $(`.atem-pvw-btn[data-name="${name}"]`).addClass("btn-success").removeClass("btn-outline-secondary").removeClass("btn-outline-success");
    $(`.atem-pvw-btn[data-name="${name2}"]`).addClass("btn-outline-success").removeClass("btn-outline-secondary").removeClass("btn-success");
});

$(window).on("atem-get-program-bus-input", function (e, data) {
    let currId = data["0"].source;
    let name = atemInputIds[currId];
    atem.state.programSource = name;

    $(`.atem-pgm-btn:not([data-name="${name}"])`).removeClass("btn-danger").addClass("btn-outline-secondary");
    $(`.atem-pgm-btn[data-name="${name}"]`).addClass("btn-danger").removeClass("btn-outline-secondary");


});

$(window).on("atem-get-key-properties-base", function (e, data) {
    let currFillId = data["0"]["0"].fill_source;
    let name = atemInputIds[currFillId];
    atem.state.key1FillSource = name;

    $(`.atem-key1fill-btn:not([data-name="${name}"])`).removeClass("btn-warning").addClass("btn-outline-secondary");
    $(`.atem-key1fill-btn[data-name="${name}"]`).addClass("btn-warning").removeClass("btn-outline-secondary");
});

$(window).on("atem-get-dkey-properties-base", function (e, data) {
    let currFillId = data["0"].fill_source;
    let name = atemInputIds[currFillId];
    atem.state.dkey1FillSource = name;

    $(`.atem-dkey1fill-btn:not([data-name="${name}"])`).removeClass("btn-info").addClass("btn-outline-secondary");
    $(`.atem-dkey1fill-btn[data-name="${name}"]`).addClass("btn-info").removeClass("btn-outline-secondary");
});

$(window).on("atem-get-key-on-air", function (e, data) {
    let isOn = data["0"]["0"].enabled;
    atem.state.key1onair = isOn;
    $("#atem-key1-on-air-btn").toggleClass("btn-danger", isOn).toggleClass("btn-outline-secondary", !isOn);
});

$(window).on("atem-get-dkey-state", function (e, data) {
    // Note: request triggered in atem-diverses.js
    let isOn = data["0"].is_transitioning || data["0"].on_air;;
    atem.state.dkey1onair = isOn;
    // $("#atem-dkey1-on-air-btn").toggleClass("btn-danger", isOn).toggleClass("btn-outline-secondary", !isOn);
});

// Interval

let atemVideoInterval = undefined;

$(window).on("atem-connected", function () {
    atemVideoInterval = setInterval(function () {
        atem.get("preview-bus-input");
        atem.get("program-bus-input");
        atem.get("key-properties-base");
        atem.get("key-on-air");
        atem.get("dkey-properties-base");

        // set MP1 source border color
        $("#atem-mp1-source-select"
            ).toggleClass("border-danger", atem.state.programSource === "MP1"
            ).toggleClass("border-success", atem.state.previewSource === "MP1"
            ).toggleClass("border-warning", atem.state.key1FillSource === "MP1" && atem.state.key1onair
            ).toggleClass("border-info", atem.state.dkey1FillSource === "MP1" && atem.state.dkey1onair
        );
    }, 500);
});

$(window).on("atem-disconnected", function () {
    clearInterval(atemVideoInterval);
});
