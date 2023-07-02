const functions = require("firebase-functions");
const axios = require("axios");
const cors = require('cors');
const express = require("express");
const routes = require("./routes")
const app = express();
app.use(express.json());
app.use(routes)
app.use(cors());
app.get("/",(req,res)=>{
    res.send(`Server started `);
})

exports.app = functions.https.onRequest(app);
