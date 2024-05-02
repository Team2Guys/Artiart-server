const express = require('express')
const app = express()
const router = require('./routes/product')
const usrRouter = require('./routes/users')
const adminRouter = require('./routes/admin')
const connect = require('./helper/helper')
require("dotenv").config();
const cors = require('cors')
const PORT = 3200
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});



app.use(cors({origin: ['https://artiart.vercel.app', 'http://localhost:3000']}));
app.use(cors())

app.use(express.json())



app.use("/api", router)
app.use("/api/users", usrRouter)
app.use("/api/admins", adminRouter)


app.get('/', function (req, res) {
  res.send('Hellow World')
})

connect()
app.listen(PORT, () => {
  console.log('Server is listening at ' + PORT)
})

module.exports = app;