import express from "express";
import { fetchCommitData } from "../src/commit.js";
import { getCurrentDate } from "../src/date.js";
import { getSummary } from "../src/summary.js";

const app = express();
app.use(express.json());

let commits = [];

async function updateCommits() {
    try {
        commits = await fetchCommitData();
        console.log("Commits updated successfully.");
    } catch (error) {
        console.error("Error fetching commit data:", error);
    }
}

updateCommits();

const millisecondsInADay = 24 * 60 * 60 * 1000;
const now = new Date();
const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
const timeUntilNextMidnight = nextMidnight - now;

setTimeout(() => {
    updateCommits();
    setInterval(updateCommits, millisecondsInADay);
}, timeUntilNextMidnight);


app.use(express.static("public"));

app.get("/", (req, res) => res.send("Express on Vercel"));

app.get("/commits", async (req, res) => {
    res.json(commits);
});

app.get("/current-date", (req, res) => {
    const currentDate = getCurrentDate();
    res.json({ currentDate });
});

app.get("/weekly-summary", async (req, res) => {
    try {
        const { weekly_summary, changed_repos, total_commits } = await getSummary();
        res.json({ "summary": weekly_summary, "changed_repos": changed_repos,"total_commits": total_commits });
    } catch (error) {
        console.error("Error in /weekly-summary endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});