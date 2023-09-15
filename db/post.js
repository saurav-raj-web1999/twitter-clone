const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
        postBy: {  
            type: String
        },
        userId: {
            type: String
        },
        content:{
            type: String,
            trim: true,
            default: ""
        },
        userImage:{
            type: String,
        },
        img: {
            type: String,
            default: "https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png"
        },
        like: {
            type: Number,
            default: 0
        }

    
})
console.log("Posts database connected successfully.");

const post = mongoose.model("post", postSchema);

module.exports = post;