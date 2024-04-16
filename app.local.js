const app = require('./index')
const PORT = 3200;


app.listen(PORT, (error) =>{ 
    if(!error) console.info(`listening on http://localhost:${PORT}`)

       else {
           console.log("Error occurred, server can't start", error); 

       }
    } 
)