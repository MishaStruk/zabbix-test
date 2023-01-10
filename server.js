const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const Alexa = require('ask-sdk-core');
const app = express();
const skillBuilder = Alexa.SkillBuilders.custom();

var PORT = process.env.port || 8080;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Hello World - Your skill has launched';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

skillBuilder.addRequestHandlers(
    LaunchRequestHandler
)

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, false, false);

app.post('/', adapter.getRequestHandlers());
app.get('/health', (req, res) => {
    res.status(200).send('Ok');
  });

app.listen(PORT);
console.log('Alexa list RESTful API server started on: ' + PORT + "Health check included");