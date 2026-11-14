
// ======================================
// LUNAQUEST - MISSION LUNAR BASE 30
// ======================================


// 1. GET HTML ELEMENTS

const welcomeScreen = document.getElementById("welcomeScreen");
const startButton = document.getElementById("startButton");

const briefingScreen = document.getElementById("briefingScreen");
const enterBaseButton = document.getElementById("enterBaseButton");

const missionControl = document.getElementById("missionControl");
const resultScreen = document.getElementById("resultScreen");


// 2. WELCOME SCREEN

startButton.addEventListener("click", function() {

    welcomeScreen.style.display = "none";
    briefingScreen.style.display = "block";

});


// 3. MISSION BRIEFING

enterBaseButton.addEventListener("click", function() {

    briefingScreen.style.display = "none";
    missionControl.style.display = "block";

    updateDisplay();

});


// 4. INITIAL RESOURCE VALUES

let life = 80;
let energy = 70;
let shield = 60;

let currentDay = 1;


// 5. RESOURCE ELEMENTS

const lifeDisplay = document.getElementById("lifeSupport");
const powerDisplay = document.getElementById("power");
const shieldDisplay = document.getElementById("protection");

const dayDisplay = document.getElementById("day");

const message = document.getElementById("statusMessage");
const eventMessage = document.getElementById("eventMessage");

const lifeBar = document.getElementById("lifeBar");
const powerBar = document.getElementById("powerBar");
const shieldBar = document.getElementById("shieldBar");


// 6. UPDATE RESOURCE DISPLAY

function updateDisplay() {

    lifeDisplay.textContent = life;
    powerDisplay.textContent = energy;
    shieldDisplay.textContent = shield;

    dayDisplay.textContent = currentDay;

    lifeBar.style.width = life + "%";
    powerBar.style.width = energy + "%";
    shieldBar.style.width = shield + "%";

}


// 7. DISABLE ACTION BUTTONS

function disableActions() {

    document.getElementById("rechargeButton").disabled = true;
    document.getElementById("lifeSupportButton").disabled = true;
    document.getElementById("shieldButton").disabled = true;
    document.getElementById("greenhouseButton").disabled = true;

}


// 8. MISSION FAILURE

function missionFailed() {

    message.textContent =
        "MISSION FAILED! Critical resources depleted.";

    disableActions();

}


// 9. RANDOM LUNAR EVENTS

function triggerRandomEvent() {

    const events = [

        {
            message: "☀️ Solar activity detected! Power reduced slightly.",
            life: 0,
            power: -5,
            shield: 0
        },

        {
            message: "🌑 Lunar dust detected near solar panels!",
            life: 0,
            power: -3,
            shield: 0
        },

        {
            message: "🌱 Greenhouse malfunction! Life support affected.",
            life: -4,
            power: 0,
            shield: 0
        },

        {
            message: "🔧 Equipment inspection required.",
            life: 0,
            power: -4,
            shield: 0
        },

        {
            message: "📡 Communication systems operating normally!",
            life: 0,
            power: 0,
            shield: 0
        }

    ];

    const randomIndex = Math.floor(Math.random() * events.length);

    const selectedEvent = events[randomIndex];

    eventMessage.textContent = selectedEvent.message;

    life = Math.max(0, life + selectedEvent.life);
    energy = Math.max(0, energy + selectedEvent.power);
    shield = Math.max(0, shield + selectedEvent.shield);

}


// 10. DAILY ACTION FUNCTION

function performAction(lifeChange, powerChange, shieldChange, actionName) {

    // Apply action effects

    life = Math.max(0, Math.min(100, life + lifeChange));
    energy = Math.max(0, Math.min(100, energy + powerChange));
    shield = Math.max(0, Math.min(100, shield + shieldChange));


    // Generate a random lunar event

    triggerRandomEvent();


    // Update resource display

    updateDisplay();


    // Check mission failure

    if (life <= 0 || energy <= 0) {

        missionFailed();

        return;

    }


    // Display action result

    message.textContent = actionName + " completed!";


    // Check mission completion

    if (currentDay === 30) {

        showMissionReport();

        return;

    }


    // Move to the next day

    currentDay++;

    updateDisplay();

}


// 11. FINAL MISSION REPORT

function showMissionReport() {

    // Display final resource values

    document.getElementById("finalLife").textContent = life;
    document.getElementById("finalPower").textContent = energy;
    document.getElementById("finalShield").textContent = shield;


    // Calculate mission score

    const score = life + energy + shield;

    document.getElementById("missionScore").textContent = score;


    // Assign achievement

    let achievement;

    if (score >= 240) {

        achievement = "🏆 Lunar Legend";

    } else if (score >= 150) {

        achievement = "🥇 Expert Commander";

    } else {

        achievement = "🚀 Junior Mission Commander";

    }

    document.getElementById("achievement").textContent = achievement;


    // Show final report

    missionControl.style.display = "none";
    resultScreen.style.display = "block";

    disableActions();

}


// 12. CONNECT DAILY ACTION BUTTONS


// Recharge solar batteries

document.getElementById("rechargeButton").addEventListener("click", function() {

    performAction(0, 25, 0, "Solar batteries recharged");

});


// Maintain life support

document.getElementById("lifeSupportButton").addEventListener("click", function() {

    performAction(15, -8, 0, "Life support maintained");

});


// Improve radiation shielding

document.getElementById("shieldButton").addEventListener("click", function() {

    performAction(0, -8, 15, "Radiation shielding improved");

});


// Maintain greenhouse

document.getElementById("greenhouseButton").addEventListener("click", function() {

    performAction(12, -6, 0, "Greenhouse maintained");

});


// ======================================
// 13. NASA DONKI - SPACE WEATHER DATA
// ======================================


// NASA HTML ELEMENTS

const nasaButton = document.getElementById("nasaButton");
const nasaData = document.getElementById("nasaData");


// FORMAT NASA DATE

function formatNASAdate(dateValue) {

    if (!dateValue) {
        return "Date unavailable";
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleString();

}


// EXTRACT EVENT SUMMARY

function extractSummary(body) {

    const summaryMatch = body.match(
        /Summary:\s*([\s\S]*?)(?=\n\s*(?:##\s*Notes:|Notes:|##\s*Links:)|$)/i
    );

    let summary = summaryMatch
        ? summaryMatch[1]
        : body;

    // Remove unnecessary Markdown formatting

    summary = summary
        .replace(/[#*_]/g, "")
        .replace(/\s+/g, " ")
        .trim();

    // Keep the summary readable

    if (summary.length > 300) {

        summary = summary.substring(0, 300) + "...";

    }

    return summary || "No summary available.";

}


// CREATE NASA EVENT CARD

function createNASACard(event) {

    const card = document.createElement("div");

    card.className = "nasa-card";


    // Identify NASA event type

    const eventTypes = {

        "CME": {
            icon: "☀️",
            name: "Coronal Mass Ejection"
        },

        "RBE": {
            icon: "🛡️",
            name: "Radiation Belt Enhancement"
        },

        "Report": {
            icon: "📊",
            name: "Space Weather Report"
        }

    };


    const type = eventTypes[event.messageType] || {

        icon: "🌌",
        name: event.messageType || "Space Weather Event"

    };


    // Event title

    const title = document.createElement("h3");

    title.textContent = type.icon + " " + type.name;


    // Event date

    const date = document.createElement("p");

    date.textContent =
        "📅 " + formatNASAdate(event.messageIssueTime);


    // Event summary

    const description = document.createElement("p");

    description.textContent =
        extractSummary(event.messageBody || "");


    // Add basic card contents

    card.appendChild(title);
    card.appendChild(date);
    card.appendChild(description);


    // Extract CME speed if available

    const speedMatch = (event.messageBody || "").match(
        /Estimated speed:\s*~?\s*([\d,]+)\s*km\/s/i
    );


    if (speedMatch) {

        const speed = document.createElement("p");

        speed.textContent =
            "🚀 Estimated CME speed: " + speedMatch[1] + " km/s";

        card.appendChild(speed);

    }


    // Link to original NASA notification

    if (event.messageURL) {

        const link = document.createElement("a");

        link.href = event.messageURL;
        link.textContent = "VIEW FULL NASA NOTIFICATION ↗";

        link.target = "_blank";
        link.rel = "noopener noreferrer";

        card.appendChild(link);

    }


    return card;

}


// FETCH NASA DONKI DATA

nasaButton.addEventListener("click", async function() {

    nasaButton.disabled = true;

    nasaData.textContent = "Connecting to NASA... 🚀";


    try {

        // Get current date

        const today = new Date();

        const endDate = today.toISOString().split("T")[0];


        // Get date 7 days ago

        const previousDate = new Date();

        previousDate.setDate(previousDate.getDate() - 7);

        const startDate = previousDate.toISOString().split("T")[0];


        // NASA DONKI API URL

        const url =
            `https://api.nasa.gov/DONKI/notifications?startDate=${startDate}&endDate=${endDate}&api_key=DEMO_KEY`;


        // Send request to NASA

        const response = await fetch(url);


        if (!response.ok) {

            throw new Error("NASA API request failed: " + response.status);

        }


        // Convert response into JSON

        const data = await response.json();


        // Clear previous NASA updates

        nasaData.replaceChildren();


        // Check whether NASA has recorded notifications

        if (!Array.isArray(data) || data.length === 0) {

            nasaData.textContent =
                "No space-weather notifications found in the selected 7-day period.";

            return;

        }


        // Display latest 5 notifications

        const latestEvents = data.slice(-5).reverse();


        latestEvents.forEach(function(event) {

            const card = createNASACard(event);

            nasaData.appendChild(card);

        });


        // Add NASA data disclaimer

        const disclaimer = document.createElement("p");

        disclaimer.textContent =
            "Source: NASA CCMC DONKI. These are space-weather observations and notifications, not direct lunar radiation measurements.";

        nasaData.appendChild(disclaimer);


    } catch (error) {

        console.error("NASA API Error:", error);

        nasaData.textContent =
            "Unable to connect to NASA right now. Please check your internet connection and try again.";

    } finally {

        nasaButton.disabled = false;

    }

});
