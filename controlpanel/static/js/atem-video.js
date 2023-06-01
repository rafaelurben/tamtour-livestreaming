// ATEM commands about video

$(window).on("atem-get-preview-bus-input", function (e, data) {
    console.log("Preview bus input: ", e, data);
});

$(window).on("atem-connected", function () {
    console.log("Ready!");
});