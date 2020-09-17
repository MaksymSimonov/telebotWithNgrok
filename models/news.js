const mongoose = require('mongoose')
const Schema = mongoose.Schema

const News = new Schema(
  {
    title: String,
    link: String,
    pubDate: Number,
    comments: String,
    content: String,
    contentSnippet: String,
    isoDate: Number
  }, { versionKey: false }
)

module.exports = mongoose.model('news', News)
