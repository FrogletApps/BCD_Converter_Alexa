/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const mainAPL = require('mainAPL.json');

const LaunchHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(HELP_REPROMPT)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: mainAPL,
          datasources: {
            resource: {
              data: HELP_SCREEN
            }
          }
        })
        .getResponse();
    }
    else {
      return handlerInput.responseBuilder
        .speak(HELP_MESSAGE)
        .reprompt(HELP_REPROMPT)
        .getResponse();
    }
  },
};

const GetNumberHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'NumberInputIntent';
  },
  handle(handlerInput) {
    var numberToConvert = handlerInput.requestEnvelope.request.intent.slots.inputNumber.value;
    //console.log("The input number is: " + handlerInput.requestEnvelope.request.intent.slots.inputNumber.value);
    const inputStore = numberToConvert.toString().split("");
    var resultStore = [];
    var i;
    for (i = 0; i < inputStore.length; i++) {
      var binary = resultStore[i] = parseInt(inputStore[i], 10).toString(2);
      var paddedBinary = binary.padStart(4, 0);
      resultStore[i] = paddedBinary.toString() + " ";
    }
    const output = "The number " + numberToConvert + " is " + resultStore.join("") + "in Binary Coded Decimal";
    const screenOutput = "The number <b>" + numberToConvert + "</b><br> is <b>" + resultStore.join("") + "</b><br>in Binary Coded Decimal";
    const speechOutput = output;

    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(SKILL_NAME, output)
        .addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: mainAPL,
          datasources: {
            resource: {
              data: screenOutput
            }
          }
        })
        .getResponse();
    }
    else {
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(SKILL_NAME, output)
        .getResponse();
    }
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' ||
        request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'BCD Converter';
const HELP_MESSAGE = 'You can ask me to convert a number, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const HELP_SCREEN = 'You can ask me to <br> <b>convert a number </b><br> or you can say <b>exit</b>';
const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchHandler,
    GetNumberHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();