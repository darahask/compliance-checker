const crawl = require('./browser')
const checkSSL = require("./checkSSL")


HOST = 'www.stackoverflow.com'

var options = {
    method: "HEAD",
    port: 443,
    rejectUnauthorized: false
};


checkSSL(HOST,options);
crawl(HOST);
