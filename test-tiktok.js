const https = require("https");
const url = "https://www.tiktok.com/@aromarestaurantdb/video/7683077261192432904";

https.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html"
  }
}, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    // Look for __UNIVERSAL_DATA_FOR_REHYDRATION__
    const match = data.match(/<script id="__UNIVERSAL_DATA_FOR_REHYDRATION__".*?>(\{.*?\})<\/script>/);
    if (match) {
      try {
        const json = JSON.parse(match[1]);
        const defaultScope = json.__DEFAULT_SCOPE__;
        const videoDetail = defaultScope['webapp.video-detail'];
        const itemInfo = videoDetail.itemInfo.itemStruct;
        console.log("Play Addr:", itemInfo.video.playAddr);
        console.log("Download Addr:", itemInfo.video.downloadAddr);
      } catch (e) {
        console.log("Failed to parse JSON");
      }
    } else {
      console.log("Could not find rehydration data");
    }
  });
});
