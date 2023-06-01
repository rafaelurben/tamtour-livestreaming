// ATEM commands

let atemMP1selectElem = $("#atem-mp1-source-select")

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

$("#atem-next-transition-bkgd-btn").click((e) => {
    let nextBkgd = !$("#atem-next-transition-bkgd-btn").hasClass("btn-outline-success") ? 1 << 0 : 0;
    let nextKey1 = $("#atem-next-transition-key1-btn").hasClass("btn-outline-success") ? 1 << 1 : 0;
    var nextTransition = nextBkgd + nextKey1;
    atem.post("transition-settings", { index: 0, next_transition: nextTransition });
})

$("#atem-next-transition-key1-btn").click((e) => {
    let nextBkgd = $("#atem-next-transition-bkgd-btn").hasClass("btn-outline-success") ? 1 << 0 : 0;
    let nextKey1 = !$("#atem-next-transition-key1-btn").hasClass("btn-outline-success") ? 1 << 1 : 0;
    var nextTransition = nextBkgd + nextKey1;
    atem.post("transition-settings", { index: 0, next_transition: nextTransition });
})

// Events

$(window).on("atem-get-mediaplayer-selected", function (e, data) {
    atemMP1selectElem.val(data["0"].slot);
});

$(window).on("atem-get-mediaplayer-file-info", function (e, data) {
    let oldval = atemMP1selectElem.val();
    atemMP1selectElem.empty();
    for (let still of Object.values(data)) {
        if (still.is_used) {
            let opt = $("<option></option>");
            opt.attr("value", still.index);
            opt.text(atob(still.name));
            atemMP1selectElem.append(opt);
        }
    }
    atemMP1selectElem.val(oldval);
});

$(window).on("atem-get-fade-to-black-state", function (e, data) {
    let ftbOn = data["0"].in_transition || data["0"].done;
    $("#atem-transition-ftb-btn").toggleClass("btn-danger", ftbOn).toggleClass("pulsing", ftbOn).toggleClass("btn-outline-primary", !ftbOn);
});

$(window).on("atem-get-transition-settings", function (e, data) {
    let nextBkgd = data.next_transition_bkgd;
    let nextKey1 = data.next_transition_key1;

    $("#atem-next-transition-bkgd-btn").toggleClass("btn-outline-success", nextBkgd).toggleClass("btn-outline-secondary", !nextBkgd);
    $("#atem-next-transition-key1-btn").toggleClass("btn-outline-success", nextKey1).toggleClass("btn-outline-secondary", !nextKey1);
    $("#atem-next-transition-key1-btn2").toggleClass("btn-outline-success", nextKey1).toggleClass("btn-outline-secondary", !nextKey1);
});

$(window).on("atem-get-transition-position", function (e, data) {
    let active = data["0"].in_transition;

    $("#atem-transition-auto-btn").toggleClass("btn-danger", active).toggleClass("pulsing", active).toggleClass("btn-outline-primary", !active);
});

// Interval

let atemDiversesInterval1 = undefined;
let atemDiversesInterval2 = undefined;

$(window).on("atem-connected", function () {
    atemDiversesInterval1 = setInterval(function () {
        atem.get("mediaplayer-selected");
        atem.get("fade-to-black-state");
        atem.get("transition-settings");
        atem.get("transition-position");
    }, 500);
    atem.get("mediaplayer-file-info");
    atemDiversesInterval2 = setInterval(function () {
        atem.get("mediaplayer-file-info");
    }, 10000);
});

$(window).on("atem-disconnected", function () {
    console.log("Disconnected!");
    clearInterval(atemDiversesInterval1);
    clearInterval(atemDiversesInterval2);
});
