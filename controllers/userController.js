const User = require('../models/User')
const UserPersonal = require('../models/UserPersonal')


exports.mustBeLoggedIn = function(req, res, next) {
    if (req.session.user) {
        next()
    } else {
        req.flash("errors", "You must be logged in to perform that action.")
        req.session.save(function() {
            res.redirect(req.get('referer'))
        })
    }
}

exports.mustBeAdmin = function(req, res, next) {
    if (req.session.user._id == process.env.ADMIN) {
        next()
    } else {
    }
}

exports.havePersonal = function(req, res, next) {
    UserPersonal.find(req.session.user._id).then((document) => {
        if(document.name.length) { next()}
        else {
            req.flash("errors", "You must have personal information set it up to perform that action.")
            req.session.save(function() {
                res.redirect(req.get('referer'))
            })
        }
    })
}

exports.login = function(req, res) {
    let user = new User(req.body)
    user.login().then(function(result) {
        req.session.user = {email: user.data.email, _id: result._id}
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

    user.register().then((id) => {
        req.session.user = {email: user.data.email, _id: id}
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

exports.personal = function(req, res) {
    UserPersonal.find(req.session.user._id).then((document) => {
        res.render('personalInfo', {personal: document})
    }).catch(() => {

    })
    //res.render('personalInfo')
}

exports.personalCreate = function(req, res) {
    let userPersonal = new UserPersonal(req.body, req.session.user._id)
    userPersonal.createOrUpdate().then(() => {
        req.flash("success", "Successfully saved information.")
        req.session.save(() => res.redirect('personal'))        

    }).catch((errors) => {
        errors.forEach((error) => req.flash("errors", error))
        req.session.save(() => res.redirect('personal'))
    })
}