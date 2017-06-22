require('dotenv').config({ silent: true });

var app = require('express')();
var bodyParser = require('body-parser');
var cowsay = require('cowsay');
var parser = require('./parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.listen(process.env.PORT || 3000);

app.post('/', function(req, res) {
  if (req.body.token !== 'hVZjCazmFRpSopBHtE2a5L3S') {
    return res.status(400)
        .send({ text: 'token problem buddy' });
  }

  if (!req.body.text) {
    return res.status(400)
        .send({ text: 'No text provided' });
  }

  if (req.body.text == 'help') {
    var responseText = 'Usage: /moo {text_message} [eyes {eyes_value} [tongue {tongue_value}]]';

    return res.send({
      response_type: 'in_channel',
      text: responseText,
    });
  }

  var eyes = parser.parseArguments(req.body.text, 'eyes');
  var tongue = parser.parseArguments(req.body.text, 'tongue');
  var text = req.body.text.split('\[')[0];

  var responseText = '```' + cowsay.say({ text: text, e: eyes, T: tongue }) + '```';

  return res.send({
    response_type: 'in_channel',
    text: responseText,
  });
});

app.all('*', function(req, res) {
  return res.status(400)
      .send({ text: "Error: Please check your Slash Command's Integration URL" });
});

module.exports = app;
