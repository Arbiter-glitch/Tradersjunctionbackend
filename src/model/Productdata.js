const mongoose = require('mongoose');
 //mongoose.connect('mongodb://localhost:27017/tradersjunction',{ useUnifiedTopology: true });
mongoose.connect('mongodb+srv://userone:userone@clustertest.6ibup.mongodb.net/TradersJunction?retryWrites=true&w=majority',{ useUnifiedTopology: true });
const Schema = mongoose.Schema;


const ProductSchema = new Schema({

    username1:String,
    username2:String,
    productName : String,
    Category : String,
    Quantity : Number,
    Price : Number,
    dob:String,
    Address :  String,
    Phoneno : String,
});

var Productdata = mongoose.model('productdata', ProductSchema);//productdata is collection_name in db  and Productdata is the model to be exported


module.exports = Productdata;