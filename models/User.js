const bcrypt = require('bcryptjs')
const usersCollection = require('../db').db('Finqee').collection("users")
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

User.prototype.removeBogus = function() {
    this.data = {
        email: this.data.email,
        password: this.data.password
    }
}

User.prototype.validate = function() {
    return new Promise(async (resolve, reject) => {
        if(!validator.isEmail(this.data.email)) { this.errors.push("You must provide valid email.")}
        if(this.data.password == "") { this.errors.push("You must provide password.")}
        if(this.data.passwordRepeat != this.data.password) { this.errors.push("Passwords doesn't match.")}
        if(this.data.password.length > 0 && this.data.password.length < 12) { this.errors.push("Password must be atleast 12 characters.")}
        if(this.data.password.length > 50) { this.errors.push("Password exceeds 50 characters.")}
        if(this.data.checkbox != "true") { this.errors.push("Didn't agree to terms")}
    
        // Only if email is valid then check to see if its already taken
        if(validator.isEmail(this.data.email)) {
            let emailExists = await usersCollection.findOne({email: this.data.email})
            if(emailExists) {
                this.errors.push("This email already in use.")
            }
        }
        resolve()
    })
}
User.prototype.register = function() {
    return new Promise(async (resolve, reject) => {
        // 1. Validate user data
        this.cleanUp()
        await this.validate()
        // 2. Save to database
    
        if(!this.errors.length) {
            let salt = bcrypt.genSaltSync(10)
            this.removeBogus()
            this.data.password = bcrypt.hashSync(this.data.password, salt)
            await usersCollection.insertOne(this.data)
            resolve()
        } else {
            reject(this.errors)
        }
    })
}

User.prototype.login = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        usersCollection.findOne({email: this.data.email}).then((attemptedUser) => {
            if(attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
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