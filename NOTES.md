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
const router = express. Router()

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

1) *Express* does not readily handle JSON. For this, use a third-party library called *body-parser*. Require it at the top of *index.js* with *const bodyParser = require('body-parser')*. Then use it after creating the *Express app*, but before associating the *Express app* with *authRoutes*.

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
const userSchema = new mongoose. Schema({

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

4) At the top of *index.js*, *require('./models/User')*. Note how it is not assigned to anything.*Mongoose* expects to only run across that code once, so it only needs to be in one file. If it is in multiple files, an attempt to create the User schema multiple times will occur and throw an error message.

5) To get access to refences of the User, such as needed in *authRoutes.js*:

`
const mongoose = require('mongoose')

const User = mongoose.model('User')
`

Now User can be used

## 5) Creating/Saving a User

1) In *authRoutes.js*, fill in the P*OST request handler* body with code for creating/saving a user within MongoDB.

`
router.post('/signup', async (req, res) => {

    // Pull data off req.body property
    const { email, password } = req.body

    try {
        // Create new user with those properties
        const user = new User({ email, password })
        // Save that user, giving the API time using Async-Await
        await user.save()
        res.send("User created.")

    } catch (err) {
        // Failed attempt. Send back error message
        return res.status(422).send(err.message)
    }
})
`

## 6) Incorporating JSON Web Tokens
1) In *authRoutes.js*, *const jwt = require('jsonwebtoken')* at the top. In addition, add *require('dotenv').config()* to hide the secret key you create with the token.

2) Create a token, passing in two arguments: the first is the information the token will carry, and the second is a secret key.

The new *try* block will look like: 
`
// Create new user with those properties
        const user = new User({ email, password })
        // Save that user, giving the API time using Async-Await
        await user.save()
        // Create token. First argument is info for the token to carry. Second argument is a secret key
        const token = jwt.sign({ userId: user._id }, `${process.env.JWT_TOKEN_KEY}`)
        // Send token
        res.send({ token })
`

3) Now to verify the token belongs to the user. In *src*, create a directory called *middlewares* and create *requireAuth.js*. Require *Express*, *Mongoose*, and *jsonwebtoken*. Your tokens secret key will be needed, so also require *require('dotenv').config()*.

4) Export a function with a callback function:

`
module.exports = (req, res, next) => {
    // Pull off authorization header. It is lower-case here, upper-case in Postman. Express automatically lowers headers.
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

        // Pull off userId the token is carrying from its payload
        const {userId} = payload

        // Compare to MongoDB to find user
        const user = await User.findById(userId)

        // Attach user to req so that other request handlers can have access
        req.user = user

        // Finished, move on to next middleware if there is one
        next()
    })
}
`

5) In *index.js*, add *requireAuth.js* middleware to app's initial GET request.

`
app.get('/', requireAuth, (req, res) => {
    res.send(`${req.user.email}`)
})
`

6) Test in *Postman*. Make a GET request to localhost:3000 with Headers of *Authorization: Bearer JSONWEBTOKEN*. You should get athe proper email back. Make the JSONWEBTOKEN invalid to make sure error throws.