const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String, // or Number, depending on your requirements
        required: true
    },
    image: {
        type: String, // or Buffer if storing as binary data
        required: true // Make the image field optional
    },
    password: {
        type: String,
        required: true
    },
    is_admin: {
        type: Number,
        required: true
    },
    is_varified: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('User', userSchema);
