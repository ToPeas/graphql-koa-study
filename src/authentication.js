const jwt = require("jsonwebtoken")
const { SECRET } = require("./config")

module.exports.authenticate = async (ctx, { Users }) => {
  if (!ctx.header || !ctx.header.authorization) {
    return
  }

  const parts = ctx.header.authorization.split(" ")

  console.log(parts)
  if (parts.length === 2) {
    const scheme = parts[0]
    const token = parts[1]

    if (/^Bearer$/i.test(scheme)) {
      const { id } = jwt.verify(token, SECRET)
      const res = await Users.findOne({ _id: id })
      console.log("res\n", res)
      return res
    }
  }
}
