exports.schema = `
type Product {
  id: ID!
  name: String!
  postBy: Variant!
  shortDescription: String
}
`
// Notice that we have omitted to wrap the above with 'type Query { }'
exports.query = `
  products(id: Int): Product
`

exports.mutation = `
  addProduct(id:Int, name:String,shortDescription:String):Product
`
