const express = require('express')
const app = express()
const router = require('./router/router')
const connect = require('./helper/helper')
require("dotenv").config(); 


app.use(express.json()); 



app.use("/api", router)

app.get('/', function (req, res) {
  res.send('Hello World')
})


connect();

module.exports = app
