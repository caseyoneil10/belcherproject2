const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
  title: {type: String, required: true},
  director: String,
  userRating: String,
  genre: String,
  releaseYear: Number,
  image: String,
  synopsis: String,
  review: [{type: String}],
  length: String,
  contentRating: String,
  user: String,
})

const movieCollection = mongoose.model('Movie', movieSchema)
module.exports = movieCollection
