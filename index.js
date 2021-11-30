const instance = require('./browser')
const checkSSL = require("./checkSSL")


HOST = 'www.nice.org.uk/'

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};


// checkSSL(HOST,options);
instance(HOST);
