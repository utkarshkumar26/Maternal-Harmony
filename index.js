// 1st require mongo
const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");
// const { loadModel, predictDiabetes } = require('./predict');

// 2nd require express
const express = require("express");
const app = express();

// for user route
const userRoute = require('./routes/userRoute');
app.use('/', userRoute);

// for admin route
const adminRoute = require('./routes/adminRoute');
app.use('/admin', adminRoute);










// at last listen
app.listen(3000, () => {
    console.log(`Server is running..`);
});
