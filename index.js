const credentials = require('./credentials.json')

const express = require('express')
const app = express()
const axios = require('axios')
const bodyParser = require('body-parser')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ news: [], users: []}).write()

const port = credentials.ngrok_port
const url = credentials.telegram_url
const token = credentials.telegram_bot_token

app.use(bodyParser.json())

app.post('/', (req, res) => {
     // console.log(req.body);
     const chatId = req.body.message.chat.id
     const sentMessage = req.body.message.text
     // Regex for hello
     if (sentMessage.match(/hello/gi)) {
          axios.post(`${url}${token}/sendMessage`,
               {
                    chat_id: chatId,
                    text: 'hello back 👋'
               })
               .then((response) => { 
                    res.status(200).send(response)
               }).catch((error) => {
                    res.send(error)
               });
     } else {
          
          res.status(200).send({})
     }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})