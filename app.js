const express = require('express')
const morgan = require('morgan')
const createError = require('http-errors')
require('dotenv').config()
require('./helpers/init_mongodb')
const { verifyAccessToken } = require('./helpers/jwt_helper')
const client = require('./helpers/init_redis')
const Age = require('./Models/Age.model')
const Item = require('./Models/Item.model')
const User = require('./Models/User.model')


const AuthRoute = require('./Route/Auth.route')

const app  = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))




app.use('/auth', AuthRoute)

app.get('/', verifyAccessToken, async(req, res, next) => {
    Age.find({}).exec(function(err, response) {
        // const { ps } = response
        console.log(response)
        if (!err) {
            res.send({"users":response})
        } else {
            console.log(err)
        };
    });
    
})

app.use(async(req, res, next) => {
    next(createError.NotFound())
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send({
        error: {
            status: err.status || 500,
            message: err.message,
        }
    })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})