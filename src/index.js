const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()

const app = express()

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

mongoose.connection.on('connected', () => {
    console.log("Connected to Mongo Instance")
})

mongoose.connection.on('error', () => {
    console.error("Error Connecting to Mongo Instance", err)
})

app.get('/', (req, res) => {
    res.send("Hello, World!")
})


app.listen(3000, () => {
    console.log(`Listening on port ${3000}`)
})