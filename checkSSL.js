const https = require("https");

module.exports = checkSSL = (host,options) =>{
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
};