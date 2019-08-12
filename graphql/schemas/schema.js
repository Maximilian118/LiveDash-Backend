const { buildSchema } = require("graphql")
const { Stream } = require("stream")

module.exports = buildSchema(`
  type User {
    _id: ID!
    email: String!
    img: String
    token: String
    tokenExpiry: Int
  }

  type rootQuery {
    user: User
  }

  type rootMutation {
    auth(email: String!, password: String!): User
  }

  schema {
    query: rootQuery
    mutation: rootMutation
  }
`)
