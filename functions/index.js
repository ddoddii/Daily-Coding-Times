import functions from 'firebase-functions';
import admin from 'firebase-admin';
import OpenAI from 'openai';
import {getSummary} from  "./src/summary.js"

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAI({
    apiKey: functions.config().openai.key,
});

export const scheduledFunction = functions.pubsub.schedule('every day 01:48').onRun(async (_context) => {
    try {
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
        console.log("✅ : Weekly GitHub summary updated to firebase successfully");
    } catch (error) {
        console.error("Error executing function : ", error);
    }
    
    return null;
});
