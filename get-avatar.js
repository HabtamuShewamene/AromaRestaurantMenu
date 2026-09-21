const https = require("https");
const url = "https://www.tiktok.com/@aromarestaurantdb";

https.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html"
  }
}, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    const match = data.match(/"avatarLarger":"(https:\/\/[^"]+)"/);
    if (match) {
      console.log("LOGO_URL:", match[1].replace(/\\u002F/g, "/"));
    } else {
      console.log("Could not find avatar in HTML");
    }
  });
});
