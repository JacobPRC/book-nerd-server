const graphql = require("graphql");

const Bio = require("../models/Bio");
const Book = require("../models/Book");
const Comments = require("../models/Comments");
const Paragraph = require("../models/Paragraph");
const User = require("../models/User");

const Types = require("./Types");
const RootQuery = require("./RootQuery");

const { BioType, BookType, CommentType, ParagraphType, UserType } = Types;

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLInt,
} = graphql;

const mutation = new GraphQLObjectType({
  name: "Muatation",
  fields: {
    addUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt },
        livesIn: { type: GraphQLString },
      },
      resolve(parentValue, { name, age, livesIn }) {
        return new User({ name, age, livesIn }).save();
      },
    },
    addBioToUser: {
      type: BioType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { content, id }) {
        return User.findById(id).then((user) => {
          const bio = new Bio({ content });
          return bio
            .save()
            .then(() => (user.bio = bio))
            .then(() => user.save())
            .then(() => console.log(user));
        });
      },
    },
    editUserBio: {
      type: BioType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        content: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id, content }) {
        return Bio.findOneAndUpdate({ _id: id }, { content });
      },
    },
    addUserAge: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, { id, age }) {
        return User.findOneAndUpdate({ _id: id }, { age });
      },
    },
    editUserAge: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parentValue, { id, age }) {
        return User.findOneAndUpdate({ _id: id }, { age });
      },
    },
    addUserLivesIn: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        livesIn: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id, livesIn }) {
        return User.findOneAndUpdate({ _id: id }, { livesIn });
      },
    },
    editUserLivesIn: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        livesIn: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id, livesIn }) {
        return User.findOneAndUpdate({ _id: id }, { livesIn });
      },
    },
    deleteUser: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.remove({ _id: id });
      },
    },
    addBook: {
      type: BookType,
      args: {
        genre: { type: GraphQLString },
        title: { type: new GraphQLNonNull(GraphQLString) },
        authorId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { genre, title, authorId }) {
        return User.findById(authorId).then((user) => {
          const book = new Book({ genre, title, author: user })
            .save()
            .then((book) =>
              User.findOneAndUpdate(
                { _id: authorId },
                {
                  $push: { books: book },
                }
              ).then((user) => user.save())
            );
        });
      },
    },
    editBookTitle: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id, title }) {
        return Book.findByIdAndUpdate({ _id: id }, { title });
      },
    },
    deleteBook: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Book.findOneAndDelete({ _id: id });
      },
    },
    addGenreToBook: {
      type: BookType,
      args: {
        genre: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { genre, id }) {
        return Book.findOneAndUpdate({ _id: id }, { genre });
      },
    },
    addBioToBook: {
      type: BioType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { content, id }) {
        return Book.findById(id).then((book) => {
          const bio = new Bio({ content });
          return bio
            .save()
            .then(() => (book.about = bio))
            .then(() => book.save());
        });
      },
    },
    editBookBio: {
      type: BioType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { id, content }) {
        return Bio.findOneAndUpdate({ _id: id }, { content });
      },
    },
    addCommentToBook: {
      type: CommentType,
      args: {
        comment: { type: new GraphQLNonNull(GraphQLString) },
        bookId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parentValue, { comment, bookId }) {
        return Book.findById(bookId).then((book) => {
          return new Comments({ comment, book }).save().then((comment) =>
            Book.findOneAndUpdate(
              { _id: bookId },
              {
                $push: { comments: comment },
              }
            )
          );
        });
      },
    },
    editBookComment: {
      type: CommentType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        bookId: { type: new GraphQLNonNull(GraphQLID) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      //   db.students.updateOne(
      //     { _id: 4, "grades.grade": 85 },
      //     { $set: { "grades.$.std" : 6 } }
      //  )
      async resolve(parentValue, { id, comment, bookId }) {
        const updatedComment = await Comments.findOneAndUpdate(
          { _id: id },
          { comment }
        );
        return Book.updateOne(
          { _id: bookId, "comments._id": updatedComment._id },
          { $set: { "comments.$.comment": updatedComment.comment } }
        );
      },
    },
    deleteBookComment: {
      type: BookType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        bookId: { type: new GraphQLNonNull(GraphQLID) },
      },
      // Does not work -- EDIT
      resolve(parentValue, { id, bookId }) {
        return Book.update(
          { _id: bookId },
          { $pull: { comments: { _id: id } } }
        );
      },
    },
    likeBook: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Book.like(id);
      },
    },
    unlikeBook: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Book.unlike(id);
      },
    },
    likeParagraph: {
      type: ParagraphType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Paragraph.like(id);
      },
    },
    unlikeParagraph: {
      type: ParagraphType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Paragraph.unlike(id);
      },
    },
    likeComment: {
      type: CommentType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Comments.like(id);
      },
    },
    unlikeComment: {
      type: CommentType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Comments.unlike(id);
      },
    },
  },
});

//  AddParagraphToBook editBookParagraph deleteBookParagraph AddCommentTOParagraph
// editParagraphComment deleteParagraphComment
//likeParagraph likeComment

//okay so real talk, ONLY issue is that nested content does not reflect actual model
// What's happening? For some reason, nested content is being saved as a copy of what is originally put in it
// like this: const obj = {key: 1} then const obj2 = obj; then we change obj ie obj.key = 2
//now obj.key = 2, but obj2.key still = 1. This is what's happening w/ my db... why???

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
