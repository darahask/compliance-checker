const https = require("https");
const  tls = require("tls");
const fs = require("fs");


HOST = 'www.google.com'

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};

checkSSL = (host,options) =>{
    try {
        const req = https.request({host, ...options},(res)=>{
            const val = res.socket.getPeerCertificate();
            console.log(val);
        })
        req.on("error", (err)=>{console.log(error);});
        req.on("timeout", () => {
            req.destroy();
        });
        req.end();
    } catch (error) {
        console.log(error);
    }
}


checkSSL(HOST,options);

