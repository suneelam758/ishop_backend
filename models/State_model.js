const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    }
  
});

mongoose.model("StateModel", StateSchema);