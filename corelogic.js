let UI_THEME = 'dark'; // Default theme
let SHOW_WEATHER_IMAGE = true; // Default for new toggle
let RECENT_WEATHER = null;
let HEADLINE_NEWS = [];

// --- Climate Facts for "Did You Know?" ---
const climateFacts = [
    "Did you know? The Earth's average temperature has risen by about 1.2°C since the late 19th century.",
    "Did you know? The Amazon rainforest produces about 20% of the world's oxygen.",
    "Did you know? A single mature tree can absorb carbon dioxide at a rate of 48 pounds per year.",
    "Did you know? Oceans absorb about 30% of the carbon dioxide released into the atmosphere.",
    "Did you know? The ozone layer protects Earth from harmful ultraviolet (UV) radiation from the sun.",
    "Did you know? Deforestation contributes significantly to climate change by reducing carbon sinks.",
    "Did you know? Renewable energy sources like solar and wind power are becoming increasingly cost-effective.",
    "Did you know? Extreme weather events, such as heatwaves and heavy rainfall, are becoming more frequent.",
    "Did you know? Melting glaciers and ice sheets contribute to rising global sea levels.",
    "Did you know? Planting trees is one of the simplest and most effective ways to combat climate change."
];

let trendsInfo = {
    india:{
        label: "Indian Region",
        temp: "+0.9°C",
        context: "Drastic increases in maximum temperature since 1990s.",
        humidity: "+3.1%",
        storms: "+20%",
    },
    global:{
        label: "Global Avg",
        temp: "+1.2°C",
        context: "Global temperature up by 1.2°C since pre-industrial.",
        humidity: "+1.8%",
        storms: "+15%",
    },
    europe:{
        label: "Europe Zone",
        temp: "+2.0°C",
        context: "Europe facing more extreme floods, esp. summer.",
        humidity: "-1.2%",
        storms: "+18%",
    },
    asia:{
        label: "Asia Area",
        temp: "+1.5°C",
        context: "Increased heatwaves, shifting monsoons, storm frequency.",
        humidity: "+2.8%",
        storms: "+22%",
    }
};

// --- Tab Navigation Logic ---
document.querySelectorAll('.tab-btn').forEach(btn=>{
    btn.onclick = ()=>{
        document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        let sec = btn.dataset.section;
        document.querySelectorAll('.section-page').forEach(p=>p.classList.remove('active'));
        document.getElementById(sec).classList.add('active');

        // Specific actions when a tab is clicked
        if (sec === 'indianews') pullLatestHeadlines();
        if (sec === 'trends') trendSwitchTab('india');
        if (sec === 'settings') loadSettings(); // Load settings when settings tab is active
        if (sec === 'dashboard') displayRandomClimateFact(); // Display fact on Dashboard
    };
});
window.showTab = section=>{
    document.querySelector(`.tab-btn[data-section="${section}"]`).click();
};

// --- Weather Search Logic ---
document.getElementById("searchWeatherBtn").addEventListener("click", weatherQuery);
function searchWeatherCity(name){
    document.getElementById('weatherInput').value = name;
    weatherQuery();
}
async function weatherQuery(){
    let city = document.getElementById("weatherInput").value.trim();
    if(!city) return;
    let btn = document.getElementById("searchWeatherBtn");
    let out = document.getElementById("weatherPanel");
    let errbox = document.getElementById("weatherErrorBox");
    btn.innerHTML = '<span class="lds-roller"></span>';
    btn.disabled = true;
    errbox.classList.add('hidden');
    out.classList.add('hidden');
    try{
        let APIKEY = 'a1678514234882f652831565f1f9c185';
        let url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${APIKEY}&units=metric`;
        let resp = await fetch(url);
        if(!resp.ok) {
            const errorText = await resp.text();
            console.error(`API Error: ${resp.status} - ${resp.statusText}`, errorText);
            throw new Error("city/match fail or API error");
        }
        let data = await resp.json();
        RECENT_WEATHER = data;
        renderWeatherPanel(data);
        applyDynamicBackground(data); // Apply dynamic background after fetching weather
    }catch(e){
        console.error("Weather query failed:", e);
        errbox.classList.remove('hidden');
        // Reset background to default if there's an error
        document.body.removeAttribute('data-weather-state');
        document.body.removeAttribute('data-time-of-day');
    }
    btn.innerHTML = '<i class="fas fa-search"></i>';
    btn.disabled = false;
}

function renderWeatherPanel(data){
    let out = document.getElementById("weatherPanel");
    let weather = data.weather[0];
    let weatherCondition = weather.main.toLowerCase();

    // Determine which image to show based on weather condition
    let weatherImageSrc = '';
    if (weatherCondition.includes('clear')) {
        weatherImageSrc = 'Images/sunny.jpeg';
    } else if (weatherCondition.includes('rain') || weatherCondition.includes('drizzle')) {
        weatherImageSrc = 'Images/rain.jpg';
    } else if (weatherCondition.includes('snow')) {
        weatherImageSrc = 'Images/snow.jpeg';
    } else if (weatherCondition.includes('fog') || weatherCondition.includes('mist') || weatherCondition.includes('haze')) {
        weatherImageSrc = 'Images/fog.jpeg';
    } else if (weatherCondition.includes('cloud')) {
        weatherImageSrc = 'Images/cloudy.jpg';
    } else {
        weatherImageSrc = 'Images/sunny.jpeg'; // Default fallback
        console.warn("No specific image found for weather condition:", weather.main, "Falling back to sunny.jpeg");
    }

    // Conditionally include the image based on SHOW_WEATHER_IMAGE setting
    let weatherImageHtml = SHOW_WEATHER_IMAGE ? `
        <div class="weather-image-container">
            <img src="${weatherImageSrc}" alt="${weather.description}" class="weather-condition-image">
        </div>
    ` : '';

    out.innerHTML = `
        ${weatherImageHtml}
        <div class="wp-loc">${data.name}, ${data.sys.country}</div>
        <div class="wp-temp">${Math.round(data.main.temp)}°C</div>
        <div class="wp-desc">${weather.description}</div>
        <div class="weather-details-1">
            <div class="wd-block"><i class="fas fa-thermometer-half"></i><span>${Math.round(data.main.feels_like)}°C<br> <small>Feels</small></span></div>
            <div class="wd-block"><i class="fas fa-wind"></i><span>${data.wind.speed} m/s<br><small>Wind</small></span></div>
            <div class="wd-block"><i class="fas fa-tint"></i><span>${data.main.humidity}%<br><small>Humidity</small></span></div>
            <div class="wd-block"><i class="fas fa-eye"></i><span>${(data.visibility/1000).toFixed(1)}km<br><small>Visib.</small></span></div>
        </div>
    `;
    out.classList.remove('hidden');
    out.classList.add('animate-in');
}

// --- Dynamic Background Logic ---
function applyDynamicBackground(weatherData) {
    const body = document.body;
    const weatherMain = weatherData.weather[0].main.toLowerCase(); // e.g., "clouds", "clear", "rain"

    // Determine time of day based on sunrise/sunset (if available) or current local time
    let timeOfDay = 'day'; // Default to day
    if (weatherData.sys && weatherData.timezone) {
        const currentTime = new Date().getTime() / 1000; // Current time in seconds
        const sunrise = weatherData.sys.sunrise + weatherData.timezone; // Convert to local timestamp
        const sunset = weatherData.sys.sunset + weatherData.timezone; // Convert to local timestamp

        // Adjust current time by timezone offset for accurate day/night check
        const localCurrentTime = currentTime + weatherData.timezone - new Date().getTimezoneOffset() * 60;

        if (localCurrentTime < sunrise || localCurrentTime > sunset) {
            timeOfDay = 'night';
        }
    } else {
        // Fallback to local machine time if sunrise/sunset data is not available
        const localHour = new Date().getHours();
        if (localHour < 6 || localHour > 19) { // Before 6 AM or after 7 PM
            timeOfDay = 'night';
        }
    }

    // Remove previous weather state classes
    body.removeAttribute('data-weather-state');
    body.removeAttribute('data-time-of-day');

    // Set new weather state class
    if (weatherMain.includes('clear')) {
        body.setAttribute('data-weather-state', 'clear');
    } else if (weatherMain.includes('cloud')) {
        body.setAttribute('data-weather-state', 'clouds');
    } else if (weatherMain.includes('rain') || weatherMain.includes('drizzle')) {
        body.setAttribute('data-weather-state', 'rain');
    } else if (weatherMain.includes('snow')) {
        body.setAttribute('data-weather-state', 'snow');
    } else if (weatherMain.includes('fog') || weatherMain.includes('mist') || weatherMain.includes('haze')) {
        body.setAttribute('data-weather-state', 'fog');
    } else if (weatherMain.includes('thunderstorm')) {
        body.setAttribute('data-weather-state', 'thunderstorm');
    }
    // Set time of day class
    body.setAttribute('data-time-of-day', timeOfDay);
}


// --- News/Headlines Logic ---
function pullLatestHeadlines(){
    let newsSpin = document.getElementById('newsSpinner');
    let spot = document.getElementById('headlineSpot');
    spot.classList.add('hidden');
    newsSpin.classList.remove('hidden');
    setTimeout(()=>{
        let templates = [
            {
                tag: "IMD ALERT",
                image: "https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg",
                title: "Monsoon flooding expected in east Maharashtra in next 24h",
                body: "Heavy rainfall is forecast for Nagpur region, as IMD issues a red alert for low-lying areas. Disaster control rooms on standby.",
                level: "High",
                date: new Date(),
                source: "India Meteorological Dept.",
                url: "https://mausam.imd.gov.in/imd_latest/contents/press_release.php" // Placeholder URL
            },
            { tag: "Breaking", image: "https://images.pexels.com/photos/1162251/pexels-photo-1162251.jpeg", title: "Cyclone Tora develops over Bay of Bengal", body: "Fishermen barred from entering sea as Category 2 cyclone may intensify. Coastal AP on high alert.", level: "Medium", date: new Date(Date.now()-3*86400000), source: "INCOIS", url: "https://incois.gov.in/portal/osf/cyclones.jsp" }, // Placeholder URL
            { tag: "Glob. Watch", image: "https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg", title: "Record global temperature rise for July", body: "NASA releases figures showing July 2024 as the hottest month ever on record, surpassing previous highs.", level: "Global", date: new Date(Date.now()-4*86400000), source: "NASA/NOAA", url: "https://climate.nasa.gov/news/"}, // Placeholder URL
            { tag: "Update", image: "https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg", title: "Delhi heatwave: Mercury touches 47°C", body: "Officials warn citizens of high UV and health risk. Schools closed in Jaipur due to persistent hot winds, water shortage.", level: "High", date: new Date(Date.now()-8*86400000), source: "Local Media", url: "https://timesofindia.indiatimes.com/city/delhi" }, // Placeholder URL
            { tag: "Watch", image: "https://images.pexels.com/photos/1595108/pexels-photo-1595108.jpeg", title: "Moisture deficit risks Rabi crops in north states", body: "Agri ministry warns of food crop stress due to rainfall deviations. Punjab, Haryana face irrigation challenges.", level: "Medium", date: new Date(Date.now()-2*86400000), source: "Agri Ministry", url: "https://pib.gov.in/PressReleasePage.aspx?PRID=1969234" }, // Placeholder URL
        ];
        let pool = templates.sort(()=>0.5-Math.random()).slice(0,Math.floor(3+2*Math.random()));
        HEADLINE_NEWS = pool;
        let content = pool.map(n=>`
            <div class="news-tile" onclick="navLink('${n.url}')">
                <img class="main-img" src="${n.image}" alt="${n.title}">
                <div class="news-tile-content">
                    <h2>${n.title}</h2>
                    <div class="byline">By ${n.source} | ${(n.date).toLocaleDateString()}</div>
                    <div class="eventlevel">${n.tag}</div>
                    <p>${n.body}</p>
                </div>
            </div>
        `).join('\n');
        spot.innerHTML = content;
        spot.classList.remove('hidden');
        newsSpin.classList.add('hidden');
        document.getElementById("updatedLabel").textContent = "Last updated: "+(new Date()).toLocaleTimeString();
    }, 800);
}
document.getElementById("reloadNewsBtn").onclick = pullLatestHeadlines;

// --- Climate Trends Logic ---
function trendSwitchTab(key){
    document.querySelectorAll('.trend-tab').forEach(t=>t.classList.remove('active'));
    document.querySelector(`.trend-tab[data-reg="${key}"]`).classList.add('active');
    let data = trendsInfo[key];
    let wrap = document.getElementById('trendMetrics');
    wrap.innerHTML = `
        <div class="metric-box">
            <div class="metric-title">Temp. Increase</div>
            <div class="metric-val">${data.temp}</div>
            <div class="metric-context">${data.context}</div>
        </div>
        <div class="metric-box">
            <div class="metric-title">Humidity</div>
            <div class="metric-val">${data.humidity}</div>
        </div>
        <div class="metric-box">
            <div class="metric-title">Storms / Events</div>
            <div class="metric-val">${data.storms}</div>
        </div>
    `;
}
document.querySelectorAll('.trend-tab').forEach(btn=>{
    btn.onclick = ()=> trendSwitchTab(btn.dataset.reg);
});

// --- Settings Logic ---
let THEME_ELEM = document.querySelector('html');

// Function to apply theme
function applyTheme(theme) {
    THEME_ELEM.setAttribute('data-theme', theme);
    localStorage.setItem('WS_theme', theme); // Persist theme choice
    // Update active class for theme buttons
    document.querySelectorAll(".themeChoice").forEach(b => b.classList.remove('active'));
    document.querySelector(`.themeChoice[data-theme="${theme}"]`).classList.add('active');
}

// Event listeners for theme choice buttons
document.querySelectorAll(".themeChoice").forEach(btn => {
    btn.onclick = () => applyTheme(btn.dataset.theme);
});

// Function to apply weather image visibility setting
function applyWeatherImageSetting(show) {
    SHOW_WEATHER_IMAGE = show;
    localStorage.setItem('WS_showWeatherImage', show); // Persist setting
    // If weather panel is currently visible, re-render it to apply the change
    if (RECENT_WEATHER && !document.getElementById('weatherPanel').classList.contains('hidden')) {
        renderWeatherPanel(RECENT_WEATHER);
    }
}

// Event listener for the weather image toggle switch
document.getElementById('showWeatherImageToggle').addEventListener('change', function() {
    applyWeatherImageSetting(this.checked);
});

// Function to load settings from localStorage and apply them
function loadSettings() {
    // Load Theme
    let savedTheme = localStorage.getItem('WS_theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('dark'); // Default to dark if no setting found
    }

    // Load Show Weather Image setting
    let savedShowImage = localStorage.getItem('WS_showWeatherImage');
    if (savedShowImage !== null) {
        SHOW_WEATHER_IMAGE = JSON.parse(savedShowImage); // Convert string to boolean
        document.getElementById('showWeatherImageToggle').checked = SHOW_WEATHER_IMAGE;
    } else {
        SHOW_WEATHER_IMAGE = true; // Default to true if no setting found
        document.getElementById('showWeatherImageToggle').checked = true;
    }
}

// --- Did You Know? Fact Logic ---
function displayRandomClimateFact() {
    const factElement = document.getElementById('climateFact');
    if (factElement) {
        const randomIndex = Math.floor(Math.random() * climateFacts.length);
        factElement.textContent = climateFacts[randomIndex];
    }
}

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    loadSettings(); // Load user settings
    displayRandomClimateFact(); // Display a random fact on initial load of Dashboard
    // Ensure the initial background is set based on default theme
    applyDynamicBackground({ weather: [{ main: 'Clear' }], sys: { sunrise: 0, sunset: 0 }, timezone: 0 }); // Dummy data for initial background
});

// --- General Utility ---
function navLink(url) { window.open(url, '_blank'); }
