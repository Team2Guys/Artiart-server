const express = require('express')
const app = express()
const router = require('./router/router')
const connect = require('./helper/helper')
const PORT = 3200;


app.use(express.json()); 
app.use("/api", router)

app.get('/', function (req, res) {
  res.send('Hello World')
})


connect();
app.listen(PORT, (error) =>{ 
    if(!error) console.log("Server is Successfully Running,and App is listening on port "+ PORT);
       else {
           console.log("Error occurred, server can't start", error); 

       }
    } 
)