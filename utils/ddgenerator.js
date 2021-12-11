const { json } = require('express/lib/response');
const moment = require('moment')

/*
{
    "data": {
        "securityDetails": {
            "_subjectName": "*.stackexchange.com",
            "_issuer": "R3",
            "_validFrom": 1638713752,
            "_validTo": 1646489751,
            "_protocol": "TLS 1.2",
            "_sanList": [
                "*.askubuntu.com",
                "*.blogoverflow.com",
                "*.mathoverflow.net",
                "*.meta.stackexchange.com",
                "*.meta.stackoverflow.com",
                "*.serverfault.com",
                "*.sstatic.net",
                "*.stackexchange.com",
                "*.stackoverflow.com",
                "*.stackoverflow.email",
                "*.superuser.com",
                "askubuntu.com",
                "blogoverflow.com",
                "mathoverflow.net",
                "openid.stackauth.com",
                "serverfault.com",
                "sstatic.net",
                "stackapps.com",
                "stackauth.com",
                "stackexchange.com",
                "stackoverflow.blog",
                "stackoverflow.com",
                "stackoverflow.email",
                "stacksnippets.net",
                "superuser.com"
            ]
        },
        "cookieDetails": {
            "cookieInfo": {
                "cookies": [
                    {
                        "name": "prov",
                        "value": "32285a0a-726d-a0c3-ec30-8a9217ad479c",
                        "domain": ".stackoverflow.com",
                        "path": "/",
                        "expires": 2682374400.308928,
                        "size": 40,
                        "httpOnly": true,
                        "secure": false,
                        "session": false,
                        "priority": "Medium",
                        "sameParty": false,
                        "sourceScheme": "NonSecure",
                        "sourcePort": 80
                    },
                    {
                        "name": "_ga",
                        "value": "GA1.2.558624756.1639213402",
                        "domain": ".stackoverflow.com",
                        "path": "/",
                        "expires": 1702285401,
                        "size": 29,
                        "httpOnly": false,
                        "secure": false,
                        "session": false,
                        "priority": "Medium",
                        "sameParty": false,
                        "sourceScheme": "Secure",
                        "sourcePort": 443
                    },
                    {
                        "name": "_gid",
                        "value": "GA1.2.1357636673.1639213402",
                        "domain": ".stackoverflow.com",
                        "path": "/",
                        "expires": 1639299801,
                        "size": 31,
                        "httpOnly": false,
                        "secure": false,
                        "session": false,
                        "priority": "Medium",
                        "sameParty": false,
                        "sourceScheme": "Secure",
                        "sourcePort": 443
                    },
                    {
                        "name": "_gat",
                        "value": "1",
                        "domain": ".stackoverflow.com",
                        "path": "/",
                        "expires": 1639213461,
                        "size": 5,
                        "httpOnly": false,
                        "secure": false,
                        "session": false,
                        "priority": "Medium",
                        "sameParty": false,
                        "sourceScheme": "Secure",
                        "sourcePort": 443
                    }
                ]
            },
            "cookieConsent": true,
            "cookieManagement": true,
            "cookieDetailPage": "https://stackoverflow.com/legal/cookie-policy"
        },
        "adaCompliance": {
            "labels": [
                {
                    "ID": "billing-period",
                    "html": "<input id=\"billing-period\" name=\"billing-period\" type=\"checkbox\" checked=\"\">"
                }
            ],
            "tab_Violations": {
                "intViolations": [
                    "<label class=\"flex--item s-label fw-normal mr8 us-none\" for=\"billing-period\" style=\"color:inherit\">Annual billing discount</label>"
                ],
                "tabIndexViolations": []
            },
            "altImageText": {
                "totalimg": 40,
                "score": 29,
                "ViolatedTags": [
                    "<img class=\"wmx100 mx-auto my8 h-auto d-block\" width=\"139\" height=\"114\" src=\"https://cdn.sstatic.net/Img/teams/teams-illo-free-sidebar-promo.svg?v=47faa659a05e\" alt=\"\">",
                    "<img src=\"https://cdn.sstatic.net/Img/home/illo-code.svg?v=b7ee00fff9d8\" class=\"uc-none ps-absolute t128 mt128\" style=\"left:8%\" alt=\"\">",
                    "<img src=\"https://cdn.sstatic.net/Img/home/illo-code.svg?v=b7ee00fff9d8\" class=\"uc-none ps-absolute tn128 mt128\" style=\"right:8%\" alt=\"\">",
                    "<img width=\"1270\" height=\"892\" class=\"js-lazy-load wmx100 w100 h-auto d-block btr-sm bt bc-orange-500 bs-lg t t-opacity o0\" data-src=\"https://cdn.sstatic.net/Img/product/teams/screens/illo-question.png?v=14c5863a5550\" alt=\"\">",
                    "<img width=\"1270\" height=\"892\" class=\"js-lazy-load wmx100 w100 h-auto d-block btr-sm bbr-lg bt bc-orange-500 bs-lg t t-opacity o0\" data-src=\"https://cdn.sstatic.net/Img/product/teams/screens/illo-for-you.png?v=ab49238abe04\" alt=\"\">",
                    "<img width=\"1270\" height=\"892\" class=\"js-lazy-load wmx100 w100 h-auto d-block btr-sm bt bc-orange-500 bs-lg t t-opacity o0\" data-src=\"https://cdn.sstatic.net/Img/product/teams/screens/illo-home-search.png?v=1ccd850cd929\" alt=\"\">",
                    "<img width=\"421\" height=\"465\" class=\"js-lazy-load wmx100 h-auto d-block t t-opacity o0\" data-src=\"https://cdn.sstatic.net/Img/home/illo-integrations-left.png?v=0a97d470e180\" alt=\"\">",
                    "<img src=\"https://cdn.sstatic.net/Img/product/teams/microsoft-integration/microsoft-teams-logo.svg?v=00361aadd408\" width=\"48\" height=\"48\" class=\"native w48 h48 wmx75\" alt=\"\">",
                    "<img width=\"421\" height=\"465\" class=\"js-lazy-load wmx100 h-auto d-block t t-opacity o0\" data-src=\"https://cdn.sstatic.net/Img/home/illo-integrations-right.png?v=90c26b9154c7\" alt=\"\">",
                    "<img class=\"w100 h100 d-block us-none pe-none ps-absolute t0 r0 l0 b0 z-base\" style=\"transform: scaleX(-1)\" src=\"https://cdn.sstatic.net/Img/home/illo-se.svg?v=f7e844293cc5\" alt=\"\">",
                    "<img class=\"w100 h100 d-block us-none pe-none ps-absolute t0 r0 l0 b0 z-base\" src=\"https://cdn.sstatic.net/Img/home/illo-se.svg?v=f7e844293cc5\" alt=\"\">"
                ]
            },
            "headers": [
                {
                    "Error": "H1 not present",
                    "level": [
                        3
                    ],
                    "html": "<h3 class=\"flex--item\">\n                <a href=\"https://stackoverflow.com\">current community</a>\n            </h3>",
                    "type": "1"
                },
                {
                    "Error": "Non consecutive headers present",
                    "level": [
                        2,
                        5
                    ],
                    "html": "<h5 class=\"-title\"><a href=\"https://stackoverflow.com\" class=\"js-gps-track\" data-gps-track=\"footer.click({ location: 1, link: 15})\">Stack Overflow</a></h5>",
                    "type": "3",
                    "htmlprv": "<h2 class=\"fw-normal fs-headline2 lh-sm p-ff-roboto-slab mb24 mx-auto wmx6\">Explore technical topics and other disciplines across 170+ Q&amp;A communities</h2>"
                }
            ],
            "contrast": [
                {
                    "innerHTML": "Stack Overflow",
                    "outerHTML": "<span class=\"-img _glyph\">Stack Overflow</span>",
                    "Background Color": {
                        "red": 248,
                        "green": 249,
                        "blue": 249,
                        "alpha": 1
                    },
                    "Text Color": {
                        "red": 0,
                        "green": 116,
                        "blue": 204,
                        "alpha": 1
                    },
                    "Contrast Ratio": "4.56",
                    "AA Compliance": true,
                    "AAA Compliance": false,
                    "AA Suggestions": "No AA contrast issues",
                    "AAA Suggestions": {
                        "fg": "#00579b",
                        "bg": "#f8f9f9",
                        "contrast": "7.02"
                    }
                },
                {
                    "innerHTML": "\n                        Products\n                    ",
                    "outerHTML": "<a href=\"#\" class=\"-marketing-link js-gps-track js-products-menu\" aria-controls=\"products-popover\" data-controller=\"s-popover\" data-action=\"s-popover#toggle\" data-s-popover-placement=\"bottom\" data-s-popover-toggle-class=\"is-selected\" data-gps-track=\"top_nav.products.click({location:1, destination:1})\" data-ga=\"[&quot;top navigation&quot;,&quot;products menu click&quot;,null,null,null]\">\n                        Products\n                    </a>",
                    "Background Color": {
                        "red": 248,
                        "green": 249,
                        "blue": 249,
                        "alpha": 1
                    },
                    "Text Color": {
                        "red": 82,
                        "green": 89,
                        "blue": 96,
                        "alpha": 1
                    },
                    "Contrast Ratio": "6.73",
                    "AA Compliance": true,
                    "AAA Compliance": false,
                    "AA Suggestions": "No AA contrast issues",
                    "AAA Suggestions": {
                        "fg": "#4f565e",
                        "bg": "#f8f9f9",
                        "contrast": "7.05"
                    }
                },
            ]
        }
    }
}
*/

function rgba2hex(orig) {
    var a
      rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+),?([^,\s)]+)?/i),
      alpha = (rgb && rgb[4] || "").trim(),
      hex = rgb ?
      (rgb[1] | 1 << 8).toString(16).slice(1) +
      (rgb[2] | 1 << 8).toString(16).slice(1) +
      (rgb[3] | 1 << 8).toString(16).slice(1) : orig;
  
    if (alpha !== "") {
      a = alpha;
    } else {
      a = 01;
    }
    // multiply before convert to HEX
    a = ((a * 255) | 1 << 8).toString(16).slice(1)
    hex = hex + a;
  
    return hex;
}


function parseCookies(data) {
    let content = []
    content.append({
        text:"Cookie Details",
        style: "header"
    })
    if(data){
        content.append( (data.cookieConsent) ? (`✅Page has cookie consent`) : (`❌Page does not have cookie consent`))
        content.append((data.cookieManagement) ? (`✅Page has cookie management`) : (`❌Page does not have cookie management`))
        content.append((data.cookieDetailPage !== "")? `📚Details about the cookies🍪 used in this site🌐 can be found at ${data.cookieDetailPage}`:`No Cookie Detail page`)
        data.cookieInfo.cookies.foreach((element,i)=>{
            content.append(
                {text: `Cookie-${i}: `, fontSize: 15, bold: true},
            )
            content.append({
                text:[
                    {text: 'Name: ', fontSize: 15, bold: true},
                    element['name'],
                    {text: 'Session: ', fontSize: 15, bold: true},
                    element['session'],
                    {text: 'HTTP only: ', fontSize: 15, bold: true},
                    element['httpOnly'],
                    {text: 'Domain: ', fontSize: 15, bold: true},
                    element['domain'],
                    {text: 'Expiry: ', fontSize: 15, bold: true},
                    (cookie.expires!==-1) ? (moment(new Date(cookie.expires * 1000)).format('MMMM Do YYYY, h:mm:ss a')) : "Exists only for the current session",
                    {text: 'More info: ', fontSize: 15, bold: true},
                    JSON.stringify(element,null,2),
                ]
            })
        })
    }else{
        //:TODO 
    }
    return content;
}

function parseADA(data) {
    let content =[]
    content.append({
        text:"Security Details",
        style: "header"
    })
    if(data){
        content.append({
            text:"Label Violations",
            style: "header3"
        })
        data['labels'].forEach(element => {
            content.append({
                text:[
                    {text: 'Element: ', fontSize: 15, bold: true},
                    element["html"],
                ]
            })
        });
        content.append({
            text:"Interactive Elements Violations:",
            style: "header3"
        })
        data['tab_Violations']['intViolations'].forEach(element => {
            content.append({
                text:[
                    {text: 'Element: ', fontSize: 15, bold: true},
                    element,
                ]
            })
        });
        content.append({
            text:"Tab Index Violations:",
            style: "header3"
        })
        data['tab_Violations']['tabIndexViolations'].forEach(element => {
            content.append({
                text:[
                    {text: 'Element: ', fontSize: 15, bold: true},
                    element,
                ]
            })
        });
        content.append({
            text:"Image alt-text Violations:",
            style: "header3"
        })
        content.append({
            text:[
                {text: 'Total Images', fontSize: 15, bold: true},
                data['altImageText']['totalimg'],
            ]
        })
        content.append({
            text:[
                {text: 'Issuer', fontSize: 15, bold: true},
                data['altImageText']['score'],
            ]
        })
        data['altImageText']['ViolatedTags'].forEach(element => {
            content.append({
                text:[
                    {text: 'Element: ', fontSize: 15, bold: true},
                    element,
                ]
            })
        });
        content.append({
            text:"Contrast Violations:",
            style: "header3"
        })
        data['contrast'].forEach((element,i) => {
            content.append(
                {text: `Violation-${i}: `, fontSize: 15, bold: true},
            )
            content.append({
                text:[
                    {text: 'Text: ', fontSize: 15, bold: true},
                    element['innerHTML'],
                    {text: 'Background: ', fontSize: 15, bold: true},
                    element['outerHTML'],
                    {text: 'Text Color: ', fontSize: 15, bold: true},
                    rgba2hex(`rgba("${element['Text Color']['red']},${element['Text Color']['green']},${element['Text Color']['blue']},${element['Text Color']['alpha']}")`),
                    element['Text Color'],
                    {text: 'Background Color: ', fontSize: 15, bold: true},
                    rgba2hex(`rgba("${element['Background Color']['red']},${element['Background Color']['green']},${element['Background Color']['blue']},${element['Background Color']['alpha']}")`),
                    {text: 'Contrast Ratio: ', fontSize: 15, bold: true},
                    element['Contrast Ratio'],
                    {text: 'AA Compliance: ', fontSize: 15, bold: true},
                    element['AA Compliance'],
                    {text: 'AAA Compliance: ', fontSize: 15, bold: true},
                    element['AAA Compliance'],
                    {text: 'AA Suggestions: ', fontSize: 15, bold: true},
                    (element['AA Suggestions']['fg'])?{
                        ul: [
                            {text:[
                                {text: 'Text Color: ', fontSize: 15, bold: true},
                                element['AA Suggestions']['fg'],
                                {text: 'Background Color: ', fontSize: 15, bold: true},
                                element['AA Suggestions']['bg'],
                            ]}
                        ]
                    }:element['AA Suggestions'],
                    {text: 'AAA Suggestions: ', fontSize: 15, bold: true},
                    (element['AAA Suggestions']['fg'])?{
                        ul: [
                            {text:[
                                {text: 'Text Color: ', fontSize: 15, bold: true},
                                element['AAA Suggestions']['fg'],
                                {text: 'Background Color: ', fontSize: 15, bold: true},
                                element['AAA Suggestions']['bg'],
                            ]}
                        ]
                    }:element['AAA Suggestions'],
                ]
            })
        });
    }
    return content;
}

function parseSSL(data) {
    let content = []
    content.append({
        text:"Security Details",
        style: "header"
    })
    if(data){
        content.append({
            text:[
                {text: 'Name:', fontSize: 15, bold: true},
                data['_subjectName'],
            ]
        })
        content.append({
            text:[
                {text: 'Issuer', fontSize: 15, bold: true},
                data['_issuer'],
            ]
        })
        content.append({
            text:[
                {text: 'ValidFrom:', fontSize: 15, bold: true},
                data['_validFrom'],
            ]
        })
        content.append({
            text:[
                {text: 'ValidTo:', fontSize: 15, bold: true},
                data['_validTo'],
            ]
        })
        content.append({
            text:[
                {text: 'Protocol:', fontSize: 15, bold: true},
                data['_protocol'],
            ]
        })
    }else{
        content.append({
            text:"❌ Website is not secure!",
            style: "header2"
        })
    }
    return content
}

function generateDefinition(data) {
    let sc = (parseSSL(data.securityDetails))
    let ac = (parseADA(data.adaCompliance))
    let cc = (parseCookies(data.cookieDetails))
    let totalContent = []
    totalContent = [...sc,...cc,...ac];
    let defination = {
        content:totalContent,
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify'
            },
            header2:{
                fontSize: 16,
                bold: true,
                alignment: 'justify'
            },
            header3:{
                fontSize: 14,
                bold: true,
                alignment: 'justify'
            }
        }
    }
    return defination
}

module.exports = generateDefinition;