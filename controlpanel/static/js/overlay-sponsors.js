/* Sponsors overlay */

const SPONSORS_COOLDOWN = 15;

let sponsorsOverlayInterval = null;
let sponsorsOverlaySecondsRemaining = 0;

async function playSponsorsAnimation() {
    let success = await obs.sendAction("playSponsorsAnimation");
    if (!success) return;

    let button = $("#btn-play-sponsorsvideo");
    button.prop("disabled", true);

    setTimeout(() => { button.prop("disabled", false) }, 1000);
}

async function cancelSponsorsAnimation() {
    let success = await obs.sendAction("cancelSponsorsAnimation");
    if (!success) return;

    let button = $("#btn-cancel-sponsorsvideo");
    button.prop("disabled", true);

    setTimeout(() => { button.prop("disabled", false) }, 1000);
}

// Local interval timer

function resetSponsorsVideoTimer() {
    let input = $("#sponsors-interval-input");

    let min = input.val() || 10;

    sponsorsOverlaySecondsRemaining = min * 60 + 1;
    updateSponsorsVideoState();
}

function updateSponsorsVideoState() {
    let timer = $("#sponsors-interval-timer");

    sponsorsOverlaySecondsRemaining = Math.floor(sponsorsOverlaySecondsRemaining);
    sponsorsOverlaySecondsRemaining -= 1;

    if (sponsorsOverlaySecondsRemaining < -SPONSORS_COOLDOWN) {
        resetSponsorsVideoTimer();
    }

    let min = Math.floor(sponsorsOverlaySecondsRemaining / 60);
    let sec = sponsorsOverlaySecondsRemaining % 60;

    if (sponsorsOverlaySecondsRemaining > 0) {
        timer.val(`${min}m ${sec}s`);
    } else if (sponsorsOverlaySecondsRemaining === 0) {
        playSponsorsAnimation();
        timer.val("Animation gestartet");
    }
}

function startSponsorsVideoInterval() {
    if (sponsorsOverlayInterval) return;

    $("#btn-start-sponsorsvideo-interval").addClass("d-none")
    $("#btn-stop-sponsorsvideo-interval").removeClass("d-none")
    $("#sponsors-interval-input").prop("disabled", true)

    resetSponsorsVideoTimer();

    sponsorsOverlayInterval = setInterval(() => {
        updateSponsorsVideoState();
    }, 1000);
}

function stopSponsorsVideoInterval() {
    if (!sponsorsOverlayInterval) return;

    clearInterval(sponsorsOverlayInterval);
    sponsorsOverlayInterval = null;

    $("#btn-start-sponsorsvideo-interval").removeClass("d-none")
    $("#btn-stop-sponsorsvideo-interval").addClass("d-none")
    $("#sponsors-interval-input").prop("disabled", false)
    $("#sponsors-interval-timer").val("")

    sponsorsOverlaySecondsRemaining = 0;
}

// Events

obs.on('ConnectionClosed', () => {
    stopSponsorsVideoInterval();
})

obs.on('Identified', () => {
    startSponsorsVideoInterval();
})
