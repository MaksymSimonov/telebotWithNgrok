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
    let latestNewsDate, maxDate = moment().valueOf()

    setTimeout(function request() {
      getNews(rssFeed)
        .then(news => {
          news.forEach(async item => {
            const pubDate = moment(item.pubDate).valueOf()
            console.log(moment(item.pubDate).format('Do MMM YYYY [at] H:mm') )
            if (latestNewsDate < pubDate) {
              await createNews(item)
              if (maxDate < pubDate) maxDate = pubDate

              const link = news.link
              const users = await getUsers()
              if (users) {
                users.forEach(async user => {
                  await axios.post(`${url}/bot${token}/sendMessage`, { chat_id: user.id, text: link })
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
