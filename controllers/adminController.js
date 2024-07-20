// 1st get admin model
const User = require('../models/userModel');

// for hiding password
const bcrypt = require('bcrypt');

// require excel js
const excelJs = require('exceljs');


const loadlogin = async (req, res) => {
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = await User.findOne({ email: email });
        if (userData) {
            const matchPassword = await bcrypt.compare(password, userData.password);

            if (matchPassword) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: "Email or password is incorrect" });
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/admin/home');
                }
            } else {
                res.render('login', { message: "Email or password is incorrect" });
            }
        } else {
            res.render('login', { message: "Email or password is incorrect" });
        }
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('home', { users: userData });
    } catch (error) {
        console.log(error.message);
    }
}

const loadprofile = async (req, res) => {
    try {
        const userData = await User.findById({ _id: req.session.user_id })
        res.render('profile', { user_detail: userData });
    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
}

const adminDashboard = async (req, res) => {
    try {
        const userData = await User.find({ is_admin: 0 });
        res.render('dashboard', { users: userData });

    } catch (error) {
        console.log(error.message);
    }
}


// create fucntion for export excel sheet of user data
const exportUsers = async (req, res) => {
    try {
        const workbook = new excelJs.Workbook();
        const worksheet = workbook.addWorksheet("my_users");

        worksheet.columns = [
            { header: "S no. ", key: "S_no" },
            { header: "Name ", key: "name" },
            { header: "Email id ", key: "email" },
            { header: "Mobile ", key: "mobile" },
            { header: "Image ", key: "image" },
            { header: "IS admin ", key: "is_admin" },
            { header: "Is Verified ", key: "is_verified" } // Correct the typo in "is_verified"
        ];

        let counter = 1;

        const userData = await User.find({ is_admin: 0 });

        userData.forEach((user) => {
            user.S_no = counter;
            worksheet.addRow(user);
            counter++;
        });

        worksheet.getRow(1).eachCell((cell) => {
            cell.font = { bold: true };
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        res.setHeader("Content-Disposition", `attachment;filename=users.xlsx`);

        await workbook.xlsx.write(res);

    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    } finally {
        res.status(200).end(); // Ensure that you end the response outside the try-catch block
    }
};



module.exports = {
    loadlogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    exportUsers
}



// 7628886109