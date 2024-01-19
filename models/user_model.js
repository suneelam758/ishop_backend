const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImg:{
        type: String,
        default: "user.png"
    },
    address:{
        type: String,
        required: false,
        default:''
    },
    contact:{
        type: Number,
        required: false,
        default:0
    },
    gender:{
        type: String,
        required: false,
        default:''
    },
    Shop:{
        type: String,
        required:false,
        default:''
    },
    AffiliateStatus:{
        type:Number,
        required:false,
        default:0

    },
    Adminsts:{
        type:Number,
        required:false,
        default:0
    }
});

mongoose.model("UserModel", userSchema);