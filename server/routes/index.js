const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const RefreshToken = require('../models/refreshToken')

const initializePassport = require('../passport-config')

initializePassport(
    passport,function getUserByEmail(email){
        const user = User.findOne({email:email})
        return user
    }
)

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/dashboard', authenticateToken, (req, res)=>{
    res.send("Dashboard")
})

router.post('/token', (req, res)=>{
    const refreshToken = req.body.token
    if(refreshToken === null) return res.sendStatus(401)
    const refreshTokens = RefreshToken.findOne({refreshToken:refreshToken})
    if(refreshTokens === null) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user)=>{

        if(error) return res.sendStatus(403)
        const accessToken = generateAccessToken({name:user.name})
        res.json({accessToken: accessToken})
    })
    
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', async (req, res, next) => {
    await passport.authenticate('local', {session:false},(error, user, info)=>{
        if(error) return next(error)
        if(!user) return res.sendStatus(404).redirect('/login')
        req.logIn(user, {session:false}, error => {
            if(error) return next(error)
            const accessToken = generateAccessToken(user)
            const refreshToken = jwt.sign({user}, process.env.REFRESH_TOKEN_SECRET)
            const refreshTokens = new RefreshToken({user:user, refreshToken:refreshToken})
            refreshTokens.save()
            return res.json({accessToken: accessToken, refreshToken: refreshToken})
            
        })
    })(req, res)
})  
//REGISTER ROUTES
router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const newUser = new User({ name: req.body.name, email:req.body.email, password:hashedPassword }) 
        await newUser.save()
        res.redirect('/login')
    } catch (error) {
        res.render('/register',{
            newUser: newUser,
            errorMessage: 'Error creating new user'
        })
    }
})
//GENERATE USER TOKEN FUNCTION
function generateAccessToken(user){
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'10m'})
}


//Middleware functions
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] 
    if(token === null) return res.sendStatus(401)
    console.log(token)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error) return res.sendStatus(403)
        req.user = user
        
        next()
    })
}
module.exports = router