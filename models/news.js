const mongoose = require('mongoose')
const Schema = mongoose.Schema

const News = new Schema(
  {
    title: String,
    link: String,
    pubDate: String,
    comments: String,
    content: String,
    contentSnippet: String,
    isoDate: String
  }, { versionKey: false }
)

module.exports = mongoose.model('news', News)
