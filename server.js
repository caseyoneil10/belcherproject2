//Dependencies
const express = require('express')
const methodOverride = require('method-override')
const mongoose = require('mongoose')
const app = express()
const db = mongoose.connection
require('dotenv').config()
const session = require('express-session')
const sessionsController = require('./controllers/sessions_controller.js')
const moviesController = require('./controllers/movies.js');
const userController = require('./controllers/users_controller.js')


//Middleware
app.use(express.static('public'))
app.use(express.urlencoded({
  extended: false
}))
app.use(methodOverride('_method'))
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
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

// Connect to Mongo & Fix Depreciation Warnings from Mongoose
mongoose.connect(MONGODB_URI, () => {
  console.log('connected to mongo')
})

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI))
db.on('disconnected', () => console.log('mongo disconnected'))

//Listener
app.listen(PORT, () => console.log('Listening on port:', PORT))
