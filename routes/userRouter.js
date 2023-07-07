const express= require('express')
const router= express.Router()
const userController= require('../controllers/userController')
const model= require('../models/User')


router.post('/register',userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/model', model)

module.exports= router