const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const User = mongoose.model('User')

// Create router to associate with the route handlers to be created
const router = express.Router()

// Route Handlers
router.post('/signup', async (req, res) => {
    // Pull data off req.body property
    const { email, password } = req.body

    try {
        // Create new user with those properties
        const user = new User({ email, password })
        // Save that user, giving the API time using Async-Await
        await user.save()
        // Create token. First argument is info for the token to carry. Second argument is a secret key
        // In this case, we only want it to carry user._id from MongoDB
        const token = jwt.sign({ userId: user._id }, `${process.env.JWT_TOKEN_KEY}`)
        // Send token as response
        res.send({ token })

    } catch (err) {
        // Failed attempt. Send back error message
        return res.status(422).send(err.message)
    }
})

router.post('/signin', async (req, res) => {
    // Pull data off req.body property
    const { email, password } = req.body
    // make sure email/password are provided
    if (!email || !password) {
        return res.status(422).send({ error: 'Please provide email and password.' })
    }
    // Find a person with that email
    const user = await User.findOne({ email })

    // Error if email not found in database
    if (!user) {
        return res.status(404).send({ error: 'Invalid password or email. 😞' })
    }

    // Compare passwords
    try {
        await user.comparePassword(password)
        // If match, generate JSON Web Token
        const token = jwt.sign({userId: user._id}, `${process.env.JWT_TOKEN_KEY}`)
        // Send token as response
        res.send({ token })
    } catch (err) {
        return res.status(422).send({error: 'Invalid password or email. 😞'})
    }
})

module.exports = router;