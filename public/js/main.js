console.log("JS File loaded")

loadSSL = (data) => {
    document.getElementById("compliance-data").innerText = JSON.stringify(data, undefined, 2);
}
loadcookie = (data) => {
    document.getElementById("compliance-data").innerText = JSON.stringify(data, undefined, 2);
}
loadADA = (data) => {
    let contrastHTML = '';
    data.contrast.forEach(element => {
        contrastHTML += `
        <div class="row m-2 border border-dark"> 
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
                <div class="row">Text: <pre>${element["innerHTML"]}</pre></div>
                <div class="row">Parent: <pre>${element["outerHTML"]}</pre></div>
            </div>
            <h3>Suggestions:</h3>
            <br>
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
        `
    });
    document.getElementById('compliance-data').innerHTML = contrastHTML;
}

let form = document.getElementById("search-compliance");
form.addEventListener("submit", (event) => {
    event.preventDefault();
    let inputtext = document.getElementById('search-url');
    let url = inputtext.value;
    console.log(url);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3333/api/compliance", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify({
        searchUrl: url
    }));
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
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
                loadSSL(response.data.cookieDetails)
            });
        }
    }
})