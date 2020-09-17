const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema(
  {
    telegram_id: Number,
    first_name: String,
    last_name: String,
    username: String,
    type: String
  }, { versionKey: false }
)

module.exports = mongoose.model('user', User)