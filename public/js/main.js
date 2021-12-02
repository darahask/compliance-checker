console.log("JS File loaded")

loadSSL = (data) => {
    let HTML = '<h1>SSL 📑certificate and Expiry</h1>'
    HTML += `<p>The certificate is valid upto: ${moment(data.valid_to).format('MMMM Do YYYY, h:mm:ss a')}</p>`
    HTML += `<p>Certificate expires ${moment(data.valid_to).startOf('day').fromNow()}</p>`
    HTML += `<p>Issued to: <b>${data["subject"]["CN"]}</b></p>`
    HTML += `<p>Issued By:<b> ${data["issuer"]["CN"]}</b></p>`
    document.getElementById('compliance-data').innerHTML = HTML;
}
loadcookie = (data) => {
    let HTML = '<h1>Cookie Consent and Cookie details</h1>';
    HTML += (data.cookieConsent) ? (`<p>✅Page has cookie consent</p>`) : (`<p>❌Page does not have cookie consent</p>`)
    HTML += `<p>📚Details about the cookies🍪 used in this site🌐 can be found at <a href="${data.cookieDetailPage}">${data.cookieDetailPage}</a></p>`
    HTML += (data.cookieManagement) ? (`<p>✅Page has cookie management</p>`) : (`<p>❌Page does not have cookie management</p>`)
    HTML += `<h2>Cookie deatils are as follows: </h2>`
    HTML += `<pre>${JSON.stringify(data.cookieInfo.cookies,undefined,1)}</pre>`
    document.getElementById('compliance-data').innerHTML = HTML;
}
loadADA = (data) => {
    let HTML = '';
    data.headers.forEach((el)=>{
        HTML += 
        `
        <div class="m-2 border border-dark">
            <div class="row m-2">
                <div class="col">${el.Error}</div>
                <div class="col">${el.level.map((e)=> {return e})}</div>
                <div class="col"><textarea readonly>${el.html}</textarea></div>
            </div>
        </div>
        `
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
            console.log(response)
            document.getElementById("ssl").addEventListener("click", (event) => {
                event.preventDefault()
                loadSSL(response.ssl)
            });
            document.getElementById("ada").addEventListener("click", (event) => {
                event.preventDefault()
                loadADA(response.data.adaCompliance)
            });
            document.getElementById("cookies").addEventListener("click", (event) => {
                event.preventDefault()
                loadcookie(response.data.cookieDetails)
            });
        }else{
            document.getElementById("search").innerHTML = `Search`
        }
    }
})