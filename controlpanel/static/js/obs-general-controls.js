/* Start info overlay */

async function loadScenes() {
    let data = await sendOBSCommand("GetSceneList");

    let sceneSelect = $("#obs-scene-select-input");
    let sceneDisplay = $("#obs-scene-display");
    sceneSelect.off("change");

    sceneSelect.empty();
    for (let scene of data.scenes) {
        let optelem = $("<option>", { value: scene.sceneName, text: scene.sceneName });
        sceneSelect.append(optelem);
    }

    sceneSelect.val(data.currentPreviewSceneName);
    sceneSelect.change((event) => { sendOBSCommand("SetCurrentPreviewScene", {sceneName: event.target.value}); });
    sceneDisplay.val(data.currentProgramSceneName);
}

async function loadStatus() {
    let recDat = await sendOBSCommand("GetRecordStatus");
    
    let recordStatusDisplay = $("#obs-record-status-display");
    let recordStartBtn = $("#obs-record-start-btn");
    let recordStopBtn = $("#obs-record-stop-btn");

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

    let strDat = await sendOBSCommand("GetStreamStatus");

    let streamStatusDisplay = $("#obs-stream-status-display");
    let streamStartBtn = $("#obs-stream-start-btn");
    let streamStopBtn = $("#obs-stream-stop-btn");

    if (strDat.outputActive) {
        streamStartBtn.toggleClass("d-none", true);
        streamStopBtn.toggleClass("d-none", false);

        let strTsp = strDat.outputTimecode.split(".")[0];
        let strMB = (strDat.outputBytes / 1024 / 1024).toFixed(3);
        var txt = `${strTsp} (${strMB} MB, Skipped: ${strDat.outputSkippedFrames} / ${strDat.outputTotalFrames})`;
        if (strDat.outputReconnecting) {
            txt += " Reconnecting...";
        }
        if (strDat.outputCongestion) {
            txt += " Congestion: " + strDat.outputCongestion;
        }
        streamStatusDisplay.val(txt);
    } else {
        streamStartBtn.toggleClass("d-none", false);
        streamStopBtn.toggleClass("d-none", true);
        streamStatusDisplay.val("Kein Stream");
    }
}

// Intervals

function __load() {
    loadScenes();
    loadStatus();
}

let interval = null;

obs.on('Identified', () => {
    __load();

    interval = setInterval(() => {
        __load();
    }, 1000);
})

obs.on('ConnectionClosed', () => {
    clearInterval(interval);
})
