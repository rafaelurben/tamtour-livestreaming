// General info overlay

let generalInfoOverlayTimeout = null;

function clearGeneralOverlayTimeout() {
    if (generalInfoOverlayTimeout != null) {
        clearTimeout(generalInfoOverlayTimeout);
        generalInfoOverlayTimeout = null;
    }
}

function setGeneralInfoOverlayContent(data) {
    document.querySelector("#generalinfooverlay-title").innerHTML = data.title;
    document.querySelector("#generalinfooverlay-description").innerHTML = data.description;
}

function showGeneralInfoOverlay() {
    clearGeneralOverlayTimeout()
    document.querySelector(".generalinfooverlay").classList.remove("out-left");
}

function hideGeneralInfoOverlay() {
    clearGeneralOverlayTimeout()
    document.querySelector(".generalinfooverlay").classList.add("out-left");
}

function displayGeneralInfoOverlay(duration) {
    let duration_ms = duration*1 || 15000;

    showGeneralInfoOverlay();

    generalInfoOverlayTimeout = setTimeout(() => {
        hideGeneralInfoOverlay();
    }, duration_ms + 1500);
}

// Start info overlay

let startInfoOverlayTimeout = null;

function clearStartInfoOverlayTimeout() {
    if (startInfoOverlayTimeout != null) {
        clearTimeout(startInfoOverlayTimeout);
        startInfoOverlayTimeout = null;
    }
}

function setStartInfoOverlayContent(data) {
    document.querySelector("#startinfooverlay-startnummer").innerHTML = data.kategorie + " #" + data.startnummer;
    document.querySelector("#startinfooverlay-name").innerHTML = data.name;
    document.querySelector("#startinfooverlay-verein").innerHTML = data.verein;
    document.querySelector("#startinfooverlay-vortrag").innerHTML = data.vortrag;
}

function showStartInfoOverlay() {
    clearStartInfoOverlayTimeout();
    document.querySelector(".startinfooverlay").classList.remove("out-right");
}

function hideStartInfoOverlay() {
    clearGeneralOverlayTimeout();
    document.querySelector(".startinfooverlay").classList.add("out-right");
}

function displayStartInfoOverlay(duration) {
    let duration_ms = duration*1 || 7500;

    showStartInfoOverlay();

    startInfoOverlayTimeout = setTimeout(() => {
        hideStartInfoOverlay();
    }, duration_ms + 1500);
}

// Sponsors video

const SECONDS_PER_CATEGORY = 5;
const CATEGORY_ANIMATION_DURATION = 1.5;
const BLOCK_ANIMATION_DURATION = 1.5;

var sponsorsAnimationTimeouts = [];

function cancelSponsorsAnimation() {
    for (let timeout of sponsorsAnimationTimeouts) {
        clearTimeout(timeout);
    }
    sponsorsAnimationTimeouts.length = 0; // Clear array

    let catelems = document.querySelectorAll(".sponsorscategory");
    for (let el of catelems) {
        el.classList.add("out-down");
    }
    document.querySelector(".sponsorsoverlay_block").classList.add("out-down");
}

function playSponsorsAnimation() {
    cancelSponsorsAnimation();

    document.querySelector(".sponsorsoverlay_block").classList.remove("out-down");

    let catelems = document.querySelectorAll(".sponsorscategory");
    let count = 0;

    for (let el of catelems) {
        var offset_start = count * (SECONDS_PER_CATEGORY + 2*CATEGORY_ANIMATION_DURATION) + 0.5*BLOCK_ANIMATION_DURATION;
        count++;
        var offset_end = count * (SECONDS_PER_CATEGORY + 2*CATEGORY_ANIMATION_DURATION) + 0.5*BLOCK_ANIMATION_DURATION - CATEGORY_ANIMATION_DURATION;

        sponsorsAnimationTimeouts.push(
            setTimeout(() => {
                el.classList.remove("out-down");
            }, offset_start * 1000)
        );
        sponsorsAnimationTimeouts.push(
            setTimeout(() => {
                el.classList.add("out-down");
            }, offset_end * 1000)
        );
    }

    let offset_hide = count * (SECONDS_PER_CATEGORY + 2*CATEGORY_ANIMATION_DURATION);
    sponsorsAnimationTimeouts.push(
        setTimeout(() => {
            document.querySelector(".sponsorsoverlay_block").classList.add("out-down");
        }, offset_hide * 1000)
    );
}

function setupSponsorsAnimationImages() {
    for (let category of window.tamtour_sponsorscategories) {
        let categoryEl = document.createElement("div");
        categoryEl.classList = "sponsorscategory out-down";
        categoryEl.innerHTML = '<div class="text">' + category.name + "</div>";
        categoryEl.style.setProperty("--count", category.files.length)

        for (let filename of category.files) {
            let sponsorEl = document.createElement("div");
            sponsorEl.classList.add("sponsor");
            let imageEl = document.createElement("img");
            imageEl.src = "../resources/sponsors/" + filename;
            sponsorEl.appendChild(imageEl);
            categoryEl.appendChild(sponsorEl);
        }

        document.querySelector("#sponsorsoverlay-container").appendChild(categoryEl);
    }
}

window.addEventListener('load', () => {
    // Load sponsors data
    console.log("Loading sponsors data...")
    fetch('../resources/sponsors/sponsors.json').then(response => {
        return response.json();
    }).then(data => {
        window.tamtour_sponsorscategories = data.categories;
        console.log("Sponsors data loaded successfully!")
        setupSponsorsAnimationImages();
    }, err => {
        alert("Sponsorenliste konnte nicht geladen werden!")
    });
});

// Control panel events

window.addEventListener('ControlPanelEvent', event => {
    let obj = event.detail;
    let action = obj.action;
    let data = obj.data;
    console.log("Event received:", action, data);

    switch (action) {
        // General info overlay
        case "setGeneralInfoOverlayContent":
            setGeneralInfoOverlayContent(data);
            break;
        case "showGeneralInfoOverlay":
            cancelSponsorsAnimation();
            showGeneralInfoOverlay();
            break;
        case "hideGeneralInfoOverlay":
            hideGeneralInfoOverlay();
            break;
        case "displayGeneralInfoOverlay":
            cancelSponsorsAnimation();
            displayGeneralInfoOverlay(data.duration);
            break;

        // Start info overlay
        case "setStartInfoOverlayContent":
            setStartInfoOverlayContent(data);
            break;
        case "showStartInfoOverlay":
            cancelSponsorsAnimation();
            showStartInfoOverlay();
            break;
        case "hideStartInfoOverlay":
            hideStartInfoOverlay();
            break;
        case "displayStartInfoOverlay":
            cancelSponsorsAnimation();
            displayStartInfoOverlay(data.duration);
            break;

        // Sponsors animation
        case "playSponsorsAnimation":
            playSponsorsAnimation();
            break;
        case "cancelSponsorsAnimation":
            cancelSponsorsAnimation();
            break;
    }
});
