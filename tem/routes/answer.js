const router = require('koa-router')()
const jwt=require("koa-jwt")   
const {secret} =require("../dbs/config")    
const auth=jwt({secret})
const Answer=require("../dbs/module/answers")
const Question=require("../dbs/module/question")

router.prefix('/answer')
//校验 答案是否存在的接口
const checkAnswer=async function(ctx, next){
    const answer=Answer.findById(ctx.params.id).select("+answerer");
    if(!answer){ctx.throw(404,"答案不存在")} 
    ctx.state.answer = answer;
    await next();
  
  }



//新建答案接口 id:问题的id
router.post("/insAnswer",auth,async function(ctx){
    const answer =await new Answer({
        content:ctx.request.body.content,//答案内容
        questionId:ctx.request.body.questionId,//问题的id
        voteCount:ctx.request.body.voteCount, //投票数
        answerer:ctx.state.user.id,//回答问题的人的id  
    }).save()
    ctx.body=answer;
})
 
//删除答案 id：答案的id
router.post("/delAnswer/:id",auth, checkAnswer,async function(ctx){
    console.log(ctx.params.id)
     const answer= await Answer.findByIdAndRemove(ctx.params.id)
    if(!answer){ctx.throw(404,"答案不存在")}
    ctx.body="删除成功"
})

//修改答案的 id：答案的id
router.post("/updAnswer",auth,checkAnswer,async function(ctx){
    const answer=await Answer.findByIdAndUpdate(ctx.request.body.id,ctx.request.body);
    ctx.body=answer
})


//根据问题查找答案   id：问题的id 
router.post("/findAnswer/:questionId",auth,checkAnswer,async function(ctx){
    console.log(ctx.params)
    const answer=await Answer.find(ctx.params);
    ctx.body=answer
})

module.exports = router