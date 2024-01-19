const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
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
        required:false,
        default: "admin.png"
    },
    address:{
        type: String,
        required: false,
        default:'Ishop store default'
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
        default:'admin ishop'
    },
    AffiliateStatus:{
        type:Number,
        required:false,
        default:1

    },
    Adminsts:{
        type:Number,
        required:false,
        default:1
    }
});

mongoose.model("AdminModel", AdminSchema);