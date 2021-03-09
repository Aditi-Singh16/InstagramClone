const mongoose = require("mongoose");
const {ObjectId}= mongoose.Schema.Types;

const userSchema=new mongoose.Schema({
    profilePic:{type:String,
        default:"https://res.cloudinary.com/dvpg6kmsv/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1614179242/hrjnmyztouwfyruk9bcu.png"},
    fullname:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}],
    stalkers:[{type:String,ref:"User"}]
})

mongoose.model("User",userSchema);

