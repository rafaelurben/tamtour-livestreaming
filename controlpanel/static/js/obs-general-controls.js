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

window.addEventListener("load", () => {
    setInterval(() => {
        if (window.obs_connected) {
            loadScenes();
        }
    }, 1000);
});
