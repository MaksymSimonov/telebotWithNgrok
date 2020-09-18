const AWS = require('aws-sdk')
const config = require('./config')

const s3 = new AWS.S3({
  accessKeyId: config.AWSAccessKeyId,
  secretAccessKey: config.AWSSecretKey
})

module.exports = s3