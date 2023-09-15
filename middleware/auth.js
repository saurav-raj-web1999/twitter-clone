const jwt = require('jsonwebtoken');
const User = require("../db/model");

const auth = async (req, res, next)=>{
    try {
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        // console.log(verifyUser);
        const data = await User.findOne({_id: verifyUser})
        
        req.token = token;
        req.user = data;
        next();
        
    } catch (error) {
        res.status(401).send(error)
    }
}

module.exports = auth;