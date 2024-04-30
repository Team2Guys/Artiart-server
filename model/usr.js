const mongoose = require('mongoose')



const schema   = mongoose.Schema
const usersSchema = new schema ({
firstName:{
    type: String,
    require: true
},
lastName:{
    type: String,
    require: true
},
email:{
    type: String,
    require: true
},
password:{
    type: String,
    require: true
},

})



const users = mongoose.model("users",usersSchema)


module.exports = {users}