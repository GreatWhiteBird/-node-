const mongoose =require( "mongoose")

let userSchema= new mongoose.Schema({
    __v:{type:String,select:false},
    id:{type:String,required:false},
    username:{type:String,required:true},
    password:{type:String,required:true,select:false}//select:false不返回该字段
})
module.exports =mongoose.model("User",userSchema) 