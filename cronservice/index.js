const request = require("request");

console.log("Running the task every minute");

request(
  {
    url: "http://apiservice:6969/api/webhook/trigger/addPost",
    method: "POST",
    headers: { "Content-Type": "application/json" },
    json: true,
    body: { dadalife: "born to rage" },
    time: true
  },
  function(err, res, body) {
    if (!err && res.statusCode == 200) {
      console.log("done");
    }
    console.log("error");
  }
);

