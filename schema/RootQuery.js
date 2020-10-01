const graphql = require("graphql");

const Bio = require("../models/Bio");
const Book = require("../models/Book");
const Comments = require("../models/Comments");
const Paragraph = require("../models/Paragraph");
const User = require("../models/User");

const Types = require("./Types");

const { BioType, BookType, CommentType, ParagraphType, UserType } = Types;

const { GraphQLObjectType, GraphQLID, GraphQLList, GraphQLNonNull } = graphql;

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    users: {
      type: new GraphQLList(UserType),
      async resolve(parentValue, args) {
        const user = await User.find({});
        return user;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return User.findById(id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parentValue, args) {
        return Book.find({});
      },
    },
    book: {
      type: BookType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Book.findById(id);
      },
    },
    comment: {
      type: CommentType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Comments.findById(id);
      },
    },
    about: {
      type: BioType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Bio.findById(id);
      },
    },
    paragraph: {
      type: ParagraphType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve(parentValue, { id }) {
        return Paragraph.findById(id);
      },
    },
    paragraphs: {
      type: new GraphQLList(ParagraphType),
      resolve(parentValue, args) {
        return Paragraph.find({});
      },
    },
  },
});

module.exports = RootQuery;
