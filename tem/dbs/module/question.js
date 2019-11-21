const mongoose =require( "mongoose")
const Schema=mongoose.Schema;
let questionSchema= new mongoose.Schema({
    __v:{type:String,select:false},
    title:{type:String,require:true},//问题标题
    descrption:{type:String}, //问题描述
    questioner:{type:Schema.Types.ObjectId, ref:"User", require:true,select:false},//提问者
    topics:{type:Schema.Types.ObjectId, ref:"Topics"  ,select:false}
},{timestamps:true}
)
module.exports =mongoose.model("Question",questionSchema) 