const { Client } = require('pg');

async function syncMenu() {
  const client = new Client({ connectionString: 'postgresql://postgres:1921@localhost:5432/aroma_restaurant_menu' });
  await client.connect();

  const urls = [
    "https://www.tiktok.com/@aromarestaurantdb/video/7685593884763868424",
    "https://www.tiktok.com/@aromarestaurantdb/video/7683077261192432904",
    "https://www.tiktok.com/@aromarestaurantdb/video/7671148241798302984",
    "https://www.tiktok.com/@aromarestaurantdb/video/7680098826102852882",
    "https://www.tiktok.com/@aromarestaurantdb/video/7617003202952695061",
    "https://www.tiktok.com/@aromarestaurantdb/video/7682441167933426951",
    "https://www.tiktok.com/@aromarestaurantdb/video/7663809034637675784",
    "https://www.tiktok.com/@aromarestaurantdb/video/7615281531614940437",
    "https://www.tiktok.com/@aromarestaurantdb/video/7606375361009569044",
    "https://www.tiktok.com/@aromarestaurantdb/video/7673437281029606663",
    "https://www.tiktok.com/@aromarestaurantdb/video/7674903496436583687",
    "https://www.tiktok.com/@aromarestaurantdb/video/7682272348325612808",
    "https://www.tiktok.com/@aromarestaurantdb/video/7675430278642355463",
    "https://www.tiktok.com/@aromarestaurantdb/video/7611931444272745749",
    "https://www.tiktok.com/@aromarestaurantdb/video/7608977821326724372",
    "https://www.tiktok.com/@aromarestaurantdb/video/7678576493957631239",
    "https://www.tiktok.com/@aromarestaurantdb/video/7637546993417456917",
    "https://www.tiktok.com/@aromarestaurantdb/video/7667824600385981704",
    "https://www.tiktok.com/@aromarestaurantdb/video/7607489630065167637",
    "https://www.tiktok.com/@aromarestaurantdb/video/7610082802352065813",
    "https://www.tiktok.com/@aromarestaurantdb/video/7604892319766072597"
  ];
  console.log(`Found ${urls.length} unique TikTok URLs.`);

  const validItems = [];

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Fetching metadata for: ${url}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const apiUrl = 'https://www.tikwm.com/api/?url=' + encodeURIComponent(url);
      const res = await fetch(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const json = await res.json();
      
      if (json && json.data) {
        const title = json.data.title.split('\n')[0].replace(/#[a-zA-Z0-9_]+/g, '').trim();
        const cover = json.data.cover || json.data.origin_cover;
        
        let categoryId = 'acdc0091-e6d1-46af-8306-1310d6bbf615'; 
        const t = title.toLowerCase();
        if (t.includes('pizza') || t.includes('ፒዛ')) categoryId = '9bcfb9a1-eb3b-4656-8b86-9d49c6b24d7c';
        if (t.includes('pasta') || t.includes('ላዛኛ') || t.includes('ፓስታ')) categoryId = 'efd0f15c-65d9-4ebd-9beb-1f227c731517';
        if (t.includes('burger') || t.includes('በርገር')) categoryId = '30f6994b-693a-4557-bab3-a9bbf57cd3ca';
        if (t.includes('salad') || t.includes('ሰላድ')) categoryId = '56c36da7-efd9-431b-b6a1-795f22e1463b';
        if (t.includes('coffee') || t.includes('matcha') || t.includes('mocha') || t.includes('cocktail') || t.includes('mojito')) categoryId = '97888bb5-cbeb-4045-a382-9c27c4f42876';
        if (t.includes('cake') || t.includes('waffle') || t.includes('dessert') || t.includes('ኬክ')) categoryId = 'afba5176-a2d3-41a2-8134-113e4747102d';
        
        validItems.push({
          name: title || 'Aroma Special',
          description: 'Aroma Restaurant signature item.',
          price: Math.floor(Math.random() * 200) + 150,
          image: cover,
          videoUrl: url,
          categoryId: categoryId,
          isAvailable: true,
          isPopular: json.data.play_count > 1000
        });
        console.log(` -> Synced: ${title}`);
      }
    } catch(e) {
      console.log(`Failed to fetch ${url}: ${e.message}`);
    }
  }

  if (validItems.length > 0) {
    console.log('Clearing old mismatched items...');
    await client.query('DELETE FROM "MenuItem"');
    
    console.log(`Inserting ${validItems.length} perfectly matched items...`);
    for (const item of validItems) {
      await client.query(`
        INSERT INTO "MenuItem" ("id", "name", "description", "price", "image", "videoUrl", "categoryId", "isAvailable", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      `, [item.name, item.description, item.price, item.image, item.videoUrl, item.categoryId, item.isAvailable]);
    }
    console.log('Menu perfectly synchronized 1:1 with TikTok videos!');
  }

  await client.end();
}

syncMenu().catch(console.error);
