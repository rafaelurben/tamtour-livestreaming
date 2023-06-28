// ATEM commands about video

let ATEM_VIDEO_INPUTS = [
    "CAM1",
    "CAM2",
    "CAM3",
    "CAM4",
    "MP1",
    "BLK",
    "BARS",
    "COL1",
    "COL2",
]

function setupATEMVideoInputButtons(lst) {
    let container_pgm = $("#atem-videobuttons-pgm");
    let container_pvw = $("#atem-videobuttons-pvw");
    let container_key1fill = $("#atem-videobuttons-key1fill");
    let container_dkey1fill = $("#atem-videobuttons-dkey1fill");

    container_pgm.empty();
    container_pvw.empty();
    container_key1fill.empty();
    container_dkey1fill.empty();

    for (let name of lst) {
        let inputId = atemInputIdsReverse[name];

        let btn_pgm = $(`<button class="me-1 btn btn-outline-secondary btn-sm atem-pgm-btn" data-name="${name}">${name}</button>`);
        let btn_pvw = $(`<button class="me-1 btn btn-outline-secondary btn-sm atem-pvw-btn" data-name="${name}">${name}</button>`);
        let btn_key1fill = $(`<button class="me-1 btn btn-outline-secondary btn-sm atem-key1fill-btn" data-name="${name}">${name}</button>`);
        let btn_dkey1fill = $(`<button class="me-1 btn btn-outline-secondary btn-sm atem-dkey1fill-btn" data-name="${name}">${name}</button>`);

        btn_pgm.click(function (e) {
            atem.post("program-input", { index: 0, source: inputId });
        })
        btn_pvw.click(function (e) {
            atem.post("preview-input", { index: 0, source: inputId });
        })
        btn_key1fill.click(function (e) {
            atem.post("key-fill", { index: 0, keyer: 0, source: inputId });
        })
        btn_dkey1fill.click(function (e) {
            atem.post("dkey-set-fill", { index: 0, source: inputId });
        })

        container_pgm.append(btn_pgm);
        container_pvw.append(btn_pvw);
        container_key1fill.append(btn_key1fill);
        container_dkey1fill.append(btn_dkey1fill);   
    }
}

$(window).on('load', () => {setupATEMVideoInputButtons(ATEM_VIDEO_INPUTS);});

// Actions

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
