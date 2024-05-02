const express = require('express')

const admin = require("../controller/admin");
const {authenticate} = require('../middleware/authhandler')
const adminRouter = express.Router()

adminRouter.post('/createAdmin',authenticate,admin.adminhanlder )
adminRouter.delete('/deletAdmin/:id',authenticate,admin.DeleteAdminHandler )
adminRouter.put('/editAdmin/:id',authenticate,admin.editAdminHandler )
adminRouter.get('/getAllAdmins',authenticate,admin.getAlladminsHandler)
adminRouter.post('/adminLogin',admin.adminLoginhandler)
adminRouter.post('/superAdminLogin',admin.superAdminLoginhandler)

module.exports  = adminRouter