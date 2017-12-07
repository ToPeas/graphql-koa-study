// src/graphql/variant/resolver.js
const httpError = require("http-errors")

const variantMocks = [
  {
    id: 1,
    name: "Variant A",
    shortDescription: "First variant."
  },
  { id: 2, name: "Variant B", shortDescription: "Second variant." }
]

const productMocks = [
  { id: 1, name: "Product A", shortDescription: "First product.", postBy: 1 },
  { id: 2, name: "Product B", shortDescription: "Second product.", postBy: 2 }
]

exports.resolver = {
  Query: {
    variants(root, { id }, context) {
      const results = id ? variantMocks.filter(p => p.id == id) : variantMocks
      if (results) return results
      else throw httpError(404, `Variant with id ${id} does not exist.`)
    }
  }
}
