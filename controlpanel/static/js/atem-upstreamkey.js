// ATEM commands

let atemKEY1TypeselectElem = $("#atem-key1-type-select")

// Type selection

$(window).on("atem-get-key-properties-base", function (e, data) {
    let key1dat = data["0"]["0"];

    // type: 0 = luma, 1 = chroma, 2 = pattern, 3 = DVE
    atemKEY1TypeselectElem.val(key1dat.type);
    
    $("#atem-key1-dve-group").toggleClass("d-none", key1dat.type != 3);
});

atemKEY1TypeselectElem.change(function (e) {
    let val = $(this).val();
    atem.post("key-type", { index: 0, keyer: 0, type: val });
});

// DVE

function updateKey1DVEForm() {
    let dat = atem.state.key1DVEdata;

    let anchors = $("#key1-dve-form-anchor").val().split("-");
    let anchory = anchors[0];
    let anchorx = anchors[1];

    var pos_x = dat.pos_x / 32000 + 0.5;
    var pos_y = dat.pos_y / 18000 + 0.5;
    var size_x = dat.size_x / 1000;
    var size_y = dat.size_y / 1000;

    console.log(pos_x, pos_y, size_x, size_y, anchorx, anchory)

    if (anchorx == "left") {
        pos_x -= size_x / 2;
    } else if (anchorx == "right") {
        pos_x += size_x / 2;
    }

    if (anchory == "bottom") {
        pos_y -= size_y / 2;
    } else if (anchory == "top") {
        pos_y += size_y / 2;
    }

    $("#key1-dve-form-posx").val(pos_x);
    $("#key1-dve-form-posy").val(pos_y);
    $("#key1-dve-form-sizex").val(size_x);
    $("#key1-dve-form-sizey").val(size_y);
}

$("#atem-key1-dve-dialog").on("show.bs.modal", function (e) {
    atem.get("key-properties-dve");
});

$("#key1-dve-form-anchor").change(function (e) {
    updateKey1DVEForm();
});

$(window).on("atem-get-key-properties-dve", function (e, data) {
    atem.state.key1DVEdata = data["0"]["0"];
    updateKey1DVEForm();
});

$("#atem-key1-dve-dialog input").change(function (e) {
    var pos_x = parseFloat($("#key1-dve-form-posx").val());
    var pos_y = parseFloat($("#key1-dve-form-posy").val());
    var size_x = parseFloat($("#key1-dve-form-sizex").val());
    var size_y = parseFloat($("#key1-dve-form-sizey").val());

    let anchors = $("#key1-dve-form-anchor").val().split("-");
    let anchory = anchors[0];
    let anchorx = anchors[1];

    if (anchorx == "left") {
        pos_x += size_x / 2;
    } else if (anchorx == "right") {
        pos_x -= size_x / 2;
    }

    if (anchory == "bottom") {
        pos_y += size_y / 2;
    } else if (anchory == "top") {
        pos_y -= size_y / 2;
    }

    data = {
        index: 0,
        keyer: 0,
        pos_x: parseInt((pos_x - 0.5) * 32000),
        pos_y: parseInt((pos_y - 0.5) * 18000),
        size_x: parseInt(size_x * 1000),
        size_y: parseInt(size_y * 1000),
    }

    atem.post("key-properties-dve", data)
    atem.state.key1DVEdata = data;
});

// SET / RUN

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