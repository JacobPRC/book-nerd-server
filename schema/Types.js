const graphql = require("graphql");

const Bio = require("../models/Bio");
const Book = require("../models/Book");
const Comments = require("../models/Comments");
const Paragraph = require("../models/Paragraph");
const User = require("../models/User");

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLList,
  GraphQLBoolean,
  GraphQLInt,
} = graphql;

const resolveQuery = (db, doc) => {
  return db[doc].map((item) => {
    item.id = item._id;
    return item;
  });
};

const BioType = new GraphQLObjectType({
  name: "Bio",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parentValue, args) {
        return Bio.findById(parentValue.id).then((bio) =>
          resolveQuery(bio, "user")
        );
      },
    },
  }),
});

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    likes: { type: GraphQLInt },
    genre: { type: GraphQLString },
    about: {
      type: new GraphQLList(BioType),
      resolve(parentValue, args) {
        return Book.findById(parentValue.id).then((book) =>
          resolveQuery(book, "about")
        );
      },
    },
    author: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return Book.findById(parentValue.id).then((book) =>
          resolveQuery(book, "author")
        );
      },
    },
    paragraphs: {
      type: new GraphQLList(ParagraphType),
      resolve(parentValue, args) {
        return Book.findById(parentValue.id).then((book) =>
          book.paragraphs.map((book) => resolveQuery(book, "paragraphs"))
        );
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parentValue, args) {
        return Book.findById(parentValue.id).then((book) => resolveQuery(book));
      },
    },
  }),
});

const CommentType = new GraphQLObjectType({
  name: "Comment",
  fields: () => ({
    comment: { type: GraphQLString },
    likes: { type: GraphQLInt },
    paragraph: {
      type: ParagraphType,
      resolve(parentValue, args) {
        return Comments.findById(parentValue.id).then((comment) =>
          resolveQuery(comment, "paragraph")
        );
      },
    },
    book: {
      type: BookType,
      resolve(parentValue, args) {
        return Comments.findById(parentValue.id).then((comment) =>
          resolveQuery(comment, "book")
        );
      },
    },
  }),
});

const ParagraphType = new GraphQLObjectType({
  name: "Paragraph",
  fields: () => ({
    id: { type: GraphQLID },
    content: { type: GraphQLString },
    likes: { type: GraphQLInt },
    author: {
      type: UserType,
      resolve(parentValue, args) {
        return Paragraph.findById(parentValue.id).then((paragraph) =>
          resolveQuery(paragraph, "author")
        );
      },
    },
    comments: {
      type: new GraphQLList(CommentType),
      resolve(parentValue, args) {
        return Paragraph.findById(parentValue.id).then((paragraph) =>
          resolveQuery(paragraph, "comments")
        );
      },
    },
    book: {
      type: BookType,
      resolve(parentValue, args) {
        return Paragraph.findById(parentValue.id).then((paragraph) =>
          resolveQuery((paragraph, "book"))
        );
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    loggedIn: { type: GraphQLBoolean },
    age: { type: GraphQLInt },
    livesIn: { type: GraphQLString },
    bio: {
      type: BioType,
      resolve(parentValue, args) {
        return User.findById(parentValue.id)
          .populate("bio")
          .then((user) => user.bio);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parentValue, args) {
        return User.findById(parentValue.id).then((user) =>
          resolveQuery(user, "books")
        );
      },
    },
  }),
});

module.exports = {
  BioType,
  BookType,
  CommentType,
  ParagraphType,
  UserType,
};
