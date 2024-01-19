const mongoose = require('mongoose');
const OrderHistorySchema = new mongoose.Schema({
   CustomerName:{
    type:String,
    required:true
   },
   AddressLine1:{
    type:String,
    required:true
   },
   AddressLine2:{
    type:String,
    required:false
   },
   State:{
    type:String,
    required:true
   },
   City:{
    type:String,
    required:true
   },
   PinCode:{
    type:Number,
    required:true
   },
   CustomerId:{
    type:String,
    required:true
   },
   OwnerArray:{
    type:Array,
    required:true
   }
  
});

mongoose.model("OrderHistoryModel", OrderHistorySchema);