console.log("JS File loaded")

loadSSL = (data,url) => {
    let HTML = `<h1>SSL 📑 certificate and Expiry for <a href="https://${url}">${url}</a></h1>`
    if (data.length !== 0) {
        HTML += `<p>The certificate is valid upto: <span style="color:green">${moment(data.valid_to).format('MMMM Do YYYY, h:mm:ss a')}</span></p>`
        HTML += `<p>Certificate expires <span style="color:red">${moment(data.valid_to).startOf('day').fromNow()}</span></p>`
        HTML += `<p>Issued to: <b>${data["subject"]["CN"]}</b></p>`
        HTML += `<p>Issued By:<b> ${data["issuer"]["CN"]}</b></p>`
        HTML += `<div class="accordion accordion-flush border border-dark" id="accordionFlushExample">
                <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    More Details of certificate
                    </button>
                </h2>
                <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body"><pre readonly id="more-details">${syntaxHighlight(data)}</pre></div>
                </div>
                </div>
            </div>`
    } else {
        HTML += `<h4><b>Opps!! Something Wrong.</b></h4>`
    }
    document.getElementById('compliance-data').innerHTML = HTML;
    // let editor = new JsonEditor("#more-details", data,);
    // editor.load(data);

}
loadcookie = (data,url) => {
    let HTML = `<h1>🍪 Cookie Consent and 👀 Cookie details for <a href="https://${url}">${url}</a></h1>`;
    HTML += (data.cookieConsent) ? (`<p>✅Page has cookie consent</p>`) : (`<p>❌Page does not have cookie consent</p>`)
    if (data.cookieDetailPage !== "")
        HTML += `<p>📚Details about the cookies🍪 used in this site🌐 can be found at <a href="${data.cookieDetailPage}">${data.cookieDetailPage}</a></p>`
    HTML += (data.cookieManagement) ? (`<p>✅Page has cookie management</p>`) : (`<p>❌Page does not have cookie management</p>`)
    let cookieInfo = data.cookieInfo.cookies
    HTML += (cookieInfo.length) ? (`<h2>Cookie details are as follows: </h2>`) : (`<p>😌 This site does not use any cookie.</p>`)
    if (cookieInfo.length) {
        cookieInfo.forEach((cookie, id) => {
            HTML +=
                `
            <div class="m-2 border border-dark">
                <div class="row m-2">
                    <p><b>Name: </b>${cookie.name}</p>
                    <p><b>Value: </b>${cookie.value}</p>
                    <p><b>Session: </b>${(!cookie.session) ? ("❌false") : ("✅true")}</p>
                    <p><b>Secure: </b>${(!cookie.secure) ? ("❌false") : ("✅true")}</p>
                    <p><b>HTTP only: </b>${(!cookie.httponly) ? ("❌false") : ("✅true")}</p>
                    <p><b>Domain: ${cookie.domain}</b></p>
                    <div class="accordion accordion-flush border border-dark" id="${cookie.name}">
                        <div class="accordion-item">
                        <h2 class="accordion-header" id="${cookie.value}">
                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#cookie${id}" aria-expanded="false" aria-controls="cookie${id}">
                            More Details of Cookie
                            </button>
                        </h2>
                        <div id="cookie${id}" class="accordion-collapse collapse" aria-labelledby="${cookie.value}" data-bs-parent="#accordionFlushExample">
                            <div class="accordion-body"><pre>${syntaxHighlight(cookie)}</pre></div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
            `
        })
    }
    // HTML += `<pre>${JSON.stringify(data.cookieInfo.cookies,undefined,1)}</pre>`
    document.getElementById('compliance-data').innerHTML = HTML;
}
loadADA = (data,url) => {
    let HTML = `<div class="m-2"><h1>🌈 ADA Compliance details for <a href="https://${url}">${url}</a></h1></div>`

    HTML += `<center><div class="btn-group m-4" role="group" aria-label="Basic checkbox toggle button group">
                <input type="checkbox" class="btn-check" checked id="btncheck1" autocomplete="off">
                <label class="btn btn-outline-primary" for="btncheck1">Alt Image Text</label>
            
                <input type="checkbox" class="btn-check" checked id="btncheck2" autocomplete="off">
                <label class="btn btn-outline-primary" for="btncheck2">Label violation</label>
            
                <input type="checkbox" class="btn-check" checked id="btncheck3" autocomplete="off">
                <label class="btn btn-outline-primary" for="btncheck3">Headers Violation</label>

                <input type="checkbox" class="btn-check" checked id="btncheck4" autocomplete="off">
                <label class="btn btn-outline-primary" for="btncheck4">Contrast Violation</label>

                <input type="checkbox" class="btn-check" checked id="btncheck5" autocomplete="off">
                <label class="btn btn-outline-primary" for="btncheck5">Tab Violations</label>
            </div></center>`

    HTML += `<div class="m-2 border border-dark px-4 py-2" id="image-compliance">
                Total number of images present in the website are ${data.altImageText.totalimg}<br>
                Number of images which have alt-text are ${data.altImageText.score}
            </div>`

    let violations = ''
    data.tab_Violations.intViolations.forEach((el, i) => {
        violations += `<div class="m-2">
            <p><b>Interactive element violation</b></p>
            <label for="labeltab${i}"></label>
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="labeltab${i}">${el.trim()}</textarea>
        </div>`
    })
    data.tab_Violations.tabIndexViolations.forEach((el, i) => {
        violations += `<div class="m-2">
            <p><b>Tab Index violation</b></p>
            <label for="labeltab${i}"></label>
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="labeltab${i}">${el.trim()}</textarea>
        </div>`
    })
    HTML += `<div class="accordion accordion-flush border border-dark m-2" id="accordionTab">
                <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOneTab">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                    data-bs-target="#flush-collapseOneTab" aria-expanded="false" aria-controls="flush-collapseOneTab">
                    Tab-Index Violations: ${data.tab_Violations.tabIndexViolations.length}<br>
                    InterativeElements Violations: ${data.tab_Violations.intViolations.length}
                    </button>
                </h2>
                <div id="flush-collapseOneTab" class="accordion-collapse collapse" aria-labelledby="flush-headingOneTab"
                    data-bs-parent="#accordionTab">
                    <div class="accordion-body">
                    ${violations}
                    </div>
                </div>
                </div>
            </div>`


    let labelInfo = '';
    data.labels.forEach((el, i) => {
        labelInfo += `<div class="m-2">
            <p><b>ID of the input tag: ${el.ID}</b></p>
            <label for="labelhtml${i}"></label>
            <textarea readonly class="form-control" placeholder="Leave a comment here" id="labelhtml${i}">${el.html.trim()}</textarea>
        </div>`
    })
    HTML +=
        `   <div class="accordion accordion-flush border border-dark m-2" id="accordionLabel">
            <div class="accordion-item">
                <h2 class="accordion-header" id="flush-headingOneLabel">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOneLabel" aria-expanded="false" aria-controls="flush-collapseOneLabel">
                Inputs which do not have labels🏷 are ${data.labels.length}
                </button>
                </h2>
                <div id="flush-collapseOneLabel" class="accordion-collapse collapse" aria-labelledby="flush-headingOneLabel" data-bs-parent="#accordionLabel">
                <div class="accordion-body">
                    ${labelInfo}
                </div>
            </div>
            </div>
            </div>
            `
    HTML += "<div id='headers-compliance' class='border border-dark m-2'>"
    data.headers.forEach((el, i) => {
        if (el.htmlprv == "") {
            HTML +=
                `   <div class="accordion accordion-flush" id="accordionFlushExample">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-headingOne">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                    ${el.Error}
                    </button>
                    </h2>
                    <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                    ${el.Error + " instead it started with H" + el.level[0]}</div>
                    <div class="form-floating">
                    <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea">${el.html.trim()}</textarea>
                    <label for="floatingTextarea"></label>
                    </div>
                </div>
                </div>
                </div>
            `

        } else {
            HTML +=
                `
            <div class="accordion accordion-flush" id="accordionFlush${i}">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="flush-heading${String(i)}">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapse${String(i)}" aria-expanded="false" aria-controls="flush-collapse${String(i)}">
                    ${el.Error}
                    </button>
                    </h2>
                    <div id="flush-collapse${String(i)}" class="accordion-collapse collapse" aria-labelledby="flush-heading${String(i)}" data-bs-parent="#accordionFlushExample">
                    <div class="accordion-body">
                    ${el.Error + " at H" + el.level[0] + " at H" + el.level[1]}</div>
                    <div class="form-floating">
                    ${"H" + el.level[0] + ": Details"}
                    <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea">${el.html.trim()}</textarea>
    
                    <label for="floatingTextarea"></label>
                    </div>

                    <div class="form-floating2">
                    ${"H" + el.level[1] + ": Details"}
                    <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea2">${el.htmlprv.trim()}</textarea>
                    <label for="floatingTextarea2"></label>
                    </div>
                </div>
                </div>
                </div>
            `

        }

    })
    HTML += "</div>"

    HTML += "<div id='contrast-compliance' class='border border-dark m-2'>"
    data.contrast.forEach(element => {
        HTML += `
        <div class="m-2 border border-dark rounded-3" >
            <div class="row m-2"> 
                <div class="col">
                <div class="row">
                    <div class="col">
                        <div class="row" style="background-color: rgb(${element['Background Color']['red']}, ${element['Background Color']['green']}, ${element['Background Color']['blue']}, ${element['Background Color']['alpha']}); height:100px; width:100px;"></div>
                        <div class="row">Background Color</div>
                    </div>
                    <div class="col">
                        <div class="row" style="background-color: rgb(${element['Background Color']['red']}, ${element['Text Color']['green']}, ${element['Text Color']['blue']}, ${element['Text Color']['alpha']}); height:100px; width:100px;"></div>
                        <div class="row">Text Color</div>
                    </div>
                </div>
                </div>
                <div class="col">
                    <div class="row">Contrast Ratio: ${element["Contast Ratio"]}</div>
                    <div class="row">AA Compliance: ${element["AA Compliance"]}</div>
                    <div class="row">AAA Compliance: ${element["AAA Compliance"]}</div>
                </div>
                <div class="col">
                    <div class="row">Text: <textarea readonly>"${element["innerHTML"]}"</textarea></div>
                    <div class="row">Parent: <textarea readonly>"${element["outerHTML"]}"</textarea></pre></div>
                </div>
            </div>
            <p class="ms-2"><b>Suggestions:</b></p>
            <div class="row m-2">
                <div class="row">
                    <div class="col">
                    <div class="row">
                        <div class="col">
                            <div class="row" style="background-color: ${element['AA Suggestions']['bg']};height:100px; width:100px;"></div>
                            <div class="row">AA Background Color: ${element['AA Suggestions']['bg']}</div>
                        </div>
                        <div class="col">
                            <div class="row" style="background-color: ${element['AA Suggestions']['fg']};height:100px; width:100px;"></div>
                            <div class="row">AA Text Color: ${element['AA Suggestions']['fg']}</div>
                        </div>
                    </div>
                    </div>
                    <div class="col">
                    <div class="row">
                        <div class="col">
                            <div class="row" style="background-color: ${element['AAA Suggestions']['bg']}; height:100px; width:100px;"></div>
                            <div class="row">AAA Background Color: ${element['AAA Suggestions']['bg']} </div>
                        </div>
                        <div class="col">
                            <div class="row" style="background-color: ${element['AAA Suggestions']['fg']}; height:100px; width:100px;"></div>
                            <div class="row">AAA Text Color: ${element['AAA Suggestions']['fg']}</div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        `
    });
    HTML += "</div>"

    document.getElementById('compliance-data').innerHTML = HTML;

    document.getElementById("btncheck1").addEventListener('change', (event) => {
        if (event.target.checked) {
            $("#image-compliance").show();
            console.log("altc")
        } else {
            $("#image-compliance").hide();
            console.log("altn")
        }
    })
    document.getElementById("btncheck2").addEventListener('change', (event) => {
        if (event.target.checked) {
            $("#accordionLabel").show()
        } else {
            $("#accordionLabel").hide()
        }
    })
    document.getElementById("btncheck3").addEventListener('change', (event) => {
        if (event.target.checked) {
            $("#headers-compliance").show()
        } else {
            $("#headers-compliance").hide()
        }
    })
    document.getElementById("btncheck4").addEventListener('change', (event) => {
        if (event.target.checked) {
            $("#contrast-compliance").show()
        } else {
            $("#contrast-compliance").hide()
        }
    })
    document.getElementById("btncheck5").addEventListener('change', (event) => {
        if (event.target.checked) {
            $("#accordionTab").show()
        } else {
            $("#accordionTab").hide()
        }
    })
}

let form = document.getElementById("search-compliance");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputtext = document.getElementById('search-url').value;
    let url = inputtext;
    console.log(url);

    document.getElementById("search").innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...`
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3333/api/compliance", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        searchUrl: url
    }));
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("search").innerHTML = `Search`
            let response = JSON.parse(xhr.responseText)
            document.getElementById("ssl").classList.add("active")
            loadSSL(response.ssl)
            console.log(response)
            document.getElementById("ssl").addEventListener("click", (event) => {
                event.preventDefault()
                document.getElementById("ssl").classList.add("active")
                document.getElementById("cookies").classList.remove("active")
                document.getElementById("ada").classList.remove("active")
                loadSSL(response.ssl)
            });
            document.getElementById("ada").addEventListener("click", (event) => {
                event.preventDefault()
                document.getElementById("ada").classList.add("active")
                document.getElementById("ssl").classList.remove("active")
                document.getElementById("cookies").classList.remove("active")
                loadADA(response.data.adaCompliance)
            });
            document.getElementById("cookies").addEventListener("click", (event) => {
                event.preventDefault()
                document.getElementById("cookies").classList.add("active")
                document.getElementById("ada").classList.remove("active")
                document.getElementById("ssl").classList.remove("active")
                loadcookie(response.data.cookieDetails)
            });
        } else {
            document.getElementById("search").innerHTML = `Search`
        }
    }
})

let homeForm = document.getElementById("home-search-compliance");
homeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputtext = document.getElementById('home-search-url').value;
    let url = urlCleaner(inputtext);
    console.log(url);

    document.getElementById("home-search").innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
    Loading...`
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3333/api/compliance", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        searchUrl: url
    }));
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("home-search").innerHTML = `Search`
            let response = JSON.parse(xhr.responseText)
            document.getElementById("ssl").classList.add("active")
            loadSSL(response.ssl,url)
            console.log(url);
            document.getElementById("ssl").addEventListener("click", (event) => {
                event.preventDefault()
                document.getElementById("ssl").classList.add("active")
                document.getElementById("cookies").classList.remove("active")
                document.getElementById("ada").classList.remove("active")
                loadSSL(response.ssl)
            });
            document.getElementById("ada").addEventListener("click", (event) => {
                event.preventDefault()
                document.getElementById("ada").classList.add("active")
                document.getElementById("ssl").classList.remove("active")
                document.getElementById("cookies").classList.remove("active")
                loadADA(response.data.adaCompliance,url)
            });
            document.getElementById("cookies").addEventListener("click", (event) => {
                event.preventDefault()
                document.getElementById("cookies").classList.add("active")
                document.getElementById("ada").classList.remove("active")
                document.getElementById("ssl").classList.remove("active")
                loadcookie(response.data.cookieDetails,url)
            });
        } else {
            document.getElementById("home-search").innerHTML = `Search`
        }
    }
})

function syntaxHighlight(json) {
    if (typeof (json) != 'string') {
        json = JSON.stringify(json, function(k,v) {
            if(v instanceof Array)
              return JSON.stringify(v);
            return v;
          }, 2).replace(/\\/g, '')
                .replace(/\"\[/g, '[')
                .replace(/\]\"/g,']')
                .replace(/\"\{/g, '{')
                .replace(/\}\"/g,'}');
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}

function urlCleaner (url) {
    // shouldcover cases like https://, http://, www.
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
}

document.getElementById("search-url").addEventListener('keyup', (event) => {
    if (event.target.value==='') {
        document.getElementById('search').classList.add("disabled");
        // console.log("worked")
    } else {
        document.getElementById('search').classList.remove("disabled");
        // console.log("not worked")
    }
})

document.getElementById("home-search-url").addEventListener('keyup', (event) => {
    if (event.target.value==='') {
        document.getElementById('home-search').classList.add("disabled");
        // console.log("worked")
    } else {
        document.getElementById('home-search').classList.remove("disabled");
        // console.log("not worked")
    }
})