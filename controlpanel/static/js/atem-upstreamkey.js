// ATEM commands

let atemKEY1TypeselectElem = $("#atem-key1-type-select")

// Get

$(window).on("atem-get-key-properties-base", function (e, data) {
    let key1dat = data["0"]["0"];

    // type: 0 = luma, 1 = chroma, 2 = pattern, 3 = DVE
    atemKEY1TypeselectElem.val(key1dat.type);
    
    $("#atem-key1-dve-group").toggleClass("d-none", key1dat.type != 3);
});

// Post

atemKEY1TypeselectElem.change(function (e) {
    let val = $(this).val();
    atem.post("key-type", { index: 0, keyer: 0, type: val });
});

$("#atem-key1-dve-seta-btn").click(function (e) {
    atem.post("keyer-keyframe-set", { index: 0, keyer: 0, keyframe: "A" });
});

$("#atem-key1-dve-setb-btn").click(function (e) {
    atem.post("keyer-keyframe-set", { index: 0, keyer: 0, keyframe: "B" });
});

$("#atem-key1-dve-runa-btn").click(function (e) {
    atem.post("keyer-keyframe-run", { index: 0, keyer: 0, run_to: "A" });
});

$("#atem-key1-dve-runb-btn").click(function (e) {
    atem.post("keyer-keyframe-run", { index: 0, keyer: 0, run_to: "B" });
});

$("#atem-key1-dve-runfull-btn").click(function (e) {
    atem.post("keyer-keyframe-run", { index: 0, keyer: 0, run_to: "Full" });
});