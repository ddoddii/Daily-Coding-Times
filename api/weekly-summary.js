import { getSummary } from '../src/summary.js';

export default async (req, res) => {
    try {
        const { weekly_summary, changed_repos, total_commits } = await getSummary();
        res.status(200).json({ summary: weekly_summary, changed_repos, total_commits });
    } catch (error) {
        console.error("Error in /weekly-summary endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
