// 1st get user model
const User = require('../models/userModel');

// for hiding password
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const config = require("../config/config");

// for sending mail
const nodemailer = require("nodemailer");

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }
}


// for send mail functiuon

const sendverifymail = async (name, email, user_id) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // Set to true for secure connection using TLS
            requireTLS: true,
            auth: {
                user: config.AdminMail,
                pass: config.AdminPassword
            }
        });

        const mailOptions = {
            from: 'ar861926@gmail.com',
            to: email,
            subject: 'For Verification Mail',
            html: '<p>Hii ' + name + ' please click <a href="http://127.0.0.1:3000/verify?id=' + user_id + '">here</a> to verify your mail</p>'
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email has been Sent :- ', info.response);
            }
        });
    } catch (error) {
        console.log(error.message);
    }
};


// Send verification mail again if user want

// 1st load AgainuserVericationMail
const AgainuserVericationMail = async (req, res) => {
    try {
        res.render('AgainuserVericationMail');
    } catch (error) {
        console.log(error.message);
    }
}

const sentverificationlink = async (req, res) => {
    try {
        const email = req.body.email;
        const userData = await User.findOne({ email: email });
        if (userData) {
            if (userData.is_varified === 0) {
                sendverifymail(userData.name, userData.email, userData._id);
                res.render('AgainuserVericationMail', { message: "Veification Link is Sent Succesffuly" });
            } else {
                res.render('AgainuserVericationMail', { message: "This Email is already Verifed Please login" });
            }

        } else {
            res.render('AgainuserVericationMail', { message: "This Email is not exist" });
        }

    } catch (error) {
        console.log(error.message);
    }
}




// load index
const loadIndex = async (req, res) => {
    try {
        res.render('index');
    } catch (error) {
        console.log(error.message);
    }
}

// 2nd load data
const loadRegister = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
        // res.status(500).send('Internal Server Error');
    }
};


// 3rd insert data
const insertUser = async (req, res) => {
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            image: req.file.filename,
            password: spassword,
            is_admin: 0
        });

        const userData = await user.save();
        if (userData) {
            // create a fucntion fro mail sender
            sendverifymail(req.body.name, req.body.email, userData._id);
            res.render('register', { message: "Your Registration has been Successful, please verify your mail" });
        } else {
            res.render('register', { message: "Your Registration has failed" });
        }
    } catch (error) {
        console.log(error.message);
    }
};

const verifyMail = async (req, res) => {
    try {
        const updateInfo = await User.updateOne({ _id: req.query.id }, { $set: { is_varified: 1 } });

        console.log(updateInfo);
        res.render("email-verified");
    } catch (error) {
        console.log(error.message);
    }
}

// 1st load login
const loginLoad = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

// 2nd post login

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        // check whether given pasword preent in data base or no
        const userData = await User.findOne({ email: email });
        if (userData) {
            // agar user data m email presnt h then password comapre kro
            const passwordmatch = await bcrypt.compare(password, userData.password);

            if (passwordmatch) {
                // agar password match kiya ,..and check kro kya user verified kiya h
                if (userData.is_varified === 0) {
                    res.render('login', { message: "Please verify your mail" });
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/profile');
                }
            } else {
                res.render('login', { message: "Email and password are in correct" });
            }
        } else {
            res.render('login', { message: "Email and password are in correct" });
        }
    } catch (error) {
        console.log(error.message);
    }
};


const loadprofile = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('profile', { user_detail: userData });
    } catch (error) {
        console.log(error.message);
    }
}


// for logout
const userLogout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        console.log(error.message);
    }
};

// function to load edit
const editLoad = async (req, res) => {
    try {
        const id = req.query.id;
        const userData = await User.findById({ _id: id });
        if (userData) {
            res.render('edit', { user: userData });
        } else {
            res.redirect('/profile');
        }
    } catch (error) {
        console.log(error.message);
    }
};



const updateProfile = async (req,res) => {
    try {
        if (req.file) {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile, image: req.file.filename } });
        } else {
            const userData = await User.findByIdAndUpdate({ _id: req.body.user_id }, { $set: { name: req.body.name, email: req.body.email, mobile: req.body.mobile } });
        }
        res.redirect('/profile');
    } catch (error) {
        console.log(error.message);
    }
};


const userHealth = async (req, res) => {
    try {
        res.render('health');
    } catch (error) {
        console.log(error.message);
    }
};

const userHeart = async(req,res) => {
    try{
        res.render('heart');
    } catch(error){
        console.log(error.message);
    }
}


const loadOtp = async(req,res) =>{
    try{
        res.render('otp');
    }catch(error){
        console.log(error);
    }
}


const loadAbout = async(req,res) =>{
    try{
        res.render('about');
    }catch(error){
        console.log(error);
    }
}


const loadContact= async(req,res) =>{
    try{
        res.render('contact');
    }catch(error){
        console.log(error);
    }
}

const loadItems= async(req,res) =>{
    try{
        res.render('items');
    }catch(error){
        console.log(error);
    }
}

module.exports = {
    loadIndex,
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadprofile,
    userLogout,
    AgainuserVericationMail,
    sentverificationlink,
    editLoad,
    updateProfile,
    userHealth,
    userHeart,
    loadOtp,
    loadAbout,
    loadContact,
    loadItems
};
