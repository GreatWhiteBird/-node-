const mongoose =require( "mongoose")
const Schema=mongoose.Schema;
let commentsSchema= new mongoose.Schema({
    __v:{type:String,select:false},
    content:{type:String,require:true},//评论内容
    commentator:{type:Schema.Types.ObjectId,ref:"User",require:true},//评论的人
    questionId:{type:String,require:true,select:false},//问题的id
    answerId:{type:String,require:true,select:false},//答案的id
}
)
module.exports =mongoose.model("Answer",commentsSchema) 