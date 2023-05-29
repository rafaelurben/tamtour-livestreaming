/* Start info overlay */

// Scenes

let sceneSelect = $("#obs-scene-select-input");
let sceneDisplay = $("#obs-scene-display");

function _updateScenePanel(data) {
    sceneSelect.off("change");

    let oldPreviewScene = sceneSelect.val();

    if (data.scenes) {
        sceneSelect.empty();
        for (let scene of data.scenes) {
            let optelem = $("<option>", { value: scene.sceneName, text: scene.sceneName });
            sceneSelect.append(optelem);
        }
    }

    let newPreviewScene = data.currentPreviewSceneName || oldPreviewScene;
    sceneSelect.val(newPreviewScene);
    
    if (data.currentProgramSceneName) {
        sceneDisplay.val(data.currentProgramSceneName);
    }

    sceneSelect.change((event) => {
        sendOBSCommand("SetCurrentPreviewScene", { sceneName: event.target.value });
    });
}

async function loadScenes() {
    _updateScenePanel(await sendOBSCommand("GetSceneList"));
}

obs.on("SceneNameChanged", data => {
    if (data.oldSceneName == sceneDisplay.val()) {
        sceneDisplay.val(data.sceneName);
    }
    if (data.oldSceneName == sceneSelect.val()) {
        $(`#obs-scene-select-input option[value="${data.oldSceneName}"]`).val(data.sceneName).text(data.sceneName);
    }
})
obs.on("CurrentProgramSceneChanged", data => {
    _updateScenePanel({ currentProgramSceneName: data.sceneName })
})
obs.on("CurrentPreviewSceneChanged", data => {
    _updateScenePanel({ currentPreviewSceneName: data.sceneName })
})
obs.on("SceneListChanged", data => {
    _updateScenePanel(data);
})

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

// General Events & Intervals

let interval = null;

obs.on('Identified', () => {
    loadScenes();
    loadRecordStatus();
    loadStreamStatus();
    
    interval = setInterval(() => {
        if (recordActive) loadRecordStatus();
        if (streamActive) {loadStreamStatus()} else {showStreamCongestion(null)};
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
            () => sendOBSCommand("SetCurrentPreviewScene", { sceneName: sceneSelect.val() })
        );
    }
})
