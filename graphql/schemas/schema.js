const { buildSchema } = require("graphql")
const { Stream } = require("stream")

module.exports = buildSchema(`

    type rootQuery {

    }

    type rootMutation {

    }

    schema {
        query: rootQuery
        mutation: rootMutation
    }
`)
