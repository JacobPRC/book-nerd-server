const mongoose = require("mongoose");

const { Schema } = mongoose;

const paragraphSchema = new Schema({
  content: String,
  author: { type: Schema.Types.Array, ref: "user" },
  book: { type: Schema.Types.ObjectId, ref: "book" },
  likes: { type: Number, default: 0 },
  comments: { type: Schema.Types.Array, ref: "comments" },
});

const Paragraph = mongoose.model("paragraph", paragraphSchema);

module.exports = Paragraph;
