const mongoose = require('mongoose')
const User = require('./user')

const refreshTokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User,
        required: true
    },
    refreshToken:{
        type:String,
        required:true
    }
    
})

module.exports = mongoose.model('RefreshToken', refreshTokenSchema)