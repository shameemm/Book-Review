const mongoose=require('mongoose');
const userData=new mongoose.Schema({
    
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
   
    Date:{
        type:Date,
        default:Date.now
    }
},{collection:'userData'});
module.exports=mongoose.model('myFirstDatabase',userData)