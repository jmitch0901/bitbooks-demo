const { IP, PORT, DB } = process.env;

module.exports = {
  IP: IP || '127.0.0.1',
  PORT: PORT || '3000',
  DB: DB || 'mongodb://localhost/bitbooks_db',

  JWT_SECRET: process.env.JWT_SECRET || 'demosecret',
  JWT_EXPIRATION: 1000 * 60 * 60 * 24 * 7 //1 week
};
