const mongoose=require('mongoose');
const booksData=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        // type:String,
        require:true
    },
    ibnNumber:{
        type:String,
        require:true
    },
    bookName:{
        type:String,
        require:true
    },
    authorName:{
        type:String,
        require:true
    },
    language:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    purchaseLink:{
        type:String,
        require:true
    },
    yearOfPublication:{
        type:String,
        require:true
    },
    Genre:{
        type:String,
        require:true
    },
    
    Date:{
        type:Date,
        default:Date.now  
    }
},{collection:'books-data'});
module.exports=mongoose.model('books-data',booksData)
