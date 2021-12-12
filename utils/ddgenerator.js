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
        content.push((data.cookieConsent) ? (`Page has cookie consent`) : (`Page does not have cookie consent`))
        content.push((data.cookieManagement) ? (`Page has cookie management`) : (`Page does not have cookie management`))
        content.push((data.cookieDetailPage !== "") ? `Details about the cookies used in this site can be found at - ${data.cookieDetailPage}` : `No Cookie Detail page`)
        data.cookieInfo.cookies.forEach((element, i) => {
            content.push(
                { text: `Cookie-${i}: `, style: "header3" },
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
        content.push({
            text: "Cookies are not used",
            style: "header2"
        })
        content.push('\n')
    }
    return content;
}

function parseADA(data) {
    let content = []
    content.push({
        text: "\nAda Compliances",
        style: "header"
    })
    if (data) {
        content.push({
            text: "Label Violations:",
            style: "header2"
        })
        if (data['labels'].length !== 0) {
            data['labels'].forEach(element => {
                content.push({
                    text: [
                        { text: 'Element: ', fontSize: 12, bold: true },
                        element["html"],
                    ]
                })
            });
        } else {
            content.push({
                text: [
                    { text: 'No label violations found', fontSize: 12, bold: true }
                ]
            })
        }

        content.push({
            text: "\nInteractive Elements Violations:",
            style: "header2"
        })
        if (data['tab_Violations']['intViolations'].length !== 0) {
            data['tab_Violations']['intViolations'].forEach(element => {
                content.push({
                    text: [
                        { text: 'Element: ', fontSize: 12, bold: true },
                        element,
                    ]
                })
            })
        } else {
            content.push({
                text: [
                    { text: 'No interactive violations found', fontSize: 12, bold: true }
                ]
            })
        }

        content.push({
            text: "\nTab Index Violations:",
            style: "header2"
        })
        if (data['tab_Violations']['tabIndexViolations'].length !== 0) {
            data['tab_Violations']['tabIndexViolations'].forEach(element => {
                content.push({
                    text: [
                        { text: 'Element: ', fontSize: 12, bold: true },
                        element,
                    ]
                })
            })
        } else {
            content.push({
                text: [
                    { text: 'No tab index violations found', fontSize: 12, bold: true }
                ]
            })
        };

        content.push({
            text: "\nImage alt-text Violations:",
            style: "header2"
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
                data['altImageText']['totalimg'] - data['altImageText']['score'],
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
            text: "\nHeader Violations:",
            style: "header2"
        })
        let violations1 = []
        let violations2 = []
        let violations3 = []
        data['headers'].forEach((el, i) => {
            if (el['type'] == 1) {
                violations1.push({
                    text: [
                        { text: "Violation: ", fontSize: 12, bold: true },
                        `${el['Error']} instead the page started with ${el['level'][0]}`
                    ]
                })
                violations1.push(`Element: ${el['html']}`)
            } else if (el['type'] == 2) {
                violations2.push({
                    text: [
                        { text: "Violation: ", fontSize: 12, bold: true },
                        `${el['Error']} at ${el['level'][0]} and ${el['level'][1]}`
                    ]
                })
                violations2.push(`Element: ${el['html']}`)
                violations2.push(`Previous Element: ${el['htmlprv']}`)
            } else {
                violations3.push({
                    text: [
                        { text: "Violation: ", fontSize: 12, bold: true },
                        `${el['Error']} at ${el['level'][0]} and ${el['level'][1]}`
                    ]
                })
                violations3.push(`Element: ${el['html']}`)
                violations3.push(`Previous Element: ${el['htmlprv']}`)
            }
        })
        content.push({
            text: "H1 Not present:",
            style: "header3"
        })
        if (violations1.length !== 0) {
            content = [...content, ...violations1]
        } else {
            content.push({
                text: [
                    { text: 'No violations found', fontSize: 12, bold: true }
                ]
            })
        }
        content.push({
            text: "\nRepeatative Heading Violations:",
            style: "header3"
        })
        if (violations2.length !== 0) {
            content = [...content, ...violations2]
        } else {
            content.push({
                text: [
                    { text: 'No violations found', fontSize: 12, bold: true }
                ]
            })
        }
        content.push({
            text: "\nNon Consectutive Heading Tag Violations:",
            style: "header3"
        })
        if (violations3.length !== 0) {
            content = [...content, ...violations3]
        } else {
            content.push({
                text: [
                    { text: 'No violations found', fontSize: 12, bold: true }
                ]
            })
        }

        content.push({
            text: "\nContrast Violations:",
            style: "header2"
        })
        data['contrast'].forEach((element, i) => {
            content.push(
                { text: `Violation-${i}: `, style: "header3" },
            )
            let text = [
                {
                    text: [{ text: 'Text: ', fontSize: 12, bold: true },
                    element['innerHTML']]
                },
                {
                    text: [{ text: 'Background: ', fontSize: 12, bold: true },
                    element['outerHTML']]
                },
                {
                    text: [{ text: 'Text Color: ', fontSize: 12, bold: true },
                    "#" + rgba2hex(`rgba(${element['Text Color']['red']},${element['Text Color']['green']},${element['Text Color']['blue']},${element['Text Color']['alpha']})`)]
                },
                {
                    text: [{ text: 'Background Color: ', fontSize: 12, bold: true },
                    "#" + rgba2hex(`rgba(${element['Background Color']['red']},${element['Background Color']['green']},${element['Background Color']['blue']},${element['Background Color']['alpha']})`)]
                },
                {
                    text: [{ text: 'Contrast Ratio: ', fontSize: 12, bold: true },
                    element['Contrast Ratio']]
                },
                {
                    text: [{ text: 'AA Compliance: ', fontSize: 12, bold: true },
                    element['AA Compliance']]
                },
                {
                    text: [{ text: 'AAA Compliance: ', fontSize: 12, bold: true },
                    element['AAA Compliance']]
                },
                {
                    text: { text: 'AA Suggestions: ', fontSize: 12, bold: true }
                },
                (element['AA Suggestions']['fg']) ? {
                    ul: [
                        {
                            text: [
                                { text: 'Text Color: ', fontSize: 12, bold: true },
                                element['AA Suggestions']['fg'],
                            ]
                        },
                        {
                            text: [
                                { text: 'Background Color: ', fontSize: 12, bold: true },
                                element['AA Suggestions']['bg'],
                            ]
                        }
                    ]
                } : element['AA Suggestions'],
                {
                    text: { text: 'AAA Suggestions: ', fontSize: 12, bold: true }
                },
                (element['AAA Suggestions']['fg']) ? {
                    ul: [
                        {
                            text: [
                                { text: 'Text Color: ', fontSize: 12, bold: true },
                                element['AAA Suggestions']['fg'],
                            ]
                        },
                        {
                            text: [
                                { text: 'Background Color: ', fontSize: 12, bold: true },
                                element['AAA Suggestions']['bg'],
                            ]
                        }
                    ]
                } : element['AAA Suggestions'],
                '\n'
            ]
            content = [...content, ...text]
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
                { text: 'Name: ', fontSize: 12, bold: true },
                data['_subjectName'],
            ]
        })
        content.push({
            text: [
                { text: 'Issuer: ', fontSize: 12, bold: true },
                data['_issuer'],
            ]
        })
        content.push({
            text: [
                { text: 'ValidFrom: ', fontSize: 12, bold: true },
                moment(new Date(data._validFrom * 1000)).format('MMMM Do YYYY, h:mm:ss a'),
            ]
        })
        content.push({
            text: [
                { text: 'ValidTill: ', fontSize: 12, bold: true },
                moment(new Date(data._validTo * 1000)).format('MMMM Do YYYY, h:mm:ss a'),
            ]
        })
        content.push({
            text: [
                { text: 'Protocol: ', fontSize: 12, bold: true },
                data['_protocol'],
            ]
        })
        content.push('\n')
    } else {
        content.push({
            text: "Website is not secure!",
            style: "header2"
        })
        content.push('\n')
    }
    return content
}

function generateDefinition(data) {
    let sc = (data.securityDetails) ? (parseSSL(data.securityDetails)) : []
    let ac = (data.adaCompliance) ? (parseADA(data.adaCompliance)) : []
    let cc = (data.cookieDetails) ? (parseCookies(data.cookieDetails)) : []
    let totalContent = []
    totalContent = [...sc, ...cc, ...ac];
    let definition = {
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
    return definition
}

module.exports = generateDefinition;