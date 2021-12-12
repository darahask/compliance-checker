const moment = require('moment')

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
    content.push({
        text: "Cookie Details",
        style: "header"
    })
    if (data) {
        content.push((data.cookieConsent) ? (`✅Page has cookie consent`) : (`❌Page does not have cookie consent`))
        content.push((data.cookieManagement) ? (`✅Page has cookie management`) : (`❌Page does not have cookie management`))
        content.push((data.cookieDetailPage !== "") ? `📚Details about the cookies🍪 used in this site🌐 can be found at ${data.cookieDetailPage}` : `No Cookie Detail page`)
        data.cookieInfo.cookies.forEach((element, i) => {
            content.push(
                { text: `Cookie-${i}: `, fontSize: 12, bold: true },
            )
            let text = [
                {
                    text: [{ text: 'Name: ', fontSize: 12, bold: true },
                    element['name']]
                },
                {
                    text: [{ text: 'Session: ', fontSize: 12, bold: true },
                    element['session']]
                },
                {
                    text: [{ text: 'HTTP only: ', fontSize: 12, bold: true },
                    element['httpOnly']]
                },
                {
                    text: [{ text: 'Domain: ', fontSize: 12, bold: true },
                    element['domain']]
                },
                {
                    text: [{ text: 'Expiry: ', fontSize: 12, bold: true },
                    (element.expires !== -1) ? (moment(new Date(element.expires * 1000)).format('MMMM Do YYYY, h:mm:ss a')) : "Exists only for the current session"]
                },
                {
                    text: [{ text: 'More info: ', fontSize: 12, bold: true },
                    JSON.stringify(element, null, 2)]
                }
            ]
            content = [...content, ...text]
        })
    } else {
        //:TODO 
    }
    return content;
}

function parseADA(data) {
    let content = []
    content.push({
        text: "Ada Compliances",
        style: "header"
    })
    if (data) {
        content.push({
            text: "Label Violations",
            style: "header2"
        })
        data['labels'].forEach(element => {
            content.push({
                text: [
                    { text: 'Element: ', fontSize: 12, bold: true },
                    element["html"],
                ]
            })
        });
        content.push({
            text: "Interactive Elements Violations:",
            style: "header3"
        })
        data['tab_Violations']['intViolations'].forEach(element => {
            content.push({
                text: [
                    { text: 'Element: ', fontSize: 12, bold: true },
                    element,
                ]
            })
        });
        content.push({
            text: "Tab Index Violations:",
            style: "header3"
        })
        data['tab_Violations']['tabIndexViolations'].forEach(element => {
            content.push({
                text: [
                    { text: 'Element: ', fontSize: 12, bold: true },
                    element,
                ]
            })
        });

        content.push({
            text: "Image alt-text Violations:",
            style: "header3"
        })
        content.push({
            text: [
                { text: 'Total Images: ', fontSize: 12, bold: true },
                data['altImageText']['totalimg'],
            ]
        })
        content.push({
            text: [
                { text: 'Total Violations: ', fontSize: 12, bold: true },
                data['altImageText']['score'],
            ]
        })
        data['altImageText']['ViolatedTags'].forEach(element => {
            content.push({
                text: [
                    { text: 'Element: ', fontSize: 12, bold: true },
                    element,
                ]
            })
        });

        content.push({
            text: "Header Violations:",
            style: "header3"
        })
        let violations1 = []
        let violations2 = []
        let violations3 = []
        data['headers'].forEach((el,i)=>{
            if(el['type'] == 1){
                violations1.push({
                    text:[
                        { text:"Violation: ", fontSize: 12, bold: true },
                        `${el['Error']} instead the page started with ${el['level'][0]}`
                    ]
                })
                violations1.push(`Element: ${el['html']}`)
            }else if(el['type'] == 2){
                violations2.push({
                    text:[
                        { text:"Violation: ", fontSize: 12, bold: true },
                        `${el['Error']} at ${el['level'][0]} and ${el['level'][1]}`
                    ]
                })
                violations2.push(`Element: ${el['html']}`)
                violations2.push(`Element prev: ${el['htmlprv']}`)
            }else{
                violations3.push({
                    text:[
                        { text:"Violation: ", fontSize: 12, bold: true },
                        `${el['Error']} at ${el['level'][0]} and ${el['level'][1]}`
                    ]
                })
                violations3.push(`Element: ${el['html']}`)
                violations3.push(`Element prev: ${el['htmlprv']}`)
            }
        })
        content.push({
            text: "H1 Not present:",
            style: "header3"
        })
        content = [...content,...violations1]
        content.push({
            text: "Repeatative Heading Violations:",
            style: "header3"
        })
        content = [...content,...violations2]
        content.push({
            text: "Repeatative Heading Violations:",
            style: "header3"
        })
        content = [...content,...violations3]

        content.push({
            text: "Non Consectutive Heading Tag Violations:",
            style: "header3"
        })
        data['contrast'].forEach((element, i) => {
            content.push(
                { text: `Violation-${i}: `, fontSize: 12, bold: true },
            )
            let text = [
                {text:[{ text: 'Text: ', fontSize: 12, bold: true },
                element['innerHTML']]},
                { text:[{text: 'Background: ', fontSize: 12, bold: true },
                element['outerHTML']]},
                {text:[{ text: 'Text Color: ', fontSize: 12, bold: true },
                rgba2hex(`rgba("${element['Text Color']['red']},${element['Text Color']['green']},${element['Text Color']['blue']},${element['Text Color']['alpha']}")`)]},
                {text:[{ text: 'Background Color: ', fontSize: 12, bold: true },
                rgba2hex(`rgba("${element['Background Color']['red']},${element['Background Color']['green']},${element['Background Color']['blue']},${element['Background Color']['alpha']}")`)]},
                {text:[{ text: 'Contrast Ratio: ', fontSize: 12, bold: true },
                element['Contrast Ratio']]},
                {text:[{ text: 'AA Compliance: ', fontSize: 12, bold: true },
                element['AA Compliance']]},
                {text:[{ text: 'AAA Compliance: ', fontSize: 12, bold: true },
                element['AAA Compliance']]},
                {text:[{ text: 'AA Suggestions: ', fontSize: 12, bold: true },
                (element['AA Suggestions']['fg']) ? {
                    ul: [
                        {
                            text: [
                                { text: 'Text Color: ', fontSize: 12, bold: true },
                                element['AA Suggestions']['fg'],
                                { text: 'Background Color: ', fontSize: 12, bold: true },
                                element['AA Suggestions']['bg'],
                            ]
                        }
                    ]
                } : element['AA Suggestions']]},
                {text:[{ text: 'AAA Suggestions: ', fontSize: 12, bold: true },
                (element['AAA Suggestions']['fg']) ? {
                    ul: [
                        {
                            text: [
                                { text: 'Text Color: ', fontSize: 12, bold: true },
                                element['AAA Suggestions']['fg'],
                                { text: 'Background Color: ', fontSize: 12, bold: true },
                                element['AAA Suggestions']['bg'],
                            ]
                        }
                    ]
                } : element['AAA Suggestions']]},
            ]
            content = [...content,...text]
        });
    }
    return content;
}

function parseSSL(data) {
    let content = []
    content.push({
        text: "Security Details",
        style: "header"
    })
    if (data) {
        content.push({
            text: [
                { text: 'Name:', fontSize: 12, bold: true },
                data['_subjectName'],
            ]
        })
        content.push({
            text: [
                { text: 'Issuer', fontSize: 12, bold: true },
                data['_issuer'],
            ]
        })
        content.push({
            text: [
                { text: 'ValidFrom:', fontSize: 12, bold: true },
                data['_validFrom'],
            ]
        })
        content.push({
            text: [
                { text: 'ValidTo:', fontSize: 12, bold: true },
                data['_validTo'],
            ]
        })
        content.push({
            text: [
                { text: 'Protocol:', fontSize: 12, bold: true },
                data['_protocol'],
            ]
        })
    } else {
        content.push({
            text: "❌ Website is not secure!",
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
    totalContent = [...sc, ...cc, ...ac];
    let defination = {
        content: totalContent,
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'justify'
            },
            header2: {
                fontSize: 16,
                bold: true,
                alignment: 'justify'
            },
            header3: {
                fontSize: 14,
                bold: true,
                alignment: 'justify'
            }
        }
    }
    return defination
}

module.exports = generateDefinition;