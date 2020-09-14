const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const botRouter = require('./routes/botRouter')
const credentials = require('./credentials.json')
const port = credentials.ngrok_port

app.use(bodyParser.json())
app.use(botRouter)

let delay = 20000
const sendNews = require('./utils/sendNews')
sendNews(delay)

app.listen(port, () => console.log(`Server running on port ${port}`))
