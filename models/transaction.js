const Mongoose = require("mongoose");
const TransactionSchema = new Mongoose.Schema({
  // CLOSED source for demo
});

module.exports = Mongoose.model("transaction", TransactionSchema);
