const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors())



//connect to mongoose
mongoose.connect("mongodb+srv://aditi-16:aditi2002@cluster0.ch56a.mongodb.net/instanewDB",{ useUnifiedTopology: true ,useNewUrlParser: true ,useFindAndModify: false })
.then(()=> console.log("Connection Successful"))
.catch((err)=> console.log(err));

require("./models/user");
require("./models/post");

app.use(express.json());
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));

// app.get("*", function (req, res) {
//     res.sendFile(path.resolve(__dirname,'client','build','index.html'));
// })

app.listen(5000,function(req,res){
    console.log("express server is running on 5000");
})