// Settings

async function setSettings() {
    await obs.sendAction("setSettings", {
        backgroundColor: $("#settings-background-color-input").val(),
        textColor: $("#settings-text-color-input").val(),
        directionInverted: $("#settings-direction-inverted-input").prop("checked"),
    });
}

async function resetSettings() {
    $("#settings-background-color-input").val("#758aa5");
    $("#settings-text-color-input").val("#ffffff");
    $("#settings-direction-inverted-input").prop("checked", false);
}

// Collapser

function toggleCollapse(elem) {
    $(elem).parent().parent().toggleClass("collapsed");
}

// Drag and drop

$(document).ready(function () {
    var $dragging = null;

    $draggers = $("fieldset > legend > span.collapser");
    $draggables = $("fieldset");
    $droptargets = $(".droptarget");

    $draggers.on('mouseenter', function () { $(this).parent().parent().attr("draggable", true) });
    $draggers.on('mouseleave', function () { $(this).parent().parent().attr("draggable", false) }); 

    $draggables.on('dragstart', function (e) {
        $dragging = $(this);
        $(".droptarget").addClass("droptarget-active");
    });
    $draggables.on('dragend', function (e) {
        $dragging = null;
        $('.dragover').removeClass("dragover");
        $(".droptarget").removeClass("droptarget-active");
    });

    $droptargets.on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass("dragover");
    });
    $droptargets.on('dragleave', function (e) {
        e.preventDefault();
        $('.dragover').removeClass("dragover");
    });
    $droptargets.on('drop', function (e) {
        e.preventDefault();
        $('.dragover').removeClass("dragover");
        $(".droptarget").removeClass("droptarget-active");
        
        $dragging.insertBefore($(this));
    });
});
