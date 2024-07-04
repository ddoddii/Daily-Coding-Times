import functions from 'firebase-functions';
import admin from 'firebase-admin';
import OpenAI from 'openai';
import {getSummary} from  "./src/summary.js"

admin.initializeApp();
const db = admin.firestore();

const openai = new OpenAI({
    apiKey: functions.config().openai.key,
});

export const scheduledFunction = functions.pubsub.schedule('every day 00:00').onRun(async (_context) => {
    const { weekly_summary, changed_repos, total_commits } = await getSummary(openai);

    const summary = {
        summary: weekly_summary,
        total_commits,
        changed_repos,
        created_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('commit-summary').add(summary);

    console.log("✅ : Weekly GitHub summary updated to firebase successfully");

    return null;
});
