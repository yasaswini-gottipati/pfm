const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required : true,
        min:5,
        max:15,
        unique:true
    },
    email:{
        type :String,
        required : true,
        max:30,
        unique:true
    },
    password:{
        type :String,
        required : true,
        min:8,
    },
})
const incomeSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title:{
        type: String,
    },
    amount:{
        type: Number,
    },
    account:{
        type : String,
    },
    categorys:{
        type : String,
        max:30,
    },
    pictures:{
        type: String,
    },
    cardpic:{
        type: String,
    },
    datemax:{
        type: String,
    },
    

})


const expenseSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title:{
        type: String,
    },
    amount:{
        type: Number,
    },
    account:{
        type : String,
    },
    categorys:{
        type : String,
    },
    datemax:{
        type: String,
    },
    pictures:{
        type: String,
    },
    cardpic:{
        type: String,
    },
})

const budgetSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    title:{
        type: String,
    },
    amount:{
        type: Number,
    },
    account:{
        type : String,
    },
    categorys:{
        type : String,
    },
    datemax:{
        type: String,
    },


})

const dataSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    first:{
        type: String,
    },
    last:{
        type : String,
    },
    phno:{
        type: Number,
    },
    Dob:{
        type : String,
    },
    gender:{
        type : String,
    },
    cash:{
        type : Number,
    },
    cardtyp:{
        type: String,
    },
    cash2:{
        type : Number,
    },
    cardtyp2:{
        type: String,
    },
    cash3:{
        type : Number,
    },
    cardtyp3:{
        type: String,
    },
    food:{
        type : Number,
    },
    rent:{
        type : Number,
    },
    electronics:{
        type : Number,
    },   
    clothing:{
        type : Number,
    },
    education:{
        type : Number,
    },
})

const User = mongoose.model('User', userSchema);
const Income = mongoose.model('Income', incomeSchema);
const Expense = mongoose.model('Expense', expenseSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const Data = mongoose.model('Data', dataSchema);

module.exports ={User , Income,Expense,Budget,Data} 