const mongoose = require('mongoose');

const DB_URL = process.env.DATABASE_URL;

connection = mongoose.connect(DB_URL).then(()=>{
    console.log('Database connected successfully.');
}).catch((err)=>{
    console.log('Connection failed.');
})
