const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require('path');
const user = require('./databases/Users_info');
const total_user_expense = require("./databases/Expenses");
const category = require("./databases/category_vice_expence")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
let login_date;
app.get("/", async function (req, res) {
    res.render("login");
})
app.get("/expense", isLoggedIn, async function (req, res) {
    let user_data = await user.findOne({ email: req.user_ki_detail.email });
    if (user_data == null) {
        res.redirect("/login");
    } else {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDate = `${day}-${month}-${year}`;
        res.render("Home", { No_expense: user_data.expenses.length, username: user_data.Username, date: getFormattedDate(user_data._id), login_date: formattedDate });
    }
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/create", function (req, res) {
    res.render("create");
})
app.post("/create", function (req, res) {
    let data = {
        Username: req.body.Username,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age
    }
    bcrypt.genSalt(10, function (req, salt) {
        bcrypt.hash(data.password, salt, async function (err, hash) {
            let account_detail = await user.create({
                Username: data.Username,
                email: data.email,
                password: hash,
                age: data.age
            })
            let token = jwt.sign({ email: data.email, dateid: account_detail._id }, "privatestring");
            res.cookie("token", token);
            res.redirect("/Home");
        })
    })
})
app.post("/login", async function (req, res) {
    let enterd_detail = {
        email: req.body.email,
        password: req.body.password,
    }
    let account = await user.findOne({ email: enterd_detail.email })
    if (account == null) res.send("Email is not found our database");
    else {
        bcrypt.compare(enterd_detail.password, account.password, function (err, result) {
            if (result == false) res.send("Password is incoorect");
            else {
                let token = jwt.sign({ email: account.email, dateid: account._id }, "privatestring");
                res.cookie("token", token);
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
                const day = String(currentDate.getDate()).padStart(2, '0');
                const formattedDate = `${day}-${month}-${year}`;
                login_date = formattedDate;
                // function getFormattedDate(objectId) {
                //     const isoDate = objectId.getTimestamp().toISOString().split('T')[0];
                //     const [year, month, date] = isoDate.split('-');
                //     return `${date}-${month}-${year}`;
                // }
                res.render("Home", { No_expense: account.expenses.length, username: account.Username, date: getFormattedDate(account._id), login_date: formattedDate });
            };
        })
    }
})
function getFormattedDate(objectId) {
    const isoDate = objectId.getTimestamp().toISOString().split('T')[0];
    const [year, month, date] = isoDate.split('-');
    return `${date}-${month}-${year}`;
}
app.get("/Home", isLoggedIn, async function (req, res) {
    let data = await user.findOne({ email: req.user_ki_detail.email });
    if (data == null) {
        res.redirect("/login");
    } else {
        res.render("Home", { No_expense: data.expenses.length, username: data.Username, date: getFormattedDate(data._id), login_date: login_date })
    }
})
app.post("/save", isLoggedIn, async function (req, res) {
    let data = {
        Expense_name: req.body.Expense_name,
        Amount: req.body.Amount,
        Expense_date: req.body.Expense_date,
        Expense_category: req.body.Expense_category,
        Payment_type: req.body.Payment_type
    }
    let usdata = await user.findOne({ email: req.user_ki_detail.email });
    let category_data = await category.findOne({ $and: [{ userid: usdata._id, Expense_category: data.Expense_category }] });
    if (category_data == null) {// Means Humare Paas Us Category ka koi data Nhai hain
        let us_info = await user.findOne({ email: req.user_ki_detail.email });
        if (us_info != null) {
            let k = await category.create({ 
                Expense_category: data.Expense_category,
                Total_amount: data.Amount,
                userid: us_info._id,
            })
            k.date.push(data.Expense_date);
            // let m = getFormattedDate(k._id);
            let i = new Date(data.Expense_date).toISOString().slice(5,7);
            k.Month_expense[parseInt(i)-1] = k.Month_expense[parseInt(i)-1] + parseInt(data.Amount);
            await k.save();
            us_info.user_expenses_category.push(k._id);
            await us_info.save();
        }
    } else { // Means Humare Pass Us Category ka data Hain
        let d = 0;
        d = parseInt(category_data.Total_amount) + parseInt(data.Amount); // total amount
        // let idx = getFormattedDate(category_data._id).slice(3,5);
        let i = new Date(data.Expense_date).toISOString().slice(5,7);
        category_data.Month_expense[parseInt(i)-1] = category_data.Month_expense[parseInt(i)-1] + parseInt(data.Amount);
        let g = category_data.Month_expense;
        category_data.date.push(data.Expense_date);
        await category_data.save();
        await category.findOneAndUpdate({ userid: usdata._id, Expense_category: data.Expense_category }, {$set: { Total_amount: d,Month_expense:g}}, {new: true});
    }
    let user_data = await user.findOne({ email: req.user_ki_detail.email });
    let created_expense_data = await total_user_expense.create({
        Expense_name: data.Expense_name,
        Amount: data.Amount,
        Expense_date: data.Expense_date,
        Expense_category: data.Expense_category,
        Payment_type: data.Payment_type,
        userid: user_data._id
    })
    user_data.expenses.push(created_expense_data._id);
    await user_data.save();
    res.redirect("/Home");
})

function simpledate(x) { 
    let dateObj = new Date(x); 
    let day = dateObj.getUTCDate().toString().padStart(2, '0');
    let month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    let year = dateObj.getUTCFullYear();
    let formattedDate = `${day}/${month}/${year}`;
    return {month,year};
}
app.get("/view_expanse", isLoggedIn, async function (req, res) {
    let user_data = await user.findOne({ email: req.user_ki_detail.email }).populate("user_expenses_category");
    let u_d = await user.findOne({ email: req.user_ki_detail.email }).populate("expenses");
    let jan = 0, f = 0, m = 0, ap = 0, may = 0, jun = 0, july = 0, au = 0, sep = 0, oct = 0, nov = 0, dec = 0;
    let kharcha = [0,0,0,0,0,0,0,0,0,0,0,0]
    u_d.expenses.map(function(val) {
        // console.log("D : ",simpledate(val.Expense_date));
        if(simpledate(val.Expense_date).month=='01') jan = jan + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='02') f = f + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='03') m = m + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='04') ap = ap + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='05') may = may + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='06') jun = jun + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='07') july = july + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='08') au = au + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='09') sep = sep + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='10') oct = oct + parseInt(val.Amount);
        else if(simpledate(val.Expense_date).month=='11') nov = nov + parseInt(val.Amount); 
        else if(simpledate(val.Expense_date).month=='12') dec = dec + parseInt(val.Amount);
    })
    let exp = user_data.user_expenses_category; // ye hume expenses ki array dega which is in object form
    kharcha[0] = jan;
    kharcha[1] = f;
    kharcha[2] = m;
    kharcha[3] = ap;
    kharcha[4] = may;
    kharcha[5] = jun;
    kharcha[6] = july;
    kharcha[7] = au;
    kharcha[8] = sep;
    kharcha[9] = oct;
    kharcha[10] = nov;
    kharcha[11] = dec;
    const chartData = {
        labels: ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [{
            label: 'Monthly Expenses',
            data: kharcha.map(function (val) {
                return val;
            }),
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    let total_expenditure = 0;
    const Expenses = exp.map(function (val) {
        total_expenditure = total_expenditure + parseInt(val.Total_amount);
        return { Expense_category: val.Expense_category, Amount: val.Total_amount , Monthly_exp : val.Month_expense};
    });
    if (user_data.expenses.length == 0) {
        res.send("No Data Found");
    } else {
        // console.log("s : ",parseInt(u_d.expenses.length / 5));
        res.render("expense",{exp :u_d.expenses,exp_list:JSON.stringify(u_d.expenses),first_date: getFormattedDate(user_data.expenses[0]), latest_date: getFormattedDate(user_data.expenses[user_data.expenses.length - 1]), total_expenditure: total_expenditure, No_expense: user_data.expenses.length, data: user_data, chartData: JSON.stringify(chartData), Expenses: JSON.stringify(Expenses) }); // Expense Array which conatins object
    }
})
app.get("/logout", function (req, res) {
    res.cookie("token", "");
    res.redirect("/");
})
function isLoggedIn(req, res, next) {
    if (req.cookies.token == "") {
        res.redirect("/login");
    } else {
        let data = jwt.verify(req.cookies.token, "privatestring");
        req.user_ki_detail = data;
        next();
    }
}
app.listen(3000, function () {
    console.log("App is listning on port 3000");
})


// sukhveer100@gmail.com : 123456
// sukhvinay98@gmail.com : abcdef