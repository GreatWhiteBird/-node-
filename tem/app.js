const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const koabody = require('koa-body')
const logger = require('koa-logger')
const path=require("path")
//mongodb
const mongoose =require("mongoose")
const dbConfig=require("./dbs/config")
//使用koa-paremeter校验参数
const parameter =require("koa-parameter")
//使用koa-json-err进行错误处理
const err=require("koa-json-error")
//生成图片链接
const koaStatic=require("koa-static")

//引进路由
const index = require('./routes/index')
const users = require('./routes/users')
const home=require("./routes/home")
const topics=require("./routes/topics")

// error handler
onerror(app)

// middlewares
//使用koa-body上传图片
app.use(koabody({
  multipart:true,
  formidable:{
    uploadDir:path.join(__dirname,"/public/upload"),//上传目录
    keepExtensions:true
  }   
}))
app.use(koaStatic(path.join(__dirname,"public")))

app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))
app.use(parameter(app))
app.use(err({
  preFormat:(e,{stack,...rest})=>process.eventNames.NODE_ENV
  ==="production"?rest:{stack,...rest}
}))
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(home.routes(), home.allowedMethods())
app.use(index.routes(), index.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(topics.routes(), topics.allowedMethods())
mongoose.connect(dbConfig.dbs,{
  useNewUrlParser:true,
  useUnifiedTopology: true
},function(err ,res){
  if(err) throw err;
  console.log("数据库已连接成功-----------------")
}
)
// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
