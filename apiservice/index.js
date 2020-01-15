/* require("dotenv").config(); */

const fs = require('fs');
const express = require("express");
var WebHooks = require('node-webhooks');
const ngrok = require("ngrok");

var webHooks = new WebHooks({
  db: './webHooks.json', // json file that store webhook URLs
  httpSuccessCodes: [200, 201, 202, 203, 204], //optional success http status codes
})

var emitter = webHooks.getEmitter()

emitter.on('*.success', function (shortname, statusCode, body) {
console.log('Success on trigger webHook' + shortname + 'with status code', statusCode, 'and body', body)
})

emitter.on('*.failure', function (shortname, statusCode, body) {
console.error('Error on trigger webHook' + shortname + 'with status code', statusCode, 'and body', body)
})

const app = express();
const port = process.env.PORT || 6969;

app.use(express.json());

// Trigger an existing webhook
app.post('/api/webhook/trigger/:name', (req, res) => {
  const name = req.params.name;
  const data = req.body;

  webHooks.trigger(name, data);
  res.send({dada: "ok"});
})

// Add a new url to a existing webhook
app.post('/api/webhook/add/:name', (req, res) => {
  const name = req.params.name;
  const url = req.body.url;

  // sync instantation - add a new webhook called 'shortname1'
  webHooks.add(name, url).then(function(){
      res.status(201).send(url)
  }).catch(function(err){
      console.log(err)
  });
});

// Fetch all the webhooks
app.get('/api/webhook/get', async (req, res) => {
  const whBuffer = fs.readFileSync('./webHooks.json');
  const whJSON = whBuffer.toString();
  const whData = JSON.parse(whJSON);

  res.status(200).send(whData);
});

(async function() {
  const url = await ngrok.connect(6969);

  console.log("Tunnel Created -> ", url);
  console.log("Tunnel Inspector ->  http://127.0.0.1:4040");
})();

const server = app.listen(6969, () => {
  console.log("Express listening at ", server.address().port);
});