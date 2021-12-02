const instance = require('./browser')
const checkSSL = require("./checkSSL")
const express = require("express")
const app = express();
const path = require("path")

HOST = 'www.google.com'

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};


// checkSSL(HOST,options);
// instance(HOST);

app.use(express.json({extended:true}));
app.use(express.static("public"));

app.get('/', (req,res)=>{
    res.sendFile(path.resolve(__dirname,"views","index.html"))
})

app.post('/api/compliance',async (req,res)=>{
    let url = req.body.searchUrl;
    let data = await instance(url);
    res.json(data);
})

app.listen(3333,()=>console.log("Server started!!!"))