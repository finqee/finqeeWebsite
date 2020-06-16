const usersPersonalCollection = require('../db').db('Finqee').collection("usersPersonal")
const validator = require('validator')

let UserPersonal = function(data, userId) {
    this.data = data
    this.errors = []
    this.data.userId = userId

}

UserPersonal.prototype.cleanUp = function() {
    if(typeof(this.data.name) != "string") { this.data.name = ""}
    if(typeof(this.data.surname) != "string") { this.data.surname = ""}
    if(typeof(this.data.date) != "string") { this.data.date = ""}
    if(typeof(this.data.ID) != "string") { this.data.ID = ""}
    if(typeof(this.data.degree) != "string") { this.data.degree = ""}
    if(typeof(this.data.course) != "string") { this.data.course = ""}
    if(typeof(this.data.number) != "string") { this.data.number = ""}

    this.data = {
        name: this.data.name.trim(),
        surname: this.data.surname.trim(),
        date: this.data.date.trim(),
        ID: this.data.ID.trim(),
        degree: this.data.degree.trim(),
        course: this.data.course.trim(),
        number: this.data.number.trim(),
        userId: this.data.userId
    }
}

UserPersonal.prototype.validate = function() {
    if(this.data.name == "") {this.errors.push("You must provide your name.")}
    if(this.data.surname == "") {this.errors.push("You must provide your surname.")}
    if(this.data.date == "") {this.errors.push("You must provide your birth date.")}
    if(this.data.ID == "") {this.errors.push("You must provide your ID.")}
    if(this.data.degree == "") {this.errors.push("You must provide your academic degree.")}
    if(this.data.course == "") {this.errors.push("You must provide your course of study.")}
    if(this.data.number == "") {this.errors.push("You must provide your phone number.")}
    if(!validator.isAlpha(this.data.name)) {this.errors.push("You must provide valid name.")}
    if(!validator.isAlpha(this.data.surname)) {this.errors.push("You must provide valid surname.")}
    try {
        this.data.date = new Date(this.data.date)
    }
    catch {
        {this.errors.push("You must provide valid date.")}
    }
    // needs better validation as well as course
    if(isNaN(this.data.ID)) {this.errors.push("You must provide valid ID.")}
    if(isNaN(this.data.course)) {this.errors.push("You must provide valid course of study.")}
    if(isNaN(this.data.number)) {this.errors.push("You must provide valid phone number.")}


}

UserPersonal.prototype.createOrUpdate = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if(!this.errors.length) {
            usersPersonalCollection.findOne({userId: this.data.userId}).then((document) => {
                if(document) {
                    usersPersonalCollection.findOneAndUpdate({userId: this.data.userId}, {$set: this.data}).then(() => resolve())
                } else {
                    usersPersonalCollection.insertOne(this.data).then(() => resolve())
                }
            })
        } else {
            reject(this.errors)
        }
    })
}

UserPersonal.find = function(userId) {
    return new Promise((resolve, reject) => {
        usersPersonalCollection.findOne({userId: userId}).then((document) => {
            if(document) {
                resolve(document)
            } else {
                resolve(UserPersonal.empty())
            }
        }).catch((err) => reject(err))
    })
}

UserPersonal.empty = function() {
    return data = {
        name: "",
        surname: "",
        date: new Date(),
        ID: "",
        degree: "",
        course: "",
        number: "",
        userId: "",
    }
}

module.exports = UserPersonal