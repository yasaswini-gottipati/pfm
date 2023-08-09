require("dotenv").config()
const express=require("express");
const bodyparser = require("body-parser")
const mongoose =require("mongoose");
const path = require("path");
const bcrypt = require("bcrypt");
const {User,Income,Expense,Budget,Data}=require('./models/userModels');


const app =express()

let usName='';

const url=process.env.MONGODB_URL;
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>{console.log("connected with db");})
    .catch((e)=>{console.log(e);})

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(express.json());
app.use(express.static(__dirname));
app.set('views', __dirname + '/views');
app.use(express.static(path.join(__dirname, '../public')));


app.get("/",(req,res)=>{
     res.sendFile(path.join(__dirname, '../backend/views/loginpage.html'))
})
app.get("/details/:useid",(req,res)=>{
    //res.sendFile(path.join(__dirname, '../backend/views/form.html'))
    const useId=req.params.useid;
    res.render('form.ejs',{userid:useId});
})

app.post('/register',async(req,res)=>{
    try{
        const {username,email,password}=req.body;
        const checkuser= await User.findOne({username});
        if(checkuser){
          return res.json({msg :"Username already taken!!",status:false});
        }
        const checkemail= await User.findOne({email});
        if(checkemail){
          return res.json({msg :"Account with this email is already exist!!",status:false});
        }
        const hashpassword = await bcrypt.hash(password,10);
        const users =await User.create({
         username,
         email,
         password:hashpassword,
        });
        users.save();
         return res.redirect(`/details/${users._id}`);
    }
    catch(e){
        console.log(e);
    }});
app.post('/details/:useeid',async(req,res)=>{
    try{
        const {first,last,phno,Dob,gender,cash,cardtyp,cash2,cardtyp2,cash3,cardtyp3,f1,r1,ele1,c1,edu1}=req.body;
        Number(cash);
        Number(cash2);
        Number(cash3);
        const useeId=req.params.useeid;
        console.log(cardtyp);
        const checkuser=await User.findOne({useeId});
        const data =await Data.create({
            userId:useeId,
            first:first,
            last:last,
            phno:phno,
            Dob:Dob,
            gender:gender,
            cash:cash,
            cardtyp,
            cash2:cash2,
            cardtyp2,
            cash3:cash3,
            cardtyp3,
            food:f1,
            rent:r1,
            electronics:ele1,
            clothing:c1,
            education:edu1,
        });
        data.save();
        res.redirect(`/home/${useeId}`);
    }
    catch(e){
        console.log(e);
       }
})
app.post('/login',async(req,res)=>{
    try{
        const {username,password}=req.body;
       const user= await User.findOne({username});
       if(!user){
        return res.json({msg :"Incorrect Username!!",status:false});
       }
       const isPassword = await bcrypt.compare(password,user.password)
       if(!isPassword){
           return res.json({msg :"Incorrect Password!!",status:false});
       }
       usName+=user._id;
       console.log(usName);
       return res.redirect(`/home/${user._id}`)
       }
       catch(e){
        console.log(e);
       }
})
app.post('/updatepass/:useeid',async(req,res)=>{
    try{
        const {oldpass,newpass,confpass} =req.body;
        const useeId=req.params.useeid;
        const checkuser=await User.findOne({_id:useeId});
        if (!checkuser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const isPassword = await bcrypt.compare(oldpass,checkuser.password)
        if (!isPassword ) {
            return res.status(401).json({ message: 'Incorrect old password' });
        }
        if (confpass !== newpass) {
            return res.status(401).json({ message: 'confirm password and newpassword should be same' });
        }
        const hashpassword = await bcrypt.hash(confpass,10);
        checkuser.password = hashpassword;
        await checkuser.save();
        return res.redirect(`/home/${useeId}`)
    }catch (err) {
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Error updating password' });
      }
})
app.get("/home/:useeid",async(req,res)=>{
   
    // res.sendFile(path.join(__dirname, '../ind.html'));
    try {
        const useeId=req.params.useeid;
        const uu=await User.findOne({_id:useeId});
        const data = await Income.find({userId:useeId}); 
        const data1 = await Expense.find({userId:useeId});
        const detls= await Data.findOne({userId:useeId});
        let eepx=0;
        data1.forEach((item)=>{
             eepx += item.amount;
        });
        let innx=0;
        data.forEach((item)=>{
             innx += item.amount;
        })
        const search1={categorys:'food',userId:useeId}
        const food=await Expense.find(search1);
        let totalfood = 0;
        food.forEach((item) => {
          totalfood += item.amount;
          console.log("76");
        });
        const search2={categorys:'clothing',userId:useeId}
        const clothing =await Expense.find(search2);
        let CC = 0;
        clothing.forEach((item) => {
          CC += item.amount;
        });
        const search3={categorys:'education',userId:useeId}
        const edu=await Expense.find(search3);
        let EE = 0;
        edu.forEach((item) => {
          EE += item.amount;
        });
        const search4={categorys:'electronics',userId:useeId}
        const ele=await Expense.find(search4);
        let ee = 0;
        ele.forEach((item) => {
          ee += item.amount;
        });
        const search5={categorys:'rent',userId:useeId}
        const rent=await Expense.find(search5);
        let rr = 0;
        rent.forEach((item) => {
          rr += item.amount;
        });
        console.log(totalfood,CC,EE,ee,rr);
        let c1="bg-success";
        if(totalfood>=(detls.food)/2 && totalfood<detls.food)
        {
            c1="bg-primary";
        }
        else if(totalfood>=detls.food)
        {
            c1="bg-danger";
        }
        let c2="bg-success";
        if(CC>=(detls.clothing)/2 && CC<detls.clothing)
        {
            c2="bg-primary";
        }
        else if(CC>=detls.clothing)
        {
            c2="bg-danger";
        }
        let c3="bg-success";
        if(EE>=(detls.education)/2 && EE<detls.education)
        {
            c3="bg-primary";
        }
        else if(EE>=detls.education)
        {
            c3="bg-danger";
        }
        let c4="bg-success";
        if(ee>=(detls.electronics)/2 && ee<detls.electronics)
        {
            c4="bg-primary";
        }
        else if(ee>=detls.electronics)
        {
            c4="bg-danger";
        }
        let c5="bg-success";
        if(rr>=(detls.rent)/2 && rr<detls.rent)
        {
            c5="bg-primary";
        }
        else if(rr>=detls.rent)
        {
            c5="bg-danger";
        }
        res.render('ind.ejs', {data,data1,totalfood,CC,EE,ee,rr,useeId,detls,uu,c1,c2,c3,c4,c5,eepx,innx }); 
      } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
      }
    // res.render('ind.ejs',{name:abc});
})

app.post("/expensess/:useeid",async(req,res)=>{
    try{
        const useeId=req.params.useeid;
        console.log("hi");
        const detls= await Data.findOne({userId:useeId});
        const {name,amount,accounts,categorys,datemax,pictures,cardpic}=req.body; 
        console.log(usName);
        const expense =await Expense.create({
            userId:useeId,
            title:name,
            amount,
            account:accounts,
            categorys,
            pictures,
            cardpic,
            datemax,
        });
           expense.save();
           if(cardpic==detls.cardtyp){
            detls.cash=detls.cash-amount;
           }
           else if(cardpic==detls.cardtyp2){
            detls.cash2=detls.cash2-amount;
           }
           else if(cardpic==detls.cardtyp3){
            detls.cash3=detls.cash3-amount;
           }
           await detls.save();
           res.redirect(`/home/${useeId}`)
    } catch(e){
        console.log(e);
    }
})

app.post("/incomes/:useeid",async(req,res)=>{
    try{
        const useeId=req.params.useeid;
        console.log("hello");
        const detls= await Data.findOne({userId:useeId});
        const {name1,amounts1,accounts1,categorys1,pictures1,cardpic1,datemax1}=req.body; 
        console.log(usName);
        const income =await Income.create({
            userId:useeId,
            title:name1,
            amount:amounts1,
            account:accounts1,
            categorys:categorys1,
            pictures:pictures1,
            cardpic:cardpic1,
            datemax:datemax1,
        });
           income.save();
           if(cardpic1==detls.cardtyp){
            // detls.cash=(detls.cash)+amounts1;
            const value = (detls.cash)+amounts1;
            const numericParts = value.split(" ").map(Number); 
            const combinedValue = numericParts.reduce((acc, num) => acc + num, 0);
            detls.cash = combinedValue;
           }
           else if(cardpic1==detls.cardtyp2){
            // detls.cash2=parseInt(detls.cash2)+amounts1;
            const value = (detls.cash2)+amounts1;
            const numericParts = value.split(" ").map(Number); 
            const combinedValue = numericParts.reduce((acc, num) => acc + num, 0);
            detls.cash2 = combinedValue;
           }
           else if(cardpic1==detls.cardtyp3){
            // detls.cash3=parseInt(detls.cash3)+amounts1;
            const value = (detls.cash3)+amounts1;
            const numericParts = value.split(" ").map(Number); 
            const combinedValue = numericParts.reduce((acc, num) => acc + num, 0);
            detls.cash3 = combinedValue;
           }
           await detls.save();
           res.redirect(`/home/${useeId}`)
        //    res.send("edited");
    } catch(e){
        console.log(e);
    }
})

app.post("/budgets/:useeid",async(req,res)=>{
    try{
        const useeId=req.params.useeid;
        console.log("bye");
        const {name2,amounts2,accounts2,categorys2,datemax2}=req.body; 
        console.log(usName);
        const budget =await Budget.create({
            userId:useeId,
            title:name2,
            amount:amounts2,
            account:accounts2,
            categorys:categorys2,
            datemax:datemax2,
        });
           budget.save();
           res.redirect(`/home/${useeId}`)
        //    res.send("edited");
    } catch(e){
        console.log(e);
    }
})

const port =process.env.PORT;
app.listen(port,()=>{
    console.log(`server started on port ${port}`);
})