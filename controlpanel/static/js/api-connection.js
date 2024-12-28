// Handle API connection

let api = {
    connected: false,
    connectionData: {
        baseurl: undefined,
        apikey: undefined,
    },
    state: {
        broadcasts: [],
        selectedBroadcastIndex: undefined,
        sendStartLogsToAPI: false,
    },
    build_url: function (path) {
        return api.connectionData.baseurl + path + "?apikey=" + api.connectionData.apikey;
    },
    _handleConnect: function () {
        api.connected = true;
        console.log("[API] Connected");

        $("body").addClass("api-connected");
        $("#api-btn-connect").addClass("d-none");
        $("#api-btn-disconnect").removeClass("d-none");
        $("#open-api-dialog-btn").removeClass("btn-success").addClass("btn-danger").text("API verbunden");

        $(window).trigger("api-connected");
        sessionStorage.setItem("tamtour-api-auto-connect", "true");
        sessionStorage.setItem("tamtour-api-baseurl", api.connectionData.baseurl);
        sessionStorage.setItem("tamtour-api-apikey", api.connectionData.apikey);
    },
    _handleDisconnect: function () {
        api.connected = false;
        console.log("[API] Disconnected");

        $("body").removeClass("api-connected");
        $("#api-btn-connect").removeClass("d-none");
        $("#api-btn-disconnect").addClass("d-none");
        $("#open-api-dialog-btn").addClass("btn-success").removeClass("btn-danger").text("API verbinden");

        $(window).trigger("api-disconnected");
        sessionStorage.setItem("tamtour-api-auto-connect", "false");
    },
    request: async function (method, path, data, ignoreerror) {
        if (!api.connected) return Promise.reject("Not connected to API");
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: api.build_url(path),
                data: data,
                dataType: 'json',
                contentType: 'application/json',
                type: method,
                timeout: 10000,
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    if (!ignoreerror) {
                        $("#open-api-dialog-btn").addClass("failing");
                        if (error.statusText === "timeout") {
                            console.warn("[API] Request timed out:", {method, url: path, data});
                            if (method === "POST") alert("[API] Anfrage fehlgeschlagen! Bitte erneut versuchen!")
                        } else {
                            console.error("[API] Request failed:", {method, url: path, data}, error);
                        }
                    }
                    reject(error);
                },
            });
        });
    },
    connect: async function (isautoconnect) {
        let $connectBtn = $("#api-btn-connect");
        $connectBtn.prop("disabled", true);
        api.connected = true;
        api.connectionData.baseurl = $("#api-login-form-baseurl").val();
        api.connectionData.apikey = $("#api-login-form-apikey").val();

        await api.request("GET", "get-connection-health").then(function (data) {
            api._handleConnect();
        }).catch(function (error) {
            api.connected = false;
            console.warn("[API] Failed to connect: ", error);
            if (isautoconnect === true) {
                alert("[API] Automatische Verbindung fehlgeschlagen! Bitte überprüfe die gespeicherten Eingaben.");
                sessionStorage.setItem("tamtour-api-auto-connect", "false");
                $("#open-api-dialog-btn").addClass("failing");
            } else {
                alert("[API] Verbindung fehlgeschlagen! Bitte überprüfe die Eingaben.");
            }
        });

        $connectBtn.prop("disabled", false);
    },
    disconnect: async function () {
        api.connectionData = {};
        api._handleDisconnect();
    },
}

// Auto reconnect

window.addEventListener('load', function () {
    if (sessionStorage.getItem("tamtour-api-apikey")) {
        document.getElementById('api-login-form-baseurl').value = sessionStorage.getItem("tamtour-api-baseurl");
        document.getElementById('api-login-form-apikey').value = sessionStorage.getItem("tamtour-api-apikey");
        if (sessionStorage.getItem("tamtour-api-auto-connect") === "true") {
            api.connect(true);
        }
    }
});
