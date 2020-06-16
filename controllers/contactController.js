const Contact = require('../models/Contact')

exports.viewContacts = function(req, res) {
    Contact.getAll().then((array) => {
        res.render('viewContacts', {documents: array})
    })
}

exports.createContact = function(req, res) {
    let contact = new Contact(req.body)
    contact.create().then(() => {
        res.redirect('/')
    }).catch((err) => {
        res.send(err)
    })
}