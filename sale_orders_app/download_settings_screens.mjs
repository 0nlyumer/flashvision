import fs from 'fs';
import https from 'https';

const screens = [
  {
    name: 'settings_Admin_Setup_1',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY0ZWUwM2NhNzNhNjMwMjI3YmM3Y2E1MjRkMGNiEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'settings_Add_Item_2',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY0ZWUwNDE4ODcwOGMwNWYxM2M2Y2IzMDZjZjM5EgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'settings_Add_Customer_3',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY0ZWUwNDQ3NjYzNGEwNGU3NGEzMGFhMjA3OWE1EgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'settings_Add_Raw_Material_4',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzAwMDY0ZWUwNDhhMTQwMTEwM2IxYWQ1NTE5MDUzZTVhEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'settings_Add_Supplier_5',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VmOWRjZTc2MDkzMTQwZDY4NGM5OWMwODVmN2YwMDQwEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
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
          console.log("All downloads complete!");
      }
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${screen.name}`, err);
  });
});
