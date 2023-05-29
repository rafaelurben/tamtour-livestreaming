obs = new OBSWebSocket()

function __handle_disconnected() {
    console.log("Disconnected!");
    $("#btn-connect").removeClass("d-none");
    $("#btn-disconnect").addClass("d-none");

    $("#controlpanel-container").addClass("notconnected");

    alert("Verbindung getrennt!")
}

async function disconnect() {
    sessionStorage.setItem("obs-auto-connect", "false");

    try {
        await obs.disconnect();
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

function __handle_connected() {
    console.log("Connected!");
    $("#btn-connect").addClass("d-none");
    $("#btn-disconnect").removeClass("d-none");

    $("#controlpanel-container").removeClass("notconnected");

    sessionStorage.setItem("obs-auto-connect", "true");
    sessionStorage.setItem("obs-target", document.getElementById('login-form-target').value);
    sessionStorage.setItem("obs-password", document.getElementById('login-form-password').value);
}

async function connect(target, password) {
    try {
        data = await obs.connect('ws://' + target, password, {
            eventSubscriptions: OBSWebSocket.EventSubscription.Scenes | OBSWebSocket.EventSubscription.Ui | OBSWebSocket.EventSubscription.Outputs | OBSWebSocket.EventSubscription.InputVolumeMeters 
        });
        __handle_connected();
        return data
    } catch (error) {
        console.warn(error)
        alert(error);
    }
}

async function connectGUI() {
    return await connect(document.getElementById('login-form-target').value, document.getElementById('login-form-password').value)
}

async function sendAction(action, data) {
    let obj = { action: action, data: data}
    console.debug("Sending", obj, "to browser source...")
    try {
        await obs.call("CallVendorRequest", { vendorName: "obs-browser", requestType: "emit_event", requestData: { event_name: "ControlPanelEvent", event_data: obj } })
        return true;
    } catch (error) {
        console.warn(error)
        alert(error);
        return false;
    }
}

async function sendOBSCommand(command, data) {
    console.debug("Sending command", command, "to OBS with data:", data)
    try {
        return await obs.call(command, data)
    } catch (error) {
        console.warn(error)
        alert(error);
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
