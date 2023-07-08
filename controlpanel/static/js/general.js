// Collapser

function toggleCollapse(elem) {
    $(elem).parent().parent().toggleClass("collapsed");
}

// Drag and drop

$(document).ready(function () {
    var $dragging = null;

    $draggers = $("fieldset.droptarget > legend > span.collapser");
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
