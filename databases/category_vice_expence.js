const mongoose = require('mongoose');
const category_vice_expense_schema = mongoose.Schema({
    Expense_category : String,
    Total_amount : Number,
    userid : {
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    date : {
        type:[Date],
        default:[]
    },
    Month_expense : {
        type: [Number],
        default: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }
})
module.exports = mongoose.model("category_vice_expense",category_vice_expense_schema);
