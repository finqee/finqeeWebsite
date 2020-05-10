const express = require('express')
const app = express()

app.use("/assets", express.static('assets'))
app.set('views', 'views')
//app.set('views', '')
app.set('view engine', 'ejs')

app.get('/', function(req, res) {
    res.render('index')
})
app.listen(3030)