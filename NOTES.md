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

## 3) Set up Authentication Routes
1) Create a *routes* folder and add *authRoutes.js*. Require *Express*. This is where request handling logic for authentication will reside.

2) Use *Express* to create a *router* to associate with the *route handlers* to be created.

3) Create a route handler with req and res objects as objects.

4) Export the *router*.

`
const express = require('express')

// Create router to associate with the route handlers to be created
const router = express.Router()

// Route Handlers
router.post('/signup', (req, res) => {
    res.send("You made a POST request")
})

module.exports = router;
`

5) In *Index.js*, require authRoutes.js*. Then use it immediately after creating the *app*, associate the authRoutes with the app.

`
// Create instance of Express
const app = express()

// Associate request handlers in router with Express app
app.use(authRoutes)
`

6) Test in *Postman* to make sure you are receiving "You made a POST request" when you make a POST request to localhost:3000/signup.

## 4) Making Express Handle JSON
1) *Express* does not readily handle JSON.  For this, use a third-party library called *body-parser*. Require it at the top of *index.js* with *const bodyParser = require('body-parser')*. Then use it after creating the *Express app*, but before associating the *Express app* with *authRoutes*.

Parsed data will be placed on the body of req within the route handlers.

`
// Create instance of Express
const app = express()

// Allow Express app to handle JSON
app.use(bodyParser.json())

// Associate request handlers in router with Express app
app.use(authRoutes)
`

## 5) Defining Schemas
1) Mongoose needs to know what data is in MongoDB through the creation of *models*. Add a new directory in *src* called *models* and add *User.js*. Require *mongoose*.

2) Create a schema. Example: 

`
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
`

3) Associate the schema with Mongoose. First argument is what it will be called throughout the app, and the second is the schema that was created.

`
mongoose.model('User', userSchema)
`
