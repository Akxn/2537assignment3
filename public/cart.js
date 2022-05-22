const express= require("express");
var router = express.Router();

const mongourl = process.env.mongourl;

const mongoose = require("mongoose");
mongoose.connect(mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
    text: String,
    hits: Number,
    time: String,
});

const userModel = mongoose.model("users", userSchema);

router.post("/add/:id", function(req, res){});

module.exports = router;

function addToCart(id) {
    $.ajax({
        url: `/cart/add/${id}`,
        type: "GET",
        success: (res)=>{
            console.log(res);
        },
    });
}

function setup() {
    $(".add").on("click", addToCart);
}

$(document).ready(setup);