const instance = require('./utils/browser')
const checkSSL = require("./utils/checkSSL")
const express = require("express")
const app = express();
const path = require("path")
const cors = require("cors")

var PORT = process.env.PORT || 3333

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};

app.use(cors())
app.use(express.json({extended:true}));
app.use(express.static("public"));

app.get('/', (req,res)=>{
    res.sendFile(path.resolve(__dirname,"views","index.html"))
})

app.post('/api/compliance',async (req,res)=>{
    try {
        console.log(req.body);
        let url = req.body.searchUrl;
        // let ssl = await checkSSL(url,options);
        let data = await instance(req.body);
        return res.json({data});
    } catch (error) {
        console.log(error);
        return  res.status(400).send({
            message: 'Enter a vaild url'
         });
    }
})

app.listen(PORT,()=>console.log(`Server started at ${PORT}!!!`))