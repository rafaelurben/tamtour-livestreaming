// ATEM commands about audio

// Actions

$("#atem-mic1-on-btn").click(function (e) {
    atem.post("fairlight-strip-properties", { source: "1301", channel: -1, state: 2 });
});
$("#atem-mic2-on-btn").click(function (e) {
    atem.post("fairlight-strip-properties", { source: "1302", channel: -1, state: 2 });
});
$("#atem-mic1-off-btn").click(function (e) {
    atem.post("fairlight-strip-properties", { source: "1301", channel: -1, state: 1 });
});
$("#atem-mic2-off-btn").click(function (e) {
    atem.post("fairlight-strip-properties", { source: "1302", channel: -1, state: 1 });
});
$("#atem-mic1-volume-up-btn").click(function (e) {
    let newVol = $("#atem-mic1-volume").text() - 0 + 150;
    atem.post("fairlight-strip-properties", { source: "1301", channel: -1, volume: newVol });
});
$("#atem-mic2-volume-up-btn").click(function (e) {
    let newVol = $("#atem-mic2-volume").text() - 0 + 150;
    atem.post("fairlight-strip-properties", { source: "1302", channel: -1, volume: newVol });
});
$("#atem-mic1-volume-down-btn").click(function (e) {
    let newVol = $("#atem-mic1-volume").text() - 0 - 150;
    atem.post("fairlight-strip-properties", { source: "1301", channel: -1, volume: newVol });
});
$("#atem-mic2-volume-down-btn").click(function (e) {
    let newVol = $("#atem-mic2-volume").text() - 0 - 150;
    atem.post("fairlight-strip-properties", { source: "1302", channel: -1, volume: newVol });
});

// Events

$(window).on("atem-get-fairlight-strip-properties", function (e, data) {
    let mic1on = data["1301.0"].state === 2;
    $("#atem-mic1-on-btn").toggleClass("btn-outline-danger", mic1on).toggleClass("btn-outline-secondary", !mic1on);
    $("#atem-mic1-off-btn").toggleClass("btn-outline-light", !mic1on).toggleClass("btn-outline-secondary", mic1on);
    let mic2on = data["1302.0"].state === 2;
    $("#atem-mic2-on-btn").toggleClass("btn-outline-danger", mic2on).toggleClass("btn-outline-secondary", !mic2on);
    $("#atem-mic2-off-btn").toggleClass("btn-outline-light", !mic2on).toggleClass("btn-outline-secondary", mic2on);
    let mic1vol = data["1301.0"].volume;
    $("#atem-mic1-volume").text(mic1vol);
    let mic2vol = data["1302.0"].volume;
    $("#atem-mic2-volume").text(mic2vol);
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
