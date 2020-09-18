const s3 = require('../../aws')

const uploadFile = async (fileStream) => {
  try {
    const params = {
      Bucket: 'jawa-bucket',
      Key: Date.now() + '.jpg',
      ACL: 'public-read',
      Body: fileStream
    }
    const response = await s3.upload(params).promise()
    const key = response.key
    const src = response.Location

    return { key, src }
  } catch (err) {
    throw new Error(`Failed to upload file`)
  }
}

module.exports = uploadFile
