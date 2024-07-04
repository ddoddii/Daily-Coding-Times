import { Octokit } from "@octokit/rest";
import dotenv from 'dotenv';

dotenv.config();

const token = process.env.GITHUB_TOKEN;
const username = process.env.USERNAME;

const octokit = new Octokit({
    auth: token,
});

function getCurrentWeekRange() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6); 
    const endOfWeek = new Date(today); 
    return { startOfWeek, endOfWeek };
}

async function getUserRepos(username, since) {
    let repositories = new Set();
    try {
        const result = await octokit.search.commits({
            q: `author:${username} committer-date:>${since}`,
            sort: 'committer-date',
            order: 'desc',
            per_page: 100
        });

        result.data.items.forEach(commit => {
            repositories.add(commit.repository.full_name);
        });
    } catch (error) {
        console.error("Failed to fetch commits:", error);
    }
    return Array.from(repositories);
}

async function getDefaultBranch(repoFullName) {
    try {
        const response = await octokit.repos.get({
            owner: repoFullName.split('/')[0],
            repo: repoFullName.split('/')[1],
        });

        return response.data.default_branch;
    } catch (error) {
        console.error(`Failed to fetch repository info for ${repoFullName}:`, error);
        return null;
    }
}

async function getCommitMessages(repoFullName, branch = 'main', since, until) {
    let commitMessages = [];
    try {
        const defaultBranch = await getDefaultBranch(repoFullName);
        if (!defaultBranch) {
            console.log(`Could not determine default branch for ${repoFullName}. Skipping.`);
            return [];
        }

        branch = branch !== defaultBranch ? branch : defaultBranch;

        const commits = await octokit.repos.listCommits({
            owner: repoFullName.split('/')[0],
            repo: repoFullName.split('/')[1],
            sha: branch,
            since: since.toISOString(),
            until: until.toISOString(),
            per_page: 50,
        });

        commitMessages = commits.data.map(commit => commit.commit.message);
    } catch (error) {
        console.error(`Failed to fetch commits for ${repoFullName}:`, error);
    }
    return commitMessages;
}

async function fetchCommitData() {
    const { startOfWeek, endOfWeek } = getCurrentWeekRange();
    const sinceDate = startOfWeek.toISOString();
    const untilDate = endOfWeek.toISOString();

    const repositories = await getUserRepos(username, sinceDate);

    let summary = [];

    if (repositories.length === 0) {
        console.log("No repositories found with commits this week.");
    } else {
        for (const repo of repositories) {
            const commitMessages = await getCommitMessages(repo, 'main', new Date(sinceDate), new Date(untilDate));
            if (commitMessages.length > 0) {
                summary.push({
                    repository: repo,
                    commits: commitMessages
                });
            } else {
                console.log("No commit messages found or failed to fetch commit messages.");
            }
        }
    }

    return summary;
}


export {fetchCommitData};
