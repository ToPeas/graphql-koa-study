// src/graphql/variant/resolver.js
const httpError = require("http-errors")

exports.resolver = {
  Mutation: {
    addLink: async (root, data, { mongo: { Links }, user }) => {
      if (!user) {
        throw new httpError(401, `请先登录`)
      } else {
        return await Links.create(data)
      }
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
