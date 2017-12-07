const { graphql } = require("graphql/graphql")
const koa = require("koa")
const koaRouter = require("koa-router")
const koaBody = require("koa-bodyparser")
const { graphqlKoa, graphiqlKoa } = require("apollo-server-koa")
const schema = require("./schema")
const { execute, subscribe } = require("graphql")
// const {
//   createServer
// } = require("http")
const { SubscriptionServer } = require("subscriptions-transport-ws")
const { authenticate } = require("./authentication")
const mongo = require("./mongo-connector")
const buildDataloaders = require("./dataloader")
const formatError = require("./formatter")

const app = new koa()
const router = new koaRouter()
const PORT = 3003

const buildOptions = async ctx => {
  const user = await authenticate(ctx, mongo)
  return {
    context: {
      mongo,
      // dataloaders: buildDataloaders(mongo),
      ctx,
      user
    },
    schema,
    formatError,
    debug: false
  }
}

// 实现GraphQL接口功能
router.post("/graphql", koaBody(), graphqlKoa(buildOptions))

router.get(
  "/graphiql",
  graphiqlKoa({
    endpointURL: "/graphql"
    // passHeader: `'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5YzEyZTdkZTA4NTMxNDcwNDQ4NDQ0MyIsImlhdCI6MTUwNTg3NzgzN30.F_wd_uh3C7nhJq0nsw58htZWg9SbA9U2AsQtQIEU7bI'`
  })
)

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(PORT, () => {
  console.log(`服务已启动. graphiql => http://localhost:${PORT}/graphiql .`)
})

/*

graphql最大的特点就是声明api schema
首先定义api 的schema

主要的语法是 
type 类型名 {
  字段名 : 类型
}

除此之外还可以定义 query,mutation,subscription 等根类型

query 是获取数据
mutation 是支持对数据的增，删，改等操作
而 subscription 是用于监听数据的变动,并靠websocket等协议推送到订阅方

*/
