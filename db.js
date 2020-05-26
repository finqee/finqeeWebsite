// DONT FORGET TO ADD DATABASE AUTHENTICATION https://medium.com/mongoaudit/how-to-enable-authentication-on-mongodb-b9e8a924efac
const dotenv = require('dotenv')
dotenv.config()
const mongodb = require('mongodb')
mongodb.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client){
    module.exports = client.db()
    const app = require('./app')
    app.listen(process.env.PORT)
})