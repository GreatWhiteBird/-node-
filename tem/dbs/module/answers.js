const mongoose =require( "mongoose")
const Schema=mongoose.Schema;
let answerSchema= new mongoose.Schema({
    __v:{type:String,select:false},
    content:{type:String,require:true},//答案内容
    answerer:{type:Schema.Types.ObjectId,ref:"User",require:true},//回答问题的人
    questionId:{type:String,require:true,select:false},//问题的id
    voteCount:{type:Number,require:true,default:0} //投票数   
}
)
module.exports =mongoose.model("Answer",answerSchema) 