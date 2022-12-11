function showInfoOverlay(data) {
    document.querySelector("#infooverlay-startnummer").innerHTML = data.kategorie + " #" + data.startnummer;
    document.querySelector("#infooverlay-name").innerHTML = data.name;
    document.querySelector("#infooverlay-verein").innerHTML = data.verein;
    document.querySelector("#infooverlay-vortrag").innerHTML = data.vortrag;
    
    let fullduration = (data.duration*1 || 7500) + 1500;
    document.querySelector(".infooverlay").classList.remove("out-right");
    console.log("Showing info overlay for " + fullduration + "ms");

    setTimeout(() => {
        document.querySelector(".infooverlay").classList.add("out-right");
        console.log("Hiding info overlay")
    }, fullduration);
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