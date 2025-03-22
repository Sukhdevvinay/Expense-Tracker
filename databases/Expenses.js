// Esme Total User ke expense Likha honge 
const mongoose = require('mongoose');
const total_user_expense = mongoose.Schema({
    // Usename : String,
    Expense_name : String,
    Amount : Number,
    Expense_date : Date,
    Expense_category : String,
    Payment_type : String,
    userid: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    }
})
mongoose.model("user_expenses",total_user_expense);
module.exports = mongoose.model("user_expenses",total_user_expense);