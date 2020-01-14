const express = require("express");
var WebHooks = require('node-webhooks')

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

app.listen(port, () => {
    console.log(`Server is up on port ${port}.`);
})