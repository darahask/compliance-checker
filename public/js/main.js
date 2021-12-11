console.log("JS File loaded")

document.getElementById("search-url").addEventListener('keyup', (event) => {
    if (event.target.value === '') {
        document.getElementById('search').classList.add("disabled");
        // console.log("worked")
    } else {
        document.getElementById('search').classList.remove("disabled");
        // console.log("not worked")
    }
})

document.getElementById("home-search-url").addEventListener('keyup', (event) => {
    if (event.target.value === '') {
        document.getElementById('home-search').classList.add("disabled");
        // console.log("worked")
    } else {
        document.getElementById('home-search').classList.remove("disabled");
        // console.log("not worked")
    }
})

let callURL = "http://localhost:3333/api/compliance"
let form = document.getElementById("search-compliance");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputtext = document.getElementById('search-url').value;
    let url = urlCleaner(inputtext);
    console.log(url);

    document.getElementById("search").innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
    var xhr = new XMLHttpRequest();
    xhr.open("POST", callURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        ssl: document.getElementById("sslRequested").disabled,
        ada: document.getElementById("adaRequested").disabled,
        cookie: document.getElementById("cookieRequested").disabled,
        searchUrl: url
    }));
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("search").innerHTML = `Search`
            let response = JSON.parse(xhr.responseText)
            sslActive()
            loadSSL(response.data.securityDetails, url)
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

    document.getElementById("home-search").innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`
    var xhr = new XMLHttpRequest();
    xhr.open("POST", callURL, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        ssl: document.getElementById("sslRequested").checked,
        ada: document.getElementById("adaRequested").checked,
        cookie: document.getElementById("cookieRequested").checked,
        searchUrl: url
    }));
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            document.getElementById("home-search").innerHTML = `Search`
            let response = JSON.parse(xhr.responseText)
            sslActive()
            loadSSL(response.data.securityDetails, url)
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
        } else {
            document.getElementById("home-search").innerHTML = `Search`
        }
    }
})