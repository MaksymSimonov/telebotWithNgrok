const axios = require('axios')

const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const credentials = require('../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token
const rssFeed = credentials.rss_feed

const getNews = require('../utils/getNews')

createResponse = (req, res) => {
  const user = req.body.message.chat
  const sentMessage = req.body.message.text 
  
  if(sentMessage === '/start') {
    let text = 'Welcome! News coming soon.'
    const userInDb = db.get('users').find({ id: user.id }).value()

    if(userInDb) {
      text = 'You have already started this bot.'
    } else {
      db.get('users').push(user).write()
    }
    
    axios
      .post(`${url}${token}/sendMessage`,
      {
        chat_id: user.id,
        text: text
      })
      .then((response) => {
        res.status(200).send(response)
      })
      .catch((error) => {
        res.send(error)
      })
  } 

  let delay = 10000

  setTimeout(function request() {
    getNews(rssFeed)
      .then((news) => {
        news.forEach(item => {
          const newsInDb = db.get('news').find({ link: item.link }).value()
          if(newsInDb === undefined) {
            db.get('news').push(item).write()
            let link = item.link
            db.get('users').value().forEach(user => {
              axios
                .post(`${url}${token}/sendMessage`,
                {
                  chat_id: user.id,
                  text: link
                })
                .then((response) => {
                  res.status(200).send(response)
                })
                .catch((error) => {
                  res.send(error)
                })         
            })
          }
        })
      })
      .catch((error) => {
        res.send(error)
      })

    setTimeout(request, delay) 
  }, delay)
}

module.exports = {
  createResponse
}