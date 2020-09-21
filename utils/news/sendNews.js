const axios = require('axios')
const moment = require('moment')

const { getUsers, createNews } = require('../../db')
const credentials = require('../../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token
const rssFeed = credentials.rss_feed

const getNews = require('./getNews')

const sendNews = (delay) => {
  try {
    let latestNewsDate = moment().valueOf()
    let maxDate = moment().valueOf()

    setTimeout(function request() {
      getNews(rssFeed)
        .then(news => {
          news.forEach(async item => {
            const pubDate = moment(item.pubDate).valueOf()
           
            if (latestNewsDate < pubDate) {
              await createNews(item)

              if (maxDate < pubDate) maxDate = pubDate
              const users = await getUsers()

              if (users) {
                users.forEach(async user => {
                  await axios.post(`${url}/bot${token}/sendMessage`, { chat_id: user.id, text: item.link })
                })
              }
            }
          })
          latestNewsDate = maxDate
        })
      setTimeout(request, delay)
    }, delay)
  } catch (error) {
    throw new Error(`Failed to send news`)
  }
}

module.exports = sendNews
