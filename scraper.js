const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  await page.goto('https://urlebird.com/user/aromarestaurantdb/', { waitUntil: 'networkidle' });

  let previousHeight = 0;
  for (let i = 0; i < 15; i++) {
    try {
        const loadMore = await page.$('button:has-text("Load more")');
        if (loadMore) {
            await loadMore.click();
            await page.waitForTimeout(2000);
        }
    } catch(e) {}
    
    await page.evaluate(() => window.scrollBy(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    const currentHeight = await page.evaluate(() => document.body.scrollHeight);
    if (currentHeight === previousHeight) break;
    previousHeight = currentHeight;
  }

  const posts = await page.evaluate(() => {
    const items = [];
    const elements = document.querySelectorAll('.thumb');
    elements.forEach(el => {
      const a = el.querySelector('a');
      const img = el.querySelector('img');
      const info = el.parentElement.querySelector('.info');
      
      if (a && a.href && img) {
        items.push({
          url: a.href,
          cover: img.src,
          title: img.alt || (info ? info.innerText.split('\n')[0] : 'TikTok Video')
        });
      }
    });
    return items;
  });

  console.log(`Found ${posts.length} posts!`);
  
  fs.writeFileSync('tiktok_accurate.json', JSON.stringify(posts, null, 2));
  
  await browser.close();
})();
