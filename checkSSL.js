const https = require("https");

module.exports = checkSSL = async(host,options) =>{
    try {
        const req = https.request({host, ...options},(res)=>{
            const val = res.socket.getPeerCertificate();
            return (val);
        })
        req.on("error", (error)=>{console.error(error);});
        req.on("timeout", () => {
            req.destroy();
        });
        req.end();
    } catch (error) {
        console.error(error);
    }
};