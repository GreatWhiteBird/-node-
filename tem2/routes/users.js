const router = require('koa-router')()
const Person =require("../dbs/module/person")
const token=require("jsonwebtoken")
const User=require("../dbs/module/user")
const config=require("../dbs/config")
router.prefix('/users')

//用户认证中间件
const jwt=require("koa-jwt")
const auth=jwt(config.secret)
//校验用户中间件
const checkOwner=async function(ctx,next){
  if(ctx.params.id!==ctx.state.user.id){
    ctx.throw(404,"该用户没有权限")
  }
  await next();
}


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

//注册用户 
router.post("/regist",async function(ctx){
  console.log(ctx.request.body)
  ctx.verifyParams({
    username:{type:'string',require:true},
    password:{type:'string',require:true}
  });

  const user =await new User({
    username:ctx.request.body.username,
    password:ctx.request.body.password
  }).save();
  
  ctx.body={
    code:0,
    user
  }

})

//获取用户列表
router.post("/getUsers",async function(ctx){
  const user=await User.find();
  ctx.body={
    user
  }
})

//修改用户信息
router.post("/updateUser", auth,async function(ctx){
  ctx.verifyParams({
    id:{type:"string",require:false},
    username:{type:"string",require:false},
    password:{type:"string",require:false},
  })
  const user= await  User.findByIdAndUpdate(ctx.request.body.id,
    ctx.request.body)
  if(!user){
    ctx.throw(404,"用户不存在")
  }
  ctx.body=user;

})
  
//jwt实现用户登录 
router.post("/login",async function(ctx){
  console.log(ctx.request.body);
  ctx.verifyParams({
    username:{type:"string",require:true},
    password:{type:"string",require:true},
  })
  const user=await  User.findOne(ctx.request.body);
  if(!user){
    ctx.throw(404,"用户名或密码错误")
  }
  const id=user._id;
  console.log(user);
  const name=user.username
  const t= token.sign({name,id},config.secret);//token刷新时间
  ctx.body={
    token:t,
    msg:token.verify(t,config.secret)
  };
})

router.post("/delUser",async function(ctx){
  const user= User.findByIdAndRemove(ctx.request.body._id);
  ctx.body=user;
})
module.exports = router
