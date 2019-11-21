const router = require('koa-router')()
const Person =require("../dbs/module/person")
  
//用户认证中间件



router.get('/', function (ctx, next) {
    ctx.body = 'this is a users response!'
  })
  
  router.get('/bar', function (ctx, next) {
    ctx.body = 'this is a users/bar response'
  })
  
  //获取路由参数：ctx.params上
  router.get('/add/:id',function(ctx,next){
    //获取请求体的参数 
    console.log("-------------------")
    console.log(ctx.params);
  
  })
  
  //获取get参数：ctx.query
  router.get('/add2',function(ctx,next){
    //获取请求体的参数 
    console.log("-------------------")
     console.log(ctx.query);
  
  })
  
  //获取post参数：ctx.request.body 请求体需要josn格式或者表单格式
  router.post('/add3',function(ctx,next){
    //获取请求体的参数 
    console.log("-----2--------------")
     console.log(ctx.request.body);
  
  })
  
  //增加--添加数据,请求参数必须是jons格式的请求体
  router.post('/addUser',async function(ctx,next){
    //获取请求体的参数 
    console.log("-----2--------------")
    //  console.log(ctx.request.body);
    //  console.log(ctx.request.body.name)
    const person=new Person({
      name:ctx.request.body.name,
      age:ctx.request.body.age,
      sex:ctx.request.body.sex,
      classes:ctx.request.body.classes
    })
    await person.save(function(err,res){
      if(err)return handleError(err);
      ctx.body={
        code:0,
        res,
      }
    })
  })
  
  //查询数据库信息
  router.post("/getUser",async function(ctx,next){
    console.log(ctx.request.body)
    const results=await Person.find({ //如果有参数就匹配结果并返回，没有参数就返回所有数据
     name:ctx.request.body.name,age:ctx.request.body.age
    }) 
     ctx.body={
      code:0,
      // result,
      results
    }
  })
  
  module.exports = router