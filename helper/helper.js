const mognoose = require('mongoose')
require("dotenv").config(); 
mognoose.set("strictQuery", true)
const connect = () => {
    mognoose.connect(process.env.DBURL)
    
        .then(() => console.log('database connected'))
        .catch((err) => console.log(err.message, 'error occured while connecting to mongodb'))
}

module.exports = connect