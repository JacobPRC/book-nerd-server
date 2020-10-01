const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentsSchema = new Schema({
  paragraph: { type: Schema.Types.ObjectId, ref: "paragraph" },
  book: { type: Schema.Types.ObjectId, ref: "book" },
  comment: String,
  likes: { type: Number, default: 0 },
});

const Comments = mongoose.model("comments", commentsSchema);

module.exports = Comments;
