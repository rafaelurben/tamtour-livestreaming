let isInitialStartlistLoad = true;

function loadStartlistsFromFile() {
    let fileinputelem = $('#startlists-import-file-input')[0];
    let file = fileinputelem.files[0];

    if (!file) return;

    let reader = new FileReader();
    reader.onload = function () {
        let data = JSON.parse(reader.result);
        loadStartlistsFromData(data);
    }
    reader.readAsText(file);
}

function loadStartlistsFromAPI() {
    api.request('GET', 'get-start-lists').then(data => {
        loadStartlistsFromData(data);
    }).catch(error => {
        alert("[Startlisten-Import] Beim Abrufen der API ist ein Fehler aufgetreten: " + error);
    })
}

function loadStartlistsFromData(data) {
    let startlists = data.lists;

    if (!startlists || startlists.length === 0) {
        alert("Keine Startlisten gefunden!");
        return;
    }

    $(".nostartlistdisabled").prop("disabled", false);

    let startlistSelect = $("#startlist-select-input");
    startlistSelect.empty();

    for (let lid in startlists) {
        let startlist = startlists[lid];
        startlistSelect.append($("<option>", {value: lid, text: startlist.name}));
    }

    let storedval = sessionStorage.getItem("tamtour-startlist-id");
    if (isInitialStartlistLoad && storedval < startlists.length) startlistSelect.val(storedval);

    window.tamtour_startlists = startlists;
    loadStartlist();

    if (!isInitialStartlistLoad) alert("Startlisten aktualisiert!");
    isInitialStartlistLoad = false;
}

function loadStartlist() {
    let lid = $("#startlist-select-input").val();
    let startlist = window.tamtour_startlists[lid];
    let startlistitems = startlist.items;

    // Set startlist title
    $("#startlist-form-title").val(startlist.overlay_title);

    let startlistitemSelect = $("#startlistitem-select-input");
    startlistitemSelect.empty();

    for (let sid in startlistitems) {
        let data = startlistitems[sid];
        let title = `${data.category}#${data.start_num} ${data.name}`;
        startlistitemSelect.append($("<option>", {value: sid, text: title}));
    }

    let storedval = sessionStorage.getItem("tamtour-startlist-itemid");
    if (isInitialStartlistLoad && storedval < startlistitems.length) startlistitemSelect.val(storedval);

    loadStartlistitem();
}

function loadStartlistitem() {
    let lid = $("#startlist-select-input").val();
    sessionStorage.setItem("tamtour-startlist-id", lid);
    let sid = $("#startlistitem-select-input").val();
    sessionStorage.setItem("tamtour-startlist-itemid", sid);
    let startlist = window.tamtour_startlists[lid];
    let startlistitems = startlist.items;
    let item = startlistitems[sid];

    $("#startinfo-form-category").val(item.category);
    $("#startinfo-form-start_num").val(item.start_num);
    $("#startinfo-form-main-big").val(item.is_group ? `${item.name} - ${item.club}` : item.name);
    $("#startinfo-form-main-small").val(item.is_group ? item.group_members : item.club);
    $("#startinfo-form-presentation").val(item.presentation);

    updateStartlistNavButtons();
}

function sendStartlistItemToApiIfEnabled(item) {
    if (!(api.connected && api.state.sendStartLogsToAPI)) return;

    let cat = $("#startinfo-form-category").val();
    let num = $("#startinfo-form-start_num").val();
    let name = $("#startinfo-form-main-big").val();

    api.request('POST', 'log-start-time', JSON.stringify({
        content: `${cat}#${num} ${name}`,
        stream_id: window.tamtour_broadcasts[api.state.selectedBroadcastIndex].id,
    }));
}

// Event listeners

$(window).on('api-connected', () => {
    loadStartlistsFromAPI();
})
