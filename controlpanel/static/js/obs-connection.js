obs = new OBSWebSocket()
wakeLock = null;

async function __handle_disconnected() {
    console.log("[OBS] Disconnected!");
    $("#btn-connect").removeClass("d-none");
    $("#btn-disconnect").addClass("d-none");
    $("#controlpanel-container").addClass("notconnected");
    $("#open-obs-dialog-btn").addClass("btn-success").removeClass("btn-danger").text("OBS verbinden");

    if (wakeLock != null) {
        try {
            await wakeLock.release();
            wakeLock = null;
        } catch (err) {
            console.warn(`Wakelock release failed: ${err.name}, ${err.message}`);
        }   
    }
}

async function disconnect() {
    sessionStorage.setItem("obs-auto-connect", "false");

    try {
        await obs.disconnect();
    } catch (error) {
        console.error("[OBS] Disconnect failed: ", error);
    }
}

async function __handle_connected() {
    console.log("[OBS] Connected!");
    $("#btn-connect").addClass("d-none");
    $("#btn-disconnect").removeClass("d-none");
    $("#controlpanel-container").removeClass("notconnected");
    $("#open-obs-dialog-btn").removeClass("btn-success").addClass("btn-danger").text("OBS verbunden");

    sessionStorage.setItem("obs-auto-connect", "true");
    sessionStorage.setItem("obs-target", document.getElementById('login-form-target').value);
    sessionStorage.setItem("obs-password", document.getElementById('login-form-password').value);

    if (wakeLock == null) {
        try {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock was released');
            });
            console.log('Wake Lock is active');
        } catch (err) {
            console.warn(`Wakelock request failed: ${err.name}, ${err.message}`);
        }
    }
}

async function connect(target, password) {
    var prefix = "ws://";
    if (target.startsWith("https://")) {
        prefix = "wss://";
        target = target.split("//")[1];
    } else if (target.startsWith("http://")) {
        target = target.split("//")[1];
    }
    try {
        data = await obs.connect(prefix + target, password, {
            eventSubscriptions: OBSWebSocket.EventSubscription.Scenes | OBSWebSocket.EventSubscription.Ui | OBSWebSocket.EventSubscription.Outputs | OBSWebSocket.EventSubscription.InputVolumeMeters 
        });
        __handle_connected();
        return data
    } catch (error) {
        console.warn("[OBS] Connection failed:", error);
        alert("[OBS] Verbindung fehlgeschlagen! Bitte überprüfe die Eingaben.");
    }
}

async function connectGUI() {
    return await connect(document.getElementById('login-form-target').value, document.getElementById('login-form-password').value)
}

async function sendAction(action, data) {
    let obj = { action: action, data: data}
    console.debug("[OBS] Sending", obj, "to browser source...")
    try {
        await obs.call("CallVendorRequest", { vendorName: "obs-browser", requestType: "emit_event", requestData: { event_name: "ControlPanelEvent", event_data: obj } })
        return true;
    } catch (error) {
        console.warn("[OBS] Action failed:", error)
        alert("[OBS] Aktion fehlgeschlagen! Bitte überprüfe die Konsole.");
        return false;
    }
}

async function sendOBSCommand(command, data) {
    console.debug("[OBS] Sending command", command, "with data:", data)
    try {
        return await obs.call(command, data)
    } catch (error) {
        console.warn("[OBS] Command failed:", error)
        alert("[OBS] Befehl fehlgeschlagen! Bitte überprüfe die Konsole.");
        return null;
    }
}

// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#events
obs.on("ExitStarted", __handle_disconnected)
obs.on("ConnectionClosed", __handle_disconnected)

// Auto reconnect

window.addEventListener('load', function () {
    if (sessionStorage.getItem("obs-target")) {
        document.getElementById('login-form-target').value = sessionStorage.getItem("obs-target");
        document.getElementById('login-form-password').value = sessionStorage.getItem("obs-password");
        if (sessionStorage.getItem("obs-auto-connect") == "true") {
            connectGUI();
        }
    }
});
