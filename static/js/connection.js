obs = new OBSWebSocket()

async function login(target, password) {
    try {
        data = await obs.connect('ws://' + target, password, { eventSubscriptions: OBSWebSocket.EventSubscription.All });
        console.log("Connected!")
        return data
    } catch (error) {
        console.error(error);
    }
}

async function login_gui() {
    return await login(document.getElementById('target').value, document.getElementById('password').value)
}

async function send(action, data) {
    let obj = { action: action, data: data}
    console.log("Sending", obj, "to browser source...")
    return await obs.call("CallVendorRequest", { vendorName: "obs-browser", requestType: "emit_event", requestData: { event_name: "ControlPanelEvent", event_data: obj } })
}

async function sendAction_playSponsorenVideo() {
    return await send("playSponsorenVideo")
}

async function sendAction_showInfoOverlay(args, seconds) {
    return await send("showInfoOverlay", { args: args, seconds: seconds })
}

// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#events
obs.on("CurrentProgramSceneChanged", console.log)
obs.on("ExitStarted", evt => console.error("OBS exited"))
