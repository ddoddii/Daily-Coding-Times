import { db } from '../database/firebase.js'; 
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";

async function fetchTrendingFromFireStore() {
    try {
        const repoCollection = collection(db, 'github-trend');
        const repoQuery = query(repoCollection, orderBy("date", "desc"), limit(10));
        const querySnapshot = await getDocs(repoQuery);

        const repos = [];
        querySnapshot.forEach(doc => {
            repos.push(doc.data());
        });
        
        console.log("✅ @src/trend.js : Fetch trening from firestore success")
        return repos;
    } catch (error) {
        console.error("@src/trend.js : Failed to fetch trend data from Firestore:", error);
        throw new Error("@src/trend.js : Failed to fetch trend data from Firestore.");
    }
}

export {fetchTrendingFromFireStore};