const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// Create schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

// Pre-save hook
// Use old-school keyword function so that "this" means the user instance
userSchema.pre('save', function (next) {
    const user = this
    // If user did not modify their password, don't worry about it
    if (!user.isModified('password')) {
        return next()
    }
    // Generate salt
    bcrypt.genSalt(10, (err, salt) => {
        // If error, move on to next middleware but include the error message
        if (err) {
            return next(err)
        }
        // Then hash user password + salt
        bcrypt.hash(user.password, salt, (err, hash) => {
            // If error, move on to next middleware but include the error message
            if (err) {
                return next(err)
            }
            // user password replace with hash/salted password
            user.password = hash
            next()
        })
    })
})

// Compare passwords
userSchema.methods.comparePassword = function (candidatePassword) {
    const user = this

    // Using Promise because BCRYPT does not use Async-Await.
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
            // if error, reject promise
            if (err) {
                return reject(err)
            }
            // if passwords don't match
            if (!isMatch) {
                return reject(false)
            }

            // passwords match
            resolve(true)
        })
    })
}

// Associate model with Mongoose. 1st arg is what it will be called, 2nd is the object created above.
mongoose.model('User', userSchema)