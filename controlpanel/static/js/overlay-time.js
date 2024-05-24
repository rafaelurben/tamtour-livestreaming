/* Time overlay */


async function showTimeOverlay() {
    let success = await obs.sendAction("showTimeOverlay");
    if (!success) return false;

    let button = $("#btn-show-time-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}

async function hideTimeOverlay() {
    let success = await obs.sendAction("hideTimeOverlay");
    if (!success) return false;

    let button = $("#btn-hide-time-overlay");
    button.prop("disabled", true);
    setTimeout(() => { button.prop("disabled", false) }, 1000);

    return true;
}
