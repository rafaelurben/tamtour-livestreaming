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
    get url() {
        if (!atem.connectionData.target.startsWith("http")) {
            return "http://" + atem.connectionData.target;
        }
    },
    _handleDisconnect: function () {
        atem.connected = false;
        console.log("ATEM disconnected");
        $("#atem-btn-connect").removeClass("d-none");
        $("#atem-btn-disconnect").addClass("d-none");
        $("#atem-controlpanel-container").addClass("notconnected");
        $(window).trigger("atem-disconnected");
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
                    console.error("Request to ATEM failed: ", error);
                    alert("Anfrage an ATEM fehlgeschlagen!");
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
            console.log("Connected to ATEM");
            $("#atem-btn-connect").addClass("d-none");
            $("#atem-btn-disconnect").removeClass("d-none");
            $("#atem-controlpanel-container").removeClass("notconnected");
            atem.connectionData.atemId = data.hardware[0].id;
            $(window).trigger("atem-connected");
        }).catch(function (error) {
            atem.connected = false;
            console.error("Failed to connect to ATEM: ", error);
            alert("Verbindung mit ATEM fehlgeschlagen!");
        });
    },
    disconnect: async function () {
        atem.connectionData = {};
        atem._handleDisconnect();
    },
}