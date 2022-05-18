const express = require('express');
const router = express.Router();
const session = require('express-session')
const Movie = require('../models/movieschema.js')
const User = require('../models/users.js')
const seedData = require('../models/data')
const mongoose = require('mongoose')

//function that checks to see if the user is logged in..
//this variable can then be referenced in each router function
//the "relationships and auth" markdown was a huge help to make this DRY. I started having if statements in each route function to check if logged in.
//I did keep some of the if statements below to show the two ways of doing it.
const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/users/new')
  }
}
//SEED
//seed basic data for troubleshooting. Finished version will not have pre-populated data.

router.get('/movies/seed', (req, res) => {
  Movie.create(seedData, (err, createData) => {
    console.log(err);
    console.log('seed data registered')
  })
  res.redirect('/movies')
})

//REDIRECT
//Redirects page to /movies (index) on initial load
router.get('/', (req, res) => {
  if (req.session.currentUser == undefined) {
    res.redirect('/users/new')
  } else {
    res.redirect('/movies')
  }
})

//NEW
//allows creating of new entries to DB
//I wanted to be able to add the user's username to the data each new data set so that it can be easily referenced and "linked" to a specific signed in user.
//I couldn't find a way to make this DRYer and had to write out each key and where to find that information in the req.body, but it allowed me to do what I wanted!
//req.session.currenUser.username accesses only the currently logged in user and adds to the data set.
router.post('/movies', isAuthenticated, (req, res) => {
  Movie.create({
    title: req.body.title,
    director: req.body.director,
    userRating: req.body.userRating,
    genre: req.body.genre,
    releaseYear: req.body.releaseYear,
    image: req.body.image,
    synopsis: req.body.synopsis,
    review: req.body.review,
    length: req.body.length,
    contentRating: req.body.contentRating,
    user: req.session.currentUser.username
  }, (error, createdMovie) => {
    res.redirect('/movies');
  })
})
//render new.ejs, and check to see if user is logged in
router.get('/movies/new', isAuthenticated, (req, res) => {
  res.render('new.ejs')
})

//INDEX
//THIS WAS HELPFUL IN FIGURING OUT HOW TO SORT
//First check to see if there is a logged in user. If none redirect to the new user create page.
//Else, find all data sets with key "user" set to the current user's username
//On finding that data sort by the key "title" alphabetically
//.collation ignores case sensitivity which would break alpha sorting.
//Below link was helpful for figuring out sorting.
// https://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js/15081087#15081087
//render the index.ejs
//find all data in DB and sort by "title". Sort data stored in "allMovies" where it can they be referenced in the index.ejs with "movies"
//Collation ignores case sensitivity which would break alpha sorting.
//"allMovies" holds the found data
//req.session hold the logged in users information for easy reference on the index page.

router.get('/movies', (req, res) => {
  if (req.session.currentUser == undefined) {
    res.redirect('/users/new')
  } else {
    Movie.find({
      user: req.session.currentUser.username
    }).collation({
      'locale': 'en'
    }).sort('title').exec((error, allMovies) => {
      res.render('index.ejs', {
        movies: allMovies,
        username: req.session

      })
    })
  }
})




//EDIT
//render edit page.
//Check if user is logged in.
router.get('/movies/edit/:id', isAuthenticated, (req, res) => {
  Movie.findById(req.params.id, (err, foundMovie) => {
    res.render('edit.ejs', {
      movie: foundMovie
    })
  })
})
//Update existing entry
//find by ID and update.
router.put('/movies/:id', isAuthenticated, (req, res) => {
  Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  }, (err, updatedReview) => {
    // console.log(updatedReview)
    res.redirect('/movies')
  })
})

//SHOW
//Show page for each specific entry clicked
router.get('/movies/:id', isAuthenticated, (req, res) => {
  Movie.findById(req.params.id, (err, foundMovie) => {
    res.render('show.ejs', {
      movie: foundMovie
    })
  })
})

//DELETE
//delete existing entry
router.delete('/movies/:id', (req, res) => {
  Movie.findByIdAndRemove(req.params.id, (err, deleteMovie) => {
    res.redirect('/movies')
  })
})






module.exports = router;
