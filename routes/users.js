const express = require('express')

const usr = require("../controller/usr")
const usrRouter = express.Router()

usrRouter.post('/signup',usr.signup )
usrRouter.post('/login', usr.login)
usrRouter.post('/emailVarify', usr.userHandler)
usrRouter.post('/passwordReset', usr.passwordReset2)


module.exports  = usrRouter