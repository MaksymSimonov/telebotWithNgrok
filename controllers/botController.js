const axios = require('axios')

const User = require('../models/user')
const Img = require('../models/img')
const uploadFile = require('../utils/img/uploadFile')

const credentials = require('../credentials.json')
const url = credentials.telegram_url
const token = credentials.telegram_bot_token

createResponse = async (req, res) => {
  try {
    const message = req.body.message
    let user = message.from

    if (message.entities) {     
      let text = 'Welcome! News coming soon.'
      let type = message.entities[0].type

      if(message.text === '/start' && type === 'bot_command') {
        let userInDb = await User.findOne({ id: user.id }) 
        
        if (userInDb) {
           text = 'You have already started this bot.'
        } else {
          let newUser = new User(user)
          await newUser.save()
        }
      }

      const response = await axios.post(`${url}/bot${token}/sendMessage`, { chat_id: user.id, text: text })
      //res.status(200).send(response.data)
    }
    
    if(message.photo) {
      let fileId = message.photo[message.photo.length-1].file_id
      let response = await axios.get(`${url}/bot${token}/getFile?file_id=${fileId}`)

      let filePath = response.data.result.file_path

      let file = await axios.get(`${url}/file/bot${token}/${filePath}`, { responseType: 'stream' })

      uploadFile(file.data)
        .then(async img => {
          let newImg = new Img(img)
          await newImg.save()
          await axios.post(`${url}/bot${token}/sendMessage`, { chat_id: user.id, text: newImg.src })
        })
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  createResponse
}
