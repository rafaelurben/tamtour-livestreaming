// Settings

async function setSettings() {
    await sendAction("setSettings", {
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
    $dragtargets = $(".dragtarget");

    $draggers.on('mouseenter', function () { $(this).parent().parent().attr("draggable", true) });
    $draggers.on('mouseleave', function () { $(this).parent().parent().attr("draggable", false) }); 

    $draggables.on('dragstart', function (e) {
        $dragging = $(this);
        $(".dragtarget").addClass("droptarget-active");
    });
    $draggables.on('dragend', function (e) {
        $dragging = null;
        $('.dragover').removeClass("dragover");
        $(".dragtarget").removeClass("droptarget-active");
    });

    $dragtargets.on('dragover', function (e) {
        e.preventDefault();
        $(this).addClass("dragover");
    });
    $dragtargets.on('dragleave', function (e) {
        e.preventDefault();
        $('.dragover').removeClass("dragover");
    });
    $dragtargets.on('drop', function (e) {
        e.preventDefault();
        $('.dragover').removeClass("dragover");
        $(".dragtarget").removeClass("droptarget-active");
        
        $dragging.insertBefore($(this));
    });
});
