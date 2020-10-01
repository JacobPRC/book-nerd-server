const mongoose = require("mongoose");

const { Schema } = mongoose;

const bioSchema = new Schema({
  content: String,
  user: { type: Schema.Types.ObjectId, ref: "user" },
  book: { type: Schema.Types.ObjectId, ref: "book" },
});

const Bio = mongoose.model("bio", bioSchema);

module.exports = Bio;
