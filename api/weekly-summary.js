import { fetchSummaryFromFirestore } from '../src/summary.js';


export default async (req, res) => {
    try {
        const data  = await fetchSummaryFromFirestore();
        res.status(200).json({ summary: data['summary'], changed_repos: data['changed_repos'], total_commits: data['total_commits'] });
    } catch (error) {
        console.error("Error in /weekly-summary endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
