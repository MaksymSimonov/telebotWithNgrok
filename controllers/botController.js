const axios = require('axios')

const { createImg, createUser, checkUserById } = require('../db')
const uploadFile = require('../utils/img/uploadFile')

const credentials = require('../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token

createResponse = async (req, res) => {
  try {
    const message = req.body.message
    const user = message.from

    if (message.entities) {
      let text = 'Welcome! News coming soon.'
      const type = message.entities[0].type

      if (message.text === '/start' && type === 'bot_command') {
        const userInDb = await checkUserById(user.id)

        if (userInDb) {
          text = 'You have already started this bot.'
        } else {
          await createUser(user)
        }
      }
      await axios.post(`${url}/bot${token}/sendMessage`, { chat_id: user.id, text: text })
    }

    if (message.photo) {
      const fileId = message.photo[message.photo.length - 1].file_id
      const resFilePath = await axios.get(`${url}/bot${token}/getFile?file_id=${fileId}`)
      const filePath = resFilePath.data.result.file_path

      const resFileStream = await axios.get(`${url}/file/bot${token}/${filePath}`, { responseType: 'stream' })
      const fileStream = resFileStream.data

      uploadFile(fileStream)
        .then(async img => {
          await createImg(img)
          await axios.post(`${url}/bot${token}/sendMessage`, { chat_id: user.id, text: img.src })
        })
    }

    res.status(200).send({})
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createResponse
}
