import { fetchCommitData } from "./commit.js";
import OpenAI from "openai";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const openai_api_key = process.env.OPENAI_API_KEY;

const openai = new OpenAI();
openai.api_key = openai_api_key;

function loadPrompt() {
    const file = fs.readFile(process.cwd() + '/prompt/summarize.json', 'utf8');
    const promptData = JSON.parse(file);
    console.log("✅ : Prompt loaded successfully")
    return promptData;
}


function formatPromptForAllRepos(promptTemplate, allRepoData) {
    let formattedCommitData = allRepoData.map(repoData => {
        const { repository, commits } = repoData;
        const commitMessages = commits.join('\n');
        return `Repo: ${repository}\nCommits:\n${commitMessages}`;
    }).join('\n\n');

    console.log("✅ : Prompt formatted successfully")

    return promptTemplate
        .replace('{commit_messages}', formattedCommitData);
}

async function getSummary() {
    const commitData = await fetchCommitData();

    if (commitData.length === 0) {
        return { summary: "No commit data this week.", changed_repos: 0, total_commits: 0 };
    }

    const changed_repos = commitData.length;
    const total_commits = commitData.reduce((sum, repo) => sum + repo.commits.length, 0);

    // prompt
    const promptTemplate = loadPrompt().user;
    const prompt = formatPromptForAllRepos(promptTemplate, commitData);    

    const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a warm-hearted and helpful assistant" },
        {role: "user", content : prompt}
    ],
    model: "gpt-4o",
    });
    const weekly_summary = completion.choices[0].message.content;
    console.log("✅ : Weekly github summary updated successfully");
    return {weekly_summary,changed_repos,total_commits};
}

getSummary();
export {getSummary};