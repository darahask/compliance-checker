let loadSSL = (data, url) => {
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

}