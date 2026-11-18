"use strict";

/* Practical 6 - Timers, callbacks, Fetch API and browser storage
   WanderGo Travels */

/* ---------- Shared helpers ---------- */

const $ = (id) => document.getElementById(id);

const PREFS_KEY = "wandergo_prefs";
const GUEST_KEY = "wandergo_guest_name";

const rupees = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
});

/* Creates an element with an optional class and text in one go */
function make(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
}

/* Updates a .message box. kind is "ok", "error" or "" (neutral) */
function say(box, text, kind) {
    box.textContent = text;
    box.className = "message" + (kind ? " is-" + kind : "");
}

/* One JSON object in localStorage holds every saved preference */
const prefs = {
    read() {
        try {
            return JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
        } catch (err) {
            return {};
        }
    },
    save(changes) {
        localStorage.setItem(PREFS_KEY, JSON.stringify(Object.assign(this.read(), changes)));
    },
    wipe() {
        localStorage.removeItem(PREFS_KEY);
    }
};

const state = {
    packages: [],
    rotation: null,
    lineIndex: 0
};

/* ---------- 1. Timers ---------- */

const promoLines = [
    "Sun, sand and seafood: Goa is calling this weekend.",
    "Walk through the pink palaces of Jaipur.",
    "Wake up to snowy peaks in Manali."
];

// setTimeout: runs one time after 3 seconds
setTimeout(() => {
    $("promoMessage").textContent = "Special Offer: 10% OFF on selected demo packages!";
}, 3000);

// setInterval: repeats every 5 seconds until it is stopped
function rotatePromo() {
    $("timerResult").textContent = promoLines[state.lineIndex];
    state.lineIndex = (state.lineIndex + 1) % promoLines.length;
}

function startRotation() {
    state.rotation = setInterval(rotatePromo, 5000);
    $("stopTimerBtn").textContent = "Stop Repeating Messages";
}

function stopRotation() {
    clearInterval(state.rotation);
    state.rotation = null;
    $("timerResult").textContent = "Repeating promotional messages stopped.";
    $("stopTimerBtn").textContent = "Resume Repeating Messages";
}

$("stopTimerBtn").addEventListener("click", () => {
    if (state.rotation === null) {
        startRotation();
        $("timerResult").textContent = "Messages resumed. The next one appears in 5 seconds.";
    } else {
        stopRotation();
    }
});

/* ---------- 2. Fetch API (async / await) ---------- */

async function loadPackages(fileName) {
    const status = $("fetchStatus");
    say(status, "Loading packages...", "");
    $("packageList").replaceChildren();

    try {
        const response = await fetch(fileName);
        if (!response.ok) {
            throw new Error("File not found (HTTP " + response.status + ")");
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
            throw new Error("The JSON file must hold a list of packages");
        }

        state.packages = data;
        buildDestinationFilter();
        renderPackages();
        say(status, "Success! " + data.length + " packages loaded with Fetch API.", "ok");
    } catch (err) {
        state.packages = [];
        say(status, "Error: " + err.message + ". Press Load Travel Packages to try again.", "error");
    }
}

function buildDestinationFilter() {
    const filter = $("destinationFilter");
    const saved = prefs.read().destination || "all";
    const places = [...new Set(state.packages.map((item) => item.destination))];

    filter.replaceChildren(new Option("All Destinations", "all"));
    places.forEach((place) => filter.add(new Option(place, place)));

    filter.value = places.includes(saved) ? saved : "all";
    showSavedPrefs();
}

function renderPackages() {
    const list = $("packageList");
    const chosen = $("destinationFilter").value;
    const visible = state.packages.filter((item) => chosen === "all" || item.destination === chosen);

    list.replaceChildren();

    if (visible.length === 0) {
        list.textContent = "No packages found for this destination.";
        return;
    }

    visible.forEach((item) => {
        const card = make("article", "trip-card");
        card.append(
            make("div", "trip-icon", item.icon),
            make("h3", "", item.title),
            make("div", "trip-meta", item.destination + " | " + item.days + " days"),
            make("p", "trip-desc", item.description),
            make("span", "trip-price", rupees.format(Number(item.price)) + " per person")
        );
        list.append(card);
    });
}

$("loadBtn").addEventListener("click", () => loadPackages("packages.json"));
$("errorBtn").addEventListener("click", () => loadPackages("missing_packages.json"));

/* ---------- 3. Callback function ---------- */

// "done" is the callback: it is called only after the 1.5 second wait ends
function checkTravelRequest(place, done) {
    setTimeout(() => {
        done("Your demo request for " + place + " has been approved.");
    }, 1500);
}

$("bookingBtn").addEventListener("click", (event) => {
    const button = event.currentTarget;
    const output = $("callbackResult");
    const filterValue = $("destinationFilter").value;
    const place = filterValue === "all" ? "Goa" : filterValue;

    button.disabled = true;
    say(output, "1) Request sent  >  2) Checking availability (1.5 seconds)...", "");

    checkTravelRequest(place, (reply) => {
        say(output, "3) Callback ran. " + reply, "ok");
        button.disabled = false;
    });
});

/* ---------- 4. Local storage ---------- */

function applyTheme(name) {
    document.body.classList.toggle("dark", name === "dark");
}

function showSavedPrefs() {
    const saved = prefs.read();
    $("localResult").textContent =
        "Saved destination: " + (saved.destination || "none") +
        "  |  Saved theme: " + (saved.theme || "light");
}

$("destinationFilter").addEventListener("change", (event) => {
    prefs.save({ destination: event.target.value });
    renderPackages();
    showSavedPrefs();
});

$("themeBtn").addEventListener("click", () => {
    const next = document.body.classList.contains("dark") ? "light" : "dark";
    applyTheme(next);
    prefs.save({ theme: next });
    showSavedPrefs();
});

$("clearLocalBtn").addEventListener("click", () => {
    prefs.wipe();
    applyTheme("light");
    $("destinationFilter").value = "all";
    renderPackages();
    showSavedPrefs();
});

/* ---------- 5. Session storage ---------- */

function showGuest() {
    const name = sessionStorage.getItem(GUEST_KEY) || "";
    $("sessionResult").textContent = name
        ? "Welcome, " + name + "! (kept in Session Storage for this tab)"
        : "No temporary guest name is saved.";
    $("guestName").value = name;
}

$("saveSessionBtn").addEventListener("click", () => {
    const name = $("guestName").value.trim();

    if (name === "") {
        $("sessionResult").textContent = "Type a guest name before saving.";
        return;
    }

    sessionStorage.setItem(GUEST_KEY, name);
    showGuest();
});

$("clearSessionBtn").addEventListener("click", () => {
    sessionStorage.removeItem(GUEST_KEY);
    showGuest();
});

/* ---------- Start-up ---------- */

applyTheme(prefs.read().theme);
showSavedPrefs();
showGuest();
startRotation();
