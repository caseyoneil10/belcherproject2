const mongoose = require('mongoose')
const Schema = mongoose.Schema



const myObjectId = mongoose.Types.ObjectId
const movieSchema = new Schema({
  title: {type: String, required: true},
  director: {type: String,},
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
