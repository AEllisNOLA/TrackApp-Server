const mongoose = require('mongoose')


// Since pointSchema is only used in this file within trackSchema, it can be put in same file.
const pointSchema = new mongoose.Schema({
    timestamp: Number, 
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }

})

const trackSchema = new mongoose.Schema({
    userId: {
        // Way of indicating the type is an object within MongoDB
        type: mongoose.Schema.Types.ObjectId,
        // Is an instance of a User. Points to mongoose.model('User', userSchema) in the User model.
        ref: 'User'
    },
    name: {
        type: String,
        default: 'Untitled Track'
    },
    locations: [pointSchema]
})

mongoose.model('Track', trackSchema)