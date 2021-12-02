console.log("JS File loaded")

loadSSL = (data) =>{
    document.getElementById("compliance-data").innerText = JSON.stringify( data, undefined, 2);
}
loadcookie = (data) =>{
    document.getElementById("compliance-data").innerText = JSON.stringify( data, undefined, 2);
}
loadADA = (data) =>{
    document.getElementById("compliance-data").innerText = JSON.stringify( data, undefined, 2);
}

let form = document.getElementById("search-compliance");
form.addEventListener("submit",(event)=>{
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
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState == 4 && xhr.status == 200){
            let response = JSON.parse(xhr.responseText)
            console.log(response)
            document.getElementById("ssl").addEventListener("click",(event)=>{
                event.preventDefault()
                loadSSL(response.ssl)
            });
            document.getElementById("ada").addEventListener("click",(event)=>{
                event.preventDefault()
                loadSSL(response.data.adaCompliance)
            });
            document.getElementById("cookies").addEventListener("click",(event)=>{
                event.preventDefault()
                loadSSL(response.data.cookieDetails)
            });
        }
    }
})