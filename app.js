const express = require('express')
const session = require('express-session')
const flash = require('connect-flash')
const MongoStore = require('connect-mongo')(session)
const app = express()
const csrf = require('csurf')

let sessionOptions = session({
    secret: "This is Secret rip",
    store: new MongoStore({client: require('./db'), dbName: 'Finqee'}),
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 100 * 60 * 60 * 24, httpOnly: true}
})

app.use(sessionOptions)
app.use(flash())

app.use(function(req, res, next) {
    
    // make all error and success flash messages available from all templates
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")
    next()
})

const router = require('./router')

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use("/assets", express.static('assets'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use(csrf())
app.use(function(req, res, next) {
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/', router)

app.use(function(err, req, res, next) {
    console.log(err)
    if(err) {
        if(err.code == "EBADCSRFTOKEN") {
            req.flash('errors', "Cross site request forgery detected.")
            req.session.save(() => res.redirect('/'))
        }
        else {
            res.send("404")
        }
    }
})

module.exports = app