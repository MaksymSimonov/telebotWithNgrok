const axios = require('axios')

const MyStorage = require('../utils/MyStorage')
const myStorage = MyStorage.getDb()

const credentials = require('../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token

createResponse = async (req, res) => {
  try {
    const user = req.body.message.chat
    const sentMessage = req.body.message.text

    if (sentMessage === '/start') {
      let text = 'Welcome! News coming soon.'
      const userInDb = myStorage.get('users').find({ id: user.id }).value()

      if (userInDb) {
        text = 'You have already started this bot.'
      } else {
        myStorage.get('users').push(user).write()
      }

      let response = await axios.post(`${url}${token}/sendMessage`, { chat_id: user.id, text: text })
      res.status(200).send(response.data)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createResponse
}
