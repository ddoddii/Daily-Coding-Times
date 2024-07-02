import { getCurrentWeather } from "../src/weather.js";

export default async (req, res) => {
    try {
        const { currentWeather, currentWeatherDescription, tempInCelcius, weatherImagePath } = await getCurrentWeather();
        res.status(200).json({ currentWeather, currentWeatherDescription, tempInCelcius, weatherImagePath });
    } catch (error) {
        console.error("Error in /current-weather endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
