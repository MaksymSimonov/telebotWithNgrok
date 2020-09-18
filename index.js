const express = require('express')
const bodyParser = require('body-parser')

const db = require('./db')
const sendNews = require('./utils/news/sendNews')
const botRouter = require('./routes/botRouter')
const credentials = require('./credentials.json')

const app = express()
const port = credentials.ngrok_port

app.use(bodyParser.json())
app.use(botRouter)

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.listen(port, () => console.log(`Server running on port ${port}`))

const delay = 10000
sendNews(delay)

