const Parser = require('rss-parser')
const parser = new Parser()

const getNews = (rssFeed) => {
  return new Promise((resolve, reject) => {
    parser.parseURL(rssFeed, (err, feed) => {
      if (err) reject(err) 

      if(feed) {
        let news = feed.items
        resolve(news)
      } else {
        reject('News is empty')
      }
    })
  })
}

module.exports = getNews