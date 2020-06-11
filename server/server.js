if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const path = require('path')

//MONGODB CONNECTION
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to db')) 

//ROUTERS
const indexRouter = require('./routes/index')

//APP SET
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({ extended:false }))

//ROUTES

const port = process.env.SERVER_PORT || 3000

app.listen(port, ()=>{
    console.log(`server listening on port ${port}`)
})