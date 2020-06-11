if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express();
const passport = require('passport')
const expressLayouts = require('express-ejs-layouts')

const User = require('./models/user')
const loginRouter = require('./routes/users')
const indexRouter = require('./routes/index')
const path = require('path')

app.use(express.json())
app.use(passport.initialize())

//APP SET
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.set('layout', 'layouts/layout')
app.use(express.static('public'))
app.use(expressLayouts)
app.use(express.urlencoded({ extended:false }))

const port = process.env.AUTHSERVER_PORT || 4000

//MONGODB CONNECTION
const mongoose = require('mongoose')
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
const db = mongoose.connection
db.on('error', error => console.log(error))
db.once('open', () => console.log('connected to db')) 

//ROUTES
app.use('/', indexRouter)
app.use('/login ', loginRouter)

app.listen(port, ()=>{
    console.log(`authServer listening on port ${port}`)
})
