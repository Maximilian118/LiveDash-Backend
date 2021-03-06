const express = require("express")
const mongoose = require("mongoose")
const graphqlHTTP = require("express-graphql")

// Import Graphql Schema and Resolvers.
const Schema = require("./graphql/schemas/schema")
const Resolvers = require("./graphql/resolvers/resolvers")

// Import token authentication middleware.
const auth = require("./middleware/auth")

// Initialise express with Node.js
const app = express()
app.use(express.json())

// Handle CORS Errors.
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    )
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    if (req.method === "OPTIONS") {
        return res.sendStatus(200)
    }
    next()
})

// Make token authentication middleware available in all reducers by passing req.
app.use(auth)

// Initialise Graphql with the /graphql endpoint.
app.use(
    "/graphql",
    graphqlHTTP({
        schema: Schema,
        rootValue: Resolvers,
        graphiql: true,
    })
)

// Error filters.
app.use((req, res, next) => {
    const err = new Error("URL Not Found")
    err.status = 404
    next(err)
})

// Connect to the MongoDB Atlas Database. If no port is specified in CLI use port 3001.
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@livedash-6qeiq.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`, { useNewUrlParser: true, useCreateIndex: true })
    .then(res => {
        const PORT = process.env.PORT || 3001
        app.listen(PORT, () =>
            console.log(`[app.js] Server started on port ${PORT}`)
        )
    })
    .catch(err => {
        console.log(err)
    })
