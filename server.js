//Dependencies
const express = require('express')
const methodOverride  = require('method-override')
const mongoose = require ('mongoose')
const app = express ()
const db = mongoose.connection
const seedData = require('./models/data.js')
const Movie = require('./models/movieschema.js')
require('dotenv').config()

//Middleware
//use public folder for static assets
app.use(express.static('public'))
// populates req.body with parsed info from forms - if no data from forms will return an empty object {}
app.use(express.urlencoded({ extended: false }))// extended: false - does not allow nested objects in query strings
app.use(express.json())// returns middleware that only parses JSON - may or may not need it depending on your project
//use method override
app.use(methodOverride('_method'))// allow POST, PUT and DELETE from a form

//seed
app.get('/movies/seed', (req, res) => {
  Movie.create(seedData, (err, createData) => {
    console.log(err);
    console.log('seed data registered')
  })
  res.redirect('/movies')
})


// Routes
//localhost:3000

//new
app.post('/movies', (req, res) => {
  Movie.create(req.body, (error, createdMovie) => {
    res.redirect('/movies');
  })
})
//index
app.get('/movies', (req, res) => {
  Movie.find({}, (error, allMovies) => {
    res.render('index.ejs', {
      movies: allMovies
    })
  })
})
//new
app.get('/movies/new', (req, res) => {
  res.render('new.ejs')
})
//edit
app.get('/movies/edit/:id', (req, res) => {
  Movie.findById(req.params.id, (err, foundMovie) => {
    res.render('edit.ejs', {
      movie: foundMovie
    })
  })
})
//show
app.get('/movies/:id', (req, res) => {
  Movie.findById(req.params.id, (err, foundMovie) => {
    res.render('show.ejs', {
      movie: foundMovie
    })
  })
})


app.put('/movies/:id', (req, res) => {
  Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, (err, updatedReview) => {
    // console.log(updatedReview)
    res.redirect('/movies')
  })
})

//DELETE
app.delete('/movies/:id', (req, res) => {
  Movie.findByIdAndRemove(req.params.id, (err, deleteMovie) => {
    res.redirect('/movies')
  });
});
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
app.listen(PORT, () => console.log( 'Listening on port:', PORT))
