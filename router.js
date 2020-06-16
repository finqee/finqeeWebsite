const express = require('express')
const router = express.Router()
const userController = require('./controllers/userController')
const postController = require('./controllers/postController')
const contactController = require('./controllers/contactController')

// user related routes
router.get('/', userController.home)
router.get('/login', userController.loginGet)
router.get('/register', userController.registerGet)
router.post('/login', userController.login)
router.post('/register', userController.register)
router.post('/logout', userController.logout)
router.get('/personal', userController.mustBeLoggedIn, userController.personal)
router.post('/personal', userController.mustBeLoggedIn, userController.personalCreate)


// post related routes
router.get('/forum', userController.mustBeLoggedIn, postController.forum)
router.get('/topic', userController.mustBeLoggedIn, postController.viewCreateTopic)
router.post('/create-topic', userController.mustBeLoggedIn, userController.havePersonal, postController.createTopicPost)
router.get('/topic/:id', userController.mustBeLoggedIn, postController.viewTopic)
router.post('/topic/:id', userController.mustBeLoggedIn, userController.havePersonal, postController.postCreate)

// contact related routes
router.get('/contact', userController.mustBeLoggedIn, userController.mustBeAdmin, contactController.viewContacts)
router.post('/contact', contactController.createContact)


module.exports = router