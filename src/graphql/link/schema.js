exports.schema = `
type Link {
  id: ID!
  name: String!
  url: String!
  description: String!
  postBy: Variant!
}
`
// Notice that we have omitted to wrap the above with 'type Query { }'
exports.query = `
  links(id: Int): Link
`

exports.mutation = `
  addLink(name:String,url:String,description:String):Link
`
