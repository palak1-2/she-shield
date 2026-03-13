function getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");
    const message = input.value.trim();
    if (!message) return;

    // Remove previous suggestions
    const oldSuggestions = document.getElementById("suggestions");
    if (oldSuggestions) oldSuggestions.remove();

    chatBox.innerHTML += `
        <div class="message user">
            ${message}
            <div class="timestamp">${getTime()}</div>
        </div>`;
    input.value = "";
    chatBox.innerHTML += `<div class="typing-dots" id="typing"><span></span><span></span><span></span></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message })
    });

    const data = await response.json();
    document.getElementById("typing").remove();

    const suggestions = getSuggestions(message);
    const suggestionHTML = suggestions.map(s =>
        `<button class="suggestion-btn" onclick="askTopic(this.innerText)">${s}</button>`
    ).join("");

    chatBox.innerHTML += `
        <div class="message bot">
            ${data.response}
            <div class="timestamp">${getTime()}</div>
        </div>
        <div class="suggestions" id="suggestions">${suggestionHTML}</div>`;

    chatBox.scrollTop = chatBox.scrollHeight;
}

function getSuggestions(message) {
    message = message.toLowerCase();
    if (message.includes("pcos")) 
        return ["What are PCOS symptoms?", "How is PCOS treated?", "PCOS and diet tips"];
    if (message.includes("period") || message.includes("menstrual")) 
        return ["Why are my periods irregular?", "How to reduce period pain?", "What is PMS?"];
    if (message.includes("stress") || message.includes("anxiety") || message.includes("mental")) 
        return ["How to reduce anxiety?", "Breathing exercises for stress", "When should I see a therapist?"];
    if (message.includes("nutrition") || message.includes("diet") || message.includes("food")) 
        return ["Best foods for women's health", "Iron rich foods for women", "Foods that help with PCOS"];
    return ["Tell me about PCOS", "Mental health tips", "Women's nutrition advice"];
}

function askTopic(topic) {
    document.getElementById("user-input").value = topic;
    sendMessage();
}

document.getElementById("user-input").addEventListener("keypress", function(e) {
    if (e.key === "Enter") sendMessage();
});

let map = null;

function findHospitals() {
    const modal = document.getElementById("hospital-modal");
    modal.style.display = "flex";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            if (!map) {
                map = L.map('map').setView([lat, lon], 14);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '© OpenStreetMap contributors'
                }).addTo(map);
            } else {
                map.setView([lat, lon], 14);
            }

            L.marker([lat, lon])
                .addTo(map)
                .bindPopup("📍 You are here")
                .openPopup();

            const query = `
                [out:json];
                node["amenity"="hospital"](around:5000,${lat},${lon});
                out body;
            `;

            fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
                .then(res => res.json())
                .then(data => {
                    data.elements.forEach(hospital => {
                        const name = hospital.tags.name || "Hospital";
                        L.marker([hospital.lat, hospital.lon])
                            .addTo(map)
                            .bindPopup(`🏥 ${name}`);
                    });
                });
        });
    } else {
        alert("Location access is required to find nearby hospitals.");
    }
}

function closeHospital() {
    document.getElementById("hospital-modal").style.display = "none";
}

function sendSOS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

            const message = `🚨 SOS ACTIVATED\n\n` +
                `Your location has been detected:\n` +
                `📍 Latitude: ${lat}\n` +
                `📍 Longitude: ${lon}\n\n` +
                `Google Maps Link:\n${mapsLink}\n\n` +
                `Emergency Numbers:\n` +
                `🚔 Police: 100\n` +
                `🚑 Ambulance: 108\n` +
                `🆘 Emergency: 112\n` +
                `👩 Women Helpline: 1091`;

            alert(message);
        });
    } else {
        alert("🚨 EMERGENCY!\n\nPlease call:\n🚔 Police: 100\n🚑 Ambulance: 108\n🆘 Emergency: 112\n👩 Women Helpline: 1091");
    }
}