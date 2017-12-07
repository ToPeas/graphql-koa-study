const httpError = require("http-errors")
const { SECRET } = require("../../config")
const jwt = require("jsonwebtoken")
exports.resolver = {
  Mutation: {
    addUser: async (root, data, { mongo: { Users } }) => {
      try {
        const res = await Users.create(data)
        return res
      } catch (e) {
        throw httpError(400, `参数错误`)
      }
    },
    signIn: async (root, { username, password }, { mongo: { Users } }) => {
      try {
        const user = await Users.findOne({ username })
        console.log(user)
        if (password === user.password) {
          return {
            token: jwt.sign({ id: user._id }, SECRET),
            user
          }
        }
      } catch (e) {
        throw httpError(400, `参数错误`)
      }
    }
  }
}
