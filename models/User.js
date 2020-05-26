const usersCollection = require('../db').collection("users")
const validator = require('validator')

let User = function(data) {
    this.data = data
    this.errors = []
}

User.prototype.cleanUp = function() {
    if(typeof(this.data.email) != "string") { this.data.email = ""}
    if(typeof(this.data.password) != "string") { this.data.password = ""}
    if(typeof(this.data.passwordRepeat) != "string") { this.data.passwordRepeat = ""}
    if(typeof(this.data.checkbox) != "string") { this.data.checkbox = ""}
    // remove bogus properties
    this.data = {
        email: this.data.email.trim().toLowerCase(),
        password: this.data.password,
        passwordRepeat: this.data.passwordRepeat,
        checkbox: this.data.checkbox
    }
}

User.prototype.validate = function() {
    if(!validator.isEmail(this.data.email)) { this.errors.push("You must provide valid email.")}
    if(this.data.password == "") { this.errors.push("You must provide password.")}
    if(this.data.passwordRepeat != this.data.password) { this.errors.push("Passwords doesn't match.")}
    if(this.data.password.length > 0 && this.data.password.length < 12) { this.errors.push("Password must be atleast 12 characters.")}
    if(this.data.password.length > 50) { this.errors.push("Password exceeds 50 characters.")}
    if(this.data.checkbox != "true") { this.errors.push("Didn't agree to terms")}
}

User.prototype.register = function() {
    // 1. Validate user data
    this.cleanUp()
    this.validate()
    // 2. Save to database

    if(!this.errors.length) {
        usersCollection.insertOne(this.data)
    }
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({email: this.data.email}).then((attemptedUser) => {
            if(attemptedUser && attemptedUser.password == this.data.password) {
                resolve("Valid info")
            } else {
                reject("Invalid email / password")
            }
        }).catch(function() {
            reject("Something is not working")
        })
    })
}

module.exports = User