document.addEventListener("DOMContentLoaded", async () => {
    async function fetchAndDisplayCommits() {
        try {
            const response = await fetch("/api/weekly-summary");
            const data = await response.json();

            const activitiesContainer = document.querySelector("#github-activities .github__content");

            if (data.changed_repos === 0) {
                activitiesContainer.innerHTML = "<p>No activities this week.</p>";
            } else {
                // Create and append the repository and commit count
                const repoCommitInfo = document.createElement("div");
                repoCommitInfo.innerHTML = `
                    <p><strong>Repositories changed:</strong> ${data.changed_repos}</p>
                    <p><strong>Total commits:</strong> ${data.total_commits}</p>
                `;
                activitiesContainer.appendChild(repoCommitInfo);
                // Create and append the summary paragraph
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
            const response = await fetch("/api/current-date");
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

    fetchAndDisplayCommits();
    fetchAndDisplayDate();
});
