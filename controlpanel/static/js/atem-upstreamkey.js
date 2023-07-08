// ATEM commands

let atemKEY1TypeselectElem = $("#atem-key1-type-select")

// Get

$(window).on("atem-get-key-properties-base", function (e, data) {
    let key1dat = data["0"]["0"];

    // type: 0 = luma, 1 = chroma, 2 = pattern, 3 = DVE
    atemKEY1TypeselectElem.val(key1dat.type);
    
    // TODO: show/hide buttons based on type
});

// Post

atemKEY1TypeselectElem.change(function (e) {
    let val = $(this).val();
    atem.post("key-type", { index: 0, keyer: 0, type: val });
});
