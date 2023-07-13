const express= require('express')
const router= express.Router()
const userController= require('../controllers/userController')

router.post('/register',userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/admin', userController.auth)


module.exports= router