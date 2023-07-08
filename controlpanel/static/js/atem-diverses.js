// ATEM commands

let atemMP1selectElem = $("#atem-mp1-source-select")

// Utils

function hslToHex(h, s, l) {
    // Convert HSL (hue [0..360], saturation [0..1], luma [0..1]) to RGB Hex (#xxxxxx)

    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function hexToHsl(color) {
    // Convert RGB Hex (#xxxxxx) to HSL (hue [0..360], saturation [0..1], luma [0..1])

    var r = parseInt(color.substr(1, 2), 16) / 255; 
    var g = parseInt(color.substr(3, 2), 16) / 255;
    var b = parseInt(color.substr(5, 2), 16) / 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h * 360, s, l];
}

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

$("#atem-transition-cut-btn").click((e) => {
    atem.post("cut", { index: 0 });
})

$("#atem-transition-auto-btn").click((e) => {
    atem.post("auto", { index: 0 });
})

$("#atem-transition-ftb-btn").click((e) => {
    atem.post("fade-to-black", { index: 0 });
})

$("#atem-transition-dkey1-btn").click((e) => {
    atem.post("dkey-auto", { index: 0 });
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

$("#atem-color1-input").change((e) => {
    let color = hexToHsl($("#atem-color1-input").val());
    atem.post('color-generator', { index: 0, hue: color[0], saturation: color[1], luma: color[2] });
})

$("#atem-color2-input").change((e) => {
    let color = hexToHsl($("#atem-color2-input").val());
    atem.post('color-generator', { index: 1, hue: color[0], saturation: color[1], luma: color[2] });
})

// Events

$(window).on("atem-get-mediaplayer-selected", function (e, data) {
    atemMP1selectElem.val(data["0"].slot);
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

$(window).on("atem-get-fade-to-black-state", function (e, data) {
    let ftbOn = data["0"].in_transition || data["0"].done;
    $("#atem-transition-ftb-btn").toggleClass("btn-danger", ftbOn).toggleClass("pulsing", ftbOn).toggleClass("btn-outline-info", !ftbOn);
});

$(window).on("atem-get-dkey-state", function (e, data) {
    let dkey1On = data["0"].is_transitioning || data["0"].on_air;
    $("#atem-transition-dkey1-btn").toggleClass("btn-danger", dkey1On).toggleClass("pulsing", dkey1On).toggleClass("btn-outline-info", !dkey1On);
});

$(window).on("atem-get-transition-settings", function (e, data) {
    let nextBkgdChange = data.next_transition_bkgd;
    let nextKey1Change = data.next_transition_key1;
    atem.state.nextTransition.bkgd = nextBkgdChange;
    atem.state.nextTransition.key1 = nextKey1Change;

    $("#atem-next-transition-bkgd-btn").toggleClass("btn-outline-success", nextBkgdChange).toggleClass("btn-outline-secondary", !nextBkgdChange);
    $("#atem-next-transition-key1-btn").toggleClass("btn-outline-success", nextKey1Change).toggleClass("btn-outline-secondary", !nextKey1Change);

    let nextKey1on = Boolean(nextKey1Change ^ atem.state.key1onair); // XOR
    $("#atem-key1-on-air-next-transition-btn").toggleClass("btn-outline-success", nextKey1on).toggleClass("btn-outline-secondary", !nextKey1on);
});

$(window).on("atem-get-transition-position", function (e, data) {
    let active = data["0"].in_transition;

    $("#atem-transition-auto-btn").toggleClass("btn-danger", active).toggleClass("pulsing", active).toggleClass("btn-outline-primary", !active);
});

$(window).on("atem-get-color-generator", function (e, data) {
    let col1 = hslToHex(data["0"].hue, data["0"].saturation, data["0"].luma);
    let col2 = hslToHex(data["1"].hue, data["1"].saturation, data["1"].luma);
    $("#atem-color1-input").val(col1);
    $("#atem-color2-input").val(col2);
});
