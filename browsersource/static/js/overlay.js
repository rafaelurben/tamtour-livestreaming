function showStartInfoOverlay(data) {
    document.querySelector("#startinfooverlay-startnummer").innerHTML = data.kategorie + " #" + data.startnummer;
    document.querySelector("#startinfooverlay-name").innerHTML = data.name;
    document.querySelector("#startinfooverlay-verein").innerHTML = data.verein;
    document.querySelector("#startinfooverlay-vortrag").innerHTML = data.vortrag;
    
    data.duration = data.duration*1 || 7500;

    document.querySelector(".startinfooverlay").classList.remove("out-right");
    console.log("Showing start info overlay for " + data.duration + "ms (without animation)");

    setTimeout(() => {
        document.querySelector(".startinfooverlay").classList.add("out-right");
        console.log("Hiding start info overlay")
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
        case "showStartInfoOverlay":
            showStartInfoOverlay(data);
            break;
        case "playSponsorsVideo":
            playSponsorsVideo();
            break;
    }
});
