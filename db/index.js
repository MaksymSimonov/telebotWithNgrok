const { Client } = require('pg')
const config = require('./config')

const client = new Client({
    user: config.USER,
    host: config.HOST,
    database: config.DATABASE,
    password: config.PASSWORD,
    port: config.PORT
})

const getConnect = async () => {
  try {
    await client.connect()
    console.log('PostgreSQL Connected!')

  } catch (err) {
    throw new Error('Failed to get Connect')
  }
}

const checkUserById = async id => {
  const query = `SELECT * FROM users WHERE id = ${id}`

  try {
    const res = await client.query(query)

    if (res.rows.length === 0) return false
    return true
  } catch (err) {
    throw new Error('Failed to get User by id')
  }
}

const getUsers = async () => {
  const query = `SELECT * FROM users`

  try {
    const res = await client.query(query)

    return res.rows
  } catch (err) {
    throw new Error('Failed to get Users')
  }
}

const createUser = async user => {
  const {
    id,
    is_bot,
    first_name,
    last_name,
    username,
    language_code
  } = user

  const query = `INSERT INTO users (id, is_bot, first_name, last_name, username, language_code) 
                  VALUES (${id}, ${is_bot}, '${first_name}', '${last_name}', '${username}', '${language_code}')`

  try {
    await client.query(query)
  } catch (err) {
    throw new Error('Failed to create User')
  }
}

const createNews = async news => {
  let { title } = news
  const {
    link,
    pubDate,
    comments,
    content,
    contentSnippet,
    isoDate
  } = news

  title = title.split("'").join("''")

  const query = `INSERT INTO news(title, link, pubDate, comments, content, contentSnippet, isoDate) 
                  VALUES ('${title}', '${link}', '${pubDate}', '${comments}', '${content}', '${contentSnippet}', '${isoDate}')`

  try {
    await client.query(query)
  } catch (err) {
    throw new Error('Failed to create News')
  }
}

const createImg = async img => {
  const { key, src } = img

  const query = `INSERT INTO imgs (key, src) 
                  VALUES ('${key}', '${src}')`

  try {
    await client.query(query)
  } catch (err) {
    throw new Error('Failed to create Img')
  }
}

module.exports = {
  getConnect,
  checkUserById,
  getUsers,
  createUser,
  createNews,
  createImg
}

