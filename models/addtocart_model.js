const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const AddCartSchema = new mongoose.Schema({
    ProductId: {
        type: String,
        required: true
    },
    CustomerId:{
        type: ObjectId,
        ref: "UserModel"
    },
    DateOrder:{
        type:Date,
        required:true
    },
    OrderStatus:{
        type:Number,
        default:0,
        required:false
    },
    Quantity:{
        type:Number,
        default:0,
        required:false
    },
    CustomerInfo:{
        type:Array,
        required:false
    }
  
});

mongoose.model("AddCartModel", AddCartSchema);