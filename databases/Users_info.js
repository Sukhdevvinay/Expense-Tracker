const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/account');

const Userschema = mongoose.Schema({
    Username:String,
    email:String,
    password:String,
    age:Number,
    expenses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"user_expenses"
        }
    ],
    user_expenses_category: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"category_vice_expense"
        }
    ]
})
mongoose.model("user",Userschema);
module.exports = mongoose.model("user",Userschema);
