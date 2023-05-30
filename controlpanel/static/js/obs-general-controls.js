/* Start info overlay */

// Scenes

let previewSceneSelect = $("#obs-scene-select-input");
let programSceneDisplay = $("#obs-scene-display");

function _updateScenePanel(data) {
    previewSceneSelect.off("change");

    let oldPreviewScene = previewSceneSelect.val();

    if (data.scenes) {
        previewSceneSelect.empty();
        for (let scene of data.scenes) {
            let optelem = $("<option>", { value: scene.sceneName, text: scene.sceneName });
            previewSceneSelect.append(optelem);
        }
    }

    let newPreviewScene = data.currentPreviewSceneName || oldPreviewScene;
    previewSceneSelect.val(newPreviewScene);
    
    if (data.currentProgramSceneName) {
        programSceneDisplay.val(data.currentProgramSceneName);
    }

    previewSceneSelect.change((event) => {
        sendOBSCommand("SetCurrentPreviewScene", { sceneName: event.target.value });
    });
}

async function loadScenes() {
    _updateScenePanel(await sendOBSCommand("GetSceneList"));
}

obs.on("SceneNameChanged", data => {
    if (data.oldSceneName == programSceneDisplay.val()) {
        programSceneDisplay.val(data.sceneName);
    }
    if (data.oldSceneName == previewSceneSelect.val()) {
        $(`#obs-scene-select-input option[value="${data.oldSceneName}"]`).val(data.sceneName).text(data.sceneName);
    }
})
obs.on("CurrentProgramSceneChanged", data => {
    _updateScenePanel({ currentProgramSceneName: data.sceneName })
    if (liveScreenshotsEnabled) getProgramScreenshot();
})
obs.on("CurrentPreviewSceneChanged", data => {
    _updateScenePanel({ currentPreviewSceneName: data.sceneName })
    if (liveScreenshotsEnabled) getPreviewScreenshot();
})
obs.on("SceneListChanged", data => {
    _updateScenePanel(data);
})

// Preview/Program display

let liveScreenshotsEnabled = false;
let liveScreenshotWidth = 960;

let previewImageElem = $("#obs-preview-image");
let programImageElem = $("#obs-program-image");

async function getProgramScreenshot() {
    let data = await sendOBSCommand('GetSourceScreenshot', {
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
    let data = await sendOBSCommand('GetSourceScreenshot', {
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
    if (liveScreenshotsEnabled) {
        getLiveScreenshots();
    }
}

// Record status

let recordActive = false;

let recordStatusDisplay = $("#obs-record-status-display");
let recordStartBtn = $("#obs-record-start-btn");
let recordStopBtn = $("#obs-record-stop-btn");

async function loadRecordStatus() {
    let recDat = await sendOBSCommand("GetRecordStatus");
    recordActive = recDat.outputActive;

    if (recDat.outputActive) {
        recordStartBtn.toggleClass("d-none", true);
        recordStopBtn.toggleClass("d-none", false);
        
        let recTsp = recDat.outputTimecode.split(".")[0];
        let recMB = (recDat.outputBytes / 1024 / 1024).toFixed(3);
        var txt = `${recTsp} (${recMB} MB)`;
        recordStatusDisplay.val(txt);
    } else {
        recordStatusDisplay.val("Keine Aufnahme");
        recordStartBtn.toggleClass("d-none", false);
        recordStopBtn.toggleClass("d-none", true);
    }
}

obs.on("RecordStateChanged", loadRecordStatus)

// Stream status

let streamActive = false;
let streamCongestionHistory = [];

let streamCongestionHistoryRow = $("#obs-stream-congestion-history-row");
let streamStatusDisplay = $("#obs-stream-status-display");
let streamStartBtn = $("#obs-stream-start-btn");
let streamStopBtn = $("#obs-stream-stop-btn");

async function loadStreamStatus() {
    let strDat = await sendOBSCommand("GetStreamStatus");
    streamActive = strDat.outputActive;

    if (strDat.outputActive) {
        streamStartBtn.toggleClass("d-none", true);
        streamStopBtn.toggleClass("d-none", false);

        let strTsp = strDat.outputTimecode.split(".")[0];
        let strMB = (strDat.outputBytes / 1024 / 1024).toFixed(3);
        var txt = `${strTsp} (${strMB} MB) [Dropped: ${strDat.outputSkippedFrames} / ${strDat.outputTotalFrames}`;
        if (strDat.outputCongestion) {
            txt += ", Verstopft: " + strDat.outputCongestion.toFixed(2);
        }
        if (strDat.outputReconnecting) {
            txt += ", Verbinden...";
        }
        txt += "]";
        streamStatusDisplay.val(txt);

        showStreamCongestion(strDat.outputCongestion);
    } else {
        streamStartBtn.toggleClass("d-none", false);
        streamStopBtn.toggleClass("d-none", true);
        streamStatusDisplay.val("Kein Stream");
    }
}

function showStreamCongestion(congestion) {
    // Note: congestion is a number between 0 and 1 or null

    streamCongestionHistory.push(congestion);

    let r = congestion == null ? 0 : congestion * 255;
    let g = congestion == null ? 0 : (1 - congestion) * 255;

    let elem = $("<div>", {
        style: `background-color: rgb(${r}, ${g}, 0);`
    });
    streamCongestionHistoryRow.append(elem);

    if (streamCongestionHistory.length > 60) {
        streamCongestionHistory.shift();
        streamCongestionHistoryRow.children().first().remove();
    };
}

obs.on("StreamStateChanged", loadStreamStatus);

// Volume meter

let volumeMeter1 = $("#obs-volume-meter-1");
let volumeMeter2 = $("#obs-volume-meter-2");
let ch1peakHistory = [];
let ch2peakHistory = [];

function displayVolumeMeter(data) {
    // From: https://github.com/obsproject/obs-websocket/commit/d48ddef0318af1e370a4d0b77751afc14ac6b140
    // The `inputLevelsMul` field follows this data format:

    // Base: [Channel, Channel]
    // Channel: [magnitude(mul), peak(mul), input_peak(mul)]

    //            * Not Muted *      * Muted *
    // Example: [[0.3, 0.5, 0.9], [0.0, 0.0, 0.0]]

    let ch1peaks = [];
    let ch2peaks = [];

    for (let src of data.inputs) {
        if (src.inputLevelsMul.length == 0) continue;

        ch1peaks.push(src.inputLevelsMul[0][1]);
        ch2peaks.push(src.inputLevelsMul[0][1]);
    }

    // If no sources are active, the array will be empty
    if (ch1peaks.length == 0) {
        ch1peaks.push(0);
        ch2peaks.push(0);
    }

    let ch1peakdB = 20 * Math.log10(Math.max(...ch1peaks));
    let ch2peakdB = 20 * Math.log10(Math.max(...ch2peaks));

    // Expected values are between 0 and -Infinity

    ch1peakHistory.push(ch1peakdB);
    ch2peakHistory.push(ch2peakdB);

    if (ch1peakHistory.length > 10) {
        ch1peakHistory.shift();
        ch2peakHistory.shift();
    }

    let ch1peakMaxdB = Math.max(...ch1peakHistory);
    let ch2peakMaxdB = Math.max(...ch2peakHistory);

    // Display the current peak and the maximum peak in the last samples

    volumeMeter1.val(Math.max(ch1peakMaxdB, -60));
    volumeMeter2.val(Math.max(ch2peakMaxdB, -60));
}

obs.on("InputVolumeMeters", displayVolumeMeter);

// General Events & Intervals

let interval = null;

obs.on('Identified', () => {
    loadScenes();
    loadRecordStatus();
    loadStreamStatus();
    
    interval = setInterval(() => {
        if (recordActive) loadRecordStatus();
        if (streamActive) {loadStreamStatus()} else {showStreamCongestion(null)};
        if (liveScreenshotsEnabled) getLiveScreenshots();
    }, 1000);

    sendOBSCommand("SetStudioModeEnabled", {studioModeEnabled: true});
})

obs.on('ConnectionClosed', () => {
    clearInterval(interval);
})

obs.on('StudioModeStateChanged', data => {
    // Enforce studio mode
    if (!data.studioModeEnabled) {
        sendOBSCommand("SetStudioModeEnabled", {studioModeEnabled: true}).then(
            () => sendOBSCommand("SetCurrentPreviewScene", { sceneName: previewSceneSelect.val() })
        );
    }
})
