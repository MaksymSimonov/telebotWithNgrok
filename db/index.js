const mongoose = require('mongoose')
const config = require('./config')

mongoose
  .connect(config.url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log('DB Connected!'))
  .catch(err => {
    console.log(`DB Connection Error: ${err.message}`)
  })

const db = mongoose.connection

module.exports = db
