const mongoose = require("mongoose");

const { Schema } = mongoose;

mongoose.Types.ObjectId.prototype.valueOf = function () {
  return this.toString();
};

const bookSchema = new Schema({
  title: String,
  author: { type: Schema.Types.Array, ref: "user" },
  paragraphs: [
    {
      type: Schema.Types.ObjectId,
      ref: "paragraph",
    },
  ],
  likes: { type: Number, default: 0 },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "comments",
    },
  ],
  genre: String,
  about: { type: Schema.Types.Array, ref: "bio" },
});

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
