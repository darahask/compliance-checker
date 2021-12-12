const suggestionColor = 'blue', errorColor = 'red', positiveColor = 'green'
function sanitizer() {
    document.getElementById("home-search-url").addEventListener('keyup', (event) => {
        if (event.target.value === '') {
            document.getElementById('home-search').classList.add("disabled");
            // console.log("worked")
        } else {
            document.getElementById('home-search').classList.remove("disabled");
            // console.log("not worked")
        }
    })
}

function urlCleaner(url) {
    return url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
}

function sslActive() {
    document.getElementById("ssl").classList.add("active")
    document.getElementById("cookies").classList.remove("active")
    document.getElementById("ada").classList.remove("active")
}

function adaActive() {
    document.getElementById("ssl").classList.remove("active")
    document.getElementById("cookies").classList.remove("active")
    document.getElementById("ada").classList.add("active")
}

function cookiesActive() {
    document.getElementById("ssl").classList.remove("active")
    document.getElementById("cookies").classList.add("active")
    document.getElementById("ada").classList.remove("active")
}

function syntaxHighlight(json) {
    if (typeof (json) != 'string') {
        json = JSON.stringify(json, function (k, v) {
            if (v instanceof Array)
                return JSON.stringify(v);
            return v;
        }, 2).replace(/\\/g, '')
            .replace(/\"\[/g, '[')
            .replace(/\]\"/g, ']')
            .replace(/\"\{/g, '{')
            .replace(/\}\"/g, '}');
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