const { makeExecutableSchema } = require("graphql-tools")
const path = require("path")
const { merge } = require("lodash")
const { glue } = require("schemaglue")
const { schema, resolver } = glue("src/graphql")
module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers: resolver
})
