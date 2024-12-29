let isInitialBroadcastLoad = true;

function loadBroadcastsFromAPI() {
    api.request('GET', 'get-broadcasts').then(data => {
        loadBroadcastsFromData(data);
    }).catch(error => {
        alert("[Broadcast-Import] Beim Abrufen der API ist ein Fehler aufgetreten: " + error);
    })
}

function loadBroadcastsFromData(data) {
    let broadcasts = data.broadcasts;

    if (!broadcasts || broadcasts.length === 0) {
        alert("Keine Broadcasts gefunden!");
        return;
    }

    $(".nobroadcastdisabled").prop("disabled", false);

    let broadcastSelect = $("#broadcast-select-input");
    broadcastSelect.empty();

    for (let lid in broadcasts) {
        let broadcast = broadcasts[lid];
        broadcastSelect.append($("<option>", {value: lid, text: broadcast.yt_title}));
    }

    let storedval = sessionStorage.getItem("tamtour-broadcast-id");
    if (isInitialBroadcastLoad && storedval < broadcasts.length) broadcastSelect.val(storedval);

    window.tamtour_broadcasts = broadcasts;
    selectBroadcast();

    if (!isInitialBroadcastLoad) alert("Broadcasts aktualisiert!");
    isInitialBroadcastLoad = false;
}

function selectBroadcast() {
    let lid = $("#broadcast-select-input").val();
    let broadcast = window.tamtour_broadcasts[lid];
    api.state.selectedBroadcastIndex = lid;
    sessionStorage.setItem("tamtour-broadcast-id", lid);

    setYTLiveID(broadcast.yt_id)
}

function selectBroadcastSendLogsToggle() {
    let sendLogs = $("#broadcast-send-logs-toggle").is(':checked');
    api.state.sendStartLogsToAPI = sendLogs;
    sessionStorage.setItem("tamtour-broadcast-send-logs", sendLogs ? 'checked' : 'false');
}

// Event listeners

$(window).on('api-connected', () => {
    let sendLogs = sessionStorage.getItem("tamtour-broadcast-send-logs") === "checked";
    $("#broadcast-send-logs-toggle").prop('checked', sendLogs);
    api.state.sendStartLogsToAPI = sendLogs;
    loadBroadcastsFromAPI();
})
