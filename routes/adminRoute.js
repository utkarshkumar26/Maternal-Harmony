// 1st require express
const express = require("express");
const admin_route = express();
const path = require("path");

const session = require("express-session");
const config = require("../config/config");
admin_route.use(session({ secret: config.sessionSecret }));

//middle ware helps you to be in one position either login or logout
const auth = require("../middleware/admin");

const bodyParser = require("body-parser");
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({ extended: true }));


// for css
admin_route.use(express.static(path.join(__dirname, '../public')));

// set view engine and views path
admin_route.set('view engine', 'ejs');
admin_route.set('views', './views/admin');

const admincontroller = require('../controllers/adminController');



admin_route.get('/', auth.isLogout, admincontroller.loadlogin);
admin_route.post('/', admincontroller.verifyLogin);
admin_route.get('/home', auth.isLogin, admincontroller.loadDashboard);
admin_route.get('/logout', auth.isLogin, admincontroller.logout);

admin_route.get('/dashboard',auth.isLogin,admincontroller.adminDashboard)

admin_route.get('/export-user',auth.isLogin,admincontroller.exportUsers);




admin_route.get('*', function (req, res) {
    res.redirect('/admin');
})
module.exports = admin_route;