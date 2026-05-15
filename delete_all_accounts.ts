import { adminAuth, adminDb } from "./src/lib/firebase/admin";

async function deleteAllAccounts() {
  try {
    console.log("Starting deletion process...");

    // 1. Delete all Firebase Auth users
    let pageToken: string | undefined = undefined;
    let authUserCount = 0;
    
    do {
      const listUsersResult: any = await adminAuth.listUsers(1000, pageToken);
      const uids = listUsersResult.users.map((userRecord: any) => userRecord.uid);
      
      if (uids.length > 0) {
        await adminAuth.deleteUsers(uids);
        authUserCount += uids.length;
        console.log(`Deleted ${uids.length} Auth users in this batch.`);
      }
      
      pageToken = listUsersResult.pageToken;
    } while (pageToken);

    console.log(`Successfully deleted ${authUserCount} Firebase Auth accounts.`);

    // 2. Delete all documents in the 'users' Firestore collection
    const usersSnapshot = await adminDb.collection("users").get();
    const batch = adminDb.batch();
    
    usersSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    if (usersSnapshot.size > 0) {
      await batch.commit();
    }
    
    console.log(`Successfully deleted ${usersSnapshot.size} documents from 'users' Firestore collection.`);

    console.log("Deletion complete.");
    process.exit(0);
  } catch (error) {
    console.error("Error deleting accounts:", error);
    process.exit(1);
  }
}

deleteAllAccounts();
