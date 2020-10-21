const express = require('express')
const OpenTok = require('opentok')
require("dotenv").config();


const app = express()


const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;
const opentok = new OpenTok(apiKey, apiSecret)

app.listen(8080,() => console.log("You're app is now ready at http://localhost:8080/"));