const Mongoose = require("mongoose"),
  MongooseLeanVirtualsPlugin = require("mongoose-lean-virtuals"),
  PassportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  createdOn: { type: Date, default: Date.now }
});

// So I can query the virtual
UserSchema.plugin(MongooseLeanVirtualsPlugin);
UserSchema.plugin(PassportLocalMongoose);

module.exports = Mongoose.model("user", UserSchema);
