function showInfoOverlay(data) {
    document.querySelector("#infooverlay-startnummer").innerHTML = data.kategorie + " #" + data.startnummer;
    document.querySelector("#infooverlay-name").innerHTML = data.name;
    document.querySelector("#infooverlay-verein").innerHTML = data.verein;
    document.querySelector("#infooverlay-vortrag").innerHTML = data.vortrag;
    
    data.duration = data.duration*1 || 7500;

    document.querySelector(".infooverlay").classList.remove("out-right");
    console.log("Showing info overlay for " + data.duration + "ms (without animation)");

    setTimeout(() => {
        document.querySelector(".infooverlay").classList.add("out-right");
        console.log("Hiding info overlay")
    }, data.duration + 1500);
}

function playSponsorsVideo() {
    document.querySelector("#sponsorsvideo").play();
}

window.addEventListener('ControlPanelEvent', event => {
    let obj = event.detail;
    let action = obj.action;
    let data = obj.data;
    console.log(action, data);

    switch (action) {
        case "showInfoOverlay":
            showInfoOverlay(data);
            break;
        case "playSponsorsVideo":
            playSponsorsVideo();
            break;
    }
});
