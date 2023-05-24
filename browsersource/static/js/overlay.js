// General info overlay

function showGeneralInfoOverlay(data) {
    document.querySelector("#generalinfooverlay-title").innerHTML = data.title;
    document.querySelector("#generalinfooverlay-description").innerHTML = data.description;

    document.querySelector(".generalinfooverlay").classList.remove("out-left");
    console.log("Showing general info overlay");
}

function hideGeneralInfoOverlay() {
    document.querySelector(".generalinfooverlay").classList.add("out-left");
    console.log("Hiding general info overlay");
}

// Start info overlay

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

// Sponsors video

const SECONDS_PER_CATEGORY = 5;
const CATEGORY_ANIMATION_DURATION = 1.5;
const BLOCK_ANIMATION_DURATION = 1.5;

function playSponsorsAnimation() {
    document.querySelector(".sponsorsoverlay_block").classList.remove("out-down");
    console.log("Showing sponsors overlay")

    let catelems = document.querySelectorAll(".sponsorscategory");
    let count = 0;

    for (let el of catelems) {
        var offset_start = count * (SECONDS_PER_CATEGORY + 2*CATEGORY_ANIMATION_DURATION) + 0.5*BLOCK_ANIMATION_DURATION;
        count++;
        var offset_end = count * (SECONDS_PER_CATEGORY + 2*CATEGORY_ANIMATION_DURATION) + 0.5*BLOCK_ANIMATION_DURATION - CATEGORY_ANIMATION_DURATION;

        setTimeout(() => {
            el.classList.remove("out-down");
        }, offset_start * 1000);
        setTimeout(() => {
            el.classList.add("out-down");
        }, offset_end * 1000);

    }

    let offset_hide = count * (SECONDS_PER_CATEGORY + 2*CATEGORY_ANIMATION_DURATION);
    setTimeout(() => {
        document.querySelector(".sponsorsoverlay_block").classList.add("out-down");
        console.log("Hiding sponsors overlay")
    }, offset_hide * 1000 );
}

function createSponsorsImages() {
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
        createSponsorsImages();
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
        case "showGeneralInfoOverlay":
            showGeneralInfoOverlay(data);
            break;
        case "hideGeneralInfoOverlay":
            hideGeneralInfoOverlay();
            break;
        case "showStartInfoOverlay":
            showStartInfoOverlay(data);
            break;
        case "playSponsorsAnimation":
            playSponsorsAnimation();
            break;
    }
});
