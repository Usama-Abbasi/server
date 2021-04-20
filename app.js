const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const expressPlayground = require("graphql-playground-middleware-express").default;
const port = process.env.PORT || 3000

const app = express();

// connect to mlab database
mongoose.connect('mongodb+srv://usamaabbasi:admin786abbasi@cluster0.omgrz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
mongoose.connection.once('open', () => {
    console.log('conneted to database');
});

// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}));
app.get("/playground", expressPlayground({ endpoint: "/graphql" }));

app.listen(port, () => {
    console.log('now listening for requests on port'+port);
});