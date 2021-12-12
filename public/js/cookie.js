let loadcookie = (data, url) => {
    let HTML = `<h1>🍪 Cookie Consent and 👀 Cookie details for <a href="http://${url}">${url}</a></h1>`;
    if (data) {
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
                    <p><b>Session: </b>${(!cookie.session) ? ("❌false") : ("✅true")}</p>
                    <p><b>Secure: </b>${(!cookie.secure) ? ("❌false") : ("✅true")}</p>
                    <p><b>HTTP only: </b>${(!cookie.httpOnly) ? ("❌false") : ("✅true")}</p>
                    <p><b>Domain: </b>${cookie.domain}</p>
                    <p><b>Expires at: </b>${(cookie.expires!==-1) ? (moment(new Date(cookie.expires * 1000)).format('MMMM Do YYYY, h:mm:ss a')) : "<span style='color:red'>Exists only for the current session</span>"}</p>
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
        } else {
            HTML += `<h2>❌ The Website does not use any cookies 🍪</h2>`
        }

        // HTML += `<pre>${JSON.stringify(data.cookieInfo.cookies,undefined,1)}</pre>`
    }else{
        HTML += `<h2 style="color:red"><b>Could not get the cookie details for this site, please refer back later.</b></h2>`
    }

    document.getElementById('compliance-data').innerHTML = HTML;
}
