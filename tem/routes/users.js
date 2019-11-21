const router = require('koa-router')()
const Person =require("../dbs/module/person")
const jsonwebtoken=require("jsonwebtoken")
const User=require("../dbs/module/user")
const config=require("../dbs/config")
const {secret} =require("../dbs/config")       
//用户认证中间件
const jwt=require("koa-jwt")     

router.prefix('/users')

const auth=jwt({secret}) //放在修改用户 和 删除用户的接口里面

//校验用户中间件
const checkOwner=async function(ctx,next){
  if(ctx.request.body.id!==ctx.state.user.id){
    console.log("----"+ctx.params.id)
    console.log("----"+ctx.state.user.id)    
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
router.post("/updateUser",auth,async function(ctx){
  console.log("开始更新用户信息")
  console.log(ctx.request.body)
  ctx.verifyParams({
    id      :{type:"string",require:false},
    username:{type:"string",require:false},
    password:{type:"string",require:false},
  })
  const user= await  User.findByIdAndUpdate(ctx.request.body.id,
    ctx.request.body,{new: true} )
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
  //用jsonwebtoken生成token、
  const t= jsonwebtoken.sign({name,id},config.secret);//token刷新时间??
  ctx.body={
    token:t,
    msg:jsonwebtoken.verify(t,config.secret)
  };
})

//注销用户接口
router.post("/delUser", auth, checkOwner,async function(ctx){
  console.log(ctx.request.body)
  ctx.verifyParams({
    id:{type:"string",require:true}
  })
  const user= await User.findByIdAndRemove(ctx.request.body.id);
  ctx.body="删除成功";
})

//获取用户的粉丝
router.post("/:id/listFollowing",async function(ctx){
  const user=await User.findById(ctx.params.id).select("+following").
  populate("following");
  if(!user){ctx.throw(404);}
  ctx.body=user.following;//该用户关注了谁
})


//jwt 解析通过以后会把信息放进 state 域里面
//用户关注某人   当用户登录以后 ，根据id值来关注其他用户
router.post("/listFollowing/:id",auth, async function(ctx){
    //获取通过token登录的用户id
    console.log(ctx.state.user)
    const me=await User.findById(ctx.state.user.id).select("+following");
    console.log(me)
    //把被关注的用户id添加进following字段,following是一个数组
    //如果被关注的用户id已经在用户的列表里将不能关注
    if(!me.following.map(id=>id.toString()).includes(ctx.params.id)){
       me.following.push(ctx.params.id);
       me.save();
       ctx.body="关注成功"
    }else{
      ctx.body="用户已被关注"
    }
   
})

//取消关注某人
router.post("/unFollowing/:id",auth, async function(ctx){
  console.log(ctx.state.user)
  console.log(ctx.params.id)
  const me=await User.findById(ctx.state.user.id).select("+following");
  console.log(me)
  const index =me.following.map(id=>id.toString()).indexOf(ctx.params.id);
  console.log(index)
  //把被关注的用户id添加进following字段,following是一个数组
  if(index>-1){
     me.following.splice(index,1);
     me.save();
     ctx.body="取消关注成功"
  }else{
    ctx.body="未知错误"
  }
})

//获取粉丝的接口 
router.post("/getFollower/:id", async function(ctx){
  //查询所有粉丝 following字段里有 该用户的的用户
  const users=await User.find({following:ctx.params.id})
  ctx.body=users;
})

module.exports = router
