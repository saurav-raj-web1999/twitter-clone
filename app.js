require('dotenv').config()
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser');
const User = require("./db/model");
const Post = require("./db/post");
require("./db/connection");
const port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'))
app.use(express.json({limit: '50mb'}));
app.use(bodyparser.urlencoded({extended:true, limit: '50mb'}));
app.use(cookieParser());

app.set('view engine', 'ejs');

// Login page rout 
app.get('/',(req,res)=>{
    res.status(201).render('login');
})


//User Sign up form
app.post('/register', async (req, res)=>{
    let File = await req.body.hidden;

    try {
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            gender: req.body.gender,
            profileImage: File            
        })

        const token = await newUser.generateToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 500000),
            httpOnly: true
        })

        const saveUserData = await newUser.save();
        res.redirect('/');
    } catch (error) {
        console.log(`Data not saved : ${error}`);
    }
})

app.post('/posts', auth, async (req, res)=>{
    try {
        const newPost = await Post.create({
            postBy: req.user.name,
            userId: req.user._id,
            content: req.body.content,
            userImage: req.user.profileImage,
            img: req.body.img
        })
        
        res.redirect('/profile');
        
    } catch (error) {
        res.status(401).send(error)
    }
})


app.get('/profile', auth , async (req, res, next)=>{ 
    const postData = await Post.find(); 
    const totalTwits = await Post.find({userId : req.user._id.toString()}).count(); 
    const userTwits = await Post.find({userId : req.user._id.toString()}); 
    
    res.render('home', {
        user : req.user,
        posts : postData,
        totalPost: totalTwits,
        userTwit: userTwits
    });
})

app.get('/logout', auth, async (req, res, next)=>{
    try {
        req.user.tokens = req.user.tokens.filter((currElement)=>{
            return currElement.token !== req.token; 
        })
        res.clearCookie("jwt");
        console.log("Logout successfully");
        await req.user.save();
        res.redirect('/')
    } catch (error) {
        res.status(500).send(error);
    }
})

// User login form 
app.post('/profile', async (req, res)=>{
    let username = req.body.username;
    let password = req.body.pass;
    
    try {
        const userData = await User.findOne({email : username});

        // compare hash password and User input password
        let isMatch = await bcrypt.compare(password, userData.password);

        const token = await userData.generateToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 4000000),
            httpOnly: true
        })


        if(isMatch){
            res.redirect('/profile');
        }
        else{
            res.send("<center><h1>Invalid Password</h1></center>");
        }
        
    } catch (error) {
        res.status(500).send("<center><h1>Invalid User id or password</h1></center>");
    }
})

app.get('*', (req,res)=>{
    if(req.url == "/profile") {
        res.redirect('/')
    }
    else{
        res.status(401).render('error');
    }
})

app.listen(port, ()=>{
    console.log(`Server running at port no ${port}`);
})