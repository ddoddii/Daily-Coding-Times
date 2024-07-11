import { fetchCommitData } from "./commit.js";
import path from 'path';
import fs from 'fs';


export function loadPrompt() {
    const filePath = path.join(process.cwd(), 'prompt', 'summarize.json');
    const file = fs.readFileSync(filePath, 'utf8');
    const promptData = JSON.parse(file);
    console.log("@@functions/src/summary.js : Prompt loaded successfully");
    return promptData;
}


export function formatPromptForAllRepos(promptTemplate, allRepoData) {
    let formattedCommitData = allRepoData.map(repoData => {
        const { repository, commits } = repoData;
        const commitMessages = commits.join('\n');
        return `Repo: ${repository}\nCommits:\n${commitMessages}`;
    }).join('\n\n');

    console.log("@@functions/src/summary.js : Prompt formatted successfully")

    return promptTemplate
        .replace('{commit_messages}', formattedCommitData);
}

export async function getSummary(openai) {
    const commitData = await fetchCommitData();
    console.log("@@functions/src/summary.js Fetched Commit Data : ", commitData);

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
    console.log("@@functions/src/summary.js : Weekly github summary updated successfully");
    return {weekly_summary,changed_repos,total_commits};
}

