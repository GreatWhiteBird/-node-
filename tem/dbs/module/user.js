const mongoose =require( "mongoose")
const Schema=mongoose.Schema;
let userSchema= new mongoose.Schema({
    __v:{type:String,select:false},
    id:{type:String,required:false},
    username:{type:String,required:false},
    password:{type:String,required:true,select:false},//select:false不返回该字段

    //关注 设置成一个用户的属性 //粉丝 设置成 查询用户筛选条件是关注我的
    following:{type:[{type:Schema.Types.ObjectId,ref:"User"}],select:false},
    //用户点过赞和踩的列表
    likingAnswers:{type:[{type:Schema.Types.ObjectId,ref:"Answer"}],select:false},
    dislikingAnswers:{type:[{type:Schema.Types.ObjectId,ref:"Answer"}],select:false},
    collectingAnswers:{type:[{type:Schema.Types.ObjectId,ref:"Answer"}],select:false},
    
})
module.exports =mongoose.model("User",userSchema) 