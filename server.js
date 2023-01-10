const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const Alexa = require('ask-sdk-core');
const app = express();
const skillBuilder = Alexa.SkillBuilders.custom();

var PORT = process.env.port || 8080;

// const LaunchRequestHandler = {
//     canHandle(handlerInput) {
//         return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
//     },
//     handle(handlerInput) {
//         const speechText = 'Hello World - Your skill has launched';
//         consolg.log("Got here ")
//         console.log(handlerInput.requestEnvelope);
//         return handlerInput.responseBuilder
//             .speak(speechText)
//             .reprompt(speechText)
//             .withSimpleCard('Hello World', speechText)
//             .getResponse();
//     }
// };
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

skillBuilder.addRequestHandlers(
    IntentReflectorHandler
)

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, false, false);

app.post('/', adapter.getRequestHandlers());
app.get('/health', (req, res) => {
    res.status(200).send('Ok');
  });

app.listen(PORT);
console.log('Alexa list RESTful API server started on: ' + PORT + "Health check included");