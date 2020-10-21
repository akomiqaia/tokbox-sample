const express = require("express");
const OpenTok = require("opentok");
require("dotenv").config();

const app = express();

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const opentok = new OpenTok(apiKey, apiSecret);

app.listen(8080, () =>
  console.log("You're app is now ready at http://localhost:8080/")
);

app.get("/startBroadcast", (req, res) => {
    const sessionId = "1_MX40Njk1ODk0NH5-MTYwMzI3ODUxMTczMH5ISk1ZblIzNWFvUWs4dUhlVk5ZWmJ0K1Z-fg"
    const broadcastOptions = {
        outputs: {
            rtmp: [{
                id: 'Facebook',
                serverUrl: 'rtmps://live-api-s.facebook.com:443/rtmp/',
                streamName:'3367374923357613?s_bl=1&s_ps=1&s_psm=1&s_sw=0&s_vt=api-s&a=Abywnh84-uzFMe15',
            }]
        },
        maxDuration: 100
    }
  opentok.startBroadcast(sessionId, broadcastOptions, (error, broadcast) => {
    if (error) {
      console.log("there was an error starting the braodcast", error);
      res.status(500).send("there was an error");
    } else {
      app.set("broadcastId", broadcast.id);
      console.log("Broadcast object from startBroadcast", broadcast);
      res.json(broadcast);
    }
  });
});

app.get("/stopBroadcast", (req, res) => {
    const broadcastId = app.get('broadcastId')
    opentok.stopBroadcast(broadcastId, (error, broadcast) => {
        if (error) {
            console.log("there was an error stoping broadcasting", error)
        } else {
            app.set('broadcastId', null)
            res.json(broadcast)
        }
    })
});
