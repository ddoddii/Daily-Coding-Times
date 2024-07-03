import { getTrendingRepos } from "../src/trend.js";

export default async (req, res) => {
    try {
        const { repos } = await getTrendingRepos();
        console.log("✅ : Github Trend updated successfully @vercel")
        res.status(200).json({ repos });
    } catch (error) {
        console.error("🚨 : Error in /weekly-github-trend endpoint : ", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
