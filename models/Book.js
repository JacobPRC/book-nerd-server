const mongoose = require("mongoose");

const { Schema } = mongoose;

mongoose.Types.ObjectId.prototype.valueOf = function () {
  return this.toString();
};

const bookSchema = new Schema({
  title: String,
  author: { type: Schema.Types.Array, ref: "user" },
  paragraphs: { type: Schema.Types.Array, ref: "paragraph" },
  likes: { type: Number, default: 0 },
  comments: { type: Schema.Types.Array, ref: "comments" },

  genre: String,
  about: { type: Schema.Types.Array, ref: "bio" },
});

bookSchema.statics.like = function (id) {
  return Book.findById(id).then((book) => {
    ++book.likes;
    return book.save();
  });
};

bookSchema.statics.unlike = function (id) {
  return Book.findById(id).then((book) => {
    --book.likes;
    return book.save();
  });
};

const Book = mongoose.model("book", bookSchema);

module.exports = Book;
