/* Sponsors overlay */

const SPONSORS_COOLDOWN = 15;

var sponsorsoverlayInterval = null;
var sponsorsoverlaySecondsRemaining = 0;

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

    sponsorsoverlaySecondsRemaining = min * 60 + 1;
    updateSponsorsVideoState();
}

function updateSponsorsVideoState() {
    let timer = $("#sponsors-interval-timer");

    sponsorsoverlaySecondsRemaining = Math.floor(sponsorsoverlaySecondsRemaining);
    sponsorsoverlaySecondsRemaining -= 1;

    if (sponsorsoverlaySecondsRemaining < -SPONSORS_COOLDOWN) {
        resetSponsorsVideoTimer();
    }

    let min = Math.floor(sponsorsoverlaySecondsRemaining / 60);
    let sec = sponsorsoverlaySecondsRemaining % 60;

    if (sponsorsoverlaySecondsRemaining > 0) {
        timer.val(`${min}m ${sec}s`);
    } else if (sponsorsoverlaySecondsRemaining == 0) {
        playSponsorsAnimation();
        timer.val("Animation gestartet");
    }
}

function startSponsorsVideoInterval() {
    if (sponsorsoverlayInterval) return;

    $("#btn-start-sponsorsvideo-interval").addClass("d-none")
    $("#btn-stop-sponsorsvideo-interval").removeClass("d-none")
    $("#sponsors-interval-input").prop("disabled", true)

    resetSponsorsVideoTimer();

    sponsorsoverlayInterval = setInterval(() => {
        updateSponsorsVideoState();
    }, 1000);
}

function stopSponsorsVideoInterval() {
    if (!sponsorsoverlayInterval) return;

    clearInterval(sponsorsoverlayInterval);
    sponsorsoverlayInterval = null;

    $("#btn-start-sponsorsvideo-interval").removeClass("d-none")
    $("#btn-stop-sponsorsvideo-interval").addClass("d-none")
    $("#sponsors-interval-input").prop("disabled", false)
    $("#sponsors-interval-timer").val("")

    sponsorsoverlaySecondsRemaining = 0;
}

// Events

obs.on('ConnectionClosed', () => {
    stopSponsorsVideoInterval();
})
