# WeatherScope-App
WeatherScope – Indian & Global Weather Insights
A dynamic weather application providing real-time conditions, news, and climate trends.

🌟 Overview

WeatherScope is a modern, responsive web application designed to provide users with up-to-the-minute weather information for Indian cities and global locations. Beyond basic weather, it offers climate trends, hot headlines related to weather events, and a customizable user experience with a dynamic visual theme.

This project was built to showcase front-end development skills, API integration, and user interface design, with unique features like a weather-aware dynamic background and engaging climate facts.

✨ Features

Live Weather Search: Get real-time weather data (temperature, feels like, wind, humidity, visibility) for any city in India or worldwide.

Dynamic Weather Images: Visual representation of current weather conditions (sunny, cloudy, rainy, snowy, foggy) displayed with the weather results.

Intelligent Dynamic Backgrounds: The application's background subtly changes based on the current weather condition and time of day in the searched location, providing an immersive visual experience.

Hot Headlines: Stay informed with breaking news and critical updates on Indian and global weather calamities. News tiles are clickable to view more details on external sources.

Climate Watch Dashboard: Explore national and international climate benchmarks, including temperature increases, humidity changes, and storm frequencies.

Official Reports: Quick links to major climate reporting agencies like IMD, IPCC, NOAA, and EPA.

App Settings: Customize your experience by switching between dark and light themes, and toggle the visibility of weather condition images.

"Did You Know?" Climate Facts: Discover interesting and educational facts about climate change and environmental science on the Dashboard.

Responsive Design: Optimized for seamless viewing and interaction across various devices (desktop, tablet, mobile).

🚀 Technologies Used

HTML5: Structure and content of the web pages.

CSS3: Styling, animations, and responsive design, including dynamic background effects.

Vanilla JavaScript: Core application logic, API integration, DOM manipulation, and interactive features.

OpenWeatherMap API: For fetching real-time weather data.

Font Awesome: For scalable vector icons.

Google Fonts: Montserrat and Fira Mono for appealing typography.

🛠️ Setup and Installation

To run this project locally, follow these simple steps:

Clone the repository (or download the ZIP file) to your local machine:

git clone https://github.com/YourUsername/WeatherScope-App.git

(Replace YourUsername/WeatherScope-App.git with your actual repository URL)

Navigate to the project directory:

cd WeatherScope-App

Open index.html in your preferred web browser.

No special server setup or build process is required; it's a pure front-end application.

💡 Usage

Navigation: Use the tabs in the navigation bar (Dashboard, Live Weather, Hot Headlines, Climate Watch, Settings) to switch between different sections of the app.

Live Weather: Type a city name (e.g., Delhi, Bengaluru, New York) into the search bar and press Enter or click the search icon. You can also use the quick-select city chips.

Hot Headlines: Click on any news tile to open the full article in a new browser tab.

Settings: Go to the Settings tab to change the color theme or toggle the weather image visibility. Your preferences will be saved locally in your browser.

🔑 API Key

This application uses the OpenWeatherMap API. You will need a valid API key to fetch weather data. The current API key is hardcoded in corelogic.js for demonstration purposes.

To use your own API key:

Sign up for a free account at OpenWeatherMap.

Generate your API key.

Open corelogic.js and replace 'a1678514234882f652831565f1f9c185' with your actual API key:

let APIKEY = 'YOUR_OPENWEATHERMAP_API_KEY';

🖼️ Image Assets

Weather condition images are stored locally in the Images/ directory:

cloudy.jpg

fog.jpeg

rain.jpg

snow.jpeg

sunny.jpeg

Ensure these images are present in the correct path relative to your corelogic.js file for the dynamic image feature to work correctly.

🔮 Future Enhancements

5-Day Forecast: Integrate a multi-day weather forecast.

Geolocation: Automatically detect user's location for current weather.

More Settings: Add options for unit conversion (Fahrenheit/Celsius, mph/m/s).

Interactive Maps: Incorporate weather maps for precipitation, temperature, etc.

Backend for User Accounts: Implement user authentication and save personalized settings or favorite cities to a database.

Real News API: Integrate with a more robust news API for more varied and up-to-date headlines.

🙏 Credits and Acknowledgements

OpenWeatherMap: For providing the weather data API.

Pexels: For the beautiful stock images used in the news section.

Font Awesome: For the icons.

Google Fonts: For the typography.

📄 License

This project is open source and available under the MIT License.
