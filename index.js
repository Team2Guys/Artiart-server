const express = require('express')
const app = express()
const router = require('./routes/product')
const connect = require('./helper/helper')
require("dotenv").config();
app.use(express.json());
const cors = require('cors')


app.use("/api", router)


app.get('/', function (req, res) {
  res.send('Hello World')
})


app.use(cors())


connect();

module.exports = app
