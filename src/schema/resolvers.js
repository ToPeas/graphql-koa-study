// const links = [
//   {
//     id: 1,
//     url: 'http://graphql.org/',
//     description: 'The Best Query Language'
//   },
//   {
//     id: 2,
//     url: 'http://dev.apollodata.com',
//     description: 'Awesome GraphQL Client'
//   }
// ]

// module.exports = {
//   Query: {
//     allLinks: () => links
//   },
//   Mutation: {
//     createLink: (_, data) => {
//       const newLink = Object.assign({ id: links.length + 1 }, data)
//       links.push(newLink)
//       return newLink
//     }
//   }
// }

// module.exports = {
//   Query: {
//     allLinks: async (root, data, { Links }) => {
//       return await Links.find()
//     }
//   },
//   Mutation: {
//     createLink: async (root, data, { Links }) => {
//       return await Links.create(data)
//     }
//   }
// }

const jwt = require('jsonwebtoken')
const { SECRET } = require('../config')
const { URL } = require('url')

class ValidationError extends Error {
  constructor(message, field) {
    super(message)
    this.field = field
  }
}

class authenticationError extends Error {
  constructor(message, hint) {
    super(message)
    this.hint = hint
  }
}

function assertValidLink({ url }) {
  try {
    new URL(url)
  } catch (error) {
    throw new ValidationError('Link validation error: invalid url.', 'url')
  }
}

module.exports = {
  Mutation: {
    createLink: async (root, data, { mongo: { Links }, user }) => {
      if (!user) {
        throw new authenticationError(
          'User authentication error: please bear your token in header.',
          'You will get the token after login.'
        )
      }
      assertValidLink(data)
      const newLink = Object.assign({ postedById: user._id }, data)
      return await Links.create(newLink)
    },
    createUser: async (root, data, { mongo: { Users } }) => {
      return await Users.create(data)
    },
    createVote: async (root, data, { mongo: { Votes }, user }) => {
      if (!user) throw new Error('Unauthorized')
      const newVote = Object.assign({ userId: user._id }, data)
      return await Votes.create(newVote)
    },
    signinUser: async (root, data, { mongo: { Users } }) => {
      // console.log(root)
      // console.log(data)
      // console.log(Users)
      const user = await Users.findOne({ name: data.name })
      if (data.password === user.password) {
        return {
          token: jwt.sign({ id: user.id }, SECRET),
          user
        }
      }
    }
  },
  User: {
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
      return await Votes.find({ userId: _id })
    }
  },
  Vote: {
    user: async ({ userId }, data, { dataloaders: { userLoader } }) => {
      return await userLoader.load(userId)
    },
    link: async ({ linkId }, data, { dataloaders: { linkLoader } }) => {
      return await linkLoader.load(linkId)
    }
  },
  Link: {
    postedBy: async ({ postedById }, data, { dataloaders: { userLoader } }) => {
      return await userLoader.load(postedById)
    },
    votes: async ({ _id }, data, { mongo: { Votes } }) => {
      return await Votes.find({ linkId: _id })
    }
  },
  Query: {
    allLinks: async (root, { filter, first, skip }, { mongo: { Links } }) => {
      let query = {}
      first = first || 0
      skip = skip || 0
      if (filter) {
        let { url_contains, description_contains } = filter
        if (url_contains) {
          query.url = { $regex: new RegExp(`${url_contains}`), $options: 'i' }
        }
        if (description_contains) {
          query.description = {
            $regex: new RegExp(`${description_contains}`),
            $options: 'i'
          }
        }
      }
      return await Links.find(query)
        .limit(first)
        .skip(skip)
    }
  }
}
