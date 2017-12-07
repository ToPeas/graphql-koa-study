const httpError = require("http-errors")
const { filter, find } = require("lodash")

const productMocks = [
  { id: 1, name: "Product A", shortDescription: "First product.", postBy: 1 },
  { id: 2, name: "Product B", shortDescription: "Second product.", postBy: 2 }
]

const variantMocks = [
  {
    id: 1,
    name: "Variant A",
    shortDescription: "First variant."
  },
  { id: 2, name: "Variant B", shortDescription: "Second variant." }
]

exports.resolver = {
  Query: {
    products(root, { id }, context) {
      const results = id ? productMocks.filter(p => p.id == id) : productMocks
      if (results.length) return results[0]
      else throw httpError(404, `Product with id ${id} does not exist.`)
    }
  },
  Product: {
    postBy: product => find(variantMocks, { id: product.postBy })
  },

  Mutation: {
    addProduct(root, product, context) {
      productMocks.push(product)
      return product
    }
  }
}
