const { Client } = require('pg');

const fixes = [
  { pattern: 'Half & Half',         videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7611931444272745749' },
  { pattern: 'Fine Dining',         videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7608977821326724372' },
  { pattern: 'BBQ Chicken',         videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7607489630065167637' },
  { pattern: 'Mushroom Pasta',      videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7604892319766072597' },
  { pattern: 'Penne Arrabbiata',    videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7637546993417456917' },
  { pattern: 'Cheese & Beef Pizza', videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7680098826102852882' },
  { pattern: 'Double Beef',         videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7682272348325612808' },
  { pattern: 'Crispy Chicken Burger',videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7682441167933426951' },
  { pattern: 'Club Sandwich',       videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7683077261192432904' },
  { pattern: 'Tuna Sandwich',       videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7675430278642355463' },
  { pattern: 'Caesar Salad',        videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7663809034637675784' },
  { pattern: 'Avocado Salad',       videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7682272348325612808' },
  { pattern: 'Whole Fish',          videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7610082802352065813' },
  { pattern: 'Grilled Fish Fillet', videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7615281531614940437' },
  { pattern: 'Iced Coffee',         videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7615281531614940437' },
  { pattern: 'Mango',               videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7617003202952695061' },
  { pattern: 'Caramel Macchiato',   videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7611931444272745749' },
  { pattern: 'Red Velvet',          videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7683077261192432904' },
  { pattern: 'Torta Cake',          videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7685593884763868424' },
  { pattern: 'Chocolate Opera',     videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7675430278642355463' },
  { pattern: 'Tiramisu',            videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7682441167933426951' },
  { pattern: 'Fruit Tart',          videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7680098826102852882' },
  { pattern: 'Breakfast Platter',   videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7673437281029606663' },
  { pattern: 'Garlic Bread Breakfast', videoUrl: 'https://www.tiktok.com/@aromarestaurantdb/video/7671148241798302984' }
];

async function run() {
  const client = new Client({ connectionString: 'postgresql://postgres:1921@localhost:5432/aroma_restaurant_menu' });
  await client.connect();

  const { rows } = await client.query('SELECT id, name, image, "videoUrl" FROM "MenuItem"');
  
  for (const item of rows) {
    let newVideoUrl = item.videoUrl;
    
    // Fix videoUrl from the manual fixes list
    const fix = fixes.find(f => item.name.includes(f.pattern));
    if (fix) {
      newVideoUrl = fix.videoUrl;
    }
    
    // If image is an unsplash URL, try to fetch the real cover from tikwm
    if (item.image && item.image.includes('unsplash.com') && newVideoUrl && newVideoUrl.includes('tiktok.com/')) {
      try {
        const apiUrl = `https://www.tikwm.com/api/?url=${encodeURIComponent(newVideoUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();
        
        if (data && data.data && data.data.cover) {
          const coverUrl = data.data.cover;
          await client.query('UPDATE "MenuItem" SET image = $1, "videoUrl" = $2 WHERE id = $3', [coverUrl, newVideoUrl, item.id]);
          console.log(`Updated ${item.name}: image -> ${coverUrl}, video -> ${newVideoUrl}`);
        } else {
          // If no cover, just update videoUrl
          await client.query('UPDATE "MenuItem" SET "videoUrl" = $1 WHERE id = $2', [newVideoUrl, item.id]);
          console.log(`Updated ${item.name}: video -> ${newVideoUrl} (no cover found)`);
        }
      } catch (e) {
        console.error(`Failed to fetch cover for ${item.name}:`, e.message);
      }
    } else {
      // Just update the video URL if changed
      if (newVideoUrl !== item.videoUrl) {
         await client.query('UPDATE "MenuItem" SET "videoUrl" = $1 WHERE id = $2', [newVideoUrl, item.id]);
         console.log(`Updated ${item.name}: video -> ${newVideoUrl}`);
      }
    }
  }
  
  await client.end();
  console.log('Done!');
}

run().catch(console.error);
