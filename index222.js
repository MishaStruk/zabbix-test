const express = require('express');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
app = express();
let alexaVerifier = require('alexa-verifier');
var isFisrtTime = true;
const SKILL_NAME = 'Zabbix-server-self';
const GET_HERO_MESSAGE = "Here's your hero: ";
const HELP_MESSAGE = 'You can say please fetch me a hero, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Enjoy the day...Goodbye!';
const MORE_MESSAGE = 'Do you want more?'
const PAUSE = '<break time="0.3s" />'
const WHISPER = '<amazon:effect name="whispered"/>'

const data = [
  'Aladdin  ',
  'Cindrella ',
  'Bambi',
  'Bella ',
  'Bolt ',
  'Donald Duck',
  'Genie ',
  'Goofy',
  'Mickey Mouse',
];

app.use(bodyParser.json({
  verify: function getRawBody(req, res, buf) {
    req.rawBody = buf.toString();
  }
}));

function requestVerifier(req, res, next) {
  alexaVerifier(
    req.headers.signaturecertchainurl,
    req.headers.signature,
    req.rawBody,
    function verificationCallback(err) {
      if (err) {
        res.status(401).json({
          message: 'Verification Failure',
          error: err
        });
      } else {
        next();
      }
    }
  );
}

function log() {
  if (true) {
    console.log.apply(console, arguments);
  }
}

app.post('/', requestVerifier, function(req, res) {
    console.log(req)
    console.log("##################################")
    console.log(req.body)
    res.json(getResponse());

});

function handleDataMissing() {
  return buildResponse(MISSING_DETAILS, true, null)
}

function stopAndExit() {

  const speechOutput = STOP_MESSAGE
  var jsonObj = buildResponse(speechOutput, true, "");
  return jsonObj;
}

function help() {

  const speechOutput = HELP_MESSAGE
  const reprompt = HELP_REPROMPT
  var jsonObj = buildResponseWithRepromt(speechOutput, false, "", reprompt);

  return jsonObj;
}

function getResponse() {

  var welcomeSpeechOutput = 'Welcome to My text <break time="0.3s" />'
  if (!isFisrtTime) {
    welcomeSpeechOutput = '';
  }


  return buildResponseWithRepromt(welcomeSpeechOutput, false, "cardText", "repromt");

}

function buildResponse(speechText, shouldEndSession, cardText) {

  const speechOutput = "<speak>" + speechText + "</speak>"
  var jsonObj = {
    "version": "1.0",
    "response": {
      "shouldEndSession": shouldEndSession,
      "outputSpeech": {
        "type": "SSML",
        "ssml": speechOutput
      },
      "card": {
        "type": "Simple",
        "title": SKILL_NAME,
        "content": cardText,
        "text": cardText
      }
    }
  }
  return jsonObj
}

function buildResponseWithRepromt(speechText, shouldEndSession, cardText, reprompt) {

  const speechOutput = "<speak>" + speechText + "</speak>"
  var jsonObj = {
     "version": "1.0",
     "response": {
      "shouldEndSession": shouldEndSession,
       "outputSpeech": {
         "type": "SSML",
         "ssml": speechOutput
       },
     "card": {
       "type": "Simple",
       "title": SKILL_NAME,
       "content": cardText,
       "text": cardText
     },
     "reprompt": {
       "outputSpeech": {
         "type": "PlainText",
         "text": reprompt,
         "ssml": reprompt
       }
     }
   }
 }
  return jsonObj
}

app.listen(port);

console.log('Alexa list RESTful API server started on: ' + port);