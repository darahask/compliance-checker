const https = require("https");

module.exports = checkSSL = (host, options) => {
    return new Promise((resolve, reject) => {
        try {
            const req = https.request({ host, ...options }, (res) => {
                const val = res.socket.getPeerCertificate();
                resolve(val);
            })
            req.on("error", (error) => { reject(error); });
            req.on("timeout", () => {
                req.destroy();
            });
            req.end();
        } catch (error) {
            reject(error);
        }
    })
};