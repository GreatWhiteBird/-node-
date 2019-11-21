const mongoose =require( "mongoose")
const Schema=mongoose.Schema;
let topicsSchema= new mongoose.Schema({
    __v:{type:String,select:false},
    topicsName:{type:String,require:true},//话题名称
    avatar_url:{type:String},
    introduction:{type:String,select:false}//介绍
    
},{timestamps:true}
)
module.exports =mongoose.model("Topics",topicsSchema) 