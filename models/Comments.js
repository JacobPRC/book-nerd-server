const mongoose = require("mongoose");

const { Schema } = mongoose;

const commentsSchema = new Schema({
  paragraph: { type: Schema.Types.ObjectId, ref: "paragraph" },
  book: { type: Schema.Types.ObjectId, ref: "book" },
  comment: String,
  likes: { type: Number, default: 0 },
});

commentsSchema.statics.like = function (id) {
  return Comments.findById(id).then((comment) => {
    ++comment.likes;
    return comment.save();
  });
};

commentsSchema.statics.unlike = function (id) {
  return Comments.findById(id).then((comment) => {
    --comment.likes;
    return comment.save();
  });
};

const Comments = mongoose.model("comments", commentsSchema);

module.exports = Comments;
