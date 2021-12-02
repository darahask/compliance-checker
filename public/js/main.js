console.log("JS File loaded")

loadSSL = (data) => {
    let HTML = '<h1>SSL 📑certificate and Expiry</h1>'
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
    document.getElementById('compliance-data').innerHTML = HTML;
    // let editor = new JsonEditor("#more-details",data,);
    // editor.load(data);
}
loadcookie = (data) => {
    let HTML = '<h1>🍪Cookie Consent and 👀Cookie details</h1>';
    HTML += (data.cookieConsent) ? (`<p>✅Page has cookie consent</p>`) : (`<p>❌Page does not have cookie consent</p>`)
    HTML += (data.cookieDetailPage!=='') ? (`<p>📚Details about the cookies🍪 used in this site🌐 can be found at <a href="${data.cookieDetailPage}">${data.cookieDetailPage}</a></p>`) : (`<p>❌No information about cookies used in this site found</p>`)
    HTML += (data.cookieManagement) ? (`<p>✅Page has cookie management</p>`) : (`<p>❌Page does not have cookie management</p>`)
    let cookieInfo = data.cookieInfo.cookies
    HTML += (cookieInfo.length) ? (`<h2>Cookie details are as follows: </h2>`) : (`<p>😌 This site does not use any cookie.</p>`)
    if(cookieInfo.length){
        cookieInfo.forEach((cookie,id)=>{
            HTML+=
            `
            <div class="m-2 border border-dark">
                <div class="row m-2">
                    <p><b>Name: </b>${cookie.name}</p>
                    <p><b>Value: </b>${cookie.value}</p>
                    <p><b>Session: </b>${(!cookie.session)? ("❌false"):("✅true")}</p>
                    <p><b>Secure: </b>${(!cookie.secure)? ("❌false"):("✅true")}</p>
                    <p><b>HTTP only: </b>${(!cookie.httponly)? ("❌false"):("✅true")}</p>
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
loadADA = (data) => {
    let HTML = '';
    data.headers.forEach((el,i)=>{
        if(el.htmlprv=="")
        {
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
                    ${el.Error + " instead it started with H"+el.level[0]}</div>
                    <div class="form-floating">
                    <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea">${el.html.trim()}</textarea>
                    <label for="floatingTextarea"></label>
                    </div>
                </div>
                </div>
                </div>
            `
            
        }else{
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
                    ${el.Error + " at H"+el.level[0]+ " at H"+el.level[1]}</div>
                    <div class="form-floating">
                    ${"H"+el.level[0]+": Details"}
                    <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea">${el.html.trim()}</textarea>
    
                    <label for="floatingTextarea"></label>
                    </div>

                    <div class="form-floating2">
                    ${"H"+el.level[1]+": Details"}
                    <textarea readonly class="form-control" placeholder="Leave a comment here" id="floatingTextarea2">${el.htmlprv.trim()}</textarea>
                    <label for="floatingTextarea2"></label>
                    </div>
                </div>
                </div>
                </div>
            `
            
        }
        
    })
    data.contrast.forEach(element => {
        HTML += `
        <div class="m-2 border border-dark">
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
            <h4>Suggestions:</h4>
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
    document.getElementById('compliance-data').innerHTML = HTML;
}

let form = document.getElementById("search-compliance");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputtext = document.getElementById('search-url');
    let url = inputtext.value;
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
        }else{
            document.getElementById("search").innerHTML = `Search`
        }
    }
})

let homeForm = document.getElementById("home-search-compliance");
homeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputtext = document.getElementById('home-search-url');
    let url = inputtext.value;
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
        }else{
            document.getElementById("home-search").innerHTML = `Search`
        }
    }
})

function syntaxHighlight(json) {
    if (typeof(json) != 'string') {
        json = JSON.stringify(json, undefined, 2);
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