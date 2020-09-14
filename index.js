const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ news: [], users: []}).write()

const botRouter = require('./routes/botRouter')
const credentials = require('./credentials.json')
const port = credentials.ngrok_port

app.use(bodyParser.json())
app.use(botRouter)

app.listen(port, () => console.log(`Server running on port ${port}`))
