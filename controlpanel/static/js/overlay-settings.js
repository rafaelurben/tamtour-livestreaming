// Settings

async function setSettings() {
    await obs.sendAction("setSettings", {
        backgroundColor: $("#settings-background-color-input").val(),
        textColor: $("#settings-text-color-input").val(),
        directionInverted: $("#settings-direction-inverted-input").prop("checked"),
    });
}

async function resetSettings() {
    $("#settings-background-color-input").val("#758aa5");
    $("#settings-text-color-input").val("#ffffff");
    $("#settings-direction-inverted-input").prop("checked", false);
}
