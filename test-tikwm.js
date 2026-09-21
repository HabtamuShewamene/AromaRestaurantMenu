const https = require("https");
const videoUrl = "https://www.tiktok.com/@aromarestaurantdb/video/7683077261192432904";
https.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      if (json.data && json.data.play) {
        console.log("SUCCESS:", json.data.play);
      } else {
        console.log("NO PLAY URL:", json);
      }
    } catch(e) { console.log("ERROR", e); }
  });
});
