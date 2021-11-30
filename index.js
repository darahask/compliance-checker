const instance = require('./browser')
const checkSSL = require("./checkSSL")


HOST = '127.0.0.1:5500/sample.html'

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};


// checkSSL(HOST,options);
instance(HOST);
