// Collapser

function toggleCollapse(elem) {
    $(elem).parent().parent().toggleClass("collapsed");
}

// Drag and drop

$(document).ready(function () {
    var $dragging = null;

    $draggers = $("fieldset.droptarget > legend > span.collapser");
    $draggables = $("fieldset.droptarget");
    $droptargets = $(".droptarget");

    $draggers.on('mouseenter', function () {
        $(this).parent().parent().attr("draggable", true)
    });
    $draggers.on('mouseleave', function () {
        $(this).parent().parent().attr("draggable", false)
    });

    $draggables.on('dragstart', function (e) {
        if (e.target.tagName !== "FIELDSET") return;

        $dragging = $(this);
        $(".droptarget").addClass("droptarget-active");

        // Hide nonsense targets (e.g. the one we're dragging)
        $dragging.removeClass("droptarget-active");
        $dragging.next("fieldset.droptarget").removeClass("droptarget-active");
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

// Prevent accidental reload/close

if (!(location.search.includes('debug'))) {
    $(window).on("beforeunload", (e) => {
        e.preventDefault();
    });
}
