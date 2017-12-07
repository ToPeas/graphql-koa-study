const mongoose = require("mongoose")
const Schema = mongoose.Schema
const MONGO_URL = "mongodb://localhost:27017/hackernews"
const Logger = mongoose.mongo.Logger

let logCount = 0
Logger.setCurrentLogger((msg, state) => {
  console.log(`MONGO DB REQUEST No. ${++logCount}`)
})
Logger.setLevel("debug")
Logger.filter("class", ["Cursor"])

const linkSchema = new Schema({
  url: String,
  description: String,
  name: String,
  postedById: Schema.Types.ObjectId
})

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URL, { useMongoClient: true })

// module.exports = mongoose.model('Links', linkSchema)

const userSchema = new Schema({
  id: {
    type: Schema.Types.ObjectId
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  CreateTime: { type: Date, default: Date.now },
  lastLoginTime: { type: Date, default: Date.now },
  role: {
    type: String,
    enum: ["admin", "vistor"],
    default: "vistor"
  }
})

const VoteSchema = new Schema({
  userId: Schema.Types.ObjectId,
  linkId: Schema.Types.ObjectId
})

module.exports = {
  Links: mongoose.model("Links", linkSchema),
  Users: mongoose.model("Users", userSchema),
  Votes: mongoose.model("Votes", VoteSchema)
}
