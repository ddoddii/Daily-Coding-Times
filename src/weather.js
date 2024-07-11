import axios from "axios";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname,join } from 'path';
import config from '../config.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const lat = 37.5666791;
const lon = 126.9782914;

const weatherImages = {
    Clear: 'images/weather/Sun with Face.png',
    Clouds: 'images/weather/Cloud.png',
    Rain: 'images/weather/Umbrella with Rain Drops.png',
    Snow: 'images/weather/Cloud with Snow.png',
    Fog: 'images/weather/Fog.png',
	Mist: 'images/weather/Fog.png',
	Moon : 'images/weather/Full Moon Face.png',
};

const timeImages = {
	SunRise : 'images/weather/Sunrise Over Mountains.png',
	SunSet : 'images/weather/Sunset.png',
};

function isNight(currentHour) {
	return (currentHour < 5 || currentHour > 20);
}

async function getCurrentWeather() {
	try {
		const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather`, {
			params: {
				lat: lat,
				lon: lon,
				appid: config.OpenWeatherApiKey,
			}});
		const currentWeather = res.data['weather'][0]['main'];
		const currentWeatherDescription = res.data['weather'][0]['description'];
		const tempInKelvin = res.data['main']['temp'];
		const tempInCelcius = Math.round(tempInKelvin - 273);
		// weather Image path
		let weatherImagePath;
		const currentHour = new Date().getHours();
		if (isNight(currentHour) && currentWeather === 'Clear') {
			weatherImagePath = weatherImages['Moon'];
		} else {
			weatherImagePath = weatherImages[currentWeather] || 'images/weather/Star.png';
		}
		console.log("✅ : Daily Weather updated successfully -> ", tempInCelcius, currentWeather, currentWeatherDescription);
		return {currentWeather, currentWeatherDescription, tempInCelcius, weatherImagePath};

		} catch (error) {
				console.error("@src/trend.js : Failed to fetch trend data from Firestore:", error);
		}

	}



export {getCurrentWeather};
