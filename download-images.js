const fs = require('fs');
const https = require('https');

const urls = [
  "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/f3b52e86790943639dffb520831d1021~tplv-photomode-image.jpeg?dr=9616&x-expires=1790251200&x-signature=YpN1LybR%2BWfq2MgZqnz4otzNmm0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast8&ftpl=1",
  "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/75bb212c40324a06b0e150455195d19c~tplv-photomode-image.jpeg?dr=9616&x-expires=1790251200&x-signature=zj%2FB8lhtNfxLWZdmP72MWbUV8EI%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast8&ftpl=1",
  "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/b349b9e084554736affd83166d3fe500~tplv-photomode-image.jpeg?dr=9616&x-expires=1790251200&x-signature=nQo8JtEfh1V65A4pozbbbJ0M2YM%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast8&ftpl=1",
  "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/54aa891f09134b38aca19f9dfdaa88c0~tplv-photomode-image.jpeg?dr=9616&x-expires=1790251200&x-signature=6ddAUfk32uksB0t66WNYRD%2BaGAc%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast8&ftpl=1",
  "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/3068d9625c35484b89f3c9770a7dcb04~tplv-photomode-image.jpeg?dr=9616&x-expires=1790251200&x-signature=%2FvpEF%2FKYjeCZkt7ao1zzB0DU5ss%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast8&ftpl=1",
  "https://p16-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/e8362656554f4644a45daa4853d96212~tplv-photomode-image.jpeg?dr=9616&x-expires=1790251200&x-signature=EdYdG64C6sz6420o0aE3XxQIH6Q%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast8&ftpl=1",
  "https://p19-common-sign.tiktokcdn-us.com/tos-alisg-i-photomode-sg/d3a909626ef24a2aa35d816b7c34fcd0~tplv-photomode-image.jpeg?dr=9616&x-expires=1790251200&x-signature=ELCfoodWNff2suynWsGcEODnMQ0%3D&t=4d5b0474&ps=13740610&shp=81f88b70&shcp=9b759fb9&idc=useast8&ftpl=1"
];

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

(async () => {
  for (let i = 0; i < urls.length; i++) {
    console.log(`Downloading ${i}...`);
    // Download to both directories to be safe and perfectly synced!
    await download(urls[i], `c:/Desktop/Aroma menu/AromaRestaurantMenu/public/slider-${i}.jpeg`);
    await download(urls[i], `c:/Desktop/digital menu/cafe-menu-1/public/slider-${i}.jpeg`);
  }
  console.log('Done!');
})();
