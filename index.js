const express = require('express')
const bodyParser = require('body-parser')

const { getConnect } = require('./db')
const sendNews = require('./utils/news/sendNews')
const botRouter = require('./routes/botRouter')
const credentials = require('./credentials.json')

const app = express()
const port = credentials.ngrok_port

app.use(bodyParser.json())
app.use(botRouter)

const main = () => {
  getConnect()
  
  app.listen(port, () => console.log(`Server running on port ${port}`))
    
  const delay = 300000
  sendNews(delay)
}
main()



