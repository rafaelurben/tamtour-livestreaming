// Settings

async function setSettings() {
    await sendAction("setSettings", {
        backgroundColor: $("#settings-background-color-input").val(),
        textColor: $("#settings-text-color-input").val()
    });
}

async function resetSettings() {
    $("#settings-background-color-input").val("#758aa5");
    $("#settings-text-color-input").val("#ffffff");
    await setSettings();
}
