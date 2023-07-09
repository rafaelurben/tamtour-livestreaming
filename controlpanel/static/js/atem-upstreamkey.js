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

function updateKey1DVEFormFromData() {
    let local_data = atem.state.key1DVEdata;

    let anchors = $("#atem-key1-dve-form-anchor").val().split("-");
    let anchor_x = anchors[0];
    let anchor_y = anchors[1];

    var pos_x = local_data.pos_x;
    var pos_y = local_data.pos_y;
    var size_x = local_data.size_x;
    var size_y = local_data.size_y;

    if (anchor_x == "left") {
        pos_x -= size_x / 2;
    } else if (anchor_x == "right") {
        pos_x += size_x / 2;
    }

    if (anchor_y == "bottom") {
        pos_y -= size_y / 2;
    } else if (anchor_y == "top") {
        pos_y += size_y / 2;
    }

    $("#atem-key1-dve-form-posx").val(pos_x);
    $("#atem-key1-dve-form-posy").val(pos_y);
    $("#atem-key1-dve-form-sizex").val(size_x);
    $("#atem-key1-dve-form-sizey").val(size_y);
}

function updateKey1DVEDataFromForm() {
    var pos_x = parseFloat($("#atem-key1-dve-form-posx").val());
    var pos_y = parseFloat($("#atem-key1-dve-form-posy").val());
    var size_x = parseFloat($("#atem-key1-dve-form-sizex").val());
    var size_y = parseFloat($("#atem-key1-dve-form-sizey").val());

    let anchors = $("#atem-key1-dve-form-anchor").val().split("-");
    let anchor_x = anchors[0];
    let anchor_y = anchors[1];

    if (anchor_x == "left") {
        pos_x += size_x / 2;
    } else if (anchor_x == "right") {
        pos_x -= size_x / 2;
    }

    if (anchor_y == "bottom") {
        pos_y += size_y / 2;
    } else if (anchor_y == "top") {
        pos_y -= size_y / 2;
    }

    atem.state.key1DVEdata = {
        pos_x: pos_x,
        pos_y: pos_y,
        size_x: size_x,
        size_y: size_y,
    }
}

$("#atem-key1-dve-dialog").on("show.bs.modal", function (e) {
    atem.get("key-properties-dve");
});

$("#atem-key1-dve-form-anchor").change(function (e) {
    updateKey1DVEFormFromData();
});


$("#atem-key1-dve-dialog input").change(function (e) {
    updateKey1DVEDataFromForm();
});

$(window).on("atem-get-key-properties-dve", function (e, data) {
    let atem_data = data["0"]["0"];

    atem.state.key1DVEdata = {
        pos_x: atem_data.pos_x / 32000 + 0.5,
        pos_y: atem_data.pos_y / 18000 + 0.5,
        size_x: atem_data.size_x / 1000,
        size_y: atem_data.size_y / 1000,
    }

    updateKey1DVEFormFromData();
});

$("#atem-key1-dve-form-apply").click(function (e) {
    let local_data = atem.state.key1DVEdata;

    atem.post("key-properties-dve", {
        index: 0,
        keyer: 0,
        pos_x: parseInt((local_data.pos_x - 0.5) * 32000),
        pos_y: parseInt((local_data.pos_y - 0.5) * 18000),
        size_x: parseInt(local_data.size_x * 1000),
        size_y: parseInt(local_data.size_y * 1000),
    })
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