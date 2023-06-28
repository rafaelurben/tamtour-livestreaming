// ATEM commands about audio

// Actions

function setupATEMAudioInputButtons(config) {
    let container = $("#atem-audiobuttons-container").empty();
    for (let conf of config) {
        let cont = $("<div>").addClass("me-1 d-flex flex-column gap-1").appendTo(container);
        
        $("<div>").addClass("mb-1").text(conf.title).appendTo(cont);

        let row1 = $("<div>").addClass("d-flex flex-row").appendTo(cont);
        let onBtn = $("<button>").addClass("btn btn-sm btn-outline-secondary").attr("id", `atem-audio-${conf.htmlName}-on-btn`).text("ON").appendTo(row1);
        let offBtn = $("<button>").addClass("ms-1 btn btn-sm btn-outline-secondary").attr("id", `atem-audio-${conf.htmlName}-off-btn`).text("OFF").appendTo(row1);

        let row2 = $("<div>").addClass("d-flex flex-row").appendTo(cont);
        let volUpBtn = $("<button>").addClass("btn btn-sm flex-fill btn-outline-secondary").attr("id", `atem-audio-${conf.htmlName}-volume-up-btn`).text("▲").appendTo(row2);
        let volDownBtn = $("<button>").addClass("ms-1 btn btn-sm flex-fill btn-outline-secondary").attr("id", `atem-audio-${conf.htmlName}-volume-down-btn`).text("▼").appendTo(row2);

        let row3 = $("<div>").addClass("d-flex flex-row mt-1").appendTo(cont);
        $("<div>").attr("id", `atem-audio-${conf.htmlName}-volume`).appendTo(row3);
        $("<span>").addClass("ms-1").text("dB").appendTo(row3);

        onBtn.click(function (e) {
            atem.post("fairlight-strip-properties", { source: conf.index, channel: conf.subchannel, state: 2 });
        });
        offBtn.click(function (e) {
            atem.post("fairlight-strip-properties", { source: conf.index, channel: conf.subchannel, state: 1 });
        });
        volUpBtn.click(function (e) {
            let newVol = $(`#atem-audio-${conf.htmlName}-volume`).text() - 0 + 150;
            atem.post("fairlight-strip-properties", { source: conf.index, channel: conf.subchannel, volume: newVol });
        });
        volDownBtn.click(function (e) {
            let newVol = $(`#atem-audio-${conf.htmlName}-volume`).text() - 0 - 150;
            atem.post("fairlight-strip-properties", { source: conf.index, channel: conf.subchannel, volume: newVol });
        });
    }
}

// Events

$(window).on("atem-get-fairlight-audio-input", function (e, data) {
    let shownInputs = $("#atem-settings-enabled-audioinputs").val();
    var audioconfig = [];

    for (let dat of Object.values(data)) {
        if (!shownInputs.includes(dat.index.toString())) continue;

        let name = atemInputIds[dat.index];

        if (dat.split === 4) { // Audio is split in dual mono
            audioconfig.push({ index: dat.index, subchannel: 0, stripId: dat.index + ".0", htmlName: dat.index + "-0", title: name + " L" });
            audioconfig.push({ index: dat.index, subchannel: 1, stripId: dat.index + ".1", htmlName: dat.index + "-1", title: name + " R" });
        } else { // Audio is not split
            audioconfig.push({ index: dat.index, subchannel: -1, stripId: dat.index + ".0", htmlName: dat.index, title: name });
        }
    }

    if (JSON.stringify(atem.state.audioconfig) !== JSON.stringify(audioconfig)) {
        atem.state.audioconfig = audioconfig;
        setupATEMAudioInputButtons(audioconfig);
    }
});

$(window).on("atem-get-fairlight-strip-properties", function (e, data) {
    for (let conf of atem.state.audioconfig) {
        let dat = data[conf.stripId];

        // State: 1 = off, 2 = on, 4 = AFV
        let micOn = dat.state === 2;
        $(`#atem-audio-${conf.htmlName}-on-btn`).toggleClass("btn-outline-danger", micOn).toggleClass("btn-outline-secondary", !micOn);
        let micOff = dat.state === 1;
        $(`#atem-audio-${conf.htmlName}-off-btn`).toggleClass("btn-outline-light", micOff).toggleClass("btn-outline-secondary", !micOff);
        let micVol = dat.volume;
        $(`#atem-audio-${conf.htmlName}-volume`).text(micVol);
    }
});

// Interval

let atemAudioInterval = undefined;

$(window).on("atem-connected", function () {
    atemAudioInterval = setInterval(function () {
        atem.get("fairlight-audio-input");
        atem.get("fairlight-strip-properties");
    }, 500);
});

$(window).on("atem-disconnected", function () {
    clearInterval(atemAudioInterval);
});
