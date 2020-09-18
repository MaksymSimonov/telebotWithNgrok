const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Img = new Schema(
  {
    key: String,
    src: String
  }, { versionKey: false }
)

module.exports = mongoose.model('img', Img)
