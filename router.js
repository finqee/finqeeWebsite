const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')

router.get('/', userController.home)
router.get('/login', userController.loginGet)
router.get('/register', userController.registerGet)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/logout', userController.logout)



module.exports = router