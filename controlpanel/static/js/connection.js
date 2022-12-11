obs = new OBSWebSocket()

function __handle_disconnected() {
    console.log("Disconnected!");
    $("#btn-connect").prop("disabled", false);
    $("#btn-disconnect").prop("disabled", true);
    alert("Disconnected!")
}

async function disconnect() {
    try {
        __handle_disconnected();
        await obs.disconnect();
    } catch (error) {
        console.error(error);
        alert(error);
    }
}

function __handle_connected() {
    console.log("Connected!");
    $("#btn-connect").prop("disabled", true);
    $("#btn-disconnect").prop("disabled", false);
    alert("Connected!");
}

async function connect(target, password) {
    try {
        data = await obs.connect('ws://' + target, password, { eventSubscriptions: OBSWebSocket.EventSubscription.All });
        __handle_connected();
        return data
    } catch (error) {
        console.error(error)
        alert(error);
    }
}

async function connectGUI() {
    return await connect(document.getElementById('login-form-target').value, document.getElementById('login-form-password').value)
}

async function sendAction(action, data) {
    let obj = { action: action, data: data}
    console.log("Sending", obj, "to browser source...")
    return await obs.call("CallVendorRequest", { vendorName: "obs-browser", requestType: "emit_event", requestData: { event_name: "ControlPanelEvent", event_data: obj } })
}

// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#events
obs.on("CurrentProgramSceneChanged", console.log)
obs.on("ExitStarted", __handle_disconnected)
