const Parser = require('rss-parser')
const parser = new Parser()

const getNews = async (rssFeed) => {
  try {
    const response = await parser.parseURL(rssFeed)
    const news = response.items
    
    return news
  } catch (err) {
    throw new Error(`Failed to receive news`)
  }
}

module.exports = getNews
