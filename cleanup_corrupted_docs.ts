import { adminDb } from "./src/lib/firebase/admin";

async function fixCorruptedDocs() {
  const collections = ["clients", "projects", "tasks", "messages", "updates"];
  
  for (const colName of collections) {
    console.log(`Checking collection: ${colName}...`);
    const snap = await adminDb.collection(colName).get();
    
    for (const doc of snap.docs) {
      const data = doc.data();
      let needsFix = false;
      const updates: any = {};

      // Check for corrupted timestamp fields (saved as empty objects {})
      ["createdAt", "updatedAt", "created_at", "receivedAt"].forEach(field => {
        if (data[field] && typeof data[field] === "object" && Object.keys(data[field]).length === 0) {
          console.log(`  Document ${doc.id} has corrupted ${field}. Deleting...`);
          needsFix = true;
        }
      });

      if (needsFix) {
        // Instead of trying to fix them, let's just delete the corrupted test data
        await doc.ref.delete();
        console.log(`  ✅ Deleted corrupted doc: ${doc.id}`);
      }
    }
  }
  console.log("Cleanup complete.");
  process.exit(0);
}

fixCorruptedDocs().catch(err => {
  console.error(err);
  process.exit(1);
});
