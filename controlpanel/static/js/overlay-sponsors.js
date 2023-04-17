/* Sponsors overlay */

var sponsorsoverlayInterval = null;
var sponsorsoverlaySecondsRemaining = 0;

async function sendPlaySponsorsVideo() {
    let success = await sendAction("playSponsorsAnimation");
    if (!success) return;

    let button = $("#btn-play-sponsorsvideo");
    button.prop("disabled", true);

    setTimeout(() => { button.prop("disabled", false) }, 5000);
}

function resetSponsorsVideoTimer() {
    let timer = $("#sponsors-interval-timer");
    let input = $("#sponsors-interval-input");

    sponsorsoverlaySecondsRemaining = input.val() * 60;
    timer.val(sponsorsoverlaySecondsRemaining + "s");
}

function updateSponsorsVideoState() {
    let timer = $("#sponsors-interval-timer");

    sponsorsoverlaySecondsRemaining -= 1;

    if (sponsorsoverlaySecondsRemaining < -5) {
        resetSponsorsVideoTimer();
    }

    console.log(sponsorsoverlaySecondsRemaining)

    if (sponsorsoverlaySecondsRemaining > 0) {
        timer.val(sponsorsoverlaySecondsRemaining + "s");
    } else if (sponsorsoverlaySecondsRemaining == 0) {
        sendPlaySponsorsVideo();
        timer.val("Started playing");
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

window.addEventListener("load", () => {
    $("#sponsors-interval-timer").val("")
})
