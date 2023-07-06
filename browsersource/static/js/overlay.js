// Default overlay

function showDefaultOverlay() {
    document.querySelector("#defaultoverlay").classList.remove("hidden")
}

function hideDefaultOverlay() {
    document.querySelector("#defaultoverlay").classList.add("hidden")
}

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
    document.querySelector(".generalinfooverlay").classList.remove("out");
}

function hideGeneralInfoOverlay() {
    clearGeneralOverlayTimeout()
    document.querySelector(".generalinfooverlay").classList.add("out");
}

function displayGeneralInfoOverlay(duration_s) {
    let duration_ms = duration_s*1000 || 15000;

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
    document.querySelector(".startinfooverlay").classList.remove("out");
}

function hideStartInfoOverlay() {
    clearStartInfoOverlayTimeout();
    document.querySelector(".startinfooverlay").classList.add("out");
}

function displayStartInfoOverlay(duration_s) {
    let duration_ms = duration_s*1000 || 7500;

    showStartInfoOverlay();

    startInfoOverlayTimeout = setTimeout(() => {
        hideStartInfoOverlay();
    }, duration_ms + 1500);
}

// Startlist overlay

const STARTLIST_SECONDS_PER_PAGE = 10;

var startListAnimationTimeouts = [];

function cancelStartListAnimation() {
    for (let timeout of startListAnimationTimeouts) {
        clearTimeout(timeout);
    }
    startListAnimationTimeouts.length = 0; // Clear array

    // TODO: Animate current showing list out
}

function playStartListAnimation(data) {
    cancelStartListAnimation();

    // TODO: Do the magic
}

// Sponsors video

const SPONSORVIDEO_SECONDS_PER_CATEGORY = 5;
const SPONSORVIDEO_CATEGORY_ANIMATION_DURATION = 1.5;
const SPONSORVIDEO_BLOCK_ANIMATION_DURATION = 1.5;

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
        var offset_start = count * (SPONSORVIDEO_SECONDS_PER_CATEGORY + 2*SPONSORVIDEO_CATEGORY_ANIMATION_DURATION) + 0.5*SPONSORVIDEO_BLOCK_ANIMATION_DURATION;
        count++;
        var offset_end = count * (SPONSORVIDEO_SECONDS_PER_CATEGORY + 2*SPONSORVIDEO_CATEGORY_ANIMATION_DURATION) + 0.5*SPONSORVIDEO_BLOCK_ANIMATION_DURATION - SPONSORVIDEO_CATEGORY_ANIMATION_DURATION;

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

    let offset_hide = count * (SPONSORVIDEO_SECONDS_PER_CATEGORY + 2*SPONSORVIDEO_CATEGORY_ANIMATION_DURATION);
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

// General settings

function setSettings(settings) {
    if (settings.backgroundColor) {
        document.querySelector("*").style.setProperty('--tamtour-color-background', settings.backgroundColor)
    }
    if (settings.textColor) {
        document.querySelector("*").style.setProperty('--tamtour-color-text', settings.textColor)
    }
    document.body.classList.toggle("direction-inverted", settings.directionInverted);
}

// Control panel events

window.addEventListener('ControlPanelEvent', event => {
    let obj = event.detail;
    let action = obj.action;
    let data = obj.data;
    console.log("Event received:", action, data);

    switch (action) {
        // Default overlay
        case "showDefaultOverlay":
            showDefaultOverlay();
            break;
        case "hideDefaultOverlay":
            hideDefaultOverlay();
            break;

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

        // Start list overlay
        case "playStartListAnimation":
            cancelSponsorsAnimation();
            hideStartInfoOverlay();
            hideGeneralInfoOverlay();
            playStartListAnimation(data);
            break;
        case "cancelStartListAnimation":
            cancelStartListAnimation();
            break;

        // Sponsors animation
        case "playSponsorsAnimation":
            playSponsorsAnimation();
            break;
        case "cancelSponsorsAnimation":
            cancelSponsorsAnimation();
            break;

        // General settings
        case "setSettings":
            setSettings(data);
            break;
    }
});
