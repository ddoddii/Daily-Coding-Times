import functions from 'firebase-functions';
import admin from 'firebase-admin';
import OpenAI from 'openai';
import {getSummary} from  "./src/summary.js"
import {getTrendingRepos} from "./src/trend.js"

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAI({
    apiKey: functions.config().openai.key,
});

// Store summary of commits in database
async function storeCommitSummary() {
    console.log("Fetching summary...");
    const { weekly_summary, changed_repos, total_commits } = await getSummary(openai);
    console.log("✅ Fetched summary:", { weekly_summary, changed_repos, total_commits });

    const summary = {
        summary: weekly_summary,
        total_commits,
        changed_repos,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('commit-summary').add(summary);
    console.log("✅ : Daily gitHub summary updated to firebase successfully");
}

// Store trending repos
async function storeTrendingRepos() {
    console.log("Fetching trending repos...");
    const repos = await getTrendingRepos();
    console.log("✅ : Fetched trending repos");

    const repoCollection = db.collection("github-trend");
    const timestamp  = admin.firestore.FieldValue.serverTimestamp();

    for (const repo of repos) {
        try {
            await repoCollection.add({ ...repo, date: timestamp });
        } catch (e) {
        }
    }
    console.log("✅ : Daily gitHub trend updated to firebase successfully");
}


export const storeCommitSummaryFunction = functions.pubsub.schedule('every day 01:48').onRun(async (_context) => {
    try {
        await storeCommitSummary();
    } catch (error) {
        console.error("Error executing storeCommitSummaryFunction: ", error);
    }
    return null;
});

export const storeTrendingReposFunction = functions.pubsub.schedule('every day 02:00').onRun(async (_context) => {
    try {
        await storeTrendingRepos();
    } catch (error) {
        console.error("Error executing storeTrendingReposFunction: ", error);
    }
    return null;
});
