if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expresslayouts = require('express-ejs-layouts')

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL,{ useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to db'))

const indexRouter = require('./routes/index')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expresslayouts)
app.use(express.static('public'))

//Routes
app.use('/', indexRouter)





const port = process.env.SERVER_PORT || 3000

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`)
})