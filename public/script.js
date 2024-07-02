document.addEventListener("DOMContentLoaded", async () => {
    async function fetchAndDisplayCommits() {
        try {
            const response = await fetch("/api/weekly-summary.js");
            const data = await response.json();

            const activitiesContainer = document.querySelector("#github-activities .github__content");

            if (data.changed_repos === 0) {
                activitiesContainer.innerHTML = "<p>No activities this week.</p>";
            } else {
                const repoCommitInfo = document.createElement("div");
                repoCommitInfo.innerHTML = `
                    <p><strong>Repositories changed:</strong> ${data.changed_repos}</p>
                    <p><strong>Total commits:</strong> ${data.total_commits}</p>
                `;
                activitiesContainer.appendChild(repoCommitInfo);
                
                const summaryParagraph = document.createElement("p");
                summaryParagraph.textContent = data.summary;
                activitiesContainer.appendChild(summaryParagraph);
                
            }
        } catch (error) {
            console.error("Failed to fetch commit data:", error);
            const activitiesContainer = document.querySelector("#github-activities .github__content");
            activitiesContainer.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
        }
    }

    async function fetchAndDisplayDate() {
        try {
            const response = await fetch("/api/current-date.js");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            const dateElement = document.querySelector(".date");
            dateElement.textContent = data.currentDate;
        } catch (error) {
            console.error("Failed to fetch current date:", error);
        }
    }

    async function fetchAndDisplayWeather() {
        try {
            const response = await fetch("/api/current-weather.js");
            const data = await response.json();

            const weatherContainer = document.querySelector("#weather .weather__content");
            weatherContainer.innerHTML = `
                <div class="weather__info">
                    <img src="${data.weatherImagePath}" alt="${data.currentWeather} image">
                    <div class="weather__details">
                        <p><strong>Weather</strong> : ${data.currentWeather}</p>
                        <p><strong>Temperature</strong> : ${data.tempInCelcius} °C</p>
                    </div>
                </div>
                `;
        } catch (error) {
            console.error("Failed to fetch current weather:", error);
        }
    };

    fetchAndDisplayCommits();
    fetchAndDisplayDate();
    fetchAndDisplayWeather();
});
