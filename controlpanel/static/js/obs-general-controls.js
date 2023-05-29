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

// Record / Stream status

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

let interval = null;

obs.on('Identified', () => {
    loadScenes();
    loadStatus();
    sendOBSCommand("SetStudioModeEnabled", {studioModeEnabled: true});
    
    interval = setInterval(() => {
        loadStatus();
    }, 1000);
})

obs.on('ConnectionClosed', () => {
    clearInterval(interval);
})
