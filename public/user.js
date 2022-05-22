const express = require("express");
const app = express();


app.use(session({
    saveUninitialized: true,
    resave: true,
}));

let users = [{
    username: "jojo",
    password: "123",
    cart: [
        { id: 1, price: 1, number: 1 },
        { id: 2, price: 2, number: 2 },
    ],
},
{ username: "koko", password: "321", cart: [] },
];

function authenticate(req, res, next) {
    req.session.authenticated ? next() : res.redirect("/login");
}