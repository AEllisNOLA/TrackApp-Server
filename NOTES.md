# SERVER SETUP

## 1) Express First Steps

1) Create server directory. Move into it and *npm init -y* to create a *package.json* file.

2) *npm install bcrypt express jsonwebtoken mongoose nodemon dotenv*. Details to follow as each dependencie is utilized.

3) Add *src* directory and an *index.js* file. In it, require *express*, create an instance of *express* and send a test *GET request*. Lastly, specify the preferred port.

`
const express = require('express')

const app = express()

app.get('/', (req, res) => {

    res.send("Hello, World!")

})

app.listen(3000, () => {

    console.log( `Listening on port ${3000}` )

})
`

4) *node src/index.js* should log "Listening on port 3000". Navigate to localhost:3000 and you should see "Hello, World!"

## 2) Incorporating MongoDB

1) In MongoDB, start a project and build a cluster. Choose a tier (probably free). It will take a few minutes to create the cluster.

2) Once it is finished, click "Connect" button. Whitelist the IP you will be using and add admin credentials. In the next screen, choose "Connect your Application" to connect via connection string. Copy the URL.

3) *require('dotenv').config()* at the top of *index.js*.

4) Create a *.env* file at the root of the project. Type 'MONGO_URI=YOUR_CONNECTION_STRING', replacing 'YOUR_CONNECTION_STRING' with the string copied in step 2. Add *.env* to *.gitignore*.

5) *const mongoose = require('mongoose')* in *index.js*. The string from step 2 now exists as *process.env. MONGO_URI*. Connect to Mongoose using process.env. MONGO_URI as a first argument and an object as the second with the values shown below. Also add a message for successful/failed connection attempts.

`
mongoose.connect(process.env. MONGO_URI, {

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
`

6) Add script for *nodemon* to *package.json* to keep from having to constantly restart server:

`
"dev":"nodemon src/index.js"
`

