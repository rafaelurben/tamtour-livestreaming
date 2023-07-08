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
    bulksupport: false,
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
        key1DVEdata: {},
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

        // Check for bulk support
        atem.request("GET", `/${atem.connectionData.atemId}/bulksupport`, {}, true).then(function (data) {
            atem.bulksupport = true;
            console.log("[ATEM] Bulk support enabled! (Using modified openswitcher-proxy version by @rafaelurben)");
        }).catch(function (error) {
            atem.bulksupport = false;
            console.warn("[ATEM] Bulk support disabled! (NOT using modified openswitcher-proxy version by @rafaelurben)");
        });
    },
    _handleDisconnect: function () {
        atem.connected = false;
        atem.bulksupport = false;
        console.log("[ATEM] Disconnected");

        $("body").removeClass("atem-connected");
        $("#atem-btn-connect").removeClass("d-none");
        $("#atem-btn-disconnect").addClass("d-none");
        $("#open-atem-dialog-btn").addClass("btn-success").removeClass("btn-danger").text("ATEM verbinden");

        $(window).trigger("atem-disconnected");
        sessionStorage.setItem("tamtour-atem-auto-connect", "false");
    },
    request: async function (method, url, data, ignoreerror) {
        if (!atem.connected) return Promise.reject("Not connected to ATEM");
        return new Promise(function (resolve, reject) {
            $.ajax({
                url: atem.url + url,
                data: data,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                type: method,
                timeout: 2500,
                success: function (data) {
                    resolve(data);
                },
                error: function (error) {
                    if (!ignoreerror) {
                        if (error.statusText == "timeout") {
                            console.warn("[ATEM] Request timed out:", { method, url, data });
                            if (method === "POST") alert("[ATEM] Anfrage fehlgeschlagen! Bitte erneut versuchen!")
                        } else {
                            console.error("[ATEM] Request failed:", { method, url, data }, error);
                            alert("[ATEM] Anfrage fehlgeschlagen! Bitte Konsole überprüfen.");
                        }
                    }
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
    bulkget: async function (fields) {
        // Get multiple fields at once (Only supported in the modified openswitcher-proxy version by @rafaelurben)
        return new Promise(function (resolve, reject) {
            atem.request("GET", `/${atem.connectionData.atemId}/bulk/${fields.join(",")}`).then(result => {
                for (let field of fields) {
                    $(window).trigger(`atem-get-${field}`, result[field])
                };
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

// ATEM Interval

let atemBaseInterval = undefined;

$(window).on("atem-connected", function () {
    atemBaseInterval = setInterval(function () {
        $(window).trigger("atem-base-interval");
    }, 250);
});

$(window).on("atem-disconnected", function () {
    clearInterval(atemBaseInterval);
});

// ATEM GET Requests
// - 'interval' is only used if bulk support is not available
// - 'elements', if present, needs to include at lease one visible jQuery element to trigger the request

let atemGETqueue = [
  // Media Player & Color Generators
  {
    url: "mediaplayer-selected",
    elements: [$("#atem-fieldset-mpcol > div")],
    interval: 1000,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "mediaplayer-file-info",
    elements: [$("#atem-fieldset-mpcol > div")],
    interval: 1000,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "color-generator",
    elements: [$("#atem-fieldset-mpcol > div")],
    interval: 1000,
    inprogress: false,
    lastfire: 0,
  },

  // Transitions
  {
    url: "transition-settings",
    elements: [],
    interval: 1000,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "transition-position",
    elements: [$("#atem-fieldset-transitions > div")],
    interval: 500,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "fade-to-black-state",
    elements: [$("#atem-fieldset-transitions > div")],
    interval: 1000,
    inprogress: false,
    lastfire: 0,
  },

  // Downstream Keyer
  {
    url: "dkey-state",
    elements: [],
    interval: 500,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "dkey-properties-base",
    elements: [],
    interval: 500,
    inprogress: false,
    lastfire: 0,
  },

  // Upstream Keyer
  {
    url: "key-on-air",
    elements: [],
    interval: 500,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "key-properties-base",
    elements: [],
    interval: 500,
    inprogress: false,
    lastfire: 0,
  },

  // Audio
  {
    url: "fairlight-audio-input",
    elements: [$("#atem-fieldset-audio > div")],
    interval: 1000,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "fairlight-strip-properties",
    elements: [$("#atem-fieldset-audio > div")],
    interval: 1000,
    inprogress: false,
    lastfire: 0,
  },

  // Video
  {
    url: "preview-bus-input",
    elements: [],
    interval: 500,
    inprogress: false,
    lastfire: 0,
  },
  {
    url: "program-bus-input",
    elements: [],
    interval: 500,
    inprogress: false,
    lastfire: 0,
  },
];

$(window).on("atem-base-interval", function () {
    function __hasVisibleElements(elements) {
        if (elements.length == 0) return true;

        let anyVisible = false;
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (element.is(":visible")) {
                anyVisible = true;
            }
        }
        return anyVisible;
    }

    if (atem.bulksupport) {
        // If bulk support is available, fire all requests every interval
        // Bulk support is available in the modified openswitcher-proxy version by @rafaelurben
        let fields = [];
        for (let i = 0; i < atemGETqueue.length; i++) {
            let queueItem = atemGETqueue[i];

            if (__hasVisibleElements(queueItem.elements)) {
                fields.push(queueItem.url);
            }
        }
        atem.bulkget(fields)
    } else {
        // Check if any requests need to be fired
        for (let i = 0; i < atemGETqueue.length; i++) {
            let queueItem = atemGETqueue[i];

            // If a request was fired less than the interval ago, don't fire another one
            if (queueItem.lastfire + queueItem.interval > Date.now()) {
                continue
            };
            // If a request is already in progress, don't fire another one, except if it has been in progress for more than 10 seconds
            if (queueItem.inprogress) {
                if (queueItem.lastfire + 10000 < Date.now()) {
                    console.log("[ATEM] Request has taken longer than 10 seconds. Resetting...")
                } else {
                    console.log("[ATEM] Request is slower than the interval. Skipping...")
                    continue
                }
            };
            // If none of the elements are visible, don't fire the request
            if (!__hasVisibleElements(queueItem.elements)) {
                continue
            }

            queueItem.inprogress = true;
            queueItem.lastfire = Date.now();

            atem.get(queueItem.url).then(function () {
                queueItem.inprogress = false;
            }).catch(function () {
                queueItem.inprogress = false;
            });
        }
    }
});
