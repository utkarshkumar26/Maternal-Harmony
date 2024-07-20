// 1st require express
const express = require("express");
const userRoute = express();
const path = require("path");

// 2nd require body parser
const bodyParser = require("body-parser");
userRoute.use(bodyParser.json());
userRoute.use(bodyParser.urlencoded({ extended: true }));

const config = require("../config/config");
const session = require("express-session");
userRoute.use(session({ secret: config.sessionSecret }));

const auth = require("../middleware/auth");


// for css
userRoute.use(express.static(path.join(__dirname, '../public')));


// 4th set view engine and views path
userRoute.set('view engine', 'ejs');

// userRoute.set('views', './views/users');
userRoute.set('views', ['./views/users', './views/ml_part','./views/templates']);

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/userImages'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});
const upload = multer({ storage: storage });


// 3rd require controller
const userController = require("../controllers/userController");


// 5th get loadRegister
userRoute.get('/register', auth.isLogout, userController.loadRegister);

// 6th post loadregister
userRoute.post('/register', upload.single('image'), userController.insertUser);

userRoute.get('/verify', userController.verifyMail);


// login
userRoute.get('/', userController.loadIndex);
userRoute.get('/index', userController.loadIndex);
userRoute.get('/login', auth.isLogout, userController.loginLoad);
userRoute.post('/login', userController.verifyLogin);

userRoute.get('/logout', auth.isLogin, userController.userLogout);

// load profile page
userRoute.get('/profile', auth.isLogin, userController.loadprofile);

// load AgainuserVericationMail page
userRoute.get('/AgainuserVericationMail', auth.isLogout, userController.AgainuserVericationMail);
userRoute.post('/AgainuserVericationMail', userController.sentverificationlink);


// edit page
userRoute.get('/edit',auth.isLogin,userController.editLoad);
userRoute.post('/edit',upload.single('image'),userController.updateProfile);

userRoute.get('/health', userController.userHealth);
userRoute.get('/heart', userController.userHeart);


userRoute.post('/health', (req, res) => {
    // Handle form data here
    console.log(req.body); // Log form data to the console
    res.render('health');
});


userRoute.get('/otp',userController.loadOtp);

userRoute.get('/about',userController.loadAbout);

userRoute.get('/contact',userController.loadContact);

userRoute.get('/items',userController.loadItems);


// 7th export user route
module.exports = userRoute;
