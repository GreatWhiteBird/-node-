const mongoose =require( "mongoose")

let personSchema =new mongoose.Schema({
    name:String,
    age:Number,
    sex:String,
    classes:Number
})

 module.exports =mongoose.model("Person",personSchema) 