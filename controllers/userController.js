const User = require('../models/User')

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(result) {
        req.session.user = {email: user.data.email}
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch(function(err) {
        req.flash('errors', err)
        req.session.save(function() {
            res.redirect('/login')
        })
    })
}

exports.loginGet = function(req, res) {
    res.render('login', {errors: req.flash('errors')})
}

exports.register = function(req, res) {
    let user = new User(req.body)

    user.register().then(() => {
        req.session.user = {email: user.data.email}
        req.session.save(function() {
            res.redirect('/')
        })
    }).catch((regErrors) => {
        regErrors.forEach(function(error) {
            req.flash('regErrors', error)
        })
        req.session.save(function() {
            res.redirect('/register')
        })
    })
}

exports.registerGet = function(req, res) {
    res.render('register', {regErrors: req.flash('regErrors')})
}

exports.logout = function(req, res) {
    req.session.destroy(function() {
        res.redirect('/')
    })
    
}

exports.home = function(req, res) {
    if(req.session.user) {
        res.render("home")
    } else {
        res.render('index')
    }
}