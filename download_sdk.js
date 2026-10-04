const fs = require('fs');
const https = require('https');

const url = "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip";
const file = fs.createWriteStream("c:\\Flashvision\\cmdline-tools.zip");

console.log("Starting download of Android Command Line Tools...");
https.get(url, function(response) {
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    https.get(response.headers.location, function(redirectResponse) {
      redirectResponse.pipe(file);
      file.on('finish', function() {
        file.close();
        console.log("SDK Tools Download completed successfully!");
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log("SDK Tools Download completed successfully!");
    });
  }
}).on('error', function(err) {
  fs.unlink("c:\\Flashvision\\cmdline-tools.zip", () => {});
  console.error("Error downloading SDK Tools:", err.message);
});
