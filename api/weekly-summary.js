import dotenv from 'dotenv';
import OpenAI from "openai";
import { getSummary } from '../src/summary.js';

dotenv.config();

const openai_api_key = process.env.OPENAI_API_KEY;
const openai = new OpenAI();
openai.api_key = openai_api_key;

export default async (req, res) => {
    try {
        const { weekly_summary, changed_repos, total_commits } = await getSummary(openai);
        res.status(200).json({ summary: weekly_summary, changed_repos, total_commits });
    } catch (error) {
        console.error("Error in /weekly-summary endpoint:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
