const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const ProductSchema = new mongoose.Schema({
    ItemName : {
        type: String,
        required: true
    },
    Price:{
        type:Number,
        required: true
    },
    Description:{
        type:String,
        required: true
    },
    Image:{
        type:String,
        required:true
    },
    Category:{
        type:String,
        required:true,
    },
    subcategory:{
        type:String,
        required:true,
    },
    Quantity:{
        type:Number,
        required:true,
    },
    Rating:{
        type:Number,
        required: false,
        default:1
    },
    Brand:{
        type:String,
        required:true
    },
    Size:{
        type:Array,
        required:true,
        default:''
    },
    Owner:{
        type: ObjectId,
        ref: "UserModel"
    }
});

mongoose.model("ProductModel", ProductSchema);