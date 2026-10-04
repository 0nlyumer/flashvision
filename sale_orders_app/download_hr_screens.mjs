import fs from 'fs';
import https from 'https';

const screens = [
  {
    name: 'HR_Dashboard_Desktop',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzcyNzEzMTkwYTFiNjQwMDlhYzQxZDA2YjE4NjBhN2QwEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'HR_Dashboard_Mobile',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzA0YjQyNDhlMWFlMDQ1MjliMTM0YjE5ZWRlNDdhOGE2EgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  }
];

if (!fs.existsSync('C:\\Flashvision\\sale_orders_app\\screens_html')) {
  fs.mkdirSync('C:\\Flashvision\\sale_orders_app\\screens_html');
}

let completed = 0;

screens.forEach(screen => {
  const filename = `C:\\Flashvision\\sale_orders_app\\screens_html\\${screen.name}.html`;
  
  https.get(screen.url, (res) => {
    const writeStream = fs.createWriteStream(filename);
    res.pipe(writeStream);
    writeStream.on('finish', () => {
      writeStream.close();
      console.log(`Downloaded ${screen.name}`);
      completed++;
      if (completed === screens.length) {
          console.log("All HR downloads complete!");
      }
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${screen.name}`, err);
  });
});
