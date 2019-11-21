const router = require('koa-router')()
const Topics=require("../dbs/module/topics")
const Question=require("../dbs/module/question")
const jwt=require("koa-jwt")   
const {secret} =require("../dbs/config")    
const auth=jwt({secret}) 
  
router.prefix('/topics')
//增加话题接口 
router.post("/create",auth, async function(ctx){
        ctx.verifyParams({
            topicsName:{type:"string",require:true},
            avatar_url:{type:"string",require:true},
            introduction:{type:"string",require:true},
        })
        const topics=await  Topics({
            topicsName:ctx.request.body.topicsName,
            avatar_url:ctx.request.body.avatar_url,
            introduction:ctx.request.body.introduction,
        }).save();
        ctx.body={
            topics
        }
    
});
//查找所有话题 分页查询 
router.post("/find",async function(ctx){
    //  const { per_pag = 3}=ctx.query;
    console.log(ctx.query.page)
    const page=Math.max(ctx.query.page);//每页个数
    const perPag=Math.max(ctx.query.per_pag),//第几页
    topics=await Topics.find(
        //对需要模糊查询的字段添加正则表达式
        {topicsName:new RegExp(ctx.query.keyword)} 
    ).limit(page).skip(perPag*page); //skip是跳过第几个，limit显示几个数据几个数据
        ctx.body=topics
        
    
});

//校验话题是否存在的中间件
const checkTopicExist= async function(ctx,next){
    const id=ctx.params.id;
    const topics= await Topics.findById(id);
    if(!topics){
        ctx.throw(404,"话题不存在")  
    }
    console.log("话题存在")
    await next();
} 


//获取特定话题的内容
router.post("/findById/:id",auth, checkTopicExist,async function (ctx){
    const usertTopics= await Topics.findById(ctx.params.id).select("+introduction");
    ctx.body=usertTopics
})


//修改话题内容
router.post("/updateTopic/:id",checkTopicExist,async function(ctx){
    const usertTopics=await Topics.findOneAndUpdate(ctx.request.body.id,
        ctx.request.body,{new:true},function(err,doc){
           if(err) ctx.body=err;
           ctx.body={
            msg:"修改成功",
            doc
           }
        },
    ).select("+introduction")
})


//列出该话题的所有的问题以及提问者的信息
router.post("/listQuestion/:id",async function(ctx){
    ctx.body=await Question.find({topics:ctx.params.id}).populate("questioner")
  
})
module.exports = router