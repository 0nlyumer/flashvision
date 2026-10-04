import fs from 'fs';
import https from 'https';

const url = 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2Q4YzJmMTM2OGJiODRiMzRhNjNiYzZmOWVhMTc4ODdlEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086';
const filename = 'C:\\Flashvision\\sale_orders_app\\screens_html\\Employee_Onboarding_Wizard.html';

if (!fs.existsSync('C:\\Flashvision\\sale_orders_app\\screens_html')) {
  fs.mkdirSync('C:\\Flashvision\\sale_orders_app\\screens_html');
}

console.log("Starting download for Employee Onboarding Wizard...");
https.get(url, (res) => {
  const writeStream = fs.createWriteStream(filename);
  res.pipe(writeStream);
  writeStream.on('finish', () => {
    writeStream.close();
    console.log("Downloaded Employee Onboarding Wizard successfully!");
  });
}).on('error', (err) => {
  console.error("Error downloading Employee Onboarding Wizard", err);
});
