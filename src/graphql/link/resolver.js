// src/graphql/variant/resolver.js
const httpError = require("http-errors")

exports.resolver = {
  Mutation: {
    addLink: async (root, data, { mongo: { Links }, user }) => {
      return await Links.create(data)
    }
  },
  Link: {
    postBy() {
      return {
        name: "",
        id: ""
      }
    }
  }
}
