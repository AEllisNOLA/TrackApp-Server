const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv').config()
const authRoutes = require('./routes/authRoutes')

// Create instance of Express
const app = express()

// Allow Express app to handle JSON
app.use(bodyParser.json())

// Associate request handlers in router with Express app
app.use(authRoutes)

// Connect to MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

// Connection success
mongoose.connection.on('connected', () => {
    console.log("Connected to Mongo Instance")
})

// Connection fail
mongoose.connection.on('error', () => {
    console.error("Error Connecting to Mongo Instance", err)
})

/*
app.get('/', (req, res) => {
    res.send("Hello, World!")
})
*/

// Listening on port 3000
app.listen(3000, () => {
    console.log(`Listening on port ${3000}`)
})