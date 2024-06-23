import express from "express";
import { fetchCommitData } from "./src/commit.js";
import { getCurrentDate } from "./src/date.js";

const app = express();
app.use(express.json());

let commits = [];

async function updateCommits() {
    commits = await fetchCommitData();
}


updateCommits();

app.get("/commits", (req, res) => {
    res.json(commits);
});

app.get("/current-date", (req, res) => {
    const currentDate = getCurrentDate();
    res.json({ currentDate });
});

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});