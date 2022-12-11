function showInfoOverlay(data, seconds) {
    document.querySelector("#infooverlay-startnummer").innerHTML = data.kategorie + " #" + data.startnummer;
    document.querySelector("#infooverlay-name").innerHTML = data.name;
    document.querySelector("#infooverlay-verein").innerHTML = data.verein;
    document.querySelector("#infooverlay-vortrag").innerHTML = data.vortrag;
    document.querySelector(".infooverlay").classList.remove("out-right");
    setTimeout(() => {
        document.querySelector(".infooverlay").classList.add("out-right");
    }, (seconds * 1000) || 7500);
}

function playSponsorenVideo() {
    document.querySelector("#sponsorenvideo").play();
}

window.addEventListener('ControlPanelEvent', event => {
    let obj = event.detail;
    let action = obj.action;
    let data = obj.data;
    console.log(action, data);

    switch (action) {
        case "showInfoOverlay":
            showInfoOverlay(data.args, data.seconds);
            break;
        case "playSponsorenVideo":
            playSponsorenVideo();
            break;
    }
});