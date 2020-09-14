const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')

const MyStorage = (function () {
  let db

  function createDb() {
    db = low(adapter)
    db.defaults({ news: [], users: [] }).write()
    return db
  }

  return {
    getDb: function () {
      if (!db) db = createDb()
      return db
    }
  }
})()

module.exports = MyStorage
