import { db } from '../database/firebase.js'; 
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";


async function fetchSummaryFromFirestore() {
    try {
        const commitSummaryCollection = collection(db, 'commit-summary');
        const commitSummaryQuery = query(commitSummaryCollection, orderBy('created_at', 'desc'), limit(1));
        const querySnapshot = await getDocs(commitSummaryQuery);

        if (querySnapshot.empty) {
            console.log("No activities this week.");
            return { summary: "No activities this week.", changed_repos: 0, total_commits: 0 };
        }

        const doc = querySnapshot.docs[0];
        const data = doc.data();
        console.log("✅ @summary.js : Fetch summary from firestore success")
        return data;
    } catch (error) {
        console.error("@summary.js : Failed to fetch commit data from Firestore:", error);
        throw new Error("@summary.js : Failed to fetch commit data from Firestore.");
    }
}



export {fetchSummaryFromFirestore};