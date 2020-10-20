require("dotenv").config();

const express = require("express");
const cors = require('cors')
const OpenTok = require("opentok");
const app = express();
app.use(cors())

const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

// Verify that the API Key and API Secret are defined
if (!apiKey || !apiSecret) {
  console.log("You must specify API_KEY and API_SECRET environment variables");
  process.exit(1);
}

const opentok = new OpenTok(apiKey, apiSecret);

// Starts the express app
function init() {
  app.listen(3000, function () {
    console.log("You're app is now ready at http://localhost:3000/");
  });
}



// Create a session and store it in the express app
opentok.createSession(function (err, session) {
  if (err) throw err;
  app.set("sessionId", session.sessionId);
  // We will wait on starting the app until this is done
  init();
});

app.get("/", function (req, res) {
  const sessionId = app.get("sessionId");
  // generate a fresh token for this client
  const token = opentok.generateToken(sessionId);

  res.json({
    apiKey: apiKey,
    sessionId: sessionId,
    token: token,
  });
});
