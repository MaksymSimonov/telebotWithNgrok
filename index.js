const express = require('express')
const bodyParser = require('body-parser')

const { client } = require('./db')
const sendNews = require('./utils/news/sendNews')
const botRouter = require('./routes/botRouter')
const credentials = require('./credentials.json')

const app = express()
const port = credentials.ngrok_port

app.use(bodyParser.json())
app.use(botRouter)

client.on('error', err => console.error('PostgreSQL connection error:', err.stack))

app.listen(port, () => console.log(`Server running on port ${port}`))

const delay = 60000
sendNews(delay)

