

/*
https://www.googleapis.com/calendar/v3/calendars/jp62glh2t94ls18803r79846rs@group.calendar.google.com/events?timeMin=2017-11-24T00:00:00Z&key=AIzaSyA8VtJcQIRsrAzb1bPHZLy5LWCKTKNNKT8
*/

const express = require('express');
const line = require('@line/bot-sdk');
const middleware = require('@line/bot-sdk').middleware
const JSONParseError = require('@line/bot-sdk').JSONParseError
const SignatureValidationFailed = require('@line/bot-sdk').SignatureValidationFailed

const Promise = require("bluebird");
const bodyParser = require('body-parser');


const config = {
  channelAccessToken: 'aDbXoAkHoMIK71zwm1XBEx30x7awNodPpYfXrd/Rwiem9CWLfJz7d/HYylmj37G7JVhhjrtJOa1s448hGe2E2GisiRuuPrPCYWSvYGZSORMdhzdqGR7c8Xq6JVhZkvSyWjUI9+29R6ZsLqL/sXoOoAdB04t89/1O/w1cDnyilFU=',
  channelSecret: '040da0f88b7f70e0728d012ca03d4e3b'
};

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req,res)=>{
	res.send("Hello dude");
})

app.use(middleware(config))
app.post('/webhook', (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then((result) => res.status(200).json(result));
   // res.json(req.body.events) 
});

const client = new line.Client(config);
function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: event.message.text
  });
}
app.use((err, req, res, next) => {
  if (err instanceof SignatureValidationFailed) {
    res.status(401).send(err.signature)
    return
  } else if (err instanceof JSONParseError) {
    res.status(400).send(err.raw)
    return
  }
  next(err) // will throw default 500
})
app.listen(process.env.port || 3000);