const express = require('express')
const app = express()
const router = require('./routes/product')
const connect = require('./helper/helper')
require("dotenv").config();
const cors = require('cors')
PORT=3200


app.use(express.json())
app.use(cors())

app.use("/api", router)


app.get('/', function (req, res) {
  res.send('Hellow World')
})




connect();


connect()
app.listen(PORT,()=>{
    console.log('Server is listening at ' + PORT)
})

module.exports = app;