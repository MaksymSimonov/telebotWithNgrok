const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
  {
    id: Number,
    is_bot: Boolean,
    first_name: String,
    last_name: String,
    username: String,
    language_code: String
  }, { versionKey: false }
)

module.exports = mongoose.model('user', User)