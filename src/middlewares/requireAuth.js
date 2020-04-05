const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
require('dotenv').config()
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    // Pull off authorization header. It is lower-case here but upper-case in Postman. Express automatically lower-cases headers.
    const { authorization } = req.headers

    // Make sure there is token
    if (!authorization) {
        return res.status(401).send({ error: "You must be logged in." })
    }

    // Real work begins. Get the token and not the prefix from the Authorization header
    const token = authorization.replace('Bearer ', '')

    // Give token to verify, its secret key, and an async callback with err and payload
    jwt.verify(token, process.env.JWT_TOKEN_KEY, async (err, payload) => {

        // If error, handle error
        if(err) {
            return res.status(401).send({error: 'You must be logged in.'})
        }

        // Pull off userId from payload
        const {userId} = payload

        // Compare to MongoDB to find user
        const user = await User.findById(userId)

        // Attach info to req
        req.user = user

        // Finished, move on to next middleware if there is one
        next()
    })
}