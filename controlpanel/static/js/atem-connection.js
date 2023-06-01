// Handle connections with openswitcher-proxy

let atemInputIds = {
    0: "BLK",
    1: "CAM1",
    2: "CAM2",
    3: "CAM3",
    4: "CAM4",
    1301: "MIC1",
    1302: "MIC2",
    3010: "MP1",
}

let atemInputIdsReverse = Object.fromEntries(Object.entries(atemInputIds).map(a => a.reverse()));

let atem = {
    connected: false,
    connectionData: {
        target: undefined,
        username: undefined,
        password: undefined,
        atemId: undefined,
    },
    state: {
        nextTransition: {
            bkgd: false,
            key1: false,
        },
        key1onair: false,
        previewSource: undefined,
        programSource: undefined,
        stills: [],
    },
    get url() {
        if (!atem.connectionData.target.startsWith("http")) {
            return "http://" + atem.connectionData.target;
        }
    },
    _handleConnect: function () {
        atem.connected = true;
        console.log("[ATEM] Connected");

        $("#atem-btn-connect").addClass("d-none");
        $("#atem-btn-disconnect").removeClass("d-none");
        $("#atem-controlpanel-container").removeClass("notconnected");

        $(window).trigger("atem-connected");
        sessionStorage.setItem("atem-auto-connect", "true");
        sessionStorage.setItem("atem-target", atem.connectionData.target);
        sessionStorage.setItem("atem-username", atem.connectionData.username);
        sessionStorage.setItem("atem-password", atem.connectionData.password);
    },
    _handleDisconnect: function () {
        atem.connected = false;
        console.log("[ATEM] Disconnected");

        $("#atem-btn-connect").removeClass("d-none");
        $("#atem-btn-disconnect").addClass("d-none");
        $("#atem-controlpanel-container").addClass("notconnected");

        $(window).trigger("atem-disconnected");
        sessionStorage.setItem("atem-auto-connect", "false");
    },
    request: async function (method, url, data) {
        if (!atem.connected) return Promise.reject("Not connected to ATEM");
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: atem.url + url,
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                type: method,
                timeout: 1000,
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    console.error("[ATEM] Request failed: ", error);
                    alert("[ATEM] Anfrage fehlgeschlagen!");
                    reject(error);
                },
            });
        });
    },
    get: async function (field) {
        return new Promise(function (resolve, reject) {
            atem.request("GET", `/${atem.connectionData.atemId}/${field}`).then(result => {
                $(window).trigger(`atem-get-${field}`, result);
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    },
    post: async function (command, data) {
        return new Promise(function (resolve, reject) {
            atem.request("POST", `/${atem.connectionData.atemId}/${command}`, data).then(result => {
                $(window).trigger(`atem-post-${command}`, result);
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    },
    connect: async function () {
        atem.connected = true;
        atem.connectionData.target = $("#atem-login-form-target").val();
        atem.connectionData.username = $("#atem-login-form-username").val();
        atem.connectionData.password = $("#atem-login-form-password").val();
        await atem.request("GET", "/").then(function (data) {
            atem.connectionData.atemId = data.hardware[0].id;
            atem._handleConnect();
        }).catch(function (error) {
            atem.connected = false;
            console.warn("[ATEM] Failed to connect: ", error);
        });
    },
    disconnect: async function () {
        atem.connectionData = {};
        atem._handleDisconnect();
    },
}

// Auto reconnect

window.addEventListener('load', function () {
    if (sessionStorage.getItem("atem-target")) {
        document.getElementById('atem-login-form-target').value = sessionStorage.getItem("atem-target");
        document.getElementById('atem-login-form-username').value = sessionStorage.getItem("atem-username");
        document.getElementById('atem-login-form-password').value = sessionStorage.getItem("atem-password");
        if (sessionStorage.getItem("atem-auto-connect") == "true") {
            atem.connect();
        }
    }
});
