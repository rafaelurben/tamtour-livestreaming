// ATEM commands about audio
// Note: channel -1 means normal operation, 0 and 1 mean split operation

let atemAudioChannels = [
    ["1301", "mic1", -1],
    ["1302", "mic2", -1],
]

// Actions

for (let dat of atemAudioChannels) {
    let id = dat[0];
    let htmlname = dat[1] + "-" + (dat[2] === -1 ? 0 : dat[2]);
    let channel = dat[2];

    $(`#atem-${htmlname}-on-btn`).off("click");
    $(`#atem-${htmlname}-on-btn`).click(function (e) {
        atem.post("fairlight-strip-properties", { source: id, channel: channel, state: 2 });
    });
    $(`#atem-${htmlname}-off-btn`).off("click");
    $(`#atem-${htmlname}-off-btn`).click(function (e) {
        atem.post("fairlight-strip-properties", { source: id, channel: channel, state: 1 });
    });
    $(`#atem-${htmlname}-volume-up-btn`).click(function (e) {
        let newVol = $(`#atem-${htmlname}-volume`).text() - 0 + 150;
        atem.post("fairlight-strip-properties", { source: id, channel: channel, volume: newVol });
    });
    $(`#atem-${htmlname}-volume-down-btn`).click(function (e) {
        let newVol = $(`#atem-${htmlname}-volume`).text() - 0 - 150;
        atem.post("fairlight-strip-properties", { source: id, channel: channel, volume: newVol });
    });
}

// Events

$(window).on("atem-get-fairlight-strip-properties", function (e, data) {
    for (let dat of atemAudioChannels) {
        let htmlname = dat[1] + "-" + (dat[2] === -1 ? 0 : dat[2]);
        let atemname = dat[0] + "." + (dat[2] === -1 ? 0 : dat[2]);
        
        let micOn = data[atemname].state === 2;
        $(`#atem-${htmlname}-on-btn`).toggleClass("btn-outline-danger", micOn).toggleClass("btn-outline-secondary", !micOn);
        $(`#atem-${htmlname}-off-btn`).toggleClass("btn-outline-light", !micOn).toggleClass("btn-outline-secondary", micOn);
        let micVol = data[atemname].volume;
        $(`#atem-${htmlname}-volume`).text(micVol);
    }
});

// Interval

let atemAudioInterval = undefined;

$(window).on("atem-connected", function () {
    atemAudioInterval = setInterval(function () {
        atem.get("fairlight-strip-properties");
    }, 500);
});

$(window).on("atem-disconnected", function () {
    console.log("Disconnected!");
    clearInterval(atemAudioInterval);
});
