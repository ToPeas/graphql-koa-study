const koa = require('koa')
const koaRouter = require('koa-router')
const koaBody = require('koa-bodyparser')
const { graphqlKoa, graphiqlKoa } = require('apollo-server-koa')

const schema = require('./schema')


const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const { SubscriptionServer } = require('subscriptions-transport-ws');

const app = new koa()
const router = new koaRouter()
const PORT = 3003

const { authenticate } = require('./authentication')
const mongo = require('./mongo-connector')

const buildDataloaders = require('./dataloader');


const formatError = require('./formatter');

const buildOptions = async ctx => {
  const user = await authenticate(ctx, buildDataloaders(mongo));
  return {
    context: { mongo, user, dataloaders: buildDataloaders(mongo) },
    schema,
    formatError,
    debug: false,
  };
};

// const buildOptions = async ctx => {
//   const user = await authenticate(ctx, buildDataloaders(mongo));
//   return {
//     context: { mongo, user, dataloaders: buildDataloaders(mongo) },
//     schema,
//     debug: false,
//   };
// };

// 实现GraphQL接口功能
router.post('/graphql', koaBody(), graphqlKoa(buildOptions))

// router.post(
//   '/graphql',
//   koaBody(),
//   graphqlKoa({
//     context: { Links },
//     schema
//   })
// )
// router.get(
//   '/graphql',
//   graphqlKoa({
//     context: { Links },
//     schema
//   })
// )

router.get(
  '/graphiql',
  graphiqlKoa({
    endpointURL: '/graphql',
    passHeader: `'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5YzEyZTdkZTA4NTMxNDcwNDQ4NDQ0MyIsImlhdCI6MTUwNTg3NzgzN30.F_wd_uh3C7nhJq0nsw58htZWg9SbA9U2AsQtQIEU7bI'`
  })
)

// router.post('/graphql', koaBody(), graphqlKoa({ schema }));
// router.get('/graphql', graphqlKoa({ schema }));
// router.get('/graphiql', graphiqlKoa({ endpointURL: '/graphql' }))

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT, () => {
  console.log(
    `Server is running. Test server on http://localhost:${PORT}/graphiql .`
  )
})
