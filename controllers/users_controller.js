const bcrypt = require('bcrypt')
const express = require('express')
const users = express.Router()
const User = require('../models/movieschema.js')


users.get('/new', (req, res) => {
  res.render('users/new.ejs')
})

users.post('/', (req, res) => {
  let stringPw = req.body.password
  let stringLength = stringPw.length
if (stringLength > 5) {
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
  User.create(req.body, (err, createdUser) => {
      if (err) {
        console.log(err)
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
