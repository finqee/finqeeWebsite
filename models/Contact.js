const contactCollection = require('../db').db('Finqee').collection("contacts")
const validator = require('validator')

let Contact = function(data) {
    this.data = data
    this.errors = []
}

Contact.prototype.cleanUp = function() {
    if(typeof(this.data.name) != "string") { this.data.name = ""}
    if(typeof(this.data.email) != "string") { this.data.email = ""}
    if(typeof(this.data.phone) != "string") { this.data.phone = ""}
    if(typeof(this.data.message) != "string") { this.data.message = ""}

    this.data = {
        name: this.data.name.trim(),
        email: this.data.email.trim(),
        phone: this.data.phone.trim(),
        message: this.data.message
    }
}

Contact.prototype.validate = function() {
    if(!validator.isEmail(this.data.email)) { this.errors.push("You must provide valid email.")}
    if(this.data.name == "") { this.errors.push("You must provide name.")}
    if(isNaN(this.data.phone)) {this.errors.push("You must provide valid phone number.")}
    if(this.data.message == "") {this.errors.push("You must provide message.")}
}

Contact.prototype.create = function() {
    return new Promise((resolve, reject) => {
        this.cleanUp()
        this.validate()
        if(!this.errors.length) {
            contactCollection.insertOne(this.data).then(() => {
                resolve("success")
            })
        } else {
            reject(this.errors)
        }
    })
}

Contact.getAll = function() {
    return new Promise(async (resolve, reject) => {
        let contacts = await contactCollection.find({}).toArray()
        resolve(contacts)
    })
}

module.exports = Contact