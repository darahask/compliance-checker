const instance = require('./browser')
const checkSSL = require("./checkSSL")


HOST = 'color.a11y.com'

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};


// checkSSL(HOST,options);
instance(HOST);
