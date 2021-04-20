const graphql = require('graphql');
const Book = require('../models/book');
const Author = require('../models/Author');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
} = graphql;

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return Author.findById(parent.authorId);
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: ( ) => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({ authorId: parent.id });
            }
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args){
                return Author.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return Book.find({});
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                return Author.find({});
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve(parent, args){
                let author = new Author({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        },
        updateAuthor:{
            type: AuthorType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                name:{type:new GraphQLNonNull(GraphQLString)},
                age:{type:new GraphQLNonNull(GraphQLInt)}
            },
            resolve:async (parent,args)=>{
                const updateAuthor=await Author.findByIdAndUpdate(args.id,args);
                if(!updateAuthor){
                    throw new Error('Error')
                }
                return updateAuthor
            }
        },
        updateBook:{
            type:BookType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},
                name:{type:new GraphQLNonNull(GraphQLString)},
                genre:{type:new GraphQLNonNull(GraphQLString)},


            },
            resolve:async (parent,args)=>{
                const updateBook=await Book.findByIdAndUpdate(arsgs.id,arsgs);
                if(!updateBook){
                    throw new Error("Error") 
                }
                return updateBook
            }
        },
        deleteAuthor:{
            type:AuthorType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)},

            },
            resolve:async (parent,args)=>{
                const deleteAuthor=await Author.findByIdAndRemove(args.id);
                if(!deleteAuthor){
                    throw new Error('Error');
                }
                return deleteAuthor;

            }
        },
        deleteBook:{
            type:BookType,
            args:{
                id:{type:new GraphQLNonNull(GraphQLID)}
            },
            resolve:async (parent,args)=>{
                const deleteBook=await Book.findByIdAndRemove(args.id);
                if(!deleteBook){
                    throw new Error('error');
                }
                return deleteBook;
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});