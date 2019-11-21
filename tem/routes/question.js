const router = require('koa-router')()
const Question=require("../dbs/module/question")
const jwt=require("koa-jwt")   
const {secret} =require("../dbs/config")    
const auth=jwt({secret}) 
  
router.prefix('/question')
//新建问题接口 
router.post("/create",auth, async function(ctx){
        console.log("开始新建问题--------------")
        ctx.verifyParams({
            title:{type:"string",require:true},
            descrption:{type:"string",require:true},
            
        })
        const question=await  Question({...ctx.request.body,questioner:ctx.state.user.id}).save()
        ctx.body=question;  
});

//查找所有问题  分页查询 
router.post("/find",async function(ctx){
    //  const { per_pag = 3}=ctx.query;
    console.log(ctx.query.page)
    const page=Math.max(ctx.query.page);//每页个数
    const perPag=Math.max(ctx.query.per_pag),//第几页
    question=await Question.find(
        //对需要模糊查询的字段添加正则表达式
        {title:new RegExp(ctx.query.keyword)} 
    ).limit(page).skip(perPag*page).select("+questioner");; //skip是跳过第几个，limit显示几个数据几个数据
        ctx.body=question
        
    
});

//校验问题是否存在的中间件
const checkQuestionExist= async function(ctx,next){
    const id=ctx.params.id;
    const question= await Question.findById(id).select("+questioner");
    if(!question){
        ctx.throw(404,"问题不存在")  
    }
    console.log("问题存在----"+question)
    ctx.state.question=question;
    await next();
} 

//校验是否是提问者中间件
const checkQuestioner=async function(ctx,next){
    console.log("ctx.state.question.questioner----"+ctx.state.question.questioner)
    console.log("ctx.state.user.id----"+ctx.state.user.id)     
    if(ctx.state.user.id!=ctx.state.question.questioner){  
     ctx.throw(404,"该用户没有权限--")
    }
    await next();
  }

//获取指定问题的内容(所属话题，提问者)
router.post("/findById/:id", checkQuestionExist,async function (ctx){
    const question= await Question.findById(ctx.params.id).populate("questioner topics")//populate???
    ctx.body=question
})


//修改问题内容
router.post("/updateQuestion/:id",auth,checkQuestionExist,checkQuestioner,async function(ctx){
    const question=await Question.findByIdAndUpdate(ctx.params.id,
        ctx.request.body,{new:true},function(err,doc){
           if(err) ctx.body=err;
           ctx.body={
            msg:"修改成功",
            doc
           }
        },
    ).select("+questioner")
})


//删除问题 params:需要删除的问题的id
router.post("/delQuestion/:id",auth, checkQuestionExist,checkQuestioner,async function (ctx){
    const question= await Question.findByIdAndRemove(ctx.params.id,function(err,res){
        if(err){ctx.throw(404,"删除失败")}
        ctx.body={
            msg:"删除问题成功",
            res:res};
    })

    
})

module.exports = router