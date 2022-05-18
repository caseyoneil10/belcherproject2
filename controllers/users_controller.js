const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/users.js')

//render user/new
users.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

//Checks to see if password is at least 5 characters Long
//If we tried adding this to the schema it would always be true because bcrypt will hash it to a 10 character string. So we need to check before it hits the hashing function.
//If stringLength > 5 hash the PW, then check to see if username is unique if not send the error.
users.post('/', (req, res) => {
  let stringPw = req.body.password
  let stringLength = stringPw.length
  if (stringLength > 5) {
    //authentication markdown was extremely helpful.
    //overwrite the user password with the hashed password, then pass that in to our database
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    User.create(req.body, (err, createdUser) => {
      if (err) {
        console.log(err);
        res.send('<a  href="/users/new">Sorry, that username is already taken </a>')
      } else {
        console.log('user is created', createdUser)
        res.redirect('/sessions/new')
      }
    })
  } else {
    res.send('<a  href="/users/new">Sorry Password is Not Long Enough</a>')
  }
})


module.exports = users
