// Handle connections with openswitcher-proxy

let atemInputIds = {
    0: "BLK",
    1: "CAM1",
    2: "CAM2",
    3: "CAM3",
    4: "CAM4",
    1000: "BARS",
    1301: "MIC1",
    1302: "MIC2",
    2001: "COL1",
    2002: "COL2",
    3010: "MP1",
    3011: "MP1K",
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
        dkey1onair: false,
        previewSource: undefined,
        programSource: undefined,
        key1FillSource: undefined,
        dkey1FillSource: undefined,
        stills: [],
        audioconfig: [],
    },
    get url() {
        if (!atem.connectionData.target.startsWith("http")) {
            return "http://" + atem.connectionData.target;
        }
    },
    _handleConnect: function () {
        atem.connected = true;
        console.log("[ATEM] Connected");

        $("body").addClass("atem-connected");
        $("#atem-btn-connect").addClass("d-none");
        $("#atem-btn-disconnect").removeClass("d-none");
        $("#open-atem-dialog-btn").removeClass("btn-success").addClass("btn-danger").text("ATEM verbunden");

        $(window).trigger("atem-connected");
        sessionStorage.setItem("tamtour-atem-auto-connect", "true");
        sessionStorage.setItem("tamtour-atem-target", atem.connectionData.target);
        sessionStorage.setItem("tamtour-atem-username", atem.connectionData.username);
        sessionStorage.setItem("tamtour-atem-password", atem.connectionData.password);
    },
    _handleDisconnect: function () {
        atem.connected = false;
        console.log("[ATEM] Disconnected");

        $("body").removeClass("atem-connected");
        $("#atem-btn-connect").removeClass("d-none");
        $("#atem-btn-disconnect").addClass("d-none");
        $("#open-atem-dialog-btn").addClass("btn-success").removeClass("btn-danger").text("ATEM verbinden");

        $(window).trigger("atem-disconnected");
        sessionStorage.setItem("tamtour-atem-auto-connect", "false");
    },
    request: async function (method, url, data, noalert) {
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
                    if (!noalert) alert("[ATEM] Anfrage fehlgeschlagen!");
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
    connect: async function (isautoconnect) {
        atem.connected = true;
        atem.connectionData.target = $("#atem-login-form-target").val();
        atem.connectionData.username = $("#atem-login-form-username").val();
        atem.connectionData.password = $("#atem-login-form-password").val();
        await atem.request("GET", "/", {}, true).then(function (data) {
            atem.connectionData.atemId = data.hardware[0].id;
            atem._handleConnect();
        }).catch(function (error) {
            atem.connected = false;
            console.warn("[ATEM] Failed to connect: ", error);
            if (isautoconnect === true) {
                alert("[ATEM] Automatische Verbindung fehlgeschlagen! Bitte überprüfe die gespeicherten Eingaben.");
                sessionStorage.setItem("tamtour-atem-auto-connect", "false");
            } else {
                alert("[ATEM] Verbindung fehlgeschlagen! Bitte überprüfe die Eingaben.");
            }
        });
    },
    disconnect: async function () {
        atem.connectionData = {};
        atem._handleDisconnect();
    },
}

// Auto reconnect

window.addEventListener('load', function () {
    if (sessionStorage.getItem("tamtour-atem-target")) {
        document.getElementById('atem-login-form-target').value = sessionStorage.getItem("tamtour-atem-target");
        document.getElementById('atem-login-form-username').value = sessionStorage.getItem("tamtour-atem-username");
        document.getElementById('atem-login-form-password').value = sessionStorage.getItem("tamtour-atem-password");
        if (sessionStorage.getItem("tamtour-atem-auto-connect") == "true") {
            atem.connect(true);
        }
    }
});

// ATEM Base Interval

let atemBaseInterval = undefined;
let atemBaseIntervalCounter = 0;

$(window).on("atem-connected", function () {
    atemBaseInterval = setInterval(function () {
        atemBaseIntervalCounter++;
        $(window).trigger("atem-base-interval", atemBaseIntervalCounter);
    }, 100);
});

$(window).on("atem-disconnected", function () {
    clearInterval(atemBaseInterval);
});
