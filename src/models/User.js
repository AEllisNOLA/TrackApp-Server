const mongoose = require('mongoose')

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


// Associate model with Mongoose. 1st arg is what it will be called, 2nd is the object created above.
mongoose.model('User', userSchema)