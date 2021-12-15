const instance = require('./utils/browser')
const express = require("express")
const app = express();
const generateDefinition = require('./utils/ddgenerator')
const path = require("path")
const cors = require("cors");
const createPdf = require('./utils/generatePDF');

var PORT = process.env.PORT || 3333

app.use(cors())
app.use(express.json({extended:true,limit:"100mb"}));
app.use(express.static("public"));

app.get('/', (req,res)=>{
    res.sendFile(path.resolve(__dirname,"views","index.html"))
})

app.post('/api/compliance',async (req,res)=>{
    try {
        let data = await instance(req.body);
        console.log(data);
        return res.json({data});
    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: 'Enter a vaild url'
        });
    }
})

app.post('/api/report',async(req,res)=>{
    try{
        let data = req.body.jsondata;
        let val = generateDefinition(data.data,req.body.url, req.body.ssl, req.body.ada, req.body.cookie);
        let pdf = await createPdf(val)
        res.contentType('application/pdf').send(pdf)
    }catch(error){
        console.error(error)
    }
})

app.listen(PORT,()=>console.log(`Server started at ${PORT}!!!`))