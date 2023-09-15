require("dotenv").config();
const cors = require("cors");
const express = require("express");
const connectDB = require("./connectDB");
const Book = require('./models/Books');

//creates express application
const app = express(); 
// env.PORT for when hosting online, 8000 for locally & needs to be different from react
const PORT = process.env.PORT || 8000;


connectDB();
app.use(cors());
//parsing incoming URL-encoded request data using qs libary and adding it to req.body
//object for easy access
app.use(express.urlencoded({extended: true}));
app.use(express.json());


app.get("/", (req, res) => {
    res.json("Hello mate!");
});

app.get("*", (req, res) => {
    res.sendStatus("404");
});

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
});

