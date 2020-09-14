const axios = require('axios')

const MyStorage = require('./MyStorage')
const myStorage = MyStorage.getDb()

const credentials = require('../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token
const rssFeed = credentials.rss_feed

const getNews = require('./getNews')

const sendNews = (delay) => {
  try {
    setTimeout(function request() {
      getNews(rssFeed)
        .then(news => {
          news.forEach(item => {
            const newsInDb = myStorage.get('news').find({ link: item.link }).value()

            if (newsInDb === undefined) {
              myStorage.get('news').push(item).write()
              let link = item.link

              myStorage.get('users').value().forEach(async user => {
                await axios.post(`${url}${token}/sendMessage`, { chat_id: user.id, text: link })
              })
            }
          })
        })
      setTimeout(request, delay)
    }, delay)

  } catch (error) {
    console.log(error)
  }
}

module.exports = sendNews