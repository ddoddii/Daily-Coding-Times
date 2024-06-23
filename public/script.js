document.addEventListener("DOMContentLoaded", async () => {
    async function fetchAndDisplayCommits() {
        try {
            const response = await fetch("/commits");
            const commitsData = await response.json();

            const activitiesContainer = document.querySelector("#github-activities .github__content");
            activitiesContainer.innerHTML = "";

            if (commitsData.length === 0) {
                activitiesContainer.innerHTML = "<p>No activities this week.</p>";
            } else {
                commitsData.forEach(commit => {
                    const repoElement = document.createElement("div");
                    repoElement.className = "github__item";

                    const repoName = document.createElement("h4");
                    repoName.textContent = commit.repository;
                    repoElement.appendChild(repoName);

                    const commitList = document.createElement("ul");
                    commit.commits.forEach(commitMessage => {
                        const commitItem = document.createElement("li");
                        commitItem.textContent = commitMessage;
                        commitList.appendChild(commitItem);
                    });

                    repoElement.appendChild(commitList);
                    activitiesContainer.appendChild(repoElement);
                });
            }
        } catch (error) {
            console.error("Failed to fetch commit data:", error);
        }
    }

    async function fetchAndDisplayDate() {
        try {
            const response = await fetch("/current-date");
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
