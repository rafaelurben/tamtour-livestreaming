/* Start info overlay */

// Scenes

let previewSceneSelect = $("#obs-scene-select-input");
let programSceneDisplay = $("#obs-scene-display");

function _updateScenePanel(data) {
    previewSceneSelect.off("change");

    let oldPreviewScene = previewSceneSelect.val();

    if (data.scenes) {
        previewSceneSelect.empty();
        for (let scene of data.scenes.reverse()) {
            let optelem = $("<option>", {value: scene.sceneName, text: scene.sceneName});
            previewSceneSelect.append(optelem);
        }
    }

    let newPreviewScene = data.currentPreviewSceneName || oldPreviewScene;
    previewSceneSelect.val(newPreviewScene);

    if (data.currentProgramSceneName) {
        programSceneDisplay.val(data.currentProgramSceneName);
    }

    previewSceneSelect.change((event) => {
        obs.sendCommand("SetCurrentPreviewScene", {sceneName: event.target.value});
    });
}

async function loadScenes() {
    _updateScenePanel(await obs.sendCommand("GetSceneList"));
}

obs.on("SceneNameChanged", data => {
    if (data.oldSceneName === programSceneDisplay.val()) {
        programSceneDisplay.val(data.sceneName);
    }
    if (data.oldSceneName === previewSceneSelect.val()) {
        $(`#obs-scene-select-input option[value="${data.oldSceneName}"]`).val(data.sceneName).text(data.sceneName);
    }
})
obs.on("CurrentProgramSceneChanged", data => {
    _updateScenePanel({currentProgramSceneName: data.sceneName})
    if (liveScreenshotsEnabled) getProgramScreenshot();
})
obs.on("CurrentPreviewSceneChanged", data => {
    _updateScenePanel({currentPreviewSceneName: data.sceneName})
    if (liveScreenshotsEnabled) getPreviewScreenshot();
})
obs.on("SceneListChanged", data => {
    _updateScenePanel(data);
})

// Transition

let transitionBtn = $("#obs-start-transition-btn");
let transitionSelect = $("#obs-transition-select-input");

function _updateTransitionPanel(data) {
    transitionSelect.off("change");

    if (data.transitions) {
        transitionSelect.empty();
        for (let transition of data.transitions.reverse()) {
            let optelem = $("<option>", {value: transition.transitionName, text: transition.transitionName});
            transitionSelect.append(optelem);
        }
    }

    transitionSelect.val(data.currentSceneTransitionName || data.transitionName);

    transitionSelect.change((event) => {
        obs.sendCommand("SetCurrentSceneTransition", {transitionName: event.target.value});
    });
}

async function loadTransitions() {
    _updateTransitionPanel(await obs.sendCommand("GetSceneTransitionList"));
}

async function startTransition() {
    await obs.sendCommand('TriggerStudioModeTransition');
    transitionBtn.prop("disabled", true);
}

obs.on('CurrentSceneTransitionChanged', data => {
    _updateTransitionPanel(data);
})

obs.on('SceneTransitionStarted', data => {
    previewSceneSelect.prop('disabled', true);
    transitionBtn.prop('disabled', true);
    transitionSelect.prop("disabled", true);
})

obs.on('SceneTransitionVideoEnded', data => {
    previewSceneSelect.prop('disabled', false);
    transitionBtn.prop('disabled', false);
    transitionSelect.prop('disabled', false);
})

// Preview/Program display

let liveScreenshotsEnabled = false;
let liveScreenshotWidth = 960;

let previewImageElem = $("#obs-preview-image");
let programImageElem = $("#obs-program-image");

async function getProgramScreenshot() {
    let data = await obs.sendCommand('GetSourceScreenshot', {
        sourceName: programSceneDisplay.val(),
        imageFormat: "jpg",
        imageWidth: liveScreenshotWidth,
        imageHeight: liveScreenshotWidth / 16 * 9
    })
    if (data && data.imageData) {
        programImageElem.attr("src", data.imageData);
    }
}

async function getPreviewScreenshot() {
    let data = await obs.sendCommand('GetSourceScreenshot', {
        sourceName: previewSceneSelect.val(),
        imageFormat: "jpg",
        imageWidth: liveScreenshotWidth,
        imageHeight: liveScreenshotWidth / 16 * 9
    })
    if (data && data.imageData) {
        previewImageElem.attr("src", data.imageData);
    }
}

function getLiveScreenshots() {
    getPreviewScreenshot();
    getProgramScreenshot();
}

function toggleLiveScreenshots() {
    liveScreenshotsEnabled = $("#obs-screenshots-container").is(':visible');
    if (liveScreenshotsEnabled && obs.connected) {
        getLiveScreenshots();
    }
}

// Record status

let recordActive = false;

let recordStatusDisplay = $("#obs-record-status-display");
let recordStartBtn = $("#obs-record-start-btn");
let recordStopBtn = $("#obs-record-stop-btn");

async function loadRecordStatus() {
    let recDat = await obs.sendCommand("GetRecordStatus");
    recordActive = recDat.outputActive;

    if (recordActive) {
        recordStartBtn.toggleClass("d-none", true);
        recordStopBtn.toggleClass("d-none", false);

        let recTsp = recDat.outputTimecode.split(".")[0];
        let recMB = (recDat.outputBytes / 1024 / 1024).toFixed(3);
        let txt = `${recTsp} (${recMB} MB)`;
        recordStatusDisplay.val(txt);
    } else {
        recordStatusDisplay.val("Keine Aufnahme");
        recordStartBtn.toggleClass("d-none", false);
        recordStopBtn.toggleClass("d-none", true);
    }
}

obs.on("RecordStateChanged", loadRecordStatus)

// Replay Buffer status

let replayBufferActive = false;

let replayBufferGroup = $("#obs-replaybuffer-group");
let replayBufferStatusDisplay = $("#obs-replaybuffer-status-display");
let replayBufferStartBtn = $("#obs-replaybuffer-start-btn");
let replayBufferStopBtn = $("#obs-replaybuffer-stop-btn");
let replayBufferSaveBtn = $("#obs-replaybuffer-save-btn");

async function loadReplayBufferStatus() {
    let bufDat = await obs.sendCommand("GetReplayBufferStatus", undefined, true);

    if (bufDat === null) {
        replayBufferActive = false;
        replayBufferGroup.toggleClass("d-none", true);
        return;
    }

    replayBufferActive = bufDat.outputActive;
    replayBufferGroup.toggleClass("d-none", false);
    replayBufferSaveBtn.attr("disabled", !replayBufferActive)
    replayBufferStartBtn.toggleClass("d-none", replayBufferActive);
    replayBufferStopBtn.toggleClass("d-none", !replayBufferActive);

    replayBufferStatusDisplay.val(replayBufferActive ? "Replay Buffer aktiv" : "Replay Buffer inaktiv");
}

obs.on("ReplayBufferStateChanged", loadReplayBufferStatus)
obs.on("ReplayBufferSaved", data => {
    console.log("Replay saved to " + data.savedReplayPath)
    replayBufferSaveBtn.toggleClass("btn-success", true);
    replayBufferSaveBtn.toggleClass("btn-primary", false);
    setTimeout(() => {
        replayBufferSaveBtn.toggleClass("btn-success", false);
        replayBufferSaveBtn.toggleClass("btn-primary", true);
    }, 2500);
})

// Stream status

let streamActive = false;
let streamCongestionHistory = [];

let streamCongestionHistoryRow = $("#obs-stream-congestion-history-row");
let streamStatusDisplay = $("#obs-stream-status-display");
let streamStartBtn = $("#obs-stream-start-btn");
let streamStopBtn = $("#obs-stream-stop-btn");

async function loadStreamStatus() {
    let strDat = await obs.sendCommand("GetStreamStatus");
    streamActive = strDat.outputActive;

    if (strDat.outputActive) {
        streamStartBtn.toggleClass("d-none", true);
        streamStopBtn.toggleClass("d-none", false);

        let strTsp = strDat.outputTimecode.split(".")[0];
        let strMB = (strDat.outputBytes / 1024 / 1024).toFixed(3);
        let txt = `${strTsp} (${strMB} MB) [Dropped: ${strDat.outputSkippedFrames} / ${strDat.outputTotalFrames}`;
        if (strDat.outputCongestion) {
            txt += ", Verstopft: " + strDat.outputCongestion.toFixed(2);
        }
        if (strDat.outputReconnecting) {
            txt += ", Verbinden...";
        }
        txt += "]";
        streamStatusDisplay.val(txt);

        showStreamCongestion(strDat.outputCongestion, strDat.outputReconnecting);
    } else {
        streamStartBtn.toggleClass("d-none", false);
        streamStopBtn.toggleClass("d-none", true);
        streamStatusDisplay.val("Kein Stream");
    }
}

function showStreamCongestion(congestion, reconnecting = false) {
    // Note: congestion is a number between 0 and 1 or null

    streamCongestionHistory.push(congestion);

    let r = 0, g = 0, b = 0;
    if (reconnecting) {
        b = 255;
    } else {
        if (congestion === null) {
            r = 0;
            g = 0;
        } else if (congestion === 0) {
            r = 0;
            g = 255;
        } else {
            r = 255;
            g = (1 - congestion) * 255;
        }
    }

    $("#obs-rec-stream-fieldset").toggleClass("failing", reconnecting || congestion > 0);

    let elem = $("<div>", {
        style: `background-color: rgb(${r}, ${g}, ${b});`
    });
    streamCongestionHistoryRow.append(elem);

    if (streamCongestionHistory.length > 60) {
        streamCongestionHistory.shift();
        streamCongestionHistoryRow.children().first().remove();
    }
}

obs.on("StreamStateChanged", loadStreamStatus);

// Volume meter

let smoothingDiff = 1.2;
let volumeMeter1 = $("#obs-volume-meter-1");
let volumeMeter2 = $("#obs-volume-meter-2");
let ch1latestValuedB = -Infinity;
let ch2latestValuedB = -Infinity;

function displayVolumeMeter(data) {
    // From: https://github.com/obsproject/obs-websocket/commit/d48ddef0318af1e370a4d0b77751afc14ac6b140
    // The `inputLevelsMul` field follows this data format:

    // Base: [Channel, Channel]
    // Channel: [magnitude(mul), peak(mul), input_peak(mul)]

    //            * Not Muted *      * Muted *
    // Example: [[0.3, 0.5, 0.9], [0.0, 0.0, 0.0]]

    let ch1peaks = [0];
    let ch2peaks = [0];

    for (let src of data.inputs) {
        if (src.inputLevelsMul.length === 0) continue;

        ch1peaks.push(src.inputLevelsMul[0][1]);
        ch2peaks.push(src.inputLevelsMul[src.inputLevelsMul.length > 1 ? 1 : 0][1]);
    }

    // Convert to dB
    let ch1peakdB = 20 * Math.log10(Math.max(...ch1peaks));
    let ch2peakdB = 20 * Math.log10(Math.max(...ch2peaks));

    // Make clipping stay longer
    ch1peakdB = ch1peakdB === 0 ? 20 : ch1peakdB;
    ch2peakdB = ch2peakdB === 0 ? 20 : ch2peakdB;

    // Smooth the peak
    ch1latestValuedB = Math.max(ch1latestValuedB - smoothingDiff, ch1peakdB);
    ch2latestValuedB = Math.max(ch2latestValuedB - smoothingDiff, ch2peakdB);

    // Display the smoothened peak
    volumeMeter1.val(Math.min(Math.max(ch1latestValuedB, -60), 0));
    volumeMeter2.val(Math.min(Math.max(ch2latestValuedB, -60), 0));
}

obs.on("InputVolumeMeters", displayVolumeMeter);

function toggleLiveVolume() {
    let liveVolumeEnabled = $("#obs-volume-meters-group").is(':visible')
    if (liveVolumeEnabled) {
        obs.updateSubscriptions(obs.SUBSCRIPTIONS_DEFAULT)
    } else {
        obs.updateSubscriptions(obs.SUBSCRIPTIONS_WITHOUT_VOLUME)
    }
}

// General Events & Intervals

let obsInterval = null;

obs.on('Identified', () => {
    loadScenes();
    loadTransitions();
    loadRecordStatus();
    loadReplayBufferStatus();
    loadStreamStatus();

    obsInterval = setInterval(() => {
        if (recordActive) loadRecordStatus();
        if (streamActive) {
            loadStreamStatus()
        } else {
            showStreamCongestion(null)
        }
        if (liveScreenshotsEnabled) getLiveScreenshots();
    }, 1000);

    obs.sendCommand("SetStudioModeEnabled", {studioModeEnabled: true});
})

obs.on('ConnectionClosed', () => {
    clearInterval(obsInterval);
})

obs.on('StudioModeStateChanged', data => {
    // Enforce studio mode
    if (!data.studioModeEnabled) {
        obs.sendCommand("SetStudioModeEnabled", {studioModeEnabled: true}).then(
            () => obs.sendCommand("SetCurrentPreviewScene", {sceneName: previewSceneSelect.val()})
        );
    }
})
