const fs = require('fs');
const https = require('https');

const url = "https://api.adoptium.net/v3/binary/latest/21/ga/windows/x64/jdk/hotspot/normal/eclipse?project=jdk";
const file = fs.createWriteStream("c:\\Flashvision\\jdk21.zip");

console.log("Starting download of JDK 21...");
https.get(url, function(response) {
  if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
    https.get(response.headers.location, function(redirectResponse) {
      redirectResponse.pipe(file);
      file.on('finish', function() {
        file.close();
        console.log("JDK 21 Download completed successfully!");
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log("JDK 21 Download completed successfully!");
    });
  }
}).on('error', function(err) {
  fs.unlink("c:\\Flashvision\\jdk21.zip", () => {});
  console.error("Error downloading JDK 21:", err.message);
});
