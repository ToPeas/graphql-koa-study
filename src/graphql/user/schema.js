exports.schema = `
type User {
  id: ID!
  username: String!
  password: String!
  role:String!
  CreateTime:String!
  LastLoginTime:String!
}



type SigninPayload {
  token: String!
}




`
// Notice that we have omitted to wrap the above with 'type Query { }'
// exports.query = `
//   // user(username:Sting,password:String):User
// `

exports.mutation = `
  addUser(username:String!,password:String!):User
  signIn(username:String!,password:String!):SigninPayload
`
