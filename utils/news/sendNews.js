const axios = require('axios')
const moment = require('moment')

const News = require('../../models/news')
const User = require('../../models/user')
const credentials = require('../../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token
const rssFeed = credentials.rss_feed

const getNews = require('./getNews')

const sendNews = (delay) => {
  try {
    let latestNewsDate = moment().valueOf()

    setTimeout(function request() {
      getNews(rssFeed)
        .then(news => {
          news.forEach(async item => {
            const pubDate = moment(item.pubDate).valueOf()

            if (latestNewsDate < pubDate) {
              const news = new News(item)
              await news.save()
              latestNewsDate = pubDate

              const link = news.link
              const users = await User.find({})
              if (users) {
                users.forEach(async user => {
                  await axios.post(`${url}/bot${token}/sendMessage`, { chat_id: user.id, text: link })
                })
              }
            }
          })
        })
      setTimeout(request, delay)
    }, delay)
  } catch (error) {
    throw new Error(`Failed to send news`)
  }
}

module.exports = sendNews
