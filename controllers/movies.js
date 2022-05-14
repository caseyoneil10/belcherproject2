const express = require('express');
const router = express.Router();
const session = require('express-session')
const Movie = require('../models/movieschema.js')
const User = require('../models/users.js')
const seedData = require('../models/data')

const isAuthenticated = (req, res, next) => {
  if (req.session.currentUser) {
    return next()
  } else {
    res.redirect('/users/new')
  }
}

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
router.post('/movies', isAuthenticated, (req, res) => {
  Movie.create(req.body, (error, createdMovie) => {
    res.redirect('/movies');
  })
})
//render new.ejs
router.get('/movies/new', isAuthenticated, (req, res) => {
  res.render('new.ejs')
})

//INDEX
//THIS WAS HELPFUL IN FIGURING OUT HOW TO SORT
//https://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js/15081087#15081087
//find all data in DB and sort by "title". Sort data stored in "allMovies" where it can they be referenced in the index.ejs with "movies"
//Collation ignores case sensitivity which would break alpha sorting.
// router.get('/movies', (req, res) => {
//   Movie.find({}).collation({
//     'locale': 'en'
//   }).sort('title').exec((error, allMovies) => {
//     User.findOne({username: req.session.currentUser
//     },
//    (err, foundUser) => {
//     res.render('index.ejs', {
//       movies: allMovies,
//       username: foundUser })
//
//   })
// })
// })

router.get('/movies', (req, res) => {
  if (req.session.currentUser == undefined) {
    res.redirect('/users/new')} else {
  Movie.find({}).collation({
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
router.get('/movies/edit/:id', isAuthenticated, (req, res) => {
  Movie.findById(req.params.id, (err, foundMovie) => {
    res.render('edit.ejs', {
      movie: foundMovie
    })
  })
})
//Update existing entry
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

//SEED
//seed basic data for troubleshooting. Finished version will not have pre-populated data.





module.exports = router;
