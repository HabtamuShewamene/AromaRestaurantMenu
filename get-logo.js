const https = require("https");
const url = "https://www.tikwm.com/api/user/info?unique_id=aromarestaurantdb";

https.get(url, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    try {
      const json = JSON.parse(data);
      if (json && json.data && json.data.user) {
        console.log("LOGO_URL:", json.data.user.avatarLarger || json.data.user.avatarMedium);
      } else {
        console.log("Could not find user data", data);
      }
    } catch(e) { console.log("ERROR", e); }
  });
});
