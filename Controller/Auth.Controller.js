const createError = require('http-errors')
const User = require('../Models/User.model')
const { authSchema } = require('../helpers/validation_schema')
const { 
    signAccessToken, 
    signRefreshToken, 
    verifyRefreshToken 
} = require('../helpers/jwt_helper')
const client = require('../helpers/init_redis')

module.exports = {
    register: async(req, res, next) => {
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
            const refreshToken = await signRefreshToken(savedUser.id)
            res.send({ accessToken, refreshToken })
        } catch(error){
            if(error.isJoi === true) error.status = 422
            next(error)
        }        
    },

    login: async(req, res, next) => {
        try {        
            const result = await authSchema.validateAsync(req.body)
            const user = await User.findOne({ email: result.email })
            if (!user) throw createError.NotFound('User not registered')
    
            const isMatch = await user.isValidPassword(result.password)        
            if (!isMatch) throw createError.Unauthorized('Username/password is not valid')        
            console.log(user.id)
            const accessToken = await signAccessToken(user.id)        
            const refreshToken = await signRefreshToken(user.id)
            res.send({accessToken, refreshToken})
        } catch (error){
            console.log(error.message)
            if(error.isJoi === true) return next(createError.BadRequest("Invalid Username/Passord"))
            next(error)
        }
        //res.send("login route")
    },

    refreshToken: async(req, res, next) => {
        try {
            const { refreshToken } = req.body
            if (!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
      
            const accessToken = await signAccessToken(userId)
            const refToken = await signRefreshToken(userId)
            res.send({ accessToken: accessToken, refreshToken: refToken })
          } catch (error) {
            next(error)
          }    
        // res.send("refresh token route")
    },

    logout: async(req, res, next) => {
        try {
            const { refreshToken } = req.body
            if(!refreshToken) throw createError.BadRequest()
            const userId = await verifyRefreshToken(refreshToken)
            client.DEL(userId,(err, val) => {
                if(err) {
                    console.log(err.message)
                    throw createError.InternalServerError()                
                }
                console.log(val)
                res.sendStatus(204)
            })
        } catch (err) {
            next(err)
        }
        //res.send("logout token route")
    }
}