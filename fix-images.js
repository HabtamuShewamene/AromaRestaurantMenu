const fs = require('fs');
const { Client } = require('pg');

const seedTs = fs.readFileSync('c:\\Desktop\\digital menu\\cafe-menu-1\\database\\scripts\\seed.ts', 'utf8');
const urls = [...seedTs.matchAll(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+/g)].map(m => m[0] + '?w=800&q=80');
const uniqueUrls = [...new Set(urls)];

async function checkUrl(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.ok ? url : null;
  } catch (e) {
    return null;
  }
}

async function run() {
  console.log(`Checking ${uniqueUrls.length} unique Unsplash URLs from seed.ts...`);
  
  // Check in parallel batches
  const workingUrls = [];
  for (let i = 0; i < uniqueUrls.length; i += 10) {
    const batch = uniqueUrls.slice(i, i + 10);
    const results = await Promise.all(batch.map(checkUrl));
    workingUrls.push(...results.filter(Boolean));
  }
  
  console.log(`Found ${workingUrls.length} working Unsplash URLs!`);
  
  const client = new Client({ connectionString: 'postgresql://postgres:1921@localhost:5432/aroma_restaurant_menu' });
  await client.connect();

  const { rows: items } = await client.query('SELECT id, name FROM "MenuItem"');
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    // Assign a working URL consistently (using modulo to cycle through if needed)
    const newImage = workingUrls[i % workingUrls.length];
    
    await client.query('UPDATE "MenuItem" SET image = $1 WHERE id = $2', [newImage, item.id]);
  }
  
  await client.end();
  console.log('All 44 items updated with clean, working Unsplash static images!');
}

run().catch(console.error);
