const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const twitterSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: "img/default_image.png"
    },
    followers:[{
        type: Array,
        fname: String,
        fimg: String        
    }],
    following: [{
        foname: String,
        foimg: String
    }],
    date : {
        type : Date,
        default : Date.now
    },
    
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]

}, {timestamps : true});

twitterSchema.methods.generateToken = async function(){
    try {
        const newToken = jwt.sign({_id: this._id}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token: newToken});
        await this.save();
        return newToken;
        
    } catch (error) {
        console.log(`Error in token generating due to : ${error}`);
    }

}

twitterSchema.pre("save", async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password , 10);
    }

    next();
})

const user = mongoose.model("user", twitterSchema);

module.exports = user;

// date: 2022-02-28T15:13:44.249+00:00
