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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const filePath = path.resolve(__dirname, '../prompt/summarize.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const promptData = JSON.parse(fileContent);
    return promptData;
}


function formatPromptForAllRepos(promptTemplate, allRepoData) {
    let formattedCommitData = allRepoData.map(repoData => {
        const { repository, commits } = repoData;
        const commitMessages = commits.join('\n');
        return `Repo: ${repository}\nCommits:\n${commitMessages}`;
    }).join('\n\n'); // Separate each repository's data with a double newline

    return promptTemplate
        .replace('{commit_messages}', formattedCommitData);
}

async function getSummary() {
    // user commits 
    const commitData = await fetchCommitData();

    // handle no commits this week
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
    //console.log(completion.choices[0].message.content);
    const weekly_summary = completion.choices[0].message.content;
    console.log("Weekly github summary updated successfully.");
    return {weekly_summary,changed_repos,total_commits};
}

getSummary();
export {getSummary};