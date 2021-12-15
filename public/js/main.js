console.log("JS File loaded")
sanitizer()

let serverresponse;
let url = "";
let callURL = "http://localhost:3333/api/"

let homeForm = document.getElementById("home-search-compliance");
var sslRequested, adaRequested, cookieRequested

homeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!document.getElementById("sslRequested").checked && !document.getElementById("adaRequested").checked && !document.getElementById("cookieRequested").checked) {
        document.getElementById("selection-alert").innerHTML = '<div class="alert alert-danger alert-dismissible" role="alert">Please select at least one parameter for report.<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
    } else {
        let inputtext = document.getElementById('home-search-url').value;
        url = urlCleaner(inputtext);
        console.log(url);

        document.getElementById("home-search").innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`

        sslRequested = document.getElementById("sslRequested").checked
        adaRequested =  document.getElementById("adaRequested").checked
        cookieRequested =  document.getElementById("cookieRequested").checked

        var xhr = new XMLHttpRequest();
        xhr.open("POST", callURL + "compliance", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            ssl: sslRequested,
            ada: adaRequested,
            cookie: cookieRequested,
            searchUrl: url
        }));
        console.log({ssl: sslRequested,
            ada: adaRequested,
            cookie: cookieRequested,
            searchUrl: url});
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                let response = JSON.parse(xhr.responseText)
                console.log(response)
                serverresponse = response
                // document.getElementById("home-search").innerHTML = `Search`
                document.getElementById("ssl").addEventListener("click", (event) => {
                    event.preventDefault()
                    sslActive()
                    loadSSL(response.data.securityDetails, url)
                });
                document.getElementById("ada").addEventListener("click", (event) => {
                    event.preventDefault()
                    adaActive()
                    loadADA(response.data.adaCompliance, url)
                });
                document.getElementById("cookies").addEventListener("click", (event) => {
                    event.preventDefault()
                    cookiesActive()
                    loadcookie(response.data.cookieDetails, url)
                });

                document.getElementById("ssl").hidden = (sslRequested) ? (false) : (true)
                document.getElementById("ada").hidden = (adaRequested) ? (false) : (true)
                document.getElementById("cookies").hidden = (cookieRequested) ? (false) : (true)
                document.getElementById("report").hidden = false
                
                if (sslRequested) {
                    sslActive()
                    loadSSL(response.data.securityDetails, url)
                } else if (adaRequested) {
                    adaActive()
                    loadADA(response.data.adaCompliance, url)
                } else if (cookieRequested) {
                    cookiesActive()
                    loadcookie(response.data.cookieDetails, url)
                }
            } else if (xhr.readyState == 4 && xhr.status != 200) {
                document.getElementById("home-search").innerHTML = `Search`
                throwError(JSON.parse(xhr.responseText));
            }
        }
    }
})

function throwError(msg) {
    let HTML = `<h2>${msg.message}</h2>`
    document.getElementById('compliance-data').innerHTML = HTML
}

document.getElementById("report").addEventListener("click", (ev) => {
    ev.preventDefault();
    var xhr = new XMLHttpRequest();
    xhr.open("POST", callURL + "report", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        ssl: sslRequested,
        ada: adaRequested,
        cookie: cookieRequested,
        jsondata: serverresponse,
        url
    }));
    console.log({
        ssl: sslRequested,
        ada: adaRequested,
        cookie: cookieRequested,
        jsondata: serverresponse,
        url
    });
    xhr.responseType = "blob";
    xhr.onload = function (event) {
        var blob = xhr.response;
        console.log(blob.size);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = "compliance-report-" + url + "-" + new Date().toDateString() + ".pdf";
        link.click();
    };
})