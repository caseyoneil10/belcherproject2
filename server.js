//Dependencies
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const db = mongoose.connection
const seedData = require('./models/data.js')
// const Movie = require('./models/movieschema.js')
require('dotenv').config()
const session = require('express-session')
const sessionsController = require('./controllers/sessions_controller.js')
const moviesController = require('./controllers/movies.js');
const userController = require('./controllers/users_controller.js')


//Middleware
//use public folder for static assets
app.use(express.static('public'))
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({
  extended: false
})) // extended: false - does not allow nested objects in query strings
 // returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method')) // allow POST, PUT and DELETE from a form
app.use(
  session({
    secret: process.env.SECRET, //a random string do not copy this value or your stuff will get hacked
    resave: false, // default more info: https://www.npmjs.com/package/express-session#resave
    saveUninitialized: false // default  more info: https://www.npmjs.com/package/express-session#resave
  })
)
app.use(express.json())
app.use('/sessions', sessionsController)
app.use(moviesController)
app.use('/users', userController)








//Port
// Allow use of Heroku's port or your own local port, depending on the environment
const PORT = process.env.PORT

//Database
// How to connect to the database either via heroku or locally
const MONGODB_URI = process.env.MONGODB_URI

// Connect to Mongo &
// Fix Depreciation Warnings from Mongoose
// May or may not need these depending on your Mongoose version
mongoose.connect(MONGODB_URI, () => {
  console.log('connected to mongo')
})

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI))
db.on('disconnected', () => console.log('mongo disconnected'))

//Listener
app.listen(PORT, () => console.log('Listening on port:', PORT))
