const express = require('express');
const PORT = 4000;
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGOBD_URL } = require('./config')

//mongodb databse connection
global.__basedir = __dirname;
mongoose.connect(MONGOBD_URL);

mongoose.connection.on('connected', () => {
    console.log("DB connected");
})
mongoose.connection.on('error', (error) => {
    console.log("Some error while connecting to DB");
})

require('./models/user_model');
require('./models/product_model');
require('./models/Brand_model');
require('./models/addtocart_model');
require('./models/State_model');
require('./models/order_history_model');
require('./models/Admin_Model');

app.use(cors());
app.use(express.json());
app.use(express.static('uploads/product'))
app.use(express.static('uploads/users'))
app.use(express.static('uploads/admin'))
app.use(require('./routes/user_routes'));
app.use(require('./routes/product_routes'));
app.use(require('./routes/category_routes'));
app.use(require('./routes/addcart_routes'));
app.use(require('./routes/file_route'));
app.use(require('./mailservice/mail'));



app.listen(PORT, () => {
    console.log("Server started");
});