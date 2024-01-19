const mongoose = require('mongoose');

const BrandSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Category:{
        type:String,
        required:true
    }
  
});

mongoose.model("BrandModel", BrandSchema);