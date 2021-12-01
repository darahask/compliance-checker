const instance = require('./browser')
const checkSSL = require("./checkSSL")


HOST = 'en.wikipedia.org/'

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};


// checkSSL(HOST,options);
instance(HOST);
