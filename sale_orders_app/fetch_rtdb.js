import fs from 'fs';

const rtdbUrl = "https://flashvision-erp-default-rtdb.firebaseio.com/.json";

console.log("Fetching RTDB data...");
try {
  const response = await fetch(rtdbUrl);
  const data = await response.json();
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync("rtdb_backup.json", jsonString);
  console.log(`Success! Backup size: ${Buffer.byteLength(jsonString)} bytes.`);
} catch (err) {
  console.error("Error fetching data:", err);
}
