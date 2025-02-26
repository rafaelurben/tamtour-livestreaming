/* Time overlay */

function _updateTimeOverlayTime() {
    let time = new Date();
    let hours = String(time.getHours()).padStart(2, "0");
    let minutes = String(time.getMinutes()).padStart(2, "0");
    let seconds = String(time.getSeconds()).padStart(2, "0");
    $("#time-display").val(`${hours}:${minutes}:${seconds}`);
}

async function showTimeOverlay() {
    let success = await obs.sendAction("showTimeOverlay");
    if (!success) return false;

    let button = $("#btn-show-time-overlay");
    button.prop("disabled", true);
    setTimeout(() => {
        button.prop("disabled", false)
    }, 1000);

    return true;
}

async function hideTimeOverlay() {
    let success = await obs.sendAction("hideTimeOverlay");
    if (!success) return false;

    let button = $("#btn-hide-time-overlay");
    button.prop("disabled", true);
    setTimeout(() => {
        button.prop("disabled", false)
    }, 1000);

    return true;
}

window.addEventListener('load', function () {
    setInterval(_updateTimeOverlayTime, 1000)
});
