import fs from 'fs';
import https from 'https';

const data = JSON.parse(fs.readFileSync('C:\\Users\\Track Computers\\.gemini\\antigravity\\brain\\5f858199-1143-4799-90a2-7078759b925e\\.system_generated\\steps\\12\\output.txt', 'utf8'));

if (!fs.existsSync('C:\\Flashvision\\sale_orders_app\\screens_html')) {
  fs.mkdirSync('C:\\Flashvision\\sale_orders_app\\screens_html');
}

data.screens.forEach(screen => {
  if (screen.htmlCode && screen.htmlCode.downloadUrl) {
    const title = screen.title.replace(/[^a-zA-Z0-9]/g, '_');
    const filename = `C:\\Flashvision\\sale_orders_app\\screens_html\\${title}.html`;
    
    https.get(screen.htmlCode.downloadUrl, (res) => {
      const writeStream = fs.createWriteStream(filename);
      res.pipe(writeStream);
      writeStream.on('finish', () => {
        writeStream.close();
        console.log(`Downloaded ${title}`);
      });
    }).on('error', (err) => {
      console.error(`Error downloading ${title}`, err);
    });
  }
});
