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
    let recordStatusData = await sendOBSCommand("GetRecordStatus");
    let streamStatusData = await sendOBSCommand("GetStreamStatus");

    let recordStatusDisplay = $("#obs-record-status-display");
    let streamStatusDisplay = $("#obs-stream-status-display");

    if (recordStatusData.outputActive) {
        recordStatusDisplay.val(`Aufnahme ${recordStatusData.outputTimecode.split(".")[0]}`);
    } else {
        recordStatusDisplay.val("Keine Aufnahme");
    }

    if (streamStatusData.outputActive) {
        streamStatusDisplay.val(`Stream ${streamStatusData.outputTimecode.split(".")[0]} (Skipped: ${recordStatusData.outputSkippedFrames})`);
    } else {
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
