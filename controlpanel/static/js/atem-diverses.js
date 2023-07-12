// ATEM commands

let atemMP1selectElem = $("#atem-mp1-source-select")
let atemTransitionStyles = ["mix", "dip", "wipe", "dve"];

// Functions

function changeAtemNextTransitionState() {
    let nextBkgd = atem.state.nextTransition.bkgd ? 1 << 0 : 0;
    let nextKey1 = atem.state.nextTransition.key1 ? 1 << 1 : 0;
    var nextTransition = nextBkgd + nextKey1;
    atem.post("transition-settings", { index: 0, next_transition: nextTransition });
}

// Actions

atemMP1selectElem.change((e) => {
    let val = e.target.value;
    atem.post("mediaplayer-select", { index: 0, still: val });
})

$("#atem-transition-style-select").change(function (e) {
    let style = parseInt($(this).val())
    atem.post("transition-settings", { index: 0, style: style });
})

$("#atem-transition-rate-input").change(function (e) {
    let rate = parseInt($(this).val())
    atem.post(`${atemTransitionStyles[atem.state.nextTransition.style]}-settings`, { index: 0, rate: rate });
})

$("#atem-transition-cut-btn").click((e) => {
    atem.post("cut", { index: 0 });
})

$("#atem-transition-auto-btn").click((e) => {
    atem.post("auto", { index: 0 });
})

$("#atem-transition-ftb-rate-input").change(function (e) {
    atem.post("fade-to-black-config", { index: 0, frames: $(this).val() });
})

$("#atem-transition-ftb-btn").click((e) => {
    atem.post("fade-to-black", { index: 0 });
})

$("#atem-transition-dkey1-rate-input").change(function (e) {
    atem.post("dkey-rate", { index: 0, rate: $(this).val() });
})

$("#atem-transition-dkey1-btn").click((e) => {
    atem.post("dkey-auto", { index: 0 });
})

$("#atem-transition-preview-btn").click((e) => {
    atem.post("preview-transition", { index: 0, enabled: !atem.state.nextTransition.previewEnabled });
})

$("#atem-next-transition-bkgd-btn").click((e) => {
    atem.state.nextTransition.bkgd = !atem.state.nextTransition.bkgd;
    changeAtemNextTransitionState();
})

$("#atem-next-transition-key1-btn").click((e) => {
    atem.state.nextTransition.key1 = !atem.state.nextTransition.key1;
    changeAtemNextTransitionState();
})

$("#atem-key1-on-air-next-transition-btn").click((e) => {
    atem.state.nextTransition.key1 = !atem.state.nextTransition.key1;
    changeAtemNextTransitionState();
})

$("#atem-capture-still-btn").click((e) => {
    atem.post("capture-still");
})

$("#atem-color1-input").change(function (e) {
    let color = hexToHsl($(this).val());
    atem.post('color-generator', { index: 0, hue: color[0], saturation: color[1], luma: color[2] });
})

$("#atem-color2-input").change(function (e) {
    let color = hexToHsl($(this).val());
    atem.post('color-generator', { index: 1, hue: color[0], saturation: color[1], luma: color[2] });
})

// Events

$(window).on("atem-get-mediaplayer-selected", function (e, data) {
    atemMP1selectElem.not(":focus").val(data["0"].slot);
});

$(window).on("atem-get-mediaplayer-file-info", function (e, data) {
    let stills = Object.values(data);

    if (JSON.stringify(stills) === JSON.stringify(atem.state.stills)) return;
    atem.state.stills = stills;

    let oldval = atemMP1selectElem.val();
    atemMP1selectElem.empty();
    for (let still of stills) {
        if (still.is_used) {
            let opt = $("<option></option>");
            opt.attr("value", still.index);
            opt.text(`[${still.index}] ` + atob(still.name));
            atemMP1selectElem.append(opt);
        }
    }
    atemMP1selectElem.val(oldval);
});

$(window).on("atem-get-fade-to-black", function (e, data) {
    let ftbRate = data["0"].rate;
    $("#atem-transition-ftb-rate-input").not(":focus").val(ftbRate);
});

$(window).on("atem-get-fade-to-black-state", function (e, data) {
    let ftbOn = data["0"].in_transition || data["0"].done;
    $("#atem-transition-ftb-btn").toggleClass("btn-danger", ftbOn).toggleClass("pulsing", ftbOn).toggleClass("btn-outline-info", !ftbOn);
});

$(window).on("atem-get-dkey-properties", function (e, data) {
    let dkey1Rate = data["0"].rate;
    $("#atem-transition-dkey1-rate-input").not(":focus").val(dkey1Rate);
});

$(window).on("atem-get-dkey-state", function (e, data) {
    let dkey1On = data["0"].is_transitioning || data["0"].on_air;
    $("#atem-transition-dkey1-btn").toggleClass("btn-danger", dkey1On).toggleClass("pulsing", dkey1On).toggleClass("btn-outline-info", !dkey1On);
});

$(window).on("atem-get-transition-settings", function (e, data) {
    let nextBkgdChange = data.next_transition_bkgd;
    let nextKey1Change = data.next_transition_key1;
    let style = data.style;

    if (style !== atem.state.nextTransition.style) {
        atem.get(`transition-${atemTransitionStyles[style]}`)
        atem.state.nextTransition.style = style;
    }

    atem.state.nextTransition.bkgd = nextBkgdChange;
    atem.state.nextTransition.key1 = nextKey1Change;

    $("#atem-next-transition-bkgd-btn").toggleClass("btn-outline-success", nextBkgdChange).toggleClass("btn-outline-secondary", !nextBkgdChange);
    $("#atem-next-transition-key1-btn").toggleClass("btn-outline-success", nextKey1Change).toggleClass("btn-outline-secondary", !nextKey1Change);

    let nextKey1on = Boolean(nextKey1Change ^ atem.state.key1onair); // XOR
    $("#atem-key1-on-air-next-transition-btn").toggleClass("btn-outline-success", nextKey1on).toggleClass("btn-outline-secondary", !nextKey1on);

    $("#atem-transition-style-select").not(":focus").val(style);
});

$(window).on("atem-get-transition-position", function (e, data) {
    let active = data["0"].in_transition;

    $("#atem-transition-auto-btn").toggleClass("btn-danger", active).toggleClass("pulsing", active).toggleClass("btn-outline-primary", !active);
});

for (let styleindex = 0; styleindex < atemTransitionStyles.length; styleindex++) {
    let style = atemTransitionStyles[styleindex];
    $(window).on(`atem-get-transition-${style}`, function (e, data) {
        if (styleindex !== atem.state.nextTransition.style) return;

        let rate = data["0"].rate;
        $(`#atem-transition-rate-input`).not(":focus").val(rate);
    });
}

$(window).on("atem-get-transition-preview", function (e, data) {
    let isOn = data["0"].enabled;
    atem.state.nextTransition.previewEnabled = isOn;

    $("#atem-transition-preview-btn").toggleClass("btn-warning", isOn).toggleClass("pulsing", isOn).toggleClass("btn-outline-secondary", !isOn);
});

$(window).on("atem-get-color-generator", function (e, data) {
    let col1 = hslToHex(data["0"].hue, data["0"].saturation, data["0"].luma);
    let col2 = hslToHex(data["1"].hue, data["1"].saturation, data["1"].luma);
    $("#atem-color1-input").not(":focus").val(col1);
    $("#atem-color2-input").not(":focus").val(col2);
});
