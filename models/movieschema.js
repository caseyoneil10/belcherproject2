const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movieSchema = new Schema({
  title: {type: String, required: true},
  director: {type: String,},
  userRating: String,
  genre: String,
  releaseYear: String,
  image: String,
  synopsis: String,
  review: [{type: String}],
  length: String,
  contentRating: String
})



const movieCollection = mongoose.model('Movie', movieSchema)
module.exports = movieCollection
