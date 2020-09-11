const Parser = require('rss-parser')
const parser = new Parser()

const getNews = (rssFeed) => {
    parser.parseURL(rssFeed, (err, feed) => {
        if (err) throw err
        
        console.log(feed.title);
        feed.items.forEach((entry) => {
          console.log(entry.title + ':' + entry.link)
        })
      })
}

module.exports = getNews