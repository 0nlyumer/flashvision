import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";

const firebaseConfig = {
  apiKey: "AIzaSyBtd8pLGvjBw6sV8Kvz9FeD_Z3K0TbrBJ0",
  authDomain: "flashvision-erp.firebaseapp.com",
  projectId: "flashvision-erp",
  storageBucket: "flashvision-erp.firebasestorage.app",
  appId: "1:292593438126:web:fa63779784dcc1a425cc3f"
};

const rtdbUrl = "https://flashvision-erp-default-rtdb.firebaseio.com/.json";

async function runMigration() {
  console.log("Step 1: Fetching database backup from Realtime Database...");
  try {
    const response = await fetch(rtdbUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch RTDB: ${response.statusText}`);
    }
    const data = await response.json();
    const backupStr = JSON.stringify(data, null, 2);
    fs.writeFileSync("rtdb_backup.json", backupStr);
    console.log(`Successfully backed up Realtime Database (${Buffer.byteLength(backupStr)} bytes) to rtdb_backup.json`);

    if (!data) {
      console.log("No data found in Realtime Database. Migration finished.");
      return;
    }

    console.log("Step 2: Initializing Firestore client...");
    const app = initializeApp(firebaseConfig);
    const fsDb = getFirestore(app);

    // 3. Migrate erp_state
    if (data.erp_state) {
      console.log("Step 3: Migrating erp_state to Firestore erp/state document...");
      
      // Firestore does not allow undefined values. Let's make sure everything is defined or null.
      const sanitizeData = (val) => {
        if (val === undefined) return null;
        if (Array.isArray(val)) return val.map(sanitizeData);
        if (val !== null && typeof val === 'object') {
          const res = {};
          for (const [k, v] of Object.entries(val)) {
            res[k] = sanitizeData(v);
          }
          return res;
        }
        return val;
      };

      const cleanErpState = sanitizeData(data.erp_state);
      await setDoc(doc(fsDb, "erp", "state"), cleanErpState);
      console.log("✓ erp_state successfully migrated!");
    } else {
      console.log("Warning: No erp_state key found in Realtime Database.");
    }

    // 4. Migrate user settings
    if (data.user_settings) {
      console.log("Step 4: Migrating user settings to user_settings collection...");
      for (const [username, platforms] of Object.entries(data.user_settings)) {
        if (platforms && typeof platforms === 'object') {
          for (const [platformKey, settings] of Object.entries(platforms)) {
            if (settings && typeof settings === 'object') {
              const docId = `${username}_${platformKey}`;
              console.log(`Migrating user settings for username=${username}, platform=${platformKey} -> document=${docId}`);
              await setDoc(doc(fsDb, "user_settings", docId), settings);
            }
          }
        }
      }
      console.log("✓ user_settings successfully migrated!");
    } else {
      console.log("No user_settings found in Realtime Database.");
    }

    console.log("Migration complete!");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

runMigration();
