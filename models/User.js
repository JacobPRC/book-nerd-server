const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  loggedIn: { type: Boolean, default: false },
  name: { type: String },
  bio: { type: Schema.Types.ObjectId, ref: "bio" },
  books: { type: Schema.Types.Array, ref: "book" },
  age: Number,
  livesIn: String,
});

const User = mongoose.model("user", userSchema);

module.exports = User;
