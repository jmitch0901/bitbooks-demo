const { DB } = require('./config');

module.exports = {
  "dbConnectionUri": DB,
  "migrationsDir": __dirname  + "/db/migrations",
  "es6": true
}
