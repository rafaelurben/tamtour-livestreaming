// Handle connection with obs-websocket

window.obs = {
    SUBSCRIPTIONS_DEFAULT: OBSWebSocket.EventSubscription.Scenes | OBSWebSocket.EventSubscription.Ui | OBSWebSocket.EventSubscription.Outputs | OBSWebSocket.EventSubscription.InputVolumeMeters,
    SUBSCRIPTIONS_WITHOUT_VOLUME: OBSWebSocket.EventSubscription.Scenes | OBSWebSocket.EventSubscription.Ui | OBSWebSocket.EventSubscription.Outputs,

    socket: new OBSWebSocket(),
    wakeLock: null,
    get connected() {
        return obs.socket._identified;
    },
    __handle_disconnected: async function () {
        obs.connected = false;
        console.log("[OBS] Disconnected!");
        $("body").removeClass("obs-connected");
        $("#btn-connect").removeClass("d-none");
        $("#btn-disconnect").addClass("d-none");
        $("#open-obs-dialog-btn").addClass("btn-success").removeClass("btn-danger").text("OBS verbinden");

        if (obs.wakeLock != null) {
            try {
                await obs.wakeLock.release();
                obs.wakeLock = null;
            } catch (err) {
                console.warn(`Wakelock release failed: ${err.name}, ${err.message}`);
            }   
        }
    },
    disconnect: async function () {
        sessionStorage.setItem("tamtour-obs-auto-connect", "false");

        try {
            return await obs.socket.disconnect();
        } catch (error) {
            console.error("[OBS] Disconnect failed: ", error);
        }
    },
    __handle_connected: async function () {
        console.log("[OBS] Connected!");
        $("body").addClass("obs-connected");
        $("#btn-connect").addClass("d-none");
        $("#btn-disconnect").removeClass("d-none");
        $("#open-obs-dialog-btn").removeClass("btn-success").addClass("btn-danger").text("OBS verbunden");

        sessionStorage.setItem("tamtour-obs-auto-connect", "true");
        sessionStorage.setItem("tamtour-obs-target", document.getElementById('login-form-target').value);
        sessionStorage.setItem("tamtour-obs-password", document.getElementById('login-form-password').value);

        if (obs.wakeLock == null) {
            try {
                obs.wakeLock = await navigator.wakeLock.request('screen');
                obs.wakeLock.addEventListener('release', () => {
                    console.log('Wake Lock was released');
                });
                console.log('Wake Lock is active');
            } catch (err) {
                console.warn(`Wakelock request failed: ${err.name}, ${err.message}`);
            }
        }
    },
    connect: async function (isautoconnect) {
        var target = document.getElementById('login-form-target').value;
        var password = document.getElementById('login-form-password').value;

        var prefix = "ws://";
        if (target.startsWith("https://")) {
            prefix = "wss://";
            target = target.split("//")[1];
        } else if (target.startsWith("http://")) {
            target = target.split("//")[1];
        }
        try {
            return await obs.socket.connect(prefix + target, password, {
                eventSubscriptions: obs.SUBSCRIPTIONS_DEFAULT,
            });
        } catch (error) {
            console.warn("[OBS] Connection failed:", error);
            if (isautoconnect === true) {
                alert("[OBS] Automatische Verbindung fehlgeschlagen! Bitte überprüfe die gespeicherten Eingaben.");
                sessionStorage.setItem("tamtour-obs-auto-connect", "false");
            } else {
                alert("[OBS] Verbindung fehlgeschlagen! Bitte überprüfe die Eingaben.");
            }
        }
    },
    sendAction: async function (action, data) {
        let obj = { action: action, data: data}
        console.debug("[OBS] Sending", obj, "to browser source...")
        try {
            await obs.socket.call("CallVendorRequest", { vendorName: "obs-browser", requestType: "emit_event", requestData: { event_name: "ControlPanelEvent", event_data: obj } })
            return true;
        } catch (error) {
            console.warn("[OBS] Action failed:", error)
            alert("[OBS] Aktion fehlgeschlagen! Bitte überprüfe die Konsole.");
            return false;
        }
    },
    sendCommand: async function (command, data) {
        console.debug("[OBS] Sending command", command, "with data:", data)
        try {
            return await obs.socket.call(command, data)
        } catch (error) {
            console.warn("[OBS] Command failed:", error)
            alert("[OBS] Befehl fehlgeschlagen! Bitte überprüfe die Konsole.");
            return null;
        }
    },
    on: function (e, t, n) {
        obs.socket.on(e, t, n)
    },
    updateSubscriptions: async function (subs) {
        return await obs.socket.reidentify({
            eventSubscriptions: subs,
        })
    }
}

// https://github.com/obsproject/obs-websocket/blob/master/docs/generated/protocol.md#events
obs.on("Identified", obs.__handle_connected)
obs.on("ExitStarted", obs.__handle_disconnected)
obs.on("ConnectionClosed", obs.__handle_disconnected)

// Auto reconnect

window.addEventListener('load', function () {
    if (sessionStorage.getItem("tamtour-obs-target")) {
        document.getElementById('login-form-target').value = sessionStorage.getItem("tamtour-obs-target");
        document.getElementById('login-form-password').value = sessionStorage.getItem("tamtour-obs-password");
        if (sessionStorage.getItem("tamtour-obs-auto-connect") == "true") {
            obs.connect(true);
        }
    }
});
