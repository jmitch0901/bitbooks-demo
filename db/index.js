const Mongoose = require('mongoose');

Mongoose.Promise = global.Promise;

const { DB } = require('../config');

Mongoose.connect(DB, { useNewUrlParser: true });

module.exports = Mongoose;
