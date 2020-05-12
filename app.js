const express = require('express')
const app = express()

const router = require('./router')

app.use("/assets", express.static('assets'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', router)
app.listen(3030)