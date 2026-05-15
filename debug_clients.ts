import { adminDb } from "./src/lib/firebase/admin";

async function debugClients() {
  console.log("Dumping clients...");
  const snap = await adminDb.collection("clients").get();
  
  for (const doc of snap.docs) {
    const data = doc.data();
    console.log(`\nClient ID: ${doc.id}`);
    console.log(`Name: ${data.name}`);
    console.log(`Org ID: ${JSON.stringify(data.organization_id)}`);
    console.log(`Is Deleted: ${JSON.stringify(data.is_deleted)}`);
    console.log(`Created At: ${JSON.stringify(data.created_at)}`);
    
    if (typeof data.organization_id === "object") {
        console.log("  ⚠️ WARNING: organization_id is an object!");
    }
    if (typeof data.is_deleted === "object") {
        console.log("  ⚠️ WARNING: is_deleted is an object!");
    }
  }
  process.exit(0);
}

debugClients().catch(err => {
  console.error(err);
  process.exit(1);
});
