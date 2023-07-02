const express = require('express');
const Generate = require("../services/generate");
const router = express.Router();
const whatappToken = "EAAOgtoiL6t4BAIokvgnGslxNsJaNnPLFQS6JNIZCA6tcjRSzIl9FbuqmRoKMXgpUoaNVzMh8me2Ysd2eJSZBKLygz1cH1fTglHEgZAZATyMDu5lSg2G94lVyq6KiZBccnY22kBd2o2hMxNpxvKVN2ZCiyxPXBdVH1VfRx6chNMZBmD9RUZBR6flV";
router.get("/",(req,res)=>{
    const challenge = req.query['hub.challenge'];
    const verify_token = req.query['hub.verify_token'];
    if (verify_token == whatappToken){
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Authorization','Bearer ${whatappToken}')
        res.status(200).send(challenge);
    }else{
        res.status(403)
    }
})
router.post("/", async ( req, res ) => {
    const generate = new Generate();
    const response = await generate.HandleResponse(req);
    return res.status(200).send({ok:"OK"})
     
})

module.exports = router