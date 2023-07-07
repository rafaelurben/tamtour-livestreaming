// Image overlay

let imageOverlayTimeout = null;

function clearImageOverlayTimeout() {
    if (imageOverlayTimeout != null) {
        clearTimeout(imageOverlayTimeout);
        imageOverlayTimeout = null;
    }
}

function setImageOverlaySource(src) {
    document.querySelector("#imageoverlay").src = src;
}

function displayImageOverlay(duration_s) {
    let duration_ms = duration_s * 1000 || 15000;

    showImageOverlay();

    imageOverlayTimeout = setTimeout(() => {
        hideImageOverlay();
    }, duration_ms + 1500);
}

function showImageOverlay() {
    clearImageOverlayTimeout();
    document.querySelector("#imageoverlay").classList.remove("out")
}

function hideImageOverlay() {
    clearImageOverlayTimeout();
    document.querySelector("#imageoverlay").classList.add("out")
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

const STARTLIST_ANIMATION_DURATION = 1500;
const STARTLIST_PAGE_DURATION = 15000;

var startListAnimationTimeouts = [];

function cancelStartListAnimation() {
    for (let timeout of startListAnimationTimeouts) {
        clearTimeout(timeout);
    }
    startListAnimationTimeouts.length = 0; // Clear array

    document.getElementById("startlistoverlay").classList.add("out");
}

function playStartListAnimation(data) {
    cancelStartListAnimation();

    document.getElementById("startlistoverlay-title").innerText = data.title;
    let body = document.getElementById("startlistoverlay-body");
    body.innerHTML = "";
    let footer = document.getElementById("startlistoverlay-footer");
    footer.innerHTML = "";

    // Split data into pages of 9 entries
    let items = Object.values(data.items);

    let pages = [];
    while (items.length > 0) {
        pages.push(items.splice(0, 9));
    }

    for (let pagenum = 0; pagenum < pages.length; pagenum++) {
        // Create elements
        let page = pages[pagenum];
        let containerelem = document.createElement("div");
        containerelem.classList.add("startlistoverlay-tablecontainer");
        let tableelem = document.createElement("table");
        tableelem.classList.add("startlistoverlay-table");
        let tbodyelem = document.createElement("tbody");
        for (let row of Object.values(page)) {
            let rowelem = document.createElement("tr");
            for (let cell of Object.values(row)) {
                let cellelem = document.createElement("td");
                cellelem.innerText = cell;
                rowelem.appendChild(cellelem);
            }
            tbodyelem.appendChild(rowelem);
        }
        tableelem.appendChild(tbodyelem);
        containerelem.appendChild(tableelem);
        body.appendChild(containerelem);

        // Add footer indicator
        let indicatorelem = document.createElement("div");
        indicatorelem.classList.add("startlistoverlay-footerdot");
        footer.appendChild(indicatorelem);

        // Animate
        let delay = pagenum * (STARTLIST_ANIMATION_DURATION+STARTLIST_PAGE_DURATION);
        if (pagenum === 0) {
            indicatorelem.classList.add("active");
        } else {
            containerelem.classList.add("out-right");
            startListAnimationTimeouts.push(setTimeout(() => {
                indicatorelem.classList.add("active");
                containerelem.classList.remove("out-right");
            }, delay));
        }
        if (pagenum !== pages.length-1) {
            startListAnimationTimeouts.push(setTimeout(() => {
                containerelem.classList.add("out-left");
                indicatorelem.classList.remove("active");
            }, delay + STARTLIST_PAGE_DURATION + STARTLIST_ANIMATION_DURATION));
        }
    }

    // Show overlay
    document.getElementById("startlistoverlay").classList.remove("out");
    startListAnimationTimeouts.push(setTimeout(() => {
        document.getElementById("startlistoverlay").classList.add("out");
    }, pages.length * (STARTLIST_ANIMATION_DURATION+STARTLIST_PAGE_DURATION)));
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
        // Image overlay
        case "setImageOverlaySource":
            setImageOverlaySource(data.src);
            break;
        case "showImageOverlay":
            showImageOverlay();
            break;
        case "hideImageOverlay":
            hideImageOverlay();
            break;
        case "displayImageOverlay":
            displayImageOverlay(data.duration);
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
