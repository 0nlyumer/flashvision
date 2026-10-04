import fs from 'fs';
import https from 'https';

const screens = [
  {
    name: 'Stock_Demand',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2U3NjViYjYyYzlkNzQ2MDhiNDliOGRlNzE4YWE4ODVhEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'Stock_Demand_History',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2QzMDUxN2U3NTFiZjQ5YTk4NGY2ZmQ4ZDA3MDUxNGFlEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'Stock_Transfer',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzMwNGIyZGQ1MWIwYzQ5NWNiYWY1MjQ5NzlmNzc3Y2M0EgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'Stock_Transfer_History',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2VjNGRhYzIwMDZlZDRkMjVhY2ZkNWEwMDZkODE1ZTBlEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'Stock_Receiving',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sX2M2OTNhODUyMWQ0MjQxYjNiMWQxNDZlODFkMTE2MjEzEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
  },
  {
    name: 'Stock_Receiving_History',
    url: 'https://contribution.usercontent.google.com/download?c=CgthaWRhX2NvZGVmeBJ8Eh1hcHBfY29tcGFuaW9uX2dlbmVyYXRlZF9maWxlcxpbCiVodG1sXzg0MDhkMGI4YzUxYTQzMGNhNGMxM2JhM2U0OGJmNGZkEgsSBxD9mJeXqhsYAZIBJAoKcHJvamVjdF9pZBIWQhQxNjA3MzA0NDM3NzEwODMyMDE4Ng&filename=&opi=89354086'
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
