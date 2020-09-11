const axios = require('axios')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const credentials = require('../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token
const rssFeed = credentials.rss_feed

const getNews = require('../utils/rssParser')

createResponse = (req, res) => {
    const user = req.body.message.chat
    const sentMessage = req.body.message.text 
    const sentEntities = req.body.message.entities
    getNews(rssFeed)
    if (sentMessage === '/start') {
      const userInDb = db.get('users').find({ id: user.id }).value()
      if(userInDb) {
        axios.post(`${url}${token}/sendMessage`,
            {
                chat_id: user.id,
                text: 'You have already started this bot.'
            })
            .then((response) => res.status(200).send(response))
            .catch((error) => res.send(error))
      } else {
        db.get('users').push(user).write()
   
        axios.post(`${url}${token}/sendMessage`,
            {
                chat_id: user.id,
                text: 'Welcome! News coming soon.'
            })
            .then((response) => res.status(200).send(response))
            .catch((error) => res.send(error))
      }
    } else {
         res.status(200).send('v')
    }
}

module.exports = {
  createResponse
}