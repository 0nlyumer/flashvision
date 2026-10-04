import fs from 'fs';
import https from 'https';

const screens = [
  {
    name: 'Advanced_Attendance_Management_Desktop',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2EyNTA3YWQyOTViNTQyZDliNDYyYjYzZGYxZmMyNmUwEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'Attendance_Management_Mobile',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzU5MTFiM2QxZGMzYzQ5NjI4NTA2MTNhNDExZDE2MGJmEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
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
          console.log("Attendance downloads complete!");
      }
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${screen.name}`, err);
  });
});
