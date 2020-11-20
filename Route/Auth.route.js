const express = require('express')
const router = express.Router()
const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { signAccessToken } = require('../helpers/jwt_helper')

router.post('/register', async(req, res, next) => {
    // console.log(req.body)
    try{
        // const{email, password} = req.body
        const result = await authSchema.validateAsync(req.body)
        
        // if(!email || !password) throw createError.BadRequest()
        const doesExist = await User.findOne({ email: result.email })
        console.log(doesExist)
        if (doesExist) 
            throw createError.Conflict(`${result.email} is already been registered`)
        
        const user = new User(result)
        const savedUser = await user.save()
        const accessToken = await signAccessToken(savedUser.id)
        res.send(accessToken)
    } catch(error){
        if(error.isJoi === true) error.status = 422
        next(error)
    }
    
})

router.post('/login', async(req, res, next) => {
    res.send("login route")
})

router.post('/refresh-token', async(req, res, next) => {
    res.send("refresh token route")
})

router.delete('/logout', async(req, res, next) => {
    res.send("logout token route")
})

module.exports = router