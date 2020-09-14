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

createResponse = async (req, res, next) => {
  try {
    const user = req.body.message.chat
    const sentMessage = req.body.message.text

    if (sentMessage === '/start') {
      let text = 'Welcome! News coming soon.'
      const userInDb = db.get('users').find({ id: user.id }).value()

      if (userInDb) {
        text = 'You have already started this bot.'
      } else {
        db.get('users').push(user).write()
      }

      let response = await axios.post(`${url}${token}/sendMessage`, { chat_id: user.id, text: text })
      res.status(200).send(response.data)
    }

    let delay = 10000

    setTimeout(function request() {
      getNews(rssFeed)
        .then(news => {
          news.forEach(item => {
            const newsInDb = db.get('news').find({ link: item.link }).value()

            if (newsInDb === undefined) {
              db.get('news').push(item).write()
              let link = item.link

              db.get('users').value().forEach(async user => {
                let response = await axios.post(`${url}${token}/sendMessage`, { chat_id: user.id, text: link })
                res.status(200).send(response.data)
              })
            }
          })
        })

      setTimeout(request, delay)
    }, delay)
    axios.post(`${url}${token}/sendMessage`, { chat_id: user.id, text: link })
  } catch (error) {
    console.log(error)
    res.send(error)
  }
}

module.exports = {
  createResponse
}
