let loadSSL = (data, url) => {
    let HTML = `<h1>SSL 📑 certificate and Expiry for <a href="http://${url}">${url}</a></h1>`
    if (data) {
        HTML += `<p>The certificate is valid upto: <span style="color:green">${moment(new Date(data._validTo * 1000)).format('MMMM Do YYYY, h:mm:ss a')}</span></p>`
        HTML += `<p>Certificate expires <span style="color:red">${moment(new Date(data._validTo * 1000)).startOf('day').fromNow()}</span></p>`
        HTML += `<p>Issued to: <b>${data._subjectName}</b></p>`
        HTML += `<p>Issued By:<b> ${data._issuer}</b></p>`
        HTML += `<p>Protocol Followed: <b>${data._protocol}</b></p>`
    } else {
        HTML += `<h2 style="color:red"><b>This cite has no SSL certificate!!! It is not secure as of now.</b></h2>`
    }

    document.getElementById('compliance-data').innerHTML = HTML;
}
