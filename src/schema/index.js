const { makeExecutableSchema } = require('graphql-tools')
const resolvers = require('./resolvers')

const typeDefs = `


type SigninPayload {
  token: String
  user: User
}

type Link {
  id: ID!
  url: String!
  description: String!
  postedBy: User!
  votes: [Vote!]!
}

type Vote {
  id:ID!
  user:User!
  link:Link!
}

type User {
  id: ID!
  name: String!
  password: String!
  votes: [Vote!]!
}

input LinkFilter {
  description_contains: String
  url_contains: String
}

type Query {
  allLinks(filter: LinkFilter, skip: Int, first: Int): [Link!]!
}

type Mutation {
  createLink(url: String!, description: String!): Link
  createVote(linkId: ID!): Vote
  createUser(name: String!, password: String!): User
  signinUser(name: String!, password: String!): SigninPayload!
}

`

module.exports = makeExecutableSchema({ typeDefs, resolvers })
